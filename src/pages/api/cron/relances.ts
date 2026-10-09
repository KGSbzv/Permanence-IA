// Passage horaire des relances (Cloud Scheduler « 0 * * * * », ou appel manuel) : POST protégé par l’en-tête
// x-cron-token (CRON_SECRET) ou par le jeton OIDC du planificateur. Coupé par défaut et en mode test par défaut :
// voir src/lib/relances/config.ts. Corps facultatif { "dryRun": true } : force le mode test (jamais l’inverse).
// Après les relances, et quoi qu’elles aient donné (coupées, mode test, erreur) : résumé hebdomadaire à l’équipe le
// lundi à partir de 8 h, heure de Paris (src/lib/relances/weekly.ts), avec son propre try/catch et un délai maximal.
// Mise en route (9 oct.) : lecture quotidienne des agents des comptes suivis et solde de l’agence, avec la même clé
// AUTOCALLS_API_KEY (src/lib/relances/activity.ts) ; sans elle, la série A attend et rien n’est inventé.
// Action 16 (9 oct.) : un passage qui finit en « not_installed », « error » ou « halted » est journalisé en gravité ERROR.
import type { NextApiRequest, NextApiResponse } from 'next';
import { NOTIFY_TO, PREF_DB, dbInsert, dbSelect, dbUpdate, sendMail } from '@/lib/server';
import { emailKey, saveEmailPref } from '@/lib/emailPrefs';
import { accountActivityFetcher, agencyBalanceFetcher } from '@/lib/relances/activity';
import { logError } from '@/lib/log';
import { isCronAuthorized } from '@/lib/relances/auth';
import { platformUsersFetcher } from '@/lib/relances/autocalls';
import { readConfig } from '@/lib/relances/config';
import { relancesContent } from '@/lib/relances/content';
import { runRelances } from '@/lib/relances/engine';
import { imapConfig, readInbound } from '@/lib/relances/imap';
import { SUPABASE_STORE } from '@/lib/relances/store';
import { sendWeeklyIfDue, type WeeklyResult } from '@/lib/relances/weekly';

// Le passage peut durer (3 s entre deux envois réels, 20 au plus, soit environ une minute) : la réponse attend la fin
// (Cloud Scheduler : attempt-deadline de 300 s).
let running = false;
const WEEKLY_TIMEOUT_MS = 60_000;
const notifyTeam = async (subject: string, text: string, html?: string) => { await sendMail({ to: NOTIFY_TO, category: 'internal', subject, text, html }); };

/** Résumé hebdomadaire : jamais d’erreur remontée, au plus 60 s (la réponse au planificateur n’attend pas plus). */
async function weekly(): Promise<WeeklyResult | 'error' | 'timeout'> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      sendWeeklyIfDue({ select: dbSelect, insert: (table, row) => dbInsert(table, row, true), update: dbUpdate, notifyTeam, now: () => new Date() }),
      new Promise<'timeout'>((resolve) => { timer = setTimeout(() => resolve('timeout'), WEEKLY_TIMEOUT_MS); }),
    ]);
  } catch (e: any) {
    console.error('[résumé hebdo]', e?.message);
    return 'error';
  } finally { clearTimeout(timer); }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });
  if (!(await isCronAuthorized(req))) return res.status(401).json({ error: 'Non autorisé.' });
  // Un seul passage à la fois par instance (l’idempotence du journal protège entre instances).
  if (running) return res.status(409).json({ error: 'Passage déjà en cours.' });
  running = true;
  try {
    let result: Awaited<ReturnType<typeof runRelances>> | null = null;
    try {
      const imap = imapConfig();
      result = await runRelances({
        store: SUPABASE_STORE,
        sendMail,
        notifyTeam,
        platformUsers: platformUsersFetcher(),
        accountActivity: accountActivityFetcher(),
        agencyBalance: agencyBalanceFetcher(),
        inbound: imap ? readInbound(imap, process.env.ZOHO_SMTP_USER || NOTIFY_TO) : undefined,
        // Désinscription reçue par e-mail : même préférence que le lien de désinscription (call_events kind email_pref).
        saveEmailPref: (email, source) => saveEmailPref(email, 'essential_only', source, PREF_DB),
        content: relancesContent,
        emailKey,
        now: () => new Date(),
        sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
        config: readConfig(),
      }, { forceDryRun: req.body?.dryRun === true });
    } catch (e: any) {
      console.error('[relances]', e.message);
    }
    // Base illisible (tables absentes, clé révoquée), Stripe illisible ou disjoncteur des rejets : gravité ERROR, vue
    // par l’alerte d’erreurs Google Cloud (docs/journaux-et-alertes.md). Le passage suivant réessaie de lui-même.
    if (result && (result.status === 'not_installed' || result.status === 'error' || result.status === 'halted')) {
      logError('relances', `passage terminé en « ${result.status} »${result.reason ? ` (${result.reason})` : ''}`, { status: result.status, dry_run: result.dryRun });
    }
    // Toujours après les relances : il ne les retarde ni ne les bloque.
    const summary = await weekly();
    if (!result) return res.status(500).json({ error: 'Passage interrompu.', weekly: summary });
    return res.status(200).json({ ...result, weekly: summary });
  } finally {
    running = false;
  }
}

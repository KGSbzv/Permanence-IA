// Passage horaire des relances (Cloud Scheduler « 0 * * * * », ou appel manuel) : POST protégé par l’en-tête
// x-cron-token (CRON_SECRET) ou par le jeton OIDC du planificateur. Coupé par défaut et en mode test par défaut :
// voir src/lib/relances/config.ts. Corps facultatif { "dryRun": true } : force le mode test (jamais l’inverse).
import type { NextApiRequest, NextApiResponse } from 'next';
import { NOTIFY_TO, sendMail } from '@/lib/server';
import { emailKey } from '@/lib/emailPrefs';
import { isCronAuthorized } from '@/lib/relances/auth';
import { platformUsersFetcher } from '@/lib/relances/autocalls';
import { readConfig } from '@/lib/relances/config';
import { relancesContent } from '@/lib/relances/content';
import { runRelances } from '@/lib/relances/engine';
import { imapConfig, readInbound } from '@/lib/relances/imap';
import { SUPABASE_STORE } from '@/lib/relances/store';

// Le passage peut durer (3 s entre deux envois réels, 20 au plus, soit environ une minute) : la réponse attend la fin
// (Cloud Scheduler : attempt-deadline de 300 s).
let running = false;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });
  if (!(await isCronAuthorized(req))) return res.status(401).json({ error: 'Non autorisé.' });
  // Un seul passage à la fois par instance (l’idempotence du journal protège entre instances).
  if (running) return res.status(409).json({ error: 'Passage déjà en cours.' });
  running = true;
  try {
    const imap = imapConfig();
    const result = await runRelances({
      store: SUPABASE_STORE,
      sendMail,
      notifyTeam: async (subject, text, html) => { await sendMail({ to: NOTIFY_TO, category: 'internal', subject, text, html }); },
      platformUsers: platformUsersFetcher(),
      inbound: imap ? readInbound(imap, process.env.ZOHO_SMTP_USER || NOTIFY_TO) : undefined,
      content: relancesContent,
      emailKey,
      now: () => new Date(),
      sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
      config: readConfig(),
    }, { forceDryRun: req.body?.dryRun === true });
    return res.status(200).json(result);
  } catch (e: any) {
    console.error('[relances]', e.message);
    return res.status(500).json({ error: 'Passage interrompu.' });
  } finally {
    running = false;
  }
}

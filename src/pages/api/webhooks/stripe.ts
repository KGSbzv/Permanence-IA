// Webhook Stripe du compte Permanence IA (essais, abonnements, paiements) pour les relances : signature vérifiée
// sur le corps brut avec STRIPE_WEBHOOK_SECRET, sinon 401 ; état enregistré par client (src/lib/relances/stripe.ts).
// Réponse rapide : quelques écritures en base, puis 200. Base indisponible : 503 (Stripe renverra l’événement) ;
// tables pas encore créées : 200 sans enregistrement et alerte à l’équipe (une par heure).
import type { NextApiRequest, NextApiResponse } from 'next';
import { alertTeam, dbInsertIfNew, dbSelect, dbUpdate } from '@/lib/server';
import { applyStripeEvent, stripeCustomerFetcher, stripeCustomerLocaleSetter, verifyStripeSignature, type StripeDb } from '@/lib/relances/stripe';
import { emailKey } from '@/lib/emailPrefs';
import { isLocale } from '@/i18n/locales';

// Corps brut indispensable à la vérification de la signature.
export const config = { api: { bodyParser: false } };

const MAX_BODY = 1_000_000;
const DB: StripeDb = { insertIfNew: dbInsertIfNew, update: dbUpdate, select: dbSelect };

function readRaw(req: NextApiRequest) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on('data', (c: Buffer) => {
      size += c.length;
      if (size > MAX_BODY) { reject(new Error('too_large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

// Langue des factures Stripe : celle de la fiche contact du site (clé STRIPE_CUSTOMERS_KEY absente : rien n’est écrit).
async function contactLocale(email: string) {
  const rows = await dbSelect<{ locale: string | null }>('contacts', `select=locale&email_key=eq.${emailKey(email)}&locale=not.is.null&limit=1`);
  return isLocale(rows[0]?.locale) ? rows[0].locale : null;
}

const missingTable = (e: unknown) => /PGRST205|42P01|\b404\b/.test(String((e as Error)?.message ?? e));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return res.status(503).json({ error: 'Webhook non configuré.' });

  let raw: Buffer;
  try { raw = await readRaw(req); } catch { return res.status(413).json({ error: 'Corps trop volumineux.' }); }
  if (!verifyStripeSignature(raw, req.headers['stripe-signature'], secret)) return res.status(401).json({ error: 'Signature invalide.' });

  let event: any;
  try { event = JSON.parse(raw.toString('utf8')); } catch { return res.status(400).json({ error: 'JSON invalide.' }); }
  try {
    const setLocale = stripeCustomerLocaleSetter();
    const { handled } = await applyStripeEvent(event, DB, stripeCustomerFetcher(), setLocale && { lookup: contactLocale, set: setLocale });
    return res.status(200).json({ received: true, handled });
  } catch (e: any) {
    if (missingTable(e)) {
      console.warn('[stripe] tables absentes — exécuter supabase/migrations/20261008_relances_moteur.sql');
      await alertTeam('stripe-tables', 'Webhook Stripe : tables absentes', 'Les événements Stripe arrivent mais ne sont pas enregistrés : exécuter supabase/migrations/20261008_relances_moteur.sql dans Supabase.');
      return res.status(200).json({ received: true, stored: false });
    }
    console.error('[stripe] enregistrement:', e.message);
    return res.status(503).json({ error: 'Enregistrement indisponible, réessayez.' });
  }
}

// Collecte légère avant la création du compte (/essai-gratuit) : email, langue du site, page d’origine, UTM et
// case marketing (décochée par défaut). Rien n’est envoyé ; la fiche contact garde la langue (site_form), lue par
// le webhook d’inscription et par les relances (sinon un inscrit sans formulaire reste « langue à valider »).
//
// POST { email, locale, origin: 'trial_signup', name?, company?, sector?, marketingEmail, originPage, referrer, utm }
import type { NextApiRequest, NextApiResponse } from 'next';
import { isLocale } from '@/i18n/locales';
import { CONTACTS_DB, captureMeta, recordFormConsents, resolveLocale, upsertContact, type ContactOrigin } from '@/lib/contacts';
import { isValidEmail, normEmail } from '@/lib/emailPrefs';
import { clientIp } from '@/lib/server';

// Limite simple par adresse IP (par instance) : 20 envois par tranche de 10 minutes.
const hits = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 600_000);
  recent.push(now);
  hits.delete(ip);
  hits.set(ip, recent);
  while (hits.size > 5000) hits.delete(hits.keys().next().value as string);
  return recent.length > 20;
}

/** Provenances acceptées depuis le site (liste fermée). */
const ORIGINS: ContactOrigin[] = ['trial_signup'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });
  const ip = clientIp(req);
  if (tooMany(ip)) return res.status(429).json({ error: 'Trop de demandes, réessayez dans quelques minutes.' });
  const b = req.body || {};
  // Champ piège invisible : rempli uniquement par les robots. On répond « succès » sans rien faire.
  if (b.website) return res.status(200).json({ success: true });
  const email = normEmail(b.email);
  if (!isValidEmail(email)) return res.status(400).json({ error: 'Adresse email invalide.' });
  const origin = ORIGINS.find((o) => o === b.origin);
  if (!origin || !isLocale(b.locale)) return res.status(400).json({ error: 'Demande invalide.' });

  const resolved = resolveLocale({ siteLocale: b.locale });
  const meta = captureMeta(b);
  const marketingEmail = b.marketingEmail === true;
  const clip = (v: unknown, n: number) => (v == null || v === '' ? undefined : String(v).slice(0, n));
  // Fiche contact et journal des accords : jamais bloquants (sautés tant que la migration n’est pas faite).
  const key = await upsertContact(CONTACTS_DB, {
    email, name: clip(b.name, 120), company: clip(b.company, 160), sector: clip(b.sector, 80), resolved, origin, meta,
  });
  await recordFormConsents(CONTACTS_DB, {
    email, locale: resolved.locale, marketingEmail, marketingWhatsApp: false, source: `site:${origin}:${meta.origin_page || ''}`, ip,
  });
  return res.status(200).json({ success: true, stored: Boolean(key) });
}

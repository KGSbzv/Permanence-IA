// Préférences email (page /preferences-email) :
// POST { action: 'set', e, t, choice }               → enregistre le choix si le lien signé est valide
// POST { action: 'request_link', email, locale }      → envoie un lien signé à cette adresse ; réponse identique
//                                                       qu’il parte ou non (plafonds par adresse IP et par email)
// Sans lien signé, personne ne peut changer les préférences d’une autre adresse : seul son destinataire reçoit le lien.
import type { NextApiRequest, NextApiResponse } from 'next';
import { asLocale } from '@/i18n/locales';
import { decodeEmail, emailKey, isEmailPref, isValidEmail, normEmail, verifyEmailToken } from '@/lib/emailPrefs';
import { recordEmailPref, sendPrefsLinkMail } from '@/lib/emailPrefsApi';
import { clientIp, dbInsert, dbSelect } from '@/lib/server';

// Limites en mémoire (par instance), en complément des compteurs persistants plus bas.
const hits = new Map<string, number[]>();
function tooMany(key: string, max: number) {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < 15 * 60_000);
  recent.push(now);
  hits.delete(key);
  hits.set(key, recent);
  while (hits.size > 5000) hits.delete(hits.keys().next().value as string);
  return recent.length > max;
}

/** Compteurs persistants (table call_events, identifiant haché) sur 24 h, partagés par toutes les instances. */
async function countSent(kind: string, id: string) {
  const since = new Date(Date.now() - 86_400_000).toISOString();
  const rows = await dbSelect('call_events', `select=id&kind=eq.${kind}&external_id=eq.${emailKey(id)}&created_at=gte.${since}&limit=20`);
  return rows.length;
}
const logSent = (kind: string, id: string) => dbInsert('call_events', { kind, external_id: emailKey(id) });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const b = req.body || {};

  if (b.action === 'set') {
    const email = decodeEmail(b.e);
    if (!email || !verifyEmailToken(email, b.t)) return res.status(403).json({ ok: false });
    if (!isEmailPref(b.choice)) return res.status(400).json({ ok: false });
    if (tooMany(`set:${email}`, 20)) return res.status(429).json({ ok: false });
    try {
      await recordEmailPref(email, b.choice, 'page des préférences');
      return res.status(200).json({ ok: true, pref: b.choice });
    } catch (e: any) {
      console.error('[email-pref] set:', e.message);
      return res.status(503).json({ ok: false });
    }
  }

  if (b.action === 'request_link') {
    const ip = clientIp(req);
    if (tooMany(`ip:${ip}`, 5) || tooMany('all', 200)) return res.status(429).json({ ok: false });
    // Champ caché rempli par les robots : réponse normale, aucun envoi.
    if (b.website) return res.status(200).json({ ok: true });
    const email = normEmail(b.email);
    if (!isValidEmail(email)) return res.status(400).json({ ok: false, invalid: true });
    try {
      // Au plus 3 liens par adresse et 10 par adresse IP sur 24 h.
      if (!tooMany(`mail:${email}`, 2) && (await countSent('email_pref_ip', `ip|${ip}`)) < 10 && (await countSent('email_pref_mail', email)) < 3) {
        await Promise.all([logSent('email_pref_ip', `ip|${ip}`), logSent('email_pref_mail', email)]);
        await sendPrefsLinkMail(email, asLocale(b.locale));
      }
    } catch (e: any) { console.error('[email-pref] lien:', e.message); }
    return res.status(200).json({ ok: true });
  }

  return res.status(400).json({ ok: false });
}

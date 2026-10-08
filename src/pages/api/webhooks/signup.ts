// Webhook « User Signup » de l’espace white-label : enregistre le nouveau client et prévient l’équipe.
// L’essai (14 jours, 30 minutes) est géré nativement par la plateforme à la première souscription.
import type { NextApiRequest, NextApiResponse } from 'next';
import { NOTIFY_TO, dbInsertIfNew, isAuthorized, sendMail } from '@/lib/server';
import { CONTACTS_DB, advanceStage, resolveLocale, selectWithFallback, updateQuietly, upsertContact, type ResolvedLocale } from '@/lib/contacts';
import { isLocale } from '@/i18n/locales';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });
  if (!isAuthorized(req)) return res.status(401).json({ error: 'Jeton invalide.' });

  const { name, email, created_at } = req.body || {};
  // Champs éventuels du webhook (non garantis par Autocalls) : identifiant du compte et téléphone.
  const b = req.body || {};
  const userId = String(b.user_id ?? b.id ?? b.user?.id ?? '').slice(0, 64) || null;
  const phone = /^\+\d{8,15}$/.test(String(b.phone || '').replace(/[\s.\-()]/g, '')) ? String(b.phone).replace(/[\s.\-()]/g, '') : null;
  if (!email) return res.status(400).json({ error: 'Email manquant.' });

  // Idempotence : l’équipe n’est prévenue qu’à la première réception de cette inscription.
  let isNew = false;
  try {
    isNew = await dbInsertIfNew('signups', { email: String(email).toLowerCase(), name: name || null, signed_up_at: created_at || new Date().toISOString() }, 'email');
  } catch (e: any) {
    console.error('[signup] supabase:', e.message);
    return res.status(503).json({ error: 'Enregistrement indisponible, réessayez.' }); // Autocalls renverra le webhook
  }
  if (!isNew) return res.status(200).json({ received: true, duplicate: true });

  // Contexte pour la mise en route : dernière demande de rappel faite avec le même email (activité, besoins,
  // note lue par l’agent). Aucun agent n’est préconfiguré dans le compte du client sans son accord.
  // Colonnes de langue et de provenance lues si la migration des relances est faite.
  const filter = `email=ilike.${encodeURIComponent(String(email).replace(/[*%,()]/g, '').replace(/_/g, '\\_'))}&order=created_at.desc&limit=1`;
  const [previous] = await selectWithFallback<{
    id: string; created_at: string; phone: string; company: string | null; sector: string | null; note: string | null;
    locale?: string | null; locale_source?: string | null; origin_page?: string | null;
  }>(CONTACTS_DB, 'callbacks', `select=id,created_at,phone,company,sector,note,locale,locale_source,origin_page&${filter}`, `select=id,created_at,phone,company,sector,note&${filter}`)
    .catch(() => []);
  // Langue de l’inscrit : celle de sa dernière demande sur le site (rapprochée par email), sinon à valider
  // (la page d’inscription de l’app ne transmet ni langue ni provenance).
  const resolved: ResolvedLocale = previous && isLocale(previous.locale)
    ? { locale: previous.locale, locale_source: (previous.locale_source as ResolvedLocale['locale_source']) || 'site_form', locale_needs_review: false }
    : resolveLocale({ phone: phone || undefined });
  await Promise.all([
    updateQuietly(CONTACTS_DB, 'signups', `email=eq.${encodeURIComponent(String(email).toLowerCase())}`, {
      locale: resolved.locale, locale_source: resolved.locale_source, origin_page: previous?.origin_page || null,
      autocalls_user_id: userId, phone: phone || previous?.phone || null, matched_callback_id: previous?.id || null,
    }),
    upsertContact(CONTACTS_DB, { email, name, phone: phone || previous?.phone || null, resolved, origin: 'signup', keepOrigin: true, autocallsUserId: userId })
      .then(() => advanceStage(CONTACTS_DB, email, 'prospect', 'signed_up')),
  ]);
  const context = previous
    ? `\n\nDemande de rappel du ${previous.created_at.slice(0, 10)} avec cet email :\nTéléphone : ${previous.phone}\nEntreprise : ${previous.company || ''}\nSecteur : ${previous.sector || ''}\nNote : ${previous.note || ''}`
    : '';
  try {
    await sendMail({
      to: NOTIFY_TO, category: 'internal', subject: `Nouvelle inscription — ${name || email}`,
      text: `Nom : ${name || ''}\nEmail : ${email}\nInscrit le : ${created_at || ''}\nProchaine étape : choix d’un forfait (essai 14 jours / 30 minutes).${context}`,
    });
  } catch (e: any) { console.error('[signup] email:', e.message); }

  return res.status(200).json({ received: true });
}

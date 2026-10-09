// Webhook « User Signup » de l’espace white-label : enregistre le nouveau client et prévient l’équipe.
// L’essai (14 jours, 30 minutes) est géré nativement par la plateforme à la première souscription.
import type { NextApiRequest, NextApiResponse } from 'next';
import { NOTIFY_TO, dbInsertIfNew, isAuthorized, sendMail } from '@/lib/server';
import { stopRelancesLine } from '@/lib/relances/stopLink';
import { CONTACTS_DB, advanceStage, resolveLocale, selectWithFallback, updateQuietly, upsertContact, type ResolvedLocale } from '@/lib/contacts';
import { isLocale } from '@/i18n/locales';
import { emailKey, isValidEmail, normEmail } from '@/lib/emailPrefs';
import { stripPersonaMarks } from '@/lib/callbackPersona';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });
  // Seul appelant qui garde le jeton dans l’adresse (administration white-label, sans en-tête ni relais possible) :
  // secret dédié SIGNUP_WEBHOOK_TOKEN, seul accepté dans l’adresse quand WEBHOOK_ALLOW_QUERY_TOKEN=0.
  if (!isAuthorized(req, { querySecret: 'SIGNUP_WEBHOOK_TOKEN' })) return res.status(401).json({ error: 'Jeton invalide.' });

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
  // Fiche contact créée avant l’inscription (email laissé sur /essai-gratuit, /api/contact) : langue et page.
  let card: { locale?: string | null; locale_source?: string | null; origin_page?: string | null } | undefined;
  if (!(previous && isLocale(previous.locale))) {
    const norm = normEmail(email);
    let key: string | null = null;
    try { key = isValidEmail(norm) ? emailKey(norm) : null; } catch { key = null; }
    if (key) [card] = await CONTACTS_DB.select<NonNullable<typeof card>>('contacts', `select=locale,locale_source,origin_page&email_key=eq.${key}&limit=1`).catch(() => []);
  }
  // Langue de l’inscrit : celle de sa dernière demande sur le site (rapprochée par email), sinon celle de sa fiche
  // contact (formulaire d’avant inscription), sinon à valider (la page d’inscription de l’app ne la transmet pas).
  const resolved: ResolvedLocale = previous && isLocale(previous.locale)
    ? { locale: previous.locale, locale_source: (previous.locale_source as ResolvedLocale['locale_source']) || 'site_form', locale_needs_review: false }
    : card && isLocale(card.locale) && card.locale_source && card.locale_source !== 'unknown'
      ? { locale: card.locale, locale_source: card.locale_source as ResolvedLocale['locale_source'], locale_needs_review: false }
      : resolveLocale({ phone: phone || undefined });
  await Promise.all([
    updateQuietly(CONTACTS_DB, 'signups', `email=eq.${encodeURIComponent(String(email).toLowerCase())}`, {
      locale: resolved.locale, locale_source: resolved.locale_source, origin_page: previous?.origin_page || card?.origin_page || null,
      autocalls_user_id: userId, phone: phone || previous?.phone || null, matched_callback_id: previous?.id || null,
    }),
    upsertContact(CONTACTS_DB, { email, name, phone: phone || previous?.phone || null, resolved, origin: 'signup', keepOrigin: true, autocallsUserId: userId })
      .then(() => advanceStage(CONTACTS_DB, email, 'prospect', 'signed_up')),
  ]);
  // Marqueurs internes [VOICE:], [ROLE:] et [ASKED:] retirés de la note (comme dans l’e-mail de /api/callback).
  const context = previous
    ? `\n\nDemande de rappel du ${previous.created_at.slice(0, 10)} avec cet email :\nTéléphone : ${previous.phone}\nEntreprise : ${previous.company || ''}\nSecteur : ${previous.sector || ''}\nNote : ${stripPersonaMarks(previous.note) || ''}`
    : '';
  try {
    await sendMail({
      to: NOTIFY_TO, category: 'internal', subject: `Nouvelle inscription — ${name || email}`,
      // Lien signé « Arrêter les relances de ce contact » (vide sans secret) : arrêt sans toucher à la base.
      text: [`Nom : ${name || ''}\nEmail : ${email}\nInscrit le : ${created_at || ''}\nProchaine étape : choix d’un forfait (essai 14 jours / 30 minutes).${context}`, stopRelancesLine(email)].filter(Boolean).join('\n\n'),
    });
  } catch (e: any) { console.error('[signup] email:', e.message); }

  return res.status(200).json({ received: true });
}

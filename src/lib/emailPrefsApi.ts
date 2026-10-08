// Actions serveur des préférences email, partagées par /api/email/preferences, /api/email/unsubscribe et la
// page /preferences-email : enregistrement d’un choix (avec email à l’équipe) et envoi du lien personnel signé.
import type { Locale } from '@/i18n/locales';
import { MARKETS } from '@/i18n/markets';
import { emailText } from './emailFooter';
import { emailToken, prefsUrl, saveEmailPref, type EmailPref } from './emailPrefs';
import { NOTIFY_TO, PREF_DB, esc, sendMail } from './server';

/**
 * Enregistre le choix, puis prévient l’équipe : les emails envoyés hors du site (modèles Autocalls, outils
 * marketing) ne lisent pas cette préférence et doivent être mis à jour à la main. Lève une erreur si
 * l’enregistrement échoue ; l’email à l’équipe ne fait jamais échouer l’action.
 */
export async function recordEmailPref(email: string, pref: EmailPref, source: string) {
  await saveEmailPref(email, pref, source, PREF_DB);
  const label = pref === 'essential_only' ? 'désinscription des emails non essentiels' : 'réinscription à tous les emails';
  await sendMail({
    to: NOTIFY_TO, category: 'internal',
    subject: `Préférence email : ${label} — ${email}`,
    text: `Adresse : ${email}\nChoix : ${label}\nSource : ${source}\n\nÀ FAIRE si besoin : reporter ce choix dans les envois hors du site (Autocalls, outils marketing). Les emails du site le respectent déjà.`,
  }).catch((e) => console.error('[email-pref] email équipe:', e.message));
}

/** Email essentiel (demandé par la personne) contenant son lien personnel vers la page des préférences. */
export async function sendPrefsLinkMail(email: string, locale: Locale) {
  if (!emailToken(email)) throw new Error('ACCOUNT_CODE_SECRET absente : lien signé impossible');
  const brand = MARKETS[locale].brand;
  const t = emailText(locale).linkMail;
  const url = prefsUrl(email, locale);
  const rtl = locale === 'he';
  await sendMail({
    to: email, category: 'essential', locale, fromName: brand,
    subject: t.subject(brand),
    text: `${t.hello}\n\n${t.line(brand)}\n${url}\n\n${t.ignore}`,
    html: `<div dir="${rtl ? 'rtl' : 'ltr'}" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#1f2937;text-align:${rtl ? 'right' : 'left'}">`
      + `<p>${esc(t.hello)}</p><p>${esc(t.line(brand))}</p>`
      + `<p><a href="${esc(url).replace(/"/g, '&quot;')}" style="display:inline-block;background:#0f172a;color:#ffffff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold">${esc(t.button)}</a></p>`
      + `<p style="color:#6b7280">${esc(t.ignore)}</p></div>`,
  });
}

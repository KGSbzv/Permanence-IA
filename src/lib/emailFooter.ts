// Pied de page commun à tous les emails du site (texte et HTML) : copyright et marque, adresse de la société,
// liens personnels vers les préférences et la désinscription, conditions générales et confidentialité.
// Ajouté automatiquement par sendMail (src/lib/server.ts) ; textes dans src/i18n/content/<langue>/ui/email.ts.
import { SITE } from '@/data/site';
import { UI_EMAIL as EN } from '@/i18n/content/en/ui/email';
import { UI_EMAIL as FR } from '@/i18n/content/fr/ui/email';
import { UI_EMAIL as HE } from '@/i18n/content/he/ui/email';
import { UI_EMAIL as IT } from '@/i18n/content/it/ui/email';
import { UI_EMAIL as NL } from '@/i18n/content/nl/ui/email';
import { UI_EMAIL as PL } from '@/i18n/content/pl/ui/email';
import { DEFAULT_LOCALE, LANG_OF, isLocale, isRtl, type Locale } from '@/i18n/locales';
import { MARKETS } from '@/i18n/markets';
import { withFrenchTypography } from '@/i18n/typography';
import { genericPrefsUrl, legalUrl, normEmail, prefsUrl, unsubscribeUrl } from './emailPrefs';

const TEXT = { fr: withFrenchTypography(FR), en: EN, it: IT, pl: PL, nl: NL, he: HE };
/** Textes des emails (pied, page, email du lien) d’une locale. */
export const emailText = (locale: Locale) => TEXT[LANG_OF[locale]];

/** Locale du site à partir d’une langue reçue (« en », « en-AU », « he »…) ; undefined si inconnue. */
export function localeFromLang(raw: unknown): Locale | undefined {
  const s = String(raw ?? '').trim().toLowerCase().replace('_', '-');
  if (isLocale(s)) return s;
  const short = s.slice(0, 2);
  if (short === 'en') return s === 'en-au' || s === 'en-nz' ? 'en-au' : 'en-gb';
  if (short === 'iw') return 'he';
  return isLocale(short) ? short : undefined;
}

const escHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const fill = (s: string, v: Record<string, string>) => s.replace(/\{(\w+)\}/g, (m, k) => v[k] ?? m);

const LINK = 'color:#6b7280;text-decoration:underline';

function footerFor(email: string, locale: Locale, opts: { generic?: boolean }) {
  const t = emailText(locale).footer;
  const vars = { year: String(new Date().getFullYear()), company: SITE.company, brand: MARKETS[locale].brand };
  // Sans jeton (modèle Autocalls, secret absent) : page générique, qui envoie un lien signé à l’adresse saisie.
  const prefs = opts.generic ? genericPrefsUrl(locale) : prefsUrl(email, locale);
  const unsub = (opts.generic ? null : unsubscribeUrl(email, locale)) ?? prefs;
  const terms = legalUrl(locale, 'cgu');
  const privacy = legalUrl(locale, 'confidentialite');
  const colon = LANG_OF[locale] === 'fr' ? ' :' : ':';
  const shown = normEmail(email);

  const sentenceText = ([a, link, b]: [string, string, string], url: string) =>
    `${fill(a, { email: shown })}${link}${b}`.replace(/\.$/, '').replace(/ {2,}/g, ' ') + `${colon} ${url}`;
  const text = [
    '-- ',
    fill(t.copyright, vars),
    fill(t.brandOf, vars),
    SITE.address,
    '',
    t.question,
    sentenceText(shown ? t.manage : t.manageNoEmail, prefs),
    sentenceText(t.unsubscribe, unsub),
    '',
    `${t.terms}${colon} ${terms}`,
    `${t.privacy}${colon} ${privacy}`,
  ].join('\n');

  const rtl = isRtl(locale);
  // Adresse email et adresse postale toujours de gauche à droite, même dans un bloc en hébreu.
  const ltr = (s: string) => `<span dir="ltr">${escHtml(s)}</span>`;
  const a = (url: string, label: string) => `<a href="${escHtml(url)}" style="${LINK}">${escHtml(label)}</a>`;
  const sentenceHtml = ([before, link, after]: [string, string, string], url: string) =>
    escHtml(before).replace(/\{email\}/g, shown ? ltr(shown) : '').replace(/ {2,}/g, ' ') + a(url, link) + escHtml(after);
  const html = `<div dir="${rtl ? 'rtl' : 'ltr'}" lang="${locale}" style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#6b7280;text-align:${rtl ? 'right' : 'left'}">`
    + `<p style="margin:0 0 10px">${escHtml(fill(t.copyright, vars))}<br>${escHtml(fill(t.brandOf, vars))}<br>${ltr(SITE.address)}</p>`
    + `<p style="margin:0 0 10px">${escHtml(t.question)}<br>${sentenceHtml(shown ? t.manage : t.manageNoEmail, prefs)}<br>${sentenceHtml(t.unsubscribe, unsub)}</p>`
    + `<p style="margin:0">${a(terms, t.terms)} | ${a(privacy, t.privacy)}</p>`
    + '</div>';
  return { text, html };
}

/**
 * Pied de page pour un destinataire, dans une ou plusieurs langues (email bilingue : un bloc par langue,
 * les liens du premier bloc suffisent). `generic` : liens sans jeton (modèles d’emails hors du site).
 */
export function buildEmailFooter(email: string, locales: Locale | Locale[] = DEFAULT_LOCALE, opts: { generic?: boolean } = {}) {
  const list = (Array.isArray(locales) ? locales : [locales]).filter((l, i, all) => all.indexOf(l) === i);
  const blocks = (list.length ? list : [DEFAULT_LOCALE]).map((l) => footerFor(email, l, opts));
  return { text: blocks.map((b) => b.text).join('\n\n'), html: blocks.map((b) => b.html).join('') };
}

/** Corps HTML minimal pour un email envoyé en texte seul (liens du pied cliquables). */
export const textToHtml = (text: string, rtl = false) =>
  `<div dir="${rtl ? 'rtl' : 'ltr'}" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#1f2937;white-space:pre-wrap;text-align:${rtl ? 'right' : 'left'}">${escHtml(text)}</div>`;

/** Ajoute le pied à un corps HTML (fragment ou document complet). */
export const appendHtmlFooter = (html: string, footer: string) =>
  (/<\/body>/i.test(html) ? html.replace(/<\/body>/i, `${footer}</body>`) : `${html}${footer}`);

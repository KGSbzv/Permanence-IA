// Mise en forme d’une relance à partir du module de textes (src/i18n/content/<langue>/ui/relances.ts) :
// variables du contact remplacées, lien principal avec UTM, version texte et version HTML (le pied de page légal
// et la désinscription sont ajoutés ensuite par sendMail). Une variable obligatoire absente = étape sautée,
// jamais de valeur inventée.
import type { RelanceBlock, RelanceCtaTarget, RelanceMessage, RelancesContent } from '@/i18n/content/fr/ui/relances';
import { DEFAULT_LOCALE, isRtl, type Locale } from '@/i18n/locales';
import { SITE } from '@/data/site';

/** Variables du contact ; une valeur vide compte comme absente. */
export type RenderVars = Partial<Record<
  'first_name' | 'company' | 'source_line' | 'request_date' | 'sector_name' | 'sector_problem' | 'sector_handles'
  | 'trial_end_date' | 'minutes_left' | 'plan_name' | 'plan_price' | 'topic_title' | 'topic_paragraph', string | null>>;

export interface RenderedMail {
  subject: string;
  preheader: string;
  text: string;
  html: string;
  category: RelanceMessage['category'];
  skipIfEssentialOnly: boolean;
}

export type RenderResult = { ok: true; mail: RenderedMail } | { ok: false; reason: string };

/** Mot imposé en tête de l’objet d’un message publicitaire en Israël (loi sur les communications, art. 30A). */
export const HE_AD_PREFIX = 'פרסומת';

/** Adresse du lien principal, avec des UTM génériques (jamais de donnée personnelle dans l’adresse). */
export function ctaUrl(target: RelanceCtaTarget, locale: Locale, campaign: string) {
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  const base = {
    trial: `${SITE.url}${prefix}/essai-gratuit`,
    trial_assist: `${SITE.url}${prefix}/essai-gratuit`,
    pricing: `${SITE.url}${prefix}/tarifs`,
    app: SITE.appUrl,
    billing: `${SITE.appUrl}/billing`,
  }[target];
  const content = target === 'trial_assist' ? '&utm_content=accompagnement' : '';
  return `${base}?utm_source=relance&utm_medium=email&utm_campaign=${encodeURIComponent(campaign)}${content}`;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const PLACEHOLDER = /\{([a-z_]+)\}/g;

/** Remplace les variables connues ; {source_line} peut contenir {request_date} : deux passes. */
function fill(s: string, vars: RenderVars) {
  const once = (x: string) => x.replace(PLACEHOLDER, (m, k: keyof RenderVars) => (vars[k] ? String(vars[k]) : m));
  return once(once(s));
}

const blockText = (b: RelanceBlock) => {
  if (typeof b === 'string') return b;
  if ('ol' in b) return b.ol.map((x, i) => `${i + 1}. ${x}`).join('\n');
  return b.ul.map((x) => `- ${x}`).join('\n');
};
const P = 'margin:0 0 14px';
const blockHtml = (b: RelanceBlock) => {
  if (typeof b === 'string') return `<p style="${P}">${esc(b).replace(/\n/g, '<br>')}</p>`;
  const tag = 'ol' in b ? 'ol' : 'ul';
  const items = 'ol' in b ? b.ol : b.ul;
  return `<${tag} style="${P};padding-inline-start:22px">${items.map((x) => `<li style="margin:0 0 6px">${esc(x)}</li>`).join('')}</${tag}>`;
};

/**
 * Relance prête à passer à sendMail. `message` vient du texte de la langue (déjà construit avec les chiffres du
 * marché) ; `campaign` = nom de l’étape (P1, M2…), repris dans utm_campaign.
 */
export function renderMessage(o: {
  content: RelancesContent; message: RelanceMessage; locale: Locale; brand: string; vars: RenderVars; campaign: string;
}): RenderResult {
  const { content: { shared }, message: m, locale } = o;
  const vars: RenderVars = { ...o.vars, company: o.vars.company || shared.companyFallback };
  const named = Boolean(vars.first_name);

  let subject = m.subject;
  if (!named && subject.includes('{first_name}')) {
    if (!m.subjectNoName) return { ok: false, reason: 'missing_variable:first_name' };
    subject = m.subjectNoName;
  }
  const greeting = named ? shared.greeting.named : shared.greeting.anonymous;
  const cta = m.cta ? { label: m.cta.label, url: ctaUrl(m.cta.target, locale, o.campaign) } : null;
  const tail = [...(m.after ?? [])];
  const signature = [m.closing, shared.signature(o.brand)].filter(Boolean).join('\n');

  const parts = {
    subject: fill(subject, vars),
    preheader: fill(m.preheader, vars),
    greeting: fill(greeting, vars),
    body: m.body.map((b) => fillBlock(b, vars)),
    after: tail.map((b) => fillBlock(b, vars)),
    cta: cta ? { label: fill(cta.label, vars), url: cta.url } : null,
    signature: fill(signature, vars),
  };
  // Variable restée entre accolades : l’étape est sautée.
  const all = [parts.subject, parts.preheader, parts.greeting, parts.signature, parts.cta?.label ?? '', ...parts.body.map(blockText), ...parts.after.map(blockText)].join('\n');
  const missing = /\{([a-z_]+)\}/.exec(all);
  if (missing) return { ok: false, reason: `missing_variable:${missing[1]}` };

  // Le texte hébreu le porte déjà : ajouté seulement s’il manque (jamais en double, jamais sur un message de service).
  if (locale === 'he' && m.category === 'marketing' && !parts.subject.startsWith(HE_AD_PREFIX)) parts.subject = `${HE_AD_PREFIX}: ${parts.subject}`;

  const text = [
    parts.greeting,
    ...parts.body.map(blockText),
    ...(parts.cta ? [shared.ctaLine(parts.cta.label, parts.cta.url)] : []),
    ...parts.after.map(blockText),
    parts.signature,
  ].join('\n\n');

  const rtl = isRtl(locale);
  const button = parts.cta
    ? `<p style="margin:20px 0"><a href="${esc(parts.cta.url)}" style="display:inline-block;background:#0A7690;color:#ffffff;padding:11px 20px;border-radius:8px;text-decoration:none;font-weight:bold">${esc(parts.cta.label)}</a></p>`
    : '';
  const html = `<div dir="${rtl ? 'rtl' : 'ltr'}" lang="${locale}" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#0E1B4D;text-align:${rtl ? 'right' : 'left'};max-width:600px">`
    // Texte d’aperçu affiché après l’objet dans la boîte de réception, invisible dans le message.
    + `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(parts.preheader)}</div>`
    + `<p style="${P}">${esc(parts.greeting)}</p>`
    + parts.body.map(blockHtml).join('')
    + button
    + parts.after.map(blockHtml).join('')
    + `<p style="${P}">${esc(parts.signature).replace(/\n/g, '<br>')}</p>`
    + '</div>';

  return {
    ok: true,
    mail: { subject: parts.subject, preheader: parts.preheader, text, html, category: m.category, skipIfEssentialOnly: Boolean(m.skipIfEssentialOnly) },
  };
}

function fillBlock(b: RelanceBlock, vars: RenderVars): RelanceBlock {
  if (typeof b === 'string') return fill(b, vars);
  if ('ol' in b) return { ol: b.ol.map((x) => fill(x, vars)) };
  return { ul: b.ul.map((x) => fill(x, vars)) };
}

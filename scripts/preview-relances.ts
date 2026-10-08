// Aperçus des relances (aucun envoi, aucune base réelle) :
//   npx tsx scripts/preview-relances.ts [dossier de sortie]   (par défaut docs/relances/apercus)
// Écrit chaque message de chaque série (P, I, C, F, U, M) dans les 7 langues, tel que le moteur l’enverrait :
// mêmes textes (src/i18n/content/<langue>/ui/relances.ts), mêmes chiffres du marché (buildRelanceFacts),
// même mise en forme (renderMessage) et même préparation que sendMail (prepareMail : pied de page légal,
// en-têtes de désinscription), sans jamais appeler sendMail. Contact fictif : Camille Martin, Plomberie Martin,
// secteur « services à domicile » du site, adresse en example.com. Un index.html relie tous les aperçus.
import { mkdirSync, rmSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

// Secret factice et fixe (aperçus identiques d’une exécution à l’autre ; liens signés sans valeur en production).
// SMTP et base retirés : même par erreur, rien ne peut partir ni être lu.
process.env.ACCOUNT_CODE_SECRET = 'apercu-des-relances-secret-factice-sans-valeur-en-production';
for (const k of ['ZOHO_SMTP_USER', 'ZOHO_SMTP_PASS', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']) delete process.env[k];

/** Contact fictif (aucune donnée réelle). */
const SAMPLE = { email: 'camille.martin@example.com', firstName: 'Camille', company: 'Plomberie Martin', sector: 'services-a-domicile' };
/** Dates fixes de l’exemple : demande de rappel et fin d’essai. */
const REQUEST_AT = new Date('2026-10-06T09:30:00Z');
const TRIAL_END = new Date('2026-10-22T09:30:00Z');
/** Minutes d’essai restantes affichées hors C4 (C4 prend le seuil d’envoi moins une minute). */
const MINUTES_LEFT = 18;

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

async function main() {
  const { getI18n } = await import('@/i18n');
  const { LOCALES, isRtl } = await import('@/i18n/locales');
  const { MARKETS } = await import('@/i18n/markets');
  const { buildRelanceFacts } = await import('@/i18n/content/fr');
  type RelanceKey = import('@/i18n/content/fr').RelanceKey;
  type RelanceMessage = import('@/i18n/content/fr').RelanceMessage;
  type RelanceOrigin = import('@/i18n/content/fr/ui/relances').RelanceOrigin;
  const { relancesContent } = await import('@/lib/relances/content');
  const { renderMessage } = await import('@/lib/relances/render');
  const { MARKET_TZ, MARKETING_HOURS, SERVICE_HOURS, dayMonth, longDate } = await import('@/lib/relances/calendar');
  const { STEPS, MONTHLY_STEPS, C4_MINUTES_LEFT, C5_DAYS_BEFORE_END } = await import('@/lib/relances/sequences');
  type StepDef = import('@/lib/relances/sequences').StepDef;
  const { prepareMail } = await import('@/lib/server');
  const { PAUSED_SECTORS } = await import('@/data/site');

  const out = resolve(process.argv[2] || join(process.cwd(), 'docs/relances/apercus'));
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });

  // Base factice pour prepareMail : aucune préférence enregistrée, rien n’est écrit.
  const fakeDb = { select: async () => [] as any[], insert: async () => undefined };

  /** Délai lisible d’une étape (calendrier de src/lib/relances/sequences.ts). */
  const delayOf = (s: StepDef, origin?: string) => {
    if (s.seq === 'M') return `J+${s.offsetDays} après la fin de la série ${origin}`;
    if (s.step === 'C4') return `Événement : ${C4_MINUTES_LEFT} minutes d’essai restantes ou moins`;
    if (s.step === 'C5') return `${C5_DAYS_BEFORE_END} jours avant la fin de l’essai`;
    return `J+${s.offsetDays} après l’entrée dans la série`;
  };
  const windowOf = (s: StepDef) => (s.service
    ? `${SERVICE_HOURS[0]} h–${SERVICE_HOURS[1]} h, tous les jours`
    : `${MARKETING_HOURS[0]} h–${MARKETING_HOURS[1]} h, jours ouvrés`);

  interface Entry { locale: string; seq: string; label: string; file: string | null; subject: string; category: string; delay: string; window: string; note: string }
  const entries: Entry[] = [];
  let written = 0;

  for (const locale of LOCALES) {
    const content = relancesContent(locale);
    if (!content) { console.error(`${locale} : textes absents`); process.exitCode = 1; continue; }
    const i18n = getI18n(locale);
    const facts = buildRelanceFacts(i18n);
    if (!facts) { console.error(`${locale} : chiffres du marché incomplets`); process.exitCode = 1; continue; }
    const tz = MARKET_TZ[locale];
    const nl = i18n.market.numberLocale;
    const sector = PAUSED_SECTORS.includes(SAMPLE.sector) ? undefined : i18n.c.sectors.find((s) => s.slug === SAMPLE.sector);
    if (!sector) throw new Error(`${locale} : secteur ${SAMPLE.sector} introuvable`);
    const plan = MARKETS[locale].plans.receptionniste;
    mkdirSync(join(out, locale), { recursive: true });

    // Mêmes calculs que varsFor (src/lib/relances/engine.ts), avec les valeurs du contact fictif.
    const varsOf = (step: StepDef, origin: RelanceOrigin) => {
      const topic = step.seq === 'M' ? content.monthly.topics[Number(step.step.slice(1)) - 1] : undefined;
      return {
        first_name: SAMPLE.firstName,
        company: SAMPLE.company,
        source_line: content.shared.sourceLine[origin],
        request_date: dayMonth(REQUEST_AT, nl, tz),
        sector_name: sector.name,
        sector_problem: sector.problems[0] ? content.shared.clause(sector.problems[0]) : null,
        sector_handles: sector.handles.length ? content.shared.list(sector.handles.slice(0, 3)) : null,
        trial_end_date: longDate(TRIAL_END, nl, tz),
        minutes_left: i18n.num(step.step === 'C4' ? C4_MINUTES_LEFT - 1 : MINUTES_LEFT),
        plan_name: i18n.c.offers.receptionniste.name,
        plan_price: plan.price ? i18n.money(plan.price) : null,
        topic_title: topic?.title ?? null,
        topic_paragraph: topic?.paragraph ?? null,
      };
    };

    const one = async (o: { step: StepDef; key: string; message: RelanceMessage | null; origin: RelanceOrigin; file: string; label: string; seqOrigin?: string; note?: string }) => {
      const base = { locale, seq: o.step.seq, label: o.label, delay: delayOf(o.step, o.seqOrigin), window: windowOf(o.step) };
      if (!o.message) {
        entries.push({ ...base, file: null, subject: '', category: '', note: 'étape sautée : chiffre du marché manquant' });
        return;
      }
      const rendered = renderMessage({ content, message: o.message, locale, brand: MARKETS[locale].brand, vars: varsOf(o.step, o.origin), campaign: o.step.step });
      if (!rendered.ok) {
        entries.push({ ...base, file: null, subject: '', category: o.message.category, note: `étape sautée : ${rendered.reason}` });
        return;
      }
      const mail = rendered.mail;
      // Exactement l’appel du moteur à sendMail, passé à prepareMail (pied de page et en-têtes) sans envoi.
      const prepared = await prepareMail({ to: SAMPLE.email, subject: mail.subject, text: mail.text, html: mail.html, category: mail.category, locale, fromName: MARKETS[locale].brand }, fakeDb);
      if (!prepared.message) throw new Error(`${locale} ${o.label} : non préparé (${prepared.skipped})`);
      const m = prepared.message;
      const notes = [o.note, mail.skipIfEssentialOnly ? 'sauté si la personne a choisi « e-mails essentiels seulement »' : '', o.step.needsStripe ? 'exige le webhook Stripe' : ''].filter(Boolean).join(' ; ');
      const rtl = isRtl(locale);
      const meta: [string, string][] = [
        ['De', `${MARKETS[locale].brand} <adresse d’envoi Zoho>`],
        ['À', m.to],
        ['Objet', m.subject],
        ['Aperçu', mail.preheader],
        ['Catégorie', mail.category],
        ['Délai', base.delay],
        ['Fenêtre d’envoi', base.window],
        ['Modèle', `${o.key} (${locale})`],
        ...(notes ? [['Remarques', notes] as [string, string]] : []),
        ...Object.entries(m.headers).map(([k, v]) => [k, String(v)] as [string, string]),
      ];
      const page = `<!doctype html>
<html lang="${locale}" dir="${rtl ? 'rtl' : 'ltr'}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>${esc(`${locale} ${o.label} — ${m.subject}`)}</title></head>
<body style="margin:0;background:#f3f4f6;padding:16px">
<div dir="ltr" lang="fr" style="max-width:640px;margin:0 auto 12px;font:13px/1.5 Arial,Helvetica,sans-serif;color:#374151;text-align:left">
<p style="margin:0 0 8px"><a href="../index.html">← Tous les aperçus</a> · <strong>Aperçu — rien n’a été envoyé</strong> (contact fictif)</p>
<table style="border-collapse:collapse;width:100%;background:#fff;border:1px solid #e5e7eb">${meta.map(([k, v]) => `<tr><th style="text-align:left;vertical-align:top;padding:4px 8px;white-space:nowrap;border-bottom:1px solid #f3f4f6">${esc(k)}</th><td dir="auto" style="padding:4px 8px;border-bottom:1px solid #f3f4f6;overflow-wrap:anywhere">${esc(v)}</td></tr>`).join('')}</table>
</div>
<div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;padding:20px">
${m.html}
</div>
<details dir="ltr" lang="fr" style="max-width:640px;margin:12px auto 0;font:13px Arial,Helvetica,sans-serif;color:#374151;text-align:left"><summary>Version texte</summary>
<pre dir="${rtl ? 'rtl' : 'ltr'}" lang="${locale}" style="white-space:pre-wrap;background:#fff;border:1px solid #e5e7eb;padding:12px;text-align:${rtl ? 'right' : 'left'}">${esc(m.text)}</pre>
</details>
</body>
</html>
`;
      writeFileSync(join(out, locale, o.file), page);
      written++;
      entries.push({ ...base, file: `${locale}/${o.file}`, subject: m.subject, category: mail.category, note: notes });
    };

    // Séries P, I, C, F, U : une page par étape ; P1 dans chaque provenance, P3 aussi en version générique.
    const origins = Object.keys(content.shared.sourceLine) as RelanceOrigin[];
    for (const seq of ['P', 'I', 'C', 'F', 'U'] as const) {
      for (const step of STEPS[seq]) {
        const n = step.step.slice(1);
        const key = step.key as RelanceKey;
        await one({ step, key, message: content.messages[key](facts), origin: 'callback_done', file: `${seq}-${n}.html`, label: step.step });
        if (key === 'P1') {
          for (const origin of origins.filter((x) => x !== 'callback_done')) {
            await one({ step, key, message: content.messages.P1(facts), origin, file: `${seq}-${n}-${origin}.html`, label: `P1 (${origin})`, note: `provenance ${origin}` });
          }
        }
        if (key === 'P3') {
          await one({ step, key: 'P3_generic', message: content.messages.P3_generic(facts), origin: 'callback_done', file: `${seq}-${n}-generique.html`, label: 'P3 (générique)', note: 'secteur inconnu ou en pause' });
        }
      }
    }
    // Suivi mensuel : version prospect (après P) et version espace client (après I, F ou U).
    for (const step of MONTHLY_STEPS) {
      const n = step.step.slice(1);
      await one({ step, key: 'M_prospect', message: content.monthly.prospect(facts), origin: 'callback_done', file: `M-${n}-prospect.html`, label: `${step.step} (prospect)`, seqOrigin: 'P' });
      await one({ step, key: 'M_account', message: content.monthly.account(facts), origin: 'callback_done', file: `M-${n}-compte.html`, label: `${step.step} (espace client)`, seqOrigin: 'I, F ou U' });
    }
  }

  // Index : un tableau par langue (objet, catégorie, délai, fenêtre, remarques).
  const SEQ_NAMES: Record<string, string> = {
    P: 'P — prospects', I: 'I — inscrits sans essai', C: 'C — essai en cours', F: 'F — essai annulé', U: 'U — comptes peu actifs', M: 'M — suivi mensuel',
  };
  const sections = LOCALES.map((locale) => {
    const rows = entries.filter((e) => e.locale === locale);
    const body = rows.map((e) => `<tr>
<td>${esc(SEQ_NAMES[e.seq] ?? e.seq)}</td>
<td>${e.file ? `<a href="${esc(e.file)}">${esc(e.label)}</a>` : esc(e.label)}</td>
<td dir="auto">${esc(e.subject || '—')}</td>
<td><span class="cat ${esc(e.category)}">${esc(e.category || '—')}</span></td>
<td>${esc(e.delay)}</td>
<td>${esc(e.window)}</td>
<td>${esc(e.note)}</td>
</tr>`).join('\n');
    return `<section id="${locale}"><h2>${esc(locale)} <small>${esc(MARKETS[locale].brand)} · ${rows.filter((r) => r.file).length} aperçus</small></h2>
<div class="wrap"><table><thead><tr><th>Série</th><th>Étape</th><th>Objet</th><th>Catégorie</th><th>Délai</th><th>Fenêtre</th><th>Remarques</th></tr></thead><tbody>
${body}
</tbody></table></div></section>`;
  }).join('\n');
  const index = `<!doctype html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Aperçus des relances</title>
<style>
body{margin:0;padding:16px;font:14px/1.5 Arial,Helvetica,sans-serif;color:#0E1B4D;background:#fff}
h1{font-size:22px;margin:0 0 6px}h2{font-size:18px;margin:28px 0 8px}h2 small{font-weight:normal;color:#6b7280;font-size:13px}
nav a{margin-right:10px}.wrap{overflow-x:auto}
table{border-collapse:collapse;width:100%;font-size:13px}th,td{border-bottom:1px solid #e5e7eb;padding:6px 8px;text-align:left;vertical-align:top}
th{background:#f9fafb;white-space:nowrap}.cat{padding:1px 6px;border-radius:4px;background:#f3f4f6}
.cat.marketing{background:#fef3c7}.cat.essential{background:#dcfce7}
</style></head>
<body>
<h1>Aperçus des relances</h1>
<p>Chaque message tel que le moteur l’enverrait (mise en forme et pied de page légal compris), pour un contact fictif : Camille Martin, Plomberie Martin, secteur « services à domicile ». Rien n’a été envoyé. Régénérer : <code>npx tsx scripts/preview-relances.ts</code>.</p>
<nav>${LOCALES.map((l) => `<a href="#${l}">${l}</a>`).join('')}</nav>
${sections}
</body>
</html>
`;
  writeFileSync(join(out, 'index.html'), index);
  const skipped = entries.filter((e) => !e.file);
  console.log(`${written} aperçus écrits dans ${out}${skipped.length ? `, ${skipped.length} étapes sautées :` : ''}`);
  for (const e of skipped) console.log(`  ${e.locale} ${e.label} : ${e.note}`);
}

main().catch((e) => { console.error(e); process.exit(1); });

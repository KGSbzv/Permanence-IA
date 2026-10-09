// Aperçus des relances (aucun envoi, aucune base réelle) :
//   npx tsx scripts/preview-relances.ts [dossier de sortie]   (par défaut docs/relances/apercus)
// Écrit chaque message de chaque série (P, I, C, F, U, M, et depuis le 9 oct. A « mise en route » et S « solde de
// minutes ») dans les 7 langues, tel que le moteur l’enverrait :
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
  type RelanceOrigin = import('@/i18n/content/fr/ui/relances').RelanceOrigin;
  const { relancesContent } = await import('@/lib/relances/content');
  // Mêmes fonctions que le moteur pour les variables et le choix du texte (aucune copie du calcul ici).
  const { varsFor, templateOf } = await import('@/lib/relances/engine');
  type Contact = import('@/lib/relances/selection').Contact;
  type Seq = import('@/lib/relances/types').Seq;
  const { renderMessage } = await import('@/lib/relances/render');
  const { MARKETING_HOURS, SERVICE_HOURS } = await import('@/lib/relances/calendar');
  const { STEPS, MONTHLY_STEPS, A_MONTHLY_STEPS, C4_MINUTES_LEFT, C5_DAYS_BEFORE_END, S_LOW_MINUTES } = await import('@/lib/relances/sequences');
  type StepDef = import('@/lib/relances/sequences').StepDef;
  type SubRow = import('@/lib/relances/types').StripeSubscriptionRow;
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
    if (s.seq === 'A' && s.key === 'A_monthly') return 'Tous les 30 jours après le début (abonné sans appel réel sur 30 jours)';
    if (s.seq === 'A') return `J+${s.offsetDays} après le début de l’essai, de l’abonnement ou du paiement à la minute`;
    if (s.key === 'S1') return `Événement : ${S_LOW_MINUTES} minutes ou moins (ou 15 % des minutes du forfait)`;
    if (s.key === 'S2') return 'Événement : solde de 0 minute';
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
    const sector = PAUSED_SECTORS.includes(SAMPLE.sector) ? undefined : i18n.c.sectors.find((s) => s.slug === SAMPLE.sector);
    if (!sector) throw new Error(`${locale} : secteur ${SAMPLE.sector} introuvable`);
    const plan = MARKETS[locale].plans.receptionniste;
    mkdirSync(join(out, locale), { recursive: true });

    // Contact fictif tel que le moteur le construit (src/lib/relances/selection.ts) : essai en cours (fin TRIAL_END),
    // forfait Réceptionniste au mois, instantané du compte du jour (minutes restantes).
    const now = new Date();
    const contactOf = (step: StepDef, origin: RelanceOrigin, withSector = true, sub: Partial<SubRow> = {}, minutes?: number): Contact => ({
      email: SAMPLE.email, key: 'apercu', firstName: SAMPLE.firstName, name: `${SAMPLE.firstName} Martin`, company: SAMPLE.company, sector: withSector ? SAMPLE.sector : null,
      phones: [], locale, localeSource: 'site_form', origin, requestAt: REQUEST_AT, prospectSince: REQUEST_AT, supportOpen: false, pausedSector: false,
      signup: null,
      platform: { userId: 'apercu', minutes: minutes ?? (step.step === 'C4' ? C4_MINUTES_LEFT - 1 : MINUTES_LEFT), credits: 0, createdAt: null, usage30: null, snapDate: now.toISOString().slice(0, 10), hadMinutes: true },
      subscriptions: [{
        subscription_id: 'sub_apercu', customer_id: null, status: 'trialing', trial_start: null, trial_end: TRIAL_END.toISOString(), canceled_at: null, ended_at: null,
        price_amount: plan.price ? Math.round(plan.price * 100) : null, currency: MARKETS[locale].currency, billing_interval: 'month', livemode: false,
        ...sub,
      }],
      hasPaid: false, hasCreditPurchase: false, preferredLocale: null, isTest: true, consents: [], pref: null, phoneOptout: false, stops: [],
    });

    const one = async (o: { step: StepDef; origin: RelanceOrigin; file: string; label: string; seqOrigin?: Seq; seqLabel?: string; generic?: boolean; note?: string; sub?: Partial<SubRow>; minutes?: number }) => {
      const base = { locale, seq: o.step.seq, label: o.label, delay: delayOf(o.step, o.seqLabel), window: windowOf(o.step) };
      const contact = contactOf(o.step, o.origin, !o.generic, o.sub, o.minutes);
      const tpl = templateOf(content, o.step, contact, locale, o.seqOrigin ?? o.step.seq, now);
      const message = tpl.build(facts);
      if (!message) {
        entries.push({ ...base, file: null, subject: '', category: '', note: 'étape sautée : chiffre du marché manquant' });
        return;
      }
      const rendered = renderMessage({ content, message, locale, brand: MARKETS[locale].brand, vars: varsFor(contact, locale, content, o.step, now), campaign: o.step.step });
      if (!rendered.ok) {
        entries.push({ ...base, file: null, subject: '', category: message.category, note: `étape sautée : ${rendered.reason}` });
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
        ['Modèle', `${tpl.key} (${locale})`],
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
        await one({ step, origin: 'callback_done', file: `${seq}-${n}.html`, label: step.step });
        if (step.key === 'P1') {
          for (const origin of origins.filter((x) => x !== 'callback_done')) {
            await one({ step, origin, file: `${seq}-${n}-${origin}.html`, label: `P1 (${origin})`, note: `provenance ${origin}` });
          }
        }
        if (step.key === 'P3') {
          // Secteur inconnu : le moteur choisit lui-même P3_generic.
          await one({ step, origin: 'callback_done', generic: true, file: `${seq}-${n}-generique.html`, label: 'P3 (générique)', note: 'secteur inconnu ou en pause' });
        }
        // Variantes choisies par le moteur d’après le solde ou l’abonnement Stripe (même étape dans le journal).
        if (step.key === 'C4') {
          await one({ step, origin: 'callback_done', file: `${seq}-${n}-epuise.html`, label: 'C4 (minutes épuisées)', note: 'solde de 0 minute : les appels sont déjà arrêtés', minutes: 0 });
        }
        if (step.key === 'C5') {
          const annual = plan.annualPrice ? Math.round(plan.annualPrice * 100) : null;
          await one({ step, origin: 'callback_done', file: `${seq}-${n}-annuel.html`, label: 'C5 (forfait annuel)', note: 'forfait annuel', sub: { billing_interval: 'year', price_amount: annual } });
          await one({ step, origin: 'callback_done', file: `${seq}-${n}-annule.html`, label: 'C5 (essai annulé)', note: 'annulation programmée : C2 à C4 ne partent pas', sub: { cancel_at_period_end: true } });
        }
        if (step.key === 'F1') {
          await one({ step, origin: 'callback_done', file: `${seq}-${n}-paiement-refuse.html`, label: 'F1 (paiement refusé)', note: 'essai terminé sur un paiement refusé', sub: { status: 'canceled', ended_at: TRIAL_END.toISOString(), cancellation_reason: 'payment_failed' } });
        }
      }
    }
    // Mise en route (série A) : conditions lues chaque jour (agents, numéro, appels) ; A3 pendant l’essai ou compte actif.
    for (const step of STEPS.A) {
      const n = step.step.slice(1);
      const condition = step.step === 'A4' ? 'agent créé, sans numéro ou sans appel réel' : 'aucun agent créé';
      await one({ step, origin: 'callback_done', file: `A-${n}.html`, label: step.step, note: condition });
      if (step.step === 'A3') {
        await one({ step, origin: 'callback_done', file: `A-${n}-compte-actif.html`, label: 'A3 (abonné ou paiement à la minute)', note: `${condition} ; hors essai`, sub: { status: 'active', trial_end: null } });
      }
    }
    await one({ step: A_MONTHLY_STEPS[0], origin: 'callback_done', file: 'A-mensuel.html', label: 'Suivi mensuel A (abonné)', note: '0 appel réel sur 30 jours ; 12 envois au plus', sub: { status: 'active', trial_end: null } });
    // Solde de minutes (série S) : abonné ou paiement à la minute (l’essai a C4).
    for (const step of STEPS.S) {
      const out = step.key === 'S2';
      await one({ step, origin: 'callback_done', file: `S-${step.step.slice(1)}.html`, label: out ? 'S2 (minutes épuisées)' : 'S1 (minutes basses)', note: 'une fois par baisse du solde', sub: { status: 'active', trial_end: null }, minutes: out ? 0 : 15 });
    }
    // Suivi mensuel : version prospect (après P) et version espace client (après I, F ou U).
    for (const step of MONTHLY_STEPS) {
      const n = step.step.slice(1);
      await one({ step, origin: 'callback_done', file: `M-${n}-prospect.html`, label: `${step.step} (prospect)`, seqOrigin: 'P', seqLabel: 'P' });
      await one({ step, origin: 'callback_done', file: `M-${n}-compte.html`, label: `${step.step} (espace client)`, seqOrigin: 'I', seqLabel: 'I, F ou U' });
    }
  }

  // Index : un tableau par langue (objet, catégorie, délai, fenêtre, remarques).
  const SEQ_NAMES: Record<string, string> = {
    P: 'P — prospects', I: 'I — inscrits sans essai', C: 'C — essai en cours', F: 'F — essai annulé', U: 'U — comptes peu actifs', M: 'M — suivi mensuel',
    A: 'A — mise en route', S: 'S — solde de minutes',
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

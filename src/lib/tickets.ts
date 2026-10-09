// Tickets de support : demandes de rappel de type « support » (table callbacks), numérotées T-XXXXXXXX (8 premiers
// caractères de l’identifiant). Audit du 9 oct. 2026, action 14 :
// - confirmation écrite au client : email essentiel dans sa langue (anglais si elle est inconnue), purement informatif
//   (numéro du ticket, ce qui va se passer), sans prix ni offre ; au plus 3 par adresse et 50 pour tout le site sur
//   24 h (un formulaire public ne doit pas servir à remplir la boîte d’un tiers) ; trace dans call_events (kind
//   'email', outcome 'confirmation_ticket', empreinte de l’adresse seulement). Coupure : TICKET_CONFIRMATION=0 ;
// - clôture : fin d’appel d’un agent de rappel du support avec l’issue « resolu » → les demandes de support encore
//   ouvertes de ce numéro, créées avant l’appel, passent à « done » (plus de blocage des relances commerciales, plus
//   d’appel par les automatisations encore en attente : /api/callback/check).
// L’issue « non_resolu » prévient l’équipe (« À traiter », src/pages/api/webhooks/autocalls.ts).
// Accès réseau passés en paramètre (helpers de src/lib/server.ts en production, faux en test).
import { createHash } from 'crypto';
import { isRtl, type Locale } from '@/i18n/locales';
import { MARKETS } from '@/i18n/markets';
import { CALLBACK_AGENTS, findRequester } from './callbackPersona';
import { emailText } from './emailFooter';
import { emailKey, isValidEmail, normEmail } from './emailPrefs';
import { dbInsert, dbSelect, dbUpdate, describeLocal, esc, sendMail, type MailOptions } from './server';

export const TICKET_MAIL_KIND = 'email';
export const TICKET_MAIL_OUTCOME = 'confirmation_ticket';
/** Confirmations par adresse sur 24 h. */
export const MAX_TICKET_MAILS_PER_ADDRESS = 3;
/** Confirmations pour tout le site sur 24 h. */
export const MAX_TICKET_MAILS_PER_DAY = 50;

/** Numéro de ticket lu à la personne et repris dans les emails : T- puis les 8 premiers caractères de l’identifiant. */
export const ticketNumber = (id: string) => `T-${String(id).replace(/-/g, '').slice(0, 8).toUpperCase()}`;

/** Agent de rappel du support (Lucie, Katie, Charlotte, Manuela, Lena, Emma, נועה), par identifiant ou UUID. */
export function isSupportCallbackAgent(aid: unknown) {
  const r = findRequester(aid);
  return Boolean(r && Object.values(CALLBACK_AGENTS).some((k) => [k.support.female, k.support.male].some((p) => p?.id === r.id)));
}

export interface TicketDeps {
  select: <T>(table: string, query: string) => Promise<T[]>;
  insert: (table: string, row: Record<string, unknown>) => Promise<unknown>;
  update: (table: string, query: string, patch: Record<string, unknown>) => Promise<void>;
  sendMail: (m: MailOptions) => Promise<boolean>;
  now: () => Date;
}

/** Accès de production ; remplaçables en test. */
export const ticketDeps: TicketDeps = {
  select: dbSelect, insert: (table, row) => dbInsert(table, row), update: dbUpdate,
  sendMail: (m) => sendMail(m), now: () => new Date(),
};

/**
 * Fin d’appel d’un agent de rappel du support avec l’issue « resolu » : demandes de support ouvertes (pending,
 * scheduled) de ce numéro, créées au plus tard au début de l’appel (`callStart`), passées à « done ». Une demande créée
 * pendant l’appel (nouveau ticket) reste ouverte. Renvoie les numéros de ticket clos.
 */
export async function closeResolvedTickets(phone: string, callStart: Date, deps: TicketDeps = ticketDeps): Promise<string[]> {
  const open = await deps.select<{ id: string }>('callbacks',
    `select=id&phone=eq.${encodeURIComponent(phone)}&type=eq.support&status=in.(pending,scheduled)&created_at=lte.${encodeURIComponent(callStart.toISOString())}&order=created_at.desc&limit=20`);
  const ids = (Array.isArray(open) ? open : []).map((r) => String(r?.id ?? '')).filter((id) => /^[0-9a-f-]{8,64}$/i.test(id));
  if (!ids.length) return [];
  await deps.update('callbacks', `id=in.(${ids.join(',')})&status=in.(pending,scheduled)`, { status: 'done' });
  return ids.map(ticketNumber);
}

/** Prénom sûr pour la formule d’appel : un seul mot de lettres (30 au plus), sinon formule sans prénom. */
function firstName(raw: unknown) {
  const first = String(raw ?? '').trim().split(/\s+/)[0] || '';
  if (/^(prospect|client|customer|lead|messenger|whatsapp)$/i.test(first)) return null;
  return new RegExp("^\\p{L}[\\p{L}\\p{M}'’-]{0,29}$", 'u').test(first) ? first : null;
}

export interface TicketMailInput {
  locale: Locale;
  name: string | null;
  ticket: string;
  /** Rappel automatique mis en file (sinon : une personne de l’équipe revient vers le client). */
  queued: boolean;
  /** Moment du rappel s’il est programmé (sinon « dès que possible »), et son fuseau. */
  callAt: Date | null;
  zone: string;
}

/**
 * Moment du rappel lu par le client, dans le fuseau de la demande. Australie (plusieurs fuseaux, fuseau de Sydney par
 * défaut) : heure sur 12 h et nom du fuseau (« Friday 16 October 2026 at 2:30 pm AEDT »), pour qu’un client de Perth
 * ou de Brisbane ne la lise pas comme son heure locale. Les autres marchés n’ont qu’un fuseau : format habituel.
 */
export function ticketCallAtText(at: Date, zone: string, locale: Locale) {
  if (locale !== 'en-au') return describeLocal(at, zone, locale);
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: zone, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short',
  }).format(at);
}

/** Texte et HTML de la confirmation (pied de page légal ajouté par sendMail). */
export function buildTicketMail(o: TicketMailInput) {
  const t = emailText(o.locale).ticketMail;
  const brand = MARKETS[o.locale].brand;
  const next = !o.queued ? t.team : o.callAt ? t.callAt(ticketCallAtText(o.callAt, o.zone, o.locale)) : t.asap;
  const paras = [t.hello(firstName(o.name)), t.recorded(o.ticket), next, t.reply, t.notYou, t.sign(brand)];
  const rtl = isRtl(o.locale);
  // Numéro du ticket en gras, isolé de droite à gauche pour l’hébreu.
  const html = paras.map((p) => `<p>${esc(p).replace(esc(o.ticket), `<b dir="ltr">${esc(o.ticket)}</b>`)}</p>`).join('');
  return {
    subject: t.subject(o.ticket, brand),
    text: paras.join('\n\n'),
    html: `<div dir="${rtl ? 'rtl' : 'ltr'}" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#1f2937;text-align:${rtl ? 'right' : 'left'}">${html}</div>`,
    fromName: brand,
  };
}

/** Empreinte de l’adresse (jamais l’adresse en clair dans call_events) ; sans secret, simple condensé. */
function addressKey(email: string) {
  try { return emailKey(email); } catch { return createHash('sha256').update(`ticket|${normEmail(email)}`).digest('hex').slice(0, 32); }
}

export type TicketMailResult = 'sent' | 'off' | 'invalid' | 'capped' | 'skipped';

/**
 * Envoie la confirmation du ticket à l’adresse donnée par la personne (formulaire du support, Lucie, agents). Ne lève
 * pas sur un plafond ; lève si l’envoi échoue (l’appelant journalise, la demande reste enregistrée).
 */
export async function sendTicketConfirmation(o: TicketMailInput & { email: string }, deps: TicketDeps = ticketDeps): Promise<TicketMailResult> {
  if (String(process.env.TICKET_CONFIRMATION ?? '').trim() === '0') return 'off';
  const email = normEmail(o.email);
  if (!isValidEmail(email)) return 'invalid';
  const key = addressKey(email);
  const since = new Date(deps.now().getTime() - 86_400_000).toISOString();
  const recent = `kind=eq.${TICKET_MAIL_KIND}&outcome=eq.${TICKET_MAIL_OUTCOME}&created_at=gte.${encodeURIComponent(since)}`;
  const [mine, all] = await Promise.all([
    deps.select('call_events', `select=id&${recent}&variables->>to_key=eq.${key}&limit=${MAX_TICKET_MAILS_PER_ADDRESS + 1}`),
    deps.select('call_events', `select=id&${recent}&limit=${MAX_TICKET_MAILS_PER_DAY + 1}`),
  ]);
  if (mine.length >= MAX_TICKET_MAILS_PER_ADDRESS || all.length >= MAX_TICKET_MAILS_PER_DAY) return 'capped';
  const m = buildTicketMail(o);
  let status = 'envoyee';
  let error: unknown = null;
  let ok = false;
  try {
    // Email essentiel : réponse à la demande de la personne, envoyé même après une désinscription.
    ok = await deps.sendMail({ to: email, category: 'essential', locale: o.locale, fromName: m.fromName, subject: m.subject, text: m.text, html: m.html });
    if (!ok) status = 'sautee';
  } catch (e) { status = 'echec'; error = e; }
  await deps.insert('call_events', {
    kind: TICKET_MAIL_KIND, external_id: `ticket-${o.ticket}`, outcome: TICKET_MAIL_OUTCOME, status,
    summary: `Confirmation du ticket ${o.ticket} (${o.locale})`, variables: { to_key: key, locale: o.locale, ticket: o.ticket },
  }).catch((e: any) => console.error('[ticket] trace :', e?.message));
  if (error) throw error;
  return ok ? 'sent' : 'skipped';
}

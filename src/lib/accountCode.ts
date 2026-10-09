// Code de vérification à 6 chiffres envoyé à l’email d’un compte de l’espace client, partagé par Lucie
// (/api/agent/account : la conseillère lit le dossier du client) et la page Mon compte (/api/account : le client
// consulte son forfait, son solde et ses factures).
// - Code = HMAC(ACCOUNT_CODE_SECRET, « <usage>|<email>|<créneau de 10 min>[|g<génération>] ») sur 6 chiffres : rien
//   n’est stocké, le créneau en cours et le précédent sont acceptés (10 à 20 minutes). L’usage (lucie, site) change le
//   code : un code reçu pour Lucie n’ouvre pas la page Mon compte, et inversement. La génération (codes acceptés depuis
//   20 minutes) change le code après chaque connexion réussie : un nouveau code demandé dans le même créneau n’est pas
//   celui déjà utilisé, et les codes envoyés avant ne servent plus.
// - Compteurs persistants dans call_events (identifiant haché, jamais l’adresse en clair), communs aux deux usages :
//   3 envois par heure, 5 essais par heure et 15 par jour par adresse, tous canaux confondus ; un code accepté ne
//   resservira pas. Aucun essai n’est accepté sans code réellement envoyé à l’adresse depuis 20 minutes : deviner un
//   code exige un email reçu par le titulaire, et aucune session ne s’ouvre pour une adresse sans compte.
// - Envoi en temps constant et réponse identique, que l’adresse ait un compte ou non (pas d’énumération).
// Base, recherche du compte et envoi de l’email sont passés en paramètre (src/lib/server.ts en production, faux en
// test) : ce module n’importe pas server.ts.
import { createHmac, timingSafeEqual } from 'crypto';
import type { Locale } from '@/i18n/locales';
import { isRtl } from '@/i18n/locales';
import { MARKETS } from '@/i18n/markets';
import { emailText } from './emailFooter';
import type { PrefDb } from './emailPrefs';

export type CodePurpose = 'lucie' | 'site';
/** Durée d’un créneau : un code reste valable 10 à 20 minutes. */
export const CODE_WINDOW_MS = 10 * 60_000;
/** Durée minimale de la réponse à une demande de code, que l’adresse ait un compte ou non. */
export const CODE_MIN_RESPONSE_MS = 6000;
/** Essais par adresse sur 24 h (en plus de la limite de 5 par heure). */
export const MAX_TRIES_PER_DAY = 15;

/** Secret dédié aux codes, distinct du jeton des webhooks ; sans lui, les codes ne fonctionnent pas. */
export function codeSecret() {
  const s = process.env.ACCOUNT_CODE_SECRET;
  if (!s || s.length < 32) throw new Error('ACCOUNT_CODE_SECRET absente ou trop courte');
  return s;
}

/** Identifiant haché d’une adresse (ou d’une clé « adresse|… ») dans call_events, irréversible sans le secret. */
export const otpKey = (id: string) => createHmac('sha256', codeSecret()).update(`id|${id}`).digest('hex').slice(0, 32);

/** Génération 0 : formule d’origine (celle de Lucie avant la mise en commun), inchangée. */
export function codeFor(email: string, slot: number, purpose: CodePurpose = 'lucie', gen = 0) {
  const n = createHmac('sha256', codeSecret()).update(`${purpose}|${email}|${slot}${gen ? `|g${gen}` : ''}`).digest().readUInt32BE(0) % 1_000_000;
  return String(n).padStart(6, '0');
}

export const currentCode = (email: string, purpose: CodePurpose, now = Date.now(), gen = 0) => codeFor(email, Math.floor(now / CODE_WINDOW_MS), purpose, gen);

/** Code du créneau en cours ou du précédent, pour cette génération (comparaison à temps constant). */
export function codeIsValid(email: string, code: string, purpose: CodePurpose = 'lucie', now = Date.now(), gen = 0) {
  const slot = Math.floor(now / CODE_WINDOW_MS);
  const got = Buffer.from(String(code).replace(/\D/g, ''));
  return [slot, slot - 1].some((s) => {
    const want = Buffer.from(codeFor(email, s, purpose, gen));
    return got.length === want.length && timingSafeEqual(got, want);
  });
}

/** Marqueur d’un code déjà accepté (celui de Lucie est inchangé) : un même code ne sert qu’une fois. */
export const usedCodeKey = (email: string, code: string, purpose: CodePurpose) =>
  (purpose === 'lucie' ? `${email}|code:${code}` : `${email}|site|code:${code}`);
/** Marqueur « code réellement envoyé » (identifiant distinct : ne compte pas dans les 3 envois par heure). */
export const sentCodeKey = (email: string, purpose: CodePurpose) => `${email}|${purpose}|sent`;
/** Marqueur posé à chaque code accepté : leur nombre sur 20 minutes donne la génération du code. */
export const codeGenKey = (email: string, purpose: CodePurpose) => `${email}|${purpose}|gen`;

/** otp_send : code envoyé ; otp_try : essai ; otp_ok : code accepté ; otp_ip : code envoyé ou vérification depuis la page, par IP. */
export type OtpKind = 'otp_send' | 'otp_try' | 'otp_ok' | 'otp_ip';

/** Nombre d’événements récents (20 au plus) pour cet identifiant, toutes instances confondues. */
export async function countOtpEvents(db: PrefDb, kind: OtpKind, id: string, windowMs = 3_600_000, now = Date.now()) {
  const since = new Date(now - windowMs).toISOString();
  const rows = await db.select<{ id: string }>('call_events', `select=id&kind=eq.${kind}&external_id=eq.${otpKey(id)}&created_at=gte.${since}&limit=20`);
  return rows.length;
}
export const logOtpEvent = (db: PrefDb, kind: OtpKind, id: string) => db.insert('call_events', { kind, external_id: otpKey(id) });

/** Génération du code : nombre de codes acceptés pour cette adresse et cet usage depuis 20 minutes. */
export const codeGeneration = (db: PrefDb, email: string, purpose: CodePurpose, now = Date.now()) =>
  countOtpEvents(db, 'otp_ok', codeGenKey(email, purpose), 2 * CODE_WINDOW_MS, now);

/** Message d’erreur sans adresse email (nodemailer y recopie la réponse du serveur SMTP, destinataire compris). */
export const maskEmails = (msg: unknown) => String(msg ?? '').replace(/[^\s<>:;,()"'[\]]+@[^\s<>:;,()"'[\]]+/g, '<email>');

/** Limiteur en mémoire (par instance), en complément des compteurs persistants : vrai si la limite est dépassée. */
export type Limiter = (key: string, max: number) => boolean;
export function makeLimiter(windowMs = 15 * 60_000, maxKeys = 5000): Limiter {
  const hits = new Map<string, number[]>();
  return (key, max) => {
    const now = Date.now();
    const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.delete(key);
    hits.set(key, recent);
    // Éviction des plus anciennes entrées seulement (jamais de remise à zéro globale).
    while (hits.size > maxKeys) hits.delete(hits.keys().next().value as string);
    return recent.length > max;
  };
}

const realSleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export interface SendCodeDeps {
  db: PrefDb;
  limiter: Limiter;
  /** Compte de l’espace client pour cette adresse (undefined : aucun code n’est envoyé). */
  findUser: (email: string) => Promise<{ email: string } | undefined>;
  /** Envoi de l’email du code (langue et catégorie « essential » choisies par l’appelant) ; false : rien n’est parti. */
  mail: (code: string) => Promise<unknown>;
  /** Attente (remplacée dans les tests pour ne pas attendre 6 s). */
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
}

/**
 * Envoie le code si l’adresse a un compte et n’a pas dépassé 3 envois dans l’heure. Ne lève jamais d’erreur
 * (journalisée) et rend la main après `minMs` au moins : la réponse ne dit rien de l’existence du compte.
 */
export async function sendCodeFlow(email: string, purpose: CodePurpose, deps: SendCodeDeps, minMs = CODE_MIN_RESPONSE_MS) {
  const sleep = deps.sleep ?? realSleep;
  const now = deps.now ?? Date.now;
  const started = now();
  const work = (async () => {
    if (deps.limiter(`mail:${email}`, 3) || (await countOtpEvents(deps.db, 'otp_send', email, 3_600_000, now())) >= 3) return;
    const user = await deps.findUser(email);
    if (!user) return;
    await logOtpEvent(deps.db, 'otp_send', email).catch(() => undefined);
    const gen = await codeGeneration(deps.db, email, purpose, now());
    // Email essentiel (code demandé par la personne) : envoyé même après une désinscription.
    const sent = await deps.mail(currentCode(email, purpose, now(), gen));
    // Sans ce marqueur, aucun essai n’est accepté pour cette adresse (vérification ci-dessous).
    if (sent !== false) await logOtpEvent(deps.db, 'otp_send', sentCodeKey(email, purpose));
  })().catch((e) => console.error(`[account-code] ${purpose} send:`, maskEmails(e?.message)));
  await Promise.race([work, sleep(minMs)]);
  await sleep(Math.max(0, minMs - (now() - started)));
}

/** ok : code accepté (marqué comme utilisé) ; invalid : faux, expiré ou déjà utilisé ; busy / locked : trop d’essais. */
export type VerifyResult = 'ok' | 'invalid' | 'busy' | 'locked';

/**
 * Vérifie un code. L’essai est enregistré AVANT la vérification (au plus 5 par heure et 15 par jour et par adresse,
 * toutes instances confondues) ; si l’écriture échoue, l’erreur remonte et l’accès est refusé. Sans code envoyé à
 * l’adresse depuis 20 minutes, la réponse est celle d’un mauvais code.
 */
export async function verifyCodeFlow(email: string, code: unknown, purpose: CodePurpose, deps: { db: PrefDb; limiter: Limiter; now?: () => number }): Promise<VerifyResult> {
  const now = deps.now ?? Date.now;
  if (deps.limiter(`try:${email}`, 5)) return 'busy';
  await logOtpEvent(deps.db, 'otp_try', email);
  if ((await countOtpEvents(deps.db, 'otp_try', email, 3_600_000, now())) > 5) return 'locked';
  if ((await countOtpEvents(deps.db, 'otp_try', email, 86_400_000, now())) > MAX_TRIES_PER_DAY) return 'locked';
  if ((await countOtpEvents(deps.db, 'otp_send', sentCodeKey(email, purpose), 2 * CODE_WINDOW_MS, now())) === 0) return 'invalid';
  // Marqueur propre à ce code : un même code ne sert qu’une fois, un nouveau code reste utilisable.
  const digits = String(code ?? '').replace(/\D/g, '');
  const used = usedCodeKey(email, digits, purpose);
  const gen = await codeGeneration(deps.db, email, purpose, now());
  if (!codeIsValid(email, digits, purpose, now(), gen) || (await countOtpEvents(deps.db, 'otp_ok', used, 2 * CODE_WINDOW_MS, now())) > 0) return 'invalid';
  await logOtpEvent(deps.db, 'otp_ok', used);
  // Génération suivante (jamais bloquant) : le prochain code diffère, même dans ce créneau.
  await logOtpEvent(deps.db, 'otp_ok', codeGenKey(email, purpose)).catch(() => undefined);
  return 'ok';
}

const escHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

/** Email du code de connexion à la page Mon compte, dans la langue du site (le pied de page est ajouté par sendMail). */
export function buildAccountCodeMail(locale: Locale, code: string) {
  const brand = MARKETS[locale].brand;
  const t = emailText(locale).accountCode;
  const rtl = isRtl(locale);
  return {
    subject: t.subject(brand, code),
    text: `${t.hello}\n\n${t.line(brand)}\n\n${code}\n\n${t.valid}\n${t.ignore}`,
    html: `<div dir="${rtl ? 'rtl' : 'ltr'}" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#1f2937;text-align:${rtl ? 'right' : 'left'}">`
      + `<p>${escHtml(t.hello)}</p><p>${escHtml(t.line(brand))}</p>`
      + `<p dir="ltr" style="font-size:28px;font-weight:bold;letter-spacing:4px;color:#0E1B4D;text-align:${rtl ? 'right' : 'left'}">${escHtml(code)}</p>`
      + `<p>${escHtml(t.valid)}</p><p style="color:#6b7280">${escHtml(t.ignore)}</p></div>`,
    fromName: brand,
  };
}

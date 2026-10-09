// Journal structuré pour Google Cloud Logging (audit des parcours du 9 oct. 2026, action 16). Le site tourne sur Cloud
// Run (App Hosting, backend voiceia) : une ligne JSON écrite sur la sortie standard ou d’erreur devient une entrée
// structurée, et son champ « severity » devient la gravité de l’entrée. Sans cela, console.error et console.warn
// arrivaient SANS gravité (DEFAULT) : la règle d’alerte « severity>=ERROR » ne voyait que les réponses 5xx, et une panne
// de l’envoi d’e-mails (Zoho), de la base (Supabase), de Stripe ou d’Autocalls restait silencieuse.
// installStructuredConsole() remplace console.error / warn / log / info par une ligne JSON
// { severity, message, component, source: "site" } (ERROR, WARNING, INFO) : les appels existants du code
// (« [mail] … », « [stripe] … ») n’ont pas à changer, « component » reprend le mot entre crochets du début du message.
// Données personnelles réduites, pas supprimées : adresses e-mail et numéros de téléphone masqués (voir maskPhones pour
// les formats reconnus), longueur limitée. Restent visibles : adresses IPv4 courtes (8.8.8.8), IPv6, noms, et numéros
// avec tirets qui ne commencent ni par « + », ni par « ( », ni par « 0 » (972-50-123-4567). Le code n’écrit pas ces
// données exprès, mais un message d’erreur d’un fournisseur peut en contenir.
// Activé seulement sur Cloud Run (variable K_SERVICE, posée par la plateforme) ou avec LOG_FORMAT=json ; LOG_FORMAT=text
// le coupe. En local, pendant le build et dans les tests : journal texte habituel, rien ne change.
// Installation : src/instrumentation.ts au démarrage du serveur, et src/lib/server.ts (filet, sans effet en double).
// Métrique et alerte Google Cloud à créer : docs/journaux-et-alertes.md. Module sans dépendance Node (aucun import de
// « util ») : il peut être compilé pour l’environnement « edge » sans casser le build.
import { maskEmails } from './maskEmails';

export type Severity = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
type Env = Record<string, string | undefined>;
type Writer = (line: string) => void;

/** Longueur maximale du message d’une entrée (une trace d’erreur complète tient dedans). */
const MAX_MESSAGE = 4000;
/** Longueur maximale d’un champ structuré texte. */
const MAX_FIELD = 300;

/** Numéro masqué : seuls les 2 derniers chiffres restent, pour reconnaître un numéro de test. */
const phoneMask = (m: string) => `[numéro …${m.replace(/\D/g, '').slice(-2)}]`;
/** Date jj-mm-aaaa (ou jj/mm, jj.mm) au début d’un passage : jamais prise pour un numéro. */
const DATE_DMY = /^\d{2}[-./]\d{2}[-./]\d{4}(?!\d)/;

/**
 * Numéros avec tirets ou parenthèses (passe 1 de maskPhones) : masqués seulement s’ils commencent par « + », « ( » ou
 * « 0 », et jamais une date jj-mm-aaaa. Les parenthèses qui entourent tout le numéro, ou qui n’en font pas partie,
 * restent autour du masque.
 */
function maskDashed(m: string) {
  if (!/^[+(]|^0/.test(m) || !/[-()]/.test(m) || DATE_DMY.test(m)) return m;
  const opens = (m.match(/\(/g) ?? []).length;
  const closes = (m.match(/\)/g) ?? []).length;
  const wrapped = m.startsWith('(') && m.endsWith(')') && !/[()]/.test(m.slice(1, -1));
  return `${wrapped || opens > closes ? '(' : ''}${phoneMask(m)}${wrapped || closes > opens ? ')' : ''}`;
}

/**
 * Numéros de téléphone masqués, 8 à 15 chiffres, jamais au milieu d’un identifiant (evt_1234…, uuid) :
 * 1) avec tirets ou parenthèses, s’ils commencent par « + », « ( » ou « 0 » (050-123-4567, 06-12-34-56-78,
 *    (020) 7946 0958, +972-50-123-4567) ; une date (2026-10-09, 09-10-2026) reste intacte ;
 * 2) d’un bloc ou avec des espaces ou des points, « + » facultatif (+33 6 12 34 56 78, 0612345678 ; une adresse IPv4
 *    de 8 chiffres ou plus aussi).
 * Non masqués : numéros avec tirets commençant par un autre chiffre (972-50-123-4567), adresses IPv4 courtes
 * (8.8.8.8), adresses IPv6.
 */
export const maskPhones = (s: string) =>
  s
    .replace(/(?<![\w+\-./])(?:\+|\(\+?)?\d(?:[ .\-()]{0,2}\d){7,14}\)?(?![\w-])/g, maskDashed)
    .replace(/(?<![\w+])\+?\d(?:[ .]?\d){7,14}(?!\w)/g, phoneMask);

/** Texte sans données personnelles : adresses e-mail puis numéros masqués, longueur limitée. */
export function scrub(s: string, max = MAX_MESSAGE) {
  const out = maskPhones(maskEmails(s));
  return out.length > max ? `${out.slice(0, max)}… [tronqué]` : out;
}

function argText(a: unknown): string {
  if (typeof a === 'string') return a;
  // Trace complète d’une erreur : Error Reporting de Google Cloud la regroupe d’elle-même.
  if (a instanceof Error) return a.stack || `${a.name}: ${a.message}`;
  if (a !== null && typeof a === 'object') {
    try { return JSON.stringify(a); } catch { return String(a); }
  }
  return String(a);
}

/** Équivalent simple de util.format : %s %d %i %f %j %o %O remplacés dans l’ordre, le reste séparé par une espace. */
export function formatArgs(args: unknown[]): string {
  if (!args.length) return '';
  const rest = args.slice(1);
  let first = argText(args[0]);
  if (typeof args[0] === 'string' && /%[sdifjoO%]/.test(args[0])) {
    first = args[0].replace(/%([sdifjoO%])/g, (m, k: string) => {
      if (k === '%') return '%';
      if (!rest.length) return m;
      const v = rest.shift();
      if (k === 'd') return String(Number(v));
      if (k === 'i') return String(parseInt(String(v), 10));
      if (k === 'f') return String(parseFloat(String(v)));
      return argText(v);
    });
  }
  return [first, ...rest.map(argText)].join(' ');
}

/** Champs structurés en plus du message (compteurs, statut) : textes nettoyés comme le message. */
function cleanFields(fields: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined) continue;
    out[k] = typeof v === 'number' || typeof v === 'boolean' || v === null ? v : scrub(argText(v), MAX_FIELD);
  }
  return out;
}

/**
 * Ligne JSON d’une entrée : gravité, message nettoyé, partie du site (« [mail] … » → component « mail ») et
 * source « site » (filtre de la métrique : jsonPayload.source="site"). Les champs fixes ne sont jamais écrasés.
 */
export function logLine(severity: Severity, args: unknown[], fields: Record<string, unknown> = {}): string {
  const message = scrub(formatArgs(args));
  const component = /^\s*\[([^\]\n]{1,40})\]/.exec(message)?.[1];
  return JSON.stringify({ ...cleanFields(fields), severity, message, ...(component ? { component } : {}), source: 'site' });
}

/** Journal structuré voulu : sur Cloud Run (K_SERVICE), ou forcé par LOG_FORMAT=json ; LOG_FORMAT=text le coupe. */
export function structuredLogsWanted(env: Env = process.env) {
  const format = String(env.LOG_FORMAT ?? '').trim().toLowerCase();
  if (format === 'json') return true;
  if (format === 'text') return false;
  return Boolean(env.K_SERVICE);
}

const FLAG = '__piaStructuredConsole';
const STD = { stdout: (l: string) => { process.stdout.write(l); }, stderr: (l: string) => { process.stderr.write(l); } };

/**
 * Remplace console.error (ERROR), console.warn (WARNING), console.log et console.info (INFO) par une ligne JSON :
 * erreurs et avertissements sur la sortie d’erreur, le reste sur la sortie standard. Une seule fois par console
 * (renvoie false si c’était déjà fait). Une écriture impossible n’interrompt jamais l’appelant.
 */
export function installStructuredConsole(target: Console = console, out: { stdout: Writer; stderr: Writer } = STD) {
  const t = target as Console & { [FLAG]?: boolean };
  if (t[FLAG]) return false;
  t[FLAG] = true;
  const emit = (severity: Severity, write: Writer) => (...args: unknown[]) => {
    try { write(`${logLine(severity, args)}\n`); } catch { /* sortie indisponible : rien d’autre à faire */ }
  };
  t.error = emit('ERROR', out.stderr);
  t.warn = emit('WARNING', out.stderr);
  t.info = emit('INFO', out.stdout);
  t.log = emit('INFO', out.stdout);
  return true;
}

/** Installe le journal structuré si l’environnement le demande (voir structuredLogsWanted) ; sans effet sinon. */
export function setupServerLogging(env: Env = process.env) {
  return structuredLogsWanted(env) ? installStructuredConsole() : false;
}

function report(severity: 'ERROR' | 'WARNING', component: string, message: string, fields?: Record<string, unknown>) {
  const text = `[${component}] ${message}`;
  try {
    if (structuredLogsWanted()) STD.stderr(`${logLine(severity, [text], fields)}\n`);
    else (severity === 'ERROR' ? console.error : console.warn)(scrub(text), ...(fields ? [cleanFields(fields)] : []));
  } catch { /* sortie indisponible */ }
}

/** Erreur applicative explicite (gravité ERROR), avec des champs structurés en plus du message (compteurs, statut). */
export const logError = (component: string, message: string, fields?: Record<string, unknown>) => report('ERROR', component, message, fields);
/** Avertissement explicite (gravité WARNING). */
export const logWarn = (component: string, message: string, fields?: Record<string, unknown>) => report('WARNING', component, message, fields);

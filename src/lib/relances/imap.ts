// Lecture SEULE de la boîte contact@ (IMAP, commande EXAMINE : aucun message marqué lu, déplacé ni supprimé), pour
// arrêter les relances d’un contact qui a répondu et repérer les rebonds. Client minimal sur TLS, sans dépendance :
// connexion, recherche des messages des derniers jours, lecture des en-têtes et du début du corps, déconnexion.
// Activé seulement si RELANCES_IMAP_USER et RELANCES_IMAP_PASS existent (mot de passe d’application Zoho conseillé).
import tls from 'tls';
import type { InboundMail } from './types';

export interface ImapConfig { host: string; port: number; user: string; pass: string; timeoutMs: number }

export function imapConfig(env: Record<string, string | undefined> = process.env): ImapConfig | null {
  if (!env.RELANCES_IMAP_USER || !env.RELANCES_IMAP_PASS) return null;
  return {
    host: env.RELANCES_IMAP_HOST || 'imap.zoho.com', port: Number(env.RELANCES_IMAP_PORT) || 993,
    user: env.RELANCES_IMAP_USER, pass: env.RELANCES_IMAP_PASS, timeoutMs: 45_000,
  };
}

const quote = (s: string) => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const imapDate = (d: Date) => `${String(d.getUTCDate()).padStart(2, '0')}-${MONTHS[d.getUTCMonth()]}-${d.getUTCFullYear()}`;

/** Fin de la réponse étiquetée `tag` dans le tampon (en sautant les littéraux {n}), ou -1 si incomplète. */
export function findTagged(buf: string, tag: string) {
  let p = 0;
  while (p < buf.length) {
    const eol = buf.indexOf('\r\n', p);
    if (eol < 0) return -1;
    const line = buf.slice(p, eol);
    const lit = /\{(\d+)\}$/.exec(line);
    if (lit) { p = eol + 2 + Number(lit[1]); if (p > buf.length) return -1; continue; }
    if (line.startsWith(`${tag} `)) return eol + 2;
    p = eol + 2;
  }
  return -1;
}

/** Littéraux d’une réponse FETCH, regroupés par message : [en-têtes, début du corps]. */
export function fetchLiterals(resp: string): string[][] {
  const out: string[][] = [];
  let p = 0;
  while (p < resp.length) {
    const eol = resp.indexOf('\r\n', p);
    if (eol < 0) break;
    const line = resp.slice(p, eol);
    const lit = /\{(\d+)\}$/.exec(line);
    if (/^\* \d+ FETCH/.test(line)) out.push([]);
    if (lit) {
      const start = eol + 2;
      out[out.length - 1]?.push(resp.slice(start, start + Number(lit[1])));
      p = start + Number(lit[1]);
      continue;
    }
    p = eol + 2;
  }
  return out;
}

/** Mots encodés MIME (=?utf-8?B?…?= et =?utf-8?Q?…?=) d’un en-tête. */
function decodeWords(s: string) {
  return s.replace(/=\?([\w-]+)\?([bBqQ])\?([^?]*)\?=/g, (_, charset: string, mode: string, data: string) => {
    try {
      const bytes = mode.toUpperCase() === 'B'
        ? Buffer.from(data, 'base64')
        : Buffer.from(data.replace(/_/g, ' ').replace(/=([0-9A-F]{2})/gi, (_m, h: string) => String.fromCharCode(parseInt(h, 16))), 'latin1');
      return bytes.toString(/utf-?8/i.test(charset) ? 'utf8' : 'latin1');
    } catch { return data; }
  });
}

/** En-têtes « Nom: valeur » (lignes repliées réunies), noms en minuscules. */
function headers(raw: string) {
  const h: Record<string, string> = {};
  for (const line of raw.replace(/\r\n[ \t]+/g, ' ').split('\r\n')) {
    const m = /^([\w-]+):\s*(.*)$/.exec(line);
    if (m) h[m[1].toLowerCase()] = m[2].trim();
  }
  return h;
}

const EMAIL = /[A-Za-z0-9._%+'-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const AUTO_SUBJECT = /^(automatic reply|auto[- ]?reply|autoreply|out of office|absence|réponse automatique|abwesenheit|risposta automatica|automatisch antwoord|odpowiedź automatyczna|מענה אוטומטי)/i;

/** Message lu → réponse, réponse automatique ou rebond. */
export function parseMessage(rawHeaders: string, rawBody: string, ownAddress: string): InboundMail {
  const h = headers(rawHeaders);
  const fromRaw = decodeWords(h.from || '');
  const from = (/<([^>]+)>/.exec(fromRaw)?.[1] || fromRaw.match(EMAIL)?.[0] || '').trim().toLowerCase();
  const subject = decodeWords(h.subject || '');
  const auto = (h['auto-submitted'] && !/^no$/i.test(h['auto-submitted']))
    || 'x-autoreply' in h || 'x-autorespond' in h || /^(bulk|junk|auto_reply|list)$/i.test(h.precedence || '') || AUTO_SUBJECT.test(subject);
  const bounce = /^(mailer-daemon|postmaster)@/i.test(from) || /report-type="?delivery-status/i.test(h['content-type'] || '');
  const own = ownAddress.toLowerCase();
  const bodyEmails = bounce
    ? Array.from(new Set((rawBody.match(EMAIL) || []).map((e) => e.toLowerCase()))).filter((e) => e !== own && !/^(mailer-daemon|postmaster)@/.test(e))
    : [];
  return { from, subject, date: h.date || null, automatic: Boolean(auto) && !bounce, bounce, bodyEmails };
}

/** Messages reçus depuis `sinceDays` jours (200 au plus, les plus récents). */
export function readInbound(cfg: ImapConfig, ownAddress: string) {
  return (sinceDays: number) => new Promise<InboundMail[]>((resolve, reject) => {
    let buf = '';
    let n = 0;
    let pending: { tag: string; done: (resp: string) => void; fail: (e: Error) => void } | null = null;
    let greeted: (() => void) | null = null;
    const socket = tls.connect({ host: cfg.host, port: cfg.port, servername: cfg.host });
    const timer = setTimeout(() => { socket.destroy(); reject(new Error('IMAP : délai dépassé')); }, cfg.timeoutMs);
    const end = (e?: Error, mails?: InboundMail[]) => {
      clearTimeout(timer);
      socket.end();
      if (e) reject(e); else resolve(mails ?? []);
    };
    socket.setEncoding('latin1'); // 1 caractère = 1 octet : les littéraux {n} se comptent en octets
    socket.on('error', (e) => end(new Error(`IMAP : ${e.message}`)));
    socket.on('data', (chunk: string) => {
      buf += chunk;
      if (greeted && /\r\n/.test(buf)) {
        const ok = /^\* (OK|PREAUTH)/.test(buf);
        const g = greeted;
        greeted = null;
        buf = '';
        if (ok) g(); else end(new Error('IMAP : accueil refusé'));
        return;
      }
      if (!pending) return;
      const stop = findTagged(buf, pending.tag);
      if (stop < 0) return;
      const resp = buf.slice(0, stop);
      buf = buf.slice(stop);
      const p = pending;
      pending = null;
      const status = /\r\n?$/.test(resp) ? resp.slice(resp.lastIndexOf(`${p.tag} `)).split(' ')[1] : '';
      if (status === 'OK') p.done(resp); else p.fail(new Error(`IMAP : commande refusée (${status || '?'})`));
    });
    const cmd = (text: string) => new Promise<string>((done, fail) => {
      const tag = `R${++n}`;
      pending = { tag, done, fail };
      socket.write(`${tag} ${text}\r\n`, 'latin1');
    });
    greeted = async () => {
      try {
        await cmd(`LOGIN ${quote(cfg.user)} ${quote(cfg.pass)}`);
        await cmd('EXAMINE INBOX');
        const since = new Date(Date.now() - sinceDays * 86_400_000);
        const search = await cmd(`SEARCH SINCE ${imapDate(since)}`);
        const ids = (/^\* SEARCH ?(.*)$/m.exec(search)?.[1] || '').trim().split(/\s+/).filter(Boolean).slice(-200);
        const mails: InboundMail[] = [];
        if (ids.length) {
          const resp = await cmd(`FETCH ${ids.join(',')} (BODY.PEEK[HEADER.FIELDS (FROM SUBJECT DATE AUTO-SUBMITTED X-AUTOREPLY X-AUTORESPOND PRECEDENCE CONTENT-TYPE)] BODY.PEEK[TEXT]<0.3000>)`);
          for (const [hdr = '', body = ''] of fetchLiterals(resp)) {
            // En-têtes en UTF-8 éventuel (lus octet par octet) : reconvertis avant analyse.
            mails.push(parseMessage(Buffer.from(hdr, 'latin1').toString('utf8'), body, ownAddress));
          }
        }
        await cmd('LOGOUT').catch(() => undefined);
        end(undefined, mails);
      } catch (e: any) {
        end(e instanceof Error ? e : new Error(String(e)));
      }
    };
  });
}

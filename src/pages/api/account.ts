// Page Mon compte (/mon-compte) : connexion par code à 6 chiffres envoyé à l’email du compte, puis résumé du compte
// en lecture seule (solde de l’espace client, forfait, carte et factures Stripe).
//
// GET                                          → résumé du compte de la session (401 sans session valide)
// POST { action: 'send_code', email, locale }  → envoie le code (réponse identique, en ~6 s, que le compte existe ou non)
// POST { action: 'verify', email, code }       → pose le cookie de session (30 min) si le code est bon (usage unique)
// POST { action: 'logout' }                    → efface le cookie de session
//
// Code et compteurs partagés avec Lucie (src/lib/accountCode.ts) ; session : src/lib/accountSession.ts ; Stripe :
// src/lib/stripeAccount.ts. Aucune écriture dans Stripe ni dans l’espace client ; l’email n’est jamais journalisé.
import type { NextApiRequest, NextApiResponse } from 'next';
import { SITE } from '@/data/site';
import { asLocale } from '@/i18n/locales';
import { buildAccountCodeMail, countOtpEvents, logOtpEvent, makeLimiter, maskEmails, sendCodeFlow, verifyCodeFlow } from '@/lib/accountCode';
import { readSessionFromCookieHeader, sessionClearCookie, sessionSetCookie, signSession } from '@/lib/accountSession';
import { findPlatformUser } from '@/lib/autocallsAccount';
import { isValidEmail, normEmail } from '@/lib/emailPrefs';
import { PREF_DB, clientIp, sendMail } from '@/lib/server';
import { loadStripeBilling, stripeReader, type AccountSummary } from '@/lib/stripeAccount';

// Limites en mémoire (par instance), en complément des compteurs persistants (call_events).
const tooMany = makeLimiter();
/** Codes envoyés depuis la page par une même adresse IP sur 24 h, toutes instances confondues. */
const IP_DAILY_CODES = 20;
/** Vérifications de code depuis une même adresse IP sur 24 h, toutes instances confondues. */
const IP_DAILY_TRIES = 20;

/** Requête POST d’une autre origine (formulaire d’un autre site) : refusée. Sans en-tête Origin : acceptée.
 *  Acceptées : l’hôte de la requête (x-forwarded-host derrière App Hosting) et l’adresse officielle du site. */
function foreignOrigin(req: NextApiRequest) {
  const origin = req.headers.origin;
  if (!origin) return false;
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim().toLowerCase();
  try {
    const o = new URL(origin);
    return o.host.toLowerCase() !== host && o.origin !== new URL(SITE.url).origin;
  } catch { return true; }
}

const amount = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/** Solde de l’espace client (liste white-label, aucun jeton créé pour le client). */
async function loadPlatform(email: string): Promise<AccountSummary['platform']> {
  try {
    const u = await findPlatformUser(email, { timeoutMs: 5000, totalMs: 8000 });
    if (!u) return { state: 'not_found' };
    return {
      state: 'ok',
      name: typeof u.name === 'string' && u.name.trim() ? u.name.trim() : null,
      createdAt: typeof u.created_at === 'string' ? u.created_at : null,
      minutes: amount(u.minutes_balance),
      messageCredits: amount(u.credits_balance),
    };
  } catch (e: any) {
    console.error('[mon-compte] autocalls:', e?.name === 'AbortError' ? 'délai dépassé' : maskEmails(e?.message));
    return { state: 'unavailable' };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    const session = readSessionFromCookieHeader(req.headers.cookie);
    if (!session) return res.status(401).json({ ok: false, error: 'no_session' });
    if (tooMany(`summary:${session.email}`, 30)) return res.status(429).json({ ok: false, error: 'too_many' });
    // Une panne en amont n’est jamais une erreur 5xx : elle est indiquée dans chaque partie du résumé.
    // Forfait : API Stripe si la clé est configurée, sinon (ou en panne) état enregistré par le webhook Stripe.
    const [platform, billing] = await Promise.all([loadPlatform(session.email), loadStripeBilling(session.email, stripeReader(), PREF_DB)]);
    const summary: AccountSummary = { email: session.email, platform, billing };
    return res.status(200).json({ ok: true, summary });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  if (foreignOrigin(req)) return res.status(403).json({ ok: false, error: 'forbidden' });
  const b = req.body && typeof req.body === 'object' ? req.body : {};
  const ip = clientIp(req);

  if (b.action === 'send_code') {
    // Champ caché rempli par les robots : réponse normale, aucun envoi.
    if (b.website) return res.status(200).json({ ok: true });
    const email = normEmail(b.email);
    if (!isValidEmail(email)) return res.status(400).json({ ok: false, error: 'invalid_email' });
    if (tooMany(`ip:${ip}`, 5) || tooMany('send:all', 300)) return res.status(429).json({ ok: false, error: 'too_many' });
    const locale = asLocale(b.locale);
    await sendCodeFlow(email, 'site', {
      db: PREF_DB,
      limiter: tooMany,
      findUser: (e) => findPlatformUser(e, { timeoutMs: 5000, totalMs: 5500 }),
      mail: async (code) => {
        // Au plus 20 codes par jour depuis une même adresse IP (vers des comptes existants) : sinon rien ne part (false :
        // aucun code n’est alors accepté pour cette adresse).
        if ((await countOtpEvents(PREF_DB, 'otp_ip', `ip|${ip}`, 86_400_000)) >= IP_DAILY_CODES) return false;
        await logOtpEvent(PREF_DB, 'otp_ip', `ip|${ip}`).catch(() => undefined);
        const m = buildAccountCodeMail(locale, code);
        return sendMail({ to: email, category: 'essential', subject: m.subject, text: m.text, html: m.html, fromName: m.fromName, locale });
      },
    });
    return res.status(200).json({ ok: true });
  }

  if (b.action === 'verify') {
    const email = normEmail(b.email);
    const code = String(b.code ?? '').replace(/\D/g, '');
    if (!isValidEmail(email) || !/^\d{6}$/.test(code)) return res.status(400).json({ ok: false, error: 'invalid_input' });
    if (tooMany(`verify-ip:${ip}`, 20)) return res.status(429).json({ ok: false, error: 'too_many' });
    try {
      // Plafond persistant par adresse IP (le limiteur ci-dessus ne vaut que pour une instance).
      if ((await countOtpEvents(PREF_DB, 'otp_ip', `ip|try|${ip}`, 86_400_000)) >= IP_DAILY_TRIES) return res.status(429).json({ ok: false, error: 'too_many' });
      await logOtpEvent(PREF_DB, 'otp_ip', `ip|try|${ip}`);
      const verdict = await verifyCodeFlow(email, code, 'site', { db: PREF_DB, limiter: tooMany });
      if (verdict === 'busy' || verdict === 'locked') return res.status(429).json({ ok: false, error: 'too_many' });
      if (verdict === 'invalid') return res.status(401).json({ ok: false, error: 'invalid_code' });
      const value = signSession(email);
      if (!value) return res.status(503).json({ ok: false, error: 'unavailable' });
      res.setHeader('Set-Cookie', sessionSetCookie(value));
      return res.status(200).json({ ok: true });
    } catch (e: any) {
      // Essai impossible à enregistrer (base en panne) ou secret absent : accès refusé.
      console.error('[mon-compte] verify:', maskEmails(e?.message));
      return res.status(503).json({ ok: false, error: 'unavailable' });
    }
  }

  if (b.action === 'logout') {
    res.setHeader('Set-Cookie', sessionClearCookie);
    return res.status(200).json({ ok: true });
  }

  return res.status(400).json({ ok: false, error: 'unknown_action' });
}

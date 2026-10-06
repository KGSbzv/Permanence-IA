// Dossier client pour Lucie (conseillère de mise en route, Messenger, support) : elle peut lire le compte
// d’un client — minutes, crédits, agents, numéros, derniers appels, demandes de rappel — après avoir vérifié
// son identité par un code à 6 chiffres envoyé à l’email du compte (personne ne peut lire le compte d’un autre).
//
// POST { action: 'send_code', email }        → envoie le code (réponse identique que le compte existe ou non)
// POST { action: 'lookup', email, code }      → renvoie le résumé du compte si le code est bon
import { createHmac, timingSafeEqual } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { dbSelect, esc, sendMail } from '@/lib/server';

const API = 'https://app.autocalls.ai/api';
const WINDOW_MS = 10 * 60_000; // un code reste valable 10 à 20 minutes

// Limites par instance : 10 requêtes par adresse IP et 3 codes par email, par tranche de 15 minutes.
const hits = new Map<string, number[]>();
function tooMany(key: string, max: number) {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < 15 * 60_000);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > max;
}

function codeFor(email: string, slot: number) {
  const secret = process.env.WEBHOOK_TOKEN || '';
  const n = createHmac('sha256', secret).update(`lucie|${email}|${slot}`).digest().readUInt32BE(0) % 1_000_000;
  return String(n).padStart(6, '0');
}
function codeIsValid(email: string, code: string) {
  const slot = Math.floor(Date.now() / WINDOW_MS);
  const got = Buffer.from(code.replace(/\D/g, ''));
  return [slot, slot - 1].some((s) => {
    const want = Buffer.from(codeFor(email, s));
    return got.length === want.length && timingSafeEqual(got, want);
  });
}

async function api<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
  if (!res.ok) throw new Error(`Autocalls ${path} ${res.status}`);
  return res.json();
}

interface PlatformUser { id: number; name: string; email: string; minutes_balance: number; credits_balance: number; created_at: string }

async function findUser(email: string): Promise<PlatformUser | undefined> {
  const key = process.env.AUTOCALLS_API_KEY;
  if (!key) throw new Error('AUTOCALLS_API_KEY non configurée');
  const body = await api<{ data?: PlatformUser[] } | PlatformUser[]>('/white-label/users', key);
  const list = Array.isArray(body) ? body : body.data || [];
  return list.find((u) => u.email.toLowerCase() === email);
}

const items = (b: any): any[] => (Array.isArray(b) ? b : Array.isArray(b?.data) ? b.data : []);

/** Lit le compte avec un jeton temporaire du client, révoqué aussitôt après. */
async function accountSummary(user: PlatformUser) {
  const key = process.env.AUTOCALLS_API_KEY as string;
  const created = await api<{ token: string }>('/white-label/token', key, {
    method: 'POST', body: JSON.stringify({ user_id: user.id, token_name: 'lucie-lecture' }),
  });
  const token = created.token;
  try {
    const [assistants, numbers, calls] = await Promise.all([
      api<any>('/user/assistants/get?per_page=20', token).catch(() => null),
      api<any>('/user/phone-numbers', token).catch(() => null),
      api<any>('/user/calls?per_page=5', token).catch(() => null),
    ]);
    return {
      agents: items(assistants).map((a) => ({ name: a.name, type: a.type, has_phone_number: Boolean(a.phone_number_id), has_knowledgebase: Boolean(a.knowledgebase_id) })),
      phone_numbers: items(numbers).map((n) => ({ number: n.phone_number || n.number, assigned_agent: n.assistant_id ? 'oui' : 'non' })),
      last_calls: items(calls).slice(0, 5).map((c) => ({ date: c.created_at, duration_seconds: c.duration, status: c.status, agent: c.assistant_name })),
    };
  } finally {
    // Jeton au format « id|secret » : on ne révoque que celui-ci, jamais les clés API du client.
    const tokenId = Number(String(token).split('|')[0]);
    if (tokenId) {
      await api('/white-label/logout', key, { method: 'POST', body: JSON.stringify({ user_id: user.id, token_id: tokenId }) }).catch(() => undefined);
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });
  const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  if (tooMany(`ip:${ip}`, 10)) return res.status(429).json({ message: 'Trop de demandes : réessayez dans quelques minutes.' });

  const b = req.body || {};
  const email = String(b.email || '').trim().toLowerCase().slice(0, 160);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ message: 'Adresse email invalide : demandez à la personne de la vérifier.' });

  try {
    if (b.action === 'send_code') {
      if (tooMany(`mail:${email}`, 3)) return res.status(429).json({ message: 'Trop de codes demandés pour cette adresse : réessayez dans 15 minutes.' });
      const user = await findUser(email);
      if (user) {
        const code = codeFor(email, Math.floor(Date.now() / WINDOW_MS));
        await sendMail(
          email,
          `Votre code de vérification : ${code} · Your verification code`,
          `Bonjour,\n\nVotre code pour que Lucie consulte votre compte Permanence IA : ${code}\nIl est valable 10 minutes. Si vous n’avez rien demandé, ignorez cet email.\n\nYour code so Lucie can look at your PermanenceAI account: ${code} (valid for 10 minutes).`,
          `<p>Bonjour,</p><p>Votre code pour que Lucie consulte votre compte Permanence IA :</p><p style="font-size:28px;font-weight:bold;letter-spacing:4px">${esc(code)}</p><p>Il est valable 10 minutes. Si vous n’avez rien demandé, ignorez cet email.</p><hr><p>Your code so Lucie can look at your PermanenceAI account: <b>${esc(code)}</b> (valid for 10 minutes).</p>`,
        );
      }
      // Même réponse dans tous les cas : on ne révèle pas si l’adresse a un compte.
      return res.status(200).json({ message: 'Si cette adresse correspond à un compte, un code à 6 chiffres vient d’y être envoyé. Demandez-le à la personne.' });
    }

    if (b.action === 'lookup') {
      if (tooMany(`try:${email}`, 5)) return res.status(429).json({ message: 'Trop d’essais : demandez un nouveau code dans 15 minutes.' });
      if (!codeIsValid(email, String(b.code || ''))) return res.status(200).json({ verified: false, message: 'Code incorrect ou expiré : proposez d’envoyer un nouveau code.' });
      const user = await findUser(email);
      if (!user) return res.status(200).json({ verified: false, message: 'Aucun compte avec cette adresse : demandez l’email utilisé à l’inscription.' });

      const [summary, requests] = await Promise.all([
        accountSummary(user).catch(() => null),
        dbSelect<any>('callbacks', `select=created_at,type,slot,note,status&email=eq.${encodeURIComponent(email)}&order=created_at.desc&limit=5`).catch(() => []),
      ]);
      const hasMinutes = Number(user.minutes_balance) > 0;
      return res.status(200).json({
        verified: true,
        name: user.name,
        account_created: user.created_at,
        minutes_left: user.minutes_balance,
        message_credits_left: user.credits_balance,
        plan_status: hasMinutes
          ? 'Forfait ou essai actif (minutes disponibles). Pour le nom exact du forfait et la date de fin d’essai, demandez-lui de regarder Billing info.'
          : 'Aucune minute : aucun forfait choisi (essai pas démarré) ou minutes épuisées. Proposez Change plan pour démarrer l’essai de 14 jours.',
        agents: summary?.agents ?? 'indisponible',
        phone_numbers: summary?.phone_numbers ?? 'indisponible',
        last_calls: summary?.last_calls ?? 'indisponible',
        previous_requests: requests,
      });
    }
    return res.status(400).json({ message: 'Action inconnue.' });
  } catch (e: any) {
    console.error('[agent-account]', e.message);
    return res.status(200).json({ verified: false, message: 'Le dossier est momentanément indisponible : continuez sans, ou créez un ticket.' });
  }
}

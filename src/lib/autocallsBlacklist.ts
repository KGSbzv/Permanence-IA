// Liste de blocage Autocalls : chaque opposition reçue par le site y est aussi ajoutée, en seconde sécurité (les
// campagnes n’appellent plus ce numéro et Autocalls refuse ses appels entrants). Pas d’API publique : le site déclenche
// l’automatisation Autocalls « Liste noire ← refus reçus par le site » (sclgGIM5NvGnGYWz7XOUy), qui vérifie le jeton
// puis ajoute le numéro. Jeton = HMAC-SHA256(AUTOCALLS_API_KEY, « permanenceia-blacklist-v1 ») en base64url, recopié
// dans l’automatisation : à recalculer et recopier si la clé change. Coupure : AUTOCALLS_BLACKLIST=0.
import { createHmac } from 'crypto';

const DEFAULT_URL = 'https://automate.autocalls.ai/api/v1/webhooks/sclgGIM5NvGnGYWz7XOUy';
const E164 = /^\+[1-9]\d{6,14}$/;

export const blacklistToken = (apiKey: string) => createHmac('sha256', apiKey).update('permanenceia-blacklist-v1').digest('base64url');

/**
 * Demande l’ajout du numéro (E.164) à la liste de blocage. « off » : coupé ou clé Autocalls absente (rien n’est
 * envoyé). Lève une erreur si le numéro n’est pas international ou si l’automatisation ne répond pas 2xx. La réponse
 * arrive avant l’exécution : « sent » veut dire demande acceptée, l’ajout se voit dans les exécutions de l’automatisation.
 */
export async function addToAutocallsBlacklist(phone: string, reason: string, fetchImpl: typeof fetch = fetch): Promise<'sent' | 'off'> {
  const key = process.env.AUTOCALLS_API_KEY;
  if (process.env.AUTOCALLS_BLACKLIST === '0' || !key) return 'off';
  if (!E164.test(phone)) throw new Error('numéro non international');
  const res = await fetchImpl(process.env.AUTOCALLS_BLACKLIST_WEBHOOK_URL || DEFAULT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: blacklistToken(key), phone_number: phone, reason: reason.slice(0, 200) }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`automatisation Autocalls : HTTP ${res.status}`);
  return 'sent';
}

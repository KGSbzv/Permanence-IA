// Opposition « ne plus appeler » : enregistrée quand un agent la reçoit (résultat d’appel ne_plus_appeler,
// ou outil /api/agent/optout pendant l’appel). Effets : demandes de rappel en attente annulées (check.ts ne les
// appelle plus), plus aucune mise en file automatique pour ce numéro (/api/callback), email à l’équipe.
// Opposition appliquée : numéro aussi ajouté à la liste de blocage Autocalls (src/lib/autocallsBlacklist.ts) ; en cas
// d’échec, l’email demande de l’y ajouter à la main.
import { NOTIFY_TO, dbInsert, dbSelect, dbUpdate, esc, sendMail } from '@/lib/server';
import { addToAutocallsBlacklist } from '@/lib/autocallsBlacklist';

export const OPTOUT_KIND = 'optout';

/** Issues d’échange qui valent refus d’être contacté : opposition, désinscription (WhatsApp) ou mauvais numéro.
 *  Lues par le webhook de fin d’échange (opposition enregistrée, aucune copie de l’échange envoyée). */
export const STOP_OUTCOMES = ['ne_plus_appeler', 'desinscription', 'mauvais_contact'] as const;

/** Le numéro (E.164) a-t-il déjà demandé à ne plus être appelé ? */
export async function isOptedOut(e164: string) {
  const rows = await dbSelect('call_events', `select=id&kind=eq.${OPTOUT_KIND}&customer_phone=eq.${encodeURIComponent(e164)}&limit=1`);
  return rows.length > 0;
}

/** Annule les demandes de rappel encore à appeler pour ce numéro (statuts pending et scheduled). */
export const cancelPendingCallbacks = (e164: string) =>
  dbUpdate('callbacks', `phone=eq.${encodeURIComponent(e164)}&status=in.(pending,scheduled)`, { status: 'cancelled' });

/**
 * Enregistre l’opposition (une ligne par opposition reçue, même si le numéro en avait déjà une : la copie de
 * l’échange cherche une opposition reçue pendant l’échange), annule les rappels en attente et prévient l’équipe.
 * `outcome` : ne_plus_appeler (opposition, liste de blocage), desinscription (demandée sur WhatsApp : traitée comme
 * une opposition, plus aucun appel ni message automatique) ou mauvais_contact (rappels annulés seulement).
 * `apply: false` (demande non authentifiée) : rien n’est annulé ni bloqué, l’équipe est seulement prévenue —
 * sinon n’importe qui pourrait faire annuler le rappel d’un autre numéro. L’opposition est alors appliquée
 * par le webhook de fin d’appel (résultat ne_plus_appeler, authentifié) ou à la main.
 * Renvoie le détail des étapes, pour les journaux et la réponse à l’agent.
 */
export async function registerOptOut(opts: { phone: string; outcome: 'ne_plus_appeler' | 'desinscription' | 'mauvais_contact'; source: string; reason?: string; apply?: boolean }) {
  const { phone, outcome, source } = opts;
  const isOptOut = outcome !== 'mauvais_contact';
  const apply = opts.apply !== false;
  const reason = String(opts.reason || '').slice(0, 500);
  const [cancel] = apply
    ? await Promise.allSettled([cancelPendingCallbacks(phone)])
    : [{ status: 'rejected', reason: new Error('non appliqué : demande sans jeton') } as PromiseSettledResult<unknown>];
  let recorded: PromiseSettledResult<unknown> = { status: 'fulfilled', value: null };
  if (apply && isOptOut) {
    [recorded] = await Promise.allSettled([dbInsert('call_events', {
      kind: OPTOUT_KIND, external_id: `optout-${Date.now()}`, customer_phone: phone, outcome,
      summary: `${outcome === 'desinscription' ? 'Désinscription WhatsApp' : 'Opposition « ne plus appeler »'} (${source})${reason ? ` : ${reason}` : ''}`,
    })]);
  }
  // Seconde sécurité, même si l’enregistrement en base a échoué ; jamais bloquante pour le reste.
  let blacklist: PromiseSettledResult<'sent' | 'off'> | null = null;
  if (apply && isOptOut) {
    [blacklist] = await Promise.allSettled([addToAutocallsBlacklist(phone, `${outcome === 'desinscription' ? 'Désinscription WhatsApp' : 'Opposition « ne plus appeler »'} (${source})`)]);
  }
  const problems = [
    apply && cancel.status === 'rejected' && `annulation des rappels en attente : ${cancel.reason?.message}`,
    recorded.status === 'rejected' && `opposition non enregistrée en base : ${recorded.reason?.message}`,
  ].filter(Boolean) as string[];
  const lines = [
    `Numéro : ${phone}`, `Source : ${source}`, reason && `Motif : ${reason}`,
    `Rappels en attente : ${cancel.status === 'fulfilled' ? 'annulés' : 'NON annulés'}`,
    !apply && 'À VÉRIFIER : demande reçue sans jeton, rien n’a été appliqué automatiquement. Elle le sera à la fin de l’appel si son résultat est « ne_plus_appeler » ; sinon, annuler les rappels de ce numéro à la main.',
    blacklist?.status === 'fulfilled' && blacklist.value === 'sent'
      ? 'Liste de blocage Autocalls : ajout demandé automatiquement (campagnes et appels entrants de ce numéro bloqués).'
      : apply && isOptOut && `À FAIRE : ajouter ce numéro à la liste de blocage Autocalls (blacklist), pour toutes les campagnes${blacklist?.status === 'rejected' ? ` (ajout automatique impossible : ${blacklist.reason?.message})` : ''}.`,
    ...problems.map((p) => `ERREUR — ${p}`),
  ].filter(Boolean) as string[];
  const [mail] = await Promise.allSettled([sendMail({
    to: NOTIFY_TO, category: 'internal',
    subject: `${outcome === 'desinscription' ? 'Désinscription WhatsApp : ne plus contacter' : isOptOut ? 'Opposition : ne plus appeler' : 'Mauvais contact : rappels annulés'} — ${phone}`,
    text: lines.join('\n'), html: `<p>${lines.map(esc).join('<br>')}</p>`,
  })]);
  if (mail.status === 'rejected') problems.push(`email : ${mail.reason?.message}`);
  return {
    cancelled: cancel.status === 'fulfilled', recorded: recorded.status === 'fulfilled', notified: mail.status === 'fulfilled',
    blacklisted: blacklist?.status === 'fulfilled' && blacklist.value === 'sent', problems,
  };
}

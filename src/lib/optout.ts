// Opposition « ne plus appeler » : enregistrée quand un agent la reçoit (résultat d’appel ne_plus_appeler,
// ou outil /api/agent/optout pendant l’appel). Effets : demandes de rappel en attente annulées (check.ts ne les
// appelle plus), plus aucune mise en file automatique pour ce numéro (/api/callback), email à l’équipe.
// Pas d’API publique Autocalls pour la liste de blocage : l’email demande de l’y ajouter à la main.
import { NOTIFY_TO, dbInsert, dbSelect, dbUpdate, esc, sendMail } from '@/lib/server';

export const OPTOUT_KIND = 'optout';

/** Le numéro (E.164) a-t-il déjà demandé à ne plus être appelé ? */
export async function isOptedOut(e164: string) {
  const rows = await dbSelect('call_events', `select=id&kind=eq.${OPTOUT_KIND}&customer_phone=eq.${encodeURIComponent(e164)}&limit=1`);
  return rows.length > 0;
}

/** Annule les demandes de rappel encore à appeler pour ce numéro (statuts pending et scheduled). */
export const cancelPendingCallbacks = (e164: string) =>
  dbUpdate('callbacks', `phone=eq.${encodeURIComponent(e164)}&status=in.(pending,scheduled)`, { status: 'cancelled' });

/**
 * Enregistre l’opposition (une seule ligne par numéro), annule les rappels en attente et prévient l’équipe.
 * `outcome` : ne_plus_appeler (opposition, liste de blocage) ou mauvais_contact (rappels annulés seulement).
 * `apply: false` (demande non authentifiée) : rien n’est annulé ni bloqué, l’équipe est seulement prévenue —
 * sinon n’importe qui pourrait faire annuler le rappel d’un autre numéro. L’opposition est alors appliquée
 * par le webhook de fin d’appel (résultat ne_plus_appeler, authentifié) ou à la main.
 * Renvoie le détail des étapes, pour les journaux et la réponse à l’agent.
 */
export async function registerOptOut(opts: { phone: string; outcome: 'ne_plus_appeler' | 'mauvais_contact'; source: string; reason?: string; apply?: boolean }) {
  const { phone, outcome, source } = opts;
  const apply = opts.apply !== false;
  const reason = String(opts.reason || '').slice(0, 500);
  const skipped: PromiseSettledResult<boolean> = { status: 'fulfilled', value: true };
  const [cancel, already] = apply
    ? await Promise.allSettled([cancelPendingCallbacks(phone), outcome === 'ne_plus_appeler' ? isOptedOut(phone) : Promise.resolve(true)])
    : [{ status: 'rejected', reason: new Error('non appliqué : demande sans jeton') } as PromiseSettledResult<unknown>, skipped];
  let recorded: PromiseSettledResult<unknown> = { status: 'fulfilled', value: null };
  if (apply && outcome === 'ne_plus_appeler' && !(already.status === 'fulfilled' && already.value)) {
    [recorded] = await Promise.allSettled([dbInsert('call_events', {
      kind: OPTOUT_KIND, external_id: `optout-${Date.now()}`, customer_phone: phone, outcome,
      summary: `Opposition « ne plus appeler » (${source})${reason ? ` : ${reason}` : ''}`,
    })]);
  }
  const problems = [
    apply && cancel.status === 'rejected' && `annulation des rappels en attente : ${cancel.reason?.message}`,
    recorded.status === 'rejected' && `opposition non enregistrée en base : ${recorded.reason?.message}`,
  ].filter(Boolean) as string[];
  const isOptOut = outcome === 'ne_plus_appeler';
  const lines = [
    `Numéro : ${phone}`, `Source : ${source}`, reason && `Motif : ${reason}`,
    `Rappels en attente : ${cancel.status === 'fulfilled' ? 'annulés' : 'NON annulés'}`,
    !apply && 'À VÉRIFIER : demande reçue sans jeton, rien n’a été appliqué automatiquement. Elle le sera à la fin de l’appel si son résultat est « ne_plus_appeler » ; sinon, annuler les rappels de ce numéro à la main.',
    isOptOut && 'À FAIRE : ajouter ce numéro à la liste de blocage Autocalls (blacklist), pour toutes les campagnes.',
    ...problems.map((p) => `ERREUR — ${p}`),
  ].filter(Boolean) as string[];
  const [mail] = await Promise.allSettled([sendMail({
    to: NOTIFY_TO, category: 'internal',
    subject: `${isOptOut ? 'Opposition : ne plus appeler' : 'Mauvais contact : rappels annulés'} — ${phone}`,
    text: lines.join('\n'), html: `<p>${lines.map(esc).join('<br>')}</p>`,
  })]);
  if (mail.status === 'rejected') problems.push(`email : ${mail.reason?.message}`);
  return { cancelled: cancel.status === 'fulfilled', recorded: recorded.status === 'fulfilled', notified: mail.status === 'fulfilled', problems };
}

// Accès Supabase du moteur des relances (helpers de src/lib/server.ts). Table absente ou illisible (migration pas
// encore exécutée) : journal une seule fois par table et par instance, lecture renvoyée vide (null), jamais d’erreur
// qui casserait le site. Les tests utilisent un faux en mémoire (scripts/test-relances.ts).
// Mise en route (9 oct.) : lectures quotidiennes des agents dans call_events (kind 'activite_compte', sans changement
// de schéma) ; verrou des alertes à l’équipe dans stripe_events (« alerte:… », comme les alertes de paiement).
import { dbInsert, dbInsertIfNew, dbSelect, dbUpdate } from '@/lib/server';
import { EMAIL_PREF_KIND } from '@/lib/emailPrefs';
import { OPTOUT_KIND } from '@/lib/optout';
import { ACTIVITY_KIND } from './activity';
import type {
  AccountActivity,
  CallbackRow, ConsentRow, ContactRow, LogRow, RelanceStore, RunRow, SettingsRow, SignupRow, SnapshotRow, StateRow, StopRow,
  StripeCustomerRow, StripeSubscriptionRow,
} from './types';

const warned = new Set<string>();
function warnOnce(table: string, e: unknown) {
  if (warned.has(table)) return;
  warned.add(table);
  console.warn(`[relances] ${table} illisible (${(e as Error)?.message ?? e}) — exécuter supabase/migrations/20261008_relances_moteur.sql si la table manque`);
}

const PAGE = 1000; // limite par défaut de PostgREST (Supabase)

/** Lecture paginée ; null si la table est absente ou illisible. */
async function selectAll<T>(table: string, query: string, max = 20_000): Promise<T[] | null> {
  const out: T[] = [];
  try {
    for (let offset = 0; offset < max; offset += PAGE) {
      const rows = await dbSelect<T>(table, `${query}&limit=${PAGE}&offset=${offset}`);
      out.push(...rows);
      if (rows.length < PAGE) break;
    }
    return out;
  } catch (e) {
    warnOnce(table, e);
    return null;
  }
}

const enc = encodeURIComponent;
const logKey = (k: { email_key: string; sequence: string; step: string; dry_run: boolean }) =>
  `email_key=eq.${enc(k.email_key)}&sequence=eq.${k.sequence}&step=eq.${enc(k.step)}&dry_run=eq.${k.dry_run}`;
const LOG_COLUMNS = 'email_key,sequence,step,dry_run,status,category,skip_reason,attempts,locale,subject,created_at,sent_at';

export const SUPABASE_STORE: RelanceStore = {
  async settings() {
    const rows = await selectAll<SettingsRow>('relance_settings', 'select=enabled,paused_reason,last_report_on&id=eq.1');
    if (!rows) return null;
    return rows[0] ?? { enabled: false };
  },
  async updateSettings(patch) {
    try { await dbUpdate('relance_settings', 'id=eq.1', { ...patch, updated_at: new Date().toISOString() }); return true; } catch (e) { warnOnce('relance_settings (écriture)', e); return false; }
  },
  callbacks: (since) => selectAll<CallbackRow>('callbacks', `select=*&created_at=gte.${enc(since)}&order=created_at.desc`),
  signups: () => selectAll<SignupRow>('signups', 'select=*&order=signed_up_at.desc'),
  contacts: () => selectAll<ContactRow>('contacts', 'select=*'),
  async emailPrefs() {
    const rows = await selectAll<{ external_id: string; outcome: string | null }>('call_events', `select=external_id,outcome,created_at&kind=eq.${EMAIL_PREF_KIND}&order=created_at.asc`);
    if (!rows) return null;
    const m = new Map<string, string>();
    for (const r of rows) if (r.external_id && r.outcome) m.set(r.external_id, r.outcome); // la plus récente fait foi
    return m;
  },
  async phoneOptouts() {
    const rows = await selectAll<{ customer_phone: string | null }>('call_events', `select=customer_phone&kind=eq.${OPTOUT_KIND}`);
    return rows ? new Set(rows.map((r) => r.customer_phone).filter((p): p is string => Boolean(p))) : null;
  },
  consents: () => selectAll<ConsentRow>('consents', 'select=email_key,channel,purpose,granted,legal_basis,created_at&channel=eq.email&order=created_at.desc'),
  async stripe() {
    const [customers, subscriptions, events] = await Promise.all([
      selectAll<StripeCustomerRow>('stripe_customers', 'select=*'),
      selectAll<StripeSubscriptionRow>('stripe_subscriptions', 'select=*'),
      selectAll<{ event_id: string }>('stripe_events', 'select=event_id&livemode=eq.true', 1),
    ]);
    if (!customers || !subscriptions || !events) return null;
    return { customers, subscriptions, eventsSeen: events.length > 0 };
  },
  snapshots: (since) => selectAll<SnapshotRow>('platform_user_snapshots', `select=user_id,snap_date,email_key,minutes_balance,credits_balance,platform_created_at&snap_date=gte.${since}`),
  async saveSnapshots(rows) {
    try {
      for (const r of rows) await dbInsertIfNew('platform_user_snapshots', { ...r }, 'user_id,snap_date');
      return true;
    } catch (e) { warnOnce('platform_user_snapshots (écriture)', e); return false; }
  },
  logs: (dryRun) => selectAll<LogRow>('relance_log', `select=${LOG_COLUMNS}&dry_run=eq.${dryRun}&order=created_at.asc`, 100_000),
  logPreviews: (since) => selectAll<LogRow>('relance_log', `select=${LOG_COLUMNS},preview&dry_run=eq.true&status=eq.dry_run&created_at=gte.${enc(since)}&order=created_at.desc`, 50),
  // Écritures du journal et des séries : une erreur remonte (aucun envoi sans trace écrite).
  insertLogIfNew: (row) => dbInsertIfNew('relance_log', { ...row, updated_at: new Date().toISOString() }, 'email_key,sequence,step,dry_run'),
  updateLog: (key, patch) => dbUpdate('relance_log', logKey(key), { ...patch, updated_at: new Date().toISOString() }),
  states: (dryRun) => selectAll<StateRow>('relance_state', `select=email_key,sequence,dry_run,entered_at,status,stop_reason&dry_run=eq.${dryRun}`),
  insertStateIfNew: (row) => dbInsertIfNew('relance_state', { ...row }, 'email_key,sequence,dry_run'),
  updateState: (k, patch) => dbUpdate('relance_state', `email_key=eq.${enc(k.email_key)}&sequence=eq.${k.sequence}&dry_run=eq.${k.dry_run}`, { ...patch, updated_at: new Date().toISOString() }),
  stops: () => selectAll<StopRow>('relance_stops', 'select=email_key,reason,scope,source,created_at'),
  addStop: async (row) => { await dbInsert('relance_stops', { ...row }); },
  runs: (since) => selectAll<RunRow>('relance_runs', `select=started_at,counts&started_at=gte.${enc(since)}`),
  async saveRun(row) {
    try { await dbInsert('relance_runs', { ...row }); } catch (e) { warnOnce('relance_runs (écriture)', e); }
  },
  async activity(since) {
    const rows = await selectAll<{ variables: AccountActivity | null }>('call_events', `select=variables,created_at&kind=eq.${ACTIVITY_KIND}&created_at=gte.${enc(since)}&order=created_at.asc`, 5_000);
    return rows ? rows.map((r) => r.variables).filter((a): a is AccountActivity => Boolean(a?.userId && a?.readAt)) : null;
  },
  async saveActivity(a) {
    try {
      await dbInsert('call_events', {
        kind: ACTIVITY_KIND, external_id: `${a.userId}:${a.readAt.slice(0, 10)}`, status: 'lu', variables: a,
        summary: `Mise en route : ${a.agents} agent(s), ${a.agentsWithNumber} avec numéro, ${a.realCalls ?? '?'} appel(s) réel(s) depuis le ${a.callsSince.slice(0, 10)}`,
      });
    } catch (e) { warnOnce('call_events (mise en route)', e); }
  },
  // Erreur de base : remontée (le moteur la journalise et retente au passage suivant), jamais une alerte en double.
  claimAlert: (key) => dbInsertIfNew('stripe_events', { event_id: `alerte:${key}`, type: 'alerte_equipe', livemode: null, created_at: new Date().toISOString() }, 'event_id'),
  async recheck(email) {
    try {
      const [signup, customers] = await Promise.all([
        dbSelect<{ email: string }>('signups', `select=email&email=eq.${enc(email)}&limit=1`),
        dbSelect<{ customer_id: string }>('stripe_customers', `select=customer_id&email=eq.${enc(email)}`).catch(() => []),
      ]);
      const ids = customers.map((c) => c.customer_id).filter(Boolean);
      const subscriptions = ids.length
        ? await dbSelect<StripeSubscriptionRow>('stripe_subscriptions', `select=*&customer_id=in.(${ids.map((i) => `"${i.replace(/"/g, '')}"`).join(',')})`).catch(() => [])
        : [];
      return { signedUp: signup.length > 0, subscriptions };
    } catch (e) {
      warnOnce('recheck', e);
      return null;
    }
  },
};

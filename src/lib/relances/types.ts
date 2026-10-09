// Types partagés du moteur des relances : lignes lues en base (Supabase), décisions et dépendances injectées
// (base, envoi, comptes white-label, boîte de réception), pour que les tests tournent sans réseau ni envoi réel.
import type { Locale } from '@/i18n/locales';
import type { RelancesContent } from '@/i18n/content/fr';
import type { MailOptions } from '@/lib/server';

/** Séries d’étape de vie (P, I, C, F, U, suivi mensuel M) ; A (mise en route) et S (solde de minutes) courent en
 *  parallèle de l’étape de vie (essai, abonné, paiement à la minute), messages de service seulement. */
export type Seq = 'P' | 'I' | 'C' | 'F' | 'U' | 'M' | 'A' | 'S';
export type Stage = 'prospect' | 'signed_up' | 'trialing' | 'trial_cancelled' | 'paying' | 'payg' | 'churned';
export type LegalBasis = 'consent' | 'b2b_legit_interest' | 'soft_opt_in' | 'inferred_consent' | 'contract';
export type LogStatus = 'queued' | 'sent' | 'dry_run' | 'skipped' | 'failed_retry' | 'failed';

/** Ligne callbacks (colonnes ajoutées plus tard lues si elles existent : locale, locale_source, origin). */
export interface CallbackRow {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  company: string | null;
  sector: string | null;
  slot: string | null;
  note: string | null;
  type: string | null;
  agent: string | null;
  status: string | null;
  created_at: string;
  locale?: string | null;
  locale_source?: string | null;
  origin?: string | null;
}

export interface SignupRow { email: string; name: string | null; signed_up_at: string | null; locale?: string | null }

export interface StripeCustomerRow {
  customer_id: string;
  email: string | null;
  preferred_locale: string | null;
  has_paid: boolean | null;
  has_credit_purchase: boolean | null;
  livemode: boolean | null;
}

export interface StripeSubscriptionRow {
  subscription_id: string;
  customer_id: string | null;
  status: string | null;
  trial_start: string | null;
  trial_end: string | null;
  canceled_at: string | null;
  ended_at: string | null;
  price_amount: number | null;
  currency: string | null;
  billing_interval: string | null;
  livemode: boolean | null;
  /** Annulation demandée, effective à la fin de la période (essai : statut « trialing » jusqu’à la fin). */
  cancel_at_period_end?: boolean | null;
  /** Date de fin programmée (mode de facturation « flexible »), si la colonne existe (migration du 9 oct.). */
  cancel_at?: string | null;
  /** Motif Stripe de la résiliation (cancellation_details.reason : payment_failed, cancellation_requested…). */
  cancellation_reason?: string | null;
  /** Fin de la période en cours (renouvellement), colonne d’origine de la table. */
  current_period_end?: string | null;
  /** Début de l’abonnement (start_date Stripe), si la colonne existe (migration du 9 oct., mise en route). */
  start_date?: string | null;
}

export interface SnapshotRow {
  user_id: string;
  snap_date: string;
  email_key: string | null;
  minutes_balance: number | null;
  credits_balance: number | null;
  platform_created_at: string | null;
}

/** Ligne du journal des accords (src/lib/contacts.ts) ; granted null = mention affichée sans case cochée. */
export interface ConsentRow {
  email_key: string | null;
  channel: string;
  purpose: string;
  granted: boolean | null;
  legal_basis: string | null;
  created_at: string;
}

/** Fiche contact (src/lib/contacts.ts), lue si la table existe : langue sûre, compte de test, provenance. */
export interface ContactRow {
  email_key: string;
  email: string | null;
  first_name?: string | null;
  company?: string | null;
  sector?: string | null;
  locale?: string | null;
  locale_source?: string | null;
  locale_needs_review?: boolean | null;
  origin?: string | null;
  is_test?: boolean | null;
  first_seen_at?: string | null;
  /** Dernier formulaire envoyé (e-mail laissé sur /essai-gratuit : début de la série P « inscription non terminée »). */
  last_interaction_at?: string | null;
}

export interface LogRow {
  email_key: string;
  sequence: Seq;
  step: string;
  dry_run: boolean;
  status: LogStatus;
  category: string | null;
  skip_reason?: string | null;
  attempts?: number | null;
  locale?: string | null;
  subject?: string | null;
  preview?: string | null;
  template_key?: string | null;
  template_version?: string | null;
  legal_basis?: string | null;
  created_at: string;
  sent_at?: string | null;
}

export interface StateRow {
  email_key: string;
  sequence: Seq;
  dry_run: boolean;
  entered_at: string;
  status: 'active' | 'done' | 'stopped';
  stop_reason?: string | null;
}

export interface StopRow { email_key: string; reason: string; scope: 'marketing' | 'all'; source?: string | null; created_at: string }

export interface SettingsRow { enabled: boolean; paused_reason?: string | null; last_report_on?: string | null }

export interface PlatformUser { id: number | string; name: string | null; email: string; minutes_balance: number; credits_balance: number; created_at: string }

/**
 * Mise en route d’un compte de l’espace client, lue une fois par jour (agents, numéros, appels : jeton temporaire du
 * client, src/lib/relances/activity.ts). Une lecture en échec n’est jamais enregistrée comme « 0 agent ».
 */
export interface AccountActivity {
  userId: string;
  /** Moment de la lecture (ISO). */
  readAt: string;
  /** Agents (assistants) du compte, supprimés exclus. */
  agents: number;
  /** Agents reliés à un numéro (phone_number_id). */
  agentsWithNumber: number;
  /** Numéros du compte ; null si la liste n’a pas pu être lue. */
  phoneNumbers: number | null;
  /** Agents mis en pause par le contrôle de conformité Autocalls (compliance_blocked_at), s’il est renvoyé. */
  paused: { name: string; since: string }[];
  /** Appels réels (téléphone, hors tests dans le navigateur) sur la fenêtre lue ; null si les appels sont illisibles. */
  realCalls: number | null;
  /** Date du dernier appel réel lu (ISO), null si aucun ou illisible. */
  lastCallAt: string | null;
  /** Début de la fenêtre des appels lus (ISO). */
  callsSince: string;
}

/** Message reçu dans la boîte contact@ (lecture IMAP seule). */
export interface InboundMail {
  from: string;
  subject: string;
  date: string | null;
  /** Réponse automatique (absence, accusé) : n’arrête pas une séquence. */
  automatic: boolean;
  /** Avis de non-remise (MAILER-DAEMON, postmaster). */
  bounce: boolean;
  /** Adresses trouvées dans le début du corps (destinataire d’un rebond). */
  bodyEmails: string[];
  /** Demande de désinscription envoyée depuis la messagerie (objet « unsubscribe » et équivalents) : préférence
   *  « e-mails essentiels seulement » enregistrée par le moteur, pas une simple réponse. */
  unsubscribe?: boolean;
}

export interface RunRow {
  started_at: string;
  finished_at: string;
  dry_run: boolean;
  status: string;
  counts: Record<string, unknown>;
  decisions: { k: string; s: string; r: string }[];
  errors: string[];
}

/**
 * Accès à la base du moteur. Chaque lecture renvoie null quand la table manque ou est illisible : le moteur
 * se coupe proprement (tables du moteur) ou ignore la source (tables facultatives), sans jamais casser le site.
 */
export interface RelanceStore {
  settings(): Promise<SettingsRow | null>;
  updateSettings(patch: Partial<SettingsRow>): Promise<boolean>;
  callbacks(sinceIso: string): Promise<CallbackRow[] | null>;
  signups(): Promise<SignupRow[] | null>;
  contacts(): Promise<ContactRow[] | null>;
  /** Dernière préférence email par clé (call_events kind=email_pref). */
  emailPrefs(): Promise<Map<string, string> | null>;
  /** Numéros en opposition « ne plus appeler » (call_events kind=optout). */
  phoneOptouts(): Promise<Set<string> | null>;
  consents(): Promise<ConsentRow[] | null>;
  stripe(): Promise<{ customers: StripeCustomerRow[]; subscriptions: StripeSubscriptionRow[]; eventsSeen: boolean } | null>;
  snapshots(sinceDate: string): Promise<SnapshotRow[] | null>;
  saveSnapshots(rows: SnapshotRow[]): Promise<boolean>;
  /** Journal de ce mode, sans les textes rendus (preview). */
  logs(dryRun: boolean): Promise<LogRow[] | null>;
  /** Envois simulés récents avec leur texte rendu (exemples du rapport). */
  logPreviews(sinceIso: string): Promise<LogRow[] | null>;
  insertLogIfNew(row: Partial<LogRow> & Pick<LogRow, 'email_key' | 'sequence' | 'step' | 'dry_run' | 'status'>): Promise<boolean>;
  updateLog(key: { email_key: string; sequence: Seq; step: string; dry_run: boolean }, patch: Partial<LogRow>): Promise<void>;
  states(dryRun: boolean): Promise<StateRow[] | null>;
  insertStateIfNew(row: StateRow): Promise<boolean>;
  updateState(key: { email_key: string; sequence: Seq; dry_run: boolean }, patch: Partial<StateRow>): Promise<void>;
  stops(): Promise<StopRow[] | null>;
  addStop(row: Omit<StopRow, 'created_at'>): Promise<void>;
  runs(sinceIso: string): Promise<RunRow[] | null>;
  saveRun(row: RunRow): Promise<void>;
  /** Relecture juste avant l’envoi : inscription et abonnements Stripe de cette adresse. */
  recheck(email: string): Promise<{ signedUp: boolean; subscriptions: StripeSubscriptionRow[] } | null>;
  /** Lectures de mise en route enregistrées depuis cette date (cache du jour) ; absent ou null : pas de cache. */
  activity?(sinceIso: string): Promise<AccountActivity[] | null>;
  saveActivity?(row: AccountActivity): Promise<void>;
  /**
   * Verrou d’alerte à l’équipe (une seule fois par clé, tous modes et toutes instances confondus) ; vrai la première
   * fois seulement. Absent : aucune alerte de mise en route ni de solde (jamais d’alerte en double).
   */
  claimAlert?(key: string): Promise<boolean>;
}

export interface RelanceConfig {
  /** RELANCES_ENABLED = 1 / true / on ; sinon tout est coupé. */
  envEnabled: boolean;
  /** RELANCES_DRY_RUN : actif par défaut, seul 0 / false / off le coupe. */
  dryRun: boolean;
  /** Marchés ouverts aux e-mails commerciaux (RELANCES_LOCALES). */
  locales: Locale[];
  /** Langues des messages de service (RELANCES_SERVICE_LOCALES, facultatif) : les 7 par défaut. */
  serviceLocales: Locale[];
  sequences: Seq[];
  maxPerRun: number;
  /** Plafond quotidien imposé (sinon montée progressive 20 → 50 → 150). */
  maxPerDay: number | null;
  excludeEmails: string[];
  stripeConfigured: boolean;
  /** Solde de l’agence Autocalls (US$) sous lequel l’équipe est alertée (RELANCES_AGENCY_BALANCE_MIN, facultatif). */
  agencyBalanceMin: number;
}

export interface EngineDeps {
  store: RelanceStore;
  /** Envoi réel : uniquement sendMail (src/lib/server.ts) en production, faux en test. */
  sendMail: (m: MailOptions) => Promise<boolean>;
  /** Équipe prévenue (NOTIFY_TO) : alertes, réponses détectées, rapport quotidien. */
  notifyTeam: (subject: string, text: string, html?: string) => Promise<void>;
  /** Comptes white-label (absent sans AUTOCALLS_API_KEY). */
  platformUsers?: () => Promise<PlatformUser[]>;
  /** Mise en route d’un compte : agents, numéros, appels (absent sans AUTOCALLS_API_KEY : série A en attente). */
  accountActivity?: (userId: string, now: Date) => Promise<AccountActivity>;
  /** Solde de l’agence Autocalls en US$ (null si illisible ; absent sans AUTOCALLS_API_KEY). */
  agencyBalance?: () => Promise<number | null>;
  /** Lecture de la boîte contact@ (absente sans variables IMAP). */
  inbound?: (sinceDays: number) => Promise<InboundMail[]>;
  /** Préférence « e-mails essentiels seulement » d’une adresse qui s’est désinscrite par sa messagerie (call_events
   *  kind email_pref, src/lib/emailPrefs.ts) ; absente : l’arrêt est enregistré et l’équipe prévenue de le reporter. */
  saveEmailPref?: (email: string, source: string) => Promise<unknown>;
  /** Textes d’une langue ; null = langue pas encore traduite (rien n’est envoyé, jamais une autre langue). */
  content: (locale: Locale) => RelancesContent | null;
  emailKey: (email: string) => string;
  now: () => Date;
  sleep: (ms: number) => Promise<void>;
  config: RelanceConfig;
  log?: (msg: string) => void;
  /** Journal des erreurs du passage (console.error par défaut : visibles dans les journaux App Hosting). */
  logError?: (msg: string) => void;
}

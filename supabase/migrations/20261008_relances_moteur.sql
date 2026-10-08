-- 8 oct. 2026 — Moteur des relances (src/lib/relances, POST /api/cron/relances) et webhook Stripe (/api/webhooks/stripe).
-- À exécuter une fois dans Supabase (SQL Editor). Idempotent : peut être relancé sans effet de bord.
-- Tant que ces tables n’existent pas, le site fonctionne normalement : la route des relances répond « not_installed »
-- et n’envoie rien, le webhook Stripe accuse réception sans rien enregistrer (une alerte est envoyée à l’équipe).
-- Aucune liste de contacts ni aucun journal d’envoi n’est versionné dans le dépôt (public) : tout reste dans cette base.

-- 1. Interrupteur en base (coupure sans redéploiement), en plus de la variable RELANCES_ENABLED.
--    Ligne unique id = 1, créée COUPÉE : le propriétaire passe enabled à true quand il le décide.
CREATE TABLE IF NOT EXISTS relance_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  paused_reason TEXT,              -- rempli par le disjoncteur (rebonds) quand il coupe les envois
  last_report_on DATE,             -- date (Paris) du dernier rapport quotidien envoyé à l’équipe
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
INSERT INTO relance_settings (id, enabled) VALUES (1, FALSE) ON CONFLICT (id) DO NOTHING;

-- 2. Séquence suivie par contact (une ligne par contact, séquence et mode ; dry_run = mode test).
--    email_key = HMAC de l’adresse (src/lib/emailPrefs.ts), jamais l’adresse en clair.
CREATE TABLE IF NOT EXISTS relance_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_key TEXT NOT NULL,
  sequence TEXT NOT NULL,          -- P | I | C | F | U | M
  dry_run BOOLEAN NOT NULL DEFAULT TRUE,
  entered_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active | done | stopped
  stop_reason TEXT,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS uniq_relance_state ON relance_state(email_key, sequence, dry_run);

-- 3. Journal des envois : une ligne par contact, séquence, étape et mode (idempotence : jamais deux envois de la
--    même étape). status : queued | sent | dry_run | skipped | failed_retry | failed.
CREATE TABLE IF NOT EXISTS relance_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_key TEXT NOT NULL,
  sequence TEXT NOT NULL,
  step TEXT NOT NULL,              -- P1…P7, I1…I7, C1…C5, F1…F7, U1…U6, M1…M4
  dry_run BOOLEAN NOT NULL DEFAULT TRUE,
  channel TEXT NOT NULL DEFAULT 'email',
  template_key TEXT,               -- clé du texte utilisé (ex. P3_generic)
  template_version TEXT,
  locale TEXT,
  legal_basis TEXT,                -- consent | b2b_legit_interest | soft_opt_in | inferred_consent | contract
  category TEXT,                   -- essential | marketing
  status TEXT NOT NULL,
  skip_reason TEXT,
  attempts INT NOT NULL DEFAULT 0,
  subject TEXT,
  preview TEXT,                    -- texte rendu, seulement en mode test (relecture du rapport quotidien)
  provider_message_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS uniq_relance_log ON relance_log(email_key, sequence, step, dry_run);
CREATE INDEX IF NOT EXISTS idx_relance_log_created ON relance_log(created_at);

-- 4. Arrêts au niveau du contact (réponse reçue, rebond), valables dans les deux modes.
CREATE TABLE IF NOT EXISTS relance_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_key TEXT NOT NULL,
  reason TEXT NOT NULL,            -- replied | bounced | manual
  scope TEXT NOT NULL DEFAULT 'marketing', -- marketing | all
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_relance_stops_key ON relance_stops(email_key);

-- 5. Passages du moteur : compteurs et décisions (motifs des étapes sautées ou en attente).
CREATE TABLE IF NOT EXISTS relance_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  finished_at TIMESTAMP WITH TIME ZONE,
  dry_run BOOLEAN,
  status TEXT,                     -- disabled | not_installed | done | halted | error
  counts JSONB DEFAULT '{}'::jsonb,
  decisions JSONB DEFAULT '[]'::jsonb,
  errors JSONB DEFAULT '[]'::jsonb
);
CREATE INDEX IF NOT EXISTS idx_relance_runs_started ON relance_runs(started_at);

-- 6. Instantané quotidien des comptes white-label (GET /white-label/users) : minutes et crédits par jour.
CREATE TABLE IF NOT EXISTS platform_user_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  snap_date DATE NOT NULL,
  email_key TEXT,
  minutes_balance NUMERIC,
  credits_balance NUMERIC,
  platform_created_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS uniq_platform_user_snapshots ON platform_user_snapshots(user_id, snap_date);

-- 7. Stripe du compte Permanence IA (webhook signé /api/webhooks/stripe).
CREATE TABLE IF NOT EXISTS stripe_customers (
  customer_id TEXT PRIMARY KEY,
  email TEXT,                      -- en minuscules, pour le rapprochement avec signups et callbacks
  preferred_locale TEXT,
  has_paid BOOLEAN NOT NULL DEFAULT FALSE,
  has_credit_purchase BOOLEAN NOT NULL DEFAULT FALSE,
  livemode BOOLEAN,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_email ON stripe_customers(email);

CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  subscription_id TEXT PRIMARY KEY,
  customer_id TEXT,
  status TEXT,                     -- trialing | active | past_due | unpaid | canceled | incomplete…
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN,
  canceled_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  price_amount INT,                -- montant du prix en centimes
  currency TEXT,
  billing_interval TEXT,           -- month | year
  price_id TEXT,
  product_id TEXT,
  livemode BOOLEAN,
  last_event_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_customer ON stripe_subscriptions(customer_id);

CREATE TABLE IF NOT EXISTS stripe_events (
  event_id TEXT PRIMARY KEY,
  type TEXT,
  livemode BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Les tables contacts et consents (fiche par adresse, journal des accords) viennent de
-- 20261008_relances_capture.sql : le moteur les lit si elles existent. Sans accord enregistré dans consents,
-- aucun e-mail marketing ne part (seulement les messages de service).

-- Sécurité : accès uniquement par la clé service, côté serveur.
ALTER TABLE relance_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE relance_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE relance_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE relance_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE relance_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_user_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;
GRANT ALL ON relance_settings, relance_state, relance_log, relance_stops, relance_runs, platform_user_snapshots,
  stripe_customers, stripe_subscriptions, stripe_events TO service_role;

-- ==============================================================================
-- Permanence IA — Supabase PostgreSQL Schema
-- Tables: users, subscriptions, api_calls, trials
-- ==============================================================================

-- 1. Table Users (Comptes d'essai et abonnés)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  sector TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. Table Subscriptions (Abonnements Stripe synchronisés par webhook)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL, -- 'trialing', 'active', 'past_due', 'canceled'
  plan TEXT NOT NULL, -- 'receptionniste', 'assistant', 'centre'
  price_monthly_eur NUMERIC(10, 2) NOT NULL,
  usage_minutes_month INT DEFAULT 0,
  agents_allowed INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancel_at TIMESTAMP WITH TIME ZONE
);

-- 3. Table API Calls (Historique des appels et retranscriptions)
CREATE TABLE IF NOT EXISTS api_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  agent_id TEXT,
  caller_number TEXT,
  call_duration_seconds INT DEFAULT 0,
  transcript TEXT,
  summary TEXT,
  sentiment_score FLOAT, -- -1.0 (très négatif) à +1.0 (très positif)
  is_urgent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Table Trials (Suivi des essais gratuits 7 jours)
CREATE TABLE IF NOT EXISTS trials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  converted_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' -- 'active', 'expired', 'converted'
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_api_calls_user_id ON api_calls(user_id);
CREATE INDEX IF NOT EXISTS idx_trials_user_id ON trials(user_id);

-- 5. Table Callbacks (demandes de rappel, règle zéro numéro public)
CREATE TABLE IF NOT EXISTS callbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  company TEXT,
  sector TEXT,
  slot TEXT DEFAULT 'asap',
  note TEXT,
  type TEXT NOT NULL DEFAULT 'commercial', -- 'commercial', 'support'
  agent TEXT,
  consent_call BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'scheduled', 'done', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE callbacks ENABLE ROW LEVEL SECURITY; -- accès uniquement via la clé service
CREATE INDEX IF NOT EXISTS idx_callbacks_status ON callbacks(status);

-- Sécurité : RLS activé sur toutes les tables (accès via la clé service côté serveur uniquement)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE trials ENABLE ROW LEVEL SECURITY;

-- Droits pour la clé serveur (nécessaire si « Automatically expose new tables » est désactivé)
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;

-- 6. Inscriptions à l'espace client (webhook « User Signup ») et relances d'essai
CREATE TABLE IF NOT EXISTS signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT,
  signed_up_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  trial_minutes INT DEFAULT 0,
  reminder_sent_at TIMESTAMP WITH TIME ZONE,
  ended_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS uniq_signups_email ON signups(email);

-- 7. Appels et conversations des agents (webhooks post-call et conversation ended)
CREATE TABLE IF NOT EXISTS call_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL DEFAULT 'call',
  external_id TEXT,
  assistant_id TEXT, -- UUID Autocalls (BIGINT avant la migration du 8 oct. 2026)
  assistant_name TEXT,
  customer_phone TEXT,
  duration_seconds INT,
  status TEXT,
  outcome TEXT,
  summary TEXT,
  variables JSONB DEFAULT '{}'::jsonb,
  transcript TEXT,
  recording_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_call_events_outcome ON call_events(outcome);

ALTER TABLE signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_events ENABLE ROW LEVEL SECURITY;
GRANT ALL ON signups, call_events TO service_role;

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

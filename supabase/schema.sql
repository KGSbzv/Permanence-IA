-- ==============================================================================
-- Permanence IA — Supabase PostgreSQL Schema
-- Tables: users, subscriptions, api_calls, trials, callbacks, signups, call_events
--
-- État au 8 oct. 2026 : le code du site utilise callbacks, signups et call_events, plus les
-- tables des relances créées par les migrations du 8 oct. (section 8 en fin de fichier). Les tables users, subscriptions, api_calls et trials,
-- ainsi que signups.trial_minutes, reminder_sent_at et ended_sent_at, sont RÉSERVÉES aux
-- relances d'essai et de minutes (aucune tâche planifiée ne les remplit encore). Elles sont
-- conservées en attendant la décision du propriétaire : ne pas les supprimer sans elle.
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

-- 4. Table Trials (Suivi des essais gratuits 14 jours (30 min))
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
  -- Colonnes réservées aux relances d'essai (non remplies à ce jour, voir l'en-tête).
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

-- ==============================================================================
-- 8. Migrations du 8 oct. 2026 (supabase/migrations/, à exécuter dans le SQL Editor)
-- Résumé de ce qu'elles créent ; la définition exacte (types, index, valeurs par
-- défaut) reste dans les fichiers de migration, qui font foi.
-- ==============================================================================
--
-- 20261008_call_events_assistant_id_text.sql
--   call_events.assistant_id : BIGINT → TEXT (UUID des agents Autocalls).
--
-- 20261008_relances_capture.sql — collecte (langue, provenance, accords)
--   callbacks, colonnes ajoutées :
--     locale                     fr | en-gb | en-au | it | pl | nl | he
--     locale_source              site_form | agent_call | phone_prefix | picker | manual | unknown
--     locale_needs_review        BOOLEAN (indicatif ambigu : langue à choisir à la main)
--     origin                     callback | demo | agent_lead | trial_request | contact
--     demo_lang                  langue choisie pour l'appel de démo (locale = langue du site)
--     origin_page, referrer      page du formulaire (sans paramètres), site d'origine (sans requête)
--     utm_source, utm_medium, utm_campaign
--     marketing_email_consent, marketing_whatsapp_consent   BOOLEAN (NULL : question non posée)
--   signups, colonnes ajoutées :
--     locale, locale_source, origin_page, autocalls_user_id, phone, matched_callback_id (UUID de la demande rapprochée)
--   contacts  : une ligne par adresse (email_key = HMAC unique), langue et provenance, origine
--               (… | signup | trial_signup), UTM, étape de vie (stage), liens Autocalls et Stripe, is_test, stop_reason.
--   consents  : journal des accords marketing (ajout seul) : canal, finalité, accord, base légale, version du texte,
--               source, identifiant d'appel, empreinte de l'adresse IP.
--
-- 20261008_relances_moteur.sql — moteur des relances et Stripe
--   relance_settings         interrupteur en base (ligne unique id = 1, créée coupée)
--   relance_state            série suivie par contact (P, I, C, F, U, M), mode test ou réel
--   relance_log              journal des envois (une ligne par contact, série, étape et mode)
--   relance_stops            arrêts au niveau du contact (réponse, rebond, manuel)
--   relance_runs             passages du moteur (compteurs, décisions, erreurs)
--   platform_user_snapshots  instantané quotidien des comptes white-label (minutes, crédits)
--   stripe_customers         clients Stripe (email, langue préférée, a payé)
--   stripe_subscriptions     abonnements (statut, essai, prix, période)
--   stripe_events            événements Stripe déjà traités (idempotence du webhook)
--
-- Toutes ces tables : RLS activé, accès par la clé service uniquement.

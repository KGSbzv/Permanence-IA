-- 8 oct. 2026 — Relances, côté collecte : langue et provenance des demandes et des inscrits, fiche contact par
-- adresse email et journal des accords marketing. Les tables du moteur (relance_settings, relance_state, relance_log,
-- Stripe, instantanés des comptes) sont dans 20261008_relances_moteur.sql. Conception : docs/relances/conception-2026-10-08.md.
-- À exécuter une fois dans Supabase (SQL Editor) par le propriétaire, dans n’importe quel ordre avec l’autre fichier.
-- Idempotent : peut être relancé sans effet (IF NOT EXISTS partout).
--
-- Avant cette migration, le site fonctionne comme avant : les demandes de rappel sont enregistrées sans les nouvelles
-- colonnes et les écritures dans contacts / consents sont sautées (src/lib/contacts.ts, une ligne de journal par table).
-- Après : rien n’est envoyé pour autant. Ces tables ne font qu’enregistrer ; les relances restent coupées tant que
-- RELANCES_ENABLED n’est pas posée ET que relance_settings.enabled n’est pas à true, et en mode test tant que
-- RELANCES_DRY_RUN n’est pas explicitement coupée.
--
-- Données personnelles : le dépôt est public, ce fichier ne contient que la structure. Accès par la clé service
-- uniquement (RLS activé, aucune règle pour les rôles publics).

-- 1. Demandes de rappel : langue (avec sa provenance), page d’origine, UTM, accords marketing --------------------------
ALTER TABLE callbacks ADD COLUMN IF NOT EXISTS locale TEXT;                 -- fr | en-gb | en-au | it | pl | nl | he (fr écrit en clair)
ALTER TABLE callbacks ADD COLUMN IF NOT EXISTS locale_source TEXT;          -- site_form | agent_call | phone_prefix | picker | manual | unknown
ALTER TABLE callbacks ADD COLUMN IF NOT EXISTS locale_needs_review BOOLEAN NOT NULL DEFAULT FALSE; -- indicatif ambigu : langue à choisir à la main
ALTER TABLE callbacks ADD COLUMN IF NOT EXISTS origin TEXT;                 -- callback | demo | agent_lead | trial_request | contact
ALTER TABLE callbacks ADD COLUMN IF NOT EXISTS demo_lang TEXT;              -- démo : langue choisie pour l’appel (locale = langue du site)
ALTER TABLE callbacks ADD COLUMN IF NOT EXISTS origin_page TEXT;            -- chemin de la page du formulaire (sans paramètres)
ALTER TABLE callbacks ADD COLUMN IF NOT EXISTS referrer TEXT;               -- domaine et chemin du site d’origine (sans requête)
ALTER TABLE callbacks ADD COLUMN IF NOT EXISTS utm_source TEXT;
ALTER TABLE callbacks ADD COLUMN IF NOT EXISTS utm_medium TEXT;
ALTER TABLE callbacks ADD COLUMN IF NOT EXISTS utm_campaign TEXT;
ALTER TABLE callbacks ADD COLUMN IF NOT EXISTS marketing_email_consent BOOLEAN;     -- case cochée (NULL : question non posée)
ALTER TABLE callbacks ADD COLUMN IF NOT EXISTS marketing_whatsapp_consent BOOLEAN;
CREATE INDEX IF NOT EXISTS idx_callbacks_email ON callbacks (lower(email));
CREATE INDEX IF NOT EXISTS idx_callbacks_phone ON callbacks (phone);

-- 2. Inscriptions : langue, provenance, lien vers le compte de l’app et vers la demande d’origine ---------------------
ALTER TABLE signups ADD COLUMN IF NOT EXISTS locale TEXT;
ALTER TABLE signups ADD COLUMN IF NOT EXISTS locale_source TEXT;
ALTER TABLE signups ADD COLUMN IF NOT EXISTS origin_page TEXT;
ALTER TABLE signups ADD COLUMN IF NOT EXISTS autocalls_user_id TEXT;
ALTER TABLE signups ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE signups ADD COLUMN IF NOT EXISTS matched_callback_id UUID;

-- 3. Contacts : une ligne par adresse email (minuscules), clé email_key = HMAC (même clé que les préférences email) -----
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_key TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  first_name TEXT,
  company TEXT,
  sector TEXT,                                       -- slug du site
  phone_e164 TEXT,
  locale TEXT,
  locale_source TEXT,
  locale_needs_review BOOLEAN NOT NULL DEFAULT FALSE,
  country TEXT,                                      -- ISO, d’après l’indicatif
  origin TEXT,                                       -- callback | demo | agent_lead | trial_request | contact | signup
  origin_page TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  first_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_interaction_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  stage TEXT NOT NULL DEFAULT 'prospect',            -- prospect | signed_up | trialing | trial_cancelled | paying | payg
  stage_source TEXT,                                 -- stripe | white_label | signup | manual
  autocalls_user_id TEXT,
  stripe_customer_id TEXT,
  trial_end TIMESTAMP WITH TIME ZONE,
  plan_slug TEXT,
  minutes_flag_exhausted BOOLEAN NOT NULL DEFAULT FALSE,
  is_test BOOLEAN NOT NULL DEFAULT FALSE,            -- comptes de test du propriétaire : jamais de relance
  stop_reason TEXT,                                  -- replied | unsubscribed | opted_out | bounced | complaint | manual…
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_contacts_stage ON contacts (stage);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts (phone_e164);
CREATE INDEX IF NOT EXISTS idx_contacts_review ON contacts (locale_needs_review) WHERE locale_needs_review;

-- updated_at tenu à jour à chaque modification.
CREATE OR REPLACE FUNCTION relances_touch_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at := NOW(); RETURN NEW; END $$;
DROP TRIGGER IF EXISTS trg_contacts_updated_at ON contacts;
CREATE TRIGGER trg_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION relances_touch_updated_at();

-- 4. Journal des accords (RGPD art. 7 : preuve) — ajout seul, jamais modifié -------------------------------------------
-- granted : true = case cochée ou oui explicite à un agent ; false = refus ; NULL = aucun choix exprimé, seule la mention
-- d’information (avec droit de refus) était affichée. La désinscription (call_events kind=email_pref) et l’opposition
-- téléphonique (call_events kind=optout) restent lues comme des refus par le moteur de relances.
CREATE TABLE IF NOT EXISTS consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_key TEXT,
  phone_e164 TEXT,                                   -- accords WhatsApp ou téléphone
  channel TEXT NOT NULL,                             -- email | whatsapp | phone
  purpose TEXT NOT NULL,                             -- marketing | account_alerts
  granted BOOLEAN,
  legal_basis TEXT,                                  -- consent | b2b_legit_interest | soft_opt_in | inferred_consent | contract
  notice_shown BOOLEAN NOT NULL DEFAULT FALSE,
  text_version TEXT,                                 -- MARKETING_TEXT_VERSION (src/lib/contacts.ts)
  locale TEXT,
  source TEXT,                                       -- « site:demo:/demo », « agent:save_lead:WhatsApp »…
  call_id TEXT,                                      -- identifiant de l’appel ou de la conversation (accord oral)
  ip_hash TEXT,                                      -- HMAC de l’adresse IP, jamais l’adresse en clair
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT consents_who CHECK (email_key IS NOT NULL OR phone_e164 IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS idx_consents_email ON consents (email_key, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consents_phone ON consents (phone_e164, created_at DESC);

-- 5. Sécurité : accès par la clé service uniquement ----------------------------------------------------------------------
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;
GRANT ALL ON contacts, consents TO service_role;

-- Recharge le cache de schéma de l’API (sinon les nouvelles colonnes peuvent rester invisibles quelques minutes).
NOTIFY pgrst, 'reload schema';

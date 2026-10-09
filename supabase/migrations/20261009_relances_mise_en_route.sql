-- 9 oct. 2026 — Mise en route des abonnés (audit des parcours, § 7 et action 6) : date de début de l’abonnement.
-- À exécuter une fois dans Supabase (SQL Editor). Idempotent : peut être relancé sans effet de bord.
-- Facultatif : sans cette colonne, le webhook Stripe enregistre les abonnements sans elle (journal « colonnes … absentes »)
-- et la série A d’un abonnement souscrit sans essai démarre au premier passage horaire qui le voit (au lieu de sa date
-- de début). Les lectures quotidiennes des agents (call_events kind 'activite_compte') et les verrous d’alerte
-- (stripe_events « alerte:… ») n’ont besoin d’aucune migration.

-- Début de l’abonnement (start_date de Stripe) : point de départ (J0) de la série A quand il n’y a pas eu d’essai.
ALTER TABLE stripe_subscriptions ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE;

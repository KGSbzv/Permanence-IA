-- 9 oct. 2026 — Annulation d’un essai et motif de résiliation (audit des parcours, action 8 et défaut « F1 après un
-- paiement refusé »). À exécuter une fois dans Supabase (SQL Editor). Idempotent : peut être relancé sans effet de bord.
-- Facultatif : sans ces colonnes, le webhook Stripe enregistre les abonnements sans elles (journal « colonnes … absentes »)
-- et le moteur des relances se fonde sur cancel_at_period_end (déjà enregistré) et sur la date de fin de l’abonnement.

-- Date de fin programmée (facturation « flexible » de Stripe : la résiliation en fin de période y est portée par
-- cancel_at) et motif Stripe de la résiliation (cancellation_details.reason : cancellation_requested, payment_failed…).
ALTER TABLE stripe_subscriptions ADD COLUMN IF NOT EXISTS cancel_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE stripe_subscriptions ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;

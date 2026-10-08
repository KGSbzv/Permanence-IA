-- 8 oct. 2026 — call_events.assistant_id : BIGINT → TEXT.
-- Autocalls envoie l’identifiant de l’agent sous forme d’UUID ; la colonne BIGINT refusait chaque webhook
-- (erreur 22P02). Le code réenregistre déjà sans assistant_id en attendant (UUID gardé dans variables.assistant_uuid).
-- À exécuter une fois dans Supabase (SQL Editor). Aucune donnée perdue : les entiers existants deviennent du texte.
ALTER TABLE call_events ALTER COLUMN assistant_id TYPE TEXT USING assistant_id::text;

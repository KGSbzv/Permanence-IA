// Réglages du moteur des relances, lus dans les variables d’environnement (noms dans .env.example).
// Par défaut tout est COUPÉ et en MODE TEST : rien ne part vers un prospect ou un client tant que le propriétaire
// n’a pas mis RELANCES_ENABLED=1, relance_settings.enabled=true en base ET RELANCES_DRY_RUN=0.
import { isLocale, type Locale } from '@/i18n/locales';
import type { RelanceConfig, Seq } from './types';

const ON = /^(1|true|on|yes|oui)$/i;
const OFF = /^(0|false|off|no|non)$/i;
const ALL_SEQUENCES: Seq[] = ['P', 'I', 'C', 'F', 'U', 'M'];
/** Marchés ouverts au départ (conception du 8 oct.) : it, pl, nl, he après la case de consentement. */
const DEFAULT_LOCALES: Locale[] = ['fr', 'en-gb', 'en-au'];

/** Débit maximal tant que l’envoi passe par la boîte Zoho (envois groupés interdits). */
export const HARD_MAX_PER_RUN = 20;
export const HARD_MAX_PER_DAY = 150;

const list = (v: string | undefined) => String(v ?? '').split(',').map((s) => s.trim()).filter(Boolean);
const int = (v: string | undefined) => (v && /^\d+$/.test(v.trim()) ? Number(v.trim()) : null);

export function readConfig(env: Record<string, string | undefined> = process.env): RelanceConfig {
  const locales = list(env.RELANCES_LOCALES).map((s) => s.toLowerCase()).filter(isLocale);
  const sequences = list(env.RELANCES_SEQUENCES).map((s) => s.toUpperCase()).filter((s): s is Seq => (ALL_SEQUENCES as string[]).includes(s));
  const perRun = int(env.RELANCES_MAX_PER_RUN);
  const perDay = int(env.RELANCES_MAX_PER_DAY);
  return {
    envEnabled: ON.test(String(env.RELANCES_ENABLED ?? '').trim()),
    // Mode test par défaut : seule une valeur explicitement négative l’enlève.
    dryRun: !OFF.test(String(env.RELANCES_DRY_RUN ?? '').trim()),
    locales: env.RELANCES_LOCALES ? locales : DEFAULT_LOCALES,
    sequences: env.RELANCES_SEQUENCES ? sequences : ALL_SEQUENCES,
    maxPerRun: Math.min(perRun ?? HARD_MAX_PER_RUN, HARD_MAX_PER_RUN),
    maxPerDay: perDay == null ? null : Math.min(perDay, HARD_MAX_PER_DAY),
    excludeEmails: list(env.RELANCES_EXCLUDE_EMAILS).map((s) => s.toLowerCase()),
    stripeConfigured: Boolean(env.STRIPE_WEBHOOK_SECRET),
  };
}

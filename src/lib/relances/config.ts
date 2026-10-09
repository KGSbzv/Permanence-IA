// Réglages du moteur des relances, lus dans les variables d’environnement (noms dans .env.example).
// Par défaut tout est COUPÉ et en MODE TEST : rien ne part vers un prospect ou un client tant que le propriétaire
// n’a pas mis RELANCES_ENABLED=1, relance_settings.enabled=true en base ET RELANCES_DRY_RUN=0.
// RELANCES_LOCALES n’ouvre que les e-mails commerciaux ; les messages de service (I1, C1 à C5, F1, U1) partent dans
// les 7 langues (RELANCES_SERVICE_LOCALES, facultatif, peut en retirer une le temps d’une relecture).
import { LOCALES, isLocale, type Locale } from '@/i18n/locales';
import type { RelanceConfig, Seq } from './types';

const ON = /^(1|true|on|yes|oui)$/i;
const OFF = /^(0|false|off|no|non)$/i;
// A (mise en route) et S (solde de minutes) : messages de service, ouverts par défaut comme les autres séries.
const ALL_SEQUENCES: Seq[] = ['P', 'I', 'C', 'F', 'U', 'M', 'A', 'S'];
/** Marchés ouverts au départ (conception du 8 oct.) : it, pl, nl, he après la case de consentement. */
const DEFAULT_LOCALES: Locale[] = ['fr', 'en-gb', 'en-au'];
/** Langue des messages de service quand celle du contact est inconnue (audit du 9 oct. : anglais). */
export const SERVICE_FALLBACK_LOCALE: Locale = 'en-gb';

/** Débit maximal tant que l’envoi passe par la boîte Zoho (envois groupés interdits). */
export const HARD_MAX_PER_RUN = 20;
export const HARD_MAX_PER_DAY = 150;
/** Solde de l’agence Autocalls (US$) sous lequel l’équipe est alertée, si RELANCES_AGENCY_BALANCE_MIN est absente. */
export const DEFAULT_AGENCY_BALANCE_MIN = 300;

const list = (v: string | undefined) => String(v ?? '').split(',').map((s) => s.trim()).filter(Boolean);
const int = (v: string | undefined) => (v && /^\d+$/.test(v.trim()) ? Number(v.trim()) : null);

export function readConfig(env: Record<string, string | undefined> = process.env): RelanceConfig {
  const locales = list(env.RELANCES_LOCALES).map((s) => s.toLowerCase()).filter(isLocale);
  const serviceLocales = list(env.RELANCES_SERVICE_LOCALES).map((s) => s.toLowerCase()).filter(isLocale);
  const sequences = list(env.RELANCES_SEQUENCES).map((s) => s.toUpperCase()).filter((s): s is Seq => (ALL_SEQUENCES as string[]).includes(s));
  const perRun = int(env.RELANCES_MAX_PER_RUN);
  const perDay = int(env.RELANCES_MAX_PER_DAY);
  return {
    envEnabled: ON.test(String(env.RELANCES_ENABLED ?? '').trim()),
    // Mode test par défaut : seule une valeur explicitement négative l’enlève.
    dryRun: !OFF.test(String(env.RELANCES_DRY_RUN ?? '').trim()),
    locales: env.RELANCES_LOCALES ? locales : DEFAULT_LOCALES,
    serviceLocales: env.RELANCES_SERVICE_LOCALES ? serviceLocales : [...LOCALES],
    sequences: env.RELANCES_SEQUENCES ? sequences : ALL_SEQUENCES,
    maxPerRun: Math.min(perRun ?? HARD_MAX_PER_RUN, HARD_MAX_PER_RUN),
    maxPerDay: perDay == null ? null : Math.min(perDay, HARD_MAX_PER_DAY),
    excludeEmails: list(env.RELANCES_EXCLUDE_EMAILS).map((s) => s.toLowerCase()),
    stripeConfigured: Boolean(env.STRIPE_WEBHOOK_SECRET),
    agencyBalanceMin: int(env.RELANCES_AGENCY_BALANCE_MIN) ?? DEFAULT_AGENCY_BALANCE_MIN,
  };
}

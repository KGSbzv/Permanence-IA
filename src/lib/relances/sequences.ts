// Calendrier des séries (conception du 8 oct. 2026) : délai de chaque étape depuis l’entrée dans la série,
// fenêtre d’envoi (service : 8 h–20 h tous les jours ; marketing : 9 h–11 h jours ouvrés), et délai au-delà duquel
// une étape non envoyée est abandonnée (jamais de rattrapage en rafale, jamais d’envoi rétroactif).
import type { RelanceKey } from '@/i18n/content/fr';
import type { Locale } from '@/i18n/locales';
import { MARKETS } from '@/i18n/markets';
import type { Seq } from './types';

const DAY = 86_400_000;

export interface StepDef {
  seq: Seq;
  /** Nom de l’étape dans le journal (P1, C4, M2…). */
  step: string;
  /** Texte utilisé ; P3 devient P3_generic sans secteur connu, M choisit prospect ou account. */
  key: RelanceKey | 'M';
  /** Délai depuis l’entrée dans la série (jours) ; null = événement (C4) ou date calculée (C5). */
  offsetDays: number | null;
  /** Message de service (I1, C1–C5, F1, U1) : fenêtre 8 h–20 h, tous les jours. */
  service: boolean;
  /** Jours après l’échéance au-delà desquels l’étape est abandonnée (« stale »). */
  staleDays: number;
  /** Exige l’état Stripe (webhook branché) pour être sûr de l’étape de vie. */
  needsStripe: boolean;
}

const series = (seq: Seq, offsets: number[], service: number[] = [], needsStripe: (i: number) => boolean = () => false): StepDef[] =>
  offsets.map((offset, i) => ({
    seq, step: `${seq}${i + 1}`, key: `${seq}${i + 1}` as RelanceKey, offsetDays: offset,
    service: service.includes(i + 1), staleDays: service.includes(i + 1) ? 3 : 7, needsStripe: needsStripe(i + 1),
  }));

export const STEPS: Record<Exclude<Seq, 'M'>, StepDef[]> = {
  // Prospects : J+1 (après le rappel effectué ou le créneau), puis J+4, 9, 16, 25, 38, 55.
  P: series('P', [1, 4, 9, 16, 25, 38, 55]),
  // Inscrits sans essai : I1 (service) seul tant que Stripe n’est pas branché.
  I: series('I', [1, 3, 7, 14, 24, 40, 58], [1], (n) => n > 1),
  // Essai en cours : C4 sur événement (5 minutes ou moins), C5 trois jours avant la fin de l’essai.
  C: [
    { seq: 'C', step: 'C1', key: 'C1', offsetDays: 0, service: true, staleDays: 2, needsStripe: true },
    { seq: 'C', step: 'C2', key: 'C2', offsetDays: 2, service: true, staleDays: 2, needsStripe: true },
    { seq: 'C', step: 'C3', key: 'C3', offsetDays: 5, service: true, staleDays: 3, needsStripe: true },
    { seq: 'C', step: 'C4', key: 'C4', offsetDays: null, service: true, staleDays: 14, needsStripe: true },
    { seq: 'C', step: 'C5', key: 'C5', offsetDays: null, service: true, staleDays: 2, needsStripe: true },
  ],
  // Essai annulé sans paiement.
  F: series('F', [1, 5, 12, 20, 30, 45, 60], [1], () => true),
  // Comptes à l’usage peu actifs (U3 avancé dès 254 minutes consommées sur 30 jours).
  U: series('U', [0, 7, 16, 28, 42, 58], [1], () => true),
};

/** Suivi mensuel : 4 envois au plus, 30 jours après la fin d’une série P, I, F ou U, puis tous les 30 jours. */
export const MONTHLY_STEPS: StepDef[] = [1, 2, 3, 4].map((n) => ({
  seq: 'M', step: `M${n}`, key: 'M', offsetDays: 30 * n, service: false, staleDays: 7, needsStripe: false,
}));

/** Priorité quand un contact pourrait être dans plusieurs séries : une seule à la fois. */
export const PRIORITY: Seq[] = ['C', 'F', 'U', 'I', 'P'];

export const stepsOf = (seq: Seq) => (seq === 'M' ? MONTHLY_STEPS : STEPS[seq]);

/** Échéance d’une étape à délai fixe. */
export const dueAt = (entered: Date, s: StepDef) => (s.offsetDays == null ? null : new Date(entered.getTime() + s.offsetDays * DAY));

/** C5 : trois jours avant la fin de l’essai (Stripe envoie déjà son rappel, en anglais, sept jours avant). */
export const C5_DAYS_BEFORE_END = 3;
/** C4 : minutes d’essai restantes au plus. */
export const C4_MINUTES_LEFT = 5;
/** U : moins de 10 minutes sur 30 jours = peu actif ; 60 ou plus = usage régulier (sortie). */
export const U_LOW_USAGE = 10;
export const U_REGULAR_USAGE = 60;
/** U3 avancé au seuil où Réceptionniste coûte moins cher que l’usage (prix ÷ minute à l’usage, lus dans markets.ts). */
export function uHeavyUsage(locale: Locale) {
  const m = MARKETS[locale];
  const price = m.plans.receptionniste.price;
  return price && m.paygMinute ? Math.round(price / m.paygMinute) : Infinity;
}
/** U : compte créé depuis au moins 14 jours. */
export const U_MIN_ACCOUNT_AGE_DAYS = 14;

export { DAY };

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
  /** Message de service (I1, C1–C5, F1, U1, A, S) : fenêtre 8 h–20 h, tous les jours. */
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
  // Mise en route (audit du 9 oct., § 7), en parallèle de C, d’un abonnement ou du paiement à la minute, depuis le
  // début de l’essai, de l’abonnement ou du premier achat de crédit : A1 J+1, A2 J+3 et A3 J+7 tant qu’aucun agent
  // n’existe ; A4 J+10 si l’agent n’a pas de numéro ou n’a reçu aucun appel réel. A5 (J+14) et le renouvellement sans
  // appel ne sont que des alertes à l’équipe. Messages de service : A3, A4 et le suivi mensuel sautés après désinscription.
  A: [
    { seq: 'A', step: 'A1', key: 'A1', offsetDays: 1, service: true, staleDays: 2, needsStripe: true },
    { seq: 'A', step: 'A2', key: 'A2', offsetDays: 3, service: true, staleDays: 3, needsStripe: true },
    { seq: 'A', step: 'A3', key: 'A3', offsetDays: 7, service: true, staleDays: 3, needsStripe: true },
    { seq: 'A', step: 'A4', key: 'A4', offsetDays: 10, service: true, staleDays: 4, needsStripe: true },
  ],
  // Solde de minutes d’un abonné ou d’un compte à la minute (l’essai a C4) : S1 sous le seuil, S2 à 0 minute. Étape
  // journalisée « S1@<date> » : une fois par épisode (le solde est repassé au-dessus du seuil depuis cette date).
  S: [
    { seq: 'S', step: 'S1', key: 'S1', offsetDays: null, service: true, staleDays: 14, needsStripe: true },
    { seq: 'S', step: 'S2', key: 'S2', offsetDays: null, service: true, staleDays: 14, needsStripe: true },
  ],
};

/** Suivi mensuel de mise en route (abonnés) : tous les 30 jours après le début, si un agent existe et n’a reçu aucun appel
 *  réel sur 30 jours (sans agent : étape sautée, motif no_agent), 12 au plus. */
export const A_MONTHLY_STEPS: StepDef[] = Array.from({ length: 12 }, (_, i) => ({
  seq: 'A' as const, step: `AM${i + 1}`, key: 'A_monthly' as const, offsetDays: 30 * (i + 1), service: true, staleDays: 7, needsStripe: true,
}));

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
/**
 * C4 : jamais dans les premières heures de l’essai (audit du 9 oct. : un solde lu avant que la plateforme crédite les
 * minutes d’essai donnait « il vous reste 0 minute » quelques heures après le début de l’essai, en Australie).
 */
export const C4_MIN_HOURS_AFTER_START = 12;
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

/** Mise en route : alerte « client sans agent » à J+3, « risque de résiliation » à J+14 (abonné sans agent ou sans appel). */
export const A_NO_AGENT_ALERT_DAYS = 3;
export const A_CHURN_RISK_DAYS = 14;
/** « À faire aujourd’hui » : appel par une personne de l’équipe à partir de J+7 sans agent (client payant seulement ;
 *  pendant l’essai, seulement à la demande du client). */
export const A_CALL_DAYS = 7;
/** Agent sans appel réel depuis 7 jours (rubrique « À faire aujourd’hui »). */
export const A_IDLE_DAYS = 7;
/** Alerte à l’équipe 5 jours avant le renouvellement d’un abonné sans appel réel sur 30 jours. */
export const A_RENEWAL_ALERT_DAYS = 5;
/** Appels lus sur 45 jours (dernier appel réel, et « 0 appel sur 30 jours »). */
export const A_CALLS_WINDOW_DAYS = 45;
/** Lecture quotidienne des agents : au plus 25 comptes par passage (les autres au passage suivant). */
export const A_READS_PER_RUN = 25;
/** Lecture du jour périmée au-delà de 48 h : les étapes qui en dépendent attendent. */
export const A_ACTIVITY_MAX_AGE_HOURS = 48;
/** S1 : minutes basses = 20 minutes ou moins, ou 15 % des minutes du forfait si c’est plus. */
export const S_LOW_MINUTES = 20;
export const S_LOW_SHARE = 0.15;

export { DAY };

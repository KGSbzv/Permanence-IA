// Plages d’appel des campagnes de rappel, par marché, et conversions de fuseau. Module sans dépendance serveur :
// utilisé par l’API (/api/callback : une date précise hors plage est reportée au prochain créneau ouvré) et par le
// formulaire de rappel (contrôle avant envoi). Les heures sont celles du marché (fuseau de la campagne).
import { holidays } from './relances/calendar';
import type { Locale } from '@/i18n/locales';

/** Fuseau de chaque marché (campagne d’appel). */
export const CALL_TZ: Record<string, string> = {
  fr: 'Europe/Paris', 'en-gb': 'Europe/London', 'en-au': 'Australia/Sydney', it: 'Europe/Rome', pl: 'Europe/Warsaw', nl: 'Europe/Amsterdam', he: 'Asia/Jerusalem',
};

/** Plage en minutes depuis minuit, fin exclue (19:00 n’est plus dans la plage 14:00–19:00). */
type Range = [number, number];
const hm = (h: number, m = 0) => h * 60 + m;
const MON_SAT = [1, 2, 3, 4, 5, 6];
const SUN_THU = [0, 1, 2, 3, 4];

/** Jours (0 = dimanche) et plages d’appel de chaque marché. */
const HOURS: Record<string, { days: number[]; ranges: Range[] }> = {
  fr: { days: MON_SAT, ranges: [[hm(9), hm(12, 30)], [hm(14), hm(19)]] },
  'en-gb': { days: MON_SAT, ranges: [[hm(9), hm(12, 30)], [hm(14), hm(19)]] },
  'en-au': { days: MON_SAT, ranges: [[hm(9), hm(12, 30)], [hm(14), hm(19)]] },
  it: { days: MON_SAT, ranges: [[hm(9), hm(13)], [hm(14, 30), hm(19)]] },
  pl: { days: MON_SAT, ranges: [[hm(9), hm(17, 30)]] },
  nl: { days: MON_SAT, ranges: [[hm(9), hm(17, 30)]] },
  he: { days: SUN_THU, ranges: [[hm(9), hm(13)], [hm(14), hm(19)]] },
};
const hoursOf = (lang: string) => HOURS[lang] || HOURS.fr;
const zoneOf = (lang: string) => CALL_TZ[lang] || CALL_TZ.fr;

/** Écart (ms) entre l’heure locale d’un fuseau et l’heure UTC, à un instant donné. */
export function tzOffset(at: Date, tz: string) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(at).map((x) => [x.type, x.value]));
  return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second) - at.getTime();
}

/** Heure locale « AAAA-MM-JJTHH:MM » d’un fuseau → instant UTC. */
export function localToUtc(local: string, tz: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(local);
  if (!m) return null;
  const guess = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  // Deux passes : exact aussi le jour d’un changement d’heure.
  const first = guess - tzOffset(new Date(guess), tz);
  return new Date(guess - tzOffset(new Date(first), tz));
}

/** Date (AAAA-MM-JJ), minutes depuis minuit et jour de la semaine d’un instant dans un fuseau. */
function localOf(at: Date, tz: string) {
  const local = new Date(at.getTime() + tzOffset(at, tz));
  return { date: local.toISOString().slice(0, 10), minutes: local.getUTCHours() * 60 + local.getUTCMinutes(), weekday: local.getUTCDay() };
}
const addDays = (date: string, n: number) => new Date(Date.parse(`${date}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
const weekdayOf = (date: string) => new Date(`${date}T12:00:00Z`).getUTCDay();
const pad = (n: number) => String(n).padStart(2, '0');

/** Jour d’appel du marché : jours ouverts, et pour Israël hors fêtes chômées (src/lib/relances/calendar.ts). */
export function isCallDay(date: string, lang: string) {
  if (!hoursOf(lang).days.includes(weekdayOf(date))) return false;
  return lang !== 'he' || !holidays(lang as Locale, Number(date.slice(0, 4))).includes(date);
}

/** L’instant tombe-t-il dans une plage d’appel du marché (jour ouvré, heure du marché) ? */
export function isCallTime(at: Date, lang: string) {
  const { date, minutes } = localOf(at, zoneOf(lang));
  return isCallDay(date, lang) && hoursOf(lang).ranges.some(([a, b]) => minutes >= a && minutes < b);
}

/**
 * Premier instant d’appel du marché à partir de `at` : inchangé s’il est déjà dans une plage, sinon début de la
 * plage suivante (pause de midi, soirée, dimanche, fête en Israël). Recherche limitée à 21 jours.
 */
export function nextCallTime(at: Date, lang: string) {
  const tz = zoneOf(lang);
  const { ranges } = hoursOf(lang);
  const start = localOf(at, tz);
  for (let i = 0; i < 21; i++) {
    const date = addDays(start.date, i);
    if (!isCallDay(date, lang)) continue;
    const from = i === 0 ? start.minutes : 0;
    for (const [a, b] of ranges) {
      if (from >= b) continue;
      if (from >= a) return at;
      return localToUtc(`${date}T${pad(Math.floor(a / 60))}:${pad(a % 60)}`, tz) ?? at;
    }
  }
  return at;
}

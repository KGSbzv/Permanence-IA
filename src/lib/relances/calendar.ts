// Heure locale du marché, jours ouvrés et jours fériés nationaux : les relances marketing partent entre 9 h et 11 h
// un jour ouvré (lundi–vendredi, dimanche–jeudi en Israël), jamais un jour férié ; les messages de service entre
// 8 h et 20 h, tous les jours.
import type { Locale } from '@/i18n/locales';

/** Fuseau de chaque marché. */
export const MARKET_TZ: Record<Locale, string> = {
  fr: 'Europe/Paris', 'en-gb': 'Europe/London', 'en-au': 'Australia/Sydney', it: 'Europe/Rome', pl: 'Europe/Warsaw', nl: 'Europe/Amsterdam', he: 'Asia/Jerusalem',
};

export const MARKETING_HOURS: [number, number] = [9, 11];
export const SERVICE_HOURS: [number, number] = [8, 20];

/** Date (AAAA-MM-JJ), heure et jour de la semaine (0 = dimanche) dans un fuseau. */
export function localParts(at: Date, tz: string) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', weekday: 'short',
  }).formatToParts(at).map((x) => [x.type, x.value]));
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
  return { date: `${p.year}-${p.month}-${p.day}`, hour: Number(p.hour) % 24, weekday };
}

const iso = (y: number, m: number, d: number) => new Date(Date.UTC(y, m - 1, d)).toISOString().slice(0, 10);
const addDays = (date: string, n: number) => new Date(Date.parse(`${date}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
const weekdayOf = (date: string) => new Date(`${date}T12:00:00Z`).getUTCDay();

/** Dimanche de Pâques (calendrier grégorien, algorithme de Meeus). */
function easter(y: number) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  return iso(y, month, ((h + l - 7 * m + 114) % 31) + 1);
}
/** n-ième lundi du mois (n = -1 : dernier). */
function nthMonday(y: number, month: number, n: number) {
  if (n > 0) {
    const first = iso(y, month, 1);
    return addDays(first, ((8 - weekdayOf(first)) % 7) + (n - 1) * 7);
  }
  const last = iso(y, month + 1, 0);
  return addDays(last, -((weekdayOf(last) + 6) % 7));
}
/** Jour férié tombant un week-end reporté au premier jour de semaine libre (Royaume-Uni, Australie). */
function substitute(dates: string[]) {
  const out: string[] = [];
  for (const d of dates) {
    let x = d;
    if (weekdayOf(x) === 0 || weekdayOf(x) === 6) {
      out.push(x);
      do x = addDays(x, 1); while (weekdayOf(x) === 0 || weekdayOf(x) === 6 || out.includes(x) || dates.includes(x));
    }
    out.push(x);
  }
  return out;
}

// Fêtes juives chômées en Israël (dates fixes du calendrier civil, à compléter chaque année ; liste à vérifier
// avant l’ouverture du marché he).
const HE_FIXED: Record<number, string[]> = {
  2026: ['2026-04-02', '2026-04-08', '2026-04-22', '2026-05-22', '2026-09-12', '2026-09-13', '2026-09-21', '2026-09-26', '2026-10-03'],
  2027: ['2027-04-22', '2027-04-28', '2027-05-12', '2027-06-11', '2027-10-02', '2027-10-03', '2027-10-11', '2027-10-16', '2027-10-23'],
};

/** Jours fériés nationaux d’une année pour un marché (AAAA-MM-JJ). */
export function holidays(locale: Locale, y: number): string[] {
  const e = easter(y);
  const md = (m: number, d: number) => iso(y, m, d);
  switch (locale) {
    case 'fr':
      return [md(1, 1), addDays(e, 1), md(5, 1), md(5, 8), addDays(e, 39), addDays(e, 50), md(7, 14), md(8, 15), md(11, 1), md(11, 11), md(12, 25)];
    case 'en-gb':
      return [...substitute([md(1, 1)]), addDays(e, -2), addDays(e, 1), nthMonday(y, 5, 1), nthMonday(y, 5, -1), nthMonday(y, 8, -1), ...substitute([md(12, 25), md(12, 26)])];
    case 'en-au': // Nouvelle-Galles du Sud (Sydney)
      return [...substitute([md(1, 1), md(1, 26)]), addDays(e, -2), addDays(e, 1), md(4, 25), nthMonday(y, 6, 2), nthMonday(y, 10, 1), ...substitute([md(12, 25), md(12, 26)])];
    case 'it':
      return [md(1, 1), md(1, 6), addDays(e, 1), md(4, 25), md(5, 1), md(6, 2), md(8, 15), md(11, 1), md(12, 8), md(12, 25), md(12, 26)];
    case 'pl':
      return [md(1, 1), md(1, 6), addDays(e, 1), md(5, 1), md(5, 3), addDays(e, 60), md(8, 15), md(11, 1), md(11, 11), md(12, 24), md(12, 25), md(12, 26)];
    case 'nl': {
      const kingsDay = weekdayOf(md(4, 27)) === 0 ? md(4, 26) : md(4, 27);
      return [md(1, 1), addDays(e, 1), kingsDay, addDays(e, 39), addDays(e, 50), md(12, 25), md(12, 26)];
    }
    case 'he':
      return HE_FIXED[y] ?? [];
    default:
      return [];
  }
}

export const isHoliday = (locale: Locale, date: string) => holidays(locale, Number(date.slice(0, 4))).includes(date);

/** Jour ouvré du marché pour les relances : lundi–vendredi, dimanche–jeudi en Israël, hors jours fériés. */
export function isMarketBusinessDay(locale: Locale, date: string) {
  const wd = weekdayOf(date);
  const open = locale === 'he' ? wd <= 4 : wd >= 1 && wd <= 5;
  return open && !isHoliday(locale, date);
}

/** Motif d’attente si l’heure locale ne permet pas l’envoi, sinon null. */
export function windowBlock(locale: Locale, at: Date, service: boolean): string | null {
  const { date, hour } = localParts(at, MARKET_TZ[locale]);
  const [from, to] = service ? SERVICE_HOURS : MARKETING_HOURS;
  if (hour < from || hour >= to) return 'outside_hours';
  if (!service && !isMarketBusinessDay(locale, date)) return isHoliday(locale, date) ? 'holiday' : 'not_business_day';
  return null;
}

/** Date longue dans la langue et le fuseau du marché (« 22 octobre 2026 »). */
export function longDate(at: Date, numberLocale: string, tz: string) {
  return new Intl.DateTimeFormat(numberLocale, { timeZone: tz, day: 'numeric', month: 'long', year: 'numeric' }).format(at);
}
/** Jour et mois (« 8 octobre »), pour « Suite à notre échange du … ». */
export function dayMonth(at: Date, numberLocale: string, tz: string) {
  return new Intl.DateTimeFormat(numberLocale, { timeZone: tz, day: 'numeric', month: 'long' }).format(at);
}

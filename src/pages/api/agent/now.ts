// Date et heure actuelles pour les agents (outil date_heure_actuelle) : un modèle ne connaît pas la date du jour.
// L’agent l’appelle avant de fixer un rappel (« dans deux jours », « mardi prochain à 10 h ») : la réponse donne
// l’heure locale, le décalage UTC et les 14 prochains jours avec leur nom et leur décalage (changement d’heure compris).
//
// GET ?lang=fr|en-gb|en-au|it|pl|nl|he  (ou ?tz=Europe/Paris)  → aucune donnée personnelle, pas de jeton.
import type { NextApiRequest, NextApiResponse } from 'next';
import { calendarDays, describeLocal, localToUtc, offsetLabel, zoneFor } from '@/lib/server';

const LANGS = ['fr', 'en-gb', 'en-au', 'it', 'pl', 'nl', 'he'];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const lang = LANGS.includes(String(req.query.lang)) ? String(req.query.lang) : 'en-gb';
  const tz = zoneFor(req.query.tz, lang);
  const now = new Date();
  const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' });
  const weekday = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', weekday: 'long' });
  const days = calendarDays(tz, 14).map((date, i) => {
    // Décalage pris à midi local de chaque date : celui des heures de rappel, changement d’heure compris.
    const noon = localToUtc(`${date}T12:00`, tz) as Date;
    return { date, weekday: weekday.format(new Date(`${date}T00:00:00Z`)), utc_offset: offsetLabel(noon, tz), ...(i === 0 ? { label: 'today' } : i === 1 ? { label: 'tomorrow' } : {}) };
  });
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({
    now: describeLocal(now, tz, 'en-gb'),
    now_iso: `${ymd.format(now)}T${new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(now)}:00${offsetLabel(now, tz)}`,
    timezone: tz,
    next_14_days: days,
    how_to_use: 'Work out the exact date from this list (never guess the weekday), read the day, date and time back to the person, then send call_at as YYYY-MM-DDTHH:MM:00 followed by the utc_offset of that day.',
  });
}

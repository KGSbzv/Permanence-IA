// Textes des formulaires de rappel en attente d’une place dans src/i18n/content/<langue>/ui/components.ts
// (clés notQueuedText et dateInvalid, à ajouter par la chaîne contenu ; ce fichier sera alors retiré).
import type { Locale } from '@/i18n/locales';

/** Demande reçue mais rappel automatique non mis en file (zone, plafond, panne) : l’équipe recontacte à la main,
 *  sans promesse d’appel dans les minutes. */
export const NOT_QUEUED: Record<Locale, string> = {
  fr: 'Le rappel automatique n’a pas pu être programmé : un conseiller vous recontacte dès que possible.',
  'en-gb': 'The automatic callback could not be scheduled: a member of our team will get back to you as soon as possible.',
  'en-au': 'The automatic callback couldn’t be scheduled: someone from our team will get back to you as soon as possible.',
  it: 'Non è stato possibile programmare la richiamata automatica: un consulente la ricontatterà il prima possibile.',
  pl: 'Nie udało się zaplanować automatycznego połączenia: konsultant skontaktuje się z Tobą tak szybko, jak to możliwe.',
  nl: 'De automatische terugbelafspraak kon niet worden ingepland: een adviseur neemt zo snel mogelijk contact met u op.',
  he: 'לא ניתן היה לתזמן שיחה חוזרת אוטומטית: נציג יחזור אליך בהקדם האפשרי.',
};

/** Date précise refusée : passée, à plus de 30 jours, ou hors des plages d’appel du marché (src/lib/callHours.ts). */
export const DATE_INVALID: Record<Locale, string> = {
  fr: 'Choisissez un créneau dans les 30 prochains jours, du lundi au samedi, entre 9 h et 12 h 30 ou entre 14 h et 19 h (heure de Paris).',
  'en-gb': 'Please choose a time within the next 30 days, Monday to Saturday, between 9:00 and 12:30 or between 14:00 and 19:00 (UK time).',
  'en-au': 'Please choose a time within the next 30 days, Monday to Saturday, between 9:00 and 12:30 or between 14:00 and 19:00 (Sydney time).',
  it: 'Scelga un orario entro i prossimi 30 giorni, dal lunedì al sabato, tra le 9:00 e le 13:00 o tra le 14:30 e le 19:00 (ora italiana).',
  pl: 'Wybierz termin w ciągu najbliższych 30 dni, od poniedziałku do soboty, między 9:00 a 17:30 (czasu polskiego).',
  nl: 'Kies een tijdstip binnen de komende 30 dagen, van maandag tot en met zaterdag, tussen 9:00 en 17:30 (Nederlandse tijd).',
  he: 'נא לבחור מועד ב-30 הימים הקרובים, בימים א׳–ה׳ (לא בחגים), בין 9:00 ל-13:00 או בין 14:00 ל-19:00 (שעון ישראל).',
};

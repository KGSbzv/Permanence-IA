// Hebrew plan text and feature matrix. Prices and minutes come from the market
// (src/i18n/markets.ts): this file only contains words.
import type { PlanSlug } from '../../markets';
import type { Cell, MatrixGroup, OfferText } from '../fr/offers';

export type { Cell, MatrixGroup, MatrixRow, OfferText } from '../fr/offers';

export const OFFER_TEXT: Record<PlanSlug, OfferText> = {
  decouverte: {
    name: 'התנסות',
    audience: 'לבדוק את הסוכן על העסק שלכם',
    title: 'נסו את הסוכן בחינם למשך 14 יום',
    pitch: 'הכירו את הפלטפורמה, הגדירו סוכן ראשון, נסו את ההדגמה החיה וקבלו עד 30 דקות שיחה כדי לראות מה הוא יכול לעשות בשביל העסק שלכם.',
    cta: 'התחילו בחינם',
    highlights: ['14 יום על המסלול שתבחרו', '30 דקות שיחה כלולות', 'נדרש כרטיס אשראי, ללא חיוב בתקופת הניסיון', 'ביטול ללא עלות לפני סוף התקופה'],
  },
  receptionniste: {
    name: 'מענה טלפוני',
    audience: 'עצמאים ועסקים קטנים',
    title: 'מענה טלפוני AI שעונה לכל שיחה, 24/7',
    pitch: 'מסלול מענה טלפוני עונה לשיחות שלכם, משיב על שאלות נפוצות, קובע תורים ושולח לכם סיכום ברור של כל פנייה. פשוט להפעלה, בלי סיבוכים.',
    cta: 'בחירת מענה טלפוני',
    highlights: ['סוכן קולי AI אחד שעונה 24/7', '2 שיחות במקביל', 'מאגר ידע אחד; מספר ייעודי אחד אפשרי, כתוספת החל מ-$3.99 לחודש (לא כולל מע״מ)', 'יומן מחובר, ווידג׳ט לאתר', 'העברת שיחות לצוות שלכם', 'SMS, וואטסאפ ומסנג׳ר (קרדיטים להודעות לפי הצורך)'],
  },
  assistant: {
    name: 'עוזר AI',
    audience: 'עסקים מקומיים עם נפח שיחות קבוע',
    title: 'עוזר AI שמסנן פניות, עושה פולואפ ומפעיל אוטומציות',
    pitch: 'מסלול עוזר AI כולל שלושה סוכנים, קמפייני פולואפ, בונה תהליכים שמחובר ליותר מ-300 כלים ושיבוט קול – כדי להפוך יותר פניות ללקוחות.',
    cta: 'בחירת עוזר AI',
    highlights: ['כל מה שיש במענה טלפוני, ובנוסף:', '3 סוכנים, 5 שיחות במקביל', '3 מאגרי ידע, 3 כלים במהלך שיחה; עד 3 מספרים ייעודיים, כתוספת החל מ-$3.99 לחודש (לא כולל מע״מ)', '3 קמפייני פולואפ', 'בונה תהליכים ואוטומציות (5,000 הרצות בחודש)', 'שיבוט קול אחד', '1,000 קרדיטים להודעות בחודש (כ-500 תשובות כתובות)'],
  },
  'centre-appels': {
    name: 'מוקד שיחות',
    audience: 'צוותים, כמה מחלקות ונפחים גבוהים',
    title: 'מוקד שיחות AI מלא לניהול מענה, תורים ותמיכה',
    pitch: 'מסלול מוקד שיחות מסיר את המגבלות: סוכנים וקמפיינים ללא הגבלה, 20 שיחות במקביל, לוחות בקרה מותאמים, תמיכה בעדיפות והמחיר הטוב ביותר לדקה.',
    cta: 'בחירת מוקד שיחות',
    highlights: ['כל מה שיש בעוזר AI, ובנוסף:', 'סוכנים, קמפיינים ומאגרי ידע ללא הגבלה', '20 שיחות במקביל; עד 10 מספרים ייעודיים, כתוספת החל מ-$3.99 לחודש (לא כולל מע״מ)', '3 קולות משובטים, 50,000 אוטומציות בחודש', 'לוחות בקרה מותאמים אישית', 'תמיכה בעדיפות', '3,000 קרדיטים להודעות בחודש (כ-1,500 תשובות כתובות)'],
  },
  'sur-mesure': {
    name: 'בהתאמה אישית',
    audience: 'מעל 2,500 דקות בחודש, באופן קבוע',
    title: 'הגדרה שנבנית סביב הנפחים, הסניפים והאינטגרציות שלכם',
    pitch: 'לרשתות, לארגונים עם כמה סניפים ולנפחים קבועים של מעל 2,500 דקות: מחיר לדקה במו״מ, כללים לכל סניף, אינטגרציות מתקדמות והטמעה מלווה.',
    cta: 'דברו עם מומחה',
    highlights: ['כל מה שיש במוקד שיחות', 'מחיר לדקה במו״מ', 'כללים לכמה סניפים', 'SLA והטמעה מלווה'],
  },
};

/** Labels built from the market figures. `n` is already formatted (e.g. "1,000"). */
export const OFFER_LABELS = {
  free: '$0',
  onQuote: 'לפי הצעת מחיר',
  minutesPerMonth: (n: string) => `${n} דק׳ / חודש`,
  trialMinutes: (n: string, days: number) => `${n} דקות במשך ${days} יום`,
  customVolume: 'נפח מותאם לעסק שלכם',
  perMinute: (price: string) => `${price} לדקה, לא כולל מע״מ`,
  exclTax: 'לא כולל מע״מ',
  perMonth: 'לחודש, לא כולל מע״מ',
};

// Feature matrix: each row matches a page or feature in the customer interface.
// Values: true = included, false = not included, text = level.
const all = (v: Cell): Record<PlanSlug, Cell> => ({ decouverte: v, receptionniste: v, assistant: v, 'centre-appels': v, 'sur-mesure': v });
const paid = (v: Cell): Record<PlanSlug, Cell> => ({ ...all(v), decouverte: false });

// Limits taken from the customer-area admin (Receptionist 1646, Assistant 1647, Call Centre 1650 plans
// and the trial): any change to a plan in the admin must be reflected here, and vice versa.
export const MATRIX: MatrixGroup[] = [
  {
    group: 'סוכנים ושיחות',
    rows: [
      { label: 'סוכנים קוליים AI', detail: 'מספר הסוכנים שאפשר ליצור, לשיחות נכנסות או יוצאות.', cells: { decouverte: '1', receptionniste: '1', assistant: '3', 'centre-appels': 'ללא הגבלה', 'sur-mesure': 'ללא הגבלה' } },
      { label: 'שיחות במקביל', detail: 'שיחות שמטופלות באותו זמן: אף אחד לא מחכה, גם בשעות העומס.', cells: { decouverte: '1', receptionniste: '2', assistant: '5', 'centre-appels': '20', 'sur-mesure': 'בהתאמה אישית' } },
      { label: 'היסטוריית שיחות', detail: 'הקלטה, תמלול וסיכום של כל שיחה.', cells: all(true) },
      { label: 'העברה לנציג אנושי', detail: 'הסוכן מעביר את השיחה לצוות שלכם כשצריך.', cells: all(true) },
      { label: 'שפות נוספות', detail: 'הסוכן מזהה את שפת המתקשר ועונה בה.', cells: all(true) },
      { label: 'קולות משובטים', detail: 'קול שנוצר מהקלטה של הקול שלכם.', cells: { decouverte: false, receptionniste: false, assistant: '1', 'centre-appels': '3', 'sur-mesure': 'בהתאמה אישית' } },
    ],
  },
  {
    group: 'הגדרת הסוכן',
    rows: [
      { label: 'עורך הנחיות AI', detail: 'עוזר כתיבה מגדיר את ההתנהגות, הטון והכללים של הסוכן.', cells: all(true) },
      { label: 'מאגרי ידע', detail: 'קובצי PDF, דפי אינטרנט ונהלים שהסוכן נעזר בהם במהלך השיחה.', cells: { decouverte: '1', receptionniste: '1', assistant: '3', 'centre-appels': 'ללא הגבלה', 'sur-mesure': 'ללא הגבלה' } },
      { label: 'כלים במהלך שיחה', detail: 'פעולות בזמן אמת: בדיקת זמינות, שליפת תיק לקוח, שאילתה לתוכנה שלכם.', cells: { decouverte: '1', receptionniste: false, assistant: '3', 'centre-appels': 'ללא הגבלה', 'sur-mesure': 'ללא הגבלה' } },
      { label: 'בונה תהליכים', detail: 'תרחישים ויזואליים בלי קוד: טריגרים, תנאים ופעולות.', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'פלטפורמת אוטומציה', detail: 'יותר מ-300 כלים לחיבור: CRM, Google Sheets, Slack, אימייל…', cells: { decouverte: false, receptionniste: false, assistant: '5,000 הרצות בחודש', 'centre-appels': '50,000 הרצות בחודש', 'sur-mesure': 'בהתאמה אישית' } },
      { label: 'מחבר AI', detail: 'ניהול החשבון מתוך ChatGPT או Claude: יצירת סוכן, צפייה בשיחות, הפעלת פעולות.', cells: all(true) },
    ],
  },
  {
    group: 'יומן ואיסוף פניות',
    rows: [
      { label: 'חיבור ליומן', detail: 'Google Calendar, ‏Outlook ועוד, דרך Cal.com או Calendly: הסוכן קובע ישירות ביומן שלכם.', cells: all(true) },
      { label: 'ווידג׳ט לאתר', detail: 'כפתור שיחה ובקשת שיחה חוזרת להטמעה באתר שלכם.', cells: all(true) },
      { label: 'לידים', detail: 'כרטיסי לקוחות פוטנציאליים שנוצרים מהשיחות.', cells: all(true) },
    ],
  },
  {
    group: 'הודעות וקמפיינים',
    rows: [
      { label: 'קמפיינים יוצאים', detail: 'פולואפים, אישורים ותזכורות בשיחות אוטומטיות.', cells: { decouverte: false, receptionniste: false, assistant: '3', 'centre-appels': 'ללא הגבלה', 'sur-mesure': 'ללא הגבלה' } },
      { label: 'SMS ו-WhatsApp', detail: 'כל ההתכתבויות במקום אחד, בתשלום באמצעות קרדיטים להודעות.', cells: all(true) },
      { label: 'Messenger ו-Instagram', detail: 'הודעות מהרשתות החברתיות באותה תיבה.', cells: all(true) },
      { label: 'קרדיטים להודעות כלולים', detail: 'קרדיטים חינם בכל חודש להתכתבויות (וואטסאפ, SMS, מסנג׳ר, צ׳אט). 100 קרדיטים = $1, תשובת AI אחת ≈ 2 קרדיטים. בלי קרדיטים כלולים, טוענים קרדיט לפי השימוש.', cells: { decouverte: false, receptionniste: 'לפי הצורך', assistant: '1,000 בחודש (כ-500 תשובות)', 'centre-appels': '3,000 בחודש (כ-1,500 תשובות)', 'sur-mesure': 'בהתאמה אישית' } },
    ],
  },
  {
    group: 'טלפוניה',
    rows: [
      { label: 'מספרי טלפון', detail: 'מספרים ייעודיים אפשריים, כתוספת החל מ-$3.99 לחודש (לא כולל מע״מ), שנרכשים ישירות באזור הלקוח, בחיוב חודשי לפי המדינה.', cells: { decouverte: '1', receptionniste: '1', assistant: '3', 'centre-appels': '10', 'sur-mesure': 'בהתאמה אישית' } },
      { label: 'חיבור SIP', detail: 'שומרים על המספרים ועל המרכזייה: חיבור SIP או ייבוא מ-Twilio או Telnyx.', cells: all(true) },
      { label: 'הנייד שלכם כמספר מזוהה', detail: 'אמתו את המספר שלכם כדי שיוצג בשיחות יוצאות.', cells: paid(true) },
      { label: 'רשימת חסימה', detail: 'מספרים שהסוכן לעולם לא מתקשר אליהם.', cells: all(true) },
    ],
  },
  {
    group: 'ניהול ואינטגרציות',
    rows: [
      { label: 'סטטיסטיקות שיחות', detail: 'כמות שיחות, משכי שיחה ותוצאות בלוח הבקרה שלכם.', cells: all(true) },
      { label: 'לוחות בקרה מותאמים אישית', detail: 'מדדים משלכם, שנבנים מנתוני השיחות.', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'API ו-Webhooks', detail: 'קבלת כל שיחה שהסתיימה במערכות שלכם, או הפעלת הסוכן מהתוכנה שלכם.', cells: all(true) },
      { label: 'כללים לכמה סניפים ו-SLA', detail: 'כמה סניפים, התחייבות לרמת שירות.', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': false, 'sur-mesure': true } },
      { label: 'תמיכה', detail: 'עזרה וליווי מהצוות שלנו.', cells: { decouverte: 'מקורות מידע', receptionniste: 'רגילה', assistant: 'רגילה', 'centre-appels': 'בעדיפות', 'sur-mesure': 'ייעודית' } },
    ],
  },
];

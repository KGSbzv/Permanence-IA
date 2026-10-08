// Customer area guide in Hebrew (the interface itself is in English): menu glossary and step-by-step tasks.
// Also serves as the knowledge base for the help assistant built into the customer area.
import type { HelpTask, MenuEntry } from '../fr/help';

export type { HelpTask, MenuEntry } from '../fr/help';

export const HELP_MENU: MenuEntry[] = [
  { en: 'Dashboard', label: 'לוח בקרה', text: 'תמונת מצב: שיחות החודש, דקות שנוצלו, תוצאות.' },
  { en: 'Assistants', label: 'סוכנים קוליים', text: 'יצירה, עריכה ובדיקה של הסוכנים שלכם (מענה, שיחות חוזרות, תמיכה).' },
  { en: 'Calls history', label: 'היסטוריית שיחות', text: 'כל שיחה עם ההקלטה, התמלול, הסיכום והנתונים שחולצו ממנה.' },
  { en: 'Knowledge base', label: 'מאגר ידע', text: 'מסמכים ודפי אינטרנט שהסוכן נעזר בהם במהלך השיחות.' },
  { en: 'Mid call tools / MCP', label: 'כלים במהלך שיחה', text: 'פעולות שהסוכן מפעיל בזמן אמת: שליחת פנייה ל-CRM, בדיקת מידע…' },
  { en: 'Blacklist', label: 'רשימת חסימה', text: 'מספרים שאסור להתקשר אליהם לעולם.' },
  { en: 'Campaigns', label: 'קמפיינים', text: 'שיחות יוצאות לרשימת אנשי קשר (תזכורות, פולואפים, קביעת פגישות).' },
  { en: 'Leads', label: 'אנשי קשר / לידים', text: 'אנשי קשר שיובאו או נוצרו, עם הסטטוס שלהם.' },
  { en: 'Inbox', label: 'תיבת הודעות', text: 'כל ההתכתבויות במקום אחד: ווידג׳ט לאתר, וואטסאפ, SMS, מסנג׳ר, אינסטגרם.' },
  { en: 'Channels → WhatsApp / Messenger & Instagram', label: 'ערוצים', text: 'חיבור חשבונות ההודעות שלכם.' },
  { en: 'Get new phone number', label: 'רכישת מספר', text: 'רכישת מספר ייעודי (אופציונלי, בתשלום חודשי, המחיר מוצג לפני הרכישה).' },
  { en: 'Your phone numbers', label: 'המספרים שלכם', text: 'המספרים שלכם, ייבוא מ-Twilio / Telnyx וחיבור SIP.' },
  { en: 'Automate platform', label: 'אוטומציות', text: 'בונה תהליכים ללא קוד שמחובר ליותר מ-300 כלים (ממסלול עוזר AI ומעלה).' },
  { en: 'Change plan', label: 'החלפת מסלול', text: 'מעבר למסלול גבוה או נמוך יותר.' },
  { en: 'Add credits', label: 'טעינת קרדיט', text: 'רכישת קרדיט (דקות מעבר למסלול, הודעות); תוקף הקרדיט לא פג.' },
  { en: 'Billing info', label: 'פרטי חיוב', text: 'אמצעי תשלום, חשבוניות, מנוי וביטול.' },
  { en: 'Limits', label: 'מגבלות', text: 'מה המסלול שלכם מאפשר: סוכנים, שיחות במקביל, יכולות.' },
  { en: 'API Keys', label: 'מפתחות API', text: 'חיבור התוכנות שלכם (בכל המסלולים).' },
  { en: 'My profile / Security', label: 'פרופיל / אבטחה', text: 'הפרטים שלכם, סיסמה ואימות דו־שלבי.' },
];

export const HELP_TASKS: HelpTask[] = [
  {
    title: 'יצירת הסוכן הקולי הראשון',
    steps: [
      'נכנסים ל-Assistants ולוחצים על Create.',
      'General: בוחרים Receive phone calls או Make phone calls, ואז מזינים שם ואזור זמן.',
      'Voice & speech: בוחרים בשפה Hebrew, בוחרים קול ומאזינים לו.',
      'Brain & prompt: מתארים את העסק ומה הסוכן צריך לעשות ומה לא. עוזר הכתיבה (AI Prompt Editor) יכול לכתוב את זה בשבילכם.',
      'Greeting: המשפט הראשון שהסוכן אומר.',
      'לוחצים על Create assistant, ואז על Test assistant כדי לדבר איתו מהדפדפן.',
    ],
  },
  {
    title: 'הוספת המידע שלכם (מאגר ידע)',
    steps: [
      'נכנסים ל-Knowledge base ויוצרים מאגר.',
      'מוסיפים מסמך: קובץ PDF, קובץ טקסט או כתובת של עמוד מהאתר שלכם.',
      'בסוכן, תחת Knowledgebase, בוחרים את המאגר הזה.',
    ],
  },
  {
    title: 'קבלת שיחות במספר שלכם',
    steps: [
      'הדרך הפשוטה ביותר: רוכשים מספר ב-Get new phone number ובוחרים אותו בסוכן (General → Phone number).',
      'כדי לשמור על המספר הנוכחי: מבקשים מחברת הטלפון להפעיל הפניית שיחות למספר החדש.',
      'אם כבר יש לכם Twilio, Telnyx או מרכזיית SIP: נכנסים ל-Your phone numbers, ואז ייבוא או SIP (בכל המסלולים).',
    ],
  },
  {
    title: 'קביעת תורים על ידי הסוכן',
    steps: [
      'בסוכן, נכנסים ל-Tools & actions.',
      'מוסיפים את חיבור היומן (Cal.com או Calendly, שאליהם מחברים את יומן Google או Outlook שלכם) ומחברים את החשבון.',
      'מציינים בהנחיות (Prompt) מתי הסוכן צריך להציע תור.',
    ],
  },
  {
    title: 'העברת שיחה אליכם',
    steps: [
      'בסוכן, תחת Tools & actions, מוסיפים Call transfer.',
      'מזינים את המספר שלכם ומתי להעביר (מקרה חירום, המתקשר מבקש נציג אנושי…).',
    ],
  },
  {
    title: 'הוספת הסוכן לאתר שלכם (ווידג׳ט)',
    steps: [
      'בסוכן, תחת Web widget: מפעילים את הווידג׳ט, בוחרים קול ו/או צ׳אט, צבעים וטקסטים.',
      'מעתיקים את הקוד ומדביקים אותו לפני התג </body> באתר שלכם (או מבקשים ממפתח האתר).',
    ],
  },
  {
    title: 'הפעלת קמפיין שיחות יוצאות',
    steps: [
      'יוצרים סוכן במצב Make phone calls.',
      'נכנסים ל-Leads ומייבאים את אנשי הקשר (קובץ CSV); בקמפיין שיווקי, מתקשרים רק למי שנתן הסכמה מפורשת מראש (סעיף 30א לחוק התקשורת).',
      'נכנסים ל-Campaigns: יוצרים קמפיין, בוחרים סוכן, אנשי קשר ושעות התקשרות, ומפעילים.',
    ],
  },
  {
    title: 'שליחת תוצאות השיחות לכלים שלכם',
    steps: [
      'בסוכן, תחת Webhooks & channels: מזינים את הכתובת שתקבל כל שיחה שהסתיימה.',
      'או משתמשים ב-Automate platform כדי לשלוח סיכומים ל-Google Sheets, ל-CRM, ל-Slack, לאימייל… (ממסלול עוזר AI ומעלה).',
    ],
  },
  {
    title: 'הוספת דקות או החלפת מסלול',
    steps: [
      'לצורך חד־פעמי: Add credits ומזינים סכום טעינה, החל מ-$5. תוקף הקרדיט לא פג.',
      'אם אתם חורגים לעיתים קרובות: Change plan; המסלול הבא זול יותר לדקה.',
    ],
  },
  {
    title: 'ניהול תקופת הניסיון, החיובים והחשבוניות',
    steps: [
      'תקופת הניסיון מתחילה כשבוחרים מסלול ראשון ב-Change plan: 14 יום בחינם, 30 דקות כלולות, ללא חיוב בתקופת הניסיון.',
      'Billing info: אמצעי תשלום, חשבוניות להורדה וניהול המנוי.',
      'כדי לא לשלם כלום, מבטלים דרך Billing info לפני תום 14 הימים.',
    ],
  },
];

export const HELP_GLOSSARY: MenuEntry[] = [
  { en: 'Inbound / Outbound', label: 'נכנסות / יוצאות', text: 'שיחות שהסוכן מקבל / שיחות שהסוכן מבצע.' },
  { en: 'Prompt', label: 'הנחיות (פרומפט)', text: 'הטקסט שמתאר את התפקיד והכללים של הסוכן.' },
  { en: 'Pipeline / Speech-to-speech / Dualplex', label: 'מנוע', text: 'הטכנולוגיה הקולית. אם אתם לא בטוחים, השאירו על Pipeline: זו ההגדרה המומלצת.' },
  { en: 'Post-call evaluation', label: 'ניתוח אחרי שיחה', text: 'המידע שמחולץ אוטומטית מכל שיחה (שם, צורך, תור…).' },
  { en: 'Variables', label: 'משתנים', text: 'שדות מותאמים כמו {{customer_name}}, שמתמלאים לכל איש קשר.' },
  { en: 'Voicemail', label: 'תא קולי', text: 'מה הסוכן עושה כשהוא מגיע לתא קולי.' },
  { en: 'Credits', label: 'קרדיט', text: 'יתרת הקרדיט שלכם. משמשת לדקות נוספות ולהודעות כתובות (תשובות AI, וואטסאפ, SMS); העלות של כל שימוש מופיעה בעמוד המחירים.' },
];

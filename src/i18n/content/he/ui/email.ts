// Text of the emails sent by the site, in Hebrew (Israel, right to left): shared footer, email
// preferences page (/preferences-email) and the email carrying the personal link.
// Footer: {year}, {company}, {brand} and {email} are filled in when sending (src/lib/emailFooter.ts).
import type { UI_EMAIL as FR_UI_EMAIL } from '../../fr/ui/email';

export const UI_EMAIL: typeof FR_UI_EMAIL = {
  footer: {
    copyright: 'Copyright © {year} {company}. כל הזכויות שמורות.',
    brandOf: '{brand} הוא מותג של {company}.',
    question: 'רוצים לשנות את האופן שבו אתם מקבלים את ההודעות האלה?',
    manage: ['אפשר לנהל את העדפות הדוא״ל עבור {email} ', 'כאן', ''],
    manageNoEmail: ['אפשר לנהל את העדפות הדוא״ל ', 'כאן', ''],
    unsubscribe: ['או לבטל את ההרשמה לכל ההודעות ', 'כאן', '.'],
    terms: 'תנאי השימוש',
    privacy: 'מדיניות הפרטיות',
  },
  prefs: {
    meta: {
      title: (brand: string) => `העדפות דוא״ל | ${brand}`,
      description: 'בחרו אילו הודעות דוא״ל תקבלו מאיתנו, או בטלו את ההרשמה להודעות שאינן חיוניות.',
    },
    h1: 'העדפות הדוא״ל שלכם',
    intro: (brand: string) => `בחרו אילו הודעות דוא״ל תקבלו מ-${brand}.`,
    address: 'כתובת דוא״ל',
    current: 'הבחירה הנוכחית',
    essential: { title: 'רק הודעות חיוניות על החשבון', text: 'בלי הודעות שאינן חיוניות: בלי חדשות, טיפים או מבצעים.' },
    all: { title: 'כל ההודעות', text: 'ההודעות החיוניות, וגם חדשות, טיפים ומבצעים.' },
    save: 'שמירת הבחירה',
    saving: 'שומרים…',
    unsubscribeTitle: 'אישור ביטול ההרשמה',
    unsubscribeText: 'מספיקה לחיצה אחת: מעכשיו תקבלו רק הודעות חיוניות על החשבון.',
    unsubscribeButton: 'ביטול ההרשמה להודעות שאינן חיוניות',
    saved: {
      essential_only: 'בוצע: מעכשיו תקבלו רק הודעות חיוניות על החשבון.',
      all: 'בוצע: תקבלו את כל ההודעות שלנו.',
    },
    always: 'בכל מקרה, אנחנו תמיד שולחים את ההודעות ההכרחיות: קודי אבטחה, קבלות וחשבוניות, ותשובות לפניות שלכם.',
    error: (email: string) => `לא הצלחנו לשמור את הבחירה. נסו שוב בעוד כמה דקות או כתבו לנו לכתובת ${email}.`,
    invalid: 'הקישור אינו תקין או שהועתק רק בחלקו. בקשו קישור חדש למטה.',
    askTitle: 'קבלת קישור לניהול ההעדפות',
    askText: 'כדי להגן על הכתובת שלכם, הזינו אותה למטה: נשלח אליה קישור אישי לבחירת ההודעות שתקבלו. אף אחד אחר לא יכול לשנות את ההעדפות שלכם.',
    emailLabel: 'כתובת הדוא״ל שלכם',
    send: 'שלחו לי את הקישור',
    sending: 'שולחים…',
    sent: 'אם הכתובת תקינה, נשלחה אליה הודעה עם הקישור האישי שלכם (כדאי לבדוק גם בתיקיית הספאם).',
    tooMany: 'יותר מדי בקשות: נסו שוב מאוחר יותר.',
  },
  linkMail: {
    subject: (brand: string) => `העדפות הדוא״ל שלכם ב-${brand}`,
    hello: 'שלום,',
    line: (brand: string) => `זה הקישור האישי שלכם לבחירת ההודעות שתקבלו מ-${brand}:`,
    button: 'ניהול ההעדפות שלי',
    ignore: 'אם לא ביקשתם זאת, אפשר להתעלם מהודעה זו: שום דבר לא ישתנה.',
  },
  // Copy of an exchange with an AI assistant, sent to the person who asked for it (src/lib/conversationCopy.ts).
  // `day` starts with "יום …" (Intl, he-IL), hence the "ב" prefix.
  copyMail: {
    subject: (agent, brand) => (agent ? `עותק של השיחה שלכם עם ${agent} · ${brand}` : `עותק של השיחה שלכם עם ${brand}`),
    intro: (agent, gender, brand, day, time) =>
      `זהו העותק של השיחה שלכם עם ${agent ? `${agent}, ${gender === 'male' ? 'עוזר' : 'עוזרת'} ה-AI של ${brand},` : `עוזר ה-AI של ${brand},`} ב${day}, בשעה ${time}. אפשר לשמור אותו או להעתיק אותו כרצונכם.`,
    you: 'אתם',
    assistant: 'עוזר ה-AI',
    cut: '(ההודעה קוצרה)',
    truncated: (shown, total) => `שיחה ארוכה מאוד: העותק כולל רק את ${shown} ההודעות הראשונות (מתוך ${total}).`,
    linkRemoved: '[הקישור הוסר]',
    notYou: 'קיבלתם הודעה זו כי כתובת זו נמסרה במהלך השיחה. אם לא ביקשתם אותה, אפשר להתעלם ממנה.',
  },
  // Sign-in code for the My account page (src/lib/accountCode.ts), essential email (plural אתם).
  accountCode: {
    subject: (brand: string, code: string) => `קוד הכניסה שלכם ל-${brand}: ${code}`,
    hello: 'שלום,',
    line: (brand: string) => `זה הקוד שלכם לכניסה לחשבון באתר ${brand}:`,
    valid: 'הקוד בתוקף ל-10 דקות, ואפשר להשתמש בו פעם אחת בלבד.',
    ignore: 'אם לא ביקשתם קוד, אפשר להתעלם מהודעה זו: אף אחד לא יכול להיכנס לחשבון שלכם בלי הקוד הזה.',
  },
  // Confirmation d’une demande d’assistance (ticket T-XXXXXXXX), e-mail essentiel (src/lib/tickets.ts) : purement
  // informatif, sans prix ni offre ; pluriel אתם, comme les autres e-mails. L’objet doit commencer par
  // « פניית התמיכה שלכם T- » (scripts/test-dossier-tickets.ts). when (describeLocal, he-IL) commence par « יום … » :
  // d’où le préfixe « ב » collé (« ביום שישי, 16 באוקטובר 2026 בשעה 14:30 »), comme copyMail.
  ticketMail: {
    subject: (ticket: string, brand: string) => `פניית התמיכה שלכם ${ticket} התקבלה · ${brand}`,
    hello: (first: string | null) => (first ? `שלום ${first},` : 'שלום,'),
    recorded: (ticket: string) => `פניית התמיכה שלכם נרשמה. מספר הפנייה: ${ticket}. כדאי לשמור אותו: בעזרתו נאתר את הפנייה במהירות אם תפנו אלינו שוב.`,
    callAt: (when: string) => `נתקשר אליכם ב${when}.`,
    asap: 'נתקשר אליכם בהקדם האפשרי, בשעות הפעילות שלנו.',
    team: 'מישהו מהצוות שלנו יחזור אליכם בהקדם האפשרי.',
    reply: 'כדי להוסיף פרטים, אפשר פשוט להשיב למייל הזה ולציין את מספר הפנייה.',
    notYou: 'אם לא פניתם אלינו, אפשר להתעלם מההודעה הזו.',
    sign: (brand: string) => `צוות ${brand}`,
  },
};

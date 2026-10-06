// Hebrew cross-site messages (trial banner, badges, price note). Figures come from the market.
export const SITE_TEXT = {
  trialLine: (days: number, minutes: number) => `${days} ימי ניסיון חינם – ${minutes} דקות כלולות – המחירים לא כוללים מע״מ – ללא התחייבות וללא דמי הקמה`,
  trialBadges: (days: number, minutes: number) => [`${days} ימי ניסיון חינם`, `${minutes} דקות כלולות`, 'שום חיוב בתקופת הניסיון', 'ללא התחייבות', 'ללא דמי הקמה'],
  growthLines: ['אפשר להוסיף דקות בכל רגע', 'עוברים למסלול גבוה יותר כשהנפח גדל'],
  priceNote: (numberFrom: string) => `המחירים בדולר אמריקאי (USD), לא כולל מע״מ – מיסים מקומיים יתווספו לפי הצורך. מספר ייעודי החל מ-${numberFrom} לחודש, לא כולל מע״מ, בהתאם למדינה.`,
  skipToContent: 'דילוג לתוכן',
  languageLabel: 'שפה',
  payg: (rate: string) => `עוד לא בשלים למסלול חודשי? תשלום לפי שימוש: ${rate} לדקה, לא כולל מע״מ, בלי מנוי. טוענים קרדיט מתי שרוצים (Add credits), והוא לא פג. ברגע שהשיחות נכנסות באופן קבוע, מסלול חודשי יוצא זול יותר.`,
  talkNow: 'דברו עם הסוכן שלנו עכשיו',
  talkNowSub: 'הדגמה חיה, בחינם, בלי הרשמה',
  rechargeFreeAmount: 'הסכום לבחירתכם: מזינים אותו באזור הלקוח (Add credits). הסכומים שלמעלה הם דוגמאות בלבד.',
};

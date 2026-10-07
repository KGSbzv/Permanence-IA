// Interface text for the sales pages, Hebrew (Israel): home, pricing, plans, top-ups, sectors,
// features, integrations. Figures (prices, minutes, trial days) and the brand come in as
// parameters from the market (src/i18n/markets.ts): never write them here.
//
// Titles with a highlighted keyword are split into { before, kw, after }: `kw` is shown in colour.

// SEO title and description per sector, found from the Hebrew display name (src/i18n/content/he/sectors.ts).
// Titles stay at 45 characters or fewer so the " · Brand" suffix keeps them within 60.
// Unknown names fall back to a generic title.
const SECTOR_SEO: Record<string, { title: string; description: (days: number) => string }> = {
  'שירותי בית ובעלי מקצוע': {
    title: 'מענה טלפוני AI לבעלי מקצוע, 24/7',
    description: (days) => `מענה טלפוני AI לאינסטלטורים, חשמלאים וטכנאים: קריאות דחופות מסוננות ופניות מגיעות מסודרות, גם אחרי שעות העבודה. נסו ${days} יום בחינם.`,
  },
  'מרפאות שיניים': {
    title: 'מזכירה וירטואלית למרפאות שיניים',
    description: (days) => `מזכירה וירטואלית AI למרפאת שיניים: קביעת תורים, אישורים ושינויי מועד בלי להפריע לטיפולים. נסו ${days} יום בחינם.`,
  },
  'פיזיותרפיה ומקצועות הבריאות': {
    title: 'מזכירה וירטואלית לפיזיותרפיסטים',
    description: (days) => `מענה טלפוני AI לפיזיותרפיסטים, אוסטאופתים ומטפלים: תורים נקבעים ומוזזים בזמן הטיפולים. נסו ${days} יום בחינם.`,
  },
  'מרפאות וטרינריות': {
    title: 'מענה טלפוני AI למרפאה וטרינרית',
    description: (days) => `מענה טלפוני AI למרפאה וטרינרית: מקרים דחופים מנותבים לפי הנוהל שלכם, תורים נקבעים ותזכורות לחיסונים נשלחות. נסו ${days} יום בחינם.`,
  },
  'נדל״ן ומשרדי תיווך': {
    title: 'מענה טלפוני AI למשרדי תיווך',
    description: (days) => `מענה טלפוני AI למשרד תיווך: קונים, מוכרים ושוכרים מסוננים בזמן שאתם בסיורים בנכסים. נסו ${days} יום בחינם.`,
  },
  'מוסכים ורכב': {
    title: 'מענה טלפוני AI למוסכים, 24/7',
    description: (days) => `מענה טלפוני AI למוסך: תורים לטיפולים ובקשות להצעות מחיר מטופלים בלי להעמיס על הצוות בדלפק. נסו ${days} יום בחינם.`,
  },
  'מספרות וברברשופים': {
    title: 'קביעת תורים למספרות וברברשופים, 24/7',
    description: (days) => `קביעת תורים בטלפון למספרה ולברברשופ: סוכן AI קובע תורים בזמן שאתם עם לקוח בכיסא. נסו ${days} יום בחינם.`,
  },
  'קוסמטיקה וטיפוח': {
    title: 'קביעת תורים למכוני יופי וספא',
    description: (days) => `קביעת תורים למכון יופי, ספא וסטודיו לציפורניים: טיפולים נקבעים בטלפון בזמן שאתם עם לקוחות. נסו ${days} יום בחינם.`,
  },
  'מסעדות ומלונות': {
    title: 'הזמנת שולחנות בטלפון למסעדות, 24/7',
    description: (days) => `הזמנת שולחנות בטלפון, גם בשיא הערב: מספר סועדים, אלרגיות ושאלות של לקוחות מטופלים על ידי סוכן AI. נסו ${days} יום בחינם.`,
  },
  'עורכי דין ורואי חשבון': {
    title: 'מזכירה וירטואלית לעורכי דין ורואי חשבון',
    description: (days) => `מענה טלפוני AI למשרדי עורכי דין ורואי חשבון: שיחות מסוננות ופניות חדשות מגיעות מסודרות. נסו ${days} יום בחינם.`,
  },
  'חנויות אונליין': {
    title: 'שירות לקוחות AI לחנויות אונליין',
    description: (days) => `שירות לקוחות AI לחנות אונליין: מעקב הזמנות, החזרות ושאלות על מוצרים מטופלים בכל שעה, בטלפון ובהודעות. נסו ${days} יום בחינם.`,
  },
  'סוכני ביטוח ויועצי משכנתאות': {
    title: 'מענה טלפוני לסוכני ביטוח ויועצי משכנתאות',
    description: (days) => `מענה טלפוני AI לסוכני ביטוח ויועצי משכנתאות: חוזרים מהר לבקשות להצעת מחיר, מזכירים על מסמכים וקובעים פגישות. נסו ${days} יום בחינם.`,
  },
  'ניהול נכסים ובתים משותפים': {
    title: 'מענה טלפוני AI לחברות ניהול נכסים',
    description: (days) => `מענה טלפוני AI לניהול נכסים ובתים משותפים: תקלות של דיירים ממוינות ביום ובלילה, וביקורים בנכסים מתואמים. נסו ${days} יום בחינם.`,
  },
  'רפואה אסתטית וכירורגיה פלסטית': {
    title: 'מזכירה וירטואלית לרפואה אסתטית',
    description: (days) => `מענה טלפוני AI לקליניקה לרפואה אסתטית: פגישות ייעוץ נקבעות, תורים מאושרים יום לפני, ובלי ייעוץ רפואי. נסו ${days} יום בחינם.`,
  },
};

/** Workplace per sector, for "What it changes for your …" (followed by "שלכם"). */
const SECTOR_PLACE: Record<string, string> = {
  immobilier: 'משרד', 'dentaire-cliniques': 'מרפאה', 'kines-paramedical': 'קליניקה', 'cliniques-veterinaires': 'מרפאה',
  automobile: 'מוסך', 'salons-de-coiffure': 'מספרה', 'beaute-bien-etre': 'מכון', 'restaurants-hotellerie': 'מסעדה',
  'avocats-experts-comptables': 'משרד', 'e-commerce': 'חנות', 'courtiers-assurance-credit': 'סוכנות',
  'gestion-locative': 'חברה', 'medecine-esthetique': 'קליניקה',
};

export const UI_COMMERCE = {
  home: {
    meta: {
      title: (brand: string) => `מענה טלפוני חכם 24/7 לעסקים | ${brand}`,
      description: (days: number, minutes: number) =>
        `מענה טלפוני AI שעונה, מסנן פניות וקובע תורים 24/7, בשביל עסקים קטנים ובינוניים. ${days} יום ניסיון חינם, ${minutes} דקות כלולות.`,
    },
    hero: {
      title: { before: 'סוכני AI ש', kw: 'עונים לכל שיחה', after: '.' },
      intro: 'מענה טלפוני AI לעסקים: סוכנים קוליים שעונים לכל שיחה, שואלים את השאלות הנכונות, קובעים תורים ושולחים לכם סיכום ברור. זמינים 24/7, מוגדרים לפי התחום שלכם ופועלים תוך כמה דקות.',
      photoAlt: 'בעלת עסק קוראת סיכום שיחה בטלפון',
    },
    showcase: { title: 'ראו את הסוכן עובד בתחום שלכם', intro: 'בחרו תחום: השיחה מתנהלת, ובסופה הפנייה מגיעה אליכם מוכנה לטיפול.' },
    benefits: { title: 'מה הסוכן עושה בשביל העסק שלכם', intro: 'מזכירה וירטואלית שמכירה את העסק שלכם ועובדת בדיוק כשהצוות לא יכול לענות. העסק ממשיך לענות גם כשאתם או הצוות במילואים.' },
    features: {
      booking: {
        title: { before: 'אוטומציה ל', kw: 'קביעת תורים ולתזכורות', after: '' },
        text: 'מרפאות, מספרות, מוסכים, משרדים: הסוכן מתחבר ליומן שלכם, מציע מועדים פנויים, קובע ומאשר. כולל שינויי מועד וביטולים.',
        points: ['יומן בזמן אמת: Google Calendar, ‏Outlook ועוד, דרך Cal.com או Calendly', 'אישור ב-SMS או בוואטסאפ (החל ממסלול עוזר AI)', 'תזכורת יום לפני התור (החל ממסלול עוזר AI)'],
        link: 'לקביעת תורים',
      },
      support: {
        title: { before: 'עונים ל', kw: 'שאלות הלקוחות', after: ' בלי המתנה' },
        text: 'הסוכן נשען על המסמכים, עמודי האתר והנהלים שלכם. הוא עונה במדויק, ומעביר לצוות כל מה שדורש מגע אנושי.',
        points: ['מאגר ידע: קובצי PDF, אתר, נתונים', 'כמה שיחות במקביל, בלי תור המתנה', 'העברה לנציג אנושי לפי הכללים שלכם'],
        link: 'לשירות לקוחות',
      },
      leads: {
        title: { before: 'מסננים ו', kw: 'חוזרים ללידים', after: ' מהר יותר' },
        text: 'טופס שמולא באתר הופך לשיחה תוך דקות. הסוכן מסנן, עוקב ומכין כרטיס שהצוות שלכם יכול לטפל בו מיד.',
        points: ['סינון מקדים לפי הקריטריונים שלכם', 'מעקבים ואישורים אוטומטיים', 'קמפיינים לאנשי קשר שנתנו הסכמה'],
        link: 'לסינון לידים',
      },
    },
    useCases: { title: 'סוכן לכל סוג של שיחה', intro: 'שיחות נכנסות, יוצאות או הודעות: הפעילו את השימושים שהעסק שלכם צריך, ממענה טלפוני בערב ועד מעקב אחרי הצעות מחיר.' },
    platform: {
      title: 'הפלטפורמה המלאה לאוטומציה של שיחות',
      intro: 'הרבה יותר ממשיבון חכם: קול, בינה מלאכותית, טלפוניה, אוטומציות ודוחות כלולים, במקום אחד.',
      link: 'כל היכולות',
    },
    steps: {
      title: 'פועלים בארבעה שלבים',
      intro: 'לא צריך ידע טכני. אנחנו מלווים אתכם בכל שלב.',
      items: (days: number, minutes: number) => [
        { title: 'פתחו חשבון', text: `בחרו מסלול: ${days} יום בחינם, ${minutes} דקות כלולות, וללא חיוב בתקופת הניסיון.` },
        { title: 'תארו את העסק', text: 'שירותים, שעות פעילות, שאלות נפוצות, כללי העברה.' },
        { title: 'בדקו את הסוכן', text: 'הקשיבו לו בהדגמה החיה, וכווננו את הטון והתשובות.' },
        { title: 'חברו את השיחות', text: 'הפניית הקו הקיים, מספר חדש או SIP, ובנוסף ווידג׳ט באתר שלכם.' },
      ],
    },
    sectors: {
      title: 'סוכנים שמותאמים לתחום שלכם',
      intro: 'אחד־עשר תחומים שבהם כל שיחה שלא נענתה עולה לקוח. הסוכן שואל את השאלות הנכונות לכל אחד מהם.',
      link: 'כל התחומים',
    },
    integrations: {
      title: 'מחובר לכלים שלכם',
      intro: 'יומן, CRM, הודעות, טלפוניה: הסוכן עובד עם מה שאתם כבר משתמשים בו. בונה התהליכים מחבר יותר מ-300 כלים בלי קוד, בדומה ל-Zapier או ל-Make.',
      link: 'לכל האינטגרציות',
    },
    pricing: {
      title: 'מסלולים ברורים, מחירים לא כולל מע״מ',
      intro: 'בחרו את המענה הטלפוני AI לפי נפח השיחות שלכם. ככל שהמסלול גדול יותר, הדקה זולה יותר.',
      compare: 'להשוואת כל היכולות הכלולות',
    },
    faq: {
      title: 'שאלות נפוצות',
      intro: 'לא מצאתם תשובה? השאירו מספר ויועץ יחזור אליכם.',
      link: 'לכל השאלות',
    },
  },

  tarifs: {
    meta: {
      title: (brand: string) => `מחירי מענה טלפוני AI, מסלולים וקרדיט · ${brand}`,
      /** One plan in the description: `price` and `minutes` already formatted. */
      annualOffer: (name: string) => `${name} (חיוב שנתי)`,
      plan: (name: string, price: string, minutes: string) => `${name}: ${price} ל-${minutes} דק׳`,
      description: (plans: string[], days: number, minutes: number) =>
        `מסלולי מענה טלפוני AI, לא כולל מע״מ: ${plans.join(', ')}. ${days} יום ניסיון חינם, ${minutes} דקות כלולות.`,
    },
    hero: {
      title: 'מחירי המענה הטלפוני AI: בחרו מסלול לפי נפח השיחות',
      intro: (days: number, minutes: number) =>
        `כל המחירים מוצגים לא כולל מע״מ. ככל שהמסלול גדול יותר, הדקה זולה יותר. תקופת הניסיון החינמית כוללת ${days} יום ו-${minutes} דקות שיחה.`,
      moreMinutes: 'צריכים עוד דקות? אפשר לטעון קרדיט בכל רגע.',
    },
    matrix: {
      title: 'מה כלול בממשק שלכם',
      intro: 'כל שורה מתאימה לעמוד או ליכולת שתמצאו באזור הלקוח. שום דבר לא מוסתר מאחורי כפתור.',
    },
    recharges: {
      title: 'צריכים עוד דקות?',
      intro: 'טעינת קרדיט עוזרת בחודש עמוס. לנפח קבוע, המסלול הבא נשאר האפשרות המשתלמת ביותר.',
      link: 'איך עובדת טעינת קרדיט',
    },
    // מסגרת "הודעות כתובות": העלויות לקוחות מהגדרות הקרדיטים באזור הלקוח.
    messageCredits: {
      title: 'הודעות כתובות: המחיר בקרדיטים',
      intro: 'תשובות כתובות של ה-AI והודעות שנשלחות (צ׳אט באתר, וואטסאפ, מסנג׳ר, אינסטגרם, SMS) יורדות מיתרת הקרדיטים להודעות שלכם.',
      usageCol: 'שימוש',
      costCol: 'עלות בקרדיטים',
      rows: [
        { label: 'תשובה כתובה של ה-AI (צ׳אט באתר, וואטסאפ, מסנג׳ר, אינסטגרם)', cost: '3 קרדיטים' },
        { label: 'הודעת וואטסאפ שהתקבלה או נשלחה בתוך שיחה פתוחה (session)', cost: '1.4 קרדיטים' },
        { label: 'הודעת תבנית בוואטסאפ (template)', cost: 'התעריף של Meta לפי מדינה וקטגוריה, בתוספת עמלה' },
        { label: 'SMS שנשלח', cost: '2 קרדיטים' },
        { label: 'שיחת וואטסאפ', cost: 'בחיוב לפי דקות' },
      ],
      smsNote: 'העלות של SMS עשויה להשתנות לפי המפעיל או המדינה.',
      getTitle: 'איך מקבלים קרדיטים',
      included: 'כלולים בכל חודש במסלול שלכם:',
      includedValue: (credits: string, replies: string) => `${credits} קרדיטים בחודש (כ-${replies} תשובות)`,
      convert: 'או ממירים דקות לקרדיטים מאזור הלקוח: דקה אחת = 9 קרדיטים.',
      balance: 'את היתרה רואים באזור הלקוח. כשהיתרה מגיעה ל-0 קרדיטים, התשובות הכתובות ושליחת SMS או הודעות וואטסאפ נעצרות עד לטעינה הבאה.',
    },
    faq: {
      title: 'שאלות על המחירים',
      intro: 'לא בטוחים איזה מסלול מתאים לכם? בקשו שיחה חוזרת, או נסו את הסוכן בהדגמה חיה.',
      primary: 'התחילו בחינם',
      demo: 'להדגמה החיה',
    },
    finalCta: (minutes: number) => `התחילו עם ${minutes} דקות חינם`,
  },

  offer: {
    metaTitleTrial: (days: number, minutes: number, brand: string) => `מענה טלפוני AI: ${days} יום חינם, ${minutes} דקות · ${brand}`,
    /** `monthly`: adds "per month excl. VAT" when the price is a monthly amount. */
    metaTitle: (name: string, price: string, monthly: boolean, brand: string) =>
      monthly ? `מסלול ${name} – ${price} לחודש + מע״מ · ${brand}` : `מסלול ${name} – ${price} · ${brand}`,
    metaDescription: (title: string, days: number, minutes: number) => `${title}. מחירים לא כולל מע״מ, ללא התחייבות. ${days} יום ניסיון חינם, ${minutes} דקות כלולות.`,
    breadcrumb: 'מחירים',
    productName: (brand: string, name: string) => `${brand} ${name}`,
    eyebrow: (name: string, audience: string) => `מסלול ${name} · ${audience}`,
    demo: 'נסו את הסוכן בהדגמה חיה',
    perMonth: 'לחודש, לא כולל מע״מ',
    orAnnual: (price: string) => `או ${price} לשנה, לא כולל מע״מ (חודשיים מתנה)`,
    perMinuteLine: (perMinute: string) => `כלומר ${perMinute} בתוך המסלול`,
    facts: {
      minutes: 'דקות כלולות',
      more: 'צריכים יותר?',
      moreCustom: 'נפח בהתאמה אישית',
      moreDefault: 'טעינת קרדיט בכל רגע',
      commitment: 'התחייבות',
      commitmentValue: 'אין',
    },
    included: {
      title: 'מה תמצאו בממשק שלכם',
      intro: 'הרשימה המדויקת של היכולות הזמינות במסלול הזה.',
      notIncluded: 'לא כלול',
      includedLabel: 'כלול',
      compare: 'להשוואה עם המסלולים האחרים',
    },
    modules: { title: 'המודולים המרכזיים במסלול הזה' },
    extra: {
      title: 'דקות נוספות',
      intro: 'חודש עמוס יותר? טענו קרדיט. הנפח גדל? עברו למסלול הבא.',
    },
    others: { title: 'מסלולים נוספים' },
    faq: { title: 'שאלות נפוצות' },
  },

  recharges: {
    meta: {
      title: (brand: string) => `טעינת קרדיט לדקות מענה טלפוני AI · ${brand}`,
      description: (price: string, minutes: string) =>
        `דקות נוספות למענה הטלפוני AI שלכם: טעינת קרדיט החל מ-${price} לא כולל מע״מ עבור ${minutes} דקות. טוענים בכל רגע מאזור הלקוח.`,
    },
    hero: {
      title: 'מוסיפים דקות בכל רגע',
      intro: 'טעינת קרדיט עוזרת בחודש עמוס יותר. אם אתם טוענים לעיתים קרובות, המסלול הבא ישתלם יותר: נעדכן אתכם.',
    },
    how: {
      title: 'איך זה עובד',
      steps: (min: string, max: string) => [
        { title: 'עוקבים אחרי השימוש', text: 'לוח הבקרה מציג את הדקות שנוצלו ואת הדקות שנותרו.' },
        { title: 'טוענים קרדיט', text: `טעינה של ${min} עד ${max}, בלחיצה אחת מאזור הלקוח.` },
        { title: 'ממשיכים בלי הפסקה', text: 'הקרדיט מכסה דקות מעבר למסלול, ותוקפו לא פג.' },
      ],
    },
  },

  sectorsIndex: {
    meta: {
      title: (brand: string) => `מענה טלפוני AI לפי תחום · ${brand}`,
      description: 'מענה טלפוני AI לבעלי מקצוע, וטרינרים, משרדי תיווך, מוסכים, מספרות, מסעדות, עורכי דין ורואי חשבון.',
    },
    hero: {
      title: 'מענה טלפוני AI שמותאם לתחום שלכם',
      intro: 'בחרנו אחד־עשר תחומים שבהם השיחות מגיעות בדיוק כשהצוות עסוק, וכל פנייה שלא נענתה עולה לקוח. מקו החירום של אינסטלטור ועד דלפק הקבלה של מרפאה וטרינרית, מהמספרה ועד משרד עורכי הדין, הסוכן שואל את השאלות הנכונות.',
    },
    other: {
      title: 'התחום שלכם לא ברשימה?',
      intro: 'בתי ספר לנהיגה, חדרי כושר, גיוס עובדים, תיירות: אפשר להגדיר את הסוכן לכל עסק שמקבל שיחות. בואו נדבר על המקרה שלכם.',
      primary: 'התחילו בחינם',
      demo: 'נסו את הסוכן בהדגמה חיה',
    },
  },

  sector: {
    meta: {
      title: (name: string, brand: string) => `${SECTOR_SEO[name]?.title ?? `מענה טלפוני AI ל${name}`} · ${brand}`,
      /** `short` is the sector's short sentence, without a final full stop. */
      description: (name: string, short: string, days: number, minutes: number) =>
        SECTOR_SEO[name]?.description(days) ?? `${short}. ${days} יום ניסיון חינם, ${minutes} דקות כלולות.`,
    },
    breadcrumb: 'תחומים',
    liveCallTitle: (name: string) => `סוכנת AI ל${name}`,
    change: {
      title: 'מה משתנה כשסוכן AI עונה במקומכם',
      intro: (targets: string) => `${targets}. בתחום שלכם, כל שיחה שלא נענתה היא פנייה שהולכת למתחרים.`,
    },
    handles: {
      title: 'במה הסוכן מטפל בשביל העסק שלכם',
      intro: 'הוא שואל את השאלות שהייתם שואלים, בסדר טבעי, ומעביר לכם פנייה מלאה.',
    },
    /** Benefits title: the trade's workplace (office, clinic, salon…), "business" by default. */
    benefitsTitle: (slug: string) => `מה זה משנה ל${SECTOR_PLACE[slug] ?? 'עסק'} שלכם`,
    how: { title: 'איך זה עובד' },
    includes: { title: 'מה כלול', intro: 'המודולים השימושיים ביותר לתחום שלכם, כולם זמינים באזור הלקוח.' },
    integrations: {
      title: 'אינטגרציות שימושיות',
      intro: 'היומן, ה-CRM, ההודעות והטלפוניה שלכם נשארים כמו שהם: הסוכן מתחבר אליהם.',
    },
    pricing: {
      title: 'מחירים לא כולל מע״מ, ללא התחייבות וללא דמי הקמה',
      intro: (sectorName: string, offerName: string, days: number, minutes: number) =>
        `לתחום ${sectorName} אנחנו ממליצים על מסלול ${offerName}. התחילו בתקופת ניסיון חינם: ${days} יום ו-${minutes} דקות כלולות.`,
      link: (offerName: string) => `לפרטי מסלול ${offerName}`,
    },
    faq: { title: (name: string) => `שאלות נפוצות – ${name}` },
    callback: {
      title: 'דברו איתנו: השאירו מספר ונחזור אליכם',
      text: 'יועץ יחזור אליכם כדי לבחון את המקרה שלכם.',
    },
    others: { title: 'תחומים נוספים' },
    finalCta: 'מוכנים להפסיק לפספס שיחות?',
  },

  featuresIndex: {
    meta: {
      title: (brand: string) => `היכולות של המענה הטלפוני AI · ${brand}`,
      description: 'מזכירה וירטואלית, קביעת תורים, סינון לידים, וואטסאפ, מאגר ידע, SIP ודוחות: כל היכולות של המענה הטלפוני AI. נסו בחינם.',
    },
    hero: {
      title: 'כל מה שצריך לאוטומציה של השיחות שלכם',
      intro: 'ארבעה־עשר מודולים של מענה טלפוני AI, שמופעלים לפי המסלול שלכם, מתוך אזור הלקוח.',
    },
    overview: { title: 'סקירה כללית' },
  },

  feature: {
    meta: {
      title: (name: string, brand: string) => `${name} – מענה טלפוני AI · ${brand}`,
      /** `short` is the module's benefit sentence, without a final full stop. */
      description: (short: string, offerName: string, days: number) => `${short}. כלול החל ממסלול ${offerName}. ${days} יום ניסיון חינם.`,
    },
    breadcrumb: 'יכולות',
    eyebrow: (family: string, name: string) => `${family} · ${name}`,
    uses: { title: 'למה זה משמש' },
    from: {
      title: (offerName: string) => `כלול החל ממסלול ${offerName}`,
      /** `price` already formatted in the market currency. */
      priceLine: (price: string, minutes: string) => `${price} לחודש, לא כולל מע״מ · ${minutes}`,
      offerLink: (offerName: string) => `למסלול ${offerName}`,
      compare: 'השוואת מסלולים',
    },
    how: { title: 'איך זה עובד' },
    cases: { title: 'תרחישי שימוש' },
    integrations: { title: 'אינטגרציות קשורות', link: 'לכל האינטגרציות' },
    more: { title: 'אולי יעניין אתכם גם' },
  },

  integrations: {
    tools: { title: 'יותר מ-300 כלים דרך האוטומציות', intro: 'עם פלטפורמת האוטומציות (החל ממסלול עוזר AI), כל שיחה יכולה להזין את הכלים שלכם: אימייל, צ׳אט צוותי, CRM, חנות אונליין, תשלומים, גיליונות. הנה כמה מהם.' },
    meta: {
      title: (brand: string) => `אינטגרציות למענה טלפוני AI: CRM ויומן · ${brand}`,
      description: 'חברו את המענה הטלפוני AI ליומן שלכם (Google Calendar, ‏Outlook דרך Cal.com או Calendly), ל-HubSpot, Zoho, וואטסאפ, SIP ויותר מ-300 כלים בלי קוד. לכל האינטגרציות.',
    },
    hero: {
      title: 'מחובר לכלים שאתם כבר משתמשים בהם',
      intro: 'יומן, CRM, הודעות, טלפוניה: המענה הטלפוני AI משתלב בדרך שבה אתם עובדים, ובונה התהליכים מחבר יותר מ-300 כלים בלי קוד.',
    },
    flow: {
      title: { before: 'בנו אוטומציות ', kw: 'בלי קוד', after: '' },
      text: 'טופס שמולא, שיחה שהסתיימה, ליד חדש: כל אירוע יכול להפעיל רצף פעולות בכלים שלכם, בדומה ל-Zapier או ל-Make, ישירות מאזור הלקוח.',
      points: ['יותר מ-300 כלים זמינים', 'גרירה ושחרור, בלי פיתוח', 'בדיקות לפני הפעלה'],
      link: 'לבונה התהליכים',
    },
    api: {
      title: { before: 'Webhooks ו-API ', kw: 'למערכות שלכם', after: '' },
      text: 'בכל המסלולים, קבלו כל שיחה שהסתיימה ואת הנתונים שחולצו ממנה ישירות למערכות שלכם, או הפעילו את הסוכן מהתוכנה שלכם.',
      points: ['Webhook אחרי כל שיחה', 'משתנים שחולצו: תוצאה, רמת עניין, מועד', 'כלים במהלך השיחה, החל ממסלול עוזר AI'],
    },
  },
};

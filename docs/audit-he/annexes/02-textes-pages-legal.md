# Audit HE – src/i18n/content/he/ui/pages.ts (phase 2)

## Synthèse

- **Niveau global : bon à très bon.** Hébreu correct, peu de vraies fautes, pages légales d'un registre juridique israélien crédible (בעל שליטה/מחזיק, סעיף 30א, תקנות העברת מידע 2001, הכחשת עסקה, ״הסר״…). La traduction a déjà été adaptée à Israël en plusieurs endroits, mieux que dans une simple transposition du FR.
- **Problème systémique n°1 : la formule « מענה טלפוני AI »**, utilisée 10 fois dans ce fichier et 56 fois sur le site. Ce n'est pas faux, mais c'est un calque (nom + adjectif + sigle collé). Pour les meta, il faut une formule plus naturelle, alignée sur le tagline du marché « מענה טלפוני חכם 24/7 » : « מענה טלפוני חכם » ou « מענה טלפוני מבוסס AI ». C'est aussi un enjeu SEO : les recherches israéliennes portent sur « מענה טלפוני », « מענה טלפוני לעסקים », « מזכירה וירטואלית » et « מענה טלפוני אוטומטי ».
- **N°2 : incohérence de terme sur les offres.** Ce fichier dit « חבילה/חבילות » (environ 20 fois). Le reste du site dit « מסלול » (114 fois : offers.ts, site.ts). Il faut passer partout à « מסלול ».
- **N°3 : genre de l'agent / de l'assistante incohérent.** Le marché présente « נועה, סוכנת ה-AI » au féminin, et le FR dit « notre assistante ». Ici on trouve « העוזר שלנו » (masculin) l.18, « עוזרת העזרה » (féminin) l.120 et « ״עוזר AI״ » l.176. L'agent de démo est tantôt « הסוכן », tantôt « הקול שלו ».
- **N°4 : contradiction factuelle bloquante sur la page contact.** Le texte dit « איננו מפרסמים מספר טלפון », alors que contact.tsx affiche juste à côté le 02-376-7085 (market.phone).
- **N°5 : résidus France/UE pour un lecteur israélien.** La phrase sur le démarchage en France figure sur la page sécurité (l.193). La politique de confidentialité mentionne les directives post-mortem françaises et la CNIL. Le FDPIC est mal traduit.
- **N°6 : risques juridiques.** Les clauses du contrat sont du modèle US : arbitrage AAA à Cheyenne en anglais, renonciation à l'action collective, prescription de 3 mois, plafond de 1 000 USD, modification unilatérale. Pour des clients israéliens, elles sont exposées au חוק החוזים האחידים, התשמ״ג-1982, qui s'applique aussi en B2B. La règle « la version anglaise prévaut » est par ailleurs dangereuse : la version EN ne contient **aucune** des clauses propres à Israël.
- **Manques :** pas de **הצהרת נגישות**, ce qui est risqué pour un site israélien. Rien n'est dit sur la mention « פרסומת » exigée par le 30א, sur la facture (חשבונית) ni sur le traitement de la TVA d'un fournisseur étranger.
- **Validation par un עורך דין ישראלי indispensable** avant mise en ligne des CGU, de la confidentialité et de la page sécurité.

## Tableau de corrections

| fichier:ligne | texte actuel | correction proposée (hébreu) | type | sévérité |
|---|---|---|---|---|
| pages.ts:39 | איננו מפרסמים מספר טלפון: אנחנו חוזרים אליכם בשעה שתבחרו. אפשר גם לכתוב לנו במייל. | אפשר להתקשר אלינו ישירות – נועה, סוכנת ה-AI שלנו, עונה 24/7 – או להשאיר מספר ונחזור אליכם בשעה שתבחרו. אפשר גם לכתוב לנו במייל. | fait | Bloquant |
| pages.ts:193 | …מחייבת הסכמה מפורשת מראש (סעיף 30א לחוק התקשורת), ובצרפת, שיווק טלפוני מחייב הסכמה מוקדמת של האדם מאז 11 באוגוסט 2026 | …מחייבת הסכמה מפורשת מראש (סעיף 30א לחוק התקשורת), וכל הודעה כזו חייבת לכלול את המילה ״פרסומת״, את פרטי המפרסם ואפשרות הסרה פשוטה (supprimer la référence française) | fait / juridique | Bloquant |
| pages.ts:477 | תנאים אלה מתפרסמים בכמה שפות. במקרה של סתירה, הנוסח האנגלי גובר. | Soit ajouter les clauses Israël (30א, תיקון 13, תקנות 2001) à la version EN, soit écrire : ״במקרה של סתירה, הנוסח האנגלי גובר, למעט הוראות הנוגעות לדין הישראלי, שלגביהן יגבר הנוסח העברי.״ (aujourd'hui la version EN ne contient aucune clause Israël, donc la version qui prévaut les « efface ») | juridique | Majeur |
| pages.ts:13 | הדגמה של סוכן קולי AI – נסו אותו בשידור חי · ${brand} | הדגמה חיה של מענה טלפוני חכם – דברו עם נועה · ${brand} (« בשידור חי » = retransmission en direct, c'est un calque de « en live ») | calque / SEO | Majeur |
| pages.ts:16 | נסו עכשיו את המענה הטלפוני AI שלנו בהדגמה חיה | נסו עכשיו את המענה הטלפוני החכם שלנו – בהדגמה חיה | calque | Majeur |
| pages.ts:17 | הסוכן מתקשר אליכם ומדגים… תשמעו את הקול שלו, את הקצב שלו ואת האופן שבו הוא מברר… | הסוכנת מתקשרת אליכם ומדגימה… תשמעו את הקול שלה, את הקצב שלה ואת האופן שבו היא מבררת ומסווגת פנייה. (agent de démo = נועה, au féminin ; même accord aux l.23, 26 et 27 : « הסוכנת מתקשרת אליכם », « ומדגימה », « קטעו אותה ») | incohérence | Majeur |
| pages.ts:18 | …העוזר שלנו עונה בקול או בכתב. | …העוזרת שלנו עונה בדיבור או בצ׳אט. (féminin comme le FR « notre assistante » et comme la l.120 ; vérifier aussi qu'en RTL la bulle est bien à droite) | incohérence | Majeur |
| pages.ts:14 | …קבלו שיחת הדגמה המותאמת לתחום שלכם. בחינם וללא התחייבות. הזמינו שיחת הדגמה עכשיו. | שמעו את נועה, סוכנת ה-AI שלנו, עונה לשיחות בזמן אמת: דברו איתה או קבלו שיחת הדגמה מותאמת לתחום שלכם – בחינם וללא התחייבות. (supprime la répétition de « שיחת הדגמה ») | SEO / incohérence | Mineur |
| pages.ts:20 | שיחה חינם, בשעה שנוחה לכם. | שיחה בחינם, בשעה שנוחה לכם. | faute (registre) | Mineur |
| pages.ts:36 | שאלות על המענה הטלפוני AI שלנו? | שאלות על המענה הטלפוני החכם שלנו? | calque / SEO | Mineur |
| pages.ts:41 | שאלות על חבילות, הדגמות… | שאלות על המסלולים, הדגמות והצעות מחיר בהתאמה אישית. | incohérence | Mineur |
| pages.ts:53 | שאלות נפוצות על מענה טלפוני AI · ${brand} | שאלות נפוצות על מענה טלפוני חכם לעסקים · ${brand} | SEO | Mineur |
| pages.ts:54 / 56 | איך עובד המענה הטלפוני AI של… / מענה טלפוני AI: שאלות נפוצות | איך עובד המענה הטלפוני החכם של… / מענה טלפוני חכם: שאלות נפוצות | calque | Mineur |
| pages.ts:64 | תקופת ניסיון חינם למענה טלפוני AI – ${days} ימים | ${days} יום ניסיון חינם למענה טלפוני חכם · ${brand} (« 14 יום » est la forme usuelle, déjà employée dans offers.ts ; aligner aussi les l.65, 68, 70 et 770) | SEO / incohérence | Mineur |
| pages.ts:65 | …שום חיוב בתקופת הניסיון, ביטול בכל עת. | …ללא חיוב בתקופת הניסיון וביטול בכל עת. | naturel | Mineur |
| pages.ts:68 / 78 / 96 | בחרו את החבילה… / את החבילה שתרצו לנסות / חבילה מועדפת | בחרו את המסלול… / את המסלול שתרצו לנסות / מסלול מועדף | incohérence | Majeur (systémique) |
| pages.ts:68 | ובדקו את המענה הטלפוני AI על העסק שלכם | ובדקו את המענה הטלפוני החכם בעסק שלכם | calque | Mineur |
| pages.ts:85 | כדי להגדיר יחד אתכם את הסוכן הראשון | כדי להגדיר איתכם את הסוכן הראשון | naturel | Mineur |
| pages.ts:90 | חברה | שם העסק (beaucoup de PME israéliennes sont des עוסק מורשה/פטור, pas des sociétés) | adaptation | Mineur |
| pages.ts:97 / 157 | לא כולל מע״מ / מחירים מוצגים לפני מע״מ | Vérifier la configuration Stripe Tax : si aucune TVA israélienne n'est facturée (fournisseur US, B2B), « לא כולל מע״מ » laisse croire que 18 % seront ajoutés. Formulation neutre : ״המחירים בדולר, לפני מסים (אם חלים)״ | fait | Majeur |
| pages.ts:101-105 | אני מאשר/ת את תנאי השימוש… ומסכים/ה לקבל שיחה חוזרת לצורך הגדרת החשבון. | קראתי ואני מסכים/ה לתנאי השימוש… ומסכים/ה לקבל שיחה חוזרת, גם מסוכנת AI, לצורך הגדרת החשבון. (consentement explicite à un appel par IA, cohérent avec 30א et le תיקון 13 ; toute case marketing doit être séparée et décochée) | juridique | Mineur |
| pages.ts:108 | לא הצלחנו לשלוח את ההרשמה. | לא הצלחנו לשלוח את הבקשה. נסו שוב. | naturel | Mineur |
| pages.ts:116 | מדריך לאזור הלקוח של המענה הטלפוני AI | מדריך לאזור הלקוח: מה עושה כל תפריט, יצירת סוכן, מספרים, יומן, וידג׳ט, דקות וחיוב. | calque | Mineur |
| pages.ts:120 / 122 | עוזרת העזרה | עוזרת התמיכה (« עוזרת העזרה » est tautologique) | faute (style) | Majeur |
| pages.ts:127 | …ולחצו על Add credits. | …ולחצו על Add credits (הוספת קרדיט). (le FR traduit le libellé du menu anglais, à faire ici aussi ; idem l.129 : Assistants (סוכנים), Web widget (וידג׳ט לאתר)) | manque | Mineur |
| pages.ts:133 | תפריט | תפריט (באנגלית) | manque | Mineur |
| pages.ts:143-144 | אודות – מענה טלפוני AI לעסקים קטנים / …עם מענה טלפוני AI: מענה 24/7… | אודות – מענה טלפוני חכם לעסקים קטנים / …עם מענה טלפוני חכם 24/7, מותאם לתחום שלכם. (supprime aussi la répétition de « מענה ») | calque / SEO | Mineur |
| pages.ts:151 | אנחנו מספקים מענה טלפוני AI שעונה… | אנחנו מספקים מענה טלפוני חכם שעונה, מברר את הפנייה, קובע תורים ומחזיר שיחות… | calque | Mineur |
| pages.ts:158 | אין נתון או הבטחה שאיננו יכולים לגבות | אין נתון או הבטחה שאיננו יכולים להוכיח (« לגבות » est ambigu : « encaisser / percevoir ») | faute (sens) | Majeur |
| pages.ts:45 / 144 / 147 / 719 | ${brand} הוא מותג… / ${brand} עוזרת / נולדה / אינה נושאת | Fixer une règle : la marque au féminin (= החברה), donc « היא מותג של… », ou bien « המותג ${brand}… » | incohérence | Mineur |
| pages.ts:166 | …כך המענה הטלפוני AI של ${brand} מגן… | …כך ${brand} מגנה על נתוני השיחות שלכם. | calque | Mineur |
| pages.ts:169 | …לעמוד בחוק הגנת הפרטיות, התשמ״א-1981, ובתקנות אבטחת המידע. | …לעמוד בחוק הגנת הפרטיות, התשמ״א-1981 (כולל תיקון 13, בתוקף מאוגוסט 2025), ובתקנות אבטחת המידע. | manque / juridique | Mineur |
| pages.ts:174 / 186 / 308 / 641 | רשימת החרגה / רשימת חסימה / רשימות התנגדות / רשימת ההסרה | Unifier : « רשימת הסרה » (opt-out des personnes) et « רשימות התנגדות » (registres nationaux) seulement pour les registres étrangers | incohérence | Mineur |
| pages.ts:176 | הודעת ״עוזר AI״ בתחילת השיחה | הודעה בתחילת השיחה שמדובר בסוכן AI (ou ״עוזרת AI״) | incohérence | Mineur |
| pages.ts:182 | עמידה ב-GDPR ובחוק הגנת הפרטיות… | עמידה בחוק הגנת הפרטיות וב-GDPR… (Israël d'abord pour ce public) | adaptation | Mineur |
| pages.ts:189 | ליווי בהתאמת הודעות הפרטיות שלכם | ליווי בניסוח הודעת היידוע (הודעת פרטיות) ללקוחות שלכם (calque de « mentions d'information ») | calque | Mineur |
| pages.ts:192 | …מי שמתנגד יכול לפנות אלינו בכתב במקום זאת | …מי שמתנגד/ת להקלטה יכול/ה לפנות לעסק בכתב במקום זאת. (pour les agents des clients, c'est l'entreprise cliente qui reçoit la demande, pas PermanenceAI) | fait | Mineur |
| pages.ts:204 | הציצו בחבילות שלנו | הציצו במסלולים שלנו | incohérence | Mineur |
| pages.ts:244 | ורשאים לסרב לחשבון | ורשאים לסרב לפתיחת חשבון | faute | Mineur |
| pages.ts:252, 257, 261, 270-271 | חבילה / החבילות / לחבילה זולה יותר | מסלול / המסלולים / למסלול זול יותר | incohérence | Mineur |
| pages.ts:261 | כל תקופה ששולמה נצברת במלואה ואינה ניתנת להחזר | התשלום עבור כל תקופה ששולמה הוא סופי ואינו ניתן להחזר (« נצברת » = « s'accumule » : contresens par rapport à « définitivement acquise ») | faute (sens) | Majeur |
| pages.ts:269 | המחירים נקובים בדולר ארה״ב (USD), ללא מסים. …(עם או בלי מספר עוסק/מספר מע״מ) | המחירים נקובים בדולר ארה״ב (USD) ואינם כוללים מסים. …(עם או בלי מספר עוסק מורשה/ח״פ) | naturel / adaptation | Mineur |
| pages.ts:272 | מלוח הבקרה שלו | מאזור הלקוח (terme utilisé partout ailleurs) | incohérence | Mineur |
| pages.ts:274 | ריבית של 1.5% לחודש… פיצוי קבוע על הוצאות גבייה הקבוע בדין | Environ 19,6 %/an ; en Israël, c'est attaquable via חוק החוזים האחידים / חוק פסיקת ריבית והצמדה. « פיצוי קבוע… הקבוע בדין » est un calque de l'indemnité forfaitaire française de 40 € (sans équivalent israélien) : à supprimer. | juridique / calque | Mineur |
| pages.ts:287 | כל פעילות בלתי חוקית, הונאה, מטעה או פוגענית | כל פעילות בלתי חוקית, של מרמה, מטעה או פוגענית (un nom au milieu d'une suite d'adjectifs) | faute | Mineur |
| pages.ts:290 | …ביטוחיות, אשראי, תעסוקה או דיור… ; שיחות או הודעות פוליטיות או בחירות אוטומטיות | …ביטוחיות, או בענייני אשראי, תעסוקה או דיור… ; שיחות או הודעות אוטומטיות בנושאים פוליטיים או בקשר לבחירות (« בחירות אוטומטיות » se lit « élections automatiques ») | faute (sens) | Majeur |
| pages.ts:291 | מספרי זהות ומזהים ממשלתיים | מספרי תעודת זהות ומזהים ממשלתיים אחרים | adaptation | Mineur |
| pages.ts:307 | …מחייב את הסכמתו המפורשת של הנמען מראש (סעיף 30א לחוק התקשורת). | …מחייב את הסכמתו המפורשת של הנמען מראש, וכן ציון המילה ״פרסומת״ בתחילת ההודעה, פרטי המפרסם ודרך הסרה (סעיף 30א לחוק התקשורת; הפרה עלולה לחייב בפיצויים לדוגמה ללא הוכחת נזק). | juridique / manque | Majeur |
| pages.ts:315 | מספר עשוי להשתחרר, ולאבד לצמיתות, בעת ביטול… | מספר עלול להשתחרר ולאבוד ללקוח לצמיתות בעת ביטול… (« לאבד » transitif sans complément) | faute | Mineur |
| pages.ts:367 | …ולהציג את הלוגו שלו כלקוח ממליץ | …ולהציג את הלוגו שלו ברשימת הלקוחות שלנו | calque | Mineur |
| pages.ts:395 | הדמים ממשיכים לחול במהלך ההשעיה. | דמי המנוי ממשיכים לחול במהלך ההשעיה. (« הדמים » seul = « le sang ») | faute | Majeur |
| pages.ts:420 | …ובכל מקרה לא תעלה על 1,000 דולר ארה״ב. | Fond : un plafond aussi bas est présumé abusif (חוק החוזים האחידים, סעיף 4). Forme : correcte. | juridique | Majeur |
| pages.ts:437 | כל תביעה נגדנו תוגש בתוך שלושה (3) חודשים… אחרת היא תתיישן. | Prescription contractuelle de 3 mois, contre 7 ans en droit israélien : très exposée (חוק ההתיישנות + חוק החוזים האחידים). À faire valider par un avocat ; sinon prévoir au minimum 12 mois. | juridique | Majeur |
| pages.ts:441-450 | בוררות… AAA… בשאיין… ובשפה האנגלית / ויתור על תובענה ייצוגית / סמכות ייחודית בוויומינג | Pour des clients israéliens (même B2B), une clause de juridiction ou d'arbitrage étrangère et la renonciation à l'action collective dans un contrat d'adhésion risquent d'être annulées (jurisprudence Facebook c. Ben Hamo ; חוק תובענות ייצוגיות, התשס״ו-2006). Prévoir à défaut une juridiction israélienne (תל אביב) ou une validation par avocat. | juridique | Majeur |
| pages.ts:474 | הפרדה וויתור | בטלות חלקית וויתור (« הפרדה » est un calque de « severability ») | calque | Mineur |
| pages.ts:476 | שינויים מהותיים יפורסמו… לפחות 15 יום לפני… המשך השימוש מהווה הסכמה | Fond : modification unilatérale, figure parmi les clauses présumées abusives de l’article 4 du חוק החוזים האחידים (alinéa précis à confirmer par un avocat). Forme OK. | juridique | Mineur |
| pages.ts:507 / 519 / 593 | עוזרי ה-AI שלנו / העוזרים שלנו | עוזרות ה-AI שלנו (féminin comme le FR « nos assistantes » et comme נועה) | incohérence | Mineur |
| pages.ts:536 | הנחיותיהם, על בסיס החוקי שהם קובעים. | לפי הנחיותיהם ועל פי הבסיס החוקי שהם קובעים. (article manquant) | faute | Mineur |
| pages.ts:538-539 | אינטרסים לגיטימיים | Le droit israélien ne connaît pas la base « intérêt légitime » du RGPD ; il repose sur la הסכמה מדעת. Ajouter : ״(לגבי נושאי מידע באיחוד האירופי); בישראל – על בסיס הסכמה או כפי שהדין מתיר״. | juridique | Mineur |
| pages.ts:581 | הממונה הפדרלי על הגנת מידע ומידע (FDPIC) | הממונה הפדרלי על הגנת המידע ועל השקיפות (FDPIC) | faute | Mineur |
| pages.ts:616 | בצרפת, ניתן גם לתת הנחיות לגבי המידע שלכם לאחר מותכם. | Supprimer pour la version HE (résidu français, sans intérêt pour le lecteur) | adaptation | Mineur |
| pages.ts:628 | עם אפשרות להארכה בחודשיים נוספים | Délai RGPD. En Israël : réponse sous 30 jours (תקנות הגנת הפרטיות (תנאי עיון במידע…), 1981). Écrire : ״בתוך 30 יום, או בתוך המועד הקבוע בדין החל עליכם״. | juridique | Mineur |
| pages.ts:629 | …בפרט ה-ICO (בריטניה), ה-CNIL (צרפת)… | Garder la mention de la רשות להגנת הפרטיות en tête ; la liste UE peut être réduite à « או רשות הגנת המידע במדינה שבה אתם מתגוררים » | adaptation | Mineur |
| pages.ts:646 | עוגיות ו-״Do Not Track״ | עוגיות ו-Do Not Track | ponctuation | Mineur |
| pages.ts:684 | מופעל ומפורסם על ידי | מופעל ומנוהל על ידי (« מפורסם » = « célèbre » aussi) | faute (ambiguïté) | Mineur |
| pages.ts:692 | האחראי על הפרסום: | האחראי על תוכן האתר: (« directeur de la publication » est une notion française ; « הפרסום » se lit « la publicité ») | calque | Mineur |
| pages.ts:676 / 729 | פלטפורמת המענה הטלפוני AI של ${brand} / האתר של המענה הטלפוני AI של ${brand} | פלטפורמת המענה הטלפוני החכם של ${brand} / האתר של ${brand} | calque | Mineur |
| pages.ts:719 | …לאי-דיוקים הקשריים מזדמנים של מודלים לעיבוד דיבור אוטומטי במהלך שיחות חיות. | …לאי-דיוקים מזדמנים של מודלי זיהוי הדיבור וה-AI במהלך שיחות. | calque | Mineur |
| pages.ts:742 | הבלוג של מענה טלפוני AI – מדריכים וטיפים · ${brand} | בלוג מענה טלפוני לעסקים – מדריכים וטיפים · ${brand} | SEO / calque | Mineur |
| pages.ts:743 | …בעזרת מענה טלפוני AI. | …בעזרת מענה טלפוני חכם. | calque | Mineur |
| pages.ts:746 | יומן המענה הטלפוני AI | המגזין של המענה הטלפוני החכם (« יומן » = « agenda/calendrier » partout ailleurs sur le site, l.54 et l.116 : risque de confusion) | incohérence / calque | Majeur |
| pages.ts:747 | אסטרטגיות להמרת שיחות טלפון | אסטרטגיות להפיכת שיחות טלפון ללקוחות | calque | Mineur |
| pages.ts:748 | חיפוש מאמרים... | חיפוש מאמרים… (même caractère « … » que l.94/109) | ponctuation | Mineur |
| pages.ts:766 | `${t} קריאה` | `זמן קריאה: ${t}` (si t = « 5 min », on obtient un ordre bidi mêlé « 5 min קריאה ») | bidi | Mineur |
| pages.ts:769 | מוכנים לתת לעסק שלכם מענה טלפוני AI? | מוכנים שהעסק שלכם יענה לכל שיחה? | calque | Mineur |
| pages.ts:45, 480, 628, 666 | …${ADDRESS}, ארצות הברית. | Envelopper l'adresse latine dans `<bdi dir="ltr">` au rendu (sinon la virgule et le point final peuvent sauter du mauvais côté en RTL) | bidi | Mineur |

## Manques / ajouts recommandés

1. **הצהרת נגישות (Bloquant juridique).** Elle est exigée par les תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג-2013, תקנה 35, et la norme IS 5568 (WCAG 2.0 AA). Il faut une page dédiée, un lien dans le footer, les coordonnées d'un responsable accessibilité, la date de mise à jour et le niveau de conformité. Le risque est réel : des actions en indemnisation sans preuve de dommage sont fréquentes en Israël. Aucune page de ce type n'existe dans src/pages.
2. **Page contact.** Ajouter les heures et la langue de réponse humaine (« מענה אנושי: א׳–ה׳, 9:00–18:00, שעון ישראל ») et le comportement le vendredi, le שבת et les ערבי חג. Nuancer le « 24/7 » (l'IA répond, les humains rappellent pendant les heures d'activité).
3. **Facturation / TVA.** Préciser dans les CGU (sect. 4) et la FAQ tarifs si une חשבונית מס ou une simple invoice/קבלה est émise. Un fournisseur US n'émet pas de חשבונית מס israélienne, et le client עוסק מורשה devra peut-être émettre une חשבונית עצמית pour récupérer ou autoliquider la TVA. Indiquer si les prix en USD sont débités en ₪ par la carte (frais de conversion).
4. **30א (« חוק הספאם »).** Sur la page sécurité et dans les CGU, ajouter : la mention « פרסומת » obligatoire, l'identification de l'émetteur, un moyen de retrait gratuit, et l'exposition à des פיצויים לדוגמה pouvant aller jusqu'à 1 000 ₪ par message sans preuve de dommage. Préciser qu'un appel vocal par agent IA est probablement une « מערכת חיוג אוטומטי » au sens du 30א.
5. **Enregistrement des appels.** En Israël, un participant peut légalement enregistrer (חוק האזנת סתר). L'information reste toutefois obligatoire au titre de la transparence et du תיקון 13 (חובת יידוע). Une phrase en ce sens sur la page sécurité serait rassurante et exacte.
6. **תיקון 13.** Le citer aussi dans la politique de confidentialité, section « מי אנחנו » (il ne figure que dans les CGU l.336). Ajouter la חובת יידוע du סעיף 11 (finalités, destinataires, caractère obligatoire ou non de la fourniture des données, conséquences d'un refus). Indiquer qu'un ממונה הגנת פרטיות n'est pas désigné, ou le désigner si les conditions de l'amendement s'appliquent (à évaluer par un avocat).
7. **Version anglaise prévalente.** Il faut soit répercuter dans le texte EN les clauses Israël (30א, תיקון 13, תקנות העברת מידע 2001, droits des sections 13/14/17ו), soit faire prévaloir le texte hébreu pour ces clauses.
8. **Chaîne B2B / consommateurs.** La clause « אינו מוצע לצרכנים » est cohérente avec l'absence de ביטול עסקה (חוק הגנת הצרכן, סעיף 14ג). Il faudrait cependant une case d'attestation du statut professionnel à l'inscription (numéro עוסק/ח״פ). Sans elle, un עוסק פטור ou un particulier pourrait invoquer le droit de rétractation de 14 jours.
9. **SEO.** Mots-clés à intégrer dans les titles et H1 : « מענה טלפוני לעסקים », « מזכירה וירטואלית », « מענה טלפוני אוטומטי / חכם », « מענה קולי AI ». Les longueurs actuelles sont correctes (titles de 26 à 58 caractères, descriptions de 79 à 139). Les descriptions peuvent monter vers 150 caractères avec un CTA. Garder le numéro 02-376-7085 dans la meta de la démo et du contact (« התקשרו ל-02-376-7085 ושמעו את נועה »).
10. **Vocabulaire local manquant dans les pages démo et à propos** : « שיחה שלא נענתה », « מזכירה », « קביעת תורים », « ווטסאפ » (graphie usuelle, à préférer à WhatsApp dans le texte courant de marketing), « שעות פעילות », « שבת וחגים ». Une phrase dans about l.150-151 (« גם בשבת, בחגים ומחוץ לשעות הפעילות ») ancrerait le produit dans la réalité israélienne.
11. **Emplacement du widget.** Vérifier qu'en RTL la bulle du widget est bien « בפינה הימנית התחתונה » (l.18, l.120). Si le layout l'inverse, écrire « השמאלית ».

# Audit HE (Israël) : components.ts, commerce.ts, markets.ts (bloc he)

## Synthèse

- L'hébreu est globalement correct, fluide et adapté au marché : jours א׳–ה׳, ₪ dans les maquettes, 42 h/semaine, loi israélienne sur la vie privée, langues (עברית, ערבית, רוסית) et vouvoiement remplacé par « פנייה מנומסת ». Il y a peu de vraies fautes de grammaire.
- **Bloquant (factuel)** : la modale de rappel dit « nous ne publions aucun numéro », alors que le marché `he` affiche un numéro public (02-376-7085) dans le footer, sur l'accueil et sur la page contact.
- **Bloquant à valider (marché/fiscal)** : les prix sont en **USD**, avec « חשבונית אחת, בדולרים, לא כולל מע״מ ». Pour une société du Wyoming, « לא כולל מע״מ » laisse entendre qu'un מע״מ israélien sera ajouté et qu'une חשבונית מס sera émise. C'est à confirmer avec un comptable : sinon la mention est trompeuse. Afficher en $ freine aussi les PME israéliennes, qui raisonnent en ₪ (et paient des frais de conversion sur leur carte).
- **Incohérence terminologique majeure** : ces deux fichiers disent « חבילה/חבילת » (~45 occurrences). Le reste du site (offers, faq, guides, sectors, help, site : 114 occurrences) dit « מסלול ». Il faut choisir un seul terme ; je recommande **מסלול**, majoritaire et très courant dans le SaaS israélien.
- **Genre de l'agent** : « סוכן מענה » s'affiche juste à côté du prénom נועה (LiveCall, maquette d'appel). Il faut « סוכנת » ou un intitulé neutre.
- **Résidus français** : la frise des langues commence par le français et contient le français belge, suisse et canadien, mais pas le russe. L'équipe d'agents montre Jade, Daan, Katie… (noms latins non israéliens), et la note les transcrit en hébreu. Les numéros de semaine (« שבוע 42 ») ne s'utilisent pas en Israël.
- **Faits faux hérités du FR** : « שלושה־עשר מודולים » alors que 14 modules sont affichés ; « חנויות אונליין » est cité comme « hors liste » alors que c'est l'un des 14 secteurs.
- **Calques récurrents** : « עובד/ת קבלה » (à remplacer par מזכירה / פקיד/ת קבלה), « להפוך את השיחות לאוטומטיות », « הקרדיט משלם », « דוברים ילידיים », l'ordre « סוכן קולי AI ».

## Tableau des corrections

| fichier:ligne | texte actuel | correction proposée (hébreu) | type | sévérité |
|---|---|---|---|---|
| components.ts:75 | אנחנו לא מפרסמים מספר טלפון: אנחנו מתקשרים אליכם. | בחרו מועד נוח ונחזור אליכם. אפשר גם להתקשר אלינו 24/7 ל-02-376-7085. | fait (contredit `markets.he.phone`, affiché dans Footer, index, contact) | Bloquant |
| components.ts:229 | חשבונית אחת, בדולרים, לא כולל מע״מ | à valider : si aucun מע״מ israélien n'est facturé → « חשבונית אחת, בדולרים (ללא מע״מ ישראלי) » ; si oui → « חשבונית מס אחת, לא כולל מע״מ » (enregistrement en Israël requis) | fait / marché | Bloquant (à valider) |
| markets.ts:90 (SHARED.currency 'USD', appliqué à `he`) | prix 99 / 249 / 499 $, recharges 39–725 $, numéro 5,99 $ | grille en ₪ propre au marché `he`, avec prix psychologiques (ex. 349 / 899 / 1,790 ₪, à calibrer sur le taux de change et la marge) et `autocallsPlanIds` dédiés ; sinon mentionner partout « בדולרים » et « עמלת המרה לפי חברת האשראי » | marché | Majeur |
| components.ts:302 | המחירים בדולר ארה״ב, לא כולל מע״מ | (cohérent avec l'USD) ; si passage en ₪ : « המחירים בשקלים, לא כולל מע״מ » | marché | Majeur |
| components.ts:282 + blocks.tsx:587 (défaut 25) | עלות שעת עבודה של עובד (כולל עלויות מעסיק) — curseur en $ (25 $/h ≈ 90 ₪) | afficher en ₪ ; défaut réaliste pour une מזכירה (≈ 45–55 ₪/h avec עלויות מעסיק) ; libellé « עלות שעת עבודה של מזכירה (כולל עלויות מעסיק) » | marché | Majeur |
| components.ts:283, 293, 307, 309, 310, 322 + 276 | עובד/ת קבלה | מזכירה / פקיד/ת קבלה (ex. « השוואה הוגנת מול מזכירה במשרה מלאה », « עלות של מזכירה ») | calque | Majeur |
| components.ts:89 | סוכן מענה (affiché à côté de נועה) | סוכנת מענה (ou neutre : מענה טלפוני AI) | incohérence (genre) | Majeur |
| components.ts:532 | agent: 'סוכן מענה' (Mock : « נועה סוכן מענה ») | סוכנת מענה | incohérence (genre) | Majeur |
| commerce.ts:264 | סוכן AI ל${name} (titre LiveCall avec נועה) | סוכנת AI ל${name} (ou : מענה AI ל${name}) | incohérence (genre) | Mineur |
| components.ts:139, commerce.ts:95, 331, 349 | החל מחבילת עוזר AI | החל ממסלול עוזר AI | incohérence (offers / guides / faq : מסלול) | Majeur |
| components.ts:16, 50, 163, 188-198, 204, 216, 239, 240, 252, 258, 262-265, 288-291 ; commerce.ts:121, 138-139, 170, 186, 190, 194, 205, 208, 210, 213, 215, 274-285, 303, 312, 318-322 | חבילה / חבילת / חבילות | מסלול / מסלול / מסלולים (ex. « השוואת מסלולים », « עברו למסלול ${plan} », « מסלול בהתאמה אישית ») | incohérence | Majeur |
| commerce.ts:303 | שלושה־עשר מודולים | ארבעה־עשר מודולים (14 modules affichés par ModuleCards ; erreur héritée du FR « Treize ») | fait | Majeur |
| commerce.ts:250 | בתי ספר לנהיגה, חדרי כושר, חנויות אונליין, גיוס עובדים… | בתי ספר לנהיגה, חדרי כושר, גיוס עובדים, תיירות, גני ילדים… (חנויות אונליין fait déjà partie des 14 ; erreur héritée du FR) | incohérence | Majeur |
| components.ts:402 | ['צרפתית', 'אנגלית', … 'צרפתית בלגית', 'צרפתית שווייצרית', 'צרפתית קנדית', …, 'עברית'] | ordre israélien : עברית, אנגלית, ערבית, רוסית, צרפתית, ספרדית… ; retirer les variantes de français, ajouter רוסית et אמהרית (si disponible) — les drapeaux du composant sont à adapter aussi | marché (résidu FR) | Majeur |
| components.ts:417 + personas.ts TEAM_PERSONAS | ג׳ייד, דאן, קייטי והעמיתים שלהם… (les cartes affichent « Jade », « Daan », « Katie » en latin) | équipe propre au marché HE (noms israéliens : נועה, דניאל, מאיה, יונתן…) ; à défaut, garder les noms tels qu'affichés pour que la note corresponde aux cartes | marché / incohérence | Majeur |
| components.ts:40 | סוכנים קוליים AI שעונים… | סוכני AI קוליים שעונים, מסננים, קובעים תורים וחוזרים ללקוחות בשביל העסק שלכם, 24/7. | calque (ordre des mots) | Mineur |
| components.ts:161 | הסוכן הקולי AI שלכם | סוכן ה-AI הקולי שלכם | calque | Mineur |
| components.ts:131, 385 | …גם מסוכן קולי AI של ${brand} / …מסוכן ההדגמה הקולי AI | …גם מסוכן AI קולי של ${brand} / …מסוכן ה-AI הקולי של ההדגמה | calque | Mineur |
| components.ts:316 | יותר מ-80, עם קולות של דוברים ילידיים | יותר מ-80, בקולות של דוברי שפת אם | calque | Mineur |
| components.ts:236 | הקרדיט משלם על דקות מעבר לחבילה. הוא לא פג ונטען מיד. | הקרדיט מכסה דקות מעבר למסלול. תוקפו לא פג, והוא נטען מיד. | calque + faute (« פג » sans « תוקף ») | Mineur |
| commerce.ts:234 | הקרדיט משלם על דקות מעבר לחבילה, והוא לא פג. | הקרדיט מכסה דקות מעבר למסלול, ותוקפו לא פג. | calque + faute | Mineur |
| components.ts:351 | מוכנים להפוך את השיחות שלכם לאוטומטיות? | מוכנים שאף שיחה לא תתפספס? (ou : מוכנים לתת ל-AI לענות לשיחות שלכם?) | calque / CTA | Mineur |
| commerce.ts:113 | הפלטפורמה המלאה להפוך את השיחות לאוטומטיות | הפלטפורמה המלאה לאוטומציה של שיחות | faute (infinitif après un nom) / calque | Mineur |
| commerce.ts:302 | כל מה שצריך כדי להפוך את השיחות לאוטומטיות | כל מה שצריך לאוטומציה של השיחות שלכם | calque | Mineur |
| commerce.ts:114 | קול, בינה, טלפוניה… | קול, בינה מלאכותית, טלפוניה… | faute (« בינה » seul, incomplet) | Mineur |
| commerce.ts:85 | נציגי AI ש… | סוכני AI ש… (même terme que partout ailleurs) | incohérence | Mineur |
| components.ts:360 | …ואז נסו אותו בדפדפן או קבלו ממנו שיחה לטלפון. | …ואז נסו את הסוכן בדפדפן או קבלו ממנו שיחה לטלפון. | faute (pronom sans antécédent) | Mineur |
| components.ts:365 | מסנן פניות ומסמן את הפרויקטים שכדאי לחזור אליהם. | מסנן פניות ומסמן את הלידים שכדאי לחזור אליהם. | calque (« projets ») | Mineur |
| components.ts:392 | (ראשון עד חמישי, 9:00–19:00, שעון ישראל) | à vérifier avec le paramétrage Autocalls de l'agent sortant (le FR dit lun–sam) ; si vendredi matin : « א׳–ה׳ 9:00–19:00, ו׳ 9:00–13:00 » | fait | Majeur (à vérifier) |
| components.ts:393 | לנסות שוב | נסו שוב (impératif pluriel, comme les autres CTA) | incohérence | Mineur |
| components.ts:83 | כרטיס אשראי נדרש בהפעלה, שום חיוב בתקופת הניסיון | נדרש כרטיס אשראי, ללא חיוב בתקופת הניסיון | calque / incohérence avec offers.ts | Mineur |
| components.ts:83 | ביטול מתוך אזור הלקוח | ביטול בכל עת, מאזור הלקוח | CTA / marché | Mineur |
| commerce.ts:121 | …ושום חיוב בתקופת הניסיון. | …וללא חיוב בתקופת הניסיון. | registre | Mineur |
| commerce.ts:161, 284 | תקופת הניסיון חינם כוללת / התחילו בתקופת הניסיון חינם | תקופת הניסיון החינמית כוללת / התחילו בתקופת ניסיון חינם | faute (syntaxe) | Mineur |
| components.ts:263 | מעבר לחבילת ${plan}, נסכם איתכם מחיר לדקה… | מעל הנפח של מסלול ${plan}, נסכם איתכם מחיר לדקה… (« מעבר ל » se lit aussi « passer à ») | ambiguïté | Mineur |
| components.ts:264 | …או מחליפים חבילה, בדיוק בזמן | …או מחליפים מסלול, ברגע הנכון | calque | Mineur |
| components.ts:296 | הכנסות שהוחזרו (הערכה) | הכנסות שנשמרו (הערכה) | calque (« récupéré ») | Mineur |
| components.ts:283 | שיחות שלא נענות היום | אחוז השיחות שלא נענות היום | clarté (valeur en %) | Mineur |
| components.ts:318 | ai: 'אין' (חופשות והיעדרויות) | לא צריך מחליף | clarté | Mineur |
| components.ts:318 | חופשות והיעדרויות | חופשות, מחלות ומילואים | marché | Mineur |
| components.ts:313 | לפחות שכר המינימום, בתוספת עלויות מעסיק | לפחות שכר מינימום (כ-6,250 ₪ ברוטו לחודש – à mettre à jour selon le barème 2026), בתוספת עלויות מעסיק | marché (le FR chiffre le SMIC) | Mineur |
| components.ts:409 | …ומכין כרטיסים מוכנים לטיפול. | …ומכין כרטיסי לידים מוכנים לטיפול. (ou : ומעביר כרטיסים מוכנים לטיפול) | faute (redondance מכין/מוכנים) | Mineur |
| components.ts:411 | …ומחדש קשר עם אנשי הקשר שלכם. | …וחוזר ללקוחות ולאנשי הקשר שלכם. | répétition | Mineur |
| components.ts:578 | הפניה מחוץ לשעות הפעילות | הפנייה מחוץ לשעות הפעילות (כתיב מלא ; « הפניית » ailleurs) | faute (orthographe) | Mineur |
| components.ts:539, 598 | שבוע 42 / אישורי תורים – שבוע 42 / מעקב הצעות מחיר – ספטמבר | 12–16 באוקטובר / אישורי תורים – 12–16 באוקטובר (les numéros de semaine ne s'utilisent pas en Israël) | marché | Mineur |
| components.ts:137 | בערב, בסוף השבוע, באמצע פגישה | בערב, בשישי-שבת ובחגים, באמצע פגישה | marché | Mineur |
| components.ts:156, 466 | Messenger ואינסטגרם / אינסטגרם ו-Messenger | מסנג׳ר ואינסטגרם (même script pour les deux marques) | incohérence | Mineur |
| components.ts:139, 156, 412, 464, 500, 570, 592 vs offers.ts / modules.ts | וואטסאפ (ici) / WhatsApp (offers.ts:20, modules.ts:98) | unifier sur « וואטסאפ » dans le texte courant | incohérence | Mineur |
| components.ts:156, 231, 467, 498 vs modules.ts:188 | וידג׳ט (ici, correct) / ווידג׳ט (modules.ts) | unifier sur « וידג׳ט » (vav initial simple) | incohérence (hors périmètre) | Mineur |
| components.ts:159, 329 | יומן פעולות (sécurité) — « יומן » désigne aussi le calendrier (famille « יומן ») | תיעוד פעולות (Audit log) | ambiguïté | Mineur |
| components.ts:225 | הקראת טקסט | המרת טקסט לדיבור (TTS) | terme | Mineur |
| components.ts:225 vs 316/344 | ביותר מ-30 שפות (TTS) vs יותר מ-80 שפות | vérifier le chiffre et l'harmoniser, ou préciser « 30 שפות בהקראה, 80 בזיהוי » (hérité du FR) | incohérence | Mineur |
| components.ts:26, 58 | עזרה לאזור הלקוח | מרכז עזרה | calque | Mineur |
| components.ts:67-68 | פרטיות / עוגיות | מדיניות פרטיות / מדיניות קוקיז | naturel | Mineur |
| components.ts:175, 179 | שיחזרו אליי | חזרו אליי (ou : התקשרו אליי) | CTA | Mineur |
| components.ts:110 | נסו שוב או כתבו לנו ל-${email}. | נסו שוב או כתבו לנו לכתובת ${email}. (évite « ל- » collé à du latin) | bidi / ponctuation | Mineur |
| commerce.ts:154 | ${name} ${price}/${minutes} דק׳ | ${name}: ${price} ל-${minutes} דק׳ (le « / » entre ‏$ et des chiffres casse l'ordre bidi) | bidi | Mineur |
| commerce.ts:33 | …מטופלים בלי להעסיק את הדלפק | …מטופלים בלי להעמיס על הצוות בדלפק | calque | Mineur |
| commerce.ts:37 | …בזמן שאתם עובדים על הכיסא | …בזמן שאתם עם לקוח בכיסא | calque | Mineur |
| commerce.ts:45 | מקומות, אלרגיות ושאלות של לקוחות | מספר סועדים, אלרגיות ושאלות של לקוחות | calque (« couverts ») | Mineur |

## Manques / ajouts recommandés

1. **Fiscalité / facturation** : préciser explicitement le circuit. Qui émet la facture ? Est-ce une חשבונית מס israélienne ? Le מע״מ est-il collecté ? Selon la réponse, ajouter une ligne dans la FAQ tarifs : « אנחנו מנפיקים חשבונית מס / קבלה לכל חיוב ». Les PME israéliennes demandent une חשבונית מס pour déduire le מע״מ.
2. **Devise** : passer le marché `he` en ILS (`currency: 'ILS'`, à ajouter au type `Market.currency`) avec une grille dédiée. Retirer le `'$0'` codé en dur dans offers.ts (`OFFER_LABELS.free`) : il est formaté différemment de `money()` (« ‏99 ‏$ ») et doit suivre la devise du marché.
3. **Moyens de paiement** : mentionner « כרטיס אשראי ישראלי או בינלאומי ». Si possible, ajouter הוראת קבע ou Bit/PayBox, ou à défaut indiquer les frais de conversion en cas de facturation en $.
4. **Intégrations locales** : citer celles qui passent par le flow builder (à vérifier une par une avant publication) : monday.com, Fireberry (Powerlink), Priority, חשבשבת, iCount, מורנינג (Green Invoice), Wix, Cardcom/Tranzila, ainsi que les opérateurs et centraux (בזק, פרטנר, סלקום, HOT) pour la redirection et le SIP (`voicesNumbers.numbersText`, `integrations.meta.description`).
5. **Conformité** : citer « תיקון 13 לחוק הגנת הפרטיות » (en vigueur depuis août 2025) dans `security.items[4]`. Pour les campagnes sortantes, rappeler l'obligation de consentement préalable aux appels automatisés (חוק התקשורת, סעיף 30א, « חוק הספאם »).
6. **Comparatif humain** : remplacer « עובד/ת קבלה » par « מזכירה / מוקדנית » et ajouter le salaire minimum israélien 2026 chiffré (à vérifier). Le défaut du calculateur (25 $/h) est trop élevé pour une מזכירה israélienne.
7. **Jours et horaires** : utiliser « א׳–ה׳ », « שישי-שבת », « חגים » dans les arguments 24/7 (benefits, useCases) : c'est le vrai problème des PME israéliennes (vendredi après-midi, chabbat, fêtes de Tichri).
8. **Unifier les termes** dans tout le site HE :
   - מסלול (et non חבילה)
   - סוכן / סוכנת AI (et non נציג)
   - וואטסאפ
   - וידג׳ט
   - מזכירה וירטואלית ou מענה טלפוני AI (garder les deux, mais les mêmes partout)
   - Accorder au féminin chaque fois que le texte est collé au nom de נועה.
9. **Maqaf** : le texte mélange le maqaf hébreu (ארבעה־עשר) et le trait d'union ASCII (חד-פעמית, בו-זמנית, מ-300). C'est acceptable sur le web, mais mieux vaut choisir une convention. Je recommande le trait d'union ASCII partout, sauf pour les nombres écrits en toutes lettres.

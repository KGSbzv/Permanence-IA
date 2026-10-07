# Audit HE – Phase 2 : sectors / modules / offers / faq / integrations / site / index

## Synthèse

- Niveau général **bon** : un hébreu de marketing israélien fluide, sans faute d'orthographe systématique, des dialogues crédibles (« היא עדיין רלוונטית? », « אישור עקרוני מהבנק », « שימוע לפני פיטורים », « יורדים לי מים מהתקרה », « לק ג׳ל », « טסט », « ועד בית », « כשרות », « צימרים »). Les références légales israéliennes sont justes : חוק התקשורת סעיף 30א, חוק הגנת הפרטיות avec le תיקון 13, et 101/100/102.
- **Aucune référence française résiduelle bloquante** dans les 7 fichiers : pas de Doctolib, mutuelle, Sécu, €, RGPD ni CNIL. Seuls restes de la réalité française : « נוטריונים » dans la cible avocats, « הפסקת הצהריים » dans la FAQ et « מרכזים רפואיים ומרפאות שאינן מרפאות חירום » (calque de « centres de santé et cliniques non urgentes »).
- **3 vraies erreurs de sens (Majeur)** :
  - « החזרת לקוחות ותיקים » : ותיקים veut dire « fidèles / de longue date », pas « anciens ».
  - « צבעים » comme cible de coiffure : lu comme « couleurs / peintres ».
  - « לא רושם שום דבר » chez le vétérinaire : ambigu entre « ne note rien » et « ne prescrit rien », alors que l'agent note bel et bien.
- **Choix discutable dans un nom de secteur** : « ברברים » (aussi « barbares »), repris dans le title SEO.
- **Incohérence terminologique Majeure entre contenu et UI** : les fichiers de contenu disent toujours « מסלול » (55 occurrences dans faq, sectors, offers, site) alors que l'UI (ui/commerce, components, pages) dit toujours « חבילה / חבילת » (57 occurrences). Exemple : « אנחנו ממליצים על חבילת עוזר AI » à côté de « החל ממסלול עוזר AI » sur la même page secteur. Autres doublons mineurs : דשבורד / לוח הבקרה, רשימת חסימה / רשימת החרגה, ווידג׳ט / וידג׳ט / וואטסאפ / WhatsApp, דוא״ל / אימייל / מייל, סינון / סיווג לידים.
- **Typographie** :
  - trait d'union ASCII « - » au lieu du maqaf « ־ » (אי-הגעה, יום-יומיים, רב-תחומיות), alors qu'ailleurs le site utilise « ־ » (שלושה־עשר) ;
  - gershayim « ״ » utilisés comme guillemets (״איפה ההזמנה שלי?״) ;
  - guillemets anglais “ ” dans faq.ts:48.
- **FAQ : gros manques pour un patron de PME israélien**, à traiter avant publication :
  - TVA israélienne : 18 % ajoutés ou non ? חשבונית מס ? reverse charge ?
  - prix en $ et frais de conversion de carte ;
  - accent et compréhension de l'hébreu parlé, de l'argot, des mots anglais mêlés ;
  - arabe, russe, anglais, français ;
  - légalité de l'enregistrement des appels (annonce, consentement) ;
  - lieu des serveurs et transfert de données hors d'Israël ;
  - support en hébreu ;
  - Shabbat, חגים et ערב חג ;
  - pas de « תשלומים ».
  Les questions secteur « איפה נשמרים נתוני השיחות? » ne disent jamais **où**.
- **Réalités israéliennes sous-exploitées** :
  - immobilier : Yad2, מדלן, טופס הזמנת שירותי תיווך ;
  - garages : מספר רישוי ;
  - restaurants : Ontopo, Tabit, Wolt, 10bis/Cibus ;
  - e-commerce : Wix, Konimbo ;
  - dentaire : כללית סמייל, ביטוח שיניים ;
  - assurance : רשות שוק ההון ;
  - partout : שבת/חג, מילואים.

## Tableau des corrections

| fichier:ligne | texte actuel | correction proposée (hébreu) | type | sévérité |
|---|---|---|---|---|
| modules.ts:203 | `name: 'החזרת לקוחות ותיקים'` | `'החזרת לקוחות עבר'` (ou `'הפעלה מחדש של לקוחות רדומים'`) | Sens (ותיקים = fidèles / de longue date) | Majeur |
| sectors.ts:254 | `'... ברברשופים, צבעים, ספרים עד הבית'` | `'... ברברשופים, קולוריסטים, ספרים שמגיעים עד הבית'` | Sens (צבעים = couleurs / peintres) | Majeur |
| sectors.ts:164 | `'הוא לא מאבחן ולא רושם שום דבר.'` | `'הוא לא מאבחן ולא רושם תרופות.'` | Ambiguïté (רושם = noter / prescrire) | Majeur |
| sectors.ts:252 (+ ui/commerce.ts:35 clé SECTOR_SEO) | `name: 'מספרות וברברים'` | `'מספרות וברברשופים'` (mettre à jour **aussi** la clé de SECTOR_SEO, qui est indexée sur le nom) | Lexique / ambiguïté (ברברים = barbares) + SEO | Majeur |
| sectors.ts:253 | `'מענה טלפוני AI למספרות ולברברים'` | `'מענה טלפוני AI למספרות ולברברשופים'` | Idem | Mineur |
| Global contenu vs ui/*.ts | `מסלול עוזר AI` (contenu) / `חבילת עוזר AI` (UI, ex. commerce.ts « אנחנו ממליצים על חבילת ${offerName} ») | Unifier sur **מסלול** (usage dominant en SaaS et télécoms israéliens) dans ui/commerce.ts, components.ts et pages.ts | Cohérence | Majeur |
| faq.ts:37 | `'נכון, כל המחירים מוצגים לא כולל מע״מ. מיסים מקומיים מתווספים כשהם חלים.'` | Préciser la réalité, par ex. `'כן. המחירים בדולרים ולא כוללים מע״מ. [לעסק ישראלי: האם יתווסף מע״מ 18% / האם תונפק חשבונית מס / חיוב עצמי במע״מ – לאמת עם הכספים]'` | Réalité IL / FAQ | Majeur |
| site.ts:6 | `'... לא כולל מע״מ – מיסים מקומיים יתווספו לפי הצורך.'` | Même précision que faq.ts:37 (18 % ou non, חשבונית) | Réalité IL | Majeur |
| sectors.ts:85, 126, 567 | `q: 'איפה נשמרים נתוני השיחות?'` + réponse sur la seule durée de conservation | Ajouter le lieu : `'הנתונים מאוחסנים בשרתים מאובטחים ב-[מדינה/אזור], ...'` ; sinon renommer la question `'כמה זמן נשמרים נתוני השיחות?'` | Exactitude Q/R | Majeur |
| sectors.ts:52 | `'... מרכזים רפואיים ומרפאות שאינן מרפאות חירום'` | `'... מרפאות שיניים ברשתות ובקופות החולים'` (ou supprimer le segment) | Calque FR (centres de santé non urgents) | Mineur |
| sectors.ts:374 | `'... יועצי מס, נוטריונים, יועצים'` | `'... יועצי מס, משרדי עורכי דין לנדל״ן ולצוואות, יועצים'` | Reliquat FR (notaire = métier marginal en IL) | Mineur |
| faq.ts:28 | `'... בשעות העומס, בהפסקת הצהריים, בערב ובסופי השבוע.'` | `'... בשעות העומס, כשהקו תפוס, בערב, בשבתות ובחגים.'` | Reliquat FR (pause déjeuner) + réalité IL | Mineur |
| sectors.ts:13, 42 ; faq ; benefits | `בסופי שבוע` seul, sans mention de שבת ou de חג (sauf L13 « ובחגים ») | Ajouter `שבת וחג` / `ערב חג` dans au moins un benefit ou une FAQ par secteur, par ex. `'מענה גם בשבת, בחגים ובערב חג – כשהעסק סגור'` | Réalité IL | Mineur |
| sectors.ts:135 | `title: 'כל בעל חיה מודאג מקבל מענה, גם כשהצוות בניתוח'` | `'כל בעלים מודאג של חיית מחמד מקבל מענה, גם כשהצוות בניתוח'` | Naturel (בעל חיה ≈ בעל חיים) | Mineur |
| sectors.ts:139 | `'בעל חיה מודאג שמגיע לתא הקולי...'` | `'בעלים מודאג שמגיע לתא הקולי...'` | Idem | Mineur |
| sectors.ts:134 | `'... סוסים ובעלי חיים בחווה'` | `'... סוסים וחיות משק'` | Calque (animaux de ferme) | Mineur |
| sectors.ts:142 | `'... לחידוש מרשמים ולמזון להעברה לצוות'` | `'... לחידוש מרשמים ולמזון רפואי, להעברה לצוות'` | Clarté | Mineur |
| sectors.ts:17 | `'בקשות להצעת מחיר מגיעות חסרות ומחייבות שיחה נוספת.'` | `'בקשות להצעת מחיר מגיעות חסרות פרטים ומחייבות שיחה נוספת.'` | Grammaire / sens incomplet | Mineur |
| sectors.ts:98 | `'הודעות קוליות מצטברות ומוחזרות בערב...'` | `'הודעות קוליות מצטברות, ואתם חוזרים אליהן בערב...'` | Calque (on rappelle des gens, pas des messages) | Mineur |
| sectors.ts:95, 376, 453, 533 | `בלי לתת אף פעם ייעוץ ...` / `בלי שה-AI ייתן אף פעם ייעוץ` | `ולעולם לא נותן ייעוץ ...` / `וה-AI לעולם לא נותן ייעוץ` | Calque (« sans jamais ») | Mineur |
| sectors.ts:175 | `title: 'סווגו קונים, מוכרים ושוכרים גם כשהמתווכים שלכם בסיור בנכס'` | `'כל קונה, מוכר ושוכר מקבל מענה – גם כשהמתווכים שלכם בסיור בנכס'` | Naturel (impératif « סווגו » peu idiomatique en titre) | Mineur |
| sectors.ts:182 | `'מספר הנכס'` | `'הנכס או המודעה שעליה מתקשרים'` | Réalité IL (pas de « référence de bien » côté client) | Mineur |
| sectors.ts:216 | `title: 'מלאו את המוסך בלי להפריע לצוות הקבלה'` | `'יותר רכבים במוסך, בלי להפריע לצוות הקבלה'` | Calque (« remplissez l'atelier ») | Mineur |
| sectors.ts:223 | `'יצרן, דגם, קילומטראז׳'` | `'מספר רישוי, יצרן, דגם, קילומטראז׳'` | Réalité IL (identification par la plaque) | Mineur |
| sectors.ts:239 | `'רשמתי. מה הדגם ומה שנת הייצור של הרכב?'` | `'רשמתי. מה מספר הרכב, ומה הדגם?'` | Réalité IL | Mineur |
| sectors.ts:246 | `'לכל השאר הוא מציע הצעת מחיר.'` | `'לכל השאר הוא רושם בקשה להצעת מחיר.'` | Sens (l'agent ne chiffre pas) | Mineur |
| sectors.ts:302, 310 | `'נקודות זהירות להעברה: היריון, אלרגיות'` / `'נקודות זהירות'` | `'רגישויות ומצבים מיוחדים להעברה לצוות: היריון, אלרגיות'` / `'רגישויות'` | Calque (« points de vigilance ») | Mineur |
| sectors.ts:414 | `'... קמעונאים שמוכרים מרחוק'` | `'... חנויות Wix וקונימבו, עסקים שמוכרים גם אונליין'` | Calque (VAD) + réalité IL | Mineur |
| sectors.ts:419 | `'בבלאק פריידי ולפני החגים הקו עמוס, והעגלות עוברות למתחרים.'` | `'בבלאק פריידי, ב-11.11 ולפני החגים הקו עמוס, ועגלות קניות ננטשות.'` | Calque (« les paniers partent ») | Mineur |
| sectors.ts:418, 423 | `״איפה ההזמנה שלי?״` (U+05F4 gershayim) | `"איפה ההזמנה שלי?"` (guillemets droits ou „…“) | Typographie | Mineur |
| sectors.ts:458 | `'לקוח שחוזרים אליו רק למחרת כבר חתם, פעמים רבות, במקום אחר.'` | `'לקוח שחוזרים אליו רק למחרת כבר חתם, לא פעם, במקום אחר.'` (ou `'לעיתים קרובות כבר חתם במקום אחר'`) | Naturel / ponctuation | Mineur |
| sectors.ts:382 | `'תחום: משפחה, דיני עבודה, נדל״ן, מיסים, הקמת עסק'` | `'תחום: דיני משפחה, דיני עבודה, נדל״ן, צוואות וירושות, תאונות ונזיקין, מיסים, הקמת עסק'` | Parallélisme + réalité IL | Mineur |
| sectors.ts:86, 263, 287, 539, 543, 566 ; modules.ts:42 ; sectors.ts:93 « רב-תחומיות » ; faq.ts:8 « יום-יומיים » | `אי-הגעה`, `רב-תחומיות`, `יום-יומיים` (trait d'union ASCII) | `אי־הגעה`, `רב־תחומיות`, `יום־יומיים` (maqaf U+05BE), comme `שלושה־עשר` dans l'UI | Typographie (maqaf) | Mineur |
| modules.ts:25 | `'נסו את המענה הטלפוני AI בשידור חי לפני שמחליטים'` | `'נסו את המענה הטלפוני AI בהדגמה חיה לפני שמחליטים'` | Calque (בשידור חי = diffusion en direct) | Mineur |
| modules.ts:45 | `'משכי פגישה, זמן התראה מראש, ...'` | `'משכי פגישה, כמה זמן מראש אפשר לקבוע או לבטל, ...'` | Calque (« délai de prévenance ») | Mineur |
| modules.ts:55 | `'מוקד תמיכה טלפוני AI שעונה מיד, בלי תור'` | `'... שעונה מיד, בלי זמני המתנה'` | Ambiguïté (תור = rendez-vous partout ailleurs sur le site) | Mineur |
| modules.ts:104 | `'שולח WhatsApp, SMS, Messenger, Instagram.'` | `'מספר WhatsApp עסקי, SMS, Messenger, Instagram.'` | Calque (« sender ») | Mineur |
| modules.ts:174 ; offers.ts:122 | `'נפחים, משכי שיחה...'` | `'כמות שיחות, משכי שיחה...'` | Calque (« volumes ») | Mineur |
| modules.ts:199 | `integrations: ['כל אתר', 'WordPress', 'Webflow']` | `['כל אתר', 'Wix', 'WordPress', 'Webflow']` (si le widget s'intègre bien sur Wix) | Réalité IL (Wix domine chez les PME) | Mineur |
| modules.ts:16, 70, 181, 196 vs sectors.ts:28, 44, 102, 432, 512, 526 | `דשבורד` / `לוח הבקרה` | Unifier (recommandé : `לוח הבקרה` dans le texte, `דשבורד` accepté seulement dans les titres) | Cohérence | Mineur |
| offers.ts:116 ; modules.ts:94 vs modules.ts:86, 211, 215 ; faq.ts:21 | `רשימת חסימה` / `רשימת החרגה` | Unifier sur `רשימת חסימה` | Cohérence | Mineur |
| modules.ts:19, 34, 188-191 ; offers.ts:23, 97 vs ui/pages.ts:114 (`וידג׳ט`) | `ווידג׳ט` | `וידג׳ט` (pas de vav doublé en début de mot, règle de l'Académie) partout ; donc `ווידג׳ט` uniquement après le « ו » de coordination (offers.ts:23 « יומן מחובר ווידג׳ט » devient alors correct) | Orthographe / cohérence | Mineur |
| sectors.ts (6 occ.), offers.ts:89, faq.ts:47 | `דוא״ל` / `אימייל` / `במייל` | Unifier (`אימייל`, le plus courant dans le marketing 2026) | Cohérence | Mineur |
| sectors.ts:173, 175, 183, 190 vs modules.ts:68-75 | `מסווגים / סווגו / הסוכן מסווג` vs module `סינון לידים` | Aligner sur `סינון` pour la qualification de leads (`מסוננים`) ; garder `סיווג` pour le tri des pannes | Cohérence | Mineur |
| offers.ts:29 | `'מסלול עוזר AI מוסיף שלושה סוכנים...'` | `'מסלול עוזר AI כולל שלושה סוכנים...'` (on passe de 1 à 3 agents, on n'en ajoute pas 3 ; le FR a la même imprécision) | Exactitude | Mineur |
| offers.ts:107 | `'... בלי קרדיטים כלולים, טוענים לפי השימוש.'` | `'... בלי קרדיטים כלולים, טוענים קרדיט לפי השימוש.'` | Grammaire (complément manquant) | Mineur |
| offers.ts:113 ; faq.ts:18 | `'מספרים ייעודיים שנרכשים מאזור הלקוח'` | `'מספרים ייעודיים שנרכשים ישירות באזור הלקוח'` | Ambiguïté (אזור הלקוח peut se lire « région du client ») | Mineur |
| faq.ts:23 | `'עוזר עזרה מובנה עונה בעברית'` | `'עוזר מובנה עונה בעברית'` | Redondance | Mineur |
| faq.ts:35 ; site.ts:9 | `'והקרדיט לא פג'` / `'והוא לא פג'` | `'והקרדיט לא פג תוקף'` / `'ותוקפו לא פג'` | Naturel | Mineur |
| faq.ts:48 | `תחת “Tools & actions” של הסוכן` | `תחת "Tools & actions" של הסוכן` (mêmes guillemets que le reste du site) | Typographie | Mineur |
| integrations.ts:11 | `'קביעת פגישות באירועים שלכם.'` | `'קביעת פגישות לפי סוגי האירועים שלכם.'` | Calque (event types) | Mineur |
| integrations.ts:18 | `'שיחות פייסבוק.'` | `'הודעות פייסבוק.'` | Ambiguïté (שיחות = appels ailleurs sur le site) | Mineur |
| ui/commerce.ts:17 (SEO dentaire) | `'... קביעת תורים, אישורים ודחיות ...'` | `'... קביעת תורים, אישורים ושינויי מועד ...'` | Ambiguïté (דחיות = refus) | Mineur |
| ui/commerce.ts:40 (`title` de la clé `'קוסמטיקה וטיפוח'`) | `'קביעת תורים למכוני יופי וספא'` (le H1 et sectors.ts parlent de `מכוני קוסמטיקה`) | Garder `מכוני יופי` (requête la plus cherchée) mais ajouter `קוסמטיקאיות` dans la description | SEO | Mineur |
| ui/commerce.ts:48 (`title` de la clé `'עורכי דין ורואי חשבון'`) | `'מענה טלפוני AI לעורכי דין ורו״ח'` | `'מזכירה וירטואלית לעורכי דין ורואי חשבון'` (« רו״ח » ne correspond pas aux requêtes « רואי חשבון ») | SEO | Mineur |
| ui/commerce.ts:56 (`title` de la clé `'סוכני ביטוח ויועצי משכנתאות'`) | `'מענה טלפוני AI לסוכני ביטוח ומשכנתאות'` (dépasse les 45 caractères ; « סוכני משכנתאות » n'existe pas) | `'מזכירה וירטואלית לסוכני ביטוח'` (ou `'מענה טלפוני לסוכני ביטוח ויועצי משכנתאות'`) | SEO + terminologie | Mineur |
| ui/commerce.ts:299 (`featuresIndex.description`) vs modules et integrations | `וואטסאפ` | Un seul choix : `WhatsApp` dans le texte (graphie de la marque), `וואטסאפ` éventuellement dans les metas pour la requête hébraïque | Cohérence / SEO | Mineur |
| ui/commerce.ts:303 (`featuresIndex.hero.intro`) | `'שלושה־עשר מודולים ...'` | À vérifier : MODULES contient **14** entrées (le FR dit aussi « Treize ») | Exactitude | Mineur |
| ui/pages.ts:63 vs offers.ts:12 et 56 | `${days} ימים` / `14 יום` | Unifier (`14 יום` est correct et le plus courant) | Cohérence | Mineur |

Note sur les dialogues : l'agent vouvoie au pluriel (« הפנייה שלכם », « כבר ביקרתם ») un interlocuteur seul. C'est une stratégie de neutralité de genre acceptable, et elle est cohérente sur tout le site : je ne la classe pas en faute. Le genre de l'agent est cohérent : « הסוכן » masculin, formes neutres en 1re personne (« אקצה », « אשמח »), et seule l'assistante de rappel commercial est au féminin (« העוזרת הקולית », faq.ts:24), comme en FR.

## Manques / ajouts recommandés

### FAQ générale (faq.ts) : questions qu'un patron de PME israélien posera
1. **« הסוכן מדבר עברית טבעית? יש לו מבטא?»** : qualité de la voix hébraïque, intonation, prononciation des noms et des adresses (רחוב ז׳בוטינסקי…).
2. **« הוא מבין סלנג, עברית מדוברת ומילים באנגלית באמצע משפט?»** : très fréquent en Israël (« לקבוע אפוינטמנט », « לעשות פולואפ »).
3. **« הוא עונה גם בערבית, ברוסית, באנגלית ובצרפתית?»** : marché israélien multilingue (arabe, olim russophones et francophones, touristes). L'actuelle sectors.ts:366 ne parle que d'anglais.
4. **« מותר להקליט את השיחות?»** : en Israël, l'enregistrement par un participant est légal (חוק האזנת סתר). Recommander quand même l'annonce « השיחה מוקלטת » et la mention de l'IA ; à valider juridiquement.
5. **« איפה נמצאים השרתים? המידע יוצא מישראל?»** : תקנות הגנת הפרטיות (העברת מידע אל מאגרי מידע שמחוץ לגבולות המדינה), תקנות אבטחת מידע 2017. Critique pour le médical (חוק זכויות החולה) et pour les avocats (חיסיון עו״ד-לקוח).
6. **« מקבלים חשבונית מס? מתווסף מע״מ 18%?»** : à trancher avec la finance (fournisseur étranger, auto-liquidation, Stripe Tax). Aujourd'hui « מיסים מקומיים מתווספים כשהם חלים » est trop vague.
7. **« למה המחירים בדולרים? יש עמלת המרה?»** : prévenir des frais de carte étrangère ; éventuellement afficher l'équivalent approximatif en ₪.
8. **« אפשר לשלם בתשלומים / בהעברה בנקאית / ב-Bit?»** : répondre clairement (non).
9. **« יש תמיכה בעברית? באיזה שעות?»** : faq.ts:23 parle de l'assistant d'aide, pas d'un support humain en hébreu.
10. **« מה קורה בשבת ובחגים?»** : horaires spécifiques, message « סגור בשבת », ערב חג, fermeture partielle (חול המועד).
11. **« מה עם מילואים?»** (angle marketing fort en 2024-2026) : quand le patron ou un employé est appelé, l'agent prend le relais.
12. **Do-not-call** : vérifier s'il existe un registre israélien « אל תתקשרו אליי » applicable aux campagnes sortantes et le mentionner à côté de 30א (à valider par le juridique avant de l'affirmer).

### Secteurs (sectors.ts)
- **Dentaire** : ajouter dans les handles « קופת חולים / ביטוח שיניים (כללית סמייל, מכבי דנט, ביטוח משלים) – האם המרפאה עובדת עם הביטוח שלי? ». C'est la question n° 1 des patients israéliens.
- **Physiothérapie** : préciser « הפניה מרופא / התחייבות מהקופה » (déjà partiellement fait) ; ajouter « הידרותרפיה » et « פיזיותרפיה לרצפת האגן » dans les cibles.
- **Immobilier** : citer Yad2, מדלן et Homeless (« לידים מיד2 וממדלן ») ; ajouter dans les handles « שליחת טופס הזמנת שירותי תיווך לחתימה לפני הסיור », document légalement requis pour toucher la commission ; « מחיר למ״ר », « תמ״א 38 / פינוי בינוי » pour le crédible.
- **Garages** : « מספר רישוי » (le garage récupère les données du véhicule par la plaque), « טסט שנתי », « טיפול 15,000 / 30,000 », « רכב חלופי », « ביטוח / שמאי » (sinistres de carrosserie).
- **Restaurants** : FAQ sur Ontopo / Tabit (« עובד עם Ontopo או Tabit? »), avec une réponse honnête (collecte et transfert par webhook si pas d'intégration native) ; mention des commandes et livraisons (« איפה המשלוח שלי? » relève de Wolt / 10bis) ; « אירועים, בר מצווה, ברית » pour les groupes ; « הכשרות: בהשגחת... » ; restaurants ouverts ou fermés le שבת.
- **Avocats / experts-comptables** : « תאונות דרכים, צוואות וירושות, הוצאה לפועל » ; pour les רו״ח : « דוח שנתי, מקדמות, תיאום מס, החזר מס ».
- **E-commerce** : Wix, Konimbo (קונימבו), « משלוח עם Cheetah / HFD / דואר ישראל », « נקודת איסוף », « חוק הגנת הצרכן – ביטול עסקה תוך 14 יום » (sectors.ts:422 parle d'une « politique de retour » générique).
- **Assurance / משכנתאות** : rappeler que les appels de vente d'assurance sont encadrés par רשות שוק ההון (חוזר שיווק / תיעוד שיחות). Ajouter « יועצי פנסיה וסוכני פנסיוני » dans les cibles ; « ביטוח מבנה » à côté de « ביטוח חיים למשכנתא ».
- **Gestion locative** : « חברת הגז / ספק הגז » pour les fuites de gaz ; « ארנונה » dans les questions des locataires.
- **Esthétique** : mentionner « משרד הבריאות / רופא מורשה » dans la FAQ « ייעוץ רפואי » si pertinent.

### SEO (ui/commerce.ts, SECTOR_SEO)
- Requêtes hébraïques les plus cherchées pour ce service : **« מזכירה וירטואלית »** (volume le plus fort), **« מענה טלפוני »** / **« שירות מענה טלפוני »** / **« מוקד מענה טלפוני »**, « מרכזייה וירטואלית », « בוט קולי », « נציג AI ». « מענה טלפוני AI » seul reste niche. Recommandation : alterner « מזכירה וירטואלית ל… » et « מענה טלפוני ל… » selon le secteur ; c'est déjà fait pour le dentaire, la physio et l'esthétique, à étendre aux avocats et aux assureurs.
- Formes recommandées par secteur :
  - « מענה טלפוני למתווכים » / « מזכירה וירטואלית למשרד תיווך » ;
  - « מענה טלפוני למוסך » ;
  - « מערכת הזמנות טלפונית למסעדות » ;
  - « מזכירה וירטואלית לעורכי דין » ;
  - « מענה טלפוני לחברות ניהול נכסים » (OK) ;
  - « מענה טלפוני לבעלי מקצוע / לטכנאים » (OK).
- **Attention technique** : SECTOR_SEO et le libellé de la page sont indexés sur le **nom hébreu** du secteur (`SECTOR_SEO[name]`). Tout renommage dans sectors.ts (ex. « מספרות וברברשופים ») doit être répercuté dans ui/commerce.ts, sinon le title retombe sur le fallback générique.
- Le secteur « שירותי בית ובעלי מקצוע » n'a pas d'entrée SECTOR_PLACE : le titre devient « מה זה משנה לעסק שלכם ». C'est acceptable, mais « לעסק » / « לצוות » serait plus parlant.

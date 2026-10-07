# Audit HE, phase 2 : chaînes codées en dur, pages légales en ligne, KB vocale (Noa)

## Synthèse

- **Code hors `src/i18n/content/he/` : très peu d'hébreu codé en dur** (`markets.ts` l.130-135, `personas.ts` l.34, `LanguageSwitcher.tsx` l.15, `LiveDemo.tsx` l.12). Ces chaînes sont correctes : le droit applicable, le tribunal, l'autorité et les lois s'insèrent sans faute d'accord ni de préposition dans les phrases (`יחולו דיני…`, `בסמכותם הייחודית של בתי המשפט…`, `בפני הרשות להגנת הפרטיות`, `מכוח חוק זכות יוצרים…`). Le bidi est bien géré (`<bdi dir="ltr">` sur le téléphone, emails en lien).
- **Les vraies fuites de langue sont ailleurs, côté serveur et composants :**
  - L'**email OTP** (code d'accès au dossier) part en français et en anglais, signé « Lucie » et « Permanence IA ». Noa promet pourtant ce code à l'appelant israélien (KB he.txt §5).
  - Les **notes de rappel** (`Démo live — rôle : … — langue : …`, `Créneau souhaité : Demain matin`) sont écrites en français. Elles sont réinjectées dans `request_note`, que Noa lit dans sa phrase d'ouverture.
  - **Typographie française** dans les composants (`20 %`, `פנייה נוצרה : …`).
  - **Équipe d'agents** affichée en latin (Jade, Daan, Katie…), avec des libellés au masculin pour des personas féminines.
- **Pages légales en ligne : l'hébreu est globalement de bon niveau juridique.** On y trouve toutefois 3 contresens dus à des calques du français :
  - `הדמים ממשיכים לחול` (« les sangs continuent… »)
  - `נצברת במלואה` (« acquise »)
  - `בחירות אוטומטיות` (« élections automatiques »)
  
  S'y ajoutent quelques fautes de grammaire et l'accord de genre de la marque (« PermanenceAI ») qui varie.
- **Juridiquement, le plus gros risque est l'absence de הצהרת נגישות** et de page d'accessibilité : `/he/accessibilite` renvoie 404, et le mot « נגישות » n'apparaît nulle part sur le site HE. Viennent ensuite les clauses des CGU vulnérables au חוק החוזים האחידים (applicable aussi en B2B), une politique de confidentialité calquée sur les bases légales du RGPD (« אינטרסים לגיטימיים ») et un consentement au rappel qui promet « אך ורק לטיפול בפנייה » en contradiction avec la politique.
- **Blog et KB (point C)** :
  - `/he/blog` et `/he/blog/*` font une redirection temporaire (302/307) vers `/he/faq`, qui est entièrement en hébreu. Pas de fuite.
  - `/he/kb/he` et `/he/kb/he-situations` sont en hébreu.
  - En revanche, `/he/kb/fr`, `/he/kb/en`, etc. existent (200), avec du **texte français ou anglais servi en `lang="he" dir="rtl"`**. Ces pages sont en noindex, donc le risque est faible.
- **KB vocale de Noa (point D)** : registre globalement naturel. L'ouverture (`שלום, כאן נועה, עוזרת ה-AI של PermanenceAI. השיחה מוקלטת.`) est bonne et l'accord au féminin est cohérent. Quatre problèmes systémiques :
  1. Le vouvoiement au pluriel (« אתם ») est systématique, même face à une seule personne.
  2. Il reste des références à la France (numéro français, loi du 11 août 2026, Bloctel).
  3. Le numéro est relu au format +972 au lieu du format local `0X-…`.
  4. Il manque les formules de clôture et d'attente (`רגע, אני בודקת`, `תודה שהתקשרתם`).

## Tableau des corrections

| fichier:ligne ou URL | texte actuel | correction proposée (hébreu) | type | sévérité |
|---|---|---|---|---|
| /he/cgu §13 (source he/ui/pages.ts, CGU §13) | הדמים ממשיכים לחול במהלך ההשעיה. | דמי המינוי ממשיכים לחול במהלך ההשעיה. | contresens (calque « les frais ») | Majeur |
| /he/cgu §3 | כל תקופה ששולמה נצברת במלואה ואינה ניתנת להחזר | כל תקופה ששולמה נחשבת כמשולמת סופית ואינה ניתנת להחזר | contresens (calque « acquise » ; נצברת = s'accumule) | Majeur |
| /he/cgu §5 | שיחות או הודעות פוליטיות או בחירות אוטומטיות | שיחות או הודעות אוטומטיות בנושאים פוליטיים או בקשר לבחירות | contresens (« élections automatiques ») | Majeur |
| /he/cgu §5 | כל פעילות בלתי חוקית, הונאה, מטעה או פוגענית | כל פעילות בלתי חוקית, הונאית, מטעה או פוגענית | grammaire (nom au milieu d'adjectifs) | Mineur |
| /he/cgu §4 | בתוספת כל פיצוי קבוע על הוצאות גבייה הקבוע בדין | (supprimer : notion française d'indemnité forfaitaire de 40 €, inexistante en Israël) ou « בתוספת הוצאות גבייה כפי שייפסקו » | calque juridique FR + répétition קבוע/הקבוע | Mineur |
| /he/cgu §6 | מספר עשוי להשתחרר, ולאבד לצמיתות | מספר עשוי להשתחרר ולאבוד לצמיתות | grammaire (לאבד est transitif) | Mineur |
| /he/cgu §3 | והתקופה הראשונה (חודשית או שנתית) מחויבת | והלקוח יחויב בגין התקופה הראשונה (חודשית או שנתית) | ambiguïté (מחויבת = « obligée ») | Mineur |
| /he/cgu §3 | זכות ביטול סטטוטורית (תקופת צינון) | זכות ביטול עסקה לפי דין | terminologie (« תקופת צינון » n'est pas le terme du חוק הגנת הצרכן) | Mineur |
| /he/cgu §6 « רשימות התנגדות » | בצרפת, הסכמה מפורשת מוקדמת … (סעיף L223-1 לקוד הצרכנות הצרפתי) | « … (סעיף L223-1 ל-Code de la consommation הצרפתי) » ; ajouter une entrée Israël en tête de liste (voir Manques) | calque (« קוד ») + référence non israélienne en tête | Mineur |
| /he/cgu §8 et /he/confidentialite §1 | בעל השליטה במאגר (״בקר״) / (בקר) | בעל השליטה במאגר (controller) — ou supprimer la parenthèse | calque (בקר = contrôleur technique ou bétail) ; le terme légal suffit | Mineur |
| /he/confidentialite §3 | הנחיותיהם, על בסיס החוקי שהם קובעים | הנחיותיהם, על הבסיס החוקי שהם קובעים | grammaire (article) | Mineur |
| /he/confidentialite §6 | הממונה הפדרלי על הגנת מידע ומידע (FDPIC) | הממונה הפדרלי על הגנת המידע ועל חופש המידע (FDPIC) | traduction fautive (« ומידע » redondant) | Mineur |
| /he/confidentialite §8 vs pied de page | הצפנה בתעבורה (TLS) / footer : הצפנה בהעברה | uniformiser : « הצפנה בתעבורה » | cohérence terminologique | Mineur |
| /he/securite (liste « ההגדרות שלכם » vs « המחויבויות ») | רשימת החרגה / רשימת חסימה / רשימה שחורה | un seul terme : « רשימת חסימה » (et « Blacklist » seulement entre parenthèses) | cohérence terminologique (aussi dans la KB) | Mineur |
| /he/mentions-legales §4 vs /he/confidentialite §1 vs /he/about | PermanenceAI … אינה נושאת / PermanenceAI נולדה / PermanenceAI הוא מותג | fixer un genre : « PermanenceAI הוא מותג… » → « PermanenceAI אינו נושא… », « PermanenceAI נולד… », ou bien « החברה » | accord de genre incohérent | Mineur |
| /he/mentions-legales §1 | האחראי על הפרסום: הנציג החוקי של SINAY STRATEGIC LLC. | supprimer (notion française de « directeur de la publication ») ou « האחראי על תוכן האתר: … » | calque juridique FR | Mineur |
| /he/mentions-legales §1 | האתר … מופעל ומפורסם על ידי | האתר … מופעל ומנוהל על ידי | ambiguïté (מפורסם = « célèbre ») | Mineur |
| /he/mentions-legales §4 | לאי-דיוקים הקשריים מזדמנים של מודלים לעיבוד דיבור אוטומטי | לאי-דיוקים מזדמנים של מודלים לזיהוי דיבור אוטומטי בהבנת ההקשר | calque, syntaxe | Mineur |
| /he/mentions-legales (titre) vs footer | הודעה משפטית / footer : מידע משפטי | uniformiser : « מידע משפטי » | cohérence | Mineur |
| /he/securite (dernier point) + /he/cgu §6 | …, ובצרפת, שיווק טלפוני מחייב הסכמה מוקדמת של האדם מאז 11 באוגוסט 2026 | supprimer de la version HE (ou renvoyer à une note « לשווקים אחרים ») | référence non israélienne | Mineur |
| src/pages/api/agent/account.ts:134-136 | email OTP : « Votre code de vérification … Bonjour, … Lucie … Permanence IA » + anglais | version HE : sujet « קוד האימות שלך: {code} » ; corps « שלום, זה הקוד שלך כדי שנועה תוכל לעיין בחשבון PermanenceAI שלך: {code}. הקוד בתוקף ל-10 דקות. אם לא ביקשת אותו, אפשר להתעלם מהמייל הזה. » (sélection de la langue d'après la locale ou l'agent) | fuite FR/EN visible par l'utilisateur, mauvais nom d'agent | Majeur |
| src/lib/server.ts:61 | from: `Permanence IA <…>` | « PermanenceAI » (nom de marque du marché HE) | incohérence de marque | Mineur |
| src/components/LiveDemo.tsx:14 et :334 | note: `Démo live — rôle : Réceptionniste — langue : עברית — voix : …` | note localisée, par ex. « הדגמה חיה — תפקיד: מענה וקבלה — שפה: עברית — קול: נועה — תחום: … » ; ou bien la KB doit interdire à Noa de lire `request_note` mot à mot | texte FR injecté dans l'ouverture vocale de Noa (« בנושא [request_note] ») | Majeur |
| src/pages/api/callback.ts:69 + ui.tsx:183-185 | `Créneau souhaité : Demain matin (Asia/Jerusalem)` | traduire le libellé du créneau selon `campaignLang` (« מועד מועדף: מחר בבוקר ») ; la KB he-situations l.124 peut alors s'y référer en hébreu | fuite FR dans le contexte vocal | Mineur |
| src/pages/essai-gratuit.tsx:32 | `Demande d’accompagnement à l’essai — offre …` | idem (note localisée) | fuite FR dans `request_note` | Mineur |
| src/components/blocks.tsx:609 | `${n} %` → « 20 % » | `${n}%` → « 20% » | typographie française (espace avant %) | Mineur |
| src/components/ScenarioExplorer.tsx:123 | `{tc.leadTitle} : {…}` → « פנייה נוצרה : נזילה » | `{tc.leadTitle}: {…}` → « פנייה נוצרה: נזילה » | typographie française (espace avant :) | Mineur |
| src/data/personas.ts:58-60 (TEAM_PERSONAS) + /he/ et /he/about | Jade, Daan, Katie, Jack, Manuela, Tomasz (latin) ; disclaimer « ג׳ייד, דאן, קייטי והעמיתים שלהם » | pour HE : soit des prénoms translittérés cohérents avec le disclaimer (ג׳ייד, דאן, קייטי, ג׳ק, מנואלה, תומאש), soit une équipe israélienne (נועה, דניאל, …) | incohérence latin/hébreu, noms non israéliens | Mineur |
| /he/ et /he/about (cartes de l'équipe) | Katie, סוכן סינון לידים / Manuela, סוכן מעקב / Jade, … | Katie, סוכנת סינון לידים / Manuela, סוכנת מעקב (le libellé suit le genre de la persona) | accord de genre (persona féminine, libellé masculin) | Mineur |
| src/components/extras.tsx:35 | 🇲🇦 associé à « ערבית » ; drapeaux 🇧🇪/🇨🇭/🇨🇦 « צרפתית בלגית / שווייצרית / קנדית » ; pas de russe | pour HE : ערבית sans drapeau (ou un globe), ajouter רוסית ; mettre עברית en tête | localisation (sensibilité, pertinence pour le marché IL) | Mineur |
| /he/ (pied de page, toutes pages) | סוכנים קוליים AI שעונים… | סוכנים קוליים מבוססי AI שעונים… | syntaxe (calque de l'anglais) | Mineur |
| /he/tarifs, /he/ | טוענים קרדיט מתי שרוצים (Add credits) | « טוענים קרדיט מתי שרוצים (בתפריט Add credits באזור הלקוח) » | reste d'anglais sans contexte | Mineur |
| /he/kb/fr, /he/kb/en, /he/kb/it… (src/pages/kb/[doc].tsx:27) | page FR/EN servie avec `<html lang="he" dir="rtl">` | limiter les chemins aux documents de la locale, ou forcer `lang`/`dir` selon le fichier | fuite de langue et RTL appliqué à du texte LTR | Mineur (noindex) |
| src/data/kb/he.txt:4-5 vs site | PermanenceAI … מספקת / היא מותג | aligner sur le genre retenu pour le site | cohérence | Mineur |
| src/data/kb/he.txt:13 | הסוכן יוצא מהמידע הזה | הסוכן מתבסס על המידע הזה | calque (« part de ») | Mineur |
| src/data/kb/he.txt:47 ; he-situations:84 | עוזרת עזרה | עוזרת מובנית / עוזרת התמיכה | répétition maladroite | Mineur |
| src/data/kb/he.txt:51 | שמירת המספר הקיים (או מספר צרפתי) | שמירת המספר הקיים (גם מספר ישראלי מכל מפעיל) | référence FR | Mineur |
| src/data/kb/he.txt:72 ; he-situations:87, 109 | צרפת: … (Bloctel בוטל) / (בצרפת: …) / בצרפת, אין שיווק… | supprimer de la KB HE : Noa risque de citer le droit français à un Israélien | référence FR | Majeur (systémique, propos tenus oralement) |
| he-situations:83, 116 | לציין שלמספר צרפתי משתמשים בהפניית שיחות… / אפשר לקנות מספר צרפתי | supprimer, ou remplacer par « לציין שאפשר להשאיר את המספר הקיים בהפניית שיחות, ייבוא או SIP » | référence FR | Majeur |
| he-situations:65 | « אני מקריאה: פלוס תשע-שבע-שתיים, חמש-שתיים, אחת-שתיים-שלוש, ארבע-חמש-שש-שבע. נכון? » | « אני מקריאה: אפס-חמש-שתיים, אחת-שתיים-שלוש, ארבע-חמש-שש-שבע. נכון? » (format local ; stockage en +972 côté outil) | naturel au téléphone (aucun Israélien ne dicte +972) | Majeur |
| he-situations:3, 6, 19, 50, 133… (systémique) ; he.txt:6 | pluriel « אתם » tant que le genre n'est pas connu, y compris avec un particulier | règle à ajouter : « אחרי שהאדם אומר את שמו, או לפי ההקשר, לעבור לגוף יחיד (אתה/את). כשהמגדר עדיין לא ברור, להעדיף ניסוחים סתמיים: "אפשר לשאול…?", "נוח לדבר עכשיו?" » | registre oral : le « אתם » est acceptable pour une entreprise, mais il sonne écrit et robotique face à une seule personne | Majeur (systémique) |
| he-situations:58, 80, 82 ; he.txt:65 | שום דבר לא מחויב במשך 14 יום | לא תחויבו בכלום ב-14 הימים / אין שום חיוב בתקופת הניסיון | calque, peu naturel à l'oral | Mineur |
| he-situations:53 | « אני יוצאת מהתפקיד. » | « טוב, סיימנו את ההדגמה. » | calque (« je sors du rôle ») | Mineur |
| he-situations:77 | הפניית שיחות אצל המפעיל שלכם | הפניית שיחות אצל חברת הטלפון שלכם | calque (« opérateur ») ; l'usage oral IL est חברת הטלפון/הסלולר | Mineur |
| he-situations:32 | ו-$80 ללקוח … ב-$3,400 בחודש | « ו-300 ₪ ללקוח … בערך 12,900 ₪ בחודש » (valeur client en shekels ; le prix des forfaits reste en $) | référence non locale ; « $80 » est mal lu par le TTS | Mineur |
| he-situations:104 vs site | רפואה אסתטית וכירורגיה אסתטית | רפואה אסתטית וכירורגיה פלסטית | cohérence avec le nom du secteur sur le site | Mineur |
| he-situations:12, 125 ; he.txt:17 | 9:00–13:00 ובין 14:00–19:00 | 9:00–19:00 (la pause de midi à la française n'existe pas en Israël) ; préciser que le vendredi matin est autorisé ou non | réalité culturelle | Mineur |
| he-situations:136 | ואפשר גם לכתוב לנו ל-contact@permanenceia.com | « …ואפשר גם לכתוב לנו במייל, הכתובת מופיעה באתר. » (une adresse latine est inintelligible en TTS hébreu) | oralité, TTS | Mineur |

## Manques et ajouts recommandés

**Juridique (Israël). Chaque point est à faire valider par un עורך דין ישראלי.**

1. **הצהרת נגישות et conformité IS 5568 / WCAG 2.0 AA**. Risque **élevé, Bloquant**.
   - Le חוק שוויון זכויות לאנשים עם מוגבלות et la תקנה 35 des תקנות … (התאמות נגישות לשירות), התשע״ג-2013 imposent un site accessible et une déclaration d'accessibilité (rédacteur, date, niveau, coordonnées d'un רכז נגישות, voie de réclamation).
   - En Israël, les recours collectifs et les demandes de פיצוי ללא הוכחת נזק sont fréquents.
   - Il faut une page `/he/accessibility`, un lien dans le pied de page et un audit (RTL, contrastes, lecteurs d'écran, formulaires).
2. **CGU face au חוק החוזים האחידים, התשמ״ג-1982** (applicable aussi entre entreprises). Risque **élevé**. Clauses présumées abusives (חזקות קיפוח du סעיף 4) :
   - arbitrage AAA obligatoire à Cheyenne, en anglais ;
   - renonciation à l'action de groupe ;
   - délai de prescription contractuel de 3 mois (§17, à confronter au חוק ההתיישנות, סעיף 19) ;
   - modification unilatérale avec acceptation tacite (§21) ;
   - suspension sans préavis pour « risque d'image » ;
   - aucun remboursement même en cas de résiliation de notre fait (§13, sauf résiliation sans motif).
   
   À envisager : une clause de juridiction israélienne (בתי המשפט בתל אביב-יפו) pour les clients israéliens, ou au minimum une exception pour les petites entreprises.
3. **Consommateurs et petites entreprises** (חוק הגנת הצרכן, ביטול עסקה). Risque **moyen**.
   - Les CGU excluent les consommateurs (« אינו מוצע לצרכנים »), mais rien dans le parcours d'inscription ne le vérifie.
   - Un עוסק פטור ou un indépendant peut être requalifié en consommateur. Il aurait alors droit à l'annulation d'une vente à distance (סעיף 14ג), et les règles sur les עסקה מתמשכת (סעיף 13ד) et sur l'affichage des prix TTC (סעיף 17ב) s'appliqueraient.
   - Recommandation : une case « אני מאשר/ת שאני עוסק/תאגיד ומתקשר/ת לצורכי עסק » à l'inscription.
4. **Amendement 13 à la loi sur la vie privée** (en vigueur depuis le 14/08/2025). Risque **moyen à élevé**.
   - La politique (§3) reprend les bases légales du RGPD (« אינטרסים לגיטימיים »). Le droit israélien repose sur le consentement éclairé (הסכמה מדעת) et sur les exceptions légales, pas sur l'intérêt légitime. Ce §3 est à réécrire pour Israël : enregistrement, amélioration des assistants, marketing 3 ans après la fin du contrat sur simple opt-out.
   - L'**obligation d'information** du סעיף 11 (version amendée) n'est pas remplie à l'oral. Le « השיחה מוקלטת » de Noa n'indique ni la finalité, ni le caractère facultatif, ni les destinataires. Il faut au minimum une phrase du type « פרטים במדיניות הפרטיות באתר ».
   - Vérifier si un **ממונה על הגנת הפרטיות (DPO)** est obligatoire, y compris pour le sous-traitant (מחזיק) qui traite à grande échelle des données sensibles de cliniques (médical, esthétique). Le cas échéant, publier ses coordonnées.
   - La politique ne mentionne ni les עיצומים כספיים ni l'avis à la רשות en cas d'אירוע אבטחה חמור. Aucun ajout n'est obligatoire, mais il faut aligner le texte sur les תקנות אבטחת מידע.
5. **Incohérence entre le formulaire et la politique**. Risque **moyen**. La case du formulaire de rappel dit « הפרטים שלי ישמשו אך ורק לטיפול בפנייה », alors que la politique prévoit 24 mois de conservation, l'amélioration des assistants et du marketing. Il faut aligner les deux, ou ajouter « ולפי מדיניות הפרטיות » avec un lien.
6. **חוק התקשורת סעיף 30א**. Risque **moyen**. Le texte des CGU, de la politique et de la KB est correct. Deux points restent à faire confirmer :
   - qu'un appel vocal par IA relève bien de la « מערכת חיוג אוטומטי » ;
   - les exceptions du 30א(ג) (client existant) et 30א(ד) (offre unique à une entreprise).
   
   Ajouter aussi l'obligation de marquer le message « פרסומת » et d'identifier l'expéditeur (30א(ה)).
7. **Registre d'opposition israélien**. Les CGU (§6 « רשימות התנגדות ») listent les registres de France, du Royaume-Uni, d'Australie, d'Italie, de Pologne et des Pays-Bas, mais pas celui d'Israël. Faire vérifier par l'avocat si un registre d'opposition israélien (« אל תתקשרו אליי ») s'impose au démarchage téléphonique, et mentionner Israël en tête de liste.
8. **Enregistrement des appels**. Risque **faible**. Le חוק האזנת סתר, התשל״ט-1979 permet à un participant d'enregistrer, et l'agent agit pour l'entreprise participante. L'information est déjà donnée. Pour les cliniques, ajouter une mention sur le secret médical (חוק זכויות החולה) dans les obligations du client (CGU §6/§8).
9. **TVA**. Risque **faible, à faire valider par un comptable**. Le site affiche partout « לא כולל מע״מ », alors que le vendeur est une LLC américaine qui facture en USD. Vérifier si de la TVA israélienne sera réellement facturée. Sinon, préférer « המחירים אינם כוללים מסים, ככל שחלים ».
10. **`markets.ts:132`** : `privacyLaw` ne mentionne pas l'amendement 13, contrairement aux CGU. Proposition : `'חוק הגנת הפרטיות, התשמ״א-1981 (לרבות תיקון מס׳ 13), ותקנות הגנת הפרטיות (אבטחת מידע), התשע״ז-2017'`. `mandatoryNote` est vide. On pourrait y placer, pour Israël, un renvoi à la déclaration d'accessibilité ou une clause « אין באמור כדי לגרוע מהוראות דין קוגנטי בישראל ».

**Linguistique et technique**

- **KB vocale** : ajouter une section « ניסוחים טלפוניים » :
  - attente : « רגע אחד, אני בודקת » / « תנו לי שנייה » ;
  - clôture : « תודה שהתקשרתם, יום טוב! » / « שיהיה המשך יום נעים » ;
  - avant shabbat : « שבת שלום » le vendredi ;
  - prononciation de la marque pour le TTS (« פֶּרְמָנֶנְס איי-איי ») et règle de lecture des montants (« 99 דולר », pas « $99 »).
- **Contenu dynamique** : localiser toutes les notes envoyées à `/api/callback` (LiveDemo, essai-gratuit, créneaux). À défaut, ajouter dans he-situations une règle explicite : « אם request_note בצרפתית, לסכם אותה בעברית ולא להקריא אותה ».
- **Email OTP et notifications utilisateur** : prévoir une version hébreu ; l'email doit mentionner Noa, pas Lucie.
- **`/he/kb/*`** : ne générer que `he` et `he-situations` pour la locale `he`. Sinon, régler `lang`/`dir` selon la langue du fichier.

# Audit Phase 2 – he/guides.ts + he/help.ts (relecture hébreu natif)

## Synthèse
- Qualité globale **bonne** : hébreu correct et naturel, כתיב מלא respecté, impératif pluriel cohérent dans guides.ts (help.ts est à l'infinitif/présent impersonnel « נכנסים, לוחצים » : registre différent mais acceptable). Les libellés d'interface restent en anglais entre guillemets, conformément à l'interface Autocalls : **aucun libellé de bouton traduit à tort** (vérifié : les 140 libellés cités sont identiques aux libellés de la source FR ; la langue « Hebrew » existe bien dans Autocalls, id 18).
- Localisation Israël déjà faite et juste sur l'essentiel : opérateurs (פרטנר, סלקום, פלאפון, HOT mobile, גולן, בזק), codes GSM **21/61/67/62/##002# corrects pour les réseaux israéliens, « עקוב אחריי », +972, ראשון–חמישי, סעיף 30א חוק התקשורת (התשמ״ב-1982), חוק הגנת הפרטיות + תיקון 13, הרשות להגנת הפרטיות. Aucune référence française résiduelle (hors section « autres pays », voulue).
- **Point principal = bidi** : le composant `GuideBody` rend le texte brut sans isolation directionnelle. Les codes USSD (`##61#` s'affiche `#61##`), le numéro `+972501234567` (s'affiche `972501234567+`), `</body>` (s'affiche `<body/>`), `cal_live_`, `(.txt)` sont mal affichés. À corriger par des marques LRI/PDI (U+2066/U+2069) ou LRM (U+200E) dans les chaînes, ou par un rendu `<bdi dir="ltr">`.
- Exactitude Israël : il manque l'avertissement sur le **renvoi vers un numéro étranger** (le numéro de l'agent est vraisemblablement étranger : tarif international, et certains opérateurs bloquent par défaut le renvoi vers l'international) et des précisions sur les **numéros israéliens** (07X, géographiques, documents).
- Manque important spécifique à l'hébreu : **le genre grammatical du sujet** (voix féminine ↔ formes verbales féminines dans le prompt ; façon de s'adresser à l'appelant).
- Quelques fautes de grammaire/calques mineurs et des incohérences terminologiques (הנחיות/פרומפט, פגישות/תורים, ווידג׳ט/וידג׳ט, maqaf ־ vs trait d'union -). Aucun bloquant.

## Tableau des corrections

| fichier:ligne | texte actuel | correction proposée (hébreu) | type | sévérité |
|---|---|---|---|---|
| he/guides.ts:974-978 | `**61*מספר הסוכן#`, `**67*…#`, `**62*…#`, `**21*…#`, `##61#, ##67#, ##62# או ##21#, או ##002#` | Envelopper chaque code dans un isolat LTR : `⁦**61*מספר הסוכן#⁩` … `⁦##002#⁩` (ou rendu `<bdi dir="ltr"><code>`). Sinon, en contexte RTL, `##61#` s'affiche `#61##` et `**61*…**20#` est inversé visuellement → risque de mauvaise saisie | bidi / exactitude | **Majeur** |
| he/guides.ts:788 | `(+972501234567)` | `(‎+972501234567)` – sinon s'affiche « 972501234567+ ». Ajouter aussi l'exemple local : `או בפורמט מקומי (0501234567) עם קובץ נפרד לכל מדינה` | bidi / format | **Majeur** |
| he/guides.ts:972 + 997 | `…מקישים את הקוד ואחריו את המספר של הסוכן בפורמט בינלאומי…` / `…במיוחד אם המספר נמצא בחו״ל.` | Ajouter : `אם המספר של הסוכן אינו מספר ישראלי, ההפניה תחויב כשיחה בינלאומית, ואצל חלק מהמפעילים הפניה לחו״ל חסומה כברירת מחדל ויש לבקש לפתוח אותה בשירות הלקוחות.` (à valider avec le type réel des numéros vendus pour IL) | exactitude Israël | **Majeur** |
| he/guides.ts:534 | `בחרו מדינה וסוג מספר (מקומי, ארצי או חיוג חינם, בהתאם לזמינות)` | Catégories françaises. Pour IL : `(מספר גיאוגרפי, מספר וירטואלי 07X, או 1-800, בהתאם לזמינות)` – à aligner sur ce qu'Autocalls propose réellement pour Israël | exactitude Israël | Mineur |
| he/guides.ts:537 | `(מסמכים נדרשים בהתאם למדינה, בדרך כלל 1 עד 3 ימי עסקים)` | Préciser pour IL : `(בישראל בדרך כלל נדרשים פרטי העסק – ח״פ או מספר עוסק – וכתובת בישראל; …)` (à valider) | exactitude Israël | Mineur |
| he/guides.ts:964 | `חברת הטלפון שלכם גובה תשלום על ההפניה.` | `חברת הטלפון שלכם עשויה לגבות תשלום על ההפניה.` (beaucoup de forfaits israéliens illimités incluent le renvoi vers un numéro local) | exactitude | Mineur |
| he/guides.ts:689 | `ממש לפני התג </body> באתר שלכם` | `ממש לפני התג ⁦</body>⁩ באתר שלכם` – sinon affiché « <body/> » | bidi | Mineur |
| he/help.ts:76 | `לפני התגית </body> באתר שלכם` | `לפני התג ⁦</body>⁩ באתר שלכם` (bidi + même terme « תג » que guides.ts:689) | bidi / cohérence | Mineur |
| he/guides.ts:401 | `(הוא מתחיל ב־cal_live_)` | `(הוא מתחיל ב־⁦cal_live_⁩)` – sinon le « _ » final passe à gauche (« _cal_live ») | bidi | Mineur |
| he/guides.ts:366 | `Word (.docx) או טקסט (.txt)` | `Word (DOCX) או טקסט (TXT)` ou `טקסט (⁦.txt⁩)` – sinon affiché « (txt.) » | bidi | Mineur |
| he/guides.ts:1117 | `של כל חודש.סוכן שנבדק` | `של כל חודש. סוכן שנבדק` (espace manquante) | ponctuation | Mineur |
| he/guides.ts:302 | `בחרו את הספק, את השפה ושם.` | `בחרו את הספק ואת השפה, ותנו לקול שם.` (« ושם » sans את, coordination bancale) | grammaire | Mineur |
| he/guides.ts:796 | `ובמידת הצורך כמה מספרים משניים יש.` | `ובמידת הצורך גם את מספר הטלפונים המשניים לכל איש קשר.` | grammaire | Mineur |
| he/guides.ts:798 | `שורות לא תקינות או כפולות מדולגות ומפורטות בדוח שאפשר להוריד.` | `המערכת מדלגת על שורות לא תקינות או כפולות ומפרטת אותן בדוח שאפשר להוריד.` (« מדולגות » non idiomatique : דילג על) | grammaire | Mineur |
| he/guides.ts:805 | `החזרת איש קשר ל־"Created" גורמת להתקשר אליו שוב` | `החזרת איש קשר ל־"Created" מחזירה אותו לתור החיוג` | syntaxe | Mineur |
| he/guides.ts:807 | `סינונים, מחיקה מרובה וייצוא ל־CSV` | `מסננים, מחיקה מרובה וייצוא ל־CSV` | lexique | Mineur |
| he/guides.ts:862 | `פתחו את הסוכן, בחלק של הנתונים שאחרי השיחה.` | `פתחו את הסוכן ועברו ללשונית "Post-Call" (הנתונים שאחרי השיחה).` (phrase sans verbe principal ; donner le libellé, cf. l.237) | grammaire / UI | Mineur |
| he/guides.ts:203 | `שנו את ההנחיות של הסוכן פשוט על ידי כך שתבקשו את מה שאתם רוצים.` | `שנו את ההנחיות של הסוכן פשוט על ידי בקשה במילים שלכם.` | calque | Mineur |
| he/guides.ts:251 | `הוא נקרא בדיוק כפי שנכתב.` | `הסוכן מקריא אותו בדיוק כפי שנכתב.` (« נקרא » = « s'appelle » / « est lu », ambigu) | ambiguïté | Mineur |
| he/guides.ts:130 | `ואיך הוא מתמודד עם קטיעות` | `ואיך הוא מגיב כשקוטעים אותו` | naturel | Mineur |
| he/guides.ts:287 | `(גבר, אישה, מבטא)` | `(קול גברי או נשי, מבטא)` | naturel | Mineur |
| he/guides.ts:80 | `(למשל "קבלה במרפאה")` | `(למשל "מזכירות המרפאה")` (« קבלה » = aussi « reçu ») | ambiguïté | Mineur |
| he/guides.ts:469 | `Cal.com או Calendly, שמתחברים בעצמם ל־Google או ל־Outlook` | `Cal.com או Calendly, שאליהם מחברים את יומן Google או Outlook` (calque de « eux-mêmes reliés ») | calque | Mineur |
| he/help.ts:61 | `(Cal.com או Calendly, שמחוברים בעצמם ליומן Google או Outlook שלכם)` | `(Cal.com או Calendly, שאליהם מחברים את יומן Google או Outlook שלכם)` | calque | Mineur |
| he/guides.ts:470 | `לנווט בתפריט טלפוני או לחייג לשלוחה` | `לנווט בתפריט קולי (IVR) או לחייג לשלוחה` | terme usuel | Mineur |
| he/guides.ts:497 | `את השיטה (GET, POST…) … (headers, למשל מפתח הרשאה)` | `את המתודה (GET, POST…) … (headers, למשל טוקן או מפתח API)` | terme technique | Mineur |
| he/guides.ts:709 (+933) | `ההודעות משולמות באמצעות קרדיטים להודעות.` | `ההודעות מחויבות מקרדיט ההודעות.` | naturel | Mineur |
| he/guides.ts:716 | `ואז עקבו אחרי החלון של Meta ("Login with Facebook")` | `ואז פעלו לפי ההוראות בחלון של Meta ("Login with Facebook")` (calque de « suivez la fenêtre ») | calque | Mineur |
| he/guides.ts:718 | `השיחות הנכנסות אליו מיורטות לכמה דקות` | `השיחות הנכנסות אליו לא יגיעו אליכם במשך כמה דקות` | naturel | Mineur |
| he/guides.ts:832 | titre `שיחות כתובות` (après la section `שיחות` = appels) | `התכתבויות` (« שיחות » désigne déjà les appels juste au-dessus) | ambiguïté | Mineur |
| he/guides.ts:948 | `"Add credits": רכישת טעינת קרדיט` | `"Add credits": טעינת קרדיט (רכישה חד־פעמית)` | naturel | Mineur |
| he/guides.ts:949 | `"Change plan": מעבר מסלול.` | `"Change plan": החלפת מסלול.` (= help.ts:21) | cohérence | Mineur |
| he/guides.ts:759 | `(למשל 9:00–12:00 ו־14:00–18:00)` | Coupure déjeuner à la française ; pour IL : `(למשל 9:00–13:00 ו־16:00–19:00)` ou `9:00–17:00` | localisation | Mineur |
| he/guides.ts:1011 | `התקשרו רק לאנשים שיש לכם סיבה לגיטימית, שאפשר להוכיח, לדבר איתם` | `התקשרו רק לאנשים שיש לכם סיבה לגיטימית, שאפשר להוכיח, להתקשר אליהם` | syntaxe | Mineur |
| he/guides.ts:1105 | `בתפריט "Calls"` | `בתפריט "Calls history"` (= l.826, 940, help.ts:10 ; incohérence héritée de la source FR l.1123 – vérifier le libellé réel) | UI / cohérence | Mineur |
| he/guides.ts:129 vs 137 | `"Speak with your assistant"` / `"Speak to your assistant"` | Hérité du FR (l.156/164). Vérifier dans Autocalls s'il s'agit de deux boutons distincts ; sinon unifier | UI | Mineur |
| he/guides.ts:516 vs 896 | `"Automation Platform"` (type d'outil) / `"Automate platform"` (menu) | Identique au FR ; à confirmer à l'écran (probablement deux libellés réels distincts) | UI | Mineur |
| he/help.ts:35 | `Voice & speech: מגדירים את השפה לעברית` | `Voice & speech: בוחרים בשפה Hebrew, בוחרים קול ומאזינים לו.` (le menu affiche « Hebrew », pas « עברית ») | libellé UI | Mineur |
| he/help.ts:62 + help.ts:113 | `מציינים בפרומפט…` ; glossaire `Prompt` → `פרומפט` | guides.ts emploie partout `הנחיות` ("System prompt"). Unifier : `מציינים בהנחיות (Prompt)…` et glossaire label `הנחיות (פרומפט)` | cohérence terminologique | Mineur |
| he/help.ts:58-62 | `קביעת תורים` / `להציע תור` | guides.ts dit `פגישות`. Choisir un terme (תורים pour cliniques/salons, פגישות en B2B) ou écrire `פגישות ותורים` | cohérence | Mineur |
| he/help.ts:16, 73 | `ווידג׳ט לאתר` / `(ווידג׳ט)` | `וידג׳ט` (en début de mot, ו consonantique non doublé ; = guides.ts:670). `הווידג׳ט` (l.75) est correct | orthographe | Mineur |
| he/help.ts:53 | `מבקשים מספק הטלפוניה להפנות…` | `מבקשים מחברת הטלפון להפעיל הפניית שיחות…` (= guides.ts:550) | cohérence | Mineur |
| he/help.ts:23 | label `חיובים` | `פרטי חיוב` | naturel | Mineur |
| he/help.ts:83 | `מתקשרים רק למי שנתן הסכמה מפורשת מראש, כנדרש בסעיף 30א לחוק התקשורת.` | `בקמפיין שיווקי, מתקשרים רק למי שנתן הסכמה מפורשת מראש (סעיף 30א לחוק התקשורת).` (30א vise le דבר פרסומת ; cohérent avec guides.ts:1019) | exactitude juridique | Mineur |
| he/help.ts:98 | `לעתים קרובות` | `לעיתים קרובות` (= guides.ts:949, כתיב מלא) | orthographe | Mineur |
| he/help.ts (tout) vs he/guides.ts | `ל-Assistants`, `דו-שלבי`, `חד-פעמי` (trait d'union) | guides.ts utilise le maqaf `ל־`. Unifier (maqaf ־ recommandé, ou trait d'union partout, y compris faq.ts/offers.ts) | typographie | Mineur |

## Manques / ajouts recommandés
1. **Genre grammatical (spécifique hébreu) – Majeur.** Ajouter dans « כתיבת ההנחיות » et « בחירת קול » : si la voix est féminine, rédiger le prompt et l'accueil au féminin (`אני שמחה לעזור`, `אבדוק בשבילך`) et l'indiquer explicitement au modèle ; décider comment s'adresser à l'appelant (forme neutre/plurielle `אפשר`, `תוכלו`, ou adaptation au genre détecté) ; éviter les accords mixtes, très audibles en hébreu.
2. **Langue et voix hébreu** : sélectionner « Hebrew » dans "Voice & speech" ; quels fournisseurs TTS/STT gèrent bien l'hébreu ; prononciation des noms propres, sigles et du code-switching hébreu/anglais ; écrire les numéros en toutes lettres (`אפס חמש אפס…`) ; limites du ניקוד selon le moteur.
3. **Numéros israéliens** : types réellement disponibles (+972 géographiques 02/03/04/08/09, VoIP 07X, 1-800), justificatifs (ח״פ/עוסק, adresse en Israël), délais ; **ניוד מספרים** (portabilité) : peut-on porter son numéro ? Sinon le dire et renvoyer vers la הפניית שיחות.
4. **Renvoi d'appel** : codes indicatifs pour les lignes fixes בזק (« עקוב אחריי » ; à vérifier auprès de Bezeq avant publication), rappel que le renvoi vers un numéro étranger est facturé à l'international et parfois bloqué par défaut, durée de sonnerie par défaut chez les opérateurs israéliens.
5. **SIP en Israël** : format attendu par les fournisseurs israéliens (`0` + indicatif vs `972` sans +), exemple de connexion d'une מרכזייה וירטואלית / ספק SIP israélien.
6. **Horaires et calendrier** : fuseau `Asia/Jerusalem` et heure d'été israélienne (dates différentes de l'UE) ; vendredi/veille de fête raccourcis ; חגי ישראל dans les horaires et la base de connaissances (le guide mensuel parle des חגים, pas de méthode).
7. **Juridique (qui-peut-on-appeler)** : exceptions de 30א (client existant ayant acheté, avec possibilité de refus ; demande unique de consentement à un בית עסק) ; פיצוי ללא הוכחת נזק jusqu'à 1 000 ₪ par message ; חוק הגנת הצרכן §14ג (vente à distance par téléphone : information et droit d'annulation) ; licéité de l'enregistrement (partie à la conversation, חוק האזנת סתר) ; transfert de données hors d'Israël (תקנות הגנת הפרטיות (העברת מידע אל מאגרי מידע שמחוץ לגבולות המדינה)) ; existence éventuelle d'un registre « אל תתקשרו אליי » (à vérifier).
8. **Facturation** : prix en dollars (USD), frais de conversion de carte israélienne, מע״מ / חשבונית pour une entreprise israélienne facturée par un fournisseur étranger.
9. **WhatsApp** : modèles de messages (Templates) en hébreu (RTL, variables `{{1}}` au milieu du texte hébreu), vérification d'un portable israélien +9725X.

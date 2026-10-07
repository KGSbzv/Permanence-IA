# Audit pré-publication — version hébreu (www.permanenceia.com/he)

Date : 7 octobre 2026. Périmètre : les 79 URL /he du sitemap (site en ligne, desktop 1440 px et mobile 390 px), l'intégralité du contenu hébreu du dépôt (`src/i18n/content/he/**`, ~4 000 lignes), les chaînes codées en dur, les pages légales rendues, la base de connaissances de l'agent vocal (`src/data/kb/he*.txt`, relecture partielle) et les emails ou notes envoyés au visiteur hébreu.

Détail ligne par ligne (environ 300 corrections) : `annexes/`. Captures : `captures/`.

## Verdict

**Pas prêt à publier en l'état.** Le socle est solide :

- technique : 79/79 pages en 200, `lang/dir`, hreflang, canonical, aucun lien cassé, Heebo, aucun débordement mobile ;
- hébreu correct et globalement naturel ;
- adaptation à Israël déjà avancée : סעיף 30א, תיקון 13, opérateurs israéliens.

Il reste à traiter :

- **5 bloquants** : une contradiction factuelle, un manque légal, des codes de numérotation affichés à l'envers, une référence française dans les textes légaux et une clause qui annule les clauses israéliennes.
- **Deux décisions business** : devise et TVA.
- **Une passe d'harmonisation terminologique** sur tout le site.

Estimation : 1 à 2 jours de développement et de rédaction, plus une validation par un עורך דין ישראלי et un comptable.

## 1. Bloquants

| # | Constat | Source | Correctif |
|---|---|---|---|
| B1 | **Aucune הצהרת נגישות** : le mot « נגישות » n'apparaît nulle part sur le site. C'est une obligation légale (תקנות שוויון זכויות לאנשים עם מוגבלות, תקנה 35, IS 5568 / WCAG AA) ; les actions de groupe sur ce point sont fréquentes. | `src/components/Footer.tsx:57-62`, pas de page | Créer la page `/he/negishut` (רכז נגישות, date d'audit, niveau de conformité, limites connues, contact). Lien dans le footer, URL au sitemap. |
| B2 | **Contradiction** : « איננו מפרסמים מספר טלפון » est affiché juste au-dessus du 02-376-7085. | `he/ui/pages.ts:39`, `he/ui/components.ts:75` | « אפשר להתקשר אלינו 24/7 ל-02-376-7085 – נועה, סוכנת ה-AI שלנו, עונה – או להשאיר מספר ונחזור אליכם בשעה שתבחרו. » |
| B3 | **Codes de renvoi affichés à l'envers** (vérifié à l'écran, voir `captures/bidi-renvoi.png`) : `##61#` devient « #61## », `+972…` devient « 972…+ », `</body>` devient « <body/> ». Un client qui recopie le code fait une erreur de numérotation. | `he/guides.ts:788, 974-978, 689, 401, 366` ; `he/help.ts:76` ; rendu `src/components/Guides.tsx` | Rendre les segments code, numéro et balise dans `<bdi dir="ltr"><code>`, ou entourer les chaînes de LRI…PDI (U+2066/U+2069). |
| B4 | **Référence française dans la page sécurité** : « ובצרפת, שיווק טלפוני מחייב הסכמה… מאז 11 באוגוסט 2026 ». | `he/ui/pages.ts:193` | Supprimer. Remplacer par les obligations de 30א : mention « פרסומת », identité de l'émetteur, mécanisme de retrait. |
| B5 | **« במקרה של סתירה, הנוסח האנגלי גובר »** : la version anglaise ne contient aucune clause israélienne, donc cette phrase les neutralise. | `he/ui/pages.ts:477` | Prévoir une exception pour les clauses spécifiques à Israël, ou faire prévaloir la version hébraïque pour le marché IL. Validation par un avocat. |

## 2. Décisions business à prendre avant publication

1. **Devise.** Les prix sont en USD pour tous les marchés (`src/i18n/markets.ts:90`, `SHARED.currency`). Une PME israélienne raisonne en ₪. Le calculateur part de 25 $/h, soit environ 90 ₪, ce qui est trop haut pour une מזכירה (`src/components/blocks.tsx:587`).
   - Recommandation : grille en ₪ propre au marché `he` et taux horaire par défaut de 45 à 55 ₪.
   - Si la facturation reste en USD : le dire explicitement et mentionner les frais de conversion.
2. **TVA et facture.** « לא כולל מע״מ » (`he/ui/components.ts:229`, tarifs, FAQ) laisse entendre qu'une TVA israélienne de 18 % sera ajoutée et qu'une חשבונית מס sera émise. En principe, une LLC du Wyoming non enregistrée en Israël n'émet pas de חשבונית מס israélienne, et le client B2B déclare lui-même la TVA (חשבונית עצמית) ; à confirmer. **Un comptable doit valider la formulation**, sinon la mention est trompeuse.
3. **CGU de modèle américain.** Plusieurs clauses sont exposées au חוק החוזים האחידים, qui s'applique aussi en B2B, et à la jurisprudence Facebook c. Ben Hamo : arbitrage AAA à Cheyenne en anglais, renonciation à l'action de groupe, prescription de 3 mois, plafond de 1 000 USD, modification unilatérale.
   - La politique de confidentialité reprend des bases RGPD (« אינטרסים לגיטימיים », délai de « +2 mois ») au lieu de la logique israélienne (הסכמה מדעת, חובת יידוע du סעיף 11).
   - Ajouter une case « אני מצהיר/ה שאני פונה כעסק (עוסק/ח״פ) » à l'inscription : elle appuie l'exclusion du droit de rétractation consommateur (חוק הגנת הצרכן, 14ג).

## 3. Majeurs — UI/UX

- **Widget de chat Autocalls non adapté au RTL** (`captures/mobile-home-bottom-overlay.png`, `captures/zoom-widget-desktop.png`).
  - Texte rendu en LTR : « ?יש לכם שאלה », et le sous-titre est tronqué (« שלנו AI-דברו עם נועה, עוזרת ה »).
  - `title="Voice Assistant Widget"` est en anglais.
  - En mobile, la bulle recouvre le CTA de /he/essai-gratuit, la carte téléphone de l'accueil, l'email de /he/contact et le menu ouvert.
  - Correctif : position `bottom-left` en HE, `dir="rtl"` sur le conteneur, décalage au-dessus de la barre CTA mobile. Le texte /he/demo « בפינה הימנית התחתונה » est à aligner sur la position finale.
- **Puces de langue de la démo** : les avatars recouvrent les libellés (« Polski », « Français »…) parce que `-space-x-2` n'a pas de `rtl:space-x-reverse` (`src/components/LiveDemo.tsx:410`, `captures/zoom-demo-langchips.png`). De plus, עברית arrive en dernier : il faut la mettre en premier sur /he.
- **Contraste** : mot-clé turquoise du h1 `.kw` (#0FA3C4 sur #F5F8FB) à 2,79:1, sous le minimum WCAG AA de 4,5:1. C'est directement lié à B1.
- **Langue des messages envoyés au visiteur hébreu** :
  - email du code de vérification en français et en anglais, signé « Lucie / Permanence IA » (`src/pages/api/agent/account.ts:134-136`) ;
  - note de démo en français (« Démo live — rôle : … », `src/components/LiveDemo.tsx:334`, `essai-gratuit.tsx:32`). נועה la lit en ouverture d'appel.
- **Personas** : Jade, Daan, Katie… sont affichés en latin, au masculin, sur la page hébraïque (`src/data/personas.ts:56`, `he/ui/components.ts:417`). Il faut des personas israéliens, ou au minimum נועה et דניאל.

## 4. Majeurs — textes

- **Harmonisation terminologique sur tout le site** (cause principale d'incohérence visible) :
  - **חבילה / מסלול** : l'interface dit « חבילה » (environ 57 fois), le contenu dit « מסלול » (environ 114 fois), parfois sur la même page. Retenir **מסלול**.
  - **Genre de l'agent** : « סוכן מענה », « העוזר שלנו », « הסוכן… הקול שלו » sont au masculin à côté de נועה (`he/ui/components.ts:89, 532` ; `he/ui/pages.ts:17-27, 18, 176`). Mettre au féminin dès que נועה est nommée.
  - Doublons à unifier : ווידג׳ט/וידג׳ט, וואטסאפ/WhatsApp, דוא״ל/אימייל/מייל, רשימת חסימה/החרגה, דשבורד/לוח בקרה, הנחיות/פרומפט, פגישות/תורים, maqaf ־ ou tiret -.
- **Formule centrale « מענה טלפוני AI »** (56 occurrences) : c'est un calque. Les Israéliens cherchent « מזכירה וירטואלית », « מענה טלפוני לעסקים », « מוקד מענה ». Aligner sur le slogan « מענה טלפוני חכם » et alterner avec « מזכירה וירטואלית ל… » dans les titles des secteurs (`he/ui/commerce.ts` SECTOR_SEO).
- **Contresens et ambiguïtés** :

  | Source | Texte actuel | Problème | Correction |
  |---|---|---|---|
  | `he/modules.ts:203` | « החזרת לקוחות ותיקים » | ותיקים = fidèles | « החזרת לקוחות עבר » |
  | CGU §13 | « הדמים » | se lit « le sang » | « דמי המנוי » |
  | CGU §3 | « נצברת במלואה » | contresens | « סופי ואינו ניתן להחזר » |
  | CGU §5 | « הודעות פוליטיות או בחירות אוטומטיות » | se lit « élections automatiques » | reformuler |
  | — | « עוזרת העזרה » | tautologie | « עוזרת התמיכה » |
  | `he/sectors.ts:164` | « לא רושם שום דבר » | ambigu (noter ou prescrire) | « לא רושם תרופות » |
  | `he/sectors.ts:254` | « צבעים » | se lit « couleurs » ou « peintres » | « קולוריסטים » |
  | `he/ui/commerce.ts:303` | « שלושה־עשר מודולים » | 14 sont affichés | « ארבעה־עשר מודולים » |
  | `he/ui/commerce.ts:250` | « חנויות אונליין » | cité comme secteur absent, alors que c'est l'un des 14 | retirer de la liste |

- **Calques fréquents** :
  - « עובד/ת קבלה » : remplacer par « מזכירה / פקיד/ת קבלה » ;
  - « להפוך את השיחות לאוטומטיות » ;
  - « הקרדיט… לא פג » : remplacer par « ותוקפו לא פג » ;
  - « דוברים ילידיים » : remplacer par « דוברי שפת אם » ;
  - « שום חיוב בתקופת הניסיון » : remplacer par « ללא חיוב בתקופת הניסיון » ;
  - « בשידור חי » : remplacer par « בהדגמה חיה ».
- **Restes de la réalité française** :
  - frise des langues qui commence par le français (fr-BE, fr-CH, fr-CA) mais sans le russe ;
  - pause de midi à la française dans la FAQ et un guide ;
  - « נוטריונים » ;
  - « שבוע 42 » dans les maquettes ;
  - références France / Bloctel / numéro français dans la base de l'agent (`src/data/kb/he.txt:51,72`, `he-situations.txt:83,87,109,116`).

## 5. Mineurs (détail dans les annexes)

- Navigation au clavier des onglets non inversée en RTL ; dégradé « encore des onglets » faux, car `scrollLeft` est négatif en RTL (`src/components/extras.tsx:150,160,183`, `ScenarioExplorer.tsx:178`).
- Trait de la timeline du mauvais côté : `left-` au lieu de `start-` (`src/components/Mock.tsx:153`).
- Validation du téléphone trop permissive (« abcdefgh » passe) et messages d'erreur du navigateur au lieu de messages en hébreu (`src/components/ui.tsx:169`, `essai-gratuit.tsx:86`).
- Double redirection 301 pour `permanenceia.com/he` ; `/he/docs` renvoie vers `/en-gb/aide` ; `/he/kb/fr` sert du français sous une URL /he (noindex).
- Slugs d'URL en français sous /he : à garder pour l'instant, une traduction translittérée coûterait des redirections pour un gain SEO faible.
- Typographie : `20 %` et `פנייה נוצרה :` avec espace à la française ; guillemets “ ” ; maqaf.
- Une cinquantaine de corrections grammaticales ponctuelles (accords, prépositions, ponctuation).

## 6. Manques recommandés (contenu)

Par ordre de valeur commerciale.

1. **FAQ propre à Israël** :
   - accent et naturel de la voix hébraïque ;
   - compréhension de l'argot et du mélange hébreu-anglais ;
   - arabe et russe ;
   - שבת, חגים et ערב חג ;
   - légalité de l'enregistrement (חוק האזנת סתר : licite pour un participant, annonce recommandée) ;
   - **lieu d'hébergement des données** : la question « איפה נשמרים נתוני השיחות? » ne donne jamais de lieu (`he/sectors.ts:85,126,567`), alors que c'est critique pour le médical et les avocats ;
   - חשבונית מס, TVA, devise, תשלומים ;
   - support humain en hébreu.
2. **Arguments israéliens** : מילואים (« העסק עונה גם כשאתם במילואים »), שבת et חגים, ווטסאפ comme canal dominant.
3. **Réalités par secteur** :
   - immobilier : Yad2, מדלן, טופס הזמנת שירותי תיווך ;
   - garages : מספר רישוי, טיפול 15,000 ;
   - restaurants : Ontopo, Tabit, Wolt, 10bis ;
   - dentaire : ביטוח שיניים / קופות ;
   - e-commerce : Wix, Konimbo, annulation sous 14 jours ;
   - assurance : רשות שוק ההון.
4. **Guides** :
   - rédiger le prompt et l'accueil au féminin quand la voix est féminine ;
   - écrire les numéros en toutes lettres pour la synthèse vocale ;
   - types de numéros israéliens (07X, 1-800) et justificatifs (ח״פ/עוסק) ;
   - coût et blocage du renvoi vers l'étranger ;
   - fuseau horaire `Asia/Jerusalem`.
5. **Intégrations locales** (vérifier la faisabilité avant de les citer) : monday.com, Fireberry, Priority, מורנינג/Green Invoice, iCount, Wix.

## Plan d'action

| Ordre | Action | Responsable | Effort |
|---|---|---|---|
| 1 | B2, B4, contresens et 13→14 modules (textes) | dev / rédaction | 2 h |
| 2 | B3 bidi dans `Guides.tsx` + chaînes concernées | dev | 2 h |
| 3 | Widget RTL et puces de langue de la démo | dev | 2-3 h |
| 4 | Harmonisation חבילה→מסלול, genre de נועה, doublons | rédaction | 3 h |
| 5 | Email de vérification et notes de démo localisés | dev | 1 h |
| 6 | Décision devise et formulation TVA | direction + comptable | — |
| 7 | B1 הצהרת נגישות + correction du contraste | dev + juriste | 0,5 j |
| 8 | B5, CGU et confidentialité | עורך דין ישראלי | externe |
| 9 | FAQ Israël et compléments par secteur | rédaction | 0,5-1 j |

Seuil de publication recommandé : actions 1 à 7 faites, 8 engagée.

## Mise à jour du 7 octobre 2026 (après les correctifs de `main`)

Les commits `6b45f8b`, `5626c11` et `8c8a071` ont corrigé une grande partie des constats ci-dessus : contradiction sur le numéro, référence française, contresens, terminologie, genre de נועה, isolation des codes, contraste, page d'accessibilité. Un nouveau bloquant commun à toutes les langues est apparu depuis : la page Cookies dit encore qu'aucun cookie de mesure d'audience n'est déposé, alors que GA4 est chargé depuis le commit `9f7cbeb`. Sur mobile, la bulle du widget empêche aussi de répondre au bandeau cookies. Voir [`../audit-transverse.md`](../audit-transverse.md), points T1 et T2.

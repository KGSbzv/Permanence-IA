# Audit pré-publication — version française (www.permanenceia.com)

Audit du 7 octobre 2026. Il couvre :

- les 80 URL françaises sur le site en ligne, en desktop et en mobile ;
- une relecture intégrale de `src/i18n/content/fr/**`, environ 4 100 lignes ;
- les pages légales telles qu'elles s'affichent en ligne ;
- les chaînes de texte écrites en dur dans le code ;
- la base de connaissances de l'agent vocal (`kb/fr*.txt`).

Le français est la langue source du site : chaque défaut corrigé ici doit aussi être répercuté dans les autres langues.

- Constats communs à toutes les langues : [`../audit-transverse.md`](../audit-transverse.md)
- Détail ligne par ligne : `annexes/` (environ 280 corrections)
- Captures d'écran : `captures/`

## Verdict

**Le site n'est pas prêt à publier en l'état.** La langue est très bonne : vouvoiement constant, peu de fautes, jargon métier juste, 14 secteurs et 14 modules cohérents. Les blocages sont juridiques (cookies, LCEN, RGPD) et techniques (bandeau cookies inutilisable sur mobile). Corriger les points bloquants et majeurs demande 1 à 2 jours de développement et de rédaction, plus une validation par un avocat français.

## 1. Bloquants

| # | Constat | Source | Correctif |
|---|---|---|---|
| B1 | La page `/cookies` affirme qu'aucun cookie de mesure d'audience n'est déposé, alors que GA4 est chargé (voir T1 de l'audit transverse). | `fr/ui/pages.ts:764-765` | Réécrire la page avec la liste réelle des cookies. Ajouter Google aux destinataires dans la page confidentialité. |
| B2 | Sur mobile, la bulle du widget recouvre le bouton « Accepter » du bandeau cookies : le toucher ouvre le chat (`captures/fr-mobile-tap-Accepter.png`). | `globals.css`, `ConsentBanner.tsx:26` | Faire passer le bandeau au-dessus de la bulle (z-index). |
| B3 | Mentions légales non conformes à la LCEN : le directeur de la publication n'est pas nommé, aucun numéro de téléphone n'est donné pour l'éditeur, et la liste des hébergeurs est incomplète (l'hébergeur de l'espace client et des agents manque). | `fr/ui/pages.ts:697-718` | Nommer une personne physique, ajouter un numéro (celui de l'agent IA convient) et compléter les hébergeurs avec leurs coordonnées. |
| B4 | Aucun représentant UE (art. 27 RGPD). Les CGU font prévaloir la version anglaise. | voir T3, T4 | — |

## 2. Majeurs

**Typographie (systémique)**
- Aucune espace insécable dans tout le français, ni dans le contenu ni au rendu : environ 560 cas de « : ; ! ? », de guillemets « » et de montants comme « 1 000 USD » qui peuvent se couper en fin de ligne.
- Correctif : un filtre de rendu propre au français (U+202F avant ; ! ? et à l'intérieur des « » ; U+00A0 avant : et %, et dans les nombres), avec un test qui le vérifie.

**UI/UX**
- Entre 1024 et 1279 px, le bouton « Essai gratuit 14 jours » sort de l'en-tête et provoque un défilement horizontal (`Navbar.tsx:73-76`, `captures/fr-desktop1024-header.png`).
- Les numéros belges ou suisses saisis au format national (« 0470… », « 079… ») sont convertis en +33 : l'agent appellerait alors un inconnu en France (`lib/server.ts:75-90`).
- La page d'inscription `app.permanenceia.com/register` est en anglais.
- Le widget subit des limitations de débit (erreurs 429) et disparaît sans message.
- La déclaration d'accessibilité ne suit pas le format RGAA : il manque les voies de recours, et elle annonce des « contrastes renforcés » alors que des textes restent à 2,97:1.

**Juridique et marché**
- **Démarchage**
  - Il manque les plages horaires légales (lundi à vendredi, 10 h-13 h et 14 h-20 h), le plafond de 4 sollicitations par 30 jours et l'article L34-5 du CPCE.
  - L'exemple de campagne « 9 h–12 h » tombe hors des horaires légaux.
  - L'affirmation « Bloctel a disparu » est trop catégorique.
  - Les règles belges, suisses et canadiennes manquent (« Ne m'appelez plus », LCD, LNNTE).
- **CGV B2B**
  - L'indemnité forfaitaire de 40 € n'est pas chiffrée (L441-10 C. com.).
  - La prescription de 3 mois est trop courte : le minimum est d'un an (art. 2254 C. civ.).
  - Le plafond de 1 000 USD et l'arbitrage AAA sont fragiles.
  - Le mot « HT » ne précise pas l'autoliquidation de la TVA.
- **Données de santé** (dentaire, kiné, médecine esthétique) : rien n'est dit sur l'hébergement HDS (CSP L1111-8), et la question de FAQ « Où sont conservées les données ? » reste sans réponse.
- **Consentement au rappel** : il est lié à l'acceptation des CGU dans une case unique. Il faut deux cases (art. 7 RGPD).
- **Variables juridiques mal insérées dans le texte**
  - « conformément au Règlement (UE) 2016/679 (RGPD) et loi Informatique et Libertés » : il manque « à la ».
  - « Tribunal compétent du comté de Laramie » : majuscule fautive et pléonasme.
- **Contradictions de fond**
  - Accord de traitement des données (DPA) « sur simple demande » sur une page, mais réservé au forfait Sur mesure dans les CGU.
  - Annonce « assistant IA » présentée comme désactivable, ce qui contredit l'AI Act art. 50.
  - « Treize modules » au lieu de 14.
  - L'e-commerce apparaît « hors liste » alors qu'il fait partie des secteurs.
  - Le site dit tantôt 30, tantôt 80 langues.
  - Des maquettes montrent un « numéro local France / Belgique » alors qu'aucun numéro français n'est en vente.
- **Téléphonie France**
  - Rien n'est dit sur l'impossibilité d'acheter un numéro français, sur le MAN (blocage des appels venus de l'étranger qui affichent un numéro français) ni sur les tranches ARCEP réservées aux automates d'appel.
  - La procédure d'import Twilio/Telnyx est probablement obsolète : il faut la comparer à l'assistant « Import a number ».
- **Prénom de l'assistante** : il varie entre Jade (site), Léa (base de connaissances) et Lucie (e-mail de code). Il faut en choisir un.
- **Exemple d'accueil des guides** : « Julie à l'appareil » ne dit pas que c'est une IA.

## 3. Mineurs (détail dans les annexes)

- Anglicismes à remplacer :
  - « en live » → « en direct » ;
  - « Réclamez vos 30 minutes » → « Profitez de » ;
  - « Ressources & Insights » ;
  - « opt-out ».
- Fautes ponctuelles :
  - « Préférez être accompagné ? » → « Vous préférez… ? » ;
  - « Horaires… répondus » ;
  - « que nous ne pouvons pas prouver ».
- Le nom du secteur s'insère en minuscules dans la phrase (« Pour services à domicile… ») : il faut une tournure adaptée.
- Le 9 octobre 2026 est cité comme un jeudi dans la base de connaissances : c'est un vendredi.
- Le SMIC affiché (1 867 €) est à vérifier.
- Certains titles et meta descriptions sont hors gabarit.
- Les séparateurs de title ne sont pas homogènes.
- Apostrophes droites et typographiques mélangées dans les mentions légales.

## 4. Manques recommandés

1. **Une FAQ sur les points suivants :**
   - numéro français et portabilité ;
   - prix en USD et frais de change ;
   - autoliquidation de la TVA et facturation électronique (e-reporting côté acheteur) ;
   - lieu d'hébergement des données et contrat de sous-traitance ;
   - enregistrement des appels ;
   - accents et bruit de fond ;
   - AI Act.
2. Citer les outils métier que les clients utilisent vraiment : Doctolib, Planity, Zenchef/TheFork, ou dire honnêtement qu'il n'existe pas de connecteur.
3. Ajouter un encadré unique sur le démarchage (France, Belgique, Suisse, Canada) dans le guide « Qui pouvez-vous faire appeler ».
4. Renommer certains secteurs :
   - « Services à domicile » → « Artisans et dépannage » ;
   - « Dentaire et cliniques » → « Cabinets dentaires et centres de santé ».

## Plan d'action

| Ordre | Action | Effort |
|---|---|---|
| 1 | B1 cookies, B2 z-index du bandeau | 2 h |
| 2 | B3 mentions LCEN, B4 représentant UE et clause de langue | 0,5 j + juriste |
| 3 | Filtre typographique français | 2-3 h |
| 4 | En-tête 1024-1279 px, normalisation des numéros BE/CH | 2 h |
| 5 | Contradictions (13→14, e-commerce, 30/80 langues, DPA, numéro local, prénom de l'assistante) | 2 h |
| 6 | Démarchage, CGV, HDS, FAQ | rédaction 1 j + avocat |

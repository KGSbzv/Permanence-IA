# Vérification des audits du 7 octobre 2026

Les audits (`audits-permanenceia.zip` : transverse, FR, IT, PL, NL, HE) ont été vérifiés point par point sur le code actuel de `main` (commit 7783da2) et, quand c'était utile, sur le site en ligne.

Dans chaque section :
- **VRAI** : constat juste, à corriger dans le code ou les textes.
- **DÉCISION** : relève de vous, d'un avocat ou d'un expert-comptable.
- **FAUX ou déjà corrigé** : rien à faire.

## Bilan

| Langue | VRAI à corriger | Déjà corrigé | Faux ou acceptable | Décision |
|---|---|---|---|---|
| Transverse (T1–T23) | 17 | 0 | 0 | 6 (T3, T4, T9, T10, T11, T18) |
| Français | ≈ 60 | 5 | 1 | ≈ 22 |
| Italien | ≈ 75 (12 majeurs) | 2 | 9 | 12 |
| Polonais | ≈ 52 (21 majeurs) | 1 | 6 | 7 |
| Néerlandais | ≈ 45 lignes (≈ 90 occurrences) | 0 | 11 | 5 |
| Hébreu | 20 | 21 groupes (5 bloquants levés) | 5 | 8 |

**Conclusion.** Les audits sont sérieux et, pour l'essentiel, justes. Seule une petite partie des constats est fausse, ou porte sur une forme simplement discutable.

L'audit hébreu précédent a bien été traité : ses 5 bloquants sont levés. Les autres langues n'avaient jamais été relues en profondeur, d'où le nombre de constats.

## Transverse : constats vérifiés

| # | Verdict | Commentaire |
|---|---|---|
| T1 Page Cookies fausse depuis GA4 | **VRAI, urgent** | La page dit qu'aucun cookie de mesure n'est déposé ; Google Analytics manque dans les destinataires ; `ad_*` passe à « granted » alors que la politique dit « pas de publicité ». |
| T2 Bulle du widget au-dessus du bandeau cookies (mobile) | **VRAI, urgent** | Bandeau en `z-[60]`, bulle en `z-index:70`. On ne peut pas refuser les cookies sur mobile. |
| T3 Représentant UE (art. 27 RGPD) | DÉCISION | Service payant à prévoir. |
| T4 « La version anglaise prévaut » | DÉCISION (avocat) | Il faudrait aussi qu'une version anglaise existe et fasse foi. |
| T5 « Treize modules » au lieu de 14 | VRAI | FR, IT, PL, NL. |
| T6 E-commerce cité comme secteur « hors liste » | VRAI | Alors que c'est l'un des 14 secteurs. |
| T7 DPA « sur simple demande » ou « forfait Sur mesure » | VRAI | Une formule unique : « DPA intégré aux CGU, version signée sur demande ». |
| T8 E-mail de confirmation promis après une demande de rappel | VRAI | Rien n'est envoyé au visiteur : envoyer l'e-mail ou retirer la promesse. |
| T9 CGU de modèle américain (AAA, plafond, 3 mois, 1,5 %) | DÉCISION (avocat par pays) | — |
| T10 « HT » en USD sans explication de l'autoliquidation | DÉCISION (comptable) | — |
| T11 Appels sortants vers « ses propres clients » présentés comme sûrs | DÉCISION (avocat), risque élevé | Les textes peuvent être prudents dès maintenant. |
| T12 Exemples d'accueil sans annonce IA (« Julie à l'appareil », « Giulia ») ; « parfaitement humain » | VRAI | AI Act, art. 50. |
| T13 FAQ « Où sont conservées les données ? » sans lieu | VRAI | « EEE et/ou États-Unis », déjà fait en hébreu. |
| T14 Personas Jade, Daan, Katie… sur toutes les langues | VRAI | Ordre et prénoms par marché. |
| T15 Créneau envoyé à l'agent en français (« Demain matin ») | VRAI (en partie corrigé) | — |
| T16 « Numéro français » dans les bases NL et PL | VRAI (mineur) | — |
| T17 Calculateur polonais qui affiche une perte (−49 $) | VRAI | Contre-productif sur la page tarifs. |
| T18 Slugs en français (`/it/prezzi` en 404) | DÉCISION SEO | Avec redirections 301 si on change. |
| T19 Libellés incohérents (« Calls », `{customer_name}`, 30 ou 80 langues, liste de blocage ou d'exclusion) | VRAI | — |
| T20 Numéro belge ou suisse au format national converti en +33 | **VRAI, risque réel** | L'agent appellerait un inconnu en France. Ajouter un sélecteur de pays. |
| T21 Motif du champ téléphone ignoré par Chrome | VRAI | Parenthèses non échappées. |
| T22 Widget Autocalls : erreurs 429 en rafale | VRAI, hors site | Limite côté Autocalls. |
| T23 Image de partage en français sur toutes les langues ; inscription de l'app en anglais | VRAI (image) ; DÉCISION (app) | — |

## Par langue : points majeurs confirmés

### Français
- **En-tête :** il déborde entre 1024 et 1279 px.
- **Typographie :** aucune espace insécable ; 173 cas sur la seule page légale.
- **Accessibilité :** la déclaration n'a pas de rubrique « voies de recours » et affirme des contrastes conformes alors qu'ils ne le sont pas.
- **Page Sécurité :** titre en double.
- **Robots :** Google est redirigé vers /it selon la langue (le filtre des robots ne marche pas en production).
- **Base de connaissances :** « marque blanche » à retirer ; le 9 octobre 2026 est un vendredi, pas un jeudi.
- **Agenda :** le site dit « Google, Outlook en direct », alors que l'app passe par Cal.com ou Calendly.
- **Numéros :** « 1 / 3 / 10 numéros » se lit comme inclus dans le forfait.
- **Démarchage :** le guide donne l'exemple 9 h–12 h, hors des plages légales.
- **Formulaire :** consentement au rappel et CGU réunis dans une seule case ; il faut 2 cases.
- **SMIC :** le montant cité est à vérifier.

### Italien
- **Affichage :** les nombres changent entre le serveur et le navigateur (1000 → 1.000), d'où une erreur de rendu React.
- **FAQ :** question sur les minutes épuisées en double.
- **Politesse :** mélange tu / voi / Lei (« Fate squillare il mio telefono », « Lascia il Suo numero »…).
- **Secteurs :** noms mal insérés dans les phrases (« Agente studi dentistici e cliniche »).
- **Vocabulaire :** « presa di appuntamenti » est un calque ; « elimina i limiti » est faux.
- **Exemples sans annonce IA :** l'accueil « Giulia » et le dialogue des assurances.

### Polonais
- **Textes juridiques :** les variables (`privacyLaw`…) donnent des phrases agrammaticales.
- **Pluriels :** faux selon le nombre.
- **Registre :** mélange Ty / Państwo, aggravé par les nouveaux textes WhatsApp.
- **Prospection :** la relance des « propres clients » contredit l'art. 398 PKE.
- **Contresens :** quatre au total, par exemple « nie może być już używany w WhatsAppie ».
- **Base de connaissances :** entièrement au féminin alors qu'une voix masculine existe.

### Néerlandais
- **Mobile :** débordement horizontal (boutons insécables, longs titres).
- **Belgicismes :** « Goedendag », « verwittigen », « voorzie », « vertrekken vanuit ».
- **Vocabulaire :** « massagesalons » a une connotation érotique ; « betaalkaart » désigne la carte de débit (pinpas).
- **Marque :** la tagline dit « AI-telefonieassistent » au lieu de « AI-telefoonassistent ».
- **Base de connaissances :** « Hij zegt het alarmnummer te bellen » est ambigu.
- **Données structurées :** elles annonçaient « French ».

### Hébreu
- **Accord en genre :** נועה apparaît au-dessus de titres au masculin (סוכן סינון לידים, סוכן מעקב, סוכן AI ל…).
- **Défilement :** les dégradés des onglets sont du mauvais côté en RTL.
- **Langues :** la frise commence encore par le français et ses variantes.
- **Base de connaissances :** une référence au droit français ; « ותיקים » à corriger.
- **Guides :** `cal_live_` mal isolé à l'affichage.
- **Accessibilité :** coordinateur nommé requis par la תקנה 35, à décider.

## Décisions à prendre (avocat, comptable, vous)

1. **Représentant UE** (art. 27 RGPD) et **version des CGU qui fait foi**.
2. **CGU par pays :** arbitrage AAA, plafond de 1 000 USD, prescription de 3 mois, intérêts de 1,5 % par mois, clauses vexatoires en Italie, entrepreneurs individuels en Pologne, contrats types en Israël.
3. **TVA, autoliquidation et facturation électronique** par pays (France e-reporting, Italie SDI/TD17, Pologne KSeF, Pays-Bas btw verlegd, Israël מע״מ). Formulation à valider par un comptable.
4. **Démarchage téléphonique :** formulations par pays (L34-5 et opt-in en France, art. 130 en Italie, art. 398 PKE en Pologne, art. 11.7 Tw aux Pays-Bas, סעיף 30א en Israël).
5. **Données de santé (HDS)** et nom du sous-traitant principal.
6. **Directeur de la publication :** personne physique ; et le numéro WhatsApp vaut-il numéro de contact légal ?
7. **SEO :** slugs par langue et `x-default`.
8. **Marque :** nom du forfait « Assistant » en polonais et en italien ; prix en EUR ou ₪ plutôt qu'en USD.

## Ordre de correction proposé (sans décision juridique)

1. **Urgent :** T1 (page Cookies, Google Analytics, `ad_*` refusés), T2 (bandeau au-dessus de la bulle), T20 (sélecteur de pays pour le téléphone), T21 (motif du champ téléphone), hydratation italienne, débordement mobile NL et FR.
2. **Faits et cohérence :** 14 modules, e-commerce, DPA, e-mail promis, 30 ou 80 langues, lieu des données, numéros « inclus », agenda Cal.com, date du 9 octobre, « marque blanche », annonce IA dans les exemples, personas par marché.
3. **Langue :** registre IT et PL, pluriels PL, variables juridiques PL et IT, belgicismes NL, genre HE, typographie FR, bases de connaissances (IT, PL, NL, HE).
4. **Interface :** contrastes, en-tête 1024 px, dégradés RTL, titres en double, données structurées par langue (fait le 7 octobre avec la ligne britannique).

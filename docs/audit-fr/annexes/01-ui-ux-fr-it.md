# Audit pré-publication FR et IT, phase 1 (UI/UX, navigation, technique front)

Audit réalisé en ligne le 2026-10-07, entre 07:10 et 08:30 UTC, sur https://www.permanenceia.com (FR, sans préfixe) et https://www.permanenceia.com/it.

**Méthode**
- Playwright Chromium en 1440x900 et 390x844, avec en plus 360x740 et 1024/1100/1280 pour certains contrôles.
- `Accept-Language` réglé sur fr-FR puis it-IT, curl, et axe-core 4.14 (WCAG 2.0/2.1/2.2 A et AA) sur 10 pages clés par locale.
- Requêtes espacées d'au moins 550 ms.
- Aucun formulaire n'a été soumis : tous les POST `/api/**` étaient interceptés et annulés.

**Attention, le site a changé pendant l'audit.** Trois builds se sont succédé : `vpQHjW…`, puis `mnXxLE…` (commits 6b45f8b et 5626c11, vers 07:41 UTC), puis `XUkGV4F…` (commit 8c8a071, conversion €/CHF indicative). Les constats ci-dessous ont été revérifiés sur le dernier build : le crawl complet des 2×80 URL a tourné sur `mnXxLE…`, puis des contrôles ciblés ont été faits sur `XUkGV4F…`. Les numéros de ligne renvoient à `origin/main` (5626c11 et 8c8a071) : la branche locale `claude/hebrew-site-audit-auk78b` est en retard sur ce qui est en ligne. Un `git fetch` a été lancé ; il ne touche que `.git`, et aucun fichier du dépôt n'a été modifié. Le sitemap compte désormais 80 URL par locale, avec `/accessibilite` en plus.

**Fichiers**
- Scripts : `crawl.js`, `an1.js`, `an2.js`, `lang.js`, `shots.js`, `interact.js`, `overlap.js`, `click.js`, `header.js`, `wrap.js`, `recheck.js`, `axe.js`, `axe2.js`, `ga.js`, `app.js`, `phone.ts`, `hyd.js`.
- Données : `crawl-fr.json`, `crawl-it.json` (build `mnXxLE…`), et l'ancien build dans `v1/`.
- Journaux : `interact-*.log`, `axe-*.log`.
- Captures : `shots/`. Les noms en `*-nc.png` ont été pris sans bandeau cookies (cookie `pia_consent=denied` posé). `shots/v1/` contient les captures FR de l'ancien build.

## Points de l'audit hébreu : s'appliquent-ils ?

| Point HE | FR | IT |
|---|---|---|
| Widget Autocalls qui recouvre des éléments sur mobile | **Oui, en pire** : il couvre le bouton « Accepter » du bandeau cookies (B1). La barre CTA collante n'est pas touchée. | **Oui, en pire** : à 360 px, il couvre **« Accetta » et « Rifiuta »** (B1). |
| 429 sur `/api/widget-config` | Oui : 40 chargements sur 160 sans widget (M3). | Oui : 18 sur 160 (M5). |
| Contraste `.kw` à 2,79:1 | **Corrigé** : #0A7690 sur #F5F8FB donne 4,92:1. Il reste d'autres textes en turquoise #0FA3C4 à 2,97:1 (m1). | Idem, corrigé, avec les mêmes restes (m6). |
| Prix uniquement en USD | Partiellement corrigé : facturation en USD, avec « ≈ 88 € · ≈ 82 CHF » indicatif (M4). | Facturation en USD, avec « ≈ 88 € » indicatif (M4). |
| Personas Jade/Daan/Katie | Oui : l'équipe affiche Jade, Daan, Katie, Jack, Manuela et Tomasz (m7). | **Oui, incohérent** : l'équipe affiche « Jade — Receptionist AI », alors que la voix et le widget IT sont Manuela et Marco (m9). |
| Email OTP bilingue FR/EN | Le code (`api/agent/account.ts:113-128`) choisit la langue d'après `b.lang`. Sans `lang`, l'email part en FR+EN. | Il est en italien seulement si l'outil de l'assistante IT (21208) envoie `lang=it`. Je n'ai pas pu le vérifier sans déclencher d'email. **À vérifier.** |
| Ordre des langues de la démo | Conforme : « Français » en premier. | Conforme : « Italiano » en premier (`tiles/it-mobile-demo-full-nc-t0.png`). |

---

# SECTION FR (https://www.permanenceia.com/…)

## Bloquant

### B1. Sur mobile, le widget empêche de répondre au bandeau cookies
- **URL** : toutes les pages, à la première visite, sur mobile.
- **Constat** : la bulle fermée du widget est une iframe `title="Voice Assistant Widget"` en `z-index:70`. Elle se trouve au-dessus du bandeau de consentement (`z-[60]`).
  - En 390x844, `elementFromPoint` sur « Accepter » renvoie `IFRAME` aux trois points testés, et « Refuser » est couvert à 2 points sur 3.
  - En 360x740, « En savoir plus » est aussi couvert.
  - Toucher « Accepter » **ouvre la conversation avec Jade**, et le bandeau reste affiché.
- **Preuve** : `shots/fr-mobile-tarifs-top.png`, `shots/fr-mobile-home-top.png` et `shots/fr-mobile-tap-Accepter.png` (le chat s'ouvre à la place). Mesures : iframe [93,663 → 390,760], bandeau [12,531 → 378,756].
- **Risque** : le choix de consentement ne peut pas être exprimé librement (exigences CNIL sur le bandeau) et la première impression est dégradée.
- **Source** : `src/components/ConsentBanner.tsx:26` (`z-[60]`) et `src/styles/globals.css:45-48` (`z-index: 70 !important` sur la bulle).
- **Correctif** : passer le bandeau au-dessus de la bulle (`z-[75]`), ou masquer la bulle tant que `readConsent()` est vide (classe sur `<html>` + `iframe[src*="/web-widget/"]{display:none}`). Une autre option est de remonter le bandeau sur mobile (`bottom-[11rem]`).

## Majeur

### M1. Entre 1024 et 1279 px, le bouton principal de l'en-tête est coupé et la page défile horizontalement
- **URL** : toutes les pages FR, à la largeur lg (ordinateurs 13", tablettes en paysage).
- **Constat** : en 1024 et 1100 px, `scrollWidth` vaut 1143. Le bouton « Essai gratuit 14 jours » s'étend de 943 à 1143 px et sort de l'écran. En IT, il n'y a pas de débordement (« Inizi gratis » est plus court). À 1280 px et au-delà, c'est correct.
- **Preuve** : `shots/fr-desktop1024-header.png` et `shots/fr-desktop1100-header.png` (sortie de `header.js`).
- **Source** : `src/components/Navbar.tsx:73-76` (sélecteur de langue large, « English (Australia) », + Connexion + CTA) et `src/i18n/content/fr/ui/components.ts:30` (`startFree: 'Essai gratuit 14 jours'`).
- **Correctif** : afficher la navigation desktop à partir de `xl:` au lieu de `lg:`, ou réduire le sélecteur à `fr ▾` et mettre un libellé court pour lg (« Essai gratuit »).

### M2. Un numéro belge ou suisse saisi au format national est converti en numéro français : l'agent IA appellerait un inconnu en France
- **URL** : /contact, /demo, le modal « Être rappelé » et /essai-gratuit.
- **Constat** : le navigateur accepte `0470 12 34 56` (mobile belge) et `079 123 45 67` (mobile suisse). Le serveur les transforme ensuite :
  - `toE164('0470 12 34 56','fr')` donne `+33470123456`, et `isAutoCallable` renvoie **true** ;
  - `079 123 45 67` donne `+33791234567`, **true** également.

  Le marché FR vise explicitement la « France et francophonie » (`localCurrencies: ['EUR','CHF']`). Aucune aide n'indique de saisir l'indicatif : le message d'erreur cite seulement « par exemple 06 12 34 56 78 ».
- **Preuve** : `phone.ts` (copie de la logique serveur) et `interact-fr.log` (tous les formats sont valides côté client).
- **Source** : `src/lib/server.ts:75-90` (`DIAL.fr = 33`), `src/components/ui.tsx:175` et `src/pages/essai-gratuit.tsx:86`.
- **Correctif** : ajouter un sélecteur de pays (FR/BE/CH/LU/MC, prérempli selon `Accept-Language`, par exemple fr-BE donne BE), ou une aide « Hors France, indiquez l'indicatif (+32, +41) ». Côté serveur, refuser un numéro national ambigu quand le pays n'est pas fourni.

### M3. Rate limit 429 du widget : sans le widget, l'assistante de vente disparaît sans avertissement
- **URL** : 40 des 160 chargements FR (desktop et mobile), à environ 1,8 page/s. Exemples : /aide/guides/whatsapp, /aide/guides/widget-site-web.
- **Constat** : `429 https://app.permanenceia.com/api/widget-config`, suivi en console de « Voice Assistant Widget: Failed to fetch config, widget will not load ».
- **Preuve** : `crawl-fr.json`, champs `cons` et `bad`.
- **Source** : côté app (Autocalls `embed.js` / `api/widget-config`). Côté site, `src/components/Layout.tsx:85`.
- **Correctif** : relever la limite ou la compter par session plutôt que par IP (cas des NAT d'entreprise). Mettre la config en cache (`Cache-Control`/CDN) et ajouter un nouvel essai avec délai dans `embed.js`.

### M4. Des prix facturés en dollars pour le marché français
- **URL** : /tarifs, /offres/*, les blocs prix de /fonctionnalites/* et /secteurs/*, et l'accueil.
- **Constat** :
  - Les prix sont affichés « 99 $ HT / mois ». La note dit : « Prix en dollars US (USD), hors taxes — taxes locales en sus si applicables ».
  - Depuis 8c8a071, un équivalent indicatif s'affiche sous chaque prix : « ≈ 88 € · ≈ 82 CHF » (taux BCE du 6 octobre). Il est calculé **côté client** et absent du HTML rendu par le serveur ; le JSON-LD reste en `priceCurrency: USD`.
  - « $ » seul est ambigu pour un visiteur québécois, pour qui fr-CA signifie CAD.
  - La mention HT est présente partout (bandeau, cartes, tableau, pied de page), ce qui est conforme.
- **Preuve** : `shots/fr-desktop-tarifs-fx.png` et `shots/fr-desktop-tarifs-top-nc.png`.
- **Source** : `src/i18n/markets.ts` (`currency: 'USD'`), `src/i18n/index.tsx:50-51` et `src/components/blocks.tsx:287`.
- **Correctif** : à terme, des forfaits en EUR (dans `autocallsPlanIds` par marché). En attendant, écrire « 99 $ US » ou « 99 USD ». Décision commerciale et juridique, à confirmer en phase 2 (TVA intracommunautaire et autoliquidation pour un vendeur américain).

### M5. Après « Créer mon compte », l'inscription se fait sur une page en anglais
- **URL** : `https://app.permanenceia.com/register` (lien de /essai-gratuit).
- **Constat** : formulaire « Sign up », « Name », « Password », « I agree to the terms and conditions ». En-tête bilingue « Espace client · Customer area ». La déclaration d'accessibilité le reconnaît : « L'espace client est en anglais ».
- **Preuve** : `shots/fr-app-register.png`.
- **Source** : white-label Autocalls (hors dépôt).
- **Correctif** : activer la traduction française de l'app, ou au minimum annoncer « interface en anglais » avant le clic, sur /essai-gratuit.

### M6. La déclaration d'accessibilité ne suit pas le format RGAA
- **URL** : /accessibilite (nouvelle page, liée dans le pied de page sur les 80 pages, ce qui est conforme).
- **Constat** :
  - La page se réfère aux « WCAG 2.1 AA », et non au RGAA 4.1.
  - Il n'y a ni taux de conformité, ni liste des pages de l'échantillon, ni environnement de test.
  - **La rubrique « Voies de recours » (Défenseur des droits), obligatoire, manque.**
  - Elle affirme « Contrastes renforcés », alors que axe trouve encore des contrastes à 2,97:1 (m1), et une « vérification… lecteur d'écran », alors que le bandeau est inutilisable sur mobile (B1).
- **Contexte** : European Accessibility Act applicable depuis le 28/06/2025 (loi 2023-171, décret 2023-931), avec exemption des microentreprises pour les services. À valider en phase 2 selon la taille de SINAY STRATEGIC LLC.
- **Source** : `src/pages/accessibilite.tsx` et `src/i18n/content/fr/ui/pages.ts` (bloc accessibilité).
- **Correctif** : suivre le modèle de déclaration RGAA (état de conformité, résultats des tests, contenus non accessibles, dérogations, établissement, retour d'information, voies de recours).

## Mineur

### m1. Contrastes encore insuffisants (axe, WCAG 1.4.3)
- **URL** : /, /demo, /secteurs/immobilier, /fonctionnalites/receptionniste-ia, /offres/assistant.
- **Constat** :
  - « Étape 1-4 » en #0FA3C4 sur blanc, à 2,97:1 ;
  - bouton maquette « Parler à l'agent » en blanc sur #0FA3C4, à 2,97:1 ;
  - mention « Votre navigateur vous demandera l'accès… » en `text-white/45`, à 4,47:1 ;
  - badges « Démo » et « Réservé » en vert sur fond `bg-ok/10`, à 4,23:1.
- **Preuve** : `axe-fr.log`.
- **Source** :
  - « Étape » : `src/components/blocks.tsx:127` ;
  - bouton maquette : `src/components/Mock.tsx:214` ;
  - mention navigateur : `src/components/LiveDemo.tsx:485,507` ;
  - badges : `Mock.tsx:189` et `extras.tsx:341`.
- **Correctif** : `text-signal-deep`, `bg-signal-deep`, `text-white/60` et une teinte verte plus foncée.

### m2. Débordement horizontal sur mobile
- **URL** : /aide/guides/outils-sur-mesure.
- **Constat** : `scrollWidth` vaut 406 pour 390. En cause, le `<bdi dir="ltr">` qui contient `https://api.exemple.com/commandes/{order_id}`. Le bouton collant « Être rappelé » est poussé à 394 px.
- **Preuve** : `shots/fr-mobile-guide-outils-sur-mesure-overflow.png`.
- **Source** : `src/components/Guides.tsx:53` (introduit par 5626c11).
- **Correctif** : `className="[overflow-wrap:anywhere]"` sur le `bdi`.

### m3. Boutons des cartes de prix sur deux lignes en 1440
- **Constat** : « Choisir Réceptionniste », « Choisir Centre d'appels » et « Démarrer l'essai de 14 jours » passent sur 2 lignes (hauteur 61 px contre 37 px pour « Choisir Assistant »). Concerne 16 à 20 pages (accueil, /tarifs et blocs prix des fonctionnalités).
- **Preuve** : `shots/fr-desktop-wrap-Choisir_R_ce.png`.
- **Correctif** : libellés courts (« Choisir », « Essai 14 j ») ou `whitespace-nowrap text-sm` sur la grille à 5 colonnes.

### m4. Titles trop longs, description trop courte
- **Constat** : /fonctionnalites/campagnes-sortantes fait 62 caractères, /fonctionnalites/qualification-des-leads 63. La meta description de /cookies fait 55 caractères.
- **Source** : `src/i18n/content/fr/ui/commerce.ts:69-70` et `ui/pages.ts:760`.

### m5. Texte tronqué dans la maquette de scénario
- **URL** : /, /demo.
- **Constat** : « Demande créée : Fuite sous évier » est tronqué (`scrollWidth` 195 pour une largeur visible de 129).
- **Source** : `src/components/ScenarioExplorer.tsx:123` (`truncate`).

### m6. Restes d'anglais
- **Constat** :
  - attribut `title="Voice Assistant Widget"` sur l'iframe du widget, sur 76 à 80 pages (lu par les lecteurs d'écran) ;
  - guides et tarifs qui citent l'app en anglais (« Add credits », « Get new phone number », « Create Mid-Call Tool ») ;
  - rubrique « Leads ».

  C'est cohérent avec l'app en anglais (M5).
- **Source** : `embed.js` (app) et `src/i18n/content/fr/guides.ts`.

### m7. Personas de l'équipe d'agents
- **Constat** : la section équipe montre Jade, Daan, Katie, Jack, Manuela et Tomasz. La note dit « Jade, Daan, Katie et leurs collègues… », alors que la démo et le widget FR présentent Jade et Hugo.
- **Source** : `src/components/extras.tsx` (`AgentTeam`) et `src/i18n/content/fr/ui/components.ts:421`.

### m8. Le formulaire d'essai n'a pas de message d'erreur téléphone personnalisé
- **URL** : /essai-gratuit.
- **Constat** : le champ téléphone n'a ni `pattern` ni message personnalisé. Le navigateur affiche son message générique (« Please lengthen this text… » dans un Chrome en anglais), alors que /contact et /demo affichent « Indiquez un numéro de téléphone valide… ».
- **Source** : `src/pages/essai-gratuit.tsx:86`.
- **Correctif** : reprendre `pattern` + `setCustomValidity`, comme `ui.tsx:175`.

### m9. Recouvrements sur desktop
- **Constat** : en 1440x900, la bulle masque le contenu de la carte « Sur mesure » sur /tarifs. À la première visite, le bandeau cookies couvre le CTA du hero (« Démarrer l'essai »).
- **Preuve** : `shots/fr-desktop-tarifs-top.png` et `shots/fr-desktop-cta-wrap.png`.

### m10. Redirections
- **Constat** :
  - Les robots ne sont pas exclus en production : `Googlebot`, `bingbot` et `facebookexternalhit` avec `Accept-Language: it-IT` reçoivent un **307 vers /it**, alors que `middleware.ts` prévoit une exception `BOT`. Soit l'user-agent n'arrive pas jusqu'au middleware, soit l'adaptateur App Hosting change le comportement. Un aperçu de partage (WhatsApp, LinkedIn) d'une URL FR peut ainsi afficher la version IT.
  - `http://www.permanenceia.com/it` redirige en 301 vers `https://www.permanenceia.com:443/it`, avec `:443` explicite dans l'en-tête Location.
- **Source** : `src/middleware.ts` et la configuration d'hébergement.

### m11. hreflang x-default
- **Constat** : `x-default` pointe vers la version FR, alors que le middleware envoie les langues inconnues vers /en-gb. C'est incohérent.
- **Correctif** : mettre `x-default` vers /en-gb, ou envoyer les langues inconnues vers FR.

## Suggestions
- Ajouter un numéro FR, comme en hébreu : /contact dit « Nous ne publions aucun numéro ». Ce serait la meilleure démo pour un produit de téléphonie.
- Google Analytics envoie un ping sans cookie avant consentement (`gcs=G100`, Consent Mode v2 avancé). Faire valider la position CNIL en phase 2.
- Hero desktop : le h1 est aligné en bas avec un grand vide au-dessus (`shots/fr-desktop-home-top-nc.png`).
- La page d'inscription affiche le logo FR (« AGENTS VOCAUX INTELLIGENTS ») pour tous les marchés (voir IT M3).

## Ce qui est conforme (FR)
- **Pages** : les 80 URL renvoient 200, sans redirection. `<html lang="fr">`. Title et description en français, sans doublon. Exactement un h1 par page. Aucune `<img>` sans alt.
- **Balises SEO** : canonical égal à l'URL, `og:url` égal au canonical, `og:locale=fr_FR`, `og:site_name` « Permanence IA ». hreflang complet (7 langues + x-default) et réciproque. JSON-LD valide (Organization, Product/Offer en USD avec `valueAddedTaxIncluded:false`, FAQPage, BreadcrumbList, HowTo).
- **Liens** : aucun lien interne cassé, aucune fuite vers une autre langue, aucune ancre morte, aucun lien hors sitemap (/blog, /docs, /kb). Liens externes : `app.permanenceia.com/login` et `/register`, `mailto:`. Il n'y a aucun `tel:`, ce qui est cohérent avec l'absence de numéro.
- **Redirections** :
  - / avec it-IT donne 307 vers /it, et /tarifs avec it-IT donne 307 vers /it/tarifs ;
  - fr-FR, fr-BE et « de-CH,fr » restent en FR ;
  - le cookie `NEXT_LOCALE=fr` l'emporte sur it-IT, et `NEXT_LOCALE=it` l'emporte sur fr-FR ;
  - le domaine nu renvoie 301 vers www, en conservant le chemin ;
  - /blog renvoie 307 vers /faq, `/offres` 308 vers /tarifs, et un slash final 308 vers l'URL sans slash ;
  - les 404 sont en français.
- **Clavier** : lien d'évitement « Aller au contenu » en premier élément focusable. Focus visible (outline 2px). Menus déroulants au clavier (`shots/fr-desktop-menu-dropdown.png`).
- **Menu mobile** : ouverture, sous-menus et Échap fonctionnent. `aria-label` « Ouvrir le menu » (`shots/fr-mobile-menu-open.png`, `fr-mobile-menu-submenu.png`).
- **Sélecteur de langue** : il conserve la page (/tarifs vers /it/tarifs, /secteurs/immobilier vers /en-gb/secteurs/immobilier).
- **Formulaires** :
  - messages d'erreur en français (« Indiquez un numéro… », « Cochez la case… », « Acceptez les conditions… ») ;
  - formats acceptés : 06/07, +33, 0033, +32 et +41 ;
  - « abc » et « 123 » sont refusés ;
  - les cases de consentement sont obligatoires ;
  - la barre CTA collante n'est pas recouverte.
- **Performance** : load médian de 1,06 s en desktop (p90 1,6 s) et 0,72 s en mobile. Aucune erreur JS, aucune erreur d'hydratation.
- **Marque** : « Permanence IA » partout (logo image, alt, title, og:site_name, footer « © 2026 Permanence IA — marque de SINAY STRATEGIC LLC », mentions). Aucune occurrence de « PermanenceIA » ou « PermanenceAI ».
- **Pied de page** : Gérer les cookies, Mentions légales, CGU/CGV, Confidentialité, Cookies, Accessibilité.

---

# SECTION IT (https://www.permanenceia.com/it/…)

## Bloquant

### B1. Sur mobile, le widget empêche de répondre au bandeau cookies, y compris pour refuser
- **URL** : toutes les pages /it, à la première visite, sur mobile.
- **Constat** :
  - En 390x844, « Accetta » est entièrement couvert par l'iframe du widget (3 points sur 3), « Rifiuta » à 2 points sur 3, et « Maggiori informazioni » aussi.
  - En **360x740, « Rifiuta » et « Accetta » sont entièrement couverts**.
  - Toucher « Rifiuta » **ouvre le chat de Manuela**, et le bandeau reste affiché.
- **Preuve** : `shots/it-mobile-home-top.png`, `shots/it-mobile360-tarifs-overlay.png` et `shots/it-mobile-tap-Rifiuta.png`.
- **Risque** : les lignes directrices cookies du Garante (10/06/2021) exigent que refuser soit aussi simple qu'accepter. Ici, refuser est impossible tant qu'on ne ferme pas le chat.
- **Source et correctif** : identiques à FR B1 (`ConsentBanner.tsx:26`, `globals.css:45-48`).

## Majeur

### M1. Erreurs d'hydratation React sur 36 des 80 pages IT : le rendu serveur est jeté
- **URL** : toutes les pages /it/fonctionnalites/*, /it/offres/*, /it/secteurs/* et /it/tarifs, en desktop et en mobile. Encore présent sur le build `XUkGV4F…`.
- **Constat** :
  - Erreurs `Minified React error #418`, `#425` et `#423`. #423 signifie que toute la racine bascule en rendu client.
  - Cause : Node, côté serveur (ICU 77), formate `it-IT` sans séparateur pour 4 chiffres (« 1000 », « 2300 », « 2490 $ »), alors que Chrome écrit « 1.000 », « 2.300 », « 2.490 $ ».
  - Conséquences : rendu client complet, donc un p90 de chargement à 4,1 s contre 1,6 s en FR, du clignotement, et Google indexe « 1000 min » quand l'utilisateur voit « 1.000 min ».
  - FR n'est pas touché (0 erreur).
- **Preuve** : `hyd.js` et `recheck.js` (FR : 0 erreur ; IT /tarifs : 20 erreurs). Différences entre serveur et client : « 1000 » / « 2.300 », « 1858 » / « 1.858 ».
- **Source** : `src/i18n/index.tsx:48` (`num`), `src/i18n/index.tsx:50-51` (`money`) et `src/components/blocks.tsx:479` (`approxMinutes(num(…))`). Probablement aussi `pl-PL`, à vérifier.
- **Correctif** : ajouter `useGrouping: 'always'` aux appels `toLocaleString` et `Intl.NumberFormat` (pris en charge par Node 22 et Chrome 106+), ou figer le format avec un formateur maison.

### M2. Slugs français dans les URL italiennes
- **URL** : /it/secteurs/immobilier, /it/fonctionnalites/prise-de-rendez-vous, /it/tarifs, /it/offres/centre-appels, /it/aide/guides/acheter-un-numero, etc. (80 URL).
- **Constat** :
  - Aucun slug n'est traduit : /it/prezzi et /it/settori/immobiliare renvoient 404.
  - Pour le SEO, on perd les mots-clés dans l'URL (« prezzi », « centralino », « settori »), le taux de clic baisse (URL en français visible dans les résultats Google) et la confiance des visiteurs en pâtit.
- **Source** : `src/pages/**` (routes uniques) et `src/pages/sitemap.xml.ts`.
- **Correctif** : slugs par langue (`rewrites` Next + table de correspondance utilisée par `Link`, hreflang et sitemap), avec 301 depuis les anciennes URL /it/… S'il est fait, le faire avant l'indexation.

### M3. L'inscription s'ouvre en anglais et en français, sous la marque FR
- **URL** : « Creare il mio account gratuito », qui mène à `https://app.permanenceia.com/register`.
- **Constat** : même avec le cookie `pia_lang=it` et it-IT, la page affiche « Sign up », « I agree to the terms and conditions », « Espace client · Customer area », « Gérez vos agents vocaux IA… », un pied de page « Mentions l… », le logo FR « PERMANENCE IA · AGENTS VOCAUX INTELLIGENTS » et le title « Register - Permanence IA ». La marque IT est pourtant « PermanenceIA ».
- **Preuve** : `shots/it-app-register.png`.
- **Correctif** : localiser l'app (au moins l'inscription et la connexion) et prévoir un logo par marché. Sinon, prévenir sur /it/essai-gratuit que l'interface est en inglese.

### M4. Prix en USD
- **Constat** :
  - Les prix sont affichés « 99 $ IVA esclusa / mese ». La mention IVA esclusa est présente partout, ce qui est conforme.
  - Il y a un équivalent indicatif « ≈ 88 € », calculé côté client, et la note « I piani sono fatturati in dollari USA ».
  - Pour une PME italienne : devise étrangère, frais de change, et facture d'une LLC américaine (pas de fattura elettronica SdI).
- **Preuve** : `shots/it-desktop-tarifs-top-nc.png`.
- **Correctif** : forfaits en EUR. Point à traiter en phase 2 (fiscal).

### M5. Rate limit 429 du widget
- **Constat** : 18 chargements sur 160, avec le même symptôme qu'en FR (M3).

## Mineur

### m1. Libellé du bouton de rappel sur deux lignes dans la barre mobile
- **URL** : toutes les pages /it, sur mobile.
- **Constat** : « Richieda una richiamata » passe sur 2 lignes dans la barre collante, qui fait 75 px contre 69 px en FR.
- **Preuve** : `shots/it-mobile-home-top.png`.
- **Source** : `src/i18n/content/it/ui/components.ts:9,86` et `Layout.tsx:48`.
- **Correctif** : « Mi richiami ».

### m2. Boutons des cartes de prix sur deux lignes en 1440
- **Constat** : « Scelga Receptionist », « Scelga Call Center » et « Parli con un esperto » passent sur 2 lignes. Le prix « Su preventivo » se coupe aussi en deux lignes.
- **Preuve** : `shots/it-desktop-wrap-Parli_con_un.png` et `it-desktop-tarifs-top-nc.png`.

### m3. Grille du formulaire /it/contact décalée
- **Constat** : le libellé « Chiamate ricevute al mese (facoltativo) » tient sur 2 lignes. Son select est donc plus bas que celui de « Quando possiamo richiamarLa? ».
- **Preuve** : `shots/it-desktop-contact-top-nc.png`.
- **Source** : `it/ui/components.ts:136`.
- **Correctif** : libellé plus court (« Chiamate/mese ») ou `items-end` sur la grille.

### m4. Mélange IA et AI
- **Constat** : la marque est « PermanenceIA », mais le slogan dit « Assistente telefonico AI ». Le texte parle d'« agente vocale AI » et de « Receptionist AI », tandis que le widget dit « la nostra assistente **IA** » et la note sur les personas « agenti **IA** virtuali ».
- **Source** : `it/ui/components.ts:423` et la configuration du widget 21208.
- **Correctif** : choisir AI (usage italien courant) et l'appliquer partout.

### m5. Noms de forfaits en anglais
- **Constat** : « Receptionist », « Assistant » et « Call Center ». « Assistant » n'est pas italien.
- **Source** : `src/i18n/content/it/offers.ts:18,26,34`.
- **Correctif** : « Assistente ».

### m6. Contrastes
- **Constat** : « Passo 1-3 » à 2,97:1, `text-white/45` à 4,47:1, et les mêmes composants qu'en FR m1.
- **Preuve** : `axe-it.log`.

### m7. Titles et descriptions hors gabarit
- **Constat** : le title de /it/fonctionnalites/relance-anciens-clients fait 63 caractères. Les descriptions de /it/aide/guides/choisir-la-voix (69) et de /it/cookies (68) sont courtes.
- **Source** : `it/modules.ts:203`, `it/guides.ts:279` et `it/ui/pages.ts:745`.

### m8. Typographie française dans le texte italien, et texte tronqué
- **Constat** : « Richiesta creata **:** Perdita sotto il lavello » comporte une espace avant les deux-points et est tronqué (`scrollWidth` 232 pour une largeur visible de 98). L'objet de l'email OTP utilise aussi « … : 123456 ».
- **Source** : `src/components/ScenarioExplorer.tsx:123` et `src/pages/api/agent/account.ts:127`.

### m9. Personas
- **Constat** : la section équipe affiche « Jade — Receptionist AI », Daan, Katie, Jack et Tomasz. La démo, le widget et les maquettes IT sont pourtant incarnés par Manuela et Marco, et la note dit « Jade, Daan, Katie e i loro colleghi… ».
- **Source** : `extras.tsx` (`AgentTeam`) et `it/ui/components.ts:423`.
- **Correctif** : mettre Manuela en réceptionniste sur /it.

### m10. Restes d'anglais
- **Constat** : `title="Voice Assistant Widget"` ; « Add credits » sur 39 pages (référence au menu de l'app) ; « Dashboard », « Lead », « Flow builder ».

  Aucun reste de français visible n'a été trouvé (scan de l'innerText et des attributs alt, aria-label, placeholder et title sur les 80 pages), hors « Français » dans le sélecteur de langue.

### m11. Le formulaire d'essai n'a pas de message d'erreur téléphone personnalisé
- **Constat** : même défaut qu'en FR m8. Le navigateur affiche son message générique.

### m12. Déclaration d'accessibilité
- **URL** : /it/accessibilite.
- **Constat** : la page existe et cite l'EAA, mais n'indique pas la procédure de recours auprès d'AgID, autorité de contrôle EAA en Italie (D.Lgs. 82/2022).
- **Contexte** : la dichiarazione AgID via form n'est obligatoire que pour certains acteurs privés (chiffre d'affaires de plus de 500 M€). À valider en phase 2.

### m13. Titres h1 très longs sur desktop
- **Constat** : par exemple /it/secteurs/immobilier, avec un h1 sur 6 lignes en 1440.
- **Preuve** : `shots/it-desktop-secteur-top-nc.png`.

### m14. Redirections des robots et x-default
- **Constat** : mêmes points que FR m10 et m11.

## Suggestions
- Ajouter un numéro italien (+39) avec Manuela en agent entrant, sur le modèle du marché HE. /it/contact dit aujourd'hui « Non pubblichiamo un numero di telefono ».
- Vérifier que l'outil OTP de l'assistante IT envoie `lang=it`. Sinon, l'email part en FR+EN.
- Revoir le registre : le site vouvoie avec « Lei » (« Richieda », « Scelga »). Valider ce choix avec un relecteur natif en phase 2.

## Ce qui est conforme (IT)
- **Pages** : les 80 URL renvoient 200. `<html lang="it">`. Title et description en italien, sans doublon. Un seul h1 par page. Aucune image sans alt.
- **Balises SEO** : canonical égal à l'URL, `og:locale=it_IT`, `og:site_name` « PermanenceIA ». hreflang complet et réciproque. JSON-LD valide.
- **Liens** : aucune fuite (tous les liens internes restent sous /it), aucun lien cassé, aucune ancre morte, aucun lien hors sitemap.
- **Redirections** :
  - / avec it-IT, it ou it-CH donne 307 vers /it ;
  - le cookie `NEXT_LOCALE` est respecté dans les deux sens ;
  - le domaine nu /it/tarifs renvoie 301 vers www/it/tarifs ;
  - /it/blog renvoie vers /it/faq, et les 404 sont en italien ;
  - /IT/tarifs renvoie 200, mais le canonical est en minuscules.
- **Formulaires** :
  - messages d'erreur en italien (« Indichi un numero di telefono valido, ad esempio 312 345 6789 », « Spunti la casella… ») ;
  - formats acceptés : 333 123 4567, +39, 0039 et fixe 06 ;
  - la conversion serveur est correcte (`keepZero`) : +393331234567 et +390612345678 ;
  - les numéros 800 sont refusés.
- **Mobile** : menu mobile, sous-menus, Échap et `aria-label` « Apri il menu » fonctionnent. Le sélecteur de langue conserve la page. Aucun débordement horizontal sur les 80 pages. Pas de mot italien qui casse un menu ou une carte, hors m1 à m3.
- **Marque** : « PermanenceIA » partout sur le site (logo texte, title, og, footer « © 2026 PermanenceIA — marchio di SINAY STRATEGIC LLC. Prezzi indicati IVA esclusa. », mentions). Aucune occurrence de « Permanence IA » ni « PermanenceAI ». L'écart ne concerne que l'app (M3) et le widget (m4).
- **Accessibilité et démo** : lien d'évitement « Vai al contenuto » et focus visible. La démo affiche « Italiano » en premier, et Manuela et Marco comme voix.

---

## Captures (scratchpad/ui-fr-it/shots/)

**Captures par page.** Elles sont nommées `{fr|it}-{desktop|mobile}-{home|tarifs|offre|secteur|fonction|guide|demo|contact|essai|faq}-{top|full}[-nc].png`. Il y a 160 fichiers, pris sur le build `mnXxLE…`/`XUkGV4F…`. Les versions `-nc` sont sans bandeau cookies, les autres avec. Les anciennes captures FR du build `vpQ…` sont dans `shots/v1/`.

**Captures spécifiques**
- Menus : `fr-mobile-menu-open.png`, `fr-mobile-menu-submenu.png`, `it-mobile-menu-open.png`, `it-mobile-menu-submenu.png`, `fr-desktop-menu-dropdown.png`.
- Widget et bandeau cookies : `fr-mobile-home-bottom-overlay.png`, `it-mobile-home-bottom-overlay.png`, `fr-mobile-tap-Accepter.png`, `it-mobile-tap-Accetta.png`, `it-mobile-tap-Rifiuta.png`, `it-mobile360-tarifs-overlay.png`, `fr-desktop-tarifs-widget.png`.
- Modal de rappel : `fr-mobile-callback-modal.png`, `it-mobile-callback-modal.png`.
- Formulaires : `fr-desktop-form-{contact,demo,essai-gratuit}-validation.png`.
- En-tête : `fr-desktop1024-header.png`, `fr-desktop1100-header.png`.
- Boutons sur deux lignes : `fr-desktop-wrap-Choisir_R_ce.png`, `fr-desktop-wrap-D_marrer_l_e.png`, `fr-desktop-cta-wrap.png`, `it-desktop-wrap-Parli_con_un.png`, `it-desktop-wrap-Scelga_Recep.png`.
- Débordement mobile : `fr-mobile-guide-outils-sur-mesure-overflow.png`.
- Prix : `fr-desktop-tarifs-fx.png`.
- Inscription dans l'app : `fr-app-register.png`, `it-app-register.png`.

**Planches (tiles/)** : `tiles/it-mobile-{demo,offre,essai,contact,faq,guide}-full-nc-t*.png` et `tiles/fr-mobile-tarifs-full-t*.png`.

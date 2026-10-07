# Audit pré-publication /he, phase 1 (UI/UX, navigation, technique front)

Site audité en ligne le 2026-10-07 : https://www.permanenceia.com/he, 79 URL du sitemap.
Méthode : Playwright Chromium, desktop 1440x900 et mobile 390x844, UA Chrome/iOS, `Accept-Language: he-IL`, plus curl et axe-core 4 (WCAG 2.1 AA) sur 10 pages clés. Aucun formulaire n'a été soumis : les POST `/api/**` étaient bloqués et seule la validation HTML a été déclenchée.
Fichiers produits : scripts `crawl.js`, `shots.js`, `interact.js`, `axe.js`, `lang.js`, `an1-3.js` ; données `crawl.json`, `latin.txt` ; captures dans `shots/`.

## Ce qui est conforme (vérifié)
- **Pages** : les 79 URL renvoient 200, sans redirection. Toutes ont `<html lang="he" dir="rtl">`, un title et une meta description en hébreu. Pas de doublon. Title de 60 caractères au plus, description de 44 à 157.
- **Balises SEO** : canonical égal à l'URL. hreflang complet (7 langues + x-default vers la version française), cohérent sur toutes les pages. `og:locale=he_IL`.
- **Titres et images** : exactement un `<h1>` par page. Aucune `<img>` sans alt.
- **Liens internes** : aucun lien cassé, aucune ancre morte. Aucune fuite de locale : tous les `<a>` internes restent sous /he. Aucun lien vers /blog, /docs ou /kb. Liens externes : `app.permanenceia.com/login` et `/register`, `mailto:`, `tel:`.
- **Téléphone** : `tel:+97223767085` est correct sur les 79 pages (pied de page, hero d'accueil, /contact). L'affichage `02-376-7085` est entouré de `<bdi dir="ltr">`.
- **Police et mise en page** : Heebo 400 à 800 bien chargée et appliquée au body et aux titres. Aucun débordement horizontal (scrollWidth = clientWidth) sur les 79 pages, ni en mobile ni en desktop.
- **Formulaires** : les champs tel et email sont en `direction:ltr; text-align:right` (globals.css:78). La saisie `+972 50 123 4567` s'affiche correctement (`shots/desktop-tel-input-contact.png`). Les formats 050-123-4567, +972…, 0501234567 et 02-376-7085 sont acceptés.
- **Icônes directionnelles** : les flèches lucide sont inversées en RTL (globals.css:71-73). Le menu déroulant desktop s'ouvre bien depuis la droite.
- **Menu mobile** : il s'ouvre, Échap le ferme, le bouton bascule correctement et `aria-expanded`/`aria-label` sont en hébreu.
- **Clavier** : lien d'évitement « דילוג לתוכן » en premier élément focusable, focus visible (outline 2px) sur tous les éléments testés.
- **Sélecteur de langue** : il conserve la page (/he/tarifs → /en-gb/tarifs) et mémorise le choix.
- **Redirections** : `/` avec he-IL, he ou iw renvoie 307 vers /he. `/tarifs` avec he-IL renvoie vers /he/tarifs. /he/blog/* redirige vers /he/faq. Les 404 sont en hébreu et en noindex.
- **Prix** : la mention « לא כולל מע״מ » est présente partout (bandeau, cartes, tableau, pied de page).
- **Performance** : temps de chargement (load) médian d'environ 1,05 s en desktop et 1,1 s en mobile. Le maximum est de 3,0 s (/he/aide/guides/base-de-connaissances, en mobile).

---

## BLOQUANT avant publication

### B1. Aucune déclaration d'accessibilité (הצהרת נגישות)
- **URL** : tout le site. Le pied de page et les 79 pages ne contiennent ni « נגישות » ni « הצהרת נגישות » (recherche dans l'innerText des 79 pages). Il n'existe pas de route dédiée.
- **Constat** : en Israël, les sites commerciaux doivent respecter l'IS 5568 (WCAG 2.0 AA) et publier une déclaration d'accessibilité. Celle-ci doit indiquer le niveau de conformité, les limites connues et un référent accessibilité avec téléphone et email (תקנות שוויון זכויות לאנשים עם מוגבלות, תקנה 35). Une absence expose à des actions en justice sans preuve de préjudice.
- **Correctif** : créer `src/pages/accessibilite.tsx` avec un contenu en hébreu (référent, date, niveau, limites, contact) et un slug hébreu ou neutre, par exemple `/he/accessibility`. Ajouter le lien dans la barre légale de `src/components/Footer.tsx:57-62` et l'URL dans `src/pages/sitemap.xml.ts`. Corriger aussi les points M4 et m1 avant de déclarer « AA ».

### B2. Le texte de /he/contact et du modal de rappel contredit le numéro affiché
- **URL** : /he/contact (h1 et intro) et le modal « בקשת שיחה חוזרת » de la barre mobile, présent sur toutes les pages.
- **Constat** : l'intro dit « איננו מפרסמים מספר טלפון: אנחנו חוזרים אליכם… » (« nous ne publions pas de numéro »). Le bloc juste en dessous affiche « התקשרו אלינו, 24/7 — 02-376-7085 ». Le modal dit lui aussi « אנחנו לא מפרסמים מספר טלפון ». Captures : `shots/mobile-contact-top.png`, `shots/mobile-callback-modal.png`.
- **Fichiers** : `src/i18n/content/he/ui/pages.ts:39` et `src/i18n/content/he/ui/components.ts:75`.
- **Correctif** : réécrire ces deux phrases, par exemple « התקשרו אלינו 24/7 או השאירו מספר ונחזור אליכם בשעה שתבחרו. »

---

## MAJEUR

### M1. Widget de chat (Autocalls embed.js) non adapté au RTL et masquant du contenu
- **URL** : toutes les pages où le widget se charge. Position configurée : `"position":"bottom-right"` (API `app.permanenceia.com/api/widget-config?assistant_id=d8bde5e6-…`).
- **Bidi cassé dans la bulle** (`shots/zoom-widget-desktop.png`) :
  - « ?יש לכם שאלה » : le point d'interrogation est du mauvais côté.
  - Le sous-titre s'affiche « שלנו AI-דברו עם נועה, עוזרת ה » : l'ordre des mots est cassé et le texte est tronqué.
  - La bulle est rendue en LTR (avatar à gauche).
  - L'attribut `title="Voice Assistant Widget"` est en anglais.
- **Recouvrement de contenu** : en RTL, les lignes commencent à droite, donc la bulle en bas à droite cache le début des lignes.
  - /he/aide/guides/* : l'étape 3 est masquée (`shots/desktop-guide-top.png`).
  - /he/demo : la puce « Italiano » est masquée.
  - Pied de page : le début du copyright est masqué.
  - Mobile, /he/essai-gratuit : **la bulle recouvre le CTA principal « פתחו חשבון בחינם » à l'ouverture de la page** (`shots/mobile-essai-top.png`).
  - Mobile, accueil : elle recouvre la carte téléphone 02-376-7085 (`shots/mobile-home-bottom-overlay.png`).
  - Mobile, /he/contact : elle recouvre l'email (`shots/mobile-contact-top.png`).
  - Menu mobile ouvert : elle recouvre les entrées du menu (`shots/mobile-menu-submenu.png`).
- **Correctif** :
  1. Pour le marché HE, passer la position à `bottom-left` dans la config de l'assistant Autocalls (21306).
  2. Demander ou ajouter `dir="rtl"` sur la racine du widget dans embed.js (`app.permanenceia.com/embed.js`), ou envelopper les textes dans un `<bdi>`.
  3. Raccourcir `button_sub_text`.
  4. Décaler la bulle au-dessus de la barre d'action mobile (`Layout.tsx:182`, hauteur 4,75 rem) et la masquer quand le menu mobile est ouvert.
  5. Si la bulle passe à gauche, mettre à jour les textes qui citent « הבועה בפינה הימנית התחתונה » (`he/guides.ts:31`, `he/ui/pages.ts:18,120`). Ces textes décrivent l'espace client et la chaîne `widgetHint` n'est pas affichée.

### M2. Puces de langue de la démo : avatars superposés au libellé (spécifique RTL)
- **URL** : /he et /he/demo, bloc LiveDemo, champ « שפה ».
- **Preuve** : `shots/zoom-demo-langchips.png`. Les deux avatars recouvrent la fin de « English (AU) », « Français », « Polski », « Nederlands » et « עברית ».
- **Fichier** : `src/components/LiveDemo.tsx:410`, classe `-space-x-2`. En Tailwind 3, cette classe applique une marge négative `margin-left` qui n'est pas inversée en RTL.
- **Correctif** : ajouter `rtl:space-x-reverse` (`flex -space-x-2 rtl:space-x-reverse`) ou remplacer par des marges logiques (`[&>*+*]:-ms-2`).

### M3. Devise USD sur un site destiné au marché israélien
- **URL** : /he/tarifs, /he/offres/*, puces de prix sur l'accueil et les pages fonctionnalités.
- **Constat** : tous les prix sont en dollars US (« ‏99 ‏$ », « ‏0.28 ‏$ לדקה ») avec la mention « המחירים בדולר אמריקאי (USD) ». Aucun prix en ₪. Les seuls ₪ sont des exemples fictifs (« ≈ ₪2,900,000 » dans la maquette immobilière).
- **Impact** : des PME israéliennes qui comparent avec des offres locales en ₪ y verront une friction. La mention « לא כולל מע״מ » pose aussi une question : une LLC américaine facture-t-elle réellement la TVA israélienne de 18 % ? Si ce n'est pas le cas, la mention induit en erreur (sujet juridique et fiscal pour la phase suivante).
- **Fichier** : `src/i18n/markets.ts:62` (`currency: 'USD'`) et `:93` (`SHARED`).
- **Correctif** : soit une grille en ILS pour `he` (avec un champ `currency` élargi et des forfaits Autocalls dédiés), soit garder l'USD et ajouter un équivalent indicatif en ₪ ainsi qu'une phrase claire sur la facturation (devise, TVA, facture).

### M4. Contraste insuffisant (WCAG 1.4.3, exigé par l'IS 5568)
- **Preuve** : axe-core, règle `color-contrast` (« serious ») sur 5 des 10 pages testées : accueil (12 nœuds), /he/secteurs/immobilier (6), /he/fonctionnalites/receptionniste-ia (4), /he/demo (4), /he/offres/assistant (1).
  - `h1 > .kw` (mot-clé turquoise #0FA3C4 sur #F5F8FB) : ratio de **2,79:1**, sous le minimum de 3:1 même en grand texte.
  - `.text-white/45` sur #0A1233 : 4,47:1 pour un texte de 12 px, sous le minimum de 4,5:1.
- **Fichier** : `tailwind.config.js:9` (`signal.DEFAULT #0FA3C4`) et la classe `.kw` dans `src/styles/globals.css:25`.
- **Correctif** : utiliser `signal-deep` #0A7690 pour `.kw` sur fond clair (ratio d'environ 5:1) et passer `text-white/45` à `/60`.

---

## MINEUR

### m1. Onglets au clavier non inversés en RTL
- **Fichiers** : `src/components/extras.tsx:160` (onglets secteurs) et `src/components/ScenarioExplorer.tsx:178`.
- **Constat** : `ArrowRight` donne i+1. En RTL, la flèche droite doit aller vers l'onglet visuellement à droite, c'est-à-dire l'onglet précédent (WAI-ARIA APG).
- **Correctif** : inverser `ArrowLeft`/`ArrowRight` quand `document.dir === 'rtl'`.

### m2. Dégradé « encore des onglets » faux en RTL
- **Fichier** : `src/components/extras.tsx:150` et `:183-184`.
- **Constat** : en RTL, `scrollLeft` vaut 0 ou est négatif. `fade.left` ne s'allume jamais et `fade.right` reste vrai même en bout de liste. Les dégradés `bg-gradient-to-r`/`to-l` sont aussi associés à `start-0`/`end-0`, ce qui inverse leur sens.
- **Correctif** : utiliser `Math.abs(el.scrollLeft)` et des dégradés liés au sens d'écriture (`rtl:bg-gradient-to-l`, etc.).

### m3. Trait vertical de la timeline « Flow » du mauvais côté en RTL
- **Fichier** : `src/components/Mock.tsx:153` (`absolute left-[17px]`).
- **Constat** : en RTL, l'icône est à droite mais le trait reste à gauche.
- **Correctif** : remplacer `left-[17px]` par `start-[17px]`.

### m4. Validation du téléphone trop permissive et messages natifs
- **URL** : /he/contact, /he/demo, /he/essai-gratuit et le modal de rappel. Champs `type=tel`, `minLength=8`, sans `pattern`.
- **Constat** : « abcdefgh » passe la validation HTML. Les messages d'erreur sont ceux du navigateur : en hébreu seulement si le navigateur est en hébreu, en anglais lors du test. Le consentement n'est pas `required` côté HTML et il est vérifié en JS (`ui.tsx:130`, message `consentRequired`).
- **Fichiers** : `src/components/ui.tsx:169`, `src/pages/essai-gratuit.tsx:86`.
- **Correctif** : ajouter `pattern="^(\+?972[\s-]?|0)(5\d|[23489]|7\d)[\s-]?\d{3}[\s-]?\d{4}$"` (ou une validation JS avec message hébreu via `setCustomValidity`), plus `inputMode="tel"` et `placeholder="050-123-4567"`.

### m5. Double redirection permanenceia.com/he → /he/ → /he
- **Preuve** : `curl https://permanenceia.com/he` renvoie 301 vers `https://www.permanenceia.com/he/`, puis 308 vers `/he`.
- **Fichier** : `src/middleware.ts:15`. `prefix + '/' + ''` produit un slash final.
- **Correctif** : `url.pathname = prefix + (pathname === '/' ? (prefix ? '' : '/') : pathname)`.

### m6. /he/docs ignore la locale de l'URL
- **Preuve** : sans cookie ni Accept-Language, `/he/docs` renvoie 307 vers `/en-gb/aide`.
- **Fichier** : `src/pages/docs.tsx:8-21`.
- **Correctif** : utiliser `ctx.locale` en priorité quand il diffère de `fr`.

### m7. Fiches /kb accessibles sous /he dans toutes les langues
- **Constat** : `/he/kb/he` renvoie 200 (noindex), comme `/he/kb/fr` (contenu français servi sous une URL /he).
- **Fichier** : `src/pages/kb/[doc].tsx:28`.
- **Correctif** : limiter `paths` à `locale === doc.split('-')[0]`, ou bloquer /kb dans robots.txt.

### m8. Restes non hébreux visibles
Hors marques légitimes. L'extraction complète est dans `latin.txt` (299 séquences).
- **`title="Voice Assistant Widget"`** sur les 38 pages où le widget s'est chargé : vient du widget, voir M1.
- **Libellés de l'espace client en anglais dans les guides** /he/aide/* : « Add credits », « Save », « Assistants », « Create », « Make phone calls », « Limits », « Calls history », etc. C'est volontaire : l'intro de /he/aide indique « אזור הלקוח מוצג באנגלית ». C'est acceptable, mais l'espace client en anglais reste un frein pour le marché israélien (constat produit).
- **/he/cgu, /he/confidentialite et le guide /he/aide/guides/qui-peut-on-appeler** citent L223-1 (France), TPS/CTPS, Do Not Call Register, Registro pubblico delle opposizioni, Bel-me-niet Register, TCPA, etc. Israël est bien traité en premier (סעיף 30א לחוק התקשורת, חוק הגנת הפרטיות, תיקון 13). C'est cohérent pour des CGU multi-pays, mais à faire valider par la phase juridique.
- **Noms des agents** « Jade, Daan, Katie, Jack, Manuela, Tomasz » sur l'accueil, les pages fonctionnalités et /he/about : ce sont des personas européens, alors que la voix HE s'appelle נועה ou דניאל. Source : `src/data/personas.ts:56-58` (`TEAM_PERSONAS` identique pour toutes les langues).
- **Option du sélecteur de langue** « English (Australia) » : normal, nom de langue endonyme.

### m9. Slugs d'URL en français sous /he
- **URL** : /he/secteurs/*, /he/offres/*, /he/fonctionnalites/*, /he/aide/guides/*, /he/essai-gratuit, /he/tarifs, /he/mentions-legales, etc.
- **Constat** : les slugs (« acheter-un-numero », « kines-paramedical », « centre-appels »…) ne disent rien à un utilisateur israélien et n'apportent aucun signal SEO en hébreu. Ce n'est pas bloquant, car le canonical et le hreflang sont corrects.
- **Correctif** : envisager des slugs anglais ou translittérés, par exemple /he/pricing et /he/free-trial, avec des redirections 301 et une mise à jour du sitemap. Next pages router impose les mêmes noms de fichiers : il faudrait des `rewrites` par locale.

---

## SUGGESTIONS
- **S1. Hero de l'accueil en desktop** (`src/pages/index.tsx:37`, `lg:items-end`) : le h1 est aligné en bas à droite alors que le paragraphe, les puces, les CTA et la carte téléphone sont en haut à gauche. La carte téléphone propre au marché HE allonge la colonne et crée un grand vide au-dessus du h1 (`shots/desktop-home-top.png`). Essayer `lg:items-center`, ou déplacer la carte téléphone sous les CTA en pleine largeur.
- **S2.** Ajouter `og:locale:alternate` pour les 6 autres locales (`Layout.tsx:170`).
- **S3.** Le x-default pointe vers le français (`Layout.tsx:163`). Pour un visiteur israélien non hébréophone, `/en-gb` serait plus pertinent. C'est une décision globale.
- **S4. Limite de débit du widget** : pendant le crawl, `api/widget-config` a renvoyé **429** sur 50 des 158 chargements, et le widget ne s'est alors pas affiché (console : « Voice Assistant Widget: Failed to fetch config »). La cause est la rafale de requêtes du crawl, mais la limite paraît basse pour un réseau partagé (bureau, NAT mobile). Vérifier côté Autocalls.
- **S5.** Une 500 isolée sur `/logo/mark-light.png` (non reproduite en 3 essais curl) : à surveiller.
- **S6.** Le contenu des sections est masqué jusqu'au défilement (animations de révélation) : les captures pleine page sont vides sous la ligne de flottaison. Vérifier que `prefers-reduced-motion` et les robots voient bien le contenu. Le DOM contient bien le texte.

---

## Captures produites (`scratchpad/ui/shots/`)
- **Desktop, haut de page et page entière** : `desktop-{home,tarifs,offre,secteur,fonction,guide,demo,contact,essai,faq}-top.png` et `-full.png`.
- **Mobile, haut de page et page entière** : `mobile-{home,tarifs,offre,secteur,fonction,guide,demo,contact,essai,faq}-top.png` et `-full.png`.
- **Menus** : `mobile-menu-open.png`, `mobile-menu-submenu.png`, `desktop-menu-dropdown.png`.
- **Widget et modal** : `mobile-home-bottom-overlay.png`, `mobile-callback-modal.png`, `zoom-widget-desktop.png`.
- **Pied de page** : `desktop-footer.png`, `mobile-footer.png`, `mobile-footer-2.png`.
- **Formulaires** : `desktop-form-{contact,demo,essai-gratuit}-validation.png`, `desktop-tel-input-{contact,demo,essai-gratuit}.png`.
- **Zooms** : `zoom-demo-langchips.png`, `zoom-home-chips.png`, `zoom-dropdown-bidi.png`, `zoom-footer-logo.png`.
- **Inutilisables** : `crop-desktop-footer.png` et `crop-mobile-footer.png` sont vides (artefact des animations, voir S6). `desktop-demo-widget-zoom.png` a été prise alors que le widget ne s'était pas chargé.

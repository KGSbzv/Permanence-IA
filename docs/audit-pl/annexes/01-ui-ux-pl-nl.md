# Audit pré-publication /pl et /nl, phase 1 (UI/UX, navigation, technique front)

Audit en ligne du 2026-10-07 (07:30–08:45 UTC) sur https://www.permanenceia.com/pl et /nl : 79 URL du sitemap par locale, plus /accessibilite, ajoutée entre-temps.

**Méthode**
- Playwright Chromium, desktop 1440x900 et mobile 390x844, `Accept-Language` pl-PL puis nl-NL.
- curl pour les redirections.
- axe-core 4.10.2 (chargé depuis cdnjs, WCAG 2.0/2.1/2.2 A-AA) sur 10 pages clés par locale.
- Aucun formulaire soumis : les POST `/api/**` étaient bloqués et seule la validation a été testée.

**Version auditée.** Le site a été redéployé 3 fois pendant l'audit. Les mesures finales portent sur les builds `mnXxLEzl…` (commits 6b45f8b et 5626c11) et `XUkGV4F…` (commit 8c8a071, montants indicatifs en devise locale). Les références de code renvoient donc à **`origin/main`**, que je n'ai lu qu'avec `git show`/`gh api`. La branche locale `claude/hebrew-site-audit-auk78b` est en retard sur main. Les premières mesures, faites sur l'ancien build, sont dans `old/` et ne sont pas utilisées.

**Scripts et données** (dans `ui-pl-nl/`)
- Scripts : `crawl.js`, `an1.js`, `an2.js`, `lang.js`, `shots.js`, `interact.js`, `zoom.js`, `axe.js`, `diag.js`, `roi.js`, `sw.js`, `cookie.js`.
- Données : `crawl-{pl,nl}.json`, `interact-{pl,nl}.log`, `axe-{pl,nl}.json`, `latin-{pl,nl}.txt`.

## Points de l'audit hébreu : s'appliquent-ils à PL et NL ?

| Point HE | PL / NL |
|---|---|
| Widget Autocalls qui recouvre les CTA sur mobile | **Oui, en pire.** Il recouvre aussi le bouton « Accepter » du bandeau cookies et le rend inutilisable (B1). Il recouvre aussi des CTA et les liens légaux du pied de page (M1). |
| Limite de débit 429 du widget | **Oui.** `api/widget-config` a renvoyé 429 sur 55/158 chargements en PL et 68/158 en NL, avec seulement 3 onglets en parallèle (et un autre audit en cours en même temps). Le widget était alors absent. |
| Contraste du mot-clé `.kw` (2,79:1) | **Corrigé.** `.kw` passe à `signal-deep` #0A7690 (`globals.css:25`), environ 5:1. Restent des contrastes faibles ailleurs (m-a11y). |
| Prix uniquement en USD | **Partiellement corrigé** par 8c8a071 : « ≈ 383 zł » et « ≈ € 221 » sous les cartes de prix, avec une note BCE. Ailleurs, tout reste en USD (M4). |
| Personas européens | **Oui, mais moins gênant.** L'équipe « Jade, Daan, Katie, Jack, Manuela, Tomasz » est la même partout (`personas.ts:56`, texte `virtualNote`). La démo et le hero utilisent bien Lena / Tomasz et Emma / Daan. |
| Email OTP bilingue FR/EN | **Corrigé dans le code** (`api/agent/account.ts`, `CODE_MAIL` pl/nl). Non testé, car je n'ai envoyé aucun email. À vérifier : l'outil de Lucie envoie-t-il bien `lang` ? Sinon, l'email retombe sur FR+EN. |
| Puces de langue de la démo | **Conforme en LTR.** La langue du site apparaît en premier (Polski / Nederlands) et les avatars ne recouvrent pas le libellé (`pl-zoom-demo-langchips.png`). |

---

# SECTION PL (/pl)

## BLOQUANT

### PL-B1. Sur mobile, le widget empêche d'accepter les cookies (toutes les pages)
- **Constat** : la bulle du widget est un `<iframe title="Voice Assistant Widget">` de 321x97 px en x=69, y=663. Elle se place au-dessus du bouton « Akceptuję » du bandeau `ConsentBanner` (bottom 5.5rem).
  - Le clic est intercepté : `interact-pl.log` donne « ACCEPT click FAILED … iframe … intercepts pointer events ».
  - « Odrzucam » n'est cliquable que sur sa moitié gauche.
  - Bandeau, bulle et barre collante couvrent environ 40 % de l'écran à l'ouverture de chaque page.
- **Conséquences** :
  - le consentement est impossible sur mobile, donc pas de GA4 ni de mesure publicitaire ;
  - le choix est déséquilibré (refuser est possible, accepter ne l'est pas) ;
  - le texte et les CTA du premier écran sont masqués.
- **Preuves** : `pl-mobile-home-top.png`, `pl-mobile-essai-top.png`, `pl-mobile-tarifs-top.png`, `pl-mobile-menu-submenu.png`.
- **Sources** : `origin/main:src/components/ConsentBanner.tsx:26` (`z-[60] bottom-[5.5rem]`) et `Layout.tsx:85` (widget chargé `lazyOnload` en même temps que le bandeau).
- **Correctif** :
  - ne charger le widget qu'après le choix de consentement, ou le masquer tant que le bandeau est ouvert (`readConsent()` puis `OPEN_CONSENT_EVENT`) ;
  - ou placer le bandeau en haut, ou en plein écran bas avec `z-index` supérieur à celui de l'iframe ;
  - tester le clic réel sur 390, 360 et 320 px.

## MAJEUR

### PL-M1. Le widget masque des CTA et des liens légaux (bulle bottom-right)
- **Mobile, /pl/essai-gratuit** : la bulle recouvre le CTA principal « Załóż bezpłatne konto » et la fin de l'étape 3 (`pl-mobile-widget-essai-gratuit.png`, `pl-mobile-widget-noconsent-essai-gratuit.png`). Ces captures sont prises après le choix cookies.
- **Mobile, /pl/contact** : elle recouvre le début du formulaire (`pl-mobile-widget-noconsent-contact.png`).
- **Desktop, bas de page** : elle recouvre « Prywatność », « Pliki cookie » et « Dostępność » dans la barre légale (`pl-desktop-footer-bottom.png`).
- **Limite de débit 429** sur `widget-config` : 55/158 chargements pendant le crawl, voir le tableau en tête.
- **Libellés en anglais** : l'attribut `title="Voice Assistant Widget"` et le paramètre d'iframe `text=Speak with our voice AI assistant`.
- **Source** : config Autocalls de l'assistant `83d46ff1-…` (`position: bottom-right`) et `Layout.tsx:82-85`.
- **Correctif** :
  - surélever la bulle au-dessus de la barre d'action mobile (offset d'au moins 4.75 rem) ;
  - réduire la bulle à une pastille sur mobile ;
  - la masquer sur /essai-gratuit et quand le menu ou le bandeau est ouvert ;
  - ajouter `scroll-padding-bottom` ou une marge basse au pied de page en desktop ;
  - relever la limite de débit côté Autocalls.

### PL-M2. Le calculateur de ROI de /pl/tarifs affiche par défaut que l'agent coûte plus cher
- **Constat** : avec les valeurs par défaut (coût horaire 10 $, 300 appels de 3 min), le calcul donne :
  - « Koszt recepcji obsługiwanej przez człowieka 200 $ / mies. »,
  - « Koszt pakietu Asystent − 249 $ »,
  - « **Miesięczna oszczędność -49 $** », suivi de « agent kosztuje nieco więcej niż pracownik ».
- **Incohérence** : la même page cite le salaire minimum « 4806 zł brutto miesięcznie », soit environ 1 300 $. De plus, « -49 $ » utilise un tiret ASCII alors que « − 249 $ » utilise le vrai signe moins (`pl-desktop-roi.png`).
- **Sources** : `origin/main:src/i18n/markets.ts:122` (`hourlyCost: 10`), `blocks.tsx` (~l. 600-660, calculateur) et `pl/ui/components.ts:310` (`noSavings`).
- **Correctif** :
  - fixer `hourlyCost` PL à un coût chargé réaliste (environ 12-14 $/h) ;
  - ou faire démarrer le calculateur sur un volume où l'offre est rentable ;
  - formater les montants négatifs avec `Intl` (`signDisplay`).

### PL-M3. Registre mélangé « Ty » (63 pages) et « Państwo », visible dans le hero
- **Constat** : le site tutoie (« Twojej firmy », « przekazują Ci »), mais des ajouts récents vouvoient au pluriel de politesse.
  - « Za Państwa zgodą… » (bandeau, sur les 79 pages).
  - « **Zachowują Państwo swój numer** … gdy nie odbierają Państwo telefonu », placé juste sous les CTA de l'accueil.
  - « …kursu Państwa banku » (note de change).
  - « Proszę podać prawidłowy numer… » (validation du téléphone).
- **Preuve** : `pl-desktop-home-top.png`, où les deux registres sont côte à côte.
- **Sources** : `origin/main:src/i18n/content/pl/site.ts:23-25`, `pl/ui/components.ts` (`phoneInvalid`), `pl/faq.ts:46`.
- **Correctif** : tout passer au « Ty », par exemple « Za Twoją zgodą… », « Zachowujesz swój numer », « Podaj prawidłowy numer… ».

### PL-M4. Prix en USD sur le marché polonais : PLN seulement indicatif, mention « netto » à clarifier
- **Constat** :
  - les cartes de /pl/tarifs affichent désormais « ≈ 383 zł · ≈ 965 zł · ≈ 1933 zł » avec une note BCE (`pl-desktop-tarifs-fx.png`) ;
  - partout ailleurs, l'USD reste seul : titles (« Pakiet Asystent — 249 $ netto / mies. »), meta descriptions, /pl/offres/*, puces de prix des pages fonctionnalités, calculateur (« Średnia wartość nowego klienta 150 $ »), recharges ;
  - le format est correct pour la Pologne : « 249 $ », « 0,28 $ », « 1933 zł », « 50 000 ».
- **TVA** : « netto » laisse entendre qu'une TVA (VAT 23 %) s'ajoutera. Or le vendeur est une LLC du Wyoming. En B2B, c'est l'autoliquidation (« odwrotne obciążenie ») qui s'applique et aucune TVA n'est facturée. **À trancher en phase juridique et fiscale.**
- **Sources** : `markets.ts` (`currency: 'USD'`, `localCurrencies: ['PLN']`), `blocks.tsx` (`PricingCards`, `useFx`).
- **Correctif** :
  - étendre l'équivalent zł aux pages /offres/* et au calculateur ;
  - à terme, proposer des forfaits en PLN (`autocallsPlanIds`) ;
  - remplacer « netto » par une mention exacte, par exemple « bez VAT – odwrotne obciążenie dla firm z UE ».

### PL-M5. Image de partage (og:image) en français, avec l'ancienne marque
- **Constat** : `/og-image.jpg`, utilisée par toutes les pages /pl sauf les secteurs, affiche « PERMANENCE IA – AGENTS VOCAUX INTELLIGENTS ». Or la marque PL est « PermanenceAI » (`markets.ts`), tout comme le logo, le title, `og:site_name`, le pied de page et les mentions légales. Le partage sur LinkedIn, Facebook ou WhatsApp montre donc une marque et une langue incohérentes.
- **Source** : `Layout.tsx:30` (`ogImage = '/og-image.jpg'`) et `public/og-image.jpg`.
- **Correctif** : créer une image par marché (`/og/pl.jpg` « PermanenceAI – Inteligentny asystent telefoniczny ») et la choisir via `market`.

## MINEUR

- **PL-m1. Validation du téléphone inopérante** (/pl/contact, /pl/demo, modal de rappel)
  - **Constat** : `pattern="[+0-9][0-9 .()\-]{6,}"` est **invalide** dans Chrome, qui compile l'attribut `pattern` avec le drapeau `v` (« Invalid character in character class »). Le motif est donc ignoré et « abcdefgh » est accepté.
  - Le message polonais `phoneInvalid` ne s'affiche que pour une saisie trop courte.
  - /pl/essai-gratuit n'a pas de `pattern` et affiche le message natif du navigateur.
  - Formats PL acceptés : 512 345 678, +48…, 0048…, 22 123 45 67.
  - **Source** : `origin/main:src/components/ui.tsx:175`, `essai-gratuit.tsx` (champ `su-phone`).
  - **Correctif** : `pattern="[+0-9][0-9 .\(\)\-]{6,}"`, plus `inputMode="tel"` et `placeholder="512 345 678"` ; ajouter le même motif sur l'essai gratuit.
- **PL-m2. Contrastes et accessibilité (axe)**
  - **`color-contrast`** sur 5 pages sur 10 :
    - `text-white/45` à 4,47:1 (`LiveDemo.tsx:485,507`) ;
    - `text-ok` sur `bg-ok/10` à 4,23:1 (`Mock.tsx:189`) ;
    - blanc sur `bg-signal` à 2,97:1 (`Mock.tsx:214`).
  - **`definition-list`** (PL uniquement) : un `<p>` est enfant direct du `<dl>` du calculateur (message `noSavings`, `blocks.tsx:650`).
  - **`target-size`** WCAG 2.2 : lien « Porozmawiaj z naszym agentem » de 20 px de haut, sur l'accueil et /demo.
  - **Correctif** : passer en `/60`, utiliser `text-ok` plus foncé, `bg-signal-deep`, sortir le `<p>` du `<dl>` et prévoir une zone cliquable de `py-1` au minimum.
- **PL-m3. Typographie polonaise : mots d'une lettre en fin de ligne (« sierotki »)**
  - **Exemples** : « kwalifikuje i / umawia » (h1 de l'accueil desktop), « pakiet do przetestowania w / panelu » (/essai-gratuit), « Salony fryzjerskie i / barberzy », « Bezpieczeństwo i / zgodność » (pied de page).
  - **Correctif** : insérer une espace insécable après a, i, o, u, w, z dans les contenus PL, par exemple avec un helper à l'affichage.
- **PL-m4. Espace française avant les deux-points** : « Utworzone zgłoszenie **:** Przeciek pod zlewem » (accueil et /demo, explorateur de scénarios).
  - **Source** : `ScenarioExplorer.tsx:123` (`{tc.leadTitle} : {…}` codé en dur pour toutes les langues).
  - **Correctif** : utiliser `{tc.leadTitle}: …`, ou un séparateur fourni par la locale.
- **PL-m5. JSON-LD de l'accueil** : `availableLanguage: ['French','English']` sur /pl.
  - **Source** : `origin/main:src/pages/index.tsx:31`.
  - **Correctif** : dériver la valeur de la locale (`['Polish','English']`).
- **PL-m6. Hero desktop** : la grille en `lg:items-end` place le h1 en bas. À 1440x900, sa dernière ligne (« Ciebie ») passe sous le bandeau cookies et un grand vide reste au-dessus (`pl-desktop-home-top.png`).
  - **Source** : `index.tsx:37`.
  - **Correctif** : `lg:items-center`, ou aligner le h1 en haut.
- **PL-m7. Slugs français sous /pl** (/pl/secteurs/kines-paramedical, /pl/essai-gratuit, /pl/tarifs, /pl/aide/guides/acheter-un-numero…) : aucun signal SEO en polonais. Ce n'est pas bloquant, car le canonical et le hreflang sont corrects.
  - **Correctif** : réécritures par locale (`/pl/cennik`, `/pl/branze/…`) avec des 301.
- **PL-m8. Redirections**
  - `https://permanenceia.com/pl` renvoie 301 vers `/pl/`, puis 308 vers `/pl` : double saut (`middleware.ts:15`).
  - Googlebot avec `Accept-Language: pl` reçoit aussi le 307 vers /pl, alors que le code exclut les robots : l'en-tête UA ne semble pas transmis au middleware sur App Hosting.
  - `/pl/kb/fr` renvoie 200 avec du contenu français sous `lang="pl"`, en noindex (`pages/kb/[doc].tsx`).
- **PL-m9. Title de 65 caractères** : /pl/secteurs/medecine-esthetique, « Rejestracja pacjentów kliniki medycyny estetycznej — PermanenceAI ». Raccourcir, par exemple « Rejestracja pacjentów medycyny estetycznej · PermanenceAI ».
- **PL-m10. Restes anglais assumés** : libellés de l'espace client dans les guides (« Save », « Create assistant », « Calls history », « Add credits »). L'espace client est en anglais, ce qui est annoncé. « Call center » est employé comme nom de forfait, ce qui est acceptable en polonais.
- **PL-m11. GA4 en Consent Mode v2 « avancé »** : un `POST /g/collect` (`gcs=G100`, ping sans cookie) part avant tout choix. Point à valider en phase juridique (position UODO / EDPB).
- **PL-m12. Mock du hero** : « Rozmowa zakończona · podsumowanie wysłane » est tronqué par `truncate` sur mobile (accueil et /demo).

## SUGGESTIONS
- Ajouter `og:locale:alternate` pour les autres locales (`Layout.tsx:67`).
- `hyphens: auto` vaut « manual » partout. Il est utile pour les titres PL longs, combiné à `lang="pl"`.
- Afficher un numéro local polonais, comme pour HE. Aujourd'hui aucun numéro n'est affiché, ce qui est cohérent avec le texte « Nie publikujemy numeru telefonu » de /pl/contact.
- Les messages de validation natifs (« Please fill out this field. ») dépendent de la langue du navigateur. Ajouter `setCustomValidity` sur les champs requis.

## Ce qui est conforme (PL)
- **Statuts** : 79/79 URL en 200, sans redirection.
- **Métadonnées** :
  - `<html lang="pl" dir="ltr">` partout ;
  - title et meta description en polonais, sans doublon ;
  - title de 26 à 65 caractères (une seule page au-dessus de 60) ;
  - description de 60 à 158 caractères.
- **SEO** :
  - canonical égal à l'URL ;
  - hreflang complet (7 langues + x-default vers FR), identique sur toutes les pages ;
  - `og:locale=pl_PL`.
- **Structure** : un seul h1 par page, aucune `img` sans alt.
- **Liens** :
  - 0 lien cassé, 0 ancre morte, 0 fuite vers une autre langue ;
  - aucun lien vers /blog, /docs ou /kb ;
  - /pl/blog/* redirige en 307 vers /pl/faq, /pl/docs en 307 vers /pl/aide (corrigé) ;
  - liens externes : `app.permanenceia.com/login` et `/register`, `mailto:`.
- **Déclaration d'accessibilité** : /pl/accessibilite (« Deklaracja dostępności ») est en ligne, en 200, liée en pied de page et présente dans le sitemap. Elle reconnaît une conformité partielle et cite les limites du widget.
- **Police** : Poppins (titres) et Figtree (texte) sont chargées. Les diacritiques ą ć ę ł ń ó ś ź ż s'affichent dans la police, sans glyphe de repli (`pl-desktop-home-top.png`).
- **Mise en page** : aucun débordement horizontal (79 pages, mobile et desktop). Les tableaux larges sont dans des conteneurs défilants.
- **Menu mobile** : il s'ouvre, Échap le ferme, les sous-menus fonctionnent, sans débordement. Les libellés aria sont en polonais (« Otwórz menu »).
- **Clavier** : lien d'évitement « Przejdź do treści » en premier, focus visible (outline 2px).
- **Sélecteur de langue** : il conserve la page, la query et l'ancre (`/nl/offres/assistant?x=1#comparatif` → `/pl/offres/assistant?x=1#comparatif`) et pose `NEXT_LOCALE`.
- **Redirections** :
  - `/` avec pl-PL renvoie 307 vers /pl, `/tarifs` vers /pl/tarifs ;
  - le cookie `NEXT_LOCALE` prime (`NEXT_LOCALE=fr` garde `/`) ;
  - la 404 est en polonais et en noindex.
- **Formulaires** : messages de consentement en polonais (« Zaznacz pole, aby wyrazić zgodę na oddzwonienie. »). Les erreurs serveur sont remplacées par `t.sendFailed` hors FR.
- **Performance** : temps de chargement (load) médian de 1,28 s en desktop (max 4,6 s) et de 1,19 s en mobile (max 2,1 s).

---

# SECTION NL (/nl)

## BLOQUANT

### NL-B1. Sur mobile, le widget empêche d'accepter les cookies (toutes les pages)
- **Constat** : identique à PL-B1. L'iframe se trouve en x=98, y=663 et intercepte le clic sur « Accepteren » (`interact-nl.log`).
- **Preuves** : `nl-mobile-home-top.png`, `nl-mobile-menu-open.png`, `nl_cgu-overflow.png`.
- **Correctif** : voir PL-B1.

## MAJEUR

### NL-M1. Débordement horizontal sur mobile (390 px) sur 5 pages : mots composés et boutons insécables
| URL | Cause | scrollWidth |
|---|---|---|
| /nl/cgu | h1 « Algemene gebruiks- en **verkoopvoorwaarden** » (36 px) | 409 |
| /nl/aide/guides/campagnes-d-appels | h1 « Een belcampagne (of **berichtencampagne)** starten » | 405 |
| /nl/fonctionnalites/demo-live et /widget-web | bouton `.btn` « Bekijk het abonnement Gratis proefperiode » en `whitespace-nowrap`, dans un encadré `p-8` | 397 |
| /nl/aide/guides/outils-sur-mesure | URL `https://api.voorbeeld.nl/bestellingen/{order_id}` dans un `<bdi>` insécable | 397 |

- **Effet** : la page défile latéralement, le h1 est coupé à droite et la barre collante « Bel mij terug » est décalée (`nl_cgu-overflow.png`, `nl_aide_guides_campagnes-d-appels-overflow.png`).
- **Débordement interne** (sans effet sur la page) : « Overlijdensrisicoverzekering » (178 px pour une colonne de 146 px) dans la maquette de /nl/secteurs/courtiers-assurance-credit (`Mock.tsx:259`, `dl grid-cols-2`).
- **Sources** :
  - `tailwind.config.js:27` (`hero` de 2.25rem minimum) ;
  - `globals.css:19` (`.btn whitespace-nowrap`) ;
  - `nl/ui/commerce.ts:323` (`offerLink`) ;
  - `Guides.tsx:53` (`<bdi>`).
- **Correctif** :
  - `h1,h2 { overflow-wrap: anywhere; hyphens: auto; }` avec `lang="nl"` ;
  - ou ajouter des `&shy;` dans les chaînes (« verkoop­voorwaarden », « berichten­campagne ») ;
  - `whitespace-normal` sur les boutons dans des conteneurs étroits ;
  - `break-all` sur les `<bdi>` qui contiennent une URL ;
  - raccourcir `offerLink` en « Bekijk {naam} ».

### NL-M2. Les numéros belges en format national sont convertis en numéros néerlandais
- **Constat** : le formulaire /nl accepte « 0470 12 34 56 » (mobile belge). Côté serveur, `toE164('0470123456','nl')` donne **+31 470 123 456**. Ce numéro passe la liste blanche NL `^\+31(?:[1-57]\d{8}|…)` : l'agent IA appellerait donc un numéro néerlandais sans rapport avec la personne.
  - Il appellerait ainsi une personne qui n'a pas consenti : risque RGPD et de démarchage.
  - Le prospect flamand, lui, n'est jamais rappelé.
  - Le même risque existe en /demo si l'utilisateur choisit une autre langue que celle de son numéro, car `locale: lang` est la langue de la démo.
- **Sources** :
  - `origin/main:src/lib/server.ts:75-88` (`DIAL.nl = 31`) et `:104` ;
  - `api/callback.ts:35` ;
  - `LiveDemo.tsx` (body `locale: lang`).
- **Correctif** :
  - sur /nl, exiger le format international dès que le numéro ne commence pas par 06 ou 0[1-5,7] ;
  - ou ajouter un sélecteur pays (+31 / +32) à côté du champ ;
  - côté serveur, ne pas convertir un 04xx en +31 ;
  - message d'exemple : « 06 12345678 of +32 470 12 34 56 ».

### NL-M3. Le widget masque des CTA et des liens légaux
- **Mobile** :
  - /nl/fonctionnalites/widget-web : la bulle recouvre le CTA secondaire « Probeer onze agent live » (`nl_fonctionnalites_widget-web-overflow.png`) ;
  - /nl/essai-gratuit : elle recouvre l'étape 2 et le haut du CTA (`nl-mobile-widget-noconsent-essai-gratuit.png`).
- **Desktop** : elle recouvre « Privacy » et « Cookies » dans la barre légale (`nl-desktop-footer-bottom.png`).
- **Limite de débit 429** : 68/158 chargements.
- **Correctif** : voir PL-M1.

### NL-M4. Prix en USD : € seulement indicatif sur les cartes
- **Constat** :
  - « $ 249 excl. btw / maand · ≈ € 221 » et note ECB, mais uniquement dans `PricingCards` ;
  - titles (« Assistent: AI-telefoonservice, $ 249/mnd »), meta descriptions, /nl/offres/*, puces des pages fonctionnalités et calculateur restent en dollars seuls.
- **Format** : « $ 99 », « $ 0,28 », « 1.000 min » est conforme à nl-NL. Pour la Flandre, `nl-BE` donnerait « 99 $ ».
- **« excl. btw »** : même question d'autoliquidation que PL-M4 (vendeur LLC américaine, « btw verlegd »), à trancher en phase juridique.
- **Correctif** : voir PL-M4. À terme, proposer un tarif en EUR (marché euro).

### NL-M5. og:image en français, avec la marque « PERMANENCE IA »
- Voir PL-M5. La marque NL est « PermanenceAI » partout ailleurs.

## MINEUR
- **NL-m1. Validation du téléphone** : même `pattern` invalide que PL-m1 (« abcdefgh » accepté). Pas de `pattern` sur /nl/essai-gratuit. Le message NL « Vul een geldig telefoonnummer in, bijvoorbeeld 06 12345678 » ne cite que le format NL. Correctif : voir PL-m1 et NL-M2.
- **NL-m2. Contrastes, cible tactile (axe)** : mêmes violations que PL-m2 (`text-white/45` à 4,47 ; `text-ok`/`bg-ok/10` à 4,23 ; blanc sur `bg-signal` à 2,97 ; `target-size` sur le lien « Praat nu direct met onze agent »). Pas de violation `definition-list` en NL.
- **NL-m3. Belgique peu prise en compte**, alors que `nl-BE` est redirigé vers /nl :
  - `ogLocale nl_NL` seul, pas de hreflang `nl-BE` ;
  - autorité citée : Autoriteit Persoonsgegevens seulement (pas la GBA/APD) ;
  - secteurs NL (« VvE-beheer ») ;
  - exemples de téléphone NL uniquement.
  - « België » n'apparaît que sur 3 pages.
  - **Source** : `markets.ts` (fiche nl).
  - **Correctif** : mentionner la GBA et le Bel-me-niet-register, ajouter les exemples +32 et envisager `nl-BE` comme alias hreflang.
- **NL-m4. « Aanvraag aangemaakt : Lekkage… »** : espace française avant les deux-points (`ScenarioExplorer.tsx:123`).
- **NL-m5. JSON-LD** : `availableLanguage: ['French','English']` (`index.tsx:31`), mettre `['Dutch','English']`.
- **NL-m6. Hero desktop** : le h1 « Een AI-telefoonassistent die voor u opneemt, kwalificeert en afspraken boekt » est aligné en bas. À 1440x900, ses lignes 3 à 5 sont sous le bandeau cookies et un grand vide reste au-dessus (`nl-desktop-home-top.png`, `index.tsx:37`).
- **NL-m7. Slugs français** (/nl/fonctionnalites, /nl/essai-gratuit, /nl/tarifs…) : même constat que PL-m7, cibles `/nl/prijzen`, `/nl/gratis-proberen`.
- **NL-m8. Redirections et URL secondaires** : mêmes constats que PL-m8 (double 301/308 depuis l'apex, Googlebot redirigé, `/nl/kb/en` en 200 noindex).
- **NL-m9. Title de 61 caractères** : /nl/fonctionnalites/relance-anciens-clients.
- **NL-m10. Pied de page** :
  - « Cookies beheren » passe sur 2 lignes et décale la barre légale (`nl-desktop-footer-bottom.png`) ;
  - une 500 isolée sur `/logo/mark-light.png` pendant le crawl (non reproduite) ;
  - `title="Voice Assistant Widget"` en anglais.
- **NL-m11. Restes anglais assumés** : libellés de l'espace client dans les guides (« Get new phone number », « Calls history », « Integrate SIP trunk »). Ailleurs, aucun reste français ou anglais hors marques.
- **NL-m12. GA4** : ping `collect` avant consentement, voir PL-m11.

## SUGGESTIONS
- Un numéro local NL ou BE. Aujourd'hui aucun numéro n'est affiché, ce qui est cohérent avec /nl/contact.
- `og:locale:alternate`.
- Titres plus courts pour /nl/aide/guides/* (plusieurs titles longs, par exemple « Een belcampagne (of berichtencampagne) starten »).

## Ce qui est conforme (NL)
- **Statuts** : 79/79 URL en 200, sans redirection.
- **Métadonnées** :
  - `<html lang="nl" dir="ltr">` partout ;
  - title et meta description en néerlandais, sans doublon ;
  - title de 27 à 61 caractères, description de 70 à 158 caractères.
- **SEO** : canonical égal à l'URL, hreflang complet avec x-default, `og:locale=nl_NL`.
- **Structure** : un seul h1 par page, aucune `img` sans alt.
- **Liens** : 0 lien cassé, 0 ancre morte, 0 fuite vers une autre langue, rien vers /blog, /docs ou /kb. /nl/docs redirige vers /nl/aide.
- **Déclaration d'accessibilité** : /nl/accessibilite (« Toegankelijkheidsverklaring ») est en ligne, liée en pied de page (« Toegankelijkheid ») et présente dans le sitemap.
- **Police** : Figtree et Poppins sont chargées, « ë » est correct (« beëindigd »).
- **Menu et clavier** : menu mobile complet et sans débordement, aria « Menu openen ». Lien d'évitement « Naar de inhoud », focus visible.
- **Sélecteur de langue** : il conserve la page, la query et l'ancre.
- **Redirections** :
  - `/` avec nl-NL **et nl-BE** renvoie 307 vers /nl ;
  - le cookie `NEXT_LOCALE` est respecté (`NEXT_LOCALE=pl` sur `/contact` renvoie vers /pl/contact) ;
  - la 404 est en néerlandais et en noindex.
- **Formulaires** : message de consentement localisé (« Vink het vakje aan om akkoord te gaan met terugbellen. »). Les formats 06 12345678, +31 6…, 020 123 4567 et +32 470… sont acceptés.
- **Performance** : temps de chargement (load) médian de 1,26 s en desktop (max 2,7 s) et de 1,01 s en mobile (max 2,05 s).

---

## Marque (PL et NL, d'après `markets.ts`)
- **Cohérents** : « PermanenceAI » apparaît partout de façon cohérente : logo texte avec le slogan local (« Inteligentny asystent telefoniczny » / « AI-telefonieassistent »), suffixe des titles, `og:site_name`, copyright du pied de page (« © 2026 PermanenceAI — marka firmy SINAY STRATEGIC LLC »), mentions légales (« Handelsnaam: PermanenceAI ») et JSON-LD `Organization.name`.
- **Écarts** :
  - l'og:image (PL-M5 / NL-M5) ;
  - le domaine et l'email `permanenceia.com` (c'est attendu).

## Captures (`scratchpad/ui-pl-nl/shots/`)
- **Par locale `{pl,nl}`, desktop et mobile, haut de page et page entière** : `{loc}-{desktop,mobile}-{home,tarifs,offre,secteur,fonction,guide,demo,contact,essai,faq}-{top,full}.png`, soit 80 fichiers. Les captures `-full` répètent les éléments fixes (bandeau, widget) : c'est un artefact de capture.
- **Menu** : `{loc}-mobile-menu-open.png`, `{loc}-mobile-menu-submenu.png`, `{loc}-desktop-menu-dropdown.png`.
- **Widget et bandeau** :
  - `{loc}-mobile-home-bottom-overlay.png` ;
  - `{loc}-mobile-widget-{essai-gratuit,contact,demo,tarifs}.png` ;
  - `{loc}-mobile-widget-noconsent-{home,essai-gratuit,contact,offres-assistant}.png` : prises avec le cookie `pia_consent=denied`, donc bandeau fermé.
- **Pied de page** : `{loc}-desktop-footer.png`, `{loc}-desktop-footer-bottom.png`.
- **Guides** : `{loc}-desktop-guide-widget.png`.
- **Formulaires** : `{loc}-desktop-form-{contact,demo,essai-gratuit}-0-consent.png`, `{loc}-desktop-tel-input-{contact,demo,essai-gratuit}.png`.
- **Callback** : `{loc}-mobile-callback-modal.png`.
- **Démo** : `{loc}-zoom-demo-langchips.png`.
- **Prix** : `{loc}-desktop-roi.png`, `pl-desktop-tarifs-fx.png`, `crop-nl-tarifs-cards.png`.
- **Débordements NL** : `nl_cgu-overflow.png`, `nl_aide_guides_campagnes-d-appels-overflow.png`, `nl_fonctionnalites_widget-web-overflow.png`, `nl_aide_guides_outils-sur-mesure-overflow.png`, `nl_secteurs_courtiers-assurance-credit-overflow.png`.
- **Obsolètes** : `old/shots/` contient les captures du build précédent, à ne pas utiliser.

# Audit pré-publication — version néerlandaise (www.permanenceia.com/nl)

Audit du 7 octobre 2026. Il couvre :

- les 79 URL `/nl` en ligne, en desktop et en mobile ;
- une relecture intégrale de `src/i18n/content/nl/**`, environ 4 000 lignes ;
- les pages légales telles qu'elles s'affichent, les chaînes codées en dur et la base de connaissances de l'agent vocal (`kb/nl*.txt`).

Les constats communs à toutes les langues sont dans [`../audit-transverse.md`](../audit-transverse.md). Le détail ligne par ligne (environ 280 corrections) est dans `annexes/`, les captures dans `captures/`.

## Verdict

**Pas prêt à publier en l'état.**

Le néerlandais est bon à très bon :
- vouvoiement (« u ») cohérent ;
- vocabulaire métier néerlandais juste : APK, Funda, VvE-beheer, huisarts/spoedpost, zzp'er ;
- art. 11.7 Tw et Bel-me-niet cités ;
- base de connaissances conforme à l'AI Act art. 50.

Ce qui bloque :
- le consentement aux cookies ;
- des débordements horizontaux sur mobile ;
- l'absence de représentant dans l'UE ;
- quelques belgicismes et calques visibles.

## 1. Bloquants

| # | Constat | Source | Correctif |
|---|---|---|---|
| B1 | **Bandeau cookies impossible à accepter sur mobile.** La bulle du widget (iframe) recouvre « Accepteren » et intercepte le clic (`captures/nl-mobile-home-bottom-overlay.png`). | `ConsentBanner.tsx:26`, `Layout.tsx:85` | Masquer le widget tant que le visiteur n'a pas fait son choix, ou passer le bandeau au premier plan. |
| B2 | **La page /nl/cookies dit qu'il n'y a aucun cookie analytique, alors que GA4 est chargé.** La politique de confidentialité dit l'inverse. | `nl/ui/pages.ts` (T1) | Réécrire la page avec un tableau des cookies et ajouter Google aux destinataires. |
| B3 | **Aucun représentant dans l'UE (art. 27 AVG).** La verwerkersovereenkomst est incomplète au regard de l'art. 28(3) AVG. Les conditions générales prévoient que la version anglaise prévaut. | `pages.ts:336, 477`, T3, T4 | Désigner un représentant, joindre un DPA téléchargeable, revoir la clause de langue. À faire valider par un avocat néerlandais. |

## 2. Majeurs

**UI/UX**
- **Débordement horizontal sur mobile (390 px) sur 5 pages.**
  - Mots longs dans le h1 : « verkoopvoorwaarden » sur /nl/cgu, « berichtencampagne » sur le guide campagnes.
  - Bouton insécable « Bekijk het abonnement Gratis proefperiode » sur /nl/fonctionnalites/demo-live et /widget-web (`.btn` en `whitespace-nowrap`).
  - URL insécable dans le guide outils-sur-mesure.
  - Captures : `captures/nl_cgu-overflow.png`, `nl_fonctionnalites_widget-web-overflow.png`.
  - Correctif : `hyphens: auto` avec `lang="nl"`, autoriser le retour à la ligne dans `.btn`, `overflow-wrap: anywhere` pour les URL.
- **Les numéros belges au format national deviennent des numéros néerlandais.** « 0470 12 34 56 » est transformé en +31470123456 et passe la liste blanche NL (`server.ts:75-104`). L'agent appellerait alors un inconnu, et le prospect flamand ne serait jamais rappelé.
- **Le widget recouvre des CTA sur mobile.** Il subit aussi une limite de débit : erreur 429 sur 68 chargements sur 158 lors du crawl.
- **L'image de partage social est en français** (« PERMANENCE IA – AGENTS VOCAUX INTELLIGENTS »).

**Langue et contenu**
- **« Goedendag » ouvre 10 dialogues** de secteurs ainsi que la maquette d'annonce de l'agent. Aux Pays-Bas, la formule sonne flamande ou guindée : la remplacer par « Goedemorgen » ou « Goedemiddag ».
- **« massagesalons »** (`sectors.ts:294`) a une connotation érotique aux Pays-Bas : écrire « massagepraktijken ».
- **Belgicismes et calques du français :**
  - « vertrekken vanuit » (×4), « voorzie », « verwittigen » ;
  - « vergeet de accenten niet » (traduit de « gardez les accents ») ;
  - « ballon » pour la bulle de chat ;
  - « Het journaal van de AI-receptie » ;
  - « Verantwoordelijke uitgever » ;
  - « betaalkaart », qui désigne une carte de débit aux Pays-Bas.
- **Tagline incohérente :** « AI-telefonieassistent » dans `markets.ts:125`, alors que les 37 autres occurrences disent « AI-telefoonassistent ».
- **Faits contradictoires :**
  - « dertien modules » alors qu'il y en a 14 ;
  - e-commerce présenté comme « hors liste » ;
  - « 30 » ou « 80 » langues selon les pages ;
  - confirmation par e-mail promise mais jamais envoyée ;
  - mentions « Frans nummer » dans la base de connaissances (renvoi à une procédure française, sans objet ici) ;
  - le 9 octobre 2026 présenté comme un jeudi alors que c'est un vendredi.
- **Contradictions juridiques internes :**
  - DPA « op eenvoudig verzoek » d'un côté, réservé à l'offre Maatwerk de l'autre ;
  - cookies analytiques ;
  - le prestataire est nommé dans la politique de confidentialité mais pas dans les mentions légales ;
  - « uniquement des contacts consentants » d'un côté, « consentement ou relation client » de l'autre.

**Juridique et marché (à faire valider par un avocat et un fiscaliste néerlandais)**
- **Régime des conditions générales.** La section 6.5.3 BW (listes noire et grise) ne s'applique en principe pas entre professionnels qui ne sont pas tous deux établis aux Pays-Bas (art. 6:247 lid 2 BW). Les risques réels sont ailleurs :
  - le caractère déraisonnable des clauses américaines face à un zzp'er ;
  - le **Data Act** (règlement 2023/2854, applicable depuis le 12/09/2025) : changement de fournisseur, export des données, frais de sortie.
- **Démarchage :**
  - le Bel-me-niet Register reste à consulter pour le B2B ;
  - un agent IA qui appelle seul peut relever de l'art. 11.7 lid 1 Tw, ce qui exige un consentement préalable, même envers des entreprises ;
  - il faut un numéro joignable et respecter la Gedragscode Telemarketing.
- **TVA :** « excl. btw » doit être complété par « btw verlegd » (autoliquidation), et le numéro de btw doit pouvoir être saisi à l'inscription.
- **Paiement :** seule la carte est proposée. Pas d'iDEAL ni de SEPA-incasso, alors que ce sont des freins réels pour une PME néerlandaise.

## 3. Mineurs (détail dans les annexes)

- « op de Lindenlaan » au lieu de « aan de Lindenlaan » ; « Mr. / Dr. » au lieu de « mr. / dr. » ; « Spreek een adviseur » au lieu de « Spreek met een adviseur ».
- Espace avant « % » (20 % / 62%).
- « Intellectueel » au lieu de « Intellectuele eigendom ».
- Vocabulaire non harmonisé : uitsluitingslijst/blokkeerlijst, credit/tegoed/opwaardering, webbouwer/webmaster, pakket/abonnement.
- Prénom « Camille » dans les exemples ; personas Jade, Daan, Katie… sur /nl/about.
- Pas de hreflang nl-BE ; pour la Flandre, seule l'autorité de protection des données néerlandaise est citée.
- GA4 envoie un signal anonyme avant consentement (à valider).
- Titles de 61 caractères.

## 4. Manques recommandés

1. **FAQ :**
   - btw verlegd et facture ;
   - données dans l'UE ;
   - enregistrement des appels ;
   - accent néerlandais ou flamand ;
   - numéro néerlandais (085/088, géographique, 0800, règles ACM, coût du renvoi d'appel) ;
   - « maandelijks opzegbaar » ;
   - moyens de paiement.
2. **Guides :**
   - codes à une étoile pour les lignes fixes KPN/Ziggo (*21*nummer#, #21#) ;
   - applications des opérateurs ;
   - délai de renvoi de 5 à 30 s ;
   - effet de ##002# sur la boîte vocale ;
   - justificatifs pour un numéro néerlandais (KvK, adresse, Nummerplan ACM) ;
   - blocage anti-spoofing des numéros +31.
3. **Outils et réalités locales :**
   - Salonized, Treatwell, Formitable, Zenchef, Realworks, Bol.com, PostNL, Thuiswinkel Waarborg ;
   - patiëntenstop, accès direct au fysiotherapeut ;
   - Koningsdag, Sinterklaas, bouwvak.
4. **SEO :** URL en néerlandais (`/prijzen`, `/functies`, `/hulp`), mots-clés « telefonische bereikbaarheid », « AI-receptionist ».
5. **Flandre :** si elle est ciblée, ajouter hreflang nl-BE, la liste « Bel-me-niet-meer » (DNCM) et l'APD/GBA.

## Plan d'action

| Ordre | Action | Effort |
|---|---|---|
| 1 | B1 (z-index widget / bandeau) et B2 (page cookies) | 2 h |
| 2 | Débordements mobiles (césure, `.btn`, URL) | 1 h |
| 3 | Normalisation des numéros BE, validation du téléphone | 2 h |
| 4 | Goedendag, massagesalons, tagline, belgicismes, 13→14 | 2 h |
| 5 | B3 (représentant UE, DPA, clause de langue), Data Act, art. 11.7 | avocat néerlandais |
| 6 | btw verlegd, iDEAL/SEPA, FAQ | fiscaliste + produit |

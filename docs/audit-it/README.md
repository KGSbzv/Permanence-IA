# Audit pré-publication — version italienne (www.permanenceia.com/it)

Date : 7 octobre 2026.

Périmètre :
- les 80 URL `/it` en ligne, en desktop et en mobile ;
- une relecture intégrale de `src/i18n/content/it/**`, environ 4 000 lignes ;
- les pages légales rendues, les chaînes de texte écrites en dur dans le code et la base de connaissances de l'agent vocal (`kb/it*.txt`).

Constats communs à toutes les langues : [`../audit-transverse.md`](../audit-transverse.md). Le détail ligne par ligne (environ 300 corrections) est dans `annexes/`, les captures d'écran dans `captures/`.

## Verdict

**Pas prêt à publier en l'état.**

Ce qui est bon :
- l'italien est correct et bien localisé : 730/F24, Registro pubblico delle opposizioni, revisione, ASO, Garante ;
- le vouvoiement « Lei » est tenu dans le contenu ;
- les variables juridiques s'insèrent bien dans les phrases ;
- la base de connaissances de l'agent annonce l'IA et l'enregistrement dès la première phrase.

Ce qui bloque :
- le consentement cookies, impossible à refuser sur mobile ;
- le droit italien des contrats (clauses vexatoires) ;
- la fiscalité (fattura elettronica et SDI, absents) ;
- des erreurs d'hydratation React sur 36 pages.

## 1. Bloquants

| # | Constat | Source | Correctif |
|---|---|---|---|
| B1 | **Sur mobile, le refus des cookies est impossible.** À 360 px, la bulle du widget recouvre « Accetta » et « Rifiuta » ; toucher « Rifiuta » ouvre le chat (`captures/it-mobile-tap-Rifiuta.png`). C'est contraire aux lignes directrices du Garante sur les cookies. | `globals.css`, `ConsentBanner.tsx:26` | Passer le bandeau au-dessus de la bulle, ou masquer la bulle tant que le choix n'est pas fait. |
| B2 | **La page Cookie policy dit qu'il n'y a aucun cookie analytique, alors que GA4 est chargé.** L'informativa (politique de confidentialité) dit le contraire. | `it/ui/pages.ts:731-733` (T1) | Réécrire la page et ajouter le tableau des cookies. |
| B3 | **Aucune approbation spécifique des clauses vexatoires** (art. 1341-1342 c.c.). Concernées : droit du Wyoming, arbitrage AAA, renonciation à l'action collective, plafond de 1 000 USD, déchéance de 3 mois, tacite reconduction, suspension. Sans cette approbation, ces clauses sont inefficaces. | parcours d'inscription, `it/ui/pages.ts:100-107` | Ajouter une 2e case « Ai sensi degli artt. 1341 e 1342 c.c. approvo specificamente le clausole… », à valider par un avocat italien. |
| B4 | **Aucun représentant UE** (art. 27 RGPD). **Clause « prevale la versione inglese ».** | T3, T4 | — |

## 2. Majeurs

**Technique et UI/UX**
- **Erreurs d'hydratation React (#418, #425, #423) sur 36 des 80 pages** : fonctionnalités, offres, secteurs, tarifs.
  - Cause : Node formate « 1000 » alors que Chrome affiche « 1.000 ».
  - Conséquences : la page est entièrement re-rendue (chargement p90 de 4,1 s contre 1,6 s en français), et Google indexe d'autres chiffres que ceux vus par l'utilisateur.
  - Correctif : `useGrouping: 'always'` dans `src/i18n/index.tsx:48-51` et `blocks.tsx:479`.
- **Inscription** : `app.permanenceia.com/register` mélange anglais et français et affiche le logo français « PERMANENCE IA · AGENTS VOCAUX INTELLIGENTS » (`captures/it-app-register.png`).
- **URL** : les slugs restent en français (`/it/tarifs`, `/it/secteurs/...`) et `/it/prezzi` renvoie une 404.
- **Widget** : limite de débit (erreur 429), la bulle disparaît sans message.

**Fiscalité et juridique**
- **IVA**
  - La mention « IVA esclusa » est trompeuse.
  - Pour un client titulaire d'une Partita IVA : la facture est émise sans IVA (art. 7-ter DPR 633/72) et le client fait l'autofattura TD17 via le SDI.
  - Pour un particulier : l'IVA à 22 % s'applique.
  - À ajouter dans la FAQ, sous les prix et à l'art. 4 des CGU, après validation par un commercialista. C'est la question n° 1 des prospects italiens.
- **Appels automatisés**
  - Ils exigent un consentement préalable (art. 130 Codice privacy), y compris envers les clients existants. Le site répète au contraire « chiama solo i Suoi clienti, con cui ha già un rapporto ».
  - Les règles AGCOM anti-spoofing ne sont pas mentionnées : les appels venant de l'étranger qui affichent un numéro italien peuvent être bloqués (à vérifier).
- **Intérêts de retard** : 1,5 % par mois. Il faut renvoyer au D.Lgs. 231/2002 et à l'indemnité forfaitaire de 40 €.
- **Consentement** : une seule case fait « accepter » l'informativa. Il faut séparer l'information (art. 13) du consentement au rappel.
- **FAQ « Dove vengono conservati i dati »** : elle ne donne aucun lieu de conservation, alors qu'il s'agit de données de santé.

**Langue et contenu**
- **Registre incohérent**
  - Le contenu vouvoie avec majuscule de politesse (Lei, Suo, La), mais les boutons et l'interface mélangent tu, voi et infinitif :
    - « Fate squillare il mio telefono » (bouton principal de la démo) ;
    - « Scegli… » ;
    - « Torna alla home » sous « Torni alla home ».
  - Il faut choisir un registre unique. Si on garde le Lei, une majuscule de politesse est datée pour un SaaS en 2026.
- **Phrases fausses sur les 14 pages secteur** : le nom du secteur est inséré tel quel, ce qui donne par exemple « Agente studi dentistici e cliniche ». Il faut une tournure du type « Agente per … » (`components.ts:183, 422-423`, `commerce.ts:276`).
- **Calques systémiques**
  - « presa di appuntamenti » au lieu de « prenotazione appuntamenti », jusque dans deux titres de guides ;
  - « dal piano Assistant » se lit « fourni par le forfait » (16 occurrences) : écrire « a partire dal piano Assistant ».
- **Erreurs factuelles et doublon**
  - « tredici moduli » au lieu de quatorze ;
  - « e-commerce » cité comme secteur hors liste ;
  - « 30 » ou « 80 » langues selon les pages ;
  - question « Cosa succede quando finiscono i miei minuti? » présente deux fois dans la FAQ (`it/faq.ts:112-113`).
- **Vocabulaire métier** : « Broker del credito » n'est pas le bon terme. Le terme réglementé est « mediatori creditizi (OAM) ». Penser à mettre à jour la clé SECTOR_SEO en même temps.
- **Exemple d'accueil des guides** : « sono Giulia » n'annonce pas l'IA (AI Act art. 50). Même problème dans le dialogue sortant du secteur assurances.
- **Personas** : la page affiche « Jade — Receptionist AI », alors que la voix et le widget italiens sont Manuela et Marco.

## 3. Mineurs (détail dans les annexes)

- AI et IA mélangés : harmoniser sur « AI ».
- Calques : « bolla », « constatazione », « Il giornale della reception AI », « messa in servizio », « passare la mano », « richiamo » au sens de rappel téléphonique.
- « nei giorni feriali » inclut le samedi en italien.
- La pausa pranzo des exemples est à la française (12-14) ; en Italie, plutôt 13-14 h 30.
- « Richiesta creata : … » avec une espace française avant les deux-points.
- Boutons qui passent sur 2 lignes (« Richieda una richiamata »).
- Un title de 63 caractères.
- `privacyLaw` mal accordé une fois inséré (« e D.Lgs. 196/2003 … e delle altre leggi »).

## 4. Manques recommandés

1. **FAQ à créer**
   - fattura elettronica / SDI et IVA ;
   - numéro +39, justificatifs et portabilité ;
   - accents régionaux et dialectes ;
   - hébergement des données, DPA et transferts hors UE ;
   - enregistrement des appels ;
   - Ferragosto et jours fériés.
2. **Guide de renvoi d'appel** : utiliser le terme « deviazione di chiamata » et donner :
   - les menus iPhone et Android ainsi que les applis des opérateurs ;
   - l'effet de `##002#` sur la segreteria ;
   - les réglages pour les lignes fixes et la fibre.
3. **Campagnes** : ajouter le Codice di condotta telemarketing, les préfixes dédiés AGCOM et la consultation périodique du RPO. Ces points viennent de la mémoire de l'auditeur et doivent être vérifiés.
4. **Données client** : prévoir les champs Partita IVA, codice fiscale et codice destinatario/PEC.
5. **Secteurs**
   - affitti brevi (CIN, Airbnb/Booking) ;
   - RC auto à échéance (assurances) ;
   - pneus d'hiver (officine) ;
   - TheFork et channel manager (restauration et hôtels).

## Plan d'action

| Ordre | Action | Effort |
|---|---|---|
| 1 | B1 z-index du bandeau, B2 cookie policy | 2 h |
| 2 | Hydratation React (`useGrouping`) | 1 h |
| 3 | B3 clauses vexatoires, B4 représentant UE et clause de langue | avocat italien |
| 4 | FAQ IVA/SDI, mention sous les prix | rédaction 2 h + commercialista |
| 5 | Registre unique, interpolation des secteurs, 13→14, doublon FAQ | 3 h |
| 6 | Calques et compléments des guides | 0,5 j |

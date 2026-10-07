# Audit pré-publication — version polonaise (www.permanenceia.com/pl)

Audit du 7 octobre 2026. Périmètre :
- les 79 URL `/pl` en ligne, en desktop et en mobile ;
- une relecture intégrale de `src/i18n/content/pl/**` (environ 4 000 lignes) ;
- les pages légales telles qu'elles s'affichent ;
- les chaînes codées en dur ;
- la base de connaissances de l'agent vocal (`kb/pl*.txt`).

Constats communs à toutes les langues : [`../audit-transverse.md`](../audit-transverse.md). Détail ligne par ligne (environ 270 corrections) dans `annexes/`, captures dans `captures/`.

## Verdict

**Pas prêt à publier en l'état.** Le polonais est de bonne qualité :
- grammaire, diacritiques et déclinaisons corrects ;
- fonctions de pluriel `minutes()` et `days()` justes pour 1, 2, 5, 12-14, 22 et 25 ;
- vocabulaire métier juste (NFZ, badanie techniczne, mecenas/radca) ;
- l'agent vocal annonce dès la première phrase qu'il est une IA et que l'appel est enregistré.

Les blocages sont ailleurs : consentement aux cookies, démarchage (art. 398 PKE), variables juridiques mal déclinées, et protection des entrepreneurs individuels (JDG).

## 1. Bloquants

| # | Constat | Source | Correctif |
|---|---|---|---|
| B1 | **Bandeau cookies impossible à accepter sur mobile.** La bulle du widget (une iframe) recouvre « Akceptuję » et capte le clic. Bandeau, bulle et barre fixe occupent environ 40 % de l'écran (`captures/pl-mobile-home-bottom-overlay.png`). | `ConsentBanner.tsx:26`, `Layout.tsx:85` | Masquer le widget tant que le choix n'est pas fait, ou faire passer le bandeau au-dessus. |
| B2 | **/pl/cookies affirme qu'aucun cookie analytique n'est déposé, alors que GA4 est chargé.** Google n'apparaît pas parmi les sous-traitants. | `pl/ui/pages.ts:740-741` (T1) | Réécrire la page : _ga/_ga_*, durée de conservation, transfert vers les États-Unis, base art. 399 PKE. |
| B3 | **Démarchage : le site présente la relance de « ses propres clients » comme permise sans accord.** C'est la logique française du soft opt-in. En Pologne, l'art. 398 PKE exige un consentement préalable pour le marketing téléphonique et les systèmes d'appel automatisés, y compris en B2B. | `modules.ts:204`, `sectors.ts:43, 84, 485`, `guides.ts:752, 1016`, Regulamin art. 6 | Reformuler partout autour du consentement prouvable, citer l'art. 398 PKE et retirer les références à la France. À valider par un radca prawny. |
| B4 | **Aucun représentant dans l'UE (art. 27 RGPD). Clause « la version anglaise prévaut ».** | T3, T4 | — |

## 2. Majeurs

**Langue et contenu**
- **Trois variables juridiques sont au nominatif alors que la phrase demande un génitif.** Le texte affiché en ligne est donc agrammatical, par exemple « zgodnie z przepisami o ochronie danych: Rozporządzenie (UE)… oraz ustawa… ».
  - Variables concernées : `privacyLaw`, `copyrightLaw`, `dataAuthority` (`markets.ts`, bloc pl).
  - Correctif : les passer au génitif (« rozporządzenia (UE) 2016/679… », « Prezesa Urzędu Ochrony Danych Osobowych ») et retirer les deux-points des gabarits (`pages.ts:372, 513, 636, 720`).
- **Pluriels faux dans le calculateur.**
  - « {n} nieodebranych połączeń » est faux pour 1 et pour 2-4 (`ui/components.ts:312`).
  - « w tym 2 dodatkowych min » est faux aussi.
  - « Pierwsze 1 minuta » quand n = 1.
  - Correctif : utiliser la fonction `plural` existante.
- **Tutoiement et vouvoiement mélangés, visibles dès le hero.** Le site tutoie (Ty), mais les ajouts récents vouvoient (Państwo) : bandeau cookies, « Zachowują Państwo swój numer », note de change, message d'erreur téléphone (`pl/site.ts:23-25`), « według Państwa zasad » (`faq.ts:46`).
- **Terminologie.**
  - « asystent » désigne à la fois un forfait, le produit, l'aide à la rédaction et l'aide intégrée.
  - « od pakietu Asystent » (18 occurrences) se lit « envoyé par le forfait » : écrire « od pakietu Asystent wzwyż ».
  - Les crédits portent trois noms : « Kredyty » (qui veut aussi dire prêt), « środki », « doładowanie ». Un seul terme doit être retenu.
- **Contresens et calques.**
  - « doradcy zawodowi » désigne des conseillers d'orientation.
  - « Ten numer nie może być już używany w WhatsAppie » veut dire « ne pourra plus » au lieu de « ne doit pas déjà ».
  - « przy długich terminach » au lieu de « zabiegach ».
  - Phrase agrammaticale à `sectors.ts:456`.
- **Faits contradictoires :**
  - 13 modules annoncés au lieu de 14 ;
  - l'e-commerce cité comme « hors liste » ;
  - une confirmation par e-mail promise mais jamais envoyée ;
  - « numer francuski » dans la base de connaissances de l'agent vocal ;
  - base de connaissances entièrement au féminin alors qu'une voix masculine (Tomasz) existe.

**Juridique et fiscal (à valider par un avocat et un doradca podatkowy)**
- **Entrepreneurs individuels.** Ils bénéficient de la protection « przedsiębiorca na prawach konsumenta » (art. 385⁵ KC, art. 38a UPK), ce qui fragilise l'exclusion du droit de rétractation, le plafond de 1 000 USD, la prescription de 3 mois et l'arbitrage AAA. Or ce sont les principaux clients visés.
- **TVA.** « Ceny netto » est ambigu pour un vendeur américain : en B2B, le client applique l'import de services avec autoliquidation (art. 28b) et la facture ne passe pas par KSeF. Rien de tout cela n'est dit.
- **Consentements.** Le consentement au rappel est couplé à l'acceptation du Regulamin : il faut deux cases distinctes (art. 7 ust. 4 RODO).
- **Blocage des numéros (loi de 2023, à vérifier chez Autocalls).** Les appels venant de l'étranger qui affichent un numéro +48 peuvent être bloqués.

**UI/UX**
- **Le calculateur de ROI affiche une perte par défaut** (« Miesięczna oszczędność -49 $ », `captures/pl-desktop-roi.png`), avec `hourlyCost: 10` dans `markets.ts:122`. C'est incohérent avec le salaire minimum de 4 806 zł cité sur la même page.
- **Le widget masque des éléments** : le CTA principal de /pl/essai-gratuit sur mobile et les liens légaux du pied de page sur desktop.
- **L'image de partage social est en français** (« PERMANENCE IA – AGENTS VOCAUX INTELLIGENTS »).
- **Les prix sont en USD**, avec un montant en zł seulement indicatif sur les cartes de prix.

## 3. Mineurs (détail dans les annexes)

- Calques : « narzędzia na miarę », « Przesłuchaj » (au lieu de « Odsłuchaj »), « Odbierz połączenie demo », « sejfy na sekrety », « Dziennik recepcji AI », « Brokerzy kredytowi » (au lieu de « Pośrednicy »), « przegląd rejestracyjny » (au lieu de « badanie techniczne »).
- Typographie :
  - mots d'une lettre (« i », « w ») laissés en fin de ligne ;
  - « 2026 » sans « r. » ;
  - espace française avant les deux-points ;
  - séparateur des milliers incohérent.
- Titles de 65 caractères ; seul le mot-clé « asystent głosowy AI » est ciblé.
- Personas Jade, Daan, Katie… affichés sur /pl/about.

## 4. Manques recommandés

1. **FAQ :**
   - faktura VAT, KSeF et autoliquidation (NIP) ;
   - paiement en USD et frais de change ;
   - numéro +48 et portabilité ;
   - enregistrement des appels (art. 13 RODO) ;
   - accents régionaux et ukrainien ;
   - hébergement des données (UE ou États-Unis), DPA ;
   - secret professionnel des avocats.
2. **Guides :**
   - achat d'un numéro polonais (justificatifs NIP/KRS/CEIDG, types de numéros) ;
   - codes de renvoi pour les lignes fixes Orange ;
   - blocage anti-spoofing ;
   - art. 398 PKE, sanctions UKE et UOKiK.
3. **Outils locaux** à citer, ou à déclarer honnêtement absents : Booksy, ZnanyLekarz, Allegro, BaseLinker, InPost, BLIK, Przelewy24, Otodom, OLX.
4. **SEO :** « wirtualna sekretarka / recepcjonistka », « voicebot », « automatyczna sekretarka AI ».
5. **Calendrier :** Wigilia, Wszystkich Świętych, długi weekend majowy.

## Plan d'action

| Ordre | Action | Effort |
|---|---|---|
| 1 | B1 (z-index du widget et du bandeau), B2 (page cookies) | 2 h |
| 2 | Variables juridiques au génitif, pluriels du calculateur | 1 h |
| 3 | Registre unique Ty (bandeau, `site.ts`, FAQ) | 1 h |
| 4 | B3 (art. 398 PKE dans tous les fichiers) | rédaction 3 h + radca prawny |
| 5 | Calculateur de ROI (défaut positif), terminologie asystent / kredyty | 2 h |
| 6 | JDG, TVA et KSeF, représentant UE, clause de langue | avocat + doradca podatkowy |

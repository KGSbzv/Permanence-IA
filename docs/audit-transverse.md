# Audit pré-publication — constats transverses (toutes langues)

Date : 7 octobre 2026. Ces constats valent pour plusieurs langues. Les corriger une fois, dans le code commun ou dans la source française, règle le problème partout.

Les synthèses par langue renvoient ici :

- [Français](audit-fr/README.md)
- [Italien](audit-it/README.md)
- [Polonais](audit-pl/README.md)
- [Néerlandais](audit-nl/README.md)
- [Hébreu](audit-he/README.md)

**Version auditée.** Les textes ont d'abord été relus sur le commit `f35bc53`. Chaque constat ci-dessous a ensuite été revérifié sur `main` en date du 7 octobre 2026, commit `8c8a071`, qui inclut les corrections issues de l'audit hébreu. La mention « toujours présent » renvoie à cette seconde vérification. Les numéros de ligne des annexes renvoient à `f35bc53` : ils peuvent avoir légèrement bougé depuis.

## Bloquants

| # | Constat | Langues | Vérifié sur `main` | Correctif |
|---|---|---|---|---|
| T1 | **Page Cookies fausse.** GA4 (`G-4W1B1W52PZ`, consentement v2) est chargé depuis le commit `9f7cbeb`. La page Cookies affirme pourtant qu'aucun cookie de mesure d'audience n'est déposé (par exemple `fr/ui/pages.ts:764-765`). Google Analytics manque aussi dans la liste des destinataires de la politique de confidentialité. Enfin, le mode consentement applique le même choix à `ad_storage`, `ad_user_data` et `ad_personalization`, alors que la politique dit « pas de cookies publicitaires ». | toutes, hébreu compris | toujours présent | Réécrire la page Cookies avec un tableau (`_ga`, `_ga_<ID>`, 13 mois, Google), ajouter Google aux destinataires, et forcer `ad_*` à `denied` ou les déclarer. |
| T2 | **Le widget empêche de répondre au bandeau cookies sur mobile.** La bulle (`z-index:70`, `globals.css`) passe au-dessus du bandeau (`z-[60]`, `ConsentBanner.tsx:26`). Toucher « Accepter » ou « Refuser » ouvre le chat. En italien à 360 px, il devient impossible de refuser. | FR, IT, PL, NL | constaté en ligne sur les 4 langues | Passer le bandeau en `z-[75]`, ou masquer la bulle tant que l'utilisateur n'a pas fait son choix. |
| T3 | **Aucun représentant dans l'UE** (art. 27 RGPD). Une LLC américaine sans établissement dans l'UE vise des clients européens et traite leurs données. | FR, IT, PL, NL | toujours absent | Désigner un représentant et l'indiquer dans la politique de confidentialité. |
| T4 | **Les CGU font prévaloir la version anglaise** (« la version anglaise prévaut »), alors que les clauses propres à chaque pays n'existent que dans les versions locales. | toutes | toujours présent (`fr/ui/pages.ts:510`) | Faire prévaloir la version locale, ou au moins préciser de quelle version anglaise il s'agit et la rendre accessible. Validation par un avocat. |

## Majeurs

| # | Constat | Vérifié sur `main` | Correctif |
|---|---|---|---|
| T5 | **« Treize modules »** annoncé alors que 14 sont affichés (`ui/commerce.ts`). | toujours présent en FR, IT, PL et NL | « Quatorze ». |
| T6 | **E-commerce cité parmi les secteurs « hors liste »**, alors qu'il fait partie des 14 secteurs. | toujours présent en FR, IT, PL et NL | Retirer « e-commerce » de la liste. |
| T7 | **Contradiction sur l'accord de traitement des données (DPA).** La page Sécurité dit « fourni sur simple demande », l'article 8 des CGU le réserve au forfait Sur mesure. | toutes | Aligner les deux pages. |
| T8 | **Confirmation par e-mail promise** après une demande de rappel. `api/callback.ts` ne prévient que l'équipe et n'envoie rien au visiteur. | toujours présent | Envoyer l'e-mail, ou retirer la promesse. |
| T9 | **CGU de modèle américain** : arbitrage AAA à Cheyenne en anglais, renonciation à l'action collective, prescription de 3 mois, plafond de 1 000 USD, intérêts de 1,5 % par mois. Ces clauses sont fragiles dans chaque pays visé : en France, art. 2254 C. civ. et L442-1 C. com. ; en Italie, clauses vexatoires des art. 1341-1342 c.c., qui exigent une approbation spécifique ; en Pologne, entrepreneurs individuels protégés (art. 385⁵ KC) ; aux Pays-Bas, Data Act. | — | Faire revoir par un avocat local dans chaque pays. |
| T10 | **« HT » ambigu avec des prix en USD.** Une LLC américaine ne facture pas la TVA locale : le client professionnel de l'UE l'autoliquide (Italie : autofattura TD17 et SDI ; Pologne : import de services et KSeF ; Pays-Bas : btw verlegd). Aucune langue ne l'explique. Depuis `8c8a071`, un montant indicatif en devise locale est affiché, mais la facture reste en USD. | — | Ajouter une FAQ par pays et une mention sous les prix, à valider par un expert-comptable local. |
| T11 | **Appels sortants.** Le site présente la relance des « propres clients » comme sûre. C'est faux pour les appels automatisés : en France, L34-5 CPCE et opt-in du 11 août 2026 pour les consommateurs ; en Italie, art. 130 du Codice privacy ; en Pologne, art. 398 PKE, sans exception B2B ; aux Pays-Bas, art. 11.7 Tw et Bel-me-niet pour le B2B. | — | Formulations par pays, validées par un avocat. |
| T12 | **AI Act, art. 50** (applicable depuis le 2 août 2026). Les bases de connaissances des agents l'appliquent bien. En revanche, les exemples d'accueil des guides (« Julie à l'appareil », « Giulia ») et plusieurs dialogues sortants n'annoncent pas qu'il s'agit d'une IA. La page Sécurité présente l'annonce IA comme un réglage, donc désactivable. | — | Annonce IA non désactivable, et exemples corrigés dans toutes les langues. |
| T13 | **« Où sont conservées les données ? »** Cette question de FAQ (secteurs santé) ne donne jamais de lieu. Pour la France, l'hébergement des données de santé (HDS) n'est pas mentionné. | toutes | Indiquer le pays d'hébergement, les sous-traitants et les garanties de transfert. |
| T14 | **Personas** Jade, Daan, Katie… affichés sur toutes les langues (`personas.ts`), sans rapport avec les voix du marché. Le prénom de l'assistante varie aussi en français : Jade, Léa, Lucie. | toujours présent | Ordre de l'équipe et prénoms par marché. |
| T15 | **Note de démo envoyée à l'agent en anglais** (`LiveDemo.tsx:337`, auparavant en français). Le créneau est envoyé en français (« Créneau souhaité : Demain matin »), et l'agent lit `request_note` à l'ouverture de l'appel. | partiellement corrigé | Localiser la note et le créneau, ou interdire leur lecture à voix haute dans la base de connaissances. |
| T16 | **Mention « numéro français »** restée dans les bases de connaissances NL et PL (`nl-situations.txt`, `nl.txt`, `pl-situations.txt`). Il s'agit d'un renvoi à une procédure française, sans objet pour ces marchés. | toujours présent | Supprimer ou adapter au marché. |
| T17 | **Calculateur de ROI** : le coût horaire est désormais propre à chaque marché (`markets.ts`, `hourlyCost`). En PL (10 USD/h), le calculateur affiche par défaut une **perte** (« Miesięczna oszczędność -49 $ »), ce qui est contre-productif sur la page tarifs. | PL constaté en ligne | Choisir un volume par défaut qui montre un gain, ou revoir la valeur. |
| T18 | **Slugs d'URL en français** dans toutes les langues (`/it/tarifs`, `/pl/secteurs/...`), et `/it/prezzi` renvoie une 404. | — | Décision SEO à prendre. Si les slugs changent, prévoir les redirections 301. |
| T19 | **Incohérences héritées de la source française** et reprises dans toutes les langues : menu « Calls » au lieu de « Calls history », `{customer_name}` au lieu de `{{customer_name}}`, rôle de « Test assistant » (chat ou voix), « Flow builder » employé pour deux outils différents, « 30 » ou « 80 » langues, « liste de blocage » ou « liste d'exclusion ». | — | Corriger dans `fr/`, puis reporter dans chaque langue. |

| T20 | **Normalisation des numéros** : un numéro belge ou suisse saisi au format national (« 0470… », « 079… ») est converti en +33 (FR) ou +31 (NL). L'agent appellerait alors un inconnu (`lib/server.ts:75-104`). | constaté | Demander l'indicatif pays, ou refuser les formats nationaux ambigus. |
| T21 | **Validation du téléphone** inopérante : le motif `[+0-9][0-9 .()\-]{6,}` est invalide pour Chrome, qui l'ignore, si bien que « abcdefgh » est accepté (`ui.tsx:175`). | constaté | Corriger la regex (échapper le tiret, flag `v`). |
| T22 | **Widget Autocalls** : limite de débit (429) sur 25 à 43 % des chargements en rafale, la bulle disparaît alors sans message. Sur mobile, elle recouvre aussi des CTA et des liens légaux. | constaté | Relever la limite chez Autocalls, ou charger le widget plus tard. Le positionner au-dessus de la barre mobile. |
| T23 | **Image de partage social** en français (« PERMANENCE IA – AGENTS VOCAUX INTELLIGENTS ») sur toutes les langues. Page d'inscription `app.permanenceia.com/register` en anglais (FR) ou mélangée et à la marque FR (IT). | constaté | Une image OG et une marque par marché. |

## Ce qui a été corrigé entre l'audit hébreu et cette vérification

- Une déclaration d'accessibilité est en ligne (`/accessibilite`). Elle reste à compléter : voies de recours RGAA, AgID.
- Le contraste du mot-clé turquoise `.kw` est corrigé, à 4,92:1. D'autres textes turquoise restent à 2,97:1.
- L'e-mail du code de vérification est localisé quand l'assistante transmet `lang`. Sinon, il part en français et en anglais.
- Les codes de renvoi d'appel sont isolés en gauche-à-droite dans les guides.

# Documents de connaissance Autocalls à supprimer (mis à jour le 8 octobre 2026)

Les documents **v10** sont importés et actifs dans les 6 bases (8 octobre, entre 09:15 et 09:55 UTC). Ils reprennent les pages en ligne du site après le dernier déploiement : /kb/<langue>, /kb/<langue>-situations, tarifs, FAQ, aide (guides), secteurs, sécurité, confidentialité, CGU et fonctionnalités.

Tous les documents listés ci-dessous sont remplacés. Tant qu'ils restent dans une base, les agents peuvent encore citer d'anciens textes : la grille « 100 crédits = 1 $ » et les numéros « dès 5,99 $ » dans les v7, l'absence de la ligne britannique +44 7367 090106 et les recharges à montants fixes dans les v9.

L'API Autocalls ne permet de modifier que le nom et la description d'un document, pas son contenu. Il n'est donc pas possible de « mettre à jour » un ancien document : seule la suppression le retire des réponses des agents.

**Où les supprimer :** app.autocalls.ai, menu **Knowledge base**, ouvrir la base, puis supprimer chaque document par son ID. Action irréversible, à faire par le propriétaire.

## Documents à garder (v10 actifs)

| Base | IDs v10 |
|---|---|
| 6163 Français | 25161, 25164, 25166, 25167, 25168, 25169, 25170, 25171, 25172, 25173 |
| 6166 English (UK et Australie) | 25174, 25175, 25176, 25177, 25178, 25179, 25180, 25182, 25183, 25184 |
| 6167 Italiano | 25185, 25187, 25188, 25189, 25190, 25191, 25193, 25194, 25195, 25196 |
| 6168 Polski | 25197, 25198, 25199, 25200, 25201, 25202, 25204, 25205, 25206, 25207 |
| 6169 Nederlands | 25208, 25209, 25210, 25211, 25212, 25214, 25215, 25216, 25217, 25218 |
| 6180 עברית | 25219, 25220, 25221, 25222, 25223, 25224, 25227, 25228, 25230, 25233 |

Garder aussi les documents « détail des modules » (/kb/modules/...) s'il en existe en dehors des listes ci-dessous.

## 1. Anciens documents v7 (7 octobre, avant 11:35 UTC)

| Base | IDs |
|---|---|
| 6163 Français | 24899, 24921, 24954, 24955, 24961, 24967, 24968, 24972 |
| 6166 English | 24900, 24914, 24915, 24920, 24950, 24951, 24952, 24953, 24973 |
| 6167 Italiano | 24901, 24922, 24923, 24924, 24925, 24926, 24927, 24928, 24974 |
| 6168 Polski | 24902, 24929, 24930, 24931, 24932, 24933, 24934, 24935, 24975 |
| 6169 Nederlands | 24903, 24936, 24937, 24938, 24939, 24940, 24941, 24942, 24976 |
| 6180 עברית | 24904, 24943, 24944, 24945, 24946, 24947, 24948, 24949, 24977 |

Les « Fonctionnalités — détail des modules (v7) » (24972 à 24977) sont remplacés par les documents « Fonctionnalités (v10) », qui lisent la page Fonctionnalités et ses pages de modules.

## 2. Documents v9 actifs, remplacés par les v10

| Base | IDs |
|---|---|
| 6163 Français | 25001, 25002, 25003, 25007, 25048, 25049, 25050, 25160 |
| 6166 English | 25008, 25010, 25011, 25012, 25015, 25051, 25066, 25071 |
| 6167 Italiano | 25016, 25018, 25020, 25022, 25023, 25054, 25055, 25056 |
| 6168 Polski | 25024, 25026, 25028, 25029, 25031, 25057, 25059, 25068 |
| 6169 Nederlands | 25032, 25033, 25035, 25037, 25038, 25060, 25062, 25069 |
| 6180 עברית | 25040, 25041, 25042, 25044, 25045, 25063, 25065, 25070 |

25160 « Fonctionnalités (v9) » (créé le 8 octobre à 09:06) a le même contenu que 25173 « Fonctionnalités (v10) » : l'un des deux suffit.

## 3. Créations en échec, vides (statut « failed »)

- v9 du 7 octobre : 25004, 25005, 25006, 25009, 25013, 25014, 25017, 25019, 25021, 25025, 25027, 25030, 25034, 25036, 25039, 25043, 25046, 25047, 25052, 25053, 25058, 25061, 25064, 25067
- v10 du 8 octobre : 25165, 25181, 25186, 25203 (chaque document a été recréé aussitôt avec succès)

Une base apparaît « en échec » tant qu'elle contient un de ces documents. Ils ne contiennent rien : leur suppression ne retire aucune information.

## 4. Base multilingue 6209 (créée le 8 octobre, 10:30-10:57 UTC)

Les 35 autres documents de cette base sont actifs et à garder. À supprimer :
- 25239 « FR — Fonctionnalités (v10) » : création en échec, vide (recréée aussitôt en 25240).
- 25234 « FR — Processus (v10) » : resté 17 minutes en traitement, puis actif. Il fait doublon avec 25245 (même page /kb/fr) : garder l'un des deux.

Réimport prévu ici aussi : quand les guides « assistante virtuelle » seront corrigés sur le site, recréer dans 6209 les 5 documents de guides concernés (25238 fr, 25250 en, 25255 it, 25260 pl, 25265 nl), puis supprimer les anciens.

## Ordre conseillé

1. Vérifier dans chaque base que les v10 du tableau « à garder » sont « Active ».
2. Supprimer les créations en échec (point 3), puis les v7 (point 1), puis les v9 (point 2).
3. Vérifier que chaque base repasse au statut « active » et que les agents y sont toujours rattachés (aucun changement de rattachement n'est nécessaire : les agents lisent la base, pas un document précis).

## Réimporter après une mise à jour du site

Les documents « site web » ne se mettent pas à jour seuls : Autocalls lit la page une seule fois, à la création. Après un déploiement qui modifie src/data/kb/*.txt ou les textes de src/i18n/content/<langue> (tarifs, FAQ, guides, secteurs, sécurité, CGU, confidentialité, fonctionnalités) :

1. Attendre le déploiement (environ 6 minutes) et vérifier qu'une phrase nouvelle apparaît sur la page en ligne.
2. Créer le nouveau document par l'outil create-document du MCP Autocalls (ou Knowledge base > Add document > Website), **un seul à la fois** : deux créations lancées à quelques secondes d'intervalle échouent souvent. Attendre le statut « Active » avant le suivant ; relancer une fois en cas d'échec.
3. Liens à suivre (relative_links_limit) : 1 pour /kb/... , tarifs, FAQ, sécurité, CGU et confidentialité ; 50 pour /aide (pour inclure les guides) ; 30 pour /secteurs ; 20 pour /fonctionnalites.
4. Ajouter ici les anciens IDs à supprimer.

Réimport déjà prévu : les guides (/aide) contiennent encore l'exemple d'accueil « assistante virtuelle » (sans « IA ») en français, anglais, italien, polonais et néerlandais. Une fois ces textes corrigés et déployés, recréer les 5 documents « Guides » (25168, 25178, 25190, 25201, 25212) puis ajouter ces 5 IDs à la liste des documents à supprimer.

URL par base : 6163 sans préfixe ; 6166 /en-gb/ ; 6167 /it/ ; 6168 /pl/ ; 6169 /nl/ ; 6180 /he/. Les pages /kb/ n'ont pas de préfixe : /kb/fr, /kb/en, /kb/it, /kb/pl, /kb/nl, /kb/he et leurs versions « -situations ».

# Bases de connaissances Autocalls (mis à jour le 8 octobre 2026, 19 h UTC)

## Ce qui a été fait le 8 octobre au soir (accord du propriétaire)

Autocalls l'a confirmé par écrit : un agent lit **tous** les documents actifs de sa base. Les anciennes bases mélangeaient les versions v7, v9, v10 et v11 des mêmes pages, et les agents citaient d'anciens prix.

Claude a donc créé 7 bases neuves, sans rien supprimer :
- une seule version par page ;
- lue sur le site **après** les corrections du soir : 200 crédits dans Réceptionniste, 100 crédits pour 1 $, recharge dès 5 $, CGU, page sécurité, préférences e-mail.

Puis il a rattaché les 41 agents à la base de leur langue. Les 95 documents sont actifs, sans aucune création en échec, et les 7 bases sont « active ». Un contrôle indépendant a relu les 41 agents : aucun ne pointe encore vers une ancienne base, et aucun n'est bloqué par le contrôle de conformité.

| Nouvelle base | Remplace | Documents |
|---|---|---|
| 6213 Français | 6163 | 10 : 25342 à 25351 |
| 6214 English (UK et Australie) | 6166 | 10 : 25353 à 25362 |
| 6215 Italiano | 6167 | 10 : 25363 à 25372 |
| 6216 Polski | 6168 | 10 : 25373 à 25382 |
| 6218 Nederlands | 6169 | 10 : 25386 à 25395 |
| 6219 עברית | 6180 | 10 : 25396 à 25405 |
| 6220 multilingue (WhatsApp, Messenger, espace client) | 6209 | 35 : 25406 à 25440 |

| Base | Agents rattachés |
|---|---|
| 6213 | 21179, 21182, 21183, 21203, 21269, 21270 |
| 6214 | 21206, 21207, 21231, 21232, 21236, 21237, 21271, 21272, 21273, 21274, 21376 |
| 6215 | 21208, 21233, 21238, 21275, 21276 |
| 6216 | 21209, 21234, 21239, 21277, 21278 |
| 6218 | 21210, 21235, 21240, 21279, 21280 |
| 6219 | 21306, 21307, 21308, 21309, 21310, 21314 |
| 6220 | 21205, 21297, 21358 |

## À faire par le propriétaire (sans urgence)

Supprimer les 7 anciennes bases entières : Autocalls > Knowledge base. Plus aucun agent ne les lit.
- 6163, 6167, 6168, 6169, 6180 et 6209 sont renommées « ANCIENNE, plus utilisée — … ».
- 6166 (English) garde son nom : son renommage a été refusé par le contrôle de sécurité de Claude Code. Elle n'a plus aucun agent.

Claude ne supprime jamais de données définitivement. Pour revenir en arrière, il suffit de rattacher un agent à son ancienne base.

## Réimporter après une mise à jour du site

Les documents « site web » ne se mettent pas à jour seuls : Autocalls lit la page une seule fois, à la création.

Après un déploiement qui modifie src/data/kb/*.txt ou les textes de src/i18n/content/<langue> :
1. Vérifier qu'une phrase nouvelle apparaît sur la page en ligne.
2. Recréer les documents concernés par l'outil create-document du MCP Autocalls, **un seul à la fois**, et attendre le statut « Active » avant le suivant.
3. Liens à suivre (relative_links_limit) :
   - 1 pour /kb/..., tarifs, FAQ, sécurité, CGU et confidentialité ;
   - 50 pour /aide ;
   - 30 pour /secteurs ;
   - 20 pour /fonctionnalites.
4. Noter ici l'ancien document, à supprimer par le propriétaire.

Pour beaucoup de pages modifiées à la fois, mieux vaut reconstruire une base neuve, comme le 8 octobre : il n'y a alors qu'une base entière à supprimer.

URL par base :
- 6213 : sans préfixe ;
- 6214 : /en-gb/ ;
- 6215 : /it/ ;
- 6216 : /pl/ ;
- 6218 : /nl/ ;
- 6219 : /he/.
- 6220 (multilingue) : les 10 pages françaises, plus processus, situations, tarifs, FAQ et guides de chaque autre langue.

Les pages /kb/ n'ont pas de préfixe (/kb/fr, /kb/en, /kb/it, /kb/pl, /kb/nl, /kb/he et leurs versions « -situations »).

# Bases de connaissances Autocalls (mis à jour le 8 octobre 2026, nuit)

## Bases utilisées par les agents

Elles datent du 8 octobre au soir, avec une version par page du site :
- nouveau numéro israélien 03-382-7709, avec son WhatsApp ;
- 200 crédits inclus dans Réceptionniste ;
- achat de crédits à 100 crédits pour 1 $ ;
- recharge de minutes dès 5 $.

| Base | Langue | Documents | Agents |
|---|---|---|---|
| 6223 | Français | 10 | 21179, 21182, 21183, 21203, 21269, 21270 |
| 6224 | Anglais (Royaume-Uni et Australie) | 10 | 21206, 21207, 21231, 21232, 21236, 21237, 21271 à 21274, 21376 |
| 6225 | Italien | 10 | 21208, 21233, 21238, 21275, 21276 |
| 6226 | Polonais | 10 | 21209, 21234, 21239, 21277, 21278 |
| 6227 | Néerlandais | 10 | 21210, 21235, 21240, 21279, 21280 |
| 6229 | Multilingue (WhatsApp, Messenger, espace client) | 35 | 21205, 21297, 21358 |
| 6230 | Hébreu | 10 | 21306 à 21310, 21314 |

Tous les documents sont actifs, sans aucune création en échec. Un contrôle indépendant a vérifié les 41 agents :
- chacun utilise la bonne base ;
- aucun n'est bloqué par la conformité ;
- aucune instruction ne contredit le site.

La base 6229 s'affiche « processing » alors que ses 35 documents sont actifs : c'est un retard d'affichage d'Autocalls, et l'agent lit les documents actifs.

Les processus des langues autres que l'hébreu ont été lus avant l'ajout du WhatsApp israélien sur le site. Ils indiquent encore le +33 pour tous les pays, ce qui reste exact, puisque ce numéro répond aussi en hébreu. Les instructions des agents, elles, donnent bien le WhatsApp israélien pour Israël.

## À supprimer par le propriétaire (plus aucun agent ne les lit)

8 anciennes bases, toutes nommées « ANCIENNE, plus utilisée — … » :
- 6213, 6214, 6215, 6216, 6218 et 6220 : version du 8 octobre, avant le nouveau numéro israélien ;
- 6219 et 6228 : anciennes bases hébreu.

Liens : https://app.autocalls.ai/knowledgebases/6213, …/6214, …/6215, …/6216, …/6218, …/6219, …/6220, …/6228. Le bouton Delete est sur chaque ligne de https://app.autocalls.ai/knowledgebases.

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
- 6223 : sans préfixe ;
- 6224 : /en-gb/ ;
- 6225 : /it/ ;
- 6226 : /pl/ ;
- 6227 : /nl/ ;
- 6230 : /he/.
- 6229 (multilingue) : les 10 pages françaises, plus processus, situations, tarifs, FAQ et guides de chaque autre langue.

Les pages /kb/ n'ont pas de préfixe (/kb/fr, /kb/en, /kb/it, /kb/pl, /kb/nl, /kb/he et leurs versions « -situations »).

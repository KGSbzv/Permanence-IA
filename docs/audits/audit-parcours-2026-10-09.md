# Audit des parcours : prospect, essai, client, administration (9 octobre 2026)

**Pour qui :** le propriétaire de PermanenceAI.

**Comment :** contrôle en lecture seule, le 9 octobre 2026. Il y a eu sept contrôles séparés : site, canaux, inscription et essai, client actif, administration, relances, CRM. Chaque défaut a ensuite été contre-vérifié. Rien n'a été modifié : aucun réglage, aucun compte, aucun message envoyé, aucun formulaire soumis. La base de données de production et les secrets n'ont pas été lus.

**Hors champ :** la page « Mon compte » (/mon-compte), en cours de construction.

**Dépôt public :** ce fichier ne contient ni numéro personnel, ni adresse personnelle, ni secret.

### Mots utiles

- **Agent** : l'assistant d'IA, vocal ou écrit, qui tourne chez Autocalls.
- **Autocalls** : la plateforme qui fait tourner les agents et l'espace client app.permanenceia.com.
- **Supabase** : la base de données du site (contacts, demandes de rappel, relances).
- **Webhook** : message automatique qu'un service (Stripe, Autocalls) envoie au site quand quelque chose se passe : un paiement, une fin d'appel.
- **Série de relances** : suite d'e-mails envoyés automatiquement par le site selon la situation du contact (séries P, I, C, F, U, M ; voir § 6).
- **Message de service** : e-mail lié au contrat (aide pour démarrer, fin d'essai). Il part sans case « marketing ».
- **Message commercial** : e-mail de vente. Il faut une base légale, le plus souvent la case cochée.
- **Campagne d'appel** : file d'attente d'appels sortants dans Autocalls. Ici, elles ne servent qu'aux rappels demandés par la personne.
- **Jeton** : mot de passe technique entre deux services.
- **UTM** : étiquettes ajoutées à l'adresse d'une page par une publicité, pour savoir d'où vient le visiteur.

## 1. En bref

1. **Ce qui marche :** le site (539 pages en 7 langues, aucun lien mort, prix justes partout), les widgets, WhatsApp, Messenger, les deux lignes téléphoniques et les demandes de rappel sont en ligne et bien reliés.
2. **Relances :** les e-mails de relance tournent chaque heure en envoi réel, mais seulement en français et en anglais (Royaume-Uni, Australie). Ils n'ont encore rien envoyé, car il n'y a aucun vrai client.
3. **Aucun défaut bloquant**, rien n'est cassé. Le premier risque : rien n'a jamais tourné en réel (aucun essai, aucun abonnement, aucun appel sortant). Cinq vérifications sont à faire avant toute publicité.
4. **Ce qui manque :** aucune relance du client qui n'a pas créé d'agent, aucune relance par téléphone ou WhatsApp après l'essai, et l'équipe n'est prévenue ni d'un essai, ni d'un nouvel abonné, ni d'une résiliation.
5. **CRM : pas besoin.** Il faut ajouter au moteur actuel une série « mise en route » et une liste quotidienne « à faire aujourd'hui », soit 2 à 3 jours de travail pour Claude Code.

## 2. Parcours prospect (site, téléphone, WhatsApp, Messenger)

### Ce qui fonctionne (vérifié le 9 octobre)

**Site**
- Les 539 adresses du plan du site répondent sans erreur, ainsi que 582 liens internes et 63 images. Les pages d'erreur 404 sont propres dans les 7 langues.
- Les anciennes adresses mènent à la bonne page. permanenceia.com renvoie vers www en gardant la page demandée et les UTM.
- La langue du navigateur est respectée : italien vers /it, hébreu vers /he, autre langue vers /en-gb.
- Référencement : chaque page a son adresse de référence et ses liens vers les 7 autres versions. L'hébreu s'affiche de droite à gauche.
- Les prix sont identiques partout, y compris dans les données lues par Google et dans le PDF français :
  - 0, 99, 249 et 499 US$ par mois ;
  - 990, 2 490 et 4 990 US$ par an ;
  - les minutes, les recharges, et l'essai de 14 jours avec 30 minutes.
- Cookies : sans accord, rien ne part vers Google ni vers Meta. Google Analytics et le pixel Meta ne se chargent qu'après « Accepter ».
- La mesure est en place pour quatre actions : demande de rappel, clic WhatsApp, clic téléphone, clic vers l'essai.
- Page /essai-gratuit : l'e-mail, la langue, la page d'origine et les UTM sont enregistrés avant l'envoi vers l'inscription.
- Le pop-up d'essai s'ouvre au plus une fois par semaine.
- Les protections de sécurité habituelles des pages sont présentes.

**Demandes de rappel (formulaire, démo, agents)**
- Le serveur vérifie :
  - l'accord de la personne et le format du numéro ;
  - la date : 30 jours au plus, dans les heures d'ouverture ;
  - un piège contre les robots ;
  - des limites : 3 demandes par numéro sur 7 jours, 50 appels automatiques par jour ;
  - la liste « ne plus appeler ».
- Si l'appel ne peut pas partir, l'équipe reçoit « À rappeler à la main ».
- Les 14 automatisations de rappel (7 marchés, commercial et support) sont actives. Aucun échec depuis le 7 octobre.
- Les 21 campagnes d'appel sont actives. Toutes font au plus 2 nouvelles tentatives, espacées de 4 heures, avec les bons fuseaux et les bonnes plages horaires. Revérifié pour ce rapport.
- Une demande annulée ou remplacée n'est pas appelée : un contrôle a lieu juste avant l'appel.

**Téléphone, WhatsApp, Messenger, widgets**
- Deux numéros sont sur le compte : la ligne UK +44 7367 090106 (agent Katie) et la ligne Israël +972 3-382-7709 (agent Noa).
- Chaque agent contrôlé a sa base de connaissances active et ses outils : identifier le contact, fiche prospect, rappel, ticket, dossier client, date et heure, « ne plus appeler ».
- Chaque accueil annonce l'IA et l'enregistrement. Les rappels ajoutent « vous pouvez refuser à tout moment ».
- Au téléphone et sur WhatsApp, « ne plus m'appeler » annule les rappels prévus et met le numéro en liste noire chez Autocalls (3 réussites sur 3 le 9 octobre).
- Les fins d'appel et de conversation arrivent au site par un relais Autocalls : 5 réussites sur 5, et l'appel réel du 8 octobre est bien arrivé.
- WhatsApp : les liens pointent vers +33 7 45 46 04 46, et vers +972 sur le site hébreu. Le premier message est prérempli dans la langue. L'expéditeur +33 est en ligne, avec une note de qualité « haute ».
- Les 14 widgets (voix féminine et masculine, 7 langues) sont actifs. m.me/permanenceia mène bien à la Page Facebook.
- Aucun agent n'est bloqué par le contrôle de conformité d'Autocalls.

### À corriger

| Problème | Gravité | Qui |
|---|---|---|
| Une personne laisse son e-mail sur /essai-gratuit puis abandonne l'inscription : personne ne la relance, et l'équipe n'est pas prévenue. | Important | Claude Code |
| Chaque page charge les textes des 7 langues : environ 540 Ko compressés à télécharger, 1,8 Mo à traiter. C'est lent sur mobile, là où arrive la publicité Meta. | Important | Claude Code |
| Espace client (app.permanenceia.com) : Google Analytics se charge avant tout accord, et les signaux publicitaires Google sont accordés en même temps que la mesure. C'est contraire à la page cookies. | Important | Claude Code rédige, le propriétaire colle |
| Les vrais essais et abonnements ne sont mesurés ni dans Google Analytics ni dans Meta. Les publicités ne peuvent s'optimiser que sur des clics. | Important | Claude Code, après avis de l'avocat |
| Messenger : « ne plus me contacter » n'annule pas un rappel déjà demandé, alors que l'agent confirme le contraire. Le même outil est utilisé par l'assistante de l'espace client et par les 14 widgets. | Important | Claude Code |
| Ligne Israël : les fournisseurs, journalistes et démarcheurs sont enregistrés comme demandes de rappel, avec un accord qu'ils n'ont pas donné, puis appelés par l'IA commerciale. La ligne UK, elle, leur donne l'adresse contact@. | Important | Claude Code |
| Un rappel programmé (« demain », date choisie) n'a jamais été observé jusqu'à l'appel, et aucune alerte ne prévient si la reprise échoue. Premier cas réel : dimanche 11 octobre, 07 h 30 UTC. | Important | Propriétaire, Claude Code vérifie |
| Aucun appel sortant n'a jamais eu lieu. La ligne UK, Messenger et le WhatsApp israélien n'ont reçu aucun message réel. Les agents ont été modifiés le 9 octobre sans nouveau test. Lors du seul appel réel (8 octobre), l'agent a raccroché au moment où l'appelant demandait les prix ; la question « Autre chose ? » ajoutée depuis n'a pas été testée. | Important | Propriétaire |
| Les UTM et la page d'arrivée sont perdus dès la deuxième page visitée. | Mineur | Claude Code |
| Le pop-up « 30 minutes offertes » s'affiche aussi dans les guides d'aide et sur la page de désinscription. | Mineur | Claude Code |
| Les formulaires n'indiquent pas de méthode d'envoi : si la personne valide avant que la page soit prête, ses coordonnées peuvent se retrouver dans l'adresse de la page. | Mineur | Claude Code |
| Au retour arrière depuis l'inscription, le bouton « Créer mon compte gratuit » reste grisé. | Mineur | Claude Code |
| Les pages vues sont peut-être comptées deux fois (Google et Meta). | Mineur | Propriétaire (contrôle) |
| Les clics Messenger ne sont pas mesurés. Le WhatsApp israélien s'affiche « SINAY Strategic LLC », et ses 8 modèles sont en attente chez Meta. | Mineur | Propriétaire |
| Pour les langues non prévues (allemand, espagnol…), Google montre la version française, alors que le site envoie ces visiteurs vers l'anglais. | Mineur | Claude Code |
| /contact n'offre pas d'option « répondez-moi par écrit » : il faut accepter un appel. | Mineur | Décision du propriétaire |
| « Ne plus m'appeler » bloque aussi les appels de ce numéro vers nos lignes, et aucune procédure n'existe pour le débloquer. | Mineur | Décision du propriétaire |
| Les lignes téléphoniques et les rappels n'envoient pas de copie de l'échange par e-mail. | Mineur | Claude Code |
| Les agents de rappel laissent un message sur le répondeur, alors que la règle écrite (R6) dit le contraire. | Mineur | Décision du propriétaire |
| Hors Israël, les rappels partent d'un numéro britannique, et la personne qui rappelle ce numéro tombe sur un accueil en anglais. | Mineur | Décision d'achat du propriétaire |
| Demandes écrites : la langue de la conversation est ignorée pour choisir l'agent de rappel. Un numéro +33 qui écrit en anglais est rappelé en français. | Mineur | Claude Code |
| 20 exécutions de rappel du 6 octobre (anciennes versions) sont toujours en pause chez Autocalls. | Mineur | Autocalls ou propriétaire |
| Le contrôle juste avant l'appel se fait sans jeton : en cas de forte activité, une demande remplacée pourrait quand même être appelée. | Mineur | Claude Code |
| La base de connaissances dit encore « un conseiller vous rappelle ». | Mineur | Claude Code |

## 3. Inscription, essai, abonnement

### Le parcours aujourd'hui, étape par étape

| Étape | Ce qui se passe | État |
|---|---|---|
| Clic « Créer mon compte » sur /essai-gratuit | La fiche est enregistrée (e-mail, langue, page, UTM, case marketing), puis le visiteur part vers app.permanenceia.com/register. | Fonctionne |
| Inscription sur /register (page en anglais) | Compte gratuit à 0 minute et e-mail de bienvenue d'Autocalls. Le site enregistre l'inscription et envoie « Nouvelle inscription » à l'équipe. | Fonctionne |
| Arrivée dans l'espace client | Le script « parcours d'essai » envoie un compte sans forfait vers /plans et explique l'essai. Vérifié en ligne le 9 octobre à 12 h 38 UTC. | Fonctionne |
| Le lendemain (J+1) | E-mail I1 « une étape pour démarrer l'essai », en fr, en-gb et en-au seulement. | Fonctionne, mais le bouton mène à la mauvaise page |
| « Choose a plan » puis « Start 14-Day Free Trial » | La carte est enregistrée et l'abonnement Stripe passe en essai. Stripe prévient le site, qui envoie l'e-mail C1 au passage horaire suivant. | Jamais testé en réel |
| Pendant l'essai | C2 à J+2 si aucune minute n'est utilisée, C3 à J+5, C4 quand il reste 5 minutes ou moins, C5 3 jours avant la fin. Stripe envoie son propre rappel 7 jours avant la fin. | Défauts (voir plus bas) |
| Fin d'essai réussie | Stripe débite la carte et envoie le reçu. Le client devient payant. Le site n'envoie plus rien. | Plus aucune aide ensuite |
| Carte refusée | Stripe réessaie et prévient le client. L'équipe reçoit « Paiement échoué » à chaque tentative (événement ajouté le 9 octobre), puis « Impayé définitif ». | Fonctionne, mais l'e-mail F1 qui suit n'est pas adapté |
| Annulation pendant l'essai | L'abonnement reste « en essai » jusqu'à la date de fin : C2 à C5 continuent. La série F part ensuite. | Défaut |
| Résiliation d'un abonné payant | Rien : ni e-mail, ni alerte. | Manque |

### Ce qui fonctionne

- Tous les boutons d'essai du site mènent à /essai-gratuit.
- Le webhook d'inscription et le webhook Stripe sont en ligne et protégés. La signature est vérifiée, et un événement reçu en double ou dans le désordre est bien géré. Trois événements Stripe ont été acceptés le 9 octobre.
- Depuis le 9 octobre, le webhook Stripe reçoit 10 types d'événements, dont « paiement échoué ».
- L'équipe est alertée des paiements : « Paiement échoué », « Impayé définitif », « Résilié après impayé ».
- Les relances suivent l'état Stripe et n'inventent rien : si une donnée manque, l'étape est sautée.
- Le script du parcours d'essai est installé dans l'espace client : encadré sur /plans, lien « Factures et carte bancaire », aide sur /credits.
- Réglages Stripe constatés les 7 et 8 octobre, non revérifiés aujourd'hui : rappel 7 jours avant la fin d'essai, reçus, factures, portail client.
- La recharge à la minute et l'achat de numéro ont déjà été faits en réel sur un compte de test (facture PIA-0001).

### À corriger

| Problème | Gravité | Qui |
|---|---|---|
| Aucun essai ni abonnement n'a jamais tourné en réel : il n'y a que 3 comptes, tous de test. La chaîne « paiement, Stripe, site, e-mails » n'est donc pas prouvée. | Important | Propriétaire |
| Dans les e-mails I, F, U et M, les boutons « Choisir mon forfait », « Démarrer l'essai » et « Ajouter du crédit » mènent à /billing (factures et carte) au lieu de /plans ou /credits. Depuis cette page, le client ne peut pas démarrer l'essai. | Important | Claude Code |
| Australie : C4 « Il vous reste 0 minute » peut partir quelques heures après le début de l'essai. Il ne repart ensuite jamais au vrai seuil. | Important | Claude Code |
| Italien, polonais, néerlandais, hébreu : aucun e-mail d'aide ni de fin d'essai, même pas les messages de service. | Important | Claude Code, après relecture des textes par un natif |
| Langue inconnue (inscription directe sur l'espace client, ou avec un autre e-mail) : aucun e-mail. La conception prévoyait pourtant un I1 en français et en anglais. | Important | Claude Code |
| Annulation pendant l'essai : C2 à C5 continuent, et C5 dit « rien à faire, le premier mois est prélevé ». L'équipe n'est pas prévenue. | Important | Claude Code |
| Espace client : Google Analytics se charge sans accord, il n'y a pas de pixel Meta, et aucun événement « essai démarré » n'est envoyé. | Important | Claude Code rédige, le propriétaire colle |
| L'équipe n'est alertée ni au début d'un essai, ni quand il devient payant, ni à une résiliation. | Important (voir § 5) | Claude Code |
| Les modèles WhatsApp « essai démarré » et « fin d'essai » sont approuvés, mais rien ne les envoie : on n'a ni le numéro, ni l'accord WhatsApp du client. | Mineur | Décision du propriétaire |
| E-mail de bienvenue d'Autocalls : il reste à coller le paragraphe qui nomme « Choose a plan » et « Start 14-Day Free Trial ». Texte prêt dans docs/autocalls-scripts/bienvenue-etape-essai.md. | Mineur | Propriétaire, 5 min |
| L'essai ne donne aucun crédit de messages : les réponses écrites de l'IA s'arrêtent. Il faut le dire sur /essai-gratuit et dans C1. | Mineur | Claude Code ; Autocalls (champ crédits d'essai) |
| Carte refusée en fin d'essai : le client reçoit F1, « c'est tout à fait votre droit », au lieu de « mettez à jour votre carte ». | Mineur | Claude Code |
| C5 ne part jamais pour un forfait annuel. | Mineur | Claude Code |
| Rien ne prouve que la langue des factures Stripe est bien posée : un refus de la clé Stripe n'est pas noté dans les journaux. | Mineur | Propriétaire (contrôle lors du test), puis Claude Code |
| Le forfait choisi sur /tarifs est oublié à l'inscription. | Mineur | Claude Code |
| Il manque une clé Stripe en lecture : un abonnement dont l'e-mail n'est pas connu n'est rattaché à personne, et C1 à C5 ne partent pas. | Mineur | Le propriétaire crée la clé (10 min), Claude Code la branche |
| Un paiement d'abonnement est aussi compté comme un achat de crédit (défaut déjà connu). | Mineur | Claude Code |

## 4. Client actif

### Ce qui fonctionne

- **Lucie, l'assistante de mise en route.** C'est la bulle « Configurons ensemble » de l'espace client (agent 21205). Elle est active, s'appuie sur une base de 35 documents et a ses outils de ticket et de dossier. Elle guide la création de l'agent : Assistants > Create, base de connaissances, outils, test, numéro.
- **Accompagnement par téléphone.** Lucie crée un ticket, puis l'agent de rappel du support (21183) appelle et configure l'espace pas à pas avec le client.
- **Dossier client.** Avec un code à 6 chiffres reçu par e-mail, les agents lisent les minutes, les crédits, les agents, les numéros, les 5 derniers appels et les 5 dernières demandes.
- **Support.** Lucie, WhatsApp, Messenger, les lignes UK et Israël et contact@ mènent tous au même ticket : un numéro T-XXXXXXXX, un e-mail à l'équipe et un rappel automatique.
- **Guides.** /aide, /faq, /tarifs et les guides (créer un agent, le tester, minutes et facturation, renvoi d'appel) répondent dans les 7 langues.
- **Facturation, selon l'audit des 7 et 8 octobre.**
  - Stripe envoie les reçus, les factures « PIA », les relances d'impayé et le rappel de fin d'essai.
  - Le portail client sert pour la carte, les factures et la résiliation.
  - La FAQ explique bien l'annulation et le changement de forfait.

### À corriger

| Problème | Gravité | Qui |
|---|---|---|
| Abonné qui n'a créé aucun agent, ou qui ne reçoit aucun appel : aucune détection, aucune relance, aucune alerte (voir § 7). | Important | Claude Code |
| Lucie déduit le forfait du seul solde de minutes. À 0 minute, elle propose « l'essai de 14 jours » à un client déjà en essai ou abonné, alors que changer de forfait pendant l'essai peut déclencher un débit immédiat. Elle ne connaît ni le forfait, ni la date de renouvellement, ni une annulation prévue, ni un impayé. | Important | Claude Code |
| Minutes basses ou épuisées chez un abonné : le site ne prévient ni le client dans sa langue, ni l'équipe. Seul l'e-mail d'Autocalls, en anglais, le fait. | Important | Claude Code |
| Résiliation d'un abonné : l'équipe n'est pas prévenue, personne ne demande pourquoi, et le résumé du lundi ne la compte pas. | Important | Claude Code |
| Tickets : ils ne sont jamais clos, et le client ne reçoit aucune confirmation écrite de son numéro. Un échange « non résolu » avec Lucie ne prévient personne. Un ticket ouvert bloque les e-mails commerciaux de ce contact pendant 200 jours. | Important | Claude Code |
| Toutes les alertes arrivent sur contact@, et rien ne prouve que quelqu'un lit cette boîte chaque jour : le transfert Zoho n'est pas confirmé. | Important | Propriétaire |
| Parcours abonné jamais testé : changement de forfait, passage à l'annuel, résiliation, ouverture de la bulle en français et en hébreu. L'accueil en italien disait encore « Lucie » au lieu de « Manuela ». | Important | Propriétaire |
| La FAQ (7 langues), les CGU (article 4) et les bases de connaissances disent que les taxes sont calculées automatiquement. Elles sont pourtant coupées chez Autocalls. | Mineur | Juriste-comptable, puis Claude Code |
| Aucune alerte quand les crédits de messages tombent à 0. | Mineur | Claude Code |
| C2 se fonde sur le solde de minutes, pas sur les vrais appels. | Mineur | Claude Code |
| Le titre de la bulle « Configurons ensemble » est en français pour tous les clients. | Mineur | Claude Code (script) |
| La base de connaissances 6229 s'affiche « processing » depuis le 8 octobre, alors que ses 35 documents sont actifs. | Mineur | Autocalls |
| Pas de ligne d'appel entrant pour la France, l'Italie, la Pologne, les Pays-Bas et l'Australie. | Choix assumé (WhatsApp ou rappel à la place) | — |

## 5. Administration

### Ce qui fonctionne

- La tâche planifiée « relances-horaires » tourne chaque heure. Dernier passage le 9 octobre à 12 h UTC, sans erreur. Il y a eu 23 passages d'affilée en envoi réel, avec 0 envoi faute de contact concerné.
- Il y a deux moyens de couper les relances en urgence : un interrupteur en base, qui agit tout de suite, et un réglage du serveur. Un disjoncteur coupe aussi tout au-delà de 5 % d'e-mails rejetés.
- L'équipe reçoit par e-mail :
  - les nouvelles inscriptions et les demandes de rappel, dont « À rappeler à la main » ;
  - les « À traiter » et les oppositions ;
  - les paiements échoués et les impayés ;
  - les réponses aux relances ;
  - le rapport quotidien de 8 h (heure de Paris) ;
  - le résumé du lundi, dont le premier part le lundi 12 octobre.
- Une alerte e-mail Google Cloud prévient en cas d'erreur serveur (réponses 5xx). Aucune erreur serveur depuis le 8 octobre à 12 h 15 UTC.
- Les adresses techniques du site refusent les appels sans jeton ou sans signature, et des limites contre les abus sont en place.
- Plus aucun outil d'agent ne porte son jeton dans l'adresse.
- Les 15 secrets déclarés existent bien.
- Côté Autocalls : 21 campagnes bien réglées, 16 automatisations actives, 3 comptes clients (tous de test). Solde de l'agence : 3 488,74.

### À corriger

| Problème | Gravité | Qui |
|---|---|---|
| L'alerte Google Cloud ne voit que les erreurs 5xx. Une panne de l'envoi d'e-mails (Zoho) ou de la base resterait silencieuse. Or toutes les alertes passent justement par Zoho. | Important | Claude Code |
| Le retrait de l'ancien jeton des webhooks n'est pas terminé (procédure dans docs/autocalls-webhooks-migration.md). Rien n'empêche de le faire maintenant. | Important | Propriétaire (2 commandes) et Claude Code |
| Aucune action d'administration n'est possible sans toucher à la base : marquer un rappel « fait », fermer un ticket, arrêter les relances d'un contact, choisir sa langue, couper les relances. | Important | Claude Code |
| Pas d'alerte sur les moments clés : essai démarré, client payant, résiliation, abonné sans agent, agent d'un client mis en pause par la conformité Autocalls, solde de l'agence bas. | Important | Claude Code |
| Une désinscription envoyée par e-mail (« unsubscribe » depuis la messagerie) est traitée comme une simple réponse : la préférence n'est pas enregistrée. La personne peut recevoir de nouveaux e-mails commerciaux à l'étape suivante. | Important | Claude Code |
| Pas de page /admin (erreur 404) : les informations sont dispersées entre Supabase, Stripe, Autocalls et contact@. | Mineur aujourd'hui (3 comptes de test) | Claude Code, plus tard |
| Les erreurs d'un passage de relances ne sont pas notées dans les journaux, et un rapport quotidien qui n'est pas parti n'est pas renvoyé. **À vérifier tout de suite :** le rapport « Relances — rapport du 2026-10-09 » est-il arrivé ce matin sur contact@ ? | Mineur | Propriétaire (vérification), puis Claude Code |
| Quand les relances sont coupées, le rapport quotidien ne part plus : on peut oublier de les rallumer. | Mineur | Claude Code |
| Le relais qui transmet toutes les fins d'échange est rattaché à l'agent 21498, que la documentation propose de supprimer. On ne sait pas ce que la suppression ferait au relais. | Précaution : ne pas le supprimer | Propriétaire ; question à Autocalls |
| Les colonnes « étape », « forfait » et « fin d'essai » de la fiche contact ne sont jamais mises à jour (le moteur recalcule tout en mémoire). C'est un piège pour une future page /admin ou un export. | Mineur | Claude Code |
| Le jeton de la liste noire est lisible dans l'automatisation Autocalls (accepté lors de la conception). | Mineur | Propriétaire : limiter l'accès au compte |

## 6. Relances après l'essai (e-mail et téléphone) : le flux est-il en place ?

**Réponse courte :**
- **Par e-mail : oui, en partie.** Le moteur tourne chaque heure en envoi réel depuis le 8 octobre. Mais il ne fonctionne qu'en français et en anglais (Royaume-Uni, Australie), il n'a jamais servi pour un vrai client, et plusieurs défauts sont à corriger avant de compter dessus.
- **Par téléphone : non.** Aucun appel automatique après l'inscription ou l'essai.
- **Par WhatsApp : non.** Les modèles sont approuvés chez Meta, mais rien ne les envoie.

### Ce qui part aujourd'hui, selon la situation

| Situation | Ce qui part | Langues | Remarque |
|---|---|---|---|
| E-mail laissé sur /essai-gratuit, sans compte créé | Rien | — | Manque |
| Inscrit sans essai (série I) | I1 à J+1 (service) ; I2 à I7 jusqu'à J+58 (commercial, base légale nécessaire) | fr, en-gb, en-au | Boutons vers la mauvaise page |
| Essai en cours (série C) | C1 au départ, C2 à J+2 si aucune minute n'est utilisée, C3 à J+5, C4 à 5 minutes restantes ou moins, C5 3 jours avant la fin ; rappel Stripe 7 jours avant la fin | fr, en-gb, en-au | Continue après une annulation ; C4 faux en Australie ; pas de C5 pour l'annuel |
| Essai annulé sans payer (série F) | F1 à J+1 (service) ; F2 à F7 jusqu'à J+60 (commercial) ; puis suivi mensuel (série M, 4 e-mails au plus) | fr, en-gb, en-au | F1 inadapté si la carte a été refusée |
| Essai devenu abonnement payant | Rien | — | Manque (voir § 7) |
| Abonné qui résilie | Rien | — | Manque |
| Paiement à la minute, peu actif (série U) | U1 (service), U2 à U6 (accord exprès) | fr, en-gb, en-au | Pas avant début novembre : il faut 28 jours d'historique |

Règles déjà en place pour toutes les séries :
- jamais deux e-mails le même jour ;
- au plus 1 e-mail commercial tous les 3 jours ;
- e-mails commerciaux seulement de 9 h à 11 h les jours ouvrés, e-mails de service de 8 h à 20 h ;
- arrêt si le contact répond, se désinscrit, refuse les appels, ou si son adresse rejette l'e-mail ;
- plafonds d'envoi par passage et par jour.

### Pourquoi il n'y a pas de relance par téléphone

- Autocalls ne transmet pas le numéro de téléphone à l'inscription. On ne le connaît que si la personne l'a laissé sur le site.
- Les 21 campagnes d'appel ne servent qu'aux rappels demandés.
- Appeler un inscrit sans son accord peut être de la prospection. La conception l'exclut (« jamais d'appel ni de SMS de prospection ») tant que l'avocat n'a pas tranché.
- Ce qui existe : un appel quand la personne le demande, par le formulaire « Accompagnement essai » de /essai-gratuit, en répondant à I3 ou F6, ou par un ticket. L'agent de rappel du support sait alors configurer l'espace avec elle.

### Recommandation

1. Corriger d'abord les défauts des e-mails (§ 9, actions 8 à 11).
2. Ajouter la série « A » (§ 7), qui couvre aussi le client payant.
3. Pour le téléphone, **pas d'appel sans accord**.
   - Mettre dans les e-mails un bouton « Être rappelé pour configurer ensemble ». Le clic vaut accord, et la campagne du support existante rappelle.
   - Prévenir l'équipe pour qu'une personne appelle les clients **payants** en difficulté. C'est un appel sur leur propre contrat, à faire confirmer par l'avocat.
4. WhatsApp plus tard. Il faut d'abord recueillir le mobile et l'accord WhatsApp du client, et faire classer un modèle « utilitaire » par Meta.

## 7. Abonné qui n'a créé aucun agent : existe-t-il une relance ?

**Non.** Aujourd'hui :
- Pendant l'essai, C1 dit « créez votre agent ». C2 et C3 supposent ensuite que l'agent existe (« votre agent n'a pas encore reçu d'appel »). Le moteur ne sait pas si un agent a été créé : il ne lit que les minutes et les crédits.
- Dès que le client paie, il ne reçoit plus aucun e-mail du site, et l'équipe n'est pas prévenue.
- Exemple sur un compte de test : 76,92 minutes, 0 agent, et rien ne le signale.

La bonne nouvelle : le site sait déjà lire les agents, les numéros et les appels d'un client. C'est ce que fait Lucie quand elle consulte un dossier. Il suffit de le faire une fois par jour, dans le passage horaire déjà en place.

### Proposition : série « A » (mise en route)

**Données lues chaque jour**, pour chaque compte en essai, abonné ou payant à la minute : le nombre d'agents, la présence d'un agent avec un numéro, et la date du dernier appel réel.

**Point de départ (J0) :** début de l'essai, de l'abonnement ou du premier achat de crédit.

| Étape | Quand | Condition | Message (e-mail de service) | Pour l'équipe |
|---|---|---|---|---|
| A1 | J+1 | 0 agent | « Votre agent n'est pas encore créé : 10 minutes suffisent. » Trois étapes, le lien vers le guide « Créer un agent », et un rappel de la bulle « Configurons ensemble ». | — |
| A2 | J+3 | toujours 0 agent | « On le configure avec vous. » Un bouton « Être rappelé » ouvre le formulaire d'accompagnement existant (téléphone et accord), puis l'agent du support rappelle. Le client peut aussi répondre avec un créneau. | Alerte « client sans agent depuis 3 jours » : nom, e-mail, téléphone s'il est connu, langue, forfait, fin d'essai |
| A3 | J+7 | toujours 0 agent | Dernier message : « il reste 7 jours d'essai » ou « votre forfait est actif », avec une proposition de configurer ensemble. | Ligne dans « À faire aujourd'hui » : appel par une personne de l'équipe |
| A4 | J+10 | agent créé, mais sans numéro ou sans aucun appel réel | « Testez votre agent et activez le renvoi d'appel », avec les guides « Tester son agent » et « Renvoi d'appel ». Remplace C2 dans ce cas. | — |
| A5 | J+14 (abonné payant) | toujours 0 agent ou 0 appel | — | Alerte « risque de résiliation » |
| Suivi mensuel | chaque mois | 0 appel sur 30 jours | E-mail du type U1 : « votre agent ne reçoit pas d'appels, vérifions ensemble » | Alerte 5 jours avant le renouvellement |

**Canal :**
- E-mail dans la langue du client, dans les 7 langues. Les textes en italien, polonais, néerlandais et hébreu doivent d'abord être relus par un natif. Si la langue est inconnue, l'e-mail part en anglais.
- Téléphone seulement si le client le demande (A2), ou appel par une personne de l'équipe à un client payant.
- WhatsApp plus tard : il faut le numéro, l'accord et un modèle utilitaire.

**Règles :**
- Ce sont des messages **de service**, liés au contrat : purement informatifs, sans prix, sans promotion, sans proposition de forfait supérieur. Ils ne demandent pas d'accord marketing (à faire confirmer par l'avocat).
- **La série s'arrête :**
  - dès qu'un agent est créé, pour A1 à A3 ;
  - au premier appel réel, pour A4 ;
  - en cas de résiliation ou d'impayé ;
  - si le client répond (l'équipe prend le relais) ;
  - si son adresse rejette l'e-mail ;
  - s'il s'oppose aux relances.
- Après une désinscription, A1 et A2 continuent, car ils concernent le fonctionnement du compte. A3 et A4 sont sautés.
- Jamais deux messages le même jour, et seulement entre 8 h et 20 h locales, comme aujourd'hui.
- **Pas de doublon avec la série C :** pendant l'essai, C2 et C3 ne partent que si un agent existe. Sinon, c'est l'étape A qui part.

**Effort :**
- 1 à 2 jours pour Claude Code : lecture quotidienne, série A, alertes.
- Une demi-journée de plus pour la liste « À faire aujourd'hui ».

**En attendant :** Claude Code peut vous donner à la demande la liste des comptes sans agent, en lisant Autocalls.

## 8. CRM : faut-il Zoho CRM ou autre ?

**Recommandation : ne branchez pas de CRM maintenant**, ni Zoho CRM, ni Bigin, ni HubSpot.

Pourquoi :
1. **Un CRM ne réglerait pas le vrai problème.** Ce qui manque, c'est de savoir si le client a un agent et s'il reçoit des appels. Cette information est chez Autocalls, et aucun CRM n'a de connecteur Autocalls. Il faudrait écrire la même liaison que pour la série A, puis en plus envoyer les données vers le CRM.
2. **Le site fait déjà le travail d'un CRM** : une fiche par contact, le journal des accords, l'état Stripe, les séries d'e-mails, l'arrêt quand le contact répond, les désinscriptions, les règles propres à chaque pays.
3. **Risque d'envois en double.** Un CRM qui envoie lui-même des e-mails contournerait les règles légales de chaque pays et la liste d'opposition commune. Règle à garder : seul le moteur du site envoie.
4. **RGPD.** Un CRM ajoute un sous-traitant. Il faudrait signer un accord de traitement des données, mettre à jour la politique de confidentialité en 7 langues et répercuter chaque effacement. Votre compte Zoho est hébergé aux États-Unis.
5. **Volume.** Il y a 3 comptes, tous de test, et aucun commercial à équiper.

**À faire à la place, pour environ 0 $ par mois :**
- la série A (§ 7) ;
- une liste nominative « À faire aujourd'hui » dans le rapport de 8 h : clients sans agent, agents sans appel, essais qui finissent sans usage, réponses reçues ;
- des alertes sur les moments clés ;
- puis, vers 10 clients réels, une page privée /admin.

**Quand y repenser :**
- une deuxième personne doit noter des appels et des tâches ;
- ou il y a plus de 30 à 50 clients actifs ;
- ou vous perdez plus de 2 à 3 heures par semaine à chercher l'information.

Dans ce cas, prenez **Bigin by Zoho**, puisque votre messagerie est déjà chez Zoho. Si l'avocat exige un hébergement en Europe, prenez **HubSpot gratuit hébergé en Europe**. Dans les deux cas, le CRM reçoit les données du site et n'envoie jamais d'e-mails.

## 9. Actions par ordre de priorité

Les efforts sont estimés par Claude. « Propriétaire » désigne vous.

### Avant toute publicité

Aucun défaut ne bloque le site aujourd'hui. Ces points deviennent bloquants dès qu'un vrai client arrive.

| # | Action | Qui | Effort |
|---|---|---|---|
| 1 | Faire un vrai essai sur un compte de test : « Choose a plan », puis « Start 14-Day Free Trial » avec une carte. Vérifier ensuite : l'alerte « Nouvelle inscription » ; I1 puis C1 dans la bonne langue ; la langue des factures Stripe ; l'annulation par le portail. Mener un second essai jusqu'au débit. Changer de forfait, passer à l'annuel, ouvrir la bulle en français et en hébreu. | Propriétaire ; Claude Code vérifie les journaux | 1 h, puis suivi sur 14 jours |
| 2 | Faire lire contact@ chaque jour : transfert Zoho vers votre boîte. Vérifier que le rapport « Relances — rapport du 2026-10-09 » est bien arrivé. | Propriétaire | 10 min |
| 3 | Dimanche 11 octobre vers 07 h 35 UTC (09 h 35 à Paris) : vérifier que l'exécution lIkW0… se termine **sans** appel, et que l'exécution brzDM… fait appeler votre mobile de test par Daniel (campagne 12533). | Propriétaire reçoit l'appel ; Claude Code vérifie | 15 min |
| 4 | Tester chaque canal de bout en bout sur votre téléphone : appel au +44, WhatsApp au +972 3-382-7709, message Messenger, rappel non décroché (répondeur puis SMS), « STOP » sur chaque canal. | Propriétaire | 1 h |
| 5 | Ne pas supprimer l'agent 21498 tant qu'Autocalls n'a pas confirmé que le relais des fins d'échange continue de fonctionner. | Propriétaire ; Autocalls | Une question |

### Important : à faire ensuite

| # | Action | Qui | Effort |
|---|---|---|---|
| 6 | Série A « mise en route », avec lecture quotidienne des agents et alertes (§ 7). | Claude Code | 1 à 2 jours |
| 7 | Rubrique nominative « À faire aujourd'hui » dans le rapport de 8 h. Alertes : essai démarré, client payant, résiliation demandée, agent mis en pause, solde de l'agence bas. Compléter le résumé du lundi. | Claude Code | 1 jour |
| 8 | Essai annulé : repérer l'annulation programmée, arrêter C2 à C5 ou envoyer « rien ne sera débité », et prévenir l'équipe. | Claude Code | ½ jour |
| 9 | Faire mener les boutons des e-mails I, F, U et M vers /plans ou /credits au lieu de /billing. | Claude Code | 2 h |
| 10 | Envoyer les messages de service dans les 7 langues (les e-mails commerciaux restent fermés), et en anglais si la langue est inconnue. | Claude Code ; relecture des textes italiens, polonais, néerlandais et hébreux par un natif, organisée par le propriétaire | ½ jour, plus la relecture |
| 11 | C4 (Australie) : utiliser le solde lu au moment de l'envoi, pas celui du matin. | Claude Code | 2 h |
| 12 | Lucie : ajouter au dossier le forfait, l'état de l'essai, la date de renouvellement, l'annulation prévue et l'impayé. Corriger la règle « 0 minute = proposer l'essai ». | Claude Code | ½ jour |
| 13 | Alertes minutes basses et minutes épuisées, au client dans sa langue et à l'équipe. | Claude Code | ½ jour |
| 14 | Tickets : les clore quand l'issue est « résolu », envoyer au client une confirmation écrite avec son numéro, et alerter l'équipe sur « non résolu ». | Claude Code | ½ jour |
| 15 | Ajouter un lien « Arrêter les relances de ce contact » dans les alertes internes, et enregistrer la désinscription reçue par e-mail (« unsubscribe »). | Claude Code | ½ jour |
| 16 | Faire voir à l'alerte Google Cloud les erreurs du site : envoi d'e-mails, base de données. | Claude Code | ½ jour |
| 17 | Terminer le retrait de l'ancien jeton (les 3 étapes de docs/autocalls-webhooks-migration.md). | Propriétaire (2 commandes) et Claude Code | 30 min et 1 h |
| 18 | Faire vraiment appliquer « ne plus me contacter » sur Messenger, sur l'assistante de l'espace client et sur les widgets. | Claude Code | ½ jour |
| 19 | Ligne Israël : remercier les fournisseurs, journalistes et démarcheurs et leur donner contact@, sans demande de rappel. | Claude Code | 1 h |
| 20 | Relancer la personne qui a laissé son e-mail sur /essai-gratuit sans finir son inscription. | Claude Code | ½ jour |
| 21 | Espace client : Google Analytics seulement après accord, signaux publicitaires refusés, pixel Meta après accord. | Claude Code rédige ; le propriétaire colle dans l'admin Autocalls | 1 h et 5 min |
| 22 | Ne charger que les textes de la langue de la page, pour un site plus rapide sur mobile. | Claude Code | 1 à 2 jours |
| 23 | Mesurer « essai démarré » et « abonnement payé » dans Google Analytics et Meta, depuis le webhook Stripe. | Avocat d'abord, puis Claude Code | 1 jour |
| 24 | Fixer la règle pour le téléphone après l'essai (§ 6) et valider la base légale de la série A. | Propriétaire, avec l'avocat | Un rendez-vous |
| 25 | Page privée /admin : consultation, avec des boutons (rappel fait, fermer un ticket, arrêter les relances, choisir la langue, couper les relances). | Claude Code | 2 à 3 jours, vers 10 clients |

### Mineur

| # | Action | Qui | Effort |
|---|---|---|---|
| 26 | Coller le paragraphe de l'e-mail de bienvenue (docs/autocalls-scripts/bienvenue-etape-essai.md). | Propriétaire | 5 min |
| 27 | Créer une clé Stripe restreinte, en lecture seule (Customers, Subscriptions). Claude Code la branche ensuite. | Propriétaire, puis Claude Code | 10 min et 15 min |
| 28 | Faire annuler les 20 exécutions de rappel du 6 octobre. Ne jamais cliquer sur « Retry ». | Autocalls ou propriétaire | 15 min |
| 29 | Demander le nom « PermanenceAI » pour le WhatsApp israélien, suivre les 8 modèles en attente, mesurer les clics Messenger. | Propriétaire ; Claude Code pour la mesure | 15 min |
| 30 | Taxes : trancher, puis corriger la FAQ, les CGU et les bases de connaissances. | Juriste-comptable, puis Claude Code | 1 h |
| 31 | Décider : option « réponse écrite » sur /contact ; effet de la liste noire sur les appels entrants, et procédure de retrait ; message sur répondeur (règle R6) ; numéros locaux par pays. | Propriétaire | 30 min |
| 32 | Petits défauts du site : UTM gardés pendant la visite, pop-up absent de l'aide et de la désinscription, formulaires avec méthode d'envoi, bouton actif après un retour arrière, version anglaise montrée par défaut à Google. | Claude Code | ½ jour |
| 33 | Petits défauts des relances : F1 si la carte est refusée, C5 pour l'annuel, C2 fondé sur les vrais appels, alerte crédits à 0, forfait choisi sur /tarifs, paiement compté comme crédit, rapport même relances coupées, erreurs notées dans les journaux, colonnes de la fiche contact. | Claude Code | 1 jour |
| 34 | Petits défauts des agents : copie de l'échange sur les lignes téléphoniques, langue de l'échange écrit pour choisir le rappel, jeton dans le contrôle avant appel, « un conseiller vous rappelle » dans la base. | Claude Code | ½ jour |
| 35 | Dire sur /essai-gratuit et dans C1 que l'essai ne donne pas de crédits de messages. Demander à Autocalls un champ crédits d'essai. | Claude Code ; Autocalls | 30 min |
| 36 | Contrôler si les pages vues sont comptées deux fois (DebugView de Google, test des événements de Meta). | Propriétaire | 15 min |
| 37 | Mettre à jour les documents de suivi en retard : campagnes déjà à 2 tentatives, numéros retirés, « paiement échoué » déjà ajouté, script d'essai déjà installé. | Claude Code | 30 min |
| 38 | Signaler à Autocalls la base 6229, affichée « processing ». | Autocalls | 5 min |

## Annexe : corrections par rapport aux documents précédents

- **Le script « parcours d'essai » est installé** et fonctionne (vérifié le 9 octobre à 12 h 38 UTC sur /plans et /credits). Il n'apparaît pas sur /register et /login, et c'est normal : ces pages ont leur propre emplacement de scripts. Seul l'e-mail de bienvenue reste à modifier.
- **L'événement « paiement échoué » a été ajouté au webhook Stripe le 9 octobre** (10 événements en tout). docs/audits/actions-proprietaire-2026-10-08.md et docs/relances/conception-2026-10-08.md disent encore le contraire.
- **Les 7 campagnes qui faisaient 3 tentatives ont été passées à 2** le 8 octobre au soir, et les numéros 11775 et 11795 ne sont plus sur le compte. Deux documents demandent encore de le faire.
- **Rappel du 11 octobre :** c'est l'exécution brzDM… (Daniel) qui doit appeler. L'exécution lIkW0… (Noa) doit être écartée : il est normal qu'elle se termine sans appel.
- **La recharge à la minute et l'achat de numéro** ont déjà été faits en réel sur un compte de test. Il n'est plus nécessaire de les tester.

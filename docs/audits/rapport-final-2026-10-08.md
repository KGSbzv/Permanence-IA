# Rapport final d'audit PermanenceAI (8 octobre 2026)

## 1. En bref

Le site en 7 langues, les formulaires, les 32 agents commerciaux, les e-mails et les relances commerciales sont en place. Ils ont été corrigés et contrôlés en ligne. Trois tours de corrections ont traité tout ce que Claude pouvait faire. Sur 16 contrôles en échec, il n'en reste que trois : deux attendent votre décision, et un demande une vraie demande de support.

Ce qui bloque encore les ventes :
- **Aucun test réel** de paiement, d'appel ou d'inscription n'a été fait. Claude n'a pas le droit de les faire.
- **Stripe** marque le représentant du compte (Joseph Haddad) « Invalid ». Aucun examen n'est en cours, paiements et virements sont actifs, seules les Cartes Bancaires sont en pause.
- **Autocalls a répondu** à 22 questions sur 24 le 8 octobre au soir (section 10). Le forfait Réceptionniste reçoit ses 200 crédits, et la taxe automatique est coupée.
- **L'avocat et le comptable** ne sont pas encore choisis.

Les relances tournent toutes les heures, en envoi réel depuis le 8 octobre à 15 h UTC (aucun envoi tant qu'aucun contact n'a donné son accord).

**Verdict au 8 octobre, 18 h 20 (heure de Paris).** La partie technique est en ligne et saine. Le contrôle de ce soir :
- 42 pages sur 42 répondent dans les 7 langues ;
- outil date et heure, webhook Stripe et route des relances protégés (401 sans signature ou sans jeton) ;
- aucune erreur serveur depuis 12 h 15 UTC ;
- 7 bases de connaissances actives, 41 agents rattachés.

Les relances sont en envoi réel depuis 15 h UTC (commit 47a8f08) : 0 envoi à ce stade, car aucun contact n'a encore donné son accord.

Ce n'est pas encore prêt à 100 % pour vendre : aucun parcours n'a été testé en réel (paiement, appel, inscription), et le webhook Stripe n'a encore reçu aucun vrai événement.

## 2. Chiffres de l'audit

**Point de départ (audit du 8 octobre au matin).** 406 points vérifiés : 106 corrects, 178 partiels, 22 manquants, 8 cassés, 85 à faire par vous, 2 invérifiables et 5 obsolètes. S'y ajoutent 66 manques trouvés par l'audit. Cela donnait :
- **224 corrections pour Claude**, doublons retirés ;
- **128 actions pour vous** : 85 qui vous reviennent et 43 que Claude ne pouvait pas corriger.

**Méthode de comptage.** On compte les corrections déclarées par les agents qui corrigent, sans les entrées de vérification et de commit (165 entrées brutes au total). Puis on compte les contrôles faits par d'autres agents, chargés uniquement de vérifier : sur le site en ligne, dans Stripe et dans Autocalls.

| Tour | Corrections | Contrôles en ligne | Réussis |
|---|---|---|---|
| 1 (7 oct. au soir, audits site et facturation) | 24 | 27 | 26 |
| 2 (les 224 points) | 100, plus 73 déjà corrects | 75 | 60 |
| 3 (les restes) | 33 | 41 | 41 |
| **Total** | **environ 157** | **143** | **127** |

Il y a eu 16 contrôles en échec :
- 13 ont été corrigés ou confirmés au tour 3. Souvent, la mise en ligne n'était pas encore terminée au moment du contrôle. Plusieurs ont été confirmés lors du tri du tour 3, sans contrôle dédié.
- 1 demande une vraie demande de support : le numéro de ticket.
- 2 attendent votre décision : le bouton « Connect AI » et la bulle sur téléphone en italien et en polonais.

**Il reste :**
- pour vous : 9 actions prioritaires et 18 décisions ;
- chez Autocalls : 21 questions ;
- chez Meta : 18 réexamens et la vérification d'entreprise ;
- chez Stripe : 3 points.

## 3. Ce qui est fait et vérifié

**Site et textes (7 langues)**
- Les secteurs santé en pause sont retirés des textes, du bandeau et du formulaire. Relu en ligne dans les 7 langues.
- La version australienne a son propre contenu, et les montants en dollars américains s'écrivent « US$ ». Contrôle : 0 « £ » sur /en-au.
- Aucun défilement horizontal de la page sur /tarifs, à 375 px et 1366 px, dans les 7 langues. Mesuré automatiquement dans un navigateur. À 375 px, seul le tableau comparatif des fonctions défile dans son propre cadre.
- Les polices sont hébergées par le site : aucune requête vers les serveurs de polices Google avant votre accord aux cookies. En revanche, Google Tag Manager et Google Analytics sont appelés avant l'accord (voir décision 12).
- Les pages juridiques sont complétées. Le passage sur la responsabilité conjointe avec Meta est marqué « à relire par un juriste ».

**Formulaires et parcours**
- Essai gratuit : case CGU obligatoire (contrôle en JavaScript), case de rappel facultative et décochée par défaut ; sans elle, aucune demande de rappel n'est envoyée. Contrôle simulé dans un navigateur en fr, en-gb et he, sans envoi.
- Rappel :
  - la date est limitée à 30 jours et aux heures du marché ;
  - un numéro illisible est refusé ;
  - « ne plus appeler » annule les rappels en attente.
- **Partiel** : aucun envoi réel de bout en bout n'a été testé.

**Agents IA et bases de connaissances**
- **Bases de connaissances reconstruites le 8 octobre au soir** (avec votre accord) :
  - 7 bases neuves (6213 à 6220), une version par page, lues sur le site corrigé ;
  - 95 documents actifs, aucun échec, et les 41 agents rattachés à la base de leur langue (contrôle indépendant : aucun reste sur une ancienne base, aucun blocage de conformité) ;
  - les 7 anciennes bases ont été supprimées par vous, et la vérification qui a suivi ne montre aucun écart.
- Prix, méthode commerciale et droit de refuser sont à jour sur les 32 agents.
- L'outil « ne plus appeler » (ne_plus_appeler, 6243) a été ajouté dans la section Outils de 19 agents vocaux ; 6 autres le citaient déjà. L'outil voisin ne_plus_appeler_numero (6244) a été ajouté dans les règles du conseiller 21205 et des 14 widgets. Le scan de conformité d'Autocalls ne bloque aucun des 9 agents contrôlés (échantillon, pas les 33).

**Rappels, campagnes et automatisations**
- Un rappel reprogrammé remplace l'ancien.
- Les agents ont un outil date et heure.
- Le SMS de repli est codé, mais jamais testé en réel.
- Les 7 campagnes de rappel sont toujours réglées à 3 nouvelles tentatives (intervalle 120 min, 90 min pour 12534), contre 2 et 240 min pour les autres.

**WhatsApp, Meta, Facebook**
- Les 48 modèles sont approuvés et actifs. Meta a reclassé 18 d'entre eux en « marketing » le 7 octobre (pia_minutes_low, pia_trial_ending et pia_trial_started, en 6 langues) ; ils sont « actifs, en cours d'examen ». Autocalls les affiche encore en « utility ». Les 3 réexamens précédents gagnés n'ont pas pu être confirmés.
- Photo de la réceptionniste sur WhatsApp. Le pixel Meta n'est chargé qu'après votre accord.

**Stripe et facturation**
- Vérifié dans le tableau de bord Stripe :
  - confirmation de paiement par la banque (3D Secure) ;
  - lien de gestion d'abonnement et portail client ;
  - logo, et factures numérotées « PIA » ;
  - adresse avec la Suite ;
  - doublon archivé.
- Le webhook (l'adresse où Stripe prévient le site) reçoit 9 types d'événements. Les fausses signatures sont refusées.

**Admin Autocalls**
- L'e-mail de bienvenue annonce 3,99 $ et a le pied de page légal.
- Le serveur d'envoi est chiffré (TLS).
- Les widgets Charlotte et Noa sont réglés.

**E-mails**
- Pied de page légal sur tous les e-mails du site, avec préférences et désinscription en un clic, en 7 langues. Les liens falsifiés sont refusés.
- Une seule clé de signature Zoho (DKIM) est publiée.
- Les 8 enregistrements DNS du domaine d'envoi Stripe sont importés, et Stripe les a trouvés.

**Relances commerciales**
- 36 messages en 7 langues et 322 aperçus. 36 tests automatiques sur 36 réussis (voir section 7).

**Infrastructure, DNS, sécurité**
- En-têtes de sécurité en place.
- Les migrations du dépôt définissent 11 tables Supabase et passent call_events.assistant_id en texte. Leur application sur la base en ligne n'a pas été vérifiée directement (lecture refusée) ; les relances s'exécutent sans erreur de journal, ce qui le laisse penser.
- Planificateur horaire avec un compte sans droits. Les secrets (mot de passe IMAP, secret du webhook Stripe) sont dans Secret Manager ; l'identifiant et le serveur IMAP sont des valeurs simples.
- Un déploiement a échoué une fois : la police Google n'a pas pu être téléchargée. Il a été relancé avec succès.

## 4. Ce qui reste à faire par vous

1. **Tester les paiements** sur un compte test de app.permanenceia.com : essai, changement de forfait, passage à l'annuel, recharge, numéro. *Rien ne prouve encore qu'un client peut payer.* (9 octobre : la recharge et l'achat de numéro sont déjà faits en réel sur un compte de test, facture PIA-0001 ; reste l'essai et l'abonnement.)
2. **Tester les appels** :
   - appeler le +44 7367 090106 et le 02-376-7085 ;
   - demander un rappel et ne pas décrocher : il faut un répondeur, puis un SMS ou un WhatsApp ;
   - faire écouter les voix par des natifs.
3. **Tester l'inscription** avec une adresse Gmail : le message de bienvenue doit arriver hors spam.
4. **Forfait Réceptionniste.** Plus rien à faire : Autocalls met 200 crédits sur 1646 (dès le prochain renouvellement), et Claude a lancé « Resync Billing Portal ».
5. **Campagnes.** Campaigns > 12519, 12520, 12521, 12522, 12532, 12533, 12534 : Max retries 2, Retry interval 240. *Fait le 8 octobre au soir (revérifié le 9 octobre, audit des parcours).*
6. **Mot de passe Zoho visible dans Autocalls.** Dans accounts.zoho.com > Sécurité > Mots de passe d'application, créer un nouveau mot de passe pour Autocalls (Settings > SMTP) et un pour ZOHO_SMTP_PASS. Ne pas toucher à RELANCES_IMAP_PASS.
7. **Bases de connaissances.** Autocalls > Knowledge base : supprimer les documents listés dans docs/autocalls-kb-a-supprimer.md (Claude ne supprime jamais de données définitivement, même avec votre accord).
8. **Avocat et comptable** : leur confier les décisions 1 et 2.
9. **Ancienne copie du site** (permanentia-prod) : dire « oui » à Claude pour la retirer, ou la supprimer vous-même dans la console Firebase (projet permanentia-prod).

Les autres réglages (Autocalls, Stripe, Zoho, Google Analytics, Meta) sont dans la checklist.

## 5. En attente de tiers

- **Autocalls.**
  - 3 réponses reçues :
    - un client qui a du crédit continue à utiliser le service même si votre solde d'agence est à 0 ;
    - les numéros clients se renouvellent chaque mois ;
    - un transfert d'appel est décompté des minutes.
  - 21 questions ouvertes sur 24, d'après le suivi du dépôt (le fil WhatsApp n'a pas été revérifié). La question des 3,09 $ reste sans réponse. Les plus urgentes portent sur :
    - la taxe au paiement (risque d'échec du paiement) ;
    - l'essai dans Stripe ;
    - les impayés ;
    - les e-mails « via autocalls.ai ».
  - Les autres concernent notamment : le SEPA, la langue des factures, les crédits, les données de santé, les webhooks et les bases « failed ». À ajouter : le coût réseau d'un appel transféré.
- **Meta.** Réexamen de 18 modèles (vous avez jusqu'au 7 décembre pour agir) et vérification d'entreprise.
- **Stripe.**
  - Domaine d'envoi : DNS trouvés, statut « Verifying ». Stripe annonce jusqu'à 72 heures : vers le 10 octobre si l'on compte depuis l'ajout (7 octobre, 19 h 03), au plus tard le 11.
  - Représentant du compte (Joseph Haddad) marqué « Invalid » dans Business details > Management and ownership : l'ouvrir pour voir ce que Stripe demande. Aucun examen n'est en cours.
  - Cartes Bancaires en pause (les autres moyens de paiement, les paiements et les virements sont actifs).

## 6. Décisions à prendre

La flèche → donne la recommandation de Claude.

1. **Avocat.** Représentant RGPD dans l'UE et au Royaume-Uni, CGU, démarchage, texte Meta, cases marketing. → Un seul avocat, avant d'ouvrir it, pl, nl et he.
2. **Comptable.** TVA, formulaires 5472 et 1120. → Un expert-comptable américain (CPA) habitué aux LLC à propriétaire étranger.
3. **Paiement par RIB.** → Virement pour l'instant.
4. **Paiements de test (23,09 $).** → Ne pas rembourser si la carte 0377 est la vôtre. Libérer le +44 7782 230071 avant le 31 octobre.
5. **E-mail de support Stripe.** → contact@permanenceia.com.
6. **Directeur de publication.** → Vous, avec le +44.
7. **Les 18 modèles « marketing ».** → Attendre le réexamen. En cas de refus, faire des versions factuelles.
8. **WhatsApp israélien.** → À créer avant toute publicité en Israël.
9. **Numéro SMS, et les numéros 11775 et 11795.** → Tester un SMS depuis la ligne britannique, puis libérer les numéros inutiles. (9 octobre : 11775 et 11795 ne sont plus sur le compte.)
10. **Bouton « Connect AI ».** → Le garder masqué et retirer la ligne du comparatif.
11. **Bulle sur téléphone.** → La masquer quand elle est fermée, sous 640 px.
12. **Google Analytics.** → Ne rien charger avant « Accepter ».
13. **Jeton dans les adresses des webhooks.** Autocalls ne propose pas d'en-tête : seulement le jeton dans l'adresse, ou une automatisation « appel terminé » suivie d'une requête HTTP avec une connexion. → Remplacer le jeton, puis passer les webhooks de fin d'appel par une automatisation.
14. **Case de la démo par téléphone.** → Élargir le texte, après avis de l'avocat.
15. **Conservation des données.** → 90 jours, comme annoncé.
16. **Langues.** → Vouvoiement en polonais. Anglais par défaut.
17. **Moyens de paiement.** Selon Autocalls, le paiement des forfaits affiche les moyens activés dans Stripe, mais SEPA n'apparaît que sur des prix en euros, et la plateforme facture en dollars. Recharges et numéros débitent la carte enregistrée. → Couper Affirm, Klarna et Cash App Pay. Pour iDEAL, regarder s'il apparaît lors du test de paiement.
18. **Qui rappelle pendant l'essai.** → L'agent IA de support, et un humain sur demande.

## 7. Relances commerciales

**État.** Mode test depuis le 8 octobre pour fr, en-gb et en-au :
- le planificateur passe toutes les heures. Le premier passage planifié propre date de 13 h UTC (celui de 12 h a échoué en 401) ; depuis, chaque passage se termine avec 0 envoyé, 0 simulé et 0 échec ;
- la lecture des réponses par IMAP est branchée, mais son bon fonctionnement n'a pas été vérifié dans Supabase ;
- vos comptes de test sont exclus ;
- rien ne part aux contacts. Un rapport quotidien arrive à contact@ à 8 h, heure de Paris.

Aucun contact actuel n'a coché de case marketing : au début, seuls les nouveaux contacts seront relancés.

**Pour passer en envoi réel :**
1. Lire les rapports pendant quelques jours (la conception prévoit une semaine).
2. Faire relire l'anglais par un natif, et faire valider les cases marketing par l'avocat.
3. Attendre que Stripe valide le domaine.
4. Dire « go ». Claude passe alors RELANCES_DRY_RUN à 0 et surveille la montée : 20 e-mails par jour, puis 50.

L'arrêt est possible à tout moment.

**Marchés.** it, pl, nl et he restent fermés tant que la nouvelle case n'a pas recueilli d'accords. WhatsApp n'est pas concerné.

## 8. Propositions pour la suite

- **Page privée /admin** (recommandée par l'étude CRM) :
  - elle croise Stripe, Autocalls et Supabase : soldes, fins d'essai, impayés, marge ;
  - coût : environ 0 $ par mois ;
  - travail : 3 à 5 jours pour Claude, et pour vous une clé Stripe en lecture seule.
- **Alerte d'erreurs** envoyée par e-mail à contact@.
- **Comptabilité** : Xero ou QuickBooks, plus un CPA. Un CRM gratuit (Zoho, HubSpot) quand vous aurez quelques dizaines de clients.
- **Polices du site** gardées dans le dépôt, pour ne plus dépendre de Google à la mise en ligne.
- **DMARC** (la règle qui protège contre l'usurpation de votre adresse) : passer de « p=none » à « p=quarantine » dans un mois.

## 9. Annexe

- Checklist : docs/audits/actions-proprietaire-2026-10-08.md
- Étude CRM : docs/audits/crm-tableau-de-bord-2026-10-07.md
- Audits du 7 octobre : docs/audits/verification-audits-2026-10-07.md
- Relances : docs/relances/conception-2026-10-08.md et docs/relances/apercus/index.html
- Autocalls : docs/autocalls-questions-2026-10-08.md, docs/autocalls-questions-whatsapp.md, docs/autocalls-kb-a-supprimer.md et docs/autocalls-agents-a-faire-proprietaire.md
- WhatsApp : docs/autocalls-modeles-whatsapp.md
- Domaine e-mail Stripe : docs/stripe-domaine-email.md

## 10. Réponses d'Autocalls (8 octobre au soir)

Le tableau complet, question par question, est dans docs/autocalls-questions-whatsapp.md. Restent sans réponse : la commission de 2,70 $ sur l'achat d'un numéro et le mot de passe SMTP visible (message 5, prêt à envoyer).

**Fait par Claude dans la foulée :**
- « Resync Billing Portal » lancé et confirmé (Autocalls et journal Stripe, 13 h 52 UTC). Le portail affiche les trois forfaits, au mois et à l'année.
- Vérifié dans Stripe, rien à changer :
  - après le dernier essai de paiement, l'abonnement est annulé, comme Autocalls le recommande ;
  - rappel 7 jours avant la fin de l'essai, e-mails d'échec de paiement, mention « fin d'essai » sur le relevé.
- Vérifié dans Autocalls : la conversion minutes → crédits est active, le site disait donc vrai.
- Site et bases de connaissances alignés, en 7 langues :
  - 200 crédits inclus dans Réceptionniste ;
  - achat direct de crédits : 100 crédits pour 1 $, dès 100 crédits ;
  - recharge de minutes dès 5 $ ;
  - codes promo sur les forfaits seulement ;
  - pas de SEPA.
- Guides fr, it et nl : l'exemple d'accueil dit « assistante IA ».
- Langue des factures et reçus Stripe : le webhook la pose d'après la langue enregistrée sur le site. Il n'agit qu'une fois la clé restreinte créée (actions, section 3). Pas d'hébreu chez Stripe : anglais.
- Le message « nous avons essayé de vous rappeler » (WhatsApp ou SMS) n'est plus envoyé à un numéro qui a refusé d'être contacté. La liste de blocage d'Autocalls ne filtre pas les envois faits par l'API.

**Ce que cela change pour vous :**
- Les e-mails système (fin d'essai, solde bas, paiement, mot de passe, pause de conformité) partent en anglais pour tous les clients. Seul l'e-mail de bienvenue se modifie. La traduction coûte 1 900 $ par langue (décision 21).
- Les données sont stockées chez AWS à Francfort. Pendant les appels, des fournisseurs d'IA situés aux États-Unis interviennent aussi, sauf si vous demandez le routage UE (décision 19). Autocalls n'est pas certifié HDS : les secteurs santé restent en pause. Gardez le DPA reçu hors du dépôt, qui est public.
- Un assistant mis en pause par le contrôle de conformité : le client reçoit un e-mail en anglais à votre nom. Vous n'êtes pas prévenu. Pour le débloquer, envoyez l'ID de l'assistant à Autocalls.
- L'inscription ne recueille ni téléphone ni accord WhatsApp. Pour les obtenir, il faudrait gérer l'inscription sur le site puis créer le compte par l'API (POST /white-label/register). C'est un chantier à décider plus tard.

**Bases de connaissances (fait le 8 octobre au soir, avec votre accord).** Claude a créé 7 bases neuves à partir du site corrigé : 95 documents, tous actifs. Il y a rattaché les 41 agents. Vous avez supprimé les 7 anciennes bases (6163, 6166, 6167, 6168, 6169, 6180, 6209) ; la vérification qui a suivi ne montre aucun écart. Détail : docs/autocalls-kb-a-supprimer.md.


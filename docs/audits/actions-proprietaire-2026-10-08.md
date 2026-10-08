# Actions du propriétaire (mise à jour du 8 octobre 2026, après les réponses d'Autocalls)

Cette liste ne contient que ce qui reste à faire. « Stripe » désigne le compte Permanence IA. Ce qui a été fait aujourd'hui en a été retiré :
- DNS Stripe et doublon DKIM ;
- webhook et secret Stripe, IMAP Zoho ;
- base de données Supabase, planificateur ;
- widgets, photos des secteurs, modèles WhatsApp ;
- pied de page de l'e-mail de bienvenue, formulaire d'essai à deux cases, webhooks de fin d'appel, envoi des questions à Autocalls.

## 1. À faire en priorité (bloque des ventes ou crée un risque)

1. **Tests de paiement**, avant toute publicité, sur un compte test de app.permanenceia.com :
   - essai avec carte ;
   - changement de forfait pendant l'essai ;
   - passage à l'annuel ;
   - recharge et achat de numéro.

   Prévenez ensuite Claude.
2. **Tests d'appels.**
   - Appeler le +44 7367 090106 et le 02-376-7085, en prospect puis en client.
   - Demander deux rappels, A dans 15 min et B dans 30 min : seul B doit appeler.
   - Ne pas décrocher à un rappel : le répondeur doit se déclencher, puis un SMS ou un WhatsApp doit partir.
   - Ouvrir le widget de l'espace client en fr, it et he.
   - Faire écouter les voix étrangères par des natifs.
3. **Test d'inscription** avec une adresse Gmail. Le message de bienvenue doit arriver hors spam, et contact@ doit recevoir « Nouvelle inscription ». Le compte test yossef ne doit pouvoir ni appeler ni acheter.
4. **Message 5 à Autocalls.** Envoyer le message 5 de docs/autocalls-questions-whatsapp.md : commission de 2,70 $ sur l'achat d'un numéro, et mot de passe SMTP visible. Le forfait Réceptionniste n'est plus à recréer : Autocalls lui donne 200 crédits, et Claude a lancé « Resync Billing Portal » (confirmé).
5. **Campagnes de rappel.** Fait le 8 octobre au soir par Claude : les 20 campagnes sont à 2 tentatives toutes les 240 minutes (vérifié par l'API).
6. **Mot de passe Zoho.** Fait : vous l'avez changé le 8 octobre.
7. **Bases de connaissances.** Fait : vous avez supprimé les 7 anciennes bases, et Claude a vérifié le résultat (7 bases neuves actives, 95 documents actifs, 41 agents bien rattachés).
8. **Avocat et comptable.** Leur confier les décisions 1 et 2.
9. **Ancienne copie du site.** Fait le 8 octobre : Claude a supprimé le service App Hosting du projet permanentia-prod et désactivé ses 3 secrets (ancienne clé Autocalls comprise). Les deux adresses de la copie renvoient 404. Le projet Google lui-même reste ; vous pouvez le fermer dans la console si vous voulez.

## 2. Décisions à prendre

Le détail et les recommandations sont dans rapport-final-2026-10-08.md, section 6.
1. Avocat.
2. Comptable.
3. Paiement par RIB.
4. Paiements de test.
5. E-mail de support Stripe.
6. Directeur de publication.
7. 18 modèles « marketing ».
8. WhatsApp israélien.
9. Numéros SMS, 11775 et 11795.
10. Bouton « Connect AI ».
11. Bulle sur téléphone.
12. Google Analytics.
13. Jeton des webhooks.
14. Case de la démo par téléphone.
15. Durée de conservation.
16. Langues.
17. Moyens de paiement Stripe.
18. Qui rappelle pendant l'essai.
19. Routage 100 % UE des appels : décidé le 8 octobre, on ne le demande pas. La politique de confidentialité annonce déjà des données dans l'EEE et/ou aux États-Unis, avec des garanties.
20. Taxe automatique au paiement : Autocalls l'a coupée pour notre plateforme. → La faire réactiver quand le comptable aura choisi les immatriculations.
21. Traduction de la plateforme : décidé le 8 octobre, on reste en anglais. L'assistante de l'espace client aide chaque client dans sa langue.
22. Langue des factures Stripe : Claude a ajouté au webhook la pose automatique de la langue du client. → Créer une clé restreinte (voir section 3).

## 3. Comptes et tiers

1. **Stripe.**
   - Représentant du compte marqué « Invalid » : Settings > Business details > Management and ownership, ouvrir la fiche de Joseph Haddad et fournir ce que Stripe demande. Aucun examen n'est en cours ; Cartes Bancaires est en pause.
   - SEPA : inutile. Selon Autocalls, il n'apparaît que sur des prix en euros, et la plateforme facture en dollars.
   - Clé pour la langue des factures : Developers > API keys > Create restricted key, nom « langue-factures », droit « Customers : Write » et rien d'autre. Claude vous donnera ensuite la commande pour l'enregistrer en saisie masquée (ne pas la coller dans la conversation).
   - Vérifier vers le 10 octobre, le 11 au plus tard : Settings > Customer emails, domaine « Verified ».
   - Le 31 octobre et le 1er novembre : contrôler la facturation du numéro de nyh770.
2. **Admin Autocalls.**
   - Settings > Website URLs > Documentation URL (actuellement /aide) : https://www.permanenceia.com/docs (cette adresse renvoie vers l'aide dans la langue du navigateur ; sans langue indiquée, vers l'aide en anglais).
   - Plans 1646, 1647 et 1650 : remplacer « 1 / 3 / 10 phone number(s) » par « Up to 1 / 3 / 10 dedicated numbers (optional, from $3.99/month) ». Faire la même correction sur les produits Stripe.
   - Prompt templates : désactiver les 10 modèles santé. Claude fournit les modèles hébreux.
   - Billing > Update information : SINAY STRATEGIC LLC, Cheyenne.
3. **Support Autocalls.**
   - Faire annuler les 20 exécutions en pause, sans cliquer sur Retry.
   - Ajouter la question du coût réseau d'un appel transféré.
4. **Zoho.** Zoho Mail > Paramètres > Comptes de messagerie > Transfert : ajouter l'adresse que vous lisez chaque jour. Sinon, personne ne lit contact@.
5. **Google Analytics** (propriété 557884458). Admin > Événements : marquer comme événements clés generate_lead, whatsapp_click, phone_call_click, begin_trial_click et sign_up.
6. **Meta.**
   - Events Manager : couper la correspondance automatique, et vérifier que le Controller Addendum est accepté.
   - Renommer le compte WhatsApp « Permanence agent » en « Permanence IA ».
   - Suivre la vérification d'entreprise et le réexamen des 18 modèles.
7. **Relances.** Lire le rapport quotidien sur contact@ et dire « go » quand il vous convient.

## 4. Peut attendre

- Facebook : lier WhatsApp et Instagram, nom de la page.
- Identifiants Google Ads et Microsoft Ads, vérification Google et Bing.
- Numéros locaux par pays.
- Business plan à valider, et formulation du prix des messages.
- Présentations PDF : les publier ou les retirer.
- Voix de 21205 par langue.
- Samedis et jours fériés des campagnes australiennes.
- Offres : prix de lancement, code promo, apporteurs.
- Relevé de la carte 0377 : un débit de 50 $ est absent de Stripe.
- Rangement des packs marketing (environ 700 Mo, hors dépôt).

## 5. À reprendre par Claude

- Relances en envoi réel : votre « go » est reçu, mais le contrôle de sécurité de Claude Code a bloqué le changement (envoi d'e-mails à de vrais contacts). Soit vous lancez la commande donnée par Claude, soit vous autorisez Claude à le faire.
- Avec votre accord : page /admin, alerte d'erreurs, remplacement du jeton des webhooks, Google Analytics après accord aux cookies, libération des numéros, suppression des anciens documents.
- Sans attendre :
  - mention des préférences e-mail dans /confidentialite ;
  - modèles hébreux ;
  - polices gardées dans le dépôt.
- Après l'avis de l'avocat : accord oral aux e-mails marketing dans les agents.

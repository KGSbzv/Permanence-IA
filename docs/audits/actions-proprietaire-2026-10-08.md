# Actions du propriétaire (mise à jour du 8 octobre 2026, soir)

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
4. **Forfait Réceptionniste à 200 crédits.** Admin Autocalls > Plans > New plan : recréer Receptionist à l'identique, avec Included Credits 200. Désactiver 1646, lancer Resync Billing Portal, puis donner le nouveau numéro à Claude.
5. **7 campagnes de rappel.** Campaigns > 12519, 12520, 12521, 12522, 12532, 12533, 12534 : Max retries 2, Retry interval 240, Save.
6. **Mot de passe Zoho visible dans Autocalls.**
   - accounts.zoho.com > Sécurité > Mots de passe d'application : en créer deux.
   - Le premier va dans app.autocalls.ai/administrator/settings?tab=smtp (Save, puis Test).
   - Le second va dans Google Cloud > Secret Manager > ZOHO_SMTP_PASS > Nouvelle version.
   - Prévenir Claude, puis révoquer l'ancien. Garder celui des relances (RELANCES_IMAP_PASS).
7. **Bases de connaissances « failed ».** Autocalls > Knowledge base : supprimer les documents de docs/autocalls-kb-a-supprimer.md, section 5 comprise. Claude ne supprime jamais de données définitivement : c'est à faire par vous.
8. **Avocat et comptable.** Leur confier les décisions 1 et 2.
9. **Copie inutile du site.** Le projet Google permanentia-prod en publie une, avec une ancienne clé Autocalls. Dites « oui » à Claude pour la supprimer.

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

## 3. Comptes et tiers

1. **Stripe.**
   - Représentant du compte marqué « Invalid » : Settings > Business details > Management and ownership, ouvrir la fiche de Joseph Haddad et fournir ce que Stripe demande. Aucun examen n'est en cours ; Cartes Bancaires est en pause.
   - SEPA : Payment methods > Billing Payments > SEPA > Provide info.
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

- Avec votre « go » : passer les relances en envoi réel.
- Avec votre accord : page /admin, alerte d'erreurs, remplacement du jeton des webhooks, Google Analytics après accord aux cookies, libération des numéros, suppression des anciens documents.
- Sans attendre :
  - exemples d'accueil des guides fr, it et nl, puis réimport dans Autocalls ;
  - mention des préférences e-mail dans /confidentialite ;
  - modèles hébreux ;
  - polices gardées dans le dépôt.
- Après l'avis de l'avocat : accord oral aux e-mails marketing dans les agents.

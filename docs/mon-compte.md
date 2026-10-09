# Page « Mon compte » (/mon-compte)

Page du site où un client consulte, **dans sa langue et aux couleurs du site**, ce que l’espace client
(app.permanenceia.com, en anglais) montre mal : son forfait et son statut, son solde de minutes et de crédits de
messages, sa carte et ses factures. La page est **en lecture seule** : les changements (carte, forfait, résiliation,
achats) se font dans l’espace client, vers lequel elle renvoie directement.

Adresses : `/mon-compte`, `/en-gb/mon-compte`, `/en-au/mon-compte`, `/it/mon-compte`, `/pl/mon-compte`,
`/nl/mon-compte`, `/he/mon-compte`. Page non indexée (balise `noindex` et en-tête `X-Robots-Tag`), absente du plan du
site, jamais mise en cache.

Accès : lien « Mon compte » dans le pied de page (colonne Ressources), dans le menu mobile (sous « Connexion ») et
bouton « Voir mon forfait et mes factures » en haut de la page d’aide (`/aide`).

## Parcours

1. Le client saisit l’email de son compte. Le site envoie un **code à 6 chiffres** à cette adresse (email essentiel,
   pied de page légal compris, dans la langue de la page). La réponse arrive en 6 secondes environ et elle est
   identique, que l’adresse ait un compte ou non : personne ne peut savoir qui est client.
2. Il saisit le code. S’il est bon, le site ouvre une **session de 30 minutes** (cookie, sans prolongation).
3. Le tableau de bord affiche :
   - **Votre forfait** : nom du forfait, statut (essai gratuit en cours, actif, paiement en retard, résilié, en pause),
     fin de l’essai et premier prélèvement, prochaine échéance et montant, résiliation programmée. « Aucun forfait »,
     avec l’explication « l’essai gratuit de 14 jours (30 minutes) démarre quand vous choisissez un forfait » et le
     bouton « Choisir un forfait » (app.permanenceia.com/plans), seulement dans deux cas : Stripe confirme que le client
     n’a pas d’abonnement, ou aucun client Stripe n’a cette adresse **et** le solde est à 0 minute (inscrit qui n’a pas
     choisi de forfait). Aucun client Stripe mais des minutes : message neutre (« nous ne retrouvons pas de forfait lié
     à cette adresse… l’adresse de facturation peut être différente ») et bouton Billing info, pour ne jamais pousser
     un client payant à reprendre un forfait.
   - **Votre solde** : minutes restantes et crédits de messages (100 crédits = 1 $).
   - **Moyen de paiement** : marque, 4 derniers chiffres, expiration.
   - **Vos dernières factures** (12) : numéro, date, montant, statut, liens « Voir la facture » et PDF (pages Stripe).
   - **Gérer mon compte** : ouvrir l’espace, changer de carte (Billing info, onglet Wallet), toutes les factures,
     changer de forfait (avec la mention : pendant l’essai, le nouveau forfait démarre aussitôt et l’essai prend fin),
     acheter des minutes ou des crédits de messages (Add credits), annuler l’abonnement. « Annuler » (et « Changer de
     carte » s’il n’y a pas de carte) disparaît quand Stripe confirme qu’il n’y a pas d’abonnement en cours.
   - Bouton « Se déconnecter ».

## Sécurité

- **Code partagé avec Lucie** (src/lib/accountCode.ts) : même mécanisme que le dossier client de Lucie
  (`/api/agent/account`), avec un code différent pour chaque usage (un code reçu pour Lucie n’ouvre pas la page).
  Code valable 10 à 20 minutes, **usage unique**. Après chaque connexion réussie, le code change (« génération ») :
  un nouveau code demandé juste après (déconnexion puis reconnexion, second appareil) fonctionne, et les codes
  envoyés avant ne servent plus.
- **Aucun essai sans code envoyé** : un code n’est accepté que si un email de code est réellement parti vers cette
  adresse dans les 20 minutes. Deviner un code exige donc un email reçu par le titulaire, et aucune session ne peut
  s’ouvrir pour une adresse qui n’a pas de compte.
- **Compteurs communs à Lucie et à la page**, enregistrés en base (table `call_events`, adresse hachée, jamais en
  clair) : au plus 3 codes envoyés par heure, 5 essais par heure et 15 essais par jour et par adresse ; au-delà,
  l’accès est verrouillé. Si l’essai ne peut pas être enregistré (base en panne), l’accès est refusé.
- Limites supplémentaires de la page : 5 demandes de code par quart d’heure et par adresse IP, 20 codes envoyés et
  20 vérifications par jour depuis une même adresse IP (compteurs en base, toutes instances confondues), champ piège
  anti-robots, requêtes d’un autre site refusées (en-tête Origin).
- **Cookie de session** `__Host-pia_account` : signé (HMAC, clé dérivée d’`ACCOUNT_CODE_SECRET` avec un libellé
  propre), HttpOnly, Secure, SameSite=Lax, 30 minutes. Il ne contient que l’adresse et l’heure d’expiration. Le
  préfixe `__Host-` empêche un sous-domaine (app.permanenceia.com est l’espace client d’un tiers) de poser un cookie
  de session à la place du site. **Aucune donnée personnelle dans l’URL.**
- Journaux : les messages d’erreur (serveur d’email, Stripe, base) sont journalisés sans adresse email ni clé.
- **Lecture seule** : aucune écriture dans Stripe ni dans l’espace client (pas de jeton client créé, pas de session de
  portail Stripe). Un client ne voit jamais les données d’un autre : correspondance exacte de l’adresse, et contrôle
  que chaque abonnement, facture ou carte appartient bien au client retenu.

## Sources des données

- **Espace client (Autocalls white-label)**, clé `AUTOCALLS_API_KEY` déjà en place : nom, date de création, minutes et
  crédits de messages, lus dans la liste des comptes (`/white-label/users`, toutes les pages).
- **Stripe, compte « Permanence IA »** (acct_1UNBLcBjFUxnZPfW, où sont les clients et abonnements des forfaits) :
  forfait, statut, carte et factures, lus avec la clé `STRIPE_ACCOUNT_KEY` (ci-dessous). Le client est retrouvé par
  son email. S’il existe plusieurs clients Stripe pour la même adresse, la page retient celui qui a un abonnement en
  cours (essai, puis actif, puis impayé…), sinon celui du dernier abonnement terminé, sinon le plus récent.
- Le montant affiché est le prix du forfait **avant remise** (une mention le précise quand un code promo s’applique) ;
  le montant exact figure sur la facture. Si l’abonnement est facturé dans une autre devise que le prix (tarification
  locale), le montant n’est pas affiché, seulement la date. Les éléments au compteur ne sont pas ajoutés au prix.
- Si une lecture secondaire échoue (nom du produit, carte, factures : droit manquant sur la clé, délai), le forfait
  reste affiché ; la carte ou les factures indiquent « momentanément indisponible ».

## Comportement sans la clé Stripe

Tant que `STRIPE_ACCOUNT_KEY` n’est pas configurée, la page fonctionne : connexion, minutes, crédits de messages et
identité s’affichent. Le forfait vient alors des tables remplies par le **webhook Stripe signé** déjà en service
(`stripe_customers`, `stripe_subscriptions`, mode réel seulement) : statut, fin d’essai, prochaine échéance,
résiliation programmée et montant indicatif ; le nom du forfait est reconnu d’après le prix de la grille du site
(99, 249, 499 $ par mois ou 990, 2 490, 4 990 $ par an). La carte et les factures restent dans Billing info (lien
affiché). Les abonnements créés avant la mise en service du webhook (8 octobre 2026) et sans événement depuis ne sont
pas en base : la partie forfait affiche alors un message neutre (« Le détail de votre forfait et de vos factures
s’affiche dans votre espace client, rubrique Billing info ») avec un bouton vers Billing info. Si le solde de minutes
est à zéro, la page explique que l’essai démarre quand on choisit un forfait (ou que les minutes sont épuisées), avec
les boutons « Choisir un forfait » et « Acheter des minutes ». Si Stripe ne répond pas (panne, délai de 5 secondes
dépassé), la page se rabat sur la base, sinon affiche « momentanément indisponible ».

## Ajouter la clé Stripe (à faire par le propriétaire)

1. Dans Stripe, ouvrir le compte **Permanence IA** (acct_1UNBLcBjFUxnZPfW), en mode réel (pas le mode test).
2. **Développeurs → Clés API → Créer une clé restreinte**. Nom : `permanenceia-site-mon-compte`.
3. Droits : **Lecture** pour les lignes suivantes, **Aucun** pour tout le reste :
   - Customers (clients)
   - Subscriptions (abonnements)
   - Invoices (factures)
   - PaymentMethods (moyens de paiement)
   - Products (produits)
   - Prices (tarifs)
4. Créer la clé et copier sa valeur (`rk_live_…`). Ne l’envoyer à personne par email ni par message.
5. L’ajouter comme secret App Hosting du projet qui sert le site, puis l’accorder au backend :

   ```
   firebase apphosting:secrets:set STRIPE_ACCOUNT_KEY --project snarecore-cacrs
   firebase apphosting:secrets:grantaccess STRIPE_ACCOUNT_KEY --backend voiceia --project snarecore-cacrs --location us-east4
   ```

   (la première commande demande de coller la valeur de la clé).
6. Dans `apphosting.yaml`, décommenter les deux lignes sous « Page « Mon compte » » :

   ```yaml
     - variable: STRIPE_ACCOUNT_KEY
       secret: STRIPE_ACCOUNT_KEY
   ```

   puis pousser sur `main`. **Ne jamais décommenter avant les étapes 5** : un secret référencé qui n’existe pas (ou
   qui n’est pas accordé au backend voiceia) fait échouer chaque déploiement.
7. Vérifier après le déploiement : se connecter sur /mon-compte avec un compte qui a un forfait, recharger la page
   (la session doit tenir), vérifier le forfait, la carte et les factures.

En option, la même clé peut servir de `STRIPE_READ_KEY` au webhook des relances (lecture des clients Stripe dont
l’email manque) : même démarche, avec le nom de variable `STRIPE_READ_KEY`.

## Tests

```
npx tsx scripts/test-mon-compte.ts
```

Aucun réseau ni aucune base réelle (faux Supabase, Autocalls et Stripe). Vérifie notamment : cookie signé
(falsifications, expiration, sans secret, préfixe `__Host-`), formule du code de Lucie inchangée, code du site
distinct, génération après une connexion, aucun essai sans code envoyé, 3 envois par heure, 5 essais par heure et
15 par jour, 20 vérifications par jour et par IP, adresse masquée dans le journal, usage unique, choix du client et
du statut Stripe, lecture Stripe en GET seulement avec les factures du seul client retenu, « aucun client » distinct
de « pas d’abonnement », lectures secondaires en échec, devise et éléments au compteur, forfait lu dans les tables du
webhook, pagination Autocalls commune avec les relances, emails du code dans les 7 langues, route `/api/account`, et
comportement de Lucie.

## Limites

- Changer de carte, de forfait ou résilier se fait dans l’espace client (Billing info, onglet Wallet pour la carte).
  Un bouton direct « Mettre à jour ma carte » sur le site demanderait de créer une session du portail Stripe, donc
  une écriture dans Stripe : c’est une décision du propriétaire, non prise ici.
- Safari refuse les cookies `Secure` sur `http://localhost` : en développement local, tester la connexion avec
  Chrome ou Firefox (en production, le site est en HTTPS).
- La session dure 30 minutes, sans prolongation : au-delà, la page redemande un code.

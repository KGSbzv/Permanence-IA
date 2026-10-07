# CRM et tableau de bord admin : ce qui est faisable

## 1) Réponse courte

**Oui, mais pas dans l'admin Autocalls.** On ne peut y brancher aucun CRM. Son API ne donne que le nom, l'e-mail, les soldes et la date d'inscription de chaque client. Elle ne donne ni le forfait, ni les paiements, ni la date de fin d'essai.

L'argent est dans Stripe et la consommation chez Autocalls. Aucun outil du marché ne réunit les deux. La solution la plus rentable a deux volets :
- utiliser ce que Stripe offre déjà ;
- ajouter sur votre site une page privée /admin qui croise Stripe, Autocalls et Supabase.

Un CRM payant est prématuré : il n'y a aujourd'hui que 3 comptes, tous de test.

## 2) Déjà disponible et gratuit (compte Stripe « Permanence IA »)

- **Billing > Overview** donne le revenu mensuel récurrent (MRR), le taux de départ des clients (churn), le revenu moyen par client, les nouveaux abonnés et des exports CSV. Limite : les recharges de minutes ne comptent pas dans ce revenu mensuel.
- **Revenue recovery** liste les paiements échoués et récupérés, et les clients en cours de relance. Les e-mails de relance sont déjà activés (échec de paiement, carte expirée, renouvellement, fin d'essai).
  - Deux points sont à vérifier : les nouvelles tentatives automatiques (Smart Retries) et ce que devient l'abonnement après la dernière tentative.
  - Ne choisissez pas « annuler » avant la réponse d'Autocalls.
- **Stripe Workflows** envoie des alertes e-mail sans code (paiement échoué, résiliation). Stripe ne confirme pas que c'est gratuit.

## 3) Propositions classées

**1. Page /admin sur votre site (recommandée)**
- **Ce que ça apporte :**
  - le solde du pot commun Autocalls, environ 3 493 minutes aujourd'hui, avec une alerte (toute la consommation de vos clients se déduit de ce pot) ;
  - le solde et le rythme de consommation de chaque client, et les clients bientôt à court ;
  - la marge estimée : encaissements Stripe moins le coût Autocalls (minutes × 0,09 $ et 419 $ fixes par mois) ;
  - les fins d'essai, les paiements échoués et les inscrits sans forfait à relancer ;
  - un récapitulatif quotidien par e-mail.
- **Comment ça se branche :** Stripe prévient le site à chaque paiement. Chaque nuit, le site lit les soldes chez Autocalls. Tout est rangé dans votre base Supabase.
- **Coût mensuel :** environ 0 $.
- **Effort :** 3 à 5 jours de travail de ma part. De votre côté, 20 à 30 minutes :
  - créer dans Stripe Permanence IA une clé en lecture seule et un webhook (l'adresse à laquelle Stripe prévient le site) ;
  - me confirmer le forfait que vous payez réellement à Autocalls.
- **Risques :**
  - La marge reste approximative : on ne sait pas si le coût par appel affiché par Autocalls est au prix de gros.
  - L'essai n'est peut-être pas géré par Stripe. La fin d'essai serait alors estimée (inscription + 14 jours).
  - Clients Stripe et Autocalls sont rapprochés par e-mail : un client inscrit avec deux e-mails différents ne sera pas reconnu.
  - Le code du site est public : la connexion doit être très protégée, et la page doit respecter le RGPD.

**2. Alerte provisoire sur le pot commun (automatisation Autocalls)**
- Un e-mail part quand le pot ou un client passe sous un seuil.
- Coût : 0 $. Effort : environ 1 heure.
- C'est prudent d'ici la mise en service de /admin : Autocalls ne dit pas ce qui se passe quand le pot est vide. Elle fera doublon ensuite.

**3. Comptabilité : un logiciel relié à Stripe et un comptable américain (CPA)**
- **Logiciel :**
  - Xero Growing à 59 $/mois (11,80 $ les 3 premiers mois), avec son application Stripe gratuite ;
  - ou QuickBooks (38 à 85 $) avec Acodei (dès 12 $), si votre comptable l'utilise.
- **CPA :** si vous n'êtes pas résident fiscal américain (« US person »), la LLC doit déposer chaque année le formulaire 5472, même sans revenu. L'amende en cas d'oubli est de 25 000 $. Comptez environ 200 à 1 500 $ par an. Il tranchera aussi la TVA pays par pays.
- **Effort :** 1 à 3 heures pour vous.

**4. CRM gratuit, plus tard**
- Zoho CRM (gratuit jusqu'à 3 utilisateurs) ou HubSpot (gratuit pour 2 utilisateurs et 1 000 contacts, hébergement en Europe possible). Le site l'alimenterait automatiquement.
- Utile à partir de quelques dizaines de clients.
- Zoho héberge vos données aux États-Unis : il faudrait un accord de traitement des données (RGPD).

## 4) Pas faisable ou pas rentable

- **Alertes Autocalls sur les paiements, les essais ou les soldes bas :** elles n'existent pas. Seule l'alerte « inscription » existe, et elle est déjà branchée.
- **HubSpot Stripe Data Sync :** les abonnements n'y sont visibles qu'en formule Enterprise. L'application est notée 2,1/5 et peut écrire dans Stripe.
- **Pipedrive (environ 39 $ par utilisateur), Attio, folk, Brevo :** payants, et ils ne voient pas les minutes consommées.
- **Outils Stripe payants :** Sigma (10 à 15 $), Data Pipeline (50 à 65 $), Revenue Recognition (25 $) et Tax Complete (dès 90 $) sont surdimensionnés pour votre taille.
- **Brique Stripe des automatisations Autocalls :** seulement 4 événements surveillés (pas d'impayé, ni de fin d'essai, ni de résiliation). Le site fera mieux.
- **Modifier un abonnement directement dans Stripe ou dans un CRM :** cela risque de désynchroniser Autocalls, qui attribue les minutes selon le forfait.

## 5) Par quoi commencer cette semaine

1. **Vous (30 min) :** ouvrez Billing overview et Revenue recovery dans Stripe Permanence IA, et vérifiez les Smart Retries.
2. **Vous (10 min) :** posez 4 questions à Autocalls. Je peux rédiger le message.
   - Que se passe-t-il quand le pot commun est vide ?
   - Le coût affiché par appel est-il au prix de gros ?
   - L'essai crée-t-il un abonnement dans Stripe ?
   - Les forfaits calculent-ils la taxe ? Vos conditions générales (CGU) le promettent, mais ce n'est probablement pas le cas aujourd'hui.
3. **Vous (20 min) :** créez la clé Stripe en lecture seule et le webhook.
4. **Moi :** je construis la première version de /admin, en commençant par l'alerte sur le pot commun.
5. **Vous :** contactez un CPA pour le formulaire 5472.

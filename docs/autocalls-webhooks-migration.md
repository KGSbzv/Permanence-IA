# Webhooks Autocalls : sortir le jeton des adresses (8 octobre 2026)

## Pourquoi

Aujourd'hui, le jeton secret qui protège les routes du site (WEBHOOK_TOKEN) est écrit dans **66 adresses** chez Autocalls :
- 39 webhooks de fin d'appel ;
- 17 webhooks de fin de conversation ;
- 10 outils pendant l'appel.

Autocalls l'affiche en clair dans ses réponses d'API, et il passe dans les journaux de requêtes. Le jeton doit donc être changé, et ne plus jamais apparaître dans une adresse.

Ce qu'Autocalls permet (réponse du 8 octobre, vérifiée par l'API) :
- **Outils pendant l'appel :** ils savent envoyer un en-tête. On retire « ?token=… » de l'adresse et on met le jeton dans l'en-tête `x-webhook-token`, que le site lit déjà. Pas besoin d'automatisation.
- **Webhooks d'agents** (fin d'appel, fin de conversation) : une adresse seulement, sans en-tête. Ils passent par une automatisation Autocalls, le **relais**, qui renvoie l'événement au site avec l'en-tête.
  - Un seul relais suffit pour les 41 agents, au lieu de 56 automatisations (une par agent et par événement).
  - Il n'accepte que les 41 agents de notre compte.
- **Webhook d'inscription** (administration white-label) : il garde un jeton dans l'adresse, car aucune automatisation ne le remplace. Il aura un secret dédié à la fin.

Le site accepte déjà les deux jetons pendant le changement : WEBHOOK_TOKEN, l'actuel, et WEBHOOK_TOKEN_NEXT, le nouveau. Il journalise, pour chaque appel, la route et le mode utilisé (en-tête, adresse ou aucun), jamais la valeur.

## Étapes

Claude ne manipule jamais la valeur d'un jeton : c'est vous qui la créez et la collez.

1. **Vous : créer le nouveau jeton.** Une commande le génère, l'enregistre dans Secret Manager, donne l'accès au site et le copie dans votre presse-papiers. Personne ne le voit s'afficher.
   ```bash
   openssl rand -hex 32 | tr -d '\n' | tee >(pbcopy) | gcloud secrets create WEBHOOK_TOKEN_NEXT --project snarecore-cacrs --data-file=- && firebase apphosting:secrets:grantaccess WEBHOOK_TOKEN_NEXT --backend voiceia --project snarecore-cacrs
   ```
   Prévenez Claude. Il ajoute WEBHOOK_TOKEN_NEXT au site, redéploie et vérifie.
2. **Vous : les 11 outils pendant l'appel.** Dans Autocalls > Mid call tools, ouvrir les outils 6176, 6177, 6178, 6182, 6240, 6241, 6242, 6243, 6246, 6247 et 6248. Pour chacun, dans la même modification :
   - retirer « ?token=… » de l'adresse ;
   - ajouter l'en-tête `x-webhook-token`, avec pour valeur le nouveau jeton (coller) ;
   - garder `Content-Type: application/json`.

   6243 a déjà l'en-tête : il suffit de remplacer sa valeur. Commencer par 6241 seul, puis faire un appel de test.
3. **Vous : le relais.** Autocalls > Automate (https://app.autocalls.ai/automate), ouvrir l'automatisation « Relais fin d'échange → site (PermanenceAI) » préparée par Claude.

   Ce qu'elle contient (créée et vérifiée le 8 octobre) :
   - un déclencheur « Catch Webhook » ;
   - une étape qui n'accepte que les 41 agents du compte ;
   - une branche qui écarte l'événement de test fictif ;
   - l'étape HTTP « Envoyer l'événement au site », réglée sur « Retry on all errors » : un refus du site apparaît comme un échec dans l'historique des exécutions, au lieu d'être perdu.

   Elle est active mais reliée à aucun agent. Tant que le jeton provisoire est en place, le site refuse tout ce qu'elle envoie.
   - Dans l'étape HTTP, remplacer la valeur provisoire de l'en-tête `x-webhook-token` par le nouveau jeton.
   - Publier et activer.
4. **Claude : rebascule des agents.** Il fait pointer, par lots, les webhooks des 41 agents vers le relais, et vérifie à chaque lot que les événements arrivent :
   - un agent pilote d'abord ;
   - puis les widgets ;
   - puis les rappels sortants ;
   - puis les lignes entrantes ;
   - enfin WhatsApp et Messenger.

   Pour revenir en arrière, il suffit de remettre l'ancienne adresse.
5. **Après 7 jours sans aucun « mode=query » dans les journaux** (inscription exceptée) :
   - Vous mettez la valeur du nouveau jeton dans WEBHOOK_TOKEN et retirez l'ancienne.
   - Claude coupe le jeton dans l'adresse sur toutes les routes, sauf l'inscription.
   - L'inscription reçoit son propre secret, à coller dans l'administration white-label.

## Points d'attention

- **Quota d'exécutions d'automatisations** du compte agence : le relais compte une exécution par appel et par message WhatsApp ou Messenger. Il faut le vérifier avant l'étape 4.
- **Valeur stockée en clair dans le flux :** le module HTTP d'Autocalls n'a pas de « connexion » pour stocker un secret. La valeur est masquée dans l'API, mais visible dans l'éditeur Automate.
- **L'adresse du relais devient elle-même secrète** : elle ne doit pas être publiée, ni dans ce dépôt public, ni ailleurs. Son identifiant (le dernier segment de l'adresse) non plus. Une première version du relais a été désactivée le 8 octobre, parce que son identifiant avait été écrit ici par erreur ; elle n'avait jamais été reliée à un agent. Une fuite n'ouvrirait que les événements des 41 agents, plus le jeton des routes du site.
- **Pas d'erreur visible si l'en-tête manque :** sur /api/callback, /api/agent/optout et /api/agent/account, une requête sans jeton est traitée comme venant du site, avec moins de droits. D'où les étapes pilotes et la vérification des journaux à chaque lot.

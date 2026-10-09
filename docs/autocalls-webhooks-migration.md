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
2. **Vous : un clic sur Run pour `bash scripts/jeton-webhooks.sh`** (fait le 8 octobre au soir à la place des collages à la main). Le script :
   - lit le jeton et la clé Autocalls dans Secret Manager, sans les afficher ;
   - vérifie que le site accepte le jeton (route /api/webhooks/ping), sinon il ne modifie rien ;
   - pour les 11 outils (6176, 6177, 6178, 6182, 6240, 6241, 6242, 6243, 6246, 6247, 6248) : retire « ?token=… » de l'adresse et met le jeton dans l'en-tête `x-webhook-token`, avec `Content-Type: application/json` ;
   - pose le jeton dans l'étape HTTP du relais « Relais fin d'échange → site (PermanenceAI) », retrouvé par son nom (scripts/relais-webhooks.json contient sa définition) ;
   - n'affiche que les codes de réponse.

   Le relais n'accepte que les 41 agents du compte. Une branche écarte l'événement de test fictif « test-relais ». L'étape HTTP est réglée sur « Retry on all errors » : un refus du site apparaît comme un échec dans l'historique des exécutions. Le relais est actif mais relié à aucun agent tant que l'étape 4 n'est pas faite.
3. **Claude : vérification** dans les journaux du site (mode=header ok=true) au premier appel qui utilise un outil.
4. **Claude : rebascule des agents.** Il fait pointer, par lots, les webhooks des 41 agents vers le relais, et vérifie à chaque lot que les événements arrivent :
   - un agent pilote d'abord ;
   - puis les widgets ;
   - puis les rappels sortants ;
   - puis les lignes entrantes ;
   - enfin WhatsApp et Messenger.

   Pour revenir en arrière, il suffit de remettre l'ancienne adresse.
5. **Retrait de l'ancien jeton** : voir la section du même nom, plus bas. Rien à modifier dans l'administration white-label.

## Points d'attention

- **Quota d'exécutions d'automatisations** du compte agence : le relais compte une exécution par appel et par message WhatsApp ou Messenger. Il faut le vérifier avant l'étape 4.
- **Valeur stockée en clair dans le flux :** le module HTTP d'Autocalls n'a pas de « connexion » pour stocker un secret. La valeur est masquée dans l'API, mais visible dans l'éditeur Automate.
- **L'adresse du relais devient elle-même secrète** : elle ne doit pas être publiée, ni dans ce dépôt public, ni ailleurs. Son identifiant (le dernier segment de l'adresse) non plus. Une première version du relais a été désactivée le 8 octobre, parce que son identifiant avait été écrit ici par erreur ; elle n'avait jamais été reliée à un agent. Une fuite n'ouvrirait que les événements des 41 agents, plus le jeton des routes du site.
- **Pas d'erreur visible si l'en-tête manque :** sur /api/callback, /api/agent/optout et /api/agent/account, une requête sans jeton est traitée comme venant du site, avec moins de droits. D'où les étapes pilotes et la vérification des journaux à chaque lot.

## État au 8 octobre 2026, nuit

- Jeton : le nouveau (WEBHOOK_TOKEN_NEXT) est en place. Il est vérifié par /api/webhooks/ping.
- Les 11 outils pendant l'appel envoient le jeton dans l'en-tête.
- Le relais porte le vrai jeton. Un événement de test neutre est passé par le relais jusqu'au site : exécution « SUCCEEDED », journal du site « mode=header ok=true », sans email ni SMS.
- Webhooks des agents : **56 sur 56 passent par le relais** (bascule des 25 derniers faite le 8 octobre au soir, avec l'autorisation du propriétaire).
  - Contrôle des 41 agents le 8 octobre : 56 adresses sur le relais, aucune sur le site, aucun agent bloqué.
  - Appel réel du 8 octobre (ligne israélienne, 21314) : exécution du relais réussie, journal du site « /api/webhooks/autocalls mode=header ok=true ».
- L'étape 5 (retrait de l'ancien jeton) : plus aucun webhook d'agent n'appelle le site avec « ?token= » ; reste le webhook d'inscription (voir la section suivante).

## Retrait de l'ancien jeton

But : que l'ancien jeton (valeur actuelle de WEBHOOK_TOKEN) ne serve plus que pour le webhook « User Signup » de l'administration white-label, seul appelant qui garde « ?token= » dans l'adresse. Son adresse ne change pas : rien à recoller dans l'administration.

Le site est prêt (sans effet tant que les réglages ci-dessous ne sont pas posés) :
- `WEBHOOK_ALLOW_QUERY_TOKEN=0` refuse le jeton dans l'adresse sur toutes les routes. Le journal indique alors « mode=query ok=false query=off ».
- Seule exception, /api/webhooks/signup : elle accepte encore « ?token= », mais uniquement avec le secret dédié `SIGNUP_WEBHOOK_TOKEN`.
- L'en-tête `x-webhook-token` (relais, outils) reste accepté partout, avec WEBHOOK_TOKEN ou WEBHOOK_TOKEN_NEXT.
- Variable absente : comportement actuel. Tests : `npx tsx scripts/test-webhook-auth.ts`.

Les valeurs ne s'affichent jamais : chaque commande lit un secret et l'écrit dans un autre par un tube. Un clic sur Run par commande, **dans cet ordre**.

1. **Vous : copier l'ancien jeton dans un secret dédié à l'inscription**, et donner l'accès au site. À faire avant l'étape 2, tant que WEBHOOK_TOKEN contient encore l'ancienne valeur.
   ```bash
   gcloud secrets versions access latest --secret WEBHOOK_TOKEN --project snarecore-cacrs | tr -d '\n' | gcloud secrets create SIGNUP_WEBHOOK_TOKEN --project snarecore-cacrs --data-file=- && firebase apphosting:secrets:grantaccess SIGNUP_WEBHOOK_TOKEN --backend voiceia --project snarecore-cacrs
   ```
   Prévenez Claude. Il vérifie d'abord que les journaux des dernières 24 heures ne montrent aucun « mode=query » ailleurs que sur /api/webhooks/signup. Filtre (journaux du site, projet snarecore-cacrs) : `(textPayload:"[auth]" AND textPayload:"mode=query") OR (jsonPayload.component="auth" AND jsonPayload.message:"mode=query")`. Depuis le journal structuré du 9 octobre (docs/journaux-et-alertes.md), ces lignes sont des entrées JSON et leur texte est dans `jsonPayload.message` ; la partie `textPayload` ne couvre que les heures d'avant ce déploiement. Un filtre sur `textPayload` seul ne trouverait plus rien et ferait croire, à tort, à 24 heures sans « mode=query ». Si une autre route apparaît, un appelant utilise encore l'ancien jeton dans l'adresse : Claude le bascule d'abord sur le relais ou l'en-tête.

   Il ajoute ensuite `SIGNUP_WEBHOOK_TOKEN` et `WEBHOOK_ALLOW_QUERY_TOKEN: "0"` à apphosting.yaml, redéploie, puis vérifie :
   - les inscriptions arrivent (« /api/webhooks/signup mode=query ok=true ») ;
   - aucun refus « query=off ».

   Pour revenir en arrière, il suffit de retirer `WEBHOOK_ALLOW_QUERY_TOKEN` et de redéployer.
2. **Vous : remplacer l'ancien jeton par le nouveau**, seulement quand Claude a confirmé 24 heures de journaux sans aucun « mode=query » hors /api/webhooks/signup. La valeur de WEBHOOK_TOKEN_NEXT devient une nouvelle version de WEBHOOK_TOKEN.
   ```bash
   gcloud secrets versions access latest --secret WEBHOOK_TOKEN_NEXT --project snarecore-cacrs | tr -d '\n' | gcloud secrets versions add WEBHOOK_TOKEN --project snarecore-cacrs --data-file=-
   ```
   Prévenez Claude. Il redéploie (le site ne lit un secret qu'au déploiement) et vérifie :
   - le relais et les outils (« mode=header ok=true ») ;
   - l'inscription (« /api/webhooks/signup mode=query ok=true »).

   Ensuite, l'ancienne valeur n'ouvre plus que /api/webhooks/signup. La version précédente de WEBHOOK_TOKEN peut être désactivée dans Secret Manager (opération réversible).

L'ancienne valeur reste donc le secret de l'inscription. Pour s'en défaire complètement plus tard : créer une nouvelle valeur de SIGNUP_WEBHOOK_TOKEN et la coller dans l'adresse du webhook « User Signup » de l'administration white-label.

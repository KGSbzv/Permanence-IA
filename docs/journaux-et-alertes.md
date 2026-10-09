# Journaux du site et alerte d'erreurs Google Cloud (9 octobre 2026)

**Pour qui :** le propriétaire (commandes à lancer une fois), et toute personne qui lit les journaux du site.

**Pourquoi :** audit des parcours du 9 octobre, action 16. L'alerte « Site PermanenceAI : erreurs serveur » (projet snarecore-cacrs) ne voyait que les réponses 5xx. Les erreurs écrites par le code (échec d'envoi d'un e-mail par Zoho, base Supabase illisible ou qui refuse une écriture, erreur Stripe ou Autocalls) arrivaient dans les journaux **sans gravité**. Une panne de l'envoi d'e-mails pouvait donc passer inaperçue, alors que toutes les alertes de l'équipe partent justement par Zoho.

**Dépôt public :** ce fichier ne contient ni secret, ni adresse personnelle.

## Ce qui a changé dans le site

- Sur le serveur en ligne (Cloud Run, backend voiceia), chaque ligne de journal est maintenant une entrée JSON avec sa gravité :

  | Dans le code | Gravité dans Google Cloud |
  |---|---|
  | `console.error` | ERROR |
  | `console.warn` | WARNING |
  | `console.log`, `console.info` | INFO |

- Chaque entrée a la forme `{"severity":"ERROR","message":"[mail] …","component":"mail","source":"site"}`.
  - `component` reprend le mot entre crochets du début du message : `mail`, `alerte`, `callback`, `signup`, `stripe`, `autocalls-webhook`, `relances`, `contacts`, `mon-compte`…
  - `source` vaut toujours `site` : c'est ce qui distingue les journaux du code des journaux de requêtes.
- **Données personnelles réduites (pas supprimées) :** dans chaque entrée, les adresses e-mail deviennent `[adresse]`. Deviennent `[numéro …78]` (seuls les 2 derniers chiffres restent) :
  - les numéros de 8 à 15 chiffres écrits d'un bloc ou avec des espaces ou des points (+33 6 12 34 56 78, 0612345678), ainsi que les adresses IPv4 longues (203.0.113.42) ;
  - les numéros avec tirets ou parenthèses qui commencent par « + », « ( » ou « 0 » (050-123-4567, 06-12-34-56-78, (020) 7946 0958, +972-50-123-4567). Les dates (2026-10-09, 09-10-2026) restent lisibles.

  Ne sont pas masqués : les numéros avec tirets qui commencent par un autre chiffre (972-50-123-4567), les adresses IPv4 de moins de 8 chiffres (8.8.8.8, 10.0.0.1), les adresses IPv6 et les noms. Le code n'écrit pas ces données exprès, mais un message d'erreur d'un fournisseur peut en contenir. Le message est limité à 4 000 caractères.
- Un passage des relances qui se termine en `not_installed` (tables Supabase illisibles), `error` (Stripe illisible) ou `halted` (disjoncteur des e-mails rejetés) écrit aussi une entrée ERROR.
- En local, pendant le build et dans les tests, rien ne change : journal en texte. La variable facultative `LOG_FORMAT` force le JSON (`json`) ou le texte (`text`). Elle n'est pas dans apphosting.yaml et n'a pas à y être.
- Code : src/lib/log.ts (installé au démarrage par src/instrumentation.ts). Tests : `npx tsx scripts/test-journal.ts`.
- **Filtres des autres guides :** un filtre `textPayload:"…"` écrit avant ce changement ne trouve plus les nouvelles lignes du code. Il devient `jsonPayload.message:"…"` (par exemple `jsonPayload.component="auth" AND jsonPayload.message:"mode=query"` au lieu de `textPayload:"[auth]" AND textPayload:"mode=query"`, dans docs/autocalls-webhooks-migration.md). Pour couvrir aussi les heures d'avant le déploiement, garder les deux, reliés par `OR`.

## Conséquence immédiate, sans rien faire

L'alerte existante filtre `severity>=ERROR` sur le service voiceia. Dès le déploiement, elle voit donc aussi les erreurs du code, et plus seulement les réponses 5xx. Aucune commande n'est nécessaire pour que les erreurs d'envoi d'e-mails, de base, de Stripe ou d'Autocalls déclenchent un e-mail d'alerte.

## Recommandé : une métrique par partie du site et une alerte dédiée

La métrique compte les erreurs du code par partie du site (`component`). Elle donne un graphique, et l'alerte dit tout de suite quelle partie est en panne. Les commandes ci-dessous sont à lancer dans un terminal où `gcloud` est connecté avec votre compte (propriétaire du projet snarecore-cacrs). Elles ne lisent ni ne modifient aucun secret, et ne touchent pas au site.

### 1. Créer la métrique

Créer d'abord le fichier `metrique-erreurs-site.yaml`, où vous voulez, hors du dépôt :

```yaml
description: Erreurs du code du site PermanenceAI (journal structuré, gravité ERROR), par partie du site
filter: >-
  resource.type="cloud_run_revision"
  AND resource.labels.service_name="voiceia"
  AND severity>=ERROR
  AND jsonPayload.source="site"
metricDescriptor:
  metricKind: DELTA
  valueType: INT64
  unit: "1"
  labels:
    - key: component
      valueType: STRING
      description: Partie du site (mail, stripe, callback, relances…)
labelExtractors:
  component: EXTRACT(jsonPayload.component)
```

Puis lancer :

```sh
gcloud logging metrics create site-erreurs-applicatives \
  --project=snarecore-cacrs \
  --config-from-file=metrique-erreurs-site.yaml
```

### 2. Créer l'alerte

Créer le fichier `alerte-erreurs-site.json`, lui aussi hors du dépôt :

```json
{
  "displayName": "Site PermanenceAI : erreurs applicatives (e-mails, base, Stripe, Autocalls)",
  "combiner": "OR",
  "conditions": [
    {
      "displayName": "Au moins une erreur du code en 5 minutes",
      "conditionThreshold": {
        "filter": "resource.type = \"cloud_run_revision\" AND metric.type = \"logging.googleapis.com/user/site-erreurs-applicatives\"",
        "aggregations": [
          {
            "alignmentPeriod": "300s",
            "perSeriesAligner": "ALIGN_SUM",
            "crossSeriesReducer": "REDUCE_SUM",
            "groupByFields": ["metric.label.component"]
          }
        ],
        "comparison": "COMPARISON_GT",
        "thresholdValue": 0,
        "duration": "0s",
        "trigger": { "count": 1 },
        "evaluationMissingData": "EVALUATION_MISSING_DATA_INACTIVE"
      }
    }
  ],
  "alertStrategy": { "autoClose": "1800s" },
  "documentation": {
    "mimeType": "text/markdown",
    "content": "Erreur du code du site (voir la partie dans le libellé component). Journaux : Logs Explorer, filtre resource.labels.service_name=\"voiceia\" AND jsonPayload.source=\"site\" AND severity>=ERROR. mail ou alerte = envoi Zoho en échec (vérifier ZOHO_SMTP_PASS) ; contacts, callback, signup = base Supabase ; stripe = webhook Stripe ; relances = passage des relances. Guide : docs/journaux-et-alertes.md du dépôt."
  }
}
```

Deux réglages comptent. La métrique n'écrit aucun point quand il n'y a pas d'erreur :
- `"evaluationMissingData": "EVALUATION_MISSING_DATA_INACTIVE"` ferme l'incident dès que les erreurs cessent. Sans lui, l'incident d'une partie du site (par exemple `mail`) resterait ouvert, et une nouvelle panne de la même partie quelques heures plus tard n'enverrait aucun e-mail.
- `"autoClose": "1800s"` (30 minutes, le minimum) ferme de toute façon un incident oublié.

L'alerte prévient la même adresse que l'alerte existante. Pour lire son canal de notification puis créer la nouvelle alerte :

```sh
CANAL=$(gcloud monitoring policies describe \
  projects/snarecore-cacrs/alertPolicies/12000918558175668348 \
  --format="value(notificationChannels)" | tr ';' ',')
echo "$CANAL"   # doit afficher projects/snarecore-cacrs/notificationChannels/…

gcloud monitoring policies create \
  --project=snarecore-cacrs \
  --policy-from-file=alerte-erreurs-site.json \
  --notification-channels="$CANAL"
```

Si `echo` n'affiche rien, listez les canaux avec `gcloud beta monitoring channels list --project=snarecore-cacrs --format="table(name,displayName)"`, puis remplacez `$CANAL` par le nom du canal « Permanence IA — contact ».

### 3. Éviter les doubles e-mails (facultatif)

Une même erreur déclenchera les deux alertes. Pour que l'ancienne ne garde que les réponses 5xx, **seulement après avoir créé l'alerte du § 2** (sinon plus rien ne prévient d'une erreur du code) :
1. Console Google Cloud > Monitoring > Alerting > « Site PermanenceAI : erreurs serveur » > Edit.
2. Ajouter à la fin du filtre : `AND NOT jsonPayload.source="site"`.
3. Enregistrer.

Vous pouvez aussi garder les deux alertes : c'est plus de bruit, mais il n'y a aucun risque de manquer une panne.

### 4. Vérifier, sans rien envoyer à personne

Après le déploiement, chaque appel d'un webhook écrit une entrée INFO `[auth] …`. Pour voir les dernières entrées du code :

```sh
gcloud logging read \
  'resource.type="cloud_run_revision" AND resource.labels.service_name="voiceia" AND jsonPayload.source="site"' \
  --project=snarecore-cacrs --freshness=1d --limit=5 \
  --format="table(timestamp,severity,jsonPayload.component,jsonPayload.message)"
```

Pour tester la métrique et l'alerte, écrivez une fausse erreur dans les journaux. Elle ne passe pas par le site et n'envoie rien à un client. Seuls les e-mails d'alerte partent (un par alerte qui la voit), au bout de quelques minutes :

```sh
gcloud logging write site-test-alerte \
  '{"severity":"ERROR","message":"[test] essai de l alerte","component":"test","source":"site"}' \
  --project=snarecore-cacrs --payload-type=json --severity=ERROR \
  --monitored-resource-type=cloud_run_revision \
  --monitored-resource-labels=service_name=voiceia,location=us-east4,project_id=snarecore-cacrs,revision_name=test,configuration_name=voiceia
```

## Lire les journaux au quotidien

Dans Logs Explorer (projet snarecore-cacrs), filtres utiles :
- toutes les erreurs du code : `resource.labels.service_name="voiceia" AND jsonPayload.source="site" AND severity>=ERROR` ;
- les avertissements, à relire une fois par semaine (par exemple une langue de facture Stripe non posée, ou une table Supabase manquante) : la même chose avec `severity=WARNING` ;
- une partie du site : ajouter `AND jsonPayload.component="mail"` (ou `stripe`, `callback`, `relances`…).

Les erreurs avec une trace de pile apparaissent aussi dans Error Reporting (console Google Cloud > Error Reporting). Il peut prévenir à chaque nouveau type d'erreur : bouton « Configure notifications ».

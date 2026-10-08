# Autocalls : pièges de l'éditeur d'assistant (constatés le 8 octobre 2026)

## Enregistrer depuis l'interface remet la température à 1,00

Chaque clic sur « Save assistant » dans app.autocalls.ai (page *workspace* d'un assistant) enregistre `llm_temperature = 1.00`, quelle que soit la valeur affichée. Les autres réglages (stabilité, vitesse, durée, sensibilité, voix, base de connaissances) ne bougent pas.

Valeurs retenues pour nos agents :

| Agents | Température |
|---|---|
| Agents vocaux (site, rappels, lignes UK et Israël, espace client) | 0,35 |
| Agents écrits Messenger 21297 et WhatsApp 21358 | 0,40 |

Après toute modification faite à la main dans l'interface, remettre la température (champ LLM, ou demander à Claude de le faire par l'API).

## Message d'accueil modifié par script

Un changement du message d'accueil (`initial_message`) envoyé par script dans la page de l'éditeur n'est pas toujours enregistré, alors que le prompt l'est. Modifier l'accueil à la main dans le champ, ou par l'API, puis relire.

## Scan de conformité

Chaque enregistrement du prompt relance le scan de conformité. Le 8 octobre, après les mises à jour, `compliance_blocked_at` était vide sur les 39 agents relus.

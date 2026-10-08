# Autocalls : agents et automatisations, ce qui reste au propriétaire (8 oct. 2026)

Points des audits 27 à 35 (chaîne D). Ce qui a été fait est listé en premier, puis ce que seul le propriétaire peut faire.

## Fait le 8 octobre

- **Agent 21179** (ancienne « Réceptionniste Permanence IA », sans numéro, absent du site) renommé « ARCHIVE – ne pas utiliser — Réceptionniste Permanence IA (ancienne, sans numéro) ». Rien n'a été supprimé.
- **Outil date_heure_actuelle (6233)** : vérifié sur les 13 agents du site (21206 à 21210, 21269, 21271, 21273, 21275, 21277, 21279, 21306, 21307). Il est bien rattaché à tous.
- **Numéros israéliens au format local** : avant, un numéro saisi « 050-123-4567 » sur un agent israélien devenait +33 50 123 4567 (France). Trois copies des outils ont donc été créées avec le champ fixe `cc = 972`. Un numéro local y est lu en +972, et un numéro avec « + » reste inchangé.
  - 6240 `register_callback_request` (copie de 6178) : rattaché à 21306, 21307, 21308, 21309 et 21314.
  - 6241 `create_support_ticket` (copie de 6182) : rattaché à 21310.
  - 6242 `creer_ticket_support` (copie de 6177) : rattaché à 21314.
  - Les outils 6177, 6178 et 6182 d'origine restent en place pour les autres agents. Rien n'a été supprimé.
- **Messages de répondeur hébreux (21308, 21309, 21310)** : raccourcis à un seul énoncé du numéro 02-376-7085, soit environ 15 s au lieu de 30.
- **21306 (Noa, site hébreu)** : son prompt annonçait encore « 200 crédits inclus » sur le forfait Réceptionniste et des « recharges de 39 à 725 $ ». Il est aligné sur le site : aucun crédit inclus, recharge d'un montant libre. La règle « réessayer une fois » précise maintenant que c'est la seule exception à « une seule fois ». Après le contrôle, compliance_blocked_at = null.

## À faire par le propriétaire

### 1. Annuler les 20 exécutions en pause du 6 octobre

Ce sont des exécutions de l'ancienne version, sans contrôle de doublon. Elles attendent dans l'étape de délai. Le MCP ne permet pas de les annuler, et Chrome n'était pas disponible pour le faire.

Pour chacune : Autocalls > Automations > ouvrir l'automatisation > Runs > exécution « Paused » > Stop/Cancel.

| Automatisation | Exécutions en pause |
|---|---|
| Sales callback request → campaign (UK) | ffIKXuY5C54CbuFpqTWdv, xS811D5jZ92zOixI65ZST |
| Support callback request → campaign (UK) | wvLRWTTe5GB4kDiJmKtUR |
| Sales callback request → campaign (Australia) | cU0mZl2VcMm67BsDug7Jh, hOfSCP2hlHsPSTXLNs135 |
| Support callback request → campaign (Australia) | jl9sAPLctcxqZ2bZ95Di3 |
| Richiamata commerciale → campagna (Italia) | ktJSu338gYwxYLXhLrN3y, FhbBffyk0MDTfqIePMLYp |
| Richiamata assistenza → campagna (Italia) | zu5Qox2JHfXjsTmywNeCy |
| Oddzwonienie sprzedażowe → kampania (Polska) | bUbrBsYzsa2y8IRqn0aS1, RjDYeTI4EGnkcEpmmyroH |
| Oddzwonienie wsparcie → kampania (Polska) | gcw5EZi85tZbLWnQLjPmi |
| Terugbelverzoek verkoop → campagne (Nederland) | VL8w58PBFuwjFvTPZHUZm, F4cp5U8lmateE4eIraxIT |
| Terugbelverzoek support → campagne (Nederland) | DgW8S7f6cAz4st0leR33F |
| בקשת שיחה חוזרת מכירות → קמפיין (ישראל) | IvWu2CB2i0vDbbImseXfP |
| בקשת שיחה חוזרת תמיכה → קמפיין (ישראל) | IqHaPvpBexyOq9ZOpFttK |
| Rappel commercial demandé → campagne (avec contexte) | gw6PewSXxngxrDM1DruEV, ToYr0SdO7rDKyML21dcZk |
| Rappel support demandé → campagne (avec contexte) | Dud2nISl0T0wy6EkyAWUp |

### 2. Modèles de prompts (admin > Prompt templates)

À vérifier dans l'admin : Chrome n'était pas connecté, donc rien n'a été changé.
- Les 10 modèles santé (cabinet dentaire, kiné/paramédical × 5 langues) : **décision à prendre**. Les désactiver (et non les supprimer) tant que les secteurs santé sont en pause est recommandé, pour pouvoir les réactiver ensuite.
- Ajouter des modèles hébreux si l'admin propose la langue « he ».
- Facultatif : ajouter deux métiers actifs (plombier/artisan, agence de voyage).

### 3. Numéro US +1 770 746 6445 (11775)

Il n'est rattaché à aucun agent. Le libérer (release-phone-number, puis chez Twilio) arrête son coût mensuel, mais c'est **irréversible**. Je n'y ai pas touché. Même question pour 11795 (+972 53-389-0402, SIP), libre lui aussi.

### 4. Latence des agents vocaux (choix entre qualité et vitesse)

Mesure du 8 octobre : de 1,5 à 2,1 s de bout en bout, dont 1 à 1,5 s pour le modèle de langage (gpt-5.3-chat), sur des prompts de 10 000 à 13 000 caractères. Deux pistes :
- Alléger les prompts en déplaçant l'offre, les objections, la santé et WhatsApp vers la base de connaissances. Risque : chaque recherche dans la base ajoute un aller-retour d'outil, et les règles de conformité doivent rester dans le prompt.
- Essayer un modèle plus rapide ou le mode dualplex sur une copie d'un agent web (par ex. 21269), puis comparer `e2e_latency` et `llm_node_ttft` sur 3 à 5 essais réels. La voix et le coût changent.

Ces deux pistes demandent des essais réels et un arbitrage du propriétaire. Rien n'a été modifié.

### 5. Tests réels (propre téléphone, à faire après les correctifs du site)

- Deux rappels programmés (A dans 15 min, puis B dans 30 min) : seul B doit appeler.
- Un rappel non décroché : vérifier le message de répondeur (get-call et messagerie), puis le SMS de repli (Autocalls > SMS). Si la case WhatsApp est cochée, le test doit attendre la validation Meta des modèles `pia_callback_missed`.
- Ligne Israël : demander un rappel en donnant un numéro local (05X…) et vérifier qu'il part bien en +972.
- Décider si le numéro UK 07367 090106 doit figurer dans les messages de répondeur UK et AU. Aujourd'hui, ces messages renvoient seulement vers le site.

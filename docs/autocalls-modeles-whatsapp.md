# Modèles WhatsApp de Permanence IA (expéditeur Autocalls 521, +33 7 45 46 04 46)

Relevé du 8 octobre 2026 (list-whatsapp-templates, statut approved) : les **48 modèles sont approuvés**. Il n'en reste aucun en attente ni refusé.

Ces modèles sont ceux de Permanence IA, envoyés par le site (`src/lib/whatsapp.ts`). La bibliothèque proposée aux clients pour leurs propres agents est dans `docs/whatsapp-templates.md`.

## Identifiants par langue

| Modèle | Catégorie (Autocalls) | Variables | fr | en_GB | it | pl | nl | he |
|---|---|---|---|---|---|---|---|---|
| pia_callback_confirmed | UTILITY | 1 prénom, 2 conseillère, 3 date, 4 heure | 1105 | 1113 | 1121 | 1129 | 1137 | 1145 |
| pia_callback_missed | UTILITY | 1 prénom | 1106 | 1114 | 1122 | 1130 | 1138 | 1146 |
| pia_demo_followup | **MARKETING** | 1 prénom, 2 nom de l'agent | 1107 | 1115 | 1123 | 1131 | 1139 | 1147 |
| pia_trial_started | UTILITY | 1 prénom | 1108 | 1116 | 1124 | 1132 | 1140 | 1148 |
| pia_trial_ending | UTILITY | 1 prénom, 2 date de fin, 3 minutes restantes | 1109 | 1117 | 1125 | 1133 | 1141 | 1149 |
| pia_ticket_received | UTILITY | 1 prénom, 2 n° de ticket, 3 résumé, 4 créneau | 1110 | 1118 | 1126 | 1134 | 1142 | 1150 |
| pia_minutes_low | UTILITY | 1 prénom, 2 minutes restantes | 1111 | 1119 | 1127 | 1135 | 1143 | 1151 |
| pia_welcome_whatsapp | UTILITY | 1 prénom | 1112 | 1120 | 1128 | 1136 | 1144 | 1152 |

Le 7 octobre, Meta avait reclassé 18 modèles en « marketing » (`pia_minutes_low`, `pia_trial_ending` et `pia_trial_started`, × 6 langues). Autocalls les affiche aujourd'hui en UTILITY. À vérifier dans le Gestionnaire WhatsApp (colonne Catégorie) avant de s'appuyer sur le tarif « utility ».

## Utilisation actuelle

- Utilisés par le site : `pia_callback_confirmed`, `pia_welcome_whatsapp` (src/pages/api/callback/index.ts) et `pia_callback_missed` (src/pages/api/webhooks/autocalls.ts, avec repli SMS si l'envoi échoue).
- Approuvés mais non déclenchés : `pia_trial_started`, `pia_trial_ending`, `pia_minutes_low` (il faut d'abord collecter le numéro et l'accord WhatsApp du client), `pia_ticket_received`, et `pia_demo_followup` (marketing : accord explicite requis).
- L'agent WhatsApp 21358 sait répondre aux boutons de ces modèles (section « Réponses à nos messages automatiques » de son prompt).

## Textes français (référence)

- **pia_callback_confirmed** : « Bonjour {{1}}, nous avons bien reçu votre demande de rappel. {{2}}, de l'équipe Permanence IA, vous appellera le {{3}} à {{4}}. Si cet horaire ne vous convient plus, répondez simplement à ce message en indiquant un autre créneau. »
- **pia_callback_missed** : « Bonjour {{1}}, nous avons essayé de vous appeler au sujet de votre demande auprès de Permanence IA, sans réussir à vous joindre. Répondez à ce message en indiquant le moment qui vous arrange, ou appuyez sur « Rappelez-moi » pour recevoir un nouvel appel. »
- **pia_demo_followup** : remerciement après la démo, puis invitation à l'essai gratuit de 14 jours (30 minutes, carte demandée sans débit) avec le lien https://www.permanenceia.com/essai-gratuit.
- **pia_trial_started** : compte créé, essai de 14 jours commencé ; trois étapes (créer l'agent, connecter l'agenda, tester par téléphone) ; lien https://app.permanenceia.com.
- **pia_trial_ending** : date de fin d'essai, minutes restantes, choisir une offre (rien à faire si c'est déjà fait), annulation possible dans Informations de facturation ; lien vers l'espace client.
- **pia_ticket_received** : « Bonjour {{1}}, votre demande d'assistance n° {{2}} a bien été enregistrée. Résumé : {{3}}. Un conseiller vous rappellera {{4}}. Pour ajouter des précisions, répondez simplement à ce message. »
- **pia_minutes_low** : minutes restantes, ajouter du crédit ou passer à une offre supérieure ; lien vers l'espace client.
- **pia_welcome_whatsapp** : notifications WhatsApp activées (confirmations de rappel et alertes du compte) ; « Répondez STOP pour ne plus les recevoir. »

Les textes complets des 6 langues sont visibles dans Autocalls (WhatsApp > Templates, expéditeur 521) ou avec list-whatsapp-templates(521).

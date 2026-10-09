# Copie de l'échange envoyée par e-mail (9 oct. 2026)

Après un échange avec un assistant IA, la personne (prospect ou client) qui l'a demandé ou accepté reçoit par e-mail la copie de la conversation, pour garder une trace et pouvoir la copier.

## Ce que fait le site

- Le webhook de fin d'échange (`/api/webhooks/autocalls`, code dans `src/lib/conversationCopy.ts`) lit la variable post-appel **`copy_email`**. Quand elle contient une adresse valide, il envoie **un seul** e-mail à cette adresse.
- Contenu : une phrase d'introduction (« Voici la copie de votre échange avec Jade, l'assistante IA de Permanence IA, le vendredi 9 octobre 2026 à 08:22. Vous pouvez la conserver ou la copier comme vous le souhaitez. »), puis tous les messages dans l'ordre, étiquetés avec le prénom de l'agent et « Vous » dans la langue de la personne (« You », « Tu » en italien, « Ty » en polonais, « U », « אתם »). Jamais les appels d'outils, leurs résultats ni le texte interne. Après la transcription : « Vous recevez cet email parce que cette adresse a été donnée pendant l'échange. Si vous n'êtes pas à l'origine de cette demande, ignorez-le. » (6 langues). Version texte et version HTML, de droite à gauche en hébreu.
- Liens : dans les messages de l'agent, toute adresse web, tout domaine ou toute adresse e-mail qui n'est pas sur permanenceia.com (ou un sous-domaine) est remplacé par « [lien retiré] » (« [link removed] », « [link rimosso] », « [link usunięty] », « [link verwijderd] », « [הקישור הוסר] ») ; dans ceux de la personne, ils sont désactivés pour qu'aucune messagerie n'en fasse un lien (`exemple[.]com`, `hxxps://`). Les caractères de contrôle bidirectionnel (U+202A–U+202E, U+2066–U+2069) sont retirés partout. La copie ne crée aucun lien (seul le pied de page légal en contient).
- Date et heure dans le fuseau du marché (Paris, Londres, Sydney, Rome, Varsovie, Amsterdam, Jérusalem).
- Expéditeur et marque du marché (Permanence IA, PermanenceIA en Italie, PermanenceAI ailleurs) ; pied de page légal commun (copyright, adresse, préférences, désinscription, CGU et confidentialité). E-mail « essentiel » : demandé par la personne, il part même si elle s'est désinscrite des e-mails commerciaux.
- Un échange de plus de 400 messages est coupé avec une note ; un message de plus de 8 000 caractères est raccourci.

## Quand rien n'est envoyé

- `copy_email` absente, vide ou qui n'est pas une adresse (« non », `{{copy_email}}`…).
- Issue de l'échange `ne_plus_appeler`, `desinscription` ou `mauvais_contact` (refus d'être contacté) : jamais de copie.
- Opposition enregistrée pour ce numéro depuis le début de l'échange (heure de début donnée par le webhook ; à défaut, 24 dernières heures) : par exemple une désinscription WhatsApp au passage précédent, ou l'outil d'opposition pendant l'appel. Une opposition plus ancienne ne bloque pas la copie, car `copy_email` n'est remplie que sur demande explicite de la personne.
- Copie déjà envoyée pour cet échange. WhatsApp et Messenger renvoient la conversation après chaque nouveau message : la copie part au premier passage où `copy_email` est remplie. **Limite connue** : les messages écrits après ce passage ne figurent pas dans la copie.
- Plafond par adresse : plus de 5 copies en 24 heures vers la même adresse (protection contre l'envoi de messages à un tiers par le widget). L'équipe est prévenue.
- Plafond pour tout le site : plus de 100 copies en 24 heures, toutes adresses confondues (abus du widget, boucle d'un agent). L'équipe reçoit une alerte à part, « plafond quotidien des copies d'échange atteint ».
- Les deux plafonds sont vérifiés avant la réservation de l'envoi, puis après : seules les réservations les plus anciennes des dernières 24 heures envoient, si bien que des webhooks simultanés ne peuvent pas les dépasser. Une réservation refusée garde le statut `plafond`.
- Base de données indisponible : rien ne part (sans trace en base, impossible de garantir un seul envoi). L'équipe est prévenue.
- Transcription vide ou échange sans identifiant : l'équipe est prévenue.

Un échec d'envoi (Zoho) ne change jamais la réponse 200 du webhook. L'équipe reçoit l'alerte « copie d'échange non envoyée » (au plus une par heure), et l'adresse demandée reste dans les variables de l'échange. Sur WhatsApp et Messenger, l'envoi est retenté au message suivant.

## Quels agents

Ceux qui reçoivent la variable `copy_email` dans Autocalls (à ajouter aux variables post-appel des agents conversationnels) :

État au 9 oct. 2026 : variable et consigne actives sur 16 agents — widgets du site (21203, 21269, 21206, 21271, 21207, 21273, 21208, 21275, 21209, 21277, 21210, 21279, 21306, 21307), espace client (21205) et Messenger (21297). **Pas sur WhatsApp (21358)** : le contrôle de conformité d'Autocalls a bloqué l'agent dès l'ajout de la consigne (« aggressive commercial onboarding… data gathering »), version précédente rétablie en moins d'une minute ; la personne garde de toute façon la conversation dans WhatsApp. Ne pas la remettre sans tester le contrôle.

| Agents | Langue de l'e-mail | Prénom affiché |
|---|---|---|
| Widgets du site, écrits ou vocaux, d'une seule langue (Jade, Hugo, Katie, James, Charlotte, Jack, Manuela, Marco, Lena, Tomasz, Emma, Daan, Noa, Daniel) | celle de l'agent | celui de l'agent (נועה et דניאל en hébreu) |
| Multilingues : espace client (21205), WhatsApp (21358), Messenger (21297) | variable `langue` ou `language` si l'agent la remplit ; sinon langue des messages de la personne ; sinon indicatif du numéro ; sinon anglais (Royaume-Uni) | persona écrite de la langue (Lucie, Katie, Charlotte, Manuela, Lena, Emma, נועה) |
| Lignes entrantes et rappels, si la variable leur est ajoutée | celle de l'agent | celui de l'agent |
| Agent inconnu du site (pas dans `src/lib/callbackPersona.ts`) | comme les multilingues | « l'assistant IA de … », sans prénom |

Consigne proposée pour la variable `copy_email` (texte de la variable dans Autocalls) : « Adresse e-mail que la personne a donnée ET confirmée pendant l'échange pour recevoir une copie de la conversation. Laisser vide si elle n'a pas demandé de copie, l'a refusée, ou si l'adresse n'a pas été confirmée. »

## Suivi

Chaque copie laisse une ligne dans `call_events` : `kind = email`, `outcome = copie_conversation`, `external_id = copy-conversation-<id>` ou `copy-call-<id>`, `status` = `en_cours`, `envoyee`, `echec`, `doublon` ou `plafond`. L'adresse n'y figure pas en clair : seulement son empreinte (`variables.to_key`). Une erreur d'envoi y est notée avec les adresses e-mail masquées (`[adresse]`), comme dans les journaux et l'alerte.

## Comment couper

1. **Sans déploiement** : retirer la variable `copy_email` des agents dans Autocalls (ou vider sa consigne). Plus rien n'est envoyé.
2. **Interrupteur du site** : ajouter la variable d'environnement dans `apphosting.yaml` (valeur entre guillemets, comme `RELANCES_DRY_RUN`), puis redéployer. Le webhook continue d'enregistrer les échanges, sans aucune copie.

   ```yaml
     - variable: CONVERSATION_COPY
       value: "0"
   ```
3. **Retrait du code** : supprimer l'appel à `sendConversationCopy` en fin de `src/pages/api/webhooks/autocalls.ts`.

## À vérifier au premier vrai échange

Au premier webhook réel avec `copy_email` (widget écrit, puis appel vocal, puis WhatsApp), relire la transcription reçue (`transcript`) et la copie envoyée : confirmer qu'Autocalls ne met aucun texte interne (consignes, raisonnement, résultats d'outils, variables) dans les messages de l'assistant. Seuls les messages `assistant`/`user` (conversations) et les entrées `transcript` (appels) sont repris ; un texte interne placé dans le contenu même d'un message de l'assistant serait recopié. En cas de doute : couper (ci-dessus) et prévenir le développeur.

## Tests et textes

- `npx tsx scripts/test-conversation-copy.ts` (aucun réseau, aucun envoi réel).
- Textes de l'e-mail : `copyMail` dans `src/i18n/content/<langue>/ui/email.ts`.
- Politique de confidentialité : une phrase ajoutée dans les 6 langues, section « Intelligence artificielle, enregistrements et transcriptions » (mise à jour du 9 octobre 2026) : « Si vous le demandez ou l'acceptez pendant un échange avec l'une de nos assistantes IA, nous vous envoyons par email une copie de cet échange. »

# Rappels : qui rappelle, et avec quelle voix (9 oct. 2026)

Ce document décrit la règle et ce qu'il reste à faire dans Autocalls. Le code du site (étape 1) est en ligne depuis le 9 octobre. Tant que les outils Autocalls n'envoient pas les deux nouvelles informations (étape 4), rien ne change pour les appels.

## La règle, dans toutes les langues

| # | Ce que dit la personne | Qui rappelle |
|---|---|---|
| R1 | « Rappelez-moi » | La même persona : même prénom, même voix. |
| R2 | « Je veux un responsable », « un supérieur », « quelqu'un d'autre », « un conseiller » | L'autre persona de la langue : une agente passe la main à un agent, et inversement. Elle se présente comme « l'assistant(e) IA responsable du suivi des demandes », et toujours comme une IA. |
| R3 | « Je veux parler à un humain » (première demande) | Comme R2. Le responsable IA propose ensuite de transmettre à une personne de l'équipe. |
| R4 | Le responsable IA s'entend redemander un responsable ou un humain | Aucun nouvel appel IA. L'équipe reçoit l'e-mail « À rappeler à la main », et l'agent dit qu'une personne de l'équipe rappellera dès que possible, sans donner d'heure. Le site l'impose, même si l'IA se trompe : il n'y a pas de boucle. Si la dernière demande ne peut pas être lue en base, une demande de responsable ou d'humain faite à un agent qui rappelle va aussi à l'équipe. |
| R5 | Le responsable IA s'entend dire « rappelez-moi plus tard » | Le même responsable, toujours dans son rôle de responsable. |
| R6 | La personne ne décroche pas | La campagne refait ses 2 tentatives avec le même agent. Aucun message n'est laissé sur le répondeur. Le SMS ou le WhatsApp « rappel manqué » ne contient aucun prénom. |
| R7 | La demande est prise par écrit (WhatsApp, Messenger) ou dans l'espace client | « Rappelez-moi » : la persona de rappel de la langue appelle et elle est annoncée par son prénom (en français, c'est Jade et non Lucie pour une demande commerciale). « Un responsable » : la persona masculine. |
| R8 | La demande vient du formulaire du site ou de la démo | Rien ne change : la voix choisie dans la démo, féminine par défaut. |
| R9 | Demande au support | Mêmes règles. La persona masculine du support n'existe pas encore (étape 3). |
| R10 | Confirmation | À l'oral, l'agent annonce le prénom renvoyé par le site. Sur WhatsApp, la confirmation (formulaire du site) donne le prénom de la persona qui appellera. |
| R11 | Le numéro est d'un autre pays que l'agent (par exemple Noa avec un numéro français) | La campagne du pays du numéro appelle (Jade). L'agent annonce ce prénom et ne dit jamais « je vous rappellerai moi-même ». |
| R12 | Nouvelle demande de responsable (ou d'humain), sur n'importe quel canal, alors qu'un rappel de responsable est déjà prévu | Un nouveau rappel par le même responsable IA (même prénom, même voix) remplace l'ancien. La voix que la personne avait quittée ne revient jamais comme responsable. Si la personne parle justement à ce responsable (par exemple Noa, responsable, jointe ensuite sur la ligne entrante ou par WhatsApp), c'est R4 : l'équipe. |
| R13 | « Rappelez-moi encore », après un appel manqué, un changement d'horaire, ou « la personne qui m'a appelé » | La persona, la voix et le rôle de la dernière demande en file (par exemple Daniel, s'il était le responsable). |
| R14 | Jeu de rôle de la démo | Une demande de responsable fait partie du jeu : l'agent n'enregistre aucun rappel. |
| R15 | La persona qui doit rappeler n'existe pas encore | La demande n'est pas mise en file. L'équipe reçoit « À rappeler à la main ». |

## Les prénoms, langue par langue

| Langue | Agente | Agent | Support, « rappelez-moi » | Support, « un responsable » |
|---|---|---|---|---|
| Français | Jade | Hugo | Lucie | Hugo (à créer) |
| Anglais (Royaume-Uni) | Katie | James | Katie | James (à créer) |
| Anglais (Australie) | Charlotte | Jack | Charlotte | Jack (à créer) |
| Italien | Manuela | Marco | Manuela | Marco (à créer) |
| Polonais | Lena | Tomasz | Lena | Tomasz (à créer) |
| Néerlandais | Emma | Daan | Emma | Daan (à créer) |
| Hébreu | נועה (Noa) | דניאל (Daniel) | נועה (Noa) | דניאל (Daniel, à créer) |

Pour lire ce tableau :
- « Rappelez-moi » à Jade : Jade rappelle. « Un responsable » à Jade : Hugo rappelle. « Un responsable » à Hugo : Jade rappelle. C'est pareil dans chaque langue.
- Les deux lignes entrantes (Katie au Royaume-Uni, Noa en Israël) sont des agentes : « un responsable » y mène à James ou à Daniel.
- WhatsApp, Messenger et l'espace client ont une persona écrite féminine (Lucie, Katie, Charlotte, Manuela, Lena, Emma, Noa).
- L'espace client parle avec la voix de Lucie dans toutes les langues. La même voix ne rappelle donc qu'en français. Ailleurs, l'agent annonce que c'est, par exemple, Katie du support qui rappellera (décision D7).

## Ce que fait le site (étape 1, en ligne)

- **Deux informations nouvelles.** Les outils pourront envoyer :
  - `callback_by` : `same` (moi), `again` (la dernière persona), `manager` (un responsable) ou `human` (un humain) ;
  - `aid`, l'identifiant de l'agent, qu'Autocalls ajoute lui-même dans l'adresse de l'outil.
  Sans ces deux informations, la requête envoyée à la campagne et la réponse à l'agent sont identiques à celles d'aujourd'hui, à deux exceptions près : une note contenant « [ROLE: » est transmise sous la forme « (ROLE: », et les crochets et sauts de ligne du créneau, du fuseau ou de la date du formulaire sont remplacés par des espaces. La ligne enregistrée en base reçoit en plus le marqueur [VOICE:…], retiré de l'e-mail et du dossier client. Un test le prouve sur le formulaire, la démo et les anciens outils.
- **La note lue par l'agent qui rappelle.** Elle commence par une ligne de rôle écrite par le serveur, par exemple « [ROLE: manager — request taken by: Noa — you call back as: Daniel …] ». Le texte saisi par l'IA ou la personne (note, créneau, fuseau) ne peut pas imiter cette ligne : les crochets et les sauts de ligne en sont retirés.
- **L'e-mail à l'équipe.** Il indique qui rappellera et quel agent a pris la demande. Les marqueurs internes ([VOICE:], [ROLE:], [ASKED:]) sont retirés de cet e-mail comme de celui des inscriptions. Les cas R4 et R15 arrivent en « À rappeler à la main » (une opposition « ne plus appeler » y est signalée en priorité). Si un rappel IA est encore prévu pour ce numéro, l'e-mail le dit : passer l'ancienne demande à `cancelled` une fois la personne rappelée à la main. Une fois le rappel fait à la main, passer la ligne à `done` dans la base, sinon les relances la croient encore ouverte.
- **Le dossier client.** Les agents ne voient pas ces marqueurs.
- **Le script de jeton.** `scripts/jeton-webhooks.sh` garde désormais `{{assistant_id}}` tel quel dans l'adresse des outils. Avant, une rotation du jeton l'aurait cassé sans rien signaler.
- **Les tests.** Ils s'exécutent sans réseau ni e-mail : `npx tsx scripts/test-callback-voice.ts`.

## Ce qui reste à faire dans Autocalls

L'ordre compte : les agents qui rappellent doivent comprendre la ligne de rôle avant de recevoir la première demande « responsable ».

**Avant tout, en urgence (D4).** Le rappel de l'appel 9255457 est prévu le dimanche 11 octobre à 10 h 30, heure d'Israël. Noa rappellera alors qu'un responsable avait été demandé : ce devrait être Daniel. Pour corriger, il faut annuler la demande dans la base avant 10 h 30, puis la remettre en file pour Daniel. Il faut votre accord, car cela déclenche un vrai appel.
- La remise en file doit laisser en base une ligne qui porte « [VOICE:male] [ROLE:manager] [ASKED:נועה] ». Sans elle, si la personne redemande un humain à Daniel, le site ne sait pas que Daniel est le responsable et met Noa en file comme « responsable » (R4 échoue), et Daniel ne reçoit pas la ligne de rôle en tête de la note. Déclencher directement l'automatisation avec `voice = male` ne suffit donc pas.
- Une fois les changements du site déployés : passer par `/api/callback?aid=21314`, avec le jeton dans l'en-tête habituel, `callback_by: "manager"`, `call_at: "2026-10-11T10:30:00+03:00"`, le numéro de la personne, son nom, `type: "commercial"`, `consentCall: "true"` et un champ `agent` (par exemple « Correction D4 »). La ligne enregistrée porte alors les marqueurs, et la note de campagne commence par la ligne « [ROLE: manager …] ».
- À défaut (site pas encore déployé) : insérer la ligne en base avec ces marqueurs dans la note et le statut `scheduled`, puis déclencher l'automatisation israélienne avec `voice = male`, l'identifiant de cette ligne comme `request_id` et une note qui commence par la ligne « [ROLE: manager — request taken by: נועה — you call back as: דניאל, AI assistant in charge of follow-up] ».

**Étape 2 : les 21 agents qui rappellent.** Il faut d'abord trancher D5 (voir plus bas). Pour chaque agent :
- ajouter la section « Rôle de ce rappel » : seule la première ligne `[ROLE: …]` fait foi ; ajouter la phrase d'ouverture du responsable, et la règle « responsable redemandé : callback_by = human, aucune heure promise » ;
- remplacer les phrases qui se contredisent : « un conseiller vous rappellera », « option C : rendez-vous avec un conseiller » (D6), « demande d'un humain → rappel par l'équipe » ;
- remplacer « a demandé un rappel sur le site » par une formule neutre ;
- en hébreu, retirer « מהאתר » des messages d'accueil.
Après chaque enregistrement, vérifier que le contrôle de conformité est passé.

**Étape 3 : le support masculin**, dans les 7 langues : Hugo, James, Jack, Marco, Tomasz, Daan, Daniel.
- Créer 7 agents, copies des agentes du support, avec leur voix masculine et les réglages recopiés un par un. Configurer leur webhook de fin d'appel, et vérifier que les lignes entrantes gardent leur numéro.
- Ajouter leurs 7 UUID à la liste autorisée du relais, dans `scripts/relais-webhooks.json`. Puis vous lancez `TOOLS=" " bash scripts/jeton-webhooks.sh`, qui ne met à jour que le relais. Sans cela, leurs fins d'appel n'arriveraient jamais au site.
- Créer 7 campagnes, copies des campagnes support 12493, 12507, 12508, 12509, 12510, 12511 et 12534, avec `mark_complete_when_no_leads` à faux et `retry_on_voicemail` à vrai. Les démarrer pendant les heures d'appel.
- Ajouter dans les 7 automatisations support la branche « voice = male », qui envoie vers la nouvelle campagne.
- Remplir les identifiants dans `src/lib/callbackPersona.ts`, aux endroits où le support masculin vaut aujourd'hui `null`. Ajouter aussi les 7 agents dans `REQUESTERS`. Relancer les tests, puis déployer.

**Étape 4 : les 10 outils de rappel** : 6176, 6246, 6178, 6247, 6240 et 6248 pour le commercial ; 6177, 6182, 6241 et 6242 pour le support.
- Ne changer que deux choses : l'adresse, qui devient `https://www.permanenceia.com/api/callback?aid={{assistant_id}}`, et le paramètre facultatif `callback_by`. Les en-têtes et les champs fixes restent tels quels, y compris `voice = male`, qui sert de repli.
- Description du paramètre : « Who calls back. same = person asks YOU to call back. again = they want whoever called them last (missed call, new time). manager = asks for a manager, someone else or a human. human = only if request_note starts with [ROLE: manager]. »
- Commencer par 6246 (Hugo seul) et faire un essai.
- Après chaque outil, vérifier dans les journaux : « [auth] /api/callback mode=header ok=true », et l'absence de « aid absent ».

**Étape 5 : les agents qui prennent les demandes** : les deux lignes entrantes, les 14 widgets, WhatsApp, Messenger et l'espace client.
- Ajouter la section « Qui rappelle » : `same`, `again`, `manager`, l'annonce du prénom d'après la réponse du site, et jamais d'outil pendant un jeu de rôle.
- Remplacer les promesses « un conseiller / une conseillère vous rappellera ».
- Publier les nouveaux documents de la base de connaissances.

**Étape 6 : les essais de bout en bout.** Ils se font avec votre accord, sur votre numéro, car ce sont de vrais appels. Les lignes de test passent ensuite à `cancelled`.

## Décisions en attente

- **D4** (urgent, avant dimanche 10 h 30, heure d'Israël) : corriger le rappel de l'appel 9255457, comme décrit plus haut, par `/api/callback` (ou une ligne en base avec les marqueurs), jamais par un simple déclenchement de l'automatisation.
- **D5** : confirmer qu'une personne de l'équipe rappelle réellement dans les cas R4. C'est un engagement humain.
- **D6** : reformuler « rendez-vous avec un conseiller » en « rappel à un créneau précis ».
- **D7** : pour l'espace client hors français, garder le même prénom avec une autre voix (choix par défaut), ou donner un prénom propre à l'espace client.

## Retour arrière

- **Le site** : `git revert`. Sans `callback_by` ni `aid`, rien ne change de toute façon pour les appels (voir les deux exceptions plus haut).
- **Un outil** : remettre son ancienne adresse ; le site accepte l'absence des nouveaux champs.

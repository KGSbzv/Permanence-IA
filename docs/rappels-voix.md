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
| R9 | Demande au support | « Rappelez-moi » : la même persona. « Un responsable » ou « un humain » : une personne de l'équipe rappelle (e-mail « À rappeler à la main »), jamais une autre voix IA. Choix du propriétaire du 9 octobre : ces demandes portent sur la facturation ou le compte. |
| R10 | Confirmation | À l'oral, l'agent annonce le prénom renvoyé par le site. Sur WhatsApp, la confirmation (formulaire du site) donne le prénom de la persona qui appellera. |
| R11 | Le numéro est d'un autre pays que l'agent (par exemple Noa avec un numéro français) | La campagne du pays du numéro appelle (Jade). L'agent annonce ce prénom et ne dit jamais « je vous rappellerai moi-même ». |
| R12 | Nouvelle demande de responsable (ou d'humain), sur n'importe quel canal, alors qu'un rappel de responsable est déjà prévu | Un nouveau rappel par le même responsable IA (même prénom, même voix) remplace l'ancien. La voix que la personne avait quittée ne revient jamais comme responsable. Si la personne parle justement à ce responsable (par exemple Noa, responsable, jointe ensuite sur la ligne entrante ou par WhatsApp), c'est R4 : l'équipe. |
| R13 | « Rappelez-moi encore », après un appel manqué, un changement d'horaire, ou « la personne qui m'a appelé » | La persona, la voix et le rôle de la dernière demande en file (par exemple Daniel, s'il était le responsable). |
| R14 | Jeu de rôle de la démo | Une demande de responsable fait partie du jeu : l'agent n'enregistre aucun rappel. |
| R15 | La persona qui doit rappeler n'existe pas encore | La demande n'est pas mise en file. L'équipe reçoit « À rappeler à la main ». |

## Les prénoms, langue par langue

| Langue | Agente | Agent | Support, « rappelez-moi » | Support, « un responsable » ou « un humain » |
|---|---|---|---|---|
| Français | Jade | Hugo | Lucie | une personne de l'équipe |
| Anglais (Royaume-Uni) | Katie | James | Katie | une personne de l'équipe |
| Anglais (Australie) | Charlotte | Jack | Charlotte | une personne de l'équipe |
| Italien | Manuela | Marco | Manuela | une personne de l'équipe |
| Polonais | Lena | Tomasz | Lena | une personne de l'équipe |
| Néerlandais | Emma | Daan | Emma | une personne de l'équipe |
| Hébreu | נועה (Noa) | דניאל (Daniel) | נועה (Noa) | une personne de l'équipe |

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
- **L'e-mail à l'équipe.** Il indique qui rappellera et quel agent a pris la demande. Les marqueurs internes ([VOICE:], [ROLE:], [ASKED:]) sont retirés de cet e-mail comme de celui des inscriptions. Les cas R4 et R15 arrivent en « À rappeler à la main » (une opposition « ne plus appeler » y est signalée en priorité). Si un rappel IA est encore prévu pour ce numéro, l'e-mail le dit : passer l'ancienne demande à `cancelled` une fois la personne rappelée à la main. Une fois le rappel fait à la main, passer la ligne à `done` dans la base, sinon les relances la croient encore ouverte. Depuis le 9 octobre, un ticket de support est clos automatiquement (`done`) quand l'agent de rappel du support termine l'appel avec l'issue `resolu`, et une ligne `done` n'est plus appelée par une automatisation encore en attente (src/lib/tickets.ts, /api/callback/check).
- **Le dossier client.** Les agents ne voient pas ces marqueurs.
- **Le script de jeton.** `scripts/jeton-webhooks.sh` garde désormais `{{assistant_id}}` tel quel dans l'adresse des outils. Avant, une rotation du jeton l'aurait cassé sans rien signaler.
- **Les tests.** Ils s'exécutent sans réseau ni e-mail : `npx tsx scripts/test-callback-voice.ts`.

## État dans Autocalls (9 octobre 2026)

**Fait le 9 octobre :**
- **Étape 2, les 21 agents qui rappellent** (7 langues, commercial et support). Chacun a une section « Rôle de ce rappel » :
  - seule la première ligne `[ROLE: …]` de la note compte ;
  - en rôle responsable, l'agent ouvre en disant qui lui a transmis la demande, et il reste une IA ;
  - si on lui redemande un responsable ou un humain, il passe à l'équipe (`callback_by = human`), sans promettre d'heure ;
  - « rappelez-moi plus tard » donne `callback_by = same`.

  Les autres changements :
  - la formule « a demandé un rappel sur le site » devient neutre (site, téléphone, WhatsApp ou appel précédent) ;
  - l'option C devient « rappel à un créneau précis » (D6) ;
  - en hébreu, « מהאתר » est retiré des messages d'accueil et du répondeur.
- **Étape 4, les 10 outils de rappel** : l'adresse devient `/api/callback?aid={{assistant_id}}` et le paramètre `callback_by` est ajouté. Les en-têtes (jeton) et les champs fixes sont conservés, vérifié outil par outil.
- **Étape 5, les 19 agents qui prennent les demandes** (deux lignes entrantes, 14 widgets, WhatsApp, Messenger, espace client) :
  - nouvelle section « Qui rappelle » (`same`, `again`, `manager`) ;
  - jamais d'outil pendant un jeu de rôle de démo ;
  - la personne qui rappellera est annoncée d'après la réponse du site ;
  - les promesses « un conseiller vous rappellera » sont remplacées.
- **Tous les agents vocaux** demandent maintenant « Autre chose ? » avant de raccrocher. Ils raccrochent aussitôt seulement après un refus d'être rappelé, une opposition à l'enregistrement, un mauvais numéro ou un « pas maintenant ».
- **D4** : le rappel de l'appel 9255457 est remis en file pour Daniel (responsable), le dimanche 11 octobre à 10 h 30, heure d'Israël. L'ancienne demande (Noa) est écartée par `/api/callback/check`.
- **D5** : confirmé par le propriétaire. Une personne de l'équipe rappelle réellement dans les cas R4 (e-mail « À rappeler à la main »).
- **D6** : appliqué.
- **D7** : choix par défaut appliqué. L'espace client garde le même prénom que le support téléphonique de la langue ; la même voix ne rappelle qu'en français.

Aucun agent n'a été bloqué par le contrôle de conformité. Rien d'autre n'a changé : voix, numéros, bases de connaissances, webhooks.

**Décision du 9 octobre : pas de voix masculine au support.** Au support, une demande de responsable ou d'humain est traitée par une personne de l'équipe :
- e-mail « À rappeler à la main », ligne « responsable demandé au support » ;
- l'agent annonce qu'une personne de l'équipe rappellera dès que possible, sans heure ;
- c'est le site qui l'impose (`decideCallback`, `supportTeam`), quelle que soit la réponse de l'IA.

Un agent créé avant cette décision, « PermanenceAI support callback — UK — James » (21498), n'a ni numéro ni campagne : il n'appelle personne. **Ne pas le supprimer pour l'instant** (audit des parcours du 9 octobre, action 5) : Autocalls affiche le relais des fins d'échange (automatisation GzJ12IFH6xHUxCgL3camN, qui transmet au site les fins d'appel et de conversation de tous les agents) comme rattaché à cet agent. Attendre qu'Autocalls confirme que la suppression ne coupe pas ce relais ; après une suppression, vérifier que le relais reste actif et qu'un échange test arrive au site.

**Reste à faire :**
- **Base de connaissances** : aligner la section « un conseiller vous rappelle » des documents de situations. Les prompts priment déjà sur la base. Il faudra publier de nouveaux documents ; la suppression des anciens revient au propriétaire.
- **Essais de bout en bout**, avec l'accord du propriétaire et sur son numéro. Le premier est le rappel de Daniel du 11 octobre.

## Retour arrière

- **Le site** : `git revert`. Sans `callback_by` ni `aid`, rien ne change de toute façon pour les appels (voir les deux exceptions plus haut).
- **Un outil** : remettre son ancienne adresse ; le site accepte l'absence des nouveaux champs.

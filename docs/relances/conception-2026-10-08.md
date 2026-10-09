# Relances commerciales : conception (8 octobre 2026)

Conception retenue après analyse des fichiers, des modèles existants, des règles par pays et de deux propositions indépendantes. **Rien n'est envoyé tant que vous n'avez pas validé** : le système démarre en mode test.

## Publics et règles d'accord

### P — Prospects non inscrits (demande de rappel, contact, fiche secteur, modale, demande d’accompagnement à l’essai, démo en direct, fiche prospect créée par un agent)
- **Entrée :** Ligne callbacks de type « commercial » (jamais « support » ni ticket), status différent de « cancelled », avec un e-mail valide, et aucune inscription (signups) ni compte white-label au même e-mail (minuscules). Début : 24 h après le rappel effectué (status « done ») ou après le créneau demandé, au plus tard J+3 après la demande ; J+1 pour une demande d’accompagnement à l’essai ou une fiche prospect d’agent. La demande la plus récente fixe la source (contacts.origin), la langue (contacts.locale) et le secteur. Démo en direct sans e-mail : un seul WhatsApp pia_demo_followup, seulement si la nouvelle case « WhatsApp marketing » est cochée ; jamais d’appel ni de SMS de prospection. Exclus : secteurs en pause (dentaire-cliniques, kines-paramedical, medecine-esthetique), comptes de test du propriétaire, numéros +1, langue non établie, contacts sans base légale pour leur marché, demandes antérieures à la mise en ligne de la case et de la mention d’information.
- **Sortie :** Sortie immédiate : inscription sur app.permanenceia.com (passage en I) ou début d’essai (passage en C) ; désinscription (lien du pied de page, en-tête List-Unsubscribe, préférence « essential_only ») ; opposition téléphonique (call_events kind=optout) ou résultat « ne_plus_appeler », car une seule liste d’opposition vaut pour e-mail, WhatsApp et appels ; réponse à n’importe quel e-mail (l’équipe prend le relais) ; rebond définitif ou plainte ; secteur passé en pause ; ticket support ouvert (pause jusqu’à sa clôture). Fin normale : après P7, suivi mensuel M (4 envois au plus), puis arrêt définitif. Purge ou anonymisation 3 ans après la dernière interaction venant du prospect.
- **Accord / base légale :** Catégorie « marketing » de sendMail ET base légale enregistrée dans consents pour le marché. fr : case e-mail cochée, ou intérêt légitime B2B si la mention d’information avec droit de refus était affichée à la collecte (version du texte enregistrée) et sans opposition ; adresses génériques (contact@, info@) seulement avec la case cochée. en-gb : case cochée, ou soft opt-in (demande de rappel ou de démo = négociation) si mention et refus proposés à la collecte. en-au : case cochée par défaut ; consentement inféré seulement si la mention était affichée et la demande porte sur le produit. it, pl, nl, he : case cochée obligatoire (ou accord oral demandé par l’agent, enregistré avec l’identifiant de l’appel). he : objet préfixé « פרסומת », expéditeur identifié, réponse possible (jamais de no-reply). Sans base valable : uniquement les messages de service liés à la demande (confirmation de rappel). Aucun envoi rétroactif aux contacts collectés avant la case.

### I — Inscrits n’ayant pas démarré l’essai (compte créé, aucun forfait choisi)
- **Entrée :** Ligne signups depuis plus de 24 h, aucun abonnement Stripe du compte Permanence IA (ni trialing, ni active, ni canceled), minutes_balance = 0 et credits_balance = 0 dans /white-label/users. L’essai de 14 jours et 30 minutes démarre au choix d’un forfait, pas à l’inscription. Tant que le webhook Stripe n’est pas branché, ce public ne se distingue pas d’un essai aux minutes épuisées : la série I n’est pas lancée, seul I1 (service) peut partir, avec une formulation valable dans les deux cas.
- **Sortie :** Début d’essai (passage en C) ; achat de crédit (passage en U si l’usage reste faible, sinon sortie) ; désinscription ; opposition ; réponse ; rebond ou plainte ; compte supprimé. Après I7 : suivi mensuel M (4 envois au plus), puis arrêt.
- **Accord / base légale :** I1 = message de service (fonctionnement du compte, sans argument de vente), catégorie « essential », envoyé dans tous les marchés. I2 à I7 = « marketing », mêmes règles que P. La page d’inscription Autocalls n’affiche ni mention ni case : la base légale vient d’un formulaire du site rapproché par e-mail (pré-inscription sur /essai-gratuit), d’un accord donné à un agent, ou du choix « Recevoir conseils et offres » sur /preferences-email. Jamais d’e-mail pour demander l’accord (interdit en AU, PL et IL).

### C — Essai en cours (14 jours / 30 minutes) : activation, sans pression commerciale
- **Entrée :** Abonnement Stripe du compte Permanence IA au statut « trialing » (customer.subscription.created, avec trial_end), rapproché par e-mail de signups et contacts. Minutes de l’essai lues chaque jour dans /white-label/users pour les étapes conditionnelles. Jamais d’estimation silencieuse : sans trial_end Stripe, C1, C4 et C5 ne partent pas.
- **Sortie :** Passage à « active » (client payant : plus aucune relance commerciale, seulement des messages de service) ; annulation (passage en F) ; désinscription : seuls C1, C4 et C5 continuent (informations sur le compte et la facturation) ; réponse : l’équipe prend le relais et C2, C3 sont sautés.
- **Accord / base légale :** Exécution du contrat d’essai : pas de consentement marketing requis, à condition que les messages restent purement informatifs (aucune promotion, montée en gamme ni comparatif de prix). C1, C4, C5 en catégorie « essential » ; C2 et C3 (aide à la prise en main) envoyés en « essential » mais seulement si la préférence n’est pas « essential_only ». WhatsApp pia_trial_started et pia_trial_ending : Meta les a reclassés en MARKETING le 7 oct., donc uniquement avec l’accord WhatsApp marketing tant que des versions factuelles UTILITY ne sont pas approuvées.

### F — Essai terminé sans forfait (annulé pendant l’essai) : objectif forfait
- **Entrée :** Abonnement Stripe passé de « trialing » à « canceled » sans aucun paiement (customer.subscription.deleted), sans autre abonnement actif ni crédit acheté. Rappel des faits du site : sans annulation, le forfait choisi démarre seul à la fin des 14 jours ; les 30 minutes épuisées ne mettent pas fin à l’essai. Ce public regroupe donc les personnes qui ont annulé (drapeau minutes_epuisees si les 30 minutes avaient été consommées). Aucun second essai n’est proposé : la plateforme ne le prévoit pas.
- **Sortie :** Abonnement « active » (sortie) ; achat de crédit (passage en U si l’usage reste faible) ; désinscription ; opposition ; réponse (F1 en sollicite une : toute réponse arrête la série et passe à l’équipe) ; rebond ou plainte. Après F7 : suivi mensuel M (4 envois au plus), puis arrêt.
- **Accord / base légale :** F1 = service (confirmation qu’aucun débit n’a eu lieu, plus une question ouverte), « essential », envoyé partout sauf après une désinscription totale. F2 à F7 = « marketing », mêmes règles que P. Un essai gratuit ne vaut pas vente en Italie (Cass. 7555/2023) ni aux Pays-Bas ; consentement exprès toujours requis en Pologne et en Israël : sans case cochée, rien n’est envoyé après F1.

### U — Comptes à l’usage (0,39 $ HT/min, sans abonnement) peu actifs : objectif usage réel puis forfait
- **Entrée :** Compte white-label sans abonnement Stripe actif, au moins un achat de crédit, créé depuis 14 jours ou plus, et moins de 10 minutes consommées sur 30 jours (écart de minutes_balance entre deux instantanés quotidiens). Variante : consommation de 254 minutes ou plus sur 30 jours → saut direct à U3 (le forfait devient moins cher).
- **Sortie :** Souscription d’un forfait ; usage redevenu régulier (60 minutes ou plus sur 30 jours, sortie sans message, sauf U3 si le seuil de 254 min est dépassé) ; désinscription ; opposition ; réponse ; rebond ou plainte. Après U6 : suivi mensuel M (4 envois au plus), puis arrêt.
- **Accord / base légale :** U1 (vérification que l’agent reçoit bien les appels) = service, « essential », partout. U2 à U6 = « marketing ». Ces personnes ont payé, mais la page d’inscription Autocalls ne leur a présenté ni mention ni droit de refus : le soft opt-in client n’est pas utilisable tant que ce n’est pas réglé, donc case cochée ou inscription via /preferences-email exigée partout ; pl et he : consentement exprès dans tous les cas. WhatsApp pia_minutes_low : seulement sur un vrai solde bas et avec l’accord WhatsApp marketing (modèle reclassé MARKETING).

### M — Suivi mensuel léger (après la fin d’une série P, I, F ou U)
- **Entrée :** 30 jours après le dernier e-mail d’une série P, I, F ou U, si le contact est toujours éligible avec la même base légale.
- **Sortie :** 4 envois mensuels au plus, puis arrêt définitif. Retour dans une série seulement après une nouvelle interaction du contact (formulaire, inscription, appel entrant). Mêmes arrêts que les séries : inscription, essai, abonnement, désinscription, opposition, réponse, rebond, plainte.
- **Accord / base légale :** Identique à la série d’origine. Aucun suivi mensuel pour un contact dont la seule base est le service (C, I1, F1, U1).

## Les messages (version française)

### Série P

**Étape 1 — J+1 après le rappel effectué ou le créneau demandé (au plus tard J+3 après la demande) ; J+1 pour une demande d’accompagnement ou une fiche d’agent — email**  
Objectif : Démarrer l’essai de 14 jours  
Argument : Essai sans risque : 14 jours, 30 minutes, carte demandée mais rien débité, annulation dans Billing info ; première phrase adaptée à la source de la demande  
Objet : « {first_name}, testez l’agent sur vos vrais appels »  
Bouton : {trial_url} = https://www.permanenceia.com/essai-gratuit (fr) ou https://www.permanenceia.com/{locale}/essai-gratuit (en-gb, en-au, it, pl, nl, he), + ?utm_source=relance&utm_medium=email&utm_campaign=P1

> Bonjour {first_name},
> 
> {source_line}, merci de votre intérêt pour Permanence IA.
> 
> Le plus simple pour vous faire un avis : tester l’agent sur les appels de {company}.
> 1. Créez votre compte et choisissez le forfait à tester : l’essai de 14 jours démarre, avec 30 minutes d’appels.
> 2. Une carte est demandée, mais rien n’est débité pendant l’essai.
> 3. Si ce n’est pas pour vous, annulez avant la fin depuis Billing info : vous ne payez rien.
> 
> Démarrer mon essai : {trial_url}
> 
> Une question ? Répondez à cet e-mail, c’est l’équipe qui le lit.
> 
> L’équipe Permanence IA
> 
> [{source_line} : rappel effectué = « Suite à notre échange du {request_date} » ; rappel non abouti = « Suite à votre demande de rappel » ; accompagnement = « Vous nous avez demandé un coup de main pour démarrer votre essai » ; fiche d’agent = « Suite à votre échange avec notre assistante » ; démo = « Vous avez essayé notre démo en direct » ; contact = « Suite à votre message ». Sans entreprise : « de votre entreprise ».]

### Série P (démo en direct sans e-mail, case WhatsApp marketing cochée)

**Étape 1 — J+1 après la démo, entre 9 h et 18 h heure locale, jours ouvrés du marché, une seule fois — whatsapp (modèle approuvé pia_demo_followup, expéditeur 521, langue du site d’origine ; en-au utilise en_GB)**  
Objectif : Démarrer l’essai de 14 jours (seule relance possible sans e-mail)  
Argument : Vous avez entendu l’agent : ayez le vôtre 24 h/24 ; 14 jours, 30 minutes, carte sans débit, sans engagement ni frais de mise en service  
Objet : « (WhatsApp, pas d’objet) pia_demo_followup »  
Bouton : https://www.permanenceia.com/essai-gratuit (lien intégré au modèle, version de la langue)

> Texte du modèle approuvé par Meta, sans modification ({{1}} prénom, {{2}} secteur de la démo) : remerciement après la démo, invitation à l’essai gratuit de 14 jours (30 minutes, carte demandée sans débit, sans engagement ni frais d’installation), lien vers l’essai dans la langue du site. Un seul envoi, aucune relance WhatsApp ensuite. « STOP » inscrit le numéro dans la liste d’opposition commune.

### Série P

**Étape 2 — J+4 — email**  
Objectif : Faire chiffrer le problème par le prospect lui-même  
Argument : Coût des appels manqués calculé avec SES chiffres (aucun chiffre inventé), mis en face du forfait Réceptionniste et du calculateur de la page Tarifs  
Objet : « Combien vous coûtent les appels sans réponse ? »  
Bouton : {trial_url}?utm_source=relance&utm_medium=email&utm_campaign=P2

> Bonjour {first_name},
> 
> Un appel sans réponse, c’est souvent un client qui compose le numéro suivant de sa liste.
> 
> Faites le calcul avec vos chiffres :
> appels manqués par semaine × 4,3 × valeur moyenne d’un nouveau client = ce que {company} peut laisser filer chaque mois.
> 
> En face : le forfait Réceptionniste, 99 $ HT par mois pour 350 minutes. L’agent répond 24 h/24, prend le message ou le rendez-vous, et vous envoie un résumé de chaque appel. Le calculateur de notre page Tarifs fait la comparaison pour vous.
> 
> Le mieux reste de le mesurer sur vos appels : 14 jours d’essai, 30 minutes incluses, rien débité pendant l’essai.
> {trial_url}
> 
> L’équipe Permanence IA

**Étape 3 — J+9 — email**  
Objectif : Montrer le cas d’usage concret de son métier  
Argument : Cas du secteur repris mot pour mot de la fiche secteur du site (sectors.ts : problems[0] et handles) ; rendez-vous dans l’agenda via Cal.com ou Calendly  
Objet : « {sector} : ce que l’agent prend en charge pour vous »  
Bouton : {trial_url}?utm_source=relance&utm_medium=email&utm_campaign=P3

> Bonjour {first_name},
> 
> Dans votre métier, une situation revient souvent : {sector_problem}
> 
> Sur ces appels, l’agent recueille ce qu’il vous faut : {sector_handles}. Vous recevez une fiche claire et vous rappelez quand vous êtes disponible, ou le rendez-vous est déjà dans votre agenda (Google Agenda ou Outlook, via Cal.com ou Calendly).
> 
> Vous partez d’un modèle de consignes que vous adaptez à {company}, puis vous le testez par chat, dans le navigateur et par un vrai appel.
> 
> Essayer pendant 14 jours : {trial_url}
> 
> L’équipe Permanence IA
> 
> [Secteur inconnu : version générique « les appels qui arrivent pendant que vous êtes occupé ». Secteurs santé en pause : jamais de version sectorielle.]

**Étape 4 — J+16 — email**  
Objectif : Lever l’objection « mes clients veulent un humain » ou « l’IA dira n’importe quoi »  
Argument : Transparence et contrôle : l’agent se dit IA, voix native dans la langue de l’appelant, vous écrivez ses consignes et ses interdits, transfert vers l’équipe inclus dans tous les forfaits  
Objet : « Vos clients sauront qu’ils parlent à une IA, et c’est voulu »  
Bouton : {trial_url}?utm_source=relance&utm_medium=email&utm_campaign=P4

> Bonjour {first_name},
> 
> Dès le début de l’appel, l’agent annonce qu’il est une IA. C’est une obligation du règlement européen sur l’IA, et surtout une question de confiance. Sa voix est naturelle, dans la langue de l’appelant.
> 
> Et c’est vous qui gardez la main :
> - vous écrivez ses consignes : horaires, prix, façon de répondre ;
> - vous listez ce qu’il ne doit jamais faire : devis chiffré, diagnostic, promesse de délai ;
> - il transfère l’appel à votre équipe quand vous l’avez prévu, ou organise un rappel avec un résumé. Le transfert est inclus dans tous les forfaits.
> 
> Jugez sur vos propres appels : {trial_url}
> 
> L’équipe Permanence IA
> 
> [en-gb, en-au, he : ne pas citer le règlement européen, garder seulement la transparence.]

**Étape 5 — J+25 — email**  
Objectif : Lever le frein technique et le frein « changer de numéro »  
Argument : Mise en place légère : garder son numéro par renvoi d’appel (éventuellement seulement quand on ne décroche pas), aucun frais d’installation, numéro dédié en option dès 3,99 $ HT/mois  
Objet : « Vous gardez votre numéro actuel »  
Bouton : {trial_url}?utm_source=relance&utm_medium=email&utm_campaign=P5

> Bonjour {first_name},
> 
> Pas besoin de changer de numéro ni de prévenir vos clients.
> 
> Vous activez un renvoi d’appel chez votre opérateur, par exemple seulement quand vous ne décrochez pas, ou le soir et le week-end. Vos clients composent le numéro habituel de {company}, et l’agent prend le relais quand vous ne pouvez pas répondre. Votre opérateur peut facturer le renvoi vers un numéro étranger : vérifiez votre offre.
> 
> Aucun frais d’installation ni de mise en service. Vous préférez un numéro dédié ? C’est une option, dès 3,99 $ HT par mois selon le pays.
> 
> Démarrer l’essai : {trial_url}
> 
> L’équipe Permanence IA

**Étape 6 — J+38 — email**  
Objectif : Répondre à « combien ça coûte vraiment ? » sans surprise  
Argument : Prix complets, identiques au site (lus dans markets.ts) : 3 forfaits, paiement à l’usage, coût d’un appel de 5 minutes, sans engagement, 2 mois offerts en annuel  
Objet : « Nos prix, sans astérisque »  
Bouton : {trial_url}?utm_source=relance&utm_medium=email&utm_campaign=P6

> Bonjour {first_name},
> 
> Voici nos prix, hors taxes :
> - Réceptionniste : 99 $ par mois, 350 minutes ;
> - Assistant : 249 $ par mois, 1 000 minutes ;
> - Centre d’appels : 499 $ par mois, 2 300 minutes ;
> - sans forfait : 0,39 $ la minute, crédit sans date d’expiration.
> 
> Concrètement, un appel de 5 minutes revient à environ 1,95 $ à l’usage, et à 1,10 à 1,40 $ dans un forfait.
> 
> Sans engagement : vous résiliez quand vous voulez depuis Billing info. En annuel, 2 mois sont offerts. Et pendant les 14 jours d’essai, rien n’est débité.
> 
> Commencer l’essai : {trial_url}
> 
> L’équipe Permanence IA

**Étape 7 — J+55 — email**  
Objectif : Clore la série avec respect, obtenir une réponse, annoncer le rythme mensuel  
Argument : Laisser la main : répondre « plus tard » ou « non », un e-mail par mois au plus ensuite, désinscription en un clic ; l’essai reste disponible  
Objet : « Le bon moment pour {company} ? »  
Bouton : {trial_url}?utm_source=relance&utm_medium=email&utm_campaign=P7

> Bonjour {first_name},
> 
> C’est le dernier e-mail de cette série : nous ne voulons pas encombrer votre boîte.
> 
> Si le moment n’est pas le bon, répondez simplement « plus tard » ou « non », nous en tiendrons compte. Sinon, vous recevrez au plus un e-mail par mois, avec un conseil pratique ; le lien en bas de ce message vous désinscrit en un clic.
> 
> Et le jour où vous voudrez essayer : 14 jours, 30 minutes d’appels, rien débité pendant l’essai.
> {trial_url}
> 
> Merci pour votre attention,
> L’équipe Permanence IA

### Série I

**Étape 1 — J+1 après l’inscription (message de service) — email (essential)**  
Objectif : Expliquer la seule étape qui manque pour démarrer l’essai  
Argument : Fonctionnement du compte, sans argument de vente : l’essai démarre au choix du forfait, carte sans débit, annulation dans Billing info ; espace en anglais mais assistante d’aide dans sa langue  
Objet : « Votre compte est créé : une étape pour démarrer l’essai »  
Bouton : {app_url} = https://app.permanenceia.com/billing ?utm_source=relance&utm_medium=email&utm_campaign=I1

> Bonjour {first_name},
> 
> Votre espace Permanence IA est prêt.
> 
> Pour information, l’essai gratuit de 14 jours (30 minutes d’appels) démarre quand vous choisissez un forfait dans votre espace. Une carte est demandée, mais rien n’est débité pendant l’essai ; si vous annulez avant la fin depuis Billing info, vous ne payez rien.
> 
> L’espace client est en anglais, mais son assistante d’aide intégrée vous guide en français, par écrit ou à voix haute.
> 
> Choisir mon forfait : {app_url}
> 
> L’équipe Permanence IA
> 
> [Langue inconnue : version française puis anglaise dans le même e-mail, contact signalé dans le rapport quotidien, aucune étape marketing tant que la langue n’est pas établie. he : vérifier que l’assistante d’aide parle hébreu, sinon écrire « en anglais ».]

**Étape 2 — J+3 — email**  
Objectif : Démarrer l’essai en entendant son propre agent  
Argument : Votre agent à vous, au nom de votre entreprise, vérifiable de 3 façons (chat, navigateur, vrai appel) avant de lui confier un seul client  
Objet : « Appelez votre propre agent »  
Bouton : https://app.permanenceia.com/billing?utm_source=relance&utm_medium=email&utm_campaign=I2

> Bonjour {first_name},
> 
> La meilleure démonstration, c’est votre agent à vous : il répond au nom de {company}, avec vos horaires et vos services.
> 
> Vous pouvez tout vérifier avant de lui confier un seul client :
> 1. le chat de test, pour ajuster ses consignes ;
> 2. l’appel dans le navigateur, pour entendre sa voix ;
> 3. un vrai appel depuis votre portable.
> 
> Vous ne renvoyez vos appels que lorsque le résultat vous convient. Le guide « Tester votre agent » détaille chaque étape.
> 
> Démarrer l’essai et tester : {app_url}
> 
> L’équipe Permanence IA

**Étape 3 — J+7 — email**  
Objectif : Démarrer l’essai avec accompagnement  
Argument : On configure ensemble : réponse à l’e-mail ou demande d’accompagnement sur la page Essai, rappel au créneau choisi  
Objet : « On configure votre agent ensemble ? »  
Bouton : {trial_url} (formulaire d’accompagnement de la page Essai, dans la langue du contact) ?utm_source=relance&utm_medium=email&utm_campaign=I3

> Bonjour {first_name},
> 
> Pas eu le temps de vous lancer ? Nous pouvons le faire avec vous.
> 
> Répondez à cet e-mail avec un créneau et le numéro où vous joindre, ou laissez une demande d’accompagnement sur notre page Essai. Nous vous rappelons pour configurer l’agent de {company} avec vous (consignes, agenda, renvoi d’appel) et démarrer votre essai de 14 jours dans de bonnes conditions.
> 
> Demander un accompagnement : {trial_url}
> 
> L’équipe Permanence IA

**Étape 4 — J+14 — email**  
Objectif : Démarrer l’essai en sachant où placer les 30 minutes  
Argument : 30 minutes = une dizaine d’appels de 3 minutes : les placer sur les moments qui coûtent le plus (soir, week-end, appels non décrochés)  
Objet : « 30 minutes d’essai : où les utiliser ? »  
Bouton : https://app.permanenceia.com/billing?utm_source=relance&utm_medium=email&utm_campaign=I4

> Bonjour {first_name},
> 
> 30 minutes, c’est environ une dizaine d’appels de 3 minutes. Assez pour juger, à condition de les placer au bon endroit.
> 
> Notre conseil : ne renvoyez pas tout. Activez le renvoi seulement quand vous ne décrochez pas, ou le soir et le week-end. Ce sont les appels que {company} perd aujourd’hui, et ceux où l’agent vous sera le plus utile.
> 
> Vous lirez le résumé de chaque appel dans votre espace et verrez tout de suite si cela vous sert.
> 
> Choisir mon forfait et démarrer l’essai : {app_url}
> 
> L’équipe Permanence IA

**Étape 5 — J+24 — email**  
Objectif : Lever l’hésitation sur le choix du forfait  
Argument : Repère simple par volume, changement de forfait à tout moment sans engagement, rien débité pendant l’essai  
Objet : « Quel forfait choisir pour démarrer ? »  
Bouton : https://app.permanenceia.com/billing?utm_source=relance&utm_medium=email&utm_campaign=I5

> Bonjour {first_name},
> 
> Si vous hésitez, voici un repère simple (prix HT par mois) :
> - Réceptionniste, 99 $ : 350 minutes, soit environ 115 appels de 3 minutes ;
> - Assistant, 249 $ : 1 000 minutes, plus des crédits pour répondre par écrit (chat du site, WhatsApp) ;
> - Centre d’appels, 499 $ : 2 300 minutes.
> 
> Pas besoin de viser juste du premier coup : vous changez de forfait à tout moment, sans engagement, et le changement s’affiche avant confirmation. Pendant les 14 jours d’essai, rien n’est débité.
> 
> Choisir mon forfait : {app_url}
> 
> L’équipe Permanence IA

**Étape 6 — J+40 — email**  
Objectif : Proposer une porte d’entrée sans abonnement  
Argument : Paiement à l’usage : 0,39 $ HT la minute, crédit sans expiration, mêmes fonctions que Réceptionniste ; dit honnêtement que ce mode ne comprend pas l’essai gratuit  
Objet : « Pas prêt pour un abonnement ? Payez à la minute »  
Bouton : https://app.permanenceia.com/billing?utm_source=relance&utm_medium=email&utm_campaign=I6

> Bonjour {first_name},
> 
> Un abonnement ne convient pas à tout le monde. Vous pouvez aussi utiliser votre agent sans forfait : vous ajoutez du crédit quand vous voulez (Add credits), la minute est à 0,39 $ HT et le crédit n’expire pas.
> 
> Vous avez alors les mêmes fonctions que le forfait Réceptionniste. Ce mode ne comprend pas l’essai gratuit : vous payez seulement ce que vous ajoutez. Dès que vos appels deviennent réguliers, un forfait revient moins cher à la minute.
> 
> Ajouter du crédit ou choisir un forfait : {app_url}
> 
> L’équipe Permanence IA

**Étape 7 — J+58 — email**  
Objectif : Clore la série, recueillir le frein, passer au rythme mensuel  
Argument : Respect du choix : l’espace reste ouvert, une ligne de réponse sur ce qui a bloqué, désinscription en un clic  
Objet : « Votre espace reste ouvert »  
Bouton : https://app.permanenceia.com/billing?utm_source=relance&utm_medium=email&utm_campaign=I7

> Bonjour {first_name},
> 
> C’est notre dernier e-mail de cette série. Votre espace Permanence IA reste ouvert : l’essai de 14 jours (30 minutes, rien débité pendant l’essai) démarre dès que vous choisissez un forfait.
> 
> Si quelque chose vous a bloqué, répondez-nous en une ligne : cela nous aide vraiment.
> 
> Ensuite, nous vous écrirons au plus une fois par mois. Pour ne plus rien recevoir, cliquez sur le lien de désinscription en bas de cet e-mail.
> 
> Démarrer quand vous serez prêt : {app_url}
> 
> L’équipe Permanence IA

### Série C

**Étape 1 — T+0 (début réel de l’essai, statut Stripe trialing), entre 8 h et 20 h heure locale — email (essential) + WhatsApp pia_trial_started seulement avec l’accord WhatsApp marketing**  
Objectif : Bien démarrer l’essai  
Argument : 3 actions et la date de fin en clair : créer l’agent depuis un modèle, connecter l’agenda, s’appeler puis activer le renvoi  
Objet : « Votre essai a commencé : 3 étapes pour en profiter »  
Bouton : https://app.permanenceia.com?utm_source=relance&utm_medium=email&utm_campaign=C1

> Bonjour {first_name},
> 
> Votre essai Permanence IA a commencé. Il dure jusqu’au {trial_end_date}, avec 30 minutes d’appels.
> 
> Pour en profiter :
> 1. Créez votre agent à partir d’un modèle et adaptez ses consignes à {company}.
> 2. Connectez votre agenda (Cal.com ou Calendly) si vous voulez qu’il prenne des rendez-vous.
> 3. Appelez-le vous-même, puis activez le renvoi d’appel quand le résultat vous convient.
> 
> Pendant l’essai, rien n’est débité. Vous pouvez annuler avant le {trial_end_date} depuis Billing info.
> 
> Ouvrir mon espace : {app_url}
> 
> L’équipe Permanence IA

**Étape 2 — T+2, seulement si aucune minute n’a été consommée — email (essential, sauté si préférence essential_only)**  
Objectif : Débloquer le premier vrai appel  
Argument : Un premier appel en 5 minutes : s’appeler soi-même, puis renvoi quand on ne décroche pas ; on garde son numéro  
Objet : « Votre agent attend son premier appel »  
Bouton : https://app.permanenceia.com?utm_source=relance&utm_medium=email&utm_campaign=C2

> Bonjour {first_name},
> 
> Votre agent n’a pas encore reçu d’appel. C’est souvent la dernière marche, et elle est courte :
> 1. Appelez-le depuis votre portable et posez-lui une question qu’un client poserait.
> 2. Si la réponse vous convient, activez chez votre opérateur le renvoi quand vous ne décrochez pas.
> 
> Vous gardez votre numéro et pouvez désactiver le renvoi à tout moment. Il vous reste 30 minutes d’essai, jusqu’au {trial_end_date}.
> 
> Ouvrir mon espace : {app_url}
> 
> L’équipe Permanence IA

**Étape 3 — T+5 — email (essential, sauté si préférence essential_only)**  
Objectif : Améliorer l’agent avec ses premiers appels  
Argument : Relire les résumés, compléter les consignes, lister les interdits, régler le transfert dans « Tools & actions »  
Objet : « Améliorez votre agent avec ses premiers appels »  
Bouton : https://app.permanenceia.com?utm_source=relance&utm_medium=email&utm_campaign=C3

> Bonjour {first_name},
> 
> Vos premiers appels sont la meilleure source pour améliorer votre agent. Dans votre espace, relisez les résumés et repérez :
> - les questions mal traitées : ajoutez l’information dans ses consignes ;
> - ce qu’il ne doit jamais promettre : listez-le, il renverra ces sujets vers vous ;
> - les appels à vous passer directement : réglez le transfert dans « Tools & actions ».
> 
> Le guide « Rédiger les consignes de l’agent » donne les 5 blocs d’une bonne consigne, et l’assistant de rédaction (AI Prompt Editor) vous aide à les écrire.
> 
> Ouvrir mon espace : {app_url}
> 
> L’équipe Permanence IA

**Étape 4 — Événement : 5 minutes d’essai ou moins restantes (une seule fois) — email (essential)**  
Objectif : Prévenir avant que les appels s’arrêtent, sans pousser  
Argument : Information factuelle reprise de la FAQ : à 30 minutes, les appels s’arrêtent jusqu’à la fin de l’essai ou jusqu’au démarrage de l’abonnement ; le client choisit  
Objet : « Il vous reste {minutes_left} minutes d’essai »  
Bouton : https://app.permanenceia.com/billing?utm_source=relance&utm_medium=email&utm_campaign=C4

> Bonjour {first_name},
> 
> Il vous reste {minutes_left} minutes sur les 30 de votre essai.
> 
> Pour information, une fois les 30 minutes atteintes, les appels s’arrêtent jusqu’à la fin de l’essai, le {trial_end_date}, ou jusqu’à ce que vous démarriez votre abonnement {plan_name} depuis Billing info. Sans action de votre part, il démarre de lui-même à la fin de l’essai, sauf si vous l’annulez avant.
> 
> C’est vous qui choisissez.
> 
> Voir mon abonnement : {app_url}
> 
> L’équipe Permanence IA

**Étape 5 — T+11 (3 jours avant trial_end ; Stripe envoie déjà son rappel en anglais 7 jours avant) — email (essential) + WhatsApp pia_trial_ending seulement avec l’accord WhatsApp marketing**  
Objectif : Informer clairement de la fin d’essai et de la facturation  
Argument : Transparence : date, forfait et montant qui démarrent, rien à faire pour continuer, comment annuler sans débit  
Objet : « Votre essai se termine le {trial_end_date} »  
Bouton : https://app.permanenceia.com/billing?utm_source=relance&utm_medium=email&utm_campaign=C5

> Bonjour {first_name},
> 
> Votre essai se termine le {trial_end_date}.
> 
> - Vous souhaitez continuer : rien à faire. Votre forfait {plan_name} démarre ce jour-là, et le premier mois ({plan_price} $ HT, taxes selon votre pays) est prélevé sur votre carte.
> - Vous ne souhaitez pas continuer : annulez avant cette date depuis Billing info, bouton « Cancel subscription ». Rien ne sera débité.
> 
> Une question sur votre forfait ou vos minutes ? Répondez à cet e-mail.
> 
> Gérer mon abonnement : {app_url}
> 
> L’équipe Permanence IA

### Série F

**Étape 1 — J+1 après la fin de l’essai annulé (message de service) — email (essential)**  
Objectif : Confirmer l’absence de débit et comprendre le frein  
Argument : Écoute : confirmation honnête, une seule question ouverte, aucune offre  
Objet : « Votre essai est terminé, rien n’a été débité »  
Bouton : Réponse directe à l’e-mail (Reply-To : contact@permanenceia.com)

> Bonjour {first_name},
> 
> Votre essai a pris fin sans abonnement : rien n’a été débité, et c’est tout à fait votre droit.
> 
> Pouvez-vous nous dire en une ligne ce qui a manqué ? La voix, les réponses, la mise en place, le prix, le moment… Répondez simplement à cet e-mail : c’est l’équipe qui lit chaque réponse, et si un réglage peut changer les choses, nous vous le dirons.
> 
> Merci d’avoir essayé Permanence IA.
> 
> L’équipe Permanence IA

**Étape 2 — J+5 — email**  
Objectif : Garder l’agent actif sans abonnement, en attendant un forfait  
Argument : Paiement à l’usage : ne pas repartir de zéro, 0,39 $ HT la minute, crédit sans expiration, mêmes fonctions que Réceptionniste  
Objet : « Gardez votre agent, sans abonnement »  
Bouton : https://app.permanenceia.com/billing?utm_source=relance&utm_medium=email&utm_campaign=F2

> Bonjour {first_name},
> 
> Si c’est l’abonnement qui vous a freiné, il existe une autre formule : le paiement à l’usage.
> 
> Votre espace reste accessible. Vous ajoutez du crédit quand vous voulez (Add credits), la minute est à 0,39 $ HT, sans abonnement, et le crédit n’expire pas. Vous gardez les mêmes fonctions que le forfait Réceptionniste. Un appel de 5 minutes revient à environ 1,95 $ HT.
> 
> Ajouter du crédit : {app_url}
> 
> L’équipe Permanence IA

**Étape 3 — J+12 — email**  
Objectif : Recadrer l’usage : en complément de l’équipe, pas en remplacement  
Argument : Seulement les heures creuses : soir, week-end, pause déjeuner, pics ; les appels qui tombaient sur la messagerie obtiennent une réponse  
Objet : « Et si l’agent ne répondait que le soir et le week-end ? »  
Bouton : https://app.permanenceia.com/billing?utm_source=relance&utm_medium=email&utm_campaign=F3

> Bonjour {first_name},
> 
> Beaucoup d’entreprises n’utilisent pas l’agent pour tout. Elles le gardent en complément de leur équipe : il prend le relais le soir, le week-end, à la pause déjeuner ou quand toutes les lignes sont occupées.
> 
> Vous réglez simplement le renvoi d’appel chez votre opérateur pour ces moments-là. Le reste du temps, rien ne change pour {company}, et les appels qui tombaient sur la messagerie reçoivent enfin une réponse, avec un résumé pour vous.
> 
> Reprendre avec un forfait : {app_url}
> 
> L’équipe Permanence IA

**Étape 4 — J+20 — email**  
Objectif : Traiter l’objection « l’agent n’était pas assez bon »  
Argument : Qualité réglable : les 3 réglages qui changent le plus le résultat, avec l’assistant de rédaction  
Objet : « Les 3 réglages qui changent le plus vos appels »  
Bouton : https://app.permanenceia.com/billing?utm_source=relance&utm_medium=email&utm_campaign=F4

> Bonjour {first_name},
> 
> Quand un agent déçoit pendant l’essai, c’est le plus souvent une information qui manque dans ses consignes. Les trois réglages qui changent le plus le résultat :
> 1. Des informations pratiques complètes : horaires, zone, prix indicatifs, délais.
> 2. La liste de ce qu’il ne doit jamais faire, pour qu’il renvoie ces sujets vers vous.
> 3. Le transfert vers votre équipe pour les cas sensibles, inclus dans tous les forfaits.
> 
> L’assistant de rédaction de votre espace (AI Prompt Editor) vous aide à les écrire.
> 
> Reprendre avec ces réglages : {app_url}
> 
> L’équipe Permanence IA

**Étape 5 — J+30 — email**  
Objectif : Choisir un forfait selon son volume  
Argument : Prix dégressif à la minute (0,28 $ → 0,22 $), sans engagement en mensuel, 2 mois offerts en annuel  
Objet : « Plus vous avez d’appels, moins la minute coûte »  
Bouton : {pricing_url} = https://www.permanenceia.com/tarifs ou /{locale}/tarifs ?utm_source=relance&utm_medium=email&utm_campaign=F5

> Bonjour {first_name},
> 
> Dans un forfait, le prix réel de la minute baisse avec le volume :
> - Réceptionniste, 99 $ HT/mois pour 350 minutes : environ 0,28 $ la minute ;
> - Assistant, 249 $ HT/mois pour 1 000 minutes : environ 0,25 $ ;
> - Centre d’appels, 499 $ HT/mois pour 2 300 minutes : environ 0,22 $.
> 
> En mensuel, c’est sans engagement : vous résiliez à tout moment depuis Billing info. En annuel, vous payez 10 mois pour 12. Le calculateur de notre page Tarifs choisit le moins cher selon vos appels.
> 
> Comparer et choisir : {pricing_url}
> 
> L’équipe Permanence IA

**Étape 6 — J+45 — email**  
Objectif : Reprendre avec une aide humaine  
Argument : Mise en place faite avec vous : consignes, transfert, renvoi ; simple échange, sans engagement  
Objet : « On vous aide à le mettre en place ? »  
Bouton : Réponse directe à l’e-mail (Reply-To : contact@permanenceia.com)

> Bonjour {first_name},
> 
> Souvent, ce n’est pas l’agent qui déçoit, c’est une consigne qui manque ou un renvoi d’appel mal réglé.
> 
> Répondez à cet e-mail avec un créneau et le numéro où vous joindre : un membre de l’équipe vous rappelle pour régler l’agent de {company} avec vous (consignes, transfert, renvoi d’appel), avant que vous choisissiez un forfait. Pas d’engagement, c’est un simple échange.
> 
> L’équipe Permanence IA

**Étape 7 — J+60 — email**  
Objectif : Clore la série et passer au rythme mensuel  
Argument : Respect du choix, options toujours ouvertes (forfait sans engagement, usage à 0,39 $ HT/min), désinscription en un clic  
Objet : « Nous arrêtons là, merci d’avoir essayé »  
Bouton : https://app.permanenceia.com/billing?utm_source=relance&utm_medium=email&utm_campaign=F7

> Bonjour {first_name},
> 
> C’est notre dernier e-mail de cette série. Merci d’avoir essayé Permanence IA.
> 
> Votre espace reste accessible : vous pouvez reprendre avec un forfait, sans engagement, ou à l’usage, à 0,39 $ HT la minute.
> 
> Nous vous écrirons au plus une fois par mois. Pour ne plus rien recevoir, cliquez sur le lien de désinscription en bas de cet e-mail.
> 
> Mon espace : {app_url}
> 
> L’équipe Permanence IA

### Série U

**Étape 1 — J+0 à l’entrée (message de service) — email (essential)**  
Objectif : Vérifier que la faible activité n’est pas une panne de configuration  
Argument : L’agent reçoit-il vraiment les appels ? Test en une minute du renvoi ou du numéro  
Objet : « Votre agent reçoit-il bien vos appels ? »  
Bouton : https://app.permanenceia.com?utm_source=relance&utm_medium=email&utm_campaign=U1

> Bonjour {first_name},
> 
> Votre agent a reçu peu d’appels ces 30 derniers jours. C’est peut-être voulu, mais c’est parfois un renvoi d’appel désactivé ou mal réglé.
> 
> Vérification en une minute :
> 1. Appelez votre numéro habituel au moment où le renvoi doit s’activer.
> 2. Si l’agent ne répond pas, vérifiez le renvoi chez votre opérateur, ou le numéro relié dans votre espace.
> 
> Si tout fonctionne, ne changez rien.
> 
> Ouvrir mon espace : {app_url}
> 
> L’équipe Permanence IA

**Étape 2 — J+7 — email**  
Objectif : Augmenter l’usage utile  
Argument : Renvoyer seulement les appels manqués : on décroche quand on peut, l’agent prend le reste, on ne paie que les minutes utilisées  
Objet : « Ne lui confiez que les appels que vous manquez »  
Bouton : https://app.permanenceia.com?utm_source=relance&utm_medium=email&utm_campaign=U2

> Bonjour {first_name},
> 
> Vous n’êtes pas obligé de tout confier à l’agent. Avec un renvoi en cas de non-réponse ou d’occupation (si votre opérateur le propose), vous décrochez quand vous pouvez, et l’agent prend le relais seulement quand vous ne pouvez pas.
> 
> Résultat : moins d’appels perdus pour {company}, et vous ne payez que les minutes réellement utilisées.
> 
> Mon espace : {app_url}
> 
> L’équipe Permanence IA

**Étape 3 — J+16 (ou dès 254 minutes consommées sur 30 jours) — email**  
Objectif : Passer au forfait Réceptionniste quand il devient moins cher  
Argument : Seuil de rentabilité honnête : au-delà d’environ 254 minutes par mois (99 $ ÷ 0,39 $), Réceptionniste coûte moins cher ; en dessous, l’usage reste le bon choix  
Objet : « À partir de quand un forfait revient moins cher ? »  
Bouton : https://app.permanenceia.com/billing?utm_source=relance&utm_medium=email&utm_campaign=U3

> Bonjour {first_name},
> 
> Le calcul est simple : à 0,39 $ HT la minute, 99 $ correspondent à environ 254 minutes.
> 
> - Moins de 254 minutes par mois : restez à l’usage, c’est le plus économique.
> - Plus de 254 minutes : le forfait Réceptionniste (350 minutes pour 99 $ HT) revient moins cher, environ 0,28 $ la minute.
> 
> Vous suivez votre consommation dans votre espace, et un forfait se résilie à tout moment depuis Billing info.
> 
> Voir ma consommation : {app_url}
> 
> L’équipe Permanence IA

**Étape 4 — J+28 — email**  
Objectif : Faire découvrir des fonctions déjà incluses  
Argument : Transfert inclus sans frais à l’acte et prise de rendez-vous dans l’agenda ; continuité de service avec l’alerte de solde bas et la recharge automatique  
Objet : « Deux fonctions déjà incluses dans votre compte »  
Bouton : https://app.permanenceia.com?utm_source=relance&utm_medium=email&utm_campaign=U4

> Bonjour {first_name},
> 
> Deux fonctions sont déjà incluses, sans frais à l’acte :
> - le transfert : l’agent passe à votre équipe les appels importants (client mécontent, urgence), selon vos règles, dans « Tools & actions » ; la durée transférée est décomptée de vos minutes ;
> - l’agenda : connecté via Cal.com ou Calendly, il réserve vos créneaux libres pendant l’appel.
> 
> Enfin, pour ne jamais tomber à zéro crédit, vous pouvez activer la recharge automatique ; une alerte par e-mail vous prévient déjà quand le solde devient bas.
> 
> Mon espace : {app_url}
> 
> L’équipe Permanence IA

**Étape 5 — J+42 — email**  
Objectif : Présenter honnêtement le forfait Assistant  
Argument : Montée en gamme factuelle : 1 000 minutes, 1 000 crédits de messages (≈ 330 réponses écrites), 1 voix clonée, 3 agents, sans engagement  
Objet : « Répondre aussi par écrit, avec votre voix »  
Bouton : https://app.permanenceia.com/billing?utm_source=relance&utm_medium=email&utm_campaign=U5

> Bonjour {first_name},
> 
> À l’usage, vous avez les fonctions du forfait Réceptionniste, sans crédits de messages inclus. Le forfait Assistant (249 $ HT par mois) ajoute :
> - 1 000 minutes d’appels et 3 agents ;
> - 1 000 crédits de messages par mois, soit environ 330 réponses écrites de l’IA (chat du site, WhatsApp) ;
> - 1 voix clonée : la vôtre, ou celle d’une personne qui vous a donné son accord écrit. L’agent annonce toujours qu’il est une IA.
> 
> Sans engagement, résiliation à tout moment depuis Billing info.
> 
> Voir les forfaits : {app_url}
> 
> L’équipe Permanence IA

**Étape 6 — J+58 — email**  
Objectif : Clore la série et passer au rythme mensuel  
Argument : Récapitulatif honnête : peu d’appels = usage ; appels réguliers = forfait sans engagement, 2 mois offerts en annuel  
Objet : « Votre formule, votre rythme »  
Bouton : https://app.permanenceia.com/billing?utm_source=relance&utm_medium=email&utm_campaign=U6

> Bonjour {first_name},
> 
> C’est notre dernier e-mail de cette série. En résumé :
> - peu d’appels : l’usage, à 0,39 $ HT la minute, reste le plus adapté, et votre crédit n’expire pas ;
> - appels réguliers : un forfait revient moins cher, sans engagement en mensuel, avec 2 mois offerts en annuel.
> 
> Nous vous écrirons au plus une fois par mois. Pour ne plus rien recevoir, cliquez sur le lien de désinscription en bas de cet e-mail.
> 
> Mon espace : {app_url}
> 
> L’équipe Permanence IA

### Série M (après P, I, F ou U)

**Étape 1 — Tous les 30 jours après la fin de la série, 4 envois au plus, puis arrêt — email**  
Objectif : Rester utile sans insister, ramener vers l’essai (P) ou le forfait (I, F, U)  
Argument : Un conseil par mois tiré d’un guide publié du site, rotation fixe : 1) tester son agent de 3 façons ; 2) les 5 blocs d’une bonne consigne ; 3) ce que l’agent ne doit jamais faire ; 4) garder son numéro grâce au renvoi d’appel. Jamais de nouveauté non publiée sur le site.  
Objet : « Le conseil du mois : {topic_title} »  
Bouton : {trial_url} pour les contacts issus de P ; https://app.permanenceia.com/billing pour I, F et U (utm_campaign=M{n})

> Bonjour {first_name},
> 
> {topic_paragraph}
> 
> [2 ou 3 phrases reprises du guide correspondant, dans la langue du contact. Exemple, mois 3 : « Vous décidez de ce que votre agent ne doit jamais faire : donner un devis chiffré, poser un diagnostic, promettre un délai. Listez-le dans ses consignes : il renverra ces sujets vers votre équipe, avec un résumé de la demande. »]
> 
> {cta_line}
> 
> C’est un e-mail mensuel ; vous pouvez vous désinscrire en un clic en bas de ce message.
> 
> L’équipe Permanence IA
> 
> [{cta_line} : prospects = « Essayer pendant 14 jours : {trial_url} » ; inscrits, essais terminés et comptes à l’usage = « Ouvrir mon espace : {app_url} ».]

## Données à enregistrer

- Langue toujours enregistrée, liée à la provenance sur le site — table callbacks : nouvelles colonnes locale (fr|en-gb|en-au|it|pl|nl|he, écrite en clair même pour le français), locale_source (site_form|agent_call|phone_prefix|picker|manual), origin_page (chemin de la page qui a affiché le formulaire), referrer, utm_source/utm_medium/utm_campaign, et pour la démo deux valeurs distinctes site_locale (langue de relance) et demo_lang (langue choisie pour la démo). /api/callback remplit locale depuis body.locale, déjà envoyé par tous les formulaires, au lieu du seul suffixe « [xx] » du champ agent (src/pages/api/callback/index.ts l.85), qui perd la langue des formulaires standards.
- Règle de langue, jamais devinée en silence : (1) locale du site du formulaire ; (2) langue déclarée par l’agent, avec « en » normalisé en en-gb ou en-au selon l’indicatif (et correction de la regex de identifier_contact qui ignore [en]) ; (3) indicatif non ambigu (+33/+377 → fr, +44 → en-gb, +61 → en-au, +39 → it, +48 → pl, +31 → nl, +972 → he) avec locale_source=phone_prefix ; (4) indicatifs ambigus (+32, +41, +352, +1, autres) : aucun envoi commercial, locale_needs_review=true, contact listé dans le rapport quotidien pour choix manuel. Le domaine de l’e-mail (.it, .pl) n’est qu’un indice affiché, jamais appliqué.
- Table signups : ajouter locale, locale_source, origin_page, autocalls_user_id, phone, matched_callback_id. Remplissage : pré-inscription sur /essai-gratuit (e-mail + case marketing + locale de la page, ligne origin=register_click) avant la redirection vers app.permanenceia.com/register, puis rapprochement par e-mail au webhook signup ; sinon ?lang=&utm_ ajoutés à REGISTER_URL si Autocalls les relaie ; sinon preferred_locales ou pays du client Stripe ; sinon locale_source=unknown (I1 bilingue FR/EN, aucune étape marketing).
- Nouvelle table contacts (une ligne par e-mail en minuscules, clé email_key HMAC déjà utilisée par emailPrefs) : first_name, company, sector (slug), phone_e164, locale, locale_source, locale_needs_review, country, origin (callback|demo|agent_lead|trial_request|contact|signup), origin_page, utm_*, first_seen_at, last_interaction_at, stage (prospect|signed_up|trialing|trial_cancelled|paying|payg), stage_source (stripe|white_label|manual), autocalls_user_id, stripe_customer_id, trial_end, plan_slug, minutes_flag_exhausted, is_test, stop_reason.
- Nouvelle table consents (journal en ajout seul, preuve RGPD art. 7) : email_key, channel (email|whatsapp|phone), purpose (marketing|account_alerts), granted, legal_basis (consent|b2b_legit_interest|soft_opt_in|contract), text_version, locale, source (formulaire + page, ou outil d’agent + identifiant de l’appel), ip_hash, created_at. La désinscription existante (call_events kind=email_pref, src/lib/emailPrefs.ts) et l’opposition téléphonique (kind=optout) sont lues comme des refus : une seule liste pour tous les canaux.
- Formulaires du site (CallbackForm, /essai-gratuit, démo en direct, bloc compact des fiches secteur) : nouvelle case NON cochée, séparée de l’accord de rappel. Texte FR proposé : « J’accepte de recevoir par e-mail des conseils et offres de Permanence IA : quelques e-mails les premières semaines, puis un par mois au plus. Désinscription en un clic dans chaque e-mail. » Pour fr, en-gb, en-au : mention d’information versionnée sous le champ e-mail, visible même case non cochée. Seconde case facultative « Recevoir aussi ces informations sur WhatsApp » (accord marketing WhatsApp, distinct du marqueur [WA:xx] qui ne couvre que confirmations et alertes). Textes à valider par un avocat dans les 6 langues.
- Démo en direct et bloc compact des fiches secteur : ajouter un champ e-mail facultatif (sans lui, aucune relance e-mail possible). CallbackForm : envoyer l’entreprise dans le champ company (aujourd’hui dans la note, src/components/ui.tsx l.215).
- Outils d’agents Autocalls enregistrer_fiche_prospect (6224) et outils de rappel (6176, 6178, 6240) : langue en liste fermée fr|en-gb|en-au|it|pl|nl|he et nouveau paramètre marketing_email_consent, rempli seulement après une question explicite de l’agent ; enregistré dans consents avec l’identifiant de l’appel.
- Statut d’essai et d’abonnement : webhook Stripe du compte Permanence IA (acct_1UNBLcBjFUxnZPfW) vers /api/webhooks/stripe (customer.subscription.created/updated/deleted, customer.subscription.trial_will_end, invoice.paid), rapproché par e-mail, qui remplit contacts.stage, trial_end, plan_slug, stripe_customer_id (les tables réservées subscriptions et trials peuvent servir de stockage). Instantané quotidien de /white-label/users dans platform_user_snapshots (user_id, date, minutes_balance, credits_balance) pour C2, C4 et U.
- Nouvelle table relance_state : email_key, sequence (P|I|C|F|U|M), step, entered_at, next_due_at, status (active|done|stopped), stop_reason. Un contact n’est que dans une séquence à la fois (priorité C > F > U > I > P) ; changer d’étape de vie clôt la séquence précédente.
- Nouvelle table relance_log : email_key, sequence, step, channel, argument_key, template_version, locale, legal_basis, category (essential|marketing), dry_run, status (queued|sent|skipped|failed), skip_reason, provider_message_id, created_at, sent_at ; contrainte UNIQUE (email_key, sequence, step) pour l’idempotence.
- Textes : un fichier par langue src/i18n/content/<langue>/ui/relances.ts (même structure que email.ts) avec objet, corps, variantes {source_line} et {cta_line}. Prix, minutes, 3,99 $, 0,39 $ et durée d’essai lus dans src/i18n/markets.ts au moment de l’envoi, jamais écrits en dur. {sector}, {sector_problem}, {sector_handles} repris de src/i18n/content/<langue>/sectors.ts ; secteurs en pause : version générique. Valeurs par défaut : « Bonjour, », « votre entreprise ». he : objet marketing préfixé « פרסומת », texte RTL (déjà géré par prepareMail).
- Réponses : lecture IMAP en lecture seule de contact@permanenceia.com à chaque passage ; un message reçu d’une adresse en séquence (ou portant In-Reply-To d’une relance) pose stop_reason=replied et prévient l’équipe (NOTIFY_TO). Lien « Stop relances » dans l’alerte interne pour que l’équipe arrête une séquence à la main.

## Fonctionnement

 Une route protégée POST /api/cron/relances sur le backend voiceia, appelée toutes les heures (« 0 * * * * », UTC) par Google Cloud Scheduler (projet snarecore-cacrs, région us-east4 ; API déjà activée, aucune tâche existante). Authentification par jeton OIDC d’un compte de service dédié relances-cron sans aucun rôle (à défaut : en-tête x-cron-token comparé au secret CRON_SECRET avec timingSafeEqual). Secours sans Google Cloud : une automatisation Autocalls planifiée qui appelle seulement la route ; Autocalls n’envoie jamais lui-même ces e-mails.

À chaque passage :
1. Interrupteur : RELANCES_ENABLED (variable App Hosting) ET relance_settings.enabled en base (coupure sans redéploiement) ; RELANCES_LOCALES limite les marchés ouverts (au départ « fr,en-gb,en-au »). Si coupé : journal « disabled » et sortie.
2. Mode test : RELANCES_DRY_RUN=1 par défaut ; tout est calculé et journalisé (relance_log.dry_run=true), rien ne part au client ; récapitulatif quotidien avec 3 exemples rendus envoyé à NOTIFY_TO. Au moins une semaine de relecture avant d’ouvrir un marché.
3. Synchronisation : une fois par jour, instantané de /white-label/users ; à chaque passage, nouveaux callbacks et signups, événements Stripe, désinscriptions (email_pref), oppositions (optout), réponses IMAP ; mise à jour de contacts.stage et de stop_reason.
4. Sélection : next_due_at échu ET heure locale entre 9 h et 11 h (fuseau du marché : Europe/Paris, Europe/London, Australia/Sydney, Europe/Rome, Europe/Warsaw, Europe/Amsterdam, Asia/Jerusalem), lundi–vendredi, dimanche–jeudi pour he, jamais les jours fériés nationaux (liste fixe). Messages de service (I1, C1, C4, C5, F1, U1) : dans l’heure, entre 8 h et 20 h locales.
5. Filtres, chacun journalisé (skipped + skip_reason) : is_test ; secteur en pause ; numéro +1 ; langue non établie ; base légale absente pour le marché et la catégorie ; désinscription (seuls les messages essentiels passent ; C2 et C3 sautés) ; opposition sur n’importe quel canal ; réponse reçue ; rebond ou plainte ; séquence plus avancée en cours ; changement d’étape de vie revérifié juste avant l’envoi ; pression : au plus 1 e-mail marketing tous les 3 jours et 2 par semaine par contact, toutes séquences confondues ; jamais deux messages le même jour ; variable obligatoire manquante ({trial_end_date}, {plan_name}, {plan_price} : seulement depuis Stripe) → étape sautée, jamais de valeur inventée.
6. Idempotence : insertion relance_log (email_key, sequence, step) en « queued » via dbInsertIfNew AVANT l’envoi ; passage à « sent » seulement après le succès de sendMail ; échec → nouvelle tentative au passage suivant, 2 fois au plus, puis « failed » signalé.
7. Envoi : uniquement par sendMail (src/lib/server.ts), qui ajoute déjà le pied de page légal traduit (SINAY STRATEGIC LLC, adresse de Cheyenne, préférences, désinscription, CGU | Confidentialité), la version HTML, les en-têtes List-Unsubscribe et List-Unsubscribe-Post (RFC 8058) et saute tout e-mail « marketing » vers une adresse désinscrite. Paramètres : category « marketing » ou « essential », locale du contact, fromName = marque du marché (Permanence IA / PermanenceIA / PermanenceAI), Reply-To contact@permanenceia.com (jamais no-reply). Aucun pixel d’ouverture (consentement distinct exigé en Italie) ; liens sans raccourcisseur, UTM génériques non personnels. WhatsApp : seulement les modèles approuvés de l’expéditeur 521, mêmes file et arrêts, accord WhatsApp marketing exigé tant que Meta classe ces modèles en MARKETING.
8. Débit : 20 e-mails au plus par passage, 3 s entre deux envois, 150 par jour au plus tant que l’envoi passe par Zoho (50 à 500/h dynamique, envois groupés interdits) ; montée progressive 20/jour la 1re semaine, 50 la 2e ; attempt-deadline 300 s. Disjoncteur : arrêt automatique et alerte au-delà de 5 % de rebonds ou dès une plainte sur la journée ; arrêt de la séquence P si la lecture IMAP échoue.
9. Rapport quotidien à 8 h (Paris) à NOTIFY_TO : envois par séquence, étape et langue ; refus par motif ; contacts dont la langue est à valider ; réponses ; erreurs.
10. Ajouté le 9 oct. 2026 : résumé hebdomadaire à NOTIFY_TO, le lundi au premier passage à partir de 8 h (Paris), après les relances et même quand elles sont coupées ou en mode test (src/lib/relances/weekly.ts). Semaine écoulée du lundi au dimanche, semaine précédente entre parenthèses : inscriptions, essais démarrés, paiements reçus (nombre, total par devise) et échoués, appels et conversations (par agent), demandes de rappel (créées, faites, en attente, annulées), oppositions « ne plus appeler », copies de conversation envoyées. Envoi unique : ligne call_events kind resume_hebdo ; 3 essais au plus si l’e-mail échoue. Une table illisible donne « donnée indisponible » dans sa section, sans bloquer le reste.
11. Ajouté le 9 oct. 2026 : alertes de paiement par le webhook Stripe (src/lib/relances/payments.ts). « Paiement échoué » à chaque tentative (invoice.payment_failed : client, montant, tentative, prochaine tentative, liens facture et tableau de bord) ; une seule alerte « impayé définitif » par facture (dernière tentative, abonnement « unpaid » ou résilié après impayé) ; pas d’alerte au passage en past_due, qui arrive avec le premier échec. Verrou : ligne stripe_events « alerte:… » posée avant l’envoi ; un e-mail en échec est journalisé et la réponse reste 200. Paiements reçus et échoués journalisés dans call_events (kind stripe_paiement) pour le résumé. Le webhook doit être abonné à invoice.payment_failed (voir « Ce qui dépend de vous »). Tests : `npx tsx scripts/test-alertes-equipe.ts`.

Ordre de lancement : phase 1 = P (fr, en-gb, en-au) + I1 ; phase 2, après le webhook Stripe = C, F puis I2-I7 ; phase 3 = U et M ; it, pl, nl, he seulement quand la nouvelle case a recueilli des accords.

## Ce qui dépend de vous

- Réparer DKIM avant tout envoi : un seul enregistrement zmail._domainkey (deux clés différentes sont publiées aujourd’hui dans Cloudflare), celui qui correspond à la clé active dans Zoho Admin > Domains > DKIM, puis Verify. Plus tard : DMARC en p=quarantine.
- Fournir une clé Stripe restreinte en lecture (customers, subscriptions, invoices) du compte Permanence IA acct_1UNBLcBjFUxnZPfW et créer le webhook Stripe vers /api/webhooks/stripe. Sans cela, les séquences I (au-delà de I1), C, F et U ne peuvent pas partir de façon fiable.
- Ajouter l’événement invoice.payment_failed au webhook « permanenceia-site-relances » (Stripe > Développeurs > Webhooks > Modifier les événements). Créé le 8 oct. avec 9 événements, il ne le reçoit pas : sans lui, ni alerte « paiement échoué » ni paiements échoués dans le résumé hebdomadaire.
- Faire valider par un avocat : les textes de la case de consentement et de la mention d’information dans les 6 langues ; le statut de l’essai gratuit avec carte (UK, AU, IL) ; le préfixe « פרסומת » ; les adresses génériques en Pologne ; la désignation d’un représentant UE et UK (art. 27 RGPD), conseillée avant toute prospection e-mail.
- Approuver la copie française des 36 messages, puis les traductions (en-gb, en-au, it, pl, nl, he) relues par un natif ; confirmer que les versions anglaises et hébraïques ne citent pas le règlement européen sur l’IA, et que l’assistante d’aide de l’espace client parle hébreu (sinon I1 he dit « en anglais »).
- Accepter l’engagement des étapes I3 et F6 : quelqu’un de l’équipe lit les réponses à contact@ et rappelle au créneau proposé ; sinon ces étapes renvoient seulement vers le formulaire d’accompagnement (rappel par l’assistante IA).
- Décider de l’ouverture par marché : fr, en-gb et en-au en dry-run une semaine, puis ouverture ; it, pl, nl, he seulement après la mise en ligne de la case de consentement. Confirmer qu’aucune relance commerciale ne part vers les contacts collectés avant la case (seulement les messages de service).
- Créer le compte de service relances-cron (ou le secret CRON_SECRET avec grantaccess au backend voiceia et ajout dans apphosting.yaml), puis la tâche Cloud Scheduler horaire une fois la route déployée, et la lancer une fois à la main en dry-run.
- Demander à Autocalls si la page d’inscription peut afficher une case de consentement, ou relayer ?lang= et les UTM dans le webhook User Signup.
- Corriger le prix du numéro « dès 5,99 $ » en 3,99 $ dans l’e-mail de bienvenue Autocalls (FR et EN), dans docs/presentation/presentation-fr.html (l.432 et l.455) et docs/presentation/presentation-he.html (l.449 et l.472) ; ajouter le pied de page légal à l’e-mail de bienvenue (règle email-footer-rule). Cet e-mail reste en français et anglais seulement.
- Modèles WhatsApp : demander le réexamen par Meta de pia_trial_started, pia_trial_ending et pia_minutes_low (reclassés MARKETING ; date limite le 7 déc. 2026) ou créer des versions purement factuelles ; vérifier que pia_trial_started ne part qu’au début réel de l’essai.
- Si possible, régler la langue des e-mails Stripe par client (preferred_locales) pour éviter le doublon français/anglais avec C5.
- Au-delà d’environ 50 relances par jour : choisir un prestataire d’envoi marketing (Brevo ou Resend sur un sous-domaine dédié, ou comptes POSTMARK / SENDGRID du projet s’ils sont utilisables pour permanenceia.com), toujours derrière sendMail ; jamais ZeptoMail (transactionnel seulement).
- Remplacer le WEBHOOK_TOKEN passé en clair dans l’URL ?token= des 7 outils Autocalls par un en-tête, ou par un jeton dédié par outil.

## Risques et garde-fous

- Arbitrage des deux conceptions (sur 5 : légal / conversion / cohérence / risque de mise en œuvre). Conception 1 : 3,5 / 4 / 3,5 / 3. Points forts : arguments variés (agenda, multilingue, objection humaine, clôture « plus tard / non »). Points faibles : « nouveauté du mois » invérifiable, E et F trop dépendants d’estimations, URL Billing non confirmée. Conception 2 : 4,5 / 4 / 4,5 / 3,5. Points forts : journal des consentements, langue jamais devinée sur les indicatifs ambigus, I bloqué sans Stripe, suivi mensuel tiré des guides publiés. Points faibles : cite « Lucie », absente du site, et un détail de recharge automatique non vérifié. La conception finale prend la structure et la rigueur de la seconde, et reprend de la première l’espace en anglais avec assistante dans sa langue, le paiement à l’usage comme passerelle après l’essai, le renvoi des seuls appels manqués et la clôture qui demande une réponse.
- Faits vérifiés le 8 oct. dans offers.ts, faq.ts et markets.ts : 14 jours et 30 minutes, carte sans débit, démarrage au choix du forfait ; arrêt des appels à 30 minutes ; démarrage automatique du forfait sans annulation ; prix 99/249/499 $ HT pour 350/1 000/2 300 min ; 0,39 $ HT à l’usage, crédit sans expiration, fonctions de Réceptionniste ; 3,99 $ HT ; 2 mois offerts en annuel (990/2 490/4 990 $) ; Réceptionniste sans crédits de messages ; voix clonée à partir d’Assistant ; transfert inclus, décompté des minutes ; /tarifs (calculateur), /aide, /demo, /preferences-email et app.permanenceia.com/billing existent. Tout changement de ces valeurs doit passer par markets.ts, sinon une relance contredira le site, comme les 5,99 $ restés dans l’e-mail de bienvenue et les présentations.
- Étape de vie inconnue sans Stripe : minutes_balance = 0 ne distingue pas « essai pas démarré » de « minutes épuisées ». Envoyer « démarrez votre essai » à un client en essai, ou « votre essai se termine » à tort, détruirait la confiance. Mesure : I2-I7, C, F et U bloqués tant que le webhook Stripe n’est pas branché.
- Base légale : aucun contact actuel n’a coché de case marketing, et la mention d’information manquait aussi à la collecte. Sans envoi rétroactif, la séquence ne touchera au départ que les nouveaux contacts FR, UK et AU. Exposition en cas d’erreur : action jusqu’à 1 000 ₪ par message en Israël avec responsabilité des dirigeants, amende UKE jusqu’à 3 % du chiffre d’affaires en Pologne, amendes PECR alignées sur le UK GDPR depuis février 2026.
- Glissement des messages de service vers la vente : un argument commercial dans C1-C5, I1, F1 ou U1 les transforme en prospection soumise au consentement. Relire chaque modification de ces étapes.
- Langue : elle est aujourd’hui perdue pour les formulaires standards, la fiche d’agent en « en » n’est pas relue, et la démo envoie la langue de démo. Tant que la colonne locale n’existe pas, beaucoup de contacts seront sautés. C’est voulu : mieux vaut ne rien envoyer qu’écrire dans la mauvaise langue.
- Rapprochement par e-mail seulement : une personne inscrite avec une autre adresse que celle du formulaire continuera de recevoir la série P. Filets de sécurité : la pré-inscription sur /essai-gratuit, l’arrêt à la moindre réponse, puis un rapprochement par téléphone quand signups.phone existera.
- Délivrabilité : DKIM en double, DMARC en p=none, et Zoho interdit les envois groupés. Un blocage toucherait aussi les codes de vérification et les alertes, qui partent de la même boîte. Plafonds, montée progressive et disjoncteur sont indispensables.
- Doublons pendant l’essai : Stripe (rappel à J-7, en anglais) et Autocalls (e-mails système en anglais, non modifiables) écrivent déjà au client. C’est pour cela que C5 est placé à J-3 et dit la même chose que Stripe, dans la langue du client.
- Réponses non détectées si la lecture IMAP échoue : quelqu’un qui a répondu « non » recevrait l’étape suivante. Mesure : alerte et suspension de la séquence P en cas d’échec IMAP, plus le lien « Stop relances » pour l’équipe.
- WhatsApp : les modèles reclassés MARKETING par Meta, envoyés avec le seul accord [WA:xx], exposent le numéro 521 à des signalements et à une baisse de qualité. Un seul modèle commercial existe (pia_demo_followup) : la démo sans e-mail n’a donc droit qu’à un message.
- Secteurs santé en pause : ils sont exclus des relances. Les réactiver dans PAUSED_SECTORS sans revoir {sector_problem} pourrait promouvoir un usage non validé (hébergement des données de santé).
- Le dépôt GitHub est public : modèles et logique peuvent y être, mais jamais de liste de contacts, d’export ni de journal d’envoi.

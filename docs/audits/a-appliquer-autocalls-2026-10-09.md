# À appliquer dans Autocalls (suite de l’audit du 9 octobre 2026)

**Pour qui :** le propriétaire, ou Claude dans une session qui a accès au compte Autocalls.

**Pourquoi ce fichier :** les corrections du dépôt (site, e-mails, alertes) ne modifient jamais les agents Autocalls. Quand une correction dépend d’un agent, le texte exact à appliquer est écrit ici. Rien n’a encore été modifié dans Autocalls.

**Dépôt public :** ce fichier ne contient ni numéro personnel, ni secret.

## Lot B — Série « A » mise en route (actions 6, 7 et 13 ; § 7 de l’audit)

### 1. Agents de rappel : un client déjà en essai ou abonné qui demande de l’aide

**Pourquoi :** les e-mails A2, A3 et le suivi mensuel de la série A (client en essai ou abonné sans agent, ou sans appel) ont un bouton « Être rappelé pour configurer ensemble ». Depuis la relecture du 9 octobre, il ouvre le formulaire du **support** de /contact (onglet ouvert par `?type=support`, case d’accord de rappel) : ce sont les agents de rappel du support qui rappellent, comme le prévoyait le § 6 de l’audit. Mais un client peut encore arriver par le formulaire « Accompagnement essai » de /essai-gratuit (type « commercial », agent « Accompagnement essai ») : ce sont alors les agents de rappel **commercial** qui rappellent. Sans consigne, ils risquent de proposer de « démarrer l’essai » ou de changer de forfait à un client qui est déjà en essai ou qui paie. Or changer de forfait pendant l’essai peut déclencher un débit immédiat. Enfin, aucun numéro de téléphone n’est inclus dans le forfait (FAQ, guide « Obtenir un numéro ») : l’agent doit le dire au moment de relier un numéro.

**Agents (même paragraphe pour les deux familles, dans la langue du prompt) :**

| Langue | Rappels commerciaux | Rappel support |
|---|---|---|
| Français | 21182, 21270 | 21183 |
| Anglais (Royaume-Uni) | 21231, 21272 | 21236 |
| Anglais (Australie) | 21232, 21274 | 21237 |
| Italien | 21233, 21276 | 21238 |
| Polonais | 21234, 21278 | 21239 |
| Néerlandais | 21235, 21280 | 21240 |
| Hébreu | 21308, 21309 | 21310 |

**Champ :** consignes (system prompt).

**Avant :** pas de consigne pour ce cas (le reste du prompt ne change pas). Pour les agents du support, la mise en service peut déjà être décrite : n’ajouter que ce qui manque, en particulier la phrase sur le numéro (aucun numéro inclus).

**Après :**
- agents de rappel commercial : ajouter le paragraphe ci-dessous à la fin de la partie qui traite les demandes « Accompagnement essai » ;
- agents de rappel du support : ajouter le même paragraphe à la fin de la partie qui traite la configuration de l’espace client (sinon, à la fin des consignes).

Français (21182, 21270, 21183) :

> Si la personne dit qu’elle a déjà un compte, qu’elle est déjà en essai ou qu’elle a déjà un abonnement, ne lui propose ni de démarrer l’essai ni de changer de forfait. Aide-la à mettre son agent en service, étape par étape : dans « Assistants », « Create » à partir d’un modèle, puis ses consignes (horaires, services, ce qu’il doit noter), puis un numéro relié (« General », « Phone number ») ; aucun numéro n’est inclus dans le forfait : si elle n’en a pas encore, elle l’obtient dans « Get new phone number » (option payée au mois, prix affiché avant l’achat). Ensuite, un appel de test depuis son portable et le renvoi d’appel chez son opérateur. Si le problème est technique ou concerne sa facture, crée un ticket de support.

Anglais (21231, 21272, 21236 ; 21232, 21274, 21237) :

> If the person says they already have an account, are already on a trial or already have a subscription, do not offer to start the trial or to change plan. Help them get their agent working, step by step: in “Assistants”, “Create” from a template, then its instructions (opening hours, services, what it should note down), then a linked phone number (“General”, “Phone number”); no phone number is included in the plan: if they don’t have one yet, they get one under “Get new phone number” (a paid monthly option, price shown before purchase). Then a test call from their mobile and call forwarding with their phone provider. If the problem is technical or about their invoice, create a support ticket.

Italien (21233, 21276, 21238) :

> Se la persona dice di avere già un account, di essere già in prova o di avere già un abbonamento, non proporle né di avviare la prova né di cambiare piano. Aiutala a mettere in funzione il suo agente, passo dopo passo: in “Assistants”, “Create” partendo da un modello, poi le istruzioni (orari, servizi, cosa deve annotare), poi un numero collegato (“General”, “Phone number”); nessun numero è incluso nel piano: se non ne ha ancora uno, lo ottiene da “Get new phone number” (opzione a pagamento mensile, prezzo indicato prima dell’acquisto). Poi una chiamata di prova dal cellulare e la deviazione di chiamata presso il suo operatore. Se il problema è tecnico o riguarda la fattura, crea un ticket di assistenza.

Polonais (21234, 21278, 21239) :

> Jeśli rozmówca mówi, że ma już konto, jest już w okresie próbnym albo ma już subskrypcję, nie proponuj mu rozpoczęcia okresu próbnego ani zmiany pakietu. Pomóż mu krok po kroku uruchomić agenta: w „Assistants” opcja „Create” z szablonu, potem instrukcje (godziny, usługi, co agent ma notować), potem przypisany numer („General”, „Phone number”); numer nie jest wliczony w pakiet: jeśli rozmówca go jeszcze nie ma, uzyska go w „Get new phone number” (opcja płatna co miesiąc, cena widoczna przed zakupem). Następnie połączenie testowe z komórki i przekierowanie połączeń u operatora. Jeśli problem jest techniczny albo dotyczy faktury, utwórz zgłoszenie do pomocy technicznej.

Néerlandais (21235, 21280, 21240) :

> Zegt de persoon dat hij of zij al een account heeft, al in de proefperiode zit of al een abonnement heeft, stel dan niet voor om de proefperiode te starten of van abonnement te wisselen. Help de persoon de agent stap voor stap in gebruik te nemen: in „Assistants” via „Create” vanuit een sjabloon, dan de instructies (openingstijden, diensten, wat de agent moet noteren), dan een gekoppeld nummer („General”, „Phone number”); er zit geen nummer in het abonnement: heeft de persoon er nog geen, dan vraagt hij of zij er een aan via „Get new phone number” (maandelijks betaalde optie, prijs zichtbaar vóór aankoop). Daarna een testgesprek vanaf de mobiel en doorschakelen bij de provider. Gaat het om een technisch probleem of om de factuur, maak dan een supportticket aan.

Hébreu (21308, 21309, 21310 ; forme impersonnelle, comme le reste des consignes) :

> אם האדם אומר שכבר יש לו חשבון, שהוא כבר בתקופת ניסיון או שכבר יש לו מנוי, אין להציע לו להתחיל תקופת ניסיון או להחליף מסלול. יש לעזור לו להפעיל את הסוכן צעד אחר צעד: ב-"Assistants", "Create" מתוך תבנית, אחר כך ההנחיות (שעות פעילות, שירותים, מה הסוכן צריך לרשום), אחר כך מספר טלפון מחובר ("General", "Phone number"); מספר טלפון אינו כלול במסלול: אם עדיין אין לו מספר, אפשר להשיג אחד דרך "Get new phone number" (אפשרות בתשלום חודשי, המחיר מוצג לפני הרכישה). לאחר מכן שיחת בדיקה מהנייד והפניית שיחות אצל חברת הטלפון. אם הבעיה טכנית או קשורה לחשבונית, יש לפתוח פנייה לתמיכה.

**Relecture :** les versions italienne, polonaise, néerlandaise et hébraïque sont à faire relire par un natif avant l’enregistrement, comme les e-mails de la série A.

**Vérification après l’enregistrement :** chaque enregistrement relance le contrôle de conformité. Vérifier que `compliance_blocked_at` reste vide sur chaque agent modifié (docs/autocalls-pieges-interface.md).

**Autre solution (décision du propriétaire) :** faire envoyer vers les campagnes du support toute demande du formulaire de /essai-gratuit dont l’adresse a déjà un compte. Cela demande une modification du site (type « support » quand l’adresse a déjà un compte), et chaque demande ouvrirait un ticket. Les e-mails de la série A n’en dépendent plus : leur bouton mène déjà au formulaire du support.

## Lot C — Lucie, support, oppositions, ligne Israël (actions 12, 14, 15, 18, 19 et 34)

Ce que le site fait déjà, sans rien changer dans Autocalls (code de ce lot) :
- le dossier lu par Lucie (`/api/agent/account`, action `lookup`) contient le forfait (`plan` : statut, nom, mensuel ou annuel, fin d’essai, renouvellement, annulation prévue, fin d’abonnement, dernier paiement échoué) et une consigne `plan_status` qui ne propose plus jamais l’essai à un client déjà en essai, abonné ou ancien abonné ;
- un ticket de support reçoit une confirmation écrite (e-mail dans la langue du client, anglais si elle est inconnue ; en Australie, heure sur 12 h avec le fuseau) quand une adresse e-mail est donnée ; pas de seconde confirmation quand un agent de rappel du support reprogramme ou recrée la demande (outil appelé avec `aid` de 21183, 21236 à 21240 ou 21310) ; l’issue `resolu` d’un agent de rappel du support clôt les tickets ouverts de ce numéro ; les issues `non_resolu` et `a_rappeler` préviennent l’équipe (« À traiter ») ;
- « ne plus me contacter » sur Messenger, l’espace client et les widgets (écrits ou vocaux : une session vocale arrive en fin d’appel, sans numéro d’appelant) est appliqué à la fin de l’échange quand une demande de rappel a été enregistrée pour ce numéro pendant ce même échange : appel de l’outil de rappel lu dans la transcription, ou demande marquée `[CONV:<identifiant de l’échange>]` (voir point 3, champ 4). Une demande d’un autre échange, même récente, ne compte jamais. Sinon : alerte « À vérifier » à l’équipe ;
- un appelant signalé non client par l’outil de rappel (note qui commence par « לא לקוח – … », ou par `[NON_CLIENT]` dans une autre langue) n’est plus ni rappelé ni enregistré ; « non client » ou « not a customer » en français ou en anglais ne suffisent pas (souvent un prospect) ;
- une demande de rappel écrite est rappelée dans la langue de l’échange (champ `language` de l’outil) ;
- le contrôle juste avant l’appel compte ses limites par adresse IP **et** numéro quand le jeton manque.

Les points ci-dessous complètent ces corrections dans les agents. Chaque enregistrement d’un agent relance le contrôle de conformité : vérifier ensuite que `compliance_blocked_at` reste vide (docs/autocalls-pieges-interface.md), et revenir à la version précédente sinon.

### 1. Lucie (21205) : forfait du client et règle « 0 minute »

**Pourquoi :** le prompt dit « 0 minute = il faut ajouter du crédit ou démarrer l’essai d’un forfait », et la section « Compte sans minutes » ne propose que « Add credits » ou « Start 14-Day Free Trial ». Un client en essai ou abonné qui a épuisé ses minutes s’entend proposer l’essai ; changer de forfait pendant l’essai peut déclencher un débit immédiat.

**Agent :** 21205. Même paragraphe pour tout autre agent qui a l’outil du dossier client (`/api/agent/account`, action `lookup` ; à vérifier avec list-mid-call-tools).

**Champ :** consignes (system prompt).

**Avant :** la phrase « 0 minute = il faut ajouter du crédit ou démarrer l’essai d’un forfait », et la section « Compte sans minutes ».

**Après :** remplacer la phrase par le premier paragraphe, et le contenu de la section « Compte sans minutes » par le second.

> Forfait du client : après la lecture du dossier, fie-toi au champ plan_status et aux données plan (status, name, trial_end, renewal_date, cancel_at, payment_failed_at), jamais au seul solde de minutes. Un solde à 0 ne veut pas dire « sans forfait » : un client en essai ou abonné peut avoir épuisé ses minutes. Ne propose « Start 14-Day Free Trial » que si plan_status le permet (aucun abonnement trouvé, et la personne n’a jamais fait d’essai). Pendant l’essai, déconseille de changer de forfait : cela peut déclencher un débit immédiat. Si plan_status signale un paiement en retard, oriente vers Billing info pour mettre à jour la carte. Si le forfait est inconnu (lecture indisponible), demande à la personne ce qu’affiche Billing info, ou crée un ticket.

> Compte sans minutes : regarde d’abord plan_status. Essai en cours : les minutes d’essai sont épuisées, l’essai continue jusqu’à sa date de fin ; la personne peut ajouter des minutes dans « Add credits » si elle le souhaite. Abonné : les minutes reviennent au renouvellement (renewal_date), ou plus tôt avec « Add credits ». Abonnement résilié : choisir un forfait payant avec « Choose a plan » (ou « Change plan ») ; pas de nouvel essai gratuit (un seul essai par entreprise ou moyen de paiement, selon les conditions générales). Aucun abonnement et jamais d’essai : « Choose a plan » (en haut à gauche ; « Change plan » si un forfait apparaît déjà), puis « Start 14-Day Free Trial ».

### 2. Tickets : issues et adresse de confirmation

**Agents de rappel du support** (21183, 21236, 21237, 21238, 21239, 21240, 21310), champ consignes, à la fin de la partie qui décrit les issues (même sens dans chaque langue) :

- Français (21183) :
  > Choisis l’issue « resolu » seulement si le problème du ticket est réglé pendant l’appel : le site clôt alors le ticket. Sinon, choisis « a_rappeler » ou crée un nouveau ticket.
- Anglais (21236, 21237) :
  > Choose the outcome “resolu” only if the ticket’s problem is solved during the call: the website then closes the ticket. Otherwise, choose “a_rappeler” or create a new ticket.
- Italien (21238) :
  > Scegli l’esito “resolu” solo se il problema del ticket viene risolto durante la chiamata: il sito chiude allora il ticket. Altrimenti scegli “a_rappeler” o crea un nuovo ticket.
- Polonais (21239) :
  > Wybierz wynik „resolu” tylko wtedy, gdy problem ze zgłoszenia zostanie rozwiązany w trakcie rozmowy: strona zamyka wtedy zgłoszenie. W przeciwnym razie wybierz „a_rappeler” albo utwórz nowe zgłoszenie.
- Néerlandais (21240) :
  > Kies de uitkomst „resolu” alleen als het probleem van het ticket tijdens het gesprek is opgelost: de website sluit het ticket dan. Kies anders „a_rappeler” of maak een nieuw ticket aan.
- Hébreu (21310) :
  > יש לבחור בתוצאה "resolu" רק אם הבעיה שבפנייה נפתרה במהלך השיחה: במקרה כזה האתר סוגר את הפנייה. אחרת, יש לבחור "a_rappeler" או לפתוח פנייה חדשה.

**Ce que fait le site avec `a_rappeler` :** alerte « À traiter » à l’équipe (ajouté le 9 octobre après relecture : avant, cette issue n’était suivie de rien et le ticket restait ouvert sans que personne soit prévenu). Le ticket reste ouvert ; l’équipe décide de la suite.

**Avant de l’enregistrer :** vérifier que `resolu` et `a_rappeler` figurent bien dans les options de l’issue (post_call_schema → outcome) de ces 7 agents (`resolu` y est sur 21183). Ajouter `a_rappeler` s’il manque.

**Agents qui créent des tickets** (21205, 21297, 21376, 21314, et les outils 6177 et 6242 `creer_ticket_support`) : la confirmation écrite part seulement si l’outil reçoit une adresse e-mail. Ajouter aux consignes la phrase de la langue du prompt :

- Français (21205, 21297) :
  > Si la personne veut une confirmation écrite de son ticket, demande-lui son adresse e-mail, relis-la, et passe-la dans le champ email de l’outil : elle recevra un e-mail avec son numéro de ticket. Ne l’exige pas.
- Anglais (21376) :
  > If the person wants a written confirmation of their ticket, ask for their email address, read it back, and pass it in the tool’s email field: they will receive an email with their ticket number. Don’t insist.
- Hébreu (21314) :
  > אם הפונה רוצה אישור בכתב על הפנייה, יש לבקש את כתובת הדוא"ל, להקריא אותה לאישור ולהעביר אותה בשדה email של הכלי: יישלח לכתובת הזו מייל עם מספר הפנייה. אין להתעקש.

**21358 (WhatsApp) : ne pas modifier.** Il a été bloqué le 9 octobre par le contrôle de conformité pour une consigne du même type (demander une adresse e-mail, voir point 5). La confirmation part quand même si la personne donne d’elle-même son adresse et que l’agent la passe à l’outil.

Vérifier aussi que le champ `email` existe dans les paramètres de 6177 et 6242 (« Adresse e-mail donnée et confirmée par la personne, vide sinon »). Après chaque enregistrement, relire `compliance_blocked_at` (une consigne de collecte d’adresse peut déclencher le contrôle « data gathering ») et revenir à la version précédente si l’agent est bloqué.

**Lucie (21205)** : aucune modification nécessaire pour `non_resolu` (l’équipe est prévenue). Vérifier seulement que cette issue figure toujours dans son post_call_schema.

### 3. « Ne plus me contacter » sur les canaux écrits et les widgets (21297, 21205, 14 widgets)

**Pourquoi :** l’outil 6244 (`ne_plus_appeler_numero`) n’a pas de jeton, volontairement (un visiteur pourrait faire bloquer le numéro d’un autre). Le site applique désormais l’opposition à la fin de l’échange, à condition qu’une demande de rappel ait été enregistrée pour ce numéro pendant le même échange. L’échange doit porter l’issue et le numéro (champs 1 et 2). Pour que le site reconnaisse la demande de rappel quand la transcription ne contient pas l’appel de l’outil de rappel (ou quand le numéro est écrit sans indicatif), l’outil de rappel doit aussi transmettre l’identifiant de l’échange (champ 4).

**Agents :** 21297 (Messenger), 21205 (espace client) et les 14 widgets (21203, 21206 à 21210, 21269, 21271, 21273, 21275, 21277, 21279, 21306, 21307).

**Champ 1 : post_call_schema → outcome.** Avant (21297) : `essai_gratuit, rappel_commercial, ticket_support, renvoi_espace_client, information, pas_interesse`. Après : ajouter `ne_plus_appeler` et `desinscription`. Pour 21205 et les widgets, ajouter les deux valeurs si elles manquent.

**Champ 2 : post_call_schema → nouvelle variable `optout_phone`** (texte), description :

> Numéro de téléphone, au format international (+ et indicatif), que la personne a demandé de ne plus appeler pendant l’échange. Vide sinon.

**Champ 3 : consignes**, à la fin de la partie « ne plus appeler », dans la langue du prompt :

- Français (21297, 21205, 21203, 21269) :
  > Si la personne ne veut plus être contactée : appelle ne_plus_appeler_numero avec le numéro qu’elle a donné (format international), confirme-lui que c’est noté, sans insister. Termine avec l’issue « ne_plus_appeler » ; si elle refuse aussi les e-mails, l’issue est « desinscription ».
- Anglais (21206, 21271, 21207, 21273) :
  > If the person no longer wants to be contacted: call ne_plus_appeler_numero with the number they gave (international format) and confirm it has been noted, without insisting. End with the outcome “ne_plus_appeler”; if they also refuse emails, the outcome is “desinscription”.
- Italien (21208, 21275) :
  > Se la persona non vuole più essere contattata: chiama ne_plus_appeler_numero con il numero che ha indicato (formato internazionale) e confermale che la richiesta è stata registrata, senza insistere. Chiudi con l’esito “ne_plus_appeler”; se rifiuta anche le email, l’esito è “desinscription”.
- Polonais (21209, 21277) :
  > Jeśli rozmówca nie chce, żeby się z nim dalej kontaktować: wywołaj ne_plus_appeler_numero z numerem, który podał (w formacie międzynarodowym), i potwierdź bez nalegania, że prośba została zapisana. Zakończ z wynikiem „ne_plus_appeler”; jeśli nie chce też otrzymywać e-maili, wynikiem jest „desinscription”.
- Néerlandais (21210, 21279) :
  > Wil de persoon niet meer benaderd worden: roep ne_plus_appeler_numero aan met het opgegeven nummer (internationaal formaat) en bevestig dat het is genoteerd, zonder aan te dringen. Sluit af met de uitkomst „ne_plus_appeler”; weigert de persoon ook e-mails, dan is de uitkomst „desinscription”.
- Hébreu (21306, 21307 ; forme impersonnelle) :
  > אם הפונה מבקש שלא ייצרו איתו קשר יותר: יש להפעיל את ne_plus_appeler_numero עם המספר שמסר (בפורמט בינלאומי) ולאשר שהבקשה נרשמה, בלי להתעקש. יש לסיים עם התוצאה "ne_plus_appeler"; אם הוא מסרב גם למיילים, התוצאה היא "desinscription".

**Relecture :** versions italienne, polonaise, néerlandaise et hébraïque à faire relire par un natif avant l’enregistrement.

**Champ 4 (à vérifier d’abord) : identifiant de l’échange dans les outils de rappel** de ces agents (6176, 6178, 6240, 6246, 6247, 6248 et l’outil de rappel de l’espace client ; liste exacte avec list-mid-call-tools). Le site accepte un champ `conversation_id` (ou `call_id`) dans le corps de la demande : il le note sur la demande (`[CONV:<identifiant>]`), ce qui permet de reconnaître à la fin du même échange un numéro écrit sans indicatif, ou un appel d’outil absent de la transcription. Ce champ n’est utile que si Autocalls peut le remplir lui-même avec l’identifiant que renvoie le webhook de fin d’échange (`conversation_id` d’une conversation, `id` d’un appel), comme `{{customer_phone}}` dans l’outil 6243. Vérifier dans la documentation ou auprès du support qu’une telle variable existe ; si oui, ajouter un champ fixe `conversation_id` avec cette variable. Sinon, ne rien changer : le site s’appuie sur l’appel d’outil visible dans la transcription (une valeur laissée en gabarit, `{{…}}`, est ignorée).

**Ce que fait le site ensuite :** rappels de ce numéro annulés, opposition enregistrée, numéro ajouté à la liste de blocage Autocalls, e-mail à l’équipe ; avec `desinscription` et une adresse dans la variable `email`, plus aucun e-mail commercial. Numéro jamais enregistré pendant ce même échange : rien n’est appliqué, l’équipe reçoit « À vérifier : ne plus me contacter par écrit » (une fois par échange et par numéro). Les widgets vocaux sont couverts aussi (fin d’appel sans numéro d’appelant).

### 4. Ligne Israël (21314) : fournisseurs, presse, démarcheurs

**Pourquoi :** ces appelants sont enregistrés comme demandes de rappel (outil 6240, accord au rappel envoyé par l’outil), puis appelés par l’IA commerciale. La ligne UK (21376) leur donne l’adresse contact@. Le site refuse désormais ces demandes (note « לא לקוח – … ») : l’agent reçoit « Not a customer request… give them contact@permanenceia.com », mais la consigne doit cesser de les enregistrer.

**Champ :** consignes, section « שלב 1 ».

**Avant :**

> ספק, שותפות, עיתונות, הצעה מסחרית או טלמרקטינג → לקחת שם, חברה, מספר ונושא בקצרה, לרשום דרך register_callback_request עם ההערה "לא לקוח – [נושא]"

**Après :**

> ספק, שותפות, עיתונות, הצעה מסחרית או טלמרקטינג → להודות על הפנייה, להסביר שפניות מהסוג הזה מטופלות בכתב, ולאיית לאט את כתובת הדוא"ל contact@permanenceia.com. לא להציע שיחה חוזרת, לא להפעיל אף כלי ולא לרשום פרטים, ולסיים את השיחה בנימוס.

**Issue de l’appel :** `information` (ou une valeur `non_client` si elle est ajoutée au post_call_schema ; le site n’en fait rien de particulier).

**Relecture :** texte hébreu à faire relire par un natif. Contrôle de conformité à relancer après l’enregistrement.

### 5. Copie de l’échange sur les lignes téléphoniques (action 34)

**Pourquoi :** le site sait déjà envoyer la copie d’un appel (src/lib/conversationCopy.ts : prénom et langue de l’agent, une seule copie, plafonds). Seule la variable manque dans les agents vocaux.

**Agents :** 21376 (ligne UK), 21314 (ligne Israël), puis, si le contrôle de conformité l’accepte, les agents de rappel (21182, 21270, 21183, 21231 à 21240, 21272, 21274, 21276, 21278, 21280, 21308 à 21310). Pas WhatsApp (21358) : bloqué par le contrôle de conformité le 9 octobre.

**Champ 1 : post_call_schema → nouvelle variable `copy_email`**, description (docs/copie-conversation.md) :

> Adresse e-mail que la personne a donnée ET confirmée pendant l’échange pour recevoir une copie de la conversation. Laisser vide si elle n’a pas demandé de copie, l’a refusée, ou si l’adresse n’a pas été confirmée.

**Champ 2 : consignes**, une phrase, seulement en réponse à une demande de la personne (ne jamais la proposer d’office, pour ne pas déclencher le contrôle « data gathering ») :

- Anglais (21376, 21231, 21232, 21236, 21237, 21272, 21274) :
  > If the person asks for a written copy of this call, ask for their email address, read it back to confirm it, and fill in copy_email. Never offer it to someone who asked not to be contacted.
- Hébreu (21314, 21308, 21309, 21310) :
  > אם האדם מבקש עותק כתוב של השיחה, יש לבקש את כתובת הדוא"ל, להקריא אותה לאישור, ולמלא אותה ב-copy_email. אין להציע זאת למי שביקש שלא ייצרו איתו קשר.
- Français (21182, 21270, 21183) :
  > Si la personne demande une copie écrite de l’appel, demande son adresse e-mail, relis-la pour la confirmer, et remplis copy_email. Ne la propose jamais à quelqu’un qui a demandé à ne plus être contacté.
- Italien (21233, 21276, 21238) :
  > Se la persona chiede una copia scritta della chiamata, chiedile l’indirizzo email, rileggilo per conferma e compila copy_email. Non proporla mai a chi ha chiesto di non essere più contattato.
- Polonais (21234, 21278, 21239) :
  > Jeśli rozmówca poprosi o pisemną kopię rozmowy, poproś o adres e-mail, przeczytaj go na głos do potwierdzenia i wpisz w copy_email. Nigdy nie proponuj tego komuś, kto poprosił o zaprzestanie kontaktu.
- Néerlandais (21235, 21280, 21240) :
  > Vraagt de persoon om een schriftelijke kopie van het gesprek, vraag dan het e-mailadres, lees het ter bevestiging voor en vul copy_email in. Bied dit nooit aan iemand die heeft gevraagd niet meer benaderd te worden.

**Ordre conseillé :** 21376 d’abord, contrôle de conformité, appel de test avec demande de copie ; puis 21314 ; puis les agents de rappel, un par un.

### 6. Langue de l’échange écrit pour choisir le rappel (action 34)

**Ce que fait le site :** pour une demande d’un outil d’agent sans langue fixe (6176, 6177, et l’outil de rappel de l’espace client), la campagne suit désormais le champ `language` envoyé par l’agent (fr, en, en-gb, en-au, it, pl, nl, he ; « en » tranché par l’indicatif), puis l’indicatif.

**À vérifier dans Autocalls :** le paramètre `language` de ces outils est bien rempli par l’agent avec la langue de l’échange. Description proposée si elle manque :

> Langue de la conversation avec la personne : fr, en-gb, en-au, it, pl, nl ou he.

### 7. Jeton du contrôle juste avant l’appel (action 34)

**Pourquoi :** l’étape step_5 des 14 automatisations de rappel (7 marchés, commercial et support) appelle `GET https://www.permanenceia.com/api/callback/check` sans jeton. Le site compte maintenant ses limites par adresse IP et numéro (plus de plafond commun), mais la voie normale reste le jeton.

**Champ :** step_5 de chaque automatisation, en-têtes.

**Avant :** `{ "Accept": "application/json" }`.

**Après :** `{ "Accept": "application/json", "x-webhook-token": "<valeur actuelle du secret WEBHOOK_TOKEN>" }` (la valeur en vigueur après la migration décrite dans docs/autocalls-webhooks-migration.md ; jamais recopiée dans le dépôt).

**Vérification :** une exécution suivante montre une réponse 200 `{ "current": … }` à step_5 ; dans les journaux du site, `[auth] /api/callback/check mode=header ok=true`.

### 8. Base de connaissances : « un conseiller vous rappelle » (action 34, reste à faire)

**Pourquoi :** la règle « Qui rappelle » (docs/rappels-voix.md, R2 à R4 et R9) dit qu’une demande d’humain mène d’abord au responsable IA (commercial) ou à une personne de l’équipe (support), jamais à « un conseiller » sans précision. Les prompts priment, mais un agent peut citer la base.

**Où :** src/data/kb/fr.txt (lignes sur l’escalade et « parler à un humain »), src/data/kb/fr-situations.txt (E1 et E2), et les passages équivalents des autres langues (src/data/kb/en.txt et en-situations.txt : « a callback from an advisor », etc.).

**Texte proposé pour E2 (français) :**

> Ne pas insister. « Bien sûr. Je ne peux pas vous transférer en direct, mais je crée votre demande : l’assistant IA responsable du suivi des demandes vous rappelle, et il peut transmettre votre demande à une personne de l’équipe si vous le souhaitez. Quel moment vous convient ? » Pour une demande de support (facture, compte) : « une personne de l’équipe vous rappelle ». Recueillir le créneau, résumer en trois phrases, créer le ticket ou la demande de rappel.

Le responsable qui rappelle se présente toujours comme une IA (docs/rappels-voix.md, R2 et R3) : la base ne doit jamais laisser entendre qu’un humain rappellera, sauf pour le support. Même précision dans les autres langues, par exemple « the AI assistant in charge of following up requests » (anglais), « l’assistente IA responsabile del seguito delle richieste » (italien), « asystent AI odpowiedzialny za obsługę zgłoszeń » (polonais), « de AI-assistent die de opvolging van aanvragen verzorgt » (néerlandais), « עוזר ה-AI שאחראי על המעקב אחר הפניות » (hébreu), à valider avec chaque texte.

**Étapes :** modifier les fichiers du dépôt (toutes les langues), déployer, recréer les documents de la base un par un dans Autocalls à partir des adresses /kb/…, puis supprimer les anciens (docs/autocalls-kb-a-supprimer.md). Non fait dans ce lot : le texte de chaque langue est à valider avec la règle « Qui rappelle ».

## Lot D — Espace client : Google Analytics après accord (action 21)

### 1. Script « Google Analytics 4 » de l’espace client

**Pourquoi :** sur app.permanenceia.com (/register, /login et l’espace client), le bloc actuel charge gtag.js dans tous les cas, même sans accord ou après « Refuser » sur le site. Avec l’accord, il passe aussi les signaux publicitaires Google (ad_storage, ad_user_data, ad_personalization) à « granted ». C’est contraire à la page /cookies et au site, qui ne charge rien avant « Accepter » et refuse toujours ces signaux. Il envoie enfin l’adresse complète des pages, recherche et filtres des listes compris (?tableSearch=…), qui peuvent contenir l’e-mail ou le téléphone d’un contact d’un client.

**Où :** app.autocalls.ai → Administration → Settings → Custom Scripts, dans les deux champs qui contiennent l’ancien bloc : « Custom scripts » (espace client) et « Custom scripts (auth) » (/login et /register).

**Avant :** le bloc dont le commentaire commence par « Google Analytics 4 (G-4W1B1W52PZ) », de ce commentaire jusqu’à la fin de son script (ajout de googletagmanager.com/gtag/js compris).

**Après :** le contenu complet de docs/autocalls-scripts/ga-consentement-espace-client.html (une ligne de commentaire et le script ; les explications sont dans docs/autocalls-scripts/ga-consentement-espace-client.md, à ne pas coller), collé à la place, dans chacun des deux champs. Les autres scripts des deux champs (assistante, parcours d’essai) ne changent pas. Ce que contiennent ces champs est servi dans le code source des pages, /login et /register compris : ne jamais y coller de notes internes.

**Vérifier :** les quatre contrôles de la section « Vérifier » du .md (fenêtre de navigation privée, onglet Réseau, DebugView : page_location sans « ? » après une recherche dans une liste). Contrôle du texte dans le dépôt : `npx tsx scripts/test-ga-espace-client.ts`.

**Préalable sur le site (fait dans le dépôt le 9 octobre) :** la politique cookies et le bandeau disent, dans les 7 langues, que l’accord donné sur le site vaut aussi pour la mesure d’audience de l’espace client, et où modifier ce choix. À déployer avant ou en même temps que la pose du script.

**Pas dans ce lot :** le pixel Meta et les événements « essai démarré » et « abonnement payé » de l’espace client (action 23, avis de l’avocat d’abord). Jamais de pixel Meta sur /login ni /register.

### 2. Google Analytics : masquer les données dans les adresses (propriétaire)

**Pourquoi :** le script envoie des adresses sans paramètres, mais si les pages vues sur les changements d’historique du navigateur sont activées dans le flux (mesure améliorée, action 36 encore ouverte), gtag.js envoie lui-même d’autres pages vues, avec l’adresse complète.

**Où :** Google Analytics → Admin → Flux de données → flux Web → Configurer les paramètres de la balise → Masquer des données.

**Avant :** état à lire sur cette page (non visible depuis le dépôt).

**Après :** « E-mails » activé ; paramètres de requête activés, avec `tableSearch`, `tableFilters`, `search`, `q`, `email`, `phone`.

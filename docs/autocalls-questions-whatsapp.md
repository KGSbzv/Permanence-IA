# Questions à envoyer à Autocalls par WhatsApp (8 octobre 2026)

Messages 1 à 4 : envoyés le 8 octobre. Message 5 : suite à leurs réponses, à envoyer.

**Réponses d'Autocalls (8 octobre, deux envois).** Le détail de ce qui a été fait est dans docs/audits/rapport-final-2026-10-08.md, section 10.

| Question | Réponse d'Autocalls | Suite |
|---|---|---|
| 1. Notre solde à zéro | Un client créditeur continue d'utiliser le service. | Rien à faire. |
| 2. Numéros dédiés | Renouvelés chaque mois avec le même numéro. Réponse du 9 octobre : les 2,70 $ sont le coût du numéro, payé en entier à Autocalls (3,09 $ = premier mois au prorata du prix britannique de 3,99 $, moins 0,39 $ de frais Stripe). Pas de double facturation : les 3,99 $/mois sur notre compte correspondent à notre propre numéro +44 7367 090106. Le prix payé par le client n'est pas réglable. Pour garder une marge : acheter les numéros sur notre compte, les attribuer au client (Administration Panel > Data Migration, le client ne paie rien) et inclure le numéro dans le prix du forfait. 11806 : abonnement annulé 45 s après l'achat du 7 octobre, numéro libéré automatiquement au bout de 3 jours. | 11806 était un test : rien à faire. Prix et marge des numéros : décision du propriétaire (argent). |
| 3. Taxe au paiement | Taxe automatique active, paiements passés avec 0 de taxe. Autocalls la coupe pour notre plateforme ; à réactiver sur demande. | Décision du comptable. |
| 4. Champs du paiement, langue | Adresse de facturation déjà exigée sur les forfaits. Pas de téléphone. Le paiement suit la langue du navigateur ; factures et reçus : langue du client Stripe. | Langue posée automatiquement par notre webhook dès qu'une clé Stripe restreinte est fournie. |
| 5. Codes promo | Oui sur les forfaits (champ déjà présent), non sur les recharges. | Site aligné. |
| 6. Impayés | Pendant les relances Stripe, le client garde ses minutes restantes sans les fonctions du forfait. Choisir « Cancel the subscription » après le dernier essai : il passe aux limites du compte gratuit et garde les minutes achetées. Ne jamais créer d'abonnement ni de prix dans Stripe. | Réglage Stripe déjà sur « cancel the subscription » (vérifié). |
| 7. Moyens de paiement | Ceux activés dans Stripe sur les forfaits ; SEPA seulement sur des prix en EUR (la plateforme est en USD). Recharges et numéros : moyen enregistré. | SEPA inutile ; site aligné. |
| 8. Transferts | La durée du transfert est décomptée des minutes. | Déjà dans la FAQ. |
| 9. Coût par appel | Appels des clients au tarif du client. L'appel 9234492 : 0,102 $ à 0,09 $/min, plus 0,02 $ de ligne opérateur appliquée à tort à un appel web ; Autocalls recalcule. | Rien à faire. |
| 10. Essai | Abonnement Stripe avec date de fin d'essai, carte prise à l'inscription, débit automatique à la fin ; en cas d'échec, compte gratuit. Passer à un forfait pendant l'essai le démarre aussitôt et garde les minutes d'essai. 28790 n'a pas d'essai : 51,28 min = recharge de 20 $ à 0,39 $/min. | Le site le disait déjà ; rappel Stripe 7 jours avant la fin activé (vérifié). |
| 11. Forfait 1646 | Autocalls met 200 crédits inclus, reçus dès le prochain renouvellement, sans double débit. « Resync Billing Portal » reconstruit l'écran de changement de forfait. | Resync lancé et confirmé le 8 octobre, 13 h 52 UTC. |
| 12. Crédits de messages | L'essai ne donne que des minutes. Achat dans « Add credits » : 100 crédits pour 1 $, minimum 100 crédits ; recharge de minutes dès 5 $. Marge réglée par action. | Conversion minutes → crédits déjà active (vérifié). Site et bases alignés. |
| 13. E-mails « via autocalls.ai » | Tout passe par notre SMTP Zoho sauf l'e-mail de bienvenue, qu'Autocalls bascule. | À revérifier sur la prochaine inscription test. |
| 14. E-mails système, traduction | Seul l'e-mail de bienvenue est modifiable. Les autres partent dans la langue de la plateforme (une seule). Traduction : 1 900 $ par langue, 1 à 2 semaines, remise si plusieurs ; couvre espace client, inscription, connexion, e-mails, sélecteur de langue, hébreu de droite à gauche. | Décision (argent). |
| 15. Mot de passe SMTP visible | Réponse du 9 octobre : aujourd'hui stocké en clair et réaffiché. Autocalls va le chiffrer et rendre le champ en écriture seule (vide au chargement, enregistré seulement si on en tape un nouveau). | Quand c'est en ligne : nouveau mot de passe Zoho, à saisir par le propriétaire. |
| 16. Widget en hébreu | De gauche à droite, dans son propre cadre ; inclus si l'hébreu est commandé. | Rien à faire. |
| 17. Données | AWS Francfort pour comptes, transcriptions, conversations, enregistrements et fichiers. Pendant les appels, fournisseurs d'IA dans l'UE et aux États-Unis. Routage 100 % UE réglé par Autocalls sur demande. Pas HDS ; ISO/IEC 27001:2022 et ISO 9001:2015. DPA et sous-traitants joints. | Décision : demander le routage UE. Garder le DPA hors du dépôt public. |
| 18. Pause de conformité | E-mail au client, par notre SMTP, à notre nom, en anglais. Nous ne sommes pas prévenus et ne pouvons pas débloquer : le client corrige son prompt, ou nous envoyons l'ID de l'assistant à Autocalls. | Noté. |
| 19. Données clients, webhooks | L'API donne id, nom, e-mail, soldes, date de création. Forfait, statut et fin d'essai : webhooks Stripe, rapprochés par e-mail. Pas de webhook « solde épuisé ». | Déjà fait : notre webhook Stripe reçoit ces événements. |
| 20. Inscription | Ni téléphone ni case de consentement. Pour les avoir : inscription sur notre site puis POST /white-label/register. | Option pour plus tard. |
| 21. Liste d'exclusion | Pas d'API pour l'instant (« très bientôt »). Bloque appels et WhatsApp/SMS de campagne, pas les envois par l'API. | Nos envois par l'API vérifient déjà notre propre liste de refus. |
| 22. Sécurité des webhooks | Jeton dans l'adresse seulement. Pour un en-tête : automatisation « appel terminé » puis requête HTTP avec une connexion. | Décision 13 révisée. |
| 23. Campagnes | Pas d'API de modification (« très bientôt ») : tableau de bord, ou supprimer et recréer. | Les 7 campagnes restent à faire à la main. |
| 24. Bases de connaissances | L'agent utilise tous les documents actifs. Le vrai problème : v7, v9 et v10 des mêmes pages sont actives ensemble, et l'agent mélange anciens et nouveaux prix. Supprimer les échecs et les anciennes versions. Pas d'IP publiée : derrière Cloudflare, importer un fichier TXT. | Liste prête dans docs/autocalls-kb-a-supprimer.md. Urgent. |

## Message 5 — Suite à leurs réponses (à envoyer)

```
Hi Autocalls team, thank you for the detailed answers. We applied them on our side: "Resync Billing Portal" is done (8 Oct, 13:52 UTC), Stripe is set to "cancel the subscription" after the final retry, and our site now shows the $5 top-up minimum and chat credits at 100 per $1. Please keep automatic tax off until we confirm our tax registrations.

A few follow-ups:

*1. Plan 1646* — Please confirm once "Included Chat Credits" = 200 is saved on plan 1646, so we can check it in the admin.

*2. Welcome email* — Please tell us when it goes through our Zoho SMTP. We will run a signup test to confirm "via autocalls.ai" is gone.

*3. Dedicated number fee (still open)* — On 7 Oct our test client (user nyh770) bought number 11806 for $3.09 on our Stripe account. Your platform took a $2.70 application fee on that payment, so we received $0, and you also bill us $3.99/month for the same number. What is this fee, and where do we set the price our clients pay for a number so that we keep a margin?

*4. SMTP password (still open)* — Admin > Settings > SMTP shows the password in clear text on the page. Can it become a write-only field that is never sent back to the browser, and is it encrypted at rest?

*5. EU-only routing* — Before we ask you to turn it on: what changes for our assistants (LLM models, voices and transcription available, latency, price)? Does it also cover WhatsApp and web-widget chats?

*6. Translation* — Please quote French, Hebrew, Italian, Polish and Dutch ordered together. Once translated, are system emails sent in each user's own language, or still in one language for the whole platform?

*7. Compliance pause* — Can the pause email be sent in the user's language, and can we (the agency) get a copy or a webhook, so we can help the client the same day?

*8. Release notices* — Please let us know when the blacklist REST endpoint and the campaign update endpoint are live.

Thank you!
Joseph — PermanenceAI
```

## Message 1 — Facturation

```
Hi Autocalls team, this is Joseph from PermanenceAI (white-label tenant app.permanenceia.com). We read your docs (white-label, billing, pricing & margins) first. The points below are specific to our account and not covered there:

*1. Our balance at zero* — Our owner balance is about 3,494 min. When it reaches 0, is the $0.09/min overage charged to our card automatically (when?), or do our clients' calls stop even if their own balance is positive?

*2. Dedicated numbers* — On 7 Oct our test client (user nyh770) bought number ID 11806. The client paid $3.09 on our Stripe account, your platform took a $2.70 application fee, so we received $0, and you also bill us $3.99/month for the same number. The Stripe subscription "Dedicated phone number" was deleted 47 seconds after creation, but the number is still active. Why this fee and this deletion? How is the number billed next month? Where do we set the price our clients pay for a number?

*3. Tax at checkout* — Is Stripe automatic tax enabled on the checkouts you create for our tenant? Our connected account (acct_1UNBLcBjFUxnZPfW) has no tax registration yet: will client payments go through with 0 tax, or fail with "Something went wrong"? Can you turn automatic tax off for our tenant?

*4. Checkout fields and invoice language* — Can your checkout require the client's full billing address and phone, and set the client's language on Stripe (FR, EN, IT, PL, NL, HE) so receipts and invoices are not only in English?

*5. Promo codes* — Can your checkout accept Stripe promotion codes on plans and top-ups?
```

## Message 2 — Paiements, essai et forfaits

```
*6. Failed payments* — When a client's renewal fails after all Stripe retries, what happens to their plan, minutes and access? Which "after final retry" setting should we choose in Stripe? Can we safely edit a client subscription directly in Stripe, or does it break the sync with your platform?

*7. Payment methods* — Do your checkouts show the payment methods enabled on our Stripe account (so SEPA would appear if we enable it), or card only?

*8. Call transfers* — When an agent transfers a call to a human (cold or warm), is the leg to the human deducted from the client's minutes, and does the original call keep counting minutes during the bridged conversation?

*9. Cost per call* — For a client sub-account, is the call cost computed at our wholesale rate or at the client's plan rate? Web call 9234492 (68 s, carrier cost 0) cost $0.122: what is the extra ~$0.01 per minute?

*10. Client trial (14 days / 30 min)* — Does the trial create a Stripe subscription with a trial end date? At the end, is the client blocked, moved to a free account, or charged automatically? If they pick a plan during the trial, are the remaining trial minutes kept? Our test user 28790 shows 51.28 trial minutes instead of 30: why?

*11. Plan 1646 (Receptionist)* — "Included Chat Credits" is locked at 0. Can you set it to 200 on your side? If not, how do we move subscribers to a new plan without charging them twice, and what exactly does "Resync Billing Portal" do?

*12. Chat credits* — Can you add an "included chat credits" field to the trial limits? When a client clicks "Add credits", can they buy chat credits or only minutes, at what price, and can we set packs at our own price? Is there a minimum top-up amount, and can we set ours (e.g. $20)?
```

## Message 3 — E-mails, marque et sécurité

```
*13. Emails "via autocalls.ai"* — We set our own SMTP (Zoho, domain permanenceia.com) and the test email works. But the welcome email received on 6 Oct came from no-reply@autocalls.ai, signed DKIM d=autocalls.ai, and Gmail shows "via autocalls.ai". Which emails use our SMTP? Can you send all our tenant's emails through it?

*14. System emails and translation* — Only the Welcome email is editable, and in one language. Can all system emails (trial ending, low balance, payment, suspension, password reset) be edited and sent in the user's language? Your "platform translation" service: price and timeline for French, Hebrew (right-to-left), Italian, Polish and Dutch, including the signup and login pages?

*15. SMTP password visible* — In Admin > Settings > SMTP, the password is shown in clear text on the page. Can it become a hidden field, never sent back to the browser? Is it encrypted at rest?

*16. Hebrew widget* — Can the web widget display right-to-left for Hebrew, or can we add our own CSS to it?
```

## Message 4 — Données, API et bases de connaissances

```
*17. Data location* — Where are our tenant's recordings, transcripts and chats stored today (country and provider)? Your security page mentions "100% EU routing per customer account": where is this setting? Do you offer HDS-certified hosting for French healthcare clients? Please send your DPA and sub-processor list.

*18. Compliance scan* — When a client's assistant is paused by the compliance scan, who receives the email (the client or us), with which branding and language? Can we see and unblock our clients' paused assistants from the admin?

*19. Client data and webhooks* — Can GET /white-label/users also return each client's plan, subscription status, trial end date, phone and country? Can you add webhooks for plan change, trial ending, subscription canceled and balance exhausted?

*20. Signup form* — Can we add a required phone field and an optional WhatsApp/SMS consent checkbox to the signup form, sent in the signup webhook?

*21. Blacklist* — Is there a REST endpoint (API key) to add, remove and list blacklisted numbers, also for sub-accounts? Does the blacklist also block WhatsApp and SMS sends?

*22. Webhook security* — Can assistant webhooks be signed (HMAC header) or carry a custom auth header, instead of a token in the URL?

*23. Campaigns* — Is there an endpoint to update an existing campaign (max retries, retry interval, schedule windows)? Today we edit 7 campaigns by hand.

*24. Knowledge bases* — Our knowledge bases 6163, 6166 to 6169 and 6180 show "failed" because of a few failed or duplicate documents. While "failed", does the assistant still use the active documents? Which IPs or user-agent does your scraper use, so we can allow it through Cloudflare? Can we see why a document failed?

Thank you!
Joseph — PermanenceAI
```

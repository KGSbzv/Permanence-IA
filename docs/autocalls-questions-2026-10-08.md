# Autocalls : réponses trouvées et questions à poser (8 octobre 2026)

J'ai repris les 34 problèmes et questions en suspens avec Autocalls. Pour chacun, j'ai cherché dans :
- la documentation en ligne (docs.autocalls.ai, version complète téléchargée le 8 octobre 2026) ;
- les guides intégrés au connecteur Autocalls (les « playbooks » : platform-faq, telephony, campaigns, integrations) ;
- le dépôt public de la documentation sur GitHub ;
- les pages publiques du site autocalls.ai.

Le « Voice AI Playbook » d'Autocalls ne s'obtient qu'en laissant son e-mail. Sa page publique ne parle ni de facturation ni de marque blanche.

Résultat : 3 questions ont une réponse complète, 11 une réponse partielle, 20 aucune réponse. La partie 2 est en anglais, prête à copier dans un e-mail ou un ticket au support Autocalls. Version courte pour WhatsApp : docs/autocalls-questions-whatsapp.md.

---

## 1. Réponses trouvées dans la documentation Autocalls

### Q01 — Que se passe-t-il quand le pot commun de l'agence tombe à zéro ? (réponse partielle)
**Réponse.** Ce qui bloque un appel, un chat ou un WhatsApp, c'est le solde du compte client lui-même, pas le nôtre. Mais ce sont nos minutes qui alimentent les clients : si notre pot est vide, on ne peut plus leur transférer de minutes ni de crédits. Les minutes consommées au-delà des 3 500 incluses dans notre forfait sont facturées 0,09 $ la minute. La doc ne dit pas si c'est prélevé automatiquement ni si le service continue quand le pot est à zéro.
**À faire maintenant.** Surveiller le pot nous-mêmes (une tâche planifiée qui lit le solde chaque jour et nous prévient sous un seuil), et poser la question n° 1 ci-dessous.
**Sources.** https://docs.autocalls.ai/white-label/pricing-and-margins · https://docs.autocalls.ai/white-label/user-limits · https://docs.autocalls.ai/pricing/usage-based

### Q02 — Le coût affiché par appel est-il notre prix de gros ? (réponse partielle)
**Réponse.** Sur notre propre compte, le coût d'un appel est bien notre prix de gros : 0,09 $ la minute plus le coût réseau, en dollars (vérifié sur deux appels). Pour les comptes de nos clients, la doc ne dit pas sur quelle base le coût est calculé. Il reste aussi un petit supplément inexpliqué d'environ 0,01 $ par minute sur les appels web.
**À faire maintenant.** Pour le futur tableau /admin, calculer provisoirement la marge ainsi : revenu Stripe du client moins la somme des coûts de ses appels. On peut aussi masquer le coût des appels aux clients avec l'option « Carrier Costs Display ».
**Sources.** https://docs.autocalls.ai/api-reference/calls/get-call · https://docs.autocalls.ai/pricing/usage-based · https://docs.autocalls.ai/white-label/onboarding

### Q04 — Taxes (Stripe Tax) (réponse partielle)
**Réponse.** Le paiement utilise Stripe avec le calcul automatique des taxes. Tant que notre compte Stripe n'a aucune immatriculation fiscale, la taxe vaut 0,00, et le client peut même voir « Something went wrong » en achetant. Le support peut désactiver le calcul automatique, et un taux fixe manuel est possible. Rien sur l'autoliquidation.
**À faire maintenant.** Dans le Stripe du compte relié à Autocalls, compléter les 4 étapes de Stripe Tax : adresse du siège, code fiscal du produit, comportement fiscal, au moins une immatriculation. Vérifier ensuite que le statut affiche « Active ». Sinon, demander au support de désactiver le calcul automatique.
**Source.** https://docs.autocalls.ai/white-label/billing (section 5)

### Q06 — E-mails système à notre marque et dans nos 6 langues (réponse partielle)
**Réponse.** Autocalls promet des e-mails à notre marque (inscription, mot de passe, factures, notifications). En pratique, un seul modèle est modifiable : l'e-mail de bienvenue, sans choix de langue. Pour les autres, on ne règle que la couleur d'en-tête et le nom de la plateforme. Rien sur le logo ni sur l'icône du site.
**À faire maintenant.** Soigner l'e-mail de bienvenue (une seule version : en français, ou bilingue). Demander la suite au support (question n° 13).
**Source.** https://docs.autocalls.ai/white-label/onboarding (Email Templates) · https://docs.autocalls.ai/white-label/reseller-program

### Q09 — Crédits de chat bloqués à 0 sur le forfait Receptionist 1646 (réponse partielle)
**Réponse.** C'est voulu : les minutes et crédits inclus ne peuvent plus être changés après la création d'un forfait. Il faut créer un forfait de remplacement et y faire passer les clients. La doc n'explique pas comment faire passer un abonné sans double prélèvement.
**À faire maintenant.** En attendant, on peut donner les 200 crédits à la main à chaque abonné (Balance > Transfer Chat Credits), pris sur nos minutes (9 crédits = 1 minute), à refaire chaque mois. Ne pas déplacer les abonnés avant la réponse d'Autocalls.
**Sources.** https://docs.autocalls.ai/white-label/plans-setup · https://docs.autocalls.ai/white-label/migrating-from-synthflow · https://docs.autocalls.ai/white-label/user-limits

### Q11 — Achat de packs de crédits de messages (réponse partielle)
**Réponse.** Un client peut obtenir des crédits de 3 façons : ceux inclus dans son forfait, la conversion de ses minutes en crédits (9 crédits par minute) si on l'active, ou un transfert de notre part. Des achats de crédits côté client existent, mais rien ne permet de créer des packs (500, 1 000, 5 000) à un prix que nous fixons.
**À faire maintenant.** Activer la conversion minutes → crédits (« Credits Exchange ») si vous le souhaitez. Ne pas annoncer de packs de crédits sur le site.
**Source.** https://docs.autocalls.ai/white-label/chat-service-pricing

### Q13 — Adresse et téléphone obligatoires au paiement (réponse partielle)
**Réponse.** Le seul réglage du paiement est « Require Tax ID / VAT » : il oblige le client à donner son numéro de TVA. Rien pour exiger l'adresse complète ou le téléphone.
**À faire maintenant.** Activer « Require Tax ID / VAT » si on ne vend qu'à des entreprises (à vous de décider). Demander le reste (question n° 4).
**Source.** https://docs.autocalls.ai/white-label/onboarding (Checkout Settings)

### Q18 — Hébergement en Europe, HDS et enregistrements (réponse partielle)
**Réponse.** La page sécurité d'Autocalls annonce :
- un traitement « 100 % UE » réglable par compte client ;
- un contrat de traitement des données (DPA) ;
- la norme ISO 27001.

Le mode HIPAA existe mais doit être débloqué. Il coupe WhatsApp et impose une ligne SIP. L'hébergement certifié HDS n'est mentionné nulle part. On ne sait pas non plus où sont hébergées nos données aujourd'hui.
**À faire maintenant.** Garder les secteurs santé en pause. Demander le DPA, la liste des sous-traitants et le réglage UE (question n° 23).
**Sources.** https://autocalls.ai/security · https://docs.autocalls.ai/white-label/hipaa-mode

### Q20 — Plafond quotidien d'appels sortants (réponse partielle)
**Réponse.** Le plafond dépend de la confiance accordée au compte. Il est bas pour un compte neuf avec une adresse Gmail. Il augmente avec un e-mail professionnel et après environ 7 jours. Il repart à zéro à minuit. Il ne concerne ni les appels entrants ni les lignes SIP. Le chiffre exact n'est pas publié.
**À faire maintenant.** Lire notre chiffre sur la page « Limits » (menu utilisateur, à côté de « My profile »). Demander une hausse depuis cette page si besoin.
**Sources.** https://docs.autocalls.ai/releases (version 1.7.9) · guide « telephony » du connecteur Autocalls

### Q21 — Durée de conservation des données (réponse complète)
**Réponse.** Par défaut, Autocalls garde 24 mois les appels, les contacts, les conversations écrites et les SMS. Chaque client peut régler entre 1 et 24 mois, dans la limite que nous fixons dans « Data Retention Policy ». Les « 90 jours » annoncés sur notre site sont donc faux tant que ce plafond n'est pas réglé à 3 mois.
**À faire maintenant.** Choisir : régler le plafond à 3 mois dans l'administration, ou corriger le site.
**Sources.** https://docs.autocalls.ai/settings/data-retention · https://docs.autocalls.ai/white-label/onboarding

### Q22 — Liste de blocage par API (réponse partielle)
**Réponse.** La liste de blocage existe dans l'interface, et le connecteur peut y ajouter un numéro, y compris pour un client. Pour voir la liste ou retirer un numéro, il faut passer par l'interface : aucune API publique n'est documentée.
**À faire maintenant.** Utiliser l'ajout par le connecteur pour les personnes qui refusent d'être rappelées.
**Sources.** https://docs.autocalls.ai/releases (version 1.5.2) · https://docs.autocalls.ai/mcp-connector

### Q27 — Créer automatiquement un agent pour chaque nouveau client (réponse complète)
**Réponse.** Oui, c'est possible. À l'inscription, Autocalls nous envoie le nom et l'e-mail du client. Avec cet e-mail, on obtient un accès à son compte sans son mot de passe, puis on lui crée son agent. Sans programmation, l'outil « Data Migration » de l'administration copie un agent modèle (avec sa base de connaissances) vers un client.
**À faire maintenant.** Décider si on automatise.
**Sources.** https://docs.autocalls.ai/white-label/onboarding · https://docs.autocalls.ai/api-reference/white-label/create-token · https://docs.autocalls.ai/white-label/data-migration

### Q28 — Bases de connaissances en échec (réponse partielle)
**Réponse.** Une base passe en « failed » dès qu'un seul document échoue. Un document en échec ne peut pas être relancé : il faut le supprimer puis le recréer. Après suppression, le statut de la base se met à jour tout seul. La protection Cloudflare de notre site est une cause d'échec connue, et la doc conseille de la désactiver le temps de la lecture du site. On ne sait pas si une base « failed » sert quand même ses documents valides à l'agent.
**À faire maintenant.** Dans les bases 6163, 6166 à 6169 et 6180 :
1. supprimer les documents en échec et en double ;
2. assouplir Cloudflare le temps de la lecture ;
3. recréer les documents (ou téléverser des fichiers).
**Sources.** https://docs.autocalls.ai/conversation-design/knowledge-bases · https://docs.autocalls.ai/api-reference/knowledgebases/delete-document

### Q34 — Republier la documentation Autocalls à notre marque (réponse complète)
**Réponse.** Oui, c'est prévu dans le programme revendeur. Autocalls fournit un modèle sur GitHub, à recopier puis à mettre à notre marque en un clic. Les mises à jour se récupèrent ensuite automatiquement.
**À faire maintenant.** Rien d'urgent. Le jour où on veut une documentation PermanenceAI, utiliser « Use this template », puis lancer « Rebrand Documentation ».
**Sources.** https://github.com/Autocalls/documentation · https://docs.autocalls.ai/white-label/reseller-program

---

## 2. Questions à poser au support Autocalls

*(En anglais, prêt à copier-coller. Les questions marquées « optional » peuvent être retirées.)*

Hello Autocalls team, we run the PermanenceAI white-label tenant (app.permanenceia.com). Before writing, we checked your docs (docs.autocalls.ai, llms-full.txt as of 8 Oct 2026), the MCP guides and the public GitHub docs. Below are the points we could not resolve. Thank you for your help.

### Billing & Stripe

**1. Owner balance reaching zero.** Your docs say "Autocalls bills the partner the wholesale plan plus usage above the included minutes" ($0.09/min). Our owner balance is about 3,493 minutes today.
- (a) When it reaches zero, is the overage charged automatically to our card, and when (immediately or at the end of the cycle)? Or does service stop?
- (b) If our owner balance is 0, do our clients' calls, web widget, chat and WhatsApp keep working as long as their own balance is positive?
- (c) When a client plan's automatic top-up or overage kicks in, are those minutes taken from our pool, or created separately and billed to us later?
- (d) Does Auto Top-Up (release v1.5.3: thresholds, amounts, low-balance alerts) apply to the white-label owner account, and where do we enable it? Can we get an email or webhook alert below a threshold?
- (e) With "Allow free accounts" on, what happens to a client at 0 minutes, 0 credits and no card? Are inbound calls rejected, played a message, or answered and charged at the "Free Account Extra Minutes Cost"?

**2. Per-call cost and margin.** On our owner account, `total_cost` matches $0.09/min plus carrier cost (call 9230718: 18 s, $0.049).
- (a) For a client sub-account, are `total_cost` / `carrier_cost` (API and Call History) computed at our wholesale rate or at the client's plan rate?
- (b) How many minutes are deducted from the client's balance per call: is the carrier cost converted at the client's plan rate, or at $0.09?
- (c) Web call 9234492 (68 s, `carrier_cost` = 0) cost $0.122, about $0.01 per started minute above $0.09 × billed time. Your docs say web calls have "no telecom leg" and count only AI time. What is this extra charge?
- (d) Your docs mention margin visible "in your usage reporting". Is there a per-client revenue vs. wholesale cost report (admin or API), or should we compute it ourselves?

**3. Tax.** Your docs say checkout uses Stripe automatic tax, that tax is 0.00 without a registration, and that support can disable it.
- (a) Is automatic tax enabled on our tenant today?
- (b) Our connected account (acct_1UNBLcBjFUxnZPfW) has no tax registration yet. Will checkouts succeed with 0.00 tax, or will clients get "Something went wrong" when upgrading, buying credits or renting a number?
- (c) Where is the "manual flat tax rate" mentioned in your FAQ set, and can it differ by country?
- (d) If automatic tax is disabled, can invoices carry a reverse-charge note and show the VAT number collected via "Require Tax ID / VAT"?
- (e) Are client invoices issued as Stripe invoices from our connected account, so that our Stripe invoice settings (footer, custom fields) apply?

**4. Checkout fields.** Can Checkout Sessions for our clients (plans, top-ups, number rentals) require the full billing address and phone number (`billing_address_collection=required`, `phone_number_collection[enabled]=true`, `customer_update[address]=auto`)? Today the admin only offers "Require Tax ID / VAT", and without a full address Stripe Tax cannot compute VAT correctly outside the US.

**5. Invoice language.** When you create the Stripe Customer and Checkout Session for a client, can you pass their language (`preferred_locales` and Checkout `locale`)? We serve FR, EN, IT, PL, NL and HE, and today invoices and receipts go out in English unless we edit each customer in Stripe by hand.

**6. Promotion codes.** Can the checkout accept Stripe promotion codes or coupons (`allow_promotion_codes=true`, or a discount applied by the admin) on plans and top-ups? If not, is it on the roadmap? In the meantime, is a hidden plan assigned via "Visible Plans" the recommended way to give one client a discounted price?

**7. Subscription statuses.**
- (a) Which Stripe webhooks do you listen to on our connected account?
- (b) What happens to a client's plan, included minutes, top-up minutes and access when their subscription becomes `past_due`, `unpaid`, `paused` or `canceled` after Smart Retries? Is the account downgraded to free, or blocked?
- (c) Which "after final retry" setting should we choose: cancel, mark as unpaid, leave past-due or pause?
- (d) Is it safe to edit a client subscription directly in Stripe (price change, pause, cancel at period end, credit), or does that desynchronize plan and minute allocation?

**8. Payment methods / SEPA.**
- (a) Do your Checkout Sessions (subscriptions, top-ups, auto top-up, number rental) use dynamic payment methods, or a hard-coded `payment_method_types` such as `['card']`?
- (b) Are charges direct charges on our connected account, or destination charges from your platform (with or without `on_behalf_of`)?
- (c) Which payment method configuration applies: our "Billing Payments" one (pmc_1UNBM8…), our Default one, or yours?
- (d) If we enable SEPA Direct Debit (EUR only), will it appear for subscriptions, one-off top-ups and auto top-ups? Is its delayed confirmation (several business days) handled before minutes are credited?

*(Question 9 sur la devise retirée : la plateforme ne fonctionne qu'en dollars.)*

**10. Call transfer billing.** For cold (`call_transfer`) and warm (`warm_call_transfer`) transfers:
- (a) Is the outbound leg to the human billed, i.e. is the transfer's `carrier_cost` (post-call webhook) converted into plan minutes like the main call?
- (b) After a cold transfer, does the original call keep consuming minutes for the whole bridged conversation, or only until the handoff?
- (c) For a warm transfer, is AI time counted while the caller is on hold, during the briefing, and after both sides are connected?
- (d) For a client sub-account, is all of this deducted from the client's balance at their plan rate?
- (e) Is it different over a SIP trunk ($0.00045/min bridging)?

### Phone numbers

**11. Dedicated number billing.** On 7 Oct, a test client account (nyh770) bought dedicated number ID 11806 (+44 7782 230071). The Stripe subscription "Dedicated phone number" (sub_1UNxVT…) on our connected account was deleted 47 seconds after it was created, yet the number is still active. Your API docs say a purchase "creates a monthly subscription that will auto-renew" and "will continue until you release the number".
- (a) Why was the subscription deleted, and what does `has_active_subscription` return for this number?
- (b) The client paid $3.09: $2.70 went to your platform as an application fee and $0.39 to Stripe fees, so we received $0. You also bill us $3.99/month for the same number. Your docs say "no revenue share" and "Autocalls.ai bills you for the wholesale usage. You then mark up and bill your clients." What is this application fee?
- (c) How is the number billed in later months, and who pays: us, the client, or both?
- (d) Your reseller-program, pricing-and-margins and billing pages say we set "the rental price your client pays". Where is that setting? We cannot find it in Administration.

**12. Outbound call limits (optional).** What are the actual daily outbound-call limits per trust tier, in particular for a new client sub-account that signs up with a consumer email (Gmail)? As tenant owner, can we see and raise our clients' limits from the admin panel, or must each client ask from their own Limits page?

### Emails & branding

**13. Notification email templates.** Your reseller-program page lists "Branded client emails (signup, password reset, invoices, notifications)". In Administration > Email Templates, only the Welcome Email is editable, with no language option, and every other system email goes out in English.
- (a) Can every notification email (trial ending, low balance, payment success or failure, suspension, password reset, invoices) be edited per template?
- (b) Can each one exist per language (FR, EN, IT, PL, NL, HE) and be sent in the user's own language? Is this part of the "Platform translation to any language (custom service)", and at what cost?
- (c) Can the email logo be served from our tenant domain (app.permanenceia.com) instead of an Autocalls URL?
- (d) Can `/favicon.ico` on our custom domain return our uploaded favicon?

**14. Emails still sent "via autocalls.ai".** We configured our own SMTP (Zoho, From domain permanenceia.com) in Administration > Settings > SMTP, and the test email works. Yet some emails to our users still come from no-reply@autocalls.ai, DKIM-signed `d=autocalls.ai`, and Gmail shows "via autocalls.ai". Your docs say clients "never see the word Autocalls".
- (a) Which system emails use the tenant SMTP, and which use your own mail service?
- (b) Can you route every tenant email (welcome, verification, password reset, invoices, low balance, trial, payment, suspension) through our SMTP and From domain?

**15. SMTP password shown in clear text (security request).** In Administration > Settings > SMTP, the password is displayed in clear text and seems to be sent back to the browser when the page loads. Your docs describe the Google Client Secret as "hidden/revealable", but nothing similar exists for the SMTP password or the LinkedIn Client Secret. Could these become write-only fields (masked, never returned by the page or API, replaced only when a new value is entered)? Is the SMTP password encrypted at rest?

**16. Platform translation.** Your white-label page lists "Platform translation to any language (custom service)". We need the client dashboard, the signup/login/password-reset pages and the system emails in French, Hebrew (right-to-left), Italian, Polish and Dutch. Today our signup page mixes your English interface with our French texts.
- (a) Is this possible, including right-to-left Hebrew?
- (b) Can each user pick their language (or have it detected from the browser), or is it one language per instance?
- (c) What is the price (one-off or monthly) and the timeline?
- (d) Who keeps translations up to date when you ship new features, and can we supply or review them (translation file, glossary)?

### Trial & plans

**17. Client free trial.** We set client trials to 14 days / 30 minutes. Your docs do not describe client trials.
- (a) Does the trial create a Stripe subscription with `trial_end` on our connected account, or is it tracked only inside the platform?
- (b) Where can we read a client's trial end date (admin, API, webhook)?
- (c) At the end of the trial, is the client moved to a free account, blocked, or charged automatically if a card is on file?
- (d) If a client picks a paid plan during the trial, does the trial end immediately? Are the remaining trial minutes kept? Is there any proration?
- (e) Are trial minutes taken from our owner balance? One client (user 28790) shows 51.28 minutes instead of 30.

**18. Locked chat credits on plan 1646.** Plan 1646 (Receptionist) has Included Chat Credits locked at 0. Your docs say included minutes and credits cannot be changed after creation, and that we should create a replacement plan.
- (a) Can you set it to 200 on your side?
- (b) If not, when an existing subscriber moves to the replacement plan, is the Stripe subscription switched in place (proration, no second charge), or must the client cancel and check out again? Are the plan minutes left in the current cycle kept?
- (c) What exactly does the "Resync Billing Portal" button do, and should we run it after deactivating the old plan or hiding it via Visible Plans?
- (d) Can we change a user's plan ourselves (admin or API) without the client going through checkout?

**19. Chat credits during the trial.** Trial Plans Limits has no credits field, and your docs only mention "Allow Free Accounts" and "Free Account Extra Minutes Cost". Could you add an "Included chat credits" field to Trial Plans Limits (or to the free-account settings)? If not, is the recommended way to grant credits at signup the User Signup webhook plus `POST /api/white-label/transfer` (`transfer_type=credits`), paid from our minutes?

**20. Chat-credit packs.** Your docs mention clients who "purchase credits" or "top up chat credits", and Auto Top-Up for Chat Credits (v1.7.8), but say nothing about packs or pricing.
- (a) When a client clicks Add credits, can they buy chat credits, or only minutes?
- (b) What price does the client pay per credit (100 credits = $1, or based on our extra-minute rate)?
- (c) Can we define fixed packs (e.g. 500 / 1,000 / 5,000) at our own price? If not, is Credits Exchange (9 credits per minute) the only option?

**21. Minimum top-up amount.**
- (a) Is there a minimum amount when a client buys extra minutes (manual top-up or Auto Top-Up)? If so, what is it, in USD or in minutes?
- (b) Your Synthflow migration page says "Automatic top-ups run from the plan rules". Where are these rules set?
- (c) Can we set our own minimum (e.g. $20), platform-wide or per plan, and offer preset amounts instead of a free field?

**22. Sub-tenants and affiliate program.**
- (a) Can we resell white label in turn, i.e. create a sub-tenant with its own branding, domain and Stripe account under our tenant? If not, would each agency need its own Agency White Label plan, and is reselling to agencies allowed under the reseller terms?
- (b) Do you run an affiliate or referral program (commission, referral link, payout terms) for partners who bring you agencies or direct customers?

### Data & compliance

**23. Data location, EU routing, HDS, DPA, HIPAA.**
- (a) In which region (country and cloud provider) are our tenant's recordings, transcripts, leads and chat data stored and processed today?
- (b) Your security page says partners can configure 100% EU routing per customer account. Where is that setting (we don't see it in the admin)? Does it cover recordings, transcription, LLM and TTS (including Soniox, Gladia, Azure OpenAI, Gemini and ElevenLabs Enterprise EU)? Is there an extra cost?
- (c) Do you offer HDS-certified hosting (Hébergeur de Données de Santé) for French healthcare clients?
- (d) Please send your DPA for signature and your full, current sub-processor list with locations.
- (e) Please unlock HIPAA mode on our platform. Is a BAA included, and is any covered option possible for WhatsApp?

**24. Prompt compliance scan on client assistants.**
- (a) Does the compliance scan also run on our clients' assistants?
- (b) When a client's assistant is paused, who gets the email (the client, us, or both)? Is it sent through our SMTP, with our branding, and in which language? It is not listed in Admin > Settings > Email Notifications.
- (c) As tenant owner, can we see which client assistants are paused (admin, API field or webhook) and request a review or unblock them on the client's behalf?
- (d) Are the scan criteria (AI disclosure, right to refuse, opt-out, caller ID…) documented, so we can build them into our prompt templates?
- (e) How does `ASSISTANT_BLOCKED` show on `GET /assistants` (field name), so we can detect it?

**25. Final purge after soft deletion (optional).** After a record is soft-deleted by the data-retention job, when is it permanently purged, including call recordings and backups?

### API & integrations

**26. Client data in the white-label API.**
- (a) Can `GET /white-label/users` (and the `list-platform-users` MCP tool) also return each user's plan id and name, subscription status (trialing/active/past_due/canceled), `trial_ends_at`, current period end, phone and country?
- (b) Can the User Signup webhook include the user id (ideally also phone, timezone and plan)?
- (c) Could you add platform webhooks for plan changed, trial started/ending/ended, subscription canceled and balance exhausted?
- (d) If not, is there a supported way to match a Stripe customer or subscription on our connected account to an Autocalls user id (e.g. metadata on the Stripe customer)?

**27. Phone and consent at signup.**
- (a) Can we add custom fields to the signup form on our domain: at least a required phone number (with country code) and an optional WhatsApp/SMS consent checkbox with a timestamp?
- (b) Can these fields be stored on the user, sent in the User Signup webhook and returned by `GET /white-label/users`?
- (c) If not, is creating users from our own form via `POST /white-label/register` the recommended way? Could that endpoint accept phone and consent fields, and send a set-password email instead of requiring us to choose a password?

**28. Blacklist API.** Is there a public, documented REST endpoint to add, remove and list blacklisted numbers with an API key, including on behalf of a sub-account? The MCP connector only has `add-to-blacklist` (with `on_behalf_of_user_id`), with no list or remove tool, and the API reference documents no blacklist endpoint. Also, does a blacklisted number block WhatsApp and SMS campaign sends, or only calls?

**29. Webhook signatures.** Can assistant webhooks (post-call, inbound pre-call variables, conversation_ended, WhatsApp voice events) be signed like the WhatsApp read-receipts webhook (`X-Signature-256`, HMAC-SHA256 of the raw body with a signing secret), or carry a custom static auth header (e.g. `Authorization: Bearer …`)? If not, is it on the roadmap, and do you publish a fixed list of source IPs we could allowlist? Today our only option is a secret token in the URL.

**30. Updating a campaign through the API.** Is there (or will there be) an endpoint and MCP tool to update an existing campaign: `max_retries`, `retry_interval`, `schedule_windows`, `allowed_days`, timezone, `retry_on_voicemail`, `max_calls_in_parallel`, `phone_number_ids`, fallback settings? Today the API and MCP only offer create, update-status and delete, so we edit our callback campaigns (12519–12522, 12532–12534) by hand. Can a campaign also be duplicated through the API, with or without its leads?

**31. Signup webhook and template assistants (optional).** Could the User Signup webhook also include the new user's id (and phone and country if collected), and be signed with an HMAC header? Is there an API or MCP equivalent of the admin "Data Migration" tool, to copy a template assistant (with its knowledge base and tools) into a new user's account automatically?

### Knowledge bases & agents

**32. Failed knowledge bases.** Knowledge bases 6163, 6166–6169 and 6180 show "failed" because of failed or duplicate documents. Our site is behind Cloudflare.
- (a) Can a failed document be re-processed or re-scraped in place (UI, API or MCP), or must we delete and re-create it?
- (b) If we delete only the failed documents, does the knowledge base go back to "active" automatically?
- (c) While a knowledge base is "failed", does the assistant still search its active documents during calls and WhatsApp chats?
- (d) How are duplicate documents or URLs in one knowledge base handled: deduplicated or indexed twice?
- (e) Which IP ranges and user-agent does your scraper use, so we can allowlist it in Cloudflare instead of disabling protection?
- (f) Can a website document be re-synced on a schedule, and can we see why a document failed (error message or HTTP status)?

**33. Web widget in Hebrew (right-to-left).** Can the web widget render right-to-left for Hebrew (`dir="rtl"` on the bubble, messages, header, input and pre-chat form fields), automatically from the assistant language or through an embed attribute such as `data-dir` / `data-lang`? If not, can we inject custom CSS into the widget iframe, or is RTL support on the roadmap?

Best regards,
The PermanenceAI team

---

## 3. En résumé

Sur 34 points, 3 ont une réponse complète dans la documentation, 11 une réponse partielle et 20 aucune réponse : 33 questions sont à envoyer à Autocalls (dont 3 facultatives : n° 12, 25 et 31).

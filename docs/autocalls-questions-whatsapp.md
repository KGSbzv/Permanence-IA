# Questions à envoyer à Autocalls par WhatsApp (8 octobre 2026)

4 messages, à envoyer dans l'ordre. Chaque question cite nos identifiants et ce qu'on a observé : la réponse dépend de notre compte, pas de la documentation générale.

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

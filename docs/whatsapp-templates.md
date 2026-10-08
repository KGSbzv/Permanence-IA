> Bibliothèque de modèles pour les clients ; les modèles de Permanence IA sont dans `docs/autocalls-modeles-whatsapp.md`.

# WhatsApp message templates (Meta format)

Ready-to-submit templates for businesses that send WhatsApp messages from their sender: appointments, callbacks, quotes, support, payments, reviews and win-back offers. Five languages: French, English, Italian, Polish and Dutch.

## Conventions (read once)

- **One name, several languages.** Each template keeps the same `name` in every language; you add one language version per language code (`fr`, `en_GB`, `it`, `pl`, `nl`).
- **Category.** `UTILITY` = linked to a specific transaction or request the customer started (appointment, request, invoice, ticket). `MARKETING` = anything promotional or not tied to a transaction (reviews, offers). Meta can recategorise a template after review. Write utility templates neutrally: no promotion, no discount, no "book again".
- **Variables.** Numbered `{{1}}`, `{{2}}`… in order, never at the very start or the very end of the body, never two side by side, with a sample value for each (Meta requires them for review). Keep enough fixed text around them, or Meta rejects the template for "too many variables for its length".
- **Limits.** Body ≤ 1024 characters (all bodies below are well under 400). Footer ≤ 60 characters. Quick-reply button text ≤ 25 characters. A URL button can end with one variable (`https://www.example.com/quote/{{1}}`); give a sample for it too.
- **Examples.** `example.com` links and sample values are placeholders. Replace them with your own links before you submit.
- **Never** ask for card numbers, PINs or passwords in a template. Send a secure payment link instead.
- **Opt-out.** Every MARKETING template has a quick-reply opt-out button and an opt-out footer. See the opt-out note in each language and the section at the end.

---

## Français (fr)

#### appointment_confirmation
- Catégorie : **UTILITY** · Langue : `fr`
- Corps :
> Bonjour {{1}}, votre rendez-vous chez {{2}} est confirmé : {{3}} le {{4}} à {{5}}, adresse : {{6}}. Pour toute question, répondez simplement à ce message.
- Exemples : {{1}} = Marie · {{2}} = Salon Élégance · {{3}} = coupe et brushing · {{4}} = jeudi 15 octobre · {{5}} = 14 h 30 · {{6}} = 12 rue des Lilas, Lyon
- Boutons : [Réponse rapide] Confirmer | Reporter | Annuler

#### appointment_reminder
- Catégorie : **UTILITY** · Langue : `fr`
- Corps :
> Bonjour {{1}}, petit rappel : vous avez rendez-vous demain, {{2}} à {{3}}, chez {{4}} pour {{5}}. Merci de nous indiquer si vous serez présent(e).
- Exemples : {{1}} = Thomas · {{2}} = mardi 20 octobre · {{3}} = 9 h 00 · {{4}} = Cabinet dentaire du Parc · {{5}} = un contrôle
- Boutons : [Réponse rapide] Je confirme | Changer d'horaire | Annuler

#### appointment_rescheduled
- Catégorie : **UTILITY** · Langue : `fr`
- Corps :
> Bonjour {{1}}, votre rendez-vous chez {{2}} a bien été déplacé. Nouveau créneau : {{3}} à {{4}}, pour {{5}}. Si cet horaire ne vous convient pas, répondez à ce message.
- Exemples : {{1}} = Julie · {{2}} = Garage Martin · {{3}} = vendredi 23 octobre · {{4}} = 8 h 30 · {{5}} = la révision de votre véhicule
- Boutons : [Réponse rapide] C'est noté | Changer encore

#### missed_call_followup
- Catégorie : **UTILITY** · Langue : `fr`
- Corps :
> Bonjour, ici {{1}}. Nous avons manqué votre appel de {{2}} et nous en excusons. Comment pouvons-nous vous aider ? Répondez ici ou demandez à être rappelé.
- Exemples : {{1}} = Plomberie Durand · {{2}} = 18 h 12
- Boutons : [Réponse rapide] Rappelez-moi | Je réponds ici

#### callback_scheduled
- Catégorie : **UTILITY** · Langue : `fr`
- Corps :
> Bonjour {{1}}, c'est noté : {{2}} vous rappellera le {{3}} à {{4}} (heure de {{5}}) au sujet de votre demande « {{6}} ». Si ce moment ne vous convient plus, répondez à ce message.
- Exemples : {{1}} = Sophie · {{2}} = l'agence Immo Centre · {{3}} = lundi 19 octobre · {{4}} = 11 h 00 · {{5}} = Paris · {{6}} = estimation de votre appartement
- Boutons : [Réponse rapide] Parfait | Changer l'horaire

#### quote_followup
- Catégorie : **UTILITY** (rédaction neutre, liée au devis demandé ; Meta peut la reclasser en MARKETING) · Langue : `fr`
- Corps :
> Bonjour {{1}}, votre devis {{2}} de {{3}} pour {{4}} est valable jusqu'au {{5}}. Vous pouvez le consulter avec le bouton ci-dessous. Une question ? Répondez simplement à ce message.
- Exemples : {{1}} = M. Bernard · {{2}} = D-2026-0142 · {{3}} = Électricité Moreau · {{4}} = la mise aux normes du tableau électrique · {{5}} = 30 novembre
- Boutons : [URL] Voir le devis → `https://www.example.com/devis/{{1}}` (exemple : D-2026-0142) · [Réponse rapide] J'ai une question

#### support_ticket_received
- Catégorie : **UTILITY** · Langue : `fr`
- Corps :
> Bonjour {{1}}, nous avons bien reçu votre demande n° {{2}} concernant « {{3}} ». L'équipe de {{4}} vous répondra sous {{5}}. Vous pouvez ajouter des précisions en répondant à ce message.
- Exemples : {{1}} = Claire · {{2}} = 48213 · {{3}} = facture introuvable · {{4}} = Cabinet Lefèvre · {{5}} = 24 heures ouvrées

#### support_ticket_resolved
- Catégorie : **UTILITY** · Langue : `fr`
- Corps :
> Bonjour {{1}}, votre demande n° {{2}} est résolue : {{3}}. Si le problème persiste, répondez à ce message et nous la rouvrirons.
- Exemples : {{1}} = Claire · {{2}} = 48213 · {{3}} = la facture vous a été renvoyée par email
- Boutons : [Réponse rapide] C'est réglé | Toujours un souci

#### payment_reminder
- Catégorie : **UTILITY** · Langue : `fr`
- Corps :
> Bonjour {{1}}, petit rappel : la facture {{2}} de {{3}}, d'un montant de {{4}}, arrive à échéance le {{5}}. Vous pouvez la régler en toute sécurité via le bouton ci-dessous. Si c'est déjà fait, merci et ignorez ce message.
- Exemples : {{1}} = M. Petit · {{2}} = F-2026-311 · {{3}} = Garage Martin · {{4}} = 245,00 € · {{5}} = 31 octobre
- Boutons : [URL] Payer la facture → `https://www.example.com/paiement/{{1}}` (exemple : F-2026-311)

#### review_request
- Catégorie : **MARKETING** · Langue : `fr`
- Corps :
> Bonjour {{1}}, merci pour votre visite chez {{2}} le {{3}}. Votre avis nous aide beaucoup : auriez-vous une minute pour le partager ? Cela ne prend que quelques secondes.
- Exemples : {{1}} = Léa · {{2}} = Institut Belle Peau · {{3}} = 12 octobre
- Pied de page : Répondez STOP pour ne plus recevoir ces messages
- Boutons : [URL] Laisser un avis → `https://www.example.com/avis` · [Réponse rapide] Arrêter les messages

#### reengagement_offer
- Catégorie : **MARKETING** · Langue : `fr`
- Corps :
> Bonjour {{1}}, cela fait un moment ! {{2}} vous offre {{3}} sur {{4}} jusqu'au {{5}}. Pour en profiter, réservez avec le bouton ci-dessous ou répondez à ce message.
- Exemples : {{1}} = Karim · {{2}} = Salon Élégance · {{3}} = 15 % · {{4}} = votre prochaine coloration · {{5}} = 30 novembre
- Pied de page : Répondez STOP pour ne plus recevoir nos offres
- Boutons : [URL] Réserver → `https://www.example.com/reserver` · [Réponse rapide] Arrêter les promos

#### Note sur la désinscription (opt-out)
Ce n'est pas un modèle. Si le client répond STOP, « Arrêter les promos » ou équivalent, ajoutez son numéro à la liste d'exclusion et confirmez en message libre (gratuit dans la session de 24 h) : « C'est noté, vous ne recevrez plus nos messages promotionnels. Les messages liés à vos rendez-vous et demandes continueront. Pour vous réinscrire, écrivez-nous ici. »

---

## English (en_GB)

#### appointment_confirmation
- Category: **UTILITY** · Language: `en_GB`
- Body:
> Hi {{1}}, your appointment at {{2}} is confirmed: {{3}} on {{4}} at {{5}}, address: {{6}}. If you have any questions, just reply to this message.
- Samples: {{1}} = Emma · {{2}} = Bright Smile Dental · {{3}} = check-up and hygiene · {{4}} = Thursday 15 October · {{5}} = 2:30pm · {{6}} = 12 High Street, Leeds
- Buttons: [Quick reply] Confirm | Reschedule | Cancel

#### appointment_reminder
- Category: **UTILITY** · Language: `en_GB`
- Body:
> Hi {{1}}, a quick reminder that you're booked in tomorrow, {{2}} at {{3}}, at {{4}} for {{5}}. Please let us know if you can still make it.
- Samples: {{1}} = James · {{2}} = Tuesday 20 October · {{3}} = 9am · {{4}} = Northside Physio · {{5}} = your follow-up session
- Buttons: [Quick reply] I'll be there | Change time | Cancel

#### appointment_rescheduled
- Category: **UTILITY** · Language: `en_GB`
- Body:
> Hi {{1}}, your appointment at {{2}} has been moved. New time: {{3}} at {{4}}, for {{5}}. If this doesn't suit you, just reply to this message.
- Samples: {{1}} = Sarah · {{2}} = Kings Road Garage · {{3}} = Friday 23 October · {{4}} = 8:30am · {{5}} = your car's service
- Buttons: [Quick reply] Got it | Change again

#### missed_call_followup
- Category: **UTILITY** · Language: `en_GB`
- Body:
> Hello, this is {{1}}. Sorry we missed your call at {{2}}. How can we help? Reply here, or ask us to call you back.
- Samples: {{1}} = Smith & Sons Plumbing · {{2}} = 6:12pm
- Buttons: [Quick reply] Call me back | I'll reply here

#### callback_scheduled
- Category: **UTILITY** · Language: `en_GB`
- Body:
> Hi {{1}}, all set: {{2}} will call you back on {{3}} at {{4}} ({{5}} time) about "{{6}}". If that time no longer works, just reply to this message.
- Samples: {{1}} = Olivia · {{2}} = Parkside Lettings · {{3}} = Monday 19 October · {{4}} = 11am · {{5}} = UK · {{6}} = valuation of your flat
- Buttons: [Quick reply] Perfect | Change the time

#### quote_followup
- Category: **UTILITY** (neutral wording tied to the quote the customer asked for; Meta may recategorise it as MARKETING) · Language: `en_GB`
- Body:
> Hi {{1}}, your quote {{2}} from {{3}} for {{4}} is valid until {{5}}. You can view it with the button below. Any questions? Just reply to this message.
- Samples: {{1}} = Mr Taylor · {{2}} = Q-2026-0142 · {{3}} = Brightwire Electrical · {{4}} = a consumer unit upgrade · {{5}} = 30 November
- Buttons: [URL] View quote → `https://www.example.com/quote/{{1}}` (sample: Q-2026-0142) · [Quick reply] I have a question

#### support_ticket_received
- Category: **UTILITY** · Language: `en_GB`
- Body:
> Hi {{1}}, we've received your request no. {{2}} about "{{3}}". The {{4}} team will get back to you within {{5}}. You can add details by replying to this message.
- Samples: {{1}} = Chloe · {{2}} = 48213 · {{3}} = missing invoice · {{4}} = Harper Accountants · {{5}} = 1 working day

#### support_ticket_resolved
- Category: **UTILITY** · Language: `en_GB`
- Body:
> Hi {{1}}, your request no. {{2}} has been resolved: {{3}}. If the problem comes back, reply to this message and we'll reopen it.
- Samples: {{1}} = Chloe · {{2}} = 48213 · {{3}} = we've emailed your invoice again
- Buttons: [Quick reply] All sorted | Still an issue

#### payment_reminder
- Category: **UTILITY** · Language: `en_GB`
- Body:
> Hi {{1}}, a friendly reminder that invoice {{2}} from {{3}} for {{4}} is due on {{5}}. You can pay securely with the button below. If you've already paid, thank you, and please ignore this message.
- Samples: {{1}} = Mr Evans · {{2}} = INV-2026-311 · {{3}} = Kings Road Garage · {{4}} = £245.00 · {{5}} = 31 October
- Buttons: [URL] Pay invoice → `https://www.example.com/pay/{{1}}` (sample: INV-2026-311)

#### review_request
- Category: **MARKETING** · Language: `en_GB`
- Body:
> Hi {{1}}, thanks for visiting {{2}} on {{3}}. Your feedback really helps us: could you spare a minute to leave a review? It only takes a few seconds.
- Samples: {{1}} = Grace · {{2}} = The Glow Studio · {{3}} = 12 October
- Footer: Reply STOP to opt out of these messages
- Buttons: [URL] Leave a review → `https://www.example.com/review` · [Quick reply] Stop messages

#### reengagement_offer
- Category: **MARKETING** · Language: `en_GB`
- Body:
> Hi {{1}}, it's been a while! {{2}} is offering you {{3}} off {{4}} until {{5}}. To claim it, book with the button below or reply to this message.
- Samples: {{1}} = Daniel · {{2}} = The Barber Room · {{3}} = 15% · {{4}} = your next cut · {{5}} = 30 November
- Footer: Reply STOP to opt out of offers
- Buttons: [URL] Book now → `https://www.example.com/book` · [Quick reply] Stop promotions

#### Opt-out note
This is not a template. If the customer replies STOP, "Stop promotions" or similar, add their number to the blacklist and confirm with a free-form message (free within the 24-hour session): "Done, you won't receive any more promotional messages from us. Messages about your appointments and requests will continue. To opt back in, just message us here."

---

## Italiano (it)

#### appointment_confirmation
- Categoria: **UTILITY** · Lingua: `it`
- Corpo:
> Buongiorno {{1}}, il Suo appuntamento presso {{2}} è confermato: {{3}} il {{4}} alle {{5}}, indirizzo: {{6}}. Per qualsiasi domanda, risponda pure a questo messaggio.
- Esempi: {{1}} = Giulia · {{2}} = Studio Dentistico Bianchi · {{3}} = visita di controllo e igiene · {{4}} = giovedì 15 ottobre · {{5}} = 14:30 · {{6}} = Via Roma 12, Milano
- Pulsanti: [Risposta rapida] Confermo | Sposta | Disdici

#### appointment_reminder
- Categoria: **UTILITY** · Lingua: `it`
- Corpo:
> Buongiorno {{1}}, Le ricordiamo l'appuntamento di domani, {{2}} alle {{3}}, presso {{4}} per {{5}}. Ci conferma la Sua presenza?
- Esempi: {{1}} = Marco · {{2}} = martedì 20 ottobre · {{3}} = 9:00 · {{4}} = Fisioterapia Centro · {{5}} = la seduta di controllo
- Pulsanti: [Risposta rapida] Confermo | Cambia orario | Disdici

#### appointment_rescheduled
- Categoria: **UTILITY** · Lingua: `it`
- Corpo:
> Buongiorno {{1}}, il Suo appuntamento presso {{2}} è stato spostato. Nuova data: {{3}} alle {{4}}, per {{5}}. Se l'orario non Le va bene, risponda a questo messaggio.
- Esempi: {{1}} = Francesca · {{2}} = Officina Rossi · {{3}} = venerdì 23 ottobre · {{4}} = 8:30 · {{5}} = il tagliando della Sua auto
- Pulsanti: [Risposta rapida] Va bene | Cambia ancora

#### missed_call_followup
- Categoria: **UTILITY** · Lingua: `it`
- Corpo:
> Buongiorno, siamo {{1}}. Ci scusi, non siamo riusciti a rispondere alla Sua chiamata delle {{2}}. Come possiamo aiutarLa? Risponda qui o chieda di essere richiamato.
- Esempi: {{1}} = Idraulica Ferri · {{2}} = 18:12
- Pulsanti: [Risposta rapida] Mi richiami | Rispondo qui

#### callback_scheduled
- Categoria: **UTILITY** · Lingua: `it`
- Corpo:
> Buongiorno {{1}}, è tutto fissato: {{2}} La richiamerà il {{3}} alle {{4}} (ora di {{5}}) per la Sua richiesta "{{6}}". Se l'orario non Le va più bene, risponda a questo messaggio.
- Esempi: {{1}} = Alessandro · {{2}} = l'agenzia Casa Più · {{3}} = lunedì 19 ottobre · {{4}} = 11:00 · {{5}} = Roma · {{6}} = valutazione del Suo appartamento
- Pulsanti: [Risposta rapida] Perfetto | Cambia orario

#### quote_followup
- Categoria: **UTILITY** (testo neutro legato al preventivo richiesto; Meta può riclassificarlo come MARKETING) · Lingua: `it`
- Corpo:
> Buongiorno {{1}}, il preventivo {{2}} di {{3}} per {{4}} è valido fino al {{5}}. Può consultarlo con il pulsante qui sotto. Ha domande? Risponda pure a questo messaggio.
- Esempi: {{1}} = sig. Conti · {{2}} = P-2026-0142 · {{3}} = Elettrica Galli · {{4}} = l'adeguamento dell'impianto elettrico · {{5}} = 30 novembre
- Pulsanti: [URL] Vedi preventivo → `https://www.example.com/preventivo/{{1}}` (esempio: P-2026-0142) · [Risposta rapida] Ho una domanda

#### support_ticket_received
- Categoria: **UTILITY** · Lingua: `it`
- Corpo:
> Buongiorno {{1}}, abbiamo ricevuto la Sua richiesta n. {{2}} relativa a "{{3}}". Il team di {{4}} Le risponderà entro {{5}}. Può aggiungere dettagli rispondendo a questo messaggio.
- Esempi: {{1}} = Chiara · {{2}} = 48213 · {{3}} = fattura non ricevuta · {{4}} = Studio Marini · {{5}} = 1 giorno lavorativo

#### support_ticket_resolved
- Categoria: **UTILITY** · Lingua: `it`
- Corpo:
> Buongiorno {{1}}, la Sua richiesta n. {{2}} è stata risolta: {{3}}. Se il problema si ripresenta, risponda a questo messaggio e la riapriremo.
- Esempi: {{1}} = Chiara · {{2}} = 48213 · {{3}} = Le abbiamo inviato di nuovo la fattura via email
- Pulsanti: [Risposta rapida] Tutto risolto | Ancora un problema

#### payment_reminder
- Categoria: **UTILITY** · Lingua: `it`
- Corpo:
> Buongiorno {{1}}, Le ricordiamo che la fattura {{2}} di {{3}}, di importo {{4}}, scade il {{5}}. Può pagarla in modo sicuro con il pulsante qui sotto. Se ha già provveduto, La ringraziamo e può ignorare questo messaggio.
- Esempi: {{1}} = sig.ra Greco · {{2}} = F-2026-311 · {{3}} = Officina Rossi · {{4}} = 245,00 € · {{5}} = 31 ottobre
- Pulsanti: [URL] Paga la fattura → `https://www.example.com/pagamento/{{1}}` (esempio: F-2026-311)

#### review_request
- Categoria: **MARKETING** · Lingua: `it`
- Corpo:
> Buongiorno {{1}}, grazie per la Sua visita da {{2}} il {{3}}. La Sua opinione è preziosa per noi: avrebbe un minuto per lasciare una recensione? Bastano pochi secondi.
- Esempi: {{1}} = Sara · {{2}} = Centro Estetico Aurora · {{3}} = 12 ottobre
- Piè di pagina: Risponda STOP per non ricevere più questi messaggi
- Pulsanti: [URL] Lascia una recensione → `https://www.example.com/recensione` · [Risposta rapida] Stop messaggi

#### reengagement_offer
- Categoria: **MARKETING** · Lingua: `it`
- Corpo:
> Buongiorno {{1}}, è da un po' che non ci vediamo! {{2}} Le offre {{3}} di sconto su {{4}} fino al {{5}}. Per approfittarne, prenoti con il pulsante qui sotto o risponda a questo messaggio.
- Esempi: {{1}} = Luca · {{2}} = Barberia Moretti · {{3}} = il 15% · {{4}} = il prossimo taglio · {{5}} = 30 novembre
- Piè di pagina: Risponda STOP per non ricevere più offerte
- Pulsanti: [URL] Prenota → `https://www.example.com/prenota` · [Risposta rapida] Stop promozioni

#### Nota sulla disiscrizione (opt-out)
Non è un modello. Se il cliente risponde STOP, "Stop promozioni" o simili, aggiunga il numero alla lista di esclusione e confermi con un messaggio libero (gratuito nella sessione di 24 ore): "Fatto, non riceverà più messaggi promozionali. I messaggi su appuntamenti e richieste continueranno. Per iscriversi di nuovo, ci scriva qui."

---

## Polski (pl)

#### appointment_confirmation
- Kategoria: **UTILITY** · Język: `pl`
- Treść:
> Dzień dobry {{1}}, potwierdzamy wizytę w {{2}}: {{3}}, dnia {{4}} o godz. {{5}}, adres: {{6}}. W razie pytań wystarczy odpowiedzieć na tę wiadomość.
- Przykłady: {{1}} = Pani Anno · {{2}} = Gabinecie Stomatologicznym Uśmiech · {{3}} = przegląd i higienizacja · {{4}} = czwartek 15 października · {{5}} = 14:30 · {{6}} = ul. Kwiatowa 12, Kraków
- Przyciski: [Szybka odpowiedź] Potwierdzam | Zmień termin | Odwołaj

#### appointment_reminder
- Kategoria: **UTILITY** · Język: `pl`
- Treść:
> Dzień dobry {{1}}, przypominamy o jutrzejszej wizycie: {{2}} o godz. {{3}}, miejsce: {{4}}, usługa: {{5}}. Prosimy o potwierdzenie obecności.
- Przykłady: {{1}} = Panie Tomaszu · {{2}} = wtorek 20 października · {{3}} = 9:00 · {{4}} = Fizjoterapia Ruch · {{5}} = wizyta kontrolna
- Przyciski: [Szybka odpowiedź] Potwierdzam | Zmień godzinę | Odwołaj

#### appointment_rescheduled
- Kategoria: **UTILITY** · Język: `pl`
- Treść:
> Dzień dobry {{1}}, termin wizyty w {{2}} został zmieniony. Nowy termin: {{3}} o godz. {{4}}, usługa: {{5}}. Jeśli ten termin nie pasuje, prosimy odpowiedzieć na tę wiadomość.
- Przykłady: {{1}} = Pani Katarzyno · {{2}} = Auto Serwisie Nowak · {{3}} = piątek 23 października · {{4}} = 8:30 · {{5}} = przegląd okresowy samochodu
- Przyciski: [Szybka odpowiedź] Dziękuję | Zmień ponownie

#### missed_call_followup
- Kategoria: **UTILITY** · Język: `pl`
- Treść:
> Dzień dobry, tu {{1}}. Przepraszamy, nie odebraliśmy Państwa połączenia o godz. {{2}}. W czym możemy pomóc? Prosimy odpowiedzieć tutaj albo poprosić o oddzwonienie.
- Przykłady: {{1}} = Hydraulika Wiśniewski · {{2}} = 18:12
- Przyciski: [Szybka odpowiedź] Proszę oddzwonić | Odpiszę tutaj

#### callback_scheduled
- Kategoria: **UTILITY** · Język: `pl`
- Treść:
> Dzień dobry {{1}}, potwierdzamy: {{2}} oddzwoni {{3}} o godz. {{4}} (czas: {{5}}) w sprawie: „{{6}}”. Jeśli ten termin już nie pasuje, prosimy odpowiedzieć na tę wiadomość.
- Przykłady: {{1}} = Pani Magdaleno · {{2}} = Biuro Nieruchomości Dom · {{3}} = w poniedziałek 19 października · {{4}} = 11:00 · {{5}} = polski · {{6}} = wycena mieszkania
- Przyciski: [Szybka odpowiedź] Pasuje | Zmień godzinę

#### quote_followup
- Kategoria: **UTILITY** (neutralna treść związana z zamówioną wyceną; Meta może przeklasyfikować na MARKETING) · Język: `pl`
- Treść:
> Dzień dobry {{1}}, wycena nr {{2}} przygotowana przez {{3}} dotycząca: {{4}} jest ważna do {{5}}. Można ją zobaczyć, klikając przycisk poniżej. Pytania? Wystarczy odpowiedzieć na tę wiadomość.
- Przykłady: {{1}} = Panie Piotrze · {{2}} = W-2026-0142 · {{3}} = Elektro-Serwis Zając · {{4}} = modernizacja rozdzielnicy · {{5}} = 30 listopada
- Przyciski: [URL] Zobacz wycenę → `https://www.example.com/wycena/{{1}}` (przykład: W-2026-0142) · [Szybka odpowiedź] Mam pytanie

#### support_ticket_received
- Kategoria: **UTILITY** · Język: `pl`
- Treść:
> Dzień dobry {{1}}, otrzymaliśmy zgłoszenie nr {{2}} w sprawie: „{{3}}”. Zespół {{4}} odpowie w ciągu {{5}}. Szczegóły można dodać, odpowiadając na tę wiadomość.
- Przykłady: {{1}} = Pani Ewo · {{2}} = 48213 · {{3}} = brak faktury · {{4}} = Biura Rachunkowego Lewandowski · {{5}} = 1 dnia roboczego

#### support_ticket_resolved
- Kategoria: **UTILITY** · Język: `pl`
- Treść:
> Dzień dobry {{1}}, zgłoszenie nr {{2}} zostało rozwiązane: {{3}}. Jeśli problem się powtórzy, prosimy odpowiedzieć na tę wiadomość, a ponownie je otworzymy.
- Przykłady: {{1}} = Pani Ewo · {{2}} = 48213 · {{3}} = fakturę wysłaliśmy ponownie e-mailem
- Przyciski: [Szybka odpowiedź] Wszystko w porządku | Problem nadal jest

#### payment_reminder
- Kategoria: **UTILITY** · Język: `pl`
- Treść:
> Dzień dobry {{1}}, przypominamy, że termin płatności faktury {{2}} wystawionej przez {{3}} na kwotę {{4}} mija {{5}}. Można ją bezpiecznie opłacić przyciskiem poniżej. Jeśli płatność została już wykonana, dziękujemy i prosimy zignorować tę wiadomość.
- Przykłady: {{1}} = Panie Marku · {{2}} = FV/2026/311 · {{3}} = Auto Serwis Nowak · {{4}} = 980,00 zł · {{5}} = 31 października
- Przyciski: [URL] Zapłać fakturę → `https://www.example.com/platnosc/{{1}}` (przykład: FV-2026-311)

#### review_request
- Kategoria: **MARKETING** · Język: `pl`
- Treść:
> Dzień dobry {{1}}, dziękujemy za wizytę w {{2}} w dniu {{3}}. Państwa opinia bardzo nam pomaga: czy znajdzie się minuta, by ją zostawić? To zajmie tylko chwilę.
- Przykłady: {{1}} = Pani Agnieszko · {{2}} = Salonie Urody Bella · {{3}} = 12 października
- Stopka: Odpisz STOP, aby nie otrzymywać tych wiadomości
- Przyciski: [URL] Wystaw opinię → `https://www.example.com/opinia` · [Szybka odpowiedź] Nie wysyłaj wiadomości

#### reengagement_offer
- Kategoria: **MARKETING** · Język: `pl`
- Treść:
> Dzień dobry {{1}}, dawno się nie widzieliśmy! {{2}} ma dla Państwa {{3}} rabatu na {{4}} do {{5}}. Aby skorzystać, prosimy zarezerwować termin przyciskiem poniżej lub odpowiedzieć na tę wiadomość.
- Przykłady: {{1}} = Panie Pawle · {{2}} = Barber Shop Brzytwa · {{3}} = 15% · {{4}} = kolejne strzyżenie · {{5}} = 30 listopada
- Stopka: Odpisz STOP, aby nie otrzymywać ofert
- Przyciski: [URL] Zarezerwuj → `https://www.example.com/rezerwacja` · [Szybka odpowiedź] Nie wysyłaj ofert

**Uwaga PL:** zwrot do klienta w wołaczu („Pani Anno”, „Panie Tomaszu”) brzmi naturalnie, ale wymaga przygotowania tej formy w danych. Jeśli jej nie masz, użyj samego imienia albo usuń {{1}} z pozdrowienia. Nazwy firm po „w” podawaj w miejscowniku („w Gabinecie…”) albo użyj konstrukcji „w firmie {{2}}”.

#### Uwaga dotycząca wypisu (opt-out)
To nie jest szablon. Jeśli klient odpisze STOP, „Nie wysyłaj ofert” lub podobnie, dodaj jego numer do listy wykluczeń i potwierdź wiadomością swobodną (bezpłatną w ramach 24-godzinnej sesji): „Gotowe, nie będziemy już wysyłać wiadomości promocyjnych. Wiadomości o wizytach i zgłoszeniach będą nadal przychodzić. Aby ponownie się zapisać, wystarczy do nas napisać.”

---

## Nederlands (nl)

#### appointment_confirmation
- Categorie: **UTILITY** · Taal: `nl`
- Hoofdtekst:
> Goedendag {{1}}, uw afspraak bij {{2}} is bevestigd: {{3}} op {{4}} om {{5}}, adres: {{6}}. Heeft u vragen? Reageer dan gewoon op dit bericht.
- Voorbeelden: {{1}} = Sanne · {{2}} = Tandartspraktijk De Linde · {{3}} = controle en gebitsreiniging · {{4}} = donderdag 15 oktober · {{5}} = 14.30 uur · {{6}} = Kerkstraat 12, Utrecht
- Knoppen: [Snel antwoord] Bevestigen | Verplaatsen | Annuleren

#### appointment_reminder
- Categorie: **UTILITY** · Taal: `nl`
- Hoofdtekst:
> Goedendag {{1}}, een herinnering aan uw afspraak morgen, {{2}} om {{3}}, bij {{4}} voor {{5}}. Laat u ons weten of u komt?
- Voorbeelden: {{1}} = Daan · {{2}} = dinsdag 20 oktober · {{3}} = 9.00 uur · {{4}} = Fysio Centrum Oost · {{5}} = uw vervolgbehandeling
- Knoppen: [Snel antwoord] Ik kom | Ander tijdstip | Annuleren

#### appointment_rescheduled
- Categorie: **UTILITY** · Taal: `nl`
- Hoofdtekst:
> Goedendag {{1}}, uw afspraak bij {{2}} is verplaatst. Nieuw tijdstip: {{3}} om {{4}}, voor {{5}}. Komt dit niet uit? Reageer dan op dit bericht.
- Voorbeelden: {{1}} = Lotte · {{2}} = Autobedrijf Jansen · {{3}} = vrijdag 23 oktober · {{4}} = 8.30 uur · {{5}} = de onderhoudsbeurt van uw auto
- Knoppen: [Snel antwoord] Prima | Opnieuw verplaatsen

#### missed_call_followup
- Categorie: **UTILITY** · Taal: `nl`
- Hoofdtekst:
> Goedendag, u heeft contact met {{1}}. Excuses dat we uw oproep van {{2}} hebben gemist. Waarmee kunnen we u helpen? Reageer hier of vraag om teruggebeld te worden.
- Voorbeelden: {{1}} = Loodgietersbedrijf De Vries · {{2}} = 18.12 uur
- Knoppen: [Snel antwoord] Bel mij terug | Ik reageer hier

#### callback_scheduled
- Categorie: **UTILITY** · Taal: `nl`
- Hoofdtekst:
> Goedendag {{1}}, het is geregeld: {{2}} belt u terug op {{3}} om {{4}} ({{5}} tijd) over "{{6}}". Komt dit moment niet meer uit? Reageer dan op dit bericht.
- Voorbeelden: {{1}} = Thijs · {{2}} = Makelaardij Van Dijk · {{3}} = maandag 19 oktober · {{4}} = 11.00 uur · {{5}} = Nederlandse · {{6}} = waardebepaling van uw woning
- Knoppen: [Snel antwoord] Prima | Ander tijdstip

#### quote_followup
- Categorie: **UTILITY** (neutrale tekst bij de aangevraagde offerte; Meta kan dit herindelen als MARKETING) · Taal: `nl`
- Hoofdtekst:
> Goedendag {{1}}, uw offerte {{2}} van {{3}} voor {{4}} is geldig tot {{5}}. U kunt deze bekijken via de knop hieronder. Vragen? Reageer gewoon op dit bericht.
- Voorbeelden: {{1}} = meneer Bakker · {{2}} = O-2026-0142 · {{3}} = Installatiebedrijf Smit · {{4}} = het vernieuwen van de meterkast · {{5}} = 30 november
- Knoppen: [URL] Bekijk offerte → `https://www.example.com/offerte/{{1}}` (voorbeeld: O-2026-0142) · [Snel antwoord] Ik heb een vraag

#### support_ticket_received
- Categorie: **UTILITY** · Taal: `nl`
- Hoofdtekst:
> Goedendag {{1}}, we hebben uw verzoek nr. {{2}} over "{{3}}" ontvangen. Het team van {{4}} reageert binnen {{5}}. U kunt details toevoegen door op dit bericht te reageren.
- Voorbeelden: {{1}} = Eva · {{2}} = 48213 · {{3}} = factuur niet ontvangen · {{4}} = Administratiekantoor Visser · {{5}} = 1 werkdag

#### support_ticket_resolved
- Categorie: **UTILITY** · Taal: `nl`
- Hoofdtekst:
> Goedendag {{1}}, uw verzoek nr. {{2}} is opgelost: {{3}}. Speelt het probleem opnieuw? Reageer dan op dit bericht en we openen het weer.
- Voorbeelden: {{1}} = Eva · {{2}} = 48213 · {{3}} = we hebben uw factuur opnieuw gemaild
- Knoppen: [Snel antwoord] Opgelost | Nog steeds een probleem

#### payment_reminder
- Categorie: **UTILITY** · Taal: `nl`
- Hoofdtekst:
> Goedendag {{1}}, een vriendelijke herinnering: factuur {{2}} van {{3}} voor {{4}} vervalt op {{5}}. U kunt veilig betalen via de knop hieronder. Al betaald? Dank u wel, dan kunt u dit bericht negeren.
- Voorbeelden: {{1}} = mevrouw Mulder · {{2}} = F-2026-311 · {{3}} = Autobedrijf Jansen · {{4}} = € 245,00 · {{5}} = 31 oktober
- Knoppen: [URL] Factuur betalen → `https://www.example.com/betalen/{{1}}` (voorbeeld: F-2026-311)

#### review_request
- Categorie: **MARKETING** · Taal: `nl`
- Hoofdtekst:
> Goedendag {{1}}, bedankt voor uw bezoek aan {{2}} op {{3}}. Uw mening helpt ons enorm: heeft u een minuutje om een review achter te laten? Het kost maar een paar seconden.
- Voorbeelden: {{1}} = Fleur · {{2}} = Beautysalon Puur · {{3}} = 12 oktober
- Voettekst: Antwoord STOP om deze berichten niet meer te ontvangen
- Knoppen: [URL] Review schrijven → `https://www.example.com/review` · [Snel antwoord] Stop berichten

#### reengagement_offer
- Categorie: **MARKETING** · Taal: `nl`
- Hoofdtekst:
> Goedendag {{1}}, dat is alweer even geleden! {{2}} geeft u {{3}} korting op {{4}} tot en met {{5}}. Boek via de knop hieronder of reageer op dit bericht.
- Voorbeelden: {{1}} = Bram · {{2}} = Barbershop De Kapper · {{3}} = 15% · {{4}} = uw volgende knipbeurt · {{5}} = 30 november
- Voettekst: Antwoord STOP om geen aanbiedingen meer te krijgen
- Knoppen: [URL] Nu boeken → `https://www.example.com/boeken` · [Snel antwoord] Stop promoties

#### Opmerking over afmelden (opt-out)
Dit is geen template. Antwoordt de klant STOP, "Stop promoties" of iets vergelijkbaars, zet het nummer dan op de blokkeerlijst en bevestig met een vrij bericht (gratis binnen de sessie van 24 uur): "Geregeld, u ontvangt geen promotionele berichten meer van ons. Berichten over uw afspraken en verzoeken blijven doorgaan. Wilt u zich later weer aanmelden? Stuur ons dan hier een bericht."

---

## What happens when the customer replies

- **A 24-hour conversation window opens.** Any reply from the customer (text, voice note or quick-reply button) opens a 24-hour customer service window. If the AI assistant is connected to the WhatsApp sender, it answers freely in that window, with no template needed. It uses the same knowledge base and rules as the voice agent: it confirms or moves the appointment, answers questions, takes details and schedules a callback. Each new customer message restarts the 24 hours. Once the window closes, the business can only write first with an approved template.
- **Quick-reply buttons are normal replies.** "Confirm", "Reschedule" or "Call me back" reach the assistant as the customer's message, and it acts on them. Give the assistant clear instructions for each button in its prompt (for example: "Reschedule" → offer two new slots).
- **STOP and opt-out.** If the customer writes STOP (or "unsubscribe", "arrêter", "stop promozioni", "nie wysyłaj", "afmelden"…) or taps the opt-out button, the assistant sends a single confirmation and the number goes on the blacklist, so no more MARKETING templates are sent to it. Transactional UTILITY messages the customer still expects (for example an appointment they booked) can continue unless the customer asks to stop everything. Never argue with an opt-out, and never send it a "last offer".
- **Human takeover from the Inbox.** At any time, a team member can open the conversation in the Inbox and take over. The AI then stops replying in that conversation until it is handed back. Hand over to a person for complaints, sensitive topics (medical, legal, financial), payment disputes, or whenever the customer asks for a human. The assistant should say plainly that a team member will reply, and roughly when.
- **Data protection.** In chat as on the phone, the assistant never asks for card numbers, PINs or passwords. For payments it only sends the secure link from the `payment_reminder` template.

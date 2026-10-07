# Relecture NL : lot 02, composants, commerce, tarifs, chaînes en dur, base de connaissances

Périmètre relu ligne par ligne :
- `src/i18n/content/nl/ui/components.ts` (611 l.) et `nl/ui/commerce.ts` (354 l.), comparés à leurs sources FR ;
- `src/i18n/markets.ts` : bloc `nl`, `basePlans`, `SHARED` ;
- chaînes codées en dur : `src/components/*.tsx`, `src/data/personas.ts`, `src/lib/server.ts`, `src/pages/api/**` ;
- `src/data/kb/nl.txt` (70 l., en entier) et `src/data/kb/nl-situations.txt` (l. 1-200, plus une recherche ciblée sur le reste du fichier).

## 1. Synthèse

Le néerlandais est globalement de bonne qualité. L'orthographe est correcte (`’s avonds`, `zzp’er`, `pdf’s`, `excl. btw`), et le vouvoiement « u » est tenu partout, ce qui convient à des PME (praticiens, artisans, cabinets). Les termes locaux attendus sont bien présents : telefonische bereikbaarheid, gemiste oproepen, afspraken inplannen, makelaar, VvE-beheer, AVG, Autoriteit Persoonsgegevens. Les prix sont cohérents entre l'interface, `markets.ts` et la base de connaissances (99 / 249 / 499 USD ; 350 / 1 000 / 2 300 min ; minute supplémentaire à 0,39 / 0,36 / 0,32 ; essai de 14 jours avec 30 min).

**Problèmes systémiques :**
1. **Références à la France restées dans la base de connaissances NL** : 5 occurrences de « Frans nummer », alors qu'un numéro néerlandais s'achète directement dans l'espace client. L'agent risque de dire à un client néerlandais qu'il ne peut pas acheter de numéro local.
2. **Faits contradictoires hérités du FR** :
   - « dertien modules » alors que 14 sont définis (`modules.ts`) ;
   - l'e-commerce est cité comme secteur absent alors qu'il fait partie des 14 secteurs ;
   - « 30 talen » d'un côté, « 80 talen » de l'autre ;
   - une confirmation par e-mail est promise après une demande de rappel, mais `callback.ts` n'en envoie aucune.
3. **E-mail OTP (`api/agent/account.ts`) envoyé en français et en anglais uniquement**, sous la marque FR « Permanence IA » et au nom d'un agent « Lucie » qui n'existe pas côté NL.
4. **Registre téléphonique** : « Goedendag » est flamand ou très guindé aux Pays-Bas. Il faut « Goedemorgen » / « Goedemiddag ».
5. **Terminologie flottante** :
   - abonnement / pakket ;
   - sector / branche / vakgebied ;
   - noms de secteurs différents entre le site et la base de connaissances ;
   - tagline « AI-telefonieassistent » contre « AI-telefoonassistent » partout ailleurs.
6. **Marché** :
   - « excl. btw » est ambigu pour une LLC américaine qui facture des entreprises néerlandaises : la btw est autoliquidée (« btw verlegd ») ;
   - seule la carte bancaire est évoquée, sans iDEAL ni SEPA ;
   - le Bel-me-niet Register et l'ACM ne sont pas mentionnés ;
   - les URL du site sont en français (`/tarifs`, `/offres`, `/fonctionnalites`).

L'annonce « IA + enregistrement » (AI Act art. 50, AVG) est bien prévue dans la base de connaissances. Les cases de consentement du site, elles, ne mentionnent pas l'enregistrement.

## 2. Tableau des corrections

| fichier:ligne | texte actuel | correction proposée (NL) | type | sévérité |
|---|---|---|---|---|
| src/data/kb/nl.txt:50 | Frans nummer of het huidige nummer behouden: doorschakelen… | Uw huidige (Nederlandse) nummer behouden: doorschakelen bij de provider, import via Twilio of Telnyx, of een SIP-koppeling (alle abonnementen). Een nieuw Nederlands nummer kunt u direct in de klantomgeving kopen. | marché | Bloquant |
| src/data/kb/nl-situations.txt:81 | Erbij vertellen dat een Frans nummer via doorschakelen, import of SIP wordt gekoppeld. | Erbij vertellen dat een Nederlands nummer direct in de klantomgeving te koop is, en dat het huidige nummer via doorschakelen, import of SIP gekoppeld kan worden. | marché | Bloquant |
| src/data/kb/nl-situations.txt:114 | …of dat een Frans nummer direct in de klantomgeving te koop is. | …of dat een nummer te koop is in een land dat niet in de lijst staat (bijv. België). | marché | Bloquant |
| src/data/kb/nl-situations.txt:171 | Voor een Frans nummer is het een van deze laatste drie opties. | Een Nederlands nummer kunt u direct kopen (eerste optie); voor landen die niet in de lijst staan, kiest u een van de laatste drie opties. | marché | Majeur |
| src/data/kb/nl-situations.txt:332 (hors 200 l.) | …voor een Frans nummer: doorschakelen, import of SIP. | …voor landen zonder eigen nummer (bijv. België): doorschakelen, import of SIP. | marché | Majeur |
| src/pages/api/agent/account.ts:134-136 | Objet et corps de l'e-mail OTP en FR + EN uniquement (« Votre code de vérification… », « Bonjour… ») | Corps localisé selon la langue du client, par ex. en NL : « Uw verificatiecode: ${code} » / « Goedendag, met deze code kan onze assistent uw PermanenceAI-account inzien: ${code}. De code is 10 minuten geldig. Hebt u niets aangevraagd? Dan kunt u deze e-mail negeren. » | marché | Majeur |
| src/lib/server.ts:61 | from: `Permanence IA <…>` (tous marchés) | Expéditeur selon le marché : `PermanenceAI <…>` pour NL | incohérence | Mineur |
| src/pages/api/agent/account.ts:135 | « Lucie » (nom de l'agent support FR) dans l'e-mail envoyé aux clients NL | Prénom neutre, ou persona NL (« Emma ») ; à aligner avec l'agent Messenger NL | incohérence | Mineur |
| nl/ui/components.ts:110 | Als u uw e-mailadres hebt opgegeven, ontvangt u een bevestiging. | Supprimer la phrase (aucun e-mail de confirmation n'est envoyé par `api/callback.ts`), ou implémenter l'envoi. Sinon : « Wij bellen u terug op het gekozen tijdstip. » | fait | Majeur |
| nl/ui/components.ts:126 | (voor de bevestiging) | (optioneel) — tant qu'aucune confirmation n'est envoyée | fait | Mineur |
| nl/ui/commerce.ts:305 | dertien modules | veertien modules (14 dans `modules.ts`). Le FR est aussi à corriger. | fait | Majeur |
| nl/ui/commerce.ts:64-78 | FEATURE_SEO : 13 entrées, « Oud-klanten terugwinnen » absent | Ajouter `'Oud-klanten terugwinnen': 'Oud-klanten terugwinnen met een AI-belagent'` | SEO | Mineur |
| nl/ui/commerce.ts:252 | Rijscholen, sportscholen, e-commerce, werving, toerisme… | Rijscholen, sportscholen, werving, toerisme, uitzendbureaus… (e-commerce est déjà un des 14 secteurs) | fait | Majeur |
| nl/ui/components.ts:223 | Honderden natuurlijke stemmen, in meer dan 30 talen. | Honderden natuurlijke stemmen, in meer dan 80 talen. (ou aligner partout ; contredit l. 314 et 342) | fait | Majeur |
| src/data/kb/nl-situations.txt:6 | "Goedendag, u spreekt met Emma, de AI-assistent van PermanenceAI. Dit gesprek wordt opgenomen. Waarmee kan ik u helpen?" | "Goedemiddag, u spreekt met Emma, de digitale AI-assistent van PermanenceAI. Dit gesprek wordt opgenomen. Waarmee kan ik u helpen?" + règle : « Goedemorgen (tot 12.00 uur), goedemiddag (tot 18.00 uur), goedenavond ». | calque | Majeur |
| src/data/kb/nl-situations.txt:18 | "Goedendag, ik ben de AI-assistent van PermanenceAI. Wilt u horen…" | "Hallo, ik ben Emma, de AI-assistent van PermanenceAI. Wilt u horen…" | calque | Mineur |
| src/data/kb/nl-situations.txt:120 | "Goedendag, spreek ik met [voornaam]? U spreekt met Emma…" | "Goedemiddag, spreek ik met [voornaam achternaam]? U spreekt met Emma, de AI-assistent van PermanenceAI. Dit gesprek wordt opgenomen. U vroeg ons [gisteren / op 3 oktober] om u terug te bellen over [request_note]. Komt het nu uit om daar twee minuten over te praten?" (au Pays-Bas, on demande la personne par son nom complet ; « om u terug te bellen » est plus idiomatique) | calque | Mineur |
| src/data/kb/nl-situations.txt:133 | "Goedendag, met de AI-assistent van PermanenceAI, naar aanleiding van uw terugbelverzoek. …of mailt u ons via…" | "Goedemiddag, u spreekt met Emma, de AI-assistent van PermanenceAI, naar aanleiding van uw terugbelverzoek. We proberen het later nog eens. U kunt ons ook mailen via contact@permanenceia.com." | calque | Mineur |
| nl/ui/components.ts:532 | Goedendag, ik wil graag een afspraak maken. | Goedemorgen, ik wil graag een afspraak maken. | calque | Mineur |
| src/data/kb/nl.txt:18 et nl-situations.txt:67 (A7) | "donderdag 9 oktober om 14.30 uur" / 2026-10-09T14:30:00+02:00 | Le 9 octobre 2026 est un vendredi : "vrijdag 9 oktober om 14.30 uur Nederlandse tijd". Le modèle risque de reprendre une date fausse. | fait | Mineur |
| src/data/kb/nl.txt:70 | Hij zegt het lokale alarmnummer te bellen | Hij vraagt de beller direct het alarmnummer te bellen: in Nederland en België 112 (voor de huisarts buiten kantoortijd: de huisartsenpost). (« Hij zegt … te bellen » se lit comme « il dit qu'il va appeler ») | faute | Majeur |
| src/data/kb/nl.txt:68 et nl-situations.txt:239 | Frankrijk: … (Bloctel bestaat niet meer). | Inutile dans la base NL (à supprimer), ou à vérifier : l'affirmation « Bloctel n'existe plus » est juridiquement risquée. | marché | Mineur |
| src/data/kb/nl.txt:67 | Nederland: telemarketing naar consumenten mag alleen met hun voorafgaande toestemming of binnen een bestaande klantrelatie… | …(Telecommunicatiewet art. 11.7, sinds 1 juli 2021; toezicht door de ACM). Bestaande klanten kunnen altijd bezwaar maken; zakelijke nummers in het Bel-me-niet Register worden niet gebeld. | marché | Mineur |
| src/data/kb/nl.txt:13 | ("U heeft ons gevraagd u terug te bellen over…") | ("U hebt ons gevraagd u terug te bellen over…") : le site utilise « u hebt » (components l. 110). Les deux formes sont admises, mais il faut choisir. | incohérence | Mineur |
| src/data/kb/nl.txt:57 | Onbeperkt agents, campagnes en kennisbanken | Onbeperkt aantal agents, campagnes en kennisbanken | faute | Mineur |
| src/data/kb/nl.txt:58 | onderhandelde minuutprijs | minuutprijs in overleg | calque | Mineur |
| src/data/kb/nl.txt:63 ; nl-situations.txt:56, 80 | er wordt een kaart gevraagd / kaart gevraagd | er is een creditcard nodig (geen iDEAL) — préciser le moyen de paiement réel | marché | Mineur |
| src/data/kb/nl-situations.txt:19 | Inkomende oproep (bijvoorbeeld de Israëlische lijn 02-376-7085, in het Hebreeuws)… | Inkomende oproep (op een eigen lijn van PermanenceAI): … (l'exemple israélien n'a aucun sens pour l'agent NL) | marché | Mineur |
| src/data/kb/nl-situations.txt:30 | "Met 10 gemiste oproepen per week en 80 dollar per klant is dat ongeveer 3.400 dollar per maand…" | "…en 80 euro per klant is dat ongeveer 3.400 euro per maand…" (la valeur client d'une PME NL se compte en euros, seul l'abonnement est en USD) | marché | Mineur |
| src/data/kb/nl-situations.txt:82 | Voor een volledige configuratie rekent u op een à twee dagen | Voor een volledige configuratie moet u rekenen op één à twee dagen | faute | Mineur |
| src/data/kb/nl-situations.txt:89 | Thuisdiensten (…): … en belt offertes na 48 uur na. | Service aan huis (…): … en belt openstaande offertes na twee dagen na. (aligner sur le nom du secteur sur le site) | incohérence | Mineur |
| src/data/kb/nl-situations.txt:90 | afspraken, verzettingen en herinneringen | afspraken, verplaatsingen en herinneringen (« verzettingen » n'existe pas dans ce sens) | faute | Mineur |
| src/data/kb/nl-situations.txt:92, 93, 97, 100 | Dierenklinieken / Makelaardij / Restaurants en horeca / Verzekerings- en hypotheekadviseurs | Dierenartspraktijken / Vastgoed (makelaars) / Horeca en hotels / Assurantie- en hypotheekadviseurs (noms identiques à `sectors.ts`) | incohérence | Mineur |
| src/i18n/markets.ts:125 | tagline: 'AI-telefonieassistent' (affiché sous le logo) | 'AI-telefoonassistent' (terme utilisé dans tous les titles/H1) ou 'AI-receptionist, 24/7' | incohérence | Majeur |
| nl/ui/components.ts:61 | Getoonde prijzen zijn excl. btw. | Getoonde prijzen zijn in USD, exclusief btw. Zakelijke klanten in de EU: btw verlegd. (à valider par un fiscaliste) | marché/juridique | Majeur |
| nl/ui/commerce.ts:164 | Alle prijzen … zijn exclusief belastingen. | Alle prijzen … zijn in Amerikaanse dollars, exclusief btw. (même formule partout) | incohérence | Mineur |
| nl/ui/components.ts:18 et 50 | Hulpbronnen | Resources (ou Kennis & hulp) : « Hulpbronnen » est un calque de « Ressources », peu usité dans un menu SaaS | calque | Mineur |
| nl/ui/components.ts:24, 56 | Help bij de klantomgeving | Helpcentrum | calque | Mineur |
| nl/ui/components.ts:81 | Kaart gevraagd bij activering, tijdens de proefperiode wordt niets afgeschreven | Creditcard nodig bij activering; tijdens de proefperiode wordt niets afgeschreven | calque/typo | Mineur |
| nl/ui/components.ts:81 | Op te zeggen vanuit uw klantomgeving | Opzeggen kan direct in uw klantomgeving | calque | Mineur |
| nl/ui/components.ts:129 | Ik ga ermee akkoord dat ik op het opgegeven nummer word teruggebeld, ook door een AI-spraakagent van ${brand}. … | …ook door een AI-spraakagent van ${brand}. Het gesprek wordt opgenomen. Mijn gegevens worden alleen gebruikt om mijn aanvraag af te handelen (zie de privacyverklaring). | juridique | Majeur |
| nl/ui/components.ts:383 | Ik ga ermee akkoord dat de AI-demonstratieagent mij belt. | Ik ga ermee akkoord dat de AI-demoagent mij belt. Het gesprek wordt opgenomen. | juridique | Majeur |
| nl/ui/components.ts:136 | De agent stelt uw vragen en stuurt u een volledige aanvraag. | De agent stelt de vragen die u belangrijk vindt en stuurt u een complete aanvraag. | calque | Mineur |
| nl/ui/components.ts:139 | Houd mensen vrij voor wat belangrijk is | Laat uw team zich richten op wat ertoe doet | calque | Mineur |
| nl/ui/components.ts:145 ; commerce.ts:278 | Bekijk wat erbij hoort / Wat erbij hoort | Bekijk wat er inbegrepen is / Wat er inbegrepen is | calque | Mineur |
| nl/ui/components.ts:175 | Ontvang een demonstratiegesprek | Vraag een demogesprek aan | calque | Mineur |
| nl/ui/components.ts:186 ; commerce.ts:200 | Onderhandelde prijs per minuut / Onderhandeld volume | Prijs per minuut in overleg / Volume in overleg | calque | Mineur |
| nl/ui/components.ts:190 | Factuurperiode | Facturering | calque | Mineur |
| nl/ui/components.ts:202 | Functies inbegrepen in elk abonnement | Inbegrepen functies per abonnement | calque | Mineur |
| nl/ui/components.ts:218 | Alles inbegrepen, geen enkele API-sleutel | Alles inbegrepen, geen API-sleutels nodig | calque | Mineur |
| nl/ui/components.ts:233 vs 47 | Tegoed opwaarderen / Minuten opwaarderen | Uniformiser sur « Tegoed opwaarderen » | incohérence | Mineur |
| nl/ui/components.ts:246 | Wij stellen u het grotere abonnement voor. | Wij raden u het hogere abonnement aan. | calque | Mineur |
| nl/ui/components.ts:284 | ' / u' | ' / uur' (« u » se confond avec le pronom « u ») | typo | Mineur |
| nl/ui/components.ts:289 | Boven ${minutes} min per maand op vaste basis vraagt u een aanbod op maat aan. | Gaat u structureel boven ${minutes} min per maand? Vraag dan een offerte op maat aan. | calque | Mineur |
| nl/ui/components.ts:300 vs 517/520 | ${conversion} % (avec espace) / 62% (sans espace) | ${conversion}% : en néerlandais, pas d'espace avant % | typo | Mineur |
| nl/ui/components.ts:312 | Bereikbaar | Bereikbaarheid | faute | Mineur |
| nl/ui/components.ts:352 | Spreek een adviseur | Spreek met een adviseur | faute | Mineur |
| nl/ui/components.ts:369 | Hoe wilt u het proberen | Hoe wilt u het proberen? | typo | Mineur |
| nl/ui/components.ts:374 | Onze assistent opent hier. Start het spraakgesprek of typ, en vertel uw vakgebied en de rol die ze moet spelen. | Onze assistent wordt hier geopend. Start het spraakgesprek of typ een bericht, en vertel haar uw vakgebied en welke rol ze moet spelen. | faute | Mineur |
| nl/ui/components.ts:160, 374 ; commerce.ts:103, 273 | agent = « hij » ; assistante = « ze » ; persona par défaut Emma (féminine) | Choisir une règle : « de agent … hij » pour le générique, « Emma … ze » pour la persona, et l'appliquer partout | incohérence | Mineur |
| nl/ui/components.ts:378, 608 ; commerce.ts:56 | „Bel mijn telefoon” / „leveringsvoorwaarden.pdf” | ‘Bel mijn telefoon’ (guillemets simples, usage néerlandais courant ; „…” est vieilli) | typo | Mineur |
| nl/ui/components.ts:115, 368 ; 425 | Andere branche / Uw vakgebied / Kies uw branche (libellé « Sector ») | Uniformiser : « Sector » / « Andere sector » / « Uw sector » / « Kies uw sector » | incohérence | Mineur |
| nl/ui/components.ts:397 | Barbiers | Barbershops | marché | Mineur |
| nl/ui/components.ts:400 | 'België', 'Zwitserland', 'Canadees-Frans' (dans une liste de langues) | 'Belgisch-Frans', 'Zwitsers-Frans', 'Canadees-Frans' (ou 'Vlaams' pour le drapeau BE) | faute | Mineur |
| nl/ui/components.ts:407 | Stelt uw vragen en maakt overzichten klaar om mee aan de slag te gaan. | Stelt uw vragen en levert kant-en-klare dossiers aan. | calque | Mineur |
| nl/ui/components.ts:409 | brengt uw contacten weer in beweging | heractiveert slapende klanten | calque | Mineur |
| nl/ui/components.ts:429 | Aanbevolen pakket | Aanbevolen abonnement | incohérence | Mineur |
| nl/ui/components.ts:434 | Soorten gebruik | Toepassingen | calque | Mineur |
| nl/ui/components.ts:446 | Sortering volgens uw regels en directe melding. | Triage volgens uw regels, met directe melding. | calque | Mineur |
| nl/ui/components.ts:497 | CRM-kaart automatisch aangemaakt | Contact automatisch aangemaakt in uw CRM | calque | Mineur |
| nl/ui/components.ts:415 ; personas.ts:57 | Jade, Daan, Katie en hun collega’s… (TEAM_PERSONAS : Jade, Daan, Katie, Jack, Manuela, Tomasz) | Pour le site NL, mettre Emma en tête (persona NL) : « Emma, Daan, Katie… » | marché | Mineur |
| nl/ui/commerce.ts:92 | …en de aanvraag komt klaar om af te handelen binnen. | …en de aanvraag komt kant-en-klaar bij u binnen. | calque | Mineur |
| nl/ui/commerce.ts:103 | Hij geeft het juiste antwoord en verbindt door naar uw team wat een mens nodig heeft. | Hij geeft het juiste antwoord en verbindt door naar uw team als er een mens nodig is. | calque | Mineur |
| nl/ui/commerce.ts:108 | Kwalificeer uw prospects | Kwalificeer uw leads (terme utilisé partout ailleurs) | incohérence | Mineur |
| nl/ui/commerce.ts:127 | Sluit uw gesprekken aan | Koppel uw telefoonlijn | calque | Mineur |
| nl/ui/commerce.ts:202-203 | Verplichting: Geen | Minimale looptijd: Geen | calque | Mineur |
| nl/ui/commerce.ts:276 | Wat het verandert voor uw ${…} | Wat het oplevert voor uw ${…} | calque | Mineur |
| nl/ui/commerce.ts:281 | de agent koppelt ermee | de agent sluit erop aan | calque | Mineur |
| nl/ui/commerce.ts:318 | Waarvoor dient het | Waarvoor gebruikt u het? | calque | Mineur |
| nl/ui/commerce.ts:333 | …voedt elk gesprek uw tools… Hier zijn er een paar. | …stuurt elk gesprek gegevens door naar uw tools… Een greep: | calque | Mineur |
| nl/ui/commerce.ts:19 | Telefoonservice tandarts en kliniek met AI | Telefoonservice voor tandartspraktijken met AI (mot-clé recherché : « tandartspraktijk ») | SEO | Mineur |
| nl/ui/commerce.ts:14 (clé) et sectors.ts:9 | Service aan huis | Installateurs en monteurs aan huis (« Service aan huis » calque « dépannage à domicile » et n'est pas une catégorie de recherche) | calque/SEO | Mineur |

## 3. Manques et ajouts recommandés

1. **Mentions btw / facturation pour une LLC américaine** : préciser « btw verlegd » (autoliquidation B2B) sur les factures et dans le pied de page. Prévoir la saisie du btw-nummer (et éventuellement du KvK-nummer) dans le tunnel d'inscription. Une validation par un fiscaliste néerlandais est nécessaire.
2. **Moyens de paiement** : iDEAL et SEPA-incasso sont attendus par les PME néerlandaises. Au minimum, indiquer clairement « creditcard » au lieu de « kaart ».
3. **Prospection téléphonique** : ajouter dans la base de connaissances et dans le bloc sécurité :
   - Telecommunicatiewet art. 11.7 ;
   - ACM comme autorité de contrôle ;
   - Bel-me-niet Register (numéros professionnels / droit d'opposition) ;
   - pour la Belgique (si le site NL vise aussi la Flandre), la liste « Bel-me-niet-meer » et 112.
4. **AI Act art. 50 (en vigueur depuis le 2/8/2026) et enregistrement** :
   - la base de connaissances est conforme (annonce de l'IA et de l'enregistrement dès la première phrase) ;
   - en revanche, les cases de consentement du formulaire de rappel et de la démo ne mentionnent pas l'enregistrement, et aucune ne renvoie vers la privacyverklaring ;
   - envisager de citer l'article sur la page Sécurité (« Voldoet aan de transparantieplicht van de AI-verordening »).
5. **E-mail OTP et e-mails transactionnels** : il faut un modèle par langue (NL), une marque par marché (`PermanenceAI`) et une persona cohérente (pas « Lucie »).
6. **URL en français sur le site NL** (`/tarifs`, `/offres/receptionniste`, `/fonctionnalites/…`, `/aide`) : c'est un handicap SEO. Prévoir des slugs néerlandais (`/prijzen`, `/abonnementen`, `/functies`, `/hulp`).
7. **Sujets locaux absents** :
   - aucune mention de la huisartsenpost ni de la triage-assistente pour le secteur santé ;
   - aucun huisarts parmi les secteurs, alors que c'est un gros marché de la telefonische bereikbaarheid aux Pays-Bas ;
   - Koningsdag et les jours fériés ne sont pas évoqués dans les règles d'horaires (« vakanties actueel » seulement).
8. **Affichage des prix** : `Intl` avec `nl-NL` et `narrowSymbol` affiche « $ 99,00 ». Ajouter une fois « US$ » ou « Amerikaanse dollars » près des grilles, pour éviter toute confusion avec l'euro.
9. **Cohérence des noms de secteurs** : `sectors.ts`, l'interface et la base de connaissances doivent utiliser exactement les mêmes libellés, car l'agent cite les secteurs au téléphone.
10. **Correction de l'exemple de date** dans les deux fichiers de la base de connaissances : 9 octobre 2026 = vrijdag. Mieux vaut un exemple sans jour de semaine figé.

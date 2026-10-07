// Interfaceteksten van de niet-commerciële pagina’s (demo, contact, FAQ, proefperiode, help, over ons,
// beveiliging, 404, juridische pagina’s, blog). De variabelen (merk, bedrijf, e-mail, proefduur…)
// worden via functies doorgegeven: het merk komt uit de markt, het bedrijf en de e-mail uit SITE.
import type { Block, ChatLine, LegalSection, LegalVars, Rich, Span } from '../../fr/ui/pages';

export type { Block, ChatLine, LegalSection, LegalVars, Rich, Span };

const ADDRESS = '1603 Capitol Ave, Suite 413G-2408, Cheyenne, WY 82001';

export const UI_PAGES = {
  demo: {
    meta: {
      title: (brand: string) => `Demo AI-telefoonassistent: probeer hem live · ${brand}`,
      description: 'Hoor hoe een AI-telefoonassistent klinkt: praat live met de agent of ontvang een demogesprek voor uw sector. Gratis en vrijblijvend, probeer het nu.',
    },
    h1: 'Probeer onze AI-telefoonassistent nu live',
    intro: 'Laat uw nummer achter en kies uw sector: de agent belt u en speelt een scenario uit uw vak. U hoort zijn stem, zijn tempo en de manier waarop hij een aanvraag kwalificeert.',
    widgetHint: 'Liever meteen proberen? Klik op de chatknop rechtsonder in beeld: onze assistent antwoordt u via spraak of chat.',
    formTitle: 'Vraag uw demogesprek aan',
    formIntro: 'Gratis gesprek, op het tijdstip van uw keuze.',
    submit: 'Demogesprek aanvragen',
    hearTitle: 'Wat u te horen krijgt',
    hearIntro: 'Een voorbeeldgesprek in een tandartspraktijk: de agent herkent de vraag, stelt een tijdslot voor en maakt het overzicht klaar voor het team.',
    steps: [
      { title: 'U laat uw nummer achter', text: 'Met uw sector en uw tijdslot.' },
      { title: 'De agent belt u', text: 'Hij speelt een scenario uit uw vak.' },
      { title: 'U test vrijuit', text: 'Stel uw vragen, verander van gedachten, onderbreek hem.' },
    ],
    liveCallTitle: 'Agent voor de tandartspraktijk',
    scenariosTitle: 'Kies uw scenario',
  },

  contact: {
    meta: {
      title: (brand: string) => `Contact: advies over uw AI-telefoonassistent · ${brand}`,
      description: 'Vragen over een AI-telefoonassistent voor uw bedrijf? Laat uw nummer achter, wij bellen u terug voor verkoop, demo of support. Kies uw tijdslot.',
    },
    h1: 'Laat uw nummer achter, wij bellen u terug',
    intro: 'Wij publiceren geen telefoonnummer: wij bellen u terug, op het tijdslot dat u kiest. U kunt ons ook mailen.',
    commercialTitle: 'Terugbelverzoek: verkoop',
    commercialText: 'Vragen over de abonnementen, demonstratie, offerte op maat.',
    supportTitle: 'Terugbelverzoek: support',
    supportText: 'Klanten: configuratie, nummers, integraties.',
    emailTitle: 'E-mail',
    legal: (brand: string, company: string) => `${brand} is een merk van ${company}, ${ADDRESS}, Verenigde Staten.`,
    tabsLabel: 'Soort aanvraag',
    tabCommercial: 'Verkoop en demo',
    tabSupport: 'Support',
  },

  faq: {
    meta: {
      title: (brand: string) => `Veelgestelde vragen: AI-telefoonassistent · ${brand}`,
      description: (brand: string) => `Hoe werkt een AI-telefoonassistent? Telefonie, SIP, agenda, WhatsApp, AVG, proefperiode en prijzen: alle antwoorden over ${brand}. Bekijk de FAQ.`,
    },
    h1: 'Veelgestelde vragen over de AI-telefoonassistent',
    intro: 'Staat uw vraag er niet tussen? Laat uw nummer achter, een adviseur belt u terug.',
    general: 'Het platform',
    pricing: 'Prijzen en proefperiode',
  },

  trial: {
    meta: {
      title: (days: number, minutes: number, brand: string) => `AI-telefoonassistent ${days} dagen gratis proberen · ${brand}`,
      description: (days: number, minutes: number, brand: string) => `Test uw AI-telefoonassistent: maak uw ${brand}-account aan, ${days} dagen gratis, ${minutes} minuten inbegrepen, niets afgeschreven, altijd opzegbaar.`,
    },
    h1: (minutes: number) => `Test de AI-telefoonassistent met ${minutes} gratis minuten`,
    intro: (days: number) => `Maak uw account aan, kies het abonnement dat u wilt testen en probeer uw agent ${days} dagen lang in uw eigen bedrijf.`,
    points: (days: number) => [
      `Creditcard gevraagd bij activering; ${days} dagen lang wordt er niets afgeschreven`,
      'Zeg in uw klantomgeving op vóór het einde van de proefperiode en u betaalt niets',
      'Live demo en webwidget inbegrepen',
      'Begeleiding bij de eerste configuratie',
    ],
    createTitle: 'Mijn account aanmaken',
    createSteps: [
      '1. Maak uw account aan met uw zakelijke e-mailadres.',
      '2. Kies in uw klantomgeving het abonnement dat u wilt testen.',
      '3. Stel uw agent in en voer uw eerste gesprekken.',
    ],
    createCta: 'Mijn gratis account aanmaken',
    already: 'Al klant?',
    login: 'Inloggen',
    sentTitle: 'Uw aanvraag is ontvangen',
    sentText: 'Een adviseur belt u terug om samen met u uw eerste agent in te stellen.',
    sentCta: 'Nu mijn account aanmaken',
    formTitle: 'Liever begeleid worden?',
    formIntro: 'Laat uw gegevens achter: een adviseur belt u terug om samen met u de proefperiode te starten.',
    name: 'Voor- en achternaam',
    company: 'Bedrijf',
    email: 'Zakelijk e-mailadres',
    phone: 'Telefoon',
    sector: 'Sector',
    sectorPlaceholder: 'Kies…',
    sectorOther: 'Andere sector',
    plan: 'Gewenst abonnement',
    planPrice: (price: string) => ` — ${price} per maand excl. btw`,
    planFree: ' — gratis',
    planQuote: ' — prijs op aanvraag',
    terms: [
      'Ik ga akkoord met de ',
      { a: 'algemene voorwaarden', href: '/cgu' },
      ', heb het ',
      { a: 'privacybeleid', href: '/confidentialite' },
      ' gelezen en wil worden teruggebeld voor het instellen van mijn account.',
    ] as Rich,
    termsRequired: 'Ga akkoord met de voorwaarden om teruggebeld te worden.',
    sendError: 'De aanmelding kon niet worden verzonden. Probeer het opnieuw.',
    sending: 'Verzenden…',
    submit: 'Bel mij terug',
  },

  help: {
    meta: {
      title: (brand: string) => `Handleiding: AI-telefoonassistent instellen · ${brand}`,
      description: 'Nederlandstalige handleiding voor uw klantomgeving: menu’s vertaald, een agent aanmaken, nummers, agenda, widget, minuten en facturatie. Begin hier.',
    },
    breadcrumb: 'Help',
    h1: 'Help bij uw klantomgeving: uw AI-telefoonassistent instellen',
    intro: 'Uw klantomgeving is in het Engels. Deze gids vertaalt elk menu en begeleidt u stap voor stap. In de klantomgeving helpt ook de hulpassistent (chatknop rechtsonder) u verder in uw eigen taal, dus ook in het Nederlands, schriftelijk of gesproken.',
    openSpace: 'Open mijn klantomgeving',
    chatLabel: 'Voorbeeld van een gesprek met de hulpassistent',
    chatTitle: (brand: string) => `Help ${brand}`,
    chatMode: 'Schriftelijk of gesproken',
    chat: [
      { me: true, text: 'Waar voeg ik minuten toe?' },
      { text: ['Open rechtsboven het menu van uw profiel en klik op ', { b: 'Add credits' }, ' (tegoed toevoegen). Kies een opwaardering: het tegoed vervalt niet.'] },
      { me: true, text: 'En hoe zet ik de agent op mijn website?' },
      { text: ['Open uw agent in ', { b: 'Assistants' }, ', onderdeel ', { b: 'Web widget' }, ' (webwidget): activeer de widget en kopieer de code. Zullen we het samen doen?'] },
    ] as ChatLine[],
    tasksTitle: 'Veelvoorkomende taken, stap voor stap',
    menuTitle: 'De menu’s van de klantomgeving, vertaald',
    colMenu: 'Menu (Engels)',
    colLabel: 'In het Nederlands',
    colText: 'Waarvoor gebruikt u het',
    glossaryTitle: 'Kleine woordenlijst',
    moreBefore: 'Staat uw vraag hier niet bij? Mail naar ',
    moreAfter: ' of doe een terugbelverzoek via de contactpagina.',
  },

  about: {
    meta: {
      title: (brand: string) => `Over ons: AI-telefoonservice voor bedrijven · ${brand}`,
      description: (brand: string, company: string) => `${brand} maakt telefoonservice voor bedrijven toegankelijk: AI-spraakagents die elk gesprek beantwoorden. Een merk van ${company}.`,
    },
    h1: 'Elk gesprek verdient een antwoord',
    intro: (brand: string) => `${brand} is ontstaan vanuit een simpele constatering: kleine bedrijven en zzp’ers verliezen klanten omdat niemand op het juiste moment kan opnemen.`,
    photoAlt: 'Een ondernemer bekijkt haar telefoon op kantoor',
    paragraphs: [
      'Vakmensen, praktijken, kantoren, garages, salons, restaurants: uw team is bezig met uw klanten. Ondertussen gaat de telefoon.',
      'Wij leveren AI-spraakagents die als virtuele receptionist opnemen, kwalificeren, afspraken boeken en terugbellen. Zo blijft uw telefonische bereikbaarheid op orde, ingesteld op uw vak, met duidelijke prijzen en zonder verplichtingen.',
    ],
    principlesTitle: 'Onze principes',
    principles: [
      'De agent stelt zich eerlijk voor als AI',
      'Bij belangrijke zaken houdt een mens de regie',
      'Prijzen excl. btw duidelijk vermeld, zonder verborgen kosten',
      'Geen cijfers of beloften die we niet kunnen aantonen',
    ],
    legal: (brand: string, company: string) => `${brand} is een merk van ${company}, een vennootschap geregistreerd in de staat Wyoming (Verenigde Staten) onder nummer 2026-001905061.`,
  },

  security: {
    meta: {
      title: (brand: string) => `Beveiliging en AVG van uw AI-telefonie · ${brand}`,
      description: (brand: string) => `Toestemming, versleuteling tijdens transport, bewaartermijn en traceerbaarheid: zo beschermt ${brand} de gesprekken van uw AI-telefoonassistent.`,
    },
    h1: 'Beveiliging en AVG-compliance van uw AI-telefoongesprekken',
    intro: 'Uw gesprekken bevatten persoonsgegevens. Hier leest u welke beveiligingsmaatregelen er zijn en welke instellingen u hebt om de AVG na te leven.',
    settingsTitle: 'Uw instellingen',
    settings: [
      'Bewaartermijn van opnames en transcripties',
      'Een gesprek of contact op verzoek verwijderen',
      'Uitsluitingslijst voor uitgaande gesprekken',
      'Toegestane beltijden',
      'Melding “AI-assistent” aan het begin van elk gesprek (altijd actief, formulering aanpasbaar)',
      'Opname in- of uitschakelen, aan het begin van het gesprek aan de beller gemeld',
      'Woorden of onderwerpen die de agent nooit mag aansnijden (prijsopgaven, diagnoses, advies)',
    ],
    infraTitle: 'Een oplossing op gecertificeerde infrastructuur',
    infraIntro: 'Onze oplossing (agents, geplande terugbelgesprekken, routering, website en klantomgeving) draait op de infrastructuur van een gecertificeerde technische leverancier. Die certificeringen zijn van de leverancier; we kozen hem zodat u hetzelfde niveau krijgt.',
    infraItems: ['Leverancier gecertificeerd volgens ISO/IEC 27001:2022 (informatiebeveiliging) en ISO 9001:2015 (kwaliteit)', 'AES-256-versleuteling van opgeslagen gegevens en TLS tijdens transport', 'Toegang op basis van rollen, tweestapsverificatie en auditlogs', 'Automatische back-ups en herstel over meerdere zones', 'Ingericht op AVG-naleving, met instelbare bewaartermijnen en automatische verwijdering', 'Betalingen via Stripe, gecertificeerd volgens PCI DSS Level 1'],
    commitmentsTitle: 'Onze toezeggingen',
    commitments: [
      'De agent stelt zich voor als AI en doet zich niet voor als mens',
      'Uw campagnes mogen alleen contacten bellen die daarmee hebben ingestemd; een ingebouwde uitsluitingslijst sluit wie bezwaar maakt uit',
      'Geen medische, juridische of financiële diagnose door de agent',
      'Uw gegevens worden nooit verkocht: ze worden gebruikt om de dienst te leveren; alleen geaggregeerde of geanonimiseerde gegevens dienen om hem te verbeteren',
      'Begeleiding bij het aanpassen van uw privacyverklaringen',
      'Verwerkersovereenkomst (DPA) opgenomen in de voorwaarden (artikel 8); ondertekende versie op aanvraag',
      'Recht op verwijdering: een gesprek, de opname en de transcriptie worden op verzoek gewist',
      'De agent meldt dat het gesprek wordt opgenomen; wie dat niet wil, kan vragen om per e-mail te worden gecontacteerd',
      'Uitgaande campagnes: u bewaart het bewijs van de toestemming; in Nederland is voor telemarketing aan consumenten (ook eenmanszaken en zzp’ers) sinds 1 juli 2021 in principe voorafgaande toestemming nodig (artikel 11.7 Telecommunicatiewet)',
    ],
    rights: ['Voor vragen of om uw rechten uit te oefenen: ', { a: 'privacybeleid', href: '/confidentialite' }, '.'] as Rich,
  },

  accessibility: {
    meta: {
      title: (brand: string) => `Toegankelijkheidsverklaring — ${brand}`,
      description: (brand: string) => `Toegankelijkheidsniveau van de website van ${brand}, genomen maatregelen, bekende beperkingen en contact om een probleem te melden.`,
    },
    h1: 'Toegankelijkheidsverklaring',
    updated: 'Laatst bijgewerkt: 7 oktober 2026',
    intro: (brand: string, company: string) => `${brand} is een dienst van ${company}, een bedrijf geregistreerd in de staat Wyoming (Verenigde Staten). Wij willen dat iedereen deze website kan gebruiken, ook mensen met een beperking.`,
    sections: [
      { title: 'Beoogd niveau', items: ['De website streeft naar conformiteit met niveau AA van de WCAG 2.1-richtlijnen, in lijn met de algemene doelen van de Europese toegankelijkheidswet (European Accessibility Act).', 'Status: gedeeltelijk conform. Bekende afwijkingen staan hieronder en worden opgelost.'] },
      { title: 'Genomen maatregelen', items: ['Taal en leesrichting op elke pagina aangegeven (ook Hebreeuws, van rechts naar links).', 'Volledige bediening met het toetsenbord, een link om direct naar de inhoud te gaan, zichtbare focus.', 'Logisch opgebouwde koppen, alternatieve teksten bij informatieve afbeeldingen, formulieren met labels.', 'Versterkt kleurcontrast, tekst vergroot tot 200% zonder verlies van informatie, opmaak geschikt voor mobiel.', 'Minder animaties wanneer uw systeem daarom vraagt (instelling „beweging beperken”).'] },
      { title: 'Bekende beperkingen', items: ['Het chat- en spraakdemovenster wordt geleverd door onze technische leverancier: de bediening met toetsenbord en schermlezer kan onvolledig zijn. Het terugbelformulier en ons e-mailadres zijn altijd beschikbaar.', 'De klantomgeving (app.permanenceia.com) is in het Engels en draait op het platform van onze leverancier.', 'Sommige pdf-documenten (verkooppresentatie) zijn niet volledig getagd.'] },
      { title: 'Beoordeling', items: ['Interne beoordeling uitgevoerd op 7 oktober 2026 op alle openbare pagina’s, met automatische tools en handmatige controle (toetsenbord, contrast, schermlezer).'] },
    ],
    contactTitle: 'Een probleem melden',
    contact: (company: string, email: string) => `Contactpersoon toegankelijkheid: ${company}. Mail ons op ${email} met een beschrijving van de pagina en het probleem: wij reageren binnen 5 werkdagen en bieden een passende oplossing (informatie in een ander formaat, hulp per e-mail of telefoon).`,
  },

  notFound: {
    meta: {
      title: (brand: string) => `Pagina niet gevonden — ${brand}`,
      description: 'Deze pagina bestaat niet of is verplaatst.',
    },
    h1: 'Deze pagina bestaat niet of is verplaatst',
    text: 'Ga terug naar de homepage of bekijk onze abonnementen.',
    home: 'Terug naar de homepage',
    pricing: 'Bekijk de prijzen',
  },

  terms: {
    meta: {
      title: (brand: string) => `Algemene voorwaarden — ${brand}`,
      description: (brand: string) => `Lees de algemene voorwaarden die van toepassing zijn op de abonnementen en diensten van de AI-telefoniedienst van ${brand}.`,
    },
    h1: 'Algemene voorwaarden',
    updated: 'Van toepassing op zakelijke klanten • Laatst bijgewerkt: 6 oktober 2026',
    sections: ({ brand, company, email, appHost, legal }: LegalVars): LegalSection[] => {
      const mail = { a: email, href: `mailto:${email}` };
      return [
        {
          title: 'Artikel 1 — Definities en aanvaarding',
          body: [
            { p: ['Deze algemene voorwaarden (de „Voorwaarden”) regelen de toegang tot en het gebruik van de diensten die onder het merk ', { strong: brand }, ` worden aangeboden door ${company}, een Limited Liability Company uit de staat Wyoming (Verenigde Staten), ${ADDRESS} („wij”).`] },
            {
              ul: [
                [{ strong: 'Dienst:' }, ` het softwareplatform, de klantomgeving ${appHost}, de AI-spraak- en chatagents, de webwidget, berichtenkanalen (WhatsApp, sms, Messenger, Instagram), campagnes, automatiseringen, telefoonnummers, SIP-koppeling en alle bijbehorende functies.`],
                [{ strong: 'Klant:' }, ' het bedrijf of de professional die een account aanmaakt of een abonnement afsluit.'],
                [{ strong: 'Gebruiker:' }, ' iedere persoon die de Klant toegang geeft tot zijn account.'],
                [{ strong: 'Klantinhoud:' }, ' de gegevens, instructies (prompts), kennisbanken, bestanden, stemfragmenten, contactlijsten, opnames en berichten die aan de Dienst worden verstrekt of voor de Klant worden gegenereerd.'],
                [{ strong: 'Ontvangers:' }, ' de personen die de agent van de Klant bellen, of die via die agent worden gebeld of berichten ontvangen.'],
                [{ strong: 'Tegoed:' }, ' vooruitbetaalde minuten, berichtentegoed en opwaarderingen.'],
              ],
            },
            { p: 'De Dienst is uitsluitend bestemd voor professionals die handelen in de uitoefening van hun beroep of bedrijf; hij wordt niet aan consumenten aangeboden. Door een account aan te maken, het selectievakje voor aanvaarding aan te vinken of de Dienst te gebruiken, aanvaardt de Klant de Voorwaarden. Wie ze aanvaardt, verklaart minstens 18 jaar oud te zijn en bevoegd om de entiteit die hij vertegenwoordigt te binden.' },
          ],
        },
        {
          title: 'Artikel 2 — Account en beveiliging',
          body: [
            {
              ul: [
                'De Klant verstrekt juiste en volledige gegevens (naam, registratiegegevens, contactgegevens) en houdt die actueel.',
                'Hij houdt zijn inloggegevens en API-sleutels geheim, schakelt de beschikbare beveiliging in (waaronder tweestapsverificatie) en is verantwoordelijk voor alle activiteiten via zijn account, ook door zijn Gebruikers, als waren het de zijne.',
                ['Hij meldt ons onverwijld via ', mail, ' elke onbevoegde toegang of elk vermoed beveiligingsincident.'],
                'Wij kunnen bewijs van identiteit, adres of bedrijfsactiviteit vragen (met name voor de toewijzing van nummers) en een account dat dit niet verstrekt weigeren, beperken of opschorten.',
              ],
            },
          ],
        },
        {
          title: 'Artikel 3 — Gratis proefperiode, geen herroepingsrecht en geen terugbetaling',
          body: [
            { p: 'Bij zijn eerste betaalde abonnement krijgt de Klant een gratis proefperiode van veertien (14) opeenvolgende kalenderdagen, inclusief 30 belminuten, beperkt tot één proefperiode per rechtspersoon, KvK-nummer of ander registratienummer, of betaalmiddel:' },
            {
              ul: [
                [{ strong: 'Betaalmiddel:' }, ' bij activering van de proefperiode wordt een creditcard gevraagd. Tijdens de 14 proefdagen wordt niets afgeschreven.'],
                [{ strong: 'Gebruikslimiet:' }, ' gesprekken zijn tijdens de proefperiode beperkt tot 30 minuten; daarna worden gesprekken opgeschort tot het abonnement ingaat. Sommige functies (nummers, uitgaande campagnes, berichten) kunnen tijdens de proefperiode beperkt zijn.'],
                [{ strong: 'Einde van de proefperiode:' }, ' na 14 dagen start het gekozen abonnement en wordt de eerste periode (maand of jaar) afgeschreven, tenzij de Klant vóór die datum in de klantomgeving heeft opgezegd; dan wordt niets afgeschreven.'],
              ],
            },
            { p: 'Overeenkomsten tussen professionals kennen geen herroepingsrecht zoals dat voor consumenten geldt. Met de gratis proefperiode kan de Klant de Dienst testen vóór enige betaling en kosteloos opzeggen vóór het einde ervan.' },
            { p: [{ strong: 'Elke betaalde periode is volledig verschuldigd en wordt niet terugbetaald' }, ', ook niet gedeeltelijk, ook niet bij opzegging, niet-gebruik, overstap naar een lager abonnement, opschorting of sluiting van het account, en ook niet voor het resterende deel van een jaarperiode. Tegoed wordt niet terugbetaald, is niet overdraagbaar en niet inwisselbaar voor geld; gekocht tegoed vervalt niet zolang het account open is en gaat verloren bij sluiting ervan.'] },
          ],
        },
        {
          title: 'Artikel 4 — Prijzen, facturatie, verlenging en belastingen',
          body: [
            {
              ul: [
                'Prijzen zijn in Amerikaanse dollars (USD), exclusief belastingen. Toepasselijke belastingen worden bij betaling berekend op basis van het land en de fiscale situatie van de Klant (met of zonder btw-nummer) en komen voor zijn rekening. Moet de Klant bronbelasting inhouden, dan verhoogt hij zijn betaling zodat wij het gefactureerde bedrag ontvangen.',
                'Abonnementen worden vooruitbetaald, per maand of per jaar naar keuze van de Klant (jaarlijkse facturatie levert twee maanden gratis op), via onze betaaldienstverlener Stripe. Het abonnement wordt stilzwijgend verlengd met een periode van dezelfde duur en de Klant geeft toestemming voor de bijbehorende terugkerende afschrijvingen. Bij jaarlijkse facturatie worden de inbegrepen minuten elke maand toegekend en is de Dienst identiek.',
                'Gebruik boven het abonnement (extra minuten, berichten, telefoonnummers, kosten van operators of Meta) wordt van het tegoed afgeschreven of gefactureerd tegen de geldende tarieven op de pagina Prijzen of in de klantomgeving.',
                ['De Klant kan op elk moment zonder opzegtermijn opzeggen via zijn dashboard ', { strong: appHost }, '. De opzegging gaat in aan het einde van de reeds betaalde periode (de lopende maand of, bij jaarlijkse facturatie, het lopende jaar), zonder terugbetaling (artikel 3). De Klant kan op elk moment van abonnement wisselen of tegoed opwaarderen; de voorwaarden van de wijziging staan in de klantomgeving.'],
                'Wij kunnen onze prijzen wijzigen met een aankondiging van 30 dagen per e-mail of in de klantomgeving; de nieuwe prijs geldt vanaf de volgende verlenging. Een Klant die niet akkoord gaat, zegt vóór die datum op. Doorberekende kosten van derden (operators, Meta) kunnen wijzigen binnen de termijnen die deze derden opleggen.',
                'Bij een mislukte of te late betaling kunnen wij de Dienst geheel of gedeeltelijk opschorten tot de betaling is voldaan, zonder verlenging van de periode. Over onbetaalde bedragen is rente verschuldigd van 1,5% per maand of, indien lager, het wettelijk toegestane maximum, vermeerderd met de eventuele wettelijke vergoeding voor incassokosten en de werkelijk gemaakte incassokosten.',
                'Elke betwisting van een betaling (chargeback) zonder voorafgaande klacht bij ons leidt tot onmiddellijke opschorting van het account; alle verschuldigde bedragen worden direct opeisbaar, vermeerderd met de kosten van de betwisting en de incasso.',
                'Klachten over een factuur moeten ons binnen 30 dagen na de factuurdatum bereiken; anders geldt de factuur als aanvaard.',
              ],
            },
          ],
        },
        {
          title: 'Artikel 5 — Aanvaardbaar gebruik en verboden inhoud',
          body: [
            { p: 'De Klant gebruikt de Dienst in overeenstemming met het toepasselijke recht en de Voorwaarden. Verboden zijn met name:' },
            {
              ul: [
                'elke onrechtmatige, frauduleuze, misleidende of anderszins oneigenlijke activiteit, waaronder phishing en vishing, oplichting en het zich voordoen als een persoon, bedrijf of overheidsinstantie;',
                'intimidatie, bedreigingen en haatdragende, discriminerende, lasterlijke of gewelddadige inhoud, of inhoud die inbreuk maakt op rechten van derden;',
                'ongevraagde gesprekken en berichten of massale verzending zonder toestemming, en elke omzeiling van een afmelding;',
                'gebruik met een hoog risico: het vervangen of bellen van hulpdiensten; medische, juridische, financiële, verzekerings-, krediet-, arbeids- of huisvestingsbeslissingen baseren op de agent zonder gekwalificeerde menselijke controle; incasso buiten het toepasselijke wettelijke kader; geautomatiseerde politieke of verkiezingsgesprekken of -berichten; inhoud voor volwassenen of seksuele inhoud en elke inhoud waarbij minderjarigen betrokken zijn; kansspelen, wapens, drugs of gereguleerde producten zonder vergunning;',
                'het door de agent verzamelen van bijzondere persoonsgegevens, volledige betaalkaartnummers of officiële identificatienummers zonder rechtsgrond en passende waarborgen;',
                'het gebruik van stemfragmenten (stemklonen) zonder de voorafgaande, gedocumenteerde en intrekbare toestemming van de persoon wiens stem wordt nagebootst;',
                'elke aantasting van de beveiliging of integriteit van de Dienst: kwaadaardige code, ongeautoriseerde penetratie- of belastingtests, het omzeilen van limieten, toegang tot accounts van anderen;',
                'reverse engineering, decompileren of disassembleren (behalve voor zover de wet dit uitdrukkelijk toestaat), geautomatiseerde extractie (scraping), het kopiëren van de Dienst of het gebruik ervan om een concurrerende dienst te bouwen of modellen te trainen;',
                'het doorverkopen, in sublicentie geven, verhuren, ter beschikking stellen aan derden of onder eigen merk (white label) aanbieden van de Dienst zonder onze voorafgaande schriftelijke toestemming.',
              ],
            },
            { p: 'Zonder enige toezichtplicht kunnen wij het gebruik van de Dienst controleren, inhoud verwijderen, een nummer, campagne of bericht blokkeren, het account opschorten (artikel 13) en samenwerken met operators, platforms en autoriteiten.' },
          ],
        },
        {
          title: 'Artikel 6 — Naleving bij gesprekken en berichten',
          body: [
            { p: [{ strong: 'De Klant is als enige verantwoordelijk voor de rechtmatigheid van zijn gesprekken, campagnes en berichten' }, ' volgens het recht van elk land waar Ontvangers zich bevinden, waaronder de AVG, de regels over direct marketing en elektronische communicatie (ePrivacy) en, als hij personen in de Verenigde Staten benadert, de Telephone Consumer Protection Act (TCPA) en de Telemarketing Sales Rule (TSR). In het bijzonder:'] },
            {
              ul: [
                [{ strong: 'Toestemming:' }, ' vóór elk geautomatiseerd, uitgaand of commercieel gesprek of bericht (spraak, sms, WhatsApp) verkrijgt hij de wettelijk vereiste toestemmingen, bewaart hij het bewijs daarvan en respecteert hij elke afmelding onmiddellijk (trefwoord STOP, mondeling of schriftelijk verzoek).'],
                [{ strong: 'Belregisters:' }, ' hij raadpleegt en respecteert de toepasselijke registers en regels: de Nederlandse regels (artikel 11.7 Telecommunicatiewet: voorafgaande toestemming of een bestaande klantrelatie; Bel-me-niet Register), in Frankrijk de uitdrukkelijke voorafgaande toestemming voor telemarketing sinds 11 augustus 2026 (artikel L223-1 van de Code de la consommation), TPS en CTPS (Verenigd Koninkrijk), het Do Not Call Register (Australië), het Registro pubblico delle opposizioni (Italië) en de Poolse regels die voorafgaande toestemming voor telemarketing vereisen.'],
                [{ strong: 'Tijden en frequentie:' }, ' hij respecteert de toegestane beldagen, -tijden en -frequentie.'],
                [{ strong: 'Nummerweergave:' }, ' hij toont een geldig, aan hem toegewezen nummer, vervalst geen nummers en maakt zich duidelijk bekend.'],
                [{ strong: 'Transparantie:' }, ' hij laat Ontvangers vanaf het begin van het contact duidelijk weten dat zij met een AI-systeem communiceren (met name op grond van artikel 50 van de AI-verordening, Verordening (EU) 2024/1689) en, waar de wet dat vereist, dat het gesprek wordt opgenomen of uitgeschreven, en vraagt hun toestemming wanneer die vereist is.'],
                [{ strong: 'Platforms:' }, ' hij volgt het beleid van Meta (WhatsApp Business, Messenger, Instagram), waaronder goedkeuring van sjablonen en gespreksvensters, en de regels van operators (registratie van afzenders, alfanumerieke afzender-ID’s). Deze derden kunnen een account of nummer beperken zonder dat wij aansprakelijk zijn.'],
              ],
            },
            { p: 'Telefoonnummers worden ter beschikking gesteld door operators (zoals Twilio): de Klant krijgt ze in gebruik en wordt er geen eigenaar van. Voor toewijzing kunnen documenten over identiteit, adres of bedrijfsactiviteit nodig zijn; de operator of toezichthouder kan een nummer wijzigen of terugnemen. Een nummer kan bij opzegging, langdurige opschorting of niet-betaling worden vrijgegeven en definitief verloren gaan. Het overzetten van een nummer naar een andere aanbieder hangt af van de technische en regelgevende haalbaarheid.' },
            { p: [{ strong: 'Geen noodoproepen.' }, ' Met de Dienst kunnen geen hulpdiensten worden gebeld (112, 999, 000, 911 enz.) en hij vervangt geen telefoonlijn. De Klant informeert zijn Gebruikers hierover.'] },
          ],
        },
        {
          title: 'Artikel 7 — Functies op basis van kunstmatige intelligentie',
          body: [
            {
              ul: [
                'Antwoorden, transcripties, samenvattingen en stemmen worden automatisch gegenereerd en kunnen onjuist, onvolledig of ongepast zijn. De Klant controleert ze voordat hij erop vertrouwt.',
                'De Klant stelt de instructies, kennisbanken, stemmen, tools en automatiseringen van zijn agents in: hij is verantwoordelijk voor alles wat zijn agent namens hem zegt, belooft of doet (afspraken, prijzen, toezeggingen).',
                'De Dienst geeft geen medisch, juridisch, financieel, fiscaal of ander professioneel advies, en de Klant mag zijn agent niet zo presenteren.',
                'AI-modellen, stemmen, talen en aanbieders kunnen veranderen, worden vervangen of verdwijnen; de beschikbaarheid van een bepaald model of een bepaalde stem is niet gegarandeerd.',
                'Tussen partijen behoort voor de Klant gegenereerde output toe aan de Klant, onder voorbehoud van rechten van derden en onze rechten op de Dienst; output is mogelijk niet uniek.',
              ],
            },
          ],
        },
        {
          title: 'Artikel 8 — Klantgegevens en gegevensbescherming',
          body: [
            { p: ['Voor persoonsgegevens van Ontvangers die via de Dienst worden verwerkt, is de Klant verwerkingsverantwoordelijke en treden wij op als verwerker (artikel 28 AVG en gelijkwaardige wetgeving). Dit artikel en het ', { a: 'privacybeleid', href: '/confidentialite' }, ' vormen de verwerkersovereenkomst (DPA); een ondertekende versie is op aanvraag beschikbaar. Wij:'] },
            {
              ul: [
                'verwerken de gegevens uitsluitend op gedocumenteerde instructies van de Klant (de Voorwaarden en zijn instellingen), tenzij de wet anders vereist, en melden het als een instructie ons onrechtmatig lijkt;',
                'verplichten gemachtigde personen tot geheimhouding;',
                'nemen passende technische en organisatorische maatregelen;',
                'schakelen subverwerkers in die in het privacybeleid staan vermeld en waarvoor de Klant algemene toestemming geeft; wijzigingen kondigen wij minstens 15 dagen vooraf aan, en de Klant kan op redelijke gronden bezwaar maken, waarbij zijn enige rechtsmiddel dan opzegging is;',
                'helpen de Klant in redelijke mate bij verzoeken van betrokkenen, gegevensbeschermingseffectbeoordelingen en datalekken, die wij zonder onredelijke vertraging melden;',
                'verwijderen de gegevens na afloop van de overeenkomst volgens artikel 13, tenzij de wet bewaring vereist;',
                'stellen de informatie beschikbaar die nodig is om onze naleving aan te tonen; een audit vindt hoogstens eenmaal per jaar plaats, met redelijke aankondiging, op kosten van de Klant en onder geheimhouding.',
              ],
            },
            { p: 'De Klant garandeert dat hij voor elke verwerking een rechtsgrond heeft, Ontvangers informeert (AI-agent, opname, doeleinden), de vereiste toestemmingen verkrijgt, bijzondere persoonsgegevens alleen laat verwerken als dat noodzakelijk en rechtmatig is, en dat zijn contactlijsten rechtmatig zijn opgebouwd. Het opnemen van gesprekken en de bewaartermijn daarvan worden door de Klant ingesteld.' },
            { p: 'Wij kunnen geaggregeerde of geanonimiseerde gegevens en gebruiksmetadata gebruiken om de Dienst te exploiteren, te beveiligen en te verbeteren. Wij gebruiken de inhoud van gesprekken en berichten van de Klant niet om onze eigen modellen te trainen.' },
          ],
        },
        {
          title: 'Artikel 9 — Diensten van derden en integraties',
          body: [
            { p: 'De Dienst maakt gebruik van of koppelt met diensten van derden: telecomoperators, Meta (WhatsApp, Messenger, Instagram), agenda’s, CRM-systemen, automatiseringstools, AI- en betaaldienstverleners. Hun voorwaarden zijn van toepassing en de Klant aanvaardt ze wanneer zij dat vereisen. Door een integratie in te schakelen, machtigt de Klant ons om de nodige gegevens ermee uit te wisselen. Wij hebben geen zeggenschap over deze diensten en zijn niet verantwoordelijk voor hun beschikbaarheid, hun wijzigingen of de verwerking van gegevens die op verzoek van de Klant aan hen worden verstrekt.' },
          ],
        },
        {
          title: 'Artikel 10 — Intellectuele eigendom',
          body: [
            {
              ul: [
                `De Dienst, de software, interfaces en documentatie, het merk ${brand} en de logo’s behoren toe aan ons of onze licentiegevers en worden onder meer beschermd door ${legal.copyrightLaw}. Buiten de hieronder beschreven licentie verkrijgt de Klant geen rechten.`,
                'Wij verlenen de Klant, voor de duur van zijn abonnement, een beperkte, niet-exclusieve, niet-overdraagbare, niet in sublicentie te geven en herroepbare licentie om de Dienst te gebruiken voor zijn interne bedrijfsdoeleinden.',
                'De Klant behoudt zijn rechten op de Klantinhoud. Hij verleent ons een wereldwijde, kosteloze, niet-exclusieve licentie om deze te hosten, te kopiëren, te verwerken, door te geven en weer te geven, en door onze subverwerkers te laten verwerken, uitsluitend voor zover nodig om de Dienst te leveren, te beveiligen en te ondersteunen en de wet na te leven. Hij garandeert over de nodige rechten te beschikken.',
                'Suggesties en feedback van de Klant mogen vrij, kosteloos en zonder tijdslimiet worden gebruikt.',
                'De Klant gebruikt onze merken niet zonder schriftelijke toestemming. Wij mogen de naam en het logo van de Klant als referentie vermelden, tenzij hij daartegen per e-mail bezwaar maakt.',
                ['Om onrechtmatige inhoud of een inbreuk op auteursrecht te melden, mailt u naar ', mail, ' met vermelding van het werk, de vindplaats van de inhoud, uw contactgegevens en een verklaring te goeder trouw. Wij kunnen de inhoud verwijderen en accounts die herhaaldelijk inbreuk maken opschorten.'],
              ],
            },
          ],
        },
        {
          title: 'Artikel 11 — Vertrouwelijkheid',
          body: [
            { p: 'Elke partij houdt de niet-openbare informatie die zij van de andere ontvangt vertrouwelijk, gebruikt die alleen voor de uitvoering van de Voorwaarden en beschermt die met redelijke zorg, gedurende de overeenkomst en drie jaar daarna (en voor bedrijfsgeheimen zolang zij geheim blijven). Niet vertrouwelijk is informatie die openbaar is, al bekend was, zelfstandig is ontwikkeld of rechtmatig van een derde is verkregen. Een partij mag informatie bekendmaken als de wet of een autoriteit dat vereist, en stelt de andere partij daarvan op de hoogte voor zover toegestaan.' },
          ],
        },
        {
          title: 'Artikel 12 — Wijzigingen van de Dienst, bètafuncties en beschikbaarheid',
          body: [
            {
              ul: [
                'Wij kunnen de Dienst doorontwikkelen, functies toevoegen, wijzigen of schrappen en van dienstverlener wisselen. Waar redelijkerwijs mogelijk kondigen wij het schrappen van een essentiële functie van een betaald abonnement vooraf aan.',
                'Bèta-, preview- of experimentele functies worden geleverd zoals ze zijn, zonder verplichting, en kunnen op elk moment worden stopgezet.',
                'Wij hebben een inspanningsverplichting. Er geldt geen gegarandeerd serviceniveau (SLA), tenzij schriftelijk overeengekomen in een Maatwerk-overeenkomst. De Dienst is afhankelijk van internet, operators en onze dienstverleners; gepland onderhoud (zo mogelijk aangekondigd) of spoedonderhoud kan hem onderbreken.',
                'Limieten voor redelijk gebruik (fair use: gelijktijdige gesprekken, doorvoer, volumes) kunnen van toepassing zijn.',
              ],
            },
          ],
        },
        {
          title: 'Artikel 13 — Opschorting en beëindiging',
          body: [
            { p: 'Wij kunnen het account geheel of gedeeltelijk opschorten of sluiten, op elk moment, met of zonder voorafgaande kennisgeving en zonder schadevergoeding, bij: schending van de Voorwaarden, niet-betaling of chargeback, een klacht van een operator, Meta, een autoriteit of Ontvangers, vermoeden van fraude, een beveiligingsrisico, een juridisch of reputatierisico, een verzoek van een autoriteit of een vereiste van een van onze dienstverleners. Tijdens de opschorting blijven de bedragen verschuldigd. Een dergelijke sluiting geeft geen recht op enige terugbetaling, ook niet van niet-verstreken vooruitbetaalde perioden.' },
            {
              ul: [
                'De Klant kan op elk moment opzeggen; de opzegging gaat in aan het einde van de betaalde periode (artikel 4).',
                'Wij kunnen de overeenkomst ook zonder reden beëindigen met een opzegtermijn van 30 dagen; alleen in dat geval betalen wij het niet-verstreken deel van een vooruitbetaalde periode terug.',
                'Bij het einde van de overeenkomst vervalt de toegang, worden verschuldigde bedragen opeisbaar, kunnen nummers worden vrijgegeven en vervalt het tegoed. De Klant kan zijn gegevens gedurende 30 dagen exporteren vanuit de klantomgeving; daarna worden ze binnen 90 dagen na het einde van de overeenkomst verwijderd, onder voorbehoud van wettelijke bewaarplichten en de normale back-upcyclus.',
                'Gratis of proefaccounts zonder betaald abonnement die 90 dagen inactief zijn, kunnen na een waarschuwing per e-mail worden gesloten en hun gegevens verwijderd.',
                'Bepalingen die naar hun aard na beëindiging blijven gelden (verschuldigde bedragen, gegevens, intellectuele eigendom, vertrouwelijkheid, garanties, aansprakelijkheid, vrijwaring, geschillen) blijven van toepassing.',
              ],
            },
          ],
        },
        {
          title: 'Artikel 14 — Uitsluiting van garanties',
          body: [
            { p: 'Voor zover de wet dat toestaat, wordt de Dienst geleverd „zoals hij is” en „zoals beschikbaar”. Wij sluiten alle uitdrukkelijke of stilzwijgende garanties uit, waaronder die van verkoopbaarheid, geschiktheid voor een bepaald doel, niet-inbreuk, ononderbroken of foutloze werking, juistheid van door AI gegenereerde inhoud, aflevering van gesprekken en berichten of het behalen van enig commercieel resultaat.' },
          ],
        },
        {
          title: 'Artikel 15 — Beperking van aansprakelijkheid',
          body: [
            {
              ul: [
                'Wij zijn niet aansprakelijk voor indirecte schade, gevolgschade, bijzondere schade of punitieve schadevergoedingen, noch voor gederfde winst, omzet, klanten, kansen of goodwill, verlies of beschadiging van gegevens, gemiste gesprekken of afspraken of de kosten van een vervangende dienst, ook niet als wij op de mogelijkheid daarvan zijn gewezen.',
                'Wij zijn niet aansprakelijk voor schade die voortvloeit uit Klantinhoud, de configuratie van agents, diensten van derden, operators, Meta, internet, overmacht of een tekortkoming van de Klant.',
                [{ strong: 'Maximum:' }, ' onze totale aansprakelijkheid, uit welken hoofde ook, is beperkt tot het bedrag exclusief belastingen dat de Klant daadwerkelijk heeft betaald voor zijn abonnement over de maand voorafgaand aan de schadeveroorzakende gebeurtenis (bij jaarlijkse facturatie een twaalfde van de jaarprijs) en bedraagt in geen geval meer dan USD 1.000.'],
                'De Klant erkent dat de prijzen deze risicoverdeling weerspiegelen.',
              ],
            },
            { p: 'Niets in de Voorwaarden sluit een aansprakelijkheid of recht uit of beperkt die, voor zover dat op grond van dwingend recht niet mogelijk is (met name bij opzet of bewuste roekeloosheid, of letselschade).' },
            ...(legal.mandatoryNote ? [{ p: legal.mandatoryNote }] : []),
          ],
        },
        {
          title: 'Artikel 16 — Vrijwaring door de Klant',
          body: [
            { p: `De Klant verdedigt en vrijwaart ons en onze bestuurders, werknemers, onderaannemers en dienstverleners en stelt hen schadeloos voor alle aanspraken, verliezen, boetes, sancties, veroordelingen en kosten (waaronder redelijke advocaatkosten) die voortvloeien uit: zijn Klantinhoud en de configuratie van zijn agents; zijn gesprekken, berichten en campagnes; het ontbreken van toestemming of het niet respecteren van een afmelding of belregister; elke schending van telecom-, marketing-, AI- of privacywetgeving; elke schending van de Voorwaarden; elke aanspraak van een Ontvanger, Gebruiker, operator, Meta, onze technische platformleverancier of een autoriteit in verband met zijn gebruik. De Klant erkent dat ${company} jegens haar eigen dienstverleners aansprakelijk kan zijn voor tekortkomingen van haar klanten. Wij stellen de Klant op de hoogte van de aanspraak; hij mag geen schikking treffen die ons verplichtingen oplegt zonder onze toestemming.` },
          ],
        },
        {
          title: 'Artikel 17 — Termijn voor vorderingen',
          body: [
            { p: 'Voor zover de wet dat toestaat, moet elke vordering tegen ons worden ingesteld binnen drie (3) maanden na de gebeurtenis waarop zij berust, of na de dag waarop de Klant daarvan kennis kreeg of had moeten krijgen; daarna vervalt de vordering.' },
          ],
        },
        {
          title: 'Artikel 18 — Toepasselijk recht, arbitrage en afstand van collectieve acties',
          body: [
            {
              ul: [
                `Op de Voorwaarden is ${legal.governingLaw} van toepassing, met uitsluiting van de conflictregels en van het Weens Koopverdrag (CISG).`,
                ['Vóór elke procedure stuurt de klagende partij een schriftelijke klacht (aan ons: ', mail, '); partijen zoeken gedurende 30 dagen naar een minnelijke oplossing.'],
                `Lukt dat niet, dan wordt elk geschil dat voortvloeit uit of verband houdt met de Voorwaarden of de Dienst definitief beslecht door vertrouwelijke, bindende arbitrage onder beheer van de American Arbitration Association (AAA) volgens haar Commercial Arbitration Rules (of, bij een internationaal geschil, door haar International Centre for Dispute Resolution), door één arbiter, met als plaats van arbitrage Cheyenne (Wyoming) en in het Engels. Het vonnis kan worden bekrachtigd en ten uitvoer gelegd door ${legal.court} of door elke bevoegde rechter.`,
                [{ strong: 'Afstand van collectieve acties:' }, ' geschillen worden uitsluitend individueel beslecht, met uitsluiting van groeps-, collectieve of vertegenwoordigende acties en samengevoegde arbitrages. Wordt deze afstand voor een vordering niet afdwingbaar geacht, dan wordt die vordering door de hieronder genoemde rechter behandeld en niet in arbitrage.'],
                'Elke partij kan bij elke bevoegde rechter spoedeisende of voorlopige maatregelen vragen (met name om haar intellectuele eigendom of vertrouwelijke informatie te beschermen of misbruik van de Dienst te stoppen), zonder zekerheidstelling voor zover toegestaan. Elke partij kan een individuele vordering instellen bij een rechter voor kleine geschillen binnen diens bevoegdheid, en wij kunnen onbetaalde bedragen invorderen bij elke bevoegde rechter.',
                `Geschillen die niet aan arbitrage zijn onderworpen, worden uitsluitend voorgelegd aan ${legal.court}.`,
              ],
            },
          ],
        },
        {
          title: 'Artikel 19 — Overmacht',
          body: [
            { p: 'Geen van de partijen is aansprakelijk voor vertraging of tekortkoming door een gebeurtenis buiten haar redelijke controle: natuurramp, epidemie, oorlog, terrorisme, oproer, staking, overheidsmaatregel, storing bij een operator, internet, het elektriciteitsnet, een datacenter of een cloud- of AI-aanbieder, cyberaanval of een beslissing van Meta of een operator. Betalingsverplichtingen worden niet opgeschort. Duurt de gebeurtenis langer dan 30 dagen, dan kan elke partij het betrokken abonnement met een kennisgeving beëindigen.' },
          ],
        },
        {
          title: 'Artikel 20 — Overdracht en zeggenschapswijziging',
          body: [
            { p: 'Wij mogen de Voorwaarden geheel of gedeeltelijk overdragen, ook bij fusie, overname, reorganisatie of verkoop van activa, zonder toestemming van de Klant en na hem te hebben geïnformeerd, en onze verplichtingen geheel of gedeeltelijk uitbesteden. De Klant mag de Voorwaarden niet overdragen zonder onze voorafgaande schriftelijke toestemming; hij meldt ons elke zeggenschapswijziging, waarna wij kunnen beëindigen als de nieuwe eigenaar een concurrent is of onze verificatie niet doorstaat.' },
          ],
        },
        {
          title: 'Artikel 21 — Algemene bepalingen',
          body: [
            {
              ul: [
                [{ strong: 'Volledige overeenkomst:' }, ' de Voorwaarden, de pagina Prijzen, de details van het gekozen abonnement, het ', { a: 'privacybeleid', href: '/confidentialite' }, ' en, in voorkomend geval, een ondertekende Maatwerk-overeenkomst vormen de volledige overeenkomst en vervangen alle eerdere afspraken. Inkoopvoorwaarden van de Klant zijn niet van toepassing.'],
                [{ strong: 'Rangorde:' }, ' een ondertekende Maatwerk-overeenkomst, dan de Voorwaarden, dan het privacybeleid, dan de pagina Prijzen en de documentatie.'],
                [{ strong: 'Gedeeltelijke nietigheid en geen afstand van recht:' }, ' een ongeldige bepaling wordt vervangen door de geldige bepaling die het dichtst in de buurt komt en de overige blijven van kracht; het niet uitoefenen van een recht houdt geen afstand daarvan in.'],
                [{ strong: 'Kennisgevingen:' }, ' wij schrijven naar het e-mailadres van het account of in de klantomgeving; de Klant schrijft ons via ', mail, '. De Klant aanvaardt elektronische communicatie en facturen.'],
                [{ strong: 'Wijzigingen:' }, ' wij kunnen de Voorwaarden wijzigen; belangrijke wijzigingen worden ten minste 15 dagen vóór de inwerkingtreding per e-mail of op de website aangekondigd, tenzij wettelijke of beveiligingseisen anders vereisen. Voortgezet gebruik geldt als aanvaarding; een Klant die niet akkoord gaat, zegt vóór die datum op.'],
                [{ strong: 'Taal:' }, ' de Voorwaarden worden in meerdere talen gepubliceerd. Bij verschillen gaat de Engelse versie voor.'],
                [{ strong: 'Sancties en export:' }, ' de Klant verklaart niet onder economische sancties te vallen en de Dienst niet te gebruiken in een land of ten behoeve van een persoon waarop sancties van toepassing zijn.'],
                [{ strong: 'Onafhankelijkheid:' }, ' partijen zijn onafhankelijke contractanten; de Voorwaarden scheppen geen rechten voor derden.'],
                [{ strong: 'Contact:' }, ` ${company}, ${ADDRESS}, Verenigde Staten — `, mail, '.'],
              ],
            },
          ],
        },
      ];
    },
  },

  privacy: {
    meta: {
      title: (brand: string) => `Privacybeleid — ${brand}`,
      description: (brand: string) => `Hoe ${brand} uw gegevens verwerkt: terugbelverzoeken, AI-agents en opnames, klantaccount, facturatie via Stripe, dienstverleners en uw rechten.`,
    },
    breadcrumb: 'Privacy',
    h1: 'Privacybeleid',
    intro: 'Wat we verzamelen, waarom, met wie, hoe lang, en hoe u uw rechten uitoefent.',
    updated: 'Laatst bijgewerkt: 6 oktober 2026',
    sections: ({ brand, company, email, legal }: LegalVars): LegalSection[] => {
      const mail = { a: email, href: `mailto:${email}` };
      return [
        {
          title: 'Wie wij zijn en onze rol',
          body: [
            { p: [`${brand} is een merk van ${company}, een Limited Liability Company geregistreerd in de staat Wyoming (Verenigde Staten), ${ADDRESS}. Contact: `, mail, `. Wij verwerken persoonsgegevens in overeenstemming met ${legal.privacyLaw} en andere toepasselijke wetgeving.`] },
            {
              ul: [
                [{ strong: 'Verwerkingsverantwoordelijke:' }, ` voor de website, formulieren en terugbelverzoeken, gesprekken met onze eigen AI-assistenten, klantaccounts, facturatie en onze eigen marketing is ${company} verwerkingsverantwoordelijke.`],
                [{ strong: 'Verwerker:' }, ' voor gesprekken, berichten en contacten die door de agents van onze klanten worden afgehandeld, is de klant verwerkingsverantwoordelijke ten opzichte van zijn eigen bellers en contacten; wij handelen namens en op instructie van de klant. Bent u benaderd door de agent van een klantbedrijf, wendt u zich dan eerst tot dat bedrijf; wij sturen elk verzoek dat wij ontvangen aan dat bedrijf door.'],
              ],
            },
          ],
        },
        {
          title: 'Welke gegevens wij verzamelen',
          body: [
            {
              ul: [
                [{ strong: 'Formulieren op de website' }, ' (terugbellen, demo, begeleiding bij de proefperiode): naam, telefoonnummer, e-mail, bedrijf, sector, gewenst tijdstip, bericht en toestemming.'],
                [{ strong: 'Gesprekken met onze AI-assistenten' }, ' (chatbubbel op de website, AI-receptionist, demogesprekken, terugbelgesprekken voor verkoop en support, hulp in de klantomgeving): geschreven inhoud, audio-opname van spraakgesprekken, transcriptie, samenvatting en geëxtraheerde informatie (behoefte, overwogen abonnement, gemeld probleem).'],
                [{ strong: 'Klantaccount' }, ': identiteit en contactgegevens van gebruikers, bedrijfsgegevens, inloggegevens, instellingen en instructies van agents, kennisbanken, contactlijsten, gespreks- en berichtengeschiedenis, verbruik van minuten en tegoed, supportverzoeken.'],
                [{ strong: 'Gegevens die wij voor onze klanten verwerken' }, ': nummers en namen van bellers of contacten, gespreksinhoud, berichten, opnames, transcripties, afspraken en leadgegevens.'],
                [{ strong: 'Facturatie' }, ': abonnement, facturen, factuuradres, btw-nummer, betaalstatus. Kaartgegevens worden ingevoerd bij en bewaard door Stripe; wij hebben er nooit toegang toe.'],
                [{ strong: 'Technische gegevens' }, ': IP-adres, apparaat en browser, verbindings- en beveiligingslogs, cookies.'],
                [{ strong: 'Gegevens van derden' }, ': door de klant ingeschakelde integraties (agenda’s, CRM, WhatsApp, Messenger, Instagram), gespreks- en berichtmetadata van operators, betaal- en fraudepreventie-informatie van Stripe, en openbare bedrijfsinformatie die wordt gebruikt om een account te verifiëren.'],
              ],
            },
          ],
        },
        {
          title: 'Doeleinden en rechtsgronden',
          body: [
            {
              ul: [
                [{ strong: 'U terugbellen en uw verzoek beantwoorden' }, ', ook via een gesprek met onze AI-spraakagent: uw toestemming, gegeven bij het verzoek en op elk moment intrekbaar.'],
                [{ strong: 'Het leveren van de Dienst, de gratis proefperiode en support' }, ': uitvoering van de overeenkomst of precontractuele maatregelen.'],
                [{ strong: 'Het verwerken van gegevens van onze klanten namens hen' }, ': hun instructies, op de rechtsgrond die zij bepalen.'],
                [{ strong: 'Factureren, boekhouden, fiscale verplichtingen en het beantwoorden van verzoeken van autoriteiten' }, ': wettelijke verplichting.'],
                [{ strong: 'Het platform beveiligen, fraude en misbruik voorkomen, onze voorwaarden handhaven, ons verdedigen in rechte, onze assistenten verbeteren op basis van onze eigen gesprekken en geaggregeerde statistieken' }, ': gerechtvaardigd belang.'],
                [{ strong: 'Marketing aan bedrijven' }, ': gerechtvaardigd belang, of toestemming waar de wet dat vereist; u kunt altijd bezwaar maken.'],
                [{ strong: 'Analytische cookies en advertentiemeting (Meta-pixel)' }, ': uw toestemming.'],
              ],
            },
          ],
        },
        {
          title: 'Kunstmatige intelligentie, opnames en transcripties',
          body: [
            { p: 'Onze assistenten zijn AI-systemen en maken dat ook bekend. Spraakgesprekken worden opgenomen en uitgeschreven; AI-aanbieders maken er samenvattingen van en halen de informatie eruit die nodig is om uw verzoek op te volgen. Er wordt geen besluit met rechtsgevolgen of dat u anderszins in aanmerkelijke mate treft uitsluitend op basis van geautomatiseerde verwerking genomen.' },
            { p: 'Wij verkopen uw gegevens niet en delen ze niet voor gerichte advertenties. Wij gebruiken de inhoud van gesprekken en berichten van onze klanten niet om onze eigen modellen te trainen. Onze AI-aanbieders verwerken gegevens op basis van een overeenkomst, namens ons.' },
            { p: 'Klanten die het platform gebruiken, moeten hun eigen bellers en contacten laten weten dat zij met een AI-systeem communiceren en, waar de wet dat vereist, dat het gesprek wordt opgenomen. Zij stellen het opnemen en de bewaartermijn daarvan in.' },
          ],
        },
        {
          title: 'Delen van gegevens en subverwerkers',
          body: [
            { p: 'Wij delen uw gegevens alleen met ontvangers die ze nodig hebben en die gebonden zijn aan geheimhoudings- en gegevensbeschermingsverplichtingen:' },
            {
              ul: [
                [{ strong: 'Onze technische platformleverancier' }, ': spraakagents, widgets, klantomgeving, transcriptie, spraaksynthese en automatiseringen. Deze leverancier is gevestigd in de Europese Unie (Roemenië), is ISO 27001-gecertificeerd en host gegevens in de Europese Economische Ruimte en/of de Verenigde Staten.'],
                [{ strong: 'Twilio en andere telecomoperators' }, ': routering van gesprekken en sms, telefoonnummers.'],
                [{ strong: 'Meta' }, ' (WhatsApp, Messenger, Instagram): wanneer de klant deze kanalen gebruikt.'],
                [{ strong: 'AI-, spraak- en transcriptieaanbieders' }, ': begrijpen, antwoorden, spraaksynthese en transcriptie.'],
                [{ strong: 'Stripe' }, ': abonnementen, betalingen, facturen en belastingberekening (PCI DSS niveau 1-gecertificeerd).'],
                [{ strong: 'Supabase' }, ': database van verzoeken, aanmeldingen en gespreksverslagen (Verenigde Staten).'],
                [{ strong: 'Google Cloud (Firebase)' }, ': hosting van de website (Verenigde Staten).'],
                [{ strong: 'Zoho' }, ': verzending van service- en opvolgmails.'],
                [{ strong: 'Google (Google Analytics 4)' }, ': bezoekersstatistieken, alleen met uw toestemming; doorgifte naar de Verenigde Staten valt onder het EU-VS-kader voor gegevensbescherming (Data Privacy Framework).'],
                [{ strong: 'Meta Platforms Ireland Ltd (Meta-pixel)' }, ': meten van de resultaten van onze advertenties op Facebook en Instagram, alleen met uw toestemming; doorgifte naar de Verenigde Staten valt onder het EU-VS-kader voor gegevensbescherming (Data Privacy Framework).'],
                [{ strong: 'Door de klant ingeschakelde integraties' }, ' (agenda’s, CRM, automatiseringstools), onze professionele adviseurs, autoriteiten waar de wet dat vereist, en een eventuele overnemende partij bij een fusie of verkoop.'],
              ],
            },
          ],
        },
        {
          title: 'Internationale doorgifte',
          body: [
            { p: 'Onze vennootschap en verschillende dienstverleners bevinden zich in de Verenigde Staten; onze technische platformleverancier is gevestigd in de Europese Unie en host gegevens in de EER en/of de Verenigde Staten. Doorgiften zijn versleuteld en met waarborgen omkleed:' },
            {
              ul: [
                'Europese Unie en EER: het EU-VS-kader voor gegevensbescherming (Data Privacy Framework) wanneer de ontvanger daaronder gecertificeerd is, anders de modelcontractbepalingen van de Europese Commissie, zo nodig met aanvullende maatregelen.',
                'Verenigd Koninkrijk: de Britse uitbreiding van dat kader of het Britse addendum bij de modelcontractbepalingen.',
                'Zwitserland: het Zwitserland-VS-kader of modelcontractbepalingen die door de federale toezichthouder (FDPIC) zijn erkend.',
                'Australië: wij nemen redelijke, ook contractuele, maatregelen zodat ontvangers in het buitenland informatie verwerken in overeenstemming met de Australian Privacy Principles (APP 8).',
              ],
            },
            { p: ['Een kopie van de toepasselijke waarborgen is op te vragen via ', mail, '.'] },
          ],
        },
        {
          title: 'Hoe lang wij gegevens bewaren',
          body: [
            {
              ul: [
                'Terugbelverzoeken en gesprekken met onze assistenten: 24 maanden na het laatste contact.',
                'Gesprekken, opnames, transcripties, chats en sms die wij voor onze klanten verwerken: standaard 90 dagen vanaf de datum van het gesprek (de termijn van onze technische leverancier); elke klant kan deze termijn verkorten en zijn gegevens verwijderen.',
                'Leads en contacten verzameld door de agents van onze klanten: standaard 24 maanden, door de klant in te korten.',
                'Accountgegevens: zolang de overeenkomst loopt, daarna 3 jaar voor marketing, tenzij u bezwaar maakt. De inhoud van het account wordt binnen 90 dagen na het einde van de overeenkomst verwijderd.',
                'Facturen en boekhoudkundige stukken: 10 jaar.',
                'Technische en beveiligingslogs: gedurende de beperkte termijn die voor de beveiliging nodig is.',
              ],
            },
            { p: 'Na afloop van deze termijnen worden de gegevens verwijderd of geanonimiseerd.' },
          ],
        },
        {
          title: 'Beveiliging',
          body: [
            { p: 'Gegevens worden versleuteld tijdens overdracht (TLS) en in rust (AES-256). Toegang is rolgebaseerd, beveiligd met authenticatie en vastgelegd in auditlogs; tweestapsverificatie is beschikbaar voor klanten; er worden regelmatig back-ups gemaakt en technische sleutels worden bewaard in beveiligde sleutelkluizen (secret vaults). Onze technische platformleverancier is ISO 27001-gecertificeerd. Omdat geen enkel systeem onfeilbaar is, melden wij datalekken aan de autoriteiten en aan betrokkenen wanneer de wet dat vereist.' },
          ],
        },
        {
          title: 'Uw rechten per land',
          body: [
            {
              ul: [
                [{ strong: 'Europese Unie en EER' }, ' (waaronder Nederland, Frankrijk, Italië en Polen): inzage, rectificatie, wissing, beperking, overdraagbaarheid, bezwaar (onvoorwaardelijk tegen direct marketing), intrekking van toestemming en het recht om niet te worden onderworpen aan een uitsluitend geautomatiseerd besluit.'],
                [{ strong: 'Verenigd Koninkrijk' }, ': dezelfde rechten op grond van de UK GDPR en de Data Protection Act 2018.'],
                [{ strong: 'Zwitserland' }, ': de rechten op grond van de federale wet inzake gegevensbescherming (FADP).'],
                [{ strong: 'Australië' }, ': rechten op inzage en correctie op grond van de Australian Privacy Principles, en de mogelijkheid om anoniem of onder pseudoniem met ons te communiceren waar dat mogelijk is.'],
                [{ strong: 'Elders' }, ': de rechten die uw lokale wetgeving biedt.'],
              ],
            },
          ],
        },
        {
          title: 'Uw rechten uitoefenen en klachten',
          body: [
            { p: ['Mail naar ', mail, ` of schrijf naar ${company}, ${ADDRESS}, Verenigde Staten. Wij kunnen u vragen uw identiteit aan te tonen. Wij antwoorden binnen één maand; bij complexe verzoeken kan deze termijn met twee maanden worden verlengd (u hoort dat dan van ons). Dit is kosteloos, tenzij een verzoek kennelijk ongegrond of buitensporig is. Als wij uw gegevens namens een klant verwerken, sturen wij uw verzoek aan die klant door.`] },
            { p: `U kunt een klacht indienen bij ${legal.dataAuthority}, of bij de gegevensbeschermingsautoriteit van het land waar u woont of werkt, zoals de CNIL (Frankrijk), de Garante per la protezione dei dati personali (Italië), de UODO (Polen), het ICO (Verenigd Koninkrijk) of de FDPIC (Zwitserland). In Australië dient u eerst bij ons een klacht in: wij reageren binnen 30 dagen, waarna u zich tot het OAIC kunt wenden.` },
          ],
        },
        {
          title: 'Minderjarigen',
          body: [
            { p: 'De Dienst is bestemd voor professionals van 18 jaar of ouder. Hij is niet gericht op minderjarigen en wij verzamelen niet bewust hun gegevens; als wij vernemen dat een minderjarige ons gegevens heeft verstrekt, verwijderen wij die.' },
          ],
        },
        {
          title: 'Marketing, gesprekken en afmelden',
          body: [
            { p: ['Wij bellen u alleen op uw verzoek of met uw instemming, en onze agent stelt zich voor als AI. U kunt op elk moment zeggen dat u niet meer gebeld wilt worden, STOP antwoorden op een sms, de afmeldlink in een e-mail gebruiken of mailen naar ', mail, ': wij zetten u op onze interne afmeldlijst. Voor onze eigen marketing respecteren wij de toepasselijke regels en belregisters (Bel-me-niet Register, TPS/CTPS, Do Not Call Register, Registro delle opposizioni enz.).'] },
            { p: 'Gesprekken en berichten van onze klanten vallen onder hun verantwoordelijkheid: richt uw bezwaar aan hen; als u contact met ons opneemt, sturen wij het door.' },
          ],
        },
        {
          title: 'Cookies en „Do Not Track”',
          body: [
            { p: ['De website gebruikt cookies die noodzakelijk zijn voor de werking en beveiliging en, alleen met uw toestemming, analytische cookies (Google Analytics) en cookies voor advertentiemeting (Meta-pixel). Details en uw keuzes vindt u op de pagina ', { a: 'cookies', href: '/cookies' }, '. Omdat er geen gemeenschappelijke standaard bestaat, reageren wij niet anders op „Do Not Track”-signalen; wij volgen uw surfgedrag op andere websites niet voor advertentiedoeleinden.'] },
          ],
        },
        {
          title: 'Links naar websites van derden',
          body: [
            { p: 'De website en de Dienst kunnen verwijzen naar websites of diensten van derden (Stripe, Meta, agenda’s, CRM enz.). Daarop is hun eigen privacybeleid van toepassing en wij zijn daarvoor niet verantwoordelijk.' },
          ],
        },
        {
          title: 'Wijzigingen van dit beleid',
          body: [
            { p: 'Wij kunnen dit beleid bijwerken; de datum van de laatste wijziging staat bovenaan de pagina. Belangrijke wijzigingen maken wij per e-mail aan klanten of via een melding op de website bekend.' },
          ],
        },
        {
          title: 'Contact',
          body: [
            { p: [`${company}, ${ADDRESS}, Verenigde Staten — `, mail, '.'] },
          ],
        },
      ];
    },
  },

  legalNotice: {
    meta: {
      title: (brand: string) => `Juridische informatie — ${brand}`,
      description: (brand: string) => `Juridische informatie, gegevens over de beheerder, de hosting en het auteursrecht van het platform ${brand}.`,
    },
    h1: 'Juridische informatie',
    updated: 'Laatst bijgewerkt: 29 september 2026',
    sections: ({ brand, company, email, legal }: LegalVars): LegalSection[] => [
      {
        title: '1. Beheerder van de website',
        body: [
          { p: ['De website die bereikbaar is op het adres ', { strong: 'https://permanenceia.com' }, ' wordt beheerd door de vennootschap ', { strong: company }, '.'] },
          {
            ul: [
              [{ strong: 'Handelsnaam:' }, ` ${brand}`],
              [{ strong: 'Rechtsvorm:' }, ' Limited Liability Company (LLC), staat Wyoming, Verenigde Staten'],
              [{ strong: 'Registratienummer:' }, ' 2026-001905061'],
              [{ strong: 'Statutaire zetel:' }, ' 1603 Capitol Ave, Suite 413G-2408, Cheyenne, WY 82001, Verenigde Staten'],
              [{ strong: 'E-mail:' }, ` ${email}`],
            ],
          },
        ],
      },
      {
        title: '2. Hosting van het platform',
        body: [
          { p: 'De commerciële website en de applicatie worden gehost door:' },
          {
            ul: [
              [{ strong: 'Front-endplatform:' }, ' Google LLC (Firebase App Hosting / Google Cloud), 1600 Amphitheatre Parkway, Mountain View, CA 94043, Verenigde Staten. Hostingregio: us-east4 (Noord-Virginia, Verenigde Staten).'],
              [{ strong: 'Databases en opslag:' }, ' Supabase Inc., infrastructuur in de Verenigde Staten (AWS-regio us-east-1, Virginia).'],
              [{ strong: 'Telefoonnetwerk en spraaksynthese:' }, ' cloudinfrastructuur voor spraaktelefonie.'],
            ],
          },
        ],
      },
      {
        title: '3. Intellectuele eigendom',
        body: [
          { p: ['Het merk ', { strong: brand }, `, het logo (de spraakballon in ruststand, de geluidsgolven en de stip die beschikbaarheid aangeeft) en alle huisstijlelementen, teksten, gespreksscripts, infographics en de broncode op de website zijn exclusief eigendom van ${company}.`] },
          { p: `Elke verveelvoudiging, verspreiding, wijziging of elk gebruik zonder voorafgaande schriftelijke toestemming is uitdrukkelijk verboden en vormt een inbreuk in de zin van ${legal.copyrightLaw}.` },
        ],
      },
      {
        title: '4. Beperking van aansprakelijkheid',
        body: [
          { p: `${brand} spant zich naar beste vermogen in om de juistheid van de informatie op de website te waarborgen. ${brand} kan echter niet aansprakelijk worden gesteld voor onderbrekingen van de netwerkdienst, storingen bij externe telecomaanbieders of incidentele onnauwkeurigheden van de automatische spraakverwerkingsmodellen tijdens live gesprekken.` },
          { p: 'De zakelijke klant blijft als enige verantwoordelijk voor de instructies en bedrijfsregels die hij voor zijn telefoniedienst instelt.' },
        ],
      },
    ],
  },

  cookies: {
    meta: {
      title: (brand: string) => `Cookiebeleid — ${brand}`,
      description: (brand: string) => `Welke cookies de website van ${brand} gebruikt: doeleinden, bewaartermijnen en het beheer van uw toestemming.`,
    },
    h1: 'Cookiebeleid',
    paragraphs: (siteHost: string, appHost: string) => [
      `Strikt noodzakelijke cookies: de website ${siteHost} plaatst de cookies die nodig zijn voor de werking ervan (beveiliging, load balancing). Daarvoor is geen toestemming nodig.`,
      `Toestemmingscookie: de cookie pia_consent onthoudt uw keuze (accepteren of weigeren) gedurende 6 maanden, op het domein permanenceia.com en in de klantomgeving (${appHost}).`,
      'Bezoekersstatistieken, alleen met uw toestemming: Google Analytics 4 (Google Ireland Ltd / Google LLC) meet het bezoek aan de website en de effectiviteit van onze campagnes, in de vorm van geaggregeerde statistieken. Geplaatste cookies: _ga en _ga_<ID>, maximaal 13 maanden bewaard. Gegevens kunnen naar de Verenigde Staten worden doorgegeven; die doorgifte valt onder het EU-VS-kader voor gegevensbescherming (Data Privacy Framework).',
      'Advertentiemeting, alleen met uw toestemming: de Meta-pixel (Meta Platforms Ireland Ltd) meet de resultaten van onze advertenties op Facebook en Instagram (bezoeken, terugbelverzoeken, klikken naar WhatsApp of de telefoon). De pixel plaatst onder meer de cookie _fbp, maximaal 3 maanden bewaard. Gegevens die u in onze formulieren invult (naam, e-mail, telefoonnummer) worden niet aan Meta doorgegeven. Meta kan gegevens naar de Verenigde Staten (Meta Platforms, Inc.) doorgeven; die doorgifte valt onder het EU-VS-kader voor gegevensbescherming (Data Privacy Framework).',
      'Zonder uw toestemming wordt geen van deze cookies geplaatst en wordt de Meta-pixel niet geladen.',
      'U kunt uw keuze op elk moment wijzigen of uw toestemming intrekken via de link “Cookies beheren” onderaan elke pagina. Weigeren heeft geen invloed op het gebruik van de website.',
      `De widget van onze assistent, geladen vanaf ${appHost}, kan technische opslag gebruiken die nodig is voor het gesprek. De klantomgeving (${appHost}) gebruikt sessiecookies die nodig zijn om in te loggen.`,
    ],
    questions: 'Vragen: ',
  },

  blog: {
    meta: {
      title: (brand: string) => `Blog: AI-telefoonassistent en bereikbaarheid · ${brand}`,
      description: 'Artikelen van experts, praktijkvoorbeelden en uitgebreide gidsen om de telefonische conversie van uw bedrijf te verbeteren met AI-spraakagents.',
    },
    eyebrow: 'Kennis en inzichten',
    h1: 'Blog over AI-telefonie en bereikbaarheid',
    intro: 'Strategieën voor telefonische conversie, analyses van regelgeving en concrete ervaringen van professionals.',
    searchPlaceholder: 'Zoek een artikel…',
    all: 'Alle artikelen',
    categories: {
      productivite: 'Productiviteit',
      conformite: 'Compliance',
      'cas-client': 'Klantverhalen',
      technique: 'Techniek',
    },
    read: 'Lezen',
    notFound: {
      title: (brand: string) => `Artikel niet gevonden | ${brand}`,
      description: 'Dit artikel bestaat niet of is verplaatst.',
      h1: 'Artikel niet gevonden',
      text: 'Het artikel dat u zoekt bestaat niet of is verplaatst.',
      back: 'Terug naar de artikelen',
    },
    articleTitle: (title: string, brand: string) => `${title} | Blog ${brand}`,
    backToList: 'Terug naar het artikeloverzicht',
    readTime: (t: string) => `${t} leestijd`,
    publisher: (brand: string) => `Redactie ${brand}`,
    ctaEyebrow: 'Ga aan de slag',
    ctaTitle: 'Klaar om uw telefoon te laten beantwoorden door AI?',
    ctaText: (days: number, minutes: number) => `Test onze spraakagent vandaag nog ${days} dagen lang in de praktijk, met ${minutes} minuten inbegrepen en zonder verplichtingen.`,
    ctaButton: 'Gratis starten',
  },
};

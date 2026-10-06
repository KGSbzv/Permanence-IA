// Interfaceteksten van de niet-commerciële pagina’s (demo, contact, FAQ, proefperiode, help, over ons,
// beveiliging, 404, juridische pagina’s, blog). De variabelen (merk, bedrijf, e-mail, proefduur…)
// worden via functies doorgegeven: het merk komt uit de markt, het bedrijf en de e-mail uit SITE.
import type { Block, ChatLine, LegalSection, LegalVars, Rich, Span } from '../../fr/ui/pages';

export type { Block, ChatLine, LegalSection, LegalVars, Rich, Span };

const ADDRESS = '1603 Capitol Ave Suite 413G-2408, Cheyenne, WY 82001';

export const UI_PAGES = {
  demo: {
    meta: {
      title: (brand: string) => `Demo AI-telefoonassistent — probeer live · ${brand}`,
      description: 'Hoor hoe een AI-telefoonassistent klinkt: praat live met de agent of ontvang een demogesprek voor uw sector. Gratis en vrijblijvend, probeer het nu.',
    },
    h1: 'Probeer onze AI-telefoonassistent nu live',
    intro: 'Laat uw nummer achter en kies uw sector: de agent belt u en speelt een scenario uit uw vak. U hoort zijn stem, zijn tempo en de manier waarop hij een aanvraag kwalificeert.',
    widgetHint: 'Liever meteen? Klik op de ballon rechtsonder in beeld: onze assistent antwoordt u gesproken of schriftelijk.',
    formTitle: 'Ontvang mijn demonstratiegesprek',
    formIntro: 'Gratis gesprek, op het tijdstip van uw keuze.',
    submit: 'Ontvang het demogesprek',
    hearTitle: 'Wat u te horen krijgt',
    hearIntro: 'Een voorbeeldgesprek in een tandartspraktijk: de agent herkent de vraag, stelt een tijdslot voor en maakt het overzicht klaar voor het team.',
    steps: [
      { title: 'U laat uw nummer achter', text: 'Met uw sector en uw tijdslot.' },
      { title: 'De agent belt u', text: 'Hij speelt een scenario uit uw vak.' },
      { title: 'U test vrijuit', text: 'Stel uw vragen, verander van gedachten, onderbreek hem.' },
    ],
    liveCallTitle: 'Tandartsagent',
    scenariosTitle: 'Kies uw scenario',
  },

  contact: {
    meta: {
      title: (brand: string) => `Contact: advies over uw AI-telefoonassistent · ${brand}`,
      description: 'Vragen over een AI-telefoonassistent voor uw bedrijf? Laat uw nummer achter, wij bellen u terug voor verkoop, demo of support. Kies uw tijdslot.',
    },
    h1: 'Laat uw nummer achter, wij bellen u terug',
    intro: 'Wij publiceren geen telefoonnummer: wij bellen u terug, op het tijdslot dat u kiest. U kunt ons ook mailen.',
    commercialTitle: 'Terugbellen door verkoop',
    commercialText: 'Vragen over de abonnementen, demonstratie, offerte op maat.',
    supportTitle: 'Terugbellen door support',
    supportText: 'Klanten: configuratie, nummers, integraties.',
    emailTitle: 'E-mail',
    legal: (brand: string, company: string) => `${brand} is een merk van ${company}, ${ADDRESS}, Verenigde Staten.`,
    tabsLabel: 'Soort aanvraag',
    tabCommercial: 'Verkoop en demo',
    tabSupport: 'Klantenservice',
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
      `Betaalkaart gevraagd bij activering, ${days} dagen lang wordt er niets afgeschreven`,
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
    sectorOther: 'Andere branche',
    plan: 'Gewenst abonnement',
    planPrice: (price: string) => ` — ${price} excl. btw/maand`,
    planFree: ' — gratis',
    planQuote: ' — op offerte',
    terms: [
      'Ik ga akkoord met de ',
      { a: 'algemene voorwaarden', href: '/cgu' },
      ' en het ',
      { a: 'privacybeleid', href: '/confidentialite' },
      ', en ermee dat ik word teruggebeld voor het instellen van mijn account.',
    ] as Rich,
    termsRequired: 'Ga akkoord met de voorwaarden om teruggebeld te worden.',
    sendError: 'De aanmelding kon niet worden verzonden.',
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
    intro: 'Uw klantomgeving is in het Engels. Deze gids vertaalt elk menu en begeleidt u stap voor stap. In de klantomgeving helpt ook de hulpassistent (ballon rechtsonder) u verder in uw eigen taal, dus ook in het Nederlands, schriftelijk of gesproken.',
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
    colText: 'Waarvoor dient het',
    glossaryTitle: 'Kleine woordenlijst',
    moreBefore: 'Staat uw vraag hier niet bij? Mail naar ',
    moreAfter: ' of vraag een terugbelverzoek aan via de contactpagina.',
  },

  about: {
    meta: {
      title: (brand: string) => `Over ons: AI-telefoonservice voor bedrijven · ${brand}`,
      description: (brand: string, company: string) => `${brand} maakt telefoonservice voor bedrijven toegankelijk: AI-spraakagents die elk gesprek beantwoorden. Een merk van ${company}.`,
    },
    h1: 'Elk gesprek verdient een antwoord',
    intro: (brand: string) => `${brand} is ontstaan uit een eenvoudige vaststelling: kleine bedrijven en zzp’ers verliezen klanten omdat niemand op het juiste moment kan opnemen.`,
    photoAlt: 'Een ondernemer bekijkt haar telefoon op kantoor',
    paragraphs: [
      'Vakmensen, praktijken, kantoren, garages, salons, restaurants: uw team is bezig met uw klanten. Ondertussen gaat de telefoon.',
      'Wij stellen AI-spraakagents tot uw beschikking die als virtuele receptionist opnemen, kwalificeren, afspraken boeken en terugbellen. Zo blijft uw telefonische bereikbaarheid op orde, ingesteld op uw vak, met duidelijke prijzen en zonder verplichtingen.',
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
      description: (brand: string) => `Toestemming, versleuteling tijdens verzending, bewaartermijn en traceerbaarheid: zo beschermt ${brand} de gesprekken van uw AI-telefoonassistent.`,
    },
    h1: 'Beveiliging en AVG-compliance van uw AI-telefoongesprekken',
    intro: 'Uw gesprekken bevatten persoonsgegevens. Hier leest u welke beveiligingsmaatregelen er zijn en welke instellingen u hebt om de AVG na te leven.',
    settingsTitle: 'Uw instellingen',
    settings: [
      'Bewaartermijn van opnames en transcripties',
      'Een gesprek of contact op verzoek verwijderen',
      'Uitsluitingslijst voor uitgaande gesprekken',
      'Toegestane beltijden',
      'Vermelding „AI-assistent” aan het begin van het gesprek',
      'Opname in- of uitschakelen, met informatie voor de beller',
    ],
    commitmentsTitle: 'Onze toezeggingen',
    commitments: [
      'De agent stelt zich voor als AI en doet zich niet voor als mens',
      'Uw campagnes mogen alleen contacten bellen die daarmee hebben ingestemd; een ingebouwde blokkeerlijst sluit de anderen uit',
      'Geen medische, juridische of financiële diagnose door de agent',
      'Uw gegevens worden nooit verkocht; ze worden gebruikt om de dienst te leveren en te verbeteren',
      'Begeleiding bij het aanpassen van uw privacyverklaringen',
    ],
    rights: ['Voor vragen of om uw rechten uit te oefenen: ', { a: 'privacybeleid', href: '/confidentialite' }, '.'] as Rich,
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
      title: (brand: string) => `Algemene voorwaarden (gebruik en verkoop) — ${brand}`,
      description: (brand: string) => `Lees de algemene gebruiks- en verkoopvoorwaarden die van toepassing zijn op de abonnementen en diensten van de AI-telefoniedienst van ${brand}.`,
    },
    h1: 'Algemene gebruiks- en verkoopvoorwaarden',
    updated: 'Van toepassing op professionals en bedrijven • Laatst bijgewerkt: 29 september 2026',
    sections: ({ brand, company, email, appHost, legal }: LegalVars): LegalSection[] => [
      {
        title: 'Artikel 1 — Doel van de dienst',
        body: [
          { p: ['Deze Algemene Voorwaarden regelen de toegang tot en het gebruik van het softwareplatform en de telefoniediensten met een conversationele agent op basis van kunstmatige intelligentie, die onder het merk ', { strong: brand }, ` worden aangeboden door de vennootschap ${company}.`] },
          { p: 'Met de dienst kunnen bedrijven de ontvangst van inkomende telefoongesprekken, de kwalificatie van bellers en het gesynchroniseerd inplannen van afspraken uitbesteden, 24 uur per dag en 7 dagen per week.' },
        ],
      },
      {
        title: 'Artikel 2 — Voorwaarden van de gratis proefperiode van 14 dagen',
        body: [
          { p: 'Elke nieuwe klant krijgt bij zijn eerste aanmelding voor een abonnement een gratis proefperiode van veertien (14) opeenvolgende kalenderdagen, inclusief 30 belminuten:' },
          {
            ul: [
              [{ strong: 'Betaalmiddel:' }, ' Bij activering van de proefperiode wordt om een betaalkaart gevraagd. Tijdens de 14 proefdagen wordt geen bedrag afgeschreven. Alle prijzen zijn exclusief belastingen.'],
              [{ strong: 'Gebruikslimiet:' }, ' Gesprekken zijn tijdens de proefperiode beperkt tot 30 minuten; daarboven worden ze opgeschort tot het abonnement start.'],
              [{ strong: 'Einde van de proefperiode:' }, ' Na afloop van de 14 dagen start het abonnement op het gekozen pakket en wordt de eerste maandtermijn afgeschreven, tenzij de klant het vóór die datum via zijn klantomgeving heeft opgezegd; in dat geval wordt er geen bedrag afgeschreven.'],
              [{ strong: 'Redelijk gebruik:' }, ' De gratis proefperiode is beperkt tot één per rechtspersoon / registratienummer.'],
            ],
          },
        ],
      },
      {
        title: 'Artikel 3 — Gratis proefperiode, geen herroepingsrecht en geen terugbetaling',
        body: [
          { p: "Overeenkomsten tussen professionele partijen vallen niet onder het herroepingsrecht voor consumenten. Met de gratis proefperiode van 14 dagen kan de klant de dienst testen vóór elke betaling en deze vóór het einde ervan kosteloos opzeggen." },
          { p: [{ strong: 'Een eenmaal betaalde periode wordt niet terugbetaald' }, ', ook niet gedeeltelijk, omdat de dienst en de minuten vanaf het begin van de periode ter beschikking worden gesteld. Gekocht tegoed (opwaarderingen) wordt evenmin terugbetaald; het vervalt niet. Opzeggen blijft op elk moment mogelijk voor de volgende perioden (artikel 4).'] },
        ],
      },
      {
        title: 'Artikel 4 — Facturatie, Tarieven & Opzegging',
        body: [
          { p: 'De prijzen zijn uitgedrukt in Amerikaanse dollars (USD), exclusief belastingen. De toepasselijke belastingen worden bij betaling automatisch berekend op basis van het land van de klant en zijn status (particulier of bedrijf, met of zonder btw-nummer). Betalingen verlopen maandelijks via onze beveiligde betaaldienstverlener Stripe; het abonnement wordt elke maand stilzwijgend verlengd.' },
          { p: ['De klant kan zijn abonnement op elk moment en zonder opzegtermijn opzeggen via zijn dashboard ', { strong: appHost }, '. De opzegging gaat in aan het einde van de reeds betaalde maandperiode. De klant kan op elk moment van abonnement wisselen en minuten toevoegen door tegoed op te waarderen; gekocht tegoed vervalt niet en wordt gebruikt om de minuten boven het abonnement te betalen, tegen het tarief per extra minuut dat op de pagina Prijzen staat vermeld.'] },
        ],
      },
      {
        title: 'Artikel 5 — Aansprakelijkheid en aard van de verplichting',
        body: [
          { p: [`${brand} heeft een `, { strong: 'inspanningsverplichting' }, ' wat betreft de beschikbaarheid en de technische verwerking van de gespreksstromen. De gebruiker erkent dat generatieve AI-modellen en spraaksynthese af en toe onnauwkeurige of onjuiste antwoorden kunnen geven.'] },
          { p: `${brand} is in geen geval aansprakelijk voor indirecte bedrijfsschade, gederfde winst of commerciële schade. In alle gevallen is de maximale schadevergoeding uitdrukkelijk beperkt tot het bedrag exclusief belastingen dat de klant heeft betaald in de maand voorafgaand aan de schadeveroorzakende gebeurtenis.` },
        ],
      },
      {
        title: 'Artikel 6 — Verboden gebruik & Opschorting',
        body: [
          { p: `Strikt verboden zijn: ongevraagde telemarketingcampagnes (misbruik in de vorm van spraakspam), frauduleuze activiteiten, lasterlijke, discriminerende of onrechtmatige uitingen. Bij vastgesteld misbruik behoudt ${brand} zich het recht voor de toegang tot de toegewezen lijn zonder schadevergoeding op te schorten.` },
        ],
      },
      {
        title: 'Artikel 7 — Toepasselijk recht en bevoegde rechter',
        body: [
          { p: `Op deze voorwaarden is ${legal.governingLaw} van toepassing. Geschillen over de uitleg of uitvoering ervan worden uitsluitend voorgelegd aan ${legal.court}.` },
          ...(legal.mandatoryNote ? [{ p: legal.mandatoryNote }] : []),
        ],
      },
    ],
  },

  privacy: {
    meta: {
      title: (brand: string) => `Privacybeleid — ${brand}`,
      description: (brand: string) => `Hoe ${brand} uw gegevens verwerkt: terugbelverzoeken, AI-agents en opnames, klantaccount, facturatie via Stripe, dienstverleners en uw rechten.`,
    },
    breadcrumb: 'Privacy',
    h1: 'Privacybeleid',
    intro: 'Wat we verzamelen, waarom, met wie, hoe lang, en hoe u uw rechten uitoefent.',
    updated: 'Bijgewerkt: oktober 2026',
    sections: ({ brand, company, email, legal }: LegalVars): LegalSection[] => {
      const mail = { a: email, href: `mailto:${email}` };
      return [
        {
          title: 'Wie verantwoordelijk is voor uw gegevens',
          body: [
            { p: [`${brand} is een merk van ${company}, een vennootschap met beperkte aansprakelijkheid geregistreerd in Wyoming (Verenigde Staten), ${ADDRESS}. Contact: `, mail, '.'] },
            {
              ul: [
                [{ strong: 'Voor de website, terugbelverzoeken, gesprekken met onze assistenten en het beheer van klantaccounts' }, ` is ${company} verwerkingsverantwoordelijke.`],
                [{ strong: 'Voor gesprekken en berichten die door de agents van onze klanten worden afgehandeld' }, ' is de klant verwerkingsverantwoordelijke tegenover zijn eigen bellers, en treden wij op als verwerker namens de klant. De klant bepaalt welke gegevens zijn agent verzamelt en waarvoor die worden gebruikt.'],
              ],
            },
          ],
        },
        {
          title: 'De gegevens die wij verwerken',
          body: [
            {
              ul: [
                [{ strong: 'Formulieren op de website' }, ' (terugbellen, demo, begeleiding bij de proefperiode): naam, telefoonnummer, e-mailadres, bedrijf, sector, gewenst tijdslot en uw bericht.'],
                [{ strong: 'Gesprekken met onze AI-assistenten' }, ' (chatballon op de website, receptionist, commerciële en supportgesprekken, hulp in de klantomgeving): geschreven inhoud, audio-opname van gesproken gesprekken, transcriptie, samenvatting en geëxtraheerde nuttige informatie (behoefte, beoogd abonnement, gemeld probleem).'],
                [{ strong: 'Klantaccount' }, ': identiteit, e-mailadres, bedrijf, instellingen van uw agents, geschiedenis van gesprekken en berichten, minutenverbruik.'],
                [{ strong: 'Facturatie' }, ': abonnement, facturen en betaalmiddel. Kaartgegevens worden ingevoerd en bewaard door Stripe; wij hebben er nooit toegang toe.'],
                [{ strong: 'Technische gegevens' }, ': IP-adres en browsergegevens die nodig zijn voor de werking en beveiliging van de website.'],
              ],
            },
          ],
        },
        {
          title: 'Waarom en op welke grondslag',
          body: [
            {
              ul: [
                [{ strong: 'U terugbellen en uw aanvraag beantwoorden' }, ', ook via een gesprek met onze AI-spraakagent: op basis van uw toestemming, gegeven op het moment van de aanvraag. U kunt die op elk moment intrekken, en de agent respecteert elk verzoek om niet meer gebeld te worden.'],
                [{ strong: 'De dienst, de gratis proefperiode en support leveren' }, ': uitvoering van de overeenkomst.'],
                [{ strong: 'Factureren en voldoen aan onze boekhoudkundige en fiscale verplichtingen' }, ': wettelijke verplichting.'],
                [{ strong: 'Onze assistenten verbeteren en het platform beveiligen' }, ': gerechtvaardigd belang, uitsluitend op basis van onze eigen gesprekken.'],
              ],
            },
          ],
        },
        {
          title: 'AI-agents en opnames',
          body: [
            { p: 'Onze assistenten zijn kunstmatige intelligenties en stellen zich ook als zodanig voor. Gesproken gesprekken worden opgenomen en uitgeschreven om uw aanvraag op te volgen en de kwaliteit van de dienst te waarborgen. Er worden geen besluiten met rechtsgevolgen voor u volledig geautomatiseerd genomen.' },
            { p: 'Onze klanten die het platform gebruiken, moeten hun eigen bellers informeren over het gebruik van een AI-agent en over de opname, volgens de regels die voor hun activiteit gelden.' },
          ],
        },
        {
          title: 'Onze dienstverleners',
          body: [
            {
              ul: [
                [{ strong: 'Autocalls' }, ': technisch platform voor de spraakagents, de widgets en de klantomgeving (gesprekken, transcriptie, spraaksynthese, automatiseringen).'],
                [{ strong: 'Leveranciers van AI, stemmen en telefonie' }, ' die door dit platform worden gebruikt om gesprekken te begrijpen, te beantwoorden en door te sturen.'],
                [{ strong: 'Stripe' }, ': abonnementen, betalingen, facturen en belastingberekening (PCI-DSS niveau 1 gecertificeerd).'],
                [{ strong: 'Supabase' }, ': database voor terugbelverzoeken, aanmeldingen en gespreksverslagen (Verenigde Staten).'],
                [{ strong: 'Google Cloud (Firebase App Hosting)' }, ': hosting van de website (Verenigde Staten).'],
                [{ strong: 'Zoho Mail' }, ': verzending van service- en opvolgingsmails.'],
              ],
            },
          ],
        },
        {
          title: 'Doorgifte buiten de Europese Economische Ruimte',
          body: [
            { p: `Meerdere van deze dienstverleners, evenals onze vennootschap, zijn gevestigd in de Verenigde Staten. Doorgifte van persoonsgegevens buiten de Europese Economische Ruimte gebeurt in overeenstemming met ${legal.privacyLaw}: op basis van het EU-VS-kader voor gegevensbescherming (Data Privacy Framework) wanneer de dienstverlener daarbij is aangesloten, en anders op basis van de modelcontractbepalingen (standaardcontractbepalingen) van de Europese Commissie.` },
          ],
        },
        {
          title: 'Hoe lang wij ze bewaren',
          body: [
            {
              ul: [
                'Terugbelverzoeken en gesprekken met onze assistenten: 24 maanden na het laatste contact.',
                'Opnames en transcripties van gesprekken die voor onze klanten zijn afgehandeld: standaard 12 maanden; elke klant kan deze termijn verkorten en zijn gegevens via zijn klantomgeving verwijderen.',
                'Accountgegevens: gedurende de hele relatie, daarna 3 jaar voor eventuele marketing, tenzij u bezwaar maakt.',
                'Facturen en boekhoudgegevens: wettelijke termijn (tot 10 jaar).',
              ],
            },
          ],
        },
        {
          title: 'Beveiliging',
          body: [
            { p: 'Gegevensverkeer wordt tijdens verzending versleuteld, toegang tot gegevens is beperkt tot de mensen die die nodig hebben en beveiligd met authenticatie, en technische sleutels worden bewaard in beveiligde kluizen voor geheimen. Klanten kunnen tweestapsverificatie inschakelen voor hun klantomgeving.' },
          ],
        },
        {
          title: 'Uw rechten',
          body: [
            { p: ['U kunt vragen om inzage in uw gegevens, rectificatie, verwijdering, overdraagbaarheid en beperking van de verwerking, bezwaar maken tegen marketing en uw toestemming om teruggebeld te worden intrekken. Mail naar ', mail, ': wij antwoorden binnen een maand.'] },
            { p: `U kunt ook een klacht indienen bij ${legal.dataAuthority}, of bij de toezichthouder voor gegevensbescherming in het land van de Europese Economische Ruimte waar u woont.` },
          ],
        },
        {
          title: 'Cookies',
          body: [
            { p: ['De website gebruikt geen advertentiecookies. De details staan op de pagina ', { a: 'cookies', href: '/cookies' }, '.'] },
          ],
        },
      ];
    },
  },

  legalNotice: {
    meta: {
      title: (brand: string) => `Juridische informatie — ${brand}`,
      description: (brand: string) => `Juridische informatie, gegevens over de uitgever, de hosting en het auteursrecht van het platform ${brand}.`,
    },
    h1: 'Juridische informatie',
    updated: 'Laatst bijgewerkt: 29 september 2026',
    sections: ({ brand, company, email, legal }: LegalVars): LegalSection[] => [
      {
        title: '1. Uitgever van de website',
        body: [
          { p: ['De website die bereikbaar is op het adres ', { strong: 'https://permanenceia.com' }, ' wordt uitgegeven door de vennootschap ', { strong: company }, '.'] },
          {
            ul: [
              [{ strong: 'Handelsnaam:' }, ` ${brand}`],
              [{ strong: 'Rechtsvorm:' }, ' Limited Liability Company (LLC), staat Wyoming, Verenigde Staten'],
              [{ strong: 'Registratienummer:' }, ' 2026-001905061'],
              [{ strong: 'Statutaire zetel:' }, ' 1603 Capitol Ave, Suite 413G-2408, Cheyenne, WY 82001, Verenigde Staten'],
              [{ strong: 'Contact-e-mail:' }, ` ${email}`],
              [{ strong: 'Verantwoordelijke uitgever:' }, ` de wettelijk vertegenwoordiger van ${company}.`],
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
              [{ strong: 'Front-endplatform:' }, ' Google LLC (Firebase App Hosting / Google Cloud), 1600 Amphitheatre Parkway, Mountain View, CA 94043, VS. Hostingregio: us-east4 (Noord-Virginia, Verenigde Staten).'],
              [{ strong: 'Databases & Opslag:' }, ' Supabase Inc., infrastructuur in de Verenigde Staten (AWS-regio us-east-1, Virginia).'],
              [{ strong: 'Telefoonnetwerk & Spraaksynthese:' }, ' Cloudinfrastructuur voor spraaktelefonie.'],
            ],
          },
        ],
      },
      {
        title: '3. Intellectueel eigendom',
        body: [
          { p: ['Het merk ', { strong: brand }, `, het logo (de ballon in stand-by, de geluidsgolven en de beschikbaarheidsstip) en alle huisstijlen, teksten, gespreksscripts, infographics en broncodes op de website zijn exclusief eigendom van ${company}.`] },
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
      description: (brand: string) => `Welke cookies de website van ${brand} gebruikt: alleen strikt noodzakelijke cookies, geen advertentiecookies. Lees het cookiebeleid.`,
    },
    h1: 'Cookiebeleid',
    paragraphs: (siteHost: string, appHost: string) => [
      `De website ${siteHost} gebruikt uitsluitend cookies die strikt noodzakelijk zijn voor de werking ervan (beveiliging, load balancing). Er worden op dit moment geen advertentiecookies of analytische cookies van derden geplaatst.`,
      'Als er tools voor bezoekersstatistieken of advertenties worden toegevoegd, vraagt een banner om uw toestemming voordat er iets wordt geplaatst, en wordt deze pagina bijgewerkt met de lijst van cookies, hun doel en hun bewaartermijn.',
      `De klantomgeving (${appHost}) gebruikt sessiecookies die nodig zijn om in te loggen.`,
    ],
    questions: 'Vragen: ',
  },

  blog: {
    meta: {
      title: (brand: string) => `Blog: AI-telefoonassistent en bereikbaarheid · ${brand}`,
      description: 'Artikelen van experts, praktijkvoorbeelden en uitgebreide gidsen om de telefonische conversie van uw bedrijf te verbeteren met AI-spraakagents.',
    },
    eyebrow: 'Kennis & inzichten',
    h1: 'Het journaal van de AI-receptie',
    intro: 'Strategieën voor telefonische conversie, analyses van regelgeving en concrete ervaringen van professionals.',
    searchPlaceholder: 'Zoek een artikel...',
    all: 'Alle artikelen',
    categories: {
      productivite: 'Productiviteit',
      conformite: 'Compliance',
      'cas-client': 'Klantcase',
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
    publisher: (brand: string) => `${brand} Publicaties`,
    ctaEyebrow: 'Ga aan de slag',
    ctaTitle: 'Klaar om uw bedrijf uit te rusten met een AI-telefoniedienst?',
    ctaText: (days: number, minutes: number) => `Test onze spraakagent vandaag nog ${days} dagen lang in de praktijk, met ${minutes} minuten inbegrepen en zonder verplichtingen.`,
    ctaButton: 'Gratis starten',
  },
};

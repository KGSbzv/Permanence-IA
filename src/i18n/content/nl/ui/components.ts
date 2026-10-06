// Interfaceteksten van de gedeelde componenten (src/components). De cijfers (prijzen, minuten,
// proefdagen) en de merknaam komen als parameters binnen: ze komen uit de markt (src/i18n/markets.ts).
export const UI_COMPONENTS = {
  layout: {
    home: 'Home',
    freeTrial: 'Gratis starten',
    callMeBack: 'Bel mij terug',
  },

  navbar: {
    menus: {
      features: 'Functies',
      allFeatures: 'Alle functies',
      allFeaturesText: 'Overzicht van de modules en abonnementen.',
      sectors: 'Sectoren',
      allSectors: 'Alle sectoren',
      resources: 'Hulpbronnen',
    },
    resources: {
      demo: 'Live demo',
      integrations: 'Integraties',
      security: 'Beveiliging en compliance',
      faq: 'Veelgestelde vragen',
      help: 'Help bij de klantomgeving',
      about: 'Over ons',
      contact: 'Contact en terugbellen',
    },
    pricing: 'Prijzen',
    login: 'Inloggen',
    startFree: 'Gratis starten',
    mainNav: 'Hoofdnavigatie',
    mobileNav: 'Mobiele navigatie',
    openMenu: 'Menu openen',
    closeMenu: 'Menu sluiten',
  },

  footer: {
    tagline: 'AI-spraakagents die opnemen, kwalificeren, afspraken boeken en terugbellen voor uw bedrijf, 24 uur per dag.',
    startFree: 'Gratis starten',
    login: 'Inloggen',
    gdpr: 'Ingebouwde AVG-hulpmiddelen',
    encryption: 'Versleuteling tijdens verzending',
    cols: {
      platform: 'Platform',
      allFeatures: 'Alle functies',
      offers: 'Abonnementen',
      recharges: 'Minuten opwaarderen',
      compare: 'Abonnementen vergelijken',
      sectors: 'Sectoren',
      resources: 'Hulpbronnen',
    },
    resources: {
      demo: 'Live demo',
      integrations: 'Integraties',
      faq: 'Veelgestelde vragen',
      help: 'Help bij de klantomgeving',
      about: 'Over ons',
      security: 'Beveiliging en compliance',
      contact: 'Contact',
    },
    copyright: (year: number, brand: string, company: string) => `© ${year} ${brand} — een merk van ${company}. Getoonde prijzen zijn excl. btw.`,
    legal: {
      notice: 'Juridische informatie',
      terms: 'Algemene voorwaarden',
      privacy: 'Privacy',
      cookies: 'Cookies',
    },
  },

  callbackModal: {
    titleSupport: 'Terugbelverzoek voor support',
    titleCommercial: 'Laat uw nummer achter, wij bellen u terug',
    intro: 'Kies uw tijdslot. Wij publiceren geen telefoonnummer: wij bellen u terug.',
    close: 'Sluiten',
  },

  trialNudge: {
    title: (minutes: string) => `Uw eerste ${minutes} minuten zijn gratis`,
    close: 'Sluiten',
    text: (days: number) => `Test uw spraakagent ${days} dagen lang op uw echte gesprekken, voordat u beslist.`,
    points: ['Kaart gevraagd bij activering, tijdens de proefperiode wordt niets afgeschreven', 'Op te zeggen vanuit uw klantomgeving', 'Eerste agent binnen enkele minuten klaar'],
    claim: (minutes: string) => 'Gratis starten',
    callMeBack: 'Bel mij terug',
  },

  liveCall: {
    title: 'Receptieagent',
    leadTitle: 'Aanvraag aangemaakt',
    ariaLabel: 'Voorbeeld van een gesprek afgehandeld door de agent',
    ended: 'Gesprek beëindigd · samenvatting verstuurd',
    ongoing: 'Gesprek bezig',
  },

  trialBadges: {
    ariaLabel: 'Voorwaarden van de proefperiode',
  },

  ctas: {
    primary: 'Gratis starten',
    demo: 'Probeer onze agent live',
    callback: 'Bel mij terug',
  },

  callbackForm: {
    submit: 'Bel mij terug',
    consentRequired: 'Vink het vakje aan om akkoord te gaan met terugbellen.',
    sendFailed: 'De aanvraag kon niet worden verzonden.',
    retry: (email: string) => `Probeer het opnieuw of mail naar ${email}.`,
    sentTitle: 'Terugbelverzoek verzonden',
    sentText: 'Wij bellen u terug op het gekozen tijdslot. Als u uw e-mailadres hebt opgegeven, ontvangt u een bevestiging.',
    name: 'Naam',
    phone: 'Telefoon',
    sector: 'Sector',
    choose: 'Kies…',
    otherSector: 'Andere branche',
    when: 'Wanneer mogen we u terugbellen?',
    slots: {
      asap: 'Zo snel mogelijk',
      todayAfternoon: 'Vanmiddag',
      tomorrowMorning: 'Morgenochtend',
      tomorrowAfternoon: 'Morgenmiddag',
      precise: 'Op een specifieke dag en tijd',
    },
    preciseLabel: 'Datum en tijd (uw lokale tijd)',
    email: 'E-mail',
    emailHint: '(voor de bevestiging)',
    need: 'Uw vraag',
    needPlaceholder: 'Bijv.: ik mis ’s avonds gesprekken, ik wil afspraken automatiseren…',
    consent: (brand: string) => `Ik ga ermee akkoord dat ik op het opgegeven nummer word teruggebeld, ook door een AI-spraakagent van ${brand}. Mijn gegevens worden alleen gebruikt om mijn aanvraag af te handelen.`,
    sending: 'Verzenden…',
  },

  benefits: {
    items: [
      { title: 'Neem ook buiten openingstijden op', text: '’s Avonds, in het weekend, tijdens uw afspraken: elk gesprek krijgt antwoord.' },
      { title: 'Kwalificeer automatisch', text: 'De agent stelt uw vragen en stuurt u een volledige aanvraag.' },
      { title: 'Boek afspraken', text: 'Direct in uw agenda, met bevestiging; herinneringen per sms of WhatsApp vanaf het Assistent-abonnement.' },
      { title: 'Bel leads sneller terug', text: 'Een ingevuld formulier wordt binnen enkele minuten een gesprek.' },
      { title: 'Houd mensen vrij voor wat belangrijk is', text: 'Doorverbinden naar uw team wanneer de situatie dat vraagt.' },
    ],
    seeAgent: 'Bekijk de agent in detail',
  },

  moduleCards: {
    seeIncluded: 'Bekijk wat erbij hoort',
  },

  includesSchema: {
    // Zelfde volgorde als de iconen van de component: telefonie, automatisering, CRM, berichten, agenda, sturing, beveiliging.
    families: [
      { name: 'Telefonie', items: ['Inkomende en uitgaande gesprekken', 'Optioneel eigen nummer', 'SIP-koppeling', 'Doorverbinden naar een medewerker', 'Nummerherkenning'] },
      { name: 'Automatisering', items: ['Prompteditor', 'No-code flow builder', 'Automatiseringsassistent', '300+ koppelbare tools'] },
      { name: 'CRM en gegevens', items: ['Leads en voorkwalificatie', 'Kennisbank', 'Gespreksgeschiedenis', 'Webhooks en API'] },
      { name: 'Berichten', items: ['Sms', 'WhatsApp en templates', 'Messenger en Instagram', 'Webwidget'] },
      { name: 'Agenda', items: ['Afspraken plannen', 'Bevestigingen en herinneringen', 'Verplaatsingen en annuleringen'] },
      { name: 'Sturing', items: ['Dashboard', 'Uitgebreide rapporten', 'Rollen en rechten'] },
      { name: 'Beveiliging', items: ['Toestemming en afmelden', 'Instelbare bewaartermijn', 'Versleuteling tijdens verzending', 'Activiteitenlogboek'] },
    ],
    centerTitle: 'Uw AI-spraakagent',
    centerText: 'In het midden: een agent die is ingesteld op uw bedrijf. Eromheen: alles wat hij kan gebruiken.',
    perOffer: 'Bekijk wat er per abonnement inbegrepen is',
  },

  steps: {
    step: (n: number) => `Stap ${n}`,
  },

  demoBlock: {
    title: 'Probeer onze agent nu live',
    intro: 'Praat vanuit uw browser met de agent, of laat hem uw eigen telefoon bellen: in 30 seconden hoort u hoe de stem klinkt en hoe hij een aanvraag uit uw sector afhandelt.',
    launchTitle: 'Start de live demo',
    launchText: 'Een echt gesprek, zonder installatie.',
    callbackTitle: 'Bel mij terug',
    callbackText: 'De agent belt u op het gekozen tijdslot.',
    formTitle: 'Ontvang een demonstratiegesprek',
    formText: 'Gratis en vrijblijvend. U hoort de stem en de manier waarop de agent een aanvraag kwalificeert.',
    submit: 'Bel mij terug',
  },

  sectorCards: {
    seePage: (sectorLower: string) => `Bekijk de pagina over ${sectorLower}`,
  },

  pricingCards: {
    daysFree: (days: number) => `${days} dagen gratis`,
    negotiated: 'Onderhandelde prijs per minuut',
    mostChosen: 'Meest gekozen',
    perMinute: (label: string) => `oftewel ${label}`,
    details: 'Details van het abonnement',
    billing: 'Factuurperiode',
    monthly: 'Maandelijks',
    annual: 'Jaarlijks',
    twoMonthsFree: '2 maanden gratis',
    billedYearly: (price: string) => `${price} excl. btw per jaar gefactureerd`,
    save: (amount: string) => `u bespaart ${amount}`,
    phoneNumber: (price: string) => `+ eigen nummer vanaf ${price} / maand`,
  },

  matrix: {
    included: 'Inbegrepen',
    notIncluded: 'Niet inbegrepen',
    caption: 'Functies inbegrepen in elk abonnement',
    inYourInterface: 'In uw interface',
    pricePerMonthAnnual: 'Prijs excl. btw / maand (jaarlijkse facturatie)',
    pricePerMonth: 'Prijs excl. btw / maand',
    includedMinutes: 'Inbegrepen minuten',
    extraMinute: 'Extra minuut',
    phoneNumber: 'Eigen nummer',
    phoneNumberFrom: (price: string) => `vanaf ${price} / maand`,
    showAll: (n: number) => `Alle modules bekijken (${n})`,
    showLess: 'Vergelijking inklappen',
    legendIncluded: 'Inbegrepen',
    legendNotIncluded: 'Niet inbegrepen',
    legendLimit: 'Getal = limiet van het abonnement',
  },

  includedStack: {
    title: 'Alles inbegrepen, geen enkele API-sleutel',
    intro: 'De beste AI-modellen, stemmen en transcriptie zijn al gekoppeld in uw klantomgeving. Geen account openen bij elke leverancier, geen sleutels kopiëren, één factuur.',
    groups: [
      { key: 'llm', title: 'Taalmodellen', text: 'Het brein van de agent: het begrijpt de vraag en bepaalt wat het antwoordt.' },
      { key: 's2s', title: 'Realtime spraak', text: 'Modellen die direct luisteren en spreken, voor de meest natuurlijke gesprekken.' },
      { key: 'tts', title: 'Spraaksynthese', text: 'Honderden natuurlijke stemmen, in meer dan 30 talen.' },
      { key: 'stt', title: 'Transcriptie', text: 'Snelle spraakherkenning, ook via de telefoon.' },
      { key: 'channels', title: 'Kanalen', text: 'Dezelfde agent antwoordt overal waar uw klanten u schrijven of bellen.' },
    ],
    noKeys: ['Geen API-sleutels te beheren', 'Wissel met één klik van model of stem', 'Eén factuur, in dollars excl. btw'],
    note: 'Merknamen worden uitsluitend beschrijvend vermeld: ze zijn eigendom van hun respectieve eigenaren en verwijzen naar de technologieën die in de klantomgeving beschikbaar zijn, zonder partnerschap met deze bedrijven. De lijst verandert mee met het platform.',
    channelNames: { phone: 'Telefoon', sip: 'SIP', widget: 'Webwidget', email: 'E-mail' },
  },

  recharges: {
    title: 'Tegoed opwaarderen',
    text: 'Met het tegoed betaalt u de minuten boven uw abonnement. Het vervalt niet en wordt direct toegevoegd.',
    rechargeCol: 'Opwaardering excl. btw',
    approxMinutes: (n: string) => `≈ ${n} min`,
    cheaperTitle: 'Het abonnement blijft voordeliger',
    cheaperText: 'Een inbegrepen minuut is altijd goedkoper dan een extra minuut.',
    included: 'Inbegrepen:',
    extra: (price: string) => ` · extra: ${price} excl. btw / min`,
  },

  growthBlock: {
    rules: [
      { title: 'Eenmalig iets meer verbruikt', text: 'Een opwaardering is genoeg om de maand af te maken.' },
      { title: 'Regelmatig meer verbruikt', text: 'Wij stellen u het grotere abonnement voor.' },
      { title: 'Vaak opwaarderen', text: 'Uw dashboard laat zien dat u te veel betaalt voor uw gebruik.' },
    ],
    ruleCustom: (minutes: string) => `Vanaf ${minutes} min per maand`,
    ruleCustomText: 'Wij stellen een abonnement op maat samen.',
    case1Minutes: (minutes: string) => `${minutes} min deze maand`,
    case1Plan: (plan: string) => `${plan} + een opwaardering`,
    case1Note: (price: string, extraMinutes: string, extraPrice: string, total: string) =>
      `${price} + ${extraMinutes} min × ${extraPrice} ≈ ${total} excl. btw. Eenmalig iets meer: een opwaardering is genoeg.`,
    case2Minutes: (minutes: string) => `${minutes} min per maand`,
    case2Plan: (plan: string) => `Stap over op ${plan}`,
    case2Note: (price: string, minutes: string, total: string, smallerPlan: string) =>
      `${price} excl. btw voor ${minutes} min, tegenover ≈ ${total} met ${smallerPlan} + extra minuten. Goedkoper, en met ruimte over.`,
    case3Minutes: (minutes: string) => `${minutes} min per maand`,
    case3Plan: 'Maatwerk',
    case3Note: (plan: string) => `Boven het abonnement ${plan} spreken we een prijs per minuut af die past bij uw volume.`,
    title: 'Voeg minuten toe of wissel van abonnement, op het juiste moment',
    intro: 'Wij laten u weten wanneer een opwaardering volstaat en wanneer het volgende abonnement voordeliger wordt.',
    customerAt: 'Een klant met',
  },

  planFor: {
    oneOffRecharge: ' + eenmalige opwaardering',
    rechargeOrCustom: ' + opwaardering, of maatwerk bij vast volume',
  },

  economy: {
    title: 'Bereken uw rendement',
    intro: 'Vul uw belvolume in: de calculator kiest het goedkoopste abonnement voor dat volume, toont de werkelijke prijs per minuut en vergelijkt die met de kosten van een menselijke receptie.',
    calculator: 'Rendementscalculator',
    yourCalls: 'Uw gesprekken',
    yourCosts: 'Uw receptie vandaag',
    callsPerMonth: 'Gesprekken per maand',
    avgDuration: 'Gemiddelde gespreksduur',
    hourlyCost: 'Uurkosten van een medewerker (incl. werkgeverslasten)',
    missedRate: 'Gemiste gesprekken vandaag',
    customerValue: 'Gemiddelde waarde van een nieuwe klant',
    min: ' min',
    perHour: ' / u',
    minutesMonth: 'Minuten per maand',
    bestPlan: 'Goedkoopste abonnement voor dit volume',
    planCost: (plan: string) => `Kosten ${plan}`,
    withExtra: (minutes: string, price: string) => `waarvan ${minutes} extra min à ${price}`,
    customAbove: (minutes: string) => `Boven ${minutes} min per maand op vaste basis vraagt u een aanbod op maat aan.`,
    effectivePerMinute: 'Werkelijke prijs per minuut',
    humanCost: 'Kosten van een menselijke receptie',
    savings: 'Maandelijkse besparing',
    noSavings: 'Bij dit volume kost de agent iets meer dan een medewerker, maar hij antwoordt 24/7 en meerdere gesprekken tegelijk.',
    recovered: 'Teruggewonnen omzet (schatting)',
    recoveredDetail: (calls: string) => `${calls} gemiste gesprekken per maand alsnog opgevangen`,
    netBenefit: 'Geschat maandelijks voordeel',
    roi: (x: string) => `Rendement: ${x} keer de prijs van het abonnement`,
    perMonth: ' / maand',
    assumptions: (wrapUp: number, conversion: number) =>
      `Aannames: ${wrapUp} min nawerk per gesprek voor een medewerker, ${conversion} % van de gemiste gesprekken wordt klant. Prijzen excl. btw in Amerikaanse dollars; telefoonnummer niet inbegrepen. Indicatieve schatting, vergelijk met uw eigen cijfers.`,
    cta: 'Gratis proberen',
  },

  humanVsAi: {
    title: 'De eerlijke vergelijking met een receptionist',
    intro: 'Een receptionist is waardevol. Maar die heeft ook een prijs, vaste werktijden en neemt maar één gesprek tegelijk aan. Hier is de vergelijking, regel voor regel.',
    caption: 'Vergelijking tussen een fulltime receptionist en de AI-agent',
    human: 'Fulltime receptionist',
    ai: 'AI-agent',
    rows: [
      { label: 'Kosten per maand', human: 'Minstens het wettelijk minimumloon, plus werkgeverslasten', ai: 'Vanaf {from} excl. btw per maand (350 min), of {payg} per minuut zonder abonnement' },
      { label: 'Bereikbaar', human: '36 tot 40 uur per week', ai: '24/7 (168 uur per week)' },
      { label: 'Gesprekken tegelijk', human: 'Eén', ai: 'Meerdere tegelijk' },
      { label: 'Talen', human: 'Eén, soms twee', ai: 'Meer dan 80, met native stemmen' },
      { label: 'Opstarten', human: 'Werving, daarna weken inwerken', ai: 'Een paar minuten; instructies op elk moment aan te passen' },
      { label: 'Vakantie en ziekte', human: 'Vervanging nodig', ai: 'Geen' },
      { label: 'Consistentie', human: 'Wisselend, afhankelijk van drukte en tijdstip', ai: 'Bij elk gesprek dezelfde regels' },
      { label: 'Notities na het gesprek', human: 'Handmatig, als er tijd voor is', ai: 'Samenvatting, transcriptie en gegevens automatisch vastgelegd' },
    ],
    note: 'Voor gevoelige situaties blijft een mens onmisbaar: de agent geeft een samenvatting door en plant het terugbelverzoek in. Veel klanten houden hun receptie en laten de agent de drukte, de lunchpauze, de avond en het weekend opvangen. Geen opstartkosten, geen verplichtingen.',
  },

  security: {
    items: [
      { title: 'Toestemming en afmelden', text: 'Toestemming voor terugbellen, afhandeling van weigeringen, toegestane beltijden en uitsluitingslijst.' },
      { title: 'Gegevensbescherming', text: 'Versleuteling tijdens verzending, toegang beveiligd per account en instelbare bewaartermijn.' },
      { title: 'Traceerbaarheid', text: 'Gespreksgeschiedenis, transcripties en activiteitenlogboek voor elk account.' },
      { title: 'Toegangsbeheer', text: 'Elke klant heeft een eigen beveiligde omgeving; de agent heeft alleen toegang tot de informatie die u hem geeft.' },
      { title: 'Voorbereid op regelgeving', text: 'Hulpmiddelen om de AVG toe te passen: informatie, inzagerecht, verwijdering van gesprekken en opnames, bewaartermijn. Verwerkersovereenkomst (DPA) op aanvraag.' },
      { title: 'Infrastructuur', text: 'Platform gehost bij erkende cloudproviders, met back-ups en monitoring.' },
    ],
    title: 'Beveiliging en compliance voor uw AI-gesprekken',
    intro: 'Uw gesprekken bevatten informatie over uw klanten. Het platform geeft u de instellingen om die te beschermen en hun keuzes te respecteren.',
    approach: 'Onze aanpak van beveiliging',
    privacy: 'Privacybeleid',
  },

  voicesNumbers: {
    langs: ['Frans', 'Engels', 'Spaans', 'Duits', 'Italiaans', 'Portugees', 'Nederlands', 'Arabisch', 'Pools', 'Roemeens', 'Turks', 'Zweeds'],
    others: '+ 70 andere',
    voicesTitle: 'Natuurlijke stemmen in uw taal',
    voicesText: 'Meer dan 80 talen en veel accenten. De agent herkent de taal van de beller en antwoordt in dezelfde taal.',
    numbersTitle: 'Uw eigen nummer of een nieuw nummer',
    numbersText: 'Behoud uw nummer (doorschakelen, import via Twilio of Telnyx, SIP-koppeling met uw telefooncentrale) of neem optioneel een eigen nummer, per maand gefactureerd bovenop het abonnement.',
    telephonyOptions: 'Bekijk de telefonieopties',
  },

  finalCta: {
    title: 'Klaar om uw gesprekken te automatiseren?',
    primary: 'Gratis starten',
    demo: 'Bekijk de live demo',
    advisorTitle: 'Spreek een adviseur',
    advisorText: 'Laat uw nummer achter: wij bellen u terug om uw vragen te beantwoorden.',
  },

  liveDemo: {
    title: 'Praat nu met de agent',
    intro: 'Kies een rol en een taal, en probeer het in uw browser of word gebeld op uw telefoon.',
    roleLabel: 'Rol van de agent',
    // Zelfde volgorde als de bollen in de component.
    roles: [
      { name: 'Receptionist', text: 'Neemt gesprekken aan, geeft informatie en plant afspraken.' },
      { name: 'Sales', text: 'Kwalificeert aanvragen en signaleert projecten om terug te bellen.' },
      { name: 'Support', text: 'Beantwoordt vragen van uw klanten en schakelt door waar nodig.' },
    ],
    langLabel: 'Taal',
    accents: { fr: 'Frans uit Parijs', 'en-gb': 'Brits Engels', 'en-au': 'Australisch Engels', it: 'Italiaans', pl: 'Pools', nl: 'Nederlands', he: 'Israëlisch Hebreeuws' },
    sector: 'Uw vakgebied',
    modeLabel: 'Hoe wilt u het proberen',
    modeBrowser: 'In deze browser',
    modePhone: 'Bel mijn telefoon',
    stageLabel: 'Uw demo-agent',
    voiceTag: (name: string) => `Stem van ${name}`,
    browserText: 'Onze assistent opent hier. Start het spraakgesprek of typ, en vertel uw vakgebied en de rol die ze moet spelen.',
    browserCta: (name: string) => `Praat met ${name}`,
    browserOpening: 'Openen…',
    browserLegal: 'Uw browser vraagt toegang tot de microfoon voor het spraakgesprek.',
    browserError: 'De assistent kon niet worden geopend. Probeer het opnieuw of kies „Bel mijn telefoon”.',
    dialogTitle: (name: string) => `Gesprek met ${name}`,
    close: 'Sluiten',
    firstName: 'Uw voornaam',
    phone: 'Uw telefoonnummer',
    consent: 'Ik ga ermee akkoord dat de AI-demonstratieagent mij belt.',
    consentRequired: 'Vink het vakje aan om het gesprek te ontvangen.',
    sendFailed: 'De aanvraag kon niet worden verzonden.',
    sending: 'Verzenden…',
    phoneCta: 'Bel mijn telefoon',
    phoneLegal: 'Gratis en vrijblijvend. Uw nummer wordt alleen voor deze demo gebruikt.',
    sentTitle: 'Aanvraag ontvangen',
    sentText: (name: string) => `${name} belt u binnen enkele minuten tijdens de openingstijden (maandag tot en met zaterdag, 9.00–19.00 uur). Houd uw telefoon bij de hand.`,
    again: 'Opnieuw proberen',
    portraitAlt: (name: string, accent: string, male = false) => `${name}, ${male ? 'mannelijke' : 'vrouwelijke'} AI-spraakagent (${accent})`,
    voiceLabel: 'Stem',
    voiceOption: (name: string, male: boolean) => `${name}, ${male ? 'mannenstem' : 'vrouwenstem'}`,
  },

  industryMarquee: ['Loodgieters', 'Elektriciens', 'Tandartspraktijken', 'Klinieken', 'Makelaars', 'Verhuurbeheer', 'Garages', 'Schadeherstel', 'Kapsalons', 'Barbiers', 'Schoonheidssalons', 'Restaurants', 'Hotels', 'Advocaten', 'Accountants', 'E-commerce', 'Assurantie- en hypotheekadviseurs', 'VvE-beheer', 'Esthetische klinieken', 'Fysiotherapeuten', 'Osteopaten', 'Dierenartsen'],

  // Zelfde volgorde als de vlaggen van de component.
  languageMarquee: ['Frans', 'Engels', 'Spaans', 'Duits', 'Italiaans', 'Portugees', 'Nederlands', 'België', 'Zwitserland', 'Canadees-Frans', 'Arabisch', 'Pools', 'Roemeens', 'Turks', 'Zweeds', 'Hebreeuws'],

  agentTeam: {
    // Zelfde volgorde als de iconen en links van de component.
    agents: [
      { name: 'AI-receptionist', role: 'Neemt elk gesprek aan, filtert en verbindt door wat belangrijk is.' },
      { name: 'Afsprakenagent', role: 'Boekt, bevestigt, herinnert en regelt verplaatsingen.' },
      { name: 'Kwalificatieagent', role: 'Stelt uw vragen en maakt overzichten klaar om mee aan de slag te gaan.' },
      { name: 'Supportagent', role: 'Antwoordt op basis van uw documenten, escaleert gevoelige gevallen.' },
      { name: 'Opvolgagent', role: 'Bevestigt, volgt offertes op en brengt uw contacten weer in beweging.' },
      { name: 'Berichtenagent', role: 'Antwoordt en bevestigt via sms, WhatsApp en Instagram.' },
    ],
    title: 'Stel uw team van AI-agents samen',
    intro: 'Elke agent heeft een duidelijke rol. Activeer de agents die uw bedrijf nodig heeft; ze delen dezelfde geschiedenis en dezelfde informatie.',
    custom: 'Een specifiek scenario nodig? Wij stellen een agent op maat in.',
    virtualNote: 'Jade, Daan, Katie en hun collega’s zijn virtuele AI-agents: hun gezichten zijn gegenereerde illustraties, geen echte mensen.',
  },

  sectorShowcase: {
    chooseSector: 'Kies een sector',
    agentFor: (sectorLower: string) => `Agent voor ${sectorLower}`,
    seeSolution: (sectorLower: string) => `Bekijk de oplossing voor ${sectorLower}`,
  },

  scenarioExplorer: {
    chooseTrade: 'Kies uw branche',
    answering: (agentName: string) => `${agentName} neemt op`,
    replay: 'Gesprek opnieuw afspelen',
    benefitsTitle: 'Wat het voor u verandert',
    planLabel: 'Aanbevolen pakket',
    tryLive: 'Probeer dit scenario live',
  },

  useCaseTabs: {
    ariaLabel: 'Soorten gebruik',
    // Zelfde volgorde als de iconen van de component.
    tabs: {
      entrants: {
        label: 'Inkomende gesprekken',
        items: [
          { title: 'Ontvangst 24/7', text: 'Elk gesprek krijgt antwoord, ook ’s nachts en in het weekend.' },
          { title: 'Afspraken plannen', text: 'Direct boeken in uw agenda, met bevestiging.' },
          { title: 'Klantenservice', text: 'Antwoorden op basis van uw documenten, zonder wachtrij.' },
          { title: 'Kwalificatie', text: 'De juiste vragen gesteld voordat er wordt doorgegeven.' },
          { title: 'Doorverbinden', text: 'Overdracht naar uw team wanneer het ertoe doet.' },
          { title: 'Spoedgevallen', text: 'Sortering volgens uw regels en directe melding.' },
        ],
      },
      sortants: {
        label: 'Uitgaande gesprekken',
        items: [
          { title: 'Webleads terugbellen', text: 'Een ingevuld formulier wordt binnen enkele minuten een gesprek.' },
          { title: 'Bevestigingen', text: 'Afspraken en reserveringen de dag ervoor bevestigd.' },
          { title: 'Offertes opvolgen', text: 'Openstaande offertes opgevolgd op de juiste tijden.' },
          { title: 'Voorkwalificatie', text: 'Contacten gefilterd voordat uw team belt.' },
          { title: 'Verlengingen', text: 'Klanten opnieuw benaderd om te verlengen of aan te vullen.' },
          { title: 'Tevredenheidsonderzoeken', text: 'Beoordelingen verzameld na de dienstverlening.' },
        ],
      },
      messages: {
        label: 'Berichten',
        items: [
          { title: 'WhatsApp', text: 'Bevestigingen, herinneringen en schriftelijke antwoorden.' },
          { title: 'Sms', text: 'Overzicht na elk gesprek.' },
          { title: 'Instagram en Messenger', text: 'Directe berichten op één plek.' },
          { title: 'Webwidget', text: 'Met de agent praten of teruggebeld worden vanaf uw website.' },
          { title: 'Wachtlijst', text: 'Melden wanneer er een plek vrijkomt.' },
          { title: 'Eén geschiedenis', text: 'Gesprekken en berichten op dezelfde plek.' },
        ],
      },
    },
  },

  platformGrid: {
    simultaneousTitle: 'Gelijktijdige gesprekken',
    simultaneousText: 'Geen wachtrij: de agent handelt meerdere gesprekken tegelijk af op dezelfde lijn.',
    knowledgeTitle: 'Kennisbank',
    knowledgeText: 'Pdf’s, pagina’s van uw website, procedures: de agent antwoordt met uw informatie.',
    promptTitle: 'Promptassistent',
    promptText: 'Beschrijf het doel van het gesprek: een stapsgewijze assistent stelt het gedrag van de agent in.',
    transferTitle: 'Doorverbinden naar een medewerker',
    transferText: 'Als de klant erom vraagt of de situatie het vereist, gaat het gesprek naar uw team.',
    aiAgent: 'AI-agent',
    yourTeam: 'Uw team',
    reportsTitle: 'Uitgebreide rapporten',
    reportsText: 'Opnames, transcripties, samenvattingen en grafieken voor elk gesprek.',
    campaignsTitle: 'Uitgaande campagnes',
    campaignsText: 'Importeer contacten die toestemming hebben gegeven of start gesprekken vanuit uw tools en formulieren.',
  },

  lifecycle: {
    title: 'De hele klantreis op één plek',
    intro: 'Van de eerste aanvraag tot vaste klant: één platform, één geschiedenis.',
    ariaLabel: 'Fasen van de klantreis',
    // Zelfde volgorde als de iconen en mock-ups van de component.
    stages: [
      { key: 'Aantrekken', title: 'Vang elke aanvraag op', items: ['Landingspagina’s per sector', 'Webwidget: praten of teruggebeld worden', 'Lokale nummers en doorschakeling van uw lijn', '24/7 antwoord op gesprekken en berichten'] },
      { key: 'Converteren', title: 'Maak van aanvragen klanten', items: ['Kwalificatie volgens uw criteria', 'Leads binnen enkele minuten teruggebeld', 'Afspraken direct in uw agenda', 'CRM-kaart automatisch aangemaakt'] },
      { key: 'Binden', title: 'Blijf in contact met uw klanten', items: ['Bevestigingen en herinneringen', 'Support op basis van uw documenten', 'Opvolging, verlengingen en enquêtes', 'WhatsApp, sms, Instagram'] },
      { key: 'Meten', title: 'Stuur bij op basis van echte cijfers', items: ['Volumes, gespreksduur en resultaten', 'Geboekte afspraken en doorverbindingen', 'Minutenverbruik en meldingen', 'Gesprekken terugluisteren en transcripties'] },
    ],
  },

  portalPreview: {
    // Zelfde volgorde als de labelkleuren van de component.
    calls: [
      { who: 'Nieuwe patiënt', what: 'Afspraak dinsdag 9.30 uur', tag: 'Geboekt' },
      { who: 'Waterlekkage', what: 'Met voorrang terugbellen gevraagd', tag: 'Spoed' },
      { who: 'Koper driekamerappartement', what: 'Bezichtiging zaterdag 11.00 uur', tag: 'Gekwalificeerd' },
      { who: 'Vraag over openingstijden', what: 'Antwoord gegeven', tag: 'Opgelost' },
    ],
    title: 'Uw klantomgeving, overzichtelijk vanaf de eerste keer inloggen',
    intro: 'Gesprekken, afspraken, leads, berichten en minuten: alles zichtbaar op één plek, op de computer en op uw telefoon.',
    points: ['Samenvatting van elk gesprek en de volgende actie', 'Opnames en transcripties terugluisteren', 'Minutenverbruik volgen en meldingen', 'Uw agents instellen zonder code'],
    roles: 'Een beveiligde omgeving per klant, met eigen agents, nummers en gegevens.',
    dashboard: 'Dashboard',
    sampleData: 'Voorbeeldgegevens · afgelopen 30 dagen',
    stats: [['Gesprekken', '412'], ['Afspraken', '96'], ['Leads', '183'], ['Minuten', '62%']],
    notification: 'Melding',
    notifBooking: 'Nieuwe afspraak geboekt door de agent: dinsdag 9.30 uur.',
    notifMinutes: 'Minuten: 62% gebruikt.',
  },

  beforeAfter: {
    without: 'Zonder AI-agent',
    with: (brand: string) => `Met ${brand}`,
  },

  mock: {
    call: {
      agent: 'Receptieagent',
      meta: 'Inkomend gesprek · 01:24',
      client: 'Goedendag, ik wil graag een afspraak maken.',
      reply: 'Natuurlijk. Is het voor een eerste bezoek?',
    },
    calendar: {
      days: ['Ma', 'Di', 'Wo', 'Do', 'Vr'],
      week: 'Week 42',
      added: 'Afspraak toegevoegd door de agent',
      slot: 'Dinsdag · 9.30 – 10.00 uur',
    },
    transcript: {
      label: 'Transcriptie',
      question: 'Wat is ongeveer uw budget?',
      answer: 'Rond de € 300.000.',
      summaryLabel: 'Samenvatting:',
      summary: ' aankoop, budget € 300.000, bezichtiging gewenst op zaterdag.',
    },
    knowledge: {
      title: 'Kennisbank',
      rows: [
        { name: 'procedures-ontvangst.pdf', meta: 'Pdf · 1,2 MB' },
        { name: 'Pagina’s van uw website', meta: '18 pagina’s geïndexeerd' },
        { name: 'Prijzen en openingstijden', meta: 'Vandaag bijgewerkt' },
      ],
    },
    prompt: {
      title: 'Doel van het gesprek',
      hint: 'Beschrijf wat de agent moet bereiken.',
      text: 'De patiënt ontvangen, nagaan of het een nieuwe patiënt is, twee tijdsloten voorstellen en per sms bevestigen.',
      tags: ['Toon: hartelijk', 'U-vorm', 'Geen medisch advies'],
    },
    flow: {
      title: 'Scenario: weblead',
      steps: [
        { title: 'Nieuw formulier', source: 'Website' },
        { title: 'Lead bellen', source: 'Verkoopagent' },
        { title: 'Kaart aanmaken', source: 'CRM' },
        { title: 'Bevestiging sturen', source: 'WhatsApp' },
      ],
    },
    numbers: {
      title: 'Uw lijnen',
      rows: [
        { country: 'Nederland', kind: 'Lokaal nummer', agent: 'Receptieagent' },
        { country: 'België', kind: 'Lokaal nummer', agent: 'Afsprakenagent' },
        { country: 'Uw telefooncentrale', kind: 'SIP-trunk', agent: 'Doorschakeling buiten openingstijden' },
      ],
    },
    report: {
      handled: 'Afgehandelde gesprekken · voorbeeld',
      demo: 'Demo',
      stats: [['Afspraken', '96'], ['Gekwalificeerd', '183'], ['Doorverbonden', '27']],
    },
    widget: {
      question: 'Een vraag? Laten we praten.',
      talk: 'Praat met de agent',
      callback: 'Bel mij terug',
    },
    whatsapp: {
      title: 'WhatsApp · Bevestiging',
      confirmation: 'Uw afspraak op dinsdag om 9.30 uur is bevestigd. Antwoord 2 om te verplaatsen.',
      reply: 'Prima, dank u!',
    },
    campaign: {
      title: 'Campagnes',
      rows: [['Bevestigingen week 42', 'Bezig', '68%'], ['Opvolging offertes september', 'Afgerond', '41%'], ['Inactieve klanten', 'Gepland', '—']],
      note: 'Voorbeeldcijfers · alleen gesprekken met contacten die toestemming hebben gegeven',
    },
    lead: {
      title: 'Gekwalificeerde aanvraag',
      interest: 'Sterke interesse',
      fields: [['Behoefte', 'Offerte renovatie'], ['Regio', 'Utrecht-Oost'], ['Budget', '€ 8.000 – 12.000'], ['Termijn', 'Binnen 1 maand']],
      next: 'Volgende actie: morgen om 9.00 uur terugbellen',
    },
    support: {
      client: 'Mijn bestelling is niet aangekomen.',
      agent: 'Ik kijk het na. Kunt u mij het bestelnummer geven?',
      found: 'Antwoord gevonden in „leveringsvoorwaarden.pdf”',
    },
  },
};

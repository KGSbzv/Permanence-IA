// Interfaceteksten van de commerciële pagina’s: home, prijzen, abonnementen, opwaarderingen, sectoren,
// functies, integraties. De cijfers (prijzen, minuten, proefdagen) en de merknaam komen als
// parameters uit de markt (src/i18n/markets.ts): schrijf ze hier nooit uit.
//
// Titels met een gemarkeerd trefwoord zijn opgesplitst in { before, kw, after }: `kw` wordt in kleur getoond.

// SEO: hoofdzoekwoord per pagina (zie docs/seo/keywords-nl.md). Sleutel = Nederlandse naam van de
// sector of module; ontbreekt de naam, dan wordt het generieke formaat gebruikt.
const SECTOR_SEO: Record<string, { title: string; description: (days: number, minutes: number) => string }> = {
  'Service aan huis': {
    title: 'Telefoonservice voor installateurs, 24/7',
    description: (days) => `Telefoonservice voor loodgieters, elektriciens en installateurs: spoed gefilterd, aanvragen gekwalificeerd, ook na sluitingstijd. Probeer ${days} dagen gratis.`,
  },
  'Tandartsen en klinieken': {
    title: 'Telefoonservice tandarts en kliniek met AI',
    description: (days) => `Telefoonservice voor tandartsen en klinieken: afspraken geboekt, bevestigd en verplaatst zonder de behandeling te onderbreken. Probeer ${days} dagen gratis.`,
  },
  Vastgoed: {
    title: 'Telefonische bereikbaarheid makelaar met AI',
    description: (days) => `Telefonisch bereikbaar als makelaar: kopers, verkopers en huurders gekwalificeerd, ook als u op bezichtiging bent. Probeer ${days} dagen gratis.`,
  },
  'Garages en autobedrijven': {
    title: 'Telefoonservice garage: afspraken met AI',
    description: (days) => `Klanten maken telefonisch een afspraak bij uw garage: voertuig, klacht en tijdslot vastgelegd zonder de balie te storen. Probeer ${days} dagen gratis.`,
  },
  'Beauty en wellness': {
    title: 'Telefoonservice kapsalon en schoonheidssalon',
    description: (days) => `Telefoonservice voor kapsalons en schoonheidssalons: afspraken geboekt terwijl u met klanten bezig bent, ook buiten openingstijden. Probeer ${days} dagen gratis.`,
  },
  'Horeca en hotels': {
    title: 'Telefonische reserveringen voor uw restaurant',
    description: (days, minutes) => `Reserveringen voor uw restaurant of hotel telefonisch aangenomen door AI, zonder de service te onderbreken. Probeer ${days} dagen gratis, ${minutes} min inbegrepen.`,
  },
};

const FEATURE_SEO: Record<string, string> = {
  'AI-receptionist': 'Virtuele receptionist met AI, 24/7',
  'Live demo van de agent': 'Demo AI-telefoonassistent: probeer het live',
  'Afspraken plannen': 'Afspraken inplannen via de telefoon met AI',
  Klantenservice: 'AI-telefoonbeantwoorder voor klantenservice',
  Leadkwalificatie: 'Leads telefonisch kwalificeren met AI',
  'Uitgaande campagnes': 'Uitgaande belcampagnes met een AI-agent',
  'WhatsApp en berichten': 'WhatsApp en sms automatisch beantwoorden',
  Kennisbank: 'Kennisbank voor uw AI-telefoonassistent',
  Prompteditor: 'Prompteditor: stel uw AI-agent in zonder code',
  'Flow builder': 'Flow builder: automatiseringen zonder code',
  'SIP en nummers': 'SIP-koppeling: behoud uw telefoonnummer',
  Rapportage: 'Rapportage en statistieken van uw gesprekken',
  Webwidget: 'Terugbelwidget en belknop voor uw website',
};

export const UI_COMMERCE = {
  home: {
    meta: {
      title: (brand: string) => `AI-telefoonassistent voor uw bedrijf, 24/7 · ${brand}`,
      description: (days: number, minutes: number) =>
        `AI-telefoonassistent die opneemt, kwalificeert en afspraken inplant, 24/7. Probeer ${days} dagen gratis met ${minutes} minuten, zonder verplichtingen.`,
    },
    hero: {
      title: { before: 'Een AI-telefoonassistent die voor u ', kw: 'opneemt, kwalificeert en afspraken boekt', after: '' },
      intro: 'Als virtuele receptionist neemt de agent elk gesprek aan, stelt de juiste vragen, plant afspraken in en stuurt u een duidelijke samenvatting. Uw telefonische bereikbaarheid 24/7 geregeld, ingesteld op uw vak, binnen enkele minuten online.',
      photoAlt: 'Ondernemer die de samenvatting van een gesprek op haar telefoon bekijkt',
    },
    showcase: { title: 'Zie de agent aan het werk in uw vak', intro: 'Kies een sector: het gesprek speelt zich af en de aanvraag komt klaar om af te handelen binnen.' },
    benefits: { title: 'Wat de agent voor uw bedrijf doet', intro: 'Een spraakagent die uw bedrijf kent en aan het werk is wanneer u of uw team niet kan opnemen, van zzp’er tot praktijk met meerdere medewerkers.' },
    features: {
      booking: {
        title: { before: 'Automatiseer ', kw: 'afspraken en herinneringen', after: '' },
        text: 'Praktijken, salons, garages, kantoren: de agent koppelt met uw agenda, stelt vrije tijdsloten voor, boekt en bevestigt. Verplaatsingen en annuleringen inbegrepen.',
        points: ['Live agenda: Google, Outlook, Cal.com, Calendly', 'Bevestiging per sms of WhatsApp (vanaf het Assistent-abonnement)', 'Herinnering de dag vóór de afspraak (vanaf het Assistent-abonnement)'],
        link: 'Bekijk afspraken plannen',
      },
      support: {
        title: { before: 'Beantwoord ', kw: 'de vragen van uw klanten', after: ' zonder wachttijd' },
        text: 'De agent baseert zich op uw documenten, uw webpagina’s en uw procedures. Hij geeft het juiste antwoord en verbindt door naar uw team wat een mens nodig heeft.',
        points: ['Kennisbank: pdf, website, gegevens', 'Meerdere gesprekken tegelijk, zonder wachtrij', 'Doorverbinden naar een medewerker volgens uw regels'],
        link: 'Bekijk klantenservice',
      },
      leads: {
        title: { before: 'Kwalificeer uw prospects en ', kw: 'bel ze sneller terug', after: '' },
        text: 'Een ingevuld formulier op uw website wordt binnen enkele minuten een gesprek. De agent kwalificeert, volgt op en maakt een overzicht dat uw team direct kan oppakken.',
        points: ['Voorkwalificatie volgens uw criteria', 'Automatische opvolging en bevestigingen', 'Campagnes naar contacten die toestemming hebben gegeven'],
        link: 'Bekijk leadkwalificatie',
      },
    },
    useCases: { title: 'Een agent voor elk soort gesprek', intro: 'Inkomend, uitgaand of berichten: activeer de toepassingen die uw bedrijf nodig heeft.' },
    platform: {
      title: 'Het complete platform om uw gesprekken te automatiseren',
      intro: 'Alles wat een telefoonservice voor bedrijven nodig heeft, inbegrepen: stem, intelligentie, telefonie, automatiseringen en rapporten, in één omgeving.',
      link: 'Alle functies',
    },
    steps: {
      title: 'In vier stappen aan de slag',
      intro: 'U hebt geen technische kennis nodig. Wij begeleiden u bij elke stap.',
      items: (days: number, minutes: number) => [
        { title: 'Maak uw account aan', text: `Kies uw abonnement: ${days} dagen gratis, ${minutes} minuten inbegrepen, tijdens de proefperiode wordt niets afgeschreven.` },
        { title: 'Beschrijf uw bedrijf', text: 'Diensten, openingstijden, veelgestelde vragen, regels voor doorverbinden.' },
        { title: 'Test de agent', text: 'Luister naar hem in de live demo en stel de toon en de antwoorden bij.' },
        { title: 'Sluit uw gesprekken aan', text: 'Doorschakeling van uw lijn, nieuw nummer of SIP, en de widget op uw website.' },
      ],
    },
    sectors: {
      title: 'Agents afgestemd op uw vak',
      intro: 'Zes sectoren waarin elk gemist gesprek een klant kost. De agent stelt voor elk ervan de juiste vragen.',
      link: 'Alle sectoren',
    },
    integrations: {
      title: 'Gekoppeld aan uw tools',
      intro: 'Agenda, CRM, berichtenapps, telefonie: de agent werkt samen met wat u al gebruikt. De flow builder koppelt meer dan 300 tools zonder code, op dezelfde manier als Zapier of Make.',
      link: 'Bekijk alle integraties',
    },
    pricing: {
      title: 'Duidelijke abonnementen, prijzen excl. btw',
      intro: 'Kies op basis van uw belvolume. Hoe groter het abonnement, hoe goedkoper de minuut.',
      compare: 'Vergelijk alle inbegrepen functies',
    },
    faq: {
      title: 'Veelgestelde vragen',
      intro: 'Staat uw vraag er niet tussen? Laat uw nummer achter, een adviseur belt u terug.',
      link: 'Alle vragen',
    },
  },

  tarifs: {
    meta: {
      title: (brand: string) => `Prijzen AI-telefoonassistent — abonnementen · ${brand}`,
      /** Eén abonnement in de beschrijving: `price` en `minutes` zijn al opgemaakt. */
      plan: (name: string, price: string, minutes: string) => `${name} ${price} (${minutes} min)`,
      description: (plans: string[], days: number, minutes: number) =>
        `AI-telefoonassistent: ${plans.join(', ')} per maand excl. btw. Probeer ${days} dagen gratis.`,
    },
    hero: {
      title: 'Prijzen AI-telefoonassistent: kies het abonnement dat past bij uw belvolume',
      intro: (days: number, minutes: number) =>
        `Alle prijzen van uw telefoonservice zijn exclusief belastingen. Hoe groter het abonnement, hoe goedkoper de minuut. De gratis proefperiode omvat ${days} dagen en ${minutes} belminuten.`,
      moreMinutes: 'Meer minuten nodig? Waardeer op elk moment op.',
    },
    matrix: {
      title: 'Wat er in uw interface inbegrepen is',
      intro: 'Elke regel komt overeen met een pagina of functie in uw klantomgeving. Er zit niets anders verstopt achter een knop.',
    },
    recharges: {
      title: 'Meer minuten nodig?',
      intro: 'Een opwaardering helpt u door een drukke maand. Bij een vast volume blijft het grotere abonnement de voordeligste oplossing.',
      link: 'Hoe opwaarderen werkt',
    },
    faq: {
      title: 'Vragen over de prijzen',
      intro: 'Twijfelt u welk abonnement bij u past? Laat u terugbellen, of probeer de agent live.',
      primary: 'Gratis starten',
      demo: 'Bekijk de live demo',
    },
    finalCta: (minutes: number) => `Begin met ${minutes} gratis minuten`,
  },

  offer: {
    metaTitleTrial: (days: number, minutes: number, brand: string) => `Proefperiode AI-telefoonassistent: ${days} dagen · ${brand}`,
    /** `monthly`: voegt „/mnd” toe als de prijs een maandbedrag is. */
    metaTitle: (name: string, price: string, monthly: boolean, brand: string) => `${name}: AI-telefoonservice, ${price}${monthly ? '/mnd' : ''} · ${brand}`,
    metaDescription: (title: string, days: number, minutes: number) => `${title}. Start gratis: ${days} dagen, ${minutes} minuten inbegrepen, prijzen excl. btw.`,
    breadcrumb: 'Prijzen',
    productName: (brand: string, name: string) => `${brand} ${name}`,
    eyebrow: (name: string, audience: string) => `Abonnement ${name} · ${audience}`,
    demo: 'Probeer onze agent live',
    perMonth: 'excl. btw / maand',
    perMinuteLine: (perMinute: string) => `oftewel ${perMinute} binnen het abonnement`,
    facts: {
      minutes: 'Inbegrepen minuten',
      more: 'Meer nodig?',
      moreCustom: 'Onderhandeld volume',
      moreDefault: 'Op elk moment opwaarderen',
      commitment: 'Verplichting',
      commitmentValue: 'Geen',
    },
    included: {
      title: 'Wat u in uw interface vindt',
      intro: 'De exacte lijst met functies die u met dit abonnement kunt gebruiken.',
      notIncluded: 'Niet inbegrepen',
      includedLabel: 'Inbegrepen',
      compare: 'Vergelijk met de andere abonnementen',
    },
    modules: { title: 'De kernmodules van dit abonnement' },
    extra: {
      title: 'Extra minuten',
      intro: 'Een drukkere maand? Waardeer op. Groeit uw volume? Stap over op een groter abonnement.',
    },
    others: { title: 'De andere abonnementen' },
    faq: { title: 'Veelgestelde vragen' },
  },

  recharges: {
    meta: {
      title: (brand: string) => `Extra belminuten opwaarderen · ${brand}`,
      description: (price: string, minutes: string) =>
        `Extra belminuten voor uw AI-telefoonassistent: waardeer op vanaf ${price} excl. btw voor ${minutes} minuten, of stap over op een groter abonnement.`,
    },
    hero: {
      title: 'Voeg op elk moment extra belminuten toe',
      intro: 'Een opwaardering helpt u door een drukkere maand. Waardeert u vaak op, dan wordt het grotere abonnement voordeliger: wij laten u dat weten.',
    },
    how: {
      title: 'Hoe het werkt',
      steps: (min: string, max: string) => [
        { title: 'Volg uw verbruik', text: 'Uw dashboard toont de verbruikte en resterende minuten.' },
        { title: 'Voeg tegoed toe', text: `Een opwaardering van ${min} tot ${max}, met één klik in uw klantomgeving.` },
        { title: 'Ga zonder onderbreking door', text: 'Met het tegoed betaalt u de minuten boven het abonnement; het vervalt niet.' },
      ],
    },
  },

  sectorsIndex: {
    meta: {
      title: (brand: string) => `Telefoonservice met AI per branche · ${brand}`,
      description: 'Telefoonservice voor installateurs, tandartsen, makelaars, garages, salons en horeca: een AI-telefoonassistent afgestemd op uw vak. Kies uw branche.',
    },
    hero: {
      title: 'Een AI-telefoonassistent afgestemd op uw vak',
      intro: 'We hebben zes sectoren gekozen waarin gesprekken binnenkomen terwijl teams druk zijn. Daar maakt telefonische bereikbaarheid het verschil: elke gemiste aanvraag kost een klant.',
    },
    other: {
      title: 'Staat uw branche er niet tussen?',
      intro: 'Advocatenkantoren, e-commerce, werving, toerisme: de agent is in te stellen voor elk vak dat telefoontjes krijgt. Laten we uw situatie bespreken.',
      primary: 'Gratis starten',
      demo: 'Probeer onze agent live',
    },
  },

  sector: {
    meta: {
      title: (name: string, brand: string) => `${SECTOR_SEO[name]?.title ?? `${name}: AI-telefoonassistent`} · ${brand}`,
      /** `short` is de korte zin van de sector, zonder punt aan het eind. */
      description: (name: string, short: string, days: number, minutes: number) =>
        SECTOR_SEO[name]?.description(days, minutes) ?? `${name}: ${short}. Probeer ${days} dagen gratis, ${minutes} minuten inbegrepen.`,
    },
    breadcrumb: 'Sectoren',
    liveCallTitle: (name: string) => `Agent voor ${name.toLowerCase()}`,
    change: {
      title: 'Wat er verandert als de agent voor u opneemt',
      intro: (targets: string) => `${targets}. In uw vak is elk onbeantwoord gesprek een aanvraag die ergens anders terechtkomt.`,
    },
    handles: {
      title: 'Wat de agent voor uw bedrijf afhandelt',
      intro: 'Hij stelt de vragen die u zelf zou stellen, in een natuurlijke volgorde, en stuurt u een volledige aanvraag.',
    },
    /** Titel van de voordelen: „kantoor” voor vastgoed, „bedrijf” elders. */
    benefitsTitle: (slug: string) => `Wat het verandert voor uw ${slug === 'immobilier' ? 'kantoor' : 'bedrijf'}`,
    how: { title: 'Hoe het werkt' },
    includes: { title: 'Wat erbij hoort', intro: 'De handigste modules voor uw vak, allemaal beschikbaar in uw klantomgeving.' },
    integrations: {
      title: 'Handige integraties',
      intro: 'Uw agenda, uw CRM, uw berichtenapps en uw telefonie blijven hetzelfde: de agent koppelt ermee.',
    },
    pricing: {
      title: 'Prijzen excl. btw, geen verplichtingen',
      intro: (sectorName: string, offerName: string, days: number, minutes: number) =>
        `Voor ${sectorName.toLowerCase()} raden wij het abonnement ${offerName} aan. Begin met de gratis proefperiode: ${days} dagen en ${minutes} minuten inbegrepen.`,
      link: (offerName: string) => `Bekijk de details van het abonnement ${offerName}`,
    },
    faq: { title: (name: string) => `Veelgestelde vragen — ${name}` },
    callback: {
      title: 'Neem contact op: laat uw nummer achter, wij bellen u terug',
      text: 'Een adviseur belt u terug om uw situatie te bespreken.',
    },
    others: { title: 'Andere sectoren' },
    finalCta: 'Klaar om geen gesprek meer te missen?',
  },

  featuresIndex: {
    meta: {
      title: (brand: string) => `Functies van de AI-telefoonassistent · ${brand}`,
      description: 'Virtuele receptionist, afspraken inplannen, klantenservice, leadkwalificatie, WhatsApp, kennisbank, SIP en rapportage. Bekijk alle functies.',
    },
    hero: {
      title: 'Alle functies van uw AI-telefoonassistent',
      intro: 'Van virtuele receptionist tot rapportage: dertien modules, geactiveerd volgens uw abonnement, vanuit uw klantomgeving.',
    },
    overview: { title: 'Overzicht' },
  },

  feature: {
    meta: {
      title: (name: string, brand: string) => `${FEATURE_SEO[name] ?? `${name} — AI-telefoonassistent`} · ${brand}`,
      /** `short` is de voordeelzin van de module, zonder punt aan het eind. Het abonnement staat op de pagina zelf. */
      description: (short: string, offerName: string, days: number) => `${short}. Probeer het ${days} dagen gratis, zonder verplichtingen.`,
    },
    breadcrumb: 'Functies',
    eyebrow: (family: string, name: string) => `${family} · ${name}`,
    uses: { title: 'Waarvoor dient het' },
    from: {
      title: (offerName: string) => `Inbegrepen vanaf het abonnement ${offerName}`,
      /** `price` al opgemaakt in de valuta van de markt. */
      priceLine: (price: string, minutes: string) => `${price} excl. btw / maand · ${minutes}`,
      offerLink: (offerName: string) => `Bekijk het abonnement ${offerName}`,
      compare: 'Abonnementen vergelijken',
    },
    how: { title: 'Hoe het werkt' },
    cases: { title: 'Toepassingen' },
    integrations: { title: 'Gekoppelde integraties', link: 'Alle integraties' },
    more: { title: 'Ontdek ook' },
  },

  integrations: {
    meta: {
      title: (brand: string) => `Integraties — agenda, CRM, WhatsApp, SIP · ${brand}`,
      description: 'Koppel uw AI-telefoonassistent aan Google Agenda, Outlook, Cal.com, Calendly, HubSpot, Zoho, WhatsApp, SIP en meer dan 300 tools, zonder code.',
    },
    hero: {
      title: 'Uw AI-telefoonassistent, gekoppeld aan de tools die u al gebruikt',
      intro: 'Agenda, CRM, berichtenapps, telefonie: de agent past in uw organisatie en plant afspraken direct in uw agenda in, en de flow builder koppelt meer dan 300 tools zonder code.',
    },
    flow: {
      title: { before: 'Bouw uw automatiseringen ', kw: 'zonder code', after: '' },
      text: 'Een ingevuld formulier, een beëindigd gesprek, een nieuwe lead: elke gebeurtenis kan een reeks acties in uw tools starten, op dezelfde manier als Zapier of Make, rechtstreeks vanuit uw klantomgeving.',
      points: ['Meer dan 300 beschikbare tools', 'Slepen en neerzetten, geen ontwikkelwerk', 'Testen vóór activering'],
      link: 'Bekijk de flow builder',
    },
    api: {
      title: { before: 'Webhooks en API voor ', kw: 'uw systemen', after: '' },
      text: 'In alle abonnementen ontvangt u na elk gesprek de geëxtraheerde gegevens in uw eigen systemen, of stuurt u de agent aan vanuit uw software.',
      points: ['Webhook na elk gesprek', 'Geëxtraheerde variabelen: resultaat, interesse, tijdslot', 'Tools tijdens het gesprek, vanaf het Assistent-abonnement'],
    },
  },
};

// Algemene meldingen (proefbalk, badges, prijsnotitie). De cijfers komen uit de markt.
export const SITE_TEXT = {
  trialLine: (days: number, minutes: number) => `${days} dagen gratis proberen — ${minutes} minuten inbegrepen — prijzen excl. btw — geen verplichtingen of opstartkosten`,
  trialBadges: (days: number, minutes: number) => [`${days} dagen gratis proberen`, `${minutes} minuten inbegrepen`, 'Niets afgeschreven tijdens de proefperiode', 'Geen verplichtingen', 'Geen opstartkosten'],
  growthLines: ['Voeg op elk moment minuten toe', 'Stap over op een groter abonnement wanneer uw volume groeit'],
  priceNote: (numberFrom: string) => `Prijzen in Amerikaanse dollars (USD), exclusief belastingen — lokale belastingen komen erbij indien van toepassing. Een eigen nummer is verkrijgbaar vanaf ${numberFrom} excl. btw per maand, afhankelijk van het land.`,
  skipToContent: 'Naar de inhoud',
  languageLabel: 'Taal',
  payg: (rate: string) => `Nog niet klaar voor een abonnement? Betaal per gebruik: ${rate} excl. btw per minuut, zonder abonnement. U vult credit aan wanneer u wilt (Add credits); het vervalt niet. Een abonnement is goedkoper zodra u regelmatig gebeld wordt.`,
  talkNow: 'Praat nu direct met onze agent',
  talkNowSub: 'Live demo, gratis, zonder aanmelden',
  rechargeFreeAmount: 'U kiest zelf het bedrag: vul het in uw klantomgeving in (Add credits). De bedragen hierboven zijn voorbeelden.',
  consent: { title: 'Meetcookies', text: 'Met uw toestemming gebruiken wij cookies om bezoeken en de resultaten van onze advertenties te meten. Weigeren heeft geen invloed op het gebruik van de site.', accept: 'Accepteren', reject: 'Weigeren', policy: 'Meer informatie', manage: 'Cookies beheren' },
  keepNumber: { title: 'U houdt uw nummer', text: 'Geen andere provider of apparatuur nodig: een eenvoudige doorschakeling, altijd of alleen als u niet opneemt, en de agent neemt het over.' },
  fxNote: (date: string) => `Bedragen in lokale valuta zijn indicatief, tegen de ECB-referentiekoers van ${date}. Abonnementen worden in Amerikaanse dollars gefactureerd: het afgeschreven bedrag hangt af van de wisselkoers van uw bank op de dag van betaling.`,
  whatsapp: { cta: 'Stuur ons een WhatsApp', note: 'Onze AI-agent antwoordt direct, 24/7, in uw taal.', prefill: 'Hallo, ik wil graag meer weten over PermanenceAI.', optIn: 'Stuur mij de bevestiging van het terugbelverzoek ook via WhatsApp', tryTitle: 'Probeer het nu via WhatsApp', tryText: 'Stuur ons een bericht: onze eigen AI-agent antwoordt, precies zoals uw agent uw klanten zal antwoorden. Stel een vraag of vraag om teruggebeld te worden.' },
};

// Algemene meldingen (proefbalk, badges, prijsnotitie). De cijfers komen uit de markt.
export const SITE_TEXT = {
  trialLine: (days: number, minutes: number) => `${days} dagen gratis proberen — ${minutes} minuten inbegrepen — prijzen excl. btw — geen verplichtingen`,
  trialBadges: (days: number, minutes: number) => [`${days} dagen gratis proberen`, `${minutes} minuten inbegrepen`, 'Niets afgeschreven tijdens de proefperiode', 'Geen verplichtingen'],
  growthLines: ['Voeg op elk moment minuten toe', 'Stap over op een groter abonnement wanneer uw volume groeit'],
  priceNote: (numberFrom: string) => `Prijzen in Amerikaanse dollars (USD), exclusief belastingen — lokale belastingen komen erbij indien van toepassing. Een eigen nummer is verkrijgbaar vanaf ${numberFrom} excl. btw per maand, afhankelijk van het land.`,
  skipToContent: 'Naar de inhoud',
  languageLabel: 'Taal',
  payg: (rate: string) => `Nog niet klaar voor een abonnement? Betaal per gebruik: ${rate} excl. btw per minuut, zonder abonnement. U vult credit aan wanneer u wilt (Add credits); het vervalt niet. Een abonnement is goedkoper zodra u regelmatig gebeld wordt.`,
  talkNow: 'Praat nu direct met onze agent',
  talkNowSub: 'Live demo, gratis, zonder aanmelden',
  rechargeFreeAmount: 'U kiest zelf het bedrag: vul het in uw klantomgeving in (Add credits). De bedragen hierboven zijn voorbeelden.',
};

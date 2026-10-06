// Algemene meldingen (proefbalk, badges, prijsnotitie). De cijfers komen uit de markt.
export const SITE_TEXT = {
  trialLine: (days: number, minutes: number) => `${days} dagen gratis proberen — ${minutes} minuten inbegrepen — prijzen excl. btw — geen verplichtingen`,
  trialBadges: (days: number, minutes: number) => [`${days} dagen gratis proberen`, `${minutes} minuten inbegrepen`, 'Prijzen excl. btw', 'Geen verplichtingen'],
  growthLines: ['Voeg op elk moment minuten toe', 'Stap over op een groter abonnement wanneer uw volume groeit'],
  priceNote: 'Prijzen in Amerikaanse dollars (USD), exclusief belastingen — lokale belastingen komen erbij indien van toepassing. Een eigen telefoonnummer is optioneel en wordt per maand gefactureerd.',
  skipToContent: 'Naar de inhoud',
  languageLabel: 'Taal',
  rechargeFreeAmount: 'U kiest zelf het bedrag: vul het in uw klantomgeving in (Add credits). De bedragen hierboven zijn voorbeelden.',
};

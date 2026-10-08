// Teksten van de abonnementen en de functiematrix. Prijzen en minuten komen uit de markt
// (src/i18n/markets.ts): dit bestand bevat alleen woorden.
import type { PlanSlug } from '../../markets';
import type { Cell, MatrixGroup, MatrixRow, OfferText } from '../fr/offers';

export type { Cell, MatrixGroup, MatrixRow, OfferText };

export const OFFER_TEXT: Record<PlanSlug, OfferText> = {
  decouverte: {
    name: 'Gratis proefperiode',
    audience: 'Om de agent op uw eigen bedrijf te testen',
    title: 'Test de agent 14 dagen gratis',
    pitch: 'Leer het platform kennen, stel een eerste agent in, probeer de live demo en gebruik tot 30 belminuten om te zien wat het voor uw bedrijf kan betekenen.',
    cta: 'Gratis starten',
    highlights: ['14 dagen op het abonnement van uw keuze', '30 belminuten inbegrepen', 'Creditcard gevraagd, niets afgeschreven tijdens de proefperiode', 'Kosteloos opzeggen vóór het einde'],
  },
  receptionniste: {
    name: 'Receptionist',
    audience: 'Zzp’ers en kleine bedrijven',
    title: 'Een AI-receptionist die elk gesprek aanneemt, 24 uur per dag',
    pitch: 'Met het Receptionist-abonnement worden uw gesprekken aangenomen, veelgestelde vragen beantwoord, afspraken ingepland en ontvangt u van elke aanvraag een duidelijke samenvatting. Eenvoudig in te stellen, zonder gedoe.',
    cta: 'Kies Receptionist',
    highlights: ['1 AI-spraakagent die 24/7 opneemt', '2 gelijktijdige gesprekken', '1 eigen nummer mogelijk (optie, vanaf $ 3,99 excl. btw/maand) en 1 kennisbank', 'Gekoppelde agenda en webwidget', 'Doorverbinden naar uw team', 'Sms, WhatsApp en Messenger, 200 berichtcredits per maand (≈ 65 schriftelijke antwoorden)'],
  },
  assistant: {
    name: 'Assistent',
    audience: 'Lokale bedrijven met een vast belvolume',
    title: 'Een AI-assistent die uw aanvragen kwalificeert, opvolgt en automatiseert',
    pitch: 'Het Assistent-abonnement voegt drie agents, opvolgcampagnes, no-code automatiseringen gekoppeld aan meer dan 300 tools en een gekloonde stem toe, zodat u meer aanvragen omzet in klanten.',
    cta: 'Kies Assistent',
    highlights: ['Alles van Receptionist, plus:', '3 agents, 5 gelijktijdige gesprekken', 'Tot 3 eigen nummers mogelijk (optie, vanaf $ 3,99 excl. btw/maand), 3 kennisbanken, 3 tools tijdens het gesprek', '3 opvolgcampagnes', 'Flow builder en automatiseringen (5.000 automatiseringsruns / maand)', '1 gekloonde stem', '1.000 berichtcredits per maand (≈ 330 schriftelijke antwoorden)'],
  },
  'centre-appels': {
    name: 'Callcenter',
    audience: 'Teams, meerdere afdelingen en grote volumes',
    title: 'Een volledig AI-callcenter voor ontvangst, afspraken en support',
    pitch: 'Het Callcenter-abonnement heft de limieten op: een onbeperkt aantal agents en campagnes, 20 gelijktijdige gesprekken, eigen dashboards, prioriteitssupport en de laagste prijs per minuut.',
    cta: 'Kies Callcenter',
    highlights: ['Alles van Assistent, plus:', 'Onbeperkt aantal agents, campagnes en kennisbanken', '20 gelijktijdige gesprekken, tot 10 eigen nummers mogelijk (optie, vanaf $ 3,99 excl. btw/maand)', '3 gekloonde stemmen, 50.000 automatiseringsruns / maand', 'Eigen dashboards', 'Prioriteitssupport', '3.000 berichtcredits per maand (≈ 1.000 schriftelijke antwoorden)'],
  },
  'sur-mesure': {
    name: 'Maatwerk',
    audience: 'Vanaf 2.500 minuten per maand',
    title: 'Een configuratie die past bij uw volumes, vestigingen en integraties',
    pitch: 'Voor ketens, organisaties met meerdere vestigingen en vaste volumes boven 2.500 minuten: een prijs per minuut in overleg, regels per vestiging, geavanceerde integraties en begeleide implementatie.',
    cta: 'Spreek een specialist',
    highlights: ['Alles van Callcenter', 'Prijs per minuut in overleg', 'Regels voor meerdere vestigingen', 'SLA en begeleide implementatie'],
  },
};

/** Labels opgebouwd uit de cijfers van de markt. `n` is al opgemaakt (bijv. „1.000”). */
export const OFFER_LABELS = {
  free: '$ 0',
  onQuote: 'Op aanvraag',
  minutesPerMonth: (n: string) => `${n} min / maand`,
  trialMinutes: (n: string, days: number) => `${n} minuten in ${days} dagen`,
  customVolume: 'Volume afgestemd op uw bedrijf',
  perMinute: (price: string) => `${price} excl. btw / min`,
  exclTax: 'excl. btw',
  perMonth: 'excl. btw / maand',
};

// Functiematrix: elke regel komt overeen met een pagina of functie in de klantomgeving.
// Waarden: true = inbegrepen, false = niet inbegrepen, tekst = niveau.
const all = (v: Cell): Record<PlanSlug, Cell> => ({ decouverte: v, receptionniste: v, assistant: v, 'centre-appels': v, 'sur-mesure': v });
const paid = (v: Cell): Record<PlanSlug, Cell> => ({ ...all(v), decouverte: false });

// Limieten overgenomen uit de beheeromgeving van de klantomgeving (abonnementen Receptionist 1646, Assistant 1647, Call Centre 1650
// en proefperiode): elke wijziging van een abonnement in de beheeromgeving moet hier worden doorgevoerd, en omgekeerd.
export const MATRIX: MatrixGroup[] = [
  {
    group: 'Agents en gesprekken',
    rows: [
      { label: 'AI-spraakagents', detail: 'Aantal agents dat u kunt aanmaken, inkomend of uitgaand.', cells: { decouverte: '1', receptionniste: '1', assistant: '3', 'centre-appels': 'Onbeperkt', 'sur-mesure': 'Onbeperkt' } },
      { label: 'Gelijktijdige gesprekken', detail: 'Gesprekken die tegelijk worden afgehandeld: niemand hoeft te wachten, ook niet op piekmomenten.', cells: { decouverte: '1', receptionniste: '2', assistant: '5', 'centre-appels': '20', 'sur-mesure': 'Op maat' } },
      { label: 'Gespreksgeschiedenis', detail: 'Opnames, transcripties en samenvattingen van elk gesprek.', cells: all(true) },
      { label: 'Doorverbinden naar een medewerker', detail: 'De agent verbindt het gesprek door naar uw team wanneer dat nodig is.', cells: all(true) },
      { label: 'Extra talen', detail: 'De agent herkent de taal van de beller en antwoordt in diens taal.', cells: all(true) },
      { label: 'Gekloonde stemmen', detail: 'Een stem die is gemaakt op basis van een opname van uw eigen stem.', cells: { decouverte: false, receptionniste: false, assistant: '1', 'centre-appels': '3', 'sur-mesure': 'Op maat' } },
    ],
  },
  {
    group: 'Instellingen van de agent',
    rows: [
      { label: 'AI-prompteditor', detail: 'Een schrijfassistent stelt het gedrag, de toon en de regels van de agent in.', cells: all(true) },
      { label: 'Kennisbanken', detail: 'Pdf’s, webpagina’s en procedures die de agent tijdens het gesprek raadpleegt.', cells: { decouverte: '1', receptionniste: '1', assistant: '3', 'centre-appels': 'Onbeperkt', 'sur-mesure': 'Onbeperkt' } },
      { label: 'Tools tijdens het gesprek', detail: 'Live uitgevoerde acties: beschikbaarheid controleren, een dossier opzoeken, uw software raadplegen.', cells: { decouverte: '1', receptionniste: false, assistant: '3', 'centre-appels': 'Onbeperkt', 'sur-mesure': 'Onbeperkt' } },
      { label: 'Flow builder', detail: 'Visuele scenario’s zonder code: triggers, voorwaarden en acties.', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Automatiseringsplatform', detail: 'Meer dan 300 koppelbare tools: CRM, Google Sheets, Slack, e-mail…', cells: { decouverte: false, receptionniste: false, assistant: '5.000 runs / maand', 'centre-appels': '50.000 runs / maand', 'sur-mesure': 'Op maat' } },
      { label: 'AI-connector', detail: 'Beheer uw account vanuit ChatGPT of Claude: een agent maken, gesprekken bekijken, acties starten.', cells: all(true) },
    ],
  },
  {
    group: 'Agenda en vastleggen',
    rows: [
      { label: 'Agenda-integratie', detail: 'Google Agenda en Outlook via Cal.com of Calendly: de agent boekt rechtstreeks in uw agenda.', cells: all(true) },
      { label: 'Webwidget', detail: 'Bel- en terugbelknop voor op uw website.', cells: all(true) },
      { label: 'Leads', detail: 'Leadprofielen die op basis van gesprekken worden aangemaakt.', cells: all(true) },
    ],
  },
  {
    group: 'Berichten en campagnes',
    rows: [
      { label: 'Uitgaande campagnes', detail: 'Opvolging, bevestigingen en herinneringen die automatisch worden gebeld.', cells: { decouverte: false, receptionniste: false, assistant: '3', 'centre-appels': 'Onbeperkt', 'sur-mesure': 'Onbeperkt' } },
      { label: 'Sms en WhatsApp', detail: 'Schriftelijk contact op één plek, betaald met berichtcredits.', cells: all(true) },
      { label: 'Messenger en Instagram', detail: 'Berichten van sociale netwerken in dezelfde inbox.', cells: all(true) },
      { label: 'Inbegrepen berichtcredits', detail: 'Credits die elke maand worden toegekend voor schriftelijk contact (websitechat, WhatsApp, Messenger, Instagram, sms). Een schriftelijk AI-antwoord kost 3 credits. Meer nodig? Koop ze in uw klantomgeving (Add credits): 100 credits voor $ 1, vanaf 100 credits. U kunt ook minuten omzetten: 1 minuut = 9 credits.', cells: { decouverte: false, receptionniste: '200 / maand (≈ 65 antwoorden)', assistant: '1.000 / maand (≈ 330 antwoorden)', 'centre-appels': '3.000 / maand (≈ 1.000 antwoorden)', 'sur-mesure': 'Op aanvraag' } },
    ],
  },
  {
    group: 'Telefonie',
    rows: [
      { label: 'Eigen telefoonnummers (optie)', detail: 'Maximaal aantal eigen nummers. Niet inbegrepen in het abonnement: als optie te koop in uw klantomgeving, vanaf $ 3,99 excl. btw per maand afhankelijk van het land.', cells: { decouverte: '1', receptionniste: '1', assistant: '3', 'centre-appels': '10', 'sur-mesure': 'Op maat' } },
      { label: 'SIP-koppeling', detail: 'Behoud uw nummers en telefooncentrale: SIP-koppeling, import via Twilio of Telnyx.', cells: all(true) },
      { label: 'Uw eigen mobiele nummer als nummerweergave', detail: 'Verifieer uw nummer zodat het bij uitgaande gesprekken wordt weergegeven.', cells: paid(true) },
      { label: 'Uitsluitingslijst', detail: 'Nummers die de agent nooit belt.', cells: all(true) },
    ],
  },
  {
    group: 'Sturing en integraties',
    rows: [
      { label: 'Gespreksstatistieken', detail: 'Volumes, duur en resultaten op uw dashboard.', cells: all(true) },
      { label: 'Eigen dashboards', detail: 'Uw eigen indicatoren, samengesteld uit de gegevens van uw gesprekken.', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'API en webhooks', detail: 'Ontvang elk afgerond gesprek in uw systemen, of stuur de agent aan vanuit uw software.', cells: all(true) },
      { label: 'Regels voor meerdere vestigingen en SLA', detail: 'Meerdere vestigingen, serviceafspraken.', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': false, 'sur-mesure': true } },
      { label: 'Support', detail: 'Begeleiding door ons team.', cells: { decouverte: 'Helpcentrum', receptionniste: 'Standaard', assistant: 'Standaard', 'centre-appels': 'Prioriteit', 'sur-mesure': 'Persoonlijk' } },
    ],
  },
];

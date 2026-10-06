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
    highlights: ['14 dagen op het abonnement van uw keuze', '30 belminuten inbegrepen', 'Kaart gevraagd, niets afgeschreven tijdens de proefperiode', 'Kosteloos opzeggen vóór het einde'],
  },
  receptionniste: {
    name: 'Receptionist',
    audience: 'Zzp’ers en kleine bedrijven',
    title: 'Een AI-receptionist die elk gesprek aanneemt, 24 uur per dag',
    pitch: 'Met het Receptionist-abonnement worden uw gesprekken aangenomen, veelgestelde vragen beantwoord, afspraken ingepland en ontvangt u van elke aanvraag een duidelijke samenvatting. Eenvoudig in te stellen, zonder gedoe.',
    cta: 'Kies Receptionist',
    highlights: ['AI-receptionist 24/7', 'Gekoppelde agenda', 'Webwidget voor terugbellen', 'Doorverbinden naar een medewerker'],
  },
  assistant: {
    name: 'Assistent',
    audience: 'Lokale bedrijven met een vast belvolume',
    title: 'Een AI-assistent die uw aanvragen kwalificeert, opvolgt en automatiseert',
    pitch: 'Het Assistent-abonnement voegt leadkwalificatie, opvolgcampagnes, sms- en WhatsApp-berichten, de flow builder en uw eigen nummers via SIP toe, zodat u meer aanvragen omzet in klanten.',
    cta: 'Kies Assistent',
    highlights: ['Alles van Receptionist', 'Flow builder en automatiseringen', 'Campagnes en leads', 'Sms, WhatsApp en Instagram', 'Uw eigen nummers via SIP'],
  },
  'centre-appels': {
    name: 'Callcenter',
    audience: 'Teams, meerdere afdelingen en grote volumes',
    title: 'Een volledig AI-callcenter voor ontvangst, afspraken en support',
    pitch: 'Het Callcenter-abonnement combineert meerdere agents, uitgebreide rapporten, rollen, de geavanceerde kennisbank, API’s en prioriteitssupport, met de laagste prijs per minuut.',
    cta: 'Kies Callcenter',
    highlights: ['Alles van Assistent', 'Meerdere agents en rollen', 'Uitgebreide rapporten', 'API, webhooks en MCP-tools', 'Prioriteitssupport', '3.000 berichtcredits inbegrepen ($ 30)'],
  },
  'sur-mesure': {
    name: 'Maatwerk',
    audience: 'Vanaf 2.500 minuten per maand',
    title: 'Een configuratie die past bij uw volumes, vestigingen en integraties',
    pitch: 'Voor ketens, organisaties met meerdere vestigingen en vaste volumes boven 2.500 minuten: een onderhandelde prijs per minuut, regels per vestiging, geavanceerde integraties en begeleide implementatie.',
    cta: 'Spreek een specialist',
    highlights: ['Alles van Callcenter', 'Onderhandelde prijs per minuut', 'Regels voor meerdere vestigingen', 'SLA en begeleide implementatie'],
  },
};

/** Labels opgebouwd uit de cijfers van de markt. `n` is al opgemaakt (bijv. „1.000”). */
export const OFFER_LABELS = {
  free: '$ 0',
  onQuote: 'Op offerte',
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

export const MATRIX: MatrixGroup[] = [
  {
    group: 'Agents en gesprekken',
    rows: [
      { label: 'AI-spraakassistenten', detail: 'Inkomende en uitgaande agents', cells: { decouverte: '1 testagent', receptionniste: '1', assistant: '3', 'centre-appels': 'Meerdere agents', 'sur-mesure': 'Maatwerk' } },
      { label: 'Gespreksgeschiedenis', detail: 'Opnames, transcripties, samenvattingen', cells: { ...all(true), decouverte: 'Beperkt' } },
      { label: 'Conversaties', detail: 'Geschreven en gesproken contact op één plek', cells: all(true) },
      { label: 'Doorverbinden naar een medewerker', detail: 'Overdracht naar uw team', cells: all(true) },
      { label: 'Meertalige stemmen', detail: 'Herkenning van extra talen', cells: all(true) },
    ],
  },
  {
    group: 'Instellingen van de agent',
    rows: [
      { label: 'AI-prompteditor', detail: 'Gedrag, toon, regels', cells: { decouverte: 'Kennismaking', receptionniste: 'Vereenvoudigd', assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Kennisbank', detail: 'Pdf’s, webpagina’s, procedures', cells: { decouverte: 'Basis', receptionniste: 'Basis', assistant: true, 'centre-appels': 'Geavanceerd', 'sur-mesure': 'Geavanceerd' } },
      { label: 'Flow builder', detail: 'Visuele scenario’s zonder code', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': 'Geavanceerd', 'sur-mesure': 'Geavanceerd' } },
      { label: 'Automatiseringen', detail: 'Meer dan 300 koppelbare tools', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
    ],
  },
  {
    group: 'Agenda en leadcaptatie',
    rows: [
      { label: 'Agendakoppeling', detail: 'Google, Outlook, Cal.com, Calendly', cells: all(true) },
      { label: 'Webwidget', detail: 'Terugbellen en bellen vanaf uw website', cells: all(true) },
      { label: 'Nummerherkenning', detail: 'Caller ID-knop', cells: { ...all(true), decouverte: false } },
      { label: 'Leads en voorkwalificatie', detail: 'Gestructureerde prospectkaarten', cells: { decouverte: false, receptionniste: 'Basis', assistant: true, 'centre-appels': true, 'sur-mesure': true } },
    ],
  },
  {
    group: 'Berichten en campagnes',
    rows: [
      { label: 'Uitgaande campagnes', detail: 'Opvolging, bevestigingen, herinneringen', cells: { decouverte: false, receptionniste: false, assistant: 'Begrensd', 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Sms-geschiedenis', detail: 'Verzonden berichten en antwoorden', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'WhatsApp', detail: 'Afzenders en templates', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Messenger en Instagram', detail: 'Berichtenkanalen', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
    ],
  },
  {
    group: 'Telefonie',
    rows: [
      { label: 'Eigen nummer', detail: 'Optie, per maand gefactureerd, afhankelijk van het land', cells: { decouverte: false, receptionniste: 'Optioneel', assistant: 'Optioneel', 'centre-appels': 'Optioneel', 'sur-mesure': 'Optioneel' } },
      { label: 'SIP-koppeling', detail: 'Uw nummers en uw telefooncentrale', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Blokkeerlijst', detail: 'Nummers die niet gebeld worden', cells: { ...all(true), decouverte: false } },
    ],
  },
  {
    group: 'Sturing en team',
    rows: [
      { label: 'Uitgebreide rapporten', detail: 'Volumes, gespreksduur, conversies', cells: { decouverte: false, receptionniste: 'Dashboard', assistant: 'Dashboard', 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Rollen en rechten', detail: 'Toegang per teamlid', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'API, webhooks en MCP-tools', detail: 'Koppeling met uw systemen', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Regels voor meerdere vestigingen en SLA', detail: 'Meerdere vestigingen', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': false, 'sur-mesure': true } },
      { label: 'Support', detail: 'Begeleiding', cells: { decouverte: 'Hulpbronnen', receptionniste: 'Standaard', assistant: 'Standaard', 'centre-appels': 'Prioriteit', 'sur-mesure': 'Persoonlijk' } },
    ],
  },
];

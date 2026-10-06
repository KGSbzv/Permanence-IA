// Testi delle offerte e della matrice delle funzioni. Prezzi e minuti arrivano dal mercato
// (src/i18n/markets.ts): questo file contiene solo parole.
import type { PlanSlug } from '../../markets';
import type { Cell, MatrixGroup, OFFER_LABELS as FR_OFFER_LABELS, OfferText } from '../fr/offers';

export type { Cell, MatrixGroup, MatrixRow, OfferText } from '../fr/offers';

export const OFFER_TEXT: Record<PlanSlug, OfferText> = {
  decouverte: {
    name: 'Prova gratuita',
    audience: 'Per provare l’agente sulla Sua attività',
    title: 'Provi l’agente gratuitamente per 14 giorni',
    pitch: 'Scopra la piattaforma, configuri un primo agente, provi la demo dal vivo e utilizzi fino a 30 minuti di chiamate per verificarne il potenziale sulla Sua attività.',
    cta: 'Inizi gratis',
    highlights: ['14 giorni sul piano che preferisce', '30 minuti di chiamate inclusi', 'Carta richiesta, nessun addebito durante la prova', 'Annulli prima della fine senza costi'],
  },
  receptionniste: {
    name: 'Receptionist',
    audience: 'Liberi professionisti e piccole realtà',
    title: 'Una receptionist AI che risponde a ogni chiamata, 24 ore su 24',
    pitch: 'Il piano Receptionist gestisce le Sue chiamate, risponde alle domande frequenti, fissa gli appuntamenti e Le invia un riepilogo chiaro di ogni richiesta. Semplice da attivare, senza complicazioni.',
    cta: 'Scelga Receptionist',
    highlights: ['Receptionist AI 24/7', 'Calendario collegato', 'Widget web di richiamata', 'Trasferimento a un operatore'],
  },
  assistant: {
    name: 'Assistant',
    audience: 'Attività locali con volume regolare',
    title: 'Un assistente AI che qualifica, ricontatta e automatizza le Sue richieste',
    pitch: 'Il piano Assistant aggiunge la qualificazione dei lead, le campagne di ricontatto, i messaggi SMS e WhatsApp, il flow builder e i Suoi numeri tramite SIP, per convertire più richieste.',
    cta: 'Scelga Assistant',
    highlights: ['Tutto Receptionist', 'Flow builder e automazioni', 'Campagne e lead', 'SMS, WhatsApp e Instagram', 'I Suoi numeri tramite SIP'],
  },
  'centre-appels': {
    name: 'Call Center',
    audience: 'Team, più reparti e grandi volumi',
    title: 'Un call center AI completo per organizzare accoglienza, appuntamenti e assistenza',
    pitch: 'Il piano Call Center riunisce più agenti, report dettagliati, ruoli, base di conoscenza avanzata, API e assistenza prioritaria, con il miglior prezzo al minuto.',
    cta: 'Scelga Call Center',
    highlights: ['Tutto Assistant', 'Multi-agente e ruoli', 'Report dettagliati', 'API, webhook e strumenti MCP', 'Assistenza prioritaria', '3.000 crediti messaggi inclusi (30 $)'],
  },
  'sur-mesure': {
    name: 'Su misura',
    audience: 'Oltre 2.500 minuti regolari',
    title: 'Una configurazione adatta ai Suoi volumi, alle Sue sedi e alle Sue integrazioni',
    pitch: 'Per reti, organizzazioni con più sedi e volumi regolari oltre i 2.500 minuti: prezzo al minuto negoziato, regole per sede, integrazioni avanzate e implementazione assistita.',
    cta: 'Parli con un esperto',
    highlights: ['Tutto Call Center', 'Prezzo al minuto negoziato', 'Regole multi-sede', 'SLA e implementazione guidata'],
  },
};

/** Etichette costruite a partire dalle cifre del mercato. `n` è già formattato (es. «1.000»). */
export const OFFER_LABELS: typeof FR_OFFER_LABELS = {
  free: '0 $',
  onQuote: 'Su preventivo',
  minutesPerMonth: (n: string) => `${n} min / mese`,
  trialMinutes: (n: string, days: number) => `${n} minuti in ${days} giorni`,
  customVolume: 'Volume adatto alla Sua attività',
  perMinute: (price: string) => `${price} IVA esclusa / min`,
  exclTax: 'IVA esclusa',
  perMonth: 'IVA esclusa / mese',
};

// Matrice delle funzioni: ogni riga corrisponde a una pagina o a una funzione dell’area clienti.
// Valori: true = incluso, false = non incluso, testo = livello.
const all = (v: Cell): Record<PlanSlug, Cell> => ({ decouverte: v, receptionniste: v, assistant: v, 'centre-appels': v, 'sur-mesure': v });

export const MATRIX: MatrixGroup[] = [
  {
    group: 'Agenti e chiamate',
    rows: [
      { label: 'Assistenti vocali AI', detail: 'Agenti in entrata e in uscita', cells: { decouverte: '1 di prova', receptionniste: '1', assistant: '3', 'centre-appels': 'Multi-agente', 'sur-mesure': 'Su misura' } },
      { label: 'Cronologia chiamate', detail: 'Registrazioni, trascrizioni, riepiloghi', cells: { ...all(true), decouverte: 'Limitata' } },
      { label: 'Conversazioni', detail: 'Scambi scritti e vocali centralizzati', cells: all(true) },
      { label: 'Trasferimento a un operatore', detail: 'Passaggio al Suo team', cells: all(true) },
      { label: 'Voci multilingue', detail: 'Lingue secondarie rilevate', cells: all(true) },
    ],
  },
  {
    group: 'Configurazione dell’agente',
    rows: [
      { label: 'Editor di prompt AI', detail: 'Comportamento, tono, regole', cells: { decouverte: 'Anteprima', receptionniste: 'Semplificato', assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Base di conoscenza', detail: 'PDF, pagine web, procedure', cells: { decouverte: 'Base', receptionniste: 'Base', assistant: true, 'centre-appels': 'Avanzata', 'sur-mesure': 'Avanzata' } },
      { label: 'Flow builder', detail: 'Scenari visivi senza codice', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': 'Avanzato', 'sur-mesure': 'Avanzato' } },
      { label: 'Automazioni', detail: 'Oltre 300 strumenti collegabili', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
    ],
  },
  {
    group: 'Calendario e acquisizione',
    rows: [
      { label: 'Integrazione calendario', detail: 'Google, Outlook, Cal.com, Calendly', cells: all(true) },
      { label: 'Widget web', detail: 'Richiamata e chiamata dal Suo sito', cells: all(true) },
      { label: 'Identificazione del chiamante', detail: 'Pulsante caller ID', cells: { ...all(true), decouverte: false } },
      { label: 'Lead e prequalificazione', detail: 'Schede contatto strutturate', cells: { decouverte: false, receptionniste: 'Base', assistant: true, 'centre-appels': true, 'sur-mesure': true } },
    ],
  },
  {
    group: 'Messaggi e campagne',
    rows: [
      { label: 'Campagne in uscita', detail: 'Ricontatti, conferme, promemoria', cells: { decouverte: false, receptionniste: false, assistant: 'Con limiti', 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Cronologia SMS', detail: 'Invii e risposte', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'WhatsApp', detail: 'Mittenti e template', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Messenger e Instagram', detail: 'Canali di messaggistica', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
    ],
  },
  {
    group: 'Telefonia',
    rows: [
      { label: 'Numero dedicato', detail: 'Opzione fatturata mensilmente, in base al paese', cells: { decouverte: false, receptionniste: 'Opzionale', assistant: 'Opzionale', 'centre-appels': 'Opzionale', 'sur-mesure': 'Opzionale' } },
      { label: 'Integrazione SIP', detail: 'I Suoi numeri e il Suo centralino', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Lista di blocco', detail: 'Numeri esclusi dalle chiamate', cells: { ...all(true), decouverte: false } },
    ],
  },
  {
    group: 'Gestione e team',
    rows: [
      { label: 'Report dettagliati', detail: 'Volumi, durate, conversioni', cells: { decouverte: false, receptionniste: 'Dashboard', assistant: 'Dashboard', 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Ruoli e permessi', detail: 'Accesso per membro del team', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'API, webhook e strumenti MCP', detail: 'Collegamento ai Suoi sistemi', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Regole multi-sede e SLA', detail: 'Più sedi', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': false, 'sur-mesure': true } },
      { label: 'Assistenza', detail: 'Supporto', cells: { decouverte: 'Risorse', receptionniste: 'Standard', assistant: 'Standard', 'centre-appels': 'Prioritaria', 'sur-mesure': 'Dedicata' } },
    ],
  },
];

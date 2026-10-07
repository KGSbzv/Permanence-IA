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
    pitch: 'Scopra la piattaforma, configuri un primo agente, provi la demo dal vivo e utilizzi fino a 30 minuti di chiamate per verificarne il potenziale per la Sua attività.',
    cta: 'Inizi gratis',
    highlights: ['14 giorni sul piano che preferisce', '30 minuti di chiamate inclusi', 'Carta richiesta, nessun addebito durante la prova', 'Disdica prima della fine senza costi'],
  },
  receptionniste: {
    name: 'Receptionist',
    audience: 'Liberi professionisti e piccole realtà',
    title: 'Una receptionist AI che risponde a ogni chiamata, 24 ore su 24',
    pitch: 'Il piano Receptionist gestisce le Sue chiamate, risponde alle domande frequenti, fissa gli appuntamenti e Le invia un riepilogo chiaro di ogni richiesta. Semplice da attivare, senza complicazioni.',
    cta: 'Scelga Receptionist',
    highlights: ['1 agente vocale AI che risponde 24/7', '2 chiamate simultanee', '1 numero dedicato possibile (opzione da 3,99 $ al mese, IVA esclusa) e 1 base di conoscenza', 'Calendario collegato e widget web', 'Trasferimento di chiamata al Suo team', 'SMS, WhatsApp e Messenger, 200 crediti messaggi al mese (≈ 65 risposte scritte)'],
  },
  assistant: {
    name: 'Assistant',
    audience: 'Attività locali con volume regolare',
    title: 'Un assistente AI che qualifica, ricontatta e automatizza le Sue richieste',
    pitch: 'Il piano Assistant porta a tre gli agenti e aggiunge le campagne di ricontatto, gli scenari automatizzati collegati a oltre 300 strumenti e una voce clonata, per convertire più richieste.',
    cta: 'Scelga Assistant',
    highlights: ['Tutto Receptionist, e in più:', '3 agenti, 5 chiamate simultanee', '3 numeri dedicati possibili (opzione da 3,99 $ al mese, IVA esclusa), 3 basi di conoscenza, 3 strumenti in chiamata', '3 campagne di ricontatto', 'Scenari automatizzati e automazioni (5.000 esecuzioni / mese)', '1 voce clonata', '1.000 crediti messaggi al mese (≈ 330 risposte scritte)'],
  },
  'centre-appels': {
    name: 'Call Center',
    audience: 'Team, più reparti e grandi volumi',
    title: 'Un call center AI completo per organizzare accoglienza, appuntamenti e assistenza',
    pitch: 'Il piano Call Center alza i limiti: agenti e campagne illimitati, 20 chiamate simultanee, dashboard personalizzate, assistenza prioritaria e il miglior prezzo al minuto.',
    cta: 'Scelga Call Center',
    highlights: ['Tutto Assistant, e in più:', 'Agenti, campagne e basi di conoscenza illimitati', '20 chiamate simultanee, 10 numeri dedicati possibili (opzione da 3,99 $ al mese, IVA esclusa)', '3 voci clonate, 50.000 automazioni / mese', 'Dashboard personalizzate', 'Assistenza prioritaria', '3.000 crediti messaggi al mese (≈ 1.000 risposte scritte)'],
  },
  'sur-mesure': {
    name: 'Su misura',
    audience: 'Oltre 2.500 minuti al mese',
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
const paid = (v: Cell): Record<PlanSlug, Cell> => ({ ...all(v), decouverte: false });

// Limiti rilevati nell’admin dell’area clienti (piani Receptionist 1646, Assistant 1647, Call Centre 1650
// e prova): ogni modifica di un piano nell’admin va riportata qui, e viceversa.
export const MATRIX: MatrixGroup[] = [
  {
    group: 'Agenti e chiamate',
    rows: [
      { label: 'Agenti vocali AI', detail: 'Numero di agenti che può creare, in entrata o in uscita.', cells: { decouverte: '1', receptionniste: '1', assistant: '3', 'centre-appels': 'Illimitati', 'sur-mesure': 'Illimitati' } },
      { label: 'Chiamate simultanee', detail: 'Chiamate gestite contemporaneamente: nessuno resta in attesa, anche nelle ore di punta.', cells: { decouverte: '1', receptionniste: '2', assistant: '5', 'centre-appels': '20', 'sur-mesure': 'Su misura' } },
      { label: 'Cronologia chiamate', detail: 'Registrazioni, trascrizioni e riepiloghi di ogni chiamata.', cells: all(true) },
      { label: 'Trasferimento a un operatore', detail: 'L’agente passa la chiamata al Suo team quando serve.', cells: all(true) },
      { label: 'Lingue aggiuntive', detail: 'L’agente rileva la lingua di chi chiama e risponde nella sua lingua.', cells: all(true) },
      { label: 'Voci clonate', detail: 'Una voce creata a partire da una registrazione della Sua.', cells: { decouverte: false, receptionniste: false, assistant: '1', 'centre-appels': '3', 'sur-mesure': 'Su misura' } },
    ],
  },
  {
    group: 'Configurazione dell’agente',
    rows: [
      { label: 'Editor di prompt AI', detail: 'Un assistente di scrittura regola il comportamento, il tono e le regole dell’agente.', cells: all(true) },
      { label: 'Basi di conoscenza', detail: 'PDF, pagine web e procedure che l’agente consulta durante la chiamata.', cells: { decouverte: '1', receptionniste: '1', assistant: '3', 'centre-appels': 'Illimitate', 'sur-mesure': 'Illimitate' } },
      { label: 'Strumenti durante la chiamata', detail: 'Azioni eseguite in tempo reale: verificare una disponibilità, consultare una pratica, interrogare il Suo software.', cells: { decouverte: '1', receptionniste: false, assistant: '3', 'centre-appels': 'Illimitati', 'sur-mesure': 'Illimitati' } },
      { label: 'Scenari automatizzati', detail: 'Scenari visivi senza codice: trigger, condizioni e azioni.', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Piattaforma di automazione', detail: 'Oltre 300 strumenti collegabili: CRM, Google Sheets, Slack, email…', cells: { decouverte: false, receptionniste: false, assistant: '5.000 esecuzioni / mese', 'centre-appels': '50.000 esecuzioni / mese', 'sur-mesure': 'Su misura' } },
      { label: 'Connettore AI', detail: 'Gestisca il Suo account da ChatGPT o Claude: creare un agente, leggere le chiamate, avviare azioni.', cells: all(true) },
    ],
  },
  {
    group: 'Calendario e acquisizione',
    rows: [
      { label: 'Integrazione calendario', detail: 'Google Calendar, Outlook… tramite Cal.com o Calendly: l’agente prenota nel Suo calendario.', cells: all(true) },
      { label: 'Widget web', detail: 'Pulsante di chiamata e richiamata da inserire nel Suo sito.', cells: all(true) },
      { label: 'Lead', detail: 'Schede contatto create a partire dalle chiamate.', cells: all(true) },
    ],
  },
  {
    group: 'Messaggi e campagne',
    rows: [
      { label: 'Campagne in uscita', detail: 'Ricontatti, conferme e promemoria con chiamate automatiche.', cells: { decouverte: false, receptionniste: false, assistant: '3', 'centre-appels': 'Illimitate', 'sur-mesure': 'Illimitate' } },
      { label: 'SMS e WhatsApp', detail: 'Scambi scritti centralizzati, pagati con i crediti messaggi.', cells: all(true) },
      { label: 'Messenger e Instagram', detail: 'I messaggi dei social network nella stessa casella.', cells: all(true) },
      { label: 'Crediti messaggi inclusi', detail: 'Crediti assegnati ogni mese per gli scambi scritti (chat del sito, WhatsApp, Messenger, Instagram, SMS). Una risposta scritta dell’AI costa 3 crediti. Per averne di più, converta minuti dalla Sua area clienti: 1 minuto = 9 crediti.', cells: { decouverte: false, receptionniste: '200 / mese (≈ 65 risposte)', assistant: '1.000 / mese (≈ 330 risposte)', 'centre-appels': '3.000 / mese (≈ 1.000 risposte)', 'sur-mesure': 'Su preventivo' } },
    ],
  },
  {
    group: 'Telefonia',
    rows: [
      { label: 'Numeri di telefono', detail: 'Numeri dedicati possibili, in opzione da 3,99 $ al mese, IVA esclusa (non inclusi nel piano): acquistati dalla Sua area clienti, fatturati mensilmente in base al paese.', cells: { decouverte: '1', receptionniste: '1', assistant: '3', 'centre-appels': '10', 'sur-mesure': 'Su misura' } },
      { label: 'Connessione SIP', detail: 'Mantenga i Suoi numeri e il Suo centralino: connessione SIP, importazione da Twilio o Telnyx.', cells: all(true) },
      { label: 'Il Suo cellulare come numero visualizzato', detail: 'Verifichi il Suo numero perché venga mostrato nelle chiamate in uscita.', cells: paid(true) },
      { label: 'Lista di esclusione', detail: 'Numeri che l’agente non chiama mai.', cells: all(true) },
    ],
  },
  {
    group: 'Gestione e integrazioni',
    rows: [
      { label: 'Statistiche delle chiamate', detail: 'Volumi, durate e risultati nella Sua dashboard.', cells: all(true) },
      { label: 'Dashboard personalizzate', detail: 'I Suoi indicatori, costruiti a partire dai dati delle Sue chiamate.', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'API e webhook', detail: 'Riceva nei Suoi sistemi i dati di ogni chiamata conclusa, o gestisca l’agente dal Suo software.', cells: all(true) },
      { label: 'Regole multi-sede e SLA', detail: 'Più sedi, impegni sul livello di servizio.', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': false, 'sur-mesure': true } },
      { label: 'Assistenza', detail: 'Supporto dal nostro team.', cells: { decouverte: 'Risorse', receptionniste: 'Standard', assistant: 'Standard', 'centre-appels': 'Prioritaria', 'sur-mesure': 'Dedicata' } },
    ],
  },
];

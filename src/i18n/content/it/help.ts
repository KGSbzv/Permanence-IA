// Guida all’area clienti (interfaccia in inglese): glossario dei menu e operazioni passo passo.
// Serve anche come base di conoscenza per l’assistente di supporto integrata nell’area clienti.
import type { HelpTask, MenuEntry } from '../fr/help';

export type { HelpTask, MenuEntry } from '../fr/help';

export const HELP_MENU: MenuEntry[] = [
  { en: 'Dashboard', label: 'Dashboard', text: 'Panoramica: chiamate del mese, minuti utilizzati, risultati.' },
  { en: 'Assistants', label: 'Agenti vocali', text: 'Creare, modificare e provare i Suoi agenti (accoglienza, richiamata, assistenza).' },
  { en: 'Calls history', label: 'Cronologia chiamate', text: 'Ogni chiamata con registrazione, trascrizione, riepilogo e dati estratti.' },
  { en: 'Knowledge base', label: 'Base di conoscenza', text: 'Documenti e pagine web che l’agente consulta durante la chiamata.' },
  { en: 'Mid call tools / MCP', label: 'Strumenti durante la chiamata', text: 'Azioni che l’agente avvia in tempo reale: inviare una richiesta al Suo CRM, verificare un’informazione…' },
  { en: 'Blacklist', label: 'Lista di esclusione', text: 'Numeri che non devono mai essere chiamati.' },
  { en: 'Campaigns', label: 'Campagne', text: 'Chiamate in uscita verso un elenco di contatti (promemoria, ricontatti, fissare appuntamenti).' },
  { en: 'Leads', label: 'Contatti / potenziali clienti', text: 'I contatti importati o creati, con il relativo stato.' },
  { en: 'Inbox', label: 'Messaggi', text: 'Conversazioni scritte centralizzate: widget web, WhatsApp, SMS, Messenger, Instagram.' },
  { en: 'Channels → WhatsApp / Messenger & Instagram', label: 'Canali', text: 'Collegare i Suoi account di messaggistica.' },
  { en: 'Get new phone number', label: 'Ottenere un numero', text: 'Acquistare un numero dedicato (opzione a pagamento mensile, prezzo mostrato prima dell’acquisto).' },
  { en: 'Your phone numbers', label: 'I Suoi numeri', text: 'I Suoi numeri, l’importazione da Twilio / Telnyx e la connessione SIP.' },
  { en: 'Automate platform', label: 'Automazioni', text: 'Scenari automatizzati senza codice, collegati a oltre 300 strumenti (piano Assistant e superiori).' },
  { en: 'Change plan', label: 'Cambiare piano', text: 'Passare al piano superiore o inferiore.' },
  { en: 'Add credits', label: 'Aggiungere credito', text: 'Acquistare credito (minuti oltre il piano, messaggi); il credito non scade.' },
  { en: 'Billing info', label: 'Fatturazione', text: 'Metodo di pagamento, fatture, abbonamento e disdetta.' },
  { en: 'Limits', label: 'Limiti', text: 'Cosa consente il Suo piano: agenti, chiamate simultanee, funzioni.' },
  { en: 'API Keys', label: 'Chiavi API', text: 'Collegare i Suoi software (tutti i piani).' },
  { en: 'My profile / Security', label: 'Profilo / Sicurezza', text: 'I Suoi dati, la password e l’autenticazione a due fattori.' },
];

export const HELP_TASKS: HelpTask[] = [
  {
    title: 'Creare il Suo primo agente vocale',
    steps: [
      'Menu Assistants, poi Create (crea).',
      'General: scelga Receive phone calls (ricevere chiamate) o Make phone calls (effettuare chiamate), indichi un nome e il fuso orario.',
      'Voice & speech (voce): lingua Italian, poi scelga una voce e la ascolti.',
      'Brain & prompt (cervello e istruzioni): descriva la Sua attività, cosa l’agente deve fare e cosa non deve fare. L’assistente di scrittura (AI Prompt Editor) può scriverle al posto Suo.',
      'Greeting (messaggio di benvenuto): la prima frase pronunciata.',
      'Clicchi su Create assistant, poi su Test assistant per provarlo in chat, o su Speak with your assistant per parlargli dal browser.',
    ],
  },
  {
    title: 'Aggiungere le Sue informazioni (base di conoscenza)',
    steps: [
      'Menu Knowledge base, poi crei una base.',
      'Aggiunga un documento: PDF, file di testo o indirizzo di una pagina del Suo sito.',
      'Nel Suo agente, sezione Knowledgebase, selezioni questa base.',
    ],
  },
  {
    title: 'Ricevere le chiamate sul Suo numero',
    steps: [
      'La soluzione più semplice: acquisti un numero in Get new phone number, poi lo selezioni nell’agente (General → Phone number).',
      'Per mantenere il Suo numero attuale: attivi presso il Suo operatore una deviazione di chiamata verso questo nuovo numero.',
      'Se ha già Twilio, Telnyx o un centralino SIP: Your phone numbers, poi importazione o SIP (tutti i piani).',
    ],
  },
  {
    title: 'Far fissare appuntamenti all’agente',
    steps: [
      'Nell’agente, sezione Tools & actions (strumenti e azioni).',
      'Aggiunga l’integrazione calendario (Cal.com o Calendly, a loro volta collegati al Suo calendario Google o Outlook) e colleghi il Suo account.',
      'Specifichi nelle istruzioni quando proporre un appuntamento.',
    ],
  },
  {
    title: 'Trasferire una chiamata a Lei',
    steps: [
      'Nell’agente, sezione Tools & actions, aggiunga Call transfer (trasferimento di chiamata).',
      'Indichi il Suo numero e in quali casi trasferire (urgenza, richiesta di parlare con una persona…).',
    ],
  },
  {
    title: 'Inserire l’agente nel Suo sito (widget)',
    steps: [
      'Nell’agente, sezione Web widget: attivi il widget, scelga voce e/o chat, colori e testi.',
      'Copi il codice fornito e lo incolli prima del tag </body> del Suo sito (oppure lo chieda al Suo webmaster).',
    ],
  },
  {
    title: 'Avviare una campagna di chiamate in uscita',
    steps: [
      'Crei un agente in modalità Make phone calls.',
      'Menu Leads: importi i Suoi contatti (file CSV o Excel) e li verifichi nel Registro pubblico delle opposizioni; chiami solo persone che hanno dato il loro consenso.',
      'Menu Campaigns: crei la campagna, scelga l’agente, i contatti, gli orari di chiamata, poi la avvii.',
    ],
  },
  {
    title: 'Ricevere i risultati delle chiamate nei Suoi strumenti',
    steps: [
      'Nell’agente, sezione Webhooks & channels: indichi l’indirizzo che deve ricevere i dati di ogni chiamata conclusa.',
      'Oppure usi Automate platform per inviare i riepiloghi a Google Sheets, al Suo CRM, a Slack, via email… (piano Assistant e superiori).',
    ],
  },
  {
    title: 'Aggiungere minuti o cambiare piano',
    steps: [
      'Occasionalmente: Add credits (aggiungi credito) e inserisca l’importo della ricarica, a partire da 5 $. Il credito non scade.',
      'Se supera spesso i minuti: Change plan, il piano superiore costa meno al minuto.',
    ],
  },
  {
    title: 'Gestire la prova, la fatturazione e le fatture',
    steps: [
      'La prova inizia quando sceglie il Suo primo piano in Change plan: 14 giorni gratuiti, 30 minuti inclusi, nessun addebito durante la prova.',
      'Billing info: metodo di pagamento, fatture scaricabili e gestione dell’abbonamento.',
      'Per non pagare nulla, disdica da Billing info prima della fine dei 14 giorni.',
    ],
  },
];

export const HELP_GLOSSARY: MenuEntry[] = [
  { en: 'Inbound / Outbound', label: 'In entrata / in uscita', text: 'Chiamate ricevute / chiamate effettuate dall’agente.' },
  { en: 'Prompt', label: 'Istruzioni', text: 'Il testo che descrive il ruolo e le regole dell’agente.' },
  { en: 'Pipeline / Speech-to-speech / Dualplex', label: 'Motore', text: 'La tecnologia vocale. Se ha dubbi, lasci Pipeline: è l’impostazione consigliata.' },
  { en: 'Post-call evaluation', label: 'Analisi dopo la chiamata', text: 'Le informazioni estratte automaticamente da ogni chiamata (nome, esigenza, appuntamento…).' },
  { en: 'Variables', label: 'Variabili', text: 'Campi personalizzati come {{customer_name}}, compilati per ogni contatto.' },
  { en: 'Voicemail', label: 'Segreteria', text: 'Cosa fa l’agente se trova una segreteria telefonica.' },
  { en: 'Credits', label: 'Credito', text: 'Il Suo saldo di credito. Serve per i minuti extra e per i messaggi scritti (risposte dell’AI, WhatsApp, SMS); il costo di ogni utilizzo è indicato nella pagina Prezzi.' },
];

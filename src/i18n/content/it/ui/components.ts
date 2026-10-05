// Testi di interfaccia dei componenti condivisi (src/components). Le cifre (prezzi, minuti, giorni
// di prova) e il marchio sono passati come parametri: arrivano dal mercato (src/i18n/markets.ts).
import type { UI_COMPONENTS as FR_UI_COMPONENTS } from '../../fr/ui/components';

export const UI_COMPONENTS: typeof FR_UI_COMPONENTS = {
  layout: {
    home: 'Home',
    freeTrial: 'Prova gratuita',
    callMeBack: 'Essere richiamato',
  },

  navbar: {
    menus: {
      features: 'Funzionalità',
      allFeatures: 'Tutte le funzionalità',
      allFeaturesText: 'Panoramica dei moduli e dei piani.',
      sectors: 'Settori',
      allSectors: 'Tutti i settori',
      resources: 'Risorse',
    },
    resources: {
      demo: 'Demo dal vivo',
      integrations: 'Integrazioni',
      security: 'Sicurezza e conformità',
      faq: 'Domande frequenti',
      help: 'Guida all’area clienti',
      about: 'Chi siamo',
      contact: 'Contatti e richiamata',
    },
    pricing: 'Prezzi',
    login: 'Accedi',
    startFree: 'Inizi gratuitamente',
    mainNav: 'Navigazione principale',
    mobileNav: 'Navigazione mobile',
    openMenu: 'Apri il menu',
    closeMenu: 'Chiudi il menu',
  },

  footer: {
    tagline: 'Agenti vocali AI che rispondono, qualificano, prenotano e richiamano per la Sua azienda, 24 ore su 24.',
    startFree: 'Inizi gratuitamente',
    login: 'Accedi',
    gdpr: 'Strumenti GDPR integrati',
    encryption: 'Crittografia in transito e a riposo',
    cols: {
      platform: 'Piattaforma',
      allFeatures: 'Tutte le funzionalità',
      offers: 'Piani',
      recharges: 'Ricariche di minuti',
      compare: 'Confronta i piani',
      sectors: 'Settori',
      resources: 'Risorse',
    },
    resources: {
      demo: 'Demo dal vivo',
      integrations: 'Integrazioni',
      faq: 'Domande frequenti',
      help: 'Guida all’area clienti',
      about: 'Chi siamo',
      security: 'Sicurezza e conformità',
      contact: 'Contatti',
    },
    copyright: (year: number, brand: string, company: string) => `© ${year} ${brand} — marchio di ${company}. Prezzi indicati IVA esclusa.`,
    legal: {
      notice: 'Note legali',
      terms: 'Termini e condizioni',
      privacy: 'Privacy',
      cookies: 'Cookie',
    },
  },

  callbackModal: {
    titleSupport: 'Richieda una richiamata dall’assistenza',
    titleCommercial: 'Lasci il Suo numero, La richiamiamo noi',
    intro: 'Scelga la fascia oraria. Non pubblichiamo alcun numero: siamo noi a richiamarLa.',
    close: 'Chiudi',
  },

  trialNudge: {
    title: (minutes: string) => `I Suoi primi ${minutes} minuti sono gratuiti`,
    close: 'Chiudi',
    text: (days: number) => `Provi il Suo agente vocale sulle Sue chiamate reali per ${days} giorni, prima di decidere.`,
    points: ['Nessun addebito durante la prova', 'Annullabile con un clic dalla Sua area clienti', 'Primo agente pronto in pochi minuti'],
    claim: (minutes: string) => `Richieda i Suoi ${minutes} minuti`,
    callMeBack: 'Preferisco essere richiamato',
  },

  liveCall: {
    title: 'Agente di accoglienza',
    leadTitle: 'Richiesta creata',
    ariaLabel: 'Esempio di chiamata gestita dall’agente',
    ended: 'Chiamata terminata · riepilogo inviato',
    ongoing: 'Chiamata in corso',
  },

  trialBadges: {
    ariaLabel: 'Condizioni della prova',
  },

  ctas: {
    primary: 'Inizi gratuitamente',
    demo: 'Provi dal vivo il nostro agente',
    callback: 'Lasci il Suo numero, La richiamiamo noi',
  },

  callbackForm: {
    submit: 'Mi faccia richiamare',
    consentRequired: 'Spunti la casella per accettare di essere richiamato.',
    sendFailed: 'Non è stato possibile inviare la richiesta.',
    retry: (email: string) => `Riprovi o scriva a ${email}.`,
    sentTitle: 'Richiesta di richiamata inviata',
    sentText: 'La richiamiamo nella fascia oraria scelta. Se ha indicato un’email, riceverà una conferma.',
    name: 'Nome',
    phone: 'Telefono',
    sector: 'Settore',
    choose: 'Scegli…',
    otherSector: 'Altra attività',
    when: 'Quando possiamo richiamarLa?',
    slots: {
      asap: 'Il prima possibile',
      todayAfternoon: 'Oggi pomeriggio',
      tomorrowMorning: 'Domani mattina',
      tomorrowAfternoon: 'Domani pomeriggio',
    },
    email: 'Email',
    emailHint: '(per la conferma)',
    need: 'La Sua esigenza',
    needPlaceholder: 'Es.: perdo chiamate la sera, voglio automatizzare gli appuntamenti…',
    consent: (brand: string) => `Accetto di essere richiamato al numero indicato, anche da un agente vocale AI di ${brand}. I miei dati sono utilizzati esclusivamente per gestire la mia richiesta.`,
    sending: 'Invio…',
  },

  benefits: {
    items: [
      { title: 'Risponda anche fuori orario', text: 'Sera, fine settimana, durante i Suoi appuntamenti: ogni chiamata riceve una risposta.' },
      { title: 'Qualifichi in automatico', text: 'L’agente pone le Sue domande e Le invia una richiesta completa.' },
      { title: 'Prenoti appuntamenti', text: 'Direttamente nel Suo calendario, con conferma e promemoria.' },
      { title: 'Richiami i lead più in fretta', text: 'Un modulo compilato diventa una chiamata in pochi minuti.' },
      { title: 'Lasci alle persone ciò che conta', text: 'Trasferimento al Suo team quando la situazione lo richiede.' },
    ],
    seeAgent: 'Scopra l’agente nel dettaglio',
  },

  moduleCards: {
    seeIncluded: 'Veda cosa include',
  },

  includesSchema: {
    // Stesso ordine delle icone del componente: telefonia, automazione, CRM, messaggi, calendario, monitoraggio, sicurezza.
    families: [
      { name: 'Telefonia', items: ['Chiamate in entrata e in uscita', 'Numero dedicato opzionale', 'Integrazione SIP', 'Trasferimento a un operatore', 'Identificazione del chiamante'] },
      { name: 'Automazione', items: ['Editor di prompt', 'Flow builder senza codice', 'Assistente per le automazioni', 'Oltre 300 strumenti collegabili'] },
      { name: 'CRM e dati', items: ['Lead e prequalificazione', 'Base di conoscenza', 'Cronologia chiamate', 'Webhook e API'] },
      { name: 'Messaggi', items: ['SMS', 'WhatsApp e template', 'Messenger e Instagram', 'Widget web'] },
      { name: 'Calendario', items: ['Gestione appuntamenti', 'Conferme e promemoria', 'Spostamenti e disdette'] },
      { name: 'Monitoraggio', items: ['Dashboard', 'Report dettagliati', 'Ruoli e permessi'] },
      { name: 'Sicurezza', items: ['Consenso e opt-out', 'Conservazione configurabile', 'Crittografia', 'Registro delle attività'] },
    ],
    centerTitle: 'Il Suo agente vocale AI',
    centerText: 'Al centro: un agente configurato per la Sua attività. Intorno: tutto ciò che può utilizzare.',
    perOffer: 'Veda cosa è incluso in ogni piano',
  },

  steps: {
    step: (n: number) => `Passo ${n}`,
  },

  demoBlock: {
    title: 'Provi subito dal vivo il nostro agente',
    intro: 'Parli con l’agente dal Suo browser, oppure lasci il Suo numero per ricevere una chiamata dimostrativa adatta al Suo settore.',
    launchTitle: 'Avvii la demo dal vivo',
    launchText: 'Una conversazione reale, senza installare nulla.',
    callbackTitle: 'Mi faccia richiamare',
    callbackText: 'L’agente La chiama nella fascia oraria scelta.',
    formTitle: 'Riceva una chiamata dimostrativa',
    formText: 'Gratuita e senza impegno. Sente la voce e il modo in cui l’agente qualifica una richiesta.',
    submit: 'Mi faccia richiamare',
  },

  sectorCards: {
    seePage: (sectorLower: string) => `Veda la pagina ${sectorLower}`,
  },

  pricingCards: {
    daysFree: (days: number) => `${days} giorni gratuiti`,
    negotiated: 'Prezzo al minuto negoziato',
    mostChosen: 'Il più scelto',
    perMinute: (label: string) => `pari a ${label}`,
    details: 'Dettagli del piano',
  },

  matrix: {
    included: 'Incluso',
    notIncluded: 'Non incluso',
    caption: 'Funzioni incluse in ogni piano',
    inYourInterface: 'Nella Sua area clienti',
    pricePerMonth: 'Prezzo IVA esclusa / mese',
    includedMinutes: 'Minuti inclusi',
  },

  recharges: {
    title: 'Ricariche di credito',
    text: 'Il credito paga i minuti oltre il Suo piano. Non scade e si aggiunge immediatamente.',
    rechargeCol: 'Ricarica IVA esclusa',
    approxMinutes: (n: string) => `≈ ${n} min`,
    cheaperTitle: 'Il piano resta più conveniente',
    cheaperText: 'Un minuto incluso costa sempre meno di un minuto extra.',
    included: 'Incluso:',
    extra: (price: string) => ` · extra: ${price} IVA esclusa / min`,
  },

  growthBlock: {
    rules: [
      { title: 'Superamento lieve, una tantum', text: 'Una ricarica basta per finire il mese.' },
      { title: 'Superamenti ripetuti', text: 'Le proponiamo il piano superiore.' },
      { title: 'Ricariche frequenti', text: 'La Sua dashboard Le segnala che sta pagando troppo per il Suo utilizzo.' },
    ],
    ruleCustom: (minutes: string) => `Oltre ${minutes} min regolari`,
    ruleCustomText: 'Costruiamo un’offerta su misura.',
    case1Minutes: (minutes: string) => `${minutes} min questo mese`,
    case1Plan: (plan: string) => `${plan} + una ricarica di credito`,
    case1Note: (price: string, extraMinutes: string, extraPrice: string, total: string) =>
      `${price} + ${extraMinutes} min × ${extraPrice} ≈ ${total} IVA esclusa. Un superamento occasionale: la ricarica è sufficiente.`,
    case2Minutes: (minutes: string) => `${minutes} min ogni mese`,
    case2Plan: (plan: string) => `Passi al piano ${plan}`,
    case2Note: (price: string, minutes: string, total: string, smallerPlan: string) =>
      `${price} IVA esclusa per ${minutes} min, contro ≈ ${total} con ${smallerPlan} + minuti extra. Costa meno, e Le lascia margine.`,
    case3Minutes: (minutes: string) => `${minutes} min regolari`,
    case3Plan: 'Offerta su misura',
    case3Note: (plan: string) => `Oltre il piano ${plan}, negoziamo un prezzo al minuto adatto al Suo volume.`,
    title: 'Aggiunga minuti o cambi piano, al momento giusto',
    intro: 'Non paga mai un minuto più del necessario: Le indichiamo quando basta una ricarica e quando il piano superiore diventa più conveniente.',
    customerAt: 'Un cliente a',
  },

  planFor: {
    oneOffRecharge: ' + ricarica occasionale',
    rechargeOrCustom: ' + ricarica, oppure su misura se regolare',
  },

  economy: {
    title: 'Un costo più prevedibile di una reception tradizionale',
    intro: (costPerCall: string, totalCost: string, calls: string, plan: string, price: string, minutes: string) =>
      `In alcune configurazioni, una reception gestita da personale costa circa ${costPerCall} a chiamata, cioè oltre ${totalCost} per ${calls} chiamate. Il piano ${plan} a ${price} IVA esclusa copre ${minutes} minuti al mese, con disponibilità 24/7. Faccia il confronto con i Suoi numeri.`,
    humanTitle: 'Reception con personale',
    humanPoints: ['Orari d’ufficio', 'Costo variabile: stipendio, contributi, sostituzioni', 'Chiamate perse nei momenti di picco'],
    aiPoints: ['Disponibile 24/7', 'Piano chiaro, prezzi IVA esclusa', 'Più chiamate in parallelo'],
    disclaimer: 'Ipotesi indicativa, in dollari USA: i costi di una reception variano molto in base al paese, agli orari e ai costi del personale. Una chiamata non equivale a un minuto.',
    calculator: 'Calcolatore dei costi',
    calculateTitle: 'Calcoli il Suo caso',
    callsPerMonth: 'Chiamate al mese',
    costPerCall: 'Costo stimato del personale per chiamata',
    avgDuration: 'Durata media di una chiamata',
    min: ' min',
    humanCost: 'Costo stimato del personale',
    callVolume: 'Volume di chiamate',
    suitedPlan: 'Piano adatto a questo volume',
    perMonth: (price: string) => ` — ${price} IVA esclusa / mese`,
  },

  security: {
    items: [
      { title: 'Consenso e opt-out', text: 'Consenso alla richiamata, gestione dei rifiuti, fasce orarie di chiamata consentite e lista di esclusione.' },
      { title: 'Protezione dei dati', text: 'Crittografia in transito e a riposo, accesso per ruolo e periodo di conservazione configurabile.' },
      { title: 'Tracciabilità', text: 'Cronologia delle chiamate, trascrizioni e registro delle attività per ogni account.' },
      { title: 'Controllo degli accessi', text: 'Ruoli e permessi per membro del team con il piano Call Center.' },
      { title: 'Preparazione normativa', text: 'Strumenti per applicare il GDPR: informativa, diritto di accesso, cancellazione, conservazione.' },
      { title: 'Infrastruttura', text: 'Piattaforma ospitata presso fornitori cloud affermati, con backup e monitoraggio.' },
    ],
    title: 'Sicurezza e conformità per le Sue chiamate AI',
    intro: 'Le Sue chiamate contengono informazioni sui Suoi clienti. La piattaforma Le offre le impostazioni per proteggerle e rispettare le loro scelte.',
    approach: 'Il nostro approccio alla sicurezza',
    privacy: 'Informativa sulla privacy',
  },

  voicesNumbers: {
    langs: ['Francese', 'Inglese', 'Spagnolo', 'Tedesco', 'Italiano', 'Portoghese', 'Olandese', 'Arabo', 'Polacco', 'Rumeno', 'Turco', 'Svedese'],
    others: '+ altre 70',
    voicesTitle: 'Voci naturali nella Sua lingua',
    voicesText: 'Oltre 80 lingue e numerosi accenti. L’agente rileva la lingua di chi chiama e risponde nella stessa lingua.',
    numbersTitle: 'Il Suo numero o un numero dedicato',
    numbersText: 'Mantenga il Suo numero (inoltro di chiamata, importazione da Twilio o Telnyx, connessione SIP al Suo centralino) oppure scelga un numero dedicato come opzione, fatturato mensilmente in aggiunta al piano.',
    telephonyOptions: 'Veda le opzioni di telefonia',
  },

  finalCta: {
    title: 'Pronto ad automatizzare le Sue chiamate?',
    primary: 'Inizi la prova gratuita',
    demo: 'Veda la demo dal vivo',
    advisorTitle: 'Parli con un consulente',
    advisorText: 'Lasci il Suo numero: La richiamiamo per rispondere alle Sue domande.',
  },

  heroDemo: {
    langs: ['Francese', 'Inglese', 'Spagnolo', 'Tedesco', 'Italiano', 'Portoghese', 'Arabo', 'Olandese', 'Polacco'],
    voices: ['Femminile', 'Maschile'],
    consentRequired: 'Spunti la casella per ricevere la chiamata.',
    sendFailed: 'Non è stato possibile inviare la richiesta.',
    title: 'Demo dal vivo',
    available: 'Agente disponibile',
    sentTitle: 'L’agente La chiamerà a breve',
    sentText: (sectorLower: string, langLower: string) => `Tenga il telefono a portata di mano. Lo scenario «${sectorLower}» è pronto, in ${langLower}.`,
    intro: 'Scelga una voce e una lingua: l’agente La chiama e simula uno scenario del Suo settore.',
    lang: 'Lingua',
    voice: 'Voce',
    sector: 'Settore',
    firstName: 'Il Suo nome',
    phone: 'Il Suo telefono',
    consent: 'Accetto di essere chiamato dall’agente vocale AI dimostrativo.',
    sending: 'Invio…',
    submit: 'Faccia squillare il mio telefono',
  },

  industryMarquee: ['Idraulici', 'Elettricisti', 'Studi dentistici', 'Cliniche', 'Agenzie immobiliari', 'Gestione affitti', 'Officine', 'Carrozzerie', 'Parrucchieri', 'Centri estetici', 'Ristoranti', 'Hotel', 'Avvocati', 'E-commerce', 'Fisioterapisti', 'Veterinari'],

  // Stesso ordine delle bandiere del componente.
  languageMarquee: ['Francese', 'Inglese', 'Spagnolo', 'Tedesco', 'Italiano', 'Portoghese', 'Olandese', 'Belgio', 'Svizzera', 'Québec', 'Arabo', 'Polacco', 'Rumeno', 'Turco', 'Svedese'],

  agentTeam: {
    // Stesso ordine delle icone e dei link del componente.
    agents: [
      { name: 'Receptionist AI', role: 'Risponde a ogni chiamata, filtra e trasferisce ciò che conta.' },
      { name: 'Agente appuntamenti', role: 'Prenota, conferma, invia promemoria e gestisce gli spostamenti.' },
      { name: 'Agente qualificazione', role: 'Pone le Sue domande e prepara schede pronte da gestire.' },
      { name: 'Agente assistenza', role: 'Risponde in base ai Suoi documenti, inoltra i casi delicati.' },
      { name: 'Agente ricontatti', role: 'Conferma, ricontatta sui preventivi e riattiva i Suoi contatti.' },
      { name: 'Agente messaggi', role: 'Risponde e conferma via SMS, WhatsApp e Instagram.' },
    ],
    title: 'Costruisca il Suo team di agenti AI',
    intro: 'Ogni agente ha un ruolo preciso. Attivi quelli di cui la Sua azienda ha bisogno; condividono la stessa cronologia e le stesse informazioni.',
    custom: 'Le serve uno scenario particolare? Configuriamo un agente su misura.',
  },

  sectorShowcase: {
    chooseSector: 'Scelga un settore',
    agentFor: (sectorLower: string) => `Agente ${sectorLower}`,
    seeSolution: (sectorLower: string) => `Veda la soluzione ${sectorLower}`,
  },

  useCaseTabs: {
    ariaLabel: 'Tipi di utilizzo',
    // Stesso ordine delle icone del componente.
    tabs: {
      entrants: {
        label: 'Chiamate in entrata',
        items: [
          { title: 'Accoglienza 24/7', text: 'Ogni chiamata riceve una risposta, anche di notte e nel fine settimana.' },
          { title: 'Gestione appuntamenti', text: 'Prenotazione diretta nel Suo calendario, con conferma.' },
          { title: 'Assistenza clienti', text: 'Risposte basate sui Suoi documenti, senza code.' },
          { title: 'Qualificazione', text: 'Le domande giuste, poste prima di inoltrare.' },
          { title: 'Trasferimento a un operatore', text: 'Passaggio al Suo team quando è importante.' },
          { title: 'Urgenze', text: 'Smistamento secondo le Sue regole e avviso immediato.' },
        ],
      },
      sortants: {
        label: 'Chiamate in uscita',
        items: [
          { title: 'Richiamata dei lead dal web', text: 'Un modulo compilato diventa una chiamata in pochi minuti.' },
          { title: 'Conferme', text: 'Appuntamenti e prenotazioni confermati il giorno prima.' },
          { title: 'Ricontatto sui preventivi', text: 'I preventivi in sospeso ricontattati negli orari giusti.' },
          { title: 'Prequalificazione', text: 'Contatti filtrati prima della chiamata del Suo team.' },
          { title: 'Rinnovi', text: 'Clienti ricontattati per rinnovare o integrare.' },
          { title: 'Sondaggi di soddisfazione', text: 'Opinioni raccolte dopo il servizio.' },
        ],
      },
      messages: {
        label: 'Messaggi',
        items: [
          { title: 'WhatsApp', text: 'Conferme, promemoria e risposte scritte.' },
          { title: 'SMS', text: 'Riepilogo dopo ogni chiamata.' },
          { title: 'Instagram e Messenger', text: 'Messaggi diretti centralizzati.' },
          { title: 'Widget web', text: 'Parlare con l’agente o essere richiamati dal Suo sito.' },
          { title: 'Lista d’attesa', text: 'Avvisare quando si libera uno slot.' },
          { title: 'Cronologia unica', text: 'Chiamate e messaggi nello stesso posto.' },
        ],
      },
    },
  },

  platformGrid: {
    simultaneousTitle: 'Chiamate simultanee',
    simultaneousText: 'Nessuna coda: l’agente gestisce più chiamate contemporaneamente sulla stessa linea.',
    knowledgeTitle: 'Base di conoscenza',
    knowledgeText: 'PDF, pagine del Suo sito, procedure: l’agente risponde con le Sue informazioni.',
    promptTitle: 'Assistente per i prompt',
    promptText: 'Descriva l’obiettivo della chiamata: un assistente passo passo imposta il comportamento dell’agente.',
    transferTitle: 'Trasferimento a un operatore',
    transferText: 'Quando il cliente lo chiede o la situazione lo richiede, la chiamata passa al Suo team.',
    aiAgent: 'Agente AI',
    yourTeam: 'Il Suo team',
    reportsTitle: 'Report dettagliati',
    reportsText: 'Registrazioni, trascrizioni, riepiloghi e grafici per ogni chiamata.',
    campaignsTitle: 'Campagne in uscita',
    campaignsText: 'Importi i Suoi contatti che hanno dato il consenso o avvii chiamate dai Suoi strumenti e moduli.',
  },

  lifecycle: {
    title: 'Tutto il percorso del cliente, in un unico posto',
    intro: 'Dalla prima richiesta al cliente fidelizzato: una sola piattaforma, una sola cronologia.',
    ariaLabel: 'Fasi del percorso',
    // Stesso ordine delle icone e dei mockup del componente.
    stages: [
      { key: 'Attrarre', title: 'Intercetti ogni richiesta', items: ['Landing page per settore', 'Widget web: parlare o essere richiamati', 'Numeri locali e inoltro della Sua linea', 'Risposta 24/7 a chiamate e messaggi'] },
      { key: 'Convertire', title: 'Trasformi le richieste in clienti', items: ['Qualificazione secondo i Suoi criteri', 'Richiamata dei lead in pochi minuti', 'Appuntamenti fissati nel Suo calendario', 'Scheda CRM creata automaticamente'] },
      { key: 'Fidelizzare', title: 'Mantenga il legame con i Suoi clienti', items: ['Conferme e promemoria', 'Assistenza che risponde in base ai Suoi documenti', 'Ricontatti, rinnovi e sondaggi', 'WhatsApp, SMS, Instagram'] },
      { key: 'Misurare', title: 'Gestisca con dati reali', items: ['Volumi, durate e risultati', 'Appuntamenti fissati e trasferimenti', 'Utilizzo dei minuti e avvisi', 'Ascolto delle chiamate e trascrizioni'] },
    ],
  },

  portalPreview: {
    // Stesso ordine dei colori delle etichette del componente.
    calls: [
      { who: 'Nuovo paziente', what: 'Appuntamento martedì 9:30', tag: 'Prenotato' },
      { who: 'Perdita d’acqua', what: 'Richiamata prioritaria richiesta', tag: 'Urgente' },
      { who: 'Acquirente trilocale', what: 'Visita sabato 11:00', tag: 'Qualificato' },
      { who: 'Domanda sugli orari', what: 'Risposta fornita', tag: 'Risolto' },
    ],
    title: 'La Sua area clienti, chiara fin dal primo accesso',
    intro: 'Chiamate, appuntamenti, lead, messaggi e minuti: tutto è visibile in un unico posto, da computer come da smartphone.',
    points: ['Riepilogo di ogni chiamata e prossima azione', 'Ascolto delle registrazioni e trascrizioni', 'Monitoraggio dei minuti e avvisi di consumo', 'Configurazione dei Suoi agenti senza codice'],
    roles: 'Accesso per ruolo per ogni membro del team (piano Call Center).',
    dashboard: 'Dashboard',
    sampleData: 'Dati di esempio · ultimi 30 giorni',
    stats: [['Chiamate', '412'], ['Appuntamenti', '96'], ['Lead', '183'], ['Minuti', '62%']],
    notification: 'Notifica',
    notifBooking: 'Nuovo appuntamento prenotato dall’agente: martedì 9:30.',
    notifMinutes: 'Minuti: 62% utilizzati.',
  },

  beforeAfter: {
    without: 'Senza agente AI',
    with: (brand: string) => `Con ${brand}`,
  },

  mock: {
    call: {
      agent: 'Agente di accoglienza',
      meta: 'Chiamata in entrata · 01:24',
      client: 'Buongiorno, vorrei prendere un appuntamento.',
      reply: 'Certamente. È per una prima visita?',
    },
    calendar: {
      days: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven'],
      week: 'Settimana 42',
      added: 'Appuntamento aggiunto dall’agente',
      slot: 'Martedì · 9:30 – 10:00',
    },
    transcript: {
      label: 'Trascrizione',
      question: 'Può indicarmi il Suo budget indicativo?',
      answer: 'Intorno ai 300.000 euro.',
      summaryLabel: 'Riepilogo:',
      summary: ' acquisto, budget 300.000 €, visita richiesta sabato.',
    },
    knowledge: {
      title: 'Base di conoscenza',
      rows: [
        { name: 'procedure-accoglienza.pdf', meta: 'PDF · 1,2 MB' },
        { name: 'Pagine del Suo sito', meta: '18 pagine indicizzate' },
        { name: 'Tariffe e orari', meta: 'Aggiornato oggi' },
      ],
    },
    prompt: {
      title: 'Obiettivo della chiamata',
      hint: 'Descriva cosa deve fare l’agente.',
      text: 'Accogliere il paziente, capire se è nuovo, proporre due orari e confermare via SMS.',
      tags: ['Tono: cordiale', 'Dare del Lei', 'Nessun consiglio medico'],
    },
    flow: {
      title: 'Scenario: lead dal web',
      steps: [
        { title: 'Nuovo modulo', source: 'Sito web' },
        { title: 'Chiamare il lead', source: 'Agente commerciale' },
        { title: 'Creare la scheda', source: 'CRM' },
        { title: 'Inviare la conferma', source: 'WhatsApp' },
      ],
    },
    numbers: {
      title: 'Le Sue linee',
      rows: [
        { country: 'Italia', kind: 'Numero locale', agent: 'Agente di accoglienza' },
        { country: 'Regno Unito', kind: 'Numero locale', agent: 'Agente appuntamenti' },
        { country: 'Il Suo centralino', kind: 'Trunk SIP', agent: 'Inoltro fuori orario' },
      ],
    },
    report: {
      handled: 'Chiamate gestite · esempio',
      demo: 'Demo',
      stats: [['Appuntamenti', '96'], ['Qualificati', '183'], ['Trasferimenti', '27']],
    },
    widget: {
      question: 'Ha una domanda? Parliamone.',
      talk: 'Parli con l’agente',
      callback: 'Essere richiamato',
    },
    whatsapp: {
      title: 'WhatsApp · Conferma',
      confirmation: 'Il Suo appuntamento è confermato per martedì alle 9:30. Risponda 2 per spostarlo.',
      reply: 'Perfetto, grazie!',
    },
    campaign: {
      title: 'Campagne',
      rows: [['Conferme settimana 42', 'In corso', '68%'], ['Ricontatto preventivi settembre', 'Completata', '41%'], ['Clienti inattivi', 'Pianificata', '—']],
      note: 'Dati di esempio · chiamate solo verso contatti che hanno dato il consenso',
    },
    lead: {
      title: 'Richiesta qualificata',
      interest: 'Interesse alto',
      fields: [['Esigenza', 'Preventivo ristrutturazione'], ['Zona', 'Milano, Municipio 3'], ['Budget', '8 – 12 mila €'], ['Tempistiche', 'Entro 1 mese']],
      next: 'Prossima azione: richiamata domani alle 9:00',
    },
    support: {
      client: 'Il mio ordine non è arrivato.',
      agent: 'Verifico subito. Può indicarmi il numero dell’ordine?',
      found: 'Risposta trovata in «condizioni-consegna.pdf»',
    },
  },
};

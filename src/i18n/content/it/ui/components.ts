// Testi di interfaccia dei componenti condivisi (src/components). Le cifre (prezzi, minuti, giorni
// di prova) e il marchio sono passati come parametri: arrivano dal mercato (src/i18n/markets.ts).
import type { UI_COMPONENTS as FR_UI_COMPONENTS } from '../../fr/ui/components';

export const UI_COMPONENTS: typeof FR_UI_COMPONENTS = {
  layout: {
    home: 'Home',
    freeTrial: 'Inizi gratis',
    callMeBack: 'Richieda una richiamata',
    formInterrupted: 'La pagina non era ancora del tutto caricata: la Sua richiesta non è stata inviata. La preghiamo di inviarla di nuovo.',
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
    alreadyClient: 'Già cliente?',
    clientArea: 'Acceda alla Sua area clienti',
    account: 'Il mio account: piano e fatture',
    startFree: 'Inizi gratis',
    mainNav: 'Navigazione principale',
    mobileNav: 'Navigazione mobile',
    openMenu: 'Apri il menu',
    closeMenu: 'Chiudi il menu',
  },

  footer: {
    tagline: 'Agenti vocali AI che rispondono, qualificano, prenotano e richiamano per la Sua azienda, 24 ore su 24.',
    startFree: 'Inizi gratis',
    login: 'Accedi',
    gdpr: 'Strumenti GDPR integrati',
    encryption: 'Crittografia in transito',
    cols: {
      platform: 'Piattaforma',
      allFeatures: 'Tutte le funzionalità',
      offers: 'Piani',
      recharges: 'Ricariche di credito',
      compare: 'Confronta i piani',
      sectors: 'Settori',
      resources: 'Risorse',
    },
    resources: {
      demo: 'Demo dal vivo',
      integrations: 'Integrazioni',
      faq: 'Domande frequenti',
      help: 'Guida all’area clienti',
      account: 'Il mio account',
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
      accessibility: 'Accessibilità',
    },
  },

  callbackModal: {
    titleSupport: 'Richieda una richiamata dall’assistenza',
    titleCommercial: 'Lasci il Suo numero, La richiamiamo noi',
    intro: 'Scelga la fascia oraria: siamo noi a richiamarLa.',
    close: 'Chiudi',
  },

  // Pop-up de relance : titre court, minutes offertes juste dessous, vraies conditions de l’essai dans la ligne de texte (vouvoiement Lei).
  trialNudge: {
    title: 'Il Suo agente AI gratuito',
    subtitle: (minutes: string) => `${minutes} minuti in omaggio`,
    close: 'Chiudi',
    text: (days: number) => `Prova gratuita di ${days} giorni, senza vincoli: carta richiesta all’attivazione, nessun addebito durante la prova. Disdica prima della fine senza costi.`,
    points: [
      'Risponde ai Suoi clienti 24 ore su 24, in oltre 80 lingue',
      'Fissa gli appuntamenti e qualifica i contatti',
      'Le invia il riepilogo di ogni chiamata',
      'Pronto in pochi minuti, con il Suo numero di sempre',
    ],
    claim: 'Crei gratis il Suo agente',
    callMeBack: 'Richieda una richiamata',
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
    primary: 'Inizi gratis',
    demo: 'Provi dal vivo il nostro agente',
    callback: 'Richieda una richiamata',
  },

  callbackForm: {
    submit: 'Richieda una richiamata',
    consentRequired: 'Spunti la casella per accettare di essere richiamato.',
    sendFailed: 'Non è stato possibile inviare la richiesta.',
    retry: (email: string) => `Riprovi o scriva a ${email}.`,
    sentTitle: 'Richiesta di richiamata inviata',
    sentText: 'La richiamiamo nella fascia oraria scelta. Se ha selezionato WhatsApp, riceverà lì la conferma.',
    name: 'Nome',
    phone: 'Telefono',
    sector: 'Settore',
    choose: 'Selezioni…',
    otherSector: 'Altra attività',
    when: 'Quando possiamo richiamarLa?',
    slots: {
      asap: 'Il prima possibile',
      todayAfternoon: 'Oggi pomeriggio',
      tomorrowMorning: 'Domani mattina',
      tomorrowAfternoon: 'Domani pomeriggio',
      precise: 'In un giorno e a un’ora precisi',
    },
    preciseLabel: 'Data e ora (ora locale)',
    email: 'Email',
    emailHint: '(facoltativa)',
    need: 'La Sua esigenza',
    needPlaceholder: 'Es.: perdo chiamate la sera, voglio automatizzare gli appuntamenti…',
    consent: (brand: string) => `Accetto di essere richiamato al numero indicato, anche da un agente vocale AI di ${brand}. I miei dati sono trattati secondo l’informativa sulla privacy e non sono mai venduti.`,
    sending: 'Invio…',
    company: 'Azienda',
    optional: '(facoltativo)',
    volume: 'Chiamate ricevute al mese',
    volumeOptions: ['Meno di 200', 'Da 200 a 1.000', 'Più di 1.000'],
    phoneInvalid: 'Indichi un numero di telefono valido, ad esempio 312 345 6789.',
  },

  // Consenso marketing (ricontatti): casella NON selezionata, separata dal consenso alla richiamata. Consenso
  // espresso obbligatorio in Italia. Ogni modifica richiede una nuova MARKETING_TEXT_VERSION (src/lib/contacts.ts).
  marketingConsent: {
    email: (brand: string, company: string) => `Acconsento a ricevere via e-mail consigli e offerte di ${brand}: alcune e-mail nelle prime settimane, poi al massimo una al mese. Disiscrizione con un clic in ogni e-mail.`,
    whatsapp: (brand: string) => `Acconsento a ricevere questi consigli e offerte di ${brand} anche su WhatsApp (facoltativo; risponda STOP in qualsiasi momento per interrompere).`,
    notice: (brand: string, company: string, email: string) => [
      'Il consenso è facoltativo: senza di esso Le scriveremo solo in merito alla Sua richiesta. Può revocarlo in qualsiasi momento, gratuitamente, con il link presente in ogni e-mail o scrivendo a ', email,
      '. Titolare del trattamento: ', company, '. Vedi l’',
      { a: 'informativa sulla privacy', href: '/confidentialite' }, '.',
    ],
    emailPlaceholder: 'La Sua e-mail (facoltativa)',
  },

  benefits: {
    items: [
      { title: 'Risponda anche fuori orario', text: 'Sera, fine settimana, durante i Suoi appuntamenti: ogni chiamata riceve una risposta.' },
      { title: 'Qualifichi in automatico', text: 'L’agente pone le Sue domande e Le invia una richiesta completa.' },
      { title: 'Prenoti appuntamenti', text: 'Direttamente nel Suo calendario, con conferma e promemoria (a partire dal piano Assistant).' },
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
      { name: 'Automazione', items: ['Editor di prompt', 'Editor di automazioni senza codice', 'Assistente per le automazioni', 'Oltre 300 strumenti collegabili'] },
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

  // Parcours d’un appel en 4 étapes (src/components/CallFlow.tsx, même ordre que les icônes)
  callFlow: {
    title: 'Una chiamata, dal primo «pronto» al riepilogo',
    intro: 'Cosa succede quando un cliente chiama mentre Lei è occupato.',
    steps: [
      { title: 'Il cliente chiama', text: 'L’agente risponde al primo squillo, di giorno come di notte, e dice di essere un’AI.' },
      { title: 'L’agente capisce la richiesta', text: 'Risponde con le Sue informazioni e fa le domande utili: nome, esigenza, urgenza.' },
      { title: 'L’appuntamento è fissato', text: 'Propone una fascia libera e la registra nel Suo calendario, tramite Cal.com o Calendly.' },
      { title: 'Lei riceve il riepilogo', text: 'Il riepilogo della chiamata arriva via email e nella Sua dashboard, oppure su WhatsApp se lo ha configurato.' },
    ],
  },

  demoBlock: {
    title: 'Provi subito dal vivo il nostro agente',
    intro: 'Parli con l’agente dal Suo browser, oppure lo faccia squillare sul Suo telefono: bastano 30 secondi per giudicare la voce e il modo in cui gestisce una richiesta del Suo settore.',
    launchTitle: 'Avvii la demo dal vivo',
    launchText: 'Una conversazione reale, senza installare nulla.',
    callbackTitle: 'Richieda una richiamata',
    callbackText: 'L’agente La chiama nella fascia oraria scelta.',
    formTitle: 'Riceva una chiamata dimostrativa',
    formText: 'Gratuita e senza impegno. Sente la voce e il modo in cui l’agente qualifica una richiesta.',
    submit: 'Mi faccia richiamare',
  },

  sectorCards: {
    seePage: (sectorLower: string) => `Veda la pagina «${sectorLower.charAt(0).toUpperCase()}${sectorLower.slice(1)}»`,
  },

  pricingCards: {
    daysFree: (days: number) => `${days} giorni gratuiti`,
    negotiated: 'Prezzo al minuto negoziato',
    mostChosen: 'Consigliato',
    perMinute: (label: string) => `pari a ${label}`,
    details: 'Dettagli del piano',
    billing: 'Periodo di fatturazione',
    monthly: 'Mensile',
    annual: 'Annuale',
    twoMonthsFree: '2 mesi gratis',
    billedYearly: (price: string) => `fatturato ${price} IVA esclusa all’anno`,
    save: (amount: string) => `risparmi ${amount}`,
    phoneNumber: (price: string) => `+ numero dedicato da ${price} / mese`,
  },

  matrix: {
    included: 'Incluso',
    notIncluded: 'Non incluso',
    caption: 'Funzioni incluse in ogni piano',
    inYourInterface: 'Nella Sua area clienti',
    pricePerMonthAnnual: 'Prezzo IVA esclusa / mese (fatturazione annuale)',
    pricePerMonth: 'Prezzo IVA esclusa / mese',
    includedMinutes: 'Minuti inclusi',
    extraMinute: 'Minuto aggiuntivo',
    phoneNumber: 'Acquisto di un numero',
    phoneNumberFrom: (price: string) => `da ${price} / mese`,
    showAll: (n: number) => `Mostra il confronto completo (${n} righe)`,
    showLess: 'Mostra meno',
    legendIncluded: 'Incluso',
    legendNotIncluded: 'Non incluso',
    legendLimit: 'Numero = limite del piano',
  },

  includedStack: {
    title: 'Tutto incluso, zero chiavi API',
    intro: 'I migliori modelli di AI, voci e trascrizioni sono già collegati nella Sua area clienti. Nessun account da aprire presso ogni fornitore, nessuna chiave da copiare, un’unica fattura.',
    groups: [
      { key: 'llm', title: 'Modelli linguistici', text: 'Il cervello dell’agente: comprende la richiesta e decide cosa rispondere.' },
      { key: 's2s', title: 'Voce in tempo reale', text: 'Modelli che ascoltano e parlano direttamente, per le conversazioni più naturali.' },
      { key: 'tts', title: 'Sintesi vocale', text: 'Centinaia di voci naturali, in oltre 80 lingue.' },
      { key: 'stt', title: 'Trascrizione', text: 'Riconoscimento vocale rapido, anche al telefono.' },
      { key: 'channels', title: 'Canali', text: 'Lo stesso agente risponde ovunque i Suoi clienti Le scrivano o La chiamino.' },
    ],
    noKeys: ['Nessuna chiave API da gestire', 'Cambi modello o voce con un clic', 'Un’unica fattura, in dollari IVA esclusa'],
    note: 'Marchi citati a titolo descrittivo: appartengono ai rispettivi proprietari e indicano le tecnologie disponibili nell’area clienti, senza alcuna partnership con tali società. L’elenco evolve con la piattaforma.',
    channelNames: { phone: 'Telefono', sip: 'SIP', widget: 'Widget web', email: 'Email' },
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
      { title: 'Superamenti ripetuti', text: 'Il nostro team Le consiglia il piano superiore.' },
      { title: 'Ricariche frequenti', text: 'Un avviso di saldo basso La informa; confronti i piani in Change plan.' },
    ],
    ruleCustom: (minutes: string) => `Oltre ${minutes} min al mese`,
    ruleCustomText: 'Costruiamo un’offerta su misura.',
    case1Minutes: (minutes: string) => `${minutes} min questo mese`,
    case1Plan: (plan: string) => `${plan} + una ricarica di credito`,
    case1Note: (price: string, extraMinutes: string, extraPrice: string, total: string) =>
      `${price} + ${extraMinutes} min × ${extraPrice} ≈ ${total} IVA esclusa. Un superamento occasionale: la ricarica è sufficiente.`,
    case2Minutes: (minutes: string) => `${minutes} min ogni mese`,
    case2Plan: (plan: string) => `Passi al piano ${plan}`,
    case2Note: (price: string, minutes: string, total: string, smallerPlan: string) =>
      `${price} IVA esclusa per ${minutes} min, contro ≈ ${total} con ${smallerPlan} + minuti extra. Costa meno, e Le lascia margine.`,
    case3Minutes: (minutes: string) => `${minutes} min al mese`,
    case3Plan: 'Piano su misura',
    case3Note: (plan: string) => `Oltre il piano ${plan}, negoziamo un prezzo al minuto adatto al Suo volume.`,
    title: 'Aggiunga minuti o cambi piano, al momento giusto',
    intro: 'Le indichiamo quando basta una ricarica e quando il piano superiore diventa più conveniente.',
    customerAt: 'Un cliente a',
  },

  planFor: {
    oneOffRecharge: ' + ricarica occasionale',
    rechargeOrCustom: ' + ricarica, oppure su misura se regolare',
  },

  economy: {
    title: 'Calcoli il Suo ritorno sull’investimento',
    intro: 'Inserisca il Suo volume di chiamate: il calcolatore sceglie il piano più conveniente per quel volume, mostra il prezzo reale al minuto e lo confronta con il costo di una reception con personale.',
    calculator: 'Calcolatore del ritorno sull’investimento',
    yourCalls: 'Le Sue chiamate',
    yourCosts: 'La Sua reception oggi',
    callsPerMonth: 'Chiamate al mese',
    avgDuration: 'Durata media di una chiamata',
    hourlyCost: 'Costo orario di un dipendente (oneri inclusi)',
    missedRate: 'Chiamate perse oggi',
    customerValue: 'Valore medio di un nuovo cliente',
    min: ' min',
    perHour: ' / h',
    minutesMonth: 'Minuti al mese',
    bestPlan: 'Piano più conveniente per questo volume',
    planCost: (plan: string) => `Costo ${plan}`,
    withExtra: (minutes: string, price: string) => `di cui ${minutes} min aggiuntivi a ${price}`,
    customAbove: (minutes: string) => `Oltre ${minutes} min al mese, richieda un’offerta su misura.`,
    effectivePerMinute: 'Prezzo reale al minuto',
    humanCost: 'Costo di una reception con personale',
    savings: 'Risparmio mensile',
    noSavings: 'A questo volume, l’agente costa un po’ più di una persona, ma risponde 24/7 e a più chiamate in parallelo.',
    recovered: 'Fatturato recuperato (stima)',
    recoveredDetail: (calls: string) => `${calls} chiamate perse recuperate al mese`,
    netBenefit: 'Beneficio mensile stimato',
    roi: (x: string) => `Ritorno: ${x} volte il prezzo del piano`,
    perMonth: ' / mese',
    missedYesterday: 'Quante chiamate ha perso ieri?',
    workingDaysNote: (days: number) => `Moltiplicato per ${days} giorni lavorativi, questo numero regola il cursore delle chiamate perse.`,
    perWeek: ' / settimana',
    perYear: ' / anno',
    assumptions: (wrapUp: number, conversion: number) =>
      `Ipotesi: ${wrapUp} min di lavorazione dopo ogni chiamata per un dipendente, il ${conversion}% delle chiamate perse diventa cliente. Prezzi IVA esclusa in dollari USA; numero di telefono escluso. Stima indicativa, da confrontare con i Suoi dati.`,
    cta: 'Provi gratis',
  },

  humanVsAi: {
    title: 'Il confronto onesto con una postazione di reception',
    intro: 'Una persona alla reception è preziosa. Ha però un costo, degli orari, e risponde a una sola chiamata alla volta. Ecco il confronto, voce per voce.',
    caption: 'Confronto tra una postazione di reception a tempo pieno e l’agente AI',
    human: 'Reception a tempo pieno',
    ai: 'Agente AI',
    rows: [
      { label: 'Costo mensile', human: 'Almeno la retribuzione minima del CCNL applicabile, più contributi e TFR', ai: 'Da {from} IVA esclusa al mese (350 min), oppure {payg} al minuto senza abbonamento' },
      { label: 'Ore coperte', human: '40 ore a settimana', ai: '24 ore su 24, 7 giorni su 7 (168 ore a settimana)' },
      { label: 'Chiamate simultanee', human: 'Una sola', ai: 'Più chiamate in parallelo' },
      { label: 'Lingue', human: 'Una, a volte due', ai: 'Oltre 80, con voci native' },
      { label: 'Avvio', human: 'Selezione, poi diverse settimane di formazione', ai: 'Pochi minuti; istruzioni modificabili in qualsiasi momento' },
      { label: 'Ferie e assenze', human: 'Da sostituire', ai: 'Nessuna' },
      { label: 'Costanza', human: 'Variabile secondo il carico e l’orario', ai: 'Le stesse regole a ogni chiamata' },
      { label: 'Note dopo la chiamata', human: 'Manuali, quando c’è tempo', ai: 'Riepilogo, trascrizione e dati estratti automaticamente' },
    ],
    note: 'Una persona resta indispensabile per i casi delicati: l’agente le passa un riepilogo e organizza la richiamata. Molti clienti mantengono la loro reception e affidano all’agente i picchi, la pausa pranzo, la sera e il fine settimana. Nessun costo di attivazione, nessun vincolo.',
  },

  security: {
    items: [
      { title: 'Consenso e opt-out', text: 'Consenso alla richiamata, gestione dei rifiuti, fasce orarie di chiamata consentite e lista di esclusione.' },
      { title: 'Protezione dei dati', text: 'Crittografia in transito, accesso protetto da account e periodo di conservazione configurabile.' },
      { title: 'Tracciabilità', text: 'Cronologia delle chiamate, trascrizioni e registro delle attività per ogni account.' },
      { title: 'Controllo degli accessi', text: 'Ogni cliente dispone della propria area protetta; l’agente accede solo alle informazioni che Lei gli fornisce.' },
      { title: 'Conformità normativa', text: 'Strumenti per applicare il GDPR: informativa, diritto di accesso, cancellazione di chiamate e registrazioni, conservazione. Accordo sul trattamento dei dati (DPA) integrato nelle Condizioni (articolo 8); versione firmata su richiesta.' },
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
    numbersText: 'Mantenga il Suo numero (deviazione di chiamata, importazione da Twilio o Telnyx, connessione SIP al Suo centralino) oppure scelga un numero dedicato come opzione, fatturato mensilmente in aggiunta al piano.',
    telephonyOptions: 'Veda le opzioni di telefonia',
  },

  finalCta: {
    title: 'Pronto ad automatizzare le Sue chiamate?',
    primary: 'Inizi gratis',
    demo: 'Veda la demo dal vivo',
    advisorTitle: 'Parli con un consulente',
    advisorText: 'Lasci il Suo numero: La richiamiamo per rispondere alle Sue domande.',
  },

  liveDemo: {
    title: 'Parli con l’agente, adesso',
    intro: 'Scelga un ruolo e una lingua, poi lo provi nel browser o riceva la sua chiamata sul telefono.',
    roleLabel: 'Ruolo dell’agente',
    // Stesso ordine delle sfere del componente.
    roles: [
      { name: 'Receptionist', text: 'Risponde alle chiamate, informa e prende gli appuntamenti.' },
      { name: 'Commerciale', text: 'Qualifica le richieste e segnala i progetti da richiamare.' },
      { name: 'Assistenza', text: 'Risponde alle domande dei clienti e inoltra i casi delicati.' },
    ],
    langLabel: 'Lingua',
    accents: { fr: 'Francese di Parigi', 'en-gb': 'Inglese britannico', 'en-au': 'Inglese australiano', it: 'Italiano', pl: 'Polacco', nl: 'Olandese', he: 'Ebraico israeliano' },
    sector: 'Il Suo settore',
    modeLabel: 'Come provarlo',
    modeBrowser: 'In questo browser',
    modePhone: 'Sul mio telefono',
    stageLabel: 'Il Suo agente demo',
    voiceTag: (name: string) => `Voce di ${name}`,
    browserText: 'Cliccando si apre una finestra su questa pagina: parli con l’agente al microfono o gli scriva. Conosce già il ruolo e il settore scelti.',
    browserCta: (name: string) => `Parli con ${name}`,
    browserOpening: 'Apertura…',
    browserLegal: 'Il browser Le chiederà l’accesso al microfono per la conversazione vocale.',
    browserError: 'Non è stato possibile aprire l’assistente. Riprovi, oppure scelga «Sul mio telefono».',
    dialogTitle: (name: string) => `Conversazione con ${name}`,
    close: 'Chiudi',
    firstName: 'Il Suo nome',
    phone: 'Il Suo telefono',
    consent: 'Accetto di essere chiamato dall’agente vocale AI dimostrativo.',
    consentRequired: 'Spunti la casella per ricevere la chiamata.',
    sendFailed: 'Non è stato possibile inviare la richiesta.',
    sending: 'Invio…',
    phoneCta: 'Mi chiami adesso',
    phoneLegal: 'Gratuito e senza impegno. Il Suo numero serve per questa demo; La ricontattiamo solo se lo accetta qui sotto.',
    sentTitle: 'Richiesta ricevuta',
    sentText: (name: string) => `${name} La chiama entro pochi minuti durante l’orario di apertura (dal lunedì al sabato, 9:00-13:00 e 14:30-19:00, ora italiana). Tenga il telefono a portata di mano.`,
    again: 'Riprovi',
    portraitAlt: (name: string, accent: string, male = false) => `${name}, agente vocale AI, voce ${male ? 'maschile' : 'femminile'} (${accent})`,
    voiceLabel: 'Voce',
    voiceOption: (name: string, male: boolean) => `${name}, voce ${male ? 'maschile' : 'femminile'}`,
  },

  industryMarquee: ['Idraulici', 'Elettricisti', 'Agenzie immobiliari', 'Gestione affitti', 'Officine', 'Carrozzerie', 'Parrucchieri', 'Barbieri', 'Centri estetici', 'Ristoranti', 'Hotel', 'Avvocati', 'Commercialisti', 'E-commerce', 'Broker', 'Amministratori di condominio', 'Veterinari'],

  // Stesso ordine delle bandiere del componente.
  languageMarquee: ['Francese', 'Inglese', 'Spagnolo', 'Tedesco', 'Italiano', 'Portoghese', 'Olandese', 'Francese (Belgio)', 'Francese (Svizzera)', 'Francese (Québec)', 'Arabo', 'Polacco', 'Rumeno', 'Turco', 'Svedese', 'Ebraico'],

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
    virtualNote: 'I nostri agenti sono agenti AI virtuali: i volti sono illustrazioni generate, non persone reali.',
  },

  sectorShowcase: {
    chooseSector: 'Scelga un settore',
    agentFor: (sectorLower: string) => `Agente per ${sectorLower}`,
    seeSolution: (sectorLower: string) => `Scopra la soluzione per ${sectorLower}`,
  },

  scenarioExplorer: {
    chooseTrade: 'Scelga un mestiere',
    answering: (agentName: string) => `${agentName} risponde`,
    replay: 'Riascolti la chiamata',
    benefitsTitle: 'Cosa cambia per Lei',
    planLabel: 'Piano consigliato',
    tryLive: 'Provi questo scenario dal vivo',
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
          { title: 'Lista d’attesa', text: 'Avvisare quando si libera un posto.' },
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
      { who: 'Nuovo cliente', what: 'Appuntamento martedì 9:30', tag: 'Prenotato' },
      { who: 'Perdita d’acqua', what: 'Richiamata prioritaria richiesta', tag: 'Urgente' },
      { who: 'Acquirente trilocale', what: 'Visita sabato 11:00', tag: 'Qualificato' },
      { who: 'Domanda sugli orari', what: 'Risposta fornita', tag: 'Risolto' },
    ],
    title: 'La Sua area clienti, chiara fin dal primo accesso',
    intro: 'Chiamate, appuntamenti, lead, messaggi e minuti: tutto è visibile in un unico posto, da computer come da smartphone.',
    points: ['Riepilogo di ogni chiamata e prossima azione', 'Ascolto delle registrazioni e trascrizioni', 'Monitoraggio dei minuti e avvisi di consumo', 'Configurazione dei Suoi agenti senza codice'],
    roles: 'Un’area protetta per ogni cliente, con i propri agenti, numeri e dati.',
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
      question: 'Qual è il Suo budget orientativo?',
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
      text: 'Accogliere il cliente, capire se è nuovo, proporre due orari e confermare via SMS.',
      tags: ['Tono: cordiale', 'Dare del Lei', 'Nessun prezzo senza preventivo'],
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
      callback: 'Richieda una richiamata',
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

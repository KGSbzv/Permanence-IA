// Testi di interfaccia delle pagine commerciali: home, prezzi, piani, ricariche, settori,
// funzionalità, integrazioni. Le cifre (prezzi, minuti, giorni di prova) e il marchio
// arrivano come parametri dal mercato (src/i18n/markets.ts): non scriverli mai qui.
//
// I titoli con parola chiave evidenziata sono divisi in { before, kw, after }: `kw` è mostrato a colori.
import type { UI_COMMERCE as FR_UI_COMMERCE } from '../../fr/ui/commerce';

// SEO: parola chiave principale per pagina (vedi docs/seo/keywords-it.md). Chiave = nome italiano
// del settore o del modulo; se il nome manca, si usa il formato generico.
const SECTOR_SEO: Record<string, { title: string; description: (days: number, minutes: number) => string }> = {
  'E-commerce': { title: 'Assistenza clienti AI per e-commerce', description: (days) => `Assistenza clienti AI per negozi online: stato degli ordini, resi e domande sui prodotti gestiti a ogni ora, al telefono e via messaggio. Provi gratis ${days} giorni.` },
  'Broker assicurativi e mediatori creditizi': { title: 'Assistente telefonico AI per broker', description: (days) => `Assistente telefonico AI per broker e mediatori creditizi: preventivi richiamati subito, documenti sollecitati, appuntamenti fissati. Provi gratis ${days} giorni.` },
  'Gestione immobiliare e condomini': { title: 'Assistente AI per amministratori di immobili', description: (days) => `Assistente telefonico AI per gestione immobiliare e condomini: guasti degli inquilini smistati giorno e notte, visite qualificate. Provi gratis ${days} giorni.` },
  'Medicina e chirurgia estetica': { title: 'Segreteria AI per medicina estetica', description: (days) => `Segreteria telefonica AI per medicina estetica: consulenze prenotate, appuntamenti confermati il giorno prima, nessun consiglio medico. Provi gratis ${days} giorni.` },
  'Servizi a domicilio': {
    title: 'Assistente telefonico AI per artigiani',
    description: (days) => `Assistente telefonico AI per idraulici, elettricisti e tecnici: urgenze filtrate e richieste qualificate, anche fuori orario. Provi gratis ${days} giorni.`,
  },
  'Studi dentistici e cliniche': {
    title: 'Receptionist virtuale per studio dentistico',
    description: (days) => `Receptionist virtuale per studio dentistico: appuntamenti, conferme e spostamenti gestiti dall’AI senza interrompere le cure. Provi gratis ${days} giorni.`,
  },
  Immobiliare: {
    title: 'Centralino AI per agenzia immobiliare',
    description: (days) => `Centralino AI per agenzia immobiliare: acquirenti, venditori e inquilini qualificati mentre i Suoi agenti sono in visita. Provi gratis ${days} giorni.`,
  },
  'Officine e settore auto': {
    title: 'Prenotazione officina automatica 24/7',
    description: (days) => `Prenotazione officina al telefono, 24/7: l’agente AI fissa gli appuntamenti e prepara i preventivi senza disturbare il banco. Provi gratis ${days} giorni.`,
  },
  'Fisioterapia e professioni sanitarie': {
    title: 'Receptionist virtuale per fisioterapisti',
    description: (days) => `Receptionist virtuale per fisioterapisti, osteopati e studi sanitari: sedute prenotate e spostate durante il lavoro. Provi gratis ${days} giorni.`,
  },
  'Cliniche veterinarie': {
    title: 'Centralino AI per clinica veterinaria',
    description: (days) => `Centralino AI per clinica veterinaria: urgenze indirizzate secondo il Suo protocollo, visite prenotate, richiami vaccinali. Provi gratis ${days} giorni.`,
  },
  'Parrucchieri e barbieri': {
    title: 'Receptionist virtuale per parrucchieri',
    description: (days) => `Receptionist virtuale per parrucchieri e barbieri: l’agente AI prenota al telefono mentre Lei taglia. Provi gratis ${days} giorni.`,
  },
  'Estetica e benessere': {
    title: 'Prenotazioni per centro estetico e spa',
    description: (days) => `Prenotazioni telefoniche per centro estetico, spa e centro unghie: trattamenti prenotati mentre Lei è in cabina. Provi gratis ${days} giorni.`,
  },
  'Ristoranti e hotel': {
    title: 'Prenotazioni ristorante al telefono con l’AI',
    description: (days, minutes) => `Prenotazioni ristorante e hotel al telefono gestite dall’AI, senza interrompere il servizio. Provi gratis ${days} giorni, ${minutes} minuti inclusi.`,
  },
  'Avvocati e commercialisti': {
    title: 'Centralino AI per avvocati e commercialisti',
    description: (days) => `Centralino AI per studi legali e commercialisti: chiamate filtrate, nuove pratiche qualificate, consulenze fissate. Provi gratis ${days} giorni.`,
  },
};

/** Titolo dei vantaggi per settore («Cosa cambia per il Suo studio…»), con l’accordo corretto. */
const SECTOR_BENEFITS_TITLE: Record<string, string> = {
  immobilier: 'Cosa cambia per la Sua agenzia',
  'dentaire-cliniques': 'Cosa cambia per il Suo studio',
  'kines-paramedical': 'Cosa cambia per il Suo studio',
  'cliniques-veterinaires': 'Cosa cambia per la Sua clinica',
  automobile: 'Cosa cambia per la Sua officina',
  'salons-de-coiffure': 'Cosa cambia per il Suo salone',
  'beaute-bien-etre': 'Cosa cambia per il Suo centro',
  'restaurants-hotellerie': 'Cosa cambia per il Suo locale',
  'avocats-experts-comptables': 'Cosa cambia per il Suo studio',
  'e-commerce': 'Cosa cambia per il Suo negozio online',
  'courtiers-assurance-credit': 'Cosa cambia per la Sua agenzia',
  'gestion-locative': 'Cosa cambia per la Sua società di gestione',
  'medecine-esthetique': 'Cosa cambia per il Suo studio',
};

const FEATURE_SEO: Record<string, string> = {
  'Receptionist AI': 'Receptionist virtuale AI 24/7',
  'Demo dal vivo dell’agente': 'Demo dal vivo dell’assistente telefonico AI',
  'Gestione appuntamenti': 'Prenotazioni telefoniche automatiche con l’AI',
  'Assistenza clienti': 'Risponditore automatico AI per l’assistenza',
  'Qualificazione dei lead': 'Qualificazione dei lead al telefono con l’AI',
  'Campagne in uscita': 'Chiamate automatiche in uscita con l’AI',
  'WhatsApp e messaggi': 'Risposte automatiche su WhatsApp e SMS',
  'Base di conoscenza': 'Base di conoscenza per l’agente vocale AI',
  'Editor di prompt': 'Editor di prompt per l’agente vocale AI',
  'Scenari automatizzati': 'Scenari automatizzati senza codice',
  'SIP e numeri': 'Centralino virtuale: SIP e numeri',
  Report: 'Report e statistiche delle chiamate',
  'Widget web': 'Widget di richiamata per il sito web',
};

export const UI_COMMERCE: typeof FR_UI_COMMERCE = {
  home: {
    meta: {
      title: (brand: string) => `Assistente telefonico AI che risponde 24/7 · ${brand}`,
      description: (days: number, minutes: number) =>
        `Assistente telefonico AI che risponde, qualifica e prenota al posto Suo, 24/7. Provi gratis ${days} giorni con ${minutes} minuti inclusi, senza vincoli.`,
    },
    hero: {
      title: { before: 'Automatizzi le Sue chiamate con un’AI che ', kw: 'risponde, qualifica e prenota', after: ' al posto Suo' },
      intro: 'Un assistente telefonico AI che risponde a ogni chiamata, pone le domande giuste, fissa gli appuntamenti e Le invia un riepilogo chiaro. Disponibile 24/7, configurato per il Suo settore, operativo in pochi minuti.',
      photoAlt: 'Imprenditrice che consulta sul telefono il riepilogo di una chiamata',
    },
    showcase: { title: 'Veda l’agente all’opera nel Suo settore', intro: 'Scelga un settore: la receptionist virtuale risponde alla chiamata e la richiesta arriva pronta da gestire.' },
    benefits: { title: 'Cosa fa l’agente per la Sua azienda', intro: 'Un assistente telefonico intelligente, formato sulla Sua attività, che lavora quando il Suo team non può rispondere.' },
    features: {
      booking: {
        title: { before: 'Automatizzi ', kw: 'appuntamenti e promemoria', after: '' },
        text: 'Studi, saloni, officine, agenzie: prenotazioni telefoniche automatiche. L’agente si collega al Suo calendario, propone gli orari liberi, prenota e conferma. Spostamenti e disdette compresi.',
        points: ['Calendario in tempo reale: Google Calendar, Outlook… tramite Cal.com o Calendly', 'Conferma via SMS o WhatsApp (a partire dal piano Assistant)', 'Promemoria il giorno prima dell’appuntamento (a partire dal piano Assistant)'],
        link: 'Scopra la gestione appuntamenti',
      },
      support: {
        title: { before: 'Risponda alle ', kw: 'domande dei Suoi clienti', after: ' senza attese' },
        text: 'L’agente si basa sui Suoi documenti, sulle Sue pagine web e sulle Sue procedure. Risponde in modo corretto e trasferisce al Suo team ciò che richiede una persona.',
        points: ['Base di conoscenza: PDF, sito web, dati', 'Più chiamate contemporaneamente, senza code', 'Trasferimento a un operatore secondo le Sue regole'],
        link: 'Scopra l’assistenza clienti',
      },
      leads: {
        title: { before: 'Qualifichi e ', kw: 'richiami i Suoi potenziali clienti', after: ' più in fretta' },
        text: 'Un modulo compilato sul Suo sito diventa una chiamata in pochi minuti. L’agente qualifica, ricontatta e prepara una scheda che il Suo team può gestire subito.',
        points: ['Prequalificazione secondo i Suoi criteri', 'Ricontatti e conferme automatici', 'Campagne verso contatti che hanno dato il consenso'],
        link: 'Scopra la qualificazione dei lead',
      },
    },
    useCases: { title: 'Un agente per ogni tipo di chiamata', intro: 'In entrata, in uscita o messaggi: attivi gli utilizzi di cui la Sua attività ha bisogno.' },
    platform: {
      title: 'La piattaforma completa per automatizzare le Sue chiamate',
      intro: 'Più di un centralino virtuale: voce, intelligenza, telefonia, automazioni e report, tutto incluso in un unico spazio.',
      link: 'Tutte le funzionalità',
    },
    steps: {
      title: 'Operativo in quattro passi',
      intro: 'Non servono competenze tecniche. La accompagniamo in ogni fase.',
      items: (days: number, minutes: number) => [
        { title: 'Crei il Suo account', text: `Scelga il Suo piano: ${days} giorni gratuiti, ${minutes} minuti inclusi, nessun addebito durante la prova.` },
        { title: 'Descriva la Sua attività', text: 'Servizi, orari, domande frequenti, regole di trasferimento.' },
        { title: 'Provi l’agente', text: 'Lo ascolti nella demo dal vivo e regoli tono e risposte.' },
        { title: 'Colleghi le Sue chiamate', text: 'Deviazione della Sua linea, nuovo numero o SIP, e widget sul Suo sito.' },
      ],
    },
    sectors: {
      title: 'Agenti adatti al Suo settore',
      intro: 'Undici settori in cui ogni chiamata persa costa un cliente. Per ciascuno, l’agente pone le domande giuste.',
      link: 'Tutti i settori',
    },
    integrations: {
      title: 'Collegato ai Suoi strumenti',
      intro: 'Calendario, CRM, messaggistica, telefonia: l’agente si integra con ciò che usa già. Gli scenari automatizzati collegano oltre 300 strumenti senza codice, come Zapier o Make.',
      link: 'Veda tutte le integrazioni',
    },
    pricing: {
      title: 'Piani chiari, prezzi IVA esclusa',
      intro: 'Scelga in base al Suo volume di chiamate. Più grande è il piano, meno costa ogni minuto.',
      compare: 'Confronti tutte le funzioni incluse',
    },
    faq: {
      title: 'Domande frequenti',
      intro: 'Non trova la risposta? Lasci il Suo numero, un consulente La richiama.',
      link: 'Tutte le domande',
    },
  },

  tarifs: {
    meta: {
      title: (brand: string) => `Prezzi dell’assistente telefonico AI · ${brand}`,
      /** Un piano nella descrizione: `price` e `minutes` già formattati. */
      annualOffer: (name: string) => `${name} (fatturazione annuale)`,
      plan: (name: string, price: string, minutes: string) => `${name} ${price}/mese`,
      description: (plans: string[], days: number, minutes: number) =>
        `Assistente telefonico AI: ${plans.join(', ')}, IVA esclusa. Provi gratis ${days} giorni, ${minutes} min inclusi.`,
    },
    hero: {
      title: 'Scelga il piano adatto al Suo volume di chiamate',
      intro: (days: number, minutes: number) =>
        `Prezzi dell’assistente telefonico AI, tutti indicati IVA esclusa. Più grande è il piano, meno costa ogni minuto. La prova gratuita comprende ${days} giorni e ${minutes} minuti di chiamate inclusi.`,
      moreMinutes: 'Le servono più minuti? Aggiunga una ricarica in qualsiasi momento.',
    },
    matrix: {
      title: 'Cosa è incluso nella Sua area clienti',
      intro: 'Ogni riga corrisponde a una pagina o a una funzione che ritrova nella Sua area clienti. Nessuna funzione nascosta.',
    },
    recharges: {
      title: 'Le servono più minuti?',
      intro: 'La ricarica copre un mese più intenso. Per un volume regolare, il piano superiore resta la soluzione più conveniente.',
      link: 'Come funzionano le ricariche',
    },
    // Riquadro «Messaggi scritti»: costi ripresi dalla configurazione dei crediti dell’area clienti.
    messageCredits: {
      title: 'Messaggi scritti: prezzi in crediti',
      intro: 'Le risposte scritte dell’AI e i messaggi inviati (chat del sito, WhatsApp, Messenger, Instagram, SMS) vengono scalati dal Suo saldo di crediti messaggi.',
      usageCol: 'Utilizzo',
      costCol: 'Costo in crediti',
      rows: [
        { label: 'Risposta scritta dell’AI (chat del sito, WhatsApp, Messenger, Instagram)', cost: '3 crediti' },
        { label: 'Messaggio WhatsApp ricevuto o inviato in sessione', cost: '1,4 crediti' },
        { label: 'Messaggio modello WhatsApp (template)', cost: 'Tariffa di Meta in base al paese e alla categoria, maggiorata' },
        { label: 'SMS inviato', cost: '2 crediti' },
        { label: 'Chiamata WhatsApp', cost: 'Fatturata in minuti' },
      ],
      smsNote: 'Il costo di un SMS può variare in base all’operatore o al paese.',
      getTitle: 'Come ottenere crediti',
      included: 'Inclusi ogni mese nel Suo piano:',
      includedValue: (credits: string, replies: string) => `${credits} crediti / mese (≈ ${replies} risposte)`,
      notIncludedValue: 'Non inclusi: converta minuti',
      convert: 'Oppure converta minuti dalla Sua area clienti: 1 minuto = 9 crediti.',
      balance: 'Il saldo è consultabile nell’area clienti. A 0 crediti, le risposte scritte e gli invii di SMS o WhatsApp si interrompono fino alla ricarica.',
    },
    faq: {
      title: 'Domande sui prezzi',
      intro: 'Ha un dubbio sul piano giusto per Lei? Si faccia richiamare, oppure provi l’agente dal vivo.',
      primary: 'Inizi gratis',
      demo: 'Veda la demo dal vivo',
    },
    finalCta: (minutes: number) => `Inizi con ${minutes} minuti gratuiti`,
  },

  offer: {
    metaTitleTrial: (days: number, minutes: number, brand: string) => `Assistente AI gratis: ${days} giorni, ${minutes} minuti · ${brand}`,
    /** `monthly`: aggiunge «IVA esclusa / mese» quando il prezzo è un importo mensile. */
    metaTitle: (name: string, price: string, monthly: boolean, brand: string) => `Piano ${name} — ${price}${monthly ? ' IVA esclusa / mese' : ''} · ${brand}`,
    metaDescription: (title: string, days: number, minutes: number) => `${title}. Assistente telefonico AI, prova gratis ${days} giorni con ${minutes} min inclusi.`,
    breadcrumb: 'Prezzi',
    productName: (brand: string, name: string) => `${brand} ${name}`,
    eyebrow: (name: string, audience: string) => `Piano ${name} · ${audience}`,
    demo: 'Provi dal vivo il nostro agente',
    perMonth: 'IVA esclusa / mese',
    orAnnual: (price: string) => `oppure ${price} IVA esclusa / anno (2 mesi gratis)`,
    perMinuteLine: (perMinute: string) => `pari a ${perMinute} nel piano`,
    facts: {
      minutes: 'Minuti inclusi',
      more: 'Le serve di più?',
      moreCustom: 'Volume negoziato',
      moreDefault: 'Ricarica in qualsiasi momento',
      commitment: 'Vincolo',
      commitmentValue: 'Nessuno',
    },
    included: {
      title: 'Cosa trova nella Sua area clienti',
      intro: 'L’elenco esatto delle funzioni accessibili con questo piano.',
      notIncluded: 'Non incluso',
      includedLabel: 'Incluso',
      compare: 'Confronti con gli altri piani',
    },
    modules: { title: 'I moduli al centro di questo piano' },
    extra: {
      title: 'Minuti extra',
      intro: 'Un mese più intenso? Aggiunga una ricarica. Un volume in crescita? Passi al piano superiore.',
    },
    others: { title: 'Gli altri piani' },
    faq: { title: 'Domande frequenti' },
  },

  recharges: {
    meta: {
      title: (brand: string) => `Ricariche di credito per l’assistente AI · ${brand}`,
      description: (price: string, minutes: string) =>
        `Ricariche dell’importo che preferisce, ad esempio ${price} IVA esclusa per ${minutes} minuti extra del Suo assistente telefonico AI. Aggiunga minuti quando vuole o passi al piano superiore.`,
    },
    hero: {
      title: 'Aggiunga minuti in qualsiasi momento',
      intro: 'La ricarica copre un mese più intenso. Se ricarica spesso, il piano superiore diventa più conveniente: glielo segnaliamo.',
    },
    how: {
      title: 'Come funziona',
      steps: (min: string, max: string) => [
        { title: 'Monitori il Suo utilizzo', text: 'La Sua dashboard mostra i minuti utilizzati e quelli rimanenti.' },
        { title: 'Aggiunga credito', text: `L’importo che preferisce (ad esempio ${min}), con un clic dalla Sua area clienti (Add credits).` },
        { title: 'Continui senza interruzioni', text: 'Il credito paga i minuti oltre il piano e non scade.' },
      ],
    },
  },

  sectorsIndex: {
    meta: {
      title: (brand: string) => `Assistente telefonico AI per settore · ${brand}`,
      description: 'Assistente telefonico AI per artigiani, veterinari, agenzie, officine, parrucchieri, centri estetici, ristoranti, avvocati.',
    },
    hero: {
      title: 'Un agente vocale adatto alla Sua attività',
      intro: 'Un assistente telefonico AI configurato per il Suo mestiere. Abbiamo scelto undici settori in cui le chiamate arrivano quando il personale è occupato, e in cui ogni richiesta persa costa un cliente: dall’idraulico alla clinica veterinaria, dal parrucchiere allo studio legale, l’agente pone le domande giuste.',
    },
    other: {
      title: 'La Sua attività non è nell’elenco?',
      intro: 'Autoscuole, palestre, formazione, lavanderie, turismo: l’agente si configura per qualsiasi attività che riceve chiamate. Parliamo del Suo caso.',
      primary: 'Inizi gratis',
      demo: 'Provi dal vivo il nostro agente',
    },
  },

  sector: {
    meta: {
      title: (name: string, brand: string) => `${SECTOR_SEO[name]?.title ?? `${name}: agente vocale AI 24/7`} · ${brand}`,
      /** `short` è la frase breve del settore, senza punto finale. */
      description: (name: string, short: string, days: number, minutes: number) =>
        SECTOR_SEO[name]?.description(days, minutes) ?? `${name}: ${short}. Prova gratuita di ${days} giorni, ${minutes} minuti inclusi, prezzi IVA esclusa.`,
    },
    breadcrumb: 'Settori',
    liveCallTitle: (name: string) => `Agente per ${name.toLowerCase()}`,
    change: {
      title: 'Cosa cambia quando l’agente risponde al posto Suo',
      intro: (targets: string) => `${targets}. Nel Suo settore, ogni chiamata senza risposta è una richiesta che va altrove.`,
    },
    handles: {
      title: 'Cosa gestisce l’agente per la Sua attività',
      intro: 'Pone le domande che porrebbe Lei, in un ordine naturale, e Le invia una richiesta completa.',
    },
    /** Titolo dei vantaggi: il luogo di lavoro (agenzia, studio, salone…), «attività» di default. */
    benefitsTitle: (slug: string) => SECTOR_BENEFITS_TITLE[slug] ?? 'Cosa cambia per la Sua attività',
    how: { title: 'Come funziona' },
    includes: { title: 'Cosa include', intro: 'I moduli più utili per il Suo settore, tutti disponibili nella Sua area clienti.' },
    integrations: {
      title: 'Integrazioni utili',
      intro: 'Il Suo calendario, il Suo CRM, la Sua messaggistica e la Sua telefonia restano gli stessi: l’agente vi si collega.',
    },
    pricing: {
      title: 'Prezzi IVA esclusa, senza vincoli né costi di attivazione',
      intro: (sectorName: string, offerName: string, days: number, minutes: number) =>
        `Per il settore «${sectorName}» consigliamo il piano ${offerName}. Inizi con la prova gratuita: ${days} giorni e ${minutes} minuti inclusi.`,
      link: (offerName: string) => `Veda i dettagli del piano ${offerName}`,
    },
    faq: { title: (name: string) => `Domande frequenti — ${name}` },
    callback: {
      title: 'Ci contatti: lasci il Suo numero, La richiamiamo noi',
      text: 'Un consulente La richiama per valutare il Suo caso.',
    },
    others: { title: 'Altri settori' },
    finalCta: 'Pronto a non perdere più una chiamata?',
  },

  featuresIndex: {
    meta: {
      title: (brand: string) => `Funzionalità del centralino virtuale AI · ${brand}`,
      description: 'Centralino virtuale AI completo: receptionist virtuale, prenotazioni, assistenza, qualificazione, campagne, WhatsApp, SIP e report. Scopra i moduli.',
    },
    hero: {
      title: 'Tutto ciò che serve per automatizzare le Sue chiamate',
      intro: 'Il Suo centralino virtuale AI in quattordici moduli, attivati in base al Suo piano, dalla Sua area clienti.',
    },
    overview: { title: 'Panoramica' },
  },

  feature: {
    meta: {
      title: (name: string, brand: string) => `${FEATURE_SEO[name] ?? `${name} — agente vocale AI`} · ${brand}`,
      /** `short` è la frase sul vantaggio del modulo, senza punto finale. */
      description: (short: string, offerName: string, days: number) => `${short}. Incluso a partire dal piano ${offerName}. Prova gratuita di ${days} giorni.`,
    },
    breadcrumb: 'Funzionalità',
    eyebrow: (family: string, name: string) => `${family} · ${name}`,
    uses: { title: 'A cosa serve' },
    from: {
      title: (offerName: string) => `Incluso a partire dal piano ${offerName}`,
      /** `price` già formattato nella valuta del mercato. */
      priceLine: (price: string, minutes: string) => `${price} IVA esclusa / mese · ${minutes}`,
      offerLink: (offerName: string) => `Veda il piano ${offerName}`,
      compare: 'Confronti i piani',
    },
    how: { title: 'Come funziona' },
    cases: { title: 'Casi d’uso' },
    integrations: { title: 'Integrazioni collegate', link: 'Tutte le integrazioni' },
    more: { title: 'Scopra anche' },
  },

  integrations: {
    tools: { title: 'Oltre 300 strumenti con le automazioni', intro: 'Con la piattaforma di automazione (a partire dal piano Assistant), ogni chiamata può alimentare i Suoi strumenti: email, chat del team, CRM, negozio online, pagamenti, fogli di calcolo. Eccone alcuni.' },
    meta: {
      title: (brand: string) => `Integrazioni — calendario, CRM, WhatsApp, SIP · ${brand}`,
      description: 'Colleghi l’assistente telefonico AI a Google Calendar, Outlook, Cal.com, Calendly, HubSpot, Zoho, WhatsApp, SIP e oltre 300 strumenti senza codice.',
    },
    hero: {
      title: 'Collegato agli strumenti che usa già',
      intro: 'Calendario, CRM, messaggistica, telefonia: l’agente si integra nella Sua organizzazione, e gli scenari automatizzati collegano oltre 300 strumenti senza codice.',
    },
    flow: {
      title: { before: 'Costruisca le Sue automazioni ', kw: 'senza codice', after: '' },
      text: 'Un modulo compilato, una chiamata terminata, un nuovo lead: ogni evento può avviare una serie di azioni nei Suoi strumenti, come Zapier o Make, direttamente dalla Sua area clienti.',
      points: ['Oltre 300 strumenti disponibili', 'Drag and drop, nessuno sviluppo', 'Test prima dell’attivazione'],
      link: 'Scopra gli scenari automatizzati',
    },
    api: {
      title: { before: 'Webhook e API per ', kw: 'i Suoi sistemi', after: '' },
      text: 'Su tutti i piani, riceva nei Suoi sistemi i dati di ogni chiamata conclusa, oppure gestisca l’agente dal Suo software.',
      points: ['Webhook dopo ogni chiamata', 'Variabili estratte: esito, interesse, fascia oraria', 'Strumenti durante la chiamata, a partire dal piano Assistant'],
    },
  },
};

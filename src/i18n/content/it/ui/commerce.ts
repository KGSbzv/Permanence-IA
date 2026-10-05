// Testi di interfaccia delle pagine commerciali: home, prezzi, piani, ricariche, settori,
// funzionalità, integrazioni. Le cifre (prezzi, minuti, giorni di prova) e il marchio
// arrivano come parametri dal mercato (src/i18n/markets.ts): non scriverli mai qui.
//
// I titoli con parola chiave evidenziata sono divisi in { before, kw, after }: `kw` è mostrato a colori.
import type { UI_COMMERCE as FR_UI_COMMERCE } from '../../fr/ui/commerce';

export const UI_COMMERCE: typeof FR_UI_COMMERCE = {
  home: {
    meta: {
      title: (brand: string) => `${brand} — Agenti vocali AI 24/7 per le Sue chiamate`,
      description: (days: number, minutes: number) =>
        `Automatizzi le Sue chiamate con un’AI che risponde, qualifica e prenota al posto Suo. ${days} giorni di prova gratuita, ${minutes} minuti inclusi, prezzi IVA esclusa, senza vincoli.`,
    },
    hero: {
      title: { before: 'Automatizzi le Sue chiamate con un’AI che ', kw: 'risponde, qualifica e prenota', after: ' al posto Suo' },
      intro: 'Agenti vocali che rispondono a ogni chiamata, pongono le domande giuste, fissano gli appuntamenti e Le inviano un riepilogo chiaro. Disponibili 24/7, configurati per il Suo settore, operativi in pochi minuti.',
      photoAlt: 'Imprenditrice che consulta sul telefono il riepilogo di una chiamata',
    },
    showcase: { title: 'Veda l’agente all’opera nel Suo settore', intro: 'Scelga un settore: la chiamata si svolge e la richiesta arriva pronta da gestire.' },
    benefits: { title: 'Cosa fa l’agente per la Sua azienda', intro: 'Un agente vocale formato sulla Sua attività, che lavora quando il Suo team non può rispondere.' },
    features: {
      booking: {
        title: { before: 'Automatizzi ', kw: 'appuntamenti e promemoria', after: '' },
        text: 'Studi, saloni, officine, agenzie: l’agente si collega al Suo calendario, propone gli orari liberi, prenota e conferma. Spostamenti e disdette compresi.',
        points: ['Calendario in tempo reale: Google, Outlook, Cal.com, Calendly', 'Conferma via SMS o WhatsApp', 'Promemoria il giorno prima dell’appuntamento'],
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
      intro: 'Tutto incluso: voce, intelligenza, telefonia, automazioni e report, in un unico spazio.',
      link: 'Tutte le funzionalità',
    },
    steps: {
      title: 'Operativo in quattro passi',
      intro: 'Non servono competenze tecniche. La accompagniamo in ogni fase.',
      items: (days: number, minutes: number) => [
        { title: 'Crei il Suo account', text: `Scelga il Suo piano: ${days} giorni gratuiti, ${minutes} minuti inclusi, nessun addebito durante la prova.` },
        { title: 'Descriva la Sua attività', text: 'Servizi, orari, domande frequenti, regole di trasferimento.' },
        { title: 'Provi l’agente', text: 'Lo ascolti nella demo dal vivo e regoli tono e risposte.' },
        { title: 'Colleghi le Sue chiamate', text: 'Inoltro della Sua linea, nuovo numero o SIP, e widget sul Suo sito.' },
      ],
    },
    sectors: {
      title: 'Agenti adatti al Suo settore',
      intro: 'Sei settori in cui ogni chiamata persa costa un cliente. Per ciascuno, l’agente pone le domande giuste.',
      link: 'Tutti i settori',
    },
    integrations: {
      title: 'Collegato ai Suoi strumenti',
      intro: 'Calendario, CRM, messaggistica, telefonia: l’agente si integra con ciò che usa già. Il flow builder collega oltre 300 strumenti senza codice, come Zapier o Make.',
      link: 'Veda tutte le integrazioni',
    },
    pricing: {
      title: 'Piani chiari, prezzi IVA esclusa',
      intro: 'Scelga in base al Suo volume di chiamate. Più il piano è grande, meno costa il minuto.',
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
      title: (brand: string) => `Prezzi — piani IVA esclusa e ricariche · ${brand}`,
      /** Un piano nella descrizione: `price` e `minutes` già formattati. */
      plan: (name: string, price: string, minutes: string) => `${name} ${price} IVA esclusa / ${minutes} min`,
      description: (plans: string[], days: number, minutes: number) =>
        `${plans.join(', ')}. Prova gratuita di ${days} giorni, ${minutes} minuti inclusi.`,
    },
    hero: {
      title: 'Scelga il piano adatto al Suo volume di chiamate',
      intro: (days: number, minutes: number) =>
        `Tutti i prezzi sono indicati IVA esclusa. Più il piano è grande, meno costa il minuto. La prova gratuita comprende ${days} giorni e ${minutes} minuti di chiamate inclusi.`,
      moreMinutes: 'Le servono più minuti? Aggiunga una ricarica in qualsiasi momento.',
    },
    matrix: {
      title: 'Cosa è incluso nella Sua area clienti',
      intro: 'Ogni riga corrisponde a una pagina o a una funzione che ritrova nella Sua area clienti. Nient’altro è nascosto dietro un pulsante.',
    },
    recharges: {
      title: 'Le servono più minuti?',
      intro: 'La ricarica copre un mese più intenso. Per un volume regolare, il piano superiore resta la soluzione più conveniente.',
      link: 'Come funzionano le ricariche',
    },
    faq: {
      title: 'Domande sui prezzi',
      intro: 'Ha un dubbio sul piano giusto per Lei? Si faccia richiamare, oppure provi l’agente dal vivo.',
      primary: 'Inizi gratuitamente',
      demo: 'Veda la demo dal vivo',
    },
    finalCta: (minutes: number) => `Inizi con ${minutes} minuti gratuiti`,
  },

  offer: {
    metaTitleTrial: (days: number, minutes: number, brand: string) => `Prova gratuita di ${days} giorni — ${minutes} minuti · ${brand}`,
    /** `monthly`: aggiunge «IVA esclusa / mese» quando il prezzo è un importo mensile. */
    metaTitle: (name: string, price: string, monthly: boolean, brand: string) => `Piano ${name} — ${price}${monthly ? ' IVA esclusa / mese' : ''} · ${brand}`,
    metaDescription: (title: string, days: number, minutes: number) => `${title}. Prova gratuita di ${days} giorni, ${minutes} minuti inclusi, prezzi IVA esclusa.`,
    breadcrumb: 'Prezzi',
    productName: (brand: string, name: string) => `${brand} ${name}`,
    eyebrow: (name: string, audience: string) => `Piano ${name} · ${audience}`,
    demo: 'Provi dal vivo il nostro agente',
    perMonth: 'IVA esclusa / mese',
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
      title: (brand: string) => `Ricariche di minuti — ${brand}`,
      description: (price: string, minutes: string) =>
        `Ricariche di credito da ${price} IVA esclusa per ${minutes} minuti extra. Aggiunga minuti in qualsiasi momento; passi al piano superiore quando il Suo volume cresce.`,
    },
    hero: {
      title: 'Aggiunga minuti in qualsiasi momento',
      intro: 'La ricarica copre un mese più intenso. Se ricarica spesso, il piano superiore diventa più conveniente: glielo segnaliamo.',
    },
    how: {
      title: 'Come funziona',
      steps: (min: string, max: string) => [
        { title: 'Monitori il Suo utilizzo', text: 'La Sua dashboard mostra i minuti utilizzati e quelli rimanenti.' },
        { title: 'Aggiunga credito', text: `Una ricarica da ${min} a ${max}, con un clic dalla Sua area clienti.` },
        { title: 'Continui senza interruzioni', text: 'Il credito paga i minuti oltre il piano e non scade.' },
      ],
    },
  },

  sectorsIndex: {
    meta: {
      title: (brand: string) => `Settori — agenti vocali AI per ogni attività · ${brand}`,
      description: 'Servizi a domicilio, studi dentistici e cliniche, immobiliare, officine, bellezza, ristoranti e hotel: un agente vocale AI adatto a ogni attività.',
    },
    hero: {
      title: 'Un agente vocale adatto alla Sua attività',
      intro: 'Abbiamo scelto sei settori in cui le chiamate arrivano quando il personale è occupato, e in cui ogni richiesta persa costa un cliente.',
    },
    other: {
      title: 'La Sua attività non è nell’elenco?',
      intro: 'Studi legali, e-commerce, selezione del personale, turismo: l’agente si configura per qualsiasi attività che riceve chiamate. Parliamo del Suo caso.',
      primary: 'Inizi gratuitamente',
      demo: 'Provi dal vivo il nostro agente',
    },
  },

  sector: {
    meta: {
      title: (name: string, brand: string) => `${name}: agente vocale AI 24/7 — ${brand}`,
      /** `short` è la frase breve del settore, senza punto finale. */
      description: (name: string, short: string, days: number, minutes: number) =>
        `${name}: ${short}. Prova gratuita di ${days} giorni, ${minutes} minuti inclusi, prezzi IVA esclusa.`,
    },
    breadcrumb: 'Settori',
    liveCallTitle: (name: string) => `Agente ${name.toLowerCase()}`,
    change: {
      title: 'Cosa cambia quando l’agente risponde al posto Suo',
      intro: (targets: string) => `${targets}. Nel Suo settore, ogni chiamata senza risposta è una richiesta che va altrove.`,
    },
    handles: {
      title: 'Cosa gestisce l’agente per la Sua attività',
      intro: 'Pone le domande che porrebbe Lei, in un ordine naturale, e Le invia una richiesta completa.',
    },
    /** Titolo dei vantaggi: «agenzia» per l’immobiliare, «attività» altrove. */
    benefitsTitle: (slug: string) => `Cosa cambia per la Sua ${slug === 'immobilier' ? 'agenzia' : 'attività'}`,
    how: { title: 'Come funziona' },
    includes: { title: 'Cosa include', intro: 'I moduli più utili per il Suo settore, tutti disponibili nella Sua area clienti.' },
    integrations: {
      title: 'Integrazioni utili',
      intro: 'Il Suo calendario, il Suo CRM, la Sua messaggistica e la Sua telefonia restano gli stessi: l’agente vi si collega.',
    },
    pricing: {
      title: 'Prezzi IVA esclusa, senza vincoli',
      intro: (sectorName: string, offerName: string, days: number, minutes: number) =>
        `Per il settore ${sectorName.toLowerCase()}, consigliamo il piano ${offerName}. Inizi con la prova gratuita: ${days} giorni e ${minutes} minuti inclusi.`,
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
      title: (brand: string) => `Funzionalità — piattaforma di chiamate AI · ${brand}`,
      description: 'Receptionist AI, gestione appuntamenti, assistenza, qualificazione, campagne, WhatsApp, base di conoscenza, flow builder, SIP, report e widget web.',
    },
    hero: {
      title: 'Tutto ciò che serve per automatizzare le Sue chiamate',
      intro: 'Tredici moduli, attivati in base al Suo piano, dalla Sua area clienti.',
    },
    overview: { title: 'Panoramica' },
  },

  feature: {
    meta: {
      title: (name: string, brand: string) => `${name} — agente vocale AI | ${brand}`,
      /** `short` è la frase sul vantaggio del modulo, senza punto finale. */
      description: (short: string, offerName: string, days: number) => `${short}. Incluso dal piano ${offerName}. Prova gratuita di ${days} giorni.`,
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
    meta: {
      title: (brand: string) => `Integrazioni — calendario, CRM, WhatsApp, SIP · ${brand}`,
      description: 'Colleghi l’agente vocale AI a Google Calendar, Outlook, Cal.com, Calendly, HubSpot, Zoho, WhatsApp, Instagram, SIP e oltre 300 strumenti senza codice.',
    },
    hero: {
      title: 'Collegato agli strumenti che usa già',
      intro: 'Calendario, CRM, messaggistica, telefonia: l’agente si integra nella Sua organizzazione, e il flow builder collega oltre 300 strumenti senza codice.',
    },
    flow: {
      title: { before: 'Costruisca le Sue automazioni ', kw: 'senza codice', after: '' },
      text: 'Un modulo compilato, una chiamata terminata, un nuovo lead: ogni evento può avviare una serie di azioni nei Suoi strumenti, come in Zapier o Make, direttamente dalla Sua area clienti.',
      points: ['Oltre 300 strumenti disponibili', 'Drag and drop, nessuno sviluppo', 'Test prima dell’attivazione'],
      link: 'Scopra il flow builder',
    },
    api: {
      title: { before: 'Webhook e API per ', kw: 'i Suoi sistemi', after: '' },
      text: 'Con il piano Call Center, riceva ogni fine chiamata e i relativi dati estratti nei Suoi sistemi, oppure gestisca l’agente dal Suo software.',
      points: ['Webhook dopo ogni chiamata', 'Variabili estratte: esito, interesse, fascia oraria', 'Strumenti MCP per i Suoi assistenti'],
    },
  },
};

// Testi di interfaccia delle pagine non commerciali (demo, contatti, FAQ, prova, guida, chi siamo, sicurezza,
// 404, pagine legali, blog). Le variabili (marchio, società, email, durata della prova…) sono passate
// tramite funzioni: il marchio arriva dal mercato, la società e l’email da SITE.
import type { ChatLine, LegalSection, LegalVars, Rich, UI_PAGES as FR_UI_PAGES } from '../../fr/ui/pages';

export type { Block, ChatLine, LegalSection, LegalVars, Rich, Span } from '../../fr/ui/pages';

const ADDRESS = '1603 Capitol Ave Suite 413G-2408, Cheyenne, WY 82001';

export const UI_PAGES: typeof FR_UI_PAGES = {
  demo: {
    meta: {
      title: (brand: string) => `Demo gratuita dell’assistente telefonico AI · ${brand}`,
      description: 'Provi dal vivo il nostro assistente telefonico AI: ci parli o riceva una chiamata dimostrativa adatta al Suo settore. Gratuita e senza impegno.',
    },
    h1: 'Provi subito dal vivo il nostro assistente telefonico AI',
    intro: 'Lasci il Suo numero e scelga il Suo settore: la receptionist virtuale La chiama e simula uno scenario della Sua attività. Sente la sua voce, il suo ritmo e il modo in cui qualifica una richiesta.',
    widgetHint: 'Preferisce provare subito? Clicchi sulla bolla in basso a destra dello schermo: la nostra assistente Le risponde a voce o per iscritto.',
    formTitle: 'Richieda la chiamata dimostrativa',
    formIntro: 'Chiamata gratuita, nella fascia oraria che preferisce.',
    submit: 'Richieda la chiamata demo',
    hearTitle: 'Cosa ascolterà',
    hearIntro: 'Un esempio di chiamata a un idraulico: l’agente riconosce l’urgenza, organizza l’intervento e prepara la scheda per il team.',
    steps: [
      { title: 'Lasci il Suo numero', text: 'Con il Suo settore e la fascia oraria preferita.' },
      { title: 'L’agente La chiama', text: 'Simula uno scenario della Sua attività.' },
      { title: 'Provi liberamente', text: 'Faccia domande, cambi idea, lo interrompa.' },
    ],
    liveCallTitle: 'Agente per idraulico',
    scenariosTitle: 'Scelga il Suo scenario',
  },

  contact: {
    meta: {
      title: (brand: string) => `Contatti: La richiamiamo noi · ${brand}`,
      description: 'Ha domande sull’assistente telefonico AI? Lasci il Suo numero, La richiamiamo noi: richiamata commerciale, demo o assistenza, nella fascia oraria scelta.',
    },
    h1: 'Lasci il Suo numero, La richiamiamo noi',
    intro: 'Nessuna linea telefonica in Italia: siamo noi a richiamarLa, nella fascia oraria che sceglie. Può anche scriverci su WhatsApp o via email.',
    commercialTitle: 'Richiamata commerciale',
    commercialText: 'Domande sui piani, dimostrazione, preventivo su misura.',
    supportTitle: 'Richiamata assistenza',
    supportText: 'Clienti: configurazione, numeri, integrazioni.',
    emailTitle: 'Email',
    legal: (brand: string, company: string) => `${brand} è un marchio di ${company}, ${ADDRESS}, Stati Uniti.`,
    tabsLabel: 'Tipo di richiesta',
    tabCommercial: 'Commerciale e demo',
    tabSupport: 'Assistenza clienti',
  },

  faq: {
    meta: {
      title: (brand: string) => `Domande frequenti: assistente telefonico AI · ${brand}`,
      description: (brand: string) => `Funzionamento, centralino e SIP, calendario, WhatsApp, GDPR, prova e prezzi: tutte le risposte sull’assistente telefonico AI ${brand}.`,
    },
    h1: 'Domande frequenti',
    intro: 'Tutto sull’assistente telefonico AI, dal centralino virtuale alle prenotazioni automatiche. Non trova la risposta? Lasci il Suo numero, un consulente La richiama.',
    general: 'La piattaforma',
    pricing: 'Prezzi e prova',
  },

  trial: {
    meta: {
      title: (days: number, minutes: number, brand: string) => `Assistente telefonico AI gratis per ${days} giorni · ${brand}`,
      description: (days: number, minutes: number, brand: string) => `Provi gratis l’assistente telefonico AI ${brand}: ${days} giorni, ${minutes} minuti inclusi, nessun addebito durante la prova. Crei il Suo account.`,
    },
    h1: (minutes: number) => `Richieda i Suoi ${minutes} minuti gratuiti`,
    intro: (days: number) => `Crei il Suo account, scelga il piano da provare e metta alla prova il Suo assistente telefonico AI nella Sua attività per ${days} giorni.`,
    points: (days: number) => [
      `Carta richiesta all’attivazione, nessun addebito per ${days} giorni`,
      'Se disdice dalla Sua area clienti prima della fine della prova, non paga nulla',
      'Demo dal vivo e widget web inclusi',
      'Supporto per la prima configurazione',
    ],
    createTitle: 'Crei il Suo account',
    createSteps: [
      '1. Crei il Suo account con la Sua email aziendale.',
      '2. Scelga il piano da provare nella Sua area clienti.',
      '3. Configuri il Suo agente ed effettui le prime chiamate.',
    ],
    createCta: 'Crei il Suo account gratuito',
    already: 'È già cliente?',
    login: 'Accedi',
    sentTitle: 'La Sua richiesta è stata registrata',
    sentText: 'Un consulente La richiama per configurare con Lei il Suo primo agente.',
    sentCta: 'Crei subito il Suo account gratuito',
    formTitle: 'Preferisce farsi guidare da un consulente?',
    formIntro: 'Lasci i Suoi recapiti: un consulente La richiama per avviare la prova insieme a Lei.',
    name: 'Nome e cognome',
    company: 'Azienda',
    email: 'Email aziendale',
    phone: 'Telefono',
    sector: 'Settore',
    sectorPlaceholder: 'Selezioni…',
    sectorOther: 'Altra attività',
    plan: 'Piano desiderato',
    planPrice: (price: string) => ` — ${price} al mese, IVA esclusa`,
    planFree: ' — gratuito',
    planQuote: ' — su preventivo',
    terms: [
      'Accetto i ',
      { a: 'termini e le condizioni', href: '/cgu' },
      ', dichiaro di aver letto l’',
      { a: 'informativa sulla privacy', href: '/confidentialite' },
      ' e acconsento a essere richiamato per l’attivazione del mio account.',
    ] as Rich,
    termsRequired: 'Accetti le condizioni per essere richiamato.',
    sendError: 'Non è stato possibile inviare la richiesta. Riprovi tra qualche istante.',
    sending: 'Invio…',
    submit: 'Richieda una richiamata',
  },

  help: {
    meta: {
      title: (brand: string) => `Guida all’area clienti — ${brand}`,
      description: 'Guida in italiano alla Sua area clienti: traduzione dei menu, creazione di un agente, numeri, calendario, widget, minuti e fatturazione.',
    },
    breadcrumb: 'Guida',
    h1: 'Guida alla Sua area clienti',
    intro: 'La Sua area clienti è in inglese. Questa guida traduce ogni menu e La accompagna passo passo. All’interno dell’area clienti, anche l’assistente di supporto (bolla in basso a destra) risponde nella Sua lingua, italiano compreso, per iscritto o a voce.',
    openSpace: 'Apra la Sua area clienti',
    chatLabel: 'Esempio di conversazione con l’assistente di supporto',
    chatTitle: (brand: string) => `Aiuto ${brand}`,
    chatMode: 'Nella Sua lingua · per iscritto o a voce',
    chat: [
      { me: true, text: 'Dove aggiungo dei minuti?' },
      { text: ['In alto a destra, apra il menu del Suo profilo e clicchi su ', { b: 'Add credits' }, ' (aggiungi credito). Scelga una ricarica: il credito non scade.'] },
      { me: true, text: 'E per mettere l’agente sul mio sito?' },
      { text: ['Apra il Suo agente in ', { b: 'Assistants' }, ', sezione ', { b: 'Web widget' }, ' (widget web): lo attivi, poi copi il codice fornito. Vuole che lo facciamo insieme?'] },
    ] as ChatLine[],
    tasksTitle: 'Le operazioni più comuni, passo passo',
    menuTitle: 'I menu dell’area clienti, tradotti',
    colMenu: 'Menu (inglese)',
    colLabel: 'In italiano',
    colText: 'A cosa serve',
    glossaryTitle: 'Piccolo glossario',
    moreBefore: 'Non trova la risposta che cerca? Scriva a ',
    moreAfter: ' oppure richieda una richiamata dalla pagina contatti.',
  },

  about: {
    meta: {
      title: (brand: string) => `Chi siamo: l’assistente telefonico AI per PMI · ${brand}`,
      description: (brand: string, company: string) => `${brand} aiuta le piccole imprese a rispondere a ogni chiamata con un assistente telefonico AI. Un marchio di ${company}.`,
    },
    h1: 'Ogni chiamata merita una risposta',
    intro: (brand: string) => `${brand} nasce da una constatazione semplice: le piccole imprese perdono clienti perché nessuno può rispondere al momento giusto.`,
    photoAlt: 'Un’imprenditrice consulta il telefono nel suo ufficio',
    paragraphs: [
      'Artigiani, studi professionali, agenzie, officine, parrucchieri e centri estetici, ristoranti: i Suoi collaboratori sono impegnati a servire i clienti. Nel frattempo, il telefono squilla.',
      'Mettiamo a Sua disposizione un assistente telefonico AI: agenti vocali che rispondono, qualificano, prenotano e richiamano, configurati per il Suo settore, con prezzi chiari e senza vincoli.',
    ],
    principlesTitle: 'I nostri principi',
    principles: [
      'L’agente si presenta in modo trasparente come un’AI',
      'Le persone mantengono il controllo sui casi importanti',
      'Prezzi IVA esclusa ben visibili, senza costi nascosti',
      'Nessun numero né promessa che non possiamo dimostrare',
    ],
    legal: (brand: string, company: string) => `${brand} è un marchio di ${company}, società registrata nello Stato del Wyoming (Stati Uniti) con il numero 2026-001905061.`,
  },

  security: {
    meta: {
      title: (brand: string) => `Sicurezza e GDPR dell’assistente telefonico AI · ${brand}`,
      description: (brand: string) => `Consenso, opt-out, crittografia in transito e conservazione configurabile: come l’assistente AI ${brand} protegge i dati delle Sue chiamate.`,
    },
    h1: 'Sicurezza e conformità delle Sue chiamate AI',
    intro: 'Le chiamate gestite dal Suo assistente telefonico AI contengono dati personali. Ecco le protezioni attive e le impostazioni a Sua disposizione per rispettare il GDPR.',
    settingsTitle: 'Le Sue impostazioni',
    settings: [
      'Periodo di conservazione di registrazioni e trascrizioni',
      'Cancellazione di una chiamata o di un contatto su richiesta',
      'Lista di esclusione per le chiamate in uscita',
      'Fasce orarie di chiamata consentite',
      'Avviso «assistente AI» all’inizio della chiamata, sempre attivo (formulazione personalizzabile)',
      'Registrazione attivabile o meno, annunciata al chiamante all’inizio della chiamata',
      'Parole o argomenti che l’agente non deve mai affrontare (importi di preventivo, diagnosi, consulenze)',
    ],
    infraTitle: 'Una soluzione costruita su un’infrastruttura certificata',
    infraIntro: 'La nostra soluzione (agenti, richiamate programmate, instradamento, sito e area clienti) funziona sull’infrastruttura di un fornitore tecnico certificato. Le certificazioni sono del fornitore; lo abbiamo scelto per offrirLe lo stesso livello di rigore.',
    infraItems: ['Fornitore certificato ISO/IEC 27001:2022 (sicurezza delle informazioni) e ISO 9001:2015 (qualità)', 'Crittografia AES-256 dei dati a riposo e TLS in transito', 'Accessi per ruolo, autenticazione a due fattori e registri di audit', 'Backup automatici e disaster recovery su più zone', 'Conformità al GDPR, conservazione configurabile e cancellazione automatica', 'Pagamenti gestiti da Stripe, certificato PCI DSS livello 1'],
    // Badges neutres (icône + libellé, sans logo ISO ni d’organisme certificateur) ; l’id choisit l’icône.
    badges: [{ id: 'iso27001', label: 'ISO/IEC 27001:2022 (fornitore)' }, { id: 'iso9001', label: 'ISO 9001:2015 (fornitore)' }, { id: 'encryption', label: 'TLS + AES-256' }, { id: 'gdpr', label: 'Strumenti GDPR' }, { id: 'pci', label: 'Stripe PCI DSS livello 1' }] as { id: 'iso27001' | 'iso9001' | 'encryption' | 'gdpr' | 'pci'; label: string }[],
    badgesNote: 'Le certificazioni ISO sono del nostro fornitore tecnico; la certificazione PCI DSS è di Stripe.',
    commitmentsTitle: 'I nostri impegni',
    commitments: [
      'L’agente si presenta come un’AI e non si fa passare per una persona',
      'Le Sue campagne devono chiamare solo i contatti che hanno dato il consenso; una lista di esclusione integrata filtra gli altri',
      'Nessuna diagnosi medica, legale o finanziaria da parte dell’agente',
      'I Suoi dati non vengono mai venduti: sono utilizzati per fornire e migliorare il servizio',
      'Supporto per adattare le Sue informative',
      'Accordo sul trattamento dei dati (DPA) integrato nelle Condizioni (articolo 8); versione firmata su richiesta',
      'Diritto alla cancellazione: una chiamata, la sua registrazione e la sua trascrizione vengono eliminate su richiesta',
      'L’agente annuncia la registrazione della chiamata; chi non desidera essere registrato può chiederlo all’inizio della chiamata o scriverci',
      'Campagne in uscita: Lei conserva la prova della base giuridica (consenso o rapporto con il cliente, nei limiti di legge) e chiama solo i clienti che hanno accettato di essere contattati; in Italia rispetta anche il Registro pubblico delle opposizioni, esteso ai numeri di cellulare',
    ],
    rights: ['Per qualsiasi domanda o richiesta di esercizio dei diritti: ', { a: 'informativa sulla privacy', href: '/confidentialite' }, '.'] as Rich,
  },

  accessibility: {
    meta: {
      title: (brand: string) => `Dichiarazione di accessibilità — ${brand}`,
      description: (brand: string) => `Livello di accessibilità del sito ${brand}, interventi realizzati, limiti noti e contatto per segnalare una difficoltà.`,
    },
    h1: 'Dichiarazione di accessibilità',
    updated: 'Ultimo aggiornamento: 7 ottobre 2026',
    intro: (brand: string, company: string) => `${brand} è un servizio di ${company}, società registrata nello Stato del Wyoming (Stati Uniti). Vogliamo che tutti possano usare questo sito, comprese le persone con disabilità.`,
    sections: [
      { title: 'Livello di riferimento', items: ['Il sito punta alla conformità al livello AA delle linee guida WCAG 2.1, in linea con gli obiettivi generali dell’Atto europeo sull’accessibilità (European Accessibility Act).', 'Stato: parzialmente conforme. I punti non conformi noti sono elencati più sotto e sono in corso di correzione.'] },
      { title: 'Interventi realizzati', items: ['Lingua e direzione di lettura dichiarate in ogni pagina (compreso l’ebraico, da destra a sinistra).', 'Navigazione completa da tastiera, link per passare direttamente al contenuto, focus visibile.', 'Titoli gerarchici, testi alternativi per le immagini informative, moduli etichettati.', 'Contrasti rafforzati, testo ingrandibile fino al 200% senza perdita di informazioni, impaginazione adatta al mobile.', 'Animazioni ridotte quando il sistema lo richiede (preferenza «riduci movimento»).'] },
      { title: 'Limiti noti', items: ['La finestra di chat e della demo vocale è fornita dal nostro fornitore tecnico: la sua accessibilità da tastiera e con lettori di schermo può essere incompleta. Il modulo di richiamata e l’indirizzo email restano sempre disponibili.', 'L’area clienti (app.permanenceia.com) è in inglese e si basa sulla piattaforma del nostro fornitore.', 'Alcuni documenti PDF (presentazione commerciale) non sono completamente strutturati.'] },
      { title: 'Valutazione', items: ['Valutazione interna effettuata il 7 ottobre 2026 su tutte le pagine pubbliche, con strumenti automatici e verifica manuale (tastiera, contrasti, lettore di schermo).'] },
    ],
    contactTitle: 'Segnalare una difficoltà',
    contact: (company: string, email: string) => `Referente per l’accessibilità: ${company}. Ci scriva a ${email} descrivendo la pagina e la difficoltà incontrata: rispondiamo entro 5 giorni lavorativi e Le proponiamo una soluzione adeguata (informazioni in un altro formato, assistenza via email o per telefono).`,
  },

  notFound: {
    meta: {
      title: (brand: string) => `Pagina non trovata — ${brand}`,
      description: 'Questa pagina non esiste o è stata spostata.',
    },
    h1: 'Questa pagina non esiste o è stata spostata',
    text: 'Torni alla home o consulti i nostri piani.',
    home: 'Torni alla home',
    pricing: 'Veda i prezzi',
  },

  terms: {
    meta: {
      title: (brand: string) => `Termini e condizioni generali — ${brand}`,
      description: (brand: string) => `Consulti le condizioni generali di utilizzo e di vendita applicabili ai piani e ai servizi di centralino telefonico AI ${brand}.`,
    },
    h1: 'Condizioni generali di utilizzo e di vendita',
    updated: 'Applicabili a professionisti e aziende • Ultimo aggiornamento: 7 ottobre 2026',
    sections: ({ brand, company, email, appHost, legal }: LegalVars): LegalSection[] => {
      const mail = { a: email, href: `mailto:${email}` };
      return [
        {
          title: 'Articolo 1 — Definizioni e accettazione',
          body: [
            { p: ['Le presenti condizioni generali di utilizzo e di vendita (le «Condizioni») disciplinano l’accesso e l’utilizzo dei servizi commercializzati con il marchio ', { strong: brand }, ` da ${company}, Limited Liability Company costituita nello Stato del Wyoming (Stati Uniti), con sede in ${ADDRESS} («noi»).`] },
            {
              ul: [
                [{ strong: 'Servizio:' }, ` la piattaforma software, l’area clienti ${appHost}, gli agenti vocali e conversazionali di intelligenza artificiale, il widget web, la messaggistica (WhatsApp, SMS, Messenger, Instagram), le campagne, le automazioni, i numeri di telefono, la connessione SIP e ogni funzionalità collegata.`],
                [{ strong: 'Cliente:' }, ' l’azienda o il professionista che crea un account o sottoscrive un piano.'],
                [{ strong: 'Utente:' }, ' qualsiasi persona autorizzata dal Cliente ad accedere al suo account.'],
                [{ strong: 'Contenuti del Cliente:' }, ' i dati, le istruzioni (prompt), le basi di conoscenza, i file, i campioni vocali, le liste di contatti, le registrazioni e i messaggi forniti al Servizio o generati per conto del Cliente.'],
                [{ strong: 'Destinatari:' }, ' le persone che chiamano l’agente del Cliente, o che sono chiamate o ricevono messaggi tramite esso.'],
                [{ strong: 'Crediti:' }, ' minuti, crediti messaggi e ricariche prepagati.'],
              ],
            },
            { p: 'Il Servizio è riservato ai professionisti che agiscono per scopi professionali; non è offerto ai consumatori. Creando un account, spuntando la casella di accettazione o utilizzando il Servizio, il Cliente accetta le Condizioni. La persona che le accetta dichiara di avere almeno 18 anni e di essere autorizzata a impegnare l’ente che rappresenta.' },
          ],
        },
        {
          title: 'Articolo 2 — Account e sicurezza',
          body: [
            {
              ul: [
                'Il Cliente fornisce informazioni esatte e complete (denominazione, dati di registrazione, recapiti) e le mantiene aggiornate.',
                'Mantiene riservate le proprie credenziali e chiavi API, attiva le protezioni disponibili (tra cui l’autenticazione a due fattori) e risponde di ogni attività svolta tramite il suo account, anche da parte dei suoi Utenti, come se fosse propria.',
                ['Ci segnala senza ritardo, all’indirizzo ', mail, ', qualsiasi accesso non autorizzato o sospetto incidente di sicurezza.'],
                'Possiamo richiedere documenti che attestino identità, indirizzo o attività (in particolare per l’assegnazione di numeri) e rifiutare, limitare o sospendere un account che non li fornisca.',
              ],
            },
          ],
        },
        {
          title: 'Articolo 3 — Prova gratuita, assenza di recesso e di rimborso',
          body: [
            { p: 'Alla prima sottoscrizione di un piano a pagamento, il Cliente beneficia di una prova gratuita di quattordici (14) giorni di calendario consecutivi, con 30 minuti di chiamate inclusi, limitata a una sola prova per persona giuridica, numero di registrazione o metodo di pagamento:' },
            {
              ul: [
                [{ strong: 'Metodo di pagamento:' }, ' all’attivazione della prova è richiesta una carta. Durante i 14 giorni di prova non viene addebitato alcun importo.'],
                [{ strong: 'Limite di utilizzo:' }, ' durante la prova le chiamate sono limitate a 30 minuti; oltre tale limite sono sospese fino all’avvio dell’abbonamento. Alcune funzioni (numeri, campagne in uscita, messaggistica) possono essere limitate durante la prova.'],
                [{ strong: 'Fine della prova:' }, ' al termine dei 14 giorni, il piano scelto si avvia e viene addebitato il primo periodo (mensile o annuale), salvo disdetta dall’area clienti prima di tale data, nel qual caso non viene addebitato nulla. Un’email di promemoria viene inviata al Cliente 7 giorni prima della fine della prova.'],
              ],
            },
            { p: 'I contratti tra professionisti non prevedono il diritto di recesso riconosciuto ai consumatori. La prova gratuita consente di testare il Servizio prima di qualsiasi pagamento e di disdirlo senza costi prima della scadenza.' },
            { p: [{ strong: 'Ogni importo versato per un periodo resta definitivamente acquisito e non è rimborsabile' }, ', nemmeno in parte, anche in caso di disdetta, mancato utilizzo, passaggio a un piano inferiore, sospensione o chiusura dell’account, e per la parte non goduta di un periodo annuale. I Crediti non sono rimborsabili, né cedibili, né convertibili in denaro; il credito acquistato non scade finché l’account resta aperto e si perde alla sua chiusura.'] },
          ],
        },
        {
          title: 'Articolo 4 — Prezzi, fatturazione, rinnovo e imposte',
          body: [
            {
              ul: [
                'I prezzi sono espressi in dollari USA (USD), al netto delle imposte. Le imposte applicabili sono calcolate al pagamento in base al paese del Cliente e alla sua posizione fiscale (con o senza partita IVA) e sono a suo carico. Se il Cliente è tenuto a operare una ritenuta alla fonte, maggiora il pagamento in modo che riceviamo l’importo fatturato.',
                'I piani si pagano in anticipo, mensilmente o annualmente a scelta del Cliente (la fatturazione annuale offre due mesi gratuiti), tramite il nostro fornitore di pagamento Stripe. L’abbonamento si rinnova tacitamente per un periodo di pari durata e il Cliente autorizza i relativi addebiti ricorrenti. Con la fatturazione annuale, i minuti inclusi sono attribuiti ogni mese e il Servizio è identico.',
                'Gli utilizzi oltre il piano (minuti aggiuntivi, messaggi, numeri di telefono, costi addebitati dagli operatori o da Meta) sono scalati dal credito o fatturati alle tariffe in vigore indicate nella pagina Prezzi o nell’area clienti.',
                [{ strong: 'Crediti messaggi:' }, ' coprono gli scambi scritti del Servizio: risposte scritte dell’AI (chat del sito, WhatsApp, Messenger, Instagram), messaggi WhatsApp e SMS. Ogni utilizzo viene scalato dal saldo di crediti del Cliente: 3 crediti per risposta scritta dell’AI; 1,4 crediti per messaggio WhatsApp ricevuto o inviato in sessione; 2 crediti per SMS inviato, importo che può variare in base all’operatore o al paese; per un messaggio modello WhatsApp (template), la tariffa di Meta in base al paese e alla categoria, maggiorata. Le chiamate WhatsApp sono fatturate in minuti. I crediti sono inclusi ogni mese secondo il piano oppure si ottengono convertendo minuti dall’area clienti (1 minuto = 9 crediti). Il saldo è consultabile nell’area clienti; quando raggiunge 0, le risposte scritte e gli invii di SMS o WhatsApp vengono interrotti fino alla ricarica.'],
                ['Il Cliente può disdire in qualsiasi momento, senza preavviso, dalla propria area clienti ', { strong: appHost }, ', sezione Billing info (fatturazione), con il pulsante «Cancel subscription». Durante la prova, la disdetta prima della fine dei 14 giorni non comporta alcun addebito. Dopo la prova, la disdetta ha effetto alla fine del periodo già pagato (il mese o, con fatturazione annuale, l’anno in corso), senza rimborso (articolo 3). Il Cliente può cambiare piano o ricaricare il credito in qualsiasi momento; le modalità del cambio sono indicate nell’area clienti.'],
                'Possiamo modificare i prezzi con un preavviso di 30 giorni via email o nell’area clienti; il nuovo prezzo si applica dal rinnovo successivo. Il Cliente che non lo accetta disdice prima di tale data. I costi di terzi riaddebitati (operatori, Meta) possono variare nei tempi imposti da tali terzi.',
                'In caso di pagamento non riuscito o in ritardo, possiamo sospendere in tutto o in parte il Servizio fino alla regolarizzazione, senza proroga del periodo. Le somme non pagate producono interessi all’1,5% mensile o, se inferiore, al tasso massimo consentito, oltre all’eventuale indennizzo forfettario di legge per i costi di recupero e ai costi di recupero effettivamente sostenuti.',
                'Qualsiasi contestazione di pagamento (chargeback) avviata senza un previo reclamo nei nostri confronti comporta la sospensione immediata dell’account; tutte le somme dovute diventano subito esigibili, maggiorate dei costi di contestazione e di recupero.',
                'I reclami relativi a una fattura devono pervenirci entro 30 giorni dalla sua emissione; in mancanza, la fattura si intende accettata.',
              ],
            },
          ],
        },
        {
          title: 'Articolo 5 — Uso accettabile e contenuti vietati',
          body: [
            { p: 'Il Cliente utilizza il Servizio nel rispetto della legge applicabile e delle Condizioni. Sono vietati in particolare:' },
            {
              ul: [
                'qualsiasi attività illecita, fraudolenta, ingannevole o abusiva, compresi phishing e vishing, truffe e sostituzione di persona, azienda o autorità;',
                'molestie, minacce e contenuti d’odio, discriminatori, diffamatori o violenti, o lesivi di diritti di terzi;',
                'chiamate e messaggi non richiesti o invii massivi senza consenso, e qualsiasi elusione di un’opposizione;',
                'usi ad alto rischio: sostituire o chiamare i servizi di emergenza; basare sull’agente decisioni mediche, legali, finanziarie, assicurative, creditizie, di lavoro o abitative senza un controllo umano qualificato; il recupero crediti al di fuori del quadro di legge applicabile; chiamate o messaggi automatizzati di natura politica o elettorale; contenuti per adulti o sessuali e qualsiasi contenuto che coinvolga minori; giochi d’azzardo, armi, stupefacenti o prodotti regolamentati senza autorizzazione;',
                'la raccolta da parte dell’agente di categorie particolari di dati, numeri completi di carte di pagamento o identificativi ufficiali senza base giuridica e misure adeguate;',
                'l’uso di campioni vocali (clonazione della voce) senza il consenso preventivo, documentato e revocabile della persona la cui voce è riprodotta;',
                'qualsiasi attacco alla sicurezza o all’integrità del Servizio: codice malevolo, test di intrusione o di carico non autorizzati, elusione dei limiti, accesso agli account di terzi;',
                'reverse engineering, decompilazione o disassemblaggio (salvo nella misura espressamente consentita dalla legge), estrazione automatizzata (scraping), copia del Servizio o suo utilizzo per creare un servizio concorrente o addestrare modelli;',
                'rivendita, sublicenza, noleggio, messa a disposizione di terzi o commercializzazione in white label del Servizio senza nostro previo accordo scritto.',
              ],
            },
            { p: 'Senza alcun obbligo di sorveglianza, possiamo esaminare l’uso del Servizio, rimuovere contenuti, bloccare un numero, una campagna o un messaggio, sospendere l’account (articolo 13) e collaborare con operatori, piattaforme e autorità.' },
          ],
        },
        {
          title: 'Articolo 6 — Conformità di chiamate e messaggi',
          body: [
            { p: [{ strong: 'Il Cliente è l’unico responsabile della conformità delle proprie chiamate, campagne e messaggi' }, ' alla legge di ogni paese in cui si trovano i Destinatari, tra cui il GDPR, le norme sul marketing diretto e sulle comunicazioni elettroniche (ePrivacy) e, se contatta persone negli Stati Uniti, il Telephone Consumer Protection Act (TCPA) e la Telemarketing Sales Rule (TSR). In particolare:'] },
            {
              ul: [
                [{ strong: 'Consenso:' }, ' prima di qualsiasi chiamata o messaggio automatizzato, in uscita o promozionale (voce, SMS, WhatsApp), ottiene i consensi richiesti dalla legge, ne conserva la prova e rispetta immediatamente ogni opposizione (parola STOP, richiesta orale o scritta).'],
                [{ strong: 'Registri delle opposizioni:' }, ' rispetta le regole e i registri applicabili: Registro pubblico delle opposizioni (Italia, esteso anche ai numeri di cellulare), in Francia consenso preventivo espresso della persona al telemarketing dall’11 agosto 2026 (articolo L223-1 del Code de la consommation), TPS e CTPS (Regno Unito), Do Not Call Register (Australia), le norme polacche che richiedono il consenso preventivo al telemarketing e le norme olandesi (consenso preventivo o rapporto commerciale esistente, Bel-me-niet Register).'],
                [{ strong: 'Orari e frequenza:' }, ' rispetta i giorni, gli orari e le frequenze di chiamata consentiti.'],
                [{ strong: 'Identificazione:' }, ' presenta un numero valido a lui assegnato, non falsifica numeri e si identifica chiaramente.'],
                [{ strong: 'Trasparenza:' }, ' informa chiaramente i Destinatari, fin dall’inizio dell’interazione, che stanno interagendo con un sistema di intelligenza artificiale (in particolare ai sensi dell’art. 50 del Regolamento (UE) 2024/1689, «AI Act») e, ove la legge lo richieda, che la chiamata è registrata o trascritta, raccogliendo il loro consenso quando necessario.'],
                [{ strong: 'Piattaforme:' }, ' rispetta le policy di Meta (WhatsApp Business, Messenger, Instagram), compresi l’approvazione dei modelli e le finestre di conversazione, e le regole degli operatori (registrazione dei mittenti, mittenti alfanumerici). Tali terzi possono limitare un account o un numero senza alcuna nostra responsabilità.'],
              ],
            },
            { p: 'I numeri di telefono sono forniti da operatori (come Twilio): il Cliente li riceve in uso e non ne diventa proprietario. L’assegnazione può richiedere documenti che attestino identità, indirizzo o attività; l’operatore o l’autorità di regolamentazione può modificarli o revocarli. Un numero può essere rilasciato, e perso definitivamente, in caso di disdetta, sospensione prolungata o mancato pagamento. La portabilità in uscita dipende dalla fattibilità tecnica e regolamentare.' },
            { p: [{ strong: 'Nessuna chiamata di emergenza.' }, ' Il Servizio non consente di contattare i servizi di emergenza (112, 118, 113, 911…) e non sostituisce una linea telefonica. Il Cliente ne informa i propri Utenti.'] },
          ],
        },
        {
          title: 'Articolo 7 — Funzionalità di intelligenza artificiale',
          body: [
            {
              ul: [
                'Risposte, trascrizioni, riassunti e voci sono generati automaticamente e possono essere inesatti, incompleti o inappropriati. Il Cliente li verifica prima di farvi affidamento.',
                'Il Cliente configura istruzioni, basi di conoscenza, voci, strumenti e automazioni dei propri agenti: risponde di tutto ciò che il suo agente dice, promette o fa in suo nome (appuntamenti, prezzi, impegni).',
                'Il Servizio non fornisce consulenza medica, legale, finanziaria, fiscale o professionale, e il Cliente non deve presentare il proprio agente come tale.',
                'Modelli, voci, lingue e fornitori di AI possono evolvere, essere sostituiti o ritirati; la disponibilità di un determinato modello o di una determinata voce non è garantita.',
                'Tra le parti, i contenuti generati per il Cliente gli appartengono, fatti salvi i diritti di terzi e i nostri diritti sul Servizio; possono non essere unici.',
              ],
            },
          ],
        },
        {
          title: 'Articolo 8 — Dati del Cliente e protezione dei dati',
          body: [
            { p: ['Per i dati personali dei Destinatari trattati tramite il Servizio, il Cliente è titolare del trattamento e noi agiamo come responsabile del trattamento (articolo 28 GDPR e norme equivalenti). Il presente articolo e l’', { a: 'informativa sulla privacy', href: '/confidentialite' }, ' costituiscono l’accordo sul trattamento dei dati (DPA); una versione firmata è disponibile su richiesta. Noi:'] },
            {
              ul: [
                'trattiamo i dati soltanto su istruzioni documentate del Cliente (le Condizioni e le sue impostazioni), salvo obbligo di legge, e lo informiamo se un’istruzione ci sembra illecita;',
                'vincoliamo le persone autorizzate alla riservatezza;',
                'adottiamo misure tecniche e organizzative adeguate;',
                'ci avvaliamo di sub-responsabili, elencati nell’informativa sulla privacy, che il Cliente autorizza in via generale; comunichiamo ogni modifica con almeno 15 giorni di anticipo e il Cliente può opporsi per motivi legittimi, con il solo rimedio della disdetta;',
                'assistiamo il Cliente, in misura ragionevole, nella gestione delle richieste degli interessati, delle valutazioni d’impatto e delle violazioni dei dati, che notifichiamo senza ingiustificato ritardo;',
                'cancelliamo i dati alla fine del contratto secondo l’articolo 13, salvo obblighi di conservazione di legge;',
                'mettiamo a disposizione le informazioni necessarie a dimostrare la nostra conformità; eventuali audit si svolgono al massimo una volta l’anno, con ragionevole preavviso, a spese del Cliente e sotto vincolo di riservatezza.',
              ],
            },
            { p: 'Il Cliente garantisce di disporre di una base giuridica per ogni trattamento, di informare i Destinatari (agente AI, registrazione, finalità), di raccogliere i consensi necessari, di far trattare categorie particolari di dati solo se necessario e lecito e che le sue liste di contatti sono state costituite lecitamente. La registrazione delle chiamate e il relativo periodo di conservazione sono configurati dal Cliente.' },
            { p: 'Possiamo utilizzare dati aggregati o anonimizzati e metadati di utilizzo per gestire, proteggere e migliorare il Servizio. Non utilizziamo il contenuto delle chiamate e dei messaggi del Cliente per addestrare i nostri modelli.' },
          ],
        },
        {
          title: 'Articolo 9 — Servizi di terzi e integrazioni',
          body: [
            { p: 'Il Servizio si basa su terzi o vi si collega: operatori di telecomunicazioni, Meta (WhatsApp, Messenger, Instagram), calendari, CRM, strumenti di automazione, fornitori di AI e di pagamento. Si applicano le loro condizioni, che il Cliente accetta quando richiesto. Attivando un’integrazione, il Cliente ci autorizza a scambiare con essa i dati necessari. Non controlliamo tali servizi e non rispondiamo della loro disponibilità, delle loro modifiche né del trattamento dei dati loro trasmessi su richiesta del Cliente.' },
          ],
        },
        {
          title: 'Articolo 10 — Proprietà intellettuale',
          body: [
            {
              ul: [
                `Il Servizio, i suoi software, interfacce e documentazione, il marchio ${brand} e i suoi loghi appartengono a noi o ai nostri licenzianti e sono tutelati in particolare dalla ${legal.copyrightLaw}. Al Cliente non è concesso alcun diritto al di fuori della licenza che segue.`,
                'Concediamo al Cliente, per la durata dell’abbonamento, una licenza limitata, non esclusiva, non cedibile, non sublicenziabile e revocabile per utilizzare il Servizio per le proprie esigenze professionali interne.',
                'Il Cliente conserva i propri diritti sui Contenuti del Cliente. Ci concede, per tutto il mondo e a titolo gratuito, una licenza non esclusiva per ospitarli, riprodurli, trattarli, trasmetterli e visualizzarli, e farli trattare dai nostri sub-responsabili, nella sola misura necessaria a fornire, proteggere e assistere il Servizio e a rispettare la legge. Garantisce di disporre dei diritti necessari.',
                'Suggerimenti e feedback del Cliente possono essere utilizzati liberamente, gratuitamente e senza limiti di tempo.',
                'Il Cliente non utilizza i nostri marchi senza consenso scritto. Possiamo citarne il nome e il logo come referenza, salvo sua opposizione via email.',
                ['Per segnalare contenuti illeciti o violazioni del diritto d’autore, il segnalante scrive a ', mail, ' indicando l’opera, la posizione del contenuto, i propri recapiti e una dichiarazione di buona fede. Possiamo rimuovere il contenuto e sospendere gli account recidivi.'],
              ],
            },
          ],
        },
        {
          title: 'Articolo 11 — Riservatezza',
          body: [
            { p: 'Ciascuna parte mantiene riservate le informazioni non pubbliche ricevute dall’altra, le utilizza solo per eseguire le Condizioni e le protegge con ragionevole diligenza, per la durata del contratto e nei tre anni successivi (e finché restano tali, per i segreti commerciali). Non sono riservate le informazioni pubbliche, già note, sviluppate autonomamente o ricevute lecitamente da terzi. Una parte può divulgare informazioni richieste dalla legge o da un’autorità, avvisando l’altra ove consentito.' },
          ],
        },
        {
          title: 'Articolo 12 — Evoluzione del Servizio, funzioni beta e disponibilità',
          body: [
            {
              ul: [
                'Possiamo far evolvere il Servizio, aggiungere, modificare o ritirare funzioni e cambiare fornitori. Ove ragionevolmente possibile, avvisiamo prima di ritirare una funzione essenziale di un piano a pagamento.',
                'Le funzioni beta, in anteprima o sperimentali sono fornite così come sono, senza impegno, e possono essere interrotte in qualsiasi momento.',
                'La nostra è un’obbligazione di mezzi. Non si applica alcun livello di servizio garantito (SLA), salvo patto scritto in un contratto Su misura. Il Servizio dipende da internet, dagli operatori e dai nostri fornitori; manutenzioni programmate (annunciate se possibile) o urgenti possono interromperlo.',
                'Possono applicarsi limiti di uso ragionevole (chiamate simultanee, velocità, volumi).',
              ],
            },
          ],
        },
        {
          title: 'Articolo 13 — Sospensione e cessazione',
          body: [
            { p: 'Possiamo sospendere o chiudere in tutto o in parte l’account, in qualsiasi momento, con o senza preavviso e senza indennizzo, in caso di: violazione delle Condizioni, mancato pagamento o chargeback, reclamo di un operatore, di Meta, di un’autorità o di Destinatari, sospetto di frode, rischio per la sicurezza, rischio legale o reputazionale, richiesta di un’autorità o requisito di uno dei nostri fornitori. Gli importi restano dovuti durante la sospensione. Tale chiusura non dà diritto ad alcun rimborso, nemmeno dei periodi prepagati non goduti.' },
            {
              ul: [
                'Il Cliente può disdire in qualsiasi momento; la disdetta ha effetto alla fine del periodo pagato (articolo 4).',
                'Possiamo inoltre recedere dal contratto senza motivo con un preavviso di 30 giorni; solo in tal caso rimborsiamo la parte non goduta di un periodo prepagato.',
                'Alla fine del contratto l’accesso cessa, gli importi dovuti diventano esigibili, i numeri possono essere rilasciati e i Crediti si perdono. Il Cliente può esportare i propri dati dall’area clienti per 30 giorni; i dati sono poi cancellati entro 90 giorni dalla fine del contratto, fatti salvi gli obblighi di conservazione di legge e il normale ciclo dei backup.',
                'Gli account gratuiti o di prova senza abbonamento a pagamento, inattivi da 90 giorni, possono essere chiusi e i loro dati cancellati previo avviso via email.',
                'Le clausole che per loro natura sopravvivono alla cessazione (importi dovuti, dati, proprietà intellettuale, riservatezza, garanzie, responsabilità, manleva, controversie) restano applicabili.',
              ],
            },
          ],
        },
        {
          title: 'Articolo 14 — Esclusione di garanzie',
          body: [
            { p: 'Nei limiti consentiti dalla legge, il Servizio è fornito «nello stato in cui si trova» e «secondo disponibilità». Escludiamo qualsiasi garanzia, espressa o implicita, tra cui le garanzie di idoneità a un uso particolare, non violazione, funzionamento ininterrotto o privo di errori, esattezza dei contenuti generati dall’AI, consegna di chiamate e messaggi o conseguimento di un risultato commerciale.' },
          ],
        },
        {
          title: 'Articolo 15 — Limitazione di responsabilità',
          body: [
            {
              ul: [
                'Non rispondiamo di danni indiretti, consequenziali, speciali o punitivi, né di perdite di profitti, fatturato, clientela, opportunità o immagine, perdita o alterazione di dati, chiamate o appuntamenti mancati o del costo di un servizio sostitutivo, anche se avvisati della loro possibilità.',
                'Non rispondiamo dei danni derivanti dai Contenuti del Cliente, dalla configurazione degli agenti, da servizi di terzi, operatori, Meta, internet, forza maggiore o da un inadempimento del Cliente.',
                [{ strong: 'Massimale:' }, ' la nostra responsabilità complessiva, per qualsiasi causa, è limitata all’importo, al netto delle imposte, effettivamente pagato dal Cliente per l’abbonamento relativo al mese precedente il fatto generatore (con fatturazione annuale, un dodicesimo del prezzo annuale) e non può in nessun caso superare 1.000 USD.'],
                'Il Cliente riconosce che i prezzi riflettono tale ripartizione dei rischi.',
              ],
            },
            { p: 'Nessuna disposizione delle Condizioni esclude o limita una responsabilità o un diritto che non possa esserlo ai sensi della legge imperativa applicabile (in particolare in caso di dolo o colpa grave, o di danni alla persona).' },
            ...(legal.mandatoryNote ? [{ p: legal.mandatoryNote }] : []),
          ],
        },
        {
          title: 'Articolo 16 — Manleva da parte del Cliente',
          body: [
            { p: `Il Cliente difende, manleva e tiene indenni noi e i nostri dirigenti, dipendenti, subappaltatori e fornitori da qualsiasi pretesa, perdita, sanzione, condanna e spesa (comprese ragionevoli spese legali) derivante da: i suoi Contenuti del Cliente e la configurazione dei suoi agenti; le sue chiamate, messaggi e campagne; la mancanza di consenso o il mancato rispetto di un’opposizione o di un registro delle opposizioni; qualsiasi violazione delle norme su telecomunicazioni, marketing, AI o protezione dei dati; qualsiasi violazione delle Condizioni; qualsiasi pretesa di un Destinatario, di un Utente, di un operatore, di Meta, del nostro fornitore di piattaforma tecnica o di un’autorità connessa al suo utilizzo. Il Cliente riconosce che ${company} può essere responsabile verso i propri fornitori per gli inadempimenti dei suoi clienti. Informiamo il Cliente della pretesa; egli non può concludere transazioni che pongano obblighi a nostro carico senza il nostro consenso.` },
          ],
        },
        {
          title: 'Articolo 17 — Termine per agire',
          body: [
            { p: 'Nella misura consentita dalla legge, qualsiasi azione nei nostri confronti deve essere promossa entro tre (3) mesi dal fatto che la origina o dal giorno in cui il Cliente ne ha avuto o avrebbe dovuto averne conoscenza; in mancanza, è preclusa.' },
          ],
        },
        {
          title: 'Articolo 18 — Legge applicabile, arbitrato e rinuncia alle azioni collettive',
          body: [
            {
              ul: [
                `Le Condizioni sono disciplinate dalla ${legal.governingLaw}, escluse le sue norme di conflitto e la Convenzione delle Nazioni Unite sui contratti di compravendita internazionale di merci.`,
                ['Prima di qualsiasi procedimento, la parte che lamenta un pregiudizio invia un reclamo scritto (a noi: ', mail, '); le parti ricercano una soluzione amichevole per 30 giorni.'],
                `In mancanza, ogni controversia derivante dalle Condizioni o dal Servizio o ad essi relativa è risolta in via definitiva mediante arbitrato riservato e vincolante amministrato dall’American Arbitration Association (AAA) secondo il suo Regolamento di arbitrato commerciale (o, per una controversia internazionale, dal suo International Centre for Dispute Resolution), da un arbitro unico, con sede a Cheyenne (Wyoming) e in lingua inglese. Il lodo può essere riconosciuto ed eseguito dal ${legal.court} o da qualsiasi giudice competente.`,
                [{ strong: 'Rinuncia alle azioni collettive:' }, ' le controversie sono risolte esclusivamente su base individuale, escluse azioni di classe, collettive o rappresentative e arbitrati riuniti. Se tale rinuncia è ritenuta inapplicabile a una domanda, questa è decisa dai giudici indicati di seguito e non in arbitrato.'],
                'Ciascuna parte può chiedere a qualsiasi giudice competente provvedimenti urgenti o cautelari (in particolare per tutelare la propria proprietà intellettuale o le proprie informazioni riservate o per far cessare un uso abusivo del Servizio), senza prestare cauzione nella misura consentita. Ciascuna parte può adire il giudice delle controversie di modesta entità per una domanda individuale di sua competenza, e noi possiamo agire per il recupero delle somme non pagate dinanzi a qualsiasi giudice competente.',
                `Ogni controversia non soggetta ad arbitrato è di competenza esclusiva del ${legal.court}.`,
              ],
            },
          ],
        },
        {
          title: 'Articolo 19 — Forza maggiore',
          body: [
            { p: 'Nessuna parte risponde di ritardi o inadempimenti dovuti a eventi al di fuori del suo ragionevole controllo: calamità naturali, epidemie, guerre, terrorismo, sommosse, scioperi, provvedimenti delle autorità, guasti di operatori, di internet, della rete elettrica, di data center o di fornitori cloud o di AI, attacchi informatici o decisioni di Meta o di un operatore. Gli obblighi di pagamento non sono sospesi. Se l’evento dura più di 30 giorni, ciascuna parte può recedere dall’abbonamento interessato mediante comunicazione.' },
          ],
        },
        {
          title: 'Articolo 20 — Cessione e cambio di controllo',
          body: [
            { p: 'Possiamo cedere o trasferire in tutto o in parte le Condizioni, anche in caso di fusione, acquisizione, riorganizzazione o cessione di beni, senza il consenso del Cliente e dopo averlo informato, e subappaltare in tutto o in parte i nostri obblighi. Il Cliente non può cedere le Condizioni senza il nostro previo consenso scritto; ci informa di ogni cambio di controllo e in tal caso possiamo recedere se il nuovo socio di controllo è un concorrente o non supera le nostre verifiche.' },
          ],
        },
        {
          title: 'Articolo 21 — Disposizioni generali',
          body: [
            {
              ul: [
                [{ strong: 'Intero accordo:' }, ' le Condizioni, la pagina Prezzi, i dettagli del piano sottoscritto, l’', { a: 'informativa sulla privacy', href: '/confidentialite' }, ' e, se del caso, un contratto Su misura firmato costituiscono l’intero accordo e sostituiscono ogni intesa precedente. Le condizioni generali di acquisto del Cliente non si applicano.'],
                [{ strong: 'Ordine di prevalenza:' }, ' il contratto Su misura firmato, poi le Condizioni, poi l’informativa sulla privacy, poi la pagina Prezzi e la documentazione.'],
                [{ strong: 'Invalidità parziale e rinuncia:' }, ' una clausola invalida è sostituita dalla clausola valida più vicina e le altre restano in vigore; il mancato esercizio di un diritto non costituisce rinuncia.'],
                [{ strong: 'Comunicazioni:' }, ' scriviamo all’indirizzo email dell’account o nell’area clienti; il Cliente ci scrive all’indirizzo ', mail, '. Il Cliente accetta comunicazioni e fatture elettroniche.'],
                [{ strong: 'Modifiche:' }, ' possiamo modificare le Condizioni; le modifiche rilevanti sono annunciate via email o sul sito almeno 15 giorni prima della loro entrata in vigore, salvo esigenze di legge o di sicurezza. L’utilizzo successivo vale come accettazione; il Cliente che non accetta disdice prima di tale data.'],
                [{ strong: 'Lingua:' }, ' le Condizioni sono pubblicate in più lingue. In caso di discordanza, prevale la versione inglese.'],
                [{ strong: 'Sanzioni ed esportazioni:' }, ' il Cliente dichiara di non essere soggetto a sanzioni economiche e di non utilizzare il Servizio in un paese o a favore di una persona sottoposti a sanzioni.'],
                [{ strong: 'Indipendenza:' }, ' le parti sono contraenti indipendenti; le Condizioni non creano diritti a favore di terzi.'],
                [{ strong: 'Contatti:' }, ` ${company}, ${ADDRESS}, Stati Uniti — `, mail, '.'],
              ],
            },
          ],
        },
      ];
    },
  },

  privacy: {
    meta: {
      title: (brand: string) => `Informativa sulla privacy — ${brand}`,
      description: (brand: string) => `Come ${brand} tratta i Suoi dati: richieste di richiamata, agenti AI e registrazioni, account cliente, fatturazione Stripe, fornitori e i Suoi diritti.`,
    },
    breadcrumb: 'Privacy',
    h1: 'Informativa sulla privacy',
    intro: 'Cosa raccogliamo, perché, con chi lo condividiamo, per quanto tempo e come esercitare i Suoi diritti.',
    updated: 'Ultimo aggiornamento: 6 ottobre 2026',
    sections: ({ brand, company, email, legal }: LegalVars): LegalSection[] => {
      const mail = { a: email, href: `mailto:${email}` };
      return [
        {
          title: 'Chi siamo e il nostro ruolo',
          body: [
            { p: [`${brand} è un marchio di ${company}, Limited Liability Company registrata nello Stato del Wyoming (Stati Uniti), ${ADDRESS}. Contatto: `, mail, `. Trattiamo i dati personali ai sensi del ${legal.privacyLaw} e delle altre leggi applicabili.`] },
            {
              ul: [
                [{ strong: 'Titolare del trattamento:' }, ` per il sito, i moduli e le richieste di richiamata, le conversazioni con le nostre assistenti AI, gli account dei clienti, la fatturazione e il nostro marketing, il titolare è ${company}.`],
                [{ strong: 'Responsabile del trattamento:' }, ' per le chiamate, i messaggi e i contatti gestiti dagli agenti dei nostri clienti, il cliente è titolare del trattamento nei confronti dei propri interlocutori; noi agiamo per suo conto e su sue istruzioni. Se è stato contattato dall’agente di un’azienda cliente, si rivolga prima a essa; le trasmetteremo qualsiasi richiesta ricevuta.'],
              ],
            },
          ],
        },
        {
          title: 'I dati che raccogliamo',
          body: [
            {
              ul: [
                [{ strong: 'Moduli del sito' }, ' (richiamata, demo, assistenza alla prova): nome, telefono, email, azienda, settore, fascia oraria preferita, messaggio e consenso.'],
                [{ strong: 'Conversazioni con le nostre assistenti AI' }, ' (bolla del sito, receptionist, chiamate dimostrative, richiamate commerciali e di supporto, guida dell’area clienti): contenuto scritto, registrazione audio delle conversazioni vocali, trascrizione, riassunto e informazioni estratte (esigenza, piano valutato, problema segnalato).'],
                [{ strong: 'Account cliente' }, ': identità e recapiti degli utenti, informazioni sull’azienda, credenziali, impostazioni e istruzioni degli agenti, basi di conoscenza, liste di contatti, cronologia di chiamate e messaggi, consumo di minuti e crediti, richieste di supporto.'],
                [{ strong: 'Dati trattati per i nostri clienti' }, ': numeri e nomi di chiamanti o contatti, contenuto delle chiamate, messaggi, registrazioni, trascrizioni, appuntamenti e schede dei potenziali clienti.'],
                [{ strong: 'Fatturazione' }, ': piano, fatture, indirizzo di fatturazione, partita IVA, stato dei pagamenti. I dati della carta sono inseriti e conservati da Stripe; non vi abbiamo mai accesso.'],
                [{ strong: 'Dati tecnici' }, ': indirizzo IP, dispositivo e browser, log di connessione e di sicurezza, cookie.'],
                [{ strong: 'Dati ricevuti da terzi' }, ': integrazioni attivate dal cliente (calendari, CRM, WhatsApp, Messenger, Instagram), metadati di chiamate e messaggi forniti dagli operatori, informazioni di pagamento e antifrode fornite da Stripe, informazioni pubbliche sulle aziende utilizzate per verificare un account.'],
              ],
            },
          ],
        },
        {
          title: 'Finalità e basi giuridiche',
          body: [
            {
              ul: [
                [{ strong: 'RichiamarLa e rispondere alla Sua richiesta' }, ', anche tramite una chiamata del nostro agente vocale AI: il Suo consenso, prestato al momento della richiesta e revocabile in qualsiasi momento.'],
                [{ strong: 'Fornire il Servizio, la prova gratuita e l’assistenza' }, ': esecuzione del contratto o misure precontrattuali.'],
                [{ strong: 'Trattare i dati dei nostri clienti per loro conto' }, ': le loro istruzioni, sulla base giuridica da essi determinata.'],
                [{ strong: 'Fatturare, tenere la contabilità, adempiere agli obblighi fiscali e rispondere alle autorità' }, ': obbligo di legge.'],
                [{ strong: 'Proteggere la piattaforma, prevenire frodi e abusi, far rispettare le nostre condizioni, difenderci in giudizio, migliorare le nostre assistenti a partire dalle nostre conversazioni e da statistiche aggregate' }, ': legittimo interesse.'],
                [{ strong: 'Marketing verso professionisti' }, ': legittimo interesse o consenso ove richiesto dalla legge; può opporsi in qualsiasi momento.'],
                [{ strong: 'Cookie analitici e di misurazione pubblicitaria (pixel di Meta)' }, ': il Suo consenso.'],
              ],
            },
          ],
        },
        {
          title: 'Intelligenza artificiale, registrazioni e trascrizioni',
          body: [
            { p: 'Le nostre assistenti sono sistemi di intelligenza artificiale e si presentano come tali. Le conversazioni vocali sono registrate e trascritte; fornitori di AI ne producono riassunti ed estraggono le informazioni utili a seguire la Sua richiesta. Nessuna decisione che produca effetti giuridici nei Suoi confronti o che incida in modo analogo significativamente sulla Sua persona è basata unicamente su un trattamento automatizzato.' },
            { p: 'Non vendiamo i Suoi dati né li condividiamo per pubblicità mirata. Non utilizziamo il contenuto delle chiamate e dei messaggi dei nostri clienti per addestrare i nostri modelli. I nostri fornitori di AI trattano i dati in base a contratto, per nostro conto.' },
            { p: 'I clienti che utilizzano la piattaforma devono informare i propri interlocutori che stanno interagendo con un sistema di AI e, ove la legge lo richieda, che la chiamata è registrata. Sono loro a configurare la registrazione e il relativo periodo di conservazione.' },
          ],
        },
        {
          title: 'Condivisione dei dati e sub-responsabili',
          body: [
            { p: 'Comunichiamo i Suoi dati soltanto ai destinatari che ne hanno bisogno, vincolati da impegni di riservatezza e protezione dei dati:' },
            {
              ul: [
                [{ strong: 'Il nostro fornitore di piattaforma tecnica' }, ': agenti vocali, widget, area clienti, trascrizione, sintesi vocale e automazioni. Questo fornitore ha sede nell’Unione europea (Romania), è certificato ISO 27001 e ospita i dati nello Spazio economico europeo e/o negli Stati Uniti.'],
                [{ strong: 'Twilio e altri operatori di telecomunicazioni' }, ': instradamento di chiamate e SMS, numeri di telefono.'],
                [{ strong: 'Meta' }, ' (WhatsApp, Messenger, Instagram): quando il cliente utilizza questi canali.'],
                [{ strong: 'Fornitori di AI, voce e trascrizione' }, ': comprensione, risposta, sintesi vocale e trascrizione.'],
                [{ strong: 'Stripe' }, ': abbonamenti, pagamenti, fatture e calcolo delle imposte (certificato PCI DSS livello 1).'],
                [{ strong: 'Supabase' }, ': database di richieste, iscrizioni e resoconti delle conversazioni (Stati Uniti).'],
                [{ strong: 'Google Cloud (Firebase)' }, ': hosting del sito (Stati Uniti).'],
                [{ strong: 'Google (Google Analytics 4)' }, ': misurazione dell’audience, solo con il Suo consenso; trasferimento verso gli Stati Uniti tutelato dal Data Privacy Framework UE-USA.'],
                [{ strong: 'Meta Platforms Ireland Ltd (pixel di Meta)' }, ': misurazione dell’efficacia delle nostre pubblicità su Facebook e Instagram, solo con il Suo consenso; trasferimento verso gli Stati Uniti tutelato dal Data Privacy Framework UE-USA.'],
                [{ strong: 'Zoho' }, ': invio delle email di servizio e di follow-up.'],
                [{ strong: 'Integrazioni attivate dal cliente' }, ' (calendari, CRM, strumenti di automazione), i nostri consulenti professionali, le autorità ove la legge lo richieda e un eventuale acquirente in caso di fusione o cessione.'],
              ],
            },
          ],
        },
        {
          title: 'Trasferimenti internazionali',
          body: [
            { p: 'La nostra società e diversi fornitori si trovano negli Stati Uniti; il nostro fornitore di piattaforma tecnica ha sede nell’Unione europea e ospita i dati nel SEE e/o negli Stati Uniti. I trasferimenti sono cifrati e tutelati:' },
            {
              ul: [
                'Unione europea e SEE: quadro UE-USA per la protezione dei dati personali (EU-U.S. Data Privacy Framework) quando il destinatario vi aderisce, altrimenti clausole contrattuali tipo della Commissione europea, con misure supplementari ove necessario.',
                'Regno Unito: estensione britannica di tale quadro o addendum britannico alle clausole contrattuali tipo.',
                'Svizzera: quadro Svizzera-USA o clausole contrattuali tipo riconosciute dall’Incaricato federale (IFPDT).',
                'Australia: adottiamo misure ragionevoli, anche contrattuali, affinché i destinatari esteri trattino le informazioni in conformità agli Australian Privacy Principles (APP 8).',
              ],
            },
            { p: ['Una copia delle garanzie applicabili può essere richiesta a ', mail, '.'] },
          ],
        },
        {
          title: 'Periodi di conservazione',
          body: [
            {
              ul: [
                'Richieste di richiamata e conversazioni con le nostre assistenti: 24 mesi dall’ultimo contatto.',
                'Chiamate, registrazioni, trascrizioni, conversazioni scritte e SMS trattati per i nostri clienti: 90 giorni dalla data della chiamata (durata applicata dal nostro fornitore tecnico) per impostazione predefinita; ogni cliente può modificare tale periodo e cancellare i propri dati.',
                'Potenziali clienti e contatti raccolti dagli agenti dei nostri clienti: 24 mesi per impostazione predefinita, riducibili dal cliente.',
                'Dati dell’account: per la durata del rapporto contrattuale, poi 3 anni per finalità di marketing, salvo opposizione. Il contenuto dell’account è cancellato entro 90 giorni dalla fine del contratto.',
                'Fatture e scritture contabili: 10 anni.',
                'Log tecnici e di sicurezza: per il periodo limitato necessario alla sicurezza.',
              ],
            },
            { p: 'Al termine di tali periodi, i dati sono cancellati o anonimizzati.' },
          ],
        },
        {
          title: 'Sicurezza',
          body: [
            { p: 'I dati sono cifrati in transito (TLS) e a riposo (AES-256). Gli accessi sono basati sui ruoli, protetti da autenticazione e tracciati in log di audit; l’autenticazione a due fattori è disponibile per i clienti; vengono effettuati backup regolari e le chiavi tecniche sono custodite in vault dedicati. Il nostro fornitore di piattaforma tecnica è certificato ISO 27001. Poiché nessun sistema è infallibile, notifichiamo le violazioni dei dati personali alle autorità e agli interessati quando la legge lo richiede.' },
          ],
        },
        {
          title: 'I Suoi diritti in base al paese',
          body: [
            {
              ul: [
                [{ strong: 'Unione europea e SEE' }, ' (tra cui Italia, Francia, Polonia e Paesi Bassi): accesso, rettifica, cancellazione, limitazione, portabilità, opposizione (incondizionata per il marketing diretto), revoca del consenso e diritto di non essere sottoposto a una decisione basata unicamente su un trattamento automatizzato.'],
                [{ strong: 'Regno Unito' }, ': gli stessi diritti ai sensi dello UK GDPR e del Data Protection Act 2018.'],
                [{ strong: 'Svizzera' }, ': i diritti previsti dalla legge federale sulla protezione dei dati (nLPD).'],
                [{ strong: 'Australia' }, ': diritti di accesso e rettifica previsti dagli Australian Privacy Principles e possibilità di interagire con noi in forma anonima o con uno pseudonimo ove possibile.'],
                [{ strong: 'Altrove' }, ': i diritti previsti dalla Sua legge locale.'],
              ],
            },
          ],
        },
        {
          title: 'Esercizio dei diritti e reclami',
          body: [
            { p: ['Scriva a ', mail, ` o a ${company}, ${ADDRESS}, Stati Uniti. Possiamo chiederLe di dimostrare la Sua identità. Rispondiamo entro un mese, prorogabile di due mesi per le richieste complesse (ne sarà informato). La richiesta è gratuita, salvo che sia manifestamente infondata o eccessiva. Se trattiamo i Suoi dati per conto di un cliente, gli trasmettiamo la Sua richiesta.`] },
            { p: `Può proporre reclamo al ${legal.dataAuthority.replace(/^il /, '')}, o all’autorità di protezione dei dati del paese in cui risiede o lavora: in particolare la CNIL (Francia), l’UODO (Polonia), l’Autoriteit Persoonsgegevens (Paesi Bassi), l’ICO (Regno Unito) o l’IFPDT (Svizzera). In Australia, presenti prima il reclamo a noi: rispondiamo entro 30 giorni, dopodiché può rivolgersi all’OAIC.` },
          ],
        },
        {
          title: 'Minori',
          body: [
            { p: 'Il Servizio è riservato a professionisti di almeno 18 anni. Non è rivolto ai minori e non raccogliamo consapevolmente i loro dati; se veniamo a sapere che un minore ci ha fornito dati, li cancelliamo.' },
          ],
        },
        {
          title: 'Marketing, chiamate e opposizione',
          body: [
            { p: ['La chiamiamo soltanto su Sua richiesta o con il Suo consenso, e il nostro agente si presenta come un’AI. In qualsiasi momento può dire che non desidera più essere chiamato, rispondere STOP a un SMS, usare il link di disiscrizione di un’email o scrivere a ', mail, ': La inseriremo nella nostra lista interna di opposizione. Per il nostro marketing rispettiamo i registri delle opposizioni applicabili (Registro pubblico delle opposizioni, TPS/CTPS, Do Not Call Register…).'] },
            { p: 'Le chiamate e i messaggi inviati dai nostri clienti sono di loro responsabilità: rivolga loro la Sua opposizione; se ci contatta, la trasmetteremo.' },
          ],
        },
        {
          title: 'Cookie e «Do Not Track»',
          body: [
            { p: ['Il sito utilizza cookie essenziali al suo funzionamento e alla sua sicurezza e, solo con il Suo consenso, cookie analitici (Google Analytics) e di misurazione pubblicitaria (pixel di Meta). I dettagli e la gestione delle Sue scelte si trovano nella pagina ', { a: 'Cookie policy', href: '/cookies' }, '. In assenza di uno standard comune, non rispondiamo in modo diverso ai segnali «Do Not Track»; non tracciamo noi stessi la Sua navigazione su altri siti. Se accetta il pixel di Meta, Meta può tuttavia collegare la Sua visita al Suo account Facebook o Instagram per misurare e mostrare i nostri annunci.'] },
          ],
        },
        {
          title: 'Link a siti di terzi',
          body: [
            { p: 'Il sito e il Servizio possono rimandare a siti o servizi di terzi (Stripe, Meta, calendari, CRM…). Si applicano le loro informative sulla privacy e non ne siamo responsabili.' },
          ],
        },
        {
          title: 'Modifiche alla presente informativa',
          body: [
            { p: 'Possiamo aggiornare la presente informativa; la data dell’ultimo aggiornamento è indicata in cima alla pagina. Le modifiche rilevanti sono comunicate via email ai clienti o con un avviso sul sito.' },
          ],
        },
        {
          title: 'Contatti',
          body: [
            { p: [`${company}, ${ADDRESS}, Stati Uniti — `, mail, '.'] },
          ],
        },
      ];
    },
  },

  legalNotice: {
    meta: {
      title: (brand: string) => `Note legali — ${brand}`,
      description: (brand: string) => `Note legali, informazioni sull’editore, sull’hosting e sui diritti d’autore della piattaforma ${brand}.`,
    },
    h1: 'Note legali',
    updated: 'Ultimo aggiornamento: 29 settembre 2026',
    sections: ({ brand, company, email, legal }: LegalVars): LegalSection[] => [
      {
        title: '1. Editore del sito',
        body: [
          { p: ['Il sito internet accessibile all’indirizzo ', { strong: 'https://www.permanenceia.com' }, ' è gestito dalla società ', { strong: company }, '.'] },
          {
            ul: [
              [{ strong: 'Nome commerciale:' }, ` ${brand}`],
              [{ strong: 'Forma giuridica:' }, ' Limited Liability Company (LLC), Stato del Wyoming, Stati Uniti'],
              [{ strong: 'Numero di registrazione:' }, ' 2026-001905061'],
              [{ strong: 'Sede legale:' }, ' 1603 Capitol Ave, Suite 413G-2408, Cheyenne, WY 82001, Stati Uniti'],
              [{ strong: 'Email di contatto:' }, ` ${email}`],
              [{ strong: 'Responsabile dei contenuti:' }, ` il rappresentante legale di ${company}.`],
            ],
          },
        ],
      },
      {
        title: '2. Hosting della piattaforma',
        body: [
          { p: 'Il sito commerciale e l’applicazione sono ospitati da:' },
          {
            ul: [
              [{ strong: 'Piattaforma front-end:' }, ' Google LLC (Firebase App Hosting / Google Cloud), 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA. Regione di hosting: us-east4 (Virginia del Nord, Stati Uniti).'],
              [{ strong: 'Database e archiviazione:' }, ' Supabase Inc., infrastrutture situate negli Stati Uniti (regione AWS us-east-1, Virginia del Nord).'],
            ],
          },
        ],
      },
      {
        title: '3. Proprietà intellettuale',
        body: [
          { p: ['Il marchio ', { strong: brand }, `, il logo (la bolla in attesa, le onde vocali e il punto di disponibilità), nonché l’identità grafica, i testi, gli script conversazionali, le infografiche e il codice sorgente presenti sul sito sono di proprietà esclusiva di ${company}.`] },
          { p: `Qualsiasi riproduzione, distribuzione, modifica o utilizzo senza previo accordo scritto è severamente vietato e costituisce una violazione sanzionata ai sensi della ${legal.copyrightLaw}.` },
        ],
      },
      {
        title: '4. Limitazione di responsabilità',
        body: [
          { p: `${brand} si impegna, nei limiti delle proprie possibilità, a garantire l’esattezza delle informazioni pubblicate sul sito. Tuttavia, ${brand} non può essere ritenuta responsabile per interruzioni del servizio di rete, guasti imputabili a operatori di telecomunicazioni terzi o eventuali inesattezze generate dai modelli di intelligenza artificiale durante le conversazioni in tempo reale.` },
          { p: 'Il cliente resta l’unico responsabile delle istruzioni e delle regole operative che programma per il proprio centralino telefonico.' },
        ],
      },
    ],
  },

  cookies: {
    meta: {
      title: (brand: string) => `Cookie policy — ${brand}`,
      description: (brand: string) => `Cookie e strumenti di tracciamento utilizzati sul sito ${brand}.`,
    },
    h1: 'Cookie policy',
    paragraphs: (siteHost: string, appHost: string) => [
      `Cookie strettamente necessari: il sito ${siteHost} utilizza i cookie indispensabili al suo funzionamento (sicurezza, bilanciamento del carico). Non richiedono il Suo consenso.`,
      `Cookie «pia_consent»: memorizza la Sua scelta (accettare o rifiutare) per 6 mesi, sul dominio permanenceia.com e nell’area clienti (${appHost}), dove sono utilizzati anche i cookie di sessione necessari per l’accesso.`,
      'Solo con il Suo consenso: Google Analytics 4 (Google Ireland Ltd / Google LLC), cookie «_ga» e «_ga_<ID>», durata massima di 13 mesi, per misurare l’audience del sito e l’efficacia delle nostre campagne (statistiche aggregate). I dati possono essere trasferiti negli Stati Uniti nell’ambito del Data Privacy Framework UE-USA.',
      'Solo con il Suo consenso: il pixel di Meta (Meta Platforms Ireland Ltd) misura l’efficacia delle nostre pubblicità su Facebook e Instagram (visite, richieste di richiamata, clic verso WhatsApp o il telefono). Installa cookie come «_fbp», con durata massima di 3 mesi. Nessun dato inserito nei nostri moduli (nome, email, telefono) viene trasmesso a Meta. Meta può trasferire dati negli Stati Uniti (Meta Platforms, Inc.) nell’ambito del Data Privacy Framework UE-USA.',
      'Senza il Suo consenso nessuno di questi cookie viene installato e il pixel di Meta non viene caricato.',
      'Può cambiare idea e revocare il consenso in qualsiasi momento con il link «Gestisci i cookie» in fondo a ogni pagina; il rifiuto non impedisce di utilizzare il sito.',
      `Il widget della nostra assistente (caricato da ${appHost}) può utilizzare una memorizzazione tecnica necessaria alla conversazione.`,
    ],
    questions: 'Domande: ',
  },

  blog: {
    meta: {
      title: (brand: string) => `Blog sull’assistente telefonico AI · ${brand}`,
      description: 'Guide, casi di studio e analisi per trasformare più chiamate in clienti con un assistente telefonico AI e le prenotazioni automatiche.',
    },
    eyebrow: 'Risorse e approfondimenti',
    h1: 'Il blog dell’assistente telefonico AI',
    intro: 'Strategie di conversione telefonica, analisi normative ed esperienze concrete di professionisti.',
    searchPlaceholder: 'Cerca un articolo…',
    all: 'Tutti gli articoli',
    categories: {
      productivite: 'Produttività',
      conformite: 'Conformità',
      'cas-client': 'Casi di studio',
      technique: 'Tecnica',
    },
    read: 'Leggi',
    notFound: {
      title: (brand: string) => `Articolo non trovato | ${brand}`,
      description: 'Questo articolo non esiste o è stato spostato.',
      h1: 'Articolo non trovato',
      text: 'L’articolo che sta cercando non esiste o è stato spostato.',
      back: 'Torni agli articoli',
    },
    articleTitle: (title: string, brand: string) => `${title} | Blog ${brand}`,
    backToList: 'Torni all’elenco degli articoli',
    readTime: (t: string) => `${t} di lettura`,
    publisher: (brand: string) => `Redazione ${brand}`,
    ctaEyebrow: 'Passi all’azione',
    ctaTitle: 'Pronto a dotare la Sua azienda di un centralino AI?',
    ctaText: (days: number, minutes: number) => `Provi da oggi il nostro agente vocale in condizioni reali per ${days} giorni, con ${minutes} minuti inclusi e senza vincoli.`,
    ctaButton: 'Inizi gratis',
  },
};

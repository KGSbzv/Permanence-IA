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
    formTitle: 'Ricevere la mia chiamata dimostrativa',
    formIntro: 'Chiamata gratuita, nella fascia oraria che preferisce.',
    submit: 'Ricevere la chiamata demo',
    hearTitle: 'Cosa ascolterà',
    hearIntro: 'Un esempio di chiamata in uno studio dentistico: l’agente identifica la richiesta, propone un orario e prepara la scheda per il team.',
    steps: [
      { title: 'Lascia il Suo numero', text: 'Con il Suo settore e la fascia oraria preferita.' },
      { title: 'L’agente La chiama', text: 'Simula uno scenario della Sua attività.' },
      { title: 'Prova liberamente', text: 'Faccia domande, cambi idea, lo interrompa.' },
    ],
    liveCallTitle: 'Agente studio dentistico',
    scenariosTitle: 'Scelga il Suo scenario',
  },

  contact: {
    meta: {
      title: (brand: string) => `Contatti: La richiamiamo noi · ${brand}`,
      description: 'Ha domande sull’assistente telefonico AI? Lasci il Suo numero, La richiamiamo noi: richiamata commerciale, demo o assistenza, nella fascia oraria scelta.',
    },
    h1: 'Lasci il Suo numero, La richiamiamo noi',
    intro: 'Non pubblichiamo un numero di telefono: siamo noi a richiamarLa, nella fascia oraria che sceglie. Può anche scriverci.',
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
    intro: (days: number) => `Crei il Suo account, scelga il piano da provare e provi il Suo assistente telefonico AI sulla Sua attività per ${days} giorni.`,
    points: (days: number) => [
      `Carta richiesta all’attivazione, nessun addebito per ${days} giorni`,
      'Se annulla dalla Sua area clienti prima della fine della prova, non paga nulla',
      'Demo dal vivo e widget web inclusi',
      'Supporto per la prima configurazione',
    ],
    createTitle: 'Creare il mio account',
    createSteps: [
      '1. Crei il Suo account con la Sua email aziendale.',
      '2. Scelga il piano da provare nella Sua area clienti.',
      '3. Configuri il Suo agente ed effettui le prime chiamate.',
    ],
    createCta: 'Creare il mio account gratuito',
    already: 'È già cliente?',
    login: 'Accedi',
    sentTitle: 'La Sua richiesta è stata registrata',
    sentText: 'Un consulente La richiama per configurare con Lei il Suo primo agente.',
    sentCta: 'Creare il mio account gratuito',
    formTitle: 'Preferisce essere accompagnato?',
    formIntro: 'Lasci i Suoi recapiti: un consulente La richiama per avviare la prova insieme a Lei.',
    name: 'Nome e cognome',
    company: 'Azienda',
    email: 'Email aziendale',
    phone: 'Telefono',
    sector: 'Settore',
    sectorPlaceholder: 'Scegli…',
    sectorOther: 'Altra attività',
    plan: 'Piano desiderato',
    planPrice: (price: string) => ` — ${price} IVA esclusa/mese`,
    planFree: ' — gratuito',
    planQuote: ' — su preventivo',
    terms: [
      'Accetto i ',
      { a: 'termini e condizioni', href: '/cgu' },
      ' e l’',
      { a: 'informativa sulla privacy', href: '/confidentialite' },
      ', e di essere richiamato per l’attivazione del mio account.',
    ] as Rich,
    termsRequired: 'Accetti le condizioni per essere richiamato.',
    sendError: 'Non è stato possibile inviare la registrazione.',
    sending: 'Invio…',
    submit: 'Richieda una richiamata',
  },

  help: {
    meta: {
      title: (brand: string) => `Guida all’area clienti — ${brand}`,
      description: 'Guida in italiano alla Sua area clienti: traduzione dei menu, creazione di un agente, numeri, calendario, widget, minuti e fatturazione.',
    },
    breadcrumb: 'Aiuto',
    h1: 'Guida alla Sua area clienti',
    intro: 'La Sua area clienti è in inglese. Questa guida traduce ogni menu e La accompagna passo passo. All’interno dell’area clienti, anche l’assistente di supporto (bolla in basso a destra) risponde nella Sua lingua, italiano compreso, per iscritto o a voce.',
    openSpace: 'Apri la mia area clienti',
    chatLabel: 'Esempio di conversazione con l’assistente di supporto',
    chatTitle: (brand: string) => `Aiuto ${brand}`,
    chatMode: 'Nella Sua lingua · per iscritto o a voce',
    chat: [
      { me: true, text: 'Dove aggiungo dei minuti?' },
      { text: ['In alto a destra, apra il menu del Suo profilo e clicchi su ', { b: 'Add credits' }, ' (aggiungere credito). Scelga una ricarica: il credito non scade.'] },
      { me: true, text: 'E per mettere l’agente sul mio sito?' },
      { text: ['Apra il Suo agente in ', { b: 'Assistants' }, ', sezione ', { b: 'Web widget' }, ' (widget web): lo attivi, poi copi il codice fornito. Vuole che lo facciamo insieme?'] },
    ] as ChatLine[],
    tasksTitle: 'Le operazioni più comuni, passo passo',
    menuTitle: 'I menu dell’area clienti, tradotti',
    colMenu: 'Menu (inglese)',
    colLabel: 'In italiano',
    colText: 'A cosa serve',
    glossaryTitle: 'Piccolo glossario',
    moreBefore: 'Ha una domanda che non trova qui? Scriva a ',
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
      'Artigiani, studi professionali, agenzie, officine, saloni, ristoranti: i Suoi collaboratori sono impegnati a servire i clienti. Nel frattempo, il telefono squilla.',
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
      title: (brand: string) => `Assistente telefonico AI conforme al GDPR · ${brand}`,
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
      'Avviso «assistente AI» all’inizio della chiamata',
      'Registrazione attivabile o meno, con informativa al chiamante',
    ],
    commitmentsTitle: 'I nostri impegni',
    commitments: [
      'L’agente si presenta come un’AI e non si fa passare per una persona',
      'Le Sue campagne devono chiamare solo i contatti che hanno dato il consenso; una lista di esclusione integrata esclude gli altri',
      'Nessuna diagnosi medica, legale o finanziaria da parte dell’agente',
      'I Suoi dati non vengono mai venduti: sono utilizzati per fornire e migliorare il servizio',
      'Supporto per adattare le Sue informative',
    ],
    rights: ['Per qualsiasi domanda o richiesta di esercizio dei diritti: ', { a: 'informativa sulla privacy', href: '/confidentialite' }, '.'] as Rich,
  },

  notFound: {
    meta: {
      title: (brand: string) => `Pagina non trovata — ${brand}`,
      description: 'Questa pagina non esiste o è stata spostata.',
    },
    h1: 'Questa pagina non esiste o è stata spostata',
    text: 'Torni alla home o consulti i nostri piani.',
    home: 'Torna alla home',
    pricing: 'Vedi i prezzi',
  },

  terms: {
    meta: {
      title: (brand: string) => `Termini e condizioni generali — ${brand}`,
      description: (brand: string) => `Consulti le condizioni generali di utilizzo e di vendita applicabili ai piani e ai servizi di centralino telefonico AI ${brand}.`,
    },
    h1: 'Condizioni generali di utilizzo e di vendita',
    updated: 'Applicabili a professionisti e aziende • Ultimo aggiornamento: 29 settembre 2026',
    sections: ({ brand, company, email, appHost, legal }: LegalVars): LegalSection[] => [
      {
        title: 'Articolo 1 — Oggetto del servizio',
        body: [
          { p: ['Le presenti Condizioni generali disciplinano l’accesso e l’utilizzo della piattaforma software e dei servizi di telefonia tramite agente conversazionale di intelligenza artificiale commercializzati con il marchio ', { strong: brand }, ` dalla società ${company}.`] },
          { p: 'Il servizio consente alle aziende di delegare l’accoglienza telefonica in entrata, la qualificazione degli interlocutori e la prenotazione sincronizzata degli appuntamenti 24 ore su 24, 7 giorni su 7.' },
        ],
      },
      {
        title: 'Articolo 2 — Modalità della prova gratuita di 14 giorni',
        body: [
          { p: 'Ogni nuovo cliente beneficia, alla prima sottoscrizione di un piano, di un periodo di prova gratuita di quattordici (14) giorni di calendario consecutivi, comprensivo di 30 minuti di chiamate:' },
          {
            ul: [
              [{ strong: 'Metodo di pagamento:' }, ' all’attivazione della prova è richiesta una carta di pagamento. Nessun importo viene addebitato durante i 14 giorni di prova. Tutti i prezzi sono espressi al netto delle imposte.'],
              [{ strong: 'Limite di utilizzo:' }, ' durante la prova le chiamate sono limitate a 30 minuti; oltre tale limite, sono sospese fino all’avvio dell’abbonamento.'],
              [{ strong: 'Fine della prova:' }, ' al termine dei 14 giorni, l’abbonamento al piano scelto ha inizio e viene addebitata la prima mensilità, salvo che il cliente lo abbia annullato prima di tale data dalla propria area clienti, nel qual caso non viene addebitato alcun importo.'],
              [{ strong: 'Uso corretto:' }, ' la prova gratuita è limitata a una sola per entità giuridica / numero di registrazione.'],
            ],
          },
        ],
      },
      {
        title: 'Articolo 3 — Prova gratuita, assenza di recesso e di rimborso',
        body: [
          { p: 'I contratti conclusi tra professionisti non beneficiano del diritto di recesso previsto per i consumatori. La prova gratuita di 14 giorni consente al cliente di testare il servizio prima di qualsiasi pagamento e di annullarlo senza costi prima della sua scadenza.' },
          { p: [{ strong: 'Una volta pagato, un periodo non è rimborsabile' }, ', nemmeno parzialmente, poiché il servizio e i minuti sono messi a disposizione fin dall’inizio del periodo. Anche il credito acquistato (ricariche) non è rimborsabile; non scade. La disdetta resta possibile in qualsiasi momento per i periodi successivi (articolo 4).'] },
        ],
      },
      {
        title: 'Articolo 4 — Fatturazione, prezzi e recesso',
        body: [
          { p: 'I prezzi sono espressi in dollari USA (USD), al netto delle imposte. Le imposte applicabili sono calcolate automaticamente al momento del pagamento in base al paese del cliente e al suo status (privato o azienda, con o senza partita IVA). I pagamenti sono effettuati mensilmente tramite il nostro fornitore di pagamenti sicuri Stripe; l’abbonamento si rinnova tacitamente ogni mese.' },
          { p: ['Il cliente può recedere dall’abbonamento in qualsiasi momento e senza preavviso dalla propria dashboard ', { strong: appHost }, '. Il recesso ha effetto al termine del periodo mensile già pagato. Il cliente può cambiare piano in qualsiasi momento e aggiungere minuti tramite una ricarica di credito; il credito acquistato non scade e serve a pagare i minuti oltre il piano, alla tariffa per minuto extra indicata nella pagina Prezzi.'] },
        ],
      },
      {
        title: 'Articolo 5 — Responsabilità e natura dell’obbligazione',
        body: [
          { p: [`${brand} è tenuta a un’`, { strong: 'obbligazione di mezzi' }, ' per quanto riguarda la disponibilità e il trattamento tecnico dei flussi di chiamata. L’utente riconosce che i modelli di intelligenza artificiale generativa e di sintesi vocale possono occasionalmente produrre risposte approssimative o inesatte.'] },
          { p: `In nessun caso ${brand} potrà essere ritenuta responsabile per perdite di esercizio indirette, mancati guadagni o danni commerciali. In ogni caso, l’importo massimo del risarcimento è espressamente limitato all’importo, al netto delle imposte, versato dal cliente nel mese precedente il fatto generatore.` },
        ],
      },
      {
        title: 'Articolo 6 — Usi vietati e sospensione',
        body: [
          { p: `Sono severamente vietati: le campagne di telemarketing non richiesto (spam vocale abusivo), le attività fraudolente, i contenuti diffamatori, discriminatori o illeciti. In caso di accertato uso abusivo, ${brand} si riserva il diritto di sospendere l’accesso alla linea dedicata senza alcun indennizzo.` },
        ],
      },
      {
        title: 'Articolo 7 — Legge applicabile e foro competente',
        body: [
          { p: `Le presenti Condizioni generali sono regolate dalla ${legal.governingLaw}. Per ogni controversia relativa alla loro interpretazione o esecuzione è competente in via esclusiva il ${legal.court}.` },
          ...(legal.mandatoryNote ? [{ p: legal.mandatoryNote }] : []),
        ],
      },
    ],
  },

  privacy: {
    meta: {
      title: (brand: string) => `Informativa sulla privacy — ${brand}`,
      description: (brand: string) => `Come ${brand} tratta i Suoi dati: richieste di richiamata, agenti AI e registrazioni, account cliente, fatturazione Stripe, fornitori e i Suoi diritti.`,
    },
    breadcrumb: 'Privacy',
    h1: 'Informativa sulla privacy',
    intro: 'Cosa raccogliamo, perché, con chi lo condividiamo, per quanto tempo e come esercitare i Suoi diritti.',
    updated: 'Aggiornamento: ottobre 2026',
    sections: ({ brand, company, email, legal }: LegalVars): LegalSection[] => {
      const mail = { a: email, href: `mailto:${email}` };
      return [
        {
          title: 'Chi è responsabile dei Suoi dati',
          body: [
            { p: [`${brand} è un marchio di ${company}, società a responsabilità limitata registrata nel Wyoming (Stati Uniti), ${ADDRESS}. Contatto: `, mail, '.'] },
            {
              ul: [
                [{ strong: 'Per il sito, le richieste di richiamata, le conversazioni con le nostre assistenti e la gestione degli account clienti' }, `, ${company} è titolare del trattamento.`],
                [{ strong: 'Per le chiamate e i messaggi gestiti dagli agenti dei nostri clienti' }, ', il cliente è titolare del trattamento nei confronti dei propri chiamanti e noi agiamo come responsabile del trattamento per suo conto. Il cliente decide quali informazioni il proprio agente raccoglie e come vengono utilizzate.'],
              ],
            },
          ],
        },
        {
          title: 'I dati che trattiamo',
          body: [
            {
              ul: [
                [{ strong: 'Moduli del sito' }, ' (richiamata, demo, supporto alla prova): nome, telefono, email, azienda, settore, fascia oraria preferita e il Suo messaggio.'],
                [{ strong: 'Conversazioni con le nostre assistenti AI' }, ' (bolla del sito, receptionist, richiamate commerciali e di assistenza, guida dell’area clienti): contenuto scritto, registrazione audio delle conversazioni vocali, trascrizione, riepilogo e informazioni utili estratte (esigenza, piano considerato, problema segnalato).'],
                [{ strong: 'Account cliente' }, ': identità, email, azienda, impostazioni dei Suoi agenti, cronologia di chiamate e messaggi, consumo di minuti.'],
                [{ strong: 'Fatturazione' }, ': piano, fatture e metodo di pagamento. I dati della carta sono inseriti e conservati da Stripe; non vi abbiamo mai accesso.'],
                [{ strong: 'Dati tecnici' }, ': indirizzo IP e informazioni del browser necessari al funzionamento e alla sicurezza del sito.'],
              ],
            },
          ],
        },
        {
          title: 'Perché e su quale base giuridica',
          body: [
            {
              ul: [
                [{ strong: 'RichiamarLa e rispondere alla Sua richiesta' }, ', anche tramite una chiamata del nostro agente vocale AI: sulla base del Suo consenso, fornito al momento della richiesta. Può revocarlo in qualsiasi momento, e l’agente rispetta ogni richiesta di non essere più chiamati.'],
                [{ strong: 'Fornire il servizio, la prova gratuita e l’assistenza' }, ': esecuzione del contratto.'],
                [{ strong: 'Fatturare e adempiere ai nostri obblighi contabili e fiscali' }, ': obbligo di legge.'],
                [{ strong: 'Migliorare le nostre assistenti e proteggere la piattaforma' }, ': legittimo interesse, esclusivamente a partire dalle nostre conversazioni.'],
              ],
            },
          ],
        },
        {
          title: 'Agenti AI e registrazioni',
          body: [
            { p: 'Le nostre assistenti sono intelligenze artificiali e si presentano come tali. Le conversazioni vocali sono registrate e trascritte per garantire il seguito della Sua richiesta e la qualità del servizio. Nessuna decisione che produca effetti giuridici nei Suoi confronti è presa in modo interamente automatizzato.' },
            { p: 'I nostri clienti che utilizzano la piattaforma devono informare i propri chiamanti dell’uso di un agente AI e della registrazione, secondo le norme applicabili alla loro attività.' },
          ],
        },
        {
          title: 'I nostri fornitori',
          body: [
            {
              ul: [
                [{ strong: 'Autocalls' }, ': piattaforma tecnica degli agenti vocali, dei widget e dell’area clienti (chiamate, trascrizione, sintesi vocale, automazioni).'],
                [{ strong: 'Fornitori di AI, voce e telefonia' }, ' utilizzati da questa piattaforma per comprendere, rispondere e instradare le chiamate.'],
                [{ strong: 'Stripe' }, ': abbonamenti, pagamenti, fatture e calcolo delle imposte (certificato PCI-DSS livello 1).'],
                [{ strong: 'Supabase' }, ': database delle richieste di richiamata, delle registrazioni e dei resoconti delle conversazioni (Stati Uniti).'],
                [{ strong: 'Google Cloud (Firebase App Hosting)' }, ': hosting del sito (Stati Uniti).'],
                [{ strong: 'Zoho Mail' }, ': invio delle email di servizio e di follow-up.'],
              ],
            },
          ],
        },
        {
          title: 'Trasferimenti al di fuori dell’Unione europea',
          body: [
            { p: 'Diversi di questi fornitori, così come la nostra società, si trovano negli Stati Uniti. I trasferimenti si basano sul Quadro per la protezione dei dati UE-USA quando il fornitore vi aderisce, oppure sulle clausole contrattuali tipo della Commissione europea.' },
          ],
        },
        {
          title: 'Per quanto tempo li conserviamo',
          body: [
            {
              ul: [
                'Richieste di richiamata e conversazioni con le nostre assistenti: 24 mesi dall’ultimo contatto.',
                'Registrazioni e trascrizioni delle chiamate gestite per i nostri clienti: 12 mesi per impostazione predefinita; ogni cliente può ridurre questo periodo ed eliminare i propri dati dalla sua area clienti.',
                'Dati dell’account: per tutta la durata del rapporto, poi 3 anni per eventuali comunicazioni commerciali, salvo opposizione.',
                'Fatture e dati contabili: durata prevista dalla legge (fino a 10 anni).',
              ],
            },
          ],
        },
        {
          title: 'Sicurezza',
          body: [
            { p: 'Le comunicazioni sono crittografate in transito, l’accesso ai dati è limitato alle persone che ne hanno bisogno ed è protetto da autenticazione, e le chiavi tecniche sono conservate in archivi sicuri per i segreti. I clienti possono attivare l’autenticazione a due fattori sulla propria area clienti.' },
          ],
        },
        {
          title: 'I Suoi diritti',
          body: [
            { p: [`Ai sensi del ${legal.privacyLaw}, può richiedere l’accesso ai Suoi dati, la loro rettifica, la cancellazione, la portabilità, la limitazione del trattamento, opporsi alle comunicazioni commerciali e revocare il consenso a essere richiamato. Scriva a `, mail, ': rispondiamo entro un mese.'] },
            { p: `Ha inoltre il diritto di proporre reclamo all’autorità di controllo: in Italia, ${legal.dataAuthority}; se risiede in un altro paese dell’Unione europea, può rivolgersi all’autorità di protezione dei dati del Suo paese.` },
          ],
        },
        {
          title: 'Cookie',
          body: [
            { p: ['Il sito non utilizza cookie pubblicitari. I dettagli sono riportati nella pagina ', { a: 'cookie', href: '/cookies' }, '.'] },
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
          { p: ['Il sito internet accessibile all’indirizzo ', { strong: 'https://permanenceia.com' }, ' è pubblicato dalla società ', { strong: company }, '.'] },
          {
            ul: [
              [{ strong: 'Nome commerciale:' }, ` ${brand}`],
              [{ strong: 'Forma giuridica:' }, ' Limited Liability Company (LLC), Stato del Wyoming, Stati Uniti'],
              [{ strong: 'Numero di registrazione:' }, ' 2026-001905061'],
              [{ strong: 'Sede legale:' }, ' 1603 Capitol Ave, Suite 413G-2408, Cheyenne, WY 82001, Stati Uniti'],
              [{ strong: 'Email di contatto:' }, ` ${email}`],
              [{ strong: 'Direttore della pubblicazione:' }, ` il rappresentante legale di ${company}.`],
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
              [{ strong: 'Database e archiviazione:' }, ' Supabase Inc., infrastrutture situate negli Stati Uniti (Regione AWS us-east-1, Virginia).'],
            ],
          },
        ],
      },
      {
        title: '3. Proprietà intellettuale',
        body: [
          { p: ['Il marchio ', { strong: brand }, `, il logo (la bolla in attesa, le onde vocali e il punto di disponibilità), nonché l’insieme delle linee grafiche, dei testi, degli script conversazionali, delle infografiche e dei codici sorgente presenti sul sito sono di proprietà esclusiva di ${company}.`] },
          { p: `Qualsiasi riproduzione, distribuzione, modifica o utilizzo senza previo accordo scritto è severamente vietato e costituisce una violazione sanzionata ai sensi della ${legal.copyrightLaw}.` },
        ],
      },
      {
        title: '4. Limitazione di responsabilità',
        body: [
          { p: `${brand} si impegna, nei limiti delle proprie possibilità, a garantire l’esattezza delle informazioni pubblicate sul sito. Tuttavia, ${brand} non può essere ritenuta responsabile per interruzioni del servizio di rete, guasti imputabili a operatori di telecomunicazione terzi o inesattezze contestuali occasionali formulate dai modelli di elaborazione automatica del linguaggio durante le conversazioni in tempo reale.` },
          { p: 'Il cliente professionale resta l’unico responsabile delle istruzioni e delle regole operative che programma per il proprio centralino telefonico.' },
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
      `Il sito ${siteHost} utilizza esclusivamente i cookie strettamente necessari al suo funzionamento (sicurezza, bilanciamento del carico). Ad oggi non viene installato alcun cookie pubblicitario né di misurazione dell’audience di terze parti.`,
      'Se verranno aggiunti strumenti di misurazione dell’audience o pubblicitari, un banner Le chiederà il consenso prima di qualsiasi installazione, e questa pagina sarà aggiornata con l’elenco dei cookie, la loro finalità e la loro durata.',
      `L’area clienti (${appHost}) utilizza cookie di sessione necessari per l’accesso.`,
    ],
    questions: 'Domande: ',
  },

  blog: {
    meta: {
      title: (brand: string) => `Blog sull’assistente telefonico AI · ${brand}`,
      description: 'Guide, casi di studio e analisi per migliorare la conversione telefonica della Sua azienda con un assistente telefonico AI e le prenotazioni automatiche.',
    },
    eyebrow: 'Risorse e approfondimenti',
    h1: 'Il giornale della reception AI',
    intro: 'Strategie di conversione telefonica, analisi normative ed esperienze concrete di professionisti.',
    searchPlaceholder: 'Cerca un articolo...',
    all: 'Tutti gli articoli',
    categories: {
      productivite: 'Produttività',
      conformite: 'Conformità',
      'cas-client': 'Casi cliente',
      technique: 'Tecnica',
    },
    read: 'Leggi',
    notFound: {
      title: (brand: string) => `Articolo non trovato | ${brand}`,
      description: 'Questo articolo non esiste o è stato spostato.',
      h1: 'Articolo non trovato',
      text: 'L’articolo che sta cercando non esiste o è stato spostato.',
      back: 'Torna agli articoli',
    },
    articleTitle: (title: string, brand: string) => `${title} | Blog ${brand}`,
    backToList: 'Torna all’elenco degli articoli',
    readTime: (t: string) => `${t} di lettura`,
    publisher: (brand: string) => `${brand} Publications`,
    ctaEyebrow: 'Passi all’azione',
    ctaTitle: 'Pronto a dotare la Sua azienda di un centralino AI?',
    ctaText: (days: number, minutes: number) => `Provi da oggi il nostro agente vocale in condizioni reali per ${days} giorni, con ${minutes} minuti inclusi e senza vincoli.`,
    ctaButton: 'Inizi gratis',
  },
};

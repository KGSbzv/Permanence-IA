// Guide pratiche dell’area clienti (interfaccia in inglese): una scheda per operazione, pubblicata in /aide/guides/<slug>.
// Le etichette inglesi dell’interfaccia restano tra virgolette, la spiegazione è nella lingua del lettore.
// Variabili sostituite in visualizzazione: {brand} (marchio del mercato), {numberFrom} (prezzo di partenza di un numero dedicato).
// Stessi slug, stesse categorie e stessa struttura in tutte le lingue (tipizzazione `typeof` nelle traduzioni).

import type { Guide, GuideCategory, GUIDES_UI as FR_UI } from '../fr/guides';

export const GUIDES_UI: typeof FR_UI = {
  categories: {
    start: 'Primi passi',
    assistant: 'Configurare il Suo agente',
    tools: 'Conoscenze, calendario e strumenti',
    phone: 'Numeri e telefonia',
    channels: 'Sito web e messaggistica',
    outbound: 'Campagne e contatti',
    results: 'Monitoraggio delle chiamate e automazioni',
    billing: 'Minuti e fatturazione',
  } as Record<GuideCategory, string>,
  indexTitle: 'Guide passo passo',
  indexIntro: 'Una scheda per ogni operazione, con le etichette esatte dell’interfaccia (in inglese) e la relativa spiegazione in italiano.',
  breadcrumb: 'Guide',
  meta: {
    title: (title: string, brand: string) => `${title} — Guida ${brand}`,
  },
  eyebrow: (category: string) => `Guida · ${category}`,
  planLabel: 'Disponibilità',
  tipLabel: 'Consiglio',
  relatedTitle: 'Guide correlate',
  allGuides: 'Tutte le guide',
  openSpace: 'Apri la mia area',
  helpBefore: 'Serve aiuto? Nella Sua area, l’assistente di supporto (fumetto in basso a destra) risponde nella Sua lingua. Può anche scrivere a ',
  helpAfter: '.',
};

export const GUIDES: Guide[] = [
  // ---------- Primi passi ----------
  {
    slug: 'agent-vocal-ia',
    category: 'start',
    title: 'Che cos’è un agente vocale IA?',
    summary: 'Il ruolo di un agente, i suoi componenti e cosa può fare per Lei, sia nelle chiamate in entrata sia in quelle in uscita.',
    sections: [
      {
        title: 'Il principio',
        text: 'Un agente (chiamato «Assistant» nell’area {brand}) è un’intelligenza artificiale che Lei configura per parlare al telefono con i Suoi clienti o potenziali clienti: quando sono loro a chiamarLa (chiamata in entrata, «Receive phone calls») o quando è l’agente a chiamarli (chiamata in uscita, «Make phone calls»).',
      },
      {
        title: 'Cosa fa per Lei',
        list: [
          'Risponde alle domande frequenti, prende messaggi e fissa appuntamenti, 24 ore su 24.',
          'Qualifica una richiesta e trasferisce la chiamata al Suo team quando necessario.',
          'Gestisce più chiamate contemporaneamente (il numero di chiamate simultanee dipende dal Suo piano).',
        ],
      },
      {
        title: 'I suoi componenti',
        list: [
          'Le istruzioni («System prompt»): il ruolo, il tono e le regole dell’agente.',
          'Il messaggio di benvenuto («Initial message»): la prima frase pronunciata.',
          'La voce («Voice»): una voce della libreria o la Sua voce clonata.',
          'Gli strumenti («Tools»): trasferimento, fine chiamata, presa di appuntamenti, strumenti su misura.',
          'La base di conoscenza («Knowledge base»): i Suoi documenti e le Sue pagine web.',
        ],
      },
    ],
    related: ['creer-un-agent', 'consignes-system-prompt', 'outils-de-l-agent'],
  },
  {
    slug: 'creer-un-agent',
    category: 'start',
    title: 'Creare e modificare un agente',
    summary: 'Creare il Suo primo agente in pochi minuti e modificarlo in qualsiasi momento.',
    plan: 'Il numero di agenti dipende dal Suo piano (menu «Limits»).',
    sections: [
      {
        title: 'Creare l’agente',
        steps: [
          'Acceda ad app.permanenceia.com e apra il menu «Assistants», poi «Create».',
          'Scelga il tipo: «Receive phone calls» per rispondere alle chiamate, «Make phone calls» per chiamare (campagne, richiami).',
          'Indichi un nome interno (ad esempio «Accoglienza studio») e verifichi il fuso orario.',
          'Scelga la lingua, poi la voce («Voice & speech»), e la ascolti.',
          'Scriva le istruzioni («Brain & prompt») e la frase di benvenuto («Greeting»).',
          'Clicchi su «Create assistant».',
        ],
      },
      {
        title: 'Aggiungere gli strumenti utili',
        text: 'In «Tools & actions», aggiunga ciò di cui l’agente ha bisogno: trasferimento di chiamata, fine chiamata, presa di appuntamenti, strumenti su misura.',
      },
      {
        title: 'Collegare e provare',
        list: [
          'Agente in entrata: gli assegni un numero (sezione «General», campo «Phone number»).',
          'Agente in uscita: lo colleghi a una campagna o lo provi facendosi chiamare.',
          'In ogni caso, lo provi prima di metterlo in servizio.',
        ],
      },
      {
        title: 'Modificare un agente',
        steps: [
          'Menu «Assistants», clicchi sul nome dell’agente.',
          'Modifichi le istruzioni, la voce o gli strumenti.',
          'Clicchi su «Save»: le chiamate successive utilizzano la nuova versione.',
        ],
        tip: 'Dopo ogni modifica, effettui una chiamata di prova per verificarne il comportamento.',
      },
    ],
    related: ['tester-son-agent', 'consignes-system-prompt', 'acheter-un-numero'],
  },
  {
    slug: 'tester-son-agent',
    category: 'start',
    title: 'Provare il Suo agente (chat, browser, telefono)',
    summary: 'I tre modi per provare un agente prima della messa in servizio, e quando usare ciascuno.',
    sections: [
      {
        title: '1. La chat di prova: per le istruzioni',
        text: 'Il modo più rapido per verificare la logica della conversazione, senza voce.',
        steps: [
          'Apra l’agente e clicchi su «Test assistant» (icona a fumetto).',
          'Scriva come farebbe un cliente: l’agente risponde con le stesse istruzioni e gli stessi strumenti usati al telefono.',
          'Verifichi che comprenda le richieste, raccolga le informazioni corrette e utilizzi i suoi strumenti.',
        ],
        tip: 'Ogni sessione di prova viene salvata in «Inbox» con un badge «Test», utile per rileggere lo scambio.',
      },
      {
        title: '2. La chiamata nel browser: per la voce',
        steps: [
          'Clicchi su «Speak with your assistant» e autorizzi il microfono.',
          'Parli con l’agente: verifichi la voce, il ritmo, le interruzioni.',
        ],
        text: 'Il trasferimento di chiamata non funziona in questa modalità.',
      },
      {
        title: '3. La vera chiamata telefonica: la verifica finale',
        list: [
          'Agente in uscita: clicchi su «Speak to your assistant», scelga la chiamata telefonica e inserisca il Suo numero: l’agente La chiama subito.',
          'Agente in entrata: chiami semplicemente il numero assegnato all’agente.',
          'È l’unica prova che verifica tutti gli strumenti, compreso il trasferimento di chiamata.',
        ],
      },
      {
        title: 'Da sapere',
        list: [
          'Le prove vocali consumano minuti come le chiamate reali; la chat di prova consuma un po’ di credito.',
          'Salvi il numero dell’agente nei Suoi contatti per richiamarlo facilmente.',
        ],
      },
    ],
    related: ['creer-un-agent', 'historique-des-appels', 'minutes-et-facturation'],
  },

  // ---------- Configurare l’agente ----------
  {
    slug: 'consignes-system-prompt',
    category: 'assistant',
    title: 'Scrivere le istruzioni dell’agente (system prompt)',
    summary: 'Strutturare le istruzioni che definiscono il ruolo, il tono e le regole del Suo agente.',
    sections: [
      {
        title: 'A cosa servono le istruzioni',
        text: 'Le istruzioni («System prompt», sezione «Brain & prompt») sono il cervello dell’agente: la sua identità, ciò che sa, come parla e ciò che non deve mai fare. Ci sono tre modi per modificarle: l’assistente di scrittura («AI Prompt Editor»), l’editor visuale («Flow Builder») o la modifica diretta del testo.',
      },
      {
        title: 'Partire da un modello',
        steps: [
          'Nell’agente, sezione delle istruzioni, clicchi su «Templates».',
          'Scelga il modello più vicino al Suo utilizzo (accoglienza, presa di appuntamenti, assistenza, qualificazione…).',
          'Lo adatti alla Sua attività.',
        ],
      },
      {
        title: 'I 5 blocchi di buone istruzioni',
        list: [
          'Ruolo e identità: «Sei l’assistente di accoglienza dello studio X, specializzato in…»',
          'Stile: tono, uso del Lei, frasi brevi, niente gergo tecnico.',
          'Informazioni chiave: servizi, orari, tariffe, indirizzo.',
          'Regole: cosa verificare, quando trasferire, cosa non promettere mai.',
          'Procedure: come gestire le situazioni frequenti (presa di appuntamento, reclamo, urgenza).',
        ],
      },
      {
        title: 'Lingua delle istruzioni',
        text: 'Può scrivere le istruzioni nella lingua che preferisce: la lingua parlata dall’agente si imposta separatamente, in «Voice & speech».',
      },
      {
        title: 'Errori frequenti',
        list: [
          'Troppo vaghe: «Sii disponibile» non basta.',
          'Troppo rigide: scrivere ogni battuta rende la conversazione artificiale.',
          'Troppo lunghe: le informazioni dettagliate vanno nella base di conoscenza.',
          'Situazioni dimenticate: specifichi cosa fare in caso di urgenza, di rabbia o di domanda fuori tema.',
        ],
        tip: 'Le Sue istruzioni evolvono: rilegga regolarmente le trascrizioni delle chiamate e aggiunga i casi gestiti male.',
      },
    ],
    related: ['editeur-de-prompt-ia', 'flow-builder', 'base-de-connaissances'],
  },
  {
    slug: 'editeur-de-prompt-ia',
    category: 'assistant',
    title: 'Usare l’assistente di scrittura (AI Prompt Editor)',
    summary: 'Modificare le istruzioni del Suo agente chiedendo semplicemente cosa vuole cambiare.',
    plan: 'Tutti i piani.',
    sections: [
      {
        title: 'Aprire l’editor',
        steps: [
          'Menu «Assistants», apra il Suo agente (deve essere stato salvato almeno una volta).',
          'Nella sezione delle istruzioni, scheda «AI Prompt Editor», clicchi su «Launch AI Prompt Editor».',
          'Scelga se continuare con le istruzioni attuali, partire da zero o da un modello.',
        ],
      },
      {
        title: 'Chiedere una modifica',
        text: 'Scriva la Sua richiesta nella chat a sinistra, in linguaggio comune. Esempi:',
        list: [
          '«Rendi il tono più caloroso.»',
          '«Aggiungi la nostra politica di reso: 30 giorni senza giustificazione.»',
          '«Aggiungi istruzioni per gestire un cliente insoddisfatto.»',
          'Le scorciatoie «Make it more concise», «Improve clarity»… eseguono i ritocchi più comuni.',
        ],
      },
      {
        title: 'Rileggere e confermare',
        list: [
          'Le modifiche proposte sono evidenziate a colori: verde per un’aggiunta, rosso per una cancellazione.',
          'Accetti o rifiuti ogni modifica («Accept» / «Reject»), oppure tutte insieme («Accept All» / «Reject All»).',
          'Clicchi su «Save» per salvare.',
        ],
        tip: 'Una modifica alla volta dà risultati migliori. Rilegga sempre prima di accettare: Lei conosce la Sua attività meglio dell’IA.',
      },
      {
        title: 'Variabili e dati dopo la chiamata',
        list: [
          'Scheda «Variables»: aggiunga campi come {customer_name} per personalizzare ogni chiamata.',
          'Scheda «Post-Call»: definisca le informazioni da estrarre da ogni chiamata (appuntamento fissato, livello di interesse…). Può chiedere all’IA: «Quali dati dovrei raccogliere?»',
        ],
      },
    ],
    related: ['consignes-system-prompt', 'donnees-apres-appel', 'tester-son-agent'],
  },
  {
    slug: 'message-d-accueil',
    category: 'assistant',
    title: 'Curare il messaggio di benvenuto',
    summary: 'Scrivere una prima frase breve e naturale, oppure usare una registrazione audio.',
    sections: [
      {
        title: 'Il messaggio di benvenuto scritto',
        text: 'È la prima frase pronunciata dall’agente («Greeting» o «Initial message»). Viene letta esattamente come è scritta.',
        list: [
          'Punti a 5–10 secondi: saluto, nome dell’azienda, domanda.',
          'Usi la punteggiatura per le pause («…» indica una pausa).',
          'Scriva i numeri come devono essere pronunciati e mantenga gli accenti.',
          'Esempio: «Buongiorno, studio Rossi, sono Giulia… Come posso aiutarLa?»',
        ],
      },
      {
        title: 'Il messaggio di benvenuto registrato',
        text: 'Per un risultato perfettamente umano, può caricare un file audio riprodotto alla risposta.',
        steps: [
          'Registri il benvenuto in un ambiente silenzioso (meno di 10 secondi).',
          'Carichi il file nelle impostazioni dell’agente e ne attivi la riproduzione.',
          'Per una transizione naturale, cloni la stessa voce per il resto della chiamata.',
        ],
      },
      {
        title: 'Verificare',
        text: 'Chiami l’agente e ascolti: pronuncia, pause, volume e passaggio alla conversazione. Preveda un benvenuto per lingua se l’agente ne parla più di una.',
      },
    ],
    related: ['choisir-la-voix', 'consignes-system-prompt', 'tester-son-agent'],
  },
  {
    slug: 'choisir-la-voix',
    category: 'assistant',
    title: 'Scegliere o clonare una voce',
    summary: 'Selezionare una voce della libreria, importarne una o clonare la Sua.',
    plan: 'Voci della libreria: tutti i piani. Voci clonate: dal piano Assistant.',
    sections: [
      {
        title: 'Scegliere una voce',
        steps: [
          'Apra l’agente, sezione «Voice & speech».',
          'Scelga la lingua, poi il fornitore della voce («TTS Provider»).',
          'Sfogli le voci (uomo, donna, accento) e le ascolti prima di confermare.',
        ],
      },
      {
        title: 'Importare una voce dalla libreria del fornitore',
        steps: [
          'Clicchi su «Import voice» accanto all’elenco delle voci.',
          'Scelga il fornitore, trovi una voce pubblica nella sua libreria e ne copi il link o l’identificativo.',
          'Lo incolli e clicchi su «Import»: la voce compare nell’elenco non appena è pronta.',
        ],
      },
      {
        title: 'Clonare una voce',
        steps: [
          'Clicchi su «Clone voice».',
          'Scelga il fornitore, la lingua e un nome.',
          'Registri o carichi un campione: una sola persona, senza rumore di fondo (almeno 10 secondi, idealmente 1 minuto o più).',
          'Al termine dell’elaborazione, selezioni la nuova voce.',
        ],
        tip: 'Cloni soltanto la Sua voce o una voce per la quale dispone del consenso scritto della persona.',
      },
    ],
    related: ['message-d-accueil', 'tester-son-agent', 'creer-un-agent'],
  },
  {
    slug: 'flow-builder',
    category: 'assistant',
    title: 'Progettare uno scenario con il Flow Builder',
    summary: 'Disegnare una conversazione a blocchi collegati, con più percorsi a seconda delle risposte.',
    plan: 'Dal piano Assistant.',
    sections: [
      {
        title: 'Quando usarlo',
        text: 'Il Flow Builder è ideale per uno script strutturato con più diramazioni (qualificazione, presa di appuntamento in più fasi). Per una conversazione semplice e libera, bastano le istruzioni scritte.',
      },
      {
        title: 'Aprire il Flow Builder',
        steps: [
          'Apra l’agente, sezione delle istruzioni, scheda «Flow Builder».',
          'Clicchi su «Launch Flow Builder».',
          'Parta dallo scenario esistente, da una pagina vuota o da un modello.',
        ],
      },
      {
        title: 'I 5 tipi di blocchi',
        list: [
          '«Start»: l’inizio della chiamata e la frase di benvenuto (uno solo per scenario).',
          '«Speak»: una frase detta parola per parola.',
          '«Prompt»: un’istruzione che l’IA riformula in base al contesto.',
          '«Action»: trasferire la chiamata, fissare un appuntamento o avviare uno strumento su misura.',
          '«End»: riagganciare, trasferire o passare la mano a un altro agente.',
        ],
      },
      {
        title: 'Creare diramazioni',
        steps: [
          'Aggiunga un blocco con «+ Add Node».',
          'In un blocco «Speak» o «Prompt», aggiunga degli esiti («Add Outcome»): «Interessato», «Non interessato», «Richiamare più tardi»…',
          'Colleghi ogni esito al blocco successivo tracciando una linea dal suo punto di uscita.',
          'Clicchi su «Save».',
        ],
        tip: 'Esporti regolarmente il Suo scenario («Export JSON») per conservarne una copia. Provi ogni percorso prima della messa in servizio.',
      },
    ],
    related: ['consignes-system-prompt', 'editeur-de-prompt-ia', 'tester-son-agent'],
  },

  // ---------- Conoscenze, calendario e strumenti ----------
  {
    slug: 'base-de-connaissances',
    category: 'tools',
    title: 'Creare una base di conoscenza',
    summary: 'Fornire all’agente i Suoi documenti e le Sue pagine web perché risponda con le Sue informazioni.',
    plan: 'Il numero di basi dipende dal Suo piano (menu «Limits»).',
    sections: [
      {
        title: 'Creare la base',
        steps: [
          'Menu «Knowledge base», poi crei una base (nome e descrizione).',
          'Aggiunga i Suoi contenuti: file PDF, Word (.docx) o di testo (.txt), oppure l’indirizzo di pagine del Suo sito.',
          'Attenda lo stato «Active» («Processing» durante l’analisi).',
          'Nell’agente, sezione «Knowledgebase», selezioni la base e salvi.',
        ],
      },
      {
        title: 'Scegliere la modalità di consultazione',
        list: [
          '«Function Call» (consigliata): l’agente consulta la base solo quando serve. Più rapida.',
          '«Prompt Injection»: la base viene consultata dopo ogni frase del cliente. Più precisa ma più lenta, adatta all’assistenza clienti.',
        ],
      },
      {
        title: 'Buone pratiche',
        list: [
          'Contenuti brevi, con titoli chiari ed elenchi.',
          'Pagine web pubbliche: alcuni siti protetti bloccano la lettura (stato «Failed»). In tal caso, esporti il contenuto in PDF e lo importi.',
          'Le 10 domande più frequenti possono anche essere inserite direttamente nelle istruzioni.',
          'Rilegga le trascrizioni per verificare che l’agente citi correttamente le Sue informazioni.',
        ],
      },
    ],
    related: ['consignes-system-prompt', 'outils-de-l-agent', 'historique-des-appels'],
  },
  {
    slug: 'rendez-vous-cal-com',
    category: 'tools',
    title: 'Presa di appuntamenti con Cal.com',
    summary: 'Collegare Cal.com perché l’agente consulti le Sue disponibilità e prenoti durante la chiamata.',
    plan: 'Tutti i piani.',
    sections: [
      {
        title: 'Ottenere la chiave Cal.com',
        steps: [
          'In Cal.com: «Settings» → «Developer» → «API Keys».',
          'Crei una chiave e la copi (inizia con cal_live_).',
        ],
      },
      {
        title: 'Collegare Cal.com all’agente',
        steps: [
          'Apra l’agente, sezione «Tools & actions», poi «Appointment Scheduling».',
          'Scelga «Cal.com» e la regione del Suo account (US per impostazione predefinita, EU se il Suo account è europeo).',
          'Incolli la chiave e scelga il tipo di appuntamento (personale o di team).',
          'Clicchi su «Sync Event»: i campi di prenotazione (nome, email, telefono, campi personalizzati) vengono configurati automaticamente.',
          'Salvi l’agente.',
        ],
      },
      {
        title: 'Perché l’invito venga inviato',
        list: [
          'Aggiunga una variabile email all’agente e la compili per i Suoi contatti, oppure chieda all’agente di raccogliere l’indirizzo.',
          'Più tipi di appuntamento? Clicchi su «+» accanto ad «Appointment Scheduling» per aggiungerne altri.',
          'Se modifica i campi in Cal.com, clicchi di nuovo su «Sync Event». In caso di errore, «Troubleshoot» reimposta i campi.',
        ],
        tip: 'Il Suo calendario Google o Outlook si collega a Cal.com: l’agente vede così le Sue disponibilità reali.',
      },
    ],
    related: ['rendez-vous-calendly', 'outils-de-l-agent', 'tester-son-agent'],
  },
  {
    slug: 'rendez-vous-calendly',
    category: 'tools',
    title: 'Presa di appuntamenti con Calendly',
    summary: 'Collegare Calendly perché l’agente verifichi gli slot e prenoti direttamente durante la chiamata.',
    plan: 'Tutti i piani.',
    sections: [
      {
        title: 'Collegare Calendly',
        steps: [
          'Apra l’agente, sezione «Tools & actions», poi «Appointment Scheduling».',
          'Scelga «Calendly», poi «Connect to Calendly», e autorizzi l’accesso.',
          'Clicchi su «Load Events» e scelga il tipo di appuntamento.',
          'Salvi l’agente.',
        ],
        tip: 'In caso di problemi di connessione, riprovi in una finestra di navigazione privata.',
      },
      {
        title: 'Impostare il luogo dell’appuntamento in Calendly',
        text: 'L’agente non può generare link di videoconferenza. In Calendly, apra il tipo di appuntamento e imposti il luogo («Location») su «Custom» (consigliato) o «Phone Call». Un appuntamento esclusivamente in videoconferenza (Meet, Zoom, Teams) farebbe fallire la prenotazione: aggiunga almeno una di queste opzioni.',
      },
      {
        title: 'Più calendari',
        text: 'Clicchi su «+» per aggiungere altri tipi di appuntamento e descriva in «When to schedule» quando usare ciascuno. Un account amministratore di organizzazione Calendly vede anche gli appuntamenti di team.',
      },
    ],
    related: ['rendez-vous-cal-com', 'outils-de-l-agent', 'tester-son-agent'],
  },
  {
    slug: 'outils-de-l-agent',
    category: 'tools',
    title: 'Strumenti dell’agente: trasferimento, fine, tastiera',
    summary: 'Le azioni integrate che l’agente può avviare durante la chiamata e come configurarle.',
    sections: [
      {
        title: 'Dove trovarli',
        text: 'Apra l’agente, sezione «Tools & actions». Ogni strumento si attiva e poi entra in azione in base a quanto scritto nelle istruzioni.',
      },
      {
        title: 'Gli strumenti integrati',
        list: [
          'Fine chiamata («End call»): l’agente riaggancia con cortesia, ad esempio quando il cliente saluta.',
          'Trasferimento («Call transfer»): l’agente passa la chiamata a una persona o a un altro numero. Indichi il numero e quando trasferire (urgenza, richiesta di un consulente, cliente pronto all’acquisto).',
          'Presa di appuntamenti («Appointment Scheduling»): Cal.com o Calendly, a loro volta collegati a Google o Outlook.',
          'Tasti della tastiera («DTMF»): l’agente digita numeri per navigare in un risponditore automatico o comporre un interno.',
        ],
      },
      {
        title: 'Andare oltre',
        list: [
          'Gli strumenti su misura interrogano il Suo software in tempo reale (magazzino, scheda cliente…).',
          'Dopo la chiamata, le automazioni inviano i risultati al Suo CRM, a Google Sheets o via email.',
        ],
        tip: 'Gli strumenti si combinano: verificare un’informazione, fissare un appuntamento, poi trasferire se necessario. Descriva questa sequenza nelle istruzioni.',
      },
    ],
    related: ['outils-sur-mesure', 'rendez-vous-cal-com', 'automatisations'],
  },
  {
    slug: 'outils-sur-mesure',
    category: 'tools',
    title: 'Creare uno strumento su misura (durante la chiamata)',
    summary: 'Consentire all’agente di interrogare il Suo software in tempo reale: stato dell’ordine, verifica del cliente, disponibilità.',
    plan: 'Il numero di strumenti dipende dal Suo piano (menu «Limits»).',
    sections: [
      {
        title: 'Creare lo strumento',
        steps: [
          'Menu «Mid call tools / MCP», poi «Create Mid-Call Tool».',
          'Nome: lettere, cifre e trattini bassi (ad esempio check_order_status).',
          'Descrizione: quando e perché l’agente deve usarlo.',
          'Tipo «HTTP request»: indichi l’indirizzo della Sua API («Endpoint»), il metodo (GET, POST…), il tempo massimo di attesa e le intestazioni (ad esempio una chiave di autorizzazione).',
        ],
      },
      {
        title: 'Definire le informazioni da raccogliere',
        list: [
          'Aggiunga i parametri che l’agente chiederà al cliente: nome, tipo (testo, numero intero, decimale, sì/no) e descrizione con il formato atteso («numero d’ordine nel formato ORD-12345»).',
          'Un parametro può comparire nell’indirizzo: https://api.esempio.com/ordini/{order_id}.',
          'I campi fissi («Static fields») vengono inviati a ogni chiamata senza che l’IA li modifichi.',
          'Variabili automatiche: {{customer_phone}} (numero del cliente), {{current_date}}, {{current_time}}, {{assistant_name}}…',
        ],
      },
      {
        title: 'Provare e collegare',
        steps: [
          'Clicchi su «Test tool»: parte una richiesta reale con dati di esempio e Lei vede la risposta.',
          'Assegni lo strumento all’agente.',
          'Nelle istruzioni, specifichi quando usarlo e come spiegare il risultato al cliente.',
        ],
        tip: 'Il tipo «Automation Platform» crea automaticamente uno scenario di automazione collegato allo strumento, per una logica in più passaggi senza codice (piano Assistant e superiori).',
      },
    ],
    related: ['outils-de-l-agent', 'automatisations', 'consignes-system-prompt'],
  },

  // ---------- Numeri e telefonia ----------
  {
    slug: 'acheter-un-numero',
    category: 'phone',
    title: 'Ottenere un numero e assegnarlo a un agente',
    summary: 'Acquistare un numero dedicato dalla Sua area, o mantenere il Suo, e poi collegarlo al Suo agente.',
    plan: 'Numeri dedicati a partire da {numberFrom} al mese a seconda del Paese; il numero incluso dipende dal piano.',
    sections: [
      {
        title: 'Acquistare un numero',
        steps: [
          'Menu «Get new phone number».',
          'Scelga il Paese e il tipo (locale, nazionale, numero verde in base alla disponibilità): il prezzo mensile viene mostrato prima dell’acquisto.',
          'Confermi: il numero compare in «Your phone numbers».',
        ],
        text: 'Il numero desiderato non è disponibile? Ci contatti: possiamo richiederlo all’operatore (documenti richiesti a seconda del Paese, in genere da 1 a 3 giorni lavorativi).',
      },
      {
        title: 'Assegnare il numero all’agente',
        steps: [
          'Menu «Assistants», apra l’agente, sezione «General».',
          'In «Phone number», selezioni il numero.',
          'Clicchi su «Save».',
        ],
      },
      {
        title: 'Mantenere il Suo numero attuale',
        list: [
          'La soluzione più semplice: attivi presso il Suo operatore un inoltro di chiamata verso il nuovo numero.',
          'Ha Twilio o Telnyx: importi i Suoi numeri.',
          'Ha un centralino o un operatore SIP: lo colleghi via SIP (tutti i piani).',
        ],
        tip: 'Dopo ogni modifica, chiami il numero per verificare che l’agente risponda.',
      },
    ],
    related: ['importer-twilio-telnyx', 'connexion-sip', 'numero-presente'],
  },
  {
    slug: 'importer-twilio-telnyx',
    category: 'phone',
    title: 'Importare i Suoi numeri Twilio o Telnyx',
    summary: 'Usare i Suoi numeri Twilio o Telnyx con il Suo agente tramite un trunk SIP.',
    plan: 'Tutti i piani.',
    sections: [
      {
        title: 'Prima di iniziare',
        text: 'Nella Sua area, apra «Your phone numbers», poi «Integrate SIP trunk»: il modulo mostra l’indirizzo SIP di ricezione da indicare presso il Suo operatore. Tenga aperta questa schermata.',
      },
      {
        title: 'Lato Twilio',
        steps: [
          'Console Twilio: «Elastic SIP Trunking» → «Create new SIP Trunk».',
          '«Termination»: inserisca solo un nome (ad esempio lasuaazienda); Twilio aggiunge .pstn.twilio.com. Annoti l’indirizzo completo.',
          'In «Authentication», configuri l’accesso (elenco di indirizzi IP o credenziali).',
          '«Origination»: aggiunga l’indirizzo SIP di ricezione mostrato nella Sua area.',
          '«Numbers»: aggiunga i numeri da utilizzare.',
        ],
      },
      {
        title: 'Lato Telnyx',
        steps: [
          'Portale Telnyx: «Voice» → «SIP Trunking» → «Create SIP Connection», tipo «FQDN».',
          'Aggiunga l’indirizzo SIP di ricezione mostrato nella Sua area (porta 5060) e lo selezioni come FQDN principale.',
          'Autenticazione in uscita: «Credentials», con un nome utente e una password da annotare.',
          'Assegni i Suoi numeri e autorizzi i Paesi da chiamare («Outbound Voice Profiles» → «Allowed Destinations»).',
        ],
      },
      {
        title: 'Importare il numero nella Sua area',
        steps: [
          '«Your phone numbers» → «Integrate SIP trunk».',
          'Inserisca il numero in formato internazionale, il nome utente e la password.',
          'Indirizzo SIP: l’indirizzo Twilio annotato (lasuaazienda.pstn.twilio.com) oppure sip.telnyx.com per Telnyx.',
          'Scelga il tipo di autorizzazione e il Paese, poi salvi.',
          'Assegni il numero al Suo agente e provi una chiamata in entrata e una in uscita.',
        ],
        tip: 'Il trunk si crea una sola volta: per ogni nuovo numero, lo aggiunga al trunk e poi lo importi. Password: almeno 12 caratteri, con maiuscole, minuscole e cifre.',
      },
    ],
    related: ['connexion-sip', 'acheter-un-numero', 'numero-presente'],
  },
  {
    slug: 'connexion-sip',
    category: 'phone',
    title: 'Collegare il Suo centralino o operatore via SIP',
    summary: 'Collegare il Suo centralino telefonico (PBX) o il Suo operatore VoIP per mantenere i Suoi numeri.',
    plan: 'Tutti i piani.',
    sections: [
      {
        title: 'Due modi per collegarsi',
        list: [
          '«SIP Extension»: l’agente diventa un interno del Suo centralino (ad esempio l’interno 1011). Ideale per provare o instradare determinate chiamate verso l’IA.',
          '«Phone Number (DID)»: un numero completo viene collegato all’agente, sia in entrata sia in uscita.',
        ],
      },
      {
        title: 'Configurare la connessione',
        steps: [
          'Menu «Your phone numbers», poi «Integrate SIP trunk».',
          'Scelga il tipo di trunk e inserisca l’interno o il numero, il nome utente e la password forniti dal Suo operatore.',
          'In uscita: indichi l’indirizzo del server SIP (senza la porta) e attivi l’IP fisso solo se il Suo operatore lo richiede.',
          'Scelga il formato dei numeri richiesto dal Suo operatore: internazionale con +, internazionale senza +, o nazionale.',
          'In entrata: configuri il Suo operatore perché punti all’indirizzo SIP di ricezione mostrato nel modulo, con autenticazione tramite indirizzi IP autorizzati o tramite nome utente e password.',
          'Scelga il Paese del trunk e salvi.',
        ],
      },
      {
        title: 'Verificare',
        list: [
          'Chiami il numero o l’interno: l’agente deve rispondere.',
          'Avvii una chiamata di prova in uscita dall’agente.',
          'Se cambia la password presso il Suo operatore, la cambi anche nella Sua area.',
        ],
        tip: 'Mantiene il pieno controllo dei Suoi numeri: è il Suo centralino a decidere quali chiamate vanno all’agente e quali restano a Lei.',
      },
    ],
    related: ['importer-twilio-telnyx', 'acheter-un-numero', 'numero-presente'],
  },
  {
    slug: 'numero-presente',
    category: 'phone',
    title: 'Scegliere il numero visualizzato nelle chiamate in uscita',
    summary: 'Visualizzare un numero dedicato, il Suo numero verificato o quello del Suo centralino SIP.',
    sections: [
      {
        title: 'Tre possibilità',
        list: [
          'Un numero dedicato acquistato nella Sua area: lo selezioni nell’agente («General» → «Phone number»). Nessuna verifica necessaria, e può anche ricevere le richiamate.',
          'Il Suo numero esistente (fisso o mobile): lo verifichi tramite un codice ricevuto via SMS o con una chiamata. Viene visualizzato dai Suoi contatti, ma le chiamate in entrata su questo numero non arrivano all’agente. (Piani a pagamento.)',
          'Il Suo centralino SIP: il numero presentato è quello autorizzato dal Suo operatore.',
        ],
      },
      {
        title: 'Regole da rispettare',
        list: [
          'Visualizzi solo numeri di cui è titolare o che ha il diritto di utilizzare.',
          'Alcuni Paesi vietano di visualizzare un numero estero o non verificato.',
        ],
        tip: 'Prima di una grande campagna, chiami il Suo telefono per verificare il numero visualizzato.',
      },
    ],
    related: ['acheter-un-numero', 'campagnes-d-appels', 'connexion-sip'],
  },

  // ---------- Sito web e messaggistica ----------
  {
    slug: 'widget-site-web',
    category: 'channels',
    title: 'Installare l’agente sul Suo sito (widget web)',
    summary: 'Aggiungere al Suo sito un pulsante di chat e di chiamata vocale, con i colori del Suo marchio.',
    plan: 'Tutti i piani.',
    sections: [
      {
        title: 'Configurare il widget',
        steps: [
          'Apra l’agente e clicchi su «Web widget».',
          'Scelga la modalità: «Voice & Chat» (consigliata), «Chat Only» o «Voice Only».',
          'Imposti la posizione, il colore, la dimensione e l’apertura automatica.',
          'Personalizzi i testi del pulsante («Button») e dell’intestazione («Header & Modal») e aggiunga il Suo avatar (immagine quadrata, massimo 512 KB).',
          'Facoltativo: un modulo prima della conversazione («Pre-Chat Form») per chiedere nome, email o telefono. Ogni campo alimenta una variabile dell’agente.',
        ],
      },
      {
        title: 'Provare e poi installare',
        steps: [
          'Provi il widget nell’anteprima dal vivo in cima alla pagina («Reset Data» simula un nuovo visitatore).',
          'Salvi, poi copi il codice della sezione «Embed Code».',
          'Lo incolli subito prima del tag </body> del Suo sito, oppure lo trasmetta al Suo webmaster.',
        ],
        tip: 'Salvi sempre prima di copiare il codice: il widget carica le sue impostazioni dalla Sua area. La voce richiede un sito in HTTPS.',
      },
      {
        title: 'Nell’uso quotidiano',
        list: [
          'Tutte le conversazioni del widget arrivano in «Inbox».',
          '«Enable Widget» consente di nascondere il widget senza rimuovere il codice.',
          'Per avere link cliccabili nella chat, chieda nelle istruzioni di scriverli nel formato [testo](indirizzo).',
        ],
      },
    ],
    related: ['historique-des-appels', 'whatsapp', 'consignes-system-prompt'],
  },
  {
    slug: 'whatsapp',
    category: 'channels',
    title: 'Collegare WhatsApp al Suo agente',
    summary: 'Lasciare che l’agente risponda su WhatsApp e inviare modelli di messaggio approvati da Meta.',
    plan: 'Tutti i piani. I messaggi vengono pagati con i crediti messaggi.',
    sections: [
      {
        title: 'Creare il mittente WhatsApp',
        steps: [
          'Menu «Channels» → «WhatsApp», poi crei un mittente.',
          'Scelga un numero acquistato nella Sua area (verifica automatica) o il Suo cellulare (codice ricevuto via SMS o con una chiamata). Questo numero non deve essere già in uso su WhatsApp.',
          'Inserisca il nome visualizzato dai clienti, poi segua la finestra di Meta («Login with Facebook») creando un nuovo account WhatsApp Business.',
        ],
        tip: 'Durante la verifica di un numero acquistato, le sue chiamate in entrata vengono intercettate per alcuni minuti: non la avvii su un numero già in servizio.',
      },
      {
        title: 'Collegare l’agente',
        steps: [
          'Quando il mittente è «Online», lo modifichi e scelga l’agente.',
          'Attivi «AI Enabled» e salvi: da quel momento l’agente risponde ai messaggi, trascrive i messaggi vocali e può analizzare le immagini.',
        ],
      },
      {
        title: 'Le regole di WhatsApp',
        list: [
          'Quando un cliente Le scrive, può rispondergli liberamente per 24 ore.',
          'Per scrivere per primo o ricontattare dopo 24 ore, serve un modello di messaggio («Template») approvato da Meta: di servizio, di marketing o di autenticazione.',
          'Un nuovo mittente è limitato a circa 250 conversazioni al giorno; il limite aumenta se i Suoi messaggi sono ben accolti (pochi blocchi e segnalazioni).',
        ],
      },
    ],
    related: ['campagnes-d-appels', 'historique-des-appels', 'automatisations'],
  },

  // ---------- Campagne e contatti ----------
  {
    slug: 'campagnes-d-appels',
    category: 'outbound',
    title: 'Avviare una campagna di chiamate (o di messaggi)',
    summary: 'Far chiamare un elenco di contatti dal Suo agente, con orari, nuovi tentativi e obiettivi.',
    plan: 'Dal piano Assistant.',
    sections: [
      {
        title: 'Prima di iniziare',
        list: [
          'Chiamate: un agente «Make phone calls» con un numero, e minuti disponibili.',
          'WhatsApp: un mittente collegato e un modello approvato. SMS: un numero abilitato agli SMS. Entrambi utilizzano i crediti messaggi.',
          'Contatti che hanno accettato di essere contattati.',
        ],
      },
      {
        title: 'Creare la campagna',
        steps: [
          'Menu «Campaigns», crei una campagna: nome, canale («Call», «WhatsApp» o «SMS») e agente.',
          'Orari: una o più fasce al giorno (ad esempio 9–12 e 14–18) e i giorni consentiti.',
          'Nuovi tentativi: numero di tentativi (da 1 a 5) e intervallo tra due tentativi; scelga se una segreteria telefonica conta come tentativo.',
          'Opzione «Retry until goal completed»: la campagna richiama finché l’obiettivo non è raggiunto (un campo sì/no dei dati dopo la chiamata, ad esempio appuntamento fissato).',
          'Aggiunga i contatti (inserimento manuale, importazione di un file), poi clicchi su «Start Campaign».',
        ],
      },
      {
        title: 'Monitorare e regolare',
        list: [
          'La dashboard della campagna mostra le chiamate in corso e terminate, i contatti rimanenti e la prossima chiamata.',
          'Per modificare le impostazioni: metta in pausa la campagna, apporti le modifiche, poi la riavvii. Non si perde nulla.',
          'Opzione di riserva: dopo l’ultimo tentativo di chiamata, inviare una sola volta un SMS o un modello WhatsApp.',
        ],
        tip: 'Inizi con 2 o 3 tentativi negli orari d’ufficio del Paese dei Suoi contatti e rispetti sempre le richieste di opposizione (menu «Blacklist»).',
      },
    ],
    related: ['contacts-leads', 'numero-presente', 'donnees-apres-appel'],
  },
  {
    slug: 'contacts-leads',
    category: 'outbound',
    title: 'Importare e gestire i Suoi contatti (lead)',
    summary: 'Importare un file di contatti, personalizzare ogni chiamata e monitorare gli stati.',
    sections: [
      {
        title: 'Preparare il file',
        list: [
          'Formato CSV o Excel, con una colonna phone_number (obbligatoria).',
          'Una colonna per ogni variabile dell’agente (ad esempio customer_name, company) per personalizzare la chiamata.',
          'Numeri in formato internazionale senza spazi (+393471234567), oppure in formato nazionale con un file per Paese.',
          'Scarichi il file di esempio proposto durante l’importazione per partire dal formato corretto.',
        ],
      },
      {
        title: 'Importare',
        steps: [
          'Menu «Leads» (o scheda contatti della campagna), poi «Import Leads».',
          'Scelga la campagna, il formato dei numeri e, se necessario, il numero di numeri secondari.',
          'Associ ogni colonna al campo corretto (rilevamento automatico), poi avvii l’importazione.',
          'Le righe non valide o duplicate vengono ignorate ed elencate in un rapporto scaricabile.',
        ],
      },
      {
        title: 'Gestire i contatti',
        list: [
          'Stati: «Created» (da chiamare), «Processing», «Rescheduled» (nuovo tentativo previsto), «Completed», «Max Retries».',
          'Riportare un contatto su «Created» lo fa richiamare; impostarlo su «Completed» interrompe le chiamate.',
          'Numeri secondari: chiamati in ordine se il principale non risponde (solo campagne di chiamate).',
          'Filtri, eliminazione multipla ed esportazione CSV sono disponibili nell’elenco.',
        ],
        tip: 'Effettui prima una piccola importazione di prova per verificare il formato, poi importi il resto.',
      },
    ],
    related: ['campagnes-d-appels', 'donnees-apres-appel', 'editeur-de-prompt-ia'],
  },

  // ---------- Monitoraggio e automazioni ----------
  {
    slug: 'historique-des-appels',
    category: 'results',
    title: 'Ritrovare le Sue chiamate e conversazioni',
    summary: 'Ascoltare le registrazioni, leggere le trascrizioni e seguire le conversazioni scritte.',
    plan: 'Tutti i piani.',
    sections: [
      {
        title: 'Le chiamate',
        steps: [
          'Menu «Calls history».',
          'Filtri per agente, per data o per direzione (in entrata / in uscita).',
          'Apra una chiamata: registrazione, trascrizione, riepilogo, dati estratti e durata.',
        ],
      },
      {
        title: 'Le conversazioni scritte',
        text: 'Il menu «Inbox» raccoglie gli scambi scritti con i Suoi agenti:',
        list: [
          '«Web widget»: le conversazioni dal Suo sito, con i dati del modulo.',
          '«WhatsApp»: gli scambi WhatsApp, con lo stato della finestra di 24 ore.',
          '«Test»: le Sue sessioni di chat di prova.',
          'Filtri per tipo, agente o data; apra una conversazione per vedere messaggi, variabili e costo.',
        ],
      },
      {
        title: 'Trarne vantaggio',
        list: [
          'Ascolti alcune chiamate ogni settimana e aggiunga alle istruzioni i casi gestiti male.',
          'Elimini le conversazioni di prova per mantenere una cronologia ordinata (l’eliminazione è definitiva).',
        ],
      },
    ],
    related: ['donnees-apres-appel', 'automatisations', 'consignes-system-prompt'],
  },
  {
    slug: 'donnees-apres-appel',
    category: 'results',
    title: 'Estrarre le informazioni da ogni chiamata',
    summary: 'Definire i dati che l’IA estrae dopo ogni chiamata e inviarli ai Suoi strumenti.',
    plan: 'Tutti i piani.',
    sections: [
      {
        title: 'Definire i dati da estrarre',
        text: 'Dopo ogni chiamata, l’IA rilegge la conversazione e compila i campi che Lei ha definito («Post-call evaluation»). Due campi esistono per impostazione predefinita: «status» (obiettivo raggiunto, sì/no) e «summary» (riepilogo).',
        steps: [
          'Apra l’agente, sezione dei dati dopo la chiamata.',
          'Aggiunga un campo: nome in minuscolo senza spazi (ad esempio appuntamento_fissato), tipo (testo, numero, sì/no) e descrizione precisa.',
          'Esempi: budget (numero), decisore (sì/no), motivo_chiamata (testo), urgenza (numero da 1 a 10).',
        ],
        tip: 'Più la descrizione è precisa, più l’estrazione è affidabile. La allinei all’obiettivo descritto nelle istruzioni.',
      },
      {
        title: 'Inviare i risultati ai Suoi strumenti',
        steps: [
          'Sezione «Webhooks & channels»: attivi l’invio e incolli l’indirizzo di ricezione (webhook).',
          'Scelga se inviare solo le chiamate completate o tutte, con o senza il link della registrazione.',
          'Salvi, poi clicchi su «Make test request» per verificare la ricezione.',
        ],
        text: 'Ogni invio contiene il numero, la durata, lo stato, i dati estratti, le variabili di origine e la trascrizione.',
      },
      {
        title: 'Usare questi dati',
        list: [
          'Ricontattare automaticamente in una campagna finché l’obiettivo non è raggiunto.',
          'Aggiornare il Suo CRM o un foglio Google Sheets, oppure avvisare il Suo team grazie alle automazioni.',
        ],
      },
    ],
    related: ['automatisations', 'historique-des-appels', 'campagnes-d-appels'],
  },
  {
    slug: 'automatisations',
    category: 'results',
    title: 'Primi passi con le automazioni',
    summary: 'Inviare automaticamente i risultati delle chiamate al Suo CRM, a Google Sheets, a Slack o via email.',
    plan: 'Dal piano Assistant (5.000 esecuzioni al mese, 50.000 con Call Center).',
    sections: [
      {
        title: 'Il principio',
        text: 'Il menu «Automate platform» apre un editor di scenari senza codice collegato a oltre 300 strumenti. Uno scenario («flow») inizia con un trigger e prosegue con una serie di azioni.',
      },
      {
        title: 'I trigger utili',
        list: [
          'Fine chiamata («Call Ended»): si avvia appena una chiamata termina, con la trascrizione e i dati estratti.',
          'Chiamata in entrata: si avvia prima che l’agente risponda, per ritrovare il cliente nel Suo CRM e personalizzare il benvenuto.',
          'Inoltre: pianificazione (ogni giorno alle 8…), webhook, evento WhatsApp.',
        ],
      },
      {
        title: 'Creare il Suo primo scenario',
        steps: [
          'Apra «Automate platform» e crei un flow (o parta da un modello).',
          'Scelga il trigger «Call Ended».',
          'Aggiunga un’azione: riga in Google Sheets, contatto nel Suo CRM, email o messaggio Slack al team.',
          'Inserisca i dati della chiamata (riepilogo, numero, campi estratti) nell’azione.',
          'Provi ogni passaggio, poi pubblichi il flow.',
        ],
        tip: 'Esempi comuni: aggiornare HubSpot dopo ogni chiamata, aggiungere un contatto qualificato a una campagna di richiamo, inviare il riepilogo via email.',
      },
    ],
    related: ['donnees-apres-appel', 'outils-sur-mesure', 'historique-des-appels'],
  },

  // ---------- Minuti e fatturazione ----------
  {
    slug: 'minutes-et-facturation',
    category: 'billing',
    title: 'Capire minuti, credito e fatturazione',
    summary: 'Come vengono conteggiati i minuti, a cosa serve il credito e dove gestire il Suo abbonamento.',
    sections: [
      {
        title: 'Cosa paga',
        list: [
          'Il Suo piano mensile, con minuti di chiamata inclusi.',
          'I minuti oltre il piano, pagati con il Suo credito («Credits»: 100 crediti = 1 $).',
          'I messaggi WhatsApp, gli SMS e le risposte scritte dell’IA, pagati con i crediti messaggi.',
          'I numeri dedicati, a partire da {numberFrom} al mese a seconda del Paese.',
        ],
      },
      {
        title: 'Il conteggio dei minuti',
        list: [
          'I minuti consumati da ogni chiamata compaiono in «Calls history».',
          'I minuti inclusi si rinnovano ogni mese, alla data del Suo abbonamento.',
          'Anche le chiamate di prova (browser o telefono) consumano minuti.',
        ],
      },
      {
        title: 'Dove gestire cosa',
        list: [
          '«Add credits»: acquistare una ricarica; il credito non scade.',
          '«Change plan»: cambiare piano. Se supera spesso i minuti, il piano superiore costa meno al minuto.',
          '«Billing info»: metodo di pagamento, fatture e abbonamento.',
          '«Limits»: cosa consente il Suo piano (agenti, chiamate simultanee, numeri…).',
        ],
        tip: 'La dashboard («Dashboard») mostra i Suoi consumi del mese. Con le automazioni, può ricevere un avviso quando si avvicina al limite.',
      },
    ],
    related: ['tester-son-agent', 'acheter-un-numero', 'campagnes-d-appels'],
  },
  // ---------- Aggiunte (playbook): inoltro di chiamata, regole per le chiamate in uscita, verifiche, controllo mensile ----------
  {
    slug: 'renvoi-d-appel',
    category: 'phone',
    title: 'Mantenere il Suo numero con l’inoltro di chiamata',
    summary: 'Far rispondere l’agente solo quando Lei non risponde, quando è occupato o fuori orario, senza cambiare numero.',
    plan: 'Tutti i piani. L’inoltro viene addebitato dal Suo operatore.',
    sections: [
      {
        title: 'Il principio',
        text: 'Il Suo numero resta sui biglietti da visita, sul sito e negli annunci. Presso il Suo operatore attiva un inoltro verso il numero dell’agente: tutte le chiamate, oppure solo quelle a cui non risponde. Per i Suoi clienti non cambia nulla.',
      },
      {
        title: 'I codici di inoltro sul cellulare',
        text: 'Con la maggior parte dei cellulari e degli operatori, digiti il codice seguito dal numero dell’agente in formato internazionale, poi # e il tasto di chiamata:',
        list: [
          'Se non risponde: **61*numero dell’agente# (spesso può aggiungere il ritardo prima dell’inoltro, per esempio **61*numero**20#).',
          'Se la linea è occupata: **67*numero dell’agente#',
          'Se il telefono è spento o non raggiungibile: **62*numero dell’agente#',
          'Tutte le chiamate, sempre: **21*numero dell’agente#',
          'Per disattivare: ##61#, ##67#, ##62# o ##21#, oppure ##002# per annullare tutto.',
        ],
      },
      {
        title: 'Su una linea fissa o un modem',
        steps: [
          'Apra l’area clienti del Suo operatore (o il menu del Suo centralino).',
          'Cerchi «inoltro di chiamata» o «trasferimento di chiamata».',
          'Scelga il tipo di inoltro (su mancata risposta, su occupato o permanente) e inserisca il numero dell’agente.',
          'Salvi, poi chiami il Suo numero da un altro telefono per verificare.',
        ],
      },
      {
        title: 'L’impostazione giusta per la Sua attività',
        list: [
          'Vuole restare Lei al telefono: inoltro su mancata risposta (dopo 15–20 secondi) e su occupato.',
          'Sera e fine settimana: inoltro permanente alla chiusura, disattivato all’apertura (alcuni centralini lo programmano).',
          'Picchi di chiamate: basta l’inoltro su occupato, l’agente gestisce le chiamate in parallelo.',
        ],
        tip: 'L’inoltro viene addebitato dal Suo operatore come una chiamata verso il numero dell’agente: verifichi la Sua tariffa, soprattutto se il numero è estero. Per un numero locale può anche importare i Suoi numeri Twilio o Telnyx oppure collegare il Suo centralino via SIP.',
      },
    ],
    related: ['acheter-un-numero', 'connexion-sip', 'importer-twilio-telnyx'],
  },
  {
    slug: 'qui-peut-on-appeler',
    category: 'outbound',
    title: 'Chi può far chiamare dal Suo agente?',
    summary: 'Le regole da rispettare prima di una campagna di chiamate in uscita: consenso, rapporto con il cliente, orari, opposizione e trasparenza.',
    plan: 'Campagne: dal piano Assistant. Questa guida è informativa e non sostituisce una consulenza legale.',
    sections: [
      {
        title: 'La regola d’oro',
        text: 'Chiami solo persone con cui ha un motivo legittimo e dimostrabile per parlare: Le hanno chiesto di essere richiamate, hanno accettato di essere contattate, oppure la chiamata riguarda un contratto o un servizio in corso con Lei. Conservi la prova di questa base (modulo, data, canale).',
      },
      {
        title: 'In Italia',
        list: [
          'Prima di chiamare per finalità commerciali, verifichi i numeri nel Registro pubblico delle opposizioni, che oggi copre anche i numeri di cellulare: chi è iscritto non può essere chiamato senza un Suo consenso specifico.',
          'Serve una base giuridica valida ai sensi del GDPR (consenso libero, specifico e documentato, oppure un rapporto contrattuale in corso), e la prova spetta a Lei.',
          'Una richiamata chiesta dalla persona, un appuntamento da confermare o un follow-up legato a un servizio in corso non sono telemarketing: restano possibili.',
          'Liste acquistate o ricavate da elenchi e portali: da evitare. Il Garante per la protezione dei dati personali sanziona regolarmente il telemarketing senza consenso.',
        ],
      },
      {
        title: 'Negli altri Paesi',
        list: [
          'Francia: dall’11 agosto 2026 il telemarketing verso i privati richiede il loro consenso preventivo, libero ed esplicito.',
          'Regno Unito: verifichi i registri TPS e CTPS e applichi il PECR e lo UK GDPR. Australia: Do Not Call Register e Spam Act per i messaggi.',
          'Polonia: consenso preventivo al marketing telefonico. Paesi Bassi: consenso preventivo o rapporto commerciale esistente.',
          'In caso di dubbio, applichi la regola più severa.',
        ],
      },
      {
        title: 'Durante la chiamata',
        list: [
          'L’agente dice fin dall’inizio di essere un’IA e che la chiamata è registrata.',
          'Indica il motivo reale della chiamata («ci aveva chiesto di essere richiamato il…»).',
          'Se la persona non vuole più essere chiamata, aggiunga il suo numero al menu «Blacklist»: sarà escluso da tutte le campagne.',
          'Chiami in orari ragionevoli, nei giorni feriali, secondo l’ora locale del contatto.',
        ],
        tip: 'Prima di importare una lista, annoti la fonte, la data del rapporto e la base giuridica. In caso di controllo, è questa scheda a tutelarLa.',
      },
    ],
    related: ['campagnes-d-appels', 'contacts-leads', 'numero-presente'],
  },
  {
    slug: 'verifier-avant-mise-en-ligne',
    category: 'start',
    title: 'Le 12 verifiche prima di mettere online il Suo agente',
    summary: 'Una lista di controllo da seguire prima di aprire la linea: evita la maggior parte dei problemi della prima settimana.',
    plan: 'Tutti i piani.',
    sections: [
      {
        title: 'Provi da un telefono vero',
        text: 'Chiami l’agente dal Suo cellulare (non dagli altoparlanti del computer), come farebbe un cliente. Lo faccia provare anche a una persona che non conosce il progetto.',
      },
      {
        title: 'La lista di controllo',
        steps: [
          'Il messaggio di benvenuto cita la Sua azienda, dice che si tratta di un’IA e pone una sola domanda chiara.',
          'Il nome della Sua azienda è pronunciato correttamente (altrimenti lo scriva in modo fonetico nelle istruzioni).',
          'Un appuntamento preso al telefono compare nel Suo calendario in meno di un minuto.',
          'Riceve il riepilogo della chiamata (email o dashboard).',
          'La richiesta «voglio parlare con qualcuno» attiva il trasferimento o la richiamata prevista.',
          'Una parola d’urgenza del Suo mestiere (perdita, dolore, guasto) attiva l’istruzione prevista.',
          'Il comportamento fuori orario corrisponde a ciò che vuole.',
          'L’agente non dà prezzi, garanzie o consigli che Lei non ha approvato.',
          'Risponde correttamente alle 5 domande che Le fanno più spesso.',
          'L’avviso di registrazione è presente se le chiamate vengono registrate.',
          'I numeri da non chiamare sono nella «Blacklist» prima di qualsiasi campagna.',
          'Ha riascoltato tre registrazioni complete e il tono La convince.',
        ],
        tip: 'Annoti ciò che non va, corregga le istruzioni o la base di conoscenza, poi ripeta solo le prove interessate.',
      },
    ],
    related: ['tester-son-agent', 'message-d-accueil', 'consignes-system-prompt'],
  },
  {
    slug: 'point-mensuel',
    category: 'results',
    title: 'Fare il punto ogni mese in 20 minuti',
    summary: 'I quattro numeri da guardare, le chiamate da riascoltare e le impostazioni da rivedere perché il Suo agente resti valido nel tempo.',
    plan: 'Tutti i piani.',
    sections: [
      {
        title: 'I 4 numeri che contano',
        list: [
          'Numero di chiamate gestite dall’agente.',
          'Richieste qualificate (con un’esigenza reale e i recapiti).',
          'Appuntamenti fissati o richiamate programmate.',
          'Valore stimato: appuntamenti × valore medio di un cliente.',
        ],
        text: 'I minuti consumati servono a seguire il Suo piano, non a misurare il risultato: guardi prima ciò che le chiamate hanno portato.',
      },
      {
        title: 'Riascolti 10 chiamate',
        steps: [
          'Menu «Calls history»: scelga 10 chiamate a caso del mese.',
          'Per ciascuna: la richiesta è stata capita? è stata fatta l’azione giusta? il tono Le va bene?',
          'Corregga le istruzioni solo se lo stesso problema si ripete almeno due volte.',
        ],
      },
      {
        title: 'Verifichi ciò che si rompe in silenzio',
        list: [
          'Il calendario è sempre collegato (un calendario rinominato o eliminato interrompe le prenotazioni).',
          'Automazioni e webhook funzionano senza errori.',
          'Orari, prezzi e chiusure sono aggiornati nella base di conoscenza.',
        ],
        tip: 'Si riservi 20 minuti il primo giorno lavorativo di ogni mese. Un agente rivisto regolarmente resta preciso; un agente dimenticato perde colpi.',
      },
    ],
    related: ['historique-des-appels', 'donnees-apres-appel', 'automatisations'],
  },
];

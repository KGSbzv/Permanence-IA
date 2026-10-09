// Testi italiani dei solleciti commerciali e dei messaggi del ciclo di vita (serie P, I, C, F, U e invio mensile M):
// traduzione di src/i18n/content/fr/ui/relances.ts, che resta la fonte e definisce il tipo `RelancesContent`.
//
// Regole (le stesse del francese):
// - nessuna cifra del prodotto scritta a mano: prezzi, minuti e prova arrivano da `RelanceFacts` (markets.ts e offerte);
// - le variabili {tra graffe} restano identiche e vengono sostituite all’invio;
// - {company} può valere «la Sua attività»: le frasi usano «per {company}» o {company} come soggetto, mai «di/a {company}»;
// - le date seguono «il giorno …» per restare corrette con qualunque giorno («il giorno 8 ottobre»);
// - i messaggi «essential» (I1, C1–C5, F1, U1) non contengono argomenti di vendita;
// - piè di pagina legale e annullamento dell’iscrizione sono aggiunti da sendMail (src/lib/emailFooter.ts).
import type { RelancesContent } from '../../fr/ui/relances';

const lowerFirst = (s: string) => (s ? s.charAt(0).toLocaleLowerCase('it-IT') + s.slice(1) : s);
const SERIES_END_UNSUBSCRIBE = 'D’ora in poi Le scriveremo al massimo una volta al mese. Per non ricevere più nulla, clicchi sul link di annullamento dell’iscrizione in fondo a questa email.';

export const UI_RELANCES: RelancesContent = {
  shared: {
    greeting: { named: 'Buongiorno {first_name},', anonymous: 'Buongiorno,' },
    companyFallback: 'la Sua attività',
    sourceLine: {
      callback_done: 'Facendo seguito al nostro colloquio del giorno {request_date}',
      callback: 'Facendo seguito alla Sua richiesta di richiamata',
      trial_request: 'Ci ha chiesto una mano per avviare la Sua prova',
      agent_lead: 'Facendo seguito alla Sua conversazione con la nostra assistente',
      demo: 'Ha provato la nostra demo dal vivo',
      contact: 'Facendo seguito al Suo messaggio',
      signup_abandoned: 'Ha iniziato a creare il Suo account',
    },
    signature: (brand) => `Il team ${brand}`,
    ctaLine: (label, url) => `${label}: ${url}`,
    list: (items) => {
      const l = items.map((s) => lowerFirst(s.trim().replace(/\.$/, '')));
      return l.length < 2 ? l.join('') : `${l.slice(0, -1).join(', ')} e ${l[l.length - 1]}`;
    },
    clause: (sentence) => lowerFirst(sentence.trim()),
  },

  messages: {
    // ---------- P: contatti non iscritti (marketing) ----------
    P1: (f) => ({
      category: 'marketing',
      subject: '{first_name}, provi l’agente sulle Sue chiamate reali',
      subjectNoName: 'Provi l’agente sulle Sue chiamate reali',
      preheader: `${f.trialDays} giorni di prova, ${f.trialMinutes} minuti di chiamate, nessun addebito durante la prova.`,
      body: [
        `{source_line}, grazie per il Suo interesse verso ${f.brand}.`,
        'Il modo più semplice per farsi un’idea è provare l’agente sulle chiamate reali per {company}.',
        {
          ol: [
            `Crei il Suo account e scelga il piano da provare: parte la prova di ${f.trialDays} giorni, con ${f.trialMinutes} minuti di chiamate.`,
            'È richiesta una carta, ma durante la prova non viene addebitato nulla.',
            'Se non fa per Lei, annulli prima della fine da Billing info: non paga nulla.',
          ],
        },
      ],
      cta: { label: 'Avvii la Sua prova', target: 'trial' },
      after: ['Ha una domanda? Risponda a questa email: la legge il nostro team.'],
    }),
    P1_signup: (f) => ({
      category: 'marketing',
      subject: '{first_name}, il Suo account non è ancora stato creato',
      subjectNoName: 'Il Suo account non è ancora stato creato',
      preheader: 'La Sua iscrizione non è ancora completata: possiamo completarla insieme.',
      body: [
        `Ha iniziato a creare il Suo account ${f.brand} dalla nostra pagina della prova gratuita, ma l’iscrizione non risulta completata.`,
        'Per avviare la prova restano due passaggi: completare l’iscrizione sulla pagina della Sua area clienti (in inglese, bastano pochi minuti), poi scegliere il piano da provare.',
        `È la scelta del piano ad avviare la prova di ${f.trialDays} giorni, con ${f.trialMinutes} minuti di chiamate. È richiesta una carta, ma durante la prova non viene addebitato nulla.`,
        'Se ha creato l’account con un altro indirizzo email, non tenga conto di questo messaggio.',
      ],
      cta: { label: 'Completi la Sua iscrizione', target: 'register' },
      after: ['Preferisce farlo insieme a noi? Lasci il Suo numero sulla nostra pagina della prova: La richiamiamo nel momento che preferisce per creare l’account e configurare l’agente insieme. Può anche rispondere semplicemente a questa email.'],
      secondary: { label: 'Richieda una richiamata', target: 'trial_assist' },
    }),
    P2: (f) => {
      const r = f.plans.receptionniste;
      return {
        category: 'marketing',
        subject: 'Quanto Le costano le chiamate senza risposta?',
        preheader: 'Un calcolo semplice, con i Suoi numeri.',
        body: [
          'Una chiamata senza risposta è spesso un cliente che compone il numero successivo della sua lista.',
          'Faccia il calcolo con i Suoi numeri:\nchiamate perse a settimana × 4,3 × valore medio di un nuovo cliente = quanto {company} rischia di perdere ogni mese.',
          `Dall’altra parte: il piano ${r.name}, ${r.price} IVA esclusa al mese per ${r.minutes} minuti. L’agente risponde 24 ore su 24, prende il messaggio o l’appuntamento e Le invia un riepilogo di ogni chiamata. Il calcolatore della nostra pagina Prezzi fa il confronto per Lei.`,
          `La cosa migliore resta misurarlo sulle Sue chiamate: ${f.trialDays} giorni di prova, ${f.trialMinutes} minuti inclusi, nessun addebito durante la prova.`,
        ],
        cta: { label: 'Avvii la Sua prova', target: 'trial' },
      };
    },
    P3: (f) => ({
      category: 'marketing',
      subject: '{sector_name}: cosa gestisce l’agente per Lei',
      preheader: 'Cosa raccoglie l’agente per Lei in queste chiamate.',
      body: [
        'Nel Suo settore c’è una situazione che si ripete spesso: {sector_problem}',
        'In queste chiamate l’agente raccoglie ciò che Le serve: {sector_handles}. Lei riceve una scheda chiara e richiama quando è disponibile, oppure l’appuntamento è già nel Suo calendario (Google Calendar o Outlook, tramite Cal.com o Calendly).',
        'Parte da un modello di istruzioni che personalizza per {company}, poi lo prova in chat, nel browser e con una vera chiamata.',
      ],
      cta: { label: `Provi per ${f.trialDays} giorni`, target: 'trial' },
    }),
    P3_generic: (f) => ({
      category: 'marketing',
      subject: 'Cosa gestisce l’agente per Lei',
      preheader: 'Cosa raccoglie l’agente per Lei in queste chiamate.',
      body: [
        'Nel Suo settore c’è una situazione che si ripete spesso: le chiamate che arrivano mentre Lei ha da fare.',
        'In queste chiamate l’agente raccoglie ciò che Le serve: chi chiama, per quale richiesta e quando richiamare. Lei riceve una scheda chiara e richiama quando è disponibile, oppure l’appuntamento è già nel Suo calendario (Google Calendar o Outlook, tramite Cal.com o Calendly).',
        'Parte da un modello di istruzioni che personalizza per {company}, poi lo prova in chat, nel browser e con una vera chiamata.',
      ],
      cta: { label: `Provi per ${f.trialDays} giorni`, target: 'trial' },
    }),
    P4: () => ({
      category: 'marketing',
      subject: 'I Suoi clienti sapranno di parlare con un’AI, ed è voluto',
      preheader: 'Lei scrive le sue istruzioni, i suoi divieti e quando Le passa la chiamata.',
      body: [
        'Fin dall’inizio della chiamata l’agente dice di essere un’AI. È un obbligo del regolamento europeo sull’IA e, soprattutto, una questione di fiducia. La sua voce è naturale, nella lingua di chi chiama.',
        'E il controllo resta a Lei:',
        {
          ul: [
            'scrive le sue istruzioni: orari, prezzi, modo di rispondere;',
            'elenca ciò che non deve mai fare: preventivi con cifre, diagnosi, promesse sui tempi;',
            'l’agente trasferisce la chiamata al Suo team quando Lei lo ha previsto, oppure organizza una richiamata con un riepilogo. Il trasferimento è incluso in tutti i piani.',
          ],
        },
      ],
      cta: { label: 'Giudichi sulle Sue chiamate', target: 'trial' },
    }),
    P5: (f) => ({
      category: 'marketing',
      subject: 'Mantiene il Suo numero attuale',
      preheader: 'Una semplice deviazione di chiamata, senza costi di installazione.',
      body: [
        'Non deve cambiare numero né avvisare i Suoi clienti.',
        'Attiva una deviazione di chiamata presso il Suo operatore, per esempio solo quando non risponde, oppure la sera e nel fine settimana. I Suoi clienti chiamano il numero di sempre e, quando Lei non può rispondere, l’agente risponde per {company}. Il Suo operatore potrebbe addebitare la deviazione verso un numero estero: verifichi la Sua tariffa.',
        `Nessun costo di installazione o di attivazione. Preferisce un numero dedicato? È un’opzione, a partire da ${f.phoneNumberFrom} IVA esclusa al mese a seconda del paese.`,
      ],
      cta: { label: 'Avvii la prova', target: 'trial' },
    }),
    P6: (f) => {
      const { receptionniste: r, assistant: a, 'centre-appels': c } = f.plans;
      return {
        category: 'marketing',
        subject: 'I nostri prezzi, senza asterischi',
        preheader: 'Tre piani, il pagamento a consumo, senza vincoli.',
        body: [
          'Ecco i nostri prezzi, IVA esclusa:',
          {
            ul: [
              `${r.name}: ${r.price} al mese, ${r.minutes} minuti;`,
              `${a.name}: ${a.price} al mese, ${a.minutes} minuti;`,
              `${c.name}: ${c.price} al mese, ${c.minutes} minuti;`,
              `senza piano: ${f.paygMinute} al minuto, credito senza scadenza.`,
            ],
          },
          `In pratica, una chiamata di ${f.exampleCallMinutes} minuti costa circa ${f.exampleCallPayg} a consumo, e tra ${f.exampleCallPlanLow} e ${f.exampleCallPlanHigh} con un piano.`,
          `Senza vincoli: disdice quando vuole da Billing info. Con la fatturazione annuale, ${f.annualFreeMonths} mesi sono in omaggio. E durante i ${f.trialDays} giorni di prova non viene addebitato nulla.`,
        ],
        cta: { label: 'Inizi la prova', target: 'trial' },
      };
    },
    P7: (f) => ({
      category: 'marketing',
      subject: 'È il momento giusto per {company}?',
      preheader: 'Ultima email di questa serie: risponda semplicemente «più avanti» o «no».',
      body: [
        'Questa è l’ultima email di questa serie: non vogliamo intasare la Sua casella.',
        'Se non è il momento giusto, risponda semplicemente «più avanti» o «no» e ne terremo conto. Altrimenti riceverà al massimo un’email al mese, con un consiglio pratico; il link in fondo a questo messaggio annulla l’iscrizione con un clic.',
        `E il giorno in cui vorrà provare: ${f.trialDays} giorni, ${f.trialMinutes} minuti di chiamate, nessun addebito durante la prova.`,
      ],
      cta: { label: 'Avvii la Sua prova', target: 'trial' },
      closing: 'Grazie per l’attenzione,',
    }),

    // ---------- I: iscritti senza prova (I1 essential, poi marketing) ----------
    I1: (f) => ({
      category: 'essential',
      subject: 'Il Suo account è stato creato: un passaggio per avviare la prova',
      preheader: 'La prova parte quando sceglie un piano nella Sua area clienti.',
      body: [
        `La Sua area clienti ${f.brand} è pronta.`,
        `Per Sua informazione, la prova gratuita di ${f.trialDays} giorni (${f.trialMinutes} minuti di chiamate) parte quando sceglie un piano nella Sua area clienti. È richiesta una carta, ma durante la prova non viene addebitato nulla; se annulla prima della fine da Billing info, non paga nulla.`,
        'L’area clienti è in inglese, ma l’assistente di supporto integrata La guida in italiano, per iscritto o a voce.',
      ],
      cta: { label: 'Scelga il Suo piano', target: 'plans' },
    }),
    I2: () => ({
      category: 'marketing',
      subject: 'Chiami il Suo agente',
      preheader: 'Chat, browser, vera chiamata: verifichi tutto prima di affidargli un cliente.',
      body: [
        'La dimostrazione migliore è il Suo agente: risponde per {company}, con i Suoi orari e i Suoi servizi.',
        'Può verificare tutto prima di affidargli anche un solo cliente:',
        { ol: ['la chat di prova, per mettere a punto le istruzioni;', 'la chiamata nel browser, per ascoltarne la voce;', 'una vera chiamata dal Suo cellulare.'] },
        'Devia le Sue chiamate solo quando il risultato La convince. La guida «Provare il Suo agente» descrive ogni passaggio.',
      ],
      cta: { label: 'Avvii la prova e verifichi', target: 'plans' },
    }),
    I3: (f) => ({
      category: 'marketing',
      subject: 'Configuriamo insieme il Suo agente?',
      preheader: 'La richiamiamo per configurare l’agente insieme a Lei.',
      body: [
        'Non ha avuto tempo di iniziare? Possiamo farlo insieme.',
        `Risponda a questa email indicando una fascia oraria e il numero a cui raggiungerLa, oppure lasci una richiesta di assistenza sulla nostra pagina della prova gratuita. La richiamiamo per configurare insieme a Lei l’agente per {company} (istruzioni, calendario, deviazione di chiamata) e avviare la prova di ${f.trialDays} giorni nelle migliori condizioni.`,
      ],
      cta: { label: 'Richieda assistenza', target: 'trial_assist' },
    }),
    I4: (f) => ({
      category: 'marketing',
      subject: `${f.trialMinutes} minuti di prova: dove usarli?`,
      preheader: 'Li dedichi alle chiamate che oggi perde.',
      body: [
        `${f.trialMinutes} minuti sono circa ${f.trialShortCalls} chiamate da ${f.shortCallMinutes} minuti. Abbastanza per giudicare, a patto di usarli nel posto giusto.`,
        'Il nostro consiglio: non devii tutto. Attivi la deviazione solo quando non risponde, oppure la sera e nel fine settimana. Sono le chiamate che oggi {company} perde, e quelle in cui l’agente Le sarà più utile.',
        'Leggerà il riepilogo di ogni chiamata nella Sua area clienti e vedrà subito se Le è utile.',
      ],
      cta: { label: 'Scelga il piano e avvii la prova', target: 'plans' },
    }),
    I5: (f) => {
      const { receptionniste: r, assistant: a, 'centre-appels': c } = f.plans;
      return {
        category: 'marketing',
        subject: 'Quale piano scegliere per iniziare?',
        preheader: 'Un riferimento semplice in base al Suo volume di chiamate.',
        body: [
          'Se ha dei dubbi, ecco un riferimento semplice (prezzi IVA esclusa al mese):',
          {
            ul: [
              `${r.name}, ${r.price}: ${r.minutes} minuti, cioè circa ${r.shortCalls} chiamate da ${f.shortCallMinutes} minuti;`,
              `${a.name}, ${a.price}: ${a.minutes} minuti, più crediti per rispondere per iscritto (chat del sito, WhatsApp);`,
              `${c.name}, ${c.price}: ${c.minutes} minuti.`,
            ],
          },
          `Non serve indovinare al primo colpo: può cambiare piano in qualsiasi momento, senza vincoli, e la modifica viene mostrata prima della conferma. Durante i ${f.trialDays} giorni di prova non viene addebitato nulla.`,
        ],
        cta: { label: 'Scelga il Suo piano', target: 'plans' },
      };
    },
    I6: (f) => ({
      category: 'marketing',
      subject: 'Un abbonamento non fa per Lei? Paghi al minuto',
      preheader: `${f.paygMinute} IVA esclusa al minuto, credito senza scadenza.`,
      body: [
        `Un abbonamento non va bene per tutti. Può anche usare il Suo agente senza piano: aggiunge credito quando vuole (Add credits), il minuto costa ${f.paygMinute} IVA esclusa e il credito non scade.`,
        `Ha così le stesse funzioni del piano ${f.plans.receptionniste.name}. Questa modalità non comprende la prova gratuita: paga solo ciò che aggiunge. Appena le Sue chiamate diventano regolari, un piano costa meno al minuto.`,
      ],
      cta: { label: 'Aggiunga credito', target: 'credits' },
    }),
    I7: (f) => ({
      category: 'marketing',
      subject: 'La Sua area clienti resta aperta',
      preheader: 'Ultima email di questa serie: la prova resta disponibile.',
      body: [
        `Questa è la nostra ultima email di questa serie. La Sua area clienti ${f.brand} resta aperta: la prova di ${f.trialDays} giorni (${f.trialMinutes} minuti, nessun addebito durante la prova) parte appena sceglie un piano.`,
        'Se c’è stato un ostacolo, ce lo dica in una riga: ci aiuta davvero.',
        SERIES_END_UNSUBSCRIBE,
      ],
      cta: { label: 'Inizi quando vuole', target: 'plans' },
    }),

    // ---------- C: prova in corso (essential, solo informativi) ----------
    C1: (f) => ({
      category: 'essential',
      subject: 'La Sua prova è iniziata: 3 passaggi per sfruttarla',
      preheader: 'La Sua prova dura fino al giorno {trial_end_date}.',
      body: [
        `La Sua prova ${f.brand} è iniziata. Dura fino al giorno {trial_end_date}, con ${f.trialMinutes} minuti di chiamate.`,
        'Per sfruttarla:',
        {
          ol: [
            'Crei il Suo agente partendo da un modello e personalizzi le istruzioni per {company}.',
            'Colleghi il Suo calendario (Cal.com o Calendly) se vuole che prenda appuntamenti.',
            'Lo chiami Lei stesso, poi attivi la deviazione di chiamata quando il risultato La convince.',
          ],
        },
        'Durante la prova non viene addebitato nulla. Può annullare prima del giorno {trial_end_date} da Billing info.',
        'Da sapere: la prova comprende minuti di chiamata, ma nessun credito messaggi. Le risposte scritte dell’AI (chat del sito, WhatsApp, Messenger) usano questi crediti, che può aggiungere in Add credits.',
      ],
      cta: { label: 'Apra la Sua area clienti', target: 'app' },
    }),
    C2: () => ({
      category: 'essential',
      skipIfEssentialOnly: true,
      subject: 'Il Suo agente aspetta la prima chiamata',
      preheader: 'Due brevi passaggi per la sua prima chiamata.',
      body: [
        'Il Suo agente non ha ancora ricevuto chiamate. Spesso è l’ultimo gradino, ed è breve:',
        {
          ol: [
            'Lo chiami dal Suo cellulare e gli faccia una domanda che farebbe un cliente.',
            'Se la risposta La convince, attivi presso il Suo operatore la deviazione su mancata risposta.',
          ],
        },
        'Mantiene il Suo numero e può disattivare la deviazione in qualsiasi momento. La Sua prova dura fino al giorno {trial_end_date}.',
      ],
      cta: { label: 'Apra la Sua area clienti', target: 'app' },
    }),
    C3: () => ({
      category: 'essential',
      skipIfEssentialOnly: true,
      subject: 'Migliori il Suo agente con le prime chiamate',
      preheader: 'Rilegga i riepiloghi e completi le istruzioni.',
      body: [
        'Le prime chiamate sono la fonte migliore per migliorare il Suo agente. Nella Sua area clienti rilegga i riepiloghi e individui:',
        {
          ul: [
            'le domande gestite male: aggiunga l’informazione nelle istruzioni;',
            'ciò che non deve mai promettere: lo elenchi, e l’agente Le rimanderà questi argomenti;',
            'le chiamate da passarLe direttamente: imposti il trasferimento in «Tools & actions».',
          ],
        },
        'La guida «Scrivere le istruzioni dell’agente» presenta i 5 blocchi di buone istruzioni, e l’assistente di scrittura (AI Prompt Editor) La aiuta a scriverle.',
      ],
      cta: { label: 'Apra la Sua area clienti', target: 'app' },
    }),
    C4: (f) => ({
      category: 'essential',
      subject: `Minuti di prova rimasti: {minutes_left} su ${f.trialMinutes}`,
      preheader: `Cosa succede una volta raggiunti i ${f.trialMinutes} minuti.`,
      body: [
        `Minuti rimasti nella Sua prova: {minutes_left} su ${f.trialMinutes}.`,
        `Per Sua informazione, una volta raggiunti i ${f.trialMinutes} minuti, le chiamate si interrompono fino alla fine della prova, il giorno {trial_end_date}, o fino all’avvio del Suo abbonamento {plan_name} da Billing info. Se non fa nulla, l’abbonamento parte da sé alla fine della prova, a meno che non lo annulli prima.`,
        'La scelta è Sua.',
      ],
      cta: { label: 'Veda il Suo abbonamento', target: 'billing' },
    }),
    C4_exhausted: (f) => ({
      category: 'essential',
      subject: `I ${f.trialMinutes} minuti della Sua prova sono esauriti`,
      preheader: 'Cosa succede ora, fino alla fine della prova.',
      body: [
        `I ${f.trialMinutes} minuti della Sua prova sono esauriti: le chiamate sono sospese fino alla fine della prova, il giorno {trial_end_date}, o fino all’avvio del Suo abbonamento {plan_name} da Billing info.`,
        'Se non fa nulla, l’abbonamento parte da sé alla fine della prova, a meno che non lo annulli prima.',
        'La scelta è Sua.',
      ],
      cta: { label: 'Veda il Suo abbonamento', target: 'billing' },
    }),
    C5: () => ({
      category: 'essential',
      subject: 'La Sua prova termina il giorno {trial_end_date}',
      preheader: 'Cosa succede in quella data, e come annullare senza addebiti.',
      body: [
        'La Sua prova termina il giorno {trial_end_date}.',
        {
          ul: [
            'Desidera continuare: non deve fare nulla. Il Suo piano {plan_name} parte quel giorno e il primo mese ({plan_price} IVA esclusa, imposte secondo il Suo paese) viene addebitato sulla Sua carta.',
            'Non desidera continuare: annulli prima di quella data da Billing info, pulsante «Cancel subscription». Non verrà addebitato nulla.',
          ],
        },
        'Ha una domanda sul Suo piano o sui Suoi minuti? Risponda a questa email.',
      ],
      cta: { label: 'Gestisca il Suo abbonamento', target: 'billing' },
    }),
    C5_annual: () => ({
      category: 'essential',
      subject: 'La Sua prova termina il giorno {trial_end_date}',
      preheader: 'Cosa succede in quella data, e come annullare senza addebiti.',
      body: [
        'La Sua prova termina il giorno {trial_end_date}.',
        {
          ul: [
            'Desidera continuare: non deve fare nulla. Il Suo piano {plan_name} parte quel giorno con fatturazione annuale: il primo anno ({plan_price} IVA esclusa, imposte secondo il Suo paese) viene addebitato sulla Sua carta in un’unica soluzione.',
            'Non desidera continuare: annulli prima di quella data da Billing info, pulsante «Cancel subscription». Non verrà addebitato nulla.',
          ],
        },
        'Ha una domanda sul Suo piano o sui Suoi minuti? Risponda a questa email.',
      ],
      cta: { label: 'Gestisca il Suo abbonamento', target: 'billing' },
    }),
    C5_cancelled: () => ({
      category: 'essential',
      subject: 'La Sua prova termina il giorno {trial_end_date}: non verrà addebitato nulla',
      preheader: 'Il Suo annullamento è stato registrato.',
      body: [
        'Ha annullato il Suo abbonamento durante la prova: l’annullamento è stato registrato.',
        'La Sua prova resta attiva fino al giorno {trial_end_date}. Il Suo piano non partirà in quella data e sulla Sua carta non verrà addebitato nulla.',
        'Se si tratta di un errore, o se ha una domanda, risponda semplicemente a questa email.',
      ],
      cta: { label: 'Veda il Suo abbonamento', target: 'billing' },
    }),

    // ---------- F: prova terminata senza piano (F1 essential, poi marketing) ----------
    F1: (f) => ({
      category: 'essential',
      subject: 'La Sua prova è terminata, non è stato addebitato nulla',
      preheader: 'Una domanda: basta una riga di risposta.',
      body: [
        'La Sua prova si è conclusa senza abbonamento: non è stato addebitato nulla, ed è un Suo pieno diritto.',
        'Può dirci in una riga cosa è mancato? La voce, le risposte, la configurazione, il prezzo, il momento… Risponda semplicemente a questa email: il nostro team legge ogni risposta e, se un’impostazione può cambiare le cose, glielo diremo.',
        `Grazie per aver provato ${f.brand}.`,
      ],
      cta: null,
    }),
    F1_payment_failed: () => ({
      category: 'essential',
      subject: 'La Sua prova è terminata: il pagamento non è andato a buon fine',
      preheader: 'Il Suo abbonamento non è partito e non è stato addebitato nulla.',
      body: [
        'La Sua prova è giunta al termine, ma il pagamento del Suo piano non è andato a buon fine. Il Suo abbonamento quindi non è partito e non è stato addebitato nulla.',
        'Se desidera continuare, registri una carta valida in Billing info (scheda Wallet), poi scelga di nuovo il Suo piano.',
        'Ha una domanda o ha bisogno di aiuto? Risponda semplicemente a questa email.',
      ],
      cta: { label: 'Aggiorni la Sua carta', target: 'billing' },
    }),
    F2: (f) => ({
      category: 'marketing',
      subject: 'Tenga il Suo agente, senza abbonamento',
      preheader: 'Il pagamento a consumo, senza abbonamento.',
      body: [
        'Se a frenarLa è stato l’abbonamento, c’è un’altra formula: il pagamento a consumo.',
        `La Sua area clienti resta accessibile. Aggiunge credito quando vuole (Add credits), il minuto costa ${f.paygMinute} IVA esclusa, senza abbonamento, e il credito non scade. Mantiene le stesse funzioni del piano ${f.plans.receptionniste.name}. Una chiamata di ${f.exampleCallMinutes} minuti costa circa ${f.exampleCallPayg} IVA esclusa.`,
      ],
      cta: { label: 'Aggiunga credito', target: 'credits' },
    }),
    F3: () => ({
      category: 'marketing',
      subject: 'E se l’agente rispondesse solo la sera e nel fine settimana?',
      preheader: 'A supporto del Suo team, non al suo posto.',
      body: [
        'Molte aziende non usano l’agente per tutto. Lo tengono a supporto del proprio team: subentra la sera, nel fine settimana, durante la pausa pranzo o quando tutte le linee sono occupate.',
        'Basta impostare la deviazione di chiamata presso il Suo operatore per quei momenti. Per il resto del tempo per {company} non cambia nulla, e le chiamate che finivano in segreteria ricevono finalmente una risposta, con un riepilogo per Lei.',
      ],
      cta: { label: 'Riprenda con un piano', target: 'plans' },
    }),
    F4: () => ({
      category: 'marketing',
      subject: 'Le 3 impostazioni che cambiano di più le Sue chiamate',
      preheader: 'Il più delle volte manca un’informazione nelle istruzioni.',
      body: [
        'Quando un agente delude durante la prova, il più delle volte manca un’informazione nelle sue istruzioni. Le tre impostazioni che cambiano di più il risultato:',
        {
          ol: [
            'Informazioni pratiche complete: orari, zona servita, prezzi indicativi, tempi.',
            'L’elenco di ciò che non deve mai fare, perché Le rimandi questi argomenti.',
            'Il trasferimento al Suo team per i casi delicati, incluso in tutti i piani.',
          ],
        },
        'L’assistente di scrittura della Sua area clienti (AI Prompt Editor) La aiuta a scriverle.',
      ],
      cta: { label: 'Riprenda con queste impostazioni', target: 'plans' },
    }),
    F5: (f) => {
      const { receptionniste: r, assistant: a, 'centre-appels': c } = f.plans;
      return {
        category: 'marketing',
        subject: 'Più chiamate ha, meno costa il minuto',
        preheader: 'Il prezzo reale del minuto, piano per piano.',
        body: [
          'Con un piano, il prezzo reale del minuto scende con il volume:',
          {
            ul: [
              `${r.name}, ${r.price} IVA esclusa/mese per ${r.minutes} minuti: circa ${r.perMinute} al minuto;`,
              `${a.name}, ${a.price} IVA esclusa/mese per ${a.minutes} minuti: circa ${a.perMinute};`,
              `${c.name}, ${c.price} IVA esclusa/mese per ${c.minutes} minuti: circa ${c.perMinute}.`,
            ],
          },
          `Con la fatturazione mensile è senza vincoli: disdice in qualsiasi momento da Billing info. Con quella annuale paga ${f.annualPaidMonths} mesi su 12. Il calcolatore della nostra pagina Prezzi sceglie il piano più conveniente in base alle Sue chiamate.`,
        ],
        cta: { label: 'Confronti e scelga', target: 'pricing' },
      };
    },
    F6: () => ({
      category: 'marketing',
      subject: 'La aiutiamo a configurarlo?',
      preheader: 'Una persona del nostro team La richiama, senza impegno.',
      body: [
        'Spesso non è l’agente a deludere, ma un’istruzione che manca o una deviazione di chiamata impostata male.',
        'Risponda a questa email indicando una fascia oraria e il numero a cui raggiungerLa: una persona del nostro team La richiama per configurare insieme a Lei l’agente per {company} (istruzioni, trasferimento, deviazione di chiamata), prima che scelga un piano. Nessun impegno, è un semplice scambio.',
      ],
      cta: null,
    }),
    F7: (f) => ({
      category: 'marketing',
      subject: 'Ci fermiamo qui, grazie per aver provato',
      preheader: 'Ultima email di questa serie.',
      body: [
        `Questa è la nostra ultima email di questa serie. Grazie per aver provato ${f.brand}.`,
        `La Sua area clienti resta accessibile: può riprendere con un piano, senza vincoli, oppure a consumo, a ${f.paygMinute} IVA esclusa al minuto.`,
        SERIES_END_UNSUBSCRIBE,
      ],
      cta: { label: 'La Sua area clienti', target: 'app' },
    }),

    // ---------- U: account a consumo poco attivi (U1 essential, poi marketing) ----------
    U1: () => ({
      category: 'essential',
      subject: 'Il Suo agente riceve correttamente le chiamate?',
      preheader: 'Una verifica di un minuto.',
      body: [
        'Negli ultimi 30 giorni il Suo agente ha ricevuto poche chiamate. Forse è voluto, ma a volte è una deviazione di chiamata disattivata o impostata male.',
        'Verifica in un minuto:',
        {
          ol: [
            'Chiami il Suo numero abituale nel momento in cui la deviazione dovrebbe attivarsi.',
            'Se l’agente non risponde, controlli la deviazione presso il Suo operatore, oppure il numero collegato nella Sua area clienti.',
          ],
        },
        'Se tutto funziona, non cambi nulla.',
      ],
      cta: { label: 'Apra la Sua area clienti', target: 'app' },
    }),
    U2: () => ({
      category: 'marketing',
      subject: 'Gli affidi solo le chiamate che perde',
      preheader: 'La deviazione solo quando non risponde.',
      body: [
        'Non deve affidare tutto all’agente. Con una deviazione su mancata risposta o su occupato (se il Suo operatore la offre), risponde Lei quando può e l’agente subentra solo quando Lei non può.',
        'Risultato: meno chiamate perse per {company}, e paga solo i minuti effettivamente usati.',
      ],
      cta: { label: 'La Sua area clienti', target: 'app' },
    }),
    U3: (f) => {
      const r = f.plans.receptionniste;
      return {
        category: 'marketing',
        subject: 'Da quando un piano costa meno?',
        preheader: 'Il calcolo, con il prezzo del minuto a consumo.',
        body: [
          `Il calcolo è semplice: a ${f.paygMinute} IVA esclusa al minuto, ${r.price} corrispondono a circa ${f.breakEvenMinutes} minuti.`,
          {
            ul: [
              `Meno di ${f.breakEvenMinutes} minuti al mese: resti a consumo, è la soluzione più economica.`,
              `Più di ${f.breakEvenMinutes} minuti: il piano ${r.name} (${r.minutes} minuti per ${r.price} IVA esclusa) costa meno, circa ${r.perMinute} al minuto.`,
            ],
          },
          'Segue i Suoi consumi nella Sua area clienti, e un piano si disdice in qualsiasi momento da Billing info.',
        ],
        cta: { label: 'Veda i Suoi consumi', target: 'app' },
      };
    },
    U4: () => ({
      category: 'marketing',
      subject: 'Due funzioni già incluse nel Suo account',
      preheader: 'Il trasferimento e il calendario, senza costi per singolo utilizzo.',
      body: [
        'Due funzioni sono già incluse, senza costi per singolo utilizzo:',
        {
          ul: [
            'il trasferimento: l’agente passa al Suo team le chiamate importanti (cliente scontento, urgenza) secondo le Sue regole, in «Tools & actions»; la durata trasferita viene scalata dai Suoi minuti;',
            'il calendario: collegato tramite Cal.com o Calendly, prenota le Sue fasce libere durante la chiamata.',
          ],
        },
        'Infine, per non restare mai a zero credito, può attivare la ricarica automatica; un avviso via email La informa già quando il saldo si sta esaurendo.',
      ],
      cta: { label: 'La Sua area clienti', target: 'app' },
    }),
    U5: (f) => {
      const x = f.assistantExtras;
      if (!x) return null;
      const a = f.plans.assistant;
      return {
        category: 'marketing',
        subject: 'Rispondere anche per iscritto, con la Sua voce',
        preheader: `Cosa aggiunge il piano ${a.name}, senza vincoli.`,
        body: [
          `A consumo ha le funzioni del piano ${f.plans.receptionniste.name}, senza crediti di messaggi inclusi. Il piano ${a.name} (${a.price} IVA esclusa al mese) aggiunge:`,
          {
            ul: [
              `${a.minutes} minuti di chiamate e ${x.agents} agenti;`,
              `${x.messageCredits} crediti di messaggi al mese, cioè circa ${x.writtenReplies} risposte scritte dell’AI (chat del sito, WhatsApp);`,
              `${x.clonedVoices} voce clonata: la Sua, o quella di una persona che Le ha dato il consenso scritto. L’agente dice sempre di essere un’AI.`,
            ],
          },
          'Senza vincoli, disdetta in qualsiasi momento da Billing info.',
        ],
        cta: { label: 'Veda i piani', target: 'plans' },
      };
    },
    U6: (f) => ({
      category: 'marketing',
      subject: 'La Sua formula, al Suo ritmo',
      preheader: 'Ultima email di questa serie.',
      body: [
        'Questa è la nostra ultima email di questa serie. In sintesi:',
        {
          ul: [
            `poche chiamate: il consumo, a ${f.paygMinute} IVA esclusa al minuto, resta la soluzione più adatta, e il Suo credito non scade;`,
            `chiamate regolari: un piano costa meno, senza vincoli con la fatturazione mensile, con ${f.annualFreeMonths} mesi in omaggio con quella annuale.`,
          ],
        },
        SERIES_END_UNSUBSCRIBE,
      ],
      cta: { label: 'La Sua area clienti', target: 'app' },
    }),

    // ---------- A : mise en route (service, audit du 9 oct., § 7) ----------
    A1: (f) => ({
      category: 'essential',
      subject: 'Il Suo agente non è ancora stato creato: bastano una decina di minuti',
      preheader: 'Tre passaggi perché risponda alle Sue chiamate.',
      body: [
        `La Sua area clienti ${f.brand} è pronta, ma non vi è ancora stato creato nessun agente. È l’agente a rispondere alle Sue chiamate, e per crearlo bastano una decina di minuti:`,
        {
          ol: [
            'Nella Sua area clienti apra «Assistants», poi «Create», e parta da un modello.',
            'Adatti le istruzioni per {company}: orari, servizi, cosa deve annotare per Lei.',
            'Lo provi, poi gli colleghi un numero: «Get new phone number» se non ne ha ancora uno (opzione mensile), poi sezione «General», campo «Phone number».',
          ],
        },
        'Le serve aiuto? L’assistente di supporto (bolla in basso a destra nella Sua area clienti) La guida passo passo, in italiano, per iscritto o a voce.',
      ],
      cta: { label: 'Crei il Suo agente', target: 'app' },
      secondary: { label: 'La guida passo passo: creare un agente', target: 'guide_create' },
    }),
    A2: () => ({
      category: 'essential',
      subject: 'Configuriamo il Suo agente insieme a Lei?',
      preheader: 'Lasci il Suo numero: La richiamiamo per crearlo insieme.',
      body: [
        'Il Suo agente non è ancora stato creato. Se il tempo Le manca, o se non sa da dove cominciare, possiamo configurarlo insieme a Lei, al telefono.',
        'Lasci il Suo numero e il momento che preferisce: La richiamiamo per creare insieme l’agente per {company} (istruzioni, numero, deviazione di chiamata). Può anche rispondere a questa email indicando una fascia oraria.',
      ],
      cta: { label: 'Chieda una richiamata per configurarlo insieme', target: 'setup_assist' },
      after: ['Preferisce fare da sé? La guida «Creare e modificare un agente» descrive ogni passaggio, e l’assistente di supporto della Sua area clienti risponde alle Sue domande.'],
      secondary: { label: 'Legga la guida', target: 'guide_create' },
    }),
    A3: () => ({
      category: 'essential',
      skipIfEssentialOnly: true,
      subject: 'La Sua prova dura fino al giorno {trial_end_date}: il Suo agente non è ancora stato creato',
      preheader: 'C’è ancora tempo per provarlo: possiamo configurarlo insieme a Lei.',
      body: [
        'La Sua prova dura fino al giorno {trial_end_date}, ma il Suo agente non è ancora stato creato. È il nostro ultimo messaggio su questo argomento.',
        'C’è ancora tempo per provarlo su chiamate reali: possiamo configurarlo insieme a Lei, al telefono. Lasci il Suo numero, oppure risponda a questa email indicando una fascia oraria.',
        'Se ha cambiato idea, può annullare prima del giorno {trial_end_date} da Billing info: non verrà addebitato nulla.',
      ],
      cta: { label: 'Chieda una richiamata per configurarlo insieme', target: 'setup_assist' },
    }),
    A3_active: (f) => ({
      category: 'essential',
      skipIfEssentialOnly: true,
      subject: 'Il Suo account è attivo, ma il Suo agente non è ancora stato creato',
      preheader: 'Possiamo configurarlo insieme a Lei, al telefono.',
      body: [
        `Il Suo account ${f.brand} è attivo, ma il Suo agente non è ancora stato creato: per ora nessuna chiamata viene gestita. È il nostro ultimo messaggio su questo argomento.`,
        'Possiamo configurarlo insieme a Lei, al telefono: lasci il Suo numero, oppure risponda a questa email indicando una fascia oraria.',
      ],
      cta: { label: 'Chieda una richiamata per configurarlo insieme', target: 'setup_assist' },
    }),
    A4: () => ({
      category: 'essential',
      skipIfEssentialOnly: true,
      subject: 'Il Suo agente è pronto: lo provi e attivi la deviazione di chiamata',
      preheader: 'Tre verifiche prima delle sue prime chiamate.',
      body: [
        'Il Suo agente è stato creato, ma non ha ancora ricevuto una vera chiamata. Di solito bastano tre verifiche:',
        {
          ol: [
            'Gli assegni un numero: se non ne ha ancora uno, lo ottenga da «Get new phone number» (opzione mensile, prezzo indicato prima dell’acquisto), poi in «Assistants» apra l’agente, sezione «General», campo «Phone number».',
            'Chiami quel numero dal Suo cellulare e faccia una domanda che farebbe un cliente.',
            'Se la risposta La convince, attivi presso il Suo operatore la deviazione verso quel numero, ad esempio solo quando non risponde. Mantiene il Suo numero.',
          ],
        },
        'Le due guide qui sotto descrivono ogni passaggio, e l’assistente di supporto della Sua area clienti risponde alle Sue domande.',
      ],
      cta: { label: 'Guida: provare il Suo agente', target: 'guide_test' },
      secondary: { label: 'Guida: mantenere il Suo numero con la deviazione di chiamata', target: 'guide_forwarding' },
    }),
    A_monthly: () => ({
      category: 'essential',
      skipIfEssentialOnly: true,
      subject: 'Negli ultimi 30 giorni il Suo agente non ha ricevuto chiamate',
      preheader: 'Una verifica di un minuto, anche insieme a noi.',
      body: [
        'Negli ultimi 30 giorni il Suo agente non ha ricevuto nessuna chiamata. Forse è voluto, ma spesso si tratta di un numero non più collegato all’agente o di una deviazione di chiamata disattivata.',
        'Verifica in un minuto:',
        {
          ol: [
            'Chiami il Suo numero abituale nel momento in cui la deviazione dovrebbe attivarsi.',
            'Se l’agente non risponde, controlli la deviazione presso il Suo operatore, oppure il numero collegato all’agente nella Sua area clienti (sezione «General»).',
          ],
        },
        'Preferisce verificarlo con noi? Lasci il Suo numero: La richiamiamo per controllare insieme.',
      ],
      cta: { label: 'Chieda una richiamata per verificare insieme', target: 'setup_assist' },
      secondary: { label: 'Guida: mantenere il Suo numero con la deviazione di chiamata', target: 'guide_forwarding' },
    }),

    // ---------- S : solde de minutes d’un abonné ou d’un compte à la minute (service ; l’essai a C4) ----------
    S1: (f) => ({
      category: 'essential',
      subject: 'Minuti di chiamata rimasti: {minutes_left}',
      preheader: 'Cosa succede quando il saldo arriva a 0.',
      body: [
        `Per Sua informazione, il saldo minuti del Suo account ${f.brand} è basso (minuti rimasti: {minutes_left}).`,
        'Quando arriva a 0, il Suo agente non risponde più alle chiamate finché non vengono aggiunti minuti: al rinnovo del Suo piano, se ne ha uno, oppure in qualsiasi momento da Add credits.',
        'Se questo livello Le va bene, non deve fare nulla.',
      ],
      cta: { label: 'Veda i Suoi minuti', target: 'credits' },
    }),
    S2: (f) => ({
      category: 'essential',
      subject: 'Il Suo saldo minuti è esaurito: il Suo agente non risponde più alle chiamate',
      preheader: 'Riprende appena vengono aggiunti minuti.',
      body: [
        `Il saldo minuti del Suo account ${f.brand} è a 0: per ora il Suo agente non risponde alle chiamate.`,
        'Riprende appena vengono aggiunti minuti: al rinnovo del Suo piano, se ne ha uno, oppure subito da Add credits.',
        'Ha domande? Risponda semplicemente a questa email.',
      ],
      cta: { label: 'Aggiunga minuti', target: 'credits' },
    }),
  },

  // ---------- M: invio mensile (marketing) ----------
  monthly: {
    // Stessa rotazione del francese, tratta dalle guide pubblicate (src/i18n/content/it/guides.ts).
    topics: [
      {
        slug: 'tester-son-agent',
        title: 'provare il Suo agente in 3 modi',
        paragraph: 'Prima di affidare anche un solo cliente al Suo agente, lo provi in tre modi: la chat di prova per verificarne le istruzioni, la chiamata nel browser per ascoltarne la voce, poi una vera chiamata telefonica, l’unica che verifica tutti gli strumenti, compreso il trasferimento. Le prove vocali consumano minuti come le chiamate reali.',
      },
      {
        slug: 'consignes-system-prompt',
        title: 'i 5 blocchi di buone istruzioni',
        paragraph: 'Buone istruzioni si articolano in cinque blocchi: il ruolo dell’agente (dice fin dall’inizio di essere un’AI), il suo stile, le informazioni chiave (servizi, orari, tariffe, indirizzo), le regole (quando trasferire, cosa non promettere mai) e le procedure per le situazioni frequenti. Rilegga regolarmente le trascrizioni delle chiamate e aggiunga i casi gestiti male.',
      },
      {
        slug: 'consignes-system-prompt',
        title: 'ciò che il Suo agente non deve mai fare',
        paragraph: 'È Lei a decidere ciò che il Suo agente non deve mai fare: fornire un preventivo con cifre, formulare una diagnosi, promettere tempi. Lo elenchi nelle sue istruzioni: l’agente rimanderà questi argomenti al Suo team, con un riepilogo della richiesta.',
      },
      {
        slug: 'renvoi-d-appel',
        title: 'mantenere il Suo numero con la deviazione di chiamata',
        paragraph: 'Il Suo numero resta sui biglietti da visita, sul sito e negli annunci: presso il Suo operatore attiva una deviazione verso il numero dell’agente, per tutte le chiamate oppure solo per quelle a cui non risponde. Per i Suoi clienti non cambia nulla. La deviazione viene addebitata dal Suo operatore: verifichi la Sua tariffa.',
      },
    ],
    prospect: (f) => ({
      category: 'marketing',
      subject: 'Il consiglio del mese: {topic_title}',
      preheader: 'Un consiglio pratico tratto dalle nostre guide.',
      body: ['{topic_paragraph}'],
      cta: { label: `Provi per ${f.trialDays} giorni`, target: 'trial' },
      after: ['È un’email mensile; può annullare l’iscrizione con un clic in fondo a questo messaggio.'],
    }),
    account: () => ({
      category: 'marketing',
      subject: 'Il consiglio del mese: {topic_title}',
      preheader: 'Un consiglio pratico tratto dalle nostre guide.',
      body: ['{topic_paragraph}'],
      cta: { label: 'Apra la Sua area clienti', target: 'app' },
      after: ['È un’email mensile; può annullare l’iscrizione con un clic in fondo a questo messaggio.'],
    }),
  },
};

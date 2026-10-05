// FAQ generali e FAQ sui prezzi.
import type { QA } from '../fr/faq';

export type { QA } from '../fr/faq';

export const FAQ_GENERAL: QA[] = [
  { q: 'Come funziona la piattaforma di chiamate AI?', a: 'Configura un agente vocale con le Sue informazioni, le Sue regole e il Suo tono. L’agente risponde alle chiamate in entrata, effettua le chiamate in uscita autorizzate, qualifica le richieste, prenota gli appuntamenti e Le invia un riepilogo di ogni conversazione.' },
  { q: 'Quanto tempo serve per iniziare?', a: 'Un primo agente è pronto in pochi minuti a partire dalle Sue informazioni. Per una configurazione completa (calendario, numeri, trasferimenti) servono in genere uno o due giorni, con il nostro supporto.' },
  { q: 'Servono competenze tecniche?', a: 'No. Lei descrive la Sua attività, l’assistente per i prompt La guida e noi La aiutiamo con la telefonia e le integrazioni.' },
  { q: 'Cosa succede se l’agente non sa rispondere?', a: 'Non inventa: annota la richiesta, propone una richiamata o trasferisce la chiamata al Suo team secondo le regole che ha stabilito.' },
  { q: 'L’agente può gestire più chiamate contemporaneamente?', a: 'Sì. Più chiamate vengono gestite in parallelo sulla stessa linea: i Suoi clienti non restano più in attesa.' },
  { q: 'In cosa si differenzia da una segreteria o da un centralino tradizionale?', a: 'Una segreteria registra, un centralino smista. L’agente AI comprende la richiesta, pone le domande utili, agisce (appuntamento, richiamata, risposta) e Le invia una scheda pronta da usare.' },
  { q: 'Posso usare il mio sistema telefonico attuale?', a: 'Sì. Può inoltrare la Sua linea attuale all’agente, collegare il Suo centralino o il Suo operatore tramite SIP, oppure importare i Suoi numeri Twilio e Telnyx.' },
  { q: 'Posso collegare il mio calendario?', a: 'Sì: Google Calendar, Outlook, Cal.com e Calendly. L’agente propone gli orari liberi e prenota direttamente.' },
  { q: 'Posso modificare i prompt?', a: 'Sì. L’editor di prompt Le permette di impostare l’obiettivo, il tono, le domande e i limiti dell’agente, con una guida passo passo e senza competenze tecniche.' },
  { q: 'Posso creare scenari senza codice?', a: 'Sì, con il flow builder a partire dal piano Assistant: concatena trigger e azioni con il drag and drop, collegati a oltre 300 strumenti.' },
  { q: 'Posso usare WhatsApp e Instagram?', a: 'Sì, a partire dal piano Assistant: SMS, WhatsApp, Messenger e Instagram, con cronologia centralizzata.' },
  { q: 'Fornite numeri di telefono?', a: 'Sì, come opzione: un numero dedicato si acquista dalla Sua area clienti e si paga ogni mese, oltre al piano (ad esempio 3,99 $ IVA esclusa al mese per un numero degli Stati Uniti o del Canada; il prezzo esatto viene mostrato prima dell’acquisto). Paesi disponibili all’acquisto: Stati Uniti, Canada, Regno Unito, Australia, Italia, Paesi Bassi, Polonia, Danimarca, Finlandia, Romania, Israele, Sudafrica. Per un numero di un altro paese, o per mantenere il Suo: inoltro di chiamata, importazione da Twilio o Telnyx, oppure connessione SIP.' },
  { q: 'Posso usare SIP?', a: 'Sì, a partire dal piano Assistant. La guidiamo nel collegamento del Suo trunk SIP o del Suo centralino.' },
  { q: 'Come caricate le informazioni della mia azienda?', a: 'Aggiunge i Suoi documenti PDF, le pagine del Suo sito o le Sue procedure nella base di conoscenza. L’agente le consulta durante la chiamata.' },
  { q: 'È conforme al GDPR?', a: 'La piattaforma offre gli strumenti necessari: consenso, lista di esclusione, periodo di conservazione configurabile, cancellazione dei dati e controllo degli accessi. La configurazione e le informative restano da adattare alla Sua attività; La accompagniamo in questo.' },
  { q: 'Come funziona la prova gratuita?', a: 'Crea il Suo account, poi sceglie il piano da provare: i primi 14 giorni sono gratuiti, con 30 minuti di chiamate inclusi. All’attivazione è richiesta una carta, ma durante la prova non viene addebitato nulla. Se annulla prima della fine dei 14 giorni, non paga nulla.' },
  { q: 'L’area clienti è in italiano?', a: 'L’interfaccia dell’area clienti è in inglese. Un’assistente di supporto integrata La guida in italiano, per iscritto o a voce, e la pagina Aiuto dell’area clienti traduce ogni menu e illustra passo passo le operazioni più comuni.' },
  { q: 'Chi mi richiama quando lascio il mio numero?', a: 'La nostra assistente vocale AI La richiama in orario d’ufficio per capire le Sue esigenze e mostrarLe una demo; se lo desidera, subentra un consulente. Può chiedere in qualsiasi momento di non essere più richiamato.' },
  { q: 'L’agente si presenta come un’AI?', a: 'Sì. L’agente si presenta in modo trasparente come assistente AI e può trasferire la chiamata a una persona quando Lei lo ha previsto.' },
];

export const FAQ_PRICING: QA[] = [
  { q: 'Cosa succede dopo i 30 minuti di prova?', a: 'I 30 minuti sono il limite del periodo di prova: una volta raggiunti, le chiamate si interrompono fino alla fine della prova o fino all’avvio del Suo abbonamento. Al termine dei 14 giorni parte il piano scelto, a meno che non lo abbia annullato dalla Sua area clienti.' },
  { q: 'I prezzi sono IVA esclusa?', a: 'Sì, tutti i prezzi sono indicati IVA esclusa. Le imposte locali si aggiungono se applicabili.' },
  { q: 'Cosa succede se supero i miei minuti?', a: 'Può aggiungere minuti in qualsiasi momento con una ricarica, per coprire un mese più intenso. Se li supera regolarmente, il piano superiore costa meno al minuto: glielo segnaliamo.' },
  { q: 'Il numero di telefono è incluso nel piano?', a: 'No. Il piano comprende i minuti e le funzioni; un numero dedicato è un’opzione a pagamento mensile, al prezzo mostrato prima dell’acquisto. Può anche usare il Suo numero attuale senza costi da parte nostra: inoltro di chiamata (il Suo operatore potrebbe addebitare l’inoltro verso un numero estero), importazione da Twilio o Telnyx, oppure SIP.' },
  { q: 'Posso usare il mio numero?', a: 'Sì, tramite inoltro di chiamata, importazione da Twilio o Telnyx, oppure connessione SIP a partire dal piano Assistant.' },
  { q: 'Avete una demo dal vivo?', a: 'Sì. Può parlare con l’agente dal Suo browser o chiedere di essere richiamato per una dimostrazione.' },
  { q: 'Perché una ricarica costa di più al minuto rispetto a un piano?', a: 'La ricarica serve per esigenze occasionali. Il piano resta la soluzione più conveniente per un volume regolare: più è grande, più il prezzo al minuto scende.' },
  { q: 'Come vengo fatturato?', a: 'L’abbonamento viene addebitato ogni mese sulla Sua carta, alla data di rinnovo, e la fattura è disponibile nella Sua area clienti (Billing info). Le ricariche di minuti vengono fatturate al momento dell’acquisto. Le imposte sono calcolate automaticamente in base al Suo paese e al Suo status.' },
  { q: 'Come annullo il mio abbonamento?', a: 'Dalla Sua area clienti (Billing info), in qualsiasi momento e senza costi. Durante la prova, l’annullamento evita qualsiasi addebito. Dopo la prova, l’abbonamento resta attivo fino alla fine del periodo già pagato, poi si interrompe.' },
  { q: 'Posso cambiare piano?', a: 'Sì, in qualsiasi momento e senza vincoli. Passi al piano superiore quando il Suo volume cresce; la modifica viene mostrata prima della conferma.' },
];

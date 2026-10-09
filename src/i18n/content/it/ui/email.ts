// Testi delle email inviate dal sito: piè di pagina comune, pagina delle preferenze email
// (/preferences-email) ed email con il link personale. Nel piè di pagina {year}, {company}, {brand} ed
// {email} vengono sostituiti all’invio (src/lib/emailFooter.ts).
import type { UI_EMAIL as FR_UI_EMAIL } from '../../fr/ui/email';

export const UI_EMAIL: typeof FR_UI_EMAIL = {
  footer: {
    copyright: 'Copyright © {year} {company}, tutti i diritti riservati.',
    brandOf: '{brand} è un marchio di {company}.',
    question: 'Desidera modificare il modo in cui riceve queste email?',
    manage: ['Può gestire le preferenze email per {email} ', 'qui', ''],
    manageNoEmail: ['Può gestire le preferenze email ', 'qui', ''],
    unsubscribe: ['oppure annullare l’iscrizione a tutte le email ', 'qui', '.'],
    terms: 'Termini di servizio',
    privacy: 'Informativa sulla privacy',
  },
  prefs: {
    meta: {
      title: (brand: string) => `Preferenze email · ${brand}`,
      description: 'Scelga quali email ricevere da noi, oppure annulli l’iscrizione alle email non essenziali.',
    },
    h1: 'Le Sue preferenze email',
    intro: (brand: string) => `Scelga quali email ricevere da ${brand}.`,
    address: 'Indirizzo email',
    current: 'Scelta attuale',
    essential: { title: 'Solo le email essenziali dell’account', text: 'Nessuna email non essenziale: niente novità, consigli né offerte.' },
    all: { title: 'Tutte le email', text: 'Le email essenziali, più le nostre novità, consigli e offerte.' },
    save: 'Salva la mia scelta',
    saving: 'Salvataggio…',
    unsubscribeTitle: 'Confermi l’annullamento dell’iscrizione',
    unsubscribeText: 'Basta un clic: riceverà solo le email essenziali dell’account.',
    unsubscribeButton: 'Annulla l’iscrizione alle email non essenziali',
    saved: {
      essential_only: 'Fatto: d’ora in poi riceverà solo le email essenziali dell’account.',
      all: 'Fatto: riceverà tutte le nostre email.',
    },
    always: 'Qualunque sia la Sua scelta, inviamo sempre le email indispensabili: codici di sicurezza, ricevute e fatture, e risposte alle Sue richieste.',
    error: (email: string) => `Non è stato possibile salvare la Sua scelta. Riprovi tra qualche minuto o ci scriva a ${email}.`,
    invalid: 'Questo link non è valido o è stato copiato solo in parte. Richieda un nuovo link qui sotto.',
    askTitle: 'Ricevere un link per gestire le preferenze',
    askText: 'Per proteggere il Suo indirizzo, lo inserisca qui sotto: Le invieremo via email un link personale per scegliere quali email ricevere. Nessun altro può modificare le Sue preferenze.',
    emailLabel: 'Il Suo indirizzo email',
    send: 'Ricevi il link',
    sending: 'Invio…',
    sent: 'Se l’indirizzo è valido, Le abbiamo appena inviato un’email con il Suo link personale (controlli anche la cartella spam).',
    tooMany: 'Troppe richieste: riprovi più tardi.',
  },
  linkMail: {
    subject: (brand: string) => `Le Sue preferenze email ${brand}`,
    hello: 'Buongiorno,',
    line: (brand: string) => `Ecco il Suo link personale per scegliere quali email ricevere da ${brand}:`,
    button: 'Gestisci le mie preferenze',
    ignore: 'Se non lo ha richiesto, ignori questa email: non cambierà nulla.',
  },
  copyMail: {
    subject: (agent, brand) => (agent ? `Copia della Sua conversazione con ${agent} · ${brand}` : `Copia della Sua conversazione con ${brand}`),
    intro: (agent, _gender, brand, day, time) =>
      `Ecco la copia della Sua conversazione con ${agent ? `${agent}, l’assistente AI di ${brand},` : `l’assistente AI di ${brand},`} di ${day} alle ${time}. Può conservarla o copiarla come preferisce.`,
    // « Tu » come nelle trascrizioni delle chat (« Lei » a inizio riga si leggerebbe « lei », l’assistente).
    you: 'Tu',
    assistant: 'Assistente AI',
    cut: '(messaggio abbreviato)',
    truncated: (shown, total) => `Conversazione molto lunga: questa copia riporta solo i primi ${shown} messaggi (su ${total}).`,
    linkRemoved: '[link rimosso]',
    notYou: 'Riceve questa email perché questo indirizzo è stato indicato durante la conversazione. Se non l’ha richiesta, la ignori.',
  },
  // Codice di accesso alla pagina Il mio account (src/lib/accountCode.ts), email essenziale.
  accountCode: {
    subject: (brand: string, code: string) => `Il Suo codice di accesso ${brand}: ${code}`,
    hello: 'Buongiorno,',
    line: (brand: string) => `Ecco il Suo codice per accedere al Suo account sul sito ${brand}:`,
    valid: 'È valido per 10 minuti e si può usare una sola volta.',
    ignore: 'Se non lo ha richiesto, ignori questa email: nessuno può accedere al Suo account senza questo codice.',
  },
  // Conferma di una richiesta di assistenza (ticket T-XXXXXXXX), email essenziale alla persona che l’ha fatta
  // (src/lib/tickets.ts): solo informativa, senza prezzi né offerte; forma di cortesia « Lei ».
  ticketMail: {
    subject: (ticket: string, brand: string) => `La Sua richiesta di assistenza ${ticket} è stata registrata · ${brand}`,
    hello: (first: string | null) => (first ? `Buongiorno ${first},` : 'Buongiorno,'),
    recorded: (ticket: string) => `Abbiamo registrato la Sua richiesta di assistenza con il numero ${ticket}. Lo conservi: ci permetterà di ritrovare subito la Sua richiesta se ci ricontatta.`,
    callAt: (when: string) => `La richiameremo ${when}.`,
    asap: 'La richiameremo il prima possibile, durante i nostri orari di chiamata.',
    team: 'Una persona del nostro team La ricontatterà il prima possibile.',
    reply: 'Per aggiungere qualche dettaglio, risponda semplicemente a questa email indicando il numero della Sua richiesta.',
    notYou: 'Se non ha fatto Lei questa richiesta, ignori questo messaggio.',
    sign: (brand: string) => `Il team ${brand}`,
  },
};

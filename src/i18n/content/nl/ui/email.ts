// Teksten van de e-mails die de site verstuurt: gedeelde voettekst, pagina met e-mailvoorkeuren
// (/preferences-email) en de e-mail met de persoonlijke link. In de voettekst worden {year}, {company},
// {brand} en {email} bij het versturen ingevuld (src/lib/emailFooter.ts).
import type { UI_EMAIL as FR_UI_EMAIL } from '../../fr/ui/email';

export const UI_EMAIL: typeof FR_UI_EMAIL = {
  footer: {
    copyright: 'Copyright © {year} {company}, alle rechten voorbehouden.',
    brandOf: '{brand} is een merk van {company}.',
    question: 'Wilt u wijzigen hoe u deze e-mails ontvangt?',
    manage: ['U kunt uw e-mailvoorkeuren voor {email} ', 'hier', ' beheren'],
    manageNoEmail: ['U kunt uw e-mailvoorkeuren ', 'hier', ' beheren'],
    unsubscribe: ['of u kunt zich ', 'hier', ' afmelden voor alle e-mails.'],
    terms: 'Algemene voorwaarden',
    privacy: 'Privacybeleid',
  },
  prefs: {
    meta: {
      title: (brand: string) => `E-mailvoorkeuren · ${brand}`,
      description: 'Kies welke e-mails u van ons ontvangt, of meld u af voor niet-essentiële e-mails.',
    },
    h1: 'Uw e-mailvoorkeuren',
    intro: (brand: string) => `Kies welke e-mails u van ${brand} ontvangt.`,
    address: 'E-mailadres',
    current: 'Huidige keuze',
    essential: { title: 'Alleen essentiële e-mails over uw account', text: 'Geen niet-essentiële e-mails meer: geen nieuws, tips of aanbiedingen.' },
    all: { title: 'Alle e-mails', text: 'De essentiële e-mails, plus ons nieuws, tips en aanbiedingen.' },
    save: 'Mijn keuze opslaan',
    saving: 'Opslaan…',
    unsubscribeTitle: 'Afmelding bevestigen',
    unsubscribeText: 'Eén klik volstaat: u ontvangt dan alleen nog essentiële e-mails over uw account.',
    unsubscribeButton: 'Afmelden voor niet-essentiële e-mails',
    saved: {
      essential_only: 'Klaar: u ontvangt voortaan alleen essentiële e-mails over uw account.',
      all: 'Klaar: u ontvangt al onze e-mails.',
    },
    always: 'Wat u ook kiest, we sturen altijd de e-mails die u nodig hebt: beveiligingscodes, betalingsbewijzen en facturen, en antwoorden op uw eigen verzoeken.',
    error: (email: string) => `Uw keuze kon niet worden opgeslagen. Probeer het over een paar minuten opnieuw of mail ons via ${email}.`,
    invalid: 'Deze link is ongeldig of maar gedeeltelijk gekopieerd. Vraag hieronder een nieuwe link aan.',
    askTitle: 'Een link ontvangen om uw voorkeuren te beheren',
    askText: 'Om uw adres te beschermen, vult u het hieronder in: we mailen u een persoonlijke link waarmee u kiest welke e-mails u ontvangt. Niemand anders kan uw voorkeuren wijzigen.',
    emailLabel: 'Uw e-mailadres',
    send: 'Stuur mij de link',
    sending: 'Verzenden…',
    sent: 'Als dit adres geldig is, is er een e-mail met uw persoonlijke link onderweg (kijk ook in uw spammap).',
    tooMany: 'Te veel verzoeken: probeer het later opnieuw.',
  },
  linkMail: {
    subject: (brand: string) => `Uw e-mailvoorkeuren bij ${brand}`,
    hello: 'Hallo,',
    line: (brand: string) => `Hier is uw persoonlijke link om te kiezen welke e-mails u van ${brand} ontvangt:`,
    button: 'Mijn voorkeuren beheren',
    ignore: 'Heeft u hier niet om gevraagd? Dan kunt u deze e-mail negeren: er verandert niets.',
  },
  copyMail: {
    subject: (agent, brand) => (agent ? `Kopie van uw gesprek met ${agent} · ${brand}` : `Kopie van uw gesprek met ${brand}`),
    intro: (agent, _gender, brand, day, time) =>
      `Hier is een kopie van uw gesprek met ${agent ? `${agent}, de AI-assistent van ${brand},` : `de AI-assistent van ${brand}`} op ${day} om ${time}. U kunt deze bewaren of kopiëren zoals u wilt.`,
    you: 'U',
    assistant: 'AI-assistent',
    cut: '(bericht ingekort)',
    truncated: (shown, total) => `Zeer lang gesprek: deze kopie bevat alleen de eerste ${shown} berichten (van de ${total}).`,
    linkRemoved: '[link verwijderd]',
    notYou: 'U ontvangt deze e-mail omdat dit adres tijdens het gesprek is opgegeven. Heeft u hier niet om gevraagd? Dan kunt u deze e-mail negeren.',
  },
  // Inlogcode voor de pagina Mijn account (src/lib/accountCode.ts), essentiële e-mail.
  accountCode: {
    subject: (brand: string, code: string) => `Uw inlogcode voor ${brand}: ${code}`,
    hello: 'Hallo,',
    line: (brand: string) => `Hier is uw code om uw account op de website van ${brand} te openen:`,
    valid: 'De code is 10 minuten geldig en kan maar één keer worden gebruikt.',
    ignore: 'Heeft u hier niet om gevraagd? Dan kunt u deze e-mail negeren: zonder deze code kan niemand uw account openen.',
  },
};

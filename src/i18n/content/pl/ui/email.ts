// Teksty wiadomości e-mail wysyłanych przez stronę: wspólna stopka, strona preferencji e-mail
// (/preferences-email) i wiadomość z osobistym linkiem. W stopce {year}, {company}, {brand} i {email}
// są uzupełniane przy wysyłce (src/lib/emailFooter.ts).
import type { UI_EMAIL as FR_UI_EMAIL } from '../../fr/ui/email';

// Narzędnik imion person („rozmowa z Leną”); inne imię: w nawiasie, bez odmiany.
const WITH: Record<string, string> = { Lena: 'Leną', Tomasz: 'Tomaszem' };

export const UI_EMAIL: typeof FR_UI_EMAIL = {
  footer: {
    copyright: 'Copyright © {year} {company}. Wszelkie prawa zastrzeżone.',
    brandOf: '{brand} jest marką firmy {company}.',
    question: 'Chcą Państwo zmienić sposób otrzymywania tych wiadomości?',
    manage: ['Preferencjami e-mail dla adresu {email} można zarządzać ', 'tutaj', ''],
    manageNoEmail: ['Preferencjami e-mail można zarządzać ', 'tutaj', ''],
    unsubscribe: ['lub zrezygnować ze wszystkich wiadomości e-mail ', 'tutaj', '.'],
    terms: 'Regulamin',
    privacy: 'Polityka prywatności',
  },
  prefs: {
    meta: {
      title: (brand: string) => `Preferencje e-mail · ${brand}`,
      description: 'Wybór wiadomości e-mail, które od nas Państwo otrzymują, lub rezygnacja z wiadomości nieobowiązkowych.',
    },
    h1: 'Preferencje e-mail',
    intro: (brand: string) => `Prosimy wybrać, jakie wiadomości e-mail chcą Państwo otrzymywać od ${brand}.`,
    address: 'Adres e-mail',
    current: 'Obecny wybór',
    essential: { title: 'Tylko niezbędne wiadomości dotyczące konta', text: 'Żadnych wiadomości nieobowiązkowych: bez nowości, porad i ofert.' },
    all: { title: 'Wszystkie wiadomości', text: 'Wiadomości niezbędne oraz nasze nowości, porady i oferty.' },
    save: 'Zapisz wybór',
    saving: 'Zapisywanie…',
    unsubscribeTitle: 'Potwierdzenie rezygnacji',
    unsubscribeText: 'Wystarczy jedno kliknięcie: będą Państwo otrzymywać wyłącznie niezbędne wiadomości dotyczące konta.',
    unsubscribeButton: 'Rezygnuję z wiadomości nieobowiązkowych',
    saved: {
      essential_only: 'Gotowe: od teraz będą Państwo otrzymywać wyłącznie niezbędne wiadomości dotyczące konta.',
      all: 'Gotowe: będą Państwo otrzymywać wszystkie nasze wiadomości.',
    },
    always: 'Niezależnie od wyboru zawsze wysyłamy wiadomości niezbędne: kody bezpieczeństwa, potwierdzenia płatności i faktury oraz odpowiedzi na Państwa zgłoszenia.',
    error: (email: string) => `Nie udało się zapisać wyboru. Prosimy spróbować ponownie za kilka minut lub napisać do nas na adres ${email}.`,
    invalid: 'Ten link jest nieprawidłowy lub został skopiowany tylko częściowo. Poniżej można poprosić o nowy link.',
    askTitle: 'Link do zarządzania preferencjami',
    askText: 'Aby chronić Państwa adres, prosimy wpisać go poniżej: wyślemy na niego osobisty link do wyboru otrzymywanych wiadomości. Nikt inny nie może zmienić Państwa preferencji.',
    emailLabel: 'Adres e-mail',
    send: 'Wyślij link',
    sending: 'Wysyłanie…',
    sent: 'Jeśli adres jest prawidłowy, wysłaliśmy na niego wiadomość z osobistym linkiem (prosimy sprawdzić także folder spam).',
    tooMany: 'Zbyt wiele prób: prosimy spróbować później.',
  },
  linkMail: {
    subject: (brand: string) => `Preferencje e-mail ${brand}`,
    hello: 'Dzień dobry,',
    line: (brand: string) => `Oto Państwa osobisty link do wyboru wiadomości e-mail otrzymywanych od ${brand}:`,
    button: 'Zarządzaj preferencjami',
    ignore: 'Jeśli to nie Państwo o niego prosili, prosimy zignorować tę wiadomość: nic się nie zmieni.',
  },
  copyMail: {
    subject: (agent, brand) => (agent && WITH[agent] ? `Kopia Państwa rozmowy z ${WITH[agent]} · ${brand}` : `Kopia Państwa rozmowy · ${brand}`),
    intro: (agent, gender, brand, day, time) => {
      const role = gender === 'male' ? 'asystentem AI' : 'asystentką AI';
      const who = !agent ? `asystentem AI ${brand},` : WITH[agent] ? `${WITH[agent]}, ${role} ${brand},` : `${role} ${brand} (${agent}),`;
      return `Oto kopia Państwa rozmowy z ${who} z dnia ${day} r., godz. ${time}. Mogą ją Państwo zachować lub skopiować według uznania.`;
    },
    // „Ty”, jak w zapisach rozmów z komunikatorów (wstęp i stopka zwracają się „Państwo”).
    you: 'Ty',
    assistant: 'Asystent AI',
    cut: '(wiadomość skrócona)',
    truncated: (shown, total) => `Bardzo długa rozmowa: ta kopia zawiera tylko pierwsze ${shown} wiadomości (z ${total}).`,
    linkRemoved: '[link usunięty]',
    notYou: 'Otrzymują Państwo tę wiadomość, ponieważ ten adres został podany podczas rozmowy. Jeśli to nie Państwo o nią prosili, prosimy ją zignorować.',
  },
  // Kod logowania do strony Moje konto (src/lib/accountCode.ts), wiadomość niezbędna; forma „Państwo”.
  accountCode: {
    subject: (brand: string, code: string) => `Kod logowania ${brand}: ${code}`,
    hello: 'Dzień dobry,',
    line: (brand: string) => `Oto kod dostępu do Państwa konta na stronie ${brand}:`,
    valid: 'Kod jest ważny 10 minut i można go użyć tylko raz.',
    ignore: 'Jeśli to nie Państwo o niego prosili, prosimy zignorować tę wiadomość: bez tego kodu nikt nie uzyska dostępu do konta.',
  },
  // Potwierdzenie zgłoszenia do pomocy technicznej (T-XXXXXXXX), wiadomość niezbędna (src/lib/tickets.ts): tylko
  // informacja, bez cen i ofert; forma „Państwo”, jak w pozostałych wiadomościach.
  ticketMail: {
    subject: (ticket: string, brand: string) => `Zgłoszenie ${ticket} zostało przyjęte · ${brand}`,
    hello: (_first: string | null) => 'Dzień dobry,',
    recorded: (ticket: string) => `Przyjęliśmy Państwa zgłoszenie do pomocy technicznej pod numerem ${ticket}. Prosimy zachować ten numer: dzięki niemu szybko odnajdziemy zgłoszenie, jeśli skontaktują się Państwo z nami ponownie.`,
    callAt: (when: string) => `Termin oddzwonienia: ${when}.`,
    asap: 'Oddzwonimy najszybciej, jak to możliwe, w godzinach, w których wykonujemy połączenia.',
    team: 'Ktoś z naszego zespołu skontaktuje się z Państwem najszybciej, jak to możliwe.',
    reply: 'Aby coś dodać, wystarczy odpowiedzieć na tę wiadomość, podając numer zgłoszenia.',
    notYou: 'Jeśli to nie Państwo wysłali to zgłoszenie, prosimy zignorować tę wiadomość.',
    sign: (brand: string) => `Zespół ${brand}`,
  },
};

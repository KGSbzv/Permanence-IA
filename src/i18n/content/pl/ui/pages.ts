// Teksty interfejsu stron niesprzedażowych (demo, kontakt, FAQ, okres próbny, pomoc, o nas, bezpieczeństwo,
// 404, strony prawne, blog). Zmienne (marka, firma, e-mail, długość okresu próbnego…) są przekazywane
// przez funkcje: marka pochodzi z rynku, firma i e-mail z SITE.
import type { ChatLine, LegalSection, LegalVars, Rich, UI_PAGES as FR_UI_PAGES } from '../../fr/ui/pages';

/** Odmiana liczebnika: 1 → one, 2–4 (bez 12–14) → few, pozostałe → many. */
const plural = (n: number, one: string, few: string, many: string) => {
  if (n === 1) return one;
  const n10 = n % 10, n100 = n % 100;
  return n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14) ? few : many;
};
/** „1 minuta”, „2 minuty”, „5 minut” (mianownik). */
const minutes = (n: number) => `${n} ${plural(n, 'minuta', 'minuty', 'minut')}`;
/** „1 dzień”, „14 dni”. */
const days = (n: number) => `${n} ${n === 1 ? 'dzień' : 'dni'}`;

const ADDRESS = '1603 Capitol Ave Suite 413G-2408, Cheyenne, WY 82001';

export const UI_PAGES: typeof FR_UI_PAGES = {
  demo: {
    meta: {
      title: (brand: string) => `Demo asystenta głosowego AI na żywo · ${brand}`,
      description: 'Porozmawiaj z asystentem głosowym AI na żywo lub odbierz połączenie demo dopasowane do Twojej branży. Bezpłatnie i bez zobowiązań — wypróbuj teraz.',
    },
    h1: 'Wypróbuj naszego asystenta głosowego AI na żywo',
    intro: 'Zostaw numer i wybierz branżę: agent zadzwoni do Ciebie i odegra scenariusz z Twojej branży. Usłyszysz jego głos, tempo i sposób, w jaki kwalifikuje zgłoszenie.',
    widgetHint: 'Wolisz od razu? Kliknij dymek w prawym dolnym rogu ekranu: nasza asystentka odpowie głosowo lub na piśmie.',
    formTitle: 'Odbierz połączenie demonstracyjne',
    formIntro: 'Bezpłatne połączenie, w wybranym przez Ciebie terminie.',
    submit: 'Odbierz połączenie demo',
    hearTitle: 'Co usłyszysz',
    hearIntro: 'Przykład rozmowy w gabinecie stomatologicznym: agent rozpoznaje sprawę, proponuje termin i przygotowuje kartę dla zespołu.',
    steps: [
      { title: 'Zostawiasz numer', text: 'Wraz z branżą i preferowanym terminem.' },
      { title: 'Agent do Ciebie dzwoni', text: 'Odgrywa scenariusz z Twojej branży.' },
      { title: 'Testujesz bez ograniczeń', text: 'Zadawaj pytania, zmieniaj zdanie, przerywaj mu.' },
    ],
    liveCallTitle: 'Agent gabinetu stomatologicznego',
    scenariosTitle: 'Wybierz scenariusz',
  },

  contact: {
    meta: {
      title: (brand: string) => `Kontakt i oddzwonienie — asystent głosowy AI · ${brand}`,
      description: 'Zostaw numer, oddzwonimy: pytania o asystenta głosowego AI, demonstracja, wycena lub wsparcie. Wybierz dogodny termin rozmowy.',
    },
    h1: 'Zostaw numer, oddzwonimy',
    intro: 'Nie publikujemy numeru telefonu: to my oddzwaniamy, w wybranym przez Ciebie terminie. Możesz też do nas napisać.',
    commercialTitle: 'Rozmowa handlowa',
    commercialText: 'Pytania o pakiety, demonstracja, wycena oferty na miarę.',
    supportTitle: 'Wsparcie techniczne',
    supportText: 'Dla klientów: konfiguracja, numery, integracje.',
    emailTitle: 'E-mail',
    legal: (brand: string, company: string) => `${brand} jest marką firmy ${company}, ${ADDRESS}, Stany Zjednoczone.`,
    tabsLabel: 'Rodzaj zgłoszenia',
    tabCommercial: 'Sprzedaż i demo',
    tabSupport: 'Obsługa klienta',
  },

  faq: {
    meta: {
      title: (brand: string) => `FAQ: asystent głosowy AI, ceny i RODO · ${brand}`,
      description: (brand: string) => `Jak działa asystent głosowy AI ${brand}? Telefonia, SIP, kalendarz, WhatsApp, RODO, okres próbny i ceny. Sprawdź odpowiedzi lub zamów oddzwonienie.`,
    },
    h1: 'Najczęstsze pytania o asystenta głosowego AI',
    intro: 'Nie ma tu odpowiedzi na Twoje pytanie? Zostaw numer, a doradca oddzwoni.',
    general: 'Platforma',
    pricing: 'Ceny i okres próbny',
  },

  trial: {
    meta: {
      title: (d: number, m: number, brand: string) => `Asystent głosowy AI za darmo przez ${days(d)} · ${brand}`,
      description: (d: number, m: number, brand: string) => `Wypróbuj asystenta głosowego AI ${brand}: ${days(d)} za darmo, ${minutes(m)} w cenie, bez opłat w okresie próbnym. Załóż konto, anuluj w każdej chwili.`,
    },
    h1: (m: number) => `Odbierz ${m} ${plural(m, 'darmową minutę', 'darmowe minuty', 'darmowych minut')}`,
    intro: (d: number) => `Załóż konto, wybierz pakiet do przetestowania i wypróbuj asystenta głosowego AI w swojej firmie przez ${days(d)}.`,
    points: (d: number) => [
      `Karta wymagana przy aktywacji, przez ${days(d)} nic nie jest pobierane`,
      'Anuluj w panelu klienta przed końcem okresu próbnego: nic nie zapłacisz',
      'Demo na żywo i widżet na stronę w cenie',
      'Pomoc przy pierwszej konfiguracji',
    ],
    createTitle: 'Załóż konto',
    createSteps: [
      '1. Załóż konto, podając służbowy adres e-mail.',
      '2. Wybierz pakiet do przetestowania w panelu klienta.',
      '3. Skonfiguruj agenta i przeprowadź pierwsze rozmowy.',
    ],
    createCta: 'Załóż bezpłatne konto',
    already: 'Masz już konto?',
    login: 'Logowanie',
    sentTitle: 'Twoje zgłoszenie zostało zapisane',
    sentText: 'Doradca oddzwoni, aby razem z Tobą skonfigurować pierwszego agenta.',
    sentCta: 'Załóż konto teraz',
    formTitle: 'Wolisz skorzystać z pomocy?',
    formIntro: 'Zostaw swoje dane: doradca oddzwoni, aby razem z Tobą rozpocząć okres próbny.',
    name: 'Imię i nazwisko',
    company: 'Firma',
    email: 'Służbowy e-mail',
    phone: 'Telefon',
    sector: 'Branża',
    sectorPlaceholder: 'Wybierz…',
    sectorOther: 'Inna działalność',
    plan: 'Wybrany pakiet',
    planPrice: (price: string) => ` — ${price} netto/mies.`,
    planFree: ' — bezpłatnie',
    planQuote: ' — wycena indywidualna',
    terms: [
      'Akceptuję ',
      { a: 'regulamin', href: '/cgu' },
      ' i ',
      { a: 'politykę prywatności', href: '/confidentialite' },
      ' oraz wyrażam zgodę na kontakt telefoniczny w celu konfiguracji mojego konta.',
    ] as Rich,
    termsRequired: 'Zaakceptuj warunki, abyśmy mogli oddzwonić.',
    sendError: 'Nie udało się wysłać zgłoszenia.',
    sending: 'Wysyłanie…',
    submit: 'Zamów oddzwonienie',
  },

  help: {
    meta: {
      title: (brand: string) => `Pomoc do panelu klienta — ${brand}`,
      description: 'Przewodnik po panelu klienta w języku polskim: tłumaczenie menu, tworzenie agenta, numery, kalendarz, widżet, minuty i rozliczenia.',
    },
    breadcrumb: 'Pomoc',
    h1: 'Pomoc do Twojego panelu klienta',
    intro: 'Twój panel klienta jest wyświetlany po angielsku. Ten przewodnik tłumaczy każde menu i prowadzi Cię krok po kroku. W panelu asystentka pomocy (dymek w prawym dolnym rogu) również odpowiada na pytania, na piśmie lub głosowo.',
    openSpace: 'Otwórz panel klienta',
    chatLabel: 'Przykładowa rozmowa z asystentką pomocy',
    chatTitle: (brand: string) => `Pomoc ${brand}`,
    chatMode: 'Na piśmie lub głosowo',
    chat: [
      { me: true, text: 'Gdzie mogę dokupić minuty?' },
      { text: ['W prawym górnym rogu otwórz menu profilu i kliknij ', { b: 'Add credits' }, ' (doładowanie środków). Wybierz doładowanie: środki nie wygasają.'] },
      { me: true, text: 'A jak umieścić agenta na mojej stronie?' },
      { text: ['Otwórz swojego agenta w ', { b: 'Assistants' }, ', sekcja ', { b: 'Web widget' }, ' (widżet na stronę): włącz go, a następnie skopiuj podany kod. Zrobimy to razem?'] },
    ] as ChatLine[],
    tasksTitle: 'Typowe zadania krok po kroku',
    menuTitle: 'Menu panelu w tłumaczeniu',
    colMenu: 'Menu (po angielsku)',
    colLabel: 'Po polsku',
    colText: 'Do czego służy',
    glossaryTitle: 'Mały słowniczek',
    moreBefore: 'Masz pytanie, którego tu nie ma? Napisz na adres ',
    moreAfter: ' lub zamów oddzwonienie na stronie kontaktowej.',
  },

  about: {
    meta: {
      title: (brand: string) => `O nas — inteligentny asystent telefoniczny · ${brand}`,
      description: (brand: string, company: string) => `${brand} pomaga firmom odbierać każde połączenie dzięki asystentom głosowym AI i automatycznej obsłudze połączeń. Marka firmy ${company}.`,
    },
    h1: 'Każde połączenie zasługuje na odpowiedź',
    intro: (brand: string) => `${brand} powstała z prostej obserwacji: małe firmy tracą klientów, bo nikt nie może odebrać telefonu we właściwym momencie.`,
    photoAlt: 'Właścicielka firmy sprawdza telefon w swoim biurze',
    paragraphs: [
      'Rzemieślnicy, gabinety, biura, warsztaty, salony, restauracje: Twój zespół jest zajęty obsługą klientów. W tym czasie dzwoni telefon.',
      'Udostępniamy agentów głosowych AI, którzy odbierają telefony, kwalifikują zgłoszenia, umawiają wizyty i oddzwaniają, skonfigurowanych dla Twojej branży, z przejrzystymi cenami i bez zobowiązań.',
    ],
    principlesTitle: 'Nasze zasady',
    principles: [
      'Agent uczciwie przedstawia się jako AI',
      'W ważnych sprawach decyduje człowiek',
      'Ceny netto podane jawnie, bez ukrytych opłat',
      'Żadnych liczb ani obietnic, których nie możemy udowodnić',
    ],
    legal: (brand: string, company: string) => `${brand} jest marką firmy ${company}, spółki zarejestrowanej w stanie Wyoming (Stany Zjednoczone) pod numerem 2026-001905061.`,
  },

  security: {
    meta: {
      title: (brand: string) => `Bezpieczeństwo i zgodność z RODO — ${brand}`,
      description: (brand: string) => `Zgody, rezygnacje, szyfrowanie, okres przechowywania, role i rozliczalność: jak ${brand} chroni dane z Twoich połączeń i pomaga przestrzegać RODO.`,
    },
    h1: 'Bezpieczeństwo i zgodność Twoich połączeń AI',
    intro: 'Twoje rozmowy zawierają dane osobowe. Oto stosowane zabezpieczenia i ustawienia, które pomagają przestrzegać RODO.',
    settingsTitle: 'Twoje ustawienia',
    settings: [
      'Okres przechowywania nagrań i transkrypcji',
      'Usunięcie rozmowy lub kontaktu na żądanie',
      'Lista wykluczeń dla połączeń wychodzących',
      'Dozwolone godziny połączeń',
      'Informacja „asystent AI” na początku rozmowy',
      'Nagrywanie włączane lub wyłączane, z informacją dla dzwoniącego',
    ],
    commitmentsTitle: 'Nasze zobowiązania',
    commitments: [
      'Agent przedstawia się jako AI i nie podszywa się pod człowieka',
      'Żadnych połączeń wychodzących bez uprzedniej zgody kontaktu',
      'Agent nie stawia diagnoz medycznych, prawnych ani finansowych',
      'Dane wykorzystywane wyłącznie do świadczenia usługi',
      'Pomoc w dostosowaniu klauzul informacyjnych',
    ],
    rights: ['W razie pytań lub w celu skorzystania ze swoich praw: ', { a: 'polityka prywatności', href: '/confidentialite' }, '.'] as Rich,
  },

  notFound: {
    meta: {
      title: (brand: string) => `Nie znaleziono strony — ${brand}`,
      description: 'Ta strona nie istnieje lub została przeniesiona.',
    },
    h1: 'Ta strona nie istnieje lub została przeniesiona',
    text: 'Wróć na stronę główną lub zapoznaj się z naszymi pakietami.',
    home: 'Powrót na stronę główną',
    pricing: 'Zobacz cennik',
  },

  terms: {
    meta: {
      title: (brand: string) => `Regulamin (warunki korzystania i sprzedaży) — ${brand}`,
      description: (brand: string) => `Zapoznaj się z ogólnymi warunkami korzystania i sprzedaży dotyczącymi pakietów i usług telefonicznej recepcji AI ${brand}.`,
    },
    h1: 'Ogólne Warunki Korzystania i Sprzedaży (Regulamin)',
    updated: 'Dotyczy przedsiębiorców i firm • Ostatnia aktualizacja: 29 września 2026',
    sections: ({ brand, company, email, appHost, legal }: LegalVars): LegalSection[] => [
      {
        title: 'Artykuł 1 — Przedmiot usługi',
        body: [
          { p: ['Niniejsze Ogólne Warunki regulują dostęp do platformy oprogramowania i usług telefonicznych realizowanych przez konwersacyjnego agenta sztucznej inteligencji, oferowanych pod marką ', { strong: brand }, ` przez spółkę ${company}.`] },
          { p: 'Usługa pozwala firmom powierzyć obsługę przychodzących połączeń telefonicznych, kwalifikację rozmówców oraz zsynchronizowane umawianie wizyt 24 godziny na dobę, 7 dni w tygodniu.' },
        ],
      },
      {
        title: 'Artykuł 2 — Zasady 14-dniowego bezpłatnego okresu próbnego',
        body: [
          { p: 'Każdy nowy klient przy pierwszym zakupie pakietu otrzymuje bezpłatny okres próbny trwający czternaście (14) kolejnych dni kalendarzowych, obejmujący 30 minut połączeń:' },
          {
            ul: [
              [{ strong: 'Metoda płatności:' }, ' Przy aktywacji okresu próbnego wymagana jest karta płatnicza. W ciągu 14 dni okresu próbnego nie jest pobierana żadna kwota. Wszystkie ceny są podane netto.'],
              [{ strong: 'Limit wykorzystania:' }, ' W okresie próbnym połączenia są ograniczone do 30 minut; po przekroczeniu limitu są wstrzymywane do czasu rozpoczęcia subskrypcji.'],
              [{ strong: 'Koniec okresu próbnego:' }, ' Po upływie 14 dni rozpoczyna się subskrypcja wybranego pakietu i pobierana jest pierwsza opłata miesięczna, chyba że klient anulował ją wcześniej w panelu klienta — wówczas nie jest pobierana żadna kwota.'],
              [{ strong: 'Uczciwe korzystanie:' }, ' Bezpłatny okres próbny przysługuje tylko raz na podmiot prawny / numer rejestrowy.'],
            ],
          },
        ],
      },
      {
        title: 'Artykuł 3 — Prawo odstąpienia i 14-dniowa Gwarancja Spokoju',
        body: [
          { p: [`Niezależnie od uprawnień wynikających z przepisów prawa, ${brand} przyznaje w ramach polityki handlowej `, { strong: 'gwarancję pełnego zwrotu w ciągu 14 dni' }, ' od pierwszego płatnego zakupu.'] },
          { p: ['Po zwykłym zgłoszeniu e-mailem na adres ', { strong: email }, ' w ciągu 14 dni od pierwszej płatności cała opłata miesięczna jest zwracana bez podawania przyczyny.'] },
        ],
      },
      {
        title: 'Artykuł 4 — Rozliczenia, ceny i wypowiedzenie',
        body: [
          { p: 'Ceny są wyrażone w dolarach amerykańskich (USD), netto. Należne podatki są naliczane automatycznie przy płatności w zależności od kraju klienta i jego statusu (osoba prywatna lub firma, z numerem VAT lub bez). Płatności są realizowane co miesiąc za pośrednictwem naszego bezpiecznego operatora płatności Stripe; subskrypcja odnawia się automatycznie co miesiąc.' },
          { p: ['Klient może wypowiedzieć subskrypcję w dowolnym momencie i bez okresu wypowiedzenia w swoim panelu ', { strong: appHost }, '. Wypowiedzenie staje się skuteczne z końcem już opłaconego okresu miesięcznego. Klient może w dowolnym momencie zmienić pakiet i dokupić minuty, doładowując środki; zakupione środki nie wygasają i służą do opłacania minut ponad limit pakietu, według stawki za dodatkową minutę podanej na stronie Cennik.'] },
        ],
      },
      {
        title: 'Artykuł 5 — Odpowiedzialność i charakter zobowiązania',
        body: [
          { p: [`${brand} jest zobowiązana do `, { strong: 'starannego działania' }, ' w zakresie dostępności i technicznej obsługi ruchu telefonicznego. Użytkownik przyjmuje do wiadomości, że modele generatywnej sztucznej inteligencji i syntezy mowy mogą sporadycznie udzielać odpowiedzi przybliżonych lub nieścisłych.'] },
          { p: `${brand} w żadnym wypadku nie ponosi odpowiedzialności za pośrednie straty operacyjne, utracone korzyści ani szkody handlowe. W każdym przypadku maksymalna wysokość odszkodowania jest wyraźnie ograniczona do kwoty netto zapłaconej przez klienta w miesiącu poprzedzającym zdarzenie wywołujące szkodę.` },
        ],
      },
      {
        title: 'Artykuł 6 — Zakazane zastosowania i zawieszenie',
        body: [
          { p: `Surowo zabronione są: kampanie niezamówionego telemarketingu (nadużycia w postaci spamu głosowego), działalność oszukańcza, treści zniesławiające, dyskryminujące lub niezgodne z prawem. W razie stwierdzenia nadużycia ${brand} zastrzega sobie prawo do zawieszenia dostępu do dedykowanej linii bez odszkodowania.` },
        ],
      },
      {
        title: 'Artykuł 7 — Prawo właściwe i sąd właściwy',
        body: [
          { p: `Niniejszy regulamin podlega ${legal.governingLaw}. Wszelkie spory dotyczące jego interpretacji lub wykonania rozstrzyga ${legal.court}.` },
          ...(legal.mandatoryNote ? [{ p: legal.mandatoryNote }] : []),
        ],
      },
    ],
  },

  privacy: {
    meta: {
      title: (brand: string) => `Polityka prywatności — ${brand}`,
      description: (brand: string) => `Jak ${brand} przetwarza Twoje dane: prośby o oddzwonienie, agenci AI i nagrania, konto klienta, rozliczenia Stripe, dostawcy i Twoje prawa.`,
    },
    breadcrumb: 'Prywatność',
    h1: 'Polityka prywatności',
    intro: 'Jakie dane zbieramy, w jakim celu, komu je przekazujemy, jak długo je przechowujemy i jak możesz skorzystać ze swoich praw.',
    updated: 'Aktualizacja: październik 2026',
    sections: ({ brand, company, email, legal }: LegalVars): LegalSection[] => {
      const mail = { a: email, href: `mailto:${email}` };
      return [
        {
          title: 'Kto odpowiada za Twoje dane',
          body: [
            { p: [`${brand} jest marką firmy ${company}, spółki z ograniczoną odpowiedzialnością zarejestrowanej w stanie Wyoming (Stany Zjednoczone), ${ADDRESS}. Kontakt: `, mail, `. Dane osobowe przetwarzamy zgodnie z przepisami o ochronie danych: ${legal.privacyLaw}.`] },
            {
              ul: [
                [{ strong: 'W zakresie strony internetowej, próśb o oddzwonienie, rozmów z naszymi asystentkami i zarządzania kontami klientów' }, ` administratorem danych jest ${company}.`],
                [{ strong: 'W zakresie połączeń i wiadomości obsługiwanych przez agentów naszych klientów' }, ' administratorem danych wobec swoich rozmówców jest klient, a my działamy jako podmiot przetwarzający w jego imieniu. Klient decyduje, jakie informacje zbiera jego agent i jak są wykorzystywane.'],
              ],
            },
          ],
        },
        {
          title: 'Jakie dane przetwarzamy',
          body: [
            {
              ul: [
                [{ strong: 'Formularze na stronie' }, ' (oddzwonienie, demo, pomoc przy okresie próbnym): imię i nazwisko, telefon, e-mail, firma, branża, preferowany termin i Twoja wiadomość.'],
                [{ strong: 'Rozmowy z naszymi asystentkami AI' }, ' (dymek na stronie, recepcjonistka, połączenia handlowe i wsparcia, pomoc w panelu klienta): treść pisemna, nagranie audio rozmów głosowych, transkrypcja, podsumowanie i wyodrębnione przydatne informacje (potrzeba, rozważany pakiet, zgłoszony problem).'],
                [{ strong: 'Konto klienta' }, ': dane identyfikacyjne, e-mail, firma, ustawienia agentów, historia połączeń i wiadomości, zużycie minut.'],
                [{ strong: 'Rozliczenia' }, ': pakiet, faktury i metoda płatności. Dane karty są wprowadzane i przechowywane przez Stripe; nigdy nie mamy do nich dostępu.'],
                [{ strong: 'Dane techniczne' }, ': adres IP i informacje o przeglądarce niezbędne do działania i bezpieczeństwa strony.'],
              ],
            },
          ],
        },
        {
          title: 'W jakim celu i na jakiej podstawie',
          body: [
            {
              ul: [
                [{ strong: 'Oddzwonienie i odpowiedź na Twoje zgłoszenie' }, ', także przez połączenie od naszego agenta głosowego AI: na podstawie Twojej zgody, wyrażonej przy składaniu zgłoszenia. Możesz ją wycofać w każdej chwili, a agent respektuje każdą prośbę o zaprzestanie kontaktu telefonicznego.'],
                [{ strong: 'Świadczenie usługi, bezpłatnego okresu próbnego i wsparcia' }, ': wykonanie umowy.'],
                [{ strong: 'Wystawianie faktur i wypełnianie obowiązków księgowych i podatkowych' }, ': obowiązek prawny.'],
                [{ strong: 'Ulepszanie naszych asystentek i zabezpieczanie platformy' }, ': prawnie uzasadniony interes, wyłącznie na podstawie naszych własnych rozmów.'],
              ],
            },
          ],
        },
        {
          title: 'Agenci AI i nagrania',
          body: [
            { p: 'Nasze asystentki są sztuczną inteligencją i tak się przedstawiają. Rozmowy głosowe są nagrywane i transkrybowane w celu obsługi Twojego zgłoszenia i zapewnienia jakości usługi. Żadna decyzja wywołująca wobec Ciebie skutki prawne nie jest podejmowana w sposób w pełni zautomatyzowany.' },
            { p: 'Klienci korzystający z platformy muszą informować swoich rozmówców o korzystaniu z agenta AI i o nagrywaniu, zgodnie z przepisami mającymi zastosowanie do ich działalności.' },
          ],
        },
        {
          title: 'Nasi dostawcy',
          body: [
            {
              ul: [
                [{ strong: 'Autocalls' }, ': platforma techniczna agentów głosowych, widżetów i panelu klienta (połączenia, transkrypcja, synteza mowy, automatyzacje).'],
                [{ strong: 'Dostawcy AI, głosu i telefonii' }, ' wykorzystywani przez tę platformę do rozumienia, odpowiadania i kierowania połączeń.'],
                [{ strong: 'Stripe' }, ': subskrypcje, płatności, faktury i naliczanie podatków (certyfikat PCI-DSS poziomu 1).'],
                [{ strong: 'Supabase' }, ': baza danych próśb o oddzwonienie, rejestracji i podsumowań rozmów (Stany Zjednoczone).'],
                [{ strong: 'Google Cloud (Firebase App Hosting)' }, ': hosting strony (Stany Zjednoczone).'],
                [{ strong: 'Zoho Mail' }, ': wysyłka e-maili serwisowych i informacyjnych.'],
              ],
            },
          ],
        },
        {
          title: 'Przekazywanie danych poza Europejski Obszar Gospodarczy',
          body: [
            { p: 'Kilku z tych dostawców, a także nasza spółka, ma siedzibę w Stanach Zjednoczonych. Przekazywanie danych poza Europejski Obszar Gospodarczy odbywa się na podstawie standardowych klauzul umownych zatwierdzonych przez Komisję Europejską lub, w stosownych przypadkach, Ram ochrony danych UE-USA (EU-U.S. Data Privacy Framework), jeśli dostawca do nich przystąpił.' },
          ],
        },
        {
          title: 'Jak długo przechowujemy dane',
          body: [
            {
              ul: [
                'Prośby o oddzwonienie i rozmowy z naszymi asystentkami: 24 miesiące od ostatniego kontaktu.',
                'Nagrania i transkrypcje połączeń obsługiwanych dla naszych klientów: domyślnie 12 miesięcy; każdy klient może skrócić ten okres i usunąć swoje dane w panelu klienta.',
                'Dane konta: przez cały okres współpracy, a następnie 3 lata na potrzeby ewentualnego marketingu, chyba że zgłosisz sprzeciw.',
                'Faktury i dane księgowe: przez okres wymagany prawem (do 10 lat).',
              ],
            },
          ],
        },
        {
          title: 'Bezpieczeństwo',
          body: [
            { p: 'Przesyłane dane są szyfrowane, dostęp do danych mają wyłącznie osoby, które go potrzebują, i jest on chroniony uwierzytelnianiem, a klucze techniczne są przechowywane w sejfach na sekrety. Klienci mogą włączyć uwierzytelnianie dwuskładnikowe w swoim panelu.' },
          ],
        },
        {
          title: 'Twoje prawa',
          body: [
            { p: ['Możesz zażądać dostępu do swoich danych, ich sprostowania, usunięcia, przeniesienia, ograniczenia przetwarzania, sprzeciwić się marketingowi i wycofać zgodę na kontakt telefoniczny. Napisz na adres ', mail, ': odpowiemy w ciągu miesiąca.'] },
            { p: `Masz również prawo wnieść skargę do organu nadzorczego: ${legal.dataAuthority}.` },
          ],
        },
        {
          title: 'Pliki cookie',
          body: [
            { p: ['Strona nie używa reklamowych plików cookie. Szczegóły znajdziesz na stronie ', { a: 'pliki cookie', href: '/cookies' }, '.'] },
          ],
        },
      ];
    },
  },

  legalNotice: {
    meta: {
      title: (brand: string) => `Nota prawna — ${brand}`,
      description: (brand: string) => `Nota prawna: informacje o wydawcy, hostingu i prawach autorskich platformy ${brand}.`,
    },
    h1: 'Nota prawna',
    updated: 'Ostatnia aktualizacja: 29 września 2026',
    sections: ({ brand, company, email, legal }: LegalVars): LegalSection[] => [
      {
        title: '1. Wydawca strony',
        body: [
          { p: ['Strona internetowa dostępna pod adresem ', { strong: 'https://permanenceia.com' }, ' jest wydawana przez spółkę ', { strong: company }, '.'] },
          {
            ul: [
              [{ strong: 'Nazwa handlowa:' }, ` ${brand}`],
              [{ strong: 'Forma prawna:' }, ' Limited Liability Company (LLC), stan Wyoming, Stany Zjednoczone'],
              [{ strong: 'Numer rejestrowy:' }, ' 2026-001905061'],
              [{ strong: 'Siedziba:' }, ' 1603 Capitol Ave, Suite 413G-2408, Cheyenne, WY 82001, Stany Zjednoczone'],
              [{ strong: 'E-mail kontaktowy:' }, ` ${email}`],
              [{ strong: 'Osoba odpowiedzialna za publikację:' }, ` przedstawiciel prawny ${company}.`],
            ],
          },
        ],
      },
      {
        title: '2. Hosting platformy',
        body: [
          { p: 'Strona sprzedażowa i aplikacja są hostowane przez:' },
          {
            ul: [
              [{ strong: 'Platforma front-end:' }, ' Google LLC (Firebase App Hosting / Google Cloud), 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA. Region hostingu: us-east4 (Północna Wirginia, Stany Zjednoczone).'],
              [{ strong: 'Bazy danych i przechowywanie:' }, ' Supabase Inc., infrastruktura zlokalizowana w Unii Europejskiej (region AWS EU-WEST-1, Dublin, Irlandia).'],
              [{ strong: 'Sieć telefoniczna i synteza mowy:' }, ' chmurowa infrastruktura telefonii głosowej z certyfikatem zgodności z europejskimi normami telekomunikacyjnymi.'],
            ],
          },
        ],
      },
      {
        title: '3. Własność intelektualna',
        body: [
          { p: ['Marka ', { strong: brand }, `, logo (dymek w trybie czuwania, fale głosowe i punkt dostępności), a także wszystkie elementy identyfikacji wizualnej, teksty, skrypty rozmów, infografiki i kody źródłowe zamieszczone na stronie stanowią wyłączną własność ${company}.`] },
          { p: `Wszelkie powielanie, rozpowszechnianie, modyfikowanie lub wykorzystywanie bez uprzedniej pisemnej zgody jest zabronione i stanowi naruszenie praw podlegające sankcjom przewidzianym w przepisach: ${legal.copyrightLaw}.` },
          { note: 'Oznaczenie Autocalls White-Label Architecture wynika z licencji technologicznej udzielonej przez Autocalls Inc.' },
        ],
      },
      {
        title: '4. Ograniczenie odpowiedzialności',
        body: [
          { p: `${brand} dokłada wszelkich starań, aby informacje publikowane na stronie były jak najdokładniejsze. ${brand} nie ponosi jednak odpowiedzialności za przerwy w działaniu sieci, awarie leżące po stronie zewnętrznych operatorów telekomunikacyjnych ani za sporadyczne nieścisłości kontekstowe generowane przez modele automatycznego przetwarzania mowy podczas rozmów na żywo.` },
          { p: 'Klient będący przedsiębiorcą ponosi wyłączną odpowiedzialność za instrukcje i reguły biznesowe, które programuje dla swojej telefonicznej recepcji.' },
        ],
      },
    ],
  },

  cookies: {
    meta: {
      title: (brand: string) => `Polityka plików cookie — ${brand}`,
      description: (brand: string) => `Pliki cookie i inne technologie śledzące używane na stronie ${brand}.`,
    },
    h1: 'Polityka plików cookie',
    paragraphs: (siteHost: string, appHost: string) => [
      `Strona ${siteHost} używa wyłącznie plików cookie niezbędnych do jej działania (bezpieczeństwo, równoważenie obciążenia). Obecnie nie są zapisywane żadne reklamowe ani zewnętrzne analityczne pliki cookie.`,
      'Jeśli zostaną dodane narzędzia analityczne lub reklamowe, przed zapisaniem jakichkolwiek plików cookie pojawi się baner z prośbą o zgodę, a ta strona zostanie zaktualizowana o listę plików cookie, ich cel i okres przechowywania.',
      `Panel klienta (${appHost}) używa sesyjnych plików cookie niezbędnych do logowania.`,
    ],
    questions: 'Pytania: ',
  },

  blog: {
    meta: {
      title: (brand: string) => `Blog: asystenci głosowi AI dla firm · ${brand}`,
      description: 'Artykuły i poradniki o tym, jak agenci głosowi AI pomagają zamieniać rozmowy telefoniczne w klientów.',
    },
    eyebrow: 'Zasoby i wiedza',
    h1: 'Dziennik recepcji AI',
    intro: 'Strategie skutecznej obsługi telefonicznej, analizy przepisów i konkretne doświadczenia przedsiębiorców.',
    searchPlaceholder: 'Szukaj artykułu...',
    all: 'Wszystkie artykuły',
    categories: {
      productivite: 'Produktywność',
      conformite: 'Zgodność z przepisami',
      'cas-client': 'Studia przypadków',
      technique: 'Technologia',
    },
    read: 'Czytaj',
    notFound: {
      title: (brand: string) => `Nie znaleziono artykułu | ${brand}`,
      description: 'Ten artykuł nie istnieje lub został przeniesiony.',
      h1: 'Nie znaleziono artykułu',
      text: 'Artykuł, którego szukasz, nie istnieje lub został przeniesiony.',
      back: 'Powrót do artykułów',
    },
    articleTitle: (title: string, brand: string) => `${title} | Blog ${brand}`,
    backToList: 'Powrót do listy artykułów',
    readTime: (t: string) => `Czas czytania: ${t}`,
    publisher: (brand: string) => `${brand} Publications`,
    ctaEyebrow: 'Przejdź do działania',
    ctaTitle: 'Chcesz wyposażyć swoją firmę w recepcję AI?',
    ctaText: (d: number, m: number) => `Przetestuj już dziś naszego agenta głosowego w rzeczywistych warunkach przez ${days(d)}, z ${m} ${plural(m, 'minutą', 'minutami', 'minutami')} w cenie i bez zobowiązań.`,
    ctaButton: 'Rozpocznij bezpłatny okres próbny',
  },
};

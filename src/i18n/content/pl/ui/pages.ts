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
    submit: 'Zamów rozmowę',
  },

  help: {
    meta: {
      title: (brand: string) => `Pomoc do panelu klienta — ${brand}`,
      description: 'Przewodnik po panelu klienta w języku polskim: tłumaczenie menu, tworzenie agenta, numery, kalendarz, widżet, minuty i rozliczenia.',
    },
    breadcrumb: 'Pomoc',
    h1: 'Pomoc do Twojego panelu klienta',
    intro: 'Twój panel klienta jest wyświetlany po angielsku. Ten przewodnik tłumaczy każde menu i prowadzi Cię krok po kroku. W panelu asystentka pomocy (dymek w prawym dolnym rogu) również odpowiada na pytania w Twoim języku, na piśmie lub głosowo.',
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
      'Nagrywanie włączane lub wyłączane, ogłaszane dzwoniącemu na początku rozmowy',
      'Słowa lub tematy, których agent nigdy nie porusza (wyceny, diagnozy, porady)',
    ],
    infraTitle: 'Rozwiązanie zbudowane na certyfikowanej infrastrukturze',
    infraIntro: 'Nasze rozwiązanie (agenci, zaplanowane oddzwonienia, przekierowania, strona i panel klienta) działa na infrastrukturze certyfikowanego dostawcy technicznego. Certyfikaty należą do dostawcy; wybraliśmy go, aby zapewnić Ci ten sam poziom wymagań.',
    infraItems: ['Dostawca z certyfikatami ISO/IEC 27001:2022 (bezpieczeństwo informacji) i ISO 9001:2015 (jakość)', 'Szyfrowanie AES-256 danych w spoczynku i TLS w transmisji', 'Dostęp według ról, uwierzytelnianie dwuskładnikowe i dzienniki audytu', 'Automatyczne kopie zapasowe i odtwarzanie w kilku strefach', 'Zgodność z RODO, konfigurowalny okres przechowywania i automatyczne usuwanie', 'Płatności obsługiwane przez Stripe z certyfikatem PCI-DSS poziomu 1'],
    commitmentsTitle: 'Nasze zobowiązania',
    commitments: [
      'Agent przedstawia się jako AI i nie podszywa się pod człowieka',
      'Twoje kampanie mogą dzwonić wyłącznie do kontaktów, które wyraziły zgodę; wbudowana lista wykluczeń pomija pozostałe',
      'Agent nie stawia diagnoz medycznych, prawnych ani finansowych',
      'Twoje dane nigdy nie są sprzedawane; służą do świadczenia i ulepszania usługi',
      'Pomoc w dostosowaniu klauzul informacyjnych',
      'Umowa powierzenia przetwarzania danych (DPA) na każde życzenie',
      'Prawo do usunięcia danych: połączenie, jego nagranie i transkrypcja są usuwane na żądanie',
      'Agent informuje o nagrywaniu rozmowy; osoba, która się nie zgadza, może zamiast tego napisać do nas',
      'Kampanie wychodzące: zachowujesz dowód podstawy prawnej (relacja z klientem lub zgoda); w Polsce marketing telefoniczny wymaga uprzedniej zgody abonenta (Prawo komunikacji elektronicznej, RODO), a we Francji taki wymóg obowiązuje od 11 sierpnia 2026 r.',
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
    updated: 'Dotyczy przedsiębiorców i firm • Ostatnia aktualizacja: 6 października 2026',
    sections: ({ brand, company, email, appHost, legal }: LegalVars): LegalSection[] => {
      const mail = { a: email, href: `mailto:${email}` };
      return [
        {
          title: 'Artykuł 1 — Definicje i akceptacja',
          body: [
            { p: ['Niniejsze ogólne warunki korzystania i sprzedaży („Warunki”) regulują dostęp do usług oferowanych pod marką ', { strong: brand }, ` i korzystanie z nich; usługi świadczy ${company}, spółka typu Limited Liability Company ze stanu Wyoming (Stany Zjednoczone), ${ADDRESS} („my”).`] },
            {
              ul: [
                [{ strong: 'Usługa:' }, ` platforma programowa, panel klienta ${appHost}, głosowi i tekstowi agenci sztucznej inteligencji, widżet na stronę, komunikatory (WhatsApp, SMS, Messenger, Instagram), kampanie, automatyzacje, numery telefonów, połączenie SIP oraz wszelkie powiązane funkcje.`],
                [{ strong: 'Klient:' }, ' firma lub przedsiębiorca, który zakłada konto lub wykupuje pakiet.'],
                [{ strong: 'Użytkownik:' }, ' każda osoba upoważniona przez Klienta do dostępu do jego konta.'],
                [{ strong: 'Treści Klienta:' }, ' dane, instrukcje (prompty), bazy wiedzy, pliki, próbki głosu, listy kontaktów, nagrania i wiadomości przekazane do Usługi lub wygenerowane na rzecz Klienta.'],
                [{ strong: 'Odbiorcy:' }, ' osoby, które dzwonią do agenta Klienta albo do których agent dzwoni lub wysyła wiadomości.'],
                [{ strong: 'Kredyty:' }, ' przedpłacone minuty, kredyty na wiadomości i doładowania.'],
              ],
            },
            { p: 'Usługa jest przeznaczona wyłącznie dla przedsiębiorców działających w celach zawodowych; nie jest oferowana konsumentom. Zakładając konto, zaznaczając pole akceptacji lub korzystając z Usługi, Klient akceptuje Warunki. Osoba je akceptująca oświadcza, że ma ukończone 18 lat i jest umocowana do reprezentowania podmiotu, w którego imieniu działa.' },
          ],
        },
        {
          title: 'Artykuł 2 — Konto i bezpieczeństwo',
          body: [
            {
              ul: [
                'Klient podaje prawdziwe i pełne informacje (nazwa, dane rejestrowe, dane kontaktowe) i na bieżąco je aktualizuje.',
                'Zachowuje w poufności dane logowania i klucze API, włącza dostępne zabezpieczenia (w tym uwierzytelnianie dwuskładnikowe) i odpowiada za wszelkie działania wykonane z jego konta, także przez Użytkowników, jak za własne.',
                ['Niezwłocznie informuje nas pod adresem ', mail, ' o każdym nieuprawnionym dostępie lub podejrzeniu incydentu bezpieczeństwa.'],
                'Możemy zażądać dokumentów potwierdzających tożsamość, adres lub działalność (w szczególności przy przydzielaniu numerów) oraz odmówić założenia, ograniczyć lub zawiesić konto, jeśli nie zostaną dostarczone.',
              ],
            },
          ],
        },
        {
          title: 'Artykuł 3 — Bezpłatny okres próbny, brak prawa odstąpienia i zwrotów',
          body: [
            { p: 'Przy pierwszym wykupieniu płatnego pakietu Klient otrzymuje bezpłatny okres próbny trwający czternaście (14) kolejnych dni kalendarzowych, obejmujący 30 minut połączeń, z limitem jednego okresu próbnego na podmiot prawny, numer rejestrowy lub metodę płatności:' },
            {
              ul: [
                [{ strong: 'Metoda płatności:' }, ' przy aktywacji okresu próbnego wymagana jest karta. W ciągu 14 dni próbnych nie pobieramy żadnej opłaty.'],
                [{ strong: 'Limit użycia:' }, ' w okresie próbnym połączenia są ograniczone do 30 minut; po jego przekroczeniu zostają wstrzymane do rozpoczęcia subskrypcji. Niektóre funkcje (numery, kampanie wychodzące, komunikatory) mogą być w tym czasie ograniczone.'],
                [{ strong: 'Koniec okresu próbnego:' }, ' po 14 dniach rozpoczyna się wybrany pakiet i pobierana jest opłata za pierwszy okres (miesięczny lub roczny), chyba że Klient wcześniej anulował subskrypcję w panelu klienta — wtedy nie pobieramy żadnej kwoty.'],
              ],
            },
            { p: 'Umowy zawierane między przedsiębiorcami nie przewidują prawa odstąpienia przysługującego konsumentom. Okres próbny pozwala przetestować Usługę przed jakąkolwiek płatnością i bezpłatnie ją anulować przed jego końcem.' },
            { p: [{ strong: 'Każdy opłacony okres jest należny w całości i nie podlega zwrotowi' }, ', nawet częściowemu, w tym w razie wypowiedzenia, niekorzystania, przejścia na niższy pakiet, zawieszenia lub zamknięcia konta, a także za niewykorzystaną część okresu rocznego. Kredyty nie podlegają zwrotowi, nie są zbywalne i nie można ich wymienić na gotówkę; zakupiony kredyt nie wygasa, dopóki konto jest otwarte, i przepada z chwilą jego zamknięcia.'] },
          ],
        },
        {
          title: 'Artykuł 4 — Ceny, rozliczenia, odnowienie i podatki',
          body: [
            {
              ul: [
                'Ceny podane są w dolarach amerykańskich (USD), bez podatków. Należne podatki są naliczane przy płatności w zależności od kraju Klienta i jego statusu podatkowego (z numerem VAT lub bez) i obciążają Klienta. Jeżeli Klient musi pobrać podatek u źródła, powiększa płatność tak, abyśmy otrzymali zafakturowaną kwotę.',
                'Pakiety są płatne z góry, miesięcznie lub rocznie według wyboru Klienta (rozliczenie roczne daje dwa miesiące gratis), za pośrednictwem naszego operatora płatności Stripe. Subskrypcja odnawia się automatycznie na okres tej samej długości, a Klient upoważnia nas do pobierania cyklicznych płatności. Przy rozliczeniu rocznym minuty w pakiecie są przydzielane co miesiąc, a Usługa jest identyczna.',
                'Użycie ponad pakiet (dodatkowe minuty, wiadomości, numery telefonów, opłaty naliczane przez operatorów lub Meta) jest pobierane z kredytu lub fakturowane według aktualnych stawek podanych na stronie Cennik lub w panelu klienta.',
                ['Klient może wypowiedzieć subskrypcję w każdej chwili, bez okresu wypowiedzenia, w panelu ', { strong: appHost }, '. Wypowiedzenie staje się skuteczne z końcem już opłaconego okresu (bieżącego miesiąca lub, przy rozliczeniu rocznym, bieżącego roku), bez zwrotu (artykuł 3). Klient może w każdej chwili zmienić pakiet lub doładować kredyt; zasady zmiany są podane w panelu klienta.'],
                'Możemy zmienić ceny z 30-dniowym wyprzedzeniem, informując e-mailem lub w panelu klienta; nowa cena obowiązuje od następnego odnowienia. Klient, który jej nie akceptuje, wypowiada subskrypcję przed tą datą. Opłaty podmiotów trzecich przenoszone na Klienta (operatorzy, Meta) mogą się zmieniać w terminach narzuconych przez te podmioty.',
                'W razie nieudanej lub opóźnionej płatności możemy zawiesić całość lub część Usługi do czasu uregulowania należności, bez przedłużania okresu. Od nieopłaconych kwot naliczamy odsetki w wysokości 1,5% miesięcznie lub, jeśli jest niższa, maksymalnej dopuszczalnej stopy, a także ustawową rekompensatę za koszty odzyskiwania należności, jeśli ma zastosowanie, oraz faktycznie poniesione koszty windykacji.',
                'Każde zakwestionowanie płatności (chargeback) bez wcześniejszej reklamacji skierowanej do nas skutkuje natychmiastowym zawieszeniem konta; wszystkie należności stają się natychmiast wymagalne wraz z kosztami obciążenia zwrotnego i windykacji.',
                'Reklamacje dotyczące faktury należy zgłosić w ciągu 30 dni od jej wystawienia; w przeciwnym razie fakturę uważa się za zaakceptowaną.',
              ],
            },
          ],
        },
        {
          title: 'Artykuł 5 — Dozwolone korzystanie i treści zabronione',
          body: [
            { p: 'Klient korzysta z Usługi zgodnie z obowiązującym prawem i Warunkami. W szczególności zabronione są:' },
            {
              ul: [
                'wszelkie działania niezgodne z prawem, oszukańcze, wprowadzające w błąd lub stanowiące nadużycie, w tym phishing i vishing, wyłudzenia oraz podszywanie się pod osobę, firmę lub organ władzy;',
                'nękanie, groźby oraz treści nienawistne, dyskryminujące, zniesławiające, zawierające przemoc lub naruszające prawa osób trzecich;',
                'niezamówione połączenia i wiadomości lub masowa wysyłka bez zgody, a także obchodzenie sprzeciwu;',
                'zastosowania wysokiego ryzyka: zastępowanie służb ratunkowych lub dzwonienie do nich; opieranie na agencie decyzji medycznych, prawnych, finansowych, ubezpieczeniowych, kredytowych, kadrowych lub mieszkaniowych bez nadzoru wykwalifikowanego człowieka; windykacja należności poza obowiązującymi ramami prawnymi; zautomatyzowane połączenia lub wiadomości o charakterze politycznym lub wyborczym; treści dla dorosłych lub seksualne oraz wszelkie treści z udziałem małoletnich; hazard, broń, narkotyki lub produkty regulowane bez zezwolenia;',
                'zbieranie przez agenta szczególnych kategorii danych, pełnych numerów kart płatniczych lub numerów identyfikacyjnych bez podstawy prawnej i odpowiednich zabezpieczeń;',
                'wykorzystywanie próbek głosu (klonowanie głosu) bez uprzedniej, udokumentowanej i odwołalnej zgody osoby, której głos jest odtwarzany;',
                'wszelkie naruszanie bezpieczeństwa lub integralności Usługi: złośliwy kod, nieautoryzowane testy penetracyjne lub obciążeniowe, obchodzenie limitów, dostęp do kont innych klientów;',
                'inżynieria wsteczna, dekompilacja lub deasemblacja (z wyjątkiem zakresu wyraźnie dozwolonego przez prawo), automatyczne pobieranie danych (scraping), kopiowanie Usługi lub wykorzystywanie jej do tworzenia konkurencyjnej usługi albo trenowania modeli;',
                'odsprzedaż, sublicencjonowanie, najem, udostępnianie osobom trzecim lub sprzedaż Usługi pod własną marką (white label) bez naszej uprzedniej pisemnej zgody.',
              ],
            },
            { p: 'Bez obowiązku monitorowania możemy weryfikować sposób korzystania z Usługi, usuwać treści, blokować numer, kampanię lub wiadomość, zawiesić konto (artykuł 13) oraz współpracować z operatorami, platformami i organami władzy.' },
          ],
        },
        {
          title: 'Artykuł 6 — Zgodność połączeń i wiadomości z prawem',
          body: [
            { p: [{ strong: 'Klient ponosi wyłączną odpowiedzialność za zgodność swoich połączeń, kampanii i wiadomości' }, ' z prawem każdego kraju, w którym znajdują się Odbiorcy, w tym z RODO, przepisami o marketingu bezpośrednim i komunikacji elektronicznej (ePrivacy), a w razie kontaktu z osobami w Stanach Zjednoczonych — z Telephone Consumer Protection Act (TCPA) i Telemarketing Sales Rule (TSR). W szczególności:'] },
            {
              ul: [
                [{ strong: 'Zgoda:' }, ' przed każdym zautomatyzowanym, wychodzącym lub marketingowym połączeniem lub wiadomością (głos, SMS, WhatsApp) uzyskuje zgody wymagane przez prawo, przechowuje dowody ich udzielenia i niezwłocznie respektuje każdy sprzeciw (słowo STOP, prośba ustna lub pisemna).'],
                [{ strong: 'Rejestry sprzeciwu:' }, ' sprawdza i respektuje obowiązujące rejestry i zasady: polskie przepisy wymagające uprzedniej zgody na marketing telefoniczny (Prawo komunikacji elektronicznej), we Francji uprzednia, wyraźna zgoda osoby na telemarketing od 11 sierpnia 2026 r. (art. L223-1 francuskiego Kodeksu konsumenckiego), TPS i CTPS (Wielka Brytania), Do Not Call Register (Australia), Registro pubblico delle opposizioni (Włochy) oraz zasady niderlandzkie (uprzednia zgoda lub istniejąca relacja z klientem, Bel-me-niet Register).'],
                [{ strong: 'Godziny i częstotliwość:' }, ' przestrzega dozwolonych dni, godzin i częstotliwości połączeń.'],
                [{ strong: 'Identyfikacja:' }, ' prezentuje ważny, przydzielony mu numer, nie podszywa się pod cudze numery i jasno się przedstawia.'],
                [{ strong: 'Przejrzystość:' }, ' od początku rozmowy wyraźnie informuje Odbiorców, że komunikują się z systemem sztucznej inteligencji (w szczególności zgodnie z unijnym aktem w sprawie sztucznej inteligencji), a jeżeli wymaga tego prawo — że rozmowa jest nagrywana lub transkrybowana, i uzyskuje ich zgodę, gdy jest wymagana.'],
                [{ strong: 'Platformy:' }, ' przestrzega zasad Meta (WhatsApp Business, Messenger, Instagram), w tym zatwierdzania szablonów i okien rozmów, oraz zasad operatorów (rejestracja nadawców, nadpisy alfanumeryczne). Podmioty te mogą ograniczyć konto lub numer bez naszej odpowiedzialności.'],
              ],
            },
            { p: 'Numery telefonów udostępniają operatorzy (np. Twilio): Klient otrzymuje je do używania i nie staje się ich właścicielem. Przydział numeru może wymagać dokumentów potwierdzających tożsamość, adres lub działalność; operator lub regulator może numer zmienić lub odebrać. Numer może zostać zwolniony i bezpowrotnie utracony w razie wypowiedzenia, długotrwałego zawieszenia lub braku płatności. Przeniesienie numeru do innego operatora zależy od możliwości technicznych i regulacyjnych.' },
            { p: [{ strong: 'Brak połączeń alarmowych.' }, ' Usługa nie umożliwia połączeń z numerami alarmowymi (112, 999, 997, 911 itp.) i nie zastępuje linii telefonicznej. Klient informuje o tym swoich Użytkowników.'] },
          ],
        },
        {
          title: 'Artykuł 7 — Funkcje sztucznej inteligencji',
          body: [
            {
              ul: [
                'Odpowiedzi, transkrypcje, podsumowania i głosy są generowane automatycznie i mogą być nieprawidłowe, niepełne lub niestosowne. Klient sprawdza je, zanim na nich polega.',
                'Klient konfiguruje instrukcje, bazy wiedzy, głosy, narzędzia i automatyzacje swoich agentów: odpowiada za wszystko, co jego agent mówi, obiecuje lub robi w jego imieniu (wizyty, ceny, zobowiązania).',
                'Usługa nie świadczy porad medycznych, prawnych, finansowych, podatkowych ani innych porad specjalistycznych, a Klient nie może przedstawiać swojego agenta jako ich źródła.',
                'Modele, głosy, języki i dostawcy AI mogą się zmieniać, być zastępowani lub wycofywani; dostępność konkretnego modelu lub głosu nie jest gwarantowana.',
                'W relacji między stronami treści wygenerowane dla Klienta należą do niego, z zastrzeżeniem praw osób trzecich i naszych praw do Usługi; mogą nie być unikalne.',
              ],
            },
          ],
        },
        {
          title: 'Artykuł 8 — Dane Klienta i ochrona danych osobowych',
          body: [
            { p: ['W odniesieniu do danych osobowych Odbiorców przetwarzanych w ramach Usługi Klient jest administratorem, a my działamy jako podmiot przetwarzający (art. 28 RODO i odpowiednie przepisy). Niniejszy artykuł i ', { a: 'polityka prywatności', href: '/confidentialite' }, ' stanowią umowę powierzenia przetwarzania danych; podpisaną umowę można zawrzeć w ramach pakietu „Na miarę”. My:'] },
            {
              ul: [
                'przetwarzamy dane wyłącznie na udokumentowane polecenie Klienta (Warunki i jego ustawienia), chyba że obowiązek wynika z prawa, i informujemy go, jeśli polecenie wydaje się niezgodne z prawem;',
                'zobowiązujemy osoby upoważnione do zachowania poufności;',
                'stosujemy odpowiednie środki techniczne i organizacyjne;',
                'korzystamy z dalszych podmiotów przetwarzających wymienionych w polityce prywatności, na co Klient udziela ogólnej zgody; o każdej zmianie informujemy z co najmniej 15-dniowym wyprzedzeniem, a Klient może zgłosić uzasadniony sprzeciw, przy czym jego jedynym środkiem jest wówczas wypowiedzenie;',
                'w rozsądnym zakresie pomagamy Klientowi w obsłudze żądań osób, których dane dotyczą, ocen skutków i naruszeń ochrony danych, o których informujemy bez zbędnej zwłoki;',
                'usuwamy dane po zakończeniu umowy zgodnie z artykułem 13, chyba że prawo nakazuje ich przechowywanie;',
                'udostępniamy informacje niezbędne do wykazania zgodności; audyt może odbyć się nie częściej niż raz w roku, z rozsądnym wyprzedzeniem, na koszt Klienta i z zachowaniem poufności.',
              ],
            },
            { p: 'Klient zapewnia, że ma podstawę prawną każdego przetwarzania, informuje Odbiorców (agent AI, nagrywanie, cele), uzyskuje wymagane zgody, powierza przetwarzanie szczególnych kategorii danych tylko wtedy, gdy jest to konieczne i zgodne z prawem, a jego listy kontaktów zostały zebrane legalnie. Nagrywanie rozmów i okres przechowywania nagrań konfiguruje Klient.' },
            { p: 'Możemy wykorzystywać dane zagregowane lub zanonimizowane oraz metadane użycia do obsługi, zabezpieczania i ulepszania Usługi. Nie wykorzystujemy treści połączeń i wiadomości Klienta do trenowania naszych własnych modeli.' },
          ],
        },
        {
          title: 'Artykuł 9 — Usługi osób trzecich i integracje',
          body: [
            { p: 'Usługa opiera się na podmiotach trzecich lub łączy się z nimi: operatorami telekomunikacyjnymi, Meta (WhatsApp, Messenger, Instagram), kalendarzami, systemami CRM, narzędziami automatyzacji, dostawcami AI i płatności. Obowiązują ich warunki, które Klient akceptuje, jeżeli tego wymagają. Włączając integrację, Klient upoważnia nas do wymiany z nią niezbędnych danych. Nie kontrolujemy tych usług i nie odpowiadamy za ich dostępność, zmiany ani za przetwarzanie danych przekazanych im na żądanie Klienta.' },
          ],
        },
        {
          title: 'Artykuł 10 — Własność intelektualna',
          body: [
            {
              ul: [
                `Usługa, jej oprogramowanie, interfejsy i dokumentacja, marka ${brand} i jej logotypy należą do nas lub naszych licencjodawców i podlegają ochronie, w szczególności na podstawie przepisów: ${legal.copyrightLaw}. Klient nie nabywa żadnych praw poza licencją opisaną poniżej.`,
                'Udzielamy Klientowi, na czas trwania subskrypcji, ograniczonej, niewyłącznej, niezbywalnej, bez prawa sublicencji i odwołalnej licencji na korzystanie z Usługi na jego wewnętrzne potrzeby zawodowe.',
                'Klient zachowuje prawa do Treści Klienta. Udziela nam ogólnoświatowej, nieodpłatnej i niewyłącznej licencji na ich przechowywanie, kopiowanie, przetwarzanie, przesyłanie i wyświetlanie oraz powierzanie ich przetwarzania naszym podwykonawcom, wyłącznie w zakresie niezbędnym do świadczenia, zabezpieczania i wsparcia Usługi oraz przestrzegania prawa. Zapewnia, że posiada niezbędne prawa.',
                'Sugestie i opinie Klienta możemy wykorzystywać swobodnie, nieodpłatnie i bez ograniczeń czasowych.',
                'Klient nie używa naszych znaków towarowych bez pisemnej zgody. Możemy wskazywać nazwę i logo Klienta jako referencję, chyba że sprzeciwi się temu e-mailem.',
                ['Aby zgłosić treść bezprawną lub naruszenie praw autorskich, napisz na adres ', mail, ', wskazując utwór, lokalizację treści, swoje dane kontaktowe i oświadczenie o działaniu w dobrej wierze. Możemy usunąć treść i zawiesić konta, które wielokrotnie naruszają prawa.'],
              ],
            },
          ],
        },
        {
          title: 'Artykuł 11 — Poufność',
          body: [
            { p: 'Każda ze stron zachowuje w poufności niepubliczne informacje otrzymane od drugiej strony, wykorzystuje je wyłącznie do wykonania Warunków i chroni je z należytą starannością, w czasie trwania umowy i przez trzy lata po jej zakończeniu (a w przypadku tajemnic przedsiębiorstwa — tak długo, jak pozostają tajemnicą). Poufne nie są informacje publiczne, już znane, opracowane niezależnie lub legalnie otrzymane od osoby trzeciej. Strona może ujawnić informacje, jeżeli wymaga tego prawo lub organ władzy, powiadamiając drugą stronę, o ile jest to dozwolone.' },
          ],
        },
        {
          title: 'Artykuł 12 — Zmiany Usługi, funkcje beta i dostępność',
          body: [
            {
              ul: [
                'Możemy rozwijać Usługę, dodawać, zmieniać lub wycofywać funkcje oraz zmieniać dostawców. O wycofaniu kluczowej funkcji płatnego pakietu informujemy z wyprzedzeniem, jeżeli jest to rozsądnie możliwe.',
                'Funkcje beta, wersje zapoznawcze i eksperymentalne są udostępniane w stanie, w jakim są, bez zobowiązań, i mogą zostać wycofane w każdej chwili.',
                'Naszym zobowiązaniem jest dołożenie należytej staranności. Nie obowiązuje żaden gwarantowany poziom usług (SLA), chyba że uzgodniono go na piśmie w umowie „Na miarę”. Usługa zależy od internetu, operatorów i naszych dostawców; planowane (zapowiadane w miarę możliwości) lub pilne prace konserwacyjne mogą ją przerwać.',
                'Mogą obowiązywać limity rozsądnego użycia (połączenia równoczesne, przepustowość, wolumeny).',
              ],
            },
          ],
        },
        {
          title: 'Artykuł 13 — Zawieszenie i rozwiązanie umowy',
          body: [
            { p: 'Możemy zawiesić lub zamknąć konto w całości lub części w każdej chwili, z uprzedzeniem lub bez, i bez odszkodowania, w razie: naruszenia Warunków, braku płatności lub chargebacku, skargi operatora, Meta, organu władzy lub Odbiorców, podejrzenia oszustwa, zagrożenia bezpieczeństwa, ryzyka prawnego lub wizerunkowego, żądania organu władzy albo wymogu jednego z naszych dostawców. W czasie zawieszenia opłaty pozostają należne. Takie zamknięcie nie uprawnia do żadnego zwrotu, także za niewykorzystane opłacone z góry okresy.' },
            {
              ul: [
                'Klient może wypowiedzieć subskrypcję w każdej chwili; wypowiedzenie jest skuteczne z końcem opłaconego okresu (artykuł 4).',
                'Możemy również rozwiązać umowę bez podania przyczyny z 30-dniowym wypowiedzeniem; tylko w takim przypadku zwracamy niewykorzystaną część opłaconego z góry okresu.',
                'Po zakończeniu umowy dostęp wygasa, należności stają się wymagalne, numery mogą zostać zwolnione, a Kredyty przepadają. Klient może eksportować swoje dane z panelu klienta przez 30 dni; następnie dane są usuwane w ciągu 90 dni od zakończenia umowy, z zastrzeżeniem ustawowych obowiązków przechowywania i zwykłego cyklu kopii zapasowych.',
                'Konta bezpłatne lub próbne bez płatnej subskrypcji, nieaktywne od 90 dni, mogą zostać zamknięte, a ich dane usunięte po ostrzeżeniu wysłanym e-mailem.',
                'Postanowienia, które ze swej natury obowiązują po zakończeniu umowy (należności, dane, własność intelektualna, poufność, gwarancje, odpowiedzialność, zwolnienie z odpowiedzialności, spory), pozostają w mocy.',
              ],
            },
          ],
        },
        {
          title: 'Artykuł 14 — Wyłączenie gwarancji',
          body: [
            { p: 'W zakresie dozwolonym przez prawo Usługa jest świadczona „w stanie, w jakim jest” i „w miarę dostępności”. Wyłączamy wszelkie gwarancje i rękojmię, wyraźne lub dorozumiane, w tym co do przydatności handlowej, przydatności do określonego celu, nienaruszania praw, nieprzerwanego lub bezbłędnego działania, poprawności treści generowanych przez AI, doręczenia połączeń i wiadomości lub osiągnięcia jakiegokolwiek wyniku biznesowego.' },
          ],
        },
        {
          title: 'Artykuł 15 — Ograniczenie odpowiedzialności',
          body: [
            {
              ul: [
                'Nie odpowiadamy za szkody pośrednie, następcze, szczególne ani karne, ani za utratę zysków, przychodów, klientów, możliwości lub reputacji, utratę lub uszkodzenie danych, nieodebrane połączenia lub utracone wizyty ani koszt usługi zastępczej, nawet jeśli uprzedzono nas o takiej możliwości.',
                'Nie odpowiadamy za szkody wynikające z Treści Klienta, konfiguracji agentów, usług osób trzecich, operatorów, Meta, internetu, siły wyższej lub naruszenia przez Klienta.',
                [{ strong: 'Limit:' }, ' nasza łączna odpowiedzialność z wszelkich tytułów jest ograniczona do kwoty netto faktycznie zapłaconej przez Klienta za subskrypcję za miesiąc poprzedzający zdarzenie wywołujące szkodę (przy rozliczeniu rocznym — jednej dwunastej ceny rocznej) i w żadnym wypadku nie przekracza 1000 USD.'],
                'Klient przyjmuje do wiadomości, że ceny odzwierciedlają taki podział ryzyka.',
              ],
            },
            { p: 'Żadne postanowienie Warunków nie wyłącza ani nie ogranicza odpowiedzialności lub prawa, których nie można wyłączyć ani ograniczyć na mocy bezwzględnie obowiązujących przepisów (w szczególności za szkodę wyrządzoną umyślnie, rażące niedbalstwo lub szkodę na osobie).' },
            ...(legal.mandatoryNote ? [{ p: legal.mandatoryNote }] : []),
          ],
        },
        {
          title: 'Artykuł 16 — Zwolnienie z odpowiedzialności przez Klienta',
          body: [
            { p: `Klient broni nas, naszych członków zarządu, pracowników, podwykonawców i dostawców, zwalnia nas z odpowiedzialności i naprawia szkody w związku z wszelkimi roszczeniami, stratami, grzywnami, karami, zasądzonymi kwotami i kosztami (w tym uzasadnionymi kosztami obsługi prawnej) wynikającymi z: jego Treści Klienta i konfiguracji jego agentów; jego połączeń, wiadomości i kampanii; braku zgody, nieuwzględnienia sprzeciwu lub rejestru sprzeciwu; jakiegokolwiek naruszenia przepisów telekomunikacyjnych, marketingowych, dotyczących AI lub ochrony danych; naruszenia Warunków; roszczeń Odbiorcy, Użytkownika, operatora, Meta, naszego dostawcy platformy technicznej lub organu władzy związanych z korzystaniem przez Klienta z Usługi. Klient przyjmuje do wiadomości, że ${company} może odpowiadać wobec swoich dostawców za naruszenia swoich klientów. Informujemy Klienta o roszczeniu; nie może on zawrzeć ugody nakładającej na nas obowiązki bez naszej zgody.` },
          ],
        },
        {
          title: 'Artykuł 17 — Termin dochodzenia roszczeń',
          body: [
            { p: 'W zakresie dozwolonym przez prawo wszelkie roszczenia przeciwko nam należy zgłosić w terminie trzech (3) miesięcy od zdarzenia, z którego wynikają, lub od dnia, w którym Klient się o nim dowiedział lub powinien był się dowiedzieć; po tym terminie roszczenie wygasa.' },
          ],
        },
        {
          title: 'Artykuł 18 — Prawo właściwe, arbitraż i zrzeczenie się powództw zbiorowych',
          body: [
            {
              ul: [
                `Warunki podlegają ${legal.governingLaw}, z wyłączeniem norm kolizyjnych oraz Konwencji Narodów Zjednoczonych o umowach międzynarodowej sprzedaży towarów.`,
                ['Przed wszczęciem jakiegokolwiek postępowania strona zgłaszająca roszczenie przesyła pisemną reklamację (do nas: ', mail, '); strony przez 30 dni poszukują polubownego rozwiązania.'],
                `W braku porozumienia wszelkie spory wynikające z Warunków lub Usługi albo z nimi związane rozstrzyga ostatecznie poufny i wiążący arbitraż prowadzony przez American Arbitration Association (AAA) zgodnie z jej Regulaminem arbitrażu handlowego (a w sporach międzynarodowych — przez jej International Centre for Dispute Resolution), przed jednym arbitrem, z siedzibą w Cheyenne (Wyoming), w języku angielskim. Wyrok arbitrażowy może zatwierdzić i wykonać ${legal.court} lub każdy inny właściwy sąd.`,
                [{ strong: 'Zrzeczenie się powództw zbiorowych:' }, ' spory są rozstrzygane wyłącznie indywidualnie, z wyłączeniem powództw grupowych, zbiorowych lub przedstawicielskich oraz łączonych postępowań arbitrażowych. Jeżeli zrzeczenie to zostanie uznane za nieskuteczne wobec danego roszczenia, roszczenie to rozpoznaje sąd wskazany poniżej, a nie arbitraż.'],
                'Każda strona może wystąpić do właściwego sądu o środki pilne lub zabezpieczające (w szczególności w celu ochrony własności intelektualnej lub informacji poufnych albo przerwania nadużyć Usługi), bez składania kaucji w zakresie dozwolonym przez prawo. Każda strona może wnieść indywidualne roszczenie do sądu właściwego dla drobnych spraw, a my możemy dochodzić nieopłaconych należności przed każdym właściwym sądem.',
                `Spory niepodlegające arbitrażowi rozstrzyga wyłącznie ${legal.court}.`,
              ],
            },
          ],
        },
        {
          title: 'Artykuł 19 — Siła wyższa',
          body: [
            { p: 'Żadna ze stron nie odpowiada za opóźnienie lub niewykonanie spowodowane zdarzeniem pozostającym poza jej rozsądną kontrolą: klęską żywiołową, epidemią, wojną, terroryzmem, zamieszkami, strajkiem, decyzją organu władzy, awarią operatora, internetu, sieci energetycznej, centrum danych lub dostawcy chmury bądź AI, cyberatakiem albo decyzją Meta lub operatora. Obowiązki płatnicze nie ulegają zawieszeniu. Jeżeli zdarzenie trwa dłużej niż 30 dni, każda ze stron może wypowiedzieć daną subskrypcję poprzez zawiadomienie.' },
          ],
        },
        {
          title: 'Artykuł 20 — Przeniesienie praw i zmiana kontroli',
          body: [
            { p: 'Możemy przenieść całość lub część praw i obowiązków z Warunków, w tym w razie połączenia, przejęcia, reorganizacji lub zbycia aktywów, bez zgody Klienta, po poinformowaniu go, oraz powierzyć wykonanie naszych obowiązków podwykonawcom. Klient nie może przenieść Warunków bez naszej uprzedniej pisemnej zgody; informuje nas o każdej zmianie kontroli, a my możemy wówczas rozwiązać umowę, jeżeli nowy właściciel jest konkurentem lub nie przejdzie naszej weryfikacji.' },
          ],
        },
        {
          title: 'Artykuł 21 — Postanowienia ogólne',
          body: [
            {
              ul: [
                [{ strong: 'Całość porozumienia:' }, ' Warunki, strona Cennik, szczegóły wykupionego pakietu, ', { a: 'polityka prywatności', href: '/confidentialite' }, ' oraz, w stosownych przypadkach, podpisana umowa „Na miarę” stanowią całość porozumienia i zastępują wcześniejsze ustalenia. Ogólne warunki zakupu Klienta nie mają zastosowania.'],
                [{ strong: 'Pierwszeństwo:' }, ' podpisana umowa „Na miarę”, następnie Warunki, następnie polityka prywatności, następnie strona Cennik i dokumentacja.'],
                [{ strong: 'Rozdzielność i brak zrzeczenia się:' }, ' nieważne postanowienie zastępuje się najbliższym ważnym postanowieniem, a pozostałe pozostają w mocy; niewykonanie prawa nie oznacza zrzeczenia się go.'],
                [{ strong: 'Zawiadomienia:' }, ' piszemy na adres e-mail konta lub w panelu klienta; Klient pisze do nas na adres ', mail, '. Klient akceptuje komunikację i faktury w formie elektronicznej.'],
                [{ strong: 'Zmiany:' }, ' możemy zmieniać Warunki; o istotnych zmianach informujemy e-mailem lub na stronie co najmniej 15 dni przed ich wejściem w życie, chyba że wymogi prawne lub bezpieczeństwa stanowią inaczej. Dalsze korzystanie oznacza akceptację; Klient, który ich nie akceptuje, wypowiada subskrypcję przed tą datą.'],
                [{ strong: 'Język:' }, ' Warunki są publikowane w kilku językach. W razie rozbieżności rozstrzygająca jest wersja angielska.'],
                [{ strong: 'Sankcje i eksport:' }, ' Klient oświadcza, że nie podlega sankcjom gospodarczym i nie korzysta z Usługi w kraju objętym sankcjami ani na rzecz osoby objętej sankcjami.'],
                [{ strong: 'Niezależność:' }, ' strony są niezależnymi kontrahentami; Warunki nie tworzą praw na rzecz osób trzecich.'],
                [{ strong: 'Kontakt:' }, ` ${company}, ${ADDRESS}, Stany Zjednoczone — `, mail, '.'],
              ],
            },
          ],
        },
      ];
    },
  },

  privacy: {
    meta: {
      title: (brand: string) => `Polityka prywatności — ${brand}`,
      description: (brand: string) => `Jak ${brand} przetwarza Twoje dane: prośby o oddzwonienie, agenci AI i nagrania, konto klienta, rozliczenia Stripe, dostawcy i Twoje prawa.`,
    },
    breadcrumb: 'Prywatność',
    h1: 'Polityka prywatności',
    intro: 'Jakie dane zbieramy, w jakim celu, komu je przekazujemy, jak długo je przechowujemy i jak możesz skorzystać ze swoich praw.',
    updated: 'Ostatnia aktualizacja: 6 października 2026',
    sections: ({ brand, company, email, legal }: LegalVars): LegalSection[] => {
      const mail = { a: email, href: `mailto:${email}` };
      return [
        {
          title: 'Kim jesteśmy i jaka jest nasza rola',
          body: [
            { p: [`${brand} jest marką firmy ${company}, spółki typu Limited Liability Company zarejestrowanej w stanie Wyoming (Stany Zjednoczone), ${ADDRESS}. Kontakt: `, mail, `. Dane osobowe przetwarzamy zgodnie z przepisami o ochronie danych: ${legal.privacyLaw}, oraz innymi obowiązującymi przepisami.`] },
            {
              ul: [
                [{ strong: 'Administrator:' }, ` w odniesieniu do strony internetowej, formularzy i próśb o oddzwonienie, rozmów z naszymi asystentkami AI, kont klientów, rozliczeń i naszego marketingu administratorem jest ${company}.`],
                [{ strong: 'Podmiot przetwarzający:' }, ' w odniesieniu do połączeń, wiadomości i kontaktów obsługiwanych przez agentów naszych klientów administratorem wobec swoich rozmówców jest klient; działamy w jego imieniu i na jego polecenie. Jeśli skontaktował się z Tobą agent firmy będącej naszym klientem, zwróć się najpierw do niej; przekażemy jej każde otrzymane żądanie.'],
              ],
            },
          ],
        },
        {
          title: 'Jakie dane zbieramy',
          body: [
            {
              ul: [
                [{ strong: 'Formularze na stronie' }, ' (oddzwonienie, demo, pomoc w okresie próbnym): imię i nazwisko, telefon, e-mail, firma, branża, preferowany termin, wiadomość i zgoda.'],
                [{ strong: 'Rozmowy z naszymi asystentkami AI' }, ' (dymek na stronie, recepcjonistka, połączenia demonstracyjne, oddzwonienia handlowe i wsparcia, pomoc w panelu klienta): treść pisemna, nagranie audio rozmów głosowych, transkrypcja, podsumowanie i wyodrębnione informacje (potrzeba, rozważany pakiet, zgłoszony problem).'],
                [{ strong: 'Konto klienta' }, ': tożsamość i dane kontaktowe użytkowników, informacje o firmie, dane logowania, ustawienia i instrukcje agentów, bazy wiedzy, listy kontaktów, historia połączeń i wiadomości, zużycie minut i kredytów, zgłoszenia do wsparcia.'],
                [{ strong: 'Dane przetwarzane dla naszych klientów' }, ': numery i nazwiska dzwoniących lub kontaktów, treść połączeń, wiadomości, nagrania, transkrypcje, wizyty i karty potencjalnych klientów.'],
                [{ strong: 'Rozliczenia' }, ': pakiet, faktury, adres rozliczeniowy, numer VAT, status płatności. Dane karty są wprowadzane i przechowywane przez Stripe; nigdy nie mamy do nich dostępu.'],
                [{ strong: 'Dane techniczne' }, ': adres IP, urządzenie i przeglądarka, logi połączeń i bezpieczeństwa, pliki cookie.'],
                [{ strong: 'Dane otrzymane od podmiotów trzecich' }, ': integracje włączone przez klienta (kalendarze, CRM, WhatsApp, Messenger, Instagram), metadane połączeń i wiadomości od operatorów, informacje o płatnościach i zapobieganiu oszustwom od Stripe oraz publiczne informacje o firmach wykorzystywane do weryfikacji konta.'],
              ],
            },
          ],
        },
        {
          title: 'Cele i podstawy prawne',
          body: [
            {
              ul: [
                [{ strong: 'Oddzwonienie i odpowiedź na Twoją prośbę' }, ', także przez połączenie naszego agenta głosowego AI: Twoja zgoda, wyrażona przy składaniu prośby i odwołalna w każdej chwili.'],
                [{ strong: 'Świadczenie Usługi, okresu próbnego i wsparcia' }, ': wykonanie umowy lub działania przed jej zawarciem.'],
                [{ strong: 'Przetwarzanie danych naszych klientów w ich imieniu' }, ': ich polecenia, na podstawie prawnej przez nich określonej.'],
                [{ strong: 'Fakturowanie, księgowość, obowiązki podatkowe i odpowiedzi na żądania organów' }, ': obowiązek prawny.'],
                [{ strong: 'Zabezpieczenie platformy, zapobieganie oszustwom i nadużyciom, egzekwowanie naszych warunków, obrona przed roszczeniami, ulepszanie naszych asystentek na podstawie naszych własnych rozmów i zagregowanych statystyk' }, ': prawnie uzasadniony interes.'],
                [{ strong: 'Marketing skierowany do firm' }, ': prawnie uzasadniony interes lub zgoda, jeśli wymaga jej prawo; możesz w każdej chwili wnieść sprzeciw.'],
                [{ strong: 'Analityczne pliki cookie' }, ': Twoja zgoda.'],
              ],
            },
          ],
        },
        {
          title: 'Sztuczna inteligencja, nagrania i transkrypcje',
          body: [
            { p: 'Nasze asystentki są systemami sztucznej inteligencji i tak się przedstawiają. Rozmowy głosowe są nagrywane i transkrybowane; dostawcy AI przygotowują ich podsumowania i wyodrębniają informacje potrzebne do obsługi Twojej prośby. Żadna decyzja wywołująca skutki prawne lub w podobny sposób istotnie na Ciebie wpływająca nie jest podejmowana wyłącznie w sposób zautomatyzowany.' },
            { p: 'Nie sprzedajemy Twoich danych ani nie udostępniamy ich w celach reklamy ukierunkowanej. Nie wykorzystujemy treści połączeń i wiadomości naszych klientów do trenowania naszych własnych modeli. Nasi dostawcy AI przetwarzają dane na podstawie umowy, w naszym imieniu.' },
            { p: 'Klienci korzystający z platformy muszą informować swoich rozmówców, że komunikują się z systemem AI, a jeżeli wymaga tego prawo — że rozmowa jest nagrywana. To oni konfigurują nagrywanie i okres przechowywania nagrań.' },
          ],
        },
        {
          title: 'Udostępnianie danych i podmioty przetwarzające',
          body: [
            { p: 'Twoje dane przekazujemy wyłącznie odbiorcom, którzy ich potrzebują, związanym zobowiązaniami do poufności i ochrony danych:' },
            {
              ul: [
                [{ strong: 'Nasz dostawca platformy technicznej' }, ': agenci głosowi, widżety, panel klienta, transkrypcja, synteza mowy i automatyzacje. Dostawca ten ma siedzibę w Unii Europejskiej (Rumunia), posiada certyfikat ISO 27001 i przechowuje dane w Europejskim Obszarze Gospodarczym i/lub w Stanach Zjednoczonych.'],
                [{ strong: 'Twilio i inni operatorzy telekomunikacyjni' }, ': kierowanie połączeń i SMS-ów, numery telefonów.'],
                [{ strong: 'Meta' }, ' (WhatsApp, Messenger, Instagram): gdy klient korzysta z tych kanałów.'],
                [{ strong: 'Dostawcy AI, głosu i transkrypcji' }, ': rozumienie, odpowiadanie, synteza mowy i transkrypcja.'],
                [{ strong: 'Stripe' }, ': subskrypcje, płatności, faktury i obliczanie podatków (certyfikat PCI DSS poziomu 1).'],
                [{ strong: 'Supabase' }, ': baza danych próśb, rejestracji i podsumowań rozmów (Stany Zjednoczone).'],
                [{ strong: 'Google Cloud (Firebase)' }, ': hosting strony (Stany Zjednoczone).'],
                [{ strong: 'Zoho' }, ': wysyłka e-maili serwisowych i kontaktowych.'],
                [{ strong: 'Integracje włączone przez klienta' }, ' (kalendarze, CRM, narzędzia automatyzacji), nasi doradcy zawodowi, organy władzy, gdy wymaga tego prawo, oraz ewentualny nabywca w razie połączenia lub sprzedaży.'],
              ],
            },
          ],
        },
        {
          title: 'Przekazywanie danych za granicę',
          body: [
            { p: 'Nasza spółka i kilku dostawców znajdują się w Stanach Zjednoczonych; nasz dostawca platformy technicznej ma siedzibę w Unii Europejskiej i przechowuje dane w EOG i/lub w Stanach Zjednoczonych. Przekazywanie danych jest szyfrowane i zabezpieczone:' },
            {
              ul: [
                'Unia Europejska i EOG: Ramy ochrony danych UE–USA, jeżeli odbiorca jest nimi objęty, a w przeciwnym razie standardowe klauzule umowne Komisji Europejskiej, w razie potrzeby z dodatkowymi środkami.',
                'Wielka Brytania: brytyjskie rozszerzenie tych ram lub brytyjski aneks do standardowych klauzul umownych.',
                'Szwajcaria: ramy Szwajcaria–USA lub standardowe klauzule umowne uznane przez federalnego komisarza ds. ochrony danych (FDPIC).',
                'Australia: podejmujemy rozsądne kroki, także umowne, aby odbiorcy za granicą przetwarzali informacje zgodnie z Australian Privacy Principles (APP 8).',
              ],
            },
            { p: ['Kopię stosowanych zabezpieczeń można otrzymać, pisząc na adres ', mail, '.'] },
          ],
        },
        {
          title: 'Jak długo przechowujemy dane',
          body: [
            {
              ul: [
                'Prośby o oddzwonienie i rozmowy z naszymi asystentkami: 24 miesiące od ostatniego kontaktu.',
                'Połączenia, nagrania, transkrypcje, czaty i SMS-y przetwarzane dla naszych klientów: domyślnie 12 miesięcy; każdy klient może skrócić ten okres i usunąć swoje dane.',
                'Potencjalni klienci i kontakty zebrane przez agentów naszych klientów: domyślnie 24 miesiące, klient może ten okres skrócić.',
                'Dane konta: przez czas trwania umowy, a następnie 3 lata w celach marketingowych, chyba że wniesiesz sprzeciw. Zawartość konta jest usuwana w ciągu 90 dni od zakończenia umowy.',
                'Faktury i dokumenty księgowe: 10 lat.',
                'Logi techniczne i bezpieczeństwa: przez ograniczony czas niezbędny dla bezpieczeństwa.',
              ],
            },
            { p: 'Po upływie tych okresów dane są usuwane lub anonimizowane.' },
          ],
        },
        {
          title: 'Bezpieczeństwo',
          body: [
            { p: 'Dane są szyfrowane podczas przesyłania (TLS) i w spoczynku (AES-256). Dostęp jest przydzielany według ról, chroniony uwierzytelnianiem i rejestrowany w logach audytowych; klienci mogą włączyć uwierzytelnianie dwuskładnikowe; regularnie wykonujemy kopie zapasowe, a klucze techniczne przechowujemy w sejfach na sekrety. Nasz dostawca platformy technicznej posiada certyfikat ISO 27001. Ponieważ żaden system nie jest niezawodny, zgłaszamy naruszenia ochrony danych organom i osobom, których dotyczą, gdy wymaga tego prawo.' },
          ],
        },
        {
          title: 'Twoje prawa w zależności od kraju',
          body: [
            {
              ul: [
                [{ strong: 'Unia Europejska i EOG' }, ' (w tym Polska, Francja, Włochy i Niderlandy): dostęp, sprostowanie, usunięcie, ograniczenie przetwarzania, przenoszenie, sprzeciw (bezwarunkowy wobec marketingu bezpośredniego), wycofanie zgody oraz prawo do niepodlegania decyzji opartej wyłącznie na zautomatyzowanym przetwarzaniu.'],
                [{ strong: 'Wielka Brytania' }, ': te same prawa na podstawie UK GDPR i Data Protection Act 2018.'],
                [{ strong: 'Szwajcaria' }, ': prawa przewidziane w federalnej ustawie o ochronie danych (FADP).'],
                [{ strong: 'Australia' }, ': prawo dostępu i sprostowania na podstawie Australian Privacy Principles oraz możliwość kontaktu z nami anonimowo lub pod pseudonimem, gdy jest to możliwe.'],
                [{ strong: 'Inne kraje' }, ': prawa przewidziane w Twoim prawie lokalnym.'],
              ],
            },
          ],
        },
        {
          title: 'Wykonywanie praw i skargi',
          body: [
            { p: ['Napisz na adres ', mail, ` lub do ${company}, ${ADDRESS}, Stany Zjednoczone. Możemy poprosić o potwierdzenie tożsamości. Odpowiadamy w ciągu 30 dni; w przypadku złożonych żądań termin może zostać przedłużony o dwa miesiące (poinformujemy Cię o tym). Złożenie żądania jest bezpłatne, chyba że jest ono ewidentnie nieuzasadnione lub nadmierne. Jeżeli przetwarzamy Twoje dane w imieniu klienta, przekazujemy mu Twoje żądanie.`] },
            { p: `Możesz wnieść skargę do organu nadzorczego: ${legal.dataAuthority}, albo do organu ochrony danych w kraju, w którym mieszkasz lub pracujesz, np. CNIL (Francja), Garante per la protezione dei dati personali (Włochy), Autoriteit Persoonsgegevens (Niderlandy), ICO (Wielka Brytania) lub FDPIC (Szwajcaria). W Australii najpierw złóż skargę do nas: odpowiadamy w ciągu 30 dni, a następnie możesz zwrócić się do OAIC.` },
          ],
        },
        {
          title: 'Osoby niepełnoletnie',
          body: [
            { p: 'Usługa jest przeznaczona dla przedsiębiorców, którzy ukończyli 18 lat. Nie jest skierowana do osób niepełnoletnich i świadomie nie zbieramy ich danych; jeżeli dowiemy się, że osoba niepełnoletnia przekazała nam dane, usuniemy je.' },
          ],
        },
        {
          title: 'Marketing, połączenia i rezygnacja',
          body: [
            { p: ['Dzwonimy do Ciebie wyłącznie na Twoją prośbę lub za Twoją zgodą, a nasz agent przedstawia się jako AI. W każdej chwili możesz powiedzieć, że nie chcesz więcej połączeń, odpowiedzieć STOP na SMS, skorzystać z linku rezygnacji w e-mailu lub napisać na adres ', mail, ': wpiszemy Cię na naszą wewnętrzną listę sprzeciwów. W naszym własnym marketingu przestrzegamy obowiązujących zasad i rejestrów sprzeciwu (uprzednia zgoda we Francji, TPS/CTPS, Do Not Call Register, Registro delle opposizioni itp.).'] },
            { p: 'Za połączenia i wiadomości wysyłane przez naszych klientów odpowiadają oni sami: skieruj do nich swój sprzeciw; jeżeli skontaktujesz się z nami, przekażemy go.' },
          ],
        },
        {
          title: 'Pliki cookie i „Do Not Track”',
          body: [
            { p: ['Strona używa plików cookie niezbędnych do jej działania i bezpieczeństwa oraz, wyłącznie za Twoją zgodą, analitycznych plików cookie. Nie używa plików cookie reklamowych. Szczegóły i ustawienia wyboru znajdziesz na stronie ', { a: 'pliki cookie', href: '/cookies' }, '. Wobec braku wspólnego standardu nie reagujemy inaczej na sygnały „Do Not Track”; nie śledzimy Twojej aktywności na innych stronach w celach reklamowych.'] },
          ],
        },
        {
          title: 'Linki do stron osób trzecich',
          body: [
            { p: 'Strona i Usługa mogą zawierać odnośniki do stron lub usług osób trzecich (Stripe, Meta, kalendarze, CRM itp.). Obowiązują ich własne polityki prywatności, za które nie odpowiadamy.' },
          ],
        },
        {
          title: 'Zmiany niniejszej polityki',
          body: [
            { p: 'Możemy aktualizować niniejszą politykę; data ostatniej aktualizacji znajduje się u góry strony. O istotnych zmianach informujemy klientów e-mailem lub komunikatem na stronie.' },
          ],
        },
        {
          title: 'Kontakt',
          body: [
            { p: [`${company}, ${ADDRESS}, Stany Zjednoczone — `, mail, '.'] },
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
              [{ strong: 'Bazy danych i przechowywanie:' }, ' Supabase Inc., infrastruktura zlokalizowana w Stanach Zjednoczonych (region AWS us-east-1, Wirginia).'],
            ],
          },
        ],
      },
      {
        title: '3. Własność intelektualna',
        body: [
          { p: ['Marka ', { strong: brand }, `, logo (dymek w trybie czuwania, fale głosowe i punkt dostępności), a także wszystkie elementy identyfikacji wizualnej, teksty, skrypty rozmów, infografiki i kody źródłowe zamieszczone na stronie stanowią wyłączną własność ${company}.`] },
          { p: `Wszelkie powielanie, rozpowszechnianie, modyfikowanie lub wykorzystywanie bez uprzedniej pisemnej zgody jest zabronione i stanowi naruszenie praw podlegające sankcjom przewidzianym w przepisach: ${legal.copyrightLaw}.` },
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
    ctaButton: 'Zacznij za darmo',
  },
};

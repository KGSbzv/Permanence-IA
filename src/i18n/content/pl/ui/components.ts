// Teksty interfejsu współdzielonych komponentów (src/components). Liczby (ceny, minuty, dni
// okresu próbnego) i marka są przekazywane jako parametry: pochodzą z rynku (src/i18n/markets.ts).
import type { UI_COMPONENTS as FR_UI_COMPONENTS } from '../../fr/ui/components';

/** Odmiana liczebnika: 1 → one, 2–4 (bez 12–14) → few, pozostałe → many. */
const plural = (n: number, one: string, few: string, many: string) => {
  if (n === 1) return one;
  const n10 = n % 10, n100 = n % 100;
  return n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14) ? few : many;
};
/** Liczba z tekstu już sformatowanego (np. „1 000”). */
const toInt = (s: string) => parseInt(s.replace(/\D/g, ''), 10) || 0;

export const UI_COMPONENTS: typeof FR_UI_COMPONENTS = {
  layout: {
    home: 'Strona główna',
    freeTrial: 'Zacznij za darmo',
    callMeBack: 'Zamów rozmowę',
  },

  navbar: {
    menus: {
      features: 'Funkcje',
      allFeatures: 'Wszystkie funkcje',
      allFeaturesText: 'Przegląd modułów i pakietów.',
      sectors: 'Branże',
      allSectors: 'Wszystkie branże',
      resources: 'Zasoby',
    },
    resources: {
      demo: 'Demo na żywo',
      integrations: 'Integracje',
      security: 'Bezpieczeństwo i zgodność',
      faq: 'Najczęstsze pytania',
      help: 'Pomoc do panelu klienta',
      about: 'O nas',
      contact: 'Kontakt i oddzwonienie',
    },
    pricing: 'Cennik',
    login: 'Logowanie',
    startFree: 'Zacznij za darmo',
    mainNav: 'Nawigacja główna',
    mobileNav: 'Nawigacja mobilna',
    openMenu: 'Otwórz menu',
    closeMenu: 'Zamknij menu',
  },

  footer: {
    tagline: 'Agenci głosowi AI, którzy odbierają telefony, kwalifikują zgłoszenia, umawiają wizyty i oddzwaniają w imieniu Twojej firmy, całą dobę.',
    startFree: 'Zacznij za darmo',
    login: 'Logowanie',
    gdpr: 'Wbudowane narzędzia RODO',
    encryption: 'Szyfrowanie podczas przesyłania',
    cols: {
      platform: 'Platforma',
      allFeatures: 'Wszystkie funkcje',
      offers: 'Pakiety',
      recharges: 'Doładowania minut',
      compare: 'Porównaj pakiety',
      sectors: 'Branże',
      resources: 'Zasoby',
    },
    resources: {
      demo: 'Demo na żywo',
      integrations: 'Integracje',
      faq: 'Najczęstsze pytania',
      help: 'Pomoc do panelu klienta',
      about: 'O nas',
      security: 'Bezpieczeństwo i zgodność',
      contact: 'Kontakt',
    },
    copyright: (year: number, brand: string, company: string) => `© ${year} ${brand} — marka firmy ${company}. Ceny podane netto.`,
    legal: {
      notice: 'Nota prawna',
      terms: 'Regulamin',
      privacy: 'Prywatność',
      cookies: 'Pliki cookie',
    },
  },

  callbackModal: {
    titleSupport: 'Poproś o oddzwonienie z działu wsparcia',
    titleCommercial: 'Zostaw numer, oddzwonimy',
    intro: 'Wybierz dogodny termin. Nie publikujemy numeru telefonu: to my dzwonimy do Ciebie.',
    close: 'Zamknij',
  },

  trialNudge: {
    title: (minutes: string) => `Pierwsze ${minutes} ${plural(toInt(minutes), 'minuta', 'minuty', 'minut')} za darmo`,
    close: 'Zamknij',
    text: (days: number) => `Przetestuj agenta głosowego na prawdziwych połączeniach przez ${days} ${days === 1 ? 'dzień' : 'dni'}, zanim podejmiesz decyzję.`,
    points: ['Karta wymagana przy aktywacji, w okresie próbnym nic nie jest pobierane', 'Anulujesz w panelu klienta', 'Pierwszy agent gotowy w kilka minut'],
    claim: (_minutes: string) => 'Zacznij za darmo',
    callMeBack: 'Zamów rozmowę',
  },

  liveCall: {
    title: 'Agent recepcji',
    leadTitle: 'Utworzone zgłoszenie',
    ariaLabel: 'Przykład rozmowy obsłużonej przez agenta',
    ended: 'Rozmowa zakończona · podsumowanie wysłane',
    ongoing: 'Rozmowa w toku',
  },

  trialBadges: {
    ariaLabel: 'Warunki okresu próbnego',
  },

  ctas: {
    primary: 'Zacznij za darmo',
    demo: 'Wypróbuj naszego agenta na żywo',
    callback: 'Zamów rozmowę',
  },

  callbackForm: {
    submit: 'Zamów rozmowę',
    consentRequired: 'Zaznacz pole, aby wyrazić zgodę na oddzwonienie.',
    sendFailed: 'Nie udało się wysłać zgłoszenia.',
    retry: (email: string) => `Spróbuj ponownie lub napisz na adres ${email}.`,
    sentTitle: 'Prośba o oddzwonienie wysłana',
    sentText: 'Oddzwonimy w wybranym terminie. Jeśli podano adres e-mail, wyślemy na niego potwierdzenie.',
    name: 'Imię i nazwisko',
    phone: 'Telefon',
    sector: 'Branża',
    choose: 'Wybierz…',
    otherSector: 'Inna działalność',
    when: 'Kiedy mamy oddzwonić?',
    slots: {
      asap: 'Jak najszybciej',
      todayAfternoon: 'Dziś po południu',
      tomorrowMorning: 'Jutro rano',
      tomorrowAfternoon: 'Jutro po południu',
      precise: 'W konkretnym dniu i o konkretnej godzinie',
    },
    preciseLabel: 'Data i godzina (czas lokalny)',
    email: 'E-mail',
    emailHint: '(do potwierdzenia)',
    need: 'Czego potrzebujesz',
    needPlaceholder: 'Np. tracę połączenia wieczorami, chcę zautomatyzować umawianie wizyt…',
    consent: (brand: string) => `Wyrażam zgodę na kontakt telefoniczny pod podanym numerem, również przez agenta głosowego AI ${brand}. Moje dane posłużą wyłącznie do obsługi mojego zgłoszenia.`,
    sending: 'Wysyłanie…',
  },

  benefits: {
    items: [
      { title: 'Odbieraj także poza godzinami pracy', text: 'Wieczory, weekendy, czas wizyt: każde połączenie zostaje odebrane.' },
      { title: 'Kwalifikuj automatycznie', text: 'Agent zadaje Twoje pytania i przekazuje Ci kompletne zgłoszenie.' },
      { title: 'Umawiaj wizyty', text: 'Bezpośrednio w Twoim kalendarzu, z potwierdzeniem (przypomnienia SMS i WhatsApp od pakietu Asystent).' },
      { title: 'Szybciej oddzwaniaj do leadów', text: 'Wypełniony formularz zamienia się w rozmowę w ciągu kilku minut.' },
      { title: 'Zostaw człowiekowi to, co ważne', text: 'Przekazanie rozmowy zespołowi, gdy sytuacja tego wymaga.' },
    ],
    seeAgent: 'Poznaj agenta bliżej',
  },

  moduleCards: {
    seeIncluded: 'Zobacz, co obejmuje',
  },

  includesSchema: {
    // Ta sama kolejność co ikony komponentu: telefonia, automatyzacja, CRM, wiadomości, kalendarz, zarządzanie, bezpieczeństwo.
    families: [
      { name: 'Telefonia', items: ['Połączenia przychodzące i wychodzące', 'Opcjonalny numer dedykowany', 'Integracja SIP', 'Przekazanie rozmowy człowiekowi', 'Identyfikacja dzwoniącego'] },
      { name: 'Automatyzacja', items: ['Edytor promptów', 'Flow builder bez kodu', 'Asystent automatyzacji', '300+ narzędzi do podłączenia'] },
      { name: 'CRM i dane', items: ['Leady i wstępna kwalifikacja', 'Baza wiedzy', 'Historia połączeń', 'Webhooki i API'] },
      { name: 'Wiadomości', items: ['SMS', 'WhatsApp i szablony', 'Messenger i Instagram', 'Widżet na stronę'] },
      { name: 'Kalendarz', items: ['Umawianie wizyt', 'Potwierdzenia i przypomnienia', 'Zmiany terminów i odwołania'] },
      { name: 'Zarządzanie', items: ['Pulpit', 'Szczegółowe raporty', 'Role i uprawnienia'] },
      { name: 'Bezpieczeństwo', items: ['Zgody i rezygnacje', 'Konfigurowalny okres przechowywania', 'Szyfrowanie podczas przesyłania', 'Dziennik działań'] },
    ],
    centerTitle: 'Twój agent głosowy AI',
    centerText: 'W centrum: agent skonfigurowany dla Twojej działalności. Wokół: wszystko, z czego może korzystać.',
    perOffer: 'Zobacz, co obejmuje każdy pakiet',
  },

  steps: {
    step: (n: number) => `Krok ${n}`,
  },

  demoBlock: {
    title: 'Wypróbuj naszego agenta na żywo już teraz',
    intro: 'Porozmawiaj z agentem w przeglądarce lub zostaw numer, aby otrzymać połączenie demonstracyjne dopasowane do Twojej branży.',
    launchTitle: 'Uruchom demo na żywo',
    launchText: 'Prawdziwa rozmowa, bez instalacji.',
    callbackTitle: 'Zamów oddzwonienie',
    callbackText: 'Agent zadzwoni do Ciebie w wybranym terminie.',
    formTitle: 'Odbierz połączenie demonstracyjne',
    formText: 'Bezpłatnie, bez zobowiązań. Usłyszysz głos agenta i sposób, w jaki kwalifikuje zgłoszenie.',
    submit: 'Zamów oddzwonienie',
  },

  sectorCards: {
    seePage: (sectorLower: string) => `Zobacz stronę: ${sectorLower}`,
  },

  pricingCards: {
    daysFree: (days: number) => `${days} ${days === 1 ? 'dzień' : 'dni'} za darmo`,
    negotiated: 'Negocjowana cena za minutę',
    mostChosen: 'Najczęściej wybierany',
    perMinute: (label: string) => `czyli ${label}`,
    details: 'Szczegóły pakietu',
    phoneNumber: (price: string) => `+ dedykowany numer od ${price} / mies.`,
  },

  matrix: {
    included: 'W cenie',
    notIncluded: 'Niedostępne',
    caption: 'Funkcje dostępne w każdym pakiecie',
    inYourInterface: 'W Twoim panelu',
    pricePerMonth: 'Cena netto / mies.',
    includedMinutes: 'Minuty w cenie',
    extraMinute: 'Dodatkowa minuta',
    phoneNumber: 'Zakup numeru',
    phoneNumberFrom: (price: string) => `od ${price} / mies.`,
    showAll: (n: number) => `Pokaż wszystkie moduły (${n})`,
    showLess: 'Zwiń porównanie',
    legendIncluded: 'W cenie',
    legendNotIncluded: 'Niedostępne',
    legendLimit: 'Liczba = limit pakietu',
  },

  includedStack: {
    title: 'Wszystko w cenie, zero kluczy API',
    intro: 'Najlepsze modele AI, głosy i transkrypcja są już podłączone w Twoim panelu. Nie musisz zakładać konta u każdego dostawcy ani kopiować kluczy — jedna faktura.',
    groups: [
      { key: 'llm', title: 'Modele językowe', text: 'Mózg agenta: rozumie zgłoszenie i decyduje, co odpowiedzieć.' },
      { key: 's2s', title: 'Głos w czasie rzeczywistym', text: 'Modele, które słuchają i mówią bezpośrednio, zapewniając najbardziej naturalne rozmowy.' },
      { key: 'tts', title: 'Synteza mowy', text: 'Setki naturalnych głosów w ponad 30 językach.' },
      { key: 'stt', title: 'Transkrypcja', text: 'Szybkie rozpoznawanie mowy, także przez telefon.' },
      { key: 'channels', title: 'Kanały', text: 'Ten sam agent odpowiada wszędzie tam, gdzie klienci do Ciebie piszą lub dzwonią.' },
    ],
    noKeys: ['Żadnych kluczy API do zarządzania', 'Zmiana modelu lub głosu jednym kliknięciem', 'Jedna faktura, w dolarach netto'],
    note: 'Marki wymienione wyłącznie w celach opisowych: należą do swoich właścicieli i oznaczają technologie dostępne w panelu klienta, bez partnerstwa z tymi firmami. Lista zmienia się wraz z rozwojem platformy.',
    channelNames: { phone: 'Telefon', sip: 'SIP', widget: 'Widżet na stronę', email: 'E-mail' },
  },

  recharges: {
    title: 'Doładowania środków',
    text: 'Środki pokrywają minuty ponad limit pakietu. Nie wygasają i są dostępne od razu.',
    rechargeCol: 'Doładowanie netto',
    approxMinutes: (n: string) => `≈ ${n} min`,
    cheaperTitle: 'Pakiet pozostaje tańszy',
    cheaperText: 'Minuta w pakiecie zawsze kosztuje mniej niż minuta dodatkowa.',
    included: 'W pakiecie:',
    extra: (price: string) => ` · dodatkowa: ${price} netto / min`,
  },

  growthBlock: {
    rules: [
      { title: 'Niewielkie, jednorazowe przekroczenie', text: 'Jedno doładowanie wystarczy do końca miesiąca.' },
      { title: 'Powtarzające się przekroczenia', text: 'Zaproponujemy Ci wyższy pakiet.' },
      { title: 'Częste doładowania', text: 'Pulpit pokaże Ci, że płacisz za dużo w stosunku do swojego wykorzystania.' },
    ],
    ruleCustom: (minutes: string) => `Powyżej ${minutes} min regularnie`,
    ruleCustomText: 'Przygotujemy ofertę na miarę.',
    case1Minutes: (minutes: string) => `${minutes} min w tym miesiącu`,
    case1Plan: (plan: string) => `${plan} + doładowanie środków`,
    case1Note: (price: string, extraMinutes: string, extraPrice: string, total: string) =>
      `${price} + ${extraMinutes} min × ${extraPrice} ≈ ${total} netto. Jednorazowe przekroczenie: doładowanie wystarczy.`,
    case2Minutes: (minutes: string) => `${minutes} min co miesiąc`,
    case2Plan: (plan: string) => `Przejdź na pakiet ${plan}`,
    case2Note: (price: string, minutes: string, total: string, smallerPlan: string) =>
      `${price} netto za ${minutes} min, wobec ≈ ${total} w pakiecie ${smallerPlan} z dodatkowymi minutami. Taniej i z zapasem.`,
    case3Minutes: (minutes: string) => `${minutes} min regularnie`,
    case3Plan: 'Oferta na miarę',
    case3Note: (plan: string) => `Powyżej pakietu ${plan} negocjujemy cenę za minutę dopasowaną do Twojego wolumenu.`,
    title: 'Dokupuj minuty lub zmieniaj pakiet we właściwym momencie',
    intro: 'Podpowiadamy, kiedy wystarczy doładowanie, a kiedy wyższy pakiet staje się tańszy.',
    customerAt: 'Klient zużywa',
  },

  planFor: {
    oneOffRecharge: ' + jednorazowe doładowanie',
    rechargeOrCustom: ' + doładowanie lub oferta na miarę przy regularnym wolumenie',
  },

  economy: {
    title: 'Oblicz zwrot z inwestycji',
    intro: 'Wpisz liczbę połączeń: kalkulator wybierze najtańszy pakiet dla tego wolumenu, pokaże rzeczywistą cenę za minutę i porówna ją z kosztem recepcji obsługiwanej przez człowieka.',
    calculator: 'Kalkulator zwrotu z inwestycji',
    yourCalls: 'Twoje połączenia',
    yourCosts: 'Twoja obecna recepcja',
    callsPerMonth: 'Połączenia miesięcznie',
    avgDuration: 'Średni czas połączenia',
    hourlyCost: 'Godzinowy koszt pracownika (z narzutami)',
    missedRate: 'Obecnie nieodebrane połączenia',
    customerValue: 'Średnia wartość nowego klienta',
    min: ' min',
    perHour: ' / godz.',
    minutesMonth: 'Minuty miesięcznie',
    bestPlan: 'Najtańszy pakiet dla tego wolumenu',
    planCost: (plan: string) => `Koszt pakietu ${plan}`,
    withExtra: (minutes: string, price: string) => `w tym ${minutes} dodatkowych min po ${price}`,
    customAbove: (minutes: string) => `Powyżej ${minutes} min regularnie poproś o ofertę na miarę.`,
    effectivePerMinute: 'Rzeczywista cena za minutę',
    humanCost: 'Koszt recepcji obsługiwanej przez człowieka',
    savings: 'Miesięczna oszczędność',
    noSavings: 'Przy tym wolumenie agent kosztuje nieco więcej niż pracownik, ale odpowiada 24/7 i obsługuje wiele połączeń jednocześnie.',
    recovered: 'Odzyskany przychód (szacunek)',
    recoveredDetail: (calls: string) => `${calls} nieodebranych połączeń odzyskanych miesięcznie`,
    netBenefit: 'Szacowany miesięczny zysk',
    roi: (x: string) => `Zwrot: ${x} × cena pakietu`,
    perMonth: ' / mies.',
    assumptions: (wrapUp: number, conversion: number) =>
      `Założenia: ${wrapUp} min obsługi po każdym połączeniu w przypadku pracownika, ${conversion} % nieodebranych połączeń zamienia się w klientów. Ceny netto w dolarach amerykańskich; numer telefonu płatny dodatkowo. Szacunek orientacyjny, do porównania z Twoimi danymi.`,
    cta: 'Wypróbuj za darmo',
  },

  security: {
    items: [
      { title: 'Zgody i rezygnacje', text: 'Zgoda na oddzwonienie, obsługa odmów, dozwolone godziny połączeń i lista wykluczeń.' },
      { title: 'Ochrona danych', text: 'Szyfrowanie podczas przesyłania, dostęp chroniony kontem i konfigurowalny okres przechowywania.' },
      { title: 'Rozliczalność', text: 'Historia połączeń, transkrypcje i dziennik działań dla każdego konta.' },
      { title: 'Kontrola dostępu', text: 'Każdy klient ma własny, zabezpieczony panel; agent ma dostęp tylko do informacji, które mu przekażesz.' },
      { title: 'Przygotowanie do wymogów prawnych', text: 'Narzędzia do stosowania RODO: obowiązek informacyjny, prawo dostępu, usuwanie, okres przechowywania.' },
      { title: 'Infrastruktura', text: 'Platforma hostowana u uznanych dostawców chmury, z kopiami zapasowymi i monitoringiem.' },
    ],
    title: 'Bezpieczeństwo i zgodność Twoich połączeń AI',
    intro: 'Twoje rozmowy zawierają informacje o klientach. Platforma daje Ci ustawienia, które pozwalają je chronić i szanować wybory klientów.',
    approach: 'Nasze podejście do bezpieczeństwa',
    privacy: 'Polityka prywatności',
  },

  voicesNumbers: {
    langs: ['Francuski', 'Angielski', 'Hiszpański', 'Niemiecki', 'Włoski', 'Portugalski', 'Niderlandzki', 'Arabski', 'Polski', 'Rumuński', 'Turecki', 'Szwedzki'],
    others: '+ 70 innych',
    voicesTitle: 'Naturalne głosy w Twoim języku',
    voicesText: 'Ponad 80 języków i wiele akcentów. Agent rozpoznaje język dzwoniącego i odpowiada w tym samym języku.',
    numbersTitle: 'Twój numer lub numer dedykowany',
    numbersText: 'Zachowaj swój numer (przekierowanie połączeń, import z Twilio lub Telnyx, połączenie SIP z centralą) lub weź opcjonalny numer dedykowany, płatny co miesiąc oprócz pakietu.',
    telephonyOptions: 'Zobacz opcje telefonii',
  },

  finalCta: {
    title: 'Chcesz zautomatyzować obsługę połączeń?',
    primary: 'Zacznij za darmo',
    demo: 'Zobacz demo na żywo',
    advisorTitle: 'Porozmawiaj z doradcą',
    advisorText: 'Zostaw numer: oddzwonimy, aby odpowiedzieć na Twoje pytania.',
  },

  liveDemo: {
    title: 'Porozmawiaj z agentem teraz',
    intro: 'Wybierz rolę i język, a potem wypróbuj agenta w przeglądarce albo odbierz od niego telefon.',
    roleLabel: 'Rola agenta',
    // Ta sama kolejność co kule w komponencie.
    roles: [
      { name: 'Recepcjonistka', text: 'Odbiera połączenia, udziela informacji i umawia wizyty.' },
      { name: 'Sprzedaż', text: 'Kwalifikuje zapytania i wskazuje projekty do oddzwonienia.' },
      { name: 'Wsparcie', text: 'Odpowiada na pytania klientów i w razie potrzeby przekazuje sprawę dalej.' },
    ],
    langLabel: 'Język',
    accents: { fr: 'Francuski paryski', 'en-gb': 'Angielski brytyjski', 'en-au': 'Angielski australijski', it: 'Włoski', pl: 'Polski', nl: 'Niderlandzki' },
    sector: 'Twoja branża',
    modeLabel: 'Jak wypróbować',
    modeBrowser: 'W tej przeglądarce',
    modePhone: 'Zadzwoń do mnie',
    stageLabel: 'Twój agent demo',
    voiceTag: (name: string) => `Głos: ${name}`,
    browserText: 'Nasza asystentka otworzy się tutaj. Rozpocznij rozmowę głosową lub napisz i podaj swoją branżę oraz rolę do odegrania.',
    browserCta: (name: string) => `Porozmawiaj z: ${name}`,
    browserOpening: 'Otwieranie…',
    browserLegal: 'Przeglądarka poprosi o dostęp do mikrofonu na potrzeby rozmowy głosowej.',
    browserError: 'Nie udało się otworzyć asystentki. Spróbuj ponownie lub wybierz „Zadzwoń do mnie”.',
    dialogTitle: (name: string) => `Rozmowa: ${name}`,
    close: 'Zamknij',
    firstName: 'Twoje imię',
    phone: 'Twój telefon',
    consent: 'Wyrażam zgodę na połączenie od demonstracyjnego agenta głosowego AI.',
    consentRequired: 'Zaznacz pole, aby odebrać połączenie.',
    sendFailed: 'Nie udało się wysłać zgłoszenia.',
    sending: 'Wysyłanie…',
    phoneCta: 'Zadzwońcie do mnie',
    phoneLegal: 'Bezpłatnie i bez zobowiązań. Twój numer służy wyłącznie do tej demonstracji.',
    sentTitle: 'Zgłoszenie przyjęte',
    sentText: (name: string) => `${name} zadzwoni w ciągu kilku minut w godzinach pracy (od poniedziałku do soboty, 9:00–19:00). Miej telefon pod ręką.`,
    again: 'Spróbuj ponownie',
  },

  industryMarquee: ['Hydraulicy', 'Elektrycy', 'Gabinety stomatologiczne', 'Kliniki', 'Biura nieruchomości', 'Zarządcy najmu', 'Warsztaty samochodowe', 'Blacharnie', 'Salony fryzjerskie', 'Barberzy', 'Gabinety kosmetyczne', 'Restauracje', 'Hotele', 'Kancelarie prawne', 'Biura rachunkowe', 'E-commerce', 'Fizjoterapeuci', 'Osteopaci', 'Weterynarze'],

  // Ta sama kolejność co flagi komponentu.
  languageMarquee: ['Francuski', 'Angielski', 'Hiszpański', 'Niemiecki', 'Włoski', 'Portugalski', 'Niderlandzki', 'Belgia', 'Szwajcaria', 'Quebec', 'Arabski', 'Polski', 'Rumuński', 'Turecki', 'Szwedzki'],

  agentTeam: {
    // Ta sama kolejność co ikony i linki komponentu.
    agents: [
      { name: 'Recepcjonistka AI', role: 'Odbiera każde połączenie, filtruje i przekazuje to, co ważne.' },
      { name: 'Agent ds. wizyt', role: 'Rezerwuje, potwierdza, przypomina i obsługuje zmiany terminów.' },
      { name: 'Agent ds. kwalifikacji', role: 'Zadaje Twoje pytania i przygotowuje karty gotowe do obsługi.' },
      { name: 'Agent wsparcia', role: 'Odpowiada na podstawie Twoich dokumentów, przekazuje dalej sprawy wrażliwe.' },
      { name: 'Agent ds. ponownego kontaktu', role: 'Potwierdza, przypomina o wycenach i odnawia kontakt z klientami.' },
      { name: 'Agent wiadomości', role: 'Odpowiada i potwierdza przez SMS, WhatsApp i Instagram.' },
    ],
    title: 'Zbuduj swój zespół agentów AI',
    intro: 'Każdy agent ma określoną rolę. Włącz tych, których potrzebuje Twoja firma; korzystają z tej samej historii i tych samych informacji.',
    custom: 'Potrzebujesz nietypowego scenariusza? Skonfigurujemy agenta na miarę.',
  },

  sectorShowcase: {
    chooseSector: 'Wybierz branżę',
    agentFor: (sectorLower: string) => `Agent: ${sectorLower}`,
    seeSolution: (sectorLower: string) => `Zobacz rozwiązanie: ${sectorLower}`,
  },

  useCaseTabs: {
    ariaLabel: 'Rodzaje zastosowań',
    // Ta sama kolejność co ikony komponentu.
    tabs: {
      entrants: {
        label: 'Połączenia przychodzące',
        items: [
          { title: 'Recepcja 24/7', text: 'Każde połączenie zostaje odebrane, także w nocy i w weekend.' },
          { title: 'Umawianie wizyt', text: 'Rezerwacja bezpośrednio w Twoim kalendarzu, z potwierdzeniem.' },
          { title: 'Obsługa klienta', text: 'Odpowiedzi na podstawie Twoich dokumentów, bez kolejki.' },
          { title: 'Kwalifikacja', text: 'Właściwe pytania zadane przed przekazaniem dalej.' },
          { title: 'Przekazanie do człowieka', text: 'Przełączenie do Twojego zespołu, gdy to ważne.' },
          { title: 'Pilne sprawy', text: 'Selekcja według Twoich zasad i natychmiastowe powiadomienie.' },
        ],
      },
      sortants: {
        label: 'Połączenia wychodzące',
        items: [
          { title: 'Oddzwanianie do leadów ze strony', text: 'Wypełniony formularz zamienia się w rozmowę w ciągu kilku minut.' },
          { title: 'Potwierdzenia', text: 'Wizyty i rezerwacje potwierdzane dzień wcześniej.' },
          { title: 'Ponowny kontakt w sprawie wycen', text: 'Kontakt w sprawie oczekujących wycen we właściwych godzinach.' },
          { title: 'Wstępna kwalifikacja', text: 'Kontakty sprawdzone przed telefonem od Twojego zespołu.' },
          { title: 'Odnowienia', text: 'Ponowny kontakt z klientami w sprawie odnowienia lub rozszerzenia usług.' },
          { title: 'Badania satysfakcji', text: 'Opinie zbierane po wykonaniu usługi.' },
        ],
      },
      messages: {
        label: 'Wiadomości',
        items: [
          { title: 'WhatsApp', text: 'Potwierdzenia, przypomnienia i odpowiedzi na piśmie.' },
          { title: 'SMS', text: 'Podsumowanie po każdej rozmowie.' },
          { title: 'Instagram i Messenger', text: 'Wiadomości prywatne w jednym miejscu.' },
          { title: 'Widżet na stronę', text: 'Rozmowa z agentem lub prośba o oddzwonienie z Twojej strony.' },
          { title: 'Lista oczekujących', text: 'Powiadomienie, gdy zwolni się termin.' },
          { title: 'Jedna historia', text: 'Połączenia i wiadomości w jednym miejscu.' },
        ],
      },
    },
  },

  platformGrid: {
    simultaneousTitle: 'Połączenia równoczesne',
    simultaneousText: 'Bez kolejki: agent obsługuje kilka połączeń jednocześnie na tej samej linii.',
    knowledgeTitle: 'Baza wiedzy',
    knowledgeText: 'Pliki PDF, strony Twojej witryny, procedury: agent odpowiada na podstawie Twoich informacji.',
    promptTitle: 'Asystent promptów',
    promptText: 'Opisz cel rozmowy: asystent krok po kroku ustawi zachowanie agenta.',
    transferTitle: 'Przekazanie rozmowy człowiekowi',
    transferText: 'Gdy klient o to poprosi lub sytuacja tego wymaga, rozmowa trafia do Twojego zespołu.',
    aiAgent: 'Agent AI',
    yourTeam: 'Twój zespół',
    reportsTitle: 'Szczegółowe raporty',
    reportsText: 'Nagrania, transkrypcje, podsumowania i wykresy dla każdego połączenia.',
    campaignsTitle: 'Kampanie wychodzące',
    campaignsText: 'Zaimportuj kontakty, które wyraziły zgodę, lub uruchamiaj połączenia ze swoich narzędzi i formularzy.',
  },

  lifecycle: {
    title: 'Cała ścieżka klienta w jednym miejscu',
    intro: 'Od pierwszego zapytania do lojalnego klienta: jedna platforma, jedna historia.',
    ariaLabel: 'Etapy ścieżki klienta',
    // Ta sama kolejność co ikony i makiety komponentu.
    stages: [
      { key: 'Przyciągaj', title: 'Przechwytuj każde zapytanie', items: ['Strony docelowe dla branż', 'Widżet na stronę: rozmowa lub oddzwonienie', 'Numery lokalne i przekierowanie Twojej linii', 'Odpowiedź 24/7 na połączenia i wiadomości'] },
      { key: 'Konwertuj', title: 'Zamieniaj zapytania w klientów', items: ['Kwalifikacja według Twoich kryteriów', 'Oddzwanianie do leadów w kilka minut', 'Umawianie wizyt w Twoim kalendarzu', 'Automatycznie tworzona karta w CRM'] },
      { key: 'Utrzymuj', title: 'Utrzymuj kontakt z klientami', items: ['Potwierdzenia i przypomnienia', 'Wsparcie odpowiadające na podstawie Twoich dokumentów', 'Ponowne kontakty, odnowienia i ankiety', 'WhatsApp, SMS, Instagram'] },
      { key: 'Mierz', title: 'Zarządzaj na podstawie rzeczywistych danych', items: ['Wolumeny, czas trwania i wyniki', 'Umówione wizyty i przekazane rozmowy', 'Zużycie minut i alerty', 'Odsłuch nagrań i transkrypcje'] },
    ],
  },

  portalPreview: {
    // Ta sama kolejność co kolory etykiet komponentu.
    calls: [
      { who: 'Nowy pacjent', what: 'Wizyta we wtorek 9:30', tag: 'Zarezerwowano' },
      { who: 'Przeciek wody', what: 'Prośba o pilne oddzwonienie', tag: 'Pilne' },
      { who: 'Kupujący, 3 pokoje', what: 'Prezentacja w sobotę 11:00', tag: 'Zakwalifikowany' },
      { who: 'Pytanie o godziny', what: 'Udzielono odpowiedzi', tag: 'Rozwiązane' },
    ],
    title: 'Twój panel klienta, przejrzysty od pierwszego logowania',
    intro: 'Połączenia, wizyty, leady, wiadomości i minuty: wszystko widoczne w jednym miejscu, na komputerze i na telefonie.',
    points: ['Podsumowanie każdej rozmowy i kolejny krok', 'Odsłuch nagrań i transkrypcje', 'Kontrola zużycia minut i alerty', 'Konfiguracja agentów bez kodu'],
    roles: 'Osobny, zabezpieczony panel dla każdego klienta, z własnymi agentami, numerami i danymi.',
    dashboard: 'Pulpit',
    sampleData: 'Przykładowe dane · ostatnie 30 dni',
    stats: [['Połączenia', '412'], ['Wizyty', '96'], ['Leady', '183'], ['Minuty', '62%']],
    notification: 'Powiadomienie',
    notifBooking: 'Nowa wizyta zarezerwowana przez agenta: wtorek 9:30.',
    notifMinutes: 'Minuty: wykorzystano 62%.',
  },

  beforeAfter: {
    without: 'Bez agenta AI',
    with: (brand: string) => `Z ${brand}`,
  },

  mock: {
    call: {
      agent: 'Agent recepcji',
      meta: 'Połączenie przychodzące · 01:24',
      client: 'Dzień dobry, chciałbym umówić wizytę.',
      reply: 'Oczywiście. Czy to pierwsza wizyta?',
    },
    calendar: {
      days: ['Pon', 'Wt', 'Śr', 'Czw', 'Pt'],
      week: 'Tydzień 42',
      added: 'Wizyta dodana przez agenta',
      slot: 'Wtorek · 9:30 – 10:00',
    },
    transcript: {
      label: 'Transkrypcja',
      question: 'Czy mogę prosić o orientacyjny budżet?',
      answer: 'Około 750 000 zł.',
      summaryLabel: 'Podsumowanie:',
      summary: ' zakup, budżet 750 tys. zł, prezentacja w sobotę.',
    },
    knowledge: {
      title: 'Baza wiedzy',
      rows: [
        { name: 'procedury-recepcja.pdf', meta: 'PDF · 1,2 MB' },
        { name: 'Strony Twojej witryny', meta: '18 zaindeksowanych stron' },
        { name: 'Cennik i godziny otwarcia', meta: 'Zaktualizowano dziś' },
      ],
    },
    prompt: {
      title: 'Cel rozmowy',
      hint: 'Opisz, co agent ma osiągnąć.',
      text: 'Przywitać pacjenta, ustalić, czy jest nowy, zaproponować dwa terminy i potwierdzić SMS-em.',
      tags: ['Ton: ciepły', 'Forma „Pan/Pani”', 'Bez porad medycznych'],
    },
    flow: {
      title: 'Scenariusz: lead ze strony',
      steps: [
        { title: 'Nowy formularz', source: 'Strona WWW' },
        { title: 'Zadzwoń do leada', source: 'Agent sprzedaży' },
        { title: 'Utwórz kartę', source: 'CRM' },
        { title: 'Wyślij potwierdzenie', source: 'WhatsApp' },
      ],
    },
    numbers: {
      title: 'Twoje linie',
      rows: [
        { country: 'Polska', kind: 'Numer lokalny', agent: 'Agent recepcji' },
        { country: 'Wielka Brytania', kind: 'Numer lokalny', agent: 'Agent ds. wizyt' },
        { country: 'Twoja centrala', kind: 'Trunk SIP', agent: 'Przekierowanie poza godzinami pracy' },
      ],
    },
    report: {
      handled: 'Obsłużone połączenia · przykład',
      demo: 'Demo',
      stats: [['Wizyty', '96'], ['Zakwalifikowane', '183'], ['Przekazania', '27']],
    },
    widget: {
      question: 'Masz pytanie? Porozmawiajmy.',
      talk: 'Porozmawiaj z agentem',
      callback: 'Zamów rozmowę',
    },
    whatsapp: {
      title: 'WhatsApp · Potwierdzenie',
      confirmation: 'Twoja wizyta we wtorek o 9:30 jest potwierdzona. Odpowiedz 2, aby zmienić termin.',
      reply: 'Super, dziękuję!',
    },
    campaign: {
      title: 'Kampanie',
      rows: [['Potwierdzenia, tydzień 42', 'W toku', '68%'], ['Wyceny z września — ponowny kontakt', 'Zakończona', '41%'], ['Nieaktywni klienci', 'Zaplanowana', '—']],
      note: 'Przykładowe dane · połączenia wyłącznie do kontaktów, które wyraziły zgodę',
    },
    lead: {
      title: 'Zakwalifikowane zgłoszenie',
      interest: 'Duże zainteresowanie',
      fields: [['Potrzeba', 'Wycena remontu'], ['Lokalizacja', 'Kraków, Podgórze'], ['Budżet', '30–50 tys. zł'], ['Termin', 'W ciągu miesiąca']],
      next: 'Kolejny krok: oddzwonić jutro o 9:00',
    },
    support: {
      client: 'Moje zamówienie nie dotarło.',
      agent: 'Już sprawdzam. Czy mogę prosić o numer zamówienia?',
      found: 'Odpowiedź znaleziona w „warunki-dostawy.pdf”',
    },
  },
};

// Teksty interfejsu stron sprzedażowych: strona główna, cennik, pakiety, doładowania, branże,
// funkcje, integracje. Liczby (ceny, minuty, dni okresu próbnego) i marka przychodzą
// jako parametry z rynku (src/i18n/markets.ts): nigdy nie wpisuj ich tutaj.
//
// Tytuły z wyróżnionym słowem kluczowym są podzielone na { before, kw, after }: `kw` jest wyświetlane w kolorze.
import type { UI_COMMERCE as FR_UI_COMMERCE } from '../../fr/ui/commerce';

/** Odmiana liczebnika: 1 → one, 2–4 (bez 12–14) → few, pozostałe → many. */
const plural = (n: number, one: string, few: string, many: string) => {
  if (n === 1) return one;
  const n10 = n % 10, n100 = n % 100;
  return n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14) ? few : many;
};
/** Liczba z tekstu już sformatowanego (np. „1 000”). */
const toInt = (s: string) => parseInt(s.replace(/\D/g, ''), 10) || 0;
/** „1 minuta”, „2 minuty”, „5 minut” (mianownik). */
const minutes = (n: number) => `${n} ${plural(n, 'minuta', 'minuty', 'minut')}`;
/** „1 dzień”, „14 dni”. */
const days = (n: number) => `${n} ${n === 1 ? 'dzień' : 'dni'}`;

/**
 * SEO: tytuł meta strony branżowej według nazwy branży (fraza, której szukają polskie firmy).
 * Klucz = `name` z sectors.ts; brak klucza → tytuł ogólny. Mapa słów kluczowych: docs/seo/keywords-pl.md.
 */
const SECTOR_SEO_TITLE: Record<string, string> = {
  'Usługi domowe': 'Obsługa telefoniczna zgłoszeń dla fachowców',
  'Stomatologia i kliniki': 'Rejestracja pacjentów przez telefon 24/7',
  'Nieruchomości': 'Obsługa telefoniczna biura nieruchomości',
  'Warsztaty i motoryzacja': 'Umawianie wizyt w warsztacie samochodowym',
  'Uroda i wellness': 'Umawianie wizyt w salonie kosmetycznym 24/7',
  'Restauracje i hotele': 'Rezerwacje telefoniczne: restauracje i hotele',
};
/** SEO: tytuł meta strony funkcji według nazwy modułu (klucz = `name` z modules.ts). */
const FEATURE_SEO_TITLE: Record<string, string> = {
  'Recepcjonistka AI': 'Wirtualna recepcjonistka AI 24/7',
  'Demo agenta na żywo': 'Demo asystenta głosowego AI na żywo',
  'Umawianie wizyt': 'Umawianie wizyt przez telefon z AI',
  'Obsługa klienta': 'Automatyczna obsługa klienta przez telefon',
  'Kwalifikacja leadów': 'Kwalifikacja leadów przez telefon z AI',
  'Kampanie wychodzące': 'Automatyczne połączenia wychodzące z AI',
  'WhatsApp i wiadomości': 'WhatsApp, SMS i Messenger z asystentem AI',
  'Baza wiedzy': 'Baza wiedzy dla asystenta głosowego AI',
  'Edytor promptów': 'Edytor promptów asystenta głosowego AI',
  'Flow builder': 'Flow builder: automatyzacje bez kodu',
  'SIP i numery': 'Trunk SIP, przekierowanie i numery telefonu',
  'Raporty': 'Raporty i analityka połączeń telefonicznych',
  'Widżet na stronę': 'Widżet oddzwonienia i rozmowy na stronę WWW',
};

export const UI_COMMERCE: typeof FR_UI_COMMERCE = {
  home: {
    meta: {
      title: (brand: string) => `${brand} — asystent głosowy AI do obsługi połączeń 24/7`,
      description: (d: number, m: number) =>
        `Asystent głosowy AI odbiera telefony, kwalifikuje zgłoszenia i umawia wizyty 24/7. ${days(d)} za darmo, ${minutes(m)} w cenie. Wypróbuj bez zobowiązań.`,
    },
    hero: {
      title: { before: 'Zautomatyzuj obsługę połączeń dzięki AI, która ', kw: 'odbiera, kwalifikuje i umawia wizyty', after: ' za Ciebie' },
      intro: 'Inteligentny asystent telefoniczny dla Twojej firmy: agenci głosowi AI odbierają każde połączenie, zadają właściwe pytania, umawiają wizyty i przekazują Ci czytelne podsumowanie. Dostępni 24/7, skonfigurowani dla Twojej branży, gotowi do pracy w kilka minut.',
      photoAlt: 'Właścicielka firmy czyta na telefonie podsumowanie rozmowy',
    },
    showcase: { title: 'Zobacz agenta w akcji w Twojej branży', intro: 'Wybierz branżę: rozmowa się odbywa, a zgłoszenie trafia do Ciebie gotowe do obsługi.' },
    benefits: { title: 'Co agent robi dla Twojej firmy', intro: 'Wirtualna recepcjonistka przygotowana do Twojej działalności, która pracuje, gdy Twój zespół nie może odebrać telefonu.' },
    features: {
      booking: {
        title: { before: 'Zautomatyzuj ', kw: 'umawianie wizyt przez telefon', after: ' i przypomnienia' },
        text: 'Gabinety, salony, warsztaty, biura: agent łączy się z Twoim kalendarzem, proponuje wolne terminy, rezerwuje i potwierdza. Także zmiany terminów i odwołania.',
        points: ['Kalendarz na bieżąco: Google, Outlook, Cal.com, Calendly', 'Potwierdzenie SMS-em lub przez WhatsApp (od pakietu Asystent)', 'Przypomnienie dzień przed wizytą (od pakietu Asystent)'],
        link: 'Zobacz umawianie wizyt',
      },
      support: {
        title: { before: 'Odpowiadaj na ', kw: 'pytania klientów', after: ' bez czekania' },
        text: 'Agent korzysta z Twoich dokumentów, stron WWW i procedur. Odpowiada trafnie, a sprawy wymagające człowieka przekazuje Twojemu zespołowi.',
        points: ['Baza wiedzy: PDF, strona WWW, dane', 'Kilka połączeń jednocześnie, bez kolejki', 'Przekazanie rozmowy człowiekowi według Twoich zasad'],
        link: 'Zobacz obsługę klienta',
      },
      leads: {
        title: { before: 'Kwalifikuj i ', kw: 'szybciej oddzwaniaj', after: ' do potencjalnych klientów' },
        text: 'Formularz wypełniony na Twojej stronie zamienia się w rozmowę w ciągu kilku minut. Agent kwalifikuje, przypomina się i przygotowuje kartę, którą Twój zespół może od razu obsłużyć.',
        points: ['Wstępna kwalifikacja według Twoich kryteriów', 'Automatyczne przypomnienia i potwierdzenia', 'Kampanie do kontaktów, które wyraziły zgodę'],
        link: 'Zobacz kwalifikację leadów',
      },
    },
    useCases: { title: 'Agent do każdego rodzaju połączeń', intro: 'Przychodzące, wychodzące czy wiadomości: włącz zastosowania, których potrzebuje Twoja firma.' },
    platform: {
      title: 'Kompletna platforma do automatycznej obsługi połączeń',
      intro: 'Wszystko w pakiecie: głos, inteligencja, telefonia, automatyzacje i raporty, w jednym panelu.',
      link: 'Wszystkie funkcje',
    },
    steps: {
      title: 'Gotowe w czterech krokach',
      intro: 'Nie potrzebujesz wiedzy technicznej. Wspieramy Cię na każdym etapie.',
      items: (d: number, m: number) => [
        { title: 'Załóż konto', text: `Wybierz pakiet: ${days(d)} za darmo, ${minutes(m)} w cenie, w okresie próbnym nic nie jest pobierane.` },
        { title: 'Opisz swoją działalność', text: 'Usługi, godziny otwarcia, częste pytania, zasady przekazywania rozmów.' },
        { title: 'Przetestuj agenta', text: 'Posłuchaj go w demo na żywo i dopasuj ton oraz odpowiedzi.' },
        { title: 'Podłącz połączenia', text: 'Przekierowanie Twojej linii, nowy numer lub SIP oraz widżet na Twojej stronie.' },
      ],
    },
    sectors: {
      title: 'Agenci dopasowani do Twojej branży',
      intro: 'Sześć branż, w których każde nieodebrane połączenie to utracony klient. Agent zadaje właściwe pytania w każdej z nich.',
      link: 'Wszystkie branże',
    },
    integrations: {
      title: 'Połączony z Twoimi narzędziami',
      intro: 'Kalendarz, CRM, komunikatory, telefonia: agent integruje się z tym, czego już używasz. Flow builder łączy ponad 300 narzędzi bez kodu, na tej samej zasadzie co Zapier czy Make.',
      link: 'Zobacz wszystkie integracje',
    },
    pricing: {
      title: 'Przejrzyste pakiety, ceny netto',
      intro: 'Wybierz według liczby połączeń. Im większy pakiet, tym tańsza minuta.',
      compare: 'Porównaj wszystkie funkcje w pakietach',
    },
    faq: {
      title: 'Najczęstsze pytania',
      intro: 'Nie ma tu odpowiedzi na Twoje pytanie? Zostaw numer, a doradca oddzwoni.',
      link: 'Wszystkie pytania',
    },
  },

  tarifs: {
    meta: {
      title: (brand: string) => `Cennik asystenta głosowego AI — pakiety netto · ${brand}`,
      /** Jeden pakiet w opisie: `price` i `minutes` już sformatowane. */
      plan: (name: string, price: string, mins: string) => `${name} ${price} netto / ${mins} min`,
      description: (plans: string[], d: number, m: number) =>
        `${plans.join(', ')}. Wypróbuj: ${days(d)} za darmo, ${minutes(m)} w cenie.`,
    },
    hero: {
      title: 'Cennik asystenta głosowego AI: wybierz pakiet według liczby połączeń',
      intro: (d: number, m: number) =>
        `Wszystkie ceny są podane netto. Im większy pakiet, tym tańsza minuta. Bezpłatny okres próbny to ${days(d)} i ${minutes(m)} połączeń w cenie.`,
      moreMinutes: 'Potrzebujesz więcej minut? Doładuj konto w dowolnym momencie.',
    },
    matrix: {
      title: 'Co zawiera Twój panel',
      intro: 'Każdy wiersz odpowiada stronie lub funkcji dostępnej w Twoim panelu klienta. Nic więcej nie kryje się za żadnym przyciskiem.',
    },
    recharges: {
      title: 'Potrzebujesz więcej minut?',
      intro: 'Doładowanie pomaga w intensywniejszym miesiącu. Przy regularnym wolumenie wyższy pakiet pozostaje najkorzystniejszym rozwiązaniem.',
      link: 'Jak działają doładowania',
    },
    faq: {
      title: 'Pytania o ceny',
      intro: 'Nie wiesz, który pakiet wybrać? Zamów rozmowę lub wypróbuj agenta na żywo.',
      primary: 'Zacznij za darmo',
      demo: 'Zobacz demo na żywo',
    },
    finalCta: (m: number) => `Zacznij z ${m} ${plural(m, 'darmową minutą', 'darmowymi minutami', 'darmowymi minutami')}`,
  },

  offer: {
    metaTitleTrial: (d: number, m: number, brand: string) => `Bezpłatny okres próbny ${days(d)} — ${minutes(m)} · ${brand}`,
    /** `monthly`: dodaje „netto / mies.”, gdy cena jest kwotą miesięczną. */
    metaTitle: (name: string, price: string, monthly: boolean, brand: string) => `Pakiet ${name} — ${price}${monthly ? ' netto / mies.' : ''} · ${brand}`,
    metaDescription: (title: string, d: number, m: number) => `${title}. Wypróbuj za darmo: ${days(d)}, ${minutes(m)} w cenie, ceny netto.`,
    breadcrumb: 'Cennik',
    productName: (brand: string, name: string) => `${brand} ${name}`,
    eyebrow: (name: string, audience: string) => `Pakiet ${name} · ${audience}`,
    demo: 'Wypróbuj naszego agenta na żywo',
    perMonth: 'netto / mies.',
    perMinuteLine: (perMinute: string) => `czyli ${perMinute} w pakiecie`,
    facts: {
      minutes: 'Minuty w cenie',
      more: 'Potrzebujesz więcej?',
      moreCustom: 'Wolumen negocjowany',
      moreDefault: 'Doładowanie w dowolnym momencie',
      commitment: 'Zobowiązanie',
      commitmentValue: 'Brak',
    },
    included: {
      title: 'Co znajdziesz w swoim panelu',
      intro: 'Dokładna lista funkcji dostępnych w tym pakiecie.',
      notIncluded: 'Niedostępne',
      includedLabel: 'W cenie',
      compare: 'Porównaj z innymi pakietami',
    },
    modules: { title: 'Kluczowe moduły tego pakietu' },
    extra: {
      title: 'Dodatkowe minuty',
      intro: 'Intensywniejszy miesiąc? Doładuj konto. Rosnący wolumen? Przejdź na wyższy pakiet.',
    },
    others: { title: 'Pozostałe pakiety' },
    faq: { title: 'Najczęstsze pytania' },
  },

  recharges: {
    meta: {
      title: (brand: string) => `Doładowania minut dla asystenta głosowego AI — ${brand}`,
      description: (price: string, mins: string) =>
        `Doładowania środków od ${price} netto za ${mins} ${plural(toInt(mins), 'dodatkową minutę', 'dodatkowe minuty', 'dodatkowych minut')}. Dokupuj minuty w dowolnym momencie; przejdź na wyższy pakiet, gdy rośnie liczba połączeń.`,
    },
    hero: {
      title: 'Dokupuj minuty w dowolnym momencie',
      intro: 'Doładowanie pomaga w intensywniejszym miesiącu. Jeśli doładowujesz często, wyższy pakiet staje się korzystniejszy: poinformujemy Cię o tym.',
    },
    how: {
      title: 'Jak to działa',
      steps: (min: string, max: string) => [
        { title: 'Śledź wykorzystanie', text: 'Pulpit pokazuje zużyte i pozostałe minuty.' },
        { title: 'Doładuj środki', text: `Doładowanie od ${min} do ${max}, jednym kliknięciem w panelu klienta.` },
        { title: 'Działaj bez przerw', text: 'Środki pokrywają minuty ponad limit pakietu i nie wygasają.' },
      ],
    },
  },

  sectorsIndex: {
    meta: {
      title: (brand: string) => `Asystent głosowy AI dla firm z każdej branży · ${brand}`,
      description: 'Gabinety stomatologiczne, biura nieruchomości, warsztaty, salony, restauracje, hotele i fachowcy: asystent głosowy AI dopasowany do Twojej branży.',
    },
    hero: {
      title: 'Asystent głosowy AI dopasowany do Twojej branży',
      intro: 'Wybraliśmy sześć branż, w których telefony dzwonią, gdy zespoły są zajęte, a każde nieodebrane zgłoszenie to utracony klient.',
    },
    other: {
      title: 'Twojej branży nie ma na liście?',
      intro: 'Kancelarie prawne, e-commerce, rekrutacja, turystyka: agenta można skonfigurować dla każdej firmy, która odbiera telefony. Porozmawiajmy o Twoim przypadku.',
      primary: 'Zacznij za darmo',
      demo: 'Wypróbuj naszego agenta na żywo',
    },
  },

  sector: {
    meta: {
      title: (name: string, brand: string) => `${SECTOR_SEO_TITLE[name] ?? `${name}: agent głosowy AI 24/7`} — ${brand}`,
      /** `short` to krótkie zdanie o branży (z frazą kluczową), bez kropki na końcu; `name` nieużywane w PL. */
      description: (_name: string, short: string, d: number, m: number) =>
        `${short}. Wypróbuj za darmo: ${days(d)}, ${minutes(m)} w cenie.`,
    },
    breadcrumb: 'Branże',
    liveCallTitle: (name: string) => `Agent: ${name.toLowerCase()}`,
    change: {
      title: 'Co się zmienia, gdy agent odbiera za Ciebie',
      intro: (targets: string) => `${targets}. W Twojej branży każde nieodebrane połączenie to zgłoszenie, które trafia gdzie indziej.`,
    },
    handles: {
      title: 'Czym agent zajmuje się w Twojej firmie',
      intro: 'Zadaje te same pytania co Ty, w naturalnej kolejności, i przekazuje Ci kompletne zgłoszenie.',
    },
    /** Tytuł korzyści: „agencji” dla nieruchomości, „firmy” w pozostałych branżach. */
    benefitsTitle: (slug: string) => `Co to zmienia dla Twojej ${slug === 'immobilier' ? 'agencji' : 'firmy'}`,
    how: { title: 'Jak to działa' },
    includes: { title: 'Co obejmuje', intro: 'Najprzydatniejsze moduły dla Twojej branży, wszystkie dostępne w Twoim panelu.' },
    integrations: {
      title: 'Przydatne integracje',
      intro: 'Twój kalendarz, CRM, komunikatory i telefonia pozostają bez zmian: agent się z nimi łączy.',
    },
    pricing: {
      title: 'Ceny netto, bez zobowiązań',
      intro: (sectorName: string, offerName: string, d: number, m: number) =>
        `Dla branży „${sectorName.toLowerCase()}” polecamy pakiet ${offerName}. Zacznij od bezpłatnego okresu próbnego: ${days(d)} i ${minutes(m)} w cenie.`,
      link: (offerName: string) => `Zobacz szczegóły pakietu ${offerName}`,
    },
    faq: { title: (name: string) => `Najczęstsze pytania — ${name}` },
    callback: {
      title: 'Skontaktuj się z nami: zostaw numer, oddzwonimy',
      text: 'Doradca oddzwoni, aby omówić Twój przypadek.',
    },
    others: { title: 'Inne branże' },
    finalCta: 'Chcesz odbierać każde połączenie?',
  },

  featuresIndex: {
    meta: {
      title: (brand: string) => `Funkcje: automatyczna obsługa połączeń z AI · ${brand}`,
      description: 'Wirtualna recepcjonistka, umawianie wizyt przez telefon, obsługa klienta, kwalifikacja leadów, WhatsApp, SIP, raporty i widżet. Poznaj wszystkie moduły.',
    },
    hero: {
      title: 'Wszystko, czego potrzebujesz do automatycznej obsługi połączeń',
      intro: 'Trzynaście modułów, włączanych zależnie od pakietu, w Twoim panelu klienta.',
    },
    overview: { title: 'Przegląd' },
  },

  feature: {
    meta: {
      title: (name: string, brand: string) => `${FEATURE_SEO_TITLE[name] ?? `${name} — agent głosowy AI`} | ${brand}`,
      /** `short` to zdanie o korzyści z modułu, bez kropki na końcu. */
      description: (short: string, offerName: string, d: number) => `${short}. Dostępne od pakietu ${offerName}. Wypróbuj za darmo przez ${days(d)}.`,
    },
    breadcrumb: 'Funkcje',
    eyebrow: (family: string, name: string) => `${family} · ${name}`,
    uses: { title: 'Do czego służy' },
    from: {
      title: (offerName: string) => `Dostępne od pakietu ${offerName}`,
      /** `price` już sformatowana w walucie rynku. */
      priceLine: (price: string, mins: string) => `${price} netto / mies. · ${mins}`,
      offerLink: (offerName: string) => `Zobacz pakiet ${offerName}`,
      compare: 'Porównaj pakiety',
    },
    how: { title: 'Jak to działa' },
    cases: { title: 'Przykłady zastosowań' },
    integrations: { title: 'Powiązane integracje', link: 'Wszystkie integracje' },
    more: { title: 'Zobacz także' },
  },

  integrations: {
    meta: {
      title: (brand: string) => `Integracje — kalendarz, CRM, WhatsApp, SIP · ${brand}`,
      description: 'Połącz asystenta głosowego AI z Kalendarzem Google, Outlookiem, Cal.com, Calendly, HubSpotem, Zoho, WhatsApp, SIP i ponad 300 narzędziami bez kodu.',
    },
    hero: {
      title: 'Połączony z narzędziami, których już używasz',
      intro: 'Kalendarz, CRM, komunikatory, telefonia: agent wpasowuje się w Twoją organizację, a flow builder łączy ponad 300 narzędzi bez kodu.',
    },
    flow: {
      title: { before: 'Twórz automatyzacje ', kw: 'bez kodu', after: '' },
      text: 'Wypełniony formularz, zakończona rozmowa, nowy lead: każde zdarzenie może uruchomić sekwencję działań w Twoich narzędziach, na tej samej zasadzie co Zapier czy Make, bezpośrednio z Twojego panelu.',
      points: ['Ponad 300 dostępnych narzędzi', 'Przeciągnij i upuść, bez programowania', 'Testy przed aktywacją'],
      link: 'Zobacz flow builder',
    },
    api: {
      title: { before: 'Webhooki i API dla ', kw: 'Twoich systemów', after: '' },
      text: 'W pakiecie Call center otrzymujesz każde zakończenie rozmowy wraz z wyodrębnionymi danymi we własnych systemach lub sterujesz agentem z poziomu swojego oprogramowania.',
      points: ['Webhook po każdej rozmowie', 'Wyodrębnione zmienne: wynik, zainteresowanie, termin', 'Narzędzia MCP dla Twoich asystentów'],
    },
  },
};

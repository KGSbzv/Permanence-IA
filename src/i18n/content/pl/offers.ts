// Teksty ofert i macierzy funkcji. Ceny i minuty pochodzą z rynku
// (src/i18n/markets.ts): ten plik zawiera wyłącznie słowa.
import type { PlanSlug } from '../../markets';
import type { Cell, MatrixGroup, OfferText } from '../fr/offers';

/** Odmiana liczebnika: 1 minuta, 2–4 minuty, 5+ minut (także 12–14 → „minut”). */
const plural = (n: number, one: string, few: string, many: string) => {
  if (n === 1) return one;
  const n10 = n % 10, n100 = n % 100;
  return n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14) ? few : many;
};
/** Liczba z tekstu już sformatowanego (np. „1 000”). */
const toInt = (s: string) => parseInt(s.replace(/\D/g, ''), 10) || 0;

export const OFFER_TEXT: Record<PlanSlug, OfferText> = {
  decouverte: {
    name: 'Okres próbny',
    audience: 'Aby przetestować agenta w Twojej działalności',
    title: 'Przetestuj agenta za darmo przez 14 dni',
    pitch: 'Poznaj platformę, skonfiguruj pierwszego agenta, wypróbuj demo na żywo i wykorzystaj do 30 minut połączeń, aby sprawdzić potencjał w Twojej działalności.',
    cta: 'Zacznij za darmo',
    highlights: ['14 dni w wybranym pakiecie', '30 minut połączeń w cenie', 'Karta wymagana, w okresie próbnym nic nie jest pobierane', 'Anuluj przed końcem okresu próbnego bez kosztów'],
  },
  receptionniste: {
    name: 'Recepcjonistka',
    audience: 'Jednoosobowe działalności i małe firmy',
    title: 'Recepcjonistka AI, która odbiera każde połączenie, całą dobę',
    pitch: 'Pakiet Recepcjonistka przejmuje połączenia, odpowiada na częste pytania, umawia wizyty i przekazuje Ci czytelne podsumowanie każdego zgłoszenia. Proste wdrożenie, bez komplikacji.',
    cta: 'Wybierz Recepcjonistkę',
    highlights: ['1 agent głosowy AI odbierający 24/7', '2 jednoczesne połączenia', '1 baza wiedzy; możliwy 1 dedykowany numer (opcja od 5,99 $ netto / mies.)', 'Podłączony kalendarz i widżet na stronę', 'Przekazanie rozmowy do zespołu', 'SMS, WhatsApp i Messenger (kredyty na wiadomości według potrzeb)'],
  },
  assistant: {
    name: 'Asystent',
    audience: 'Lokalne firmy z regularną liczbą połączeń',
    title: 'Asystent AI, który kwalifikuje, przypomina i automatyzuje obsługę zgłoszeń',
    pitch: 'Pakiet Asystent obejmuje trzech agentów, kampanie przypominające, automatyzacje bez kodu połączone z ponad 300 narzędziami oraz sklonowany głos, aby zamieniać więcej zapytań w klientów.',
    cta: 'Wybierz Asystenta',
    highlights: ['Wszystko z pakietu Recepcjonistka, a do tego:', '3 agentów, 5 jednoczesnych połączeń', '3 bazy wiedzy, 3 narzędzia w trakcie rozmowy; możliwe 3 dedykowane numery (opcja od 5,99 $ netto / mies.)', '3 kampanie przypominające', 'Scenariusze automatyzacji (5000 uruchomień / mies.)', '1 sklonowany głos', '1000 kredytów na wiadomości miesięcznie (≈ 500 odpowiedzi pisemnych)'],
  },
  'centre-appels': {
    name: 'Call center',
    audience: 'Zespoły, wiele działów i duże wolumeny',
    title: 'Kompletne call center AI do obsługi recepcji, wizyt i wsparcia',
    pitch: 'Pakiet Call center znosi limity: nielimitowani agenci i kampanie, 20 jednoczesnych połączeń, własne pulpity, priorytetowe wsparcie i najniższa cena za minutę.',
    cta: 'Wybierz Call center',
    highlights: ['Wszystko z pakietu Asystent, a do tego:', 'Nielimitowani agenci, kampanie i bazy wiedzy', '20 jednoczesnych połączeń; możliwe 10 dedykowanych numerów (opcja od 5,99 $ netto / mies.)', '3 sklonowane głosy, 50 000 automatyzacji / mies.', 'Własne pulpity', 'Priorytetowe wsparcie', '3000 kredytów na wiadomości miesięcznie (≈ 1500 odpowiedzi pisemnych)'],
  },
  'sur-mesure': {
    name: 'Na miarę',
    audience: 'Regularnie ponad 2500 minut miesięcznie',
    title: 'Konfiguracja dopasowana do Twoich wolumenów, lokalizacji i integracji',
    pitch: 'Dla sieci, organizacji wielooddziałowych i regularnych wolumenów powyżej 2500 minut: negocjowana cena za minutę, zasady dla każdej placówki, zaawansowane integracje i wdrożenie z naszym wsparciem.',
    cta: 'Porozmawiaj z ekspertem',
    highlights: ['Wszystko z pakietu Call center', 'Negocjowana cena za minutę', 'Zasady dla wielu lokalizacji', 'SLA i wdrożenie z opiekunem'],
  },
};

/** Etykiety budowane z liczb rynku. `n` jest już sformatowane (np. „1000”). */
export const OFFER_LABELS = {
  free: '0 $',
  onQuote: 'Wycena indywidualna',
  minutesPerMonth: (n: string) => `${n} min / mies.`,
  trialMinutes: (n: string, days: number) => `${n} ${plural(toInt(n), 'minuta', 'minuty', 'minut')} przez ${days} ${days === 1 ? 'dzień' : 'dni'}`,
  customVolume: 'Wolumen dopasowany do Twojej działalności',
  perMinute: (price: string) => `${price} netto / min`,
  exclTax: 'netto',
  perMonth: 'netto / mies.',
};

// Macierz funkcji: każdy wiersz odpowiada stronie lub funkcji w panelu klienta.
// Wartości: true = w cenie, false = niedostępne, tekst = poziom.
const all = (v: Cell): Record<PlanSlug, Cell> => ({ decouverte: v, receptionniste: v, assistant: v, 'centre-appels': v, 'sur-mesure': v });
const paid = (v: Cell): Record<PlanSlug, Cell> => ({ ...all(v), decouverte: false });

// Limity odczytane w panelu administracyjnym panelu klienta (pakiety Receptionist 1646, Assistant 1647, Call Centre 1650
// i okres próbny): każdą zmianę pakietu w panelu administracyjnym trzeba przenieść tutaj i odwrotnie.
export const MATRIX: MatrixGroup[] = [
  {
    group: 'Agenci i połączenia',
    rows: [
      { label: 'Agenci głosowi AI', detail: 'Liczba agentów, których możesz utworzyć, do połączeń przychodzących lub wychodzących.', cells: { decouverte: '1', receptionniste: '1', assistant: '3', 'centre-appels': 'Bez limitu', 'sur-mesure': 'Bez limitu' } },
      { label: 'Jednoczesne połączenia', detail: 'Połączenia obsługiwane w tym samym czasie: nikt nie czeka, nawet w godzinach szczytu.', cells: { decouverte: '1', receptionniste: '2', assistant: '5', 'centre-appels': '20', 'sur-mesure': 'Indywidualnie' } },
      { label: 'Historia połączeń', detail: 'Nagrania, transkrypcje i podsumowania każdej rozmowy.', cells: all(true) },
      { label: 'Przekazanie rozmowy człowiekowi', detail: 'Agent przełącza rozmowę do Twojego zespołu, gdy jest to potrzebne.', cells: all(true) },
      { label: 'Języki dodatkowe', detail: 'Agent rozpoznaje język dzwoniącego i odpowiada w jego języku.', cells: all(true) },
      { label: 'Sklonowane głosy', detail: 'Głos utworzony na podstawie nagrania Twojego głosu.', cells: { decouverte: false, receptionniste: false, assistant: '1', 'centre-appels': '3', 'sur-mesure': 'Indywidualnie' } },
    ],
  },
  {
    group: 'Konfiguracja agenta',
    rows: [
      { label: 'Edytor promptów AI', detail: 'Kreator z podpowiedziami AI ustawia zachowanie, ton i zasady agenta.', cells: all(true) },
      { label: 'Bazy wiedzy', detail: 'PDF-y, strony WWW i procedury, z których agent korzysta w trakcie rozmowy.', cells: { decouverte: '1', receptionniste: '1', assistant: '3', 'centre-appels': 'Bez limitu', 'sur-mesure': 'Bez limitu' } },
      { label: 'Narzędzia w trakcie rozmowy', detail: 'Akcje uruchamiane na żywo: sprawdzenie dostępności, wgląd w kartę klienta, zapytanie do Twojego oprogramowania.', cells: { decouverte: '1', receptionniste: false, assistant: '3', 'centre-appels': 'Bez limitu', 'sur-mesure': 'Bez limitu' } },
      { label: 'Flow builder', detail: 'Wizualne scenariusze bez kodu: wyzwalacze, warunki i akcje.', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Platforma automatyzacji', detail: 'Ponad 300 narzędzi do podłączenia: CRM, Google Sheets, Slack, e-mail…', cells: { decouverte: false, receptionniste: false, assistant: '5000 uruchomień / mies.', 'centre-appels': '50 000 uruchomień / mies.', 'sur-mesure': 'Indywidualnie' } },
      { label: 'Konektor AI', detail: 'Zarządzaj kontem z poziomu ChatGPT lub Claude: twórz agenta, przeglądaj rozmowy, uruchamiaj działania.', cells: all(true) },
    ],
  },
  {
    group: 'Kalendarz i pozyskiwanie zgłoszeń',
    rows: [
      { label: 'Integracja z kalendarzem', detail: 'Cal.com lub Calendly (a przez nie także Google i Outlook): agent rezerwuje terminy w Twoim kalendarzu.', cells: all(true) },
      { label: 'Widżet na stronę', detail: 'Przycisk połączenia i oddzwonienia do umieszczenia na Twojej stronie.', cells: all(true) },
      { label: 'Leady', detail: 'Dane potencjalnych klientów zapisywane na podstawie rozmów.', cells: all(true) },
    ],
  },
  {
    group: 'Wiadomości i kampanie',
    rows: [
      { label: 'Kampanie wychodzące', detail: 'Ponowne kontakty, potwierdzenia i przypomnienia realizowane automatycznie przez telefon.', cells: { decouverte: false, receptionniste: false, assistant: '3', 'centre-appels': 'Bez limitu', 'sur-mesure': 'Bez limitu' } },
      { label: 'SMS i WhatsApp', detail: 'Korespondencja pisemna w jednym miejscu, opłacana kredytami na wiadomości.', cells: all(true) },
      { label: 'Messenger i Instagram', detail: 'Wiadomości z mediów społecznościowych w tej samej skrzynce.', cells: all(true) },
      { label: 'Kredyty na wiadomości w cenie', detail: 'Kredyty przyznawane co miesiąc na komunikację pisemną (WhatsApp, SMS, Messenger, czat). 100 kredytów = 1 $, odpowiedź AI ≈ 2 kredyty. Jeśli pakiet nie zawiera kredytów, doładowujesz je według potrzeb.', cells: { decouverte: false, receptionniste: 'Według potrzeb', assistant: '1000 / mies. (≈ 500 odpowiedzi)', 'centre-appels': '3000 / mies. (≈ 1500 odpowiedzi)', 'sur-mesure': 'Indywidualnie' } },
    ],
  },
  {
    group: 'Telefonia',
    rows: [
      { label: 'Numery telefonów', detail: 'Liczba możliwych dedykowanych numerów. Numer nie jest wliczony w pakiet: to opcja kupowana w panelu klienta, od 5,99 $ netto miesięcznie, zależnie od kraju.', cells: { decouverte: '1', receptionniste: '1', assistant: '3', 'centre-appels': '10', 'sur-mesure': 'Indywidualnie' } },
      { label: 'Połączenie SIP', detail: 'Zachowaj swoje numery i centralę: połączenie SIP, import z Twilio lub Telnyx.', cells: all(true) },
      { label: 'Twój numer komórkowy jako numer wyświetlany', detail: 'Zweryfikuj swój numer, aby wyświetlał się przy połączeniach wychodzących.', cells: paid(true) },
      { label: 'Lista wykluczeń', detail: 'Numery, do których agent nigdy nie dzwoni.', cells: all(true) },
    ],
  },
  {
    group: 'Zarządzanie i integracje',
    rows: [
      { label: 'Statystyki połączeń', detail: 'Wolumeny, czas trwania i wyniki na Twoim pulpicie.', cells: all(true) },
      { label: 'Własne pulpity', detail: 'Twoje własne wskaźniki, zbudowane na podstawie danych z rozmów.', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'API i webhooki', detail: 'Otrzymuj wynik każdej rozmowy w swoich systemach lub steruj agentem z poziomu swojego oprogramowania.', cells: all(true) },
      { label: 'Zasady dla wielu lokalizacji i SLA', detail: 'Wiele placówek, zobowiązania dotyczące poziomu usług.', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': false, 'sur-mesure': true } },
      { label: 'Wsparcie', detail: 'Pomoc i opieka naszego zespołu.', cells: { decouverte: 'Materiały pomocy', receptionniste: 'Standardowe', assistant: 'Standardowe', 'centre-appels': 'Priorytetowe', 'sur-mesure': 'Dedykowane' } },
    ],
  },
];

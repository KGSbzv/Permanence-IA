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
    highlights: ['Recepcjonistka AI 24/7', 'Podłączony kalendarz', 'Widżet oddzwaniania na stronę', 'Przekazanie rozmowy człowiekowi'],
  },
  assistant: {
    name: 'Asystent',
    audience: 'Lokalne firmy z regularną liczbą połączeń',
    title: 'Asystent AI, który kwalifikuje, przypomina i automatyzuje obsługę zgłoszeń',
    pitch: 'Pakiet Asystent dodaje kwalifikację leadów, kampanie przypominające, wiadomości SMS i WhatsApp, flow builder oraz Twoje własne numery przez SIP, aby zamieniać więcej zapytań w klientów.',
    cta: 'Wybierz Asystenta',
    highlights: ['Wszystko z pakietu Recepcjonistka', 'Flow builder i automatyzacje', 'Kampanie i leady', 'SMS, WhatsApp i Instagram', 'Twoje numery przez SIP'],
  },
  'centre-appels': {
    name: 'Call center',
    audience: 'Zespoły, wiele działów i duże wolumeny',
    title: 'Kompletne call center AI do obsługi recepcji, wizyt i wsparcia',
    pitch: 'Pakiet Call center łączy wielu agentów, szczegółowe raporty, role, zaawansowaną bazę wiedzy, API i priorytetowe wsparcie, z najniższą ceną za minutę.',
    cta: 'Wybierz Call center',
    highlights: ['Wszystko z pakietu Asystent', 'Wielu agentów i role', 'Szczegółowe raporty', 'API, webhooki i narzędzia MCP', 'Priorytetowe wsparcie', '3000 kredytów na wiadomości w cenie (30 $)'],
  },
  'sur-mesure': {
    name: 'Na miarę',
    audience: 'Powyżej 2500 minut miesięcznie, regularnie',
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

export const MATRIX: MatrixGroup[] = [
  {
    group: 'Agenci i połączenia',
    rows: [
      { label: 'Asystenci głosowi AI', detail: 'Agenci do połączeń przychodzących i wychodzących', cells: { decouverte: '1 testowy', receptionniste: '1', assistant: '3', 'centre-appels': 'Wielu agentów', 'sur-mesure': 'Na miarę' } },
      { label: 'Historia połączeń', detail: 'Nagrania, transkrypcje, podsumowania', cells: { ...all(true), decouverte: 'Ograniczona' } },
      { label: 'Rozmowy', detail: 'Rozmowy pisemne i głosowe w jednym miejscu', cells: all(true) },
      { label: 'Przekazanie rozmowy człowiekowi', detail: 'Przełączenie do Twojego zespołu', cells: all(true) },
      { label: 'Głosy wielojęzyczne', detail: 'Wykrywanie języków dodatkowych', cells: all(true) },
    ],
  },
  {
    group: 'Konfiguracja agenta',
    rows: [
      { label: 'Edytor promptów AI', detail: 'Zachowanie, ton, zasady', cells: { decouverte: 'Podgląd', receptionniste: 'Uproszczony', assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Baza wiedzy', detail: 'PDF, strony WWW, procedury', cells: { decouverte: 'Podstawowa', receptionniste: 'Podstawowa', assistant: true, 'centre-appels': 'Zaawansowana', 'sur-mesure': 'Zaawansowana' } },
      { label: 'Flow builder', detail: 'Wizualne scenariusze bez kodu', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': 'Zaawansowany', 'sur-mesure': 'Zaawansowany' } },
      { label: 'Automatyzacje', detail: 'Ponad 300 narzędzi do podłączenia', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
    ],
  },
  {
    group: 'Kalendarz i pozyskiwanie zgłoszeń',
    rows: [
      { label: 'Integracja z kalendarzem', detail: 'Google, Outlook, Cal.com, Calendly', cells: all(true) },
      { label: 'Widżet na stronę', detail: 'Oddzwonienie i rozmowa z Twojej strony', cells: all(true) },
      { label: 'Identyfikacja dzwoniącego', detail: 'Przycisk caller ID', cells: { ...all(true), decouverte: false } },
      { label: 'Leady i wstępna kwalifikacja', detail: 'Uporządkowane karty potencjalnych klientów', cells: { decouverte: false, receptionniste: 'Podstawowe', assistant: true, 'centre-appels': true, 'sur-mesure': true } },
    ],
  },
  {
    group: 'Wiadomości i kampanie',
    rows: [
      { label: 'Kampanie wychodzące', detail: 'Przypomnienia, potwierdzenia, ponowne kontakty', cells: { decouverte: false, receptionniste: false, assistant: 'Z limitami', 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Historia SMS', detail: 'Wysłane wiadomości i odpowiedzi', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'WhatsApp', detail: 'Nadawcy i szablony', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Messenger i Instagram', detail: 'Kanały wiadomości', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
    ],
  },
  {
    group: 'Telefonia',
    rows: [
      { label: 'Dedykowany numer', detail: 'Opcja płatna co miesiąc, zależnie od kraju', cells: { decouverte: false, receptionniste: 'Opcjonalnie', assistant: 'Opcjonalnie', 'centre-appels': 'Opcjonalnie', 'sur-mesure': 'Opcjonalnie' } },
      { label: 'Integracja SIP', detail: 'Twoje numery i Twoja centrala', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Lista blokad', detail: 'Numery wykluczone z połączeń', cells: { ...all(true), decouverte: false } },
    ],
  },
  {
    group: 'Zarządzanie i zespół',
    rows: [
      { label: 'Szczegółowe raporty', detail: 'Wolumeny, czas trwania, konwersje', cells: { decouverte: false, receptionniste: 'Pulpit', assistant: 'Pulpit', 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Role i uprawnienia', detail: 'Dostęp dla każdego członka zespołu', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'API, webhooki i narzędzia MCP', detail: 'Połączenie z Twoimi systemami', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Zasady dla wielu lokalizacji i SLA', detail: 'Wiele placówek', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': false, 'sur-mesure': true } },
      { label: 'Wsparcie', detail: 'Pomoc i opieka', cells: { decouverte: 'Materiały', receptionniste: 'Standardowe', assistant: 'Standardowe', 'centre-appels': 'Priorytetowe', 'sur-mesure': 'Dedykowane' } },
    ],
  },
];

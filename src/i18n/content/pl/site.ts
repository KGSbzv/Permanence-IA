// Komunikaty przekrojowe (pasek okresu próbnego, odznaki, nota o cenach). Liczby pochodzą z rynku.

/** Odmiana liczebnika: 1 minuta, 2–4 minuty, 5+ minut (także 12–14 → „minut”). */
const plural = (n: number, one: string, few: string, many: string) => {
  if (n === 1) return one;
  const n10 = n % 10, n100 = n % 100;
  return n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14) ? few : many;
};
const minutesWord = (n: number) => plural(n, 'minuta', 'minuty', 'minut');
const daysWord = (n: number) => (n === 1 ? 'dzień' : 'dni');

export const SITE_TEXT = {
  trialLine: (days: number, minutes: number) => `${days} ${daysWord(days)} bezpłatnego okresu próbnego — ${minutes} ${minutesWord(minutes)} w cenie — ceny netto — bez zobowiązań i bez opłaty aktywacyjnej`,
  trialBadges: (days: number, minutes: number) => [`${days} ${daysWord(days)} za darmo`, `${minutes} ${minutesWord(minutes)} w cenie`, 'W okresie próbnym nic nie jest pobierane', 'Bez zobowiązań', 'Bez opłaty aktywacyjnej'],
  growthLines: ['Dokupuj minuty w dowolnym momencie', 'Przejdź na wyższy pakiet, gdy liczba połączeń rośnie'],
  priceNote: (numberFrom: string) => `Ceny w dolarach amerykańskich (USD), netto — lokalne podatki doliczane, jeśli mają zastosowanie. Dedykowany numer od ${numberFrom} netto miesięcznie, zależnie od kraju.`,
  skipToContent: 'Przejdź do treści',
  languageLabel: 'Język',
  payg: (rate: string) => `Nie potrzebujesz jeszcze pakietu? Płać za użycie: ${rate} netto za minutę, bez abonamentu. Doładowujesz kredyty, kiedy chcesz (Add credits); nie wygasają. Pakiet wychodzi taniej, gdy połączenia są regularne.`,
  talkNow: 'Porozmawiaj z naszym agentem teraz',
  talkNowSub: 'Demo na żywo, bezpłatnie, bez rejestracji',
  rechargeFreeAmount: 'Kwotę wybierasz sam, od 5 $: wpisz ją w panelu klienta (Add credits). Powyższe kwoty to przykłady.',
  consent: { title: 'Pliki cookie do pomiaru', text: 'Za Twoją zgodą używamy plików cookie do pomiaru ruchu na stronie (Google Analytics) i skuteczności naszych reklam na Facebooku i Instagramie (piksel Meta). Bez Twojej zgody nic nie jest zapisywane, a odmowa nie ogranicza korzystania ze strony.', accept: 'Akceptuję', reject: 'Odrzucam', policy: 'Więcej informacji', manage: 'Ustawienia cookie' },
  keepNumber: { title: 'Zachowujesz swój numer', text: 'Bez zmiany operatora i sprzętu: wystarczy przekierowanie połączeń, stałe lub tylko wtedy, gdy nie odbierasz telefonu, a agent przejmuje rozmowę.' },
  fxNote: (date: string) => `Kwoty w walucie lokalnej mają charakter orientacyjny, według kursu referencyjnego EBC z dnia ${date}. Pakiety są rozliczane w dolarach amerykańskich: pobrana kwota zależy od kursu Twojego banku w dniu płatności.`,
  whatsapp: { cta: 'Napisz do nas na WhatsApp', note: 'Nasz agent AI odpowiada od razu, całą dobę, w Twoim języku.', prefill: 'Dzień dobry, proszę o więcej informacji o PermanenceAI.', optIn: 'Chcę też otrzymać potwierdzenie oddzwonienia na WhatsApp', tryTitle: 'Przetestuj agenta teraz na WhatsApp', tryText: 'Wystarczy napisać: odpowie nasz własny agent AI – dokładnie tak, jak Twój agent będzie odpowiadał klientom. Możesz zadać pytanie lub poprosić o oddzwonienie.', startersIntro: 'Wybierz temat: rozmowa otworzy się w WhatsAppie, a nasz agent AI odpowie od razu.', starters: [{ label: 'Poznaj usługę', text: 'Dzień dobry, poznaję PermanenceAI i chcę wiedzieć, jak to działa w mojej firmie.' }, { label: 'Wybór pakietu', text: 'Dzień dobry, proszę o pomoc w wyborze odpowiedniego pakietu.' }, { label: 'Test lub demo', text: 'Dzień dobry, chcę przetestować agenta albo zobaczyć demo.' }, { label: 'Jestem klientem', text: 'Dzień dobry, jestem już klientem i potrzebuję pomocy.' }] },
};

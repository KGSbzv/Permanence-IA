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
  trialLine: (days: number, minutes: number) => `${days} ${daysWord(days)} bezpłatnego okresu próbnego — ${minutes} ${minutesWord(minutes)} w cenie — ceny netto — bez zobowiązań`,
  trialBadges: (days: number, minutes: number) => [`${days} ${daysWord(days)} za darmo`, `${minutes} ${minutesWord(minutes)} w cenie`, 'W okresie próbnym nic nie jest pobierane', 'Bez zobowiązań'],
  growthLines: ['Dokupuj minuty w dowolnym momencie', 'Przejdź na wyższy pakiet, gdy liczba połączeń rośnie'],
  priceNote: (numberFrom: string) => `Ceny w dolarach amerykańskich (USD), netto — lokalne podatki doliczane, jeśli mają zastosowanie. Zakup dedykowanego numeru od ${numberFrom} netto miesięcznie, zależnie od kraju.`,
  skipToContent: 'Przejdź do treści',
  languageLabel: 'Język',
  rechargeFreeAmount: 'Kwotę wybierasz sam: wpisz ją w panelu klienta (Add credits). Powyższe kwoty to przykłady.',
};

// FAQ ogólne i FAQ cenowe.
import type { QA } from '../fr/faq';

export const FAQ_GENERAL: QA[] = [
  { q: 'Jak działa asystent głosowy AI?', a: 'Konfigurujesz agenta głosowego, podając informacje o firmie, zasady i ton rozmowy. Agent odbiera połączenia przychodzące, wykonuje dozwolone połączenia wychodzące, kwalifikuje zgłoszenia, rezerwuje wizyty i przekazuje Ci podsumowanie każdej rozmowy.' },
  { q: 'Ile trwa uruchomienie?', a: 'Pierwszy agent jest gotowy w kilka minut na podstawie Twoich informacji. Pełna konfiguracja (kalendarz, numery, przekierowania) zajmuje zwykle jeden–dwa dni, z naszym wsparciem.' },
  { q: 'Czy potrzebna jest wiedza techniczna?', a: 'Nie. Opisujesz swoją działalność, asystent promptów prowadzi Cię krok po kroku, a my pomagamy w kwestii telefonii i integracji.' },
  { q: 'Co się dzieje, gdy agent nie zna odpowiedzi?', a: 'Niczego nie wymyśla: zapisuje zgłoszenie, proponuje oddzwonienie lub przekazuje rozmowę Twojemu zespołowi, zgodnie z ustalonymi przez Ciebie zasadami.' },
  { q: 'Czy agent może obsługiwać kilka połączeń jednocześnie?', a: 'Tak. Kilka połączeń jest obsługiwanych równolegle na tej samej linii: Twoi klienci nie czekają.' },
  { q: 'Czym to się różni od poczty głosowej lub wirtualnej centrali telefonicznej?', a: 'Poczta głosowa nagrywa, centrala przekierowuje. Asystent telefoniczny AI rozumie zgłoszenie, zadaje potrzebne pytania, działa (wizyta, oddzwonienie, odpowiedź) i przekazuje Ci gotową do wykorzystania kartę zgłoszenia.' },
  { q: 'Czy mogę korzystać z obecnego systemu telefonicznego?', a: 'Tak. Możesz przekierować obecną linię do agenta, podłączyć centralę lub operatora przez SIP albo zaimportować numery z Twilio i Telnyx.' },
  { q: 'Czy mogę podłączyć kalendarz?', a: 'Tak: Kalendarz Google, Outlook, Cal.com i Calendly. Przy umawianiu wizyt przez telefon agent proponuje wolne terminy i od razu je rezerwuje.' },
  { q: 'Czy mogę edytować prompty?', a: 'Tak. Edytor promptów pozwala ustawić cel, ton, pytania i ograniczenia agenta, krok po kroku, bez wiedzy technicznej.' },
  { q: 'Czy mogę tworzyć scenariusze bez kodowania?', a: 'Tak, w flow builderze od pakietu Asystent: łączysz wyzwalacze i akcje metodą „przeciągnij i upuść”, z dostępem do ponad 300 narzędzi.' },
  { q: 'Czy mogę korzystać z WhatsApp i Instagrama?', a: 'Tak, we wszystkich pakietach: SMS, WhatsApp, Messenger i Instagram, ze wspólną historią rozmów. Wiadomości są opłacane kredytami na wiadomości; automatyczne ponowne kontakty wymagają pakietu Asystent.' },
  { q: 'Czy zapewniacie numery telefonów?', a: 'Tak, opcjonalnie: dedykowany numer kupuje się w panelu klienta i opłaca co miesiąc, oprócz pakietu (od 5,99 $ netto miesięcznie, zależnie od kraju; dokładna cena jest wyświetlana przed zakupem). Kraje dostępne przy zakupie: Stany Zjednoczone, Kanada, Wielka Brytania, Australia, Włochy, Holandia, Polska, Dania, Finlandia, Rumunia, Izrael, Republika Południowej Afryki. Dla numeru z innego kraju lub aby zachować obecny numer: przekierowanie połączeń, import z Twilio lub Telnyx albo połączenie SIP.' },
  { q: 'Czy mogę korzystać z SIP?', a: 'Tak, we wszystkich pakietach. Pomożemy Ci podłączyć trunk SIP lub centralę.' },
  { q: 'Jak wgrywacie informacje o mojej firmie?', a: 'Dodajesz dokumenty PDF, strony swojej witryny lub procedury do bazy wiedzy. Agent korzysta z nich w trakcie rozmowy.' },
  { q: 'Czy to jest zgodne z RODO?', a: 'Platforma zapewnia potrzebne narzędzia: zgody, listę wykluczeń, konfigurowalny okres przechowywania, usuwanie danych i kontrolę dostępu. Konfigurację i klauzule informacyjne trzeba dostosować do Twojej działalności; pomagamy w tym.' },
  { q: 'Jak działa bezpłatny okres próbny?', a: 'Zakładasz konto i wybierasz pakiet do przetestowania: pierwsze 14 dni jest bezpłatne, z 30 minutami połączeń w cenie. Przy aktywacji wymagana jest karta, ale w okresie próbnym nic nie jest pobierane. Anuluj przed upływem 14 dni, a nic nie zapłacisz.' },
  { q: 'Czy panel klienta jest po polsku?', a: 'Interfejs panelu klienta jest po angielsku. Wbudowana asystentka pomocy odpowiada w Twoim języku (także po polsku), na piśmie lub głosowo, a strona Pomocy tłumaczy każde menu i krok po kroku opisuje typowe zadania.' },
  { q: 'Kto oddzwania, gdy zostawię numer?', a: 'Nasza asystentka głosowa AI oddzwania w godzinach pracy, aby poznać Twoje potrzeby i pokazać demonstrację; jeśli chcesz, rozmowę przejmuje doradca. W każdej chwili możesz poprosić, abyśmy więcej nie dzwonili.' },
  { q: 'Czy agent przedstawia się jako AI?', a: 'Tak. Agent jest uczciwie przedstawiany jako asystent AI i może przekazać rozmowę człowiekowi, jeśli to przewidziałeś.' },
];

export const FAQ_PRICING: QA[] = [
  { q: 'Co się dzieje po wykorzystaniu 30 minut próbnych?', a: '30 minut to limit okresu próbnego: po jego wyczerpaniu połączenia są wstrzymane do końca okresu próbnego lub do rozpoczęcia subskrypcji. Po 14 dniach wybrany pakiet zostaje uruchomiony, chyba że anulujesz go w panelu klienta.' },
  { q: 'Czy ceny są podane netto?', a: 'Tak, wszystkie ceny są podane netto (bez VAT). Lokalne podatki są doliczane, jeśli mają zastosowanie.' },
  { q: 'Co się dzieje, gdy przekroczę limit minut?', a: 'W każdej chwili możesz dokupić minuty doładowaniem, aby przetrwać intensywniejszy miesiąc. Jeśli regularnie przekraczasz limit, wyższy pakiet wychodzi taniej za minutę: poinformujemy Cię o tym.' },
  { q: 'Czy numer telefonu jest wliczony w pakiet?', a: 'Nie. Pakiet obejmuje minuty i funkcje; dedykowany numer to opcja płatna co miesiąc, od 5,99 $ netto zależnie od kraju, w cenie wyświetlanej przed zakupem. Możesz też korzystać z obecnego numeru bez opłat z naszej strony: przekierowanie połączeń (Twój operator może naliczać opłatę za przekierowanie na numer zagraniczny), import z Twilio lub Telnyx albo SIP.' },
  { q: 'Czy mogę używać własnego numeru?', a: 'Tak, we wszystkich pakietach: przekierowanie połączeń, import z Twilio lub Telnyx albo połączenie SIP.' },
  { q: 'Czy macie demo na żywo?', a: 'Tak. Możesz porozmawiać z agentem w przeglądarce lub poprosić o oddzwonienie z demonstracją.' },
  { q: 'Dlaczego doładowanie kosztuje więcej za minutę niż pakiet?', a: 'Doładowanie służy jako rozwiązanie doraźne. Przy regularnym wolumenie pakiet pozostaje najtańszy: im większy pakiet, tym niższa cena za minutę.' },
  { q: 'Jak wygląda rozliczenie?', a: 'Subskrypcja jest pobierana co miesiąc z Twojej karty, w dniu odnowienia, a faktura jest dostępna w panelu klienta (Billing info). Doładowania minut są rozliczane w chwili zakupu. Podatki są naliczane automatycznie w zależności od kraju i statusu.' },
  { q: 'Jak anulować subskrypcję?', a: 'W panelu klienta (Billing info), w dowolnym momencie i bez opłat. W okresie próbnym anulowanie oznacza, że nic nie zostanie pobrane. Po okresie próbnym subskrypcja pozostaje aktywna do końca opłaconego okresu, a potem wygasa.' },
  { q: 'Czy mogę zmienić pakiet?', a: 'Tak, w dowolnym momencie i bez zobowiązań. Przejdź na wyższy pakiet, gdy rośnie liczba połączeń; zmiana jest wyświetlana przed potwierdzeniem.' },
  { q: 'Co się dzieje, gdy skończą mi się minuty?', a: 'Minuty ponad limit pakietu są opłacane z Twoich środków. Bez środków połączenia są wstrzymane do czasu doładowania lub odnowienia pakietu w kolejnym miesiącu. Gdy saldo się kończy, otrzymujesz alert e-mailem; możesz też włączyć automatyczne doładowanie.' },
];

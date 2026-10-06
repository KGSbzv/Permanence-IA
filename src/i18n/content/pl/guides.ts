// Praktyczne przewodniki po panelu klienta (interfejs po angielsku): jeden przewodnik na zadanie, publikowany pod /aide/guides/<slug>.
// Angielskie etykiety interfejsu pozostają w cudzysłowie, wyjaśnienie jest w języku czytelnika.
// Zmienne podstawiane przy wyświetlaniu: {brand} (marka rynku), {numberFrom} (cena wejściowa dedykowanego numeru).
// Te same slugi, kategorie i struktura we wszystkich językach (typowanie `typeof` w tłumaczeniach).

import type { Guide, GuideCategory, GUIDES_UI as FR_UI } from '../fr/guides';

export const GUIDES_UI: typeof FR_UI = {
  categories: {
    start: 'Pierwsze kroki',
    assistant: 'Konfiguracja agenta',
    tools: 'Wiedza, kalendarz i narzędzia',
    phone: 'Numery i telefonia',
    channels: 'Strona WWW i komunikatory',
    outbound: 'Kampanie i kontakty',
    results: 'Śledzenie połączeń i automatyzacje',
    billing: 'Minuty i rozliczenia',
  } as Record<GuideCategory, string>,
  indexTitle: 'Przewodniki krok po kroku',
  indexIntro: 'Jeden przewodnik na zadanie, z dokładnymi etykietami interfejsu (po angielsku) i ich objaśnieniem po polsku.',
  breadcrumb: 'Przewodniki',
  meta: {
    title: (title: string, brand: string) => `${title} — przewodnik ${brand}`,
  },
  eyebrow: (category: string) => `Przewodnik · ${category}`,
  planLabel: 'Dostępność',
  tipLabel: 'Wskazówka',
  relatedTitle: 'Powiązane przewodniki',
  allGuides: 'Wszystkie przewodniki',
  openSpace: 'Otwórz panel klienta',
  helpBefore: 'Potrzebujesz pomocy? W panelu klienta asystentka pomocy (dymek w prawym dolnym rogu) odpowiada w Twoim języku. Możesz też napisać na adres ',
  helpAfter: '.',
};

export const GUIDES: Guide[] = [
  // ---------- Pierwsze kroki ----------
  {
    slug: 'agent-vocal-ia',
    category: 'start',
    title: 'Czym jest agent głosowy AI?',
    summary: 'Rola agenta, jego elementy i to, co może dla Ciebie zrobić przy połączeniach przychodzących i wychodzących.',
    sections: [
      {
        title: 'Zasada działania',
        text: 'Agent (w panelu {brand} nazywany „Assistant”) to sztuczna inteligencja, którą konfigurujesz tak, aby rozmawiała przez telefon z Twoimi klientami lub potencjalnymi klientami: gdy dzwonią do Ciebie (połączenie przychodzące, „Receive phone calls”) lub gdy to agent dzwoni do nich (połączenie wychodzące, „Make phone calls”).',
      },
      {
        title: 'Co robi dla Ciebie',
        list: [
          'Odpowiada na częste pytania, przyjmuje wiadomości i umawia wizyty, 24 godziny na dobę.',
          'Kwalifikuje zgłoszenie i w razie potrzeby przekazuje połączenie Twojemu zespołowi.',
          'Obsługuje kilka połączeń jednocześnie (liczba połączeń równoczesnych zależy od pakietu).',
        ],
      },
      {
        title: 'Z czego się składa',
        list: [
          'Instrukcje („System prompt”): rola, ton i zasady działania agenta.',
          'Powitanie („Initial message”): pierwsze wypowiadane zdanie.',
          'Głos („Voice”): głos z biblioteki lub Twój sklonowany głos.',
          'Narzędzia („Tools”): przekazanie połączenia, zakończenie rozmowy, umawianie wizyt, narzędzia na miarę.',
          'Baza wiedzy („Knowledge base”): Twoje dokumenty i strony WWW.',
        ],
      },
    ],
    related: ['creer-un-agent', 'consignes-system-prompt', 'outils-de-l-agent'],
  },
  {
    slug: 'creer-un-agent',
    category: 'start',
    title: 'Tworzenie i edycja agenta',
    summary: 'Utwórz pierwszego agenta w kilka minut, a potem zmieniaj go w dowolnym momencie.',
    plan: 'Liczba agentów zależy od pakietu (menu „Limits”).',
    sections: [
      {
        title: 'Utwórz agenta',
        steps: [
          'Zaloguj się na app.permanenceia.com i otwórz menu „Assistants”, a następnie „Create”.',
          'Wybierz typ: „Receive phone calls”, aby odbierać połączenia, lub „Make phone calls”, aby dzwonić (kampanie, oddzwanianie).',
          'Nadaj nazwę wewnętrzną (np. „Recepcja gabinetu”) i sprawdź strefę czasową.',
          'Wybierz język, a następnie głos („Voice & speech”) i odsłuchaj go.',
          'Napisz instrukcje („Brain & prompt”) i zdanie powitalne („Greeting”).',
          'Kliknij „Create assistant”.',
        ],
      },
      {
        title: 'Dodaj potrzebne narzędzia',
        text: 'W sekcji „Tools & actions” dodaj to, czego agent potrzebuje: przekazanie połączenia, zakończenie rozmowy, umawianie wizyt, narzędzia na miarę.',
      },
      {
        title: 'Podłącz i przetestuj',
        list: [
          'Agent przychodzący: przypisz mu numer (sekcja „General”, pole „Phone number”).',
          'Agent wychodzący: przypisz go do kampanii lub przetestuj, prosząc, by do Ciebie zadzwonił.',
          'W każdym przypadku przetestuj go przed uruchomieniem.',
        ],
      },
      {
        title: 'Edycja agenta',
        steps: [
          'Menu „Assistants”, kliknij nazwę agenta.',
          'Zmień instrukcje, głos lub narzędzia.',
          'Kliknij „Save”: kolejne połączenia korzystają z nowej wersji.',
        ],
        tip: 'Po każdej zmianie wykonaj połączenie testowe, aby sprawdzić zachowanie agenta.',
      },
    ],
    related: ['tester-son-agent', 'consignes-system-prompt', 'acheter-un-numero'],
  },
  {
    slug: 'tester-son-agent',
    category: 'start',
    title: 'Testowanie agenta (czat, przeglądarka, telefon)',
    summary: 'Trzy sposoby testowania agenta przed uruchomieniem i kiedy korzystać z każdego z nich.',
    sections: [
      {
        title: '1. Czat testowy: do sprawdzania instrukcji',
        text: 'Najszybszy sposób na sprawdzenie logiki rozmowy, bez głosu.',
        steps: [
          'Otwórz agenta i kliknij „Test assistant” (ikona dymka).',
          'Pisz tak, jak pisałby klient: agent odpowiada z tymi samymi instrukcjami i narzędziami co przez telefon.',
          'Sprawdź, czy rozumie prośby, zbiera właściwe informacje i korzysta ze swoich narzędzi.',
        ],
        tip: 'Każda sesja testowa jest zapisywana w „Inbox” z oznaczeniem „Test”, co ułatwia ponowne przejrzenie rozmowy.',
      },
      {
        title: '2. Rozmowa w przeglądarce: do sprawdzania głosu',
        steps: [
          'Kliknij „Speak with your assistant” i zezwól na dostęp do mikrofonu.',
          'Porozmawiaj z agentem: sprawdź głos, tempo i reakcję na przerywanie.',
        ],
        text: 'W tym trybie przekazywanie połączenia nie działa.',
      },
      {
        title: '3. Prawdziwe połączenie telefoniczne: ostateczna weryfikacja',
        list: [
          'Agent wychodzący: kliknij „Speak to your assistant”, wybierz połączenie telefoniczne i wpisz swój numer: agent od razu do Ciebie zadzwoni.',
          'Agent przychodzący: po prostu zadzwoń na numer przypisany do agenta.',
          'To jedyny test, który sprawdza wszystkie narzędzia, w tym przekazywanie połączenia.',
        ],
      },
      {
        title: 'Dobrze wiedzieć',
        list: [
          'Testy głosowe zużywają minuty tak jak prawdziwe połączenia; czat testowy zużywa niewielką ilość środków.',
          'Zapisz numer agenta w kontaktach, aby łatwo do niego dzwonić.',
        ],
      },
    ],
    related: ['creer-un-agent', 'historique-des-appels', 'minutes-et-facturation'],
  },

  // ---------- Konfiguracja agenta ----------
  {
    slug: 'consignes-system-prompt',
    category: 'assistant',
    title: 'Pisanie instrukcji agenta (system prompt)',
    summary: 'Uporządkuj instrukcje, które określają rolę, ton i zasady działania agenta.',
    sections: [
      {
        title: 'Do czego służą instrukcje',
        text: 'Instrukcje („System prompt”, sekcja „Brain & prompt”) to mózg agenta: jego tożsamość, wiedza, sposób mówienia i to, czego nigdy nie wolno mu robić. Można je zmieniać na trzy sposoby: za pomocą asystenta pisania („AI Prompt Editor”), edytora wizualnego („Flow Builder”) lub bezpośrednio edytując tekst.',
      },
      {
        title: 'Zacznij od szablonu',
        steps: [
          'W ustawieniach agenta, w sekcji instrukcji, kliknij „Templates”.',
          'Wybierz szablon najbliższy Twojemu zastosowaniu (recepcja, umawianie wizyt, wsparcie, kwalifikacja…).',
          'Dostosuj go do swojej działalności.',
        ],
      },
      {
        title: '5 elementów dobrych instrukcji',
        list: [
          'Rola i tożsamość: „Jesteś recepcjonistką gabinetu X, specjalizującego się w…”',
          'Styl: ton, forma grzecznościowa (Pan/Pani), krótkie zdania, bez żargonu.',
          'Kluczowe informacje: usługi, godziny otwarcia, ceny, adres.',
          'Zasady: co trzeba sprawdzić, kiedy przekazać połączenie, czego nigdy nie obiecywać.',
          'Scenariusze: jak postępować w częstych sytuacjach (umawianie wizyty, reklamacja, pilna sprawa).',
        ],
      },
      {
        title: 'Język instrukcji',
        text: 'Instrukcje możesz pisać w dowolnym języku: język, w którym mówi agent, ustawia się osobno w sekcji „Voice & speech”.',
      },
      {
        title: 'Częste błędy',
        list: [
          'Zbyt ogólnikowo: „Bądź pomocny” to za mało.',
          'Zbyt sztywno: rozpisanie każdej kwestii sprawia, że rozmowa brzmi sztucznie.',
          'Zbyt długo: szczegółowe informacje należy umieścić w bazie wiedzy.',
          'Pominięte sytuacje: określ, co robić w razie pilnej sprawy, zdenerwowania rozmówcy lub pytania nie na temat.',
        ],
        tip: 'Instrukcje ewoluują: regularnie czytaj transkrypcje połączeń i dopisuj przypadki, które zostały źle obsłużone.',
      },
    ],
    related: ['editeur-de-prompt-ia', 'flow-builder', 'base-de-connaissances'],
  },
  {
    slug: 'editeur-de-prompt-ia',
    category: 'assistant',
    title: 'Korzystanie z asystenta pisania (AI Prompt Editor)',
    summary: 'Zmieniaj instrukcje agenta, po prostu opisując, co chcesz zmienić.',
    plan: 'Wszystkie pakiety.',
    sections: [
      {
        title: 'Otwórz edytor',
        steps: [
          'Menu „Assistants”, otwórz swojego agenta (musi być zapisany co najmniej raz).',
          'W sekcji instrukcji, na karcie „AI Prompt Editor”, kliknij „Launch AI Prompt Editor”.',
          'Wybierz, czy kontynuować z obecnymi instrukcjami, zacząć od zera, czy od szablonu.',
        ],
      },
      {
        title: 'Poproś o zmianę',
        text: 'Wpisz prośbę w czacie po lewej stronie, zwykłym językiem. Przykłady:',
        list: [
          '„Nadaj rozmowie cieplejszy ton.”',
          '„Dodaj naszą politykę zwrotów: 30 dni bez podania przyczyny.”',
          '„Dodaj instrukcje dotyczące obsługi niezadowolonego klienta.”',
          'Skróty „Make it more concise”, „Improve clarity”… wykonują typowe poprawki.',
        ],
      },
      {
        title: 'Przejrzyj i zatwierdź',
        list: [
          'Proponowane zmiany są oznaczone kolorem: zielonym dodane fragmenty, czerwonym usunięte.',
          'Zatwierdź lub odrzuć każdą zmianę („Accept” / „Reject”) albo wszystkie naraz („Accept All” / „Reject All”).',
          'Kliknij „Save”, aby zapisać.',
        ],
        tip: 'Jedna zmiana naraz daje lepsze wyniki. Zawsze czytaj przed zatwierdzeniem: znasz swoją działalność lepiej niż AI.',
      },
      {
        title: 'Zmienne i dane po rozmowie',
        list: [
          'Karta „Variables”: dodaj pola, np. {customer_name}, aby personalizować każde połączenie.',
          'Karta „Post-Call”: określ informacje do wyodrębnienia z każdej rozmowy (umówiona wizyta, poziom zainteresowania…). Możesz zapytać AI: „Jakie dane powinienem zbierać?”',
        ],
      },
    ],
    related: ['consignes-system-prompt', 'donnees-apres-appel', 'tester-son-agent'],
  },
  {
    slug: 'message-d-accueil',
    category: 'assistant',
    title: 'Dopracowanie powitania',
    summary: 'Napisz krótkie i naturalne pierwsze zdanie albo użyj nagrania audio.',
    sections: [
      {
        title: 'Powitanie tekstowe',
        text: 'To pierwsze zdanie wypowiadane przez agenta („Greeting” lub „Initial message”). Jest odczytywane dokładnie tak, jak zostało napisane.',
        list: [
          'Celuj w 5–10 sekund: powitanie, nazwa firmy, pytanie.',
          'Używaj interpunkcji do oznaczania pauz („…” oznacza chwilę przerwy).',
          'Zapisuj liczby tak, jak mają być wymawiane, i nie pomijaj polskich znaków.',
          'Przykład: „Dzień dobry, gabinet Nowak, mówi Anna… W czym mogę pomóc?”',
        ],
      },
      {
        title: 'Powitanie nagrane',
        text: 'Aby uzyskać w pełni ludzkie brzmienie, możesz przesłać plik audio odtwarzany po odebraniu połączenia.',
        steps: [
          'Nagraj powitanie w cichym miejscu (krócej niż 10 sekund).',
          'Prześlij plik w ustawieniach agenta i włącz jego odtwarzanie.',
          'Aby przejście było naturalne, sklonuj ten sam głos na resztę rozmowy.',
        ],
      },
      {
        title: 'Sprawdź',
        text: 'Zadzwoń do agenta i posłuchaj: wymowa, pauzy, głośność i płynne przejście do rozmowy. Jeśli agent mówi w kilku językach, przygotuj powitanie dla każdego z nich.',
      },
    ],
    related: ['choisir-la-voix', 'consignes-system-prompt', 'tester-son-agent'],
  },
  {
    slug: 'choisir-la-voix',
    category: 'assistant',
    title: 'Wybór lub klonowanie głosu',
    summary: 'Wybierz głos z biblioteki, zaimportuj go lub sklonuj własny.',
    plan: 'Głosy z biblioteki: wszystkie pakiety. Głosy sklonowane: od pakietu Asystent.',
    sections: [
      {
        title: 'Wybierz głos',
        steps: [
          'Otwórz agenta, sekcja „Voice & speech”.',
          'Wybierz język, a następnie dostawcę głosu („TTS Provider”).',
          'Przejrzyj głosy (męskie, żeńskie, akcenty) i odsłuchaj je przed zatwierdzeniem.',
        ],
      },
      {
        title: 'Importuj głos z biblioteki dostawcy',
        steps: [
          'Kliknij „Import voice” obok listy głosów.',
          'Wybierz dostawcę, znajdź publiczny głos w jego bibliotece i skopiuj jego link lub identyfikator.',
          'Wklej go i kliknij „Import”: głos pojawi się na liście, gdy będzie gotowy.',
        ],
      },
      {
        title: 'Sklonuj głos',
        steps: [
          'Kliknij „Clone voice”.',
          'Wybierz dostawcę, język i nazwę.',
          'Nagraj lub prześlij próbkę: tylko jedna osoba, bez szumów w tle (co najmniej 10 sekund, najlepiej minuta lub dłużej).',
          'Po przetworzeniu wybierz nowy głos.',
        ],
        tip: 'Klonuj wyłącznie własny głos lub głos osoby, która wyraziła na to pisemną zgodę.',
      },
    ],
    related: ['message-d-accueil', 'tester-son-agent', 'creer-un-agent'],
  },
  {
    slug: 'flow-builder',
    category: 'assistant',
    title: 'Projektowanie scenariusza w Flow Builder',
    summary: 'Rozrysuj rozmowę z połączonych bloków, z kilkoma ścieżkami zależnie od odpowiedzi.',
    plan: 'Od pakietu Asystent.',
    sections: [
      {
        title: 'Kiedy z niego korzystać',
        text: 'Flow Builder sprawdza się przy uporządkowanym skrypcie z wieloma rozgałęzieniami (kwalifikacja, wieloetapowe umawianie wizyt). Przy prostej, swobodnej rozmowie wystarczą instrukcje tekstowe.',
      },
      {
        title: 'Otwórz Flow Builder',
        steps: [
          'Otwórz agenta, sekcja instrukcji, karta „Flow Builder”.',
          'Kliknij „Launch Flow Builder”.',
          'Zacznij od istniejącego scenariusza, pustej strony lub szablonu.',
        ],
      },
      {
        title: '5 typów bloków',
        list: [
          '„Start”: początek połączenia i zdanie powitalne (tylko jeden na scenariusz).',
          '„Speak”: zdanie wypowiadane słowo w słowo.',
          '„Prompt”: instrukcja, którą AI formułuje własnymi słowami zależnie od kontekstu.',
          '„Action”: przekazanie połączenia, umówienie wizyty lub uruchomienie narzędzia na miarę.',
          '„End”: rozłączenie, przekazanie połączenia lub przekazanie rozmowy innemu agentowi.',
        ],
      },
      {
        title: 'Tworzenie rozgałęzień',
        steps: [
          'Dodaj blok za pomocą „+ Add Node”.',
          'W bloku „Speak” lub „Prompt” dodaj wyniki („Add Outcome”): „Zainteresowany”, „Niezainteresowany”, „Oddzwonić później”…',
          'Połącz każdy wynik z kolejnym blokiem, przeciągając linię z jego punktu wyjścia.',
          'Kliknij „Save”.',
        ],
        tip: 'Regularnie eksportuj scenariusz („Export JSON”), aby mieć jego kopię. Przetestuj każdą ścieżkę przed uruchomieniem.',
      },
    ],
    related: ['consignes-system-prompt', 'editeur-de-prompt-ia', 'tester-son-agent'],
  },

  // ---------- Wiedza, kalendarz i narzędzia ----------
  {
    slug: 'base-de-connaissances',
    category: 'tools',
    title: 'Tworzenie bazy wiedzy',
    summary: 'Udostępnij agentowi swoje dokumenty i strony WWW, aby odpowiadał na podstawie Twoich informacji.',
    plan: 'Liczba baz zależy od pakietu (menu „Limits”).',
    sections: [
      {
        title: 'Utwórz bazę',
        steps: [
          'Menu „Knowledge base”, a następnie utwórz bazę (nazwa i opis).',
          'Dodaj treści: pliki PDF, Word (.docx) lub tekstowe (.txt) albo adresy stron Twojej witryny.',
          'Poczekaj na status „Active” („Processing” w trakcie analizy).',
          'W ustawieniach agenta, w sekcji „Knowledgebase”, wybierz bazę i zapisz.',
        ],
      },
      {
        title: 'Wybierz tryb korzystania z bazy',
        list: [
          '„Function Call” (zalecany): agent sięga do bazy tylko wtedy, gdy jest to potrzebne. Szybszy.',
          '„Prompt Injection”: baza jest przeszukiwana po każdym zdaniu klienta. Dokładniejszy, ale wolniejszy, odpowiedni do wsparcia klienta.',
        ],
      },
      {
        title: 'Dobre praktyki',
        list: [
          'Krótkie treści z czytelnymi nagłówkami i listami.',
          'Publiczne strony WWW: niektóre zabezpieczone witryny blokują odczyt (status „Failed”). W takim przypadku wyeksportuj treść do PDF i prześlij plik.',
          '10 najczęstszych pytań można też umieścić bezpośrednio w instrukcjach.',
          'Czytaj transkrypcje, aby sprawdzić, czy agent poprawnie przekazuje Twoje informacje.',
        ],
      },
    ],
    related: ['consignes-system-prompt', 'outils-de-l-agent', 'historique-des-appels'],
  },
  {
    slug: 'rendez-vous-cal-com',
    category: 'tools',
    title: 'Umawianie wizyt przez Cal.com',
    summary: 'Połącz Cal.com, aby agent sprawdzał Twoją dostępność i rezerwował termin w trakcie rozmowy.',
    plan: 'Wszystkie pakiety.',
    sections: [
      {
        title: 'Pobierz klucz Cal.com',
        steps: [
          'W Cal.com: „Settings” → „Developer” → „API Keys”.',
          'Utwórz klucz i skopiuj go (zaczyna się od cal_live_).',
        ],
      },
      {
        title: 'Połącz Cal.com z agentem',
        steps: [
          'Otwórz agenta, sekcja „Tools & actions”, a następnie „Appointment Scheduling”.',
          'Wybierz „Cal.com” i region swojego konta (domyślnie US, EU, jeśli konto jest europejskie).',
          'Wklej klucz i wybierz typ wizyty (indywidualna lub zespołowa).',
          'Kliknij „Sync Event”: pola rezerwacji (imię i nazwisko, e-mail, telefon, pola własne) zostaną skonfigurowane automatycznie.',
          'Zapisz agenta.',
        ],
      },
      {
        title: 'Aby zaproszenie zostało wysłane',
        list: [
          'Dodaj do agenta zmienną e-mail i uzupełnij ją dla swoich kontaktów albo poproś agenta o zebranie adresu.',
          'Kilka typów wizyt? Kliknij „+” obok „Appointment Scheduling”, aby dodać kolejne.',
          'Jeśli zmienisz pola w Cal.com, ponownie kliknij „Sync Event”. W razie błędu „Troubleshoot” resetuje pola.',
        ],
        tip: 'Kalendarz Google lub Outlook można połączyć z Cal.com: agent widzi wtedy Twoją rzeczywistą dostępność.',
      },
    ],
    related: ['rendez-vous-calendly', 'outils-de-l-agent', 'tester-son-agent'],
  },
  {
    slug: 'rendez-vous-calendly',
    category: 'tools',
    title: 'Umawianie wizyt przez Calendly',
    summary: 'Połącz Calendly, aby agent sprawdzał wolne terminy i rezerwował je bezpośrednio w trakcie rozmowy.',
    plan: 'Wszystkie pakiety.',
    sections: [
      {
        title: 'Połącz Calendly',
        steps: [
          'Otwórz agenta, sekcja „Tools & actions”, a następnie „Appointment Scheduling”.',
          'Wybierz „Calendly”, następnie „Connect to Calendly” i zezwól na dostęp.',
          'Kliknij „Load Events” i wybierz typ wizyty.',
          'Zapisz agenta.',
        ],
        tip: 'W razie problemów z połączeniem spróbuj ponownie w oknie prywatnym przeglądarki.',
      },
      {
        title: 'Ustaw miejsce wizyty w Calendly',
        text: 'Agent nie może wygenerować linku do wideokonferencji. W Calendly otwórz typ wizyty i ustaw miejsce („Location”) na „Custom” (zalecane) lub „Phone Call”. Wizyta wyłącznie online (Meet, Zoom, Teams) uniemożliwi rezerwację: dodaj co najmniej jedną z tych opcji.',
      },
      {
        title: 'Kilka kalendarzy',
        text: 'Kliknij „+”, aby dodać inne typy wizyt, i opisz w „When to schedule”, kiedy korzystać z każdego z nich. Konto administratora organizacji w Calendly widzi także wizyty zespołowe.',
      },
    ],
    related: ['rendez-vous-cal-com', 'outils-de-l-agent', 'tester-son-agent'],
  },
  {
    slug: 'outils-de-l-agent',
    category: 'tools',
    title: 'Narzędzia agenta: przekazanie, rozłączenie, klawiatura',
    summary: 'Wbudowane akcje, które agent może uruchomić w trakcie rozmowy, i sposób ich konfiguracji.',
    sections: [
      {
        title: 'Gdzie je znaleźć',
        text: 'Otwórz agenta, sekcja „Tools & actions”. Każde narzędzie się włącza, a następnie uruchamia zgodnie z tym, co napiszesz w instrukcjach.',
      },
      {
        title: 'Narzędzia wbudowane',
        list: [
          'Zakończenie rozmowy („End call”): agent uprzejmie się rozłącza, np. gdy klient się żegna.',
          'Przekazanie połączenia („Call transfer”): agent przełącza rozmowę do człowieka lub na inny numer. Podaj numer i określ, kiedy przekazywać (pilna sprawa, prośba o rozmowę z konsultantem, klient gotowy do zakupu).',
          'Umawianie wizyt („Appointment Scheduling”): Cal.com lub Calendly, połączone z kalendarzem Google lub Outlook.',
          'Klawisze telefonu („DTMF”): agent wybiera cyfry, aby poruszać się po menu automatycznym lub wpisać numer wewnętrzny.',
        ],
      },
      {
        title: 'Więcej możliwości',
        list: [
          'Narzędzia na miarę odpytują Twoje oprogramowanie na bieżąco (stan magazynu, dane klienta…).',
          'Po rozmowie automatyzacje przesyłają wyniki do Twojego CRM, Google Sheets lub na e-mail.',
        ],
        tip: 'Narzędzia można łączyć: sprawdzić informację, umówić wizytę, a w razie potrzeby przekazać połączenie. Opisz tę kolejność w instrukcjach.',
      },
    ],
    related: ['outils-sur-mesure', 'rendez-vous-cal-com', 'automatisations'],
  },
  {
    slug: 'outils-sur-mesure',
    category: 'tools',
    title: 'Tworzenie narzędzia na miarę (w trakcie rozmowy)',
    summary: 'Pozwól agentowi odpytywać Twoje oprogramowanie na bieżąco: status zamówienia, weryfikacja klienta, dostępność.',
    plan: 'Liczba narzędzi zależy od pakietu (menu „Limits”).',
    sections: [
      {
        title: 'Utwórz narzędzie',
        steps: [
          'Menu „Mid call tools / MCP”, a następnie „Create Mid-Call Tool”.',
          'Nazwa: litery, cyfry i podkreślenia (np. check_order_status).',
          'Opis: kiedy i po co agent ma z niego korzystać.',
          'Typ „HTTP request”: podaj adres swojego API („Endpoint”), metodę (GET, POST…), maksymalny czas oczekiwania i nagłówki (np. klucz autoryzacyjny).',
        ],
      },
      {
        title: 'Określ informacje do zebrania',
        list: [
          'Dodaj parametry, o które agent zapyta klienta: nazwa, typ (tekst, liczba, liczba dziesiętna, tak/nie) i opis z oczekiwanym formatem („numer zamówienia w formacie ORD-12345”).',
          'Parametr może być częścią adresu: https://api.przyklad.pl/zamowienia/{order_id}.',
          'Pola stałe („Static fields”) są wysyłane przy każdym wywołaniu i AI ich nie zmienia.',
          'Zmienne automatyczne: {{customer_phone}} (numer klienta), {{current_date}}, {{current_time}}, {{assistant_name}}…',
        ],
      },
      {
        title: 'Przetestuj i podłącz',
        steps: [
          'Kliknij „Test tool”: zostaje wysłane prawdziwe zapytanie z przykładowymi danymi i widzisz odpowiedź.',
          'Przypisz narzędzie do agenta.',
          'W instrukcjach określ, kiedy z niego korzystać i jak wyjaśnić wynik klientowi.',
        ],
        tip: 'Typ „Automation Platform” automatycznie tworzy scenariusz automatyzacji połączony z narzędziem, co pozwala na wieloetapową logikę bez kodu (pakiet Asystent i wyższe).',
      },
    ],
    related: ['outils-de-l-agent', 'automatisations', 'consignes-system-prompt'],
  },

  // ---------- Numery i telefonia ----------
  {
    slug: 'acheter-un-numero',
    category: 'phone',
    title: 'Uzyskanie numeru i przypisanie go do agenta',
    summary: 'Kup dedykowany numer w panelu klienta lub zachowaj obecny, a następnie połącz go z agentem.',
    plan: 'Numery dedykowane od {numberFrom} miesięcznie, zależnie od kraju; liczba numerów w cenie zależy od pakietu.',
    sections: [
      {
        title: 'Kup numer',
        steps: [
          'Menu „Get new phone number”.',
          'Wybierz kraj i typ (lokalny, krajowy, bezpłatny, zależnie od dostępności): miesięczna cena jest wyświetlana przed zakupem.',
          'Potwierdź: numer pojawi się w „Your phone numbers”.',
        ],
        text: 'Nie ma numeru, którego szukasz? Skontaktuj się z nami: możemy zamówić go u operatora (dokumenty zależnie od kraju, zwykle 1–3 dni robocze).',
      },
      {
        title: 'Przypisz numer do agenta',
        steps: [
          'Menu „Assistants”, otwórz agenta, sekcja „General”.',
          'W polu „Phone number” wybierz numer.',
          'Kliknij „Save”.',
        ],
      },
      {
        title: 'Zachowaj obecny numer',
        list: [
          'Najprościej: włącz u swojego operatora przekierowanie połączeń na nowy numer.',
          'Masz Twilio lub Telnyx: zaimportuj swoje numery.',
          'Masz centralę lub operatora SIP: połącz go przez SIP (wszystkie pakiety).',
        ],
        tip: 'Po każdej zmianie zadzwoń na numer, aby sprawdzić, czy agent odbiera.',
      },
    ],
    related: ['importer-twilio-telnyx', 'connexion-sip', 'numero-presente'],
  },
  {
    slug: 'importer-twilio-telnyx',
    category: 'phone',
    title: 'Import numerów Twilio lub Telnyx',
    summary: 'Korzystaj ze swoich numerów Twilio lub Telnyx z agentem dzięki trunkowi SIP.',
    plan: 'Wszystkie pakiety.',
    sections: [
      {
        title: 'Zanim zaczniesz',
        text: 'W panelu klienta otwórz „Your phone numbers”, a następnie „Integrate SIP trunk”: formularz wyświetla adres SIP do odbioru połączeń, który należy podać u operatora. Pozostaw ten ekran otwarty.',
      },
      {
        title: 'Po stronie Twilio',
        steps: [
          'Konsola Twilio: „Elastic SIP Trunking” → „Create new SIP Trunk”.',
          '„Termination”: wpisz tylko nazwę (np. twojafirma); Twilio doda .pstn.twilio.com. Zanotuj pełny adres.',
          'W „Authentication” skonfiguruj dostęp (lista adresów IP lub dane logowania).',
          '„Origination”: dodaj adres SIP do odbioru połączeń wyświetlany w panelu klienta.',
          '„Numbers”: dodaj numery, z których chcesz korzystać.',
        ],
      },
      {
        title: 'Po stronie Telnyx',
        steps: [
          'Portal Telnyx: „Voice” → „SIP Trunking” → „Create SIP Connection”, typ „FQDN”.',
          'Dodaj adres SIP do odbioru połączeń wyświetlany w panelu klienta (port 5060) i ustaw go jako główny FQDN.',
          'Uwierzytelnianie połączeń wychodzących: „Credentials”, z loginem i hasłem, które należy zanotować.',
          'Przypisz numery i zezwól na kraje docelowe („Outbound Voice Profiles” → „Allowed Destinations”).',
        ],
      },
      {
        title: 'Zaimportuj numer do panelu klienta',
        steps: [
          '„Your phone numbers” → „Integrate SIP trunk”.',
          'Wpisz numer w formacie międzynarodowym, login i hasło.',
          'Adres SIP: zanotowany adres Twilio (twojafirma.pstn.twilio.com) lub sip.telnyx.com dla Telnyx.',
          'Wybierz typ autoryzacji i kraj, a następnie zapisz.',
          'Przypisz numer do agenta i przetestuj połączenie przychodzące oraz wychodzące.',
        ],
        tip: 'Trunk tworzy się tylko raz: każdy nowy numer dodaj do trunku, a następnie zaimportuj. Hasło: co najmniej 12 znaków, z wielkimi i małymi literami oraz cyframi.',
      },
    ],
    related: ['connexion-sip', 'acheter-un-numero', 'numero-presente'],
  },
  {
    slug: 'connexion-sip',
    category: 'phone',
    title: 'Podłączenie centrali lub operatora przez SIP',
    summary: 'Połącz swoją centralę telefoniczną (PBX) lub operatora VoIP, aby zachować swoje numery.',
    plan: 'Wszystkie pakiety.',
    sections: [
      {
        title: 'Dwa sposoby połączenia',
        list: [
          '„SIP Extension”: agent staje się numerem wewnętrznym Twojej centrali (np. 1011). Idealne do testów lub kierowania wybranych połączeń do AI.',
          '„Phone Number (DID)”: pełny numer jest połączony z agentem, zarówno dla połączeń przychodzących, jak i wychodzących.',
        ],
      },
      {
        title: 'Skonfiguruj połączenie',
        steps: [
          'Menu „Your phone numbers”, a następnie „Integrate SIP trunk”.',
          'Wybierz typ trunku i wpisz numer wewnętrzny lub numer telefonu, login i hasło otrzymane od operatora.',
          'Połączenia wychodzące: podaj adres serwera SIP (bez portu) i włącz stały adres IP tylko wtedy, gdy wymaga tego operator.',
          'Wybierz format numerów oczekiwany przez operatora: międzynarodowy z +, międzynarodowy bez + lub krajowy.',
          'Połączenia przychodzące: skieruj operatora na adres SIP do odbioru połączeń wyświetlany w formularzu, z uwierzytelnianiem przez dozwolone adresy IP lub login i hasło.',
          'Wybierz kraj trunku i zapisz.',
        ],
      },
      {
        title: 'Sprawdź',
        list: [
          'Zadzwoń na numer lub numer wewnętrzny: agent powinien odebrać.',
          'Wykonaj testowe połączenie wychodzące z poziomu agenta.',
          'Jeśli zmienisz hasło u operatora, zmień je również w panelu klienta.',
        ],
        tip: 'Zachowujesz kontrolę nad swoimi numerami: to Twoja centrala decyduje, które połączenia trafiają do agenta, a które zostają u Ciebie.',
      },
    ],
    related: ['importer-twilio-telnyx', 'acheter-un-numero', 'numero-presente'],
  },
  {
    slug: 'numero-presente',
    category: 'phone',
    title: 'Wybór numeru wyświetlanego przy połączeniach wychodzących',
    summary: 'Wyświetlaj numer dedykowany, własny zweryfikowany numer lub numer centrali SIP.',
    sections: [
      {
        title: 'Trzy możliwości',
        list: [
          'Numer dedykowany kupiony w panelu klienta: wybierz go w ustawieniach agenta („General” → „Phone number”). Nie wymaga weryfikacji i może także odbierać połączenia zwrotne.',
          'Twój obecny numer (stacjonarny lub komórkowy): zweryfikuj go kodem otrzymanym SMS-em lub w połączeniu głosowym. Wyświetla się Twoim kontaktom, ale połączenia przychodzące na ten numer nie trafiają do agenta. (Pakiety płatne.)',
          'Twoja centrala SIP: wyświetlany jest numer dozwolony przez Twojego operatora.',
        ],
      },
      {
        title: 'Zasady, których należy przestrzegać',
        list: [
          'Wyświetlaj wyłącznie numery, których jesteś właścicielem lub do których używania masz prawo.',
          'W niektórych krajach zabronione jest wyświetlanie numeru zagranicznego lub niezweryfikowanego.',
        ],
        tip: 'Przed dużą kampanią zadzwoń na własny telefon, aby sprawdzić wyświetlany numer.',
      },
    ],
    related: ['acheter-un-numero', 'campagnes-d-appels', 'connexion-sip'],
  },

  // ---------- Strona WWW i komunikatory ----------
  {
    slug: 'widget-site-web',
    category: 'channels',
    title: 'Instalacja agenta na stronie (widżet WWW)',
    summary: 'Dodaj do swojej strony przycisk czatu i rozmowy głosowej w barwach Twojej marki.',
    plan: 'Wszystkie pakiety.',
    sections: [
      {
        title: 'Skonfiguruj widżet',
        steps: [
          'Otwórz agenta i kliknij „Web widget”.',
          'Wybierz tryb: „Voice & Chat” (zalecany), „Chat Only” lub „Voice Only”.',
          'Ustaw położenie, kolor, rozmiar i automatyczne otwieranie.',
          'Dostosuj teksty przycisku („Button”) i nagłówka („Header & Modal”) oraz dodaj awatar (kwadratowy obraz, maksymalnie 512 KB).',
          'Opcjonalnie: formularz przed rozmową („Pre-Chat Form”), aby poprosić o imię, e-mail lub telefon. Każde pole zasila zmienną agenta.',
        ],
      },
      {
        title: 'Przetestuj i zainstaluj',
        steps: [
          'Przetestuj w podglądzie na żywo u góry strony („Reset Data” symuluje nowego odwiedzającego).',
          'Zapisz, a następnie skopiuj kod z sekcji „Embed Code”.',
          'Wklej go tuż przed znacznikiem </body> na swojej stronie lub przekaż go swojemu webmasterowi.',
        ],
        tip: 'Zawsze zapisuj przed skopiowaniem kodu: widżet pobiera ustawienia z panelu klienta. Rozmowa głosowa wymaga strony działającej w HTTPS.',
      },
      {
        title: 'Na co dzień',
        list: [
          'Wszystkie rozmowy z widżetu trafiają do „Inbox”.',
          '„Enable Widget” pozwala ukryć widżet bez usuwania kodu.',
          'Aby linki w czacie były klikalne, poproś w instrukcjach o zapisywanie ich w formacie [tekst](adres).',
        ],
      },
    ],
    related: ['historique-des-appels', 'whatsapp', 'consignes-system-prompt'],
  },
  {
    slug: 'whatsapp',
    category: 'channels',
    title: 'Połączenie WhatsApp z agentem',
    summary: 'Pozwól agentowi odpowiadać na WhatsAppie i wysyłaj szablony wiadomości zatwierdzone przez Metę.',
    plan: 'Wszystkie pakiety. Wiadomości są opłacane ze środków na wiadomości.',
    sections: [
      {
        title: 'Utwórz nadawcę WhatsApp',
        steps: [
          'Menu „Channels” → „WhatsApp”, a następnie utwórz nadawcę.',
          'Wybierz numer kupiony w panelu klienta (weryfikacja automatyczna) lub własny numer komórkowy (kod SMS-em lub w połączeniu głosowym). Ten numer nie może być już używany w WhatsAppie.',
          'Wpisz nazwę wyświetlaną klientom, a następnie postępuj zgodnie z oknem Mety („Login with Facebook”), tworząc nowe konto WhatsApp Business.',
        ],
        tip: 'Podczas weryfikacji kupionego numeru połączenia przychodzące na niego są przez kilka minut przechwytywane: nie uruchamiaj jej na numerze, który jest już w użyciu.',
      },
      {
        title: 'Połącz agenta',
        steps: [
          'Gdy nadawca ma status „Online”, edytuj go i wybierz agenta.',
          'Włącz „AI Enabled” i zapisz: agent odpowiada odtąd na wiadomości, transkrybuje wiadomości głosowe i może analizować obrazy.',
        ],
      },
      {
        title: 'Zasady WhatsAppa',
        list: [
          'Gdy klient do Ciebie napisze, możesz swobodnie odpowiadać przez 24 godziny.',
          'Aby napisać jako pierwszy lub ponownie odezwać się po 24 godzinach, potrzebujesz szablonu wiadomości („Template”) zatwierdzonego przez Metę: użytkowego, marketingowego lub uwierzytelniającego.',
          'Nowy nadawca jest ograniczony do około 250 rozmów dziennie; limit rośnie, jeśli Twoje wiadomości są dobrze odbierane (mało blokad i zgłoszeń).',
        ],
      },
    ],
    related: ['campagnes-d-appels', 'historique-des-appels', 'automatisations'],
  },

  // ---------- Kampanie i kontakty ----------
  {
    slug: 'campagnes-d-appels',
    category: 'outbound',
    title: 'Uruchomienie kampanii połączeń (lub wiadomości)',
    summary: 'Niech agent dzwoni do listy kontaktów, z ustalonymi godzinami, ponownymi próbami i celami.',
    plan: 'Od pakietu Asystent.',
    sections: [
      {
        title: 'Zanim zaczniesz',
        list: [
          'Połączenia: agent „Make phone calls” z numerem oraz dostępne minuty.',
          'WhatsApp: podłączony nadawca i zatwierdzony szablon. SMS: numer obsługujący SMS-y. Oba kanały korzystają ze środków na wiadomości.',
          'Kontakty, które wyraziły zgodę na kontakt.',
        ],
      },
      {
        title: 'Utwórz kampanię',
        steps: [
          'Menu „Campaigns”, utwórz kampanię: nazwa, kanał („Call”, „WhatsApp” lub „SMS”) i agent.',
          'Godziny: jeden lub kilka przedziałów dziennie (np. 9:00–12:00 i 14:00–18:00) oraz dozwolone dni.',
          'Ponowne próby: liczba prób (od 1 do 5) i odstęp między nimi; zdecyduj, czy połączenie zakończone na automatycznej sekretarce liczy się jako próba.',
          'Opcja „Retry until goal completed”: kampania ponawia połączenia, dopóki cel nie zostanie osiągnięty (pole tak/nie z danych po rozmowie, np. umówiona wizyta).',
          'Dodaj kontakty (ręcznie lub importując plik), a następnie kliknij „Start Campaign”.',
        ],
      },
      {
        title: 'Śledź i dostosowuj',
        list: [
          'Pulpit kampanii pokazuje połączenia w toku i zakończone, pozostałe kontakty oraz następne połączenie.',
          'Aby zmienić ustawienia: wstrzymaj kampanię, wprowadź zmiany i wznów ją. Nic nie zostanie utracone.',
          'Opcja awaryjna: po ostatniej próbie połączenia jednorazowo wysłać SMS lub szablon WhatsApp.',
        ],
        tip: 'Zacznij od 2–3 prób w godzinach pracy obowiązujących w kraju Twoich kontaktów i zawsze respektuj sprzeciwy (menu „Blacklist”).',
      },
    ],
    related: ['contacts-leads', 'numero-presente', 'donnees-apres-appel'],
  },
  {
    slug: 'contacts-leads',
    category: 'outbound',
    title: 'Import i zarządzanie kontaktami (leads)',
    summary: 'Zaimportuj plik kontaktów, personalizuj każde połączenie i śledź statusy.',
    sections: [
      {
        title: 'Przygotuj plik',
        list: [
          'Format CSV lub Excel, z kolumną phone_number (obowiązkowa).',
          'Jedna kolumna na każdą zmienną agenta (np. customer_name, company), aby personalizować połączenie.',
          'Numery w formacie międzynarodowym bez spacji (+48612345678) lub w formacie krajowym, z osobnym plikiem dla każdego kraju.',
          'Pobierz przykładowy plik dostępny przy imporcie, aby od początku zachować właściwy format.',
        ],
      },
      {
        title: 'Importuj',
        steps: [
          'Menu „Leads” (lub karta kontaktów w kampanii), a następnie „Import Leads”.',
          'Wybierz kampanię, format numerów i w razie potrzeby liczbę numerów dodatkowych.',
          'Przypisz każdą kolumnę do właściwego pola (wykrywanie automatyczne), a następnie uruchom import.',
          'Nieprawidłowe lub zduplikowane wiersze są pomijane i wymienione w raporcie do pobrania.',
        ],
      },
      {
        title: 'Zarządzaj kontaktami',
        list: [
          'Statusy: „Created” (do zadzwonienia), „Processing”, „Rescheduled” (zaplanowana ponowna próba), „Completed”, „Max Retries”.',
          'Przywrócenie kontaktu do „Created” powoduje ponowne połączenie; zmiana na „Completed” zatrzymuje połączenia.',
          'Numery dodatkowe: wybierane po kolei, jeśli numer główny nie odpowiada (tylko kampanie połączeń).',
          'Na liście dostępne są filtry, usuwanie zbiorcze i eksport do CSV.',
        ],
        tip: 'Najpierw zrób mały import testowy, aby sprawdzić format, a potem zaimportuj resztę.',
      },
    ],
    related: ['campagnes-d-appels', 'donnees-apres-appel', 'editeur-de-prompt-ia'],
  },

  // ---------- Śledzenie i automatyzacje ----------
  {
    slug: 'historique-des-appels',
    category: 'results',
    title: 'Przeglądanie połączeń i rozmów',
    summary: 'Odsłuchuj nagrania, czytaj transkrypcje i śledź rozmowy pisemne.',
    plan: 'Wszystkie pakiety.',
    sections: [
      {
        title: 'Połączenia',
        steps: [
          'Menu „Calls history”.',
          'Filtruj według agenta, daty lub kierunku (przychodzące / wychodzące).',
          'Otwórz połączenie: nagranie, transkrypcja, podsumowanie, wyodrębnione dane i czas trwania.',
        ],
      },
      {
        title: 'Rozmowy pisemne',
        text: 'Menu „Inbox” gromadzi rozmowy pisemne z Twoimi agentami:',
        list: [
          '„Web widget”: rozmowy z Twojej strony wraz z danymi z formularza.',
          '„WhatsApp”: rozmowy na WhatsAppie ze stanem 24-godzinnego okna.',
          '„Test”: Twoje sesje czatu testowego.',
          'Filtruj według typu, agenta lub daty; otwórz rozmowę, aby zobaczyć wiadomości, zmienne i koszt.',
        ],
      },
      {
        title: 'Jak to wykorzystać',
        list: [
          'Co tydzień odsłuchaj kilka połączeń i dopisz do instrukcji przypadki, które zostały źle obsłużone.',
          'Usuwaj rozmowy testowe, aby historia była przejrzysta (usunięcie jest nieodwracalne).',
        ],
      },
    ],
    related: ['donnees-apres-appel', 'automatisations', 'consignes-system-prompt'],
  },
  {
    slug: 'donnees-apres-appel',
    category: 'results',
    title: 'Wyodrębnianie informacji z każdej rozmowy',
    summary: 'Określ dane, które AI wyodrębnia po każdej rozmowie, i przesyłaj je do swoich narzędzi.',
    plan: 'Wszystkie pakiety.',
    sections: [
      {
        title: 'Określ dane do wyodrębnienia',
        text: 'Po każdej rozmowie AI analizuje jej przebieg i uzupełnia zdefiniowane przez Ciebie pola („Post-call evaluation”). Domyślnie istnieją dwa pola: „status” (cel osiągnięty, tak/nie) i „summary” (podsumowanie).',
        steps: [
          'Otwórz agenta, sekcja danych po rozmowie.',
          'Dodaj pole: nazwa małymi literami bez spacji (np. wizyta_umowiona), typ (tekst, liczba, tak/nie) i precyzyjny opis.',
          'Przykłady: budzet (liczba), decydent (tak/nie), powod_polaczenia (tekst), pilnosc (liczba od 1 do 10).',
        ],
        tip: 'Im dokładniejszy opis, tym bardziej wiarygodne wyodrębnianie. Dopasuj go do celu opisanego w instrukcjach.',
      },
      {
        title: 'Przesyłaj wyniki do swoich narzędzi',
        steps: [
          'Sekcja „Webhooks & channels”: włącz wysyłanie i wklej adres odbiorczy (webhook).',
          'Wybierz, czy wysyłać tylko zakończone połączenia, czy wszystkie, z linkiem do nagrania lub bez niego.',
          'Zapisz, a następnie kliknij „Make test request”, aby sprawdzić odbiór.',
        ],
        text: 'Każda wysyłka zawiera numer, czas trwania, status, wyodrębnione dane, zmienne początkowe i transkrypcję.',
      },
      {
        title: 'Jak wykorzystać te dane',
        list: [
          'Automatycznie ponawiać kontakt w kampanii, dopóki cel nie zostanie osiągnięty.',
          'Aktualizować CRM lub arkusz Google Sheets albo powiadamiać zespół dzięki automatyzacjom.',
        ],
      },
    ],
    related: ['automatisations', 'historique-des-appels', 'campagnes-d-appels'],
  },
  {
    slug: 'automatisations',
    category: 'results',
    title: 'Pierwsze kroki z automatyzacjami',
    summary: 'Automatycznie przesyłaj wyniki połączeń do CRM, Google Sheets, Slacka lub na e-mail.',
    plan: 'Od pakietu Asystent (5000 uruchomień miesięcznie, 50 000 w pakiecie Call center).',
    sections: [
      {
        title: 'Zasada działania',
        text: 'Menu „Automate platform” otwiera edytor scenariuszy bez kodu, połączony z ponad 300 narzędziami. Scenariusz („flow”) zaczyna się od wyzwalacza, po którym następują kolejne akcje.',
      },
      {
        title: 'Przydatne wyzwalacze',
        list: [
          'Koniec połączenia („Call Ended”): uruchamia się zaraz po zakończeniu rozmowy, z transkrypcją i wyodrębnionymi danymi.',
          'Połączenie przychodzące: uruchamia się, zanim agent odbierze, aby odnaleźć klienta w CRM i spersonalizować powitanie.',
          'Ponadto: harmonogram (codziennie o 8:00…), webhook, zdarzenie WhatsApp.',
        ],
      },
      {
        title: 'Utwórz pierwszy scenariusz',
        steps: [
          'Otwórz „Automate platform” i utwórz flow (lub zacznij od szablonu).',
          'Wybierz wyzwalacz „Call Ended”.',
          'Dodaj akcję: wiersz w Google Sheets, kontakt w CRM, e-mail lub wiadomość na Slacku do zespołu.',
          'Wstaw do akcji dane z połączenia (podsumowanie, numer, wyodrębnione pola).',
          'Przetestuj każdy krok, a następnie opublikuj flow.',
        ],
        tip: 'Typowe przykłady: aktualizacja HubSpot po każdej rozmowie, dodanie zakwalifikowanego kontaktu do kampanii oddzwaniania, wysłanie podsumowania e-mailem.',
      },
    ],
    related: ['donnees-apres-appel', 'outils-sur-mesure', 'historique-des-appels'],
  },

  // ---------- Minuty i rozliczenia ----------
  {
    slug: 'minutes-et-facturation',
    category: 'billing',
    title: 'Minuty, środki i rozliczenia',
    summary: 'Jak naliczane są minuty, do czego służą środki i gdzie zarządzać subskrypcją.',
    sections: [
      {
        title: 'Za co płacisz',
        list: [
          'Miesięczny pakiet z minutami połączeń w cenie.',
          'Minuty ponad pakiet, opłacane ze środków („Credits”: 100 kredytów = 1 $).',
          'Wiadomości WhatsApp, SMS i pisemne odpowiedzi AI, opłacane ze środków na wiadomości.',
          'Numery dedykowane, od {numberFrom} miesięcznie, zależnie od kraju.',
        ],
      },
      {
        title: 'Naliczanie minut',
        list: [
          'Minuty zużyte przez każde połączenie są widoczne w „Calls history”.',
          'Minuty w cenie pakietu odnawiają się co miesiąc, w dniu rozpoczęcia subskrypcji.',
          'Połączenia testowe (w przeglądarce lub przez telefon) również zużywają minuty.',
        ],
      },
      {
        title: 'Gdzie czym zarządzać',
        list: [
          '„Add credits”: zakup doładowania; środki nie wygasają.',
          '„Change plan”: zmiana pakietu. Jeśli często przekraczasz limit, wyższy pakiet wychodzi taniej za minutę.',
          '„Billing info”: metoda płatności, faktury i subskrypcja.',
          '„Limits”: co obejmuje Twój pakiet (agenci, połączenia równoczesne, numery…).',
        ],
        tip: 'Pulpit („Dashboard”) pokazuje zużycie w bieżącym miesiącu. Dzięki automatyzacjom możesz otrzymać alert, gdy zbliżasz się do limitu.',
      },
    ],
    related: ['tester-son-agent', 'acheter-un-numero', 'campagnes-d-appels'],
  },
];

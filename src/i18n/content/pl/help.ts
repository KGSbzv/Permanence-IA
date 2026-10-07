// Przewodnik po panelu klienta (interfejs po angielsku): słownik menu i zadania krok po kroku.
// Służy też jako baza wiedzy dla asystentki pomocy wbudowanej w panel klienta.
import type { HelpTask, MenuEntry } from '../fr/help';

export const HELP_MENU: MenuEntry[] = [
  { en: 'Dashboard', label: 'Pulpit', text: 'Przegląd: połączenia w miesiącu, zużyte minuty, wyniki.' },
  { en: 'Assistants', label: 'Agenci głosowi', text: 'Tworzenie, edycja i testowanie agentów (recepcja, oddzwanianie, wsparcie).' },
  { en: 'Calls history', label: 'Historia połączeń', text: 'Każde połączenie z nagraniem, transkrypcją, podsumowaniem i wyodrębnionymi danymi.' },
  { en: 'Knowledge base', label: 'Baza wiedzy', text: 'Dokumenty i strony WWW, z których agent korzysta w trakcie rozmowy.' },
  { en: 'Mid call tools / MCP', label: 'Narzędzia w trakcie rozmowy', text: 'Akcje, które agent uruchamia na bieżąco: wysłanie zgłoszenia do CRM, sprawdzenie informacji…' },
  { en: 'Blacklist', label: 'Lista wykluczeń', text: 'Numery, na które nigdy nie należy dzwonić.' },
  { en: 'Campaigns', label: 'Kampanie', text: 'Połączenia wychodzące do listy kontaktów (przypomnienia, ponowne kontakty, umawianie wizyt).' },
  { en: 'Leads', label: 'Kontakty / potencjalni klienci', text: 'Zaimportowane lub utworzone kontakty wraz z ich statusem.' },
  { en: 'Inbox', label: 'Skrzynka wiadomości', text: 'Rozmowy pisemne w jednym miejscu: widżet na stronie, WhatsApp, SMS, Messenger, Instagram.' },
  { en: 'Channels → WhatsApp / Messenger & Instagram', label: 'Kanały', text: 'Podłączanie kont komunikatorów.' },
  { en: 'Get new phone number', label: 'Nowy numer', text: 'Zakup dedykowanego numeru (opcja płatna co miesiąc, cena wyświetlana przed zakupem).' },
  { en: 'Your phone numbers', label: 'Twoje numery', text: 'Twoje numery, import z Twilio / Telnyx i połączenie SIP.' },
  { en: 'Automate platform', label: 'Automatyzacje', text: 'Scenariusze automatyzacji bez kodu, połączone z ponad 300 narzędziami (od pakietu Asystent wzwyż).' },
  { en: 'Change plan', label: 'Zmiana pakietu', text: 'Przejście na wyższy lub niższy pakiet.' },
  { en: 'Add credits', label: 'Doładowanie kredytów', text: 'Zakup doładowania kredytów (minuty i wiadomości); kredyty nie wygasają.' },
  { en: 'Billing info', label: 'Rozliczenia', text: 'Metoda płatności, faktury, subskrypcja i anulowanie.' },
  { en: 'Limits', label: 'Limity', text: 'Co obejmuje Twój pakiet: agenci, jednoczesne połączenia, funkcje.' },
  { en: 'API Keys', label: 'Klucze API', text: 'Podłączanie własnego oprogramowania (wszystkie pakiety).' },
  { en: 'My profile / Security', label: 'Profil / Bezpieczeństwo', text: 'Twoje dane, hasło i uwierzytelnianie dwuskładnikowe.' },
];

export const HELP_TASKS: HelpTask[] = [
  {
    title: 'Utwórz pierwszego agenta głosowego',
    steps: [
      'Menu Assistants, następnie Create (utwórz).',
      'General: wybierz Receive phone calls (odbieranie połączeń) lub Make phone calls (wykonywanie połączeń), podaj nazwę i strefę czasową.',
      'Voice & speech (głos): język Polish, następnie wybierz głos i odsłuchaj go.',
      'Brain & prompt (mózg i instrukcje): opisz swoją działalność oraz to, co agent ma robić, a czego nie. Asystent pisania (AI Prompt Editor) może napisać to za Ciebie.',
      'Greeting (powitanie): pierwsze zdanie, które wypowiada agent.',
      'Kliknij Create assistant, a następnie Test assistant (czat testowy) lub Speak with your assistant (rozmowa głosowa w przeglądarce).',
    ],
  },
  {
    title: 'Dodaj informacje o firmie (baza wiedzy)',
    steps: [
      'Menu Knowledge base, następnie utwórz bazę.',
      'Dodaj dokument: PDF, plik tekstowy lub adres strony Twojej witryny.',
      'W ustawieniach agenta, w sekcji Knowledgebase, wybierz tę bazę.',
    ],
  },
  {
    title: 'Odbieraj połączenia na swój numer',
    steps: [
      'Najprościej: kup numer w Get new phone number, a następnie wybierz go w ustawieniach agenta (General → Phone number).',
      'Aby zachować obecny numer: włącz u swojego operatora przekierowanie połączeń na nowy numer.',
      'Masz już Twilio, Telnyx lub centralę SIP: Your phone numbers, następnie import lub SIP (wszystkie pakiety).',
    ],
  },
  {
    title: 'Umawianie wizyt przez agenta',
    steps: [
      'W ustawieniach agenta: sekcja Tools & actions (narzędzia i akcje).',
      'Dodaj integrację z kalendarzem (Cal.com lub Calendly, połączone z Twoim kalendarzem Google lub Outlook) i podłącz swoje konto.',
      'W instrukcjach określ, kiedy proponować wizytę.',
    ],
  },
  {
    title: 'Przekazywanie połączenia do Ciebie',
    steps: [
      'W ustawieniach agenta, w sekcji Tools & actions, dodaj Call transfer (przekazanie połączenia).',
      'Podaj swój numer i określ, kiedy przekazywać rozmowę (pilna sprawa, prośba o rozmowę z człowiekiem…).',
    ],
  },
  {
    title: 'Umieść agenta na swojej stronie (widżet)',
    steps: [
      'W ustawieniach agenta, w sekcji Web widget: włącz widżet, wybierz głos i/lub czat, kolory i teksty.',
      'Skopiuj podany kod i wklej go przed znacznikiem </body> na swojej stronie (lub poproś o to swojego webmastera).',
    ],
  },
  {
    title: 'Uruchom kampanię połączeń wychodzących',
    steps: [
      'Utwórz agenta w trybie Make phone calls.',
      'Menu Leads: zaimportuj kontakty (plik CSV); dzwoń wyłącznie do osób, które wyraziły zgodę.',
      'Menu Campaigns: utwórz kampanię, wybierz agenta, kontakty i godziny połączeń, a następnie ją uruchom.',
    ],
  },
  {
    title: 'Otrzymuj wyniki rozmów w swoich narzędziach',
    steps: [
      'W ustawieniach agenta, w sekcji Webhooks & channels: podaj adres, na który ma trafiać każde zakończenie rozmowy.',
      'Lub użyj Automate platform, aby wysyłać podsumowania do Google Sheets, CRM, Slacka, na e-mail… (od pakietu Asystent wzwyż).',
    ],
  },
  {
    title: 'Dokup minuty lub zmień pakiet',
    steps: [
      'Doraźnie: Add credits (doładowanie kredytów) i wybierz kwotę. Kredyty nie wygasają.',
      'Jeśli często przekraczasz limit: Change plan — wyższy pakiet wychodzi taniej za minutę.',
    ],
  },
  {
    title: 'Okres próbny, rozliczenia i faktury',
    steps: [
      'Okres próbny zaczyna się, gdy wybierzesz pierwszy pakiet w Change plan: 14 dni za darmo, 30 minut w cenie, w okresie próbnym nic nie jest pobierane.',
      'Billing info: metoda płatności, faktury do pobrania i zarządzanie subskrypcją.',
      'Aby nic nie zapłacić, anuluj w Billing info przed upływem 14 dni.',
    ],
  },
];

export const HELP_GLOSSARY: MenuEntry[] = [
  { en: 'Inbound / Outbound', label: 'Przychodzące / wychodzące', text: 'Połączenia odebrane / połączenia wykonane przez agenta.' },
  { en: 'Prompt', label: 'Instrukcje', text: 'Tekst opisujący rolę i zasady działania agenta.' },
  { en: 'Pipeline / Speech-to-speech / Dualplex', label: 'Silnik', text: 'Technologia głosowa. Jeśli masz wątpliwości, zostaw Pipeline: to zalecane ustawienie.' },
  { en: 'Post-call evaluation', label: 'Analiza po rozmowie', text: 'Informacje automatycznie wyodrębniane z każdej rozmowy (imię i nazwisko, potrzeba, wizyta…).' },
  { en: 'Variables', label: 'Zmienne', text: 'Pola własne, np. {{customer_name}}, uzupełniane dla każdego kontaktu.' },
  { en: 'Voicemail', label: 'Poczta głosowa', text: 'Co robi agent, gdy trafi na pocztę głosową.' },
  { en: 'Credits', label: 'Kredyty', text: 'Saldo Twoich kredytów. Służą do opłacania dodatkowych minut i wiadomości pisemnych (odpowiedzi AI, WhatsApp, SMS); koszt każdego użycia podajemy na stronie Cennik.' },
];

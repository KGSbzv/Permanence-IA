// Teksty przypomnień handlowych i wiadomości cyklu życia konta (serie P, I, C, F, U i comiesięczna seria M),
// przetłumaczone z wersji francuskiej (src/i18n/content/fr/ui/relances.ts), która jest źródłem.
//
// Zasady (jak w wersji francuskiej):
// - żadnych liczb produktu wpisanych na sztywno: ceny, minuty i okres próbny przychodzą przez `RelanceFacts`;
// - zmienne {w nawiasach klamrowych} pozostają bez zmian i są uzupełniane przy wysyłce. {company} stoi zawsze
//   w mianowniku (nazwa firmy się nie odmienia, a zastępcze „Państwa firma” też musi pasować);
// - wiadomości „essential” (I1, C1–C5, F1, U1) nie zawierają argumentów sprzedażowych;
// - stopkę prawną i link rezygnacji dodaje sendMail (src/lib/emailFooter.ts).
import type { RelancesContent } from '../../fr/ui/relances';

/** Liczba (już sformatowana, np. „1 000”) z rzeczownikiem w odpowiedniej formie: 1 minuta, 2–4 minuty, 5+ minut. */
const count = (n: string, one: string, few: string, many: string) => {
  const v = parseInt(n.replace(/\D/g, ''), 10) || 0;
  if (v === 1) return `${n} ${one}`;
  const n10 = v % 10, n100 = v % 100;
  return `${n} ${n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14) ? few : many}`;
};
/** Mianownik / biernik: „30 minut”, „254 minuty”. */
const minutes = (n: string) => count(n, 'minuta', 'minuty', 'minut');
/** Dopełniacz: „po wykorzystaniu 30 minut”, także „22 minut”. */
const minutesGen = (n: string) => count(n, 'minuty', 'minut', 'minut');
const days = (n: string) => count(n, 'dzień', 'dni', 'dni');
const months = (n: string) => count(n, 'miesiąc', 'miesiące', 'miesięcy');
const calls = (n: string) => count(n, 'połączenie', 'połączenia', 'połączeń');

const lowerFirst = (s: string) => (s ? s.charAt(0).toLocaleLowerCase('pl-PL') + s.slice(1) : s);
const SERIES_END_UNSUBSCRIBE = 'Będziemy pisać najwyżej raz w miesiącu. Aby nie otrzymywać już żadnych wiadomości, wystarczy kliknąć link rezygnacji na dole tego e-maila.';
const NOTHING_CHARGED = 'w okresie próbnym nic nie jest pobierane';

export const UI_RELANCES: RelancesContent = {
  shared: {
    greeting: { named: 'Dzień dobry {first_name},', anonymous: 'Dzień dobry,' },
    companyFallback: 'Państwa firma',
    sourceLine: {
      callback_done: 'Nawiązując do naszej rozmowy z dnia {request_date}',
      callback: 'Nawiązując do Państwa prośby o oddzwonienie',
      trial_request: 'Poprosili Państwo o pomoc w uruchomieniu okresu próbnego',
      agent_lead: 'Nawiązując do Państwa rozmowy z naszą asystentką',
      demo: 'Wypróbowali Państwo nasze demo na żywo',
      contact: 'Nawiązując do Państwa wiadomości',
    },
    signature: (brand) => `Zespół ${brand}`,
    ctaLine: (label, url) => `${label}: ${url}`,
    list: (items) => {
      const l = items.map((s) => lowerFirst(s.trim().replace(/\.$/, '')));
      return l.length < 2 ? l.join('') : `${l.slice(0, -1).join(', ')} i ${l[l.length - 1]}`;
    },
    clause: (sentence) => lowerFirst(sentence.trim()),
  },

  messages: {
    // ---------- P: potencjalni klienci bez konta (marketing) ----------
    P1: (f) => ({
      category: 'marketing',
      subject: '{first_name}, jak agent poradzi sobie z Państwa połączeniami?',
      subjectNoName: 'Jak agent poradzi sobie z Państwa połączeniami?',
      preheader: `${days(f.trialDays)} okresu próbnego, ${minutes(f.trialMinutes)} połączeń, ${NOTHING_CHARGED}.`,
      body: [
        `{source_line}, dziękujemy za zainteresowanie ${f.brand}.`,
        'Najprostszy sposób, by wyrobić sobie zdanie: przetestować agenta na połączeniach, które odbiera {company}.',
        {
          ol: [
            `Prosimy założyć konto i wybrać pakiet do przetestowania: rozpocznie się ${f.trialDays}-dniowy okres próbny obejmujący ${minutes(f.trialMinutes)} połączeń.`,
            'Wymagana jest karta, ale w okresie próbnym nic nie jest pobierane.',
            'Jeśli to rozwiązanie nie jest dla Państwa, wystarczy anulować przed końcem okresu próbnego w Billing info: nic Państwo nie zapłacą.',
          ],
        },
      ],
      cta: { label: 'Rozpoczynam okres próbny', target: 'trial' },
      after: ['Mają Państwo pytanie? Wystarczy odpowiedzieć na tę wiadomość, czyta ją nasz zespół.'],
    }),
    P2: (f) => {
      const r = f.plans.receptionniste;
      return {
        category: 'marketing',
        subject: 'Ile kosztują Państwa nieodebrane połączenia?',
        preheader: 'Prosty rachunek na Państwa własnych danych.',
        body: [
          'Nieodebrane połączenie to często klient, który wybiera kolejny numer ze swojej listy.',
          'Prosimy policzyć na własnych danych:\nnieodebrane połączenia tygodniowo × 4,3 × średnia wartość nowego klienta = tyle {company} może tracić co miesiąc.',
          `Dla porównania: pakiet ${r.name}, ${r.price} netto miesięcznie za ${minutes(r.minutes)}. Agent odbiera całą dobę, przyjmuje wiadomość lub umawia wizytę i wysyła Państwu podsumowanie każdego połączenia. Kalkulator na naszej stronie Cennik zrobi to porównanie za Państwa.`,
          `Najlepiej jednak sprawdzić to na własnych połączeniach: ${f.trialDays}-dniowy okres próbny, ${minutes(f.trialMinutes)} w cenie, ${NOTHING_CHARGED}.`,
        ],
        cta: { label: 'Rozpoczynam okres próbny', target: 'trial' },
      };
    },
    P3: (f) => ({
      category: 'marketing',
      subject: '{sector_name}: co agent przejmuje za Państwa',
      preheader: 'Co agent zbiera dla Państwa podczas tych połączeń.',
      body: [
        'W Państwa branży często powtarza się jedna sytuacja: {sector_problem}',
        'Podczas takich połączeń agent zbiera to, czego Państwo potrzebują: {sector_handles}. Otrzymują Państwo przejrzystą notatkę i oddzwaniają, gdy mają Państwo czas, albo wizyta jest już w kalendarzu (Kalendarz Google lub Outlook, przez Cal.com lub Calendly).',
        'Zaczynają Państwo od gotowego szablonu instrukcji i dopasowują go do tego, czym zajmuje się {company}. Potem testują go Państwo na czacie, w przeglądarce i podczas prawdziwego połączenia.',
      ],
      cta: { label: `Testuję przez ${days(f.trialDays)}`, target: 'trial' },
    }),
    P3_generic: (f) => ({
      category: 'marketing',
      subject: 'Co agent przejmuje za Państwa',
      preheader: 'Co agent zbiera dla Państwa podczas tych połączeń.',
      body: [
        'W Państwa branży często powtarza się jedna sytuacja: połączenia, które przychodzą, gdy są Państwo zajęci.',
        'Podczas takich połączeń agent zbiera to, czego Państwo potrzebują: kto dzwoni, w jakiej sprawie i kiedy oddzwonić. Otrzymują Państwo przejrzystą notatkę i oddzwaniają, gdy mają Państwo czas, albo wizyta jest już w kalendarzu (Kalendarz Google lub Outlook, przez Cal.com lub Calendly).',
        'Zaczynają Państwo od gotowego szablonu instrukcji i dopasowują go do tego, czym zajmuje się {company}. Potem testują go Państwo na czacie, w przeglądarce i podczas prawdziwego połączenia.',
      ],
      cta: { label: `Testuję przez ${days(f.trialDays)}`, target: 'trial' },
    }),
    P4: () => ({
      category: 'marketing',
      subject: 'Klienci będą wiedzieć, że rozmawiają z AI, i tak ma być',
      preheader: 'To Państwo piszą jego instrukcje, zakazy i decydują, kiedy przekazuje rozmowę.',
      body: [
        'Już na początku rozmowy agent informuje, że jest AI. Wymaga tego unijny akt o sztucznej inteligencji (AI Act), a przede wszystkim chodzi o zaufanie. Jego głos brzmi naturalnie, w języku rozmówcy.',
        'A kontrolę zachowują Państwo:',
        {
          ul: [
            'to Państwo piszą jego instrukcje: godziny, ceny, sposób odpowiadania;',
            'wskazują Państwo, czego nigdy nie może robić: podawać wycen, stawiać diagnoz, obiecywać terminów;',
            'przekazuje rozmowę Państwa zespołowi, gdy tak Państwo ustalą, albo organizuje oddzwonienie z podsumowaniem. Przekazanie rozmowy jest w cenie każdego pakietu.',
          ],
        },
      ],
      cta: { label: 'Sprawdzam na własnych połączeniach', target: 'trial' },
    }),
    P5: (f) => ({
      category: 'marketing',
      subject: 'Zachowują Państwo obecny numer',
      preheader: 'Zwykłe przekierowanie połączeń, bez opłat instalacyjnych.',
      body: [
        'Nie trzeba zmieniać numeru ani zawiadamiać klientów.',
        'Wystarczy włączyć u operatora przekierowanie połączeń, na przykład tylko wtedy, gdy Państwo nie odbierają, albo wieczorami i w weekendy. Klienci dzwonią na numer, którego zawsze używa {company}, a agent przejmuje rozmowę, gdy nie mogą Państwo odebrać. Operator może naliczać opłatę za przekierowanie na numer zagraniczny: warto sprawdzić swoją ofertę.',
        `Bez opłat instalacyjnych i aktywacyjnych. Wolą Państwo dedykowany numer? To opcja, od ${f.phoneNumberFrom} netto miesięcznie, zależnie od kraju.`,
      ],
      cta: { label: 'Rozpoczynam okres próbny', target: 'trial' },
    }),
    P6: (f) => {
      const { receptionniste: r, assistant: a, 'centre-appels': c } = f.plans;
      return {
        category: 'marketing',
        subject: 'Nasze ceny, bez gwiazdek',
        preheader: 'Trzy pakiety, płatność za użycie, bez zobowiązań.',
        body: [
          'Oto nasze ceny netto:',
          {
            ul: [
              `${r.name}: ${r.price} miesięcznie, ${minutes(r.minutes)};`,
              `${a.name}: ${a.price} miesięcznie, ${minutes(a.minutes)};`,
              `${c.name}: ${c.price} miesięcznie, ${minutes(c.minutes)};`,
              `bez pakietu: ${f.paygMinute} za minutę, kredyty bez terminu ważności.`,
            ],
          },
          `W praktyce ${f.exampleCallMinutes}-minutowe połączenie kosztuje około ${f.exampleCallPayg} w płatności za użycie i od ${f.exampleCallPlanLow} do ${f.exampleCallPlanHigh} w pakiecie.`,
          `Bez zobowiązań: subskrypcję można anulować w dowolnym momencie w Billing info. Przy rozliczeniu rocznym ${months(f.annualFreeMonths)} gratis. A w ${f.trialDays}-dniowym okresie próbnym nic nie jest pobierane.`,
        ],
        cta: { label: 'Rozpoczynam okres próbny', target: 'trial' },
      };
    },
    P7: (f) => ({
      category: 'marketing',
      subject: '{company}: czy to dobry moment?',
      preheader: 'Ostatni e-mail z tej serii: wystarczy odpowiedzieć „później” lub „nie”.',
      body: [
        'To ostatni e-mail z tej serii: nie chcemy zapełniać Państwa skrzynki.',
        'Jeśli to nie jest dobry moment, wystarczy odpowiedzieć „później” lub „nie”, a weźmiemy to pod uwagę. W przeciwnym razie będą Państwo otrzymywać najwyżej jeden e-mail miesięcznie z praktyczną poradą; link na dole tej wiadomości pozwala zrezygnować jednym kliknięciem.',
        `A gdy zechcą Państwo spróbować: ${days(f.trialDays)}, ${minutes(f.trialMinutes)} połączeń, ${NOTHING_CHARGED}.`,
      ],
      cta: { label: 'Rozpoczynam okres próbny', target: 'trial' },
      closing: 'Dziękujemy za uwagę,',
    }),

    // ---------- I: konto bez okresu próbnego (I1 essential, potem marketing) ----------
    I1: (f) => ({
      category: 'essential',
      subject: 'Konto zostało utworzone: jeszcze jeden krok do okresu próbnego',
      preheader: 'Okres próbny rozpoczyna się, gdy wybiorą Państwo pakiet w panelu klienta.',
      body: [
        `Państwa panel klienta ${f.brand} jest gotowy.`,
        `Dla informacji: bezpłatny ${f.trialDays}-dniowy okres próbny (${minutes(f.trialMinutes)} połączeń) rozpoczyna się, gdy wybiorą Państwo pakiet w panelu klienta. Wymagana jest karta, ale ${NOTHING_CHARGED}; jeśli anulują Państwo przed jego końcem w Billing info, nic Państwo nie zapłacą.`,
        'Panel klienta jest w języku angielskim, ale wbudowana asystentka pomocy poprowadzi Państwa po polsku, na piśmie lub głosowo.',
      ],
      cta: { label: 'Wybieram pakiet', target: 'billing' },
    }),
    I2: () => ({
      category: 'marketing',
      subject: 'Najlepsza demonstracja: rozmowa z własnym agentem',
      preheader: 'Czat, przeglądarka, prawdziwe połączenie: wszystko można sprawdzić, zanim agent obsłuży klienta.',
      body: [
        'Najlepszą demonstracją jest Państwa własny agent: odpowiada jako {company}, z Państwa godzinami otwarcia i usługami.',
        'Wszystko można sprawdzić, zanim powierzą mu Państwo pierwszego klienta:',
        { ol: ['czat testowy, aby dopracować instrukcje;', 'rozmowa w przeglądarce, aby usłyszeć jego głos;', 'prawdziwe połączenie z Państwa komórki.'] },
        'Połączenia przekierowują Państwo dopiero wtedy, gdy wynik jest zadowalający. Przewodnik „Testowanie agenta” opisuje każdy krok.',
      ],
      cta: { label: 'Rozpoczynam okres próbny i testuję', target: 'billing' },
    }),
    I3: (f) => ({
      category: 'marketing',
      subject: 'Skonfigurujemy agenta razem?',
      preheader: 'Oddzwonimy, aby skonfigurować agenta razem z Państwem.',
      body: [
        'Nie było czasu, żeby zacząć? Możemy zrobić to razem.',
        `Wystarczy odpowiedzieć na tę wiadomość, podając dogodny termin i numer telefonu, albo zostawić prośbę o pomoc na naszej stronie okresu próbnego. Oddzwonimy, aby razem z Państwem skonfigurować agenta, z którego będzie korzystać {company} (instrukcje, kalendarz, przekierowanie połączeń), i dobrze rozpocząć ${f.trialDays}-dniowy okres próbny.`,
      ],
      cta: { label: 'Proszę o pomoc we wdrożeniu', target: 'trial_assist' },
    }),
    I4: (f) => ({
      category: 'marketing',
      subject: `${minutes(f.trialMinutes)} okresu próbnego: jak je najlepiej wykorzystać?`,
      preheader: 'Najlepiej na połączeniach, których dziś Państwo nie odbierają.',
      body: [
        `${minutes(f.trialMinutes)} to mniej więcej ${calls(f.trialShortCalls)} po ${minutes(f.shortCallMinutes)}. Wystarczy, żeby wyrobić sobie zdanie, pod warunkiem że zostaną wykorzystane we właściwym miejscu.`,
        'Nasza rada: nie trzeba przekierowywać wszystkiego. Wystarczy włączyć przekierowanie tylko wtedy, gdy Państwo nie odbierają, albo wieczorami i w weekendy. To właśnie te połączenia traci dziś {company} i przy nich agent będzie najbardziej przydatny.',
        'Podsumowanie każdego połączenia przeczytają Państwo w panelu klienta i od razu zobaczą, czy to się sprawdza.',
      ],
      cta: { label: 'Wybieram pakiet i rozpoczynam okres próbny', target: 'billing' },
    }),
    I5: (f) => {
      const { receptionniste: r, assistant: a, 'centre-appels': c } = f.plans;
      return {
        category: 'marketing',
        subject: 'Jaki pakiet wybrać na początek?',
        preheader: 'Prosta wskazówka według liczby połączeń.',
        body: [
          'Jeśli mają Państwo wątpliwości, oto prosta wskazówka (ceny netto miesięcznie):',
          {
            ul: [
              `${r.name}, ${r.price}: ${minutes(r.minutes)}, czyli mniej więcej ${calls(r.shortCalls)} po ${minutes(f.shortCallMinutes)};`,
              `${a.name}, ${a.price}: ${minutes(a.minutes)} oraz kredyty na odpowiedzi pisemne (czat na stronie, WhatsApp);`,
              `${c.name}, ${c.price}: ${minutes(c.minutes)}.`,
            ],
          },
          `Nie trzeba trafić za pierwszym razem: pakiet można zmienić w dowolnym momencie, bez zobowiązań, a zmiana jest wyświetlana przed potwierdzeniem. W ${f.trialDays}-dniowym okresie próbnym nic nie jest pobierane.`,
        ],
        cta: { label: 'Wybieram pakiet', target: 'billing' },
      };
    },
    I6: (f) => ({
      category: 'marketing',
      subject: 'Bez abonamentu? Płatność za minutę',
      preheader: `${f.paygMinute} netto za minutę, kredyty bez terminu ważności.`,
      body: [
        `Abonament nie każdemu odpowiada. Z agenta można też korzystać bez pakietu: doładowują Państwo kredyty, kiedy chcą (Add credits), minuta kosztuje ${f.paygMinute} netto, a kredyty nie wygasają.`,
        `Mają Państwo wtedy te same funkcje co w pakiecie ${f.plans.receptionniste.name}. Ten tryb nie obejmuje bezpłatnego okresu próbnego: płacą Państwo tylko za to, co doładują. Gdy połączenia staną się regularne, pakiet wychodzi taniej za minutę.`,
      ],
      cta: { label: 'Doładowuję kredyty lub wybieram pakiet', target: 'billing' },
    }),
    I7: (f) => ({
      category: 'marketing',
      subject: 'Państwa panel klienta pozostaje otwarty',
      preheader: 'Ostatni e-mail z tej serii: okres próbny jest nadal dostępny.',
      body: [
        `To nasz ostatni e-mail z tej serii. Państwa panel klienta ${f.brand} pozostaje otwarty: ${f.trialDays}-dniowy okres próbny (${minutes(f.trialMinutes)}, ${NOTHING_CHARGED}) rozpocznie się, gdy tylko wybiorą Państwo pakiet.`,
        'Jeśli coś Państwa zatrzymało, prosimy napisać nam o tym w jednym zdaniu: to dla nas naprawdę cenne.',
        'Później będziemy pisać najwyżej raz w miesiącu. Aby nie otrzymywać już żadnych wiadomości, wystarczy kliknąć link rezygnacji na dole tego e-maila.',
      ],
      cta: { label: 'Otwieram panel klienta', target: 'billing' },
    }),

    // ---------- C: trwający okres próbny (essential, wyłącznie informacyjne) ----------
    C1: (f) => ({
      category: 'essential',
      subject: 'Okres próbny się rozpoczął: 3 kroki, by w pełni z niego skorzystać',
      preheader: 'Okres próbny trwa do {trial_end_date}.',
      body: [
        `Państwa okres próbny ${f.brand} się rozpoczął. Trwa do {trial_end_date} i obejmuje ${minutes(f.trialMinutes)} połączeń.`,
        'Aby w pełni z niego skorzystać:',
        {
          ol: [
            'Utworzenie agenta z szablonu i dopasowanie jego instrukcji do tego, czym zajmuje się {company}.',
            'Podłączenie kalendarza (Cal.com lub Calendly), jeśli agent ma umawiać wizyty.',
            'Telefon testowy do agenta, a gdy wynik będzie zadowalający, włączenie przekierowania połączeń.',
          ],
        },
        'W okresie próbnym nic nie jest pobierane. Można go anulować przed {trial_end_date} w Billing info.',
      ],
      cta: { label: 'Otwieram panel klienta', target: 'app' },
    }),
    C2: (f) => ({
      category: 'essential',
      skipIfEssentialOnly: true,
      subject: 'Państwa agent czeka na pierwsze połączenie',
      preheader: 'Dwa krótkie kroki do pierwszego połączenia.',
      body: [
        'Państwa agent nie odebrał jeszcze żadnego połączenia. To często ostatni krok, i to krótki:',
        {
          ol: [
            'Prosimy zadzwonić do niego z komórki i zadać pytanie, jakie zadałby klient.',
            'Jeśli odpowiedź jest zadowalająca, wystarczy włączyć u operatora przekierowanie, gdy Państwo nie odbierają.',
          ],
        },
        `Zachowują Państwo swój numer, a przekierowanie można wyłączyć w każdej chwili. Do {trial_end_date} mają Państwo do dyspozycji ${minutes(f.trialMinutes)} okresu próbnego.`,
      ],
      cta: { label: 'Otwieram panel klienta', target: 'app' },
    }),
    C3: () => ({
      category: 'essential',
      skipIfEssentialOnly: true,
      subject: 'Pierwsze połączenia pomogą ulepszyć agenta',
      preheader: 'Warto przejrzeć podsumowania i uzupełnić instrukcje.',
      body: [
        'Pierwsze połączenia to najlepsze źródło wiedzy o tym, jak ulepszyć agenta. W panelu klienta warto przejrzeć podsumowania i wychwycić:',
        {
          ul: [
            'pytania obsłużone niewłaściwie: wystarczy dopisać brakującą informację do instrukcji;',
            'to, czego agent nigdy nie powinien obiecywać: po wpisaniu na listę będzie przekazywał te sprawy Państwu;',
            'połączenia, które ma od razu przekazywać Państwu: przekazanie ustawia się w „Tools & actions”.',
          ],
        },
        'Przewodnik „Pisanie instrukcji agenta” opisuje 5 elementów dobrych instrukcji, a asystent pisania (AI Prompt Editor) pomoże je przygotować.',
      ],
      cta: { label: 'Otwieram panel klienta', target: 'app' },
    }),
    C4: (f) => ({
      category: 'essential',
      subject: 'Pozostałe minuty okresu próbnego: {minutes_left}',
      preheader: `Co się dzieje po wykorzystaniu ${minutesGen(f.trialMinutes)} okresu próbnego.`,
      body: [
        `Pozostałe minuty okresu próbnego: {minutes_left} (z ${minutesGen(f.trialMinutes)}).`,
        `Dla informacji: po wykorzystaniu ${minutesGen(f.trialMinutes)} połączenia są wstrzymywane do końca okresu próbnego ({trial_end_date}) albo do chwili, gdy rozpoczną Państwo subskrypcję pakietu {plan_name} w Billing info. Jeśli nic Państwo nie zrobią, subskrypcja rozpocznie się automatycznie po zakończeniu okresu próbnego, chyba że wcześniej ją Państwo anulują.`,
        'Decyzja należy do Państwa.',
      ],
      cta: { label: 'Moja subskrypcja', target: 'billing' },
    }),
    C5: () => ({
      category: 'essential',
      subject: 'Okres próbny kończy się {trial_end_date}',
      preheader: 'Co się stanie tego dnia i jak anulować bez opłat.',
      body: [
        'Państwa okres próbny kończy się {trial_end_date}.',
        {
          ul: [
            'Chcą Państwo kontynuować: nie trzeba nic robić. Tego dnia rozpocznie się pakiet {plan_name}, a opłata za pierwszy miesiąc ({plan_price} netto, plus podatki zależnie od kraju) zostanie pobrana z karty.',
            'Nie chcą Państwo kontynuować: wystarczy anulować przed tą datą w Billing info, przycisk „Cancel subscription”. Nic nie zostanie pobrane.',
          ],
        },
        'Pytanie dotyczące pakietu lub minut? Wystarczy odpowiedzieć na tę wiadomość.',
      ],
      cta: { label: 'Zarządzam subskrypcją', target: 'billing' },
    }),

    // ---------- F: okres próbny zakończony bez pakietu (F1 essential, potem marketing) ----------
    F1: (f) => ({
      category: 'essential',
      subject: 'Okres próbny dobiegł końca, nic nie zostało pobrane',
      preheader: 'Jedno pytanie: wystarczy odpowiedź w jednym zdaniu.',
      body: [
        'Okres próbny zakończył się bez subskrypcji: nic nie zostało pobrane i to oczywiście Państwa prawo.',
        'Czy mogą Państwo napisać w jednym zdaniu, czego zabrakło? Głos, odpowiedzi, konfiguracja, cena, moment… Wystarczy odpowiedzieć na tę wiadomość: każdą odpowiedź czyta nasz zespół, a jeśli jakieś ustawienie może coś zmienić, damy znać.',
        `Dziękujemy za wypróbowanie ${f.brand}.`,
      ],
      cta: null,
    }),
    F2: (f) => ({
      category: 'marketing',
      subject: 'Agent może zostać, bez abonamentu',
      preheader: 'Płatność za użycie, bez abonamentu.',
      body: [
        'Jeśli powstrzymał Państwa abonament, jest inna możliwość: płatność za użycie.',
        `Panel klienta pozostaje dostępny. Doładowują Państwo kredyty, kiedy chcą (Add credits), minuta kosztuje ${f.paygMinute} netto, bez abonamentu, a kredyty nie wygasają. Zachowują Państwo te same funkcje co w pakiecie ${f.plans.receptionniste.name}. ${f.exampleCallMinutes}-minutowe połączenie kosztuje około ${f.exampleCallPayg} netto.`,
      ],
      cta: { label: 'Doładowuję kredyty', target: 'billing' },
    }),
    F3: () => ({
      category: 'marketing',
      subject: 'A gdyby agent odbierał tylko wieczorami i w weekendy?',
      preheader: 'Jako wsparcie zespołu, a nie zamiast niego.',
      body: [
        'Wiele firm nie powierza agentowi wszystkiego. Traktują go jako wsparcie zespołu: przejmuje rozmowy wieczorem, w weekend, w przerwie obiadowej albo gdy wszystkie linie są zajęte.',
        'Wystarczy ustawić u operatora przekierowanie połączeń na te pory. Przez resztę czasu {company} działa tak jak dotąd, a połączenia, które trafiały na pocztę głosową, wreszcie zostają odebrane, z podsumowaniem dla Państwa.',
      ],
      cta: { label: 'Wracam z pakietem', target: 'billing' },
    }),
    F4: () => ({
      category: 'marketing',
      subject: '3 ustawienia, które najbardziej zmieniają Państwa połączenia',
      preheader: 'Najczęściej w instrukcjach brakuje jakiejś informacji.',
      body: [
        'Gdy agent rozczarowuje w okresie próbnym, najczęściej w jego instrukcjach brakuje jakiejś informacji. Trzy ustawienia, które najbardziej wpływają na wynik:',
        {
          ol: [
            'Pełne informacje praktyczne: godziny, obszar działania, orientacyjne ceny, terminy.',
            'Lista tego, czego nigdy nie może robić, aby przekazywał te sprawy Państwu.',
            'Przekazanie rozmowy do zespołu w delikatnych sprawach, w cenie każdego pakietu.',
          ],
        },
        'Asystent pisania w panelu klienta (AI Prompt Editor) pomoże je przygotować.',
      ],
      cta: { label: 'Wracam z tymi ustawieniami', target: 'billing' },
    }),
    F5: (f) => {
      const { receptionniste: r, assistant: a, 'centre-appels': c } = f.plans;
      return {
        category: 'marketing',
        subject: 'Im więcej połączeń, tym tańsza minuta',
        preheader: 'Rzeczywista cena minuty w każdym pakiecie.',
        body: [
          'W pakiecie rzeczywista cena minuty spada wraz z liczbą połączeń:',
          {
            ul: [
              `${r.name}, ${r.price} netto/mies. za ${minutes(r.minutes)}: około ${r.perMinute} za minutę;`,
              `${a.name}, ${a.price} netto/mies. za ${minutes(a.minutes)}: około ${a.perMinute};`,
              `${c.name}, ${c.price} netto/mies. za ${minutes(c.minutes)}: około ${c.perMinute}.`,
            ],
          },
          `Rozliczenie miesięczne jest bez zobowiązań: subskrypcję można anulować w każdej chwili w Billing info. Przy rozliczeniu rocznym płacą Państwo za ${months(f.annualPaidMonths)} z 12. Kalkulator na naszej stronie Cennik wskaże najtańszy pakiet dla Państwa połączeń.`,
        ],
        cta: { label: 'Porównuję i wybieram', target: 'pricing' },
      };
    },
    F6: () => ({
      category: 'marketing',
      subject: 'Pomożemy we wdrożeniu?',
      preheader: 'Oddzwoni do Państwa ktoś z zespołu, bez zobowiązań.',
      body: [
        'Często to nie agent rozczarowuje, tylko brakuje jakiejś instrukcji albo przekierowanie połączeń jest źle ustawione.',
        'Wystarczy odpowiedzieć na tę wiadomość, podając dogodny termin i numer telefonu: ktoś z naszego zespołu oddzwoni, aby razem z Państwem ustawić agenta, z którego korzysta {company} (instrukcje, przekazywanie rozmów, przekierowanie połączeń), zanim wybiorą Państwo pakiet. Bez zobowiązań, to po prostu rozmowa.',
      ],
      cta: null,
    }),
    F7: (f) => ({
      category: 'marketing',
      subject: 'Na tym kończymy, dziękujemy za wypróbowanie',
      preheader: 'Ostatni e-mail z tej serii.',
      body: [
        `To nasz ostatni e-mail z tej serii. Dziękujemy za wypróbowanie ${f.brand}.`,
        `Panel klienta pozostaje dostępny: można wrócić z pakietem, bez zobowiązań, albo płacić za użycie, ${f.paygMinute} netto za minutę.`,
        SERIES_END_UNSUBSCRIBE,
      ],
      cta: { label: 'Mój panel klienta', target: 'billing' },
    }),

    // ---------- U: mało aktywne konta z płatnością za użycie (U1 essential, potem marketing) ----------
    U1: () => ({
      category: 'essential',
      subject: 'Czy agent prawidłowo odbiera Państwa połączenia?',
      preheader: 'Sprawdzenie zajmie minutę.',
      body: [
        'W ciągu ostatnich 30 dni agent odebrał niewiele połączeń. Być może tak ma być, ale czasem przyczyną jest wyłączone lub źle ustawione przekierowanie połączeń.',
        'Sprawdzenie w minutę:',
        {
          ol: [
            'Prosimy zadzwonić na swój zwykły numer w chwili, gdy przekierowanie powinno zadziałać.',
            'Jeśli agent nie odbiera, warto sprawdzić przekierowanie u operatora lub numer przypisany w panelu klienta.',
          ],
        },
        'Jeśli wszystko działa, nie trzeba nic zmieniać.',
      ],
      cta: { label: 'Otwieram panel klienta', target: 'app' },
    }),
    U2: () => ({
      category: 'marketing',
      subject: 'Wystarczy powierzyć mu tylko nieodebrane połączenia',
      preheader: 'Przekierowanie tylko wtedy, gdy Państwo nie odbierają.',
      body: [
        'Nie trzeba powierzać agentowi wszystkiego. Dzięki przekierowaniu przy braku odpowiedzi lub zajętej linii (jeśli operator je oferuje) odbierają Państwo, kiedy mogą, a agent przejmuje rozmowę tylko wtedy, gdy Państwo nie mogą.',
        'Efekt: {company} traci mniej połączeń, a Państwo płacą tylko za faktycznie wykorzystane minuty.',
      ],
      cta: { label: 'Mój panel klienta', target: 'app' },
    }),
    U3: (f) => {
      const r = f.plans.receptionniste;
      return {
        category: 'marketing',
        subject: 'Od kiedy pakiet wychodzi taniej?',
        preheader: 'Rachunek z ceną minuty w płatności za użycie.',
        body: [
          `Rachunek jest prosty: przy cenie ${f.paygMinute} netto za minutę kwota ${r.price} to mniej więcej ${minutes(f.breakEvenMinutes)}.`,
          {
            ul: [
              `Mniej niż ${minutes(f.breakEvenMinutes)} miesięcznie: najkorzystniejsza pozostaje płatność za użycie.`,
              `Więcej niż ${minutes(f.breakEvenMinutes)}: pakiet ${r.name} (${minutes(r.minutes)} za ${r.price} netto) wychodzi taniej, około ${r.perMinute} za minutę.`,
            ],
          },
          'Zużycie można śledzić w panelu klienta, a pakiet można anulować w każdej chwili w Billing info.',
        ],
        cta: { label: 'Sprawdzam zużycie', target: 'billing' },
      };
    },
    U4: () => ({
      category: 'marketing',
      subject: 'Dwie funkcje już dostępne na Państwa koncie',
      preheader: 'Przekazywanie rozmów i kalendarz, bez opłat za każde użycie.',
      body: [
        'Dwie funkcje są już w cenie, bez opłat za każde użycie:',
        {
          ul: [
            'przekazanie rozmowy: agent przekazuje zespołowi ważne połączenia (niezadowolony klient, pilna sprawa) według Państwa zasad, ustawianych w „Tools & actions”; czas przekazanej rozmowy jest odliczany od minut;',
            'kalendarz: połączony przez Cal.com lub Calendly, rezerwuje wolne terminy w trakcie rozmowy.',
          ],
        },
        'Aby kredyty nigdy się nie skończyły, można też włączyć automatyczne doładowanie; o niskim saldzie i tak informuje już alert e-mailowy.',
      ],
      cta: { label: 'Mój panel klienta', target: 'app' },
    }),
    U5: (f) => {
      const x = f.assistantExtras;
      if (!x) return null;
      const a = f.plans.assistant;
      return {
        category: 'marketing',
        subject: 'Odpowiedzi także na piśmie i Państwa głosem',
        preheader: `Co daje pakiet ${a.name}, bez zobowiązań.`,
        body: [
          `W płatności za użycie mają Państwo funkcje pakietu ${f.plans.receptionniste.name}, bez kredytów na wiadomości w cenie. Pakiet ${a.name} (${a.price} netto miesięcznie) dodaje:`,
          {
            ul: [
              `${minutes(a.minutes)} połączeń i ${count(x.agents, 'agenta', 'agentów', 'agentów')};`,
              `${count(x.messageCredits, 'kredyt', 'kredyty', 'kredytów')} na wiadomości miesięcznie, czyli mniej więcej ${count(x.writtenReplies, 'odpowiedź pisemną', 'odpowiedzi pisemne', 'odpowiedzi pisemnych')} AI (czat na stronie, WhatsApp);`,
              `${count(x.clonedVoices, 'sklonowany głos', 'sklonowane głosy', 'sklonowanych głosów')}: Państwa własny lub osoby, która wyraziła na to pisemną zgodę. Agent zawsze informuje, że jest AI.`,
            ],
          },
          'Bez zobowiązań, z możliwością anulowania w każdej chwili w Billing info.',
        ],
        cta: { label: 'Porównuję pakiety', target: 'billing' },
      };
    },
    U6: (f) => ({
      category: 'marketing',
      subject: 'Państwa model, Państwa tempo',
      preheader: 'Ostatni e-mail z tej serii.',
      body: [
        'To nasz ostatni e-mail z tej serii. W skrócie:',
        {
          ul: [
            `niewiele połączeń: najlepiej sprawdza się płatność za użycie, ${f.paygMinute} netto za minutę, a kredyty nie wygasają;`,
            `regularne połączenia: pakiet wychodzi taniej, bez zobowiązań przy rozliczeniu miesięcznym, a przy rocznym ${months(f.annualFreeMonths)} gratis.`,
          ],
        },
        SERIES_END_UNSUBSCRIBE,
      ],
      cta: { label: 'Mój panel klienta', target: 'billing' },
    }),
  },

  // ---------- M: seria comiesięczna (marketing) ----------
  monthly: {
    // Stała kolejność, oparta na opublikowanych przewodnikach (src/i18n/content/pl/guides.ts).
    topics: [
      {
        slug: 'tester-son-agent',
        title: 'testowanie agenta na 3 sposoby',
        paragraph: 'Zanim powierzą Państwo agentowi pierwszego klienta, warto przetestować go na trzy sposoby: na czacie testowym, aby sprawdzić instrukcje, w rozmowie w przeglądarce, aby usłyszeć głos, a na koniec podczas prawdziwego połączenia telefonicznego, jedynego testu, który sprawdza wszystkie narzędzia, w tym przekazywanie połączenia. Testy głosowe zużywają minuty tak jak prawdziwe połączenia.',
      },
      {
        slug: 'consignes-system-prompt',
        title: '5 elementów dobrych instrukcji',
        paragraph: 'Dobre instrukcje składają się z pięciu elementów: roli agenta (od początku mówi, że jest AI), stylu, kluczowych informacji (usługi, godziny otwarcia, ceny, adres), zasad (kiedy przekazać połączenie, czego nigdy nie obiecywać) oraz scenariuszy częstych sytuacji. Warto regularnie czytać transkrypcje połączeń i dopisywać przypadki, które zostały źle obsłużone.',
      },
      {
        slug: 'consignes-system-prompt',
        title: 'czego agent nigdy nie powinien robić',
        paragraph: 'To Państwo decydują, czego agent nigdy nie może robić: podawać wycen, stawiać diagnoz, obiecywać terminów. Wystarczy wpisać to do instrukcji: agent przekaże te sprawy Państwa zespołowi, z podsumowaniem zgłoszenia.',
      },
      {
        slug: 'renvoi-d-appel',
        title: 'zachowanie numeru dzięki przekierowaniu połączeń',
        paragraph: 'Państwa numer zostaje na wizytówkach, stronie i w ogłoszeniach: u operatora wystarczy włączyć przekierowanie na numer agenta, dla wszystkich połączeń albo tylko tych, których Państwo nie odbierają. Dla klientów nic się nie zmienia. Przekierowanie rozlicza operator: warto sprawdzić swój abonament.',
      },
    ],
    prospect: (f) => ({
      category: 'marketing',
      subject: 'Porada miesiąca: {topic_title}',
      preheader: 'Praktyczna porada z naszych przewodników.',
      body: ['{topic_paragraph}'],
      cta: { label: `Testuję przez ${days(f.trialDays)}`, target: 'trial' },
      after: ['To comiesięczny e-mail; można z niego zrezygnować jednym kliknięciem na dole tej wiadomości.'],
    }),
    account: () => ({
      category: 'marketing',
      subject: 'Porada miesiąca: {topic_title}',
      preheader: 'Praktyczna porada z naszych przewodników.',
      body: ['{topic_paragraph}'],
      cta: { label: 'Otwieram panel klienta', target: 'billing' },
      after: ['To comiesięczny e-mail; można z niego zrezygnować jednym kliknięciem na dole tej wiadomości.'],
    }),
  },
};

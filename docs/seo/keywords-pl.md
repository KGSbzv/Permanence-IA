# Mapa słów kluczowych — wersja polska (/pl)

Marka: **PermanenceAI** · hasło: *Inteligentny asystent telefoniczny*.
Zasady: fraza główna w tytule meta (≤ 60 znaków z marką), w opisie meta (≤ 155 znaków, korzyść + CTA),
w H1 lub intro i najwyżej raz w treści; frazy poboczne w intro, podtytułach i FAQ. Bez upychania słów,
bez nowych faktów; liczby (dni, minuty, ceny) i marka przychodzą z parametrów (`src/i18n/markets.ts`).

Pliki: `src/i18n/content/pl/ui/commerce.ts` (C), `ui/pages.ts` (P), `sectors.ts` (S), `modules.ts` (M), `faq.ts` (F).
Tytuły meta stron branż i funkcji pochodzą z map `SECTOR_SEO_TITLE` / `FEATURE_SEO_TITLE` w C
(klucz = polska nazwa `name`; po zmianie nazwy trzeba zaktualizować klucz, inaczej wraca tytuł ogólny).

## Strony główne

| Strona | Fraza główna | Frazy poboczne | Gdzie |
|---|---|---|---|
| `/pl` | asystent głosowy AI | inteligentny asystent telefoniczny, automatyczna obsługa połączeń, wirtualna recepcjonistka, umawianie wizyt przez telefon | C `home.meta` (tytuł, opis), `hero.intro`, `benefits.intro`, `features.booking.title`, `platform.title` |
| `/pl/tarifs` | cennik asystenta głosowego AI | pakiety netto, bezpłatny okres próbny | C `tarifs.meta.title`, `tarifs.hero.title`, opis z CTA „Wypróbuj” |
| `/pl/offres/*` | (nazwa pakietu + cena) | wypróbuj za darmo | C `offer.metaDescription` (CTA); tytuły pakietów w `offers.ts` bez zmian |
| `/pl/offres/recharges` | doładowania minut | asystent głosowy AI | C `recharges.meta.title` |
| `/pl/secteurs` | asystent głosowy AI dla firm | dziesięć branż: fachowcy, dentyści, fizjoterapeuci, weterynarze, biura nieruchomości, warsztaty, fryzjerzy, salony urody, restauracje, kancelarie | C `sectorsIndex.meta`, `sectorsIndex.hero` |
| `/pl/fonctionnalites` | automatyczna obsługa połączeń | wirtualna recepcjonistka, umawianie wizyt przez telefon, kwalifikacja leadów | C `featuresIndex.meta`, `featuresIndex.hero.title` |
| `/pl/integrations` | integracje asystenta głosowego AI | Kalendarz Google, Outlook, Calendly, HubSpot, SIP | C `integrations.meta.description` (skrócony do ≤ 155) |
| `/pl/demo` | demo asystenta głosowego AI | na żywo, bezpłatnie | P `demo.meta`, `demo.h1` |
| `/pl/contact` | kontakt — asystent głosowy AI | oddzwonienie, wycena | P `contact.meta` |
| `/pl/faq` | asystent głosowy AI — FAQ | RODO, ceny, wirtualna centrala telefoniczna | P `faq.meta`, `faq.h1`; F pytania 1, 6, 8 |
| `/pl/essai-gratuit` | asystent głosowy AI za darmo | bezpłatny okres próbny | P `trial.meta`, `trial.intro` |
| `/pl/about` | inteligentny asystent telefoniczny | automatyczna obsługa połączeń | P `about.meta` |
| `/pl/securite` | zgodność z RODO | bezpieczeństwo danych z połączeń | P `security.meta` |
| `/pl/blog` | asystenci głosowi AI dla firm | — | P `blog.meta.title` (skrócony do ≤ 60) |
| Strony prawne | — | — | bez zmian (treść i meta) |

## Branże (`/pl/secteurs/[slug]`)

| Slug | Fraza główna (tytuł meta) | Frazy poboczne | Gdzie |
|---|---|---|---|
| `services-a-domicile` | obsługa telefoniczna zgłoszeń (dla fachowców) | hydraulik, elektryk, ślusarz, firmy remontowe, pilne zgłoszenia, wieczorem i w weekend | C mapa tytułów; S `short` (opis meta), `subtitle`, FAQ 1–2 |
| `dentaire-cliniques` | rejestracja pacjentów (przez telefon) | gabinet stomatologiczny, wirtualna recepcjonistka, ortodonta, potwierdzanie wizyt, ból zęba | C mapa; S `short`, `title` (H1), `subtitle`, FAQ 1–3 |
| `kines-paramedical` | wirtualna recepcjonistka dla fizjoterapeutów | rejestracja do fizjoterapeuty, gabinet fizjoterapii, rehabilitacja, osteopata, logopeda, skierowanie | C mapa; S `short`, `subtitle`, `targets`, FAQ 2–3 |
| `cliniques-veterinaires` | wirtualna recepcjonistka dla weterynarza | gabinet weterynaryjny, lecznica, dyżur, szczepienia przypominające, technik weterynarii | C mapa; S `short`, `subtitle`, FAQ 2–3 |
| `immobilier` | obsługa telefoniczna biura nieruchomości | kwalifikacja kupujących i najemców, leady z portali, pośrednik | C mapa; S `short`, `subtitle`, FAQ 3 |
| `automobile` | umawianie wizyt w warsztacie samochodowym | wyceny, wymiana opon, przegląd, informacje o pojeździe | C mapa; S `short`, `title` (H1), `subtitle` |
| `salons-de-coiffure` | zapisy do fryzjera i barbera (przez telefon) | salon fryzjerski, barber shop, koloryzacja, odrosty, strzyżenie, broda | C mapa; S `short`, `subtitle`, `handles`, FAQ 1–2 |
| `beaute-bien-etre` | umawianie wizyt: gabinet kosmetyczny i spa | salon urody, stylizacja paznokci, rzęsy, depilacja, vouchery (bez fryzjerów — mają własną stronę) | C mapa; S `short`, `subtitle`, `targets` |
| `restaurants-hotellerie` | rezerwacje telefoniczne (restauracja, hotel) | pytania gości, serwis, goście z zagranicy | C mapa; S `short`, `subtitle` |
| `avocats-experts-comptables` | sekretariat telefoniczny dla kancelarii | kancelaria adwokacka i radcowska, biuro rachunkowe, doradca podatkowy, konsultacja, PIT/JPK | C mapa; S `short` (biuro rachunkowe), `subtitle`, FAQ 4 |

Opis meta branży = `short` + „Wypróbuj za darmo: X dni, Y minut w cenie.” (nazwa branży już nie jest powtarzana); `short` ≤ 108 znaków, żeby opis zmieścił się w 155.
Tytuł sekcji korzyści: mapa `SECTOR_BENEFITS_TITLE` w C (biuro, gabinet, lecznica, warsztat, salon, restauracja lub hotel, kancelaria lub biuro).

## Funkcje (`/pl/fonctionnalites/[slug]`)

| Slug | Fraza główna (tytuł meta) | Frazy poboczne | Gdzie |
|---|---|---|---|
| `receptionniste-ia` | wirtualna recepcjonistka | sekretariat telefoniczny | C mapa; M `short`, `title` (H1), `intro` |
| `demo-live` | demo asystenta głosowego AI | — | C mapa; M `intro` |
| `prise-de-rendez-vous` | umawianie wizyt przez telefon | przypomnienia, potwierdzenia | C mapa; M `short`, `title` (H1); F „Czy mogę podłączyć kalendarz?” |
| `support-client` | automatyczna obsługa klienta | bez kolejki | C mapa; M `short`, `title` (H1) |
| `qualification-des-leads` | kwalifikacja leadów przez telefon | — | C mapa; M `intro` |
| `campagnes-sortantes` | automatyczne połączenia wychodzące | automatyczne przypomnienia | C mapa; M `short`, `intro` |
| `whatsapp-messages` | WhatsApp, SMS i Messenger z asystentem AI | — | C mapa |
| `base-de-connaissances` | baza wiedzy asystenta głosowego AI | — | C mapa; M `intro` |
| `editeur-de-prompts` | edytor promptów | — | C mapa |
| `flow-builder` | automatyzacje bez kodu | — | C mapa |
| `sip-numeros` | trunk SIP i numery telefonu | wirtualna centrala telefoniczna, przekierowanie | C mapa; M `short`, `intro` |
| `reporting` | raporty / analityka połączeń | — | C mapa; M `title` (H1) |
| `widget-web` | widżet oddzwonienia na stronę WWW | — | C mapa |

Opis meta funkcji = `short` + „Dostępne od pakietu X. Wypróbuj za darmo przez N dni.”

## Kontrola

`npx tsc --noEmit -p .` oraz pomiar długości `<title>` i `<meta name="description">` na serwerze dev
(`http://localhost:3100/pl/...`): wszystkie strony ≤ 60 / ≤ 155 znaków.

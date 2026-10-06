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
| `/pl/secteurs` | asystent głosowy AI dla firm | gabinety stomatologiczne, biura nieruchomości, warsztaty, salony, restauracje | C `sectorsIndex.meta`, `sectorsIndex.hero.title` |
| `/pl/fonctionnalites` | automatyczna obsługa połączeń | wirtualna recepcjonistka, umawianie wizyt przez telefon, kwalifikacja leadów | C `featuresIndex.meta`, `featuresIndex.hero.title` |
| `/pl/integrations` | integracje asystenta głosowego AI | Kalendarz Google, Outlook, Calendly, HubSpot, SIP | C `integrations.meta.description` (skrócony do ≤ 155) |
| `/pl/demo` | demo asystenta głosowego AI | na żywo, bezpłatnie | P `demo.meta`, `demo.h1` |
| `/pl/contact` | kontakt — asystent głosowy AI | oddzwonienie, wycena | P `contact.meta` |
| `/pl/faq` | asystent głosowy AI — FAQ | RODO, ceny, wirtualna centrala telefoniczna, inteligentna poczta głosowa | P `faq.meta`, `faq.h1`; F pytania 1, 6, 8 |
| `/pl/essai-gratuit` | asystent głosowy AI za darmo | bezpłatny okres próbny | P `trial.meta`, `trial.intro` |
| `/pl/about` | inteligentny asystent telefoniczny | automatyczna obsługa połączeń | P `about.meta` |
| `/pl/securite` | zgodność z RODO | bezpieczeństwo danych z połączeń | P `security.meta` |
| `/pl/blog` | asystenci głosowi AI dla firm | — | P `blog.meta.title` (skrócony do ≤ 60) |
| Strony prawne | — | — | bez zmian (treść i meta) |

## Branże (`/pl/secteurs/[slug]`)

| Slug | Fraza główna (tytuł meta) | Frazy poboczne | Gdzie |
|---|---|---|---|
| `services-a-domicile` | obsługa telefoniczna zgłoszeń (dla fachowców) | hydraulik, elektryk, firmy remontowe, pilne zgłoszenia | C mapa tytułów; S `short` (opis meta), `subtitle` |
| `dentaire-cliniques` | rejestracja pacjentów (przez telefon) | gabinet stomatologiczny, klinika, potwierdzanie wizyt | C mapa; S `short`, `title` (H1), `subtitle`, FAQ 2 |
| `immobilier` | obsługa telefoniczna biura nieruchomości | kwalifikacja kupujących i najemców | C mapa; S `short`, `subtitle` |
| `automobile` | umawianie wizyt w warsztacie samochodowym | wyceny, informacje o pojeździe | C mapa; S `short`, `title` (H1), `subtitle` |
| `beaute-bien-etre` | umawianie wizyt w salonie kosmetycznym | salon fryzjerski, kalendarz | C mapa; S `short`, `subtitle` |
| `restaurants-hotellerie` | rezerwacje telefoniczne (restauracja, hotel) | pytania gości, serwis | C mapa; S `short`, `subtitle` |

Opis meta branży = `short` + „Wypróbuj za darmo: X dni, Y minut w cenie.” (nazwa branży już nie jest powtarzana).

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

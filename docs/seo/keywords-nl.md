# Zoekwoordenkaart — Nederlandse versie (/nl)

Merk: **PermanenceAI** · slogan: *AI-telefonieassistent* · aanspreekvorm: **u**.

Regels die zijn toegepast:

- Het hoofdzoekwoord staat in de meta title (≤ 60 tekens incl. merk), de meta description (≤ 155 tekens, voordeel + CTA), de H1 of intro, en één keer in de body waar dat natuurlijk is.
- Secundaire zoekwoorden staan in intro's, subtitels en FAQ.
- Geen nieuwe feiten. Cijfers (dagen, minuten, prijzen) komen uit de functieparameters, het merk uit `brand`.
- Bij een samenstelling met een koppelteken („AI-telefoonassistent”) leest Google het koppelteken als scheiding, dus de schrijfwijze klopt in het Nederlands en matcht ook „AI telefoonassistent”.
- De meta titles van sector- en modulepagina's komen uit `SECTOR_SEO` / `FEATURE_SEO` in `src/i18n/content/nl/ui/commerce.ts`, met de Nederlandse naam als sleutel. Hernoemt u een sector of module, werk dan die sleutel bij, anders valt de pagina terug op de generieke title.

Bestanden: `ui/commerce.ts` (C), `ui/pages.ts` (P), `sectors.ts` (S), `modules.ts` (M), `faq.ts` (F), allemaal onder `src/i18n/content/nl/`.

## Algemene pagina's

| Pagina | Hoofdzoekwoord | Secundair | Waar verwerkt |
|---|---|---|---|
| `/nl` (home) | AI telefoonassistent | virtuele receptionist, telefonische bereikbaarheid, telefoonservice voor bedrijven, zzp | C `home.meta`, H1 (`hero.title`), `hero.intro` (virtuele receptionist + telefonische bereikbaarheid), `platform.intro` (telefoonservice voor bedrijven), `benefits.intro` (zzp’er) |
| `/nl/tarifs` | prijzen AI telefoonassistent | kosten telefoonservice | C `tarifs.meta` (title + description, compacter abonnementsformaat), H1 `tarifs.hero.title`, `hero.intro` |
| `/nl/offres/decouverte` | proefperiode AI telefoonassistent | gratis proberen | C `offer.metaTitleTrial`, `offer.metaDescription` (CTA „Start gratis”) |
| `/nl/offres/{receptionniste,assistant,centre-appels,sur-mesure}` | AI telefoonservice + abonnementsnaam | prijs per maand | C `offer.metaTitle` („{naam}: AI-telefoonservice, {prijs}/mnd”), `offer.metaDescription` |
| `/nl/offres/recharges` | extra belminuten | opwaarderen | C `recharges.meta`, H1 `recharges.hero.title` |
| `/nl/secteurs` | telefoonservice per branche | AI telefoonassistent, telefonische bereikbaarheid | C `sectorsIndex.meta`, H1 + intro `sectorsIndex.hero` |
| `/nl/fonctionnalites` | functies AI telefoonassistent | virtuele receptionist, afspraken inplannen | C `featuresIndex.meta`, H1 + intro `featuresIndex.hero` |
| `/nl/integrations` | AI telefoonassistent koppelen (agenda, CRM) | afspraken inplannen in uw agenda | C `integrations.meta.description`, H1 + intro `integrations.hero` (title onveranderd: al rijk aan zoektermen) |
| `/nl/demo` | demo AI telefoonassistent | probeer live | P `demo.meta`, H1 `demo.h1` |
| `/nl/contact` | advies AI telefoonassistent | terugbelverzoek | P `contact.meta` |
| `/nl/faq` | veelgestelde vragen AI telefoonassistent | AI telefoonbeantwoorder, afspraken inplannen via telefoon, telefonische bereikbaarheid, virtuele receptionist, zzp | P `faq.meta`, H1 `faq.h1`; F `FAQ_GENERAL` (vragen 1, 2, 3, 5, 6, 8) |
| `/nl/essai-gratuit` | AI telefoonassistent gratis proberen | proefperiode | P `trial.meta`, H1 `trial.h1` |
| `/nl/aide` | handleiding AI telefoonassistent instellen | klantomgeving | P `help.meta`, H1 `help.h1` |
| `/nl/about` | AI telefoonservice voor bedrijven | virtuele receptionist, telefonische bereikbaarheid, zzp | P `about.meta`, `about.intro`, `about.paragraphs[1]` |
| `/nl/securite` | AVG AI-telefonie | beveiliging, bewaartermijn | P `security.meta`, H1 `security.h1` |
| `/nl/cgu`, `/confidentialite`, `/mentions-legales` | (geen: juridisch) | — | Ongewijzigd (titles en descriptions binnen de limieten, body niet aangeraakt) |
| `/nl/cookies` | cookiebeleid | — | P `cookies.meta.description` (beschrijvender, alleen feiten uit de body) |
| blog (`/nl/blog` stuurt door naar `/nl/faq`) | AI telefoonassistent, bereikbaarheid | — | P `blog.meta.title` ingekort tot ≤ 60 tekens |

## Sectorpagina's (`/nl/secteurs/…`)

| Slug | Hoofdzoekwoord | Secundair | Waar verwerkt |
|---|---|---|---|
| `services-a-domicile` | telefoonservice installateur | telefonische bereikbaarheid loodgieter / elektricien, spoed avond en weekend | C `SECTOR_SEO['Service aan huis']`; S `subtitle`, FAQ 2 (avond/weekend), FAQ-antwoord 4 (telefonische bereikbaarheid) |
| `dentaire-cliniques` | telefoonservice tandarts | telefonisch bereikbaar tandartspraktijk, mondzorg, orthodontist | C `SECTOR_SEO['Tandartsen en klinieken']`; S H1 `title` + `subtitle`, FAQ 3 (praktijksoftware) |
| `kines-paramedical` | telefoonservice fysiotherapeut | fysiotherapiepraktijk, osteopaat, logopedist, verwijzing, gezondheidscentrum | C `SECTOR_SEO['Fysiotherapie en paramedisch']`; S `subtitle`, `targets`, FAQ 3 |
| `cliniques-veterinaires` | telefoonservice dierenartspraktijk | dierenkliniek, spoeddienst dierenarts, vaccinatieherinnering | C `SECTOR_SEO.Dierenartspraktijken`; S `subtitle`, `problems`, FAQ 2 |
| `immobilier` | telefonische bereikbaarheid makelaar | telefoonservice makelaar, bezichtigingen, leads Funda | C `SECTOR_SEO.Vastgoed`; S `subtitle`, `problems[1]`, FAQ 3 |
| `automobile` | afspraak garage telefonisch | telefoonservice garage, APK | C `SECTOR_SEO['Garages en autobedrijven']`; S `subtitle`, `handles` |
| `salons-de-coiffure` | telefoonservice kapsalon | afspraak kapper telefonisch, barbershop, barbier | C `SECTOR_SEO['Kappers en barbiers']`; S H1 `title`, `subtitle`, FAQ 2 (barbershop) |
| `beaute-bien-etre` | telefoonservice schoonheidssalon | spa, nagelstudio, wimpers, afspraak schoonheidsspecialiste | C `SECTOR_SEO['Beauty en wellness']`; S `subtitle`, `targets` (kapsalons verhuisd naar `salons-de-coiffure`) |
| `restaurants-hotellerie` | reserveringen restaurant telefoon | telefonisch reserveren hotel | C `SECTOR_SEO['Horeca en hotels']`; S `subtitle` |
| `avocats-experts-comptables` | telefoonservice advocaat | advocatenkantoor, accountantskantoor, administratiekantoor, intakegesprek, aangifteperiode | C `SECTOR_SEO['Advocaten en accountants']`; S `subtitle`, `problems[2]` |

De `/nl/secteurs`-index noemt de tien branches in `sectorsIndex.meta.description` en `hero.intro`.

## Modulepagina's (`/nl/fonctionnalites/…`)

| Slug | Hoofdzoekwoord | Waar verwerkt |
|---|---|---|
| `receptionniste-ia` | virtuele receptionist | C `FEATURE_SEO`; M `short`, H1 `title`, `intro` (telefonisch bereikbaar) |
| `demo-live` | demo AI telefoonassistent | C `FEATURE_SEO`; M H1 `title` |
| `prise-de-rendez-vous` | afspraken inplannen via telefoon | C `FEATURE_SEO`; M `short`, H1 `title` |
| `support-client` | AI telefoonbeantwoorder / telefonische klantenservice | C `FEATURE_SEO`; M `short`, H1 `title`, `intro` |
| `qualification-des-leads` | leads telefonisch kwalificeren | C `FEATURE_SEO`; M `short`, H1 `title` |
| `campagnes-sortantes` | uitgaande belcampagnes | C `FEATURE_SEO`; M H1 `title` |
| `whatsapp-messages` | WhatsApp en sms automatisch beantwoorden | C `FEATURE_SEO`; M `short` |
| `base-de-connaissances` | kennisbank AI telefoonassistent | C `FEATURE_SEO`; M H1 `title` |
| `editeur-de-prompts` | AI-agent instellen zonder code | C `FEATURE_SEO`; M `short` |
| `flow-builder` | automatiseringen zonder code | C `FEATURE_SEO`; M `short` |
| `sip-numeros` | telefoonnummer behouden / SIP-koppeling | C `FEATURE_SEO`; M `short`, H1 `title` |
| `reporting` | gespreksrapportage | C `FEATURE_SEO`; M H1 `title` |
| `widget-web` | terugbelwidget website | C `FEATURE_SEO`; M `short` |

De meta description van een module is nu `{short}. Probeer het {dagen} dagen gratis, zonder verplichtingen.`. Het abonnement waarin de module zit, staat op de pagina zelf. De `short` dient ook als kaarttekst en in het menu, en blijft daarom kort.

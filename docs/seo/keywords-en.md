# English keyword map (en-GB and en-AU)

The same English content serves the UK (`/en-gb`) and Australia (`/en-au`), so every keyword below is valid in both markets. British spelling throughout. Head term: **AI receptionist**.

Rules applied: primary keyword in the meta title (≤ 60 characters including ` · PermanenceAI`), in the meta description (≤ 155 characters, benefit + call to action), in the H1 or intro, and once in the body where natural. Secondary keywords go in intros, subtitles and FAQ. Numbers (days, minutes, prices) and the brand still come from the function parameters.

Files: `src/i18n/content/en/ui/commerce.ts` (C), `ui/pages.ts` (P), `sectors.ts` (S), `modules.ts` (M), `faq.ts` (F).

## Core pages

| Page | Primary | Secondary | Where integrated |
|---|---|---|---|
| Home `/` | AI receptionist | AI phone answering service, 24/7 call answering, virtual receptionist, AI answering service for small business | C `home.meta.title` (keyword first, brand claim kept), `home.meta.description`, H1 (claim), `hero.intro`, `benefits.intro`, `sectors.intro` |
| Pricing `/tarifs` | AI receptionist pricing | AI answering service (plans), virtual receptionist cost | C `tarifs.meta.title`, `meta.description` (shorter plan line), `hero.title` (H1), `faq.intro` |
| Plan pages `/offres/*` | AI receptionist plan / free trial | no commitment, prices excl. tax | C `offer.metaTitleTrial`, `offer.metaDescription` (plan titles come from `offers.ts`, not edited) |
| Top-ups `/offres/recharges` | AI receptionist minutes | top-ups, extra minutes | C `recharges.meta.title`, `meta.description` |
| Free trial `/essai-gratuit` | free AI receptionist trial | try it free, cancel at any time | P `trial.meta.title`, `meta.description`, `trial.intro` |
| Live demo `/demo` | AI receptionist demo | try it live, demo call | P `demo.meta.title`, `meta.description`, `h1` |
| Features `/fonctionnalites` | AI receptionist software | AI phone answering software, call answering | C `featuresIndex.meta.title`, `meta.description`, `hero.intro` |
| Feature pages `/fonctionnalites/*` | module name + AI phone answering | see module table | C `feature.meta.title`, `feature.meta.description` (CTA), M `short` / `title` / `intro` |
| Sectors `/secteurs` | AI receptionist by industry | trades, dentists, physios, vets, estate agents, garages, hair salons and barbers, beauty salons, restaurants, law firms and accountants (ten sectors) | C `sectorsIndex.meta.title`, `meta.description`, `hero.title` (H1) |
| Sector pages `/secteurs/*` | `AI receptionist for <trade>` (C `SECTOR_SEO_TITLE`, keyed by display name; fallback `<sector> AI receptionist`) | see sector table | C `sector.meta.title`, `sector.meta.description` (now `short` + CTA), `change.title`; S `short` / `title` / `subtitle` |
| Integrations `/integrations` | AI receptionist integrations | CRM, calendar, WhatsApp, SIP, no code | C `integrations.meta.title`, `meta.description`, `hero.intro` |
| FAQ `/faq` | AI receptionist FAQ | how an AI receptionist works, AI answering service | P `faq.meta.title`, `meta.description`, `h1`; F first question + 2 answers |
| Contact `/contact` | request a callback | AI receptionist (questions) | P `contact.meta.title`, `meta.description` |
| About `/about` | AI receptionists for small business | 24/7 call answering | P `about.meta.title`, `meta.description`, `paragraphs[1]` |
| Security `/securite` | AI call security and data protection | consent, retention, call data | P `security.meta.title`, `meta.description` |
| Help `/aide` | AI receptionist customer area | guide, menus | P `help.meta.description` |
| Blog `/blog` | AI receptionist blog | guides, tips, small business calls | P `blog.meta.title` (was > 60 chars), `meta.description` |
| Terms, privacy, legal notice, cookies | — (brand + page name) | AI receptionist (descriptions only) | P `terms` / `legalNotice` / `cookies` `meta.description`; bodies untouched |

## Sector pages

| Sector (slug) | Primary | Secondary | Where integrated |
|---|---|---|---|
| Home services (`services-a-domicile`) | AI receptionist for trades | plumbers, electricians, locksmiths, out-of-hours call answering, emergency calls | meta title `AI receptionist for trades, 24/7`, S `short` (meta description + card), `subtitle` |
| Dental practices and clinics (`dentaire-cliniques`) | AI receptionist for dental practices | dental receptionist AI, new patients, appointment rescheduling, dental emergencies | meta title, S `short`, `subtitle` |
| Physio and allied health (`kines-paramedical`) | AI receptionist for physios | osteopaths, podiatrists, allied health, physio clinic phone answering, course of sessions | meta title `AI receptionist for physios & allied health`, S `short`, `subtitle` |
| Veterinary practices (`cliniques-veterinaires`) | AI receptionist for vet clinics | vet practice phone answering, vet emergencies, vaccination reminders, vet nurses | meta title `AI receptionist for vet clinics`, S `short`, `subtitle` |
| Real estate (`immobilier`) | AI receptionist for estate agents | real estate call answering, letting agents, buyers, sellers, tenants, portal leads | meta title, S `short`, `subtitle` |
| Garages and automotive (`automobile`) | AI receptionist for garages | garage booking line, service booking, workshop bookings, tyre centres | meta title, S `short`, `subtitle` |
| Hair salons and barbers (`salons-de-coiffure`) | AI receptionist for hair salons | barber shop phone bookings, salon appointment book, no-shows | meta title `AI receptionist for hair salons & barbers`, S `short`, `subtitle` |
| Beauty and wellbeing (`beaute-bien-etre`) | AI receptionist for beauty salons | spas, nail bars, lashes, treatment bookings, gift vouchers (hair moved to its own sector) | meta title `AI receptionist for beauty salons & spas`, S `short`, `subtitle` |
| Restaurants and hospitality (`restaurants-hotellerie`) | restaurant phone bookings AI | AI receptionist for restaurants and hotels, table bookings | meta title `AI phone bookings for restaurants`, S `short`, `title` (H1: "phone bookings"), `subtitle` |
| Law firms and accountants (`avocats-experts-comptables`) | AI receptionist for law firms | solicitors, accountants, call screening, new matters, tax season | meta title `AI receptionist for law firms & accountants`, S `short`, `subtitle` |

Market note: "tradies" (AU) and "MOT" (UK only) were deliberately not used, as each would read oddly in the other market. If the content is ever split by market, add "AI receptionist for tradies" to en-AU home services.

## Feature (module) pages

| Module (slug) | Primary | Where integrated |
|---|---|---|
| AI receptionist (`receptionniste-ia`) | AI receptionist, virtual receptionist | M `title` (H1), `intro` |
| Live agent demo (`demo-live`) | AI receptionist demo | M `title` |
| Appointment booking (`prise-de-rendez-vous`) | AI appointment booking | M `short`, `title` |
| Customer support (`support-client`) | AI phone support | M `title` |
| Lead qualification (`qualification-des-leads`) | AI lead qualification | M `short` |
| Outbound campaigns (`campagnes-sortantes`) | automated outbound calls | M `short` |
| Flow builder (`flow-builder`) | no-code call automation | M `short` |
| SIP and numbers (`sip-numeros`) | keep your number, SIP, call forwarding | M `short` |
| Reporting (`reporting`) | call analytics | M `short` |
| Web widget (`widget-web`) | website call widget | M `short` |
| WhatsApp, knowledge base, prompt editor | unchanged (names already descriptive) | — |

All feature pages share the title pattern `<module> — AI phone answering · PermanenceAI` (≤ 57 characters).

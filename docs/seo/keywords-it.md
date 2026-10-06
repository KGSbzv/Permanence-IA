# Mappa delle parole chiave — versione italiana (/it)

Marchio: **PermanenceIA** · slogan: *Assistente telefonico AI* · registro formale (Lei).
Termine principale del sito: **assistente telefonico AI**. Termini secondari trasversali:
*centralino virtuale*, *receptionist virtuale*,
*risponditore automatico AI*, *prenotazioni telefoniche automatiche*.

Regole applicate: parola chiave principale nel meta title (≤ 60 caratteri, marchio incluso,
passato come parametro), nella meta description (≤ 155 caratteri, vantaggio + invito all’azione),
nell’H1 o nell’intro e una volta nel corpo dove naturale; le secondarie in intro, sottotitoli e FAQ.
Nessun nuovo fatto: cifre (giorni, minuti, prezzi) sempre dalle funzioni del mercato.

File: `C` = `src/i18n/content/it/ui/commerce.ts`, `P` = `ui/pages.ts`, `S` = `sectors.ts`,
`M` = `modules.ts`, `F` = `faq.ts`.

## Pagine commerciali

| Pagina | Primaria | Secondarie | Dove è integrata |
|---|---|---|---|
| `/it` (home) | assistente telefonico AI | receptionist virtuale, centralino virtuale, prenotazioni telefoniche automatiche | C `home.meta.title/description`, `hero.intro`; secondarie in `showcase.intro`, `benefits.intro`, `features.booking.text`, `platform.intro` |
| `/it/tarifs` | prezzi assistente telefonico AI | costo / prezzo al mese | C `tarifs.meta.*` (riga piano accorciata per stare in 155), `hero.intro` |
| `/it/offres/[piano]` | piano + assistente telefonico AI | prova gratuita | C `offer.metaTitleTrial`, `offer.metaDescription` |
| `/it/offres/recharges` | ricarica minuti | assistente telefonico AI | C `recharges.meta.*` |
| `/it/secteurs` | assistente telefonico AI per settore | receptionist virtuale | C `sectorsIndex.meta.*`, `hero.intro` |
| `/it/fonctionnalites` | centralino virtuale AI | receptionist virtuale, prenotazioni | C `featuresIndex.meta.*`, `hero.intro` |
| `/it/integrations` | integrazioni calendario / CRM / WhatsApp / SIP | assistente telefonico AI | C `integrations.meta.description` (title invariato, già ottimale) |

## Settori (`/it/secteurs/[slug]`)

Title e description per settore definiti in `SECTOR_SEO` (C, chiave = nome italiano del settore,
fallback al formato generico). Primaria anche nel `subtitle` (intro sotto l’H1) in S.

| Slug | Primaria | Secondarie |
|---|---|---|
| services-a-domicile | assistente telefonico AI per artigiani | idraulici, elettricisti, urgenze fuori orario |
| dentaire-cliniques | receptionist virtuale per studio dentistico | assistente telefonico AI, clinica |
| immobilier | centralino per agenzia immobiliare | qualificazione acquirenti / inquilini |
| automobile | prenotazione officina | prenotazione al telefono 24/7, preventivi |
| beaute-bien-etre | prenotazioni centro estetico / salone | prenotazioni telefoniche automatiche, parrucchieri, spa |
| restaurants-hotellerie | prenotazioni ristorante al telefono | hotel |

## Funzionalità (`/it/fonctionnalites/[slug]`)

Title per modulo in `FEATURE_SEO` (C, chiave = nome del modulo, fallback generico). Intro in M dove indicato.

| Slug | Primaria (title) | Intro M |
|---|---|---|
| receptionniste-ia | receptionist virtuale AI | sì |
| demo-live | demo assistente telefonico AI | — |
| prise-de-rendez-vous | prenotazioni telefoniche automatiche | sì |
| support-client | risponditore automatico AI | sì |
| qualification-des-leads | qualificazione dei lead al telefono | — |
| campagnes-sortantes | chiamate automatiche in uscita | — |
| whatsapp-messages | risposte automatiche WhatsApp e SMS | — |
| base-de-connaissances | base di conoscenza agente vocale AI | — |
| editeur-de-prompts | editor di prompt agente vocale AI | — |
| flow-builder | automazioni senza codice | — |
| sip-numeros | centralino virtuale SIP | sì |
| reporting | report e statistiche delle chiamate | — |
| widget-web | widget di richiamata per sito web | — |

## Altre pagine

| Pagina | Primaria | Secondarie | Dove |
|---|---|---|---|
| `/it/demo` | demo assistente telefonico AI | receptionist virtuale | P `demo.meta.*`, `h1`, `intro` |
| `/it/essai-gratuit` | assistente telefonico AI gratis | prova gratuita | P `trial.meta.*`, `intro` |
| `/it/faq` | domande frequenti assistente telefonico AI | centralino virtuale, prenotazioni telefoniche automatiche | P `faq.meta.*`, `intro`; F (4 domande/risposte) |
| `/it/contact` | contatti / richiamata | assistente telefonico AI | P `contact.meta.*` |
| `/it/about` | assistente telefonico AI per PMI | — | P `about.meta.*`, `paragraphs[1]` |
| `/it/securite` | assistente telefonico AI conforme al GDPR | — | P `security.meta.*`, `intro` |
| Blog (meta) | blog assistente telefonico AI | prenotazioni automatiche | P `blog.meta.*` (oggi `/blog` reindirizza a `/faq`) |
| CGU, privacy, note legali, cookie, aide | invariate | — | corpo legale non modificato; meta già entro i limiti |

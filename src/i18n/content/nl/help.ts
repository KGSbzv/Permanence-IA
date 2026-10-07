// Gids voor de klantomgeving (Engelstalige interface): overzicht van de menu’s en stapsgewijze taken.
// Dient ook als kennisbank voor de ingebouwde hulpassistent van de klantomgeving.
import type { HelpTask, MenuEntry } from '../fr/help';

export type { HelpTask, MenuEntry };

export const HELP_MENU: MenuEntry[] = [
  { en: 'Dashboard', label: 'Dashboard', text: 'Overzicht: gesprekken van de maand, verbruikte minuten, resultaten.' },
  { en: 'Assistants', label: 'Spraakagents', text: 'Uw agents aanmaken, bewerken en testen (ontvangst, terugbellen, support).' },
  { en: 'Calls history', label: 'Gespreksgeschiedenis', text: 'Elk gesprek met opname, transcriptie, samenvatting en geëxtraheerde gegevens.' },
  { en: 'Knowledge base', label: 'Kennisbank', text: 'Documenten en webpagina’s die de agent tijdens het gesprek raadpleegt.' },
  { en: 'Mid call tools / MCP', label: 'Tools tijdens het gesprek', text: 'Acties die de agent live uitvoert: een aanvraag naar uw CRM sturen, een gegeven controleren…' },
  { en: 'Blacklist', label: 'Uitsluitingslijst', text: 'Nummers die nooit gebeld mogen worden.' },
  { en: 'Campaigns', label: 'Campagnes', text: 'Uitgaande gesprekken naar een lijst met contacten (herinneringen, opvolging, afspraken maken).' },
  { en: 'Leads', label: 'Contacten / prospects', text: 'Geïmporteerde of aangemaakte contacten, met hun status.' },
  { en: 'Inbox', label: 'Berichten', text: 'Schriftelijke gesprekken op één plek: webwidget, WhatsApp, sms, Messenger, Instagram.' },
  { en: 'Channels → WhatsApp / Messenger & Instagram', label: 'Kanalen', text: 'Uw berichtenaccounts koppelen.' },
  { en: 'Get new phone number', label: 'Nummer aanvragen', text: 'Een eigen nummer kopen (optie, per maand betaald, prijs zichtbaar vóór de aankoop).' },
  { en: 'Your phone numbers', label: 'Uw nummers', text: 'Uw nummers, import via Twilio / Telnyx en de SIP-koppeling.' },
  { en: 'Automate platform', label: 'Automatiseringen', text: 'No-code automatiseringen gekoppeld aan meer dan 300 tools (Assistent-abonnement en hoger).' },
  { en: 'Change plan', label: 'Abonnement wijzigen', text: 'Overstappen op een groter of kleiner abonnement.' },
  { en: 'Add credits', label: 'Tegoed toevoegen', text: 'Een opwaardering van minuten kopen; het tegoed vervalt niet.' },
  { en: 'Billing info', label: 'Facturatie', text: 'Betaalmethode, facturen, abonnement en opzegging.' },
  { en: 'Limits', label: 'Limieten', text: 'Wat uw abonnement toestaat: agents, gelijktijdige gesprekken, functies.' },
  { en: 'API Keys', label: 'API-sleutels', text: 'Uw eigen software koppelen (alle abonnementen).' },
  { en: 'My profile / Security', label: 'Profiel / Beveiliging', text: 'Uw gegevens, wachtwoord en tweestapsverificatie.' },
];

export const HELP_TASKS: HelpTask[] = [
  {
    title: 'Uw eerste spraakagent aanmaken',
    steps: [
      'Menu Assistants, daarna Create (aanmaken).',
      'General: kies Receive phone calls (gesprekken ontvangen) of Make phone calls (zelf bellen), geef een naam op en kies de tijdzone.',
      'Voice & speech (stem): taal Dutch, kies daarna een stem en luister ernaar.',
      'Brain & prompt (brein en instructies): beschrijf uw bedrijf en wat de agent wel en niet moet doen. De schrijfassistent (AI Prompt Editor) kan dit voor u opstellen.',
      'Greeting (begroeting): de eerste zin die de agent uitspreekt.',
      'Klik op Create assistant. Test daarna met Test assistant (testchat) of Speak with your assistant (spraakgesprek in de browser).',
    ],
  },
  {
    title: 'Uw gegevens toevoegen (kennisbank)',
    steps: [
      'Menu Knowledge base, maak daarna een kennisbank aan.',
      'Voeg een document toe: pdf, tekstbestand of het adres van een pagina van uw website.',
      'Selecteer deze kennisbank in uw agent, onder Knowledgebase.',
    ],
  },
  {
    title: 'Gesprekken ontvangen op uw nummer',
    steps: [
      'De eenvoudigste manier: koop een nummer via Get new phone number en selecteer het in de agent (General → Phone number).',
      'Wilt u uw huidige nummer behouden? Stel bij uw provider een doorschakeling naar dit nieuwe nummer in.',
      'Hebt u al Twilio, Telnyx of een SIP-centrale? Ga dan naar Your phone numbers en kies import of SIP (alle abonnementen).',
    ],
  },
  {
    title: 'De agent afspraken laten maken',
    steps: [
      'Ga in de agent naar het onderdeel Tools & actions (tools en acties).',
      'Voeg de agendakoppeling toe (Cal.com of Calendly, die zelf gekoppeld zijn aan uw Google- of Outlook-agenda) en verbind uw account.',
      'Geef in de instructies aan wanneer de agent een afspraak moet voorstellen.',
    ],
  },
  {
    title: 'Een gesprek naar u doorverbinden',
    steps: [
      'Voeg in de agent, onder Tools & actions, Call transfer (doorverbinden) toe.',
      'Vul uw nummer in en geef aan wanneer er doorverbonden moet worden (spoed, vraag naar een medewerker…).',
    ],
  },
  {
    title: 'De agent op uw website zetten (widget)',
    steps: [
      'Ga in de agent naar het onderdeel Web widget: activeer de widget en kies spraak en/of chat, kleuren en teksten.',
      'Kopieer de code en plak die vóór de tag </body> van uw website (of vraag uw webbouwer om dit te doen).',
    ],
  },
  {
    title: 'Een uitgaande belcampagne starten',
    steps: [
      'Maak een agent aan in de modus Make phone calls.',
      'Menu Leads: importeer uw contacten (CSV-bestand); bel alleen mensen die daarvoor toestemming hebben gegeven.',
      'Menu Campaigns: maak de campagne aan, kies de agent, de contacten en de beltijden, en start de campagne.',
    ],
  },
  {
    title: 'De resultaten van gesprekken in uw tools ontvangen',
    steps: [
      'Vul in de agent, onder Webhooks & channels, het adres in dat na elk gesprek de gegevens moet ontvangen.',
      'Of gebruik Automate platform om de samenvattingen naar Google Sheets, uw CRM, Slack, e-mail… te sturen (Assistent-abonnement en hoger).',
    ],
  },
  {
    title: 'Minuten toevoegen of van abonnement wisselen',
    steps: [
      'Eenmalig: Add credits (tegoed toevoegen) en kies een opwaardering. Het tegoed vervalt niet.',
      'Gaat u er vaak overheen? Kies dan een groter abonnement via Change plan: dat is per minuut goedkoper.',
    ],
  },
  {
    title: 'Proefperiode, betaling en facturen beheren',
    steps: [
      'De proefperiode start wanneer u uw eerste abonnement kiest in Change plan: 14 dagen gratis, 30 minuten inbegrepen, er wordt tijdens de proefperiode niets afgeschreven.',
      'Billing info: betaalmethode, downloadbare facturen en beheer van het abonnement.',
      'Wilt u niets betalen, zeg dan via Billing info op vóór het einde van de 14 dagen.',
    ],
  },
];

export const HELP_GLOSSARY: MenuEntry[] = [
  { en: 'Inbound / Outbound', label: 'Inkomend / uitgaand', text: 'Ontvangen gesprekken / gesprekken die de agent zelf voert.' },
  { en: 'Prompt', label: 'Instructies', text: 'De tekst die de rol en de regels van de agent beschrijft.' },
  { en: 'Pipeline / Speech-to-speech / Dualplex', label: 'Engine', text: 'De spraaktechnologie. Twijfelt u, laat dan Pipeline staan: dat is de aanbevolen instelling.' },
  { en: 'Post-call evaluation', label: 'Analyse na het gesprek', text: 'De gegevens die automatisch uit elk gesprek worden gehaald (naam, behoefte, afspraak…).' },
  { en: 'Variables', label: 'Variabelen', text: 'Eigen velden zoals {{customer_name}}, ingevuld voor elk contact.' },
  { en: 'Voicemail', label: 'Voicemail', text: 'Wat de agent doet als hij op een voicemail uitkomt.' },
  { en: 'Credits', label: 'Tegoed', text: '100 credits = $ 1. Wordt gebruikt voor extra minuten en berichten (WhatsApp, sms).' },
];

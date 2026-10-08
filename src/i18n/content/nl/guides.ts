// Praktische gidsen voor de klantomgeving (Engelstalige interface): één gids per taak, gepubliceerd onder /aide/guides/<slug>.
// De Engelse interfacelabels staan tussen aanhalingstekens, de uitleg is in de taal van de lezer.
// Variabelen die bij weergave worden vervangen: {brand} (merk van de markt), {numberFrom} (instapprijs van een eigen nummer).
// Zelfde slugs, categorieën en structuur als de Franse bron (gecontroleerd via `typeof`).
import type { Guide } from '../fr/guides';
import { GUIDES_UI as FR_UI } from '../fr/guides';

export const GUIDES_UI: typeof FR_UI = {
  categories: {
    start: 'Aan de slag',
    assistant: 'Uw agent instellen',
    tools: 'Kennis, agenda en tools',
    phone: 'Nummers en telefonie',
    channels: 'Website en berichtenapps',
    outbound: 'Campagnes en contacten',
    results: 'Gespreksopvolging en automatiseringen',
    billing: 'Minuten en facturatie',
  },
  indexTitle: 'Stapsgewijze gidsen',
  indexIntro: 'Eén gids per taak, met de exacte labels van de interface (in het Engels) en de uitleg in het Nederlands.',
  breadcrumb: 'Gidsen',
  meta: {
    title: (title: string, brand: string) => `${title} — Gids ${brand}`,
  },
  eyebrow: (category: string) => `Gids · ${category}`,
  planLabel: 'Beschikbaarheid',
  tipLabel: 'Tip',
  relatedTitle: 'Gerelateerde gidsen',
  allGuides: 'Alle gidsen',
  openSpace: 'Mijn omgeving openen',
  helpBefore: 'Hulp nodig? In uw omgeving antwoordt de hulpassistent (chatknop rechtsonder) in uw taal. U kunt ook mailen naar ',
  helpAfter: '.',
};

export const GUIDES: Guide[] = [
  // ---------- Aan de slag ----------
  {
    slug: 'agent-vocal-ia',
    category: 'start',
    title: 'Wat is een AI-spraakagent?',
    summary: 'De rol van een agent, de onderdelen ervan en wat hij voor u kan doen, bij inkomende én uitgaande gesprekken.',
    sections: [
      {
        title: 'Het principe',
        text: 'Een agent (in de {brand}-omgeving “Assistant” genoemd) is een AI die u instelt om telefonisch met uw klanten of prospects te praten: wanneer zij u bellen (inkomend gesprek, “Receive phone calls”) of wanneer de agent hen belt (uitgaand gesprek, “Make phone calls”).',
      },
      {
        title: 'Wat hij voor u doet',
        list: [
          'Veelgestelde vragen beantwoorden, berichten aannemen en afspraken maken, 24 uur per dag.',
          'Een aanvraag kwalificeren en het gesprek doorverbinden naar uw team wanneer dat nodig is.',
          'Meerdere gesprekken tegelijk afhandelen (het aantal gelijktijdige gesprekken hangt af van uw abonnement).',
        ],
      },
      {
        title: 'De onderdelen',
        list: [
          'De instructies (“System prompt”): de rol, de toon en de regels van de agent.',
          'De begroeting (“Initial message”): de eerste zin die wordt uitgesproken.',
          'De stem (“Voice”): een stem uit de bibliotheek of uw gekloonde stem.',
          'De tools (“Tools”): doorverbinden, gesprek beëindigen, afspraken maken, maatwerktools.',
          'De kennisbank (“Knowledge base”): uw documenten en webpagina’s.',
        ],
      },
    ],
    related: ['creer-un-agent', 'consignes-system-prompt', 'outils-de-l-agent'],
  },
  {
    slug: 'creer-un-agent',
    category: 'start',
    title: 'Een agent aanmaken en bewerken',
    summary: 'Uw eerste agent in enkele minuten aanmaken en hem daarna op elk moment aanpassen.',
    plan: 'Het aantal agents hangt af van uw abonnement (menu “Limits”).',
    sections: [
      {
        title: 'De agent aanmaken',
        steps: [
          'Log in op app.permanenceia.com en open het menu “Assistants”, daarna “Create”.',
          'Kies het type: “Receive phone calls” om gesprekken te beantwoorden, “Make phone calls” om te bellen (campagnes, terugbelverzoeken).',
          'Geef een interne naam op (bijvoorbeeld “Receptie praktijk”) en controleer de tijdzone.',
          'Kies de taal en daarna de stem (“Voice & speech”) en luister ernaar.',
          'Schrijf de instructies (“Brain & prompt”) en de openingszin (“Greeting”).',
          'Klik op “Create assistant”.',
        ],
      },
      {
        title: 'De juiste tools toevoegen',
        text: 'Voeg in “Tools & actions” toe wat de agent nodig heeft: doorverbinden, gesprek beëindigen, afspraken maken, maatwerktools.',
      },
      {
        title: 'Koppelen en testen',
        list: [
          'Inkomende agent: wijs hem een nummer toe (sectie “General”, veld “Phone number”).',
          'Uitgaande agent: koppel hem aan een campagne of test hem door uzelf te laten bellen.',
          'Test hem in alle gevallen voordat u hem in gebruik neemt.',
        ],
      },
      {
        title: 'Een agent bewerken',
        steps: [
          'Menu “Assistants”, klik op de naam van de agent.',
          'Pas de instructies, de stem of de tools aan.',
          'Klik op “Save”: de volgende gesprekken gebruiken de nieuwe versie.',
        ],
        tip: 'Voer na elke wijziging een testgesprek uit om het gedrag te controleren.',
      },
    ],
    related: ['tester-son-agent', 'consignes-system-prompt', 'acheter-un-numero'],
  },
  {
    slug: 'tester-son-agent',
    category: 'start',
    title: 'Uw agent testen (chat, browser, telefoon)',
    summary: 'De drie manieren om een agent te testen voordat u hem in gebruik neemt, en wanneer u welke gebruikt.',
    sections: [
      {
        title: '1. De testchat: voor de instructies',
        text: 'De snelste manier om de logica van het gesprek te controleren, zonder stem.',
        steps: [
          'Open de agent en klik op “Test assistant” (chatpictogram).',
          'Schrijf zoals een klant dat zou doen: de agent antwoordt met dezelfde instructies en dezelfde tools als aan de telefoon.',
          'Controleer of hij de vragen begrijpt, de juiste gegevens verzamelt en zijn tools gebruikt.',
        ],
        tip: 'Elke testsessie wordt in “Inbox” opgeslagen met een badge “Test”, handig om het gesprek terug te lezen.',
      },
      {
        title: '2. Het gesprek in de browser: voor de stem',
        steps: [
          'Klik op “Speak with your assistant” en geef toegang tot de microfoon.',
          'Praat met de agent: controleer de stem, het tempo en hoe hij met onderbrekingen omgaat.',
        ],
        text: 'Doorverbinden werkt niet in deze modus.',
      },
      {
        title: '3. Het echte telefoongesprek: de laatste controle',
        list: [
          'Uitgaande agent: klik op “Speak to your assistant”, kies het telefoongesprek en voer uw nummer in: de agent belt u meteen.',
          'Inkomende agent: bel gewoon het nummer dat aan de agent is toegewezen.',
          'Dit is de enige test die alle tools valideert, inclusief doorverbinden.',
        ],
      },
      {
        title: 'Goed om te weten',
        list: [
          'Spraaktests verbruiken minuten net als echte gesprekken; de testchat verbruikt een klein beetje tegoed.',
          'Sla het nummer van de agent op in uw contacten om het makkelijk opnieuw te bellen.',
        ],
      },
    ],
    related: ['creer-un-agent', 'historique-des-appels', 'minutes-et-facturation'],
  },

  // ---------- Uw agent instellen ----------
  {
    slug: 'consignes-system-prompt',
    category: 'assistant',
    title: 'De instructies van de agent schrijven (system prompt)',
    summary: 'De instructies structureren die de rol, de toon en de regels van uw agent bepalen.',
    sections: [
      {
        title: 'Waarvoor dienen de instructies',
        text: 'De instructies (“System prompt”, sectie “Brain & prompt”) zijn het brein van de agent: zijn identiteit, wat hij weet, hoe hij praat en wat hij nooit mag doen. U kunt ze op drie manieren aanpassen: met de schrijfassistent (“AI Prompt Editor”), de visuele editor (“Flow Builder”) of door de tekst rechtstreeks te bewerken.',
      },
      {
        title: 'Beginnen met een sjabloon',
        steps: [
          'Klik in de agent, in de sectie met instructies, op “Templates”.',
          'Kies het sjabloon dat het dichtst bij uw situatie ligt (receptie, afspraken maken, support, kwalificatie…).',
          'Pas het aan uw bedrijf aan.',
        ],
      },
      {
        title: 'De 5 bouwstenen van goede instructies',
        list: [
          'Rol en identiteit: “Je bent de AI-assistent van praktijk X, gespecialiseerd in… Je zegt aan het begin van het gesprek dat je een AI bent.”',
          'Stijl: toon, aanspreekvorm (u of je), korte zinnen, geen vakjargon.',
          'Belangrijke informatie: diensten, openingstijden, tarieven, adres.',
          'Regels: wat gecontroleerd moet worden, wanneer doorverbinden, wat nooit beloofd mag worden.',
          'Werkwijzen: hoe veelvoorkomende situaties af te handelen (afspraak maken, klacht, spoedgeval).',
        ],
      },
      {
        title: 'Taal van de instructies',
        text: 'U kunt de instructies in de taal van uw keuze schrijven: de taal die de agent spreekt, stelt u apart in, in “Voice & speech”.',
      },
      {
        title: 'Veelgemaakte fouten',
        list: [
          'Te vaag: “Wees behulpzaam” is niet genoeg.',
          'Te star: elke zin uitschrijven maakt het gesprek kunstmatig.',
          'Te lang: gedetailleerde informatie hoort in de kennisbank.',
          'Vergeten situaties: geef aan wat er moet gebeuren bij een spoedgeval, een boze beller of een vraag die er niets mee te maken heeft.',
        ],
        tip: 'Instructies zijn nooit af: lees regelmatig de gesprekstranscripties terug en voeg de gevallen toe die niet goed werden afgehandeld.',
      },
    ],
    related: ['editeur-de-prompt-ia', 'flow-builder', 'base-de-connaissances'],
  },
  {
    slug: 'editeur-de-prompt-ia',
    category: 'assistant',
    title: 'De schrijfassistent gebruiken (AI Prompt Editor)',
    summary: 'De instructies van uw agent aanpassen door eenvoudig te vragen wat u wilt veranderen.',
    plan: 'Alle abonnementen.',
    sections: [
      {
        title: 'De editor openen',
        steps: [
          'Menu “Assistants”, open uw agent (hij moet minstens één keer zijn opgeslagen).',
          'Klik in de sectie met instructies, tabblad “AI Prompt Editor”, op “Launch AI Prompt Editor”.',
          'Kies of u verdergaat met uw huidige instructies, opnieuw begint of met een sjabloon begint.',
        ],
      },
      {
        title: 'Een wijziging vragen',
        text: 'Typ uw verzoek in gewone taal in de chat aan de linkerkant. Voorbeelden:',
        list: [
          '“Maak de toon hartelijker.”',
          '“Voeg ons retourbeleid toe: 30 dagen zonder opgave van reden.”',
          '“Voeg instructies toe om met een ontevreden klant om te gaan.”',
          'De snelknoppen “Make it more concise”, “Improve clarity”… voeren de gebruikelijke aanpassingen uit.',
        ],
      },
      {
        title: 'Nalezen en bevestigen',
        list: [
          'De voorgestelde wijzigingen worden in kleur getoond: groen voor een toevoeging, rood voor een verwijdering.',
          'Accepteer of weiger elke wijziging (“Accept” / “Reject”), of allemaal tegelijk (“Accept All” / “Reject All”).',
          'Klik op “Save” om op te slaan.',
        ],
        tip: 'Eén wijziging tegelijk geeft betere resultaten. Lees altijd na voordat u accepteert: u kent uw bedrijf beter dan de AI.',
      },
      {
        title: 'Variabelen en gegevens na het gesprek',
        list: [
          'Tabblad “Variables”: voeg velden toe zoals {{customer_name}} om elk gesprek te personaliseren.',
          'Tabblad “Post-Call”: bepaal welke informatie uit elk gesprek wordt gehaald (afspraak gemaakt, mate van interesse…). U kunt de AI vragen: “Welke gegevens zou ik moeten verzamelen?”',
        ],
      },
    ],
    related: ['consignes-system-prompt', 'donnees-apres-appel', 'tester-son-agent'],
  },
  {
    slug: 'message-d-accueil',
    category: 'assistant',
    title: 'Een goede begroeting schrijven',
    summary: 'Een korte en natuurlijke eerste zin schrijven, of een audio-opname gebruiken.',
    sections: [
      {
        title: 'De geschreven begroeting',
        text: 'Dit is de eerste zin die de agent uitspreekt (“Greeting” of “Initial message”). Hij wordt precies zo voorgelezen als hij geschreven is.',
        list: [
          'Mik op 5 tot 10 seconden: begroeting, bedrijfsnaam, vraag.',
          'Gebruik leestekens voor pauzes (“…” geeft een korte stilte).',
          'Schrijf getallen zoals ze uitgesproken moeten worden en schrijf moeilijke namen fonetisch.',
          'Zeg dat de beller met een AI-assistent spreekt en, indien van toepassing, dat het gesprek wordt opgenomen (verplicht volgens de Europese AI-verordening).',
          'Voorbeeld: “Goedemorgen, praktijk Jansen, u spreekt met Julie, de AI-assistent van de praktijk… Waarmee kan ik u helpen?”',
        ],
      },
      {
        title: 'De opgenomen begroeting',
        text: 'U kunt ook een audiobestand uploaden dat wordt afgespeeld zodra de agent opneemt, bijvoorbeeld ingesproken door iemand van uw team. Vermeld ook in die opname dat de beller met een AI-assistent spreekt.',
        steps: [
          'Neem de begroeting op in een rustige ruimte (korter dan 10 seconden).',
          'Upload het bestand in de instellingen van de agent en schakel het afspelen in.',
          'Kloon dezelfde stem voor de rest van het gesprek voor een natuurlijke overgang.',
        ],
      },
      {
        title: 'Controleren',
        text: 'Bel de agent en luister: uitspraak, pauzes, volume en de overgang naar het gesprek. Zorg voor een begroeting per taal als de agent meerdere talen spreekt.',
      },
    ],
    related: ['choisir-la-voix', 'consignes-system-prompt', 'tester-son-agent'],
  },
  {
    slug: 'choisir-la-voix',
    category: 'assistant',
    title: 'Een stem kiezen of klonen',
    summary: 'Een stem uit de bibliotheek kiezen, er een importeren of uw eigen stem klonen.',
    plan: 'Stemmen uit de bibliotheek: alle abonnementen. Gekloonde stemmen: vanaf het Assistent-abonnement.',
    sections: [
      {
        title: 'Een stem kiezen',
        steps: [
          'Open de agent, sectie “Voice & speech”.',
          'Kies de taal en daarna de stemleverancier (“TTS Provider”).',
          'Blader door de stemmen (man, vrouw, accent) en luister ernaar voordat u bevestigt.',
        ],
      },
      {
        title: 'Een stem uit de bibliotheek van de leverancier importeren',
        steps: [
          'Klik op “Import voice” naast de lijst met stemmen.',
          'Kies de leverancier, zoek een openbare stem in diens bibliotheek en kopieer de link of de ID.',
          'Plak die en klik op “Import”: de stem verschijnt in de lijst zodra hij klaar is.',
        ],
      },
      {
        title: 'Een stem klonen',
        steps: [
          'Klik op “Clone voice”.',
          'Kies de leverancier, de taal en een naam.',
          'Neem een fragment op of upload er een: één persoon, zonder achtergrondgeluid (minstens 10 seconden, idealiter 1 minuut of langer).',
          'Selecteer na de verwerking de nieuwe stem.',
        ],
        tip: 'Kloon alleen uw eigen stem of een stem waarvoor u schriftelijke toestemming van de betrokkene hebt.',
      },
    ],
    related: ['message-d-accueil', 'tester-son-agent', 'creer-un-agent'],
  },
  {
    slug: 'flow-builder',
    category: 'assistant',
    title: 'Een scenario ontwerpen met de Flow Builder',
    summary: 'Een gesprek tekenen met gekoppelde blokken, met meerdere paden afhankelijk van de antwoorden.',
    plan: 'Vanaf het Assistent-abonnement.',
    sections: [
      {
        title: 'Wanneer gebruikt u de Flow Builder?',
        text: 'De Flow Builder is ideaal voor een gestructureerd script met meerdere vertakkingen (kwalificatie, afspraken maken in meerdere stappen). Voor een eenvoudig en vrij gesprek volstaan geschreven instructies.',
      },
      {
        title: 'De Flow Builder openen',
        steps: [
          'Open de agent, sectie met instructies, tabblad “Flow Builder”.',
          'Klik op “Launch Flow Builder”.',
          'Begin met het bestaande scenario, een lege pagina of een sjabloon.',
        ],
      },
      {
        title: 'De 5 soorten blokken',
        list: [
          '“Start”: het begin van het gesprek en de openingszin (één per scenario).',
          '“Speak”: een zin die woord voor woord wordt uitgesproken.',
          '“Prompt”: een instructie die de AI herformuleert op basis van de context.',
          '“Action”: het gesprek doorverbinden, een afspraak maken of een maatwerktool starten.',
          '“End”: ophangen, doorverbinden of overdragen aan een andere agent.',
        ],
      },
      {
        title: 'Vertakkingen maken',
        steps: [
          'Voeg een blok toe met “+ Add Node”.',
          'Voeg in een blok “Speak” of “Prompt” uitkomsten toe (“Add Outcome”): “Geïnteresseerd”, “Niet geïnteresseerd”, “Later terugbellen”…',
          'Verbind elke uitkomst met het volgende blok door een lijn te trekken vanaf het aansluitpunt van die uitkomst.',
          'Klik op “Save”.',
        ],
        tip: 'Exporteer uw scenario regelmatig (“Export JSON”) om er een kopie van te bewaren. Test elk pad voordat u het in gebruik neemt.',
      },
    ],
    related: ['consignes-system-prompt', 'editeur-de-prompt-ia', 'tester-son-agent'],
  },

  // ---------- Kennis, agenda en tools ----------
  {
    slug: 'base-de-connaissances',
    category: 'tools',
    title: 'Een kennisbank aanmaken',
    summary: 'De agent uw documenten en webpagina’s geven, zodat hij antwoordt met uw informatie.',
    plan: 'Het aantal kennisbanken hangt af van uw abonnement (menu “Limits”).',
    sections: [
      {
        title: 'De kennisbank aanmaken',
        steps: [
          'Menu “Knowledge base”, maak daarna een kennisbank aan (naam en beschrijving).',
          'Voeg uw inhoud toe: pdf-, Word- (.docx) of tekstbestanden (.txt), of het adres van pagina’s van uw website.',
          'Wacht op de status “Active” (“Processing” tijdens de analyse).',
          'Selecteer in de agent, sectie “Knowledgebase”, de kennisbank en sla op.',
        ],
      },
      {
        title: 'De raadpleegmodus kiezen',
        list: [
          '“Function Call” (aanbevolen): de agent raadpleegt de kennisbank alleen wanneer dat nuttig is. Sneller.',
          '“Prompt Injection”: de kennisbank wordt na elke zin van de klant geraadpleegd. Nauwkeuriger maar trager, geschikt voor support.',
        ],
      },
      {
        title: 'Tips',
        list: [
          'Korte inhoud, met duidelijke titels en opsommingen.',
          'Openbare webpagina’s: sommige beveiligde websites blokkeren het uitlezen (status “Failed”). Exporteer de inhoud in dat geval als pdf en upload die.',
          'De 10 meest gestelde vragen kunnen ook rechtstreeks in de instructies.',
          'Lees de transcripties terug om te controleren of de agent uw informatie correct weergeeft.',
        ],
      },
    ],
    related: ['consignes-system-prompt', 'outils-de-l-agent', 'historique-des-appels'],
  },
  {
    slug: 'rendez-vous-cal-com',
    category: 'tools',
    title: 'Afspraken maken met Cal.com',
    summary: 'Cal.com koppelen zodat de agent tijdens het gesprek uw beschikbaarheid raadpleegt en boekt.',
    plan: 'Alle abonnementen.',
    sections: [
      {
        title: 'De Cal.com-sleutel ophalen',
        steps: [
          'In Cal.com: “Settings” → “Developer” → “API Keys”.',
          'Maak een sleutel aan en kopieer die (hij begint met cal_live_).',
        ],
      },
      {
        title: 'Cal.com aan de agent koppelen',
        steps: [
          'Open de agent, sectie “Tools & actions”, daarna “Appointment Scheduling”.',
          'Kies “Cal.com” en de regio van uw account (standaard US, EU als uw account Europees is).',
          'Plak de sleutel en kies het type afspraak (persoonlijk of team).',
          'Klik op “Sync Event”: de boekingsvelden (naam, e-mail, telefoon, aangepaste velden) worden automatisch ingesteld.',
          'Sla de agent op.',
        ],
      },
      {
        title: 'Zorgen dat de uitnodiging wordt verstuurd',
        list: [
          'Voeg een e-mailvariabele toe aan de agent en vul die in voor uw contacten, of vraag de agent om het adres te noteren.',
          'Meerdere soorten afspraken? Klik op “+” naast “Appointment Scheduling” om er meer toe te voegen.',
          'Als u de velden in Cal.com wijzigt, klik dan opnieuw op “Sync Event”. Bij een fout zet “Troubleshoot” de velden terug.',
        ],
        tip: 'Uw Google- of Outlook-agenda koppelt u aan Cal.com: de agent ziet dan uw werkelijke beschikbaarheid.',
      },
    ],
    related: ['rendez-vous-calendly', 'outils-de-l-agent', 'tester-son-agent'],
  },
  {
    slug: 'rendez-vous-calendly',
    category: 'tools',
    title: 'Afspraken maken met Calendly',
    summary: 'Calendly koppelen zodat de agent tijdens het gesprek de beschikbare tijden controleert en meteen boekt.',
    plan: 'Alle abonnementen.',
    sections: [
      {
        title: 'Calendly koppelen',
        steps: [
          'Open de agent, sectie “Tools & actions”, daarna “Appointment Scheduling”.',
          'Kies “Calendly”, daarna “Connect to Calendly” en geef toegang.',
          'Klik op “Load Events” en kies het type afspraak.',
          'Sla de agent op.',
        ],
        tip: 'Lukt het koppelen niet? Probeer het opnieuw in een privévenster van uw browser.',
      },
      {
        title: 'De locatie van de afspraak instellen in Calendly',
        text: 'De agent kan geen videovergaderlink aanmaken. Open in Calendly het type afspraak en stel de locatie (“Location”) in op “Custom” (aanbevolen) of “Phone Call”. Een afspraak die alleen via video kan (Meet, Zoom, Teams) laat de boeking mislukken: voeg minstens één van deze opties toe.',
      },
      {
        title: 'Meerdere agenda’s',
        text: 'Klik op “+” om andere soorten afspraken toe te voegen en beschrijf in “When to schedule” wanneer welke gebruikt moet worden. Met een beheerdersaccount van een Calendly-organisatie ziet u ook teamafspraken.',
      },
    ],
    related: ['rendez-vous-cal-com', 'outils-de-l-agent', 'tester-son-agent'],
  },
  {
    slug: 'outils-de-l-agent',
    category: 'tools',
    title: 'Agenttools: doorverbinden, ophangen, toetsen',
    summary: 'De ingebouwde acties die de agent tijdens het gesprek kan uitvoeren en hoe u ze instelt.',
    sections: [
      {
        title: 'Waar u ze vindt',
        text: 'Open de agent, sectie “Tools & actions”. Elke tool wordt ingeschakeld en daarna gebruikt op basis van wat u in de instructies schrijft.',
      },
      {
        title: 'De ingebouwde tools',
        list: [
          'Gesprek beëindigen (“End call”): de agent hangt beleefd op, bijvoorbeeld wanneer de klant gedag zegt.',
          'Doorverbinden (“Call transfer”): de agent verbindt het gesprek door naar een medewerker of een ander nummer. Geef het nummer op en wanneer er doorverbonden moet worden (spoedgeval, vraag naar een adviseur, klant die klaar is om te kopen).',
          'Afspraken maken (“Appointment Scheduling”): Cal.com of Calendly, zelf gekoppeld aan Google of Outlook.',
          'Toetsen van het toetsenblok (“DTMF”): de agent toetst cijfers in om door een keuzemenu te navigeren of een toestelnummer in te voeren.',
        ],
      },
      {
        title: 'Meer mogelijkheden',
        list: [
          'Maatwerktools raadplegen uw software live (voorraad, klantdossier…).',
          'Na het gesprek sturen automatiseringen de resultaten naar uw CRM, Google Sheets of per e-mail.',
        ],
        tip: 'Tools zijn te combineren: een gegeven controleren, een afspraak maken en daarna zo nodig doorverbinden. Beschrijf die volgorde in de instructies.',
      },
    ],
    related: ['outils-sur-mesure', 'rendez-vous-cal-com', 'automatisations'],
  },
  {
    slug: 'outils-sur-mesure',
    category: 'tools',
    title: 'Een maatwerktool maken (tijdens het gesprek)',
    summary: 'De agent uw software live laten raadplegen: bestelstatus, klantcontrole, beschikbaarheid.',
    plan: 'Het aantal tools hangt af van uw abonnement (menu “Limits”).',
    sections: [
      {
        title: 'De tool aanmaken',
        steps: [
          'Menu “Mid call tools / MCP”, daarna “Create Mid-Call Tool”.',
          'Naam: letters, cijfers en underscores (bijvoorbeeld check_order_status).',
          'Beschrijving: wanneer en waarom de agent de tool moet gebruiken.',
          'Type “HTTP request”: geef het adres van uw API op (“Endpoint”), de methode (GET, POST…), de maximale wachttijd en de headers (bijvoorbeeld een autorisatiesleutel).',
        ],
      },
      {
        title: 'Bepalen welke gegevens verzameld worden',
        list: [
          'Voeg de parameters toe die de agent aan de klant zal vragen: naam, type (tekst, getal, decimaal, ja/nee) en een beschrijving met het verwachte formaat (“bestelnummer in het formaat ORD-12345”).',
          'Een parameter kan in het adres staan: https://api.voorbeeld.nl/bestellingen/{order_id}.',
          'Vaste velden (“Static fields”) worden bij elke aanroep meegestuurd zonder dat de AI ze wijzigt.',
          'Automatische variabelen: {{customer_phone}} (nummer van de klant), {{current_date}}, {{current_time}}, {{assistant_name}}…',
        ],
      },
      {
        title: 'Testen en koppelen',
        steps: [
          'Klik op “Test tool”: er wordt een echt verzoek met voorbeeldgegevens verstuurd en u ziet het antwoord.',
          'Wijs de tool toe aan de agent.',
          'Geef in de instructies aan wanneer de tool gebruikt moet worden en hoe het resultaat aan de klant wordt uitgelegd.',
        ],
        tip: 'Het type “Automation Platform” maakt automatisch een automatiseringsscenario aan dat aan de tool is gekoppeld, voor logica in meerdere stappen zonder code (Assistent-abonnement en hoger).',
      },
    ],
    related: ['outils-de-l-agent', 'automatisations', 'consignes-system-prompt'],
  },

  // ---------- Nummers en telefonie ----------
  {
    slug: 'acheter-un-numero',
    category: 'phone',
    title: 'Een nummer aanvragen en aan een agent toewijzen',
    summary: 'Een eigen nummer kopen vanuit uw omgeving, of uw huidige nummer behouden, en het daarna aan uw agent koppelen.',
    plan: 'Eigen nummers vanaf {numberFrom} per maand, afhankelijk van het land; hoeveel nummers u kunt koppelen hangt af van het abonnement (nummers zijn niet inbegrepen in de abonnementsprijs).',
    sections: [
      {
        title: 'Een nummer kopen',
        steps: [
          'Menu “Get new phone number”.',
          'Kies het land en het type (in Nederland bijvoorbeeld geografisch zoals 020 of 010, landelijk 085/088 of gratis 0800, afhankelijk van de beschikbaarheid): de maandprijs wordt vóór de aankoop getoond.',
          'Bevestig: het nummer verschijnt in “Your phone numbers”.',
        ],
        text: 'Staat het gewenste nummer er niet tussen? Neem contact met ons op: wij kunnen het bij de provider aanvragen (bewijsstukken afhankelijk van het land, doorgaans 1 tot 3 werkdagen).',
      },
      {
        title: 'Het nummer aan de agent toewijzen',
        steps: [
          'Menu “Assistants”, open de agent, sectie “General”.',
          'Selecteer het nummer in “Phone number”.',
          'Klik op “Save”.',
        ],
      },
      {
        title: 'Uw huidige nummer behouden',
        list: [
          'Het eenvoudigst: stel bij uw provider doorschakeling naar het nieuwe nummer in.',
          'Gebruikt u Twilio of Telnyx? Importeer uw nummers.',
          'Hebt u een telefooncentrale of een SIP-provider? Koppel die via SIP (alle abonnementen).',
        ],
        tip: 'Bel na elke wijziging het nummer om te controleren of de agent opneemt.',
      },
    ],
    related: ['importer-twilio-telnyx', 'connexion-sip', 'numero-presente'],
  },
  {
    slug: 'importer-twilio-telnyx',
    category: 'phone',
    title: 'Uw Twilio- of Telnyx-nummers importeren',
    summary: 'Uw Twilio- of Telnyx-nummers met uw agent gebruiken via een SIP-trunk.',
    plan: 'Alle abonnementen.',
    sections: [
      {
        title: 'Voordat u begint',
        text: 'Open in uw omgeving “Your phone numbers” en daarna “Integrate SIP trunk”: het formulier toont het SIP-ontvangstadres dat u bij uw provider moet opgeven. Houd dit scherm open.',
      },
      {
        title: 'Bij Twilio',
        steps: [
          'Twilio-console: “Elastic SIP Trunking” → “Create new SIP Trunk”.',
          '“Termination”: voer alleen een naam in (bijvoorbeeld uwbedrijf); Twilio voegt .pstn.twilio.com toe. Noteer het volledige adres.',
          'Stel in “Authentication” de toegang in (lijst met IP-adressen of inloggegevens).',
          '“Origination”: voeg het SIP-ontvangstadres toe dat in uw omgeving wordt getoond.',
          '“Numbers”: voeg de nummers toe die u wilt gebruiken.',
        ],
      },
      {
        title: 'Bij Telnyx',
        steps: [
          'Telnyx-portaal: “Voice” → “SIP Trunking” → “Create SIP Connection”, type “FQDN”.',
          'Voeg het SIP-ontvangstadres toe dat in uw omgeving wordt getoond (poort 5060) en selecteer het als primaire FQDN.',
          'Uitgaande authenticatie: “Credentials”, met een gebruikersnaam en wachtwoord die u noteert.',
          'Wijs uw nummers toe en sta de landen toe die gebeld mogen worden (“Outbound Voice Profiles” → “Allowed Destinations”).',
        ],
      },
      {
        title: 'Het nummer in uw omgeving importeren',
        steps: [
          '“Your phone numbers” → “Integrate SIP trunk”.',
          'Voer het nummer in internationaal formaat in, met de gebruikersnaam en het wachtwoord.',
          'SIP-adres: het genoteerde Twilio-adres (uwbedrijf.pstn.twilio.com) of sip.telnyx.com voor Telnyx.',
          'Kies het type autorisatie en het land en sla op.',
          'Wijs het nummer toe aan uw agent en test een inkomend en een uitgaand gesprek.',
        ],
        tip: 'De trunk maakt u maar één keer aan: voeg elk nieuw nummer toe aan de trunk en importeer het daarna. Wachtwoord: minimaal 12 tekens, met hoofdletters, kleine letters en cijfers.',
      },
    ],
    related: ['connexion-sip', 'acheter-un-numero', 'numero-presente'],
  },
  {
    slug: 'connexion-sip',
    category: 'phone',
    title: 'Uw telefooncentrale of provider via SIP koppelen',
    summary: 'Uw telefooncentrale (PBX) of VoIP-provider koppelen om uw nummers te behouden.',
    plan: 'Alle abonnementen.',
    sections: [
      {
        title: 'Twee manieren om te koppelen',
        list: [
          '“SIP Extension”: de agent wordt een toestel van uw centrale (bijvoorbeeld toestel 1011). Ideaal om te testen of om bepaalde gesprekken naar de AI te routeren.',
          '“Phone Number (DID)”: een volledig nummer wordt aan de agent gekoppeld, voor inkomende én uitgaande gesprekken.',
        ],
      },
      {
        title: 'De koppeling instellen',
        steps: [
          'Menu “Your phone numbers”, daarna “Integrate SIP trunk”.',
          'Kies het type trunk en voer het toestel of het nummer in, met de gebruikersnaam en het wachtwoord van uw provider.',
          'Uitgaand: geef het adres van de SIP-server op (zonder poort) en schakel het vaste IP-adres alleen in als uw provider dat vereist.',
          'Kies het nummerformaat dat uw provider verwacht: internationaal met +, internationaal zonder +, of nationaal.',
          'Inkomend: laat uw provider verwijzen naar het SIP-ontvangstadres dat in het formulier wordt getoond, met authenticatie via toegestane IP-adressen of via gebruikersnaam en wachtwoord.',
          'Kies het land van de trunk en sla op.',
        ],
      },
      {
        title: 'Controleren',
        list: [
          'Bel het nummer of het toestel: de agent moet opnemen.',
          'Start een uitgaand testgesprek vanuit de agent.',
          'Wijzigt u het wachtwoord bij uw provider, wijzig het dan ook in uw omgeving.',
        ],
        tip: 'U houdt de controle over uw nummers: uw centrale bepaalt welke gesprekken naar de agent gaan en welke bij u blijven.',
      },
    ],
    related: ['importer-twilio-telnyx', 'acheter-un-numero', 'numero-presente'],
  },
  {
    slug: 'numero-presente',
    category: 'phone',
    title: 'Het weergegeven nummer bij uitgaande gesprekken kiezen',
    summary: 'Een eigen nummer, uw eigen geverifieerde nummer of het nummer van uw SIP-centrale weergeven.',
    sections: [
      {
        title: 'Drie mogelijkheden',
        list: [
          'Een eigen nummer dat u in uw omgeving hebt gekocht: selecteer het in de agent (“General” → “Phone number”). Geen verificatie nodig, en het kan ook terugbelverzoeken ontvangen.',
          'Uw bestaande nummer (vast of mobiel): verifieer het met een code die u per sms of telefoontje ontvangt. Het wordt bij uw contacten weergegeven, maar inkomende gesprekken op dit nummer komen niet bij de agent terecht. (Betaalde abonnementen.)',
          'Uw SIP-centrale: het weergegeven nummer is het nummer dat uw provider toestaat.',
        ],
      },
      {
        title: 'Regels om na te leven',
        list: [
          'Geef alleen nummers weer waarvan u houder bent of die u mag gebruiken.',
          'Sommige landen verbieden het weergeven van een buitenlands of niet-geverifieerd nummer. In Nederland blokkeren providers gesprekken uit het buitenland die een Nederlands nummer weergeven (anti-spoofing): test daarom altijd vooraf of uw nummer goed doorkomt.',
        ],
        tip: 'Bel vóór een grote campagne uw eigen telefoon om het weergegeven nummer te controleren.',
      },
    ],
    related: ['acheter-un-numero', 'campagnes-d-appels', 'connexion-sip'],
  },

  // ---------- Website en berichtenapps ----------
  {
    slug: 'widget-site-web',
    category: 'channels',
    title: 'De agent op uw website installeren (webwidget)',
    summary: 'Een chat- en belknop aan uw website toevoegen, in de kleuren van uw merk.',
    plan: 'Alle abonnementen.',
    sections: [
      {
        title: 'De widget instellen',
        steps: [
          'Open de agent en klik op “Web widget”.',
          'Kies de modus: “Voice & Chat” (aanbevolen), “Chat Only” of “Voice Only”.',
          'Stel de positie, de kleur, de grootte en het automatisch openen in.',
          'Pas de teksten van de knop (“Button”) en de kop (“Header & Modal”) aan en voeg uw avatar toe (vierkante afbeelding, maximaal 512 kB).',
          'Optioneel: een formulier vóór het gesprek (“Pre-Chat Form”) om naam, e-mail of telefoonnummer te vragen. Elk veld vult een variabele van de agent.',
        ],
      },
      {
        title: 'Testen en daarna installeren',
        steps: [
          'Test in het live voorbeeld bovenaan de pagina (“Reset Data” simuleert een nieuwe bezoeker).',
          'Sla op en kopieer daarna de code uit de sectie “Embed Code”.',
          'Plak die vlak vóór de tag </body> van uw website, of geef hem door aan uw webbouwer.',
        ],
        tip: 'Sla altijd op voordat u de code kopieert: de widget laadt zijn instellingen vanuit uw omgeving. Voor spraak is een website met HTTPS vereist.',
      },
      {
        title: 'In de dagelijkse praktijk',
        list: [
          'Alle gesprekken via de widget komen binnen in “Inbox”.',
          'Met “Enable Widget” verbergt u de widget zonder de code te verwijderen.',
          'Wilt u klikbare links in de chat? Vraag in de instructies om ze te schrijven in het formaat [tekst](adres).',
        ],
      },
    ],
    related: ['historique-des-appels', 'whatsapp', 'consignes-system-prompt'],
  },
  {
    slug: 'whatsapp',
    category: 'channels',
    title: 'WhatsApp aan uw agent koppelen',
    summary: 'De agent laten antwoorden op WhatsApp en door Meta goedgekeurde berichtsjablonen versturen.',
    plan: 'Alle abonnementen. Berichten worden betaald met berichtcredits.',
    sections: [
      {
        title: 'De WhatsApp-afzender aanmaken',
        steps: [
          'Menu “Channels” → “WhatsApp”, maak daarna een afzender aan.',
          'Kies een nummer dat u in uw omgeving hebt gekocht (automatische verificatie) of uw eigen mobiele nummer (code per sms of telefoontje). Dit nummer mag nog niet op WhatsApp in gebruik zijn.',
          'Voer de naam in die klanten te zien krijgen en volg daarna het Meta-venster (“Login with Facebook”), waarin u een nieuw WhatsApp Business-account aanmaakt.',
        ],
        tip: 'Tijdens de verificatie van een gekocht nummer worden de inkomende gesprekken een paar minuten onderschept: start de verificatie niet op een nummer dat al in gebruik is.',
      },
      {
        title: 'De agent koppelen',
        steps: [
          'Wanneer de afzender “Online” is, bewerkt u hem en kiest u de agent.',
          'Schakel “AI Enabled” in en sla op: de agent beantwoordt voortaan berichten, zet spraakberichten om in tekst en kan afbeeldingen analyseren.',
        ],
      },
      {
        title: 'De regels van WhatsApp',
        list: [
          'Wanneer een klant u een bericht stuurt, kunt u gedurende 24 uur vrij antwoorden.',
          'Om als eerste een bericht te sturen of na 24 uur op te volgen, hebt u een door Meta goedgekeurd berichtsjabloon (“Template”) nodig: service, marketing of authenticatie.',
          'Een nieuwe afzender is beperkt tot ongeveer 250 gesprekken per dag; die limiet stijgt als uw berichten goed worden ontvangen (weinig blokkeringen en meldingen).',
        ],
      },
    ],
    related: ['campagnes-d-appels', 'historique-des-appels', 'automatisations'],
  },

  // ---------- Campagnes en contacten ----------
  {
    slug: 'campagnes-d-appels',
    category: 'outbound',
    title: 'Een belcampagne (of berichtencampagne) starten',
    summary: 'Een lijst met contacten laten bellen door uw agent, met tijdvakken, nieuwe pogingen en doelen.',
    plan: 'Vanaf het Assistent-abonnement.',
    sections: [
      {
        title: 'Voordat u begint',
        list: [
          'Gesprekken: een agent “Make phone calls” met een nummer, en beschikbare minuten.',
          'WhatsApp: een gekoppelde afzender en een goedgekeurd sjabloon. Sms: een nummer dat sms ondersteunt. Beide gebruiken berichtcredits.',
          'Contacten die ermee hebben ingestemd om gebeld te worden (gedateerde toestemming) of, afhankelijk van het land, bestaande klanten; nooit een gekochte of gehuurde lijst (zie de gids “Wie mag uw agent bellen?”).',
        ],
      },
      {
        title: 'De campagne aanmaken',
        steps: [
          'Menu “Campaigns”, maak een campagne aan: naam, kanaal (“Call”, “WhatsApp” of “SMS”) en agent.',
          'Tijdvakken: een of meer periodes per dag (bijvoorbeeld 9.00–12.00 uur en 14.00–18.00 uur) en de toegestane dagen.',
          'Nieuwe pogingen: aantal pogingen (1 tot 5) en de tijd tussen twee pogingen; kies of een voicemail als poging telt.',
          'Optie “Retry until goal completed”: de campagne blijft bellen tot het doel is bereikt (een ja/nee-veld uit de gegevens na het gesprek, bijvoorbeeld afspraak gemaakt).',
          'Voeg de contacten toe (handmatig, via een bestand) en klik daarna op “Start Campaign”.',
        ],
      },
      {
        title: 'Opvolgen en bijsturen',
        list: [
          'Het dashboard van de campagne toont de lopende en afgeronde gesprekken, de resterende contacten en het volgende gesprek.',
          'Instellingen wijzigen: pauzeer de campagne, pas aan en start opnieuw. Er gaat niets verloren.',
          'Terugvaloptie: na de laatste belpoging eenmalig een sms of een WhatsApp-sjabloon sturen.',
        ],
        tip: 'Begin met 2 of 3 pogingen tijdens de kantooruren van het land van uw contacten, en respecteer altijd bezwaren (uitsluitingslijst, menu “Blacklist”).',
      },
    ],
    related: ['contacts-leads', 'numero-presente', 'donnees-apres-appel', 'qui-peut-on-appeler'],
  },
  {
    slug: 'contacts-leads',
    category: 'outbound',
    title: 'Uw contacten (leads) importeren en beheren',
    summary: 'Een contactenbestand importeren, elk gesprek personaliseren en de statussen opvolgen.',
    sections: [
      {
        title: 'Het bestand voorbereiden',
        list: [
          'CSV- of Excel-formaat, met een kolom phone_number (verplicht).',
          'Eén kolom per variabele van de agent (bijvoorbeeld customer_name, company) om het gesprek te personaliseren.',
          'Nummers in internationaal formaat zonder spaties (+31612345678), of nationaal formaat met één bestand per land.',
          'Download het voorbeeldbestand dat bij het importeren wordt aangeboden om met het juiste formaat te beginnen.',
          'Rechtsgrond, vóór elke import: controleer of elk contact heeft ingestemd om gebeld te worden of al klant is (volgens de regels van het land), en noteer de bron en datum van die toestemming, bijvoorbeeld in een kolom bron_toestemming. Importeer nooit een gekochte of gehuurde lijst. Zie de gids “Wie mag uw agent bellen?”.',
        ],
      },
      {
        title: 'Importeren',
        steps: [
          'Menu “Leads” (of het tabblad contacten van de campagne), daarna “Import Leads”.',
          'Kies de campagne, het nummerformaat en zo nodig het aantal secundaire nummers.',
          'Koppel elke kolom aan het juiste veld (automatische herkenning) en start daarna de import.',
          'Ongeldige of dubbele regels worden overgeslagen en vermeld in een downloadbaar rapport.',
        ],
      },
      {
        title: 'De contacten beheren',
        list: [
          'Statussen: “Created” (te bellen), “Processing”, “Rescheduled” (nieuwe poging gepland), “Completed”, “Max Retries”.',
          'Zet u een contact terug op “Created”, dan wordt het opnieuw gebeld; zet u het op “Completed”, dan stoppen de gesprekken.',
          'Secundaire nummers: worden op volgorde gebeld als het hoofdnummer niet opneemt (alleen belcampagnes).',
          'Filters, bulkverwijdering en CSV-export zijn beschikbaar in de lijst.',
        ],
        tip: 'Doe eerst een kleine testimport om het formaat te controleren en importeer daarna de rest.',
      },
    ],
    related: ['campagnes-d-appels', 'donnees-apres-appel', 'editeur-de-prompt-ia', 'qui-peut-on-appeler'],
  },

  // ---------- Gespreksopvolging en automatiseringen ----------
  {
    slug: 'historique-des-appels',
    category: 'results',
    title: 'Uw gesprekken en conversaties terugvinden',
    summary: 'Opnames beluisteren, transcripties lezen en schriftelijke gesprekken opvolgen.',
    plan: 'Alle abonnementen.',
    sections: [
      {
        title: 'De gesprekken',
        steps: [
          'Menu “Calls history”.',
          'Filter op agent, op datum of op richting (inkomend / uitgaand).',
          'Open een gesprek: opname, transcriptie, samenvatting, geëxtraheerde gegevens en duur.',
        ],
      },
      {
        title: 'De schriftelijke gesprekken',
        text: 'Het menu “Inbox” bundelt de schriftelijke gesprekken met uw agents:',
        list: [
          '“Web widget”: de gesprekken via uw website, met de formuliergegevens.',
          '“WhatsApp”: de WhatsApp-gesprekken, met de status van het 24-uursvenster.',
          '“Test”: uw testchatsessies.',
          'Filter op type, agent of datum; open een gesprek om berichten, variabelen en kosten te zien.',
        ],
      },
      {
        title: 'Er uw voordeel mee doen',
        list: [
          'Beluister elke week een paar gesprekken en voeg de gevallen die niet goed werden afgehandeld toe aan de instructies.',
          'Verwijder testgesprekken om uw geschiedenis overzichtelijk te houden (verwijderen is definitief).',
        ],
      },
    ],
    related: ['donnees-apres-appel', 'automatisations', 'consignes-system-prompt'],
  },
  {
    slug: 'donnees-apres-appel',
    category: 'results',
    title: 'De informatie uit elk gesprek halen',
    summary: 'Bepalen welke gegevens de AI na elk gesprek extraheert en die naar uw tools sturen.',
    plan: 'Alle abonnementen.',
    sections: [
      {
        title: 'Bepalen welke gegevens worden geëxtraheerd',
        text: 'Na elk gesprek leest de AI het gesprek terug en vult de velden in die u hebt gedefinieerd (“Post-call evaluation”). Standaard bestaan er twee velden: “status” (doel bereikt, ja/nee) en “summary” (samenvatting).',
        steps: [
          'Open de agent, sectie met de gegevens na het gesprek.',
          'Voeg een veld toe: naam in kleine letters zonder spaties (bijvoorbeeld afspraak_gemaakt), type (tekst, getal, ja/nee) en een nauwkeurige beschrijving.',
          'Voorbeelden: budget (getal), beslisser (ja/nee), reden_gesprek (tekst), urgentie (getal van 1 tot 10).',
        ],
        tip: 'Hoe nauwkeuriger de beschrijving, hoe betrouwbaarder de extractie. Stem haar af op het doel dat in de instructies staat.',
      },
      {
        title: 'De resultaten naar uw tools sturen',
        steps: [
          'Sectie “Webhooks & channels”: schakel het versturen in en plak het ontvangstadres (webhook).',
          'Kies of u alleen afgeronde gesprekken of alle gesprekken verstuurt, met of zonder de link naar de opname.',
          'Sla op en klik daarna op “Make test request” om de ontvangst te controleren.',
        ],
        text: 'Elke verzending bevat het nummer, de duur, de status, de geëxtraheerde gegevens, de oorspronkelijke variabelen en de transcriptie.',
      },
      {
        title: 'Deze gegevens gebruiken',
        list: [
          'Automatisch opnieuw bellen binnen een campagne zolang het doel niet is bereikt.',
          'Uw CRM of een Google Sheets-blad bijwerken of uw team een melding sturen met automatiseringen.',
        ],
      },
    ],
    related: ['automatisations', 'historique-des-appels', 'campagnes-d-appels'],
  },
  {
    slug: 'automatisations',
    category: 'results',
    title: 'Aan de slag met automatiseringen',
    summary: 'Gespreksresultaten automatisch naar uw CRM, Google Sheets, Slack of per e-mail sturen.',
    plan: 'Vanaf het Assistent-abonnement (5.000 automatiseringsruns per maand, 50.000 met Callcenter).',
    sections: [
      {
        title: 'Het principe',
        text: 'Het menu “Automate platform” opent een no-code scenario-editor die gekoppeld is aan meer dan 300 tools. Een scenario (“flow”) begint met een trigger en voert daarna een reeks acties uit.',
      },
      {
        title: 'Handige triggers',
        list: [
          'Einde van het gesprek (“Call Ended”): start zodra een gesprek eindigt, met de transcriptie en de geëxtraheerde gegevens.',
          'Inkomend gesprek: start voordat de agent opneemt, om de klant in uw CRM op te zoeken en de begroeting te personaliseren.',
          'Verder: planning (elke dag om 8.00 uur…), webhook, WhatsApp-gebeurtenis.',
        ],
      },
      {
        title: 'Uw eerste scenario maken',
        steps: [
          'Open “Automate platform” en maak een flow aan (of begin met een sjabloon).',
          'Kies de trigger “Call Ended”.',
          'Voeg een actie toe: een rij in Google Sheets, een contact in uw CRM, een e-mail of een Slack-bericht aan het team.',
          'Voeg de gespreksgegevens (samenvatting, nummer, geëxtraheerde velden) in de actie in.',
          'Test elke stap en publiceer daarna de flow.',
        ],
        tip: 'Veelgebruikte voorbeelden: HubSpot bijwerken na elk gesprek, een gekwalificeerd contact aan een terugbelcampagne toevoegen, de samenvatting per e-mail versturen.',
      },
    ],
    related: ['donnees-apres-appel', 'outils-sur-mesure', 'historique-des-appels'],
  },

  // ---------- Minuten en facturatie ----------
  {
    slug: 'minutes-et-facturation',
    category: 'billing',
    title: 'Minuten, tegoed en facturatie begrijpen',
    summary: 'Hoe minuten worden geteld, waarvoor het tegoed dient en waar u uw abonnement beheert.',
    sections: [
      {
        title: 'Wat u betaalt',
        list: [
          'Uw maandabonnement, met inbegrepen belminuten.',
          'De minuten boven uw abonnement, betaald met uw tegoed (“Credits”).',
          'WhatsApp-berichten, sms’jes en schriftelijke antwoorden van de AI, betaald met berichtcredits.',
          'Eigen nummers, vanaf {numberFrom} per maand, afhankelijk van het land.',
        ],
      },
      {
        title: 'Het tellen van de minuten',
        list: [
          'De minuten die elk gesprek verbruikt, staan in “Calls history”.',
          'De inbegrepen minuten worden elke maand vernieuwd, op de datum van uw abonnement.',
          'Testgesprekken (browser of telefoon) verbruiken ook minuten.',
        ],
      },
      {
        title: 'Waar u wat beheert',
        list: [
          '“Add credits”: een opwaardering kopen (vrij bedrag, vanaf $ 5); het tegoed vervalt niet. U kunt er ook berichtcredits kopen: 100 credits voor $ 1, vanaf 100 credits.',
          '“Change plan”: van abonnement wisselen. Zit u er vaak boven, dan is het grotere abonnement per minuut goedkoper.',
          '“Billing info”: betaalmethode, facturen en abonnement.',
          '“Limits”: wat uw abonnement toestaat (agents, gelijktijdige gesprekken, nummers…).',
        ],
        tip: 'Het dashboard (“Dashboard”) toont uw verbruik van de maand. Met automatiseringen kunt u een melding krijgen wanneer u de limiet nadert.',
      },
    ],
    related: ['tester-son-agent', 'acheter-un-numero', 'campagnes-d-appels'],
  },
  // ---------- Toevoegingen: doorschakelen, regels voor uitgaand bellen, controles, maandelijkse check ----------
  {
    slug: 'renvoi-d-appel',
    category: 'phone',
    title: 'Uw eigen nummer houden met doorschakelen',
    summary: 'Laat de agent alleen opnemen als u zelf niet opneemt, in gesprek bent of gesloten bent, zonder van nummer te wisselen.',
    plan: 'Alle abonnementen. Doorschakelen wordt gefactureerd door uw provider.',
    sections: [
      {
        title: 'Het principe',
        text: 'U houdt uw nummer op uw visitekaartjes, website en advertenties. Bij uw provider schakelt u door naar het nummer van de agent: al uw gesprekken, of alleen de gesprekken die u niet aanneemt. Voor uw klanten verandert er niets.',
      },
      {
        title: 'Doorschakelcodes op een mobiele telefoon',
        text: 'Bij KPN, Vodafone en Odido (en de meeste andere providers) toetst u de code, dan het nummer van de agent in internationaal formaat (+31… of 0031…), gevolgd door # en de beltoets. U kunt doorschakelen ook instellen in de app van uw provider.',
        list: [
          'Als u niet opneemt: **61*nummer van de agent# (u kunt de wachttijd toevoegen, van 5 tot 30 seconden, bijvoorbeeld **61*nummer**20#).',
          'Als u in gesprek bent: **67*nummer van de agent#',
          'Als uw telefoon uit staat of geen bereik heeft: **62*nummer van de agent#',
          'Alle gesprekken, altijd: **21*nummer van de agent#',
          'Uitschakelen: ##61#, ##67#, ##62# of ##21#, of ##002# om alles te annuleren (let op: ##002# schakelt ook de doorschakeling naar uw voicemail uit).',
        ],
      },
      {
        title: 'Op een vaste lijn of telefooncentrale',
        steps: [
          'Open de online omgeving van uw provider (of het menu van uw telefooncentrale).',
          'Zoek naar “doorschakelen” of “doorverbinden”.',
          'Kies het type doorschakeling (bij geen gehoor, bij bezet of altijd) en vul het nummer van de agent in.',
          'Sla op en bel daarna uw nummer vanaf een andere telefoon om het te controleren.',
        ],
      },
      {
        title: 'De juiste instelling voor uw bedrijf',
        list: [
          'U wilt zelf blijven opnemen: doorschakelen bij geen gehoor (na 15 tot 20 seconden) en bij bezet.',
          '’s Avonds en in het weekend: altijd doorschakelen na sluitingstijd, uitschakelen bij opening (sommige centrales plannen dit automatisch).',
          'Piekmomenten: doorschakelen bij bezet is genoeg, de agent neemt gesprekken parallel aan.',
        ],
        tip: 'Uw provider rekent doorschakelen af als een gesprek naar het nummer van de agent: controleer uw bundel: doorschakelen naar een buitenlands nummer valt meestal buiten uw belbundel. Voor een lokaal nummer kunt u ook uw Twilio- of Telnyx-nummers importeren of uw telefooncentrale via SIP koppelen.',
      },
    ],
    related: ['acheter-un-numero', 'connexion-sip', 'importer-twilio-telnyx'],
  },
  {
    slug: 'qui-peut-on-appeler',
    category: 'outbound',
    title: 'Wie mag uw agent bellen?',
    summary: 'De regels voor een uitgaande belcampagne: toestemming, klantrelatie, beltijden, bezwaar en transparantie.',
    plan: 'Campagnes: vanaf het Assistent-abonnement. Deze gids is informatief en vervangt geen juridisch advies.',
    sections: [
      {
        title: 'De gouden regel',
        text: 'Bel alleen mensen met wie u een legitieme en aantoonbare reden hebt om te spreken: ze hebben om een terugbelverzoek gevraagd, ze hebben ingestemd met contact, of het gesprek gaat over een lopend contract of een lopende dienst bij u. Bewaar het bewijs van die grondslag (formulier, datum, kanaal).',
      },
      {
        title: 'In Nederland',
        list: [
          'Sinds 1 juli 2021 mag u consumenten (ook eenmanszaken en zzp’ers) alleen telefonisch benaderen voor marketing als ze daar vooraf toestemming voor hebben gegeven. Voor bestaande klanten bestaat een uitzondering, maar die geldt alleen onder strikte voorwaarden: ga er niet van uit dat u uw eigen klanten altijd mag bellen. Het veiligst is om alleen klanten te bellen die hebben aangegeven dat ze benaderd willen worden.',
          'Belt u bedrijven voor marketing, raadpleeg dan het Bel-me-niet Register. Bied in elk gesprek de mogelijkheid om bezwaar te maken.',
          'Een terugbelverzoek van de persoon zelf, een afspraak bevestigen of opvolging van een lopende dienst is geen telemarketing: dat blijft mogelijk.',
          'Gekochte bestanden of nummers uit gidsen en portalen: niet gebruiken voor consumenten zonder aantoonbare toestemming.',
          'De AVG blijft van toepassing op alle gegevens die u verwerkt. Toezicht: de Autoriteit Persoonsgegevens (privacy) en de ACM (telemarketing).',
        ],
      },
      {
        title: 'In andere landen',
        list: [
          'Verenigd Koninkrijk: controleer de registers TPS en CTPS en pas de PECR en de UK GDPR toe.',
          'Australië: controleer het Do Not Call Register en de Spam Act voor berichten.',
          'Italië: Registro pubblico delle opposizioni. Polen: voorafgaande toestemming voor telemarketing.',
          'Twijfelt u, pas dan de strengste regel toe.',
        ],
      },
      {
        title: 'Tijdens het gesprek',
        list: [
          'De agent zegt meteen aan het begin dat hij een AI is en dat het gesprek wordt opgenomen.',
          'Hij noemt de echte reden van het gesprek (“u vroeg ons op … om terug te bellen”).',
          'Wil iemand niet meer gebeld worden, zet het nummer dan op de uitsluitingslijst (menu “Blacklist”): het wordt uitgesloten van alle campagnes.',
          'Bel op redelijke tijden, op werkdagen, in de lokale tijd van het contact.',
        ],
        tip: 'Noteer voordat u een bestand importeert de bron, de datum van de toestemming en de grondslag. Bij een controle is dat overzicht uw bescherming.',
      },
    ],
    related: ['campagnes-d-appels', 'contacts-leads', 'numero-presente'],
  },
  {
    slug: 'verifier-avant-mise-en-ligne',
    category: 'start',
    title: 'De 12 controles voordat uw agent live gaat',
    summary: 'Een checklist om af te werken voordat uw agent live gaat: zo voorkomt u de meeste problemen in de eerste week.',
    plan: 'Alle abonnementen.',
    sections: [
      {
        title: 'Test op een echte telefoon',
        text: 'Bel de agent vanaf uw mobiel (niet via de luidsprekers van uw computer), zoals een klant dat zou doen. Laat ook iemand testen die het project niet kent.',
      },
      {
        title: 'De checklist',
        steps: [
          'De begroeting noemt uw bedrijf, zegt dat het een AI is en stelt één duidelijke vraag.',
          'De naam van uw bedrijf wordt goed uitgesproken (zo niet, schrijf hem fonetisch in de instructies).',
          'Een telefonisch geboekte afspraak staat binnen een minuut in uw agenda.',
          'U ontvangt de samenvatting van het gesprek (e-mail of dashboard).',
          'De vraag “ik wil iemand spreken” leidt tot het ingestelde doorverbinden of terugbelverzoek.',
          'Een spoedwoord uit uw vak (lekkage, pijn, storing) leidt tot de ingestelde instructie.',
          'Het gedrag buiten openingstijden is zoals u wilt.',
          'De agent geeft geen prijzen, garanties of adviezen die u niet hebt goedgekeurd.',
          'Hij beantwoordt de 5 vragen die u het vaakst krijgt correct.',
          'De agent meldt dat het gesprek wordt opgenomen (als u opneemt).',
          'Nummers die niet gebeld mogen worden, staan vóór elke campagne op de uitsluitingslijst (“Blacklist”).',
          'U hebt drie volledige opnames teruggeluisterd en bent tevreden over de toon.',
        ],
        tip: 'Noteer wat niet goed gaat, pas de instructies of de kennisbank aan en herhaal alleen de betreffende tests.',
      },
    ],
    related: ['tester-son-agent', 'message-d-accueil', 'consignes-system-prompt'],
  },
  {
    slug: 'point-mensuel',
    category: 'results',
    title: 'Elke maand in 20 minuten de balans opmaken',
    summary: 'De vier cijfers om te bekijken, de gesprekken om terug te luisteren en de instellingen om na te lopen, zodat uw agent goed blijft.',
    plan: 'Alle abonnementen.',
    sections: [
      {
        title: 'De 4 cijfers die tellen',
        list: [
          'Aantal gesprekken afgehandeld door de agent.',
          'Gekwalificeerde aanvragen (met een echte vraag en contactgegevens).',
          'Geboekte afspraken of geplande terugbelverzoeken.',
          'Geschatte waarde: afspraken × gemiddelde waarde van een klant.',
        ],
        text: 'Verbruikte minuten zeggen iets over uw abonnement, niet over het resultaat: kijk eerst naar wat de gesprekken hebben opgeleverd.',
      },
      {
        title: 'Luister 10 gesprekken terug',
        steps: [
          'Menu “Calls history”: kies willekeurig 10 gesprekken van de maand.',
          'Bij elk gesprek: is de vraag begrepen? is de juiste actie uitgevoerd? bevalt de toon u?',
          'Pas de instructies alleen aan als hetzelfde probleem minstens twee keer terugkomt.',
        ],
      },
      {
        title: 'Controleer wat stilletjes kapotgaat',
        list: [
          'De agenda is nog gekoppeld (een hernoemde of verwijderde agenda stopt het boeken).',
          'Automatiseringen en webhooks draaien zonder fouten.',
          'Uw openingstijden, prijzen, vakantiesluitingen en feestdagen (Koningsdag, Hemelvaart, Pinksteren) zijn actueel in de kennisbank.',
        ],
        tip: 'Plan 20 minuten in op de eerste werkdag van elke maand. Een agent die regelmatig wordt nagelopen, blijft scherp; een vergeten agent raakt uit koers.',
      },
    ],
    related: ['historique-des-appels', 'donnees-apres-appel', 'automatisations'],
  },
];

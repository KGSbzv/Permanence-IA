// Algemene FAQ en FAQ over tarieven.
import type { QA } from '../fr/faq';

export type { QA };

export const FAQ_GENERAL: QA[] = [
  { q: 'Hoe werkt de AI-telefoonassistent?', a: 'U stelt een spraakagent in met uw gegevens, uw regels en uw toon. De agent neemt inkomende gesprekken aan, voert toegestane uitgaande gesprekken, kwalificeert aanvragen, plant afspraken in en stuurt u van elk gesprek een samenvatting.' },
  { q: 'Hoe snel kan ik beginnen?', a: 'Een eerste virtuele receptionist staat binnen enkele minuten klaar op basis van uw gegevens. Voor een volledige configuratie (agenda, nummers, doorverbinden) rekent u meestal op een tot twee dagen, met onze begeleiding.' },
  { q: 'Heb ik technische kennis nodig?', a: 'Nee, ook niet als zzp’er zonder IT-afdeling. U beschrijft uw bedrijf, de promptassistent begeleidt u en wij helpen u met de telefonie en de integraties.' },
  { q: 'Wat gebeurt er als de agent het antwoord niet weet?', a: 'Hij verzint niets: hij noteert de vraag, biedt aan om terug te bellen of verbindt door met uw team, volgens de regels die u hebt ingesteld.' },
  { q: 'Kan de agent meerdere gesprekken tegelijk afhandelen?', a: 'Ja. Meerdere gesprekken worden tegelijk afgehandeld op dezelfde lijn: uw klanten hoeven niet meer te wachten en uw telefonische bereikbaarheid blijft op peil, ook op drukke momenten.' },
  { q: 'Wat is het verschil met een voicemail, telefoonbeantwoorder of telefooncentrale?', a: 'Een voicemail of gewone telefoonbeantwoorder neemt een bericht op, een telefooncentrale verbindt door. De AI-telefoonbeantwoorder begrijpt de vraag, stelt de juiste vragen, onderneemt actie (afspraak, terugbelverzoek, antwoord) en stuurt u een bruikbaar overzicht.' },
  { q: 'Kan ik mijn bestaande telefoonsysteem gebruiken?', a: 'Ja. U kunt uw huidige lijn doorschakelen naar de agent, uw telefooncentrale of provider via SIP koppelen, of uw Twilio- en Telnyx-nummers importeren.' },
  { q: 'Kan ik afspraken laten inplannen via de telefoon?', a: 'Ja: koppel Google Agenda, Outlook, Cal.com of Calendly. De agent stelt vrije tijdsloten voor en boekt direct in uw agenda.' },
  { q: 'Kan ik de prompts aanpassen?', a: 'Ja. Met de prompteditor stelt u het doel, de toon, de vragen en de grenzen van de agent in, stap voor stap begeleid en zonder technische kennis.' },
  { q: 'Kan ik scenario’s maken zonder code?', a: 'Ja, met de flow builder vanaf het Assistent-abonnement: u koppelt triggers en acties via slepen en neerzetten, verbonden met meer dan 300 tools.' },
  { q: 'Kan ik WhatsApp en Instagram gebruiken?', a: 'Ja, vanaf het Assistent-abonnement: sms, WhatsApp, Messenger en Instagram, met een centrale geschiedenis.' },
  { q: 'Leveren jullie telefoonnummers?', a: 'Ja, als optie: een eigen nummer koopt u in uw klantomgeving en betaalt u per maand, bovenop het abonnement (bijvoorbeeld $ 3,99 excl. btw per maand voor een nummer uit de Verenigde Staten of Canada; de exacte prijs ziet u vóór de aankoop). Landen die u kunt kopen: Verenigde Staten, Canada, Verenigd Koninkrijk, Australië, Italië, Nederland, Polen, Denemarken, Finland, Roemenië, Israël, Zuid-Afrika. Voor een nummer uit een ander land, of om uw eigen nummer te behouden: doorschakelen, import via Twilio of Telnyx, of een SIP-koppeling.' },
  { q: 'Kan ik SIP gebruiken?', a: 'Ja, vanaf het Assistent-abonnement. Wij begeleiden u bij het koppelen van uw SIP-trunk of telefooncentrale.' },
  { q: 'Hoe laadt u de gegevens van mijn bedrijf?', a: 'U voegt uw pdf-documenten, de pagina’s van uw website of uw procedures toe aan de kennisbank. De agent raadpleegt deze tijdens het gesprek.' },
  { q: 'Voldoet het aan de AVG?', a: 'Het platform biedt de benodigde hulpmiddelen: toestemming, uitsluitingslijst, instelbare bewaartermijn, verwijdering van gegevens en toegangsbeheer. Uw configuratie en uw privacyverklaringen moet u nog afstemmen op uw bedrijf; wij helpen u daarbij.' },
  { q: 'Hoe werkt de gratis proefperiode?', a: 'U maakt uw account aan en kiest het abonnement dat u wilt testen: de eerste 14 dagen zijn gratis, met 30 belminuten inbegrepen. Bij activering wordt om een betaalkaart gevraagd, maar tijdens de proefperiode wordt niets afgeschreven. Zegt u op vóór het einde van de 14 dagen, dan betaalt u niets.' },
  { q: 'Is de klantomgeving in het Nederlands?', a: 'De interface van de klantomgeving is in het Engels. Een ingebouwde hulpassistent helpt u verder, schriftelijk of gesproken, en de Help-pagina van de klantomgeving vertaalt elk menu en legt de meest voorkomende taken stap voor stap uit.' },
  { q: 'Wie belt mij terug als ik mijn nummer achterlaat?', a: 'Onze AI-spraakassistent belt u tijdens kantooruren terug om uw behoefte te begrijpen en u een demonstratie te geven; als u dat wilt, neemt een adviseur het over. U kunt op elk moment aangeven dat u niet meer gebeld wilt worden.' },
  { q: 'Stelt de agent zich voor als AI?', a: 'Ja. De agent wordt eerlijk gepresenteerd als AI-assistent en kan doorverbinden naar een medewerker als u dat hebt ingesteld.' },
];

export const FAQ_PRICING: QA[] = [
  { q: 'Wat gebeurt er na de 30 proefminuten?', a: 'De 30 minuten zijn het maximum van de proefperiode: zodra dat bereikt is, stoppen de gesprekken tot het einde van de proefperiode of tot u uw abonnement start. Na de 14 dagen start het gekozen abonnement, tenzij u het in uw klantomgeving hebt opgezegd.' },
  { q: 'Zijn de prijzen exclusief btw?', a: 'Ja, alle prijzen worden exclusief belastingen weergegeven. Lokale belastingen komen erbij als ze van toepassing zijn.' },
  { q: 'Wat gebeurt er als ik over mijn minuten heen ga?', a: 'U voegt op elk moment minuten toe met een opwaardering, voor een drukke maand. Gaat u er regelmatig overheen, dan is het grotere abonnement per minuut goedkoper: wij laten u dat weten.' },
  { q: 'Is het telefoonnummer inbegrepen in het abonnement?', a: 'Nee. Het abonnement omvat de minuten en de functies; een eigen nummer is een optie die u per maand betaalt, tegen de prijs die vóór de aankoop wordt getoond. U kunt ook uw huidige nummer gebruiken zonder kosten van onze kant: doorschakelen (uw provider kan kosten rekenen voor doorschakelen naar een buitenlands nummer), import via Twilio of Telnyx, of SIP.' },
  { q: 'Kan ik mijn eigen nummer gebruiken?', a: 'Ja, via doorschakelen, import via Twilio of Telnyx, of een SIP-koppeling vanaf het Assistent-abonnement.' },
  { q: 'Hebben jullie een live demo?', a: 'Ja. U kunt vanuit uw browser met de agent praten of vragen om teruggebeld te worden voor een demonstratie.' },
  { q: 'Waarom kost een opwaardering per minuut meer dan een abonnement?', a: 'De opwaardering is bedoeld voor een eenmalige piek. Het abonnement blijft de voordeligste oplossing voor een vast volume: hoe groter het abonnement, hoe lager de prijs per minuut.' },
  { q: 'Hoe word ik gefactureerd?', a: 'Het abonnement wordt elke maand op dezelfde datum van uw kaart afgeschreven en de factuur staat in uw klantomgeving (Billing info). Opwaarderingen van minuten worden gefactureerd op het moment van aankoop. Belastingen worden automatisch berekend op basis van uw land en uw status.' },
  { q: 'Hoe zeg ik mijn abonnement op?', a: 'Via uw klantomgeving (Billing info), op elk moment en zonder kosten. Tijdens de proefperiode voorkomt opzeggen elke afschrijving. Na de proefperiode blijft het abonnement actief tot het einde van de al betaalde periode en stopt het daarna.' },
  { q: 'Kan ik van abonnement wisselen?', a: 'Ja, op elk moment en zonder verplichtingen. Stap over op een groter abonnement wanneer uw volume groeit; de wijziging wordt getoond voordat u bevestigt.' },
];

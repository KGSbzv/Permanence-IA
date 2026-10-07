# Relecture NL : guides pratiques (nl/guides.ts) et aide de l'espace client (nl/help.ts)

## 1. Synthèse

Le niveau d'ensemble est bon : l'orthographe est correcte, les composés sont bien formés (kennisbank, terugbelverzoek, doorschakelcodes, sms’jes, ’s avonds) et les heures suivent le format néerlandais (9.00–12.00 uur). Le vouvoiement « u » est tenu sur les deux fichiers, sans glissement vers « je » (le seul « je » sert à un exemple de prompt et il est voulu). Les libellés anglais de l'interface sont stables et mis entre guillemets.

Problèmes systémiques :
1. **Belgicismes et calques du français** à plusieurs endroits : « vertrekken vanuit » (×4), « voorzie », « verwittigen », « Goede praktijken », « Verder gaan », « Wanneer gebruiken », « vergeet de accenten niet ». Pour un lecteur des Pays-Bas, cela trahit la traduction.
2. **Guide de démarchage (qui-peut-on-appeler) incomplet pour les Pays-Bas.**
   - Il ne dit pas que le Bel-me-niet Register reste obligatoire pour le démarchage des personnes morales (B2B).
   - Il ne traite pas le cas d'un agent IA qui appelle seul. Ce cas peut relever de l'art. 11.7 lid 1 Tw (« automatische oproepsystemen zonder menselijke tussenkomst »), qui exige le consentement préalable y compris en B2B.
   - Il ne mentionne ni l'obligation d'afficher un numéro joignable ni la Gedragscode Telemarketing.
3. **Guide de renvoi d'appel générique.** Les codes GSM (**21*, **61*, **62*, **67*, ##002#) sont exacts pour KPN, Vodafone et Odido. En revanche, rien n'est dit sur :
   - les codes à une seule étoile des lignes fixes et de la VoIP grand public (KPN, Ziggo : *21*nummer#, #21#) ;
   - les applis des opérateurs ;
   - l'écrasement de la messagerie vocale.
4. **Achat de numéro sans les spécificités néerlandaises.** Le guide ne précise pas :
   - les catégories de numéros : géographique 0xx, national 085/088, gratuit 0800 ;
   - l'adresse requise dans la zone du netnummer ;
   - l'extrait KvK ;
   - le blocage du spoofing de numéros +31 appelant depuis l'étranger.
5. **Contradiction AI Act.** L'exemple de message d'accueil (« u spreekt met Julie… ») ne dit pas que c'est une IA, alors que la checklist du même lot l'exige (art. 50 AI Act).
6. **Incohérences héritées du FR** :
   - « Calls » / « Calls history » ;
   - {customer_name} / {{customer_name}} ;
   - « Test assistant » présenté comme le test vocal dans le navigateur dans l'aide, mais comme le chat de test dans le guide.
   - Les slugs d'URL sont en français (/nl/aide/guides/creer-un-agent…).

## 2. Tableau des corrections

| fichier:ligne | texte actuel | correction proposée | type | sévérité |
|---|---|---|---|---|
| nl/guides.ts:256 | Voorbeeld: “Goedemorgen, praktijk Jansen, u spreekt met Julie… Waarmee kan ik u helpen?” | Voorbeeld: “Goedemorgen, praktijk Jansen, u spreekt met Julie, de digitale assistent… Waarmee kan ik u helpen?” (cohérent avec l. 1060 et l'art. 50 AI Act) | juridique/incohérence | Majeur |
| nl/guides.ts:1016 | …Het Bel-me-niet Register is daarmee niet meer de hoofdregel. | …Voor consumenten is het Bel-me-niet Register daarmee vervangen door opt-in. Belt u bedrijven (rechtspersonen) voor marketing, dan moet u het Bel-me-niet Register nog steeds raadplegen. | juridique/fait | Majeur |
| nl/guides.ts:1015-1021 (ajout d'un item) | — | Belt de agent volledig automatisch, zonder dat een medewerker meeluistert? Dan kan dat gelden als een automatisch oproepsysteem zonder menselijke tussenkomst (art. 11.7 lid 1 Telecommunicatiewet): daarvoor is altijd voorafgaande toestemming nodig, ook bij bedrijven. Laat dit toetsen door een jurist. | juridique | Majeur |
| nl/guides.ts:1015-1021 (ajout d'un item) | — | Toon altijd een herkenbaar nummer waarop men u kan terugbellen (anoniem bellen voor telemarketing is niet toegestaan) en noem aan het begin uw naam en die van het bedrijf namens wie u belt. Zie ook de Gedragscode Telemarketing voor beltijden. | juridique/marché | Majeur |
| nl/guides.ts:1016 | consumenten | consumenten (ook eenmanszaken en andere natuurlijke personen) | juridique | Mineur |
| nl/guides.ts:972 | Bij de meeste toestellen en providers toetst u de code, dan het nummer van de agent in internationaal formaat… | Bij KPN, Vodafone en Odido (en de meeste andere providers) toetst u de code, dan het nummer van de agent in internationaal formaat (+31… of 0031…), gevolgd door # en de beltoets. U kunt doorschakelen ook instellen in de app van uw provider (Mijn KPN, My Vodafone, Odido-app). | marché | Mineur |
| nl/guides.ts:974 | (vaak kunt u de wachttijd toevoegen, bijvoorbeeld **61*nummer**20#) | (u kunt de wachttijd toevoegen, van 5 tot 30 seconden, bijvoorbeeld **61*nummer**20#) | marché | Mineur |
| nl/guides.ts:978 | of ##002# om alles te annuleren. | of ##002# om alles te annuleren. Let op: ##002# schakelt ook de doorschakeling naar uw voicemail uit; die moet u daarna zelf opnieuw instellen. | marché/fait | Mineur |
| nl/guides.ts:982-988 | Op een vaste lijn of telefooncentrale / Open de online omgeving van uw provider… | Ajouter : “Bij een vaste lijn van KPN of Ziggo werken vaak codes met één sterretje: *21*nummer# (altijd), *61*nummer# (geen gehoor), *67*nummer# (bezet); uitschakelen met #21#, #61#, #67#. Bij een VoIP-centrale stelt u dit in het belplan of de wachtrij in.” | marché | Majeur |
| nl/guides.ts:985 | Zoek naar “doorschakelen” of “doorverbinden”. | Zoek naar “doorschakelen” of “omleiden”. (« doorverbinden » = transfert d'un appel en cours, sens différent) | calque/terminologie | Mineur |
| nl/guides.ts:997 | controleer uw bundel, zeker als dat nummer in het buitenland staat. | controleer uw bundel: doorschakelen naar een buitenlands nummer valt meestal buiten uw belbundel. | naturel | Mineur |
| nl/guides.ts:963 | Laat de agent alleen opnemen als u niet opneemt, in gesprek bent of buiten openingstijden, zonder van nummer te wisselen. | Laat de agent alleen opnemen als u zelf niet opneemt, in gesprek bent of gesloten bent, zonder van nummer te wisselen. | faute (structure) | Mineur |
| nl/guides.ts:534 | Kies het land en het type (lokaal, nationaal, gratis, afhankelijk van de beschikbaarheid) | Kies het land en het type (in Nederland: geografisch zoals 020 of 010, landelijk 085/088, gratis 0800; afhankelijk van de beschikbaarheid) | marché | Majeur |
| nl/guides.ts:537 | (bewijsstukken afhankelijk van het land, doorgaans 1 tot 3 werkdagen) | (bewijsstukken afhankelijk van het land, doorgaans 1 tot 3 werkdagen. Voor een Nederlands nummer: meestal een KvK-uittreksel en een adres in Nederland; voor een geografisch nummer een vestigingsadres in dat netnummergebied, volgens het Nummerplan van de ACM.) | marché | Majeur |
| nl/guides.ts:658 | Sommige landen verbieden het weergeven van een buitenlands of niet-geverifieerd nummer. | Sommige landen verbieden het weergeven van een buitenlands of niet-geverifieerd nummer. In Nederland blokkeren providers gesprekken uit het buitenland die een Nederlands nummer tonen (anti-spoofing): test daarom altijd vooraf of uw nummer goed doorkomt. | marché | Majeur |
| nl/guides.ts:1026 | Frankrijk: …Bloctel bestaat niet meer. | (conforme au FR ; à revalider en même temps que la source FR) | fait | Mineur |
| nl/guides.ts:255 | Schrijf getallen zoals ze uitgesproken moeten worden en vergeet de accenten niet. | Schrijf getallen zoals ze uitgesproken moeten worden en schrijf moeilijke namen fonetisch. | calque (FR « gardez les accents ») | Majeur |
| nl/guides.ts:261 | …een audiobestand uploaden dat bij het opnemen wordt afgespeeld. | …een audiobestand uploaden dat wordt afgespeeld zodra de agent opneemt. (« bij het opnemen » se lit comme « pendant l'enregistrement ») | ambiguïté | Mineur |
| nl/guides.ts:270 | Voorzie een begroeting per taal als de agent meerdere talen spreekt. | Zorg voor een begroeting per taal als de agent meerdere talen spreekt. | calque/belgicisme | Mineur |
| nl/guides.ts:165 | Vertrekken vanuit een sjabloon | Beginnen met een sjabloon | calque/belgicisme | Mineur |
| nl/guides.ts:211 | …opnieuw begint of vertrekt vanuit een sjabloon. | …opnieuw begint of met een sjabloon begint. | calque | Mineur |
| nl/guides.ts:327 | Vertrek vanuit het bestaande scenario, een lege pagina of een sjabloon. | Begin met het bestaande scenario, een lege pagina of een sjabloon. | calque | Mineur |
| nl/guides.ts:909 | (of vertrek vanuit een sjabloon) | (of begin met een sjabloon) | calque | Mineur |
| nl/guides.ts:881 | …of uw team verwittigen met automatiseringen. | …of uw team een melding sturen met automatiseringen. | belgicisme | Mineur |
| nl/guides.ts:168 | het dichtst bij uw gebruik ligt | het dichtst bij uw situatie ligt | calque (« usage ») | Mineur |
| nl/guides.ts:194 | Uw instructies evolueren: lees regelmatig… | Instructies zijn nooit af: lees regelmatig… | calque | Mineur |
| nl/guides.ts:319 | Wanneer gebruiken | Wanneer gebruikt u de Flow Builder? | calque | Mineur |
| nl/guides.ts:345 | …door een lijn te trekken vanaf het uitgangspunt. | …door een lijn te trekken vanaf het aansluitpunt van die uitkomst. (« uitgangspunt » = point de départ d'un raisonnement) | faute de sens | Mineur |
| nl/guides.ts:379 | Goede praktijken | Tips / Aanbevelingen | calque | Mineur |
| nl/guides.ts:415 | Zodat de uitnodiging wordt verstuurd | Zorgen dat de uitnodiging wordt verstuurd | faute (titre sans verbe principal) | Mineur |
| nl/guides.ts:445 | voeg minstens een van deze opties toe. | voeg minstens één van deze opties toe. | typo | Mineur |
| nl/guides.ts:474 | Verder gaan | Meer mogelijkheden | calque (« Aller plus loin ») | Mineur |
| nl/guides.ts:221 | De snelkoppelingen “Make it more concise”… | De snelknoppen “Make it more concise”… (« snelkoppeling » = raccourci de fichier ou clavier) | terminologie | Mineur |
| nl/guides.ts:31 | de hulpassistent (ballon rechtsonder) | de hulpassistent (chatknop rechtsonder) | calque (« bulle ») | Mineur |
| nl/guides.ts:120 | (ballonpictogram) | (chatpictogram) | calque | Mineur |
| nl/guides.ts:752 | Contacten die ermee hebben ingestemd benaderd te worden. | Contacten die ermee hebben ingestemd om benaderd te worden (zie de gids “Wie mag uw agent bellen?”). | faute/renvoi | Mineur |
| nl/guides.ts:805 | Een contact terugzetten op “Created” laat het opnieuw bellen | Zet u een contact terug op “Created”, dan wordt het opnieuw gebeld | ambiguïté (le contact « appelle ») | Mineur |
| nl/guides.ts:892 | (5.000 runs per maand, 50.000 met Callcenter) | (5.000 automatiseringsruns per maand, 50.000 met Callcenter). Harmoniser avec offers.ts, qui dit « 50.000 automatiseringen / maand ». | incohérence | Mineur |
| nl/guides.ts:1050 | voordat u de lijn openzet | voordat u live gaat | calque (« ouvrir la ligne ») | Mineur |
| nl/guides.ts:1069 | De melding van opname is aanwezig als gesprekken worden opgenomen. | De agent meldt dat het gesprek wordt opgenomen (als u opneemt). | naturel | Mineur |
| nl/guides.ts:1093 | Verbruikte minuten zijn om uw abonnement te volgen, niet om het resultaat te meten | Verbruikte minuten zeggen iets over uw abonnement, niet over het resultaat | naturel | Mineur |
| nl/guides.ts:1098 | Menu “Calls”: kies willekeurig… | Menu “Calls history”: kies willekeurig… (même erreur dans la source FR, l. 1123) | incohérence UI | Mineur |
| nl/guides.ts:1108 | Uw openingstijden, prijzen en vakanties zijn actueel… | Uw openingstijden, prijzen, vakantiesluitingen en feestdagen (Koningsdag, Hemelvaart, Pinksteren) zijn actueel… | marché | Mineur |
| nl/guides.ts:1110 | Blok 20 minuten op de eerste werkdag van elke maand. | Plan 20 minuten in op de eerste werkdag van elke maand. | anglicisme | Mineur |
| nl/guides.ts:236 / nl/help.ts:116 | {customer_name} / {{customer_name}} | Uniformiser sur la syntaxe réelle de la plateforme ({{customer_name}} dans les guides aussi, comme l. 506). Problème hérité du FR. | incohérence | Mineur |
| nl/help.ts:38 | Klik op Create assistant en daarna op Test assistant om vanuit uw browser met de agent te praten. | Klik op Create assistant en daarna op Test assistant (testchat) of Speak with your assistant (spraak in de browser). (Contradiction avec guides.ts:120-130, héritée du FR) | incohérence | Mineur |
| nl/help.ts:34 | Make phone calls (gesprekken voeren) | Make phone calls (zelf bellen) | naturel | Mineur |
| nl/help.ts:54 | Hebt u al Twilio, Telnyx of een SIP-centrale: Your phone numbers, daarna import of SIP | Hebt u al Twilio, Telnyx of een SIP-centrale? Ga dan naar Your phone numbers en kies import of SIP | faute (ponctuation, structure) | Mineur |
| nl/help.ts:76 / nl/guides.ts:689 | webbouwer / webmaster | Unifier (« webbouwer » ou « websitebeheerder ») | incohérence | Mineur |
| nl/help.ts:98 | Gaat u er vaak overheen: Change plan | Gaat u er vaak overheen? Kies dan een groter abonnement via Change plan | naturel | Mineur |
| nl/guides.ts:932-933 / nl/help.ts:118 | tegoed (“Credits”) … betaald met berichtcredits / Tegoed: … extra minuten en berichten | Clarifier s'il s'agit d'un seul solde ou de deux (crédits minutes et crédits messages). Le guide les présente comme deux soldes, l'aide comme un seul. | incohérence | Mineur |
| URL /nl/aide/guides/<slug FR> | /nl/aide/guides/creer-un-agent, etc. | Slugs et segment en néerlandais (/nl/hulp/gidsen/agent-aanmaken…) avec redirections 301, ou au minimum segment « hulp » | SEO | Mineur |
| nl/guides.ts:40 | Wat is een AI-spraakagent? | Wat is een AI-telefoonassistent (spraakagent)? (« AI-telefoonassistent », « AI-receptionist » et « AI telefonist » sont plus recherchés que « spraakagent ») | SEO | Mineur |

## 3. Manques / ajouts recommandés

- **Démarchage NL (qui-peut-on-appeler)** :
  - B2B : Bel-me-niet Register obligatoire pour les personnes morales.
  - Statut de l'agent IA au regard de l'art. 11.7 lid 1 Tw : consentement préalable, y compris en B2B s'il s'agit d'un appel entièrement automatisé.
  - Numéro affiché obligatoire et joignable.
  - Identification de l'appelant et du donneur d'ordre.
  - Proposition de désinscription à chaque appel : déjà présente, à garder.
  - Gedragscode Telemarketing (horaires d'appel ; aucun appel le dimanche ni les jours fériés).
  - Ces points sont à faire valider par un juriste néerlandais.
- **AI Act art. 50** : l'information « je suis une IA » est bien présente dans la checklist (l. 1060) et dans la section campagne (l. 1036). Elle doit figurer aussi dans l'exemple de message d'accueil et dans la section « De 5 bouwstenen » (règle n° 1 : se présenter comme assistant IA).
- **Renvoi d'appel** :
  - Codes à une étoile des lignes fixes et de la VoIP grand public (KPN, Ziggo).
  - Applis des opérateurs (Mijn KPN, My Vodafone, Odido).
  - Délai de renvoi de 5 à 30 s.
  - ##002# supprime aussi le renvoi vers la messagerie vocale.
  - Coût d'un renvoi vers un numéro de l'agent étranger (hors bundel).
  - Je recommande de conseiller un numéro néerlandais (085 ou géographique) pour l'agent, afin que le renvoi reste dans le bundel.
- **Numéros NL** :
  - Catégories 0xx, 085/088, 0800 (0900 payant à exclure ou à signaler) et 06 (mobile, rarement disponible chez les fournisseurs VoIP).
  - Justificatifs : KvK-uittreksel, adres in NL ou dans le netnummergebied.
  - Nummerplan géré par l'ACM.
  - Filtre anti-spoofing des opérateurs néerlandais pour les appels sortants.
- **Mention Flandre** : si la cible inclut la Belgique néerlandophone, ajouter dans le guide de démarchage une ligne « België: Do Not Call me-lijst (DNCM) en GDPR/GBA ». Les codes de renvoi sont les mêmes (Proximus, Orange, Telenet).
- **Fêtes locales** : rappeler de paramétrer les fermetures (Koningsdag, Bevrijdingsdag tous les 5 ans, Hemelvaart, Pinksteren, Kerst) dans les horaires ou la base de connaissances.
- **Hérité du FR (à corriger dans la source puis dans toutes les langues)** :
  - « Calls » au lieu de « Calls history » ;
  - {customer_name} contre {{customer_name}} ;
  - rôle de « Test assistant » ;
  - ambiguïté crédits / crédits messages.

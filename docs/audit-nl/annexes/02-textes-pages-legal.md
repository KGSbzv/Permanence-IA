# Relecture NL — lot 01 : pages.ts (demo → blog), bloc `nl` de markets.ts, pages légales rendues

Fichiers : `src/i18n/content/nl/ui/pages.ts` (ci-dessous « P »), `src/i18n/markets.ts` (« M »). Pages rendues vérifiées (curl le 07/10/2026) : /nl/cgu, /nl/confidentialite, /nl/mentions-legales, /nl/cookies, /nl/securite, /nl/about.

## 1. Synthèse

- **Niveau global : bon à très bon.** Le néerlandais est grammaticalement solide, le vouvoiement (« u ») est cohérent partout, la terminologie juridique est juste (verwerkingsverantwoordelijke, verwerker, bewuste roekeloosheid, Weens Koopverdrag, met waarborgen omkleed, EU-VS-kader voor gegevensbescherming). Ce n'est pas une traduction mot à mot du français : plusieurs adaptations sont bien vues (art. 11.7 Tw / klantrelatie, Bel-me-niet Register, 112 au lieu de 15/17/18, AP comme autorité).
- **Toutes les variables injectées se rendent correctement** dans les phrases en ligne (« Op de Voorwaarden is het recht van de staat Wyoming (Verenigde Staten) van toepassing », « door de bevoegde rechter in Laramie County (Wyoming, Verenigde Staten) », « klacht indienen bij de Autoriteit Persoonsgegevens », « in overeenstemming met de Algemene verordening gegevensbescherming (AVG) », « in de zin van de Auteurswet »). Aucune rupture grammaticale.
- **Problèmes systémiques :**
  1. **Calques du français** dans les textes « marketing » et dans les mentions légales : « ballon » (bulle), « tijdslot » (créneau), « vaststelling » (constat), « uitgegeven door / Verantwoordelijke uitgever » (éditeur / directeur de publication), « Het journaal van de AI-receptie », « Publicaties », « gebruiks- en verkoopvoorwaarden » (CGU/CGV), « Het vonnis kan worden bekrachtigd ».
  2. **Incohérences terminologiques** : tagline « AI-telefonieassistent » (M) contre « AI-telefoonassistent » partout ailleurs (37 occurrences) ; « blokkeerlijst » / « uitsluitingslijst » ; « tijdens verzending » / « tijdens overdracht » ; « receptioniste » / « receptionist » ; « chatbubbel » / « ballon » ; « Intellectueel eigendom » / « Intellectuele eigendom » ; « demonstratiegesprek » / « demogesprek ».
  3. **Contradictions de fond** : DPA « op eenvoudig verzoek » (page sécurité) contre DPA signé seulement pour Maatwerk (CGU art. 8) ; analytics « avec consentement » (privacy) contre « aucun analytics » (cookies) ; prestataire nommé (UE, Roumanie) dans la privacy mais anonyme dans les mentions légales ; « campagnes uniquement vers des contacts qui ont consenti » contre « consentement ou relation client » dans la même liste.
  4. **Juridique** : CGU de modèle américain (arbitrage AAA à Cheyenne, renonciation aux actions collectives, prescription de 3 mois, plafond USD 1 000, « la version anglaise prévaut ») ; **pas de représentant UE au titre de l'art. 27 AVG** dans la privacy ; clause « verwerkersovereenkomst » incomplète au regard de l'art. 28(3) AVG. Pour le régime néerlandais des algemene voorwaarden, voir l'analyse en section 3 : **l'art. 6:247 lid 2 BW écarte probablement la zwarte/grijze lijst et la terhandstelling** pour ce contrat transfrontalier B2B. Le risque se situe donc ailleurs. **Validation par un avocat néerlandais nécessaire** (je ne suis pas avocat).
  5. **Marché** : prix en USD « excl. btw » ambigus pour une LLC américaine (btw verlegd ou OSS) ; « betaalkaart » (aux Pays-Bas, c'est la carte de débit) sans iDEAL ni SEPA ; aucun numéro +31 ; hreflang `nl` générique alors que le contenu est purement néerlandais (Flandre non couverte) ; personas de /nl/about aux prénoms étrangers au marché (Jade, Katie, Jack, Manuela, Tomasz ; seul Daan est néerlandais).

## 2. Tableau des corrections

| fichier:ligne (ou URL) | texte actuel | correction proposée | type | sévérité |
|---|---|---|---|---|
| M:125 (rendu dans l'en-tête et le pied de page de toutes les pages) | `tagline: 'AI-telefonieassistent'` | `'AI-telefoonassistent'` (terme utilisé partout ailleurs et réellement recherché) | incohérence/SEO | Majeur |
| M:124 | `hreflang: 'nl'`, `country: 'Nederland'` | `hreflang: 'nl-NL'` (le contenu est propre aux Pays-Bas : AP, Bel-me-niet, art. 11.7 Tw), ou adaptation flamande à part (GBA, « Bel-me-niet-meer »-lijst) | marché/SEO | Mineur |
| M:126 privacyLaw | `de Algemene verordening gegevensbescherming (AVG)` | `de Algemene verordening gegevensbescherming (AVG) en de Uitvoeringswet AVG (UAVG)` | juridique | Mineur |
| M:126 copyrightLaw (rendu CGU art. 10 : « beschermd door de Auteurswet ») | `de Auteurswet` | Acceptable. Dans P:363, préférer : « …worden beschermd door het auteursrecht, waaronder de Auteurswet en internationale verdragen » (la société est américaine ; la protection ne repose pas sur la seule loi néerlandaise) | juridique | Mineur |
| M:126 court + P:447 (rendu) | « Het vonnis kan worden bekrachtigd en ten uitvoer gelegd door de bevoegde rechter in Laramie County (Wyoming, Verenigde Staten) of door elke bevoegde rechter. » | « Het arbitraal vonnis kan worden erkend en ten uitvoer gelegd door elke bevoegde rechter, waaronder de bevoegde rechter in Laramie County (Wyoming, Verenigde Staten). » (« bekrachtigd » calque *confirmed* ; redondance supprimée) | calque/juridique | Mineur |
| P:13 | `Demo AI-telefoonassistent — probeer live · ${brand}` | `Demo AI-telefoonassistent: probeer hem live · ${brand}` | naturel/SEO | Mineur |
| P:18 | `Liever meteen? Klik op de ballon rechtsonder in beeld: onze assistent antwoordt u gesproken of schriftelijk.` | `Liever meteen proberen? Klik op het chaticoon rechtsonder in beeld: onze assistent antwoordt u via spraak of chat.` (« ballon » = ballon de baudruche, calque de « bulle ») | calque | Majeur |
| P:19 | `Ontvang mijn demonstratiegesprek` | `Vraag uw demogesprek aan` (terme aligné sur P:21) | calque/incohérence | Mineur |
| P:21 | `Ontvang het demogesprek` | `Demogesprek aanvragen` | naturel | Mineur |
| P:23 | `…stelt een tijdslot voor en maakt het overzicht klaar voor het team.` | `…stelt een geschikt tijdstip voor en zet de gegevens klaar voor het team.` | calque | Mineur |
| P:25 | `Met uw sector en uw tijdslot.` | `Samen met uw sector en het gewenste tijdstip.` | calque | Mineur |
| P:27 | `U test vrijuit` / `verander van gedachten` | `U test zonder beperkingen` / `Stel uw vragen, bedenk u, onderbreek hem.` (« vrijuit » = parler franchement) | naturel | Mineur |
| P:29 | `Tandartsagent` | `Agent voor de tandartspraktijk` | naturel | Mineur |
| P:39 | `…wij bellen u terug, op het tijdslot dat u kiest.` | `…wij bellen u terug op het tijdstip dat u kiest.` | calque | Mineur |
| P:40 / P:42 | `Terugbellen door verkoop` / `Terugbellen door support` | `Terugbelverzoek: verkoop` / `Terugbelverzoek: support` | naturel | Mineur |
| P:48 | `tabSupport: 'Klantenservice'` | `'Support'` (aligné sur `supportTitle`) | incohérence | Mineur |
| P:70 et P:255 (CGU art. 3) | `Betaalkaart gevraagd bij activering…` / `wordt een betaalkaart gevraagd` | `Betaalgegevens (creditcard) gevraagd bij activering; de eerste ${days} dagen wordt er niets afgeschreven`. Aux Pays-Bas, « betaalkaart » désigne la carte de débit (pinpas) ; préciser ce que Stripe accepte réellement (iDEAL/SEPA ?) | marché | Majeur |
| P:95 | `sectorOther: 'Andere branche'` | `'Andere sector'` (le libellé du champ est « Sector ») | incohérence | Mineur |
| P:97 | `` ` — ${price} excl. btw/maand` `` | `` ` — ${price} per maand excl. btw` `` (voir aussi la note btw/USD en section 3) | typo/marché | Mineur |
| P:99 | `' — op offerte'` | `' — prijs op aanvraag'` | naturel | Mineur |
| P:101-105 | `Ik ga akkoord met de algemene voorwaarden en het privacybeleid, en ermee dat ik word teruggebeld…` | `Ik ga akkoord met de algemene voorwaarden, heb het privacybeleid gelezen en wil worden teruggebeld voor het instellen van mijn account.` (syntaxe bancale ; on n'« accepte » pas une politique de confidentialité sous l'AVG, c'est une information) | faute/juridique | Majeur |
| P:108 | `De aanmelding kon niet worden verzonden.` | `De aanmelding kon niet worden verzonden. Probeer het opnieuw.` | UX | Mineur |
| P:120 | `…de hulpassistent (ballon rechtsonder)…` | `…de hulpassistent (chaticoon rechtsonder)…` | calque | Mineur |
| P:135 | `Waarvoor dient het` | `Waarvoor gebruikt u het` | naturel | Mineur |
| P:138 | `of vraag een terugbelverzoek aan via de contactpagina.` | `of doe een terugbelverzoek via de contactpagina.` | naturel | Mineur |
| P:147 | `…is ontstaan uit een eenvoudige vaststelling:` | `…is ontstaan vanuit een simpele constatering:` | calque | Mineur |
| P:151 | `Wij stellen AI-spraakagents tot uw beschikking die…` | `Wij leveren AI-spraakagents die…` | naturel | Mineur |
| P:166 et P:182 | `versleuteling tijdens verzending` | `versleuteling tijdens transport` (P:606 dit « tijdens overdracht » : harmoniser) | incohérence | Mineur |
| P:182 | `AVG-conform` ; `PCI-DSS niveau 1 gecertificeerd` | `Ingericht op AVG-naleving` (il n'existe pas de certification « AVG-conform », allégation risquée) ; `gecertificeerd volgens PCI DSS Level 1` (même graphie qu'en P:563) | juridique/typo | Mineur |
| P:186 | `Uw campagnes mogen alleen contacten bellen die daarmee hebben ingestemd; een ingebouwde blokkeerlijst sluit de anderen uit` | `Uw campagnes bellen alleen contacten die toestemming hebben gegeven of met wie u een klantrelatie hebt; een ingebouwde uitsluitingslijst sluit de anderen uit` (contradiction avec P:193 ; terme de P:174) | incohérence | Majeur |
| P:190 (et carte rendue /nl/securite « Verwerkersovereenkomst (DPA) op aanvraag ») | `Verwerkersovereenkomst (DPA) op eenvoudig verzoek` | Aligner sur la CGU art. 8 : `Verwerkersovereenkomst opgenomen in de voorwaarden; een ondertekende DPA bij een Maatwerk-abonnement`, ou bien modifier la CGU | fait/incohérence | Majeur |
| P:192 | `…kan ons in plaats daarvan schrijven` | `…kan ons in plaats daarvan mailen` | naturel | Mineur |
| P:193 | `…in Nederland is voor telemarketing aan consumenten sinds 1 juli 2021 voorafgaande toestemming of een bestaande klantrelatie nodig, in Frankrijk sinds 11 augustus 2026 voorafgaande toestemming` | `…in Nederland is voor telemarketing aan consumenten (ook eenmanszaken en zzp’ers) sinds 1 juli 2021 voorafgaande toestemming of een bestaande klantrelatie nodig (art. 11.7 Telecommunicatiewet); voor zakelijke nummers blijft het Bel-me-niet Register van belang.` (la mention France est inutile pour le public NL ; la précision zzp est essentielle pour la cible ; le statut du registre pour les numéros professionnels est à vérifier par un juriste) | marché/juridique | Majeur |
| P:214 et P:211 | `Algemene gebruiks- en verkoopvoorwaarden` / `(gebruik en verkoop)` | `Algemene voorwaarden` (calque CGU/CGV ; le pied de page dit déjà « Algemene voorwaarden ») | calque/SEO | Mineur |
| P:215 | `Van toepassing op professionals en bedrijven` | `Van toepassing op zakelijke klanten` | naturel | Mineur |
| P:233 | `het aanvaardingsvakje aan te vinken` | `het selectievakje voor aanvaarding aan te vinken` | naturel | Mineur |
| P:244 | `…en een account dat dit niet verstrekt weigeren, beperken of opschorten.` | `…en een account weigeren, beperken of opschorten als dit bewijs niet wordt verstrekt.` | faute | Mineur |
| P:252 | `inschrijvingsnummer` | `KvK-nummer of ander registratienummer` | marché | Mineur |
| P:256 | `daarboven worden ze gepauzeerd tot het abonnement start` | `daarna worden gesprekken opgeschort tot het abonnement ingaat` | naturel | Mineur |
| P:270 | `de Klant machtigt de bijbehorende terugkerende afschrijvingen` | `de Klant geeft toestemming voor de bijbehorende terugkerende afschrijvingen` (« machtigen » prend une personne pour objet) | faute | Mineur |
| P:287 | `misleidende of misbruikende activiteit` | `misleidende of anderszins oneigenlijke activiteit` | faute | Mineur |
| P:291 | `officiële identificatienummers` | `officiële identificatienummers (zoals het BSN)` (l'art. 46 UAVG encadre strictement le BSN) | marché | Mineur |
| P:308 | `de Nederlandse regels (voorafgaande toestemming of een bestaande klantrelatie, Bel-me-niet Register)` | `de Nederlandse regels (artikel 11.7 Telecommunicatiewet: voorafgaande toestemming of een bestaande klantrelatie; Bel-me-niet Register)` | juridique | Mineur |
| P:311 | `(met name op grond van de Europese AI-verordening)` | `(met name op grond van artikel 50 van de AI-verordening, Verordening (EU) 2024/1689)` | juridique | Mineur |
| P:336 | `Dit artikel en het privacybeleid vormen de verwerkersovereenkomst` | Compléter avec les éléments de l'art. 28(3) AVG (onderwerp, duur, aard en doel, soorten gegevens, categorieën betrokkenen) ou annexer une DPA standard téléchargeable | juridique | Majeur |
| P:355 | `De Dienst steunt op of koppelt met derden` | `De Dienst maakt gebruik van of koppelt met diensten van derden` | naturel | Mineur |
| P:364 | `niet-sublicentieerbare` | `niet in sublicentie te geven` | naturel | Mineur |
| P:387 | `Redelijk-gebruikslimieten` | `Limieten voor redelijk gebruik (fair use)` | faute/typo | Mineur |
| P:395 | Suspension « op elk moment, met of zonder voorafgaande kennisgeving… bij… een juridisch of reputatierisico » | Clause discrétionnaire très large, combinée à une absence totale de remboursement : risque de non-opposabilité ou de requalification (redelijkheid en billijkheid si le droit NL s'applique un jour ; Data Act). Prévoir un préavis sauf urgence | juridique | Majeur |
| P:437 | Prescription de 3 mois | Délai de déchéance (vervaltermijn) de 3 mois : très court ; un juge néerlandais l'écarterait probablement s'il appliquait le droit NL. Proposer au moins 12 mois | juridique | Majeur |
| P:420 | Plafond `USD 1.000` + un mois de prix | Typographie correcte (`USD 1.000`). Sur le fond, voir la section 3 | juridique | Majeur |
| P:449 | `een rechter voor kleine geschillen` | Acceptable ; aux Pays-Bas, `de kantonrechter` (jusqu'à 25 000 €) si l'on veut localiser | marché | Mineur |
| P:464 | `…als de nieuwe eigenaar een concurrent is of niet door onze controle komt.` | `…als de nieuwe eigenaar een concurrent is of onze verificatie niet doorstaat.` | calque | Mineur |
| P:474 | `Partiële nietigheid en geen afstand:` | `Gedeeltelijke nietigheid en geen afstand van recht:` | naturel | Mineur |
| P:477 (rendu CGU) | `Bij verschillen gaat de Engelse versie voor.` | Soit lier explicitement cette version anglaise (laquelle, UK ? AU ?), soit `Bij verschillen gaat de Nederlandse versie voor.` Un client néerlandais qui n'a reçu que le texte NL se verra opposer un texte qu'on ne lui a pas fourni | juridique | Majeur |
| P:508 | `wij sturen elk verzoek dat wij ontvangen aan hem door.` | `wij sturen elk verzoek dat wij ontvangen aan dat bedrijf door.` (antécédent neutre « het bedrijf ») | faute | Mineur |
| P:519 | `(chatbubbel op de website, receptioniste, demogesprekken, commerciële en supportterugbelacties, …)` | `(chatbubbel op de website, AI-receptionist, demogesprekken, terugbelgesprekken voor verkoop en support, …)` | incohérence/naturel | Mineur |
| P:540 vs P:732 | Privacy : « Analytische cookies: uw toestemming » ; Cookies : « geen … analytische cookies » | Harmoniser : `Analytische cookies (indien wij die in de toekomst gebruiken): uw toestemming` | incohérence | Mineur |
| P:559 vs P:703 | Privacy : prestataire « gevestigd in de Europese Unie (Roemenië) » ; Mentions légales : « Cloudinfrastructuur voor spraaktelefonie » (anonyme) | Nommer le prestataire dans les deux pages, ou dans aucune (transparence art. 13 AVG) | incohérence/juridique | Majeur |
| P:566 | `Zoho: verzending van service- en opvolgmails.` | Ajouter la localisation : `(Europese Unie / Verenigde Staten)` | juridique | Mineur |
| P:596 | `Facturen en boekhoudkundige stukken: 10 jaar.` | Acceptable comme politique de la société ; aux Pays-Bas, l'obligation fiscale est de 7 ans (art. 52 AWR). Si l'on veut localiser : « volgens de wettelijke bewaartermijn (ten minste 7 jaar) » | fait/marché | Mineur |
| P:606 | `…in kluizen voor geheimen` | `…in beveiligde sleutelkluizen (secret vaults)` | naturel | Mineur |
| P:626 | `Wij antwoorden binnen 30 dagen` | `Wij antwoorden binnen één maand` (formulation de l'art. 12(3) AVG) | juridique | Mineur |
| P:682 | `…wordt uitgegeven door de vennootschap` / titre `1. Uitgever van de website` | `…wordt beheerd door` / `1. Beheerder van de website` (« éditer un site » ne se dit pas ainsi aux Pays-Bas) | calque | Mineur |
| P:690 | `Verantwoordelijke uitgever:` | Supprimer (notion belge ou française de directeur de publication, sans équivalent aux Pays-Bas), ou `Verantwoordelijk:` | calque/marché | Mineur |
| P:689 | `Contact-e-mail:` | `E-mail:` | naturel | Mineur |
| P:688 vs P:8 | Adresse `1603 Capitol Ave, Suite 413G-2408` contre `1603 Capitol Ave Suite 413G-2408` (CGU/privacy/contact) | Uniformiser avec la virgule | typo | Mineur |
| P:701-703 | `VS` / `Databases & Opslag` / `Telefoonnetwerk & Spraaksynthese: Cloudinfrastructuur…` | `Verenigde Staten` / `Databases en opslag` / `Telefoonnetwerk en spraaksynthese: cloudinfrastructuur…` (pas de majuscules « title case » anglaises ; minuscule après le deux-points) | typo | Mineur |
| P:709 | `3. Intellectueel eigendom` | `3. Intellectuele eigendom` (forme de la CGU art. 10 et forme juridique usuelle) | incohérence | Mineur |
| P:711 | `het logo (de ballon in stand-by, de geluidsgolven en de beschikbaarheidsstip) en alle huisstijlen, …, en broncodes` | `het logo (de spraakballon in ruststand, de geluidsgolven en de stip die beschikbaarheid aangeeft) en alle huisstijlelementen, …, en de broncode` | calque | Mineur |
| P:742 | Meta du blog (~150 car.) | Correcte. Pour le SEO : `Gidsen en praktijkvoorbeelden over telefonische bereikbaarheid, afspraken inplannen en AI-telefoonassistenten voor het mkb. Lees onze artikelen.` (mots-clés NL réellement recherchés) | SEO | Mineur |
| P:744 | `Kennis & inzichten` | `Kennis en inzichten` | typo | Mineur |
| P:745 | `Het journaal van de AI-receptie` | `Blog over AI-telefonie en bereikbaarheid` (« journaal » évoque le JT télévisé, le NOS Journaal) | calque | Majeur |
| P:747 | `Zoek een artikel...` | `Zoek een artikel…` (vrai caractère de points de suspension, comme `Kies…` et `Verzenden…`) | typo | Mineur |
| P:752 | `'cas-client': 'Klantcase'` | `'Klantverhalen'` | naturel | Mineur |
| P:766 | `` `${brand} Publicaties` `` | `` `Redactie ${brand}` `` | calque | Mineur |
| P:768 | `Klaar om uw bedrijf uit te rusten met een AI-telefoniedienst?` | `Klaar om uw telefoon te laten beantwoorden door AI?` | naturel | Mineur |
| /nl/about, /nl/securite (formulaire rendu, hors pages.ts) | `Spreek een adviseur` | `Spreek met een adviseur` | faute | Mineur |
| /nl/about (rendu, hors lot) | Personas `Jade, Daan, Katie, Jack, Manuela, Tomasz` | Prénoms néerlandais : p. ex. `Sanne, Daan, Lotte, Bram, Fleur, Thijs` | marché | Mineur |
| pied de page rendu (hors lot) | `Hulpbronnen` ; `Service aan huis` | `Kennisbank` (ou `Resources`) ; `Vakmensen aan huis` / `Klussen en installatie` | calque | Mineur |

## 3. Analyse juridique (Pays-Bas) — points fragiles

**Risque global : élevé, mais de nature contractuelle et commerciale plus que sanctionnable.** Validation par un avocat néerlandais nécessaire.

1. **Régime des algemene voorwaarden (art. 6:231 e.v. BW)** : selon l'**art. 6:247 lid 2 BW**, la section 6.5.3 (zwarte/grijze lijst, terhandstelling, reflexwerking pour les petites entreprises) ne s'applique pas aux contrats entre professionnels qui ne sont pas *tous deux* établis aux Pays-Bas, quel que soit le droit applicable. Avec une LLC du Wyoming, ce régime est donc **a priori inapplicable**, et le choix du droit du Wyoming est valable en B2B (Rome I, art. 3). La réflexion « zwarte/grijze lijst par réflexe » ne joue donc pas directement. Restent néanmoins :
   - la lisibilité et l'accès aux CGU : bonne pratique, fournir un PDF téléchargeable au moment de l'inscription (la case à cocher sur le formulaire de P:101 renvoie seulement à une page web) ;
   - le risque que, devant un juge néerlandais (litiges hors arbitrage, mesures provisoires), la clause d'arbitrage AAA en anglais à Cheyenne, la renonciation aux actions collectives, le délai de déchéance de 3 mois et le plafond de USD 1 000 soient jugés déraisonnablement onéreux pour un zzp'er ou une très petite entreprise. Ce serait le cas si le juge appliquait les règles impératives ou la redelijkheid en billijkheid du droit NL, ce qui est peu probable mais pas exclu ;
   - **EU Data Act (Règlement 2023/2854, applicable depuis le 12/09/2025)** : il s'applique aux services de traitement de données (SaaS) proposés à des clients dans l'UE, quel que soit le lieu d'établissement du fournisseur. Il impose un droit de changement de fournisseur (préavis maximal de 2 mois, période de transition, export des données d'au moins 30 jours, suppression progressive des frais de changement d'ici au 12/01/2027), des informations obligatoires dans le contrat et un contrôle des clauses abusives B2B sur les données (art. 13). Les art. 13 (export 30 jours) et 4 (absence de remboursement) sont à confronter à ce texte. **Majeur.**
2. **Absence de représentant dans l'UE (art. 27 AVG)** : une LLC américaine qui cible activement des personnes dans l'UE (site en néerlandais, prix « excl. btw ») doit désigner un représentant établi dans l'UE et l'indiquer dans la privacy (art. 13(1)(a)). Absent de la page NL comme de la source FR. **Bloquant** avant publication.
3. **Verwerkersovereenkomst** : la clause « dit artikel + privacybeleid = verwerkersovereenkomst » ne contient pas tous les éléments de l'art. 28(3) AVG, et contredit la page sécurité (« DPA op eenvoudig verzoek »). **Majeur.**
4. **« Bij verschillen gaat de Engelse versie voor »** : cette clause renvoie à un texte que le client NL n'a pas reçu (il en existe deux versions anglaises, UK et AU). **Majeur.**
5. **Télémarketing (art. 11.7 Telecommunicatiewet)** : ce qui est écrit est juste (opt-in ou relation client depuis le 1/7/2021). À préciser : le régime s'applique aussi aux **abonnés personnes physiques, donc aux eenmanszaken et zzp'ers**, qui sont la cible du site ; préciser aussi la place résiduelle du Bel-me-niet Register (numéros professionnels). L'ACM contrôle. À vérifier par un juriste.
6. **AI Act art. 50** : traité correctement (CGU art. 6 « Transparantie », privacy, page sécurité, principes de la page « Over ons »). Recommandation : citer l'article et le règlement (voir P:311).
7. **Intérêts de 1,5 % par mois** (P:274) : en droit NL, le taux légal commercial est de BCE + 8 %. Sous le droit du Wyoming c'est défendable, mais 18 % par an contre un zzp'er paraît agressif. Mineur.
8. **Mentions légales (art. 3:15d BW / Richtlijn e-commerce)** : nom, adresse, e-mail et numéro d'enregistrement sont présents. **Manque le numéro de TVA (btw-/VAT-id ou numéro OSS)** si la société est enregistrée pour facturer la TVA néerlandaise aux clients qui n'ont pas de numéro de TVA. Mineur à majeur selon la situation fiscale.
9. **TVA** : « excl. btw » sur des prix en USD d'une LLC américaine est ambigu. Pour un client NL qui a un btw-nummer, la TVA est autoliquidée (« btw verlegd ») ; pour un zzp'er sous KOR sans numéro, 21 % de btw dus via OSS (régime non-Union). Recommandation : « Prijzen in USD, excl. btw. Zakelijke klanten met een btw-nummer: btw verlegd; anders wordt 21% btw berekend. » **Majeur** (lisibilité du prix).
10. **Accessibilité (EAA)** : le service est B2B uniquement, donc probablement hors du champ de l'EAA (qui vise les services aux consommateurs). Aucune déclaration d'accessibilité n'est publiée ; ce n'est pas bloquant.

## 4. Manques / ajouts recommandés

- **Privacy** : représentant UE (art. 27 AVG) ; mention de la UAVG ; sous-traitants avec leur pays (Zoho) ; liste des sous-traitants datée et téléchargeable.
- **CGU** : DPA conforme à l'art. 28(3) en annexe téléchargeable ; clauses Data Act (changement de fournisseur, export, information) ; PDF téléchargeable des CGU ; supprimer ou adapter la clause de primauté de la version anglaise ; envisager une `mandatoryNote` NL (p. ex. « Niets in deze voorwaarden beperkt rechten die op grond van dwingend Nederlands of Europees recht niet kunnen worden uitgesloten, waaronder de Dataverordening (EU) 2023/2854. »).
- **Paiement** : préciser les moyens acceptés (creditcard, iDEAL, SEPA-incasso). La mention « betaalkaart » trompera une partie des PME néerlandaises.
- **Contact** : « Wij publiceren geen telefoonnummer » est cohérent (pas de `phone` dans le marché `nl`), mais un numéro +31 répondu par l'agent IA serait la meilleure démo et un fort signal de confiance aux Pays-Bas (comme pour le marché `he`).
- **Mentions légales** : numéro de TVA ou OSS le cas échéant ; nom du prestataire de la plateforme téléphonique (cohérence avec la privacy).
- **Cookies** : citer l'art. 11.7a Telecommunicatiewet ; vérifier que le widget de chat (Autocalls) ne dépose pas de cookies ou de localStorage non essentiels ; le lien « Cookies beheren » du pied de page suppose une bannière cohérente avec « geen analytische cookies ».
- **SEO** : enrichir les metas avec les termes recherchés aux Pays-Bas : « telefonische bereikbaarheid », « AI receptionist », « telefoonservice voor zzp en mkb », « afspraken inplannen », « gemiste oproepen ».
- **Variables** : toutes sont injectées correctement. Seuls points restant codés en dur dans la CGU : « veertien (14) … 30 belminuten » (P:252-257), à brancher sur `trial.days` / `trial.minutes` pour éviter une future divergence.

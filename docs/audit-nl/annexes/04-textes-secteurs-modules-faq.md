# Relecture NL, lot 03 : secteurs, modules, offres, FAQ, intégrations, site, index

Fichiers relus intégralement : `src/i18n/content/nl/{sectors,modules,offers,faq,integrations,site,index}.ts` (sources FR sous `fr/`). Les chemins ci-dessous sont relatifs à `src/i18n/content/nl/`.

## 1. Synthèse

**Niveau global : bon à très bon.** Le néerlandais est correct, idiomatique la plupart du temps et visiblement écrit par quelqu'un qui connaît le terrain NL : APK, kenteken, Funda, VvE-beheer, vaststellingsovereenkomst, griffie, confrère, paraveterinair, zorgpas, huisarts/spoedpost, zzp'er, aangifteperiode, 112, pdf's, track-and-tracelink.

- **Registre :** le « u » est tenu partout (« jullie » pour parler de la société reste acceptable).
- **Termes clés stables :** abonnement / Assistent-abonnement / klantomgeving / berichtcredits.
- **Parité avec la source FR :** 14 secteurs, 14 modules, 25 + 18 questions de FAQ.

Problèmes systémiques :

1. **« Goedendag » dans presque tous les dialogues.** La formule sonne flamande ou vieillie aux Pays-Bas.
2. **Aucun dialogue ne montre l'agent annoncer qu'il est une IA**, alors que l'AI Act art. 50 s'applique depuis le 2/8/2026. La FAQ (« eerlijk gepresenteerd ») reste trop vague.
3. **Le marché n'est pas traité sur la TVA, la facturation et les données.**
   - La FAQ « btw » parle de « lokale belastingen » sans évoquer l'autoliquidation (btw verlegd) ni le btw-nummer.
   - Les questions « Waar worden de gespreksgegevens bewaard? » ne disent jamais **où**.
   - La FAQ AVG ne mentionne ni verwerkersovereenkomst ni transfert hors UE, ce qui pèse pour les secteurs santé.
4. **Calques résiduels du français :** « kaart » (fiche), « referentie van de woning » (référence du bien), « plan » (projet), « geschreven contact » (échanges écrits), « ontvangen » (accueillir), « vaststellen » (identifier), « gemeubileerde verhuur » (location meublée), « appartement 12 », « dinsdag de 14e », « voorzie » (belgicisme).
5. **Incohérences de vocabulaire :**
   - uitsluitingslijst / blokkeerlijst ;
   - credit / tegoed / opwaardering ;
   - uitvoeringen / runs / automatiseringen.
6. **Prix en USD, carte bancaire uniquement :** pas d'iDEAL ni de SEPA-incasso. C'est un frein net pour une PME néerlandaise (point transverse).
7. **Hors lot mais bloquant pour la cohérence :** `ui/commerce.ts:305` annonce « dertien modules » alors que `modules.ts` en contient **14**.

## 2. Tableau des corrections

| fichier:ligne | texte actuel | correction proposée (NL) | type | sévérité |
|---|---|---|---|---|
| ui/commerce.ts:305 (hors lot, lié à modules.ts) | dertien modules | veertien modules | incohérence/fait | Bloquant |
| sectors.ts:34, 75, 116, 157, 277, 317, 397, 437, 477, 557 | Goedendag, … | Goedemiddag, … / Goedemorgen, … (ou « Hallo, » côté client) | calque/naturel | Majeur |
| sectors.ts:34-37, 75-78, 477… (tous les `call`) | l'agent n'annonce jamais être une IA | Ajouter au moins dans un dialogue type (idéalement le premier tour de l'agent) : « U spreekt met de digitale assistent van [praktijk]. Waarmee kan ik u helpen? ». Pour l'appel sortant (l. 477) : « Goedemiddag, u spreekt met de AI-assistent van [kantoor]. U vroeg … » | juridique (AI Act art. 50) | Majeur |
| faq.ts:23 | De agent wordt eerlijk gepresenteerd als AI-assistent en kan doorverbinden… | Ja. Aan het begin van elk gesprek meldt de agent dat de beller met een AI-assistent spreekt, zoals de Europese AI-verordening (art. 50) vereist sinds 2 augustus 2026. Op verzoek verbindt hij door met een medewerker, als u dat hebt ingesteld. | juridique | Majeur |
| faq.ts:35 | Ja, alle prijzen worden exclusief belastingen weergegeven. Lokale belastingen komen erbij als ze van toepassing zijn. | Ja, alle prijzen zijn exclusief btw. Bent u een Nederlandse ondernemer met een btw-identificatienummer, dan vult u dat in bij Billing info: de btw wordt dan verlegd (u geeft die zelf aan in uw btw-aangifte). Zonder btw-nummer wordt 21% btw berekend. *(à valider avec le comptable / la config Stripe Tax réelle)* | marché/fait | Majeur |
| faq.ts:41 | Belastingen worden automatisch berekend op basis van uw land en uw status. | … op basis van uw land en uw btw-nummer. De factuur vermeldt uw bedrijfsgegevens en, indien van toepassing, „btw verlegd”. | marché | Mineur |
| sectors.ts:85, 126 ; sectors.ts:567 | Waar worden de gespreksgegevens bewaard? → réponse sur la durée seulement | Répondre réellement à « où » : région d'hébergement (UE ou VS), sous-traitants, verwerkersovereenkomst disponible. Ex. : « Op servers in [regio]. Wij sluiten een verwerkersovereenkomst met u; opnames en transcripties worden bewaard volgens de termijn die u kiest… » | fait/juridique | Majeur |
| faq.ts:19 | Voldoet het aan de AVG? … | Ajouter : verwerkersovereenkomst, liste des subverwerkers, lieu d'hébergement, transfert hors EER (DPF/SCC), gezondheidsgegevens (art. 9 AVG) pour praktijken. Faire valider par un juriste NL. | juridique | Majeur |
| sectors.ts:294 | massagesalons | massagepraktijken | naturel (connotation érotique de « massagesalon » aux NL) | Majeur |
| offers.ts:15 ; faq.ts:20 | Kaart gevraagd… / om een betaalkaart gevraagd | Si seule la carte est acceptée, l'écrire : « Creditcard of debitcard vereist ». Recommandé : proposer iDEAL / SEPA-incasso, attendus aux NL. | marché | Majeur |
| offers.ts:53 ; site.ts:6 | $ 0 / Prijzen in Amerikaanse dollars (USD) | Point transverse : un prix en EUR est attendu aux NL. À défaut, garder la mention USD bien visible près de chaque prix. | marché | Majeur |
| sectors.ts:445 | voorzie een apart vinkje bij het bestellen | zorg voor een apart vinkje bij het afrekenen | faute (belgicisme) | Mineur |
| sectors.ts:445 | Kan hij verlaten winkelmandjes nabellen? Alleen klanten die hebben ingestemd… bij een bestaande klantrelatie | Préciser que le panier abandonné **n'est pas** une klantrelatie : « Een verlaten winkelmandje is nog geen klantrelatie: bel alleen wie daarvoor uitdrukkelijk toestemming heeft gegeven. » | juridique (Tw art. 11.7) | Mineur |
| sectors.ts:486 | Liever niet. | Nee. (l'opt-in est légalement requis en B2C ; « liever niet » minimise) | juridique | Mineur |
| sectors.ts:460, 463, 487 | Verlengingen en contractdata / einddatum van hun contract | Aux NL, les polices se renouvellent tacitement et se résilient mensuellement après la 1re année. Viser plutôt : « Afloop van de rentevaste periode en jaarlijkse polisreviews worden op het laatste moment voorbereid. » / « Klanten op tijd benaderd vóór het einde van hun rentevaste periode » | marché | Mineur |
| sectors.ts:458 | Een offerteaanvraag die u pas de volgende dag terugbelt, heeft vaak al elders getekend. | Wie u pas de volgende dag terugbelt, heeft vaak al elders getekend. | calque/logique | Mineur |
| sectors.ts:36 | Ik woon op de Lindenlaan 12. | Ik woon aan de Lindenlaan 12. | faute idiomatique | Mineur |
| sectors.ts:519, 522 | Vondelstraat 8, appartement 12 / app. 12 | Vondelstraat 8-2 (format NL avec huisnummertoevoeging) | marché | Mineur |
| sectors.ts:560 | dinsdag de 14e om 11.00 uur | dinsdag 14 oktober om 11.00 uur | calque | Mineur |
| sectors.ts:400 | Mr. De Vries | mr. De Vries | typo (titre « mr. » en minuscule) | Mineur |
| sectors.ts:562 | Dr. Bakker | dr. Bakker | typo | Mineur |
| sectors.ts:320, 322 | Camille | Lotte (ou Eva, Sanne) | marché (prénom français) | Mineur |
| sectors.ts:41 | waarschuwt u direct per e-mail of door door te verbinden | waarschuwt u direct per e-mail of verbindt meteen door | style (« door door ») | Mineur |
| sectors.ts:20 | Spoed in de avond en het weekend gesorteerd volgens een script dat u goedkeurt | Spoedmeldingen ’s avonds en in het weekend beoordeeld volgens een script dat u goedkeurt | calque (« trié ») | Mineur |
| sectors.ts:20 | Een Google-review gevraagd een paar dagen na de klus | Een paar dagen na de klus om een Google-review gevraagd | ordre des mots | Mineur |
| sectors.ts:39 | Gebied noord | Regio Noord | naturel | Mineur |
| sectors.ts:50 | Tandartsen en klinieken | Tandartspraktijken en mondzorg | naturel/SEO | Mineur |
| sectors.ts:52 | klinieken voor niet-spoedeisende zorg | (supprimer) ou : zelfstandige behandelcentra | calque | Mineur |
| sectors.ts:91 | Fysiotherapie en paramedisch | Fysiotherapie en paramedische zorg | faute (adjectif seul) | Mineur |
| sectors.ts:94 | Blijf bij uw patiënt, de AI-agent neemt de telefoon van uw praktijk aan | Blijf bij uw patiënt: de AI-agent neemt de telefoon van uw praktijk op | ponctuation/naturel | Mineur |
| sectors.ts:255 | Houd de schaar in de hand, de AI-agent vult uw agenda | Houd de schaar in de hand: de AI-agent vult uw agenda | ponctuation | Mineur |
| sectors.ts:127 | patiënten die hebben gevraagd om bericht bij een vrije plek | patiënten die op de wachtlijst staan voor een eerdere afspraak | naturel | Mineur |
| sectors.ts:138 | jongleren tussen de balie, de behandelkamer en de telefoon | schakelen voortdurend tussen balie, behandelkamer en telefoon | calque | Mineur |
| sectors.ts:165 | een campagne benadert baasjes die daarvoor toestemming hebben gegeven telefonisch, per sms of via WhatsApp zodra… | zodra een vaccinatie eraan komt, benadert een campagne de baasjes die daarvoor toestemming hebben gegeven, telefonisch, per sms of via WhatsApp, en stelt een afspraak voor | syntaxe ambiguë | Mineur |
| sectors.ts:172 | Vastgoed | Makelaardij (ou : Makelaars en vastgoed) | SEO/naturel | Mineur |
| sectors.ts:182 ; 204 | Referentie van de woning / Op basis van de referentie | Om welke woning het gaat (adres of Funda-link) / Op basis van het adres van de woning | calque | Mineur |
| sectors.ts:183, 190, 202, 206 | een nieuw plan / Plan, budget / Plan: Aankoop eigen woning / die het plan kwalificeert | verhuisplannen / Woonwens, budget / Woonwens: koopwoning (eigen bewoning) / die de woonwens uitvraagt | calque (« projet ») | Mineur |
| sectors.ts:239 | Wat is het model en het bouwjaar van de auto? | Wat is het kenteken van de auto? (aux NL, la garage récupère le reste via RDW) | marché | Mineur |
| sectors.ts:252 | Kappers en barbiers | Kappers en barbershops | naturel | Mineur |
| sectors.ts:263 ; 303 | Klanten die drie maanden niet zijn geweest, teruggebeld… | ajouter « (campagnes, Assistent-abonnement) » : ces secteurs pointent vers l'offre Receptionist, qui n'inclut pas les campagnes | incohérence offre | Mineur |
| sectors.ts:302 | lopende kuur | lopend behandeltraject | naturel | Mineur |
| sectors.ts:333 | Horeca en hotels | Restaurants en hotels (l'horeca inclut déjà les hôtels) | redondance | Mineur |
| sectors.ts:339 | midden in de spits | midden in de drukte (ou : tijdens de service) | naturel | Mineur |
| sectors.ts:366 | Kan hij in het Engels antwoorden? | Kan hij in het Engels of Duits antwoorden? (clientèle touristique allemande) | marché | Mineur |
| sectors.ts:378 | als er een nieuwe zaak belt | als een nieuwe cliënt belt | logique | Mineur |
| sectors.ts:412 | E-commerce | Webshops | SEO/naturel | Mineur |
| sectors.ts:415 ; 419 | ook tijdens de uitverkoop / Tijdens de uitverkoop en de feestdagen | ook rond Black Friday en de feestdagen / Rond Black Friday, Sinterklaas en kerst | marché | Mineur |
| sectors.ts:418, 423 ; faq.ts:46 ; offers.ts:51 | „Waar blijft mijn bestelling?” / „Tools & actions” | ‘Waar blijft mijn bestelling?’ (ou “…”) : les guillemets „ ” sont rares dans l'usage NL courant | typo | Mineur |
| sectors.ts:422 | Review vragen na de levering | Om een review vragen na levering | syntaxe | Mineur |
| sectors.ts:494 | gemeubileerde verhuur | short stay- en expatverhuur | calque marché | Mineur |
| sectors.ts:496 ; 502 ; 510 | hij stelt de woning vast / Vaststellen van woning en beller / stelt vast en kwalificeert | hij achterhaalt om welke woning het gaat / Welke woning en wie er belt / De agent vraagt door | calque (« identifier ») | Mineur |
| sectors.ts:496, 527 | appartementseigenaren | eigenaren in de VvE (VvE-leden) | terminologie | Mineur |
| sectors.ts:534 | cosmetisch chirurgen | plastisch chirurgen | terminologie NL | Mineur |
| sectors.ts:35 et autres | Hebt u… | Heeft u… (les deux sont corrects, mais « heeft u » est plus naturel à l'oral, donc dans les dialogues) | naturel | Mineur |
| modules.ts:11, 15 ; sectors.ts:536 | ontvangt uw bellers / Hij ontvangt de beller / ontvangt patiënten discreet | staat uw bellers te woord / begroet de beller / staat patiënten discreet te woord | calque (« accueillir ») | Mineur |
| modules.ts:71, 76, 153 ; offers.ts:98 | gestructureerde kaart / De kaart wordt aangemaakt / CRM-kaart / Prospectkaarten | gestructureerd leadprofiel / Het leadprofiel wordt aangemaakt / CRM-record / Leadprofielen | calque (« fiche ») | Mineur |
| modules.ts:86, 211, 215 vs modules.ts:94 ; offers.ts:116 | uitsluitingslijst / Blokkeerlijst | un seul terme : blokkeerlijst (partout) | incohérence | Mineur |
| modules.ts:84 | Opvolging, bevestigingen en follow-ups | Bevestigingen, herinneringen en opvolging | redondance | Mineur |
| modules.ts:12, 54 | herhaalde vragen / Herhaalde vragen en verkoopgesprekken filteren | terugkerende vragen / Terugkerende vragen en acquisitie filteren | naturel | Mineur |
| modules.ts:45 | Duur, termijnen, soorten afspraken | Duur, buffertijden, soorten afspraken | calque (« délais ») | Mineur |
| modules.ts:48 | Salons en schoonheidssalons | Kapsalons en schoonheidssalons | redondance | Mineur |
| modules.ts:59 | Laad uw content | Upload uw content | calque | Mineur |
| modules.ts:105 | Maak uw sjablonen / Goedgekeurde templates | Maak uw templates / Door WhatsApp goedgekeurde templates | incohérence | Mineur |
| modules.ts:192 | Vergeten formulieren voorkomen | Afgehaakte bezoekers voorkomen | calque | Mineur |
| modules.ts:211 | met beperkt aantal pogingen | met een beperkt aantal pogingen | faute (article manquant) | Mineur |
| offers.ts:31, 39 vs offers.ts:89 | 5.000 uitvoeringen / maand ; 50.000 automatiseringen / maand ; 5.000 runs / maand | un seul terme : « 5.000 automatiseringsruns / maand » partout | incohérence | Mineur |
| offers.ts:39 | Onbeperkt agents, campagnes en kennisbanken | Onbeperkt aantal agents, campagnes en kennisbanken | grammaire | Mineur |
| offers.ts:12, 15 vs offers.ts:74-126 (colonne decouverte) | 14 dagen op het abonnement van uw keuze | La matrice donne à la période d'essai ses propres limites (1 agent, pas de campagnes, 1 outil vs 0 pour Receptionist). À aligner, avec un libellé du type « proefperiode: limieten zoals hieronder » (point probablement hérité du FR) | incohérence | Mineur |
| offers.ts:54 | Op offerte | Op aanvraag | naturel | Mineur |
| offers.ts:46 | Spreek een specialist | Praat met een specialist | naturel | Mineur |
| offers.ts:105 ; faq.ts:47 ; offers.ts:31, 39 | Geschreven contact / Ze betalen geschreven contact / geschreven antwoorden | Schriftelijk contact / Hiermee betaalt u schriftelijk contact / schriftelijke antwoorden | calque | Mineur |
| offers.ts:126 | Hulpbronnen | Helpcentrum en documentatie | calque (« ressources ») | Mineur |
| faq.ts:33 ; site.ts:9 vs faq.ts:36, 45 | vul credit aan / opwaardering / tegoed | uniformiser : « tegoed opwaarderen » partout (en gardant « Add credits » entre parenthèses) | incohérence | Mineur |
| faq.ts:16 | Landen die u kunt kopen: | Landen waarvoor u een nummer kunt kopen: | faute de sens | Mineur |
| faq.ts:6 | rekent u meestal op een tot twee dagen | rekent u meestal op één tot twee dagen | typo (accent distinctif) | Mineur |
| faq.ts:22 | om uw behoefte te begrijpen | om uw situatie door te nemen | calque | Mineur |
| faq.ts:25 | De stemmen zijn native in elke taal | Er zijn natuurlijk klinkende Nederlandse stemmen, net als voor andere talen | anglicisme | Mineur |
| faq.ts:27 | Mijn monteurs staan de hele dag op de bouw | Mijn monteurs zijn de hele dag op pad | naturel (des installateurs ne sont pas « op de bouw ») | Mineur |
| integrations.ts:8 | Boekingen op uw evenementen. | Boekingen via uw afspraaktypen. | calque | Mineur |
| integrations.ts:13 | Eén regel per aanvraag | Eén rij per aanvraag | terminologie tableur | Mineur |
| integrations.ts:21 | +300 tools | 300+ tools | typo/usage | Mineur |
| markets.ts:125 (tagline, hors lot) vs contenu | AI-telefonieassistent | AI-telefoonassistent (le terme utilisé partout dans le contenu) | incohérence/SEO | Mineur |

## 3. Manques / ajouts recommandés

**FAQ attendue par un ondernemer néerlandais (absente ou trop vague) :**
1. **Btw et factuur.** Expliquer l'autoliquidation en B2B (btw verlegd), où saisir le btw-nummer, et confirmer que la facture convient à la boekhouding (Moneybird, Exact, e-Boekhouden). Une LLC américaine n'a pas de KvK-nummer : le dire, ou indiquer l'entité contractante.
2. **Données dans l'UE ?** Indiquer le lieu d'hébergement, les sous-traitants (fournisseur LLM, Autocalls…), la verwerkersovereenkomst et le mécanisme de transfert (EU-US DPF / SCC). C'est critique pour les tandartsen, fysio, dierenartsen, advocaten et klinieken (données de santé, secret professionnel). La question revient trois fois dans sectors.ts sans réponse.
3. **Gesprekken opnemen.** Créer une question dédiée. Aux NL, l'enregistrement par une partie est permis, mais le RGPD/AVG impose d'informer l'appelant : prévoir une annonce en début d'appel, configurable.
4. **Accent / Vlaams.** La voix est-elle néerlandaise (NL) ou flamande ? Peut-on choisir ? L'agent comprend-il les accents régionaux et le flamand ?
5. **Nederlands nummer.** Préciser qu'un 085 ou un numéro géographique (020, 010…) est disponible, avec les documents exigés (adresse dans la zone pour un géographique, règles ACM). Préciser aussi le coût d'un doorschakelen depuis KPN, Vodafone ou Odido.
6. **Opzeggen.** C'est déjà couvert. Ajouter « maandelijks opzegbaar » de façon explicite (argument de vente fort aux NL).
7. **Betaalmethoden.** Dire quels moyens sont acceptés (iDEAL ? SEPA-incasso ?). Si c'est la carte seule, l'écrire clairement.

**Juridique :**
- AI Act art. 50 : afficher une phrase d'annonce IA type dans les dialogues et dans le module receptionist.
- Telecommunicatiewet art. 11.7 (opt-in B2C depuis le 1/7/2021) : c'est bien traité dans e-commerce et assurance. Ajouter une mention du droit d'opposition à chaque appel aux clients existants, et le rappel que l'exception « klantrelatie » ne vaut que pour des produits similaires.
- Assurance / hypothèque : citer la Wft et l'AFM. L'agent ne doit faire ni advies ni bemiddeling ; la vergunning reste chez l'adviseur.
- Santé : évoquer les gezondheidsgegevens (art. 9 AVG) et la NEN 7510, une attente du secteur.
- Toutes ces mentions doivent être validées par un juriste néerlandais.

**Réalités locales à intégrer (valeur ajoutée, non bloquant) :**
- **Secteurs :**
  - Tandarts : patiëntenstop / wachtlijst (« nieuwe patiënten op de wachtlijst gezet »).
  - Fysio : directe toegang zonder verwijzing (DTF).
  - Horeca : Formitable / Zenchef / TheFork.
  - Salons : Salonized / Treatwell.
  - Makelaars : Realworks.
  - Webshops : Bol.com-partners, PostNL / DHL track & trace, iDEAL, Thuiswinkel Waarborg, ACM-regels voor retourneren (14 dagen bedenktijd).
- **Calendrier :** Koningsdag, bouwvak (installateurs), Sinterklaas/Black Friday (webshops), aangifteperiode IB jusqu'au 1er mai (déjà sous-entendu).
- **WhatsApp :** canal dominant aux NL, à mettre plus en avant (déjà présent, mais rarement en premier).
- **Intégrations :** mentionner explicitement que les logiciels NL (Salonized, Realworks, Exquise/Simplex, Intramed, Exact, Moneybird) se connectent via webhooks ou la flow builder (sans promettre de connecteur natif).
- **Prénoms :** Sophie, Thomas, De Vries et Bakker sont crédibles aux NL. Seule Camille sonne français.

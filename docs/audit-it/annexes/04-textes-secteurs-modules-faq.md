# Relecture IT — lot 03 : secteurs, modules, offres, FAQ, intégrations, site, index

Périmètre : `src/i18n/content/it/` → sectors.ts (572 l.), modules.ts (220), offers.ts (129), faq.ts (52), integrations.ts (24), site.ts (15), index.ts (27). Comparaison avec `fr/`. Aucun fichier du dépôt modifié.

## 1. Synthèse

L'italien est **de bonne qualité** : pas de fautes de grammaire lourdes, et une vraie localisation sur plusieurs secteurs (730/F24, « sotto scadenza », contestazione disciplinare, fattura per detrazione / fondo sanitario, CAP, revisione, bollino caldaia, Registro pubblico delle opposizioni, Garante). Le registre **Lei** est tenu sans écart sur tout le lot, toujours avec la majuscule de politesse. On compte bien **14 secteurs et 14 modules** ; index.ts est conforme au type `typeof fr`. Pas de Doctolib, mutuelle ni Bloctel résiduels.

Problèmes systémiques :
1. **Doublon visible dans la FAQ tarifs** (faq.ts:112-113) : la même question figure deux fois, et deux objets sont collés sur une même ligne.
2. **Fiscalité italienne absente ou floue.** « IVA esclusa / imposte locali se applicabili » ne dit pas au client italien ce qui l'attend. Pour une entreprise avec Partita IVA, une LLC américaine ne facture pas d'IVA : le client applique l'*inversione contabile* (reverse charge) et fait l'*integrazione* (autofattura TD17 via SDI). Il n'existe ni fattura elettronica SDI ni FAQ sur ce point, alors que c'est la première question d'un imprenditore italien.
3. **Juridique : appels sortants d'un agent IA.** En Italie, un appel promotionnel passé par un système automatisé exige un consentement préalable (art. 130 c.1 Codice privacy), **même vers un client existant**. Le site répète « chiama solo i Suoi clienti, con cui ha già un rapporto », ce qui laisse croire que la relation existante suffit (relance d'anciens clients avec « offerta », relance devis, réactivation). Un dialogue sortant (courtiers) ne contient par ailleurs **aucune annonce IA**, alors que l'AI Act art. 50 s'applique depuis le 2/8/2026. **Validation par un avocat italien nécessaire.**
4. Les FAQ **« Dove vengono conservati i dati… »** (dentaire, kiné, esthétique) ne disent jamais *où* (pays ou région d'hébergement). C'est sensible pour des données de santé (art. 9 GDPR).
5. Calques récurrents du français : « dal piano Assistant » pour « dès le forfait Assistant » (17 occurrences, ambigu), « candidati inquilini », « in un quadro controllato », « politica di reso », « guasti in locazione ». « slot » apparaît 17 fois, en concurrence avec « orario / posto libero ».
6. Terminologie flottante : *Lista di blocco* / *lista di esclusione* (incohérence héritée du FR), *annullare* / *disdire* l'abonnement. Le terme métier « Broker del credito » est incorrect : le terme réglementé est *mediatore creditizio* (OAM).

## 2. Tableau des corrections

| fichier:ligne | texte actuel | correction proposée | type | sévérité |
|---|---|---|---|---|
| faq.ts:112-113 | `…cresce; la modifica viene mostrata prima della conferma.' },  { q: 'Cosa succede quando finiscono i miei minuti?' … }` puis `{ q: 'Cosa succede quando i miei minuti finiscono?' … }` | Supprimer l'une des deux entrées (garder la l.113) et remettre un retour à la ligne après la l.112. Le FR n'a qu'une entrée (« Que se passe-t-il quand mes minutes sont épuisées ? »). | incohérence | Majeur |
| faq.ts:103 | I prezzi sono IVA esclusa? — « Sì, tutti i prezzi sono indicati IVA esclusa. Le imposte locali si aggiungono se applicabili. » | « Sì, tutti i prezzi sono IVA esclusa e in dollari USA. Se è un’azienda o un professionista con Partita IVA, la nostra fattura non riporta l’IVA: si applica l’inversione contabile (reverse charge) e l’integrazione si fa con autofattura tramite SDI, come per ogni fornitore extra-UE. Se acquista come privato, l’IVA italiana (22%) viene aggiunta al momento del pagamento. » (à valider par un commercialista) | marché / fait | Majeur |
| faq.ts:109 | Come vengo fatturato? … « Le imposte sono calcolate automaticamente in base al Suo paese e al Suo status. » | Q : « Come funziona la fatturazione? » ; fin : « …in base al Suo paese e alla Sua posizione fiscale (privato o titolare di Partita IVA). La fattura è emessa da una società statunitense e non transita dal Sistema di Interscambio (SDI): il Suo commercialista la registrerà con integrazione/autofattura. » | marché / calque | Majeur |
| faq.ts:87 | È conforme al GDPR? … (aucune mention du lieu d'hébergement, du DPA, du transfert extra-UE ni de l'enregistrement) | Ajouter : « …Forniamo un accordo sul trattamento dei dati (art. 28 GDPR). I dati sono ospitati in [paese/regione] ; gli eventuali trasferimenti fuori dall’UE avvengono sulla base di [DPF / clausole contrattuali standard]. Se registra le chiamate, l’agente lo comunica a chi chiama all’inizio della conversazione. » | juridique / marché | Majeur |
| sectors.ts:85, 126 ; sectors.ts:567 | « Dove vengono conservati i dati delle chiamate? » → la réponse ne parle que de durée (« per il periodo che sceglie Lei ») ; l.567 : « Nella Sua area protetta » | Répondre à la question : « Su server situati in [UE/USA…], nella Sua area clienti protetta, per il periodo che sceglie Lei… » ou reformuler la question : « Per quanto tempo vengono conservati…? » (dati sanitari, art. 9 GDPR) | fait / juridique | Majeur |
| modules.ts:206 ; sectors.ts:45 ; sectors.ts:86 ; sectors.ts:208 | « Richiama solo i Suoi clienti, con cui ha già un rapporto. » / « Chiama solo i Suoi clienti… » / « se sono già seguiti dal Suo studio » | Ajouter la condition de consentement : « Richiama solo i Suoi clienti che hanno acconsentito a essere ricontattati (per chiamate automatizzate a fini promozionali in Italia serve il consenso preventivo, art. 130 Codice privacy). I promemoria di servizio (conferme, appuntamenti) non sono marketing. » — validation par un avocat italien | juridique | Majeur |
| sectors.ts:477 | agent : « Buongiorno, ha chiesto pochi minuti fa sul nostro sito un preventivo per la polizza del mutuo. » | « Buongiorno, sono l’assistente virtuale AI dello studio Rossi Assicurazioni. Ha chiesto pochi minuti fa sul nostro sito un preventivo… » (AI Act art. 50, applicable depuis le 02/08/2026) | juridique | Majeur |
| sectors.ts:452 (+ clé `SECTOR_SEO` dans ui/commerce.ts:12) | name : « Broker assicurativi e del credito » | « Intermediari assicurativi e mediatori creditizi » (« broker del credito » ne s'emploie pas en Italie ; le terme réglementé est *mediatore creditizio*, OAM). ⚠ La clé `SECTOR_SEO['Broker assicurativi e del credito']` doit être renommée en même temps, sinon le meta tombe sur le fallback. | marché / SEO | Majeur |
| sectors.ts:454 | « Broker assicurativi, agenzie assicurative, mediatori creditizi e di mutui, consulenti finanziari e patrimoniali » | « Broker e agenzie assicurative (RUI/IVASS), mediatori creditizi e agenti in attività finanziaria (OAM), consulenti finanziari » | marché | Mineur |
| sectors.ts:61, 70, 102, 111, 143, 152, 165, 183, 192, 224, 233, 263, 272, 303, 312, 325 ; faq.ts:82 (« a partire da », déjà correct) | « Promemoria il giorno prima dal piano Assistant » ; « inclusi dal piano Assistant » | « …a partire dal piano Assistant » ou « (piano Assistant e superiori) ». « dal piano X » se lit « fourni par le forfait X », pas « dès le forfait X ». | calque | Majeur (systémique) |
| site.ts:35 ; offers.ts:58-60 ; faq.ts:84, 101, 105, 117 | « IVA esclusa » partout, avec prix en USD | Garder « IVA esclusa », mais renvoyer une fois vers la FAQ IVA/reverse charge (cf. faq.ts:103). Éviter « eventuali imposte locali in aggiunta », trop vague : « IVA esclusa (reverse charge per i titolari di Partita IVA) ». | marché | Mineur |
| site.ts:38 | « Paghi a consumo: … senza abbonamento. Aggiunge credito quando vuole (Add credits); non scade. Un piano costa meno appena le chiamate sono regolari. » | « …senza abbonamento. Aggiunga credito quando vuole (Add credits): il credito non scade. Un piano conviene non appena le Sue chiamate diventano regolari. » (mélange impératif/indicatif ; « non scade » sans sujet) | faute | Mineur |
| site.ts:34 ; faq.ts:112 | « Passi al piano superiore quando il Suo volume cresce » | « …quando il Suo volume di chiamate cresce » | naturel | Mineur |
| integrations.ts:22 | name « +300 strumenti » | « Oltre 300 strumenti » (« +300 » vient de « + de 300 ») | calque | Mineur |
| integrations.ts:14 | « Una riga per richiesta, senza reinserimenti. » | « Una riga per richiesta, senza ricopiare nulla a mano. » | naturel | Mineur |
| faq.ts:77 | « Più chiamate vengono gestite in parallelo sulla stessa linea: i Suoi clienti non restano più in attesa. » | « …in parallelo sulla stessa linea, fino al limite del Suo piano (2, 5 o 20 chiamate simultanee): niente più clienti in attesa. » | fait | Mineur |
| faq.ts:82 | « concatena trigger e azioni con il drag and drop, collegati a oltre 300 strumenti » | « collega trigger e azioni con il drag and drop e si integra con oltre 300 strumenti » (« collegati » se rapporte mal) | faute | Mineur |
| faq.ts:86 | Q : « Come caricate le informazioni della mia azienda? » / R : « Aggiunge i Suoi documenti… » | Q : « Come fornisco all’agente le informazioni sulla mia azienda? » (la question dit « vous chargez », la réponse « vous ajoutez ») | calque / incohérence | Mineur |
| faq.ts:93 | « Le voci sono native in ogni lingua » | « Le voci sono madrelingua in ogni lingua » | calque | Mineur |
| faq.ts:88 | « All’attivazione è richiesta una carta » | « Al momento dell’attivazione è richiesta una carta di credito o di debito » | naturel | Mineur |
| faq.ts:110-111 ; offers.ts:15 ; faq.ts:88 | « annulla / annullamento » (l.111, l.88, offers) et « disdire / disdetta » (l.110) | Pour un abonnement, utiliser partout « disdire / disdetta » ; garder « annullare » seulement pour la prova. Q l.111 : « Come disdico il mio abbonamento? » | incohérence | Mineur |
| offers.ts:116 ; modules.ts:94 vs modules.ts:215, 211 ; faq.ts:87 ; modules.ts:86 | « Lista di blocco » vs « Lista di esclusione » | Un seul terme : « Lista di esclusione » (plus parlant ; c'est aussi le terme de la FAQ GDPR). Incohérence déjà présente en FR. | incohérence | Mineur |
| offers.ts:29 | « Il piano Assistant aggiunge tre agenti » | « Il piano Assistant porta a tre gli agenti » (Receptionist en a 1, Assistant 3 au total ; même erreur en FR) | fait | Mineur |
| offers.ts:37 | « Il piano Call Center elimina i limiti » | « Il piano Call Center alza i limiti » (il reste 20 appels simultanés et 10 numéros) | fait | Mineur |
| offers.ts:39 | « Agenti, campagne e basi illimitati » | « Agenti, campagne e basi di conoscenza illimitati » | clarté | Mineur |
| offers.ts:13 | « per verificarne il potenziale sulla Sua attività » | « …per la Sua attività » | calque | Mineur |
| offers.ts:43 | audience « Oltre 2.500 minuti regolari » | « Oltre 2.500 minuti al mese » | naturel | Mineur |
| offers.ts:78 | « Lingue secondarie » | « Lingue aggiuntive » | naturel | Mineur |
| offers.ts:90 | « Gestisca il Suo spazio da ChatGPT o Claude » | « Gestisca il Suo account da ChatGPT o Claude » (« spazio » = calque de « espace ») | calque | Mineur |
| offers.ts:104 | « Ricontatti, conferme e promemoria chiamati automaticamente. » | « Ricontatti, conferme e promemoria con chiamate automatiche. » | faute | Mineur |
| modules.ts:14 | step « Descrive la Sua attività » | « Descriva la Sua attività » (les autres étapes sont à l'impératif ; « Descrive » est un indicatif) | faute | Mineur |
| modules.ts:26, 31 | « Sente la voce, il ritmo… » / « Vede cosa ha capito l’agente » | « Sentirà la voce… » / « Vedrà cosa ha capito l’agente » | naturel | Mineur |
| modules.ts:42 | « Liberare la reception dalle chiamate di pianificazione » | « …dalle chiamate per fissare gli appuntamenti » | calque | Mineur |
| modules.ts:61 ; sectors.ts:41 | « Si basa esclusivamente sui contenuti che ha approvato » / « le indicazioni di sicurezza che ha approvato » | « …che Lei ha approvato » (sinon le sujet compris est l'agent) | ambiguïté | Mineur |
| modules.ts:63 | « Primo livello tecnico » | « Assistenza tecnica di primo livello » | naturel | Mineur |
| modules.ts:84 | « Ricontatti, conferme e follow-up, in un quadro controllato. » | « …nel rispetto delle regole e sotto il Suo controllo. » | calque | Mineur |
| modules.ts:87 | « Ricontattare i preventivi in sospeso » | « Sollecitare i preventivi in sospeso » | naturel | Mineur |
| modules.ts:147 | « Automatizzare il dopo-chiamata » | « Automatizzare le attività post-chiamata » | calque | Mineur |
| modules.ts:183 | « Confronto per agente » | « Confronto tra agenti » | naturel | Mineur |
| modules.ts:192 | « Evitare moduli dimenticati » | « Ridurre i moduli abbandonati » | naturel | Mineur |
| modules.ts:198 | « Pagine contatti » | « Pagina Contatti » | naturel | Mineur |
| modules.ts:211 | « con richiami limitati e lista di esclusione » | « con un numero limitato di tentativi e lista di esclusione » (« richiami » se confond avec le module « Richiamo ») | ambiguïté | Mineur |
| sectors.ts:10, 12 | « mentre i Suoi tecnici sono in cantiere » | « …sono fuori per un intervento » (« cantiere » convient aux travaux, pas à un idraulico chez un client) | naturel | Mineur |
| sectors.ts:11 | « …termoidraulici, caldaisti, climatizzazione, coperture, ristrutturazioni… » | « Idraulici, elettricisti, termoidraulici, centri assistenza caldaie, installatori di climatizzatori, lattonieri e coperture, imprese di ristrutturazione, fabbri, imprese di pulizia » (liste homogène : des métiers, pas des domaines) | naturel | Mineur |
| sectors.ts:54 | « l’assistente alla poltrona resta accanto al dentista » | « l’ASO (assistente di studio odontoiatrico) resta accanto al dentista » | marché | Mineur |
| sectors.ts:123 ; sectors.ts:524 | « invito a rivolgersi al pronto soccorso » / « chiede di chiamare i soccorsi » | « …invito a chiamare il 112 o a recarsi al pronto soccorso » / « invita a chiamare subito il 112 » | marché | Mineur |
| sectors.ts:142 | « Richieste di esiti, ricette e alimenti da inoltrare » | « Richieste di esiti, ricette elettroniche veterinarie e alimenti dietetici da inoltrare » | marché | Mineur |
| sectors.ts:179 | « I contatti dei portali aspettano troppo a lungo una risposta. » | « I contatti da Immobiliare.it, Idealista e Casa.it aspettano troppo a lungo una risposta. » | marché / SEO | Mineur |
| sectors.ts:182, 183 | « Guasti in locazione e ticket » / « Guasti in locazione separati… » | « Guasti segnalati dagli inquilini e ticket » / « Guasti degli inquilini separati… » | calque | Mineur |
| sectors.ts:239 | « Qual è il modello e l’anno del veicolo? » | « Mi dice modello e anno di immatricolazione dell’auto? » | naturel | Mineur |
| sectors.ts:254 | « Saloni di parrucchiere, … acconciature a domicilio » | « Saloni di acconciatura, … parrucchieri a domicilio » | naturel | Mineur |
| sectors.ts:262 | « meches » | « mèches » | typo | Mineur |
| sectors.ts:263 | « Clienti che non tornano da tre mesi richiamate » | « Clienti che non si vedono da tre mesi richiamati » (secteur mixte avec barbiers ; l.269 dit « Il cliente ») | faute (accord) | Mineur |
| sectors.ts:280, 282 | « per 1 ora e 45 » / « 1 h 45 » | « per un’ora e tre quarti » / « 1 h 45 min » | naturel | Mineur |
| sectors.ts:302, 310 | « Avvertenze da segnalare: gravidanza, allergie » / « eventuali avvertenze » | « Controindicazioni da segnalare: gravidanza, allergie » / « eventuali controindicazioni » | calque | Mineur |
| sectors.ts:361 | « Preso nota, lo segnalo al team. » | « Ne prendo nota e lo segnalo alla cucina. » | faute | Mineur |
| sectors.ts:375, 378 | « Non perda più una nuova pratica… » / « …quando chiama una nuova pratica. » | « Non perda più un nuovo cliente mentre è in udienza… » / « …quando chiama un potenziale nuovo cliente. » (une « pratica » ne téléphone pas) | calque | Mineur |
| sectors.ts:422, 444 | « secondo la Sua politica » / « Sua politica di spedizione e reso » | « secondo le Sue condizioni di reso » / « …condizioni di spedizione e reso » | calque | Mineur |
| sectors.ts:458 | « Una richiesta di preventivo richiamata il giorno dopo ha spesso già firmato altrove. » | « Chi ha chiesto un preventivo e viene richiamato il giorno dopo spesso ha già firmato altrove. » | calque | Mineur |
| sectors.ts:487 | « …per fissare un appuntamento di revisione » | « …per fissare un appuntamento di verifica della polizza » (« revisione » fait penser à l'auto) | ambiguïté | Mineur |
| sectors.ts:494 | « gestori di residence e affitti arredati » | « property manager di affitti brevi e case vacanza, gestori di residence » (« affitti arredati » est un calque de « location meublée ») | marché / calque | Mineur |
| sectors.ts:496, 500, 502, 503, 525 ; sectors.ts:207 | « candidati / candidati inquilini / documenti per la candidatura » | « aspiranti inquilini » / « documenti richiesti per l’affitto » | calque | Mineur |
| sectors.ts:518 | « l’acqua tocca un impianto elettrico? » | « l’acqua arriva vicino a prese o punti luce? » | naturel | Mineur |
| sectors.ts (17 occurrences : 61, 70, 99, 111, 127, 143, 263, 266, 271, 303, 539, 543, 552…) | « slot / slot liberati » | Pour ces publics (dentistes, coiffeurs, kinés), préférer « posto libero / orario libero in agenda » ; à défaut, garder « slot » mais de façon homogène (cf. « orari liberi » dans modules.ts:42 et integrations.ts) | naturel | Mineur |
| ui/commerce.ts:315 (hors lot, pour info) | « Il Suo centralino virtuale AI in tredici moduli » | « …in quattordici moduli » (modules.ts en contient 14). `FEATURE_SEO` ne contient pas non plus « Richiamo dei clienti inattivi » | fait | Majeur (à remonter au lot UI) |

## 3. Manques / ajouts recommandés

FAQ générale à ajouter, dans l'ordre de priorité pour un imprenditore italien :
1. **« Ricevo una fattura elettronica? Come funziona l’IVA? »** : facture d'un fournisseur US hors SDI, reverse charge, integrazione TD17, Partita IVA à saisir dans l'area clienti (Billing info) ; particulier : IVA 22 %. À valider par un commercialista.
2. **« Capisce l’accento regionale e il dialetto? »** : réponse honnête, du type « comprende l’italiano con qualsiasi accento regionale ; il dialetto stretto può ridurre la comprensione, nel qual caso l’agente chiede di ripetere o passa la chiamata ». À tester avant publication.
3. **« Posso avere un numero italiano (+39)? »** : oui (Italia figure dans la liste) ; préciser fixe géographique ou mobile, les justificatifs demandés (documento d’identità, indirizzo nel distretto), la portabilité d'un numéro existant et le coût d'inoltro chez TIM, Vodafone, WindTre ou Fastweb.
4. **« Dove sono conservati i dati? »** : pays d'hébergement, sous-traitant (Autocalls), DPA art. 28, transferts extra-UE (DPF/SCC), suppression.
5. **« Le chiamate vengono registrate? Devo informare chi chiama? »** : l'agent doit annoncer l'enregistrement et sa nature IA dès le début ; informativa privacy à mettre à jour.
6. **« Rispetta l’AI Act? »** : art. 50, transparence en vigueur depuis le 02/08/2026 ; la FAQ faq.ts:91 en parle sans le citer.
7. **« E durante le ferie, Ferragosto e i ponti? »** : horaires et fermetures configurables, message spécifique pour les fermetures d'août et les festivités du saint patron local.

Ajouts sectoriels :
- **Ristoranti/hotel** : FAQ « Funziona con TheFork / Booking.com / il mio channel manager? ». Réponse honnête : pas de connecteur natif, passage par les automatisations ou un webhook, sinon prise de la demande. Côté hôtel : check-in/check-out, imposta di soggiorno. Ajouter tedesco/francese à côté de l'inglese (tourisme).
- **Officine** : campagne « cambio gomme invernali » (obligation du 15 novembre au 15 aprile) ; demander la targa ; rappel revisione biennale.
- **Dentistes** : questions sur fondi sanitari integrativi, convenzioni, finanziamento delle cure et preventivi.
- **Fisioterapia** : distinguer privé et convenzionato SSN/ASL (ricetta du medico di base) dans les « domande pratiche ».
- **Gestione affitti brevi** : check-in à distance, CIN (codice identificativo nazionale), clients Airbnb et Booking. Le secteur cite des « affitti arredati » mais ne couvre pas les affitti brevi, très demandés en Italie.
- **Assurances** : le scénario « polizza mutuo » transpose l'« assurance emprunteur » française. En Italie, le cas d'usage dominant est la **RC auto en scadenza** (comparateurs Facile.it, Segugio). Envisager de remplacer le dialogue l.476-482 par une RC auto.
- **WhatsApp** : c'est le canal dominant en Italie. Le mettre en avant pour les rappels de rendez-vous (parrucchieri, estetica, dentisti), avec le rappel « template Meta a pagamento per paese ».

Cohérence et transverse :
- **AI vs IA** : le lot utilise « AI » (≈144 occurrences au total) mais guides.ts et ui/components.ts emploient « IA » (≈28), par exemple « agente vocale IA ». Harmoniser sur « AI », la forme dominante dans le marketing italien. La marque reste « PermanenceIA ».
- **Majuscule de politesse** (Suo/La/Le, « proporLe », « riceverLa ») : cohérente mais datée pour un SaaS en 2026, la plupart des éditeurs italiens écrivant « lei/suo » en minuscule ou passant au « tu ». C'est une décision globale, à prendre pour tout le site ; je ne la compte pas comme une faute.
- **Genre** : « una receptionist », « l’agente », « un assistente telefonico » et « un’assistente di supporto » / « la nostra assistente vocale » coexistent. C'est acceptable (noms différents), mais il faut s'assurer que la démo (prénom et voix) colle au genre employé dans le texte.
- **Couplage SEO** : `SECTOR_SEO` et `FEATURE_SEO` (ui/commerce.ts) sont indexés par le `name`. Tout renommage de secteur ou de module dans ce lot doit être répercuté dans ces deux tables.
- **Registro pubblico delle opposizioni** : correctement cité (sectors.ts:445, 486). Le citer aussi dans le module « Campagne in uscita » (modules.ts:86), avec la mention du consentement préalable pour les appels automatisés.

# Relecture IT — Lot 04 : guides pratiques + aide (src/i18n/content/it/guides.ts, it/help.ts)

## 1. Synthèse

- **Niveau global : bon à très bon.** L'italien est correct, fluide et sans faute d'orthographe. Les élisions (un'IA, un'istruzione) et les guillemets « » sans espaces sont justes. L'apostrophe typographique est employée partout. Les 30 guides suivent exactement la structure FR (mêmes slugs, même ordre, mêmes sections).
- **Registre :** le « Lei » est tenu sans exception (Suo/Sua/La/Le en majuscule) dans les deux fichiers et dans le reste du site IT. Les exemples de prompt adressés à l'IA (« Sei l'assistente… », « Rendi il tono… ») sont à juste titre au « tu ». Aucun mélange.
- **Localisation réussie :** persona « studio Rossi, Giulia », « uso del Lei » dans le guide des consignes, « lingua Italian », +393471234567, « numero verde ». Le guide « Chi può far chiamare » est réécrit pour l'Italie : Registro pubblico delle opposizioni étendu aux mobiles, GDPR, Garante, et la France reléguée dans « altri Paesi ». Aucun reste français trouvé : pas d'opérateur français, pas de 01/06, pas de CNIL/RGPD/Bloctel, pas d'heure de Paris, pas de « € ».
- **Libellés anglais de l'interface :** ils restent en anglais et sont cohérents avec le FR. Deux écarts viennent déjà du FR : « Speak with / Speak to your assistant », et « Test assistant » présenté dans l'aide comme un test vocal.
- **Problèmes systémiques :**
  1. Calque récurrent « presa di appuntamenti » (FR « prise de rendez-vous »), présent jusque dans deux titres. L'usage italien est « prenotazione (degli) appuntamenti ».
  2. Guide « inoltro di chiamata » : les codes GSM sont exacts pour TIM, Vodafone, WindTre et Iliad, mais il manque le terme le plus courant en Italie (« deviazione di chiamata »), les particularités italiennes (segreteria déjà branchée sur les déviations conditionnelles, 0 conservé après +39) et toute indication sur les lignes fixes italiennes.
  3. Plusieurs points de marché manquent : justificatifs pour un numéro italien, anti-spoofing AGCOM sur le numéro affiché, fattura elettronica/SDI, horaires réalistes (pausa pranzo) et prefissi dedicati au télémarketing.
  4. L'exemple de message d'accueil n'annonce pas que l'agent est une IA, alors que la checklist du même lot l'exige (AI Act art. 50).
  5. Le sigle « IA » est employé dans les guides et « AI » dans le reste du site.

## 2. Tableau des corrections

| fichier:ligne | texte actuel | correction proposée | type | sévérité |
|---|---|---|---|---|
| it/guides.ts:256 | «Buongiorno, studio Rossi, sono Giulia… Come posso aiutarLa?» | «Buongiorno, studio Rossi, sono Giulia, l’assistente virtuale dello studio… Come posso aiutarLa?» | fait / juridique (AI Act art. 50 ; contradiction avec guides.ts:1058 « dice che si tratta di un’IA ») | Majeur |
| it/guides.ts:61, 88, 168, 179, 320, 336, 469, 516 (et autres occurrences) | presa di appuntamenti / presa di appuntamento | prenotazione degli appuntamenti / prenotazione di un appuntamento (selon le contexte : « fissare appuntamenti ») | calque | Majeur (systémique) |
| it/guides.ts:393 | Presa di appuntamenti con Cal.com | Prenotazione appuntamenti con Cal.com | calque / SEO | Majeur |
| it/guides.ts:429 | Presa di appuntamenti con Calendly | Prenotazione appuntamenti con Calendly | calque / SEO | Majeur |
| it/guides.ts:985 | Cerchi «inoltro di chiamata» o «trasferimento di chiamata». | Cerchi «deviazione di chiamata», «trasferimento di chiamata» o «inoltro di chiamata» (i nomi variano da operatore a operatore). | marché | Majeur |
| it/guides.ts:962 (title) | Mantenere il Suo numero con l’inoltro di chiamata | Mantenere il Suo numero con la deviazione di chiamata (« deviazione chiamate » est le terme des menus Android, de Vodafone et de WindTre, et la requête la plus recherchée) | SEO / marché | Mineur |
| it/guides.ts:972 | …digiti il codice seguito dal numero dell’agente in formato internazionale, poi # e il tasto di chiamata: | …digiti il codice seguito dal numero dell’agente in formato internazionale (per un numero fisso italiano lo 0 resta: +39 02…), poi # e il tasto di chiamata. In alternativa: iPhone «Impostazioni › Telefono › Inoltro chiamate», Android «Telefono › Impostazioni › Deviazione chiamate», oppure l’app del Suo operatore. | marché | Mineur |
| it/guides.ts:978 | Per disattivare: ##61#, ##67#, ##62# o ##21#, oppure ##002# per annullare tutto. | …oppure ##002# per annullare tutto (attenzione: disattiva anche la deviazione verso la segreteria telefonica dell’operatore). | marché | Mineur |
| it/guides.ts:982 | Su una linea fissa o un modem | Su una linea fissa (fibra/ADSL) o un centralino | naturel | Mineur |
| it/guides.ts:79 | (campagne, richiami) | (campagne, richiamate) — en italien, « richiamo » désigne un rappel au sens de « reminder/vaccin », pas un rappel téléphonique | faute lexicale | Mineur |
| it/guides.ts:915 | una campagna di richiamo | una campagna di ricontatto (terme d’offers.ts : « campagne di ricontatto ») | incohérence | Mineur |
| it/guides.ts:95, 114, 348 | metterlo in servizio / prima della messa in servizio | attivarlo / prima dell’attivazione (« messa in servizio » est un calque de « mise en service », réservé aux machines) | calque | Mineur |
| it/guides.ts:528 | il numero incluso dipende dal piano | il numero di linee incluse dipende dal piano (FR « le nombre inclus » = la quantité ; la formulation actuelle laisse lire « le numéro inclus ») | contresens / ambiguïté | Mineur |
| it/guides.ts:551 | Ha Twilio o Telnyx: importi i Suoi numeri. | Ha già un account Twilio o Telnyx: importi i Suoi numeri. | naturel | Mineur |
| it/guides.ts:759 | Orari: una o più fasce al giorno (ad esempio 9–12 e 14–18) | (ad esempio 9–13 e 14:30–18:30) — la pause 12–14 est française ; en Italie, la pausa pranzo se situe vers 13–14:30 | marché | Mineur |
| it/guides.ts:752 | Contatti che hanno accettato di essere contattati. | Contatti che hanno dato il consenso a essere chiamati e numeri verificati nel Registro pubblico delle opposizioni (per le chiamate commerciali). | marché / répétition | Majeur |
| it/guides.ts:650 | Il Suo numero esistente (fisso o mobile): lo verifichi… Viene visualizzato dai Suoi contatti… | Ajouter : «In Italia, le chiamate provenienti dall’estero che mostrano un numero italiano possono essere bloccate dagli operatori (misure anti-spoofing AGCOM): faccia una prova prima di una campagna.» (à valider techniquement avec Autocalls) | fait / marché | Majeur |
| it/guides.ts:1005 | Chi può far chiamare dal Suo agente? | Chi può chiamare con il Suo agente? | naturel (tournure lourde) | Mineur |
| it/guides.ts:1016 | …chi è iscritto non può essere chiamato senza un Suo consenso specifico. | …chi è iscritto non può essere chiamato per finalità commerciali, salvo consenso specifico rilasciato a Lei dopo l’iscrizione (o rapporto contrattuale in essere, nei limiti di legge). Consulti il Registro prima di ogni campagna. | juridique (précision ; validation par un juriste italien nécessaire) | Mineur |
| it/guides.ts:1017 | Serve una base giuridica valida ai sensi del GDPR… | …ai sensi del GDPR e dell’art. 130 del Codice privacy… | juridique | Mineur |
| it/guides.ts:1037 | nei giorni feriali | dal lunedì al venerdì (en italien, « feriali » inclut le samedi ; le FR dit « en semaine ») | contresens léger | Mineur |
| it/guides.ts:1039 | annoti la fonte, la data del rapporto… è questa scheda a tutelarLa. | annoti la fonte, la data del consenso o del rapporto… è questa documentazione a tutelarLa. (« scheda » est un calque de « fiche ») | calque | Mineur |
| it/guides.ts:1063 | Una parola d’urgenza del Suo mestiere (perdita, dolore, guasto) | Una parola che segnala un’urgenza nel Suo settore (perdita d’acqua, dolore, guasto) | calque | Mineur |
| it/guides.ts:1106 | Orari, prezzi e chiusure sono aggiornati… | Orari, prezzi, ferie e chiusure (es. Ferragosto, festività) sono aggiornati… | marché | Mineur |
| it/guides.ts:337 | riagganciare, trasferire o passare la mano a un altro agente | …o passare la chiamata a un altro agente (« passare la mano » est un calque de « passer la main ») | calque | Mineur |
| it/guides.ts:457 | Strumenti dell’agente: trasferimento, fine, tastiera | Strumenti dell’agente: trasferimento, fine chiamata, tastiera | naturel | Mineur |
| it/guides.ts:192 | in caso di urgenza, di rabbia o di domanda fuori tema | in caso di urgenza, di cliente arrabbiato o di domanda fuori tema | calque | Mineur |
| it/guides.ts:216 | in linguaggio comune | in linguaggio naturale | naturel | Mineur |
| it/guides.ts:219 | «Aggiungi la nostra politica di reso: 30 giorni senza giustificazione.» | «Aggiungi la nostra politica di reso: 30 giorni, senza bisogno di motivazione.» | calque | Mineur |
| it/guides.ts:287 | (uomo, donna, accento) | (maschili, femminili, per accento) | naturel | Mineur |
| it/guides.ts:687 | nell’anteprima dal vivo | nell’anteprima in tempo reale | naturel | Mineur |
| it/guides.ts:731 | di servizio, di marketing o di autenticazione | di utilità («Utility»), di marketing o di autenticazione (catégories Meta) | terminologie | Mineur |
| it/guides.ts:796 | il numero di numeri secondari | quanti numeri secondari usare | naturel | Mineur |
| it/guides.ts:31 / 120 | (fumetto in basso a destra) / (icona a fumetto) | (icona della chat in basso a destra) / (icona della chat) — « fumetto » se comprend, mais c’est inhabituel dans une interface | naturel | Mineur |
| it/guides.ts:40 | Che cos’è un agente vocale IA? | Che cos’è un agente vocale AI? — le reste du site IT écrit « AI » (tagline « Assistente telefonico AI », pages, secteurs) ; à harmoniser dans un sens ou dans l’autre (11 occurrences de « IA » dans guides.ts) | incohérence / SEO | Mineur |
| it/guides.ts:236 vs it/help.ts:116 | {customer_name} vs {{customer_name}} | Uniformiser sur la syntaxe réelle de l’interface (probablement {{customer_name}}, comme guides.ts:506) — même écart dans le FR | incohérence | Mineur |
| it/guides.ts:129 vs 137 | «Speak with your assistant» / «Speak to your assistant» | Vérifier le libellé exact dans Autocalls (écart hérité du FR) | incohérence UI | Mineur |
| it/help.ts:38 | Clicchi su Create assistant, poi su Test assistant per parlargli dal Suo browser. | …poi su Test assistant per provarlo in chat, o su Speak with your assistant per parlargli dal browser. (guides.ts:117-130 : « Test assistant » = chat écrite sans voix ; erreur héritée du FR) | fait / incohérence | Mineur |
| it/help.ts:37 | Greeting (saluto): la prima frase pronunciata. | Greeting (messaggio di benvenuto): la prima frase pronunciata. (terme des guides) | incohérence | Mineur |
| it/help.ts:20 | Flow builder senza codice collegato a oltre 300 strumenti | Editor di automazioni senza codice collegato a oltre 300 strumenti — « Flow Builder » désigne dans les guides (guides.ts:312) l’éditeur de scénario de conversation, une autre fonction ; même confusion dans it/offers.ts:29 | incohérence | Mineur |
| it/help.ts:83 | importi i Suoi contatti (file CSV) | importi i Suoi contatti (file CSV o Excel) e li verifichi nel Registro pubblico delle opposizioni; chiami solo… | incohérence / marché | Mineur |

## 3. Manques / ajouts recommandés

1. **Achat d’un numéro italien (acheter-un-numero, guides.ts:534-537).**
   - Préciser les justificatifs exigés en Italie : documento d’identità, codice fiscale ou Partita IVA (visura camerale pour une société), et adresse dans le distretto telefonico du préfixe pour un numéro géographique 0x.
   - Les numéros mobiles 3xx ne sont généralement pas disponibles en VoIP, ou le sont sous conditions. Les numeri verdi 800 demandent un dossier spécifique.
   - Les délais peuvent dépasser « 1 à 3 jours lavorativi ». À vérifier auprès d’Autocalls et de Twilio (regulatory bundle Italie), puis à dire honnêtement.
   - Ajouter le format : fixe +39 0x… avec le 0 conservé (contrairement à la France), mobile +39 3xx….
2. **Déviation d’appel en Italie (renvoi-d-appel).**
   - Les codes **21*, **61*, **62*, **67* et ##002# sont corrects pour TIM, Vodafone, WindTre et Iliad. Le délai de **61* se règle entre 5 et 30 secondes, par pas de 5.
   - À ajouter : (a) chez TIM, Vodafone et WindTre, les déviations conditionnelles pointent souvent déjà vers la segreteria de l’opérateur, et la nouvelle déviation la remplace ; (b) les menus iPhone (« Inoltro chiamate ») et Android (« Deviazione chiamate ») et les apps (MyTIM, My Vodafone, WindTre, Iliad, MyFastweb) ; (c) lignes fixes et fibre (TIM, Fastweb, Vodafone, WindTre) : réglage depuis l’area clienti ou l’app, ou par les codes *21*numero# et #21# sur de nombreuses lignes TIM, service parfois à activer ou payant (à vérifier par opérateur) ; (d) centralini : citer les plus répandus en Italie (3CX, Wildix, Panasonic, Cisco/Centrex des opérateurs).
3. **Campagnes sortantes (qui-peut-on-appeler / campagnes-d-appels).**
   - Ajouter le Codice di condotta per il telemarketing approuvé par le Garante. Il fixe notamment des règles sur les fasce orarie et la fréquence des appels. Indiquer les horaires exacts après vérification.
   - Ajouter l’obligation d’un numéro identifiable : interdiction des appels anonymes.
   - Ajouter les prefissi dédiés aux appels commerciaux introduits par l’AGCOM (numérotations 0843/0844, délibération 156/23/CONS, à vérifier). C’est un point bloquant potentiel pour des campagnes lancées avec un numéro acheté chez Autocalls.
   - Ajouter les mesures anti-spoofing AGCOM : blocage des appels venant de l’étranger qui présentent un CLI italien, d’abord pour les fixes (fin 2024) puis pour les mobiles (2025), d’après la délibération 106/24/CONS (à vérifier). Elles concernent directement l’affichage du « numero esistente » et les appels acheminés par une infrastructure non italienne.
   - Mentionner que le Registro doit être consulté avant chaque campagne et périodiquement (DPR 26/2022), et que la consultation est payante.
   - Faire valider l’ensemble par un juriste italien. Le texte se présente déjà comme « informativa », ce qui est bien.
4. **Facturation (minutes-et-facturation, help « Gestire la prova, la fatturazione e le fatture »).**
   - Ajouter une ligne pour les clients italiens : les factures sont émises par une société américaine en USD, hors SDI. Le client professionnel les reçoit en PDF et procède à l’integrazione/autofattura en reverse charge (TD17), avec l’IVA à 22 % à sa charge. C’est une attente très forte en Italie : sans cette mention, beaucoup de tickets de support sont prévisibles. Faire valider par un commercialista.
5. **AI Act art. 50 (applicable depuis le 2 août 2026).** Le lot l’aborde bien (guides.ts:1034 et 1058). Il faut aligner l’exemple d’accueil (guides.ts:256) et l’exemple de rôle du system prompt (guides.ts:175), par exemple : « Ti presenti sempre come assistente virtuale dello studio ».
6. **Enregistrement des appels.** Le lot parle de « l’avviso di registrazione » mais ne dit pas comment l’ajouter. Proposer une phrase-type italienne pour le messaggio di benvenuto : « La chiamata potrebbe essere registrata per finalità di servizio ».
7. **Hors lot, signalé en passant.**
   - FR `fr/guides.ts` (point-mensuel) cite le menu « Calls ». La version IT, « Calls history », est la bonne : corriger le FR.
   - `it/offers.ts:29` : la même confusion « flow builder » qu’en `help.ts:20`.

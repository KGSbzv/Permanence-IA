# Relecture IT — lot 02 : composants, commerce/tarifs, chaînes en dur, base de connaissances vocale

Périmètre relu : `src/i18n/content/it/ui/components.ts` (613 l.), `src/i18n/content/it/ui/commerce.ts` (364 l.), `src/i18n/markets.ts` (bloc it, basePlans, SHARED), `src/components/*.tsx` (chaînes en dur), `src/data/personas.ts`, `src/lib/server.ts`, `src/pages/api/**`, `src/data/kb/it.txt` (70 l., intégral) et `src/data/kb/it-situations.txt` (l. 1-200, plus un coup d'œil à D12 l. 253-254).

## 1. Synthèse

- **Qualité linguistique globale bonne à très bonne.** L'italien est correct, avec peu de fautes. La terminologie locale est juste dans l'ensemble : centralino, segreteria, preventivo, CCNL/TFR, studio dentistico, tagliando, Registro pubblico delle opposizioni, Garante. Le registre est le **Lei avec majuscule de politesse (Suo/La/Le)**. C'est cohérent et défendable en B2B auprès des professions libérales et des PME, mais c'est très formel pour un SaaS en 2026. Il faut décider d'en rester là ou de passer au *tu*, puis appliquer le choix partout (voir Manques).
- **Le registre déraille par endroits.** On trouve du *tu* (« Scegli… », « Vedi tutti i moduli », « Riduci il confronto »), du *voi* (« Fate squillare il mio telefono », « i vostri strumenti ») et des infinitifs isolés (« Fare un'altra prova »).
- **Erreurs factuelles héritées du FR :**
  - « tredici moduli » alors qu'il y en a 14.
  - L'e-commerce est cité comme secteur « absent de la liste » alors qu'il existe.
  - « oltre 30 lingue » d'un côté, « oltre 80 lingue » de l'autre.
  - Le formulaire promet une **email de confirmation qui n'est jamais envoyée** (`/api/callback` ne notifie que l'équipe).
- **Problème systémique de marché : prix en USD et mention « IVA esclusa ».** Pour une LLC du Wyoming qui facture une entreprise italienne, l'IVA n'est pas ajoutée : le client l'auto-liquide (inversione contabile, integrazione/autofattura TD17 via SDI). « IVA esclusa » laisse croire qu'on ajoutera 22 %. Ni le site ni la base de connaissances ne parlent de fattura elettronica / SDI, alors que c'est la première question d'un commercialista italien. Le symbole « $ » seul (`currencyDisplay: 'narrowSymbol'`) est également ambigu.
- **Fuites de français vers l'utilisateur italien** (côté technique, gravité réelle) :
  - L'email OTP (`api/agent/account.ts`) est envoyé en **français + anglais** et mentionne « Lucie ».
  - Les notes envoyées à l'agent vocal italien sortant sont en français : « Démo live — rôle : Réceptionniste — langue : … », « Créneau souhaité : Demain matin », et le secteur arrive sous forme de **slug français** (« dentaire-cliniques »). Or la base de connaissances demande à l'agent de citer `request_note` dans sa phrase d'ouverture.
- **Personas :** l'équipe d'agents affichée sur le site italien montre Jade, Daan, Katie, Jack, Manuela et Tomasz. La note « Jade, Daan, Katie e i loro colleghi » n'a aucun prénom italien en tête.
- **Base de connaissances vocale : très bonne.**
  - L'annonce IA et l'annonce d'enregistrement figurent dès la première phrase (conforme à l'esprit de l'AI Act art. 50).
  - Le RPO est bien traité.
  - L'oral est naturel (« Mi scusi per il disturbo », « Quale momento Le andrebbe meglio? »).
  - Restent quelques calques du français (« gesti commerciali », « fastidioso », « messa in linea », « cambiate di generazione »), des exemples chiffrés en dollars pour le chiffre d'affaires du client, et l'absence de toute réponse sur la facturation électronique.

## 2. Tableau des corrections

| fichier:ligne | texte actuel | correction proposée | type | sévérité |
|---|---|---|---|---|
| it/ui/commerce.ts:315 | `Il Suo centralino virtuale AI in tredici moduli` | `…in quattordici moduli` (14 modules dans it/modules.ts ; même erreur dans fr:306 « Treize ») | fait | Majeur |
| it/ui/commerce.ts:262 | `Autoscuole, palestre, e-commerce, selezione del personale, turismo` | Retirer « e-commerce », qui est un secteur à part entière : `Autoscuole, palestre, selezione del personale, turismo, studi tecnici…` (même erreur FR:253) | fait/incohérence | Majeur |
| it/ui/components.ts:112 | `Se ha indicato un'email, riceverà una conferma.` | L'API n'envoie aucune confirmation au visiteur (`src/pages/api/callback.ts` n'appelle `sendMail` que vers NOTIFY_TO). Il faut soit implémenter l'email, soit écrire : `La richiameremo nella fascia oraria scelta.` | fait | Majeur |
| it/ui/components.ts:226 vs 316/344 | `Centinaia di voci naturali, in oltre 30 lingue.` / `Oltre 80 lingue` | Harmoniser avec un seul chiffre vérifié (ex. `in oltre 80 lingue`), ou distinguer clairement « 30 lingue con voci native, 80 riconosciute » | incohérence/fait | Majeur |
| it/ui/components.ts:63, 196, 206-207, 229, 237, 242, 302 ; commerce.ts (≈15 occurrences) ; markets.ts SHARED | `IVA esclusa` / `Un'unica fattura, in dollari IVA esclusa` | Pour une LLC US qui facture une PMI italienne, aucune IVA n'est facturée (reverse charge, art. 17 c. 2 DPR 633/72 ; le client intègre la facture et la transmet au SDI, TD17). Proposition : `Prezzi in dollari USA, IVA non applicata (inversione contabile a carico del cliente)`, ou au minimum `IVA esclusa, se dovuta`. À valider par un commercialista ou un avocat fiscaliste italien | marché/juridique | Majeur |
| it/ui/components.ts:116 | `Scegli…` | `Selezioni…` | incohérence registre | Mineur |
| it/ui/components.ts:212 | `Vedi tutti i moduli (${n})` | `Veda tutti i moduli (${n})` ou neutre `Mostra tutti i moduli (${n})` | incohérence registre | Mineur |
| it/ui/components.ts:213 | `Riduci il confronto` | `Mostra meno` | registre/calque | Mineur |
| it/ui/components.ts:389 | `Fate squillare il mio telefono` | `Mi chiami adesso` ou `Ricevi la chiamata` (si passage au tu) ; en Lei : `Riceva la chiamata sul telefono` | incohérence registre (voi) | Majeur (CTA principal de la démo) |
| it/ui/components.ts:393 | `Fare un'altra prova` | `Faccia un'altra prova` / `Riprova` | registre | Mineur |
| it/ui/commerce.ts:343 | `ogni chiamata può alimentare i vostri strumenti` | `…i Suoi strumenti` | incohérence registre (voi) | Mineur |
| it/ui/components.ts:394 ; 417 | `agente vocale IA` ; `agenti IA virtuali` | `agente vocale AI` ; `agenti AI virtuali` (le reste du site dit « AI ») | incohérence terminologique | Mineur |
| it/ui/components.ts:417 + src/data/personas.ts:57 (TEAM_PERSONAS) | `Jade, Daan, Katie e i loro colleghi…` | Sur le marché IT, mettre Manuela et Marco en tête (TEAM_PERSONAS par locale), puis `Manuela, Marco e i loro colleghi sono agenti AI virtuali…`. Sinon, assumer l'équipe internationale : `Il nostro team internazionale di agenti AI…` | marché | Majeur |
| it/ui/components.ts:183, 422, 423 ; commerce.ts:276 | `Veda la pagina ${sectorLower}` / `Agente ${sectorLower}` / `Veda la soluzione ${sectorLower}` / `Agente ${name.toLowerCase()}` | Les noms de secteur sont des syntagmes au pluriel (« studi dentistici e cliniche », « servizi a domicilio »), ce qui donne « Agente studi dentistici e cliniche » et « Veda la pagina e-commerce ». Proposer `Agente per ${sector}` / `Veda la pagina «${name}»` / `Scopra la soluzione per ${sector}` | calque/grammaire | Majeur (systémique, visible sur 14 pages) |
| it/ui/commerce.ts:296 | `Per il settore ${sectorName.toLowerCase()}, consigliamo` | `Per il settore «${sectorName}» consigliamo` (le minuscule donne « per il settore e-commerce » mais aussi « per il settore servizi a domicilio », ce qui est bancal) | grammaire | Mineur |
| it/ui/components.ts:302 | `il ${conversion} % delle chiamate perse` | `il ${conversion}% delle…` (en italien, pas d'espace avant %, cf. « 62% » l. 519/522) | typo | Mineur |
| it/ui/components.ts:236 vs 49 ; commerce.ts:233 | `Ricariche di credito` / `Ricariche di minuti` | Choisir un seul terme. `Ricariche di credito` est plus exact (le crédit paie les minutes) | incohérence | Mineur |
| it/ui/components.ts:431 ; 252, 262 | `Offerta consigliata` ; `Offerta su misura` | `Piano consigliato` ; `Piano su misura` (le plan s'appelle « Su misura », et « piano » est utilisé partout ailleurs) | incohérence terminologique | Mineur |
| it/ui/commerce.ts:152, 174 | `Più il piano è grande, meno costa il minuto.` | `Più grande è il piano, meno costa ogni minuto.` | calque (plus… moins…) | Mineur |
| it/ui/commerce.ts:147, 354 | `allo stesso modo di Zapier o Make` | `come Zapier o Make` | calque | Mineur |
| it/ui/commerce.ts:179 | `Nient'altro è nascosto dietro un pulsante.` | `Nessuna funzione nascosta.` | calque | Mineur |
| it/ui/commerce.ts:324 ; 108, 139, 343, 361 (et components.ts:139) | `Incluso dal piano ${offerName}` / `(dal piano Assistant)` | `Incluso a partire dal piano ${offerName}` / `(dal piano Assistant in su)` | calque (« dès l'offre ») | Mineur |
| it/ui/commerce.ts:360 | `riceva ogni fine chiamata e i relativi dati estratti` | `riceva i dati di ogni chiamata conclusa nei Suoi sistemi` | calque | Mineur |
| it/ui/commerce.ts:12 | description broker = 175 caractères | `Assistente telefonico AI per broker assicurativi e del credito: preventivi richiamati subito, documenti sollecitati, appuntamenti fissati. Provi gratis ${days} giorni.` (≈155) | SEO | Mineur |
| it/ui/commerce.ts:13 | title `Assistente AI per amministratori di immobili` | `Centralino AI per amministratori di condominio` (requête réellement tapée en Italie) ; dans la description, `segnalazioni di guasti dei condòmini e inquilini` | SEO/marché | Mineur |
| it/ui/commerce.ts:45 | `centro estetico, spa e nail bar` | `centro estetico, spa e centro unghie` | anglicisme | Mineur |
| it/ui/components.ts:331 | `Preparazione normativa` | `Conformità normativa` / `Strumenti per la conformità` | calque (« préparation réglementaire ») | Mineur |
| it/ui/components.ts:313 | `Da {from} IVA esclusa al mese (350 min)` | « 350 » est codé en dur alors que les minutes viennent du marché : passer le paramètre (même défaut en FR) | fait (maintenance) | Mineur |
| it/ui/components.ts:178 | `Sente la voce e il modo in cui…` | `Ascolterà la voce e il modo in cui…` | style | Mineur |
| it/ui/components.ts:468 | `Avvisare quando si libera uno slot.` | `Avvisare quando si libera un posto.` | anglicisme | Mineur |
| it/ui/components.ts:545 | `Può indicarmi il Suo budget indicativo?` | `Qual è il Suo budget orientativo?` (répétition indicare/indicativo) | style | Mineur |
| it/ui/components.ts:131 | `Accetto di essere richiamato al numero indicato…` | `Accetto di essere ricontattato/a…` ou neutre `Acconsento a essere richiamato…`. Ajouter un lien vers l'informativa privacy (art. 13 GDPR) et mentionner le « titolare » : `…Informativa privacy: [link]` | juridique/inclusivité | Mineur |
| it/ui/components.ts:392 | `(dal lunedì al sabato, 9:00 – 19:00)` | `(dal lunedì al sabato, 9:00-19:00, ora italiana)`. Préciser le fuseau, et vérifier que la campagne IT appelle bien sur ces horaires (fêtes : Ferragosto, 25 aprile, 2 giugno…) | marché/typo | Mineur |
| it/ui/components.ts:402 | `…'Olandese', 'Belgio', 'Svizzera', 'Québec', 'Arabo'…` | Liste de langues mêlée à des pays (reprise du FR). Écrire `Francese (Belgio)`, `Francese (Svizzera)`, `Francese (Québec)` | incohérence | Mineur |
| markets.ts:113 + src/lib/server.ts:66 + api/agent/account.ts:146-149 | Marque IT `PermanenceIA` ; expéditeur `Permanence IA` ; email OTP `Permanence IA` / `PermanenceAI` | Unifier : expéditeur et emails envoyés à un client IT avec `PermanenceIA` | incohérence marque | Mineur |
| src/pages/api/agent/account.ts:144-150 | Email OTP : `Votre code de vérification : … · Your verification code` / `Bonjour, Votre code pour que Lucie consulte votre compte…` | Un client italien reçoit un email FR+EN qui cite « Lucie », que l'agent italien ne porte peut-être pas comme nom. Localiser selon la langue de la demande, par ex. : objet `Il Suo codice di verifica: ${code}` ; corps `Buongiorno,\n\nEcco il codice per consentire alla nostra assistente di consultare il Suo account PermanenceIA: ${code}\nÈ valido 10 minuti. Se non ha richiesto nulla, ignori questa email.` | marché/fait | Majeur |
| src/components/LiveDemo.tsx:14, 333-334 | `note: Démo live — rôle : Réceptionniste — langue : Italiano — voix : Manuela — secteur : …` | Ce texte arrive dans `request_note` de l'agent sortant italien, que la KB (it-situations l. 120) lui demande de citer (« riguardo a [request_note] »). Il faut soit traduire la note selon `lang` (`Demo dal vivo — ruolo: Receptionist — …`), soit envoyer des champs structurés. Ajouter aussi dans la KB : « non leggere mai ad alta voce le note interne in francese » | marché (fuite FR à l'oral) | Majeur |
| src/components/ui.tsx:156, 175-185 + src/lib/server.ts:163-165 + api/callback.ts:91 | `sector` = slug FR (`dentaire-cliniques`) ; slot = `Demain matin` ; note `Créneau souhaité : Demain matin (Europe/Rome)` | Envoyer à la campagne IT le nom italien du secteur (`s.name`) et un créneau en italien (`Fascia preferita: domani mattina`), ou bien interdire explicitement dans la KB la lecture de ces valeurs | marché (fuite FR à l'oral) | Majeur |
| src/data/kb/it.txt:12 | `la dicitura "Créneau souhaité : …" (scritta in francese)` | Compléter : `…(scritta in francese: non leggerla mai ad alta voce, tradurla: "Aveva indicato di preferire domani mattina"). Il campo sector può arrivare come codice in francese (es. "dentaire-cliniques"): usare il nome italiano del settore.` | marché | Majeur |
| src/data/kb/it.txt:4 | `presa di appuntamenti` | `prenotazione degli appuntamenti` | calque | Mineur |
| src/data/kb/it.txt:4 | `in white label` | Supprimer, ou l'expliquer. Annoncer « in white label » à un prospect est inutile et brouille la marque | style/marché | Mineur |
| src/data/kb/it.txt:34 | `gravità (bloccante, fastidioso, minore)` | `gravità (bloccante, importante, minore)` | calque (« gênant ») | Mineur |
| src/data/kb/it.txt:36 | `né gesti commerciali` | `né omaggi o condizioni di favore` | calque (« geste commercial ») | Mineur |
| src/data/kb/it.txt:7, 54 ; it-situations.txt:11 | `dollari USA, IVA esclusa` | Voir la ligne IVA : `in dollari USA; per le aziende italiane l'IVA non viene addebitata in fattura ma assolta dal cliente con il reverse charge (da confermare con il proprio commercialista)` | marché/juridique | Majeur |
| src/data/kb/it.txt:6 ; it-situations.txt:6, 120, 133 | `Questa chiamata viene registrata.` | `Questa chiamata viene registrata per finalità di qualità e di follow-up; l'informativa privacy è su permanenceia.com.` (information minimale art. 13 GDPR, à valider par un juriste) | juridique | Mineur |
| it-situations.txt:30 | `Con 10 chiamate perse a settimana e 80 dollari per cliente, sono circa 3.400 dollari al mese` | `…e 80 euro per cliente, sono circa 3.400 euro al mese`. Le chiffre d'affaires du prospect italien est en euros ; seuls nos prix sont en dollars | marché | Mineur |
| it-situations.txt:74 | `Voci, comprensione e velocità sono cambiate di generazione.` | `Voci, comprensione e velocità hanno fatto un salto generazionale.` | calque | Mineur |
| it-situations.txt:95 | `(un colore non viene messo in uno spazio da taglio)` | `(un colore non viene fissato nello spazio di un semplice taglio)` | calque/obscur | Mineur |
| it-situations.txt:97, 100, 101 | `Ristoranti e ospitalità` / `Broker assicurativi e mediatori creditizi` / `Gestione affitti e amministratori di condominio` | Reprendre les noms du site : `Ristoranti e hotel` / `Broker assicurativi e del credito` / `Gestione immobiliare e condomini` | incohérence | Mineur |
| it-situations.txt:137 | `Ho preso nota, non sarà più chiamato.` | `Ho preso nota, non La richiameremo più. Ci scusi per il disturbo.` (neutre en genre et plus naturel) | style/oral | Mineur |
| it-situations.txt:120 | `Ci aveva chiesto di essere richiamato` | `Ci aveva chiesto di essere ricontattato/a` → à l'oral, préférer la tournure neutre `Ci aveva chiesto una richiamata riguardo a…` | oral/genre | Mineur |
| it-situations.txt:178 (C4) | `Le 12 verifiche prima della messa in linea` | `…prima dell'attivazione` / `prima di andare live` | calque (« mise en ligne ») | Mineur |
| it-situations.txt:176 | `Impostazioni professionali` | `Impostazioni avanzate` | calque | Mineur |
| it-situations.txt:194 | `Quattro numeri:` | `Quattro indicatori:` | calque | Mineur |
| it-situations.txt:19 ; it.txt:8 | Ligne israélienne 02-376-7085 donnée en exemple d'appel entrant | Inutile pour l'agent IT : à supprimer ou à reformuler (« sul mercato israeliano »). Sur le site IT (`callbackModal.intro`), « Non pubblichiamo alcun numero » est cohérent, puisque `it` n'a pas de `phone` | marché | Mineur |
| it-situations.txt:254 (D12, hors des 200 l. mais lié) | `le imposte vengono calcolate in base al paese e allo status` | Contradiction possible avec « IVA esclusa ». Préciser le traitement réel (Stripe Tax ? reverse charge ?), puis ajouter la réponse « fattura elettronica / SDI » (voir Manques) | fait/marché | Majeur |

## 3. Manques / ajouts recommandés

1. **Fattura elettronica / SDI (fort attendu en Italie).**
   - Ajouter une FAQ sur le site et une entrée dans la KB, par exemple : *« Siamo una società statunitense: non emettiamo fattura elettronica tramite SDI. Riceve una fattura commerciale (invoice) in "Billing info"; il Suo commercialista la integra con il reverse charge e trasmette l'autofattura (TD17) allo SDI. Inserisca la Sua partita IVA nei dati di fatturazione. »*
   - À valider par un commercialista.
   - Sans cette réponse, l'agent répondra « non lo so » à la question la plus fréquente des prospects italiens.
2. **Mention des prix.** Remplacer « IVA esclusa » par une formule exacte pour un fournisseur extra-UE. Afficher « USD » ou « US$ » plutôt que « $ » seul (`src/i18n/index.tsx:51`, `currencyDisplay: 'narrowSymbol'` → `'code'` ou `'symbol'` pour it-IT).
3. **Registre.** Trancher entre :
   - (a) le Lei en minuscules (`suo`, `la`), plus moderne et toujours poli, aujourd'hui la norme chez les SaaS B2B italiens qui vouvoient ;
   - (b) le *tu*, majoritaire dans le marketing SaaS italien en 2026.

   Le choix actuel (Lei majuscule) n'est pas fautif mais sonne administratif. Quel que soit le choix, corriger les 7 écarts relevés (tu/voi/infinitifs).
4. **Localiser les données envoyées à l'agent vocal italien** : note de la démo, créneau, secteur. Localiser aussi l'**email OTP** (sujet et corps en italien, marque PermanenceIA, sans « Lucie » si l'agent IT porte un autre nom). Le plus simple est de passer `locale` à `/api/agent/account` et de prévoir un gabarit d'email par langue.
5. **Implémenter l'email de confirmation de rappel** promis par `callbackForm.sentText`, ou retirer cette promesse (toutes les langues).
6. **Personas.** Pour le marché IT, faire figurer Manuela et Marco en tête de l'équipe d'agents (`TEAM_PERSONAS` par locale) et adapter `virtualNote`.
7. **Base de connaissances, oral téléphonique :**
   - Ajouter la variante horaire « Buonasera » (à partir de ~14 h en Italie).
   - Ajouter « Pronto? » pour les rappels où l'interlocuteur décroche sans parler.
   - Ajouter une formule d'attente (« Resti in linea un attimo, verifico subito »).
   - Interdire explicitement de lire à voix haute les champs techniques (slugs, notes en français, codes ISO).
8. **AI Act art. 50.** Le site n'en parle qu'indirectement : `security`, `consent` du formulaire, `virtualNote`. Ajouter sur la page Sicurezza une ligne du type « Trasparenza AI (Regolamento UE 2024/1689, art. 50): l'agente dichiara di essere un sistema di intelligenza artificiale all'inizio di ogni chiamata ». La KB est déjà conforme dans l'esprit.
9. **Codice di condotta telemarketing / RPO.** La KB est correcte. On peut préciser que les campagnes vers des numéros de professionnels (B2B) ont aussi des règles (consentement / intérêt légitime) ; à valider par un avocat italien. La phrase sur la révocation des consentements par l'inscription au RPO est à faire vérifier par un juriste local.
10. **SEO.**
    - Les URLs italiennes gardent des slugs français (`/it/secteurs/dentaire-cliniques`, `/fonctionnalites/prise-de-rendez-vous`, `/tarifs`, `/offres`). C'est hors de ce lot, mais c'est un frein SEO réel pour le marché IT.
    - Description du secteur broker trop longue (175 caractères).
11. **Localisation pratique Italie** (à ajouter dans le contenu sectoriel ou la KB) : fermetures d'août et Ferragosto, pausa pranzo (déjà citée dans humanVsAi), jours fériés nationaux pour les horaires de la campagne démo « lunedì-sabato 9-19 ».

*Note : je ne suis pas avocat. Les points marqués « juridique » (IVA/reverse charge, information GDPR, RPO, AI Act) doivent être validés par un avocat ou un commercialista italien.*

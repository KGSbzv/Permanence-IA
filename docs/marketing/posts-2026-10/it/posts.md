# Posts octobre 2026 : italien (it), version relue

3 publications (thèmes A, B, C du brief), chacune en deux textes (Page Facebook, page LinkedIn) et deux visuels. Vouvoiement « Lei » comme sur le site (`src/i18n/content/it/`). Relecture native et contrôle des faits faits le 9 octobre 2026 (voir « Corrections de la relecture » en bas). **Rien n’est publié** : ces fichiers attendent votre validation.

## Calendrier proposé

| Post | Date | Facebook | LinkedIn | Fuseau | Page cible |
|---|---|---|---|---|---|
| it-A | mardi 13 octobre 2026 | **08:30** | 12:45 | heure de Rome, CEST UTC+2, identique à Paris | /it/tarifs |
| it-B | mardi 20 octobre 2026 | **08:30** | 12:45 | heure de Rome, CEST UTC+2, identique à Paris | /it/demo |
| it-C | mardi 27 octobre 2026 | **08:30** | 12:45 | heure de Rome, CET UTC+1 après le changement d’heure du dimanche 25 octobre, identique à Paris | /it/essai-gratuit |

Facebook passe de 09:00 (heure du brief) à **08:30**. Le français publie les mêmes mardis sur la même Page à 12:15 : avec 09:00, l’écart n’était que de 3 h 15, sous les 3 h 30 du brief. À 08:30, il est de 3 h 45 (et de 4 h si le français passe à 12:30 comme le propose `fr/posts.md`). Sur LinkedIn, l’écart avec le français (08:30) reste de 4 h 15.

## Fichiers

| Post | Carré 1080×1080 (Facebook et LinkedIn) | 1200×627 (variante LinkedIn) |
|---|---|---|
| it-A | `it-A-carre.png` | `it-A-linkedin.png` |
| it-B | `it-B-carre.png` | `it-B-linkedin.png` |
| it-C | `it-C-carre.png` | `it-C-linkedin.png` |

Réglages des visuels : `visuels.json` (gabarit copié : `post.html`, `render.mjs`). Pour refaire les images :

```
node docs/marketing/posts-2026-10/it/render.mjs docs/marketing/posts-2026-10/it/visuels.json <dossier-temporaire>
# puis renommer <id>_1080x1080.png en <id>-carre.png et <id>_1200x627.png en <id>-linkedin.png
```

---

## it-A : « Appel manqué = client perdu » : l’agent IA répond 24/7 (cible : restauration)

- **Date :** mardi 13 octobre 2026, Facebook 08:30, LinkedIn 12:45 ; heure de Rome, CEST UTC+2, identique à Paris.
- **Visuels :** `it-A-carre.png` (1080×1080), `it-A-linkedin.png` (1200×627).
- **Lien Facebook :** https://www.permanenceia.com/it/tarifs?utm_source=facebook&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=A
- **Lien LinkedIn :** https://www.permanenceia.com/it/tarifs?utm_source=linkedin&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=A

**Texte sur le visuel**

- Pastille : « Da 99 USD IVA esclusa / mese » (sans icône cadeau)
- Titre : « Ogni chiamata persa è *un cliente perso* » (7 mots)
- Sous-titre : « Il Suo agente AI risponde 24/7 e Le invia il riepilogo. »
- Bouton : « Veda i prezzi » · adresse : permanenceia.com/it/tarifs
- Cartes : « Chiamata in arrivo · 20:47 / Lei è in sala, nel pieno del servizio » → « AGENTE VOCALE AI : «Buonasera, sono l’assistente AI.» » → « Chiamata terminata · riepilogo inviato / Prenotazione annotata: sabato, 4 coperti, 20:30 »
- Photo : public/photos/restaurants-hotellerie.jpg (serveur en salle)

**Facebook (italien, 74 mots)**

```text
📞 Il telefono squilla proprio mentre è in sala con i piatti in mano?
Con PermanenceIA risponde il Suo agente vocale AI, 24 ore su 24. Si presenta come assistente AI, risponde alle domande su orari e menu, raccoglie i dettagli della prenotazione e Le invia il riepilogo di ogni chiamata.
Lei pensa ai clienti in sala, al telefono ci pensa l’AI.
Piani da 99 USD IVA esclusa al mese, senza vincoli.
👉 Veda i prezzi: https://www.permanenceia.com/it/tarifs?utm_source=facebook&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=A
#ristorazione #assistentetelefonicoAI
```

**LinkedIn (italien, 181 mots)**

```text
Venerdì, ore 20:47. La sala è piena, il telefono squilla e nessuno può rispondere.
Quella chiamata poteva essere un tavolo per quattro. Ora quei quattro coperti rischiano di finire al ristorante di fronte.

Nella ristorazione il telefono squilla sempre nel momento sbagliato: in pieno servizio, mentre si è in cucina, a locale chiuso. PermanenceIA mette al Suo fianco un agente vocale AI che risponde 24 ore su 24, 7 giorni su 7. Si presenta come assistente AI fin dall’inizio della chiamata, risponde alle domande frequenti (orari, parcheggio, menu), raccoglie data, ora, coperti e richieste particolari, poi Le invia il riepilogo di ogni chiamata. Quando serve il Suo team, trasferisce la chiamata secondo le regole che ha stabilito Lei.

Lei mantiene il Suo numero di sempre: basta una deviazione di chiamata. E con i clienti stranieri, attivando le lingue aggiuntive, l’agente riconosce la lingua di chi chiama e risponde nella stessa lingua: ne parla oltre 80. Il piano Receptionist costa 99 USD IVA esclusa al mese, con 350 minuti al mese inclusi, senza costi di attivazione né vincoli.

Veda tutti i piani: https://www.permanenceia.com/it/tarifs?utm_source=linkedin&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=A

#ristorazione #hospitality #assistentetelefonicoAI #intelligenzaartificiale #PMI
```

<details><summary>Traduction française (Facebook)</summary>

```text
📞 Le téléphone sonne juste au moment où vous êtes en salle, les assiettes à la main ?
Avec PermanenceIA, c’est votre agent vocal IA qui répond, 24 h/24. Il se présente comme assistant IA, répond aux questions sur les horaires et le menu, recueille les détails de la réservation et vous envoie le résumé de chaque appel.
Vous vous occupez des clients en salle, l’IA s’occupe du téléphone.
Forfaits dès 99 USD HT par mois, sans engagement.
👉 Voir les tarifs : [lien Facebook]
#ristorazione (restauration) #assistentetelefonicoAI (assistant téléphonique IA)
```

</details>

<details><summary>Traduction française (LinkedIn)</summary>

```text
Vendredi, 20 h 47. La salle est pleine, le téléphone sonne et personne ne peut répondre.
Cet appel, c’était peut-être une table pour quatre. Ces quatre couverts risquent maintenant de finir au restaurant d’en face.

En restauration, le téléphone sonne toujours au mauvais moment : en plein service, quand on est en cuisine, une fois l’établissement fermé. PermanenceIA met à vos côtés un agent vocal IA qui répond 24 h/24, 7 j/7. Il se présente comme assistant IA dès le début de l’appel, répond aux questions fréquentes (horaires, parking, menu), recueille la date, l’heure, le nombre de couverts et les demandes particulières, puis vous envoie le résumé de chaque appel. Quand votre équipe doit intervenir, il transfère l’appel selon les règles que vous avez fixées.

Vous gardez votre numéro habituel : un simple renvoi d’appel suffit. Et avec les clients étrangers, en activant les langues supplémentaires, l’agent reconnaît la langue de l’appelant et répond dans la même langue : il en parle plus de 80. Le forfait Réceptionniste coûte 99 USD HT par mois, avec 350 minutes par mois incluses, sans frais de mise en service ni engagement.

Voir tous les forfaits : [lien LinkedIn]

#ristorazione (restauration) #hospitality (hôtellerie-restauration) #assistentetelefonicoAI (assistant téléphonique IA) #intelligenzaartificiale (intelligence artificielle) #PMI (PME)
```

</details>

---

## it-B : « Entendez-le vous-même » : démo en direct

- **Date :** mardi 20 octobre 2026, Facebook 08:30, LinkedIn 12:45 ; heure de Rome, CEST UTC+2, identique à Paris.
- **Visuels :** `it-B-carre.png` (1080×1080), `it-B-linkedin.png` (1200×627).
- **Lien Facebook :** https://www.permanenceia.com/it/demo?utm_source=facebook&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=B
- **Lien LinkedIn :** https://www.permanenceia.com/it/demo?utm_source=linkedin&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=B

**Texte sur le visuel**

- Pastille : « Demo gratuita dal vivo »
- Titre : « Parli *con il nostro agente AI*, adesso » (7 mots)
- Sous-titre : « Nel browser, senza iscrizione, o sul Suo telefono. »
- Bouton : « Provi la demo » · adresse : permanenceia.com/it/demo
- Portraits Manuela et Marco (illustrations générées), onde sonore, légende « Voce femminile e maschile · agenti AI », puces de langues (6 en carré ; 5 en 1200×627, sans Nederlands, pour tenir sur une ligne)

**Facebook (italien, 70 mots)**

```text
🎧 Un agente AI al telefono: che effetto fa, davvero?
Non ci creda sulla parola: lo ascolti. Sul nostro sito può parlare dal vivo con Manuela o Marco, i nostri agenti vocali AI, direttamente dal browser, gratis e senza iscrizione. Preferisce il telefono? Lasci il Suo numero: l’agente La chiama in orario di apertura.
Gli faccia le domande che Le fanno i Suoi clienti, cambi idea, lo interrompa.
👉 Provi la demo: https://www.permanenceia.com/it/demo?utm_source=facebook&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=B
#assistentetelefonicoAI #intelligenzaartificiale
```

**LinkedIn (italien, 163 mots)**

```text
«Ma sembra un robot?» Quando si parla di AI al telefono, è la prima domanda che viene in mente.
Più che leggere la nostra risposta, conviene ascoltare l’agente: bastano trenta secondi.

Sulla pagina demo di PermanenceIA può parlare dal vivo con il nostro agente vocale AI, direttamente dal browser, gratis e senza iscrizione. Sceglie il ruolo (Receptionist, Commerciale o Assistenza), la lingua e la voce: Manuela o Marco per l’italiano, ma anche voci in francese, inglese britannico e australiano, polacco, olandese ed ebraico. Preferisce il telefono? Lasci il Suo numero: l’agente La chiama entro pochi minuti durante l’orario di apertura (dal lunedì al sabato, 9:00-13:00 e 14:30-19:00, ora italiana).

Lo metta alla prova come farebbe un Suo cliente: faccia domande, cambi idea, lo interrompa. Sentirà l’agente presentarsi come AI e, secondo il ruolo scelto, rispondere, qualificare la richiesta o proporre un appuntamento. Capirà così cosa potrà fare il Suo agente per i Suoi clienti, in oltre 80 lingue.

Provi la demo dal vivo: https://www.permanenceia.com/it/demo?utm_source=linkedin&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=B

#intelligenzaartificiale #assistentetelefonicoAI #customerexperience #PMI
```

<details><summary>Traduction française (Facebook)</summary>

```text
🎧 Un agent IA au téléphone : quel effet ça fait, vraiment ?
Ne nous croyez pas sur parole : écoutez-le. Sur notre site, vous pouvez parler en direct avec Manuela ou Marco, nos agents vocaux IA, directement depuis le navigateur, gratuitement et sans inscription. Vous préférez le téléphone ? Laissez votre numéro : l’agent vous appelle aux heures d’ouverture.
Posez-lui les questions que vous posent vos clients, changez d’avis, interrompez-le.
👉 Essayez la démo : [lien Facebook]
#assistentetelefonicoAI (assistant téléphonique IA) #intelligenzaartificiale (intelligence artificielle)
```

</details>

<details><summary>Traduction française (LinkedIn)</summary>

```text
« Mais est-ce que ça fait robot ? » Quand on parle d’IA au téléphone, c’est la première question qui vient à l’esprit.
Plutôt que de lire notre réponse, mieux vaut écouter l’agent : trente secondes suffisent.

Sur la page démo de PermanenceIA, vous pouvez parler en direct avec notre agent vocal IA, directement depuis le navigateur, gratuitement et sans inscription. Vous choisissez le rôle (Réceptionniste, Commercial ou Assistance), la langue et la voix : Manuela ou Marco pour l’italien, mais aussi des voix en français, anglais britannique et australien, polonais, néerlandais et hébreu. Vous préférez le téléphone ? Laissez votre numéro : l’agent vous appelle dans les minutes qui suivent, aux heures d’ouverture (du lundi au samedi, 9 h-13 h et 14 h 30-19 h, heure italienne).

Mettez-le à l’épreuve comme le ferait l’un de vos clients : posez des questions, changez d’avis, interrompez-le. Vous entendrez l’agent se présenter comme une IA et, selon le rôle choisi, répondre, qualifier la demande ou proposer un rendez-vous. Vous comprendrez ainsi ce que votre agent pourra faire pour vos clients, dans plus de 80 langues.

Essayez la démo en direct : [lien LinkedIn]

#intelligenzaartificiale (intelligence artificielle) #assistentetelefonicoAI (assistant téléphonique IA) #customerexperience (expérience client) #PMI (PME)
```

</details>

---

## it-C : « Essayez gratuitement » : essai de 14 jours

- **Date :** mardi 27 octobre 2026, Facebook 08:30, LinkedIn 12:45 ; heure de Rome, CET UTC+1 après le changement d’heure du dimanche 25 octobre, identique à Paris.
- **Visuels :** `it-C-carre.png` (1080×1080), `it-C-linkedin.png` (1200×627).
- **Lien Facebook :** https://www.permanenceia.com/it/essai-gratuit?utm_source=facebook&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=C
- **Lien LinkedIn :** https://www.permanenceia.com/it/essai-gratuit?utm_source=linkedin&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=C

**Texte sur le visuel**

- Pastille : « Prova gratuita »
- Titre : « Il Suo agente AI gratuito, *in pochi minuti* » (7 mots)
- Sous-titre : « Risponde 24/7, fissa gli appuntamenti e Le invia il riepilogo. »
- Bouton : « Inizi gratis » (libellé ctas.primary du site) · adresse : permanenceia.com/it/essai-gratuit
- Chiffres : « 14 giorni di prova gratuita » · « 30 minuti di chiamate inclusi »
- Points : « Carta richiesta, nessun addebito durante la prova » · « Senza vincoli, disdetta senza costi » · « Mantiene il Suo numero di sempre »

**Facebook (italien, 75 mots)**

```text
✅ Il Suo agente AI gratuito, pronto in pochi minuti.
Provi PermanenceIA per 14 giorni sul piano che preferisce, con 30 minuti di chiamate inclusi. L’agente risponde 24/7 in oltre 80 lingue, fissa gli appuntamenti e Le invia il riepilogo di ogni chiamata. E Lei mantiene il Suo numero di sempre.
Carta richiesta all’attivazione, nessun addebito durante la prova. Senza vincoli: disdica prima della fine senza costi, altrimenti al termine parte il piano scelto.
👉 Inizi gratis: https://www.permanenceia.com/it/essai-gratuit?utm_source=facebook&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=C
#provagratuita #assistentetelefonicoAI
```

**LinkedIn (italien, 166 mots)**

```text
Provare un agente vocale AI sulle proprie chiamate prima di decidere: è questo il senso della prova gratuita di PermanenceIA.
14 giorni sul piano che preferisce, 30 minuti di chiamate inclusi.

Un primo agente è pronto in pochi minuti a partire dalle informazioni sulla Sua attività; per una configurazione completa (calendario, numeri, trasferimenti) servono in genere uno o due giorni, con il nostro supporto. Lei mantiene il Suo numero di sempre grazie alla deviazione di chiamata. L’agente si presenta come AI, risponde 24 ore su 24 in oltre 80 lingue, fissa gli appuntamenti, qualifica i contatti e Le invia il riepilogo di ogni chiamata.

Le condizioni, in chiaro: carta richiesta all’attivazione, nessun addebito durante la prova. Raggiunti i 30 minuti, le chiamate si interrompono fino alla fine della prova o all’avvio dell’abbonamento. Le inviamo un’email di promemoria 7 giorni prima della scadenza: se disdice prima della fine dei 14 giorni non paga nulla, altrimenti parte il piano scelto. Nessun vincolo, nessun costo di attivazione.

Inizi gratis: https://www.permanenceia.com/it/essai-gratuit?utm_source=linkedin&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=C

#provagratuita #assistentetelefonicoAI #intelligenzaartificiale #PMI #digitalizzazione
```

<details><summary>Traduction française (Facebook)</summary>

```text
✅ Votre agent IA gratuit, prêt en quelques minutes.
Essayez PermanenceIA pendant 14 jours sur le forfait de votre choix, avec 30 minutes d’appels incluses. L’agent répond 24/7 dans plus de 80 langues, prend les rendez-vous et vous envoie le résumé de chaque appel. Et vous gardez votre numéro habituel.
Carte demandée à l’activation, rien n’est débité pendant l’essai. Sans engagement : annulez avant la fin sans frais ; sinon, le forfait choisi démarre à l’échéance.
👉 Commencez gratuitement : [lien Facebook]
#provagratuita (essai gratuit) #assistentetelefonicoAI (assistant téléphonique IA)
```

</details>

<details><summary>Traduction française (LinkedIn)</summary>

```text
Essayer un agent vocal IA sur ses propres appels avant de décider : c’est tout le sens de l’essai gratuit PermanenceIA.
14 jours sur le forfait de votre choix, 30 minutes d’appels incluses.

Un premier agent est prêt en quelques minutes à partir des informations sur votre activité ; pour une configuration complète (agenda, numéros, transferts), il faut en général un ou deux jours, avec notre accompagnement. Vous gardez votre numéro habituel grâce au renvoi d’appel. L’agent se présente comme une IA, répond 24 h/24 dans plus de 80 langues, prend les rendez-vous, qualifie les contacts et vous envoie le résumé de chaque appel.

Les conditions, en clair : carte demandée à l’activation, rien n’est débité pendant l’essai. Une fois les 30 minutes atteintes, les appels s’interrompent jusqu’à la fin de l’essai ou jusqu’au démarrage de l’abonnement. Nous vous envoyons un e-mail de rappel 7 jours avant l’échéance : si vous annulez avant la fin des 14 jours, vous ne payez rien ; sinon, le forfait choisi démarre. Sans engagement, sans frais de mise en service.

Commencez gratuitement : [lien LinkedIn]

#provagratuita (essai gratuit) #assistentetelefonicoAI (assistant téléphonique IA) #intelligenzaartificiale (intelligence artificielle) #PMI (PME) #digitalizzazione (transformation numérique)
```

</details>

---

## Contrôles faits

| Contrôle | A | B | C |
|---|---|---|---|
| Chiffres tous présents dans le dépôt | 99 USD, 350 min, 24/7, 80+ langues | 80+ langues, horaires de la démo | 14 j, 30 min, rappel à J-7, 1 à 2 jours |
| Mention « AI » dans le texte et sur l’image | oui | oui | oui |
| Aucun secteur santé, aucune promesse de conformité santé | oui (restauration) | oui | oui |
| URL vers /it/, UTM facebook ou linkedin + utm_content | oui | oui | oui |
| Page en ligne (réponse 200 le 9 oct. 2026) | /it/tarifs | /it/demo | /it/essai-gratuit |
| Titre du visuel de 8 mots au plus | 7 | 7 | 7 |
| « Carta richiesta, nessun addebito » écrit (essai) | sans objet | sans objet | oui, texte et image |
| Pas de « ricontatto automatico » sans le forfait Assistant | oui | oui | oui |
| Longueur Facebook 40 à 90 mots, 1 à 3 hashtags, 0 à 2 émojis | 74 mots, 2, 2 | 70 mots, 2, 2 | 75 mots, 2, 2 |
| Longueur LinkedIn 120 à 200 mots, 3 à 5 hashtags | 181 mots, 5 | 163 mots, 4 | 166 mots, 5 |
| Visuels relus un par un après le dernier rendu (lisibles, rien de coupé) | oui | oui | oui |

## Sources dans le dépôt

- Essai : `src/i18n/markets.ts` (trial 14 jours, 30 minutes), `src/i18n/content/it/offers.ts` (decouverte : « 14 giorni sul piano che preferisce », carte sans débit), `faq.ts` (« Come funziona la prova gratuita? », « Cosa succede dopo i 30 minuti di prova? », « Quanto tempo serve per iniziare? », « Ci sono costi di attivazione? »), pop-up `trialNudge` dans `ui/components.ts`.
- Prix : `markets.ts` basePlans (Receptionist 99 $, 350 minutes par mois), format « 99 USD » (`money` de `src/i18n/index.tsx` en it-IT) et « IVA esclusa / mese » (`OFFER_LABELS`).
- Numéro conservé : `faq.ts` et `ui/components.ts` voicesNumbers (« deviazione di chiamata »). Langues : matrice `offers.ts` (« Lingue aggiuntive », tous les forfaits) et `sectors.ts` (« Accoglienza nella lingua del cliente, se attivata »).
- Démo : `ui/components.ts` liveDemo (rôles Receptionist, Commerciale, Assistenza ; accents des 7 marchés ; rappel « entro pochi minuti », lun.–sam. 9:00-13:00 et 14:30-19:00, ora italiana), `src/data/personas.ts` (Manuela et Marco), `src/pages/demo.tsx` (composant LiveDemo).
- Restauration : `sectors.ts` restaurants-hotellerie (orari, parcheggio, menu ; data, ora, coperti ; trasferimento al team).
- Libellés : « Veda i prezzi » (`ui/pages.ts`), « Inizi gratis » (`ctas.primary`), « Chiamata terminata · riepilogo inviato » (`liveCall.ended`).
- Liens : `src/pages/{tarifs,demo,essai-gratuit}.tsx` existent, `it` est dans `src/i18n/locales.ts` et `next.config.js`.

## Corrections de la relecture

- **« trasferimento di chiamata » → « deviazione di chiamata » (A et C, LinkedIn).** Sur le site, « trasferimento » désigne le transfert vers l’équipe ; garder son numéro se dit « deviazione di chiamata » (FAQ, voicesNumbers). L’ancien texte mélangeait les deux.
- **« senza registrazione » → « senza iscrizione » (B, Facebook, LinkedIn et visuels).** En italien, « registrazione » se lit aussi « enregistrement » : la phrase pouvait faire croire que la démo n’est pas enregistrée, alors que la politique de confidentialité dit le contraire. « Iscrizione » ne veut dire qu’« inscription ».
- **Langues (A, LinkedIn) :** ajout de « attivando le lingue aggiuntive ». La fiche restauration du site précise « se attivata ».
- **Prix (A, LinkedIn) :** « parte da 99 USD » → « costa 99 USD … con 350 minuti al mese inclusi ». Le forfait Receptionist a un prix fixe ; « da » reste sur Facebook et sur le visuel, où il s’agit de l’ensemble des forfaits.
- **Démo (B, LinkedIn) :** « secondo il ruolo scelto, rispondere, qualificare la richiesta o proporre un appuntamento » : chaque rôle fait l’une de ces choses, pas les trois. Horaires du rappel repris du site (« entro pochi minuti », « ora italiana »).
- **Essai (C, LinkedIn) :** arrêt des appels « fino alla fine della prova o all’avvio dell’abbonamento », comme dans la FAQ.
- **Langue :** « come suona davvero? » (calque de l’anglais) → « che effetto fa, davvero? » ; « Non ci creda sulla parola: ci parli. Sul nostro sito può parlare… » (répétition) → « …: lo ascolti » ; « è la domanda più naturale » → « è la prima domanda che viene in mente » ; « La risposta migliore non la scriviamo noi: la ascolta Lei » → « Più che leggere la nostra risposta, conviene ascoltare l’agente » ; « Vedrà » (pour une démo qu’on écoute) → « Capirà » ; « la voce: Manuela o Marco per l’italiano, oltre a francese… » → « la lingua e la voce: … ma anche voci in francese… » ; « Ora rischia di finire al ristorante di fronte » (c’est l’appel qui part ?) → « Ora quei quattro coperti rischiano… » ; « durante il servizio, in cucina » → « in pieno servizio, mentre si è in cucina » ; sujets ambigus en C (« : risponde… Mantiene il Suo numero ») → « L’agente risponde… E Lei mantiene… ».
- **Commercial :** « senza vincoli » ajouté au prix en A (Facebook).
- **Visuel A :** l’icône cadeau devant le prix est retirée (nouvelle option `badgeicon=-` dans `post.html`) : un cadeau devant un tarif laissait penser à une offre gratuite.
- **Traductions françaises :** #assistentetelefonicoAI = « assistant téléphonique IA » (et non « standard ») ; traductions des hashtags LinkedIn ajoutées ; textes alignés sur les versions italiennes corrigées.

## Points à trancher

- **Heure Facebook :** l’italien passe à 08:30 (voir le calendrier). Le paragraphe de `fr/posts.md` qui annonce l’italien à 09:00 est à mettre à jour si vous gardez ce choix.
- **Titre du visuel C :** le titre du brief (« Il Suo agente AI gratuito, pronto in pochi minuti ») fait 9 mots, au-delà de la limite de 8. Le visuel porte « Il Suo agente AI gratuito, *in pochi minuti* » (7 mots) ; le texte du post garde « pronto in pochi minuti ».
- **Titre du visuel B :** « adesso » au lieu de « ora », comme le titre de la démo sur le site (« Parli con l’agente, adesso »).
- **Page Facebook en anglais :** les posts italiens iront sur la même Page que ceux des 6 autres langues (voir partie 2 du brief).
- **LinkedIn :** aucune page entreprise n’existe encore ; les textes sont prêts pour le jour où elle sera créée.

# Posts Facebook et LinkedIn : anglais britannique (en-gb), octobre 2026

Marché : Royaume-Uni et Irlande. Marque : **PermanenceAI** (« AI Receptionist »). Ton : « you », orthographe britannique, « AI receptionist ».
Campagne : `posts-oct-2026`. Rien n'a été publié : ce sont des brouillons à valider.
Version relue le 09/10/2026 (relecture native en-gb et contrôle des faits dans le dépôt) : voir « Corrections de la relecture » en bas.

## Calendrier

Londres et Dublin ont la même heure. Jusqu'au 24 octobre : BST/IST (UTC+1). À partir du 25 octobre : GMT (UTC+0). Paris a toujours une heure de plus.

| Post | Date | LinkedIn | Facebook | Page cible |
|---|---|---|---|---|
| en-gb-A : appels manqués | mer. 14/10/2026 | 08:00 Londres (09:00 Paris) | 12:30 Londres (13:30 Paris) | `/en-gb/tarifs` |
| en-gb-B : démo en direct | mer. 21/10/2026 | 08:00 Londres (09:00 Paris) | 12:30 Londres (13:30 Paris) | `/en-gb/demo` |
| en-gb-C : essai gratuit | mer. 28/10/2026 | 08:00 Londres, GMT (09:00 Paris) | 12:30 Londres, GMT (13:30 Paris) | `/en-gb/essai-gratuit` |

Le pl publie les mêmes mercredis : LinkedIn 12:45, Facebook 09:30 (heure de Varsovie). L'écart est d'au moins 3 h 30 sur chaque réseau, comme le prévoit le brief.

## Visuels

Le dossier contient :
- `post.html` : copie du gabarit avec trois ajouts, décrits plus bas ;
- `render.mjs` : le script de rendu ;
- `visuels.json` : les réglages de chaque visuel.

Pour tout refaire :
```
node docs/marketing/posts-2026-10/en-gb/render.mjs docs/marketing/posts-2026-10/en-gb/visuels.json <dossier>
```
Ensuite, renommez `<id>_1080x1080.png` en `<id>-carre.png` et `<id>_1200x627.png` en `<id>-linkedin.png`.

**Les trois ajouts à `post.html` (la copie en-gb seulement, le gabarit commun n'est pas touché) :**
- Paramètres `photozoom` et `photoorigin`. Dans le carré, le cadre est plus large que la photo de l'agence. Sans zoom, les cartes cachaient l'agent immobilier, qui est le personnage principal.
- Un voile sombre en bas de la photo, au format large. Il rend les cartes lisibles sur une photo claire.
- Au format large du post B, les 6 langues tiennent sur deux lignes de 3 (avant : 5 langues puis l'hébreu seul sur la deuxième ligne).

Contrôles : les 6 images ont été régénérées le 09/10 avec Chrome sans interface ; elles ont la bonne taille et les polices sont chargées (`render.mjs`). Je les ai toutes relues une par une : rien n'est coupé, aucune faute, la mention « AI voice agent » est visible sur chacune.

---

## en-gb-A : « Every missed call is a lost customer »

- **Date :** mercredi 14/10/2026. LinkedIn à 08:00, Facebook à 12:30, heure de Londres (BST). À Paris : 09:00 et 13:30.
- **Visuels :**
  - `en-gb-A-carre.png` (1080×1080, Facebook et LinkedIn) ;
  - `en-gb-A-linkedin.png` (1200×627, variante LinkedIn).
  - Photo : `public/photos/immobilier.jpg`, un agent immobilier en visite (photo de la page secteur immobilier du site). Public visé : les agents immobiliers.
- **Texte sur le visuel :**
  - Titre (7 mots) : « Every missed call is *a lost customer* » ;
  - Pastille : « From US$99 excl. tax / month » ;
  - Sous-titre : « Your AI receptionist answers 24/7 and sends you a summary of every call. » ;
  - Bouton : « See pricing » ;
  - Cartes : « Incoming call · Sat 11:20am / You’re out on a viewing » → « AI VOICE AGENT : “Hello, I’m the agency’s AI assistant.” » → « Call ended · summary sent / Viewing booked in your calendar ».
- **Liens :**
  - Facebook : https://www.permanenceia.com/en-gb/tarifs?utm_source=facebook&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=A
  - LinkedIn : https://www.permanenceia.com/en-gb/tarifs?utm_source=linkedin&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=A

### Facebook (68 mots)

```
Out on a viewing when the phone rings? Will that buyer wait… or ring the next agent? 📞

PermanenceAI gives you an AI receptionist that picks up 24/7. It tells callers it’s an AI, asks the right questions (budget, area, timescale), books the viewing straight into your calendar and sends you a summary of every call.

Plans from US$99 excl. tax / month. No setup fee, no commitment.

See pricing 👉 https://www.permanenceia.com/en-gb/tarifs?utm_source=facebook&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=A

#EstateAgents #AIReceptionist
```

### LinkedIn (153 mots)

```
Every missed call is a lost customer. For an estate agent, it can be a viewing, or an instruction, that goes to the agency down the road.

It isn’t about being disorganised. You’re showing a flat, meeting a vendor, or the office has closed for the evening, and the phone keeps ringing.

PermanenceAI gives you an AI receptionist that answers your line 24/7. It tells callers it’s an AI from the very start, qualifies each enquiry (buying, selling or renting; budget, area, timescale), books viewings straight into your calendar through Cal.com or Calendly, and sends you a summary of every call. When a caller wants to speak to someone, it transfers the call to your team, following the rules you set.

You keep your existing number with simple call forwarding. Plans start at US$99 excl. tax / month (Receptionist plan, 350 minutes a month), with no setup fee and no commitment.

Compare the plans: https://www.permanenceia.com/en-gb/tarifs?utm_source=linkedin&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=A

#EstateAgents #AIReceptionist #PropTech #SmallBusinessUK
```

### Traduction française du texte Facebook

> En visite quand le téléphone sonne ? Cet acheteur va-t-il attendre… ou appeler l’agence suivante ? 📞
>
> PermanenceAI vous donne un réceptionniste IA qui décroche 24 h/24, 7 j/7. Il annonce aux appelants qu’il est une IA, pose les bonnes questions (budget, secteur, délai), inscrit directement la visite dans votre agenda et vous envoie un résumé de chaque appel.
>
> Forfaits à partir de 99 $US HT / mois. Sans frais de mise en service, sans engagement.
>
> Voir les tarifs 👉 [lien]
>
> #EstateAgents #AIReceptionist

### Traduction française du texte LinkedIn

> Chaque appel manqué est un client perdu. Pour un agent immobilier, c’est parfois une visite, ou un mandat, qui part chez l’agence d’à côté.
>
> Ce n’est pas une question d’organisation. Vous faites visiter un appartement, vous rencontrez un vendeur, ou l’agence a fermé pour la soirée, et le téléphone n’arrête pas de sonner.
>
> PermanenceAI vous donne un réceptionniste IA qui répond sur votre ligne 24 h/24, 7 j/7. Il annonce dès le début aux appelants qu’il est une IA, qualifie chaque demande (achat, vente ou location ; budget, secteur, délai), inscrit les visites directement dans votre agenda via Cal.com ou Calendly, et vous envoie un résumé de chaque appel. Quand un appelant veut parler à quelqu’un, il transfère l’appel à votre équipe, selon les règles que vous fixez.
>
> Vous gardez votre numéro actuel grâce à un simple renvoi d’appel. Forfaits à partir de 99 $US HT / mois (forfait Réceptionniste, 350 minutes par mois), sans frais de mise en service et sans engagement.
>
> Comparer les forfaits : [lien]

---

## en-gb-B : « Ring 07367 090106. An AI answers. »

- **Date :** mercredi 21/10/2026. LinkedIn à 08:00, Facebook à 12:30, heure de Londres (BST). À Paris : 09:00 et 13:30.
- **Visuels :**
  - `en-gb-B-carre.png` (1080×1080) ;
  - `en-gb-B-linkedin.png` (1200×627).
  - Portraits : Katie et James, les deux voix en-gb de la démo. Ce sont des illustrations générées.
- **Texte sur le visuel :**
  - Titre (5 mots, la variante forte du brief) : « Ring 07367 090106. *An AI answers.* » ;
  - Pastille : « Free live demo » ;
  - Sous-titre : « Or try it in your browser: free, no sign-up. » ;
  - Bouton : « Try our agent live » (libellé du site, `ctas.demo`) ;
  - Légende : « Female and male AI voices · 80+ languages » ;
  - Puces : English, Français, Italiano, Polski, Nederlands, עברית.
- **Liens :**
  - Facebook : https://www.permanenceia.com/en-gb/demo?utm_source=facebook&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=B
  - LinkedIn : https://www.permanenceia.com/en-gb/demo?utm_source=linkedin&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=B

### Facebook (76 mots)

```
Don’t take our word for it. Ring 07367 090106 📞 (+44 7367 090106 from outside the UK)

Katie, our AI receptionist, picks up 24/7 and tells you straight away that she’s an AI. Ask her about our plans, the free trial or how it all works, and hear for yourself how an AI agent handles a real call.

Rather not call? Talk to Katie or James live in your browser: free, no sign-up.

Try our agent live 👉 https://www.permanenceia.com/en-gb/demo?utm_source=facebook&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=B

#AIReceptionist #VoiceAI
```

### LinkedIn (154 mots)

```
The quickest way to judge an AI receptionist? Ring one.

Call 07367 090106 (+44 7367 090106 from outside the UK). Katie, our AI agent, picks up 24/7 and tells you from the outset that she’s an AI. Ask her about plans, the trial or setup, try interrupting her, and judge the conversation for yourself.

Rather not pick up the phone? Our live demo runs in your browser, free and with no sign-up. Choose a role (receptionist, sales or support) and your trade, pick Katie’s or James’s voice, then play the customer, out loud or by typing. You can also have the agent ring your own phone, within minutes during our opening hours (Monday to Saturday, UK time).

Once it’s set up for your business, the agent detects each caller’s language and replies in the same language (more than 80 available), books appointments and sends you a summary of every call.

Hear it for yourself: https://www.permanenceia.com/en-gb/demo?utm_source=linkedin&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=B

#AIReceptionist #VoiceAI #CustomerExperience #SmallBusinessUK
```

### Traduction française du texte Facebook

> Ne nous croyez pas sur parole. Appelez le 07367 090106 📞 (+44 7367 090106 depuis l’extérieur du Royaume-Uni)
>
> Katie, notre réceptionniste IA, décroche 24 h/24, 7 j/7 et vous dit tout de suite qu’elle est une IA. Posez-lui vos questions sur nos forfaits, l’essai gratuit ou le fonctionnement, et entendez par vous-même comment un agent IA gère un vrai appel.
>
> Vous préférez ne pas appeler ? Parlez à Katie ou à James en direct dans votre navigateur : gratuit, sans inscription.
>
> Essayer notre agent en direct 👉 [lien]
>
> #AIReceptionist #VoiceAI

### Traduction française du texte LinkedIn

> Le moyen le plus rapide de juger un réceptionniste IA ? En appeler un.
>
> Appelez le 07367 090106 (+44 7367 090106 depuis l’extérieur du Royaume-Uni). Katie, notre agent IA, décroche 24 h/24, 7 j/7 et vous dit d’emblée qu’elle est une IA. Posez-lui vos questions sur les forfaits, l’essai ou la mise en place, essayez de l’interrompre, et jugez la conversation par vous-même.
>
> Vous préférez ne pas prendre votre téléphone ? Notre démo en direct fonctionne dans votre navigateur, gratuitement et sans inscription. Choisissez un rôle (accueil, commercial ou support) et votre métier, prenez la voix de Katie ou de James, puis jouez le client, à voix haute ou par écrit. Vous pouvez aussi demander à l’agent d’appeler votre propre téléphone : il vous appelle en quelques minutes pendant nos heures d’ouverture (du lundi au samedi, heure britannique).
>
> Une fois configuré pour votre entreprise, l’agent détecte la langue de chaque appelant et lui répond dans cette langue (plus de 80 disponibles), prend les rendez-vous et vous envoie un résumé de chaque appel.
>
> Écoutez par vous-même : [lien]

---

## en-gb-C : « Your free AI agent, live in minutes »

- **Date :** mercredi 28/10/2026. LinkedIn à 08:00, Facebook à 12:30, heure de Londres (GMT, après le changement d'heure du 25/10). À Paris : 09:00 et 13:30.
- **Visuels :**
  - `en-gb-C-carre.png` (1080×1080, fond clair) ;
  - `en-gb-C-linkedin.png` (1200×627).
- **Texte sur le visuel :**
  - Titre (7 mots) : « Your free AI agent, *live in minutes* » ;
  - Pastille : « 30 minutes on us » (sous-titre du pop-up trialNudge) ;
  - Bouton : « Start for free » (`ctas.primary`) ;
  - Chiffres : « 14 days free » et « 30 minutes of calls included » ;
  - Points : « Card required, nothing charged during the trial » · « No commitment, cancel at no cost » · « You keep your number ».
- **Liens :**
  - Facebook : https://www.permanenceia.com/en-gb/essai-gratuit?utm_source=facebook&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=C
  - LinkedIn : https://www.permanenceia.com/en-gb/essai-gratuit?utm_source=linkedin&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=C

### Facebook (79 mots)

```
Your free AI agent, with 30 minutes on us 🎁

Try PermanenceAI free for 14 days on the plan of your choice, with 30 minutes of calls included. Your first agent is up and running in minutes, and you keep your number.

A card is required to activate the trial, but nothing is charged for the 14 days. No commitment: cancel before the end and you pay nothing. Otherwise, your chosen plan starts when the trial ends.

Start for free 👉 https://www.permanenceia.com/en-gb/essai-gratuit?utm_source=facebook&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=C

#AIReceptionist #FreeTrial
```

### LinkedIn (158 mots)

```
Your free AI agent, live in minutes, with 30 minutes of calls on us.

Here’s exactly how the PermanenceAI free trial works:
• 14 days on the plan of your choice, with 30 call minutes included
• A card is required on activation, but nothing is charged during the trial
• No commitment, no setup fee: cancel from your customer area before the end and you pay nothing (you’ll get a reminder email 7 days before the trial ends)
• If you don’t cancel, your chosen plan starts when the 14 days are up

You keep your existing number: forward your calls, connect via SIP, or import your Twilio or Telnyx numbers. A first agent is ready in a few minutes; a full setup with calendar, numbers and transfers usually takes one to two days, with our help.

Once live, your agent answers 24/7, tells callers it’s an AI, books appointments and sends you a summary of every call.

Start for free: https://www.permanenceia.com/en-gb/essai-gratuit?utm_source=linkedin&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=C

#AIReceptionist #FreeTrial #SmallBusinessUK #CustomerService
```

### Traduction française du texte Facebook

> Votre agent IA gratuit, avec 30 minutes offertes 🎁
>
> Essayez PermanenceAI gratuitement pendant 14 jours sur le forfait de votre choix, avec 30 minutes d’appels incluses. Votre premier agent est opérationnel en quelques minutes, et vous gardez votre numéro.
>
> Une carte est nécessaire pour activer l’essai, mais rien n’est débité pendant les 14 jours. Sans engagement : annulez avant la fin et vous ne payez rien. Sinon, le forfait choisi démarre à la fin de l’essai.
>
> Démarrer gratuitement 👉 [lien]
>
> #AIReceptionist #FreeTrial

### Traduction française du texte LinkedIn

> Votre agent IA gratuit, opérationnel en quelques minutes, avec 30 minutes d’appels offertes.
>
> Voici exactement comment fonctionne l’essai gratuit de PermanenceAI :
> • 14 jours sur le forfait de votre choix, avec 30 minutes d’appels incluses
> • Une carte est demandée à l’activation, mais rien n’est débité pendant l’essai
> • Sans engagement, sans frais de mise en service : annulez depuis votre espace client avant la fin et vous ne payez rien (vous recevez un e-mail de rappel 7 jours avant la fin de l’essai)
> • Si vous n’annulez pas, le forfait choisi démarre à la fin des 14 jours
>
> Vous gardez votre numéro actuel : renvoyez vos appels, connectez-vous en SIP ou importez vos numéros Twilio ou Telnyx. Un premier agent est prêt en quelques minutes ; une mise en place complète (agenda, numéros, transferts) prend en général un à deux jours, avec notre aide.
>
> Une fois en service, votre agent répond 24 h/24, 7 j/7, annonce aux appelants qu’il est une IA, prend les rendez-vous et vous envoie un résumé de chaque appel.
>
> Démarrer gratuitement : [lien]

---

## Contrôle avant validation (partie 7 du brief)

| Point | A | B | C |
|---|---|---|---|
| Chaque chiffre vient du site (`markets.ts`, `offers.ts`, `faq.ts`, `ui/components.ts`) | 99 $, 350 min, 24/7 | 07367 090106, 24/7, 80+ langues, horaires de rappel | 14 j, 30 min, rappel à 7 jours, 1 à 2 jours de mise en place |
| Mention IA dans le texte et sur l'image | oui | oui | oui |
| Aucun secteur santé, aucune promesse de conformité | oui (immobilier) | oui | oui |
| URL de la bonne langue, UTM compris (chemin dans `src/pages`, locale dans `locales.ts`, réponse 200 en ligne) | `/en-gb/tarifs` | `/en-gb/demo` | `/en-gb/essai-gratuit` |
| Titre du visuel de 8 mots au plus | 7 | 5 | 7 |
| Essai : « carte demandée, rien n'est débité » et démarrage du forfait à la fin | sans objet | sans objet | oui |
| Pas de « rappel automatique » sans le forfait Assistant | aucun | aucun | aucun |
| Aucune promesse de résultat chiffré | oui | oui | oui |

## Sources vérifiées dans le dépôt

- Prix et minutes : `src/i18n/markets.ts` (Receptionist 99 $ HT, 350 min/mois ; essai 14 jours, 30 min), libellés `OFFER_LABELS` (« excl. tax / month ») de `src/i18n/content/en/offers.ts`. La page tarifs en ligne affiche bien « US$99 excl. tax / month ».
- Essai : `offers.ts` (offre `decouverte`), `faq.ts` (carte exigée, rien n'est débité, rappel 7 jours avant la fin, annulation depuis l'espace client, forfait qui démarre à la fin), CGU article 3 (`ui/pages.ts`). Pas de frais de mise en service : `faq.ts`.
- Numéro gardé : `faq.ts` (renvoi d'appel, SIP, import Twilio ou Telnyx, sur tous les forfaits). Délais : `faq.ts` (premier agent en quelques minutes, mise en place complète en un à deux jours, avec notre aide).
- Agenda via Cal.com ou Calendly, transfert selon vos règles, résumé de chaque appel, annonce « c'est une IA » : `faq.ts`, `offers.ts` (MATRIX), `ui/components.ts` (callFlow).
- Immobilier (achat, vente ou location ; budget, secteur, délai ; visites) : `src/i18n/content/en/sectors.ts`, secteur `immobilier` (actif, hors `PAUSED_SECTORS`).
- Ligne 07367 090106, Katie (IA) 24/7, ventes et support : `markets.ts`. Voix Katie et James : `src/data/personas.ts`. Démo : rôles, métier, voix, navigateur ou appel sur son téléphone, « within minutes during opening hours (Monday to Saturday, 9am–12:30pm and 2pm–7pm UK time) » : `ui/components.ts` (liveDemo) ; « free, no sign-up » : `content/en/site.ts`.
- Plus de 80 langues, détection de la langue de l'appelant : `ui/components.ts` (trialNudge, voicesText), MATRIX « Secondary languages ».

## Corrections de la relecture (09/10/2026)

- A, Facebook : « PermanenceAI is an AI receptionist » devient « PermanenceAI gives you an AI receptionist » (PermanenceAI est la plateforme, pas le réceptionniste) ; « books the viewing straight into your calendar ».
- A, LinkedIn : « (Receptionist, 350 minutes) » devient « (Receptionist plan, 350 minutes a month) », car les 350 minutes sont mensuelles. « When a caller needs a person » devient « When a caller wants to speak to someone, it transfers the call to your team, following the rules you set » (plus naturel, et conforme à la FAQ : transfert selon vos réglages).
- A, visuel : le sous-titre « …and sends you the summary » (article bancal) devient « …and sends you a summary of every call ». Visuels A régénérés.
- B, LinkedIn : « interrupt her, change your mind mid-sentence » devient « try interrupting her ». La FAQ dit seulement que l'agent « s'adapte quand on l'interrompt » ; « changer d'avis en pleine phrase » n'est écrit nulle part.
- B, LinkedIn : « During UK opening hours, Monday to Saturday » prêtait à confusion (heures d'ouverture de qui ?). Le texte dit maintenant « within minutes during our opening hours (Monday to Saturday, UK time) », comme le site. « replies in it » devient « replies in the same language (more than 80 available) ».
- B, visuel large : langues sur deux lignes de 3. Visuels B régénérés.
- C, Facebook : « A card is requested on activation » (tournure traduite) devient « A card is required to activate the trial, but nothing is charged for the 14 days ». La page essai-gratuit en ligne dit : « Card required on activation, nothing charged for 14 days ». La fin devient « cancel before the end and you pay nothing. Otherwise, your chosen plan starts when the trial ends ».
- C, LinkedIn : « And the first 30 minutes of calls are on us » laissait croire que les minutes suivantes sont payantes pendant l'essai. Or les appels s'arrêtent à 30 minutes (FAQ, CGU art. 3). Le texte dit maintenant « with 30 minutes of calls on us ». « call forwarding, SIP, or Twilio and Telnyx import » devient « forward your calls, connect via SIP, or import your Twilio or Telnyx numbers ». « a reminder email goes out » devient « you’ll get a reminder email ».
- C, visuel : « Card requested » devient « Card required ». Visuels C régénérés.
- Traductions françaises : refaites pour suivre les nouveaux textes. J'ai ajouté celles des textes LinkedIn.

## Points à trancher

- **Où publier :**
  - LinkedIn : la page entreprise n'existe pas encore, il faut la créer d'abord.
  - Facebook : une seule page en anglais, partagée avec en-au. Les posts en-au partent le jeudi, ce qui évite les doublons le même jour. Pour le post B (numéro britannique), il vaut mieux limiter l'audience du post au Royaume-Uni et à l'Irlande, si la page le permet ; sinon, un lecteur australien verra un numéro britannique.
- **Post B :**
  - Il met en avant la ligne publique britannique : c'est la variante forte du brief.
  - Le seul lien du post renvoie vers `/demo`. Le numéro sert d'accroche.
  - Pour l'Irlande, j'ai ajouté le format international +44. Depuis l'Irlande, l'appel est facturé au tarif international, selon l'opérateur de l'appelant.
  - La ligne doit bien répondre 24/7 les 21 et 22/10 : à vérifier par un appel test avant la publication.
- **Prix :** le site affiche ses prix en dollars US hors taxes, et les posts aussi (« US$99 excl. tax / month »). La page tarifs ajoute un équivalent indicatif en livres (taux du jour), mais le post n'en donne pas.
- **Pastille du post A :** l'icône du gabarit est un cadeau, placée ici à côté d'un prix. Ce n'est pas une erreur, mais une étiquette de prix serait plus juste. Je ne l'ai pas changée, pour garder le même gabarit dans toutes les langues.
- **Scène du post A :** « Sat 11:20am » et « Viewing booked » sont une scène d'exemple, pas un vrai client.

# Posts Facebook et LinkedIn : hébreu (he), octobre 2026

Marché : Israël. Marque : **PermanenceAI** (« מענה טלפוני חכם 24/7 »). Ton : pluriel neutre « אתם » comme sur le site, de droite à gauche, vocabulaire du site (« מענה טלפוני », « סוכן קולי AI », « ימי ניסיון חינם », noms des forfaits : מענה טלפוני, עוזר AI, מוקד שיחות).
Campagne : `posts-oct-2026`. Rien n'a été publié : ce sont des brouillons à valider.

**Version finale, relue le 09/10/2026** (relecture native, vérification des faits dans le dépôt, visuels B et C régénérés). Les corrections sont listées à la fin du fichier.

## Calendrier

Heure d'Israël. Jusqu'au 24 octobre : IDT (UTC+3). À partir du 25 octobre à 02:00 : IST (UTC+2). Paris change d'heure la même nuit : Israël a donc toujours une heure d'avance sur Paris. Aucune publication le vendredi ni le samedi ; le dimanche est un jour ouvré en Israël. Aucun jour férié israélien ces jours-là (dernière fête chômée : 3 octobre, `src/lib/relances/calendar.ts`).

| Post | Date | LinkedIn | Facebook | Page cible |
|---|---|---|---|---|
| he-A : appels manqués | lun. 12/10/2026 | 09:00 Israël (08:00 Paris) | 12:30 Israël (11:30 Paris) | `/he/tarifs` |
| he-B : démo en direct | dim. 18/10/2026 | 09:00 Israël (08:00 Paris) | 12:30 Israël (11:30 Paris) | `/he/demo` |
| he-C : essai gratuit | dim. 25/10/2026 | 09:00 Israël, IST (08:00 Paris) | 12:30 Israël, IST (11:30 Paris) | `/he/essai-gratuit` |

Les autres langues ne publient pas ces jours-là (fr et it le mardi, en-gb et pl le mercredi, nl et en-au le jeudi) : aucun doublon sur la page Facebook commune.

## Visuels

Le dossier contient :
- `post.html` : copie du gabarit, avec les ajouts décrits plus bas ;
- `render.mjs` : le script de rendu (copie de celui de fr/, qui nomme directement les fichiers `-carre` et `-linkedin`) ;
- `visuels.json` : les réglages de chaque visuel.

Pour tout refaire :
```
node docs/marketing/posts-2026-10/he/render.mjs docs/marketing/posts-2026-10/he/visuels.json docs/marketing/posts-2026-10/he
```

**Ajouts à `post.html` (copie he seulement, repris des copies en-gb, nl et fr) :**
- `photozoom` et `photoorigin` : dans le carré, la femme de la photo serait cachée par les cartes ; un léger zoom l'éloigne vers la droite.
- `stackw` : largeur des cartes dans le carré (500 px au lieu de 580).
- Voile sombre en bas de la photo au format large, pour lire les cartes.
- `badgeicon=tag` : icône d'étiquette de prix sur la pastille du post A.
- Un `\n` dans un texte force le retour à la ligne (titre B, phrase de l'agent en A, titre C).

Réglage ajouté dans `visuels.json` à la relecture : `"ai": "סוכן קולי AI"` pour le post C (la mention du haut est accordée au masculin, comme le titre « סוכן AI משלכם »). Le gabarit lui-même n'a pas changé.

Contrôles : les 6 images ont la bonne taille et les polices du site sont chargées (`render.mjs` : « OK », Heebo ; B et C régénérés le 09/10). Je les ai toutes regardées une par une : hébreu de droite à gauche, rien n'est coupé, aucune faute, mention IA visible en haut de chaque image (« סוכנת קולית AI » en A et B, « סוכן קולי AI » en C).

---

## he-A : « שיחה שלא נענתה = לקוח שהלך » (Un appel manqué = un client parti)

- **Date :** lundi 12/10/2026. LinkedIn à 09:00, Facebook à 12:30, heure d'Israël. À Paris : 08:00 et 11:30.
- **Accroche :** « אחרי החגים » (« après les fêtes ») : la reprise des affaires après Souccot (dernière fête chômée le 3 octobre).
- **Visuels :**
  - `he-A-carre.png` (1080×1080, Facebook et LinkedIn) ;
  - `he-A-linkedin.png` (1200×627, variante LinkedIn).
  - Photo : `public/photos/gestion-locative.jpg`, une gestionnaire au téléphone devant un immeuble. Public visé : gestion locative et immobilier (« ניהול נכסים », secteur actif du site), et plus largement les petites entreprises.
- **Texte sur le visuel :**
  - Titre (5 mots) : « שיחה שלא נענתה = *לקוח שהלך* » ;
  - Pastille : « החל מ-$99 לחודש, לא כולל מע״מ » (dès 99 $ par mois, HT) ;
  - Sous-titre : « סוכנת AI עונה 24/7 ושולחת לכם סיכום של כל שיחה. » (Une agente IA répond 24/7 et vous envoie le résumé de chaque appel.) ;
  - Bouton : « לכל המסלולים » (Tous les forfaits) ;
  - Cartes : « שיחה נכנסת · 18:40 / אתם כבר בשיחה אחרת » (Appel entrant · 18:40 / Vous êtes déjà en ligne) → « סוכנת קולית AI : ״שלום, כאן עוזרת ה-AI, במה אפשר לעזור?״ » (Bonjour, ici l'assistante IA, que puis-je faire pour vous ?) → « השיחה הסתיימה · הסיכום נשלח / סיור בדירה נקבע ביומן » (Appel terminé · résumé envoyé / Visite de l'appartement notée dans l'agenda).
- **Liens :**
  - Facebook : https://www.permanenceia.com/he/tarifs?utm_source=facebook&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=A
  - LinkedIn : https://www.permanenceia.com/he/tarifs?utm_source=linkedin&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=A

### Facebook (64 mots, sans le lien ni les hashtags)

```
אחרי החגים, הטלפון חוזר לצלצל. ומי עונה כשאתם באמצע סיור בנכס, בפגישה או בשיחה אחרת? 📞

עם PermanenceAI, סוכנת AI עונה לשיחות שלכם 24/7. היא אומרת כבר בהתחלה שהיא AI, מבררת מה הפונה צריך, קובעת את הפגישה ישר ביומן ושולחת לכם סיכום של כל שיחה. והמספר נשאר שלכם, בעזרת הפניית שיחות.

מסלולים החל מ-$99 לחודש, לא כולל מע״מ. בלי דמי הקמה ובלי התחייבות.

לכל המסלולים 👈 https://www.permanenceia.com/he/tarifs?utm_source=facebook&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=A

#מענהטלפוני #בינהמלאכותית
```

### LinkedIn (135 mots, sans le lien ni les hashtags)

```
אחרי החגים העסקים חוזרים לשגרה, והטלפון חוזר לצלצל. כל שיחה שלא נענתה היא לקוח שעלול להתקשר למתחרה.

זה לא שאתם לא מאורגנים. אתם באמצע סיור בנכס, בפגישה עם לקוח או בשיחה אחרת, והקו ממשיך לצלצל. ובערב, בשבת או בחג, אף אחד לא עונה בכלל.

עם PermanenceAI, סוכנת קולית AI עונה לשיחות שלכם 24/7. היא מציגה את עצמה כ-AI כבר בתחילת השיחה, מסננת את הפנייה, קובעת פגישות ישר ביומן (Google Calendar או Outlook, דרך Cal.com או Calendly) ושולחת לכם סיכום של כל שיחה; ההקלטה והתמלול מחכים לכם בהיסטוריית השיחות. כשצריך בן אדם, היא מעבירה את השיחה לצוות לפי הכללים שלכם. ומי שמתקשר בערבית, ברוסית או באנגלית מקבל מענה בשפה שלו.

המספר נשאר שלכם, בעזרת הפניית שיחות. מסלול מענה טלפוני מתחיל ב-$99 לחודש, לא כולל מע״מ, עם 350 דקות בחודש, בלי דמי הקמה ובלי התחייבות.

להשוואת המסלולים: https://www.permanenceia.com/he/tarifs?utm_source=linkedin&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=A

#מענהטלפוני #בינהמלאכותית #ניהולנכסים #עסקיםקטנים #שירותלקוחות
```

### Traduction française

**Facebook**
> Après les fêtes, le téléphone se remet à sonner. Et qui répond quand vous êtes en pleine visite d'un bien, en rendez-vous ou sur un autre appel ? 📞
> Avec PermanenceAI, une agente IA répond à vos appels 24 h/24, 7 j/7. Elle dit dès le début qu'elle est une IA, cerne ce dont l'appelant a besoin, fixe le rendez-vous directement dans l'agenda et vous envoie un résumé de chaque appel. Et votre numéro reste le vôtre, grâce au renvoi d'appel.
> Forfaits dès 99 $ par mois, HT. Sans frais de mise en service, sans engagement.
> Tous les forfaits 👈 [lien]
> #standardtéléphonique #intelligenceartificielle

**LinkedIn**
> Après les fêtes, les entreprises reprennent leur rythme et le téléphone se remet à sonner. Chaque appel manqué, c'est un client qui risque d'appeler un concurrent.
> Ce n'est pas que vous êtes mal organisé. Vous êtes en pleine visite d'un bien, en rendez-vous client ou sur un autre appel, et la ligne continue de sonner. Et le soir, le shabbat ou les jours de fête, personne ne répond du tout.
> Avec PermanenceAI, une agente vocale IA répond à vos appels 24 h/24, 7 j/7. Elle se présente comme une IA dès le début de l'appel, qualifie la demande, fixe les rendez-vous directement dans l'agenda (Google Agenda ou Outlook, via Cal.com ou Calendly) et vous envoie un résumé de chaque appel ; l'enregistrement et la transcription vous attendent dans l'historique des appels. Quand il faut un humain, elle transfère l'appel à l'équipe selon vos règles. Et ceux qui appellent en arabe, en russe ou en anglais sont servis dans leur langue.
> Votre numéro reste le vôtre, grâce au renvoi d'appel. Le forfait Réceptionniste (« מענה טלפוני ») démarre à 99 $ par mois HT, avec 350 minutes par mois, sans frais de mise en service et sans engagement.
> Comparer les forfaits : [lien]
> #standardtéléphonique #intelligenceartificielle #gestionimmobilière #petitesentreprises #serviceclient

---

## he-B : « חייגו 03-382-7709. סוכנת AI עונה. » (Composez le 03-382-7709. Une agente IA répond.)

- **Date :** dimanche 18/10/2026. LinkedIn à 09:00, Facebook à 12:30, heure d'Israël. À Paris : 08:00 et 11:30.
- **Visuels :**
  - `he-B-carre.png` (1080×1080) ;
  - `he-B-linkedin.png` (1200×627).
  - Portraits : נועה (Noa) et דניאל (Daniel), les deux voix hébraïques de la démo (`src/data/personas.ts`). Ce sont des illustrations générées, pas des personnes réelles.
- **Texte sur le visuel :**
  - Titre (5 mots, la variante forte du brief, sans le point après le numéro pour éviter un « .03 » à gauche) : « חייגו 03-382-7709 / *סוכנת AI עונה.* » ;
  - Pastille : « הדגמה חיה בחינם » (Démo gratuite en direct) ;
  - Sous-titre : « או דברו איתה בדפדפן: בחינם, בלי הרשמה. » (Ou parlez-lui dans votre navigateur : gratuit, sans inscription.) ;
  - Bouton : « דברו עם נועה » (Parlez à Noa ; libellé du bouton de la démo sur le site, `liveDemo.browserCta`) ;
  - Légende : « קול AI נשי או גברי · יותר מ-80 שפות » (Voix IA féminine ou masculine · plus de 80 langues) ;
  - Puces : עברית, English, Français, Italiano, Polski, Nederlands (les langues de la démo).
- **Liens :**
  - Facebook : https://www.permanenceia.com/he/demo?utm_source=facebook&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=B
  - LinkedIn : https://www.permanenceia.com/he/demo?utm_source=linkedin&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=B

### Facebook (55 mots, sans le lien ni les hashtags)

```
אל תאמינו לנו על המילה. חייגו 03-382-7709 📞

נועה, סוכנת ה-AI שלנו, עונה בעברית 24/7 ואומרת לכם כבר בהתחלה שהיא AI. שאלו אותה על המסלולים, על תקופת הניסיון או איך זה עובד, ותשמעו בעצמכם איך סוכנת AI מנהלת שיחה אמיתית.

מעדיפים לא להתקשר? דברו עם נועה או עם דניאל ישירות בדפדפן: בחינם, בלי הרשמה.

להדגמה החיה 👈 https://www.permanenceia.com/he/demo?utm_source=facebook&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=B

#מענהטלפוני #בינהמלאכותית
```

### LinkedIn (127 mots, sans le lien ni les hashtags)

```
הדרך הכי מהירה להתרשם ממענה טלפוני AI? פשוט להתקשר.

חייגו 03-382-7709 (מחו״ל: ‎+972 3-382-7709). נועה, סוכנת ה-AI שלנו, עונה 24/7 ומציגה את עצמה כ-AI כבר בתחילת השיחה. שאלו אותה על המסלולים או על ההגדרה, קטעו אותה באמצע משפט, שנו כיוון, ותחליטו בעצמכם.

מעדיפים לא להרים טלפון? ההדגמה החיה באתר עובדת בדפדפן, בחינם ובלי הרשמה. בוחרים את התפקיד של הסוכן (מענה וקבלה, מכירות או תמיכה), את התחום שלכם ואת הקול (נועה או דניאל), ומתחילים לדבר כמו לקוחות, בדיבור או בכתב. ובימים א׳–ה׳, בשעות הפעילות, אפשר גם לבקש שהסוכן יתקשר אליכם.

כשהסוכן מוגדר לעסק שלכם, הוא מזהה את השפה של כל מתקשר ועונה בה (יותר מ-80 שפות), קובע פגישות ושולח לכם סיכום של כל שיחה. כשצריך בן אדם, הוא מעביר את השיחה לצוות שלכם לפי הכללים שקבעתם.

שמעו בעצמכם: https://www.permanenceia.com/he/demo?utm_source=linkedin&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=B

#מענהטלפוני #בינהמלאכותית #חוויתלקוח #עסקיםקטנים
```

### Traduction française

**Facebook**
> Ne nous croyez pas sur parole. Composez le 03-382-7709 📞
> Noa, notre agente IA, répond en hébreu 24 h/24 et vous dit dès le début qu'elle est une IA. Posez-lui vos questions sur les forfaits, l'essai gratuit ou le fonctionnement, et entendez par vous-même comment une agente IA mène un vrai appel.
> Vous préférez ne pas appeler ? Parlez à Noa ou à Daniel directement dans votre navigateur : gratuit, sans inscription.
> Vers la démo en direct 👈 [lien]
> #standardtéléphonique #intelligenceartificielle

**LinkedIn**
> Le moyen le plus rapide de se faire une idée d'un standard téléphonique IA ? Appeler, tout simplement.
> Composez le 03-382-7709 (depuis l'étranger : +972 3-382-7709). Noa, notre agente IA, répond 24 h/24 et se présente comme une IA dès le début de l'appel. Interrogez-la sur les forfaits ou la mise en place, coupez-la en pleine phrase, changez de sujet, et décidez par vous-même.
> Vous préférez ne pas décrocher votre téléphone ? La démo en direct du site fonctionne dans le navigateur, gratuitement et sans inscription. On choisit le rôle de l'agent (accueil, commercial ou support), son secteur et la voix (Noa ou Daniel), puis on se met à parler comme un client, à voix haute ou par écrit. Et du dimanche au jeudi, aux heures d'ouverture, on peut aussi demander à l'agent de vous appeler.
> Une fois configuré pour votre entreprise, l'agent détecte la langue de chaque appelant et lui répond dans cette langue (plus de 80 langues), prend les rendez-vous et vous envoie un résumé de chaque appel. Quand il faut un humain, il transfère l'appel à votre équipe selon les règles que vous avez fixées.
> Écoutez par vous-même : [lien]
> #standardtéléphonique #intelligenceartificielle #expérienceclient #petitesentreprises

---

## he-C : « סוכן AI משלכם, בחינם – מוכן תוך דקות » (Votre agent IA gratuit, prêt en quelques minutes)

- **Date :** dimanche 25/10/2026. LinkedIn à 09:00, Facebook à 12:30, heure d'Israël (IST, après le changement d'heure de la nuit). À Paris : 08:00 et 11:30.
- **Visuels :**
  - `he-C-carre.png` (1080×1080, fond clair) ;
  - `he-C-linkedin.png` (1200×627).
- **Texte sur le visuel :**
  - Mention du haut : « סוכן קולי AI » (Agent vocal IA, au masculin comme le titre) ;
  - Titre (7 mots, celui du brief ; le début reprend le titre du pop-up trialNudge) : « סוכן AI משלכם, בחינם – *מוכן תוך דקות* » ;
  - Pastille : « 30 דקות מתנה » (30 minutes offertes ; sous-titre du pop-up trialNudge) ;
  - Sous-titre : « בתום 14 הימים המסלול שבחרתם מתחיל, אלא אם ביטלתם. » (À la fin des 14 jours, le forfait choisi démarre, sauf si vous avez annulé.) ;
  - Bouton : « התחילו בחינם » (`ctas.primary`) ;
  - Chiffres : « 14 ימי ניסיון חינם » et « 30 דקות שיחה כלולות » ;
  - Points : « נדרש כרטיס אשראי, ללא חיוב בתקופת הניסיון » (carte demandée, rien n'est débité pendant l'essai ; texte du site) · « ללא התחייבות, ביטול ללא עלות » (sans engagement, annulation sans frais) · « שומרים על המספר שלכם » (vous gardez votre numéro).
- **Liens :**
  - Facebook : https://www.permanenceia.com/he/essai-gratuit?utm_source=facebook&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=C
  - LinkedIn : https://www.permanenceia.com/he/essai-gratuit?utm_source=linkedin&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=C

### Facebook (60 mots, sans le lien ni les hashtags)

```
סוכן AI משלכם, בחינם, עם 30 דקות מתנה 🎁

נסו את PermanenceAI במשך 14 יום על המסלול שתבחרו, עם 30 דקות שיחה כלולות. סוכן ראשון מוכן תוך דקות, והמספר נשאר שלכם.

נדרש כרטיס אשראי בהפעלה, אבל אין שום חיוב בתקופת הניסיון. ללא התחייבות: מבטלים לפני סוף התקופה ולא משלמים כלום. אם לא ביטלתם, המסלול שבחרתם מתחיל בתום 14 הימים.

התחילו בחינם 👈 https://www.permanenceia.com/he/essai-gratuit?utm_source=facebook&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=C

#מענהטלפוני #בינהמלאכותית
```

### LinkedIn (133 mots, sans le lien ni les hashtags)

```
סוכן AI משלכם, מוכן תוך דקות. ו-30 הדקות הראשונות עלינו.

ככה בדיוק עובדת תקופת הניסיון של PermanenceAI:
• 14 יום על המסלול שתבחרו, עם 30 דקות שיחה כלולות (כשהן נגמרות, השיחות נעצרות עד סוף התקופה או עד שמפעילים את המנוי)
• נדרש כרטיס אשראי בהפעלה, אבל אין שום חיוב בתקופת הניסיון
• ללא התחייבות וללא דמי הקמה: מבטלים מאזור הלקוח לפני סוף התקופה ולא משלמים כלום (7 ימים לפני הסוף נשלחת אליכם תזכורת במייל)
• אם לא ביטלתם, המסלול שבחרתם מתחיל בתום 14 הימים

שומרים על המספר הקיים: הפניית שיחות, חיבור SIP או ייבוא מ-Twilio או מ-Telnyx. סוכן ראשון מוכן תוך כמה דקות; להגדרה מלאה, עם יומן, מספרים והעברות שיחה, כדאי לתכנן יום־יומיים ברוב המקרים, בליווי שלנו.

מרגע שהוא פעיל, הסוכן עונה 24/7, מציג את עצמו כ-AI, קובע פגישות ושולח לכם סיכום של כל שיחה.

התחילו בחינם: https://www.permanenceia.com/he/essai-gratuit?utm_source=linkedin&utm_medium=social&utm_campaign=posts-oct-2026&utm_content=C

#מענהטלפוני #בינהמלאכותית #עסקיםקטנים #שירותלקוחות
```

### Traduction française

**Facebook**
> Votre agent IA gratuit, avec 30 minutes offertes 🎁
> Essayez PermanenceAI pendant 14 jours sur le forfait de votre choix, avec 30 minutes d'appels incluses. Un premier agent est prêt en quelques minutes, et votre numéro reste le vôtre.
> Une carte bancaire est demandée à l'activation, mais rien n'est débité pendant l'essai. Sans engagement : vous annulez avant la fin de l'essai et vous ne payez rien. Si vous n'annulez pas, le forfait choisi démarre à la fin des 14 jours.
> Démarrer gratuitement 👈 [lien]
> #standardtéléphonique #intelligenceartificielle

**LinkedIn**
> Votre agent IA, prêt en quelques minutes. Et les 30 premières minutes sont pour nous.
> Voici exactement comment fonctionne l'essai de PermanenceAI :
> • 14 jours sur le forfait de votre choix, avec 30 minutes d'appels incluses (une fois ces minutes épuisées, les appels s'arrêtent jusqu'à la fin de l'essai ou jusqu'à l'activation de l'abonnement)
> • une carte bancaire est demandée à l'activation, mais rien n'est débité pendant l'essai
> • sans engagement ni frais de mise en service : vous annulez depuis l'espace client avant la fin de l'essai et vous ne payez rien (un e-mail de rappel vous est envoyé 7 jours avant la fin)
> • si vous n'annulez pas, le forfait choisi démarre à la fin des 14 jours
> Vous gardez votre numéro actuel : renvoi d'appel, connexion SIP ou import depuis Twilio ou Telnyx. Un premier agent est prêt en quelques minutes ; pour la configuration complète, avec agenda, numéros et transferts d'appel, comptez un à deux jours dans la plupart des cas, avec notre accompagnement.
> Une fois en service, l'agent répond 24 h/24, se présente comme une IA, prend les rendez-vous et vous envoie un résumé de chaque appel.
> Démarrer gratuitement : [lien]
> #standardtéléphonique #intelligenceartificielle #petitesentreprises #serviceclient

---

## Contrôle avant validation (partie 7 du brief)

| Point | A | B | C |
|---|---|---|---|
| Chaque chiffre vient du site (`markets.ts`, `offers.ts`, `faq.ts`, `callHours.ts`, `components.ts`) | 99 $ HT, 350 min/mois, 24/7 | 03-382-7709, 24/7, plus de 80 langues, dim.–jeu. | 14 j, 30 min, rappel 7 jours avant, 1 à 2 jours de configuration |
| Mention IA dans le texte et sur l'image | oui | oui | oui |
| Aucun secteur santé (`PAUSED_SECTORS`), aucune promesse de conformité | oui (gestion locative) | oui | oui |
| URL de la bonne langue, UTM compris (`src/pages/tarifs.tsx`, `demo.tsx`, `essai-gratuit.tsx` ; `he` dans `locales.ts` ; réponse 200 et `<html lang="he" dir="rtl">` le 09/10) | `/he/tarifs` | `/he/demo` | `/he/essai-gratuit` |
| Titre du visuel de 8 mots au plus | 5 | 5 | 7 |
| Essai : « carte demandée, rien n'est débité » et démarrage du forfait à la fin | sans objet | sans objet | oui (texte et image) |
| Pas de « rappel automatique » sans le forfait Assistant | aucun | aucun | aucun |
| Aucune promesse de résultat chiffré | oui | oui | oui |
| Ancien numéro 02-376-7085 (encore dans le guide `.docx`) | absent | absent | absent |
| Longueur Facebook (40 à 90 mots) / LinkedIn (120 à 200 mots) | 64 / 135 | 55 / 127 | 60 / 133 |
| Émojis Facebook (2 au plus) / hashtags | 2 / 2 et 5 | 2 / 2 et 4 | 2 / 2 et 4 |

L'hébreu colle les petits mots au mot suivant (ו, ב, ל, ה, ש) : à contenu égal, il compte environ un quart de mots de moins que le français. Les textes LinkedIn font donc 127 à 135 mots en hébreu, mais nettement plus dans leur traduction française.

## Relecture du 09/10/2026 : corrections faites

**Faits**
- A, LinkedIn : « ושולח לכם סיכום, תמלול והקלטה של כל שיחה » laissait croire que l'enregistrement et la transcription sont envoyés. Le site dit seulement que le résumé est envoyé ; enregistrement et transcription sont dans l'historique des appels (`offers.ts`, `help.ts`). Corrigé : « ושולחת לכם סיכום של כל שיחה; ההקלטה והתמלול מחכים לכם בהיסטוריית השיחות ».
- A, LinkedIn : « (350 דקות) » précisé en « עם 350 דקות בחודש » (minutes mensuelles, `markets.ts`).
- A, Facebook : « עם הפניית שיחות פשוטה » devient « בעזרת הפניית שיחות » : la FAQ précise que l'opérateur du client peut facturer le renvoi vers un numéro à l'étranger, « simple » promettait trop.
- C, LinkedIn : quand les 30 minutes sont épuisées, les appels s'arrêtent « jusqu'à la fin de l'essai **ou jusqu'à l'activation de l'abonnement** » (FAQ he, ligne 46) ; la seconde moitié manquait.
- C, LinkedIn : « לוקחת בדרך כלל יום־יומיים » remplacé par la formule exacte de la FAQ « כדאי לתכנן יום־יומיים ברוב המקרים ».

**Langue**
- A, LinkedIn : « זה לא עניין של סדר וארגון » (calque du français) devient « זה לא שאתם לא מאורגנים ». « ובערב… הוא פשוט נשאר בלי מענה » devient « אף אחד לא עונה בכלל ».
- A : « עונה לקו שלכם » (peu idiomatique) devient « עונה לשיחות שלכם » ; « כבר על הקו » devient « בשיחה אחרת » ; « בסיור בנכס » devient « באמצע סיור בנכס ».
- A, LinkedIn : l'agent passe au féminin (« סוכנת קולית AI… היא מציגה… מסננת… קובעת… שולחת… מעבירה ») pour coller au visuel A, qui dit « סוכנת AI » et « סוכנת קולית AI ».
- B, LinkedIn : « לשפוט מענה טלפוני AI » (calque de « juger ») devient « להתרשם ממענה טלפוני AI » ; « ותשפטו בעצמכם » devient « ותחליטו בעצמכם » ; la phrase sur la démo répétait « בוחרים » et « תפקיד » : réécrite ; « בימים ראשון עד חמישי… הסוכן יכול גם להתקשר » devient « ובימים א׳–ה׳… אפשר גם לבקש שהסוכן יתקשר אליכם » ; « אחרי שהוא מוגדר » devient « כשהסוכן מוגדר ».
- B, Facebook : « עונה 24/7 בעברית » devient « עונה בעברית 24/7 » (ordre plus naturel).
- C, Facebook et LinkedIn : « לפני הסוף » devient « לפני סוף התקופה ».

**Visuels (régénérés et revérifiés)**
- B : la légende « קולות AI, נשי וגברי » n'était pas correcte (pluriel « קולות » avec des adjectifs au singulier). Devient « קול AI נשי או גברי · יותר מ-80 שפות ».
- C : la mention du haut « סוכנת קולית AI » (féminin) contredisait le titre « סוכן AI משלכם » (masculin) sur la même image. Devient « סוכן קולי AI » (`"ai"` dans `visuels.json`).
- A : rien à corriger (texte lisible, rien de coupé, flèche du bouton orientée vers la gauche comme il faut en hébreu).

## Points à trancher

- **Où publier :**
  - LinkedIn : la page entreprise n'existe pas encore, il faut la créer d'abord.
  - Facebook : la page est en anglais et partagée par les 7 langues. Un post en hébreu y sera vu par tous les abonnés, sauf si la diffusion est restreinte à Israël ou à l'hébreu dans Meta Business Suite (à vérifier), ou si le post est boosté en Israël (payant).
- **Post A :** la scène (« 18:40 », « אתם כבר בשיחה אחרת », « סיור בדירה נקבע ביומן ») est un exemple, pas un vrai client. La photo vise la gestion locative ; les textes restent valables pour toute petite entreprise.
- **Post B :** il met en avant la ligne publique israélienne 03-382-7709 (Noa répond 24/7), la variante forte du brief. Le seul lien du post renvoie vers `/he/demo`. La pastille « הדגמה חיה בחינם » parle de la démo ; l'appel vers un numéro fixe israélien reste facturé selon l'opérateur de l'appelant (souvent inclus dans les forfaits mobiles).
- **Prix :** comme sur le site, les prix sont en dollars US hors taxes (« $99 … לא כולל מע״מ ») ; aucun prix en shekels n'est affiché. Le site affiche « 99 $ » (format he-IL) dans les tableaux et « $99 » dans les textes : les posts suivent les textes.
- **Espace client :** la FAQ du site précise qu'il est en anglais (assistante d'aide en hébreu), tout comme les e-mails automatiques, y compris le rappel de fin d'essai cité dans le post C. Rien à changer dans les posts, mais c'est la première chose que verra un prospect israélien après l'inscription.
- **Ancien numéro :** 02-376-7085 figure encore dans `Guide-creations-PermanenceAI.docx` (textes hébreux) ; à corriger dans ce guide.

# Carte des mots-clés — version française (France, Belgique, Suisse, Québec)

Terme principal du site : **standard téléphonique IA**. Termes voisins répartis par page pour éviter que deux pages visent la même requête : « agent vocal IA », « réceptionniste virtuelle », « secrétariat téléphonique », « permanence téléphonique », « répondeur intelligent », « prise de rendez-vous par téléphone ». « TPE et PME » couvre à la fois la France (TPE) et la Belgique, la Suisse et le Québec (PME).

Règles appliquées : mot-clé principal dans le titre meta (≤ 60 caractères avec ` · Permanence IA`), dans la description meta (≤ 155 caractères, bénéfice + appel à l’action), dans le H1 ou l’intro, et une fois dans le corps de page quand ça se lit naturellement. Les secondaires vont dans les intros, sous-titres et réponses de FAQ. Les chiffres (jours, minutes, prix) et la marque viennent toujours des paramètres des fonctions.

Fichiers : `src/i18n/content/fr/ui/commerce.ts` (C), `ui/pages.ts` (P), `sectors.ts` (S), `modules.ts` (M), `faq.ts` (F).

Titres et descriptions par secteur et par module : `SECTOR_SEO` et `MODULE_SEO_TITLE` en tête de `commerce.ts`, retrouvés à partir du `name` affiché (signatures inchangées). Si un `name` change dans `sectors.ts` ou `modules.ts`, mettez la clé à jour, sinon la page retombe sur le titre générique.

## Pages principales

| Page | Principal | Secondaires | Où c’est intégré |
|---|---|---|---|
| Accueil `/` | standard téléphonique IA | agent vocal IA, réceptionniste virtuelle, répondeur intelligent, permanence téléphonique | C `home.meta.title`, `meta.description`, `hero.intro` (le H1 reste le message de marque), `pricing.intro` (corps) ; secondaires dans `benefits.intro`, `platform.intro`, `useCases.intro` |
| Tarifs `/tarifs` | tarif standard téléphonique IA | prix agent vocal IA, forfait sans engagement, prix HT | C `tarifs.meta.title`, `meta.description` (ligne de forfait raccourcie à « nom + prix »), `hero.intro`, `faq.intro` |
| Offres `/offres/*` | réceptionniste IA / assistant IA / centre d’appels IA (nom du forfait + « IA ») ; essai : agent vocal IA gratuit | standard IA sur mesure, sans engagement | C `offer.metaTitle`, `offer.metaTitleTrial`, `offer.metaDescription` (H1 = `offers.ts`, non modifié) |
| Recharges `/offres/recharges` | recharge minutes agent vocal IA | minutes supplémentaires | C `recharges.meta.title`, `meta.description` |
| Essai gratuit `/essai-gratuit` | essai gratuit agent vocal IA | standard téléphonique IA gratuit, sans engagement | P `trial.meta.title`, `meta.description`, `trial.intro` |
| Démo `/demo` | démo agent vocal IA | essayer une réceptionniste virtuelle, appel de démonstration | P `demo.meta.title`, `meta.description`, `h1`, `hearIntro` |
| Fonctionnalités `/fonctionnalites` | fonctionnalités agent vocal IA | réceptionniste virtuelle, prise de rendez-vous, flow builder | C `featuresIndex.meta.title`, `meta.description`, `hero.intro` |
| Secteurs `/secteurs` | secrétariat téléphonique IA | permanence téléphonique artisan, secrétariat dentaire, accueil agence immobilière | C `sectorsIndex.meta.title`, `meta.description`, `hero.title` (H1), `hero.intro` |
| Intégrations `/integrations` | intégrations agent vocal IA | agent vocal IA Google Agenda / HubSpot, automatisation sans code, SIP | C `integrations.meta.title`, `meta.description`, `hero.intro` |
| FAQ `/faq` | FAQ standard téléphonique IA | agent vocal IA, répondeur, secrétariat téléphonique, prise de rendez-vous par téléphone | P `faq.meta.title`, `meta.description`, `h1` ; F 1re question + réponse, question « répondeur ou standard classique », réponse calendrier |
| Contact `/contact` | contact standard téléphonique IA | être rappelé, devis sur mesure | P `contact.meta.title`, `meta.description` |
| À propos `/about` | agents vocaux IA pour TPE et PME | répondre à chaque appel | P `about.meta.title`, `meta.description` |
| Sécurité `/securite` | agent vocal IA RGPD | consentement, rétention, chiffrement | P `security.meta.title`, `meta.description` |
| Blog `/blog` | accueil téléphonique | prise de rendez-vous, agents vocaux IA | P `blog.meta.title` (dépassait 60 caractères), `meta.description` (sans « études de cas » non prouvées) |
| Aide, CGU, confidentialité, mentions légales, cookies | — (nom de page + marque) | — | inchangés ; textes juridiques non touchés |

## Pages secteurs `/secteurs/*`

| Secteur | Principal | Secondaires | Où c’est intégré |
|---|---|---|---|
| Services à domicile | permanence téléphonique artisan | permanence téléphonique plombier, électricien, chauffagiste, urgences hors horaires | C `SECTOR_SEO` (title + description) ; S `subtitle`, FAQ « urgences » (plombier, chauffage) |
| Dentaire et cliniques | secrétariat dentaire | secrétariat médical, prise de rendez-vous cabinet dentaire, nouveaux patients | C `SECTOR_SEO` ; S `subtitle`, FAQ « plusieurs praticiens » |
| Immobilier | accueil téléphonique agence immobilière | qualification acheteurs / vendeurs / locataires, gestion locative, visites | C `SECTOR_SEO` ; S `subtitle` |
| Garages et automobile | standard téléphonique garage | prise de rendez-vous garage, rendez-vous atelier, relance de devis | C `SECTOR_SEO` ; S `subtitle`, FAQ « diagnostic » |
| Kinés et paramédical (`kines-paramedical`) | secrétariat kiné | secrétariat téléphonique ostéopathe, secrétariat paramédical, prise de rendez-vous kinésithérapeute, maison de santé | C `SECTOR_SEO` ; S `subtitle`, FAQ « logiciel de rendez-vous » |
| Cliniques vétérinaires (`cliniques-veterinaires`) | standard téléphonique vétérinaire | accueil clinique vétérinaire, urgence vétérinaire, rappel de vaccins, ASV | C `SECTOR_SEO` ; S `subtitle`, FAQ « rappels de vaccins », « nuit et week-end » |
| Salons de coiffure et barbiers (`salons-de-coiffure`) | prise de rendez-vous coiffeur | prise de RDV salon de coiffure, barbier, barber shop, rendez-vous non honorés | C `SECTOR_SEO` ; S `subtitle`, FAQ « durée », « sans rendez-vous » |
| Beauté et bien-être | prise de rendez-vous institut de beauté | prise de RDV spa, onglerie, esthéticienne, réservation WhatsApp | C `SECTOR_SEO` ; S `subtitle`. Ne vise plus la coiffure (page dédiée ci-dessus) |
| Restaurants et hôtellerie | réservation restaurant par téléphone | réservation hôtel, liste d’attente, accueil multilingue | C `SECTOR_SEO` ; S `subtitle`, FAQ « disponibilités » |
| Avocats et experts-comptables (`avocats-experts-comptables`) | permanence téléphonique avocat | secrétariat juridique, accueil téléphonique cabinet d’expertise comptable, filtrage des appels, premier rendez-vous | C `SECTOR_SEO` ; S `subtitle`, FAQ « confidentialité », « relance des clients » |

Le H1 de chaque secteur (`title`) reste le message métier ; le mot-clé principal est dans le sous-titre affiché juste en dessous.

Partage coiffure / beauté : `salons-de-coiffure` couvre coiffeurs, barbiers et coloristes ; `beaute-bien-etre` couvre instituts, spas, esthétique, ongles, cils, épilation et massages. Les deux pages ne visent pas la même requête. Le titre des bénéfices nomme le lieu du métier (`SECTOR_PLACE` dans `commerce.ts`).

## Pages fonctionnalités `/fonctionnalites/*`

| Module | Principal (titre meta) | Où c’est intégré (en plus du titre) |
|---|---|---|
| Réceptionniste IA | réceptionniste virtuelle | M `short` (→ description meta), `intro` |
| Démo live | démo agent vocal IA | M `short`, `intro` |
| Prise de rendez-vous | prise de rendez-vous téléphonique | M `short`, `intro` |
| Support client | service client téléphonique IA | M `short`, `intro` |
| Qualification des leads | qualification de leads par téléphone | M `short`, `intro` |
| Campagnes sortantes | appels sortants automatisés | M `short`, `intro` |
| WhatsApp et messages | messages WhatsApp et SMS automatisés | M `short` (déjà présent) |
| Base de connaissances | base de connaissances agent vocal IA | M `intro` |
| Éditeur de prompts | prompt agent vocal | M `short`, `intro` |
| Flow builder | automatisation sans code | M `short`, `intro` |
| SIP et numéros | trunk SIP, renvoi d’appel | M `short`, `intro` |
| Reporting | statistiques d’appels | M `short`, `intro` |
| Widget web | widget d’appel pour site web | M `short`, `intro` |

Description meta des modules : `short` + forfait minimum + « essai gratuit N jours : testez-le ». Les textes `short` servent aussi aux cartes et au menu : ils restent courts (≤ 82 caractères).

## Vérification

`npx tsc --noEmit -p .` passe. Toutes les pages FR du serveur de dev (accueil, tarifs, 5 offres, recharges, 11 pages secteurs (index + 10), 14 pages fonctionnalités, intégrations, démo, contact, FAQ, essai, aide, à propos, sécurité, pages légales) : titres de 32 à 60 caractères, descriptions de 55 à 155 caractères.

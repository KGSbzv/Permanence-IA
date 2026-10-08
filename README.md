# Permanence IA — site public de l'agent vocal IA

Site marketing et d'inscription de **Permanence IA** (marque **PermanenceAI** hors France) : un agent vocal IA qui répond au téléphone 24 h/24, prend les rendez-vous, rappelle les prospects et envoie un résumé de chaque appel. Les agents, l'espace client et la facturation des clients tournent sur la plateforme **Autocalls en marque blanche** (`app.permanenceia.com`) ; ce dépôt contient le site `permanenceia.com` et ses routes API.

---

## Offre (source : `src/i18n/markets.ts`)

| Forfait | Prix HT / mois | Minutes incluses | Minute supplémentaire |
|---|---|---|---|
| Réceptionniste | 99 $ | 350 | 0,39 $ |
| Assistant | 249 $ | 1 000 | 0,36 $ |
| Centre d'appels | 499 $ | 2 300 | 0,32 $ |
| Sur mesure | sur devis | dès 2 500 | — |

- Prix en dollars US, hors taxes ; facturation annuelle = 2 mois offerts.
- **Essai gratuit : 14 jours, 30 minutes**, géré par la plateforme à la première souscription.
- Paiement à l'usage sans abonnement : 0,39 $ la minute.
- Numéro dédié en option, dès 3,99 $ HT par mois selon le pays (jamais inclus dans le forfait).

Les chiffres affichés sur le site viennent tous de `src/i18n/markets.ts` (un marché par langue, prix séparables par pays).

---

## Langues et préfixes

7 locales, chacune avec son marché (marque, numéro, horaires, devise de repère) :

| Locale | Préfixe | Marché |
|---|---|---|
| `fr` | aucun (`/`) | France |
| `en-gb` | `/en-gb` | Royaume-Uni |
| `en-au` | `/en-au` | Australie (variante de `en`, `src/i18n/content/en/au.ts`) |
| `it` | `/it` | Italie |
| `pl` | `/pl` | Pologne |
| `nl` | `/nl` | Pays-Bas |
| `he` | `/he` | Israël (RTL) |

Les textes sont dans `src/i18n/content/<langue>/` (le français fait référence pour les types) ; les bases de connaissances des agents dans `src/data/kb/`.

---

## Stack

- **Next.js 14** (Pages Router) + TypeScript + Tailwind CSS, icônes Lucide.
- **Hébergement : Firebase App Hosting** (`apphosting.yaml`, secrets dans Secret Manager). Un push sur `main` déclenche le déploiement (environ 6 minutes, un déploiement à la fois).
- **Supabase** (PostgreSQL) : demandes de rappel, événements d'appel, contacts et relances (`supabase/schema.sql`, `supabase/migrations/`).
- **Autocalls (marque blanche)** : agents vocaux, WhatsApp, widget, espace client, forfaits.
- **Stripe** : abonnements et paiements des clients (via l'espace client).
- **E-mails** : nodemailer (SMTP), pied de page avec préférences et désinscription.

---

## Routes API (`src/pages/api/`)

| Route | Rôle |
|---|---|
| `callback/` | Demande de rappel du site (création, plafonds) |
| `callback/check` | Contrôle d'une demande juste avant l'appel par l'automatisation Autocalls |
| `contact` | Collecte légère avant l'inscription (langue, page d'origine, UTM, case marketing) |
| `agent/now` | Outil des agents : date et heure actuelles |
| `agent/optout` | Outil des agents : « ne plus appeler » (annule les rappels en attente) |
| `agent/account` | Outil des agents : dossier client après vérification par code |
| `webhooks/autocalls` | Fin d'appel et fin de conversation Autocalls |
| `webhooks/signup` | Inscription d'un nouveau client dans l'espace white-label |
| `webhooks/stripe` | Webhook Stripe signé (relances) |
| `cron/relances` | Moteur des relances commerciales (coupé et en mode test par défaut) |
| `email/preferences`, `email/unsubscribe` | Préférences e-mail et désinscription en un clic |
| `fx` | Taux de change indicatifs USD → devise locale |

---

## Démarrage

Prérequis : Node.js 18.17+ ou 20+.

```bash
npm install
npm run dev          # http://localhost:3000
npx tsc --noEmit -p .  # vérification des types, obligatoire avant un push
npm run build && npm run start
```

---

## Arborescence utile

```text
src/
├── components/   # Layout, Navbar, Footer, blocs de page, démo en direct, formulaires
├── data/         # site.ts (constantes), kb/ (bases de connaissances des agents)
├── i18n/         # locales, marchés (markets.ts), contenus par langue
├── lib/          # serveur : Supabase, e-mails, opposition, relances
├── pages/        # pages publiques, secteurs, fonctionnalités, tarifs, aide, pages légales, API
└── middleware.ts # choix de la langue
docs/             # documentation d'exploitation (Autocalls, relances, audits, présentations)
supabase/         # schéma et migrations
scripts/          # aperçus et tests (relances, horaires d'appel, e-mails)
```

Le dossier `permanenceia-md/` contient les spécifications de septembre 2026 ; ses rapports `RAPPORT-VALIDATION.md` et `RAPPORT-AUDIT.md` sont **obsolètes**.

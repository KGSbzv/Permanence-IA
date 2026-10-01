# Permanence IA — Plateforme d'Agents IA Spécialisés

> L'accueil téléphonique, la qualification commerciale et le support 24h/24 par une équipe d'agents IA spécialisés, sans standardiste et sans numéro public.

---

## 🎯 Vision & Positionnement

**Permanence IA** transforme l'accueil et la relation client des TPE, PME et professions libérales (santé, dentaire, immobilier, artisans du bâtiment, cliniques, etc.) grâce à une équipe d'agents IA vocaux et omnicanaux.

### Les 3 Principes Fondateurs
1. **Règle Stricte « Zéro Numéro Public »** : Aucun numéro de téléphone surtaxé ou public n'est exposé. Les visiteurs demandent un rappel via le widget `CallbackModal` selon leurs disponibilités. Les agents IA rappellent proactivement.
2. **Architecture « Attract → Convert → Engage → Measure »** : Inspirée des plateformes d'orchestration modernes, notre suite couvre l'intégralité du cycle de vie du prospect jusqu'au client fidèle.
3. **Plan Gratuit Découverte (0 €)** : Accès immédiat au portail client et à la sandbox de configuration sans carte bancaire requise.

---

## 🤖 Le Catalogue des 10 Agents IA

| Agent | Rôle principal | Déclencheur / Canal |
|---|---|---|
| **Agent Capture** | Accueil web instantané, réception des demandes | Formulaire interactif / Widget |
| **Agent Commercial** | Rappel téléphonique intelligent, qualification des besoins | Appel sortant programmé |
| **Agent Support** | Résolution niveau 1, création et suivi de tickets | Appel & Webhooks CRM |
| **Agent Agenda** | Prise de rendez-vous synchronisée (Google, Doctolib, Outlook) | Vocal & SMS |
| **Agent Réputation** | Collecte d'avis certifiés Google et e-réputation | SMS post-prestation (validé) |
| **Agent Relance** | Réactivation de prospects et devis en attente | Campagnes sortantes contrôlées |
| **Agent Contenu** | Rédaction d'articles sectoriels et propositions d'emails | Back-office & Validation humaine |
| **Agent Données** | Synthèse des appels, statistiques d'attribution et KPI | Dashboard analytique |
| **Agent SEO Local** | Optimisation des fiches d'établissement et visibilité locale | Rapports périodiques |
| **Agent Personnalisé** | Workflows complexes sur mesure et intégrations métiers | API & Webhooks sur devis |

---

## 📂 Structure du Répertoire

```text
Permanence-IA/
├── design_handoff_permanence_ia_brand/  # Charte graphique complète, planche d'identité & symbol.svg
├── permanenceia-md/                     # 42 spécifications techniques et stratégiques + rapports QA
├── public/                              # Logos SVG (dark/light), favicon, portraits des agents IA
├── src/                                 # Application Next.js (Pages Router) en TypeScript
│   ├── components/                      # Navbar, Footer, Modal Callback universelle, DarkMode
│   │   └── Home/                        # Hero, Catalogue Agents, Process, Packages, Mockup Portail
│   ├── context/                         # Contextes React (Thème sombre, gestionnaire Callback)
│   ├── data/                            # Données dynamiques (articles de blog, etc.)
│   ├── pages/                           # Routes publiques, sectorielles (cliniques, plombiers...), tarifs, FAQ
│   │   └── api/                         # Endpoints API (callback, authentification, webhooks AutoCalls/Stripe)
│   └── styles/                          # Styles globaux Tailwind CSS
├── supabase/                            # Schéma PostgreSQL (tables leads, callbacks, users)
├── package.json                         # Dépendances et scripts de build Next.js 14
├── tailwind.config.js                   # Configuration Tailwind avec les tokens de la marque
└── tsconfig.json                        # Configuration TypeScript stricte
```

---

## 🛠️ Stack Technique

- **Framework** : [Next.js 14](https://nextjs.org/) (Pages Router)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Styles** : [Tailwind CSS](https://tailwindcss.com/)
- **Icônes** : [Lucide React](https://lucide.dev/)
- **Base de données** : [Supabase](https://supabase.com/) (PostgreSQL)
- **Voix & Téléphonie** : Intégration AutoCalls White-label & webhooks
- **Paiements** : Stripe Checkout & Portails d'abonnements

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18.17+ ou 20+
- npm ou pnpm

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/KGSbzv/Permanence-IA.git
cd Permanence-IA

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

### Build de Production

```bash
npm run build
npm run start
```

---

## 🎨 Identité Visuelle & Design Tokens

La marque s'appuie sur une esthétique sobre, institutionnelle et rassurante :
- **Bleu Pétrole** (`#0F3A48`) : Élégance, confiance et robustesse
- **Turquoise Actif** (`#2E9E98`) : Disponibilité et technologie
- **Encre Profonde** (`#0B1D24`) : Lisibilité maximale
- **Surfaces Claires** (`#FFFFFF`, `#F3F5F6`) : Clarté et respiration
- **Typographies** : *Manrope* (titres et UI) et *IBM Plex Mono* (données techniques, horaires et métriques).

---

## 📜 Documentation Complète

L'ensemble des spécifications d'ingénierie et des règles d'implémentation est consigné dans le dossier [`permanenceia-md/`](./permanenceia-md/) :
- `00-INDEX-ET-REGLES.md` : Index maître et gouvernance
- `08-zero-numero.md` : Protocole Zéro Numéro
- `21-VENDasta-INSPIRED-STRATEGY.md` : Stratégie de plateforme
- `25-PACKAGES-REVISES.md` : Grille des 6 forfaits
- `RAPPORT-VALIDATION.md` : Bilan de validation et conformité

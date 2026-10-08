> **OBSOLÈTE (30 sept. 2026)** — ce rapport décrit l'état du projet au 30 septembre 2026 et ne correspond plus au site actuel (offre, langues, architecture). Ne pas s'y fier ; voir le README et `docs/`.

# Rapport d'Audit de l'État Actuel (Permanence IA)

## 1. Structure Actuelle
Le projet est une application Next.js (Pages Router) avec TypeScript et Tailwind CSS.
Le dossier `src/pages` contient :
- `index.tsx` : page principale avec des sections classiques (Hero, Problème/Solution, Stats, Prix, Témoignages, CTA).
- Pages sectorielles : `cliniques.tsx`, `dentaire.tsx`, `immobilier.tsx`, `plombiers.tsx`.
- Autres pages : `tarifs.tsx`, `faq.tsx`, `about.tsx`, `blog`, `essai-gratuit.tsx`.
- API : `auth/signup`, `webhooks/autocalls`, `webhooks/stripe`.

## 2. Incohérences avec les Nouvelles Directives (Vendasta-Inspired)
- **Règle Zéro Numéro :** Le composant `CallDemoPlayer.tsx` et d'autres sections mettent probablement en avant des numéros de téléphone. Cela doit être remplacé par des formulaires de rappel (Agent Capture).
- **Positionnement "Équipe d'Agents IA" :** L'actuelle page d'accueil ne présente pas de "catalogue d'agents" ni le modèle "Attract, Convert, Engage, Measure".
- **Identité Visuelle :** La demande exige une identité avec des "réceptionnistes IA" et des cartes d'agents générées.
- **Portail Client :** Il faut mettre en avant l'espace de connexion (mockup portail) regroupant leads, rappels, et tickets.
- **Packages :** Le modèle de tarification (Gratuit sans carte, Essentiel, Croissance, Pro, Agence White-label, Sur mesure) doit remplacer l'actuel `PricingPreview`.

## 3. Plan d'Action Immédiat
1. **Mise à jour de `src/pages/index.tsx`** : Refonte complète de la page d'accueil pour inclure le Hero orienté résultats, la section d'Agents IA, le parcours (Attract/Convert/Engage/Measure), les secteurs, les nouveaux packages et la comparaison.
2. **Création des composants** : `AgentCatalogue.tsx`, `ArchitectureProcess.tsx`, `NewPricing.tsx`, `ClientPortalPreview.tsx`.
3. **Mise à jour de la navigation** : Inclure les boutons "Connexion", "Créer un compte", "Commencer gratuitement", "Demander une démonstration" et "Demander un rappel".

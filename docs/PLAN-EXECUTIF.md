# Plan exécutif — refonte complète Permanence IA

Sources : archives `etapes-1-et-2` (101→115), `documentation-design-contenu-complet-v2` (90→100),
`6-secteurs-landings-europe-v1` (80→89), 18 captures de référence (Autocalls, Vendasta),
capture de l'admin white-label Autocalls (pages et fonctions activables).

## Synthèse : ce que le site doit devenir

- **Positionnement** : plateforme d'agents vocaux IA qui répondent, qualifient, réservent et rappellent, 24/7.
- **Message d'essai unique, partout** : « 14 jours d'essai gratuit — 30 minutes incluses — prix HT — sans engagement ».
- **3 actions de conversion à chaque section** : démarrer l'essai, essayer l'agent en live, laisser son numéro.
- **Devise : dollars US (USD) sur tout le projet** (site et white-label Autocalls), décision du 5 octobre 2026.
- **Forfaits HT** : Découverte 0 $ (14 j, 30 min) · Réceptionniste 99 $ / 350 min (0,28 $/min) · Assistant 249 $ / 1 000 min (0,25 $/min) · Centre d’appels 499 $ / 2 300 min (0,22 $/min) · Sur mesure au-delà de 2 500 min régulières.
- **Recharges de crédit** (modèle Autocalls) : 39 $, 89 $, 159 $, 299 $, 725 $. Minute supplémentaire : 0,39 $ (Réceptionniste), 0,36 $ (Assistant), 0,32 $ (Centre d’appels), toujours plus chère que la minute incluse.
- **Seuils de bascule** (forfait supérieur moins cher que forfait + recharges) : ≈ 735 min vers Assistant, ≈ 1 690 min vers Centre d’appels.
- **Règles d’évolution** : dépassement ponctuel → recharge ; dépassements répétés → forfait supérieur ; recharges fréquentes → alerte « vous payez trop cher » ; au-delà de 2 500 min régulières → sur mesure.
- **À afficher partout** : 14 jours d’essai gratuit, 30 minutes incluses, prix HT, sans engagement, ajoutez des minutes à tout moment, passez à l’offre supérieure quand votre volume grandit.
- **Contenu des offres = ce que le client voit réellement dans son interface Autocalls** (pages et fonctions de la capture admin).
- **Plus d'offre agence white-label publique** (doc 98).
- **Garde-fous** : aucun chiffre, avis, certification ou compteur de places non vérifié ; l'argument 1,50 €/appel présenté comme hypothèse ; pas de numéro d'entreprise affiché.

## Arborescence cible (≈ 45 pages, générées depuis des fichiers de données)

| Type | Pages |
|---|---|
| Principales | Accueil, Tarifs, Démo live, Contact / rappel, Intégrations, Sécurité & conformité, FAQ, Secteurs, Blog |
| Forfaits | Découverte, Réceptionniste, Assistant, Centre d’appels, Sur mesure, Recharges minutes |
| Landings secteurs | Services à domicile, Dentaire & cliniques, Immobilier, Automobile, Beauté & bien-être, Restaurants & hôtellerie |
| Modules | Réceptionniste IA, Démo live, Rendez-vous, Support client, Qualification, Campagnes sortantes, WhatsApp & messages, Base de connaissances, Éditeur de prompts, Flow builder, SIP & numéros, Reporting, Widget web |
| Légal | Mentions légales, CGU/CGV, Confidentialité, Cookies |

Anciennes URL (`/plombiers`, `/dentaire`, `/cliniques`, `/immobilier`, `/essai-gratuit`) redirigées vers les nouvelles.

## Correspondance offres ↔ interface Autocalls

| Fonction interface (admin) | Découverte | Réceptionniste | Assistant | Centre d’appels | Sur mesure |
|---|:-:|:-:|:-:|:-:|:-:|
| Assistants, Historique des appels, Conversations | essai | ✓ | ✓ | ✓ | ✓ |
| Calendar integration, Web widget, Caller ID | aperçu | ✓ | ✓ | ✓ | ✓ |
| AI prompt editor | aperçu | simplifié | ✓ | ✓ | ✓ |
| Knowledgebase | aperçu | basique | ✓ | avancée | ✓ |
| Flow builder, Automation | — | — | ✓ | avancé | ✓ |
| SIP integration, Vos numéros | — | — | ✓ | ✓ | ✓ |
| Campaigns, Leads | — | — | ✓ | ✓ | ✓ |
| SMS, WhatsApp senders/templates, Channels, Messenger & Instagram | — | — | ✓ | ✓ | ✓ |
| Tools & MCP, API keys, webhooks | — | — | — | ✓ | ✓ |
| Rapports détaillés, rôles, multi-agents | — | — | — | ✓ | ✓ |
| Multi-sites, quotas, SLA | — | — | — | — | ✓ |

Cette matrice pilote à la fois la page Tarifs **et** la configuration des plans Autocalls (phase 5).

## Phases

### Phase 0 — Cadrage (ce document) ✅
Synthèse, arborescence, matrice, décisions à valider.

### Phase 1 — Fondations
- Design system : couleurs du nouveau logo, typographie, composants (boutons, badges, cartes, accordéon FAQ sombre, sticky CTA, bloc rappel).
- Fichiers de données : offres, modules, secteurs, FAQ, intégrations.
- Navigation (méga-menu Solutions / Secteurs / Tarifs / Ressources), footer riche, barre sticky d'essai.

### Phase 2 — Visuels
- Mockups produit codés (appel en cours, agenda, transcription, flow builder, base de connaissances, dashboard, widget, WhatsApp).
- Schémas : parcours d'un appel, comparatif humain vs IA, familles de modules.
- Photos / illustrations sectorielles (6 secteurs + hero) : selon la décision n°2.

### Phase 3 — Pages principales et offres
Accueil, Tarifs (grille, matrice, recharges, add-ons, FAQ), 6 pages offres, Démo live, Contact, Intégrations, Sécurité, FAQ, Secteurs.

### Phase 4 — Landings et modules
6 landings sectorielles (structure doc 114 / 94) et 13 sous-pages modules (structure doc 114). SEO : titres, descriptions, Open Graph, sitemap, données structurées.

### Phase 5 — Configuration white-label Autocalls (interface admin)
Brand Identity, Custom Domain (`app.permanenceia.com`), Colors & Theme, Website URLs, Footer Links, Email (SMTP Zoho), Email Templates, Pages & Navigation, Features & Buttons, **Plans** et **Default Plans Limits** selon la matrice ci-dessus, Checkout, Data Retention, Webhooks.

### Phase 6 — Câblage
Formulaire rappel → Supabase + email → déclenchement de l'assistant sortant Autocalls ; webhook post-appel → Supabase ; inscription essai → création du compte Autocalls ; démo live (widget navigateur) ; numéro Twilio importé ; Stripe pour les offres payantes.

### Phase 7 — Recette et mise en ligne
Build, liens, mobile, accessibilité, vitesse, cohérence des prix sur toutes les pages, test de bout en bout d'un rappel, mise en production.

## Décisions à valider avant la phase 1
1. Couleur d'accent : bleu/cyan du nouveau logo (recommandé) ou vert comme les références.
2. Photos et illustrations : source à choisir.
3. Essai : passage de 7 à 14 jours confirmé, et minutes au-delà de 30.
4. Contenus à retirer : avis, « 250 professionnels », certifications ISO d'Autocalls non transférables.

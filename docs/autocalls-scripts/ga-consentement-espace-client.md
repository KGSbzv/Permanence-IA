# Google Analytics de l'espace client après accord (9 octobre 2026)

**Pour qui :** le propriétaire, ou Claude dans une session qui a accès à l'administration de la plateforme.

**Fichier à coller :** docs/autocalls-scripts/ga-consentement-espace-client.html, en entier (une ligne de commentaire et le script). **Ce fichier .md n'est jamais collé** : tout ce qui est écrit dans les champs Custom Scripts est servi dans le code source des pages de app.permanenceia.com, /login et /register compris, et lisible par tout visiteur. Le commentaire du .html reste donc court et neutre.

Audit des parcours, action 21 ; suite à appliquer : docs/audits/a-appliquer-autocalls-2026-10-09.md, Lot D.

## Où le coller

app.autocalls.ai → Administration → Settings → Custom Scripts, dans **les deux champs** où l'ancien bloc se trouve :
- « Custom scripts » (pages de l'espace client) ;
- « Custom scripts (auth) » (pages /login et /register).

Supprimer l'ancien bloc en entier : de son commentaire « Google Analytics 4 (G-4W1B1W52PZ) » jusqu'à la balise de fin de son script, ajout de gtag/js compris. Coller le contenu du .html à sa place, puis enregistrer. Ne pas toucher aux autres scripts des deux champs (assistante, parcours d'essai).

## Ce qui change

1. **Rien n'est chargé ni envoyé à Google sans accord.** gtag.js n'est ajouté que si le cookie pia_consent vaut « granted » : accord donné sur www.permanenceia.com, cookie partagé sur .permanenceia.com. Refus ou aucun choix : aucune requête vers googletagmanager.com ni google-analytics.com, et l'interrupteur officiel ga-disable est posé. L'ancien bloc chargeait gtag.js dans tous les cas, même après « Refuser ».
2. **Signaux publicitaires Google toujours refusés** (ad_storage, ad_user_data, ad_personalization = denied), comme sur le site (src/lib/analytics.ts) : aucune balise Google Ads n'est utilisée. L'ancien bloc les passait à « granted » avec la mesure d'audience.
3. **Adresse des pages sans paramètres.** page_location et page_referrer sont envoyés sans la partie « ?… » ni « #… ». Les listes de l'espace client gardent la recherche et les filtres dans l'adresse (?tableSearch=…, ?tableFilters[…]=…). Un client qui cherche un de ses contacts par e-mail ou par téléphone aurait sinon envoyé cette valeur à Google. Ce sont des données des interlocuteurs de nos clients, que nous traitons pour leur compte, et les conditions de Google Analytics interdisent d'y envoyer des données personnelles. Conséquence acceptée : des paramètres de campagne (utm_…) posés sur un lien qui mène directement à l'espace client ne sont pas lus. Les campagnes mènent au site, qui les lit, et la mesure entre domaines (paramètre _gl) n'en dépend pas.
4. **Même mesure entre domaines** : même identifiant et même réglage « linker » que le site, cookie _ga sur .permanenceia.com (réglage automatique de gtag.js). Un visiteur reste le même de www à app.
5. **Événement sign_up (méthode « app ») gardé** : envoyé une seule fois par onglet, à la première page après /register, et seulement avec l'accord.

## À savoir

- Un visiteur arrivé directement sur l'espace client sans être passé par le site n'a pas de bandeau : il n'est donc pas mesuré. C'est voulu (aucune mesure sans accord).
- Dans l'espace client, c'est le choix fait sur le site qui s'applique ; pour le modifier, le visiteur utilise « Gérer les cookies » en bas d'une page du site. La politique cookies et le bandeau du site le disent dans les 7 langues (src/i18n/content/<langue>/ui/pages.ts et site.ts, 9 octobre).
- Le pixel Meta n'est pas dans ce script. Il relève de l'action 23 (mesure des essais, à valider d'abord) et ne doit jamais être mis sur /login ni /register, qui ont des champs e-mail et mot de passe.

## À faire aussi dans Google Analytics (propriétaire)

Le script retire les paramètres de la page vue qu'il envoie. Si les pages vues sur les changements d'historique du navigateur sont activées dans le flux (mesure améliorée, point encore ouvert de l'action 36), gtag.js en envoie d'autres lui-même, avec l'adresse complète. Pour les couvrir aussi :

Google Analytics → Admin → Flux de données → flux Web → Configurer les paramètres de la balise → Masquer des données :
- activer « E-mails » ;
- activer les paramètres de requête et ajouter : `tableSearch`, `tableFilters`, `search`, `q`, `email`, `phone`.

## Vérifier après l'enregistrement (fenêtre de navigation privée)

1. Ouvrir https://app.permanenceia.com/register sans être passé par le site : l'onglet Réseau des outils de développement ne montre aucune requête vers googletagmanager.com.
2. Ouvrir https://www.permanenceia.com, cliquer « Refuser », puis l'espace client : toujours aucune requête.
3. Cliquer « Gérer les cookies » en bas du site, puis « Accepter », puis aller sur l'espace client : gtag/js?id=G-4W1B1W52PZ se charge, et dans la console, « dataLayer » montre consent default avec ad_storage « denied ».
4. Dans Google Analytics → Admin → DebugView (ou dans l'onglet Réseau, requêtes « collect »), faire une recherche dans une liste de l'espace client puis recharger la page : le paramètre page_location (dl dans la requête) ne contient pas de « ? ».

Contrôle automatique du texte du script, dans le dépôt : `npx tsx scripts/test-ga-espace-client.ts`.

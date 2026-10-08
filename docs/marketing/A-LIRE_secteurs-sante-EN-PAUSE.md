# Secteurs santé : publicité EN PAUSE (décision du 7 octobre 2026)

Les créations et les campagnes **dentaire et cliniques** (et, s'il y en a, kiné/paramédical et médecine esthétique) sont **en pause dans les 7 langues**. Ne pas les publier.

**Pourquoi.** Les enregistrements et transcriptions d'appels de patients sont des données de santé.
- **France :** leur hébergement exige un hébergeur certifié HDS. L'hébergement d'Autocalls est situé dans l'EEE et/ou aux États-Unis, sans certification HDS connue.
- **Italie, Pologne, Pays-Bas :** l'article 9 du RGPD s'applique (données de catégorie particulière).
- **Israël :** l'amendement 13 s'applique, ainsi que la loi sur l'enregistrement des appels avec les consommateurs.

**Ce qui a été mis de côté**
- Les images sont dans les dossiers `EN-PAUSE_dentaire-cliniques` de `pack-creations/<langue>/` et de `pack-publicite/bannieres/<langue>/`.
- Les lignes Google Ads Editor (annonces, liens annexes, mots-clés) sont sorties des fichiers principaux. Elles sont regroupées dans `pack-publicite/google-ads-editor/EN-PAUSE_*.csv`.
- Les archives `.zip` ont été reconstruites sans ces fichiers.

**Pour réactiver**
1. Obtenir d'Autocalls, par écrit, le lieu d'hébergement des enregistrements et une solution certifiée HDS, ou un hébergement européen dédié.
2. Faire valider le texte par un juriste.
3. Retirer le préfixe `EN-PAUSE_` et recharger les lignes CSV.

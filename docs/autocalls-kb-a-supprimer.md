# Bases de connaissances Autocalls : nettoyage (mis à jour le 8 octobre 2026, 17 h UTC)

Autocalls l'a confirmé par écrit le 8 octobre : un agent lit **tous** les documents actifs de sa base. Les anciennes versions des mêmes pages (v7, v9, v10) sont encore actives à côté des nouvelles. Les agents mélangent donc anciens et nouveaux prix ou processus. Les documents en échec sont vides et sans effet sur les réponses, mais ils font afficher « failed » à la base.

Claude ne supprime jamais de données définitivement. Deux façons d'en sortir :

## Option A, recommandée : bases neuves (Claude, avec votre accord)

1. Claude crée 7 bases neuves, une version par page du site, lue **après** les corrections du 8 octobre au soir (200 crédits dans Réceptionniste, 100 crédits pour 1 $, recharge dès 5 $, CGU et page sécurité).
2. Il rattache chacun des 41 agents à la nouvelle base de sa langue, vérifie le résultat, puis renomme les anciennes bases « ANCIENNE, plus utilisée ».
3. Vous supprimez ensuite les 7 anciennes bases entières, quand vous voulez : 7 suppressions au lieu de 195. Rien ne presse, puisque plus aucun agent ne les lit.

L'opération est réversible : il suffit de rattacher un agent à son ancienne base. Le contrôle de sécurité de Claude Code demande votre accord explicite, car l'opération écrit beaucoup dans Autocalls.

## Option B : suppression à la main dans les bases actuelles

Autocalls > Knowledge base > ouvrir la base > supprimer chaque document de la colonne « à supprimer ». Il y en a 195 au total (29 en échec). Attention : même après ce nettoyage, les documents gardés datent d'avant les corrections du 8 octobre au soir. Il faudra donc encore réimporter la plupart des pages, puis supprimer les versions remplacées.

Liste établie à partir de l'inventaire de l'API (8 octobre, 17 h UTC). Dans chaque base, la règle est la même : on garde la version active la plus récente de chaque page, et on supprime tout le reste.

### 6163 Français
**À garder (10) :** 25168 Guides de l'espace client (v10) ; 25169 Secteurs (v10) ; 25170 Sécurité, confidentialité et conditions (v10) ; 25172 Conditions générales (v10) ; 25173 Fonctionnalités (v10) ; 25275 Parcours d'interaction et situations (v11) ; 25276 Tarifs et forfaits (v11) ; 25277 FAQ et essai gratuit (v11) ; 25278 Politique de confidentialité (v11) ; 25279 Processus (v11)

**À supprimer (26) :**
- anciennes versions actives (22) : 24899, 24921, 24954, 24955, 24961, 24967, 24968, 24972, 25001, 25002, 25003, 25007, 25048, 25049, 25050, 25160, 25161, 25164, 25166, 25167, 25171, 25274
- créations en échec, vides (4) : 25004, 25005, 25006, 25165

### 6166 English (UK et Australie)
**À garder (10) :** 25179 Sectors (v10) ; 25180 Security, privacy and terms (v10) ; 25182 Terms and conditions (v10) ; 25183 Features (v10) ; 25280 Processes (v11) ; 25281 Interaction journeys and situations (v11) ; 25282 Pricing and plans (v11) ; 25283 FAQ and free trial (v11) ; 25284 Customer area guides (v11) ; 25285 Privacy policy (v11)

**À supprimer (30) :**
- anciennes versions actives (23) : 24900, 24914, 24915, 24920, 24950, 24951, 24952, 24953, 24973, 25008, 25010, 25011, 25012, 25015, 25051, 25066, 25071, 25174, 25175, 25176, 25177, 25178, 25184
- créations en échec, vides (7) : 25009, 25013, 25014, 25052, 25053, 25067, 25181

### 6167 Italiano
**À garder (10) :** 25191 Settori (v10) ; 25193 Sicurezza, privacy e condizioni (v10) ; 25195 Condizioni generali (v10) ; 25196 Funzionalità (v10) ; 25286 Processi (v11) ; 25287 Percorsi di interazione e situazioni (v11) ; 25288 Prezzi e piani (v11) ; 25289 FAQ e prova gratuita (v11) ; 25290 Informativa sulla privacy (v11) ; 25291 Guide dell'area clienti (v11)

**À supprimer (27) :**
- anciennes versions actives (23) : 24901, 24922, 24923, 24924, 24925, 24926, 24927, 24928, 24974, 25016, 25018, 25020, 25022, 25023, 25054, 25055, 25056, 25185, 25187, 25188, 25189, 25190, 25194
- créations en échec, vides (4) : 25017, 25019, 25021, 25186

### 6168 Polski
**À garder (10) :** 25202 Branże (v10) ; 25204 Bezpieczeństwo, prywatność i warunki (v10) ; 25206 Regulamin (v10) ; 25207 Funkcje (v10) ; 25292 Procesy (v11) ; 25293 Ścieżki rozmów i sytuacje (v11) ; 25294 Cennik i pakiety (v11) ; 25295 FAQ i bezpłatny okres próbny (v11) ; 25296 Polityka prywatności (v11) ; 25297 Przewodniki po panelu klienta (v11)

**À supprimer (28) :**
- anciennes versions actives (23) : 24902, 24929, 24930, 24931, 24932, 24933, 24934, 24935, 24975, 25024, 25026, 25028, 25029, 25031, 25057, 25059, 25068, 25197, 25198, 25199, 25200, 25201, 25205
- créations en échec, vides (5) : 25025, 25027, 25030, 25058, 25203

### 6169 Nederlands
**À garder (10) :** 25212 Handleidingen klantomgeving (v10) ; 25214 Sectoren (v10) ; 25215 Beveiliging, privacy en voorwaarden (v10) ; 25217 Algemene voorwaarden (v10) ; 25218 Functies (v10) ; 25298 Processen (v11) ; 25299 Gespreksverloop en situaties (v11) ; 25300 Prijzen en abonnementen (v11) ; 25301 FAQ en gratis proefperiode (v11) ; 25302 Privacybeleid (v11)

**À supprimer (26) :**
- anciennes versions actives (22) : 24903, 24936, 24937, 24938, 24939, 24940, 24941, 24942, 24976, 25032, 25033, 25035, 25037, 25038, 25060, 25062, 25069, 25208, 25209, 25210, 25211, 25216
- créations en échec, vides (4) : 25034, 25036, 25039, 25061

### 6180 עברית
**À garder (10) :** 25224 תחומים (v10) ; 25227 אבטחה, פרטיות ותנאים (v10) ; 25230 תנאי שימוש (v10) ; 25233 תכונות (v10) ; 25303 תהליכים (v11) ; 25304 מסלולי שיחה ומצבים (v11) ; 25305 מחירים ומסלולים (v11) ; 25306 שאלות נפוצות והתנסות חינם (v11) ; 25307 מדיניות פרטיות (v11) ; 25308 מדריכים לאזור הלקוח (v11)

**À supprimer (27) :**
- anciennes versions actives (23) : 24904, 24943, 24944, 24945, 24946, 24947, 24948, 24949, 24977, 25040, 25041, 25042, 25044, 25045, 25063, 25065, 25070, 25219, 25220, 25221, 25222, 25223, 25228
- créations en échec, vides (4) : 25043, 25046, 25047, 25064

### 6209 multilingue (WhatsApp, Messenger, espace client)
**À garder (35) :** 25238 FR — Guides de l'espace client (v10) ; 25240 FR — Fonctionnalités (v10) ; 25241 FR — Secteurs (v10) ; 25242 FR — Sécurité, confidentialité et conditions (v10) ; 25243 FR — Conditions générales (v10) ; 25265 NL — Handleidingen klantomgeving (v10) ; 25309 FR — Processus (v11) ; 25310 FR — Parcours d'interaction et situations (v11) ; 25311 FR — Tarifs et forfaits (v11) ; 25312 FR — FAQ et essai gratuit (v11) ; 25313 FR — Politique de confidentialité (v11) ; 25314 EN — Processes (v11) ; 25315 EN — Interaction journeys and situations (v11) ; 25316 EN — Pricing and plans (v11) ; 25317 EN — FAQ and free trial (v11) ; 25318 EN — Customer area guides (v11) ; 25319 IT — Processi (v11) ; 25320 IT — Percorsi di interazione e situazioni (v11) ; 25321 IT — Prezzi e piani (v11) ; 25322 IT — FAQ e prova gratuita (v11) ; 25323 IT — Guide dell'area clienti (v11) ; 25324 PL — Procesy (v11) ; 25325 PL — Ścieżki rozmów i sytuacje (v11) ; 25326 PL — Cennik i pakiety (v11) ; 25327 PL — FAQ i bezpłatny okres próbny (v11) ; 25328 PL — Przewodniki po panelu klienta (v11) ; 25329 NL — Processen (v11) ; 25330 NL — Gespreksverloop en situaties (v11) ; 25331 NL — Prijzen en abonnementen (v11) ; 25332 NL — FAQ en gratis proefperiode (v11) ; 25333 HE — תהליכים (v11) ; 25334 HE — מסלולי שיחה ומצבים (v11) ; 25335 HE — מחירים ומסלולים (v11) ; 25336 HE — שאלות נפוצות והתנסות חינם (v11) ; 25337 HE — מדריכים לאזור הלקוח (v11)

**À supprimer (31) :**
- anciennes versions actives (30) : 25234, 25235, 25236, 25237, 25244, 25245, 25246, 25247, 25248, 25249, 25250, 25251, 25252, 25253, 25254, 25255, 25256, 25257, 25258, 25259, 25260, 25261, 25262, 25263, 25264, 25266, 25267, 25268, 25269, 25270
- créations en échec, vides (1) : 25239

## Réimporter après une mise à jour du site

Les documents « site web » ne se mettent pas à jour seuls : Autocalls lit la page une seule fois, à la création.

Après un déploiement qui modifie src/data/kb/*.txt ou les textes de src/i18n/content/<langue> :
1. Vérifier qu'une phrase nouvelle apparaît sur la page en ligne.
2. Créer le nouveau document par l'outil create-document du MCP Autocalls, **un seul à la fois**, et attendre le statut « Active » avant le suivant.
3. Liens à suivre (relative_links_limit) :
   - 1 pour /kb/..., tarifs, FAQ, sécurité, CGU et confidentialité ;
   - 50 pour /aide ;
   - 30 pour /secteurs ;
   - 20 pour /fonctionnalites.
4. Noter ici l'ancien document, à supprimer.

URL par base :
- 6163 : sans préfixe ;
- 6166 : /en-gb/ ;
- 6167 : /it/ ;
- 6168 : /pl/ ;
- 6169 : /nl/ ;
- 6180 : /he/.

Les pages /kb/ n'ont pas de préfixe (/kb/fr, /kb/en, /kb/it, /kb/pl, /kb/nl, /kb/he et leurs versions « -situations »).

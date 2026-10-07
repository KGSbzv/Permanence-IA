# Relecture PL — lot 04 : guides.ts + help.ts

Fichiers : `src/i18n/content/pl/guides.ts` (1114 l., 30 guides), `src/i18n/content/pl/help.ts` (117 l.). Sources : `fr/guides.ts`, `fr/help.ts`.

## 1. Synthèse

Le niveau est bon. Le polonais est correct et fluide, sans faute d'orthographe ni de diacritique relevée. Le tutoiement (Ty / Twój / Ciebie, avec majuscule) est appliqué partout. Le « Pan/Pani » n'apparaît qu'aux endroits où l'agent s'adresse à l'appelant, ce qui est juste. L'adaptation est réelle : exemple +48612345678 (9 chiffres, valide), « nie pomijaj polskich znaków », section « W Polsce » sur PKE/RODO/UODO, et France déplacée dans « W innych krajach ». Les libellés de l'interface Autocalls restent en anglais entre guillemets polonais „…”.

Problèmes systémiques :
- **Terminologie des crédits incohérente avec le reste du site.** Les guides emploient « środki na wiadomości », alors que `offers.ts` et `faq.ts` emploient « kredyty na wiadomości ». Le glossaire de l'aide donne « Credits → Środki » avec le texte « 100 kredytów ».
- **Autres incohérences de vocabulaire.** « połączenia równoczesne » (guides, aide) s'oppose à « jednoczesne połączenia » (`offers.ts`). « Flow builder » désigne à la fois l'éditeur visuel de prompt et la plateforme d'automatisation : le défaut vient de la source FR.
- **Calques de « sur mesure » et d'« agent entrant/sortant ».** Ils donnent « narzędzia na miarę » et « agent przychodzący/wychodzący ».
- **Partie Pologne de la téléphonie insuffisante.**
  - Rien sur l'achat d'un numéro polonais : justificatifs, adresse en Pologne, types de numéros.
  - Rien sur le blocage anti-spoofing des appels de l'étranger présentant un numéro +48 (loi de 2023).
  - Pas de codes de renvoi pour les lignes fixes (Orange Polska).
  - Rien sur les restrictions de renvoi vers un numéro étranger ni sur les offres prépayées.
- **Guide juridique « qui-peut-on-appeler » juste mais incomplet pour la Pologne.** Il manque la référence à l'art. 398 PKE et le fait que le consentement est aussi exigé en B2B. Il manque aussi l'interdiction d'appeler pour demander le consentement et l'autorité de contrôle (Prezes UKE). Le guide ne mentionne pas l'AI Act (art. 50), alors qu'il demande à l'agent d'annoncer qu'il est une IA.
- **Erreur héritée du FR dans `help.ts:36`.** « Test assistant » y est présenté comme une conversation dans le navigateur. Dans les guides, c'est le chat texte ; la conversation vocale dans le navigateur, c'est « Speak with your assistant ».

## 2. Tableau des corrections

| fichier:ligne | texte actuel | correction proposée (PL) | type | sévérité |
|---|---|---|---|---|
| guides.ts:709 (et 751, 145) | Wiadomości są opłacane ze środków na wiadomości. / …ilość środków | Wiadomości są opłacane z kredytów na wiadomości. / …zużywa niewielką liczbę kredytów (aligner sur offers.ts/faq.ts « kredyty na wiadomości ») | incohérence | Majeur |
| guides.ts:932 | Minuty ponad pakiet, opłacane ze środków („Credits”: 100 kredytów = 1 $). | Minuty ponad pakiet, opłacane z kredytów („Credits”: 100 kredytów = 1 $). (choisir « kredyty » partout, ou « środki » partout, mais pas les deux dans la même phrase) | incohérence | Majeur |
| help.ts:116 | { en: 'Credits', label: 'Środki', text: '100 kredytów = 1 $…' } | label: 'Kredyty' | incohérence | Majeur |
| help.ts:20 | Zakup doładowania minut; środki nie wygasają. | Zakup doładowania kredytów (minuty i wiadomości); kredyty nie wygasają. | incohérence/fait | Mineur |
| help.ts:36 | Kliknij Create assistant, a następnie Test assistant, aby porozmawiać z nim w przeglądarce. | Kliknij Create assistant, a następnie Test assistant (czat testowy) lub Speak with your assistant (rozmowa głosowa w przeglądarce). — erreur présente aussi en FR (fr/help.ts:39) | fait | Majeur |
| guides.ts:715 | Ten numer nie może być już używany w WhatsAppie. | Numer nie może być wcześniej zarejestrowany w WhatsAppie (ani w WhatsApp Business). — la phrase actuelle se lit « ne pourra plus être utilisé » | faute (sens) | Majeur |
| help.ts:18 vs guides.ts:312-351 | Flow builder bez kodu (pour Automate platform) | Edytor automatyzacji bez kodu (pour ne pas confondre avec « Flow Builder », l'éditeur de scénarios du prompt) ; même confusion dans faq.ts:14 et dans la source FR | incohérence | Majeur |
| guides.ts:752 | Kontakty, które wyraziły zgodę na kontakt. | Kontakty, które wyraziły uprzednią zgodę na kontakt telefoniczny w celach marketingowych (wymóg Prawa komunikacji elektronicznej) — zob. przewodnik „Do kogo może dzwonić Twój agent?”. | marché/juridique | Majeur |
| guides.ts:775 | related: ['contacts-leads', 'numero-presente', 'donnees-apres-appel'] | ajouter 'qui-peut-on-appeler' (par ex. à la place de 'donnees-apres-appel') | marché | Mineur |
| guides.ts:1016 | …wymaga uprzedniej zgody abonenta lub użytkownika (Prawo komunikacji elektronicznej, wcześniej Prawo telekomunikacyjne). | …wymaga uprzedniej zgody abonenta lub użytkownika końcowego (art. 398 ustawy z 12 lipca 2024 r. – Prawo komunikacji elektronicznej, obowiązującej od 10 listopada 2024 r.). Dotyczy to także firm (B2B), nie tylko konsumentów. Zgody nie można domniemywać ani zbierać w samym telefonie marketingowym. | juridique | Majeur |
| guides.ts:1017 | Organem nadzorczym jest Prezes UODO. | Nadzór sprawują Prezes UODO (dane osobowe) oraz Prezes UKE i Prezes UOKiK (zgoda na marketing, praktyki wobec konsumentów). | juridique | Mineur |
| guides.ts:1035 | Agent od początku mówi, że jest AI i że rozmowa jest nagrywana. | Agent od początku mówi, że jest AI (obowiązek z art. 50 unijnego AI Act od 2 sierpnia 2026 r.) i że rozmowa jest nagrywana. | juridique | Majeur |
| guides.ts:1025 | (art. L223-1 Kodeksu konsumenckiego) | (art. L223-1 francuskiego kodeksu konsumenckiego, Code de la consommation) | précision | Mineur |
| guides.ts:534 | Wybierz kraj i typ (lokalny, krajowy, bezpłatny, zależnie od dostępności) | Wybierz kraj i typ (np. dla Polski: stacjonarny z numerem kierunkowym strefy, komórkowy lub bezpłatny 800 — zależnie od dostępności) | marché | Mineur |
| guides.ts:537 | (dokumenty zależnie od kraju, zwykle 1–3 dni robocze) | Ajouter : Dla numerów polskich operator zwykle wymaga danych firmy (NIP, KRS lub CEIDG) i adresu w Polsce, zgodnie z planem numeracji (UKE). | marché | Majeur |
| guides.ts:551 | Masz Twilio lub Telnyx: zaimportuj swoje numery. | Korzystasz z Twilio lub Telnyx? Zaimportuj swoje numery. | calque | Mineur |
| guides.ts:552 | Masz centralę lub operatora SIP: połącz go przez SIP | Masz centralę lub operatora SIP? Podłącz je przez SIP (wszystkie pakiety). (« centralę » est féminin, « go » ne s'y accorde pas) | faute (accord) | Mineur |
| guides.ts:658 | W niektórych krajach zabronione jest wyświetlanie numeru zagranicznego lub niezweryfikowanego. | Ajouter : W Polsce operatorzy blokują połączenia z zagranicy, które prezentują polski numer bez uprawnienia (ustawa z 28 lipca 2023 r. o zwalczaniu nadużyć w komunikacji elektronicznej): przed kampanią sprawdź, czy połączenia z Twoim polskim numerem docierają. | marché/fait | Majeur |
| guides.ts:972 | U większości operatorów i w większości telefonów wpisz kod… | Ok pour Orange, Play, Plus et T-Mobile (codes GSM standard **21/**61/**62/**67, ##002#). Ajouter : Przekierowanie na numer zagraniczny może wymagać włączenia połączeń międzynarodowych u operatora; w ofertach na kartę bywa niedostępne. Włączenie **61/**62/**67 zastępuje przekierowanie na pocztę głosową. | marché | Mineur |
| guides.ts:974 | (często możesz dodać czas do przekierowania, np. **61*numer**20#) | (często możesz ustawić czas oczekiwania przed przekierowaniem, od 5 do 30 sekund, np. **61*numer**20#) | calque/précision | Mineur |
| guides.ts:982-986 | Na linii stacjonarnej lub w centrali / Otwórz panel klienta u operatora | Otwórz serwis klienta operatora (np. Mój Orange, e-BOK) lub menu centrali. Ajouter : Na linii stacjonarnej Orange Polska działają zwykle kody *21*numer# (wszystkie), *61*numer# (brak odpowiedzi), *67*numer# (zajęte); wyłączenie #21#, #61#, #67#. — « panel klienta » désigne déjà l'app {brand} (à vérifier chez l'opérateur) | marché/incohérence | Mineur |
| guides.ts:986 | (gdy nie odbieram, gdy zajęte lub stałe) | (przy braku odpowiedzi, gdy zajęte lub bezwarunkowe) | calque | Mineur |
| guides.ts:962 | Zachowaj swój numer dzięki przekierowaniu połączeń | Zachowanie numeru dzięki przekierowaniu połączeń (aligner sur le style nominal des autres titres) | incohérence | Mineur |
| guides.ts:61, 88, 336, 476 ; 487 | narzędzia na miarę / Tworzenie narzędzia na miarę (w trakcie rozmowy) | własne narzędzia / Tworzenie własnego narzędzia (Mid-Call Tool) | calque | Mineur |
| guides.ts:52 ; help.ts:22 ; guides.ts:951 | połączeń równoczesnych / połączenia równoczesne | jednoczesnych połączeń / jednoczesne połączenia (aligné sur offers.ts) | incohérence | Mineur |
| guides.ts:93-94, 137-138 | Agent przychodzący / Agent wychodzący | Agent do połączeń przychodzących / Agent do połączeń wychodzących | calque | Mineur |
| guides.ts:237 vs help.ts:114 et guides.ts:506 | {customer_name} | {{customer_name}} (même syntaxe partout ; même écart dans la source FR, à vérifier dans l'UI) | incohérence | Mineur |
| guides.ts:194 | Instrukcje ewoluują: | Instrukcje warto stale rozwijać: | calque | Mineur |
| guides.ts:253 | Celuj w 5–10 sekund | Powitanie powinno trwać 5–10 sekund | calque | Mineur |
| guides.ts:291 | Importuj głos z biblioteki dostawcy | Zaimportuj głos z biblioteki dostawcy (aspect perfectif, comme « Wybierz », « Sklonuj ») | aspect | Mineur |
| guides.ts:327 | Zacznij od istniejącego scenariusza, pustej strony lub szablonu. | Zacznij od istniejącego scenariusza, od zera lub od szablonu. | calque | Mineur |
| guides.ts:375 | odpowiedni do wsparcia klienta | odpowiedni do obsługi klienta | naturel | Mineur |
| guides.ts:408 | (domyślnie US, EU, jeśli konto jest europejskie) | (domyślnie US; wybierz EU, jeśli Twoje konto jest w regionie europejskim) | ponctuation/clarté | Mineur |
| guides.ts:462 | Każde narzędzie się włącza, a następnie uruchamia zgodnie z tym, co napiszesz w instrukcjach. | Każde narzędzie najpierw włączasz, a agent uruchamia je zgodnie z tym, co napiszesz w instrukcjach. | calque | Mineur |
| guides.ts:495 | litery, cyfry i podkreślenia | litery, cyfry i znaki podkreślenia (_) | terme | Mineur |
| guides.ts:595 | Wybierz typ autoryzacji | Wybierz typ uwierzytelniania (comme aux lignes 585 et 624) | incohérence | Mineur |
| guides.ts:613 | Idealne do testów lub kierowania… | Idealne rozwiązanie do testów lub do kierowania… | grammaire | Mineur |
| guides.ts:681 | Każde pole zasila zmienną agenta. | Każde pole uzupełnia zmienną agenta. | calque | Mineur |
| guides.ts:716 | postępuj zgodnie z oknem Mety | postępuj zgodnie z instrukcjami w oknie Mety | faute (sens) | Mineur |
| guides.ts:760 | na automatycznej sekretarce | na poczcie głosowej (comme dans help.ts:115 « Voicemail → Poczta głosowa ») | incohérence | Mineur |
| guides.ts:770 | Opcja awaryjna: po ostatniej próbie połączenia jednorazowo wysłać SMS… | Opcja awaryjna: po ostatniej nieudanej próbie wyślij jednorazowo SMS lub szablon WhatsApp (SMS marketingowy także wymaga zgody). | aspect/juridique | Mineur |
| guides.ts:1048 | 12 kontroli przed uruchomieniem agenta | 12 rzeczy do sprawdzenia przed uruchomieniem agenta | calque | Mineur |
| guides.ts:1061 | w mniej niż minutę | w ciągu minuty | naturel | Mineur |
| guides.ts:1068 | Informacja o nagrywaniu jest obecna, jeśli rozmowy są nagrywane. | Agent informuje o nagrywaniu, jeśli rozmowy są nagrywane. | calque | Mineur |
| guides.ts:1070, 1095 | Przesłuchałeś trzy pełne nagrania / Przesłuchaj 10 rozmów | Odsłuchaj trzy pełne nagrania… / Odsłuchaj 10 rozmów (« odsłuchuj » est employé l. 820 ; « przesłuchać » évoque l'interrogatoire) | terme/incohérence | Mineur |
| guides.ts:1066, 1070, 993 | nie zatwierdziłeś / Przesłuchałeś / Chcesz odbierać sam | Formes neutres en genre : …których nie zatwierdzono / Odsłuchaj… / Chcesz odbierać osobiście | inclusivité | Mineur |
| guides.ts:1081 | aby agent pozostał dobry na dłużej | aby agent działał dobrze przez cały czas | calque | Mineur |
| guides.ts:23 (meta) | `${title} — przewodnik ${brand}` | Les titres longs (ex. « Wybór numeru wyświetlanego przy połączeniach wychodzących — przewodnik PermanenceAI », environ 85 caractères) dépassent 60. Raccourcir le suffixe (« \| PermanenceAI ») ou les titres. | SEO | Mineur |
| guides.ts:1 + slugs | /aide/guides/agent-vocal-ia, renvoi-d-appel… | Les slugs restent français dans les URL polonaises (aucun mot-clé PL) : envisager des slugs PL (przekierowanie-polaczen, agent-glosowy-ai…), avec hreflang inchangé. | SEO | Mineur |
| help.ts:31 sqq. vs guides | Menu Assistants, następnie Create… (libellés sans guillemets) | Libellés anglais entre „…”, comme dans les guides (même différence dans la source FR) | typo/incohérence | Mineur |
| help.ts:43, 81 | PDF, plik tekstowy… / (plik CSV) | PDF, Word, plik tekstowy… / (plik CSV lub Excel) — aligné sur guides.ts:366, 786 | incohérence | Mineur |

Vérifiés et corrects :
- Codes GSM pour la Pologne : **21*, **61*, **62*, **67*, désactivation ##xx# et ##002#. Ce sont les codes MMI standard chez Orange, Play, Plus et T-Mobile.
- Format +48 : exemple à 9 chiffres valide.
- Essai : 14 jours / 30 minutes, conforme à `SHARED`.
- Typographie des nombres : 5000 / 50 000.
- Guillemets „…” cohérents.
- Pluriels : « 10 sekund », « 3 dni », « 5 pytań », « 12 znaków ».

## 3. Manques / ajouts recommandés

1. **Achat d'un numéro polonais** (`acheter-un-numero`).
   - Indiquer les justificatifs exigés : données de l'entreprise (NIP/KRS/CEIDG), adresse en Pologne, éventuelle pièce d'identité du représentant, délai.
   - Indiquer les types de numéros : géographique à indicatif de zone, mobile, 800.
   - Si les numéros PL ne sont pas proposés en libre-service, le dire et renvoyer vers le portage via SIP ou le renvoi d'appel.
2. **Anti-spoofing** (loi du 28/07/2023 sur la lutte contre les abus en communications électroniques). Les opérateurs polonais bloquent les appels entrants depuis l'étranger qui affichent un numéro +48. C'est un risque réel pour les campagnes passant par un trunk étranger. Ajouter un avertissement dans `numero-presente` et `campagnes-d-appels`, après vérification technique côté Autocalls.
3. **Renvoi d'appel en Pologne.**
   - Ajouter les codes pour ligne fixe (Orange Polska : *21*, *61*, *67*, désactivation #21#…).
   - Ajouter une note sur la messagerie vocale de l'opérateur, remplacée par le renvoi.
   - Ajouter une note sur le coût et les restrictions de renvoi vers un numéro étranger (offres « na kartę »).
4. **Guide « qui-peut-on-appeler » pour la Pologne.**
   - Citer l'art. 398 PKE.
   - Préciser que le consentement vaut aussi pour les entreprises (pas d'exception B2B, contrairement au paragraphe FR « Entre professionnels »).
   - Préciser qu'on ne peut pas appeler pour demander le consentement, et que le consentement doit être distinct, documenté et révocable.
   - Mentionner les sanctions : jusqu'à 3 % du chiffre d'affaires par le Prezes UKE ; UOKiK pour les pratiques visant les consommateurs.
   - Mentionner l'AI Act art. 50 (information « vous parlez à une IA », obligatoire depuis le 2/08/2026).
   - Garder la mention « nie zastępuje porady prawnej » et faire valider par un avocat polonais.
5. **Facturation** (`help.ts`, tâche « Okres próbny, rozliczenia i faktury », et `minutes-et-facturation`).
   - Préciser que les factures sont émises par une LLC américaine, en USD, sans TVA polonaise. Le client entreprise déclare l'import de services (odwrotne obciążenie, art. 28b ustawy o VAT).
   - Préciser que ces factures ne passent pas par KSeF, une question fréquente des biuro rachunkowe en 2026.
6. **Voix clonée.** Ajouter que la voix est une donnée personnelle (RODO) : le consentement écrit doit couvrir cet usage.
7. **Harmonisation terminologique globale du lot PL** avec `offers.ts`/`faq.ts` :
   - crédits : kredyty / kredyty na wiadomości ;
   - jednoczesne połączenia ;
   - pakiet ;
   - agent (et non asystent) pour le produit, « asystentka pomocy » réservée au bot d'aide.

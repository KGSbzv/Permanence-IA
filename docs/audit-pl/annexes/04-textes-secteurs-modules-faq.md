# Relecture PL — lot 03 : sectors.ts, modules.ts, offers.ts, faq.ts, integrations.ts, site.ts, index.ts

## 1. Synthèse

Le polonais est globalement de bonne qualité : grammaire, diacritiques et déclinaisons sont corrects, il y a très peu de calques grossiers et les termes métier sont les bons (gabinet stomatologiczny, skaling, SOR, NFZ, ASO, badanie techniczne, protokół zdawczo-odbiorczy, mecenas, radca prawny, PIT/JPK, PKE, 112, zł dans les dialogues). La fonction `plural` (1 / 2-4 / 5+, 12-14 → « minut ») est juste, tout comme `daysWord`. Le tutoiement (« Ty ») est cohérent, à **une** exception près (« Państwa »). Il n'y a aucun résidu français (€, HT, CNIL, Bloctel…). Les 14 secteurs et les 14 modules sont présents et conformes au français.

Problèmes systémiques :
1. **Collision « asystent »** : « Asystent » est un nom de forfait, mais aussi « asystent głosowy AI » (le produit), « asystent promptów/pisania » (l'aide à la rédaction) et « asystentka » (l'aide intégrée, la démo commerciale). Le tagline du marché est lui aussi « Inteligentny asystent telefoniczny ». À cela s'ajoute un genre fluctuant : agent (m.) / Recepcjonistka (f.) / asystentka (f.).
2. **Tournure « od pakietu Asystent »** (18 occurrences) : elle se lit spontanément « envoyé par le forfait Assistant » et non « à partir du forfait Assistant ». Il faut l'expliciter.
3. **Juridique PKE** : le site affirme qu'on peut appeler « ses propres clients avec qui l'on a déjà une relation ». C'est une logique de soft opt-in à la française, qui **n'existe pas en Pologne** pour le marketing téléphonique et les systèmes d'appel automatisés (art. 398 PKE : consentement préalable, y compris pour les clients existants).
4. **Questions clés absentes de la FAQ** pour un przedsiębiorca polonais : faktura/KSeF/odwrotne obciążenie (prix USD d'une LLC US), localisation des données (UE ? USA ?), information sur l'enregistrement des appels, accent et dialectes, numéro polonais +48. Il manque aussi des repères marché : Booksy et ZnanyLekarz (absents alors qu'ils dominent beauté et santé), Allegro, InPost, BLIK, Przelewy24, Otodom, OLX.
5. Les réponses « Gdzie przechowywane są dane? » (dentaire, kiné, esthétique) **ne répondent pas à « où »**, alors qu'il s'agit de données de santé (art. 9 RODO).

## 2. Tableau des corrections

| fichier:ligne | texte actuel | correction proposée | type | sévérité |
|---|---|---|---|---|
| faq.ts:46 (FAQ_PRICING « przekazanie… płatne? ») | Agent przekazuje rozmowę zespołowi według **Państwa** zasad | …według **Twoich** zasad | incohérence (registre Ty/Państwo) | Majeur |
| modules.ts:204 (relance-anciens-clients, intro) | Dzwonisz wyłącznie do własnych klientów, z którymi już masz relację. | Dzwonisz wyłącznie do własnych klientów, którzy zgodzili się na kontakt telefoniczny. | juridique (PKE art. 398 : pas d'exception « client existant ») | Majeur |
| sectors.ts:43 (services, FAQ relances) | Dzwoni wyłącznie do Twoich własnych klientów, z którymi już masz relację. | Dzwoni wyłącznie do Twoich klientów, którzy wyrazili zgodę na kontakt telefoniczny. | juridique | Majeur |
| sectors.ts:84 (dentaire, FAQ) | …jeśli są już pacjentami Twojego gabinetu. | …jeśli są pacjentami Twojego gabinetu i zgodzili się na kontakt telefoniczny. | juridique (PKE + données de santé) | Majeur |
| sectors.ts:456 (courtiers, problems) | Do klienta, do którego oddzwonisz następnego dnia, często podpisał już umowę gdzie indziej. | Klient, do którego oddzwonisz następnego dnia, często ma już podpisaną umowę gdzie indziej. | faute (phrase agrammaticale) | Majeur |
| faq.ts:23 (« Czy agent przedstawia się jako AI? ») | Agent jest uczciwie przedstawiany jako asystent AI i może przekazać rozmowę… | Tak. Na początku każdej rozmowy agent informuje, że jest asystentem AI (wymóg art. 50 AI Act od 2 sierpnia 2026 r.), i może przekazać rozmowę człowiekowi, jeśli to przewidziałeś. | juridique (AI Act) | Majeur |
| sectors.ts:83, :124 (dentaire, kiné) | Gdzie przechowywane są dane z rozmów? → Nagrania i transkrypcje są przechowywane przez wybrany przez Ciebie okres… | Ajouter le lieu réel : « Dane są przechowywane na serwerach [w UE / w USA — à confirmer, avec SCC/DPF], przez wybrany przez Ciebie okres… Zawieramy z Tobą umowę powierzenia przetwarzania danych (art. 28 RODO). » | fait / juridique (données de santé, art. 9 RODO) | Majeur |
| sectors.ts:565 (esthétique) | W Twoim zabezpieczonym panelu, przez ustalony przez Ciebie okres. | Idem : préciser la localisation des serveurs et l'umowa powierzenia. | fait / juridique | Majeur |
| 18 occ. au total (16 dans sectors.ts), p. ex. sectors.ts :59, :100, :141, :150, :181, :222, :231, :261, :270, :285, :301, :310, :323 ; modules.ts:44 ; faq.ts:14 | Przypomnienia dzień wcześniej **od pakietu Asystent** | Przypomnienia dzień wcześniej **(od pakietu Asystent wzwyż)** ou **w pakiecie Asystent i wyższych** | calque / ambiguïté | Majeur |
| faq.ts:5 ; modules.ts:24, :114 ; faq.ts:7 ; offers.ts:92 (+ modules.ts:129 « Asystent pisania ») | asystent głosowy AI / asystent promptów / Asystent pisania | Réserver « Asystent » au forfait : « agent głosowy AI », « kreator promptów », « edytor z podpowiedziami AI ». | incohérence terminologique | Majeur |
| faq.ts:21-22 ; modules.ts:6 ; offers.ts:18-19 | asystentka pomocy / asystentka głosowa / Recepcjonistka (f.) vs agent (m.) | Choisir et documenter : l'agent du client = « agent » (m.) ; l'aide intégrée = « asystentka pomocy » (OK si assumé) ; le forfait « Recepcjonistka » peut rester. Éviter « asystent głosowy » pour l'agent. | incohérence | Mineur |
| sectors.ts:412 (e-commerce, targets) | sklepy na Shopify, WooCommerce lub PrestaShop | sklepy na Shopify, WooCommerce, PrestaShop, Shoper czy IdoSell, sprzedawcy na Allegro | marché | Majeur |
| sectors.ts:420 (e-commerce, handles) | Zwroty, wymiany i refundacje według Twojej polityki | Zwroty, wymiany i zwroty pieniędzy według Twojego regulaminu sklepu (« refundacja » = remboursement NFZ) | calque | Mineur |
| sectors.ts:420 | Formy płatności i dostawy | Formy płatności i dostawy (BLIK, Przelewy24, za pobraniem, Paczkomaty InPost) | marché | Mineur |
| sectors.ts:442 | łączą agenta z Shopify, WooCommerce i ponad 300 narzędziami | …z Shopify, WooCommerce, BaseLinkerem i ponad 300 narzędziami (si BaseLinker, Allegro ou Shoper est réellement disponible ; sinon ne rien citer de non vérifié) | marché | Mineur |
| sectors.ts:417 | W czasie wyprzedaży i świąt… | W Black Friday, przed świętami Bożego Narodzenia i w czasie wyprzedaży… | marché | Mineur |
| sectors.ts:282 (coiffure, FAQ) | rezerwuje… w podłączonym kalendarzu (Google, Outlook, Cal.com lub Calendly) | Ajouter une FAQ « Czy działa z Booksy? » avec une réponse honnête (pas d'intégration native : agent przyjmuje zgłoszenie / możliwa integracja przez API, jeśli dostępna). Sans elle, objection n°1 non traitée. | marché | Majeur |
| sectors.ts:82, :122 (dentaire, kiné) | Jeśli grafik prowadzisz w innym programie gabinetowym… | Jeśli grafik prowadzisz w innym programie (np. ZnanyLekarz, Medfile, KS-Mbinet)… | marché | Mineur |
| sectors.ts:58 (dentaire, handles) | Powód wizyty: przegląd, skaling… | Ajouter « Wizyta prywatna czy na NFZ » (fait en kiné :99, attendu aussi en dentaire) | marché | Mineur |
| sectors.ts:84 / :564 / modules.ts:40 | nieodbyte wizyty / Mniej nieodbytych wizyt | « nieobecności pacjentów (no-show) » ou « niestawiennictwa », terme déjà utilisé en :285. Unifier. | incohérence | Mineur |
| sectors.ts:84 | Czy może ograniczyć nieodbyte wizyty? | Czy agent może ograniczyć liczbę niestawiennictw? | faute (sujet / complément manquants) | Mineur |
| sectors.ts:537 (esthétique) | Nieodbyte wizyty są kosztowne przy długich terminach. | Niestawiennictwa są kosztowne przy długich zabiegach. (FR : « créneaux longs ») | contresens | Majeur |
| sectors.ts:538, :540 | pytania o cenę konsultacji i terminy / cena konsultacji, terminy | …i czas oczekiwania na wizytę (FR « délais ») | calque / ambiguïté | Mineur |
| sectors.ts:534 | Agent AI dyskretnie przyjmuje pacjentów | Agent AI dyskretnie przyjmuje zgłoszenia pacjentów (« przyjmować pacjentów » = consulter) | faute de sens | Mineur |
| sectors.ts:558 | we wtorek 14. o 11:00 | we wtorek 14 października o 11:00 ou we wtorek o 11:00 | typo | Mineur |
| sectors.ts:96 (kiné) | między jedną dokumentacją a drugą | w przerwach między uzupełnianiem dokumentacji | calque | Mineur |
| sectors.ts:117 | Proponuję poniedziałek o 18:00 u Tomasza. | …u pana Tomasza. (usage polonais avec un patient) | naturel | Mineur |
| sectors.ts:132 (vétérinaire, targets) | lekarze koni i zwierząt gospodarskich | lekarze weterynarii specjalizujący się w koniach i zwierzętach gospodarskich | naturel | Mineur |
| sectors.ts:130 | Gabinety weterynaryjne | Gabinety i lecznice weterynaryjne (« lecznica » est le terme usuel, déjà employé en :137) | marché / SEO | Mineur |
| sectors.ts:143 | Weterynarz badająca golden retrievera | Lekarka weterynarii badająca golden retrievera | faute (accord) | Mineur |
| sectors.ts:238 (auto, dialogue) | Auto miejskie z 2019 roku | Toyota Yaris z 2019 roku (en réponse à « Jaki to model », un Polonais donne la marque et le modèle) ; idem :241 | naturel | Mineur |
| sectors.ts:221 | przegląd rejestracyjny | okresowe badanie techniczne (terme officiel, déjà utilisé en :222) | incohérence | Mineur |
| sectors.ts:450 (courtiers, name) | Brokerzy ubezpieczeniowi i kredytowi | Pośrednicy ubezpieczeniowi i kredytowi (« pośrednik kredytowy » est le statut KNF ; « broker kredytowy » n'existe pas juridiquement) | marché | Mineur |
| sectors.ts:461 | doradca pozostaje gospodarzem sprawy | decyzje zawsze należą do doradcy | calque | Mineur |
| sectors.ts:485 | uprzedza przed końcem umowy, aby umówić spotkanie | …(klientom, którzy zgodzili się na kontakt telefoniczny) — un appel de renouvellement est du marketing au sens de la PKE | juridique | Mineur |
| sectors.ts:491, :493, :504 (gestion locative) | Usterki… sortowane / Każda usterka… posortowana / agent AI sortuje telefony | Usterki… kwalifikowane i kierowane dalej / Każda usterka zgłoszona przez najemcę trafia do właściwej osoby, nawet w nocy / agent AI segreguje telefony | calque (« trier ») | Mineur |
| sectors.ts:518 | zostawiam wiadomość sąsiadowi z góry | …i przekażę zarządcy prośbę o kontakt z sąsiadem z góry (l'agent ne peut pas joindre un tiers ; idem en FR) | fait (plausibilité) | Mineur |
| offers.ts:36 | Pakiet Asystent dodaje trzech agentów | Pakiet Asystent obejmuje trzech agentów (total = 3, pas +3 ; même défaut en FR) | fait | Mineur |
| offers.ts:44 | nielimitowani agenci i kampanie | nielimitowana liczba agentów i kampanii | faute (accord de genre mixte) | Mineur |
| offers.ts:46 | Nielimitowani agenci, kampanie i bazy wiedzy | Bez limitu agentów, kampanii i baz wiedzy | faute (accord) | Mineur |
| offers.ts:49 | name: 'Na miarę' | 'Indywidualny' (cohérent avec « Wycena indywidualna » et « Indywidualnie » de la matrice ; « Na miarę » est un calque) | calque / incohérence | Mineur |
| offers.ts:50 | Powyżej 2500 minut miesięcznie, regularnie | Regularnie ponad 2500 minut miesięcznie | naturel | Mineur |
| offers.ts:38 vs :96 ; :46 vs :114 | 5000 uruchomień / 5 000 uruchomień ; 1000 kredytów / 1 000 / mies. ; 1500 / ≈ 1500 | Unifier : en polonais, l'espace est facultative pour 4 chiffres et obligatoire à partir de 5 (50 000). Choisir « 5000 » et « 1000 » partout, ou l'espace insécable partout. | typo / incohérence | Mineur |
| offers.ts:97 | Zarządzaj kontem z ChatGPT lub Claude | Zarządzaj kontem z poziomu ChatGPT lub Claude | naturel | Mineur |
| offers.ts:114 | Bez kredytów w cenie doładowuje się według potrzeb. | Jeśli pakiet nie zawiera kredytów, doładowujesz je według potrzeb. | naturel | Mineur |
| offers.ts:122 | Twój własny numer komórkowy jako nadawca | Twój numer komórkowy jako numer wyświetlany | calque (« nadawca » vaut pour le SMS) | Mineur |
| offers.ts:123 + modules.ts:92 vs modules.ts:213, faq.ts:19 | Lista blokad / Lista wykluczeń / listę wykluczeń | Un seul terme : « Lista wykluczeń » (ou « czarna lista »). Même défaut en FR. | incohérence | Mineur |
| offers.ts:133 | decouverte: 'Materiały' | 'Materiały pomocy' / 'Baza wiedzy i poradniki' | naturel | Mineur |
| offers.ts:60 | free: '0 $' | '0 USD' ou laisser, mais cohérent avec « 5,99 $ » (choix « $ » après le nombre acceptable) | typo | Mineur |
| modules.ts:9 (receptionniste-ia, intro) | …zbiera przydatne informacje i decyduje o dalszych krokach: odpowiedź… (deux « : » dans la phrase) | …i decyduje o dalszych krokach (odpowiedź, wizyta, oddzwonienie lub przekazanie rozmowy) | typo | Mineur |
| modules.ts:44 (prise-de-rdv, step 3) | wysyła podsumowanie (SMS i WhatsApp od pakietu Asystent) | Ajout absent du FR et en contradiction avec FAQ « SMS/WhatsApp we wszystkich pakietach » : « wysyła podsumowanie (automatyczne potwierdzenia SMS/WhatsApp od pakietu Asystent wzwyż) » | incohérence | Mineur |
| modules.ts:76 (qualification) | Klienci na rynku nieruchomości | Kupujący i najemcy w biurach nieruchomości | naturel | Mineur |
| modules.ts:82 (campagnes, short) | kontakty kontrolne | ponowne kontakty (follow-upy) | calque | Mineur |
| modules.ts:89 | Osiągalni, zainteresowani, do ponownego kontaktu | Odebrane, zainteresowani, do ponownego kontaktu | naturel | Mineur |
| modules.ts:201 (name) | Powroty dawnych klientów | Odzyskiwanie dawnych klientów / Reaktywacja klientów | naturel / SEO | Mineur |
| modules.ts:177 (reporting) | Rozmowy są nagrywane | Rozmowy są nagrywane (po poinformowaniu dzwoniącego) | juridique (obligation d'information, art. 13 RODO) | Mineur |
| faq.ts:7 (« Czy potrzebna jest wiedza techniczna? ») | asystent promptów prowadzi Cię krok po kroku | kreator promptów prowadzi Cię krok po kroku | calque / collision | Mineur |
| faq.ts:15 | automatyczne ponowne kontakty wymagają pakietu Asystent | automatyczne przypomnienia i follow-upy wymagają pakietu Asystent | calque (« relances ») | Mineur |
| faq.ts:18 | Jak wgrywacie informacje o mojej firmie? | Jak przekazać agentowi informacje o mojej firmie? | calque | Mineur |
| faq.ts:19 (RODO) | Platforma zapewnia potrzebne narzędzia… | Compléter : où sont les données, umowa powierzenia (DPA), transfert hors EOG (LLC US / SCC), UODO comme autorité, information sur l'enregistrement. | juridique / marché | Majeur |
| faq.ts:26 | Mam już sekretarkę lub zewnętrzne biuro obsługi telefonicznej | Mam już sekretarkę lub wirtualną recepcję (outsourcing obsługi telefonicznej)… (« wirtualna sekretarka / recepcja » est le terme recherché) | marché / SEO | Mineur |
| faq.ts:34 (« po wykorzystaniu 30 minut ») | połączenia są wstrzymane | połączenia zostają wstrzymane | faute (aspect) | Mineur |
| faq.ts:35 (« Czy ceny są podane netto? ») | wszystkie ceny są podane netto (bez VAT). Lokalne podatki są doliczane… | …netto (bez VAT). Firmy z Polski rozliczają VAT od usługi same, w ramach importu usług (odwrotne obciążenie). Wording à valider par un doradca podatkowy. | marché / juridique | Majeur |
| faq.ts:45 | Minuty ponad limit pakietu są opłacane z Twoich środków. Bez środków… | …z Twojego kredytu (salda). Bez kredytu… (cohérence avec « kredyt » ailleurs) | incohérence | Mineur |
| faq.ts:47 | SMS lub szablon WhatsApp zależnie od kraju | koszt SMS-a lub szablonu WhatsApp zależy od kraju | faute (ellipse incorrecte) | Mineur |
| faq.ts:42 (rozliczenie roczne) | (Regulamin, artykuły 3 i 4) | Vérifier que la numérotation du Regulamin PL (pages.ts) correspond bien aux art. 3 et 4. | fait (à vérifier) | Mineur |
| integrations.ts:20 | Przez flow builder, bez kodowania. | W flow builderze, bez kodowania. | faute (rection) | Mineur |
| site.ts:16 | Ceny w dolarach amerykańskich (USD), netto — lokalne podatki doliczane… | Ajouter « Płatność kartą w USD; bank może naliczyć przewalutowanie. » (attente PLN) | marché | Mineur |

## 3. Manques / ajouts recommandés

1. **FAQ « faktura / KSeF »** : « Czy otrzymam fakturę VAT? Czy jest w KSeF? » La réponse doit être honnête : l'éditeur, une LLC US sans établissement en PL, n'émet pas via KSeF. Le client reçoit une facture électronique (Billing info), passe la TVA en import usług (art. 28b + art. 17 ust. 1 pkt 4 ustawy o VAT) et indique son NIP. Validation par un doradca podatkowy nécessaire.
2. **FAQ « PLN »** : prix en USD seulement, débit en USD, conversion bancaire. Donner un ordre de grandeur en zł ou l'assumer explicitement.
3. **FAQ « Czy mogę mieć polski numer (+48)? »** : Polska figure dans la liste des pays (bien), mais il faut le dire en une question dédiée, avec mention des numéros stacjonarne et komórkowe, et de la portabilité (przeniesienie numeru) via SIP ou opérateur.
4. **FAQ « nagrywanie rozmów »** : obligation d'informer l'appelant (komunikat na początku rozmowy, art. 13 RODO), base légale, durée. À croiser avec l'obligation AI Act art. 50 (annonce « rozmawiasz z asystentem AI »).
5. **FAQ « akcent i gwara »** : compréhension des accents régionaux (Śląsk, Podhale), des numéros, adresses, PESEL et noms polonais ; langue ukrainienne (forte population ukrainophone).
6. **FAQ « dane w UE? »** : localisation des serveurs (Autocalls, LLC US), DPA/umowa powierzenia, SCC/DPF, UODO. Particulièrement pour santé (dentaire, kiné, esthétique, vétérinaire) et kancelarie (tajemnica adwokacka / radcowska), où la question « Jak chroniona jest poufność? » (sectors.ts:403) ne mentionne ni secret professionnel ni lieu d'hébergement.
7. **Intégrations marché** : Booksy (fryzjer, beauty, barber), ZnanyLekarz/Docplanner (santé), Versum, Moment ; Allegro, BaseLinker, Shoper, IdoSell, InPost, BLIK/Przelewy24 (e-commerce) ; Otodom, OLX, Morizon, Gratka (immobilier : sectors.ts:177 et :204 parlent de « portale ogłoszeniowe » sans les nommer). Si pas d'intégration native, le dire et indiquer la voie (API/webhooks/flow builder) plutôt que de passer sous silence.
8. **Réalités calendaires polonaises** : horaires de Wigilia et des święta, Wszystkich Świętych, długi weekend majowy, ferie zimowe. Un exemple (« agent informuje o godzinach otwarcia w święta ») en restaurants, santé et services domowe serait très parlant.
9. **Médecine esthétique / santé** : rappeler la limite de la publicité des activités médicales (art. 14 ustawy o działalności leczniczej, Kodeks Etyki Lekarskiej) pour les campagnes de « réactivation » des patients. Contrôle par un avocat local recommandé.
10. **PKE de façon transverse** : toutes les mentions « appeler vos clients existants » (relances, devis, przegląd, szczepienia, renouvellements) doivent conditionner l'appel à une **zgoda** prouvable. Le secteur e-commerce (:443) et le secteur courtiers (:484) le font bien ; il faut l'aligner partout (modules.ts:204, sectors.ts:43, :84, :181, :206, :222, :485). Validation par un avocat polonais nécessaire.
11. **SEO** : les mots-clés réellement recherchés sont « wirtualna recepcjonistka », « wirtualna sekretarka », « automatyczna sekretarka AI », « obsługa telefoniczna firmy », « bot głosowy » et « voicebot ». Ils sont sous-utilisés dans les noms et accroches (« Recepcjonistka AI » est bien, « voicebot » est absent).
12. **Glossaire interne** à fixer : agent (m.) pour l'agent du client ; Asystent = forfait uniquement ; kredyt / saldo / doładowanie ; lista wykluczeń ; niestawiennictwo ; pakiet (jamais plan/oferta).

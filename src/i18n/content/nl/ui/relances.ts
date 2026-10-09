// Teksten van de commerciële opvolgmails en de e-mails over de levenscyclus van het account (reeksen P, I, C, F, U
// en maandelijkse opvolging M), vertaald uit de Franse bron (src/i18n/content/fr/ui/relances.ts).
//
// Regels (zie de Franse bron):
// - geen enkel productcijfer staat hier vast: prijzen, minuten en proefperiode komen binnen via `RelanceFacts`;
// - de gegevens van het contact blijven variabelen {tussen accolades}, ingevuld bij het versturen;
// - de „essential”-berichten (I1, C1 t/m C5, F1, U1) bevatten geen verkoopargumenten;
// - de juridische voettekst en de afmeldlink voegt sendMail toe (src/lib/emailFooter.ts).
import type { RelancesContent } from '../../fr/ui/relances';

const lowerFirst = (s: string) => (s ? s.charAt(0).toLocaleLowerCase('nl-NL') + s.slice(1) : s);
const SERIES_END_UNSUBSCRIBE = 'We schrijven u hooguit één keer per maand. Wilt u niets meer ontvangen, klik dan op de afmeldlink onderaan deze e-mail.';

export const UI_RELANCES: RelancesContent = {
  shared: {
    greeting: { named: 'Hallo {first_name},', anonymous: 'Hallo,' },
    companyFallback: 'uw bedrijf',
    // Wordt gevolgd door „bedanken we u…” (P1): elke regel begint daarom met „Naar aanleiding van”.
    sourceLine: {
      callback_done: 'Naar aanleiding van ons gesprek van {request_date}',
      callback: 'Naar aanleiding van uw terugbelverzoek',
      trial_request: 'Naar aanleiding van uw vraag om hulp bij het starten van uw proefperiode',
      agent_lead: 'Naar aanleiding van uw gesprek met onze assistent',
      demo: 'Naar aanleiding van uw test van onze live demo',
      contact: 'Naar aanleiding van uw bericht',
      signup_abandoned: 'Naar aanleiding van het aanmaken van uw account',
    },
    signature: (brand) => `Het ${brand}-team`,
    ctaLine: (label, url) => `${label}: ${url}`,
    list: (items) => {
      const l = items.map((s) => lowerFirst(s.trim().replace(/\.$/, '')));
      return l.length < 2 ? l.join('') : `${l.slice(0, -1).join(', ')} en ${l[l.length - 1]}`;
    },
    clause: (sentence) => lowerFirst(sentence.trim()),
  },

  messages: {
    // ---------- P: prospects zonder account (marketing) ----------
    P1: (f) => ({
      category: 'marketing',
      subject: '{first_name}, test de agent op uw echte gesprekken',
      subjectNoName: 'Test de agent op uw echte gesprekken',
      preheader: `${f.trialDays} dagen proefperiode, ${f.trialMinutes} belminuten, niets afgeschreven tijdens de proefperiode.`,
      body: [
        `{source_line} bedanken we u voor uw interesse in ${f.brand}.`,
        'De eenvoudigste manier om u een oordeel te vormen: test de agent op de gesprekken van {company}.',
        {
          ol: [
            `Maak uw account aan en kies het abonnement dat u wilt testen: de proefperiode van ${f.trialDays} dagen start, met ${f.trialMinutes} belminuten.`,
            'Er wordt om een creditcard gevraagd, maar tijdens de proefperiode wordt niets afgeschreven.',
            'Is het niets voor u? Zeg dan vóór het einde op via Billing info: u betaalt niets.',
          ],
        },
      ],
      cta: { label: 'Start mijn proefperiode', target: 'trial' },
      after: ['Een vraag? Beantwoord gewoon deze e-mail: ons team leest hem zelf.'],
    }),
    P1_signup: (f) => ({
      category: 'marketing',
      subject: '{first_name}, uw account is nog niet aangemaakt',
      subjectNoName: 'Uw account is nog niet aangemaakt',
      preheader: 'Uw registratie is nog niet afgerond, en dat kunnen we samen met u doen.',
      body: [
        `U bent begonnen met het aanmaken van uw ${f.brand}-account via onze pagina voor de gratis proefperiode, maar de registratie lijkt niet te zijn afgerond.`,
        'Om uw proefperiode te starten zijn er nog twee stappen: de registratie afronden op de pagina van uw klantomgeving (in het Engels, een paar minuten) en daarna het abonnement kiezen dat u wilt testen.',
        `Pas met die keuze start de proefperiode van ${f.trialDays} dagen, met ${f.trialMinutes} belminuten. Er wordt om een creditcard gevraagd, maar tijdens de proefperiode wordt niets afgeschreven.`,
        'Hebt u uw account met een ander e-mailadres aangemaakt? Dan kunt u dit bericht negeren.',
      ],
      cta: { label: 'Mijn registratie afronden', target: 'register' },
      after: ['Doet u het liever samen met ons? Laat uw nummer achter op onze proefpagina: we bellen u terug op een moment dat u schikt, om samen het account aan te maken en de agent in te stellen. U kunt ook gewoon deze e-mail beantwoorden.'],
      secondary: { label: 'Laat mij terugbellen', target: 'trial_assist' },
    }),
    P2: (f) => {
      const r = f.plans.receptionniste;
      return {
        category: 'marketing',
        subject: 'Wat kosten onbeantwoorde gesprekken u?',
        preheader: 'Een eenvoudige rekensom, met uw eigen cijfers.',
        body: [
          'Een onbeantwoord gesprek is vaak een klant die het volgende nummer op zijn lijstje belt.',
          'Reken het uit met uw eigen cijfers:\ngemiste gesprekken per week × 4,3 × gemiddelde waarde van een nieuwe klant = wat {company} elke maand kan mislopen.',
          `Daartegenover staat het ${r.name}-abonnement: ${r.price} excl. btw per maand voor ${r.minutes} minuten. De agent neemt 24 uur per dag op, noteert het bericht of de afspraak en stuurt u van elk gesprek een samenvatting. De calculator op onze pagina Prijzen maakt de vergelijking voor u.`,
          `Het beste meet u het op uw eigen gesprekken: ${f.trialDays} dagen proefperiode, ${f.trialMinutes} minuten inbegrepen, niets afgeschreven tijdens de proefperiode.`,
        ],
        cta: { label: 'Start mijn proefperiode', target: 'trial' },
      };
    },
    P3: (f) => ({
      category: 'marketing',
      subject: '{sector_name}: wat de agent voor u afhandelt',
      preheader: 'Wat de agent bij deze gesprekken voor u noteert.',
      body: [
        'In uw vak komt één situatie vaak terug: {sector_problem}',
        'Bij deze gesprekken noteert de agent wat u nodig hebt: {sector_handles}. U ontvangt een overzichtelijke samenvatting en belt terug wanneer het u uitkomt, of de afspraak staat al in uw agenda (Google Agenda of Outlook, via Cal.com of Calendly).',
        'U begint met een sjabloon voor de instructies dat u aanpast aan {company}, en test het daarna via de chat, in de browser en met een echt telefoongesprek.',
      ],
      cta: { label: `Probeer het ${f.trialDays} dagen`, target: 'trial' },
    }),
    P3_generic: (f) => ({
      category: 'marketing',
      subject: 'Wat de agent voor u afhandelt',
      preheader: 'Wat de agent bij deze gesprekken voor u noteert.',
      body: [
        'In uw vak komt één situatie vaak terug: gesprekken die binnenkomen terwijl u bezig bent.',
        'Bij deze gesprekken noteert de agent wat u nodig hebt: wie er belt, met welke vraag en wanneer u kunt terugbellen. U ontvangt een overzichtelijke samenvatting en belt terug wanneer het u uitkomt, of de afspraak staat al in uw agenda (Google Agenda of Outlook, via Cal.com of Calendly).',
        'U begint met een sjabloon voor de instructies dat u aanpast aan {company}, en test het daarna via de chat, in de browser en met een echt telefoongesprek.',
      ],
      cta: { label: `Probeer het ${f.trialDays} dagen`, target: 'trial' },
    }),
    P4: () => ({
      category: 'marketing',
      subject: 'Uw klanten weten dat ze met een AI spreken, en dat is bewust',
      preheader: 'U schrijft zijn instructies, wat hij nooit mag doen en wanneer hij doorverbindt.',
      body: [
        'Vanaf het begin van het gesprek meldt de agent dat hij een AI is. Dat is een verplichting uit de Europese AI-verordening, en vooral een kwestie van vertrouwen. Zijn stem klinkt natuurlijk, in de taal van de beller.',
        'En u houdt zelf de regie:',
        {
          ul: [
            'u schrijft zijn instructies: openingstijden, prijzen, manier van antwoorden;',
            'u zet op een rij wat hij nooit mag doen: een prijsopgave, een diagnose, een toezegging over termijnen;',
            'hij verbindt het gesprek door naar uw team wanneer u dat hebt ingesteld, of plant een terugbelverzoek met een samenvatting. Doorverbinden is inbegrepen in alle abonnementen.',
          ],
        },
      ],
      cta: { label: 'Oordeel op uw eigen gesprekken', target: 'trial' },
    }),
    P5: (f) => ({
      category: 'marketing',
      subject: 'U houdt uw huidige nummer',
      preheader: 'Gewoon doorschakelen, zonder installatiekosten.',
      body: [
        'U hoeft niet van nummer te wisselen en uw klanten niets te laten weten.',
        'U zet bij uw provider doorschakelen aan, bijvoorbeeld alleen als u niet opneemt, of ’s avonds en in het weekend. Uw klanten bellen het vertrouwde nummer van {company}, en de agent neemt het over wanneer u niet kunt opnemen. Uw provider kan kosten rekenen voor doorschakelen naar een buitenlands nummer: controleer uw abonnement.',
        `Geen installatie- of opstartkosten. Liever een eigen nummer? Dat is een optie, vanaf ${f.phoneNumberFrom} excl. btw per maand, afhankelijk van het land.`,
      ],
      cta: { label: 'Start de proefperiode', target: 'trial' },
    }),
    P6: (f) => {
      const { receptionniste: r, assistant: a, 'centre-appels': c } = f.plans;
      return {
        category: 'marketing',
        subject: 'Onze prijzen, zonder kleine lettertjes',
        preheader: 'Drie abonnementen, betalen per gebruik, zonder verplichtingen.',
        body: [
          'Dit zijn onze prijzen, exclusief btw:',
          {
            ul: [
              `${r.name}: ${r.price} per maand, ${r.minutes} minuten;`,
              `${a.name}: ${a.price} per maand, ${a.minutes} minuten;`,
              `${c.name}: ${c.price} per maand, ${c.minutes} minuten;`,
              `zonder abonnement: ${f.paygMinute} per minuut, tegoed zonder vervaldatum.`,
            ],
          },
          `Concreet kost een gesprek van ${f.exampleCallMinutes} minuten ongeveer ${f.exampleCallPayg} bij betalen per gebruik, en tussen ${f.exampleCallPlanLow} en ${f.exampleCallPlanHigh} in een abonnement.`,
          `Zonder verplichtingen: u zegt op wanneer u wilt via Billing info. Bij jaarlijkse facturatie krijgt u ${f.annualFreeMonths} maanden gratis. En tijdens de ${f.trialDays} dagen proefperiode wordt niets afgeschreven.`,
        ],
        cta: { label: 'Begin de proefperiode', target: 'trial' },
      };
    },
    P7: (f) => ({
      category: 'marketing',
      subject: 'Het juiste moment voor {company}?',
      preheader: 'Laatste e-mail van deze reeks: antwoord gewoon “later” of “nee”.',
      body: [
        'Dit is de laatste e-mail van deze reeks: we willen uw inbox niet volstoppen.',
        'Is het niet het juiste moment, antwoord dan gewoon “later” of “nee”; daar houden we rekening mee. Anders ontvangt u hooguit één e-mail per maand, met een praktische tip; met de link onderaan dit bericht meldt u zich met één klik af.',
        `En wanneer u het wilt proberen: ${f.trialDays} dagen, ${f.trialMinutes} belminuten, niets afgeschreven tijdens de proefperiode.`,
      ],
      cta: { label: 'Start mijn proefperiode', target: 'trial' },
      closing: 'Bedankt voor uw aandacht,',
    }),

    // ---------- I: account zonder proefperiode (I1 essential, daarna marketing) ----------
    I1: (f) => ({
      category: 'essential',
      subject: 'Uw account is aangemaakt: nog één stap om de proefperiode te starten',
      preheader: 'De proefperiode start zodra u in uw klantomgeving een abonnement kiest.',
      body: [
        `Uw klantomgeving bij ${f.brand} staat klaar.`,
        `Ter informatie: de gratis proefperiode van ${f.trialDays} dagen (${f.trialMinutes} belminuten) start zodra u in uw klantomgeving een abonnement kiest. Er wordt om een creditcard gevraagd, maar tijdens de proefperiode wordt niets afgeschreven; zegt u vóór het einde op via Billing info, dan betaalt u niets.`,
        'De klantomgeving is in het Engels, maar de ingebouwde hulpassistent helpt u in het Nederlands, schriftelijk of gesproken.',
      ],
      cta: { label: 'Mijn abonnement kiezen', target: 'plans' },
    }),
    I2: () => ({
      category: 'marketing',
      subject: 'Bel uw eigen agent',
      preheader: 'Chat, browser, echt gesprek: controleer alles voordat u hem een klant toevertrouwt.',
      body: [
        'De beste demonstratie is uw eigen agent: hij neemt op namens {company}, met uw openingstijden en uw diensten.',
        'U kunt alles controleren voordat u hem ook maar één klant toevertrouwt:',
        { ol: ['de testchat, om zijn instructies bij te stellen;', 'het gesprek in de browser, om zijn stem te horen;', 'een echt gesprek vanaf uw mobiel.'] },
        'U schakelt uw gesprekken pas door als het resultaat u bevalt. De gids “Uw agent testen” beschrijft elke stap.',
      ],
      cta: { label: 'Start de proefperiode en test', target: 'plans' },
    }),
    I3: (f) => ({
      category: 'marketing',
      subject: 'Zullen we uw agent samen instellen?',
      preheader: 'We bellen u terug om de agent samen met u in te stellen.',
      body: [
        'Nog geen tijd gehad om te beginnen? We kunnen het samen met u doen.',
        `Beantwoord deze e-mail met een tijdstip en het nummer waarop we u kunnen bereiken, of vraag begeleiding aan op onze pagina over de proefperiode. We bellen u terug om de agent van {company} samen met u in te stellen (instructies, agenda, doorschakelen) en uw proefperiode van ${f.trialDays} dagen goed te laten beginnen.`,
      ],
      cta: { label: 'Begeleiding aanvragen', target: 'trial_assist' },
    }),
    I4: (f) => ({
      category: 'marketing',
      subject: `${f.trialMinutes} proefminuten: waar zet u ze in?`,
      preheader: 'Gebruik ze voor de gesprekken die u nu mist.',
      body: [
        `${f.trialMinutes} minuten zijn ongeveer ${f.trialShortCalls} gesprekken van ${f.shortCallMinutes} minuten. Genoeg om te oordelen, als u ze op de juiste plek inzet.`,
        'Ons advies: schakel niet alles door. Zet doorschakelen alleen aan als u niet opneemt, of ’s avonds en in het weekend. Dat zijn de gesprekken die {company} nu misloopt, en daar is de agent het nuttigst.',
        'U leest de samenvatting van elk gesprek in uw klantomgeving en ziet meteen of het u helpt.',
      ],
      cta: { label: 'Abonnement kiezen en proefperiode starten', target: 'plans' },
    }),
    I5: (f) => {
      const { receptionniste: r, assistant: a, 'centre-appels': c } = f.plans;
      return {
        category: 'marketing',
        subject: 'Met welk abonnement begint u?',
        preheader: 'Een eenvoudige richtlijn op basis van uw belvolume.',
        body: [
          'Twijfelt u? Dan is dit een eenvoudige richtlijn (prijzen excl. btw per maand):',
          {
            ul: [
              `${r.name}, ${r.price}: ${r.minutes} minuten, ongeveer ${r.shortCalls} gesprekken van ${f.shortCallMinutes} minuten;`,
              `${a.name}, ${a.price}: ${a.minutes} minuten, plus credits om schriftelijk te antwoorden (websitechat, WhatsApp);`,
              `${c.name}, ${c.price}: ${c.minutes} minuten.`,
            ],
          },
          `U hoeft niet meteen de juiste keuze te maken: u wisselt op elk moment van abonnement, zonder verplichtingen, en de wijziging wordt getoond voordat u bevestigt. Tijdens de ${f.trialDays} dagen proefperiode wordt niets afgeschreven.`,
        ],
        cta: { label: 'Mijn abonnement kiezen', target: 'plans' },
      };
    },
    I6: (f) => ({
      category: 'marketing',
      subject: 'Nog niet klaar voor een abonnement? Betaal per minuut',
      preheader: `${f.paygMinute} excl. btw per minuut, tegoed vervalt niet.`,
      body: [
        `Een abonnement past niet bij iedereen. U kunt uw agent ook zonder abonnement gebruiken: u voegt tegoed toe wanneer u wilt (Add credits), een minuut kost ${f.paygMinute} excl. btw en het tegoed vervalt niet.`,
        `U hebt dan dezelfde functies als het ${f.plans.receptionniste.name}-abonnement. Bij deze formule hoort geen gratis proefperiode: u betaalt alleen wat u toevoegt. Zodra u regelmatig gebeld wordt, is een abonnement per minuut goedkoper.`,
      ],
      cta: { label: 'Tegoed toevoegen', target: 'credits' },
    }),
    I7: (f) => ({
      category: 'marketing',
      subject: 'Uw klantomgeving blijft open',
      preheader: 'Laatste e-mail van deze reeks: de proefperiode blijft beschikbaar.',
      body: [
        `Dit is onze laatste e-mail van deze reeks. Uw klantomgeving bij ${f.brand} blijft open: de proefperiode van ${f.trialDays} dagen (${f.trialMinutes} minuten, niets afgeschreven tijdens de proefperiode) start zodra u een abonnement kiest.`,
        'Liep u ergens op vast? Laat het ons in één regel weten: daar hebben we echt iets aan.',
        'Daarna schrijven we u hooguit één keer per maand. Wilt u niets meer ontvangen, klik dan op de afmeldlink onderaan deze e-mail.',
      ],
      cta: { label: 'Starten wanneer u er klaar voor bent', target: 'plans' },
    }),

    // ---------- C: lopende proefperiode (essential, puur informatief) ----------
    C1: (f) => ({
      category: 'essential',
      subject: 'Uw proefperiode is begonnen: 3 stappen om er alles uit te halen',
      preheader: 'Uw proefperiode loopt tot {trial_end_date}.',
      body: [
        `Uw proefperiode bij ${f.brand} is begonnen. Deze loopt tot {trial_end_date}, met ${f.trialMinutes} belminuten.`,
        'Zo haalt u er alles uit:',
        {
          ol: [
            'Maak uw agent aan op basis van een sjabloon en pas zijn instructies aan {company} aan.',
            'Koppel uw agenda (Cal.com of Calendly) als u wilt dat hij afspraken inplant.',
            'Bel hem zelf en zet doorschakelen aan zodra het resultaat u bevalt.',
          ],
        },
        'Tijdens de proefperiode wordt niets afgeschreven. U kunt vóór {trial_end_date} opzeggen via Billing info.',
        'Goed om te weten: de proefperiode bevat belminuten, maar geen berichtcredits. De schriftelijke AI-antwoorden (websitechat, WhatsApp, Messenger) gebruiken die credits, die u kunt toevoegen via Add credits.',
      ],
      cta: { label: 'Mijn klantomgeving openen', target: 'app' },
    }),
    C2: () => ({
      category: 'essential',
      skipIfEssentialOnly: true,
      subject: 'Uw agent wacht op zijn eerste gesprek',
      preheader: 'Twee korte stappen naar zijn eerste gesprek.',
      body: [
        'Uw agent heeft nog geen gesprek ontvangen. Dat is vaak de laatste stap, en die is kort:',
        {
          ol: [
            'Bel hem vanaf uw mobiel en stel een vraag die een klant zou stellen.',
            'Bevalt het antwoord, zet dan bij uw provider doorschakelen aan voor als u niet opneemt.',
          ],
        },
        'U houdt uw nummer en kunt doorschakelen op elk moment uitzetten. Uw proefperiode loopt tot {trial_end_date}.',
      ],
      cta: { label: 'Mijn klantomgeving openen', target: 'app' },
    }),
    C3: () => ({
      category: 'essential',
      skipIfEssentialOnly: true,
      subject: 'Verbeter uw agent met zijn eerste gesprekken',
      preheader: 'Lees de samenvattingen terug en vul zijn instructies aan.',
      body: [
        'Uw eerste gesprekken zijn de beste bron om uw agent te verbeteren. Lees in uw klantomgeving de samenvattingen terug en let op:',
        {
          ul: [
            'vragen die niet goed werden afgehandeld: voeg de informatie toe aan zijn instructies;',
            'wat hij nooit mag beloven: zet het op een rij, dan verwijst hij die onderwerpen naar u door;',
            'gesprekken die rechtstreeks naar u moeten: stel het doorverbinden in bij “Tools & actions”.',
          ],
        },
        'De gids “De instructies van de agent schrijven” geeft de 5 onderdelen van goede instructies, en de schrijfassistent (AI Prompt Editor) helpt u ze op te stellen.',
      ],
      cta: { label: 'Mijn klantomgeving openen', target: 'app' },
    }),
    C4: (f) => ({
      category: 'essential',
      subject: `Resterende proefminuten: {minutes_left} van ${f.trialMinutes}`,
      preheader: `Wat er gebeurt zodra de ${f.trialMinutes} minuten op zijn.`,
      body: [
        `U hebt nog {minutes_left} van de ${f.trialMinutes} minuten van uw proefperiode.`,
        `Ter informatie: zodra de ${f.trialMinutes} minuten op zijn, stoppen de gesprekken tot het einde van de proefperiode op {trial_end_date}, of tot u uw {plan_name}-abonnement start via Billing info. Doet u niets, dan start het abonnement vanzelf aan het einde van de proefperiode, tenzij u het vóór die tijd opzegt.`,
        'U beslist zelf.',
      ],
      cta: { label: 'Mijn abonnement bekijken', target: 'billing' },
    }),
    C4_exhausted: (f) => ({
      category: 'essential',
      subject: `Uw ${f.trialMinutes} proefminuten zijn op`,
      preheader: 'Wat er nu gebeurt, tot het einde van uw proefperiode.',
      body: [
        `De ${f.trialMinutes} minuten van uw proefperiode zijn op: de gesprekken zijn gestopt tot het einde van de proefperiode op {trial_end_date}, of tot u uw {plan_name}-abonnement start via Billing info.`,
        'Doet u niets, dan start het abonnement vanzelf aan het einde van de proefperiode, tenzij u het vóór die tijd opzegt.',
        'U beslist zelf.',
      ],
      cta: { label: 'Mijn abonnement bekijken', target: 'billing' },
    }),
    C5: () => ({
      category: 'essential',
      subject: 'Uw proefperiode eindigt op {trial_end_date}',
      preheader: 'Wat er op die datum gebeurt, en hoe u opzegt zonder afschrijving.',
      body: [
        'Uw proefperiode eindigt op {trial_end_date}.',
        {
          ul: [
            'Wilt u doorgaan? Dan hoeft u niets te doen. Uw {plan_name}-abonnement start op die dag, en de eerste maand ({plan_price} excl. btw, belastingen afhankelijk van uw land) wordt van uw creditcard afgeschreven.',
            'Wilt u niet doorgaan? Zeg dan vóór die datum op via Billing info, knop “Cancel subscription”. Er wordt niets afgeschreven.',
          ],
        },
        'Een vraag over uw abonnement of uw minuten? Beantwoord deze e-mail.',
      ],
      cta: { label: 'Mijn abonnement beheren', target: 'billing' },
    }),
    C5_annual: () => ({
      category: 'essential',
      subject: 'Uw proefperiode eindigt op {trial_end_date}',
      preheader: 'Wat er op die datum gebeurt, en hoe u opzegt zonder afschrijving.',
      body: [
        'Uw proefperiode eindigt op {trial_end_date}.',
        {
          ul: [
            'Wilt u doorgaan? Dan hoeft u niets te doen. Uw {plan_name}-abonnement start op die dag met jaarlijkse facturering: het eerste jaar ({plan_price} excl. btw, belastingen afhankelijk van uw land) wordt in één keer van uw creditcard afgeschreven.',
            'Wilt u niet doorgaan? Zeg dan vóór die datum op via Billing info, knop “Cancel subscription”. Er wordt niets afgeschreven.',
          ],
        },
        'Een vraag over uw abonnement of uw minuten? Beantwoord deze e-mail.',
      ],
      cta: { label: 'Mijn abonnement beheren', target: 'billing' },
    }),
    C5_cancelled: () => ({
      category: 'essential',
      subject: 'Uw proefperiode eindigt op {trial_end_date}: er wordt niets afgeschreven',
      preheader: 'Uw opzegging is geregistreerd.',
      body: [
        'U hebt uw abonnement tijdens de proefperiode opgezegd: uw opzegging is geregistreerd.',
        'Uw proefperiode blijft actief tot {trial_end_date}. Uw abonnement start niet op die datum, en er wordt niets van uw creditcard afgeschreven.',
        'Was dit een vergissing, of hebt u een vraag? Beantwoord dan gewoon deze e-mail.',
      ],
      cta: { label: 'Mijn abonnement bekijken', target: 'billing' },
    }),

    // ---------- F: proefperiode afgelopen zonder abonnement (F1 essential, daarna marketing) ----------
    F1: (f) => ({
      category: 'essential',
      subject: 'Uw proefperiode is afgelopen, er is niets afgeschreven',
      preheader: 'Eén vraag: een antwoord van één regel is genoeg.',
      body: [
        'Uw proefperiode is afgelopen zonder abonnement: er is niets afgeschreven, en dat is uiteraard uw goed recht.',
        'Wilt u ons in één regel laten weten wat er ontbrak? De stem, de antwoorden, het instellen, de prijs, het moment… Beantwoord gewoon deze e-mail: ons team leest elk antwoord, en als een instelling het verschil kan maken, laten we het u weten.',
        `Bedankt dat u ${f.brand} hebt geprobeerd.`,
      ],
      cta: null,
    }),
    F1_payment_failed: () => ({
      category: 'essential',
      subject: 'Uw proefperiode is afgelopen: de betaling is niet gelukt',
      preheader: 'Uw abonnement is niet gestart en er is niets afgeschreven.',
      body: [
        'Uw proefperiode is afgelopen, maar de betaling van uw abonnement is niet gelukt. Uw abonnement is daardoor niet gestart en er is niets afgeschreven.',
        'Wilt u doorgaan? Voeg dan een geldige creditcard toe in Billing info (tabblad Wallet) en kies daarna opnieuw uw abonnement.',
        'Een vraag of hulp nodig? Beantwoord gewoon deze e-mail.',
      ],
      cta: { label: 'Mijn creditcard bijwerken', target: 'billing' },
    }),
    F2: (f) => ({
      category: 'marketing',
      subject: 'Houd uw agent, zonder abonnement',
      preheader: 'Betalen per gebruik, zonder abonnement.',
      body: [
        'Hield het abonnement u tegen? Er is ook een andere formule: betalen per gebruik.',
        `Uw klantomgeving blijft toegankelijk. U voegt tegoed toe wanneer u wilt (Add credits), een minuut kost ${f.paygMinute} excl. btw, zonder abonnement, en het tegoed vervalt niet. U houdt dezelfde functies als het ${f.plans.receptionniste.name}-abonnement. Een gesprek van ${f.exampleCallMinutes} minuten kost ongeveer ${f.exampleCallPayg} excl. btw.`,
      ],
      cta: { label: 'Tegoed toevoegen', target: 'credits' },
    }),
    F3: () => ({
      category: 'marketing',
      subject: 'En als de agent alleen ’s avonds en in het weekend opneemt?',
      preheader: 'Als aanvulling op uw team, niet in plaats ervan.',
      body: [
        'Veel bedrijven gebruiken de agent niet voor alles. Ze zetten hem in als aanvulling op hun team: hij neemt het over ’s avonds, in het weekend, tijdens de lunchpauze of als alle lijnen bezet zijn.',
        'U stelt bij uw provider eenvoudig doorschakelen in voor die momenten. De rest van de tijd verandert er niets voor {company}, en gesprekken die op de voicemail terechtkwamen, krijgen eindelijk antwoord, met een samenvatting voor u.',
      ],
      cta: { label: 'Verdergaan met een abonnement', target: 'plans' },
    }),
    F4: () => ({
      category: 'marketing',
      subject: 'De 3 instellingen die het meeste verschil maken',
      preheader: 'Meestal ontbreekt er informatie in zijn instructies.',
      body: [
        'Valt een agent tegen tijdens de proefperiode, dan ontbreekt er meestal informatie in zijn instructies. De drie instellingen die het resultaat het meest veranderen:',
        {
          ol: [
            'Volledige praktische informatie: openingstijden, werkgebied, richtprijzen, termijnen.',
            'De lijst van wat hij nooit mag doen, zodat hij die onderwerpen naar u doorverwijst.',
            'Doorverbinden naar uw team voor gevoelige gevallen, inbegrepen in alle abonnementen.',
          ],
        },
        'De schrijfassistent in uw klantomgeving (AI Prompt Editor) helpt u ze op te stellen.',
      ],
      cta: { label: 'Verdergaan met deze instellingen', target: 'plans' },
    }),
    F5: (f) => {
      const { receptionniste: r, assistant: a, 'centre-appels': c } = f.plans;
      return {
        category: 'marketing',
        subject: 'Hoe meer gesprekken, hoe goedkoper de minuut',
        preheader: 'De werkelijke minuutprijs, per abonnement.',
        body: [
          'In een abonnement daalt de werkelijke minuutprijs naarmate het volume stijgt:',
          {
            ul: [
              `${r.name}, ${r.price} excl. btw/maand voor ${r.minutes} minuten: ongeveer ${r.perMinute} per minuut;`,
              `${a.name}, ${a.price} excl. btw/maand voor ${a.minutes} minuten: ongeveer ${a.perMinute};`,
              `${c.name}, ${c.price} excl. btw/maand voor ${c.minutes} minuten: ongeveer ${c.perMinute}.`,
            ],
          },
          `Bij maandelijkse facturatie zit u nergens aan vast: u zegt op elk moment op via Billing info. Bij jaarlijkse facturatie betaalt u ${f.annualPaidMonths} maanden voor 12. De calculator op onze pagina Prijzen kiest het goedkoopste abonnement voor uw gesprekken.`,
        ],
        cta: { label: 'Vergelijken en kiezen', target: 'pricing' },
      };
    },
    F6: () => ({
      category: 'marketing',
      subject: 'Zullen we u helpen bij het instellen?',
      preheader: 'Iemand van ons team belt u terug, zonder verplichtingen.',
      body: [
        'Vaak ligt het niet aan de agent, maar aan een ontbrekende instructie of verkeerd ingesteld doorschakelen.',
        'Beantwoord deze e-mail met een tijdstip en het nummer waarop we u kunnen bereiken: iemand van ons team belt u terug om de agent van {company} samen met u in te stellen (instructies, doorverbinden, doorschakelen), voordat u een abonnement kiest. Zonder verplichtingen, gewoon een gesprek.',
      ],
      cta: null,
    }),
    F7: (f) => ({
      category: 'marketing',
      subject: 'We stoppen hier, bedankt voor het proberen',
      preheader: 'Laatste e-mail van deze reeks.',
      body: [
        `Dit is onze laatste e-mail van deze reeks. Bedankt dat u ${f.brand} hebt geprobeerd.`,
        `Uw klantomgeving blijft toegankelijk: u kunt verdergaan met een abonnement, zonder verplichtingen, of per gebruik, voor ${f.paygMinute} excl. btw per minuut.`,
        SERIES_END_UNSUBSCRIBE,
      ],
      cta: { label: 'Mijn klantomgeving', target: 'app' },
    }),

    // ---------- U: weinig actieve accounts met betalen per gebruik (U1 essential, daarna marketing) ----------
    U1: () => ({
      category: 'essential',
      subject: 'Komen uw gesprekken goed bij uw agent aan?',
      preheader: 'Een controle van één minuut.',
      body: [
        'Uw agent heeft de afgelopen 30 dagen weinig gesprekken ontvangen. Misschien is dat de bedoeling, maar soms staat doorschakelen uit of is het verkeerd ingesteld.',
        'Controle in één minuut:',
        {
          ol: [
            'Bel uw gewone nummer op een moment waarop doorschakelen actief moet zijn.',
            'Neemt de agent niet op, controleer dan het doorschakelen bij uw provider, of het gekoppelde nummer in uw klantomgeving.',
          ],
        },
        'Werkt alles, dan hoeft u niets te veranderen.',
      ],
      cta: { label: 'Mijn klantomgeving openen', target: 'app' },
    }),
    U2: () => ({
      category: 'marketing',
      subject: 'Laat hem alleen de gesprekken aannemen die u mist',
      preheader: 'Alleen doorschakelen als u niet opneemt.',
      body: [
        'U hoeft niet alles aan de agent over te laten. Met doorschakelen bij geen gehoor of bezet (als uw provider dat aanbiedt) neemt u zelf op wanneer u kunt, en neemt de agent het alleen over wanneer u niet kunt.',
        'Resultaat: minder gemiste gesprekken voor {company}, en u betaalt alleen de minuten die u echt gebruikt.',
      ],
      cta: { label: 'Mijn klantomgeving', target: 'app' },
    }),
    U3: (f) => {
      const r = f.plans.receptionniste;
      return {
        category: 'marketing',
        subject: 'Vanaf wanneer is een abonnement goedkoper?',
        preheader: 'De rekensom, met de minuutprijs bij betalen per gebruik.',
        body: [
          `De rekensom is eenvoudig: bij ${f.paygMinute} excl. btw per minuut komt ${r.price} overeen met ongeveer ${f.breakEvenMinutes} minuten.`,
          {
            ul: [
              `Minder dan ${f.breakEvenMinutes} minuten per maand: blijf bij betalen per gebruik, dat is het voordeligst.`,
              `Meer dan ${f.breakEvenMinutes} minuten: het ${r.name}-abonnement (${r.minutes} minuten voor ${r.price} excl. btw) is goedkoper, ongeveer ${r.perMinute} per minuut.`,
            ],
          },
          'U volgt uw verbruik in uw klantomgeving, en een abonnement zegt u op elk moment op via Billing info.',
        ],
        cta: { label: 'Mijn verbruik bekijken', target: 'app' },
      };
    },
    U4: () => ({
      category: 'marketing',
      subject: 'Twee functies die al in uw account zitten',
      preheader: 'Doorverbinden en de agenda, zonder kosten per gebruik.',
      body: [
        'Twee functies zijn al inbegrepen, zonder kosten per gebruik:',
        {
          ul: [
            'doorverbinden: de agent geeft belangrijke gesprekken (ontevreden klant, spoed) door aan uw team, volgens uw regels, in “Tools & actions”; de doorverbonden duur gaat van uw minuten af;',
            'de agenda: gekoppeld via Cal.com of Calendly boekt de agent uw vrije tijdsloten tijdens het gesprek.',
          ],
        },
        'En om nooit zonder tegoed te komen zitten, kunt u automatisch opwaarderen inschakelen; u krijgt nu al een melding per e-mail wanneer uw saldo laag wordt.',
      ],
      cta: { label: 'Mijn klantomgeving', target: 'app' },
    }),
    U5: (f) => {
      const x = f.assistantExtras;
      if (!x) return null;
      const a = f.plans.assistant;
      return {
        category: 'marketing',
        subject: 'Ook schriftelijk antwoorden, met uw eigen stem',
        preheader: `Wat het ${a.name}-abonnement toevoegt, zonder verplichtingen.`,
        body: [
          `Bij betalen per gebruik hebt u de functies van het ${f.plans.receptionniste.name}-abonnement, zonder inbegrepen berichtcredits. Het ${a.name}-abonnement (${a.price} excl. btw per maand) voegt toe:`,
          {
            ul: [
              `${a.minutes} belminuten en ${x.agents} agents;`,
              `${x.messageCredits} berichtcredits per maand, ofwel ongeveer ${x.writtenReplies} schriftelijke AI-antwoorden (websitechat, WhatsApp);`,
              `${x.clonedVoices} gekloonde stem: die van uzelf, of van iemand die u daarvoor schriftelijk toestemming heeft gegeven. De agent meldt altijd dat hij een AI is.`,
            ],
          },
          'Zonder verplichtingen, op elk moment op te zeggen via Billing info.',
        ],
        cta: { label: 'Abonnementen bekijken', target: 'plans' },
      };
    },
    U6: (f) => ({
      category: 'marketing',
      subject: 'Uw formule, uw tempo',
      preheader: 'Laatste e-mail van deze reeks.',
      body: [
        'Dit is onze laatste e-mail van deze reeks. Kort samengevat:',
        {
          ul: [
            `weinig gesprekken: betalen per gebruik, voor ${f.paygMinute} excl. btw per minuut, past het best, en uw tegoed vervalt niet;`,
            `regelmatig gesprekken: een abonnement is goedkoper, zonder verplichtingen bij maandelijkse facturatie, met ${f.annualFreeMonths} maanden gratis bij jaarlijkse facturatie.`,
          ],
        },
        SERIES_END_UNSUBSCRIBE,
      ],
      cta: { label: 'Mijn klantomgeving', target: 'app' },
    }),

    // ---------- A : mise en route (service, audit du 9 oct., § 7) ----------
    A1: (f) => ({
      category: 'essential',
      subject: 'Uw agent is nog niet aangemaakt: ongeveer tien minuten is genoeg',
      preheader: 'Drie stappen zodat hij uw gesprekken aanneemt.',
      body: [
        `Uw klantomgeving bij ${f.brand} staat klaar, maar er is nog geen agent aangemaakt. De agent neemt uw gesprekken aan, en het aanmaken duurt ongeveer tien minuten:`,
        {
          ol: [
            'Open in uw klantomgeving „Assistants”, daarna „Create”, en begin met een sjabloon.',
            'Pas de instructies aan voor {company}: openingstijden, diensten, wat hij voor u moet noteren.',
            'Test hem en koppel er daarna een nummer aan: „Get new phone number” als u er nog geen hebt (maandelijkse optie), daarna onderdeel „General”, veld „Phone number”.',
          ],
        },
        'Hulp nodig? De hulpassistent (chatknop rechtsonder in uw klantomgeving) begeleidt u stap voor stap, in het Nederlands, schriftelijk of gesproken.',
      ],
      cta: { label: 'Mijn agent aanmaken', target: 'app' },
      secondary: { label: 'Stappenplan: een agent aanmaken', target: 'guide_create' },
    }),
    A2: () => ({
      category: 'essential',
      subject: 'Zullen we uw agent samen met u aanmaken?',
      preheader: 'Laat uw nummer achter: we bellen u terug om hem samen aan te maken.',
      body: [
        'Uw agent is nog steeds niet aangemaakt. Hebt u weinig tijd, of weet u niet goed waar u moet beginnen? Dan stellen we hem telefonisch samen met u in.',
        'Laat uw nummer en een geschikt moment achter: we bellen u terug om de agent van {company} samen met u aan te maken (instructies, nummer, doorschakelen). U kunt ook deze e-mail beantwoorden met een tijdstip.',
      ],
      cta: { label: 'Bel mij terug om samen in te stellen', target: 'setup_assist' },
      after: ['Doet u het liever zelf? De gids „Een agent aanmaken en bewerken” beschrijft elke stap, en de hulpassistent in uw klantomgeving beantwoordt uw vragen.'],
      secondary: { label: 'De gids lezen', target: 'guide_create' },
    }),
    A3: () => ({
      category: 'essential',
      skipIfEssentialOnly: true,
      subject: 'Uw proefperiode loopt tot {trial_end_date}: uw agent is nog niet aangemaakt',
      preheader: 'Er is nog tijd om hem te testen, en we kunnen hem samen met u instellen.',
      body: [
        'Uw proefperiode loopt tot {trial_end_date}, maar uw agent is nog niet aangemaakt. Dit is ons laatste bericht hierover.',
        'Er is nog tijd om hem op echte gesprekken te testen: we kunnen hem telefonisch samen met u instellen. Laat uw nummer achter, of beantwoord deze e-mail met een tijdstip.',
        'Bent u van gedachten veranderd? Dan kunt u vóór {trial_end_date} opzeggen via Billing info: er wordt niets afgeschreven.',
      ],
      cta: { label: 'Bel mij terug om samen in te stellen', target: 'setup_assist' },
    }),
    A3_active: (f) => ({
      category: 'essential',
      skipIfEssentialOnly: true,
      subject: 'Uw account is actief, maar uw agent is nog niet aangemaakt',
      preheader: 'We kunnen hem telefonisch samen met u instellen.',
      body: [
        `Uw account bij ${f.brand} is actief, maar uw agent is nog niet aangemaakt: op dit moment worden er dus geen gesprekken aangenomen. Dit is ons laatste bericht hierover.`,
        'We kunnen hem telefonisch samen met u instellen: laat uw nummer achter, of beantwoord deze e-mail met een tijdstip.',
      ],
      cta: { label: 'Bel mij terug om samen in te stellen', target: 'setup_assist' },
    }),
    A4: () => ({
      category: 'essential',
      skipIfEssentialOnly: true,
      subject: 'Uw agent staat klaar: test hem en zet doorschakelen aan',
      preheader: 'Drie controles vóór zijn eerste gesprekken.',
      body: [
        'Uw agent is aangemaakt, maar heeft nog geen echt gesprek ontvangen. Meestal zijn drie controles genoeg:',
        {
          ol: [
            'Koppel er een nummer aan: hebt u er nog geen, vraag er dan een aan via „Get new phone number” (maandelijkse optie, prijs zichtbaar vóór aankoop) en open daarna in „Assistants” de agent, onderdeel „General”, veld „Phone number”.',
            'Bel dat nummer vanaf uw mobiel en stel een vraag die een klant zou stellen.',
            'Bevalt het antwoord, zet dan bij uw provider doorschakelen naar dat nummer aan, bijvoorbeeld alleen als u niet opneemt. U houdt uw eigen nummer.',
          ],
        },
        'De twee gidsen hieronder beschrijven elke stap, en de hulpassistent in uw klantomgeving beantwoordt uw vragen.',
      ],
      cta: { label: 'Gids: uw agent testen', target: 'guide_test' },
      secondary: { label: 'Gids: uw eigen nummer houden met doorschakelen', target: 'guide_forwarding' },
    }),
    A_monthly: () => ({
      category: 'essential',
      skipIfEssentialOnly: true,
      subject: 'Uw agent heeft de afgelopen 30 dagen geen gesprekken ontvangen',
      preheader: 'Een controle van één minuut, zelf of samen met ons.',
      body: [
        'Uw agent heeft de afgelopen 30 dagen geen enkel gesprek ontvangen. Misschien is dat de bedoeling, maar vaak is het een nummer dat niet meer aan de agent gekoppeld is, of doorschakelen dat uit staat.',
        'Controle in één minuut:',
        {
          ol: [
            'Bel uw gewone nummer op een moment waarop doorschakelen actief moet zijn.',
            'Neemt de agent niet op, controleer dan het doorschakelen bij uw provider, of het nummer dat in uw klantomgeving aan de agent gekoppeld is (onderdeel „General”).',
          ],
        },
        'Kijkt u het liever samen met ons na? Laat uw nummer achter: we bellen u terug om het samen te bekijken.',
      ],
      cta: { label: 'Bel mij terug om samen te controleren', target: 'setup_assist' },
      secondary: { label: 'Gids: uw eigen nummer houden met doorschakelen', target: 'guide_forwarding' },
    }),

    // ---------- S : solde de minutes d’un abonné ou d’un compte à la minute (service ; l’essai a C4) ----------
    S1: (f) => ({
      category: 'essential',
      subject: 'Resterende belminuten: {minutes_left}',
      preheader: 'Wat er gebeurt als uw saldo op 0 komt.',
      body: [
        `Ter informatie: het minutensaldo van uw account bij ${f.brand} is laag (resterende minuten: {minutes_left}).`,
        'Komt het op 0, dan neemt uw agent geen gesprekken meer aan tot er minuten worden toegevoegd: bij de verlenging van uw abonnement als u er een hebt, of op elk moment via Add credits.',
        'Is dit niveau voor u in orde, dan hoeft u niets te doen.',
      ],
      cta: { label: 'Mijn minuten bekijken', target: 'credits' },
    }),
    S2: (f) => ({
      category: 'essential',
      subject: 'Uw minutensaldo is op: uw agent neemt geen gesprekken meer aan',
      preheader: 'Hij neemt weer gesprekken aan zodra er minuten zijn toegevoegd.',
      body: [
        `Het minutensaldo van uw account bij ${f.brand} staat op 0: uw agent neemt op dit moment geen gesprekken aan.`,
        'Hij neemt weer gesprekken aan zodra er minuten worden toegevoegd: bij de verlenging van uw abonnement als u er een hebt, of meteen via Add credits.',
        'Vragen? Beantwoord gewoon deze e-mail.',
      ],
      cta: { label: 'Minuten toevoegen', target: 'credits' },
    }),
  },

  // ---------- M: maandelijkse opvolging (marketing) ----------
  monthly: {
    // Vaste volgorde, ontleend aan de gepubliceerde gidsen (src/i18n/content/nl/guides.ts).
    topics: [
      {
        slug: 'tester-son-agent',
        title: 'uw agent op 3 manieren testen',
        paragraph: 'Voordat u uw agent ook maar één klant toevertrouwt, test u hem op drie manieren: de testchat om zijn instructies te controleren, het gesprek in de browser om zijn stem te horen, en daarna een echt telefoongesprek, de enige test die alle tools valideert, ook het doorverbinden. Spraaktests verbruiken minuten, net als echte gesprekken.',
      },
      {
        slug: 'consignes-system-prompt',
        title: 'de 5 onderdelen van goede instructies',
        paragraph: 'Goede instructies bestaan uit vijf onderdelen: de rol van de agent (hij meldt vanaf het begin dat hij een AI is), zijn stijl, de belangrijkste informatie (diensten, openingstijden, tarieven, adres), de regels (wanneer doorverbinden, wat hij nooit mag beloven) en het verloop van veelvoorkomende situaties. Lees regelmatig de transcripties van uw gesprekken terug en voeg de gevallen toe die niet goed werden afgehandeld.',
      },
      {
        slug: 'consignes-system-prompt',
        title: 'wat uw agent nooit mag doen',
        paragraph: 'U bepaalt wat uw agent nooit mag doen: een prijsopgave geven, een diagnose stellen, een termijn beloven. Zet het in zijn instructies: dan verwijst hij die onderwerpen door naar uw team, met een samenvatting van de vraag.',
      },
      {
        slug: 'renvoi-d-appel',
        title: 'uw eigen nummer houden met doorschakelen',
        paragraph: 'U houdt uw nummer op uw visitekaartjes, uw website en uw advertenties: bij uw provider zet u doorschakelen naar het nummer van de agent aan, voor al uw gesprekken of alleen voor de gesprekken die u niet aanneemt. Voor uw klanten verandert er niets. Doorschakelen wordt gefactureerd door uw provider: controleer uw abonnement.',
      },
    ],
    prospect: (f) => ({
      category: 'marketing',
      subject: 'De tip van de maand: {topic_title}',
      preheader: 'Een praktische tip uit onze gidsen.',
      body: ['{topic_paragraph}'],
      cta: { label: `Probeer het ${f.trialDays} dagen`, target: 'trial' },
      after: ['Dit is een maandelijkse e-mail; onderaan dit bericht meldt u zich met één klik af.'],
    }),
    account: () => ({
      category: 'marketing',
      subject: 'De tip van de maand: {topic_title}',
      preheader: 'Een praktische tip uit onze gidsen.',
      body: ['{topic_paragraph}'],
      cta: { label: 'Mijn klantomgeving openen', target: 'app' },
      after: ['Dit is een maandelijkse e-mail; onderaan dit bericht meldt u zich met één klik af.'],
    }),
  },
};

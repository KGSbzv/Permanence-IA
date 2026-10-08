// Relances commerciales et messages de cycle de vie en anglais (Royaume-Uni et Australie) : séries P, I, C, F, U et
// suivi mensuel M. Traduction de src/i18n/content/fr/ui/relances.ts (la source, où sont écrites les règles).
// Rappels : aucun chiffre en dur (tout vient de `RelanceFacts`), variables {entre accolades} gardées telles quelles,
// messages « essential » sans argument de vente. Prix en US$ comme sur le site, donc pas de variante en-AU.
import type { RelancesContent } from '../../fr/ui/relances';

const lowerFirst = (s: string) => (s ? s.charAt(0).toLocaleLowerCase('en-GB') + s.slice(1) : s);
const SERIES_END_UNSUBSCRIBE = 'From now on we’ll write at most once a month. To stop receiving anything, click the unsubscribe link at the bottom of this email.';

export const UI_RELANCES: RelancesContent = {
  shared: {
    greeting: { named: 'Hello {first_name},', anonymous: 'Hello,' },
    companyFallback: 'your business',
    sourceLine: {
      callback_done: 'Following our conversation on {request_date}',
      callback: 'Following your callback request',
      trial_request: 'Following your request for help getting your trial started',
      agent_lead: 'Following your conversation with our assistant',
      demo: 'Following your call with our live demo',
      contact: 'Following your message',
    },
    signature: (brand) => `The ${brand} team`,
    ctaLine: (label, url) => `${label}: ${url}`,
    list: (items) => {
      const l = items.map((s) => lowerFirst(s.trim().replace(/\.$/, '')));
      return l.length < 2 ? l.join('') : `${l.slice(0, -1).join(', ')} and ${l[l.length - 1]}`;
    },
    clause: (sentence) => lowerFirst(sentence.trim()),
  },

  messages: {
    // ---------- P : prospects non inscrits (marketing) ----------
    P1: (f) => ({
      category: 'marketing',
      subject: '{first_name}, try the agent on your real calls',
      subjectNoName: 'Try the agent on your real calls',
      preheader: `${f.trialDays}-day trial, ${f.trialMinutes} minutes of calls, nothing charged during the trial.`,
      body: [
        `{source_line}, thank you for your interest in ${f.brand}.`,
        'The easiest way to make up your mind: try the agent on the calls {company} receives.',
        {
          ol: [
            `Create your account and choose the plan you want to try: your ${f.trialDays}-day trial starts, with ${f.trialMinutes} minutes of calls.`,
            'A card is required, but nothing is charged during the trial.',
            'If it’s not for you, cancel before the end from Billing info: you pay nothing.',
          ],
        },
      ],
      cta: { label: 'Start my trial', target: 'trial' },
      after: ['Any questions? Just reply to this email: our team reads every reply.'],
    }),
    P2: (f) => {
      const r = f.plans.receptionniste;
      return {
        category: 'marketing',
        subject: 'What are unanswered calls costing you?',
        preheader: 'A simple calculation, with your own figures.',
        body: [
          'An unanswered call is often a customer who simply rings the next number on their list.',
          'Do the maths with your own figures:\nmissed calls per week × 4.3 × average value of a new customer = what {company} may be letting slip every month.',
          `On the other side: the ${r.name} plan, ${r.price} excl. tax per month for ${r.minutes} minutes. The agent answers 24/7, takes the message or books the appointment, and sends you a summary of every call. The calculator on our Pricing page does the comparison for you.`,
          `The best way is still to measure it on your own calls: ${f.trialDays}-day trial, ${f.trialMinutes} minutes included, nothing charged during the trial.`,
        ],
        cta: { label: 'Start my trial', target: 'trial' },
      };
    },
    P3: (f) => ({
      category: 'marketing',
      subject: '{sector_name}: what the agent handles for you',
      preheader: 'What the agent collects for you on these calls.',
      body: [
        'In your line of work, one situation comes up again and again: {sector_problem}',
        'On these calls, the agent collects what you need: {sector_handles}. You get a clear summary and call back when you’re free, or the appointment is already in your calendar (Google Calendar or Outlook, through Cal.com or Calendly).',
        'You start from an instructions template that you adapt to {company}, then test it by chat, in your browser and with a real phone call.',
      ],
      cta: { label: `Try it for ${f.trialDays} days`, target: 'trial' },
    }),
    P3_generic: (f) => ({
      category: 'marketing',
      subject: 'What the agent handles for you',
      preheader: 'What the agent collects for you on these calls.',
      body: [
        'In your line of work, one situation comes up again and again: calls that come in while you’re busy.',
        'On these calls, the agent collects what you need: who is calling, what they need and when to call them back. You get a clear summary and call back when you’re free, or the appointment is already in your calendar (Google Calendar or Outlook, through Cal.com or Calendly).',
        'You start from an instructions template that you adapt to {company}, then test it by chat, in your browser and with a real phone call.',
      ],
      cta: { label: `Try it for ${f.trialDays} days`, target: 'trial' },
    }),
    P4: () => ({
      category: 'marketing',
      subject: 'Your customers will know they’re talking to an AI, and that’s deliberate',
      preheader: 'You write its instructions, its no-go areas and when it passes the call to you.',
      body: [
        'From the start of the call, the agent says that it is an AI: it’s a matter of trust, and your callers appreciate the honesty. Its voice is natural, in the caller’s language.',
        'And you stay in control:',
        {
          ul: [
            'you write its instructions: opening hours, prices, how to answer;',
            'you list what it must never do: give a price quote, make a diagnosis, promise a timeframe;',
            'it transfers the call to your team whenever you’ve said so, or arranges a callback with a summary. Call transfer is included on every plan.',
          ],
        },
      ],
      cta: { label: 'Judge it on your own calls', target: 'trial' },
    }),
    P5: (f) => ({
      category: 'marketing',
      subject: 'You keep your current number',
      preheader: 'Simple call forwarding, with no set-up fee.',
      body: [
        'No need to change your number or tell your customers.',
        'You switch on call forwarding with your phone provider, for example only when you don’t pick up, or in the evenings and at weekends. Your customers dial {company}’s usual number, and the agent takes over when you can’t answer. Your provider may charge for forwarding to an overseas number: check your plan.',
        `No set-up or activation fee. Prefer a dedicated number? It’s an option, from ${f.phoneNumberFrom} excl. tax per month depending on the country.`,
      ],
      cta: { label: 'Start the trial', target: 'trial' },
    }),
    P6: (f) => {
      const { receptionniste: r, assistant: a, 'centre-appels': c } = f.plans;
      return {
        category: 'marketing',
        subject: 'Our prices, no small print',
        preheader: 'Three plans, pay as you go, no commitment.',
        body: [
          'Here are our prices, excluding tax:',
          {
            ul: [
              `${r.name}: ${r.price} per month, ${r.minutes} minutes;`,
              `${a.name}: ${a.price} per month, ${a.minutes} minutes;`,
              `${c.name}: ${c.price} per month, ${c.minutes} minutes;`,
              `no plan: ${f.paygMinute} per minute, with credit that never expires.`,
            ],
          },
          `In practice, a ${f.exampleCallMinutes}-minute call costs about ${f.exampleCallPayg} on pay as you go, and between ${f.exampleCallPlanLow} and ${f.exampleCallPlanHigh} on a plan.`,
          `No commitment: cancel whenever you like from Billing info. On annual billing, you get ${f.annualFreeMonths} months free. And during the ${f.trialDays}-day trial, nothing is charged.`,
        ],
        cta: { label: 'Start the trial', target: 'trial' },
      };
    },
    P7: (f) => ({
      category: 'marketing',
      subject: 'The right time for {company}?',
      preheader: 'Last email in this series: just reply “later” or “no”.',
      body: [
        'This is the last email in this series: we don’t want to clutter your inbox.',
        'If now isn’t the right time, just reply “later” or “no” and we’ll take note. Otherwise, you’ll get at most one email a month, with a practical tip; the link at the bottom of this message unsubscribes you in one click.',
        `And whenever you’d like to try it: ${f.trialDays} days, ${f.trialMinutes} minutes of calls, nothing charged during the trial.`,
      ],
      cta: { label: 'Start my trial', target: 'trial' },
      closing: 'Thank you for reading,',
    }),

    // ---------- I : inscrits sans essai (I1 essential, puis marketing) ----------
    I1: (f) => ({
      category: 'essential',
      subject: 'Your account is ready: one step to start your trial',
      preheader: 'The trial starts when you choose a plan in your customer area.',
      body: [
        `Your ${f.brand} customer area is ready.`,
        `For your information, the ${f.trialDays}-day free trial (${f.trialMinutes} minutes of calls) starts when you choose a plan in your customer area. A card is required, but nothing is charged during the trial; if you cancel before the end from Billing info, you pay nothing.`,
        'The built-in help assistant in your customer area can guide you, in writing or out loud.',
      ],
      cta: { label: 'Choose my plan', target: 'billing' },
    }),
    I2: () => ({
      category: 'marketing',
      subject: 'Call your own agent',
      preheader: 'Chat, browser, real call: check everything before trusting it with a customer.',
      body: [
        'The best demo is your own agent: it answers in the name of {company}, with your opening hours and your services.',
        'You can check everything before trusting it with a single customer:',
        { ol: ['the test chat, to fine-tune its instructions;', 'the browser call, to hear its voice;', 'a real call from your mobile.'] },
        'You only forward your calls once you’re happy with the result. The guide “Test your agent” covers each step.',
      ],
      cta: { label: 'Start the trial and test', target: 'billing' },
    }),
    I3: (f) => ({
      category: 'marketing',
      subject: 'Shall we set up your agent together?',
      preheader: 'We’ll call you back to set up the agent with you.',
      body: [
        'Haven’t had time to get started? We can do it with you.',
        `Reply to this email with a time slot and a number to reach you on, or leave a request for help on our Trial page. We’ll call you back to set up {company}’s agent with you (instructions, calendar, call forwarding) and get your ${f.trialDays}-day trial off to a good start.`,
      ],
      cta: { label: 'Ask for help', target: 'trial_assist' },
    }),
    I4: (f) => ({
      category: 'marketing',
      subject: `${f.trialMinutes} trial minutes: where to use them?`,
      preheader: 'Put them on the calls you miss today.',
      body: [
        `${f.trialMinutes} minutes is about ${f.trialShortCalls} calls of ${f.shortCallMinutes} minutes. Enough to judge, as long as you use them in the right place.`,
        'Our advice: don’t forward everything. Switch on forwarding only when you don’t pick up, or in the evenings and at weekends. Those are the calls {company} is losing today, and the ones where the agent will help you most.',
        'You’ll read the summary of every call in your customer area and see straight away whether it’s useful.',
      ],
      cta: { label: 'Choose my plan and start the trial', target: 'billing' },
    }),
    I5: (f) => {
      const { receptionniste: r, assistant: a, 'centre-appels': c } = f.plans;
      return {
        category: 'marketing',
        subject: 'Which plan should you start with?',
        preheader: 'A simple guide based on your call volume.',
        body: [
          'If you’re unsure, here’s a simple guide (prices per month, excl. tax):',
          {
            ul: [
              `${r.name}, ${r.price}: ${r.minutes} minutes, or about ${r.shortCalls} calls of ${f.shortCallMinutes} minutes;`,
              `${a.name}, ${a.price}: ${a.minutes} minutes, plus credits to reply in writing (website chat, WhatsApp);`,
              `${c.name}, ${c.price}: ${c.minutes} minutes.`,
            ],
          },
          `No need to get it right first time: you can change plan at any time, with no commitment, and the change is shown before you confirm. During the ${f.trialDays}-day trial, nothing is charged.`,
        ],
        cta: { label: 'Choose my plan', target: 'billing' },
      };
    },
    I6: (f) => ({
      category: 'marketing',
      subject: 'Not ready for a subscription? Pay by the minute',
      preheader: `${f.paygMinute} per minute excl. tax, credit that never expires.`,
      body: [
        `A subscription doesn’t suit everyone. You can also use your agent without a plan: you add credit whenever you like (Add credits), calls cost ${f.paygMinute} per minute excl. tax and credit never expires.`,
        `You then get the same features as the ${f.plans.receptionniste.name} plan. This option doesn’t include the free trial: you only pay for what you add. As soon as your calls become regular, a plan costs less per minute.`,
      ],
      cta: { label: 'Add credit or choose a plan', target: 'billing' },
    }),
    I7: (f) => ({
      category: 'marketing',
      subject: 'Your customer area stays open',
      preheader: 'Last email in this series: the trial is still available.',
      body: [
        `This is our last email in this series. Your ${f.brand} customer area stays open: the ${f.trialDays}-day trial (${f.trialMinutes} minutes, nothing charged during the trial) starts as soon as you choose a plan.`,
        'If something held you back, a one-line reply would really help us.',
        SERIES_END_UNSUBSCRIBE,
      ],
      cta: { label: 'Start whenever you’re ready', target: 'billing' },
    }),

    // ---------- C : essai en cours (essential, purement informatif) ----------
    C1: (f) => ({
      category: 'essential',
      subject: 'Your trial has started: 3 steps to make the most of it',
      preheader: 'Your trial runs until {trial_end_date}.',
      body: [
        `Your ${f.brand} trial has started. It runs until {trial_end_date}, with ${f.trialMinutes} minutes of calls.`,
        'To make the most of it:',
        {
          ol: [
            'Create your agent from a template and adapt its instructions to {company}.',
            'Connect your calendar (Cal.com or Calendly) if you want it to book appointments.',
            'Call it yourself, then switch on call forwarding once you’re happy with the result.',
          ],
        },
        'Nothing is charged during the trial. You can cancel before {trial_end_date} from Billing info.',
      ],
      cta: { label: 'Open my customer area', target: 'app' },
    }),
    C2: (f) => ({
      category: 'essential',
      skipIfEssentialOnly: true,
      subject: 'Your agent is waiting for its first call',
      preheader: 'Two quick steps to its first call.',
      body: [
        'Your agent hasn’t received a call yet. That’s often the last step, and it’s a short one:',
        {
          ol: [
            'Call it from your mobile and ask a question a customer would ask.',
            'If you’re happy with the answer, ask your phone provider to forward calls you don’t pick up.',
          ],
        },
        `You keep your number and can switch forwarding off at any time. You have ${f.trialMinutes} trial minutes left, until {trial_end_date}.`,
      ],
      cta: { label: 'Open my customer area', target: 'app' },
    }),
    C3: () => ({
      category: 'essential',
      skipIfEssentialOnly: true,
      subject: 'Improve your agent with its first calls',
      preheader: 'Read the summaries and fill in its instructions.',
      body: [
        'Your first calls are the best source for improving your agent. In your customer area, read the summaries and look for:',
        {
          ul: [
            'questions it handled poorly: add the information to its instructions;',
            'what it must never promise: list it, and it will refer those topics to you;',
            'calls to put straight through to you: set up the transfer in “Tools & actions”.',
          ],
        },
        'The guide “Write your agent’s instructions” sets out the 5 building blocks of good instructions, and the writing assistant (AI Prompt Editor) helps you write them.',
      ],
      cta: { label: 'Open my customer area', target: 'app' },
    }),
    C4: (f) => ({
      category: 'essential',
      subject: 'You have {minutes_left} trial minutes left',
      preheader: `What happens once the ${f.trialMinutes} minutes are used up.`,
      body: [
        `You have {minutes_left} minutes left out of the ${f.trialMinutes} in your trial.`,
        `For your information, once the ${f.trialMinutes} minutes are used up, calls stop until the end of the trial on {trial_end_date}, or until you start your {plan_name} subscription from Billing info. If you do nothing, it starts automatically at the end of the trial, unless you cancel it before then.`,
        'The choice is yours.',
      ],
      cta: { label: 'View my subscription', target: 'billing' },
    }),
    C5: () => ({
      category: 'essential',
      subject: 'Your trial ends on {trial_end_date}',
      preheader: 'What happens on that date, and how to cancel without being charged.',
      body: [
        'Your trial ends on {trial_end_date}.',
        {
          ul: [
            'If you want to continue: nothing to do. Your {plan_name} plan starts that day, and the first month ({plan_price} excl. tax, taxes depending on your country) is charged to your card.',
            'If you don’t want to continue: cancel before that date from Billing info, using the “Cancel subscription” button. Nothing will be charged.',
          ],
        },
        'A question about your plan or your minutes? Reply to this email.',
      ],
      cta: { label: 'Manage my subscription', target: 'billing' },
    }),

    // ---------- F : essai terminé sans forfait (F1 essential, puis marketing) ----------
    F1: (f) => ({
      category: 'essential',
      subject: 'Your trial has ended, nothing was charged',
      preheader: 'One question: a one-line reply is enough.',
      body: [
        'Your trial ended without a subscription: nothing was charged, and that’s entirely your right.',
        'Could you tell us in one line what was missing? The voice, the answers, the set-up, the price, the timing… Just reply to this email: our team reads every reply, and if a setting could make a difference, we’ll let you know.',
        `Thank you for trying ${f.brand}.`,
      ],
      cta: null,
    }),
    F2: (f) => ({
      category: 'marketing',
      subject: 'Keep your agent, without a subscription',
      preheader: 'Pay as you go, with no subscription.',
      body: [
        'If the subscription is what held you back, there’s another option: pay as you go.',
        `Your customer area is still available. You add credit whenever you like (Add credits), calls cost ${f.paygMinute} per minute excl. tax, with no subscription, and credit never expires. You keep the same features as the ${f.plans.receptionniste.name} plan. A ${f.exampleCallMinutes}-minute call costs about ${f.exampleCallPayg} excl. tax.`,
      ],
      cta: { label: 'Add credit', target: 'billing' },
    }),
    F3: () => ({
      category: 'marketing',
      subject: 'What if the agent only answered in the evenings and at weekends?',
      preheader: 'Alongside your team, not instead of it.',
      body: [
        'Many businesses don’t use the agent for everything. They keep it alongside their team: it takes over in the evenings, at weekends, over lunch or when every line is busy.',
        'You simply set up call forwarding with your phone provider for those times. The rest of the time, nothing changes for {company}, and the calls that used to go to voicemail finally get an answer, with a summary for you.',
      ],
      cta: { label: 'Come back with a plan', target: 'billing' },
    }),
    F4: () => ({
      category: 'marketing',
      subject: 'The 3 settings that make the biggest difference to your calls',
      preheader: 'Most of the time, some information is missing from its instructions.',
      body: [
        'When an agent disappoints during the trial, most of the time some information is missing from its instructions. The three settings that make the biggest difference:',
        {
          ol: [
            'Complete practical information: opening hours, area covered, guide prices, lead times.',
            'A list of what it must never do, so that it refers those topics to you.',
            'Transfer to your team for sensitive cases, included on every plan.',
          ],
        },
        'The writing assistant in your customer area (AI Prompt Editor) helps you write them.',
      ],
      cta: { label: 'Come back with these settings', target: 'billing' },
    }),
    F5: (f) => {
      const { receptionniste: r, assistant: a, 'centre-appels': c } = f.plans;
      return {
        category: 'marketing',
        subject: 'The more calls you have, the less each minute costs',
        preheader: 'The real price per minute, plan by plan.',
        body: [
          'On a plan, the real price per minute goes down as volume goes up:',
          {
            ul: [
              `${r.name}, ${r.price} excl. tax/month for ${r.minutes} minutes: about ${r.perMinute} per minute;`,
              `${a.name}, ${a.price} excl. tax/month for ${a.minutes} minutes: about ${a.perMinute};`,
              `${c.name}, ${c.price} excl. tax/month for ${c.minutes} minutes: about ${c.perMinute}.`,
            ],
          },
          `Monthly billing has no commitment: cancel at any time from Billing info. On annual billing, you pay for ${f.annualPaidMonths} months out of 12. The calculator on our Pricing page picks the cheapest option for your calls.`,
        ],
        cta: { label: 'Compare and choose', target: 'pricing' },
      };
    },
    F6: () => ({
      category: 'marketing',
      subject: 'Shall we help you set it up?',
      preheader: 'A member of our team calls you back, with no commitment.',
      body: [
        'Often it isn’t the agent that disappoints, it’s a missing instruction or call forwarding that isn’t set up properly.',
        'Reply to this email with a time slot and a number to reach you on: a member of our team will call you back to set up {company}’s agent with you (instructions, transfer, call forwarding), before you choose a plan. No commitment, just a conversation.',
      ],
      cta: null,
    }),
    F7: (f) => ({
      category: 'marketing',
      subject: 'We’ll stop here: thank you for trying us',
      preheader: 'Last email in this series.',
      body: [
        `This is our last email in this series. Thank you for trying ${f.brand}.`,
        `Your customer area is still available: you can come back with a plan, with no commitment, or pay as you go at ${f.paygMinute} per minute excl. tax.`,
        SERIES_END_UNSUBSCRIBE,
      ],
      cta: { label: 'My customer area', target: 'billing' },
    }),

    // ---------- U : comptes à l’usage peu actifs (U1 essential, puis marketing) ----------
    U1: () => ({
      category: 'essential',
      subject: 'Is your agent receiving your calls?',
      preheader: 'A one-minute check.',
      body: [
        'Your agent has received few calls over the last 30 days. That may be intentional, but sometimes call forwarding has been switched off or isn’t set up properly.',
        'A one-minute check:',
        {
          ol: [
            'Call your usual number at a time when forwarding should kick in.',
            'If the agent doesn’t answer, check the forwarding with your phone provider, or the number linked in your customer area.',
          ],
        },
        'If everything works, there’s nothing to change.',
      ],
      cta: { label: 'Open my customer area', target: 'app' },
    }),
    U2: () => ({
      category: 'marketing',
      subject: 'Only give it the calls you miss',
      preheader: 'Forwarding only when you don’t pick up.',
      body: [
        'You don’t have to hand every call to the agent. With forwarding on no answer or when busy (if your phone provider offers it), you pick up when you can, and the agent takes over only when you can’t.',
        'The result: fewer lost calls for {company}, and you only pay for the minutes you actually use.',
      ],
      cta: { label: 'My customer area', target: 'app' },
    }),
    U3: (f) => {
      const r = f.plans.receptionniste;
      return {
        category: 'marketing',
        subject: 'When does a plan work out cheaper?',
        preheader: 'The calculation, using the pay-as-you-go price per minute.',
        body: [
          `The calculation is simple: at ${f.paygMinute} per minute excl. tax, ${r.price} is worth about ${f.breakEvenMinutes} minutes.`,
          {
            ul: [
              `Under ${f.breakEvenMinutes} minutes a month: stay on pay as you go, it’s the cheapest option.`,
              `Over ${f.breakEvenMinutes} minutes: the ${r.name} plan (${r.minutes} minutes for ${r.price} excl. tax) works out cheaper, at about ${r.perMinute} per minute.`,
            ],
          },
          'You can track your usage in your customer area, and a plan can be cancelled at any time from Billing info.',
        ],
        cta: { label: 'View my usage', target: 'billing' },
      };
    },
    U4: () => ({
      category: 'marketing',
      subject: 'Two features already included in your account',
      preheader: 'Call transfer and your calendar, with no per-use fees.',
      body: [
        'Two features are already included, with no per-use fees:',
        {
          ul: [
            'call transfer: the agent hands important calls (an unhappy customer, an emergency) to your team according to your rules, set in “Tools & actions”; the transferred time is counted in your minutes;',
            'your calendar: connected through Cal.com or Calendly, it books your free slots during the call.',
          ],
        },
        'Finally, so that your credit never runs out, you can switch on automatic top-up; an email alert already warns you when your balance gets low.',
      ],
      cta: { label: 'My customer area', target: 'app' },
    }),
    U5: (f) => {
      const x = f.assistantExtras;
      if (!x) return null;
      const a = f.plans.assistant;
      return {
        category: 'marketing',
        subject: 'Reply in writing too, with your own voice',
        preheader: `What the ${a.name} plan adds, with no commitment.`,
        body: [
          `On pay as you go, you have the features of the ${f.plans.receptionniste.name} plan, with no message credits included. The ${a.name} plan (${a.price} excl. tax per month) adds:`,
          {
            ul: [
              `${a.minutes} minutes of calls and ${x.agents} agents;`,
              `${x.messageCredits} message credits per month, or about ${x.writtenReplies} written AI replies (website chat, WhatsApp);`,
              `${x.clonedVoices} cloned voice: your own, or that of someone who has given you their written consent. The agent always says that it is an AI.`,
            ],
          },
          'No commitment: cancel at any time from Billing info.',
        ],
        cta: { label: 'See the plans', target: 'billing' },
      };
    },
    U6: (f) => ({
      category: 'marketing',
      subject: 'Your option, your pace',
      preheader: 'Last email in this series.',
      body: [
        'This is our last email in this series. In short:',
        {
          ul: [
            `few calls: pay as you go, at ${f.paygMinute} per minute excl. tax, is still the best fit, and your credit never expires;`,
            `regular calls: a plan costs less, with no commitment on monthly billing and ${f.annualFreeMonths} months free on annual billing.`,
          ],
        },
        SERIES_END_UNSUBSCRIBE,
      ],
      cta: { label: 'My customer area', target: 'billing' },
    }),
  },

  // ---------- M : suivi mensuel (marketing, base légale de la série d’origine) ----------
  monthly: {
    // Même rotation que le français, tirée des guides publiés (src/i18n/content/en/guides.ts).
    topics: [
      {
        slug: 'tester-son-agent',
        title: 'test your agent in 3 ways',
        paragraph: 'Before trusting your agent with a single customer, test it in three ways: the test chat to check its instructions, the browser call to hear its voice, then a real phone call, the only one that checks every tool, including call transfer. Voice tests use up minutes just like real calls.',
      },
      {
        slug: 'consignes-system-prompt',
        title: 'the 5 building blocks of good instructions',
        paragraph: 'Good instructions come down to five blocks: the agent’s role (it says from the start that it is an AI), its style, the key information (services, opening hours, prices, address), the rules (when to transfer, what it must never promise) and how to handle common situations. Read your call transcripts regularly and add the cases it handled poorly.',
      },
      {
        slug: 'consignes-system-prompt',
        title: 'what your agent must never do',
        paragraph: 'You decide what your agent must never do: give a price quote, make a diagnosis, promise a timeframe. List it in its instructions: it will refer those topics to your team, with a summary of the request.',
      },
      {
        slug: 'renvoi-d-appel',
        title: 'keep your number with call forwarding',
        paragraph: 'You keep the number on your business cards, your website and your listings: with your phone provider, you switch on forwarding to the agent’s number, for all your calls or only the ones you don’t pick up. Nothing changes for your customers. Forwarding is charged by your phone provider: check your plan.',
      },
    ],
    prospect: (f) => ({
      category: 'marketing',
      subject: 'Tip of the month: {topic_title}',
      preheader: 'A practical tip from our guides.',
      body: ['{topic_paragraph}'],
      cta: { label: `Try it for ${f.trialDays} days`, target: 'trial' },
      after: ['This is a monthly email; you can unsubscribe in one click at the bottom of this message.'],
    }),
    account: () => ({
      category: 'marketing',
      subject: 'Tip of the month: {topic_title}',
      preheader: 'A practical tip from our guides.',
      body: ['{topic_paragraph}'],
      cta: { label: 'Open my customer area', target: 'billing' },
      after: ['This is a monthly email; you can unsubscribe in one click at the bottom of this message.'],
    }),
  },
};

// Customer-area how-to guides (English interface): one guide per task, published under /aide/guides/<slug>.
// Interface labels stay in quotes exactly as they appear on screen; the explanation is in British English.
// Variables replaced at render time: {brand} (market brand), {numberFrom} (starting price of a dedicated number).
// Same slugs, categories and structure as the French source (checked by the `typeof` annotation).
import type { Guide } from '../fr/guides';
import { GUIDES_UI as FR_UI } from '../fr/guides';

export const GUIDES_UI: typeof FR_UI = {
  categories: {
    start: 'Getting started',
    assistant: 'Setting up your agent',
    tools: 'Knowledge, calendar and tools',
    phone: 'Numbers and telephony',
    channels: 'Website and messaging',
    outbound: 'Campaigns and contacts',
    results: 'Call tracking and automations',
    billing: 'Minutes and billing',
  },
  indexTitle: 'Step-by-step guides',
  indexIntro: 'One guide per task, with the exact interface labels and a plain-English explanation of each.',
  breadcrumb: 'Guides',
  meta: {
    title: (title: string, brand: string) => `${title} — ${brand} guide`,
  },
  eyebrow: (category: string) => `Guide · ${category}`,
  planLabel: 'Availability',
  tipLabel: 'Tip',
  relatedTitle: 'Related guides',
  allGuides: 'All guides',
  openSpace: 'Open my account',
  helpBefore: 'Need help? In your account, the help assistant (bubble at the bottom right) answers in your language. You can also email ',
  helpAfter: '.',
};

export const GUIDES: Guide[] = [
  // ---------- Getting started ----------
  {
    slug: 'agent-vocal-ia',
    category: 'start',
    title: 'What is an AI voice agent?',
    summary: 'What an agent does, what it is made of and how it can help you, on inbound and outbound calls.',
    sections: [
      {
        title: 'The idea',
        text: 'An agent (called an "Assistant" in your {brand} account) is an AI you set up to talk to your customers or prospects on the phone: when they call you (inbound, "Receive phone calls") or when the agent calls them (outbound, "Make phone calls").',
      },
      {
        title: 'What it does for you',
        list: [
          'Answers common questions, takes messages and books appointments, 24/7.',
          'Qualifies enquiries and transfers the call to your team when needed.',
          'Handles several calls at once (the number of concurrent calls depends on your plan).',
        ],
      },
      {
        title: 'What it is made of',
        list: [
          'Instructions ("System prompt"): the agent’s role, tone and rules.',
          'Greeting ("Initial message"): the first sentence it says.',
          'Voice ("Voice"): a voice from the library or your own cloned voice.',
          'Tools ("Tools"): call transfer, ending the call, appointment booking, custom tools.',
          'Knowledge base ("Knowledge base"): your documents and web pages.',
        ],
      },
    ],
    related: ['creer-un-agent', 'consignes-system-prompt', 'outils-de-l-agent'],
  },
  {
    slug: 'creer-un-agent',
    category: 'start',
    title: 'Create and edit an agent',
    summary: 'Set up your first agent in a few minutes, then change it whenever you like.',
    plan: 'The number of agents depends on your plan ("Limits" menu).',
    sections: [
      {
        title: 'Create the agent',
        steps: [
          'Log in to app.permanenceia.com, open the "Assistants" menu, then click "Create".',
          'Choose the type: "Receive phone calls" to answer calls, "Make phone calls" to place them (campaigns, callbacks).',
          'Give it an internal name (for example "Practice reception") and check the time zone.',
          'Choose the language, then the voice ("Voice & speech"), and have a listen.',
          'Write the instructions ("Brain & prompt") and the opening line ("Greeting").',
          'Click "Create assistant".',
        ],
      },
      {
        title: 'Add the tools it needs',
        text: 'In "Tools & actions", add whatever the agent needs: call transfer, end call, appointment booking, custom tools.',
      },
      {
        title: 'Connect and test',
        list: [
          'Inbound agent: give it a number ("General" section, "Phone number" field).',
          'Outbound agent: attach it to a campaign, or test it by having it call you.',
          'Either way, test it before putting it live.',
        ],
      },
      {
        title: 'Edit an agent',
        steps: [
          'In the "Assistants" menu, click the agent’s name.',
          'Change the instructions, voice or tools.',
          'Click "Save": the next calls use the new version.',
        ],
        tip: 'After every change, make a test call to check how it behaves.',
      },
    ],
    related: ['tester-son-agent', 'consignes-system-prompt', 'acheter-un-numero'],
  },
  {
    slug: 'tester-son-agent',
    category: 'start',
    title: 'Test your agent (chat, browser, phone)',
    summary: 'The three ways to test an agent before it goes live, and when to use each.',
    sections: [
      {
        title: '1. Test chat: for the instructions',
        text: 'The quickest way to check the conversation logic, without the voice.',
        steps: [
          'Open the agent and click "Test assistant" (speech bubble icon).',
          'Type as a customer would: the agent replies using the same instructions and tools as on the phone.',
          'Check that it understands requests, collects the right details and uses its tools.',
        ],
        tip: 'Every test session is saved in "Inbox" with a "Test" badge, so you can read the exchange back.',
      },
      {
        title: '2. Browser call: for the voice',
        steps: [
          'Click "Speak with your assistant" and allow microphone access.',
          'Talk to the agent: check the voice, the pace and how it handles interruptions.',
        ],
        text: 'Call transfer does not work in this mode.',
      },
      {
        title: '3. A real phone call: the final check',
        list: [
          'Outbound agent: click "Speak to your assistant", choose a phone call and enter your number: the agent rings you straight away.',
          'Inbound agent: simply call the number assigned to the agent.',
          'This is the only test that checks every tool, including call transfer.',
        ],
      },
      {
        title: 'Good to know',
        list: [
          'Voice tests use minutes just like real calls; the test chat uses a little credit.',
          'Save the agent’s number in your contacts so you can call it again easily.',
        ],
      },
    ],
    related: ['creer-un-agent', 'historique-des-appels', 'minutes-et-facturation'],
  },

  // ---------- Setting up your agent ----------
  {
    slug: 'consignes-system-prompt',
    category: 'assistant',
    title: 'Write your agent’s instructions (system prompt)',
    summary: 'Structure the instructions that set your agent’s role, tone and rules.',
    sections: [
      {
        title: 'What the instructions are for',
        text: 'The instructions ("System prompt", in the "Brain & prompt" section) are the agent’s brain: who it is, what it knows, how it speaks and what it must never do. There are three ways to edit them: the writing assistant ("AI Prompt Editor"), the visual editor ("Flow Builder") or editing the text directly.',
      },
      {
        title: 'Start from a template',
        steps: [
          'In the agent’s instructions section, click "Templates".',
          'Pick the template closest to your use (reception, appointment booking, support, qualification…).',
          'Adapt it to your business.',
        ],
      },
      {
        title: 'The 5 building blocks of good instructions',
        list: [
          'Role and identity: "You are the receptionist for X, a practice specialising in…"',
          'Style: tone, level of formality, short sentences, no jargon.',
          'Key information: services, opening hours, prices, address.',
          'Rules: what to check, when to transfer, what never to promise.',
          'Scripts: how to handle common situations (booking, complaint, emergency).',
        ],
      },
      {
        title: 'Language of the instructions',
        text: 'You can write the instructions in any language you like: the language the agent speaks is set separately, in "Voice & speech".',
      },
      {
        title: 'Common mistakes',
        list: [
          'Too vague: "Be helpful" is not enough.',
          'Too rigid: scripting every line makes the conversation sound artificial.',
          'Too long: detailed information belongs in the knowledge base.',
          'Missing situations: say what to do with emergencies, angry callers or off-topic questions.',
        ],
        tip: 'Your instructions will evolve: read call transcripts regularly and add any cases the agent handled badly.',
      },
    ],
    related: ['editeur-de-prompt-ia', 'flow-builder', 'base-de-connaissances'],
  },
  {
    slug: 'editeur-de-prompt-ia',
    category: 'assistant',
    title: 'Use the writing assistant (AI Prompt Editor)',
    summary: 'Change your agent’s instructions simply by asking for what you want.',
    plan: 'All plans.',
    sections: [
      {
        title: 'Open the editor',
        steps: [
          'In the "Assistants" menu, open your agent (it must have been saved at least once).',
          'In the instructions section, "AI Prompt Editor" tab, click "Launch AI Prompt Editor".',
          'Choose whether to continue with your current instructions, start from scratch or start from a template.',
        ],
      },
      {
        title: 'Ask for a change',
        text: 'Type your request in the chat on the left, in plain language. For example:',
        list: [
          '"Make the tone warmer."',
          '"Add our returns policy: 30 days, no questions asked."',
          '"Add instructions for handling an unhappy customer."',
          'The "Make it more concise", "Improve clarity"… shortcuts handle common tweaks.',
        ],
      },
      {
        title: 'Review and approve',
        list: [
          'Proposed changes are highlighted: green for additions, red for deletions.',
          'Accept or reject each change ("Accept" / "Reject"), or all of them at once ("Accept All" / "Reject All").',
          'Click "Save" to keep them.',
        ],
        tip: 'One change at a time gives better results. Always read before accepting: you know your business better than the AI does.',
      },
      {
        title: 'Variables and post-call data',
        list: [
          '"Variables" tab: add fields such as {customer_name} to personalise each call.',
          '"Post-Call" tab: define what to extract from each call (appointment booked, level of interest…). You can ask the AI: "What data should I collect?"',
        ],
      },
    ],
    related: ['consignes-system-prompt', 'donnees-apres-appel', 'tester-son-agent'],
  },
  {
    slug: 'message-d-accueil',
    category: 'assistant',
    title: 'Get the greeting right',
    summary: 'Write a short, natural opening line, or use an audio recording.',
    sections: [
      {
        title: 'Written greeting',
        text: 'This is the first sentence the agent says ("Greeting" or "Initial message"). It is read out exactly as written.',
        list: [
          'Aim for 5 to 10 seconds: hello, business name, question.',
          'Use punctuation for pauses ("…" adds a beat).',
          'Write numbers the way they should be spoken.',
          'Example: "Good morning, Martin & Co, Julie speaking… How can I help?"',
        ],
      },
      {
        title: 'Recorded greeting',
        text: 'For a fully human feel, you can upload an audio file that plays when the call is answered.',
        steps: [
          'Record the greeting somewhere quiet (under 10 seconds).',
          'Upload the file in the agent’s settings and switch playback on.',
          'For a seamless handover, clone the same voice for the rest of the call.',
        ],
      },
      {
        title: 'Check it',
        text: 'Call the agent and listen: pronunciation, pauses, volume and how it flows into the conversation. If the agent speaks several languages, plan a greeting for each.',
      },
    ],
    related: ['choisir-la-voix', 'consignes-system-prompt', 'tester-son-agent'],
  },
  {
    slug: 'choisir-la-voix',
    category: 'assistant',
    title: 'Choose or clone a voice',
    summary: 'Pick a voice from the library, import one, or clone your own.',
    plan: 'Library voices: all plans. Cloned voices: Assistant plan and above.',
    sections: [
      {
        title: 'Choose a voice',
        steps: [
          'Open the agent, "Voice & speech" section.',
          'Choose the language, then the voice provider ("TTS Provider").',
          'Browse the voices (male, female, accent) and listen before confirming.',
        ],
      },
      {
        title: 'Import a voice from the provider’s library',
        steps: [
          'Click "Import voice" next to the voice list.',
          'Choose the provider, find a public voice in its library and copy its link or ID.',
          'Paste it and click "Import": the voice appears in the list as soon as it is ready.',
        ],
      },
      {
        title: 'Clone a voice',
        steps: [
          'Click "Clone voice".',
          'Choose the provider, the language and a name.',
          'Record or upload a sample: one speaker, no background noise (at least 10 seconds, ideally a minute or more).',
          'Once it has been processed, select the new voice.',
        ],
        tip: 'Only clone your own voice, or a voice whose owner has given you written consent.',
      },
    ],
    related: ['message-d-accueil', 'tester-son-agent', 'creer-un-agent'],
  },
  {
    slug: 'flow-builder',
    category: 'assistant',
    title: 'Design a call script with the Flow Builder',
    summary: 'Map out a conversation as connected blocks, with different paths depending on the answers.',
    plan: 'Assistant plan and above.',
    sections: [
      {
        title: 'When to use it',
        text: 'The Flow Builder is ideal for a structured script with several branches (qualification, multi-step booking). For a simple, open conversation, written instructions are enough.',
      },
      {
        title: 'Open the Flow Builder',
        steps: [
          'Open the agent, instructions section, "Flow Builder" tab.',
          'Click "Launch Flow Builder".',
          'Start from the existing script, a blank canvas or a template.',
        ],
      },
      {
        title: 'The 5 block types',
        list: [
          '"Start": the start of the call and the greeting (only one per script).',
          '"Speak": a line said word for word.',
          '"Prompt": an instruction the AI rephrases to suit the context.',
          '"Action": transfer the call, book an appointment or run a custom tool.',
          '"End": hang up, transfer, or hand over to another agent.',
        ],
      },
      {
        title: 'Create branches',
        steps: [
          'Add a block with "+ Add Node".',
          'In a "Speak" or "Prompt" block, add outcomes ("Add Outcome"): "Interested", "Not interested", "Call back later"…',
          'Connect each outcome to the next block by dragging a line from its exit point.',
          'Click "Save".',
        ],
        tip: 'Export your script regularly ("Export JSON") to keep a copy. Test every path before going live.',
      },
    ],
    related: ['consignes-system-prompt', 'editeur-de-prompt-ia', 'tester-son-agent'],
  },

  // ---------- Knowledge, calendar and tools ----------
  {
    slug: 'base-de-connaissances',
    category: 'tools',
    title: 'Create a knowledge base',
    summary: 'Give the agent your documents and web pages so it answers with your own information.',
    plan: 'The number of knowledge bases depends on your plan ("Limits" menu).',
    sections: [
      {
        title: 'Create the knowledge base',
        steps: [
          'Open the "Knowledge base" menu and create a knowledge base (name and description).',
          'Add your content: PDF, Word (.docx) or text (.txt) files, or the addresses of pages on your website.',
          'Wait for the "Active" status ("Processing" while it is being analysed).',
          'In the agent, "Knowledgebase" section, select the knowledge base and save.',
        ],
      },
      {
        title: 'Choose how it is used',
        list: [
          '"Function Call" (recommended): the agent only looks things up when it needs to. Faster.',
          '"Prompt Injection": the knowledge base is checked after every sentence the caller says. More accurate but slower; suited to support.',
        ],
      },
      {
        title: 'Best practice',
        list: [
          'Keep content short, with clear headings and lists.',
          'Use public web pages: some protected sites block reading (status "Failed"). If so, save the content as a PDF and upload that.',
          'Your 10 most frequent questions can also go straight into the instructions.',
          'Read transcripts to check the agent quotes your information correctly.',
        ],
      },
    ],
    related: ['consignes-system-prompt', 'outils-de-l-agent', 'historique-des-appels'],
  },
  {
    slug: 'rendez-vous-cal-com',
    category: 'tools',
    title: 'Appointment booking with Cal.com',
    summary: 'Connect Cal.com so the agent can check your availability and book during the call.',
    plan: 'All plans.',
    sections: [
      {
        title: 'Get your Cal.com key',
        steps: [
          'In Cal.com: "Settings" → "Developer" → "API Keys".',
          'Create a key and copy it (it starts with cal_live_).',
        ],
      },
      {
        title: 'Connect Cal.com to the agent',
        steps: [
          'Open the agent, "Tools & actions" section, then "Appointment Scheduling".',
          'Choose "Cal.com" and your account’s region (US by default, EU if your account is European).',
          'Paste the key and choose the event type (personal or team).',
          'Click "Sync Event": the booking fields (name, email, phone, custom fields) are set up automatically.',
          'Save the agent.',
        ],
      },
      {
        title: 'Making sure the invitation goes out',
        list: [
          'Add an email variable to the agent and fill it in for your contacts, or ask the agent to collect the address.',
          'Several event types? Click "+" next to "Appointment Scheduling" to add more.',
          'If you change the fields in Cal.com, click "Sync Event" again. If something goes wrong, "Troubleshoot" resets the fields.',
        ],
        tip: 'Connect your Google or Outlook calendar to Cal.com and the agent will see your real availability.',
      },
    ],
    related: ['rendez-vous-calendly', 'outils-de-l-agent', 'tester-son-agent'],
  },
  {
    slug: 'rendez-vous-calendly',
    category: 'tools',
    title: 'Appointment booking with Calendly',
    summary: 'Connect Calendly so the agent can check slots and book directly during the call.',
    plan: 'All plans.',
    sections: [
      {
        title: 'Connect Calendly',
        steps: [
          'Open the agent, "Tools & actions" section, then "Appointment Scheduling".',
          'Choose "Calendly", then "Connect to Calendly", and allow access.',
          'Click "Load Events" and choose the event type.',
          'Save the agent.',
        ],
        tip: 'If the connection fails, try again in a private browsing window.',
      },
      {
        title: 'Set the meeting location in Calendly',
        text: 'The agent cannot create video-call links. In Calendly, open the event type and set the "Location" to "Custom" (recommended) or "Phone Call". An event that is video-only (Meet, Zoom, Teams) will make the booking fail, so add at least one of these options.',
      },
      {
        title: 'Several calendars',
        text: 'Click "+" to add more event types and describe in "When to schedule" when to use each one. A Calendly organisation admin account can also see team events.',
      },
    ],
    related: ['rendez-vous-cal-com', 'outils-de-l-agent', 'tester-son-agent'],
  },
  {
    slug: 'outils-de-l-agent',
    category: 'tools',
    title: 'Agent tools: transfer, end call, keypad',
    summary: 'The built-in actions the agent can trigger during a call, and how to set them up.',
    sections: [
      {
        title: 'Where to find them',
        text: 'Open the agent, "Tools & actions" section. Each tool is switched on here, then triggered according to what you write in the instructions.',
      },
      {
        title: 'Built-in tools',
        list: [
          'End call ("End call"): the agent hangs up politely, for example when the caller says goodbye.',
          'Transfer ("Call transfer"): the agent passes the call to a person or another number. Specify the number and when to transfer (emergency, caller asks for an adviser, customer ready to buy).',
          'Appointment booking ("Appointment Scheduling"): Cal.com or Calendly, which in turn connect to Google or Outlook.',
          'Keypad tones ("DTMF"): the agent presses digits to navigate a phone menu or dial an extension.',
        ],
      },
      {
        title: 'Going further',
        list: [
          'Custom tools query your software live (stock, customer record…).',
          'After the call, automations send the results to your CRM, Google Sheets or by email.',
        ],
        tip: 'Tools can be combined: check a detail, book an appointment, then transfer if needed. Describe that sequence in the instructions.',
      },
    ],
    related: ['outils-sur-mesure', 'rendez-vous-cal-com', 'automatisations'],
  },
  {
    slug: 'outils-sur-mesure',
    category: 'tools',
    title: 'Create a custom tool (during the call)',
    summary: 'Let the agent query your software live: order tracking, customer checks, availability.',
    plan: 'The number of tools depends on your plan ("Limits" menu).',
    sections: [
      {
        title: 'Create the tool',
        steps: [
          'Open the "Mid call tools / MCP" menu, then "Create Mid-Call Tool".',
          'Name: letters, numbers and underscores (for example check_order_status).',
          'Description: when and why the agent should use it.',
          '"HTTP request" type: enter your API address ("Endpoint"), the method (GET, POST…), the timeout and the headers (for example an authorisation key).',
        ],
      },
      {
        title: 'Define the details to collect',
        list: [
          'Add the parameters the agent will ask the caller for: name, type (text, number, decimal, yes/no) and a description with the expected format ("order number in the format ORD-12345").',
          'A parameter can go in the address: https://api.example.com/orders/{order_id}.',
          'Fixed values ("Static fields") are sent with every request and never changed by the AI.',
          'Automatic variables: {{customer_phone}} (caller’s number), {{current_date}}, {{current_time}}, {{assistant_name}}…',
        ],
      },
      {
        title: 'Test and connect',
        steps: [
          'Click "Test tool": a real request is sent with sample data and you see the response.',
          'Assign the tool to the agent.',
          'In the instructions, say when to use it and how to explain the result to the caller.',
        ],
        tip: 'The "Automation Platform" type automatically creates an automation linked to the tool, for multi-step logic without code (Assistant plan and above).',
      },
    ],
    related: ['outils-de-l-agent', 'automatisations', 'consignes-system-prompt'],
  },

  // ---------- Numbers and telephony ----------
  {
    slug: 'acheter-un-numero',
    category: 'phone',
    title: 'Get a number and assign it to an agent',
    summary: 'Buy a dedicated number from your account, or keep your own, then connect it to your agent.',
    plan: 'Dedicated numbers from {numberFrom} a month depending on the country; the number included depends on your plan.',
    sections: [
      {
        title: 'Buy a number',
        steps: [
          'Open the "Get new phone number" menu.',
          'Choose the country and type (local, national or freephone, depending on availability): the monthly price is shown before you buy.',
          'Confirm: the number appears in "Your phone numbers".',
        ],
        text: 'Can’t find the number you want? Get in touch: we can request it from the carrier (supporting documents depending on the country, usually 1 to 3 working days).',
      },
      {
        title: 'Assign the number to the agent',
        steps: [
          'In the "Assistants" menu, open the agent, "General" section.',
          'In "Phone number", select the number.',
          'Click "Save".',
        ],
      },
      {
        title: 'Keep your current number',
        list: [
          'Simplest option: ask your provider to forward calls to the new number.',
          'On Twilio or Telnyx: import your numbers.',
          'Have a phone system or SIP provider: connect it over SIP (all plans).',
        ],
        tip: 'After any change, call the number to check the agent answers.',
      },
    ],
    related: ['importer-twilio-telnyx', 'connexion-sip', 'numero-presente'],
  },
  {
    slug: 'importer-twilio-telnyx',
    category: 'phone',
    title: 'Import your Twilio or Telnyx numbers',
    summary: 'Use your Twilio or Telnyx numbers with your agent via a SIP trunk.',
    plan: 'All plans.',
    sections: [
      {
        title: 'Before you start',
        text: 'In your account, open "Your phone numbers", then "Integrate SIP trunk": the form shows the inbound SIP address to give your provider. Keep this screen open.',
      },
      {
        title: 'In Twilio',
        steps: [
          'Twilio Console: "Elastic SIP Trunking" → "Create new SIP Trunk".',
          '"Termination": enter just a name (for example yourcompany); Twilio adds .pstn.twilio.com. Note down the full address.',
          'Under "Authentication", set up access (IP address list or credentials).',
          '"Origination": add the inbound SIP address shown in your account.',
          '"Numbers": add the numbers you want to use.',
        ],
      },
      {
        title: 'In Telnyx',
        steps: [
          'Telnyx portal: "Voice" → "SIP Trunking" → "Create SIP Connection", type "FQDN".',
          'Add the inbound SIP address shown in your account (port 5060) and select it as the primary FQDN.',
          'Outbound authentication: "Credentials", with a username and password you note down.',
          'Assign your numbers and allow the countries you will call ("Outbound Voice Profiles" → "Allowed Destinations").',
        ],
      },
      {
        title: 'Import the number into your account',
        steps: [
          '"Your phone numbers" → "Integrate SIP trunk".',
          'Enter the number in international format, plus the username and password.',
          'SIP address: the Twilio address you noted (yourcompany.pstn.twilio.com), or sip.telnyx.com for Telnyx.',
          'Choose the authorisation type and the country, then save.',
          'Assign the number to your agent and test both an inbound and an outbound call.',
        ],
        tip: 'You only create the trunk once: for each new number, add it to the trunk and then import it. Password: at least 12 characters, with upper-case and lower-case letters and numbers.',
      },
    ],
    related: ['connexion-sip', 'acheter-un-numero', 'numero-presente'],
  },
  {
    slug: 'connexion-sip',
    category: 'phone',
    title: 'Connect your phone system or provider over SIP',
    summary: 'Connect your phone system (PBX) or VoIP provider and keep your numbers.',
    plan: 'All plans.',
    sections: [
      {
        title: 'Two ways to connect',
        list: [
          '"SIP Extension": the agent becomes an extension on your phone system (for example extension 1011). Ideal for testing or routing certain calls to the AI.',
          '"Phone Number (DID)": a full number is connected to the agent, for both inbound and outbound calls.',
        ],
      },
      {
        title: 'Set up the connection',
        steps: [
          'Open the "Your phone numbers" menu, then "Integrate SIP trunk".',
          'Choose the trunk type and enter the extension or number, plus the username and password from your provider.',
          'Outbound: enter the SIP server address (without the port) and only switch on static IP if your provider requires it.',
          'Choose the number format your provider expects: international with +, international without +, or national.',
          'Inbound: point your provider at the inbound SIP address shown in the form, authenticating by allowed IP addresses or by username and password.',
          'Choose the trunk’s country and save.',
        ],
      },
      {
        title: 'Check it',
        list: [
          'Call the number or extension: the agent should answer.',
          'Run a test outbound call from the agent.',
          'If you change the password with your provider, change it in your account too.',
        ],
        tip: 'You stay in control of your numbers: your phone system decides which calls go to the agent and which stay with you.',
      },
    ],
    related: ['importer-twilio-telnyx', 'acheter-un-numero', 'numero-presente'],
  },
  {
    slug: 'numero-presente',
    category: 'phone',
    title: 'Choose the caller ID for outbound calls',
    summary: 'Show a dedicated number, your own verified number or your SIP phone system’s number.',
    sections: [
      {
        title: 'Three options',
        list: [
          'A dedicated number bought in your account: select it in the agent ("General" → "Phone number"). No verification needed, and it can also take callbacks.',
          'Your existing number (landline or mobile): verify it with a code sent by text or phone call. It shows up for your contacts, but inbound calls to that number do not reach the agent. (Paid plans.)',
          'Your SIP phone system: the caller ID is whatever your provider allows.',
        ],
      },
      {
        title: 'Rules to follow',
        list: [
          'Only display numbers you own or have the right to use.',
          'Some countries prohibit displaying a foreign or unverified number.',
        ],
        tip: 'Before a large campaign, call your own phone to check the number that is displayed.',
      },
    ],
    related: ['acheter-un-numero', 'campagnes-d-appels', 'connexion-sip'],
  },

  // ---------- Website and messaging ----------
  {
    slug: 'widget-site-web',
    category: 'channels',
    title: 'Add the agent to your website (web widget)',
    summary: 'Add a chat and voice call button to your website, in your brand colours.',
    plan: 'All plans.',
    sections: [
      {
        title: 'Set up the widget',
        steps: [
          'Open the agent and click "Web widget".',
          'Choose the mode: "Voice & Chat" (recommended), "Chat Only" or "Voice Only".',
          'Set the position, colour, size and whether it opens automatically.',
          'Customise the button text ("Button") and header text ("Header & Modal"), and add your avatar (square image, 512 KB max).',
          'Optional: a form before the conversation ("Pre-Chat Form") asking for name, email or phone. Each field fills an agent variable.',
        ],
      },
      {
        title: 'Test, then install',
        steps: [
          'Test it in the live preview at the top of the page ("Reset Data" simulates a new visitor).',
          'Save, then copy the code from the "Embed Code" section.',
          'Paste it just before the </body> tag on your site, or send it to your web developer.',
        ],
        tip: 'Always save before copying the code: the widget loads its settings from your account. Voice requires your site to use HTTPS.',
      },
      {
        title: 'Day to day',
        list: [
          'Every widget conversation lands in "Inbox".',
          '"Enable Widget" lets you hide the widget without removing the code.',
          'For clickable links in the chat, tell the agent in its instructions to write them as [text](address).',
        ],
      },
    ],
    related: ['historique-des-appels', 'whatsapp', 'consignes-system-prompt'],
  },
  {
    slug: 'whatsapp',
    category: 'channels',
    title: 'Connect WhatsApp to your agent',
    summary: 'Let the agent reply on WhatsApp, and send Meta-approved message templates.',
    plan: 'All plans. Messages are paid for with message credits.',
    sections: [
      {
        title: 'Create the WhatsApp sender',
        steps: [
          'Open "Channels" → "WhatsApp", then create a sender.',
          'Choose a number bought in your account (verified automatically) or your own mobile (code sent by text or call). The number must not already be in use on WhatsApp.',
          'Enter the name customers will see, then follow the Meta window ("Login with Facebook") and create a new WhatsApp Business account.',
        ],
        tip: 'While a purchased number is being verified, its inbound calls are intercepted for a few minutes, so don’t do this on a number that is already live.',
      },
      {
        title: 'Connect the agent',
        steps: [
          'Once the sender is "Online", edit it and choose the agent.',
          'Switch on "AI Enabled" and save: the agent now replies to messages, transcribes voice notes and can understand images.',
        ],
      },
      {
        title: 'WhatsApp’s rules',
        list: [
          'When a customer messages you, you can reply freely for 24 hours.',
          'To message first, or follow up after 24 hours, you need a Meta-approved message template ("Template"): utility, marketing or authentication.',
          'A new sender is limited to around 250 conversations a day; the limit goes up if your messages are well received (few blocks and reports).',
        ],
      },
    ],
    related: ['campagnes-d-appels', 'historique-des-appels', 'automatisations'],
  },

  // ---------- Campaigns and contacts ----------
  {
    slug: 'campagnes-d-appels',
    category: 'outbound',
    title: 'Run a call (or message) campaign',
    summary: 'Have your agent call a list of contacts, with calling hours, retries and goals.',
    plan: 'Assistant plan and above.',
    sections: [
      {
        title: 'Before you start',
        list: [
          'Calls: a "Make phone calls" agent with a number, and minutes available.',
          'WhatsApp: a connected sender and an approved template. SMS: an SMS-capable number. Both use message credits.',
          'Contacts who have agreed to be contacted.',
        ],
      },
      {
        title: 'Create the campaign',
        steps: [
          'Open "Campaigns" and create a campaign: name, channel ("Call", "WhatsApp" or "SMS") and agent.',
          'Hours: one or more time windows per day (for example 9am–12pm and 2pm–6pm) and the days allowed.',
          'Retries: number of attempts (1 to 5) and the gap between attempts; choose whether voicemail counts as an attempt.',
          '"Retry until goal completed" option: the campaign keeps calling until the goal is met (a yes/no post-call field, for example appointment booked).',
          'Add contacts (manually or by importing a file), then click "Start Campaign".',
        ],
      },
      {
        title: 'Monitor and adjust',
        list: [
          'The campaign dashboard shows calls in progress, completed calls, remaining contacts and the next call.',
          'To change the settings: pause the campaign, make your changes, then restart it. Nothing is lost.',
          'Fallback option: after the last call attempt, send a single SMS or WhatsApp template.',
        ],
        tip: 'Start with 2 or 3 attempts during office hours in your contacts’ country, and always honour opt-out requests ("Blacklist" menu).',
      },
    ],
    related: ['contacts-leads', 'numero-presente', 'donnees-apres-appel'],
  },
  {
    slug: 'contacts-leads',
    category: 'outbound',
    title: 'Import and manage your contacts (leads)',
    summary: 'Import a contact file, personalise each call and track statuses.',
    sections: [
      {
        title: 'Prepare the file',
        list: [
          'CSV or Excel format, with a phone_number column (required).',
          'One column per agent variable (for example customer_name, company) to personalise the call.',
          'Numbers in international format without spaces (+447700900123), or national format with one file per country.',
          'Download the sample file offered at import to start with the right format.',
        ],
      },
      {
        title: 'Import',
        steps: [
          'Open "Leads" (or the campaign’s contacts tab), then "Import Leads".',
          'Choose the campaign, the number format and, if needed, how many secondary numbers there are.',
          'Match each column to the right field (detected automatically), then start the import.',
          'Invalid or duplicate rows are skipped and listed in a downloadable report.',
        ],
      },
      {
        title: 'Manage contacts',
        list: [
          'Statuses: "Created" (to be called), "Processing", "Rescheduled" (retry scheduled), "Completed", "Max Retries".',
          'Setting a contact back to "Created" means it will be called again; setting it to "Completed" stops the calls.',
          'Secondary numbers: called in order if the main number doesn’t answer (call campaigns only).',
          'Filters, bulk delete and CSV export are available in the list.',
        ],
        tip: 'Do a small test import first to check the format, then import the rest.',
      },
    ],
    related: ['campagnes-d-appels', 'donnees-apres-appel', 'editeur-de-prompt-ia'],
  },

  // ---------- Call tracking and automations ----------
  {
    slug: 'historique-des-appels',
    category: 'results',
    title: 'Find your calls and conversations',
    summary: 'Listen to recordings, read transcripts and follow written conversations.',
    plan: 'All plans.',
    sections: [
      {
        title: 'Calls',
        steps: [
          'Open the "Calls history" menu.',
          'Filter by agent, date or direction (inbound / outbound).',
          'Open a call: recording, transcript, summary, extracted data and duration.',
        ],
      },
      {
        title: 'Written conversations',
        text: 'The "Inbox" menu brings together written exchanges with your agents:',
        list: [
          '"Web widget": conversations from your website, with the form data.',
          '"WhatsApp": WhatsApp exchanges, showing the status of the 24-hour window.',
          '"Test": your test chat sessions.',
          'Filter by type, agent or date; open a conversation to see the messages, variables and cost.',
        ],
      },
      {
        title: 'Making the most of it',
        list: [
          'Listen to a few calls each week and add any badly handled cases to the instructions.',
          'Delete test conversations to keep your history tidy (deletion is permanent).',
        ],
      },
    ],
    related: ['donnees-apres-appel', 'automatisations', 'consignes-system-prompt'],
  },
  {
    slug: 'donnees-apres-appel',
    category: 'results',
    title: 'Extract the key details from every call',
    summary: 'Define the data the AI extracts after each call and send it to your tools.',
    plan: 'All plans.',
    sections: [
      {
        title: 'Define the data to extract',
        text: 'After each call, the AI reads back the conversation and fills in the fields you have defined ("Post-call evaluation"). Two fields exist by default: "status" (goal met, yes/no) and "summary".',
        steps: [
          'Open the agent, post-call data section.',
          'Add a field: a lower-case name with no spaces (for example appointment_booked), a type (text, number, yes/no) and a precise description.',
          'Examples: budget (number), decision_maker (yes/no), call_reason (text), urgency (number from 1 to 10).',
        ],
        tip: 'The more precise the description, the more reliable the extraction. Keep it consistent with the goal set out in the instructions.',
      },
      {
        title: 'Send the results to your tools',
        steps: [
          '"Webhooks & channels" section: switch sending on and paste the receiving address (webhook).',
          'Choose whether to send only completed calls or all calls, with or without the recording link.',
          'Save, then click "Make test request" to check it arrives.',
        ],
        text: 'Each payload includes the number, duration, status, extracted data, original variables and transcript.',
      },
      {
        title: 'Using this data',
        list: [
          'Automatically retry in a campaign until the goal is met.',
          'Update your CRM or a Google Sheet, or alert your team, using automations.',
        ],
      },
    ],
    related: ['automatisations', 'historique-des-appels', 'campagnes-d-appels'],
  },
  {
    slug: 'automatisations',
    category: 'results',
    title: 'Getting started with automations',
    summary: 'Automatically send call results to your CRM, Google Sheets, Slack or by email.',
    plan: 'Assistant plan and above (5,000 runs a month, 50,000 with Call Centre).',
    sections: [
      {
        title: 'The idea',
        text: 'The "Automate platform" menu opens a no-code workflow editor connected to more than 300 tools. A workflow ("flow") starts with a trigger, followed by a series of actions.',
      },
      {
        title: 'Useful triggers',
        list: [
          'Call ended ("Call Ended"): runs as soon as a call finishes, with the transcript and extracted data.',
          'Incoming call: runs before the agent answers, so you can look the caller up in your CRM and personalise the greeting.',
          'Also: schedules (every day at 8am…), webhooks, WhatsApp events.',
        ],
      },
      {
        title: 'Create your first flow',
        steps: [
          'Open "Automate platform" and create a flow (or start from a template).',
          'Choose the "Call Ended" trigger.',
          'Add an action: a row in Google Sheets, a contact in your CRM, an email or a Slack message to the team.',
          'Insert the call data (summary, number, extracted fields) into the action.',
          'Test each step, then publish the flow.',
        ],
        tip: 'Common examples: update HubSpot after every call, add a qualified contact to a callback campaign, email the call summary.',
      },
    ],
    related: ['donnees-apres-appel', 'outils-sur-mesure', 'historique-des-appels'],
  },

  // ---------- Minutes and billing ----------
  {
    slug: 'minutes-et-facturation',
    category: 'billing',
    title: 'Understanding minutes, credit and billing',
    summary: 'How minutes are counted, what credit is for and where to manage your subscription.',
    sections: [
      {
        title: 'What you pay for',
        list: [
          'Your monthly plan, with call minutes included.',
          'Minutes beyond your plan, paid for from your credit ("Credits": 100 credits = $1).',
          'WhatsApp messages, SMS and written AI replies, paid for with message credits.',
          'Dedicated numbers, from {numberFrom} a month depending on the country.',
        ],
      },
      {
        title: 'How minutes are counted',
        list: [
          'The minutes used by each call are shown in "Calls history".',
          'Included minutes renew every month, on your subscription date.',
          'Test calls (browser or phone) also use minutes.',
        ],
      },
      {
        title: 'Where to manage what',
        list: [
          '"Add credits": buy a top-up; credit never expires.',
          '"Change plan": switch plans. If you often go over, the next plan up works out cheaper per minute.',
          '"Billing info": payment method, invoices and subscription.',
          '"Limits": what your plan allows (agents, concurrent calls, numbers…).',
        ],
        tip: 'The "Dashboard" shows your usage for the month. With automations, you can get an alert when you are nearing your limit.',
      },
    ],
    related: ['tester-son-agent', 'acheter-un-numero', 'campagnes-d-appels'],
  },
  // ---------- Additions (playbook): call forwarding, outbound calling rules, pre-launch checks, monthly review ----------
  {
    slug: 'renvoi-d-appel',
    category: 'phone',
    title: 'Keep your number with call forwarding',
    summary: 'Have the agent answer only when you don’t pick up, when you’re busy or outside opening hours, without changing your number.',
    plan: 'All plans. Forwarding is charged by your phone provider.',
    sections: [
      {
        title: 'How it works',
        text: 'You keep the number on your business cards, website and listings. With your phone provider, you set up forwarding to the agent’s number: all your calls, or only the ones you don’t take. Nothing changes for your customers.',
      },
      {
        title: 'Forwarding codes on a mobile',
        text: 'On most mobiles and networks, dial the code followed by the agent’s number in international format, ending with # and the call key (some networks use their own codes: check with yours):',
        list: [
          'When you don’t answer: **61*agent’s number# (you can often add the delay before forwarding, for example **61*number**20#).',
          'When your line is busy: **67*agent’s number#',
          'When your phone is off or out of coverage: **62*agent’s number#',
          'All calls, all the time: **21*agent’s number#',
          'To switch off: ##61#, ##67#, ##62# or ##21#, or ##002# to cancel everything.',
        ],
      },
      {
        title: 'On a landline or office phone system',
        steps: [
          'Open your provider’s online account (or your phone system’s menu).',
          'Look for "call forwarding" or "call divert".',
          'Choose the type of forwarding (no answer, busy or always) and enter the agent’s number.',
          'Save, then call your number from another phone to check.',
        ],
      },
      {
        title: 'The right setting for your business',
        list: [
          'You want to stay in control: forward on no answer (after 15 to 20 seconds) and when busy.',
          'Evenings and weekends: forward all calls when you close, switch it off when you open (some phone systems can schedule this).',
          'Call peaks: forwarding when busy is enough, the agent takes calls in parallel.',
        ],
        tip: 'Your provider charges forwarding like a call to the agent’s number: check your tariff, especially if that number is abroad. For a local number, you can also import your Twilio or Telnyx numbers or connect your phone system over SIP.',
      },
    ],
    related: ['acheter-un-numero', 'connexion-sip', 'importer-twilio-telnyx'],
  },
  {
    slug: 'qui-peut-on-appeler',
    category: 'outbound',
    title: 'Who can your agent call?',
    summary: 'The rules to follow before an outbound call campaign: consent, customer relationship, calling hours, opt-outs and transparency.',
    plan: 'Campaigns: from the Assistant plan. This guide is for information only and is not legal advice.',
    sections: [
      {
        title: 'The golden rule',
        text: 'Only call people you have a legitimate, provable reason to speak to: they asked for a callback, they agreed to be contacted, or the call is about a contract or service they have with you. Keep proof of that basis (form, date, channel).',
      },
      {
        title: 'In the United Kingdom',
        list: [
          'Screen your numbers against the TPS (individuals) and the CTPS (businesses) before any marketing call, unless the person has specifically agreed to calls from you.',
          'Apply PECR and UK GDPR: identify your business, give a valid number to call back, and honour any objection immediately.',
          'A callback the person asked for, an appointment to confirm or a follow-up on an ongoing service is not cold calling.',
          'Bought lists and numbers scraped from directories are best avoided.',
        ],
      },
      {
        title: 'In Australia',
        list: [
          'Check the Do Not Call Register before telemarketing calls, unless the person has consented to hear from you.',
          'Follow the Telemarketing and Research Calls Industry Standard: permitted calling hours, identifying your business, ending the call when asked.',
          'For SMS and other electronic messages, the Spam Act applies: consent, sender identification and a working unsubscribe.',
        ],
      },
      {
        title: 'In other countries',
        list: [
          'France: since 11 August 2026, telephone marketing to consumers requires their prior, free and explicit consent (Article L223-1 of the French Consumer Code), and it is up to you to prove it.',
          'Italy: Registro pubblico delle opposizioni. Poland: prior consent to telephone marketing. Netherlands: prior consent or an existing customer relationship.',
          'If in doubt, apply the strictest rule.',
        ],
      },
      {
        title: 'During the call',
        list: [
          'The agent says at the start that it is an AI and that the call is recorded.',
          'It gives the real reason for the call ("you asked us to call you back on…").',
          'If the person no longer wants to be called, add their number to the "Blacklist" menu: it will be excluded from every campaign.',
          'Call at reasonable times, on weekdays, in the contact’s local time.',
        ],
        tip: 'Before importing a list, note its source, the date of the relationship and the lawful basis. If you are ever audited, that record is what protects you.',
      },
    ],
    related: ['campagnes-d-appels', 'contacts-leads', 'numero-presente'],
  },
  {
    slug: 'verifier-avant-mise-en-ligne',
    category: 'start',
    title: '12 checks before putting your agent live',
    summary: 'A checklist to run through before opening the line: it prevents most first-week problems.',
    plan: 'All plans.',
    sections: [
      {
        title: 'Test on a real phone',
        text: 'Call the agent from your mobile (not through your computer speakers), just as a customer would. Also ask someone who doesn’t know the project to test it.',
      },
      {
        title: 'The checklist',
        steps: [
          'The greeting names your business, says it is an AI and asks one clear question.',
          'Your business name is pronounced correctly (if not, spell it phonetically in the instructions).',
          'An appointment booked by phone shows up in your calendar within a minute.',
          'You receive the call summary (email or dashboard).',
          'Asking "I want to speak to someone" triggers the transfer or callback you set up.',
          'An urgent keyword from your trade (leak, pain, breakdown) triggers the instruction you set.',
          'Out-of-hours behaviour matches what you want.',
          'The agent gives no price, guarantee or advice you haven’t approved.',
          'It answers your 5 most common questions correctly.',
          'The recording announcement is there if calls are recorded.',
          'Numbers not to call are in the "Blacklist" before any campaign.',
          'You have listened to three full recordings and you are happy with the tone.',
        ],
        tip: 'Note what isn’t right, fix the instructions or the knowledge base, then rerun only the tests concerned.',
      },
    ],
    related: ['tester-son-agent', 'message-d-accueil', 'consignes-system-prompt'],
  },
  {
    slug: 'point-mensuel',
    category: 'results',
    title: 'A 20-minute monthly review',
    summary: 'The four figures to check, the calls to listen back to and the settings to review so your agent stays sharp over time.',
    plan: 'All plans.',
    sections: [
      {
        title: 'The 4 figures that matter',
        list: [
          'Number of calls handled by the agent.',
          'Qualified enquiries (a real need and contact details).',
          'Appointments booked or callbacks scheduled.',
          'Estimated value: appointments × average customer value.',
        ],
        text: 'Minutes used tell you about your plan, not your results: look first at what the calls brought in.',
      },
      {
        title: 'Listen back to 10 calls',
        steps: [
          '"Calls" menu: pick 10 random calls from the month.',
          'For each one: was the request understood? was the right action taken? are you happy with the tone?',
          'Only change the instructions if the same problem comes up at least twice.',
        ],
      },
      {
        title: 'Check what breaks silently',
        list: [
          'The calendar is still connected (a renamed or deleted calendar stops bookings).',
          'Automations and webhooks are running without errors.',
          'Your opening hours, prices and holidays are up to date in the knowledge base.',
        ],
        tip: 'Block out 20 minutes on the first working day of each month. An agent that is reviewed regularly stays accurate; a forgotten one drifts.',
      },
    ],
    related: ['historique-des-appels', 'donnees-apres-appel', 'automatisations'],
  },
];


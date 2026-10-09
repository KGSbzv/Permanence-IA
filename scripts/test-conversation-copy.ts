// Tests de la copie de l’échange envoyée par email (aucun réseau, aucune base réelle, aucun envoi réel) :
//   npx tsx scripts/test-conversation-copy.ts
// Supabase simulé en mémoire (fetch remplacé : toute autre adresse est refusée), sendMail remplacé par un faux qui
// enregistre le message préparé, pied de page compris ; SMTP retiré : rien ne peut partir pour de vrai. Vérifie : les
// deux formats de transcription, outils et texte interne exclus, langue et prénom selon l’agent (Jade, Hugo, Katie,
// נועה de droite à gauche, agents multilingues), adresse invalide ignorée, une seule copie par échange (renvoi
// WhatsApp, webhooks simultanés), HTML échappé, pied de page présent, rien sans copy_email ni après un refus d’être
// contacté (ni après une opposition reçue pendant l’échange), réponse 200 même si l’envoi ou la base échoue, erreur
// SMTP enregistrée sans adresse, plafonds par adresse (+étiquette et points Gmail compris) et pour tout le site (y
// compris webhooks simultanés), échange très long raccourci, liens de l’agent hors permanenceia.com retirés, liens de
// la personne désactivés, contrôles bidirectionnels et caractères invisibles retirés (émojis composés intacts),
// expressions régulières en temps borné sur des messages hostiles, mention « si vous n’êtes pas à l’origine de cette
// demande » dans les 6 langues, numéro déjà opposé qui redit STOP pendant l’échange.
import assert from 'node:assert/strict';
import { randomBytes, randomUUID } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';

const FAKE_DB = 'https://supabase.invalid';
const TOKEN = randomBytes(24).toString('hex');
process.env.SUPABASE_URL = FAKE_DB;
process.env.SUPABASE_SERVICE_ROLE_KEY = `sb_secret_test_${randomBytes(8).toString('hex')}`;
process.env.WEBHOOK_TOKEN = TOKEN;
process.env.ACCOUNT_CODE_SECRET = randomBytes(32).toString('hex');
for (const k of ['ZOHO_SMTP_USER', 'ZOHO_SMTP_PASS', 'WEBHOOK_TOKEN_NEXT', 'WEBHOOK_ALLOW_QUERY_TOKEN', 'CONVERSATION_COPY', 'AUTOCALLS_API_KEY', 'NOTIFY_EMAIL']) delete process.env[k];

type Row = Record<string, any>;

/* ---------- Supabase en mémoire (PostgREST : eq, neq, gte, lte, in, is, ->>, order, limit) ---------- */

const tables = new Map<string, Row[]>();
const requests: string[] = [];
let dbDown = false;
let clock = Date.now();
const rowsOf = (t: string) => { if (!tables.has(t)) tables.set(t, []); return tables.get(t)!; };
const RESERVED = new Set(['select', 'order', 'limit', 'on_conflict']);
const field = (r: Row, k: string) => { const [col, sub] = k.split('->>'); const v = r[col]; return sub ? (v && typeof v === 'object' ? v[sub] : undefined) : v; };
function keep(r: Row, k: string, cond: string) {
  const v = field(r, k);
  const s = v == null ? null : String(v);
  const dot = cond.indexOf('.');
  const op = cond.slice(0, dot), arg = cond.slice(dot + 1);
  if (op === 'eq') return s === arg;
  if (op === 'neq') return s !== arg;
  if (op === 'gte') return s != null && s >= arg;
  if (op === 'lte') return s != null && s <= arg;
  if (op === 'in') return s != null && arg.replace(/^\(|\)$/g, '').split(',').includes(s);
  if (op === 'is') return arg === 'null' ? v == null : s === arg;
  throw new Error(`filtre non géré par le faux Supabase : ${k}=${cond}`);
}
function query(table: string, params: URLSearchParams) {
  let out = rowsOf(table).filter((r) => Array.from(params).every(([k, v]) => RESERVED.has(k) || keep(r, k, v)));
  const order = params.get('order');
  if (order) {
    const keys = order.split(',').map((o) => o.split('.'));
    out = [...out].sort((a, b) => {
      for (const [col, dir] of keys) {
        const x = String(a[col] ?? ''), y = String(b[col] ?? '');
        if (x !== y) return (x < y ? -1 : 1) * (dir === 'desc' ? -1 : 1);
      }
      return 0;
    });
  }
  const limit = params.get('limit');
  return limit ? out.slice(0, Number(limit)) : out;
}
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

globalThis.fetch = (async (input: unknown, init: RequestInit = {}) => {
  const url = new URL(String(input));
  if (url.origin !== FAKE_DB || !url.pathname.startsWith('/rest/v1/')) throw new Error(`réseau interdit pendant les tests : ${url.origin}`);
  const table = url.pathname.slice('/rest/v1/'.length);
  const method = String(init.method || 'GET').toUpperCase();
  requests.push(`${method} ${table} ${decodeURIComponent(url.search)}`);
  if (dbDown) return new Response('base en panne (test)', { status: 503 });
  const headers = (init.headers || {}) as Record<string, string>;
  if (method === 'GET') return json(query(table, url.searchParams));
  if (method === 'POST') {
    const body = JSON.parse(String(init.body));
    const created = (Array.isArray(body) ? body : [body]).map((r: Row) => ({ id: randomUUID(), created_at: new Date(clock++).toISOString(), ...r }));
    rowsOf(table).push(...created);
    return /return=representation/.test(headers.Prefer || '') ? json(created, 201) : new Response(null, { status: 201 });
  }
  if (method === 'PATCH') {
    const patch = JSON.parse(String(init.body));
    for (const r of query(table, url.searchParams)) Object.assign(r, patch);
    return new Response(null, { status: 204 });
  }
  throw new Error(`méthode non gérée : ${method}`);
}) as typeof fetch;

/* ---------- Échanges ---------- */

const T0 = '2026-10-09T09:22:35+03:00'; // 08:22 à Paris, 07:22 à Londres, 09:22 à Jérusalem

function conversation(o: { id?: string; aid: string; copy?: unknown; outcome?: string; transcript: unknown[]; phone?: string | null; vars?: Row; type?: string; created?: string | null }) {
  return {
    conversation_id: o.id ?? randomUUID(), assistant_id: o.aid, assistant_name: 'Agent de test', type: o.type ?? 'widget',
    message_count: o.transcript.length, status: 'ended',
    extracted_variables: { summary: 'Résumé de test', outcome: o.outcome ?? 'information', ...(o.copy === undefined ? {} : { copy_email: o.copy }), ...(o.vars || {}) },
    input_variables: [], transcript: o.transcript, formatted_transcript: 'AI: …\nCustomer: …',
    customer_phone: o.phone ?? null, customer_name: null, sender: { phone_number: '+10000000000', display_name: 'Test' },
    created_at: o.created === null ? undefined : o.created ?? T0, ended_at: T0,
  };
}
const chat = (...msgs: Array<[string, string]>) => msgs.map(([role, content]) => ({ role, content }));

const FR_CHAT = [
  { role: 'assistant', content: 'Bonjour, je suis Jade. Comment puis-je vous aider ?' },
  { role: 'user', content: 'Je voudrais une copie <b>de notre échange</b> & le tarif "Découverte" <script>alert(1)</script>.' },
  { role: 'assistant', content: null, tool_calls: [{ type: 'function', function: { name: 'save_lead', arguments: '{"email":"TOOL_ARGUMENTS"}' } }] },
  { role: 'tool', content: '{"saved":true,"message":"SECRET_TOOL_OUTPUT"}' },
  { role: 'system', content: 'INTERNAL_SYSTEM_TEXT' },
  { role: 'function', content: 'FUNCTION_OUTPUT' },
  { role: 'assistant', content: 'C’est noté :\nje vous envoie la copie.' },
];

async function main() {
  const { REQUESTERS } = await import('@/lib/callbackPersona');
  const { prepareMail } = await import('@/lib/server');
  const copy = await import('@/lib/conversationCopy');
  const { default: handler } = await import('@/pages/api/webhooks/autocalls');
  const { extractTurns, copyContext, buildCopyMail, sendConversationCopy, copyDeps, safeTurnText, maskEmails, MAX_TURNS, MAX_PER_ADDRESS_PER_DAY, MAX_COPIES_PER_DAY } = copy;
  type MailOptions = import('@/lib/server').MailOptions;

  const uuid = (id: number) => REQUESTERS.find((r) => r.id === id)!.uuid;
  const A = { jade: uuid(21203), hugo: uuid(21269), katie: uuid(21206), noa: uuid(21306), whatsapp: uuid(21358), messenger: uuid(21297), espace: uuid(21205) };

  // Faux sendMail : message préparé comme en production (pied de page, en-têtes), jamais transmis.
  const sent: Array<{ m: MailOptions; message: Row }> = [];
  // Erreur levée par le faux SMTP (texte de la réponse), false : envoi réussi.
  let mailFails: string | false = false;
  const fakeSendMail = async (m: MailOptions) => {
    if (mailFails) throw new Error(mailFails);
    const prepared = await prepareMail(m, { select: async () => [], insert: async () => undefined });
    assert.ok(prepared.message, 'email essentiel jamais sauté');
    sent.push({ m, message: prepared.message as Row });
    return true;
  };
  const realSendMail = copyDeps.sendMail;
  copyDeps.sendMail = fakeSendMail;
  const deps = { ...copyDeps, sendMail: fakeSendMail };

  const logs: string[] = [];
  async function webhook(body: Row) {
    const req = { method: 'POST', headers: { 'x-webhook-token': TOKEN }, query: {}, url: '/api/webhooks/autocalls', body } as unknown as NextApiRequest;
    let status = 0;
    let reply: unknown;
    const res = { status(c: number) { status = c; return { json(b: unknown) { reply = b; return res; } }; } } as unknown as NextApiResponse;
    const saved = { log: console.log, error: console.error, info: console.info };
    console.log = console.error = console.info = (...a: unknown[]) => { logs.push(a.map(String).join(' ')); };
    try { await handler(req, res); } finally { Object.assign(console, saved); }
    return { status, reply };
  }
  const copyRows = (id: string) => rowsOf('call_events').filter((r) => r.kind === 'email' && r.external_id === id);
  const sentTo = (to: string) => sent.filter((s) => s.m.to === to);

  let passed = 0;
  const test = async (name: string, fn: () => Promise<void> | void) => {
    try { await fn(); passed++; console.log(`ok  ${name}`); } catch (e) { console.error(`ÉCHEC  ${name}`); console.error(logs.slice(-15).join('\n')); throw e; }
  };

  /* ---------- Transcriptions ---------- */

  await test('conversation : seuls les messages assistant / personne, dans l’ordre (outils, système, fonctions exclus)', () => {
    const turns = extractTurns(FR_CHAT);
    assert.deepEqual(turns.map((t) => t.from), ['agent', 'person', 'agent']);
    assert.equal(turns[2].text, 'C’est noté :\nje vous envoie la copie.');
    assert.ok(!JSON.stringify(turns).match(/SECRET_TOOL_OUTPUT|INTERNAL_SYSTEM_TEXT|FUNCTION_OUTPUT|TOOL_ARGUMENTS|save_lead/));
  });
  await test('appel (post_call) : entrées « transcript » seulement, function et résultats exclus', () => {
    const turns = extractTurns([
      { type: 'transcript', text: 'Bonjour, ici Hugo.', sender: 'bot', timestamp: 1 },
      { type: 'function', text: 'check_availability({"date":"x"}) TOOL_CALL', sender: 'bot' },
      { type: 'function_result', text: 'TOOL_RESULT', sender: 'bot' },
      { type: 'transcript', text: '  ', sender: 'human' },
      { type: 'transcript', text: 'Envoyez-moi la copie.', sender: 'human' },
      { type: 'event', text: 'call_transferred', sender: 'system' },
    ]);
    assert.deepEqual(turns, [{ from: 'agent', text: 'Bonjour, ici Hugo.' }, { from: 'person', text: 'Envoyez-moi la copie.' }]);
    assert.deepEqual(extractTurns(null), []);
    assert.deepEqual(extractTurns('AI: texte'), []);
  });

  /* ---------- Langue et prénom ---------- */

  const ctxOf = (aid: string, transcript: unknown[], extra: Row = {}) => copyContext({ assistant_id: aid, ...extra }, extractTurns(transcript));
  await test('agents d’une langue : fr Jade, fr Hugo (masculin), en-gb Katie, he נועה', () => {
    assert.deepEqual(ctxOf(A.jade, FR_CHAT), { locale: 'fr', agent: 'Jade', gender: 'female', source: 'agent' });
    assert.equal(ctxOf(A.hugo, []).gender, 'male');
    assert.equal(ctxOf(A.hugo, []).agent, 'Hugo');
    assert.deepEqual(ctxOf(A.katie, chat(['user', 'Bonjour'])), { locale: 'en-gb', agent: 'Katie', gender: 'female', source: 'agent' });
    assert.deepEqual(ctxOf(A.noa, []), { locale: 'he', agent: 'נועה', gender: 'female', source: 'agent' });
    assert.equal(ctxOf(A.jade.toUpperCase(), []).agent, 'Jade', 'UUID en majuscules');
  });
  await test('agents multilingues : variable de langue, puis messages, puis indicatif, sinon anglais (Royaume-Uni)', () => {
    assert.deepEqual(ctxOf(A.whatsapp, chat(['user', 'Hello there, I need help with my account please']), { extracted_variables: { language: 'he' } }),
      { locale: 'he', agent: 'נועה', gender: 'female', source: 'variables' });
    assert.equal(ctxOf(A.whatsapp, [], { extracted_variables: { langue: 'French' } }).agent, 'Lucie');
    assert.deepEqual(ctxOf(A.whatsapp, chat(['assistant', 'Hi!'], ['user', 'Buongiorno, vorrei sapere il prezzo per una segreteria, grazie'])),
      { locale: 'it', agent: 'Manuela', gender: 'female', source: 'transcript' });
    assert.equal(ctxOf(A.messenger, chat(['user', 'Hallo, ik wil graag een afspraak maken voor mijn bedrijf'])).agent, 'Emma');
    assert.equal(ctxOf(A.messenger, chat(['user', 'Dzień dobry, chciałbym zapytać o cenę'])).locale, 'pl');
    assert.equal(ctxOf(A.espace, chat(['user', 'שלום, אני רוצה עזרה עם החשבון'])).agent, 'נועה');
    assert.deepEqual(ctxOf(A.espace, chat(['user', 'Hello, I would like to know the price please'])), { locale: 'en-gb', agent: 'Katie', gender: 'female', source: 'transcript' });
    assert.equal(ctxOf(A.whatsapp, chat(['user', 'Hello, what are your prices please?']), { customer_phone: '+61412345678' }).agent, 'Charlotte');
    assert.deepEqual(ctxOf(A.whatsapp, chat(['user', 'ok']), { customer_phone: '+33612345678' }), { locale: 'fr', agent: 'Lucie', gender: 'female', source: 'phone' });
    assert.deepEqual(ctxOf(A.whatsapp, chat(['user', '👍'])), { locale: 'en-gb', agent: 'Katie', gender: 'female', source: 'default' });
  });
  await test('agent inconnu : langue des messages, étiquette générique sans prénom', () => {
    const ctx = ctxOf(randomUUID(), chat(['user', 'Bonjour, je voudrais des informations sur vos tarifs, merci']));
    assert.deepEqual(ctx, { locale: 'fr', agent: null, gender: 'female', source: 'transcript' });
    const m = buildCopyMail({ to: 'x@example.com', ctx, turns: extractTurns(chat(['assistant', 'Bonjour'], ['user', 'Merci'])), at: new Date(T0) });
    assert.match(m.text, /avec l’assistant IA de Permanence IA, le vendredi 9 octobre 2026 à 08:22\./);
    assert.match(m.text, /Assistant IA : Bonjour/);
  });

  /* ---------- Contenu de l’email ---------- */

  await test('email long : 400 messages au plus avec une note, message géant raccourci', () => {
    const many = Array.from({ length: 450 }, (_, i) => ({ from: (i % 2 ? 'person' : 'agent') as 'person' | 'agent', text: `message ${i}` }));
    many[0].text = 'x'.repeat(9000);
    const m = buildCopyMail({ to: 'x@example.com', ctx: { locale: 'fr', agent: 'Jade', gender: 'female', source: 'agent' }, turns: many, at: new Date(T0) });
    assert.equal((m.html!.match(/font-weight:bold/g) || []).length, MAX_TURNS);
    assert.ok(m.text.includes('message 399') && !m.text.includes('message 400'));
    assert.match(m.text, /cette copie ne reprend que les 400 premiers messages \(sur 450\)/);
    assert.match(m.text, /x{8000}… \(message raccourci\)/);
    assert.ok(!m.text.includes('x'.repeat(8001)));
  });

  /* ---------- Webhook ---------- */

  await test('widget écrit (conversation_ended), Jade : une copie complète, échappée, avec pied de page', async () => {
    const p = conversation({ aid: A.jade, copy: ' Jean.Dupont@Example.com ', transcript: FR_CHAT });
    const r = await webhook(p);
    assert.deepEqual(r, { status: 200, reply: { received: true } });
    const mails = sentTo('jean.dupont@example.com');
    assert.equal(mails.length, 1);
    const { m, message } = mails[0];
    assert.equal(m.category, 'essential');
    assert.equal(m.locale, 'fr');
    assert.equal(m.fromName, 'Permanence IA');
    assert.equal(m.subject, 'Copie de votre échange avec Jade · Permanence IA');
    assert.match(m.text, /^Voici la copie de votre échange avec Jade, l’assistante IA de Permanence IA, le vendredi 9 octobre 2026 à 08:22\. Vous pouvez la conserver ou la copier comme vous le souhaitez\./);
    const iHello = m.text.indexOf('Jade : Bonjour, je suis Jade.');
    const iAsk = m.text.indexOf('Vous : Je voudrais une copie <b>de notre échange</b> & le tarif "Découverte"');
    const iDone = m.text.indexOf('Jade : C’est noté :\nje vous envoie la copie.');
    assert.ok(iHello >= 0 && iAsk > iHello && iDone > iAsk, 'trois messages, dans l’ordre (version texte)');
    // HTML : tout le texte de l’échange est échappé.
    assert.ok(m.html!.includes('&lt;b&gt;de notre échange&lt;/b&gt; &amp; le tarif &quot;Découverte&quot; &lt;script&gt;alert(1)&lt;/script&gt;.'));
    assert.ok(!/<script|<b>de notre/.test(m.html!));
    assert.ok(m.html!.includes('C’est noté :<br>je vous envoie la copie.'));
    assert.match(m.html!, /^<div dir="ltr" lang="fr"/);
    for (const s of [m.text, m.html!]) assert.ok(!/SECRET_TOOL_OUTPUT|INTERNAL_SYSTEM_TEXT|FUNCTION_OUTPUT|TOOL_ARGUMENTS|save_lead/.test(s), 'aucun outil ni texte interne');
    // Pied de page légal ajouté par sendMail (texte et HTML) et désinscription en un clic.
    assert.match(message.text, /Copyright © \d{4} .+\nPermanence IA est une marque de /);
    assert.ok(message.text.includes('/confidentialite') && message.text.includes('/cgu'));
    assert.ok(message.html.includes('Politique de confidentialité') && message.html.includes('Conditions générales'));
    assert.ok(message.headers['List-Unsubscribe']);
    // Trace en base : une ligne, envoyée, sans l’adresse en clair.
    const rows = copyRows(`copy-conversation-${p.conversation_id}`);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].outcome, 'copie_conversation');
    assert.equal(rows[0].status, 'envoyee');
    assert.ok(!JSON.stringify(rows[0]).includes('dupont'));
    assert.ok(rowsOf('call_events').some((r) => r.kind === 'conversation' && r.external_id === p.conversation_id), 'échange toujours enregistré');
  });

  await test('WhatsApp : la même conversation renvoyée après chaque message → une seule copie', async () => {
    const id = randomUUID();
    const first = chat(['assistant', 'Bonjour, ici Lucie.'], ['user', 'Bonjour, envoyez-moi la copie de notre échange, merci']);
    const base = { id, aid: A.whatsapp, type: 'whatsapp', copy: 'wa@example.com', phone: '+33612345678' };
    assert.equal((await webhook(conversation({ ...base, transcript: first }))).status, 200);
    assert.equal((await webhook(conversation({ ...base, transcript: first }))).status, 200);
    assert.equal((await webhook(conversation({ ...base, transcript: [...first, ...chat(['assistant', 'Avec plaisir.'], ['user', 'Merci !'])] }))).status, 200);
    assert.equal(sentTo('wa@example.com').length, 1);
    assert.equal(sentTo('wa@example.com')[0].m.subject, 'Copie de votre échange avec Lucie · Permanence IA');
    assert.equal(copyRows(`copy-conversation-${id}`).length, 1);
    assert.ok(logs.some((l) => l.includes('copie déjà envoyée pour cet échange')));
  });

  await test('widget vocal (post_call web), Hugo : paroles seulement, accord masculin', async () => {
    const r = await webhook({
      id: 777001, type: 'web', assistant_id: A.hugo, assistant_name: 'Hugo', duration: 60, status: 'completed',
      extracted_variables: { copy_email: 'voix@example.com', outcome: 'information' },
      transcript: [
        { type: 'transcript', text: 'Bonjour, ici Hugo.', sender: 'bot', timestamp: 1791528454 },
        { type: 'function', text: 'check_availability TOOL_CALL', sender: 'bot', timestamp: 1791528455 },
        { type: 'transcript', text: 'Envoyez-moi la copie.', sender: 'human', timestamp: 1791528464 },
      ],
      formatted_transcript: 'AI: …', created_at: '2026-10-09T12:00:00Z', finished_at: '2026-10-09T12:01:00Z',
    });
    assert.equal(r.status, 200);
    const [{ m }] = sentTo('voix@example.com');
    assert.match(m.text, /avec Hugo, l’assistant IA de Permanence IA, le vendredi 9 octobre 2026 à 14:00\./);
    assert.ok(m.text.includes('Hugo : Bonjour, ici Hugo.') && m.text.includes('Vous : Envoyez-moi la copie.'));
    assert.ok(!m.text.includes('TOOL_CALL') && !m.html!.includes('TOOL_CALL'));
    assert.equal(copyRows('copy-call-777001')[0].status, 'envoyee');
  });

  await test('hébreu, נועה : email de droite à gauche, prénom hébreu, heure de Jérusalem, pied en hébreu', async () => {
    await webhook(conversation({ aid: A.noa, copy: 'noa@example.com', transcript: chat(['assistant', 'שלום, אני נועה. איך אפשר לעזור?'], ['user', 'אשמח לקבל עותק של השיחה']) }));
    const [{ m, message }] = sentTo('noa@example.com');
    assert.equal(m.locale, 'he');
    assert.equal(m.fromName, 'PermanenceAI');
    assert.equal(m.subject, 'עותק של השיחה שלכם עם נועה · PermanenceAI');
    assert.match(m.html!, /^<div dir="rtl" lang="he" [^>]*text-align:right/);
    assert.ok(m.text.startsWith('זהו העותק של השיחה שלכם עם נועה, עוזרת ה-AI של PermanenceAI, ביום שישי, 9 באוקטובר 2026, בשעה 09:22.'));
    assert.ok(m.text.includes('נועה: שלום, אני נועה.') && m.text.includes('אתם: אשמח לקבל עותק של השיחה'));
    assert.ok(message.html.includes('dir="rtl"') && message.html.includes('מדיניות הפרטיות'));
  });

  await test('anglais (Royaume-Uni), Katie : « You », heure de Londres', async () => {
    await webhook(conversation({ aid: A.katie, copy: 'katie.user@example.co.uk', transcript: chat(['assistant', 'Hello, I’m Katie.'], ['user', 'Please send me a copy.']) }));
    const [{ m, message }] = sentTo('katie.user@example.co.uk');
    assert.equal(m.locale, 'en-gb');
    assert.equal(m.subject, 'Copy of your conversation with Katie · PermanenceAI');
    assert.ok(m.text.startsWith('Here is a copy of your conversation with Katie, PermanenceAI’s AI assistant, on Friday, 9 October 2026 at 07:22. You can keep or copy it as you like.'));
    assert.ok(m.text.includes('Katie: Hello, I’m Katie.') && m.text.includes('You: Please send me a copy.'));
    assert.ok(message.text.includes('/en-gb/confidentialite') && message.text.includes('PermanenceAI is a brand of'), 'pied de page anglais');
  });

  await test('polonais (WhatsApp) : prénom décliné « z Leną », messages de la personne « Ty »', async () => {
    await webhook(conversation({ aid: A.whatsapp, type: 'whatsapp', copy: 'pl@example.com', transcript: chat(['assistant', 'Dzień dobry!'], ['user', 'Dzień dobry, proszę o kopię rozmowy']) }));
    const [{ m }] = sentTo('pl@example.com');
    assert.equal(m.subject, 'Kopia Państwa rozmowy z Leną · PermanenceAI');
    assert.ok(m.text.startsWith('Oto kopia Państwa rozmowy z Leną, asystentką AI PermanenceAI, z dnia 9 października 2026 r., godz. 08:22.'));
    assert.ok(m.text.includes('Lena: Dzień dobry!') && m.text.includes('Ty: Dzień dobry, proszę o kopię rozmowy'));
  });

  await test('italien (WhatsApp) : messages de la personne « Tu »', async () => {
    await webhook(conversation({ aid: A.whatsapp, type: 'whatsapp', copy: 'it@example.com', transcript: chat(['assistant', 'Buongiorno!'], ['user', 'Buongiorno, vorrei una copia della conversazione, grazie']) }));
    const [{ m }] = sentTo('it@example.com');
    assert.ok(m.text.startsWith('Ecco la copia della Sua conversazione con Manuela, l’assistente AI di PermanenceIA,'));
    assert.ok(m.text.includes('Manuela: Buongiorno!') && m.text.includes('Tu: Buongiorno, vorrei una copia della conversazione, grazie'));
  });

  await test('adresse invalide ou variable non remplie : aucune copie, réponse 200', async () => {
    const before = sent.length;
    // « x:cap@… » : un groupe d’adresses pour le SMTP (envoi à cap@…), qui échapperait au plafond de cap@….
    for (const bad of ['jean at gmail dot com', '{{copy_email}}', 'non', 'a@b', 'x@{y}.com', 'x:cap@example.com']) {
      assert.equal((await webhook(conversation({ aid: A.jade, copy: bad, transcript: FR_CHAT }))).status, 200);
    }
    assert.equal(sent.length, before);
    assert.ok(logs.some((l) => l.includes('copy_email n’est pas une adresse email valide')));
    const colon = await sendConversationCopy(conversation({ aid: A.jade, copy: 'x:cap@example.com', transcript: FR_CHAT }), { kind: 'conversation', externalId: randomUUID() }, deps);
    assert.deepEqual(colon, { sent: false, reason: 'copy_email n’est pas une adresse email valide' });
  });

  await test('sans copy_email (ou vide, ou rappel sortant) : aucune copie et aucune requête de copie', async () => {
    const before = sent.length;
    const reqs = requests.length;
    await webhook(conversation({ aid: A.jade, transcript: FR_CHAT }));
    await webhook(conversation({ aid: A.jade, copy: '', transcript: FR_CHAT }));
    await webhook(conversation({ aid: A.jade, copy: null, transcript: FR_CHAT }));
    await webhook({ id: 777002, type: 'outbound', assistant_id: uuid(21182), status: 'completed', extracted_variables: { outcome: 'rappel_effectue' },
      transcript: [{ type: 'transcript', text: 'Bonjour', sender: 'bot' }], created_at: T0 });
    assert.equal(sent.length, before);
    assert.ok(!requests.slice(reqs).some((q) => q.includes('copy-')), 'aucune lecture ni écriture de copie');
  });

  await test('refus d’être contacté (ne_plus_appeler, desinscription, mauvais_contact) : jamais de copie', async () => {
    for (const outcome of ['ne_plus_appeler', 'desinscription', 'mauvais_contact']) {
      const to = `stop-${outcome}@example.com`;
      const r = await webhook(conversation({ aid: A.whatsapp, type: 'whatsapp', copy: to, outcome, phone: '+33698765432', transcript: chat(['assistant', 'Bonjour'], ['user', 'Ne me contactez plus, mais envoyez la copie']) }));
      assert.equal(r.status, 200);
      assert.equal(sentTo(to).length, 0, outcome);
      // Aussi par request_type (même lecture que le webhook).
      assert.equal((await sendConversationCopy({ extracted_variables: { copy_email: to, request_type: outcome }, transcript: chat(['user', 'x']) }, { kind: 'conversation', externalId: randomUUID() }, deps))?.sent, false);
    }
    assert.equal(sent.filter((s) => s.m.to.startsWith('stop-')).length, 0);
    assert.ok(logs.some((l) => l.includes('refus d’être contacté')));
  });

  await test('envoi en échec : réponse 200, trace « echec » sans l’adresse, nouvel essai au passage suivant (WhatsApp)', async () => {
    const id = randomUUID();
    const p = conversation({ id, aid: A.whatsapp, type: 'whatsapp', copy: 'retry@example.com', transcript: chat(['assistant', 'Bonjour'], ['user', 'Bonjour, la copie svp, merci']) });
    // Réponse SMTP qui cite l’adresse (et celle de l’expéditeur) : masquées en base et dans les journaux.
    mailFails = '550 5.1.1 <retry@example.com>: Recipient address rejected, from relay.sender@example.org (test)';
    try { assert.deepEqual(await webhook(p), { status: 200, reply: { received: true } }); } finally { mailFails = false; }
    assert.equal(sentTo('retry@example.com').length, 0);
    const [failed] = copyRows(`copy-conversation-${id}`);
    assert.equal(failed.status, 'echec');
    assert.equal(failed.summary, 'Copie non envoyée : 550 5.1.1 <[adresse]>: Recipient address rejected, from [adresse] (test)');
    assert.ok(!JSON.stringify(rowsOf('call_events').filter((r) => r.kind === 'email')).match(/retry@|relay\.sender@/), 'aucune adresse en clair dans les copies');
    assert.ok(logs.some((l) => l.includes('copie de l’échange: 550 5.1.1 <[adresse]>: Recipient address rejected')));
    assert.ok(!logs.some((l) => /retry@example\.com|relay\.sender@/.test(l)), 'aucune adresse dans les journaux');
    assert.equal((await webhook(p)).status, 200);
    assert.equal(sentTo('retry@example.com').length, 1);
    assert.deepEqual(copyRows(`copy-conversation-${id}`).map((r) => r.status).sort(), ['echec', 'envoyee']);
  });

  await test('vrai sendMail sans SMTP configuré (il lève une erreur) : réponse 200', async () => {
    copyDeps.sendMail = realSendMail;
    const id = randomUUID();
    try { assert.equal((await webhook(conversation({ id, aid: A.jade, copy: 'smtp@example.com', transcript: FR_CHAT }))).status, 200); }
    finally { copyDeps.sendMail = fakeSendMail; }
    assert.equal(copyRows(`copy-conversation-${id}`)[0].status, 'echec');
    assert.ok(logs.some((l) => l.includes('SMTP Zoho non configuré')));
  });

  await test('base en panne : aucune copie (jamais deux envois), réponse 200', async () => {
    dbDown = true;
    try { assert.equal((await webhook(conversation({ aid: A.jade, copy: 'down@example.com', transcript: FR_CHAT }))).status, 200); }
    finally { dbDown = false; }
    assert.equal(sentTo('down@example.com').length, 0);
  });

  await test('deux webhooks simultanés du même échange : une seule copie', async () => {
    const id = randomUUID();
    const p = conversation({ id, aid: A.jade, copy: 'race@example.com', transcript: FR_CHAT });
    const results = await Promise.all([1, 2, 3].map(() => sendConversationCopy(p, { kind: 'conversation', externalId: id }, deps)));
    assert.equal(results.filter((r) => r?.sent).length, 1);
    assert.equal(sentTo('race@example.com').length, 1);
    assert.equal(copyRows(`copy-conversation-${id}`).filter((r) => r.status === 'envoyee').length, 1);
  });

  await test(`plafond : au plus ${MAX_PER_ADDRESS_PER_DAY} copies en 24 h vers la même adresse`, async () => {
    const results = [];
    for (let i = 0; i < MAX_PER_ADDRESS_PER_DAY + 2; i++) {
      results.push(await sendConversationCopy(conversation({ aid: A.jade, copy: 'plafond@example.com', transcript: FR_CHAT }), { kind: 'conversation', externalId: randomUUID() }, deps));
    }
    assert.equal(sentTo('plafond@example.com').length, MAX_PER_ADDRESS_PER_DAY);
    assert.equal(results[MAX_PER_ADDRESS_PER_DAY]?.sent, false);
    assert.match(results[MAX_PER_ADDRESS_PER_DAY]!.reason, /plafond/);
    assert.equal(results[MAX_PER_ADDRESS_PER_DAY]?.alert, true);
  });

  await test('plafond par adresse : « +étiquette », point final et points Gmail comptent pour la même boîte', async () => {
    const results = [];
    for (let i = 1; i <= MAX_PER_ADDRESS_PER_DAY + 1; i++) {
      results.push(await sendConversationCopy(conversation({ aid: A.jade, copy: `cap+${i}@example.com`, transcript: FR_CHAT }), { kind: 'conversation', externalId: randomUUID() }, deps));
    }
    assert.equal(sent.filter((s) => /^cap\+\d@example\.com$/.test(s.m.to)).length, MAX_PER_ADDRESS_PER_DAY);
    // La copie part à l’adresse telle que donnée (étiquette comprise).
    for (let i = 1; i <= MAX_PER_ADDRESS_PER_DAY; i++) assert.equal(sentTo(`cap+${i}@example.com`).length, 1);
    assert.equal(sentTo(`cap+${MAX_PER_ADDRESS_PER_DAY + 1}@example.com`).length, 0);
    assert.deepEqual([results[MAX_PER_ADDRESS_PER_DAY]?.sent, results[MAX_PER_ADDRESS_PER_DAY]?.limit], [false, 'adresse']);
    assert.equal((await sendConversationCopy(conversation({ aid: A.jade, copy: 'cap@example.com.', transcript: FR_CHAT }), { kind: 'conversation', externalId: randomUUID() }, deps))?.limit, 'adresse', 'point final');
    // Gmail : points ignorés, googlemail.com = gmail.com ; ailleurs, les points comptent.
    const keyOf = async (to: string) => {
      const id = randomUUID();
      assert.equal((await sendConversationCopy(conversation({ id, aid: A.jade, copy: to, transcript: FR_CHAT }), { kind: 'conversation', externalId: id }, deps))?.sent, true, to);
      return copyRows(`copy-conversation-${id}`)[0].variables.to_key as string;
    };
    const gmail = [];
    for (const to of ['Jean.Copie@gmail.com', 'jeancopie+tag@googlemail.com', 'j.e.a.n.copie@gmail.com.']) gmail.push(await keyOf(to));
    assert.equal(new Set(gmail).size, 1);
    assert.equal(sentTo('j.e.a.n.copie@gmail.com.').length, 1);
    assert.notEqual(await keyOf('jean.copie@example.com'), await keyOf('jeancopie@example.com'));
  });

  await test('transcription vide ou sans identifiant : rien n’est envoyé, l’équipe est prévenue', async () => {
    const empty = await sendConversationCopy(conversation({ aid: A.jade, copy: 'empty@example.com', transcript: [{ role: 'tool', content: 'x' }] }), { kind: 'conversation', externalId: randomUUID() }, deps);
    assert.deepEqual(empty && [empty.sent, empty.alert], [false, true]);
    const noId = await sendConversationCopy(conversation({ aid: A.jade, copy: 'noid@example.com', transcript: FR_CHAT }), { kind: 'conversation', externalId: '' }, deps);
    assert.deepEqual(noId && [noId.sent, noId.alert], [false, true]);
    assert.equal(sentTo('empty@example.com').length + sentTo('noid@example.com').length, 0);
  });

  await test('interrupteur CONVERSATION_COPY=0 : aucune copie', async () => {
    process.env.CONVERSATION_COPY = '0';
    try { assert.equal((await webhook(conversation({ aid: A.jade, copy: 'off@example.com', transcript: FR_CHAT }))).status, 200); }
    finally { delete process.env.CONVERSATION_COPY; }
    assert.equal(sentTo('off@example.com').length, 0);
  });

  /* ---------- Liens et contrôles bidirectionnels ---------- */

  // Construits par leur code : jamais de caractère invisible dans ce fichier.
  const RLO = String.fromCharCode(0x202e), PDF = String.fromCharCode(0x202c), LRI = String.fromCharCode(0x2066), PDI = String.fromCharCode(0x2069);
  const agentSays = (text: string) => safeTurnText({ from: 'agent', text }, '[lien retiré]');
  const personSays = (text: string) => safeTurnText({ from: 'person', text }, '[lien retiré]');

  await test('liens de l’agent : hors permanenceia.com remplacés par la mention, ceux du site gardés', () => {
    assert.equal(agentSays('Voir https://evil.example/login, ou www.evil.com et evil.co.uk/x?a=1.'), 'Voir [lien retiré], ou [lien retiré] et [lien retiré].');
    assert.equal(agentSays('Notre site : https://permanenceia.com/tarifs et app.permanenceia.com, ou contact@permanenceia.com.'),
      'Notre site : https://permanenceia.com/tarifs et app.permanenceia.com, ou contact@permanenceia.com.');
    assert.equal(agentSays('Écrivez à jean.dupont@gmail.com (pas à https://permanenceia.com@evil.com/ ni permanenceia.com.evil.com)'),
      'Écrivez à [lien retiré] (pas à [lien retiré] ni [lien retiré])');
    assert.equal(agentSays('Pièges : hxxp://evil[.]com, HTTPS://EVIL.COM/X, evil。com, permanenceia.com/https://evil.com, ftp://files.example.net'),
      'Pièges : [lien retiré], [lien retiré], [lien retiré], [lien retiré], [lien retiré]');
    // Homographe (a cyrillique) : ce n’est pas notre domaine.
    assert.equal(agentSays(`Site : perm${String.fromCharCode(0x430)}nenceia.com`), 'Site : [lien retiré]');
    // Préfixe hébreu gardé ; texte ordinaire intact.
    assert.equal(agentSays('בקרו ב-evil.co.il או ב-permanenceia.com'), 'בקרו ב-[lien retiré] או ב-permanenceia.com');
    const plain = 'Bonjour, je suis Jade. Le tarif est de 29.90 € par mois (TVA 20 %). C’est noté :\nje vous envoie la copie à 10h30.';
    assert.equal(agentSays(plain), plain);
    assert.equal(agentSays('שלום, אני נועה. איך אפשר לעזור?'), 'שלום, אני נועה. איך אפשר לעזור?');
  });

  await test('liens de la personne : désactivés (exemple[.]com, hxxp), jamais cliquables', () => {
    assert.equal(personSays('Allez sur https://evil.com/x?a=1 ou www.Evil.com, ou http://example.pl.'),
      'Allez sur hxxps://evil[.]com/x?a=1 ou www[.]Evil[.]com, ou hxxp://example[.]pl.');
    assert.equal(personSays('mon adresse : jean.dupont@gmail.com'), 'mon adresse : jean[.]dupont@gmail[.]com');
    assert.equal(personSays('evil。com et ftp://files.example.net/a.zip'), 'evil[.]com et ftp[:]//files[.]example[.]net/a[.]zip');
    assert.equal(personSays('permanenceia.com/https://evil.com'), 'permanenceia[.]com/hxxps://evil[.]com');
    assert.equal(personSays('déjà désactivé : hxxp://evil[.]com'), 'déjà désactivé : hxxp://evil[.]com');
    const plain = 'Merci ! 29.90 € par mois, rappel à 10h30. Je voudrais une copie.';
    assert.equal(personSays(plain), plain);
  });

  await test('contrôles bidirectionnels (U+202A–U+202E, U+2066–U+2069) retirés des deux côtés', () => {
    assert.equal(personSays(`${RLO}moc.live${PDF} ok`), 'moc[.]live ok');
    assert.equal(agentSays(`Texte ${LRI}inversé${PDI} ${RLO}moc.live${PDF}`), 'Texte inversé [lien retiré]');
    for (let c = 0x202a; c <= 0x202e; c++) assert.equal(personSays(`a${String.fromCharCode(c)}b`), 'ab');
    for (let c = 0x2066; c <= 0x2069; c++) assert.equal(agentSays(`a${String.fromCharCode(c)}b`), 'ab');
  });

  await test('caractères invisibles (espace sans chasse, trait d’union conditionnel…) retirés, émojis composés intacts', () => {
    const [SHY, ZWSP, ZWNJ, ZWJ, WJ, BOM] = [0xad, 0x200b, 0x200c, 0x200d, 0x2060, 0xfeff].map((c) => String.fromCharCode(c));
    // Domaine caché par un caractère invisible : retiré chez l’agent, désactivé chez la personne.
    assert.equal(agentSays(`Voir evil${ZWSP}.com`), 'Voir [lien retiré]');
    assert.equal(agentSays(`Voir ev${SHY}il.c${WJ}om, e${ZWNJ}vil${ZWJ}.com ou ${BOM}evil.com`), 'Voir [lien retiré], [lien retiré] ou [lien retiré]');
    assert.equal(personSays(`evil${ZWSP}.com`), 'evil[.]com');
    for (const c of [SHY, ZWSP, ZWNJ, ZWJ, WJ, BOM]) assert.equal(personSays(`a${c}b`), 'ab');
    // Liant sans chasse devant un pictogramme : il compose l’émoji (famille, drapeau arc-en-ciel, cœur en feu,
    // informaticienne, coureuse, bisou) ; rien n’est retiré.
    const emojis = [[0x1f468, 0x200d, 0x1f469, 0x200d, 0x1f467], [0x1f3f3, 0xfe0f, 0x200d, 0x1f308], [0x2764, 0xfe0f, 0x200d, 0x1f525],
      [0x1f9d1, 0x200d, 0x1f4bb], [0x1f3c3, 0x200d, 0x2640, 0xfe0f], [0x1f469, 0x200d, 0x2764, 0xfe0f, 0x200d, 0x1f48b, 0x200d, 0x1f468]]
      .map((cps) => String.fromCodePoint(...cps));
    const text = `Merci ${emojis.join(' ')} !`;
    assert.equal(agentSays(text), text);
    assert.equal(personSays(text), text);
  });

  await test('liens : domaine repéré après une étiquette trop longue, un port, un tiret ; adresse à longue partie locale', () => {
    assert.equal(agentSays(`${'x'.repeat(70)}.evil.com`), `${'x'.repeat(70)}.[lien retiré]`);
    assert.equal(agentSays('a.com:80.evil.com et ab-.evil.com'), '[lien retiré].[lien retiré] et ab-.[lien retiré]');
    assert.equal(agentSays('1.2.3.4.evil.com, version 1.2.3'), '[lien retiré], version 1.2.3');
    assert.equal(personSays(`${'a.'.repeat(300)}com`), `${'a[.]'.repeat(300)}com`);
    // Partie locale de plus de 64 caractères (hors norme) : le domaine est tout de même retiré ou désactivé.
    assert.equal(agentSays(`${'x'.repeat(70)}@evil.com`), `${'x'.repeat(70)}@[lien retiré]`);
    assert.equal(personSays(`${'x'.repeat(70)}@gmail.com`), `${'x'.repeat(70)}@gmail[.]com`);
  });

  await test('traitement des liens borné : message hostile de 8 000 caractères traité vite', () => {
    const t0 = Date.now();
    for (const text of ['a.'.repeat(4000), 'a-'.repeat(4000), `${'x'.repeat(60)}.`.repeat(130), `${'a'.repeat(7990)}@b`]) {
      personSays(text);
      agentSays(text);
    }
    assert.ok(Date.now() - t0 < 2000, `${Date.now() - t0} ms`);
  });

  await test('expressions régulières en temps borné : entrées pathologiques, moins de 200 ms chacune', () => {
    const [HE, CYR, IDEO, ZWJ] = [0x5d0, 0x430, 0x3002, 0x200d].map((c) => String.fromCharCode(c));
    const hostile: Record<string, string> = {
      // Étiquettes de chiffres (deux lectures possibles avant correction : temps exponentiel).
      'chiffres 1.': '1.'.repeat(4000),
      'chiffres 12.': '12.'.repeat(2600),
      'adresse + chiffres': `a@${'1.'.repeat(3990)}`,
      // Longues suites d’étiquettes sans extension (texte sur deux octets : hébreu, point idéographique).
      'hébreu': `${HE}.`.repeat(4000),
      'chiffres + hébreu': `1${HE}.`.repeat(2600),
      'point idéographique': `1${IDEO}`.repeat(4000),
      'après « : »': `x:${'1.'.repeat(3999)}`,
      'ports en chaîne': 'a.com:80.'.repeat(888),
      'latin + hébreu final': `${'a.'.repeat(3999)}${HE}`,
      // Partie locale : tirets, longue suite sans « @ ».
      'tirets cyrilliques': `${CYR}-`.repeat(4000),
      'tirets + hébreu': `${'a-'.repeat(3999)}${HE}`,
      'partie locale': `${'a'.repeat(7990)}@b`,
      'points puis @': `${'.'.repeat(7990)}@b`,
      // Ponctuation finale (TRAILING) : longue suite qui ne finit pas le lien.
      'ponctuation dans un lien': `https://x${'!'.repeat(7980)}a`,
      'points dans un chemin': `a.com/${'.'.repeat(7980)}x`,
      // Protocole, extension, port, liant sans chasse.
      'faux protocoles': 'abcdefghijklmnopqrstuvwxyz0123:/'.repeat(250),
      'extension trop longue': `a.${'b'.repeat(7990)}1`,
      'xn--': `a.xn--${'-'.repeat(7990)}`,
      'port trop long': `a.com:${'1'.repeat(7990)}`,
      'liants': `a${ZWJ}`.repeat(4000),
    };
    for (const [name, text] of Object.entries(hostile)) {
      const t0 = performance.now();
      agentSays(text);
      personSays(text);
      const ms = performance.now() - t0;
      assert.ok(ms < 200, `${name} : ${ms.toFixed(0)} ms`);
    }
    // Masquage des adresses (longue suite sans « @ ») et détection de langue.
    for (const [name, run] of Object.entries({
      'masquage sans @': () => maskEmails('a'.repeat(100_000)),
      'masquage @ répétés': () => maskEmails('a@'.repeat(50_000)),
      'langue': () => copy.guessLang(`${'a '.repeat(50_000)}${'ąć'.repeat(1000)}`),
      'retours chariot': () => extractTurns([{ role: 'user', content: `${'\r'.repeat(100_000)}x` }]),
    })) {
      const t0 = performance.now();
      run();
      const ms = performance.now() - t0;
      assert.ok(ms < 200, `${name} : ${ms.toFixed(0)} ms`);
    }
  });

  const MARKERS: Record<string, string> = { fr: '[lien retiré]', 'en-gb': '[link removed]', it: '[link rimosso]', pl: '[link usunięty]', nl: '[link verwijderd]', he: '[הקישור הוסר]' };
  const NOT_YOU: Record<string, string> = {
    fr: 'Vous recevez cet email parce que cette adresse a été donnée pendant l’échange. Si vous n’êtes pas à l’origine de cette demande, ignorez-le.',
    'en-gb': 'You are receiving this email because this address was given during the conversation. If you did not ask for it, please ignore it.',
    it: 'Riceve questa email perché questo indirizzo è stato indicato durante la conversazione. Se non l’ha richiesta, la ignori.',
    pl: 'Otrzymują Państwo tę wiadomość, ponieważ ten adres został podany podczas rozmowy. Jeśli to nie Państwo o nią prosili, prosimy ją zignorować.',
    nl: 'U ontvangt deze e-mail omdat dit adres tijdens het gesprek is opgegeven. Heeft u hier niet om gevraagd? Dan kunt u deze e-mail negeren.',
    he: 'קיבלתם הודעה זו כי כתובת זו נמסרה במהלך השיחה. אם לא ביקשתם אותה, אפשר להתעלם ממנה.',
  };
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  await test('6 langues : mention « lien retiré » traduite, mention « pas vous ? » après la transcription (texte et HTML)', () => {
    for (const locale of Object.keys(MARKERS) as Array<'fr' | 'en-gb' | 'it' | 'pl' | 'nl' | 'he'>) {
      const turns = [
        { from: 'agent' as const, text: 'Infos : https://evil.example/promo et https://permanenceia.com/' },
        { from: 'person' as const, text: `Mon site : example.com ${RLO}x${PDF}` },
        { from: 'agent' as const, text: 'Dernier message.' },
      ];
      const m = buildCopyMail({ to: 'x@example.com', ctx: { locale, agent: 'Jade', gender: 'female', source: 'agent' }, turns, at: new Date(T0) });
      for (const s of [m.text, m.html!]) {
        assert.ok(s.includes(`Infos : ${MARKERS[locale]} et https://permanenceia.com/`), `${locale} : mention`);
        assert.ok(!s.includes('evil.example') && s.includes('example[.]com') && !s.includes(RLO) && !s.includes(PDF), `${locale} : liens`);
      }
      // Après le dernier message (et en dernier dans le texte, le pied de page étant ajouté par sendMail).
      assert.ok(m.text.endsWith(`\n\n${NOT_YOU[locale]}`), `${locale} : texte`);
      assert.ok(m.text.indexOf(NOT_YOU[locale]) > m.text.indexOf('Dernier message.'));
      const iNote = m.html!.indexOf(`>${esc(NOT_YOU[locale])}</p>`);
      assert.ok(iNote > m.html!.indexOf('Dernier message.'), `${locale} : HTML`);
      assert.ok(m.html!.endsWith(`${esc(NOT_YOU[locale])}</p></div>`));
      // Aucun lien créé par la copie (les seuls liens du message sont ceux du pied de page).
      assert.ok(!/<a[\s>]|href=/i.test(m.html!), `${locale} : aucun lien`);
    }
    // Échappement HTML de la mention (apostrophe droite éventuelle).
    const m = buildCopyMail({ to: 'x@example.com', ctx: { locale: 'fr', agent: null, gender: 'female', source: 'default' }, turns: [{ from: 'person', text: 'a' }], at: new Date(T0) });
    assert.ok(m.html!.includes(esc(NOT_YOU.fr)));
  });

  await test('webhook : liens retirés ou désactivés dans l’email envoyé, aucun lien ajouté', async () => {
    await webhook(conversation({ aid: A.jade, copy: 'links@example.com', transcript: chat(
      ['assistant', `Bonjour ! Cliquez ici : https://evil.example/paiement ${RLO}moc.live${PDF} ou sur https://permanenceia.com/tarifs.`],
      ['user', 'Mon site est mon-entreprise.fr, voyez https://evil.example/x'],
    ) }));
    const [{ m, message }] = sentTo('links@example.com');
    for (const s of [m.text, m.html!]) {
      assert.ok(s.includes('Bonjour ! Cliquez ici : [lien retiré] [lien retiré] ou sur https://permanenceia.com/tarifs.'));
      assert.ok(s.includes('Mon site est mon-entreprise[.]fr, voyez hxxps://evil[.]example/x'));
      assert.ok(!/evil\.example|moc\.live/.test(s));
    }
    assert.ok(!/<a[\s>]|href=/i.test(m.html!));
    assert.ok(!/evil\.example/.test(message.html) && !/evil\.example/.test(message.text), 'message préparé (pied de page compris)');
  });

  /* ---------- Opposition reçue pendant l’échange ---------- */

  await test('opposition entre deux passages WhatsApp : aucune copie au passage suivant', async () => {
    const id = randomUUID();
    const phone = '+33655443322';
    const base = { id, aid: A.whatsapp, type: 'whatsapp', phone, created: new Date(clock - 60_000).toISOString() };
    // 1er passage : désinscription demandée, pas de copy_email : l’opposition est enregistrée.
    await webhook(conversation({ ...base, outcome: 'desinscription', transcript: chat(['assistant', 'Bonjour'], ['user', 'STOP, ne m’écrivez plus']) }));
    assert.ok(rowsOf('call_events').some((r) => r.kind === 'optout' && r.customer_phone === phone));
    // 2e passage : l’issue a changé et une copie est demandée : rien ne part.
    const r = await webhook(conversation({ ...base, outcome: 'information', copy: 'between@example.com',
      transcript: chat(['assistant', 'Bonjour'], ['user', 'STOP, ne m’écrivez plus'], ['assistant', 'C’est noté.'], ['user', 'Envoyez-moi quand même la copie, merci']) }));
    assert.equal(r.status, 200);
    assert.equal(sentTo('between@example.com').length, 0);
    assert.equal(copyRows(`copy-conversation-${id}`).length, 0, 'aucune réservation');
    assert.ok(logs.some((l) => l.includes('opposition enregistrée pendant l’échange : aucune copie')));
  });

  await test('numéro déjà opposé qui redit STOP pendant l’échange : nouvelle ligne d’opposition, aucune copie', async () => {
    const id = randomUUID();
    const phone = '+33655443324';
    const optouts = () => rowsOf('call_events').filter((r) => r.kind === 'optout' && r.customer_phone === phone);
    // Opposition reçue il y a 30 jours (avant l’échange).
    rowsOf('call_events').push({ id: randomUUID(), kind: 'optout', outcome: 'ne_plus_appeler', customer_phone: phone, created_at: new Date(clock - 30 * 86_400_000).toISOString() });
    const base = { id, aid: A.whatsapp, type: 'whatsapp', phone, created: new Date(clock - 60_000).toISOString() };
    // 1er passage : la personne redit STOP : une ligne de plus, datée de l’échange.
    await webhook(conversation({ ...base, outcome: 'desinscription', transcript: chat(['assistant', 'Bonjour'], ['user', 'STOP']) }));
    assert.equal(optouts().length, 2, 'une ligne par opposition reçue');
    // 2e passage : copie demandée : rien ne part.
    const r = await webhook(conversation({ ...base, outcome: 'information', copy: 'again@example.com',
      transcript: chat(['assistant', 'Bonjour'], ['user', 'STOP'], ['assistant', 'C’est noté.'], ['user', 'Envoyez-moi quand même la copie, merci']) }));
    assert.equal(r.status, 200);
    assert.equal(sentTo('again@example.com').length, 0);
    assert.equal(copyRows(`copy-conversation-${id}`).length, 0, 'aucune réservation');
  });

  await test('opposition par l’outil pendant un appel : aucune copie ; opposition antérieure à l’échange : copie envoyée', async () => {
    const optout = (phone: string, at: number) => rowsOf('call_events').push({ id: randomUUID(), kind: 'optout', outcome: 'ne_plus_appeler', customer_phone: phone, created_at: new Date(at).toISOString() });
    const call = (phone: string, to: string, start?: number) => ({
      id: randomUUID(), type: 'inbound', assistant_id: A.hugo, customer_phone: phone, status: 'completed',
      extracted_variables: { copy_email: to, outcome: 'information' },
      transcript: [{ type: 'transcript', text: 'Bonjour, ici Hugo.', sender: 'bot' }, { type: 'transcript', text: 'Envoyez-moi la copie.', sender: 'human' }],
      ...(start === undefined ? {} : { created_at: new Date(start).toISOString() }),
    });
    // Pendant l’échange (outil d’opposition) : bloquée.
    optout('+33644332211', clock++);
    const during = await sendConversationCopy(call('+33644332211', 'during@example.com', clock - 120_000), { kind: 'call', externalId: randomUUID() }, deps);
    assert.deepEqual(during, { sent: false, reason: 'opposition enregistrée pendant l’échange : aucune copie' });
    // Opposition d’il y a 30 jours, copie demandée explicitement aujourd’hui : envoyée.
    optout('+33644332212', clock - 30 * 86_400_000);
    const before = await sendConversationCopy(call('+33644332212', 'before@example.com', clock - 60_000), { kind: 'call', externalId: randomUUID() }, deps);
    assert.equal(before?.sent, true);
    assert.equal(sentTo('before@example.com').length, 1);
    // Début absent du webhook : 24 dernières heures.
    optout('+33644332213', clock - 2 * 3_600_000);
    assert.equal((await sendConversationCopy(call('+33644332213', 'nostart@example.com'), { kind: 'call', externalId: randomUUID() }, deps))?.sent, false);
    optout('+33644332214', clock - 3 * 86_400_000);
    assert.equal((await sendConversationCopy(call('+33644332214', 'nostart-old@example.com'), { kind: 'call', externalId: randomUUID() }, deps))?.sent, true);
    // Sans numéro (widget du site) : registre non consulté.
    const reqs = requests.length;
    await sendConversationCopy(conversation({ aid: A.jade, copy: 'nophone@example.com', transcript: FR_CHAT }), { kind: 'conversation', externalId: randomUUID() }, deps);
    assert.ok(!requests.slice(reqs).some((q) => q.includes('kind=eq.optout')));
    assert.equal(sentTo('nophone@example.com').length, 1);
  });

  /* ---------- Erreur SMTP ---------- */

  await test('adresses masquées dans une erreur d’envoi', () => {
    assert.equal(maskEmails('550 <a.b+c@d.example.com>: rejected; from x@y (relay)'), '550 <[adresse]>: rejected; from [adresse] (relay)');
    assert.equal(maskEmails('SMTP Zoho non configuré'), 'SMTP Zoho non configuré');
  });

  /* ---------- Plafonds et webhooks simultanés ---------- */

  // Bloque chaque réservation jusqu’à ce que les n envois l’aient atteinte : tous ont passé les comptes préalables
  // avant la première réservation (pire cas de webhooks simultanés).
  const raceDeps = (n: number) => {
    let waiting = 0;
    let open!: () => void;
    const gate = new Promise<void>((r) => { open = r; });
    return { ...deps, insert: async (table: string, row: Record<string, unknown>, returnId?: boolean) => {
      if (++waiting === n) open();
      await gate;
      return deps.insert(table, row, returnId);
    } };
  };

  await test(`plafond par adresse avec ${MAX_PER_ADDRESS_PER_DAY + 3} webhooks simultanés : ${MAX_PER_ADDRESS_PER_DAY} copies, les autres « plafond »`, async () => {
    const n = MAX_PER_ADDRESS_PER_DAY + 3;
    const race = raceDeps(n);
    const ids = Array.from({ length: n }, () => randomUUID());
    const results = await Promise.all(ids.map((id) => sendConversationCopy(conversation({ id, aid: A.jade, copy: 'cap-race@example.com', transcript: FR_CHAT }), { kind: 'conversation', externalId: id }, race)));
    assert.equal(sentTo('cap-race@example.com').length, MAX_PER_ADDRESS_PER_DAY);
    assert.equal(results.filter((r) => r?.sent).length, MAX_PER_ADDRESS_PER_DAY);
    const refused = results.filter((r) => !r?.sent);
    assert.equal(refused.length, 3);
    for (const r of refused) assert.deepEqual([r?.limit, r?.alert, /plafond atteint/.test(r!.reason)], ['adresse', true, true]);
    // Refusées après réservation : trace « plafond » (ne compte plus), les envoyées sont les plus anciennes.
    const rows = ids.map((id) => copyRows(`copy-conversation-${id}`)[0]);
    assert.deepEqual(rows.map((r) => r.status), [...Array(MAX_PER_ADDRESS_PER_DAY).fill('envoyee'), 'plafond', 'plafond', 'plafond']);
    assert.match(rows[n - 1].summary, /plafond de 5 copies en 24 h vers cette adresse/);
    // Plafond toujours atteint : refus avant toute réservation.
    const id = randomUUID();
    const again = await sendConversationCopy(conversation({ id, aid: A.jade, copy: 'cap-race@example.com', transcript: FR_CHAT }), { kind: 'conversation', externalId: id }, deps);
    assert.equal(again?.limit, 'adresse');
    assert.equal(copyRows(`copy-conversation-${id}`).length, 0);
  });

  await test(`plafond pour tout le site (${MAX_COPIES_PER_DAY} en 24 h), webhooks simultanés compris, alerte à part`, async () => {
    const since = new Date(Date.now() - 86_400_000).toISOString();
    const live = () => rowsOf('call_events').filter((r) => r.kind === 'email' && r.outcome === 'copie_conversation' && ['en_cours', 'envoyee'].includes(r.status) && r.created_at >= since).length;
    // Copies déjà envoyées par d’autres adresses : il n’en reste que 2 avant le plafond.
    const filler = Array.from({ length: MAX_COPIES_PER_DAY - live() - 2 }, (_, i) => ({
      id: randomUUID(), created_at: new Date(clock++).toISOString(), kind: 'email', outcome: 'copie_conversation', status: 'envoyee',
      external_id: `copy-conversation-filler-${i}`, variables: { to_key: `filler-${i}` },
    }));
    rowsOf('call_events').push(...filler);
    try {
      assert.equal(live(), MAX_COPIES_PER_DAY - 2);
      const race = raceDeps(5);
      const ids = Array.from({ length: 5 }, () => randomUUID());
      const results = await Promise.all(ids.map((id, i) => sendConversationCopy(conversation({ id, aid: A.jade, copy: `global-${i}@example.com`, transcript: FR_CHAT }), { kind: 'conversation', externalId: id }, race)));
      assert.equal(results.filter((r) => r?.sent).length, 2);
      assert.equal(sent.filter((s) => s.m.to.startsWith('global-')).length, 2);
      const refused = results.filter((r) => !r?.sent);
      for (const r of refused) assert.deepEqual([r?.limit, r?.alert, /plafond quotidien atteint \(100 copies en 24 h pour tout le site\)/.test(r!.reason)], ['global', true, true]);
      assert.deepEqual(ids.map((id) => copyRows(`copy-conversation-${id}`)[0].status), ['envoyee', 'envoyee', 'plafond', 'plafond', 'plafond']);
      assert.equal(live(), MAX_COPIES_PER_DAY);
      // Plafond atteint : refus avant réservation, rien n’est écrit.
      const id = randomUUID();
      const again = await sendConversationCopy(conversation({ id, aid: A.jade, copy: 'global-late@example.com', transcript: FR_CHAT }), { kind: 'conversation', externalId: id }, deps);
      assert.equal(again?.limit, 'global');
      assert.equal(copyRows(`copy-conversation-${id}`).length, 0);
      // Par le webhook : réponse 200, rien n’est envoyé, alerte « plafond » envoyée même si l’alerte « copie non
      // envoyée » a déjà servi dans l’heure (SMTP absent : la tentative d’alerte est journalisée).
      const alerts = () => logs.filter((l) => l.startsWith('[alerte] email:')).length;
      const before = alerts();
      assert.equal((await webhook(conversation({ aid: A.jade, copy: 'global-hook@example.com', transcript: FR_CHAT }))).status, 200);
      assert.equal(sentTo('global-hook@example.com').length, 0);
      assert.ok(logs.some((l) => l.includes('plafond quotidien atteint')));
      assert.equal(alerts(), before + 1, 'alerte du plafond global tentée');
      // Une alerte par heure au plus.
      await webhook(conversation({ aid: A.jade, copy: 'global-hook2@example.com', transcript: FR_CHAT }));
      assert.equal(alerts(), before + 1);
    } finally {
      for (const r of filler) r.status = 'test_retire';
    }
    assert.equal(live(), 2 + (MAX_COPIES_PER_DAY - 2 - filler.length));
  });

  copyDeps.sendMail = realSendMail;
  console.log(`\n${passed} tests réussis (${sent.length} emails simulés, aucun envoyé)`);
}

main().catch((e) => { console.error(e); process.exit(1); });

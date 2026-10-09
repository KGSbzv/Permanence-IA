// Voix logique des rappels : qui rappelle après une demande prise par un agent Autocalls.
// Règle du propriétaire, identique dans les 7 langues :
//   - « rappelez-moi » → la même persona rappelle (même prénom, même voix) ;
//   - « un responsable, quelqu’un d’autre, un humain » → l’autre persona (autre genre, autre voix, autre prénom),
//     présentée comme l’assistant(e) IA responsable du suivi des demandes, toujours annoncée comme une IA ;
//   - le responsable IA à qui l’on redemande un responsable ou un humain → aucun nouvel appel IA, l’équipe
//     reçoit « À rappeler à la main » ;
//   - « encore » (appel manqué, nouvel horaire, « la personne qui m’a appelé ») → persona et rôle de la dernière
//     demande en file.
// Aucun accès réseau ici : tables et fonctions pures, testées par scripts/test-callback-voice.ts. La route
// /api/callback lit la dernière demande en base puis appelle decideCallback().
//
// Contrat avec les outils Autocalls : `callback_by` (paramètre rempli par l’IA) et `aid` (identifiant de l’agent,
// substitué par Autocalls dans l’adresse de l’outil : ?aid={{assistant_id}}). Sans l’un ni l’autre, rien ne change :
// voix statique de l’outil (`voice=male`), corps envoyé à la campagne identique à avant.
import { VOICES, type Gender } from '@/data/personas';
import { isLocale, type Locale } from '@/i18n/locales';

export type Kind = 'commercial' | 'support';
/** Valeur du paramètre callback_by : même persona, persona de la dernière demande, responsable, humain. */
export type CallbackBy = 'same' | 'again' | 'manager' | 'human';
/** Rôle de celui qui rappelle : même persona, responsable IA du suivi, personne de l’équipe (aucun appel IA). */
export type Role = 'same' | 'manager' | 'human';

/** Persona féminine du support et des canaux écrits (WhatsApp, Messenger, espace client), par langue. */
export const SUPPORT_FEMALE: Record<Locale, string> = { fr: 'Lucie', 'en-gb': 'Katie', 'en-au': 'Charlotte', it: 'Manuela', pl: 'Lena', nl: 'Emma', he: 'נועה' };

/** Orthographe latine des prénoms hébreux (agent d’une autre langue, e-mail à l’équipe). */
const LATIN: Record<string, string> = { 'נועה': 'Noa', 'דניאל': 'Daniel' };
export const latinName = (name: string) => LATIN[name] ?? name;

/** Agent Autocalls de rappel sortant (campagne de sa langue, de son type et de sa voix). */
export interface CallbackPersona { id: number; uuid: string; voice: number; name: string; latin: string }
const cp = (id: number, uuid: string, voice: number, name: string): CallbackPersona => ({ id, uuid, voice, name, latin: latinName(name) });

/**
 * Agent qui rappelle, par langue de campagne × type × genre de voix. Support masculin : null tant que les
 * 7 agents (Hugo, James, Jack, Marco, Tomasz, Daan, Daniel), leurs campagnes et la branche « voice » des
 * automatisations support ne sont pas créés (étape 3 de docs/rappels-voix.md) : une demande qui y mène n’est
 * pas mise en file, l’équipe reçoit « À rappeler à la main ».
 */
export const CALLBACK_AGENTS: Record<Locale, Record<Kind, Record<Gender, CallbackPersona | null>>> = {
  fr: {
    commercial: { female: cp(21182, '2935e8d4-cdb4-4dc6-9c01-eff2f1f7718c', 2501, 'Jade'), male: cp(21270, '19caa63b-cc05-4f40-a6b0-9cc9de9102b1', 703, 'Hugo') },
    support: { female: cp(21183, 'a6f04fed-79d8-41d4-9f8a-870e6e14454c', 1271, 'Lucie'), male: null },
  },
  'en-gb': {
    commercial: { female: cp(21231, '9c3c93cf-8fb6-4c1d-8c65-7f5ae13f4c8a', 2776, 'Katie'), male: cp(21272, '43aad653-2679-4e95-8ca0-ca2203c08c23', 2781, 'James') },
    support: { female: cp(21236, '705dbd3d-a256-4185-9fe1-d966325a4531', 2776, 'Katie'), male: null },
  },
  'en-au': {
    commercial: { female: cp(21232, '4d473a14-d2c6-4e41-8288-9822e8631938', 3207, 'Charlotte'), male: cp(21274, '2a7ecf7b-cf1e-4255-85b3-186e1e54b7e4', 824, 'Jack') },
    support: { female: cp(21237, 'ebc02f87-82f5-490a-a0f8-c410f91b39cc', 3207, 'Charlotte'), male: null },
  },
  it: {
    commercial: { female: cp(21233, 'b0a20817-2561-4248-9b1c-86f708c7958f', 552, 'Manuela'), male: cp(21276, '4e757a3d-767d-476e-9e10-0d1fe6075285', 97, 'Marco') },
    support: { female: cp(21238, '794050e7-4da1-44fe-a0a0-d91133f97a5d', 552, 'Manuela'), male: null },
  },
  pl: {
    commercial: { female: cp(21234, '9a26c610-9db5-4aff-9962-5a21e189ac6f', 155, 'Lena'), male: cp(21278, 'b97bf77e-ec93-4eeb-91c6-9f22eec8a9ff', 154, 'Tomasz') },
    support: { female: cp(21239, '64fc408d-d01a-4047-8d0b-33e588660ce9', 155, 'Lena'), male: null },
  },
  nl: {
    commercial: { female: cp(21235, '7f35c689-cc6e-4054-a100-4d968bdc007c', 1052, 'Emma'), male: cp(21280, 'c5a0eaab-dc06-4161-beb2-bc74c9500da4', 2703, 'Daan') },
    support: { female: cp(21240, 'be701e1d-3197-4121-8ed3-e891830da51f', 1052, 'Emma'), male: null },
  },
  he: {
    commercial: { female: cp(21308, 'fa2eea58-e492-4cf5-a01c-2d2165e41655', 3427, 'נועה'), male: cp(21309, '8dd784c4-f9f5-4d57-96a9-ff4c41d6d0e3', 3430, 'דניאל') },
    support: { female: cp(21310, 'c5a410a7-33be-4894-95bf-cd604655a7a9', 3427, 'נועה'), male: null },
  },
};

const asLoc = (l: string): Locale => (isLocale(l) ? l : 'fr');

/**
 * Prénom de la persona qui rappelle (e-mail à l’équipe, réponse à l’agent, {{2}} du modèle WhatsApp
 * pia_callback_confirmed). Support masculin pas encore créé : prénom prévu (celui de la voix masculine du marché).
 */
/** Voix qui appellera vraiment : sans persona de ce genre (support masculin pas encore créé), la voix féminine. */
export const availableGender = (lang: string, kind: Kind, gender: Gender): Gender => (CALLBACK_AGENTS[asLoc(lang)][kind][gender] ? gender : 'female');

export function callbackName(lang: string, kind: Kind, gender: Gender) {
  const l = asLoc(lang);
  return CALLBACK_AGENTS[l][kind][gender]?.name ?? (kind === 'support' && gender === 'female' ? SUPPORT_FEMALE[l] : VOICES[l][gender].name);
}

/** Canal de l’agent qui prend la demande : ligne entrante, widget (voix), écrit (sans voix), rappel sortant. */
export type Channel = 'inbound' | 'widget' | 'text' | 'callback';
/** Agent qui peut enregistrer une demande de rappel. `name` absent : prénom selon la langue (SUPPORT_FEMALE). */
export interface Requester { id: number; uuid: string; lang: Locale | 'multi'; gender: Gender; voice: number | null; channel: Channel; name?: string }
const rq = (id: number, uuid: string, lang: Locale | 'multi', gender: Gender, voice: number | null, channel: Channel, name?: string): Requester =>
  ({ id, uuid, lang, gender, voice, channel, ...(name ? { name } : {}) });

/** Les agents qui prennent des demandes (UUID relus avec get-assistant). Ajouter ici les 7 agents support masculins. */
export const REQUESTERS: Requester[] = [
  // Hébreu
  rq(21314, '78f36e5d-1c24-45c5-ac69-fb20b641b02e', 'he', 'female', 3427, 'inbound', 'נועה'),
  rq(21306, 'd8bde5e6-bb6d-435c-8934-3c1131c964e9', 'he', 'female', 3427, 'widget', 'נועה'),
  rq(21307, '16cef988-872b-4b6b-820a-9ba7647930f6', 'he', 'male', 3430, 'widget', 'דניאל'),
  rq(21308, 'fa2eea58-e492-4cf5-a01c-2d2165e41655', 'he', 'female', 3427, 'callback', 'נועה'),
  rq(21309, '8dd784c4-f9f5-4d57-96a9-ff4c41d6d0e3', 'he', 'male', 3430, 'callback', 'דניאל'),
  rq(21310, 'c5a410a7-33be-4894-95bf-cd604655a7a9', 'he', 'female', 3427, 'callback', 'נועה'),
  // Anglais britannique
  rq(21376, '6b50ad79-6c28-4950-afc2-e1fafd152def', 'en-gb', 'female', 2776, 'inbound', 'Katie'),
  rq(21206, '57ba145e-b9d7-47cb-8bd3-6053a861951b', 'en-gb', 'female', 2776, 'widget', 'Katie'),
  rq(21271, '488b70e7-6d6f-456e-b1fe-bf6bdfcebbb0', 'en-gb', 'male', 2781, 'widget', 'James'),
  rq(21231, '9c3c93cf-8fb6-4c1d-8c65-7f5ae13f4c8a', 'en-gb', 'female', 2776, 'callback', 'Katie'),
  rq(21272, '43aad653-2679-4e95-8ca0-ca2203c08c23', 'en-gb', 'male', 2781, 'callback', 'James'),
  rq(21236, '705dbd3d-a256-4185-9fe1-d966325a4531', 'en-gb', 'female', 2776, 'callback', 'Katie'),
  // Anglais australien
  rq(21207, '59664acf-7aa5-4e6d-a2c8-d7f8fb558637', 'en-au', 'female', 3207, 'widget', 'Charlotte'),
  rq(21273, 'd8cfdb1b-a4e5-4769-94b5-cf61c34d74f6', 'en-au', 'male', 824, 'widget', 'Jack'),
  rq(21232, '4d473a14-d2c6-4e41-8288-9822e8631938', 'en-au', 'female', 3207, 'callback', 'Charlotte'),
  rq(21274, '2a7ecf7b-cf1e-4255-85b3-186e1e54b7e4', 'en-au', 'male', 824, 'callback', 'Jack'),
  rq(21237, 'ebc02f87-82f5-490a-a0f8-c410f91b39cc', 'en-au', 'female', 3207, 'callback', 'Charlotte'),
  // Italien
  rq(21208, 'eb44bd48-491c-47c1-9c21-016f45678728', 'it', 'female', 552, 'widget', 'Manuela'),
  rq(21275, 'd96c1ace-1564-4fdf-9360-c8753103d774', 'it', 'male', 97, 'widget', 'Marco'),
  rq(21233, 'b0a20817-2561-4248-9b1c-86f708c7958f', 'it', 'female', 552, 'callback', 'Manuela'),
  rq(21276, '4e757a3d-767d-476e-9e10-0d1fe6075285', 'it', 'male', 97, 'callback', 'Marco'),
  rq(21238, '794050e7-4da1-44fe-a0a0-d91133f97a5d', 'it', 'female', 552, 'callback', 'Manuela'),
  // Polonais
  rq(21209, '83d46ff1-caac-4132-afa3-e03e3f1d4b0b', 'pl', 'female', 155, 'widget', 'Lena'),
  rq(21277, '9dd87407-08f2-4669-ad32-bdf358543b8c', 'pl', 'male', 154, 'widget', 'Tomasz'),
  rq(21234, '9a26c610-9db5-4aff-9962-5a21e189ac6f', 'pl', 'female', 155, 'callback', 'Lena'),
  rq(21278, 'b97bf77e-ec93-4eeb-91c6-9f22eec8a9ff', 'pl', 'male', 154, 'callback', 'Tomasz'),
  rq(21239, '64fc408d-d01a-4047-8d0b-33e588660ce9', 'pl', 'female', 155, 'callback', 'Lena'),
  // Néerlandais
  rq(21210, '8fec85f2-1c9e-4af7-b48e-1925a1f34764', 'nl', 'female', 1052, 'widget', 'Emma'),
  rq(21279, 'edbb8a6e-1fe0-4083-ad5f-5790eead8eef', 'nl', 'male', 2703, 'widget', 'Daan'),
  rq(21235, '7f35c689-cc6e-4054-a100-4d968bdc007c', 'nl', 'female', 1052, 'callback', 'Emma'),
  rq(21280, 'c5a0eaab-dc06-4161-beb2-bc74c9500da4', 'nl', 'male', 2703, 'callback', 'Daan'),
  rq(21240, 'be701e1d-3197-4121-8ed3-e891830da51f', 'nl', 'female', 1052, 'callback', 'Emma'),
  // Français
  rq(21203, '2841fa2d-1fed-4fbc-b832-28b954d049a6', 'fr', 'female', 2501, 'widget', 'Jade'),
  rq(21269, 'b73b6d6a-da0e-46ee-951d-0e070f252280', 'fr', 'male', 703, 'widget', 'Hugo'),
  rq(21182, '2935e8d4-cdb4-4dc6-9c01-eff2f1f7718c', 'fr', 'female', 2501, 'callback', 'Jade'),
  rq(21270, '19caa63b-cc05-4f40-a6b0-9cc9de9102b1', 'fr', 'male', 703, 'callback', 'Hugo'),
  rq(21183, 'a6f04fed-79d8-41d4-9f8a-870e6e14454c', 'fr', 'female', 1271, 'callback', 'Lucie'),
  // Multilingues, persona féminine selon la langue : WhatsApp et Messenger (écrits, sans voix) ; espace client
  // (widget écrit ou vocal, voix française de Lucie 1271 dans toutes les langues : même voix qu’au rappel
  // seulement en français).
  rq(21358, '798c2ab1-b454-40fb-b16c-711fc68eff50', 'multi', 'female', null, 'text'),
  rq(21297, '82ac010f-29e0-4953-b409-74466042391b', 'multi', 'female', null, 'text'),
  rq(21205, 'c08ae64a-d170-4b9c-ab7a-a7c2221fb389', 'multi', 'female', 1271, 'widget'),
];

/**
 * Agent identifié par `aid` (identifiant numérique ou UUID, selon ce qu’Autocalls substitue à {{assistant_id}}).
 * Variable non substituée (accolades), vide ou inconnue → undefined (repli sur la voix statique de l’outil).
 */
export function findRequester(aid: unknown): Requester | undefined {
  const s = String((Array.isArray(aid) ? aid[0] : aid) ?? '').trim().toLowerCase();
  if (!s || /[{}]/.test(s)) return undefined;
  return REQUESTERS.find((r) => String(r.id) === s || r.uuid === s);
}

/** Prénom de l’agent dans la langue de la campagne (prénom hébreu en hébreu, orthographe latine ailleurs). */
export function requesterName(r: Requester, lang: string) {
  const l = asLoc(lang);
  const base = r.name ?? SUPPORT_FEMALE[l];
  return l === 'he' ? base : latinName(base);
}

/** callback_by reçu de l’outil ; vide, inconnu ou « je ne sais pas » → undefined (comportement d’avant). */
export function parseCallbackBy(v: unknown): CallbackBy | undefined {
  const s = String(v ?? '').trim().toLowerCase().replace(/[\s-]+/g, '_');
  if (/^(same|self|me|moi|meme|même)$/.test(s)) return 'same';
  if (/^(again|previous|last|same_as_last|precedent|précédent)$/.test(s)) return 'again';
  if (/^(manager|responsable|supervisor|superieur|supérieur|someone_else|other|autre)$/.test(s)) return 'manager';
  if (/^(human|humain|person|personne|team|equipe|équipe)$/.test(s)) return 'human';
  return undefined;
}

/** Dernière demande en file (même numéro, même type) : rôle, voix et prénom de l’agent qui l’a prise. */
export interface Prev { role?: 'same' | 'manager'; voice?: Gender; asked?: string; due: boolean; at?: string }

/** Marqueurs serveur de la note enregistrée ; `due` = heure d’appel passée (ou dans les 10 minutes), ou « dès que possible ». */
export function parsePrev(note: string | null | undefined, slot: string | null | undefined, now = Date.now()): Prev {
  const n = note || '';
  // Suffixe « → date ISO » posé par le serveur en fin de slot (une flèche dans le texte libre du créneau ne compte pas).
  const at = /→ (\S+)$/.exec(slot || '')?.[1];
  const t = at ? Date.parse(at) : NaN;
  return {
    role: /\[ROLE:(same|manager)\]/.exec(n)?.[1] as Prev['role'],
    voice: /\[VOICE:(male|female)\]/.exec(n)?.[1] as Gender | undefined,
    asked: /\[ASKED:([^\]]{1,40})\]/.exec(n)?.[1],
    due: !at || !Number.isFinite(t) || t <= now + 600_000,
    at: at && Number.isFinite(t) ? new Date(t).toISOString() : undefined,
  };
}

/**
 * Table de décision. `requester` = genre de l’agent qui prend la demande ; `actingAsManager` = cet agent est le
 * responsable IA qui rappelle en ce moment (dernière demande [ROLE:manager] dans sa voix, voir decideCallback).
 * Un premier « humain » mène au responsable IA ; redemandé au responsable IA, à l’équipe (aucun appel IA).
 */
export function resolveCallback(o: { requester: Gender; by?: CallbackBy; actingAsManager: boolean; prev?: Prev }): { role?: Role; target: Gender; inherited: boolean } {
  const other: Gender = o.requester === 'male' ? 'female' : 'male';
  if (o.actingAsManager && (o.by === 'manager' || o.by === 'human')) return { role: 'human', target: o.requester, inherited: false };
  if (o.by === 'manager' || o.by === 'human') return { role: 'manager', target: other, inherited: false };
  if (o.by === 'again' && o.prev?.voice) return { role: o.prev.role ?? 'same', target: o.prev.voice, inherited: true };
  if (o.actingAsManager) return { role: 'manager', target: o.requester, inherited: true };
  return { role: o.by ? 'same' : undefined, target: o.requester, inherited: false };
}

/** Ce que l’outil a transmis : `active` seulement avec callback_by ou aid (sinon tout reste comme avant). */
export interface CallbackAsk { active: boolean; aidGiven: boolean; requester?: Requester; by?: CallbackBy }

export function readCallbackAsk(o: { fromAgent: boolean; aid: unknown; callbackBy: unknown }): CallbackAsk {
  // Hors outil d’agent authentifié (formulaire du site, démo), aid et callback_by sont ignorés.
  if (!o.fromAgent) return { active: false, aidGiven: false };
  const raw = Array.isArray(o.aid) ? o.aid[0] : o.aid;
  const aidGiven = String(raw ?? '').trim() !== '';
  const by = parseCallbackBy(o.callbackBy);
  return { active: aidGiven || by !== undefined, aidGiven, requester: findRequester(raw), by };
}

/**
 * Faut-il lire la dernière demande en file ? (reprise « again », responsable ou humain demandé — même responsable IA
 * si l’un est déjà en file, R12 —, agent inconnu, ou agent de rappel sortant)
 */
export const needsPrev = (a: CallbackAsk) => a.active && (a.by === 'again' || a.by === 'manager' || a.by === 'human' || !a.requester || a.requester.channel === 'callback');

export interface CallbackDecision {
  /** false : comportement d’avant (voix statique, aucune ligne de rôle, réponse inchangée). */
  active: boolean;
  role?: Role;
  /** Genre de la voix qui rappelle (campagne masculine si male). */
  target: Gender;
  /** Champ `voice` envoyé à l’automatisation (contrat inchangé : seulement 'male'). */
  voice?: 'male';
  inherited: boolean;
  actingAsManager: boolean;
  requester?: Requester;
  requesterGender: Gender;
  by?: CallbackBy;
  targetName: string;
  /** Prénom de l’agent à qui la demande a été faite (ligne [ROLE: manager …]). */
  askedName: string;
  /** L’agent qui parle est celui qui rappellera (même voix et même prénom). */
  samePersona: boolean;
  /** Persona de rappel pas encore créée (support masculin) : pas de mise en file, « À rappeler à la main ». */
  personaMissing: boolean;
  /** Dernière demande illisible en base : responsable ou humain demandé à un agent qui l’est peut-être → équipe. */
  prevFailed: boolean;
  /** Responsable demandé au support : une personne de l’équipe rappelle (choix du propriétaire, 9 oct. 2026). */
  supportTeam: boolean;
}

export function decideCallback(ask: CallbackAsk, o: { staticVoice: unknown; lang: string; kind: Kind; prev?: Prev; prevFailed?: boolean }): CallbackDecision {
  const l = asLoc(o.lang);
  // Genre de l’agent : connu par aid ; sinon champ statique voice=male des outils masculins (6246 à 6248).
  const requesterGender: Gender = ask.requester?.gender ?? (o.staticVoice === 'male' ? 'male' : 'female');
  if (!ask.active) {
    return {
      active: false, target: requesterGender, voice: requesterGender === 'male' ? 'male' : undefined, inherited: false, actingAsManager: false,
      // Prénom de la confirmation : celui de la voix qui appellera vraiment (sans persona masculine, la voix féminine).
      requesterGender, targetName: callbackName(l, o.kind, availableGender(l, o.kind, requesterGender)), askedName: '', samePersona: false, personaMissing: false, prevFailed: false, supportTeam: false,
    };
  }
  const { requester, by } = ask;
  const prev = o.prev;
  // Dernière demande illisible (panne de la base) : impossible de savoir si cet agent de rappel sortant (ou non
  // identifié) est le responsable IA en cours. « Responsable » ou « humain » va alors à l’équipe, jamais à l’autre voix.
  const prevFailed = Boolean(o.prevFailed) && (!requester || requester.channel === 'callback') && (by === 'manager' || by === 'human');
  // Responsable IA en train de rappeler : dernière demande en file de rôle manager, dans sa voix. Agent de rappel
  // sortant connu : même si cette demande est à venir (reprise pendant l’appel, ou 2e tentative de la campagne après
  // un « again ») ; agent non identifié : seulement si elle est échue. Vaut aussi sans aid, pour couper toute boucle.
  const actingAsManager = prevFailed || (prev?.role === 'manager' && prev.voice === requesterGender
    && (requester?.channel === 'callback' || (!requester && prev.due)));
  const resolved = resolveCallback({ requester: requesterGender, by, actingAsManager, prev });
  const { role, inherited } = resolved;
  // Support : un responsable (ou un humain) demandé est rappelé par une personne de l’équipe, jamais par une autre voix IA
  // (choix du propriétaire, 9 oct. 2026 : ces demandes portent sur la facturation ou le compte).
  if (o.kind === 'support' && role === 'manager') {
    const name = callbackName(l, o.kind, requesterGender);
    return {
      active: true, role: 'human', target: requesterGender, voice: undefined, inherited: false, actingAsManager, requester, requesterGender, by,
      targetName: name, askedName: '', samePersona: false, personaMissing: false, prevFailed, supportTeam: true,
    };
  }
  // R12 : un responsable IA est déjà en file pour ce numéro → le même (même voix), jamais la voix d’origine.
  const target: Gender = role === 'manager' && !inherited && prev?.role === 'manager' && prev.voice ? prev.voice : resolved.target;
  const tgt = CALLBACK_AGENTS[l][o.kind][target];
  const targetName = callbackName(l, o.kind, target);
  const askedName = (inherited ? prev?.asked || '' : requester ? requesterName(requester, l) : callbackName(l, o.kind, requesterGender)).replace(/[\[\]]/g, '').slice(0, 40);
  // Même persona : même voix ET même prénom (écrit : même prénom). Agent non identifié : jamais (il annonce le prénom).
  const samePersona = role === 'human' || !requester ? false
    : requester.channel === 'text' ? requesterName(requester, l) === targetName
    : tgt != null && requester.voice === tgt.voice && requesterName(requester, l) === targetName;
  // L’agent qui parle est lui-même le responsable IA déjà en file (par exemple Noa, responsable, jointe ensuite sur la
  // ligne entrante ou par WhatsApp) : responsable ou humain redemandé au responsable → l’équipe (R4), aucun appel IA.
  if (role === 'manager' && !inherited && samePersona && prev?.role === 'manager') {
    return {
      active: true, role: 'human', target, voice: undefined, inherited: false, actingAsManager: true, requester, requesterGender, by,
      targetName, askedName, samePersona: false, personaMissing: false, prevFailed, supportTeam: false,
    };
  }
  return {
    active: true, role, target, voice: target === 'male' ? 'male' : undefined, inherited, actingAsManager, requester, requesterGender, by,
    targetName, askedName, samePersona, personaMissing: role !== 'human' && tgt == null, prevFailed, supportTeam: false,
  };
}

/** Marqueurs serveur ajoutés à la note enregistrée (toujours la voix ; le rôle quand il est connu). */
export function storedMarks(d: CallbackDecision) {
  return [`[VOICE:${d.target}]`, d.role && `[ROLE:${d.role}]`, d.role === 'manager' && d.askedName && `[ASKED:${d.askedName}]`].filter(Boolean).join(' ');
}

const MARK = /\[(?:ROLE|VOICE|ASKED):[^\]]*\]/g;
/**
 * Note sans les marqueurs de persona (dossier client lu par les agents, e-mail à l’équipe). Découpe sur le séparateur
 * « — » posé par le serveur : linéaire, sans retour arrière sur le texte libre, qui reste tel quel ; un segment fait
 * seulement de marqueurs disparaît avec son séparateur.
 */
export function stripPersonaMarks(note: string | null | undefined) {
  if (note == null) return note;
  return String(note).split(' — ').flatMap((s) => {
    const t = s.replace(MARK, '');
    return t !== s && t.trim() === '' ? [] : [t];
  }).join(' — ');
}

/** Note libre envoyée à la campagne sans callback_by ni aid : seule une fausse ligne de rôle est neutralisée. */
export const defuseRoleMarker = (note: string) => note.replace(/\[(\s*ROLE\s*:)/gi, '($1');

/** Première ligne de la note de campagne, lue par l’agent qui rappelle (seule ligne de rôle fiable). */
export function campaignRoleLine(d: CallbackDecision) {
  if (!d.active) return '';
  if (d.role === 'manager') return `[ROLE: manager — request taken by: ${d.askedName || 'another AI assistant of the team'} — you call back as: ${d.targetName}, AI assistant in charge of follow-up]`;
  if (d.role === 'same') return `[ROLE: same — ${d.targetName} calls back as promised]`;
  return '';
}

const spoken = (name: string) => (latinName(name) !== name ? `${name} (${latinName(name)})` : name);

/** Consigne pour l’agent qui a pris la demande (en anglais, comme les autres message_for_agent). */
export function agentMessage(d: CallbackDecision, o: { queued: boolean; scheduledFor: string }): string | undefined {
  if (!d.active) return undefined;
  if (d.role === 'human') return 'The request was passed to the team: a person from the team will call back as soon as possible. Do not promise a time and do not call this tool again.';
  if (!o.queued) return undefined;
  const n = spoken(d.targetName), pron = d.target === 'male' ? 'he' : 'she';
  // Rôle repris (R5, « again ») : « still » ; même persona que le responsable IA déjà en file (R12) : sans « still ».
  if (d.samePersona) return d.role === 'manager' ? `You will call back yourself ${o.scheduledFor}, ${d.inherited ? 'still ' : ''}as the AI assistant in charge of following up this request.` : undefined;
  if (d.role === 'manager') return `Tell the person that ${n}, an AI assistant in charge of following up requests (${pron}), will call back ${o.scheduledFor}. Say clearly that ${n} is an AI assistant, never a human; ${pron} can pass the request on to a person from the team if they still wish.${d.requester ? '' : ` If ${n} is your own name, say instead that you will call back yourself.`}`;
  if (!d.requester) return `Tell the person that ${n}, an AI assistant from the team, will call back ${o.scheduledFor}. If ${n} is your own name, say instead that you will call back yourself.`;
  return `Tell the person that ${n}, an AI assistant from the team, will call back ${o.scheduledFor} (not you).`;
}

/** Champ callback_agent de la réponse : qui rappellera (rôle human : une personne de l’équipe, aucun appel IA). */
export function callbackAgentReply(d: CallbackDecision, queued: boolean) {
  if (d.role === 'human' || !queued) return { name: null, name_latin: null, gender: null, role: 'human' as const, same_persona: false };
  return { name: d.targetName, name_latin: latinName(d.targetName), gender: d.target, role: d.role ?? 'same', same_persona: d.samePersona };
}

/** Lignes ajoutées à l’e-mail de l’équipe (seulement avec callback_by ou aid). */
export function teamMailLines(d: CallbackDecision, kind: Kind): string[] {
  if (!d.active) return [];
  const who = d.requester ? `${d.requester.id} (${latinName(d.requester.name ?? 'persona écrite')}, ${d.requester.channel})` : 'inconnu (aid absent ou non reconnu)';
  const voice = `voix ${d.target === 'male' ? 'masculine' : 'féminine'}`;
  const by = d.by ? `callback_by=${d.by}` : 'callback_by vide';
  const line = d.role === 'human' && d.prevFailed
    ? 'Rappel par : une PERSONNE DE L’ÉQUIPE — dernière demande illisible en base, responsable IA en cours impossible à vérifier — aucun appel automatique'
    : d.role === 'human' && d.supportTeam
    ? 'Rappel par : une PERSONNE DE L’ÉQUIPE — responsable demandé au support — aucun appel automatique'
    : d.role === 'human'
    ? `Rappel par : une PERSONNE DE L’ÉQUIPE, demandée au responsable IA ${latinName(d.targetName)} — aucun appel automatique`
    : d.personaMissing
      ? `Rappel par : ${latinName(d.targetName)} (${voice}, ${kind}) — persona pas encore créée dans Autocalls : à rappeler à la main`
      : `Rappel par : ${latinName(d.targetName)} (${voice}) — ${d.role === 'manager'
        ? `responsable IA demandé à ${latinName(d.askedName) || 'un autre agent'}${d.inherited ? ' (rôle repris de la demande précédente)' : ''}`
        : d.inherited ? 'même persona que la dernière demande' : d.role === 'same' ? (d.samePersona ? 'même agent' : 'persona de rappel de la langue') : 'qui rappelle non précisé'}`;
  return [line, `Agent Autocalls : ${who} — ${by}`];
}

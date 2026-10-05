// Sections inspirées des références (autocalls.ai, vendasta.com), en version honnête :
// démo réelle par rappel, équipe d’agents, onglets d’usages, parcours client, aperçu de l’espace client.
import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight, BarChart3, BellRing, Bot, CalendarCheck, Check, Clock, FileText, Headphones, Layers,
  MessageCircle, Mic, PhoneCall, PhoneForwarded, PhoneIncoming, PhoneOutgoing, RefreshCw, Search,
  ShieldCheck, Sparkles, Target, UserCheck, Users, Wand2,
} from 'lucide-react';
import LiveCall from './LiveCall';
import Mock, { Wave } from './Mock';
import { Heading, Photo } from './ui';
import { SECTORS } from '@/data/sectors';
import { SECTOR_ICON } from './blocks';

/* ---------- Démo dans le hero : l’agent vous appelle (pas de numéro public) ---------- */

const LANGS = ['Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien', 'Portugais', 'Arabe', 'Néerlandais'];

export function HeroDemo() {
  const [lang, setLang] = useState('Français');
  const [voice, setVoice] = useState('Féminine');
  const [sector, setSector] = useState(SECTORS[0].slug);
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (!f.get('consent')) { setError('Cochez la case pour recevoir l’appel.'); return; }
    setState('sending'); setError('');
    try {
      const res = await fetch('/api/callback', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: f.get('name'), phone: f.get('phone'), sector, consentCall: true, type: 'commercial', agent: 'Démo live', note: `Démo live — langue : ${lang} — voix : ${voice}` }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'La demande n’a pas pu être envoyée.');
      setState('sent');
    } catch (err: any) { setState('error'); setError(err.message); }
  }

  const sel = 'w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-[14px] text-white focus:border-signal-glow focus:outline-none';
  return (
    <div className="rounded-3xl bg-night p-5 text-white shadow-float sm:p-6">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 font-display font-semibold"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-signal"><Mic className="h-4 w-4" aria-hidden /></span>Démo live</p>
        <span className="flex items-center gap-1.5 text-xs text-white/60"><span className="h-2 w-2 rounded-full bg-ok" aria-hidden />Agent disponible</span>
      </div>
      {state === 'sent' ? (
        <div role="status" className="mt-5 rounded-2xl bg-white/10 p-5">
          <p className="font-display text-lg font-semibold">L’agent va vous appeler</p>
          <p className="mt-1 text-sm text-white/75">Gardez votre téléphone à portée de main. Le scénario {SECTORS.find((s) => s.slug === sector)?.name.toLowerCase()} est prêt, en {lang.toLowerCase()}.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-5 grid gap-3">
          <p className="text-[15px] text-white/80">Choisissez une voix et une langue : l’agent vous appelle et joue un scénario de votre métier.</p>
          <div className="grid grid-cols-3 gap-2">
            <label className="text-xs text-white/60">Langue<select value={lang} onChange={(e) => setLang(e.target.value)} className={`${sel} mt-1`}>{LANGS.map((l) => <option key={l} className="text-ink">{l}</option>)}</select></label>
            <label className="text-xs text-white/60">Voix<select value={voice} onChange={(e) => setVoice(e.target.value)} className={`${sel} mt-1`}>{['Féminine', 'Masculine'].map((v) => <option key={v} className="text-ink">{v}</option>)}</select></label>
            <label className="text-xs text-white/60">Secteur<select value={sector} onChange={(e) => setSector(e.target.value)} className={`${sel} mt-1`}>{SECTORS.map((s) => <option key={s.slug} value={s.slug} className="text-ink">{s.name}</option>)}</select></label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input name="name" required placeholder="Votre prénom" autoComplete="given-name" aria-label="Votre prénom" className={sel} />
            <input name="phone" type="tel" required minLength={8} placeholder="Votre téléphone" autoComplete="tel" aria-label="Votre téléphone" className={sel} />
          </div>
          <label className="flex items-start gap-2 text-xs text-white/70"><input type="checkbox" name="consent" className="mt-0.5 h-4 w-4 accent-[#0FA3C4]" />J’accepte d’être appelé par l’agent vocal IA de démonstration.</label>
          {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
          <button type="submit" disabled={state === 'sending'} className="btn-signal"><PhoneCall className="h-4 w-4" aria-hidden />{state === 'sending' ? 'Envoi…' : 'Faire sonner mon téléphone'}</button>
        </form>
      )}
    </div>
  );
}

/* ---------- Bandeau défilant ---------- */

export function Marquee({ items, className = '' }: { items: React.ReactNode[]; className?: string }) {
  return (
    <div className={`relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] ${className}`}>
      <div className="flex w-max animate-marquee gap-3 motion-reduce:animate-none">
        {[...items, ...items].map((it, i) => <div key={i} aria-hidden={i >= items.length}>{it}</div>)}
      </div>
    </div>
  );
}

export function IndustryMarquee() {
  const names = ['Plombiers', 'Électriciens', 'Cabinets dentaires', 'Cliniques', 'Agences immobilières', 'Gestion locative', 'Garages', 'Carrosseries', 'Salons de coiffure', 'Instituts', 'Restaurants', 'Hôtels', 'Avocats', 'E-commerce', 'Kinés', 'Vétérinaires'];
  return <Marquee items={names.map((n) => <span key={n} className="whitespace-nowrap rounded-full border border-line bg-white px-4 py-2 font-display text-sm font-semibold text-ink">{n}</span>)} />;
}

export function LanguageMarquee() {
  const langs = [['🇫🇷', 'Français'], ['🇬🇧', 'Anglais'], ['🇪🇸', 'Espagnol'], ['🇩🇪', 'Allemand'], ['🇮🇹', 'Italien'], ['🇵🇹', 'Portugais'], ['🇳🇱', 'Néerlandais'], ['🇧🇪', 'Belgique'], ['🇨🇭', 'Suisse'], ['🇨🇦', 'Québécois'], ['🇲🇦', 'Arabe'], ['🇵🇱', 'Polonais'], ['🇷🇴', 'Roumain'], ['🇹🇷', 'Turc'], ['🇸🇪', 'Suédois']];
  return <Marquee items={langs.map(([f, n]) => <span key={n} className="flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-card"><span aria-hidden>{f}</span>{n}</span>)} />;
}

/* ---------- Votre équipe d’agents IA (inspiré de l’« AI workforce ») ---------- */

const AGENTS = [
  { icon: PhoneIncoming, name: 'Réceptionniste IA', role: 'Répond à chaque appel, filtre et transfère ce qui compte.', href: '/fonctionnalites/receptionniste-ia', color: 'from-signal to-signal-deep' },
  { icon: CalendarCheck, name: 'Agent rendez-vous', role: 'Réserve, confirme, rappelle et gère les reports.', href: '/fonctionnalites/prise-de-rendez-vous', color: 'from-[#6C8CFF] to-[#3B5BDB]' },
  { icon: Target, name: 'Agent qualification', role: 'Pose vos questions et prépare des fiches prêtes à traiter.', href: '/fonctionnalites/qualification-des-leads', color: 'from-[#22C3A6] to-[#0E8F78]' },
  { icon: Headphones, name: 'Agent support', role: 'Répond depuis vos documents, escalade les cas sensibles.', href: '/fonctionnalites/support-client', color: 'from-[#F59E0B] to-[#C2410C]' },
  { icon: RefreshCw, name: 'Agent relance', role: 'Confirme, relance les devis et réactive vos contacts.', href: '/fonctionnalites/campagnes-sortantes', color: 'from-[#A78BFA] to-[#6D28D9]' },
  { icon: MessageCircle, name: 'Agent messages', role: 'Répond et confirme par SMS, WhatsApp et Instagram.', href: '/fonctionnalites/whatsapp-messages', color: 'from-[#34D399] to-[#059669]' },
];

export function AgentOrbit() {
  const r = 42; // rayon en %
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md" aria-hidden>
      <div className="absolute inset-[14%] rounded-full border border-dashed border-signal/30" />
      <div className="absolute inset-[30%] rounded-full border border-line" />
      <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-float">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon-192.png" alt="" className="h-20 w-20 rounded-full" />
      </div>
      {AGENTS.map((a, i) => {
        const angle = (i / AGENTS.length) * 2 * Math.PI - Math.PI / 2;
        return (
          <div key={a.name} className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{ left: `${50 + r * Math.cos(angle)}%`, top: `${50 + r * Math.sin(angle)}%` }}>
            <span className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${a.color} text-white shadow-card ring-4 ring-white`}><a.icon className="h-6 w-6" /></span>
            <span className="mt-1.5 block whitespace-nowrap rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-ink shadow-card">{a.name}</span>
          </div>
        );
      })}
    </div>
  );
}

export function AgentTeam() {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
      <AgentOrbit />
      <div>
        <Heading title="Construisez votre équipe d’agents IA" intro="Chaque agent a un rôle précis. Activez ceux dont votre entreprise a besoin ; ils partagent le même historique et les mêmes informations." />
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {AGENTS.map((a) => (
            <Link key={a.name} href={a.href} className="group flex gap-3 rounded-2xl border border-line bg-white p-4 hover:border-ink">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${a.color} text-white`}><a.icon className="h-5 w-5" aria-hidden /></span>
              <span><span className="block font-display font-semibold text-ink group-hover:underline">{a.name}</span><span className="block text-[14px] leading-snug">{a.role}</span></span>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-light">Besoin d’un scénario particulier ? Nous configurons un agent sur mesure.</p>
      </div>
    </div>
  );
}

/* ---------- Voyez l’agent en action : un onglet par secteur ---------- */

export function SectorShowcase() {
  const [active, setActive] = useState(SECTORS[0].slug);
  const s = SECTORS.find((x) => x.slug === active)!;
  return (
    <div>
      <div role="tablist" aria-label="Choisir un secteur" className="flex gap-2 overflow-x-auto pb-2">
        {SECTORS.map((x) => {
          const Icon = SECTOR_ICON[x.slug];
          const on = x.slug === active;
          return (
            <button key={x.slug} role="tab" aria-selected={on} type="button" onClick={() => setActive(x.slug)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${on ? 'bg-ink text-white' : 'border border-line bg-white text-ink hover:border-ink'}`}>
              <Icon className="h-4 w-4" aria-hidden />{x.name}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" className="mt-8 grid items-center gap-10 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="aspect-[3/2]"><Photo key={s.photo} src={s.photo} alt={s.photoAlt} fallback={<div className="h-full w-full bg-signal-soft" />} /></div>
          <p className="absolute inset-x-4 bottom-4 rounded-xl bg-white/90 px-4 py-3 text-[14px] text-ink backdrop-blur">{s.caption}</p>
        </div>
        <div>
          <LiveCall key={s.slug} title={`Agent ${s.name.toLowerCase()}`} call={s.call} lead={s.lead} />
          <Link href={`/secteurs/${s.slug}`} className="mt-6 inline-flex items-center gap-1 font-semibold text-signal-deep hover:underline">Voir la solution {s.name.toLowerCase()}<ArrowUpRight className="h-4 w-4" aria-hidden /></Link>
        </div>
      </div>
    </div>
  );
}

/* ---------- Usages : appels entrants / sortants / messages ---------- */

const USES = {
  entrants: {
    label: 'Appels entrants', icon: PhoneIncoming,
    items: [
      { icon: PhoneIncoming, t: 'Accueil 24/7', d: 'Chaque appel reçoit une réponse, même la nuit et le week-end.' },
      { icon: CalendarCheck, t: 'Prise de rendez-vous', d: 'Réservation directe dans votre agenda, avec confirmation.' },
      { icon: Headphones, t: 'Support client', d: 'Réponses à partir de vos documents, sans file d’attente.' },
      { icon: UserCheck, t: 'Qualification', d: 'Les bonnes questions posées avant de transmettre.' },
      { icon: PhoneForwarded, t: 'Transfert humain', d: 'Bascule vers votre équipe quand c’est important.' },
      { icon: BellRing, t: 'Urgences', d: 'Tri selon vos règles et alerte immédiate.' },
    ],
  },
  sortants: {
    label: 'Appels sortants', icon: PhoneOutgoing,
    items: [
      { icon: PhoneOutgoing, t: 'Rappel des leads web', d: 'Un formulaire rempli devient un appel en quelques minutes.' },
      { icon: CalendarCheck, t: 'Confirmations', d: 'Rendez-vous et réservations confirmés la veille.' },
      { icon: RefreshCw, t: 'Relance des devis', d: 'Les devis en attente relancés aux bons horaires.' },
      { icon: Target, t: 'Préqualification', d: 'Contacts filtrés avant l’appel de votre équipe.' },
      { icon: Users, t: 'Renouvellements', d: 'Clients recontactés pour renouveler ou compléter.' },
      { icon: BarChart3, t: 'Enquêtes de satisfaction', d: 'Avis collectés après la prestation.' },
    ],
  },
  messages: {
    label: 'Messages', icon: MessageCircle,
    items: [
      { icon: MessageCircle, t: 'WhatsApp', d: 'Confirmations, rappels et réponses écrites.' },
      { icon: FileText, t: 'SMS', d: 'Récapitulatif après chaque appel.' },
      { icon: Sparkles, t: 'Instagram et Messenger', d: 'Messages directs centralisés.' },
      { icon: Layers, t: 'Widget web', d: 'Parler à l’agent ou être rappelé depuis votre site.' },
      { icon: Clock, t: 'Liste d’attente', d: 'Prévenir quand un créneau se libère.' },
      { icon: Search, t: 'Historique unique', d: 'Appels et messages au même endroit.' },
    ],
  },
} as const;

export function UseCaseTabs() {
  const [tab, setTab] = useState<keyof typeof USES>('entrants');
  return (
    <div>
      <div role="tablist" aria-label="Types d’usage" className="mx-auto flex w-fit rounded-full bg-paper p-1">
        {(Object.keys(USES) as (keyof typeof USES)[]).map((k) => {
          const T = USES[k]; const on = tab === k;
          return (
            <button key={k} role="tab" aria-selected={on} type="button" onClick={() => setTab(k)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold sm:px-5 ${on ? 'bg-ink text-white' : 'text-ink'}`}>
              <T.icon className="h-4 w-4" aria-hidden />{T.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {USES[tab].items.map((i) => (
          <div key={i.t} className="rounded-2xl border border-line bg-white p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-signal-soft"><i.icon className="h-5 w-5 text-signal-deep" aria-hidden /></span>
            <h3 className="mt-4 text-h3 font-semibold">{i.t}</h3>
            <p className="mt-1.5 text-[15px]">{i.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Plateforme complète (grille de fonctions avec mini-visuels) ---------- */

export function PlatformGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-3xl bg-paper p-6">
        <p className="font-display text-lg font-bold text-ink">Appels simultanés</p>
        <p className="mt-1 text-[15px]">Pas de file d’attente : l’agent traite plusieurs appels en même temps sur la même ligne.</p>
        <div className="mt-6 grid grid-cols-6 gap-2" aria-hidden>
          {Array.from({ length: 18 }).map((_, i) => <span key={i} className={`flex h-8 items-center justify-center rounded-full ${i % 4 === 0 ? 'bg-signal text-white' : 'bg-white text-signal'}`}><PhoneCall className="h-3.5 w-3.5" /></span>)}
        </div>
      </div>
      <div className="rounded-3xl bg-paper p-6">
        <p className="font-display text-lg font-bold text-ink">Base de connaissances</p>
        <p className="mt-1 text-[15px]">PDF, pages de votre site, procédures : l’agent répond avec vos informations.</p>
        <div className="mt-4 scale-95"><Mock kind="knowledge" /></div>
      </div>
      <div className="rounded-3xl bg-paper p-6">
        <p className="flex items-center gap-2 font-display text-lg font-bold text-ink"><Wand2 className="h-5 w-5 text-signal" aria-hidden />Assistant de prompts</p>
        <p className="mt-1 text-[15px]">Décrivez l’objectif de l’appel : un assistant pas à pas règle le comportement de l’agent.</p>
        <div className="mt-4 scale-95"><Mock kind="prompt" /></div>
      </div>
      <div className="rounded-3xl bg-paper p-6">
        <p className="font-display text-lg font-bold text-ink">Transfert vers un humain</p>
        <p className="mt-1 text-[15px]">Quand le client le demande ou quand la situation l’exige, l’appel bascule vers votre équipe.</p>
        <div className="mt-6 flex items-center justify-between rounded-2xl bg-white p-4 shadow-card" aria-hidden>
          <span className="flex items-center gap-2 text-sm font-semibold text-ink"><Bot className="h-5 w-5 text-signal" />Agent IA</span>
          <Wave bars={10} />
          <span className="flex items-center gap-2 text-sm font-semibold text-ink"><Users className="h-5 w-5 text-ok" />Votre équipe</span>
        </div>
      </div>
      <div className="rounded-3xl bg-paper p-6">
        <p className="font-display text-lg font-bold text-ink">Rapports détaillés</p>
        <p className="mt-1 text-[15px]">Enregistrements, transcriptions, résumés et graphiques pour chaque appel.</p>
        <div className="mt-4 scale-95"><Mock kind="report" /></div>
      </div>
      <div className="rounded-3xl bg-paper p-6">
        <p className="font-display text-lg font-bold text-ink">Campagnes sortantes</p>
        <p className="mt-1 text-[15px]">Importez vos contacts consentants ou déclenchez des appels depuis vos outils et formulaires.</p>
        <div className="mt-4 scale-95"><Mock kind="campaign" /></div>
      </div>
    </div>
  );
}

/* ---------- Parcours client : Attirer, Convertir, Fidéliser, Mesurer ---------- */

const STAGES = [
  { k: 'Attirer', icon: Search, t: 'Captez chaque demande', items: ['Landing pages par secteur', 'Widget web : parler ou être rappelé', 'Numéros locaux et renvoi de votre ligne', 'Réponse 24/7 aux appels et messages'], mock: 'widget' as const },
  { k: 'Convertir', icon: Target, t: 'Transformez les demandes en clients', items: ['Qualification selon vos critères', 'Rappel des leads en quelques minutes', 'Prise de rendez-vous dans votre agenda', 'Fiche CRM créée automatiquement'], mock: 'lead' as const },
  { k: 'Fidéliser', icon: Users, t: 'Gardez le lien avec vos clients', items: ['Confirmations et rappels', 'Support répondant depuis vos documents', 'Relances, renouvellements et enquêtes', 'WhatsApp, SMS, Instagram'], mock: 'whatsapp' as const },
  { k: 'Mesurer', icon: BarChart3, t: 'Pilotez avec des chiffres réels', items: ['Volumes, durées et résultats', 'Rendez-vous pris et transferts', 'Usage des minutes et alertes', 'Écoute des appels et transcriptions'], mock: 'report' as const },
];

export function Lifecycle() {
  const [i, setI] = useState(0);
  const s = STAGES[i];
  return (
    <div>
      <Heading center title="Tout le parcours client, au même endroit" intro="De la première demande au client fidèle : une seule plateforme, un seul historique." />
      <div role="tablist" aria-label="Étapes du parcours" className="mx-auto mt-10 grid max-w-3xl grid-cols-4 gap-2">
        {STAGES.map((x, n) => (
          <button key={x.k} role="tab" aria-selected={n === i} type="button" onClick={() => setI(n)}
            className={`flex flex-col items-center gap-2 rounded-2xl px-2 py-4 text-sm font-semibold transition-colors ${n === i ? 'bg-ink text-white' : 'bg-paper text-ink hover:bg-signal-soft'}`}>
            <x.icon className="h-5 w-5" aria-hidden />{x.k}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mt-10 grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h3 className="font-display text-[1.75rem] font-bold">{s.t}</h3>
          <ul className="mt-5 space-y-3">{s.items.map((it) => <li key={it} className="flex gap-3 text-ink"><Check className="mt-1 h-4 w-4 shrink-0 text-signal" aria-hidden />{it}</li>)}</ul>
        </div>
        <div className="mx-auto w-full max-w-md"><Mock kind={s.mock} /></div>
      </div>
    </div>
  );
}

/* ---------- Aperçu de l’espace client (inspiré de la « Business App ») ---------- */

export function PortalPreview() {
  const calls = [
    { who: 'Nouveau patient', what: 'Rendez-vous mardi 9 h 30', tag: 'Réservé', c: 'bg-ok/10 text-ok' },
    { who: 'Fuite d’eau', what: 'Rappel prioritaire demandé', tag: 'Urgent', c: 'bg-red-50 text-red-700' },
    { who: 'Acheteur T3', what: 'Visite samedi 11 h', tag: 'Qualifié', c: 'bg-signal-soft text-signal-deep' },
    { who: 'Question horaires', what: 'Réponse donnée', tag: 'Résolu', c: 'bg-paper text-slate' },
  ];
  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.3fr]">
      <div>
        <Heading title="Votre espace client, clair dès la première connexion" intro="Appels, rendez-vous, leads, messages et minutes : tout est visible au même endroit, sur ordinateur comme sur mobile." />
        <ul className="mt-6 space-y-2.5">
          {['Résumé de chaque appel et prochaine action', 'Écoute des enregistrements et transcriptions', 'Suivi des minutes et alertes de consommation', 'Configuration de vos agents sans code'].map((t) => <li key={t} className="flex gap-3 text-ink"><Check className="mt-1 h-4 w-4 shrink-0 text-signal" aria-hidden />{t}</li>)}
        </ul>
        <p className="mt-6 flex items-center gap-2 text-sm text-slate-light"><ShieldCheck className="h-4 w-4 text-signal" aria-hidden />Accès par rôle pour chaque membre de l’équipe (forfait Centre d’appels).</p>
      </div>
      <div className="relative">
        <div className="rounded-3xl border border-line bg-white p-5 shadow-float">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <p className="font-display font-semibold text-ink">Tableau de bord</p>
            <span className="text-xs text-slate-light">Données d’exemple · 30 derniers jours</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[['Appels', '412'], ['Rendez-vous', '96'], ['Leads', '183'], ['Minutes', '62 %']].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-paper p-3"><p className="text-xs text-slate">{k}</p><p className="font-display text-lg font-bold text-ink">{v}</p></div>
            ))}
          </div>
          <ul className="mt-4 divide-y divide-line">
            {calls.map((c) => (
              <li key={c.who} className="flex items-center gap-3 py-2.5 text-sm">
                <PhoneIncoming className="h-4 w-4 text-signal" aria-hidden />
                <span className="font-medium text-ink">{c.who}</span><span className="hidden text-slate sm:inline">{c.what}</span>
                <span className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.c}`}>{c.tag}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="absolute -bottom-8 -left-4 hidden w-44 rounded-[1.6rem] border-4 border-ink bg-white p-3 shadow-float sm:block" aria-hidden>
          <p className="text-[11px] font-semibold text-ink">Notification</p>
          <p className="mt-1 rounded-lg bg-signal-soft p-2 text-[11px] text-ink">Nouveau rendez-vous réservé par l’agent : mardi 9 h 30.</p>
          <p className="mt-1.5 rounded-lg bg-paper p-2 text-[11px] text-ink">Minutes : 62 % utilisées.</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Avant / après (doc 96) ---------- */

export function BeforeAfter({ before, after }: { before: string[]; after: string[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-3xl border border-line bg-white p-7">
        <p className="font-display text-lg font-bold text-slate">Sans agent IA</p>
        <ul className="mt-4 space-y-3">{before.map((b) => <li key={b} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-light" aria-hidden />{b}</li>)}</ul>
      </div>
      <div className="rounded-3xl bg-ink p-7 text-white/85">
        <p className="font-display text-lg font-bold text-white">Avec Permanence IA</p>
        <ul className="mt-4 space-y-3">{after.map((a) => <li key={a} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-signal-glow" aria-hidden />{a}</li>)}</ul>
      </div>
    </div>
  );
}

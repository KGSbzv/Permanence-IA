// Mesure d’audience (Google Analytics 4, sans Tag Manager), mesure publicitaire (pixel Meta) et consentement (Consent Mode v2).
// Rien ne part chez Google ni chez Meta avant l’accord du visiteur : gtag.js et le pixel Meta ne sont chargés
// qu’au clic sur « Accepter » (ou dès l’arrivée sur le site si ce choix est déjà mémorisé). Sur « Refuser », rien ne se charge.

export const GA_ID = 'G-4W1B1W52PZ';
/** Pixel Meta (Facebook / Instagram) : mesure des campagnes publicitaires, uniquement après consentement. */
export const META_PIXEL_ID = '2382649089171477';

/** Cookie partagé avec l’espace client (app.permanenceia.com) : « granted » ou « denied ». */
export const CONSENT_COOKIE = 'pia_consent';

type Gtag = (...args: unknown[]) => void;
const gtag = (): Gtag | undefined => (typeof window !== 'undefined' ? (window as unknown as { gtag?: Gtag }).gtag : undefined);

/** Mesure seulement sur le site en ligne (permanenceia.com et ses sous-domaines) : le serveur de développement
 *  (localhost) et les aperçus n’envoient rien à Google ni à Meta, pour ne pas fausser les statistiques et les audiences. */
const onLiveSite = () => typeof location !== 'undefined' && /(^|\.)permanenceia\.com$/.test(location.hostname);

export function readConsent(): 'granted' | 'denied' | null {
  if (typeof document === 'undefined') return null;
  const m = /(?:^|;\s*)pia_consent=(granted|denied)/.exec(document.cookie);
  return m ? (m[1] as 'granted' | 'denied') : null;
}

export function saveConsent(value: 'granted' | 'denied') {
  try {
    const domain = location.hostname.endsWith('permanenceia.com') ? '; domain=.permanenceia.com' : '';
    document.cookie = `${CONSENT_COOKIE}=${value}${domain}; path=/; max-age=${60 * 60 * 24 * 180}; samesite=lax; secure`;
  } catch { /* cookies bloqués : le choix vaut pour cette page seulement */ }
  if (value === 'granted') { loadGoogleAnalytics(); loadMetaPixel(); }
  else { stopGoogleAnalytics(); metaAllowed = false; fbq()?.('consent', 'revoke'); clearTrackingCookies(); }
}

// ── Google Analytics 4 ─────────────────────────────────────────────────────
// Côté Google, seule la mesure d’audience suit le choix : les signaux publicitaires Google (ad_*) restent refusés,
// aucune balise Google Ads n’étant utilisée. La mesure publicitaire passe uniquement par le pixel Meta.
let gaAllowed = false;
let gaLoaded = false;
/** Interrupteur officiel de gtag.js : à true, plus aucune donnée n’est envoyée pour cet identifiant. */
const GA_DISABLE_KEY = `ga-disable-${GA_ID}`;

/** Charge gtag.js (une seule fois) et compte la page en cours (page_view envoyée par « config »).
 *  À n’appeler qu’après consentement : avant, aucune requête ne part vers googletagmanager.com ni google-analytics.com. */
export function loadGoogleAnalytics() {
  if (typeof window === 'undefined' || gaAllowed || !onLiveSite()) return;
  gaAllowed = true;
  const w = window as unknown as Record<string, unknown> & { dataLayer?: unknown[]; gtag?: Gtag };
  w[GA_DISABLE_KEY] = false;
  if (!w.gtag) {
    // File d’attente normalement déjà posée dans le <head> (CONSENT_DEFAULT_SCRIPT) ; gtag.js attend l’objet « arguments ».
    const dl: unknown[] = (w.dataLayer = w.dataLayer || []);
    // eslint-disable-next-line prefer-rest-params
    w.gtag = function () { dl.push(arguments); };
    w.gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  }
  const g = w.gtag;
  g('consent', 'update', { analytics_storage: 'granted' });
  // Accord retiré puis redonné sur la même page : la balise est déjà là et cette page vue déjà comptée.
  if (gaLoaded) return;
  gaLoaded = true;
  g('js', new Date());
  g('config', GA_ID, { linker: { domains: ['permanenceia.com', 'app.permanenceia.com'] } });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

/** Refus ou retrait du consentement : plus aucun envoi vers Google, même des signaux sans cookie. */
function stopGoogleAnalytics() {
  gaAllowed = false;
  try { (window as unknown as Record<string, unknown>)[GA_DISABLE_KEY] = true; } catch { /* hors navigateur */ }
  // Si la balise n’a jamais été chargée, la commande reste dans la file en mémoire : rien ne part.
  gtag()?.('consent', 'update', { analytics_storage: 'denied' });
}

/** Retrait du consentement : efface les identifiants déjà déposés (_ga, _ga_*, _gid, _fbp, _fbc),
 *  sur le domaine courant et sur .permanenceia.com (domaine choisi par gtag.js et le pixel). */
function clearTrackingCookies() {
  try {
    const host = location.hostname;
    const domains = ['', `; domain=${host}`, `; domain=.${host.replace(/^www\./, '')}`];
    if (host.endsWith('permanenceia.com')) domains.push('; domain=.permanenceia.com');
    for (const part of document.cookie.split(';')) {
      const name = part.split('=')[0].trim();
      if (!/^(_ga(_.+)?|_gid|_gat(_.+)?|_fbp|_fbc)$/.test(name)) continue;
      for (const d of domains) document.cookie = `${name}=; path=/${d}; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  } catch { /* cookies bloqués : rien à effacer */ }
}

// ── Pixel Meta ─────────────────────────────────────────────────────────────
type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };
const fbq = (): Fbq | undefined => (typeof window !== 'undefined' ? (window as unknown as { fbq?: Fbq }).fbq : undefined);
let metaAllowed = false;

/** Charge le pixel Meta (une seule fois) et compte la page vue. À n’appeler qu’après consentement. */
export function loadMetaPixel() {
  if (typeof window === 'undefined' || metaAllowed || !onLiveSite()) return;
  metaAllowed = true;
  const w = window as unknown as { fbq?: Fbq; _fbq?: Fbq };
  if (w.fbq) { w.fbq('consent', 'grant'); w.fbq('track', 'PageView'); return; }
  // Équivalent du code d’installation officiel de Meta, sans la balise <noscript> (elle partirait sans consentement).
  const f: Fbq = function (...args: unknown[]) { if (f.callMethod) f.callMethod(...args); else f.queue!.push(args); };
  f.push = f; f.loaded = true; f.version = '2.0'; f.queue = [];
  w.fbq = f; w._fbq = f;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
  // Pas de configuration automatique ni de correspondance avancée : aucune donnée de formulaire n’est lue par le pixel.
  // Sans identifiant, l’appel pose l’indicateur global (disableAutoConfig) que lisent aussi les modules microdata ;
  // avec l’identifiant, il retire la configuration automatique de ce pixel, même si elle est activée dans Events Manager.
  f('set', 'autoConfig', false);
  f('set', 'autoConfig', false, META_PIXEL_ID);
  f('init', META_PIXEL_ID);
  f('track', 'PageView');
}

/** Correspondance entre nos événements GA4 et les événements Meta. Aucune donnée personnelle n’est transmise à Meta. */
const META_EVENTS: Record<string, [method: 'track' | 'trackCustom', name: string]> = {
  page_view: ['track', 'PageView'],
  generate_lead: ['track', 'Lead'],
  whatsapp_click: ['track', 'Contact'],
  phone_call_click: ['track', 'Contact'],
  begin_trial_click: ['trackCustom', 'TrialClick'],
};

/** Événement GA4 et pixel Meta, envoyés seulement si le visiteur a accepté (sinon ignorés, sans erreur).
 *  Une fois l’accord donné, gtag.js envoie aussi les événements émis pendant son téléchargement. */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (gaAllowed) gtag()?.('event', event, params);
  const meta = META_EVENTS[event];
  if (meta && metaAllowed) fbq()?.(meta[0], meta[1]);
}

/** Script placé dans le <head> : file d’attente gtag et consentement refusé par défaut. Il ne charge rien :
 *  gtag.js, la configuration et la page vue viennent de loadGoogleAnalytics(), seulement après l’accord du visiteur. */
export const CONSENT_DEFAULT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
`;

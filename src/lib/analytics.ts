// Mesure d’audience (Google Analytics 4, sans Tag Manager), mesure publicitaire (pixel Meta) et consentement (Consent Mode v2).
// Rien n’est stocké chez le visiteur avant son accord : le mode consentement envoie seulement des signaux anonymes,
// et le pixel Meta n’est même pas chargé tant que le visiteur n’a pas accepté.

export const GA_ID = 'G-4W1B1W52PZ';
/** Pixel Meta (Facebook / Instagram) : mesure des campagnes publicitaires, uniquement après consentement. */
export const META_PIXEL_ID = '2382649089171477';

/** Cookie partagé avec l’espace client (app.permanenceia.com) : « granted » ou « denied ». */
export const CONSENT_COOKIE = 'pia_consent';

type Gtag = (...args: unknown[]) => void;
const gtag = (): Gtag | undefined => (typeof window !== 'undefined' ? (window as unknown as { gtag?: Gtag }).gtag : undefined);

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
  // Côté Google, seule la mesure d’audience suit le choix : les signaux publicitaires Google (ad_*) restent refusés,
  // aucune balise Google Ads n’étant utilisée. La mesure publicitaire passe uniquement par le pixel Meta.
  gtag()?.('consent', 'update', { analytics_storage: value });
  if (value === 'granted') loadMetaPixel();
  else { metaAllowed = false; fbq()?.('consent', 'revoke'); clearTrackingCookies(); }
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
  if (typeof window === 'undefined' || metaAllowed) return;
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

/** Événement GA4 (ignoré tant que la balise n’est pas chargée), relayé au pixel Meta si le visiteur a accepté. */
export function track(event: string, params: Record<string, unknown> = {}) {
  gtag()?.('event', event, params);
  const meta = META_EVENTS[event];
  if (meta && metaAllowed) fbq()?.(meta[0], meta[1]);
}

/** Script placé dans le <head>, avant gtag.js : consentement refusé par défaut, puis choix mémorisé. */
export const CONSENT_DEFAULT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500 });
var m = /(?:^|;\\s*)pia_consent=(granted|denied)/.exec(document.cookie);
if (m) gtag('consent', 'update', { analytics_storage: m[1] });
gtag('js', new Date());
gtag('config', '${GA_ID}', { linker: { domains: ['permanenceia.com', 'app.permanenceia.com'] } });
`;

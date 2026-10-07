// Mesure d’audience (Google Analytics 4, sans Tag Manager) et consentement (Consent Mode v2).
// Rien n’est stocké chez le visiteur avant son accord : le mode consentement envoie seulement des signaux anonymes.

export const GA_ID = 'G-4W1B1W52PZ';

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
  // Seule la mesure d’audience suit le choix : aucun cookie publicitaire (ad_*) n’est jamais autorisé.
  gtag()?.('consent', 'update', { analytics_storage: value });
}

/** Événement GA4 (ignoré tant que la balise n’est pas chargée). */
export function track(event: string, params: Record<string, unknown> = {}) {
  gtag()?.('event', event, params);
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

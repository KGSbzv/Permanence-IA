// Provenance de la visite (audit des parcours du 9 oct. 2026, action 32) : UTM et site d’origine de la PREMIÈRE page
// vue, gardés en mémoire le temps de la visite. Le site change de page sans recharger (Next.js) : une personne arrivée
// par une publicité sur une page secteur ou sur /tarifs, puis passée par /essai-gratuit, /contact ou /demo, garde sa
// source jusqu’au formulaire et jusqu’à la création du compte (registerUrl). Avant, seuls les UTM de la page du
// formulaire étaient lus : la source était perdue dès la deuxième page.
// Rien n’est stocké dans le navigateur (ni cookie, ni stockage local, ni sessionStorage) : un rechargement complet
// repart de l’adresse de la page, comme avant. La page du formulaire (originPage, preuve de l’accord) ne change pas.

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
export type UtmKey = (typeof UTM_KEYS)[number];
export type Utm = Partial<Record<UtmKey, string>>;

export interface Landing {
  /** Chemin de la page d’arrivée (sans requête). */
  page: string;
  /** UTM de la page d’arrivée (vide s’il n’y en avait pas). */
  utm: Utm;
  /** Site d’où vient la personne (origine et chemin, sans requête), absent s’il s’agit du site lui-même. */
  referrer?: string;
}

/** Adresse lue : window.location en vrai, un objet simple dans les tests. */
export interface LocationLike { pathname: string; search: string; host: string }

/** UTM d’une requête « ?utm_source=… » (valeurs non vides, 100 caractères au plus). */
export function utmOf(search: string): Utm {
  const q = new URLSearchParams(search);
  const out: Utm = {};
  for (const k of UTM_KEYS) {
    const v = q.get(k)?.trim();
    if (v) out[k] = v.slice(0, 100);
  }
  return out;
}

/** Site d’origine (origine et chemin, sans requête ni fragment) ; rien pour le site lui-même ou un référent illisible. */
export function externalReferrer(referrer: string, host: string): string | undefined {
  try {
    const r = new URL(referrer);
    return r.host !== host && /^https?:$/.test(r.protocol) ? `${r.origin}${r.pathname}` : undefined;
  } catch { return undefined; }
}

let landing: Landing | null = null;

/**
 * Mémorise la page d’arrivée, une seule fois par visite (chargement du script du site) ; renvoie ensuite celle déjà
 * mémorisée. Sans navigateur (rendu serveur) et sans adresse fournie : null.
 */
export function captureLanding(loc?: LocationLike, referrer?: string): Landing | null {
  if (landing) return landing;
  if (!loc && typeof window === 'undefined') return null;
  const l = loc ?? window.location;
  const ref = referrer ?? (typeof document !== 'undefined' ? document.referrer : '');
  landing = { page: l.pathname, utm: utmOf(l.search), referrer: externalReferrer(ref, l.host) };
  return landing;
}

/** Oublie la page d’arrivée (tests uniquement). */
export function resetLanding() { landing = null; }

/** UTM de la page affichée si elle en a, sinon ceux de la page d’arrivée de la visite. */
export function visitUtm(search: string): Utm {
  const here = utmOf(search);
  return Object.keys(here).length ? here : { ...(captureLanding()?.utm ?? {}) };
}

/** Requête « utm_source=…&… » de la visite, pour la création du compte (registerUrl de src/data/site.ts). */
export const visitSearch = (search: string) => new URLSearchParams(visitUtm(search) as Record<string, string>).toString();

/**
 * Provenance jointe aux formulaires (src/components/ui.tsx, landingContext) : page du formulaire, site d’origine
 * (celui de la page affichée, sinon celui de l’arrivée) et UTM de la visite. Mêmes champs qu’avant (originPage,
 * referrer, utm { source, medium, campaign }) : rien ne change côté serveur (src/lib/contacts.ts, captureMeta).
 */
export function visitContext(loc: LocationLike, referrer: string) {
  const first = captureLanding(loc, referrer);
  const q = visitUtm(loc.search);
  const utm = { source: q.utm_source, medium: q.utm_medium, campaign: q.utm_campaign };
  return {
    originPage: loc.pathname,
    referrer: externalReferrer(referrer, loc.host) ?? first?.referrer,
    ...(utm.source || utm.medium || utm.campaign ? { utm } : {}),
  };
}

// Page d’arrivée lue dès le chargement du script, avant tout changement de page.
if (typeof window !== 'undefined') captureLanding();

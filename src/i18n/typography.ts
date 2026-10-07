// Typographie française : espaces insécables devant ; ! ? (fine, U+202F), devant : et % (U+00A0), et à l’intérieur
// des guillemets « ». Appliquée une fois à tout le contenu français (textes et fonctions qui renvoient du texte),
// pour éviter qu’un « ? » ou un « : » ne passe seul à la ligne.

const NNBSP = ' ';
const NBSP = ' ';

export function frenchSpaces(s: string): string {
  return s
    .replace(/ ([;!?])/g, `${NNBSP}$1`)
    .replace(/ :(?=\s|$)/g, `${NBSP}:`)
    .replace(/« /g, `«${NBSP}`)
    .replace(/ »/g, `${NBSP}»`)
    .replace(/(\d) %/g, `$1${NBSP}%`);
}

/** Copie profonde du contenu avec la typographie appliquée ; les fonctions sont enveloppées. */
export function withFrenchTypography<T>(value: T): T {
  if (typeof value === 'string') return frenchSpaces(value) as unknown as T;
  if (typeof value === 'function') {
    const fn = value as unknown as (...args: unknown[]) => unknown;
    return ((...args: unknown[]) => withFrenchTypography(fn(...args))) as unknown as T;
  }
  if (Array.isArray(value)) return value.map((v) => withFrenchTypography(v)) as unknown as T;
  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, k === 'href' || k === 'slug' ? v : withFrenchTypography(v)])) as T;
  }
  return value;
}

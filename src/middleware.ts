// 1. Domaine nu → www : derrière App Hosting, l’hôte d’origine arrive dans x-forwarded-host.
// 2. Langue : à la première visite d’une page sans préfixe de langue, redirige vers la langue du navigateur.
//    Le choix fait avec le sélecteur de langue (cookie NEXT_LOCALE) est toujours respecté.
import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LOCALE, detectLocale, isLocale } from '@/i18n/locales';

const BOT = /bot|crawler|spider|slurp|facebookexternalhit|embedly|preview/i;

export function middleware(req: NextRequest) {
  const host = (req.headers.get('x-forwarded-host') || req.headers.get('host') || '').split(':')[0];
  if (host === 'permanenceia.com') {
    // Chemin assigné sur une origine fixe : un chemin « //autre-site » ne peut pas changer de domaine.
    const url = new URL('https://www.permanenceia.com');
    const prefix = req.nextUrl.locale && req.nextUrl.locale !== DEFAULT_LOCALE ? `/${req.nextUrl.locale}` : '';
    // « /he » et non « /he/ » (sinon une seconde redirection) ; la racine française reste « / ».
    const path = req.nextUrl.pathname.replace(/^\/+/, '');
    url.pathname = prefix ? `${prefix}${path ? `/${path}` : ''}` : `/${path}`;
    url.search = req.nextUrl.search;
    return NextResponse.redirect(url, 301);
  }

  // Seules les pages sans préfixe (donc en français) sont concernées.
  // Seule une vraie navigation de navigateur (en-tête Sec-Fetch-Dest: document) est redirigée selon la langue :
  // les robots (Google, Autocalls qui lit les pages pour les bases de connaissances, aperçus de liens) et les outils
  // reçoivent toujours la page demandée, dans la langue de l’URL.
  // Les lectures des bases de connaissances Autocalls (?kb=… dans l’URL) ne sont jamais redirigées : leur navigateur
  // sans interface envoie Sec-Fetch-Dest et un user-agent réécrit en « Google » par l’hébergeur, et indexait l’anglais.
  if (req.nextUrl.searchParams.has('kb')) return NextResponse.next();
  const browserNavigation = req.headers.get('sec-fetch-dest') === 'document';
  if (req.nextUrl.locale !== DEFAULT_LOCALE || !browserNavigation || BOT.test(req.headers.get('user-agent') || '')) return NextResponse.next();
  const saved = req.cookies.get('NEXT_LOCALE')?.value;
  const target = isLocale(saved) ? saved : detectLocale(req.headers.get('accept-language'));
  if (target === DEFAULT_LOCALE) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.locale = target;
  return NextResponse.redirect(url, 307);
}

// Pages uniquement : ni API, ni fichiers statiques.
// La racine « / » est listée à part : avec l’i18n, le motif générique ne l’attrape pas.
export const config = { matcher: ['/', '/((?!api|kb|_next/static|_next/image|.*\\..*).*)'] };

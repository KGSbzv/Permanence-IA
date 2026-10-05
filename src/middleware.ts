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
    url.pathname = '/' + req.nextUrl.pathname.replace(/^\/+/, '');
    url.search = req.nextUrl.search;
    return NextResponse.redirect(url, 301);
  }

  // Seules les pages sans préfixe (donc en français) sont concernées ; les robots gardent l’URL demandée.
  if (req.nextUrl.locale !== DEFAULT_LOCALE || BOT.test(req.headers.get('user-agent') || '')) return NextResponse.next();
  const saved = req.cookies.get('NEXT_LOCALE')?.value;
  const target = isLocale(saved) ? saved : detectLocale(req.headers.get('accept-language'));
  if (target === DEFAULT_LOCALE) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.locale = target;
  return NextResponse.redirect(url, 307);
}

// Pages uniquement : ni API, ni fichiers statiques.
export const config = { matcher: '/((?!api|_next/static|_next/image|.*\\..*).*)' };

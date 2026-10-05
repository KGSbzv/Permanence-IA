// Domaine nu → www : derrière App Hosting, l’hôte d’origine arrive dans x-forwarded-host.
import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const host = (req.headers.get('x-forwarded-host') || req.headers.get('host') || '').split(':')[0];
  if (host !== 'permanenceia.com') return NextResponse.next();
  // Chemin assigné sur une origine fixe : un chemin « //autre-site » ne peut pas changer de domaine.
  const url = new URL('https://www.permanenceia.com');
  url.pathname = '/' + req.nextUrl.pathname.replace(/^\/+/, '');
  url.search = req.nextUrl.search;
  return NextResponse.redirect(url, 301);
}

export const config = { matcher: '/((?!_next/static|_next/image).*)' };

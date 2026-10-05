// Domaine nu → www : derrière App Hosting, l’hôte d’origine arrive dans x-forwarded-host.
import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const host = (req.headers.get('x-forwarded-host') || req.headers.get('host') || '').split(':')[0];
  if (host !== 'permanenceia.com') return NextResponse.next();
  const url = new URL(req.nextUrl.pathname + req.nextUrl.search, 'https://www.permanenceia.com');
  return NextResponse.redirect(url, 301);
}

export const config = { matcher: '/((?!_next/static|_next/image).*)' };

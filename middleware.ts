import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Update Supabase Session & Enforce Auth
  const { response, user } = await updateSession(request);

  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  const isProduction = process.env.NODE_ENV === 'production';
  const appDomain = isProduction ? 'app.stubgram.com' : 'app.localhost:3000';
  const mainDomain = isProduction ? 'stubgram.com' : 'localhost:3000';

  const isApp = hostname === appDomain;

  // APP SUBDOMAIN LOGIC
  if (isApp) {
    // If unauthenticated, redirect to login on main marketing domain
    if (!user) {
      const protocol = isProduction ? 'https' : 'http';
      return NextResponse.redirect(`${protocol}://${mainDomain}/login`);
    }

    // Default root of app subdomain goes to feed
    if (url.pathname === '/') {
      return NextResponse.rewrite(new URL('/feed', request.url), {
        headers: response.headers,
      });
    }

    // Allow requests to pass through to /feed, /profile, /settings, etc.
    return response;
  }

  // MARKETING DOMAIN LOGIC
  // If authenticated and hits login, send to app
  if (url.pathname === '/login' && user) {
    const protocol = isProduction ? 'https' : 'http';
    return NextResponse.redirect(`${protocol}://${appDomain}/feed`);
  }

  // Prevent marketing domain from accessing /feed, /profile directly (to ensure strict isolation)
  if (['/feed', '/profile', '/settings'].some(path => url.pathname.startsWith(path))) {
    return NextResponse.rewrite(new URL('/404', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

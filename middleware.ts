import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Update Supabase Session & Enforce Auth
  const { response: supabaseResponse, user } = await updateSession(request);

  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  const isProduction = process.env.NODE_ENV === 'production';
  const appDomain = isProduction ? 'app.stubgram.com' : 'app.localhost:3000';
  const mainDomain = isProduction ? 'stubgram.com' : 'localhost:3000';

  const isApp = hostname === appDomain;

  // Helper to copy cookies from supabaseResponse to a new response
  const copyCookies = (newResponse: NextResponse) => {
    supabaseResponse.headers.getSetCookie().forEach(cookie => {
      newResponse.headers.append('Set-Cookie', cookie);
    });
    return newResponse;
  };

  // APP SUBDOMAIN LOGIC
  if (isApp) {
    // If unauthenticated, redirect to signup on main marketing domain
    if (!user) {
      const protocol = isProduction ? 'https' : 'http';
      // If we are redirecting from the app subdomain to the main domain, ensure no loop happens.
      // Next.js NextResponse.redirect needs an absolute URL object here to prevent relative loopbacks 
      // on same-origin localhosts.
      const redirectResponse = NextResponse.redirect(new URL(`/?signup=true`, `${protocol}://${mainDomain}`));
      return copyCookies(redirectResponse);
    }

    // Default root of app subdomain goes to feed
    if (url.pathname === '/') {
      const rewriteResponse = NextResponse.rewrite(new URL('/feed', request.url), {
        headers: supabaseResponse.headers,
      });
      return copyCookies(rewriteResponse);
    }

    // Allow requests to pass through to /feed, /profile, /settings, etc.
    return supabaseResponse;
  }

  // MARKETING DOMAIN LOGIC
  // If authenticated and hits login, send to app
  if (url.pathname === '/login' && user) {
    const protocol = isProduction ? 'https' : 'http';
    const redirectResponse = NextResponse.redirect(`${protocol}://${appDomain}/feed`);
    return copyCookies(redirectResponse);
  }

  // Prevent marketing domain from accessing /feed, /profile directly (to ensure strict isolation)
  if (['/feed', '/profile', '/settings'].some(path => url.pathname.startsWith(path))) {
    const rewriteResponse = NextResponse.rewrite(new URL('/404', request.url));
    return copyCookies(rewriteResponse);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

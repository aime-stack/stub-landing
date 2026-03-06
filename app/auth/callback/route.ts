import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as string | null;
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/feed';

  const isProduction = process.env.NODE_ENV === 'production';
  const mainHost = isProduction ? 'https://stubgram.com' : 'http://localhost:3000';

  let success = false;
  let errorMsg = 'Invalid verification link';

  const supabase = await createClient();

  // Handle standard PKCE code exchange flow
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      success = true;
    } else {
      errorMsg = error.message;
      console.error('[Auth Callback] exchangeCodeForSession Error:', error.message);
    }
  } 
  // Custom fallback: Handle raw token_hash processing if the user's email template wasn't updated
  else if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    });
    if (!error) {
      success = true;
    } else {
      errorMsg = error.message;
      console.error('[Auth Callback] verifyOtp Error:', error.message);
    }
  }

  if (success) {
    // Redirect successfully verified users back to login so they can authenticate
    return NextResponse.redirect(`${mainHost}/login?verified=true`);
  }

  // If there's an error or missing token/type, redirect to a generic error page
  return NextResponse.redirect(`${mainHost}/login?error=${encodeURIComponent(errorMsg)}`);
}

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as string | null;
  const next = searchParams.get('next') ?? '/feed';

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    });

    if (!error) {
      const isProduction = process.env.NODE_ENV === 'production';
      const appHost = isProduction ? 'https://app.stubgram.com' : 'http://localhost:3000';
      // Redirect successfully verified users to the app dashboard
      return NextResponse.redirect(`${appHost}${next}`);
    } else {
      console.error('[Auth Callback] verifyOtp Error:', error.message);
    }
  }

  // If there's an error or missing token/type, redirect to a generic error page
  // We can pass an error message to display to the user
  const mainHost = process.env.NODE_ENV === 'production' ? 'https://stubgram.com' : 'http://localhost:3000';
  return NextResponse.redirect(`${mainHost}/login?error=Invalid+or+expired+verification+link`);
}

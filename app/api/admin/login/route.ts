import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const ADMIN_USER = process.env.ADMIN_USER;
    const ADMIN_PASS = process.env.ADMIN_PASS;

    if (!ADMIN_USER || !ADMIN_PASS) {
      console.error('Admin credentials not configured in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      // Set an admin cookie
      // In production, this should be a signed JWT or similar session token
      const cookieStore = await cookies();
      cookieStore.set('admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return NextResponse.json({ success: true, message: 'Logged in successfully' });
    }

    return NextResponse.json(
      { error: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

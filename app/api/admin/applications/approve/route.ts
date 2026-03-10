import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

// Setup admin service role client to bypass RLS and update user profiles
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('admin_session')?.value === 'true';

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, type, status, userId } = await req.json();

    if (!id || !type || !status || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Determine which application table to update
    let appTable = '';
    if (type === 'teacher') appTable = 'teacher_applications';
    else if (type === 'celebrity') appTable = 'celebrity_applications';
    else if (type === 'company') appTable = 'company_applications';
    else return NextResponse.json({ error: 'Invalid application type' }, { status: 400 });

    // 2. Update the application status
    const { error: appError } = await supabaseAdmin
      .from(appTable)
      .update({ status })
      .eq('id', id);

    if (appError) {
      console.error('[AdminAPI] Failed to update application:', appError);
      return NextResponse.json({ error: 'Database error updating application' }, { status: 500 });
    }

    // 3. If approved, functionally upgrade the user's role/verification
    if (status === 'approved') {
      let profileUpdates: any = {};

      if (type === 'teacher') {
        profileUpdates.is_verified = true;
      } else if (type === 'celebrity') {
        profileUpdates.is_celebrity = true;
        profileUpdates.is_verified = true;
      } else if (type === 'company') {
        profileUpdates.account_type = 'industry';
        profileUpdates.is_verified = true;
      }

      // We update the 'profiles' or 'users' equivalent. Usually, it's public.users mapped to auth.users in your schema
      const { error: profileError } = await supabaseAdmin
        .from('users')
        .update(profileUpdates)
        .eq('id', userId);

      if (profileError) {
        console.error('[AdminAPI] Failed to upgrade user profile:', profileError);
        return NextResponse.json({ error: 'Failed to upgrade user permissions' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error('[AdminAPI] Exception in application approval:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

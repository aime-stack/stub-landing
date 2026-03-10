import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('admin_session')?.value === 'true';

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    const { data, error } = await supabaseAdmin.rpc('get_admin_stats');

    if (error) {
      console.error('[AdminStatsAPI] Error calling get_admin_stats:', error);
      return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('[AdminStatsAPI] Exception:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

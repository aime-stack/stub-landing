import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { full_name, handle, category, bio } = body;

    if (!full_name || !handle || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase.from('celebrity_applications').insert({
      user_id: user.id,
      full_name,
      handle,
      category,
      bio,
      status: 'pending'
    }).select().single();

    if (error) throw error;

    return NextResponse.json({ success: true, application: data });
  } catch (error: any) {
    console.error('Celebrity application error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

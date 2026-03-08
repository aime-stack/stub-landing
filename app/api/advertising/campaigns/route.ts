import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('ad_campaigns')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ campaigns: data });
  } catch (error: any) {
    console.error('Fetch campaigns error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      name, objective, ad_type, headline, body_text, 
      cta, budget, start_date, end_date, target_audience 
    } = body;

    if (!name || !objective || !ad_type || !budget || !start_date || !end_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('ad_campaigns')
      .insert({
        user_id: user.id,
        name,
        objective,
        ad_type,
        headline,
        body: body_text,
        cta,
        budget,
        start_date,
        end_date,
        target_audience,
        status: 'reviewing'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, campaign: data });
  } catch (error: any) {
    console.error('Create campaign error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

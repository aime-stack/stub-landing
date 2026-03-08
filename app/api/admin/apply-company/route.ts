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
    const { company_name, industry, objective, budget_range, contact_email, website } = body;

    if (!company_name || !industry || !contact_email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase.from('company_applications').insert({
      user_id: user.id,
      company_name,
      industry,
      objective,
      budget_range,
      contact_email,
      website,
      status: 'pending'
    }).select().single();

    if (error) throw error;

    return NextResponse.json({ success: true, application: data });
  } catch (error: any) {
    console.error('Company application error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

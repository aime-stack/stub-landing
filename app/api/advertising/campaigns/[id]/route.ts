import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    // Only allow updating status and some details for now
    const { status, name, budget, end_date } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (name) updateData.name = name;
    if (budget) updateData.budget = budget;
    if (end_date) updateData.end_date = end_date;

    const { data, error } = await supabase
      .from('ad_campaigns')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user owns the campaign
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, campaign: data });
  } catch (error: any) {
    console.error('Update campaign error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

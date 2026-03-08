import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { full_name, expertise, bio, experience_years, social_link, sample_topic } = await req.json();

    if (!full_name || !expertise || !bio || !sample_topic) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if already has a pending or approved application
    const { data: existingApp } = await supabase
        .from('teacher_applications')
        .select('status')
        .eq('user_id', user.id)
        .in('status', ['pending', 'approved'])
        .maybeSingle();

    if (existingApp) {
        if (existingApp.status === 'approved') {
            return NextResponse.json({ error: 'You are already a teacher' }, { status: 400 });
        }
        return NextResponse.json({ error: 'You already have a pending application' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('teacher_applications')
        .insert({
            user_id: user.id,
            email: user.email,
            full_name,
            expertise,
            bio,
            experience_years: experience_years || 0,
            social_link,
            sample_topic,
            status: 'pending'
        })
        .select()
        .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error submitting teacher application:', error);
    return NextResponse.json({ error: 'Application submission failed' }, { status: 500 });
  }
}

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is a teacher
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_teacher')
      .eq('id', user.id)
      .single();

    if (!profile?.is_teacher) {
      return NextResponse.json({ error: 'Only teachers can create courses' }, { status: 403 });
    }

    const { title, description, category, duration, price, thumb_url } = await req.json();

    if (!title || !category || !duration || price === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const teacher_name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Teacher';

    const { data: course, error } = await supabase
      .from('courses')
      .insert({
        teacher_id: user.id,
        teacher_name,
        title,
        description,
        category,
        duration,
        price,
        thumb_url,
        status: 'published'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ course });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}

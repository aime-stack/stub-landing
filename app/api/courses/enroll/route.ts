import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Fetch course details
    const { data: course, error: courseErr } = await supabase
      .from('courses')
      .select('id, price, title')
      .eq('id', courseId)
      .single();

    if (courseErr || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Fetch user profile for balance
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('coins')
      .eq('id', user.id)
      .single();

    if (profileErr || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    if (profile.coins < course.price) {
      return NextResponse.json({ error: 'Insufficient Stubcoins balance' }, { status: 400 });
    }

    // Check if already enrolled
    const { data: existingEnrollment } = await supabase
      .from('course_enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single();

    if (existingEnrollment) {
      return NextResponse.json({ error: 'Already enrolled in this course' }, { status: 400 });
    }

    // Use RPC if available for atomic transaction, or manual update
    // For now, simple sequential update (in production, use a DB function/transaction)
    
    // 1. Deduct coins
    const { error: deductErr } = await supabase
      .from('profiles')
      .update({ coins: profile.coins - course.price })
      .eq('id', user.id);

    if (deductErr) throw deductErr;

    // 2. Create enrollment record
    const { data: enrollment, error: enrollErr } = await supabase
      .from('course_enrollments')
      .insert({
        user_id: user.id,
        course_id: courseId
      })
      .select()
      .single();

    if (enrollErr) {
        // Rollback coins if possible (simplified here)
        await supabase
          .from('profiles')
          .update({ coins: profile.coins })
          .eq('id', user.id);
        throw enrollErr;
    }

    return NextResponse.json({ success: true, enrollment });
  } catch (error) {
    console.error('Error during enrollment:', error);
    return NextResponse.json({ error: 'Enrollment failed' }, { status: 500 });
  }
}

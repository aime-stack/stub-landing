import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  
  try {
    const { meetingId, userIds, via } = await req.json();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real app, this would send emails/SMS via Resend/Twilio
    // For now, we simulate success
    console.log(`Sending meeting ${meetingId} invites to ${userIds.length} users via ${via}`);

    return NextResponse.json({ success: true, message: 'Invites sent' });
  } catch (error) {
    console.error('Invite error:', error);
    return NextResponse.json({ error: 'Failed to send invites' }, { status: 500 });
  }
}

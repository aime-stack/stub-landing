import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const supabase = await createClient();
  
  try {
    const { data: meetings, error } = await supabase
      .from('meetings')
      .select('*')
      .order('scheduled_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json(meetings);
  } catch (error) {
    console.error('Fetch meetings error:', error);
    return NextResponse.json({ error: 'Failed to fetch meetings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  
  try {
    const { title, scheduledAt, isLive } = await req.json();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const roomName = `room-${uuidv4().slice(0, 8)}`;

    const { data, error } = await supabase
      .from('meetings')
      .insert({
        title,
        host_id: user.id,
        scheduled_at: scheduledAt || new Date().toISOString(),
        is_live: isLive || false,
        room_name: roomName,
        status: isLive ? 'live' : 'scheduled'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Create meeting error:', error);
    return NextResponse.json({ error: 'Failed to create meeting' }, { status: 500 });
  }
}

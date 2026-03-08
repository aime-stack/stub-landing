-- Create meetings table
CREATE TABLE IF NOT EXISTS public.meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    host_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMPTZ,
    is_live BOOLEAN DEFAULT false,
    room_name TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended'))
);

-- Create meeting_participants table
CREATE TABLE IF NOT EXISTS public.meeting_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(meeting_id, user_id)
);

-- Set up RLS for meetings
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view meetings" 
    ON public.meetings FOR SELECT 
    USING (true);

CREATE POLICY "Users can create meetings" 
    ON public.meetings FOR INSERT 
    WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their meetings" 
    ON public.meetings FOR UPDATE 
    USING (auth.uid() = host_id);

-- Set up RLS for meeting_participants
ALTER TABLE public.meeting_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view participants" 
    ON public.meeting_participants FOR SELECT 
    USING (true);

CREATE POLICY "Users can join meetings" 
    ON public.meeting_participants FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

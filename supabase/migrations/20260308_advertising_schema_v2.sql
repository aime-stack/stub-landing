-- Create ad_campaigns table
CREATE TABLE IF NOT EXISTS public.ad_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'reviewing' CHECK (status IN ('active', 'paused', 'ended', 'reviewing')),
    objective TEXT NOT NULL,
    ad_type TEXT NOT NULL,
    headline TEXT,
    body TEXT,
    cta TEXT,
    budget INTEGER NOT NULL,
    spent INTEGER NOT NULL DEFAULT 0,
    impressions INTEGER NOT NULL DEFAULT 0,
    clicks INTEGER NOT NULL DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    target_audience TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own advertising campaigns" ON public.ad_campaigns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own advertising campaigns" ON public.ad_campaigns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own advertising campaigns" ON public.ad_campaigns FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own advertising campaigns" ON public.ad_campaigns FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS ad_campaigns_user_id_idx ON public.ad_campaigns(user_id);
CREATE INDEX IF NOT EXISTS ad_campaigns_status_idx ON public.ad_campaigns(status);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ad_campaigns_updated_at
    BEFORE UPDATE ON public.ad_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create celebrity_applications table
CREATE TABLE IF NOT EXISTS public.celebrity_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    handle TEXT NOT NULL,
    category TEXT NOT NULL,
    bio TEXT,
    social_links JSONB DEFAULT '[]',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    applied_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create company_applications table
CREATE TABLE IF NOT EXISTS public.company_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    website TEXT,
    industry TEXT NOT NULL,
    objective TEXT,
    budget_range TEXT,
    contact_email TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    applied_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.celebrity_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_applications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can create celebrity applications" ON public.celebrity_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own celebrity applications" ON public.celebrity_applications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create company applications" ON public.company_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own company applications" ON public.company_applications FOR SELECT USING (auth.uid() = user_id);

-- Admin indexes
CREATE INDEX IF NOT EXISTS celebrity_apps_status_idx ON public.celebrity_applications(status);
CREATE INDEX IF NOT EXISTS company_apps_status_idx ON public.company_applications(status);

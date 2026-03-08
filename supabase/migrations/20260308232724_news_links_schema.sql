-- Create news_links table
CREATE TABLE IF NOT EXISTS public.news_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL UNIQUE,
    title TEXT,
    description TEXT,
    image_url TEXT,
    source TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add read policy for public
ALTER TABLE public.news_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to news_links" 
    ON public.news_links 
    FOR SELECT 
    USING (true);

-- Allow authenticated users to insert (used indirectly via Edge Function/Next API)
CREATE POLICY "Allow authenticated insert to news_links" 
    ON public.news_links 
    FOR INSERT 
    TO authenticated
    WITH CHECK (true);

-- Add news_link_id to posts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS news_link_id UUID REFERENCES public.news_links(id) ON DELETE SET NULL;

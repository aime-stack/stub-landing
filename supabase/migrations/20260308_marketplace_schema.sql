-- Enable pg_trgm extension for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price BIGINT NOT NULL,
    category TEXT NOT NULL,
    image_urls TEXT[] DEFAULT '{}',
    phone TEXT,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure image_urls column exists (in case table was created previously without it)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='image_urls') THEN
        ALTER TABLE public.products ADD COLUMN image_urls TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policies for products table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Products are viewable by everyone' AND tablename = 'products') THEN
        CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create their own products' AND tablename = 'products') THEN
        CREATE POLICY "Users can create their own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = seller_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own products' AND tablename = 'products') THEN
        CREATE POLICY "Users can update their own products" ON public.products FOR UPDATE USING (auth.uid() = seller_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own products' AND tablename = 'products') THEN
        CREATE POLICY "Users can delete their own products" ON public.products FOR DELETE USING (auth.uid() = seller_id);
    END IF;
END $$;

-- Indexes for search performance
CREATE INDEX IF NOT EXISTS products_category_idx ON public.products(category);
CREATE INDEX IF NOT EXISTS products_title_trgm_idx ON public.products USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON public.products(created_at DESC);

-- Register marketplace bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('marketplace', 'marketplace', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for marketplace bucket
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'marketplace');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can upload' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'marketplace' AND auth.role() = 'authenticated');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own files' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Users can delete their own files" ON storage.objects FOR DELETE USING (bucket_id = 'marketplace' AND auth.uid() = owner);
    END IF;
END $$;

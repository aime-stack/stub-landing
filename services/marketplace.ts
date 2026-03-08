import { createClient } from '@/lib/supabase/server';

export interface ProductCreateInput {
  title: string;
  description?: string;
  price: number;
  category: string;
  image_urls?: string[];
  phone?: string;
  location?: string;
}

export async function createProduct(data: ProductCreateInput) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: product, error } = await supabase
    .from('products')
    .insert([{
      ...data,
      seller_id: user.id
    }])
    .select()
    .single();

  if (error) throw error;
  return product;
}

export async function searchProducts(query?: string, category?: string) {
  const supabase = await createClient();
  
  let q = supabase
    .from('products')
    .select(`
      *,
      seller:profiles!seller_id(username, full_name, avatar_url)
    `)
    .order('created_at', { ascending: false });

  if (category && category !== 'All') {
    q = q.eq('category', category);
  }

  if (query) {
    q = q.ilike('title', `%${query}%`);
  }

  const { data, error } = await q;

  if (error) throw error;
  return data;
}

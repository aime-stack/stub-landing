'use server';

import { createClient } from '@/lib/supabase/server';

export async function createCommunity(params: {
  name: string;
  description: string;
  category: string;
  privacy: 'public' | 'private';
  banner_url?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('communities')
    .insert({
      name: params.name,
      description: params.description,
      category: params.category,
      privacy: params.privacy,
      banner_url: params.banner_url || null,
      created_by: user.id
    })
    .select('*')
    .single();

  if (error) {
    console.error('[Services:Communities] Error creating community:', error);
    // don't fail hard if relation doesn't exist yet for frontend testing
    if (error.code !== '42P01') {
      throw error;
    }
  }

  // Join the author to the community
  if (data) {
    try {
      await supabase.from('community_members').insert({
        community_id: data.id,
        user_id: user.id,
        role: 'admin'
      });
    } catch (e) {
      console.warn(e);
    }
  }

  return data;
}

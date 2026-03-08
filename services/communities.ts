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
      // category: params.category, // Category is not in the schema
      is_private: params.privacy === 'private',
      cover_image: params.banner_url || null,
      creator_id: user.id
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

export async function getDiscoverCommunities() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch all public communities (or just top 50 for now)
  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .eq('is_private', false)
    .order('created_at', { ascending: false })
    .limit(50);
    
  if (error && error.code !== '42P01') {
    console.error('[Services:Communities] Error fetching communities:', error);
  }

  return data || [];
}

export async function getUserCommunities() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  // Fetch user's joined communities
  const { data, error } = await supabase
    .from('community_members')
    .select(`
      community_id,
      communities (*)
    `)
    .eq('user_id', user.id);
    
  if (error && error.code !== '42P01') {
    console.error('[Services:Communities] Error fetching user communities:', error);
  }

  // extract communities from the joined data
  const userComms = (data || [])
    .map(member => member.communities)
    .filter(Boolean);

  return userComms;
}

export async function joinCommunity(communityId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const { error } = await supabase.from('community_members').insert({
    community_id: communityId,
    user_id: user.id,
    role: 'member'
  });

  if (error) {
    console.error('[Services:Communities] Error joining community:', error);
    throw error;
  }
  return true;
}

export async function leaveCommunity(communityId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const { error } = await supabase
    .from('community_members')
    .delete()
    .eq('community_id', communityId)
    .eq('user_id', user.id);

  if (error) {
    console.error('[Services:Communities] Error leaving community:', error);
    throw error;
  }
  return true;
}

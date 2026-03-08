'use server';

import { createClient } from '@/lib/supabase/server';
import { Story } from '@/types';

export async function getStories() {
  const supabase = await createClient();

  // Fetch stories that are not expired.
  // We'll trust the database's handling of TIMESTAMPTZ, but explicitly ensuring expires_at > now().
  const { data, error } = await supabase
    .from('stories')
    .select(`
      id,
      user_id,
      media_url,
      type,
      caption,
      created_at,
      expires_at,
      user:user_id (
        id, username, full_name, avatar_url, is_verified, account_type
      )
    `)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Services:Stories] Error fetching stories:', error);
    // Return empty state rather than crash
    return [];
  }

  // Handle one-to-one join mapping
  const formattedData = (data as any[]).map(d => ({
    ...d,
    user: Array.isArray(d.user) ? d.user[0] : d.user
  }));

  return formattedData as Story[];
}

export async function createStory(params: {
  mediaUrl: string;
  type: 'image' | 'video';
  caption?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  // Stories expire in 24 hours
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  const { data, error } = await supabase
    .from('stories')
    .insert({
      user_id: user.id,
      media_url: params.mediaUrl,
      type: params.type,
      caption: params.caption,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('[Services:Stories] Error creating story:', error);
    return { error: error.message };
  }

  return data;
}

export async function markStoryAsViewed(storyId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return; // Silent return for unauthenticated

  // Insert into story_views if it exists. Ignore duplicates.
  const { error } = await supabase
    .from('story_views')
    .insert({
      story_id: storyId,
      user_id: user.id,
    });

  if (error && error.code !== '23505' && error.code !== '42P01') {
    console.error('[Services:Stories] Error marking story viewed:', error);
  }
}

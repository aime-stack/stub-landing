'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Like / Unlike
 */
export async function likePost(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('post_likes')
    .insert({ post_id: postId, user_id: user.id });

  // Ignore duplicate like errors (already liked)
  if (error && error.code !== '23505') {
    console.error('[Interactions] likePost error', error);
    throw error;
  }
}

export async function unlikePost(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('post_likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', user.id);

  if (error) {
    console.error('[Interactions] unlikePost error', error);
    throw error;
  }
}

/**
 * Bookmarks
 */
export async function bookmarkPost(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('bookmarks')
    .insert({ post_id: postId, user_id: user.id });

  if (error && error.code !== '23505') {
    console.error('[Interactions] bookmarkPost error', error);
    throw error;
  }
}

export async function unbookmarkPost(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', user.id);

  if (error) {
    console.error('[Interactions] unbookmarkPost error', error);
    throw error;
  }
}

/**
 * Reshares
 */
export async function resharePost(postId: string, quote?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase.from('posts').insert({
    user_id: user.id,
    type: 'reshare',
    content: quote ?? null,
    reshared_from: postId,
  });

  if (error) {
    console.error('[Interactions] resharePost error', error);
    throw error;
  }
}

/**
 * Comments
 */
export async function getComments(postId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      users:user_id (
        id, username, full_name, avatar_url, is_verified, is_celebrity
      )
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[Interactions] getComments error', error);
    throw new Error('Failed to fetch comments');
  }

  return data;
}

export async function createComment(postId: string, content: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      user_id: user.id,
      content,
    })
    .select()
    .single();

  if (error) {
    console.error('[Interactions] createComment error', error);
    throw new Error('Failed to create comment');
  }

  return data;
}

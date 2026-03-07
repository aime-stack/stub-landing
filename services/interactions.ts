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

  // Fallback counter increment (in case RPC isn't built yet)
  if (!error) {
    const { data: post } = await supabase.from('posts').select('likes_count').eq('id', postId).single();
    if (post) {
      await supabase.from('posts').update({ likes_count: (post.likes_count || 0) + 1 }).eq('id', postId);
    }
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

  // Fallback counter decrement
  if (!error) {
    const { data: post } = await supabase.from('posts').select('likes_count').eq('id', postId).single();
    if (post) {
      await supabase.from('posts').update({ likes_count: Math.max(0, (post.likes_count || 0) - 1) }).eq('id', postId);
    }
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

  // Update original post shares_count
  if (!error) {
    const { data: originalPost } = await supabase.from('posts').select('shares_count').eq('id', postId).single();
    if (originalPost) {
      await supabase.from('posts').update({ shares_count: (originalPost.shares_count || 0) + 1 }).eq('id', postId);
    }
  }
}

/**
 * External Shares (increment shares_count without making a Reshare post)
 */
export async function sharePostExternally(postId: string) {
  const supabase = await createClient();
  const { data: post } = await supabase.from('posts').select('shares_count').eq('id', postId).single();
  if (post) {
    const { error } = await supabase.from('posts').update({ shares_count: (post.shares_count || 0) + 1 }).eq('id', postId);
    if (error) console.error('[Interactions] sharePostExternally error', error);
  }
}

/**
 * Views
 */
export async function viewPost(postId: string) {
  const supabase = await createClient();
  // We skip strict auth for views (allow anonymous views if needed)
  const { data: post } = await supabase.from('posts').select('views_count').eq('id', postId).single();
  if (post) {
    const { error } = await supabase.from('posts').update({ views_count: (post.views_count || 0) + 1 }).eq('id', postId);
    if (error) console.error('[Interactions] viewPost error', error);
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

  // Increment comments count on post
  const { data: post } = await supabase.from('posts').select('comments_count').eq('id', postId).single();
  if (post) {
    await supabase.from('posts').update({ comments_count: (post.comments_count || 0) + 1 }).eq('id', postId);
  }

  return data;
}

/**
 * Moderation
 */
export async function deletePost(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', user.id); // Only owner can delete

  if (error) {
    console.error('[Interactions] deletePost error', error);
    throw error;
  }
}

export async function reportPost(postId: string, reason: string = 'Inappropriate content') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // We try inserting into 'post_reports', if not exist we fail gracefully
  const { error } = await supabase
    .from('post_reports')
    .insert({ post_id: postId, user_id: user.id, reason });

  if (error && error.code !== '42P01') { // Ignore "relation does not exist"
    console.error('[Interactions] reportPost error', error);
  }
}

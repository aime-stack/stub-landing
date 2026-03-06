'use server';

import { createClient } from '@/lib/supabase/server';
import { Post, PaginatedFeed } from '@/types';
import { z } from 'zod';

// Define strict validation schemas
export const FeedQuerySchema = z.object({
  cursor: z.string().datetime().optional().nullable(),
  limit: z.number().min(1).max(50).default(20),
});

export const CreatePostSchema = z.object({
  content: z.string().max(2000).optional(),
  type: z.enum(['text', 'image', 'video', 'link']),
  mediaUrl: z.string().url().optional(),
});

/**
 * Fetch feed with cursor pagination (created_at < cursor)
 * Mirrors the exact mobile codebase query pattern for fetching the global feed.
 */
export async function getFeed(params: z.infer<typeof FeedQuerySchema>): Promise<PaginatedFeed> {
  const { cursor } = params;
  const limit = params.limit || 20;

  const supabase = await createClient();

  // Query: Select all posts, inner join profiles 
  // Mirrors: .is('community_id', null).order('created_at', { ascending: false })
  let query = supabase
    .from('posts')
    .select(`
      *,
      users:user_id (
        id, username, full_name, avatar_url, is_verified, is_celebrity
      )
    `)
    .is('community_id', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[Services:Posts] Error fetching feed:', error);
    throw new Error('Failed to fetch feed data');
  }

  const posts = data as Post[];
  const hasMore = posts.length === limit;
  const nextCursor = posts.length > 0 ? posts[posts.length - 1].created_at : null;

  return {
    data: posts,
    hasMore,
    nextCursor,
  };
}

/**
 * Handle server-side authenticated post creation
 * Mirrors the exact payload structure provided by the mobile schema guide.
 */
export async function createPost(rawInput: z.infer<typeof CreatePostSchema>) {
  const input = CreatePostSchema.parse(rawInput);
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Exact shape required by the backend schema mapping
  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      community_id: null,
      type: input.type,
      content: input.content,
      image_url: input.mediaUrl, // Mapping interface alias
    })
    .select('*')
    .single();

  if (error) {
    console.error('[Services:Posts] Error creating post:', error);
    throw new Error('Failed to create post');
  }

  return data;
}

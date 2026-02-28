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
 * Prevents N+1 by joining profiles in the same query.
 */
export async function getFeed(params: z.infer<typeof FeedQuerySchema>): Promise<PaginatedFeed> {
  // Validate input parameters
  const { cursor, limit } = FeedQuerySchema.parse(params);
  const supabase = await createClient();

  // Query: Select all posts, inner join profiles (usually 'users' or 'profiles' in Supabase)
  let query = supabase
    .from('posts')
    .select(`
      *,
      users:user_id (
        id, username, full_name, avatar, isVerified, isCelebrity
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  // Apply strict cursor pagination if cursor exists (offset is forbidden for performance)
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
 */
export async function createPost(rawInput: z.infer<typeof CreatePostSchema>) {
  const input = CreatePostSchema.parse(rawInput);
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      content: input.content,
      type: input.type,
      media_url: input.mediaUrl,
    })
    .select()
    .single();

  if (error) {
    console.error('[Services:Posts] Error creating post:', error);
    throw new Error('Failed to create post');
  }

  return data;
}

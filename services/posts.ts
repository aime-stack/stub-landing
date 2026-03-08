'use server';

import { createClient } from '@/lib/supabase/server';
import { Post, PaginatedFeed } from '@/types';
import { z } from 'zod';

// Define strict validation schemas
const FeedQuerySchema = z.object({
  cursor: z.string().datetime().optional().nullable(),
  limit: z.number().min(1).max(50).default(20),
});

/**
 * Core post creation input.
 *
 * Supports:
 * - status:   type = 'text'
 * - image:    type = 'image',   imageUrls[]
 * - video:    type = 'video',   videoUrl
 * - reel:     type = 'reel',    videoUrl
 * - link:     type = 'link'
 * - ad:       type = 'ad'
 * - community: any of the above + communityId
 */
const CreatePostSchema = z.object({
  content: z.string().max(2000).optional(),
  type: z.enum(['text', 'image', 'video', 'link', 'reel', 'ad']),
  communityId: z.string().uuid().optional().nullable(),
  imageUrls: z.array(z.string().url()).optional(),
  videoUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  textBg: z.string().optional(),
});

/**
 * Fetch feed with cursor pagination (created_at < cursor)
 * Global feed: only posts with community_id IS NULL.
 */
export async function getFeed(params: z.infer<typeof FeedQuerySchema>): Promise<PaginatedFeed> {
  const { cursor } = params;
  const limit = params.limit || 20;

  const supabase = await createClient();

  let query = supabase
    .from('posts')
    .select(
      `
      *,
      users:user_id (
        id, username, full_name, avatar_url, is_verified, is_celebrity
      )
    `
    )
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

export async function getReels(params: { cursor?: string | null; limit?: number }): Promise<PaginatedFeed> {
  const { cursor } = params;
  const limit = params.limit || 10;
  const supabase = await createClient();

  let query = supabase
    .from('posts')
    .select(`
      *,
      users:user_id (id, username, full_name, avatar_url, is_verified, is_celebrity)
    `)
    .eq('type', 'reel')
    .is('community_id', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (cursor) query = query.lt('created_at', cursor);

  const { data, error } = await query;
  if (error) {
    console.error('[Services:Posts] Error fetching reels:', error);
    throw new Error('Failed to fetch reels data');
  }

  const posts = data as Post[];
  return {
    data: posts,
    hasMore: posts.length === limit,
    nextCursor: posts.length > 0 ? posts[posts.length - 1].created_at : null,
  };
}

export async function getCommunityPosts(communityId: string, params: z.infer<typeof FeedQuerySchema>): Promise<PaginatedFeed> {
  const { cursor } = params;
  const limit = params.limit || 20;

  const supabase = await createClient();

  let query = supabase
    .from('posts')
    .select(
      `
      *,
      users:user_id (
        id, username, full_name, avatar_url, is_verified, is_celebrity
      )
    `
    )
    .eq('community_id', communityId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[Services:Posts] Error fetching community feed:', error);
    throw new Error('Failed to fetch community feed data');
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
 * Generic core post creator used by helpers below.
 */
export async function createPost(rawInput: z.infer<typeof CreatePostSchema>) {
  try {
    const input = CreatePostSchema.parse(rawInput);
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'Unauthorized' };
    }

    const primaryImage = input.imageUrls?.[0] ?? null;

    const insertPayload = Object.fromEntries(
      Object.entries({
        user_id: user.id,
        community_id: input.communityId,
        type: input.type,
        content: input.content,
        image_url: primaryImage,
        video_url: input.videoUrl,
        thumbnail_url: input.thumbnailUrl,
        media_urls: input.imageUrls,
        background_gradient: input.textBg ? [input.textBg] : undefined,
      }).filter(([_, v]) => v != null)
    );

    const { data, error } = await supabase
      .from('posts')
      .insert(insertPayload)
      .select('*')
      .single();

    if (error) {
      console.error('[Services:Posts] Error creating post:', error);
      return { error: error.message, details: error.details, hint: error.hint };
    }

    return data;
  } catch (e: any) {
    console.error('[Services:Posts] Exception inside createPost:', e);
    return { error: e.message || e.toString() };
  }
}

/**
 * Convenience helpers per post type
 */

export async function createStatusPost(content: string, communityId?: string | null, textBg?: string) {
  return createPost({
    type: 'text',
    content,
    communityId: communityId ?? null,
    textBg: textBg !== 'none' ? textBg : undefined,
  });
}

export async function createImagePost(params: {
  content?: string;
  imageUrls: string[];
  communityId?: string | null;
}) {
  return createPost({
    type: 'image',
    content: params.content,
    imageUrls: params.imageUrls,
    communityId: params.communityId ?? null,
  });
}

export async function createVideoPost(params: {
  content?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  communityId?: string | null;
}) {
  return createPost({
    type: 'video',
    content: params.content,
    videoUrl: params.videoUrl,
    thumbnailUrl: params.thumbnailUrl,
    communityId: params.communityId ?? null,
  });
}

export async function createReel(params: {
  content?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  communityId?: string | null;
}) {
  return createPost({
    type: 'reel',
    content: params.content,
    videoUrl: params.videoUrl,
    thumbnailUrl: params.thumbnailUrl,
    communityId: params.communityId ?? null,
  });
}

export async function createAdPost(params: {
  content: string;
  imageUrls?: string[];
  videoUrl?: string;
  thumbnailUrl?: string;
}) {
  return createPost({
    type: 'ad',
    content: params.content,
    imageUrls: params.imageUrls,
    videoUrl: params.videoUrl,
    thumbnailUrl: params.thumbnailUrl,
    communityId: null,
  });
}

export async function getBookmarkedPosts(params: { cursor?: string | null; limit?: number }) {
  const { cursor } = params;
  const limit = params.limit || 20;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  let query = supabase
    .from('bookmarks')
    .select(`
      created_at,
      posts (
        *,
        users:user_id (
          id, username, full_name, avatar_url, is_verified, is_celebrity
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[Services:Posts] Error fetching bookmarked posts:', error);
    throw new Error('Failed to fetch bookmarked posts');
  }

  const posts = (data as any[])
    .map(b => ({
      ...b.posts,
      // Pass the bookmark's created_at for cursor pagination if needed, or sort works ok
    }))
    .filter(p => p.id) as Post[];

  const hasMore = data.length === limit;
  const nextCursor = data.length > 0 ? data[data.length - 1].created_at : null;

  return {
    data: posts,
    hasMore,
    nextCursor,
  };
}

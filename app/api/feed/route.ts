import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { redis } from '@/lib/redis';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const communityId = searchParams.get('communityId');

    // 1. Check Redis Cache for global feed first page
    const isFirstPageGlobalFeed = !cursor && !communityId;
    const cacheKey = `feed:global:first_page:${limit}`;

    if (isFirstPageGlobalFeed && redis) {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        return NextResponse.json(cachedData);
      }
    }

    // 2. Query PostgreSQL with optimized minimal payload (Phase 9)
    const supabase = await createClient();

    let query = supabase
      .from('posts')
      .select(`
        id,
        content,
        type,
        image_url,
        video_url,
        thumbnail_url,
        media_urls,
        background_gradient,
        likes_count,
        comments_count,
        shares_count,
        created_at,
        users:user_id(id, username, full_name, avatar_url, is_verified, is_celebrity)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (communityId) {
      query = query.eq('community_id', communityId);
    } else {
      query = query.is('community_id', null);
    }

    if (cursor) {
      query = query.lt('created_at', cursor);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[API:Feed] Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 });
    }

    const posts = data || [];
    const hasMore = posts.length === limit;
    const nextCursor = posts.length > 0 ? posts[posts.length - 1].created_at : null;

    const responsePayload = {
      data: posts,
      hasMore,
      nextCursor
    };

    // 3. Set Cache (TTL 60 seconds)
    if (isFirstPageGlobalFeed && redis) {
      await redis.set(cacheKey, responsePayload, { ex: 60 });
    }

    return NextResponse.json(responsePayload);

  } catch (err: any) {
    console.error('[API:Feed] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

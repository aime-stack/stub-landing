import { NextRequest, NextResponse } from 'next/server';
import { getReels } from '@/services/posts';
import { redis } from '@/lib/redis';

const CACHE_KEY = 'reels:global';
const CACHE_TTL = 60; // 60 seconds

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get('cursor');

    // Only cache the first page (no cursor)
    const canCache = !cursor && redis;

    if (canCache && redis) {
      const cached = await redis.get(CACHE_KEY);
      if (cached) {
        console.log('[API:Reels] Cache Hit');
        return NextResponse.json(cached);
      }
    }

    console.log('[API:Reels] Cache Miss or Cursor Request');
    const result = await getReels({
      cursor: cursor || undefined,
      limit: 10,
    });

    if (canCache && redis) {
      await redis.set(CACHE_KEY, result, { ex: CACHE_TTL });
      console.log('[API:Reels] Cache Populated');
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API:Reels] Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { PostCard } from './PostCard';
import { PaginatedFeed, Post } from '@/types';
import { getFeed } from '@/services/posts';

interface InfiniteScrollFeedProps {
  initialFeed: PaginatedFeed;
}

export function InfiniteScrollFeed({ initialFeed }: InfiniteScrollFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialFeed.data);
  const [nextCursor, setNextCursor] = useState(initialFeed.nextCursor);
  const [hasMore, setHasMore] = useState(initialFeed.hasMore);
  const [loading, setLoading] = useState(false);
  
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !nextCursor) return;
    
    setLoading(true);
    try {
      const result = await getFeed({ cursor: nextCursor, limit: 20 });
      setPosts((prev) => [...prev, ...result.data]);
      setNextCursor(result.nextCursor);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Failed to load more posts', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, nextCursor]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="flex flex-col">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      
      {/* Intersection Observer Target */}
      <div 
        ref={observerTarget} 
        className="py-10 flex justify-center w-full"
      >
        {loading && (
          <div className="w-8 h-8 rounded-full border-2 border-[#0a7ea4] border-t-transparent animate-spin" />
        )}
        {!hasMore && posts.length > 0 && (
          <p className="text-gray-500 text-sm">You&apos;ve caught up!</p>
        )}
        {!hasMore && posts.length === 0 && (
          <p className="text-gray-500 text-sm">No posts yet. Be the first to share!</p>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { PostCard } from './PostCard';
import { Post } from '@/types';
import { getMockFeed } from '@/services/mockData';

interface InfiniteScrollFeedProps {
  initialPosts: Post[];
}

export function InfiniteScrollFeed({ initialPosts }: InfiniteScrollFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialPosts.length > 0 ? initialPosts[initialPosts.length - 1].id : null,
  );
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    if (loading || !hasMore || !nextCursor) return;

    setLoading(true);
    // Simulate async fetch delay with mock data
    setTimeout(() => {
      const result = getMockFeed(nextCursor, 3);
      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newPosts = result.data.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newPosts];
      });
      setNextCursor(result.nextCursor);
      setHasMore(result.hasMore);
      setLoading(false);
    }, 600);
  }, [loading, hasMore, nextCursor]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.5 },
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="flex flex-col">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* Scroll sentinel */}
      <div ref={observerTarget} className="py-10 flex justify-center w-full">
        {loading && (
          <div className="flex gap-1.5 items-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-[#0a7ea4] animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <p className="text-gray-400 text-sm font-medium">You&apos;re all caught up! 🎉</p>
        )}
        {!hasMore && posts.length === 0 && (
          <p className="text-gray-400 text-sm">No posts yet. Be the first to share!</p>
        )}
      </div>
    </div>
  );
}

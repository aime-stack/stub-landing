'use client';

import { useEffect, useRef, useState } from 'react';
import { Post } from '@/types';
import { ReelCard } from './ReelCard';

interface ReelsFeedProps {
  reels: Post[];
}

export function ReelsFeed({ reels: initialReels }: ReelsFeedProps) {
  const [reels, setReels] = useState<Post[]>(initialReels);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to detect which reel is fully in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(index)) {
              setActiveIndex(index);
              
              // Infinite Scroll Trigger: currentIndex >= reels.length - 3
              if (index >= reels.length - 3 && !loadingMore && hasMore) {
                loadMoreReels();
              }
            }
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.6,
      }
    );

    const elements = document.querySelectorAll('.reel-container');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [reels, loadingMore, hasMore]);

  const loadMoreReels = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const lastReel = reels[reels.length - 1];
      const cursor = lastReel?.created_at;
      const res = await fetch(`/api/reels?cursor=${cursor ? encodeURIComponent(cursor) : ''}`);
      const data = await res.json();
      
      if (data.reels && data.reels.length > 0) {
        setReels(prev => [...prev, ...data.reels]);
        setHasMore(data.reels.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('[ReelsFeed] Failed to load more:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
    >
      {reels.map((reel, index) => {
        // DOM Virtualization: Render only previous, current, and next reel
        // Plus one placeholder for snap stability if needed
        const isVisible = Math.abs(index - activeIndex) <= 1;
        
        return (
          <div
            key={reel.id}
            data-index={index}
            className="reel-container w-full h-full snap-always snap-center flex items-center justify-center relative"
          >
            {isVisible ? (
              <div className="w-full h-full sm:max-w-[400px] sm:max-h-[750px] aspect-[9/16] sm:rounded-xl overflow-hidden relative sm:my-4 sm:border sm:border-white/20 bg-black shadow-2xl">
                <ReelCard reel={reel} isActive={activeIndex === index} />
              </div>
            ) : (
              <div className="w-full h-full sm:max-w-[400px] sm:max-h-[750px] aspect-[9/16] bg-black sm:rounded-xl sm:my-4 sm:border sm:border-white/20" />
            )}
          </div>
        );
      })}
      
      {loadingMore && (
        <div className="h-20 flex items-center justify-center bg-black">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

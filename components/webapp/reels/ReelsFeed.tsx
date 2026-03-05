'use client';

import { useEffect, useRef, useState } from 'react';
import { Post } from '@/types';
import { ReelCard } from './ReelCard';

interface ReelsFeedProps {
  reels: Post[];
}

export function ReelsFeed({ reels }: ReelsFeedProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to detect which reel is fully in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // entry.target.dataset.index contains the index of the reel
            const index = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(index)) {
              setActiveIndex(index);
            }
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.6, // trigger when 60% is visible
      }
    );

    const elements = document.querySelectorAll('.reel-container');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [reels]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
    >
      {reels.map((reel, index) => (
        <div
          key={reel.id}
          data-index={index}
          className="reel-container w-full h-full snap-always snap-center flex items-center justify-center relative"
        >
          {/* Max width matching mobile aesthetic even on desktop, typical for Reels */}
          <div className="w-full h-full sm:max-w-[400px] sm:max-h-[750px] sm:rounded-xl overflow-hidden relative sm:my-4 sm:border sm:border-white/20 bg-black">
            <ReelCard reel={reel} isActive={activeIndex === index} />
          </div>
        </div>
      ))}
    </div>
  );
}

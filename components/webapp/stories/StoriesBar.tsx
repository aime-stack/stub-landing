'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { Story } from '@/types';
import { StoryViewer } from './StoryViewer';
import { MOCK_CURRENT_USER } from '@/services/mockData';

interface StoriesBarProps {
  stories: Story[];
}

export function StoriesBar({ stories }: StoriesBarProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openStory = (index: number) => {
    setActiveIndex(index);
    setViewerOpen(true);
  };

  return (
    <>
      {/* Stories row — Twitter-style: flat, border-b, horizontal scroll */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex gap-5 overflow-x-auto no-scrollbar">

          {/* Your story */}
          <button className="flex flex-col items-center gap-1.5 shrink-0 group" aria-label="Add your story">
            <div className="relative w-14 h-14">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-dashed border-gray-300 group-hover:border-[#0a7ea4] transition-colors bg-gray-50">
                {MOCK_CURRENT_USER.avatar_url ? (
                  <Image
                    src={MOCK_CURRENT_USER.avatar_url}
                    alt="Your story"
                    width={56}
                    height={56}
                    className="object-cover w-full h-full opacity-60"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#0a7ea4] flex items-center justify-center border-2 border-white">
                <Plus size={10} className="text-white" strokeWidth={3} />
              </div>
            </div>
            <span className="text-[11px] text-gray-500 w-14 text-center truncate">Your story</span>
          </button>

          {/* Story bubbles */}
          {stories.map((story, index) => {
            const isViewed = story.viewed;
            return (
              <button
                key={story.id}
                onClick={() => openStory(index)}
                className="flex flex-col items-center gap-1.5 shrink-0 group"
                aria-label={`${story.user.username}'s story`}
              >
                <div className={`w-14 h-14 rounded-full p-[2px] transition-transform duration-200 group-hover:scale-105 ${
                  isViewed
                    ? 'bg-gray-300'
                    : 'bg-gradient-to-tr from-[#0a7ea4] via-[#8b5cf6] to-[#ec4899]'
                }`}>
                  <div className="w-full h-full rounded-full bg-white p-[2px]">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      {story.user.avatar_url ? (
                        <Image
                          src={story.user.avatar_url}
                          alt={story.user.username}
                          width={52}
                          height={52}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-[#0a7ea4] to-[#ec4899] flex items-center justify-center text-white font-bold text-lg">
                          {story.user.username[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-gray-700 w-14 text-center truncate">{story.user.username}</span>
              </button>
            );
          })}
        </div>
      </div>

      {viewerOpen && (
        <StoryViewer
          stories={stories}
          initialIndex={activeIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </>
  );
}

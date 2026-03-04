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
      <div className="bg-white border-b border-gray-200 px-3 py-3">
        <div className="flex gap-4 overflow-x-auto no-scrollbar">
          {/* Add your story */}
          <button
            className="flex flex-col items-center gap-1.5 shrink-0 group"
            aria-label="Add your story"
          >
            <div className="relative w-[66px] h-[66px]">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-dashed border-gray-300 group-hover:border-[#0a7ea4] transition-colors bg-gray-50">
                {MOCK_CURRENT_USER.avatar_url ? (
                  <Image
                    src={MOCK_CURRENT_USER.avatar_url}
                    alt="Your story"
                    width={66}
                    height={66}
                    className="object-cover w-full h-full opacity-60 group-hover:opacity-80 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>
              {/* + icon */}
              <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-[#0a7ea4] flex items-center justify-center border-2 border-white shadow-sm">
                <Plus size={13} className="text-white" strokeWidth={3} />
              </div>
            </div>
            <span className="text-[11px] text-gray-500 font-medium w-16 text-center truncate group-hover:text-gray-700 transition-colors">
              Your story
            </span>
          </button>

          {/* Story bubbles */}
          {stories.map((story, index) => {
            const isViewed = story.viewed;
            return (
              <button
                key={story.id}
                onClick={() => openStory(index)}
                className="flex flex-col items-center gap-1.5 shrink-0 group"
                aria-label={`View ${story.user.username}'s story`}
              >
                <div
                  className={`w-[66px] h-[66px] rounded-full p-[2.5px] ${
                    isViewed
                      ? 'bg-gray-300'
                      : 'bg-gradient-to-tr from-[#0a7ea4] via-[#8b5cf6] to-[#ec4899]'
                  }`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-white p-[2px]">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      {story.user.avatar_url ? (
                        <Image
                          src={story.user.avatar_url}
                          alt={story.user.username}
                          width={60}
                          height={60}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-[#0a7ea4] to-[#ec4899] flex items-center justify-center text-white font-bold text-xl">
                          {story.user.username[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-gray-700 font-medium w-16 text-center truncate">
                  {story.user.username}
                </span>
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

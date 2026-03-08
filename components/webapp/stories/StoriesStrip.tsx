'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { Story } from '@/types';
import { StoryViewer } from './StoryViewer';
import { CreateStoryModal } from './CreateStoryModal';

interface StoriesStripProps {
  stories: Story[];
  currentUser: any;
}

export function StoriesStrip({ stories, currentUser }: StoriesStripProps) {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Group stories by user (showing only the latest or first active one in the strip)
  const uniqueUsers = new Set<string>();
  const displayStories = stories.filter(story => {
    if (uniqueUsers.has(story.user_id)) return false;
    uniqueUsers.add(story.user_id);
    return true;
  });

  return (
    <>
      <div 
        className="w-full bg-white border-b border-gray-200 py-4 px-4 overflow-hidden mt-2 rounded-t-xl"
        style={{ fontFamily: `'Inter', -apple-system, sans-serif` }}
      >
        <div 
          ref={scrollRef}
          className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {/* Create Story Button */}
          <div className="flex flex-col items-center gap-1 shrink-0 w-[72px]">
            <button 
              onClick={() => setIsCreating(true)}
              className="relative w-16 h-16 rounded-full overflow-visible group"
            >
              <div className="absolute inset-0 rounded-full border border-gray-200 overflow-hidden">
                {currentUser?.avatar_url ? (
                  <Image src={currentUser.avatar_url} alt="You" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center font-bold text-gray-400">
                    {currentUser?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-[2.5px] border-white flex items-center justify-center text-white scale-100 group-hover:scale-110 transition-transform shadow-sm">
                <Plus size={14} strokeWidth={3} />
              </div>
            </button>
            <span className="text-[11px] font-medium text-gray-500">Your story</span>
          </div>

          {/* User Stories */}
          {displayStories.map((story, idx) => {
            const user = story.user;
            const username = user?.username || 'unknown';
            const avatarUrl = user?.avatar_url;
            // Find actual index in raw stories array if we want to start playing from this user's first story
            const realIndex = stories.findIndex(s => s.user_id === story.user_id);

            return (
              <div 
                key={story.id} 
                className="flex flex-col items-center gap-1 shrink-0 w-[72px]"
              >
                <button 
                  onClick={() => setActiveStoryIndex(realIndex)}
                  className="relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#F59E0B] via-[#EC4899] to-[#0a7ea4] group active:scale-95 transition-transform"
                >
                  <div className="w-full h-full rounded-full border-[2px] border-white overflow-hidden relative bg-white">
                    {avatarUrl ? (
                      <Image src={avatarUrl} alt={username} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center font-bold text-gray-400">
                        {username[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                </button>
                <span className="text-[11px] font-medium text-gray-700 truncate w-full text-center">
                  {username}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {typeof activeStoryIndex === 'number' && (
        <StoryViewer 
          stories={stories} 
          initialIndex={activeStoryIndex} 
          onClose={() => setActiveStoryIndex(null)} 
        />
      )}

      {isCreating && (
        <CreateStoryModal onClose={() => setIsCreating(false)} currentUser={currentUser} />
      )}
    </>
  );
}

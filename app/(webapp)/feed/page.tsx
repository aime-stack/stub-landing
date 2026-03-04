'use client';

import { useState } from 'react';
import { InfiniteScrollFeed } from '@/components/webapp/feed/InfiniteScrollFeed';
import { StoriesBar } from '@/components/webapp/stories/StoriesBar';
import { CreatePostForm } from '@/components/webapp/upload/CreatePostForm';
import { getMockFeed, MOCK_STORIES } from '@/services/mockData';

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');
  const { data: initialPosts } = getMockFeed(null, 5);

  return (
    <>
      {/* Header with For you / Following tabs */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('foryou')}
            className={`flex-1 py-4 text-[15px] font-semibold transition-colors duration-200 relative ${
              activeTab === 'foryou' ? 'text-gray-900' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            For you
            {activeTab === 'foryou' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-[#0a7ea4] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-4 text-[15px] font-semibold transition-colors duration-200 relative ${
              activeTab === 'following' ? 'text-gray-900' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Following
            {activeTab === 'following' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-[#0a7ea4] rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Post composer */}
      <CreatePostForm />

      {/* Stories bar */}
      <StoriesBar stories={MOCK_STORIES} />

      {/* Posts feed */}
      <InfiniteScrollFeed initialPosts={initialPosts} />
    </>
  );
}

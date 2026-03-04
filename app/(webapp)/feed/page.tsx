import { InfiniteScrollFeed } from '@/components/webapp/feed/InfiniteScrollFeed';
import { StoriesBar } from '@/components/webapp/stories/StoriesBar';
import { CreatePostForm } from '@/components/webapp/upload/CreatePostForm';
import { getMockFeed, MOCK_STORIES } from '@/services/mockData';

export const dynamic = 'force-dynamic';

export default function FeedPage() {
  const { data: initialPosts } = getMockFeed(null, 5);

  return (
    <>
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-3 text-gray-900">
        <h1 className="text-xl font-bold">Home</h1>
      </div>

      {/* Stories */}
      <StoriesBar stories={MOCK_STORIES} />

      {/* Create post */}
      <CreatePostForm />

      {/* Feed */}
      <InfiniteScrollFeed initialPosts={initialPosts} />
    </>
  );
}

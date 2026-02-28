import { getFeed } from '@/services/posts';
import { InfiniteScrollFeed } from '@/components/webapp/feed/InfiniteScrollFeed';
import { CreatePostForm } from '@/components/webapp/upload/CreatePostForm';
import { Suspense } from 'react';

// Require dynamic rendering (SSR at each request) to prevent stale feeds in production
// Without this, Next.js tries to statically generate it which breaks dynamic user content
export const dynamic = 'force-dynamic';

export default async function FeedPage() {
  // Pass explicit params to prevent N+1 query directly on the server RSC layer.
  const initialFeed = await getFeed({ limit: 20 });

  return (
    <>
      <div className="sticky top-0 z-10 bg-[#151718]/80 backdrop-blur-md border-b border-gray-800 px-4 py-3">
         <h1 className="text-xl font-bold">Home</h1>
      </div>
      
      <CreatePostForm />
      
      {/* Container for posts */}
      <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading feed...</div>}>
         <InfiniteScrollFeed initialFeed={initialFeed} />
      </Suspense>
    </>
  );
}

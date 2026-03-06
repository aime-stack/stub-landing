import { CreatePostForm } from '@/components/webapp/upload/CreatePostForm';
import { PostCard } from '@/components/webapp/feed/PostCard';
import { getFeed } from '@/services/posts';

export const dynamic = 'force-dynamic';

export default async function FeedPage() {
  // Server-side fetch of the latest posts from Supabase.
  const { data: posts } = await getFeed({ cursor: null, limit: 30 });

  return (
    <>
      {/* Simple sticky header */}
      <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="px-4 py-3">
          <h1 className="text-xl font-semibold text-gray-900">Home</h1>
          <p className="text-xs font-medium text-gray-400">
            Real posts from the Stubgram community
          </p>
        </div>
      </div>

      {/* Composer */}
      <CreatePostForm />

      {/* Real feed */}
      <div className="flex flex-col gap-0">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {posts.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-500">
            No posts yet. Be the first to share something.
          </div>
        )}
      </div>
    </>
  );
}

import { CreatePostForm } from '@/components/webapp/upload/CreatePostForm';
import { PostCard } from '@/components/webapp/feed/PostCard';
import { getFeed } from '@/services/posts';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function FeedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('id, username, avatar_url').eq('id', user.id).single();
    profile = data;
  }

  // Server-side fetch of the latest posts from Supabase.
  const { data: posts } = await getFeed({ cursor: null, limit: 30 });

  return (
    <>
      {/* Simple sticky header */}
      <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur flex">
        <button
          className="flex-1 text-center py-4 text-[15px] font-bold text-gray-900 hover:bg-gray-50 transition-colors relative"
        >
          For You
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-blue-500 rounded-t-full" />
        </button>
        <button
          className="flex-1 text-center py-4 text-[15px] font-medium text-gray-500 hover:bg-gray-50 transition-colors"
        >
          Following
        </button>
      </div>

      {/* Composer */}
      <CreatePostForm user={profile} />

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

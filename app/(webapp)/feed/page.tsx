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
      <div className="sticky top-[10px] z-20 border-b border-gray-200 bg-white/95 backdrop-blur flex items-center mb-1 max-w-2xl mx-auto rounded-t-xl overflow-hidden mt-4">
        <button
          className="flex-1 text-center py-4 text-[16px] font-bold text-gray-900 hover:bg-gray-50 transition-colors relative"
          style={{ fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` }}
        >
          For You
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-blue-500 rounded-t-full" />
        </button>

        <div className="w-[1px] h-6 bg-gray-300" />

        <button
          className="flex-1 text-center py-4 text-[16px] font-medium text-gray-500 hover:bg-gray-50 transition-colors"
          style={{ fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` }}
        >
          Following
        </button>
      </div>

      {/* Composer */}
      <CreatePostForm user={profile} />

      {/* Real feed */}
      <div className="flex flex-col gap-0">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} currentUser={profile} />
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

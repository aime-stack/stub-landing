import { CreatePostForm } from '@/components/webapp/upload/CreatePostForm';
import { PostCard } from '@/components/webapp/feed/PostCard';
import { getFeed } from '@/services/posts';
import { getStories } from '@/services/stories';
import { StoriesStrip } from '@/components/webapp/stories/StoriesStrip';
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

  try {
    // Server-side fetch of the latest posts and stories from Supabase.
    const [{ data: posts }, stories] = await Promise.all([
      getFeed({ cursor: null, limit: 30 }),
      getStories(),
    ]);

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

        {/* Stories Strip */}
        <StoriesStrip stories={stories} currentUser={profile} />

        {/* Composer */}
        <CreatePostForm user={profile} />

        {/* Real feed */}
        <div className="flex flex-col gap-0">
          {posts.map((post) => {
            try {
              // Test render PostCard to catch specific post errors
              return <PostCard key={post.id} post={post} currentUser={profile} />;
            } catch (postErr: any) {
              return (
                <div key={post.id} className="p-4 bg-red-50 border border-red-200 text-red-700 m-4 rounded">
                  <p className="font-bold">Error rendering post {post.id}:</p>
                  <pre className="text-xs whitespace-pre-wrap">{postErr.message + '\n' + postErr.stack}</pre>
                </div>
              );
            }
          })}
          {posts.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-500">
              No posts yet. Be the first to share something.
            </div>
          )}
        </div>
      </>
    );
  } catch (err: any) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold text-red-600 mb-4">FeedPage Render Error</h1>
        <pre className="p-4 bg-gray-100 rounded text-sm overflow-auto text-black border border-gray-300">
          {err?.message || 'Unknown Error'}
          {'\n\n'}
          {err?.stack || ''}
        </pre>
      </div>
    );
  }
}

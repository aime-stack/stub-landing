import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const email = `test_comment_${Date.now()}@example.com`;
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: 'password123',
    options: {
      data: { full_name: 'Test Commenter', account_type: 'regular' }
    }
  });

  if (authError || !authData.user) {
    console.error('Auth error', authError);
    return;
  }
  console.log('User signed up and logged in:', authData.user?.id);

  // We need a post to comment on. Fetch any existing post
  const { data: posts, error: postErr } = await supabase.from('posts').select('id').limit(1);
  if (postErr || !posts || posts.length === 0) {
    console.error('No posts found', postErr);
    return;
  }
  const postId = posts[0].id;
  console.log('Post found:', postId);

  // 3. Try to insert comment as the authenticated user
  const { data: commentData, error: commentError } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      user_id: authData.user.id,
      content: 'Hello, this is a test comment from authenticated script!',
    })
    .select()
    .single();

  if (commentError) {
    console.error('Comment Insert Error:', commentError);
  } else {
    console.log('Comment Created Successfully!', commentData);
  }
}

main().catch(console.error);

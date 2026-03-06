import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileHeader } from '@/components/webapp/profile/ProfileHeader';
import { ProfilePostsGrid } from '@/components/webapp/profile/ProfilePostsGrid';

export const dynamic = 'force-dynamic';

export default async function MyProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const isProduction = process.env.NODE_ENV === 'production';
    const mainHost = isProduction ? 'https://stubgram.com' : 'http://localhost:3000';
    redirect(`${mainHost}/login`);
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single();

  if (profileError || !profile) {
    throw new Error('Profile not found for current user');
  }

  const { data: posts = [] } = await supabase
    .from('posts')
    .select(`
      *,
      users:user_id (
        id,
        username,
        full_name,
        avatar_url,
        is_verified,
        is_celebrity
      )
    `)
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false });

  return (
    <>
      {/* SVG gradient definition reused by BadgeCheck icons */}
      <svg width="0" height="0" className="absolute">
        <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="#0a7ea4" offset="0%" />
          <stop stopColor="#8b5cf6" offset="50%" />
          <stop stopColor="#ec4899" offset="100%" />
        </linearGradient>
      </svg>

      <ProfileHeader profile={profile as any} isOwnProfile />
      <ProfilePostsGrid posts={posts as any} />
    </>
  );
}

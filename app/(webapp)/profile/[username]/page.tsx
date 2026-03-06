import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProfileHeader } from '@/components/webapp/profile/ProfileHeader';
import { ProfilePostsGrid } from '@/components/webapp/profile/ProfilePostsGrid';

interface Props {
  params: Promise<{ username: string }>;
}

export const dynamic = 'force-dynamic';

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: { user: currentUser } } = await supabase.auth.getUser();

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (profileError || !profile) notFound();

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
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false });

  return (
    <>
      <svg width="0" height="0" className="absolute">
        <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="#0a7ea4" offset="0%" />
          <stop stopColor="#8b5cf6" offset="50%" />
          <stop stopColor="#ec4899" offset="100%" />
        </linearGradient>
      </svg>

      <ProfileHeader
        profile={profile as any}
        isOwnProfile={currentUser?.id === profile.id}
      />
      <ProfilePostsGrid posts={posts as any} />
    </>
  );
}

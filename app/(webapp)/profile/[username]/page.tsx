import { notFound } from 'next/navigation';
import { getMockProfile, getMockUserPosts } from '@/services/mockData';
import { ProfileHeader } from '@/components/webapp/profile/ProfileHeader';
import { ProfilePostsGrid } from '@/components/webapp/profile/ProfilePostsGrid';

interface Props {
  params: Promise<{ username: string }>;
}

export const dynamic = 'force-dynamic';

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;
  const profile = getMockProfile(username);

  if (!profile) notFound();

  const posts = getMockUserPosts(profile.id);

  return (
    <>
      <svg width="0" height="0" className="absolute">
        <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="#0a7ea4" offset="0%" />
          <stop stopColor="#8b5cf6" offset="50%" />
          <stop stopColor="#ec4899" offset="100%" />
        </linearGradient>
      </svg>

      <ProfileHeader profile={profile} isOwnProfile={false} />
      <ProfilePostsGrid posts={posts} />
    </>
  );
}

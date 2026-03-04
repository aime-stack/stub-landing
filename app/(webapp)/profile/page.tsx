import { MOCK_CURRENT_USER, getMockUserPosts } from '@/services/mockData';
import { ProfileHeader } from '@/components/webapp/profile/ProfileHeader';
import { ProfilePostsGrid } from '@/components/webapp/profile/ProfilePostsGrid';

export const dynamic = 'force-dynamic';

export default function MyProfilePage() {
  const profile = MOCK_CURRENT_USER;
  const posts = getMockUserPosts(profile.id);

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

      <ProfileHeader profile={profile} isOwnProfile />
      <ProfilePostsGrid posts={posts} />
    </>
  );
}

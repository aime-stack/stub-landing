'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Profile } from '@/types';
import { BadgeCheck, Star, Briefcase, Link as LinkIcon, Calendar } from 'lucide-react';
import { FollowButton } from './FollowButton';
import { format } from 'date-fns';

interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile?: boolean;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

const ACCOUNT_BADGE: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  vip: {
    label: 'VIP',
    icon: <Star size={11} className="fill-current" />,
    color: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  industry: {
    label: 'Industry',
    icon: <Briefcase size={11} />,
    color: 'bg-violet-100 text-violet-700 border-violet-200',
  },
};

export function ProfileHeader({ profile, isOwnProfile = false }: ProfileHeaderProps) {
  const badge = ACCOUNT_BADGE[profile.account_type];

  const joinDate = (() => {
    try {
      return format(new Date(profile.created_at), 'MMMM yyyy');
    } catch {
      return 'Member';
    }
  })();

  return (
    <div className="bg-white">
      {/* Cover Photo */}
      <div className="relative h-40 sm:h-48 bg-gradient-to-tr from-[#0a7ea4] via-[#8b5cf6] to-[#ec4899] overflow-hidden">
        {profile.cover_url && (
          <Image src={profile.cover_url} alt="Cover" fill className="object-cover" />
        )}
      </div>

      {/* Profile Info Row */}
      <div className="px-4">
        {/* Avatar + Actions */}
        <div className="flex items-end justify-between -mt-12 mb-3">
          {/* Avatar */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-white relative shrink-0">
            {profile.avatar_url ? (
              <Image src={profile.avatar_url} alt={profile.username} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[#0a7ea4] to-[#ec4899] flex items-center justify-center text-white font-extrabold text-4xl">
                {profile.username[0]?.toUpperCase()}
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-14 sm:mt-16">
            {isOwnProfile ? (
              <Link
                href="/settings"
                className="px-5 py-2 rounded-full text-sm font-bold border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-all"
              >
                Edit profile
              </Link>
            ) : (
              <FollowButton username={profile.username} initialFollowing={profile.is_following} />
            )}
          </div>
        </div>

        {/* Name + Badges */}
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <h1 className="text-xl font-extrabold text-gray-900">{profile.full_name}</h1>
          {profile.is_verified && (
            <BadgeCheck
              size={20}
              className="text-transparent shrink-0"
              style={{ fill: 'url(#brandGradient)' }}
            />
          )}
          {badge && (
            <span
              className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}
            >
              {badge.icon}
              {badge.label}
            </span>
          )}
          {profile.is_celebrity && (
            <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border bg-pink-50 text-pink-600 border-pink-200">
              <Star size={11} className="fill-current" />
              Celebrity
            </span>
          )}
        </div>

        <p className="text-gray-500 text-[14px] mb-3">@{profile.username}</p>

        {/* Bio */}
        {profile.bio && (
          <p className="text-[15px] text-gray-800 whitespace-pre-line leading-relaxed mb-3">
            {profile.bio}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-gray-500 mb-4">
          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#0a7ea4] hover:underline"
            >
              <LinkIcon size={13} />
              {profile.website.replace(/^https?:\/\//, '')}
            </a>
          )}
          <span className="flex items-center gap-1">
            <Calendar size={13} />
            Joined {joinDate}
          </span>
        </div>

        {/* Stats */}
        <div className="flex gap-6 pb-3 border-b border-gray-200">
          <div className="text-center">
            <p className="font-extrabold text-gray-900 text-[16px]">{formatCount(profile.posts_count)}</p>
            <p className="text-gray-500 text-[13px]">Posts</p>
          </div>
          <div className="text-center cursor-pointer hover:underline">
            <p className="font-extrabold text-gray-900 text-[16px]">{formatCount(profile.followers_count)}</p>
            <p className="text-gray-500 text-[13px]">Followers</p>
          </div>
          <div className="text-center cursor-pointer hover:underline">
            <p className="font-extrabold text-gray-900 text-[16px]">{formatCount(profile.following_count)}</p>
            <p className="text-gray-500 text-[13px]">Following</p>
          </div>
        </div>
      </div>
    </div>
  );
}

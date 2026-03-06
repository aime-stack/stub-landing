'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Profile } from '@/types';
import { Star, Briefcase, Link as LinkIcon, Calendar } from 'lucide-react';
import { FollowButton } from './FollowButton';
import { format } from 'date-fns';

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

const PLAN_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  premium:      { label: '⚡ Premium',      color: '#0a7ea4', bg: 'rgba(10,126,164,0.1)'  },
  premium_plus: { label: '👑 Premium Plus', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
};

interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile?: boolean;
}

export function ProfileHeader({ profile, isOwnProfile = false }: ProfileHeaderProps) {
  const joinDate = (() => {
    try { return format(new Date(profile.created_at), 'MMMM yyyy'); }
    catch { return 'Member'; }
  })();

  const planBadge = PLAN_BADGE[profile.premium_plan ?? ''];

  return (
    <div style={{ background: 'white', fontFamily: FONT }}>

      {/* Cover photo */}
      <div
        style={{
          height: 180, position: 'relative',
          background: 'linear-gradient(135deg,#0a7ea4 0%,#8b5cf6 50%,#EC4899 100%)',
          overflow: 'hidden',
        }}
      >
        {profile.cover_url && (
          <Image src={profile.cover_url} alt="Cover" fill style={{ objectFit: 'cover' }} />
        )}
      </div>

      {/* Info section */}
      <div style={{ padding: '0 20px 0' }}>

        {/* Avatar + action row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: -48, marginBottom: 12 }}>
          {/* Avatar */}
          <div
            style={{
              width: 96, height: 96,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '4px solid white',
              boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
              background: 'linear-gradient(135deg,#0a7ea4,#EC4899)',
              flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {profile.avatar_url ? (
              <Image src={profile.avatar_url} alt={profile.username} width={96} height={96} style={{ objectFit: 'cover' }} />
            ) : (
              <span style={{ color: 'white', fontSize: 36, fontWeight: 800 }}>
                {profile.username[0]?.toUpperCase()}
              </span>
            )}
          </div>

          {/* Action */}
          <div style={{ marginBottom: 4 }}>
            {isOwnProfile ? (
              <Link
                href="/settings"
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  height: 36, paddingLeft: 18, paddingRight: 18,
                  borderRadius: 999, border: '1.5px solid #E5E7EB',
                  fontFamily: FONT, fontSize: 14, fontWeight: 700,
                  color: '#1A1A1A', background: 'white',
                  textDecoration: 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                onMouseLeave={e => (e.currentTarget.style.background = 'white')}
              >
                Edit profile
              </Link>
            ) : (
              <FollowButton username={profile.username} initialFollowing={profile.is_following} />
            )}
          </div>
        </div>

        {/* Name + badges row */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 2 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1A1A1A', fontFamily: FONT }}>
            {profile.full_name}
          </h1>

          {/* Verified badge — gradient SVG */}
          {profile.is_verified && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <defs>
                <linearGradient id="vg-profile" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop stopColor="#0a7ea4" offset="0%" />
                  <stop stopColor="#EC4899" offset="100%" />
                </linearGradient>
              </defs>
              <circle cx="12" cy="12" r="10" fill="url(#vg-profile)" />
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}

          {/* Celebrity badge */}
          {profile.is_celebrity && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 10px', borderRadius: 999,
              background: 'rgba(255,105,180,0.12)', border: '1px solid rgba(255,105,180,0.3)',
              fontFamily: FONT, fontSize: 11, fontWeight: 700, color: '#FF69B4',
            }}>
              <Star style={{ width: 10, height: 10, fill: 'currentColor' }} /> Celebrity
            </span>
          )}

          {/* Industry badge */}
          {profile.account_type === 'industry' && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 10px', borderRadius: 999,
              background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)',
              fontFamily: FONT, fontSize: 11, fontWeight: 700, color: '#7C3AED',
            }}>
              <Briefcase style={{ width: 10, height: 10 }} /> Industry
            </span>
          )}

          {/* Premium plan badge */}
          {planBadge && (
            <span style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '3px 10px', borderRadius: 999,
              background: planBadge.bg,
              fontFamily: FONT, fontSize: 11, fontWeight: 700, color: planBadge.color,
              border: `1px solid ${planBadge.color}40`,
            }}>
              {planBadge.label}
            </span>
          )}
        </div>

        {/* Username */}
        <p style={{ margin: '0 0 10px', fontFamily: FONT, fontSize: 14, color: '#9CA3AF' }}>
          @{profile.username}
        </p>

        {/* Bio */}
        {profile.bio && (
          <p style={{ margin: '0 0 12px', fontFamily: FONT, fontSize: 15, color: '#374151', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
            {profile.bio}
          </p>
        )}

        {/* Snap Coins balance */}
        {typeof profile.coins === 'number' && profile.coins > 0 && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 14px', borderRadius: 999,
                background: 'linear-gradient(135deg,#F59E0B,#EC4899)',
                fontFamily: FONT, fontSize: 13, fontWeight: 700, color: 'white',
                boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
              }}
            >
              🪙 {profile.coins.toLocaleString()} Snap Coins
            </span>
          </div>
        )}

        {/* Meta row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px', marginBottom: 14 }}>
          {(profile as any).website && (
            <a
              href={(profile as any).website}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontFamily: FONT, fontSize: 13, color: '#0a7ea4', textDecoration: 'none',
              }}
            >
              <LinkIcon style={{ width: 13, height: 13 }} />
              {(profile as any).website.replace(/^https?:\/\//, '')}
            </a>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: FONT, fontSize: 13, color: '#9CA3AF' }}>
            <Calendar style={{ width: 13, height: 13 }} /> Joined {joinDate}
          </span>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'flex', gap: 28, paddingBottom: 16,
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          {[
            { label: 'Posts',     val: profile.posts_count },
            { label: 'Followers', val: profile.followers_count },
            { label: 'Following', val: profile.following_count },
          ].map(({ label, val }) => (
            <div key={label} style={{ cursor: 'pointer' }}>
              <div style={{ fontFamily: FONT, fontSize: 17, fontWeight: 800, color: '#1A1A1A' }}>
                {formatCount(val)}
              </div>
              <div style={{ fontFamily: FONT, fontSize: 13, color: '#9CA3AF', marginTop: 1 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

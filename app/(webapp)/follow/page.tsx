'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Settings, Star, ChevronRight } from 'lucide-react';

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

const WHO_TO_FOLLOW = [
  { id: 'u1', name: 'Selena Martinez', handle: 'selena_creates', avatar: '47', followers: '2.4M',   verified: true,  celebrity: true,  bio: 'Lifestyle creator | Travel junkie 🌍'    },
  { id: 'u2', name: 'Kevin Osei',      handle: 'codewithkev',   avatar: '12', followers: '84.2K',  verified: true,  celebrity: false, bio: 'Full-stack dev | Next.js & AI ⚡'        },
  { id: 'u3', name: 'Marcus Reid',     handle: 'marcus.fit',    avatar: '11', followers: '1.2M',   verified: true,  celebrity: false, bio: 'Fitness coach | @nike athlete 💪'        },
  { id: 'u4', name: 'Nadia Wright',    handle: 'nadia.eats',    avatar: '23', followers: '54.1K',  verified: false, celebrity: false, bio: 'Food blogger | Recipes every Friday 🍽️' },
];

const CREATORS_FOR_YOU = [
  { id: 'c1', name: 'Amara Diallo',    handle: 'amara.glow',    avatar: '45', followers: '9.8K',   verified: false, celebrity: false, category: 'Beauty & Wellness',   bio: 'Natural hair advocate | IG: @amaraglow'  },
  { id: 'c2', name: 'Jake Thornton',   handle: 'jakethephoto',  avatar: '8',  followers: '320.4K', verified: true,  celebrity: false, category: 'Photography',        bio: 'Documentary photographer 📷'             },
  { id: 'c3', name: 'Priya Sharma',    handle: 'priya.codes',   avatar: '29', followers: '42K',    verified: true,  celebrity: false, category: 'Tech & Education',   bio: 'Teaching code to Africa 🌍 | CS degree'  },
  { id: 'c4', name: 'Leo Nkosi',       handle: 'leo.beats',     avatar: '52', followers: '18.3K',  verified: false, celebrity: false, category: 'Music & Arts',       bio: 'Producer | Afrobeats meets jazz 🎹'      },
  { id: 'c5', name: 'Fatima Al-Rashid',handle: 'fatima.builds', avatar: '33', followers: '5.1K',   verified: false, celebrity: false, category: 'Entrepreneurship',   bio: 'Startup founder | Building in public 🚀' },
];

function VerifiedBadge({ id }: { id: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={`vb-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="#0a7ea4" offset="0%" />
          <stop stopColor="#EC4899" offset="100%" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill={`url(#vb-${id})`} />
      <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type UserType = typeof WHO_TO_FOLLOW[0] & { category?: string };

function UserCard({ u }: { u: UserType }) {
  const [following, setFollowing] = useState(false);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '13px 20px',
      borderTop: '1px solid #F3F4F6',
      transition: 'background 0.12s', cursor: 'pointer',
    }}
      onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Avatar */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`https://i.pravatar.cc/52?img=${u.avatar}`} alt={u.name}
          style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
        {u.celebrity && (
          <div style={{
            position: 'absolute', bottom: -2, right: -2,
            width: 18, height: 18, borderRadius: '50%',
            background: '#FF69B4', border: '2px solid white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9,
          }}>⭐</div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
          <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {u.name}
          </span>
          {u.verified && <VerifiedBadge id={u.id} />}
          {u.category && (
            <span style={{
              flexShrink: 0, padding: '1px 8px', borderRadius: 999,
              background: 'rgba(10,126,164,0.08)', border: '1px solid rgba(10,126,164,0.15)',
              fontFamily: FONT, fontSize: 10, fontWeight: 600, color: '#0a7ea4',
            }}>{u.category}</span>
          )}
        </div>
        <div style={{ fontFamily: FONT, fontSize: 12, color: '#9CA3AF', marginBottom: 3 }}>
          @{u.handle} · {u.followers} followers
        </div>
        {u.bio && (
          <div style={{ fontFamily: FONT, fontSize: 12, color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {u.bio}
          </div>
        )}
      </div>

      {/* Follow button */}
      <button
        onClick={e => { e.stopPropagation(); setFollowing(f => !f); }}
        style={{
          flexShrink: 0, height: 36, minWidth: 94,
          paddingLeft: 18, paddingRight: 18, borderRadius: 999,
          border: following ? '1.5px solid #E5E7EB' : 'none',
          cursor: 'pointer', fontFamily: FONT, fontSize: 13, fontWeight: 700,
          background: following
            ? 'white'
            : 'linear-gradient(135deg,#0a7ea4,#EC4899)',
          color:  following ? '#1A1A1A' : 'white',
          boxShadow: following ? 'none' : '0 2px 8px rgba(10,126,164,0.2)',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => {
          if (following) { (e.currentTarget.style.background = '#FEF2F2'); (e.currentTarget.style.color = '#EF4444'); }
          else (e.currentTarget.style.opacity = '0.85');
        }}
        onMouseLeave={e => {
          e.currentTarget.style.opacity = '1';
          if (following) { (e.currentTarget.style.background = 'white'); (e.currentTarget.style.color = '#1A1A1A'); }
        }}
      >
        {following ? 'Following' : 'Follow'}
      </button>
    </div>
  );
}

export default function FollowPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: FONT }}>

      {/* ── Sticky header ───────────────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E5E7EB',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <h1 style={{ margin: 0, fontFamily: FONT, fontSize: 20, fontWeight: 800, color: '#1A1A1A' }}>
          Follow
        </h1>

        {/* Settings icon → /settings */}
        <Link
          href="/settings"
          title="Settings"
          style={{
            width: 40, height: 40, borderRadius: '50%',
            background: '#F3F4F6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            textDecoration: 'none', color: '#6B7280',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget.style.background = 'rgba(10,126,164,0.1)'); (e.currentTarget.style.color = '#0a7ea4'); }}
          onMouseLeave={e => { (e.currentTarget.style.background = '#F3F4F6'); (e.currentTarget.style.color = '#6B7280'); }}
        >
          <Settings style={{ width: 18, height: 18 }} />
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '20px 0' }}>

        {/* ── Section 1: Who to Follow ──────────────────────────────────────── */}
        <div style={{ background: 'white', borderBottom: '1px solid #E5E7EB', borderTop: '1px solid #E5E7EB' }}>
          {/* Section header */}
          <div style={{ padding: '14px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Gradient people icon */}
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg,#0a7ea4,#8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 3.13a4 4 0 010 7.75" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>Who to Follow</div>
                <div style={{ fontFamily: FONT, fontSize: 11, color: '#9CA3AF' }}>People you might know</div>
              </div>
            </div>
            <ChevronRight style={{ width: 16, height: 16, color: '#D1D5DB' }} />
          </div>

          {WHO_TO_FOLLOW.map(u => <UserCard key={u.id} u={u} />)}
        </div>

        {/* ── Section 2: Creators for You ───────────────────────────────────── */}
        <div style={{ background: 'white', borderBottom: '1px solid #E5E7EB', borderTop: '1px solid #E5E7EB' }}>
          {/* Section header */}
          <div style={{ padding: '14px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Gradient star icon */}
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg,#F59E0B,#EC4899)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Star style={{ width: 16, height: 16, color: 'white', fill: 'white' }} />
              </div>
              <div>
                <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>Creators for You</div>
                <div style={{ fontFamily: FONT, fontSize: 11, color: '#9CA3AF' }}>Based on your interests</div>
              </div>
            </div>
            <ChevronRight style={{ width: 16, height: 16, color: '#D1D5DB' }} />
          </div>

          {CREATORS_FOR_YOU.map(u => <UserCard key={u.id} u={{ ...u, celebrity: false }} />)}
        </div>

      </div>
    </div>
  );
}

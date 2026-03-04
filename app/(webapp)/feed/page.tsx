'use client';

import { useState } from 'react';
import { InfiniteScrollFeed } from '@/components/webapp/feed/InfiniteScrollFeed';
import { StoriesBar } from '@/components/webapp/stories/StoriesBar';
import { CreatePostForm } from '@/components/webapp/upload/CreatePostForm';
import { getMockFeed, MOCK_STORIES, MOCK_USERS } from '@/services/mockData';
import { TrendingUp, Users } from 'lucide-react';
import Image from 'next/image';

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

const TRENDING = [
  { tag: '#StubgramRewards',  posts: '10.5K', category: 'Technology'    },
  { tag: '#ContentCreators',  posts: '15.2K', category: 'Social Media'  },
  { tag: '#NextGeneration',   posts: '20K',   category: 'Trending'      },
  { tag: '#StubgramLive',     posts: '8.1K',  category: 'Entertainment' },
  { tag: '#StubCoins',        posts: '5.3K',  category: 'Finance'       },
];

/* Simulated "following" feed — only posts from users the current user follows */
const FOLLOWING_POSTS_COUNT = 3;

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');
  const { data: allPosts }       = getMockFeed(null, 5);
  /* Following tab: only first N posts (from "followed" people) */
  const followingPosts           = allPosts.slice(0, FOLLOWING_POSTS_COUNT);

  return (
    <>
      {/* ── Sticky header: tabs only (no "Home" title) ───────────────────────── */}
      <div
        style={{
          position: 'sticky', top: 0, zIndex: 20,
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          {/* For You */}
          <button
            onClick={() => setActiveTab('foryou')}
            style={{
              flex: 1, paddingTop: 16, paddingBottom: 16,
              background: 'none', border: 'none', cursor: 'pointer',
              position: 'relative',
              fontFamily: FONT, fontSize: 15,
              fontWeight: activeTab === 'foryou' ? 700 : 500,
              color: activeTab === 'foryou' ? '#1A1A1A' : '#6B7280',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { if (activeTab !== 'foryou') e.currentTarget.style.background = '#F9FAFB'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
          >
            For You
            {activeTab === 'foryou' && (
              <span style={{
                position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                width: 56, height: 3, borderRadius: 999, background: '#0a7ea4',
              }} />
            )}
          </button>

          {/* Vertical separator */}
          <div style={{ width: 1, background: '#E5E7EB', alignSelf: 'center', height: 24, flexShrink: 0 }} />

          {/* Following */}
          <button
            onClick={() => setActiveTab('following')}
            style={{
              flex: 1, paddingTop: 16, paddingBottom: 16,
              background: 'none', border: 'none', cursor: 'pointer',
              position: 'relative',
              fontFamily: FONT, fontSize: 15,
              fontWeight: activeTab === 'following' ? 700 : 500,
              color: activeTab === 'following' ? '#1A1A1A' : '#6B7280',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { if (activeTab !== 'following') e.currentTarget.style.background = '#F9FAFB'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
          >
            Following
            {activeTab === 'following' && (
              <span style={{
                position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                width: 56, height: 3, borderRadius: 999, background: '#0a7ea4',
              }} />
            )}
          </button>
        </div>
      </div>

      {/* ── Post composer (shared) ────────────────────────────────────────────── */}
      <CreatePostForm />

      {/* ═══════════════════════════════════════════════════════════════════════
          FOR YOU tab content
      ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'foryou' && (
        <>
          {/* Stories */}
          <StoriesBar stories={MOCK_STORIES} />

          {/* What's happening */}
          <div style={{ borderBottom: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px 10px' }}>
              <TrendingUp style={{ width: 18, height: 18, color: '#0a7ea4', flexShrink: 0 }} />
              <span style={{ fontFamily: FONT, fontSize: 17, fontWeight: 700, color: '#1A1A1A' }}>
                What&rsquo;s happening
              </span>
            </div>
            {TRENDING.map(({ tag, posts, category }) => (
              <div
                key={tag}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 20px',
                  borderTop: '1px solid #F3F4F6',
                  cursor: 'pointer', transition: 'background 0.12s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div>
                  <div style={{ fontFamily: FONT, fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>{category} · Trending</div>
                  <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>{tag}</div>
                  <div style={{ fontFamily: FONT, fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{posts} posts</div>
                </div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 16, color: '#9CA3AF', padding: '4px 8px' }}>···</button>
              </div>
            ))}
            <div style={{ padding: '10px 20px 14px' }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 13, fontWeight: 600, color: '#0a7ea4' }}>
                Show more
              </button>
            </div>
          </div>

          {/* Full algorithmic feed */}
          <InfiniteScrollFeed initialPosts={allPosts} />
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          FOLLOWING tab content
      ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'following' && (
        <>
          {/* ── Welcome card (shown before content so new users know what to do) ── */}
          <div style={{
            margin: '16px 20px',
            borderRadius: 20,
            background: 'linear-gradient(135deg,#F59E0B 0%,#EC4899 55%,#0a7ea4 100%)',
            padding: '28px 24px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 28px rgba(236,72,153,0.28)',
          }}>
            {/* Decorative blobs */}
            <div style={{ position: 'absolute', top: -32, right: -32, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
            <div style={{ position: 'absolute', bottom: -24, left: -16, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Icon row */}
              <div style={{ fontSize: 32, marginBottom: 12 }}>🪙✨</div>

              {/* Heading */}
              <h2 style={{
                margin: '0 0 10px',
                fontFamily: FONT,
                fontSize: 22,
                fontWeight: 800,
                color: 'white',
                lineHeight: 1.2,
              }}>
                Welcome to Stubgram!
              </h2>

              {/* Subtitle */}
              <p style={{
                margin: '0 0 22px',
                fontFamily: FONT,
                fontSize: 14,
                color: 'rgba(255,255,255,0.80)',
                lineHeight: 1.55,
                maxWidth: 320,
              }}>
                This is the best place to see what&rsquo;s happening in your world.
                Follow people and topics you care about to get started.
              </p>

              {/* CTA button */}
              <button
                onClick={() => {}}
                style={{
                  height: 44,
                  paddingLeft: 28,
                  paddingRight: 28,
                  borderRadius: 999,
                  border: 'none',
                  cursor: 'pointer',
                  background: 'white',
                  color: '#EC4899',
                  fontFamily: FONT,
                  fontSize: 15,
                  fontWeight: 800,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.14)',
                  transition: 'opacity 0.15s, transform 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget.style.opacity = '0.88'); (e.currentTarget.style.transform = 'scale(1.02)'); }}
                onMouseLeave={e => { (e.currentTarget.style.opacity = '1');    (e.currentTarget.style.transform = 'scale(1)'); }}
              >
                Let&rsquo;s go! 🚀
              </button>
            </div>
          </div>

          {/* People you follow strip */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Users style={{ width: 16, height: 16, color: '#EC4899', flexShrink: 0 }} />
              <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>
                People you follow
              </span>
            </div>
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 4 }} className="no-scrollbar">
              {MOCK_USERS.slice(0, 5).map(u => (
                <div key={u.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0, width: 58, cursor: 'pointer' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%', overflow: 'hidden',
                    border: '2px solid #EC4899', padding: 2, boxSizing: 'border-box',
                    background: 'linear-gradient(135deg,#0a7ea4,#EC4899)',
                    flexShrink: 0,
                  }}>
                    <Image
                      src={u.avatar_url ?? `https://i.pravatar.cc/48?u=${u.id}`}
                      alt={u.username}
                      width={48} height={48}
                      style={{ borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                  <span style={{ fontFamily: FONT, fontSize: 11, color: '#374151', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 56 }}>
                    {u.full_name.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* "Only from people you follow" notice */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 20px',
            background: 'rgba(10,126,164,0.04)',
            borderBottom: '1px solid #E5E7EB',
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', background: '#0a7ea4', flexShrink: 0,
            }} />
            <span style={{ fontFamily: FONT, fontSize: 13, color: '#6B7280' }}>
              Showing posts only from accounts you follow
            </span>
          </div>

          {/* Curated following feed — shorter list */}
          <InfiniteScrollFeed initialPosts={followingPosts} />

          {/* End of following feed */}
          <div style={{
            padding: '32px 20px', textAlign: 'center',
            borderTop: '1px solid #F3F4F6',
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✨</div>
            <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: '#1A1A1A', margin: '0 0 6px' }}>
              You&rsquo;re all caught up!
            </p>
            <p style={{ fontFamily: FONT, fontSize: 14, color: '#9CA3AF', margin: 0 }}>
              Follow more people to see more posts here.
            </p>
            <button
              onClick={() => setActiveTab('foryou')}
              style={{
                marginTop: 16, height: 40, paddingLeft: 24, paddingRight: 24,
                borderRadius: 999, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg,#0a7ea4,#EC4899)',
                color: 'white', fontFamily: FONT, fontSize: 14, fontWeight: 700,
                boxShadow: '0 2px 8px rgba(10,126,164,0.25)',
              }}
            >
              Browse For You
            </button>
          </div>
        </>
      )}
    </>
  );
}

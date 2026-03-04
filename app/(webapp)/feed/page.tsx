'use client';

import { useState } from 'react';
import { InfiniteScrollFeed } from '@/components/webapp/feed/InfiniteScrollFeed';
import { StoriesBar } from '@/components/webapp/stories/StoriesBar';
import { CreatePostForm } from '@/components/webapp/upload/CreatePostForm';
import { getMockFeed, MOCK_STORIES } from '@/services/mockData';
import { TrendingUp } from 'lucide-react';

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

const TRENDING = [
  { tag: '#StubgramRewards',  posts: '10.5K', category: 'Technology'    },
  { tag: '#ContentCreators',  posts: '15.2K', category: 'Social Media'  },
  { tag: '#NextGeneration',   posts: '20K',   category: 'Trending'      },
  { tag: '#StubgramLive',     posts: '8.1K',  category: 'Entertainment' },
  { tag: '#SnapCoins',        posts: '5.3K',  category: 'Finance'       },
];

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');
  const { data: initialPosts } = getMockFeed(null, 5);

  return (
    <>
      {/* ── Sticky header: tabs ─────────────────────────────────────────────── */}
      <div
        style={{
          position: 'sticky', top: 0, zIndex: 20,
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        {/* App title row */}
        <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontFamily: FONT, fontSize: 20, fontWeight: 800, color: '#1A1A1A' }}>Home</span>
        </div>

        {/* For You / Following tabs */}
        <div style={{ display: 'flex', marginTop: 6 }}>
          {([
            { id: 'foryou',    label: 'For You'   },
            { id: 'following', label: 'Following'  },
          ] as const).map(({ id, label }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  flex: 1,
                  paddingTop: 14,
                  paddingBottom: 14,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  fontFamily: FONT,
                  fontSize: 15,
                  fontWeight: active ? 700 : 500,
                  color: active ? '#1A1A1A' : '#6B7280',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = '#F9FAFB'; }}
                onMouseLeave={e => {           (e.currentTarget as HTMLElement).style.background = 'none'; }}
              >
                {label}
                {active && (
                  <span
                    style={{
                      position: 'absolute', bottom: 0,
                      left: '50%', transform: 'translateX(-50%)',
                      width: 56, height: 3,
                      borderRadius: 999,
                      background: '#0a7ea4',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Post composer ───────────────────────────────────────────────────── */}
      <CreatePostForm />

      {/* ── Stories bar ─────────────────────────────────────────────────────── */}
      <StoriesBar stories={MOCK_STORIES} />

      {/* ── What's happening (trending) ─────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid #E5E7EB' }}>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px 10px' }}>
          <TrendingUp style={{ width: 18, height: 18, color: '#0a7ea4', flexShrink: 0 }} />
          <span style={{ fontFamily: FONT, fontSize: 17, fontWeight: 700, color: '#1A1A1A' }}>
            What&rsquo;s happening
          </span>
        </div>

        {/* Trend rows */}
        {TRENDING.map(({ tag, posts, category }) => (
          <div
            key={tag}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 20px',
              cursor: 'pointer',
              transition: 'background 0.12s',
              borderTop: '1px solid #F3F4F6',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div>
              <div style={{ fontFamily: FONT, fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>
                {category} · Trending
              </div>
              <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>
                {tag}
              </div>
              <div style={{ fontFamily: FONT, fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
                {posts} posts
              </div>
            </div>
            <button
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: FONT, fontSize: 16, color: '#9CA3AF',
                padding: '4px 8px', borderRadius: 999,
              }}
            >
              ···
            </button>
          </div>
        ))}

        {/* Show more */}
        <div style={{ padding: '10px 20px 14px' }}>
          <button
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: FONT, fontSize: 13, fontWeight: 600, color: '#0a7ea4',
            }}
          >
            Show more
          </button>
        </div>
      </div>

      {/* ── Posts feed ──────────────────────────────────────────────────────── */}
      <InfiniteScrollFeed initialPosts={initialPosts} />
    </>
  );
}

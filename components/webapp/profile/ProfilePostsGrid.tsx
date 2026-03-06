'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/types';
import {
  Heart, MessageCircle, PlayCircle,
  Grid3X3, Repeat2, Film, Image as ImageIcon, Video, ThumbsUp,
} from 'lucide-react';
import { useState } from 'react';

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

type TabId = 'posts' | 'replies' | 'reels' | 'media' | 'videos' | 'likes';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'posts',   label: 'Posts',   icon: <Grid3X3   size={14} /> },
  { id: 'replies', label: 'Replies', icon: <Repeat2   size={14} /> },
  { id: 'reels',   label: 'Reels',   icon: <Film      size={14} /> },
  { id: 'media',   label: 'Media',   icon: <ImageIcon size={14} /> },
  { id: 'videos',  label: 'Videos',  icon: <Video     size={14} /> },
  { id: 'likes',   label: 'Likes',   icon: <ThumbsUp  size={14} /> },
];

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

/* ─── Empty state ────────────────────────────────────────────────────────── */
function EmptyState({ tab }: { tab: TabId }) {
  const MAP: Record<TabId, { emoji: string; title: string; sub: string }> = {
    posts:   { emoji: '📝', title: 'No posts yet',          sub: 'When you share something, it will appear here.'     },
    replies: { emoji: '💬', title: 'No replies yet',        sub: 'Replies to other posts will show up here.'          },
    reels:   { emoji: '🎬', title: 'No Reels yet',          sub: 'Short-form videos you create will appear here.'     },
    media:   { emoji: '🖼️', title: 'No media yet',          sub: 'Photos and images you share will appear here.'      },
    videos:  { emoji: '🎥', title: 'No videos yet',         sub: 'Longer videos you upload will appear here.'         },
    likes:   { emoji: '❤️', title: 'No liked posts yet',    sub: 'Posts you like will show up here.'                  },
  };
  const { emoji, title, sub } = MAP[tab];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '56px 32px', textAlign: 'center', gap: 12 }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%', fontSize: 32,
        background: 'linear-gradient(135deg,rgba(10,126,164,0.08),rgba(236,72,153,0.08))',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4,
      }}>{emoji}</div>
      <p style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>{title}</p>
      <p style={{ fontFamily: FONT, fontSize: 14, color: '#9CA3AF', margin: 0, lineHeight: 1.5, maxWidth: 260 }}>{sub}</p>
    </div>
  );
}

/* ─── Media grid (3-col) ─────────────────────────────────────────────────── */
function MediaGrid({ posts, type }: { posts: Post[]; type: 'image' | 'video' }) {
  if (posts.length === 0) return <EmptyState tab={type === 'image' ? 'media' : 'videos'} />;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, background: '#F3F4F6' }}>
      {posts.map(post => (
        <div key={post.id} style={{ position: 'relative', aspectRatio: '1', background: '#E5E7EB', overflow: 'hidden', cursor: 'pointer' }}
          onMouseEnter={e => { const ov = e.currentTarget.querySelector('.ov') as HTMLElement; if (ov) ov.style.opacity = '1'; }}
          onMouseLeave={e => { const ov = e.currentTarget.querySelector('.ov') as HTMLElement; if (ov) ov.style.opacity = '0'; }}
        >
          <Link href={`/p/${post.id}`} style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ flex: 1, position: 'relative', width: '100%', minHeight: 0 }}>
              {post.image_url ? (
                <Image src={post.image_url} alt="" fill style={{ objectFit: 'cover', transition: 'transform 0.3s' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,rgba(10,126,164,0.2),rgba(236,72,153,0.2))' }} />
              )}
              {type === 'video' && (
                <PlayCircle style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, color: 'white', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />
              )}
            </div>
          </Link>
          {/* Hover overlay */}
          <div className="ov" style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
            opacity: 0, transition: 'opacity 0.2s',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: FONT, fontSize: 13, fontWeight: 700, color: 'white' }}>
              <Heart style={{ width: 16, height: 16, fill: 'white' }} /> {formatCount(post.likes_count)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: FONT, fontSize: 13, fontWeight: 700, color: 'white' }}>
              <MessageCircle style={{ width: 16, height: 16, fill: 'white' }} /> {formatCount(post.comments_count)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Post list (for Posts, Replies, Likes tabs) ─────────────────────────── */
function PostList({ posts, emptyTab }: { posts: Post[]; emptyTab: TabId }) {
  if (posts.length === 0) return <EmptyState tab={emptyTab} />;
  return (
    <div style={{ background: 'white' }}>
      {posts.map((post, i) => (
        <div key={post.id} style={{
          padding: '16px 20px',
          borderTop: i > 0 ? '1px solid #F3F4F6' : 'none',
          cursor: 'pointer', transition: 'background 0.12s',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          {/* Text content */}
          <p style={{ fontFamily: FONT, fontSize: 15, color: '#1A1A1A', lineHeight: 1.55, margin: '0 0 10px', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
            {post.content}
          </p>
          {/* Thumbnail if has media */}
          {post.image_url && (
            <div style={{ borderRadius: 12, overflow: 'hidden', height: 160, position: 'relative', marginBottom: 10 }}>
              <Image src={post.image_url} alt="" fill style={{ objectFit: 'cover' }} />
            </div>
          )}
          {/* Actions */}
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: FONT, fontSize: 13, color: '#9CA3AF' }}>
              <Heart style={{ width: 14, height: 14 }} /> {formatCount(post.likes_count)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: FONT, fontSize: 13, color: '#9CA3AF' }}>
              <MessageCircle style={{ width: 14, height: 14 }} /> {formatCount(post.comments_count)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Reels grid (shorter aspect ratio cards with play button) ───────────── */
function ReelsGrid({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return <EmptyState tab="reels" />;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, background: '#F3F4F6' }}>
      {posts.map(p => (
        <div key={p.id} style={{ position: 'relative', aspectRatio: '9/16', background: '#1A1A1A', overflow: 'hidden', cursor: 'pointer', maxHeight: 220 }}>
          {p.image_url && <Image src={p.image_url} alt="" fill style={{ objectFit: 'cover', opacity: 0.85 }} />}
          {/* Gradient footer */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.70) 0%,transparent 60%)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PlayCircle style={{ width: 22, height: 22, color: 'white' }} />
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 6, left: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Heart style={{ width: 12, height: 12, color: 'white', fill: 'white' }} />
            <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: 'white' }}>{formatCount(p.likes_count)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main export ────────────────────────────────────────────────────────── */
export function ProfilePostsGrid({ posts }: { posts: Post[] }) {
  const [tab, setTab] = useState<TabId>('posts');

  const mediaPosts  = posts.filter(p => p.image_url && !p.video_url);
  const videoPosts  = posts.filter(p => p.video_url || p.type === 'video');
  const reelsPosts  = posts.filter(p => p.type === 'reel' || (p.video_url && p.type !== 'video'));
  const allPosts    = posts.filter(p => p.type !== 'reel');

  const content: Record<TabId, React.ReactNode> = {
    posts:   <PostList   posts={allPosts}          emptyTab="posts"   />,
    replies: <PostList   posts={[]}                emptyTab="replies"  />,
    reels:   <ReelsGrid  posts={reelsPosts.length ? reelsPosts : mediaPosts.slice(0,3)} />,
    media:   <MediaGrid  posts={mediaPosts}         type="image"       />,
    videos:  <MediaGrid  posts={videoPosts}         type="video"       />,
    likes:   <PostList   posts={allPosts.slice(0,2)} emptyTab="likes"  />,
  };

  return (
    <div style={{ fontFamily: FONT }}>

      {/* ── Tab bar ─────────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', overflowX: 'auto',
        borderBottom: '1px solid #E5E7EB',
        background: 'white',
        position: 'sticky', top: 0, zIndex: 10,
      }} className="no-scrollbar">
        {TABS.map(({ id, label, icon }) => {
          const active = tab === id;
          return (
            <button key={id} onClick={() => setTab(id)} style={{
              flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: 6,
              paddingTop: 14, paddingBottom: 14, paddingLeft: 18, paddingRight: 18,
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: FONT, fontSize: 14,
              fontWeight: active ? 700 : 500,
              color: active ? '#1A1A1A' : '#9CA3AF',
              position: 'relative', transition: 'color 0.15s',
            }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#6B7280'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#9CA3AF'; }}
            >
              {/* Icon gets the gradient colour when active */}
              <span style={{ color: active ? '#0a7ea4' : 'inherit', transition: 'color 0.15s' }}>{icon}</span>
              {label}
              {active && (
                <span style={{
                  position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                  width: '60%', height: 3, borderRadius: 999,
                  background: 'linear-gradient(90deg,#0a7ea4,#EC4899)',
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab content ─────────────────────────────────────────────────────── */}
      {content[tab]}
    </div>
  );
}

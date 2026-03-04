'use client';

import { Bookmark } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getMockFeed } from '@/services/mockData';

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

export default function BookmarksPage() {
  const { data: posts } = getMockFeed(null, 5);
  const bookmarked = posts.slice(0, 3);

  return (
    <div style={{ minHeight: '100vh', fontFamily: FONT }}>
      {/* Header */}
      <div
        style={{
          position: 'sticky', top: 0, zIndex: 10,
          padding: '16px 20px',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Bookmark style={{ width: 20, height: 20, color: '#0a7ea4' }} />
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1A1A1A' }}>Bookmarks</h1>
        </div>
        <span style={{ fontSize: 13, color: '#9CA3AF' }}>{bookmarked.length} saved</span>
      </div>

      {bookmarked.length === 0 ? (
        <div style={{ padding: '96px 32px', textAlign: 'center' }}>
          <Bookmark style={{ width: 52, height: 52, color: '#E5E7EB', margin: '0 auto 16px' }} />
          <p style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A', margin: '0 0 6px' }}>No bookmarks yet</p>
          <p style={{ fontSize: 14, color: '#9CA3AF', margin: 0 }}>Save posts to find them easily later</p>
        </div>
      ) : (
        <div>
          {bookmarked.map(post => {
            const user        = post.users;
            const username    = user?.username ?? 'unknown';
            const displayName = user?.full_name ?? username;
            const avatarSrc   = user?.avatar;

            return (
              <div
                key={post.id}
                style={{
                  display: 'flex', gap: 12,
                  padding: '16px 20px',
                  borderBottom: '1px solid #F3F4F6',
                  cursor: 'pointer',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Avatar */}
                <Link href={`/profile/${username}`} style={{ flexShrink: 0, display: 'block' }}>
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: '50%', overflow: 'hidden',
                      background: 'linear-gradient(135deg, #0a7ea4, #EC4899)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {avatarSrc ? (
                      <Image src={avatarSrc} alt={username} width={40} height={40} style={{ objectFit: 'cover' }} />
                    ) : (
                      <span style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>
                        {username[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>{displayName}</span>
                    <span style={{ fontSize: 13, color: '#9CA3AF', marginLeft: 6 }}>@{username}</span>
                  </div>
                  {post.content && (
                    <p style={{
                      fontSize: 14, color: '#374151', lineHeight: 1.5, margin: '0 0 8px',
                      overflow: 'hidden', display: '-webkit-box',
                      WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const,
                    }}>
                      {post.content}
                    </p>
                  )}
                  {post.media_url && (
                    <div style={{ borderRadius: 12, overflow: 'hidden', height: 120, marginBottom: 8 }}>
                      <Image src={post.media_url} alt="Post" width={400} height={120} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#9CA3AF' }}>
                    <span>❤️ {post.likes_count?.toLocaleString()}</span>
                    <span>💬 {post.comments_count?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

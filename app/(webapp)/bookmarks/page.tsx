'use client';

import { Bookmark } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { MOCK_POSTS } from '@/services/mockData';

export default function BookmarksPage() {
  // Mock: treat first 3 posts as bookmarked
  const bookmarked = MOCK_POSTS.slice(0, 3);

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="sticky top-0 z-10 px-4 py-3 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--divider)' }}>
        <Bookmark className="w-5 h-5" style={{ color: 'var(--primary)' }} />
        <h1 className="text-[20px] font-bold" style={{ color: 'var(--text)', fontSize: '20px' }}>Bookmarks</h1>
        <span className="text-[13px] ml-auto" style={{ color: 'var(--text-secondary)' }}>{bookmarked.length} saved</span>
      </div>

      {bookmarked.length === 0 ? (
        <div className="py-24 text-center px-8" style={{ color: 'var(--text-secondary)' }}>
          <Bookmark className="w-14 h-14 mx-auto mb-4 opacity-20" />
          <p className="text-[17px] font-bold" style={{ color: 'var(--text)' }}>No bookmarks yet</p>
          <p className="text-[14px] mt-1">Save posts to find them easily later</p>
        </div>
      ) : (
        <div className="divide-y" style={{ borderColor: 'var(--divider)' }}>
          {bookmarked.map(post => {
            const user = post.users;
            const username = user?.username || 'unknown';
            const displayName = user?.full_name || username;
            const avatarSrc = user?.avatar;
            return (
              <div key={post.id} className="flex gap-3 px-4 py-4 transition-colors hover:bg-gray-50 cursor-pointer">
                <Link href={`/profile/${username}`} className="shrink-0">
                  <div className="w-9 h-9 rounded-full overflow-hidden" style={{ background: 'var(--gradient-primary)' }}>
                    {avatarSrc
                      ? <Image src={avatarSrc} alt={username} width={36} height={36} className="object-cover w-full h-full" />
                      : <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">{username[0]?.toUpperCase()}</div>
                    }
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[14px]" style={{ color: 'var(--text)' }}>{displayName}</p>
                  <p className="text-[12px] mb-2" style={{ color: 'var(--text-secondary)' }}>@{username}</p>
                  {post.content && <p className="text-[14px] leading-snug line-clamp-3" style={{ color: 'var(--text)' }}>{post.content}</p>}
                  {post.media_url && (
                    <div className="mt-2 rounded-xl overflow-hidden h-32">
                      <Image src={post.media_url} alt="Post" width={400} height={128} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
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

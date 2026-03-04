'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/types';
import { MessageCircle, Heart, Share2, MoreHorizontal, BadgeCheck, Bookmark } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';

interface PostCardProps {
  post: Post;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(!!post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [saved, setSaved] = useState(false);

  const isVideo = post.video_url || post.type === 'video' || post.type === 'reel';
  const hasImage = post.media_url || post.thumbnail_url;

  const handleLike = () => {
    setLiked((prev) => {
      setLikesCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
  };

  let dateText = '';
  try {
    dateText = formatDistanceToNowStrict(new Date(post.created_at)) + ' ago';
  } catch {
    dateText = 'Just now';
  }

  const user = post.users;
  const username = user?.username || 'unknown';
  const displayName = user?.full_name || user?.username || 'Unknown';
  const avatarSrc = user?.avatar;
  const isVerified = user?.isVerified;

  return (
    <article className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
      <div className="p-5 space-y-4">

        {/* Post Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 min-w-0">
            {/* Avatar */}
            <Link href={`/profile/${username}`} className="shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-tr from-[#0a7ea4]/20 via-[#8b5cf6]/20 to-[#ec4899]/20 border border-gray-100 relative">
                {avatarSrc ? (
                  <Image src={avatarSrc} alt={`${username} avatar`} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-[#0a7ea4] bg-[#0a7ea4]/10 text-sm">
                    {username[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
            </Link>

            {/* Name / handle / time */}
            <div className="min-w-0">
              <Link href={`/profile/${username}`} className="flex items-center gap-1">
                <span className="font-semibold text-[15px] text-gray-900 hover:underline truncate">{displayName}</span>
                {isVerified && (
                  <BadgeCheck
                    size={15}
                    className="shrink-0 text-transparent"
                    style={{ fill: 'url(#brandGradient)' }}
                  />
                )}
              </Link>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-sm text-gray-500 truncate hidden sm:block">@{username}</span>
                <span className="text-gray-300 text-xs">·</span>
                <span className="text-sm text-gray-400 whitespace-nowrap">{dateText}</span>
              </div>
            </div>
          </div>

          <button className="text-gray-400 hover:text-[#0a7ea4] p-1.5 rounded-full hover:bg-[#0a7ea4]/10 transition-all duration-200 shrink-0">
            <MoreHorizontal size={18} />
          </button>
        </div>

        {/* Text Content */}
        {post.content && (
          <p className="text-[15px] text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
            {post.content}
          </p>
        )}

        {/* Media */}
        {(hasImage || isVideo) && (
          <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex justify-center max-h-[520px]">
            {isVideo ? (
              <video
                src={post.video_url || post.media_url}
                controls
                playsInline
                preload="metadata"
                className="max-w-full max-h-[520px] object-contain"
              />
            ) : post.media_url ? (
              <Image
                src={post.media_url}
                alt="Post media"
                width={600}
                height={520}
                className="w-full h-auto object-cover max-h-[520px]"
              />
            ) : null}
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between text-gray-400 pt-1 border-t border-gray-100">
          {/* Comment */}
          <button className="flex items-center gap-1.5 group">
            <div className="p-2 rounded-full group-hover:bg-[#0a7ea4]/10 group-hover:text-[#0a7ea4] transition-all duration-200">
              <MessageCircle className="w-[18px] h-[18px]" />
            </div>
            <span className="text-[13px] group-hover:text-[#0a7ea4] transition-colors tabular-nums">
              {formatCount(post.comments_count || 0)}
            </span>
          </button>

          {/* Like */}
          <button onClick={handleLike} className="flex items-center gap-1.5 group">
            <div
              className={`p-2 rounded-full transition-all duration-200 ${
                liked
                  ? 'text-pink-500 bg-pink-50 scale-110'
                  : 'group-hover:bg-pink-500/10 group-hover:text-pink-500'
              }`}
            >
              <Heart className={`w-[18px] h-[18px] transition-all ${liked ? 'fill-current' : ''}`} />
            </div>
            <span className={`text-[13px] transition-colors tabular-nums ${liked ? 'text-pink-500 font-semibold' : 'group-hover:text-pink-500'}`}>
              {formatCount(likesCount)}
            </span>
          </button>

          {/* Share */}
          <button className="flex items-center gap-1.5 group">
            <div className="p-2 rounded-full group-hover:bg-green-500/10 group-hover:text-green-500 transition-all duration-200">
              <Share2 className="w-[18px] h-[18px]" />
            </div>
            <span className="text-[13px] group-hover:text-green-500 transition-colors tabular-nums">
              {formatCount(post.shares_count || 0)}
            </span>
          </button>

          {/* Save */}
          <button onClick={() => setSaved((s) => !s)} className="group">
            <div
              className={`p-2 rounded-full transition-all duration-200 ${
                saved
                  ? 'text-[#0a7ea4]'
                  : 'group-hover:bg-[#0a7ea4]/10 group-hover:text-[#0a7ea4]'
              }`}
            >
              <Bookmark className={`w-[18px] h-[18px] ${saved ? 'fill-current' : ''}`} />
            </div>
          </button>
        </div>

      </div>
    </article>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/types';
import { MessageCircle, Heart, Share2, MoreHorizontal, BadgeCheck, Bookmark, Repeat2 } from 'lucide-react';
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
    <article className="flex px-4 pt-4 pb-2 border-b border-gray-200 hover:bg-gray-50/60 transition-colors duration-150 cursor-pointer">

      {/* Avatar column */}
      <Link href={`/profile/${username}`} className="shrink-0 mr-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-tr from-[#0a7ea4]/20 via-[#8b5cf6]/20 to-[#ec4899]/20 relative">
          {avatarSrc ? (
            <Image src={avatarSrc} alt={`${username}`} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-[#0a7ea4] text-sm">
              {username[0]?.toUpperCase() || 'U'}
            </div>
          )}
        </div>
      </Link>

      {/* Content column */}
      <div className="flex-1 min-w-0">

        {/* Header: name · handle · time · more */}
        <div className="flex items-start justify-between gap-1 mb-0.5">
          <div className="flex items-center gap-1 flex-wrap min-w-0">
            <Link href={`/profile/${username}`} className="flex items-center gap-0.5 min-w-0">
              <span className="font-bold text-[15px] text-gray-900 hover:underline truncate">{displayName}</span>
              {isVerified && (
                <BadgeCheck
                  size={16}
                  className="shrink-0 text-transparent"
                  style={{ fill: 'url(#brandGradient)' }}
                />
              )}
            </Link>
            <span className="text-[15px] text-gray-500 truncate hidden sm:block">@{username}</span>
            <span className="text-gray-400 text-[13px]">·</span>
            <span className="text-[14px] text-gray-500 whitespace-nowrap hover:underline cursor-pointer">{dateText}</span>
          </div>
          <button className="shrink-0 p-1.5 rounded-full text-gray-500 hover:text-[#0a7ea4] hover:bg-[#0a7ea4]/10 transition-all duration-200 ml-1">
            <MoreHorizontal size={17} />
          </button>
        </div>

        {/* Text */}
        {post.content && (
          <p className="text-[15px] text-gray-900 leading-normal whitespace-pre-wrap break-words mb-3">
            {post.content}
          </p>
        )}

        {/* Media */}
        {(hasImage || isVideo) && (
          <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 mb-3 max-h-[512px] flex justify-center">
            {isVideo ? (
              <video
                src={post.video_url || post.media_url}
                controls
                playsInline
                preload="metadata"
                className="max-w-full max-h-[512px] object-contain"
              />
            ) : post.media_url ? (
              <Image
                src={post.media_url}
                alt="Post media"
                width={600}
                height={512}
                className="w-full h-auto object-cover max-h-[512px]"
              />
            ) : null}
          </div>
        )}

        {/* Action Bar — Twitter style */}
        <div className="flex items-center justify-between max-w-[360px] -ml-2">
          {/* Comment */}
          <button className="flex items-center gap-1 group text-gray-500">
            <div className="p-2 rounded-full group-hover:bg-[#0a7ea4]/10 group-hover:text-[#0a7ea4] transition-all duration-200">
              <MessageCircle size={18} />
            </div>
            <span className="text-sm group-hover:text-[#0a7ea4] transition-colors tabular-nums">
              {formatCount(post.comments_count || 0)}
            </span>
          </button>

          {/* Repost */}
          <button className="flex items-center gap-1 group text-gray-500">
            <div className="p-2 rounded-full group-hover:bg-green-500/10 group-hover:text-green-500 transition-all duration-200">
              <Repeat2 size={18} />
            </div>
            <span className="text-sm group-hover:text-green-500 transition-colors tabular-nums">
              {formatCount(post.shares_count || 0)}
            </span>
          </button>

          {/* Like */}
          <button onClick={handleLike} className="flex items-center gap-1 group text-gray-500">
            <div className={`p-2 rounded-full transition-all duration-200 ${
              liked ? 'text-pink-500 bg-pink-50' : 'group-hover:bg-pink-500/10 group-hover:text-pink-500'
            }`}>
              <Heart size={18} className={liked ? 'fill-current' : ''} />
            </div>
            <span className={`text-sm transition-colors tabular-nums ${liked ? 'text-pink-500' : 'group-hover:text-pink-500'}`}>
              {formatCount(likesCount)}
            </span>
          </button>

          {/* Bookmark */}
          <button onClick={() => setSaved((s) => !s)} className="group text-gray-500">
            <div className={`p-2 rounded-full transition-all duration-200 ${
              saved ? 'text-[#0a7ea4]' : 'group-hover:bg-[#0a7ea4]/10 group-hover:text-[#0a7ea4]'
            }`}>
              <Bookmark size={18} className={saved ? 'fill-current' : ''} />
            </div>
          </button>

          {/* Share */}
          <button className="group text-gray-500">
            <div className="p-2 rounded-full group-hover:bg-[#0a7ea4]/10 group-hover:text-[#0a7ea4] transition-all duration-200">
              <Share2 size={18} />
            </div>
          </button>
        </div>
      </div>
    </article>
  );
}

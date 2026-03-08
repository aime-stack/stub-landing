'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/types';
import { Heart, MessageCircle, Share2, MoreHorizontal, Music } from 'lucide-react';
import { likePost, unlikePost, sharePostExternally } from '@/services/interactions';
import { CommentsModal } from '@/components/webapp/feed/CommentsModal';
import { VideoPlayer } from './VideoPlayer';

interface ReelCardProps {
  reel: Post;
  isActive: boolean;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

export function ReelCard({ reel, isActive }: ReelCardProps) {
  const [liked, setLiked] = useState(!!reel.is_liked);
  const [likesCount, setLikesCount] = useState(reel.likes_count || 0);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !liked;
    // Optimistic Update
    setLiked(next);
    setLikesCount(prev => next ? prev + 1 : Math.max(0, prev - 1));

    try {
      if (next) await likePost(reel.id);
      else await unlikePost(reel.id);
    } catch (err) {
      // Rollback
      setLiked(!next);
      setLikesCount(prev => !next ? prev + 1 : Math.max(0, prev - 1));
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Stubgram Reel by ${displayName}`,
          text: reel.content || 'Check out this Reel on Stubgram!',
          url: `${window.location.origin}/reels?id=${reel.id}`
        });
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/reels?id=${reel.id}`);
      }
      await sharePostExternally(reel.id);
    } catch (err) {
      console.error('Native reel share failed', err);
    }
  };

  const user = reel.users;
  const username = user?.username ?? 'unknown';
  const displayName = user?.full_name || username;
  const avatarSrc = user?.avatar_url;

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center snap-always snap-center overflow-hidden">
      
      {/* Optimized Video Player */}
      <VideoPlayer 
        src={reel.video_url || ''} 
        thumbnailUrl={reel.thumbnail_url || ''}
        isActive={isActive}
        onClick={() => {}} // Play/pause handled internally or can be passed
      />

      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none">
        <h2 className="text-white font-bold text-lg drop-shadow-md">Reels</h2>
      </div>

      {/* Bottom Overlay — user info & caption */}
      <div className="absolute bottom-0 left-0 right-16 p-4 pt-12 bg-gradient-to-t from-black via-black/60 to-transparent z-10 pointer-events-none">

        {/* User row */}
        <div className="flex items-center gap-3 mb-3 pointer-events-auto">
          {/* Avatar */}
          <Link href={`/profile/${username}`} className="shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 relative">
              {avatarSrc ? (
                <Image src={avatarSrc} alt={username} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-[#0a7ea4] to-[#EC4899] flex items-center justify-center text-white font-bold">
                  {username[0]?.toUpperCase()}
                </div>
              )}
            </div>
          </Link>

          {/* Username */}
          <Link
            href={`/profile/${username}`}
            className="pointer-events-auto hover:underline"
            style={{ 
              color: '#FFFFFF', 
              fontWeight: '800', 
              fontSize: '17px',
              textShadow: '0 2px 4px rgba(0,0,0,0.8)',
              zIndex: 50
            }}
          >
            {displayName}
          </Link>

          <button className="shrink-0 ml-3 px-5 py-1.5 bg-white text-black rounded-full text-[13px] font-bold hover:bg-gray-100 active:scale-95 transition-all shadow-sm border border-white/10">
            Follow
          </button>
        </div>

        {/* Caption */}
        {reel.content && (
          <p className="text-white text-[14px] leading-snug drop-shadow-lg font-medium mb-3 line-clamp-2">
            {reel.content.split(/((?:#|@)[\w.]+)/g).map((part, i) =>
              /^[#@][\w.]+$/.test(part)
                ? <span key={i} className="font-bold text-white">{part}</span>
                : <span key={i} className="text-white">{part}</span>
            )}
          </p>
        )}

        {/* Audio marquee */}
        <div className="flex items-center gap-2 max-w-[200px] overflow-hidden">
          <Music size={14} className="text-white shrink-0" />
          <div className="flex whitespace-nowrap animate-marquee">
            <span className="text-white text-[13px] drop-shadow-md">
              {displayName} • Original Audio
            </span>
          </div>
        </div>
      </div>

      {/* Right Action Bar */}
      <div className="absolute bottom-4 right-2 w-14 flex flex-col items-center gap-4 z-10 pb-4">

        {/* Like */}
        <button onClick={handleLike} className="flex flex-col items-center gap-1 group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-black/40 transition">
            <Heart
              size={24}
              className={`transition-all duration-200 ${liked ? 'fill-[#FF3B30] text-[#FF3B30] scale-110' : 'text-white scale-100'}`}
            />
          </div>
          <span className="text-white text-[12px] font-semibold drop-shadow-md">
            {formatCount(likesCount)}
          </span>
        </button>

        {/* Comment */}
        <button onClick={(e) => { e.stopPropagation(); setShowComments(true); }} className="flex flex-col items-center gap-1 group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-black/40 transition">
            <MessageCircle size={24} className="text-white" />
          </div>
          <span className="text-white text-[12px] font-semibold drop-shadow-md">
            {formatCount(reel.comments_count || 0)}
          </span>
        </button>

        {/* Share */}
        <button onClick={handleShare} className="flex flex-col items-center gap-1 group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-black/40 transition">
            <Share2 size={24} className="text-white" />
          </div>
          <span className="text-white text-[12px] font-semibold drop-shadow-md">
            {formatCount(reel.shares_count || 0)}
          </span>
        </button>

        {/* More Options */}
        <button className="flex flex-col items-center gap-1 group cursor-pointer">
          <div className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-black/40 transition">
            <MoreHorizontal size={24} className="text-white" />
          </div>
        </button>

        {/* Spinning Audio Thumbnail */}
        <div className="mt-2 w-8 h-8 rounded-md bg-black border border-white/30 flex items-center justify-center overflow-hidden animate-spin-slow">
          {avatarSrc ? (
            <Image src={avatarSrc} alt="audio" width={32} height={32} className="object-cover" />
          ) : (
            <Music size={16} className="text-white" />
          )}
        </div>
      </div>

      {showComments && <CommentsModal postId={reel.id} onClose={() => setShowComments(false)} />}
    </div>
  );
}

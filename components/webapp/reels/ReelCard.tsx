'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/types';
import { Heart, MessageCircle, Share2, MoreHorizontal, Music } from 'lucide-react';
import { likePost, unlikePost } from '@/services/interactions';
import { CommentsModal } from '@/components/webapp/feed/CommentsModal';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playIconTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // FIX 1: Removed autoPlay={isActive} from <video> — autoPlay only fires on mount,
  // not when isActive changes. The useEffect below handles all play/pause logic reliably.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      // Reset to beginning when becoming active so it always starts fresh
      video.currentTime = 0;
      video.play().catch(() => {
        // Autoplay may be blocked; user must tap to play
        setIsPlaying(false);
      });
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }

    return () => {
      // Cleanup: pause if component unmounts while active
      video.pause();
    };
  }, [isActive]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(() => {});
      setIsPlaying(true);
    }

    // Show the play/pause icon briefly as visual feedback
    setShowPlayIcon(true);
    if (playIconTimerRef.current) clearTimeout(playIconTimerRef.current);
    playIconTimerRef.current = setTimeout(() => setShowPlayIcon(false), 800);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !liked;
    setLiked(next);
    setLikesCount(prev => next ? prev + 1 : Math.max(0, prev - 1));
    try {
      if (next) await likePost(reel.id);
      else await unlikePost(reel.id);
    } catch (err) {
      setLiked(!next);
      setLikesCount(prev => !next ? prev + 1 : Math.max(0, prev - 1));
    }
  };

  const user = reel.users;
  const username = user?.username ?? 'unknown';
  const displayName = user?.full_name || username;
  const avatarSrc = user?.avatar_url;

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center snap-always snap-center overflow-hidden">

      {/* Video — FIX: removed autoPlay={isActive}; useEffect handles play/pause */}
      {reel.video_url ? (
        <video
          ref={videoRef}
          src={reel.video_url}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
          loop
          playsInline
          muted
          preload="metadata"
          onClick={togglePlay}
        />
      ) : (
        // Fallback placeholder when no video_url is available (e.g. during dev with mock data)
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 opacity-40">
            <Music size={48} className="text-white" />
            <span className="text-white text-sm font-medium">No video available</span>
          </div>
        </div>
      )}

      {/* Tap feedback: play/pause icon flash */}
      {showPlayIcon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-20 h-20 rounded-full bg-black/50 flex items-center justify-center text-white animate-ping-once">
            {isPlaying ? (
              // Pause icon
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              // Play icon
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
        </div>
      )}

      {/* Persistent play indicator when paused (only show when not animating) */}
      {!isPlaying && !showPlayIcon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/10 z-10">
          <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center text-white backdrop-blur-sm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

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
                <div className="w-full h-full bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold">
                  {username[0]?.toUpperCase()}
                </div>
              )}
            </div>
          </Link>

          {/* Username */}
          <Link
            href={`/profile/${username}`}
            className="text-white font-semibold text-[15px] hover:underline drop-shadow-md truncate max-w-[120px]"
          >
            {displayName}
          </Link>

          {/* FIX 2: Follow button — ml-1 → ml-3, px-4 → px-5, added shrink-0 and border */}
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
        <button onClick={handleLike} className="flex flex-col items-center gap-1 group">
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
        <button onClick={(e) => { e.stopPropagation(); setShowComments(true); }} className="flex flex-col items-center gap-1 group">
          <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-black/40 transition">
            <MessageCircle size={24} className="text-white" />
          </div>
          <span className="text-white text-[12px] font-semibold drop-shadow-md">
            {formatCount(reel.comments_count || 0)}
          </span>
        </button>

        {/* Share */}
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-black/40 transition">
            <Share2 size={24} className="text-white" />
          </div>
          <span className="text-white text-[12px] font-semibold drop-shadow-md">
            {formatCount(reel.shares_count || 0)}
          </span>
        </button>

        {/* More Options */}
        <button className="flex flex-col items-center gap-1 group">
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
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/types';
import { Heart, MessageCircle, Share2, MoreHorizontal, Music } from 'lucide-react';

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
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive) {
      videoRef.current?.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  const user = reel.users;
  const username = user?.username || 'unknown';
  const displayName = user?.full_name || username;
  const avatarSrc = user?.avatar;

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center snap-always snap-center overflow-hidden">
      {/* Video */}
      {reel.video_url && (
        <video
          ref={videoRef}
          src={reel.video_url}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
          loop
          playsInline
          muted
          autoPlay={isActive}
          onClick={togglePlay}
        />
      )}

      {/* Play/Pause overlay indicator (optional visual feedback) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
          <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none">
        <h2 className="text-white font-bold text-lg drop-shadow-md" style={{ color: '#FFFFFF' }}>Reels</h2>
      </div>

      {/* Bottom Overlay (User info & Caption) */}
      <div className="absolute bottom-0 left-0 right-16 p-4 pt-12 bg-gradient-to-t from-black via-black/60 to-transparent z-10 pointer-events-none">
        <div className="flex items-center gap-3 mb-3 pointer-events-auto">
          <Link href={`/profile/${username}`}>
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
          <div className="flex flex-col">
            <Link href={`/profile/${username}`} className="text-white font-semibold text-[15px] hover:underline drop-shadow-md" style={{ color: '#FFFFFF' }}>
              {displayName}
            </Link>
          </div>
          <button className="px-4 py-1.5 ml-1 bg-white text-black rounded-full text-[13px] font-bold hover:bg-gray-200 transition-colors shadow-sm">
            Follow
          </button>
        </div>
        
        {reel.content && (
          <p className="text-white text-[14px] leading-snug drop-shadow-lg font-medium mb-3 line-clamp-2" style={{ color: '#FFFFFF' }}>
            {/* Simple rich text parser for hashtags to keep them white but bold */}
            {reel.content.split(/((?:#|@)[\w.]+)/g).map((part, i) => 
               /^[#@][\w.]+$/.test(part) ? <span key={i} className="font-bold text-white" style={{ color: '#FFFFFF' }}>{part}</span> : <span key={i} style={{ color: '#FFFFFF' }}>{part}</span>
            )}
          </p>
        )}

        <div className="flex items-center gap-2 max-w-[200px] overflow-hidden">
          <Music size={14} className="text-white shrink-0" />
          <div className="flex whitespace-nowrap animate-marquee">
            <span className="text-white text-[13px] drop-shadow-md" style={{ color: '#FFFFFF' }}>
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
            <Heart size={24} className={`transition-colors ${liked ? 'fill-[#FF3B30] text-[#FF3B30]' : 'text-white'}`} />
          </div>
          <span className="text-white text-[12px] font-semibold drop-shadow-md" style={{ color: '#FFFFFF' }}>
            {formatCount(likesCount)}
          </span>
        </button>

        {/* Comment */}
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-black/40 transition">
            <MessageCircle size={24} className="text-white" />
          </div>
          <span className="text-white text-[12px] font-semibold drop-shadow-md" style={{ color: '#FFFFFF' }}>
            {formatCount(reel.comments_count || 0)}
          </span>
        </button>

        {/* Share */}
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-black/40 transition">
            <Share2 size={24} className="text-white" />
          </div>
          <span className="text-white text-[12px] font-semibold drop-shadow-md" style={{ color: '#FFFFFF' }}>
            {formatCount(reel.shares_count || 0)}
          </span>
        </button>

        {/* More Options */}
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-black/40 transition">
            <MoreHorizontal size={24} className="text-white" />
          </div>
        </button>

        {/* Audio Thumbnail */}
        <div className="mt-2 w-8 h-8 rounded-md bg-black border border-white flex items-center justify-center overflow-hidden animate-spin-slow">
          {avatarSrc ? (
             <Image src={avatarSrc} alt="audio" width={32} height={32} className="object-cover" />
          ) : (
            <Music size={16} className="text-white" />
          )}
        </div>
      </div>
    </div>
  );
}

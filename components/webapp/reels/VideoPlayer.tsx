'use client';

import { useRef, useEffect, useState } from 'react';
import { Music } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  thumbnailUrl?: string;
  isActive: boolean;
  onClick?: () => void;
}

export function VideoPlayer({ src, thumbnailUrl, isActive, onClick }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(false);

  // Resolution switching logic based on connection
  const [videoSrc, setVideoSrc] = useState(src);

  useEffect(() => {
    // Check if browser supports Network Information API
    const conn = (navigator as any).connection;
    if (conn) {
      const isSlow = conn.effectiveType === '2g' || conn.effectiveType === '3g' || conn.saveData;
      if (isSlow) {
        // Assume _480 suffix for low-res as per requirements
        const lowRes = src.replace(/\.(mp4|webm|mov)$/i, '_480.$1');
        setVideoSrc(lowRes);
      }
    }
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.play().catch((err) => {
        console.warn('[VideoPlayer] Autoplay failed:', err);
      });
    } else {
      video.pause();
    }
  }, [isActive, videoSrc]);

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
      {/* Thumbnail shown while video is not ready or if it's inactive (to save memory/cpu) */}
      {thumbnailUrl && !isReady && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnailUrl}
          alt="Thumbnail"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {src ? (
        <video
          ref={videoRef}
          src={videoSrc}
          className={`absolute inset-0 w-full h-full object-cover cursor-pointer transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}
          loop
          playsInline
          muted
          preload="none" // Requirements: Lazy Video Loading
          onCanPlay={() => setIsReady(true)}
          onError={() => setError(true)}
          onClick={onClick}
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
          <Music size={48} className="text-white/20" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <span className="text-white text-sm">Failed to load video</span>
        </div>
      )}
    </div>
  );
}

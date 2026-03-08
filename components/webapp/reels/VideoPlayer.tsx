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

  const [videoSrc, setVideoSrc] = useState(src);
  const [isFallingBack, setIsFallingBack] = useState(false);

  useEffect(() => {
    // Reset state when source changes
    setIsFallingBack(false);
    setError(false);
    setIsReady(false);
    
    // Check if browser supports Network Information API
    const conn = (navigator as any).connection;
    if (conn) {
      const isSlow = conn.effectiveType === '2g' || conn.effectiveType === '3g' || conn.saveData;
      if (isSlow) {
        // Assume _480 suffix for low-res
        const lowRes = src.replace(/\.(mp4|webm|mov)$/i, '_480.$1');
        if (lowRes !== src) {
          setVideoSrc(lowRes);
          return;
        }
      }
    }
    setVideoSrc(src);
  }, [src]);

  const handleVideoError = () => {
    // If the error happened on a modified URL (low-res), try falling back to original
    if (videoSrc !== src && !isFallingBack) {
      console.warn('[VideoPlayer] Low-res failed, falling back to original source');
      setVideoSrc(src);
      setIsFallingBack(true);
      setIsReady(false); // Reset ready state for fallback source
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // When videoSrc changes without a key change, we need to load it
    video.load();

    if (isActive) {
      video.play().catch((err) => {
        console.warn('[VideoPlayer] Play interrupted or blocked:', err);
      });
    } else {
      video.pause();
    }
  }, [isActive, videoSrc]);

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
      {/* 
        Thumbnail layer - always present but fades out 
        This prevents the "black flash" when the video element is loading/playing
      */}
      {thumbnailUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnailUrl}
          alt="Thumbnail"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 z-0 ${isReady ? 'opacity-0' : 'opacity-100'}`}
        />
      )}

      {src ? (
        <video
          ref={videoRef}
          src={videoSrc}
          className={`absolute inset-0 w-full h-full object-cover cursor-pointer transition-opacity duration-700 z-10 ${isReady ? 'opacity-100' : 'opacity-0'}`}
          loop
          playsInline
          muted
          preload="auto"
          onPlaying={() => setIsReady(true)} // onPlaying is more reliable than onCanPlay for "visual" ready
          onError={handleVideoError}
          onClick={onClick}
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center z-10">
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

'use client';

import { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  thumbnailUrl?: string;
  isActive: boolean;
  onClick?: () => void;
}

// Shared state via a simple global (works in Next.js SPA navigation)
let globalIsMuted = true;

export function VideoPlayer({ src, thumbnailUrl, isActive, onClick }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(false);
  const [isMuted, setIsMuted] = useState(globalIsMuted);

  const [videoSrc, setVideoSrc] = useState(src);
  const [isFallingBack, setIsFallingBack] = useState(false);

  // Sync with global state
  useEffect(() => {
    const handleMuteChange = () => setIsMuted(globalIsMuted);
    window.addEventListener('reels-mute-change', handleMuteChange);
    return () => window.removeEventListener('reels-mute-change', handleMuteChange);
  }, []);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    globalIsMuted = !isMuted;
    setIsMuted(globalIsMuted);
    window.dispatchEvent(new CustomEvent('reels-mute-change'));
  };

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
      setIsReady(false);
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Load necessary for source changes
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
      {/* Thumbnail layer */}
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
          muted={isMuted}
          preload="auto"
          onPlaying={() => setIsReady(true)}
          onError={handleVideoError}
          onClick={onClick}
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center z-10">
          <Music size={48} className="text-white/20" />
        </div>
      )}

      {/* Mute/Unmute Toggle Overlay */}
      <button 
        onClick={toggleMute}
        className="absolute bottom-4 left-4 p-2.5 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md z-20 transition-all active:scale-95 shadow-lg border border-white/10"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {error && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-30 p-4 text-center">
          <Music size={32} className="text-white/40 mb-2" />
          <span className="text-white text-sm font-medium">Failed to load video</span>
        </div>
      )}
    </div>
  );
}

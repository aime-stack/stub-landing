'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Story } from '@/types';
import { formatDistanceToNowStrict } from 'date-fns';

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

const STORY_DURATION_MS = 5000;

export function StoryViewer({ stories, initialIndex, onClose }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);

  const current = stories[currentIndex];

  const goNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((i) => i + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setProgress(0);
    }
  };

  // Auto-advance timer
  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 100 / (STORY_DURATION_MS / 100);
      });
    }, 100);

    const timeout = setTimeout(goNext, STORY_DURATION_MS);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [currentIndex, goNext]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, goNext]);

  if (!current) return null;

  const timeText = (() => {
    try {
      return formatDistanceToNowStrict(new Date(current.created_at)) + ' ago';
    } catch {
      return 'Just now';
    }
  })();

  return (
    <div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      onClick={onClose}
    >
      {/* Story Card */}
      <div
        className="relative w-full max-w-[420px] h-[100dvh] sm:h-[85vh] sm:rounded-2xl overflow-hidden bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bars */}
        <div className="absolute top-3 inset-x-3 z-20 flex gap-1">
          {stories.map((s, i) => (
            <div key={s.id} className="flex-1 h-[3px] rounded-full bg-white/30 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-none"
                style={{
                  width:
                    i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-8 inset-x-3 z-20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shrink-0">
            {current.user.avatar_url ? (
              <Image src={current.user.avatar_url} alt={current.user.username} width={40} height={40} className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[#0a7ea4] to-[#ec4899] flex items-center justify-center text-white font-bold text-sm">
                {current.user.username[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">@{current.user.username}</p>
            <p className="text-white/70 text-xs">{timeText}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            aria-label="Close story"
          >
            <X size={18} />
          </button>
        </div>

        {/* Media */}
        <div className="w-full h-full">
          <Image
            src={current.media_url}
            alt={current.caption || 'Story'}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

        {/* Caption */}
        {current.caption && (
          <div className="absolute bottom-6 inset-x-4 z-20">
            <p className="text-white text-[15px] font-medium drop-shadow-md">{current.caption}</p>
          </div>
        )}

        {/* Tap zones */}
        <button
          className="absolute left-0 top-0 w-1/3 h-full z-10 focus:outline-none"
          onClick={goPrev}
          aria-label="Previous story"
        />
        <button
          className="absolute right-0 top-0 w-1/3 h-full z-10 focus:outline-none"
          onClick={goNext}
          aria-label="Next story"
        />

        {/* Arrow hints (desktop) */}
        {currentIndex > 0 && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none hidden sm:flex">
            <ChevronLeft size={28} className="text-white/70" />
          </div>
        )}
        {currentIndex < stories.length - 1 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none hidden sm:flex">
            <ChevronRight size={28} className="text-white/70" />
          </div>
        )}
      </div>
    </div>
  );
}

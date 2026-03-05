'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

export function ImageGallery({ images, initialIndex = 0, onClose }: ImageGalleryProps) {
  const [index, setIndex] = useState(initialIndex);

  // Keyboard navigation & close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIndex(i => (i < images.length - 1 ? i + 1 : i));
      if (e.key === 'ArrowLeft')  setIndex(i => (i > 0 ? i - 1 : i));
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // prevent background scrolling
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [images.length, onClose]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index < images.length - 1) setIndex(i => i + 1);
  };
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index > 0) setIndex(i => i - 1);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      {/* Top right close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 20, right: 24, zIndex: 10,
          background: 'rgba(255,255,255,0.1)', border: 'none',
          width: 44, height: 44, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'white', transition: 'background 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
      >
        <X size={24} />
      </button>

      {/* Main Image Container */}
      <div
        style={{
          position: 'relative', width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '40px 80px', // room for navigation arrows
        }}
      >
        {/* Left Arrow */}
        {index > 0 && (
          <button
            onClick={handlePrev}
            style={{
              position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.1)', border: 'none',
              width: 52, height: 52, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'white', transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          >
            <ChevronLeft size={32} />
          </button>
        )}

        {/* The Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index]}
          alt={`Gallery image ${index + 1}`}
          onClick={e => e.stopPropagation()} // don't close when clicking the image itself
          style={{
            maxWidth: '100%', maxHeight: '100%',
            objectFit: 'contain', borderRadius: 8,
            boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            userSelect: 'none',
          }}
        />

        {/* Right Arrow */}
        {index < images.length - 1 && (
          <button
            onClick={handleNext}
            style={{
              position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.1)', border: 'none',
              width: 52, height: 52, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'white', transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          >
            <ChevronRight size={32} />
          </button>
        )}
      </div>

      {/* Thumbnails / Indicators at the bottom */}
      {images.length > 1 && (
        <div style={{ position: 'absolute', bottom: 32, display: 'flex', gap: 8 }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setIndex(i); }}
              style={{
                width: 48, height: 48, padding: 0,
                borderRadius: 8, border: i === index ? '2px solid white' : '2px solid transparent',
                overflow: 'hidden', cursor: 'pointer',
                opacity: i === index ? 1 : 0.5,
                transition: 'all 0.2s',
                background: 'rgba(255,255,255,0.1)',
              }}
              onMouseEnter={e => { if (i !== index) e.currentTarget.style.opacity = '0.8'; }}
              onMouseLeave={e => { if (i !== index) e.currentTarget.style.opacity = '0.5'; }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

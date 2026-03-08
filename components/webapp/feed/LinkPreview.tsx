'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';

interface LinkPreviewProps {
  metadata: {
    title?: string | null;
    description?: string | null;
    image?: string | null;
    url?: string;
    siteName?: string | null;
  };
}

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

export function LinkPreview({ metadata }: LinkPreviewProps) {
  const { title, description, image, url } = metadata;
  
  if (!title && !description) return null;

  return (
    <div 
      onClick={(e) => {
        e.stopPropagation();
        if (url) window.open(url, '_blank', 'noreferrer');
      }}
      style={{
        borderRadius: 16,
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
        background: 'white',
        cursor: 'pointer',
        marginTop: 12,
        marginBottom: 12,
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#D1D5DB';
        e.currentTarget.style.background = '#F9FAFB';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#E5E7EB';
        e.currentTarget.style.background = 'white';
      }}
    >
      {image && (
        <div style={{ width: '100%', height: 200, position: 'relative', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={image} 
            alt={title || 'Preview'} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
      )}
      <div style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <ExternalLink style={{ width: 12, height: 12, color: '#9CA3AF' }} />
          <span style={{ 
            fontFamily: FONT, 
            fontSize: 11, 
            color: '#9CA3AF', 
            fontWeight: 600, 
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {new URL(url || '').hostname.replace(/^www\./, '')}
          </span>
        </div>
        
        {title && (
          <div style={{ 
            fontFamily: FONT, 
            fontSize: 15, 
            fontWeight: 700, 
            color: '#1A1A1A', 
            lineHeight: 1.4,
            marginBottom: 4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {title}
          </div>
        )}
        
        {description && (
          <div style={{ 
            fontFamily: FONT, 
            fontSize: 13, 
            color: '#6B7280', 
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {description}
          </div>
        )}
      </div>
    </div>
  );
}

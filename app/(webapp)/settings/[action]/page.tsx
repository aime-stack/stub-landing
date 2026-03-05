'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Sliders, Shield, Lock, Bell, Users, BookOpen, User } from 'lucide-react';

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

export default function SettingsActionPage({ params }: { params: { action: string } | Promise<{ action: string }> }) {
  // Safe unwrapping for params (compatible with Next.js 13/14 and 15+)
  const unwrappedParams = React.use ? React.use(params as any) : params as any;
  const actionSlug = unwrappedParams?.action || 'setting';
  
  // Format slug to readable title
  const title = actionSlug
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Determine an icon based on slug keywords
  let Icon = Sliders;
  let gradient = 'linear-gradient(135deg,rgba(10,126,164,0.1),rgba(139,92,246,0.1))';
  let iconColor = '#0a7ea4';
  
  if (actionSlug.includes('security') || actionSlug.includes('password') || actionSlug.includes('factor')) {
    Icon = Shield;
    gradient = 'linear-gradient(135deg,rgba(16,185,129,0.1),rgba(10,126,164,0.1))';
    iconColor = '#10B981';
  } else if (actionSlug.includes('privacy') || actionSlug.includes('activity')) {
    Icon = Lock;
    gradient = 'linear-gradient(135deg,rgba(139,92,246,0.1),rgba(236,72,153,0.1))';
    iconColor = '#8b5cf6';
  } else if (actionSlug.includes('notification')) {
    Icon = Bell;
    gradient = 'linear-gradient(135deg,rgba(245,158,11,0.1),rgba(239,68,68,0.1))';
    iconColor = '#F59E0B';
  } else if (actionSlug.includes('contact') || actionSlug.includes('discover')) {
    Icon = Users;
    gradient = 'linear-gradient(135deg,rgba(236,72,153,0.1),rgba(245,158,11,0.1))';
    iconColor = '#EC4899';
  } else if (actionSlug.includes('policy') || actionSlug.includes('center') || actionSlug.includes('terms') || actionSlug.includes('about')) {
    Icon = BookOpen;
    gradient = 'linear-gradient(135deg,rgba(55,65,81,0.1),rgba(26,26,26,0.1))';
    iconColor = '#374151';
  } else if (actionSlug.includes('account') || actionSlug.includes('profile')) {
    Icon = User;
    gradient = 'linear-gradient(135deg,rgba(10,126,164,0.1),rgba(139,92,246,0.1))';
    iconColor = '#0a7ea4';
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: FONT, paddingBottom: 60 }}>
      {/* ── Sticky header ───────────────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E5E7EB',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <Link href="/settings" style={{
          width: 36, height: 36, borderRadius: '50%',
          background: '#F3F4F6',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          textDecoration: 'none', color: '#374151',
          transition: 'background 0.2s'
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#E5E7EB')}
        onMouseLeave={e => (e.currentTarget.style.background = '#F3F4F6')}
        >
          <ChevronLeft style={{ width: 20, height: 20 }} />
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: 0, fontFamily: FONT, fontSize: 18, fontWeight: 800, color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0, fontFamily: FONT, fontSize: 13, color: '#6B7280' }}>
            <Link href="/settings" style={{ color: '#6B7280', textDecoration: 'none' }}>Settings</Link>
            <span>/</span>
            <span style={{ color: iconColor, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
          </div>
        </div>
      </div>

      {/* ── Content placeholder ────────────────────────────────────────────── */}
      <div style={{ padding: '32px 20px', maxWidth: 600, margin: '0 auto' }}>
        <div style={{
          background: 'white', borderRadius: 24, border: '1px solid #E5E7EB',
          padding: '48px 24px', textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: 24,
            background: gradient,
            color: iconColor, margin: '0 auto 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Icon style={{ width: 40, height: 40 }} />
          </div>
          <h2 style={{ fontFamily: FONT, fontSize: 24, fontWeight: 800, color: '#1A1A1A', margin: '0 0 16px' }}>
            {title}
          </h2>
          <p style={{ fontFamily: FONT, fontSize: 15, color: '#6B7280', margin: '0 auto 36px', maxWidth: 400, lineHeight: 1.6 }}>
            This page for <strong>{actionSlug}</strong> is currently being developed. You will be able to manage your specific settings here soon!
          </p>
          <button style={{
            background: `linear-gradient(135deg, ${iconColor}, #1A1A1A)`,
            color: 'white', border: 'none', borderRadius: 999,
            padding: '16px 32px', fontFamily: FONT, fontSize: 15, fontWeight: 600,
            cursor: 'pointer', boxShadow: `0 4px 12px ${iconColor}40`,
            transition: 'transform 0.2s, boxShadow 0.2s',
            display: 'inline-flex', alignItems: 'center', gap: 8
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 16px ${iconColor}60` }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 12px ${iconColor}40` }}
          >
            <Icon style={{ width: 18, height: 18 }} />
            Save preferences
          </button>
        </div>
        
        <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Link href="/settings" style={{
                fontFamily: FONT, fontSize: 14, fontWeight: 600, color: '#6B7280', textDecoration: 'none',
                padding: '12px 24px', display: 'inline-block',
                borderRadius: 999, transition: 'background 0.2s'
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#F3F4F6')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
                Return to Settings
            </Link>
        </div>
      </div>
    </div>
  );
}

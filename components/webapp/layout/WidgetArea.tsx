'use client';

import { useState } from 'react';
import { Search, TrendingUp, Users, ChevronRight, ArrowDownLeft, ArrowUpRight, Settings, Eye, EyeOff, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

const TRENDS = [
  { category: 'Technology · Trending',   tag: '#StubgramRewards', posts: '10.5K posts' },
  { category: 'Social Media · Trending', tag: '#ContentCreators', posts: '15.2K posts' },
  { category: 'Trending',                tag: '#NextGeneration',  posts: '20K posts'   },
  { category: 'Entertainment · Trending',tag: '#StubgramLive',    posts: '8.1K posts'  },
  { category: 'Finance · Trending',      tag: '#SnapCoins',       posts: '5.3K posts'  },
];

const SUGGESTIONS = [
  { name: 'Selena Martinez', handle: 'selena_creates', avatar: '47', verified: true,  celebrity: true,  following: false },
  { name: 'Kevin Osei',      handle: 'codewithkev',   avatar: '12', verified: true,  celebrity: false, following: false },
  { name: 'Marcus Reid',     handle: 'marcus.fit',    avatar: '11', verified: true,  celebrity: false, following: false },
  { name: 'Amara Diallo',    handle: 'amara.beauty',  avatar: '45', verified: true,  celebrity: false, following: false },
  { name: 'Nadia Wright',    handle: 'nadiafood',     avatar: '23', verified: false, celebrity: false, following: false },
  { name: 'Jake Thornton',   handle: 'jakephoto',     avatar: '8',  verified: false, celebrity: false, following: false },
  { name: 'Zara Okonkwo',    handle: 'zaraokonkwo',   avatar: '31', verified: true,  celebrity: true,  following: false },
];

/* ─ Shared card wrapper ───────────────────────────────────────────────────── */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: 20,
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

/* ─ Wallet action button (inside gradient card) ──────────────────────────── */
function WalletBtn({ icon, label, solid }: { icon: React.ReactNode; label: string; solid?: boolean }) {
  return (
    <button
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 6,
        height: 40,
        paddingLeft: 18, paddingRight: 18,
        borderRadius: 999,
        border: 'none',
        cursor: 'pointer',
        fontFamily: FONT,
        fontSize: 13,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        background: solid ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.18)',
        color:      solid ? '#0a7ea4'                 : 'white',
        boxShadow:  solid ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
        backdropFilter: 'blur(8px)',
        transition: 'opacity 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      {icon}
      {label}
    </button>
  );
}

/* ─ Suggestion Row (interactive follow toggle) ────────────────────────────── */
type Suggestion = typeof SUGGESTIONS[number];
function SuggestionRow({ person }: { person: Suggestion }) {
  const [followed, setFollowed] = useState(false);
  const { name, handle, avatar, verified, celebrity } = person;

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 20px', borderTop: '1px solid #F3F4F6',
        transition: 'background 0.12s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Avatar */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://i.pravatar.cc/40?img=${avatar}`}
          alt={name}
          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
        />
        {celebrity && (
          <div style={{ position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, borderRadius: '50%', background: '#FF69B4', border: '1.5px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8 }}>
            ⭐
          </div>
        )}
      </div>

      {/* Name + handle */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {name}
          </span>
          {verified && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <defs>
                <linearGradient id={`wf-${handle}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop stopColor="#0a7ea4" offset="0%" />
                  <stop stopColor="#EC4899" offset="100%" />
                </linearGradient>
              </defs>
              <circle cx="12" cy="12" r="10" fill={`url(#wf-${handle})`} />
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <div style={{ fontFamily: FONT, fontSize: 12, color: '#9CA3AF', marginTop: 1 }}>@{handle}</div>
      </div>

      {/* Follow / Following toggle button */}
      <button
        onClick={e => { e.stopPropagation(); setFollowed(f => !f); }}
        style={{
          flexShrink: 0, height: 34, paddingLeft: 16, paddingRight: 16,
          borderRadius: 999, cursor: 'pointer', fontFamily: FONT, fontSize: 13, fontWeight: 700,
          transition: 'all 0.15s',
          background: followed ? 'transparent' : '#1A1A1A',
          color: followed ? '#374151' : 'white',
          border: followed ? '1.5px solid #D1D5DB' : 'none',
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = followed ? '1' : '0.8'; if (followed) { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.border = '1.5px solid #FECACA'; } }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = followed ? 'transparent' : '#1A1A1A'; e.currentTarget.style.color = followed ? '#374151' : 'white'; e.currentTarget.style.border = followed ? '1.5px solid #D1D5DB' : 'none'; }}
      >
        {followed ? 'Following' : 'Follow'}
      </button>
    </div>
  );
}

export function WidgetArea() {
  const COIN_BALANCE   = 450;
  const RWF_RATE       = 25;
  const rwfBalance     = COIN_BALANCE * RWF_RATE;

  const [hidden,      setHidden]      = useState(false);
  const [refreshing,  setRefreshing]  = useState(false);

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 32 }}>

      {/* ── Search + Settings ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
        {/* Search input */}
        <div style={{ position: 'relative', flex: 1 }}>
          <Search
            style={{
              position: 'absolute', left: 14, top: '50%',
              transform: 'translateY(-50%)',
              width: 15, height: 15, color: '#9CA3AF', pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Search Stubgram"
            style={{
              width: '100%',
              height: 44,
              paddingLeft: 40,
              paddingRight: 14,
              borderRadius: 999,
              border: '1.5px solid transparent',
              background: '#F3F4F6',
              fontFamily: FONT,
              fontSize: 14,
              color: '#1A1A1A',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'all 0.2s',
            }}
            onFocus={e => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.border = '1.5px solid #0a7ea4';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(10,126,164,0.08)';
            }}
            onBlur={e => {
              e.currentTarget.style.background = '#F3F4F6';
              e.currentTarget.style.border = '1.5px solid transparent';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Settings icon button */}
        <Link
          href="/settings"
          title="Settings"
          style={{
            flexShrink: 0,
            width: 44, height: 44,
            borderRadius: '50%',
            background: '#F3F4F6',
            border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#6B7280',
            textDecoration: 'none',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(10,126,164,0.1)';
            e.currentTarget.style.color = '#0a7ea4';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#F3F4F6';
            e.currentTarget.style.color = '#6B7280';
          }}
        >
          <Settings style={{ width: 18, height: 18 }} />
        </Link>
      </div>

      {/* ── Stub Coins Widget ────────────────────────────────────────────────── */}
      <div style={{
        borderRadius: 20,
        background: 'linear-gradient(135deg,#F59E0B 0%,#EC4899 60%,#E91E63 100%)',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 6px 20px rgba(245,158,11,0.3)',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -28, right: -28, width: 96, height: 96, borderRadius: '50%', background: 'rgba(255,255,255,0.13)' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -12, width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.09)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* Header row: label + icon buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 18 }}>🪙</span>
              <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>
                Stub Coins
              </span>
            </div>

            {/* Refresh + Eye buttons */}
            <div style={{ display: 'flex', gap: 4 }}>
              {/* Refresh */}
              <button
                onClick={handleRefresh}
                title="Refresh balance"
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.18)', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: refreshing ? 'not-allowed' : 'pointer',
                  color: 'white', transition: 'background 0.15s',
                }}
                onMouseEnter={e => !refreshing && (e.currentTarget.style.background = 'rgba(255,255,255,0.28)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
              >
                <RefreshCw style={{
                  width: 14, height: 14,
                  animation: refreshing ? 'spin 1s linear infinite' : 'none',
                }} />
              </button>

              {/* Eye toggle */}
              <button
                onClick={() => setHidden(h => !h)}
                title={hidden ? 'Show balance' : 'Hide balance'}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.18)', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'white', transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.28)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
              >
                {hidden
                  ? <EyeOff style={{ width: 14, height: 14 }} />
                  : <Eye    style={{ width: 14, height: 14 }} />}
              </button>
            </div>
          </div>

          {/* Primary balance — RWF */}
          <div style={{ fontFamily: FONT, fontSize: 38, fontWeight: 800, color: 'white', lineHeight: 1, marginBottom: 4, letterSpacing: '-0.01em' }}>
            {hidden ? '••••••' : `RWF ${rwfBalance.toLocaleString()}`}
          </div>

          {/* Secondary — Stub Coins equivalent */}
          {!hidden && (
            <div style={{ fontFamily: FONT, fontSize: 12, color: 'rgba(255,255,255,0.72)', marginBottom: 16 }}>
              ≈ {COIN_BALANCE.toLocaleString()} Stub Coins
            </div>
          )}
          {hidden && <div style={{ marginBottom: 16 }} />}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
            <WalletBtn solid icon={<ArrowDownLeft style={{ width: 14, height: 14 }} />} label="Deposit" />
            <WalletBtn       icon={<ArrowUpRight  style={{ width: 14, height: 14 }} />} label="Withdraw" />
          </div>
        </div>
      </div>

      {/* ── Trends for you ──────────────────────────────────────────────────── */}
      <Card>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px 12px' }}>
          <TrendingUp style={{ width: 18, height: 18, color: '#0a7ea4', flexShrink: 0 }} />
          <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>Trends for you</span>
        </div>

        {TRENDS.map(({ category, tag, posts }) => (
          <div
            key={tag}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              padding: '12px 20px',
              borderTop: '1px solid #F3F4F6',
              cursor: 'pointer',
              transition: 'background 0.12s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: FONT, fontSize: 11, color: '#9CA3AF' }}>{category}</span>
              <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>{tag}</span>
              <span style={{ fontFamily: FONT, fontSize: 11, color: '#9CA3AF' }}>{posts}</span>
            </div>
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 18, paddingTop: 2 }}
            >
              ···
            </button>
          </div>
        ))}

        <div style={{ padding: '12px 20px', borderTop: '1px solid #F3F4F6' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 13, fontWeight: 600, color: '#0a7ea4', display: 'flex', alignItems: 'center', gap: 4 }}>
            Show more <ChevronRight style={{ width: 14, height: 14 }} />
          </button>
        </div>
      </Card>

      {/* ── Who to follow ───────────────────────────────────────────────────── */}
      <Card>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px 12px' }}>
          <Users style={{ width: 18, height: 18, color: '#EC4899', flexShrink: 0 }} />
          <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>Who to follow</span>
        </div>

        {SUGGESTIONS.map((s) => (
          <SuggestionRow key={s.handle} person={s} />
        ))}

        <div style={{ padding: '12px 20px', borderTop: '1px solid #F3F4F6' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 13, fontWeight: 600, color: '#0a7ea4', display: 'flex', alignItems: 'center', gap: 4 }}>
            Show more <ChevronRight style={{ width: 14, height: 14 }} />
          </button>
        </div>
      </Card>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <div style={{ padding: '0 4px', display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
        {['Terms', 'Privacy', 'Cookies', 'Support', 'Ads info'].map(l => (
          <a key={l} href="#" style={{ fontFamily: FONT, fontSize: 11, color: '#9CA3AF', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
          >{l}</a>
        ))}
        <span style={{ width: '100%', fontFamily: FONT, fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>© 2026 Stubgram Inc.</span>
      </div>
    </div>
  );
}

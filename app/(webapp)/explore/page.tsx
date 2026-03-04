'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, TrendingUp, Users, X, Star } from 'lucide-react';

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

const MOCK_SUGGESTED = [
  { id: 'u1', name: 'Selena Martinez', handle: 'selena_creates', avatar: '47', followers: '2.4M',   verified: true,  celebrity: true  },
  { id: 'u2', name: 'Kevin Osei',      handle: 'codewithkev',   avatar: '12', followers: '84.2K',  verified: true,  celebrity: false },
  { id: 'u3', name: 'Marcus Reid',     handle: 'marcus.fit',    avatar: '11', followers: '1.2M',   verified: true,  celebrity: false },
  { id: 'u4', name: 'Nadia Wright',    handle: 'nadia.eats',    avatar: '23', followers: '54.1K',  verified: false, celebrity: false },
  { id: 'u5', name: 'Jake Thornton',   handle: 'jakethephoto',  avatar: '8',  followers: '320.4K', verified: true,  celebrity: false },
  { id: 'u6', name: 'Amara Diallo',    handle: 'amara.glow',    avatar: '45', followers: '9.8K',   verified: false, celebrity: false },
];

const TRENDING_TOPICS = [
  { id: 't1', tag: '#StubgramRewards', posts: '10.5K', category: 'Technology'    },
  { id: 't2', tag: '#ContentCreators', posts: '15.2K', category: 'Social Media'  },
  { id: 't3', tag: '#NextGeneration',  posts: '20K',   category: 'Trending'      },
  { id: 't4', tag: '#StubgramLive',    posts: '8.1K',  category: 'Entertainment' },
  { id: 't5', tag: '#SnapCoins',       posts: '5.3K',  category: 'Finance'       },
  { id: 't6', tag: '#AfricanTech',     posts: '12K',   category: 'Technology'    },
];

/* ─ Gradient verified checkmark ──────────────────────────────────────────── */
function VerifiedBadge({ id }: { id: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={`vb-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="#0a7ea4" offset="0%" />
          <stop stopColor="#EC4899" offset="100%" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill={`url(#vb-${id})`} />
      <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ExplorePage() {
  const [query,    setQuery]    = useState('');
  const [focused,  setFocused]  = useState(false);
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  /* Close floating results when clicking outside */
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredUsers = MOCK_SUGGESTED.filter(u =>
    !query || u.name.toLowerCase().includes(query.toLowerCase()) || u.handle.toLowerCase().includes(query.toLowerCase())
  );

  const toggleFollow = (id: string) =>
    setFollowed(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  /* ─ Shared: one user row ─────────────────────────────────────────────── */
  const UserRow = ({ u }: { u: typeof MOCK_SUGGESTED[0] }) => {
    const isFollowing = followed.has(u.id);
    return (
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '13px 20px',
          borderTop: '1px solid #F3F4F6',
          cursor: 'pointer',
          transition: 'background 0.12s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.pravatar.cc/48?img=${u.avatar}`}
            alt={u.name}
            style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
          />
          {u.celebrity && (
            <div style={{
              position: 'absolute', bottom: -2, right: -2,
              width: 18, height: 18, borderRadius: '50%',
              background: '#FF69B4', border: '2px solid white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9,
            }}>⭐</div>
          )}
        </div>

        {/* Name + handle — flex:1 with minWidth:0 so it truncates, not pushes button off */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{
              fontFamily: FONT, fontSize: 14, fontWeight: 700, color: '#1A1A1A',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {u.name}
            </span>
            {u.verified && <VerifiedBadge id={u.id} />}
          </div>
          <div style={{ fontFamily: FONT, fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
            @{u.handle} · {u.followers} followers
          </div>
        </div>

        {/* Follow button — flexShrink:0 keeps it always fully visible */}
        <button
          onClick={e => { e.stopPropagation(); toggleFollow(u.id); }}
          style={{
            flexShrink: 0,
            height: 36,
            minWidth: 90,
            paddingLeft: 18,
            paddingRight: 18,
            borderRadius: 999,
            border: isFollowing ? '1.5px solid #E5E7EB' : 'none',
            cursor: 'pointer',
            fontFamily: FONT,
            fontSize: 14,
            fontWeight: 700,
            background:  isFollowing ? 'white'   : '#1A1A1A',
            color:       isFollowing ? '#1A1A1A' : 'white',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            if (isFollowing) (e.currentTarget.style.background = '#FEF2F2'), (e.currentTarget.style.color = '#EF4444'), (e.currentTarget.style.borderColor = '#EF4444');
            else (e.currentTarget.style.background = '#374151');
          }}
          onMouseLeave={e => {
            if (isFollowing) (e.currentTarget.style.background = 'white'), (e.currentTarget.style.color = '#1A1A1A'), (e.currentTarget.style.borderColor = '#E5E7EB');
            else (e.currentTarget.style.background = '#1A1A1A');
          }}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: FONT }}>

      {/* ── Sticky header ────────────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        padding: '14px 20px 12px',
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E5E7EB',
      }}>
        <h1 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 800, color: '#1A1A1A' }}>Explore</h1>

        {/* ── Floating search — the dropdown is absolute, not a fixed section ── */}
        <div ref={wrapRef} style={{ position: 'relative' }}>
          {/* Input */}
          <div style={{ position: 'relative' }}>
            <Search style={{
              position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
              width: 16, height: 16, color: focused ? '#0a7ea4' : '#9CA3AF',
              transition: 'color 0.2s', pointerEvents: 'none',
            }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              placeholder="Search people, topics..."
              style={{
                width: '100%',
                height: 46,
                paddingLeft: 46,
                paddingRight: query ? 44 : 16,
                borderRadius: 999,
                border: focused ? '1.5px solid #0a7ea4' : '1.5px solid transparent',
                background: focused ? 'white' : '#F3F4F6',
                fontFamily: FONT,
                fontSize: 15,
                color: '#1A1A1A',
                outline: 'none',
                boxSizing: 'border-box',
                boxShadow: focused ? '0 0 0 3px rgba(10,126,164,0.1)' : 'none',
                transition: 'all 0.2s',
              }}
            />
            {query && (
              <button
                onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  width: 22, height: 22, borderRadius: '50%',
                  background: '#9CA3AF', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X style={{ width: 12, height: 12, color: 'white' }} />
              </button>
            )}
          </div>

          {/* ── Floating dropdown results (shown when typing + focused) ── */}
          {focused && query && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
              background: 'white',
              borderRadius: 16,
              border: '1px solid #E5E7EB',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              overflow: 'hidden',
              zIndex: 50,
              maxHeight: 320,
              overflowY: 'auto',
            }}>
              {filteredUsers.length === 0 ? (
                <div style={{ padding: '24px 20px', textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>
                  No results for &ldquo;{query}&rdquo;
                </div>
              ) : (
                filteredUsers.map(u => <UserRow key={u.id} u={u} />)
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Page content (not affected by search dropdown) ────────────────── */}
      <div style={{ padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── Trending topics ─────────────────────────────────────────────── */}
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px 10px' }}>
            <TrendingUp style={{ width: 18, height: 18, color: '#EC4899', flexShrink: 0 }} />
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1A1A1A' }}>Trending topics</h2>
          </div>

          {TRENDING_TOPICS.map(({ id, tag, posts, category }, i) => (
            <div
              key={id}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 20px',
                borderTop: '1px solid #F3F4F6',
                cursor: 'pointer',
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                {/* Rank number */}
                <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: '#E5E7EB', minWidth: 20, flexShrink: 0, lineHeight: 1 }}>
                  {i + 1}
                </span>
                <div>
                  <div style={{ fontFamily: FONT, fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>{category} · Trending</div>
                  <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: '#1A1A1A', marginBottom: 2 }}>{tag}</div>
                  <div style={{ fontFamily: FONT, fontSize: 11, color: '#9CA3AF' }}>{posts} posts</div>
                </div>
              </div>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 18, padding: '4px 8px', flexShrink: 0 }}>···</button>
            </div>
          ))}
        </div>

        {/* ── Recommended for you ─────────────────────────────────────────── */}
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px 10px' }}>
            <Users style={{ width: 18, height: 18, color: '#0a7ea4', flexShrink: 0 }} />
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1A1A1A' }}>Recommended for you</h2>
          </div>
          {MOCK_SUGGESTED.map(u => <UserRow key={u.id} u={u} />)}
        </div>

      </div>
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Users } from 'lucide-react';
import Image from 'next/image';

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

/* ── Category tabs ─────────────────────────────────────────────────────────── */
type Tab = 'foryou' | 'trending' | 'news' | 'sports' | 'entertainment';
const TABS: { id: Tab; label: string }[] = [
  { id: 'foryou',        label: 'For You'       },
  { id: 'trending',      label: 'Trending'       },
  { id: 'news',          label: 'News'           },
  { id: 'sports',        label: 'Sports'         },
  { id: 'entertainment', label: 'Entertainment'  },
];

/* ── Trend data per tab ────────────────────────────────────────────────────── */
const TRENDS: Record<Tab, { id: string; tag: string; posts: string; category: string; img?: string }[]> = {
  foryou: [
    { id: 't1', tag: '#StubgramRewards',  posts: '10.5K', category: 'Technology',     img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&q=70' },
    { id: 't2', tag: '#ContentCreators', posts: '15.2K', category: 'Social Media',    img: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=120&q=70' },
    { id: 't3', tag: '#NextGeneration',  posts: '20K',   category: 'Trending',        img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=120&q=70' },
    { id: 't4', tag: '#StubgramLive',    posts: '8.1K',  category: 'Entertainment',   img: 'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=120&q=70' },
    { id: 't5', tag: '#SnapCoins',       posts: '5.3K',  category: 'Finance',         img: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=120&q=70' },
    { id: 't6', tag: '#AfricanTech',     posts: '12K',   category: 'Technology',      img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=120&q=70' },
  ],
  trending: [
    { id: 'tr1', tag: '#Stubgram2026',   posts: '88K',   category: 'Trending Worldwide', img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=120&q=70' },
    { id: 'tr2', tag: '#ViralMoments',   posts: '44.1K', category: 'Trending',            img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=120&q=70' },
    { id: 'tr3', tag: '#CryptoAfrica',   posts: '31.7K', category: 'Finance',             img: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=120&q=70' },
    { id: 'tr4', tag: '#TechTalks',      posts: '22K',   category: 'Technology',          img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=120&q=70' },
  ],
  news: [
    { id: 'n1', tag: 'Rwanda Innovation Summit', posts: '6.2K', category: 'East Africa', img: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=120&q=70' },
    { id: 'n2', tag: 'Global Creator Economy',   posts: '9.8K', category: 'Business',    img: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=120&q=70' },
    { id: 'n3', tag: 'AI & Social Media',        posts: '14K',  category: 'Tech News',    img: 'https://images.unsplash.com/photo-1677442135968-6db3b0025e95?w=120&q=70' },
  ],
  sports: [
    { id: 's1', tag: '#AFCON2026',       posts: '120K', category: 'Football',    img: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=120&q=70' },
    { id: 's2', tag: '#NBA Playoffs',    posts: '87K',  category: 'Basketball',  img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=120&q=70' },
    { id: 's3', tag: '#AfricaRunning',   posts: '22K',  category: 'Athletics',   img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=120&q=70' },
  ],
  entertainment: [
    { id: 'e1', tag: '#AfrobeatsFest',   posts: '41K',  category: 'Music',   img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=120&q=70' },
    { id: 'e2', tag: '#NollywoodBuzz',   posts: '18K',  category: 'Film',    img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=120&q=70' },
    { id: 'e3', tag: '#StubgramReels',   posts: '33K',  category: 'Video',   img: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=120&q=70' },
  ],
};

const MOCK_SUGGESTED = [
  { id: 'u1', name: 'Selena Martinez', handle: 'selena_creates', avatar: '47', followers: '2.4M',   verified: true,  celebrity: true  },
  { id: 'u2', name: 'Kevin Osei',      handle: 'codewithkev',   avatar: '12', followers: '84.2K',  verified: true,  celebrity: false },
  { id: 'u3', name: 'Marcus Reid',     handle: 'marcus.fit',    avatar: '11', followers: '1.2M',   verified: true,  celebrity: false },
  { id: 'u4', name: 'Nadia Wright',    handle: 'nadia.eats',    avatar: '23', followers: '54.1K',  verified: false, celebrity: false },
  { id: 'u5', name: 'Jake Thornton',   handle: 'jakethephoto',  avatar: '8',  followers: '320.4K', verified: true,  celebrity: false },
];

function VerifiedBadge({ id }: { id: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
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
  const [tab,      setTab]      = useState<Tab>('foryou');
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const filteredUsers = MOCK_SUGGESTED.filter(u =>
    !query ||
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.handle.toLowerCase().includes(query.toLowerCase())
  );

  const toggleFollow = (id: string) =>
    setFollowed(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const trends = TRENDS[tab];

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: FONT }}>

      {/* ── Sticky header: search + category tabs ──────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E5E7EB',
      }}>
        {/* Search row */}
        <div style={{ padding: '14px 20px 10px' }} ref={wrapRef}>
          <div style={{ position: 'relative' }}>
            <Search style={{
              position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
              width: 16, height: 16, pointerEvents: 'none',
              color: focused ? '#0a7ea4' : '#9CA3AF', transition: 'color 0.2s',
            }} />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              placeholder="Search people, topics..."
              style={{
                width: '100%', height: 44,
                paddingLeft: 46, paddingRight: query ? 44 : 16,
                borderRadius: 999,
                border: focused ? '1.5px solid #0a7ea4' : '1.5px solid transparent',
                background: focused ? 'white' : '#F3F4F6',
                fontFamily: FONT, fontSize: 14, color: '#1A1A1A', outline: 'none',
                boxSizing: 'border-box',
                boxShadow: focused ? '0 0 0 3px rgba(10,126,164,0.10)' : 'none',
                transition: 'all 0.2s',
              }}
            />
            {query && (
              <button onClick={() => { setQuery(''); inputRef.current?.focus(); }} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                width: 22, height: 22, borderRadius: '50%',
                background: '#9CA3AF', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <X style={{ width: 12, height: 12, color: 'white' }} />
              </button>
            )}
            {/* Floating search results */}
            {focused && query && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                background: 'white', borderRadius: 16,
                border: '1px solid #E5E7EB',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                overflow: 'hidden', zIndex: 50,
                maxHeight: 300, overflowY: 'auto',
              }}>
                {filteredUsers.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>No results for &ldquo;{query}&rdquo;</div>
                ) : filteredUsers.map(u => (
                  <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderTop: '1px solid #F3F4F6', cursor: 'pointer', transition: 'background 0.12s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://i.pravatar.cc/40?img=${u.avatar}`} alt={u.name} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</span>
                        {u.verified && <VerifiedBadge id={`s-${u.id}`} />}
                      </div>
                      <div style={{ fontSize: 12, color: '#9CA3AF' }}>@{u.handle}</div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); toggleFollow(u.id); }} style={{
                      flexShrink: 0, height: 32, paddingLeft: 14, paddingRight: 14,
                      borderRadius: 999, border: followed.has(u.id) ? '1.5px solid #E5E7EB' : 'none',
                      cursor: 'pointer', fontFamily: FONT, fontSize: 13, fontWeight: 700,
                      background: followed.has(u.id) ? 'white' : '#1A1A1A',
                      color: followed.has(u.id) ? '#1A1A1A' : 'white',
                    }}>
                      {followed.has(u.id) ? 'Following' : 'Follow'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category tabs — scrollable on small screens */}
        <div style={{ display: 'flex', overflowX: 'auto', borderTop: '1px solid #F3F4F6' }} className="no-scrollbar">
          {TABS.map(({ id, label }) => {
            const active = tab === id;
            return (
              <button key={id} onClick={() => setTab(id)} style={{
                flexShrink: 0,
                paddingTop: 14, paddingBottom: 14, paddingLeft: 20, paddingRight: 20,
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: FONT, fontSize: 15, fontWeight: active ? 700 : 500,
                color: active ? '#1A1A1A' : '#6B7280',
                position: 'relative', transition: 'color 0.15s',
              }}>
                {label}
                {active && (
                  <span style={{
                    position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                    width: 40, height: 3, borderRadius: 999, background: '#0a7ea4',
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Page body ──────────────────────────────────────────────────────── */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── Hero banner ─────────────────────────────────────────────────── */}
        <div style={{
          position: 'relative', borderRadius: 20, overflow: 'hidden',
          height: 150,
          background: 'linear-gradient(135deg,#0a0a1a,#0a7ea4)',
        }}>
          <Image
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"
            alt="Global Trending"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            unoptimized
          />
          {/* Gradient overlay so text is readable */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, rgba(0,0,0,0.72) 40%, transparent 100%)',
          }} />
          {/* Text */}
          <div style={{ position: 'relative', zIndex: 1, padding: '24px 24px' }}>
            <div style={{ fontFamily: FONT, fontSize: 19, fontWeight: 800, color: 'white', marginBottom: 4 }}>
              Global Trending
            </div>
            <div style={{ fontFamily: FONT, fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 16 }}>
              The most popular posts on Stubgram
            </div>
            <button style={{
              height: 36, paddingLeft: 18, paddingRight: 18,
              borderRadius: 999, background: 'white', border: 'none',
              cursor: 'pointer', fontFamily: FONT, fontSize: 13, fontWeight: 700,
              color: '#1A1A1A', transition: 'opacity 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Explore
            </button>
          </div>
        </div>

        {/* ── Trending topics with images ─────────────────────────────────── */}
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px 10px', borderBottom: '1px solid #F3F4F6' }}>
            <h2 style={{ margin: 0, fontFamily: FONT, fontSize: 17, fontWeight: 700, color: '#1A1A1A' }}>
              {TABS.find(t => t.id === tab)?.label} Trends
            </h2>
          </div>

          {trends.map(({ id, tag, posts, category, img }, i) => (
            <div key={id}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 14, padding: '13px 20px',
                borderTop: i > 0 ? '1px solid #F3F4F6' : 'none',
                cursor: 'pointer', transition: 'background 0.12s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {/* Rank + text */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1, minWidth: 0 }}>
                <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: '#D1D5DB', minWidth: 20, flexShrink: 0, lineHeight: 1.2 }}>
                  {i + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: FONT, fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>{category} · Trending</div>
                  <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: '#1A1A1A', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tag}</div>
                  <div style={{ fontFamily: FONT, fontSize: 11, color: '#9CA3AF' }}>{posts} posts</div>
                </div>
              </div>

              {/* Thumbnail */}
              {img && (
                <div style={{ width: 72, height: 56, borderRadius: 10, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                  <Image src={img} alt={tag} fill style={{ objectFit: 'cover' }} unoptimized />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Recommended for you ─────────────────────────────────────────── */}
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px 10px' }}>
            <Users style={{ width: 18, height: 18, color: '#0a7ea4', flexShrink: 0 }} />
            <h2 style={{ margin: 0, fontFamily: FONT, fontSize: 17, fontWeight: 700, color: '#1A1A1A' }}>Recommended for you</h2>
          </div>
          {MOCK_SUGGESTED.map((u, i) => {
            const isFollowing = followed.has(u.id);
            return (
              <div key={u.id} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '13px 20px',
                borderTop: i > 0 ? '1px solid #F3F4F6' : '1px solid #F3F4F6',
                cursor: 'pointer', transition: 'background 0.12s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://i.pravatar.cc/48?img=${u.avatar}`} alt={u.name}
                    style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
                  {u.celebrity && (
                    <div style={{
                      position: 'absolute', bottom: -2, right: -2,
                      width: 18, height: 18, borderRadius: '50%',
                      background: '#FF69B4', border: '2px solid white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9,
                    }}>⭐</div>
                  )}
                </div>

                {/* Name */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</span>
                    {u.verified && <VerifiedBadge id={u.id} />}
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                    @{u.handle} · {u.followers} followers
                  </div>
                </div>

                {/* Follow button — always fully visible */}
                <button
                  onClick={e => { e.stopPropagation(); toggleFollow(u.id); }}
                  style={{
                    flexShrink: 0, height: 36, minWidth: 92,
                    paddingLeft: 18, paddingRight: 18, borderRadius: 999,
                    border: isFollowing ? '1.5px solid #E5E7EB' : 'none',
                    cursor: 'pointer', fontFamily: FONT, fontSize: 14, fontWeight: 700,
                    background: isFollowing ? 'white' : '#1A1A1A',
                    color:      isFollowing ? '#1A1A1A' : 'white',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    if (isFollowing) { (e.currentTarget.style.background = '#FEF2F2'); (e.currentTarget.style.color = '#EF4444'); (e.currentTarget.style.borderColor = '#EF4444'); }
                    else (e.currentTarget.style.background = '#374151');
                  }}
                  onMouseLeave={e => {
                    if (isFollowing) { (e.currentTarget.style.background = 'white'); (e.currentTarget.style.color = '#1A1A1A'); (e.currentTarget.style.borderColor = '#E5E7EB'); }
                    else (e.currentTarget.style.background = '#1A1A1A');
                  }}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

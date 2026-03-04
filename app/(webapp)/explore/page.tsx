'use client';

import { useState } from 'react';
import { Search, TrendingUp, Users, Star } from 'lucide-react';

const MOCK_SUGGESTED = [
  { id: 'u1', name: 'Selena Martinez', handle: 'selena_creates', avatar: '47', followers: '2.4M', verified: true, celebrity: true },
  { id: 'u2', name: 'Kevin Osei',       handle: 'codewithkev',   avatar: '12', followers: '84.2K', verified: true,  celebrity: false },
  { id: 'u3', name: 'Marcus Reid',      handle: 'marcus.fit',    avatar: '11', followers: '1.2M', verified: true,  celebrity: false },
  { id: 'u4', name: 'Nadia Wright',     handle: 'nadia.eats',    avatar: '23', followers: '54.1K', verified: false, celebrity: false },
  { id: 'u5', name: 'Jake Thornton',    handle: 'jakethephoto', avatar: '8',  followers: '320.4K', verified: true,  celebrity: false },
  { id: 'u6', name: 'Amara Diallo',     handle: 'amara.glow',   avatar: '45', followers: '9.8K',  verified: false, celebrity: false },
];

const TRENDING_TOPICS = [
  { id: 't1', tag: '#StubgramRewards',   posts: '10.5K', category: 'Technology' },
  { id: 't2', tag: '#ContentCreators',   posts: '15.2K', category: 'Social Media' },
  { id: 't3', tag: '#NextGeneration',    posts: '20K',   category: 'Trending' },
  { id: 't4', tag: '#StubgramLive',      posts: '8.1K',  category: 'Entertainment' },
  { id: 't5', tag: '#SnapCoins',         posts: '5.3K',  category: 'Finance' },
  { id: 't6', tag: '#AfricanTech',       posts: '12K',   category: 'Technology' },
];

export default function ExplorePage() {
  const [query, setQuery] = useState('');
  const [followed, setFollowed] = useState<Set<string>>(new Set());

  const filteredUsers = MOCK_SUGGESTED.filter(u =>
    !query || u.name.toLowerCase().includes(query.toLowerCase()) || u.handle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Search Header */}
      <div
        className="sticky top-0 z-10 px-4 py-3"
        style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--divider)' }}
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search people, topics..."
            className="w-full h-11 pl-11 pr-4 rounded-full text-[15px] outline-none transition-all"
            style={{ background: 'var(--divider)', color: 'var(--text)' }}
            onFocus={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary)'; }}
            onBlur={e => { e.currentTarget.style.background = 'var(--divider)'; e.currentTarget.style.boxShadow = ''; }}
          />
        </div>
      </div>

      <div className="px-4 py-4 space-y-5">

        {/* Trending Topics */}
        {!query && (
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="px-4 pt-4 pb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
              <h2 className="text-[17px] font-bold" style={{ color: 'var(--text)', fontSize: '17px' }}>Trending topics</h2>
            </div>
            {TRENDING_TOPICS.map((t, i) => (
              <div
                key={t.id}
                className="flex items-center justify-between px-4 py-3 cursor-pointer transition-colors"
                style={{ borderTop: '1px solid var(--divider)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--divider)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                <div>
                  <p className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>{i + 1} · {t.category} · Trending</p>
                  <p className="text-[15px] font-bold" style={{ color: 'var(--text)' }}>{t.tag}</p>
                  <p className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>{t.posts} posts</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recommended Users */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-4 pt-4 pb-2 flex items-center gap-2">
            <Users className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            <h2 className="text-[17px] font-bold" style={{ color: 'var(--text)', fontSize: '17px' }}>
              {query ? `Results for "${query}"` : 'Recommended for you'}
            </h2>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="py-12 text-center" style={{ color: 'var(--text-secondary)' }}>
              <p>No users found</p>
            </div>
          ) : (
            filteredUsers.map(u => {
              const isFollowing = followed.has(u.id);
              return (
                <div
                  key={u.id}
                  className="flex items-center gap-3 px-4 py-3 transition-colors"
                  style={{ borderTop: '1px solid var(--divider)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--divider)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://i.pravatar.cc/40?img=${u.avatar}`} alt={u.name} className="w-12 h-12 rounded-full object-cover" />
                    {u.celebrity && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px]"
                        style={{ background: 'var(--celebrity-pink)', border: '1.5px solid white' }}>⭐</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-[14px] font-bold truncate" style={{ color: 'var(--text)' }}>{u.name}</p>
                      {u.verified && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <defs><linearGradient id={`eg-${u.id}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop stopColor="#0a7ea4" offset="0%"/><stop stopColor="#EC4899" offset="100%"/></linearGradient></defs>
                          <circle cx="12" cy="12" r="10" fill={`url(#eg-${u.id})`}/>
                          <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <p className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>@{u.handle} · {u.followers} followers</p>
                  </div>

                  <button
                    onClick={() => setFollowed(prev => { const n = new Set(prev); if (n.has(u.id)) n.delete(u.id); else n.add(u.id); return n; })}
                    className="shrink-0 h-8 px-4 rounded-full text-[12px] font-bold transition-all duration-200 active:scale-[0.97]"
                    style={isFollowing
                      ? { background: 'white', color: 'var(--text)', border: '1.5px solid var(--border)' }
                      : { background: 'var(--text)', color: 'white' }
                    }
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

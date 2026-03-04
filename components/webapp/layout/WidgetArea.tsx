'use client';

import { Search, Coins, TrendingUp, Users, ChevronRight } from 'lucide-react';

export function WidgetArea() {
  const coinBalance = 450;

  const trends = [
    { category: 'Technology · Trending', tag: '#StubgramRewards', posts: '10.5K posts' },
    { category: 'Social Media · Trending', tag: '#ContentCreators', posts: '15.2K posts' },
    { category: 'Trending', tag: '#NextGeneration', posts: '20K posts' },
    { category: 'Entertainment · Trending', tag: '#StubgramLive', posts: '8.1K posts' },
    { category: 'Finance · Trending', tag: '#SnapCoins', posts: '5.3K posts' },
  ];

  const suggestions = [
    { name: 'Selena Martinez',  handle: 'selena_creates', avatar: '47', verified: true, celebrity: true },
    { name: 'Kevin Osei',       handle: 'codewithkev',    avatar: '12', verified: true, celebrity: false },
    { name: 'Marcus Reid',      handle: 'marcus.fit',     avatar: '11', verified: true, celebrity: false },
  ];

  return (
    <div className="flex flex-col gap-4 pb-8">

      {/* Search */}
      <div className="relative mt-1">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: 'var(--text-secondary)' }}
        />
        <input
          type="text"
          placeholder="Search Stubgram"
          className="w-full h-11 rounded-full pl-11 pr-4 text-[15px] transition-all duration-200 outline-none"
          style={{
            background: 'var(--divider)',
            border: '1.5px solid transparent',
            color: 'var(--text)',
          }}
          onFocus={e => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.border = '1.5px solid var(--primary)';
          }}
          onBlur={e => {
            e.currentTarget.style.background = 'var(--divider)';
            e.currentTarget.style.border = '1.5px solid transparent';
          }}
        />
      </div>

      {/* Snap Coins Balance Widget */}
      <div
        className="rounded-2xl p-4 relative overflow-hidden"
        style={{ background: 'var(--gradient-gold)', boxShadow: 'var(--shadow-md)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🪙</span>
            <span className="text-white/80 text-[13px] font-semibold uppercase tracking-wider">Snap Coins</span>
          </div>
          <div className="text-white text-4xl font-bold mb-3 animate-pulse-coin">{coinBalance.toLocaleString()}</div>
          <div className="flex gap-2">
            <a
              href="/wallet"
              className="flex items-center gap-1 px-4 py-1.5 rounded-full text-[13px] font-bold transition-all duration-200 hover:brightness-110"
              style={{ background: 'rgba(255,255,255,0.3)', color: 'white', backdropFilter: 'blur(8px)' }}
            >
              Deposit
            </a>
            <a
              href="/wallet"
              className="flex items-center gap-1 px-4 py-1.5 rounded-full text-[13px] font-bold transition-all duration-200 hover:brightness-110"
              style={{ background: 'rgba(0,0,0,0.25)', color: 'white' }}
            >
              Withdraw
            </a>
          </div>
        </div>
      </div>

      {/* Trending */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div className="px-4 pt-4 pb-2 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          <h2 className="text-[17px] font-bold" style={{ color: 'var(--text)' }}>Trends for you</h2>
        </div>
        {trends.map(({ category, tag, posts }) => (
          <div
            key={tag}
            className="px-4 py-3 cursor-pointer transition-colors duration-150"
            style={{ borderTop: '1px solid var(--divider)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--divider)'}
            onMouseLeave={e => e.currentTarget.style.background = ''}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{category}</p>
                <p className="text-[15px] font-bold" style={{ color: 'var(--text)' }}>{tag}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{posts}</p>
              </div>
              <button className="p-1 transition-colors" style={{ color: 'var(--text-secondary)' }}>···</button>
            </div>
          </div>
        ))}
        <div className="px-4 py-3" style={{ borderTop: '1px solid var(--divider)' }}>
          <button className="text-sm hover:underline font-medium" style={{ color: 'var(--primary)' }}>Show more</button>
        </div>
      </div>

      {/* Who to follow */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div className="px-4 pt-4 pb-2 flex items-center gap-2">
          <Users className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
          <h2 className="text-[17px] font-bold" style={{ color: 'var(--text)' }}>Who to follow</h2>
        </div>
        {suggestions.map(({ name, handle, avatar, verified, celebrity }) => (
          <div
            key={handle}
            className="px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors duration-150"
            style={{ borderTop: '1px solid var(--divider)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--divider)'}
            onMouseLeave={e => e.currentTarget.style.background = ''}
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.pravatar.cc/40?img=${avatar}`}
                alt={name}
                className="w-full h-full object-cover"
              />
              {celebrity && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ background: 'var(--celebrity-pink)', fontSize: 8 }}>
                  ⭐
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-[14px] font-bold truncate leading-tight" style={{ color: 'var(--text)' }}>{name}</p>
                {verified && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <defs>
                      <linearGradient id={`vg-${handle}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop stopColor="#0a7ea4" offset="0%" />
                        <stop stopColor="#EC4899" offset="100%" />
                      </linearGradient>
                    </defs>
                    <circle cx="12" cy="12" r="10" fill={`url(#vg-${handle})`} />
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>@{handle}</p>
            </div>

            <button
              className="shrink-0 h-8 px-4 rounded-full text-[12px] font-bold transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
              style={{ background: 'var(--text)', color: 'white' }}
            >
              Follow
            </button>
          </div>
        ))}
        <div className="px-4 py-3" style={{ borderTop: '1px solid var(--divider)' }}>
          <button className="flex items-center gap-1 text-sm hover:underline font-medium" style={{ color: 'var(--primary)' }}>
            Show more <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 text-[11px] leading-loose flex flex-wrap gap-x-3 gap-y-1" style={{ color: 'var(--text-secondary)' }}>
        <a href="/terms" className="hover:underline">Terms</a>
        <a href="/privacy" className="hover:underline">Privacy</a>
        <a href="/cookies" className="hover:underline">Cookies</a>
        <a href="/support" className="hover:underline">Support</a>
        <a href="/advertising" className="hover:underline">Ads info</a>
        <span className="w-full">© 2026 Stubgram Inc.</span>
      </footer>
    </div>
  );
}

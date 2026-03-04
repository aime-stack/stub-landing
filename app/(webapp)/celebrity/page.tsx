'use client';

import { Star, MessageCircle, Crown, Search } from 'lucide-react';
import { useState } from 'react';

const CELEBRITIES = [
  { id: 'cel1', name: 'Selena Martinez', handle: 'selena_creates', avatar: '47', followers: '2.4M', bio: 'Lifestyle creator & travel junkie 🌍', pricePerMsg: 50, category: 'Lifestyle', isOnline: true },
  { id: 'cel2', name: 'Marcus Reid',     handle: 'marcus.fit',     avatar: '11', followers: '1.2M', bio: 'Fitness coach & @nike athlete 💪',   pricePerMsg: 30, category: 'Fitness',  isOnline: true },
  { id: 'cel3', name: 'DJ Kofi',         handle: 'djkofi',         avatar: '33', followers: '580K', bio: 'Award-winning DJ & producer 🎵',     pricePerMsg: 75, category: 'Music',    isOnline: false },
  { id: 'cel4', name: 'Chef Amara',      handle: 'chefamara',      avatar: '45', followers: '320K', bio: 'Celebrity chef & cookbook author 🍽️', pricePerMsg: 40, category: 'Food',     isOnline: false },
  { id: 'cel5', name: 'Jake Thornton',   handle: 'jakethephoto',   avatar: '8',  followers: '320K', bio: 'Documentary photographer 📷',           pricePerMsg: 25, category: 'Art',      isOnline: true },
];

const CATEGORIES = ['All', 'Lifestyle', 'Fitness', 'Music', 'Food', 'Art', 'Tech'];

export default function CelebrityPage() {
  const [activeCat, setActiveCat] = useState('All');
  const [query, setQuery] = useState('');

  const celebs = CELEBRITIES.filter(c => {
    if (activeCat !== 'All' && c.category !== activeCat) return false;
    if (query && !c.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#FF69B4,#EC4899)', boxShadow: 'var(--shadow-md)' }}>
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
        <Star className="w-10 h-10 mx-auto mb-1 text-white animate-float" />
        <h1 className="text-[22px] font-bold text-white mb-0.5" style={{ fontSize: '22px' }}>Celebrity Chat</h1>
        <p className="text-white/80 text-[13px]">Message your favourite celebrities directly</p>
      </div>

      <div className="sticky top-0 z-10 px-4 py-3" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--divider)' }}>
        <div className="relative mb-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search celebrities..." className="w-full h-10 pl-11 pr-4 rounded-full text-[14px] outline-none" style={{ background: 'var(--divider)', color: 'var(--text)' }} />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)} className="px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all" style={activeCat === cat ? { background: '#FF69B4', color: 'white' } : { background: 'var(--divider)', color: 'var(--text-secondary)' }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {celebs.map(c => (
          <div key={c.id} className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:shadow-md cursor-pointer" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://i.pravatar.cc/56?img=${c.avatar}`} alt={c.name} className="w-14 h-14 rounded-full object-cover" style={{ border: '2.5px solid #FF69B4' }} />
              {c.isOnline && <div className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-white" style={{ background: 'var(--apple-green)' }} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="font-bold text-[15px] truncate" style={{ color: 'var(--text)' }}>{c.name}</p>
                <Star className="w-3.5 h-3.5 shrink-0 fill-current" style={{ color: '#FF69B4' }} />
              </div>
              <p className="text-[12px] mb-0.5" style={{ color: 'var(--text-secondary)' }}>@{c.handle} · {c.followers} followers</p>
              <p className="text-[12px] truncate" style={{ color: 'var(--text)' }}>{c.bio}</p>
            </div>
            <div className="shrink-0 text-center">
              <div className="text-[11px] font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>per msg</div>
              <div className="flex items-center gap-1 font-bold mb-2" style={{ color: 'var(--accent)' }}>
                <span>🪙</span><span>{c.pricePerMsg}</span>
              </div>
              <button
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-bold text-white transition-all hover:brightness-110 active:scale-95"
                style={{ background: 'linear-gradient(135deg,#FF69B4,#EC4899)' }}
              >
                <MessageCircle className="w-3 h-3" /> Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

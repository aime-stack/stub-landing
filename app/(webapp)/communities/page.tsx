'use client';

import { Users, Search, Lock, Globe } from 'lucide-react';
import { useState } from 'react';

const MOCK_COMMUNITIES = [
  { id: 'cm1', name: 'Stubgram Creators', slug: 'creators', members: 45200, posts: 1203, description: 'A space for all content creators to grow, share tips, and collaborate.', joined: true, private: false, icon: '🎨' },
  { id: 'cm2', name: 'Tech & Development', slug: 'tech-dev', members: 22100, posts: 874, description: 'Developers, designers, and tech enthusiasts building the future together.', joined: false, private: false, icon: '💻' },
  { id: 'cm3', name: 'Fitness & Wellness', slug: 'fitness', members: 38900, posts: 2109, description: 'Motivate each other, share workouts, and stay on track with your health goals.', joined: true, private: false, icon: '🏋️' },
  { id: 'cm4', name: 'Food Lovers', slug: 'food', members: 29300, posts: 1562, description: 'Recipes, restaurant reviews, and everything delicious.', joined: false, private: false, icon: '🍕' },
  { id: 'cm5', name: 'Photography Club', slug: 'photography', members: 14700, posts: 921, description: 'Share your best shots, get feedback, and level up your photography.', joined: false, private: true, icon: '📷' },
  { id: 'cm6', name: 'African Fashion', slug: 'fashion-africa', members: 18400, posts: 743, description: 'Celebrate African fashion, design, and culture.', joined: false, private: false, icon: '👗' },
];

export default function CommunitiesPage() {
  const [query, setQuery] = useState('');
  const [joined, setJoined] = useState<Set<string>>(new Set(MOCK_COMMUNITIES.filter(c => c.joined).map(c => c.id)));

  const filtered = MOCK_COMMUNITIES.filter(c =>
    !query || c.name.toLowerCase().includes(query.toLowerCase()) || c.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="sticky top-0 z-10 px-4 py-3" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--divider)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5" style={{ color: '#2196F3' }} />
          <h1 className="text-[20px] font-bold" style={{ color: 'var(--text)', fontSize: '20px' }}>Communities</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search communities..." className="w-full h-11 pl-11 pr-4 rounded-full text-[14px] outline-none" style={{ background: 'var(--divider)', color: 'var(--text)' }} />
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {filtered.map(c => {
          const isJoined = joined.has(c.id);
          return (
            <div key={c.id} className="rounded-2xl p-4 transition-all hover:shadow-md cursor-pointer" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ background: 'linear-gradient(135deg,#2196F3,var(--primary))' }}>
                  {c.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-[15px] truncate" style={{ color: 'var(--text)' }}>{c.name}</p>
                    {c.private ? <Lock className="w-3 h-3 shrink-0" style={{ color: 'var(--text-secondary)' }} /> : <Globe className="w-3 h-3 shrink-0" style={{ color: 'var(--text-secondary)' }} />}
                  </div>
                  <p className="text-[12px] mb-2 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{c.description}</p>
                  <div className="flex items-center gap-3 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                    <span>{c.members.toLocaleString()} members</span>
                    <span>·</span>
                    <span>{c.posts.toLocaleString()} posts</span>
                  </div>
                </div>
                <button
                  onClick={() => setJoined(prev => { const n = new Set(prev); if (n.has(c.id)) n.delete(c.id); else n.add(c.id); return n; })}
                  className="shrink-0 h-8 px-4 rounded-full text-[12px] font-bold transition-all active:scale-[0.97]"
                  style={isJoined
                    ? { background: 'white', color: 'var(--text)', border: '1.5px solid var(--border)' }
                    : { background: '#2196F3', color: 'white' }
                  }
                >
                  {isJoined ? 'Joined' : 'Join'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

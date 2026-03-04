'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Users, Plus, Search, Globe, Lock, ChevronRight,
  Heart, MessageCircle, Share2, MoreHorizontal, X,
  Camera, Check,
} from 'lucide-react';

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

/* ── Mock data ─────────────────────────────────────────────────────────────── */
const DISCOVER_COMMUNITIES = [
  { id: 'dc1', name: 'Africa Creators Hub',    members: '24.1K', category: 'Content Creation', banner: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=70', avatar: '47', description: 'A community for African content creators to share, grow and collaborate.',   private: false },
  { id: 'dc2', name: 'Tech & Innovation RW',   members: '12.8K', category: 'Technology',       banner: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=70', avatar: '12', description: 'Rwandan tech enthusiasts discussing startups, AI and future trends.',       private: false },
  { id: 'dc3', name: 'Fitness Warriors',        members: '9.3K',  category: 'Health & Fitness', banner: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=70', avatar: '11', description: 'Daily workouts, meal preps and motivation for your fitness journey.',       private: false },
  { id: 'dc4', name: 'Nollywood Fanatics',      members: '31.5K', category: 'Entertainment',   banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=70', avatar: '23', description: 'The best place to talk about Nollywood films, actors and industry news.', private: false },
  { id: 'dc5', name: 'Black Entrepreneurs',     members: '18.2K', category: 'Business',         banner: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=70', avatar: '45', description: 'Connecting Black founders, investors and business professionals.',          private: true  },
  { id: 'dc6', name: 'Afrobeats & Music',       members: '44.7K', category: 'Music',            banner: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=70', avatar: '8',  description: 'Everything Afrobeats — new songs, events, artist news and more.',         private: false },
];

const MY_COMMUNITIES = [
  { id: 'mc1', name: 'Stubgram Official',  members: '120K', avatar: '32', unread: 3 },
  { id: 'mc2', name: 'Africa Creators Hub', members: '24.1K',avatar: '47', unread: 0 },
];

const COMMUNITY_POSTS = [
  {
    id: 'cp1', community: 'Africa Creators Hub', communityAvatar: '47',
    author: 'Selena Martinez', authorAvatar: '47', time: '5m',
    content: 'Just crossed 100K followers on Stubgram 🎉 Thank you to this amazing community for the support. Here\'s a thread on what actually worked for me 👇',
    media: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&q=70',
    likes: 2410, comments: 183,
  },
  {
    id: 'cp2', community: 'Tech & Innovation RW', communityAvatar: '12',
    author: 'Kevin Osei', authorAvatar: '12', time: '22m',
    content: 'Rwanda is quietly becoming East Africa\'s Silicon Valley. Here are 5 startups you should be watching right now. 🚀',
    media: null,
    likes: 841, comments: 64,
  },
  {
    id: 'cp3', community: 'Fitness Warriors', communityAvatar: '11',
    author: 'Marcus Reid', authorAvatar: '11', time: '1h',
    content: 'Monday push day 💪 Here\'s the exact workout I used to add 20kg to my bench in 90 days. Save this one.',
    media: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=70',
    likes: 3120, comments: 211,
  },
];

/* ── Tab type ──────────────────────────────────────────────────────────────── */
type Tab = 'posts' | 'join' | 'my';

/* ── Verified badge ────────────────────────────────────────────────────────── */
function VerifiedBadge() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="vb-c" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="#0a7ea4" offset="0%" /><stop stopColor="#EC4899" offset="100%" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#vb-c)" />
      <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Create community modal ────────────────────────────────────────────────── */
function CreateModal({ onClose }: { onClose: () => void }) {
  const [name, setName]       = useState('');
  const [desc, setDesc]       = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
  const [category, setCategory] = useState('');
  const [step, setStep]       = useState<'form' | 'done'>('form');

  const valid = name.trim().length >= 3 && desc.trim().length >= 10;

  if (step === 'done') return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'white', borderRadius: 24, padding: '48px 32px', textAlign: 'center', maxWidth: 380, width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#0a7ea4,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 36 }}>🌍</div>
        <h2 style={{ margin: '0 0 8px', fontFamily: FONT, fontSize: 20, fontWeight: 800, color: '#1A1A1A' }}>Community Created!</h2>
        <p style={{ margin: '0 0 28px', fontFamily: FONT, fontSize: 14, color: '#9CA3AF', lineHeight: 1.6 }}>
          <strong style={{ color: '#1A1A1A' }}>{name}</strong> is live. Invite members and start posting!
        </p>
        <button onClick={onClose} style={{
          width: '100%', height: 48, borderRadius: 999, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg,#0a7ea4,#EC4899)', color: 'white',
          fontFamily: FONT, fontSize: 15, fontWeight: 700,
          boxShadow: '0 4px 16px rgba(10,126,164,0.25)',
        }}>Go to Community 🚀</button>
      </div>
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: 'white', borderRadius: 24, width: '100%', maxWidth: 480, boxShadow: '0 24px 60px rgba(0,0,0,0.18)', overflow: 'hidden' }}>

        {/* Modal header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid #F3F4F6' }}>
          <h2 style={{ margin: 0, fontFamily: FONT, fontSize: 17, fontWeight: 800, color: '#1A1A1A' }}>Create a Community</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          {/* Banner upload area */}
          <div style={{
            height: 100, borderRadius: 16, marginBottom: 16,
            background: 'linear-gradient(135deg,#0a7ea4,#8b5cf6,#EC4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'white' }}>
              <Camera style={{ width: 24, height: 24 }} />
              <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600 }}>Add cover photo</span>
            </div>
          </div>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Community Name *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. African Tech Founders"
                style={{ width: '100%', height: 44, padding: '0 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontFamily: FONT, fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s' }}
                onFocus={e => (e.currentTarget.style.border = '1.5px solid #0a7ea4')}
                onBlur={e => (e.currentTarget.style.border = '1.5px solid #E5E7EB')}
              />
            </div>
            <div>
              <label style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Description *</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="What's your community about?" rows={3}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontFamily: FONT, fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box', transition: 'border 0.2s' }}
                onFocus={e => (e.currentTarget.style.border = '1.5px solid #0a7ea4')}
                onBlur={e => (e.currentTarget.style.border = '1.5px solid #E5E7EB')}
              />
            </div>
            <div>
              <label style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                style={{ width: '100%', height: 44, padding: '0 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontFamily: FONT, fontSize: 14, outline: 'none', background: 'white', boxSizing: 'border-box' }}
              >
                <option value="">Select a category</option>
                {['Technology','Business','Entertainment','Sports','Music','Health & Fitness','Education','Content Creation','Food','Travel'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Privacy toggle */}
            <div>
              <label style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Privacy</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {(['public','private'] as const).map(p => (
                  <button key={p} onClick={() => setPrivacy(p)} style={{
                    flex: 1, height: 44, borderRadius: 12, cursor: 'pointer',
                    border: privacy === p ? '2px solid #0a7ea4' : '1.5px solid #E5E7EB',
                    background: privacy === p ? 'rgba(10,126,164,0.06)' : 'white',
                    fontFamily: FONT, fontSize: 13, fontWeight: privacy === p ? 700 : 500,
                    color: privacy === p ? '#0a7ea4' : '#6B7280',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    transition: 'all 0.15s',
                  }}>
                    {p === 'public' ? <Globe style={{ width: 14, height: 14 }} /> : <Lock style={{ width: 14, height: 14 }} />}
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <button onClick={() => valid && setStep('done')} disabled={!valid} style={{
            width: '100%', height: 48, borderRadius: 999, border: 'none', cursor: valid ? 'pointer' : 'not-allowed',
            background: valid ? 'linear-gradient(135deg,#0a7ea4,#EC4899)' : '#F3F4F6',
            color: valid ? 'white' : '#D1D5DB',
            fontFamily: FONT, fontSize: 15, fontWeight: 700, marginTop: 20,
            boxShadow: valid ? '0 4px 16px rgba(10,126,164,0.25)' : 'none',
            transition: 'all 0.15s',
          }}>
            Create Community 🌍
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Community card (discover) ─────────────────────────────────────────────── */
function CommunityCard({ c }: { c: typeof DISCOVER_COMMUNITIES[0] }) {
  const [joined, setJoined] = useState(false);
  return (
    <div style={{ background: 'white', borderRadius: 20, border: '1px solid #E5E7EB', overflow: 'hidden', transition: 'box-shadow 0.15s', cursor: 'pointer' }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      {/* Banner */}
      <div style={{ height: 90, position: 'relative', background: 'linear-gradient(135deg,#0a7ea4,#EC4899)' }}>
        <Image src={c.banner} alt={c.name} fill style={{ objectFit: 'cover', opacity: 0.85 }} unoptimized />
        {/* Private badge */}
        {c.private && (
          <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.55)', borderRadius: 999, padding: '3px 8px' }}>
            <Lock style={{ width: 10, height: 10, color: 'white' }} />
            <span style={{ fontFamily: FONT, fontSize: 10, color: 'white', fontWeight: 600 }}>Private</span>
          </div>
        )}
        {/* Avatar */}
        <div style={{ position: 'absolute', bottom: -18, left: 16, width: 40, height: 40, borderRadius: '50%', border: '3px solid white', overflow: 'hidden', background: 'white' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.pravatar.cc/40?img=${c.avatar}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>

      <div style={{ padding: '24px 14px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
          <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.3 }}>{c.name}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
          <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: 'rgba(10,126,164,0.08)', color: '#0a7ea4', border: '1px solid rgba(10,126,164,0.15)' }}>{c.category}</span>
          <span style={{ fontFamily: FONT, fontSize: 11, color: '#9CA3AF' }}>· {c.members} members</span>
        </div>
        <p style={{ fontFamily: FONT, fontSize: 12, color: '#6B7280', lineHeight: 1.5, margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{c.description}</p>

        <button onClick={e => { e.stopPropagation(); setJoined(j => !j); }} style={{
          width: '100%', height: 36, borderRadius: 999,
          border: joined ? '1.5px solid #E5E7EB' : 'none',
          background: joined ? 'white' : 'linear-gradient(135deg,#0a7ea4,#EC4899)',
          color: joined ? '#1A1A1A' : 'white',
          fontFamily: FONT, fontSize: 13, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          boxShadow: joined ? 'none' : '0 2px 8px rgba(10,126,164,0.2)',
          transition: 'all 0.15s',
        }}>
          {joined ? <><Check style={{ width: 13, height: 13 }} /> Joined</> : <><Plus style={{ width: 13, height: 13 }} /> Join</>}
        </button>
      </div>
    </div>
  );
}

/* ── Community post card ───────────────────────────────────────────────────── */
function PostCard({ p }: { p: typeof COMMUNITY_POSTS[0] }) {
  const [liked, setLiked] = useState(false);
  const count = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + 'K' : String(n);
  return (
    <div style={{ background: 'white', borderRadius: 20, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
      {/* Community badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px 8px', borderBottom: '1px solid #F3F4F6' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`https://i.pravatar.cc/24?img=${p.communityAvatar}`} alt="" style={{ width: 24, height: 24, borderRadius: 6, objectFit: 'cover' }} />
        <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: '#0a7ea4' }}>{p.community}</span>
        <span style={{ fontFamily: FONT, fontSize: 11, color: '#9CA3AF', marginLeft: 'auto' }}>{p.time} ago</span>
      </div>

      {/* Post body */}
      <div style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.pravatar.cc/36?img=${p.authorAvatar}`} alt={p.author} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>{p.author}</span>
              <VerifiedBadge />
            </div>
          </div>
          <button style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#D1D5DB' }}>
            <MoreHorizontal style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <p style={{ fontFamily: FONT, fontSize: 14, color: '#1A1A1A', lineHeight: 1.6, margin: '0 0 12px' }}>{p.content}</p>

        {p.media && (
          <div style={{ borderRadius: 14, overflow: 'hidden', height: 200, position: 'relative', marginBottom: 12 }}>
            <Image src={p.media} alt="" fill style={{ objectFit: 'cover' }} unoptimized />
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, paddingTop: 8, borderTop: '1px solid #F9FAFB' }}>
          <button onClick={() => setLiked(l => !l)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 13, color: liked ? '#EC4899' : '#9CA3AF', fontWeight: liked ? 700 : 400, transition: 'color 0.15s' }}>
            <Heart style={{ width: 16, height: 16, fill: liked ? '#EC4899' : 'none' }} />
            {count(p.likes + (liked ? 1 : 0))}
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 13, color: '#9CA3AF' }}>
            <MessageCircle style={{ width: 16, height: 16 }} /> {count(p.comments)}
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 13, color: '#9CA3AF', marginLeft: 'auto' }}>
            <Share2 style={{ width: 16, height: 16 }} /> Share
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────────────────────────── */
export default function CommunitiesPage() {
  const [tab,         setTab]         = useState<Tab>('posts');
  const [showCreate,  setShowCreate]  = useState(false);
  const [search,      setSearch]      = useState('');

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'posts', label: 'Community Posts', icon: <MessageCircle style={{ width: 15, height: 15 }} /> },
    { id: 'join',  label: 'Discover',        icon: <Globe         style={{ width: 15, height: 15 }} /> },
    { id: 'my',    label: 'My Communities',  icon: <Users         style={{ width: 15, height: 15 }} /> },
  ];

  const filteredDiscover = DISCOVER_COMMUNITIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: FONT }}>

      {/* ── Sticky header ─────────────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E5E7EB',
      }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#0a7ea4,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users style={{ width: 18, height: 18, color: 'white' }} />
            </div>
            <h1 style={{ margin: 0, fontFamily: FONT, fontSize: 18, fontWeight: 800, color: '#1A1A1A' }}>Communities</h1>
          </div>
          <button onClick={() => setShowCreate(true)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            height: 36, paddingLeft: 16, paddingRight: 16, borderRadius: 999,
            border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg,#0a7ea4,#EC4899)',
            color: 'white', fontFamily: FONT, fontSize: 13, fontWeight: 700,
            boxShadow: '0 2px 8px rgba(10,126,164,0.25)',
            transition: 'opacity 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <Plus style={{ width: 14, height: 14 }} /> Create
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderTop: '1px solid #F3F4F6' }}>
          {TABS.map(({ id, label, icon }) => {
            const active = tab === id;
            return (
              <button key={id} onClick={() => setTab(id)} style={{
                flex: 1, paddingTop: 12, paddingBottom: 12,
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: FONT, fontSize: 13, fontWeight: active ? 700 : 500,
                color: active ? '#1A1A1A' : '#6B7280',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                position: 'relative', transition: 'color 0.15s',
              }}>
                <span style={{ color: active ? '#0a7ea4' : 'inherit' }}>{icon}</span>
                {label}
                {active && <span style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '50%', height: 3, borderRadius: 999, background: 'linear-gradient(90deg,#0a7ea4,#EC4899)' }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab: Community Posts ──────────────────────────────────────────── */}
      {tab === 'posts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 20 }}>
          {/* Hero prompt */}
          <div style={{ borderRadius: 20, background: 'linear-gradient(135deg,#0a7ea4,#8b5cf6,#EC4899)', padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.10)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ margin: '0 0 4px', fontFamily: FONT, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Latest from your communities</p>
              <h2 style={{ margin: '0 0 14px', fontFamily: FONT, fontSize: 18, fontWeight: 800, color: 'white' }}>Community Feed</h2>
              <button onClick={() => setTab('join')} style={{ height: 34, paddingLeft: 16, paddingRight: 16, borderRadius: 999, border: 'none', cursor: 'pointer', background: 'white', color: '#0a7ea4', fontFamily: FONT, fontSize: 13, fontWeight: 700 }}>
                Discover more
              </button>
            </div>
          </div>
          {COMMUNITY_POSTS.map(p => <PostCard key={p.id} p={p} />)}
        </div>
      )}

      {/* ── Tab: Discover / Join ─────────────────────────────────────────── */}
      {tab === 'join' && (
        <div style={{ padding: 20 }}>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#9CA3AF', pointerEvents: 'none' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search communities or categories"
              style={{ width: '100%', height: 44, paddingLeft: 42, paddingRight: 14, borderRadius: 999, border: '1.5px solid transparent', background: '#F3F4F6', fontFamily: FONT, fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s' }}
              onFocus={e => { (e.currentTarget.style.background = 'white'); (e.currentTarget.style.border = '1.5px solid #0a7ea4'); (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(10,126,164,0.08)'); }}
              onBlur={e => { (e.currentTarget.style.background = '#F3F4F6'); (e.currentTarget.style.border = '1.5px solid transparent'); (e.currentTarget.style.boxShadow = 'none'); }}
            />
          </div>
          <p style={{ fontFamily: FONT, fontSize: 13, color: '#9CA3AF', margin: '0 0 14px' }}>{filteredDiscover.length} communities found</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
            {filteredDiscover.map(c => <CommunityCard key={c.id} c={c} />)}
          </div>
        </div>
      )}

      {/* ── Tab: My Communities ───────────────────────────────────────────── */}
      {tab === 'my' && (
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Create CTA card */}
          <div onClick={() => setShowCreate(true)} style={{
            borderRadius: 20, border: '2px dashed rgba(10,126,164,0.3)',
            padding: '24px', display: 'flex', alignItems: 'center', gap: 16,
            cursor: 'pointer', transition: 'all 0.15s', background: 'rgba(10,126,164,0.02)',
          }}
            onMouseEnter={e => { (e.currentTarget.style.borderColor = '#0a7ea4'); (e.currentTarget.style.background = 'rgba(10,126,164,0.05)'); }}
            onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(10,126,164,0.3)'); (e.currentTarget.style.background = 'rgba(10,126,164,0.02)'); }}
          >
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#0a7ea4,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Plus style={{ width: 22, height: 22, color: 'white' }} />
            </div>
            <div>
              <p style={{ margin: '0 0 3px', fontFamily: FONT, fontSize: 15, fontWeight: 700, color: '#1A1A1A' }}>Create a new community</p>
              <p style={{ margin: 0, fontFamily: FONT, fontSize: 13, color: '#9CA3AF' }}>Build a space for people who share your passions</p>
            </div>
            <ChevronRight style={{ width: 18, height: 18, color: '#D1D5DB', marginLeft: 'auto', flexShrink: 0 }} />
          </div>

          {/* My communities list */}
          <div style={{ background: 'white', borderRadius: 20, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px 8px', borderBottom: '1px solid #F3F4F6' }}>
              <p style={{ margin: 0, fontFamily: FONT, fontSize: 15, fontWeight: 700, color: '#1A1A1A' }}>Your communities</p>
            </div>
            {MY_COMMUNITIES.map((c, i) => (
              <div key={c.id} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px',
                borderTop: i > 0 ? '1px solid #F3F4F6' : 'none',
                cursor: 'pointer', transition: 'background 0.12s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://i.pravatar.cc/44?img=${c.avatar}`} alt={c.name} style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: '0 0 2px', fontFamily: FONT, fontSize: 14, fontWeight: 700, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
                  <p style={{ margin: 0, fontFamily: FONT, fontSize: 12, color: '#9CA3AF' }}>{c.members} members</p>
                </div>
                {c.unread > 0 && (
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#0a7ea4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>{c.unread}</span>
                )}
                <ChevronRight style={{ width: 16, height: 16, color: '#D1D5DB', flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Create modal ──────────────────────────────────────────────────── */}
      {showCreate && <CreateModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}

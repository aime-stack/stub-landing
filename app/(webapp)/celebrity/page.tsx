'use client';

import { useState } from 'react';
import {
  Star, MessageCircle, Search, X, Send, Loader2,
  Crown, Clock, AlertCircle, CheckCircle, MapPin, Sparkles,
} from 'lucide-react';

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

// ─── Types ─────────────────────────────────────────────────────────────────
type CelebStatus = 'available' | 'busy';

interface Celebrity {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverImg: string;
  followers: string;
  bio: string;
  pricePerMsg: number;
  category: string;
  status: CelebStatus;
  responseTime: string;
  totalChats: number;
  location: string;
}

// ─── Data ──────────────────────────────────────────────────────────────────
const INITIAL_CELEBS: Celebrity[] = [
  {
    id: 'cel1', name: 'Selena Martinez', handle: 'selena_creates',
    avatar: '47', coverImg: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=70',
    followers: '2.4M', bio: 'Lifestyle creator & travel junkie 🌍',
    pricePerMsg: 50, category: 'Lifestyle', status: 'available',
    responseTime: '~2h', totalChats: 4820, location: 'Los Angeles, CA',
  },
  {
    id: 'cel2', name: 'Marcus Reid', handle: 'marcus.fit',
    avatar: '11', coverImg: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=70',
    followers: '1.2M', bio: 'Fitness coach & @nike athlete 💪',
    pricePerMsg: 30, category: 'Fitness', status: 'busy',
    responseTime: '~4h', totalChats: 3201, location: 'New York, NY',
  },
  {
    id: 'cel3', name: 'DJ Kofi', handle: 'djkofi',
    avatar: '33', coverImg: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=70',
    followers: '580K', bio: 'Award-winning DJ & producer 🎵',
    pricePerMsg: 75, category: 'Music', status: 'available',
    responseTime: '~6h', totalChats: 1940, location: 'Accra, Ghana',
  },
  {
    id: 'cel4', name: 'Chef Amara', handle: 'chefamara',
    avatar: '45', coverImg: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=70',
    followers: '320K', bio: 'Celebrity chef & cookbook author 🍽️',
    pricePerMsg: 40, category: 'Food', status: 'busy',
    responseTime: '~3h', totalChats: 2110, location: 'Lagos, Nigeria',
  },
  {
    id: 'cel5', name: 'Jake Thornton', handle: 'jakethephoto',
    avatar: '8', coverImg: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&q=70',
    followers: '320K', bio: 'Documentary photographer 📷',
    pricePerMsg: 25, category: 'Art', status: 'available',
    responseTime: '~1h', totalChats: 1380, location: 'Cape Town, SA',
  },
  {
    id: 'cel6', name: 'Nadia Wright', handle: 'nadia.eats',
    avatar: '23', coverImg: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=70',
    followers: '54K', bio: 'Food blogger & recipe creator 🍕',
    pricePerMsg: 20, category: 'Food', status: 'available',
    responseTime: '~30m', totalChats: 892, location: 'Nairobi, Kenya',
  },
];

const CATEGORIES = ['All', 'Lifestyle', 'Fitness', 'Music', 'Food', 'Art', 'Tech'];

// ─── Chat Modal ─────────────────────────────────────────────────────────────
function ChatModal({ celeb, onClose }: { celeb: Celebrity; onClose: () => void }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    setError(null);
    await new Promise(r => setTimeout(r, 900));
    setSending(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: 'white', borderRadius: 28, padding: '52px 36px', maxWidth: 380, width: '100%', boxShadow: '0 32px 80px rgba(0,0,0,0.20)', textAlign: 'center', fontFamily: FONT }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#0a7ea4,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={32} color="white" />
          </div>
          <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: '#111827' }}>Message Sent! 🎉</h2>
          <p style={{ margin: '0 0 6px', fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>
            Your message to <strong style={{ color: '#111827' }}>{celeb.name}</strong> was delivered.
          </p>
          <p style={{ margin: '0 0 20px', fontSize: 13, color: '#9CA3AF' }}>
            Expected reply in <span style={{ fontWeight: 700, color: '#0a7ea4' }}>{celeb.responseTime}</span>
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#D97706', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 14, padding: '10px 16px', marginBottom: 24 }}>
            <span style={{ fontSize: 16 }}>🪙</span>
            <span>{celeb.pricePerMsg} coins deducted</span>
          </div>
          <button onClick={onClose} style={{ width: '100%', height: 50, borderRadius: 999, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#0a7ea4,#8b5cf6)', color: 'white', fontFamily: FONT, fontSize: 15, fontWeight: 800, boxShadow: '0 4px 20px rgba(10,126,164,0.30)', transition: 'opacity 0.15s' }}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: FONT }}
    >
      <div style={{ background: 'white', borderRadius: 28, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.20)', display: 'flex', flexDirection: 'column' }}>

        {/* Header gradient */}
        <div style={{ background: 'linear-gradient(135deg,#0a7ea4,#8b5cf6)', padding: '24px 24px 20px', borderRadius: '28px 28px 0 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.pravatar.cc/60?img=${celeb.avatar}`}
                alt={celeb.name}
                style={{ width: 52, height: 52, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.5)', objectFit: 'cover', flexShrink: 0 }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontWeight: 800, fontSize: 17, color: 'white' }}>{celeb.name}</span>
                  <Star size={13} color="#FCD34D" fill="#FCD34D" />
                </div>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>@{celeb.handle}</span>
              </div>
            </div>
            <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <X size={16} color="white" />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,0.2)', color: 'white', padding: '6px 12px', borderRadius: 999 }}>
              🪙 {celeb.pricePerMsg} coins / message
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, background: 'rgba(255,255,255,0.2)', color: 'white', padding: '6px 12px', borderRadius: 999 }}>
              <Clock size={11} /> Replies {celeb.responseTime}
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 14, color: '#DC2626', fontSize: 13 }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}

          {/* Guidelines */}
          <div style={{ background: '#F9FAFB', borderRadius: 16, padding: '14px 16px', fontSize: 13, color: '#6B7280', lineHeight: 1.7 }}>
            <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#374151', fontSize: 13 }}>Before you send:</p>
            <p style={{ margin: 0 }}>• Be respectful and genuine</p>
            <p style={{ margin: 0 }}>• One message costs <strong style={{ color: '#D97706' }}>🪙 {celeb.pricePerMsg} coins</strong></p>
            <p style={{ margin: 0 }}>• Celebrities respond in their own time</p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8, fontFamily: FONT }}>
              Your message to {celeb.name.split(' ')[0]}
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={`Write your message to ${celeb.name.split(' ')[0]}…`}
              rows={5}
              maxLength={500}
              style={{ width: '100%', padding: '14px 16px', borderRadius: 16, border: '1.5px solid #E5E7EB', background: '#F9FAFB', fontSize: 14, color: '#111827', fontFamily: FONT, outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.6, transition: 'all 0.2s' }}
              onFocus={e => { e.currentTarget.style.border = '1.5px solid #0a7ea4'; e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(10,126,164,0.08)'; }}
              onBlur={e => { e.currentTarget.style.border = '1.5px solid #E5E7EB'; e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.boxShadow = 'none'; }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 11, color: '#9CA3AF' }}>Keep it respectful & personal</span>
              <span style={{ fontSize: 11, color: message.length > 450 ? '#EF4444' : '#9CA3AF', fontWeight: 600 }}>{message.length}/500</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '0 24px 24px', flexShrink: 0 }}>
          <button
            onClick={handleSend}
            disabled={sending || !message.trim()}
            style={{
              width: '100%', height: 52, borderRadius: 999, border: 'none',
              cursor: (sending || !message.trim()) ? 'not-allowed' : 'pointer',
              background: (sending || !message.trim()) ? '#E5E7EB' : 'linear-gradient(135deg,#0a7ea4,#8b5cf6)',
              color: (sending || !message.trim()) ? '#9CA3AF' : 'white',
              fontFamily: FONT, fontSize: 15, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: (!sending && message.trim()) ? '0 4px 20px rgba(10,126,164,0.30)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            {sending ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={18} />}
            {sending ? 'Sending…' : `Send Message · 🪙 ${celeb.pricePerMsg}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Celebrity Card (Marketplace-style) ─────────────────────────────────────
function CelebCard({ celeb, onChat }: { celeb: Celebrity; onChat: () => void }) {
  const isAvailable = celeb.status === 'available';

  return (
    <div
      style={{
        background: 'white', borderRadius: 20, border: '1px solid #E5E7EB',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'pointer',
        fontFamily: FONT,
      }}
      onMouseEnter={e => { (e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.10)'); (e.currentTarget.style.transform = 'translateY(-3px)'); }}
      onMouseLeave={e => { (e.currentTarget.style.boxShadow = 'none'); (e.currentTarget.style.transform = 'translateY(0)'); }}
    >
      {/* Cover image with avatar overlay */}
      <div style={{ position: 'relative', height: 110, background: '#F3F4F6', flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={celeb.coverImg}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.45))' }} />

        {/* Status badge */}
        <div style={{
          position: 'absolute', top: 10, left: 10,
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '4px 10px', borderRadius: 999,
          background: isAvailable ? 'rgba(16,185,129,0.92)' : 'rgba(107,114,128,0.85)',
          backdropFilter: 'blur(4px)',
          fontSize: 10, fontWeight: 700, color: 'white', letterSpacing: '0.03em',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: isAvailable ? '#A7F3D0' : '#D1D5DB', animation: isAvailable ? 'pulse 2s infinite' : 'none' }} />
          {isAvailable ? 'AVAILABLE' : 'BUSY'}
        </div>

        {/* Avatar */}
        <div style={{
          position: 'absolute', bottom: -26, left: '50%', transform: 'translateX(-50%)',
          padding: 3, borderRadius: '50%',
          background: isAvailable
            ? 'linear-gradient(135deg,#0a7ea4,#8b5cf6,#ec4899)'
            : '#D1D5DB',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.pravatar.cc/80?img=${celeb.avatar}`}
            alt={celeb.name}
            style={{
              width: 56, height: 56, borderRadius: '50%',
              objectFit: 'cover', border: '3px solid white',
              display: 'block',
              filter: isAvailable ? 'none' : 'grayscale(60%)',
            }}
          />
          {/* Online dot */}
          <div style={{
            position: 'absolute', bottom: 2, right: 2,
            width: 14, height: 14, borderRadius: '50%',
            background: isAvailable ? '#10B981' : '#9CA3AF',
            border: '2.5px solid white',
          }} />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '36px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Name + crown */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 2 }}>
            <span style={{ fontWeight: 800, fontSize: 15, color: '#111827' }}>{celeb.name}</span>
            <Crown size={13} color="#F59E0B" fill="#F59E0B" />
          </div>
          <p style={{ margin: 0, fontSize: 12, color: '#0a7ea4', fontWeight: 600 }}>@{celeb.handle}</p>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9CA3AF' }}>{celeb.followers} followers</p>
        </div>

        {/* Bio */}
        <p style={{ margin: 0, fontSize: 12, color: '#6B7280', textAlign: 'center', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
          {celeb.bio}
        </p>

        {/* Category + location */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#0a7ea4', background: 'rgba(10,126,164,0.10)', padding: '3px 10px', borderRadius: 999 }}>
            {celeb.category}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <MapPin size={10} color="#9CA3AF" />
            <span style={{ fontSize: 10, color: '#9CA3AF' }}>{celeb.location}</span>
          </div>
        </div>

        {/* Stats divider */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6', margin: '4px 0' }}>
          <div style={{ padding: '10px 8px', textAlign: 'center', borderRight: '1px solid #F3F4F6' }}>
            <p style={{ margin: '0 0 2px', fontSize: 10, color: '#9CA3AF', fontWeight: 500 }}>per message</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
              <span style={{ fontSize: 14 }}>🪙</span>
              <span style={{ fontWeight: 800, fontSize: 15, color: '#D97706' }}>{celeb.pricePerMsg}</span>
            </div>
          </div>
          <div style={{ padding: '10px 8px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 2px', fontSize: 10, color: '#9CA3AF', fontWeight: 500 }}>reply time</p>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: '#374151' }}>{celeb.responseTime}</p>
          </div>
        </div>

        {/* CTA */}
        {isAvailable ? (
          <button
            onClick={onChat}
            style={{
              width: '100%', height: 42, borderRadius: 999, border: 'none',
              cursor: 'pointer',
              background: 'linear-gradient(135deg,#0a7ea4,#8b5cf6)',
              color: 'white', fontFamily: FONT, fontSize: 13, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              boxShadow: '0 3px 12px rgba(10,126,164,0.28)',
              transition: 'opacity 0.15s, transform 0.1s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.90')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <MessageCircle size={15} />
            Chat Now
          </button>
        ) : (
          <button
            disabled
            style={{
              width: '100%', height: 42, borderRadius: 999,
              border: '1.5px solid #E5E7EB', background: '#F9FAFB',
              color: '#9CA3AF', fontFamily: FONT, fontSize: 13, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              cursor: 'not-allowed',
            }}
          >
            <Clock size={15} />
            Busy — Unavailable
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function CelebrityPage() {
  const [celebs] = useState<Celebrity[]>(INITIAL_CELEBS);
  const [activeCat, setActiveCat] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedCeleb, setSelectedCeleb] = useState<Celebrity | null>(null);

  const filtered = celebs.filter(c => {
    if (activeCat !== 'All' && c.category !== activeCat) return false;
    if (query && !c.name.toLowerCase().includes(query.toLowerCase()) && !c.handle.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const available = filtered.filter(c => c.status === 'available');
  const busy      = filtered.filter(c => c.status === 'busy');

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: FONT }}>

      {/* ── Hero Header ── */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0a7ea4 0%,#8b5cf6 55%,#ec4899 100%)' }} />
        {/* decorative circles */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', top: 20, left: '40%', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <div style={{ position: 'relative', padding: '32px 20px 28px', textAlign: 'center' }}>
          <div style={{ width: 54, height: 54, borderRadius: 18, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <Crown size={26} color="white" fill="white" />
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>Celebrity Chat</h1>
          <p style={{ margin: '0 0 20px', fontSize: 14, color: 'rgba(255,255,255,0.80)', lineHeight: 1.5 }}>
            Message your favourite celebrities directly
          </p>

          {/* Live count chips */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', color: 'white', padding: '7px 16px', borderRadius: 999 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34D399', display: 'inline-block' }} />
              {available.length} celebrities available now
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.90)', padding: '7px 16px', borderRadius: 999 }}>
              <Sparkles size={12} />
              {celebs.length} total creators
            </span>
          </div>
        </div>
      </div>

      {/* ── Sticky Search + Filters ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid #E5E7EB',
      }}>
        {/* Search */}
        <div style={{ padding: '14px 20px 10px', position: 'relative' }}>
          <Search style={{ position: 'absolute', left: 34, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#9CA3AF', pointerEvents: 'none' }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search celebrities..."
            style={{ width: '100%', height: 44, paddingLeft: 42, paddingRight: 14, borderRadius: 999, border: '1.5px solid transparent', background: '#F3F4F6', fontFamily: FONT, fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s' }}
            onFocus={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.border = '1.5px solid #0a7ea4'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(10,126,164,0.08)'; }}
            onBlur={e => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.border = '1.5px solid transparent'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 8, padding: '0 20px 12px', overflowX: 'auto' }} className="no-scrollbar">
          {CATEGORIES.map(cat => {
            const active = activeCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                style={{
                  flexShrink: 0,
                  height: 34, paddingLeft: 14, paddingRight: 14, borderRadius: 999,
                  border: active ? 'none' : '1.5px solid #E5E7EB',
                  background: active ? 'linear-gradient(135deg,#0a7ea4,#8b5cf6)' : 'white',
                  color: active ? 'white' : '#6B7280',
                  fontFamily: FONT, fontSize: 12, fontWeight: active ? 700 : 500, cursor: 'pointer',
                  boxShadow: active ? '0 2px 10px rgba(10,126,164,0.25)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '20px 20px 40px', maxWidth: 1200, margin: '0 auto' }}>

        {/* ── Available section ── */}
        {available.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block', flexShrink: 0 }} />
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#111827' }}>Available Now</h2>
              <span style={{ fontSize: 12, color: '#9CA3AF', marginLeft: 'auto', fontWeight: 500 }}>{available.length} celebrities</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {available.map(c => (
                <CelebCard key={c.id} celeb={c} onChat={() => setSelectedCeleb(c)} />
              ))}
            </div>
          </section>
        )}

        {/* ── Busy section ── */}
        {busy.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#9CA3AF', display: 'inline-block', flexShrink: 0 }} />
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#6B7280' }}>Currently Busy</h2>
              <span style={{ fontSize: 12, color: '#9CA3AF', marginLeft: 'auto', fontWeight: 500 }}>{busy.length} celebrities</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {busy.map(c => (
                <CelebCard key={c.id} celeb={c} onChat={() => {}} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 32px', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: 22, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Crown size={32} color="#D1D5DB" />
            </div>
            <p style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 800, color: '#111827', fontFamily: FONT }}>No celebrities found</p>
            <p style={{ margin: 0, fontSize: 14, color: '#9CA3AF', fontFamily: FONT }}>Try a different search or category.</p>
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {selectedCeleb && (
        <ChatModal celeb={selectedCeleb} onClose={() => setSelectedCeleb(null)} />
      )}

      {/* Keyframe for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

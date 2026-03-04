'use client';

import { useState } from 'react';
import {
  Star, MessageCircle, Search, X, Send, Loader2,
  Crown, Clock, AlertCircle, CheckCircle, Coins
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────
type CelebStatus = 'available' | 'busy';

interface Celebrity {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  followers: string;
  bio: string;
  pricePerMsg: number;
  category: string;
  status: CelebStatus;
  responseTime: string;
  totalChats: number;
}

// ─── Data ──────────────────────────────────────────────────────────────────
const INITIAL_CELEBS: Celebrity[] = [
  {
    id: 'cel1', name: 'Selena Martinez', handle: 'selena_creates',
    avatar: '47', followers: '2.4M', bio: 'Lifestyle creator & travel junkie 🌍',
    pricePerMsg: 50, category: 'Lifestyle', status: 'available',
    responseTime: '~2h', totalChats: 4820,
  },
  {
    id: 'cel2', name: 'Marcus Reid', handle: 'marcus.fit',
    avatar: '11', followers: '1.2M', bio: 'Fitness coach & @nike athlete 💪',
    pricePerMsg: 30, category: 'Fitness', status: 'busy',
    responseTime: '~4h', totalChats: 3201,
  },
  {
    id: 'cel3', name: 'DJ Kofi', handle: 'djkofi',
    avatar: '33', followers: '580K', bio: 'Award-winning DJ & producer 🎵',
    pricePerMsg: 75, category: 'Music', status: 'available',
    responseTime: '~6h', totalChats: 1940,
  },
  {
    id: 'cel4', name: 'Chef Amara', handle: 'chefamara',
    avatar: '45', followers: '320K', bio: 'Celebrity chef & cookbook author 🍽️',
    pricePerMsg: 40, category: 'Food', status: 'busy',
    responseTime: '~3h', totalChats: 2110,
  },
  {
    id: 'cel5', name: 'Jake Thornton', handle: 'jakethephoto',
    avatar: '8', followers: '320K', bio: 'Documentary photographer 📷',
    pricePerMsg: 25, category: 'Art', status: 'available',
    responseTime: '~1h', totalChats: 1380,
  },
  {
    id: 'cel6', name: 'Nadia Wright', handle: 'nadia.eats',
    avatar: '23', followers: '54K', bio: 'Food blogger & recipe creator 🍕',
    pricePerMsg: 20, category: 'Food', status: 'available',
    responseTime: '~30m', totalChats: 892,
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

    // In production: call Supabase to insert message + deduct coins
    // await supabase.from('celebrity_messages').insert({ celeb_id: celeb.id, message, coins_spent: celeb.pricePerMsg })

    setSending(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#0a7ea4] to-[#8b5cf6] flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-[20px] font-bold text-gray-900 mb-1">Message Sent!</h2>
          <p className="text-[14px] text-gray-500 mb-1">
            Your message to <strong>{celeb.name}</strong> was delivered.
          </p>
          <p className="text-[13px] text-gray-400 mb-6">
            Expected reply in <span className="font-semibold text-[#0a7ea4]">{celeb.responseTime}</span>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[13px] text-amber-600 font-semibold bg-amber-50 border border-amber-200 rounded-xl py-2 mb-5">
            <span className="text-base">🪙</span>
            <span>{celeb.pricePerMsg} coins deducted</span>
          </div>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#0a7ea4] to-[#8b5cf6] text-white font-bold hover:brightness-110 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#0a7ea4] to-[#8b5cf6] px-5 pt-5 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.pravatar.cc/56?img=${celeb.avatar}`}
                alt={celeb.name}
                className="w-12 h-12 rounded-full border-2 border-white/40 object-cover"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[16px] text-white">{celeb.name}</span>
                  <Star size={13} className="text-yellow-300 fill-current" />
                </div>
                <span className="text-white/75 text-[12px]">@{celeb.handle}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <X size={16} className="text-white" />
            </button>
          </div>

          {/* Info chips */}
          <div className="flex items-center gap-2 mt-3">
            <span className="flex items-center gap-1 text-[11px] font-semibold bg-white/20 text-white px-2.5 py-1 rounded-full">
              🪙 {celeb.pricePerMsg} coins per message
            </span>
            <span className="flex items-center gap-1 text-[11px] bg-white/20 text-white px-2.5 py-1 rounded-full">
              <Clock size={11} />
              Replies {celeb.responseTime}
            </span>
          </div>
        </div>

        {/* Message area */}
        <div className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          {/* Guidelines */}
          <div className="bg-gray-50 rounded-2xl p-3 text-[12px] text-gray-500 space-y-1">
            <p className="font-semibold text-gray-700 mb-1">Before you send:</p>
            <p>• Be respectful and genuine</p>
            <p>• One message costs <span className="font-bold text-amber-600">🪙 {celeb.pricePerMsg} coins</span></p>
            <p>• Celebrities respond in their own time</p>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
              Your message to {celeb.name.split(' ')[0]}
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={`Write your message to ${celeb.name.split(' ')[0]}…`}
              rows={5}
              maxLength={500}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] focus:border-transparent transition-all resize-none"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[11px] text-gray-400">Keep it respectful & personal</span>
              <span className={`text-[11px] ${message.length > 450 ? 'text-red-400' : 'text-gray-400'}`}>
                {message.length}/500
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <button
            onClick={handleSend}
            disabled={sending || !message.trim()}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#0a7ea4] to-[#8b5cf6] text-white font-bold text-[15px] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {sending ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
            {sending ? 'Sending…' : `Send Message · 🪙 ${celeb.pricePerMsg}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Celebrity Card (column grid) ───────────────────────────────────────────
function CelebCard({ celeb, onChat }: { celeb: Celebrity; onChat: () => void }) {
  const isAvailable = celeb.status === 'available';

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md ${
      isAvailable ? 'border-gray-200' : 'border-gray-200 opacity-90'
    }`}>
      {/* Status banner */}
      <div className={`flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-bold ${
        isAvailable
          ? 'bg-emerald-500 text-white'
          : 'bg-gray-400 text-white'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-white animate-pulse' : 'bg-gray-300'}`} />
        {isAvailable ? 'AVAILABLE' : 'BUSY'}
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center pt-4 pb-3 px-3">
        <div className={`relative mb-3 p-[2.5px] rounded-full ${
          isAvailable
            ? 'bg-gradient-to-tr from-[#0a7ea4] via-[#8b5cf6] to-[#ec4899]'
            : 'bg-gray-300'
        }`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.pravatar.cc/80?img=${celeb.avatar}`}
            alt={celeb.name}
            className={`w-16 h-16 rounded-full object-cover border-2 border-white ${!isAvailable ? 'grayscale' : ''}`}
          />
          <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${
            isAvailable ? 'bg-emerald-400' : 'bg-gray-400'
          }`} />
        </div>

        {/* Name + verify */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <span className="font-bold text-[14px] text-gray-900 leading-tight">{celeb.name}</span>
            <Crown size={12} className="text-yellow-500 fill-current shrink-0" />
          </div>
          <p className="text-[11px] text-gray-400">@{celeb.handle}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">{celeb.followers} followers</p>
        </div>

        {/* Bio */}
        <p className="text-[12px] text-gray-600 text-center mt-2 line-clamp-2 leading-tight px-1">
          {celeb.bio}
        </p>

        {/* Category chip */}
        <span className="mt-2 px-2.5 py-0.5 rounded-full bg-[#0a7ea4]/10 text-[#0a7ea4] text-[10px] font-semibold">
          {celeb.category}
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 divide-x divide-gray-100 border-t border-gray-100 text-center">
        <div className="py-2">
          <p className="text-[11px] text-gray-400 leading-none">per msg</p>
          <div className="flex items-center justify-center gap-0.5 mt-0.5">
            <span className="text-base">🪙</span>
            <span className="font-bold text-[14px] text-amber-600">{celeb.pricePerMsg}</span>
          </div>
        </div>
        <div className="py-2">
          <p className="text-[11px] text-gray-400 leading-none">reply</p>
          <p className="font-semibold text-[12px] text-gray-700 mt-0.5">{celeb.responseTime}</p>
        </div>
      </div>

      {/* Chat button */}
      <div className="p-3 pt-2">
        {isAvailable ? (
          <button
            onClick={onChat}
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#0a7ea4] to-[#8b5cf6] text-white text-[13px] font-bold hover:brightness-110 active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <MessageCircle size={14} />
            Chat Now
          </button>
        ) : (
          <button
            disabled
            className="w-full py-2.5 rounded-full bg-gray-100 text-gray-400 text-[13px] font-semibold cursor-not-allowed flex items-center justify-center gap-1.5 border border-gray-200"
          >
            <Clock size={14} />
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
    <div className="min-h-screen bg-white">

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a7ea4] via-[#8b5cf6] to-[#ec4899]" />
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute bottom-0 left-4 w-20 h-20 rounded-full bg-white/10" />

        <div className="relative px-4 pt-6 pb-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-2">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-[22px] font-bold text-white mb-1">Celebrity Chat</h1>
          <p className="text-white/80 text-[13px]">Message your favourite celebrities directly</p>

          {/* Live count */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="flex items-center gap-1.5 text-[12px] font-semibold bg-white/20 text-white px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {available.length} celebrities available now
            </span>
          </div>
        </div>
      </div>

      {/* ── Sticky Search + Filters ── */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search celebrities..."
            className="w-full h-10 pl-11 pr-4 rounded-full bg-gray-100 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] focus:bg-white transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 ${
                activeCat === cat
                  ? 'bg-gradient-to-r from-[#0a7ea4] to-[#8b5cf6] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">

        {/* ── Available section ── */}
        {available.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-[15px] font-bold text-gray-900">Available Now</h2>
              <span className="text-[12px] text-gray-400 ml-auto">{available.length} celebrities</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {available.map(c => (
                <CelebCard key={c.id} celeb={c} onChat={() => setSelectedCeleb(c)} />
              ))}
            </div>
          </section>
        )}

        {/* ── Busy section ── */}
        {busy.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              <h2 className="text-[15px] font-bold text-gray-500">Currently Busy</h2>
              <span className="text-[12px] text-gray-400 ml-auto">{busy.length} celebrities</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {busy.map(c => (
                <CelebCard key={c.id} celeb={c} onChat={() => {}} />
              ))}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <div className="py-20 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <Crown className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-900 font-semibold text-[15px] mb-1">No celebrities found</p>
            <p className="text-gray-400 text-[13px]">Try a different search or category.</p>
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {selectedCeleb && (
        <ChatModal celeb={selectedCeleb} onClose={() => setSelectedCeleb(null)} />
      )}
    </div>
  );
}

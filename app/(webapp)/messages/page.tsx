'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Shield, Lock, KeyRound, Eye, EyeOff, ArrowRight, MessageCircle,
  Search, Plus, MoreHorizontal, Send, Image, Smile, X, SquarePen,
  Settings, Check, CheckCheck,
} from 'lucide-react';

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

/* ─── Mock conversations ─────────────────────────────────────────────────── */
const CONVOS = [
  {
    id: 'c1', name: 'Selena Martinez', handle: 'selena_creates', avatar: '47',
    lastMsg: 'That sounds amazing! ✨', time: 'Now', unread: 2, online: true,
    messages: [
      { id: 'm1', from: 'them', text: 'Hey! Loved your last post 🔥', time: '10:30 AM', read: true },
      { id: 'm2', from: 'me',   text: 'Thank you so much! 😊',        time: '10:31 AM', read: true },
      { id: 'm3', from: 'them', text: 'That sounds amazing! ✨',       time: '10:43 AM', read: false },
    ],
  },
  {
    id: 'c2', name: 'Kevin Osei', handle: 'codewithkev', avatar: '12',
    lastMsg: 'You: Let\'s collab!', time: '15m', unread: 0, online: true,
    messages: [
      { id: 'm1', from: 'them', text: 'Saw your GitHub, impressive work!', time: '9:00 AM', read: true },
      { id: 'm2', from: 'me',   text: 'Let\'s collab!',                    time: '9:05 AM', read: true },
    ],
  },
  {
    id: 'c3', name: 'Marcus Reid', handle: 'marcus.fit', avatar: '11',
    lastMsg: 'Gym tomorrow at 7?', time: '1h', unread: 0, online: false,
    messages: [
      { id: 'm1', from: 'them', text: 'Gym tomorrow at 7?', time: '8:00 AM', read: true },
    ],
  },
  {
    id: 'c4', name: 'Nadia Wright', handle: 'nadia.eats', avatar: '23',
    lastMsg: 'Try the truffle pasta!', time: '3h', unread: 0, online: false,
    messages: [
      { id: 'm1', from: 'them', text: 'Try the truffle pasta!', time: 'Yesterday', read: true },
    ],
  },
];

type Convo = typeof CONVOS[0];
type Msg = { id: string; from: string; text: string; time: string; read: boolean };

/* ─── Passcode steps ─────────────────────────────────────────────────────── */
type Step = 'welcome' | 'create' | 'confirm' | 'chat';

/* ─── Passcode dots (4 digits) ───────────────────────────────────────────── */
function PasscodeDots({ value }: { value: string }) {
  return (
    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', margin: '24px 0' }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} style={{
          width: 16, height: 16, borderRadius: '50%',
          background: i < value.length
            ? 'linear-gradient(135deg,#0a7ea4,#EC4899)'
            : 'transparent',
          border: i < value.length ? 'none' : '2px solid rgba(255,255,255,0.4)',
          transition: 'all 0.15s',
        }} />
      ))}
    </div>
  );
}

/* ─── Numpad ─────────────────────────────────────────────────────────────── */
function Numpad({ onPress }: { onPress: (v: string) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, width: 280 }}>
      {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k, i) => (
        <button key={i} onClick={() => k && onPress(k)} disabled={!k}
          style={{
            height: 60, borderRadius: 18,
            background: k ? 'rgba(255,255,255,0.12)' : 'transparent',
            border: 'none', cursor: k ? 'pointer' : 'default',
            fontFamily: FONT, fontSize: 22, fontWeight: 600, color: 'white',
            opacity: k ? 1 : 0, transition: 'background 0.12s',
          }}
          onMouseEnter={e => { if (k) e.currentTarget.style.background = 'rgba(255,255,255,0.22)'; }}
          onMouseLeave={e => { if (k) e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
        >{k}</button>
      ))}
    </div>
  );
}

/* ─── Full Chat UI ───────────────────────────────────────────────────────── */
function ChatUI() {
  const [activeConvo, setActiveConvo] = useState<Convo>(CONVOS[0]);
  const [messages, setMessages]       = useState<Record<string, Msg[]>>(
    Object.fromEntries(CONVOS.map(c => [c.id, c.messages]))
  );
  const [input, setInput]             = useState('');
  const [search, setSearch]           = useState('');
  const [msgTab, setMsgTab]           = useState<'all' | 'requests'>('all');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConvo.id, messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg: Msg = { id: Date.now().toString(), from: 'me', text: input.trim(), time: 'Now', read: false };
    setMessages(prev => ({ ...prev, [activeConvo.id]: [...(prev[activeConvo.id] || []), msg] }));
    setInput('');
  };

  const filteredConvos = CONVOS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.handle.toLowerCase().includes(search.toLowerCase())
  );

  const convoMsgs = messages[activeConvo.id] || [];

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#FAFAFA', fontFamily: FONT, overflow: 'hidden' }}>

      {/* ── Left panel ─────────────────────────────────────────────────────── */}
      <div style={{ width: 320, borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', background: 'white', flexShrink: 0 }}>

        {/* Chat header */}
        <div style={{ padding: '14px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6' }}>
          <span style={{ fontFamily: FONT, fontSize: 18, fontWeight: 800, color: '#1A1A1A' }}>Chat</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {[<Settings key="s" style={{ width: 18, height: 18 }} />, <SquarePen key="p" style={{ width: 18, height: 18 }} />].map((icon, i) => (
              <button key={i} style={{
                width: 34, height: 34, borderRadius: '50%', background: '#F3F4F6', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#6B7280', cursor: 'pointer', transition: 'all 0.12s',
              }}
                onMouseEnter={e => { (e.currentTarget.style.background = 'rgba(10,126,164,0.1)'); (e.currentTarget.style.color = '#0a7ea4'); }}
                onMouseLeave={e => { (e.currentTarget.style.background = '#F3F4F6'); (e.currentTarget.style.color = '#6B7280'); }}
              >{icon}</button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#9CA3AF', pointerEvents: 'none' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages"
              style={{
                width: '100%', height: 38, paddingLeft: 36, paddingRight: 12,
                borderRadius: 999, border: '1.5px solid transparent', background: '#F3F4F6',
                fontFamily: FONT, fontSize: 13, outline: 'none', boxSizing: 'border-box',
                transition: 'all 0.2s',
              }}
              onFocus={e => { (e.currentTarget.style.background = 'white'); (e.currentTarget.style.border = '1.5px solid #0a7ea4'); }}
              onBlur={e => { (e.currentTarget.style.background = '#F3F4F6'); (e.currentTarget.style.border = '1.5px solid transparent'); }}
            />
          </div>
        </div>

        {/* All / Requests tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #F3F4F6' }}>
          {(['all', 'requests'] as const).map(t => (
            <button key={t} onClick={() => setMsgTab(t)} style={{
              flex: 1, paddingTop: 11, paddingBottom: 11, background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: FONT, fontSize: 13, fontWeight: msgTab === t ? 700 : 500,
              color: msgTab === t ? '#1A1A1A' : '#9CA3AF', position: 'relative', transition: 'color 0.15s',
            }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {msgTab === t && <span style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 32, height: 2.5, borderRadius: 999, background: '#0a7ea4' }} />}
            </button>
          ))}
        </div>

        {/* Conversation list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredConvos.map(c => (
            <div key={c.id} onClick={() => setActiveConvo(c)}
              style={{
                display: 'flex', gap: 12, alignItems: 'center', padding: '12px 16px',
                cursor: 'pointer', transition: 'background 0.12s',
                background: activeConvo.id === c.id ? 'rgba(10,126,164,0.06)' : 'transparent',
                borderLeft: activeConvo.id === c.id ? '3px solid #0a7ea4' : '3px solid transparent',
              }}
              onMouseEnter={e => { if (activeConvo.id !== c.id) e.currentTarget.style.background = '#F9FAFB'; }}
              onMouseLeave={e => { if (activeConvo.id !== c.id) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://i.pravatar.cc/44?img=${c.avatar}`} alt={c.name}
                  style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
                {c.online && <span style={{ position: 'absolute', bottom: 1, right: 1, width: 11, height: 11, borderRadius: '50%', background: '#10B981', border: '2px solid white' }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 150 }}>{c.name}</span>
                  <span style={{ fontFamily: FONT, fontSize: 11, color: c.unread > 0 ? '#0a7ea4' : '#9CA3AF', flexShrink: 0, marginLeft: 6 }}>{c.time}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: FONT, fontSize: 12, color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 170 }}>{c.lastMsg}</span>
                  {c.unread > 0 && (
                    <span style={{ flexShrink: 0, width: 18, height: 18, borderRadius: '50%', background: '#0a7ea4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontSize: 10, fontWeight: 700, color: 'white' }}>{c.unread}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* New message FAB */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #F3F4F6' }}>
          <button style={{
            width: '100%', height: 40, borderRadius: 999, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg,#0a7ea4,#EC4899)',
            fontFamily: FONT, fontSize: 14, fontWeight: 700, color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 2px 8px rgba(10,126,164,0.25)',
            transition: 'opacity 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <Plus style={{ width: 16, height: 16 }} /> New Message
          </button>
        </div>
      </div>

      {/* ── Right panel: conversation ──────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Conversation header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #E5E7EB', background: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://i.pravatar.cc/40?img=${activeConvo.avatar}`} alt={activeConvo.name}
                style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
              {activeConvo.online && <span style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: '#10B981', border: '2px solid white' }} />}
            </div>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: '#1A1A1A' }}>{activeConvo.name}</div>
              <div style={{ fontFamily: FONT, fontSize: 12, color: '#9CA3AF' }}>@{activeConvo.handle} {activeConvo.online ? '· Online' : ''}</div>
            </div>
          </div>
          <button style={{ width: 36, height: 36, borderRadius: '50%', background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
            <MoreHorizontal style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 10px', background: '#FAFAFA', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Profile card at top of convo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0 32px', gap: 8, textAlign: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://i.pravatar.cc/64?img=${activeConvo.avatar}`} alt={activeConvo.name}
              style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '3px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} />
            <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>{activeConvo.name}</div>
            <div style={{ fontFamily: FONT, fontSize: 13, color: '#9CA3AF' }}>@{activeConvo.handle}</div>
            <button style={{
              marginTop: 4, height: 34, paddingLeft: 18, paddingRight: 18, borderRadius: 999,
              border: '1.5px solid #E5E7EB', background: 'white', cursor: 'pointer',
              fontFamily: FONT, fontSize: 13, fontWeight: 600, color: '#1A1A1A',
              transition: 'all 0.12s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
              onMouseLeave={e => (e.currentTarget.style.background = 'white')}
            >View Profile</button>
          </div>

          {/* Date divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#F3F4F6' }} />
            <span style={{ fontFamily: FONT, fontSize: 11, color: '#D1D5DB', flexShrink: 0 }}>Today</span>
            <div style={{ flex: 1, height: 1, background: '#F3F4F6' }} />
          </div>

          {convoMsgs.map(msg => {
            const isMine = msg.from === 'me';
            return (
              <div key={msg.id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', marginBottom: 2 }}>
                {!isMine && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`https://i.pravatar.cc/28?img=${activeConvo.avatar}`} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', marginRight: 8, alignSelf: 'flex-end', flexShrink: 0 }} />
                )}
                <div style={{
                  maxWidth: '68%', padding: '10px 14px', borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: isMine ? 'linear-gradient(135deg,#0a7ea4,#0891b2)' : 'white',
                  color: isMine ? 'white' : '#1A1A1A',
                  fontFamily: FONT, fontSize: 14, lineHeight: 1.5,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
                }}>
                  {msg.text}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 4 }}>
                    <span style={{ fontFamily: FONT, fontSize: 10, color: isMine ? 'rgba(255,255,255,0.7)' : '#D1D5DB' }}>{msg.time}</span>
                    {isMine && (msg.read
                      ? <CheckCheck style={{ width: 12, height: 12, color: 'rgba(255,255,255,0.8)' }} />
                      : <Check style={{ width: 12, height: 12, color: 'rgba(255,255,255,0.6)' }} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Message input bar */}
        <div style={{ padding: '10px 16px 14px', background: 'white', borderTop: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 10 }}>
          {[<Plus key="p" style={{ width: 18, height: 18 }} />, <Image key="i" style={{ width: 18, height: 18 }} />, <Smile key="s" style={{ width: 18, height: 18 }} />].map((icon, i) => (
            <button key={i} style={{ width: 38, height: 38, borderRadius: '50%', background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', flexShrink: 0, transition: 'all 0.12s' }}
              onMouseEnter={e => { (e.currentTarget.style.background = 'rgba(10,126,164,0.1)'); (e.currentTarget.style.color = '#0a7ea4'); }}
              onMouseLeave={e => { (e.currentTarget.style.background = '#F3F4F6'); (e.currentTarget.style.color = '#6B7280'); }}
            >{icon}</button>
          ))}
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Start a new message"
            style={{
              flex: 1, height: 40, paddingLeft: 16, paddingRight: 16,
              borderRadius: 999, border: '1.5px solid #E5E7EB', background: '#F9FAFB',
              fontFamily: FONT, fontSize: 14, outline: 'none', color: '#1A1A1A',
              transition: 'all 0.2s',
            }}
            onFocus={e => { (e.currentTarget.style.border = '1.5px solid #0a7ea4'); (e.currentTarget.style.background = 'white'); (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(10,126,164,0.08)'); }}
            onBlur={e => { (e.currentTarget.style.border = '1.5px solid #E5E7EB'); (e.currentTarget.style.background = '#F9FAFB'); (e.currentTarget.style.boxShadow = 'none'); }}
          />
          <button onClick={sendMessage} disabled={!input.trim()} style={{
            width: 40, height: 40, borderRadius: '50%', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
            background: input.trim() ? 'linear-gradient(135deg,#0a7ea4,#EC4899)' : '#F3F4F6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: input.trim() ? 'white' : '#D1D5DB', flexShrink: 0,
            transition: 'all 0.15s', boxShadow: input.trim() ? '0 2px 8px rgba(10,126,164,0.25)' : 'none',
          }}>
            <Send style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────── */
export default function MessagesPage() {
  const [step,    setStep]    = useState<Step>('welcome');
  const [code,    setCode]    = useState('');
  const [confirm, setConfirm] = useState('');
  const [error,   setError]   = useState('');
  const [hidden,  setHidden]  = useState(true);

  const MAX = 4;

  const handlePress = (v: string) => {
    setError('');
    if (step === 'create') {
      if (v === '⌫') { setCode(p => p.slice(0, -1)); return; }
      if (code.length >= MAX) return;
      const next = code + v;
      setCode(next);
      if (next.length === MAX) setTimeout(() => setStep('confirm'), 300);
    } else {
      if (v === '⌫') { setConfirm(p => p.slice(0, -1)); return; }
      if (confirm.length >= MAX) return;
      const next = confirm + v;
      setConfirm(next);
      if (next.length === MAX) {
        if (next === code) setTimeout(() => setStep('chat'), 300);
        else setTimeout(() => { setError('Passcodes do not match. Try again.'); setConfirm(''); }, 300);
      }
    }
  };

  if (step === 'chat') return <ChatUI />;

  /* Welcome */
  if (step === 'welcome') return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '40px 28px', textAlign: 'center',
      background: 'linear-gradient(160deg,#0a0f1e 0%,#0a7ea4 50%,#EC4899 100%)',
      fontFamily: FONT, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
      <div style={{ position: 'absolute', bottom: -40, left: -40, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 400 }}>
        <div style={{ width: 88, height: 88, borderRadius: 28, marginBottom: 28, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 40px rgba(0,0,0,0.25)' }}>
          <MessageCircle style={{ width: 44, height: 44, color: '#0a7ea4' }} />
        </div>
        <h1 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 800, color: 'white' }}>Welcome to Stubgram Chat</h1>
        <p style={{ margin: '0 0 40px', fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, maxWidth: 300 }}>Private, secure messaging powered by end-to-end encryption.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', marginBottom: 40 }}>
          {[
            { icon: <Shield style={{ width: 20, height: 20 }} />, bg: 'rgba(10,126,164,0.25)', title: 'End-to-End Encryption', desc: 'Messages are end-to-end encrypted across all your devices.' },
            { icon: <Lock style={{ width: 20, height: 20 }} />,   bg: 'rgba(236,72,153,0.22)', title: 'State-of-the-Art Privacy', desc: "There's no way for anyone, including Stubgram, to read your messages." },
            { icon: <KeyRound style={{ width: 20, height: 20 }} />, bg: 'rgba(245,158,11,0.22)', title: 'Set Passcode', desc: "In order to secure your messages, you'll need to set up a 4-digit passcode." },
          ].map(f => (
            <div key={f.title} style={{ display: 'flex', gap: 14, padding: '16px 18px', borderRadius: 16, background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.10)', textAlign: 'left' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>{f.icon}</div>
              <div>
                <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 3 }}>{f.title}</div>
                <div style={{ fontFamily: FONT, fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => setStep('create')} style={{
          width: '100%', height: 52, borderRadius: 999, border: 'none', cursor: 'pointer',
          background: 'white', fontFamily: FONT, fontSize: 16, fontWeight: 800, color: '#0a7ea4',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)', transition: 'opacity 0.15s, transform 0.15s',
        }}
          onMouseEnter={e => { (e.currentTarget.style.opacity = '0.90'); (e.currentTarget.style.transform = 'scale(1.02)'); }}
          onMouseLeave={e => { (e.currentTarget.style.opacity = '1');    (e.currentTarget.style.transform = 'scale(1)'); }}
        >
          Create Passcode <ArrowRight style={{ width: 18, height: 18 }} />
        </button>
      </div>
    </div>
  );

  /* Create / Confirm */
  const isCreate = step === 'create';
  const active = isCreate ? code : confirm;
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '40px 28px', textAlign: 'center',
      background: 'linear-gradient(160deg,#0a0f1e 0%,#0a7ea4 50%,#EC4899 100%)',
      fontFamily: FONT,
    }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, marginBottom: 24, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <KeyRound style={{ width: 30, height: 30, color: 'white' }} />
      </div>
      <h2 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 800, color: 'white' }}>
        {isCreate ? 'Create a Passcode' : 'Confirm Passcode'}
      </h2>
      <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
        {isCreate ? 'Choose a 4-digit passcode to secure your messages.' : 'Enter the passcode again to confirm.'}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <PasscodeDots value={active} />
        <button onClick={() => setHidden(h => !h)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', padding: 4 }}>
          {hidden ? <Eye style={{ width: 16, height: 16 }} /> : <EyeOff style={{ width: 16, height: 16 }} />}
        </button>
      </div>

      {error && <div style={{ marginBottom: 12, fontFamily: FONT, fontSize: 13, color: '#FCA5A5', fontWeight: 600 }}>{error}</div>}

      <Numpad onPress={handlePress} />

      <button onClick={() => { setStep('welcome'); setCode(''); setConfirm(''); setError(''); }} style={{ marginTop: 24, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'underline' }}>
        Cancel
      </button>
    </div>
  );
}

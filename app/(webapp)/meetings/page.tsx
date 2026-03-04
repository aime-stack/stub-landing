'use client';

import { useState } from 'react';
import {
  Video, Plus, Link2, Users, Clock, Copy, Check,
  Phone, Mail, X, Search, Mic, MicOff, VideoOff,
  PhoneOff, Monitor, ChevronRight, Calendar,
} from 'lucide-react';

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

/* ─── Mock users to invite ───────────────────────────────────────────────── */
const APP_USERS = [
  { id: 'u1', name: 'Selena Martinez', handle: 'selena_creates', avatar: '47', online: true  },
  { id: 'u2', name: 'Kevin Osei',      handle: 'codewithkev',   avatar: '12', online: true  },
  { id: 'u3', name: 'Marcus Reid',     handle: 'marcus.fit',    avatar: '11', online: false },
  { id: 'u4', name: 'Nadia Wright',    handle: 'nadia.eats',    avatar: '23', online: true  },
  { id: 'u5', name: 'Amara Diallo',    handle: 'amara.glow',    avatar: '45', online: false },
  { id: 'u6', name: 'Jake Thornton',   handle: 'jakethephoto',  avatar: '8',  online: true  },
];

/* ─── Upcoming meetings ──────────────────────────────────────────────────── */
const UPCOMING = [
  { id: 'm1', title: 'Creator Collab — Season Recap',  host: 'Selena Martinez', avatar: '47', time: 'Today, 3:00 PM',     joining: 12,  live: true  },
  { id: 'm2', title: 'Tech Talk: AI in Social Media',  host: 'Kevin Osei',      avatar: '12', time: 'Tomorrow, 6:00 PM', joining: 34,  live: false },
  { id: 'm3', title: 'Fitness Challenge Kickoff',      host: 'Marcus Reid',     avatar: '11', time: 'Jun 20, 8:00 AM',   joining: 89,  live: false },
  { id: 'm4', title: 'Nollywood Fan Watch Party',      host: 'Nadia Wright',    avatar: '23', time: 'Jun 22, 7:00 PM',   joining: 204, live: false },
];

/* ─── Generate random meeting link ──────────────────────────────────────── */
const randomId = () => Math.random().toString(36).slice(2, 7).toUpperCase();
const makeMeetingLink = () => `https://stub.gram/meet/${randomId()}-${randomId()}-${randomId()}`;

/* ─── In-call overlay (simulated) ────────────────────────────────────────── */
function CallOverlay({ onEnd }: { onEnd: () => void }) {
  const [micOn,  setMicOn]  = useState(true);
  const [vidOn,  setVidOn]  = useState(true);
  const [shared, setShared] = useState(false);

  const CtrlBtn = ({ icon, label, active = true, danger = false, onClick }: {
    icon: React.ReactNode; label: string; active?: boolean; danger?: boolean; onClick?: () => void;
  }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <button onClick={onClick} style={{
        width: 52, height: 52, borderRadius: '50%', border: 'none', cursor: 'pointer',
        background: danger ? '#EF4444' : active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', transition: 'all 0.15s', backdropFilter: 'blur(8px)',
      }}
        onMouseEnter={e => (e.currentTarget.style.background = danger ? '#DC2626' : 'rgba(255,255,255,0.3)')}
        onMouseLeave={e => (e.currentTarget.style.background = danger ? '#EF4444' : active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)')}
      >{icon}</button>
      <span style={{ fontFamily: FONT, fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{label}</span>
    </div>
  );

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'linear-gradient(160deg,#0a0f1e 0%,#0d3951 40%,#0a7ea4 100%)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Participants grid */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, padding: 16 }}>
        {/* Self tile */}
        <div style={{ borderRadius: 20, background: 'rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden', minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {vidOn ? (
            <div style={{ inset: 0, position: 'absolute', background: 'linear-gradient(135deg,#0a7ea4,#8b5cf6)' }} />
          ) : (
            <VideoOff style={{ width: 32, height: 32, color: 'rgba(255,255,255,0.4)' }} />
          )}
          <div style={{ position: 'absolute', bottom: 10, left: 12, fontFamily: FONT, fontSize: 12, fontWeight: 600, color: 'white', background: 'rgba(0,0,0,0.4)', borderRadius: 999, padding: '2px 10px' }}>You</div>
        </div>

        {/* Remote participant */}
        <div style={{ borderRadius: 20, background: 'rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden', minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://i.pravatar.cc/150?img=47" alt="Selena" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
          <div style={{ position: 'absolute', bottom: 10, left: 12, fontFamily: FONT, fontSize: 12, fontWeight: 600, color: 'white', background: 'rgba(0,0,0,0.4)', borderRadius: 999, padding: '2px 10px' }}>Selena</div>
        </div>
      </div>

      {/* Timer */}
      <div style={{ textAlign: 'center', fontFamily: FONT, fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
        00:03:27 · Stubgram Meet
      </div>

      {/* Controls bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '16px 20px 32px' }}>
        <CtrlBtn icon={micOn  ? <Mic style={{ width: 20, height: 20 }} />   : <MicOff  style={{ width: 20, height: 20 }} />}   label={micOn  ? 'Mute'   : 'Unmute'} active={micOn}  onClick={() => setMicOn(m  => !m)}  />
        <CtrlBtn icon={vidOn  ? <Video style={{ width: 20, height: 20 }} /> : <VideoOff style={{ width: 20, height: 20 }} />}  label={vidOn  ? 'Stop'   : 'Start'}  active={vidOn}  onClick={() => setVidOn(v  => !v)}  />
        <CtrlBtn icon={<Monitor style={{ width: 20, height: 20 }} />}  label={shared ? 'Stop share' : 'Share screen'} active={!shared} onClick={() => setShared(s => !s)} />
        <CtrlBtn icon={<PhoneOff style={{ width: 22, height: 22 }} />} label="End call" danger onClick={onEnd} />
      </div>
    </div>
  );
}

/* ─── New Meeting Modal ──────────────────────────────────────────────────── */
function NewMeetingModal({ onClose }: { onClose: () => void }) {
  const [step,      setStep]      = useState<'setup' | 'invite' | 'shared'>('setup');
  const [title,     setTitle]     = useState('');
  const [selected,  setSelected]  = useState<string[]>([]);
  const [search,    setSearch]    = useState('');
  const [notifyVia, setNotifyVia] = useState<'email' | 'phone'>('email');
  const [link,      setLink]      = useState('');
  const [copied,    setCopied]    = useState(false);
  const [calling,   setCalling]   = useState(false);

  const filtered = APP_USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.handle.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const startMeeting = () => {
    const l = makeMeetingLink();
    setLink(l);
    setStep('invite');
  };

  const sendInvites = () => {
    setStep('shared');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (calling) return <CallOverlay onEnd={() => { setCalling(false); onClose(); }} />;

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'white', borderRadius: 24, width: '100%', maxWidth: 480, maxHeight: '88vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.20)' }}>

        {/* Header */}
        <div style={{ position: 'sticky', top: 0, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid #F3F4F6', zIndex: 1 }}>
          <h2 style={{ margin: 0, fontFamily: FONT, fontSize: 17, fontWeight: 800, color: '#1A1A1A' }}>
            {step === 'setup' ? 'New Meeting' : step === 'invite' ? 'Invite People' : '🚀 Meeting Ready!'}
          </h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* ── Step 1: Setup ── */}
        {step === 'setup' && (
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Meeting Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Creator Collab Session"
                style={{ width: '100%', height: 44, padding: '0 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontFamily: FONT, fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s' }}
                onFocus={e => (e.currentTarget.style.border = '1.5px solid #0a7ea4')}
                onBlur={e => (e.currentTarget.style.border = '1.5px solid #E5E7EB')}
              />
            </div>

            {/* Instant vs Scheduled */}
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { icon: <Video style={{ width: 16, height: 16 }} />, label: 'Instant Call',   sub: 'Start right now' },
                { icon: <Calendar style={{ width: 16, height: 16 }} />, label: 'Schedule',   sub: 'Set a time' },
              ].map((opt, i) => (
                <button key={i} style={{
                  flex: 1, padding: '14px 12px', borderRadius: 16, cursor: 'pointer',
                  border: i === 0 ? '2px solid #0a7ea4' : '1.5px solid #E5E7EB',
                  background: i === 0 ? 'rgba(10,126,164,0.06)' : 'white',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                  color: i === 0 ? '#0a7ea4' : '#9CA3AF',
                }}>
                  {opt.icon}
                  <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700 }}>{opt.label}</span>
                  <span style={{ fontFamily: FONT, fontSize: 11, color: '#9CA3AF' }}>{opt.sub}</span>
                </button>
              ))}
            </div>

            <button onClick={startMeeting} style={{
              width: '100%', height: 48, borderRadius: 999, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg,#0a7ea4,#EC4899)',
              color: 'white', fontFamily: FONT, fontSize: 15, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 16px rgba(10,126,164,0.25)',
            }}>
              <Video style={{ width: 18, height: 18 }} /> Create Meeting Link
            </button>
          </div>
        )}

        {/* ── Step 2: Invite ── */}
        {step === 'invite' && (
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Meeting link card */}
            <div style={{ borderRadius: 16, background: 'linear-gradient(135deg,rgba(10,126,164,0.06),rgba(236,72,153,0.04))', border: '1px solid rgba(10,126,164,0.15)', padding: '14px 16px' }}>
              <p style={{ margin: '0 0 6px', fontFamily: FONT, fontSize: 11, fontWeight: 700, color: '#0a7ea4', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Meeting Link</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <p style={{ flex: 1, margin: 0, fontFamily: FONT, fontSize: 12, color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link}</p>
                <button onClick={copyLink} style={{ flexShrink: 0, height: 32, paddingLeft: 12, paddingRight: 12, borderRadius: 999, border: 'none', cursor: 'pointer', background: copied ? '#10B981' : '#0a7ea4', color: 'white', fontFamily: FONT, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5, transition: 'background 0.2s' }}>
                  {copied ? <Check style={{ width: 12, height: 12 }} /> : <Copy style={{ width: 12, height: 12 }} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Notify via */}
            <div>
              <p style={{ margin: '0 0 8px', fontFamily: FONT, fontSize: 12, fontWeight: 700, color: '#374151' }}>Send invite via</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {(['email', 'phone'] as const).map(v => (
                  <button key={v} onClick={() => setNotifyVia(v)} style={{
                    flex: 1, height: 40, borderRadius: 12, cursor: 'pointer',
                    border: notifyVia === v ? '2px solid #0a7ea4' : '1.5px solid #E5E7EB',
                    background: notifyVia === v ? 'rgba(10,126,164,0.06)' : 'white',
                    color: notifyVia === v ? '#0a7ea4' : '#6B7280',
                    fontFamily: FONT, fontSize: 13, fontWeight: notifyVia === v ? 700 : 500,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    transition: 'all 0.15s',
                  }}>
                    {v === 'email' ? <Mail style={{ width: 14, height: 14 }} /> : <Phone style={{ width: 14, height: 14 }} />}
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* User search + select */}
            <div>
              <p style={{ margin: '0 0 8px', fontFamily: FONT, fontSize: 12, fontWeight: 700, color: '#374151' }}>Invite from Stubgram</p>
              <div style={{ position: 'relative', marginBottom: 10 }}>
                <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#9CA3AF', pointerEvents: 'none' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…"
                  style={{ width: '100%', height: 40, paddingLeft: 36, paddingRight: 12, borderRadius: 12, border: '1.5px solid #E5E7EB', fontFamily: FONT, fontSize: 13, outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s' }}
                  onFocus={e => (e.currentTarget.style.border = '1.5px solid #0a7ea4')}
                  onBlur={e => (e.currentTarget.style.border = '1.5px solid #E5E7EB')}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 220, overflowY: 'auto' }}>
                {filtered.map(u => {
                  const sel = selected.includes(u.id);
                  return (
                    <div key={u.id} onClick={() => toggle(u.id)} style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12,
                      cursor: 'pointer', background: sel ? 'rgba(10,126,164,0.06)' : 'transparent',
                      border: sel ? '1.5px solid rgba(10,126,164,0.2)' : '1.5px solid transparent',
                      transition: 'all 0.15s',
                    }}>
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`https://i.pravatar.cc/36?img=${u.avatar}`} alt={u.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                        {u.online && <span style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: '#10B981', border: '2px solid white' }} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontFamily: FONT, fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>{u.name}</p>
                        <p style={{ margin: 0, fontFamily: FONT, fontSize: 11, color: '#9CA3AF' }}>@{u.handle}{u.online ? ' · Online' : ''}</p>
                      </div>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', border: sel ? 'none' : '2px solid #E5E7EB', background: sel ? 'linear-gradient(135deg,#0a7ea4,#EC4899)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                        {sel && <Check style={{ width: 12, height: 12, color: 'white' }} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={sendInvites} style={{
              width: '100%', height: 48, borderRadius: 999, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg,#0a7ea4,#EC4899)',
              color: 'white', fontFamily: FONT, fontSize: 15, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 16px rgba(10,126,164,0.25)',
            }}>
              {notifyVia === 'email' ? <Mail style={{ width: 16, height: 16 }} /> : <Phone style={{ width: 16, height: 16 }} />}
              Send Invites via {notifyVia === 'email' ? 'Email' : 'Phone'}
              {selected.length > 0 && ` (${selected.length})`}
            </button>
          </div>
        )}

        {/* ── Step 3: Shared ── */}
        {step === 'shared' && (
          <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#0a7ea4,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>📨</div>
            <h3 style={{ margin: 0, fontFamily: FONT, fontSize: 18, fontWeight: 800, color: '#1A1A1A' }}>Invites Sent!</h3>
            <p style={{ margin: 0, fontFamily: FONT, fontSize: 14, color: '#9CA3AF', lineHeight: 1.6 }}>
              {selected.length > 0
                ? `Invites sent to ${selected.length} participant${selected.length > 1 ? 's' : ''} via ${notifyVia}.`
                : 'Your meeting link is ready to share.'}
            </p>
            {/* Link reminder */}
            <div style={{ width: '100%', borderRadius: 14, background: '#F9FAFB', border: '1px solid #E5E7EB', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <p style={{ flex: 1, margin: 0, fontFamily: FONT, fontSize: 11, color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link}</p>
              <button onClick={copyLink} style={{ flexShrink: 0, height: 28, paddingLeft: 10, paddingRight: 10, borderRadius: 999, border: 'none', cursor: 'pointer', background: copied ? '#10B981' : '#0a7ea4', color: 'white', fontFamily: FONT, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                {copied ? <Check style={{ width: 11, height: 11 }} /> : <Copy style={{ width: 11, height: 11 }} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            {/* Start now */}
            <button onClick={() => setCalling(true)} style={{
              width: '100%', height: 48, borderRadius: 999, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg,#0a7ea4,#EC4899)', color: 'white',
              fontFamily: FONT, fontSize: 15, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 16px rgba(10,126,164,0.25)',
            }}>
              <Video style={{ width: 18, height: 18 }} /> Start Call Now
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 13, color: '#9CA3AF', textDecoration: 'underline' }}>
              Maybe later
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Join by Link modal ─────────────────────────────────────────────────── */
function JoinModal({ onClose }: { onClose: () => void }) {
  const [val,  setVal]  = useState('');
  const [calling, setCalling] = useState(false);

  if (calling) return <CallOverlay onEnd={() => { setCalling(false); onClose(); }} />;

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'white', borderRadius: 24, width: '100%', maxWidth: 420, boxShadow: '0 24px 60px rgba(0,0,0,0.20)', padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontFamily: FONT, fontSize: 17, fontWeight: 800, color: '#1A1A1A' }}>Join a Meeting</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>
        <label style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Meeting Link or ID</label>
        <input value={val} onChange={e => setVal(e.target.value)} placeholder="https://stub.gram/meet/…"
          style={{ width: '100%', height: 44, padding: '0 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontFamily: FONT, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 16, transition: 'border 0.2s' }}
          onFocus={e => (e.currentTarget.style.border = '1.5px solid #0a7ea4')}
          onBlur={e => (e.currentTarget.style.border = '1.5px solid #E5E7EB')}
        />
        <button onClick={() => val.trim() && setCalling(true)} disabled={!val.trim()} style={{
          width: '100%', height: 48, borderRadius: 999, border: 'none',
          cursor: val.trim() ? 'pointer' : 'not-allowed',
          background: val.trim() ? 'linear-gradient(135deg,#0a7ea4,#EC4899)' : '#F3F4F6',
          color: val.trim() ? 'white' : '#D1D5DB',
          fontFamily: FONT, fontSize: 15, fontWeight: 700,
          boxShadow: val.trim() ? '0 4px 16px rgba(10,126,164,0.25)' : 'none',
        }}>
          Join Call
        </button>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function MeetingsPage() {
  const [showNew,  setShowNew]  = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: FONT }}>

      {/* ── Hero header ──────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg,#0a7ea4 0%,#8b5cf6 50%,#EC4899 100%)',
        padding: '32px 20px 28px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -24, left: -24, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Video style={{ width: 18, height: 18, color: 'white' }} />
            </div>
            <h1 style={{ margin: 0, fontFamily: FONT, fontSize: 22, fontWeight: 800, color: 'white' }}>Meetings</h1>
          </div>
          <p style={{ margin: '0 0 24px', fontFamily: FONT, fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>Video calls & live sessions with your people</p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setShowNew(true)} style={{
              flex: 1, height: 48, borderRadius: 999, border: 'none', cursor: 'pointer',
              background: 'white', color: '#0a7ea4',
              fontFamily: FONT, fontSize: 14, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              transition: 'opacity 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.90')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <Plus style={{ width: 18, height: 18 }} /> New Meeting
            </button>
            <button onClick={() => setShowJoin(true)} style={{
              flex: 1, height: 48, borderRadius: 999,
              border: '2px solid rgba(255,255,255,0.5)', cursor: 'pointer',
              background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
              color: 'white', fontFamily: FONT, fontSize: 14, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
            >
              <Link2 style={{ width: 16, height: 16 }} /> Join by Link
            </button>
          </div>
        </div>
      </div>

      {/* ── Online now strip ─────────────────────────────────────────────── */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB' }}>
        <p style={{ margin: '0 0 12px', fontFamily: FONT, fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>
          🟢 Online Now
        </p>
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 4 }} className="no-scrollbar">
          {APP_USERS.filter(u => u.online).map(u => (
            <div key={u.id} onClick={() => setShowNew(true)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0, cursor: 'pointer' }}>
              <div style={{ position: 'relative' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://i.pravatar.cc/48?img=${u.avatar}`} alt={u.name}
                  style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2.5px solid #0a7ea4' }} />
                <span style={{ position: 'absolute', bottom: 1, right: 1, width: 13, height: 13, borderRadius: '50%', background: '#10B981', border: '2px solid white' }} />
              </div>
              <span style={{ fontFamily: FONT, fontSize: 11, color: '#374151', maxWidth: 56, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {u.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Upcoming meetings ────────────────────────────────────────────── */}
      <div style={{ padding: '16px 20px' }}>
        <p style={{ margin: '0 0 14px', fontFamily: FONT, fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>📅 Upcoming Meetings</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {UPCOMING.map(m => (
            <div key={m.id} style={{ background: 'white', borderRadius: 20, border: '1px solid #E5E7EB', overflow: 'hidden', transition: 'box-shadow 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              {/* Live banner */}
              {m.live && (
                <div style={{ background: 'linear-gradient(135deg,#EF4444,#EC4899)', padding: '4px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'white', animation: 'pulse 1s infinite' }} />
                  <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 800, color: 'white', letterSpacing: '0.06em' }}>LIVE NOW</span>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://i.pravatar.cc/48?img=${m.avatar}`} alt={m.host}
                  style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid #E5E7EB' }} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: '0 0 3px', fontFamily: FONT, fontSize: 14, fontWeight: 700, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</p>
                  <p style={{ margin: '0 0 5px', fontFamily: FONT, fontSize: 12, color: '#6B7280' }}>Hosted by {m.host}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: FONT, fontSize: 11, color: '#9CA3AF' }}>
                      <Clock style={{ width: 11, height: 11 }} /> {m.time}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: FONT, fontSize: 11, color: '#9CA3AF' }}>
                      <Users style={{ width: 11, height: 11 }} /> {m.joining} joining
                    </span>
                  </div>
                </div>

                <button onClick={() => setShowJoin(true)} style={{
                  flexShrink: 0, height: 36, paddingLeft: 16, paddingRight: 16, borderRadius: 999,
                  border: 'none', cursor: 'pointer',
                  background: m.live
                    ? 'linear-gradient(135deg,#EF4444,#EC4899)'
                    : 'linear-gradient(135deg,#0a7ea4,#EC4899)',
                  color: 'white', fontFamily: FONT, fontSize: 13, fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: 5,
                  boxShadow: '0 2px 8px rgba(10,126,164,0.22)',
                }}>
                  <Video style={{ width: 13, height: 13 }} />
                  {m.live ? 'Join Live' : 'Join'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Schedule CTA */}
        <button onClick={() => setShowNew(true)} style={{
          width: '100%', height: 48, borderRadius: 999, border: '2px dashed rgba(10,126,164,0.3)',
          background: 'rgba(10,126,164,0.02)', cursor: 'pointer',
          fontFamily: FONT, fontSize: 14, fontWeight: 700, color: '#0a7ea4',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          marginTop: 16, transition: 'all 0.15s',
        }}
          onMouseEnter={e => { (e.currentTarget.style.borderColor = '#0a7ea4'); (e.currentTarget.style.background = 'rgba(10,126,164,0.06)'); }}
          onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(10,126,164,0.3)'); (e.currentTarget.style.background = 'rgba(10,126,164,0.02)'); }}
        >
          <Calendar style={{ width: 16, height: 16 }} /> Schedule a New Meeting
          <ChevronRight style={{ width: 16, height: 16 }} />
        </button>
      </div>

      {/* Modals */}
      {showNew  && <NewMeetingModal  onClose={() => setShowNew(false)}  />}
      {showJoin && <JoinModal        onClose={() => setShowJoin(false)} />}
    </div>
  );
}

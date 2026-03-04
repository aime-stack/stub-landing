'use client';

import { useState } from 'react';
import { Shield, Lock, KeyRound, Eye, EyeOff, ArrowRight, MessageCircle } from 'lucide-react';

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

/* ─── Passcode dots ──────────────────────────────────────────────────────── */
function PasscodeInput({ value, max = 6 }: { value: string; max?: number }) {
  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', margin: '24px 0' }}>
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} style={{
          width: 14, height: 14, borderRadius: '50%',
          background: i < value.length
            ? 'linear-gradient(135deg,#0a7ea4,#EC4899)'
            : 'transparent',
          border: i < value.length ? 'none' : '2px solid rgba(255,255,255,0.4)',
          transition: 'background 0.15s',
        }} />
      ))}
    </div>
  );
}

/* ─── Numpad ─────────────────────────────────────────────────────────────── */
function Numpad({ onPress }: { onPress: (v: string) => void }) {
  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫'];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, width: '100%', maxWidth: 280 }}>
      {keys.map((k, i) => (
        <button key={i} onClick={() => k && onPress(k)}
          disabled={!k}
          style={{
            height: 58, borderRadius: 16,
            background: k ? 'rgba(255,255,255,0.12)' : 'transparent',
            border: 'none', cursor: k ? 'pointer' : 'default',
            fontFamily: FONT, fontSize: 22, fontWeight: 600, color: 'white',
            transition: 'background 0.12s',
            opacity: k ? 1 : 0,
          }}
          onMouseEnter={e => { if (k) e.currentTarget.style.background = 'rgba(255,255,255,0.22)'; }}
          onMouseLeave={e => { if (k) e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
        >
          {k}
        </button>
      ))}
    </div>
  );
}

/* ─── Steps ──────────────────────────────────────────────────────────────── */
type Step = 'welcome' | 'create' | 'confirm' | 'done';

export default function MessagesPage() {
  const [step,    setStep]    = useState<Step>('welcome');
  const [code,    setCode]    = useState('');
  const [confirm, setConfirm] = useState('');
  const [error,   setError]   = useState('');
  const [hidden,  setHidden]  = useState(true);

  const MAX = 6;

  const handlePress = (v: string) => {
    setError('');
    if (step === 'create') {
      if (v === '⌫') { setCode(p => p.slice(0, -1)); return; }
      if (code.length >= MAX) return;
      const next = code + v;
      setCode(next);
      if (next.length === MAX) setTimeout(() => setStep('confirm'), 300);
    } else if (step === 'confirm') {
      if (v === '⌫') { setConfirm(p => p.slice(0, -1)); return; }
      if (confirm.length >= MAX) return;
      const next = confirm + v;
      setConfirm(next);
      if (next.length === MAX) {
        if (next === code) { setTimeout(() => setStep('done'), 300); }
        else { setTimeout(() => { setError('Passcodes do not match. Try again.'); setConfirm(''); }, 300); }
      }
    }
  };

  /* ── WELCOME ── */
  if (step === 'welcome') return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(160deg,#0a0f1e 0%,#0a7ea4 50%,#EC4899 100%)',
      fontFamily: FONT,
    }}>
      {/* Top decorative blobs */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
      <div style={{ position: 'absolute', top: 80, left: -40, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 28px', textAlign: 'center', position: 'relative', zIndex: 1 }}>

        {/* App icon */}
        <div style={{
          width: 88, height: 88, borderRadius: 28, marginBottom: 28,
          background: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
        }}>
          <MessageCircle style={{ width: 44, height: 44, color: '#0a7ea4' }} />
        </div>

        <h1 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 800, color: 'white', lineHeight: 1.2 }}>
          Welcome to Stubgram Chat
        </h1>
        <p style={{ margin: '0 0 40px', fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, maxWidth: 320 }}>
          Private, secure messaging powered by end-to-end encryption.
        </p>

        {/* Feature cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 380, marginBottom: 48 }}>
          {[
            {
              icon: <Shield style={{ width: 20, height: 20 }} />,
              title: 'End-to-End Encryption',
              desc: 'Messages are end-to-end encrypted across all your devices.',
              bg: 'rgba(10,126,164,0.25)',
            },
            {
              icon: <Lock style={{ width: 20, height: 20 }} />,
              title: 'State-of-the-Art Privacy',
              desc: 'There\'s no way for anyone, including Stubgram, to read your messages.',
              bg: 'rgba(236,72,153,0.22)',
            },
            {
              icon: <KeyRound style={{ width: 20, height: 20 }} />,
              title: 'Set Passcode',
              desc: 'In order to secure your messages, you\'ll need to set up a passcode.',
              bg: 'rgba(245,158,11,0.22)',
            },
          ].map(f => (
            <div key={f.title} style={{
              display: 'flex', alignItems: 'flex-start', gap: 14,
              padding: '16px 18px', borderRadius: 16,
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.10)',
              textAlign: 'left',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: f.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white',
              }}>{f.icon}</div>
              <div>
                <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 3 }}>{f.title}</div>
                <div style={{ fontFamily: FONT, fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => setStep('create')}
          style={{
            width: '100%', maxWidth: 320, height: 52,
            borderRadius: 999, border: 'none', cursor: 'pointer',
            background: 'white',
            fontFamily: FONT, fontSize: 16, fontWeight: 800, color: '#0a7ea4',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            transition: 'opacity 0.15s, transform 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget.style.opacity = '0.90'); (e.currentTarget.style.transform = 'scale(1.02)'); }}
          onMouseLeave={e => { (e.currentTarget.style.opacity = '1');    (e.currentTarget.style.transform = 'scale(1)'); }}
        >
          Create Passcode <ArrowRight style={{ width: 18, height: 18 }} />
        </button>
      </div>
    </div>
  );

  /* ── CREATE / CONFIRM ── (shared numpad UI) */
  if (step === 'create' || step === 'confirm') {
    const isCreate = step === 'create';
    const activeCode = isCreate ? code : confirm;
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '40px 28px', textAlign: 'center',
        background: 'linear-gradient(160deg,#0a0f1e 0%,#0a7ea4 50%,#EC4899 100%)',
        fontFamily: FONT,
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20, marginBottom: 24,
          background: 'rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <KeyRound style={{ width: 30, height: 30, color: 'white' }} />
        </div>

        <h2 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 800, color: 'white' }}>
          {isCreate ? 'Create a Passcode' : 'Confirm Passcode'}
        </h2>
        <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
          {isCreate ? 'Choose a 6-digit passcode to secure your messages.' : 'Enter the passcode again to confirm.'}
        </p>

        {/* Dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <PasscodeInput value={hidden ? activeCode : activeCode} max={MAX} />
          <button onClick={() => setHidden(h => !h)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', padding: 4 }}>
            {hidden ? <Eye style={{ width: 16, height: 16 }} /> : <EyeOff style={{ width: 16, height: 16 }} />}
          </button>
        </div>

        {error && (
          <div style={{ marginBottom: 12, fontFamily: FONT, fontSize: 13, color: '#FCA5A5', fontWeight: 600 }}>{error}</div>
        )}

        <Numpad onPress={handlePress} />

        <button onClick={() => { setStep('welcome'); setCode(''); setConfirm(''); setError(''); }}
          style={{ marginTop: 24, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'underline' }}>
          Cancel
        </button>
      </div>
    );
  }

  /* ── DONE ── */
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '40px 28px', textAlign: 'center',
      background: 'linear-gradient(160deg,#0a0f1e 0%,#0a7ea4 50%,#EC4899 100%)',
      fontFamily: FONT,
    }}>
      <div style={{
        width: 88, height: 88, borderRadius: '50%', marginBottom: 24,
        background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 40,
      }}>✅</div>
      <h2 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 800, color: 'white' }}>Passcode Set!</h2>
      <p style={{ margin: '0 0 32px', fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
        Your messages are now secured. You can start chatting privately.
      </p>
      <button
        onClick={() => { setStep('welcome'); setCode(''); setConfirm(''); }}
        style={{
          height: 50, paddingLeft: 32, paddingRight: 32,
          borderRadius: 999, border: 'none', cursor: 'pointer',
          background: 'white', color: '#0a7ea4',
          fontFamily: FONT, fontSize: 15, fontWeight: 800,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}>
        Start Messaging 💬
      </button>
    </div>
  );
}

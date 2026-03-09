'use client';

import { useState } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingCart,
  Zap,
  TrendingUp,
  Gift,
} from 'lucide-react';

type TxFilter = 'all' | 'rewards' | 'payments';

const MOCK_TRANSACTIONS = [
  { id: 1,  type: 'reward',  label: 'Created a post',      coins: +10,  ts: '2h ago',  icon: '✍️' },
  { id: 2,  type: 'reward',  label: 'Liked a post',        coins: +1,   ts: '3h ago',  icon: '❤️' },
  { id: 3,  type: 'payment', label: 'Boosted a post',      coins: -50,  ts: '5h ago',  icon: '🚀' },
  { id: 4,  type: 'reward',  label: 'Comment reward',      coins: +5,   ts: '6h ago',  icon: '💬' },
  { id: 5,  type: 'reward',  label: 'Share reward',        coins: +3,   ts: '1d ago',  icon: '🔁' },
  { id: 6,  type: 'payment', label: 'Withdrew 200 coins',  coins: -200, ts: '2d ago',  icon: '💳' },
  { id: 7,  type: 'reward',  label: 'Login bonus',         coins: +20,  ts: '3d ago',  icon: '🎁' },
  { id: 8,  type: 'payment', label: 'Deposited 500 coins', coins: +500, ts: '4d ago',  icon: '💰' },
  { id: 9,  type: 'reward',  label: 'Liked a post',        coins: +1,   ts: '4d ago',  icon: '❤️' },
  { id: 10, type: 'reward',  label: 'Referred a friend',   coins: +50,  ts: '5d ago',  icon: '👥' },
];

const EARN_ACTIONS = [
  { icon: '✍️', label: 'Create post', coins: 10 },
  { icon: '❤️', label: 'Like a post', coins: 1  },
  { icon: '💬', label: 'Comment',     coins: 5  },
  { icon: '🔁', label: 'Share',       coins: 3  },
];

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

/* ─ Action button for inside the card ─────────────────────────────────────── */
function CardAction({
  icon,
  label,
  solid,
}: {
  icon: React.ReactNode;
  label: string;
  solid?: boolean;
}) {
  return (
    <button
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: 44,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 999,
        background: solid ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.18)',
        color: solid ? '#0a7ea4' : 'white',
        border: 'none',
        cursor: 'pointer',
        fontFamily: FONT,
        fontSize: 14,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        backdropFilter: 'blur(8px)',
        transition: 'opacity 0.15s, transform 0.12s',
        boxShadow: solid ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.88'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
      onMouseDown={e  => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'; }}
      onMouseUp={e    => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
    >
      {icon}
      {label}
    </button>
  );
}

/* ─ Page ───────────────────────────────────────────────────────────────────── */
export default function WalletPage() {
  const [filter, setFilter] = useState<TxFilter>('all');
  const balance = 450;

  const filtered = MOCK_TRANSACTIONS.filter(t =>
    filter === 'all'      ? true :
    filter === 'rewards'  ? t.type === 'reward' :
                             t.type === 'payment'
  );

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: FONT }}>

      {/* ── Sticky header ──────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'sticky', top: 0, zIndex: 10,
          padding: '14px 20px',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex', alignItems: 'center', gap: 10,
        }}
      >
        <Wallet style={{ width: 20, height: 20, color: '#0a7ea4' }} />
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>Wallet</h1>
      </div>

      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── Balance Card ────────────────────────────────────────────────── */}
        <div
          style={{
            borderRadius: 24,
            background: 'linear-gradient(135deg, #F59E0B 0%, #EC4899 60%, #E91E63 100%)',
            padding: '28px 28px 24px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(245,158,11,0.35)',
          }}
        >
          {/* Decorative blobs */}
          <div style={{ position: 'absolute', top: -32, right: -32, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.13)' }} />
          <div style={{ position: 'absolute', bottom: -24, left: -16, width: 96, height: 96, borderRadius: '50%', background: 'rgba(255,255,255,0.09)' }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1 }}>

            {/* Label row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 24 }}>🪙</span>
              <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Stub Coins
              </span>
            </div>

            {/* Balance */}
            <div style={{ fontFamily: FONT, fontSize: 56, fontWeight: 800, color: 'white', lineHeight: 1, marginBottom: 6 }}>
              {balance.toLocaleString()}
            </div>

            {/* Fiat equivalent */}
            <div style={{ fontFamily: FONT, fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 24 }}>
              ≈ RWF {(balance * 25).toLocaleString()}
            </div>

            {/* Action buttons — well spaced, large tap targets */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <CardAction solid icon={<ArrowDownLeft style={{ width: 16, height: 16 }} />} label="Deposit" />
              <CardAction       icon={<ArrowUpRight  style={{ width: 16, height: 16 }} />} label="Withdraw" />
              <CardAction       icon={<ShoppingCart  style={{ width: 16, height: 16 }} />} label="Buy Coins" />
              <CardAction       icon={<Zap           style={{ width: 16, height: 16 }} />} label="Boost Post" />
            </div>
          </div>
        </div>

        {/* ── Ways to earn ────────────────────────────────────────────────── */}
        <div
          style={{
            background: 'white',
            borderRadius: 20,
            border: '1px solid #E5E7EB',
            padding: '20px 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Gift style={{ width: 20, height: 20, color: '#F59E0B' }} />
            <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>
              Ways to earn coins
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {EARN_ACTIONS.map(({ icon, label, coins }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 16px',
                  background: '#F9FAFB',
                  borderRadius: 14,
                  border: '1px solid #F3F4F6',
                }}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
                <div>
                  <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{label}</div>
                  <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: '#F59E0B', marginTop: 2 }}>+{coins} coins</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Transaction history ──────────────────────────────────────────── */}
        <div
          style={{
            background: 'white',
            borderRadius: 20,
            border: '1px solid #E5E7EB',
            overflow: 'hidden',
          }}
        >
          {/* Section header */}
          <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp style={{ width: 20, height: 20, color: '#0a7ea4' }} />
            <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>
              Transaction history
            </span>
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 8, padding: '14px 20px' }}>
            {(['all', 'rewards', 'payments'] as TxFilter[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  height: 34,
                  paddingLeft: 18,
                  paddingRight: 18,
                  borderRadius: 999,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: FONT,
                  fontSize: 13,
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  transition: 'all 0.15s',
                  background: filter === f ? '#0a7ea4' : '#F3F4F6',
                  color:      filter === f ? 'white'   : '#6B7280',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* List */}
          {filtered.map((t, i) => (
            <div
              key={t.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 20px',
                borderTop: '1px solid #F3F4F6',
                transition: 'background 0.12s',
                cursor: 'default',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {/* Icon */}
              <div
                style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: '#F3F4F6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0,
                }}
              >
                {t.icon}
              </div>

              {/* Label + time */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {t.label}
                </div>
                <div style={{ fontFamily: FONT, fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                  {t.ts}
                </div>
              </div>

              {/* Coin amount — right-aligned, never overlaps */}
              <div
                style={{
                  flexShrink: 0,
                  fontFamily: FONT,
                  fontSize: 15,
                  fontWeight: 700,
                  color: t.coins > 0 ? '#10B981' : '#EF4444',
                  minWidth: 56,
                  textAlign: 'right',
                }}
              >
                {t.coins > 0 ? '+' : ''}{t.coins}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ padding: '48px 20px', textAlign: 'center', color: '#9CA3AF', fontFamily: FONT, fontSize: 14 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🪙</div>
              No {filter} transactions yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

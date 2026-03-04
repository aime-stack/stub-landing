'use client';

import { useState } from 'react';
import {
  Wallet, ArrowDownLeft, ArrowUpRight, ShoppingCart, Zap,
  TrendingUp, Gift, Coins, ChevronRight, Plus
} from 'lucide-react';

type TxFilter = 'all' | 'rewards' | 'payments';

const MOCK_TRANSACTIONS = [
  { id: 1, type: 'reward',  label: 'Created a post',        coins: +10, ts: '2h ago',  icon: '✍️' },
  { id: 2, type: 'reward',  label: 'Liked a post',          coins: +1,  ts: '3h ago',  icon: '❤️' },
  { id: 3, type: 'payment', label: 'Boosted a post',        coins: -50, ts: '5h ago',  icon: '🚀' },
  { id: 4, type: 'reward',  label: 'Comment reward',        coins: +5,  ts: '6h ago',  icon: '💬' },
  { id: 5, type: 'reward',  label: 'Share reward',          coins: +3,  ts: '1d ago',  icon: '🔁' },
  { id: 6, type: 'payment', label: 'Withdrew 200 coins',    coins: -200, ts: '2d ago', icon: '💳' },
  { id: 7, type: 'reward',  label: 'Login bonus',           coins: +20,  ts: '3d ago', icon: '🎁' },
  { id: 8, type: 'payment', label: 'Deposited 500 coins',   coins: +500, ts: '4d ago', icon: '💰' },
  { id: 9, type: 'reward',  label: 'Liked a post',          coins: +1,   ts: '4d ago', icon: '❤️' },
  { id: 10, type: 'reward', label: 'Referred a friend',     coins: +50,  ts: '5d ago', icon: '👥' },
];

const EARN_ACTIONS = [
  { icon: '✍️', label: 'Create post',  coins: 10 },
  { icon: '❤️', label: 'Like a post',  coins: 1 },
  { icon: '💬', label: 'Comment',      coins: 5 },
  { icon: '🔁', label: 'Share',        coins: 3 },
];

export default function WalletPage() {
  const [filter, setFilter] = useState<TxFilter>('all');
  const balance = 450;

  const filtered = MOCK_TRANSACTIONS.filter(t =>
    filter === 'all' ? true
    : filter === 'rewards'  ? t.type === 'reward'
    : t.type === 'payment'
  );

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--divider)' }}
      >
        <Wallet className="w-5 h-5" style={{ color: 'var(--primary)' }} />
        <h1 className="text-[20px] font-bold" style={{ color: 'var(--text)', fontSize: '20px' }}>Wallet</h1>
      </div>

      <div className="px-4 py-5 space-y-5">

        {/* Balance Card */}
        <div className="relative rounded-3xl p-6 overflow-hidden" style={{ background: 'var(--gradient-gold)', boxShadow: 'var(--shadow-lg)' }}>
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
          <div className="absolute bottom-0 -left-6 w-24 h-24 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl animate-pulse-coin">🪙</span>
              <span className="text-white/80 font-semibold tracking-wider uppercase text-sm">Snap Coins</span>
            </div>
            <div className="text-white text-5xl font-bold mb-1">{balance.toLocaleString()}</div>
            <div className="text-white/70 text-sm mb-5">≈ RWF {(balance * 25).toLocaleString()}</div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Deposit',   icon: <ArrowDownLeft size={15} />, bg: 'rgba(255,255,255,0.3)' },
                { label: 'Withdraw',  icon: <ArrowUpRight size={15} />,  bg: 'rgba(0,0,0,0.25)' },
                { label: 'Buy Coins', icon: <ShoppingCart size={15} />,  bg: 'rgba(255,255,255,0.2)' },
                { label: 'Boost Post', icon: <Zap size={15} />,         bg: 'rgba(0,0,0,0.2)' },
              ].map(({ label, icon, bg }) => (
                <button
                  key={label}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold text-white transition-all hover:brightness-110 active:scale-[0.97]"
                  style={{ background: bg, backdropFilter: 'blur(8px)' }}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Earn Coins Panel */}
        <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Gift className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <h2 className="text-[16px] font-bold" style={{ color: 'var(--text)', fontSize: '16px' }}>Ways to earn coins</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {EARN_ACTIONS.map(({ icon, label, coins }) => (
              <div
                key={label}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'var(--divider)' }}
              >
                <span className="text-xl">{icon}</span>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold truncate" style={{ color: 'var(--text)' }}>{label}</div>
                  <div className="text-[12px] font-bold" style={{ color: 'var(--accent)' }}>+{coins} coins</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-4 pt-4 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              <h2 className="text-[16px] font-bold" style={{ color: 'var(--text)', fontSize: '16px' }}>Transaction history</h2>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex px-4 pb-3 gap-2">
            {(['all', 'rewards', 'payments'] as TxFilter[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-4 py-1.5 rounded-full text-[13px] font-semibold capitalize transition-all duration-200"
                style={filter === f
                  ? { background: 'var(--primary)', color: 'white' }
                  : { background: 'var(--divider)', color: 'var(--text-secondary)' }
                }
              >
                {f}
              </button>
            ))}
          </div>

          {/* List */}
          {filtered.map(t => (
            <div
              key={t.id}
              className="flex items-center gap-3 px-4 py-3 transition-colors"
              style={{ borderTop: '1px solid var(--divider)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--divider)'}
              onMouseLeave={e => e.currentTarget.style.background = ''}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
                style={{ background: 'var(--divider)' }}
              >
                {t.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold truncate" style={{ color: 'var(--text)' }}>{t.label}</p>
                <p className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>{t.ts}</p>
              </div>
              <span
                className="text-[15px] font-bold shrink-0"
                style={{ color: t.coins > 0 ? 'var(--highlight)' : 'var(--error)' }}
              >
                {t.coins > 0 ? '+' : ''}{t.coins}
              </span>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-12 text-center" style={{ color: 'var(--text-secondary)' }}>
              <div className="text-4xl mb-2">🪙</div>
              <p>No {filter} transactions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

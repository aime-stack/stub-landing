'use client';

import { Megaphone, BarChart2, TrendingUp, Eye, MousePointer, Plus } from 'lucide-react';
import { useState } from 'react';

const MOCK_CAMPAIGNS = [
  { id: 'ad1', name: 'Summer Collection Launch', status: 'active', budget: 50000, spent: 23400, impressions: 128400, clicks: 3421, startDate: '2025-06-01', endDate: '2025-06-30' },
  { id: 'ad2', name: 'Fitness App Promo',         status: 'active', budget: 30000, spent: 18900, impressions: 89200, clicks: 2104, startDate: '2025-06-10', endDate: '2025-07-10' },
  { id: 'ad3', name: 'Tech Course Awareness',     status: 'paused', budget: 20000, spent: 8500,  impressions: 42100, clicks: 876,  startDate: '2025-05-15', endDate: '2025-06-15' },
];

const STATUS_COLORS: Record<string, string> = {
  active: 'var(--highlight)',
  paused: 'var(--accent)',
  ended:  'var(--text-secondary)',
};

export default function AdvertisingPage() {
  const [tab, setTab] = useState<'campaigns' | 'create'>('campaigns');

  const totalImpressions = MOCK_CAMPAIGNS.reduce((s,c) => s + c.impressions, 0);
  const totalClicks      = MOCK_CAMPAIGNS.reduce((s,c) => s + c.clicks, 0);
  const totalSpent       = MOCK_CAMPAIGNS.reduce((s,c) => s + c.spent, 0);

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#FF6B35,#EC4899)' }}>
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
        <div className="flex items-center gap-3 relative z-10">
          <Megaphone className="w-8 h-8 text-white" />
          <div>
            <h1 className="text-[20px] font-bold text-white" style={{ fontSize: '20px' }}>Advertising</h1>
            <p className="text-white/80 text-[12px]">Reach millions of Stubgram users</p>
          </div>
          <button className="ml-auto px-4 py-2 rounded-full text-[13px] font-bold text-white flex items-center gap-1.5" style={{ background: 'rgba(255,255,255,0.25)' }}>
            <Plus className="w-4 h-4" /> New Ad
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Eye, label: 'Impressions', val: totalImpressions.toLocaleString(), color: 'var(--primary)' },
            { icon: MousePointer, label: 'Clicks', val: totalClicks.toLocaleString(), color: 'var(--secondary)' },
            { icon: TrendingUp, label: 'Spent (RWF)', val: totalSpent.toLocaleString(), color: '#FF6B35' },
          ].map(({ icon: Icon, label, val, color }) => (
            <div key={label} className="rounded-2xl p-3 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <Icon className="w-5 h-5 mx-auto mb-1" style={{ color }} />
              <p className="text-[15px] font-bold" style={{ color: 'var(--text)' }}>{val}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Campaigns */}
        <h2 className="text-[16px] font-bold" style={{ color: 'var(--text)', fontSize: '16px' }}>My Campaigns</h2>
        {MOCK_CAMPAIGNS.map(c => {
          const pct = Math.round((c.spent / c.budget) * 100);
          return (
            <div key={c.id} className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-[14px]" style={{ color: 'var(--text)' }}>{c.name}</p>
                  <p className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>{c.startDate} → {c.endDate}</p>
                </div>
                <span className="px-3 py-0.5 rounded-full text-[11px] font-bold capitalize text-white" style={{ background: STATUS_COLORS[c.status] }}>
                  {c.status}
                </span>
              </div>

              {/* Budget progress */}
              <div className="mb-3">
                <div className="flex justify-between text-[12px] mb-1" style={{ color: 'var(--text-secondary)' }}>
                  <span>RWF {c.spent.toLocaleString()} spent</span>
                  <span>Budget: RWF {c.budget.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'var(--divider)' }}>
                  <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#FF6B35,#EC4899)' }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                {[
                  { label: 'Impressions', val: c.impressions.toLocaleString(), icon: Eye },
                  { label: 'Clicks', val: c.clicks.toLocaleString(), icon: MousePointer },
                ].map(({ label, val, icon: Icon }) => (
                  <div key={label} className="rounded-xl py-2" style={{ background: 'var(--divider)' }}>
                    <p className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>{val}</p>
                    <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-3">
                <button className="flex-1 py-2 rounded-xl text-[13px] font-semibold transition-all" style={{ background: 'rgba(255,107,53,0.1)', color: '#FF6B35' }}>Edit</button>
                <button className="flex-1 py-2 rounded-xl text-[13px] font-semibold transition-all" style={{ background: 'var(--divider)', color: 'var(--text-secondary)' }}>
                  {c.status === 'active' ? 'Pause' : 'Resume'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

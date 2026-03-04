'use client';

import { Crown, Check, Zap, Star, Edit3, Megaphone } from 'lucide-react';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 'RWF 0',
    period: '/month',
    icon: '🌟',
    color: '#6B7280',
    gradient: 'linear-gradient(135deg,#E5E7EB,#F3F4F6)',
    textColor: '#1A1A1A',
    features: [
      'Post text, images, and videos',
      'Follow and interact with creators',
      '10 Snap Coins/post reward',
      'Basic feed algorithm',
      'Public profile',
    ],
    missing: ['Boost posts', 'Edit/delete posts', 'Celebrity chat', 'Priority algorithm'],
    cta: 'Current Plan',
    current: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'RWF 4,900',
    period: '/month',
    icon: '⚡',
    color: '#0a7ea4',
    gradient: 'linear-gradient(135deg,#0a7ea4,#10B981)',
    textColor: 'white',
    features: [
      'Everything in Free',
      'Boost posts (use Snap Coins)',
      'Priority feed algorithm',
      'Custom profile theme badge',
      'Advanced analytics',
      '+25 bonus Snap Coins daily',
    ],
    missing: ['Edit/delete posts', 'Celebrity chat access'],
    cta: 'Upgrade to Premium',
    current: false,
  },
  {
    id: 'premium_plus',
    name: 'Premium Plus',
    price: 'RWF 9,900',
    period: '/month',
    icon: '👑',
    color: '#FFD700',
    gradient: 'linear-gradient(135deg,#F59E0B,#EC4899)',
    textColor: 'white',
    badge: 'BEST VALUE',
    features: [
      'Everything in Premium',
      'Edit & delete your own posts',
      'Celebrity chat access (VIP)',
      '+100 bonus Snap Coins daily',
      'Exclusive premium badge',
      'Priority customer support',
      'Early access to new features',
    ],
    missing: [],
    cta: 'Upgrade to Premium Plus',
    current: false,
  },
];

export default function PremiumPage() {
  return (
    <div className="min-h-screen animate-fade-in">
      {/* Header */}
      <div
        className="px-4 py-5 text-center relative overflow-hidden"
        style={{ background: 'var(--gradient-gold)', boxShadow: 'var(--shadow-md)' }}
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }} />
        <div className="relative z-10">
          <Crown className="w-12 h-12 mx-auto mb-2 text-white animate-float" />
          <h1 className="text-[24px] font-bold text-white mb-1" style={{ fontSize: '24px' }}>Premium Plans</h1>
          <p className="text-white/80 text-[14px]">Unlock the full Stubgram experience</p>
        </div>
      </div>

      <div className="px-4 py-5 space-y-4">
        {PLANS.map(plan => (
          <div
            key={plan.id}
            className="rounded-3xl overflow-hidden relative transition-all duration-200 hover:scale-[1.01]"
            style={{
              boxShadow: plan.current ? 'none' : 'var(--shadow-md)',
              border: plan.current ? '2px solid var(--border)' : 'none',
            }}
          >
            {/* Badge */}
            {plan.badge && (
              <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-[11px] font-bold" style={{ background: 'white', color: plan.color }}>
                {plan.badge}
              </div>
            )}

            {/* Card Header */}
            <div
              className="p-5"
              style={{ background: plan.gradient, color: plan.textColor }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{plan.icon}</span>
                <div>
                  <h2 className="text-[20px] font-bold" style={{ fontSize: '20px' }}>{plan.name}</h2>
                  <div className="flex items-end gap-1">
                    <span className="text-[26px] font-bold">{plan.price}</span>
                    <span className="text-[14px] opacity-80 mb-1">{plan.period}</span>
                  </div>
                </div>
              </div>

              <button
                className="w-full py-3 rounded-full font-bold text-[15px] transition-all duration-200 active:scale-[0.98]"
                style={plan.current
                  ? { background: 'rgba(255,255,255,0.2)', color: plan.textColor === 'white' ? 'white' : 'var(--text-secondary)', cursor: 'default' }
                  : { background: 'white', color: plan.color }
                }
                disabled={plan.current}
              >
                {plan.current ? '✓ Current Plan' : plan.cta}
              </button>
            </div>

            {/* Features */}
            <div className="p-5" style={{ background: plan.current ? 'var(--divider)' : 'var(--card)' }}>
              <div className="space-y-2.5">
                {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: plan.color === '#6B7280' ? 'var(--highlight)' : plan.color }} />
                    <span className="text-[13px]" style={{ color: 'var(--text)' }}>{f}</span>
                  </div>
                ))}
                {plan.missing.map(f => (
                  <div key={f} className="flex items-start gap-2 opacity-40">
                    <div className="w-4 h-4 shrink-0 mt-0.5 flex items-center justify-center text-[10px]">✕</div>
                    <span className="text-[13px] line-through" style={{ color: 'var(--text-secondary)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Feature breakdown */}
        <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h3 className="text-[16px] font-bold mb-3" style={{ color: 'var(--text)', fontSize: '16px' }}>Premium feature highlights</h3>
          <div className="space-y-3">
            {[
              { icon: <Zap className="w-4 h-4" style={{ color: 'var(--primary)' }} />, title: 'Boost Posts', desc: 'Pin your posts to top of feeds using Snap Coins' },
              { icon: <Edit3 className="w-4 h-4" style={{ color: 'var(--secondary)' }} />, title: 'Edit & Delete',  desc: 'Full control over your content after posting' },
              { icon: <Star className="w-4 h-4" style={{ color: '#FF69B4' }} />,         title: 'Celebrity Chat', desc: 'Message celebrities directly with VIP access' },
              { icon: <Megaphone className="w-4 h-4" style={{ color: 'var(--accent)' }} />, title: 'Advanced Analytics', desc: 'Detailed insights on your posts and followers' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'var(--divider)' }}>{icon}</div>
                <div>
                  <p className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>{title}</p>
                  <p className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Crown, Check, X, Zap, Star, Edit3, Megaphone, Coins } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// Pricing: $1 = 1,200 RWF (current exchange rate)
// $1 plan → RWF 1,200 | $2 plan → RWF 2,400 | $3 plan → RWF 3,600
// 1 Snap Coin ≈ 1 RWF  →  1,200 coins unlocks $1, 2,400 coins unlocks $2, 3,600 coins unlocks $3

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    priceUSD: 0,
    priceRWF: 0,
    priceDisplay: 'RWF 0',
    coinsRequired: 0,
    period: '/month',
    icon: '🌟',
    accentColor: '#6B7280',
    headerBg: 'linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 100%)',
    headerTextColor: '#1A1A1A',
    features: [
      'Post text, images, and videos',
      'Follow and interact with creators',
      '10 Snap Coins per post reward',
      'Basic feed algorithm',
      'Public profile',
    ],
    missing: ['Boost posts', 'Edit / delete posts', 'Celebrity chat', 'Priority algorithm'],
    cta: 'Current Plan',
    current: true,
  },
  {
    id: 'starter',
    name: 'Starter',
    priceUSD: 1,
    priceRWF: 1200,
    priceDisplay: 'RWF 1,200',
    coinsRequired: 1200,
    period: '/month',
    icon: '⚡',
    accentColor: '#0a7ea4',
    headerBg: 'linear-gradient(135deg, #0a7ea4 0%, #06B6D4 100%)',
    headerTextColor: '#ffffff',
    features: [
      'Everything in Free',
      'Boost posts (use Snap Coins)',
      'Priority feed algorithm',
      'Custom profile badge',
      '+25 bonus Snap Coins daily',
    ],
    missing: ['Edit / delete posts', 'Celebrity chat access'],
    cta: 'Upgrade to Starter',
    current: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    priceUSD: 2,
    priceRWF: 2400,
    priceDisplay: 'RWF 2,400',
    coinsRequired: 2400,
    period: '/month',
    icon: '🏆',
    accentColor: '#7C3AED',
    headerBg: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
    headerTextColor: '#ffffff',
    features: [
      'Everything in Starter',
      'Edit & delete your own posts',
      'Advanced analytics dashboard',
      'Custom profile theme badge',
      '+60 bonus Snap Coins daily',
    ],
    missing: ['Celebrity chat access'],
    cta: 'Upgrade to Premium',
    current: false,
  },
  {
    id: 'premium_plus',
    name: 'Premium Plus',
    priceUSD: 3,
    priceRWF: 3600,
    priceDisplay: 'RWF 3,600',
    coinsRequired: 3600,
    period: '/month',
    icon: '👑',
    accentColor: '#F59E0B',
    headerBg: 'linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)',
    headerTextColor: '#ffffff',
    badge: 'BEST VALUE',
    features: [
      'Everything in Premium',
      'Celebrity chat access (VIP)',
      '+100 bonus Snap Coins daily',
      'Exclusive premium crown badge',
      'Priority customer support',
      'Early access to new features',
    ],
    missing: [],
    cta: 'Upgrade to Premium Plus',
    current: false,
  },
];

export default function PremiumPage() {
  const [userCoins, setUserCoins] = useState<number>(0);
  const [loadingCoins, setLoadingCoins] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoadingCoins(false); return; }
      const { data } = await supabase
        .from('profiles')
        .select('snap_coins')
        .eq('id', user.id)
        .single();
      if (data) setUserCoins(data.snap_coins ?? 0);
      setLoadingCoins(false);
    })();
  }, []);

  const canUnlock = (coinsRequired: number) =>
    coinsRequired === 0 || userCoins >= coinsRequired;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg, #F9FAFB)' }}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #F59E0B 0%, #EC4899 60%, #8B5CF6 100%)',
          padding: '28px 20px 24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* decorative circles */}
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -20, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Crown style={{ width: 40, height: 40, margin: '0 auto 10px', color: 'white' }} />
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'white', margin: '0 0 6px', lineHeight: 1.2 }}>
            Premium Plans
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', margin: 0 }}>
            Unlock the full Stubgram experience
          </p>

          {/* Coin balance pill */}
          {!loadingCoins && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 14,
              padding: '6px 16px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.22)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.3)',
            }}>
              <span style={{ fontSize: 16 }}>🪙</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>
                {userCoins.toLocaleString()} Snap Coins
              </span>
            </div>
          )}
        </div>
      </div>

      {/* exchange rate note */}
      <div style={{ padding: '10px 16px 0', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: 'var(--text-secondary, #9CA3AF)', margin: 0 }}>
          1 USD ≈ 1,200 RWF · 1 Snap Coin ≈ 1 RWF
        </p>
      </div>

      {/* ── Plan Cards ─────────────────────────────────────────── */}
      <div style={{ padding: '14px 14px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {PLANS.map(plan => {
          const unlocked = canUnlock(plan.coinsRequired);

          return (
            <div
              key={plan.id}
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                boxShadow: plan.current
                  ? 'none'
                  : '0 4px 20px rgba(0,0,0,0.10)',
                border: plan.current
                  ? '2px solid var(--border, #E5E7EB)'
                  : unlocked && !plan.current
                  ? `2px solid ${plan.accentColor}`
                  : '2px solid transparent',
                position: 'relative',
                transition: 'transform 0.18s ease',
              }}
            >

              {/* Best Value badge */}
              {plan.badge && (
                <div style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  zIndex: 10,
                  padding: '4px 12px',
                  borderRadius: 999,
                  background: 'white',
                  color: plan.accentColor,
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}>
                  {plan.badge}
                </div>
              )}

              {/* Unlocked ribbon */}
              {unlocked && !plan.current && (
                <div style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  zIndex: 10,
                  padding: '3px 10px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.95)',
                  color: '#16A34A',
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}>
                  🔓 Unlocked with Coins
                </div>
              )}

              {/* ── Card Header ──────────────────────────────────── */}
              <div style={{ background: plan.headerBg, padding: '20px 16px 16px', color: plan.headerTextColor }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: unlocked && !plan.current ? 22 : 0 }}>
                  <span style={{ fontSize: 32, lineHeight: 1, flexShrink: 0 }}>{plan.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 2px', lineHeight: 1.2, wordBreak: 'break-word' }}>
                      {plan.name}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 24, fontWeight: 800, lineHeight: 1 }}>{plan.priceDisplay}</span>
                      <span style={{ fontSize: 12, opacity: 0.8, whiteSpace: 'nowrap' }}>{plan.period}</span>
                      {plan.priceUSD > 0 && (
                        <span style={{ fontSize: 11, opacity: 0.7, marginLeft: 2 }}>≈ ${plan.priceUSD} USD</span>
                      )}
                    </div>
                    {plan.coinsRequired > 0 && (
                      <div style={{ marginTop: 4, fontSize: 11, opacity: 0.85 }}>
                        🪙 {plan.coinsRequired.toLocaleString()} coins required
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA button */}
                <button
                  style={{
                    width: '100%',
                    marginTop: 14,
                    padding: '11px 0',
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: plan.current ? 'default' : 'pointer',
                    border: 'none',
                    letterSpacing: '0.01em',
                    transition: 'opacity 0.15s',
                    ...(plan.current
                      ? { background: 'rgba(255,255,255,0.2)', color: plan.headerTextColor }
                      : unlocked
                      ? { background: 'white', color: plan.accentColor }
                      : { background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', cursor: 'not-allowed' }
                    ),
                  }}
                  disabled={plan.current || (!unlocked && plan.coinsRequired > 0)}
                >
                  {plan.current
                    ? '✓ Current Plan'
                    : unlocked
                    ? plan.cta
                    : `🔒 Need ${(plan.coinsRequired - userCoins).toLocaleString()} more coins`}
                </button>
              </div>

              {/* ── Features List ─────────────────────────────────── */}
              <div style={{
                background: plan.current ? 'var(--divider, #F3F4F6)' : 'var(--card, #FFFFFF)',
                padding: '14px 16px 16px',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        flexShrink: 0,
                        marginTop: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: plan.current ? '#9CA3AF' : plan.accentColor,
                      }}>
                        <Check style={{ width: 11, height: 11, color: 'white', strokeWidth: 3 }} />
                      </div>
                      <span style={{ fontSize: 13, color: 'var(--text, #1A1A1A)', lineHeight: 1.45 }}>{f}</span>
                    </div>
                  ))}
                  {plan.missing.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, opacity: 0.38 }}>
                      <div style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        flexShrink: 0,
                        marginTop: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#D1D5DB',
                      }}>
                        <X style={{ width: 10, height: 10, color: '#6B7280', strokeWidth: 3 }} />
                      </div>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary, #6B7280)', lineHeight: 1.45, textDecoration: 'line-through' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* ── Feature Highlights ──────────────────────────────── */}
        <div style={{
          borderRadius: 16,
          padding: '16px',
          background: 'var(--card, #FFFFFF)',
          border: '1px solid var(--border, #E5E7EB)',
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 14px', color: 'var(--text, #1A1A1A)' }}>
            Premium feature highlights
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: <Zap style={{ width: 15, height: 15, color: 'var(--primary, #F59E0B)' }} />, title: 'Boost Posts', desc: 'Pin your posts to the top of feeds using Snap Coins', bg: '#FEF3C7' },
              { icon: <Edit3 style={{ width: 15, height: 15, color: '#7C3AED' }} />, title: 'Edit & Delete', desc: 'Full control over your content after posting', bg: '#EDE9FE' },
              { icon: <Star style={{ width: 15, height: 15, color: '#EC4899' }} />, title: 'Celebrity Chat', desc: 'Message celebrities directly with VIP access', bg: '#FCE7F3' },
              { icon: <Megaphone style={{ width: 15, height: 15, color: '#0a7ea4' }} />, title: 'Advanced Analytics', desc: 'Detailed insights on your posts and followers', bg: '#E0F2FE' },
            ].map(({ icon, title, desc, bg }) => (
              <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: bg,
                }}>
                  {icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text, #1A1A1A)', margin: '0 0 2px' }}>{title}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary, #6B7280)', margin: 0, lineHeight: 1.4 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* how to earn coins */}
        <div style={{
          borderRadius: 16,
          padding: '14px 16px',
          background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
          border: '1px solid #FCD34D',
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#92400E', margin: '0 0 8px' }}>
            🪙 How to earn Snap Coins
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {[
              ['📝 Create a post', '+10 coins'],
              ['💬 Comment', '+5 coins'],
              ['🔄 Share', '+3 coins'],
              ['❤️ Like', '+1 coin'],
            ].map(([action, reward]) => (
              <div key={action} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#78350F' }}>{action}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#16A34A' }}>{reward}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

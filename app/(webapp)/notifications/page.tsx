'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, Heart, UserPlus, MessageCircle, Repeat2, Settings, AtSign, Inbox } from 'lucide-react';

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

type NotifType = 'like' | 'follow' | 'comment' | 'repost' | 'reward' | 'mention';

const ALL_NOTIFICATIONS: {
  id: string; type: NotifType; user: string; avatar: string | null;
  text: string; sub: string; time: string; read: boolean;
}[] = [
  { id: 'n1', type: 'like',    user: 'Selena Martinez', avatar: '47', text: 'liked your post',           sub: '"Golden hour hits different…"',        time: '2m',  read: false },
  { id: 'n2', type: 'follow',  user: 'Jake Thornton',   avatar: '8',  text: 'started following you',     sub: '',                                       time: '15m', read: false },
  { id: 'n3', type: 'mention', user: 'Kevin Osei',      avatar: '12', text: 'mentioned you in a post',   sub: '"Hey @you — what do you think?"',        time: '32m', read: false },
  { id: 'n4', type: 'repost',  user: 'Marcus Reid',     avatar: '11', text: 'reposted your post',        sub: '',                                       time: '1h',  read: true  },
  { id: 'n5', type: 'reward',  user: 'Stubgram',        avatar: null, text: 'You earned 10 Stub Coins!', sub: 'Keep posting to earn more rewards.',      time: '2h',  read: true  },
  { id: 'n6', type: 'like',    user: 'Nadia Wright',    avatar: '23', text: 'liked your post',           sub: '"Truffle pasta…"',                        time: '3h',  read: true  },
  { id: 'n7', type: 'mention', user: 'Amara Diallo',    avatar: '45', text: 'mentioned you in a reply',  sub: '"I agree with @you on this!"',            time: '5h',  read: true  },
  { id: 'n8', type: 'reward',  user: 'Stubgram',        avatar: null, text: 'Login bonus: +20 Stub Coins!', sub: 'Claim your daily reward.',             time: '1d',  read: true  },
];

const TYPE_ICON: Record<NotifType, { icon: React.ReactNode; bg: string }> = {
  like:    { icon: <Heart    style={{ width: 14, height: 14, fill: 'white' }} />, bg: '#FF3B30' },
  follow:  { icon: <UserPlus style={{ width: 14, height: 14 }} />,                bg: '#0a7ea4' },
  comment: { icon: <MessageCircle style={{ width: 14, height: 14 }} />,           bg: '#0a7ea4' },
  repost:  { icon: <Repeat2  style={{ width: 14, height: 14 }} />,                bg: '#10B981' },
  reward:  { icon: <span style={{ fontSize: 12 }}>🪙</span>,                      bg: '#F59E0B' },
  mention: { icon: <AtSign   style={{ width: 14, height: 14 }} />,                bg: '#8b5cf6' },
};

function NotifRow({ n }: { n: typeof ALL_NOTIFICATIONS[0] }) {
  const cfg = TYPE_ICON[n.type] ?? TYPE_ICON.like;
  return (
    <div style={{
      display: 'flex', gap: 14, padding: '14px 20px',
      borderTop: '1px solid #F3F4F6',
      background: n.read ? 'transparent' : 'rgba(10,126,164,0.04)',
      cursor: 'pointer', transition: 'background 0.12s',
    }}
      onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
      onMouseLeave={e => (e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(10,126,164,0.04)')}
    >
      {/* Avatar + type badge */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        {n.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`https://i.pravatar.cc/44?img=${n.avatar}`} alt={n.user}
            style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'linear-gradient(135deg,#F59E0B,#EC4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}>🪙</div>
        )}
        {/* Type badge */}
        <div style={{
          position: 'absolute', bottom: -2, right: -2,
          width: 20, height: 20, borderRadius: '50%',
          background: cfg.bg, border: '2px solid white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white',
        }}>
          {cfg.icon}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FONT, fontSize: 14, color: '#1A1A1A', lineHeight: 1.5 }}>
          <strong>{n.user}</strong> {n.text}
        </div>
        {n.sub && <div style={{ fontFamily: FONT, fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>{n.sub}</div>}
        <div style={{ fontFamily: FONT, fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>{n.time} ago</div>
      </div>

      {/* Unread dot */}
      {!n.read && (
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0a7ea4', flexShrink: 0, marginTop: 6 }} />
      )}
    </div>
  );
}

function EmptyState({ tab }: { tab: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 32px', textAlign: 'center' }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%', marginBottom: 20,
        background: 'linear-gradient(135deg,rgba(10,126,164,0.12),rgba(236,72,153,0.10))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Inbox style={{ width: 32, height: 32, color: '#D1D5DB' }} />
      </div>
      <p style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: '#1A1A1A', margin: '0 0 8px' }}>Nothing to see here — yet</p>
      <p style={{ fontFamily: FONT, fontSize: 14, color: '#9CA3AF', margin: 0, lineHeight: 1.6, maxWidth: 280 }}>
        {tab === 'all'
          ? 'From likes to reposts and a whole lot more, this is where all the action happens.'
          : 'When someone mentions @you in a post, it will show up here.'}
      </p>
    </div>
  );
}

export default function NotificationsPage() {
  const [tab, setTab] = useState<'all' | 'mentions'>('all');

  const notifications = tab === 'all'
    ? ALL_NOTIFICATIONS
    : ALL_NOTIFICATIONS.filter(n => n.type === 'mention');

  const unread = ALL_NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: FONT }}>

      {/* ── Sticky header ─────────────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E5E7EB',
      }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Gradient bell icon */}
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg,#0a7ea4,#EC4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Bell style={{ width: 18, height: 18, color: 'white' }} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontFamily: FONT, fontSize: 18, fontWeight: 800, color: '#1A1A1A' }}>
                Notifications
              </h1>
              {unread > 0 && (
                <span style={{ fontFamily: FONT, fontSize: 11, color: '#0a7ea4', fontWeight: 600 }}>
                  {unread} unread
                </span>
              )}
            </div>
          </div>

          {/* Right side: Mark all read + Settings */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: FONT, fontSize: 12, fontWeight: 600, color: '#0a7ea4',
              padding: '4px 8px', borderRadius: 8,
              transition: 'background 0.12s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,126,164,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              Mark all read
            </button>

            <Link href="/settings" title="Notification Settings" style={{
              width: 36, height: 36, borderRadius: '50%',
              background: '#F3F4F6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#6B7280', textDecoration: 'none',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { (e.currentTarget.style.background = 'rgba(10,126,164,0.1)'); (e.currentTarget.style.color = '#0a7ea4'); }}
              onMouseLeave={e => { (e.currentTarget.style.background = '#F3F4F6'); (e.currentTarget.style.color = '#6B7280'); }}
            >
              <Settings style={{ width: 16, height: 16 }} />
            </Link>
          </div>
        </div>

        {/* All / Mentions tabs */}
        <div style={{ display: 'flex', borderTop: '1px solid #F3F4F6' }}>
          {([
            { id: 'all',      label: 'All',      badge: ALL_NOTIFICATIONS.filter(n => !n.read).length },
            { id: 'mentions', label: 'Mentions',  badge: ALL_NOTIFICATIONS.filter(n => n.type === 'mention' && !n.read).length },
          ] as const).map(({ id, label, badge }) => {
            const active = tab === id;
            return (
              <button key={id} onClick={() => setTab(id)} style={{
                flex: 1, paddingTop: 13, paddingBottom: 13,
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: FONT, fontSize: 15, fontWeight: active ? 700 : 500,
                color: active ? '#1A1A1A' : '#6B7280',
                position: 'relative', transition: 'color 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                {label}
                {badge > 0 && (
                  <span style={{
                    width: 18, height: 18, borderRadius: '50%',
                    background: active ? '#0a7ea4' : '#E5E7EB',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: FONT, fontSize: 10, fontWeight: 700,
                    color: active ? 'white' : '#6B7280',
                    transition: 'all 0.15s',
                  }}>
                    {badge}
                  </span>
                )}
                {active && (
                  <span style={{
                    position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                    width: 48, height: 3, borderRadius: 999, background: '#0a7ea4',
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div style={{ background: 'white', borderTop: '1px solid #F3F4F6' }}>
        {notifications.length === 0
          ? <EmptyState tab={tab} />
          : notifications.map(n => <NotifRow key={n.id} n={n} />)
        }
      </div>

      {/* See new posts banner (visible on All tab) */}
      {tab === 'all' && notifications.length > 0 && (
        <div style={{ padding: '12px 20px', textAlign: 'center' }}>
          <button style={{
            height: 36, paddingLeft: 20, paddingRight: 20,
            borderRadius: 999, border: '1.5px solid #E5E7EB',
            background: 'white', cursor: 'pointer',
            fontFamily: FONT, fontSize: 13, fontWeight: 600, color: '#0a7ea4',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => { (e.currentTarget.style.background = 'rgba(10,126,164,0.06)'); (e.currentTarget.style.borderColor = '#0a7ea4'); }}
            onMouseLeave={e => { (e.currentTarget.style.background = 'white'); (e.currentTarget.style.borderColor = '#E5E7EB'); }}
          >
            ↑ See new posts
          </button>
        </div>
      )}
    </div>
  );
}

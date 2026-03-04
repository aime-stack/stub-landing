'use client';

import React from 'react';
import { Bell, Heart, UserPlus, MessageCircle, Repeat2 } from 'lucide-react';

const NOTIFICATIONS = [
  { id: 'n1', type: 'like',     user: 'Selena Martinez', avatar: '47', text: 'liked your post', sub: '"Golden hour hits different..."', time: '2m',  read: false },
  { id: 'n2', type: 'follow',   user: 'Jake Thornton',   avatar: '8',  text: 'started following you', sub: '', time: '15m', read: false },
  { id: 'n3', type: 'comment',  user: 'Kevin Osei',      avatar: '12', text: 'commented on your post', sub: '"Great point about shipping early!"', time: '32m', read: false },
  { id: 'n4', type: 'repost',   user: 'Marcus Reid',     avatar: '11', text: 'reposted your post', sub: '', time: '1h',  read: true },
  { id: 'n5', type: 'reward',   user: 'Stubgram',         avatar: null, text: 'You earned 10 Snap Coins for posting!', sub: '', time: '2h',  read: true },
  { id: 'n6', type: 'like',     user: 'Nadia Wright',    avatar: '23', text: 'liked your post', sub: '"Truffle pasta..."', time: '3h',  read: true },
  { id: 'n7', type: 'follow',   user: 'Amara Diallo',    avatar: '45', text: 'started following you', sub: '', time: '5h',  read: true },
  { id: 'n8', type: 'reward',   user: 'Stubgram',         avatar: null, text: 'Login bonus: +20 Snap Coins!', sub: '', time: '1d',  read: true },
];

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string }> = {
  like:    { icon: <Heart className="w-4 h-4 fill-current" />,      color: '#FF3B30' },
  follow:  { icon: <UserPlus className="w-4 h-4" />,                color: '#0a7ea4' },
  comment: { icon: <MessageCircle className="w-4 h-4" />,           color: '#0a7ea4' },
  repost:  { icon: <Repeat2 className="w-4 h-4" />,                 color: '#00BA7C' },
  reward:  { icon: <span className="text-[14px]">🪙</span>,         color: '#F59E0B' },
};

export default function NotificationsPage() {
  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--divider)' }}
      >
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          <h1 className="text-[20px] font-bold" style={{ color: 'var(--text)', fontSize: '20px' }}>Notifications</h1>
          {unread > 0 && (
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ background: 'var(--error)' }}>
              {unread}
            </span>
          )}
        </div>
        <button className="text-[13px] font-semibold" style={{ color: 'var(--primary)' }}>Mark all read</button>
      </div>

      <div className="divide-y" style={{ borderColor: 'var(--divider)' }}>
        {NOTIFICATIONS.map(n => {
          const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.like;
          return (
            <div
              key={n.id}
              className="flex gap-3 px-4 py-3.5 cursor-pointer transition-colors"
              style={{ background: n.read ? '' : 'rgba(10,126,164,0.04)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--divider)'}
              onMouseLeave={e => e.currentTarget.style.background = n.read ? '' : 'rgba(10,126,164,0.04)'}
            >
              {/* Icon bubble */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative"
                style={{ background: `${cfg.color}18` }}
              >
                <span style={{ color: cfg.color }}>{cfg.icon}</span>

                {/* User avatar overlay */}
                {n.avatar && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full overflow-hidden border-2 border-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://i.pravatar.cc/20?img=${n.avatar}`} alt={n.user} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-[14px] leading-snug" style={{ color: 'var(--text)' }}>
                  <span className="font-bold">{n.user}</span> {n.text}
                </p>
                {n.sub && (
                  <p className="text-[12px] mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>{n.sub}</p>
                )}
                <p className="text-[12px] mt-1" style={{ color: 'var(--text-secondary)' }}>{n.time}</p>
              </div>

              {/* Unread dot */}
              {!n.read && (
                <div className="w-2 h-2 rounded-full shrink-0 mt-2" style={{ background: 'var(--primary)' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import {
  User, Lock, Shield, Bell, Moon, Bookmark, Eye, HelpCircle,
  Flag, Info, ChevronRight, LogOut, Crown, Pencil,
} from 'lucide-react';
import { logoutAction } from '@/services/auth';

type Section = 'main' | 'editProfile' | 'privacy' | 'security' | 'notifications';

const SETTING_GROUPS = [
  {
    title: 'Account',
    items: [
      { icon: Pencil,   label: 'Edit Profile',       color: '#0a7ea4', section: 'editProfile' as Section },
      { icon: Lock,     label: 'Privacy Settings',   color: '#EC4899', section: 'privacy' as Section },
      { icon: Shield,   label: 'Security Settings',  color: '#10B981', section: 'security' as Section },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Bell, label: 'Notifications', color: '#F59E0B', section: null, toggle: true },
      { icon: Moon, label: 'Dark Mode',     color: '#8b5cf6', section: null, toggle: true },
    ],
  },
  {
    title: 'Content',
    items: [
      { icon: Bookmark, label: 'Saved Posts',    color: '#0a7ea4', section: null },
      { icon: Eye,      label: 'Watch History',  color: '#6B7280', section: null },
    ],
  },
  {
    title: 'Premium',
    items: [
      { icon: Crown, label: 'Premium Plans', color: '#FFD700', section: null, href: '/premium' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help Center',          color: '#10B981', section: null },
      { icon: Flag,       label: 'Report a Problem',     color: '#EF4444', section: null },
      { icon: Info,       label: 'About',                color: '#6B7280', section: null },
    ],
  },
];

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode,       setDarkMode]       = useState(false);

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 py-3"
        style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--divider)' }}
      >
        <h1 className="text-[20px] font-bold" style={{ color: 'var(--text)', fontSize: '20px' }}>Settings</h1>
      </div>

      <div className="px-4 py-4">
        {/* User Card */}
        <div
          className="flex items-center gap-4 p-4 rounded-2xl mb-5"
          style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-md)' }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0" style={{ background: 'rgba(255,255,255,0.25)' }}>
            Y
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-[16px]">You</p>
            <p className="text-white/70 text-[13px]">@me · Free Plan</p>
          </div>
          <a href="/premium" className="shrink-0 px-3 py-1.5 rounded-full text-[12px] font-bold" style={{ background: 'rgba(255,255,255,0.25)', color: 'white' }}>
            Upgrade ↗
          </a>
        </div>

        {/* Settings Groups */}
        <div className="space-y-4">
          {SETTING_GROUPS.map(group => (
            <div key={group.title} className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p className="px-4 pt-3 pb-1 text-[12px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{group.title}</p>
              {group.items.map((item, idx) => {
                const isToggle = (item as any).toggle;
                const togVal = item.label === 'Notifications' ? notifications : darkMode;
                const setTog = item.label === 'Notifications' ? setNotifications : setDarkMode;

                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
                    style={{ borderTop: idx > 0 ? '1px solid var(--divider)' : 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--divider)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                    onClick={() => isToggle && setTog((v: boolean) => !v)}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: `${item.color}18` }}>
                      <item.icon className="w-4 h-4" style={{ color: item.color }} />
                    </div>
                    <span className="flex-1 text-[15px] font-medium" style={{ color: 'var(--text)' }}>{item.label}</span>
                    {isToggle ? (
                      <div
                        className="w-11 h-6 rounded-full relative transition-colors duration-300 shrink-0"
                        style={{ background: togVal ? 'var(--primary)' : 'var(--border)' }}
                      >
                        <div
                          className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300"
                          style={{ left: togVal ? '24px' : '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
                        />
                      </div>
                    ) : (
                      <ChevronRight className="w-4 h-4 shrink-0" style={{ color: 'var(--text-secondary)' }} />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Privacy / Terms */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-5 px-1 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Cookie Policy</a>
          <span className="w-full mt-1">App version 1.0.0</span>
        </div>

        {/* Logout */}
        <form action={logoutAction} className="mt-5">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-[15px] transition-all active:scale-[0.98]"
            style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--error)', border: '1.5px solid rgba(239,68,68,0.2)' }}
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}

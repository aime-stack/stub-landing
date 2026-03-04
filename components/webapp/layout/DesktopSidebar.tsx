'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Search, Bell, User, Settings, MessageCircle, Bookmark,
  PenLine, Wallet, Crown, Star, Video, Users, Megaphone,
  GraduationCap, ShoppingBag, Headphones, LogOut,
} from 'lucide-react';
import { logoutAction } from '@/services/auth';

const PRIMARY_NAV = [
  { name: 'Home',          href: '/feed',          icon: Home },
  { name: 'Explore',       href: '/explore',       icon: Search },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Messages',      href: '/messages',      icon: MessageCircle },
  { name: 'Bookmarks',     href: '/bookmarks',     icon: Bookmark },
  { name: 'Wallet',        href: '/wallet',         icon: Wallet },
  { name: 'Profile',       href: '/profile',       icon: User },
];

const DRAWER_NAV = [
  { name: 'Premium Plans',  href: '/premium',       icon: Crown,         color: '#F59E0B' },
  { name: 'Celebrity Chat', href: '/celebrity',     icon: Star,          color: '#FF69B4' },
  { name: 'Meetings',       href: '/meetings',      icon: Video,         color: '#4CAF50' },
  { name: 'Communities',    href: '/communities',   icon: Users,         color: '#2196F3' },
  { name: 'Advertising',    href: '/advertising',   icon: Megaphone,     color: '#FF6B35' },
  { name: 'Courses',        href: '/courses',       icon: GraduationCap, color: '#0a7ea4' },
  { name: 'Marketplace',    href: '/marketplace',   icon: ShoppingBag,   color: '#E91E63' },
  { name: 'Settings',       href: '/settings',      icon: Settings,      color: '#6B7280' },
  { name: 'Support',        href: '/support',       icon: Headphones,    color: '#10B981' },
];

export function DesktopSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'You';
  const initial  = username[0]?.toUpperCase() || 'U';

  return (
    <div
      className="flex flex-col h-full py-3 pr-4 overflow-y-auto no-scrollbar"
      style={{ background: '#FFFFFF' }}
    >
      {/* ── Logo ─────────────────────────────────────────────────────────────── */}
      <Link
        href="/feed"
        className="flex items-center gap-3 px-3 mb-5 w-fit"
        style={{ color: '#1A1A1A', textDecoration: 'none' }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform hover:scale-110"
          style={{ background: 'linear-gradient(135deg, #0a7ea4, #EC4899)', flexShrink: 0 }}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
            <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.25" />
            <text x="6.5" y="16.5" fontSize="10" fontWeight="bold" fill="white">S</text>
          </svg>
        </div>
        <span className="hidden xl:block font-bold" style={{ fontSize: 22, color: '#1A1A1A', letterSpacing: '-0.5px' }}>
          Stubgram
        </span>
      </Link>

      {/* ── Primary Nav ─────────────────────────────────────────────────────── */}
      <nav className="flex flex-col gap-0.5">
        {PRIMARY_NAV.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/feed' && pathname.startsWith(href + '/'));
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 px-3 py-[10px] rounded-full transition-all duration-150 w-fit xl:w-full"
              style={{
                color: isActive ? '#0a7ea4' : '#1A1A1A',
                background: isActive ? 'rgba(10,126,164,0.08)' : 'transparent',
                textDecoration: 'none',
                fontWeight: isActive ? 700 : 400,
                fontSize: 18,
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#F3F4F6'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon
                className="shrink-0"
                style={{
                  width: 24,
                  height: 24,
                  strokeWidth: isActive ? 2.4 : 1.8,
                  color: isActive ? '#0a7ea4' : '#1A1A1A',
                  flexShrink: 0,
                }}
              />
              <span className="hidden xl:block" style={{ fontSize: 18, lineHeight: 1 }}>
                {name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ── Divider ─────────────────────────────────────────────────────────── */}
      <div className="hidden xl:block my-3" style={{ borderTop: '1px solid #F3F4F6' }} />

      {/* ── Drawer Nav (secondary) ───────────────────────────────────────────── */}
      <nav className="hidden xl:flex flex-col gap-0.5">
        {DRAWER_NAV.map(({ name, href, icon: Icon, color }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-full w-full transition-all duration-150"
              style={{
                color: isActive ? '#0a7ea4' : '#6B7280',
                background: isActive ? 'rgba(10,126,164,0.06)' : 'transparent',
                textDecoration: 'none',
                fontSize: 15,
                fontWeight: isActive ? 600 : 400,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#F3F4F6';
                e.currentTarget.style.color = '#1A1A1A';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = isActive ? 'rgba(10,126,164,0.06)' : 'transparent';
                e.currentTarget.style.color = isActive ? '#0a7ea4' : '#6B7280';
              }}
            >
              <Icon
                className="shrink-0"
                style={{ width: 17, height: 17, color, strokeWidth: 2, flexShrink: 0 }}
              />
              <span style={{ fontSize: 15, lineHeight: 1 }}>{name}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Post Button ─────────────────────────────────────────────────────── */}
      <div className="mt-5 px-0">
        <Link
          href="/post/new"
          className="w-12 xl:w-full flex items-center justify-center xl:justify-start gap-2.5 rounded-full transition-all duration-200 active:scale-[0.98] hover:brightness-110 xl:px-7"
          style={{
            background: 'linear-gradient(135deg, #0a7ea4, #EC4899)',
            color: 'white',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: 16,
            height: 48,
            boxShadow: '0 2px 8px rgba(10,126,164,0.35)',
          }}
        >
          {/* collapsed: just icon */}
          <PenLine
            className="xl:hidden shrink-0"
            style={{ width: 20, height: 20, color: 'white', strokeWidth: 2.5 }}
          />

          {/* expanded (xl): icon + label */}
          <span
            className="hidden xl:flex items-center justify-center gap-2 w-full"
            style={{ color: 'white', fontSize: 16, fontWeight: 700 }}
          >
            <PenLine style={{ width: 18, height: 18, color: 'white', strokeWidth: 2.5, flexShrink: 0 }} />
            Post
          </span>
        </Link>
      </div>

      {/* ── User card ───────────────────────────────────────────────────────── */}
      <div className="mt-auto pt-4" style={{ borderTop: '1px solid #F3F4F6' }}>
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-full cursor-pointer transition-colors"
          onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #0a7ea4, #EC4899)', color: 'white', flexShrink: 0 }}
          >
            {initial}
          </div>
          <div className="hidden xl:flex flex-col min-w-0 flex-1">
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.3 }} className="truncate">
              {username}
            </span>
            <span style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.3 }} className="truncate">
              @{username}
            </span>
          </div>
          <form action={logoutAction} className="hidden xl:block ml-auto shrink-0">
            <button
              type="submit"
              title="Log out"
              className="flex items-center justify-center w-7 h-7 rounded-full transition-colors"
              style={{ color: '#6B7280' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#EF4444'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B7280'; }}
            >
              <LogOut style={{ width: 14, height: 14 }} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Search, Bell, User, Settings, MessageCircle, Bookmark,
  PenLine, Wallet, Crown, Star, Video, Users, Megaphone,
  GraduationCap, ShoppingBag, Headphones, Zap,
  LogOut,
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
  { name: 'Premium Plans',       href: '/premium',       icon: Crown,       color: '#FFD700' },
  { name: 'Celebrity Chat',      href: '/celebrity',     icon: Star,        color: '#FF69B4' },
  { name: 'Meetings',            href: '/meetings',      icon: Video,       color: '#4CAF50' },
  { name: 'Communities',         href: '/communities',   icon: Users,       color: '#2196F3' },
  { name: 'Advertising',         href: '/advertising',   icon: Megaphone,   color: '#FF6B35' },
  { name: 'Courses',             href: '/courses',       icon: GraduationCap, color: '#0a7ea4' },
  { name: 'Marketplace',         href: '/marketplace',   icon: ShoppingBag, color: '#E91E63' },
  { name: 'Settings',            href: '/settings',      icon: Settings,    color: '#6B7280' },
  { name: 'Support',             href: '/support',       icon: Headphones,  color: '#10B981' },
];

export function DesktopSidebar({ user }: { user: any }) {
  const pathname = usePathname();

  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'You';
  const initial  = username[0]?.toUpperCase() || 'U';

  return (
    <div
      className="flex flex-col h-full py-3 pr-4 overflow-y-auto no-scrollbar"
      style={{ background: 'var(--background)' }}
    >
      {/* Logo */}
      <Link href="/feed" className="flex items-center justify-start px-3 mb-4 w-fit group">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110"
          style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-sm)' }}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
            <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.25" />
            <text x="6.5" y="16" fontSize="10" fontWeight="bold" fill="white">S</text>
          </svg>
        </div>
        <span
          className="hidden xl:block ml-3 text-[22px] font-bold tracking-tight"
          style={{ color: 'var(--text)', letterSpacing: '-0.5px' }}
        >
          Stubgram
        </span>
      </Link>

      {/* Primary Nav */}
      <nav className="flex flex-col gap-0.5">
        {PRIMARY_NAV.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/feed' && pathname.startsWith(item.href + '/'));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 px-3 py-[11px] rounded-full w-fit xl:w-full transition-all duration-150 group"
              style={
                isActive
                  ? { background: 'rgba(10,126,164,0.1)', color: 'var(--primary)' }
                  : { color: 'var(--text)' }
              }
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--divider)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = ''; }}
            >
              <item.icon
                className="shrink-0"
                style={{
                  width: 26, height: 26,
                  strokeWidth: isActive ? 2.5 : 1.8,
                  color: isActive ? 'var(--primary)' : 'inherit',
                }}
              />
              <span
                className="hidden xl:block text-[18px] tracking-tight leading-none"
                style={{ fontWeight: isActive ? 700 : 400, color: isActive ? 'var(--primary)' : 'var(--text)' }}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="my-3 hidden xl:block" style={{ borderTop: '1px solid var(--divider)' }} />

      {/* Drawer nav (drawer items as secondary links) */}
      <nav className="hidden xl:flex flex-col gap-0.5">
        {DRAWER_NAV.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-full w-full transition-all duration-150"
              style={isActive ? { background: 'rgba(10,126,164,0.08)', color: 'var(--primary)' } : { color: 'var(--text-secondary)' }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--divider)'; e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
            >
              <item.icon className="shrink-0" style={{ width: 18, height: 18, color: item.color, strokeWidth: 2 }} />
              <span className="text-[15px] tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Post Button */}
      <Link
        href="/post/new"
        className="mt-4 flex items-center justify-center xl:justify-start gap-2 h-12 xl:w-full w-12 rounded-full text-white font-bold text-[16px] transition-all duration-200 xl:px-8 hover:brightness-110 active:scale-[0.98]"
        style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-sm)' }}
      >
        <PenLine className="w-5 h-5 shrink-0 xl:hidden" strokeWidth={2.5} />
        <Zap className="hidden xl:block w-4 h-4 shrink-0 fill-white" strokeWidth={0} />
        <span className="hidden xl:block">Post</span>
      </Link>

      {/* User card */}
      <div
        className="mt-auto pt-4 flex items-center gap-3 px-3 py-3 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        style={{ borderTop: '1px solid var(--divider)', marginTop: 'auto' }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white"
          style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-sm)' }}
        >
          {initial}
        </div>
        <div className="hidden xl:flex flex-col min-w-0 flex-1">
          <span className="text-[14px] font-bold truncate leading-tight" style={{ color: 'var(--text)' }}>
            {username}
          </span>
          <span className="text-[12px] truncate leading-tight" style={{ color: 'var(--text-secondary)' }}>
            @{username}
          </span>
        </div>
        <form action={logoutAction} className="hidden xl:block ml-auto shrink-0">
          <button
            type="submit"
            title="Log out"
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors hover:bg-red-50 hover:text-red-500"
            style={{ color: 'var(--text-secondary)' }}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

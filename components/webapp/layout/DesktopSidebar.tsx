'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Search, Bell, MessageCircle, Bookmark, Wallet,
  User, Users, ShoppingBag, GraduationCap, Clapperboard,
  Video, Megaphone, Crown, Star, Settings, HelpCircle, LogOut, PenLine,
} from 'lucide-react';
import { logoutAction } from '@/services/auth';

// ── Type ───────────────────────────────────────────────────────────────────────
interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  iconColor?: string;  // tinted icon for grouped items
}

// ── nav groups (UX-ordered) ───────────────────────────────────────────────────
const CORE_NAV: NavItem[] = [
  { name: 'Home',          href: '/feed',          icon: Home },
  { name: 'Explore',       href: '/explore',       icon: Search },
  { name: 'Reels',         href: '/reels',         icon: Clapperboard },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Messages',      href: '/messages',      icon: MessageCircle },
  { name: 'Bookmarks',     href: '/bookmarks',     icon: Bookmark },
  { name: 'Wallet',        href: '/wallet',        icon: Wallet },
  { name: 'Profile',       href: '/profile',       icon: User },
];

const DISCOVER_NAV: NavItem[] = [
  { name: 'Communities',   href: '/communities',  icon: Users,         iconColor: '#2196F3' },
  { name: 'Marketplace',   href: '/marketplace',  icon: ShoppingBag,   iconColor: '#E91E63' },
  { name: 'Courses',       href: '/courses',      icon: GraduationCap, iconColor: '#0a7ea4' },
  { name: 'Meetings',      href: '/meetings',     icon: Video,         iconColor: '#4CAF50' },
  { name: 'Advertising',   href: '/advertising',  icon: Megaphone,     iconColor: '#FF6B35' },
];

const PREMIUM_NAV: NavItem[] = [
  { name: 'Premium Plans',  href: '/premium',     icon: Crown, iconColor: '#F59E0B' },
  { name: 'Celebrity Chat', href: '/celebrity',   icon: Star,  iconColor: '#FF69B4' },
];

const SETTINGS_NAV: NavItem[] = [
  { name: 'Settings', href: '/settings', icon: Settings,    iconColor: '#6B7280' },
  { name: 'Support',  href: '/support',  icon: HelpCircle,  iconColor: '#10B981' },
];

// ────────────────────────────────────────────────────────────────────────────────
// Shared style constants — keeps every nav item 100% visually identical
// ────────────────────────────────────────────────────────────────────────────────
const FONT_FAMILY = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
const FONT_SIZE   = 17;          // px — same for ALL items
const ICON_SIZE   = 22;          // px — same for ALL items
const ITEM_PY     = 11;          // px top & bottom padding per item
const ITEM_PX     = 14;          // px left & right padding per item
const ITEM_RADIUS = 9999;        // fully rounded pill

const DIVIDER = (
  <div
    className="hidden xl:block my-2 mx-[14px]"
    style={{ borderTop: '1px solid #E5E7EB' }}
    aria-hidden
  />
);

// ────────────────────────────────────────────────────────────────────────────────
export function DesktopSidebar({ user }: { user: any }) {
  const pathname = usePathname();

  const username    = user?.user_metadata?.username ?? user?.email?.split('@')[0] ?? 'You';
  const initial     = (username[0] ?? 'U').toUpperCase();

  /** Returns true when this href is the current page */
  const isActive = (href: string) =>
    pathname === href || (href !== '/feed' && pathname.startsWith(href + '/'));

  // ── Single nav-item renderer ────────────────────────────────────────────────
  const NavLink = ({ item, tintIcon }: { item: NavItem; tintIcon?: boolean }) => {
    const active      = isActive(item.href);
    const iconColor   = active ? '#0a7ea4' : (tintIcon && item.iconColor ? item.iconColor : '#374151');
    const labelColor  = active ? '#0a7ea4' : '#1A1A1A';
    const labelWeight = active ? 700 : 500;     // 500 = medium, 700 = bold
    const bg          = active ? 'rgba(10,126,164,0.09)' : 'transparent';

    return (
      <Link
        href={item.href}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          paddingTop: ITEM_PY,
          paddingBottom: ITEM_PY,
          paddingLeft: ITEM_PX,
          paddingRight: ITEM_PX,
          borderRadius: ITEM_RADIUS,
          background: bg,
          color: labelColor,
          textDecoration: 'none',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#F3F4F6'; }}
        onMouseLeave={e => { e.currentTarget.style.background = bg; }}
      >
        {/* Icon */}
        <item.icon
          style={{
            width: ICON_SIZE,
            height: ICON_SIZE,
            flexShrink: 0,
            color: iconColor,
            strokeWidth: active ? 2.3 : 1.8,
          }}
        />

        {/* Label — hidden when sidebar is collapsed (< xl), visible on xl */}
        <span
          className="hidden xl:block truncate"
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: FONT_SIZE,
            fontWeight: labelWeight,
            color: labelColor,
            lineHeight: 1,
          }}
        >
          {item.name}
        </span>
      </Link>
    );
  };

  return (
    <nav
      className="flex flex-col h-full overflow-y-auto no-scrollbar"
      style={{
        background: '#FFFFFF',
        paddingTop: 12,
        paddingBottom: 24,
        paddingLeft: 8,
        paddingRight: 12,
      }}
    >
      {/* ── Logo ─────────────────────────────────────────────────────────────── */}
      <Link
        href="/feed"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          paddingLeft: ITEM_PX,
          paddingRight: ITEM_PX,
          paddingTop: 8,
          paddingBottom: 16,
          textDecoration: 'none',
          color: '#1A1A1A',
        }}
      >
        <div
          style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'linear-gradient(135deg, #0a7ea4, #EC4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg viewBox="0 0 24 24" width={22} height={22} fill="none">
            <text x="5.5" y="17" fontSize="12" fontWeight="900" fill="white">S</text>
          </svg>
        </div>
        <span
          className="hidden xl:block"
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 22,
            fontWeight: 800,
            color: '#1A1A1A',
            letterSpacing: '-0.5px',
          }}
        >
          Stubgram
        </span>
      </Link>

      {/* ── Core navigation ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-[3px]">
        {CORE_NAV.map(item => <NavLink key={item.href} item={item} tintIcon={false} />)}
      </div>

      {DIVIDER}

      {/* ── Discover ─────────────────────────────────────────────────────────── */}
      <div className="hidden xl:block px-[14px] mb-1.5">
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 11,
            fontWeight: 600,
            color: '#9CA3AF',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Discover
        </span>
      </div>
      <div className="flex flex-col gap-[3px]">
        {DISCOVER_NAV.map(item => <NavLink key={item.href} item={item} tintIcon />)}
      </div>

      {DIVIDER}

      {/* ── Premium & VIP ────────────────────────────────────────────────────── */}
      <div className="hidden xl:block px-[14px] mb-1.5">
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 11,
            fontWeight: 600,
            color: '#9CA3AF',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Premium
        </span>
      </div>
      <div className="flex flex-col gap-[3px]">
        {PREMIUM_NAV.map(item => <NavLink key={item.href} item={item} tintIcon />)}
      </div>

      {DIVIDER}

      {/* ── Bottom group: Settings/Support + Post + User card ──────────────────── */}
      <div className="mt-auto flex flex-col" style={{ gap: 6 }}>

        {/* Settings & Support */}
        <div className="flex flex-col gap-[3px]">
          {SETTINGS_NAV.map(item => <NavLink key={item.href} item={item} tintIcon />)}
        </div>

        {/* Post Button */}
        <div className="px-[14px]" style={{ paddingTop: 6 }}>
          <Link
            href="/post/new"
            className="w-12 xl:w-full flex items-center justify-center xl:justify-start gap-2.5 rounded-full transition-all hover:brightness-110 active:scale-[0.98]"
            style={{
              height: 50,
              background: 'linear-gradient(135deg, #0a7ea4, #EC4899)',
              color: 'white',
              textDecoration: 'none',
              fontFamily: FONT_FAMILY,
              fontSize: 16,
              fontWeight: 700,
              paddingLeft: 20,
              paddingRight: 20,
              boxShadow: '0 2px 12px rgba(10,126,164,0.3)',
            }}
          >
            <PenLine style={{ width: 19, height: 19, color: 'white', strokeWidth: 2.5, flexShrink: 0 }} />
            <span className="hidden xl:block" style={{ color: 'white', fontSize: 16, fontWeight: 700 }}>
              Post
            </span>
          </Link>
        </div>

        {/* User card */}
        <div
          className="mx-1"
          style={{ borderTop: '1px solid #E5E7EB', paddingTop: 8 }}
        >
          <div
            className="flex items-center gap-3 rounded-full cursor-pointer transition-colors"
            style={{ padding: '10px 12px' }}
            onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {/* Avatar */}
            <div
              style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #0a7ea4, #EC4899)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: 700, color: 'white',
              }}
            >
              {initial}
            </div>

            {/* Name + handle */}
            <div className="hidden xl:flex flex-col min-w-0 flex-1" style={{ gap: 1 }}>
              <span
                style={{ fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.3 }}
                className="truncate"
              >
                {username}
              </span>
              <span
                style={{ fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: 400, color: '#6B7280', lineHeight: 1.3 }}
                className="truncate"
              >
                @{username}
              </span>
            </div>

            {/* Logout */}
            <form action={logoutAction} className="hidden xl:block ml-auto shrink-0">
              <button
                type="submit"
                title="Log out"
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: '#9CA3AF', transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = '#FEE2E2';
                  (e.currentTarget as HTMLElement).style.color = '#EF4444';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#9CA3AF';
                }}
              >
                <LogOut style={{ width: 15, height: 15 }} />
              </button>
            </form>
          </div>
        </div>

      </div>
    </nav>
  );
}

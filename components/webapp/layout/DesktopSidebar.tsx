'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Bell, User, Settings, MessageCircle, Bookmark, PenLine } from 'lucide-react';
import { logoutAction } from '@/services/auth';

const NAV_ITEMS = [
  { name: 'Home',          href: '/feed',          icon: Home },
  { name: 'Explore',       href: '/explore',       icon: Search },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Messages',      href: '/messages',      icon: MessageCircle },
  { name: 'Bookmarks',     href: '/bookmarks',     icon: Bookmark },
  { name: 'Profile',       href: '/profile',       icon: User },
  { name: 'Settings',      href: '/settings',      icon: Settings },
];

export function DesktopSidebar({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full py-3 pr-4">
      {/* Logo */}
      <Link href="/feed" className="flex items-center justify-start px-3 mb-2 w-fit">
        <div className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#0a7ea4]/10 transition-colors">
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop stopColor="#0a7ea4" offset="0%" />
                <stop stopColor="#8b5cf6" offset="50%" />
                <stop stopColor="#ec4899" offset="100%" />
              </linearGradient>
            </defs>
            <circle cx="12" cy="12" r="10" fill="url(#logoGrad)" />
            <text x="6" y="16" fontSize="11" fontWeight="bold" fill="white">S</text>
          </svg>
        </div>
      </Link>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col gap-0.5 mt-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-3 py-3 rounded-full w-fit xl:w-full transition-all duration-150 group ${
                isActive ? 'text-gray-900 font-bold' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon
                className={`w-[26px] h-[26px] shrink-0 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`}
              />
              <span className="hidden xl:block text-[19px] tracking-tight leading-none">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Post Button */}
      <Link
        href="/post/new"
        className="mt-4 flex items-center justify-center xl:justify-start gap-2 h-12 xl:w-full w-12 rounded-full bg-gradient-to-r from-[#0a7ea4] to-[#8b5cf6] text-white font-bold text-[17px] hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-sm xl:px-8"
      >
        <PenLine className="w-5 h-5 shrink-0 xl:hidden" />
        <span className="hidden xl:block">Post</span>
      </Link>

      {/* User card at bottom */}
      <div className="mt-4 flex items-center gap-3 px-3 py-3 rounded-full hover:bg-gray-100 transition-colors cursor-pointer group">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0a7ea4]/30 via-[#8b5cf6]/30 to-[#ec4899]/30 border border-gray-200 flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-[#0a7ea4]">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </span>
        </div>
        <div className="hidden xl:flex flex-col min-w-0">
          <span className="text-[15px] font-bold text-gray-900 truncate leading-tight">
            {user?.user_metadata?.username || user?.email?.split('@')[0] || 'You'}
          </span>
          <span className="text-[13px] text-gray-500 truncate leading-tight">
            @{user?.user_metadata?.username || user?.email?.split('@')[0] || 'you'}
          </span>
        </div>
        <form action={logoutAction} className="hidden xl:block ml-auto">
          <button
            type="submit"
            title="Log out"
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors px-2 py-1 rounded hover:bg-gray-200"
          >
            ···
          </button>
        </form>
      </div>
    </div>
  );
}

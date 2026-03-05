'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Bell, User, MessageCircle, Wallet, Clapperboard } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/feed',          icon: Home },
  { href: '/explore',       icon: Search },
  { href: '/reels',         icon: Clapperboard },
  { href: '/notifications', icon: Bell },
  { href: '/messages',      icon: MessageCircle },
  { href: '/wallet',         icon: Wallet },
  { href: '/profile',       icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 pt-2 pb-safe"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="flex justify-around items-center h-14">
        {NAV_ITEMS.map(({ href, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/feed' && pathname.startsWith(href + '/'));
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex justify-center items-center h-full transition-all"
              style={{ color: isActive ? 'var(--primary)' : 'var(--text-secondary)' }}
            >
              <div
                className="p-2 rounded-full transition-all duration-200"
                style={isActive ? { background: 'rgba(10,126,164,0.10)' } : {}}
              >
                <Icon className="w-[22px] h-[22px]" style={{ strokeWidth: isActive ? 2.5 : 1.8 }} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bell, User, MessageCircle } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/feed', icon: Home },
  { href: '/messages', icon: MessageCircle },
  { href: '/notifications', icon: Bell },
  { href: '/profile', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 z-50 pt-2 pb-safe">
      <div className="flex justify-around items-center h-14">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex justify-center items-center h-full transition-all group ${
                isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-900'}`} stroke="currentColor" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

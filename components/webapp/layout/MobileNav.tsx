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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#151718]/90 backdrop-blur-md border-t border-gray-800 z-50 pt-2 pb-safe">
      <div className="flex justify-around items-center h-14">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex justify-center items-center h-full transition-colors ${
                isActive ? 'text-[#0a7ea4]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <item.icon className="w-6 h-6" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

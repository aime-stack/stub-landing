'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bell, User, Settings, Image as ImageIcon, MessageCircle } from 'lucide-react';
import { logoutAction } from '@/services/auth';

const NAV_ITEMS = [
  { name: 'Home', href: '/feed', icon: Home },
  { name: 'Messages', href: '/messages', icon: MessageCircle },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function DesktopSidebar({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full py-6 px-4">
      <Link href="/feed" className="flex items-center gap-3 px-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-[#0a7ea4] flex items-center justify-center">
          <ImageIcon className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">Stubgram</span>
      </Link>

      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-colors ${
                isActive 
                  ? 'font-bold bg-gray-800 text-white' 
                  : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <item.icon className={`w-6 h-6 ${isActive ? 'text-[#0a7ea4]' : ''}`} />
              <span className="text-lg">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <form action={logoutAction}>
          <button 
            type="submit"
            className="w-full flex justify-center py-3 bg-gray-800 hover:bg-red-500/10 hover:text-red-500 text-gray-300 rounded-xl transition-colors font-medium"
          >
            Log Out
          </button>
        </form>
      </div>
    </div>
  );
}

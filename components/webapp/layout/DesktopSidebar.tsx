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
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0a7ea4] via-[#8b5cf6] to-[#ec4899] p-[1.5px] shadow-sm">
          <div className="w-full h-full rounded-xl bg-white flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-transparent bg-clip-text bg-gradient-to-tr from-[#0a7ea4] to-[#ec4899]" />
          </div>
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-gray-900">
          Stubgram
        </span>
      </Link>

      <nav className="flex-1 space-y-2 mt-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 font-bold' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon 
                className={`w-[26px] h-[26px] transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-blue-600' : 'group-hover:text-gray-900'
                }`} 
              />
              <span className="text-[17px] tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <form action={logoutAction}>
          <button 
            type="submit"
            className="w-full flex justify-center py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 font-semibold tracking-wide"
          >
            Log Out
          </button>
        </form>
      </div>
    </div>
  );
}

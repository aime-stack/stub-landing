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
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0a7ea4] via-[#8b5cf6] to-[#ec4899] p-[1.5px] shadow-lg shadow-purple-500/20">
          <div className="w-full h-full rounded-xl bg-[#151718] flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-transparent bg-clip-text bg-gradient-to-tr from-[#0a7ea4] to-[#ec4899]" />
          </div>
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
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
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-gradient-to-r from-[#8b5cf6]/10 to-[#ec4899]/10 text-white font-bold border border-[#8b5cf6]/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
                  : 'text-gray-400 hover:bg-white/[0.03] hover:text-white border border-transparent'
              }`}
            >
              <item.icon 
                className={`w-[26px] h-[26px] transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-[#ec4899]' : 'group-hover:text-[#8b5cf6]'
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
            className="w-full flex justify-center py-3.5 bg-white/[0.03] hover:bg-red-500/10 hover:text-red-400 text-gray-400 border border-white/[0.05] hover:border-red-500/30 rounded-2xl transition-all duration-200 font-semibold tracking-wide"
          >
            Log Out
          </button>
        </form>
      </div>
    </div>
  );
}

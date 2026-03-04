import { ReactNode } from 'react';
import { DesktopSidebar } from '@/components/webapp/layout/DesktopSidebar';
import { WidgetArea } from '@/components/webapp/layout/WidgetArea';
import { MobileNav } from '@/components/webapp/layout/MobileNav';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function WebAppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const rootHost = process.env.NODE_ENV === 'production' ? 'https://stubgram.com' : 'http://localhost:3000';
    redirect(`${rootHost}/login`);
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* SVG gradient defs used by PostCard verified badge */}
      <svg width="0" height="0" className="absolute">
        <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="#0a7ea4" offset="0%" />
          <stop stopColor="#8b5cf6" offset="50%" />
          <stop stopColor="#ec4899" offset="100%" />
        </linearGradient>
      </svg>

      <div className="mx-auto max-w-[1265px] flex">

        {/* Left Sidebar */}
        <div className="hidden lg:flex w-[72px] xl:w-[275px] shrink-0 sticky top-0 h-screen border-r border-gray-200">
          <DesktopSidebar user={user} />
        </div>

        {/* Center Feed */}
        <main className="flex-1 min-w-0 max-w-[600px] border-r border-gray-200 min-h-screen pb-20 lg:pb-0">
          {children}
        </main>

        {/* Right Widget Area */}
        <div className="hidden xl:block w-[350px] shrink-0 sticky top-0 h-screen overflow-y-auto no-scrollbar px-4 pt-3">
          <WidgetArea />
        </div>

      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}

import { ReactNode } from 'react';
import { DesktopSidebar } from '@/components/webapp/layout/DesktopSidebar';
import { WidgetArea } from '@/components/webapp/layout/WidgetArea';
import { MobileNav } from '@/components/webapp/layout/MobileNav';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function WebAppLayout({ children }: { children: ReactNode }) {
  // Final paranoia Server-Side Auth Guard to ensure route group isolation
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const rootHost = process.env.NODE_ENV === 'production' ? 'https://stubgram.com' : 'http://localhost:3000';
    redirect(`${rootHost}/login`);
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 selection:bg-[#0a7ea4]/30">
      <svg width="0" height="0" className="absolute">
        <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="#0a7ea4" offset="0%" />
          <stop stopColor="#8b5cf6" offset="50%" />
          <stop stopColor="#ec4899" offset="100%" />
        </linearGradient>
      </svg>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex justify-between gap-6 relative">
        {/* Left Sidebar — hidden on mobile */}
        <div className="hidden lg:block w-[260px] shrink-0 sticky top-0 h-screen overflow-y-auto no-scrollbar">
          <DesktopSidebar user={user} />
        </div>

        {/* Main Content — fluid center column */}
        <main className="flex-1 min-w-0 max-w-[598px] w-full pb-24 lg:pb-6 mx-auto">
          {children}
        </main>

        {/* Right Widget Area — hidden on lg and below */}
        <div className="hidden xl:block w-[340px] shrink-0 sticky top-0 h-screen overflow-y-auto no-scrollbar">
          <WidgetArea />
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}

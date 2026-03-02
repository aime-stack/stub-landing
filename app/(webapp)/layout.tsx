import { ReactNode } from 'react';
import { DesktopSidebar } from '@/components/webapp/layout/DesktopSidebar';
import { WidgetArea } from '@/components/webapp/layout/WidgetArea';
import { MobileNav } from '@/components/webapp/layout/MobileNav';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

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
    <div className="min-h-screen bg-[#151718] text-white selection:bg-[#0a7ea4]/30">
      <svg width="0" height="0" className="absolute">
        <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="#0a7ea4" offset="0%" />
          <stop stopColor="#8b5cf6" offset="50%" />
          <stop stopColor="#ec4899" offset="100%" />
        </linearGradient>
      </svg>
      <div className="mx-auto max-w-[1280px] flex justify-between relative px-4 sm:px-6">
        {/* Left Sidebar (Hidden on mobile) */}
        <div className="hidden lg:block w-[275px] shrink-0 sticky top-0 h-screen overflow-y-auto no-scrollbar">
          <DesktopSidebar user={user} />
        </div>
        
        {/* Main Content Area (Center) */}
        <main className="flex-1 min-w-0 max-w-[600px] w-full border-x border-gray-800 pb-20 lg:pb-0 mx-auto">
          {children}
        </main>

        {/* Right Widget Area */}
        <div className="hidden xl:block w-[350px] shrink-0 sticky top-0 h-screen overflow-y-auto no-scrollbar pl-8">
          <WidgetArea />
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}

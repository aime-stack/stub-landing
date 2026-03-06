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
    const isProduction = process.env.NODE_ENV === 'production';
    const mainHost = isProduction ? 'https://stubgram.com' : 'http://localhost:3000';
    redirect(`${mainHost}/login`);
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

      {/*
        ── Three-column layout ─────────────────────────────────────
        max-w-[1265px] centers on wide screens.
        A symmetric px-4 wrapper adds equal breathing room on both
        sides so the left edge matches the right widget gutter.
      */}
      <div className="mx-auto max-w-[1268px] px-4 flex">

        {/* Left Sidebar — sticky, full-height */}
        <div className="hidden lg:flex w-[72px] xl:w-[280px] shrink-0 sticky top-0 h-screen xl:pr-6">
          <DesktopSidebar user={user} />
        </div>

        {/* Center Feed — bordered left & right, max readable width */}
        <main
          className="flex-1 min-w-0 min-h-screen pb-20 lg:pb-0"
          style={{
            borderLeft:  '1px solid #E5E7EB',
            borderRight: '1px solid #E5E7EB',
            maxWidth: 620,
          }}
        >
          {children}
        </main>

        {/* Right Widget Area — sticky, scrollable */}
        <div className="hidden xl:block w-[360px] shrink-0 sticky top-0 h-screen overflow-y-auto no-scrollbar pl-6 pt-4">
          <WidgetArea />
        </div>

      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}

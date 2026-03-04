'use client';

import { HelpCircle, MessageCircle, Mail, ChevronRight } from 'lucide-react';

const FAQS = [
  { q: 'How do I earn Snap Coins?', a: 'You earn coins by creating posts (+10), liking posts (+1), commenting (+5), and sharing (+3). Premium users get additional daily bonuses.' },
  { q: 'How do I upgrade to Premium?', a: 'Go to Premium Plans from the sidebar or navigate to /premium. Choose your plan and complete payment via Flutterwave.' },
  { q: 'How does Celebrity Chat work?', a: 'Celebrity Chat allows you to send messages directly to verified celebrities. Each message costs Snap Coins, and the pricing is set by each celebrity.' },
  { q: 'How do I boost a post?', a: 'To boost a post, you need a Premium or Premium Plus subscription. Tap the boost button on any of your posts and use Snap Coins.' },
  { q: 'Can I edit or delete my posts?', a: 'Post editing and deletion are Premium Plus features. Upgrade your plan to access this functionality.' },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen animate-fade-in">
      <div className="sticky top-0 z-10 px-4 py-3 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--divider)' }}>
        <HelpCircle className="w-5 h-5" style={{ color: '#10B981' }} />
        <h1 className="text-[20px] font-bold" style={{ color: 'var(--text)', fontSize: '20px' }}>Help & Support</h1>
      </div>

      <div className="px-4 py-4 space-y-5">
        {/* Contact options */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: MessageCircle, label: 'Live Chat',     sub: 'Chat with support', color: '#0a7ea4', bg: 'rgba(10,126,164,0.08)' },
            { icon: Mail,          label: 'Email Us',      sub: 'support@stubgram.com', color: '#10B981', bg: 'rgba(16,185,129,0.08)' },
          ].map(({ icon: Icon, label, sub, color, bg }) => (
            <button key={label} className="p-4 rounded-2xl text-left transition-all hover:shadow-md" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ background: bg }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <p className="font-bold text-[14px]" style={{ color: 'var(--text)' }}>{label}</p>
              <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{sub}</p>
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-4 pt-4 pb-2">
            <h2 className="text-[16px] font-bold" style={{ color: 'var(--text)', fontSize: '16px' }}>Frequently Asked Questions</h2>
          </div>
          {FAQS.map((faq, i) => (
            <details key={i} className="group" style={{ borderTop: '1px solid var(--divider)' }}>
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none" style={{ color: 'var(--text)' }}>
                <span className="text-[14px] font-semibold">{faq.q}</span>
                <ChevronRight className="w-4 h-4 shrink-0 transition-transform group-open:rotate-90" style={{ color: 'var(--text-secondary)' }} />
              </summary>
              <div className="px-4 pb-4">
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
              </div>
            </details>
          ))}
        </div>

        {/* Report */}
        <button
          className="w-full py-3.5 rounded-2xl text-[14px] font-semibold transition-all"
          style={{ background: 'rgba(239,68,68,0.06)', color: 'var(--error)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          🚩 Report a Problem
        </button>
      </div>
    </div>
  );
}

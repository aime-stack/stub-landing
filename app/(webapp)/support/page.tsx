'use client';

import { useState } from 'react';
import {
  HelpCircle, MessageCircle, Mail, ChevronRight,
  X, Send, Loader2, CheckCircle, BookOpen, Crown,
  Zap, Shield, Flag, ExternalLink, AlertCircle
} from 'lucide-react';

// ─── Data ──────────────────────────────────────────────────────────────────
const FAQS = [
  {
    category: 'Coins & Rewards',
    icon: '🪙',
    items: [
      {
        q: 'How do I earn Stubgram Coins?',
        a: 'You earn coins by creating posts (+10 coins), liking posts (+1), commenting (+5), and sharing (+3). Premium users get additional daily bonuses up to 50 coins/day.',
      },
      {
        q: 'Can I withdraw my coins for real money?',
        a: 'Coins are in-platform currency used for Celebrity Chat, Course enrollment, and boosting posts. They cannot currently be withdrawn as cash but can be earned through referrals and contests.',
      },
    ],
  },
  {
    category: 'Premium & Courses',
    icon: '⭐',
    items: [
      {
        q: 'How do I upgrade to Premium?',
        a: 'Go to Premium Plans from the sidebar. Choose your plan (Basic, Premium, or Premium Plus) and complete payment via Flutterwave. Your plan activates instantly.',
      },
      {
        q: 'How do I enroll in a course?',
        a: 'Visit the Courses page, find a course you like, and tap "Enroll Now". Enrollment costs Stub Coins set by the teacher. Enrolled courses appear under "My Courses".',
      },
      {
        q: 'How do I apply to teach on Stubgram?',
        a: 'Tap the "Teach" button on the Courses page and fill in the application form. Our team reviews applications within 3–5 business days. Approved teachers can publish courses immediately.',
      },
    ],
  },
  {
    category: 'Celebrity Chat',
    icon: '👑',
    items: [
      {
        q: 'How does Celebrity Chat work?',
        a: 'Celebrity Chat lets you send direct messages to verified celebrities. Each message costs Stub Coins (set by the celebrity). You can only message celebrities who are marked Available.',
      },
      {
        q: `Why is a celebrity's Chat button disabled?`,
        a: `A celebrity marked as "Busy" is temporarily unavailable for messages. Check back later — availability updates throughout the day.`,
      },
    ],
  },
  {
    category: 'Posts & Account',
    icon: '📝',
    items: [
      {
        q: 'How do I boost a post?',
        a: 'Premium and Premium Plus subscribers can boost posts using Stub Coins. Tap the boost button on any of your posts to increase visibility in the feed.',
      },
      {
        q: 'Can I edit or delete my posts?',
        a: 'Post editing and deletion are Premium Plus features. Upgrade your plan to access this functionality from the post menu (three dots ···).',
      },
    ],
  },
];

// ─── Report Modal ───────────────────────────────────────────────────────────
function ReportModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ type: '', description: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!form.type || !form.description) { setError('Please select a type and describe the issue.'); return; }
    setLoading(true); setError(null);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-[20px] font-bold text-gray-900 mb-2">Report Received!</h2>
          <p className="text-[14px] text-gray-500 mb-6">Our team will review your report within 24 hours and take appropriate action.</p>
          <button onClick={onClose} className="w-full py-3 rounded-full bg-gradient-to-r from-[#0a7ea4] to-[#8b5cf6] text-white font-bold hover:brightness-110 transition-all">
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <div>
            <h2 className="text-[17px] font-bold text-gray-900">Report a Problem</h2>
            <p className="text-[12px] text-gray-400">Help us improve Stubgram</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 flex-1 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              <AlertCircle size={14} />{error}
            </div>
          )}
          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-2">Issue Type *</label>
            <div className="grid grid-cols-2 gap-2">
              {['Bug / Error', 'Payment Issue', 'Content Violation', 'Account Problem', 'Feature Request', 'Other'].map(t => (
                <button key={t} type="button"
                  onClick={() => setForm(f => ({ ...f, type: t }))}
                  className={`py-2.5 px-3 rounded-xl border-2 text-[12px] font-medium text-left transition-all ${
                    form.type === t
                      ? 'border-[#0a7ea4] bg-[#0a7ea4]/5 text-[#0a7ea4]'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >{t}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Describe the problem *</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Please describe the issue in as much detail as possible. Include steps to reproduce if applicable."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Contact email (optional)</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="your@email.com (for follow-up)"
              className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] transition-all"
            />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 shrink-0">
          <button
            onClick={handleSubmit} disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-red-500 to-[#8b5cf6] text-white font-bold text-[14px] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Flag size={15} />}
            {loading ? 'Submitting…' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ Section ────────────────────────────────────────────────────────────
function FaqSection({ category, icon, items }: { category: string; icon: string; items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Section header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
        <span className="text-[18px]">{icon}</span>
        <h3 className="text-[14px] font-bold text-gray-800">{category}</h3>
      </div>

      {items.map((item, i) => (
        <div key={i} className={i > 0 ? 'border-t border-gray-100' : ''}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="text-[14px] font-semibold text-gray-900 pr-4 leading-snug">{item.q}</span>
            <ChevronRight
              size={16}
              className={`shrink-0 text-gray-400 transition-transform duration-200 ${openIndex === i ? 'rotate-90' : ''}`}
            />
          </button>
          {openIndex === i && (
            <div className="px-4 pb-4 -mt-1">
              <p className="text-[13px] text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-3">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function SupportPage() {
  const [showReport, setShowReport] = useState(false);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a7ea4] to-[#8b5cf6]" />
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute bottom-0 left-6 w-20 h-20 rounded-full bg-white/10" />

        <div className="relative px-4 pt-6 pb-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-2">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-[22px] font-bold text-white mb-1">Help & Support</h1>
          <p className="text-white/80 text-[13px]">We're here to help — find answers or reach our team</p>
        </div>
      </div>

      {/* ── Sticky title bar ── */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <HelpCircle size={18} className="text-[#0a7ea4]" />
          <h2 className="text-[16px] font-bold text-gray-900">Help & Support</h2>
        </div>
      </div>

      <div className="px-4 py-4 space-y-5">

        {/* ── Contact cards ── */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              icon: MessageCircle,
              label: 'Live Chat',
              sub: 'Chat with support',
              desc: 'Instant help',
              gradient: 'from-[#0a7ea4] to-[#0ea5e9]',
              lightBg: 'bg-[#0a7ea4]/5',
              textColor: 'text-[#0a7ea4]',
            },
            {
              icon: Mail,
              label: 'Email Us',
              sub: 'support@stubgram.com',
              desc: 'Reply in 24h',
              gradient: 'from-[#8b5cf6] to-[#a78bfa]',
              lightBg: 'bg-[#8b5cf6]/5',
              textColor: 'text-[#8b5cf6]',
            },
          ].map(({ icon: Icon, label, sub, desc, gradient, lightBg, textColor }) => (
            <button
              key={label}
              className="flex flex-col p-4 rounded-2xl border border-gray-200 bg-white hover:shadow-md active:scale-[0.97] transition-all duration-200 text-left group"
            >
              <div className={`w-11 h-11 rounded-2xl ${lightBg} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                <Icon size={20} className={textColor} />
              </div>
              <p className="font-bold text-[14px] text-gray-900">{label}</p>
              <p className="text-[11px] text-gray-500 truncate">{sub}</p>
              <span className={`mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r ${gradient} text-white self-start`}>
                {desc}
              </span>
            </button>
          ))}
        </div>

        {/* ── Quick Links ── */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-[14px] font-bold text-gray-800">Quick Links</h3>
          </div>
          {[
            { icon: BookOpen,  label: 'Browse Courses',          sub: 'Explore all available courses',       href: '/courses',     color: 'text-[#0a7ea4]', bg: 'bg-[#0a7ea4]/10' },
            { icon: Crown,     label: 'Upgrade to Premium',       sub: 'Unlock exclusive features',          href: '/premium',     color: 'text-[#8b5cf6]', bg: 'bg-[#8b5cf6]/10' },
            { icon: Zap,       label: 'Boost a Post',             sub: 'Increase your post visibility',      href: '/advertising', color: 'text-amber-500',  bg: 'bg-amber-50' },
            { icon: Shield,    label: 'Privacy & Terms',          sub: 'Review our policies',                href: '#',            color: 'text-gray-500',   bg: 'bg-gray-100' },
          ].map(({ icon: Icon, label, sub, href, color, bg }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors border-t border-gray-100 first:border-t-0 group"
            >
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon size={16} className={color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-gray-900">{label}</p>
                <p className="text-[11px] text-gray-400">{sub}</p>
              </div>
              <ExternalLink size={14} className="text-gray-300 group-hover:text-[#0a7ea4] transition-colors shrink-0" />
            </a>
          ))}
        </div>

        {/* ── FAQ header ── */}
        <div className="flex items-center gap-2">
          <h2 className="text-[17px] font-bold text-gray-900">Frequently Asked Questions</h2>
          <span className="text-[11px] font-semibold bg-[#0a7ea4]/10 text-[#0a7ea4] px-2 py-0.5 rounded-full">
            {FAQS.reduce((s, f) => s + f.items.length, 0)} answers
          </span>
        </div>

        {/* ── FAQ sections ── */}
        {FAQS.map(section => (
          <FaqSection
            key={section.category}
            category={section.category}
            icon={section.icon}
            items={section.items}
          />
        ))}

        {/* ── Report Problem CTA ── */}
        <div className="rounded-2xl overflow-hidden border border-red-100 bg-red-50">
          <div className="px-5 py-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
              <Flag size={18} className="text-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-gray-900">Found a bug or issue?</p>
              <p className="text-[12px] text-gray-500">Report it and help us fix it fast</p>
            </div>
            <button
              onClick={() => setShowReport(true)}
              className="shrink-0 px-4 py-2 rounded-full bg-red-500 text-white text-[13px] font-bold hover:bg-red-600 active:scale-[0.97] transition-all flex items-center gap-1.5"
            >
              <Send size={13} />
              Report
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-[12px] text-gray-400 pb-4 space-y-1">
          <p>Stubgram Support · <a href="mailto:support@stubgram.com" className="text-[#0a7ea4] hover:underline">support@stubgram.com</a></p>
          <p>© 2026 Stubgram Inc. · <a href="#" className="hover:underline">Terms</a> · <a href="#" className="hover:underline">Privacy</a></p>
        </footer>
      </div>

      {showReport && <ReportModal onClose={() => setShowReport(false)} />}
    </div>
  );
}

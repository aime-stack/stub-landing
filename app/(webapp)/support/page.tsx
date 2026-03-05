'use client';

import { useState } from 'react';
import {
  HelpCircle, MessageCircle, Mail, ChevronRight,
  X, Send, Loader2, CheckCircle, BookOpen, Crown,
  Zap, Shield, Flag, ExternalLink, AlertCircle, LifeBuoy,
} from 'lucide-react';

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

// ─── Data ──────────────────────────────────────────────────────────────────
const FAQS = [
  {
    category: 'Coins & Rewards',
    icon: '🪙',
    color: '#D97706',
    bg: 'rgba(217,119,6,0.08)',
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
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
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
    color: '#EC4899',
    bg: 'rgba(236,72,153,0.08)',
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
    color: '#0a7ea4',
    bg: 'rgba(10,126,164,0.08)',
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

// ─── Report Modal ────────────────────────────────────────────────────────────
function ReportModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ type: '', description: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!form.type || !form.description) {
      setError('Please select a type and describe the issue.');
      return;
    }
    setLoading(true);
    setError(null);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: FONT }}>
        <div style={{ background: 'white', borderRadius: 28, padding: '52px 36px', maxWidth: 380, width: '100%', boxShadow: '0 32px 80px rgba(0,0,0,0.20)', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#10B981,#34D399)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={32} color="white" />
          </div>
          <h2 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 800, color: '#111827' }}>Report Received!</h2>
          <p style={{ margin: '0 0 28px', fontSize: 14, color: '#6B7280', lineHeight: 1.7 }}>
            Our team will review your report within <strong style={{ color: '#111827' }}>24 hours</strong> and take appropriate action.
          </p>
          <button
            onClick={onClose}
            style={{ width: '100%', height: 50, borderRadius: 999, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#0a7ea4,#8b5cf6)', color: 'white', fontFamily: FONT, fontSize: 15, fontWeight: 800, boxShadow: '0 4px 20px rgba(10,126,164,0.30)', transition: 'opacity 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  const issueTypes = ['Bug / Error', 'Payment Issue', 'Content Violation', 'Account Problem', 'Feature Request', 'Other'];

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: FONT }}
    >
      <div style={{ background: 'white', borderRadius: 28, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.20)', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ position: 'sticky', top: 0, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #F3F4F6', zIndex: 1, borderRadius: '28px 28px 0 0' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#111827' }}>Report a Problem</h2>
            <p style={{ margin: '3px 0 0', fontSize: 13, color: '#9CA3AF' }}>Help us improve Stubgram</p>
          </div>
          <button
            onClick={onClose}
            style={{ width: 36, height: 36, borderRadius: '50%', background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={17} color="#6B7280" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 14, color: '#DC2626', fontSize: 13 }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}

          {/* Issue type */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10 }}>Issue Type *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {issueTypes.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, type: t }))}
                  style={{
                    padding: '10px 12px', borderRadius: 14,
                    border: `2px solid ${form.type === t ? '#0a7ea4' : '#E5E7EB'}`,
                    background: form.type === t ? 'rgba(10,126,164,0.06)' : 'white',
                    color: form.type === t ? '#0a7ea4' : '#6B7280',
                    fontFamily: FONT, fontSize: 13, fontWeight: form.type === t ? 700 : 500,
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Describe the problem *</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Please describe the issue in as much detail as possible. Include steps to reproduce if applicable."
              rows={4}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 16, border: '1.5px solid #E5E7EB', background: '#F9FAFB', fontFamily: FONT, fontSize: 14, color: '#111827', outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.6, transition: 'all 0.2s' }}
              onFocus={e => { e.currentTarget.style.border = '1.5px solid #0a7ea4'; e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(10,126,164,0.08)'; }}
              onBlur={e => { e.currentTarget.style.border = '1.5px solid #E5E7EB'; e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Contact email (optional)</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="your@email.com (for follow-up)"
              style={{ width: '100%', height: 46, padding: '0 14px', borderRadius: 14, border: '1.5px solid #E5E7EB', background: '#F9FAFB', fontFamily: FONT, fontSize: 14, color: '#111827', outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s' }}
              onFocus={e => { e.currentTarget.style.border = '1.5px solid #0a7ea4'; e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(10,126,164,0.08)'; }}
              onBlur={e => { e.currentTarget.style.border = '1.5px solid #E5E7EB'; e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '0 24px 24px' }}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', height: 52, borderRadius: 999, border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: 'linear-gradient(135deg,#EF4444,#8b5cf6)',
              color: 'white', fontFamily: FONT, fontSize: 15, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 20px rgba(239,68,68,0.28)',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.15s',
            }}
          >
            {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Flag size={18} />}
            {loading ? 'Submitting…' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────
function FaqSection({
  category, icon, color, bg, items,
}: {
  category: string; icon: string; color: string; bg: string;
  items: { q: string; a: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div style={{ background: 'white', borderRadius: 20, border: '1px solid #E5E7EB', overflow: 'hidden', fontFamily: FONT }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', background: bg, borderBottom: '1px solid #E5E7EB' }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: color }}>{category}</h3>
      </div>

      {items.map((item, i) => (
        <div key={i} style={{ borderTop: i > 0 ? '1px solid #F3F4F6' : 'none' }}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 18px', background: 'white', border: 'none', cursor: 'pointer',
              textAlign: 'left', fontFamily: FONT, gap: 12, transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
            onMouseLeave={e => (e.currentTarget.style.background = 'white')}
          >
            <span style={{ fontSize: 14, fontWeight: 600, color: '#111827', lineHeight: 1.5, flex: 1 }}>{item.q}</span>
            <ChevronRight
              size={17}
              color="#9CA3AF"
              style={{
                flexShrink: 0,
                transform: openIndex === i ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          </button>
          {openIndex === i && (
            <div style={{ padding: '0 18px 18px', marginTop: -4 }}>
              <p style={{ margin: 0, fontSize: 13, color: '#6B7280', lineHeight: 1.75, background: '#F9FAFB', borderRadius: 14, padding: '12px 14px' }}>
                {item.a}
              </p>
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

  const contactCards = [
    {
      icon: MessageCircle,
      label: 'Live Chat',
      sub: 'Chat with support',
      badge: 'Instant help',
      iconColor: '#0a7ea4',
      iconBg: 'rgba(10,126,164,0.10)',
      badgeBg: 'linear-gradient(135deg,#0a7ea4,#0ea5e9)',
    },
    {
      icon: Mail,
      label: 'Email Us',
      sub: 'support@stubgram.com',
      badge: 'Reply in 24h',
      iconColor: '#8b5cf6',
      iconBg: 'rgba(139,92,246,0.10)',
      badgeBg: 'linear-gradient(135deg,#8b5cf6,#a78bfa)',
    },
  ];

  const quickLinks = [
    { icon: BookOpen, label: 'Browse Courses',     sub: 'Explore all available courses',   href: '/courses',     color: '#0a7ea4', bg: 'rgba(10,126,164,0.10)' },
    { icon: Crown,    label: 'Upgrade to Premium', sub: 'Unlock exclusive features',        href: '/premium',     color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)' },
    { icon: Zap,      label: 'Boost a Post',        sub: 'Increase your post visibility',   href: '/advertising', color: '#D97706', bg: 'rgba(217,119,6,0.10)'  },
    { icon: Shield,   label: 'Privacy & Terms',     sub: 'Review our policies',              href: '#',            color: '#6B7280', bg: '#F3F4F6'               },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: FONT }}>

      {/* ── Hero Header ── */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0a7ea4 0%,#8b5cf6 55%,#ec4899 100%)' }} />
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', top: 24, left: '38%', width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <div style={{ position: 'relative', padding: '36px 24px 30px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 20, background: 'rgba(255,255,255,0.20)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <LifeBuoy size={28} color="white" />
          </div>
          <h1 style={{ margin: '0 0 8px', fontSize: 28, fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>Help & Support</h1>
          <p style={{ margin: '0 0 22px', fontSize: 14, color: 'rgba(255,255,255,0.80)', lineHeight: 1.6 }}>
            We&apos;re here to help — find answers or reach our team
          </p>

          {/* Stat chips */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, background: 'rgba(255,255,255,0.20)', backdropFilter: 'blur(4px)', color: 'white', padding: '7px 16px', borderRadius: 999 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34D399', display: 'inline-block' }} />
              Support Online
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.90)', padding: '7px 16px', borderRadius: 999 }}>
              {FAQS.reduce((s, f) => s + f.items.length, 0)} FAQ answers
            </span>
          </div>
        </div>
      </div>

      {/* ── Sticky top bar ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid #E5E7EB',
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#0a7ea4,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <HelpCircle size={17} color="white" />
        </div>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#111827' }}>Help & Support</h2>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '24px 20px 48px', maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* ── Contact Cards ── */}
        <section>
          <h2 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 800, color: '#111827' }}>Contact Us</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {contactCards.map(({ icon: Icon, label, sub, badge, iconColor, iconBg, badgeBg }) => (
              <button
                key={label}
                style={{
                  background: 'white', borderRadius: 20, border: '1px solid #E5E7EB',
                  padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  gap: 10, cursor: 'pointer', textAlign: 'left', fontFamily: FONT,
                  transition: 'box-shadow 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.10)'); (e.currentTarget.style.transform = 'translateY(-3px)'); }}
                onMouseLeave={e => { (e.currentTarget.style.boxShadow = 'none'); (e.currentTarget.style.transform = 'translateY(0)'); }}
              >
                {/* Icon */}
                <div style={{ width: 48, height: 48, borderRadius: 16, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={22} color={iconColor} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 3px', fontSize: 15, fontWeight: 800, color: '#111827' }}>{label}</p>
                  <p style={{ margin: 0, fontSize: 13, color: '#6B7280', wordBreak: 'break-all' }}>{sub}</p>
                </div>
                {/* Badge */}
                <span style={{ fontSize: 11, fontWeight: 700, color: 'white', padding: '5px 12px', borderRadius: 999, background: badgeBg }}>
                  {badge}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Quick Links ── */}
        <section>
          <h2 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 800, color: '#111827' }}>Quick Links</h2>
          <div style={{ background: 'white', borderRadius: 20, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            {quickLinks.map(({ icon: Icon, label, sub, href, color, bg }, idx) => (
              <a
                key={label}
                href={href}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px 20px',
                  borderTop: idx > 0 ? '1px solid #F3F4F6' : 'none',
                  textDecoration: 'none',
                  background: 'white',
                  transition: 'background 0.15s',
                  fontFamily: FONT,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                onMouseLeave={e => (e.currentTarget.style.background = 'white')}
              >
                {/* Icon */}
                <div style={{ width: 42, height: 42, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color={color} />
                </div>
                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: '#111827' }}>{label}</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#9CA3AF' }}>{sub}</p>
                </div>
                <ExternalLink size={15} color="#D1D5DB" />
              </a>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#111827' }}>Frequently Asked Questions</h2>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#0a7ea4', background: 'rgba(10,126,164,0.10)', padding: '4px 10px', borderRadius: 999 }}>
              {FAQS.reduce((s, f) => s + f.items.length, 0)} answers
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQS.map(section => (
              <FaqSection
                key={section.category}
                category={section.category}
                icon={section.icon}
                color={section.color}
                bg={section.bg}
                items={section.items}
              />
            ))}
          </div>
        </section>

        {/* ── Report Problem CTA ── */}
        <div style={{
          background: 'white', borderRadius: 20, border: '1px solid #FECACA',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(239,68,68,0.08)',
        }}>
          {/* Top accent bar */}
          <div style={{ height: 4, background: 'linear-gradient(90deg,#EF4444,#8b5cf6)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 22px' }}>
            <div style={{ width: 50, height: 50, borderRadius: 16, background: 'rgba(239,68,68,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Flag size={22} color="#EF4444" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 3px', fontSize: 15, fontWeight: 800, color: '#111827', fontFamily: FONT }}>Found a bug or issue?</p>
              <p style={{ margin: 0, fontSize: 13, color: '#9CA3AF', fontFamily: FONT }}>Report it and help us fix it fast</p>
            </div>
            <button
              onClick={() => setShowReport(true)}
              style={{
                flexShrink: 0, height: 42, paddingLeft: 18, paddingRight: 18,
                borderRadius: 999, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg,#EF4444,#8b5cf6)',
                color: 'white', fontFamily: FONT, fontSize: 13, fontWeight: 800,
                display: 'flex', alignItems: 'center', gap: 6,
                boxShadow: '0 3px 12px rgba(239,68,68,0.28)',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <Send size={14} /> Report
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', lineHeight: 2, fontFamily: FONT }}>
          <p style={{ margin: 0 }}>
            Stubgram Support ·{' '}
            <a href="mailto:support@stubgram.com" style={{ color: '#0a7ea4', textDecoration: 'none', fontWeight: 600 }}>
              support@stubgram.com
            </a>
          </p>
          <p style={{ margin: 0 }}>
            © 2026 Stubgram Inc. ·{' '}
            <a href="#" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Terms</a>
            {' · '}
            <a href="#" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Privacy</a>
          </p>
        </footer>
      </div>

      {showReport && <ReportModal onClose={() => setShowReport(false)} />}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

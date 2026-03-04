'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight, ChevronDown,
  User, Shield, Bell, Eye, Globe, HelpCircle,
  Sliders, Users, Phone, Mail, BookOpen, Lock, AlertTriangle,
} from 'lucide-react';

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

/* ── Settings structure (no Monetization) ────────────────────────────────── */
const SETTINGS_SECTIONS = [
  {
    id: 'account',
    icon: <User style={{ width: 20, height: 20 }} />,
    iconBg: 'linear-gradient(135deg,#0a7ea4,#8b5cf6)',
    title: 'Your account',
    description: 'See information about your account, download an archive of your data, or learn about your account deactivation options.',
    items: [
      'Account information',
      'Change your password',
      'Download an archive of your data',
      'Deactivate your account',
    ],
  },
  {
    id: 'premium',
    icon: <span style={{ fontSize: 16 }}>👑</span>,
    iconBg: 'linear-gradient(135deg,#F59E0B,#EC4899)',
    title: 'Premium',
    description: 'Manage your Stubgram Premium subscription and exclusive features.',
    items: ['Stubgram Premium', 'Premium Plus', 'Creator Subscriptions'],
  },
  {
    id: 'security',
    icon: <Shield style={{ width: 20, height: 20 }} />,
    iconBg: 'linear-gradient(135deg,#10B981,#0a7ea4)',
    title: 'Security and account access',
    description: 'Manage your account\'s security and keep track of your account\'s usage.',
    items: [
      'Security',
      'Apps and sessions',
      'Connected accounts',
      'Delegate',
      'Two-factor authentication',
    ],
  },
  {
    id: 'privacy',
    icon: <Lock style={{ width: 20, height: 20 }} />,
    iconBg: 'linear-gradient(135deg,#8b5cf6,#EC4899)',
    title: 'Privacy and safety',
    description: 'Manage what information you see and share on Stubgram.',
    items: [
      'Audience, media and tagging',
      'My Stubgram activity',
      'Content you see',
      'Mute and block',
      'Direct messages',
      'Spaces',
      'Discoverability and contacts',
    ],
  },
  {
    id: 'notifications',
    icon: <Bell style={{ width: 20, height: 20 }} />,
    iconBg: 'linear-gradient(135deg,#F59E0B,#EF4444)',
    title: 'Notifications',
    description: 'Select the kinds of notifications you get about your activities, interests, and recommendations.',
    items: [
      'Filters',
      'Preferences',
      'Push notifications',
      'Email notifications',
      'SMS notifications',
    ],
  },
  {
    id: 'accessibility',
    icon: <Sliders style={{ width: 20, height: 20 }} />,
    iconBg: 'linear-gradient(135deg,#6366F1,#8b5cf6)',
    title: 'Accessibility, display, and languages',
    description: 'Manage how Stubgram content is displayed to you.',
    items: [
      'Accessibility',
      'Display',
      'Languages',
      'Data usage',
      'Keyboard shortcuts',
    ],
  },
  {
    id: 'discoverability',
    icon: <Users style={{ width: 20, height: 20 }} />,
    iconBg: 'linear-gradient(135deg,#EC4899,#F59E0B)',
    title: 'Discoverability and contacts',
    description: 'Control your discoverability settings and manage contacts you\'ve imported.',
    items: [],
    expanded: true,
    detail: [
      {
        heading: 'Discoverability',
        body: 'Decide whether people who have your email address or phone number can find and connect with you on Stubgram.',
        toggles: [
          {
            icon: <Mail style={{ width: 16, height: 16 }} />,
            label: 'Let people who have your email address find you',
            sub: 'Let people who have your email address find and connect with you on Stubgram.',
          },
          {
            icon: <Phone style={{ width: 16, height: 16 }} />,
            label: 'Let people who have your phone number find you',
            sub: 'Let people who have your phone number find and connect with you on Stubgram.',
          },
        ],
      },
      {
        heading: 'Contacts',
        body: 'Manage contacts that you have imported from your mobile devices.',
        toggles: [],
        action: 'Manage contacts',
      },
    ],
  },
  {
    id: 'resources',
    icon: <BookOpen style={{ width: 20, height: 20 }} />,
    iconBg: 'linear-gradient(135deg,#374151,#1A1A1A)',
    title: 'Additional resources',
    description: 'Check out other places for helpful information to learn more about Stubgram products and services.',
    items: ['Help Center', 'About Stubgram', 'Privacy policy', 'Terms of service', 'Cookie policy'],
  },
];

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(v => !v)}
      style={{
        flexShrink: 0, width: 44, height: 24, borderRadius: 999,
        border: 'none', cursor: 'pointer',
        background: on ? '#0a7ea4' : '#D1D5DB',
        position: 'relative', transition: 'background 0.2s',
      }}
    >
      <span style={{
        position: 'absolute', top: 2,
        left: on ? 22 : 2,
        width: 20, height: 20,
        borderRadius: '50%', background: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'left 0.2s',
      }} />
    </button>
  );
}

function SectionCard({ section }: { section: typeof SETTINGS_SECTIONS[0] }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
      {/* Header */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '16px 20px', textAlign: 'left',
          transition: 'background 0.12s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        {/* Icon */}
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: section.iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white',
        }}>
          {section.icon}
        </div>
        {/* Text */}
        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
          <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: '#1A1A1A', marginBottom: 2 }}>
            {section.title}
          </div>
          <div style={{ fontFamily: FONT, fontSize: 12, color: '#9CA3AF', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
            {section.description}
          </div>
        </div>
        {/* Chevron */}
        <div style={{ flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>
          <ChevronDown style={{ width: 18, height: 18, color: '#9CA3AF' }} />
        </div>
      </button>

      {/* Expanded body */}
      {open && (
        <div style={{ borderTop: '1px solid #F3F4F6' }}>
          {/* Regular items */}
          {section.items.map(item => (
            <Link key={item} href="#" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '13px 20px 13px 74px',
              borderTop: '1px solid #F3F4F6',
              fontFamily: FONT, fontSize: 14, color: '#374151',
              textDecoration: 'none', transition: 'background 0.12s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {item}
              <ChevronRight style={{ width: 16, height: 16, color: '#D1D5DB', flexShrink: 0 }} />
            </Link>
          ))}

          {/* Detail sections (for Discoverability) */}
          {'detail' in section && section.detail?.map((d: { heading: string; body: string; toggles: { icon: React.ReactNode; label: string; sub: string }[]; action?: string }) => (
            <div key={d.heading} style={{ padding: '16px 20px', borderTop: '1px solid #F3F4F6' }}>
              <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 6 }}>
                {d.heading}
              </div>
              <p style={{ fontFamily: FONT, fontSize: 13, color: '#9CA3AF', margin: '0 0 12px', lineHeight: 1.5 }}>{d.body}</p>
              {d.toggles.map(t => (
                <div key={t.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14, padding: '12px 16px', borderRadius: 12, background: '#F9FAFB' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(10,126,164,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#0a7ea4' }}>
                    {t.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 3 }}>{t.label}</div>
                    <div style={{ fontFamily: FONT, fontSize: 12, color: '#9CA3AF', lineHeight: 1.4 }}>{t.sub}</div>
                  </div>
                  <Toggle />
                </div>
              ))}
              {d.action && (
                <Link href="#" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontFamily: FONT, fontSize: 13, fontWeight: 600, color: '#0a7ea4',
                  textDecoration: 'none',
                }}>
                  {d.action} <ChevronRight style={{ width: 14, height: 14 }} />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: FONT }}>

      {/* ── Sticky header ───────────────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E5E7EB',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg,#0a7ea4,#EC4899)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <AlertTriangle style={{ width: 18, height: 18, color: 'white' }} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontFamily: FONT, fontSize: 18, fontWeight: 800, color: '#1A1A1A' }}>Settings</h1>
          <p style={{ margin: 0, fontFamily: FONT, fontSize: 12, color: '#9CA3AF' }}>Manage your Stubgram experience</p>
        </div>
      </div>

      {/* ── Help Center quick link ───────────────────────────────────────────── */}
      <div style={{ padding: '16px 20px 0' }}>
        <Link href="#" style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 18px', borderRadius: 16,
          background: 'linear-gradient(135deg,rgba(10,126,164,0.06),rgba(236,72,153,0.04))',
          border: '1px solid rgba(10,126,164,0.12)',
          textDecoration: 'none', marginBottom: 20,
        }}>
          <HelpCircle style={{ width: 20, height: 20, color: '#0a7ea4', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>Help Center</div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: '#9CA3AF' }}>Get support and find answers</div>
          </div>
          <ChevronRight style={{ width: 16, height: 16, color: '#D1D5DB' }} />
        </Link>
      </div>

      {/* ── Settings sections ────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 20px 40px' }}>
        {SETTINGS_SECTIONS.map(section => (
          <SectionCard key={section.id} section={section} />
        ))}
      </div>

    </div>
  );
}

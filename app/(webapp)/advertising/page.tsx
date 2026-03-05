'use client';

import { useState } from 'react';
import {
  Megaphone, Eye, MousePointer, TrendingUp, Plus, X,
  AlertCircle, Loader2, CheckCircle, Pause, Play,
  PenLine, BarChart3, Target, Wallet, Calendar,
  ChevronRight, Zap,
} from 'lucide-react';

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

// ─── Types ────────────────────────────────────────────────────────────────────
type CampaignStatus = 'active' | 'paused' | 'ended' | 'reviewing';

interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  objective: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  ctr: number;
  startDate: string;
  endDate: string;
  adType: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'ad1', name: 'Summer Collection Launch', status: 'active',
    objective: 'Brand Awareness', adType: 'Image Ad',
    budget: 50000, spent: 23400, impressions: 128400, clicks: 3421, ctr: 2.66,
    startDate: '2025-06-01', endDate: '2025-06-30',
  },
  {
    id: 'ad2', name: 'Fitness App Promo', status: 'active',
    objective: 'App Installs', adType: 'Video Ad',
    budget: 30000, spent: 18900, impressions: 89200, clicks: 2104, ctr: 2.36,
    startDate: '2025-06-10', endDate: '2025-07-10',
  },
  {
    id: 'ad3', name: 'Tech Course Awareness', status: 'paused',
    objective: 'Conversions', adType: 'Carousel Ad',
    budget: 20000, spent: 8500, impressions: 42100, clicks: 876, ctr: 2.08,
    startDate: '2025-05-15', endDate: '2025-06-15',
  },
];

const AD_OBJECTIVES = ['Brand Awareness', 'Reach', 'App Installs', 'Conversions', 'Lead Generation', 'Video Views'];
const AD_TYPES      = ['Image Ad', 'Video Ad', 'Carousel Ad', 'Story Ad', 'Sponsored Post'];

const STATUS_CONFIG: Record<CampaignStatus, { label: string; color: string; bg: string; dot: string }> = {
  active:    { label: 'Active',    color: '#059669', bg: 'rgba(5,150,105,0.10)',   dot: '#10B981' },
  paused:    { label: 'Paused',    color: '#D97706', bg: 'rgba(217,119,6,0.10)',   dot: '#F59E0B' },
  ended:     { label: 'Ended',     color: '#6B7280', bg: 'rgba(107,114,128,0.10)', dot: '#9CA3AF' },
  reviewing: { label: 'In Review', color: '#2563EB', bg: 'rgba(37,99,235,0.10)',   dot: '#60A5FA' },
};

// ─── Shared input style ───────────────────────────────────────────────────────
const IS: React.CSSProperties = {
  width: '100%', height: 46, padding: '0 14px',
  borderRadius: 14, border: '1.5px solid #E5E7EB',
  background: '#F9FAFB', fontFamily: FONT, fontSize: 14,
  color: '#111827', outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s',
};
const focusIn  = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  e.currentTarget.style.border = '1.5px solid #0a7ea4';
  e.currentTarget.style.background = 'white';
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(10,126,164,0.08)';
};
const focusOut = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  e.currentTarget.style.border = '1.5px solid #E5E7EB';
  e.currentTarget.style.background = '#F9FAFB';
  e.currentTarget.style.boxShadow = 'none';
};

// ─── New Ad Modal ─────────────────────────────────────────────────────────────
function NewAdModal({ onClose, onAdd }: { onClose: () => void; onAdd: (c: Campaign) => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({ name: '', objective: '', adType: '', headline: '', body: '', cta: '', budget: '', startDate: '', endDate: '', targetAudience: '' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const nextStep = () => {
    if (step === 1 && (!form.name || !form.objective || !form.adType)) { setError('Please fill in all fields.'); return; }
    if (step === 2 && (!form.headline || !form.body)) { setError('Headline and body copy are required.'); return; }
    setError(null);
    setStep(s => (s < 3 ? (s + 1) as 1 | 2 | 3 : s));
  };

  const handleSubmit = async () => {
    if (!form.budget || !form.startDate || !form.endDate) { setError('Budget and dates are required.'); return; }
    setLoading(true); setError(null);
    await new Promise(r => setTimeout(r, 1000));
    onAdd({ id: `ad-${Date.now()}`, name: form.name, status: 'reviewing', objective: form.objective, adType: form.adType, budget: parseInt(form.budget), spent: 0, impressions: 0, clicks: 0, ctr: 0, startDate: form.startDate, endDate: form.endDate });
    setLoading(false);
    setSuccess(true);
  };

  const steps = [{ label: 'Campaign', icon: Target }, { label: 'Creative', icon: PenLine }, { label: 'Budget', icon: Wallet }];

  if (success) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: FONT }}>
        <div style={{ background: 'white', borderRadius: 28, padding: '52px 36px', maxWidth: 380, width: '100%', boxShadow: '0 32px 80px rgba(0,0,0,0.20)', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#10B981,#34D399)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={32} color="white" />
          </div>
          <h2 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 800, color: '#111827' }}>Ad Submitted! 🎉</h2>
          <p style={{ margin: '0 0 28px', fontSize: 14, color: '#6B7280', lineHeight: 1.7 }}>
            Your ad is under <strong style={{ color: '#111827' }}>review</strong>. It&apos;ll go live within 24 hours once approved.
          </p>
          <button onClick={onClose} style={{ width: '100%', height: 50, borderRadius: 999, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#0a7ea4,#8b5cf6)', color: 'white', fontFamily: FONT, fontSize: 15, fontWeight: 800, boxShadow: '0 4px 20px rgba(10,126,164,0.30)' }}>
            View Campaigns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: FONT }}>
      <div style={{ background: 'white', borderRadius: 28, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.20)', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ position: 'sticky', top: 0, background: 'white', padding: '20px 24px', borderBottom: '1px solid #F3F4F6', zIndex: 1, borderRadius: '28px 28px 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#111827' }}>Create New Ad</h2>
              <p style={{ margin: '3px 0 0', fontSize: 13, color: '#9CA3AF' }}>Step {step} of 3</p>
            </div>
            <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: '50%', background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={17} color="#6B7280" />
            </button>
          </div>
          {/* Step pills */}
          <div style={{ display: 'flex', gap: 8 }}>
            {steps.map((s, i) => {
              const StepIcon = s.icon;
              const isActive = step === i + 1;
              const isDone   = step > i + 1;
              return (
                <div key={s.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: '100%', height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: isDone ? 'rgba(16,185,129,0.12)' : isActive ? 'rgba(10,126,164,0.10)' : '#F3F4F6', border: `2px solid ${isDone ? '#10B981' : isActive ? '#0a7ea4' : 'transparent'}`, transition: 'all 0.2s' }}>
                    {isDone ? <CheckCircle size={14} color="#10B981" /> : <StepIcon size={14} color={isActive ? '#0a7ea4' : '#9CA3AF'} />}
                    <span style={{ fontSize: 12, fontWeight: 700, color: isDone ? '#059669' : isActive ? '#0a7ea4' : '#9CA3AF' }}>{s.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 14, color: '#DC2626', fontSize: 13 }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (<>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Campaign Name *</label>
              <input value={form.name} onChange={update('name')} placeholder="e.g. Summer Sale Campaign" style={IS} onFocus={focusIn} onBlur={focusOut} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Campaign Objective *</label>
              <select value={form.objective} onChange={update('objective')} style={{ ...IS, appearance: 'none' as const }} onFocus={focusIn} onBlur={focusOut}>
                <option value="">Select objective...</option>
                {AD_OBJECTIVES.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Ad Format *</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {AD_TYPES.map(t => (
                  <button key={t} type="button" onClick={() => setForm(f => ({ ...f, adType: t }))}
                    style={{ padding: '10px 12px', borderRadius: 14, border: `2px solid ${form.adType === t ? '#0a7ea4' : '#E5E7EB'}`, background: form.adType === t ? 'rgba(10,126,164,0.06)' : 'white', color: form.adType === t ? '#0a7ea4' : '#6B7280', fontFamily: FONT, fontSize: 13, fontWeight: form.adType === t ? 700 : 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Target Audience</label>
              <input value={form.targetAudience} onChange={update('targetAudience')} placeholder="e.g. 18–35, Tech enthusiasts, Rwanda" style={IS} onFocus={focusIn} onBlur={focusOut} />
            </div>
          </>)}

          {/* Step 2 */}
          {step === 2 && (<>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Ad Headline *</label>
              <input value={form.headline} onChange={update('headline')} placeholder="Catchy headline (max 60 chars)" maxLength={60} style={IS} onFocus={focusIn} onBlur={focusOut} />
              <p style={{ textAlign: 'right', fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>{form.headline.length}/60</p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Ad Body Copy *</label>
              <textarea value={form.body} onChange={update('body')} placeholder="Describe your offer clearly and compellingly..." rows={4} maxLength={280}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 14, border: '1.5px solid #E5E7EB', background: '#F9FAFB', fontFamily: FONT, fontSize: 14, color: '#111827', outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.6, transition: 'all 0.2s' }}
                onFocus={focusIn} onBlur={focusOut} />
              <p style={{ textAlign: 'right', fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>{form.body.length}/280</p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Call to Action</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {['Learn More', 'Shop Now', 'Sign Up', 'Download', 'Get Started', 'Contact Us'].map(c => (
                  <button key={c} type="button" onClick={() => setForm(f => ({ ...f, cta: c }))}
                    style={{ padding: '9px 8px', borderRadius: 12, border: `2px solid ${form.cta === c ? '#0a7ea4' : '#E5E7EB'}`, background: form.cta === c ? 'rgba(10,126,164,0.06)' : 'white', color: form.cta === c ? '#0a7ea4' : '#6B7280', fontFamily: FONT, fontSize: 12, fontWeight: form.cta === c ? 700 : 500, cursor: 'pointer', transition: 'all 0.15s' }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            {form.headline && (
              <div style={{ background: '#F9FAFB', borderRadius: 16, padding: 16, border: '1px solid #E5E7EB' }}>
                <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Preview</p>
                <div style={{ background: 'white', borderRadius: 14, padding: 14, border: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#0a7ea4,#8b5cf6)', flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#111827' }}>Sponsored</p>
                      <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF' }}>{form.adType || 'Ad'}</p>
                    </div>
                  </div>
                  <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 800, color: '#111827' }}>{form.headline}</p>
                  <p style={{ margin: 0, fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>{form.body}</p>
                  {form.cta && <button style={{ marginTop: 10, padding: '6px 16px', borderRadius: 999, border: 'none', background: 'linear-gradient(135deg,#0a7ea4,#8b5cf6)', color: 'white', fontFamily: FONT, fontSize: 12, fontWeight: 700, cursor: 'default' }}>{form.cta}</button>}
                </div>
              </div>
            )}
          </>)}

          {/* Step 3 */}
          {step === 3 && (<>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Total Budget (RWF) *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, fontWeight: 700, color: '#6B7280', pointerEvents: 'none' }}>RWF</span>
                <input type="number" min="1000" value={form.budget} onChange={update('budget')} placeholder="e.g. 20000" style={{ ...IS, paddingLeft: 52 }} onFocus={focusIn} onBlur={focusOut} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Start Date *</label>
                <input type="date" value={form.startDate} onChange={update('startDate')} style={IS} onFocus={focusIn} onBlur={focusOut} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>End Date *</label>
                <input type="date" value={form.endDate} onChange={update('endDate')} style={IS} onFocus={focusIn} onBlur={focusOut} />
              </div>
            </div>
            {form.budget && form.startDate && form.endDate && (
              <div style={{ borderRadius: 18, background: 'linear-gradient(135deg,rgba(10,126,164,0.06),rgba(139,92,246,0.06))', border: '1px solid rgba(10,126,164,0.15)', padding: '16px 18px' }}>
                <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 800, color: '#374151' }}>Campaign Summary</p>
                {[
                  { label: 'Campaign',  val: form.name },
                  { label: 'Objective', val: form.objective },
                  { label: 'Format',    val: form.adType },
                  { label: 'Budget',    val: `RWF ${parseInt(form.budget).toLocaleString()}` },
                  { label: 'Duration',  val: `${form.startDate} → ${form.endDate}` },
                ].map(({ label, val }) => val ? (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                    <span style={{ color: '#9CA3AF' }}>{label}</span>
                    <span style={{ fontWeight: 700, color: '#111827', maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{val}</span>
                  </div>
                ) : null)}
              </div>
            )}
          </>)}
        </div>

        {/* Footer */}
        <div style={{ padding: '0 24px 24px', display: 'flex', gap: 10 }}>
          {step > 1 && (
            <button type="button" onClick={() => { setError(null); setStep(s => (s - 1) as 1 | 2 | 3); }}
              style={{ flex: 1, height: 50, borderRadius: 999, border: '2px solid #E5E7EB', background: 'white', color: '#374151', fontFamily: FONT, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
              Back
            </button>
          )}
          {step < 3 ? (
            <button type="button" onClick={nextStep}
              style={{ flex: 1, height: 50, borderRadius: 999, border: 'none', background: 'linear-gradient(135deg,#0a7ea4,#8b5cf6)', color: 'white', fontFamily: FONT, fontSize: 15, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 4px 20px rgba(10,126,164,0.28)', transition: 'opacity 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={loading}
              style={{ flex: 1, height: 50, borderRadius: 999, border: 'none', background: loading ? '#E5E7EB' : 'linear-gradient(135deg,#0a7ea4,#8b5cf6)', color: loading ? '#9CA3AF' : 'white', fontFamily: FONT, fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: loading ? 'none' : '0 4px 20px rgba(10,126,164,0.28)' }}>
              {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Zap size={18} />}
              {loading ? 'Launching…' : 'Launch Campaign'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Campaign Card ────────────────────────────────────────────────────────────
function CampaignCard({ campaign, onToggle }: { campaign: Campaign; onToggle: (id: string) => void }) {
  const pct = Math.min(100, Math.round((campaign.spent / campaign.budget) * 100));
  const cfg = STATUS_CONFIG[campaign.status];

  return (
    <div
      style={{ background: 'white', borderRadius: 20, border: '1px solid #E5E7EB', overflow: 'hidden', fontFamily: FONT, transition: 'box-shadow 0.2s, transform 0.2s' }}
      onMouseEnter={e => { (e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.09)'); (e.currentTarget.style.transform = 'translateY(-2px)'); }}
      onMouseLeave={e => { (e.currentTarget.style.boxShadow = 'none'); (e.currentTarget.style.transform = 'translateY(0)'); }}
    >
      {/* Top accent bar */}
      <div style={{ height: 4, background: campaign.status === 'active' ? 'linear-gradient(90deg,#0a7ea4,#8b5cf6)' : campaign.status === 'paused' ? 'linear-gradient(90deg,#F59E0B,#EC4899)' : '#E5E7EB' }} />

      {/* Card header */}
      <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h3 style={{ margin: '0 0 6px', fontWeight: 800, fontSize: 16, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {campaign.name}
            </h3>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', background: '#F3F4F6', padding: '3px 10px', borderRadius: 999 }}>{campaign.objective}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', background: '#F3F4F6', padding: '3px 10px', borderRadius: 999 }}>{campaign.adType}</span>
            </div>
          </div>
          {/* Status badge */}
          <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: cfg.color, background: cfg.bg, padding: '5px 12px', borderRadius: 999 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
            {cfg.label}
          </span>
        </div>
        {/* Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9CA3AF' }}>
          <Calendar size={13} color="#9CA3AF" />
          <span>{campaign.startDate} → {campaign.endDate}</span>
        </div>
      </div>

      {/* Budget progress */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 10 }}>
          <span style={{ fontWeight: 700, color: '#111827' }}>
            RWF {campaign.spent.toLocaleString()} <span style={{ fontWeight: 400, color: '#9CA3AF' }}>spent</span>
          </span>
          <span style={{ color: '#9CA3AF' }}>Budget: RWF {campaign.budget.toLocaleString()}</span>
        </div>
        {/* Progress bar */}
        <div style={{ height: 8, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden', marginBottom: 6 }}>
          <div style={{ height: '100%', borderRadius: 999, width: `${pct}%`, transition: 'width 0.5s', background: pct > 85 ? 'linear-gradient(90deg,#f97316,#ef4444)' : 'linear-gradient(90deg,#0a7ea4,#8b5cf6)' }} />
        </div>
        <p style={{ margin: 0, fontSize: 12, color: pct > 85 ? '#EF4444' : '#9CA3AF', fontWeight: 500 }}>{pct}% of budget used</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid #F3F4F6' }}>
        {[
          { Icon: Eye,          label: 'Impressions', val: campaign.impressions > 0 ? (campaign.impressions / 1000).toFixed(1) + 'K' : '—' },
          { Icon: MousePointer, label: 'Clicks',      val: campaign.clicks > 0 ? campaign.clicks.toLocaleString() : '—' },
          { Icon: BarChart3,    label: 'CTR',          val: campaign.impressions > 0 ? `${((campaign.clicks / campaign.impressions) * 100).toFixed(2)}%` : '—' },
        ].map(({ Icon, label, val }, idx) => (
          <div key={label} style={{ padding: '14px 10px', textAlign: 'center', borderRight: idx < 2 ? '1px solid #F3F4F6' : 'none' }}>
            <Icon size={15} color="#0a7ea4" style={{ display: 'block', margin: '0 auto 6px' }} />
            <p style={{ margin: '0 0 2px', fontSize: 15, fontWeight: 800, color: '#111827' }}>{val}</p>
            <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, padding: '14px 20px' }}>
        <button style={{ flex: 1, height: 42, borderRadius: 999, border: '2px solid #0a7ea4', background: 'white', color: '#0a7ea4', fontFamily: FONT, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#0a7ea4'; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#0a7ea4'; }}>
          <PenLine size={14} /> Edit
        </button>
        <button
          onClick={() => onToggle(campaign.id)}
          disabled={campaign.status === 'ended' || campaign.status === 'reviewing'}
          style={{
            flex: 1, height: 42, borderRadius: 999, fontFamily: FONT, fontSize: 13, fontWeight: 700, cursor: campaign.status === 'ended' || campaign.status === 'reviewing' ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.15s',
            background: campaign.status === 'active' ? 'rgba(217,119,6,0.10)' : campaign.status === 'paused' ? 'rgba(16,185,129,0.10)' : '#F3F4F6',
            color:      campaign.status === 'active' ? '#D97706'              : campaign.status === 'paused' ? '#059669'                : '#9CA3AF',
            border: campaign.status === 'active' ? '2px solid rgba(217,119,6,0.35)' : campaign.status === 'paused' ? '2px solid rgba(16,185,129,0.35)' : '2px solid #E5E7EB',
          }}>
          {campaign.status === 'active'    ? <><Pause size={14} /> Pause</>
           : campaign.status === 'paused'  ? <><Play size={14} /> Resume</>
           : campaign.status === 'reviewing' ? 'In Review'
           : 'Ended'}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdvertisingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [showModal, setShowModal] = useState(false);
  const [tab,       setTab]       = useState<'all' | 'active' | 'paused'>('all');

  const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0);
  const totalClicks      = campaigns.reduce((s, c) => s + c.clicks, 0);
  const totalSpent       = campaigns.reduce((s, c) => s + c.spent, 0);
  const avgCTR           = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

  const filtered = campaigns.filter(c => {
    if (tab === 'active') return c.status === 'active';
    if (tab === 'paused') return c.status === 'paused' || c.status === 'reviewing';
    return true;
  });

  const tabs = [['all', 'All'], ['active', 'Active'], ['paused', 'Paused / Review']] as const;

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: FONT }}>

      {/* ── Hero Header ── */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0a7ea4 0%,#8b5cf6 55%,#ec4899 100%)' }} />
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', bottom: -30, left: -20, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

        <div style={{ position: 'relative', padding: '32px 24px 28px' }}>
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: 18, background: 'rgba(255,255,255,0.20)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Megaphone size={26} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>Advertising</h1>
              <p style={{ margin: '3px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.78)' }}>Reach millions of Stubgram users</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, height: 42, paddingLeft: 18, paddingRight: 18, borderRadius: 999, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.95)', color: '#0a7ea4', fontFamily: FONT, fontSize: 14, fontWeight: 800, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', transition: 'opacity 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <Plus size={15} /> New Ad
            </button>
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            {[
              { icon: Eye,          label: 'Impressions', val: (totalImpressions / 1000).toFixed(0) + 'K' },
              { icon: MousePointer, label: 'Clicks',      val: totalClicks.toLocaleString() },
              { icon: BarChart3,    label: 'Avg CTR',     val: avgCTR + '%' },
              { icon: Wallet,       label: 'Spent (RWF)', val: (totalSpent / 1000).toFixed(0) + 'K' },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} style={{ borderRadius: 16, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', padding: '12px 8px', textAlign: 'center' }}>
                <Icon size={15} color="rgba(255,255,255,0.75)" style={{ display: 'block', margin: '0 auto 6px' }} />
                <p style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 900, color: 'white', letterSpacing: '-0.3px' }}>{val}</p>
                <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky Tab bar ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ display: 'flex', padding: '0 20px' }}>
          {tabs.map(([val, label]) => (
            <button
              key={val}
              onClick={() => setTab(val)}
              style={{ height: 46, paddingRight: 20, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 14, fontWeight: tab === val ? 800 : 500, color: tab === val ? '#111827' : '#9CA3AF', position: 'relative', transition: 'color 0.15s', whiteSpace: 'nowrap' }}
            >
              {label}
              {tab === val && <span style={{ position: 'absolute', bottom: 0, left: 0, right: 20, height: 3, background: '#0a7ea4', borderRadius: 999 }} />}
            </button>
          ))}
        </div>
      </div>

      {/* ── Campaign list ── */}
      <div style={{ padding: '20px 20px 48px', maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Performance banner */}
        {filtered.some(c => c.status === 'active') && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 18, background: 'white', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(10,126,164,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <TrendingUp size={20} color="#0a7ea4" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 800, color: '#111827' }}>Your campaigns are performing</p>
              <p style={{ margin: 0, fontSize: 13, color: '#9CA3AF' }}>Average CTR of {avgCTR}% across active campaigns</p>
            </div>
            <ChevronRight size={18} color="#D1D5DB" />
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 32px', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: 22, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Megaphone size={32} color="#D1D5DB" />
            </div>
            <p style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 800, color: '#111827' }}>No campaigns here</p>
            <p style={{ margin: '0 0 24px', fontSize: 14, color: '#9CA3AF' }}>Create your first ad and start reaching your audience.</p>
            <button
              onClick={() => setShowModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, height: 46, paddingLeft: 24, paddingRight: 24, borderRadius: 999, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#0a7ea4,#8b5cf6)', color: 'white', fontFamily: FONT, fontSize: 15, fontWeight: 800, boxShadow: '0 4px 20px rgba(10,126,164,0.28)' }}>
              <Plus size={16} /> Create Campaign
            </button>
          </div>
        ) : (
          filtered.map(c => <CampaignCard key={c.id} campaign={c} onToggle={id => setCampaigns(p => p.map(x => x.id === id ? { ...x, status: x.status === 'active' ? 'paused' : x.status === 'paused' ? 'active' : x.status } : x))} />)
        )}
      </div>

      {showModal && <NewAdModal onClose={() => setShowModal(false)} onAdd={c => setCampaigns(p => [c, ...p])} />}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

'use client';

import { useState } from 'react';
import {
  Megaphone, Eye, MousePointer, TrendingUp, Plus, X,
  AlertCircle, Loader2, CheckCircle, Pause, Play,
  PenLine, BarChart3, Target, Wallet, Calendar,
  ChevronRight, Zap
} from 'lucide-react';

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

// ─── Mock Data ────────────────────────────────────────────────────────────────
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
const AD_TYPES = ['Image Ad', 'Video Ad', 'Carousel Ad', 'Story Ad', 'Sponsored Post'];

const STATUS_CONFIG: Record<CampaignStatus, { label: string; bg: string; text: string }> = {
  active:    { label: 'Active',     bg: 'bg-emerald-100', text: 'text-emerald-700' },
  paused:    { label: 'Paused',     bg: 'bg-amber-100',   text: 'text-amber-700' },
  ended:     { label: 'Ended',      bg: 'bg-gray-100',    text: 'text-gray-500' },
  reviewing: { label: 'In Review',  bg: 'bg-blue-100',    text: 'text-blue-700' },
};

// ─── New Ad Modal ─────────────────────────────────────────────────────────────
function NewAdModal({ onClose, onAdd }: { onClose: () => void; onAdd: (c: Campaign) => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({
    name: '',
    objective: '',
    adType: '',
    headline: '',
    body: '',
    cta: '',
    budget: '',
    startDate: '',
    endDate: '',
    targetAudience: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const nextStep = () => {
    if (step === 1 && (!form.name || !form.objective || !form.adType)) {
      setError('Please fill in all fields.'); return;
    }
    if (step === 2 && (!form.headline || !form.body)) {
      setError('Headline and body copy are required.'); return;
    }
    setError(null);
    setStep(s => (s < 3 ? (s + 1) as 1 | 2 | 3 : s));
  };

  const handleSubmit = async () => {
    if (!form.budget || !form.startDate || !form.endDate) {
      setError('Budget and dates are required.'); return;
    }
    setLoading(true); setError(null);
    await new Promise(r => setTimeout(r, 1000)); // simulate API

    const newCampaign: Campaign = {
      id: `ad-${Date.now()}`,
      name: form.name,
      status: 'reviewing',
      objective: form.objective,
      adType: form.adType,
      budget: parseInt(form.budget),
      spent: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      startDate: form.startDate,
      endDate: form.endDate,
    };

    onAdd(newCampaign);
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-[20px] font-bold text-gray-900 mb-2">Ad Submitted!</h2>
          <p className="text-[14px] text-gray-500 mb-6">
            Your ad is under <strong>review</strong>. It'll go live within 24 hours once approved.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#0a7ea4] to-[#8b5cf6] text-white font-bold text-[15px] hover:brightness-110 transition-all"
          >
            View Campaigns
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { label: 'Campaign', icon: Target },
    { label: 'Creative', icon: PenLine },
    { label: 'Budget', icon: Wallet },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-bold text-gray-900">Create New Ad</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <X size={18} className="text-gray-500" />
            </button>
          </div>
          {/* Step indicator */}
          <div className="flex items-center gap-0">
            {steps.map((s, i) => {
              const StepIcon = s.icon;
              const isActive = step === i + 1;
              const isDone   = step > i + 1;
              return (
                <div key={s.label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-1 w-full">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all ${
                      isDone   ? 'bg-emerald-500 text-white' :
                      isActive ? 'bg-gradient-to-r from-[#0a7ea4] to-[#8b5cf6] text-white' :
                                 'bg-gray-100 text-gray-400'
                    }`}>
                      {isDone ? <CheckCircle size={14} /> : <StepIcon size={14} />}
                    </div>
                    <span className={`text-[10px] font-medium ${isActive ? 'text-[#0a7ea4]' : 'text-gray-400'}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`h-[2px] flex-1 -mt-4 transition-all ${isDone ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form body */}
        <div className="overflow-y-auto p-6 flex-1 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          {/* Step 1: Campaign Setup */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Campaign Name *</label>
                <input
                  value={form.name} onChange={update('name')}
                  placeholder="e.g. Summer Sale Campaign"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Campaign Objective *</label>
                <select
                  value={form.objective} onChange={update('objective')}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] transition-all appearance-none"
                >
                  <option value="">Select objective...</option>
                  {AD_OBJECTIVES.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Ad Format *</label>
                <div className="grid grid-cols-2 gap-2">
                  {AD_TYPES.map(t => (
                    <button
                      key={t} type="button"
                      onClick={() => setForm(f => ({ ...f, adType: t }))}
                      className={`py-3 px-4 rounded-xl border-2 text-[13px] font-medium text-left transition-all ${
                        form.adType === t
                          ? 'border-[#0a7ea4] bg-[#0a7ea4]/5 text-[#0a7ea4]'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Target Audience</label>
                <input
                  value={form.targetAudience} onChange={update('targetAudience')}
                  placeholder="e.g. 18–35, Tech enthusiasts, Rwanda"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] transition-all"
                />
              </div>
            </>
          )}

          {/* Step 2: Creative */}
          {step === 2 && (
            <>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Ad Headline *</label>
                <input
                  value={form.headline} onChange={update('headline')}
                  placeholder="Catchy headline (max 60 chars)"
                  maxLength={60}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] transition-all"
                />
                <p className="text-[11px] text-gray-400 mt-1 text-right">{form.headline.length}/60</p>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Ad Body Copy *</label>
                <textarea
                  value={form.body} onChange={update('body')}
                  placeholder="Describe your offer clearly and compellingly..."
                  rows={4}
                  maxLength={280}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] transition-all resize-none"
                />
                <p className="text-[11px] text-gray-400 mt-1 text-right">{form.body.length}/280</p>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Call to Action</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Learn More', 'Shop Now', 'Sign Up', 'Download', 'Get Started', 'Contact Us'].map(c => (
                    <button
                      key={c} type="button"
                      onClick={() => setForm(f => ({ ...f, cta: c }))}
                      className={`py-2 px-2 rounded-xl border-2 text-[12px] font-medium transition-all ${
                        form.cta === c
                          ? 'border-[#0a7ea4] bg-[#0a7ea4]/5 text-[#0a7ea4]'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              {/* Preview */}
              {form.headline && (
                <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50">
                  <p className="text-[11px] text-gray-400 mb-2 font-medium uppercase tracking-wide">Preview</p>
                  <div className="bg-white rounded-xl p-3 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0a7ea4] to-[#8b5cf6]" />
                      <div>
                        <p className="text-[12px] font-bold text-gray-900">Sponsored</p>
                        <p className="text-[10px] text-gray-400">{form.adType || 'Ad'}</p>
                      </div>
                    </div>
                    <p className="text-[14px] font-bold text-gray-900 mb-1">{form.headline}</p>
                    <p className="text-[12px] text-gray-600 line-clamp-2">{form.body}</p>
                    {form.cta && (
                      <button className="mt-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#0a7ea4] to-[#8b5cf6] text-white text-[12px] font-semibold">
                        {form.cta}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Step 3: Budget & Schedule */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Total Budget (RWF) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-gray-500">RWF</span>
                  <input
                    type="number" min="1000"
                    value={form.budget} onChange={update('budget')}
                    placeholder="e.g. 20000"
                    className="w-full h-11 pl-14 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Start Date *</label>
                  <input
                    type="date"
                    value={form.startDate} onChange={update('startDate')}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">End Date *</label>
                  <input
                    type="date"
                    value={form.endDate} onChange={update('endDate')}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] transition-all"
                  />
                </div>
              </div>
              {/* Budget summary */}
              {form.budget && form.startDate && form.endDate && (
                <div className="rounded-2xl bg-gradient-to-br from-[#0a7ea4]/5 to-[#8b5cf6]/5 border border-[#0a7ea4]/20 p-4 space-y-2">
                  <p className="text-[13px] font-bold text-gray-700 mb-3">Campaign Summary</p>
                  {[
                    { label: 'Campaign', val: form.name },
                    { label: 'Objective', val: form.objective },
                    { label: 'Format', val: form.adType },
                    { label: 'Budget', val: `RWF ${parseInt(form.budget).toLocaleString()}` },
                    { label: 'Duration', val: `${form.startDate} → ${form.endDate}` },
                  ].map(({ label, val }) => (
                    val ? (
                      <div key={label} className="flex justify-between text-[13px]">
                        <span className="text-gray-500">{label}</span>
                        <span className="font-semibold text-gray-900 text-right max-w-[60%] truncate">{val}</span>
                      </div>
                    ) : null
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer nav */}
        <div className="px-6 py-4 border-t border-gray-100 shrink-0 flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={() => { setError(null); setStep(s => (s - 1) as 1 | 2 | 3); }}
              className="flex-1 py-3 rounded-full border-2 border-gray-200 text-gray-600 font-semibold text-[14px] hover:bg-gray-50 transition-all"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              type="button" onClick={nextStep}
              className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#0a7ea4] to-[#8b5cf6] text-white font-bold text-[14px] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Continue
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button" onClick={handleSubmit} disabled={loading}
              className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#0a7ea4] to-[#8b5cf6] text-white font-bold text-[14px] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
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
  const ctr = campaign.impressions > 0 ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2) : '0.00';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Card header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-bold text-[15px] text-gray-900 truncate">{campaign.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{campaign.objective}</span>
              <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{campaign.adType}</span>
            </div>
          </div>
          <span className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-bold ${cfg.bg} ${cfg.text}`}>
            {cfg.label}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-[12px] text-gray-400">
          <Calendar size={12} />
          <span>{campaign.startDate} → {campaign.endDate}</span>
        </div>
      </div>

      {/* Budget progress */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex justify-between text-[12px] mb-2">
          <span className="text-gray-600 font-medium">RWF {campaign.spent.toLocaleString()} <span className="text-gray-400 font-normal">spent</span></span>
          <span className="text-gray-400">Budget: RWF {campaign.budget.toLocaleString()}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: pct > 85
                ? 'linear-gradient(90deg,#f97316,#ef4444)'
                : 'linear-gradient(90deg,#0a7ea4,#8b5cf6)',
            }}
          />
        </div>
        <p className="text-[11px] text-gray-400 mt-1">{pct}% of budget used</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 divide-x divide-gray-100">
        {[
          { Icon: Eye,           label: 'Impressions', val: campaign.impressions > 0 ? (campaign.impressions / 1000).toFixed(1) + 'K' : '–' },
          { Icon: MousePointer,  label: 'Clicks',      val: campaign.clicks.toLocaleString() || '–' },
          { Icon: BarChart3,     label: 'CTR',         val: campaign.impressions > 0 ? `${ctr}%` : '–' },
        ].map(({ Icon, label, val }) => (
          <div key={label} className="py-3 text-center">
            <Icon size={14} className="mx-auto mb-1 text-[#0a7ea4]" />
            <p className="text-[14px] font-bold text-gray-900">{val}</p>
            <p className="text-[10px] text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-4 pb-4 pt-3">
        <button className="flex-1 py-2.5 rounded-full text-[13px] font-semibold border-2 border-[#0a7ea4] text-[#0a7ea4] hover:bg-[#0a7ea4] hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5">
          <PenLine size={13} />
          Edit
        </button>
        <button
          onClick={() => onToggle(campaign.id)}
          className={`flex-1 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
            campaign.status === 'active'
              ? 'bg-amber-50 border-2 border-amber-300 text-amber-600 hover:bg-amber-100'
              : campaign.status === 'paused'
              ? 'bg-emerald-50 border-2 border-emerald-300 text-emerald-600 hover:bg-emerald-100'
              : 'bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          disabled={campaign.status === 'ended' || campaign.status === 'reviewing'}
        >
          {campaign.status === 'active'
            ? <><Pause size={13} /> Pause</>
            : campaign.status === 'paused'
            ? <><Play size={13} /> Resume</>
            : campaign.status === 'reviewing'
            ? 'In Review'
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
  const [tab, setTab] = useState<'all' | 'active' | 'paused'>('all');

  const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0);
  const totalClicks      = campaigns.reduce((s, c) => s + c.clicks, 0);
  const totalSpent       = campaigns.reduce((s, c) => s + c.spent, 0);
  const avgCTR           = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

  const filtered = campaigns.filter(c => {
    if (tab === 'active') return c.status === 'active';
    if (tab === 'paused') return c.status === 'paused' || c.status === 'reviewing';
    return true;
  });

  const handleToggle = (id: string) => {
    setCampaigns(prev => prev.map(c =>
      c.id === id
        ? { ...c, status: c.status === 'active' ? 'paused' : c.status === 'paused' ? 'active' : c.status }
        : c
    ));
  };

  const handleAdd = (newC: Campaign) => setCampaigns(prev => [newC, ...prev]);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero header ── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a7ea4] to-[#8b5cf6]" />
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-white/10" />

        <div className="relative px-4 pt-5 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-white leading-tight">Advertising</h1>
              <p className="text-white/75 text-[12px]">Reach millions of Stubgram users</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="ml-auto flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white text-[#0a7ea4] text-[13px] font-bold hover:bg-gray-50 active:scale-[0.97] transition-all shadow-lg"
            >
              <Plus size={14} />
              New Ad
            </button>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[
              { icon: Eye,          label: 'Impressions', val: (totalImpressions / 1000).toFixed(0) + 'K' },
              { icon: MousePointer, label: 'Clicks',      val: totalClicks.toLocaleString() },
              { icon: BarChart3,    label: 'Avg CTR',     val: avgCTR + '%' },
              { icon: Wallet,       label: 'Spent (RWF)', val: (totalSpent / 1000).toFixed(0) + 'K' },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="rounded-2xl bg-white/15 backdrop-blur-sm p-3 text-center">
                <Icon size={14} className="text-white/80 mx-auto mb-1" />
                <p className="text-[15px] font-bold text-white leading-tight">{val}</p>
                <p className="text-[9px] text-white/65 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div className="border-b border-gray-200 sticky top-0 z-10 bg-white/95 backdrop-blur-sm">
        <div className="flex px-4">
          {([['all', 'All'], ['active', 'Active'], ['paused', 'Paused / Review']] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setTab(val)}
              className={`py-3.5 text-[14px] font-semibold mr-6 relative transition-colors ${
                tab === val ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
              {tab === val && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[#0a7ea4]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Campaign list ── */}
      <div className="px-4 py-4 space-y-4">

        {/* Performance tip banner */}
        {filtered.some(c => c.status === 'active') && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-[#0a7ea4]/5 to-[#8b5cf6]/5 border border-[#0a7ea4]/15">
            <div className="w-9 h-9 rounded-xl bg-[#0a7ea4]/10 flex items-center justify-center shrink-0">
              <TrendingUp size={16} className="text-[#0a7ea4]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-gray-900">Your campaigns are performing</p>
              <p className="text-[11px] text-gray-500">Average CTR of {avgCTR}% across active campaigns</p>
            </div>
            <ChevronRight size={16} className="text-gray-400 shrink-0" />
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <Megaphone className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-900 font-semibold text-[15px] mb-1">No campaigns here</p>
            <p className="text-gray-400 text-[13px] mb-5">Create your first ad and start reaching your audience.</p>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#0a7ea4] to-[#8b5cf6] text-white font-bold hover:brightness-110 transition-all"
            >
              <Plus size={15} />
              Create Campaign
            </button>
          </div>
        ) : (
          filtered.map(c => (
            <CampaignCard key={c.id} campaign={c} onToggle={handleToggle} />
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && <NewAdModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
    </div>
  );
}

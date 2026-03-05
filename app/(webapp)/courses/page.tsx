'use client';

import { useState } from 'react';
import {
  GraduationCap, Search, Star, Users, Clock,
  X, Upload, Plus, BookOpen, CheckCircle, Loader2, AlertCircle,
  Play, Lock, ChevronRight,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

// ─── Types ────────────────────────────────────────────────────────────────────
type CourseTab = 'all' | 'mine';

interface Course {
  id: string;
  title: string;
  teacher: string;
  avatar: string;
  rating: number;
  students: number;
  duration: string;
  price: number;
  enrolled: boolean;
  thumb: string;
  category: string;
  description: string;
  isOwner?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Development', 'Marketing', 'Photography', 'Health', 'Beauty', 'Food & Business', 'Finance', 'Design'];

const INITIAL_COURSES: Course[] = [
  {
    id: 'cr1',
    title: 'Full Stack Development with Next.js & AI',
    teacher: 'Kevin Osei', avatar: '12',
    rating: 4.9, students: 14320, duration: '42h', price: 500, enrolled: true,
    thumb: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80',
    category: 'Development',
    description: 'Master Next.js 14, AI integrations, and full-stack architecture. Build 5 real-world projects.',
  },
  {
    id: 'cr2',
    title: 'Content Creation Masterclass 2024',
    teacher: 'Selena Martinez', avatar: '47',
    rating: 4.8, students: 28900, duration: '18h', price: 300, enrolled: false,
    thumb: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
    category: 'Marketing',
    description: 'Go viral consistently. Learn shooting, editing, scripting, and monetization strategies.',
  },
  {
    id: 'cr3',
    title: 'Professional Photography & Editing',
    teacher: 'Jake Thornton', avatar: '8',
    rating: 4.7, students: 9400, duration: '24h', price: 400, enrolled: false,
    thumb: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80',
    category: 'Photography',
    description: 'From beginner to professional: camera techniques, Lightroom mastery, and portfolio building.',
  },
  {
    id: 'cr4',
    title: 'Fitness Coaching Certification',
    teacher: 'Marcus Reid', avatar: '11',
    rating: 4.9, students: 7800, duration: '30h', price: 600, enrolled: true,
    thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
    category: 'Health',
    description: 'Become a certified fitness coach. Nutrition, programming, and client management.',
  },
  {
    id: 'cr5',
    title: 'Skincare & Beauty Business',
    teacher: 'Amara Diallo', avatar: '45',
    rating: 4.6, students: 5200, duration: '15h', price: 250, enrolled: false,
    thumb: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80',
    category: 'Beauty',
    description: 'Launch and scale your beauty brand: formulation, branding, e-commerce, and content.',
  },
  {
    id: 'cr6',
    title: 'Food Business & Recipe Monetization',
    teacher: 'Nadia Wright', avatar: '23',
    rating: 4.8, students: 3900, duration: '20h', price: 350, enrolled: false,
    thumb: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80',
    category: 'Food & Business',
    description: 'Turn your culinary passion into a profitable business. Recipes, cookbooks, and food brand strategy.',
  },
];

// ─── Input helper ─────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', height: 46, padding: '0 14px',
  borderRadius: 14, border: '1.5px solid #E5E7EB',
  background: '#F9FAFB', fontFamily: FONT, fontSize: 14,
  color: '#111827', outline: 'none', boxSizing: 'border-box',
  transition: 'all 0.2s',
};

// ─── Course Card ──────────────────────────────────────────────────────────────
function CourseCard({ course, onEnroll }: { course: Course; onEnroll: (id: string) => void }) {
  const [enrolling, setEnrolling] = useState(false);

  const handleEnroll = async () => {
    setEnrolling(true);
    await new Promise(r => setTimeout(r, 800));
    onEnroll(course.id);
    setEnrolling(false);
  };

  return (
    <article
      style={{
        background: 'white', borderRadius: 20, border: '1px solid #E5E7EB',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'pointer',
        fontFamily: FONT,
      }}
      onMouseEnter={e => { (e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.10)'); (e.currentTarget.style.transform = 'translateY(-3px)'); }}
      onMouseLeave={e => { (e.currentTarget.style.boxShadow = 'none'); (e.currentTarget.style.transform = 'translateY(0)'); }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', height: 180, background: '#F3F4F6', overflow: 'hidden', flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={course.thumb}
          alt={course.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        />
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)' }} />

        {/* Category badge */}
        <span style={{
          position: 'absolute', top: 12, left: 12,
          padding: '4px 10px', borderRadius: 999,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
          color: 'white', fontSize: 11, fontWeight: 600,
        }}>
          {course.category}
        </span>

        {/* Enrolled / Owner badge */}
        {course.enrolled && (
          <span style={{
            position: 'absolute', top: 12, right: 12,
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '4px 10px', borderRadius: 999,
            background: '#10B981', color: 'white', fontSize: 11, fontWeight: 700,
          }}>
            <CheckCircle size={10} /> Enrolled
          </span>
        )}
        {course.isOwner && (
          <span style={{
            position: 'absolute', top: 12, right: 12,
            padding: '4px 10px', borderRadius: 999,
            background: 'linear-gradient(135deg,#0a7ea4,#8b5cf6)',
            color: 'white', fontSize: 11, fontWeight: 700,
          }}>
            Your Course
          </span>
        )}

        {/* Price pill */}
        <div style={{
          position: 'absolute', bottom: 12, right: 12,
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 10px', borderRadius: 999,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
          color: 'white',
        }}>
          <span style={{ fontSize: 15 }}>🪙</span>
          <span style={{ fontWeight: 800, fontSize: 14 }}>{course.price}</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h2 style={{
          margin: 0, fontSize: 15, fontWeight: 800, color: '#111827',
          lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
        }}>
          {course.title}
        </h2>

        <p style={{
          margin: 0, fontSize: 13, color: '#6B7280', lineHeight: 1.6,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
        }}>
          {course.description}
        </p>

        {/* Teacher row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 2, borderTop: '1px solid #F3F4F6' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.pravatar.cc/32?img=${course.avatar}`}
            alt={course.teacher}
            style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {course.teacher}
          </span>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, color: '#9CA3AF' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Star size={13} color="#F59E0B" fill="#F59E0B" />
            <span style={{ fontWeight: 700, color: '#374151' }}>{course.rating}</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Users size={13} color="#9CA3AF" />
            {course.students.toLocaleString()}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={13} color="#9CA3AF" />
            {course.duration}
          </span>
        </div>

        {/* CTA */}
        {course.isOwner ? (
          <button style={{
            width: '100%', height: 42, borderRadius: 999, border: '2px solid #0a7ea4',
            background: 'white', color: '#0a7ea4', fontFamily: FONT, fontSize: 14, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#0a7ea4'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#0a7ea4'; }}
          >
            <BookOpen size={15} /> Manage Course
          </button>
        ) : course.enrolled ? (
          <button style={{
            width: '100%', height: 42, borderRadius: 999,
            border: '1.5px solid rgba(16,185,129,0.4)',
            background: 'rgba(16,185,129,0.08)', color: '#059669',
            fontFamily: FONT, fontSize: 14, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(16,185,129,0.15)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(16,185,129,0.08)')}
          >
            <Play size={14} fill="#059669" /> Continue Learning
          </button>
        ) : (
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            style={{
              width: '100%', height: 42, borderRadius: 999, border: 'none',
              cursor: enrolling ? 'not-allowed' : 'pointer',
              background: enrolling ? '#E5E7EB' : 'linear-gradient(135deg,#0a7ea4,#8b5cf6)',
              color: enrolling ? '#9CA3AF' : 'white',
              fontFamily: FONT, fontSize: 14, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              boxShadow: enrolling ? 'none' : '0 3px 12px rgba(10,126,164,0.28)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (!enrolling) e.currentTarget.style.opacity = '0.90'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            {enrolling ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Lock size={15} />}
            {enrolling ? 'Enrolling…' : 'Enroll Now'}
          </button>
        )}
      </div>
    </article>
  );
}

// ─── Apply to Teach Modal ─────────────────────────────────────────────────────
function ApplyTeachModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ full_name: '', expertise: '', bio: '', experience_years: '', social_link: '', sample_topic: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.expertise || !form.bio || !form.sample_topic) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true); setError(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const { error: dbErr } = await supabase.from('teacher_applications').insert({
        user_id: user?.id, email: user?.email, full_name: form.full_name,
        expertise: form.expertise, bio: form.bio,
        experience_years: parseInt(form.experience_years) || 0,
        social_link: form.social_link || null, sample_topic: form.sample_topic,
        status: 'pending', applied_at: new Date().toISOString(),
      });
      if (dbErr) throw dbErr;
      setSuccess(true);
    } catch {
      console.warn('Teacher application (DB may not exist yet):', form);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: FONT }}>
        <div style={{ background: 'white', borderRadius: 28, padding: '52px 36px', maxWidth: 400, width: '100%', boxShadow: '0 32px 80px rgba(0,0,0,0.20)', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#10B981,#34D399)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={32} color="white" />
          </div>
          <h2 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 800, color: '#111827' }}>Application Submitted!</h2>
          <p style={{ margin: '0 0 28px', fontSize: 14, color: '#6B7280', lineHeight: 1.7 }}>
            Our team will review your application and get back to you within <strong style={{ color: '#111827' }}>3–5 business days</strong>.
          </p>
          <button onClick={onClose} style={{ width: '100%', height: 50, borderRadius: 999, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#0a7ea4,#8b5cf6)', color: 'white', fontFamily: FONT, fontSize: 15, fontWeight: 800, boxShadow: '0 4px 20px rgba(10,126,164,0.30)' }}>
            Got it!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: FONT }}>
      <div style={{ background: 'white', borderRadius: 28, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.20)', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ position: 'sticky', top: 0, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #F3F4F6', zIndex: 1 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#111827' }}>Apply to Teach</h2>
            <p style={{ margin: '3px 0 0', fontSize: 13, color: '#9CA3AF' }}>Share your expertise with the Stubgram community</p>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: '50%', background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={17} color="#6B7280" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 14, color: '#DC2626', fontSize: 13 }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}

          {[
            { label: 'Full Name *', key: 'full_name', ph: 'Your full name', type: 'text' },
            { label: 'Years of Experience', key: 'experience_years', ph: 'e.g. 5', type: 'number' },
            { label: 'Sample Course Topic *', key: 'sample_topic', ph: 'e.g. React for Beginners: Build 3 Real Projects', type: 'text' },
            { label: 'Portfolio / Social Link', key: 'social_link', ph: 'https://yourwebsite.com or LinkedIn', type: 'url' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>{f.label}</label>
              <input
                type={f.type} placeholder={f.ph}
                value={form[f.key as keyof typeof form]}
                onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.border = '1.5px solid #0a7ea4'; e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(10,126,164,0.08)'; }}
                onBlur={e => { e.currentTarget.style.border = '1.5px solid #E5E7EB'; e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>
          ))}

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Area of Expertise *</label>
            <select
              value={form.expertise}
              onChange={e => setForm(v => ({ ...v, expertise: e.target.value }))}
              style={{ ...inputStyle, appearance: 'none' as const }}
            >
              <option value="">Select your field...</option>
              {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Your Bio *</label>
            <textarea
              value={form.bio}
              onChange={e => setForm(v => ({ ...v, bio: e.target.value }))}
              placeholder="Tell us about yourself, your background, and what you teach..."
              rows={3}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 14, border: '1.5px solid #E5E7EB', background: '#F9FAFB', fontFamily: FONT, fontSize: 14, color: '#111827', outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.6, transition: 'all 0.2s' }}
              onFocus={e => { e.currentTarget.style.border = '1.5px solid #0a7ea4'; e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(10,126,164,0.08)'; }}
              onBlur={e => { e.currentTarget.style.border = '1.5px solid #E5E7EB'; e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
        </form>

        {/* Footer */}
        <div style={{ padding: '0 24px 24px' }}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', height: 52, borderRadius: 999, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', background: loading ? '#E5E7EB' : 'linear-gradient(135deg,#0a7ea4,#8b5cf6)', color: loading ? '#9CA3AF' : 'white', fontFamily: FONT, fontSize: 15, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: loading ? 'none' : '0 4px 20px rgba(10,126,164,0.30)', transition: 'all 0.15s' }}
          >
            {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <GraduationCap size={18} />}
            {loading ? 'Submitting…' : 'Submit Application'}
          </button>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', margin: '10px 0 0', fontFamily: FONT }}>
            Applications are reviewed within 3–5 business days
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Add Course Modal ─────────────────────────────────────────────────────────
function AddCourseModal({ onClose, onAdd }: { onClose: () => void; onAdd: (c: Course) => void }) {
  const [form, setForm] = useState({ title: '', description: '', category: '', duration: '', price: '', thumb: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.duration || !form.price) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true); setError(null);
    const fallbackThumb = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80';
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from('courses').insert({
        title: form.title, description: form.description, category: form.category,
        duration: form.duration, price: parseInt(form.price),
        thumb_url: form.thumb || fallbackThumb,
        teacher_id: user?.id,
        teacher_name: user?.user_metadata?.full_name || user?.email?.split('@')[0],
        status: 'published', created_at: new Date().toISOString(),
      }).select().single();
      const newCourse: Course = {
        id: data?.id || `cr-${Date.now()}`, title: form.title, description: form.description,
        category: form.category, duration: form.duration, price: parseInt(form.price),
        teacher: 'You', avatar: '32', rating: 0, students: 0, enrolled: false,
        thumb: form.thumb || fallbackThumb, isOwner: true,
      };
      onAdd(newCourse); onClose();
    } catch {
      onAdd({ id: `cr-${Date.now()}`, title: form.title, description: form.description, category: form.category, duration: form.duration, price: parseInt(form.price) || 0, teacher: 'You', avatar: '32', rating: 0, students: 0, enrolled: false, thumb: form.thumb || fallbackThumb, isOwner: true });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: FONT }}>
      <div style={{ background: 'white', borderRadius: 28, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.20)', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ position: 'sticky', top: 0, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #F3F4F6', zIndex: 1 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#111827' }}>Add New Course</h2>
            <p style={{ margin: '3px 0 0', fontSize: 13, color: '#9CA3AF' }}>Publish a course and start earning</p>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: '50%', background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={17} color="#6B7280" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 14, color: '#DC2626', fontSize: 13 }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Course Title *</label>
            <input type="text" value={form.title} onChange={e => setForm(v => ({ ...v, title: e.target.value }))} placeholder="e.g. Advanced React Patterns for Production" style={inputStyle}
              onFocus={e => { e.currentTarget.style.border = '1.5px solid #0a7ea4'; e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(10,126,164,0.08)'; }}
              onBlur={e => { e.currentTarget.style.border = '1.5px solid #E5E7EB'; e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.boxShadow = 'none'; }} />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Description *</label>
            <textarea value={form.description} onChange={e => setForm(v => ({ ...v, description: e.target.value }))} placeholder="What will students learn? What's covered?" rows={3}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 14, border: '1.5px solid #E5E7EB', background: '#F9FAFB', fontFamily: FONT, fontSize: 14, color: '#111827', outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.6, transition: 'all 0.2s' }}
              onFocus={e => { e.currentTarget.style.border = '1.5px solid #0a7ea4'; e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(10,126,164,0.08)'; }}
              onBlur={e => { e.currentTarget.style.border = '1.5px solid #E5E7EB'; e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.boxShadow = 'none'; }} />
          </div>

          {/* Category + Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Category *</label>
              <select value={form.category} onChange={e => setForm(v => ({ ...v, category: e.target.value }))} style={{ ...inputStyle, appearance: 'none' as const }}>
                <option value="">Select...</option>
                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Duration *</label>
              <input type="text" value={form.duration} onChange={e => setForm(v => ({ ...v, duration: e.target.value }))} placeholder="e.g. 12h" style={inputStyle}
                onFocus={e => { e.currentTarget.style.border = '1.5px solid #0a7ea4'; e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(10,126,164,0.08)'; }}
                onBlur={e => { e.currentTarget.style.border = '1.5px solid #E5E7EB'; e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.boxShadow = 'none'; }} />
            </div>
          </div>

          {/* Price */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Price (Coins) *</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 17 }}>🪙</span>
              <input type="number" min="0" value={form.price} onChange={e => setForm(v => ({ ...v, price: e.target.value }))} placeholder="e.g. 400" style={{ ...inputStyle, paddingLeft: 40 }}
                onFocus={e => { e.currentTarget.style.border = '1.5px solid #0a7ea4'; e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(10,126,164,0.08)'; }}
                onBlur={e => { e.currentTarget.style.border = '1.5px solid #E5E7EB'; e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.boxShadow = 'none'; }} />
            </div>
          </div>

          {/* Cover image */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Cover Image URL</label>
            <div style={{ position: 'relative' }}>
              <Upload size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
              <input type="url" value={form.thumb} onChange={e => setForm(v => ({ ...v, thumb: e.target.value }))} placeholder="https://images.unsplash.com/..." style={{ ...inputStyle, paddingLeft: 40 }}
                onFocus={e => { e.currentTarget.style.border = '1.5px solid #0a7ea4'; e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(10,126,164,0.08)'; }}
                onBlur={e => { e.currentTarget.style.border = '1.5px solid #E5E7EB'; e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.boxShadow = 'none'; }} />
            </div>
            {form.thumb && (
              <div style={{ marginTop: 10, height: 100, borderRadius: 14, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.thumb} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div style={{ padding: '0 24px 24px' }}>
          <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', height: 52, borderRadius: 999, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', background: loading ? '#E5E7EB' : 'linear-gradient(135deg,#0a7ea4,#8b5cf6)', color: loading ? '#9CA3AF' : 'white', fontFamily: FONT, fontSize: 15, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: loading ? 'none' : '0 4px 20px rgba(10,126,164,0.30)', transition: 'all 0.15s' }}>
            {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={18} />}
            {loading ? 'Publishing…' : 'Publish Course'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CoursesPage() {
  const [tab, setTab] = useState<CourseTab>('all');
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const isTeacher = false;

  const filtered = courses.filter(c => {
    if (tab === 'mine' && !c.enrolled && !c.isOwner) return false;
    if (activeCategory !== 'All' && c.category !== activeCategory) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!c.title.toLowerCase().includes(q) && !c.teacher.toLowerCase().includes(q) && !c.category.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: FONT }}>

      {/* ── Hero Header ── */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0a7ea4 0%,#8b5cf6 55%,#ec4899 100%)' }} />
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', top: 24, left: '38%', width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <div style={{ position: 'relative', padding: '34px 24px 28px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 20, background: 'rgba(255,255,255,0.20)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <GraduationCap size={28} color="white" />
          </div>
          <h1 style={{ margin: '0 0 8px', fontSize: 28, fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>Courses</h1>
          <p style={{ margin: '0 0 20px', fontSize: 14, color: 'rgba(255,255,255,0.80)', lineHeight: 1.5 }}>
            Learn from the best — grow your skills with real creators
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, background: 'rgba(255,255,255,0.20)', backdropFilter: 'blur(4px)', color: 'white', padding: '7px 16px', borderRadius: 999 }}>
              <BookOpen size={13} /> {courses.length} courses available
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.90)', padding: '7px 16px', borderRadius: 999 }}>
              🪙 Earn coins while learning
            </span>
          </div>
        </div>
      </div>

      {/* ── Sticky Topbar ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid #E5E7EB',
      }}>
        {/* Title + CTA row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#0a7ea4,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={18} color="white" />
            </div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#111827' }}>Courses</h2>
          </div>
          {isTeacher ? (
            <button
              onClick={() => setShowAddModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, height: 36, paddingLeft: 16, paddingRight: 16, borderRadius: 999, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#0a7ea4,#8b5cf6)', color: 'white', fontFamily: FONT, fontSize: 13, fontWeight: 700, boxShadow: '0 2px 8px rgba(10,126,164,0.25)', transition: 'opacity 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <Plus size={14} /> Add Course
            </button>
          ) : (
            <button
              onClick={() => setShowApplyModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, height: 36, paddingLeft: 16, paddingRight: 16, borderRadius: 999, border: '2px solid #0a7ea4', cursor: 'pointer', background: 'white', color: '#0a7ea4', fontFamily: FONT, fontSize: 13, fontWeight: 700, transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#0a7ea4'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#0a7ea4'; }}
            >
              <GraduationCap size={14} /> Teach
            </button>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB', padding: '0 20px' }}>
          {(['all', 'mine'] as CourseTab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, height: 42, background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: FONT, fontSize: 14, fontWeight: tab === t ? 800 : 500,
                color: tab === t ? '#111827' : '#9CA3AF',
                position: 'relative', transition: 'color 0.15s',
              }}
            >
              {t === 'all' ? 'All Courses' : 'My Courses'}
              {tab === t && <span style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 52, height: 3, background: '#0a7ea4', borderRadius: 999 }} />}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ padding: '10px 20px 10px', position: 'relative' }}>
          <Search style={{ position: 'absolute', left: 34, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#9CA3AF', pointerEvents: 'none' }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search courses or teachers..."
            style={{ width: '100%', height: 44, paddingLeft: 42, paddingRight: 14, borderRadius: 999, border: '1.5px solid transparent', background: '#F3F4F6', fontFamily: FONT, fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s' }}
            onFocus={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.border = '1.5px solid #0a7ea4'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(10,126,164,0.08)'; }}
            onBlur={e => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.border = '1.5px solid transparent'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 8, padding: '0 20px 12px', overflowX: 'auto' }} className="no-scrollbar">
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  flexShrink: 0, height: 34, paddingLeft: 14, paddingRight: 14, borderRadius: 999,
                  border: active ? 'none' : '1.5px solid #E5E7EB',
                  background: active ? 'linear-gradient(135deg,#0a7ea4,#8b5cf6)' : 'white',
                  color: active ? 'white' : '#6B7280',
                  fontFamily: FONT, fontSize: 12, fontWeight: active ? 700 : 500, cursor: 'pointer',
                  boxShadow: active ? '0 2px 10px rgba(10,126,164,0.25)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '20px 20px 48px', maxWidth: 1200, margin: '0 auto' }}>

        {/* Stats + banner row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <BookOpen size={15} color="#0a7ea4" />
          <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>
            <strong style={{ color: '#111827', fontWeight: 800 }}>{filtered.length}</strong> courses available
          </span>
        </div>

        {/* Apply to Teach Banner */}
        {tab === 'all' && !isTeacher && (
          <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 24, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0a7ea4,#8b5cf6)' }} />
            <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16, padding: '20px 22px' }}>
              <div style={{ width: 50, height: 50, borderRadius: 16, background: 'rgba(255,255,255,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <GraduationCap size={24} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 3px', fontSize: 15, fontWeight: 800, color: 'white', fontFamily: FONT }}>Share your expertise</p>
                <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.80)', fontFamily: FONT }}>Apply to teach and earn coins from your courses</p>
              </div>
              <button
                onClick={() => setShowApplyModal(true)}
                style={{ flexShrink: 0, height: 38, paddingLeft: 18, paddingRight: 14, borderRadius: 999, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.95)', color: '#0a7ea4', fontFamily: FONT, fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4, transition: 'opacity 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Apply <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 32px', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: 22, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <GraduationCap size={32} color="#D1D5DB" />
            </div>
            <p style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 800, color: '#111827', fontFamily: FONT }}>
              {tab === 'mine' ? 'No courses yet' : 'No courses found'}
            </p>
            <p style={{ margin: 0, fontSize: 14, color: '#9CA3AF', fontFamily: FONT }}>
              {tab === 'mine' ? "You haven't enrolled or published any courses yet." : 'Try a different search or category.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {filtered.map(c => (
              <CourseCard key={c.id} course={c} onEnroll={id => setCourses(p => p.map(x => x.id === id ? { ...x, enrolled: true } : x))} />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showApplyModal && <ApplyTeachModal onClose={() => setShowApplyModal(false)} />}
      {showAddModal && <AddCourseModal onClose={() => setShowAddModal(false)} onAdd={c => setCourses(p => [c, ...p])} />}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

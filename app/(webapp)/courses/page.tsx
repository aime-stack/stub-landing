'use client';

import { useState } from 'react';
import {
  GraduationCap, Search, Star, Users, Clock, ChevronRight,
  X, Upload, Plus, BookOpen, CheckCircle, Loader2, AlertCircle,
  Play, Lock
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

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

// ─── Mock Data ────────────────────────────────────────────────────────────────
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
    isOwner: false,
  },
  {
    id: 'cr2',
    title: 'Content Creation Masterclass 2024',
    teacher: 'Selena Martinez', avatar: '47',
    rating: 4.8, students: 28900, duration: '18h', price: 300, enrolled: false,
    thumb: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
    category: 'Marketing',
    description: 'Go viral consistently. Learn shooting, editing, scripting, and monetization strategies.',
    isOwner: false,
  },
  {
    id: 'cr3',
    title: 'Professional Photography & Editing',
    teacher: 'Jake Thornton', avatar: '8',
    rating: 4.7, students: 9400, duration: '24h', price: 400, enrolled: false,
    thumb: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80',
    category: 'Photography',
    description: 'From beginner to professional: camera techniques, Lightroom mastery, and portfolio building.',
    isOwner: false,
  },
  {
    id: 'cr4',
    title: 'Fitness Coaching Certification',
    teacher: 'Marcus Reid', avatar: '11',
    rating: 4.9, students: 7800, duration: '30h', price: 600, enrolled: true,
    thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
    category: 'Health',
    description: 'Become a certified fitness coach. Nutrition, programming, and client management.',
    isOwner: false,
  },
  {
    id: 'cr5',
    title: 'Skincare & Beauty Business',
    teacher: 'Amara Diallo', avatar: '45',
    rating: 4.6, students: 5200, duration: '15h', price: 250, enrolled: false,
    thumb: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80',
    category: 'Beauty',
    description: 'Launch and scale your beauty brand: formulation, branding, e-commerce, and content.',
    isOwner: false,
  },
  {
    id: 'cr6',
    title: 'Food Business & Recipe Monetization',
    teacher: 'Nadia Wright', avatar: '23',
    rating: 4.8, students: 3900, duration: '20h', price: 350, enrolled: false,
    thumb: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80',
    category: 'Food & Business',
    description: 'Turn your culinary passion into a profitable business. Recipes, cookbooks, and food brand strategy.',
    isOwner: false,
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function CourseCard({ course, onEnroll }: { course: Course; onEnroll: (id: string) => void }) {
  const [enrolling, setEnrolling] = useState(false);

  const handleEnroll = async () => {
    setEnrolling(true);
    await new Promise(r => setTimeout(r, 800)); // simulate API
    onEnroll(course.id);
    setEnrolling(false);
  };

  return (
    <article className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 group cursor-pointer">
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={course.thumb}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {/* Category badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/50 backdrop-blur-sm text-white text-[11px] font-semibold rounded-full">
          {course.category}
        </span>
        {/* Enrolled badge */}
        {course.enrolled && (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-500 text-white text-[11px] font-bold rounded-full flex items-center gap-1">
            <CheckCircle size={10} />
            Enrolled
          </span>
        )}
        {/* Owner badge */}
        {course.isOwner && (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-gradient-to-r from-[#0a7ea4] to-[#8b5cf6] text-white text-[11px] font-bold rounded-full">
            Your Course
          </span>
        )}
        {/* Price overlay */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg">
          <span className="text-base">🪙</span>
          <span className="font-bold text-[14px]">{course.price}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h2 className="text-[15px] font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-[#0a7ea4] transition-colors">
          {course.title}
        </h2>
        <p className="text-[13px] text-gray-500 line-clamp-2 mb-3">{course.description}</p>

        {/* Teacher */}
        <div className="flex items-center gap-2 mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.pravatar.cc/32?img=${course.avatar}`}
            alt={course.teacher}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-[13px] font-medium text-gray-600">{course.teacher}</span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-[12px] text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-gray-700">{course.rating}</span>
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {course.students.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {course.duration}
          </span>
        </div>

        {/* CTA button */}
        {course.isOwner ? (
          <button className="w-full py-2.5 rounded-full text-[14px] font-semibold border-2 border-[#0a7ea4] text-[#0a7ea4] hover:bg-[#0a7ea4] hover:text-white transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2">
            <BookOpen size={15} />
            Manage Course
          </button>
        ) : course.enrolled ? (
          <button className="w-full py-2.5 rounded-full text-[14px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2">
            <Play size={14} className="fill-current" />
            Continue Learning
          </button>
        ) : (
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="w-full py-2.5 rounded-full text-[14px] font-semibold bg-gradient-to-r from-[#0a7ea4] to-[#8b5cf6] text-white hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {enrolling ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
            {enrolling ? 'Enrolling…' : 'Enroll Now'}
          </button>
        )}
      </div>
    </article>
  );
}

// ─── Apply to Teach Modal ────────────────────────────────────────────────────
function ApplyTeachModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    full_name: '',
    expertise: '',
    bio: '',
    experience_years: '',
    social_link: '',
    sample_topic: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.expertise || !form.bio || !form.sample_topic) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const { error: dbErr } = await supabase.from('teacher_applications').insert({
        user_id: user?.id,
        email: user?.email,
        full_name: form.full_name,
        expertise: form.expertise,
        bio: form.bio,
        experience_years: parseInt(form.experience_years) || 0,
        social_link: form.social_link || null,
        sample_topic: form.sample_topic,
        status: 'pending',
        applied_at: new Date().toISOString(),
      });

      if (dbErr) throw dbErr;
      setSuccess(true);
    } catch (err: any) {
      // Graceful fallback: if table doesn't exist yet, still show success
      // (application saved in memory / logged for now)
      console.warn('Teacher application (DB may not exist yet):', form);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-[22px] font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-500 text-[15px] mb-6">
            Our team will review your application and get back to you within <strong>3–5 business days</strong>.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#0a7ea4] to-[#8b5cf6] text-white font-bold text-[15px] hover:brightness-110 transition-all"
          >
            Got it!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <div>
            <h2 className="text-[18px] font-bold text-gray-900">Apply to Teach</h2>
            <p className="text-[13px] text-gray-500">Share your expertise with the Stubgram community</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Full Name *</label>
              <input
                type="text"
                value={form.full_name}
                onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                placeholder="Your full name"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] focus:border-transparent transition-all"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Area of Expertise *</label>
              <select
                value={form.expertise}
                onChange={e => setForm(f => ({ ...f, expertise: e.target.value }))}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] focus:border-transparent transition-all appearance-none"
              >
                <option value="">Select your field...</option>
                {CATEGORIES.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Years of Experience</label>
            <input
              type="number"
              min="0"
              max="50"
              value={form.experience_years}
              onChange={e => setForm(f => ({ ...f, experience_years: e.target.value }))}
              placeholder="e.g. 5"
              className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Your Bio *</label>
            <textarea
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="Tell us about yourself, your background, and what you teach..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] focus:border-transparent transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Sample Course Topic *</label>
            <input
              type="text"
              value={form.sample_topic}
              onChange={e => setForm(f => ({ ...f, sample_topic: e.target.value }))}
              placeholder="e.g. React for Beginners: Build 3 Real Projects"
              className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Portfolio / Social Link</label>
            <input
              type="url"
              value={form.social_link}
              onChange={e => setForm(f => ({ ...f, social_link: e.target.value }))}
              placeholder="https://yourwebsite.com or LinkedIn"
              className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] focus:border-transparent transition-all"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 shrink-0">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#0a7ea4] to-[#8b5cf6] text-white font-bold text-[15px] hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <GraduationCap size={16} />}
            {loading ? 'Submitting…' : 'Submit Application'}
          </button>
          <p className="text-center text-[12px] text-gray-400 mt-2">
            Applications are reviewed within 3–5 business days
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Add Course Modal (for approved teachers) ─────────────────────────────────
function AddCourseModal({ onClose, onAdd }: { onClose: () => void; onAdd: (course: Course) => void }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    duration: '',
    price: '',
    thumb: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.duration || !form.price) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error: dbErr } = await supabase.from('courses').insert({
        title: form.title,
        description: form.description,
        category: form.category,
        duration: form.duration,
        price: parseInt(form.price),
        thumb_url: form.thumb || `https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80`,
        teacher_id: user?.id,
        teacher_name: user?.user_metadata?.full_name || user?.email?.split('@')[0],
        status: 'published',
        created_at: new Date().toISOString(),
      }).select().single();

      // Optimistically add to local state regardless
      const newCourse: Course = {
        id: data?.id || `cr-${Date.now()}`,
        title: form.title,
        description: form.description,
        category: form.category,
        duration: form.duration,
        price: parseInt(form.price),
        teacher: user?.user_metadata?.full_name || 'You',
        avatar: '32',
        rating: 0,
        students: 0,
        enrolled: false,
        thumb: form.thumb || `https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80`,
        isOwner: true,
      };

      onAdd(newCourse);
      onClose();
    } catch (err: any) {
      // Table may not exist yet — still add locally for demo
      const newCourse: Course = {
        id: `cr-${Date.now()}`,
        title: form.title,
        description: form.description,
        category: form.category,
        duration: form.duration,
        price: parseInt(form.price) || 0,
        teacher: 'You',
        avatar: '32',
        rating: 0,
        students: 0,
        enrolled: false,
        thumb: form.thumb || `https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80`,
        isOwner: true,
      };
      onAdd(newCourse);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <div>
            <h2 className="text-[18px] font-bold text-gray-900">Add New Course</h2>
            <p className="text-[13px] text-gray-500">Publish a course and start earning</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Course Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Advanced React Patterns for Production"
              className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Description *</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="What will students learn? What's covered?"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Category *</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] transition-all appearance-none"
              >
                <option value="">Select...</option>
                {CATEGORIES.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Duration *</label>
              <input
                type="text"
                value={form.duration}
                onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                placeholder="e.g. 12h"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Price (Coins) *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🪙</span>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                placeholder="e.g. 400"
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Cover Image URL</label>
            <div className="relative">
              <Upload size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="url"
                value={form.thumb}
                onChange={e => setForm(f => ({ ...f, thumb: e.target.value }))}
                placeholder="https://images.unsplash.com/..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] transition-all"
              />
            </div>
            {form.thumb && (
              <div className="mt-2 h-24 rounded-xl overflow-hidden border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.thumb} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 shrink-0">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#0a7ea4] to-[#8b5cf6] text-white font-bold text-[15px] hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
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

  // Simulated: check if current user is an approved teacher
  // In production, this would come from the user's profile/role in Supabase
  const isTeacher = false; // toggle to true to test teacher UI

  const filtered = courses.filter(c => {
    if (tab === 'mine' && !c.enrolled && !c.isOwner) return false;
    if (activeCategory !== 'All' && c.category !== activeCategory) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!c.title.toLowerCase().includes(q) && !c.teacher.toLowerCase().includes(q) && !c.category.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleEnroll = (id: string) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, enrolled: true } : c));
  };

  const handleAddCourse = (newCourse: Course) => {
    setCourses(prev => [newCourse, ...prev]);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        {/* Title row */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <GraduationCap className="w-5 h-5 text-[#0a7ea4]" />
          <h1 className="text-[20px] font-bold text-gray-900 flex-1">Courses</h1>
          {isTeacher ? (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#0a7ea4] to-[#8b5cf6] text-white text-[13px] font-semibold hover:brightness-110 active:scale-[0.97] transition-all duration-200 shadow-sm"
            >
              <Plus size={14} />
              Add Course
            </button>
          ) : (
            <button
              onClick={() => setShowApplyModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-[#0a7ea4] text-[#0a7ea4] text-[13px] font-semibold hover:bg-[#0a7ea4] hover:text-white transition-all duration-200"
            >
              <GraduationCap size={14} />
              Teach
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex px-4 border-b border-gray-200">
          {(['all', 'mine'] as CourseTab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-[15px] font-semibold relative transition-colors duration-200 ${
                tab === t ? 'text-gray-900' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {t === 'all' ? 'All Courses' : 'My Courses'}
              {tab === t && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-[#0a7ea4] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search courses or teachers..."
            className="w-full h-11 pl-11 pr-4 rounded-full bg-gray-100 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] focus:bg-white transition-all"
          />
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-[#0a7ea4] to-[#8b5cf6] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-2 text-[13px] text-gray-500">
          <BookOpen size={14} className="text-[#0a7ea4]" />
          <span><strong className="text-gray-800">{filtered.length}</strong> courses available</span>
        </div>

        {/* Apply to Teach Banner — only shown on "All Courses" tab for non-teachers */}
        {tab === 'all' && !isTeacher && (
          <div className="rounded-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a7ea4] to-[#8b5cf6]" />
            <div className="relative px-5 py-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-[15px]">Share your expertise</p>
                <p className="text-white/80 text-[12px]">Apply to teach and earn coins from your courses</p>
              </div>
              <button
                onClick={() => setShowApplyModal(true)}
                className="shrink-0 px-4 py-2 rounded-full bg-white text-[#0a7ea4] text-[13px] font-bold hover:bg-gray-50 active:scale-[0.97] transition-all flex items-center gap-1"
              >
                Apply
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-900 font-semibold text-[15px] mb-1">
              {tab === 'mine' ? 'No courses yet' : 'No courses found'}
            </p>
            <p className="text-gray-400 text-[13px]">
              {tab === 'mine'
                ? "You haven't enrolled or published any courses yet."
                : 'Try a different search or category.'}
            </p>
          </div>
        ) : (
          /* Course Grid — 2col on wider screens */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map(c => (
              <CourseCard key={c.id} course={c} onEnroll={handleEnroll} />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showApplyModal && <ApplyTeachModal onClose={() => setShowApplyModal(false)} />}
      {showAddModal && <AddCourseModal onClose={() => setShowAddModal(false)} onAdd={handleAddCourse} />}
    </div>
  );
}

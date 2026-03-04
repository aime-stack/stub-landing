'use client';

import { useState } from 'react';
import { GraduationCap, Search, Star, Users, Clock, Coins, BookOpen } from 'lucide-react';

type CourseTab = 'all' | 'mine';

const MOCK_COURSES = [
  {
    id: 'cr1', title: 'Full Stack Development with Next.js & AI', teacher: 'Kevin Osei', avatar: '12',
    rating: 4.9, students: 14320, duration: '42h', price: 500, enrolled: true,
    thumb: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80',
    category: 'Development',
  },
  {
    id: 'cr2', title: 'Content Creation Masterclass 2024', teacher: 'Selena Martinez', avatar: '47',
    rating: 4.8, students: 28900, duration: '18h', price: 300, enrolled: false,
    thumb: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80',
    category: 'Marketing',
  },
  {
    id: 'cr3', title: 'Professional Photography & Editing', teacher: 'Jake Thornton', avatar: '8',
    rating: 4.7, students: 9400, duration: '24h', price: 400, enrolled: false,
    thumb: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80',
    category: 'Photography',
  },
  {
    id: 'cr4', title: 'Fitness Coaching Certification', teacher: 'Marcus Reid', avatar: '11',
    rating: 4.9, students: 7800, duration: '30h', price: 600, enrolled: true,
    thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
    category: 'Health',
  },
  {
    id: 'cr5', title: 'Skincare & Beauty Business', teacher: 'Amara Diallo', avatar: '45',
    rating: 4.6, students: 5200, duration: '15h', price: 250, enrolled: false,
    thumb: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80',
    category: 'Beauty',
  },
  {
    id: 'cr6', title: 'Food Business & Recipe Monetization', teacher: 'Nadia Wright', avatar: '23',
    rating: 4.8, students: 3900, duration: '20h', price: 350, enrolled: false,
    thumb: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80',
    category: 'Food & Biz',
  },
];

export default function CoursesPage() {
  const [tab, setTab] = useState<CourseTab>('all');
  const [query, setQuery] = useState('');

  const courses = MOCK_COURSES.filter(c => {
    if (tab === 'mine' && !c.enrolled) return false;
    if (query && !c.title.toLowerCase().includes(query.toLowerCase()) && !c.teacher.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 py-3"
        style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--divider)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          <h1 className="text-[20px] font-bold" style={{ color: 'var(--text)', fontSize: '20px' }}>Courses</h1>
          <div className="ml-auto">
            <button
              className="px-4 py-1.5 rounded-full text-[13px] font-semibold text-white"
              style={{ background: 'var(--gradient-primary)' }}
            >
              + Teach
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b" style={{ borderColor: 'var(--border)' }}>
          {(['all', 'mine'] as CourseTab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="pb-2 text-[14px] font-semibold capitalize relative transition-colors"
              style={{ color: tab === t ? 'var(--primary)' : 'var(--text-secondary)' }}
            >
              {t === 'all' ? 'All Courses' : 'My Courses'}
              {tab === t && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full" style={{ background: 'var(--primary)' }} />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search courses or teachers..."
            className="w-full h-11 pl-11 pr-4 rounded-full text-[14px] outline-none"
            style={{ background: 'var(--divider)', color: 'var(--text)' }}
          />
        </div>

        {/* Course Grid */}
        {courses.length === 0 ? (
          <div className="py-16 text-center" style={{ color: 'var(--text-secondary)' }}>
            <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>{tab === 'mine' ? "You haven't enrolled in any courses yet" : 'No courses found'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map(c => (
              <div
                key={c.id}
                className="rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                {/* Thumbnail */}
                <div className="relative h-44 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.thumb} alt={c.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
                  {c.enrolled && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[11px] font-bold text-white" style={{ background: 'var(--highlight)' }}>
                      Enrolled ✓
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[11px] font-bold text-white" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    {c.category}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h2 className="text-[15px] font-bold mb-1 line-clamp-2" style={{ color: 'var(--text)', fontSize: '15px' }}>{c.title}</h2>

                  {/* Teacher */}
                  <div className="flex items-center gap-2 mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://i.pravatar.cc/24?img=${c.avatar}`} alt={c.teacher} className="w-5 h-5 rounded-full" />
                    <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>{c.teacher}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                      <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-current" style={{ color: '#FFD700' }} />{c.rating}</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{c.students.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{c.duration}</span>
                    </div>
                    <div className="flex items-center gap-0.5 font-bold" style={{ color: 'var(--accent)' }}>
                      <span className="text-[13px]">🪙</span>
                      <span className="text-[15px]">{c.price}</span>
                    </div>
                  </div>

                  <button
                    className="mt-3 w-full py-2.5 rounded-full text-[14px] font-bold transition-all duration-200 active:scale-[0.98]"
                    style={c.enrolled
                      ? { background: 'rgba(16,185,129,0.1)', color: 'var(--highlight)', border: '1.5px solid var(--highlight)' }
                      : { background: 'var(--gradient-primary)', color: 'white' }
                    }
                  >
                    {c.enrolled ? '▶ Continue Learning' : 'Enroll Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Briefcase, Star, LayoutDashboard, 
  CheckCircle, XCircle, Clock, Search, Filter,
  TrendingUp, GraduationCap, BarChart3, Bell, Settings,
  LogOut, ExternalLink, ChevronRight
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

type AppType = 'teacher' | 'celebrity' | 'company';

interface BaseApplication {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
  user_id: string;
}

interface TeacherApp extends BaseApplication {
  type: 'teacher';
  full_name: string;
  email: string;
  expertise: string;
}

interface CelebApp extends BaseApplication {
  type: 'celebrity';
  full_name: string;
  handle: string;
  category: string;
}

interface CompanyApp extends BaseApplication {
  type: 'company';
  company_name: string;
  industry: string;
  contact_email: string;
}

type AnyApplication = TeacherApp | CelebApp | CompanyApp;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AppType | 'overview'>('overview');
  const [applications, setApplications] = useState<AnyApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 12840,
    totalEnrollments: 4520,
    totalRevenue: '12.4M',
    pendingApps: 0
  });

  const supabase = createClient();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      // Fetch Teacher Apps
      const { data: teacherData } = await supabase.from('teacher_applications').select('*');
      const teachers = (teacherData || []).map((a: any) => ({ ...a, type: 'teacher' as const }));

      // Fetch Celeb Apps
      let celebs: CelebApp[] = [];
      try {
        const { data: celebData } = await supabase.from('celebrity_applications').select('*');
        celebs = (celebData || []).map((a: any) => ({ ...a, type: 'celebrity' as const }));
      } catch (e) { console.warn('Celeb table might not exist yet'); }

      // Fetch Company Apps
      let companies: CompanyApp[] = [];
      try {
        const { data: companyData } = await supabase.from('company_applications').select('*');
        companies = (companyData || []).map((a: any) => ({ ...a, type: 'company' as const }));
      } catch (e) { console.warn('Company table might not exist yet'); }

      const allApps = [...teachers, ...celebs, ...companies].sort((a, b) => 
        new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()
      );

      setApplications(allApps);
      setStats(prev => ({ ...prev, pendingApps: allApps.filter(a => a.status === 'pending').length }));
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, type: AppType, status: 'approved' | 'rejected') => {
    try {
      const app = applications.find(a => a.id === id);
      if (!app) return;

      const res = await fetch('/api/admin/applications/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          type,
          status,
          userId: app.user_id,
        })
      });

      if (!res.ok) {
         const { error } = await res.json();
         throw new Error(error || 'Failed to update status');
      }

      // Update locally
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status } as AnyApplication : a));
    } catch (error: any) {
      alert(error.message || 'Failed to update status');
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (res.ok) {
        window.location.href = '/admin/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const filteredApps = applications.filter(a => {
    if (activeTab !== 'overview' && a.type !== activeTab) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    const name = (a as any).full_name || (a as any).company_name || '';
    return name.toLowerCase().includes(q) || a.status.includes(q);
  });

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', fontFamily: FONT }}>
      
      {/* Sidebar */}
      <aside style={{ width: 260, background: '#0F172A', color: 'white', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LayoutDashboard size={18} color="white" />
          </div>
          <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.5px' }}>Admin Panel</span>
        </div>

        <nav style={{ flex: 1, padding: '0 16px' }}>
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'teacher', icon: GraduationCap, label: 'Teacher Apps' },
            { id: 'celebrity', icon: Star, label: 'Celebrity Apps' },
            { id: 'company', icon: Briefcase, label: 'Company Apps' },
            { id: 'users', icon: Users, label: 'Users', href: '/admin/users' },
          ].map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            
            const buttonStyle = {
              width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12,
              background: active ? 'rgba(255,255,255,0.08)' : 'transparent', color: active ? 'white' : '#94A3B8',
              border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 14, fontWeight: active ? 700 : 500,
              transition: 'all 0.2s', marginBottom: 4, textAlign: 'left' as const, textDecoration: 'none'
            };

            if (item.href) {
              return (
                <a key={item.id} href={item.href} style={buttonStyle}>
                  <Icon size={18} color={active ? '#0ea5e9' : '#64748B'} />
                  {item.label}
                </a>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                style={buttonStyle}
              >
                <Icon size={18} color={active ? '#0ea5e9' : '#64748B'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: 24, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button 
            onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', color: '#94A3B8', fontSize: 13, cursor: 'pointer' }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>
        
        {/* Top Header */}
        <header style={{ height: 72, background: 'white', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1E293B', margin: 0 }}>
              {activeTab === 'overview' ? 'System Overview' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1) + ' Applications'}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search data..." 
                style={{ height: 38, width: 240, background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 10, paddingLeft: 36, paddingRight: 12, fontSize: 13, outline: 'none' }} 
              />
            </div>
            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer' }}>
              <Bell size={20} color="#64748B" />
              <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#EF4444', borderRadius: '50%', border: '2px solid white' }} />
            </button>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: '#475569' }}>SA</div>
          </div>
        </header>

        <div style={{ padding: 32 }}>

          {activeTab === 'overview' && (
            <>
              {/* Stats Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 32 }}>
                {[
                  { label: 'Total Users', val: stats.totalUsers, icon: Users, color: '#0EA5E9', trend: '+12%' },
                  { label: 'Enrollments', val: stats.totalEnrollments, icon: GraduationCap, color: '#8B5CF6', trend: '+18%' },
                  { label: 'Revenue (Stubcoins)', val: stats.totalRevenue, icon: BarChart3, color: '#F59E0B', trend: '+5%' },
                  { label: 'Pending Apps', val: stats.pendingApps, icon: Clock, color: '#EC4899', trend: '-2' },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} style={{ background: 'white', padding: 24, borderRadius: 20, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: s.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon size={22} color={s.color} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: s.trend.startsWith('+') ? '#10B981' : '#EF4444' }}>{s.trend}</span>
                      </div>
                      <p style={{ margin: '0 0 4px', fontSize: 13, color: '#64748B', fontWeight: 500 }}>{s.label}</p>
                      <h3 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: '#1E293B', letterSpacing: '-0.5px' }}>{s.val}</h3>
                    </div>
                  );
                })}
              </div>

              {/* Chart Mockup */}
              <div style={{ background: 'white', borderRadius: 24, border: '1px solid #E2E8F0', padding: 28, marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#1E293B' }}>Platform Activity</h3>
                    <p style={{ margin: 0, fontSize: 13, color: '#94A3B8' }}>Requests and interactions per month</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ height: 32, padding: '0 12px', borderRadius: 8, border: '1px solid #E2E8F0', background: 'white', fontSize: 12, fontWeight: 600 }}>12M</button>
                    <button style={{ height: 32, padding: '0 12px', borderRadius: 8, background: '#0F172A', color: 'white', fontSize: 12, fontWeight: 600 }}>30D</button>
                  </div>
                </div>
                <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 12, paddingBottom: 10 }}>
                  {[40, 65, 45, 85, 55, 75, 95, 60, 40, 80, 70, 90].map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}%`, background: 'linear-gradient(to top, #0ea5e9, #8b5cf6)', borderRadius: '4px 4px 0 0', opacity: 0.8 }} />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Applications Table */}
          <section style={{ background: 'white', borderRadius: 24, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#1E293B' }}>
                {activeTab === 'overview' ? 'Recent Applications' : 'All Applications'}
              </h3>
              <button style={{ background: 'none', border: 'none', color: '#0EA5E9', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                Export CSV <ChevronRight size={14} />
              </button>
            </div>

            {loading ? (
              <div style={{ padding: 60, textAlign: 'center' }}>
                <Clock size={40} color="#CBD5E1" style={{ margin: '0 auto 16px', animation: 'spin 2s linear infinite' }} />
                <p style={{ color: '#94A3B8' }}>Loading applications...</p>
              </div>
            ) : filteredApps.length === 0 ? (
              <div style={{ padding: 80, textAlign: 'center' }}>
                <Briefcase size={48} color="#E2E8F0" style={{ margin: '0 auto 20px' }} />
                <h4 style={{ margin: '0 0 8px', color: '#64748B' }}>No applications found</h4>
                <p style={{ margin: 0, color: '#94A3B8', fontSize: 14 }}>There are currently no new requests in this category.</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    <th style={{ padding: '16px 28px', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Applicant</th>
                    <th style={{ padding: '16px 20px', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                    <th style={{ padding: '16px 20px', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                    <th style={{ padding: '16px 20px', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                    <th style={{ padding: '16px 28px', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.map((app) => (
                    <tr key={app.id} style={{ borderTop: '1px solid #F1F5F9', transition: 'background 0.2s' }}>
                      <td style={{ padding: '20px 28px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#64748B' }}>
                            {app.type === 'company' ? (app as CompanyApp).company_name[0] : (app as any).full_name[0]}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1E293B' }}>
                               {app.type === 'company' ? (app as CompanyApp).company_name : (app as any).full_name}
                            </p>
                            <p style={{ margin: 0, fontSize: 12, color: '#94A3B8' }}>
                               {app.type === 'company' ? (app as CompanyApp).contact_email : (app as any).email || (app as CelebApp).handle}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '20px 20px' }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#475569', background: '#F1F5F9', padding: '4px 10px', borderRadius: 8, textTransform: 'capitalize' }}>
                           {app.type}
                        </span>
                      </td>
                      <td style={{ padding: '20px 20px', fontSize: 13, color: '#64748B' }}>
                        {new Date(app.applied_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '20px 20px' }}>
                        <span style={{ 
                          fontSize: 11, fontWeight: 800, textTransform: 'uppercase', padding: '4px 10px', borderRadius: 8,
                          background: app.status === 'approved' ? '#DCFCE7' : app.status === 'rejected' ? '#FEE2E2' : '#FEF9C3',
                          color: app.status === 'approved' ? '#166534' : app.status === 'rejected' ? '#991B1B' : '#854D0E'
                        }}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{ padding: '20px 28px', textAlign: 'right' }}>
                        {app.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button 
                              onClick={() => updateStatus(app.id, app.type, 'approved')}
                              style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #E2E8F0', background: 'white', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button 
                              onClick={() => updateStatus(app.id, app.type, 'rejected')}
                              style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #E2E8F0', background: 'white', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                              <XCircle size={18} />
                            </button>
                          </div>
                        ) : (
                          <button style={{ color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <ExternalLink size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
      </main>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

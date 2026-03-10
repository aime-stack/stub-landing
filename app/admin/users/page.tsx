import { createClient } from '@supabase/supabase-js';
import { Users as UsersIcon, Search, Shield, BadgeCheck, Briefcase } from 'lucide-react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// We must use a Server Component with service_role to fetch ALL users
// RLS on the public `users` (profiles) table often restricts viewing everyone.

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

async function fetchUsers() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  // Example: fetch all users (in production, you'd add real pagination here via range())
  const { data: users, count, error } = await supabaseAdmin
    .from('users')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('[AdminUsers] Error fetching users:', error);
    return { users: [], count: 0 };
  }

  return { users, count };
}

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_session')?.value === 'true';

  if (!isAdmin) {
    redirect('/admin/login');
  }

  const { users, count } = await fetchUsers();

  const totalVerified = users?.filter(u => u.is_verified).length || 0;
  const totalCelebs = users?.filter(u => u.is_celebrity).length || 0;
  const totalIndustry = users?.filter(u => u.account_type === 'industry').length || 0;

  return (
    <div style={{ padding: 32, fontFamily: FONT, background: '#F8FAFC', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 12 }}>
            <UsersIcon size={24} color="#0EA5E9" /> User Management
          </h1>
          <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: 14 }}>
            Monitor and manage registered accounts
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 32 }}>
        {[
          { label: 'Total Users (Top 100)', val: count || 0, icon: UsersIcon, color: '#3B82F6' },
          { label: 'Verified Accounts', val: totalVerified, icon: BadgeCheck, color: '#10B981' },
          { label: 'Celebrities', val: totalCelebs, icon: Shield, color: '#8B5CF6' },
          { label: 'Industry Accounts', val: totalIndustry, icon: Briefcase, color: '#F59E0B' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} style={{ background: 'white', padding: 24, borderRadius: 20, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: s.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={22} color={s.color} />
                </div>
              </div>
              <p style={{ margin: '0 0 4px', fontSize: 13, color: '#64748B', fontWeight: 500 }}>{s.label}</p>
              <h3 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: '#1E293B', letterSpacing: '-0.5px' }}>{s.val}</h3>
            </div>
          );
        })}
      </div>

      {/* Users Table */}
      <section style={{ background: 'white', borderRadius: 24, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#1E293B' }}>User Directory</h3>
          <div style={{ position: 'relative' }}>
             <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
             <input 
               placeholder="Search currently limited..." 
               disabled
               style={{ height: 38, width: 240, background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 10, paddingLeft: 36, paddingRight: 12, fontSize: 13, outline: 'none', cursor: 'not-allowed' }} 
             />
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              <th style={{ padding: '16px 28px', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User</th>
              <th style={{ padding: '16px 20px', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account Type</th>
              <th style={{ padding: '16px 20px', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Badges</th>
              <th style={{ padding: '16px 20px', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Metrics</th>
              <th style={{ padding: '16px 28px', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user: any) => (
              <tr key={user.id} style={{ borderTop: '1px solid #F1F5F9', transition: 'background 0.2s' }}>
                
                {/* User Info */}
                <td style={{ padding: '16px 28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontWeight: 700, color: '#64748B' }}>{user.username?.[0]?.toUpperCase() || 'U'}</span>
                      )}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 4 }}>
                         {user.username || 'unknown_user'}
                         {user.is_verified && <BadgeCheck size={14} color="#0EA5E9" />}
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: '#94A3B8' }}>{user.full_name || user.email || 'No Name'}</p>
                    </div>
                  </div>
                </td>

                {/* Account Type */}
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#475569', background: '#F1F5F9', padding: '4px 10px', borderRadius: 8, textTransform: 'capitalize' }}>
                     {user.account_type || 'regular'}
                  </span>
                </td>

                {/* Badges / Roles */}
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {user.is_celebrity && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#6D28D9', background: '#EDE9FE', padding: '2px 8px', borderRadius: 6 }}>Celebrity</span>
                    )}
                    {user.account_type === 'industry' && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#9A3412', background: '#FFEDD5', padding: '2px 8px', borderRadius: 6 }}>Industry</span>
                    )}
                    {user.premium_plan && user.premium_plan !== 'free' && (
                       <span style={{ fontSize: 11, fontWeight: 700, color: '#1D4ED8', background: '#DBEAFE', padding: '2px 8px', borderRadius: 6 }}>Pro</span>
                    )}
                    {!user.is_celebrity && user.account_type !== 'industry' && (!user.premium_plan || user.premium_plan === 'free') && (
                       <span style={{ fontSize: 12, color: '#94A3B8' }}>-</span>
                    )}
                  </div>
                </td>

                {/* Metrics */}
                <td style={{ padding: '16px 20px' }}>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                     <span style={{ fontSize: 12, color: '#475569' }}><strong>{user.followers_count || 0}</strong> followers</span>
                     <span style={{ fontSize: 12, color: '#475569' }}><strong>{user.posts_count || 0}</strong> posts</span>
                   </div>
                </td>

                {/* Joined Date */}
                <td style={{ padding: '16px 28px', textAlign: 'right', fontSize: 13, color: '#64748B' }}>
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {(!users || users.length === 0) && (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>
            No users found.
          </div>
        )}
      </section>

    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCommunity } from '@/services/communities';
import { getCommunityPosts } from '@/services/posts';
import { PostCard } from '@/components/webapp/feed/PostCard';
import { CreatePostForm } from '@/components/webapp/upload/CreatePostForm';
import { ArrowLeft, Loader2, Users, Globe, Lock } from 'lucide-react';
import Image from 'next/image';

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

export default function CommunityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [community, setCommunity] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [commData, postsData] = await Promise.all([
        getCommunity(id),
        getCommunityPosts(id, { limit: 50 }) // Using 50 for now, could add infinite scroll later
      ]);
      setCommunity(commData);
      setPosts(postsData?.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && !id.startsWith('dc') && !id.startsWith('mc')) {
      loadData();
    } else {
      // Mock data bypass - just show empty state for mock communities since they don't exist in DB
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA' }}>
        <Loader2 style={{ width: 40, height: 40, animation: 'spin 1s linear infinite', color: '#0a7ea4' }} />
      </div>
    );
  }

  // Handle mock communities gracefully
  const isMock = id.startsWith('dc') || id.startsWith('mc');
  const displayComm = isMock ? {
    name: 'Sample Community',
    cover_image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80',
    description: 'This is a sample community. Real communities you create will display properly here!',
    is_private: false,
    members_count: 1530
  } : community;

  if (!displayComm) {
    return (
      <div style={{ minHeight: '100vh', padding: 40, textAlign: 'center', background: '#FAFAFA', fontFamily: FONT }}>
        <h2>Community Not Found</h2>
        <button onClick={() => router.back()}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: FONT, paddingBottom: 60 }}>
      {/* Header / Banner */}
      <div style={{ position: 'relative', height: 220, background: 'linear-gradient(135deg,#0a7ea4,#EC4899)' }}>
        {displayComm.cover_image && (
          <Image src={displayComm.cover_image} alt={displayComm.name} fill style={{ objectFit: 'cover', opacity: 0.8 }} unoptimized />
        )}
        
        {/* Back Button */}
        <button onClick={() => router.back()} style={{
          position: 'absolute', top: 20, left: 20, zIndex: 10,
          width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', 
          backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'white', transition: 'background 0.2s'
        }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}>
          <ArrowLeft style={{ width: 20, height: 20 }} />
        </button>

        {/* Content overlaid on banner */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 24px 20px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              {displayComm.is_private ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, color: 'white' }}>
                  <Lock style={{ width: 12, height: 12 }} /> Private
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, color: 'white' }}>
                  <Globe style={{ width: 12, height: 12 }} /> Public
                </span>
              )}
            </div>
            <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800, color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              {displayComm.name}
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.9)', maxWidth: 600, lineHeight: 1.5 }}>
              {displayComm.description}
            </p>
          </div>
          <div style={{ padding: '8px 16px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.15)', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 2, color: 'white' }}>
              <Users style={{ width: 16, height: 16 }} />
              <span style={{ fontSize: 18, fontWeight: 800 }}>{displayComm.members_count || 1}</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Members</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', paddingTop: 20 }}>
        {/* Composer */}
        <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: 20, border: '1px solid #E5E7EB' }}>
          <CreatePostForm communityId={isMock ? undefined : id} />
        </div>

        {/* Posts Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {posts.length > 0 ? (
            posts.map(p => <PostCard key={p.id} post={p} />)
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 16, border: '1px solid #E5E7EB' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Users style={{ width: 32, height: 32, color: '#9CA3AF' }} />
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: '#1A1A1A' }}>No posts yet</h3>
              <p style={{ margin: 0, fontSize: 14, color: '#6B7280' }}>Be the first to share something with the community!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

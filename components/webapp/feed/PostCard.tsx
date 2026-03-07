'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/types';
import {
  MessageCircle,
  Heart,
  Share2,
  MoreHorizontal,
  Bookmark,
  Repeat2,
  BarChart2,
  Star,
  Trash2,
  Zap,
  Flag,
  UserMinus,
} from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';
import { ImageGallery } from '@/components/webapp/ui/ImageGallery';
import { likePost, unlikePost, bookmarkPost, unbookmarkPost, resharePost, sharePostExternally, viewPost } from '@/services/interactions';
import { CommentsModal } from '@/components/webapp/feed/CommentsModal';

interface PostCardProps { post: Post; }

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

const TEXT_BG_STYLES: Record<string, React.CSSProperties> = {
  gradient1: { background: 'linear-gradient(135deg,#0a7ea4,#EC4899)', color: 'white' },
  gradient2: { background: 'linear-gradient(135deg,#EC4899,#F59E0B)', color: 'white' },
  gradient3: { background: 'linear-gradient(135deg,#10B981,#0a7ea4)', color: 'white' },
  gradient4: { background: 'linear-gradient(135deg,#F59E0B,#EC4899)', color: 'white' },
  gradient5: { background: 'linear-gradient(135deg,#0a7ea4,#10B981)', color: 'white' },
};

function RichText({ text, style }: { text: string; style?: React.CSSProperties }) {
  const parts = text.split(/((?:#|@)[\w.]+)/g);
  return (
    <p style={{ fontSize: 15, lineHeight: '1.55', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, ...style }}>
      {parts.map((part, i) =>
        /^[#@][\w.]+$/.test(part)
          ? <span key={i} style={{ color: '#0a7ea4', fontWeight: 600 }}>{part}</span>
          : <span key={i}>{part}</span>
      )}
    </p>
  );
}

function MultiImageGrid({ urls, onImageClick }: { urls: string[], onImageClick: (index: number) => void }) {
  const display = urls.slice(0, 4);
  const extra   = urls.length - 4;

  if (display.length === 1) {
    return (
      <div
        onClick={(e) => { e.stopPropagation(); onImageClick(0); }}
        style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #E5E7EB', marginBottom: 12, cursor: 'zoom-in' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={display[0]} alt="" style={{ width: '100%', maxHeight: 400, objectFit: 'cover', display: 'block', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
      </div>
    );
  }

  if (display.length === 2) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, borderRadius: 16, overflow: 'hidden', border: '1px solid #E5E7EB', marginBottom: 12 }}>
        {display.map((url, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i} src={url} alt=""
            onClick={(e) => { e.stopPropagation(); onImageClick(i); }}
            style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block', cursor: 'zoom-in', transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          />
        ))}
      </div>
    );
  }

  if (display.length === 3) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '200px 200px', gap: 3, borderRadius: 16, overflow: 'hidden', border: '1px solid #E5E7EB', marginBottom: 12 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={display[0]} alt=""
          onClick={(e) => { e.stopPropagation(); onImageClick(0); }}
          style={{ gridRow: '1 / 3', width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'zoom-in', transition: 'opacity 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.9'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        />
        {display.slice(1).map((url, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i} src={url} alt=""
            onClick={(e) => { e.stopPropagation(); onImageClick(i + 1); }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'zoom-in', transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '180px 180px', gap: 3, borderRadius: 16, overflow: 'hidden', border: '1px solid #E5E7EB', marginBottom: 12 }}>
      {display.map((url, i) => (
        <div key={i} style={{ position: 'relative', cursor: 'zoom-in' }} onClick={(e) => { e.stopPropagation(); onImageClick(i); }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url} alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.2s' }}
            onMouseEnter={e => {
              const el = e.currentTarget.nextElementSibling as HTMLElement;
              if (el) el.style.background = 'rgba(0,0,0,0.6)';
              else e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget.nextElementSibling as HTMLElement;
              if (el) el.style.background = 'rgba(0,0,0,0.52)';
              else e.currentTarget.style.opacity = '1';
            }}
          />
          {i === 3 && extra > 0 && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.52)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', pointerEvents: 'none' }}>
              <span style={{ color: 'white', fontWeight: 800, fontSize: 22 }}>+{extra}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function PostCard({ post }: PostCardProps) {
  const [liked,      setLiked]      = useState(!!post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [reposted,   setReposted]   = useState(false);
  const [repostCnt,  setRepostCnt]  = useState(post.shares_count || 0);
  const [saved,      setSaved]      = useState(!!(post as any).is_saved);
  const [heartAnim,  setHeartAnim]  = useState(false);
  const [showMenu,   setShowMenu]   = useState(false);
  const [deleted,    setDeleted]    = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [showComments, setShowComments] = useState(false);
  const postRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!showMenu) return;
    const down = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowMenu(false); };
    const click = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false); };
    document.addEventListener('keydown', down);
    document.addEventListener('mousedown', click);
    return () => { document.removeEventListener('keydown', down); document.removeEventListener('mousedown', click); };
  }, [showMenu]);

  // View tracking
  useEffect(() => {
    if (!postRef.current || deleted) return;
    let timeout: NodeJS.Timeout;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        timeout = setTimeout(() => {
          viewPost(post.id).catch(() => {});
          observer.disconnect(); // Only count view once per render
        }, 2000);
      } else {
        clearTimeout(timeout);
      }
    }, { threshold: 0.6 });
    observer.observe(postRef.current);
    return () => { clearTimeout(timeout); observer.disconnect(); };
  }, [post.id, deleted]);

  if (deleted) return null;

  const isVideo  = post.video_url || post.type === 'video' || post.type === 'reel';
  const hasImage = post.image_url || post.thumbnail_url; // FIX: media_url → image_url (Post type)
  const isTextBg = post.type === 'text' && (post as any).text_bg;

  const handleLike = async () => {
    const next = !liked;
    setLiked(next);
    setLikesCount(c => (next ? c + 1 : Math.max(0, c - 1)));
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 700);
    try {
      if (next) {
        await likePost(post.id);
      } else {
        await unlikePost(post.id);
      }
    } catch (err) {
      // revert on failure
      setLiked(!next);
      setLikesCount(c => (!next ? c + 1 : Math.max(0, c - 1)));
      // optional: surface toast later
      console.error('Failed to toggle like', err);
    }
  };

  const handleRepost = async () => {
    const next = !reposted;
    setReposted(next);
    setRepostCnt(c => (next ? c + 1 : Math.max(0, c - 1)));
    try {
      if (next) {
        await resharePost(post.id);
      } else {
        // No explicit "un-reshare" record; UI-only toggle for now.
      }
    } catch (err) {
      setReposted(!next);
      setRepostCnt(c => (!next ? c + 1 : Math.max(0, c - 1)));
      console.error('Failed to reshare', err);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Stubgram Post by ${displayName}`,
          text: post.content || 'Check out this post on Stubgram!',
          url: `${window.location.origin}/p/${post.id}`
        });
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/p/${post.id}`);
        // optional: toast "link copied!"
      }
      // Log external share to backend
      await sharePostExternally(post.id);
    } catch (err) {
      console.error('Native share aborted or failed', err);
    }
  };

  let dateText = '';
  try { dateText = formatDistanceToNowStrict(new Date(post.created_at)) + ' ago'; }
  catch { dateText = 'Just now'; }

  const user        = post.users;
  const username    = user?.username || 'unknown';
  const displayName = user?.full_name || user?.username || 'Unknown';
  const avatarSrc   = user?.avatar_url;    // FIX: avatar → avatar_url
  const isVerified  = user?.is_verified;   // FIX: isVerified → is_verified
  const isCelebrity = user?.is_celebrity;  // FIX: isCelebrity → is_celebrity
  const textBg      = isTextBg ? TEXT_BG_STYLES[(post as any).text_bg] : undefined;

  return (
    <article
      ref={postRef}
      className="flex px-4 pt-4 pb-2 cursor-pointer transition-colors duration-150"
      style={{ borderBottom: '1px solid var(--divider)' }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,250,251,0.7)'}
      onMouseLeave={e => e.currentTarget.style.background = ''}
    >
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id={`vbg-${post.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop stopColor="#0a7ea4" offset="0%" />
            <stop stopColor="#EC4899" offset="100%" />
          </linearGradient>
        </defs>
      </svg>

      <Link href={`/profile/${username}`} className="shrink-0 mr-3">
        <div className="w-10 h-10 rounded-full overflow-hidden relative" style={{ background: 'var(--gradient-primary)' }}>
          {avatarSrc ? (
            <Image src={avatarSrc} alt={username} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-white text-sm">
              {username[0]?.toUpperCase() || 'U'}
            </div>
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1 mb-0.5">
          <div className="flex items-center gap-1 flex-wrap min-w-0">
            <Link href={`/profile/${username}`} className="flex items-center gap-1 min-w-0">
              <span className="font-bold text-[15px] hover:underline truncate" style={{ color: 'var(--text)' }}>
                {displayName}
              </span>
              {isVerified && (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <circle cx="12" cy="12" r="10" fill={`url(#vbg-${post.id})`} />
                  <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {isCelebrity && (
                <Star className="w-3.5 h-3.5 shrink-0 fill-current" style={{ color: '#FF69B4' }} />
              )}
            </Link>
            <span className="text-[14px] truncate hidden sm:block" style={{ color: 'var(--text-secondary)' }}>@{username}</span>
            <span style={{ color: 'var(--border)' }}>·</span>
            <span className="text-[13px] whitespace-nowrap hover:underline cursor-pointer" style={{ color: 'var(--text-secondary)' }}>{dateText}</span>
          </div>

          <div ref={menuRef} style={{ position: 'relative', flexShrink: 0 }}>
            <button
              onClick={e => { e.stopPropagation(); setShowMenu(m => !m); }}
              style={{ flexShrink: 0, marginLeft: 8, padding: 8, borderRadius: '50%', border: 'none', cursor: 'pointer', background: showMenu ? 'rgba(10,126,164,0.12)' : 'rgba(0,0,0,0.05)', color: showMenu ? 'var(--primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(10,126,164,0.12)'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.transform = 'scale(1.08)'; }}
              onMouseLeave={e => { if (!showMenu) { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = 'var(--text-secondary)'; } e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <MoreHorizontal size={20} />
            </button>

            {showMenu && (
              <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: 34, right: 0, zIndex: 100, background: 'white', borderRadius: 16, border: '1px solid #E5E7EB', boxShadow: '0 8px 32px rgba(0,0,0,0.13)', minWidth: 200, overflow: 'hidden', animation: 'fadeIn 0.12s ease' }}>
                <Link href="/advertising" onClick={() => setShowMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', textDecoration: 'none', color: '#111827', transition: 'background 0.12s', fontFamily: `'Inter',-apple-system,sans-serif`, fontSize: 14, fontWeight: 600 }} onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <span style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#0a7ea4,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Zap size={15} color="white" fill="white" /></span>
                  Boost Post
                  <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: '#0a7ea4', background: 'rgba(10,126,164,0.10)', padding: '2px 8px', borderRadius: 999 }}>Ad</span>
                </Link>
                <div style={{ height: 1, background: '#F3F4F6', margin: '0 12px' }} />
                <button onClick={() => setShowMenu(false)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: `'Inter',-apple-system,sans-serif`, fontSize: 14, fontWeight: 600, color: '#111827', transition: 'background 0.12s', textAlign: 'left' }} onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <span style={{ width: 32, height: 32, borderRadius: 10, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><UserMinus size={15} color="#6B7280" /></span>
                  Unfollow
                </button>
                <button onClick={() => setShowMenu(false)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: `'Inter',-apple-system,sans-serif`, fontSize: 14, fontWeight: 600, color: '#111827', transition: 'background 0.12s', textAlign: 'left' }} onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <span style={{ width: 32, height: 32, borderRadius: 10, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Flag size={15} color="#6B7280" /></span>
                  Report Post
                </button>
                <div style={{ height: 1, background: '#F3F4F6', margin: '0 12px' }} />
                <button onClick={() => { setShowMenu(false); setDeleted(true); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: `'Inter',-apple-system,sans-serif`, fontSize: 14, fontWeight: 700, color: '#EF4444', transition: 'background 0.12s', textAlign: 'left' }} onMouseEnter={e => (e.currentTarget.style.background = '#FEF2F2')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <span style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(239,68,68,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Trash2 size={15} color="#EF4444" /></span>
                  Delete Post
                </button>
              </div>
            )}
          </div>
        </div>

        {post.content && !isTextBg && (
          <div className="mb-3">
            <RichText text={post.content} style={{ color: 'var(--text)' as string }} />
          </div>
        )}

        {isTextBg && post.content && (
          <div className="rounded-2xl p-6 mb-3 flex items-center justify-center min-h-[140px] text-center" style={textBg}>
            <p className="text-[18px] font-semibold leading-relaxed">{post.content}</p>
          </div>
        )}

        {post.media_urls && post.media_urls.length > 0 && (
          <MultiImageGrid urls={post.media_urls} onImageClick={(idx) => setActiveImageIndex(idx)} />
        )}

        {!post.media_urls && (hasImage || isVideo) && (
          <div
            className="rounded-2xl overflow-hidden mb-3 max-h-[512px] flex justify-center"
            style={{ border: '1px solid var(--border)', background: 'var(--card)', cursor: !isVideo ? 'zoom-in' : 'default' }}
            onClick={(e) => {
              if (!isVideo && (post.image_url || post.thumbnail_url)) { // FIX: media_url → image_url
                e.stopPropagation();
                setActiveImageIndex(0);
              }
            }}
          >
            {isVideo && post.video_url ? (
              <video src={post.video_url} controls className="w-full max-h-[512px] object-cover" onClick={e => e.stopPropagation()} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.image_url || post.thumbnail_url || ''} // FIX: media_url → image_url
                alt=""
                className="w-full h-auto object-cover max-h-[512px]"
              />
            )}
          </div>
        )}

        {(post as any).coinReward && (
          <div className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-xl mb-2 w-fit" style={{ background: 'linear-gradient(135deg,#FFD700,#F59E0B)', color: 'white' }}>
            <span>🪙</span>
            +{(post as any).coinReward} Snap Coins earned
          </div>
        )}

        <div className="flex items-center justify-between max-w-[380px] -ml-2 mt-1">
          <ActionButton icon={<MessageCircle size={18} />} label={formatCount(post.comments_count || 0)} hoverColor="var(--primary)" hoverBg="rgba(10,126,164,0.10)" onClick={() => setShowComments(true)} />
          <ActionButton icon={<Repeat2 size={18} />} label={formatCount(repostCnt)} active={reposted} activeColor="var(--repost-green, #00BA7C)" activeBg="rgba(0,186,124,0.10)" hoverColor="var(--repost-green, #00BA7C)" hoverBg="rgba(0,186,124,0.10)" onClick={handleRepost} />
          <ActionButton icon={<Heart size={18} className={`${liked ? 'fill-current' : ''} ${heartAnim ? 'animate-heart' : ''}`} />} label={formatCount(likesCount)} active={liked} activeColor="#FF3B30" activeBg="rgba(255,59,48,0.10)" hoverColor="#FF3B30" hoverBg="rgba(255,59,48,0.10)" onClick={handleLike} />
          <ActionButton icon={<BarChart2 size={18} />} label={formatCount((post as any).views_count || Math.floor(likesCount * 8.3))} hoverColor="var(--primary)" hoverBg="rgba(10,126,164,0.10)" />
          <ActionButton
            icon={<Bookmark size={18} className={saved ? 'fill-current' : ''} />}
            active={saved}
            activeColor="var(--primary)"
            activeBg="rgba(10,126,164,0.10)"
            hoverColor="var(--primary)"
            hoverBg="rgba(10,126,164,0.10)"
            onClick={async () => {
              const next = !saved;
              setSaved(next);
              try {
                if (next) {
                  await bookmarkPost(post.id);
                } else {
                  await unbookmarkPost(post.id);
                }
              } catch (err) {
                setSaved(!next);
                console.error('Failed to toggle bookmark', err);
              }
            }}
          />
          <ActionButton icon={<Share2 size={18} />} hoverColor="var(--primary)" hoverBg="rgba(10,126,164,0.10)" onClick={handleShare} />
        </div>
      </div>

      {showComments && <CommentsModal postId={post.id} onClose={() => setShowComments(false)} />}

      {/* Fullscreen Image Viewers */}
      {typeof activeImageIndex === 'number' && post.media_urls && post.media_urls.length > 0 && (
        <ImageGallery
          images={post.media_urls}
          initialIndex={activeImageIndex}
          onClose={() => setActiveImageIndex(null)}
        />
      )}
      {typeof activeImageIndex === 'number' && !post.media_urls && (post.image_url || post.thumbnail_url) && (
        <ImageGallery
          images={[post.image_url || post.thumbnail_url || '']}
          initialIndex={0}
          onClose={() => setActiveImageIndex(null)}
        />
      )}
    </article>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label?: string;
  active?: boolean;
  activeColor?: string;
  activeBg?: string;
  hoverColor?: string;
  hoverBg?: string;
  onClick?: () => void;
}

function ActionButton({ icon, label, active, activeColor, activeBg, hoverColor, hoverBg, onClick }: ActionButtonProps) {
  const baseColor = active ? activeColor : 'var(--text-secondary)';
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 transition-all duration-200 cursor-pointer"
      style={{ color: baseColor }}
      onMouseEnter={e => {
        e.currentTarget.style.color = hoverColor || 'var(--primary)';
        const pill = e.currentTarget.querySelector('.action-pill') as HTMLElement | null;
        if (pill) pill.style.background = hoverBg || 'rgba(10,126,164,0.10)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = baseColor || 'var(--text-secondary)';
        const pill = e.currentTarget.querySelector('.action-pill') as HTMLElement | null;
        if (pill) pill.style.background = active ? (activeBg || '') : '';
      }}
    >
      <span className="action-pill p-2 rounded-full transition-all duration-200" style={active ? { background: activeBg } : {}}>
        {icon}
      </span>
      {label !== undefined && <span className="text-[13px] tabular-nums">{label}</span>}
    </button>
  );
}
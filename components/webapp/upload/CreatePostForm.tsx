'use client';

import { useState, useRef } from 'react';
import { uploadMedia, ALLOWED_MIME_TYPES } from '@/services/upload';
import {
  createStatusPost,
  createImagePost,
  createVideoPost,
  createReel,
} from '@/services/posts';
import { Image as ImageIcon, Video, Loader2, Smile, MapPin, BarChart2, Type, X, Newspaper, Search as SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

const TEXT_BG_OPTIONS = [
  { id: 'none',      label: 'None',  style: { background: 'transparent' } },
  { id: 'primary',   label: 'Blue',  style: { background: 'linear-gradient(135deg,#0a7ea4,#10B981)' } },
  { id: 'secondary', label: 'Pink',  style: { background: 'linear-gradient(135deg,#EC4899,#F59E0B)' } },
  { id: 'warm',      label: 'Warm',  style: { background: 'linear-gradient(135deg,#F59E0B,#EC4899)' } },
  { id: 'dark',      label: 'Dark',  style: { background: 'linear-gradient(135deg,#1A1A1A,#374151)' } },
  { id: 'green',     label: 'Green', style: { background: 'linear-gradient(135deg,#10B981,#0a7ea4)' } },
];

export function CreatePostForm({ user, communityId, onPostCreated }: { user?: { username?: string, avatar_url?: string } | null, communityId?: string, onPostCreated?: () => void }) {
  const [content,    setContent]    = useState('');
  const [files,      setFiles]      = useState<File[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [textBg,     setTextBg]     = useState('none');
  const [showBgPick, setShowBgPick] = useState(false);
  const [showNews,   setShowNews]   = useState(false);
  const [newsSearch, setNewsSearch] = useState('');
  const [newsResults, setNewsResults] = useState<any[]>([]);
  const [searching,  setSearching]  = useState(false);
  const [linkMeta,   setLinkMeta]   = useState<any>(null);
  const [fetchingMeta, setFetchingMeta] = useState(false);
  
  const router     = useRouter();
  const fileRef    = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const metaTimeout = useRef<NodeJS.Timeout | null>(null);

  // Link Preview Logic
  const detectLink = (text: string) => {
    const urlMatch = text.match(/https?:\/\/[^\s]+/);
    if (!urlMatch) {
      setLinkMeta(null);
      return;
    }
    const url = urlMatch[0];
    if (linkMeta?.url === url || linkMeta) return;

    if (metaTimeout.current) clearTimeout(metaTimeout.current);
    metaTimeout.current = setTimeout(async () => {
      setFetchingMeta(true);
      try {
        const res = await fetch('/api/news/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });
        if (res.ok) {
          const data = await res.json();
          setLinkMeta({ 
            ...data, 
            url, 
            image: data.image_url, // Map DB field to component prop
            source: data.source || data.siteName 
          });
        }
      } catch (e) {
        console.error('Meta fetch error:', e);
      } finally {
        setFetchingMeta(false);
      }
    }, 1000);
  };

  const handleContentChange = (val: string) => {
    setContent(val);
    detectLink(val);
  };

  const handleNewsSearch = async () => {
    if (!newsSearch.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/news/search?q=${encodeURIComponent(newsSearch)}`);
      const data = await res.json();
      setNewsResults(data.articles || []);
    } catch (e) {
      console.error('News search error:', e);
    } finally {
      setSearching(false);
    }
  };

  const charsLeft = 280 - content.length;
  const isEmpty   = !content.trim() && files.length === 0;
  const activeBg  = TEXT_BG_OPTIONS.find(o => o.id === textBg);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    
    // Check types & size limit (10MB total)
    const valid = selected.every(f => ALLOWED_MIME_TYPES.includes(f.type));
    if (!valid) { setError('One or more invalid file types.'); return; }
    
    if (files.length + selected.length > 4) { setError('Maximum 4 media files allowed.'); return; }
    
    const totalSize = selected.reduce((acc, f) => acc + f.size, 0);
    if (totalSize > 10 * 1024 * 1024) { setError('Files exceed 10 MB total size limit.'); return; }

    // If uploading video, restrict to 1 video
    const hasVideo = files.some(f => f.type.startsWith('video/')) || selected.some(f => f.type.startsWith('video/'));
    if (hasVideo && (files.length > 0 || selected.length > 1)) {
      setError('You can only post 1 video at a time.'); return;
    }
    
    setFiles(prev => [...prev, ...selected]);
    setError(null);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmpty) return;
    setLoading(true);
    setError(null);
    try {
      let mediaUrls: string[] = [];
      let isVideo = false;
      
      if (files.length > 0) {
        mediaUrls = await Promise.all(files.map(f => uploadMedia(f, 'posts')));
        isVideo = files[0].type.startsWith('video/');
      }
      
      const trimmed = content.trim() || undefined;

      // Decide which helper to use based on media presence/type.
      let result;
      if (mediaUrls.length === 0) {
        result = await createStatusPost(
          trimmed ?? '', 
          communityId, 
          textBg !== 'none' ? textBg : undefined,
          linkMeta?.id // Pass the news_link_id here
        );
      } else if (isVideo) {
        // For now treat all videos as regular video posts; reels can have their own entry point.
        result = await createVideoPost({
          content: trimmed,
          videoUrl: mediaUrls[0],
          communityId
        });
      } else {
        result = await createImagePost({
          content: trimmed,
          imageUrls: mediaUrls, // Send full array to backend
          communityId
        });
      }
      
      if (result && result.error) {
        setError(
          `DB Error: ${result.error}` + 
          (result.details ? ` (Details: ${result.details})` : '') + 
          (result.hint ? ` (Hint: ${result.hint})` : '')
        );
        setLoading(false);
        return;
      }
      
      setContent('');
      setFiles([]);
      setTextBg('none');
      if (fileRef.current) fileRef.current.value = '';
      if (onPostCreated) {
        onPostCreated();
      } else {
        router.refresh(); // Fallback for Server Component pages
      }
    } catch (err: any) {
      setError(err.message ?? 'Failed to post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: '16px 20px',
        borderBottom: '1px solid #E5E7EB',
        background: 'white',
      }}
    >
      <div style={{ display: 'flex', gap: 12 }}>

        <div style={{ flexShrink: 0 }}>
          <div
            style={{
              width: 42, height: 42, borderRadius: '50%', overflow: 'hidden',
              background: 'linear-gradient(135deg,#0a7ea4,#EC4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginTop: 2,
            }}
          >
            {user?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar_url} alt="you" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </span>
            )}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Textarea — shows gradient bg preview when a bg is chosen */}
          <div
            style={{
              borderRadius: textBg !== 'none' ? 16 : 0,
              padding: textBg !== 'none' ? '20px 16px' : 0,
              marginBottom: textBg !== 'none' ? 12 : 0,
              ...(textBg !== 'none' ? activeBg?.style : {}),
              transition: 'all 0.3s ease',
            }}
          >
            <textarea
              ref={textareaRef}
              value={content}
              onChange={e => handleContentChange(e.target.value)}
              placeholder="What's happening?"
              maxLength={280}
              rows={3}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                resize: 'none',
                fontFamily: FONT,
                fontSize: textBg !== 'none' ? 18 : 17,
                fontWeight: textBg !== 'none' ? 600 : 400,
                color: textBg !== 'none' ? 'white' : '#1A1A1A',
                lineHeight: 1.5,
                paddingTop: 4,
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Link Preview within composer */}
          {linkMeta && (
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <div style={{ opacity: fetchingMeta ? 0.6 : 1 }}>
                <div style={{
                  borderRadius: 12, border: '1px solid #E5E7EB', overflow: 'hidden',
                  background: '#F9FAFB', display: 'flex', gap: 12, padding: 8
                }}>
                  {linkMeta.image && (
                    <img 
                      src={linkMeta.image} 
                      alt="" 
                      style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover' }} 
                      onError={(e) => {
                        const parent = e.currentTarget.parentElement;
                        if (parent) parent.style.display = 'none';
                      }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{linkMeta.title}</div>
                    <div style={{ fontSize: 12, color: '#6B7280', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{linkMeta.description}</div>
                  </div>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setLinkMeta(null)}
                style={{ position: 'absolute', top: -8, right: -8, width: 22, height: 22, borderRadius: '50%', background: '#1A1A1A', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
              >
                <X style={{ width: 12, height: 12 }} />
              </button>
            </div>
          )}

          {/* Text-bg colour picker */}
          {showBgPick && (
            <div
              style={{
                display: 'flex', gap: 8, flexWrap: 'wrap',
                padding: '10px 0', marginBottom: 8,
              }}
            >
              {TEXT_BG_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTextBg(opt.id)}
                  title={opt.label}
                  style={{
                    width: 32, height: 32, borderRadius: '50%',
                    border: textBg === opt.id ? '3px solid #0a7ea4' : '2px solid #E5E7EB',
                    cursor: 'pointer',
                    flexShrink: 0,
                    ...(opt.id === 'none' ? { background: '#F3F4F6' } : opt.style),
                    boxSizing: 'border-box',
                    transition: 'border 0.15s',
                  }}
                />
              ))}
            </div>
          )}

          {/* Media previews */}
          {files.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8, marginBottom: 12 }}>
              {files.map((f, i) => (
                <div key={i} style={{ position: 'relative', height: 130, borderRadius: 12, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                  {f.type.startsWith('image/') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={URL.createObjectURL(f)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <video src={URL.createObjectURL(f)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    style={{
                      position: 'absolute', top: 6, right: 6,
                      width: 24, height: 24, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.6)', border: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: 'white',
                    }}
                  >
                    <X style={{ width: 13, height: 13 }} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && (
            <p style={{ fontFamily: FONT, fontSize: 13, color: '#EF4444', margin: '0 0 8px' }}>{error}</p>
          )}

          {/* Bottom bar */}
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              paddingTop: 10, borderTop: '1px solid #F3F4F6',
            }}
          >
            {/* Toolbar icons */}
            <div style={{ display: 'flex', gap: 2 }}>
              {[
                { icon: <ImageIcon  style={{ width: 19, height: 19 }} />, title: 'Photo',      onClick: () => fileRef.current?.click() },
                { icon: <Video      style={{ width: 19, height: 19 }} />, title: 'Video',      onClick: () => fileRef.current?.click() },
                { icon: <Newspaper  style={{ width: 19, height: 19 }} />, title: 'News',       onClick: () => setShowNews(true) },
                { icon: <Type       style={{ width: 19, height: 19 }} />, title: 'Text Style', onClick: () => setShowBgPick(p => !p) },
                { icon: <BarChart2  style={{ width: 19, height: 19 }} />, title: 'Poll',        onClick: () => {} },
                { icon: <Smile      style={{ width: 19, height: 19 }} />, title: 'Emoji',      onClick: () => {} },
                { icon: <MapPin     style={{ width: 19, height: 19 }} />, title: 'Location',   onClick: () => {} },
              ].map(({ icon, title, onClick }) => (
                <button
                  key={title}
                  type="button"
                  title={title}
                  onClick={onClick}
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    border: 'none', background: 'transparent', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: title === 'Text Style' && showBgPick ? '#0a7ea4' : '#0a7ea4',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,126,164,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {icon}
                </button>
              ))}
              <input type="file" ref={fileRef} hidden multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime" onChange={handleFiles} />
            </div>

            {/* Char count + submit */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {content.length > 0 && (
                <span style={{
                  fontFamily: FONT, fontSize: 13,
                  color: charsLeft < 20 ? '#EF4444' : '#9CA3AF',
                  tabularNums: true,
                } as React.CSSProperties}>
                  {charsLeft}
                </span>
              )}
              <button
                type="submit"
                disabled={loading || isEmpty}
                style={{
                  height: 40,
                  paddingLeft: 22, paddingRight: 22,
                  borderRadius: 999,
                  border: 'none',
                  cursor: loading || isEmpty ? 'not-allowed' : 'pointer',
                  background: loading || isEmpty
                    ? '#E5E7EB'
                    : 'linear-gradient(135deg,#0a7ea4,#EC4899)',
                  color: loading || isEmpty ? '#9CA3AF' : 'white',
                  fontFamily: FONT,
                  fontSize: 15,
                  fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'all 0.15s',
                  boxShadow: loading || isEmpty ? 'none' : '0 2px 8px rgba(10,126,164,0.3)',
                }}
              >
                {loading && <Loader2 style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} />}
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* News Search Modal */}
      {showNews && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 500, maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '20px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Newspaper style={{ width: 20, height: 20, color: '#0a7ea4' }} />
                <span style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700 }}>Search News</span>
              </div>
              <button onClick={() => setShowNews(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><X /></button>
            </div>

            <div style={{ padding: 16 }}>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  value={newsSearch}
                  onChange={e => setNewsSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleNewsSearch()}
                  placeholder="What news are you looking for?"
                  style={{ width: '100%', height: 44, paddingLeft: 40, paddingRight: 12, borderRadius: 12, border: '1.5px solid #E5E7EB', outline: 'none', fontFamily: FONT }}
                />
                <SearchIcon style={{ position: 'absolute', left: 12, top: 12, width: 20, height: 20, color: '#9CA3AF' }} />
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px' }}>
              {searching ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Loader2 className="animate-spin" /></div>
              ) : newsResults.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {newsResults.map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => {
                        handleContentChange(content + (content ? '\n' : '') + item.url);
                        setShowNews(false);
                        setNewsResults([]);
                        setNewsSearch('');
                      }}
                      style={{ padding: 12, borderRadius: 12, border: '1px solid #F3F4F6', cursor: 'pointer', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ fontSize: 11, color: '#0a7ea4', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{item.source.name}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.4 }}>{item.title}</div>
                    </div>
                  ))}
                </div>
              ) : newsSearch && !searching ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>No results found.</div>
              ) : (
                <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>Search for topics to share latest news.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

'use client';

import { useState, useRef } from 'react';
import { uploadMedia, ALLOWED_MIME_TYPES } from '@/services/upload';
import { createPost } from '@/services/posts';
import { Image as ImageIcon, Video, Loader2, Smile, MapPin, ChartBar } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CreatePostForm() {
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!ALLOWED_MIME_TYPES.includes(selected.type)) { setError(`Invalid file type.`); return; }
    if (selected.size > 10 * 1024 * 1024) { setError('File exceeds 10MB limit.'); return; }
    setFile(selected);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !file) return;
    setLoading(true);
    setError(null);
    try {
      let mediaUrl = undefined;
      let type: 'text' | 'image' | 'video' = 'text';
      if (file) {
        mediaUrl = await uploadMedia(file, 'posts');
        type = file.type.startsWith('video/') ? 'video' : 'image';
      }
      await createPost({ content: content.trim() || undefined, type, mediaUrl });
      setContent('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 py-3 border-b border-gray-200">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0a7ea4]/30 via-[#8b5cf6]/30 to-[#ec4899]/30 border border-gray-100 shrink-0 mt-1" />

        <div className="flex-1 min-w-0">
          {/* Textarea */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="w-full bg-transparent resize-none outline-none text-[19px] placeholder-gray-400 text-gray-900 min-h-[56px] leading-normal pt-1"
            maxLength={280}
          />

          {/* Media preview */}
          {file && (
            <div className="relative mb-3 inline-block mt-2">
              {file.type.startsWith('image/') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={URL.createObjectURL(file)} alt="Preview" className="max-h-40 rounded-2xl border border-gray-200" />
              ) : (
                <video src={URL.createObjectURL(file)} className="max-h-40 rounded-2xl border border-gray-200" />
              )}
              <button
                type="button"
                onClick={() => setFile(null)}
                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs transition-colors"
              >✕</button>
            </div>
          )}

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          {/* Bottom bar */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-1">
            <div className="flex gap-0 -ml-1">
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="p-2 text-[#0a7ea4] hover:bg-[#0a7ea4]/10 rounded-full transition-all duration-200" title="Photo">
                <ImageIcon className="w-5 h-5" />
              </button>
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="p-2 text-[#0a7ea4] hover:bg-[#0a7ea4]/10 rounded-full transition-all duration-200" title="Video">
                <Video className="w-5 h-5" />
              </button>
              <button type="button"
                className="p-2 text-[#0a7ea4] hover:bg-[#0a7ea4]/10 rounded-full transition-all duration-200" title="Poll">
                <ChartBar className="w-5 h-5" />
              </button>
              <button type="button"
                className="p-2 text-[#0a7ea4] hover:bg-[#0a7ea4]/10 rounded-full transition-all duration-200" title="Emoji">
                <Smile className="w-5 h-5" />
              </button>
              <button type="button"
                className="p-2 text-[#0a7ea4] hover:bg-[#0a7ea4]/10 rounded-full transition-all duration-200" title="Location">
                <MapPin className="w-5 h-5" />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange}
                accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" className="hidden" />
            </div>

            <div className="flex items-center gap-3">
              {/* Character count */}
              {content.length > 0 && (
                <span className={`text-sm tabular-nums ${content.length > 260 ? 'text-red-500' : 'text-gray-400'}`}>
                  {280 - content.length}
                </span>
              )}
              <button
                type="submit"
                disabled={loading || (!content.trim() && !file)}
                className="px-5 h-9 rounded-full bg-gradient-to-r from-[#0a7ea4] to-[#8b5cf6] text-white text-[15px] font-bold hover:brightness-110 active:scale-[0.98] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-200"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

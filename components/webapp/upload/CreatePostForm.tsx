'use client';

import { useState, useRef } from 'react';
import { uploadMedia, ALLOWED_MIME_TYPES } from '@/services/upload';
import { createPost } from '@/services/posts';
import { Image as ImageIcon, Video, Loader2 } from 'lucide-react';
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

    if (!ALLOWED_MIME_TYPES.includes(selected.type)) {
      setError(`Invalid file type. Allowed: JPG, PNG, WEBP, MP4`);
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      setError('File exceeds 10MB limit.');
      return;
    }

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

      await createPost({
        content: content.trim() || undefined,
        type,
        mediaUrl,
      });

      setContent('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // Refresh feed without full page reload
      router.refresh();
      
    } catch (err: any) {
      setError(err.message || 'Failed to post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-b border-gray-200 p-4 bg-white">
      <div className="flex gap-3">
        {/* Placeholder Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0a7ea4]/20 via-[#8b5cf6]/20 to-[#ec4899]/20 border border-white/5 shrink-0" />
        
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-transparent resize-none outline-none text-[15px] placeholder-gray-400 text-gray-900 min-h-[50px]"
            maxLength={2000}
          />
          
          {file && (
            <div className="relative mb-3 inline-block">
              {file.type.startsWith('image/') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={URL.createObjectURL(file)} alt="Preview" className="max-h-40 rounded-xl" />
              ) : (
                <video src={URL.createObjectURL(file)} className="max-h-40 rounded-xl" />
              )}
              <button
                type="button"
                onClick={() => setFile(null)}
                className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs"
              >
                ✕
              </button>
            </div>
          )}

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-2">
            <div className="flex gap-1 border-gray-200">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-[#0a7ea4] hover:bg-[#0a7ea4]/10 rounded-full transition-colors flex items-center justify-center group"
                title="Photo"
              >
                <ImageIcon className="w-5 h-5 group-hover:text-[#ec4899] transition-colors" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-[#0a7ea4] hover:bg-[#0a7ea4]/10 rounded-full transition-colors flex items-center justify-center group"
                title="Video"
              >
                <Video className="w-5 h-5 group-hover:text-[#8b5cf6] transition-colors" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                className="hidden" 
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || (!content.trim() && !file)}
              className="bg-gradient-to-r from-[#0a7ea4] to-[#ec4899] text-white px-6 py-1.5 font-bold rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_15px_rgba(236,72,153,0.2)]"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Post
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

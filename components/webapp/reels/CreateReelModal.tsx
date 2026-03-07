'use client';

import { useState, useRef } from 'react';
import { uploadMedia } from '@/services/upload';
import { createReel } from '@/services/posts';
import { Video, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CreateReelModalProps {
  onClose: () => void;
}

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

export function CreateReelModal({ onClose }: CreateReelModalProps) {
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const isEmpty = !file; // A Reel must have a video

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    
    // Only allow videos
    if (!f.type.startsWith('video/')) {
      setError('Please select a video file.');
      return;
    }
    
    if (f.size > 50 * 1024 * 1024) { 
      setError('File exceeds 50 MB.'); 
      return; 
    }
    
    setFile(f);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmpty) return;
    setLoading(true);
    setError(null);
    try {
      const mediaUrl = await uploadMedia(file, 'posts');
      const trimmed = content.trim() || undefined;

      await createReel({
        content: trimmed,
        videoUrl: mediaUrl,
      });

      setContent('');
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
      
      router.refresh();
      onClose(); // Close modal on success
    } catch (err: any) {
      setError(err.message ?? 'Failed to create reel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6" style={{ fontFamily: FONT }}>
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="w-8" />
          <h2 className="text-[17px] font-bold text-gray-900">Create Reel</h2>
          <button 
            type="button" 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Video Preview / Upload area */}
          {!file ? (
            <div 
              onClick={() => fileRef.current?.click()}
              className="w-full h-64 sm:h-80 bg-gray-50 border-2 border-dashed border-gray-200 hover:border-[#0a7ea4] hover:bg-[#0a7ea4]/5 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all mb-4 group text-center px-6"
            >
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-[#0a7ea4]">
                <Video className="w-6 h-6" />
              </div>
              <p className="font-semibold text-gray-700 text-[15px]">Upload a video</p>
              <p className="text-sm text-gray-500 mt-1">MP4 or WebM up to 50MB</p>
            </div>
          ) : (
            <div className="w-full mb-4 relative rounded-xl overflow-hidden bg-black flex items-center justify-center" style={{ minHeight: 200, maxHeight: 400 }}>
              <video 
                src={URL.createObjectURL(file)} 
                controls 
                className="max-w-full max-h-[400px] object-contain"
              />
              <button
                type="button"
                onClick={() => setFile(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <input 
            ref={fileRef} 
            type="file" 
            onChange={handleFile}
            accept="video/mp4,video/webm" 
            className="hidden" 
          />

          {/* Caption input */}
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 focus-within:border-[#0a7ea4] focus-within:bg-white transition-colors">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write a caption (optional)..."
              maxLength={2000}
              rows={3}
              className="w-full bg-transparent border-none outline-none resize-none text-[15px] text-gray-900 placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading || isEmpty}
            className="h-10 px-6 rounded-full font-bold text-[15px] text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: loading || isEmpty ? '#9CA3AF' : 'linear-gradient(135deg,#0a7ea4,#EC4899)',
              boxShadow: loading || isEmpty ? 'none' : '0 4px 12px rgba(10,126,164,0.3)',
            }}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Share Reel'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

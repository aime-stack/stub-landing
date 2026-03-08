'use client';

import { useState, useRef } from 'react';
import { X, Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import { uploadMedia, ALLOWED_MIME_TYPES } from '@/services/upload';
import { createStory } from '@/services/stories';
import { useRouter } from 'next/navigation';

export function CreateStoryModal({ onClose, currentUser }: { onClose: () => void; currentUser: any }) {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!ALLOWED_MIME_TYPES.includes(selected.type)) {
      setError('Invalid file type.');
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      setError('File exceeds 10MB limit.');
      return;
    }

    setFile(selected);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const isVideo = file.type.startsWith('video/');
      const mediaUrl = await uploadMedia(file, 'stories');

      const res = await createStory({
        mediaUrl,
        type: isVideo ? 'video' : 'image',
        caption: caption.trim() || undefined,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      router.refresh();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to upload story');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: `'Inter', sans-serif` }}>
            Create Story
          </h2>
          <button 
            onClick={onClose} 
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          {!file ? (
            <div 
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex gap-4 text-blue-500 mb-3">
                <ImageIcon size={32} />
                <Video size={32} />
              </div>
              <p className="font-semibold text-gray-700 mb-1">Upload Media</p>
              <p className="text-[13px] text-gray-500 text-center">
                Select a photo or video (max 10MB).
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative w-full aspect-[9/16] bg-black rounded-lg overflow-hidden flex items-center justify-center max-h-[60vh]">
                {file.type.startsWith('image/') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-contain" />
                ) : (
                  <video src={URL.createObjectURL(file)} controls className="w-full h-full object-contain" />
                )}
                <button 
                  className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70"
                  onClick={() => setFile(null)}
                >
                  <X size={16} />
                </button>
              </div>

              <input
                type="text"
                placeholder="Add a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={60}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            hidden 
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" 
            onChange={handleFileChange} 
          />
        </div>

        {/* Footer */}
        {file && (
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold rounded-full flex items-center gap-2 disabled:opacity-50 transition-colors shadow-md"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Posting...' : 'Share Story'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

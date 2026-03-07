'use client';

import { useState, useEffect } from 'react';
import { getComments, createComment } from '@/services/interactions';
import { Comment } from '@/types';
import { X, Loader2, Send } from 'lucide-react';
import Image from 'next/image';
import { formatDistanceToNowStrict } from 'date-fns';

interface CommentsModalProps {
  postId: string;
  onClose: () => void;
}

export function CommentsModal({ postId, onClose }: CommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getComments(postId);
        setComments(data as Comment[]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    try {
      // Optimistic or just wait for response
      const newComment = await createComment(postId, content.trim());
      // Re-fetch or append directly
      const updatedData = await getComments(postId);
      setComments(updatedData as Comment[]);
      setContent('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-6" onClick={onClose}>
      <div 
        className="w-full h-[80vh] sm:h-[600px] sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <div className="w-8" />
          <h2 className="text-[17px] font-bold text-gray-900">Comments</h2>
          <button 
            type="button" 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50/50">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#0a7ea4]" />
              <p className="text-sm font-medium">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <p className="font-medium text-[15px]">No comments yet.</p>
              <p className="text-sm">Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map(c => {
              const u = c.users;
              const name = u?.full_name || u?.username || 'Unknown';
              let dateTxt = '';
              try { dateTxt = formatDistanceToNowStrict(new Date(c.created_at)) + ' ago'; } catch { dateTxt = ''; }
              
              return (
                <div key={c.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-gray-200 relative">
                    {u?.avatar_url ? (
                      <Image src={u.avatar_url} alt={name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-blue-500 to-purple-500 text-white text-xs font-bold">
                        {name[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="bg-white px-3 pb-3 pt-2 rounded-2xl border border-gray-100 shadow-sm inline-block min-w-[120px]">
                      <span className="font-bold text-[14px] text-gray-900 mr-2">{name}</span>
                      <p className="text-[14px] text-gray-800 break-words mt-0.5" style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{c.content}</p>
                    </div>
                    <div className="mt-1 ml-2 text-xs font-semibold text-gray-400 flex items-center gap-3">
                      <span>{dateTxt}</span>
                      <button className="hover:text-gray-600 transition-colors">Reply</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-gray-100 shrink-0 mx-safe mb-safe">
          <form onSubmit={handleSubmit} className="flex gap-2 items-center bg-gray-100 rounded-full px-4 py-2 border border-transparent focus-within:border-[#0a7ea4] focus-within:bg-white transition-colors">
            <input
              type="text"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-transparent border-none outline-none text-[15px] min-w-0"
              maxLength={1000}
            />
            <button
              type="submit"
              disabled={!content.trim() || submitting}
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#0a7ea4] disabled:opacity-50 disabled:text-gray-400 transition-colors"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

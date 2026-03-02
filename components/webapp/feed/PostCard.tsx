'use client';

import Image from 'next/image';
import { Post } from '@/types';
import { MessageCircle, Heart, Share2, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const isVideo = post.video_url || post.type === 'video' || post.type === 'reel';
  const hasImage = post.media_url || post.thumbnail_url;
  
  // Safe fallback for parsing dates
  let dateText = '';
  try {
    dateText = formatDistanceToNowStrict(new Date(post.created_at)) + ' ago';
  } catch(e) {
    dateText = 'Just now';
  }

  return (
    <article className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer pt-4 bg-white text-gray-900">
      <div className="flex px-4 gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 shrink-0 relative rounded-full overflow-hidden bg-gradient-to-tr from-[#0a7ea4]/20 via-[#8b5cf6]/20 to-[#ec4899]/20 border border-gray-100 shadow-inner">
          {post.users?.avatar ? (
             <Image 
               src={post.users.avatar} 
               alt={`${post.users.username} avatar`}
               fill
               className="object-cover"
             />
          ) : (
             <div className="w-full h-full flex items-center justify-center font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#0a7ea4] to-[#ec4899]">
               {post.users?.username?.[0]?.toUpperCase() || 'U'}
             </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pb-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-bold text-[15px] truncate">
                {post.users?.full_name || post.users?.username || 'Unknown'}
              </span>
              <span className="text-gray-500 text-[15px] truncate hidden sm:inline">
                @{post.users?.username}
              </span>
              <span className="text-gray-500 mx-1">·</span>
              <span className="text-gray-500 text-[15px] hover:underline whitespace-nowrap">
                {dateText}
              </span>
            </div>
            <button className="text-gray-500 hover:text-[#0a7ea4] p-1.5 rounded-full hover:bg-[#0a7ea4]/10 transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* Text Content */}
          {post.content && (
            <p className="text-[15px] leading-normal whitespace-pre-wrap break-words mb-3">
              {post.content}
            </p>
          )}

          {/* Media Rendering */}
          {(hasImage || isVideo) && (
            <div className="rounded-2xl overflow-hidden mt-3 mb-3 border border-gray-200 relative bg-gray-100 flex justify-center max-h-[500px]">
              {isVideo ? (
                <video 
                  src={post.video_url || post.media_url} 
                  controls 
                  playsInline 
                  preload="metadata"
                  className="max-w-full max-h-[500px] object-contain rounded-2xl"
                />
              ) : post.media_url ? (
                <Image 
                  src={post.media_url} 
                  alt="Post media" 
                  width={600} 
                  height={500}
                  className="w-full h-auto object-cover max-h-[500px]"
                />
              ) : null}
            </div>
          )}

          {/* Action Bar */}
          <div className="flex justify-between text-gray-500 max-w-md mt-1">
            <button className="flex items-center gap-2 group p-0">
               <div className="p-2 rounded-full group-hover:bg-[#0a7ea4]/10 group-hover:text-[#0a7ea4] transition-colors">
                 <MessageCircle className="w-5 h-5" />
               </div>
               <span className="text-sm group-hover:text-[#0a7ea4] transition-colors">
                 {post.comments_count || 0}
               </span>
            </button>
            <button className="flex items-center gap-2 group p-0">
               <div className={`p-2 rounded-full transition-colors ${post.is_liked ? 'text-pink-500' : 'group-hover:bg-pink-500/10 group-hover:text-pink-500'}`}>
                 <Heart className={`w-5 h-5 ${post.is_liked ? 'fill-current' : ''}`} />
               </div>
               <span className={`text-sm transition-colors ${post.is_liked ? 'text-pink-500' : 'group-hover:text-pink-500'}`}>
                 {post.likes_count || 0}
               </span>
            </button>
            <button className="flex items-center gap-2 group p-0">
               <div className="p-2 rounded-full group-hover:bg-green-500/10 group-hover:text-green-500 transition-colors">
                 <Share2 className="w-5 h-5" />
               </div>
               <span className="text-sm group-hover:text-green-500 transition-colors">
                 {post.shares_count || 0}
               </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

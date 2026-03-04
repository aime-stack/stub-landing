'use client';

import Image from 'next/image';
import { Post } from '@/types';
import { Heart, MessageCircle, PlayCircle, Grid3X3, FileText } from 'lucide-react';
import { useState } from 'react';

interface ProfilePostsGridProps {
  posts: Post[];
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

export function ProfilePostsGrid({ posts }: ProfilePostsGridProps) {
  const [tab, setTab] = useState<'posts' | 'text'>('posts');

  const mediaPosts = posts.filter((p) => p.media_url || p.video_url);
  const textPosts = posts.filter((p) => !p.media_url && !p.video_url);

  const displayedPosts = tab === 'posts' ? mediaPosts : textPosts;

  return (
    <div>
      {/* Tab Row */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setTab('posts')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold border-b-2 transition-colors ${
            tab === 'posts'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Grid3X3 size={16} />
          Posts
        </button>
        <button
          onClick={() => setTab('text')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold border-b-2 transition-colors ${
            tab === 'text'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileText size={16} />
          Text
        </button>
      </div>

      {/* Grid */}
      {displayedPosts.length === 0 ? (
        <div className="py-20 flex flex-col items-center gap-3 text-gray-400">
          <Grid3X3 size={40} strokeWidth={1} />
          <p className="text-[15px]">No posts yet</p>
        </div>
      ) : tab === 'posts' ? (
        <div className="grid grid-cols-3 gap-0.5 bg-gray-200">
          {displayedPosts.map((post) => {
            const isVideo = post.type === 'video' || post.type === 'reel' || !!post.video_url;
            return (
              <div key={post.id} className="relative aspect-square bg-gray-100 group cursor-pointer overflow-hidden">
                {post.media_url ? (
                  <Image
                    src={post.media_url}
                    alt="Post"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-[#0a7ea4]/20 to-[#ec4899]/20" />
                )}
                {isVideo && (
                  <PlayCircle
                    size={24}
                    className="absolute top-2 right-2 text-white drop-shadow"
                  />
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center gap-4 text-white font-bold text-sm">
                    <span className="flex items-center gap-1.5">
                      <Heart size={18} className="fill-white" />
                      {formatCount(post.likes_count)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageCircle size={18} className="fill-white" />
                      {formatCount(post.comments_count)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Text posts list */
        <div className="divide-y divide-gray-100">
          {displayedPosts.map((post) => (
            <div key={post.id} className="px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <p className="text-[15px] text-gray-800 leading-relaxed line-clamp-4">{post.content}</p>
              <div className="flex items-center gap-4 mt-3 text-gray-400 text-[13px]">
                <span className="flex items-center gap-1">
                  <Heart size={14} />
                  {formatCount(post.likes_count)}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={14} />
                  {formatCount(post.comments_count)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

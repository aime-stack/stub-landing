'use client';

import { useState, useTransition } from 'react';
import { toggleFollow } from '@/services/follow';

interface FollowButtonProps {
  username: string;
  initialFollowing?: boolean;
}

export function FollowButton({ username, initialFollowing = false }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [hovered, setHovered] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    // Optimistic UI update
    const previous = following;
    setFollowing(!previous);
    
    startTransition(async () => {
      try {
        const result = await toggleFollow(username);
        setFollowing(result.following);
      } catch (err) {
        console.error('Failed to toggle follow:', err);
        setFollowing(previous); // Revert on failure
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 border ${
        following
          ? hovered
            ? 'border-red-300 text-red-500 bg-red-50'
            : 'border-gray-300 text-gray-700 bg-white'
          : 'border-transparent bg-gray-900 text-white hover:bg-gray-700'
      } ${isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
      aria-label={following ? `Unfollow ${username}` : `Follow ${username}`}
    >
      {following ? (hovered ? 'Unfollow' : 'Following') : 'Follow'}
    </button>
  );
}

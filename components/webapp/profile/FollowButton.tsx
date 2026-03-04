'use client';

import { useState } from 'react';

interface FollowButtonProps {
  username: string;
  initialFollowing?: boolean;
}

export function FollowButton({ username, initialFollowing = false }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [hovered, setHovered] = useState(false);

  const toggle = () => setFollowing((f) => !f);

  return (
    <button
      onClick={toggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 border ${
        following
          ? hovered
            ? 'border-red-300 text-red-500 bg-red-50'
            : 'border-gray-300 text-gray-700 bg-white'
          : 'border-transparent bg-gray-900 text-white hover:bg-gray-700'
      }`}
      aria-label={following ? `Unfollow ${username}` : `Follow ${username}`}
    >
      {following ? (hovered ? 'Unfollow' : 'Following') : 'Follow'}
    </button>
  );
}

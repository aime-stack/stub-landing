'use client';
import { useState, useEffect } from 'react';
import { checkIsFollowing, toggleFollow } from '@/services/follow';

interface InlineFollowBadgeProps {
  targetUsername: string;
  targetUserId: string;
  currentUserId?: string;
}

export function InlineFollowBadge({ targetUsername, targetUserId, currentUserId }: InlineFollowBadgeProps) {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  
  useEffect(() => {
    let mounted = true;
    if (!currentUserId || currentUserId === targetUserId) return;
    
    // Check follow state asynchronously to avoid heavy server joins on the feed
    checkIsFollowing(targetUsername).then((following) => {
      if (mounted) setIsFollowing(following);
    }).catch(() => {
      if (mounted) setIsFollowing(false);
    });
    
    return () => { mounted = false; };
  }, [currentUserId, targetUserId, targetUsername]);

  // Don't render if it's our own post, if we haven't loaded the state, or if we already follow them
  if (!currentUserId || currentUserId === targetUserId || isFollowing === null || isFollowing === true) {
    return null;
  }

  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Optimistic update
    setIsFollowing(true);
    try {
      await toggleFollow(targetUsername);
    } catch (err) {
      console.error('Failed to follow', err);
      setIsFollowing(false); // Revert on failure
    }
  };

  return (
    <>
      <span style={{ color: 'var(--border)', margin: '0 4px' }}>·</span>
      <button 
        onClick={handleFollow}
        style={{ 
          color: '#0a7ea4', 
          fontWeight: 700, 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          fontSize: 14, 
          padding: 0,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      >
        Follow
      </button>
    </>
  );
}

export type PremiumPlanId = 'free' | 'basic' | 'premium' | 'premium_plus';

export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string; 
  phone?: string;
  avatar?: string;
  website?: string; 
  coverPhoto?: string;
  bio?: string;
  isVerified: boolean;
  isCelebrity: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: string;
  updatedAt?: string;
  profileViewsCount?: number;
  isFollowing?: boolean;
  coins?: number;
  accountType?: 'regular' | 'vip' | 'industry';
  account_type?: 'regular' | 'premium' | 'vip' | 'industry';
  premiumPlan?: PremiumPlanId;
}

export interface Post {
  id: string;
  user_id: string; // From database mapping
  users?: User; // Join result
  type: 'text' | 'image' | 'video' | 'audio' | 'poll' | 'link' | 'reel' | 'post' | 'reshare';
  content?: string;
  media_url?: string;
  video_url?: string;
  thumbnail_url?: string;
  media_metadata?: any;
  views_count?: number;
  poll_options?: any;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_liked?: boolean;
  is_boosted?: boolean;
  created_at: string;
  updated_at: string;
  aspect_ratio?: number; 
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  users?: User;
  content: string;
  likes_count: number;
  is_liked?: boolean;
  created_at: string;
}

export interface PaginatedFeed {
  data: Post[];
  nextCursor: string | null;
  hasMore: boolean;
}

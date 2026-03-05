export type PremiumPlanId = 'free' | 'basic' | 'premium' | 'premium_plus';
export type AccountType = 'regular' | 'vip' | 'industry' | 'premium';

export interface Profile {
  id: string; // UUID from auth.users.id
  username: string;
  full_name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  cover_url?: string;
  bio?: string;
  is_verified: boolean;
  is_celebrity: boolean;
  account_type: AccountType;
  followers_count: number;
  following_count: number;
  posts_count: number;
  created_at: string;
  updated_at?: string;
  
  // App-specific (might be derived or fetched separately)
  is_following?: boolean;
  coins?: number; 
  premium_plan?: PremiumPlanId;
}

// Keeping the User alias for legacy component support, but mapping it to Profile structure
export type User = Profile; 

export interface Post {
  id: string; // UUID
  user_id: string; // References profiles.id
  users?: Profile; // Relation
  community_id?: string | null; // References communities.id
  type: 'text' | 'image' | 'video' | 'audio' | 'poll' | 'link' | 'reel' | 'reshare' | 'post';
  content?: string;
  
  // Media Fields
  image_url?: string | null;
  video_url?: string | null;
  thumbnail_url?: string | null;
  media_urls?: string[] | null; 
  media_types?: string[] | null;
  media_metadata?: any;
  background_gradient?: string[] | null;
  
  // Link Fields
  link_url?: string | null;
  link_title?: string | null;
  link_description?: string | null;
  link_image?: string | null;
  link_metadata?: any;
  
  // Meta
  poll_options?: any;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  views_count?: number;
  
  // App State fields
  is_liked?: boolean;
  is_saved?: boolean;
  
  // Ads / Boost
  is_boosted?: boolean;
  boost_expires_at?: string | null;
  visibility?: 'public' | 'private' | 'followers';
  
  reshared_from?: string | null; // References posts.id
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string; // UUID
  post_id: string; // UUID
  user_id: string; // UUID
  parent_id?: string | null; // UUID
  users?: Profile; // Relation
  content: string;
  likes_count: number;
  is_liked?: boolean;
  created_at: string;
}

export interface Story {
  id: string; // UUID
  user_id: string; // UUID
  user: {
    id: string;
    username: string;
    full_name?: string;
    avatar_url?: string;
    is_verified?: boolean;
  };
  media_url: string;
  type: 'image' | 'video';
  caption?: string;
  created_at: string;
  expires_at: string;
  viewed?: boolean;
}

export interface MarketplaceProduct {
  id: string; // UUID
  user_id: string; // References profiles.id
  name: string;
  description: string;
  price: number; // RWF
  phone_number?: string | null;
  image_url?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: string; // UUID
  user_id: string; // UNIQUE References profiles.id
  balance: number;
  coins_balance: number;
  total_earned: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface PaginatedFeed {
  data: Post[];
  nextCursor: string | null;
  hasMore: boolean;
}

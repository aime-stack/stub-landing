-- Optimize Feed Query Database Schema Migration
-- Filename: 20260308_optimize_posts.sql

-- Ensure the posts table has necessary columns for video uploads and counts
-- Note: Assuming the table exists, we are focusing on the crucial indexes as requested in Phase 3.

-- 1. Index on created_at for fast cursor-based pagination
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- 2. Index on user_id for fast profile feed queries
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);

-- 3. Index on community_id to optimize filtering for global vs community feeds
-- The global feed query specifically uses `is('community_id', null)`
CREATE INDEX IF NOT EXISTS idx_posts_community_id ON posts(community_id) WHERE community_id IS NULL;

-- 4. Index on likes_count for trending/popular queries (if needed for Redis caching trending calculations)
CREATE INDEX IF NOT EXISTS idx_posts_likes_count ON posts(likes_count DESC);

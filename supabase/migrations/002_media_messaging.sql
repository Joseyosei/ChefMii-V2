-- ─────────────────────────────────────────────────────────────
-- ChefMii: Chef Media + Real Messaging + Extended Role Profiles
-- Run this entire file in the Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────
-- ── Chef Media ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chef_media (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chef_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    title TEXT NOT NULL,
    description TEXT,
    cuisine_tags TEXT [] DEFAULT '{}',
    likes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    bookings_generated INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS media_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    media_id UUID REFERENCES chef_media(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, media_id)
);
CREATE TABLE IF NOT EXISTS media_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    media_id UUID REFERENCES chef_media(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS media_saves (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    media_id UUID REFERENCES chef_media(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, media_id)
);
CREATE TABLE IF NOT EXISTS chef_follows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    chef_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(follower_id, chef_id)
);
-- ── Real Messaging ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    participant1 UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    participant2 UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    last_message TEXT,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(participant1, participant2)
);
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ── Notifications ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    -- 'booking','message','like','follow','comment'
    title TEXT NOT NULL,
    body TEXT,
    href TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ── Extended role support in profiles ─────────────────────────
-- profiles.role already supports 'client'|'chef'|'admin'
-- We extend it to support new roles via a separate enum update
-- (if using Supabase check constraint instead of enum)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles
ADD CONSTRAINT profiles_role_check CHECK (
        role IN (
            'client',
            'chef',
            'admin',
            'business',
            'kids',
            'influencer',
            'farmer'
        )
    );
-- ── Enable RLS ─────────────────────────────────────────────────
ALTER TABLE chef_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE chef_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
-- chef_media: public read, chefs can insert/update/delete their own
CREATE POLICY IF NOT EXISTS "chef_media_public_read" ON chef_media FOR
SELECT USING (true);
CREATE POLICY IF NOT EXISTS "chef_media_insert" ON chef_media FOR
INSERT WITH CHECK (auth.uid() = chef_id);
CREATE POLICY IF NOT EXISTS "chef_media_own_update" ON chef_media FOR
UPDATE USING (auth.uid() = chef_id);
CREATE POLICY IF NOT EXISTS "chef_media_own_delete" ON chef_media FOR DELETE USING (auth.uid() = chef_id);
-- likes: authenticated users
CREATE POLICY IF NOT EXISTS "likes_public_read" ON media_likes FOR
SELECT USING (true);
CREATE POLICY IF NOT EXISTS "likes_insert" ON media_likes FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "likes_delete" ON media_likes FOR DELETE USING (auth.uid() = user_id);
-- comments: public read, auth insert
CREATE POLICY IF NOT EXISTS "comments_public_read" ON media_comments FOR
SELECT USING (true);
CREATE POLICY IF NOT EXISTS "comments_insert" ON media_comments FOR
INSERT WITH CHECK (auth.uid() = user_id);
-- saves + follows
CREATE POLICY IF NOT EXISTS "saves_own" ON media_saves FOR ALL USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "follows_read" ON chef_follows FOR
SELECT USING (true);
CREATE POLICY IF NOT EXISTS "follows_own" ON chef_follows FOR ALL USING (auth.uid() = follower_id);
-- conversations: only participants
CREATE POLICY IF NOT EXISTS "conv_read" ON conversations FOR
SELECT USING (
        auth.uid() = participant1
        OR auth.uid() = participant2
    );
CREATE POLICY IF NOT EXISTS "conv_insert" ON conversations FOR
INSERT WITH CHECK (
        auth.uid() = participant1
        OR auth.uid() = participant2
    );
CREATE POLICY IF NOT EXISTS "conv_update" ON conversations FOR
UPDATE USING (
        auth.uid() = participant1
        OR auth.uid() = participant2
    );
-- messages: only participants of the conversation
CREATE POLICY IF NOT EXISTS "msg_read" ON messages FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM conversations c
            WHERE c.id = conversation_id
                AND (
                    c.participant1 = auth.uid()
                    OR c.participant2 = auth.uid()
                )
        )
    );
CREATE POLICY IF NOT EXISTS "msg_insert" ON messages FOR
INSERT WITH CHECK (auth.uid() = sender_id);
-- notifications: own only
CREATE POLICY IF NOT EXISTS "notif_own" ON notifications FOR ALL USING (auth.uid() = user_id);
-- ── Enable Realtime ────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime
ADD TABLE messages;
ALTER PUBLICATION supabase_realtime
ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime
ADD TABLE media_likes;
-- ── Seed chef_media with 6 mock videos ────────────────────────
-- NOTE: Replace chef_id with a real UUID from your profiles table
-- For demo, we'll use a placeholder that you can update
-- INSERT INTO chef_media (chef_id, video_url, thumbnail_url, title, description, cuisine_tags, likes, views, bookings_generated, comments_count)
-- VALUES (
--   '00000000-0000-0000-0000-000000000001',
--   'https://www.w3schools.com/html/mov_bbb.mp4',
--   'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=400&q=80',
--   'Perfect Carbonara in 8 Minutes',
--   'The secret is in the egg temperature. Watch how I create the creamiest carbonara without scrambling the eggs!',
--   ARRAY['italian','pasta','london'],
--   18200, 234000, 47, 184
-- );
-- (Seed via the app after creating a chef account)
-- ── Storage bucket for media ───────────────────────────────────
-- Run in Supabase Dashboard → Storage → New Bucket:
-- Name: chef-media, Public: true
-- Or via SQL:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('chef-media', 'chef-media', true) ON CONFLICT DO NOTHING;
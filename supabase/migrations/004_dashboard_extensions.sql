-- ─────────────────────────────────────────────────────────────
-- ChefMii: Extended Profile Tables (Business, Influencer, Kids)
-- Run this entire file in the Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────

-- ── Business Profiles ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS business_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    company_name TEXT NOT NULL,
    industry TEXT,
    employee_count INTEGER DEFAULT 0,
    office_location TEXT,
    contact_email TEXT,
    website_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Corporate Requests (for Business dashboard) ──────
CREATE TABLE IF NOT EXISTS corporate_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'team-building', 'client-dinner', 'catered-lunch'
    event_date DATE,
    attendees INTEGER,
    budget DECIMAL(10, 2),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'confirmed', 'completed')),
    notes TEXT,
    assigned_chef_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Influencer Profiles ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS influencer_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    platform TEXT, -- 'instagram', 'tiktok', 'youtube'
    handle TEXT,
    followers_count INTEGER DEFAULT 0,
    niche TEXT, -- 'foodie', 'lifestyle', etc.
    affiliate_code TEXT UNIQUE,
    total_earnings DECIMAL(10, 2) DEFAULT 0,
    pending_payout DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Influencer Conversions / Tracking ─────────────────
CREATE TABLE IF NOT EXISTS influencer_conversions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    influencer_id UUID REFERENCES influencer_profiles(id) ON DELETE CASCADE,
    referred_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    commission_amount DECIMAL(10, 2) DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Kids Profiles & Academy ────────────────────────────────────
CREATE TABLE IF NOT EXISTS kids_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- Link back to a parent user
    child_name TEXT NOT NULL,
    age INTEGER,
    skill_level TEXT DEFAULT 'beginner', -- beginner, intermediate, junior-chef
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kids_badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    kid_id UUID REFERENCES kids_profiles(id) ON DELETE CASCADE,
    badge_name TEXT NOT NULL, -- e.g., 'Master Baker', 'Knife Skills 101'
    icon_url TEXT,
    earned_at TIMESTAMPTZ DEFAULT NOW()
);


-- ── Triggers for Updated At ────────────────────────────────────
CREATE TRIGGER update_business_profiles_updated_at BEFORE UPDATE ON business_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_influencer_profiles_updated_at BEFORE UPDATE ON influencer_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_kids_profiles_updated_at BEFORE UPDATE ON kids_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── RLS ────────────────────────────────────────────────────────
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE kids_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kids_badges ENABLE ROW LEVEL SECURITY;

-- Business
CREATE POLICY "business_read" ON business_profiles FOR SELECT USING (true);
CREATE POLICY "business_insert" ON business_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "business_update" ON business_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "cr_read" ON corporate_requests FOR SELECT USING (
    EXISTS (SELECT 1 FROM business_profiles bp WHERE bp.id = business_id AND bp.user_id = auth.uid())
);
CREATE POLICY "cr_insert" ON corporate_requests FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM business_profiles bp WHERE bp.id = business_id AND bp.user_id = auth.uid())
);

-- Influencer
CREATE POLICY "inf_read" ON influencer_profiles FOR SELECT USING (true);
CREATE POLICY "inf_insert" ON influencer_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "inf_update" ON influencer_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "ic_read" ON influencer_conversions FOR SELECT USING (
    EXISTS (SELECT 1 FROM influencer_profiles ip WHERE ip.id = influencer_id AND ip.user_id = auth.uid())
);

-- Kids
CREATE POLICY "kid_read" ON kids_profiles FOR SELECT USING (auth.uid() = user_id OR auth.uid() = parent_id);
CREATE POLICY "kid_insert" ON kids_profiles FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() = parent_id);
CREATE POLICY "kid_update" ON kids_profiles FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = parent_id);

CREATE POLICY "kb_read" ON kids_badges FOR SELECT USING (
    EXISTS (SELECT 1 FROM kids_profiles kp WHERE kp.id = kid_id AND (kp.user_id = auth.uid() OR kp.parent_id = auth.uid()))
);

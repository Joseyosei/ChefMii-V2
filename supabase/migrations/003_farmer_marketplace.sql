-- ─────────────────────────────────────────────────────────────
-- ChefMii: Farmer Marketplace Tables
-- Run this entire file in the Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────
-- ── Farmer Profiles ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS farmer_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    farm_name TEXT NOT NULL,
    location TEXT,
    description TEXT,
    verified BOOLEAN DEFAULT false,
    rating DECIMAL(3, 2) DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    marketplace_live BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ── Produce Listings ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS produce_listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    farmer_id UUID REFERENCES farmer_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    price_per_unit DECIMAL(10, 2),
    unit TEXT DEFAULT 'kg',
    stock_quantity INTEGER DEFAULT 0,
    image_url TEXT,
    organic BOOLEAN DEFAULT false,
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ── Farmer Orders ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS farmer_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    farmer_id UUID REFERENCES farmer_profiles(id) ON DELETE CASCADE,
    chef_id UUID REFERENCES profiles(id) ON DELETE
    SET NULL,
        items JSONB DEFAULT '[]',
        total_amount DECIMAL(10, 2),
        status TEXT DEFAULT 'pending' CHECK (
            status IN ('pending', 'confirmed', 'delivered', 'cancelled')
        ),
        delivery_date DATE,
        delivery_address TEXT,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ── Farmer Revenue / Payouts ───────────────────────────────────
CREATE TABLE IF NOT EXISTS farmer_payouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    farmer_id UUID REFERENCES farmer_profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
    period_label TEXT,
    -- e.g. 'Feb 2026'
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ── RLS ────────────────────────────────────────────────────────
ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE produce_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_payouts ENABLE ROW LEVEL SECURITY;
-- farmer_profiles: public read, owner write
CREATE POLICY IF NOT EXISTS "fp_read" ON farmer_profiles FOR
SELECT USING (true);
CREATE POLICY IF NOT EXISTS "fp_insert" ON farmer_profiles FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "fp_update" ON farmer_profiles FOR
UPDATE USING (auth.uid() = user_id);
-- produce_listings: public read, owner write
CREATE POLICY IF NOT EXISTS "pl_read" ON produce_listings FOR
SELECT USING (true);
CREATE POLICY IF NOT EXISTS "pl_insert" ON produce_listings FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM farmer_profiles fp
            WHERE fp.id = farmer_id
                AND fp.user_id = auth.uid()
        )
    );
CREATE POLICY IF NOT EXISTS "pl_update" ON produce_listings FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM farmer_profiles fp
            WHERE fp.id = farmer_id
                AND fp.user_id = auth.uid()
        )
    );
CREATE POLICY IF NOT EXISTS "pl_delete" ON produce_listings FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM farmer_profiles fp
        WHERE fp.id = farmer_id
            AND fp.user_id = auth.uid()
    )
);
-- farmer_orders: farmer and chef can see their own
CREATE POLICY IF NOT EXISTS "fo_read" ON farmer_orders FOR
SELECT USING (
        chef_id = auth.uid()
        OR EXISTS (
            SELECT 1
            FROM farmer_profiles fp
            WHERE fp.id = farmer_id
                AND fp.user_id = auth.uid()
        )
    );
CREATE POLICY IF NOT EXISTS "fo_update" ON farmer_orders FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM farmer_profiles fp
            WHERE fp.id = farmer_id
                AND fp.user_id = auth.uid()
        )
    );
-- payouts: farmer only
CREATE POLICY IF NOT EXISTS "pyt_own" ON farmer_payouts FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM farmer_profiles fp
        WHERE fp.id = farmer_id
            AND fp.user_id = auth.uid()
    )
);
-- ── Seed Data ──────────────────────────────────────────────────
-- Creates a demo farmer profile (anonymous user_id — replace with real UUID after sign-up)
-- Uncomment and replace 'YOUR_USER_UUID' after creating an account:
/*
 INSERT INTO farmer_profiles (user_id, farm_name, location, description, verified, rating, total_orders)
 VALUES (
 'YOUR_USER_UUID',
 'Green Valley Organics',
 'Devon, UK',
 'Family-run organic farm supplying premium chefs with seasonal produce since 1998.',
 true, 4.8, 142
 );
 
 -- Store the farmer_profile id from above, then:
 INSERT INTO produce_listings (farmer_id, name, category, price_per_unit, unit, stock_quantity, organic, available)
 VALUES
 ('FARMER_PROFILE_UUID', 'Heirloom Tomatoes',    'Vegetables', 4.20, 'kg',  145, true,  true),
 ('FARMER_PROFILE_UUID', 'Fresh Basil',           'Herbs',     18.00, 'kg',   22, true,  true),
 ('FARMER_PROFILE_UUID', 'Free-Range Eggs',       'Dairy & Eggs', 0.45, 'unit', 800, false, true),
 ('FARMER_PROFILE_UUID', 'Heritage Carrots',      'Vegetables',  2.80, 'kg',   80, true,  true),
 ('FARMER_PROFILE_UUID', 'Whole Grain Chicken',   'Meat',       12.00, 'kg',   30, false, true);
 */
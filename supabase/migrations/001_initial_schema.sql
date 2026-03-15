-- ============================================================
-- ChefMii Database Schema
-- Project: xxbpvhrqugeaofhnyhnz
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- ─── Clean up if re-running ──────────────────────────────────
-- (Safe to run multiple times — drops and recreates everything)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_chef_profiles_updated_at ON chef_profiles;
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
DROP TRIGGER IF EXISTS on_review_created ON reviews;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_chef_rating() CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS chef_profiles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TYPE IF EXISTS booking_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
-- ─── Enums ───────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('client', 'chef', 'admin');
CREATE TYPE booking_status AS ENUM (
    'pending',
    'confirmed',
    'completed',
    'cancelled',
    'refunded'
);
-- ─── Profiles ────────────────────────────────────────────────
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'client',
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- ─── Chef Profiles ───────────────────────────────────────────
CREATE TABLE chef_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    bio TEXT,
    specialties TEXT [] NOT NULL DEFAULT '{}',
    cuisine_types TEXT [] NOT NULL DEFAULT '{}',
    hourly_rate NUMERIC(10, 2) NOT NULL DEFAULT 0,
    min_guests INTEGER NOT NULL DEFAULT 2,
    max_guests INTEGER NOT NULL DEFAULT 20,
    years_experience INTEGER NOT NULL DEFAULT 0,
    certifications TEXT [] NOT NULL DEFAULT '{}',
    gallery_urls TEXT [] NOT NULL DEFAULT '{}',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    avg_rating NUMERIC(3, 2),
    total_reviews INTEGER NOT NULL DEFAULT 0,
    location_city TEXT,
    location_state TEXT,
    slug TEXT UNIQUE NOT NULL,
    stripe_account_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- ─── Bookings ────────────────────────────────────────────────
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES profiles(id),
    chef_id UUID NOT NULL REFERENCES chef_profiles(id),
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    duration_hours NUMERIC(4, 1) NOT NULL,
    guest_count INTEGER NOT NULL,
    event_type TEXT NOT NULL,
    special_requests TEXT,
    status booking_status NOT NULL DEFAULT 'pending',
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    platform_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    chef_payout NUMERIC(10, 2) NOT NULL DEFAULT 0,
    stripe_payment_intent_id TEXT,
    stripe_transfer_id TEXT,
    address_line1 TEXT,
    address_city TEXT,
    address_state TEXT,
    address_zip TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- ─── Reviews ─────────────────────────────────────────────────
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES profiles(id),
    chef_id UUID NOT NULL REFERENCES chef_profiles(id),
    rating SMALLINT NOT NULL CHECK (
        rating BETWEEN 1 AND 5
    ),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- ─── Messages ────────────────────────────────────────────────
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id),
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- ─── Functions ───────────────────────────────────────────────
-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER update_profiles_updated_at BEFORE
UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chef_profiles_updated_at BEFORE
UPDATE ON chef_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE
UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Auto-create profile on auth signup
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$ BEGIN
INSERT INTO public.profiles (id, email, full_name, avatar_url)
VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    ) ON CONFLICT (id) DO NOTHING;
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();
-- Auto-update chef avg_rating after review insert/update
CREATE OR REPLACE FUNCTION update_chef_rating() RETURNS TRIGGER AS $$ BEGIN
UPDATE chef_profiles
SET avg_rating = (
        SELECT ROUND(AVG(rating)::NUMERIC, 2)
        FROM reviews
        WHERE chef_id = NEW.chef_id
    ),
    total_reviews = (
        SELECT COUNT(*)
        FROM reviews
        WHERE chef_id = NEW.chef_id
    ),
    updated_at = NOW()
WHERE id = NEW.chef_id;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER on_review_created
AFTER
INSERT
    OR
UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_chef_rating();
-- ─── Row Level Security ───────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chef_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
-- Profiles
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR
SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR
INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR
UPDATE USING (auth.uid() = id);
-- Chef profiles
CREATE POLICY "Chef profiles are viewable by everyone" ON chef_profiles FOR
SELECT USING (true);
CREATE POLICY "Chefs can insert own profile" ON chef_profiles FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Chefs can update own profile" ON chef_profiles FOR
UPDATE USING (auth.uid() = user_id);
-- Bookings
CREATE POLICY "Clients can view own bookings" ON bookings FOR
SELECT USING (
        auth.uid() = client_id
        OR auth.uid() = (
            SELECT user_id
            FROM chef_profiles
            WHERE id = chef_id
        )
    );
CREATE POLICY "Clients can create bookings" ON bookings FOR
INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Chef can update booking status" ON bookings FOR
UPDATE USING (
        auth.uid() = (
            SELECT user_id
            FROM chef_profiles
            WHERE id = chef_id
        )
        OR auth.uid() = client_id
    );
-- Reviews
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR
SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews FOR
INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR
UPDATE USING (auth.uid() = reviewer_id);
-- Messages
CREATE POLICY "Booking participants can view messages" ON messages FOR
SELECT USING (
        auth.uid() = sender_id
        OR auth.uid() = (
            SELECT client_id
            FROM bookings
            WHERE id = booking_id
        )
        OR auth.uid() = (
            SELECT user_id
            FROM chef_profiles
            WHERE id = (
                    SELECT chef_id
                    FROM bookings
                    WHERE id = booking_id
                )
        )
    );
CREATE POLICY "Booking participants can send messages" ON messages FOR
INSERT WITH CHECK (
        auth.uid() = sender_id
        AND (
            auth.uid() = (
                SELECT client_id
                FROM bookings
                WHERE id = booking_id
            )
            OR auth.uid() = (
                SELECT user_id
                FROM chef_profiles
                WHERE id = (
                        SELECT chef_id
                        FROM bookings
                        WHERE id = booking_id
                    )
            )
        )
    );
-- ─── Indexes ─────────────────────────────────────────────────
CREATE INDEX idx_chef_profiles_slug ON chef_profiles(slug);
CREATE INDEX idx_chef_profiles_user_id ON chef_profiles(user_id);
CREATE INDEX idx_bookings_client_id ON bookings(client_id);
CREATE INDEX idx_bookings_chef_id ON bookings(chef_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_event_date ON bookings(event_date);
CREATE INDEX idx_reviews_chef_id ON reviews(chef_id);
CREATE INDEX idx_messages_booking_id ON messages(booking_id);
-- ─── Storage Buckets ─────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true),
    ('chef-media', 'chef-media', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Anyone can view avatars" ON storage.objects FOR
SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload own avatar" ON storage.objects FOR
INSERT WITH CHECK (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name)) [1]
    );
CREATE POLICY "Anyone can view chef media" ON storage.objects FOR
SELECT USING (bucket_id = 'chef-media');
CREATE POLICY "Chefs can upload own media" ON storage.objects FOR
INSERT WITH CHECK (
        bucket_id = 'chef-media'
        AND auth.uid()::text = (storage.foldername(name)) [1]
    );
-- ─── Done ────────────────────────────────────────────────────
-- Schema ready! Tables created:
--   profiles, chef_profiles, bookings, reviews, messages
-- Storage buckets ready:
--   avatars (public), chef-media (public)
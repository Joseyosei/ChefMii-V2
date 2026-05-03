-- Order Feature Database Schema for ChefMii
-- Run this in Supabase SQL Editor

-- Chef Menus Table
CREATE TABLE IF NOT EXISTS chef_menus (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chef_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu Categories Table
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  menu_id UUID REFERENCES chef_menus(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INTEGER DEFAULT 0
);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chef_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  prep_time_mins INTEGER DEFAULT 30,
  dietary_tags TEXT[] DEFAULT '{}',
  most_liked_rank INTEGER,
  calories INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  chef_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  farmer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  order_type TEXT CHECK (order_type IN ('chef_delivery', 'chef_pickup', 'farmer_delivery', 'farmer_pickup')),
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2),
  delivery_fee DECIMAL(10,2) DEFAULT 2.99,
  platform_fee DECIMAL(10,2),
  total_amount DECIMAL(10,2),
  delivery_address TEXT,
  delivery_lat DECIMAL(10,8),
  delivery_lng DECIMAL(10,8),
  estimated_delivery_mins INTEGER DEFAULT 45,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled')),
  stripe_payment_id TEXT,
  special_instructions TEXT,
  rating INTEGER,
  rating_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2),
  special_request TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delivery Zones Table
CREATE TABLE IF NOT EXISTS delivery_zones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chef_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  farmer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  zone_name TEXT,
  max_distance_miles DECIMAL(5,2) DEFAULT 5,
  delivery_fee DECIMAL(10,2) DEFAULT 2.99,
  min_order_amount DECIMAL(10,2) DEFAULT 15,
  estimated_mins INTEGER DEFAULT 45
);

-- Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  chef_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  farmer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  quantity INTEGER DEFAULT 1,
  special_request TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable realtime for orders
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_menu_items_chef_id ON menu_items(chef_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_chef_id ON orders(chef_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_delivery_zones_chef_id ON delivery_zones(chef_id);

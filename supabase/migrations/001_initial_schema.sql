-- 001_initial_schema.sql
-- Run this in Supabase SQL Editor to bootstrap the database.

-- ── Extensions ──
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Videos ──
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  platform TEXT NOT NULL CHECK (platform IN ('tiktok', 'youtube', 'other')),
  platform_url TEXT NOT NULL,
  embed_url TEXT,
  thumbnail_url TEXT,
  author_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Products ──
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12, 2),
  currency TEXT DEFAULT 'VND',
  images TEXT[] DEFAULT '{}',
  affiliate_url TEXT NOT NULL,
  source_url TEXT,
  source_type TEXT DEFAULT 'manual' CHECK (source_type IN ('shopee', 'tiktok', 'lazada', 'manual', 'other')),
  video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Video <-> Product junction ──
CREATE TABLE video_products (
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  PRIMARY KEY (video_id, product_id)
);

-- ── Click tracking ──
CREATE TABLE click_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_agent TEXT,
  ip_address TEXT,
  referrer TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Admin profiles (extends Supabase auth.users) ──
CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes ──
CREATE INDEX idx_products_source_type ON products(source_type);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_video_id ON products(video_id);
CREATE INDEX idx_click_events_product_id ON click_events(product_id);
CREATE INDEX idx_click_events_clicked_at ON click_events(clicked_at DESC);
CREATE INDEX idx_video_products_video_id ON video_products(video_id);
CREATE INDEX idx_video_products_product_id ON video_products(product_id);

-- ── Auto-update updated_at ──
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── RLS Policies ──
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Public: anyone can read active products & videos
CREATE POLICY "Public read active products"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public read active videos"
  ON videos FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public read video_products"
  ON video_products FOR SELECT
  USING (true);

-- Admin: full access to their own rows
CREATE POLICY "Admin full access products"
  ON products FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_profiles))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_profiles));

CREATE POLICY "Admin full access videos"
  ON videos FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_profiles))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_profiles));

CREATE POLICY "Admin full access video_products"
  ON video_products FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_profiles))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_profiles));

CREATE POLICY "Admin read click_events"
  ON click_events FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admin_profiles));

-- Public: can insert click events (no auth needed)
CREATE POLICY "Public insert click_events"
  ON click_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin full access admin_profiles"
  ON admin_profiles FOR ALL
  USING (auth.uid() = id);

-- ── Click count trigger ──
CREATE OR REPLACE FUNCTION increment_click_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET click_count = click_count + 1 WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_click_event
  AFTER INSERT ON click_events
  FOR EACH ROW EXECUTE FUNCTION increment_click_count();

-- ============================================
-- Supabase SQL: створення таблиці бібліотек
-- Виконайте цей скрипт у SQL Editor вашого
-- Supabase проекту (https://supabase.com/dashboard)
-- ============================================

CREATE TABLE IF NOT EXISTS libraries (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  founded INTEGER,
  collection_size BIGINT,
  description TEXT,
  image_url TEXT,
  website TEXT,
  fun_fact TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Дозвіл на читання та запис для anon ролі
ALTER TABLE libraries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON libraries
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON libraries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON libraries
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete" ON libraries
  FOR DELETE USING (true);

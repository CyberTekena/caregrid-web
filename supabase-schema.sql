-- Supabase Schema for CareGrid
-- Run this in Supabase Dashboard > SQL Editor

-- 1. Create Profiles Table (User Metadata)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('student', 'cubicle', 'admin')),
  matric_number TEXT,
  hall_id TEXT,
  room_number TEXT,
  blood_group TEXT,
  genotype TEXT,
  allergies TEXT[],
  conditions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Halls Table (Hall Metadata for Map)
CREATE TABLE halls (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'busy')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Incidents Table (SOS System)
CREATE TABLE incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id),
  student_name TEXT NOT NULL,
  hall_id TEXT NOT NULL,
  room_number TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'on-route', 'resolved')),
  ess_score NUMERIC(3,1),
  is_third_party BOOLEAN DEFAULT false,
  third_party_name TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Medications Table
CREATE TABLE medications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  schedule_time TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  last_taken TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Realtime for SOS Monitoring
ALTER PUBLICATION supabase_realtime ADD TABLE incidents;

-- Seed Halls Table with current data
INSERT INTO halls (id, name, lat, lng, status) VALUES
  ('welch', 'Welch Hall', 6.8917506, 3.7214357, 'busy'),
  ('neal-wilson', 'Neal Wilson Hall', 6.8930534, 3.7217164, 'active'),
  ('nelson-mandela', 'Nelson Mandela Hall', 6.8934727, 3.7230408, 'active'),
  ('gideon-troopers', 'Gideon Troopers Hall', 6.8944243, 3.7224928, 'active'),
  ('bethel-splendor', 'Bethel Splendor Hall', 6.8946086, 3.7230729, 'active'),
  ('samuel-akande', 'Samuel Akande Hall', 6.8941305, 3.7236374, 'active'),
  ('adeleke', 'Adeleke Hall', 6.8932, 3.7215, 'active'),
  ('emerald', 'Emerald Hall', 6.8919, 3.7212, 'active'),
  ('topaz', 'Topaz Hall', 6.8936, 3.7228, 'active'),
  ('havilah-gold', 'Havilah Gold Hall', 6.8948787, 3.7260748, 'active'),
  ('crystal', 'Crystal Hall', 6.8928556, 3.7277415, 'active'),
  ('ameyo-adadevoh', 'Ameyo Adadevoh Hall', 6.8949448, 3.7249274, 'active'),
  ('felicia-dada', 'Felicia Adebisi Dada Hall', 6.8936738, 3.7249784, 'active'),
  ('queen-esther', 'Queen Esther Hall', 6.8929791, 3.7247012, 'busy'),
  ('white', 'White Hall', 6.8937701, 3.7263304, 'active'),
  ('nyberg', 'Nyberg Hall', 6.8925971, 3.7253785, 'active'),
  ('ogden', 'Ogden Hall', 6.8928285, 3.7263810, 'active'),
  ('platinum', 'Platinum Hall', 6.8924519, 3.7274199, 'inactive'),
  ('diamond', 'Diamond Hall', 6.8927, 3.7275, 'active'),
  ('sapphire', 'Sapphire Hall', 6.8929, 3.7272, 'active');
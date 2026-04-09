# Supabase Launch Guide: CareGrid System Activation

To transition the CareGrid platform from "Built & Wired" to "Live & Data-Driven," you need to configure your Supabase project. Follow these steps precisely.

## 1. Database Schema Setup

Go to your **Supabase Dashboard > SQL Editor** and run the following script to create the necessary tables.

```sql
-- 1. Create Profiles Table (User Metadata)
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
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

-- 2. Create Incidents Table (SOS System)
CREATE TABLE incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID,
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

-- 3. Create Medications Table
CREATE TABLE medications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  schedule_time TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  last_taken TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Realtime for SOS Monitoring
ALTER PUBLICATION supabase_realtime ADD TABLE incidents;
```

## 2. Environment Configuration

1. Create a file named `.env.local` in your root directory (`caregrid-web/`).
2. Copy the following variables and replace the placeholders with values from your **Supabase Settings > API** page:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Real-time Verification

Once you have configured the keys and run the SQL:
1. Trigger a test SOS on the **Student Emergency** page.
2. Open the **Cubicle Requests** page in another tab.
3. The alert will appear **instantly** via the live subscription.

---

### What I've Done for You
- [x] Initialized the Supabase Client.
- [x] Wired the **Emergency Button** to save to the `incidents` table.
- [x] Wired the **Cubicle Requests** page to listen for real-time SOS alerts.
- [x] Built the **Type Definitions** to match this SQL perfectly.

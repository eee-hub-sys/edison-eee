-- Create tables for EDISON EEE Portal

-- Clubs table
CREATE TABLE IF NOT EXISTS clubs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    faculty TEXT,
    student TEXT,
    icon TEXT,
    color TEXT
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    club TEXT,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT,
    image TEXT,
    tags TEXT[],
    "isLive" BOOLEAN DEFAULT false
);

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    club TEXT,
    title TEXT,
    image TEXT
);

-- Updates table
CREATE TABLE IF NOT EXISTS updates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    roll_number TEXT NOT NULL,
    club TEXT NOT NULL,
    mobile TEXT NOT NULL,
    year TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Coordinators table
CREATE TABLE IF NOT EXISTS coordinators (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'faculty' or 'student'
    roll_number TEXT,
    mobile TEXT,
    image TEXT,
    club TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE coordinators ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
CREATE POLICY "Public Read Clubs" ON clubs FOR SELECT USING (true);
CREATE POLICY "Public Read Events" ON events FOR SELECT USING (true);
CREATE POLICY "Public Read Gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public Read Updates" ON updates FOR SELECT USING (true);
CREATE POLICY "Public Read Coordinators" ON coordinators FOR SELECT USING (true);

-- PROTECTED WRITE POLICIES (Admin Only)
CREATE POLICY "Admin All Clubs" ON clubs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Events" ON events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Gallery" ON gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Updates" ON updates FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Coordinators" ON coordinators FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Registrations" ON registrations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- REGISTRATION INSERT (Restricted)
-- We'll proxy this through Next.js for rate limiting, but for direct Supabase:
CREATE POLICY "Secure Registration Insert" ON registrations FOR INSERT WITH CHECK (true);

-- Storage configuration for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portal-images', 'portal-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the bucket (Admin Only for Write/Delete, Public for Read)
CREATE POLICY "Public Image Read" ON storage.objects FOR SELECT USING (bucket_id = 'portal-images');
CREATE POLICY "Admin Image Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portal-images');
CREATE POLICY "Admin Image Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portal-images');

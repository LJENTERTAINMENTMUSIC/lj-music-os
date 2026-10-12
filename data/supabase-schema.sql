-- ==============================================================================
-- LJ MUSIC OS 2.0 — SUPABASE DATABASE SCHEMA (BULLETPROOF & IDEMPOTENT)
-- Compatible with all Supabase PostgreSQL versions (PG 13, 14, 15, 16)
-- ==============================================================================

-- 1. ARTIST ROSTER TABLE
CREATE TABLE IF NOT EXISTS public.artist_roster (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    stage_name VARCHAR(255),
    bio TEXT,
    monthly_listeners BIGINT DEFAULT 0,
    is_lj_priority BOOLEAN DEFAULT false,
    verified BOOLEAN DEFAULT true,
    avatar_url TEXT,
    genres TEXT[] DEFAULT ARRAY[]::TEXT[],
    social_links JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MUSIC CATALOGUE TABLE
CREATE TABLE IF NOT EXISTS public.catalogue (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    artist_id VARCHAR(64) REFERENCES public.artist_roster(id) ON DELETE SET NULL,
    genre VARCHAR(100) NOT NULL DEFAULT 'Afrobeats',
    bpm INTEGER NOT NULL DEFAULT 110,
    musical_key VARCHAR(50) NOT NULL DEFAULT 'C Minor',
    energy NUMERIC(4,3) DEFAULT 0.850,
    danceability NUMERIC(4,3) DEFAULT 0.880,
    valence NUMERIC(4,3) DEFAULT 0.790,
    acousticness NUMERIC(4,3) DEFAULT 0.150,
    hit_potential_score INTEGER DEFAULT 90,
    opportunity_score INTEGER DEFAULT 92,
    is_lj_artist BOOLEAN DEFAULT false,
    cover_art TEXT,
    preview_url TEXT,
    spotify_url TEXT,
    isrc VARCHAR(50),
    rights_clearance VARCHAR(50) DEFAULT '100% ONE-STOP',
    stream_count BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. LYRICS INTELLIGENCE & DISTRIBUTION TABLE (DIVISION 17)
CREATE TABLE IF NOT EXISTS public.lyrics_records (
    id VARCHAR(64) PRIMARY KEY,
    track_id VARCHAR(64) REFERENCES public.catalogue(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    plain_lyrics TEXT NOT NULL DEFAULT '',
    synced_lrc TEXT,
    word_synced_ttml TEXT,
    karaoke_data JSONB DEFAULT '{}'::JSONB,
    translations JSONB DEFAULT '{}'::JSONB,
    african_dialect_terms JSONB DEFAULT '[]'::JSONB,
    quality_score INTEGER DEFAULT 100,
    status VARCHAR(50) DEFAULT 'VERIFIED_ACTIVE',
    destinations_matrix JSONB DEFAULT '{"spotify": "synced", "apple_music": "synced", "youtube": "synced"}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. VERIFIED CURATORS & PLAYLIST CRM TABLE
CREATE TABLE IF NOT EXISTS public.curator_crm (
    id VARCHAR(64) PRIMARY KEY,
    curator_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    outlet VARCHAR(255),
    playlist_title VARCHAR(255) NOT NULL,
    playlist_url TEXT,
    follower_count BIGINT DEFAULT 0,
    focus_genres TEXT[] DEFAULT ARRAY[]::TEXT[],
    fit_score INTEGER DEFAULT 95,
    last_contact TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'ACTIVE_LEAD',
    pitch_history JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 10,000-AGENT SWARM TELEMETRY & DECISIONS TABLE
CREATE TABLE IF NOT EXISTS public.swarm_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cycle_timestamp TIMESTAMPTZ DEFAULT NOW(),
    total_agents INTEGER DEFAULT 10600,
    active_agents INTEGER DEFAULT 9842,
    collaborating_agents INTEGER DEFAULT 73,
    executing_agents INTEGER DEFAULT 85,
    action_type VARCHAR(100) NOT NULL,
    target_track_id VARCHAR(64),
    target_artist VARCHAR(255),
    payload JSONB NOT NULL DEFAULT '{}'::JSONB,
    execution_verdict VARCHAR(100) DEFAULT 'SUPERVISED_APPROVED'
);

-- 6. COMMERCIAL SYNC BRIEFS TABLE
CREATE TABLE IF NOT EXISTS public.sync_briefs (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    client VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    budget VARCHAR(100) NOT NULL,
    deadline VARCHAR(100),
    required_mood VARCHAR(255),
    matched_track_id VARCHAR(64) REFERENCES public.catalogue(id) ON DELETE SET NULL,
    match_score INTEGER DEFAULT 90,
    status VARCHAR(50) DEFAULT 'ACTIVE_SUBMISSION',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.artist_roster ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lyrics_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curator_crm ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swarm_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_briefs ENABLE ROW LEVEL SECURITY;

-- Idempotent Policy Drops
DROP POLICY IF EXISTS "Public Read Catalogue" ON public.catalogue;
DROP POLICY IF EXISTS "Public Read Roster" ON public.artist_roster;
DROP POLICY IF EXISTS "Public Read Lyrics" ON public.lyrics_records;
DROP POLICY IF EXISTS "Public Read Sync Briefs" ON public.sync_briefs;
DROP POLICY IF EXISTS "Service Role All Catalogue" ON public.catalogue;
DROP POLICY IF EXISTS "Service Role All Telemetry" ON public.swarm_telemetry;
DROP POLICY IF EXISTS "Service Role All Lyrics" ON public.lyrics_records;
DROP POLICY IF EXISTS "Service Role All Curators" ON public.curator_crm;
DROP POLICY IF EXISTS "Service Role All Roster" ON public.artist_roster;
DROP POLICY IF EXISTS "Service Role All Sync Briefs" ON public.sync_briefs;

-- Public Read Policies
CREATE POLICY "Public Read Catalogue" ON public.catalogue FOR SELECT USING (true);
CREATE POLICY "Public Read Roster" ON public.artist_roster FOR SELECT USING (true);
CREATE POLICY "Public Read Lyrics" ON public.lyrics_records FOR SELECT USING (true);
CREATE POLICY "Public Read Sync Briefs" ON public.sync_briefs FOR SELECT USING (true);

-- Service Role / Full Access Policies
CREATE POLICY "Service Role All Catalogue" ON public.catalogue FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service Role All Telemetry" ON public.swarm_telemetry FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service Role All Lyrics" ON public.lyrics_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service Role All Curators" ON public.curator_crm FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service Role All Roster" ON public.artist_roster FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service Role All Sync Briefs" ON public.sync_briefs FOR ALL USING (true) WITH CHECK (true);

-- Permissions Grant
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;

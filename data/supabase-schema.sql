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
    youtube_id VARCHAR(100),
    youtube_url TEXT,
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

-- 7. MOGUL ROYALTIES & AUDIT LEDGER TABLE
CREATE TABLE IF NOT EXISTS public.mogul_royalties (
    id VARCHAR(64) PRIMARY KEY,
    entity_name VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100) NOT NULL DEFAULT 'ARTIST_WORKSPACE',
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    tracked_earnings NUMERIC(12,2) DEFAULT 0.00,
    master_payout NUMERIC(12,2) DEFAULT 0.00,
    mechanical_payout NUMERIC(12,2) DEFAULT 0.00,
    performance_payout NUMERIC(12,2) DEFAULT 0.00,
    neighboring_payout NUMERIC(12,2) DEFAULT 0.00,
    unclaimed_recoverable NUMERIC(12,2) DEFAULT 0.00,
    catalog_track_count INTEGER DEFAULT 0,
    overall_audit_score NUMERIC(5,2) DEFAULT 99.4,
    last_audited_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. MOGUL AUDIT DISCREPANCY CLAIMS TABLE
CREATE TABLE IF NOT EXISTS public.mogul_audit_claims (
    id VARCHAR(64) PRIMARY KEY,
    discrepancy_type VARCHAR(100) NOT NULL,
    collection_source VARCHAR(255) NOT NULL,
    track_title VARCHAR(255) NOT NULL,
    artist_name VARCHAR(255) NOT NULL,
    isrc VARCHAR(50) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'CLAIM_RECOVERED',
    confidence NUMERIC(4,3) DEFAULT 0.980,
    confirmation_code VARCHAR(100),
    claimed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Covering Indexes
CREATE INDEX IF NOT EXISTS idx_catalogue_artist_id ON public.catalogue(artist_id);
CREATE INDEX IF NOT EXISTS idx_lyrics_records_track_id ON public.lyrics_records(track_id);
CREATE INDEX IF NOT EXISTS idx_sync_briefs_matched_track_id ON public.sync_briefs(matched_track_id);
CREATE INDEX IF NOT EXISTS idx_catalogue_isrc ON public.catalogue(isrc);
CREATE INDEX IF NOT EXISTS idx_mogul_royalties_entity ON public.mogul_royalties(entity_name);
CREATE INDEX IF NOT EXISTS idx_mogul_claims_isrc ON public.mogul_audit_claims(isrc);

-- Enable Row Level Security (RLS)
ALTER TABLE public.artist_roster ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lyrics_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curator_crm ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swarm_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mogul_royalties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mogul_audit_claims ENABLE ROW LEVEL SECURITY;

-- Idempotent Policy Drops
DROP POLICY IF EXISTS "Public Read Catalogue" ON public.catalogue;
DROP POLICY IF EXISTS "Service Role All Catalogue" ON public.catalogue;
DROP POLICY IF EXISTS "Public Read Roster" ON public.artist_roster;
DROP POLICY IF EXISTS "Service Role All Roster" ON public.artist_roster;
DROP POLICY IF EXISTS "Public Read Lyrics" ON public.lyrics_records;
DROP POLICY IF EXISTS "Service Role All Lyrics" ON public.lyrics_records;
DROP POLICY IF EXISTS "Public Read Curators" ON public.curator_crm;
DROP POLICY IF EXISTS "Service Role All Curators" ON public.curator_crm;
DROP POLICY IF EXISTS "Public Read Sync Briefs" ON public.sync_briefs;
DROP POLICY IF EXISTS "Service Role All Sync Briefs" ON public.sync_briefs;
DROP POLICY IF EXISTS "Public Read Mogul Royalties" ON public.mogul_royalties;
DROP POLICY IF EXISTS "Service Role All Mogul Royalties" ON public.mogul_royalties;
DROP POLICY IF EXISTS "Public Read Mogul Claims" ON public.mogul_audit_claims;
DROP POLICY IF EXISTS "Service Role All Mogul Claims" ON public.mogul_audit_claims;
DROP POLICY IF EXISTS "Service Role All Telemetry" ON public.swarm_telemetry;

-- Clean Scoped RLS Policies
CREATE POLICY "Public Read Catalogue" ON public.catalogue FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Service Role All Catalogue" ON public.catalogue FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Roster" ON public.artist_roster FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Service Role All Roster" ON public.artist_roster FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Lyrics" ON public.lyrics_records FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Service Role All Lyrics" ON public.lyrics_records FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Curators" ON public.curator_crm FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Service Role All Curators" ON public.curator_crm FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Sync Briefs" ON public.sync_briefs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Service Role All Sync Briefs" ON public.sync_briefs FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Mogul Royalties" ON public.mogul_royalties FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Service Role All Mogul Royalties" ON public.mogul_royalties FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Mogul Claims" ON public.mogul_audit_claims FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Service Role All Mogul Claims" ON public.mogul_audit_claims FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service Role All Telemetry" ON public.swarm_telemetry FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Permissions Grant
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;


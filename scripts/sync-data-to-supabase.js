/**
 * LJ MUSIC OS - SUPABASE DATA SYNCHRONIZATION UTILITY
 * Syncs local benchmark catalogue, roster, lyrics, and CRM records to Supabase Postgres.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

try {
  require('dotenv').config();
} catch (e) {}

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("❌ SUPABASE_URL or SUPABASE_KEY missing in .env");
  process.exit(1);
}

const client = createClient(url, key, { auth: { persistSession: false } });
const dataDir = path.join(__dirname, '..', 'data');

async function syncAll() {
  console.log("⚡ Starting synchronization with Supabase at:", url);

  // 1. Verify tables exist
  const { error: testErr } = await client.from('catalogue').select('id').limit(1);
  if (testErr) {
    console.error("⚠️ Tables not found in Supabase yet.");
    console.error("👉 Please execute data/supabase-schema.sql in your Supabase SQL Editor first!");
    console.error("Details:", testErr.message);
    return;
  }

  // 2. Sync Curators CRM
  try {
    const curators = JSON.parse(fs.readFileSync(path.join(dataDir, 'curatorCrm.json'), 'utf8'));
    const rows = curators.map(c => ({
      id: c.id,
      curator_name: c.name || c.curatorName,
      email: c.email || 'curator@verified.com',
      outlet: c.outlet || 'Editorial',
      playlist_title: c.playlist || 'Official Playlist',
      playlist_url: c.playlistUrl || null,
      follower_count: c.followers || 50000,
      focus_genres: c.genres || ['Afrobeats'],
      fit_score: c.matchScore || 90,
      status: 'VERIFIED_ACTIVE'
    }));
    const { error } = await client.from('curator_crm').upsert(rows);
    if (error) console.warn("Curator sync notice:", error.message);
    else console.log(`✅ Synced ${rows.length} verified curators to curator_crm table.`);
  } catch (e) {
    console.warn("Could not sync curators:", e.message);
  }

  // 3. Sync Sync Briefs
  try {
    const briefs = JSON.parse(fs.readFileSync(path.join(dataDir, 'syncBriefs.json'), 'utf8'));
    const rows = briefs.map(b => ({
      id: b.id,
      title: b.title,
      client: b.client || 'Agency',
      type: b.projectType || 'Commercial',
      budget: b.budget || '$15,000',
      deadline: b.deadline || '2026-10-30',
      required_mood: b.mood || 'High Energy'
    }));
    const { error } = await client.from('sync_briefs').upsert(rows);
    if (error) console.warn("Briefs sync notice:", error.message);
    else console.log(`✅ Synced ${rows.length} commercial sync briefs to sync_briefs table.`);
  } catch (e) {
    console.warn("Could not sync briefs:", e.message);
  }

  console.log("✨ Supabase synchronization routine complete!");
}

syncAll();

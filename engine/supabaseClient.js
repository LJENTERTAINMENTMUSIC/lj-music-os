/**
 * LJ MUSIC OS - SUPABASE INTEGRATION CLIENT
 * Enterprise Postgres & Realtime sync layer for catalogue, telemetry, and lyrics.
 */

let supabase = null;

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

function getSupabaseClient() {
  if (supabase) return supabase;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return null;
  }

  try {
    const { createClient } = require('@supabase/supabase-js');
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: true
      }
    });
    console.log('⚡ Connected to Supabase enterprise database at:', SUPABASE_URL);
    return supabase;
  } catch (err) {
    console.warn('⚠️ Supabase SDK initialization skipped or not installed:', err.message);
    return null;
  }
}

async function checkSupabaseConnection() {
  const client = getSupabaseClient();
  if (!client) {
    return {
      connected: false,
      configured: false,
      message: 'Supabase credentials not configured in environment (SUPABASE_URL and SUPABASE_ANON_KEY required)'
    };
  }

  try {
    const { data, error } = await client.from('catalogue').select('id').limit(1);
    if (error) {
      return {
        connected: false,
        configured: true,
        error: error.message
      };
    }
    return {
      connected: true,
      configured: true,
      message: 'Successfully connected and verified against Supabase database.'
    };
  } catch (err) {
    return {
      connected: false,
      configured: true,
      error: err.message
    };
  }
}

module.exports = {
  getSupabaseClient,
  checkSupabaseConnection
};

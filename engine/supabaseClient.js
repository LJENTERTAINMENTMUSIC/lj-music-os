/**
 * LJ MUSIC OS - SUPABASE INTEGRATION CLIENT
 * Enterprise Postgres & Realtime sync layer for catalogue, telemetry, and lyrics.
 */

try {
  require('dotenv').config();
} catch (e) {}

let supabase = null;

function getSupabaseClient() {
  if (supabase) return supabase;

  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

  if (!url || !key) {
    return null;
  }

  try {
    const { createClient } = require('@supabase/supabase-js');
    supabase = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: true
      }
    });
    console.log('⚡ Connected to Supabase enterprise database at:', url);
    return supabase;
  } catch (err) {
    console.warn('⚠️ Supabase SDK initialization skipped or not installed:', err.message);
    return null;
  }
}

async function checkSupabaseConnection() {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

  if (!url || !key) {
    return {
      connected: false,
      configured: false,
      message: 'Supabase credentials not configured in environment (SUPABASE_URL and SUPABASE_ANON_KEY required)'
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      connected: false,
      configured: true,
      message: 'Supabase client could not be instantiated'
    };
  }

  try {
    const { data, error } = await client.from('catalogue').select('id').limit(1);
    if (error) {
      return {
        connected: false,
        configured: true,
        url,
        error: error.message
      };
    }
    return {
      connected: true,
      configured: true,
      url,
      message: 'Successfully connected and verified against Supabase database.'
    };
  } catch (err) {
    return {
      connected: false,
      configured: true,
      url,
      error: err.message
    };
  }
}

module.exports = {
  getSupabaseClient,
  checkSupabaseConnection
};

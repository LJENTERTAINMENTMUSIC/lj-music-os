/**
 * LJ MUSIC OS - SUPABASE INTEGRATION CLIENT
 * Enterprise Postgres & Realtime sync layer for catalogue, telemetry, and lyrics.
 */

const fs = require('fs');
const path = require('path');

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

async function checkSupabaseConnection(customUrl = null, customKey = null) {
  const url = customUrl || process.env.SUPABASE_URL || '';
  const key = customKey || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

  if (!url || !key) {
    return {
      connected: false,
      configured: false,
      status: "PENDING_CREDENTIALS",
      message: 'Supabase credentials not configured in environment (SUPABASE_URL and SUPABASE_ANON_KEY required)'
    };
  }

  try {
    const { createClient } = require('@supabase/supabase-js');
    const testClient = (customUrl && customKey)
      ? createClient(customUrl, customKey, { auth: { persistSession: false } })
      : (getSupabaseClient() || createClient(url, key, { auth: { persistSession: false } }));

    // Test ping by querying catalogue or artist_roster table
    const { data, error } = await testClient.from('catalogue').select('id').limit(1);

    if (error) {
      // If table doesn't exist yet, the connection & API keys are valid, but schema needs to be initialized!
      if (error.code === '42P01' || error.message.includes('relation') || error.code === 'PGRST205' || error.message.includes('not found')) {
        return {
          connected: true,
          configured: true,
          tablesInitialized: false,
          url,
          status: "CONNECTED_SCHEMA_PENDING",
          message: 'Connected to Supabase successfully! Database tables need to be created with data/supabase-schema.sql.'
        };
      }
      return {
        connected: false,
        configured: true,
        url,
        status: "ERROR",
        error: error.message,
        message: `Supabase error: ${error.message}`
      };
    }

    return {
      connected: true,
      configured: true,
      tablesInitialized: true,
      url,
      status: "CONNECTED",
      message: 'Successfully connected and verified against Supabase database.'
    };
  } catch (err) {
    return {
      connected: false,
      configured: true,
      url,
      status: "CONNECTION_FAILED",
      error: err.message,
      message: `Failed to connect to Supabase: ${err.message}`
    };
  }
}

function saveEnvCredentials(url, key) {
  const envPath = path.join(__dirname, '..', '.env');
  let envContent = '';
  if (fs.existsSync(envPath)) {
    try {
      envContent = fs.readFileSync(envPath, 'utf8');
    } catch (e) {
      envContent = '';
    }
  }

  if (/^SUPABASE_URL=/m.test(envContent)) {
    envContent = envContent.replace(/^SUPABASE_URL=.*/m, `SUPABASE_URL=${url}`);
  } else {
    envContent += `\nSUPABASE_URL=${url}`;
  }

  if (/^SUPABASE_ANON_KEY=/m.test(envContent)) {
    envContent = envContent.replace(/^SUPABASE_ANON_KEY=.*/m, `SUPABASE_ANON_KEY=${key}`);
  } else {
    envContent += `\nSUPABASE_ANON_KEY=${key}`;
  }

  try {
    fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8');
  } catch (err) {
    console.warn("Could not write local .env file (read-only filesystem):", err.message);
  }

  process.env.SUPABASE_URL = url;
  process.env.SUPABASE_ANON_KEY = key;
  supabase = null; // force client re-initialization
}

async function configureSupabase(url, key) {
  if (!url || !key) {
    return { success: false, message: "Both SUPABASE_URL and SUPABASE_ANON_KEY are required." };
  }

  const cleanUrl = url.trim().replace(/\/$/, "");
  const cleanKey = key.trim();

  // Test credentials first
  const testResult = await checkSupabaseConnection(cleanUrl, cleanKey);
  if (!testResult.connected && testResult.status !== "CONNECTED_SCHEMA_PENDING") {
    return {
      success: false,
      message: testResult.message || "Failed to authenticate with Supabase. Please verify your Project URL and API Key.",
      details: testResult
    };
  }

  // Save credentials to memory and local .env
  saveEnvCredentials(cleanUrl, cleanKey);

  return {
    success: true,
    message: testResult.tablesInitialized
      ? "Connected and verified against live Supabase database tables!"
      : "Connected to Supabase! Run data/supabase-schema.sql in your Supabase SQL Editor to finish table setup.",
    status: testResult.status,
    url: cleanUrl,
    tablesInitialized: testResult.tablesInitialized
  };
}

module.exports = {
  getSupabaseClient,
  checkSupabaseConnection,
  configureSupabase,
  saveEnvCredentials
};

/**
 * LJ MUSIC OS - SUPABASE INTEGRATION CLIENT
 * Enterprise Postgres & Realtime sync layer for catalogue, telemetry, and lyrics.
 */

const fs = require('fs');
const path = require('path');

try {
  require('dotenv').config();
} catch (e) {}

const CANONICAL_PROJECT_URL = 'https://raneitkthnzfilpifqck.supabase.co';
const CANONICAL_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhbmVpdGt0aG56ZmlscGlmcWNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTM0NzQzNywiZXhwIjoyMTA2OTIzNDM3fQ.1epJLl086IuJ4jLTdnc7j8CBY_sJiYMI9xYS7zppzag';
const CANONICAL_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhbmVpdGt0aG56ZmlscGlmcWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzNDc0MzcsImV4cCI6MjEwNjkyMzQzN30.jAy90fypio5q39rZAVZRIhrvFN6pH38b9rn6aXZXgiE';

function resolveProjectUrl(customUrl = null) {
  if (customUrl) return customUrl.trim().replace(/\/$/, "");
  const envUrl = process.env.SUPABASE_URL;
  // Guard against foreign project mixup (e.g. SmartFix Energy project qfmeylybzvtjoabykblh)
  if (envUrl && !envUrl.includes('qfmeylybzvtjoabykblh') && envUrl.includes('supabase.co')) {
    return envUrl.trim().replace(/\/$/, "");
  }
  return CANONICAL_PROJECT_URL;
}

function resolveProjectKey(customKey = null, targetUrl = CANONICAL_PROJECT_URL) {
  if (customKey) return customKey.trim();
  const envKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (targetUrl === CANONICAL_PROJECT_URL) {
    if (envKey && envKey.includes('raneitkthnzfilpifqck')) {
      return envKey.trim();
    }
    return CANONICAL_SERVICE_ROLE_KEY;
  }
  return envKey || CANONICAL_SERVICE_ROLE_KEY;
}

let supabase = null;

function getSupabaseClient() {
  if (supabase) return supabase;

  const url = resolveProjectUrl();
  const key = resolveProjectKey(null, url);

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
  const url = resolveProjectUrl(customUrl);
  const key = resolveProjectKey(customKey, url);

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

    // Test ping by querying catalogue or lyrics_records table
    let { data, error } = await testClient.from('catalogue').select('id').limit(1);

    if (error) {
      const secCheck = await testClient.from('lyrics_records').select('id').limit(1);
      if (!secCheck.error) {
        error = null;
        data = secCheck.data;
      }
    }

    if (error) {
      if (error.code === '42P01' || error.message.includes('relation') || error.code === 'PGRST205' || error.message.includes('not found')) {
        return {
          connected: true,
          configured: true,
          tablesInitialized: false,
          url,
          status: "CONNECTED_SCHEMA_PENDING",
          message: 'Connected to Supabase successfully! Run data/supabase-schema.sql to create tables.'
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
      message: 'Successfully connected and verified against live Supabase database tables.'
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

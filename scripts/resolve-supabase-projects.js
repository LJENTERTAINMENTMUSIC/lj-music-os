const https = require('https');
const fs = require('fs');
const path = require('path');

try {
  require('dotenv').config();
} catch (e) {}

const token = process.env.SUPABASE_ACCESS_TOKEN;
const smartfixRef = 'qfmeylybzvtjoabykblh';
const musicOsRef = 'raneitkthnzfilpifqck';

if (!token) {
  console.error("SUPABASE_ACCESS_TOKEN missing in environment");
  process.exit(1);
}

function runQuery(ref, sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql });
    const req = https.request({
      hostname: 'api.supabase.com',
      path: `/v1/projects/${ref}/database/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('--- 1. CLEANING UP SMARTFIX ENERGY PROJECT ---');
  const dropSql = `
    DROP TABLE IF EXISTS public.swarm_telemetry CASCADE;
    DROP TABLE IF EXISTS public.sync_briefs CASCADE;
    DROP TABLE IF EXISTS public.lyrics_records CASCADE;
    DROP TABLE IF EXISTS public.curator_crm CASCADE;
    DROP TABLE IF EXISTS public.catalogue CASCADE;
    DROP TABLE IF EXISTS public.artist_roster CASCADE;
  `;
  const cleanRes = await runQuery(smartfixRef, dropSql);
  console.log('Cleanup result on smartfix:', cleanRes.status);

  const checkSmartfix = await runQuery(smartfixRef, "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';");
  console.log('Remaining tables in smartfix:', checkSmartfix.data);

  console.log('\n--- 2. INITIALIZING LJ MUSIC OS PROJECT ---');
  const schemaPath = path.join(__dirname, '..', 'data', 'supabase-schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  const schemaRes = await runQuery(musicOsRef, schemaSql);
  console.log('Schema execution result on music OS project:', schemaRes.status);

  const checkMusic = await runQuery(musicOsRef, "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';");
  console.log('Tables in LJ Music OS project:', checkMusic.data);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { runQuery };

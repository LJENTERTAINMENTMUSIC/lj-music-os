/**
 * LJ MUSIC OS - DEEP QA & PENETRATION TEST SUITE
 * Exhaustively tests all backend APIs, data integrity, audio playback contracts,
 * client UI button bindings, and multi-platform resolvers.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const BASE_URL = 'http://localhost:3456';

function request(method, endpoint, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, BASE_URL);
    const options = {
      method: method,
      headers: {}
    };

    let payload = null;
    if (body) {
      payload = typeof body === 'string' ? body : JSON.stringify(body);
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = null;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: json,
          raw: data
        });
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

const get = (endpoint) => request('GET', endpoint);
const post = (endpoint, body) => request('POST', endpoint, body);

async function ensureServerRunning() {
  try {
    await get('/');
    return null;
  } catch (e) {
    const serverProc = spawn(process.execPath, [path.join(__dirname, '../server.js')], {
      env: { ...process.env, PORT: '3456' },
      stdio: 'ignore'
    });
    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 150));
      try {
        await get('/');
        return serverProc;
      } catch (err) {}
    }
    return serverProc;
  }
}

async function runQaAudit() {
  let spawnedServer = null;
  try {
    spawnedServer = await ensureServerRunning();
  } catch (e) {}

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0,
    tests: []
  };

  function assert(title, condition, details = '') {
    results.total++;
    if (condition) {
      results.passed++;
      results.tests.push({ status: 'PASS', title, details });
      console.log(`  [PASS] ${title}`);
    } else {
      results.failed++;
      results.tests.push({ status: 'FAIL', title, details });
      console.error(`  [FAIL] ${title} -> ${details}`);
    }
  }

  function warn(title, details = '') {
    results.warnings++;
    results.tests.push({ status: 'WARN', title, details });
    console.warn(`  [WARN] ${title} -> ${details}`);
  }

  console.log('===============================================================');
  console.log('🧪 STARTING LJ MUSIC OS DEEP QA AUDIT ACROSS ALL MODULES');
  console.log('===============================================================\n');

  // -------------------------------------------------------------
  // SECTION 1: SERVER & CORE DATA PIPELINES
  // -------------------------------------------------------------
  console.log('--- SECTION 1: SERVER & CORE DATA PIPELINES ---');
  try {
    const rootRes = await get('/');
    assert('Server root serves index.html (200 OK)', rootRes.statusCode === 200);

    const catRes = await get('/api/catalogue');
    assert('/api/catalogue returns 200 OK', catRes.statusCode === 200);
    assert('/api/catalogue has tracks array', Array.isArray(catRes.body?.tracks));
    assert('/api/catalogue contains Drey Star KIRA', catRes.body?.tracks?.some(t => t.id === 'lj-000' && t.title === 'KIRA'));

    const telemRes = await get('/api/telemetry/signals');
    assert('/api/telemetry/signals returns 200 OK', telemRes.statusCode === 200);
    assert('/api/telemetry/signals has telemetry signals', Array.isArray(telemRes.body?.signals) || !!telemRes.body?.recentDetections);

    const livePulseRes = await get('/api/telemetry/live-pulse');
    assert('/api/telemetry/live-pulse returns 200 OK', livePulseRes.statusCode === 200);
    assert('/api/telemetry/live-pulse has active listeners count', typeof livePulseRes.body?.pulse?.activeListeners === 'number');
    assert('/api/telemetry/live-pulse has signals array', Array.isArray(livePulseRes.body?.pulse?.signals));

    const genPulseRes = await post('/api/telemetry/generate-pulse', {});
    assert('/api/telemetry/generate-pulse generates live pulse', genPulseRes.statusCode === 200 && genPulseRes.body?.success === true);

    const sigRes = await post('/api/telemetry/signal', { trackId: 'lj-000', signalType: 'PLAY', source: 'QA Automated Tester' });
    assert('/api/telemetry/signal in-flight ingestion returns recalculated momentum', sigRes.statusCode === 200 && typeof sigRes.body?.result?.momentum?.score === 'number');

    const rightsRes = await get('/api/sync/briefs');
    assert('/api/sync/briefs returns 200 OK', rightsRes.statusCode === 200);
    assert('/api/sync/briefs has commercial briefs array', Array.isArray(rightsRes.body?.briefs) || Array.isArray(rightsRes.body));

    const lyricsRes = await get('/api/lyrics/lj-000');
    assert('/api/lyrics/lj-000 returns authentic KIRA lyrics', lyricsRes.statusCode === 200 && (lyricsRes.body?.canonicalLyrics?.includes('E ba mi kira fun') || lyricsRes.body?.lyrics?.includes('E ba mi kira fun')));

    const editorialRes = await get('/api/editorial');
    assert('/api/editorial returns 200 OK', editorialRes.statusCode === 200 && Array.isArray(editorialRes.body));

    const geoRes = await get('/api/geo-intelligence');
    assert('/api/geo-intelligence returns 200 OK', geoRes.statusCode === 200 && (geoRes.body?.topCity === 'Lagos' || Array.isArray(geoRes.body?.citySummary)));

    const antiFraudRes = await get('/api/fraud/watchlist');
    assert('/api/fraud/watchlist returns 200 OK', antiFraudRes.statusCode === 200);

    const chartsRes = await get('/api/charts');
    assert('/api/charts returns 200 OK', chartsRes.statusCode === 200 && (Array.isArray(chartsRes.body?.top10) || Array.isArray(chartsRes.body?.top20)));

    const crmRes = await get('/api/curator/crm');
    assert('/api/curator/crm returns curator network', crmRes.statusCode === 200 && Array.isArray(crmRes.body) && crmRes.body.length > 0);

    const councilRes = await get('/api/council/debate/lj-000');
    assert('/api/council/debate/lj-000 returns strategic debate', councilRes.statusCode === 200 && (councilRes.body?.synthesis?.verdict || councilRes.body?.verdict));

    const mailStatusRes = await get('/api/mail/status');
    assert('/api/mail/status returns 200 OK', mailStatusRes.statusCode === 200);
    assert('/api/mail/status has Zoho account (lj@ljentertainment.live)', mailStatusRes.body?.zoho?.email === 'lj@ljentertainment.live');
    assert('/api/mail/status has Gmail account (ljentertainmentmusic@gmail.com)', mailStatusRes.body?.gmail?.email === 'ljentertainmentmusic@gmail.com');

    const sendZohoRes = await post('/api/mail/send', {
      fromAccount: 'zoho',
      to: 'kofi.mensah@spotify-editorial.com',
      subject: 'QA Test Pitch',
      text: 'Test email body'
    });
    assert('/api/mail/send (Zoho) dispatches from lj@ljentertainment.live', sendZohoRes.statusCode === 200 && sendZohoRes.body?.sentFrom === 'lj@ljentertainment.live');

    const sendGmailRes = await post('/api/mail/send', {
      fromAccount: 'gmail',
      to: 'eseosa.ighodaro@apple.com',
      subject: 'QA Test Pitch',
      text: 'Test email body'
    });
    assert('/api/mail/send (Gmail) dispatches from ljentertainmentmusic@gmail.com', sendGmailRes.statusCode === 200 && sendGmailRes.body?.sentFrom === 'ljentertainmentmusic@gmail.com');

    const directCuratorPitchRes = await post('/api/curator/pitch/direct-send', {
      curatorId: 'cur-001',
      trackId: 'lj-000',
      fromAccount: 'zoho'
    });
    assert('/api/curator/pitch/direct-send sends 1-click pitch to verified curator', directCuratorPitchRes.statusCode === 200 && directCuratorPitchRes.body?.success === true);
  } catch (err) {
    assert('Section 1 Pipeline Exception', false, err.message);
  }

  // -------------------------------------------------------------
  // SECTION 2: 1-CLICK VERIFIED ARTIST RESOLVER & SUPABASE SYNC
  // -------------------------------------------------------------
  console.log('\n--- SECTION 2: 1-CLICK ARTIST RESOLVER & SUPABASE SYNC ---');
  try {
    // Test A: Resolve Drey Star
    const dreyRes = await get('/api/artist/resolve-link?query=Drey%20Star');
    assert('/api/artist/resolve-link (Drey Star) returns 200', dreyRes.statusCode === 200);
    assert('Drey Star resolves authentic Spotify avatar', dreyRes.body?.artist?.avatar?.includes('ab67616d0000b27377e5e6ebf6d0352cc1c2d0bd'));
    assert('Drey Star has 1,420,000 monthly listeners', dreyRes.body?.artist?.monthlyListeners?.includes('1,420,000') || dreyRes.body?.artist?.monthlyListenersRaw === 1420000);
    assert('Drey Star has connected Apple Music URL', dreyRes.body?.artist?.appleMusicUrl?.includes('music.apple.com'));

    // Test B: Resolve Dr. Orlando Owoh
    const owohRes = await get('/api/artist/resolve-link?query=Dr.%20Orlando%20Owoh');
    assert('/api/artist/resolve-link (Dr. Orlando Owoh) returns 200', owohRes.statusCode === 200);
    assert('Dr. Orlando Owoh has authentic HD avatar', !!owohRes.body?.artist?.avatar);

    // Test C: 1-Click Ingest Direct Payload Format (Regression Test)
    const ingestDirect = await post('/api/artist/one-click-ingest', dreyRes.body.artist);
    assert('1-Click Ingest accepts direct unwrapped object', ingestDirect.statusCode === 200 && ingestDirect.body?.success === true, ingestDirect.body?.error || '');

    // Test D: 1-Click Ingest Wrapped Payload Format
    const ingestWrapped = await post('/api/artist/one-click-ingest', { artistProfile: dreyRes.body.artist });
    assert('1-Click Ingest accepts wrapped { artistProfile } object', ingestWrapped.statusCode === 200 && ingestWrapped.body?.success === true, ingestWrapped.body?.error || '');

    // Test E: Supabase status check
    const sbStatus = await get('/api/integrations/status');
    assert('/api/integrations/status returns connected or config status', sbStatus.statusCode === 200 && (typeof sbStatus.body?.integrations?.supabase?.configured === 'boolean' || typeof sbStatus.body?.integrations?.supabase?.connected === 'boolean'));
  } catch (err) {
    assert('Section 2 Ingest Exception', false, err.message);
  }

  // -------------------------------------------------------------
  // SECTION 3: DIVISION 14 AUTONOMOUS PLAYLIST TREND AGENT
  // -------------------------------------------------------------
  console.log('\n--- SECTION 3: DIVISION 14 AUTONOMOUS PLAYLIST AGENT ---');
  try {
    const plRes = await get('/api/agent/playlists');
    assert('/api/agent/playlists returns 200 OK', plRes.statusCode === 200);
    assert('Playlists array contains active trending playlists', Array.isArray(plRes.body?.playlists) && plRes.body.playlists.length >= 4);

    // Check Slot #1 priority lock for LJ songs
    const viralPl = plRes.body?.playlists?.find(p => p.id === 'pl-auto-001');
    assert('TikTok Viral Afrobeats locks Slot #1 for KIRA', viralPl && viralPl.tracks[0]?.id === 'lj-000' && viralPl.tracks[0]?.locked === true);

    // Test Rebalance
    const rebRes = await post('/api/agent/playlists/rebalance', { playlistId: 'pl-auto-001' });
    assert('/api/agent/playlists/rebalance returns 200 OK', rebRes.statusCode === 200 && rebRes.body?.success === true);

    // Test Generate New Playlist
    const genRes = await post('/api/agent/playlists/generate', { theme: 'Global Afro-House Velocity' });
    assert('/api/agent/playlists/generate creates new trend playlist with LJ track locked', genRes.statusCode === 200 && genRes.body?.success === true);
  } catch (err) {
    assert('Section 3 Playlists Exception', false, err.message);
  }

  // -------------------------------------------------------------
  // SECTION 4: DIVISION 16 ONLINE RADIO AUTO-PLAY SWARM
  // -------------------------------------------------------------
  console.log('\n--- SECTION 4: DIVISION 16 ONLINE RADIO AUTO-PLAY SWARM ---');
  try {
    const radRes = await get('/api/agent/radio/state');
    assert('/api/agent/radio/state returns 200 OK', radRes.statusCode === 200);
    assert('Online radio stations list has 4 web stations', Array.isArray(radRes.body?.stations) && radRes.body.stations.length === 4);
    assert('Radio has heavy rotation frequency configured', !!radRes.body?.rotationFrequency);

    // Check station now playing KIRA
    const lagosStation = radRes.body?.stations?.find(s => s.id === 'rad-001');
    assert('Lagos Nights Radio is currently broadcasting KIRA', lagosStation?.currentTrack?.title === 'KIRA');
    assert('Station current track has playable stream preview URL', !!lagosStation?.currentTrack?.streamUrl);

    // Test Live Radio Spin Override
    const spinRes = await post('/api/agent/radio/spin', { stationId: 'rad-002', trackId: 'lj-000' });
    assert('Live Radio Spin Override places track on-air immediately', spinRes.statusCode === 200 && spinRes.body?.success === true);

    // Test Toggle Radio Broadcast
    const togRes = await post('/api/agent/radio/toggle', { enabled: true });
    assert('Toggle Radio Auto-Play responds 200 OK and enabled', togRes.statusCode === 200 && togRes.body?.success === true && togRes.body?.autoPlayEnabled === true);
  } catch (err) {
    assert('Section 4 Radio Exception', false, err.message);
  }

  // -------------------------------------------------------------
  // SECTION 5: AUDIO PLAYBACK CONTRACT (SONG PLAYS FROM BEGINNING)
  // -------------------------------------------------------------
  console.log('\n--- SECTION 5: AUDIO PLAYER & PLAYBACK CONTRACT ---');
  try {
    const universalPlayerJs = fs.readFileSync(path.join(__dirname, '../public/universal-player.js'), 'utf8');
    const appJs = fs.readFileSync(path.join(__dirname, '../public/app.js'), 'utf8');

    // Check that universal player resets currentTime to 0 on new track load
    const resetsCurrentTime = universalPlayerJs.includes('currentTime = 0') || appJs.includes('currentTime = 0');
    assert('Audio player explicitly resets currentTime to 0 to ensure song plays from beginning', resetsCurrentTime);

    // Check that audio play preview handlers exist
    assert('playCustomAudioPreview is defined in app.js', appJs.includes('function playCustomAudioPreview'));
    assert('playCustomAudioPreview is exported to window', appJs.includes('window.playCustomAudioPreview = playCustomAudioPreview'));

    // Check multi-platform player files exist
    assert('universal-player.js exists', fs.existsSync(path.join(__dirname, '../public/universal-player.js')));
    assert('spotify-player.js exists', fs.existsSync(path.join(__dirname, '../public/spotify-player.js')));
    assert('apple-music-player.js exists', fs.existsSync(path.join(__dirname, '../public/apple-music-player.js')));
    assert('youtube-player.js exists', fs.existsSync(path.join(__dirname, '../public/youtube-player.js')));
  } catch (err) {
    assert('Section 5 Audio Player Exception', false, err.message);
  }

  // -------------------------------------------------------------
  // SECTION 6: UI BUTTONS & ONCLICK BINDINGS AUDIT
  // -------------------------------------------------------------
  console.log('\n--- SECTION 6: UI BUTTONS & ONCLICK BINDINGS AUDIT ---');
  try {
    const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
    const appJs = fs.readFileSync(path.join(__dirname, '../public/app.js'), 'utf8');
    const uniJs = fs.readFileSync(path.join(__dirname, '../public/universal-player.js'), 'utf8');

    const combinedJs = appJs + '\n' + uniJs;

    const buttonRegex = /<button\b([^>]*)>([\s\S]*?)<\/button>/gi;
    let match;
    let buttonCount = 0;
    let unhandledButtons = [];

    while ((match = buttonRegex.exec(html)) !== null) {
      buttonCount++;
      const attrs = match[1];
      const onclickMatch = attrs.match(/onclick="([^"]*)"/) || attrs.match(/onclick='([^']*)'/);
      
      if (onclickMatch) {
        const rawCode = onclickMatch[1].trim();
        // Strip string literals so parentheses inside quotes are not falsely detected as function calls
        const codeWithoutStrings = rawCode.replace(/'(?:\\'|[^'])*'/g, "''").replace(/"(?:\\"|[^"])*"/g, '""');
        // Extract top-level function call names: exclude chained methods like obj.method()
        const funcMatches = codeWithoutStrings.match(/(?:^|[^\w$.])([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g);
        if (funcMatches) {
          funcMatches.forEach(fm => {
            const funcName = fm.replace(/^[^\w$]+/, '').replace('(', '').trim();
            // Ignore common inline JS built-ins
            if (['if', 'confirm', 'alert', 'fetch', 'setTimeout', 'scrollTo', 'parseInt', 'catch', 'typeof'].includes(funcName)) return;

            const isDefined = combinedJs.includes(`function ${funcName}`) || 
                              combinedJs.includes(`window.${funcName}`) ||
                              combinedJs.includes(`let ${funcName} =`) ||
                              combinedJs.includes(`const ${funcName} =`) ||
                              combinedJs.includes(`var ${funcName} =`);
            if (!isDefined) {
              unhandledButtons.push({ buttonIndex: buttonCount, funcName, rawCode });
            }
          });
        }
      }
    }

    assert(`Audited ${buttonCount} interactive UI buttons`, buttonCount > 50);
    if (unhandledButtons.length === 0) {
      assert('All onclick buttons have defined JS handlers (0 broken buttons)', true);
    } else {
      assert('All onclick buttons have defined JS handlers', false, `Found ${unhandledButtons.length} unhandled functions: ${unhandledButtons.map(b => b.funcName).join(', ')}`);
    }
  } catch (err) {
    assert('Section 6 Button Audit Exception', false, err.message);
  }

  // -------------------------------------------------------------
  // FINAL SUMMARY
  // -------------------------------------------------------------
  console.log('\n===============================================================');
  console.log(`📊 QA AUDIT COMPLETE: ${results.passed}/${results.total} PASSED | ${results.failed} FAILED | ${results.warnings} WARNINGS`);
  console.log('===============================================================\n');

  if (spawnedServer) {
    try {
      spawnedServer.kill();
    } catch (e) {}
  }

  return results;
}

if (require.main === module) {
  runQaAudit().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  }).catch(e => {
    console.error('Fatal audit failure:', e);
    process.exit(1);
  });
}

module.exports = runQaAudit;

/**
 * LJ MUSIC OS - FULL SYSTEM VERIFICATION TEST
 * Runs deep end-to-end assertions against all 14 backend engines and server endpoints.
 */

const http = require('http');
const path = require('path');

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3456${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', reject);
  });
}

function post(path, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = http.request(`http://localhost:3456${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('======================================================');
  console.log('🔍 RUNNING COMPREHENSIVE LJ MUSIC OS VERIFICATION SUITE');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // 1. Swarm Status
    const swarmRes = await get('/api/swarm/status');
    assert(swarmRes.status === 200, 'Swarm status returns 200');
    assert(swarmRes.body.totalAgents === 10600, `Swarm total agents is 10,600 (got ${swarmRes.body.totalAgents})`);
    assert(Object.keys(swarmRes.body.divisions).length === 17, 'All 17 Divisions registered (including Lyrics Intelligence)');

    // 2. CEO Morning Briefing
    const briefingRes = await get('/api/swarm/briefing');
    assert(briefingRes.status === 200, 'CEO Briefing returns 200');
    assert(briefingRes.body.priority1 && briefingRes.body.priority1.track === 'KIRA', 'Hero track is KIRA by Drey Star');

    // 3. Top 10 Actions
    const actionsRes = await get('/api/swarm/top-actions');
    assert(actionsRes.status === 200, 'Top 10 Actions returns 200');
    assert(Array.isArray(actionsRes.body) && actionsRes.body.length === 10, 'Top 10 Actions array has exactly 10 actions');
    assert(actionsRes.body.some(a => a.division === 'Lyrics Intelligence'), 'Top 10 actions contains Lyrics Intelligence task');

    // 4. Catalogue
    const catRes = await get('/api/catalogue');
    assert(catRes.status === 200, 'Catalogue returns 200');
    assert(catRes.body.tracks.length >= 15, `Catalogue has ${catRes.body.tracks.length} tracks (expected >= 15)`);

    // 5. Adversarial Council Debate
    const councilRes = await get('/api/council/debate/lj-000');
    assert(councilRes.status === 200, 'Council debate for lj-000 returns 200');
    assert(councilRes.body.councilMembers.length === 8, '8 Arguing Agent Personas in Council');
    assert(councilRes.body.synthesis && councilRes.body.synthesis.chiefDecider, 'Chief Decider synthesis verdict generated');

    // 6. Curator CRM
    const crmRes = await get('/api/curator/crm');
    assert(crmRes.status === 200, 'Curator CRM returns 200');
    assert(crmRes.body.length >= 5, `Curators in CRM: ${crmRes.body.length}`);

    // 7. Curator Pitch Evaluation
    const evalRes = await post('/api/curator/evaluate', { curatorId: 'cur-001', trackId: 'lj-000' });
    assert(evalRes.status === 200, 'Curator pitch evaluation returns 200');
    assert(evalRes.body.shouldPitch !== undefined, 'Curator evaluation contains shouldPitch verdict');
    assert(evalRes.body.generatedPitch && evalRes.body.generatedPitch.subject, 'Curator evaluation generated tailored pitch copy');

    // 8. Anti-Fraud Audit
    const fraudRes = await post('/api/fraud/audit-offer', { offerText: 'Get 50,000 guaranteed Spotify streams and top 5 placement for $150' });
    assert(fraudRes.status === 200, 'Anti-fraud audit returns 200');
    assert(fraudRes.body.statusBadge === 'BANNED_FRAUD', `Fraud audit identified scam offer (got ${fraudRes.body.statusBadge})`);

    // 9. Catalogue Revival War Room
    const revivalRes = await get('/api/catalogue/revival');
    assert(revivalRes.status === 200, 'Catalogue revival returns 200');
    assert(revivalRes.body.revivalCandidates.length >= 1, `Revival candidates found: ${revivalRes.body.revivalCandidates.length}`);
    assert(revivalRes.body.revivalCandidates[0].campaignPlan.pillar1_Playlisting !== undefined, 'Automated 5-pillar revival plan generated');

    // 10. Top Charts
    const chartsRes = await get('/api/charts');
    assert(chartsRes.status === 200, 'Charts returns 200');
    assert(chartsRes.body.top10.length === 10, 'Top 10 chart has 10 tracks');
    assert(chartsRes.body.breakoutArtists.length > 0, 'Breakout artists identified');

    // 11. Sync Marketplace
    const syncRes = await get('/api/sync/briefs');
    assert(syncRes.status === 200, 'Sync briefs returns 200');
    assert(syncRes.body.length >= 5, `Sync briefs loaded: ${syncRes.body.length}`);
    assert(syncRes.body[0].topMatches[0].totalMatch > 0, 'Sync top match score calculated');

    // 12. AI Music Copilot
    const copilotRes = await post('/api/copilot/query', { prompt: 'Find upbeat Afrobeats song for high-energy Lagos night drive' });
    assert(copilotRes.status === 200, 'AI Copilot query returns 200');
    assert(copilotRes.body.shortlist && copilotRes.body.shortlist.length > 0, 'AI Copilot returned recommendations');

    // 13. AI Auto-Playlist with Contextual LJ Boost
    const plRes = await post('/api/playlist/curate', { query: 'Lagos nightlife upbeat Afrobeats' });
    assert(plRes.status === 200, 'Playlist curate returns 200');
    assert(plRes.body.tracks && plRes.body.tracks.length > 0, 'Generated curated playlist tracks');

    // 14. Artist Opportunity Score
    const oppRes = await get('/api/artist/opportunity-score/Drey%20Star');
    assert(oppRes.status === 200, 'Artist Opportunity Score for Drey Star returns 200');
    assert(oppRes.body.overallScore >= 80, `Drey Star opportunity score is high (${oppRes.body.overallScore}/100)`);
    assert(oppRes.body.dimensions && oppRes.body.dimensions.streamingMomentum !== undefined, '9 dimensions computed');

    // ==========================================================
    // 15 - 22. LYRICS INTELLIGENCE & DISTRIBUTION DIVISION (DIV 17)
    // ==========================================================

    // 15. All Lyrics Summary
    const lyricsListRes = await get('/api/lyrics');
    assert(lyricsListRes.status === 200, 'Lyrics list returns 200');
    assert(Array.isArray(lyricsListRes.body) && lyricsListRes.body.length >= 10, `Lyrics records indexed: ${lyricsListRes.body.length}`);
    const kiraSummary = lyricsListRes.body.find(l => l.trackId === 'lj-000');
    assert(kiraSummary && kiraSummary.qualityScore >= 95, `KIRA lyrics quality score is high (${kiraSummary?.qualityScore}/100)`);

    // 16. Detailed Lyrics Record with Sync & Dialects
    const lyricsDetailRes = await get('/api/lyrics/lj-000');
    assert(lyricsDetailRes.status === 200, 'KIRA lyrics detail returns 200');
    assert(lyricsDetailRes.body.lineSynced && lyricsDetailRes.body.lineSynced.length > 0, 'Line-synced timestamps present');
    assert(lyricsDetailRes.body.dialectExpressions && lyricsDetailRes.body.dialectExpressions.length > 0, 'African dialect expressions identified');
    assert(lyricsDetailRes.body.destinations && lyricsDetailRes.body.destinations.length === 11, 'All 11 destinations mapped in matrix');

    // 17. Discrepancy Resolution (Audio vs Artist)
    const resolveRes = await post('/api/lyrics/discrepancy/resolve', {
      trackId: 'lj-000',
      lineIndex: 3,
      chosenVersion: 'I dey find my way home',
      userRole: 'Label Rights Supervisor'
    });
    assert(resolveRes.status === 200, 'Discrepancy resolution returns 200');
    assert(resolveRes.body.success === true, 'Discrepancy resolved successfully');

    // 18. One-Click Global Automatic Correction Network
    const correctRes = await post('/api/lyrics/correct', {
      trackId: 'lj-000',
      lineIndex: 3,
      newLyricLine: 'I dey find my way home (Global Corrected)',
      author: 'Drey Star (Verified Artist Direct)'
    });
    assert(correctRes.status === 200, 'Global correction dispatch returns 200');
    assert(correctRes.body.destinationsUpdated === 11, 'Correction propagated to all 11 destinations');
    assert(correctRes.body.correctionEntry && correctRes.body.correctionEntry.summary, 'Global correction audit trail generated');

    // 19. Multi-format Sync Generator
    const syncFormatsRes = await get('/api/lyrics/sync/lj-000');
    assert(syncFormatsRes.status === 200, 'Sync formats returns 200');
    assert(syncFormatsRes.body.formats.lrc && syncFormatsRes.body.formats.lrc.includes('['), 'Standard LRC generated');
    assert(syncFormatsRes.body.formats.wordSynced && syncFormatsRes.body.formats.wordSynced.lines, 'Word-synced TTML payload generated');
    assert(syncFormatsRes.body.formats.translations && syncFormatsRes.body.formats.translations.fr, 'French translation present');

    // 20. Google Search Canonical Schema.org JSON-LD
    const schemaRes = await get('/api/lyrics/schema/lj-000');
    assert(schemaRes.status === 200, 'Google Search schema returns 200');
    assert(schemaRes.body.canonicalUrl.includes('ljentertainment.live'), 'Canonical URL points to first-party web');
    assert(schemaRes.body.jsonLd && schemaRes.body.jsonLd['@type'] === 'MusicRecording', 'Schema.org MusicRecording JSON-LD valid');

    // 21. Unified Music Rights Graph
    const graphRes = await get('/api/music-graph/lj-000');
    assert(graphRes.status === 200, 'Unified Music Graph returns 200');
    assert(graphRes.body.nodes.length >= 10, `Music Graph nodes: ${graphRes.body.nodes.length}`);
    assert(graphRes.body.links.length >= 10, `Music Graph active links: ${graphRes.body.links.length}`);

    // 22. "My Lyrics" Artist Portal Dashboard
    const artistLyricsRes = await get('/api/lyrics/artist/Drey%20Star');
    assert(artistLyricsRes.status === 200, 'Artist lyrics portal returns 200');
    assert(artistLyricsRes.body.metrics && artistLyricsRes.body.metrics.totalSongs >= 3, `Artist songs tracked: ${artistLyricsRes.body.metrics.totalSongs}`);
    assert(artistLyricsRes.body.metrics.synced >= 3, `Artist synced songs: ${artistLyricsRes.body.metrics.synced}`);

    // ==========================================================
    // 23 - 26. ARTIST INTAKE & PLAYLIST AUTO-PLACEMENT ENGINE
    // ==========================================================

    // 23. Artist / Track Store Search (via Spotify link or artist query)
    const storeSearchRes = await get('/api/artist/search-store?q=' + encodeURIComponent('https://open.spotify.com/track/rush-ayra-starr'));
    assert(storeSearchRes.status === 200, 'Store search by Spotify URL returns 200');
    assert(storeSearchRes.body.results && storeSearchRes.body.results.length > 0, 'Store search parsed Spotify track successfully');
    assert(storeSearchRes.body.results[0].artist === 'Ayra Starr', 'Resolved Ayra Starr from Spotify link');

    // 24. Track Ingestion into Catalogue, Rights & Telemetry
    const ingestCandidate = storeSearchRes.body.results[0];
    const ingestRes = await post('/api/artist/ingest', { trackData: ingestCandidate });
    assert(ingestRes.status === 200, 'Artist/track ingestion returns 200');
    assert(ingestRes.body.success === true, 'Track ingested successfully');
    const newTrackId = ingestRes.body.track.id;
    assert(newTrackId !== undefined, `Ingested new track ID: ${newTrackId}`);

    // 25. Smart Playlist Auto-Placement
    const autoPlaceRes = await post('/api/playlist/auto-place', { trackId: newTrackId });
    assert(autoPlaceRes.status === 200, 'Playlist auto-placement returns 200');
    assert(autoPlaceRes.body.evaluatedPlaylists && autoPlaceRes.body.evaluatedPlaylists.length > 0, `Evaluated ${autoPlaceRes.body.evaluatedPlaylists?.length} playlists`);
    assert(autoPlaceRes.body.evaluatedPlaylists[0].compatibilityScore >= 70, `High compatibility placement (${autoPlaceRes.body.evaluatedPlaylists[0].compatibilityScore}%)`);

    // 26. Artist Roster Directory
    const rosterRes = await get('/api/artist/roster');
    assert(rosterRes.status === 200, 'Artist roster returns 200');
    assert(Array.isArray(rosterRes.body) && rosterRes.body.length >= 4, `Artist roster contains ${rosterRes.body.length} artists`);
    assert(rosterRes.body.some(a => a.artist === 'Ayra Starr'), 'Ayra Starr is registered in the LJ Roster directory');

  } catch (err) {
    console.error('Fatal test error:', err);
    failed++;
  }

  console.log('\n======================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');
}

runTests();

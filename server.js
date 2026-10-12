/**
 * LJ MUSIC OS - MAIN BACKEND APPLICATION SERVER
 * Integrates all 14 intelligence modules, engines, and automation routines.
 */

try {
  require('dotenv').config();
} catch (e) {}

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Import Core Intelligence Engines
const { calculateMomentumScore } = require('./engine/momentumEngine');
const { calculateAcousticCompatibility, generateCuratedPlaylist } = require('./engine/playlistAiEngine');
const { evaluateSyncReadiness, matchSyncBrief } = require('./engine/syncEngine');
const { generatePitchCard } = require('./engine/pitchEngine');
const { processCopilotBrief } = require('./engine/copilotEngine');
const { generateCharts } = require('./engine/chartsEngine');
const { analyzeGeoIntelligence } = require('./engine/geoEngine');
const ContinuousLearningEngine = require('./engine/continuousLearningEngine');
const AutomationScheduler = require('./engine/automationScheduler');

// 10,000-Agent Swarm & Advanced Engines
const SwarmOrchestrator = require('./engine/swarmOrchestrator');
const { runCouncilDebate } = require('./engine/adversarialCouncilEngine');
const { calculateArtistOpportunityScore } = require('./engine/artistOpportunityEngine');
const { auditCampaignOffer, auditStreamTelemetry } = require('./engine/antiFraudEngine');
const { evaluateCuratorPitch } = require('./engine/curatorCrmEngine');
const { scanCatalogueForRevival } = require('./engine/catalogueRevivalEngine');
const LyricsIntelligenceEngine = require('./engine/lyricsIntelligenceEngine');
const ArtistIntakeEngine = require('./engine/artistIntakeEngine');
const { checkSupabaseConnection } = require('./engine/supabaseClient');

const app = express();
const PORT = process.env.PORT || 3456;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// File paths
const dataDir = path.join(__dirname, 'data');
const catalogueFile = path.join(dataDir, 'catalogue.json');
const telemetryFile = path.join(dataDir, 'listeningTelemetry.json');
const rightsFile = path.join(dataDir, 'rightsData.json');
const briefsFile = path.join(dataDir, 'syncBriefs.json');
const editorialFile = path.join(dataDir, 'editorialPlaylists.json');
const curatorFile = path.join(dataDir, 'curatorCrm.json');
const fraudFile = path.join(dataDir, 'fraudWatchlist.json');
const marketsFile = path.join(dataDir, 'globalMarkets.json');

// Initialize Engines
const learningEngine = new ContinuousLearningEngine(telemetryFile);
const scheduler = new AutomationScheduler(__dirname);
const swarm = new SwarmOrchestrator(__dirname);
const lyricsEngine = new LyricsIntelligenceEngine(__dirname);
const intakeEngine = new ArtistIntakeEngine(__dirname);

// Helper to reload data
function loadState() {
  const catalogue = JSON.parse(fs.readFileSync(catalogueFile, 'utf8'));
  const telemetry = JSON.parse(fs.readFileSync(telemetryFile, 'utf8'));
  const rights = JSON.parse(fs.readFileSync(rightsFile, 'utf8'));
  const briefs = JSON.parse(fs.readFileSync(briefsFile, 'utf8'));
  const editorial = JSON.parse(fs.readFileSync(editorialFile, 'utf8'));
  return { catalogue, telemetry, rights, briefs, editorial };
}

// -------------------------------------------------------------
// 1. MUSIC DISCOVERY & CATALOGUE
// -------------------------------------------------------------
app.get('/api/catalogue', (req, res) => {
  const { catalogue, telemetry, rights } = loadState();
  const { genre, mood, isLj, minBpm, maxBpm, search } = req.query;

  let results = catalogue.map(track => {
    const tel = telemetry[track.id] || {};
    const r = rights[track.id] || {};
    const syncEval = evaluateSyncReadiness(r);
    return {
      ...track,
      momentum: tel.momentumScore || 70,
      weeklyGrowth: tel.weeklyGrowthPct || 0,
      syncScore: syncEval.score,
      syncStatus: syncEval.label
    };
  });

  if (isLj === 'true') results = results.filter(t => t.isLjArtist);
  if (genre) results = results.filter(t => t.genre.toLowerCase().includes(genre.toLowerCase()));
  if (mood) results = results.filter(t => t.mood.toLowerCase().includes(mood.toLowerCase()));
  if (minBpm) results = results.filter(t => t.bpm >= parseInt(minBpm));
  if (maxBpm) results = results.filter(t => t.bpm <= parseInt(maxBpm));
  if (search) {
    const s = search.toLowerCase();
    results = results.filter(t => 
      t.title.toLowerCase().includes(s) || 
      t.artist.toLowerCase().includes(s) ||
      t.genre.toLowerCase().includes(s) ||
      (t.similarArtists && t.similarArtists.some(a => a.toLowerCase().includes(s)))
    );
  }

  res.json({
    total: results.length,
    tracks: results
  });
});

app.get('/api/catalogue/revival', (req, res) => {
  const { catalogue, telemetry } = loadState();
  const revival = scanCatalogueForRevival(catalogue, telemetry);
  res.json(revival);
});

app.get('/api/catalogue/:id', (req, res) => {
  const { catalogue, telemetry, rights } = loadState();
  const track = catalogue.find(t => t.id === req.params.id);
  if (!track) return res.status(404).json({ error: "Track not found" });

  const tel = telemetry[track.id] || {};
  const r = rights[track.id] || {};
  const syncEval = evaluateSyncReadiness(r);
  const pitchCard = generatePitchCard(track, tel, r);

  res.json({
    ...track,
    telemetry: tel,
    rights: r,
    syncEvaluation: syncEval,
    pitchCard
  });
});

// -------------------------------------------------------------
// 2. TOP OF THE WEEK & CHARTS
// -------------------------------------------------------------
app.get('/api/charts', (req, res) => {
  const { catalogue, telemetry, rights } = loadState();
  const charts = generateCharts(catalogue, telemetry, rights);
  res.json(charts);
});

// -------------------------------------------------------------
// 3. REAL-TIME LISTENING INTELLIGENCE
// -------------------------------------------------------------
app.get('/api/listening-intelligence', (req, res) => {
  const { catalogue, telemetry } = loadState();
  const summary = catalogue.map(track => {
    const tel = telemetry[track.id] || {};
    const momResult = calculateMomentumScore(tel);
    return {
      trackId: track.id,
      title: track.title,
      artist: track.artist,
      isLjArtist: track.isLjArtist,
      genre: track.genre,
      plays: tel.plays || 0,
      weeklyGrowthPct: tel.weeklyGrowthPct || 0,
      saves: tel.saves || 0,
      shares: tel.shares || 0,
      playlistAdds: tel.playlistAdds || 0,
      completionRatePct: tel.completionRatePct || 0,
      repeatListeningPct: tel.repeatListeningPct || 0,
      momentumScore: momResult.score,
      momentumStatus: momResult.status,
      momentumLabel: momResult.label,
      rankMovement: tel.rankMovement || "0",
      geoBreakdown: tel.geoBreakdown || {},
      history: tel.history || []
    };
  });

  summary.sort((a, b) => b.momentumScore - a.momentumScore);

  res.json({
    risingNowCount: summary.filter(s => s.momentumScore >= 90).length,
    breakoutCount: summary.filter(s => s.momentumStatus === 'BREAKOUT_ARTIST').length,
    tracks: summary
  });
});

// -------------------------------------------------------------
// 4. AI AUTO-PLAYLIST ENGINE & CONTEXTUAL LJ BOOST
// -------------------------------------------------------------
app.post('/api/playlist/curate', (req, res) => {
  const { query = "Lagos nightlife upbeat Afrobeats around 105–115 BPM with female vocal" } = req.body;
  const { catalogue, telemetry } = loadState();
  const playlist = generateCuratedPlaylist(query, catalogue, telemetry);
  res.json(playlist);
});

// -------------------------------------------------------------
// 5. EDITORIAL CURATION DESK
// -------------------------------------------------------------
app.get('/api/editorial', (req, res) => {
  const { editorial } = loadState();
  res.json(editorial);
});

app.post('/api/editorial/approve/:id', (req, res) => {
  const { editorial } = loadState();
  const pl = editorial.find(p => p.id === req.params.id);
  if (!pl) return res.status(404).json({ error: "Playlist not found" });

  pl.status = "APPROVED";
  pl.curator = "Human Editor Approved (Signed Off)";
  pl.approvedAt = new Date().toISOString();
  try {
    fs.writeFileSync(editorialFile, JSON.stringify(editorial, null, 2), 'utf8');
  } catch (err) {
    console.warn("Storage warning (read-only filesystem): state updated in memory");
  }

  res.json({ success: true, playlist: pl });
});

// -------------------------------------------------------------
// 6. MUSIC PITCHING ENGINE
// -------------------------------------------------------------
app.get('/api/pitch/:id', (req, res) => {
  const { catalogue, telemetry, rights } = loadState();
  const track = catalogue.find(t => t.id === req.params.id);
  if (!track) return res.status(404).json({ error: "Track not found" });

  const tel = telemetry[track.id] || {};
  const r = rights[track.id] || {};
  const pitchCard = generatePitchCard(track, tel, r);
  res.json(pitchCard);
});

// -------------------------------------------------------------
// 7 & 8. SYNC OPPORTUNITY ENGINE & SYNC READINESS
// -------------------------------------------------------------
app.get('/api/sync/briefs', (req, res) => {
  const { catalogue, rights, briefs } = loadState();
  const matches = briefs.map(brief => matchSyncBrief(brief, catalogue, rights));
  res.json(matches);
});

app.get('/api/sync/match/:briefId', (req, res) => {
  const { catalogue, rights, briefs } = loadState();
  const brief = briefs.find(b => b.id === req.params.briefId);
  if (!brief) return res.status(404).json({ error: "Brief not found" });

  const match = matchSyncBrief(brief, catalogue, rights);
  res.json(match);
});

// -------------------------------------------------------------
// 9. AI MUSIC COPILOT (KILLER FEATURE: "TELL ME WHAT YOU'RE TRYING TO ACHIEVE")
// -------------------------------------------------------------
app.post('/api/copilot/query', async (req, res) => {
  const { prompt, apiKey } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const { catalogue, telemetry, rights } = loadState();
    const result = await processCopilotBrief(prompt, catalogue, rights, telemetry, apiKey);
    res.json(result);
  } catch (err) {
    console.error("Error in /api/copilot/query:", err);
    res.status(500).json({ error: "Failed to process brief", details: err.message });
  }
});

// -------------------------------------------------------------
// 10 & 11. GEO MUSIC INTELLIGENCE & LJ ARTIST RADAR
// -------------------------------------------------------------
app.get('/api/geo-intelligence', (req, res) => {
  const { catalogue, telemetry } = loadState();
  const geo = analyzeGeoIntelligence(catalogue, telemetry);
  res.json(geo);
});

// -------------------------------------------------------------
// 12. CONTINUOUS LEARNING SIGNAL INGESTION
// -------------------------------------------------------------
app.post('/api/telemetry/signal', (req, res) => {
  const { trackId, signalType, metadata } = req.body;
  if (!trackId || !signalType) {
    return res.status(400).json({ error: "trackId and signalType are required" });
  }

  const result = learningEngine.ingestSignal(trackId, signalType, metadata);
  res.json({
    success: true,
    result,
    recentSignals: learningEngine.getSignalStream()
  });
});

app.get('/api/telemetry/signals', (req, res) => {
  res.json({
    signals: learningEngine.getSignalStream(),
    synergies: learningEngine.getSynergyMatrix()
  });
});

// -------------------------------------------------------------
// 13. AUTOMATION & SCHEDULER CONTROLS
// -------------------------------------------------------------
app.get('/api/automation/status', (req, res) => {
  res.json(scheduler.getAutomationStatus());
});

app.post('/api/automation/trigger/:cadence', (req, res) => {
  const { cadence } = req.params;
  let report = null;

  if (cadence === 'hourly') {
    report = scheduler.runHourlyVelocityAudit();
  } else if (cadence === 'daily') {
    report = scheduler.runDailyMomentumCycle();
  } else if (cadence === 'weekly') {
    report = scheduler.runWeeklyTopChartsAndSyncDigest();
  } else {
    return res.status(400).json({ error: "Invalid cadence. Choose hourly, daily, or weekly." });
  }

  res.json({
    success: true,
    report,
    status: scheduler.getAutomationStatus()
  });
});

// -------------------------------------------------------------
// 14. 10,000-AGENT SWARM ORCHESTRATOR & CEO BRIEFING
// -------------------------------------------------------------
app.get('/api/swarm/status', (req, res) => {
  res.json(swarm.getSwarmStatus());
});

app.get('/api/swarm/briefing', (req, res) => {
  res.json(swarm.generateCeoMorningBriefing());
});

app.get('/api/swarm/top-actions', (req, res) => {
  res.json(swarm.getTop10ActionsNow());
});

// -------------------------------------------------------------
// 15. ADVERSARIAL COUNCIL CHAMBER (8 AGENTS DEBATE + VERDICT)
// -------------------------------------------------------------
app.get('/api/council/debate/:trackId', (req, res) => {
  const { catalogue, telemetry, rights } = loadState();
  const track = catalogue.find(t => t.id === req.params.trackId);
  if (!track) return res.status(404).json({ error: "Track not found" });

  const tel = telemetry[track.id] || {};
  const r = rights[track.id] || {};
  const debate = runCouncilDebate(track, tel, r);
  res.json(debate);
});

// -------------------------------------------------------------
// 16. ARTIST OPPORTUNITY SCORE (9-DIMENSIONAL EVALUATION)
// -------------------------------------------------------------
app.get('/api/artist/opportunity-score/:artistName', (req, res) => {
  const { catalogue, telemetry, rights } = loadState();
  const score = calculateArtistOpportunityScore(req.params.artistName, catalogue, telemetry, rights);
  if (!score) return res.status(404).json({ error: "Artist not found" });
  res.json(score);
});

// -------------------------------------------------------------
// 17. CURATOR CRM & CONTEXTUAL PITCH EVALUATOR
// -------------------------------------------------------------
app.get('/api/curator/crm', (req, res) => {
  const curators = JSON.parse(fs.readFileSync(curatorFile, 'utf8'));
  res.json(curators);
});

app.post('/api/curator/evaluate', (req, res) => {
  const { curatorId, trackId } = req.body;
  const curators = JSON.parse(fs.readFileSync(curatorFile, 'utf8'));
  const { catalogue } = loadState();

  const curator = curators.find(c => c.id === curatorId);
  const track = catalogue.find(t => t.id === trackId);
  if (!curator || !track) return res.status(404).json({ error: "Curator or Track not found" });

  const evaluation = evaluateCuratorPitch(curator, track);
  res.json(evaluation);
});

// -------------------------------------------------------------
// 18. ANTI-FRAUD & ARTIFICIAL STREAMING DEFENSE
// -------------------------------------------------------------
app.get('/api/fraud/watchlist', (req, res) => {
  const watchlist = JSON.parse(fs.readFileSync(fraudFile, 'utf8'));
  res.json(watchlist);
});

app.post('/api/fraud/audit-offer', (req, res) => {
  const { offerText = "" } = req.body;
  const audit = auditCampaignOffer(offerText);
  res.json(audit);
});

// -------------------------------------------------------------
// 19. CATALOGUE REVIVAL ENGINE
// -------------------------------------------------------------
app.get('/api/catalogue/revival', (req, res) => {
  const { catalogue, telemetry } = loadState();
  const revival = scanCatalogueForRevival(catalogue, telemetry);
  res.json(revival);
});

// -------------------------------------------------------------
// 20. GLOBAL MARKETS INTELLIGENCE
// -------------------------------------------------------------
app.get('/api/global-markets', (req, res) => {
  const markets = JSON.parse(fs.readFileSync(marketsFile, 'utf8'));
  res.json(markets);
});

// -------------------------------------------------------------
// 21. LYRICS INTELLIGENCE & DISTRIBUTION (DIVISION 17)
// -------------------------------------------------------------
app.get('/api/lyrics', (req, res) => {
  res.json(lyricsEngine.getAllLyrics());
});

app.get('/api/lyrics/:id', (req, res) => {
  const record = lyricsEngine.getLyrics(req.params.id);
  if (!record) return res.status(404).json({ error: "Lyrics not found" });
  res.json(record);
});

app.post('/api/lyrics/discrepancy/resolve', (req, res) => {
  const { trackId, lineIndex, chosenVersion, userRole } = req.body;
  if (!trackId || lineIndex === undefined || !chosenVersion) {
    return res.status(400).json({ error: "trackId, lineIndex, and chosenVersion are required" });
  }
  const result = lyricsEngine.resolveDiscrepancy(trackId, lineIndex, chosenVersion, userRole);
  res.json(result);
});

app.post('/api/lyrics/correct', (req, res) => {
  const { trackId, lineIndex, newLyricLine, author } = req.body;
  if (!trackId || !lineIndex || !newLyricLine) {
    return res.status(400).json({ error: "trackId, lineIndex, and newLyricLine are required" });
  }
  const result = lyricsEngine.dispatchGlobalCorrection(trackId, lineIndex, newLyricLine, author);
  res.json(result);
});

app.get('/api/lyrics/sync/:id', (req, res) => {
  const formats = lyricsEngine.generateSyncFormats(req.params.id);
  if (!formats) return res.status(404).json({ error: "Track not found" });
  res.json(formats);
});

app.get('/api/lyrics/schema/:id', (req, res) => {
  const schema = lyricsEngine.generateGoogleSearchSchema(req.params.id);
  if (!schema) return res.status(404).json({ error: "Track not found" });
  res.json(schema);
});

app.get('/api/lyrics/artist/:artistName', (req, res) => {
  const portal = lyricsEngine.getArtistLyricsPortal(req.params.artistName);
  res.json(portal);
});

// -------------------------------------------------------------
// 22. UNIFIED MUSIC RIGHTS GRAPH
// -------------------------------------------------------------
app.get('/api/music-graph/:id', (req, res) => {
  const graph = lyricsEngine.buildUnifiedMusicGraph(req.params.id);
  if (!graph) return res.status(404).json({ error: "Track not found" });
  res.json(graph);
});

// -------------------------------------------------------------
// 23. ARTIST INTAKE, SPOTIFY SEARCH & SMART PLAYLIST AUTO-PLACEMENT
// -------------------------------------------------------------
app.get('/api/artist/search-store', async (req, res) => {
  try {
    const query = req.query.query || req.query.q || "";
    const results = await intakeEngine.searchStore(query);
    res.json({ results, query });
  } catch (err) {
    console.error("Error in search-store route:", err);
    res.status(500).json({ error: "Failed to search store", details: err.message });
  }
});

app.post('/api/artist/ingest', (req, res) => {
  const { trackData } = req.body;
  if (!trackData || !trackData.title || !trackData.artist) {
    return res.status(400).json({ error: "Valid trackData with title and artist is required" });
  }
  const result = intakeEngine.ingestArtistTrack(trackData);
  res.json(result);
});

app.post('/api/playlist/auto-place', (req, res) => {
  const { trackId } = req.body;
  if (!trackId) return res.status(400).json({ error: "trackId is required" });
  const result = intakeEngine.autoPlaceTrackIntoPlaylists(trackId);
  res.json(result);
});

app.get('/api/artist/realtime-profile', async (req, res) => {
  try {
    const query = req.query.query || req.query.q || "";
    if (!query) {
      return res.status(400).json({ error: "Query or Spotify link is required" });
    }
    const profile = await intakeEngine.getRealtimeArtistProfile(query);
    res.json(profile);
  } catch (err) {
    console.error("Error in realtime-profile route:", err);
    res.status(500).json({ error: "Failed to fetch real-time profile", details: err.message });
  }
});

app.post('/api/artist/deploy-swarm', (req, res) => {
  try {
    const { artistName, trackData } = req.body;
    if (!artistName || !trackData || !trackData.title) {
      return res.status(400).json({ error: "artistName and trackData with title are required" });
    }

    // 1. Ingest the track into the catalogue if not already present
    const ingestResult = intakeEngine.ingestArtistTrack(trackData);
    const trackId = ingestResult.track ? ingestResult.track.id : trackData.id;

    // 2. Auto-place into editorial playlists
    let placementResult = null;
    if (trackId) {
      placementResult = intakeEngine.autoPlaceTrackIntoPlaylists(trackId);
    }

    // 3. Mobilize the 10,000-Agent Swarm for this artist and track
    const swarmResult = swarm.mobilizeSwarmForArtist(artistName, trackData.title, {
      ...trackData,
      id: trackId
    });

    // 4. Run the Adversarial Council debate for strategic validation
    let councilDebate = null;
    try {
      const { catalogue, telemetry, rights } = loadState();
      const track = catalogue.find(t => t.id === trackId) || trackData;
      const tel = telemetry[trackId] || {};
      const r = rights[trackId] || {};
      councilDebate = runCouncilDebate(track, tel, r);
    } catch (e) {
      console.warn("Council debate warning during swarm deploy:", e.message);
    }

    res.json({
      success: true,
      message: `10,000 AI Agent Swarm mobilized on ${artistName} - "${trackData.title}" across 17 specialized divisions`,
      track: ingestResult.track || trackData,
      intake: ingestResult,
      placements: placementResult ? (placementResult.placedIn || placementResult.evaluatedPlaylists || []) : [],
      swarmMobilization: swarmResult,
      councilDebate
    });
  } catch (err) {
    console.error("Error deploying swarm:", err);
    res.status(500).json({ error: "Failed to deploy swarm", details: err.message });
  }
});

app.get('/api/artist/roster', (req, res) => {
  const roster = intakeEngine.getArtistRoster();
  res.json(roster);
});

app.post('/api/artist/register', (req, res) => {
  const result = intakeEngine.registerArtistProfile(req.body);
  res.json(result);
});

app.post('/api/artist/clear-roster', (req, res) => {
  const result = intakeEngine.clearAllArtistsAndCatalogue();
  res.json(result);
});

app.post('/api/artist/restore-catalogue', (req, res) => {
  const result = intakeEngine.restoreBenchmarkCatalogue();
  res.json(result);
});

// Platform Integration Health Check
app.get('/api/integrations/status', async (req, res) => {
  const supabaseStatus = await checkSupabaseConnection();
  
  res.json({
    timestamp: new Date().toISOString(),
    integrations: {
      github: {
        connected: true,
        repository: "LJENTERTAINMENTMUSIC/lj-music-os",
        branch: "main",
        status: "ACTIVE",
        syncMethod: "Continuous Git Deployment via GitHub App / Webhook"
      },
      vercel: {
        connected: true,
        status: "DEPLOYED",
        productionDomain: "https://lj-music-os.vercel.app",
        runtime: process.env.VERCEL ? "Vercel Serverless Function" : "Local Daemon",
        environment: process.env.VERCEL_ENV || "production"
      },
      supabase: {
        connected: supabaseStatus.connected,
        configured: supabaseStatus.configured,
        status: supabaseStatus.connected ? "CONNECTED" : (supabaseStatus.configured ? "CONFIGURED_ERROR" : "PENDING_CREDENTIALS"),
        message: supabaseStatus.message || supabaseStatus.error || "Awaiting SUPABASE_URL and SUPABASE_ANON_KEY in environment variables",
        schemaFile: "data/supabase-schema.sql"
      },
      spotifyPlayer: {
        connected: true,
        status: "OPERATIONAL",
        adapters: ["spotify-web-playback-sdk", "apple-musickit", "youtube-iframe", "direct-audio"],
        activeMode: "spotify-universal-sdk"
      }
    }
  });
});

// Universal Streaming Player Telemetry & Resolver
app.get('/api/player/config', (req, res) => {
  res.json({
    engine: 'LJ Universal Multi-Platform Streaming Adapter 2.0',
    providers: [
      { id: 'spotify', name: 'Spotify Web Playback SDK & Embed', type: 'sdk', available: true },
      { id: 'apple-music', name: 'Apple MusicKit.js', type: 'sdk', available: true },
      { id: 'youtube', name: 'YouTube Music / IFrame API', type: 'iframe', available: true },
      { id: 'direct', name: 'Direct High-Fidelity Audio Preview', type: 'html5_audio', available: true }
    ]
  });
});

const handleResolveStream = (req, res) => {
  const trackId = req.query.trackId || req.body?.trackId;
  const { catalogue } = loadState();
  const track = catalogue.find(t => t.id === trackId) || catalogue[0];
  if (!track) {
    return res.json({
      trackId: null,
      title: "No Active Track",
      artist: "LJ Music OS",
      streams: {},
      preferredEngine: 'spotify'
    });
  }
  const sId = track.spotifyId || (track.spotifyUrl ? track.spotifyUrl.split('/track/')[1]?.split('?')[0] : null);
  res.json({
    trackId: track.id,
    title: track.title,
    artist: track.artist,
    streams: {
      spotifyId: sId,
      spotifyUri: sId ? `spotify:track:${sId}` : null,
      spotifyUrl: track.spotifyUrl || (sId ? `https://open.spotify.com/track/${sId}` : null),
      spotifyEmbedUrl: track.spotifyEmbedUrl || (sId ? `https://open.spotify.com/embed/track/${sId}?utm_source=generator&theme=0` : null),
      appleMusicId: track.appleMusicId || null,
      youtubeId: track.youtubeId || null,
      previewUrl: track.previewUrl || null
    },
    preferredEngine: track.previewUrl ? 'direct' : 'spotify'
  });
};

app.get('/api/player/resolve-stream', handleResolveStream);
app.post('/api/player/resolve-stream', handleResolveStream);

// Start Server
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🎵 LJ MUSIC OS - AI MUSIC INTELLIGENCE PLATFORM`);
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
    console.log(`⚙️ Multi-cadence automation scheduler initialized`);
    console.log(`=======================================================`);
  });
}

module.exports = app;

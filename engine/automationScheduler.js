/**
 * LJ MUSIC OS - MULTI-CADENCE AUTOMATION ENGINE
 * Executes scheduled background intelligence tasks:
 * - HOURLY: Real-time velocity monitoring, breakout alerts
 * - DAILY: Daily momentum score recalculation, trending re-ranking
 * - WEEKLY: Top of the Week chart compilation, A&R radar digest, sync briefs matching digest
 */

const fs = require('fs');
const path = require('path');
const { generateCharts } = require('./chartsEngine');
const { matchSyncBrief } = require('./syncEngine');
const { calculateMomentumScore } = require('./momentumEngine');

class AutomationScheduler {
  constructor(baseDir) {
    this.baseDir = baseDir;
    this.logs = [];
    this.lastRuns = {
      hourly: null,
      daily: null,
      weekly: null
    };
  }

  logEvent(level, message, metadata = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata
    };
    this.logs.unshift(entry);
    if (this.logs.length > 100) this.logs.pop();
    console.log(`[LJ-AUTOMATION ${level}] ${message}`);
    return entry;
  }

  loadData() {
    const catalogue = JSON.parse(fs.readFileSync(path.join(this.baseDir, 'data', 'catalogue.json'), 'utf8'));
    const telemetry = JSON.parse(fs.readFileSync(path.join(this.baseDir, 'data', 'listeningTelemetry.json'), 'utf8'));
    const rights = JSON.parse(fs.readFileSync(path.join(this.baseDir, 'data', 'rightsData.json'), 'utf8'));
    const briefs = JSON.parse(fs.readFileSync(path.join(this.baseDir, 'data', 'syncBriefs.json'), 'utf8'));
    return { catalogue, telemetry, rights, briefs };
  }

  /**
   * HOURLY RUN:
   * Scans streaming acceleration and detects instant breakout tracks.
   */
  runHourlyVelocityAudit() {
    this.lastRuns.hourly = new Date().toISOString();
    const { catalogue, telemetry } = this.loadData();
    const breakoutAlerts = [];

    catalogue.forEach(track => {
      const tel = telemetry[track.id];
      if (!tel) return;

      const mom = calculateMomentumScore(tel);
      if (mom.score >= 90) {
        breakoutAlerts.push({
          trackId: track.id,
          title: track.title,
          artist: track.artist,
          isLjArtist: track.isLjArtist,
          momentumScore: mom.score,
          weeklyGrowth: `${tel.weeklyGrowthPct}%`,
          alert: `High velocity listening surge: ${track.title} by ${track.artist}`
        });
      }
    });

    const report = {
      cadence: "HOURLY",
      executedAt: this.lastRuns.hourly,
      activeBreakoutsCount: breakoutAlerts.length,
      breakoutAlerts
    };

    this.logEvent("INFO", `Hourly velocity cycle completed. Detected ${breakoutAlerts.length} high-velocity tracks.`, report);
    return report;
  }

  /**
   * DAILY RUN:
   * Recalculates momentum scores across the entire catalogue and updates chart movement.
   */
  runDailyMomentumCycle() {
    this.lastRuns.daily = new Date().toISOString();
    const { catalogue, telemetry, rights } = this.loadData();

    let updatedCount = 0;
    catalogue.forEach(track => {
      const tel = telemetry[track.id];
      if (tel) {
        const mom = calculateMomentumScore(tel);
        tel.momentumScore = mom.score;
        tel.status = mom.status;
        updatedCount++;
      }
    });

    // Write back telemetry
    fs.writeFileSync(path.join(this.baseDir, 'data', 'listeningTelemetry.json'), JSON.stringify(telemetry, null, 2), 'utf8');

    const charts = generateCharts(catalogue, telemetry, rights);

    const report = {
      cadence: "DAILY",
      executedAt: this.lastRuns.daily,
      tracksUpdated: updatedCount,
      topRankedTrack: charts.top10[0] ? `${charts.top10[0].title} - ${charts.top10[0].artist}` : "None",
      fastestRisingTrack: charts.fastestRising[0] ? `${charts.fastestRising[0].title} (${charts.fastestRising[0].telemetry.weeklyGrowthPct}%)` : "None"
    };

    this.logEvent("SUCCESS", `Daily momentum cycle completed for ${updatedCount} catalogue titles.`, report);
    return report;
  }

  /**
   * WEEKLY RUN:
   * Freezes official 'Top of the Week' charts, generates A&R Roster Recommendations,
   * and runs commercial sync opportunity match scans.
   */
  runWeeklyTopChartsAndSyncDigest() {
    this.lastRuns.weekly = new Date().toISOString();
    const { catalogue, telemetry, rights, briefs } = this.loadData();

    // 1. Generate full charts
    const charts = generateCharts(catalogue, telemetry, rights);

    // 2. Identify LJ Artists to Watch (A&R Intelligence)
    const ljRosterWatch = catalogue
      .filter(t => t.isLjArtist)
      .map(track => {
        const tel = telemetry[track.id] || {};
        return {
          artist: track.artist,
          track: track.title,
          momentumScore: tel.momentumScore || 70,
          weeklyEngagementGrowth: `+${tel.weeklyGrowthPct || 0}%`,
          repeatListeningRate: `${tel.repeatListeningPct || 0}%`,
          completionRate: `${tel.completionRatePct || 0}%`,
          topCity: tel.geoBreakdown ? Object.keys(tel.geoBreakdown)[0] : "Lagos",
          strategicPushRecommendation: `Push onto ${track.genre} radio rotation & editorial playlists; align with Q4 commercial brand campaigns.`
        };
      })
      .sort((a, b) => b.momentumScore - a.momentumScore);

    // 3. Scan Sync briefs
    const syncDigest = briefs.map(b => matchSyncBrief(b, catalogue, rights));

    const weeklyDigest = {
      cadence: "WEEKLY",
      chartWeek: charts.chartPeriod,
      generatedAt: this.lastRuns.weekly,
      charts: {
        top10: charts.top10.map(t => ({ rank: t.chartRank, title: t.title, artist: t.artist, isLj: t.isLjArtist, points: t.chartPoints })),
        fastestRising: charts.fastestRising.map(t => ({ title: t.title, artist: t.artist, growth: `+${t.telemetry.weeklyGrowthPct}%` })),
        breakoutArtists: charts.breakoutArtists.map(t => ({ title: t.title, artist: t.artist, growth: `+${t.telemetry.artistGrowthPct}%` }))
      },
      aAndRWatchlist: ljRosterWatch,
      syncMarketplaceHighlights: syncDigest.map(s => ({
        client: s.client,
        project: s.project,
        budget: s.budget,
        topMatchTrack: s.topMatches[0] ? `${s.topMatches[0].title} by ${s.topMatches[0].artist} (${s.topMatches[0].totalMatch}% match - ${s.topMatches[0].readiness.label})` : "None"
      }))
    };

    // Save weekly digest archive
    const reportsDir = path.join(this.baseDir, 'data', 'reports');
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
    fs.writeFileSync(path.join(reportsDir, 'weekly-intelligence-latest.json'), JSON.stringify(weeklyDigest, null, 2), 'utf8');

    this.logEvent("SUCCESS", `Weekly Top of the Week charts & Sync Digest compiled successfully for ${charts.chartPeriod}.`, weeklyDigest);
    return weeklyDigest;
  }

  getAutomationStatus() {
    return {
      lastRuns: this.lastRuns,
      recentLogs: this.logs.slice(0, 30)
    };
  }
}

module.exports = AutomationScheduler;

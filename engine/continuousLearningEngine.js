/**
 * LJ MUSIC OS - CONTINUOUS LEARNING ENGINE
 * Implements real-time telemetry ingestion and weights adaptation.
 * Records user interaction feedback signals and recalibrates track momentum & synergy matrices.
 */

const fs = require('fs');
const path = require('path');
const { calculateMomentumScore } = require('./momentumEngine');

class ContinuousLearningEngine {
  constructor(telemetryFilePath) {
    this.telemetryFilePath = telemetryFilePath;
    this.signalLog = [];
    this.coOccurrenceMatrix = {}; // Track synergy pairs (e.g. tracks that succeed together in playlists)
  }

  /**
   * Ingest a live interaction signal
   * @param {string} trackId 
   * @param {'PLAY'|'COMPLETE'|'SAVE'|'REPLAY'|'PLAYLIST_ADD'|'SHARE'|'SKIP'} signalType 
   * @param {object} metadata 
   */
  ingestSignal(trackId, signalType, metadata = {}) {
    const timestamp = new Date().toISOString();
    const event = { trackId, signalType, timestamp, metadata };
    this.signalLog.unshift(event);
    if (this.signalLog.length > 200) this.signalLog.pop(); // Keep recent 200 signals

    // Load live telemetry data
    let telemetryMap = {};
    try {
      telemetryMap = JSON.parse(fs.readFileSync(this.telemetryFilePath, 'utf8'));
    } catch (err) {
      console.error("Error reading telemetry file:", err);
      return null;
    }

    if (!telemetryMap[trackId]) {
      telemetryMap[trackId] = {
        trackId,
        plays: 0,
        saves: 0,
        shares: 0,
        playlistAdds: 0,
        skips: 0,
        completionRatePct: 70,
        repeatListeningPct: 20,
        weeklyGrowthPct: 0,
        artistGrowthPct: 0
      };
    }

    const t = telemetryMap[trackId];

    // Apply incremental signal impact
    switch (signalType) {
      case 'PLAY':
        t.plays += 1;
        break;
      case 'COMPLETE':
        t.plays += 1;
        t.completionRatePct = Math.min(98, +(t.completionRatePct * 0.98 + 100 * 0.02).toFixed(1));
        break;
      case 'SAVE':
        t.saves += 1;
        t.weeklyGrowthPct = +(t.weeklyGrowthPct + 0.1).toFixed(1);
        break;
      case 'REPLAY':
        t.plays += 1;
        t.repeatListeningPct = Math.min(95, +(t.repeatListeningPct * 0.98 + 100 * 0.02).toFixed(1));
        break;
      case 'PLAYLIST_ADD':
        t.playlistAdds += 1;
        t.weeklyGrowthPct = +(t.weeklyGrowthPct + 0.15).toFixed(1);
        if (metadata.pairedTrackId) {
          const pairKey = [trackId, metadata.pairedTrackId].sort().join("<->");
          this.coOccurrenceMatrix[pairKey] = (this.coOccurrenceMatrix[pairKey] || 0) + 1;
        }
        break;
      case 'SHARE':
        t.shares += 1;
        t.weeklyGrowthPct = +(t.weeklyGrowthPct + 0.25).toFixed(1);
        break;
      case 'SKIP':
        t.skips += 1;
        t.completionRatePct = Math.max(10, +(t.completionRatePct * 0.98).toFixed(1));
        break;
    }

    // Recalculate momentum score on the fly
    const momResult = calculateMomentumScore(t);
    t.momentumScore = momResult.score;
    t.status = momResult.status;

    // Persist updated telemetry back to storage
    try {
      fs.writeFileSync(this.telemetryFilePath, JSON.stringify(telemetryMap, null, 2), 'utf8');
    } catch (err) {
      console.error("Error saving telemetry file:", err);
    }

    return {
      event,
      updatedTelemetry: t,
      momentum: momResult
    };
  }

  getSignalStream() {
    return this.signalLog.slice(0, 25);
  }

  getSynergyMatrix() {
    return this.coOccurrenceMatrix;
  }
}

module.exports = ContinuousLearningEngine;

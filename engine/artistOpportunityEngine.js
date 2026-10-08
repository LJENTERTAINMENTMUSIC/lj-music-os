/**
 * LJ MUSIC OS - ARTIST OPPORTUNITY SCORE ENGINE
 * Multi-factor algorithmic evaluation of artist commercial and growth viability:
 * Streaming Momentum, Audience Growth, Playlist Fit, Radio Fit, Sync Potential,
 * Social Momentum, Release Readiness, Catalogue Strength, Market Expansion -> Overall Score.
 */

function calculateArtistOpportunityScore(artistName, catalogue, telemetryMap, rightsMap) {
  const artistTracks = catalogue.filter(t => t.artist === artistName);
  if (artistTracks.length === 0) return null;

  // Aggregate metrics across artist tracks
  let totalPlays = 0;
  let totalGrowth = 0;
  let highestMomentum = 0;
  let syncReadinessAvg = 0;
  let radioFitScore = 80;

  artistTracks.forEach(t => {
    const tel = telemetryMap[t.id] || {};
    const r = rightsMap[t.id] || {};
    totalPlays += tel.plays || 0;
    totalGrowth += tel.weeklyGrowthPct || 0;
    if ((tel.momentumScore || 0) > highestMomentum) highestMomentum = tel.momentumScore || 0;
    syncReadinessAvg += r.syncReadinessScore || 70;
  });

  const avgGrowth = totalGrowth / artistTracks.length;
  syncReadinessAvg = Math.round(syncReadinessAvg / artistTracks.length);

  // 9 Dimensions
  const streamingMomentum = Math.min(99, Math.round(highestMomentum * 0.95));
  const audienceGrowth = Math.min(99, Math.round(75 + avgGrowth * 0.45));
  const playlistFit = Math.min(99, Math.round(80 + (artistTracks.some(t => t.danceability >= 85) ? 14 : 5)));
  const radioFit = Math.min(99, Math.round(78 + (artistTracks.some(t => t.energy >= 80) ? 10 : 2)));
  const syncPotential = Math.min(99, Math.round(syncReadinessAvg * 0.9 + 8));
  const socialMomentum = Math.min(99, Math.round(70 + avgGrowth * 0.3));
  const releaseReadiness = artistTracks.some(t => t.isPriorityCampaign) ? 96 : 85;
  const catalogueStrength = Math.min(99, Math.round(70 + artistTracks.length * 4));
  const marketExpansion = Math.min(99, Math.round(82 + (artistTracks.length > 2 ? 8 : 2)));

  const overall = Math.round(
    (streamingMomentum * 0.20) +
    (audienceGrowth * 0.15) +
    (playlistFit * 0.15) +
    (radioFit * 0.10) +
    (syncPotential * 0.15) +
    (socialMomentum * 0.05) +
    (releaseReadiness * 0.05) +
    (catalogueStrength * 0.05) +
    (marketExpansion * 0.10)
  );

  const isPriority = overall >= 85;

  return {
    artist: artistName,
    overallScore: overall,
    statusLabel: isPriority ? "🔥 PRIORITY ROSTER ARTIST" : "📈 DEVELOPING ROSTER ARTIST",
    isPriority,
    dimensions: {
      streamingMomentum,
      audienceGrowth,
      playlistFit,
      radioFit,
      syncPotential,
      socialMomentum,
      releaseReadiness,
      catalogueStrength,
      marketExpansion
    },
    trackCount: artistTracks.length,
    topTrack: artistTracks[0].title
  };
}

module.exports = {
  calculateArtistOpportunityScore
};

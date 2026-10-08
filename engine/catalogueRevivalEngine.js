/**
 * LJ MUSIC OS - CATALOGUE REVIVAL ENGINE
 * Continuously monitors catalogue songs released over 6 months ago for organic spikes
 * in searches, shazams, and TikTok sound usage, automatically provisioning revival campaigns.
 */

function scanCatalogueForRevival(catalogue, telemetryMap) {
  const revivalCandidates = [];

  catalogue.forEach(track => {
    if (!track.isLjArtist) return;

    const tel = telemetryMap[track.id];
    if (!tel) return;

    // Check for catalogue age (> 6 months / 2025 or older, or flag)
    const isOldAsset = track.era.includes("2025") || track.isCatalogueRevivalCandidate || track.era.includes("Classic");
    const hasSearchSurge = tel.weeklyGrowthPct >= 35 || tel.status === "CATALOGUE_REVIVAL" || (tel.searches > 12000 && isOldAsset);

    if (isOldAsset && hasSearchSurge) {
      revivalCandidates.push({
        trackId: track.id,
        title: track.title,
        artist: track.artist,
        releaseDate: track.releaseDate,
        ageInMonths: 18,
        searchGrowthPct: tel.weeklyGrowthPct,
        totalSearches: tel.searches,
        completionRate: tel.completionRatePct,
        currentMomentum: tel.momentumScore,
        revivalTriggerReason: `Organic algorithmic surge detected: +${tel.weeklyGrowthPct}% search volume on ${track.releaseDate} asset with ${tel.completionRatePct}% completion rate.`,
        campaignPlan: {
          campaignName: `Revival Initiative: ${track.title}`,
          pillar1_Playlisting: "Pitch to Spotify 'Throwback Afrobeats', 'Afro-Nostalgia', and mood chill playlists.",
          pillar2_ShortForm: "Deploy 15-second nostalgic audio snippet on TikTok & Reels with community creator prompts.",
          pillar3_Radio: "Package for specialist late-night weekend radio hours (Cool FM & Beat FM Lagos).",
          pillar4_Sync: "Re-index for cinematic and documentary retrospective sync licensing briefs.",
          pillar5_ArtistContent: "Artist records acoustic retrospective clip for Instagram & YouTube Shorts."
        }
      });
    }
  });

  return {
    scanTimestamp: new Date().toISOString(),
    revivalCandidatesCount: revivalCandidates.length,
    revivalCandidates
  };
}

module.exports = {
  scanCatalogueForRevival
};

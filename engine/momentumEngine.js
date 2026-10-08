/**
 * LJ MUSIC INTELLIGENCE ENGINE - MOMENTUM & TELEMETRY MODULE
 * Implements real-time listening intelligence tracking:
 * Plays -> Searches -> Saves -> Shares -> Adds -> Skips -> Completion Rate -> Repeat Listening -> Artist Growth
 */

function calculateMomentumScore(telemetry) {
  if (!telemetry) return { score: 50, status: "STEADY", label: "Normal" };

  const {
    plays = 1000,
    weeklyGrowthPct = 0,
    saves = 100,
    shares = 50,
    playlistAdds = 50,
    skips = 50,
    completionRatePct = 60,
    repeatListeningPct = 25,
    artistGrowthPct = 0
  } = telemetry;

  // Ratios
  const saveRate = Math.min((saves / Math.max(plays, 1)) * 100, 35); // Benchmark high is ~25%
  const addRate = Math.min((playlistAdds / Math.max(plays, 1)) * 100, 20); // Benchmark high is ~15%
  const shareRate = Math.min((shares / Math.max(plays, 1)) * 100, 15);
  const skipPenalty = Math.min((skips / Math.max(plays, 1)) * 100 * 1.5, 25);

  // Growth Factors (max 30 pts)
  const growthFactor = Math.min(Math.max(weeklyGrowthPct, -20) * 0.5, 25);
  const artistGrowthFactor = Math.min(Math.max(artistGrowthPct, -10) * 0.2, 10);

  // Engagement Quality (max 35 pts)
  const qualityFactor = (completionRatePct * 0.25) + (repeatListeningPct * 0.25);

  // Conversion & Virality (max 35 pts)
  const conversionFactor = (saveRate * 0.8) + (addRate * 0.8) + (shareRate * 0.6);

  // Aggregate Base Score
  let score = Math.round(15 + growthFactor + artistGrowthFactor + qualityFactor + conversionFactor - skipPenalty);
  score = Math.max(10, Math.min(99, score));

  let status = "STEADY";
  let label = "Steady Activity";

  if (score >= 90) {
    status = "RISING_NOW";
    label = "🔥 Rising Now (Viral Velocity)";
  } else if (score >= 82) {
    status = "FAST_MOVER";
    label = "⚡ Fast Mover";
  } else if (artistGrowthPct >= 35 && score >= 80) {
    status = "BREAKOUT_ARTIST";
    label = "🌟 Breakout Artist";
  } else if (score >= 70) {
    status = "GROWING";
    label = "📈 Healthy Growth";
  } else {
    status = "STABLE";
    label = "⚖️ Catalogue Steady";
  }

  return {
    score,
    status,
    label,
    metricsBreakdown: {
      saveRate: +(saves / Math.max(plays, 1) * 100).toFixed(1),
      addRate: +(playlistAdds / Math.max(plays, 1) * 100).toFixed(1),
      shareRate: +(shares / Math.max(plays, 1) * 100).toFixed(1),
      completionRate: +completionRatePct.toFixed(1),
      repeatListening: +repeatListeningPct.toFixed(1),
      weeklyGrowth: +weeklyGrowthPct.toFixed(1)
    }
  };
}

module.exports = {
  calculateMomentumScore
};

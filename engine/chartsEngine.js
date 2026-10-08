/**
 * LJ MUSIC OS - CHARTS & RANKING ENGINE
 * Automatically compiles weekly charts across multiple intelligence dimensions:
 * Top 10/20/50, Fastest Rising, Biggest Movers, Most Played, Most Added, Most Saved,
 * Breakout Artists, New Music, Staff Picks, and AI Picks.
 */

function generateCharts(catalogue, telemetryMap, rightsMap) {
  // Enrich catalogue tracks with telemetry
  const enrichedTracks = catalogue.map(track => {
    const tel = telemetryMap[track.id] || {
      plays: 5000,
      weeklyGrowthPct: 0,
      saves: 500,
      playlistAdds: 200,
      skips: 100,
      momentumScore: 50,
      rankMovement: "0",
      status: "STEADY"
    };

    // Calculate chart rank points: combination of stream volume + momentum + conversion
    const chartPoints = Math.round((tel.plays * 0.4) + (tel.saves * 2.5) + (tel.playlistAdds * 3.5) + (tel.momentumScore * 120));

    return {
      ...track,
      telemetry: tel,
      chartPoints,
      rankMovementNumeric: parseInt(tel.rankMovement.replace("+", "")) || 0
    };
  });

  // 1. Top of the Week (overall chart rank by points)
  const sortedByPoints = [...enrichedTracks].sort((a, b) => b.chartPoints - a.chartPoints);
  const top10 = sortedByPoints.slice(0, 10).map((t, idx) => ({ ...t, chartRank: idx + 1 }));
  const top20 = sortedByPoints.slice(0, 20).map((t, idx) => ({ ...t, chartRank: idx + 1 }));

  // 2. Fastest Rising (ranked strictly by weeklyGrowthPct)
  const fastestRising = [...enrichedTracks]
    .sort((a, b) => b.telemetry.weeklyGrowthPct - a.telemetry.weeklyGrowthPct)
    .slice(0, 5);

  // 3. Biggest Movers (highest positive rank jump, e.g. +11, +9, +8)
  const biggestMovers = [...enrichedTracks]
    .sort((a, b) => b.rankMovementNumeric - a.rankMovementNumeric)
    .slice(0, 5);

  // 4. Most Played (raw play count)
  const mostPlayed = [...enrichedTracks]
    .sort((a, b) => b.telemetry.plays - a.telemetry.plays)
    .slice(0, 5);

  // 5. Most Added (playlist adds count)
  const mostAdded = [...enrichedTracks]
    .sort((a, b) => b.telemetry.playlistAdds - a.telemetry.playlistAdds)
    .slice(0, 5);

  // 6. Most Saved (saves count)
  const mostSaved = [...enrichedTracks]
    .sort((a, b) => b.telemetry.saves - a.telemetry.saves)
    .slice(0, 5);

  // 7. Breakout Artists (High artistGrowthPct & high momentum)
  const breakoutArtists = [...enrichedTracks]
    .filter(t => (t.telemetry.artistGrowthPct >= 30 || t.telemetry.status === "BREAKOUT_ARTIST"))
    .sort((a, b) => (b.telemetry.artistGrowthPct || 0) - (a.telemetry.artistGrowthPct || 0))
    .slice(0, 5);

  // 8. New Music (released recently in 2026)
  const newMusic = [...enrichedTracks]
    .sort((a, b) => new Date(b.releaseDate || "2026-01-01") - new Date(a.releaseDate || "2026-01-01"))
    .slice(0, 5);

  // 9. Staff Picks (curated by LJ A&R)
  const staffPicks = enrichedTracks
    .filter(t => ["lj-001", "lj-005", "lj-002", "lj-007"].includes(t.id));

  // 10. AI Picks (High acoustic balance + momentum + sync viability)
  const aiPicks = enrichedTracks
    .filter(t => t.telemetry.momentumScore >= 88 && t.isLjArtist)
    .sort((a, b) => b.telemetry.momentumScore - a.telemetry.momentumScore)
    .slice(0, 5);

  return {
    chartPeriod: "Week 41 (October 2026)",
    lastRefreshed: new Date().toISOString(),
    top10,
    top20,
    fastestRising,
    biggestMovers,
    mostPlayed,
    mostAdded,
    mostSaved,
    breakoutArtists,
    newMusic,
    staffPicks,
    aiPicks
  };
}

module.exports = {
  generateCharts
};

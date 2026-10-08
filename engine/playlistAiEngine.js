/**
 * LJ MUSIC OS - AI AUTO-PLAYLIST ENGINE & CONTEXTUAL BOOST
 * Intelligently analyzes target aesthetic, searches catalogue,
 * and matches LJ roster based on genuine acoustic & vibe compatibility.
 */

// Key compatibility matrix (Circle of Fifths / Camelot Key distance)
function calculateKeyCompatibility(keyA, keyB) {
  if (!keyA || !keyB) return 80;
  if (keyA.toLowerCase() === keyB.toLowerCase()) return 100;
  
  // Relative minor/major pairs (e.g. A minor <-> C major)
  const relativePairs = [
    ["a minor", "c major"],
    ["e minor", "g major"],
    ["b minor", "d major"],
    ["f# minor", "a major"],
    ["c# minor", "e major"],
    ["d minor", "f major"],
    ["g minor", "bb major"]
  ];
  const aNorm = keyA.toLowerCase();
  const bNorm = keyB.toLowerCase();
  for (const pair of relativePairs) {
    if ((pair[0] === aNorm && pair[1] === bNorm) || (pair[1] === aNorm && pair[0] === bNorm)) {
      return 95;
    }
  }

  // Same tonic different mode
  if (aNorm.split(" ")[0] === bNorm.split(" ")[0]) return 85;

  return 75; // Default moderate harmonic tolerance
}

/**
 * Calculates acoustic compatibility percentage (0 - 100) between two tracks
 * or between a track and a target profile.
 */
function calculateAcousticCompatibility(track, target) {
  // 1. BPM delta
  const targetBpm = target.bpm || (target.bpmMin && target.bpmMax ? (target.bpmMin + target.bpmMax) / 2 : 110);
  const bpmDelta = Math.abs(track.bpm - targetBpm);
  let bpmScore = Math.max(0, 100 - (bpmDelta * 2.2));

  // 2. Energy delta
  const targetEnergy = target.energy || 80;
  const energyDelta = Math.abs(track.energy - targetEnergy);
  const energyScore = Math.max(0, 100 - (energyDelta * 1.2));

  // 3. Danceability delta
  const targetDanceability = target.danceability || 85;
  const danceDelta = Math.abs(track.danceability - targetDanceability);
  const danceScore = Math.max(0, 100 - (danceDelta * 1.2));

  // 4. Harmonic Key Score
  const keyScore = target.key ? calculateKeyCompatibility(track.key, target.key) : 90;

  // 5. Genre / Vibe Alignment
  let genreScore = 75;
  if (target.genre && track.genre.toLowerCase().includes(target.genre.toLowerCase())) {
    genreScore = 100;
  } else if (target.subGenre && track.subGenre.toLowerCase().includes(target.subGenre.toLowerCase())) {
    genreScore = 95;
  }

  // Weighted aggregate compatibility
  const overall = Math.round(
    (bpmScore * 0.30) +
    (energyScore * 0.25) +
    (danceScore * 0.20) +
    (keyScore * 0.15) +
    (genreScore * 0.10)
  );

  return Math.min(99, Math.max(10, overall));
}

/**
 * Searches catalogue, finds best overall musical matches,
 * then identifies whether an LJ artist is a legitimate contextual fit.
 */
function generateCuratedPlaylist(queryPrompt, catalogue, telemetryMap) {
  const p = queryPrompt.toLowerCase();
  
  // Extract target criteria from prompt
  const isFemaleVocal = p.includes("female");
  const isMaleVocal = p.includes("male") && !p.includes("female");
  const isNightlife = p.includes("nightlife") || p.includes("night") || p.includes("drive");
  const isAmapiano = p.includes("amapiano");
  const isAfrobeats = p.includes("afrobeats") || p.includes("afro");
  const isLuxury = p.includes("luxury") || p.includes("premium");
  const isSoul = p.includes("soul") || p.includes("emotional") || p.includes("heartbreak");

  // Determine target acoustic profile
  let target = {
    bpm: 108,
    bpmMin: 105,
    bpmMax: 115,
    key: "A minor",
    energy: 82,
    danceability: 89,
    genre: isAmapiano ? "Amapiano" : (isSoul ? "Afro-Soul" : "Afrobeats")
  };

  // Check for explicit BPM ranges in query (e.g. 105-115 or 90-110)
  const bpmMatch = queryPrompt.match(/(\d{2,3})\s*[-–to]+\s*(\d{2,3})\s*bpm/i);
  if (bpmMatch) {
    target.bpmMin = parseInt(bpmMatch[1]);
    target.bpmMax = parseInt(bpmMatch[2]);
    target.bpm = Math.round((target.bpmMin + target.bpmMax) / 2);
  }

  // Score all songs
  const scoredTracks = catalogue.map(track => {
    const acousticMatch = calculateAcousticCompatibility(track, target);
    let semanticBonus = 0;

    if (isFemaleVocal && track.vocalType.toLowerCase().includes("female")) semanticBonus += 8;
    if (isMaleVocal && track.vocalType.toLowerCase().includes("male")) semanticBonus += 8;
    if (isNightlife && track.useCases.some(u => u.toLowerCase().includes("night") || u.toLowerCase().includes("club"))) semanticBonus += 8;
    if (isLuxury && (track.mood.toLowerCase().includes("aspirational") || track.mood.toLowerCase().includes("luxury"))) semanticBonus += 8;
    if (isSoul && track.genre.toLowerCase().includes("soul")) semanticBonus += 10;

    const totalMatch = Math.min(99, acousticMatch + semanticBonus);
    const telemetry = telemetryMap[track.id] || {};

    return {
      ...track,
      compatibilityScore: totalMatch,
      momentum: telemetry.momentumScore || 75
    };
  });

  // Sort by compatibility descending
  scoredTracks.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  // Separate LJ artists and external anchors
  const topExternal = scoredTracks.filter(t => !t.isLjArtist);
  const topLj = scoredTracks.filter(t => t.isLjArtist);

  // Assemble balanced editorial playlist:
  // "Find strongest musical match first -> then identify whether LJ artist is a legitimate fit."
  const finalPlaylist = [];
  const boostRecommendations = [];

  // Pick top benchmark external tracks first
  const primaryAnchors = topExternal.slice(0, 3);
  
  // Pick top compatible LJ artists
  topLj.slice(0, 3).forEach(ljTrack => {
    if (ljTrack.compatibilityScore >= 82) {
      boostRecommendations.push({
        artist: ljTrack.artist,
        trackTitle: ljTrack.title,
        compatibilityScore: ljTrack.compatibilityScore,
        bpm: ljTrack.bpm,
        key: ljTrack.key,
        energy: ljTrack.energy,
        danceability: ljTrack.danceability,
        editorialJustification: `LJ Artist ${ljTrack.artist} ('${ljTrack.title}') exhibits ${ljTrack.compatibilityScore}% acoustic & vibe compatibility (BPM: ${ljTrack.bpm}, Key: ${ljTrack.key}, Energy: ${ljTrack.energy}). Recommended as an authentic editorial placement.`
      });
    }
  });

  // Interleave for a natural editorial flow
  let extIdx = 0;
  let ljIdx = 0;
  while (finalPlaylist.length < 5 && (extIdx < primaryAnchors.length || ljIdx < topLj.length)) {
    if (extIdx < primaryAnchors.length && (finalPlaylist.length % 2 === 0 || ljIdx >= topLj.length)) {
      finalPlaylist.push({
        ...primaryAnchors[extIdx],
        placementType: "Benchmark Anchor"
      });
      extIdx++;
    } else if (ljIdx < topLj.length) {
      const lj = topLj[ljIdx];
      finalPlaylist.push({
        ...lj,
        placementType: lj.compatibilityScore >= 85 ? "Contextual LJ Boost (High Fit)" : "Standard Placement"
      });
      ljIdx++;
    }
  }

  return {
    queryPrompt,
    targetAcousticProfile: target,
    playlistTitle: isNightlife ? "Lagos Night Drive" : (isLuxury ? "African Luxury Horizons" : "Curated Discovery"),
    boostRecommendations,
    tracks: finalPlaylist,
    totalTracks: finalPlaylist.length,
    ljShare: `${Math.round((finalPlaylist.filter(t => t.isLjArtist).length / finalPlaylist.length) * 100)}%`
  };
}

module.exports = {
  calculateAcousticCompatibility,
  generateCuratedPlaylist
};

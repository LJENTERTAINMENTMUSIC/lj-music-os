/**
 * LJ MUSIC OS - SYNC OPPORTUNITY & RIGHTS INTELLIGENCE ENGINE
 * Matches sync briefs with catalogue, calculates multi-dimensional match scores,
 * verifies 12-point sync readiness, and produces instant clearance packages.
 */

function evaluateSyncReadiness(rights) {
  if (!rights) {
    return {
      score: 30,
      badge: "NOT_READY",
      color: "red",
      label: "🔴 NOT READY — 30%",
      checklist: {
        masterOwnership: false,
        publishingOwnership: false,
        writerSplits: false,
        pro: false,
        isrc: false,
        ipi: false,
        explicitCleared: false,
        sampleCleared: false,
        featuredAgreements: false,
        producerAgreements: false,
        contractStatus: false
      }
    };
  }

  const checklist = {
    masterOwnership: rights.masterOwnership && rights.masterOwnership.includes("100% Owned"),
    publishingOwnership: rights.publishingOwnership && (rights.publishingOwnership.includes("100% Controlled") || rights.publishingOwnership.includes("80%")),
    writerSplits: Array.isArray(rights.writerSplits) && rights.writerSplits.reduce((acc, s) => acc + s.share, 0) === 100,
    proRegistered: !!rights.pro && !rights.pro.includes("Pending"),
    isrcPresent: !!rights.isrc,
    ipiRegistered: !!rights.ipi && !rights.ipi.includes("Pending"),
    cleanExplicit: !rights.explicitContent,
    sampleCleared: rights.sampleClearance && rights.sampleClearance.includes("Cleared"),
    featuredAgreements: !rights.featuredArtistAgreements || !rights.featuredArtistAgreements.includes("Pending"),
    producerAgreements: rights.producerAgreements && rights.producerAgreements.includes("Executed"),
    contractActive: rights.contractStatus && rights.contractStatus.includes("Active")
  };

  let points = 0;
  const totalItems = Object.keys(checklist).length;
  Object.values(checklist).forEach(v => {
    if (v) points++;
  });

  const rawScore = Math.round((points / totalItems) * 100);
  const score = rights.syncReadinessScore || rawScore;

  let badge = "NOT_READY";
  let color = "red";
  let label = `🔴 NOT READY — ${score}%`;

  if (score >= 90) {
    badge = "SYNC_READY";
    color = "green";
    label = `🟢 SYNC READY — ${score}%`;
  } else if (score >= 60) {
    badge = "CLEARANCE_REQUIRED";
    color = "yellow";
    label = `🟡 CLEARANCE REQUIRED — ${score}%`;
  }

  return {
    score,
    badge,
    color,
    label,
    checklist,
    turnaround: rights.clearanceTurnaround,
    licensingTier: rights.licensingTier
  };
}

/**
 * Matches a commercial sync brief against catalogue tracks
 */
function matchSyncBrief(brief, catalogue, rightsMap) {
  const { keyCriteria = {}, scene = "", theme = "", tempoRange = "" } = brief;
  const { moodKeywords = [], bpmMin = 90, bpmMax = 110, preferredGender = "Any", noExplicit = true } = keyCriteria;

  const matches = catalogue.map(track => {
    const rights = rightsMap[track.id];
    const readiness = evaluateSyncReadiness(rights);

    // 1. Tempo match %
    let tempoMatch = 80;
    if (track.bpm >= bpmMin && track.bpm <= bpmMax) {
      tempoMatch = 98;
    } else {
      const dist = Math.min(Math.abs(track.bpm - bpmMin), Math.abs(track.bpm - bpmMax));
      tempoMatch = Math.max(50, 95 - (dist * 4));
    }

    // 2. Mood match %
    let moodMatchesCount = 0;
    const trackMoodLower = (track.mood + " " + (track.useCases || []).join(" ")).toLowerCase();
    moodKeywords.forEach(kw => {
      if (trackMoodLower.includes(kw.toLowerCase())) moodMatchesCount++;
    });
    const moodMatch = Math.min(99, 70 + (moodMatchesCount * 10));

    // 3. Lyrics & Vocal Match %
    let lyricsMatch = 85;
    if (preferredGender === "Female" && track.vocalType.toLowerCase().includes("female")) {
      lyricsMatch = 96;
    } else if (preferredGender === "Male" && track.vocalType.toLowerCase().includes("male") && !track.vocalType.toLowerCase().includes("female hook")) {
      lyricsMatch = 95;
    } else if (preferredGender === "Any") {
      lyricsMatch = 92;
    } else {
      lyricsMatch = 65;
    }

    // 4. Genre Match %
    let genreMatch = 80;
    if (brief.preferredGenre && track.genre.toLowerCase().includes(brief.preferredGenre.toLowerCase().split("/")[0].trim())) {
      genreMatch = 95;
    } else if (track.subGenre && brief.preferredGenre && brief.preferredGenre.toLowerCase().includes(track.subGenre.toLowerCase())) {
      genreMatch = 98;
    }

    // 5. Scene Suitability %
    let sceneSuitability = 82;
    const sceneKeywords = (scene + " " + theme).toLowerCase().split(/[\s,]+/);
    let matchedSceneWords = 0;
    sceneKeywords.forEach(w => {
      if (w.length > 4 && trackMoodLower.includes(w)) matchedSceneWords++;
    });
    sceneSuitability = Math.min(99, 80 + (matchedSceneWords * 5));

    // Calculate overall match score
    const totalMatch = Math.round(
      (moodMatch * 0.30) +
      (tempoMatch * 0.20) +
      (lyricsMatch * 0.20) +
      (genreMatch * 0.15) +
      (sceneSuitability * 0.15)
    );

    return {
      trackId: track.id,
      title: track.title,
      artist: track.artist,
      isLjArtist: track.isLjArtist,
      bpm: track.bpm,
      key: track.key,
      genre: track.genre,
      mood: track.mood,
      coverArt: track.coverArt,
      totalMatch: Math.min(99, totalMatch),
      subScores: {
        moodMatch,
        tempoMatch,
        lyricsMatch,
        genreMatch,
        sceneSuitability
      },
      readiness,
      rights
    };
  });

  // Sort by match score descending, prioritizing LJ catalogue
  matches.sort((a, b) => {
    if (a.isLjArtist && !b.isLjArtist) return -1;
    if (!a.isLjArtist && b.isLjArtist) return 1;
    return b.totalMatch - a.totalMatch;
  });

  return {
    ...brief,
    briefId: brief.id,
    project: brief.project,
    client: brief.client,
    budget: brief.budget,
    topMatches: matches.slice(0, 5)
  };
}

module.exports = {
  evaluateSyncReadiness,
  matchSyncBrief
};

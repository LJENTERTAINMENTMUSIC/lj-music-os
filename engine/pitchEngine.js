/**
 * LJ MUSIC OS - MUSIC PITCHING ENGINE
 * Generates automated, data-driven Pitch Cards for artists and songs,
 * and matches them against commercial, radio, playlist, and sync destinations.
 */

function generatePitchCard(track, telemetry, rights) {
  if (!track) return null;

  const momentum = telemetry ? telemetry.momentumScore : 75;
  const isSyncReady = rights && rights.syncReadinessScore >= 90;

  // Calculate Potentials (0 - 100)
  const radioPotential = Math.min(98, Math.round((track.energy * 0.4) + (track.danceability * 0.4) + (track.introLength === "8s" || track.introLength === "10s" ? 15 : 10)));
  const playlistPotential = Math.min(99, Math.round(momentum * 0.6 + track.danceability * 0.4));
  const syncPotential = isSyncReady ? Math.min(99, Math.round((rights.syncReadinessScore * 0.5) + (track.mood.includes("Emotional") || track.mood.includes("Aspirational") ? 45 : 35))) : 55;
  const commercialPotential = Math.min(98, Math.round((track.energy * 0.3) + (track.danceability * 0.3) + (syncPotential * 0.4)));

  // Target Destinations based on Music DNA and performance
  const recommendedDestinations = [];

  // Editorial Playlists
  if (track.genre.toLowerCase().includes("afrobeats")) {
    recommendedDestinations.push({
      category: "Editorial Playlists",
      target: "Spotify: African Heat, New Music Friday Africa, Lagos City Pop",
      suitability: "High Confidence (96%)",
      reason: `Fits high-velocity African contemporary stream with ${track.bpm} BPM and strong ${track.key} progression.`
    });
    recommendedDestinations.push({
      category: "Apple Music",
      target: "Apple Music: African Essentials, Oshe Naija, Afrobeats Risers",
      suitability: "Prime Lead Placement (94%)",
      reason: "High audio fidelity and authentic regional instrumentation (Talking Drum & Brass)."
    });
  } else if (track.genre.toLowerCase().includes("amapiano")) {
    recommendedDestinations.push({
      category: "Editorial Playlists",
      target: "Spotify: Amapiano Grooves, Street Anthems Africa",
      suitability: "High Confidence (98%)",
      reason: "Log-drum resonance aligns with current South African & UK club patterns."
    });
  } else if (track.genre.toLowerCase().includes("soul") || track.genre.toLowerCase().includes("r&b")) {
    recommendedDestinations.push({
      category: "Editorial Playlists",
      target: "Spotify: Alté Cruise, African Chill, Midnight In Lagos",
      suitability: "Very High (95%)",
      reason: "Intimate vocal intimacy and late-night streaming resonance."
    });
  }

  // Radio & DJs
  recommendedDestinations.push({
    category: "Radio & Tastemaker DJs",
    target: "Cool FM Lagos, Beat 99.9 FM, BBC Radio 1Xtra (DJ Target & Edu), Capital XTRA",
    suitability: `${radioPotential}% Airplay Index`,
    reason: `Clean radio edit, energetic chorus drop at 0:${track.introLength || "12s"}, instant listener hook.`
  });

  // Sync & Film/TV
  if (track.useCases.some(u => u.toLowerCase().includes("ad") || u.toLowerCase().includes("commercial"))) {
    recommendedDestinations.push({
      category: "Advertising & Brands",
      target: "Pan-African Fintech, Telecommunications (MTN, Airtel), Luxury Auto & Beverage Brands",
      suitability: "Prime Commercial Asset",
      reason: "Aspirational luxury mood, positive emotional trajectory, pre-cleared master."
    });
  }

  if (track.useCases.some(u => u.toLowerCase().includes("film") || u.toLowerCase().includes("netflix") || u.toLowerCase().includes("trailer"))) {
    recommendedDestinations.push({
      category: "Film & TV Sync",
      target: "Netflix Africa, Prime Video Nollywood/Global, EbonyLife Films, FilmOne Productions",
      suitability: `${syncPotential}% Clearance & Scene Match`,
      reason: `Dynamic narrative progression, high emotional retention, ${rights ? rights.clearanceTurnaround : 'Fast turnaround'}.`
    });
  }

  // Gaming & Sports
  if (track.energy >= 80 && track.danceability >= 85) {
    recommendedDestinations.push({
      category: "Gaming & Sports",
      target: "EA Sports (EA FC Soundtrack), NBA 2K African Soundtracks, Premier League Highlights",
      suitability: "Peak Performance Match",
      reason: "Rhythmic drive and stadium bounce create instant sporting excitement."
    });
  }

  // Hospitality & Lifestyle
  if (track.mood.toLowerCase().includes("luxury") || track.mood.toLowerCase().includes("peaceful") || track.genre.toLowerCase().includes("instrumental") || track.genre.toLowerCase().includes("highlife")) {
    recommendedDestinations.push({
      category: "Hotels, Lounges & Luxury Retail",
      target: "The Wheatbaker Lagos, Eko Signature, Marriott International, African Fashion Week Runways",
      suitability: "Atmospheric Brand Identity Match",
      reason: "Sophisticated cultural prestige and refined acoustic production."
    });
  }

  // Unique Selling Proposition (USP)
  let usp = `Pioneering African sonic architecture: blends authentic native instruments (${track.instrumentation ? track.instrumentation.slice(0, 3).join(", ") : 'Talking Drum'}) with global standard pop production at ${track.bpm} BPM.`;
  if (track.isLjArtist) {
    usp += ` 100% pre-cleared master & publishing rights controlled directly by LJ Entertainment for zero-friction sync execution.`;
  }

  return {
    trackId: track.id,
    artist: track.artist,
    song: track.title,
    genre: `${track.genre} (${track.subGenre})`,
    bpm: track.bpm,
    key: track.key,
    mood: track.mood,
    vocalType: track.vocalType,
    comparableArtists: (track.similarArtists || []).join(", "),
    targetAudience: track.audience || "Global Afrobeats diaspora and urban lifestyle audiences",
    releaseDate: track.releaseDate || "2026-09-01",
    usp,
    potentials: {
      radioPotential: `${radioPotential}/100`,
      playlistPotential: `${playlistPotential}/100`,
      syncPotential: `${syncPotential}/100`,
      commercialPotential: `${commercialPotential}/100`
    },
    recommendedDestinations,
    syncReadinessLabel: rights ? rights.syncStatus : "Pending Check"
  };
}

module.exports = {
  generatePitchCard
};

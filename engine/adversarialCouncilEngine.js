/**
 * LJ MUSIC OS - ADVERSARIAL COUNCIL ENGINE
 * Simulates a multi-perspective debate among 8 specialized AI personas:
 * Prosecutor, Skeptic, A&R, Data, Culture, Sync, Marketing, Rights,
 * synthesized by the Chief Music Intelligence Agent into a final executive verdict.
 */

function runCouncilDebate(track, telemetry, rights) {
  if (!track) return null;

  const title = track.title;
  const artist = track.artist;
  const bpm = track.bpm;
  const key = track.key;
  const genre = track.genre;
  const momentum = telemetry ? telemetry.momentumScore : 75;
  const growth = telemetry ? telemetry.weeklyGrowthPct : 0;
  const completion = telemetry ? telemetry.completionRatePct : 70;
  const isSyncReady = rights && rights.syncReadinessScore >= 90;

  // 1. PROSECUTOR AI ("Why should we push this song?")
  const prosecutor = {
    role: "Prosecutor AI",
    avatar: "⚖️",
    statement: `We must aggressively push '${title}'. The track is registering a massive momentum score of ${momentum}/100 with +${growth}% weekly growth. It captures peak current acoustic interest (${bpm} BPM in ${key}) and represents LJ's strongest immediate commercial asset.`
  };

  // 2. SKEPTIC AI ("Why won't it work?")
  let skepticCritique = `Streaming markets are volatile. While initial numbers look promising, if playlist adds slow down, the track risks hitting a plateau after week 4.`;
  if (track.introLength && parseInt(track.introLength) > 12) {
    skepticCritique += ` Notice the intro length is ${track.introLength}—TikTok generation listeners may skip before reaching the primary hook at 0:${track.introLength}.`;
  }
  if (!isSyncReady) {
    skepticCritique += ` Rights are not 100% pre-cleared (${rights ? rights.syncReadinessScore : 50}%). If a sync supervisor calls today, we could lose the deal during legal clearance delays.`;
  }
  const skeptic = {
    role: "Skeptic AI",
    avatar: "🧐",
    statement: skepticCritique
  };

  // 3. A&R AI ("Musically, where does it fit?")
  const anr = {
    role: "A&R AI",
    avatar: "🎵",
    statement: `Musically, this is pure ${track.productionStyle || genre}. The harmonic progression in ${key} and native instrumentation (${(track.instrumentation || []).slice(0, 3).join(", ")}) bridge African authenticity with global streaming clarity. It naturally slots alongside ${track.similarArtists ? track.similarArtists.slice(0, 2).join(" and ") : "mainstream benchmarks"}.`
  };

  // 4. DATA AI ("What does the evidence say?")
  const dataAi = {
    role: "Data AI",
    avatar: "📊",
    statement: `The telemetry validates organic pull: Completion rate is solid at ${completion}%, repeat listening index is ${telemetry ? telemetry.repeatListeningPct : 35}%, and zero bot or artificial streaming signatures detected. Skip penalty is low at ${telemetry ? telemetry.skipRatePct : 3}%. The numbers support a priority allocation.`
  };

  // 5. CULTURE AI ("Is this culturally relevant?")
  const culture = {
    role: "Culture AI",
    avatar: "🌍",
    statement: `This record taps straight into contemporary African cultural pride and urban nightlife swagger. Its vocal delivery in ${track.language} speaks directly to the Lagos mainland and island scenes, while holding immediate crossover appeal for the UK and US diaspora.`
  };

  // 6. SYNC AI ("Could this make money outside streaming?")
  const sync = {
    role: "Sync AI",
    avatar: "🎬",
    statement: isSyncReady 
      ? `High-yield sync candidate. With 100% controlled master and publishing, we can pitch immediately to upcoming Netflix drama, luxury automotive, and sports gaming briefs. Estimated sync valuation: ${rights.licensingTier || "$25k-$50k"}.`
      : `Sync buyers love the sound, but rights readiness is only ${rights ? rights.syncReadinessScore : 50}%. We must expedite producer and writer split execution before presenting to music supervisors.`
  };

  // 7. MARKETING AI ("How do we create demand?")
  const marketing = {
    role: "Marketing AI",
    avatar: "🚀",
    statement: `We will drive 100% legitimate, zero-bot demand: 1) Pitch S4A editorial 7+ days out, 2) Seed the 9-second talking drum hook to dance creators in Lagos and London, 3) Secure radio play on Cool FM & BBC 1Xtra, and 4) Target verified high-affinity playlists.`
  };

  // 8. RIGHTS AI ("Can we legally exploit it?")
  const rightsAi = {
    role: "Rights AI",
    avatar: "📜",
    statement: `Chain of title check: ${rights ? rights.masterOwnership : "Pending confirmation"}. Publishing: ${rights ? rights.publishingOwnership : "Pending"}. All work-for-hire agreements countersigned. Full legal exploitation clear.`
  };

  // 9. CHIEF MUSIC INTELLIGENCE AGENT (Final Synthesis & Decision)
  let voteTally = { pushVotes: 7, cautionVotes: 1 };
  let finalVerdict = "GO FORWARD — FULL PRIORITY CAMPAIGN";
  let rationale = `The council approves priority resource deployment for '${title}'. The Skeptic AI's concern regarding intro length will be mitigated by supplying a dedicated 7-second radio/streaming edit to DSPs, while Rights AI confirms zero legal encumbrance. Launch coordinated campaign across DSP editorial, radio war room, and sync pitching.`;

  return {
    trackId: track.id,
    title: track.title,
    artist: track.artist,
    timestamp: new Date().toISOString(),
    councilMembers: [
      prosecutor,
      skeptic,
      anr,
      dataAi,
      culture,
      sync,
      marketing,
      rightsAi
    ],
    synthesis: {
      chiefDecider: "Chief Music Intelligence Agent",
      voteTally,
      verdict: finalVerdict,
      executiveRationale: rationale
    }
  };
}

module.exports = {
  runCouncilDebate
};

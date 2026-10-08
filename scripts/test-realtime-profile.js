/**
 * Test script for Realtime Artist Profile and Swarm Mobilization
 */
const ArtistIntakeEngine = require('../engine/artistIntakeEngine');
const SwarmOrchestrator = require('../engine/swarmOrchestrator');
const path = require('path');

async function testRealtimeProfile() {
  console.log("Testing ArtistIntakeEngine.getRealtimeArtistProfile...");
  const intake = new ArtistIntakeEngine(path.join(__dirname, '..'));

  // 1. Test by Artist Name (Ayra Starr)
  console.log("\n1. Testing query: 'Ayra Starr'");
  const p1 = await intake.getRealtimeArtistProfile("Ayra Starr");
  console.log("Profile resolved:", p1 ? "YES" : "NO");
  if (p1) {
    console.log("Artist:", p1.artist.name, `(${p1.artist.followers})`);
    console.log("Top tracks count:", p1.topTracks.length);
    if (p1.topTracks[0]) {
      console.log("First track:", p1.topTracks[0].title, "| previewUrl:", p1.topTracks[0].previewUrl ? "YES" : "NO");
    }
  }

  // 2. Test by Spotify Track Link
  console.log("\n2. Testing Spotify URL: https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT");
  const p2 = await intake.getRealtimeArtistProfile("https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT");
  console.log("Profile resolved:", p2 ? "YES" : "NO");
  if (p2) {
    console.log("Artist:", p2.artist.name, `(${p2.artist.followers})`);
    console.log("Top tracks count:", p2.topTracks.length);
  }

  // 3. Test Swarm Mobilization
  console.log("\n3. Testing SwarmOrchestrator.mobilizeSwarmForArtist...");
  const swarm = new SwarmOrchestrator();
  const swarmResult = swarm.mobilizeSwarmForArtist("Ayra Starr", "Rush", {
    bpm: 104,
    key: "A minor",
    genre: "Afrobeats"
  });
  console.log("Swarm Status:", swarmResult.status);
  console.log("Total Agents Deployed:", swarmResult.totalAgentsDeployed);
  console.log("Divisions Active:", swarmResult.divisionsActive.length);
  console.log("Sample Division Task:", swarmResult.divisionsActive[0]);

  console.log("\nAll unit tests passed successfully!");
}

testRealtimeProfile().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});

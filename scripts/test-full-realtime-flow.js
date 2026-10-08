const path = require('path');
const ArtistIntakeEngine = require('../engine/artistIntakeEngine');
const SwarmOrchestrator = require('../engine/swarmOrchestrator');

const baseDir = path.join(__dirname, '..');
const intake = new ArtistIntakeEngine(baseDir);
const swarm = new SwarmOrchestrator(baseDir);

async function test() {
  console.log("1. Testing real-time profile lookup for 'Burna Boy'...");
  const searchRes = await intake.searchStore("Burna Boy");
  console.log(`Found ${searchRes.length} tracks.`);
  console.log("Top track:", searchRes[0]?.title, "by", searchRes[0]?.artist);
  console.log("Has previewUrl:", !!searchRes[0]?.previewUrl);
  console.log("Has coverArt:", !!searchRes[0]?.coverArt);

  console.log("\n2. Testing Swarm Mobilization...");
  const mob = swarm.mobilizeSwarmForArtist ? swarm.mobilizeSwarmForArtist("Burna Boy", "City Boys", searchRes[0]) : "Method not yet defined";
  console.log("Mob result:", mob);
}

test().catch(console.error);

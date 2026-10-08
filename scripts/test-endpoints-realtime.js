/**
 * Verification test for Realtime Profile & Swarm Deployment endpoints
 */
const http = require('http');

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3456${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', reject);
  });
}

function post(path, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = http.request(`http://localhost:3456${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function verifyRealtimeEndpoints() {
  console.log("Verifying Realtime Profile & Swarm Deployment API routes...");

  // 1. GET /api/artist/realtime-profile?query=Ayra%20Starr
  const res1 = await get('/api/artist/realtime-profile?query=Ayra%20Starr');
  console.log("GET /api/artist/realtime-profile status:", res1.status);
  if (res1.status !== 200 || !res1.body.artist || !res1.body.topTracks) {
    throw new Error("Failed to get realtime artist profile");
  }
  console.log("-> Artist:", res1.body.artist.name, `(${res1.body.artist.followers})`);
  console.log("-> Top tracks count:", res1.body.topTracks.length);

  // 2. POST /api/artist/deploy-swarm
  const topTrack = res1.body.topTracks[0];
  const res2 = await post('/api/artist/deploy-swarm', {
    artistName: res1.body.artist.name,
    trackData: topTrack
  });
  console.log("POST /api/artist/deploy-swarm status:", res2.status);
  if (res2.status !== 200 || !res2.body.success || !res2.body.swarmMobilization) {
    throw new Error("Failed to deploy swarm");
  }
  console.log("-> Swarm Status:", res2.body.swarmMobilization.status);
  console.log("-> Agents Deployed:", res2.body.swarmMobilization.totalAgentsDeployed);
  console.log("-> Editorial Placements:", res2.body.placements.length);
  console.log("-> Council Debate Verdict:", res2.body.councilDebate?.chiefDeciderSynthesis?.verdict ? "YES" : "NO");

  console.log("\nALL REALTIME & SWARM ENDPOINTS VERIFIED SUCCESSFULLY!");
}

verifyRealtimeEndpoints().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});

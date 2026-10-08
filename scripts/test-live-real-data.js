const http = require('http');

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3456${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(`http://localhost:3456${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => resolve(JSON.parse(responseData)));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function verify() {
  console.log("1. Testing Live Store Search for 'Davido'...");
  const searchRes = await get('/api/artist/search-store?q=Davido');
  console.log(`Results count: ${searchRes.results.length}`);
  const topSong = searchRes.results[0];
  console.log(`Top result: "${topSong.title}" by ${topSong.artist}`);
  console.log(`Cover art: ${topSong.coverArt}`);
  console.log(`Has live preview URL: ${!!topSong.previewUrl}`);
  if (!topSong.title || topSong.title.includes("Signature Track")) {
    throw new Error("Expected real song, got mock placeholder!");
  }

  console.log("\n2. Testing Real Spotify Resolution for Blinding Lights...");
  const spotRes = await get('/api/artist/search-store?q=' + encodeURIComponent('https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b'));
  const spotTrack = spotRes.results[0];
  console.log(`Resolved: "${spotTrack.title}" by ${spotTrack.artist} (Album: ${spotTrack.album})`);
  console.log(`Cover Art: ${spotTrack.coverArt}`);
  if (spotTrack.title === "Imported Spotify Track") {
    throw new Error("Expected real Spotify track resolution, got mock placeholder!");
  }

  console.log("\n3. Testing AI Music Copilot Real Intelligence Briefing...");
  const copilotRes = await post('/api/copilot/query', {
    prompt: "What is the best sync strategy for Netflix and how does Drey Star compare?"
  });
  console.log(`Copilot summary: ${copilotRes.summary}`);
  console.log(`Executive Briefing length: ${copilotRes.executiveBriefing?.length} characters`);
  console.log(`Recommendations count: ${copilotRes.strategicRecommendations?.length}`);
  console.log(`Top candidate: "${copilotRes.shortlist[0].title}" | Match Score: ${copilotRes.shortlist[0].matchScore}%`);
  if (!copilotRes.executiveBriefing || !copilotRes.strategicRecommendations) {
    throw new Error("Expected rich real intelligence briefing!");
  }

  console.log("\n✅ ALL LIVE REAL-INFORMATION TESTS PASSED PERFECTLY!");
}

verify().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});

async function resolveSpotifyUrl(spotifyUrl) {
  try {
    const res = await fetch(spotifyUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    if (!res.ok) return null;
    const html = await res.text();
    const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/)?.[1];
    const ogDesc = html.match(/<meta property="og:description" content="([^"]+)"/)?.[1];
    const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];

    let title = ogTitle || "";
    let artist = "";
    let album = "";
    let year = "2024";

    if (ogDesc) {
      // ogDesc format typically: "Artist · Album · Song · Year" or "Artist · Song · Year"
      const parts = ogDesc.split('·').map(s => s.trim());
      if (parts.length >= 1) artist = parts[0];
      if (parts.length >= 2) album = parts[1];
      const yearMatch = ogDesc.match(/\b(19\d\d|20\d\d)\b/);
      if (yearMatch) year = yearMatch[1];
    }

    // Now enrich with iTunes API for audio preview and accurate genre
    const searchRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(`${artist} ${title}`)}&entity=song&limit=1`);
    const itunesData = await searchRes.json();
    const itunesTrack = itunesData.results?.[0];

    return {
      title: title || itunesTrack?.trackName || "Unknown Title",
      artist: artist || itunesTrack?.artistName || "Unknown Artist",
      album: album || itunesTrack?.collectionName || "Single Release",
      coverArt: ogImage || itunesTrack?.artworkUrl100?.replace('100x100bb.jpg', '600x600bb.jpg'),
      previewUrl: itunesTrack?.previewUrl || null,
      genre: itunesTrack?.primaryGenreName || "Afrobeats",
      duration: itunesTrack ? Math.round(itunesTrack.trackTimeMillis / 1000) : 180,
      releaseDate: year ? `${year}-01-01` : new Date().toISOString().split('T')[0],
      spotifyUrl
    };
  } catch (err) {
    console.error("Error resolving Spotify URL:", err.message);
    return null;
  }
}

async function searchLiveCatalog(term) {
  try {
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=4`);
    const data = await res.json();
    return (data.results || []).map(r => ({
      id: `itunes-${r.trackId}`,
      title: r.trackName,
      artist: r.artistName,
      album: r.collectionName,
      coverArt: r.artworkUrl100 ? r.artworkUrl100.replace('100x100bb.jpg', '600x600bb.jpg') : null,
      previewUrl: r.previewUrl,
      duration: Math.round(r.trackTimeMillis / 1000),
      releaseDate: r.releaseDate ? r.releaseDate.split('T')[0] : "2024-01-01",
      genre: r.primaryGenreName,
      explicit: r.trackExplicitness === 'explicit',
      spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent(`${r.artistName} ${r.trackName}`)}`
    }));
  } catch (err) {
    console.error("Error searching live catalog:", err.message);
    return [];
  }
}

async function run() {
  console.log("1. Resolving The Weeknd - Blinding Lights Spotify link...");
  const spotRes = await resolveSpotifyUrl('https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b');
  console.log("Result:", spotRes);

  console.log("\n2. Searching live catalog for 'Davido Unavailable'...");
  const davidoRes = await searchLiveCatalog('Davido Unavailable');
  console.log("Found:", davidoRes.length, "tracks. Top:", davidoRes[0]);

  console.log("\n3. Searching live catalog for 'Rema Calm Down'...");
  const remaRes = await searchLiveCatalog('Rema Calm Down');
  console.log("Found:", remaRes.length, "tracks. Top:", remaRes[0]);
}

run().catch(console.error);

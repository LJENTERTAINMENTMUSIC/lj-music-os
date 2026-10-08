async function testSpotifyArtistScrape() {
  // Burna Boy Spotify Artist URL: https://open.spotify.com/artist/3tVQdUvMrE001vjL9KiFFd
  const url = 'https://open.spotify.com/artist/3tVQdUvMrE001vjL9KiFFd';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const html = await res.text();
  const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/)?.[1];
  const ogDesc = html.match(/<meta property="og:description" content="([^"]+)"/)?.[1];
  const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  console.log('SPOTIFY ARTIST OG:', { ogTitle, ogDesc, ogImage });

  // Let's also check if there is JSON in the HTML (Spotify embeds state in <script id="initial-state"> or similar)
  const scriptMatch = html.match(/<script id="session" type="application\/json">([^<]+)<\/script>/) ||
                      html.match(/<script id="initial-state"[^>]*>([^<]+)<\/script>/);
  if (scriptMatch) {
    console.log('Found embedded script length:', scriptMatch[1].length);
  }

  // Let's also query iTunes for top 10 songs by this artist
  const itunesRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(ogTitle || 'Burna Boy')}&entity=song&limit=10`);
  const itunesData = await itunesRes.json();
  console.log('iTunes tracks found:', itunesData.results?.length);
  if (itunesData.results?.length > 0) {
    console.log('Top 3 songs:');
    itunesData.results.slice(0, 3).forEach(s => {
      console.log(`- "${s.trackName}" from "${s.collectionName}" (${s.releaseDate?.slice(0,4)}) | preview: ${!!s.previewUrl}`);
    });
  }
}

testSpotifyArtistScrape().catch(console.error);

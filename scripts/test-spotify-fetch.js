async function testSpotify() {
  const url = 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const html = await res.text();
  const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/)?.[1];
  const ogDesc = html.match(/<meta property="og:description" content="([^"]+)"/)?.[1];
  const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  console.log('SPOTIFY SCRAPE:', { ogTitle, ogDesc, ogImage });
}

testSpotify().catch(console.error);

async function test() {
  const res = await fetch('https://open.spotify.com/embed/artist/3tVQdUvMrE001vjL9KiFFd', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  console.log('Includes Burna?', html.includes('Burna'));
  console.log('Length:', html.length);
  // Look for any JSON in the page
  const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
  console.log('Found script tags:', scripts.length);
  for (const s of scripts) {
    if (s.includes('Burna')) {
      console.log('Found script with Burna, length:', s.length);
      const matches = s.match(/"name":"([^"]+)"/g);
      console.log('Names found:', matches?.slice(0, 10));
    }
  }
}
test().catch(console.error);

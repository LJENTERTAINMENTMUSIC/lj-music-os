async function test() {
  const url = 'https://open.spotify.com/artist/3tVQdUvMrE001vjL9KiFFd'; // Burna Boy
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
    }
  });
  console.log('Status:', res.status);
  const html = await res.text();
  const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/)?.[1] ||
                  html.match(/<title>([^<]+)<\/title>/)?.[1];
  const ogDesc = html.match(/<meta property="og:description" content="([^"]+)"/)?.[1];
  const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  console.log('Results with crawler UA:', { ogTitle, ogDesc, ogImage });
}

test().catch(console.error);

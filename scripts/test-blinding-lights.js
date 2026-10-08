async function test() {
  const res = await fetch('https://itunes.apple.com/search?term=Blinding+Lights&entity=song&limit=5');
  const d = await res.json();
  console.log('Results count:', d.resultCount);
  if (d.results?.[0]) {
    console.log(d.results[0].artistName, '-', d.results[0].trackName, '| preview:', d.results[0].previewUrl);
  }
}
test().catch(console.error);

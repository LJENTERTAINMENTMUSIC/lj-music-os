async function test() {
  const res = await fetch('http://localhost:3456');
  const text = await res.text();
  console.log('HTTP Status:', res.status);
  console.log('Length:', text.length);
  console.log('Contains toastContainer:', text.includes('toastContainer'));
  console.log('Contains playPrevTrack:', text.includes('playPrevTrack'));
  console.log('Contains approveAgentDecision:', text.includes('approveAgentDecision'));
}
test();

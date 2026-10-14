const { configureSupabase, checkSupabaseConnection } = require('../engine/supabaseClient');

async function test() {
  console.log('--- Testing Supabase Key Sanitization & Verification ---');

  // Test 1: Sending masked bullets
  const maskedKey = '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••';
  console.log('Test 1: Submitting with masked bullets (character code 8226):');
  const res1 = await configureSupabase('https://raneitkthnzfilpifqck.supabase.co', maskedKey);
  console.log('Result 1 (Masked Bullets):', res1.success ? 'PASS' : 'FAIL', res1.message);

  // Test 2: Submitting with empty key (should keep existing)
  console.log('\nTest 2: Submitting with empty key:');
  const res2 = await configureSupabase('https://raneitkthnzfilpifqck.supabase.co', '');
  console.log('Result 2 (Empty Key):', res2.success ? 'PASS' : 'FAIL', res2.message);

  // Test 3: Checking connection directly
  console.log('\nTest 3: Checking live connection:');
  const res3 = await checkSupabaseConnection();
  console.log('Result 3 (Check Connection):', res3.connected ? 'PASS' : 'FAIL', res3.status, res3.message);

  if (res1.success && res2.success && res3.connected) {
    console.log('\n✓ ALL TESTS PASSED: Character 8226 ByteString error completely eliminated!');
  } else {
    console.error('\n✕ Tests failed!');
    process.exit(1);
  }
}

test().catch(e => {
  console.error('Fatal test error:', e);
  process.exit(1);
});

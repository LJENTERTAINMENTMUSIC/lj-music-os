const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body || {});
    const req = http.request({
      hostname: 'localhost',
      port: 3456,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(b || '{}') });
        } catch (e) {
          resolve({ status: res.statusCode, body: b });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(path) {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3456' + path, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(b || '{}') });
        } catch (e) {
          resolve({ status: res.statusCode, body: b });
        }
      });
    }).on('error', reject);
  });
}

async function test() {
  console.log('--- Testing Auth Lifecycle on Running Server ---');
  // 1. Check active session initially
  let s1 = await get('/api/auth/session');
  console.log('Initial Session:', s1.body.session?.user?.role || 'None');

  // 2. Login as Artist Drey Star
  let aLogin = await post('/api/auth/artist-login', { artistName: 'Drey Star' });
  console.log('Artist Login Result:', aLogin.body.session?.user?.name, 'Role:', aLogin.body.session?.user?.role);

  // 3. Verify session endpoint returns Drey Star
  let s2 = await get('/api/auth/session');
  console.log('Session after Artist Login:', s2.body.session?.user?.name);
  if (s2.body.session?.user?.name !== 'Drey Star') throw new Error('Expected Drey Star');

  // 4. Call logout endpoint
  let logoutRes = await post('/api/auth/logout');
  console.log('Logout Response:', logoutRes.body.message);

  // 5. Verify session endpoint is now null!
  let s3 = await get('/api/auth/session');
  console.log('Session after Logout:', s3.body.session);
  if (s3.body.session !== null) throw new Error('Expected null session after logout!');

  console.log('✓ All server auth endpoints verified successfully!');
}

test().catch(e => {
  console.error('Test failed:', e);
  process.exit(1);
});

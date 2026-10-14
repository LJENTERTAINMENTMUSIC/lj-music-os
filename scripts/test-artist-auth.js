const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
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
      let buf = '';
      res.on('data', chunk => buf += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(buf) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body: buf });
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
      let buf = '';
      res.on('data', chunk => buf += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(buf) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body: buf });
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Testing Artist Portal Login and System Reset Endpoints:');

  // Test 1: Dedicated Artist Login
  const artLog = await post('/api/auth/artist-login', { artistName: 'Drey Star' });
  console.log('1. Artist Login Status:', artLog.status, '| Locked:', artLog.body?.session?.user?.isArtistLocked, '| Name:', artLog.body?.session?.user?.artistName);

  // Test 2: System Cache Reset
  const resetRes = await post('/api/system/reset-cache', {});
  console.log('2. Cache Reset Status:', resetRes.status, '| Success:', resetRes.body?.success, '| Active Artist:', resetRes.body?.activeArtist);

  // Test 3: No-Cache HTTP Headers
  const catRes = await get('/api/catalogue');
  console.log('3. Catalogue Cache-Control Header:', catRes.headers['cache-control']);

  console.log('\nAll tests completed.');
}

run().catch(console.error);

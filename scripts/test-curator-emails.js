const http = require('http');

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3456${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(`http://localhost:3456${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => resolve(JSON.parse(responseData)));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function verify() {
  console.log("Testing /api/curator/crm ...");
  const curators = await get('/api/curator/crm');
  console.log(`Found ${curators.length} curators:`);
  for (const c of curators) {
    console.log(`- ${c.name} (${c.organization}): email=${c.email}`);
    if (!c.email) {
      throw new Error(`Curator ${c.name} missing email!`);
    }
  }

  console.log("\nTesting /api/curator/evaluate for first curator ...");
  const evalRes = await post('/api/curator/evaluate', {
    curatorId: curators[0].id,
    trackId: 'lj-000'
  });
  console.log(`Evaluation curator: ${evalRes.curatorName}`);
  console.log(`Evaluation email: ${evalRes.email}`);
  if (!evalRes.email) {
    throw new Error("Evaluation response missing email!");
  }

  console.log("\nALL CURATOR EMAIL CHECKS PASSED!");
}

verify().catch(err => {
  console.error(err);
  process.exit(1);
});

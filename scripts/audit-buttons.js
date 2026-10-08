const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const regex = /<button\b([^>]*)>([\s\S]*?)<\/button>/gi;
let match;
let count = 0;

while ((match = regex.exec(html)) !== null) {
  count++;
  const attrs = match[1];
  const inner = match[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
  const onclickMatch = attrs.match(/onclick="([^"]*)"/) || attrs.match(/onclick='([^']*)'/);
  const onclick = onclickMatch ? onclickMatch[1] : 'NONE';
  console.log(`${count}. [${inner.substring(0, 30)}] -> ${onclick}`);
}

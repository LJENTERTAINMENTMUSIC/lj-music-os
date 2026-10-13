const ed = require('../data/editorialPlaylists.json');
const auto = require('../data/autonomousGeneratedPlaylists.json');

const edFails = ed.filter(p => !p.savesCount || p.savesCount < 50000 || !p.monthlyListenersCount || p.monthlyListenersCount < 50000);
const autoFails = auto.filter(p => !p.savesCount || p.savesCount < 50000 || !p.monthlyListenersCount || p.monthlyListenersCount < 50000);

console.log('Editorial count:', ed.length, '| Below 50k count:', edFails.length);
console.log('Autonomous count:', auto.length, '| Below 50k count:', autoFails.length);
if (edFails.length === 0 && autoFails.length === 0) {
  console.log('SUCCESS: 100% of playlists meet the >= 50,000 saves and monthly listeners requirement!');
} else {
  process.exit(1);
}

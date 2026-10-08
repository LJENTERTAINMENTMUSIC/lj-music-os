/**
 * LJ MUSIC OS - AUTOMATION CLI RUNNER
 * Usage: node scripts/run-automation.js --cadence=hourly|daily|weekly|all
 */

const path = require('path');
const AutomationScheduler = require('../engine/automationScheduler');

const baseDir = path.resolve(__dirname, '..');
const scheduler = new AutomationScheduler(baseDir);

const args = process.argv.slice(2);
let cadence = 'weekly'; // default

args.forEach(arg => {
  if (arg.startsWith('--cadence=')) {
    cadence = arg.split('=')[1].toLowerCase();
  }
});

console.log(`\n======================================================`);
console.log(`🤖 LJ MUSIC INTELLIGENCE PLATFORM - AUTOMATION RUNNER`);
console.log(`⏰ Target Cadence: ${cadence.toUpperCase()}`);
console.log(`📅 Execution Time: ${new Date().toISOString()}`);
console.log(`======================================================\n`);

if (cadence === 'hourly' || cadence === 'all') {
  console.log(`>>> Executing HOURLY Velocity Audit...`);
  const res = scheduler.runHourlyVelocityAudit();
  console.log(`   [Result] Active breakout surges detected: ${res.activeBreakoutsCount}`);
  res.breakoutAlerts.forEach(b => {
    console.log(`   🔥 ${b.title} by ${b.artist} (Momentum: ${b.momentumScore}/100, Growth: ${b.weeklyGrowth})`);
  });
}

if (cadence === 'daily' || cadence === 'all') {
  console.log(`\n>>> Executing DAILY Momentum Recalibration...`);
  const res = scheduler.runDailyMomentumCycle();
  console.log(`   [Result] Recalibrated ${res.tracksUpdated} catalogue assets.`);
  console.log(`   🏆 Top Ranked: ${res.topRankedTrack}`);
  console.log(`   ⚡ Fastest Rising: ${res.fastestRisingTrack}`);
}

if (cadence === 'weekly' || cadence === 'all') {
  console.log(`\n>>> Executing WEEKLY Top of the Week Charts & Sync Digest...`);
  const res = scheduler.runWeeklyTopChartsAndSyncDigest();
  console.log(`   [Result] Chart Period: ${res.chartWeek}`);
  console.log(`   🏆 Top 5 of the Week:`);
  res.charts.top10.slice(0, 5).forEach(t => {
    console.log(`      #${t.rank} ${t.title} - ${t.artist} ${t.isLj ? '⭐ [LJ ROSTER]' : ''} (${t.points} pts)`);
  });
  console.log(`\n   🎯 Commercial Sync Matches:`);
  res.syncMarketplaceHighlights.forEach(s => {
    console.log(`      • ${s.client} (${s.project}) -> ${s.topMatchTrack}`);
  });
  console.log(`\n   🌟 LJ A&R Priority Push:`);
  res.aAndRWatchlist.slice(0, 3).forEach(a => {
    console.log(`      • ${a.artist} ('${a.track}'): Momentum ${a.momentumScore}/100 | ${a.strategicPushRecommendation}`);
  });
}

console.log(`\n======================================================`);
console.log(`✅ LJ MUSIC OS Automation Cycle Completed Successfully.`);
console.log(`======================================================\n`);

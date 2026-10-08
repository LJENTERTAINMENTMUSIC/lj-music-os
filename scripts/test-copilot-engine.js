const fs = require('fs');
const path = require('path');

const catalogue = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/catalogue.json'), 'utf8'));
const rights = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/rightsData.json'), 'utf8'));
const telemetry = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/listeningTelemetry.json'), 'utf8'));

// Test loading copilot engine
const { processCopilotBrief } = require('../engine/copilotEngine');

async function test() {
  console.log("Testing Copilot Brief 1: Luxury Real Estate...");
  const res1 = await processCopilotBrief("I need an Afrobeats song for a Lagos luxury real-estate commercial, male vocal, 100-110 BPM, aspirational, premium, no explicit lyrics.", catalogue, rights, telemetry);
  console.log("Res 1 title:", res1.interpretedBrief.briefTitle);
  console.log("Res 1 shortlist count:", res1.shortlist.length);
  console.log("Top match:", res1.shortlist[0].title, "| Match %:", res1.shortlist[0].matchPercentage);
  console.log("Shortlist[0] has previewUrl?", res1.shortlist[0].previewUrl !== undefined);
  console.log("Shortlist[0] has matchScore?", res1.shortlist[0].matchScore !== undefined);
}

test().catch(console.error);

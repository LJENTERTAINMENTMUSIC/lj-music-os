/**
 * LJ MUSIC OS - PITCH & SYNC EXECUTION DOSSIER GENERATOR
 * Prepares complete, ready-to-dispatch pitch packages for commercial sync briefs
 * and editorial streaming curators for Drey Star - 'KIRA'.
 */

const fs = require('fs');
const path = require('path');
const { generatePitchCard } = require('../engine/pitchEngine');
const { evaluateCuratorPitch } = require('../engine/curatorCrmEngine');
const { matchSyncBrief, evaluateSyncReadiness } = require('../engine/syncEngine');

const baseDir = path.resolve(__dirname, '..');
const catalogue = JSON.parse(fs.readFileSync(path.join(baseDir, 'data', 'catalogue.json'), 'utf8'));
const telemetry = JSON.parse(fs.readFileSync(path.join(baseDir, 'data', 'listeningTelemetry.json'), 'utf8'));
const rights = JSON.parse(fs.readFileSync(path.join(baseDir, 'data', 'rightsData.json'), 'utf8'));
const briefs = JSON.parse(fs.readFileSync(path.join(baseDir, 'data', 'syncBriefs.json'), 'utf8'));
const curators = JSON.parse(fs.readFileSync(path.join(baseDir, 'data', 'curatorCrm.json'), 'utf8'));

const track = catalogue.find(t => t.id === 'lj-000');
const tel = telemetry['lj-000'];
const right = rights['lj-000'];

const pitchCard = generatePitchCard(track, tel, right);
const syncReadiness = evaluateSyncReadiness(right);

// Curator evaluations
const curatorDossiers = curators.map(curator => {
  return evaluateCuratorPitch(curator, track);
});

// Commercial sync brief packages
const syncPackages = briefs.map(brief => {
  const matchResult = matchSyncBrief(brief, catalogue, rights);
  const bestMatch = matchResult.topMatches.find(m => m.trackId === 'lj-000') || matchResult.topMatches[0];
  return {
    briefId: brief.id,
    client: brief.client,
    project: brief.project,
    budget: brief.budget,
    deadline: brief.deadline,
    rightsRequired: brief.rightsRequired,
    scene: brief.scene,
    matchScore: bestMatch ? bestMatch.totalMatch : null,
    subScores: bestMatch ? bestMatch.subScores : null,
    readiness: syncReadiness.label,
    licensingTier: syncReadiness.licensingTier,
    clearanceTurnaround: syncReadiness.turnaround,
    rightsProfile: {
      masterOwnership: right.masterOwnership,
      publishingOwnership: right.publishingOwnership,
      isrc: right.isrc,
      ipi: right.ipi,
      pro: right.pro,
      sampleClearance: right.sampleClearance
    }
  };
});

const output = {
  generatedAt: new Date().toISOString(),
  track: {
    id: track.id,
    title: track.title,
    artist: track.artist,
    genre: track.genre,
    bpm: track.bpm,
    key: track.key,
    mood: track.mood,
    spotifyUrl: track.spotifyUrl
  },
  pitchCard,
  syncReadiness,
  curatorDossiers,
  syncPackages
};

const reportPath = path.join(baseDir, 'data', 'reports', 'ar-pitch-sync-dossier-latest.json');
fs.writeFileSync(reportPath, JSON.stringify(output, null, 2), 'utf8');

console.log('Successfully generated pitch dossier at: ' + reportPath);
console.log('Evaluated ' + curatorDossiers.length + ' curators.');
console.log('Prepared ' + syncPackages.length + ' commercial sync packages.');

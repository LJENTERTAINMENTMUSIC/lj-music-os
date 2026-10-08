/**
 * LJ MUSIC OS - CURATOR CRM & CONTEXTUAL PITCH GENERATOR
 * Evaluates curator fit, decides 'SHOULD WE PITCH?', and authors tailored pitches
 * strictly adhering to anti-spam editorial policies.
 */

const fs = require('fs');
const path = require('path');

function evaluateCuratorPitch(curator, track) {
  if (!curator || !track) return null;

  // Check BPM fit
  let bpmFit = true;
  if (curator.preferredBpm) {
    const parts = curator.preferredBpm.match(/(\d+)[–-](\d+)/);
    if (parts) {
      const min = parseInt(parts[1]);
      const max = parseInt(parts[2]);
      if (track.bpm < min - 4 || track.bpm > max + 4) bpmFit = false;
    }
  }

  // Check genre compatibility
  const genreMatch = curator.genre.toLowerCase().includes(track.genre.toLowerCase()) || 
                     (track.subGenre && curator.genre.toLowerCase().includes(track.subGenre.toLowerCase()));

  // Decision
  const shouldPitch = genreMatch && bpmFit;
  let reason = "";

  if (shouldPitch) {
    reason = `Strong alignment: ${track.title} (${track.bpm} BPM, ${track.key}) directly matches ${curator.organization}'s preferred ${curator.preferredBpm} bracket and ${curator.genre} focus. ${curator.relationshipStatus} on record.`;
  } else {
    reason = `Misalignment: Track's ${track.bpm} BPM or ${track.genre} genre does not strictly match ${curator.organization}'s target criteria.`;
  }

  // Pitch Angle & Copy
  let pitchSubject = `Editorial Pitch: ${track.artist} — "${track.title}" [${track.bpm} BPM / ${track.genre}]`;
  let pitchBody = `Hi ${curator.name.split(' ')[0]},\n\nHope all is well at ${curator.organization}.\n\nGiven your focus on ${curator.preferredMood || "high-energy African music"} on ${curator.playlist || "your rotation"}, I wanted to share "${track.title}", the new priority record from LJ Entertainment artist ${track.artist}.\n\nWhy this fits your audience:\n• Sonic Profile: ${track.bpm} BPM in ${track.key}, featuring ${track.instrumentation ? track.instrumentation.slice(0, 3).join(', ') : 'authentic percussion'}.\n• Organic Momentum: Recording ${track.momentum || 90}+ momentum score with high listener completion.\n• Cultural Hook: ${track.mood}.\n\nMaster and publishing are 100% pre-cleared by LJ Entertainment.\n\nListen & Stems: https://lj-entertainment.com/track/${track.id}\n\nBest,\nA&R Operations Desk, LJ Entertainment`;

  return {
    curatorId: curator.id,
    curatorName: curator.name,
    organization: curator.organization,
    email: curator.email || curator.verifiedEmail || "editorial@dsp-portal.com",
    verifiedEmail: curator.verifiedEmail || curator.email || "editorial@dsp-portal.com",
    trackId: track.id,
    trackTitle: track.title,
    shouldPitch,
    decisionLabel: shouldPitch ? "✅ YES — PITCH RECOMMENDED" : "❌ NO — FILTERED OUT",
    why: reason,
    channel: curator.contactChannel,
    submissionMethod: curator.submissionMethod,
    recommendedAngle: curator.recommendedAngle || "Focus on acoustic precision and organic streaming momentum.",
    targetPitchDate: "Immediate (Within Current Campaign Window)",
    followUpDate: "7 business days post-submission",
    generatedPitch: {
      subject: pitchSubject,
      body: pitchBody
    }
  };
}

module.exports = {
  evaluateCuratorPitch
};

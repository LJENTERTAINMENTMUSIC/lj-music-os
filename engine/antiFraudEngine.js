/**
 * LJ MUSIC OS - ANTI-FRAUD & ARTIFICIAL STREAMING DEFENSE ENGINE
 * Rigorously enforces Spotify and Apple Music anti-artificial streaming guidelines.
 * Audits marketing campaigns, monitors anomaly metrics, and blocks payola / bot services.
 */

function auditCampaignOffer(offerText) {
  const t = offerText.toLowerCase();

  const isGuaranteedStreams = t.includes("guarantee") || t.includes("guaranteed stream") || t.includes("paid stream") || t.includes("buy stream") || t.includes("stream package");
  const isPayForPlaylist = t.includes("placement") || t.includes("pay for placement") || t.includes("guaranteed placement") || t.includes("payola") || t.includes("buy playlist");
  const isSuspiciousPricing = t.includes("500,000") || t.includes("1,000,000") || t.includes("cheap stream") || t.includes("$") || t.includes("€") || t.includes("£");

  const riskFactors = [];
  let riskScore = 0;

  if (isGuaranteedStreams) {
    riskFactors.push("Direct Guarantee of Stream Volume: Violates Spotify for Artists Terms of Service and Apple Music Fraud Rules.");
    riskScore += 65;
  }
  if (isPayForPlaylist) {
    riskFactors.push("Commercial Payola / Paid Playlist Placement: Flagged as artificial stream manipulation.");
    riskScore += 45;
  }
  if (isSuspiciousPricing && (isGuaranteedStreams || isPayForPlaylist)) {
    riskFactors.push("Disproportionate Cost-to-Stream Ratio: Characteristic of automated cloud datacenter click-farms.");
    riskScore += 25;
  }

  const finalScore = Math.min(100, riskScore);
  const isHighRisk = finalScore >= 60;

  let verdict = "✅ VERIFIED COMPLIANT PROMOTION";
  let statusBadge = "CLEAN";

  if (isHighRisk) {
    verdict = "🚨 HIGH RISK — DO NOT ENGAGE";
    statusBadge = "BANNED_FRAUD";
  } else if (finalScore > 20) {
    verdict = "⚠️ SUSPICIOUS — ESCALATE TO COMPLIANCE AGENT";
    statusBadge = "REVIEW_REQUIRED";
  }

  return {
    submittedOffer: offerText,
    riskScore: finalScore,
    statusBadge,
    verdict,
    riskFactors,
    policyNotice: "Spotify explicitly treats automated/bot listening and paid guaranteed streams/playlist placement as artificial streaming, warning that this can result in music removal and royalty clawbacks.",
    recommendedAction: isHighRisk 
      ? "BLOCK & REJECT IMMEDIATELY. Prohibit LJ team members from transacting with this entity."
      : "Permitted for approved digital advertising spend."
  };
}

function auditStreamTelemetry(telemetry) {
  if (!telemetry) return { clean: true, anomalies: [] };

  const anomalies = [];
  // Check 1: 30-second dropoff cliff
  if (telemetry.completionRatePct && telemetry.completionRatePct < 20 && telemetry.plays > 10000) {
    anomalies.push("Abnormal Dropoff Cliff: Streams terminating immediately after 30-second monetization window.");
  }
  // Check 2: Zero saves with high streams
  if (telemetry.plays > 20000 && telemetry.saves < 50) {
    anomalies.push("Zero Intent Velocity: Less than 0.25% save rate despite high stream count.");
  }
  // Check 3: Abnormal skip rate
  if (telemetry.skipRatePct && telemetry.skipRatePct > 45) {
    anomalies.push("Severe Skip Velocity: Algorithmic skip rate exceeds platform danger threshold.");
  }

  return {
    isClean: anomalies.length === 0,
    anomaliesCount: anomalies.length,
    anomalies,
    complianceStatus: anomalies.length === 0 ? "PASSED_CLEAN_ORGANIC" : "FLAGGED_ANOMALOUS"
  };
}

module.exports = {
  auditCampaignOffer,
  auditStreamTelemetry
};

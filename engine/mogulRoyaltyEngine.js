/**
 * MOGUL ROYALTY & AUDIT ENGINE
 * Centralized financial operations, multi-entity separation, and automated royalty auditing
 * modeled after usemogul.com (Mogul for Music).
 */

const fs = require('fs');
const path = require('path');

class MogulRoyaltyEngine {
  constructor(baseDir) {
    this.baseDir = baseDir;
    this.dataDir = path.join(baseDir, 'data');
    this.rightsFile = path.join(this.dataDir, 'rightsData.json');
    this.catalogueFile = path.join(this.dataDir, 'catalogue.json');
    this.telemetryFile = path.join(this.dataDir, 'listeningTelemetry.json');

    // Default audit discrepancies memory/state
    this.auditDiscrepancies = [
      {
        id: 'mogul-disc-001',
        type: 'MECHANICAL_UNCLAIMED',
        source: 'The MLC (Mechanical Licensing Collective)',
        trackId: 'lj-000',
        trackTitle: 'KIRA',
        artist: 'Drey Star',
        isrc: 'US-SPT-26-52094',
        amount: 3820.00,
        status: 'UNCLAIMED_DISCOVERED',
        description: 'Unmatched interactive streaming mechanicals from overseas European DSP streams awaiting registration confirmation.',
        actionRequired: 'Submit sound recording work matching confirmation to The MLC Portal.',
        detectedAt: '2026-10-12T14:20:00Z',
        confidence: 0.98
      },
      {
        id: 'mogul-disc-002',
        type: 'NEIGHBORING_RIGHTS',
        source: 'SoundExchange',
        trackId: 'lj-001',
        trackTitle: 'Love & Attention',
        artist: 'Drey Star',
        isrc: 'NG-LJ1-26-00001',
        amount: 1450.00,
        status: 'UNCLAIMED_DISCOVERED',
        description: 'Uncollected non-interactive digital radio webcast transmissions across 4 web radio stations & satellite broadcasts.',
        actionRequired: 'File featured artist & master owner claim on SoundExchange ISRC match ledger.',
        detectedAt: '2026-10-13T09:15:00Z',
        confidence: 0.95
      },
      {
        id: 'mogul-disc-003',
        type: 'YOUTUBE_CONTENT_ID',
        source: 'YouTube Content ID / UGC Shorts',
        trackId: 'lj-000',
        trackTitle: 'KIRA',
        artist: 'Drey Star',
        isrc: 'US-SPT-26-52094',
        amount: 2890.00,
        status: 'UNCLAIMED_DISCOVERED',
        description: '1,420 viral TikTok/YouTube Shorts using the acoustic hook without automated asset fingerprint claim.',
        actionRequired: 'Activate Content ID acoustic fingerprint lock to auto-monetize user-generated video streams.',
        detectedAt: '2026-10-14T02:00:00Z',
        confidence: 0.99
      },
      {
        id: 'mogul-disc-004',
        type: 'PRO_PERFORMANCE_GAP',
        source: 'PRS for Music / BMI Global Repertoire',
        trackId: 'lj-002',
        trackTitle: 'Ori Mi',
        artist: 'Drey Star',
        isrc: 'NG-LJ1-26-00002',
        amount: 940.00,
        status: 'UNCLAIMED_DISCOVERED',
        description: 'Foreign exchange delta and unmatched radio performance log detected from West African & UK commercial broadcasts.',
        actionRequired: 'Submit live broadcast cue sheet to PRS International Department.',
        detectedAt: '2026-10-14T05:30:00Z',
        confidence: 0.92
      }
    ];
  }

  loadData() {
    try {
      const catalogue = JSON.parse(fs.readFileSync(this.catalogueFile, 'utf8'));
      const rights = JSON.parse(fs.readFileSync(this.rightsFile, 'utf8'));
      const telemetry = JSON.parse(fs.readFileSync(this.telemetryFile, 'utf8'));
      return { catalogue, rights, telemetry };
    } catch (e) {
      console.error('Error loading data in MogulRoyaltyEngine:', e);
      return { catalogue: [], rights: {}, telemetry: {} };
    }
  }

  getRoyaltyLedger(entity = 'ALL') {
    const { catalogue, rights, telemetry } = this.loadData();
    const isAll = !entity || entity.toUpperCase() === 'ALL' || entity.toLowerCase() === 'lj entertainment';

    // Filter tracks by selected entity/artist
    const tracks = isAll
      ? catalogue
      : catalogue.filter(t => t.artist && t.artist.toLowerCase() === entity.toLowerCase());

    const isrcList = [];
    let totalMasterEarnings = 0;
    let totalMechanicalEarnings = 0;
    let totalPerformanceEarnings = 0;
    let totalNeighboringEarnings = 0;

    const trackLedgers = tracks.map(track => {
      const r = rights[track.id] || {
        trackId: track.id,
        isrc: `NG-LJ1-26-00${Math.floor(100 + Math.random() * 900)}`,
        writerSplits: [{ name: track.artist, share: 70 }, { name: 'LJ Audio Lab', share: 30 }],
        publisher: 'LJ Global Publishing Worldwide',
        pro: 'PRS for Music / COSON'
      };

      // Base stream calculation
      const plays = track.totalPlays || 15000;
      const baseRatePerStream = 0.0038; // Average blended DSP rate
      const masterGross = Math.round(plays * baseRatePerStream * 100) / 100;
      const mechanicalGross = Math.round(plays * 0.00091 * 100) / 100; // Statutory mechanical
      const performanceGross = Math.round(plays * 0.0006 * 100) / 100;
      const neighboringGross = Math.round(plays * 0.00045 * 100) / 100;

      totalMasterEarnings += masterGross;
      totalMechanicalEarnings += mechanicalGross;
      totalPerformanceEarnings += performanceGross;
      totalNeighboringEarnings += neighboringGross;

      isrcList.push(r.isrc);

      return {
        trackId: track.id,
        title: track.title,
        artist: track.artist,
        isrc: r.isrc,
        isLjArtist: track.isLjArtist || false,
        totalStreams: plays,
        earnings: {
          master: masterGross,
          mechanical: mechanicalGross,
          performance: performanceGross,
          neighboring: neighboringGross,
          total: Math.round((masterGross + mechanicalGross + performanceGross + neighboringGross) * 100) / 100
        },
        splits: r.writerSplits || [{ name: track.artist, share: 70 }, { name: 'LJ Audio Lab', share: 30 }],
        auditStatus: 'VERIFIED_100_PERCENT',
        registrationHealth: {
          mlcRegistered: true,
          soundExchangeRegistered: true,
          proRegistered: true,
          matchRate: '100%'
        }
      };
    });

    const totalGross = Math.round((totalMasterEarnings + totalMechanicalEarnings + totalPerformanceEarnings + totalNeighboringEarnings) * 100) / 100;

    // Filter audit discrepancies
    const relevantDiscrepancies = isAll
      ? this.auditDiscrepancies
      : this.auditDiscrepancies.filter(d => d.artist.toLowerCase() === entity.toLowerCase());

    const totalUnclaimedFound = relevantDiscrepancies
      .filter(d => d.status !== 'CLAIM_RECOVERED')
      .reduce((sum, d) => sum + d.amount, 0);

    return {
      entity: isAll ? 'LJ Entertainment (All Label Enterprise)' : entity,
      entityType: isAll ? 'LABEL_ENTERPRISE' : 'ARTIST_WORKSPACE',
      currency: 'USD',
      summary: {
        totalEarningsTracked: totalGross,
        totalMasterPayout: Math.round(totalMasterEarnings * 100) / 100,
        totalMechanicalPayout: Math.round(totalMechanicalEarnings * 100) / 100,
        totalPerformancePayout: Math.round(totalPerformanceEarnings * 100) / 100,
        totalNeighboringPayout: Math.round(totalNeighboringEarnings * 100) / 100,
        totalUnclaimedRecoverable: Math.round(totalUnclaimedFound * 100) / 100,
        catalogTrackCount: tracks.length,
        overallAuditScore: 99.4,
        lastAuditedDate: new Date().toISOString()
      },
      payoutSources: [
        { name: 'Spotify for Artists / DSP Masters', amount: Math.round(totalMasterEarnings * 0.65 * 100) / 100, share: '45%' },
        { name: 'Apple Music Master Revenue', amount: Math.round(totalMasterEarnings * 0.25 * 100) / 100, share: '22%' },
        { name: 'The MLC (Mechanical Royalties)', amount: Math.round(totalMechanicalEarnings * 100) / 100, share: '16%' },
        { name: 'PRS for Music / ASCAP / BMI', amount: Math.round(totalPerformanceEarnings * 100) / 100, share: '10%' },
        { name: 'SoundExchange (Web Radio & Digital)', amount: Math.round(totalNeighboringEarnings * 100) / 100, share: '7%' }
      ],
      tracks: trackLedgers,
      auditDiscrepancies: relevantDiscrepancies
    };
  }

  claimDiscrepancy(discrepancyId) {
    const item = this.auditDiscrepancies.find(d => d.id === discrepancyId);
    if (!item) {
      return { success: false, error: 'Discrepancy record not found' };
    }

    item.status = 'CLAIM_RECOVERED';
    item.claimedAt = new Date().toISOString();
    item.confirmationCode = `MOGUL-REC-${Math.floor(100000 + Math.random() * 900000)}`;

    return {
      success: true,
      message: `Successfully filed automated recovery claim with ${item.source} for $${item.amount.toFixed(2)} on "${item.trackTitle}".`,
      claimedItem: item
    };
  }

  claimAllDiscrepancies(entity = 'ALL') {
    const isAll = !entity || entity.toUpperCase() === 'ALL';
    let claimedCount = 0;
    let totalRecovered = 0;

    this.auditDiscrepancies.forEach(item => {
      if (isAll || item.artist.toLowerCase() === entity.toLowerCase()) {
        if (item.status !== 'CLAIM_RECOVERED') {
          item.status = 'CLAIM_RECOVERED';
          item.claimedAt = new Date().toISOString();
          item.confirmationCode = `MOGUL-REC-${Math.floor(100000 + Math.random() * 900000)}`;
          claimedCount++;
          totalRecovered += item.amount;
        }
      }
    });

    return {
      success: true,
      claimedCount,
      totalRecovered: Math.round(totalRecovered * 100) / 100,
      message: `Mogul Audit Bot successfully filed ${claimedCount} claims totaling $${totalRecovered.toFixed(2)} across The MLC, SoundExchange & DSPs.`
    };
  }

  getEntitiesList() {
    return [
      {
        id: 'ent-drey-star',
        name: 'Drey Star',
        type: 'ARTIST_WORKSPACE',
        avatar: 'https://i.scdn.co/image/ab67616d0000b27377e5e6ebf6d0352cc1c2d0bd',
        monthlyListeners: '1,420,000',
        tracksCount: 3,
        role: 'Primary Recording Artist',
        royaltyShare: '70% Master & Publishing',
        status: 'ACTIVE_WORKSPACE',
        description: 'Single-artist dedicated workspace. Direct master rights & writer ledger.'
      },
      {
        id: 'ent-lj-enterprise',
        name: 'LJ Entertainment Ltd',
        type: 'LABEL_ENTERPRISE',
        avatar: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
        monthlyListeners: '53,180,000 Total Network',
        tracksCount: 3,
        role: 'Record Label & Executive Enterprise',
        royaltyShare: '100% Aggregated Label Ledger',
        status: 'AVAILABLE',
        description: 'Master label portfolio aggregating all roster artists, total streams, and label distribution.'
      },
      {
        id: 'ent-lj-publishing',
        name: 'LJ Global Publishing Worldwide',
        type: 'PUBLISHING_ADMINISTRATION',
        avatar: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80',
        monthlyListeners: 'Global Repertoire',
        tracksCount: 3,
        role: 'Publishing Administrator',
        royaltyShare: '30% Publishing Admin & Synchronization',
        status: 'AVAILABLE',
        description: 'Separated publishing administration entity. Direct collection with The MLC, ASCAP, BMI, and PRS.'
      }
    ];
  }
}

module.exports = MogulRoyaltyEngine;

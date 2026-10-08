/**
 * LJ MUSIC OS - GEO MUSIC INTELLIGENCE ENGINE
 * Aggregates territory and city-level performance indexes,
 * identifies emerging geographic clusters and tour/promo destinations.
 */

function analyzeGeoIntelligence(catalogue, telemetryMap) {
  const citySummary = {};
  const artistGeoProfiles = {};

  // Aggregate per city across all tracks
  catalogue.forEach(track => {
    const tel = telemetryMap[track.id];
    if (!tel || !tel.geoBreakdown) return;

    if (!artistGeoProfiles[track.artist]) {
      artistGeoProfiles[track.artist] = {
        artist: track.artist,
        isLjArtist: track.isLjArtist,
        cities: {},
        topMarket: "",
        fastestGrowingMarket: ""
      };
    }

    Object.entries(tel.geoBreakdown).forEach(([city, stats]) => {
      if (!citySummary[city]) {
        citySummary[city] = {
          city,
          totalPlays: 0,
          activeTracksCount: 0,
          averageIndex: 0,
          topGenre: track.genre,
          statusLabel: stats.status
        };
      }
      citySummary[city].totalPlays += stats.plays || 0;
      citySummary[city].activeTracksCount += 1;
      citySummary[city].averageIndex = Math.round((citySummary[city].averageIndex + stats.index) / 2);

      artistGeoProfiles[track.artist].cities[city] = stats;
    });
  });

  // Calculate top & emerging markets per artist
  Object.values(artistGeoProfiles).forEach(profile => {
    const sortedCities = Object.entries(profile.cities).sort((a, b) => b[1].index - a[1].index);
    if (sortedCities.length > 0) {
      profile.topMarket = `${sortedCities[0][0]} (${sortedCities[0][1].status}, Index ${sortedCities[0][1].index})`;
      const emerging = sortedCities.find(c => c[1].status === "Emerging" || c[1].status === "Growing");
      profile.fastestGrowingMarket = emerging ? `${emerging[0]} (${emerging[1].status})` : (sortedCities[1] ? sortedCities[1][0] : "Developing");
    }
  });

  return {
    citySummary: Object.values(citySummary).sort((a, b) => b.totalPlays - a.totalPlays),
    artistGeoProfiles: Object.values(artistGeoProfiles)
  };
}

module.exports = {
  analyzeGeoIntelligence
};

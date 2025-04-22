const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  map: {
    type: String,
    required: true,
  },
  kills: {
    type: Number,
    required: true,
    min: 0,
  },
  assists: {
    type: Number,
    required: true,
    min: 0,
  },
  deaths: {
    type: Number,
    required: true,
    min: 0,
  },
  win: {
    type: Boolean,
    required: true,
  },
});

const mapStatsSchema = new mongoose.Schema({
  mapName: {
    type: String,
    required: true,
  },
  matches: {
    type: Number,
    default: 0,
  },
  wins: {
    type: Number,
    default: 0,
  },
  winRate: {
    type: Number,
    default: 0,
  },
});

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  matches: [matchSchema],
  stats: {
    totalKills: {
      type: Number,
      default: 0,
    },
    totalAssists: {
      type: Number,
      default: 0,
    },
    totalDeaths: {
      type: Number,
      default: 0,
    },
    totalMatches: {
      type: Number,
      default: 0,
    },
    winRate: {
      type: Number,
      default: 0,
    },
    averageKd: {
      type: Number,
      default: 0,
    },
    averageImpact: {
      type: Number,
      default: 0,
    },
    mapStats: [mapStatsSchema],
  },
});

// Метод для расчета статистики
playerSchema.methods.calculateStats = function () {
  const matches = this.matches;
  this.stats.totalMatches = matches.length;
  this.stats.totalKills = matches.reduce((sum, match) => sum + match.kills, 0);
  this.stats.totalAssists = matches.reduce(
    (sum, match) => sum + match.assists,
    0
  );
  this.stats.totalDeaths = matches.reduce(
    (sum, match) => sum + match.deaths,
    0
  );
  this.stats.winRate =
    matches.length > 0
      ? (matches.filter((match) => match.win).length / matches.length) * 100
      : 0;
  this.stats.averageKd =
    this.stats.totalDeaths > 0
      ? this.stats.totalKills / this.stats.totalDeaths
      : 0;
  this.stats.averageImpact =
    this.stats.totalDeaths > 0
      ? (this.stats.totalKills + this.stats.totalAssists) /
        this.stats.totalDeaths
      : 0;

  // Расчет статистики по картам
  const mapStats = {};
  matches.forEach((match) => {
    if (!mapStats[match.map]) {
      mapStats[match.map] = { matches: 0, wins: 0 };
    }
    mapStats[match.map].matches++;
    if (match.win) mapStats[match.map].wins++;
  });

  this.stats.mapStats = Object.entries(mapStats).map(([mapName, stats]) => ({
    mapName,
    matches: stats.matches,
    wins: stats.wins,
    winRate: (stats.wins / stats.matches) * 100,
  }));
};

module.exports = mongoose.model("Player", playerSchema);

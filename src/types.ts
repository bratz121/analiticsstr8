export interface Match {
  date: string;
  map: string;
  kills: number;
  assists: number;
  deaths: number;
  win: boolean;
}

export interface MapStats {
  mapName: string;
  matches: number;
  wins: number;
  winRate: number;
  averageKd: number;
  averageKills: number;
  kills: number;
  deaths: number;
}

export interface PlayerStats {
  totalKills: number;
  totalAssists: number;
  totalDeaths: number;
  totalMatches: number;
  winRate: number;
  averageKd: number;
  averageKills: number;
  averageImpact: number;
  mapStats: MapStats[];
}

export interface Player {
  id: string;
  name: string;
  matches: Match[];
  stats: PlayerStats;
}

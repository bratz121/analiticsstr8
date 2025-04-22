-- Create the players table
CREATE TABLE players (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    matches JSONB DEFAULT '[]',
    stats JSONB DEFAULT '{
        "totalKills": 0,
        "totalAssists": 0,
        "totalDeaths": 0,
        "totalMatches": 0,
        "winRate": 0,
        "averageKd": 0,
        "averageImpact": 0,
        "mapStats": []
    }'
); 
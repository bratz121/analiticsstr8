import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { Player } from "../types";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const PlayerStats: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/players`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Ошибка при загрузке данных");
        }

        const data = await response.json();
        console.log("Received player data:", data);
        if (data[0] && data[0].stats && data[0].stats.mapStats) {
          console.log("Map stats example:", data[0].stats.mapStats);
        }
        setPlayers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Произошла ошибка");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [token]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, mt: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ color: "text.primary" }}
      >
        Статистика игроков
      </Typography>
      <Grid container spacing={3}>
        {players.map((player) => {
          return (
            <Grid item xs={12} md={6} key={player.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {player.name}
                  </Typography>
                  {player.stats ? (
                    <>
                      <TableContainer
                        component={Paper}
                        sx={{ backgroundColor: "background.paper" }}
                      >
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Показатель</TableCell>
                              <TableCell align="right">Значение</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Всего матчей</TableCell>
                              <TableCell align="right">
                                {player.stats.totalMatches || 0}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Процент побед</TableCell>
                              <TableCell align="right">
                                {player.stats.winRate !== undefined
                                  ? player.stats.winRate.toFixed(1)
                                  : "0.0"}
                                %
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>K/D</TableCell>
                              <TableCell align="right">
                                {player.stats.averageKd !== undefined
                                  ? player.stats.averageKd.toFixed(2)
                                  : "0.00"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Среднее количество убийств</TableCell>
                              <TableCell align="right">
                                {player.stats.averageKills !== undefined
                                  ? player.stats.averageKills.toFixed(1)
                                  : player.stats.totalMatches > 0
                                  ? (
                                      player.stats.totalKills /
                                      player.stats.totalMatches
                                    ).toFixed(1)
                                  : "0.0"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Среднее влияние</TableCell>
                              <TableCell align="right">
                                {player.stats.averageImpact !== undefined
                                  ? player.stats.averageImpact.toFixed(2)
                                  : "0.00"}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                      {player.stats.mapStats &&
                        player.stats.mapStats.length > 0 && (
                          <>
                            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                              Статистика по картам
                            </Typography>
                            <TableContainer
                              component={Paper}
                              sx={{ backgroundColor: "background.paper" }}
                            >
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Карта</TableCell>
                                    <TableCell align="right">Матчи</TableCell>
                                    <TableCell align="right">Победы</TableCell>
                                    <TableCell align="right">K/D</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {player.stats.mapStats.map((mapStat) => (
                                    <TableRow key={mapStat.mapName}>
                                      <TableCell>{mapStat.mapName}</TableCell>
                                      <TableCell align="right">
                                        {mapStat.matches || 0}
                                      </TableCell>
                                      <TableCell align="right">
                                        {mapStat.wins !== undefined &&
                                        mapStat.matches !== undefined &&
                                        mapStat.matches > 0
                                          ? (
                                              (mapStat.wins / mapStat.matches) *
                                              100
                                            ).toFixed(1)
                                          : "0.0"}
                                        %
                                      </TableCell>
                                      <TableCell align="right">
                                        {mapStat.averageKd !== undefined
                                          ? mapStat.averageKd.toFixed(2)
                                          : "0.00"}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </>
                        )}
                    </>
                  ) : (
                    <Typography>Нет данных о статистике</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default PlayerStats;

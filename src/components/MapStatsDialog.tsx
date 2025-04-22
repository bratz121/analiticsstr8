import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  Grid,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Player, MapStats } from "../types";

interface MapStatsDialogProps {
  open: boolean;
  onClose: () => void;
  player: Player;
  mapStats: MapStats;
}

interface GroupedMatch {
  groupNumber: number;
  averageKd: string;
}

const MapStatsDialog: React.FC<MapStatsDialogProps> = ({
  open,
  onClose,
  player,
  mapStats,
}) => {
  console.log("MapStatsDialog props:", { player, mapStats });

  // Функция для группировки матчей по 6 игр
  const getGroupedMatches = (): GroupedMatch[] => {
    const matches = player.matches
      .filter(
        (match) => match.map.toLowerCase() === mapStats.mapName.toLowerCase()
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    console.log("Filtered matches:", matches);

    const groups: GroupedMatch[] = [];
    for (let i = 0; i < matches.length; i += 6) {
      const group = matches.slice(i, i + 6);
      const averageKd =
        group.reduce((sum, match) => {
          return (
            sum + (match.deaths > 0 ? match.kills / match.deaths : match.kills)
          );
        }, 0) / group.length;

      groups.push({
        groupNumber: Math.floor(i / 6) + 1,
        averageKd: averageKd.toFixed(2),
      });
    }

    console.log("Grouped matches:", groups);
    return groups;
  };

  const groupedMatches = getGroupedMatches();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Статистика {player.name} на карте {mapStats.mapName}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Общая статистика
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    Матчей: {mapStats.matches || 0}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    Побед: {mapStats.wins || 0}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    Винрейт:{" "}
                    {mapStats.matches
                      ? ((mapStats.wins / mapStats.matches) * 100).toFixed(1)
                      : 0}
                    %
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    Средний K/D:{" "}
                    {mapStats.averageKd ? mapStats.averageKd.toFixed(2) : 0}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                График K/D по группам матчей
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={groupedMatches}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="groupNumber"
                      label={{
                        value: "Группа матчей (по 6 игр)",
                        position: "bottom",
                      }}
                    />
                    <YAxis
                      label={{ value: "K/D", angle: -90, position: "left" }}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="averageKd"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MapStatsDialog;

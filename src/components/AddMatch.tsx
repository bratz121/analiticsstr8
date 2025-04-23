import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { Player } from "../types";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const maps = ["Rust", "Zone 9", "Sakura", "Province", "Sandstone"];

const AddMatch: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [map, setMap] = useState("");
  const [kills, setKills] = useState("");
  const [assists, setAssists] = useState("");
  const [deaths, setDeaths] = useState("");
  const [win, setWin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
          throw new Error("Ошибка при загрузке игроков");
        }

        const data = await response.json();
        setPlayers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Произошла ошибка");
      }
    };

    fetchPlayers();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `${API_URL}/api/players/${selectedPlayer}/matches`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            map,
            kills: parseInt(kills),
            assists: parseInt(assists),
            deaths: parseInt(deaths),
            win,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Ошибка при добавлении матча");
      }

      setSuccess("Матч успешно добавлен");
      // Сброс формы
      setSelectedPlayer("");
      setMap("");
      setKills("");
      setAssists("");
      setDeaths("");
      setWin(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Добавить матч
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Игрок</InputLabel>
              <Select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                required
                label="Игрок"
              >
                {players.map((player) => (
                  <MenuItem key={player.id} value={player.id}>
                    {player.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Карта</InputLabel>
              <Select
                value={map}
                onChange={(e) => setMap(e.target.value)}
                required
                label="Карта"
              >
                {maps.map((mapName) => (
                  <MenuItem key={mapName} value={mapName.toLowerCase()}>
                    {mapName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Убийства"
              type="number"
              value={kills}
              onChange={(e) => setKills(e.target.value)}
              margin="normal"
              required
              inputProps={{ min: 0 }}
            />

            <TextField
              fullWidth
              label="Помощь"
              type="number"
              value={assists}
              onChange={(e) => setAssists(e.target.value)}
              margin="normal"
              required
              inputProps={{ min: 0 }}
            />

            <TextField
              fullWidth
              label="Смерти"
              type="number"
              value={deaths}
              onChange={(e) => setDeaths(e.target.value)}
              margin="normal"
              required
              inputProps={{ min: 0 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={win}
                  onChange={(e) => setWin(e.target.checked)}
                  color="primary"
                />
              }
              label="Победа"
              sx={{ mt: 2 }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              disabled={
                !selectedPlayer || !map || !kills || !assists || !deaths
              }
            >
              Добавить
            </Button>
          </form>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddMatch;

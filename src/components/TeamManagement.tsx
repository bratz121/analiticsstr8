import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import axios from "axios";

interface Player {
  _id: string;
  name: string;
}

const TeamManagement: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");

  const fetchPlayers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/players");
      setPlayers(response.data);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  React.useEffect(() => {
    fetchPlayers();
  }, []);

  const handleAddPlayer = async () => {
    if (!newPlayerName.trim()) return;

    try {
      await axios.post("http://localhost:5000/api/players", {
        name: newPlayerName.trim(),
      });
      setNewPlayerName("");
      fetchPlayers();
    } catch (error) {
      console.error("Error adding player:", error);
    }
  };

  const handleDeletePlayer = async (playerId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/players/${playerId}`);
      fetchPlayers();
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Управление командой
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            label="Имя игрока"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleAddPlayer}
            disabled={!newPlayerName.trim()}
          >
            Добавить игрока
          </Button>
        </Box>
        <List>
          {players.map((player) => (
            <ListItem key={player._id}>
              <ListItemText primary={player.name} />
              <ListItemSecondaryAction>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeletePlayer(player._id)}
                >
                  Удалить
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default TeamManagement;

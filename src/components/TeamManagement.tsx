import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { usePlayers } from "../hooks/usePlayers";
import AddPlayer from "./AddPlayer";

const TeamManagement: React.FC = () => {
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  const { players, loading, error } = usePlayers();

  const handleOpenAddPlayer = () => {
    setIsAddPlayerOpen(true);
  };

  const handleCloseAddPlayer = () => {
    setIsAddPlayerOpen(false);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" component="h2">
              Управление командой
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenAddPlayer}
            >
              Добавить игрока
            </Button>
          </Box>

          {loading ? (
            <Typography>Загрузка...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <List>
              {players.map((player, index) => (
                <React.Fragment key={player.id}>
                  <ListItem>
                    <ListItemText
                      primary={player.name}
                      secondary={`Матчей: ${player.matches.length}`}
                    />
                  </ListItem>
                  {index < players.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isAddPlayerOpen}
        onClose={handleCloseAddPlayer}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Добавить игрока</DialogTitle>
        <DialogContent>
          <AddPlayer onClose={handleCloseAddPlayer} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddPlayer}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamManagement;

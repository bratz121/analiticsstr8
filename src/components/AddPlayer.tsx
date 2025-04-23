import React, { useState } from "react";
import { Box, TextField, Button, Alert } from "@mui/material";
import { usePlayers } from "../hooks/usePlayers";

interface AddPlayerProps {
  onClose?: () => void;
}

const AddPlayer: React.FC<AddPlayerProps> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { addPlayer } = usePlayers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError("Введите имя игрока");
      return;
    }

    try {
      await addPlayer({ name: name.trim() });
      setSuccess("Игрок успешно добавлен");
      setName("");
      if (onClose) {
        setTimeout(onClose, 1500); // Закрываем диалог через 1.5 секунды после успешного добавления
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Имя игрока"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
          variant="outlined"
          error={!!error}
          helperText={error}
          autoFocus
        />
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!name.trim()}
          >
            Добавить
          </Button>
        </Box>
      </form>
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}
    </Box>
  );
};

export default AddPlayer;

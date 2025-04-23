import { useState, useEffect, useCallback } from "react";
import { Player } from "../types";
import { useAuth } from "./useAuth";

const API_URL =
  process.env.REACT_APP_API_URL || "https://str8-server.onrender.com";

export const usePlayers = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchPlayers = useCallback(async () => {
    if (!token) {
      setError("Требуется авторизация");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/players`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при загрузке игроков");
      }

      const data = await response.json();
      setPlayers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addPlayer = async (
    playerData: Omit<Player, "id" | "matches" | "stats">
  ) => {
    if (!token) {
      throw new Error("Требуется авторизация");
    }

    try {
      const response = await fetch(`${API_URL}/api/players`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(playerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при добавлении игрока");
      }

      const newPlayer = await response.json();
      setPlayers((prev) => [...prev, newPlayer]);
      setError(null);
      return newPlayer;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Произошла ошибка";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPlayers();
    }
  }, [token, fetchPlayers]);

  return {
    players,
    loading,
    error,
    addPlayer,
    refreshPlayers: fetchPlayers,
  };
};

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  // Если пользователь уже авторизован, не показываем форму входа
  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Ошибка при входе");
      }

      const data = await response.json();
      login(data.token, data.username, data.role);

      // Если пользователь пытался перейти на защищенную страницу, перенаправляем его туда
      // Иначе оставляем на текущей странице
      const from = location.state?.from?.pathname || "/";
      if (from === "/") {
        navigate("/stats");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Произошла ошибка при подключении к серверу"
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)", // Вычитаем высоту AppBar
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: "64px", // Высота AppBar
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "background.default",
        zIndex: 1,
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", mx: 2 }}>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            Вход в систему
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              variant="outlined"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
              disabled={!username.trim() || !password.trim()}
            >
              Войти
            </Button>
          </form>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;

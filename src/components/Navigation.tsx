import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    logout();
    navigate("/");
  };

  if (location.pathname === "/") {
    return null;
  }

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Статистика команды
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {role === "admin" && (
            <>
              <Button color="inherit" onClick={() => navigate("/admin")}>
                Панель администратора
              </Button>
              <Button color="inherit" onClick={() => navigate("/team")}>
                Управление командой
              </Button>
              <Button color="inherit" onClick={() => navigate("/add-match")}>
                Добавить матч
              </Button>
            </>
          )}

          <Button color="inherit" onClick={() => navigate("/stats")}>
            Статистика
          </Button>

          {username && (
            <Typography variant="body1" sx={{ mx: 2 }}>
              {username}
            </Typography>
          )}

          <Button color="inherit" onClick={handleLogout}>
            Выйти
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, CssBaseline, Container } from "@mui/material";
import { darkTheme } from "./theme";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import PlayerStats from "./components/PlayerStats";
import ProtectedRoute from "./components/ProtectedRoute";
import Navigation from "./components/Navigation";
import AddMatch from "./components/AddMatch";
import AddPlayer from "./components/AddPlayer";
import { useAuth } from "./hooks/useAuth";

const App: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Container sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? <Navigate to="/stats" replace /> : <Login />
              }
            />
            <Route
              path="/stats"
              element={
                isAuthenticated ? <PlayerStats /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="/add-match"
              element={
                isAuthenticated && isAdmin ? (
                  <AddMatch />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/add-player"
              element={
                isAuthenticated && isAdmin ? (
                  <AddPlayer />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App;

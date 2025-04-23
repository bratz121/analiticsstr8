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
import TeamManagement from "./components/TeamManagement";
import { useAuth } from "./hooks/useAuth";

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

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
                <ProtectedRoute>
                  <PlayerStats />
                </ProtectedRoute>
              }
            />
            <Route
              path="/team"
              element={
                <ProtectedRoute requiredRole="admin">
                  <TeamManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-match"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AddMatch />
                </ProtectedRoute>
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

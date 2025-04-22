import { useState } from "react";

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  token: string | null;
  username: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    return {
      isAuthenticated: !!token,
      isAdmin: role === "admin",
      token,
      username,
    };
  });

  const login = (token: string, username: string, role: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);

    setAuthState({
      isAuthenticated: true,
      isAdmin: role === "admin",
      token,
      username,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    setAuthState({
      isAuthenticated: false,
      isAdmin: false,
      token: null,
      username: null,
    });
  };

  return {
    ...authState,
    login,
    logout,
  };
}

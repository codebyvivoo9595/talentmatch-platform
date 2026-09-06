import { createContext, useContext, useState, useCallback } from "react";
import { login as loginApi, register as registerApi } from "../api/authService";

const AuthContext = createContext(null);

/**
 * Provides auth state (token, user email) and login/logout/register actions
 * to the entire app.
 */
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("userEmail") || null);

  // Login: call API, persist token, update state
  const login = useCallback(async (email, password) => {
    const data = await loginApi(email, password); // { token, expiresAt }
    localStorage.setItem("token", data.token);
    localStorage.setItem("tokenExpiry", data.expiresAt);
    localStorage.setItem("userEmail", email);
    setToken(data.token);
    setUserEmail(email);
    return data;
  }, []);

  // Register: call API (no auto-login, user must login after)
  const register = useCallback(async (email, password) => {
    await registerApi(email, password);
  }, []);

  // Logout: clear everything
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("userEmail");
    setToken(null);
    setUserEmail(null);
  }, []);

  const isLoggedIn = Boolean(token);

  return (
    <AuthContext.Provider value={{ token, userEmail, isLoggedIn, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy consumption
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

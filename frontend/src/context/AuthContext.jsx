import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { fetchCurrentUser, loginRequest, registerRequest } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("sms_token"));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("sms_token")));

  const persistSession = (sessionToken, sessionUser) => {
    localStorage.setItem("sms_token", sessionToken);
    setToken(sessionToken);
    setUser(sessionUser);
  };

  const clearSession = () => {
    localStorage.removeItem("sms_token");
    setToken(null);
    setUser(null);
  };

  const login = async (payload) => {
    const response = await loginRequest(payload);
    persistSession(response.data.token, response.data.user);
    toast.success("Welcome back");
    return response;
  };

  const register = async (payload) => {
    const response = await registerRequest(payload);
    toast.success("Registration submitted for approval");
    return response;
  };

  const logout = () => {
    clearSession();
    toast.success("Logged out");
  };

  const refreshUser = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetchCurrentUser();
      setUser(response.data);
    } catch (_error) {
      clearSession();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      refreshUser,
      isAuthenticated: Boolean(token),
    }),
    [loading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

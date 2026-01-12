import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/check");

      if (response.data.authenticated) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async () => {
    try {
      setError(null);
      const response = await api.post("/auth/register");

      // Save the raw token temporarily for login
      const rawToken = response.data.token;
      localStorage.setItem("temp_token", rawToken);

      // Do NOT auto-login. User must see token and login manually.

      return {
        success: true,
        token: rawToken,
        message: response.data.message,
      };
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Registration failed";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const login = async (token) => {
    try {
      setError(null);
      setLoading(true);

      const response = await api.post("/auth/login", { token });

      // Update user state
      setUser(response.data.user);

      // Clear temp token if exists
      localStorage.removeItem("temp_token");

      // Redirect based on profile completion
      if (response.data.user.hasProfile) {
        navigate("/dashboard");
      } else {
        navigate("/dashboard?setup=true"); // Will show profile setup modal
      }

      return { success: true, user: response.data.user };
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Login failed";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      navigate("/");
    }
  };

  const updateProfile = async (username, avatar) => {
    try {
      setError(null);
      const response = await api.patch("/user/profile", { username, avatar });

      // Update user state
      setUser((prev) => ({
        ...prev,
        username: response.data.user.username,
        avatar: response.data.user.avatar,
      }));

      return { success: true, user: response.data.user };
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Profile update failed";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const updateUserStats = (newStats) => {
    setUser((prev) => ({
      ...prev,
      stats: newStats,
    }));
  };

  const updateUserStreak = (newStreak) => {
    setUser((prev) => ({
      ...prev,
      streak: newStreak,
    }));
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    updateUserStats,
    updateUserStreak,
    checkAuth,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

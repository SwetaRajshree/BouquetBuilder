import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const API = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("floriva_user");
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem("floriva_token") || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function login(email, password) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const text = await res.text();
      if (!text) throw new Error("Server is waking up, please try again in a few seconds.");
      const data = JSON.parse(text);
      if (!res.ok) throw new Error(data.message || "Login failed. Please try again.");
      localStorage.setItem("floriva_token", data.token);
      localStorage.setItem("floriva_user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return { success: true, role: data.user.role };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }

  async function register(name, email, password) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "customer" }),
      });
      const text = await res.text();
      if (!text) throw new Error("Server is waking up, please try again in a few seconds.");
      const data = JSON.parse(text);
      if (!res.ok) throw new Error(data.message || "Registration failed. Please try again.");
      localStorage.setItem("floriva_token", data.token);
      localStorage.setItem("floriva_user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }

  function updateUser(updated) {
    const merged = { ...user, ...updated };
    setUser(merged);
    localStorage.setItem("floriva_user", JSON.stringify(merged));
  }

  function logout() {
    localStorage.removeItem("floriva_token");
    localStorage.removeItem("floriva_user");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

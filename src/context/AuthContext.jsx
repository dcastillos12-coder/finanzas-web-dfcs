import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { get, post, TOKEN_KEY } from "@/lib/api";

const AuthContext = createContext(null);

function saveSession(data) {
  const token = data.token || data.access_token;
  const user = data.user || data.data;

  if (!token) throw new Error("La respuesta no contiene un token de acceso.");
  localStorage.setItem(TOKEN_KEY, token);
  return user || null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      if (!localStorage.getItem(TOKEN_KEY)) {
        setLoading(false);
        return;
      }

      try {
        setUser(await get("/user"));
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function login(email, password) {
    const session = await post("/login", { email, password });
    const authenticatedUser = saveSession(session);
    setUser(authenticatedUser || (await get("/user")));
  }

  async function register(name, email, password, passwordConfirmation) {
    const session = await post("/register", {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
    const authenticatedUser = saveSession(session);
    setUser(authenticatedUser || (await get("/user")));
  }

  async function logout() {
    try {
      if (localStorage.getItem(TOKEN_KEY)) await post("/logout");
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  }

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: Boolean(user), login, register, logout }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider.");
  return context;
}

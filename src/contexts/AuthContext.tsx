import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { login as loginApi } from "../api/authApi";

import type {
  LoginRequest,
  User,
} from "../types/auth";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  initializing: boolean;

  login: (
    request: LoginRequest
  ) => Promise<User>;

  logout: () => void;

  updateStoredUser: (
    user: User
  ) => void;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined
  );

const STORAGE_KEY =
  "safetyCopilotUser";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<User | null>(null);

  const [initializing, setInitializing] =
    useState(true);

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (stored) {
        const parsed =
          JSON.parse(stored) as User;

        setUser(parsed);
      }
    } catch {
      localStorage.removeItem(
        STORAGE_KEY
      );
    } finally {
      setInitializing(false);
    }
  }, []);

  async function login(
    request: LoginRequest
  ): Promise<User> {
    const response =
      await loginApi(request);

    const loggedInUser: User = {
      id: response.id,
      email: response.email,
      displayName:
        response.displayName,
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        loggedInUser
      )
    );

    setUser(loggedInUser);

    return loggedInUser;
  }

  function logout() {
    localStorage.removeItem(
      STORAGE_KEY
    );

    setUser(null);
  }

  function updateStoredUser(
    updatedUser: User
  ) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        updatedUser
      )
    );

    setUser(updatedUser);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated:
          user !== null,
        initializing,
        login,
        logout,
        updateStoredUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}
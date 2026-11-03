"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetch, ApiError } from "./api/client";
import { getTokens, setTokens, subscribeToTokenChanges, type StoredTokens } from "./api/token-store";

export type Role = "admin" | "senior_pastor" | "ministry_leader" | "member" | "parent";

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: Role;
  avatarUrl: string | null;
  campusId: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  user: User;
  tokens: StoredTokens;
}

interface AuthContextType {
  user: User | null;
  tokens: StoredTokens | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { email: string; password: string; fullName: string; phone?: string }) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokensState] = useState<StoredTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    const currentTokens = getTokens();
    if (!currentTokens) {
      setUser(null);
      setTokensState(null);
      setIsLoading(false);
      return;
    }

    setTokensState(currentTokens);
    try {
      const profile = await apiFetch<User>("/auth/me");
      setUser(profile);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setTokens(null);
        setUser(null);
        setTokensState(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    const unsubscribe = subscribeToTokenChanges(() => {
      fetchProfile();
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: { email, password },
        auth: false,
      });
      setTokens(res.tokens);
      setTokensState(res.tokens);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { email: string; password: string; fullName: string; phone?: string }) => {
    setIsLoading(true);
    try {
      const res = await apiFetch<AuthResponse>("/auth/register", {
        method: "POST",
        body: data,
        auth: false,
      });
      setTokens(res.tokens);
      setTokensState(res.tokens);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiFetch<void>("/auth/logout", { method: "POST" });
    } catch {
      // Bỏ qua lỗi mạng khi logout
    } finally {
      setTokens(null);
      setTokensState(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        isLoading,
        login,
        register,
        logout,
        refreshUser: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

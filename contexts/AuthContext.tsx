'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DEMO_USERS } from '@/lib/demoUsers';

export type UserRole = 'super_admin' | 'admin' | 'subscriber' | 'student' | 'consultant' | 'instructor' | 'client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  demoUsers: Array<{ email: string; password: string; name: string; role: UserRole }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const setActiveSession = async (userId: string) => {
    await fetch('/api/analytics/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
  };

  const clearActiveSession = async (userId: string) => {
    await fetch('/api/analytics/session', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('hyperion_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        void setActiveSession(parsedUser.id);
      }
    }
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    void setActiveSession(user.id);
    const interval = setInterval(() => {
      void setActiveSession(user.id);
    }, 60_000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Invalid credentials');
    }

    const data = await response.json();
    setUser(data.user);
    localStorage.setItem('hyperion_user', JSON.stringify(data.user));
    setActiveSession(data.user.id);
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'User already exists');
    }

    const data = await response.json();
    setUser(data.user);
    localStorage.setItem('hyperion_user', JSON.stringify(data.user));
    setActiveSession(data.user.id);
  };

  const logout = () => {
    if (user) {
      void clearActiveSession(user.id);
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hyperion_user');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      demoUsers: DEMO_USERS.map(({ id, ...rest }) => rest)
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


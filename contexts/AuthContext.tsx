'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

// Demo users for testing
const DEMO_USERS = [
  { id: '1', email: 'superadmin@hyperion.tech', password: 'demo123', name: 'Alex Morgan', role: 'super_admin' as UserRole },
  { id: '2', email: 'admin@hyperion.tech', password: 'demo123', name: 'Sarah Johnson', role: 'admin' as UserRole },
  { id: '3', email: 'student@hyperion.tech', password: 'demo123', name: 'Michael Chen', role: 'student' as UserRole },
  { id: '4', email: 'instructor@hyperion.tech', password: 'demo123', name: 'Dr. Emily Parker', role: 'instructor' as UserRole },
  { id: '5', email: 'consultant@hyperion.tech', password: 'demo123', name: 'David Williams', role: 'consultant' as UserRole },
  { id: '6', email: 'client@hyperion.tech', password: 'demo123', name: 'Jessica Martinez', role: 'client' as UserRole },
  { id: '7', email: 'subscriber@hyperion.tech', password: 'demo123', name: 'Robert Taylor', role: 'subscriber' as UserRole },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const setActiveSession = (userId: string) => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('hyperion_active_sessions');
    const sessions = stored ? JSON.parse(stored) : [];
    const nextSessions = Array.isArray(sessions)
      ? sessions.filter((session: any) => session.userId !== userId)
      : [];
    nextSessions.push({ userId, lastActive: new Date().toISOString() });
    localStorage.setItem('hyperion_active_sessions', JSON.stringify(nextSessions));
  };

  const clearActiveSession = (userId: string) => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('hyperion_active_sessions');
    const sessions = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(sessions)) return;
    const nextSessions = sessions.filter((session: any) => session.userId !== userId);
    localStorage.setItem('hyperion_active_sessions', JSON.stringify(nextSessions));
  };

  useEffect(() => {
    // Initialize demo users in localStorage if not exists
    if (typeof window !== 'undefined') {
      const storedUsers = localStorage.getItem('hyperion_users');
      if (!storedUsers) {
        localStorage.setItem('hyperion_users', JSON.stringify(DEMO_USERS));
      }
      
      // Check for stored user on mount
      const storedUser = localStorage.getItem('hyperion_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setActiveSession(parsedUser.id);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock authentication - in production, this would call an API
    if (typeof window === 'undefined') {
      throw new Error('Window is not available');
    }
    
    const storedUsers = localStorage.getItem('hyperion_users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role
      };
      setUser(userWithoutPassword);
      localStorage.setItem('hyperion_user', JSON.stringify(userWithoutPassword));
      setActiveSession(userWithoutPassword.id);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    // Mock registration - in production, this would call an API
    if (typeof window === 'undefined') {
      throw new Error('Window is not available');
    }
    
    const storedUsers = localStorage.getItem('hyperion_users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Check if user already exists
    if (users.some((u: any) => u.email === email)) {
      throw new Error('User already exists');
    }
    
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In production, this would be hashed
      name,
      role
    };
    
    users.push(newUser);
    localStorage.setItem('hyperion_users', JSON.stringify(users));
    
    // Auto login after registration
    const userWithoutPassword = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    };
    setUser(userWithoutPassword);
    localStorage.setItem('hyperion_user', JSON.stringify(userWithoutPassword));
    setActiveSession(userWithoutPassword.id);
  };

  const logout = () => {
    if (user) {
      clearActiveSession(user.id);
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


import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthAccount, AuthSession, User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';

const AUTH_ACCOUNTS_KEY = 'panitiahub_accounts';
const AUTH_SESSION_KEY = 'panitiahub_session';
const USERS_KEY = 'panitiahub_data_v1_users';

// Simulasi hashing sederhana menggunakan btoa
const hashPassword = (password: string): string => btoa(password + '_evt_salt');
const verifyPassword = (password: string, hash: string): boolean => hashPassword(password) === hash;

interface AuthContextType {
  isAuthenticated: boolean;
  currentUserId: string | null;
  isLoading: boolean;
  authPage: 'login' | 'register';
  setAuthPage: (page: 'login' | 'register') => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Seed demo accounts dari INITIAL_USERS saat pertama kali
const seedDemoAccounts = () => {
  const existingAccounts = localStorage.getItem(AUTH_ACCOUNTS_KEY);
  if (!existingAccounts) {
    const demoPasswords: Record<string, string> = {
      'admin@event.id': 'admin123',
      'andi.ketua@event.id': 'manager123',
      'sarah.acara@event.id': 'coord123',
      'dimas.pubdok@event.id': 'coord123',
      'rian.sponsor@event.id': 'coord123',
      'maya.staff@event.id': 'member123',
      'budi.media@event.id': 'member123',
      'lisa.lo@event.id': 'member123',
    };

    // Ambil users dari localStorage jika ada, atau pakai INITIAL_USERS
    const savedUsers = localStorage.getItem(USERS_KEY);
    const users: User[] = savedUsers ? JSON.parse(savedUsers) : INITIAL_USERS;

    const accounts: AuthAccount[] = users.map(user => ({
      userId: user.id,
      email: user.email,
      passwordHash: hashPassword(demoPasswords[user.email] || 'password123'),
      createdAt: user.createdAt,
    }));

    localStorage.setItem(AUTH_ACCOUNTS_KEY, JSON.stringify(accounts));
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authPage, setAuthPage] = useState<'login' | 'register'>('login');

  useEffect(() => {
    // Seed demo accounts jika belum ada
    seedDemoAccounts();

    // Cek session yang tersimpan
    const sessionStr = localStorage.getItem(AUTH_SESSION_KEY);
    if (sessionStr) {
      try {
        const session: AuthSession = JSON.parse(sessionStr);
        if (session.userId) {
          setIsAuthenticated(true);
          setCurrentUserId(session.userId);
        }
      } catch {
        localStorage.removeItem(AUTH_SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const response = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          return {
            success: false,
            error: result.message || 'Login gagal.',
          };
        }

        const user = result.data;
        const normalizedUser: User = {
          id: String(user.id),
          name: user.name || 'Pengguna',
          email: user.email,
          avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          role: (user.role as UserRole) || 'MEMBER',
          phone: user.phone || undefined,
          department: user.department || undefined,
          createdAt: user.created_at || user.createdAt || new Date().toISOString(),
          updatedAt: user.updated_at || user.updatedAt,
        };

        // Simpan session di browser
        const session: AuthSession = {
          userId: normalizedUser.id,
          email: normalizedUser.email,
          loginAt: new Date().toISOString(),
        };

        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
        localStorage.setItem('panitiahub_user', JSON.stringify(normalizedUser));
        localStorage.setItem('panitiahub_data_v1_current_user_id', normalizedUser.id);

        // Pastikan juga disinkronkan ke daftar users di localStorage
        try {
          const savedUsers = localStorage.getItem(USERS_KEY);
          const usersList: User[] = savedUsers ? JSON.parse(savedUsers) : [...INITIAL_USERS];
          const existIndex = usersList.findIndex(
            u => String(u.id) === normalizedUser.id || u.email.toLowerCase() === normalizedUser.email.toLowerCase()
          );
          if (existIndex >= 0) {
            usersList[existIndex] = { ...usersList[existIndex], ...normalizedUser };
          } else {
            usersList.unshift(normalizedUser);
          }
          localStorage.setItem(USERS_KEY, JSON.stringify(usersList));
        } catch { /* ignore */ }

        // Update state aplikasi
        setIsAuthenticated(true);
        setCurrentUserId(normalizedUser.id);

        return {
          success: true,
        };
      } catch (error) {
        console.error('Login error:', error);

        return {
          success: false,
          error: 'Tidak dapat terhubung ke server.',
        };
      }
    },
    []
  );

  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.message || 'Email sudah terdaftar atau terjadi kesalahan server.',
        };
      }

      const user = result.data;
      const normalizedUser: User = {
        id: String(user.id),
        name: user.name,
        email: user.email,
        avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: (user.role as UserRole) || 'MEMBER',
        phone: user.phone || undefined,
        department: user.department || undefined,
        createdAt: user.created_at || user.createdAt || new Date().toISOString(),
        updatedAt: user.updated_at || user.updatedAt,
      };

      // Simpan session (Auto login)
      const session: AuthSession = {
        userId: normalizedUser.id,
        email: normalizedUser.email,
        loginAt: new Date().toISOString(),
      };

      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
      localStorage.setItem('panitiahub_user', JSON.stringify(normalizedUser));
      localStorage.setItem('panitiahub_data_v1_current_user_id', normalizedUser.id);

      // Simpan juga ke users list lokal sementara (context nanti akan fetch dari db)
      try {
        const savedUsers = localStorage.getItem(USERS_KEY);
        const usersList: User[] = savedUsers ? JSON.parse(savedUsers) : [...INITIAL_USERS];
        usersList.unshift(normalizedUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(usersList));
      } catch { /* ignore */ }

      setIsAuthenticated(true);
      setCurrentUserId(normalizedUser.id);

      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Tidak dapat terhubung ke server.' };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_SESSION_KEY);
    localStorage.removeItem('panitiahub_user');
    setIsAuthenticated(false);
    setCurrentUserId(null);
    setAuthPage('login');
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      currentUserId,
      isLoading,
      authPage,
      setAuthPage,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

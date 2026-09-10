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
  register: (name: string, email: string, password: string, role: UserRole) => { success: boolean; error?: string };
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

        // Simpan session di browser
        const session: AuthSession = {
          userId: String(user.id),
          email: user.email,
          loginAt: new Date().toISOString(),
        };

        localStorage.setItem(
          AUTH_SESSION_KEY,
          JSON.stringify(session)
        );

        localStorage.setItem(
          'panitiahub_data_v1_current_user_id',
          String(user.id)
        );

        // Update state aplikasi
        setIsAuthenticated(true);
        setCurrentUserId(String(user.id));

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

  const register = useCallback((
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): { success: boolean; error?: string } => {
    // Cek apakah email sudah terdaftar
    const accountsStr = localStorage.getItem(AUTH_ACCOUNTS_KEY);
    const accounts: AuthAccount[] = accountsStr ? JSON.parse(accountsStr) : [];

    if (accounts.find(a => a.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Email sudah terdaftar. Silakan gunakan email lain.' };
    }

    // Buat user baru
    const newUserId = `user-${Date.now()}`;
    const avatarSeeds = [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    ];
    const randomAvatar = avatarSeeds[Math.floor(Math.random() * avatarSeeds.length)];

    const newUser: User = {
      id: newUserId,
      name,
      email,
      avatar: randomAvatar,
      role,
      createdAt: new Date().toISOString(),
    };

    // Simpan user ke users list
    const savedUsers = localStorage.getItem(USERS_KEY);
    const users: User[] = savedUsers ? JSON.parse(savedUsers) : INITIAL_USERS;
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Buat akun auth
    const newAccount: AuthAccount = {
      userId: newUserId,
      email,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    };
    accounts.push(newAccount);
    localStorage.setItem(AUTH_ACCOUNTS_KEY, JSON.stringify(accounts));

    // Auto login
    const session: AuthSession = {
      userId: newUserId,
      email,
      loginAt: new Date().toISOString(),
    };
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    localStorage.setItem('panitiahub_data_v1_current_user_id', newUserId);

    setIsAuthenticated(true);
    setCurrentUserId(newUserId);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_SESSION_KEY);
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

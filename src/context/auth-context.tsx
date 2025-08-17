'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie, clearAuthCookies, COOKIE_KEYS } from '@/lib/cookies';
import type { JWTPayload } from '@/lib/api/types';

interface User {
  id: string;
  user_name: string;
  restaurantId: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to decode JWT token (without verification)
function decodeToken(token: string): JWTPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = () => {
    try {
      const token = getCookie(COOKIE_KEYS.AUTH_TOKEN);

      if (token) {
        const payload = decodeToken(token);
        if (payload && payload.userId && payload.user_name) {
          const user: User = {
            id: payload.userId,
            user_name: payload.user_name,
            restaurantId: payload.restaurantId,
            role: payload.role,
          };
          setUser(user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (token: string) => {
    const payload = decodeToken(token);
    if (payload && payload.userId && payload.user_name) {
      const user: User = {
        id: payload.userId,
        user_name: payload.user_name,
        restaurantId: payload.restaurantId,
        role: payload.role,
      };
      setUser(user);
    }
    // Token is already stored in cookies by the login form
  };

  const logout = () => {
    setUser(null);
    clearAuthCookies();
    router.push('/auth');
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
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
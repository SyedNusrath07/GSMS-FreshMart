import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'customer' | 'admin') => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: 'customer' | 'admin'): Promise<boolean> => {
    // Simulate authentication
    if (role === 'admin' && email === 'admin@grocery.com' && password === 'admin123') {
      setUser({
        id: 'admin-1',
        name: 'Store Admin',
        email: 'admin@grocery.com',
        role: 'admin'
      });
      return true;
    } else if (role === 'customer' && password.length >= 6) {
      setUser({
        id: `customer-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: 'customer'
      });
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate registration
    if (password.length >= 6) {
      setUser({
        id: `customer-${Date.now()}`,
        name,
        email,
        role: 'customer'
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
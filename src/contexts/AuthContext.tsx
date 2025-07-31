import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'super_admin' | 'business_owner' | 'operator';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  businessId?: string;
  businessName?: string;
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data - In production, this would come from a secure backend
const mockUsers: { [key: string]: User } = {
  'super:7588351751': {
    id: 'super-admin-1',
    username: 'super',
    role: 'super_admin',
  },
  'demo_business:password123': {
    id: 'business-1',
    username: 'demo_business',
    role: 'business_owner',
    businessId: 'business-1',
    businessName: 'Demo Business Ltd.',
  },
  'demo_operator:password123': {
    id: 'operator-1',
    username: 'demo_operator',
    role: 'operator',
    businessId: 'business-1',
    businessName: 'Demo Business Ltd.',
    permissions: ['billing', 'stock_view', 'reports_view'],
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('gst_billing_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userKey = `${username}:${password}`;
    const foundUser = mockUsers[userKey];
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('gst_billing_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gst_billing_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
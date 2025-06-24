import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  username: string;
  level: number;
  xp: number;
  strength: number;
  endurance: number;
  speed: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  register: (userData: { email: string; password: string; username: string }) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user data
const mockUser: User = {
  id: 1,
  email: 'hero@pixelpump.com',
  username: 'PixelHero',
  level: 6,
  xp: 1250,
  strength: 12,
  endurance: 8,
  speed: 13,
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      const storedUser = localStorage.getItem('pixelpump_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const login = async (credentials: { email: string; password: string }): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock authentication - accept any credentials
    if (credentials.email && credentials.password) {
      const userToLogin = { ...mockUser, email: credentials.email };
      setUser(userToLogin);
      localStorage.setItem('pixelpump_user', JSON.stringify(userToLogin));
      return true;
    }

    return false;
  };

  const register = async (userData: { email: string; password: string; username: string }): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock registration - accept any data
    if (userData.email && userData.password && userData.username) {
      const newUser = {
        ...mockUser,
        email: userData.email,
        username: userData.username,
        level: 1,
        xp: 0,
        strength: 5,
        endurance: 5,
        speed: 5,
      };
      setUser(newUser);
      localStorage.setItem('pixelpump_user', JSON.stringify(newUser));
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem('pixelpump_user');
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('pixelpump_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

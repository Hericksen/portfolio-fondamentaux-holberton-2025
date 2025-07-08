import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  level: number;
  xp: number;
  avatar: {
    body: string;
    outfit: string;
    accessory: string;
    color: string;
  };
  streak: number;
  fitness_goals: {
    daily_quests: number;
    weekly_xp: number;
    target_level: number;
  };
  total_quests_completed: number;
  created_at: string;
  last_quest_date: string | null;
  last_login: string | null;
}

interface AuthResult {
  success: boolean;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<AuthResult>;
  register: (userData: { email: string; password: string; username: string }) => Promise<AuthResult>;
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user data and token
    const storedUser = localStorage.getItem('pixelpump_user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('pixelpump_user');
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: { email: string; password: string }): Promise<AuthResult> => {
    try {
      console.log('🔐 Tentative de connexion avec:', credentials.email);
      const response = await api.post('/api/auth/login', credentials);
      console.log('📡 Réponse serveur:', response.data);
      
      if (response.data.success) {
        const userData = response.data.user;
        const token = response.data.token;
        
        console.log('✅ Connexion réussie, sauvegarde des données...');
        console.log('👤 Utilisateur:', userData.username);
        console.log('🔑 Token:', token.substring(0, 50) + '...');
        
        setUser(userData);
        localStorage.setItem('pixelpump_user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        
        console.log('💾 Données sauvegardées dans localStorage');
        return { success: true };
      }
      return { success: false, message: response.data.message || 'Échec de la connexion' };
    } catch (error: any) {
      console.error('❌ Erreur login:', error);
      const message = error.response?.data?.message || 'Erreur de connexion';
      return { success: false, message };
    }
  };

  const register = async (userData: { email: string; password: string; username: string }): Promise<AuthResult> => {
    try {
      const response = await api.post('/api/auth/register', userData);
      
      if (response.data.success) {
        const userInfo = response.data.user;
        const token = response.data.token;
        
        setUser(userInfo);
        localStorage.setItem('pixelpump_user', JSON.stringify(userInfo));
        localStorage.setItem('token', token);
        return { success: true };
      }
      return { success: false, message: response.data.message || 'Échec de l\'inscription' };
    } catch (error: any) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Erreur lors de l\'inscription';
      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pixelpump_user');
    localStorage.removeItem('token');
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

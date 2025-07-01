import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './useAuth';

interface DashboardUser {
  id: string;
  username: string;
  email: string;
  level: number;
  xp: number;
  streak: number;
  avatar: {
    body: string;
    outfit: string;
    accessory: string;
    color: string;
    background: string;
  };
  fitness_goals: {
    daily_quests: number;
    weekly_xp: number;
    target_level: number;
    preferred_activities: string[];
  };
  preferences: {
    notification_enabled: boolean;
    difficulty_preference: string;
    quest_reminders: boolean;
    achievement_notifications: boolean;
  };
  stats: {
    total_quests_completed: number;
    total_achievements_unlocked: number;
    best_streak: number;
    total_xp_earned: number;
  };
  total_quests_completed: number;
  last_login: string;
  created_at: string;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  category: string;
  xp_reward: number;
  difficulty: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: string;
  xp_reward: number;
}

interface RecentQuest {
  id: string;
  is_completed: boolean;
  completed_at: string;
  progress: number;
  assigned_at: string;
  Quest: Quest;
}

interface RecentAchievement {
  id: string;
  unlocked_at: string;
  Achievement: Achievement;
}

interface WeeklyStats {
  questsCompleted: number;
  xpEarned: number;
  streakDays: number;
}

interface Goals {
  dailyQuests: {
    target: number;
    completed: number;
    remaining: number;
  };
  weeklyXp: {
    target: number;
    earned: number;
    remaining: number;
  };
  targetLevel: {
    current: number;
    target: number;
    progress: number;
  };
}

interface NextLevel {
  xpNeeded: number;
  currentLevel: number;
  progress: number;
}

interface DashboardData {
  user: DashboardUser;
  progress: any; // Données de GamificationService
  recentActivity: {
    quests: RecentQuest[];
    achievements: RecentAchievement[];
  };
  weeklyStats: WeeklyStats;
  goals: Goals;
  nextLevel: NextLevel;
}

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading } = useAuth();

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Vérifier si l'utilisateur est connecté
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Vous devez être connecté pour accéder au dashboard');
        return;
      }
      
      const response = await api.get('/users/dashboard/me');
      
      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError(response.data.message || 'Erreur lors du chargement du dashboard');
      }
    } catch (err: any) {
      console.error('❌ Erreur lors de la récupération du dashboard:', err);
      console.error('📍 URL tentée:', err.config?.url);
      console.error('🔗 Base URL:', api.defaults.baseURL);
      console.error('📊 Status:', err.response?.status);
      console.error('📄 Data:', err.response?.data);
      
      if (err.response?.status === 404) {
        setError('Route dashboard non trouvée - Vérifiez que le backend est à jour');
      } else if (err.response?.status === 401) {
        setError('Session expirée - Veuillez vous reconnecter');
      } else {
        setError(err.response?.data?.message || 'Erreur de connexion');
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshDashboard = () => {
    fetchDashboard();
  };

  useEffect(() => {
    // Attendre que l'authentification soit vérifiée
    if (isLoading) {
      return; // Toujours en cours de vérification d'auth
    }
    
    if (!isAuthenticated) {
      setError('Vous devez être connecté pour accéder au dashboard');
      setLoading(false);
      return;
    }
    
    // Utilisateur authentifié, récupérer le dashboard
    fetchDashboard();
  }, [isAuthenticated, isLoading]);

  return {
    dashboardData,
    loading,
    error,
    refreshDashboard
  };
};

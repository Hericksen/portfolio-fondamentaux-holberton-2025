import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Types pour les quêtes avancées
export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  category: string;
  xp_reward: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  requirements: {
    action: string;
    count: number;
  };
}

export interface UserQuest {
  id: string;
  quest: Quest;
  progress: Record<string, any>;
  assigned_at: string;
  expires_at: string;
  cycle: {
    id: string;
    type: string;
    start_date: string;
    end_date: string;
  };
  streak_bonus: number;
  time_remaining: number;
}

export interface QuestCycle {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  start_date: string;
  end_date: string;
  is_active: boolean;
  quest_count: number;
  completed_count: number;
  completion_rate: number;
  time_remaining: number;
}

export interface QuestStats {
  total_active: number;
  by_type: {
    daily: number;
    weekly: number;
    monthly: number;
    special: number;
  };
  completion_rate: number;
  current_streak: number;
}

// API des quêtes avancées
export const advancedQuestApi = {
  // Récupérer les quêtes actives
  getActiveQuests: async (): Promise<{
    quests: {
      daily: UserQuest[];
      weekly: UserQuest[];
      monthly: UserQuest[];
      special: UserQuest[];
    };
    stats: QuestStats;
  }> => {
    const response = await api.get('/advanced-quests/active');
    return response.data.data;
  },

  // Compléter une quête
  completeQuest: async (questId: string, progress: Record<string, any>) => {
    const response = await api.post(`/advanced-quests/${questId}/complete`, { progress });
    return response.data;
  },

  // Récupérer l'historique des quêtes
  getQuestHistory: async (page = 1, limit = 20) => {
    const response = await api.get(`/advanced-quests/history?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  // Récupérer les cycles actifs
  getActiveCycles: async (): Promise<QuestCycle[]> => {
    const response = await api.get('/advanced-quests/cycles');
    return response.data.data;
  },

  // API Admin
  getAdminStats: async () => {
    const response = await api.get('/advanced-quests/admin/stats');
    return response.data.data;
  },

  forceAssignQuests: async () => {
    const response = await api.post('/advanced-quests/admin/force-assign');
    return response.data;
  },

  // Réinitialiser toutes les quêtes de tous les utilisateurs (admin uniquement)
  resetAllUserQuests: async () => {
    const response = await api.post('/advanced-quests/admin/reset-all-quests');
    return response.data;
  }
};

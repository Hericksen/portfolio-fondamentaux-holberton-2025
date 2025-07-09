import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
    const response = await api.get('/api/quests/user');
    const userQuests = response.data.data || [];
    
    // Organiser les quêtes par type
    const questsByType: {
      daily: UserQuest[];
      weekly: UserQuest[];
      monthly: UserQuest[];
      special: UserQuest[];
    } = {
      daily: [],
      weekly: [],
      monthly: [],
      special: []
    };
    
    userQuests.forEach((userQuest: any) => {
      // Ne prendre que les quêtes non complétées
      if (userQuest.Quest && !userQuest.is_completed) {
        const type = userQuest.Quest.type as keyof typeof questsByType;
        if (questsByType[type]) {
          questsByType[type].push(userQuest);
        }
      }
    });
    
    const activeQuests = userQuests.filter((userQuest: any) => !userQuest.is_completed);
    
    return {
      quests: questsByType,
      stats: {
        total_active: activeQuests.length,
        by_type: {
          daily: questsByType.daily.length,
          weekly: questsByType.weekly.length,
          monthly: questsByType.monthly.length,
          special: questsByType.special.length
        },
        completion_rate: 0, // À calculer si nécessaire
        current_streak: 0  // À récupérer du dashboard si nécessaire
      }
    };
  },

  // Compléter une quête
  completeQuest: async (questId: string, progress: Record<string, any>) => {
    console.log('API: Completing quest with ID:', questId, 'Progress:', progress);
    const response = await api.put(`/api/quests/${questId}/complete`, { progress });
    console.log('API: Quest completion response:', response.data);
    return response.data;
  },

  // Récupérer l'historique des quêtes
  getQuestHistory: async (page = 1, limit = 20) => {
    const response = await api.get(`/api/quests/user?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  // Récupérer les cycles actifs
  getActiveCycles: async (): Promise<QuestCycle[]> => {
    const response = await api.get('/api/quests/cycles');
    return response.data.data;
  },

  // Renouveler les quêtes (pour utilisateurs demo/admin uniquement)
  renewQuests: async () => {
    console.log('🌐 API: Tentative de renouvellement des quêtes...');
    
    try {
      // Vérifier si l'utilisateur est admin/démo
      const storedUser = localStorage.getItem('pixelpump_user');
      if (!storedUser) {
        throw new Error('Utilisateur non authentifié');
      }
      
      const user = JSON.parse(storedUser);
      console.log('📡 Utilisateur actuel:', { username: user.username, role: user.role });
      
      // Vérifier les permissions
      const demoUsernames = ['testuser', 'admin', 'demo', 'NewbiePumper', 'FitnessGuru', 'CodeWarrior', 'DemoUser'];
      const demoEmails = ['admin@pixelpump.com', 'demo@pixelpump.com'];
      
      const isAuthorized = demoUsernames.includes(user.username) || 
                          demoEmails.includes(user.email) || 
                          (user.email && user.email.includes('demo')) ||
                          user.role === 'admin';
      
      if (!isAuthorized) {
        throw new Error('Accès non autorisé - Réservé aux administrateurs et utilisateurs démo');
      }
      
      // Utiliser l'instance API pour gérer l'authentification automatiquement
      console.log('📡 Envoi requête à l\'API avec authentification...');
      const response = await api.post('/api/quests/demo/renew');
      console.log('🌐 API: Réponse de l\'API:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('🌐 API: Erreur lors du renouvellement:', error);
      if (error.response) {
        console.error('📡 Détails de l\'erreur:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      throw error;
    }
  },

  // API Admin
  getAdminStats: async () => {
    const response = await api.get('/api/admin/stats');
    return response.data.data;
  },

  forceAssignQuests: async () => {
    const response = await api.post('/api/admin/force-assign');
    return response.data;
  }
};

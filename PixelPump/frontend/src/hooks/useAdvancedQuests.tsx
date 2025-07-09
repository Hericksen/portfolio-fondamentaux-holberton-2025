import { useState, useEffect, useCallback } from 'react';
import { advancedQuestApi } from '../services/api';
import type { UserQuest, QuestStats } from '../services/api';

interface UseAdvancedQuestsReturn {
  // Données
  activeQuests: {
    daily: UserQuest[];
    weekly: UserQuest[];
    monthly: UserQuest[];
    special: UserQuest[];
  };
  stats: QuestStats | null;
  history: UserQuest[];
  
  // États
  loading: boolean;
  error: string | null;
  
  // Actions
  refreshQuests: () => Promise<void>;
  renewQuests: () => Promise<boolean>;
  completeQuest: (questId: string, progress: Record<string, any>) => Promise<boolean>;
  loadHistory: (page?: number) => Promise<void>;
}

export const useAdvancedQuests = (onUserDataChange?: () => Promise<void>): UseAdvancedQuestsReturn => {
  const [activeQuests, setActiveQuests] = useState<{
    daily: UserQuest[];
    weekly: UserQuest[];
    monthly: UserQuest[];
    special: UserQuest[];
  }>({
    daily: [],
    weekly: [],
    monthly: [],
    special: []
  });
  
  const [stats, setStats] = useState<QuestStats | null>(null);
  const [history, setHistory] = useState<UserQuest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les quêtes actives
  const refreshQuests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await advancedQuestApi.getActiveQuests();
      setActiveQuests(data.quests);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des quêtes');
      console.error('Erreur quêtes actives:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Compléter une quête
  const completeQuest = useCallback(async (questId: string, progress: Record<string, any>): Promise<boolean> => {
    try {
      setError(null);
      console.log('Attempting to complete quest:', questId, 'with progress:', progress);
      
      // Sauvegarder la position de défilement actuelle
      const scrollPosition = window.scrollY;
      
      const result = await advancedQuestApi.completeQuest(questId, progress);
      console.log('Quest completion result:', result);
      
      if (result.success) {
        console.log('Quest completed successfully, XP gained:', result.data?.xpGained);
        // Rafraîchir les quêtes après complétion
        await refreshQuests();
        // Rafraîchir les données utilisateur si la fonction est fournie
        if (onUserDataChange) {
          await onUserDataChange();
        }
        
        // Restaurer la position de défilement
        setTimeout(() => {
          window.scrollTo({
            top: scrollPosition,
            behavior: 'auto'
          });
        }, 100);
        
        return true;
      }
      
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la complétion de la quête');
      console.error('Erreur complétion quête:', err);
      return false;
    }
  }, [refreshQuests]);

  // Renouveler les quêtes (pour utilisateurs demo/admin)
  const renewQuests = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await advancedQuestApi.renewQuests();
      
      if (result.success) {
        console.log('Quêtes renouvelées avec succès:', result.data);
        // Rafraîchir les quêtes après renouvellement
        await refreshQuests();
        // Rafraîchir les données utilisateur si la fonction est fournie
        if (onUserDataChange) {
          await onUserDataChange();
        }
        return true;
      }
      
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du renouvellement des quêtes');
      console.error('Erreur renouvellement quêtes:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshQuests, onUserDataChange]);

  // Charger l'historique
  const loadHistory = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await advancedQuestApi.getQuestHistory(page);
      setHistory(data.quests);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement de l\'historique');
      console.error('Erreur historique:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les données initiales
  useEffect(() => {
    refreshQuests();
  }, [refreshQuests]);

  // Timer pour mettre à jour les temps restants des quêtes toutes les secondes
  useEffect(() => {
    const updateTimers = () => {
      setActiveQuests(current => {
        const now = new Date().getTime();
        
        const updateQuestTimers = (quests: UserQuest[]) => {
          return quests.map(quest => {
            if (!quest.expires_at) return quest;
            
            const expirationTime = new Date(quest.expires_at).getTime();
            const diffMs = Math.max(0, expirationTime - now);
            
            return {
              ...quest,
              time_remaining: diffMs // Stocker en millisecondes pour plus de précision
            };
          });
        };

        return {
          daily: updateQuestTimers(current.daily),
          weekly: updateQuestTimers(current.weekly),
          monthly: updateQuestTimers(current.monthly),
          special: updateQuestTimers(current.special)
        };
      });
    };

    // Mettre à jour immédiatement
    updateTimers();
    
    // Puis toutes les secondes
    const interval = setInterval(updateTimers, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    activeQuests,
    stats,
    history,
    loading,
    error,
    refreshQuests,
    completeQuest,
    renewQuests,
    loadHistory
  };
};

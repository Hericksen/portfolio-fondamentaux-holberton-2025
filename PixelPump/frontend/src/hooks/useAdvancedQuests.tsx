import { useState, useEffect, useCallback } from 'react';
import { advancedQuestApi } from '../services/api';
import type { UserQuest, QuestCycle, QuestStats } from '../services/api';

interface UseAdvancedQuestsReturn {
  // Données
  activeQuests: {
    daily: UserQuest[];
    weekly: UserQuest[];
    monthly: UserQuest[];
    special: UserQuest[];
  };
  stats: QuestStats | null;
  cycles: QuestCycle[];
  history: UserQuest[];
  
  // États
  loading: boolean;
  error: string | null;
  
  // Actions
  refreshQuests: () => Promise<void>;
  completeQuest: (questId: string, progress: Record<string, any>) => Promise<boolean>;
  loadHistory: (page?: number) => Promise<void>;
  loadCycles: () => Promise<void>;
}

export const useAdvancedQuests = (): UseAdvancedQuestsReturn => {
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
  const [cycles, setCycles] = useState<QuestCycle[]>([]);
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
      
      const result = await advancedQuestApi.completeQuest(questId, progress);
      
      if (result.success) {
        // Rafraîchir les quêtes après complétion
        await refreshQuests();
        return true;
      }
      
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la complétion de la quête');
      console.error('Erreur complétion quête:', err);
      return false;
    }
  }, [refreshQuests]);

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

  // Charger les cycles
  const loadCycles = useCallback(async () => {
    try {
      setError(null);
      
      const data = await advancedQuestApi.getActiveCycles();
      setCycles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des cycles');
      console.error('Erreur cycles:', err);
    }
  }, []);

  // Charger les données initiales
  useEffect(() => {
    refreshQuests();
    loadCycles();
  }, [refreshQuests, loadCycles]);

  return {
    activeQuests,
    stats,
    cycles,
    history,
    loading,
    error,
    refreshQuests,
    completeQuest,
    loadHistory,
    loadCycles
  };
};

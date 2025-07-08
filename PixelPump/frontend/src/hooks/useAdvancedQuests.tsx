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
      console.log('🎯 Hook: Début de complétion pour questId:', questId, 'avec progress:', progress);
      
      // Afficher l'état actuel des quêtes avant complétion
      console.log('📊 Hook: État avant complétion:', {
        daily: activeQuests.daily.length,
        weekly: activeQuests.weekly.length,
        monthly: activeQuests.monthly.length,
        special: activeQuests.special.length
      });
      
      const result = await advancedQuestApi.completeQuest(questId, progress);
      console.log('🎯 Hook: Résultat de l\'API:', result);
      
      if (result.success) {
        console.log('✅ Hook: Complétion réussie, XP gagné:', result.data?.xpGained);
        
        // Si c'est une quête démo, on la retire directement de l'état local
        if (questId.startsWith('demo-')) {
          console.log('🎭 Hook: Retrait de la quête démo de l\'état local');
          
          setActiveQuests(prevQuests => {
            const newQuests = { ...prevQuests };
            
            // Compter avant retrait
            const totalBefore = Object.values(newQuests).flat().length;
            console.log('📊 Hook: Nombre de quêtes avant retrait:', totalBefore);
            
            // Retirer la quête de toutes les catégories
            Object.keys(newQuests).forEach(category => {
              const categoryKey = category as keyof typeof newQuests;
              const beforeCount = newQuests[categoryKey].length;
              
              newQuests[categoryKey] = newQuests[categoryKey].filter(
                (quest: any) => quest.id !== questId
              );
              
              const afterCount = newQuests[categoryKey].length;
              if (beforeCount !== afterCount) {
                console.log(`✅ Hook: Quête retirée de la catégorie ${category} (${beforeCount} → ${afterCount})`);
              }
            });
            
            const totalAfter = Object.values(newQuests).flat().length;
            console.log('📊 Hook: Nombre de quêtes après retrait:', totalAfter);
            
            return newQuests;
          });
          
          // Mettre à jour les stats
          setStats(prevStats => {
            if (!prevStats) return prevStats;
            
            const newTotal = prevStats.total_active - 1;
            console.log('📊 Hook: Mise à jour des stats:', prevStats.total_active, '→', newTotal);
            
            return {
              ...prevStats,
              total_active: newTotal >= 0 ? newTotal : 0,
            };
          });
        } else {
          // Pour les vraies quêtes, rafraîchir depuis le backend
          console.log('🔄 Hook: Rafraîchissement depuis le backend pour vraie quête');
          await refreshQuests();
        }
        
        // Rafraîchir les données utilisateur si la fonction est fournie
        if (onUserDataChange) {
          console.log('🔄 Hook: Rafraîchissement des données utilisateur');
          await onUserDataChange();
        }
        
        console.log('✅ Hook: Quête complétée avec succès, conservation de la position de scroll');
        return true;
      }
      
      console.log('❌ Hook: Échec de la complétion de la quête');
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la complétion de la quête');
      console.error('❌ Hook: Erreur complétion quête:', err);
      return false;
    }
  }, [refreshQuests, onUserDataChange, activeQuests]);

  // Renouveler les quêtes (pour utilisateurs demo/admin)
  const renewQuests = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Hook: Début du renouvellement des quêtes...');
      
      const result = await advancedQuestApi.renewQuests();
      
      if (result.success) {
        console.log('✅ Hook: Quêtes renouvelées avec succès:', result.data);
        
        // Nettoyer le cache existant pour forcer le rafraîchissement
        localStorage.removeItem('pixelpump_active_quests_cache');
        
        // Attendre un peu pour s'assurer que les nouvelles quêtes sont en cache
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Forcer le rafraîchissement des quêtes
        console.log('🔄 Hook: Rafraîchissement des quêtes après renouvellement...');
        await refreshQuests();
        
        // Rafraîchir les données utilisateur si la fonction est fournie
        if (onUserDataChange) {
          await onUserDataChange();
        }
        
        console.log('✅ Hook: Renouvellement terminé avec succès');
        return true;
      }
      
      console.log('⚠️ Hook: Échec du renouvellement');
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du renouvellement des quêtes');
      console.error('❌ Hook: Erreur renouvellement quêtes:', err);
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

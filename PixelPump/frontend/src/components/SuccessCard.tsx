import React, { useEffect, useState } from 'react';
import { Trophy, Award, Star, Crown, ChevronRight } from 'lucide-react';
import { Badge } from './ui/badge';
import api from '../services/api';

// Types pour les achievements
interface Achievement {
  id: string;
  title: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  xp_reward: number;
}

interface UserAchievement {
  id: string;
  unlocked_at: string;
  Achievement: Achievement;
}

// Props du composant
interface SuccessCardProps {
  onClick: () => void;
}

// Configuration des styles par rareté
const rarityConfig = {
  common: { color: '#9ca3af', icon: Award },
  rare: { color: '#3b82f6', icon: Star },
  epic: { color: '#8b5cf6', icon: Trophy },
  legendary: { color: '#f59e0b', icon: Crown }
};

export const SuccessCard: React.FC<SuccessCardProps> = ({ onClick }) => {
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUnlocked, setTotalUnlocked] = useState(0);
  const [totalAchievements, setTotalAchievements] = useState(0);

  useEffect(() => {
    // Récupérer les achievements de l'utilisateur
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/achievements/user');
        
        if (response.data.success) {
          setAchievements(response.data.data.slice(0, 3)); // Limiter à 3 achievements
          setTotalUnlocked(response.data.stats.unlocked);
          setTotalAchievements(response.data.stats.total);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return (
      <div className="mt-4 p-4 border rounded-lg bg-gray-50">
        <div className="flex justify-center">
          <div className="animate-spin h-5 w-5 border-b-2 border-purple-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50 hover:shadow-md transition-shadow">
      {/* En-tête avec statistiques et bouton */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-purple-600" />
          <h3 className="text-sm font-semibold text-gray-800">
            Mes Succès ({totalUnlocked}/{totalAchievements})
          </h3>
        </div>
        <button
          onClick={onClick}
          className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-800"
        >
          Voir tous <ChevronRight size={14} />
        </button>
      </div>

      {/* Liste des achievements */}
      {achievements.length === 0 ? (
        <div className="text-center py-3">
          <p className="text-sm text-gray-500">Aucun succès débloqué</p>
          <p className="text-xs text-gray-400 mt-1">
            Complétez des quêtes pour débloquer des succès!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {achievements.map((userAchievement) => {
            const achievement = userAchievement.Achievement;
            const config = rarityConfig[achievement.rarity];
            const IconComponent = config.icon;
            
            return (
              <div
                key={userAchievement.id}
                className="flex items-center gap-2 p-2 bg-white rounded border border-gray-100"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${config.color}20`, border: `2px solid ${config.color}` }}
                >
                  <IconComponent size={14} style={{ color: config.color }} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{achievement.title}</h4>
                    <Badge
                      variant="outline"
                      className="text-xs capitalize ml-1"
                      style={{ color: config.color, borderColor: config.color }}
                    >
                      {achievement.rarity}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{achievement.description}</p>
                </div>
              </div>
            );
          })}
          
          {/* Bouton pour voir plus */}
          <button
            onClick={onClick}
            className="w-full py-2 text-xs text-center text-purple-600 hover:text-purple-800 border border-purple-200 rounded-md hover:bg-purple-50 transition-colors"
          >
            Voir tous mes succès
          </button>
        </div>
      )}
    </div>
  );
};

export default SuccessCard;

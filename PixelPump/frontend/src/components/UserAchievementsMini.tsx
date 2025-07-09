import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Trophy, Award, Star, Crown, ChevronRight } from 'lucide-react';
import api from '../services/api';

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
  progress: number;
  Achievement: Achievement;
}

interface UserAchievementsMiniProps {
  className?: string;
  onViewAll: () => void;
}

const rarityConfig = {
  common: {
    color: '#9ca3af',
    icon: Award
  },
  rare: {
    color: '#3b82f6',
    icon: Star
  },
  epic: {
    color: '#8b5cf6',
    icon: Trophy
  },
  legendary: {
    color: '#f59e0b',
    icon: Crown
  }
};

export const UserAchievementsMini: React.FC<UserAchievementsMiniProps> = ({ 
  className = "",
  onViewAll
}) => {
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserAchievements();
  }, []);

  const fetchUserAchievements = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/achievements/user');
      
      if (response.data.success) {
        setAchievements(response.data.data.slice(0, 3));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`mt-4 border rounded-lg p-3 ${className}`}>
        <div className="flex justify-center py-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <div className={`mt-4 border rounded-lg p-3 ${className}`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-purple-800">Vos succès</h3>
          <button 
            onClick={onViewAll}
            className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1"
          >
            Voir tous <ChevronRight size={14} />
          </button>
        </div>
        <div className="text-center py-3">
          <p className="text-sm text-gray-500">
            Aucun succès débloqué pour le moment
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`mt-4 border rounded-lg p-3 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-purple-800">
          Vos succès récents ({achievements.length})
        </h3>
        <button 
          onClick={onViewAll}
          className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1"
        >
          Voir tous <ChevronRight size={14} />
        </button>
      </div>
      
      <div className="space-y-2">
        {achievements.map((userAchievement) => {
          const achievement = userAchievement.Achievement;
          const config = rarityConfig[achievement.rarity];
          const IconComponent = config.icon;
          
          return (
            <div 
              key={userAchievement.id}
              className="flex items-center gap-2 p-2 bg-white rounded-md hover:bg-gray-50"
            >
              <div 
                style={{ backgroundColor: config.color + '20', color: config.color }}
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              >
                <IconComponent size={16} />
              </div>
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {achievement.title}
                  </h4>
                  <Badge 
                    variant="outline" 
                    className="text-xs capitalize"
                    style={{ color: config.color, borderColor: config.color }}
                  >
                    {achievement.rarity}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {achievement.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserAchievementsMini;

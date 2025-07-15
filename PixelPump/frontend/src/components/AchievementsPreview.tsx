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

interface AchievementsPreviewProps {
  userId?: string;
  className?: string;
  maxItems?: number;
  onViewAll?: () => void;
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

export const AchievementsPreview: React.FC<AchievementsPreviewProps> = ({
  userId,
  className = "",
  maxItems = 3,
  onViewAll
}) => {
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [stats, setStats] = useState({
    unlocked: 0,
    total: 0,
    progress: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserAchievements();
  }, [userId]);

  const fetchUserAchievements = async () => {
    try {
      setLoading(true);
      
      const endpoint = userId 
        ? `/api/achievements/user/${userId}`
        : '/api/achievements/user';
        
      const response = await api.get(endpoint);
      
      if (response.data.success) {
        setAchievements(response.data.data.slice(0, maxItems));
        setStats(response.data.stats);
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        {className.includes('border-0') ? null : (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" style={{ color: '#ff006e' }} />
              Succès Récents
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} w-full`}>
      {!className.includes('border-0') && (
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" style={{ color: '#ff006e' }} />
              <span>Succès Récents</span>
              <Badge variant="secondary" className="ml-2">
                {stats.unlocked}/{stats.total}
              </Badge>
            </div>
            {onViewAll && (
              <button
                onClick={onViewAll}
                className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 transition-colors"
              >
                Voir tout
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </CardTitle>
        </CardHeader>
      )}
      
      <CardContent className={className.includes('p-0') ? 'p-0' : undefined}>
        {achievements.length === 0 ? (
          <div className="text-center py-4">
            <Trophy className="w-8 h-8 mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">
              Aucun succès débloqué
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Complétez des quêtes pour gagner vos premiers succès !
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div
              className="flex flex-wrap gap-4 justify-center items-stretch w-full"
              style={{ minHeight: 120 }}
            >
              {achievements.map((userAchievement) => {
                const achievement = userAchievement.Achievement;
                const config = rarityConfig[achievement.rarity];
                const IconComponent = config.icon;
                // Responsive width: 1 achievement = 100%, 2 = 48%, 3+ = 31% (max 3 per row)
                let width = '100%';
                if (achievements.length === 2) width = '48%';
                else if (achievements.length >= 3) width = '31%';
                return (
                  <div
                    key={userAchievement.id}
                    className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-[rgba(26,0,51,0.92)] border-2 border-[var(--pixel-border-secondary)] hover:bg-[rgba(255,0,110,0.15)] transition-colors shadow-2xl min-h-[110px]"
                    style={{ boxShadow: '0 8px 32px rgba(255,0,110,0.18)', width, minWidth: 0, maxWidth: '100%' }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center border-2 shadow-lg mb-2"
                      style={{ background: 'linear-gradient(135deg, var(--pixel-primary) 0%, var(--pixel-secondary) 60%, var(--pixel-accent) 100%)', borderColor: config.color }}
                    >
                      <IconComponent
                        className="w-7 h-7"
                        style={{ color: config.color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0 w-full flex flex-col items-center">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-pixel text-base text-[var(--pixel-text-primary)] truncate drop-shadow-xl max-w-[90px] text-center">
                          {achievement.title}
                        </h4>
                        <Badge
                          variant="outline"
                          className="text-xs capitalize px-2 py-0.5 font-bold tracking-wide"
                          style={{ color: config.color, borderColor: config.color, background: 'rgba(0,0,0,0.18)' }}
                        >
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-xs text-[var(--pixel-text-muted)] font-mono mb-1 whitespace-normal break-words text-center">
                        {achievement.description}
                      </p>
                      <div className="text-xs text-[var(--pixel-text-accent)] mt-1 font-bold text-center">
                        +{achievement.xp_reward} XP • {new Date(userAchievement.unlocked_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Barre de progression globale */}
            <div className="mt-4 p-3 bg-[rgba(26,0,51,0.7)] rounded-lg">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-[var(--pixel-text-accent)] font-medium">Progression totale</span>
                <span className="text-[var(--pixel-text-primary)]">{stats.progress}%</span>
              </div>
              <div className="w-full bg-[var(--pixel-border-secondary)] rounded-full h-2">
                <div 
                  className="bg-[var(--pixel-success)] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementsPreview;

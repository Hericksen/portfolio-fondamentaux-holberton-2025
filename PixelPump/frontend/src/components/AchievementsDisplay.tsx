import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Trophy, Award, Star, Crown, Calendar, TrendingUp } from 'lucide-react';
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

interface AchievementsDisplayProps {
  userId?: string;
  className?: string;
}

const rarityConfig = {
  common: {
    color: '#9ca3af',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    textColor: 'text-gray-700',
    icon: Award
  },
  rare: {
    color: '#3b82f6',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-700',
    icon: Star
  },
  epic: {
    color: '#8b5cf6',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-700',
    icon: Trophy
  },
  legendary: {
    color: '#f59e0b',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300',
    textColor: 'text-yellow-700',
    icon: Crown
  }
};

export const AchievementsDisplay: React.FC<AchievementsDisplayProps> = ({
  userId,
  className = ""
}) => {
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [stats, setStats] = useState({
    unlocked: 0,
    total: 0,
    progress: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'common' | 'rare' | 'epic' | 'legendary'>('all');

  useEffect(() => {
    fetchUserAchievements();
  }, [userId]);

  const fetchUserAchievements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = userId 
        ? `/api/achievements/user/${userId}`
        : '/api/achievements/user';
        
      const response = await api.get(endpoint);
      
      if (response.data.success) {
        setAchievements(response.data.data);
        setStats(response.data.stats);
      } else {
        throw new Error(response.data.message || 'Erreur lors du chargement des achievements');
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des achievements:', error);
      setError(error.response?.data?.message || 'Impossible de charger les achievements');
    } finally {
      setLoading(false);
    }
  };

  const filteredAchievements = achievements.filter(userAchievement => {
    if (filter === 'all') return true;
    return userAchievement.Achievement.rarity === filter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" style={{ color: '#ff006e' }} />
            Succès & Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="pixel-spinner"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" style={{ color: '#ff006e' }} />
            Succès & Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={fetchUserAchievements}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Réessayer
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} pixel-card w-full max-w-none`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" style={{ color: '#ff006e' }} />
          Succès & Achievements
        </CardTitle>
        
        {/* Statistiques globales */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span>Progression</span>
            <span className="font-bold">{stats.unlocked}/{stats.total}</span>
          </div>
          <Progress value={stats.progress} className="w-full" />
          <div className="text-xs text-gray-500 text-center">
            {stats.progress}% complété
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Filtres */}
        <div className="flex flex-wrap gap-2 justify-center">
          {(['all', 'legendary', 'epic', 'rare', 'common'] as const).map((rarity) => (
            <button
              key={rarity}
              onClick={() => setFilter(rarity)}
              className={`px-3 py-1 text-xs rounded-full border transition-all ${
                filter === rarity
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {rarity === 'all' ? 'Tous' : rarity.charAt(0).toUpperCase() + rarity.slice(1)}
            </button>
          ))}
        </div>

        {/* Liste des achievements */}
        {filteredAchievements.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">
              {filter === 'all' 
                ? "Aucun succès débloqué pour le moment"
                : `Aucun succès ${filter} débloqué`
              }
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Complétez des quêtes pour débloquer vos premiers achievements !
            </p>
          </div>
        ) : (
          <div
            className="flex flex-wrap justify-center gap-6 pb-2 w-full"
          >
            {Array.from({ length: Math.ceil(filteredAchievements.length / 3) }).map((_, groupIdx) => {
              const group = filteredAchievements.slice(groupIdx * 3, groupIdx * 3 + 3);
              const groupWidth = group.length === 1 ? 'w-full' : group.length === 2 ? 'w-1/2' : 'w-1/3';
              return (
                <div
                  key={groupIdx}
                  className={`flex flex-col items-center ${groupWidth} min-w-[220px] max-w-full`}
                  style={{
                    background: 'linear-gradient(135deg, rgba(26, 0, 51, 0.85) 0%, rgba(255, 0, 110, 0.08) 100%)',
                    border: '2px solid rgb(255, 0, 110)',
                    borderRadius: '18px',
                    boxShadow: 'rgba(255, 0, 110, 0.1) 0px 4px 24px',
                    padding: '18px 18px 12px',
                    position: 'relative',
                    transition: 'box-shadow 0.2s',
                    marginBottom: '24px',
                  }}
                >
                  <div className="flex flex-col md:flex-row gap-6 w-full">
                    {group.map((userAchievement) => {
                      const achievement = userAchievement.Achievement;
                      const config = rarityConfig[achievement.rarity];
                      const IconComponent = config.icon;
                      return (
                        <div key={userAchievement.id} className="flex-1 flex flex-col items-start gap-3 min-w-0 break-words">
                          <div className="flex items-start gap-3 w-full">
                            <div className="flex-shrink-0">
                              <div 
                                className="w-12 h-12 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: config.color + '20', border: `2px solid ${config.color}` }}
                              >
                                <IconComponent 
                                  className="w-6 h-6" 
                                  style={{ color: config.color }} 
                                />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-[var(--pixel-text-primary)] truncate">
                                  {achievement.title}
                                </h3>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs`} 
                                  style={{ color: config.color, borderColor: config.color }}
                                >
                                  {achievement.rarity}
                                </Badge>
                              </div>
                              <p className="text-sm text-[var(--pixel-text-muted)] mb-2">
                                {achievement.description}
                              </p>
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-4">
                                  <span className="flex items-center gap-1 text-[var(--pixel-text-accent)]">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(userAchievement.unlocked_at)}
                                  </span>
                                  <span className="flex items-center gap-1 text-[var(--pixel-success)]">
                                    <TrendingUp className="w-3 h-3" />
                                    +{achievement.xp_reward} XP
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Résumé par rareté */}
        {achievements.length > 0 && (
          <div className="mt-6 p-4 bg-[rgba(26,0,51,0.7)] rounded-lg">
            <h4 className="text-sm font-semibold mb-3 text-[var(--pixel-text-accent)]">Résumé par rareté</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(rarityConfig).map(([rarity, config]) => {
                const count = achievements.filter(ua => ua.Achievement.rarity === rarity).length;
                const IconComponent = config.icon;
                return (
                  <div key={rarity} className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <IconComponent 
                        className="w-4 h-4 mr-1" 
                        style={{ color: config.color }} 
                      />
                      <span className="text-xs font-medium capitalize text-[var(--pixel-text-primary)]">
                        {rarity}
                      </span>
                    </div>
                    <div className="text-lg font-bold" style={{ color: config.color }}>
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementsDisplay;

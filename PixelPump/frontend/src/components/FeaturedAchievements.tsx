import React, { useState, useEffect } from 'react';
import { Trophy, Award, Star, Crown, Edit2 } from 'lucide-react';
import { Button } from './ui/button';
import { FeaturedAchievementsSelector } from './FeaturedAchievementsSelector';
import api from '../services/api';

// Types
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

interface FeaturedAchievementsProps {
  className?: string;
  isEditing?: boolean;
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

export const FeaturedAchievements: React.FC<FeaturedAchievementsProps> = ({ 
  className = "", 
  isEditing = false 
}) => {
  const [featuredAchievements, setFeaturedAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSelector, setShowSelector] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[FeaturedAchievements] mount, showSelector:', showSelector);
    fetchFeaturedAchievements();
  }, [showSelector]); // Recharger quand le sélecteur est fermé

  const fetchFeaturedAchievements = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('[FeaturedAchievements] fetchFeaturedAchievements...');
      
      // 1. Récupérer les IDs des achievements mis en avant
      const featuredResponse = await api.get('/api/users/profile/featured-achievements');
      console.log('[FeaturedAchievements] featuredResponse:', featuredResponse.data);
      
      if (!featuredResponse.data.success || !featuredResponse.data.featured_achievements) {
        setFeaturedAchievements([]);
        setLoading(false);
        return;
      }
      
      const featuredIds = featuredResponse.data.featured_achievements;
      
      if (featuredIds.length === 0) {
        setFeaturedAchievements([]);
        setLoading(false);
        return;
      }
      
      // 2. Récupérer tous les achievements de l'utilisateur
      const achievementsResponse = await api.get('/api/achievements/user');
      console.log('[FeaturedAchievements] achievementsResponse:', achievementsResponse.data);
      
      if (achievementsResponse.data.success) {
        // 3. Filtrer pour ne garder que les achievements mis en avant
        const allUserAchievements = achievementsResponse.data.data;
        const featured = allUserAchievements.filter((ua: UserAchievement) => 
          featuredIds.includes(ua.Achievement.id)
        );
        
        setFeaturedAchievements(featured);
        console.log('[FeaturedAchievements] featured:', featured);
      }
    } catch (error) {
      setError('Erreur lors du chargement des succès favoris.');
      console.error('[FeaturedAchievements] error:', error);
      
      // Fallback si l'API n'existe pas encore
      try {
        const fallbackResponse = await api.get('/api/achievements/user');
        if (fallbackResponse.data.success) {
          // Prendre les 3 premiers achievements comme exemple
          setFeaturedAchievements(fallbackResponse.data.data.slice(0, 3));
        }
      } catch (fallbackError) {
        console.error('Erreur lors du chargement des achievements de secours:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className={`mt-4 p-3 border rounded-lg bg-red-50 ${className}`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-red-800">Erreur Succès Favoris</h3>
        </div>
        <div className="text-center py-6">
          <p className="text-red-600">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 text-purple-600 border-purple-200 hover:bg-purple-50"
            onClick={fetchFeaturedAchievements}
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`mt-4 p-3 border rounded-lg bg-gray-50 ${className}`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-purple-800">Mes Succès Favoris</h3>
        </div>
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (featuredAchievements.length === 0) {
    return (
      <div className={`mt-4 p-3 border rounded-lg bg-gray-50 ${className}`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-purple-800">Mes Succès Favoris</h3>
          {!isEditing && (
            <Button 
              size="sm" 
              variant="ghost"
              className="text-xs text-purple-600 p-0 h-auto hover:bg-transparent hover:text-purple-800"
              onClick={() => setShowSelector(true)}
            >
              <Edit2 size={14} className="mr-1" />
              Personnaliser
            </Button>
          )}
        </div>
        
        <div className="text-center py-6">
          <Trophy className="w-8 h-8 mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">
            Vous n'avez pas encore sélectionné de succès favoris
          </p>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              className="mt-3 text-purple-600 border-purple-200 hover:bg-purple-50"
              onClick={() => setShowSelector(true)}
            >
              Choisir mes succès favoris
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (!loading && !error && featuredAchievements.length === 0) {
    return (
      <div className={`mt-4 p-3 border rounded-lg bg-yellow-50 ${className}`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-yellow-800">[DEBUG] Composant FeaturedAchievements monté</h3>
        </div>
        <div className="text-center py-6">
          <p className="text-yellow-600">Aucun succès favori sélectionné ou problème de données.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`pixel-card ${className} mt-4`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="pixel-title text-[var(--pixel-text-accent)] text-lg flex items-center">
            <span className="mr-2 align-middle">🏆</span>Mes Succès Favoris
          </h3>
          {!isEditing && (
            <Button 
              size="sm" 
              variant="ghost"
              className="text-xs text-[var(--pixel-text-accent)] p-0 h-auto hover:bg-transparent hover:text-[var(--pixel-primary)]"
              onClick={() => setShowSelector(true)}
            >
              <Edit2 size={14} className="mr-1" />
              Modifier
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {featuredAchievements.map((userAchievement) => {
            const achievement = userAchievement.Achievement;
            const config = rarityConfig[achievement.rarity];
            const IconComponent = config.icon;
            return (
              <div 
                key={userAchievement.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-[var(--pixel-border-secondary)] bg-[rgba(26,0,51,0.7)] hover:bg-[rgba(255,0,110,0.08)] transition-colors duration-200"
                style={{ boxShadow: '0 2px 8px rgba(255,0,110,0.10)' }}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 shadow"
                  style={{ 
                    background: 'linear-gradient(135deg, var(--pixel-primary) 0%, var(--pixel-secondary) 60%, var(--pixel-accent) 100%)',
                    color: config.color,
                    borderColor: config.color 
                  }}
                >
                  <IconComponent size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-pixel text-base text-[var(--pixel-text-primary)] truncate drop-shadow">
                    {achievement.title}
                  </h4>
                  <p className="text-xs text-[var(--pixel-text-muted)] truncate">
                    {achievement.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {showSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <FeaturedAchievementsSelector onClose={() => setShowSelector(false)} />
        </div>
      )}
    </>
  );
};

export default FeaturedAchievements;

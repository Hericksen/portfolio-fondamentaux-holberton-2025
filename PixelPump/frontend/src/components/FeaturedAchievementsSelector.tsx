import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trophy, Award, Star, Crown, Check, X } from 'lucide-react';
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
  achievement_id: string;
  Achievement: Achievement;
}

interface UserFeaturedAchievements {
  featured_achievements: string[];
}

interface FeaturedAchievementsSelectorProps {
  onClose: () => void;
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

export const FeaturedAchievementsSelector: React.FC<FeaturedAchievementsSelectorProps> = ({ onClose }) => {
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [featuredIds, setFeaturedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'common' | 'rare' | 'epic' | 'legendary'>('all');
  const maxFeatured = 3;

  useEffect(() => {
    console.log('[FeaturedAchievementsSelector] mount');
    fetchUserAchievements();
    fetchFeaturedAchievements();
  }, []);

  const fetchUserAchievements = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/achievements/user');
      console.log('[FeaturedAchievementsSelector] userAchievements:', response.data);
      
      if (response.data.success) {
        setUserAchievements(response.data.data);
      }
    } catch (error) {
      console.error('[FeaturedAchievementsSelector] error userAchievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedAchievements = async () => {
    try {
      const response = await api.get('/api/users/profile/featured-achievements');
      console.log('[FeaturedAchievementsSelector] featuredAchievements:', response.data);
      
      if (response.data.success) {
        setFeaturedIds(response.data.featured_achievements || []);
      }
    } catch (error) {
      console.error('[FeaturedAchievementsSelector] error featuredAchievements:', error);
      // Si l'API n'existe pas encore, nous utilisons un tableau vide
      setFeaturedIds([]);
    }
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      
      // Appel à l'API pour sauvegarder les achievements mis en avant
      const response = await api.put('/api/users/profile/featured-achievements', {
        featured_achievements: featuredIds
      });
      
      if (response.data.success) {
        onClose();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des achievements mis en avant:', error);
      // Simuler la sauvegarde si l'API n'existe pas encore
      setTimeout(() => {
        onClose();
      }, 1000);
    } finally {
      setSaving(false);
    }
  };

  const toggleFeatured = (achievementId: string) => {
    if (featuredIds.includes(achievementId)) {
      // Retirer de la sélection
      setFeaturedIds(featuredIds.filter(id => id !== achievementId));
    } else {
      // Ajouter à la sélection si limite non atteinte
      if (featuredIds.length < maxFeatured) {
        setFeaturedIds([...featuredIds, achievementId]);
      }
    }
  };

  const filteredAchievements = userAchievements.filter(userAchievement => {
    const achievement = userAchievement.Achievement;
    
    // Filtre par rareté
    if (filter !== 'all' && achievement.rarity !== filter) {
      return false;
    }
    
    // Filtre par recherche
    if (searchTerm && !achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !achievement.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  if (loading) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" style={{ color: '#ff006e' }} />
            Choisir vos succès à afficher
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" style={{ color: '#ff006e' }} />
          Choisir vos succès à afficher (max {maxFeatured})
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Filtres et recherche */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher un succès..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {(['all', 'common', 'rare', 'epic', 'legendary'] as const).map((rarity) => (
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
        </div>
        
        {/* Compteur de sélection */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-center">
            <span className="font-medium">{featuredIds.length}</span> sur <span className="font-medium">{maxFeatured}</span> succès sélectionnés
          </p>
        </div>
        
        {/* Liste des achievements */}
        {filteredAchievements.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">
              Aucun succès ne correspond à votre recherche
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredAchievements.map((userAchievement) => {
              const achievement = userAchievement.Achievement;
              const config = rarityConfig[achievement.rarity];
              const IconComponent = config.icon;
              const isFeatured = featuredIds.includes(achievement.id);
              
              return (
                <div
                  key={userAchievement.id}
                  className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                    isFeatured ? 'border-purple-400 bg-purple-50' : `${config.bgColor} ${config.borderColor}`
                  }`}
                  onClick={() => toggleFeatured(achievement.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="flex items-start gap-3">
                    {/* Icône & Rareté */}
                    <div className="flex-shrink-0">
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isFeatured ? 'bg-purple-200 border-2 border-purple-400' : ''
                        }`}
                        style={isFeatured ? {} : { backgroundColor: config.color + '20', border: `2px solid ${config.color}` }}
                      >
                        {isFeatured ? (
                          <Check className="w-6 h-6 text-purple-600" />
                        ) : (
                          <IconComponent 
                            className="w-6 h-6" 
                            style={{ color: config.color }} 
                          />
                        )}
                      </div>
                    </div>
                    
                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold text-gray-900 truncate ${isFeatured ? 'text-purple-800' : ''}`}>
                          {achievement.title}
                        </h3>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${isFeatured ? 'text-purple-600 border-purple-300' : config.textColor}`}
                        >
                          {achievement.rarity}
                        </Badge>
                        
                        {isFeatured && (
                          <Badge className="bg-purple-600 text-white text-xs">
                            Sélectionné
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {achievement.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-gray-500">
                          Débloqué le {new Date(userAchievement.unlocked_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Boutons d'action */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          
          <Button 
            onClick={saveChanges}
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedAchievementsSelector;

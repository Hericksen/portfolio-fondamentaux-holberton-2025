import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { PixelAvatar } from './PixelAvatar';
import { DiscreetAvatarCustomizer } from './DiscreetAvatarCustomizer';
import { AllAchievementsDisplay } from './AllAchievementsDisplay';
import { AchievementsPreview } from './AchievementsPreview';
import { FeaturedAchievements } from './FeaturedAchievements';
import { useAdvancedQuests } from '../hooks/useAdvancedQuests';
import { Target, TrendingUp, Trophy, ChevronRight } from 'lucide-react';
import api from '../services/api';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  level: number;
  xp: number;
  streak: number;
  avatar: {
    body?: string;
    outfit?: string;
    accessory?: string;
    color?: string;
    background?: string;
    hair?: string;
    eyes?: string;
  };
  fitness_goals: {
    daily_quests: number;
    weekly_xp: number;
    target_level: number;
    preferred_activities: string[];
  };
  preferences: {
    notification_enabled: boolean;
    difficulty_preference: string;
    quest_reminders: boolean;
    achievement_notifications: boolean;
  };
  stats: {
    total_quests_completed: number;
    total_achievements_unlocked: number;
    best_streak: number;
    total_xp_earned: number;
  };
  total_quests_completed: number;
  last_quest_date: string | null;
  last_login: string | null;
}

export const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFullAchievements, setShowFullAchievements] = useState(false);
  const [showAvatarCustomizer, setShowAvatarCustomizer] = useState(false);
  
  // Hook pour récupérer les statistiques des quêtes
  const { stats: questStats } = useAdvancedQuests();
  const [editData, setEditData] = useState({
    username: '',
    avatar: {
      body: 'default',
      outfit: 'casual',
      accessory: 'none',
      color: '#ff006e',
      background: 'gym',
      hair: 'short',
      eyes: 'normal'
    } as {
      body?: string;
      outfit?: string;
      accessory?: string;
      color?: string;
      background?: string;
      hair?: string;
      eyes?: string;
    },
    fitness_goals: {
      daily_quests: 3,
      weekly_xp: 1000,
      target_level: 10
    }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/users/profile/me');
      if (response.data.success) {
        setProfile(response.data.profile);
        setEditData({
          username: response.data.profile.username,
          avatar: {
            body: response.data.profile.avatar?.body || 'default',
            outfit: response.data.profile.avatar?.outfit || 'casual',
            accessory: response.data.profile.avatar?.accessory || 'none',
            color: response.data.profile.avatar?.color || '#ff006e',
            background: response.data.profile.avatar?.background || 'gym',
            hair: response.data.profile.avatar?.hair || 'short',
            eyes: response.data.profile.avatar?.eyes || 'normal'
          },
          fitness_goals: response.data.profile.fitness_goals
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await api.put('/api/users/profile/me', editData);
      if (response.data.success) {
        setProfile(response.data.profile);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  };

  const calculateXpProgress = () => {
    if (!profile) return 0;
    const currentLevel = profile.level;
    const nextLevelXp = Math.pow(currentLevel, 2) * 100;
    const currentLevelXp = Math.pow(currentLevel - 1, 2) * 100;
    const progressXp = profile.xp - currentLevelXp;
    const totalXpForLevel = nextLevelXp - currentLevelXp;
    return (progressXp / totalXpForLevel) * 100;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Impossible de charger le profil</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header du profil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Profil Utilisateur</span>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
            >
              {isEditing ? 'Annuler' : 'Modifier'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0 relative avatar-container">
              <PixelAvatar 
                avatarData={profile.avatar} 
                size="large"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditing ? (
                  <Input
                    value={editData.username}
                    onChange={(e) => setEditData({
                      ...editData,
                      username: e.target.value
                    })}
                    className="mb-2"
                  />
                ) : (
                  profile.username
                )}
              </h2>
              <p className="text-gray-600">{profile.email}</p>
              <div className="flex items-center space-x-4 mt-3">
                <Badge variant="secondary">
                  Niveau {profile.level}
                </Badge>
                <Badge variant="outline">
                  🔥 {profile.streak} jours
                </Badge>
                <Badge variant="outline">
                  ⭐ {profile.total_quests_completed} quêtes
                </Badge>
                {/* Badge Succès toujours visible */}
                <Badge 
                  variant="secondary" 
                  className="bg-purple-700 hover:bg-purple-800 text-white cursor-pointer px-3 py-1 text-base border-2 border-yellow-400 shadow-lg animate-pulse"
                  onClick={() => setShowFullAchievements(true)}
                  style={{ zIndex: 10 }}
                >
                  🏆 Succès
                </Badge>
                <span style={{color:'red',fontWeight:'bold',fontSize:'1.2em'}}>[DEBUG: UserProfile MONTÉ]</span>
              </div>
              {/* Mini aperçu des achievements */}
              {!isEditing && (
                <>
                  {console.log('[UserProfile] Render FeaturedAchievements')}
                  <FeaturedAchievements 
                    isEditing={isEditing}
                  />
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progression XP */}
      <Card>
        <CardHeader>
          <CardTitle>Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Niveau {profile.level}</span>
                <span>{profile.xp} XP</span>
              </div>
              <Progress value={calculateXpProgress()} className="h-3" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {/* Quêtes actives */}
              <div className="pixel-card" style={{
                background: 'rgba(26, 0, 51, 0.8)',
                border: '2px solid #ff006e',
                boxShadow: '0 8px 32px rgba(255, 0, 110, 0.3)',
                borderRadius: '15px',
                padding: '16px'
              }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold pixel-level" style={{ 
                      fontSize: '1.5rem',
                      color: '#ff006e'
                    }}>{questStats?.total_active || 0}</div>
                    <div className="text-xs font-mono" style={{ color: '#9d4edd' }}>Quêtes actives</div>
                  </div>
                  <Target className="w-6 h-6" style={{ color: '#ff006e' }} />
                </div>
              </div>

              {/* Taux de completion */}
              <div className="pixel-card" style={{
                background: 'rgba(26, 0, 51, 0.8)',
                border: '2px solid #06ffa5',
                boxShadow: '0 8px 32px rgba(6, 255, 165, 0.3)',
                borderRadius: '15px',
                padding: '16px'
              }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold pixel-level" style={{ 
                      fontSize: '1.5rem',
                      color: '#06ffa5'
                    }}>{questStats?.completion_rate || 0}%</div>
                    <div className="text-xs font-mono" style={{ color: '#9d4edd' }}>Taux completion</div>
                  </div>
                  <TrendingUp className="w-6 h-6" style={{ color: '#06ffa5' }} />
                </div>
              </div>

              {/* Série actuelle */}
              <div className="pixel-card" style={{
                background: 'rgba(26, 0, 51, 0.8)',
                border: '2px solid #ffbe0b',
                boxShadow: '0 8px 32px rgba(255, 190, 11, 0.3)',
                borderRadius: '15px',
                padding: '16px'
              }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold pixel-level flex items-center gap-1" style={{ 
                      fontSize: '1.5rem',
                      color: '#ffbe0b'
                    }}>🔥 {questStats?.current_streak || 0}</div>
                    <div className="text-xs font-mono" style={{ color: '#9d4edd' }}>Série actuelle</div>
                  </div>
                  <Trophy className="w-6 h-6" style={{ color: '#ffbe0b' }} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Objectifs Fitness */}
      <Card>
        <CardHeader>
          <CardTitle>Objectifs Fitness</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quêtes Quotidiennes
              </label>
              {isEditing ? (
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={editData.fitness_goals.daily_quests}
                  onChange={(e) => setEditData({
                    ...editData,
                    fitness_goals: {
                      ...editData.fitness_goals,
                      daily_quests: parseInt(e.target.value)
                    }
                  })}
                />
              ) : (
                <div className="text-lg font-semibold">
                  {profile.fitness_goals.daily_quests} par jour
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                XP Hebdomadaire
              </label>
              {isEditing ? (
                <Input
                  type="number"
                  min="100"
                  max="5000"
                  step="100"
                  value={editData.fitness_goals.weekly_xp}
                  onChange={(e) => setEditData({
                    ...editData,
                    fitness_goals: {
                      ...editData.fitness_goals,
                      weekly_xp: parseInt(e.target.value)
                    }
                  })}
                />
              ) : (
                <div className="text-lg font-semibold">
                  {profile.fitness_goals.weekly_xp} XP
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau Cible
              </label>
              {isEditing ? (
                <Input
                  type="number"
                  min={profile.level + 1}
                  max="100"
                  value={editData.fitness_goals.target_level}
                  onChange={(e) => setEditData({
                    ...editData,
                    fitness_goals: {
                      ...editData.fitness_goals,
                      target_level: parseInt(e.target.value)
                    }
                  })}
                />
              ) : (
                <div className="text-lg font-semibold">
                  Niveau {profile.fitness_goals.target_level}
                </div>
              )}
            </div>
          </div>
          
          {/* Activités Préférées */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activités Préférées
            </label>
            <div className="flex flex-wrap gap-2">
              {profile.fitness_goals.preferred_activities.map((activity, index) => (
                <Badge key={index} variant="outline">
                  {activity}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Succès & Achievements */}
      {showFullAchievements ? (
        <AllAchievementsDisplay 
          className="w-full" 
          onClose={() => setShowFullAchievements(false)}
        />
      ) : (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" style={{ color: '#ff006e' }} />
                Tous vos succès
              </div>
              <button
                onClick={() => setShowFullAchievements(true)}
                className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
              >
                Voir tous les succès <ChevronRight size={16} />
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AchievementsPreview 
              maxItems={5}
              onViewAll={() => setShowFullAchievements(true)}
            />
          </CardContent>
        </Card>
      )}
      
      {showFullAchievements && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowFullAchievements(false)}
            className="px-4 py-2 text-sm text-purple-600 hover:text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
          >
            Afficher moins
          </button>
        </div>
      )}

      {/* Bouton de sauvegarde */}
      {isEditing && (
        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
            Sauvegarder les Modifications
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

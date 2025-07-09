import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { 
  Trophy, 
  Award, 
  Star, 
  Crown, 
  Calendar, 
  TrendingUp, 
  Lock, 
  Eye,
  EyeOff,
  Filter,
  Search
} from 'lucide-react';
import api from '../services/api';

interface Achievement {
  id: string;
  title: string;
  description: string;
  condition_type: string;
  condition_value: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  xp_reward: number;
  is_active: boolean;
  unlocked?: boolean;
  progress?: number;
}

interface UserAchievement {
  id: string;
  unlocked_at: string;
  progress: number;
  Achievement: Achievement;
}

interface AllAchievementsDisplayProps {
  userId?: string;
  className?: string;
  onClose?: () => void;
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

const conditionMapping = {
  quest_count: 'Compléter des quêtes',
  streak: 'Maintenir un streak',
  xp_total: 'Gagner de l\'XP',
  level: 'Atteindre un niveau',
  login_days: 'Se connecter',
};

export const AllAchievementsDisplay: React.FC<AllAchievementsDisplayProps> = ({
  userId,
  className = "",
  onClose
}) => {
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [stats, setStats] = useState({
    unlocked: 0,
    total: 0,
    progress: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked' | 'common' | 'rare' | 'epic' | 'legendary'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSecrets, setShowSecrets] = useState(false);

  useEffect(() => {
    fetchAllAchievements();
  }, [userId]);

  const fetchAllAchievements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Récupérer tous les achievements disponibles
      const allResponse = await api.get('/api/achievements');
      
      // Récupérer les achievements de l'utilisateur
      const endpoint = userId 
        ? `/api/achievements/user/${userId}`
        : '/api/achievements/user';
      const userResponse = await api.get(endpoint);
      
      if (allResponse.data.success && userResponse.data.success) {
        // Mapper les ID des achievements débloqués pour une recherche facile
        const unlockedIds = userResponse.data.data.map((ua: UserAchievement) => ua.Achievement.id);
        
        // Marquer les achievements comme débloqués ou verrouillés
        const achievementsWithStatus = allResponse.data.data.map((achievement: Achievement) => ({
          ...achievement,
          unlocked: unlockedIds.includes(achievement.id),
          progress: userResponse.data.data.find((ua: UserAchievement) => 
            ua.Achievement.id === achievement.id
          )?.progress || 0
        }));
        
        setAllAchievements(achievementsWithStatus);
        setUserAchievements(userResponse.data.data);
        setStats({
          unlocked: userResponse.data.stats.unlocked,
          total: allResponse.data.data.length,
          progress: Math.round((userResponse.data.stats.unlocked / allResponse.data.data.length) * 100)
        });
      } else {
        throw new Error(allResponse.data.message || userResponse.data.message || 'Erreur lors du chargement des achievements');
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des achievements:', error);
      setError(error.response?.data?.message || 'Impossible de charger les achievements');
    } finally {
      setLoading(false);
    }
  };

  const filteredAchievements = allAchievements
    .filter(achievement => {
      // Filtrer selon le statut (débloqué/verrouillé)
      if (filter === 'unlocked' && !achievement.unlocked) return false;
      if (filter === 'locked' && achievement.unlocked) return false;
      
      // Filtrer selon la rareté
      if (['common', 'rare', 'epic', 'legendary'].includes(filter) && achievement.rarity !== filter) return false;
      
      // Cacher les achievements secrets sauf si l'option est activée ou s'ils sont débloqués
      if (!showSecrets && !achievement.unlocked && achievement.description.includes('Secret')) return false;
      
      // Filtrer par recherche
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          achievement.title.toLowerCase().includes(searchLower) ||
          achievement.description.toLowerCase().includes(searchLower) ||
          achievement.condition_type.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
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
            Liste des Succès Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="pixel-spinner mr-4"></div>
            <span className="font-mono" style={{ color: '#9d4edd' }}>Chargement des succès...</span>
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
            Liste des Succès Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={fetchAllAchievements}
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
    <Card className={`${className} pixel-card`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" style={{ color: '#ff006e' }} />
            Liste des Succès Disponibles
          </div>
          {onClose && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
            >
              Afficher moins
            </Button>
          )}
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

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un succès..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => setShowSecrets(!showSecrets)}
            >
              {showSecrets ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  <span className="hidden sm:inline">Cacher secrets</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Voir secrets</span>
                </>
              )}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => {
                const nextFilter = filter === 'all' 
                  ? 'unlocked' 
                  : filter === 'unlocked' 
                    ? 'locked' 
                    : 'all' as 'all' | 'unlocked' | 'locked' | 'common' | 'rare' | 'epic' | 'legendary';
                
                setFilter(nextFilter);
              }}
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">
                {filter === 'all' ? 'Tous' : filter === 'unlocked' ? 'Débloqués' : filter === 'locked' ? 'Verrouillés' : filter}
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Filtres par rareté */}
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
              Aucun succès trouvé avec les filtres actuels
            </p>
            <Button
              onClick={() => {
                setFilter('all');
                setSearchTerm('');
              }}
              variant="outline"
              className="mt-4"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAchievements.map((achievement) => {
              const config = rarityConfig[achievement.rarity];
              const IconComponent = config.icon;
              const userAchievement = userAchievements.find(ua => ua.Achievement.id === achievement.id);
              const isUnlocked = !!userAchievement;
              
              return (
                <div
                  key={achievement.id}
                  className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                    isUnlocked 
                      ? config.bgColor + ' ' + config.borderColor
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icône & Rareté */}
                    <div className="flex-shrink-0">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center relative"
                        style={{ 
                          backgroundColor: isUnlocked ? config.color + '20' : 'rgba(0,0,0,0.05)', 
                          border: isUnlocked ? `2px solid ${config.color}` : '2px solid #ccc'
                        }}
                      >
                        {isUnlocked ? (
                          <IconComponent 
                            className="w-6 h-6" 
                            style={{ color: config.color }} 
                          />
                        ) : (
                          <Lock className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold truncate ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                          {achievement.title}
                          {achievement.description.includes('Secret') && !isUnlocked && (
                            <span className="italic ml-2 text-gray-400">(secret)</span>
                          )}
                        </h3>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${isUnlocked ? config.textColor : 'text-gray-400'}`}
                        >
                          {achievement.rarity}
                        </Badge>
                      </div>
                      
                      <p className={`text-sm mb-2 ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                        {achievement.description.includes('Secret') && !isUnlocked && !showSecrets
                          ? '??? Succès secret ???'
                          : achievement.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center justify-between text-xs gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {conditionMapping[achievement.condition_type as keyof typeof conditionMapping] || achievement.condition_type}: {achievement.condition_value}
                          </Badge>
                          
                          <span className="flex items-center gap-1 text-blue-500">
                            <TrendingUp className="w-3 h-3" />
                            +{achievement.xp_reward} XP
                          </span>
                        </div>
                        
                        {isUnlocked && (
                          <span className="flex items-center gap-1 text-green-500">
                            <Calendar className="w-3 h-3" />
                            {formatDate(userAchievement.unlocked_at)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Résumé par rareté */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold mb-3 text-gray-700">Résumé par rareté</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(rarityConfig).map(([rarity, config]) => {
              const total = allAchievements.filter(a => a.rarity === rarity).length;
              const unlocked = allAchievements.filter(a => a.rarity === rarity && a.unlocked).length;
              const IconComponent = config.icon;
              
              return (
                <div key={rarity} className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <IconComponent 
                      className="w-4 h-4 mr-1" 
                      style={{ color: config.color }} 
                    />
                    <span className="text-xs font-medium capitalize">
                      {rarity}
                    </span>
                  </div>
                  <div className="text-lg font-bold" style={{ color: config.color }}>
                    {unlocked}/{total}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AllAchievementsDisplay;

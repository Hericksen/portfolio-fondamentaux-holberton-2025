import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useAdvancedQuests } from '../hooks/useAdvancedQuests';
import { 
  Sword, 
  ArrowRight, 
  Target, 
  Trophy, 
  Calendar,
  TrendingUp
} from 'lucide-react';

interface QuestWidgetProps {
  className?: string;
}

export const QuestWidget: React.FC<QuestWidgetProps> = ({ }) => {
  const { activeQuests, stats, loading } = useAdvancedQuests();

  if (loading) {
    return (
      <div className="pixel-card" style={{
        background: 'rgba(26, 0, 51, 0.8)',
        border: '2px solid #ff006e',
        boxShadow: '0 8px 32px rgba(255, 0, 110, 0.3)',
        borderRadius: '15px',
        padding: '25px'
      }}>
        <div className="flex items-center justify-center p-6">
          <div className="pixel-spinner"></div>
          <span className="ml-3 font-mono" style={{ color: '#9d4edd' }}>Chargement des quêtes...</span>
        </div>
      </div>
    );
  }

  const totalQuests = stats?.total_active || 0;
  const completionRate = stats?.completion_rate || 0;
  const currentStreak = stats?.current_streak || 0;

  // Obtenir les 3 prochaines quêtes à compléter
  const upcomingQuests = [
    ...activeQuests.daily.slice(0, 2),
    ...activeQuests.weekly.slice(0, 1)
  ].slice(0, 3);

  return (
    <div className="pixel-card" style={{
      background: 'rgba(26, 0, 51, 0.8)',
      border: '2px solid #ff006e',
      boxShadow: '0 8px 32px rgba(255, 0, 110, 0.3)',
      borderRadius: '15px',
      padding: '25px'
    }}>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sword className="w-5 h-5" style={{ color: '#ff006e' }} />
            <h3 className="pixel-title" style={{ 
              color: '#ff006e', 
              fontSize: '1.4rem',
              fontWeight: 'bold'
            }}>
              Quêtes Actives
            </h3>
          </div>
          <Link to="/quests">
            <Button 
              variant="outline" 
              size="sm"
              className="cyberpunk-btn pixel-btn font-pixel"
              style={{
                background: 'transparent',
                border: '2px solid #8338ec',
                color: '#8338ec',
                fontSize: '0.8rem'
              }}
            >
              Voir tout
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-3 data-panel" style={{
            background: 'rgba(26, 0, 51, 0.6)',
            border: '1px solid #8338ec',
            borderRadius: '8px'
          }}>
            <div className="text-lg font-bold pixel-level" style={{ 
              fontSize: '1.5rem',
              color: '#ff006e'
            }}>{totalQuests}</div>
            <div className="text-xs font-mono" style={{ color: '#9d4edd' }}>Actives</div>
          </div>
          <div className="text-center p-3 data-panel" style={{
            background: 'rgba(26, 0, 51, 0.6)',
            border: '1px solid #8338ec',
            borderRadius: '8px'
          }}>
            <div className="text-lg font-bold pixel-level" style={{ 
              fontSize: '1.5rem',
              color: '#06ffa5'
            }}>{completionRate}%</div>
            <div className="text-xs font-mono" style={{ color: '#9d4edd' }}>Taux</div>
          </div>
          <div className="text-center p-3 data-panel" style={{
            background: 'rgba(26, 0, 51, 0.6)',
            border: '1px solid #8338ec',
            borderRadius: '8px'
          }}>
            <div className="text-lg font-bold pixel-level flex items-center justify-center gap-1" style={{ 
              fontSize: '1.5rem',
              color: '#ffbe0b'
            }}>
              🔥 {currentStreak}
            </div>
            <div className="text-xs font-mono" style={{ color: '#9d4edd' }}>Série</div>
          </div>
        </div>

        {/* Répartition par type */}
        <div className="space-y-2">
          <div className="text-sm font-medium font-pixel" style={{ color: '#ffffff' }}>Répartition</div>
          <div className="flex gap-2 flex-wrap">
            <Badge className="pixel-badge-enhanced" style={{
              background: 'rgba(255, 190, 11, 0.2)',
              border: '1px solid #ffbe0b',
              color: '#ffbe0b'
            }}>
              <Calendar className="w-3 h-3 mr-1" />
              {stats?.by_type.daily || 0} Quotidiennes
            </Badge>
            <Badge className="pixel-badge-enhanced" style={{
              background: 'rgba(131, 56, 236, 0.2)',
              border: '1px solid #8338ec',
              color: '#8338ec'
            }}>
              <Target className="w-3 h-3 mr-1" />
              {stats?.by_type.weekly || 0} Hebdo
            </Badge>
            <Badge className="pixel-badge-enhanced" style={{
              background: 'rgba(6, 255, 165, 0.2)',
              border: '1px solid #06ffa5',
              color: '#06ffa5'
            }}>
              <Trophy className="w-3 h-3 mr-1" />
              {stats?.by_type.monthly || 0} Mensuel
            </Badge>
          </div>
        </div>

        {/* Prochaines quêtes */}
        {upcomingQuests.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium font-pixel" style={{ color: '#ffffff' }}>Prochaines quêtes</div>
            <div className="space-y-2">
              {upcomingQuests.map((quest) => (
                <div
                  key={quest.id}
                  className="flex items-center justify-between p-3 data-panel"
                  style={{
                    background: 'rgba(26, 0, 51, 0.6)',
                    border: '1px solid #8338ec',
                    borderRadius: '8px'
                  }}
                >
                  <div className="flex-1">
                    <div className="font-medium font-pixel" style={{ color: '#ff006e' }}>{quest.quest.title}</div>
                    <div className="text-xs font-mono" style={{ color: '#9d4edd' }}>
                      {quest.quest.xp_reward} XP • {quest.quest.difficulty}
                    </div>
                  </div>
                  <Badge 
                    className="text-xs pixel-badge-enhanced"
                    style={{
                      background: 'rgba(131, 56, 236, 0.2)',
                      border: '1px solid #8338ec',
                      color: '#8338ec'
                    }}
                  >
                    {quest.quest.type}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message si pas de quêtes */}
        {totalQuests === 0 && (
          <div className="text-center py-4" style={{ color: '#9d4edd' }}>
            <Sword className="w-8 h-8 mx-auto mb-2 opacity-50" style={{ color: '#ff006e' }} />
            <p className="text-sm font-mono">Aucune quête active</p>
            <p className="text-xs font-mono">Les quêtes se renouvellent automatiquement</p>
          </div>
        )}

        {/* Lien vers la page complète */}
        <Link to="/quests">
          <Button 
            className="w-full cyberpunk-btn pixel-btn font-pixel"
            style={{
              background: 'transparent',
              border: '2px solid #06ffa5',
              color: '#06ffa5',
              fontSize: '0.9rem',
              padding: '12px'
            }}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Voir toutes les quêtes
          </Button>
        </Link>
      </div>
    </div>
  );
};

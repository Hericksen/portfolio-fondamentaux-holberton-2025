import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAdvancedQuests } from '../hooks/useAdvancedQuests';
import { QuestCard } from './QuestCard';
import { CycleOverview } from './CycleOverview';
import { 
  Sword, 
  Target, 
  Trophy, 
  Calendar, 
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Clock
} from 'lucide-react';

export const AdvancedQuestsDashboard: React.FC = () => {
  const {
    activeQuests,
    stats,
    cycles,
    loading,
    error,
    refreshQuests,
    completeQuest,
    loadCycles
  } = useAdvancedQuests();

  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('all');

  const handleRefresh = async () => {
    await refreshQuests();
    await loadCycles();
  };

  const getQuestsForTab = () => {
    if (activeTab === 'all') {
      return [
        ...activeQuests.daily,
        ...activeQuests.weekly,
        ...activeQuests.monthly,
        ...activeQuests.special
      ];
    }
    return activeQuests[activeTab] || [];
  };

  const tabLabels = {
    all: 'Toutes',
    daily: 'Quotidiennes',
    weekly: 'Hebdomadaires',
    monthly: 'Mensuelles'
  };

  const tabIcons = {
    all: Sword,
    daily: Calendar,
    weekly: Target,
    monthly: Trophy
  };

  return (
    <div className="space-y-6 p-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 pixel-title neon-text">
            <Sword className="w-6 h-6" style={{ color: '#ff006e' }} />
            Quêtes Avancées
          </h1>
          <p className="font-mono mt-1" style={{ color: '#9d4edd' }}>
            Système de quêtes avec cycles temporels
          </p>
        </div>
        
        <Button 
          onClick={handleRefresh} 
          disabled={loading}
          className="cyberpunk-btn pixel-btn font-pixel"
          style={{
            background: 'transparent',
            border: '2px solid #8338ec',
            color: '#8338ec'
          }}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Erreur */}
      {error && (
        <div className="pixel-card" style={{
          background: 'rgba(255, 0, 110, 0.1)',
          border: '2px solid #ff006e',
          borderRadius: '15px',
          padding: '20px'
        }}>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" style={{ color: '#ff006e' }} />
            <span className="font-mono" style={{ color: '#ff006e' }}>{error}</span>
          </div>
        </div>
      )}

      {/* Statistiques globales */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="pixel-card" style={{
            background: 'rgba(26, 0, 51, 0.8)',
            border: '2px solid #ff006e',
            boxShadow: '0 8px 32px rgba(255, 0, 110, 0.3)',
            borderRadius: '15px',
            padding: '20px'
          }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold pixel-level" style={{ 
                  fontSize: '2rem',
                  color: '#ff006e'
                }}>{stats.total_active}</div>
                <div className="text-sm font-mono" style={{ color: '#9d4edd' }}>Quêtes actives</div>
              </div>
              <Target className="w-8 h-8" style={{ color: '#ff006e' }} />
            </div>
          </div>

          <div className="pixel-card" style={{
            background: 'rgba(26, 0, 51, 0.8)',
            border: '2px solid #06ffa5',
            boxShadow: '0 8px 32px rgba(6, 255, 165, 0.3)',
            borderRadius: '15px',
            padding: '20px'
          }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold pixel-level" style={{ 
                  fontSize: '2rem',
                  color: '#06ffa5'
                }}>{stats.completion_rate}%</div>
                <div className="text-sm font-mono" style={{ color: '#9d4edd' }}>Taux completion</div>
              </div>
              <TrendingUp className="w-8 h-8" style={{ color: '#06ffa5' }} />
            </div>
          </div>

          <div className="pixel-card" style={{
            background: 'rgba(26, 0, 51, 0.8)',
            border: '2px solid #ffbe0b',
            boxShadow: '0 8px 32px rgba(255, 190, 11, 0.3)',
            borderRadius: '15px',
            padding: '20px'
          }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold pixel-level flex items-center gap-1" style={{ 
                  fontSize: '2rem',
                  color: '#ffbe0b'
                }}>🔥 {stats.current_streak}</div>
                <div className="text-sm font-mono" style={{ color: '#9d4edd' }}>Série actuelle</div>
              </div>
              <Trophy className="w-8 h-8" style={{ color: '#ffbe0b' }} />
            </div>
          </div>

          <div className="pixel-card" style={{
            background: 'rgba(26, 0, 51, 0.8)',
            border: '2px solid #8338ec',
            boxShadow: '0 8px 32px rgba(131, 56, 236, 0.3)',
            borderRadius: '15px',
            padding: '20px'
          }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold pixel-level" style={{ 
                  fontSize: '2rem',
                  color: '#8338ec'
                }}>{cycles.length}</div>
                <div className="text-sm font-mono" style={{ color: '#9d4edd' }}>Cycles actifs</div>
              </div>
              <Clock className="w-8 h-8" style={{ color: '#8338ec' }} />
            </div>
          </div>
        </div>
      )}

      {/* Cycles actifs */}
      <CycleOverview cycles={cycles} />

      {/* Onglets des quêtes */}
      <div className="pixel-card" style={{
        background: 'rgba(26, 0, 51, 0.8)',
        border: '2px solid #ff006e',
        boxShadow: '0 8px 32px rgba(255, 0, 110, 0.3)',
        borderRadius: '15px',
        padding: '25px'
      }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="pixel-title" style={{ 
            color: '#ff006e', 
            fontSize: '1.4rem',
            fontWeight: 'bold'
          }}>Mes Quêtes</h3>
          
          <div className="flex gap-1">
            {Object.entries(tabLabels).map(([key, label]) => {
              const Icon = tabIcons[key as keyof typeof tabIcons];
              const isActive = activeTab === key;
              const count = key === 'all' 
                ? stats?.total_active || 0
                : stats?.by_type[key as keyof typeof stats.by_type] || 0;
              
              return (
                <Button
                  key={key}
                  size="sm"
                  onClick={() => setActiveTab(key as typeof activeTab)}
                  className={`flex items-center gap-1 cyberpunk-btn pixel-btn font-pixel ${
                    isActive ? 'active' : ''
                  }`}
                  style={{
                    background: isActive ? 'rgba(255, 0, 110, 0.2)' : 'transparent',
                    border: `2px solid ${isActive ? '#ff006e' : '#8338ec'}`,
                    color: isActive ? '#ff006e' : '#8338ec',
                    fontSize: '0.8rem'
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  {count > 0 && (
                    <Badge 
                      className="ml-1 text-xs pixel-badge-enhanced"
                      style={{
                        background: 'rgba(255, 190, 11, 0.2)',
                        border: '1px solid #ffbe0b',
                        color: '#ffbe0b',
                        fontSize: '0.7rem'
                      }}
                    >
                      {count}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="pixel-spinner mr-4"></div>
              <span className="font-mono" style={{ color: '#9d4edd' }}>Chargement des quêtes...</span>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getQuestsForTab().map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onComplete={completeQuest}
                />
              ))}
            </div>
          )}

          {!loading && getQuestsForTab().length === 0 && (
            <div className="text-center py-8" style={{ color: '#9d4edd' }}>
              <Sword className="w-12 h-12 mx-auto mb-2 opacity-50" style={{ color: '#ff006e' }} />
              <p className="font-mono">Aucune quête disponible dans cette catégorie</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

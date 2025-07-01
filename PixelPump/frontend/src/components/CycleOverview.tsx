import React from 'react';
import { Badge } from './ui/badge';
import type { QuestCycle } from '../services/api';
import { 
  Clock, 
  Calendar,
  Target,
  Trophy,
  BarChart3
} from 'lucide-react';

interface CycleOverviewProps {
  cycles: QuestCycle[];
  className?: string;
}

const typeIcons = {
  daily: Calendar,
  weekly: Target,
  monthly: Trophy
};

const typeLabels = {
  daily: 'Quotidien',
  weekly: 'Hebdomadaire',
  monthly: 'Mensuel'
};

const formatTimeRemaining = (hours: number): string => {
  if (hours < 1) return 'Moins d\'1h';
  if (hours < 24) return `${Math.round(hours)}h`;
  if (hours < 168) return `${Math.round(hours / 24)}j`;
  return `${Math.round(hours / 168)}sem`;
};

export const CycleOverview: React.FC<CycleOverviewProps> = ({ cycles, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5" style={{ color: '#ff006e' }} />
        <h3 className="pixel-title font-pixel" style={{ 
          color: '#ff006e',
          fontSize: '1.4rem',
          fontWeight: 'bold'
        }}>Cycles Actifs</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cycles.map((cycle) => {
          const Icon = typeIcons[cycle.type as keyof typeof typeIcons];
          const label = typeLabels[cycle.type as keyof typeof typeLabels];
          
          return (
            <div
              key={cycle.id}
              className="pixel-card"
              style={{
                background: 'rgba(26, 0, 51, 0.8)',
                border: '2px solid #8338ec',
                boxShadow: '0 8px 32px rgba(131, 56, 236, 0.3)',
                borderRadius: '15px',
                padding: '20px'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5" style={{ color: '#8338ec' }} />
                  <div className="font-pixel" style={{ color: '#8338ec', fontSize: '1.1rem' }}>
                    {label}
                  </div>
                </div>
                <Badge 
                  className="pixel-badge-enhanced"
                  style={{
                    background: cycle.is_active 
                      ? 'rgba(6, 255, 165, 0.2)' 
                      : 'rgba(255, 0, 110, 0.2)',
                    border: cycle.is_active 
                      ? '1px solid #06ffa5' 
                      : '1px solid #ff006e',
                    color: cycle.is_active ? '#06ffa5' : '#ff006e'
                  }}
                >
                  {cycle.is_active ? 'Actif' : 'Inactif'}
                </Badge>
              </div>

              <div className="space-y-3">
                {/* Statistiques */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center p-3 data-panel" style={{
                    background: 'rgba(26, 0, 51, 0.6)',
                    border: '1px solid #8338ec',
                    borderRadius: '8px'
                  }}>
                    <div className="font-semibold text-lg pixel-level" style={{ 
                      fontSize: '1.5rem',
                      color: '#ff006e'
                    }}>{cycle.quest_count}</div>
                    <div className="text-xs font-mono" style={{ color: '#9d4edd' }}>Quêtes</div>
                  </div>
                  <div className="text-center p-3 data-panel" style={{
                    background: 'rgba(26, 0, 51, 0.6)',
                    border: '1px solid #8338ec',
                    borderRadius: '8px'
                  }}>
                    <div className="font-semibold text-lg pixel-level" style={{ 
                      fontSize: '1.5rem',
                      color: '#06ffa5'
                    }}>{cycle.completed_count}</div>
                    <div className="text-xs font-mono" style={{ color: '#9d4edd' }}>Complétées</div>
                  </div>
                </div>

                {/* Progression */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono" style={{ color: '#ffffff' }}>
                    <span>Progression</span>
                    <span>{cycle.completion_rate}%</span>
                  </div>
                  <div className="pixel-progress">
                    <div 
                      className="pixel-progress-bar h-2" 
                      style={{ 
                        width: `${cycle.completion_rate}%`,
                        background: 'linear-gradient(90deg, #8338ec, #06ffa5)'
                      }}
                    />
                  </div>
                </div>

                {/* Temps restant */}
                <div className="flex items-center gap-2 text-xs font-mono" style={{ color: '#9d4edd' }}>
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeRemaining(cycle.time_remaining)} restant</span>
                </div>

                {/* Dates */}
                <div className="text-xs font-mono" style={{ color: '#9d4edd' }}>
                  <div>Début: {new Date(cycle.start_date).toLocaleDateString('fr-FR')}</div>
                  <div>Fin: {new Date(cycle.end_date).toLocaleDateString('fr-FR')}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {cycles.length === 0 && (
        <div className="pixel-card" style={{
          background: 'rgba(26, 0, 51, 0.8)',
          border: '2px solid #8338ec',
          boxShadow: '0 8px 32px rgba(131, 56, 236, 0.3)',
          borderRadius: '15px',
          padding: '40px'
        }}>
          <div className="text-center" style={{ color: '#9d4edd' }}>
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" style={{ color: '#ff006e' }} />
            <p className="font-mono">Aucun cycle actif</p>
          </div>
        </div>
      )}
    </div>
  );
};

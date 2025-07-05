import React from 'react';
import { Card, CardContent, CardDescription, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import type { UserQuest } from '../services/api';
import { 
  Clock, 
  Target, 
  Trophy, 
  Calendar,
  CheckCircle2,
  PlayCircle
} from 'lucide-react';

interface QuestCardProps {
  quest: UserQuest;
  onComplete: (questId: string, progress: Record<string, any>) => Promise<boolean>;
  compact?: boolean;
}

const difficultyColors = {
  easy: { bg: 'rgba(34, 197, 94, 0.2)', border: '#22c55e', text: '#4ade80' },
  medium: { bg: 'rgba(59, 130, 246, 0.2)', border: '#3b82f6', text: '#60a5fa' },
  hard: { bg: 'rgba(249, 115, 22, 0.2)', border: '#f97316', text: '#fb923c' },
  epic: { bg: 'rgba(147, 51, 234, 0.2)', border: '#9333ea', text: '#a855f7' }
};

const typeStyles = {
  daily: { 
    bg: 'rgba(255, 193, 7, 0.15)', 
    border: '#ffc107', 
    text: '#ffd54f',
    icon: Calendar,
    label: 'Quotidienne'
  },
  weekly: { 
    bg: 'rgba(0, 188, 212, 0.15)', 
    border: '#00bcd4', 
    text: '#4dd0e1',
    icon: Target,
    label: 'Hebdomadaire'
  },
  monthly: { 
    bg: 'rgba(76, 175, 80, 0.15)', 
    border: '#4caf50', 
    text: '#81c784',
    icon: Trophy,
    label: 'Mensuelle'
  },
  special: { 
    bg: 'rgba(233, 30, 99, 0.15)', 
    border: '#e91e63', 
    text: '#f06292',
    icon: Trophy,
    label: 'Spéciale'
  }
};

const formatTimeRemaining = (timeMs: number): string => {
  if (timeMs === Infinity || timeMs > 31536000000) return 'Permanent'; // Plus d'1 an
  if (timeMs <= 0) return 'Expiré';
  
  const totalSeconds = Math.floor(timeMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}j ${remainingHours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  } else {
    return `${seconds}s`;
  }
};

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onComplete, compact = false }) => {
  const [isCompleting, setIsCompleting] = React.useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      const progress = {
        action: quest.quest.requirements.action,
        count: quest.quest.requirements.count,
        completed: true
      };
      
      const success = await onComplete(quest.id, progress);
      if (success) {
        // Quest completed successfully
      }
    } catch (error) {
      console.error('Erreur lors de la complétion:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const progressPercentage = quest.quest.requirements.count > 0 
    ? ((quest.progress?.count || 0) / quest.quest.requirements.count) * 100
    : 0;

  const typeStyle = typeStyles[quest.quest.type as keyof typeof typeStyles];
  const difficultyColor = difficultyColors[quest.quest.difficulty as keyof typeof difficultyColors];
  const TypeIcon = typeStyle.icon;

  return (
    <Card className={`quest-card pixel-card relative transition-all duration-300 hover:shadow-lg overflow-hidden ${
      compact ? 'h-auto min-h-[240px]' : 'h-auto min-h-[260px] max-h-[300px]'
    }`} style={{
      background: 'rgba(26, 0, 51, 0.9)',
      border: `2px solid ${typeStyle.border}`,
      boxShadow: `0 8px 32px ${typeStyle.bg}`,
      borderRadius: '15px'
    }}>
      {/* Header avec type et difficulté */}
      <div className="relative px-3 py-2" style={{
        background: typeStyle.bg,
        borderBottom: `1px solid ${typeStyle.border}`
      }}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <TypeIcon className="w-3 h-3" style={{ color: typeStyle.text }} />
            <Badge 
              className="quest-type-badge text-xs font-pixel border"
              style={{
                background: typeStyle.bg,
                border: `1px solid ${typeStyle.border}`,
                color: typeStyle.text,
                fontSize: '0.6rem',
                padding: '1px 4px'
              }}
            >
              {typeStyle.label}
            </Badge>
          </div>
          <Badge 
            className="quest-type-badge text-xs font-pixel border"
            style={{
              background: difficultyColor.bg,
              border: `1px solid ${difficultyColor.border}`,
              color: difficultyColor.text,
              fontSize: '0.6rem',
              padding: '1px 4px'
            }}
          >
            {quest.quest.difficulty.toUpperCase()}
          </Badge>
        </div>
        
        <CardTitle className="font-pixel text-sm leading-tight" style={{ 
          color: '#ffffff',
          fontSize: '0.9rem',
          lineHeight: '1.2',
          height: '2rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {quest.quest.title}
        </CardTitle>
      </div>

      <CardContent className="p-3 flex flex-col justify-between h-full" style={{ minHeight: 'calc(100% - 65px)' }}>
        <div className="space-y-2 flex-shrink-1 overflow-hidden">
          {/* Description */}
          <CardDescription 
            className="text-xs font-mono leading-snug"
            style={{ 
              color: '#9d4edd',
              height: '2rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '0.75rem',
              lineHeight: '1.2'
            }}
          >
            {quest.quest.description}
          </CardDescription>

          {/* Récompense XP */}
          <div className="flex items-center justify-center py-1 px-2 rounded-md" style={{
            background: 'rgba(255, 0, 110, 0.15)',
            border: '1px solid #ff006e'
          }}>
            <Trophy className="w-3 h-3 mr-1" style={{ color: '#ff006e' }} />
            <span className="font-pixel text-sm font-bold" style={{ color: '#ff006e' }}>
              {quest.quest.xp_reward} XP
            </span>
            {quest.streak_bonus > 0 && (
              <span className="ml-1 text-xs" style={{ color: '#ffbe0b' }}>
                🔥 +{quest.streak_bonus}
              </span>
            )}
          </div>

          {/* Progression */}
          {quest.quest.requirements.count > 1 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono" style={{ color: '#ffffff' }}>
                <span>Progression</span>
                <span>{quest.progress?.count || 0} / {quest.quest.requirements.count}</span>
              </div>
              <div className="quest-progress h-1.5 rounded-full overflow-hidden" style={{
                background: 'rgba(26, 0, 51, 0.8)',
                border: '1px solid #8338ec'
              }}>
                <div 
                  className="h-full transition-all duration-300"
                  style={{ 
                    width: `${progressPercentage}%`,
                    background: `linear-gradient(90deg, ${typeStyle.border}, #ff006e)`
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer avec temps et action - toujours visible */}
        <div className="flex-shrink-0 space-y-2 mt-2 pt-2 border-t" style={{ 
          borderColor: 'rgba(157, 78, 221, 0.3)',
          minHeight: '60px'
        }}>
          {/* Temps restant */}
          <div className="flex items-center justify-center gap-1 text-xs font-mono" style={{ 
            color: quest.time_remaining <= 7200000 ? '#ff1744' :      // Moins de 2h (rouge)
                   quest.time_remaining <= 43200000 ? '#ff9800' :     // Moins de 12h (orange)
                   quest.time_remaining <= 86400000 ? '#ffc107' :     // Moins de 24h (jaune)
                   '#9d4edd'                                          // Plus de 24h (violet)
          }}>
            <Clock className="w-3 h-3" />
            <span>{formatTimeRemaining(quest.time_remaining)}</span>
            {quest.time_remaining <= 7200000 && quest.time_remaining > 0 && (      // Moins de 2h
              <span className="animate-pulse">⚠️</span>
            )}
            {quest.time_remaining <= 0 && (
              <span className="animate-pulse">❌</span>
            )}
          </div>

          {/* Bouton d'action */}
          <Button
            size="sm"
            onClick={handleComplete}
            disabled={isCompleting}
            className="quest-complete-btn w-full cyberpunk-btn pixel-btn font-pixel"
            style={{
              background: isCompleting ? 'rgba(255, 0, 110, 0.3)' : 'transparent',
              border: '2px solid #ff006e',
              color: '#ff006e',
              fontSize: '0.75rem',
              height: '28px',
              borderRadius: '6px',
              padding: '0 8px',
              flexShrink: 0
            }}
          >
            {isCompleting ? (
              <>
                <PlayCircle className="w-3 h-3 mr-1 animate-spin" />
                En cours...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Compléter
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

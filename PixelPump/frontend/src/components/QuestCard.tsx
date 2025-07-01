import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
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
  easy: 'bg-green-500/20 text-green-400 border-green-500',
  medium: 'bg-blue-500/20 text-blue-400 border-blue-500',
  hard: 'bg-orange-500/20 text-orange-400 border-orange-500',
  epic: 'bg-purple-500/20 text-purple-400 border-purple-500'
};

const typeColors = {
  daily: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
  weekly: 'bg-cyan-500/20 text-cyan-400 border-cyan-500',
  monthly: 'bg-emerald-500/20 text-emerald-400 border-emerald-500',
  special: 'bg-pink-500/20 text-pink-400 border-pink-500'
};

const formatTimeRemaining = (hours: number): string => {
  if (hours < 1) return 'Moins d\'1h';
  if (hours < 24) return `${Math.round(hours)}h`;
  if (hours < 168) return `${Math.round(hours / 24)}j`;
  return `${Math.round(hours / 168)}sem`;
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

  return (
    <Card className={`pixel-card relative transition-all duration-300 hover:shadow-lg ${
      compact ? 'p-3' : ''
    }`} style={{
      background: 'rgba(26, 0, 51, 0.8)',
      border: '2px solid #ff006e',
      boxShadow: '0 8px 32px rgba(255, 0, 110, 0.3)',
    }}>
      <CardHeader className={compact ? 'pb-2' : ''}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className={`flex items-center gap-2 font-pixel text-white ${
                compact ? 'text-sm' : 'text-base'
              }`} style={{ color: '#ff006e' }}>
                {quest.quest.type === 'daily' && <Calendar className="w-4 h-4" />}
                {quest.quest.type === 'weekly' && <Target className="w-4 h-4" />}
                {quest.quest.type === 'monthly' && <Trophy className="w-4 h-4" />}
                {quest.quest.title}
              </CardTitle>
              <Badge className={`text-xs pixel-badge-enhanced ${typeColors[quest.quest.type as keyof typeof typeColors]}`}>
                {quest.quest.type}
              </Badge>
            </div>
            <CardDescription className={`${compact ? 'text-xs' : 'text-sm'} font-mono`} style={{ color: '#9d4edd' }}>
              {quest.quest.description}
            </CardDescription>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <Badge className={`text-xs pixel-badge-enhanced ${difficultyColors[quest.quest.difficulty as keyof typeof difficultyColors]}`}>
              {quest.quest.difficulty}
            </Badge>
            <div className="flex items-center gap-1 text-xs" style={{ color: '#9d4edd' }}>
              <Trophy className="w-3 h-3" />
              {quest.quest.xp_reward} XP
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className={compact ? 'pt-0' : ''}>
        <div className="space-y-3">
          {/* Progression */}
          {quest.quest.requirements.count > 1 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono" style={{ color: '#ffffff' }}>
                <span>Progression</span>
                <span>{quest.progress?.count || 0} / {quest.quest.requirements.count}</span>
              </div>
              <div className="pixel-progress">
                <div 
                  className="pixel-progress-bar h-2" 
                  style={{ 
                    width: `${progressPercentage}%`,
                    background: 'linear-gradient(90deg, #ff006e, #8338ec)'
                  }}
                />
              </div>
            </div>
          )}

          {/* Temps restant */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono" style={{ color: '#9d4edd' }}>
              <Clock className="w-3 h-3" />
              <span>Expire dans {formatTimeRemaining(quest.time_remaining)}</span>
            </div>

            {/* Streak bonus */}
            {quest.streak_bonus > 0 && (
              <div className="flex items-center gap-1 text-xs" style={{ color: '#ffbe0b' }}>
                <span>🔥 +{quest.streak_bonus}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleComplete}
              disabled={isCompleting}
              className="flex-1 cyberpunk-btn pixel-btn font-pixel"
              style={{
                background: isCompleting ? 'rgba(255, 0, 110, 0.2)' : 'transparent',
                border: '2px solid #ff006e',
                color: '#ff006e',
                fontSize: '0.8rem'
              }}
            >
              {isCompleting ? (
                <>
                  <PlayCircle className="w-4 h-4 mr-1 animate-spin" />
                  Complétion...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Compléter
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

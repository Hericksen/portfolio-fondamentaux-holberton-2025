import React, { useState } from 'react';
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
    icon: Clock,
    label: 'Hebdomadaire'
  },
  monthly: { 
    bg: 'rgba(156, 39, 176, 0.15)', 
    border: '#9c27b0', 
    text: '#ba68c8',
    icon: Trophy,
    label: 'Mensuelle'
  },
  special: { 
    bg: 'rgba(255, 87, 34, 0.15)', 
    border: '#ff5722', 
    text: '#ff8a65',
    icon: Target,
    label: 'Spéciale'
  }
};

const QuestCard: React.FC<QuestCardProps> = ({ quest, onComplete, compact = false }) => {
  const [isCompleting, setIsCompleting] = useState(false);

  // Support pour les deux formats de données (Quest et quest)
  const questData = (quest as any).Quest || (quest as any).quest || quest;

  // Vérification de sécurité
  if (!questData) {
    console.warn('QuestCard: questData is undefined', quest);
    return null;
  }

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      const progress = {
        action: questData.requirements?.action || 'complete',
        count: questData.requirements?.count || 1,
        completed: true
      };
      
      // Utiliser l'ID de la UserQuest, pas l'ID du template
      const userQuestId = quest.id;
      console.log('🎯 QuestCard: Début de complétion pour UserQuest ID:', userQuestId);
      console.log('🎯 QuestCard: Template ID:', questData.id);
      console.log('🎯 QuestCard: Titre de la quête:', questData.title);
      
      const success = await onComplete(userQuestId, progress);
      
      if (success) {
        console.log('✅ QuestCard: Quête complétée avec succès!');
        // Ne pas faire de scroll automatique ici
      } else {
        console.error('❌ QuestCard: Échec de la complétion');
        // Optionnel: afficher un message d'erreur à l'utilisateur
        alert('Erreur lors de la complétion de la quête. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('❌ QuestCard: Erreur lors de la complétion:', error);
      alert('Erreur inattendue lors de la complétion de la quête.');
    } finally {
      setIsCompleting(false);
    }
  };

  const getDifficultyStyle = (difficulty: string) => {
    return difficultyColors[difficulty as keyof typeof difficultyColors] || difficultyColors.easy;
  };

  const getTypeStyle = (type: string) => {
    return typeStyles[type as keyof typeof typeStyles] || typeStyles.daily;
  };

  const difficultyStyle = getDifficultyStyle(questData.difficulty || 'easy');
  const typeStyle = getTypeStyle(questData.type || 'daily');
  const TypeIcon = typeStyle.icon;

  const formatRequirements = () => {
    if (!questData.requirements) return 'Compléter la quête';
    
    const { action, count, target } = questData.requirements;
    
    if (action && count) {
      return `${action.charAt(0).toUpperCase() + action.slice(1)} ${count} ${target || 'fois'}`;
    }
    
    return questData.description || 'Compléter la quête';
  };

  const getProgressPercentage = () => {
    if (!quest.progress || !questData.requirements?.count) return 0;
    const current = quest.progress.count || 0;
    const total = questData.requirements.count;
    return Math.min((current / total) * 100, 100);
  };

  const isCompleted = (quest as any).is_completed || quest.progress?.completed;
  const progressPercentage = getProgressPercentage();

  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-900/40 border border-gray-700/50 rounded-lg hover:bg-gray-800/50 transition-colors">
        <div className="flex items-center space-x-3">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: typeStyle.bg, border: `1px solid ${typeStyle.border}` }}
          >
            <TypeIcon className="w-4 h-4" style={{ color: typeStyle.text }} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white truncate max-w-48">
              {questData.title || 'Quête sans titre'}
            </h3>
            <p className="text-xs text-gray-400">
              {formatRequirements()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-yellow-900/30 border border-yellow-600/30 rounded px-2 py-1">
            <Trophy className="w-3 h-3 text-yellow-400" />
            <span className="text-xs text-yellow-400 font-bold">
              {questData.xp_reward || 0}
            </span>
          </div>
          
          <Badge 
            variant="outline" 
            className="text-xs"
            style={{ 
              backgroundColor: difficultyStyle.bg, 
              borderColor: difficultyStyle.border, 
              color: difficultyStyle.text 
            }}
          >
            {questData.difficulty || 'easy'}
          </Badge>
          
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          ) : (
            <Button
              size="sm"
              onClick={handleComplete}
              disabled={isCompleting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 h-7"
            >
              {isCompleting ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <PlayCircle className="w-3 h-3" />
              )}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-gray-900/60 border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300 hover:border-gray-600/50">
      <CardContent className="p-6">
        {/* En-tête avec type et difficulté */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: typeStyle.bg, border: `1px solid ${typeStyle.border}` }}
            >
              <TypeIcon className="w-4 h-4" style={{ color: typeStyle.text }} />
            </div>
            <Badge 
              variant="outline" 
              style={{ 
                backgroundColor: typeStyle.bg, 
                borderColor: typeStyle.border, 
                color: typeStyle.text 
              }}
            >
              {typeStyle.label}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge 
              variant="outline" 
              className="bg-yellow-900/40 border-yellow-600/50 text-yellow-300 font-bold px-3 py-1"
            >
              <Trophy className="w-3 h-3 mr-1" />
              {questData.xp_reward || 0} XP
            </Badge>
            
            <Badge 
              variant="outline" 
              style={{ 
                backgroundColor: difficultyStyle.bg, 
                borderColor: difficultyStyle.border, 
                color: difficultyStyle.text 
              }}
            >
              {(questData.difficulty || 'easy').toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Titre et description */}
        <CardTitle className="text-xl font-bold text-white mb-2 leading-tight">
          {questData.title || 'Quête sans titre'}
        </CardTitle>
        
        <CardDescription className="text-gray-300 mb-4 leading-relaxed">
          {questData.description || 'Aucune description disponible'}
        </CardDescription>

        {/* Barre de progression */}
        {!isCompleted && questData.requirements?.count && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Progression</span>
              <span className="text-sm text-gray-400">
                {quest.progress?.count || 0} / {questData.requirements.count}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Récompenses */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 bg-yellow-900/30 border border-yellow-600/30 rounded-lg px-3 py-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-lg text-yellow-400 font-bold">
                {questData.xp_reward || 0} XP
              </span>
            </div>
            {questData.coinReward && (
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                <span className="text-sm text-yellow-400 font-medium">
                  {questData.coinReward} pièces
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bouton d'action */}
        {isCompleted ? (
          <div className="flex items-center justify-center py-3 bg-green-900/30 border border-green-600/30 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-green-400 font-medium">Quête terminée</span>
          </div>
        ) : (
          <Button
            onClick={handleComplete}
            disabled={isCompleting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
          >
            {isCompleting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Completion en cours...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <PlayCircle className="w-5 h-5 mr-2" />
                Terminer la quête
              </div>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestCard;

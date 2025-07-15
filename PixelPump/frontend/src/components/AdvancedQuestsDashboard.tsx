import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAdvancedQuests } from '../hooks/useAdvancedQuests';
import { advancedQuestApi } from '../services/api';
import QuestCard from './QuestCard';
import { 
  Sword, 
  Target, 
  Trophy, 
  Calendar, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface AdvancedQuestsDashboardProps {
  onUserDataChange?: () => Promise<void>;
}

export const AdvancedQuestsDashboard: React.FC<AdvancedQuestsDashboardProps> = ({ onUserDataChange }) => {
  const {
    activeQuests,
    stats,
    loading: questsLoading,
    error,
    refreshQuests,
    completeQuest
  } = useAdvancedQuests(onUserDataChange);

  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('all');
  const [refreshLoading, setRefreshLoading] = useState<boolean>(false);

  // Fonction pour détecter si l'utilisateur est demo ou admin
  const isDemoOrAdminUser = (): boolean => {
    try {
      const storedUser = localStorage.getItem('pixelpump_user');
      if (!storedUser) return false;
      
      const user = JSON.parse(storedUser);
      console.log('📊 Vérification utilisateur démo/admin:', user);
      
      // Liste de tous les noms d'utilisateurs démo possibles
      const demoUsernames = ['testuser', 'admin', 'demo', 'NewbiePumper', 'FitnessGuru', 'CodeWarrior', 'DemoUser'];
      
      // Liste des emails démo connus
      const demoEmails = ['admin@pixelpump.com', 'demo@pixelpump.com'];
      
      // Vérifier si le nom d'utilisateur est dans la liste des démos
      const usernameIsDemoOrAdmin = demoUsernames.includes(user.username);
      
      // Vérifier si l'email est dans la liste des démos ou contient 'demo'
      const emailIsDemoOrAdmin = demoEmails.includes(user.email) || 
                                (user.email && user.email.includes('demo'));
      
      // Vérifier si le rôle est admin
      const roleIsAdmin = user.role === 'admin';
      
      const isDemoUser = usernameIsDemoOrAdmin || emailIsDemoOrAdmin || roleIsAdmin;
      
      console.log('🎭 Détection démo/admin:', {
        username: user.username,
        email: user.email,
        role: user.role,
        usernameIsDemoOrAdmin,
        emailIsDemoOrAdmin,
        roleIsAdmin,
        isDemoUser
      });
      
      return isDemoUser;
    } catch (error) {
      console.error('Erreur lors de la vérification du type d\'utilisateur:', error);
      return false;
    }
  };

  const handleRefresh = async () => {
    console.log('🔄 Clic sur le bouton Actualiser');
    
    try {
      setRefreshLoading(true);
      console.log('🎮 Tentative de renouvellement des quêtes via le service indépendant...');
      const result = await advancedQuestApi.renewQuests();
      setActiveTab('all');
      if (result?.success && result?.data?.count > 0) {
        alert(`✅ Succès! ${result.data.count} nouvelles quêtes assignées.`);
      } else if (result?.success && result?.data?.count === 0) {
        alert('Aucune nouvelle quête n\'a pu être générée pour votre profil. Vérifiez qu\'il existe des quêtes actives/templates pour votre niveau.');
      } else {
        alert('Erreur : les quêtes n\'ont pas pu être renouvelées.');
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      await refreshQuests();
    } catch (error) {
      console.error('❌ Erreur lors du renouvellement:', error);
      alert('❌ Erreur lors du renouvellement des quêtes. Veuillez réessayer plus tard.');
    } finally {
      setRefreshLoading(false);
    }
  };

  const getQuestsForTab = () => {
    // Vérification de sécurité
    if (!activeQuests) {
      return [];
    }
    
    let quests;
    if (activeTab === 'all') {
      quests = [
        ...(activeQuests.daily || []),
        ...(activeQuests.weekly || []),
        ...(activeQuests.monthly || []),
        ...(activeQuests.special || [])
      ];
    } else {
      quests = activeQuests[activeTab] || [];
    }
    
    // Définir l'ordre de difficulté (du plus simple au plus dur)
    const difficultyOrder = {
      'easy': 1,
      'medium': 2,
      'hard': 3,
      'epic': 4
    };
    
    // Trier les quêtes par difficulté croissante
    const sortedQuests = quests.sort((a, b) => {
      const questA = (a as any).Quest || a.quest;
      const questB = (b as any).Quest || b.quest;
      
      if (!questA || !questB) return 0;
      
      const difficultyA = difficultyOrder[questA.difficulty as keyof typeof difficultyOrder] || 5;
      const difficultyB = difficultyOrder[questB.difficulty as keyof typeof difficultyOrder] || 5;
      return difficultyA - difficultyB;
    });
    
    // Limiter à 9 quêtes maximum
    return sortedQuests.slice(0, 9);
  };

  const getTotalQuestsForTab = () => {
    // Vérification de sécurité
    if (!activeQuests) {
      return 0;
    }
    
    let quests;
    if (activeTab === 'all') {
      quests = [
        ...(activeQuests.daily || []),
        ...(activeQuests.weekly || []),
        ...(activeQuests.monthly || []),
        ...(activeQuests.special || [])
      ];
    } else {
      quests = activeQuests[activeTab] || [];
    }
    
    return quests.length;
  };

  const tabLabels = {
    all: 'Toutes mes missions',
    daily: 'Aujourd\'hui',
    weekly: 'Cette semaine',
    monthly: 'Ce mois'
  };

  const tabIcons = {
    all: Sword,
    daily: Calendar,
    weekly: Target,
    monthly: Trophy
  };

  return (
    <div className="space-y-6">
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

      {/* Onglets des quêtes */}
      <div className="pixel-card" style={{
        background: 'rgba(26, 0, 51, 0.8)',
        border: '2px solid #ff006e',
        boxShadow: '0 8px 32px rgba(255, 0, 110, 0.3)',
        borderRadius: '15px',
        padding: '25px'
      }}>
        <div className="flex flex-col items-center justify-center mb-6 gap-4">
          <h3 className="pixel-title glowing-title text-center w-full" style={{ 
            color: '#ff006e', 
            fontSize: '1.6rem',
            fontWeight: 'bold',
            textShadow: '0 0 10px #ff006e, 0 0 20px #ff006e, 0 0 30px #ff006e',
            animation: 'glow 2s ease-in-out infinite alternate',
            textAlign: 'center'
          }}>✨ Mes Missions ✨</h3>
          
          {/* Indicateur de tri */}
          <div className="text-center mb-2" style={{
            color: '#9d4edd',
            fontSize: '0.85rem',
            fontFamily: 'monospace',
            opacity: 0.8
          }}>
          </div>
          
          <div className="flex items-center justify-center w-full">
            {isDemoOrAdminUser() && (
              <Button 
                onClick={handleRefresh} 
                disabled={refreshLoading || questsLoading}
                className="cyberpunk-btn pixel-btn font-pixel"
                size="sm"
                style={{
                  background: 'transparent',
                  border: '2px solid #ff006e',
                  color: '#ff006e',
                  fontSize: '0.75rem'
                }}
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${refreshLoading ? 'animate-spin' : ''}`} />
                {refreshLoading ? 'Chargement...' : 'Nouvelles Quêtes'}
              </Button>
            )}
          </div>
          
          <div className="quest-tabs-container justify-center">
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
                  className={`flex items-center gap-1 cyberpunk-btn pixel-btn font-pixel text-xs sm:text-sm ${
                    isActive ? 'active' : ''
                  }`}
                  style={{
                    background: isActive ? 'rgba(255, 0, 110, 0.2)' : 'transparent',
                    border: `2px solid ${isActive ? '#ff006e' : '#8338ec'}`,
                    color: isActive ? '#ff006e' : '#8338ec',
                    fontSize: '0.75rem',
                    padding: '6px 10px',
                    minWidth: 'auto',
                    flexShrink: 0
                  }}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{label === 'Quotidiennes' ? 'Jour' : label === 'Hebdomadaires' ? 'Sem' : label === 'Mensuelles' ? 'Mois' : label}</span>
                  {count > 0 && (
                    <Badge 
                      className="ml-1 text-xs pixel-badge-enhanced"
                      style={{
                        background: 'rgba(255, 190, 11, 0.2)',
                        border: '1px solid #ffbe0b',
                        color: '#ffbe0b',
                        fontSize: '0.6rem',
                        padding: '1px 4px'
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
          {questsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="pixel-spinner mr-4"></div>
              <span className="font-mono" style={{ color: '#9d4edd' }}>Chargement des quêtes...</span>
            </div>
          ) : (
            <div className="quests-grid">
              {getQuestsForTab().map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onComplete={completeQuest}
                />
              ))}
            </div>
          )}
          
          {/* Indicateur s'il y a plus de 9 quêtes */}
          {!questsLoading && getTotalQuestsForTab() > 9 && (
            <div className="text-center mt-4" style={{
              background: 'rgba(255, 0, 110, 0.1)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 0, 110, 0.3)',
              padding: '12px',
              color: '#ff006e'
            }}>
              <span className="font-mono text-sm">
                ✨ {getTotalQuestsForTab() - 9} missions supplémentaires disponibles ! 
                Complétez celles-ci pour débloquer les suivantes.
              </span>
            </div>
          )}

          {!questsLoading && getQuestsForTab().length === 0 && (
            <div className="text-center py-12" style={{ 
              background: 'rgba(131, 56, 236, 0.1)',
              borderRadius: '15px',
              border: '2px dashed #8338ec',
              padding: '30px'
            }}>
              <div style={{ 
                fontSize: '4rem', 
                marginBottom: '15px',
                filter: 'drop-shadow(0 0 10px rgba(255, 0, 110, 0.5))'
              }}>
                ⚔️
              </div>
              <h3 style={{ 
                color: '#ff006e', 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                marginBottom: '10px',
                textShadow: '0 0 20px rgba(255, 0, 110, 0.3)'
              }}>
                Zone de Combat Vide
              </h3>
              <p className="font-mono" style={{ 
                color: '#9d4edd',
                fontSize: '1rem',
                marginBottom: '15px',
                lineHeight: '1.6'
              }}>
                Tes missions se préparent dans l'ombre...<br/>
                Bientôt de nouveaux défis t'attendront !
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                marginTop: '20px',
                fontSize: '0.9rem',
                color: '#06ffa5'
              }}>
                <span>🔄</span>
                <span className="font-mono">Actualisé il y a quelques instants</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

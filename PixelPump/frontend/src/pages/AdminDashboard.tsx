import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import ConfirmModal from '../components/ui/ConfirmModal';
import QuestModal from '../components/ui/QuestModal';
import AchievementModal from '../components/ui/AchievementModal';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  level: number;
  xp: number;
  streak: number;
  total_quests_completed: number;
  created_at: string;
  last_login: string;
}

interface BannedUser extends User {
  bannedAt: string;
  bannedBy: string;
}

interface Quest {
  id?: string;
  title: string;
  description: string;
  category: string;
  xp_reward: number;
  difficulty: string;
  type: string;
}

interface Achievement {
  id?: string;
  title: string;
  description: string;
  category: string;
  requirements: any;
}

interface DatabaseStats {
  totalUsers: number;
  totalQuests: number;
  totalAchievements: number;
  activeUsers: number;
  totalXpDistributed: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  // States pour les données
  const [users, setUsers] = useState<User[]>([]);
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<DatabaseStats | null>(null);

  // States pour les actions
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [notification, setNotification] = useState('');
  const [customXpAmount, setCustomXpAmount] = useState(100);

  // States pour les modales de confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showXpModal, setShowXpModal] = useState(false);
  const [selectedUserForXp, setSelectedUserForXp] = useState<User | null>(null);
  const [xpToAdd, setXpToAdd] = useState(100);
  const [deleteModalData, setDeleteModalData] = useState({
    title: '',
    message: '',
    userId: '',
    userCount: 0
  });

  // States pour les modales de quêtes et trophées
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [questModalMode, setQuestModalMode] = useState<'create' | 'edit'>('create');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [achievementModalMode, setAchievementModalMode] = useState<'create' | 'edit'>('create');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const [showDeleteQuestModal, setShowDeleteQuestModal] = useState(false);
  const [questToDelete, setQuestToDelete] = useState<Quest | null>(null);

  const [showDeleteAchievementModal, setShowDeleteAchievementModal] = useState(false);
  const [achievementToDelete, setAchievementToDelete] = useState<Achievement | null>(null);

  // States pour les quêtes aléatoires
  const [randomQuests, setRandomQuests] = useState<Quest[]>([]);
  const [questCount, setQuestCount] = useState(3);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['development', 'design', 'learning']);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(['easy', 'medium', 'hard']);
  const [generatingQuests, setGeneratingQuests] = useState(false);

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUsers(),
        fetchBannedUsers(),
        fetchQuests(),
        fetchAchievements(),
        fetchStats()
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  };

  const fetchBannedUsers = async () => {
    try {
      // Pour l'instant, on simule une liste de bannis en localStorage
      // Dans un vrai projet, cela serait stocké en base de données
      const bannedList: BannedUser[] = JSON.parse(localStorage.getItem('bannedUsers') || '[]');
      setBannedUsers(bannedList);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs bannis:', error);
      setBannedUsers([]);
    }
  };

  const fetchQuests = async () => {
    try {
      const response = await api.get('/quests');
      setQuests(response.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des quêtes:', error);
    }
  };

  const fetchAchievements = async () => {
    try {
      const response = await api.get('/achievements');
      setAchievements(response.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des achievements:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/database/stats');
      setStats(response.data.data || null);
    } catch (error) {
      // Stats endpoint might not exist, calculate manually
      const calculatedStats: DatabaseStats = {
        totalUsers: users.length,
        totalQuests: quests.length,
        totalAchievements: achievements.length,
        activeUsers: users.filter(u => {
          const lastLogin = new Date(u.last_login);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return lastLogin > weekAgo;
        }).length,
        totalXpDistributed: users.reduce((sum, u) => sum + u.xp, 0)
      };
      setStats(calculatedStats);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedUsers.length === 0) return;

    // Validation pour l'ajout d'XP
    if (bulkAction === 'addXp' && (customXpAmount <= 0 || customXpAmount > 10000)) {
      setNotification('❌ Veuillez saisir un montant d\'XP valide (1-10000)');
      return;
    }

    // Si c'est une suppression, on affiche la modal de confirmation
    if (bulkAction === 'delete') {
      setDeleteModalData({
        title: 'Bannir des pumpers',
        message: `Attention ! Vous êtes sur le point de bannir ${selectedUsers.length} pumper(s) de PixelPump ! Leurs quêtes seront perdues à jamais. Cette action est irréversible !`,
        userId: '',
        userCount: selectedUsers.length
      });
      setShowBulkDeleteModal(true);
      return;
    }

    try {
      setLoading(true);
      const promises = selectedUsers.map(userId => {
        switch (bulkAction) {
          case 'addXp':
            return api.patch(`/users/${userId}/xp`, { xp: customXpAmount });
          case 'resetProgress':
            return api.patch(`/users/${userId}`, { xp: 0, level: 1, streak: 0 });
          default:
            return Promise.resolve();
        }
      });

      await Promise.all(promises);
      
      let actionMessage = '';
      switch (bulkAction) {
        case 'addXp':
          actionMessage = `${customXpAmount} XP ajoutés`;
          break;
        case 'resetProgress':
          actionMessage = 'Progression réinitialisée';
          break;
        default:
          actionMessage = `Action "${bulkAction}" appliquée`;
      }
      
      setNotification(`✅ ${actionMessage} à ${selectedUsers.length} utilisateur(s)`);
      setSelectedUsers([]);
      setBulkAction('');
      fetchUsers();
    } catch (error) {
      setNotification('❌ Erreur lors de l\'exécution de l\'action');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteUser = async () => {
    try {
      setLoading(true);

      // Récupérer les données de l'utilisateur avant suppression
      const userToDelete = users.find(u => u.id === deleteModalData.userId);
      if (userToDelete) {
        // Ajouter à la liste des bannis
        const bannedList: BannedUser[] = JSON.parse(localStorage.getItem('bannedUsers') || '[]');
        const bannedUser: BannedUser = {
          ...userToDelete,
          bannedAt: new Date().toISOString(),
          bannedBy: user?.username || 'Admin'
        };
        bannedList.push(bannedUser);
        localStorage.setItem('bannedUsers', JSON.stringify(bannedList));
        setBannedUsers(bannedList);
      }

      await api.delete(`/users/${deleteModalData.userId}`);
      setNotification('✅ Pumper supprimé de l\'univers PixelPump avec succès');
      fetchUsers();
    } catch (error) {
      setNotification('❌ Erreur lors de la suppression de l\'utilisateur');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const confirmBulkDeleteUsers = async () => {
    try {
      setLoading(true);

      // Récupérer les données des utilisateurs avant suppression
      const usersToDelete = users.filter(u => selectedUsers.includes(u.id));
      const bannedList: BannedUser[] = JSON.parse(localStorage.getItem('bannedUsers') || '[]');

      usersToDelete.forEach(userToDelete => {
        const bannedUser: BannedUser = {
          ...userToDelete,
          bannedAt: new Date().toISOString(),
          bannedBy: user?.username || 'Admin'
        };
        bannedList.push(bannedUser);
      });

      localStorage.setItem('bannedUsers', JSON.stringify(bannedList));
      setBannedUsers(bannedList);

      const promises = selectedUsers.map(userId => api.delete(`/users/${userId}`));
      await Promise.all(promises);
      setNotification(`🎮 ${selectedUsers.length} pumper(s) banni(s) de l'univers PixelPump avec succès !`);
      setSelectedUsers([]);
      setBulkAction('');
      fetchUsers();
    } catch (error) {
      setNotification('❌ Erreur lors du bannissement des pumpers');
    } finally {
      setLoading(false);
      setShowBulkDeleteModal(false);
    }
  };

  // Quest CRUD functions
  const handleCreateQuest = () => {
    setQuestModalMode('create');
    setSelectedQuest(null);
    setShowQuestModal(true);
  };

  const handleEditQuest = (quest: Quest) => {
    setQuestModalMode('edit');
    setSelectedQuest(quest);
    setShowQuestModal(true);
  };

  const handleSaveQuest = async (questData: Quest) => {
    try {
      setLoading(true);

      if (questModalMode === 'create') {
        await api.post('/admin/quests', questData);
        setNotification('✅ Quête créée avec succès !');
      } else {
        await api.put(`/admin/quests/${questData.id}`, questData);
        setNotification('✅ Quête modifiée avec succès !');
      }

      setShowQuestModal(false);
      fetchQuests();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la quête:', error);
      setNotification('❌ Erreur lors de la sauvegarde de la quête');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestClick = (quest: Quest) => {
    setQuestToDelete(quest);
    setShowDeleteQuestModal(true);
  };

  const confirmDeleteQuest = async () => {
    if (!questToDelete) return;

    try {
      setLoading(true);
      await api.delete(`/admin/quests/${questToDelete.id}`);
      setNotification('✅ Quête supprimée avec succès !');
      setShowDeleteQuestModal(false);
      setQuestToDelete(null);
      fetchQuests();
    } catch (error) {
      console.error('Erreur lors de la suppression de la quête:', error);
      setNotification('❌ Erreur lors de la suppression de la quête');
    } finally {
      setLoading(false);
    }
  };

  // Achievement CRUD functions
  const handleCreateAchievement = () => {
    setAchievementModalMode('create');
    setSelectedAchievement(null);
    setShowAchievementModal(true);
  };

  const handleEditAchievement = (achievement: Achievement) => {
    setAchievementModalMode('edit');
    setSelectedAchievement(achievement);
    setShowAchievementModal(true);
  };

  const handleSaveAchievement = async (achievementData: Achievement) => {
    try {
      setLoading(true);

      if (achievementModalMode === 'create') {
        await api.post('/admin/achievements', achievementData);
        setNotification('✅ Trophée créé avec succès !');
      } else {
        await api.put(`/admin/achievements/${achievementData.id}`, achievementData);
        setNotification('✅ Trophée modifié avec succès !');
      }

      setShowAchievementModal(false);
      fetchAchievements();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du trophée:', error);
      setNotification('❌ Erreur lors de la sauvegarde du trophée');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAchievementClick = (achievement: Achievement) => {
    setAchievementToDelete(achievement);
    setShowDeleteAchievementModal(true);
  };

  const confirmDeleteAchievement = async () => {
    if (!achievementToDelete) return;

    try {
      setLoading(true);
      await api.delete(`/admin/achievements/${achievementToDelete.id}`);
      setNotification('✅ Trophée supprimé avec succès !');
      setShowDeleteAchievementModal(false);
      setAchievementToDelete(null);
      fetchAchievements();
    } catch (error) {
      console.error('Erreur lors de la suppression du trophée:', error);
      setNotification('❌ Erreur lors de la suppression du trophée');
    } finally {
      setLoading(false);
    }
  };

  // Fonctions pour les quêtes aléatoires
  const generateRandomQuests = () => {
    setGeneratingQuests(true);
    
    // Filtrer les quêtes selon les critères sélectionnés
    const filteredQuests = quests.filter(quest => 
      selectedCategories.includes(quest.category) && 
      selectedDifficulties.includes(quest.difficulty)
    );

    if (filteredQuests.length === 0) {
      setNotification('❌ Aucune quête ne correspond aux critères sélectionnés');
      setGeneratingQuests(false);
      return;
    }

    // Sélectionner des quêtes aléatoires
    const shuffled = [...filteredQuests].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(questCount, shuffled.length));
    
    setRandomQuests(selected);
    setNotification(`🎲 ${selected.length} quête(s) aléatoire(s) générée(s) !`);
    setGeneratingQuests(false);
  };

  const clearRandomQuests = () => {
    setRandomQuests([]);
    setNotification('🗑️ Quêtes aléatoires effacées');
  };

  const assignRandomQuestToUser = async (quest: Quest, userId: string) => {
    try {
      await api.post('/admin/assign-quest', {
        questId: quest.id,
        userId: userId
      });
      setNotification(`✅ Quête "${quest.title}" assignée avec succès !`);
    } catch (error) {
      console.error('Erreur lors de l\'assignation:', error);
      setNotification('❌ Erreur lors de l\'assignation de la quête');
    }
  };

  const assignRandomQuestToAllUsers = async (quest: Quest) => {
    try {
      const activeUsers = users.filter(u => u.role !== 'admin');
      await api.post('/admin/assign-quest-to-multiple-users', {
        questId: quest.id,
        userIds: activeUsers.map(u => u.id)
      });
      setNotification(`🎯 Quête "${quest.title}" assignée à tous les utilisateurs !`);
    } catch (error) {
      console.error('Erreur lors de l\'assignation multiple:', error);
      setNotification('❌ Erreur lors de l\'assignation multiple');
    }
  };

  const handleAddXpToUser = async () => {
    if (!selectedUserForXp || xpToAdd <= 0 || xpToAdd > 10000) {
      setNotification('❌ Veuillez saisir un montant d\'XP valide (1-10000)');
      return;
    }

    try {
      setLoading(true);
      await api.patch(`/users/${selectedUserForXp.id}/xp`, { xp: xpToAdd });
      setNotification(`✅ ${xpToAdd} XP ajoutés à ${selectedUserForXp.username}`);
      setShowXpModal(false);
      setSelectedUserForXp(null);
      setXpToAdd(100);
      fetchUsers();
    } catch (error) {
      setNotification('❌ Erreur lors de l\'ajout d\'XP');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0014 0%, #1a0033 25%, #2d1b69 50%, #1a0033 75%, #0a0014 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>🔒 Accès refusé</h2>
          <p>Vous devez être administrateur pour accéder à cette page.</p>
          <Link to="/dashboard" style={{ color: '#ff006e' }}>Retour au dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0014 0%, #1a0033 25%, #2d1b69 50%, #1a0033 75%, #0a0014 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header Admin */}
      <header style={{
        background: 'rgba(26, 0, 51, 0.95)',
        borderBottom: '2px solid #ff006e',
        backdropFilter: 'blur(15px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '15px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #ff006e, #06ffa5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ⚡ PixelPump Admin
          </div>

          <nav style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Link to="/dashboard" style={{
              color: '#8338ec',
              textDecoration: 'none',
              fontWeight: 'bold',
              padding: '8px 16px',
              borderRadius: '20px'
            }}>
              🏠 User Dashboard
            </Link>
            <span style={{ color: '#06ffa5', fontSize: '0.9rem' }}>
              👑 {user.username}
            </span>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              style={{
                background: 'transparent',
                border: '2px solid #ff006e',
                color: '#ff006e',
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🚪 Déconnexion
            </button>
          </nav>
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        {/* Notification */}
        {notification && (
          <div style={{
            background: notification.includes('✅') ? 'rgba(6, 255, 165, 0.1)' : 'rgba(255, 107, 107, 0.1)',
            border: `1px solid ${notification.includes('✅') ? '#06ffa5' : '#ff6b6b'}`,
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px'
          }}>
            {notification}
            <button
              onClick={() => setNotification('')}
              style={{
                float: 'right',
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px',
          borderBottom: '2px solid rgba(255, 0, 110, 0.2)',
          paddingBottom: '10px'
        }}>
          {[
            { id: 'dashboard', label: '📊 Vue d\'ensemble', icon: '📊' },
            { id: 'users', label: '👥 Utilisateurs', icon: '👥' },
            { id: 'banned', label: '🚫 Bannis', icon: '🚫' },
            { id: 'quests', label: '⚔️ Quêtes', icon: '⚔️' },
            { id: 'random-quests', label: '🎲 Quêtes Aléatoires', icon: '🎲' },
            { id: 'achievements', label: '🏆 Succès', icon: '🏆' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'rgba(255, 0, 110, 0.2)' : 'transparent',
                border: activeTab === tab.id ? '2px solid #ff006e' : '2px solid transparent',
                color: activeTab === tab.id ? '#ff006e' : '#8338ec',
                padding: '12px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Stats Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              <div style={{
                background: 'rgba(255, 0, 110, 0.1)',
                border: '2px solid #ff006e',
                borderRadius: '15px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', color: '#ff006e', marginBottom: '10px' }}>
                  {stats?.totalUsers || users.length}
                </div>
                <div style={{ color: '#b8b8b8' }}>Utilisateurs totaux</div>
              </div>

              <div style={{
                background: 'rgba(131, 56, 236, 0.1)',
                border: '2px solid #8338ec',
                borderRadius: '15px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', color: '#8338ec', marginBottom: '10px' }}>
                  {stats?.activeUsers || 0}
                </div>
                <div style={{ color: '#b8b8b8' }}>Utilisateurs actifs</div>
              </div>

              <div style={{
                background: 'rgba(6, 255, 165, 0.1)',
                border: '2px solid #06ffa5',
                borderRadius: '15px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', color: '#06ffa5', marginBottom: '10px' }}>
                  {stats?.totalQuests || quests.length}
                </div>
                <div style={{ color: '#b8b8b8' }}>Quêtes disponibles</div>
              </div>

              <div style={{
                background: 'rgba(255, 215, 0, 0.1)',
                border: '2px solid gold',
                borderRadius: '15px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', color: 'gold', marginBottom: '10px' }}>
                  {stats?.totalXpDistributed || users.reduce((sum, u) => sum + u.xp, 0)}
                </div>
                <div style={{ color: '#b8b8b8' }}>XP total distribué</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{
              background: 'rgba(26, 0, 51, 0.6)',
              borderRadius: '15px',
              padding: '25px',
              border: '2px solid #8338ec'
            }}>
              <h3 style={{ color: '#8338ec', marginBottom: '20px' }}>📈 Activité récente</h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                {users.slice(0, 5).map(user => (
                  <div key={user.id} style={{
                    background: 'rgba(255, 0, 110, 0.1)',
                    padding: '15px',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <strong>{user.username}</strong> - Niveau {user.level}
                    </div>
                    <div style={{ color: '#06ffa5' }}>
                      {user.xp} XP
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            {/* Bulk Actions */}
            <div style={{
              background: 'rgba(26, 0, 51, 0.6)',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '20px',
              border: '2px solid #8338ec'
            }}>
              <h3 style={{ color: '#8338ec', marginBottom: '15px' }}>🔧 Actions groupées</h3>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  style={{
                    background: 'rgba(26, 0, 51, 0.8)',
                    border: '2px solid #ff006e',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '8px'
                  }}
                >
                  <option value="">Choisir une action</option>
                  <option value="addXp">Ajouter XP personnalisé</option>
                  <option value="resetProgress">Réinitialiser progression</option>
                  <option value="delete">Bannir les pumpers</option>
                </select>

                {bulkAction === 'addXp' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ color: '#06ffa5', fontSize: '0.9rem' }}>XP à ajouter:</label>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={customXpAmount}
                      onChange={(e) => setCustomXpAmount(parseInt(e.target.value) || 0)}
                      style={{
                        background: 'rgba(26, 0, 51, 0.8)',
                        border: '2px solid #06ffa5',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        width: '100px',
                        textAlign: 'center'
                      }}
                      placeholder="XP"
                    />
                  </div>
                )}

                <button
                  onClick={handleBulkAction}
                  disabled={!bulkAction || selectedUsers.length === 0}
                  style={{
                    background: selectedUsers.length > 0 ? 'linear-gradient(135deg, #ff006e, #8338ec)' : '#666',
                    border: 'none',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: selectedUsers.length > 0 ? 'pointer' : 'not-allowed',
                    fontWeight: 'bold'
                  }}
                >
                  Appliquer ({selectedUsers.length} sélectionnés)
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div style={{
              background: 'rgba(26, 0, 51, 0.6)',
              borderRadius: '15px',
              padding: '25px',
              border: '2px solid #ff006e',
              overflowX: 'auto'
            }}>
              <h3 style={{ color: '#ff006e', marginBottom: '20px' }}>👥 Gestion des utilisateurs</h3>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>🔄 Chargement...</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #ff006e' }}>
                      <th style={{ padding: '10px', textAlign: 'left' }}>
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              const nonAdminUsers = users.filter(u => u.role !== 'admin').map(u => u.id);
                              setSelectedUsers(nonAdminUsers);
                            } else {
                              setSelectedUsers([]);
                            }
                          }}
                        />
                      </th>
                      <th style={{ padding: '10px', textAlign: 'left', color: '#ff006e' }}>Utilisateur</th>
                      <th style={{ padding: '10px', textAlign: 'left', color: '#ff006e' }}>Email</th>
                      <th style={{ padding: '10px', textAlign: 'left', color: '#ff006e' }}>Niveau</th>
                      <th style={{ padding: '10px', textAlign: 'left', color: '#ff006e' }}>XP</th>
                      <th style={{ padding: '10px', textAlign: 'left', color: '#ff006e' }}>Série</th>
                      <th style={{ padding: '10px', textAlign: 'left', color: '#ff006e' }}>Quêtes</th>
                      <th style={{ padding: '10px', textAlign: 'left', color: '#ff006e' }}>Inscrit</th>
                      <th style={{ padding: '10px', textAlign: 'left', color: '#ff006e' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} style={{ borderBottom: '1px solid rgba(255, 0, 110, 0.2)' }}>
                        <td style={{ padding: '10px' }}>
                          <input
                            type="checkbox"
                            disabled={user.role === 'admin'}
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers([...selectedUsers, user.id]);
                              } else {
                                setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                              }
                            }}
                          />
                        </td>
                        <td style={{ padding: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              background: user.role === 'admin' ? 'gold' : '#8338ec',
                              color: 'black',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '0.7rem',
                              fontWeight: 'bold'
                            }}>
                              {user.role === 'admin' ? '👑' : '👤'}
                            </span>
                            <strong>{user.username}</strong>
                          </div>
                        </td>
                        <td style={{ padding: '10px', color: '#b8b8b8' }}>{user.email}</td>
                        <td style={{ padding: '10px', color: '#06ffa5', fontWeight: 'bold' }}>{user.level}</td>
                        <td style={{ padding: '10px', color: '#8338ec', fontWeight: 'bold' }}>{user.xp}</td>
                        <td style={{ padding: '10px', color: '#ff006e' }}>{user.streak}</td>
                        <td style={{ padding: '10px', color: '#06ffa5' }}>{user.total_quests_completed}</td>
                        <td style={{ padding: '10px', color: '#b8b8b8', fontSize: '0.8rem' }}>
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '10px' }}>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                              onClick={() => {
                                setSelectedUserForXp(user);
                                setShowXpModal(true);
                              }}
                              style={{
                                background: 'rgba(6, 255, 165, 0.2)',
                                border: '1px solid #06ffa5',
                                color: '#06ffa5',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '0.8rem',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              +XP
                            </button>
                            {user.role !== 'admin' ? (
                              <button
                                onClick={() => {
                                  setDeleteModalData({
                                    title: 'Supprimer le pumper',
                                    message: `Êtes-vous sûr de vouloir supprimer le pumper "${user.username}" de l'univers PixelPump ? Cette action est irréversible et toutes ses quêtes seront perdues !`,
                                    userId: user.id,
                                    userCount: 1
                                  });
                                  setShowDeleteModal(true);
                                }}
                                style={{
                                  background: 'rgba(255, 0, 110, 0.2)',
                                  border: 'none',
                                  color: '#ff006e',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontWeight: 'bold',
                                  fontSize: '0.9rem',
                                  transition: 'all 0.3s ease'
                                }}
                              >
                                Supprimer
                              </button>
                            ) : (
                              <span style={{
                                background: 'rgba(255, 215, 0, 0.2)',
                                border: '1px solid gold',
                                color: 'gold',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                              }}>
                                👑 Protégé
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Confirmation Modals */}
            {showDeleteModal && (
              <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDeleteUser}
                title={deleteModalData.title}
                message={deleteModalData.message}
                confirmText="Supprimer"
                cancelText="Annuler"
                type="danger"
              />
            )}

            {showBulkDeleteModal && (
              <ConfirmModal
                isOpen={showBulkDeleteModal}
                onClose={() => setShowBulkDeleteModal(false)}
                onConfirm={confirmBulkDeleteUsers}
                title={deleteModalData.title}
                message={deleteModalData.message}
                confirmText="Bannir"
                cancelText="Annuler"
                type="danger"
              />
            )}
          </div>
        )}

        {activeTab === 'quests' && (
          <div>
            {/* Quest Management Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: '#06ffa5', margin: 0 }}>⚔️ Gestion des quêtes</h3>
              <button
                onClick={handleCreateQuest}
                style={{
                  background: 'linear-gradient(45deg, #06ffa5, #8338ec)',
                  border: 'none',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              >
                ➕ Nouvelle Quête
              </button>
            </div>

            <div style={{
              background: 'rgba(26, 0, 51, 0.6)',
              borderRadius: '15px',
              padding: '25px',
              border: '2px solid #06ffa5'
            }}>
              <div style={{ display: 'grid', gap: '15px' }}>
                {quests.map(quest => (
                  <div key={quest.id} style={{
                    background: 'rgba(6, 255, 165, 0.1)',
                    border: '1px solid #06ffa5',
                    borderRadius: '10px',
                    padding: '20px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ color: '#06ffa5', margin: '0 0 5px 0' }}>{quest.title}</h4>
                        <p style={{ color: '#b8b8b8', margin: '0', fontSize: '0.9rem' }}>{quest.description}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{
                            background: getDifficultyColor(quest.difficulty),
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            marginBottom: '5px'
                          }}>
                            {quest.difficulty.toUpperCase()}
                          </div>
                          <div style={{ color: '#06ffa5', fontWeight: 'bold' }}>
                            +{quest.xp_reward} XP
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <button
                            onClick={() => handleEditQuest(quest)}
                            style={{
                              background: 'rgba(131, 56, 236, 0.2)',
                              border: '1px solid #8338ec',
                              color: '#8338ec',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            ✏️ Modifier
                          </button>
                          <button
                            onClick={() => handleDeleteQuestClick(quest)}
                            style={{
                              background: 'rgba(255, 23, 68, 0.2)',
                              border: '1px solid #ff1744',
                              color: '#ff1744',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            🗑️ Supprimer
                          </button>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem' }}>
                      <span style={{
                        background: 'rgba(131, 56, 236, 0.3)',
                        color: '#8338ec',
                        padding: '2px 8px',
                        borderRadius: '12px'
                      }}>
                        📂 {quest.category}
                      </span>
                      <span style={{
                        background: 'rgba(255, 0, 110, 0.3)',
                        color: '#ff006e',
                        padding: '2px 8px',
                        borderRadius: '12px'
                      }}>
                        📅 {quest.type}
                      </span>
                    </div>
                  </div>
                ))}

                {quests.length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#b8b8b8'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚔️</div>
                    <h4>Aucune quête disponible</h4>
                    <p>Créez votre première quête pour commencer !</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'random-quests' && (
          <div>
            {/* Random Quest Generator Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: '#ff006e', margin: 0 }}>🎲 Générateur de Quêtes Aléatoires</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={generateRandomQuests}
                  disabled={generatingQuests}
                  style={{
                    background: generatingQuests ? '#666' : 'linear-gradient(45deg, #ff006e, #8338ec)',
                    border: 'none',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: generatingQuests ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                >
                  {generatingQuests ? '🔄 Génération...' : '🎲 Générer des Quêtes'}
                </button>
                {randomQuests.length > 0 && (
                  <button
                    onClick={clearRandomQuests}
                    style={{
                      background: 'rgba(255, 23, 68, 0.2)',
                      border: '2px solid #ff1744',
                      color: '#ff1744',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}
                  >
                    🗑️ Effacer
                  </button>
                )}
              </div>
            </div>

            {/* Configuration Panel */}
            <div style={{
              background: 'rgba(26, 0, 51, 0.6)',
              borderRadius: '15px',
              padding: '25px',
              border: '2px solid #ff006e',
              marginBottom: '20px'
            }}>
              <h4 style={{ color: '#ff006e', marginBottom: '20px' }}>⚙️ Configuration du Générateur</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {/* Nombre de quêtes */}
                <div>
                  <label style={{ display: 'block', marginBottom: '10px', color: '#ff006e', fontWeight: 'bold' }}>
                    Nombre de quêtes à générer
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={questCount}
                    onChange={(e) => setQuestCount(parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      marginBottom: '5px'
                    }}
                  />
                  <div style={{ textAlign: 'center', color: '#06ffa5', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {questCount} quête(s)
                  </div>
                </div>

                {/* Catégories */}
                <div>
                  <label style={{ display: 'block', marginBottom: '10px', color: '#ff006e', fontWeight: 'bold' }}>
                    Catégories incluses
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {['development', 'design', 'learning', 'project', 'collaboration', 'other'].map(category => (
                      <label key={category} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories([...selectedCategories, category]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(c => c !== category));
                            }
                          }}
                        />
                        <span style={{ color: '#b8b8b8', fontSize: '0.9rem', textTransform: 'capitalize' }}>
                          {category === 'development' ? '💻 Développement' :
                           category === 'design' ? '🎨 Design' :
                           category === 'learning' ? '📚 Apprentissage' :
                           category === 'project' ? '🚀 Projet' :
                           category === 'collaboration' ? '🤝 Collaboration' : '📦 Autre'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Difficultés */}
                <div>
                  <label style={{ display: 'block', marginBottom: '10px', color: '#ff006e', fontWeight: 'bold' }}>
                    Difficultés incluses
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {['easy', 'medium', 'hard'].map(difficulty => (
                      <label key={difficulty} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <input
                          type="checkbox"
                          checked={selectedDifficulties.includes(difficulty)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDifficulties([...selectedDifficulties, difficulty]);
                            } else {
                              setSelectedDifficulties(selectedDifficulties.filter(d => d !== difficulty));
                            }
                          }}
                        />
                        <span style={{ 
                          color: difficulty === 'easy' ? '#06ffa5' : difficulty === 'medium' ? '#ff006e' : '#8338ec',
                          fontSize: '0.9rem',
                          fontWeight: 'bold'
                        }}>
                          {difficulty === 'easy' ? '🟢 Facile' :
                           difficulty === 'medium' ? '🟡 Moyen' : '🔴 Difficile'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Quests Display */}
            {randomQuests.length > 0 && (
              <div style={{
                background: 'rgba(26, 0, 51, 0.6)',
                borderRadius: '15px',
                padding: '25px',
                border: '2px solid #06ffa5'
              }}>
                <h4 style={{ color: '#06ffa5', marginBottom: '20px' }}>🎯 Quêtes Générées ({randomQuests.length})</h4>
                
                <div style={{ display: 'grid', gap: '15px' }}>
                  {randomQuests.map((quest, index) => (
                    <div key={`${quest.id}-${index}`} style={{
                      background: 'rgba(6, 255, 165, 0.1)',
                      border: '1px solid #06ffa5',
                      borderRadius: '10px',
                      padding: '20px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                        <div style={{ flex: 1 }}>
                          <h5 style={{ color: '#06ffa5', margin: '0 0 5px 0' }}>{quest.title}</h5>
                          <p style={{ color: '#b8b8b8', margin: '0', fontSize: '0.9rem' }}>{quest.description}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{
                              background: getDifficultyColor(quest.difficulty),
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '0.7rem',
                              fontWeight: 'bold',
                              marginBottom: '5px'
                            }}>
                              {quest.difficulty.toUpperCase()}
                            </div>
                            <div style={{ color: '#06ffa5', fontWeight: 'bold' }}>
                              +{quest.xp_reward} XP
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem' }}>
                          <span style={{
                            background: 'rgba(131, 56, 236, 0.3)',
                            color: '#8338ec',
                            padding: '2px 8px',
                            borderRadius: '12px'
                          }}>
                            📂 {quest.category}
                          </span>
                          <span style={{
                            background: 'rgba(255, 0, 110, 0.3)',
                            color: '#ff006e',
                            padding: '2px 8px',
                            borderRadius: '12px'
                          }}>
                            📅 {quest.type}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                          <select
                            onChange={(e) => {
                              if (e.target.value && e.target.value !== '') {
                                assignRandomQuestToUser(quest, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            style={{
                              background: 'rgba(26, 0, 51, 0.8)',
                              border: '1px solid #8338ec',
                              color: 'white',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '0.8rem'
                            }}
                          >
                            <option value="">Assigner à un utilisateur...</option>
                            {users.filter(u => u.role !== 'admin').map(user => (
                              <option key={user.id} value={user.id}>
                                {user.username} (Niveau {user.level})
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() => assignRandomQuestToAllUsers(quest)}
                            style={{
                              background: 'rgba(6, 255, 165, 0.2)',
                              border: '1px solid #06ffa5',
                              color: '#06ffa5',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: 'bold'
                            }}
                          >
                            🎯 Assigner à tous
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {randomQuests.length === 0 && (
              <div style={{
                background: 'rgba(26, 0, 51, 0.6)',
                borderRadius: '15px',
                padding: '40px',
                border: '2px solid #666',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎲</div>
                <h4 style={{ color: '#b8b8b8', marginBottom: '10px' }}>Aucune quête générée</h4>
                <p style={{ color: '#666', margin: 0 }}>
                  Configurez vos préférences et cliquez sur "Générer des Quêtes" pour commencer !
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div>
            {/* Achievement Management Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: 'gold', margin: 0 }}>🏆 Gestion des trophées</h3>
              <button
                onClick={handleCreateAchievement}
                style={{
                  background: 'linear-gradient(45deg, gold, #ff8500)',
                  border: 'none',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              >
                ➕ Nouveau Trophée
              </button>
            </div>

            <div style={{
              background: 'rgba(26, 0, 51, 0.6)',
              borderRadius: '15px',
              padding: '25px',
              border: '2px solid gold'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {achievements.map(achievement => (
                  <div key={achievement.id} style={{
                    background: 'rgba(255, 215, 0, 0.1)',
                    border: '2px solid gold',
                    borderRadius: '15px',
                    padding: '20px',
                    textAlign: 'center',
                    position: 'relative'
                  }}>
                    {/* Action buttons */}
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      display: 'flex',
                      gap: '5px'
                    }}>
                      <button
                        onClick={() => handleEditAchievement(achievement)}
                        style={{
                          background: 'rgba(131, 56, 236, 0.2)',
                          border: '1px solid #8338ec',
                          color: '#8338ec',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.7rem'
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteAchievementClick(achievement)}
                        style={{
                          background: 'rgba(255, 23, 68, 0.2)',
                          border: '1px solid #ff1744',
                          color: '#ff1744',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.7rem'
                        }}
                      >
                        🗑️
                      </button>
                    </div>

                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🏆</div>
                    <h4 style={{ color: 'gold', margin: '0 0 10px 0' }}>{achievement.title}</h4>
                    <p style={{ color: '#b8b8b8', fontSize: '0.9rem', margin: '0 0 15px 0' }}>
                      {achievement.description}
                    </p>
                    <div style={{
                      background: 'rgba(131, 56, 236, 0.3)',
                      color: '#8338ec',
                      padding: '5px 10px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      display: 'inline-block'
                    }}>
                      📂 {achievement.category}
                    </div>
                  </div>
                ))}

                {achievements.length === 0 && (
                  <div style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '40px',
                    color: '#b8b8b8'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏆</div>
                    <h4>Aucun trophée disponible</h4>
                    <p>Créez votre premier trophée pour motiver les pumpers !</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'banned' && (
          <div style={{
            background: 'rgba(26, 0, 51, 0.6)',
            borderRadius: '15px',
            padding: '25px',
            border: '2px solid #ff1744'
          }}>
            <h3 style={{ color: '#ff1744', marginBottom: '20px' }}>🚫 Pumpers bannis</h3>

            {bannedUsers.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#b8b8b8'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎉</div>
                <h4>Aucun pumper banni</h4>
                <p>L'univers PixelPump est en paix !</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #ff1744' }}>
                      <th style={{ padding: '10px', textAlign: 'left', color: '#ff1744' }}>Pumper banni</th>
                      <th style={{ padding: '10px', textAlign: 'left', color: '#ff1744' }}>Email</th>
                      <th style={{ padding: '10px', textAlign: 'left', color: '#ff1744' }}>Niveau atteint</th>
                      <th style={{ padding: '10px', textAlign: 'left', color: '#ff1744' }}>XP total</th>
                      <th style={{ padding: '10px', textAlign: 'left', color: '#ff1744' }}>Quêtes complétées</th>
                      <th style={{ padding: '10px', textAlign: 'left', color: '#ff1744' }}>Banni le</th>
                      <th style={{ padding: '10px', textAlign: 'left', color: '#ff1744' }}>Banni par</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bannedUsers.map((bannedUser, index) => (
                      <tr key={`banned-${index}`} style={{
                        borderBottom: '1px solid rgba(255, 23, 68, 0.2)',
                        background: 'rgba(255, 23, 68, 0.05)'
                      }}>
                        <td style={{ padding: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              background: '#ff1744',
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '0.7rem',
                              fontWeight: 'bold'
                            }}>
                              🚫
                            </span>
                            <strong style={{ textDecoration: 'line-through', opacity: 0.7 }}>
                              {bannedUser.username}
                            </strong>
                          </div>
                        </td>
                        <td style={{ padding: '10px', color: '#b8b8b8', opacity: 0.7 }}>
                          {bannedUser.email}
                        </td>
                        <td style={{ padding: '10px', color: '#ff1744', fontWeight: 'bold' }}>
                          {bannedUser.level}
                        </td>
                        <td style={{ padding: '10px', color: '#ff1744' }}>
                          {bannedUser.xp}
                        </td>
                        <td style={{ padding: '10px', color: '#ff1744' }}>
                          {bannedUser.total_quests_completed}
                        </td>
                        <td style={{ padding: '10px', color: '#b8b8b8', fontSize: '0.8rem' }}>
                          {new Date(bannedUser.bannedAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '10px', color: '#ff1744', fontWeight: 'bold' }}>
                          {bannedUser.bannedBy}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {bannedUsers.length > 0 && (
              <div style={{
                marginTop: '20px',
                padding: '15px',
                background: 'rgba(255, 23, 68, 0.1)',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <p style={{ color: '#ff1744', margin: 0 }}>
                  📊 Total de pumpers bannis : <strong>{bannedUsers.length}</strong>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quest Modals */}
      <QuestModal
        isOpen={showQuestModal}
        onClose={() => setShowQuestModal(false)}
        onSave={handleSaveQuest}
        quest={selectedQuest}
        mode={questModalMode}
      />

      <ConfirmModal
        isOpen={showDeleteQuestModal}
        onClose={() => setShowDeleteQuestModal(false)}
        onConfirm={confirmDeleteQuest}
        title="Supprimer la quête"
        message={`Êtes-vous sûr de vouloir supprimer la quête "${questToDelete?.title}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />

      {/* Achievement Modals */}
      <AchievementModal
        isOpen={showAchievementModal}
        onClose={() => setShowAchievementModal(false)}
        onSave={handleSaveAchievement}
        achievement={selectedAchievement}
        mode={achievementModalMode}
      />

      <ConfirmModal
        isOpen={showDeleteAchievementModal}
        onClose={() => setShowDeleteAchievementModal(false)}
        onConfirm={confirmDeleteAchievement}
        title="Supprimer le trophée"
        message={`Êtes-vous sûr de vouloir supprimer le trophée "${achievementToDelete?.title}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />

      {/* Modal pour ajouter de l'XP */}
      {showXpModal && selectedUserForXp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #0a0014 0%, #1a0033 50%, #0a0014 100%)',
            borderRadius: '15px',
            padding: '30px',
            border: '2px solid #06ffa5',
            minWidth: '400px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#06ffa5', marginBottom: '20px' }}>
              💎 Ajouter de l'XP à {selectedUserForXp.username}
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                color: '#b8b8b8', 
                marginBottom: '10px',
                fontSize: '0.9rem'
              }}>
                Montant d'XP à ajouter:
              </label>
              <input
                type="number"
                min="1"
                max="10000"
                value={xpToAdd}
                onChange={(e) => setXpToAdd(parseInt(e.target.value) || 0)}
                style={{
                  background: 'rgba(26, 0, 51, 0.8)',
                  border: '2px solid #06ffa5',
                  color: 'white',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  width: '150px',
                  textAlign: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                }}
                placeholder="XP"
                autoFocus
              />
              <div style={{ 
                color: '#b8b8b8', 
                fontSize: '0.8rem', 
                marginTop: '5px' 
              }}>
                (1 - 10,000 XP)
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={handleAddXpToUser}
                disabled={xpToAdd <= 0 || xpToAdd > 10000}
                style={{
                  background: xpToAdd > 0 && xpToAdd <= 10000 ? 
                    'linear-gradient(135deg, #06ffa5, #00cc7a)' : '#666',
                  border: 'none',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: xpToAdd > 0 && xpToAdd <= 10000 ? 'pointer' : 'not-allowed',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}
              >
                ✅ Ajouter {xpToAdd} XP
              </button>
              
              <button
                onClick={() => {
                  setShowXpModal(false);
                  setSelectedUserForXp(null);
                  setXpToAdd(100);
                }}
                style={{
                  background: 'rgba(255, 0, 110, 0.2)',
                  border: '2px solid #ff006e',
                  color: '#ff006e',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ❌ Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return '#06ffa5';
    case 'medium': return '#ff006e';
    case 'hard': return '#8338ec';
    default: return '#666';
  }
};

export default AdminDashboard;

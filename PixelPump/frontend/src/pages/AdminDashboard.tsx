import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

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

interface Quest {
  id: string;
  title: string;
  description: string;
  category: string;
  xp_reward: number;
  difficulty: string;
  type: string;
}

interface Achievement {
  id: string;
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
  const [quests, setQuests] = useState<Quest[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  
  // States pour les actions
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [notification, setNotification] = useState('');

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

    try {
      setLoading(true);
      const promises = selectedUsers.map(userId => {
        switch (bulkAction) {
          case 'addXp':
            return api.patch(`/users/${userId}/xp`, { xp: 100 });
          case 'resetProgress':
            return api.patch(`/users/${userId}`, { xp: 0, level: 1, streak: 0 });
          default:
            return Promise.resolve();
        }
      });
      
      await Promise.all(promises);
      setNotification(`✅ Action "${bulkAction}" appliquée à ${selectedUsers.length} utilisateur(s)`);
      setSelectedUsers([]);
      setBulkAction('');
      fetchUsers();
    } catch (error) {
      setNotification('❌ Erreur lors de l\'exécution de l\'action');
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
            { id: 'quests', label: '⚔️ Quêtes', icon: '⚔️' },
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
                  <option value="addXp">Ajouter 100 XP</option>
                  <option value="resetProgress">Réinitialiser progression</option>
                </select>
                
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
                              setSelectedUsers(users.map(u => u.id));
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
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} style={{ borderBottom: '1px solid rgba(255, 0, 110, 0.2)' }}>
                        <td style={{ padding: '10px' }}>
                          <input
                            type="checkbox"
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'quests' && (
          <div style={{
            background: 'rgba(26, 0, 51, 0.6)',
            borderRadius: '15px',
            padding: '25px',
            border: '2px solid #06ffa5'
          }}>
            <h3 style={{ color: '#06ffa5', marginBottom: '20px' }}>⚔️ Gestion des quêtes</h3>
            
            <div style={{ display: 'grid', gap: '15px' }}>
              {quests.map(quest => (
                <div key={quest.id} style={{
                  background: 'rgba(6, 255, 165, 0.1)',
                  border: '1px solid #06ffa5',
                  borderRadius: '10px',
                  padding: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                    <div>
                      <h4 style={{ color: '#06ffa5', margin: '0 0 5px 0' }}>{quest.title}</h4>
                      <p style={{ color: '#b8b8b8', margin: '0', fontSize: '0.9rem' }}>{quest.description}</p>
                    </div>
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
                  
                  <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem' }}>
                    <span style={{
                      background: 'rgba(131, 56, 236, 0.3)',
                      color: '#8338ec',
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}>
                      {quest.category}
                    </span>
                    <span style={{
                      background: 'rgba(255, 0, 110, 0.3)',
                      color: '#ff006e',
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}>
                      {quest.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div style={{
            background: 'rgba(26, 0, 51, 0.6)',
            borderRadius: '15px',
            padding: '25px',
            border: '2px solid gold'
          }}>
            <h3 style={{ color: 'gold', marginBottom: '20px' }}>🏆 Gestion des succès</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {achievements.map(achievement => (
                <div key={achievement.id} style={{
                  background: 'rgba(255, 215, 0, 0.1)',
                  border: '2px solid gold',
                  borderRadius: '15px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
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
                    {achievement.category}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
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

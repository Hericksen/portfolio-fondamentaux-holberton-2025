import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../hooks/useDashboard';

function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { dashboardData, loading, error, refreshDashboard } = useDashboard();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0014 0%, #1a0033 25%, #2d1b69 50%, #1a0033 75%, #0a0014 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.5rem'
      }}>
        🔄 Chargement de votre dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0014 0%, #1a0033 25%, #2d1b69 50%, #1a0033 75%, #0a0014 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.2rem',
        textAlign: 'center'
      }}>
        <div style={{ color: '#ff6b6b', marginBottom: '20px' }}>
          ❌ Erreur: {error}
        </div>
        <button
          onClick={refreshDashboard}
          style={{
            padding: '10px 20px',
            background: '#ff006e',
            border: 'none',
            color: 'white',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0014 0%, #1a0033 25%, #2d1b69 50%, #1a0033 75%, #0a0014 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.2rem'
      }}>
        Aucune donnée disponible
      </div>
    );
  }

  const { user, goals, weeklyStats, nextLevel, recentActivity } = dashboardData;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0014 0%, #1a0033 25%, #2d1b69 50%, #1a0033 75%, #0a0014 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header avec navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/profile" style={{
              padding: '10px 20px', background: 'transparent', border: '2px solid #8338ec',
              color: '#8338ec', borderRadius: '5px', fontSize: '0.9rem', fontWeight: 'bold',
              textTransform: 'uppercase', cursor: 'pointer', textDecoration: 'none',
              boxShadow: '0 0 15px rgba(131, 56, 236, 0.3)', transition: 'all 0.3s ease'
            }}>PROFIL</Link>
            <Link to="/quests" style={{
              padding: '10px 20px', background: 'transparent', border: '2px solid #ffbe0b',
              color: '#ffbe0b', borderRadius: '5px', fontSize: '0.9rem', fontWeight: 'bold',
              textTransform: 'uppercase', cursor: 'pointer', textDecoration: 'none',
              boxShadow: '0 0 15px rgba(255, 190, 11, 0.3)', transition: 'all 0.3s ease'
            }}>QUÊTES</Link>
            <Link to="/admin" style={{
              padding: '10px 20px', background: 'transparent', border: '2px solid #06ffa5',
              color: '#06ffa5', borderRadius: '5px', fontSize: '0.9rem', fontWeight: 'bold',
              textTransform: 'uppercase', cursor: 'pointer', textDecoration: 'none',
              boxShadow: '0 0 15px rgba(6, 255, 165, 0.3)', transition: 'all 0.3s ease'
            }}>ADMIN</Link>
            <Link to="/database" style={{
              padding: '10px 20px', background: 'transparent', border: '2px solid #ff006e',
              color: '#ff006e', borderRadius: '5px', fontSize: '0.9rem', fontWeight: 'bold',
              textTransform: 'uppercase', cursor: 'pointer', textDecoration: 'none',
              boxShadow: '0 0 15px rgba(255, 0, 110, 0.3)', transition: 'all 0.3s ease'
            }}>DATABASE</Link>
          </div>
          
          <button onClick={handleLogout} style={{
            padding: '10px 20px', background: 'transparent', border: '2px solid #ff6b6b',
            color: '#ff6b6b', borderRadius: '5px', fontSize: '0.9rem', fontWeight: 'bold',
            textTransform: 'uppercase', cursor: 'pointer',
            boxShadow: '0 0 15px rgba(255, 107, 107, 0.3)', transition: 'all 0.3s ease'
          }}>LOGOUT</button>
        </div>

        {/* Header Utilisateur */}
        <div style={{ 
          background: 'rgba(26, 0, 51, 0.8)', border: '2px solid #ff006e', borderRadius: '15px',
          padding: '30px', marginBottom: '30px', boxShadow: '0 0 20px rgba(255, 0, 110, 0.3)',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '3rem', fontWeight: 'bold', textTransform: 'uppercase',
            color: '#ff006e', textShadow: '0 0 20px #ff006e', marginBottom: '10px'
          }}>
            DASHBOARD DE {user.username}
          </h1>
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            gap: '30px', flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: '#ffbe0b', fontWeight: 'bold' }}>
                NIVEAU {user.level}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#ccc' }}>Niveau Actuel</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: '#8338ec', fontWeight: 'bold' }}>
                {user.xp} XP
              </div>
              <div style={{ fontSize: '0.9rem', color: '#ccc' }}>Expérience Totale</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: '#06ffa5', fontWeight: 'bold' }}>
                {user.streak} 🔥
              </div>
              <div style={{ fontSize: '0.9rem', color: '#ccc' }}>Série de Jours</div>
            </div>
          </div>
        </div>

        {/* Grille des statistiques */}
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '20px', marginBottom: '30px'
        }}>
          
          {/* Progression niveau */}
          <div style={{
            background: 'rgba(26, 0, 51, 0.8)', border: '2px solid #8338ec', borderRadius: '10px',
            padding: '20px', boxShadow: '0 0 20px rgba(131, 56, 236, 0.3)'
          }}>
            <h3 style={{ 
              color: '#8338ec', marginBottom: '15px', fontSize: '1.2rem',
              fontWeight: 'bold', textAlign: 'center'
            }}>🎯 PROGRESSION NIVEAU</h3>
            <div style={{
              background: 'rgba(131, 56, 236, 0.2)', height: '20px', borderRadius: '10px',
              overflow: 'hidden', border: '1px solid #8338ec', marginBottom: '10px'
            }}>
              <div style={{
                background: 'linear-gradient(90deg, #8338ec, #ff006e)', height: '100%',
                width: `${nextLevel.progress}%`, borderRadius: '10px', transition: 'width 0.3s ease'
              }}></div>
            </div>
            <div style={{ textAlign: 'center', color: '#fff', fontSize: '0.9rem' }}>
              {nextLevel.xpNeeded} XP pour le niveau {nextLevel.currentLevel + 1}
            </div>
          </div>

          {/* Objectifs quotidiens */}
          <div style={{
            background: 'rgba(26, 0, 51, 0.8)', border: '2px solid #ffbe0b', borderRadius: '10px',
            padding: '20px', boxShadow: '0 0 20px rgba(255, 190, 11, 0.3)'
          }}>
            <h3 style={{ 
              color: '#ffbe0b', marginBottom: '15px', fontSize: '1.2rem',
              fontWeight: 'bold', textAlign: 'center'
            }}>📋 OBJECTIFS QUOTIDIENS</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Quêtes Complétées</span>
              <span style={{ color: '#ffbe0b', fontWeight: 'bold' }}>
                {goals.dailyQuests.completed}/{goals.dailyQuests.target}
              </span>
            </div>
            <div style={{
              background: 'rgba(255, 190, 11, 0.2)', height: '10px', borderRadius: '5px', overflow: 'hidden'
            }}>
              <div style={{
                background: '#ffbe0b', height: '100%',
                width: `${Math.min(100, (goals.dailyQuests.completed / goals.dailyQuests.target) * 100)}%`,
                borderRadius: '5px'
              }}></div>
            </div>
            {goals.dailyQuests.remaining > 0 && (
              <div style={{ fontSize: '0.8rem', color: '#ccc', marginTop: '5px' }}>
                Encore {goals.dailyQuests.remaining} quête(s) à terminer
              </div>
            )}
          </div>

          {/* Stats hebdomadaires */}
          <div style={{
            background: 'rgba(26, 0, 51, 0.8)', border: '2px solid #06ffa5', borderRadius: '10px',
            padding: '20px', boxShadow: '0 0 20px rgba(6, 255, 165, 0.3)'
          }}>
            <h3 style={{ 
              color: '#06ffa5', marginBottom: '15px', fontSize: '1.2rem',
              fontWeight: 'bold', textAlign: 'center'
            }}>📊 CETTE SEMAINE</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Quêtes Terminées</span>
                <span style={{ color: '#06ffa5', fontWeight: 'bold' }}>{weeklyStats.questsCompleted}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>XP Gagné</span>
                <span style={{ color: '#06ffa5', fontWeight: 'bold' }}>{weeklyStats.xpEarned}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Série Actuelle</span>
                <span style={{ color: '#06ffa5', fontWeight: 'bold' }}>{weeklyStats.streakDays} jours 🔥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activités récentes */}
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px'
        }}>
          
          {/* Quêtes récentes */}
          <div style={{
            background: 'rgba(26, 0, 51, 0.8)', border: '2px solid #ff006e', borderRadius: '10px',
            padding: '20px', boxShadow: '0 0 20px rgba(255, 0, 110, 0.3)'
          }}>
            <h3 style={{ 
              color: '#ff006e', marginBottom: '15px', fontSize: '1.2rem',
              fontWeight: 'bold', textAlign: 'center'
            }}>⚔️ QUÊTES RÉCENTES</h3>
            {recentActivity.quests.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recentActivity.quests.map((userQuest, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 0, 110, 0.1)', border: '1px solid rgba(255, 0, 110, 0.3)',
                    borderRadius: '5px', padding: '10px'
                  }}>
                    <div style={{ 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px'
                    }}>
                      <span style={{ fontWeight: 'bold', color: '#ff006e' }}>{userQuest.Quest.title}</span>
                      <span style={{ 
                        fontSize: '0.8rem', fontWeight: 'bold',
                        color: userQuest.is_completed ? '#06ffa5' : '#ffbe0b'
                      }}>
                        {userQuest.is_completed ? '✅ TERMINÉ' : '⏳ EN COURS'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#ccc' }}>{userQuest.Quest.description}</div>
                    <div style={{ 
                      fontSize: '0.7rem', color: '#8338ec', marginTop: '5px',
                      display: 'flex', justifyContent: 'space-between'
                    }}>
                      <span>📊 {userQuest.Quest.category}</span>
                      <span>🎯 {userQuest.Quest.xp_reward} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#ccc', fontSize: '0.9rem' }}>
                Aucune quête récente
              </div>
            )}
          </div>

          {/* Achievements récents */}
          <div style={{
            background: 'rgba(26, 0, 51, 0.8)', border: '2px solid #ffbe0b', borderRadius: '10px',
            padding: '20px', boxShadow: '0 0 20px rgba(255, 190, 11, 0.3)'
          }}>
            <h3 style={{ 
              color: '#ffbe0b', marginBottom: '15px', fontSize: '1.2rem',
              fontWeight: 'bold', textAlign: 'center'
            }}>🏆 SUCCÈS RÉCENTS</h3>
            {recentActivity.achievements.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recentActivity.achievements.map((userAchievement, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 190, 11, 0.1)', border: '1px solid rgba(255, 190, 11, 0.3)',
                    borderRadius: '5px', padding: '10px'
                  }}>
                    <div style={{ 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px'
                    }}>
                      <span style={{ fontWeight: 'bold', color: '#ffbe0b' }}>
                        {userAchievement.Achievement.icon} {userAchievement.Achievement.title}
                      </span>
                      <span style={{ 
                        fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase',
                        color: userAchievement.Achievement.rarity === 'legendary' ? '#ff006e' : 
                               userAchievement.Achievement.rarity === 'epic' ? '#8338ec' : '#06ffa5'
                      }}>
                        {userAchievement.Achievement.rarity}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#ccc' }}>{userAchievement.Achievement.description}</div>
                    <div style={{ 
                      fontSize: '0.7rem', color: '#ffbe0b', marginTop: '5px', textAlign: 'right'
                    }}>
                      +{userAchievement.Achievement.xp_reward} XP
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#ccc', fontSize: '0.9rem' }}>
                Aucun succès récent
              </div>
            )}
          </div>
        </div>

        {/* Bouton de rafraîchissement */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button onClick={refreshDashboard} style={{
            padding: '12px 25px', background: 'linear-gradient(135deg, #ff006e, #8338ec)',
            border: 'none', color: 'white', borderRadius: '8px', fontSize: '1rem',
            fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase',
            boxShadow: '0 0 15px rgba(255, 0, 110, 0.5)', transition: 'all 0.3s ease'
          }}>
            🔄 Actualiser le Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../hooks/useDashboard';
import { QuestWidget } from '../components/QuestWidget';

function Dashboard() {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
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
        fontSize: '1.5rem',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid #ff006e',
          borderTop: '4px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        🔄 Chargement de votre dashboard...
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
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
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{ color: '#ff6b6b', marginBottom: '20px', fontSize: '3rem' }}>
          ⚠️
      </div>
        <div style={{ marginBottom: '20px' }}>
          {error}
        </div>
        <button
          onClick={refreshDashboard}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #ff006e, #8338ec)',
            border: 'none',
            color: 'white',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          🔄 Réessayer
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
      overflow: 'auto'
    }}>
      
      {/* Header avec navigation */}
      <header style={{
        background: 'rgba(26, 0, 51, 0.95)',
        borderBottom: '2px solid #ff006e',
        backdropFilter: 'blur(15px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 20px rgba(255, 0, 110, 0.2)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '15px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          
          {/* Logo */}
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #ff006e, #06ffa5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(255, 0, 110, 0.3)'
          }}>
            ⚡ PixelPump
          </div>
          
          {/* Navigation */}
          <nav style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Link to="/dashboard" style={{ 
              color: '#ff006e', 
              textDecoration: 'none', 
              fontWeight: 'bold',
              padding: '10px 20px',
              borderRadius: '25px',
              background: 'rgba(255, 0, 110, 0.1)',
              border: '2px solid #ff006e',
              transition: 'all 0.3s ease',
              fontSize: '0.9rem',
              textTransform: 'uppercase'
            }}>
              🏠 Dashboard
            </Link>
            <Link to="/quests" style={{ 
              color: '#8338ec', 
              textDecoration: 'none', 
              fontWeight: 'bold',
              padding: '10px 20px',
              borderRadius: '25px',
              transition: 'all 0.3s ease',
              fontSize: '0.9rem',
              textTransform: 'uppercase'
            }}>
              ⚔️ Quêtes
            </Link>
            <Link to="/profile" style={{ 
              color: '#06ffa5', 
              textDecoration: 'none', 
              fontWeight: 'bold',
              padding: '10px 20px',
              borderRadius: '25px',
              transition: 'all 0.3s ease',
              fontSize: '0.9rem',
              textTransform: 'uppercase'
            }}>
              👤 Profil
            </Link>
            {authUser?.role === 'admin' && (
              <Link to="/admin-dashboard" style={{ 
                color: 'gold', 
                textDecoration: 'none', 
                fontWeight: 'bold',
                padding: '10px 20px',
                borderRadius: '25px',
                border: '2px solid gold',
                transition: 'all 0.3s ease',
                fontSize: '0.9rem',
                textTransform: 'uppercase'
              }}>
                👑 Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '2px solid #ff006e',
                color: '#ff006e',
                padding: '10px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                fontSize: '0.9rem',
                textTransform: 'uppercase'
              }}
              onMouseOver={(e) => {
                (e.target as HTMLButtonElement).style.background = '#ff006e';
                (e.target as HTMLButtonElement).style.color = 'white';
                (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                (e.target as HTMLButtonElement).style.boxShadow = '0 5px 15px rgba(255, 0, 110, 0.4)';
              }}
              onMouseOut={(e) => {
                (e.target as HTMLButtonElement).style.background = 'transparent';
                (e.target as HTMLButtonElement).style.color = '#ff006e';
                (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.target as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              🚪 Déconnexion
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        
        {/* Hero Section */}
        <section style={{
          background: 'rgba(26, 0, 51, 0.6)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '30px',
          textAlign: 'center',
          border: '2px solid #ff006e',
          boxShadow: '0 0 30px rgba(255, 0, 110, 0.2)'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #ff006e 0%, #8338ec 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '15px',
            textShadow: '0 0 30px rgba(255, 0, 110, 0.3)'
          }}>
            Bienvenue, {user.username}! 🎮
          </h1>
          <p style={{ 
            color: '#b8b8b8', 
            fontSize: '1.3rem',
            marginBottom: '20px'
          }}>
            Votre aventure fitness continue...
          </p>
          
          {/* Quick Stats */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '40px',
            marginTop: '30px',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#ff006e',
                textShadow: '0 0 15px rgba(255, 0, 110, 0.5)'
              }}>
                Niv. {user.level}
              </div>
              <div style={{ color: '#8338ec', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                Niveau
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#06ffa5',
                textShadow: '0 0 15px rgba(6, 255, 165, 0.5)'
              }}>
                {user.xp}
              </div>
              <div style={{ color: '#8338ec', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                XP Total
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#8338ec',
                textShadow: '0 0 15px rgba(131, 56, 236, 0.5)'
              }}>
                {user.streak}
              </div>
              <div style={{ color: '#8338ec', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                Série
              </div>
            </div>
          </div>
        </section>

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '25px',
          marginBottom: '30px'
        }}>
          
          {/* Progress Card */}
          <div style={{
            background: 'rgba(26, 0, 51, 0.6)',
            borderRadius: '15px',
            padding: '25px',
            border: '2px solid #8338ec',
            boxShadow: '0 0 20px rgba(131, 56, 236, 0.2)'
          }}>
            <h3 style={{
              color: '#8338ec',
              marginBottom: '20px',
              fontSize: '1.4rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              📊 Progression
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '8px' 
              }}>
                <span>Vers niveau {nextLevel.currentLevel + 1}</span>
                <span>{user.xp}/{nextLevel.xpNeeded + user.xp}</span>
              </div>
              <div style={{
                background: 'rgba(131, 56, 236, 0.2)',
                borderRadius: '10px',
                height: '12px',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: 'linear-gradient(90deg, #8338ec, #ff006e)',
                  height: '100%',
                  width: `${(user.xp / (nextLevel.xpNeeded + user.xp)) * 100}%`,
                  transition: 'width 0.5s ease'
                }}></div>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              fontSize: '0.9rem',
              color: '#b8b8b8'
            }}>
              <span>XP restant: {nextLevel.xpNeeded}</span>
              <span>Progres: {Math.round((user.xp / (nextLevel.xpNeeded + user.xp)) * 100)}%</span>
            </div>
          </div>

          {/* Goals Card */}
          <div style={{
            background: 'rgba(26, 0, 51, 0.6)',
            borderRadius: '15px',
            padding: '25px',
            border: '2px solid #06ffa5',
            boxShadow: '0 0 20px rgba(6, 255, 165, 0.2)'
          }}>
            <h3 style={{
              color: '#06ffa5',
              marginBottom: '20px',
              fontSize: '1.4rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              🎯 Objectifs
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Quêtes quotidiennes</span>
                  <span>{goals.dailyQuests.completed}/{goals.dailyQuests.target}</span>
                </div>
                <div style={{
                  background: 'rgba(6, 255, 165, 0.2)',
                  borderRadius: '8px',
                  height: '8px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: '#06ffa5',
                    height: '100%',
                    width: `${(goals.dailyQuests.completed / goals.dailyQuests.target) * 100}%`,
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>XP hebdomadaire</span>
                  <span>{goals.weeklyXp.earned}/{goals.weeklyXp.target}</span>
                </div>
                <div style={{
                  background: 'rgba(6, 255, 165, 0.2)',
                  borderRadius: '8px',
                  height: '8px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: '#06ffa5',
                    height: '100%',
                    width: `${(goals.weeklyXp.earned / goals.weeklyXp.target) * 100}%`,
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Avatar Card */}
          <div style={{
            background: 'rgba(26, 0, 51, 0.6)',
            borderRadius: '15px',
            padding: '25px',
            border: '2px solid #ff006e',
            boxShadow: '0 0 20px rgba(255, 0, 110, 0.2)',
            textAlign: 'center'
          }}>
            <h3 style={{
              color: '#ff006e',
              marginBottom: '20px',
              fontSize: '1.4rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              🤖 Avatar
            </h3>
            
            <div style={{
              width: '100px',
              height: '100px',
              background: user.avatar.background === 'gym' ? 
                'linear-gradient(135deg, #ff006e, #8338ec)' : 
                'linear-gradient(135deg, #06ffa5, #8338ec)',
              borderRadius: '50%',
              margin: '0 auto 15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              border: '3px solid white',
              boxShadow: '0 0 20px rgba(255, 0, 110, 0.3)'
            }}>
              🏃‍♂️
            </div>
            
            <div style={{ color: '#b8b8b8', fontSize: '0.9rem' }}>
              {user.avatar.outfit} • {user.avatar.color}
            </div>
          </div>

          {/* Quêtes Avancées Card */}
          <QuestWidget />
        </div>

        {/* Recent Activity */}
        <section style={{
          background: 'rgba(26, 0, 51, 0.6)',
          borderRadius: '15px',
          padding: '25px',
          border: '2px solid #8338ec',
          boxShadow: '0 0 20px rgba(131, 56, 236, 0.2)'
        }}>
          <h3 style={{
            color: '#8338ec',
            marginBottom: '20px',
            fontSize: '1.4rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            📈 Activité récente
          </h3>
          
          {recentActivity.quests.length > 0 || recentActivity.achievements.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {recentActivity.quests.map((quest: any, index: number) => (
                <div key={index} style={{
                  background: 'rgba(6, 255, 165, 0.1)',
                  padding: '15px',
                  borderRadius: '10px',
                  border: '1px solid #06ffa5'
                }}>
                  <div style={{ fontWeight: 'bold', color: '#06ffa5' }}>
                    ✅ {quest.title}
                  </div>
                  <div style={{ color: '#b8b8b8', fontSize: '0.9rem' }}>
                    +{quest.xp_reward} XP
                  </div>
                </div>
              ))}
              
              {recentActivity.achievements.map((achievement: any, index: number) => (
                <div key={index} style={{
                  background: 'rgba(255, 0, 110, 0.1)',
                  padding: '15px',
                  borderRadius: '10px',
                  border: '1px solid #ff006e'
                }}>
                  <div style={{ fontWeight: 'bold', color: '#ff006e' }}>
                    🏆 {achievement.title}
                  </div>
                  <div style={{ color: '#b8b8b8', fontSize: '0.9rem' }}>
                    {achievement.description}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              color: '#b8b8b8', 
              padding: '40px',
              fontSize: '1.1rem'
            }}>
              🌟 Commencez votre aventure ! Visitez la section Quêtes pour débuter.
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section style={{
          marginTop: '30px',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <Link to="/quests" style={{
            background: 'linear-gradient(135deg, #06ffa5, #8338ec)',
            color: 'white',
            textDecoration: 'none',
            padding: '15px 30px',
            borderRadius: '25px',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            textTransform: 'uppercase',
            transition: 'all 0.3s ease',
            boxShadow: '0 5px 15px rgba(6, 255, 165, 0.3)'
          }}>
            ⚔️ Voir les Quêtes
          </Link>
          
          <Link to="/profile" style={{
            background: 'linear-gradient(135deg, #ff006e, #8338ec)',
            color: 'white',
            textDecoration: 'none',
            padding: '15px 30px',
            borderRadius: '25px',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            textTransform: 'uppercase',
            transition: 'all 0.3s ease',
            boxShadow: '0 5px 15px rgba(255, 0, 110, 0.3)'
          }}>
            👤 Mon Profil
          </Link>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;

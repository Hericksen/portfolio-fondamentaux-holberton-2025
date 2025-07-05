import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../hooks/useDashboard';
import { PixelAvatar } from '../components/PixelAvatar';
import { AdvancedQuestsDashboard } from '../components/AdvancedQuestsDashboard';
import { ModernAvatarCustomizer } from '../components/ModernAvatarCustomizer';

function Dashboard() {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const { dashboardData, loading, error, refreshDashboard } = useDashboard();
  const [showAvatarCustomizer, setShowAvatarCustomizer] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(dashboardData?.user?.avatar || {});

  // Synchroniser l'avatar local avec les données du dashboard
  useEffect(() => {
    if (dashboardData?.user?.avatar) {
      setCurrentAvatar(dashboardData.user.avatar);
    }
  }, [dashboardData?.user?.avatar]);

  // Fonction pour sauvegarder l'avatar
  const handleAvatarChange = async (newAvatar: any) => {
    try {
      // Mettre à jour l'état local immédiatement pour un retour visuel instantané
      setCurrentAvatar(newAvatar);

      // Envoyer la mise à jour au serveur
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/avatar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ avatar: newAvatar })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde de l\'avatar');
      }

      console.log('Avatar sauvegardé avec succès:', newAvatar);
      
      // Optionnel: rafraîchir les données du dashboard
      // refreshDashboard();

    } catch (error) {
      console.error('Erreur sauvegarde avatar:', error);
      // En cas d'erreur, revenir à l'avatar précédent
      setCurrentAvatar(dashboardData?.user?.avatar || {});
    }
  };

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

  const { user } = dashboardData;

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
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          
          {/* Logo */}
          <div style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #ff006e, #06ffa5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(255, 0, 110, 0.3)',
            minWidth: 'fit-content'
          }}>
            ⚡ PixelPump
          </div>
          
          {/* Navigation */}
          <nav style={{ 
            display: 'flex', 
            gap: 'clamp(8px, 2vw, 15px)', 
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {authUser?.role === 'admin' && (
              <>
                <Link to="/admin-dashboard" style={{ 
                  color: 'gold', 
                  textDecoration: 'none', 
                  fontWeight: 'bold',
                  padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 20px)',
                  borderRadius: '25px',
                  border: '2px solid gold',
                  transition: 'all 0.3s ease',
                  fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap'
                }}>
                  👑 Admin
                </Link>
              </>
            )}
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '2px solid #ff006e',
                color: '#ff006e',
                padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 20px)',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
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
      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: 'clamp(20px, 5vw, 30px) clamp(15px, 4vw, 20px)' 
      }}>
        
        {/* Hero Section - Profil Utilisateur Unifié */}
        <section style={{
          background: 'linear-gradient(135deg, rgba(26, 0, 51, 0.8) 0%, rgba(45, 27, 105, 0.6) 100%)',
          borderRadius: '20px',
          padding: 'clamp(25px, 5vw, 40px)',
          marginBottom: '30px',
          border: '2px solid #ff006e',
          boxShadow: '0 0 30px rgba(255, 0, 110, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          
          {/* Background Effects */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 20% 20%, rgba(255, 0, 110, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6, 255, 165, 0.1) 0%, transparent 50%)',
            zIndex: -1
          }}></div>
          
          {/* Header du Profil */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'clamp(20px, 4vw, 30px)',
            marginBottom: 'clamp(25px, 5vw, 40px)',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            
            {/* Avatar */}
            <div style={{
              width: 'clamp(80px, 15vw, 120px)',
              height: 'clamp(80px, 15vw, 120px)',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff006e, #8338ec, #06ffa5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              boxShadow: '0 0 30px rgba(255, 0, 110, 0.5)',
              border: '4px solid white',
              flexShrink: 0
            }}>
              <PixelAvatar avatarData={currentAvatar} size="large" />
            </div>
            
            {/* Informations Utilisateur */}
            <div style={{ 
              textAlign: 'center', 
              flex: 1, 
              minWidth: '250px',
              maxWidth: '100%'
            }}>
              <h1 style={{
                fontSize: 'clamp(1.8rem, 5vw, 3rem)',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #ff006e 0%, #8338ec 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '10px',
                textShadow: '0 0 30px rgba(255, 0, 110, 0.3)',
                wordBreak: 'break-word'
              }}>
                {user.username}
              </h1>
              <p style={{ 
                color: '#06ffa5', 
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                marginBottom: '10px',
                fontWeight: 'bold'
              }}>
                🎮 Aventurier Fitness Niveau {user.level}
              </p>
              <p style={{ 
                color: '#b8b8b8', 
                fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                fontStyle: 'italic'
              }}>
                Membre depuis {new Date(user.created_at).toLocaleDateString('fr-FR')}
              </p>
              
              {/* Bouton Personnalisation Avatar */}
              <button 
                onClick={() => setShowAvatarCustomizer(!showAvatarCustomizer)}
                style={{
                  display: 'inline-block',
                  marginTop: '15px',
                  padding: '10px 20px',
                  background: showAvatarCustomizer 
                    ? 'linear-gradient(135deg, #06ffa5, #8338ec)' 
                    : 'linear-gradient(135deg, #ff006e, #8338ec)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  fontWeight: 'bold',
                  fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(255, 0, 110, 0.3)',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 0, 110, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 0, 110, 0.3)';
                }}
              >
                {showAvatarCustomizer ? '✅ Fermer Customizer' : '🎨 Personnaliser Avatar'}
              </button>
            </div>
          </div>
          
          {/* Avatar Customizer */}
          {showAvatarCustomizer && (
            <div style={{ 
              marginBottom: '30px',
              background: 'rgba(131, 56, 236, 0.1)',
              borderRadius: '20px',
              padding: '25px',
              border: '2px solid #8338ec',
              boxShadow: '0 8px 30px rgba(131, 56, 236, 0.2)'
            }}>
              <h3 style={{
                color: '#8338ec',
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '20px',
                textTransform: 'uppercase'
              }}>
                🎨 Personnalisation Avatar
              </h3>
              <ModernAvatarCustomizer
                currentAvatar={currentAvatar}
                onAvatarChange={(newAvatar) => {
                  handleAvatarChange(newAvatar);
                }}
              />
            </div>
          )}
          
          {/* Statistiques Principales */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 'clamp(15px, 3vw, 20px)',
            marginBottom: '30px'
          }}>
            
            {/* Niveau et Progression */}
            <div style={{
              background: 'rgba(255, 0, 110, 0.1)',
              borderRadius: '15px',
              padding: 'clamp(15px, 4vw, 25px)',
              textAlign: 'center',
              border: '2px solid #ff006e'
            }}>
              <div style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: 'bold',
                color: '#ff006e',
                marginBottom: '10px'
              }}>
                Niv. {user.level}
              </div>
              <div style={{ 
                color: '#b8b8b8', 
                marginBottom: '15px',
                fontSize: 'clamp(0.8rem, 2vw, 1rem)'
              }}>
                Niveau Actuel
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(user.xp % 1000) / 10}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #ff006e, #8338ec)',
                  transition: 'width 0.5s ease'
                }}></div>
              </div>
              <div style={{ 
                color: '#8338ec', 
                fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)', 
                marginTop: '8px' 
              }}>
                {user.xp % 1000}/1000 XP
              </div>
            </div>
            
            {/* XP Total */}
            <div style={{
              background: 'rgba(6, 255, 165, 0.1)',
              borderRadius: '15px',
              padding: 'clamp(15px, 4vw, 25px)',
              textAlign: 'center',
              border: '2px solid #06ffa5'
            }}>
              <div style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: 'bold',
                color: '#06ffa5',
                marginBottom: '10px'
              }}>
                {user.xp.toLocaleString()}
              </div>
              <div style={{ 
                color: '#b8b8b8', 
                marginBottom: '10px',
                fontSize: 'clamp(0.8rem, 2vw, 1rem)'
              }}>
                Points d'Expérience
              </div>
              <div style={{ 
                color: '#06ffa5', 
                fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)'
              }}>
                ⭐ Total Gagné
              </div>
            </div>
            
            {/* Série Actuelle */}
            <div style={{
              background: 'rgba(131, 56, 236, 0.1)',
              borderRadius: '15px',
              padding: 'clamp(15px, 4vw, 25px)',
              textAlign: 'center',
              border: '2px solid #8338ec'
            }}>
              <div style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: 'bold',
                color: '#8338ec',
                marginBottom: '10px'
              }}>
                {user.streak}
              </div>
              <div style={{ 
                color: '#b8b8b8', 
                marginBottom: '10px',
                fontSize: 'clamp(0.8rem, 2vw, 1rem)'
              }}>
                Jours Consécutifs
              </div>
              <div style={{ 
                color: '#8338ec', 
                fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)'
              }}>
                🔥 Série Active
              </div>
            </div>
            
            {/* Quêtes Complétées */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.1), rgba(131, 56, 236, 0.1))',
              borderRadius: '15px',
              padding: 'clamp(15px, 4vw, 25px)',
              textAlign: 'center',
              border: '2px solid #ff006e'
            }}>
              <div style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #ff006e, #8338ec)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '10px'
              }}>
                {user.stats?.total_quests_completed || user.total_quests_completed || 0}
              </div>
              <div style={{ 
                color: '#b8b8b8', 
                marginBottom: '10px',
                fontSize: 'clamp(0.8rem, 2vw, 1rem)'
              }}>
                Quêtes Terminées
              </div>
              <div style={{ 
                color: '#ff006e', 
                fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)'
              }}>
                ⚔️ Succès
              </div>
            </div>
          </div>
        </section>
        
        {/* Section Quêtes Utilisateur */}
        <section style={{ marginBottom: '30px' }}>
          <div style={{
            background: 'rgba(26, 0, 51, 0.6)',
            border: '2px solid #ff006e',
            borderRadius: '20px',
            padding: 'clamp(20px, 4vw, 30px)',
            backdropFilter: 'blur(15px)',
            boxShadow: '0 8px 32px rgba(255, 0, 110, 0.2)'
          }}>
            <AdvancedQuestsDashboard />
          </div>
        </section>
        
      </main>

      {/* Footer */}
      <footer style={{
        background: 'rgba(26, 0, 51, 0.95)',
        color: '#b8b8b8',
        padding: 'clamp(15px, 3vw, 20px)',
        textAlign: 'center',
        borderTop: '2px solid #ff006e',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.9rem)' }}>
            &copy; {new Date().getFullYear()} PixelPump. Tous droits réservés.
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'clamp(10px, 2vw, 15px)',
            flexWrap: 'wrap'
          }}>
            <Link to="/terms" style={{ 
              color: '#06ffa5', 
              textDecoration: 'none', 
              fontSize: 'clamp(0.7rem, 2vw, 0.9rem)' 
            }}>
              Conditions d'utilisation
            </Link>
            <Link to="/privacy" style={{ 
              color: '#06ffa5', 
              textDecoration: 'none', 
              fontSize: 'clamp(0.7rem, 2vw, 0.9rem)' 
            }}>
              Politique de confidentialité
            </Link>
          </div>
        </div>
        
        {/* Background Circles */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255, 0, 110, 0.1) 0%, rgba(255, 0, 110, 0) 70%)',
            transform: 'translate(-50%, -50%)',
            zIndex: -1
          }}></div>
          <div style={{
            position: 'absolute',
            top: '50%',
            right: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(6, 255, 165, 0.1) 0%, rgba(6, 255, 165, 0) 70%)',
            transform: 'translate(50%, -50%)',
            zIndex: -1
          }}></div>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;

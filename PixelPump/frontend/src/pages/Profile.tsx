import React from 'react';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const achievements = [
    { id: 1, name: "PREMIER PAS", description: "Première quête complétée", icon: "🏆", unlocked: true },
    { id: 2, name: "MARATHONIEN", description: "7 jours consécutifs", icon: "🏃", unlocked: true },
    { id: 3, name: "CODEUR NINJA", description: "50 problèmes résolus", icon: "💻", unlocked: false },
    { id: 4, name: "FORCE BRUTE", description: "100 exercices de force", icon: "💪", unlocked: false },
    { id: 5, name: "MAÎTRE ZEN", description: "30 jours de méditation", icon: "🧘", unlocked: false },
    { id: 6, name: "LÉGENDE", description: "Niveau 50 atteint", icon: "👑", unlocked: false }
  ];

  const stats = [
    { label: "NIVEAU", value: "12", color: "#ff006e" },
    { label: "XP TOTAL", value: "2,547", color: "#ffbe0b" },
    { label: "QUÊTES COMPLÉTÉES", value: "47", color: "#06ffa5" },
    { label: "SÉRIE RECORD", value: "12 JOURS", color: "#8338ec" },
    { label: "TEMPS TOTAL", value: "23h 15m", color: "#ff006e" },
    { label: "ACHIEVEMENTS", value: "2/6", color: "#ffbe0b" }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0014 0%, #1a0033 25%, #2d1b69 50%, #1a0033 75%, #0a0014 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header avec navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <Link
            to="/dashboard"
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: '2px solid #8338ec',
              color: '#8338ec',
              borderRadius: '5px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              cursor: 'pointer',
              textDecoration: 'none',
              boxShadow: '0 0 15px rgba(131, 56, 236, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              const target = e.target as HTMLAnchorElement;
              target.style.background = '#8338ec';
              target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              const target = e.target as HTMLAnchorElement;
              target.style.background = 'transparent';
              target.style.color = '#8338ec';
            }}
          >
            ← RETOUR DASHBOARD
          </Link>
          
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            color: '#ff006e',
            textShadow: '0 0 20px #ff006e'
          }}>
            PROFIL
          </h1>
          
          <div></div>
        </div>

        {/* Profile Header */}
        <div style={{
          background: 'rgba(26, 0, 51, 0.8)',
          border: '2px solid #ff006e',
          borderRadius: '15px',
          padding: '40px',
          marginBottom: '30px',
          boxShadow: '0 0 30px rgba(255, 0, 110, 0.4)',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              width: '120px', 
              height: '120px', 
              margin: '0 auto',
              background: 'linear-gradient(135deg, #ff006e, #8338ec)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(255, 0, 110, 0.5)',
              fontSize: '3rem'
            }}>
              🤖
            </div>
          </div>
          
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#ff006e',
            marginBottom: '10px',
            textShadow: '0 0 15px #ff006e'
          }}>
            PIXEL_WARRIOR
          </h2>
          
          <p style={{
            fontSize: '1.2rem',
            color: '#8338ec',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            Niveau 12 • Guerrier du Code
          </p>
          
          {/* Barre de progression niveau */}
          <div style={{ marginTop: '20px', maxWidth: '400px', margin: '20px auto 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#ff006e', fontSize: '0.9rem', fontWeight: 'bold' }}>
                NIVEAU 12
              </span>
              <span style={{ color: '#8338ec', fontSize: '0.9rem', fontWeight: 'bold' }}>
                2,547 / 3,000 XP
              </span>
            </div>
            <div style={{
              background: 'rgba(0,0,0,0.5)',
              height: '12px',
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '85%',
                height: '100%',
                background: 'linear-gradient(90deg, #ff006e, #8338ec, #ffbe0b)',
                borderRadius: '6px',
                boxShadow: '0 0 15px rgba(255, 0, 110, 0.8)'
              }}></div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#ff006e',
          marginBottom: '20px',
          textTransform: 'uppercase'
        }}>
          STATISTIQUES
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(26, 0, 51, 0.8)',
                border: `2px solid ${stat.color}`,
                borderRadius: '10px',
                padding: '20px',
                textAlign: 'center',
                boxShadow: `0 0 20px ${stat.color}33`,
                transition: 'all 0.3s ease'
              }}
            >
              <p style={{
                color: stat.color,
                fontSize: '0.9rem',
                fontWeight: 'bold',
                marginBottom: '10px',
                textTransform: 'uppercase'
              }}>
                {stat.label}
              </p>
              <p style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: stat.color,
                textShadow: `0 0 10px ${stat.color}`
              }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#ff006e',
          marginBottom: '20px',
          textTransform: 'uppercase'
        }}>
          ACHIEVEMENTS
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              style={{
                background: achievement.unlocked 
                  ? 'rgba(6, 255, 165, 0.1)' 
                  : 'rgba(26, 0, 51, 0.5)',
                border: achievement.unlocked 
                  ? '2px solid #06ffa5' 
                  : '2px solid #333',
                borderRadius: '10px',
                padding: '20px',
                boxShadow: achievement.unlocked 
                  ? '0 0 20px rgba(6, 255, 165, 0.3)' 
                  : 'none',
                opacity: achievement.unlocked ? 1 : 0.6,
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{
                  fontSize: '2rem',
                  marginRight: '15px',
                  filter: achievement.unlocked ? 'none' : 'grayscale(100%)'
                }}>
                  {achievement.icon}
                </span>
                <div>
                  <h3 style={{
                    color: achievement.unlocked ? '#06ffa5' : '#666',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    marginBottom: '5px'
                  }}>
                    {achievement.name}
                  </h3>
                  <p style={{
                    color: achievement.unlocked ? '#8338ec' : '#555',
                    fontSize: '0.9rem'
                  }}>
                    {achievement.description}
                  </p>
                </div>
              </div>
              
              {achievement.unlocked && (
                <div style={{
                  background: 'rgba(6, 255, 165, 0.2)',
                  border: '1px solid #06ffa5',
                  borderRadius: '5px',
                  padding: '8px',
                  textAlign: 'center'
                }}>
                  <span style={{
                    color: '#06ffa5',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    ✓ DÉBLOQUÉ
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Settings Section */}
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#ff006e',
          marginBottom: '20px',
          textTransform: 'uppercase'
        }}>
          PARAMÈTRES
        </h2>

        <div style={{
          background: 'rgba(26, 0, 51, 0.8)',
          border: '2px solid #ff006e',
          borderRadius: '10px',
          padding: '30px',
          boxShadow: '0 0 20px rgba(255, 0, 110, 0.3)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <button style={{
              padding: '15px 25px',
              background: 'transparent',
              border: '2px solid #8338ec',
              color: '#8338ec',
              borderRadius: '5px',
              fontSize: '1rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 0 15px rgba(131, 56, 236, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = '#8338ec';
              target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = 'transparent';
              target.style.color = '#8338ec';
            }}>
              PERSONNALISER AVATAR
            </button>

            <button style={{
              padding: '15px 25px',
              background: 'transparent',
              border: '2px solid #ffbe0b',
              color: '#ffbe0b',
              borderRadius: '5px',
              fontSize: '1rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 0 15px rgba(255, 190, 11, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = '#ffbe0b';
              target.style.color = '#000';
            }}
            onMouseOut={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = 'transparent';
              target.style.color = '#ffbe0b';
            }}>
              MODIFIER EMAIL
            </button>

            <button style={{
              padding: '15px 25px',
              background: 'transparent',
              border: '2px solid #06ffa5',
              color: '#06ffa5',
              borderRadius: '5px',
              fontSize: '1rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 0 15px rgba(6, 255, 165, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = '#06ffa5';
              target.style.color = '#000';
            }}
            onMouseOut={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = 'transparent';
              target.style.color = '#06ffa5';
            }}>
              NOTIFICATIONS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const [userProfile, setUserProfile] = useState({
    username: "PixelWarrior",
    level: 12,
    xp: 2547,
    avatar: {
      body: 'default',
      outfit: 'casual',
      accessory: 'none',
      color: '#ff006e'
    }
  });

  const avatarOptions = {
    body: ['default', 'athletic', 'strong'],
    outfit: ['casual', 'sports', 'formal', 'ninja'],
    accessory: ['none', 'glasses', 'hat', 'headband'],
    color: ['#ff006e', '#8338ec', '#06ffa5', '#ffbe0b', '#ff6b6b']
  };

  const handleAvatarChange = (part: string, value: string) => {
    setUserProfile(prev => ({
      ...prev,
      avatar: {
        ...prev.avatar,
        [part]: value
      }
    }));

    showNotification(`Avatar mis à jour: ${part} → ${value}`);
  };

  const showNotification = (message: string) => {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #8338ec, #ff006e);
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      font-weight: bold;
      z-index: 1000;
      box-shadow: 0 0 20px rgba(131, 56, 236, 0.6);
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 2000);
  };

  const achievements = [
    { id: 1, name: "PREMIER PAS", description: "Première quête complétée", icon: "🏆", unlocked: true },
    { id: 2, name: "MARATHONIEN", description: "7 jours consécutifs", icon: "🏃", unlocked: true },
    { id: 3, name: "CODEUR NINJA", description: "50 problèmes résolus", icon: "💻", unlocked: false },
    { id: 4, name: "FORCE BRUTE", description: "100 exercices de force", icon: "💪", unlocked: false },
    { id: 5, name: "MAÎTRE ZEN", description: "30 jours de méditation", icon: "🧘", unlocked: false },
    { id: 6, name: "LÉGENDE", description: "Niveau 50 atteint", icon: "👑", unlocked: false }
  ];

  const stats = [
    { label: "NIVEAU", value: userProfile.level.toString(), color: "#ff006e" },
    { label: "XP TOTAL", value: userProfile.xp.toLocaleString(), color: "#ffbe0b" },
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
            MON PROFIL
          </h1>

          <div style={{ width: '200px' }}></div>
        </div>

        {/* Profil principal */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 1fr',
          gap: '30px',
          marginBottom: '40px'
        }}>

          {/* Avatar et customisation */}
          <div style={{
            background: 'rgba(26, 0, 51, 0.8)',
            border: '2px solid #ff006e',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 0 20px rgba(255, 0, 110, 0.3)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#ff006e', marginBottom: '20px' }}>AVATAR</h3>

            {/* Avatar display */}
            <div style={{
              width: '120px',
              height: '120px',
              background: `linear-gradient(135deg, ${userProfile.avatar.color}, #8338ec)`,
              borderRadius: '50%',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              border: '3px solid #ff006e',
              boxShadow: '0 0 20px rgba(255, 0, 110, 0.4)'
            }}>
              🎮
            </div>

            <h4 style={{ color: '#ffbe0b', marginBottom: '20px' }}>{userProfile.username}</h4>

            {/* Avatar customization */}
            <div style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#8338ec', display: 'block', marginBottom: '5px' }}>Couleur:</label>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {avatarOptions.color.map(color => (
                    <div
                      key={color}
                      onClick={() => handleAvatarChange('color', color)}
                      style={{
                        width: '25px',
                        height: '25px',
                        background: color,
                        borderRadius: '50%',
                        cursor: 'pointer',
                        border: userProfile.avatar.color === color ? '2px solid white' : '1px solid #666',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#8338ec', display: 'block', marginBottom: '5px' }}>Tenue:</label>
                <select
                  value={userProfile.avatar.outfit}
                  onChange={(e) => handleAvatarChange('outfit', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid #8338ec',
                    borderRadius: '5px',
                    color: 'white'
                  }}
                >
                  {avatarOptions.outfit.map(outfit => (
                    <option key={outfit} value={outfit}>{outfit}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stats principales */}
          <div style={{
            background: 'rgba(26, 0, 51, 0.8)',
            border: '2px solid #ff006e',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 0 20px rgba(255, 0, 110, 0.3)'
          }}>
            <h3 style={{ color: '#ff006e', marginBottom: '20px', textAlign: 'center' }}>STATISTIQUES</h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px'
            }}>
              {stats.map((stat, index) => (
                <div key={index} style={{
                  background: 'rgba(0,0,0,0.3)',
                  padding: '15px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: `1px solid ${stat.color}`
                }}>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: stat.color,
                    marginBottom: '5px'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#ccc',
                    textTransform: 'uppercase'
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div style={{
            background: 'rgba(26, 0, 51, 0.8)',
            border: '2px solid #ff006e',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 0 20px rgba(255, 0, 110, 0.3)'
          }}>
            <h3 style={{ color: '#ff006e', marginBottom: '20px', textAlign: 'center' }}>ACHIEVEMENTS</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {achievements.map(achievement => (
                <div
                  key={achievement.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px',
                    background: achievement.unlocked ? 'rgba(6, 255, 165, 0.1)' : 'rgba(100, 100, 100, 0.1)',
                    borderRadius: '8px',
                    border: achievement.unlocked ? '1px solid #06ffa5' : '1px solid #666',
                    opacity: achievement.unlocked ? 1 : 0.5
                  }}
                >
                  <div style={{ fontSize: '1.5rem' }}>{achievement.icon}</div>
                  <div>
                    <div style={{
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      color: achievement.unlocked ? '#06ffa5' : '#999'
                    }}>
                      {achievement.name}
                    </div>
                    <div style={{
                      fontSize: '0.7rem',
                      color: '#ccc'
                    }}>
                      {achievement.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => showNotification('🎮 Paramètres mis à jour!')}
            style={{
              padding: '15px 30px',
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
          >
            PARAMÈTRES
          </button>

          <button
            onClick={() => showNotification('🔔 Notifications configurées!')}
            style={{
              padding: '15px 30px',
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
          >
            NOTIFICATIONS
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

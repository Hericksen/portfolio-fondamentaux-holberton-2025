import React, { useState } from 'react';
import { PixelAvatar } from './PixelAvatar';
import { ModernAvatarCustomizer } from './ModernAvatarCustomizer';

export const AvatarDemo: React.FC = () => {
  const [currentAvatar, setCurrentAvatar] = useState({
    hairColor: '#ff4081',
    skinColor: '#fdbcb4',
    outfit: 'casual',
    accessory: 'none',
    expression: 'happy'
  });

  const handleAvatarChange = (newAvatar: any) => {
    console.log('Avatar changé:', newAvatar);
    setCurrentAvatar(newAvatar);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0014 0%, #1a0033 25%, #2d1b69 50%, #1a0033 75%, #0a0014 100%)',
      color: 'white',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{
          textAlign: 'center',
          fontSize: '2.5rem',
          marginBottom: '30px',
          background: 'linear-gradient(135deg, #ff006e, #8338ec)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🎨 Démonstration Avatar PixelPump
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Avatar principal affiché */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            border: '2px solid rgba(255, 64, 129, 0.3)'
          }}>
            <h2 style={{
              color: '#ff4081',
              fontSize: '1.5rem',
              marginBottom: '30px'
            }}>
              Avatar Principal
            </h2>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <PixelAvatar
                avatarData={currentAvatar}
                size="large"
                showOnline={true}
              />
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '15px',
              fontSize: '0.9rem',
              textAlign: 'left'
            }}>
              <div><strong>Cheveux:</strong> {currentAvatar.hairColor}</div>
              <div><strong>Peau:</strong> {currentAvatar.skinColor}</div>
              <div><strong>Tenue:</strong> {currentAvatar.outfit}</div>
              <div><strong>Accessoire:</strong> {currentAvatar.accessory}</div>
              <div><strong>Expression:</strong> {currentAvatar.expression}</div>
            </div>
          </div>

          {/* Personnalisateur */}
          <div>
            <ModernAvatarCustomizer
              currentAvatar={currentAvatar}
              onAvatarChange={handleAvatarChange}
            />
          </div>
        </div>

        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(0, 255, 0, 0.1)',
          borderRadius: '10px',
          border: '1px solid rgba(0, 255, 0, 0.3)'
        }}>
          <h3 style={{ color: '#00ff00', marginBottom: '10px' }}>
            ✅ Synchronisation Temps Réel
          </h3>
          <p>
            Chaque modification dans le personnalisateur se reflète instantanément sur l'avatar principal.
            En production, ces changements seraient également sauvegardés automatiquement en base de données.
          </p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { AvatarCustomizer } from '../components/AvatarCustomizer';
import { PixelAvatar } from '../components/PixelAvatar';

const AvatarDemo: React.FC = () => {
  const [avatar, setAvatar] = React.useState({
    body: 'default',
    outfit: 'casual',
    accessory: 'none',
    color: '#ff006e',
    background: 'gym',
    hair: 'short',
    eyes: 'normal'
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0014 0%, #1a0033 25%, #2d1b69 50%, #1a0033 75%, #0a0014 100%)',
      color: 'white',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          textAlign: 'center', 
          fontSize: '2.5rem', 
          marginBottom: '30px',
          background: 'linear-gradient(45deg, #ff006e, #06ffa5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🎨 Démo Personnalisation Avatar
        </h1>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr',
          gap: '30px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Aperçu Avatar */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '30px',
            borderRadius: '20px',
            textAlign: 'center'
          }}>
            <h2 style={{ marginBottom: '20px', color: '#06ffa5' }}>Aperçu de votre Avatar</h2>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '20px',
              flexWrap: 'wrap'
            }}>
              <div style={{ textAlign: 'center' }}>
                <PixelAvatar avatarData={avatar} size="small" />
                <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>Petit</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <PixelAvatar avatarData={avatar} size="medium" />
                <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>Moyen</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <PixelAvatar avatarData={avatar} size="large" />
                <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>Grand</p>
              </div>
            </div>
          </div>

          {/* Personnalisateur */}
          <AvatarCustomizer
            currentAvatar={avatar}
            onAvatarChange={(newAvatar) => {
              setAvatar({
                body: newAvatar.body || 'default',
                outfit: newAvatar.outfit || 'casual',
                accessory: newAvatar.accessory || 'none',
                color: newAvatar.color || '#ff006e',
                background: newAvatar.background || 'gym',
                hair: newAvatar.hair || 'short',
                eyes: newAvatar.eyes || 'normal'
              });
            }}
          />
          
          {/* Données JSON */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '15px'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#ffbe0b' }}>Configuration JSON</h3>
            <pre style={{
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '15px',
              borderRadius: '10px',
              fontSize: '0.8rem',
              overflow: 'auto'
            }}>
              {JSON.stringify(avatar, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarDemo;

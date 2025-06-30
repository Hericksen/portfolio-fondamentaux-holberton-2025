import React from 'react';
import { Link } from 'react-router-dom';
import { UserProfile } from '../components/UserProfile';

const Profile: React.FC = () => {
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
            ← RETOUR AU DASHBOARD
          </Link>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            background: 'linear-gradient(45deg, #ff006e, #ffbe0b, #06ffa5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(255, 0, 110, 0.8)',
            margin: 0
          }}>
            PROFIL PIXELPUMP
          </h1>

          <div style={{ width: '180px' }}></div>
        </div>

        {/* Contenu principal - Composant UserProfile */}
        <UserProfile />

      </div>
    </div>
  );
};

export default Profile;

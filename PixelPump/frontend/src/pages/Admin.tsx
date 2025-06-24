import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  email: string;
  level: number;
  xp: number;
  created_at: string;
}

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  // Pour récupérer le token depuis localStorage ou le saisir manuellement
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchUsers(savedToken);
    }
  }, []);

  const fetchUsers = async (authToken: string) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/users', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors de la récupération des utilisateurs');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      fetchUsers(token);
    }
  };

  const loginAsAdmin = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@pixelpump.com',
          password: 'password123'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        localStorage.setItem('token', data.token);
        fetchUsers(data.token);
      }
    } catch (err) {
      setError('Erreur de connexion');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0014 0%, #1a0033 25%, #2d1b69 50%, #1a0033 75%, #0a0014 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
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
            ADMIN - UTILISATEURS
          </h1>
          
          <button
            onClick={loginAsAdmin}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: '2px solid #06ffa5',
              color: '#06ffa5',
              borderRadius: '5px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 0 15px rgba(6, 255, 165, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            LOGIN AUTO
          </button>
        </div>

        {/* Token Input */}
        {!token && (
          <div style={{
            background: 'rgba(26, 0, 51, 0.8)',
            border: '2px solid #ff006e',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 0 20px rgba(255, 0, 110, 0.3)'
          }}>
            <h3 style={{ color: '#ff006e', marginBottom: '15px' }}>Authentification requise</h3>
            <form onSubmit={handleTokenSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Token JWT ou cliquez 'LOGIN AUTO'"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '2px solid #8338ec',
                  borderRadius: '5px',
                  color: 'white',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '2px solid #ff006e',
                  color: '#ff006e',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                VALIDER
              </button>
            </form>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid #ff6b6b',
            borderRadius: '5px',
            padding: '15px',
            marginBottom: '20px',
            color: '#ff6b6b',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{
            textAlign: 'center',
            fontSize: '1.5rem',
            color: '#ff006e',
            padding: '40px'
          }}>
            CHARGEMENT...
          </div>
        )}

        {/* Users List */}
        {!loading && users.length > 0 && (
          <div style={{
            background: 'rgba(26, 0, 51, 0.8)',
            border: '2px solid #ff006e',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 0 20px rgba(255, 0, 110, 0.3)'
          }}>
            <h2 style={{ color: '#ff006e', marginBottom: '20px' }}>
              UTILISATEURS ENREGISTRÉS ({users.length})
            </h2>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #8338ec' }}>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#ff006e' }}>ID</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#ff006e' }}>USERNAME</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#ff006e' }}>EMAIL</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#ff006e' }}>NIVEAU</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#ff006e' }}>XP</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#ff006e' }}>CRÉÉ LE</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} style={{ 
                      borderBottom: '1px solid #333',
                      backgroundColor: index % 2 === 0 ? 'rgba(255, 0, 110, 0.05)' : 'transparent'
                    }}>
                      <td style={{ padding: '10px', color: '#8338ec', fontSize: '0.8rem' }}>
                        {user.id.substring(0, 8)}...
                      </td>
                      <td style={{ padding: '10px', color: '#06ffa5', fontWeight: 'bold' }}>
                        {user.username}
                      </td>
                      <td style={{ padding: '10px', color: 'white' }}>
                        {user.email}
                      </td>
                      <td style={{ padding: '10px', color: '#ffbe0b', fontWeight: 'bold' }}>
                        {user.level}
                      </td>
                      <td style={{ padding: '10px', color: '#ff006e' }}>
                        {user.xp}
                      </td>
                      <td style={{ padding: '10px', color: '#8338ec' }}>
                        {new Date(user.created_at).toLocaleString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && users.length === 0 && token && (
          <div style={{
            background: 'rgba(26, 0, 51, 0.8)',
            border: '2px solid #8338ec',
            borderRadius: '10px',
            padding: '40px',
            textAlign: 'center',
            color: '#8338ec'
          }}>
            Aucun utilisateur trouvé.
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

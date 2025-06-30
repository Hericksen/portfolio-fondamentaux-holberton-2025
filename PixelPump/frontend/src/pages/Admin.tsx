import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

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
  const [adminSecret, setAdminSecret] = useState('');
  const [adminTokenStatus, setAdminTokenStatus] = useState('');
  const [resetStatus, setResetStatus] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');

  // Pour récupérer le token depuis localStorage ou le saisir manuellement
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchUsers(savedToken);
    }
  }, []);

  const getAdminToken = async () => {
    try {
      setAdminTokenStatus('Génération du token...');
      
      const response = await api.post('/auth/admin-token', {
        adminSecret: adminSecret
      });

      if (response.data.success) {
        const adminToken = response.data.token;
        localStorage.setItem('token', adminToken);
        setToken(adminToken);
        setAdminTokenStatus(`✅ Token admin généré avec succès ! Expire dans ${response.data.expiresIn}`);
        
        // Fetch users with the new admin token
        fetchUsers(adminToken);
      }
    } catch (error: any) {
      setAdminTokenStatus(`❌ Erreur: ${error.response?.data?.message || 'Erreur lors de la génération du token'}`);
    }
  };

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
        setUsers(data.data || data.users || []);
      } else {
        setError('Erreur lors de la récupération des utilisateurs');
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

  const handleResetAllUsers = async () => {
    if (resetConfirmText !== 'RESET') {
      setResetStatus('❌ Vous devez taper "RESET" pour confirmer');
      return;
    }

    try {
      setResetStatus('🔄 Réinitialisation en cours...');
      
      const response = await fetch('http://localhost:3001/api/database/reset-users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResetStatus(`✅ ${data.message} (${data.data.usersReset} utilisateurs réinitialisés)`);
        setShowResetConfirm(false);
        setResetConfirmText('');
        // Recharger la liste des utilisateurs
        fetchUsers(token);
      } else {
        setResetStatus(`❌ Erreur: ${data.message || 'Erreur lors de la réinitialisation'}`);
      }
    } catch (error: any) {
      setResetStatus(`❌ Erreur de connexion: ${error.message}`);
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
            background: 'linear-gradient(45deg, #ff006e, #8338ec, #06ffa5)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textShadow: '0 0 30px rgba(255, 0, 110, 0.5)',
            margin: 0
          }}>
            ADMIN PANEL
          </h1>
          
          <div style={{ width: '150px' }}></div>
        </div>

        {/* Auth Section */}
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
            
            {/* Section pour obtenir un token d'administrateur */}
            <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255, 0, 110, 0.1)', borderRadius: '8px' }}>
              <h4 style={{ color: '#ff006e', marginBottom: '10px' }}>🔑 Obtenir un Token Administrateur</h4>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                <input
                  type="password"
                  placeholder="Secret administrateur"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid #ff006e',
                    borderRadius: '4px',
                    color: 'white',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={getAdminToken}
                  disabled={!adminSecret}
                  style={{
                    padding: '8px 16px',
                    background: adminSecret ? '#ff006e' : 'rgba(255, 0, 110, 0.3)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '4px',
                    cursor: adminSecret ? 'pointer' : 'not-allowed',
                    fontSize: '0.9rem'
                  }}
                >
                  OBTENIR TOKEN ADMIN
                </button>
              </div>
              {adminTokenStatus && (
                <div style={{ 
                  padding: '8px', 
                  background: 'rgba(0, 0, 0, 0.3)', 
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  color: adminTokenStatus.includes('✅') ? '#4ade80' : '#ef4444'
                }}>
                  {adminTokenStatus}
                </div>
              )}
              <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '5px' }}>
                Secret par défaut: pixelpump_admin_2025
              </div>
            </div>
          </div>
        )}

        {/* Section de test des permissions d'admin */}
        {token && (
          <div style={{
            background: 'rgba(26, 0, 51, 0.8)',
            border: '2px solid #8338ec',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 0 20px rgba(131, 56, 236, 0.3)'
          }}>
            <h3 style={{ color: '#8338ec', marginBottom: '15px' }}>🧪 Test des Permissions Administrateur</h3>
            
            {/* Section pour obtenir un token admin si on a déjà un token user */}
            <div style={{ 
              background: 'rgba(255, 0, 110, 0.1)', 
              padding: '15px', 
              borderRadius: '8px', 
              marginBottom: '15px',
              border: '1px solid #ff006e'
            }}>
              <h4 style={{ color: '#ff006e', marginBottom: '10px' }}>🔑 Obtenir les Droits Administrateur</h4>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                <input
                  type="password"
                  placeholder="Secret administrateur"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid #ff006e',
                    borderRadius: '4px',
                    color: 'white',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={getAdminToken}
                  disabled={!adminSecret}
                  style={{
                    padding: '8px 16px',
                    background: adminSecret ? '#ff006e' : 'rgba(255, 0, 110, 0.3)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '4px',
                    cursor: adminSecret ? 'pointer' : 'not-allowed',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}
                >
                  🔓 OBTENIR DROITS ADMIN
                </button>
              </div>
              {adminTokenStatus && (
                <div style={{ 
                  padding: '8px', 
                  background: 'rgba(0, 0, 0, 0.3)', 
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  color: adminTokenStatus.includes('✅') ? '#4ade80' : '#ef4444'
                }}>
                  {adminTokenStatus}
                </div>
              )}
              <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '5px' }}>
                Secret par défaut: <strong>pixelpump_admin_2025</strong>
              </div>
            </div>

            <button
              onClick={async () => {
                try {
                  const response = await api.get('/auth/admin-test');
                  alert(`✅ Succès: ${response.data.message}\n\nDétails: ${JSON.stringify(response.data, null, 2)}`);
                } catch (error: any) {
                  alert(`❌ Erreur: ${error.response?.data?.message || 'Erreur de connexion'}`);
                }
              }}
              style={{
                padding: '10px 20px',
                background: '#8338ec',
                border: 'none',
                color: 'white',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}
            >
              🔑 TESTER ACCÈS ADMIN
            </button>
            <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '10px' }}>
              Cette action teste si votre token actuel a les permissions d'administrateur.
            </div>
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
            color: '#ff6b6b'
          }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && token && (
          <div style={{
            background: 'rgba(26, 0, 51, 0.8)',
            border: '2px solid #8338ec',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 0 20px rgba(131, 56, 236, 0.3)'
          }}>
            <div style={{ color: '#8338ec', fontSize: '1.2rem' }}>Chargement des données...</div>
          </div>
        )}

        {/* Danger Zone - Reset Users */}
        {token && !loading && (
          <div style={{
            background: 'rgba(51, 0, 0, 0.8)',
            border: '2px solid #ff0000',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '30px',
            boxShadow: '0 0 20px rgba(255, 0, 0, 0.3)'
          }}>
            <h2 style={{ color: '#ff0000', marginBottom: '15px', textAlign: 'center' }}>
              ⚠️ ZONE DANGEREUSE ⚠️
            </h2>
            <div style={{ color: '#ffaaaa', marginBottom: '20px', textAlign: 'center' }}>
              Cette section contient des actions IRRÉVERSIBLES qui peuvent détruire des données.
            </div>
            
            {!showResetConfirm ? (
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  style={{
                    padding: '15px 30px',
                    background: 'linear-gradient(45deg, #ff0000, #cc0000)',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    boxShadow: '0 0 15px rgba(255, 0, 0, 0.5)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 0, 0, 0.7)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.5)';
                  }}
                >
                  🔥 Réinitialiser TOUS les utilisateurs
                </button>
              </div>
            ) : (
              <div>
                <div style={{ color: '#ff6666', marginBottom: '20px', textAlign: 'center' }}>
                  <strong>ATTENTION :</strong> Cette action va :
                  <ul style={{ textAlign: 'left', margin: '10px 0', paddingLeft: '40px' }}>
                    <li>Remettre l'XP de tous les utilisateurs à 0</li>
                    <li>Remettre le niveau de tous les utilisateurs à 1</li>
                    <li>Réinitialiser le streak à 0</li>
                    <li>Supprimer toutes les quêtes complétées</li>
                    <li>Supprimer tous les achievements débloqués</li>
                    <li>Remettre l'avatar par défaut</li>
                  </ul>
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: '#ffaaaa', marginBottom: '10px' }}>
                    Pour confirmer, tapez exactement "RESET" :
                  </label>
                  <input
                    type="text"
                    value={resetConfirmText}
                    onChange={(e) => setResetConfirmText(e.target.value)}
                    placeholder="Tapez RESET pour confirmer"
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: '2px solid #ff0000',
                      borderRadius: '5px',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    onClick={() => {
                      setShowResetConfirm(false);
                      setResetConfirmText('');
                      setResetStatus('');
                    }}
                    style={{
                      padding: '10px 20px',
                      background: 'transparent',
                      border: '2px solid #666',
                      borderRadius: '5px',
                      color: '#666',
                      cursor: 'pointer'
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleResetAllUsers}
                    disabled={resetConfirmText !== 'RESET'}
                    style={{
                      padding: '10px 20px',
                      background: resetConfirmText === 'RESET' ? 'linear-gradient(45deg, #ff0000, #cc0000)' : '#333',
                      border: 'none',
                      borderRadius: '5px',
                      color: 'white',
                      cursor: resetConfirmText === 'RESET' ? 'pointer' : 'not-allowed',
                      fontWeight: 'bold',
                      opacity: resetConfirmText === 'RESET' ? 1 : 0.5
                    }}
                  >
                    🔥 EXÉCUTER LA RÉINITIALISATION
                  </button>
                </div>
              </div>
            )}
            
            {resetStatus && (
              <div style={{
                marginTop: '20px',
                padding: '15px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid #666',
                borderRadius: '5px',
                color: resetStatus.includes('✅') ? '#00ff00' : resetStatus.includes('❌') ? '#ff6666' : '#ffff66'
              }}>
                {resetStatus}
              </div>
            )}
          </div>
        )}

        {/* Users List */}
        {token && !loading && users.length > 0 && (
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
            border: '2px solid #ffbe0b',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 0 20px rgba(255, 190, 11, 0.3)'
          }}>
            <div style={{ color: '#ffbe0b', fontSize: '1.2rem' }}>Aucun utilisateur trouvé</div>
          </div>
        )}

        {/* Reset Users Section */}
        {token && (
          <div style={{
            background: 'rgba(26, 0, 51, 0.8)',
            border: '2px solid #ffbe0b',
            borderRadius: '10px',
            padding: '20px',
            marginTop: '20px',
            boxShadow: '0 0 20px rgba(255, 190, 11, 0.3)'
          }}>
            <h3 style={{ color: '#ffbe0b', marginBottom: '15px' }}>🔄 Réinitialisation des Utilisateurs</h3>
            <p style={{ marginBottom: '15px', color: '#ddd' }}>
              Cette action réinitialisera tous les utilisateurs à leurs valeurs par défaut. 
              Veuillez confirmer en tapant <strong>"RESET"</strong> dans le champ ci-dessous.
            </p>
            
            {showResetConfirm ? (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Tapez RESET pour confirmer"
                  value={resetConfirmText}
                  onChange={(e) => setResetConfirmText(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '2px solid #ffbe0b',
                    borderRadius: '5px',
                    color: 'white',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleResetAllUsers}
                  style={{
                    padding: '10px 20px',
                    background: '#ffbe0b',
                    border: 'none',
                    color: 'white',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  CONFIRMER RÉINITIALISATION
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '2px solid #ffbe0b',
                  color: '#ffbe0b',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginBottom: '10px'
                }}
              >
                DEMANDER CONFIRMATION
              </button>
            )}

            {resetStatus && (
              <div style={{ 
                padding: '8px', 
                background: 'rgba(0, 0, 0, 0.3)', 
                borderRadius: '4px',
                fontSize: '0.9rem',
                color: resetStatus.includes('✅') ? '#4ade80' : '#ef4444'
              }}>
                {resetStatus}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

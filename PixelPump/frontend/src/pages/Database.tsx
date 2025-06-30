import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface DatabaseStats {
  totalUsers: number;
  totalQuests: number;
  totalAchievements: number;
  completedQuests: number;
  unlockedAchievements: number;
  activeUsers: number;
  completionRate: string;
}

interface AdminInfo {
  user: string;
  role: string;
  isTemporary: boolean;
}

const Database: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<any[]>([]);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminToken, setAdminToken] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Tables disponibles via les endpoints admin
  const availableTables = [
    { key: 'users', name: 'Utilisateurs', icon: '👥' },
    { key: 'quests', name: 'Quêtes', icon: '🎯' },
    { key: 'achievements', name: 'Achievements', icon: '🏆' },
    { key: 'stats', name: 'Statistiques', icon: '📊' }
  ];

  useEffect(() => {
    const savedAdminToken = localStorage.getItem('adminToken');
    if (savedAdminToken) {
      setAdminToken(savedAdminToken);
      setIsAuthenticated(true);
      checkAdminAccess(savedAdminToken);
    }
  }, []);

  const checkAdminAccess = async (tokenToCheck: string = adminToken) => {
    try {
      const response = await fetch('http://localhost:3001/api/database', {
        headers: {
          'Authorization': `Bearer ${tokenToCheck}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAdminInfo(data.adminInfo);
        setIsAuthenticated(true);
        return true;
      } else {
        setIsAuthenticated(false);
        setAdminToken('');
        localStorage.removeItem('adminToken');
        return false;
      }
    } catch (err) {
      setError('Erreur de vérification des permissions admin');
      setIsAuthenticated(false);
      return false;
    }
  };

  const getAdminToken = async () => {
    if (!adminSecret.trim()) {
      setError('Veuillez entrer le secret administrateur');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/admin-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminSecret: adminSecret })
      });

      if (response.ok) {
        const data = await response.json();
        setAdminToken(data.token);
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        setError('');
        setAdminSecret('');
        await checkAdminAccess(data.token);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors de l\'obtention du token admin');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    }
  };

  const fetchTableData = async (tableName: string) => {
    if (!adminToken || !isAuthenticated) {
      setError('Token administrateur requis');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const endpoint = `http://localhost:3001/api/database/${tableName}`;

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (tableName === 'stats') {
          setStats(result.data);
          setTableData([]);
        } else {
          setTableData(result.data || []);
          setStats(null);
        }
        setSelectedTable(tableName);
      } else {
        const errorData = await response.json();
        setError(errorData.message || `Erreur lors du chargement de ${tableName}`);
      }
    } catch (err) {
      setError(`Erreur de connexion pour ${tableName}`);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAdminToken('');
    setIsAuthenticated(false);
    setAdminInfo(null);
    setTableData([]);
    setStats(null);
    setSelectedTable('');
    localStorage.removeItem('adminToken');
  };

  const renderStatsView = () => {
    if (!stats) return null;

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'rgba(255, 0, 110, 0.1)',
          border: '2px solid #ff006e',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: '#ff006e', fontWeight: 'bold' }}>
            {stats.totalUsers}
          </div>
          <div style={{ color: '#ff006e', textTransform: 'uppercase' }}>
            Utilisateurs
          </div>
        </div>

        <div style={{
          background: 'rgba(131, 56, 236, 0.1)',
          border: '2px solid #8338ec',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: '#8338ec', fontWeight: 'bold' }}>
            {stats.totalQuests}
          </div>
          <div style={{ color: '#8338ec', textTransform: 'uppercase' }}>
            Quêtes
          </div>
        </div>

        <div style={{
          background: 'rgba(6, 255, 165, 0.1)',
          border: '2px solid #06ffa5',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: '#06ffa5', fontWeight: 'bold' }}>
            {stats.totalAchievements}
          </div>
          <div style={{ color: '#06ffa5', textTransform: 'uppercase' }}>
            Achievements
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 0, 110, 0.1)',
          border: '2px solid #ff006e',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: '#ff006e', fontWeight: 'bold' }}>
            {stats.completedQuests}
          </div>
          <div style={{ color: '#ff006e', textTransform: 'uppercase' }}>
            Quêtes Terminées
          </div>
        </div>

        <div style={{
          background: 'rgba(6, 255, 165, 0.1)',
          border: '2px solid #06ffa5',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: '#06ffa5', fontWeight: 'bold' }}>
            {stats.activeUsers}
          </div>
          <div style={{ color: '#06ffa5', textTransform: 'uppercase' }}>
            Utilisateurs Actifs
          </div>
        </div>

        <div style={{
          background: 'rgba(131, 56, 236, 0.1)',
          border: '2px solid #8338ec',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: '#8338ec', fontWeight: 'bold' }}>
            {stats.completionRate}%
          </div>
          <div style={{ color: '#8338ec', textTransform: 'uppercase' }}>
            Taux de Completion
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 180, 0, 0.1)',
          border: '2px solid #ffb400',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: '#ffb400', fontWeight: 'bold' }}>
            {stats.unlockedAchievements}
          </div>
          <div style={{ color: '#ffb400', textTransform: 'uppercase' }}>
            Achievements Débloqués
          </div>
        </div>
      </div>
    );
  };

  const renderTableData = (data: any[]) => {
    if (!data || data.length === 0) {
      return (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#8338ec'
        }}>
          Aucune donnée dans cette table
        </div>
      );
    }

    const columns = Object.keys(data[0]);

    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #8338ec' }}>
              {columns.map(col => (
                <th key={col} style={{
                  padding: '12px',
                  textAlign: 'left',
                  color: '#ff006e',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase'
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} style={{
                borderBottom: '1px solid #333',
                backgroundColor: index % 2 === 0 ? 'rgba(255, 0, 110, 0.05)' : 'transparent'
              }}>
                {columns.map(col => (
                  <td key={col} style={{
                    padding: '10px',
                    color: 'white',
                    fontSize: '0.85rem',
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {typeof row[col] === 'object' && row[col] !== null 
                      ? JSON.stringify(row[col]).substring(0, 50) + '...'
                      : String(row[col] || 'NULL')
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0014 0%, #1a0033 25%, #2d1b69 50%, #1a0033 75%, #0a0014 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
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
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            color: '#ff006e',
            textShadow: '0 0 20px #ff006e'
          }}>
            BASE DE DONNÉES ADMIN
          </h1>
          
          {isAuthenticated && adminInfo && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#06ffa5', fontSize: '0.9rem', marginBottom: '5px' }}>
                Admin: {adminInfo.user} ({adminInfo.isTemporary ? 'Temporaire' : 'Permanent'})
              </div>
              <button
                onClick={logout}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '2px solid #ff6b6b',
                  color: '#ff6b6b',
                  borderRadius: '5px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: '0 0 15px rgba(255, 107, 107, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                LOGOUT
              </button>
            </div>
          )}
        </div>

        {/* Authentication Panel */}
        {!isAuthenticated && (
          <div style={{
            background: 'rgba(26, 0, 51, 0.8)',
            border: '2px solid #8338ec',
            borderRadius: '10px',
            padding: '30px',
            marginBottom: '30px',
            textAlign: 'center',
            boxShadow: '0 0 20px rgba(131, 56, 236, 0.3)'
          }}>
            <h2 style={{ color: '#8338ec', marginBottom: '20px' }}>
              AUTHENTIFICATION ADMINISTRATEUR REQUISE
            </h2>
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
              <input
                type="password"
                placeholder="Secret administrateur"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid #8338ec',
                  borderRadius: '5px',
                  color: 'white',
                  fontSize: '1rem',
                  marginBottom: '15px'
                }}
              />
              <button
                onClick={getAdminToken}
                style={{
                  padding: '12px 30px',
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
                OBTENIR ACCÈS ADMIN
              </button>
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
            color: '#ff6b6b',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Admin Content - Only shown if authenticated */}
        {isAuthenticated && (
          <>
            {/* Tables Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
              marginBottom: '30px'
            }}>
              {availableTables.map(table => (
                <button
                  key={table.key}
                  onClick={() => fetchTableData(table.key)}
                  disabled={loading}
                  style={{
                    padding: '20px',
                    background: selectedTable === table.key 
                      ? 'rgba(255, 0, 110, 0.2)' 
                      : 'rgba(26, 0, 51, 0.8)',
                    border: selectedTable === table.key 
                      ? '2px solid #ff006e' 
                      : '2px solid #8338ec',
                    borderRadius: '10px',
                    color: selectedTable === table.key ? '#ff006e' : '#8338ec',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: selectedTable === table.key 
                      ? '0 0 20px rgba(255, 0, 110, 0.4)' 
                      : '0 0 15px rgba(131, 56, 236, 0.3)',
                    transition: 'all 0.3s ease',
                    opacity: loading ? 0.5 : 1
                  }}
                >
                  {table.icon} {table.name}
                </button>
              ))}
            </div>

            {/* Loading */}
            {loading && (
              <div style={{
                textAlign: 'center',
                fontSize: '1.5rem',
                color: '#ff006e',
                padding: '40px'
              }}>
                CHARGEMENT DE {selectedTable.toUpperCase()}...
              </div>
            )}

            {/* Stats View */}
            {!loading && selectedTable === 'stats' && stats && renderStatsView()}

            {/* Table Data */}
            {!loading && selectedTable && selectedTable !== 'stats' && (
              <div style={{
                background: 'rgba(26, 0, 51, 0.8)',
                border: '2px solid #ff006e',
                borderRadius: '10px',
                padding: '20px',
                boxShadow: '0 0 20px rgba(255, 0, 110, 0.3)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <h2 style={{ color: '#ff006e', margin: 0 }}>
                    TABLE: {selectedTable.toUpperCase()}
                  </h2>
                  <span style={{
                    background: 'rgba(6, 255, 165, 0.2)',
                    border: '1px solid #06ffa5',
                    borderRadius: '15px',
                    padding: '5px 15px',
                    color: '#06ffa5',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {tableData.length} ENTRÉES
                  </span>
                </div>
                
                {renderTableData(tableData)}
              </div>
            )}

            {/* Info Panel */}
            <div style={{
              background: 'rgba(26, 0, 51, 0.8)',
              border: '2px solid #8338ec',
              borderRadius: '10px',
              padding: '20px',
              marginTop: '20px',
              boxShadow: '0 0 20px rgba(131, 56, 236, 0.3)'
            }}>
              <h3 style={{ color: '#8338ec', marginBottom: '15px' }}>INFORMATIONS BASE DE DONNÉES</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '15px',
                fontSize: '0.9rem'
              }}>
                <div>
                  <strong style={{ color: '#ff006e' }}>Host:</strong> localhost:5432
                </div>
                <div>
                  <strong style={{ color: '#ff006e' }}>Database:</strong> portfolio
                </div>
                <div>
                  <strong style={{ color: '#ff006e' }}>User:</strong> postgres
                </div>
                <div>
                  <strong style={{ color: '#ff006e' }}>Tables:</strong> {availableTables.length}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Database;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface DatabaseTable {
  name: string;
  count?: number;
  data?: any[];
}

const Database: React.FC = () => {
  const [tables, setTables] = useState<DatabaseTable[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  // Tables principales
  const availableTables = [
    'users',
    'quests', 
    'achievements',
    'projects',
    'UserQuests',
    'UserAchievements'
  ];

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

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
      }
    } catch (err) {
      setError('Erreur de connexion');
    }
  };

  const fetchTableData = async (tableName: string) => {
    if (!token) {
      setError('Token requis');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      let endpoint = '';
      switch (tableName) {
        case 'users':
          endpoint = 'http://localhost:3001/api/users';
          break;
        case 'quests':
          endpoint = 'http://localhost:3001/api/quests';
          break;
        case 'achievements':
          endpoint = 'http://localhost:3001/api/achievements';
          break;
        case 'projects':
          endpoint = 'http://localhost:3001/api/projects';
          break;
        default:
          setError(`Table ${tableName} non supportée par l'API`);
          setLoading(false);
          return;
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTableData(Array.isArray(data) ? data : []);
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
            BASE DE DONNÉES
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

        {/* Tables Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '30px'
        }}>
          {availableTables.map(table => (
            <button
              key={table}
              onClick={() => fetchTableData(table)}
              disabled={!token || loading}
              style={{
                padding: '20px',
                background: selectedTable === table 
                  ? 'rgba(255, 0, 110, 0.2)' 
                  : 'rgba(26, 0, 51, 0.8)',
                border: selectedTable === table 
                  ? '2px solid #ff006e' 
                  : '2px solid #8338ec',
                borderRadius: '10px',
                color: selectedTable === table ? '#ff006e' : '#8338ec',
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                cursor: (!token || loading) ? 'not-allowed' : 'pointer',
                boxShadow: selectedTable === table 
                  ? '0 0 20px rgba(255, 0, 110, 0.4)' 
                  : '0 0 15px rgba(131, 56, 236, 0.3)',
                transition: 'all 0.3s ease',
                opacity: (!token || loading) ? 0.5 : 1
              }}
            >
              📊 {table}
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

        {/* Table Data */}
        {!loading && selectedTable && (
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
      </div>
    </div>
  );
};

export default Database;

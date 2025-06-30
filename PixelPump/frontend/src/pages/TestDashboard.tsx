import { useState } from 'react';
import { api } from '../services/api';

function TestDashboard() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        username: 'testfront',
        email: 'testfront@example.com',
        password: '123456'
      });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setResult('✅ Utilisateur créé et connecté');
      }
    } catch (error: any) {
      if (error.response?.data?.message?.includes('déjà utilisé')) {
        // L'utilisateur existe déjà, essayons de nous connecter
        try {
          const loginResponse = await api.post('/auth/login', {
            email: 'testfront@example.com',
            password: '123456'
          });
          localStorage.setItem('token', loginResponse.data.token);
          setResult('✅ Connexion réussie');
        } catch (loginError: any) {
          setResult('❌ Erreur de connexion: ' + loginError.message);
        }
      } else {
        setResult('❌ Erreur: ' + error.message);
      }
    }
    setLoading(false);
  };

  const testDashboard = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/dashboard/me');
      setResult('✅ Dashboard OK: ' + JSON.stringify(response.data.data.user, null, 2));
    } catch (error: any) {
      setResult('❌ Erreur Dashboard: ' + error.message + ' - Status: ' + error.response?.status);
    }
    setLoading(false);
  };

  const checkToken = () => {
    const token = localStorage.getItem('token');
    setResult(token ? '✅ Token présent: ' + token.substring(0, 50) + '...' : '❌ Pas de token');
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#1a0033', color: 'white', minHeight: '100vh' }}>
      <h1>🧪 Test Dashboard</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={testLogin} disabled={loading} style={{ 
          padding: '10px 20px', margin: '5px', backgroundColor: '#ff006e', border: 'none', color: 'white', borderRadius: '5px' 
        }}>
          1. Se connecter
        </button>
        
        <button onClick={checkToken} style={{ 
          padding: '10px 20px', margin: '5px', backgroundColor: '#8338ec', border: 'none', color: 'white', borderRadius: '5px' 
        }}>
          2. Vérifier Token
        </button>
        
        <button onClick={testDashboard} disabled={loading} style={{ 
          padding: '10px 20px', margin: '5px', backgroundColor: '#06ffa5', border: 'none', color: 'black', borderRadius: '5px' 
        }}>
          3. Tester Dashboard
        </button>
      </div>

      <div style={{ 
        backgroundColor: '#0a0014', 
        padding: '20px', 
        borderRadius: '10px', 
        whiteSpace: 'pre-wrap',
        fontFamily: 'monospace',
        fontSize: '14px'
      }}>
        {loading ? '🔄 Chargement...' : result}
      </div>
    </div>
  );
}

export default TestDashboard;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login({ email, password });
      if (!success) {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0014 0%, #1a0033 25%, #2d1b69 50%, #1a0033 75%, #0a0014 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(26, 0, 51, 0.9)',
        border: '2px solid #ff006e',
        borderRadius: '15px',
        padding: '40px',
        boxShadow: '0 0 30px rgba(255, 0, 110, 0.4)',
        width: '100%',
        maxWidth: '400px',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            color: '#ff006e',
            textShadow: '0 0 20px #ff006e',
            marginBottom: '10px'
          }}>
            PIXELPUMP
          </h1>
          <p style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            background: 'linear-gradient(135deg, #ff006e 0%, #8338ec 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px'
          }}>
            CONNEXION
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid #ff6b6b',
            borderRadius: '5px',
            padding: '10px',
            marginBottom: '20px',
            color: '#ff6b6b',
            textAlign: 'center',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#ff006e',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '2px solid #8338ec',
                borderRadius: '5px',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#ff006e';
                e.target.style.boxShadow = '0 0 10px rgba(255, 0, 110, 0.5)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#8338ec';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#ff006e',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '2px solid #8338ec',
                borderRadius: '5px',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#ff006e';
                e.target.style.boxShadow = '0 0 10px rgba(255, 0, 110, 0.5)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#8338ec';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '15px',
              background: isLoading ? 'rgba(255, 0, 110, 0.5)' : 'transparent',
              border: '2px solid #ff006e',
              color: '#ff006e',
              borderRadius: '5px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 0 15px rgba(255, 0, 110, 0.3)',
              transition: 'all 0.3s ease',
              marginBottom: '20px'
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                const target = e.target as HTMLButtonElement;
                target.style.background = '#ff006e';
                target.style.color = 'white';
                target.style.boxShadow = '0 0 25px rgba(255, 0, 110, 0.6)';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                const target = e.target as HTMLButtonElement;
                target.style.background = 'transparent';
                target.style.color = '#ff006e';
                target.style.boxShadow = '0 0 15px rgba(255, 0, 110, 0.3)';
              }
            }}
          >
            {isLoading ? 'CONNEXION...' : 'SE CONNECTER'}
          </button>
        </form>

        {/* Register Link */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#8338ec', fontSize: '0.9rem', marginBottom: '10px' }}>
            Pas encore de compte ?
          </p>
          <Link
            to="/register"
            style={{
              color: '#ff006e',
              textDecoration: 'none',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLAnchorElement).style.textShadow = '0 0 10px #ff006e';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLAnchorElement).style.textShadow = 'none';
            }}
          >
            CRÉER UN COMPTE
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

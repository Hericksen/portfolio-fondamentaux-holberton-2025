import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
        {/* Header avec bouton logout et admin */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Link
            to="/admin"
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
              textDecoration: 'none',
              boxShadow: '0 0 15px rgba(6, 255, 165, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              const target = e.target as HTMLAnchorElement;
              target.style.background = '#06ffa5';
              target.style.color = 'black';
            }}
            onMouseOut={(e) => {
              const target = e.target as HTMLAnchorElement;
              target.style.background = 'transparent';
              target.style.color = '#06ffa5';
            }}
          >
            ADMIN
          </Link>
          <Link
            to="/database"
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: '2px solid #ffbe0b',
              color: '#ffbe0b',
              borderRadius: '5px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              cursor: 'pointer',
              textDecoration: 'none',
              boxShadow: '0 0 15px rgba(255, 190, 11, 0.3)',
              transition: 'all 0.3s ease',
              marginLeft: '10px'
            }}
            onMouseOver={(e: any) => {
              const target = e.target as HTMLAnchorElement;
              target.style.background = '#ffbe0b';
              target.style.color = 'black';
            }}
            onMouseOut={(e: any) => {
              const target = e.target as HTMLAnchorElement;
              target.style.background = 'transparent';
              target.style.color = '#ffbe0b';
            }}
          >
            DATABASE
          </Link>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: '2px solid #ff6b6b',
              color: '#ff6b6b',
              borderRadius: '5px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 0 15px rgba(255, 107, 107, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = '#ff6b6b';
              target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = 'transparent';
              target.style.color = '#ff6b6b';
            }}
          >
            LOGOUT
          </button>
        </div>

        {/* Header Principal */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            color: '#ff006e',
            textShadow: '0 0 20px #ff006e',
            marginBottom: '10px'
          }}>
            PIXELPUMP
          </h1>
          <p style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            background: 'linear-gradient(135deg, #ff006e 0%, #8338ec 25%, #ffbe0b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            TRANSFORME TON HÉRO
          </p>
        </div>

        {/* Grille principale */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '20px',
          marginBottom: '40px'
        }}>
          
          {/* Avatar */}
          <div style={{
            background: 'rgba(26, 0, 51, 0.8)',
            border: '2px solid #ff006e',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 0 20px rgba(255, 0, 110, 0.3)'
          }}>
            <h3 style={{ 
              textAlign: 'center', 
              color: '#ff006e', 
              marginBottom: '20px',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}>
              TON HÉRO
            </h3>
            
            <div style={{
              width: '200px',
              height: '200px',
              margin: '0 auto',
              background: 'linear-gradient(135deg, #ff006e, #8338ec, #ffbe0b)',
              borderRadius: '10px',
              border: '3px solid #ff006e',
              position: 'relative',
              boxShadow: '0 0 30px rgba(255, 0, 110, 0.5)'
            }}>
              {/* Personnage simple */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '80px',
                background: '#ff8500',
                borderRadius: '5px'
              }}>
                {/* Yeux */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  width: '8px',
                  height: '8px',
                  background: 'black',
                  borderRadius: '50%'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '8px',
                  height: '8px',
                  background: 'black',
                  borderRadius: '50%'
                }}></div>
              </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#ffbe0b',
                textShadow: '0 0 10px #ffbe0b'
              }}>
                NIV. 6
              </div>
              <div style={{
                background: 'rgba(0,0,0,0.5)',
                height: '10px',
                borderRadius: '5px',
                margin: '10px 0',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '75%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #ff006e, #8338ec)',
                  borderRadius: '5px',
                  boxShadow: '0 0 10px rgba(255, 0, 110, 0.8)'
                }}></div>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#9d4edd' }}>
                2850 / 3500 XP
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            background: 'rgba(26, 0, 51, 0.8)',
            border: '2px solid #ff006e',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 0 20px rgba(255, 0, 110, 0.3)'
          }}>
            <h3 style={{ 
              color: '#ff006e', 
              marginBottom: '20px',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}>
              STATS
            </h3>
            
            {[
              { name: 'FORCE', value: 12, width: '80%' },
              { name: 'ENDURANCE', value: 8, width: '65%' },
              { name: 'VITESSE', value: 13, width: '90%' },
              { name: 'ÉNERGIE', value: '85%', width: '85%' }
            ].map((stat, i) => (
              <div key={i} style={{ marginBottom: '15px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '5px'
                }}>
                  <span style={{ color: '#ff006e', fontSize: '0.9rem' }}>
                    {stat.name}
                  </span>
                  <span style={{ color: '#8338ec', fontWeight: 'bold' }}>
                    {stat.value}
                  </span>
                </div>
                <div style={{
                  background: 'rgba(0,0,0,0.5)',
                  height: '8px',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: stat.width,
                    height: '100%',
                    background: 'linear-gradient(90deg, #ff006e, #8338ec)',
                    borderRadius: '4px',
                    boxShadow: '0 0 8px rgba(255, 0, 110, 0.6)'
                  }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Badges */}
          <div style={{
            background: 'rgba(26, 0, 51, 0.8)',
            border: '2px solid #ff006e',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 0 20px rgba(255, 0, 110, 0.3)'
          }}>
            <h3 style={{ 
              color: '#ff006e', 
              marginBottom: '20px',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}>
              BADGES
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px'
            }}>
              {[
                { name: 'FORCE', color: '#ef4444' },
                { name: 'DÉFENSE', color: '#3b82f6' },
                { name: 'VITESSE', color: '#eab308' },
                { name: 'ÉLITE', color: '#8b5cf6' }
              ].map((badge, i) => (
                <div key={i} style={{
                  background: 'rgba(26, 0, 51, 0.6)',
                  border: '1px solid #ff006e',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    background: badge.color,
                    borderRadius: '50%',
                    margin: '0 auto 8px'
                  }}></div>
                  <div style={{ fontSize: '0.7rem', color: '#ff006e' }}>
                    {badge.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Défis du jour */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'rgba(26, 0, 51, 0.8)',
            border: '2px solid #ff006e',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 0 20px rgba(255, 0, 110, 0.3)'
          }}>
            <h3 style={{ 
              color: '#ff006e', 
              marginBottom: '20px',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}>
              DÉFIS DU JOUR
            </h3>
            
            {[
              { name: '20 SQUATS', done: true },
              { name: '5 POMPES', done: false },
              { name: '1KM COURSE', done: false }
            ].map((challenge, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
                padding: '8px',
                background: 'rgba(255, 0, 110, 0.1)',
                borderRadius: '5px'
              }}>
                <span style={{ color: 'white' }}>▶ {challenge.name}</span>
                <span style={{ 
                  color: challenge.done ? '#06ffa5' : '#ff006e',
                  fontSize: '1.2rem'
                }}>
                  {challenge.done ? '✓' : '○'}
                </span>
              </div>
            ))}
            
            <div style={{
              marginTop: '20px',
              padding: '10px',
              background: 'rgba(6, 255, 165, 0.2)',
              borderRadius: '5px',
              textAlign: 'center',
              color: '#06ffa5',
              fontWeight: 'bold'
            }}>
              RÉCOMPENSE: +50 XP
            </div>
          </div>

          <div style={{
            background: 'rgba(26, 0, 51, 0.8)',
            border: '2px solid #ff006e',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 0 20px rgba(255, 0, 110, 0.3)'
          }}>
            <h3 style={{ 
              color: '#ff006e', 
              marginBottom: '20px',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}>
              PROGRESSION HEBDO
            </h3>
            
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #ff006e, #8338ec, #ffbe0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '10px'
              }}>
                4/7 JOURS
              </div>
              <div style={{
                background: 'rgba(0,0,0,0.5)',
                height: '10px',
                borderRadius: '5px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '60%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #ff006e, #8338ec)',
                  borderRadius: '5px',
                  boxShadow: '0 0 10px rgba(255, 0, 110, 0.8)'
                }}></div>
              </div>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '5px',
              marginBottom: '20px'
            }}>
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                <div key={i} style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  background: i < 4 ? 'linear-gradient(135deg, #ff006e, #8338ec)' : '#4b5563',
                  color: 'white'
                }}>
                  {day}
                </div>
              ))}
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <span style={{ 
                color: '#06ffa5', 
                fontWeight: 'bold',
                textShadow: '0 0 5px #06ffa5'
              }}>
                +280 XP cette semaine
              </span>
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate('/profile')}
            style={{
              padding: '15px 30px',
              background: 'transparent',
              border: '2px solid #ff006e',
              color: '#ff006e',
              borderRadius: '5px',
              fontSize: '1rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 0 15px rgba(255, 0, 110, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = '#ff006e';
              target.style.color = 'white';
              target.style.boxShadow = '0 0 25px rgba(255, 0, 110, 0.6)';
            }}
            onMouseOut={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = 'transparent';
              target.style.color = '#ff006e';
              target.style.boxShadow = '0 0 15px rgba(255, 0, 110, 0.3)';
            }}
          >
            COMMENCER ENTRAÎNEMENT
          </button>
          <button
            onClick={() => navigate('/quests')}
            style={{
              padding: '15px 30px',
              background: 'transparent',
              border: '2px solid #ff006e',
              color: '#ff006e',
              borderRadius: '5px',
              fontSize: '1rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 0 15px rgba(255, 0, 110, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = '#ff006e';
              target.style.color = 'white';
              target.style.boxShadow = '0 0 25px rgba(255, 0, 110, 0.6)';
            }}
            onMouseOut={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = 'transparent';
              target.style.color = '#ff006e';
              target.style.boxShadow = '0 0 15px rgba(255, 0, 110, 0.3)';
            }}
          >
            VOIR QUÊTES
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

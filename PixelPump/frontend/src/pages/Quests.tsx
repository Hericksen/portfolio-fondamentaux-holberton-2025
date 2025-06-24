import React from 'react';
import { Link } from 'react-router-dom';

const Quests: React.FC = () => {
  const dailyQuests = [
    {
      id: 1,
      title: "Entraînement Matinal",
      description: "Complète ta routine fitness du matin",
      tasks: ["20 SQUATS", "5 POMPES", "1 MIN PLANK"],
      xp: 50,
      completed: false,
      difficulty: "FACILE"
    },
    {
      id: 2,
      title: "Défi Code",
      description: "Résous 3 problèmes d'algorithmes",
      tasks: ["3 PROBLÈMES", "0 BUGS", "CODE PROPRE"],
      xp: 75,
      completed: true,
      difficulty: "MOYEN"
    },
    {
      id: 3,
      title: "Course du Soir",
      description: "Cours pendant 30 minutes",
      tasks: ["30 MIN COURSE", "5 KM DISTANCE"],
      xp: 60,
      completed: false,
      difficulty: "FACILE"
    }
  ];

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
            onMouseOver={(e) => {
              const target = e.target as HTMLAnchorElement;
              target.style.background = '#8338ec';
              target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              const target = e.target as HTMLAnchorElement;
              target.style.background = 'transparent';
              target.style.color = '#8338ec';
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
            QUÊTES
          </h1>
          
          <div></div>
        </div>

        {/* Stats header */}
        <div style={{
          background: 'rgba(26, 0, 51, 0.8)',
          border: '2px solid #ff006e',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0 0 20px rgba(255, 0, 110, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div>
              <p style={{ color: '#8338ec', fontSize: '0.9rem', marginBottom: '5px' }}>QUÊTES COMPLÉTÉES</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff006e' }}>1/3</p>
            </div>
            <div>
              <p style={{ color: '#8338ec', fontSize: '0.9rem', marginBottom: '5px' }}>XP AUJOURD'HUI</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffbe0b' }}>75</p>
            </div>
            <div>
              <p style={{ color: '#8338ec', fontSize: '0.9rem', marginBottom: '5px' }}>SÉRIE ACTUELLE</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#06ffa5' }}>5 JOURS</p>
            </div>
          </div>
        </div>

        {/* Quêtes du jour */}
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#ff006e',
          marginBottom: '20px',
          textTransform: 'uppercase'
        }}>
          QUÊTES DU JOUR
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {dailyQuests.map((quest) => (
            <div
              key={quest.id}
              style={{
                background: quest.completed 
                  ? 'rgba(6, 255, 165, 0.1)' 
                  : 'rgba(26, 0, 51, 0.8)',
                border: quest.completed 
                  ? '2px solid #06ffa5' 
                  : '2px solid #ff006e',
                borderRadius: '10px',
                padding: '20px',
                boxShadow: quest.completed 
                  ? '0 0 20px rgba(6, 255, 165, 0.3)' 
                  : '0 0 20px rgba(255, 0, 110, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Header de la quête */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{
                  background: quest.difficulty === 'FACILE' ? '#06ffa5' : quest.difficulty === 'MOYEN' ? '#ffbe0b' : '#ff006e',
                  color: '#000',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {quest.difficulty}
                </span>
                <span style={{
                  color: '#ffbe0b',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}>
                  +{quest.xp} XP
                </span>
              </div>

              <h3 style={{
                color: '#ff006e',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                {quest.title}
              </h3>

              <p style={{
                color: '#8338ec',
                fontSize: '0.9rem',
                marginBottom: '15px'
              }}>
                {quest.description}
              </p>

              {/* Tâches */}
              <div style={{ marginBottom: '20px' }}>
                {quest.tasks.map((task, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '8px',
                      padding: '8px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '4px'
                    }}
                  >
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      border: '2px solid #ff006e',
                      background: quest.completed ? '#06ffa5' : 'transparent',
                      marginRight: '10px'
                    }}></div>
                    <span style={{
                      color: quest.completed ? '#06ffa5' : 'white',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}>
                      {task}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bouton d'action */}
              <button
                disabled={quest.completed}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: quest.completed ? 'rgba(6, 255, 165, 0.2)' : 'transparent',
                  border: quest.completed ? '2px solid #06ffa5' : '2px solid #ff006e',
                  color: quest.completed ? '#06ffa5' : '#ff006e',
                  borderRadius: '5px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  cursor: quest.completed ? 'not-allowed' : 'pointer',
                  boxShadow: quest.completed 
                    ? '0 0 15px rgba(6, 255, 165, 0.3)' 
                    : '0 0 15px rgba(255, 0, 110, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (!quest.completed) {
                    const target = e.target as HTMLButtonElement;
                    target.style.background = '#ff006e';
                    target.style.color = 'white';
                    target.style.boxShadow = '0 0 25px rgba(255, 0, 110, 0.6)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!quest.completed) {
                    const target = e.target as HTMLButtonElement;
                    target.style.background = 'transparent';
                    target.style.color = '#ff006e';
                    target.style.boxShadow = '0 0 15px rgba(255, 0, 110, 0.3)';
                  }
                }}
              >
                {quest.completed ? '✓ COMPLÉTÉE' : 'COMMENCER'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quests;

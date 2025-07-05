import React, { useState } from 'react';
import { PixelAvatar } from './PixelAvatar';

interface ModernAvatarCustomizerProps {
  currentAvatar: {
    hairColor?: string;
    skinColor?: string;
    outfit?: string;
    accessory?: string;
    expression?: string;
  };
  onAvatarChange: (newAvatar: any) => void;
  className?: string;
}

export const ModernAvatarCustomizer: React.FC<ModernAvatarCustomizerProps> = ({
  currentAvatar,
  onAvatarChange,
  className = ""
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('hair');
  const [avatarData, setAvatarData] = useState(currentAvatar);

  const categories = {
    hair: {
      title: "Cheveux",
      icon: "💇",
      options: [
        { id: 'pink', name: 'Rose Cyber', value: '#ff4081' },
        { id: 'purple', name: 'Violet Royal', value: '#9c27b0' },
        { id: 'green', name: 'Vert Matrix', value: '#00ffaa' },
        { id: 'yellow', name: 'Jaune Électrique', value: '#ffeb3b' },
        { id: 'blue', name: 'Bleu Cyber', value: '#2196f3' },
        { id: 'red', name: 'Rouge Feu', value: '#f44336' },
        { id: 'white', name: 'Blanc Glacier', value: '#ffffff' },
        { id: 'black', name: 'Noir Cosmos', value: '#000000' }
      ]
    },
    skin: {
      title: "Peau",
      icon: "👤",
      options: [
        { id: 'light', name: 'Clair', value: '#fdbcb4' },
        { id: 'medium', name: 'Moyen', value: '#e0ac69' },
        { id: 'tan', name: 'Bronzé', value: '#c68642' },
        { id: 'dark', name: 'Foncé', value: '#8d5524' },
        { id: 'cyber1', name: 'Cyber Rose', value: '#ffb3ba' },
        { id: 'cyber2', name: 'Cyber Bleu', value: '#bae1ff' },
        { id: 'cyber3', name: 'Cyber Vert', value: '#baffc9' },
        { id: 'cyber4', name: 'Cyber Violet', value: '#d4baff' }
      ]
    },
    outfit: {
      title: "Tenue",
      icon: "👕",
      options: [
        { id: 'default', name: 'Classique', value: 'default' },
        { id: 'premium', name: 'Premium', value: 'premium' },
        { id: 'cyber', name: 'Cyberpunk', value: 'cyber' },
        { id: 'developer', name: 'Développeur', value: 'developer' }
      ]
    },
    accessory: {
      title: "Accessoires",
      icon: "🕶️",
      options: [
        { id: 'none', name: 'Aucun', value: 'none' },
        { id: 'glasses', name: 'Lunettes', value: 'glasses' },
        { id: 'headphones', name: 'Casque Audio', value: 'headphones' },
        { id: 'cap', name: 'Casquette', value: 'cap' },
        { id: 'crown', name: 'Couronne', value: 'crown' }
      ]
    },
    expression: {
      title: "Expression",
      icon: "😊",
      options: [
        { id: 'neutral', name: 'Neutre', value: 'neutral' },
        { id: 'happy', name: 'Heureux', value: 'happy' },
        { id: 'cool', name: 'Cool', value: 'cool' },
        { id: 'focus', name: 'Concentré', value: 'focus' }
      ]
    }
  };

  const handleOptionSelect = (category: string, value: string) => {
    const newAvatar = {
      ...avatarData,
      [category === 'hair' ? 'hairColor' : 
       category === 'skin' ? 'skinColor' : 
       category]: value
    };
    setAvatarData(newAvatar);
    onAvatarChange(newAvatar);
  };

  return (
    <div className={`modern-avatar-customizer ${className}`}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '30px',
        alignItems: 'start'
      }}>
        
        {/* Aperçu Avatar */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '20px',
          padding: '30px',
          textAlign: 'center',
          border: '2px solid rgba(255, 64, 129, 0.3)'
        }}>
          <h4 style={{
            color: '#ff4081',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginBottom: '20px',
            textTransform: 'uppercase'
          }}>
            Aperçu
          </h4>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <PixelAvatar
              avatarData={avatarData}
              size="large"
              showOnline={true}
            />
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: '#b8b8b8',
            fontStyle: 'italic'
          }}>
            Style: Pixel Art Cyberpunk
          </div>
        </div>

        {/* Options de Personnalisation */}
        <div>
          {/* Navigation Catégories */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '10px',
            marginBottom: '25px'
          }}>
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                style={{
                  padding: '12px 8px',
                  background: selectedCategory === key 
                    ? 'linear-gradient(135deg, #ff4081, #9c27b0)'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: selectedCategory === key ? 'white' : '#b8b8b8',
                  border: selectedCategory === key 
                    ? '2px solid #ff4081' 
                    : '2px solid transparent',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}
                onMouseOver={(e) => {
                  if (selectedCategory !== key) {
                    e.currentTarget.style.background = 'rgba(255, 64, 129, 0.2)';
                    e.currentTarget.style.color = '#ff4081';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedCategory !== key) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = '#b8b8b8';
                  }
                }}
              >
                <div style={{ fontSize: '1.2rem', marginBottom: '5px' }}>
                  {category.icon}
                </div>
                {category.title}
              </button>
            ))}
          </div>

          {/* Options de la Catégorie Sélectionnée */}
          <div>
            <h5 style={{
              color: '#ff4081',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              marginBottom: '15px',
              textTransform: 'uppercase'
            }}>
              {categories[selectedCategory as keyof typeof categories].title}
            </h5>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '12px'
            }}>
              {categories[selectedCategory as keyof typeof categories].options.map((option) => {
                const isSelected = selectedCategory === 'hair' ? avatarData.hairColor === option.value :
                                 selectedCategory === 'skin' ? avatarData.skinColor === option.value :
                                 avatarData[selectedCategory as keyof typeof avatarData] === option.value;

                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(selectedCategory, option.value)}
                    style={{
                      padding: '15px 10px',
                      background: isSelected 
                        ? 'linear-gradient(135deg, #00ffaa, #8338ec)'
                        : 'rgba(255, 255, 255, 0.1)',
                      color: isSelected ? 'black' : 'white',
                      border: isSelected 
                        ? '2px solid #00ffaa' 
                        : '2px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '0.9rem',
                      fontWeight: isSelected ? 'bold' : 'normal',
                      textAlign: 'center',
                      minHeight: '60px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                    onMouseOver={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'rgba(255, 64, 129, 0.2)';
                        e.currentTarget.style.borderColor = '#ff4081';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      }
                    }}
                  >
                    {/* Prévisualisation couleur */}
                    {(selectedCategory === 'hair' || selectedCategory === 'skin') && (
                      <div 
                        style={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: option.value,
                          borderRadius: '50%',
                          marginBottom: '8px',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          imageRendering: 'pixelated'
                        }}
                      />
                    )}
                    <span style={{ fontSize: '0.8rem' }}>
                      {option.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernAvatarCustomizer;

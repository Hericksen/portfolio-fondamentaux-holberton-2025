import React from 'react';

interface AvatarData {
  body?: string;
  outfit?: string;
  accessory?: string;
  color?: string;
  background?: string;
  hair?: string;
  eyes?: string;
}

interface PixelAvatarProps {
  avatarData?: AvatarData;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const PixelAvatar: React.FC<PixelAvatarProps> = ({ 
  avatarData = {}, 
  size = 'medium',
  className = "" 
}) => {
  const dimensions = {
    small: { width: 64, height: 64, scale: 0.6 },
    medium: { width: 96, height: 96, scale: 0.8 },
    large: { width: 128, height: 128, scale: 1.0 }
  };

  const { width, height, scale } = dimensions[size];
  const primaryColor = avatarData.color || '#ff006e';
  const hair = avatarData.hair || 'short';
  const outfit = avatarData.outfit || 'casual';
  const accessory = avatarData.accessory || 'none';
  const background = avatarData.background || 'gym';

  // Couleurs de cheveux
  const getHairColor = () => {
    switch(hair) {
      case 'short': return '#8B4513';
      case 'long': return '#DAA520';
      case 'punk': return '#9932CC';
      case 'afro': return '#2F1B14';
      case 'bald': return 'transparent';
      case 'ponytail': return '#CD853F';
      default: return '#8B4513';
    }
  };

  // Couleurs de tenue
  const getOutfitColors = () => {
    switch(outfit) {
      case 'casual': return { shirt: '#4169E1', accent: '#FFA500' };
      case 'sport': return { shirt: '#00FF7F', accent: '#000000' };
      case 'formal': return { shirt: '#FFFFFF', accent: '#000000' };
      case 'cyber': return { shirt: '#00FFFF', accent: '#FF00FF' };
      case 'ninja': return { shirt: '#2F2F2F', accent: '#800080' };
      case 'pirate': return { shirt: '#8B0000', accent: '#DAA520' };
      case 'knight': return { shirt: '#C0C0C0', accent: '#FFD700' };
      case 'wizard': return { shirt: '#4B0082', accent: '#9400D3' };
      default: return { shirt: '#4169E1', accent: '#FFA500' };
    }
  };

  // Arrière-plan
  const getBackgroundGradient = () => {
    switch(background) {
      case 'gym': return 'linear-gradient(135deg, #FF6B6B, #4ECDC4)';
      case 'cyber': return 'linear-gradient(135deg, #667eea, #764ba2)';
      case 'nature': return 'linear-gradient(135deg, #56ab2f, #a8edea)';
      case 'city': return 'linear-gradient(135deg, #bdc3c7, #2c3e50)';
      case 'space': return 'linear-gradient(135deg, #000428, #004e92)';
      case 'beach': return 'linear-gradient(135deg, #fdbb2d, #22c1c3)';
      case 'mountain': return 'linear-gradient(135deg, #8360c3, #2ebf91)';
      case 'retro': return 'linear-gradient(135deg, #ffecd2, #fcb69f)';
      default: return 'linear-gradient(135deg, #FF6B6B, #4ECDC4)';
    }
  };

  const hairColor = getHairColor();
  const outfitColors = getOutfitColors();

  return (
    <div 
      className={`modern-avatar ${className}`}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'center'
      }}
    >
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 100 100" 
        className="rounded-2xl shadow-lg"
        style={{ background: getBackgroundGradient() }}
      >
        {/* Dégradés */}
        <defs>
          <radialGradient id="skinGradient" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#FDBCB4" />
            <stop offset="100%" stopColor="#F8AFA6" />
          </radialGradient>
          <linearGradient id="shirtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={outfitColors.shirt} />
            <stop offset="100%" stopColor={outfitColors.accent} />
          </linearGradient>
          <radialGradient id="hairGradient" cx="50%" cy="20%" r="80%">
            <stop offset="0%" stopColor={hairColor} />
            <stop offset="100%" stopColor={hairColor} opacity="0.8" />
          </radialGradient>
        </defs>

        {/* Corps/Torse */}
        <ellipse 
          cx="50" 
          cy="70" 
          rx="25" 
          ry="20" 
          fill="url(#shirtGradient)"
          stroke="#333"
          strokeWidth="1"
        />

        {/* Tête */}
        <circle 
          cx="50" 
          cy="35" 
          r="18" 
          fill="url(#skinGradient)"
          stroke="#D4A574"
          strokeWidth="1.5"
        />

        {/* Cheveux */}
        {hair !== 'bald' && (
          <>
            {hair === 'short' && (
              <path 
                d="M 32 25 Q 50 15 68 25 Q 70 35 65 40 Q 50 20 35 40 Q 30 35 32 25" 
                fill="url(#hairGradient)"
                stroke="#333"
                strokeWidth="0.5"
              />
            )}
            {hair === 'long' && (
              <>
                <path 
                  d="M 30 25 Q 50 10 70 25 Q 75 40 70 50 Q 50 20 30 50 Q 25 40 30 25" 
                  fill="url(#hairGradient)"
                  stroke="#333"
                  strokeWidth="0.5"
                />
                <ellipse cx="28" cy="55" rx="4" ry="15" fill={hairColor} />
                <ellipse cx="72" cy="55" rx="4" ry="15" fill={hairColor} />
              </>
            )}
            {hair === 'punk' && (
              <>
                <rect x="45" y="10" width="4" height="15" fill={hairColor} />
                <rect x="50" y="8" width="4" height="17" fill={hairColor} />
                <rect x="55" y="10" width="4" height="15" fill={hairColor} />
                <rect x="40" y="12" width="4" height="13" fill={hairColor} />
                <rect x="60" y="12" width="4" height="13" fill={hairColor} />
              </>
            )}
            {hair === 'afro' && (
              <circle 
                cx="50" 
                cy="28" 
                r="22" 
                fill={hairColor}
                stroke="#333"
                strokeWidth="0.5"
              />
            )}
            {hair === 'ponytail' && (
              <>
                <circle cx="50" cy="25" r="15" fill={hairColor} />
                <ellipse cx="68" cy="35" rx="6" ry="12" fill={hairColor} />
              </>
            )}
          </>
        )}

        {/* Yeux */}
        <circle cx="44" cy="32" r="2.5" fill="white" stroke="#333" strokeWidth="0.5" />
        <circle cx="56" cy="32" r="2.5" fill="white" stroke="#333" strokeWidth="0.5" />
        <circle cx="44" cy="32" r="1.5" fill="#333" />
        <circle cx="56" cy="32" r="1.5" fill="#333" />
        <circle cx="44.5" cy="31.5" r="0.5" fill="white" />
        <circle cx="56.5" cy="31.5" r="0.5" fill="white" />

        {/* Nez */}
        <ellipse cx="50" cy="37" rx="1" ry="2" fill="#E8A688" />

        {/* Bouche */}
        <path d="M 47 42 Q 50 45 53 42" stroke="#D4756B" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Accessoires */}
        {accessory === 'glasses' && (
          <>
            <circle cx="44" cy="32" r="6" fill="none" stroke="#333" strokeWidth="2" />
            <circle cx="56" cy="32" r="6" fill="none" stroke="#333" strokeWidth="2" />
            <line x1="50" y1="30" x2="50" y2="32" stroke="#333" strokeWidth="1.5" />
          </>
        )}
        {accessory === 'sunglasses' && (
          <>
            <circle cx="44" cy="32" r="6" fill="#1a1a1a" stroke="#333" strokeWidth="2" />
            <circle cx="56" cy="32" r="6" fill="#1a1a1a" stroke="#333" strokeWidth="2" />
            <line x1="50" y1="30" x2="50" y2="32" stroke="#333" strokeWidth="1.5" />
          </>
        )}
        {accessory === 'headphones' && (
          <>
            <path d="M 30 28 Q 30 20 35 20 Q 40 20 40 25" stroke="#333" strokeWidth="3" fill="none" />
            <path d="M 60 25 Q 60 20 65 20 Q 70 20 70 28" stroke="#333" strokeWidth="3" fill="none" />
            <circle cx="35" cy="28" r="4" fill="#333" />
            <circle cx="65" cy="28" r="4" fill="#333" />
          </>
        )}
        {accessory === 'cap' && (
          <>
            <ellipse cx="50" cy="20" rx="20" ry="8" fill={primaryColor} stroke="#333" strokeWidth="1" />
            <ellipse cx="35" cy="25" rx="12" ry="3" fill={primaryColor} stroke="#333" strokeWidth="1" />
          </>
        )}
        {accessory === 'crown' && (
          <>
            <rect x="35" y="18" width="30" height="4" fill="#FFD700" stroke="#333" strokeWidth="0.5" />
            <polygon points="38,18 42,12 46,18" fill="#FFD700" stroke="#333" strokeWidth="0.5" />
            <polygon points="46,18 50,8 54,18" fill="#FFD700" stroke="#333" strokeWidth="0.5" />
            <polygon points="54,18 58,12 62,18" fill="#FFD700" stroke="#333" strokeWidth="0.5" />
            <circle cx="50" cy="10" r="2" fill="#FF0000" />
          </>
        )}
        {accessory === 'bandana' && (
          <polygon 
            points="32,22 50,15 68,22 65,35 50,25 35,35" 
            fill={primaryColor} 
            stroke="#333" 
            strokeWidth="1"
          />
        )}
        {accessory === 'mask' && (
          <ellipse 
            cx="50" 
            cy="38" 
            rx="12" 
            ry="8" 
            fill={primaryColor} 
            stroke="#333" 
            strokeWidth="1"
            opacity="0.8"
          />
        )}

        {/* Détails de tenue selon le style */}
        {outfit === 'formal' && (
          <>
            <rect x="47" y="60" width="6" height="20" fill="#000" />
            <circle cx="47" cy="65" r="1" fill="#fff" />
            <circle cx="47" cy="70" r="1" fill="#fff" />
            <circle cx="47" cy="75" r="1" fill="#fff" />
          </>
        )}
        {outfit === 'knight' && (
          <>
            <rect x="45" y="55" width="10" height="3" fill="#FFD700" />
            <circle cx="50" cy="62" r="2" fill="#FFD700" />
          </>
        )}
        {outfit === 'wizard' && (
          <>
            <polygon points="48,55 50,50 52,55" fill="#FFD700" />
            <circle cx="50" cy="52" r="1" fill="#FFD700" />
          </>
        )}
      </svg>
    </div>
  );
};

export default PixelAvatar;

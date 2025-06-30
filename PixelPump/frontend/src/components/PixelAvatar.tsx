import React from 'react';

interface AvatarData {
  body?: string;
  outfit?: string;
  accessory?: string;
  color?: string;
  background?: string;
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
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  const primaryColor = avatarData.color || '#ff006e';
  const backgroundColor = avatarData.background === 'gym' ? 'from-purple-900 via-pink-700 to-red-800' : 'from-blue-900 via-indigo-700 to-purple-800';

  return (
    <div className={`pixel-art-character ${sizeClasses[size]} ${className}`}>
      <div className="relative w-full h-full p-1">
        {/* Arrière-plan style personnalisé */}
        <div className={`absolute inset-0 bg-gradient-to-b ${backgroundColor} rounded-lg`}></div>
        
        {/* Grille de pixels */}
        <div className="relative w-full h-full grid grid-cols-8 grid-rows-8 gap-0.5 z-10">
          {/* Ligne 1 - Cheveux */}
          <div className="bg-red-600 rounded-sm"></div>
          <div className="bg-red-600 rounded-sm"></div>
          <div className="bg-red-700 rounded-sm"></div>
          <div className="bg-red-700 rounded-sm"></div>
          <div className="bg-red-700 rounded-sm"></div>
          <div className="bg-red-700 rounded-sm"></div>
          <div className="bg-red-600 rounded-sm"></div>
          <div className="bg-red-600 rounded-sm"></div>
          
          {/* Ligne 2 - Cheveux/Front */}
          <div className="bg-red-600 rounded-sm"></div>
          <div className="bg-orange-300 rounded-sm"></div>
          <div className="bg-orange-300 rounded-sm"></div>
          <div className="bg-orange-200 rounded-sm"></div>
          <div className="bg-orange-200 rounded-sm"></div>
          <div className="bg-orange-300 rounded-sm"></div>
          <div className="bg-orange-300 rounded-sm"></div>
          <div className="bg-red-600 rounded-sm"></div>
          
          {/* Ligne 3 - Yeux */}
          <div className="bg-transparent"></div>
          <div className="bg-orange-300 rounded-sm"></div>
          <div className="bg-black rounded-sm"></div>
          <div className="bg-orange-200 rounded-sm"></div>
          <div className="bg-orange-200 rounded-sm"></div>
          <div className="bg-black rounded-sm"></div>
          <div className="bg-orange-300 rounded-sm"></div>
          <div className="bg-transparent"></div>
          
          {/* Ligne 4 - Visage */}
          <div className="bg-transparent"></div>
          <div className="bg-orange-300 rounded-sm"></div>
          <div className="bg-orange-200 rounded-sm"></div>
          <div className="bg-pink-400 rounded-sm"></div>
          <div className="bg-pink-400 rounded-sm"></div>
          <div className="bg-orange-200 rounded-sm"></div>
          <div className="bg-orange-300 rounded-sm"></div>
          <div className="bg-transparent"></div>
          
          {/* Ligne 5 - Corps haut */}
          <div className="bg-transparent"></div>
          <div className="bg-red-500 rounded-sm"></div>
          <div className="bg-red-600 rounded-sm"></div>
          <div className="bg-red-700 rounded-sm"></div>
          <div className="bg-red-700 rounded-sm"></div>
          <div className="bg-red-600 rounded-sm"></div>
          <div className="bg-red-500 rounded-sm"></div>
          <div className="bg-transparent"></div>
          
          {/* Ligne 6 - Bras */}
          <div className="bg-orange-400 rounded-sm"></div>
          <div className="bg-red-500 rounded-sm"></div>
          <div className="bg-red-600 rounded-sm"></div>
          <div className="bg-yellow-400 rounded-sm"></div>
          <div className="bg-yellow-400 rounded-sm"></div>
          <div className="bg-red-600 rounded-sm"></div>
          <div className="bg-red-500 rounded-sm"></div>
          <div className="bg-orange-400 rounded-sm"></div>
          
          {/* Ligne 7 - Corps bas */}
          <div className="bg-transparent"></div>
          <div className="bg-blue-800 rounded-sm"></div>
          <div className="bg-blue-900 rounded-sm"></div>
          <div className="bg-blue-700 rounded-sm"></div>
          <div className="bg-blue-700 rounded-sm"></div>
          <div className="bg-blue-900 rounded-sm"></div>
          <div className="bg-blue-800 rounded-sm"></div>
          <div className="bg-transparent"></div>
          
          {/* Ligne 8 - Jambes */}
          <div className="bg-transparent"></div>
          <div className="bg-blue-800 rounded-sm"></div>
          <div className="bg-transparent"></div>
          <div className="bg-gray-700 rounded-sm"></div>
          <div className="bg-gray-700 rounded-sm"></div>
          <div className="bg-transparent"></div>
          <div className="bg-blue-800 rounded-sm"></div>
          <div className="bg-transparent"></div>
        </div>
        
        {/* Effet de glow personnalisé */}
        <div 
          className="absolute inset-0 rounded-lg shadow-lg" 
          style={{
            boxShadow: `0 0 20px ${primaryColor}40, inset 0 0 20px ${primaryColor}20`
          }}
        ></div>
      </div>
    </div>
  );
};

export default PixelAvatar;

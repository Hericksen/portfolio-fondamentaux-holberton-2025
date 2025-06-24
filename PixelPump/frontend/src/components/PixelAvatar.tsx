import React from 'react';

interface PixelAvatarProps {
  className?: string;
}

export const PixelAvatar: React.FC<PixelAvatarProps> = ({ className = "" }) => {
  return (
    <div className={`pixel-art-character ${className}`}>
      <div className="relative w-full h-full p-4">
        {/* Arrière-plan style cyberpunk */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-pink-700 to-red-800 rounded-lg"></div>
        
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
          <div className="bg-transparent rounded-sm"></div>
          <div className="bg-orange-300 rounded-sm"></div>
          <div className="bg-black rounded-sm"></div>
          <div className="bg-orange-200 rounded-sm"></div>
          <div className="bg-orange-200 rounded-sm"></div>
          <div className="bg-black rounded-sm"></div>
          <div className="bg-orange-300 rounded-sm"></div>
          <div className="bg-transparent rounded-sm"></div>
          
          {/* Ligne 4 - Visage */}
          <div className="bg-transparent rounded-sm"></div>
          <div className="bg-orange-300 rounded-sm"></div>
          <div className="bg-orange-200 rounded-sm"></div>
          <div className="bg-pink-400 rounded-sm"></div>
          <div className="bg-pink-400 rounded-sm"></div>
          <div className="bg-orange-200 rounded-sm"></div>
          <div className="bg-orange-300 rounded-sm"></div>
          <div className="bg-transparent rounded-sm"></div>
          
          {/* Ligne 5 - Corps haut */}
          <div className="bg-transparent rounded-sm"></div>
          <div className="bg-red-500 rounded-sm"></div>
          <div className="bg-red-600 rounded-sm"></div>
          <div className="bg-red-700 rounded-sm"></div>
          <div className="bg-red-700 rounded-sm"></div>
          <div className="bg-red-600 rounded-sm"></div>
          <div className="bg-red-500 rounded-sm"></div>
          <div className="bg-transparent rounded-sm"></div>
          
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
          <div className="bg-transparent rounded-sm"></div>
          <div className="bg-blue-800 rounded-sm"></div>
          <div className="bg-blue-900 rounded-sm"></div>
          <div className="bg-blue-700 rounded-sm"></div>
          <div className="bg-blue-700 rounded-sm"></div>
          <div className="bg-blue-900 rounded-sm"></div>
          <div className="bg-blue-800 rounded-sm"></div>
          <div className="bg-transparent rounded-sm"></div>
          
          {/* Ligne 8 - Jambes */}
          <div className="bg-transparent rounded-sm"></div>
          <div className="bg-blue-800 rounded-sm"></div>
          <div className="bg-transparent rounded-sm"></div>
          <div className="bg-gray-700 rounded-sm"></div>
          <div className="bg-gray-700 rounded-sm"></div>
          <div className="bg-transparent rounded-sm"></div>
          <div className="bg-blue-800 rounded-sm"></div>
          <div className="bg-transparent rounded-sm"></div>
        </div>
        
        {/* Effet de glow autour du personnage */}
        <div className="absolute inset-0 rounded-lg shadow-lg" 
             style={{boxShadow: '0 0 30px rgba(255, 0, 110, 0.6), inset 0 0 30px rgba(255, 0, 110, 0.2)'}}></div>
      </div>
    </div>
  );
};

export default PixelAvatar;

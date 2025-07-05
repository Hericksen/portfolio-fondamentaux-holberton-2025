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
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  const primaryColor = avatarData.color || '#ff006e';
  const hair = avatarData.hair || 'short';
  const outfit = avatarData.outfit || 'casual';
  const accessory = avatarData.accessory || 'none';
  
  // Couleurs basées sur le background sélectionné
  const getBackgroundGradient = () => {
    switch(avatarData.background) {
      case 'gym': return 'from-purple-900 via-pink-700 to-red-800';
      case 'cyber': return 'from-blue-900 via-cyan-700 to-purple-800';
      case 'nature': return 'from-green-900 via-emerald-700 to-teal-800';
      case 'city': return 'from-gray-900 via-slate-700 to-zinc-800';
      case 'space': return 'from-indigo-900 via-purple-700 to-black';
      case 'beach': return 'from-yellow-600 via-orange-500 to-blue-600';
      case 'mountain': return 'from-stone-700 via-gray-600 to-slate-800';
      case 'retro': return 'from-pink-800 via-purple-600 to-blue-700';
      default: return 'from-purple-900 via-pink-700 to-red-800';
    }
  };

  // Couleurs de cheveux basées sur la sélection
  const getHairColors = () => {
    switch(hair) {
      case 'short': return { primary: 'bg-red-600', secondary: 'bg-red-700' };
      case 'long': return { primary: 'bg-yellow-600', secondary: 'bg-yellow-700' };
      case 'punk': return { primary: 'bg-purple-500', secondary: 'bg-purple-600' };
      case 'afro': return { primary: 'bg-amber-800', secondary: 'bg-amber-900' };
      case 'bald': return { primary: 'bg-orange-300', secondary: 'bg-orange-200' };
      case 'ponytail': return { primary: 'bg-rose-500', secondary: 'bg-rose-600' };
      default: return { primary: 'bg-red-600', secondary: 'bg-red-700' };
    }
  };

  // Couleurs de tenue basées sur la sélection
  const getOutfitColors = () => {
    switch(outfit) {
      case 'casual': return { shirt: 'bg-red-500', pants: 'bg-blue-800' };
      case 'sport': return { shirt: 'bg-green-500', pants: 'bg-black' };
      case 'formal': return { shirt: 'bg-white', pants: 'bg-gray-800' };
      case 'cyber': return { shirt: 'bg-cyan-400', pants: 'bg-purple-700' };
      case 'ninja': return { shirt: 'bg-gray-900', pants: 'bg-black' };
      case 'pirate': return { shirt: 'bg-red-700', pants: 'bg-amber-800' };
      case 'knight': return { shirt: 'bg-gray-400', pants: 'bg-gray-600' };
      case 'wizard': return { shirt: 'bg-purple-600', pants: 'bg-indigo-800' };
      default: return { shirt: 'bg-red-500', pants: 'bg-blue-800' };
    }
  };

  const hairColors = getHairColors();
  const outfitColors = getOutfitColors();

  return (
    <div className={`pixel-art-character ${sizeClasses[size]} ${className}`}>
      <div className="relative w-full h-full p-1">
        {/* Arrière-plan style personnalisé */}
        <div className={`absolute inset-0 bg-gradient-to-b ${getBackgroundGradient()} rounded-lg`}></div>
        
        {/* Grille de pixels */}
        <div className="relative w-full h-full grid grid-cols-8 grid-rows-8 gap-0.5 z-10">
          {/* Ligne 1 - Cheveux (adaptatifs) */}
          {hair !== 'bald' ? (
            <>
              <div className={`${hairColors.primary} rounded-sm`}></div>
              <div className={`${hairColors.primary} rounded-sm`}></div>
              <div className={`${hairColors.secondary} rounded-sm`}></div>
              <div className={`${hairColors.secondary} rounded-sm`}></div>
              <div className={`${hairColors.secondary} rounded-sm`}></div>
              <div className={`${hairColors.secondary} rounded-sm`}></div>
              <div className={`${hairColors.primary} rounded-sm`}></div>
              <div className={`${hairColors.primary} rounded-sm`}></div>
            </>
          ) : (
            // Tête chauve
            <>
              <div className="bg-transparent"></div>
              <div className="bg-orange-300 rounded-sm"></div>
              <div className="bg-orange-200 rounded-sm"></div>
              <div className="bg-orange-200 rounded-sm"></div>
              <div className="bg-orange-200 rounded-sm"></div>
              <div className="bg-orange-200 rounded-sm"></div>
              <div className="bg-orange-300 rounded-sm"></div>
              <div className="bg-transparent"></div>
            </>
          )}
          
          {/* Ligne 2 - Cheveux/Front */}
          {hair !== 'bald' ? (
            <>
              <div className={`${hairColors.primary} rounded-sm`}></div>
              <div className="bg-orange-300 rounded-sm"></div>
              <div className="bg-orange-300 rounded-sm"></div>
              <div className="bg-orange-200 rounded-sm"></div>
              <div className="bg-orange-200 rounded-sm"></div>
              <div className="bg-orange-300 rounded-sm"></div>
              <div className="bg-orange-300 rounded-sm"></div>
              <div className={`${hairColors.primary} rounded-sm`}></div>
            </>
          ) : (
            // Tête chauve ligne 2
            <>
              <div className="bg-transparent"></div>
              <div className="bg-orange-300 rounded-sm"></div>
              <div className="bg-orange-300 rounded-sm"></div>
              <div className="bg-orange-200 rounded-sm"></div>
              <div className="bg-orange-200 rounded-sm"></div>
              <div className="bg-orange-300 rounded-sm"></div>
              <div className="bg-orange-300 rounded-sm"></div>
              <div className="bg-transparent"></div>
            </>
          )}
          
          {/* Ligne 3 - Yeux (adaptatifs avec accessoires) */}
          <div className="bg-transparent"></div>
          <div className="bg-orange-300 rounded-sm"></div>
          {accessory === 'glasses' || accessory === 'sunglasses' ? (
            <div className="bg-gray-800 rounded-sm"></div>
          ) : (
            <div className="bg-black rounded-sm"></div>
          )}
          <div className="bg-orange-200 rounded-sm"></div>
          <div className="bg-orange-200 rounded-sm"></div>
          {accessory === 'glasses' || accessory === 'sunglasses' ? (
            <div className="bg-gray-800 rounded-sm"></div>
          ) : (
            <div className="bg-black rounded-sm"></div>
          )}
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
          
          {/* Ligne 5 - Corps haut (tenue adaptative) */}
          <div className="bg-transparent"></div>
          <div className={`${outfitColors.shirt} rounded-sm`}></div>
          <div className={`${outfitColors.shirt} rounded-sm`}></div>
          <div className={`${outfitColors.shirt} rounded-sm`}></div>
          <div className={`${outfitColors.shirt} rounded-sm`}></div>
          <div className={`${outfitColors.shirt} rounded-sm`}></div>
          <div className={`${outfitColors.shirt} rounded-sm`}></div>
          <div className="bg-transparent"></div>
          
          {/* Ligne 6 - Bras */}
          <div className="bg-orange-400 rounded-sm"></div>
          <div className={`${outfitColors.shirt} rounded-sm`}></div>
          <div className={`${outfitColors.shirt} rounded-sm`}></div>
          <div className="bg-yellow-400 rounded-sm"></div>
          <div className="bg-yellow-400 rounded-sm"></div>
          <div className={`${outfitColors.shirt} rounded-sm`}></div>
          <div className={`${outfitColors.shirt} rounded-sm`}></div>
          <div className="bg-orange-400 rounded-sm"></div>
          
          {/* Ligne 7 - Corps bas (pantalon adaptatif) */}
          <div className="bg-transparent"></div>
          <div className={`${outfitColors.pants} rounded-sm`}></div>
          <div className={`${outfitColors.pants} rounded-sm`}></div>
          <div className={`${outfitColors.pants} rounded-sm`}></div>
          <div className={`${outfitColors.pants} rounded-sm`}></div>
          <div className={`${outfitColors.pants} rounded-sm`}></div>
          <div className={`${outfitColors.pants} rounded-sm`}></div>
          <div className="bg-transparent"></div>
          
          {/* Ligne 8 - Jambes/Chaussures */}
          <div className="bg-transparent"></div>
          <div className={`${outfitColors.pants} rounded-sm`}></div>
          <div className="bg-transparent"></div>
          <div className="bg-gray-700 rounded-sm"></div>
          <div className="bg-gray-700 rounded-sm"></div>
          <div className="bg-transparent"></div>
          <div className={`${outfitColors.pants} rounded-sm`}></div>
          <div className="bg-transparent"></div>
        </div>
        
        {/* Accessoires overlay */}
        {accessory === 'crown' && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
            <div className="w-4 h-3 bg-yellow-400 rounded-t border border-yellow-600"></div>
          </div>
        )}
        
        {accessory === 'headphones' && (
          <div className="absolute top-4 left-0 right-0">
            <div className="mx-auto w-6 h-1 bg-gray-800 rounded"></div>
          </div>
        )}
        
        {accessory === 'cap' && (
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-2 bg-red-600 rounded-t"></div>
          </div>
        )}
        
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

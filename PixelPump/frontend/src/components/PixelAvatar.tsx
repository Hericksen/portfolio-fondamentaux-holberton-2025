import React from 'react';

interface PixelAvatarProps {
  // Legacy compatibility
  avatarData?: {
    hairColor?: string;
    skinColor?: string;
    outfit?: string;
    accessory?: string;
    expression?: string;
  };
  size?: number | 'small' | 'medium' | 'large';
  
  // New props
  showOnline?: boolean;
  hairColor?: string;
  skinColor?: string;
  outfit?: 'default' | 'premium' | 'cyber' | 'developer';
  accessory?: 'none' | 'glasses' | 'headphones' | 'cap' | 'crown';
  expression?: 'neutral' | 'happy' | 'cool' | 'focus';
}

const PixelAvatar: React.FC<PixelAvatarProps> = ({
  avatarData,
  size = 64,
  showOnline = false,
  hairColor: propHairColor,
  skinColor: propSkinColor,
  outfit: propOutfit,
  accessory: propAccessory,
  expression: propExpression
}) => {
  // Handle size conversion
  const numericSize = typeof size === 'string' 
    ? size === 'small' ? 32 
      : size === 'medium' ? 64 
      : size === 'large' ? 96 
      : 64
    : size;

  // Use avatarData if provided, otherwise use props
  const hairColor = avatarData?.hairColor || propHairColor || '#ff4081';
  const skinColor = avatarData?.skinColor || propSkinColor || '#fdbcb4';
  const outfit = (avatarData?.outfit as 'default' | 'premium' | 'cyber' | 'developer') || propOutfit || 'default';
  const accessory = (avatarData?.accessory as 'none' | 'glasses' | 'headphones' | 'cap' | 'crown') || propAccessory || 'none';
  const expression = (avatarData?.expression as 'neutral' | 'happy' | 'cool' | 'focus') || propExpression || 'neutral';

  const pixelSize = Math.max(1, Math.floor(numericSize / 16));

  // Color scheme inspired by PixelPump cyberpunk theme
  const colors = {
    cyber: '#ff4081',      // Pink
    neon: '#00ffaa',       // Green neon
    purple: '#9c27b0',     // Purple
    yellow: '#ffeb3b',     // Yellow
    dark: '#1a1a2e',       // Dark background
    shadow: '#16213e',     // Shadow
    white: '#ffffff',
    black: '#000000'
  };

  const outfitColors = {
    default: colors.purple,
    premium: colors.cyber,
    cyber: colors.neon,
    developer: colors.yellow
  };

  const eyeStyle = expression === 'focus' ? 'focused' : 
                  expression === 'happy' ? 'happy' : 
                  expression === 'cool' ? 'cool' : 'normal';

  return (
    <div 
      className="pixel-avatar relative"
      style={{ 
        width: numericSize, 
        height: numericSize,
        imageRendering: 'pixelated' as const,
        filter: 'drop-shadow(0 0 8px rgba(255, 64, 129, 0.3))'
      }}
    >
      {/* Pixel grid background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${colors.cyber}33 1px, transparent 1px),
            linear-gradient(to bottom, ${colors.cyber}33 1px, transparent 1px)
          `,
          backgroundSize: `${pixelSize * 2}px ${pixelSize * 2}px`
        }}
      />

      {/* Main avatar container */}
      <div className="relative w-full h-full">
        {/* Head outline */}
        <div 
          className="absolute"
          style={{
            left: `${pixelSize * 3}px`,
            top: `${pixelSize * 2}px`,
            width: `${pixelSize * 10}px`,
            height: `${pixelSize * 12}px`,
            backgroundColor: colors.dark,
            border: `${pixelSize}px solid ${colors.shadow}`
          }}
        />

        {/* Face */}
        <div 
          className="absolute"
          style={{
            left: `${pixelSize * 4}px`,
            top: `${pixelSize * 3}px`,
            width: `${pixelSize * 8}px`,
            height: `${pixelSize * 10}px`,
            backgroundColor: skinColor
          }}
        />

        {/* Hair */}
        <div 
          className="absolute"
          style={{
            left: `${pixelSize * 3}px`,
            top: `${pixelSize * 2}px`,
            width: `${pixelSize * 10}px`,
            height: `${pixelSize * 4}px`,
            backgroundColor: hairColor
          }}
        />

        {/* Eyes */}
        <div 
          className="absolute"
          style={{
            left: `${pixelSize * 5}px`,
            top: `${pixelSize * 6}px`,
            width: `${pixelSize * 2}px`,
            height: `${pixelSize * 2}px`,
            backgroundColor: eyeStyle === 'cool' ? colors.neon : 
                           eyeStyle === 'focused' ? colors.yellow : colors.white
          }}
        />
        <div 
          className="absolute"
          style={{
            left: `${pixelSize * 9}px`,
            top: `${pixelSize * 6}px`,
            width: `${pixelSize * 2}px`,
            height: `${pixelSize * 2}px`,
            backgroundColor: eyeStyle === 'cool' ? colors.neon : 
                           eyeStyle === 'focused' ? colors.yellow : colors.white
          }}
        />

        {/* Eye pupils */}
        {eyeStyle === 'normal' && (
          <>
            <div 
              className="absolute"
              style={{
                left: `${pixelSize * 5.5}px`,
                top: `${pixelSize * 6.5}px`,
                width: `${pixelSize}px`,
                height: `${pixelSize}px`,
                backgroundColor: colors.black
              }}
            />
            <div 
              className="absolute"
              style={{
                left: `${pixelSize * 9.5}px`,
                top: `${pixelSize * 6.5}px`,
                width: `${pixelSize}px`,
                height: `${pixelSize}px`,
                backgroundColor: colors.black
              }}
            />
          </>
        )}

        {/* Happy eyes */}
        {eyeStyle === 'happy' && (
          <>
            <div 
              className="absolute"
              style={{
                left: `${pixelSize * 5}px`,
                top: `${pixelSize * 6.5}px`,
                width: `${pixelSize * 2}px`,
                height: `${pixelSize}px`,
                backgroundColor: colors.black
              }}
            />
            <div 
              className="absolute"
              style={{
                left: `${pixelSize * 9}px`,
                top: `${pixelSize * 6.5}px`,
                width: `${pixelSize * 2}px`,
                height: `${pixelSize}px`,
                backgroundColor: colors.black
              }}
            />
          </>
        )}

        {/* Mouth */}
        <div 
          className="absolute"
          style={{
            left: `${pixelSize * 7}px`,
            top: `${pixelSize * 9}px`,
            width: `${pixelSize * 2}px`,
            height: `${pixelSize}px`,
            backgroundColor: expression === 'happy' ? colors.cyber : colors.dark
          }}
        />

        {/* Body/Outfit */}
        <div 
          className="absolute"
          style={{
            left: `${pixelSize * 2}px`,
            top: `${pixelSize * 13}px`,
            width: `${pixelSize * 12}px`,
            height: `${pixelSize * 3}px`,
            backgroundColor: outfitColors[outfit]
          }}
        />

        {/* Accessories */}
        {accessory === 'glasses' && (
          <>
            <div 
              className="absolute"
              style={{
                left: `${pixelSize * 4.5}px`,
                top: `${pixelSize * 5.5}px`,
                width: `${pixelSize * 3}px`,
                height: `${pixelSize * 3}px`,
                border: `${pixelSize * 0.5}px solid ${colors.dark}`,
                backgroundColor: 'transparent'
              }}
            />
            <div 
              className="absolute"
              style={{
                left: `${pixelSize * 8.5}px`,
                top: `${pixelSize * 5.5}px`,
                width: `${pixelSize * 3}px`,
                height: `${pixelSize * 3}px`,
                border: `${pixelSize * 0.5}px solid ${colors.dark}`,
                backgroundColor: 'transparent'
              }}
            />
            <div 
              className="absolute"
              style={{
                left: `${pixelSize * 7.5}px`,
                top: `${pixelSize * 6.5}px`,
                width: `${pixelSize}px`,
                height: `${pixelSize * 0.5}px`,
                backgroundColor: colors.dark
              }}
            />
          </>
        )}

        {accessory === 'headphones' && (
          <>
            <div 
              className="absolute"
              style={{
                left: `${pixelSize * 2}px`,
                top: `${pixelSize * 4}px`,
                width: `${pixelSize * 2}px`,
                height: `${pixelSize * 6}px`,
                backgroundColor: colors.neon,
                borderRadius: `${pixelSize}px`
              }}
            />
            <div 
              className="absolute"
              style={{
                left: `${pixelSize * 12}px`,
                top: `${pixelSize * 4}px`,
                width: `${pixelSize * 2}px`,
                height: `${pixelSize * 6}px`,
                backgroundColor: colors.neon,
                borderRadius: `${pixelSize}px`
              }}
            />
            <div 
              className="absolute"
              style={{
                left: `${pixelSize * 4}px`,
                top: `${pixelSize * 2}px`,
                width: `${pixelSize * 8}px`,
                height: `${pixelSize}px`,
                backgroundColor: colors.neon
              }}
            />
          </>
        )}

        {accessory === 'cap' && (
          <div 
            className="absolute"
            style={{
              left: `${pixelSize * 2}px`,
              top: `${pixelSize * 1}px`,
              width: `${pixelSize * 12}px`,
              height: `${pixelSize * 3}px`,
              backgroundColor: colors.purple
            }}
          />
        )}

        {accessory === 'crown' && (
          <>
            <div 
              className="absolute"
              style={{
                left: `${pixelSize * 4}px`,
                top: `${pixelSize * 1}px`,
                width: `${pixelSize * 8}px`,
                height: `${pixelSize * 2}px`,
                backgroundColor: colors.yellow
              }}
            />
            <div 
              className="absolute"
              style={{
                left: `${pixelSize * 5}px`,
                top: `${pixelSize * 0}px`,
                width: `${pixelSize}px`,
                height: `${pixelSize * 2}px`,
                backgroundColor: colors.yellow
              }}
            />
            <div 
              className="absolute"
              style={{
                left: `${pixelSize * 7.5}px`,
                top: `${pixelSize * 0}px`,
                width: `${pixelSize}px`,
                height: `${pixelSize * 2}px`,
                backgroundColor: colors.yellow
              }}
            />
            <div 
              className="absolute"
              style={{
                left: `${pixelSize * 10}px`,
                top: `${pixelSize * 0}px`,
                width: `${pixelSize}px`,
                height: `${pixelSize * 2}px`,
                backgroundColor: colors.yellow
              }}
            />
          </>
        )}
      </div>

      {/* Online indicator */}
      {showOnline && (
        <div 
          className="absolute bottom-0 right-0"
          style={{
            width: `${pixelSize * 3}px`,
            height: `${pixelSize * 3}px`,
            backgroundColor: colors.neon,
            border: `${pixelSize * 0.5}px solid ${colors.dark}`,
            borderRadius: '50%',
            boxShadow: `0 0 ${pixelSize * 2}px ${colors.neon}`
          }}
        />
      )}

      {/* Cyberpunk glow effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, transparent 60%, ${colors.cyber}10 100%)`,
          borderRadius: `${pixelSize}px`
        }}
      />
    </div>
  );
};

export default PixelAvatar;
export { PixelAvatar };

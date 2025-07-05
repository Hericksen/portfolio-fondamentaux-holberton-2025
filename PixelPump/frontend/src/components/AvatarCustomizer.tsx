import React, { useState } from 'react';
import { PixelAvatar } from './PixelAvatar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Palette, 
  Shirt, 
  Glasses,
  Sparkles,
  User,
  Mountain,
  Camera
} from 'lucide-react';

interface AvatarData {
  body?: string;
  outfit?: string;
  accessory?: string;
  color?: string;
  background?: string;
  hair?: string;
  eyes?: string;
}

interface AvatarCustomizerProps {
  currentAvatar: AvatarData;
  onAvatarChange: (newAvatar: AvatarData) => void;
  className?: string;
}

export const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({
  currentAvatar,
  onAvatarChange,
  className = ""
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('colors');

  // Options de personnalisation
  const customizationOptions = {
    colors: {
      title: "Couleurs",
      icon: <Palette className="w-4 h-4" />,
      options: [
        { id: 'pink', name: 'Rose Cyber', value: '#ff006e', preview: '#ff006e' },
        { id: 'purple', name: 'Violet Royal', value: '#8338ec', preview: '#8338ec' },
        { id: 'blue', name: 'Bleu Électrique', value: '#06ffa5', preview: '#06ffa5' },
        { id: 'green', name: 'Vert Matrix', value: '#06ffa5', preview: '#06ffa5' },
        { id: 'orange', name: 'Orange Flame', value: '#fb8500', preview: '#fb8500' },
        { id: 'red', name: 'Rouge Passion', value: '#dc2626', preview: '#dc2626' },
        { id: 'yellow', name: 'Jaune Lightning', value: '#facc15', preview: '#facc15' },
        { id: 'cyan', name: 'Cyan Neon', value: '#06b6d4', preview: '#06b6d4' }
      ]
    },
    hair: {
      title: "Coiffures",
      icon: <User className="w-4 h-4" />,
      options: [
        { id: 'short', name: 'Cheveux Courts', value: 'short', emoji: '✂️' },
        { id: 'long', name: 'Cheveux Longs', value: 'long', emoji: '💇‍♀️' },
        { id: 'punk', name: 'Punk Rock', value: 'punk', emoji: '🤘' },
        { id: 'afro', name: 'Afro Style', value: 'afro', emoji: '✨' },
        { id: 'bald', name: 'Chauve', value: 'bald', emoji: '🥚' },
        { id: 'ponytail', name: 'Queue de Cheval', value: 'ponytail', emoji: '🐴' }
      ]
    },
    outfits: {
      title: "Tenues",
      icon: <Shirt className="w-4 h-4" />,
      options: [
        { id: 'casual', name: 'Décontracté', value: 'casual', emoji: '👕' },
        { id: 'sport', name: 'Sportif', value: 'sport', emoji: '🏃‍♂️' },
        { id: 'formal', name: 'Formel', value: 'formal', emoji: '👔' },
        { id: 'cyber', name: 'Cyber', value: 'cyber', emoji: '🤖' },
        { id: 'ninja', name: 'Ninja', value: 'ninja', emoji: '🥷' },
        { id: 'pirate', name: 'Pirate', value: 'pirate', emoji: '🏴‍☠️' },
        { id: 'knight', name: 'Chevalier', value: 'knight', emoji: '⚔️' },
        { id: 'wizard', name: 'Magicien', value: 'wizard', emoji: '🧙‍♂️' }
      ]
    },
    accessories: {
      title: "Accessoires",
      icon: <Glasses className="w-4 h-4" />,
      options: [
        { id: 'none', name: 'Aucun', value: 'none', emoji: '🚫' },
        { id: 'glasses', name: 'Lunettes', value: 'glasses', emoji: '🤓' },
        { id: 'sunglasses', name: 'Lunettes de Soleil', value: 'sunglasses', emoji: '😎' },
        { id: 'headphones', name: 'Casque Audio', value: 'headphones', emoji: '🎧' },
        { id: 'cap', name: 'Casquette', value: 'cap', emoji: '🧢' },
        { id: 'crown', name: 'Couronne', value: 'crown', emoji: '👑' },
        { id: 'bandana', name: 'Bandana', value: 'bandana', emoji: '🥋' },
        { id: 'mask', name: 'Masque', value: 'mask', emoji: '🎭' }
      ]
    },
    backgrounds: {
      title: "Arrière-plans",
      icon: <Mountain className="w-4 h-4" />,
      options: [
        { id: 'gym', name: 'Salle de Sport', value: 'gym', emoji: '🏋️‍♂️' },
        { id: 'cyber', name: 'Cyber Space', value: 'cyber', emoji: '🌐' },
        { id: 'nature', name: 'Nature', value: 'nature', emoji: '🌲' },
        { id: 'city', name: 'Ville', value: 'city', emoji: '🏙️' },
        { id: 'space', name: 'Espace', value: 'space', emoji: '🚀' },
        { id: 'beach', name: 'Plage', value: 'beach', emoji: '🏖️' },
        { id: 'mountain', name: 'Montagne', value: 'mountain', emoji: '⛰️' },
        { id: 'retro', name: 'Rétro', value: 'retro', emoji: '📺' }
      ]
    }
  };

  const categories = Object.keys(customizationOptions);

  const handleOptionSelect = (category: string, value: string) => {
    const newAvatar = {
      ...currentAvatar,
      [category === 'colors' ? 'color' : 
       category === 'hair' ? 'hair' :
       category === 'outfits' ? 'outfit' :
       category === 'accessories' ? 'accessory' :
       category === 'backgrounds' ? 'background' : category]: value
    };
    onAvatarChange(newAvatar);
  };

  const getCurrentValue = (category: string) => {
    switch(category) {
      case 'colors': return currentAvatar.color || '#ff006e';
      case 'hair': return currentAvatar.hair || 'short';
      case 'outfits': return currentAvatar.outfit || 'casual';
      case 'accessories': return currentAvatar.accessory || 'none';
      case 'backgrounds': return currentAvatar.background || 'gym';
      default: return '';
    }
  };

  return (
    <div className={`avatar-customizer ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: '#ff006e' }} />
            Personnalisation Avatar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Aperçu de l'avatar */}
          <div className="flex justify-center">
            <div className="relative">
              <PixelAvatar 
                avatarData={currentAvatar} 
                size="large"
                className="border-2 border-purple-300 rounded-lg"
              />
              <div className="absolute -bottom-2 -right-2">
                <Badge variant="outline" className="bg-purple-100 text-purple-700">
                  Aperçu
                </Badge>
              </div>
            </div>
          </div>

          {/* Catégories */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              const categoryData = customizationOptions[category as keyof typeof customizationOptions];
              
              return (
                <Button
                  key={category}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 ${
                    isSelected 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'border-purple-300 text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  {categoryData.icon}
                  {categoryData.title}
                </Button>
              );
            })}
          </div>

          {/* Options de la catégorie sélectionnée */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-center">
              {customizationOptions[selectedCategory as keyof typeof customizationOptions]?.title}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {customizationOptions[selectedCategory as keyof typeof customizationOptions]?.options.map((option) => {
                const currentValue = getCurrentValue(selectedCategory);
                const isSelected = currentValue === option.value;
                
                return (
                  <Button
                    key={option.id}
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => handleOptionSelect(selectedCategory, option.value)}
                    className={`h-auto p-3 flex flex-col items-center gap-2 ${
                      isSelected 
                        ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {/* Prévisualisation couleur */}
                    {selectedCategory === 'colors' && 'preview' in option && option.preview && (
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: option.preview }}
                      />
                    )}
                    
                    {/* Emoji pour les autres catégories */}
                    {selectedCategory !== 'colors' && 'emoji' in option && option.emoji && (
                      <span className="text-2xl">{option.emoji}</span>
                    )}
                    
                    <span className="text-sm font-medium text-center">
                      {option.name}
                    </span>
                    
                    {isSelected && (
                      <div className="absolute top-1 right-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full border border-white" />
                      </div>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Actions rapides */}
          <div className="flex justify-center gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                // Avatar aléatoire
                const categories = Object.keys(customizationOptions);
                
                categories.forEach(category => {
                  const options = customizationOptions[category as keyof typeof customizationOptions].options;
                  const randomOption = options[Math.floor(Math.random() * options.length)];
                  handleOptionSelect(category, randomOption.value);
                });
              }}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Aléatoire
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                // Reset aux valeurs par défaut
                const defaultAvatar = {
                  body: 'default',
                  outfit: 'casual',
                  accessory: 'none',
                  color: '#ff006e',
                  background: 'gym',
                  hair: 'short'
                };
                onAvatarChange(defaultAvatar);
              }}
              className="flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvatarCustomizer;

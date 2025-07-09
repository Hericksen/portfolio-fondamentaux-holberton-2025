import React, { useState } from 'react';
import { PixelAvatar } from './PixelAvatar';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Pencil,
  X, 
  Palette, 
  User, 
  Shirt, 
  Glasses, 
  Check,
  ChevronRight
} from 'lucide-react';

interface DiscreetAvatarCustomizerProps {
  currentAvatar: any;
  onAvatarChange: (newAvatar: any) => void;
  className?: string;
}

const avatarOptions = {
  hair: {
    title: "Cheveux",
    icon: User,
    items: [
      { id: 'short', name: 'Courts', preview: '👦' },
      { id: 'long', name: 'Longs', preview: '👧' },
      { id: 'curly', name: 'Bouclés', preview: '👨‍🦱' },
      { id: 'bald', name: 'Chauve', preview: '👨‍🦲' }
    ]
  },
  color: {
    title: "Couleur",
    icon: Palette,
    items: [
      { id: '#ff006e', name: 'Rose Cyber', preview: '#ff006e' },
      { id: '#8338ec', name: 'Violet', preview: '#8338ec' },
      { id: '#06ffa5', name: 'Vert Néon', preview: '#06ffa5' },
      { id: '#ffbe0b', name: 'Jaune', preview: '#ffbe0b' },
      { id: '#3a86ff', name: 'Bleu', preview: '#3a86ff' },
      { id: '#fb5607', name: 'Orange', preview: '#fb5607' }
    ]
  },
  outfit: {
    title: "Tenue",
    icon: Shirt,
    items: [
      { id: 'casual', name: 'Décontracté', preview: '👕' },
      { id: 'formal', name: 'Formel', preview: '👔' },
      { id: 'cyber', name: 'Cyberpunk', preview: '🥼' },
      { id: 'sport', name: 'Sport', preview: '🏃‍♂️' }
    ]
  },
  accessory: {
    title: "Accessoires",
    icon: Glasses,
    items: [
      { id: 'none', name: 'Aucun', preview: '❌' },
      { id: 'glasses', name: 'Lunettes', preview: '🤓' },
      { id: 'headphones', name: 'Casque', preview: '🎧' },
      { id: 'hat', name: 'Chapeau', preview: '🎩' },
      { id: 'crown', name: 'Couronne', preview: '👑' }
    ]
  }
};

export const DiscreetAvatarCustomizer: React.FC<DiscreetAvatarCustomizerProps> = ({
  currentAvatar,
  onAvatarChange,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('hair');
  const [previewAvatar, setPreviewAvatar] = useState(currentAvatar);
  const [hasChanges, setHasChanges] = useState(false);

  const handleOptionSelect = (category: string, value: string) => {
    const newAvatar = {
      ...previewAvatar,
      [category]: value
    };
    setPreviewAvatar(newAvatar);
    setHasChanges(true);
  };

  const handleSave = () => {
    onAvatarChange(previewAvatar);
    setHasChanges(false);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setPreviewAvatar(currentAvatar);
    setHasChanges(false);
    setIsOpen(false);
  };

  const getCurrentValue = (category: string) => {
    return previewAvatar[category] || (category === 'accessory' ? 'none' : avatarOptions[category as keyof typeof avatarOptions]?.items[0]?.id);
  };

  return (
    <>
      {/* Bouton discret pour ouvrir le customizer */}
      <Button
        onClick={() => setIsOpen(true)}
        size="sm"
        variant="ghost"
        className={`absolute bottom-0 right-0 w-7 h-7 p-0 rounded-full bg-black/40 border border-white/20 avatar-edit-button ${className}`}
        title="Personnaliser l'avatar"
      >
        <Pencil className="w-3 h-3 text-white/90" />
      </Button>

      {/* Modal de personnalisation */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          style={{ animation: 'fadeIn 0.2s ease-out' }}
        >
          <Card 
            className="w-full max-w-md mx-4 bg-gray-900/95 border border-purple-500/30 shadow-2xl rounded-2xl overflow-hidden"
            style={{ 
              animation: 'slideUp 0.3s ease-out',
              boxShadow: '0 0 30px rgba(131, 56, 236, 0.3)'
            }}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gradient-to-r from-purple-900/50 to-gray-900/80">
              <div>
                <h3 className="text-lg font-semibold text-white">Style Avatar</h3>
                <p className="text-xs text-gray-400">Personnalisez votre apparence</p>
              </div>
              <Button
                onClick={handleCancel}
                size="sm"
                variant="ghost"
                className="w-8 h-8 p-0 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                
                {/* Aperçu de l'avatar */}
                <div className="p-5 bg-gradient-to-b from-gray-800/50 to-gray-900/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative mb-3">
                      <PixelAvatar
                        avatarData={previewAvatar}
                        size="large"
                        showOnline={false}
                      />
                      {hasChanges && (
                        <Badge 
                          className="absolute -top-2 -right-2 bg-green-500/90 text-white px-1.5 py-0.5 text-xs animate-pulse"
                        >
                          <Check className="w-3 h-3 mr-0.5" />
                          Modifié
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 font-mono">Aperçu</p>
                  </div>
                </div>

                {/* Options de personnalisation */}
                <div className="md:col-span-2 p-4 max-h-80 overflow-y-auto">
                  
                  {/* Onglets de catégories */}
                  <div className="flex overflow-x-auto pb-2 space-x-1 mb-4 scrollbar-hide">
                    {Object.entries(avatarOptions).map(([key, category]) => {
                      const Icon = category.icon;
                      const isActive = activeTab === key;
                      
                      return (
                        <Button
                          key={key}
                          onClick={() => setActiveTab(key)}
                          size="sm"
                          variant="ghost"
                          className={`flex-shrink-0 flex items-center gap-1 px-3 py-1 rounded-full ${
                            isActive 
                              ? 'bg-purple-600/90 text-white' 
                              : 'text-gray-300 hover:text-white hover:bg-gray-700/40'
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          <span className="text-xs">{category.title}</span>
                        </Button>
                      );
                    })}
                  </div>

                  {/* Options de la catégorie sélectionnée */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {avatarOptions[activeTab as keyof typeof avatarOptions]?.items.map((item) => {
                        const isSelected = getCurrentValue(activeTab) === item.id;
                        
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleOptionSelect(activeTab, item.id)}
                            className={`relative flex items-center gap-2 p-2 rounded-lg transition-all ${
                              isSelected 
                                ? 'bg-purple-600/20 border border-purple-500/50 text-white' 
                                : 'bg-gray-800/40 hover:bg-gray-700/30 border border-transparent hover:border-purple-500/30 text-gray-300'
                            }`}
                          >
                            <div 
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${activeTab === 'color' ? 'border border-white/20' : ''}`}
                              style={{ 
                                backgroundColor: activeTab === 'color' ? item.preview : 'rgba(0,0,0,0.2)' 
                              }}
                            >
                              {activeTab !== 'color' && item.preview}
                            </div>
                            <span className="text-xs font-medium">{item.name}</span>
                            {isSelected && (
                              <div className="absolute top-1 right-1">
                                <Check className="w-3 h-3 text-purple-400" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-between p-3 border-t border-gray-700/50 bg-gray-800/30">
                <Button
                  onClick={handleCancel}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white text-xs"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!hasChanges}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 text-xs"
                >
                  Appliquer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default DiscreetAvatarCustomizer;

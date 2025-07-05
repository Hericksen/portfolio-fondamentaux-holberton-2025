import React, { useState } from 'react';
import { AvatarCustomizer } from '../components/AvatarCustomizer';
import { PixelAvatar } from '../components/PixelAvatar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

// Interface pour les données d'avatar
interface AvatarData {
  body?: string;
  outfit?: string;
  accessory?: string;
  color?: string;
  background?: string;
  hair?: string;
  eyes?: string;
}

export const AvatarTestPage: React.FC = () => {
  const [currentAvatar, setCurrentAvatar] = useState<AvatarData>({
    body: 'default',
    outfit: 'casual',
    accessory: 'none',
    color: '#ff006e',
    background: 'gym',
    hair: 'short',
    eyes: 'normal'
  });

  // Exemples de configurations prédéfinies
  const presetAvatars = [
    {
      name: "Athlète Cyber",
      data: {
        body: 'athletic',
        outfit: 'cyber',
        accessory: 'sunglasses',
        color: '#06ffa5',
        background: 'cyber',
        hair: 'punk',
        eyes: 'cyber'
      }
    },
    {
      name: "Ninja de l'Espace",
      data: {
        body: 'slim',
        outfit: 'ninja',
        accessory: 'mask',
        color: '#8338ec',
        background: 'space',
        hair: 'short',
        eyes: 'focused'
      }
    },
    {
      name: "Pirate des Plages",
      data: {
        body: 'muscular',
        outfit: 'pirate',
        accessory: 'bandana',
        color: '#fb8500',
        background: 'beach',
        hair: 'long',
        eyes: 'adventurous'
      }
    },
    {
      name: "Magicien Mystique",
      data: {
        body: 'mystical',
        outfit: 'wizard',
        accessory: 'crown',
        color: '#facc15',
        background: 'retro',
        hair: 'long',
        eyes: 'magical'
      }
    }
  ];

  const handleAvatarChange = (newAvatar: AvatarData) => {
    setCurrentAvatar(newAvatar);
  };

  const applyPreset = (preset: any) => {
    setCurrentAvatar(preset.data);
  };

  const generateRandomAvatar = () => {
    const outfits = ['casual', 'sport', 'formal', 'cyber', 'ninja', 'pirate', 'knight', 'wizard'];
    const accessories = ['none', 'glasses', 'sunglasses', 'headphones', 'cap', 'crown', 'bandana', 'mask'];
    const colors = ['#ff006e', '#8338ec', '#06ffa5', '#fb8500', '#dc2626', '#facc15', '#06b6d4'];
    const backgrounds = ['gym', 'cyber', 'nature', 'city', 'space', 'beach', 'mountain', 'retro'];
    const hairs = ['short', 'long', 'punk', 'afro', 'bald', 'ponytail'];

    setCurrentAvatar({
      body: 'default',
      outfit: outfits[Math.floor(Math.random() * outfits.length)],
      accessory: accessories[Math.floor(Math.random() * accessories.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      background: backgrounds[Math.floor(Math.random() * backgrounds.length)],
      hair: hairs[Math.floor(Math.random() * hairs.length)],
      eyes: 'normal'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              🎨 Test du Système de Personnalisation d'Avatar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              Testez toutes les fonctionnalités de personnalisation et vérifiez le rendu en temps réel
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personnalisateur */}
          <div>
            <AvatarCustomizer
              currentAvatar={currentAvatar}
              onAvatarChange={handleAvatarChange}
            />
          </div>

          {/* Aperçu et tests */}
          <div className="space-y-6">
            {/* Avatar de test en différentes tailles */}
            <Card>
              <CardHeader>
                <CardTitle>Aperçu Multi-Tailles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-6">
                  <div className="text-center">
                    <PixelAvatar avatarData={currentAvatar} size="small" />
                    <p className="text-sm mt-2">Petit</p>
                  </div>
                  <div className="text-center">
                    <PixelAvatar avatarData={currentAvatar} size="medium" />
                    <p className="text-sm mt-2">Moyen</p>
                  </div>
                  <div className="text-center">
                    <PixelAvatar avatarData={currentAvatar} size="large" />
                    <p className="text-sm mt-2">Grand</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Configurations prédéfinies */}
            <Card>
              <CardHeader>
                <CardTitle>Configurations Prédéfinies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {presetAvatars.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => applyPreset(preset)}
                      className="h-auto p-3 flex flex-col items-center gap-2"
                    >
                      <PixelAvatar avatarData={preset.data} size="small" />
                      <span className="text-xs">{preset.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions de test */}
            <Card>
              <CardHeader>
                <CardTitle>Actions de Test</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={generateRandomAvatar}
                  className="w-full"
                  variant="default"
                >
                  🎲 Générer Avatar Aléatoire
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={() => setCurrentAvatar({
                      body: 'default',
                      outfit: 'casual',
                      accessory: 'none',
                      color: '#ff006e',
                      background: 'gym',
                      hair: 'short',
                      eyes: 'normal'
                    })}
                    variant="outline"
                  >
                    🔄 Reset Défaut
                  </Button>
                  
                  <Button 
                    onClick={() => console.log('Avatar Data:', currentAvatar)}
                    variant="outline"
                  >
                    📋 Log Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Données actuelles */}
            <Card>
              <CardHeader>
                <CardTitle>Données Actuelles</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
                  {JSON.stringify(currentAvatar, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarTestPage;

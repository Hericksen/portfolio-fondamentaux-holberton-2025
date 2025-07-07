import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Zap, Target, Gamepad2 } from 'lucide-react';
import PixelAvatar from '../components/PixelAvatar';
import { OnboardingService } from '../services/onboarding';

interface WelcomeProps {
  onComplete?: (userData: {
    goals: string[];
    avatar: {
      skin: string;
      hair: string;
      clothes: string;
      accessories: string[];
    };
  }) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [avatar, setAvatar] = useState({
    skin: '#fdbcb4',
    hair: '#8b4513',
    clothes: '#4f46e5',
    accessories: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(false);

  const fitnessGoals = [
    { id: 'weight-loss', label: '🔥 Perdre du poids', description: 'Brûler les calories avec style' },
    { id: 'muscle-gain', label: '💪 Prendre du muscle', description: 'Devenir plus fort et sculpté' },
    { id: 'endurance', label: '🏃 Améliorer l\'endurance', description: 'Courir plus loin, plus longtemps' },
    { id: 'flexibility', label: '🧘 Gagner en souplesse', description: 'Yoga et étirements zen' },
    { id: 'general-health', label: '❤️ Santé générale', description: 'Bien-être au quotidien' },
    { id: 'stress-relief', label: '😌 Réduire le stress', description: 'Sport anti-stress naturel' }
  ];

  const skinColors = ['#fdbcb4', '#f1c27d', '#e0ac69', '#c68642', '#8d5524'];
  const hairColors = ['#8b4513', '#000000', '#654321', '#d2691e', '#daa520', '#ff6347'];
  const clothesColors = ['#4f46e5', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleNext = async () => {
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Terminer l'onboarding
      setIsLoading(true);
      try {
        const userData = {
          goals: selectedGoals,
          avatar
        };

        // Sauvegarder via le service
        await OnboardingService.completeOnboarding(userData);
        
        // Appeler le callback si fourni
        if (onComplete) {
          onComplete(userData);
        }
        
        // Rediriger vers le dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('Erreur lors de l\'onboarding:', error);
        // Continuer quand même vers le dashboard
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return selectedGoals.length > 0;
      case 1: return true; // Avatar toujours valide
      case 2: return true; // Tutorial step
      default: return false;
    }
  };

  const steps = [
    {
      title: "Tes objectifs fitness",
      subtitle: "Choisis ce qui te motive le plus",
      icon: <Target className="w-8 h-8" />
    },
    {
      title: "Crée ton avatar",
      subtitle: "Ton alter-ego fitness pixelisé",
      icon: <Gamepad2 className="w-8 h-8" />
    },
    {
      title: "Prêt à jouer !",
      subtitle: "Découvre comment ça marche",
      icon: <Zap className="w-8 h-8" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={index} className={`flex items-center ${index <= currentStep ? 'text-white' : 'text-gray-500'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 border-pink-500' 
                    : 'border-gray-500'
                }`}>
                  {index < currentStep ? '✓' : step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-20 h-1 mx-4 rounded ${
                    index < currentStep ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              {steps[currentStep].title}
            </h1>
            <p className="text-xl text-gray-300">
              {steps[currentStep].subtitle}
            </p>
          </div>

          {/* Step Content */}
          {currentStep === 0 && (
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {fitnessGoals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => handleGoalToggle(goal.id)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
                    selectedGoals.includes(goal.id)
                      ? 'border-pink-500 bg-pink-500/20 shadow-lg shadow-pink-500/25'
                      : 'border-gray-600 bg-white/5 hover:border-gray-400'
                  }`}
                >
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {goal.label}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {goal.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {currentStep === 1 && (
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Avatar Preview */}
              <div className="flex justify-center">
                <div className="bg-white/10 rounded-2xl p-8">
                  <PixelAvatar 
                    skinColor={avatar.skin}
                    hairColor={avatar.hair}
                    outfit="default"
                    accessory="none"
                    size={200}
                  />
                </div>
              </div>

              {/* Customization Options */}
              <div className="space-y-6">
                {/* Skin Color */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Couleur de peau</h3>
                  <div className="flex gap-3">
                    {skinColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setAvatar(prev => ({ ...prev, skin: color }))}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          avatar.skin === color ? 'border-white scale-110' : 'border-gray-400'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Hair Color */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Couleur de cheveux</h3>
                  <div className="flex gap-3">
                    {hairColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setAvatar(prev => ({ ...prev, hair: color }))}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          avatar.hair === color ? 'border-white scale-110' : 'border-gray-400'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Clothes Color */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Couleur de vêtements</h3>
                  <div className="flex gap-3">
                    {clothesColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setAvatar(prev => ({ ...prev, clothes: color }))}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          avatar.clothes === color ? 'border-white scale-110' : 'border-gray-400'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="text-center space-y-8">
              {/* Tutorial Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-xl p-6 border border-pink-500/30">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Complète des quêtes</h3>
                  <p className="text-gray-300 text-sm">Fais du sport, gagne de l'XP, level up !</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-xl p-6 border border-blue-500/30">
                  <div className="text-4xl mb-4">🏆</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Débloque des achievements</h3>
                  <p className="text-gray-300 text-sm">Collectionne des trophées uniques</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl p-6 border border-green-500/30">
                  <div className="text-4xl mb-4">🔥</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Maintiens ton streak</h3>
                  <p className="text-gray-300 text-sm">Plus tu joues, plus tu gagnes !</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-500/10 to-purple-600/10 rounded-xl p-6 border border-pink-500/20">
                <h3 className="text-xl font-semibold text-white mb-4">
                  🎮 Ta première quête t'attend !
                </h3>
                <p className="text-gray-300">
                  Prêt à transformer ton fitness en aventure épique ? 
                  Clique sur "Commencer" pour accéder à ton dashboard !
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all ${
                currentStep === 0
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Précédent</span>
            </button>

            <div className="text-gray-400 text-sm">
              {currentStep + 1} / {steps.length}
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
              className={`flex items-center space-x-2 px-8 py-3 rounded-full transition-all transform hover:scale-105 ${
                canProceed() && !isLoading
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>{isLoading ? 'Sauvegarde...' : currentStep === 2 ? 'Commencer' : 'Suivant'}</span>
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

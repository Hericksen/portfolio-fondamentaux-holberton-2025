import api from './api';

export interface OnboardingData {
  goals: string[];
  avatar: {
    skin: string;
    hair: string;
    clothes: string;
    accessories: string[];
  };
}

export const OnboardingService = {
  async completeOnboarding(data: OnboardingData) {
    try {
      // Sauvegarder l'avatar
      await api.put('/api/users/avatar', {
        skinColor: data.avatar.skin,
        hairColor: data.avatar.hair,
        outfit: 'default',
        accessory: data.avatar.accessories[0] || 'none'
      });

      // Sauvegarder les objectifs (si endpoint disponible)
      try {
        await api.put('/api/users/goals', {
          goals: data.goals
        });
      } catch (error) {
        console.log('Goals endpoint not available, saving locally');
        localStorage.setItem('user_goals', JSON.stringify(data.goals));
      }

      // Marquer l'onboarding comme terminé
      localStorage.setItem('onboarding_completed', 'true');
      
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données d\'onboarding:', error);
      throw error;
    }
  },

  isOnboardingCompleted(): boolean {
    return localStorage.getItem('onboarding_completed') === 'true';
  },

  getUserGoals(): string[] {
    const goals = localStorage.getItem('user_goals');
    return goals ? JSON.parse(goals) : [];
  },

  resetOnboarding() {
    localStorage.removeItem('onboarding_completed');
    localStorage.removeItem('user_goals');
  }
};

const User = require('../models/User');
const bcrypt = require('bcrypt');
const QuestInitializationService = require('./QuestInitializationService');

class UserService {
  // Profil par défaut pour un nouvel utilisateur
  getDefaultUserProfile() {
    return {
      level: 1,
      xp: 0,
      avatar: {
        body: 'default',
        outfit: 'casual',
        accessory: 'none',
        color: '#ff006e',
        background: 'gym'
      },
      streak: 0,
      fitness_goals: {
        daily_quests: 3,
        weekly_xp: 1000,
        target_level: 10,
        preferred_activities: ['cardio', 'strength', 'flexibility']
      },
      preferences: {
        notification_enabled: true,
        difficulty_preference: 'normal',
        quest_reminders: true,
        achievement_notifications: true
      },
      stats: {
        total_quests_completed: 0,
        total_achievements_unlocked: 0,
        best_streak: 0,
        total_xp_earned: 0
      },
      total_quests_completed: 0,
      last_quest_date: null,
      last_login: null
    };
  }

  async createUser(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      username: data.username,
      email: data.email,
      password: hashedPassword
    });

    // Assigner automatiquement des quêtes adaptées au niveau du nouvel utilisateur
    try {
      const questAssignment = await QuestInitializationService.assignQuestsToUser(user.id, user.level || 1);
      if (questAssignment.success) {
        console.log(`🎯 Quêtes assignées automatiquement au nouvel utilisateur ${data.username}`);
      }
    } catch (error) {
      console.error(`❌ Erreur lors de l'assignation de quêtes pour ${data.username}:`, error);
    }

    return user;
  }

  async createUserWithProfile(userData) {
    const { username, email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur avec seulement les champs de base
    // Les valeurs par défaut seront automatiquement appliquées par le modèle
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    // Assigner automatiquement des quêtes adaptées au niveau du nouvel utilisateur
    try {
      const questAssignment = await QuestInitializationService.assignQuestsToUser(user.id, user.level || 1);
      if (questAssignment.success) {
        console.log(`🎯 Quêtes assignées automatiquement au nouvel utilisateur ${username}`);
      } else {
        console.log(`⚠️ Échec de l'assignation de quêtes pour ${username}: ${questAssignment.message}`);
      }
    } catch (error) {
      console.error(`❌ Erreur lors de l'assignation de quêtes pour ${username}:`, error);
    }

    return user;
  }

  async getAllUsers() {
    return await User.findAll();
  }

  async getUserById(id) {
    return await User.findByPk(id);
  }

  async updateUser(id, data) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update(data);
  }

  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.destroy();
    return true;
  }

  async getUserProjects(userId) {
    const user = await User.findByPk(userId, { include: [Project] });
    return user ? user.Projects : null;
  }
}

module.exports = new UserService();

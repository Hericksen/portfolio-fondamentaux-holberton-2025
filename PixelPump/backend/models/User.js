const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false
  }, 
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
  xp: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  avatar: {
    type: DataTypes.JSON,
    defaultValue: {
      body: 'default',
      outfit: 'casual',
      accessory: 'none',
      color: '#ff006e',
      background: 'gym'
    }
  },
  streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  fitness_goals: {
    type: DataTypes.JSON,
    defaultValue: {
      daily_quests: 3,
      weekly_xp: 1000,
      target_level: 10,
      preferred_activities: ['cardio', 'strength', 'flexibility']
    }
  },
  preferences: {
    type: DataTypes.JSON,
    defaultValue: {
      notification_enabled: true,
      difficulty_preference: 'normal',
      quest_reminders: true,
      achievement_notifications: true
    }
  },
  stats: {
    type: DataTypes.JSON,
    defaultValue: {
      total_quests_completed: 0,
      total_achievements_unlocked: 0,
      best_streak: 0,
      total_xp_earned: 0
    }
  },
  total_quests_completed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  last_quest_date: {
    type: DataTypes.DATEONLY
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  last_login: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'users',
  timestamps: false
});

// Méthodes de classe pour la gamification
User.prototype.calculateLevel = function() {
  // 100 XP par niveau, difficulté progressive
  return Math.floor(Math.sqrt(this.xp / 100)) + 1;
};

User.prototype.getXpForNextLevel = function() {
  const currentLevel = this.calculateLevel();
  const nextLevelXp = Math.pow(currentLevel, 2) * 100;
  return nextLevelXp - this.xp;
};

User.prototype.addXp = async function(xpAmount) {
  const oldLevel = this.level;
  this.xp += xpAmount;
  this.level = this.calculateLevel();
  
  await this.save();
  
  // Retourne true si level up
  return this.level > oldLevel;
};

User.prototype.updateStreak = async function() {
  const today = new Date().toISOString().split('T')[0];
  const lastQuestDate = this.last_quest_date;
  
  if (!lastQuestDate) {
    this.streak = 1;
  } else {
    const daysDiff = (new Date(today) - new Date(lastQuestDate)) / (1000 * 60 * 60 * 24);
    
    if (daysDiff === 1) {
      this.streak += 1;
      // Mettre à jour le meilleur streak si nécessaire
      if (this.stats && this.streak > this.stats.best_streak) {
        this.stats.best_streak = this.streak;
      }
    } else if (daysDiff > 1) {
      this.streak = 1;
    }
    // Si daysDiff === 0, on garde le streak actuel
  }
  
  this.last_quest_date = today;
  await this.save();
};

User.prototype.updateLoginStats = async function() {
  this.last_login = new Date();
  await this.save();
  console.log(`📝 Login stats updated for user ${this.username}`);
};

User.prototype.initializeProfile = function() {
  // S'assurer que tous les champs du profil sont initialisés
  if (!this.stats) {
    this.stats = {
      total_quests_completed: 0,
      total_achievements_unlocked: 0,
      best_streak: 0,
      total_xp_earned: 0
    };
  }
  
  if (!this.preferences) {
    this.preferences = {
      notification_enabled: true,
      difficulty_preference: 'normal',
      quest_reminders: true,
      achievement_notifications: true
    };
  }
  
  if (!this.avatar.background) {
    this.avatar.background = 'gym';
  }
  
  return this;
};

module.exports = User;

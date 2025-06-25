const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Quest = sequelize.define('Quest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  type: {
    type: DataTypes.ENUM('daily', 'weekly', 'special', 'achievement'),
    defaultValue: 'daily'
  },
  category: {
    type: DataTypes.ENUM('fitness', 'health', 'social', 'skill', 'challenge'),
    defaultValue: 'fitness'
  },
  xp_reward: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard', 'epic'),
    defaultValue: 'easy'
  },
  requirements: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  is_template: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  min_level: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  max_level: {
    type: DataTypes.INTEGER
  },
  duration_minutes: {
    type: DataTypes.INTEGER
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'quests',
  timestamps: false
});

// Relations - Les quêtes sont des templates, les UserQuests sont les instances
// User.hasMany(Quest, { foreignKey: 'user_id', onDelete: 'CASCADE' });
// Quest.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Quest;

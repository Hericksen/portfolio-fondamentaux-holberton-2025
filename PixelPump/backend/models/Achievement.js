const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Achievement = sequelize.define('Achievement', {
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
  condition: {
    type: DataTypes.TEXT
  },
  condition_type: {
    type: DataTypes.ENUM('quest_count', 'streak', 'xp_total', 'level', 'specific_quest', 'login_days'),
    allowNull: false
  },
  condition_value: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING
  },
  rarity: {
    type: DataTypes.ENUM('common', 'rare', 'epic', 'legendary'),
    defaultValue: 'common'
  },
  xp_reward: {
    type: DataTypes.INTEGER,
    defaultValue: 50
  },
  is_hidden: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
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
  tableName: 'achievements',
  timestamps: false
});

// Relations - Les achievements sont des templates, les UserAchievements sont les unlocks
// User.hasMany(Achievement, { foreignKey: 'user_id', onDelete: 'CASCADE' });
// Achievement.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Achievement;

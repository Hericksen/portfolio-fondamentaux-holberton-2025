const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Achievement = require('./Achievement');

const UserAchievement = sequelize.define('UserAchievement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  achievement_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'achievements',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  unlocked_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  progress: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  tableName: 'user_achievements',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'achievement_id']
    }
  ]
});

module.exports = UserAchievement;

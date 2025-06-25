const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Quest = require('./Quest');

const UserQuest = sequelize.define('UserQuest', {
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
  quest_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'quests',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  is_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  completed_at: {
    type: DataTypes.DATE
  },
  progress: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  assigned_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'user_quests',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'quest_id']
    }
  ]
});

module.exports = UserQuest;

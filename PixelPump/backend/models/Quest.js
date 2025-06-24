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
    type: DataTypes.STRING(50)
  },
  xp_reward: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  due_date: {
    type: DataTypes.DATE
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
  is_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'quests',
  timestamps: false
});

// Relations
User.hasMany(Quest, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Quest.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Quest;

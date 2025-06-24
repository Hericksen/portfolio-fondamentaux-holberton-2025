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
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  unlocked_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'achievements',
  timestamps: false
});

// Relations
User.hasMany(Achievement, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Achievement.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Achievement;

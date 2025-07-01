const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Modèle pour les cycles de quêtes (journalier, hebdomadaire, mensuel)
const QuestCycle = sequelize.define('QuestCycle', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  type: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false
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
  tableName: 'quest_cycles',
  timestamps: false,
  indexes: [
    {
      fields: ['type', 'start_date', 'end_date']
    },
    {
      fields: ['is_active']
    }
  ]
});

module.exports = QuestCycle;

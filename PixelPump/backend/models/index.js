const User = require('./User');
const Project = require('./Project');
const Quest = require('./Quest');
const Achievement = require('./Achievement');
const UserQuest = require('./UserQuest');
const UserAchievement = require('./UserAchievement');

// Relations User - Project (gardées pour compatibilité)
User.hasMany(Project, {
  foreignKey: 'userId',
  as: 'projects'
});

Project.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Relations Many-to-Many entre Users et Quests via UserQuest
User.belongsToMany(Quest, { 
  through: UserQuest, 
  foreignKey: 'user_id',
  otherKey: 'quest_id',
  as: 'assignedQuests'
});

Quest.belongsToMany(User, { 
  through: UserQuest, 
  foreignKey: 'quest_id',
  otherKey: 'user_id',
  as: 'assignedUsers'
});

// Relations Many-to-Many entre Users et Achievements via UserAchievement
User.belongsToMany(Achievement, { 
  through: UserAchievement, 
  foreignKey: 'user_id',
  otherKey: 'achievement_id',
  as: 'unlockedAchievements'
});

Achievement.belongsToMany(User, { 
  through: UserAchievement, 
  foreignKey: 'achievement_id',
  otherKey: 'user_id',
  as: 'achievedByUsers'
});

// Relations directes avec les tables de liaison
User.hasMany(UserQuest, { foreignKey: 'user_id', onDelete: 'CASCADE' });
UserQuest.belongsTo(User, { foreignKey: 'user_id' });

Quest.hasMany(UserQuest, { foreignKey: 'quest_id', onDelete: 'CASCADE' });
UserQuest.belongsTo(Quest, { foreignKey: 'quest_id' });

User.hasMany(UserAchievement, { foreignKey: 'user_id', onDelete: 'CASCADE' });
UserAchievement.belongsTo(User, { foreignKey: 'user_id' });

Achievement.hasMany(UserAchievement, { foreignKey: 'achievement_id', onDelete: 'CASCADE' });
UserAchievement.belongsTo(Achievement, { foreignKey: 'achievement_id' });

module.exports = {
  User,
  Project,
  Quest,
  Achievement,
  UserQuest,
  UserAchievement
};

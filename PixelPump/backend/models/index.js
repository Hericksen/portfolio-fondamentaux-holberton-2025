const User = require('./User');
const Project = require('./Project');
const Quest = require('./Quest');
const Achievement = require('./Achievement');

// Relations User - Project
User.hasMany(Project, {
  foreignKey: 'userId',
  as: 'projects'
});

Project.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Relations User - Quest (many-to-many pour les quêtes assignées)
User.belongsToMany(Quest, {
  through: 'UserQuests',
  foreignKey: 'userId',
  as: 'quests'
});

Quest.belongsToMany(User, {
  through: 'UserQuests',
  foreignKey: 'questId',
  as: 'users'
});

// Relations User - Achievement (many-to-many pour les succès débloqués)
User.belongsToMany(Achievement, {
  through: 'UserAchievements',
  foreignKey: 'userId',
  as: 'achievements'
});

Achievement.belongsToMany(User, {
  through: 'UserAchievements',
  foreignKey: 'achievementId',
  as: 'users'
});

module.exports = {
  User,
  Project,
  Quest,
  Achievement
};

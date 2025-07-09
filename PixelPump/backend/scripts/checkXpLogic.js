const { Achievement, Quest } = require('../models');

async function checkXpLogic() {
  try {
    console.log('🔍 Vérification de la logique d\'XP...\n');

    // Récupérer les achievements qui se déclenchent facilement
    const achievements = await Achievement.findAll({
      where: { is_active: true },
      order: [['condition_value', 'ASC']]
    });
    
    console.log('=== ACHIEVEMENTS QUI PEUVENT SE DECLENCHER ===');
    achievements.forEach(a => {
      if (a.condition_type === 'quest_count' && a.condition_value <= 5) {
        console.log(`${a.title}:`);
        console.log(`  Condition: ${a.condition_type} >= ${a.condition_value}`);
        console.log(`  XP Récompense: ${a.xp_reward}`);
        console.log(`  Description: ${a.description}`);
        console.log('---');
      }
    });
    
    // Récupérer quelques quêtes avec leur XP
    const quests = await Quest.findAll({
      where: { is_template: true, is_active: true },
      order: [['xp_reward', 'ASC']],
      limit: 5
    });
    
    console.log('\n=== QUETES ET LEUR XP ===');
    quests.forEach(q => {
      console.log(`${q.title}: ${q.xp_reward} XP (${q.type}, ${q.difficulty})`);
    });
    
    console.log('\n=== SIMULATION PREMIERE QUETE ===');
    const firstQuest = quests[0];
    const firstQuestAchievement = achievements.find(a => a.condition_type === 'quest_count' && a.condition_value === 1);
    
    if (firstQuest && firstQuestAchievement) {
      console.log(`Quête: ${firstQuest.title} = ${firstQuest.xp_reward} XP`);
      console.log(`Achievement: ${firstQuestAchievement.title} = ${firstQuestAchievement.xp_reward} XP`);
      console.log(`TOTAL: ${firstQuest.xp_reward + firstQuestAchievement.xp_reward} XP`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

checkXpLogic();

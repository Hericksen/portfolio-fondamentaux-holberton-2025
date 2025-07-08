const { User, UserQuest, Quest } = require('./models');
const GamificationService = require('./services/GamificationService');

async function testXpSystem() {
  try {
    console.log('🔄 Test du système d\'XP - Direct DB...');
    
    // 1. Trouver l'utilisateur admin
    const admin = await User.findOne({ where: { email: 'admin@pixelpump.com' } });
    if (!admin) {
      console.error('❌ Utilisateur admin non trouvé');
      return;
    }
    
    console.log('✅ Utilisateur admin trouvé:', admin.username);
    console.log('📊 Données AVANT:', {
      level: admin.level,
      xp: admin.xp,
      total_quests_completed: admin.total_quests_completed,
      streak: admin.streak
    });
    
    // 2. Trouver une quête incomplète
    const userQuest = await UserQuest.findOne({
      where: { 
        user_id: admin.id, 
        is_completed: false,
        is_expired: false
      },
      include: [{ model: Quest }]
    });
    
    if (!userQuest) {
      console.error('❌ Aucune quête incomplète trouvée');
      return;
    }
    
    console.log('📋 Quête à compléter:', userQuest.Quest.title, 'XP:', userQuest.Quest.xp_reward);
    
    // 3. Compléter la quête
    console.log('🎯 Complétion de la quête...');
    const result = await GamificationService.completeQuest(admin.id, userQuest.quest_id);
    
    console.log('✅ Résultat complétion:', result);
    
    // 4. Récupérer les données après
    await admin.reload();
    console.log('📊 Données APRÈS:', {
      level: admin.level,
      xp: admin.xp,
      total_quests_completed: admin.total_quests_completed,
      streak: admin.streak
    });
    
    // 5. Vérifier les données dans la base
    const userInDb = await User.findByPk(admin.id);
    console.log('💾 Données DB:', {
      level: userInDb.level,
      xp: userInDb.xp,
      total_quests_completed: userInDb.total_quests_completed,
      streak: userInDb.streak
    });
    
    // 6. Vérifier la quête complétée
    const completedQuest = await UserQuest.findOne({
      where: { 
        user_id: admin.id, 
        quest_id: userQuest.quest_id 
      }
    });
    
    console.log('📋 Quête complétée:', {
      is_completed: completedQuest.is_completed,
      completed_at: completedQuest.completed_at
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testXpSystem();

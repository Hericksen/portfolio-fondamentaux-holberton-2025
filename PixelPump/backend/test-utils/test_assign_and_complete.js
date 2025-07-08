const { User, UserQuest, Quest } = require('./models');
const GamificationService = require('./services/GamificationService');

async function assignQuestAndTest() {
  try {
    console.log('🔄 Assignation d\'une quête pour tester l\'XP...');
    
    // 1. Trouver l'utilisateur admin
    const admin = await User.findOne({ where: { email: 'admin@pixelpump.com' } });
    if (!admin) {
      console.error('❌ Utilisateur admin non trouvé');
      return;
    }
    
    console.log('✅ Utilisateur admin trouvé:', admin.username);
    
    // 2. Trouver une quête template active
    const quest = await Quest.findOne({ 
      where: { 
        is_template: true, 
        is_active: true 
      } 
    });
    
    if (!quest) {
      console.error('❌ Aucune quête template trouvée');
      return;
    }
    
    console.log('📋 Quête trouvée:', quest.title, 'XP:', quest.xp_reward);
    
    // 3. Vérifier si la quête est déjà assignée
    const existingQuest = await UserQuest.findOne({
      where: { 
        user_id: admin.id, 
        quest_id: quest.id, 
        is_completed: false 
      }
    });
    
    if (existingQuest) {
      console.log('ℹ️ Quête déjà assignée, utilisation de la quête existante');
      const result = await GamificationService.completeQuest(admin.id, quest.id);
      console.log('✅ Résultat complétion:', result);
      return;
    }
    
    // 3. Assigner la quête avec un cycle_id unique
    const userQuest = await UserQuest.create({
      user_id: admin.id,
      quest_id: quest.id,
      cycle_id: null, // Explicitement null pour éviter la contrainte unique
      is_completed: false,
      assigned_at: new Date()
    });
    
    console.log('✅ Quête assignée');
    
    // 4. Données avant complétion
    console.log('📊 Données AVANT:', {
      level: admin.level,
      xp: admin.xp,
      total_quests_completed: admin.total_quests_completed,
      streak: admin.streak
    });
    
    // 5. Compléter la quête
    console.log('🎯 Complétion de la quête...');
    const result = await GamificationService.completeQuest(admin.id, quest.id);
    
    console.log('✅ Résultat complétion:', result);
    
    // 6. Recharger les données
    await admin.reload();
    console.log('📊 Données APRÈS:', {
      level: admin.level,
      xp: admin.xp,
      total_quests_completed: admin.total_quests_completed,
      streak: admin.streak
    });
    
    // 7. Vérifier la quête
    const completedQuest = await UserQuest.findByPk(userQuest.id);
    console.log('📋 Quête complétée:', {
      is_completed: completedQuest.is_completed,
      completed_at: completedQuest.completed_at
    });
    
    // 8. Tester via le dashboard
    console.log('🎯 Test via GamificationService.getUserProgress...');
    const progress = await GamificationService.getUserProgress(admin.id);
    console.log('📊 Progress user:', {
      level: progress.user.level,
      xp: progress.user.xp,
      total_quests_completed: progress.user.total_quests_completed,
      streak: progress.user.streak
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error(error.stack);
  }
}

assignQuestAndTest();

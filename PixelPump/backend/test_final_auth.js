// Test final avec vraie connexion
const axios = require('axios');

const baseURL = 'http://localhost:3001';

async function testXpWithRealAuth() {
  console.log('🔄 Test final avec vraie authentification...');
  
  try {
    // 1. Connexion
    const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
      email: 'admin@pixelpump.com',
      password: 'admin123'
    });
    
    console.log('✅ Connexion réussie');
    const token = loginResponse.data.token;
    
    // 2. Dashboard AVANT
    const dashboardBefore = await axios.get(`${baseURL}/api/users/dashboard/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('📊 Dashboard AVANT:', {
      level: dashboardBefore.data.data.user.level,
      xp: dashboardBefore.data.data.user.xp,
      total_quests_completed: dashboardBefore.data.data.user.total_quests_completed
    });
    
    // 3. Achievements
    const achievementsResponse = await axios.get(`${baseURL}/api/achievements/user`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('🏆 Achievements:', achievementsResponse.data.data.length, 'trouvés');
    
    // 4. Quests
    const questsResponse = await axios.get(`${baseURL}/api/quests/user`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const incompleteQuests = questsResponse.data.data.filter(q => !q.is_completed);
    console.log('📋 Quêtes incomplètes:', incompleteQuests.length);
    
    if (incompleteQuests.length > 0) {
      const quest = incompleteQuests[0];
      console.log(`🎯 Complétion: ${quest.Quest.title} (${quest.Quest.xp_reward} XP)`);
      
      // 5. Compléter la quête
      const completeResponse = await axios.put(`${baseURL}/api/quests/${quest.quest_id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Complétion réussie:', completeResponse.data.message);
      console.log('📈 XP gagné:', completeResponse.data.data.xpGained);
      
      // 6. Dashboard APRÈS
      const dashboardAfter = await axios.get(`${baseURL}/api/users/dashboard/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('📊 Dashboard APRÈS:', {
        level: dashboardAfter.data.data.user.level,
        xp: dashboardAfter.data.data.user.xp,
        total_quests_completed: dashboardAfter.data.data.user.total_quests_completed
      });
      
      // 7. Comparaison
      const xpDiff = dashboardAfter.data.data.user.xp - dashboardBefore.data.data.user.xp;
      const questsDiff = dashboardAfter.data.data.user.total_quests_completed - dashboardBefore.data.data.user.total_quests_completed;
      
      console.log('\n🎉 RÉSULTAT FINAL:');
      console.log(`✅ XP gagné: +${xpDiff}`);
      console.log(`✅ Quêtes complétées: +${questsDiff}`);
      console.log(`✅ Système d'XP: ${xpDiff > 0 ? 'FONCTIONNE PARFAITEMENT' : 'PROBLÈME'}`);
      
    } else {
      console.log('ℹ️ Aucune quête incomplète pour tester');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

testXpWithRealAuth();

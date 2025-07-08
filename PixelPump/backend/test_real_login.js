const axios = require('axios');

const baseURL = 'http://localhost:3001';

async function testWithRealLogin() {
  try {
    console.log('🔄 Test avec vraie connexion...');
    
    // 1. Connexion
    const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
      email: 'admin@pixelpump.com',
      password: 'admin123'
    });
    
    console.log('✅ Connexion réussie');
    const token = loginResponse.data.token;
    
    // 2. Test dashboard
    const dashboardResponse = await axios.get(`${baseURL}/api/users/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('📊 Dashboard data:', {
      username: dashboardResponse.data.data.user.username,
      level: dashboardResponse.data.data.user.level,
      xp: dashboardResponse.data.data.user.xp,
      total_quests_completed: dashboardResponse.data.data.user.total_quests_completed,
      streak: dashboardResponse.data.data.user.streak
    });
    
    // 3. Test progress
    try {
      const progressResponse = await axios.get(`${baseURL}/api/users/progress`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('📊 Progress data:', {
        level: progressResponse.data.data.user.level,
        xp: progressResponse.data.data.user.xp,
        total_quests_completed: progressResponse.data.data.user.total_quests_completed,
        streak: progressResponse.data.data.user.streak
      });
    } catch (progressError) {
      console.log('ℹ️ Progress endpoint:', progressError.response?.status, progressError.response?.data?.message);
    }
    
    // 4. Test quests
    const questsResponse = await axios.get(`${baseURL}/api/quests/user`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const incompleteQuests = questsResponse.data.data.filter(q => !q.is_completed);
    console.log(`📋 ${incompleteQuests.length} quêtes incomplètes trouvées`);
    
    if (incompleteQuests.length > 0) {
      // 5. Compléter une quête
      const quest = incompleteQuests[0];
      console.log(`🎯 Complétion de: ${quest.Quest.title} (${quest.Quest.xp_reward} XP)`);
      
      const completeResponse = await axios.put(`${baseURL}/api/quests/${quest.quest_id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Complétion:', completeResponse.data);
      
      // 6. Re-test dashboard après complétion
      const dashboardAfter = await axios.get(`${baseURL}/api/users/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('📊 Dashboard APRÈS complétion:', {
        level: dashboardAfter.data.data.user.level,
        xp: dashboardAfter.data.data.user.xp,
        total_quests_completed: dashboardAfter.data.data.user.total_quests_completed,
        streak: dashboardAfter.data.data.user.streak
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

testWithRealLogin();

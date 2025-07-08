// Test final du système d'XP avec l'API
const axios = require('axios');

const baseURL = 'http://localhost:3001';

async function testXpWithApi() {
  console.log('🔄 Test final du système d\'XP avec l\'API...');
  
  try {
    // 1. Générer un token valide
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'pixelpump_secret_key_2025';
    
    const token = jwt.sign(
      { 
        userId: 'aa0d6ed2-127c-479f-9249-32f5d746490a',
        email: 'admin@pixelpump.com',
        role: 'admin'
      }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );
    
    console.log('✅ Token généré');
    
    // 2. Tester l'endpoint dashboard AVANT
    const dashboardBefore = await axios.get(`${baseURL}/api/users/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('📊 Dashboard AVANT:', {
      level: dashboardBefore.data.data.user.level,
      xp: dashboardBefore.data.data.user.xp,
      total_quests_completed: dashboardBefore.data.data.user.total_quests_completed
    });
    
    // 3. Tester l'endpoint achievements
    const achievementsResponse = await axios.get(`${baseURL}/api/achievements/user`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('🏆 Achievements:', achievementsResponse.data.data.length, 'trouvés');
    
    // 4. Tester l'endpoint quests
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
      
      // 6. Tester l'endpoint dashboard APRÈS
      const dashboardAfter = await axios.get(`${baseURL}/api/users/dashboard`, {
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
      
      console.log('\n🎉 RÉSULTAT:');
      console.log(`✅ XP gagné: +${xpDiff}`);
      console.log(`✅ Quêtes complétées: +${questsDiff}`);
      console.log(`✅ Système d'XP: ${xpDiff > 0 ? 'FONCTIONNE' : 'PROBLÈME'}`);
      
    } else {
      console.log('ℹ️ Aucune quête incomplète pour tester');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

testXpWithApi();

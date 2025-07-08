const axios = require('axios');

const baseURL = 'http://localhost:3001';

async function testXpSystem() {
  try {
    console.log('🔄 Test du système d\'XP...');
    
    // 1. Connexion
    console.log('1. Connexion...');
    const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
      email: 'admin@pixelpump.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Connexion réussie');
    
    // 2. Récupérer les données dashboard AVANT
    console.log('2. Dashboard AVANT complétion...');
    const dashboardBefore = await axios.get(`${baseURL}/api/users/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('📊 Données AVANT:', {
      username: dashboardBefore.data.data.user.username,
      level: dashboardBefore.data.data.user.level,
      xp: dashboardBefore.data.data.user.xp,
      total_quests_completed: dashboardBefore.data.data.user.total_quests_completed,
      streak: dashboardBefore.data.data.user.streak
    });
    
    // 3. Récupérer les quêtes utilisateur
    console.log('3. Récupération des quêtes...');
    const questsResponse = await axios.get(`${baseURL}/api/quests/user`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const incompleteQuests = questsResponse.data.data.filter(q => !q.is_completed);
    console.log(`📋 ${incompleteQuests.length} quêtes incomplètes trouvées`);
    
    if (incompleteQuests.length === 0) {
      console.log('❌ Aucune quête incomplète trouvée');
      return;
    }
    
    // 4. Compléter une quête
    const questToComplete = incompleteQuests[0];
    console.log(`4. Complétion de la quête: ${questToComplete.Quest.title}`);
    
    const completeResponse = await axios.put(`${baseURL}/api/quests/${questToComplete.quest_id}/complete`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Réponse complétion:', completeResponse.data);
    
    // 5. Récupérer les données dashboard APRÈS
    console.log('5. Dashboard APRÈS complétion...');
    const dashboardAfter = await axios.get(`${baseURL}/api/users/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('📊 Données APRÈS:', {
      username: dashboardAfter.data.data.user.username,
      level: dashboardAfter.data.data.user.level,
      xp: dashboardAfter.data.data.user.xp,
      total_quests_completed: dashboardAfter.data.data.user.total_quests_completed,
      streak: dashboardAfter.data.data.user.streak
    });
    
    // 6. Comparaison
    console.log('\n📈 COMPARAISON:');
    console.log(`XP: ${dashboardBefore.data.data.user.xp} → ${dashboardAfter.data.data.user.xp} (${dashboardAfter.data.data.user.xp - dashboardBefore.data.data.user.xp})`);
    console.log(`Niveau: ${dashboardBefore.data.data.user.level} → ${dashboardAfter.data.data.user.level}`);
    console.log(`Quêtes complétées: ${dashboardBefore.data.data.user.total_quests_completed} → ${dashboardAfter.data.data.user.total_quests_completed}`);
    console.log(`Streak: ${dashboardBefore.data.data.user.streak} → ${dashboardAfter.data.data.user.streak}`);
    
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

testXpSystem();

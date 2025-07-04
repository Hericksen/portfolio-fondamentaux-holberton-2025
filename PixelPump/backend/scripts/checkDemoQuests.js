const axios = require('axios');

// Configuration
const API_BASE = 'http://localhost:3001/api';

async function checkDemoQuests() {
  try {
    console.log('🔍 Vérification des quêtes assignées aux comptes démo...\n');

    // Connexion utilisateur démo et récupération du token
    console.log('1️⃣ Connexion utilisateur démo');
    const userDemoResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });

    if (userDemoResponse.data.success) {
      const userToken = userDemoResponse.data.token;
      const userId = userDemoResponse.data.user.id;
      
      console.log(`✅ Connecté: ${userDemoResponse.data.user.username}`);
      
      // Récupérer les quêtes de l'utilisateur
      const userQuestsResponse = await axios.get(`${API_BASE}/quests/user/${userId}`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      
      console.log(`📋 Quêtes actives: ${userQuestsResponse.data.length}`);
      userQuestsResponse.data.forEach((quest, index) => {
        console.log(`   ${index + 1}. ${quest.title} (${quest.type}) - ${quest.xpReward} XP`);
        console.log(`      Status: ${quest.UserQuest?.status || 'N/A'}`);
      });
    }

    // Connexion admin démo et récupération du token
    console.log('\n2️⃣ Connexion admin démo');
    const adminDemoResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@pixelpump.com',
      password: 'admin123'
    });

    if (adminDemoResponse.data.success) {
      const adminToken = adminDemoResponse.data.token;
      const adminId = adminDemoResponse.data.user.id;
      
      console.log(`✅ Connecté: ${adminDemoResponse.data.user.username}`);
      
      // Récupérer les quêtes de l'admin
      const adminQuestsResponse = await axios.get(`${API_BASE}/quests/user/${adminId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      console.log(`📋 Quêtes actives: ${adminQuestsResponse.data.length}`);
      adminQuestsResponse.data.forEach((quest, index) => {
        console.log(`   ${index + 1}. ${quest.title} (${quest.type}) - ${quest.xpReward} XP`);
        console.log(`      Status: ${quest.UserQuest?.status || 'N/A'}`);
      });
    }

    console.log('\n🎯 Vérification terminée !');

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
    if (error.response) {
      console.error('   Réponse serveur:', error.response.data);
    }
  }
}

// Exécuter la vérification
checkDemoQuests();

const axios = require('axios');

const baseURL = 'http://localhost:3001';

async function testApiAfterXp() {
  try {
    console.log('🔄 Test API après gain d\'XP...');
    
    // Test direct avec l'API
    const response = await axios.get(`${baseURL}/health`);
    console.log('✅ Serveur accessible:', response.data.status);
    
    // Test avec token - on va créer un token directement
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'pixelpump_secret_key_2025';
    
    const token = jwt.sign(
      { 
        userId: 'aa0d6ed2-127c-479f-9249-32f5d746490a', // ID admin correct
        email: 'admin@pixelpump.com',
        role: 'admin'
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    console.log('🔑 Token généré');
    
    // Test dashboard
    const dashboardResponse = await axios.get(`${baseURL}/api/users/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('📊 Dashboard user:', {
      username: dashboardResponse.data.data.user.username,
      level: dashboardResponse.data.data.user.level,
      xp: dashboardResponse.data.data.user.xp,
      total_quests_completed: dashboardResponse.data.data.user.total_quests_completed,
      streak: dashboardResponse.data.data.user.streak
    });
    
    // Test user progress
    const progressResponse = await axios.get(`${baseURL}/api/users/progress`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('📊 Progress user:', {
      level: progressResponse.data.data.user.level,
      xp: progressResponse.data.data.user.xp,
      total_quests_completed: progressResponse.data.data.user.total_quests_completed,
      streak: progressResponse.data.data.user.streak
    });
    
  } catch (error) {
    console.error('❌ Erreur API:', error.response?.data || error.message);
  }
}

testApiAfterXp();

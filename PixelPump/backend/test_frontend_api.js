// Test final de l'API frontend avec toutes les corrections
const axios = require('axios');

const baseURL = 'http://localhost:3001';

async function testFrontendApi() {
  console.log('🔄 Test final de l\'API frontend...');
  
  try {
    // 1. Connexion
    const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
      email: 'admin@pixelpump.com',
      password: 'admin123'
    });
    
    console.log('✅ Connexion réussie');
    const token = loginResponse.data.token;
    
    // 2. Test dashboard avec nouvelle route
    const dashboardResponse = await axios.get(`${baseURL}/api/users/dashboard/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Dashboard accessible:', {
      success: dashboardResponse.data.success,
      username: dashboardResponse.data.data.user.username,
      level: dashboardResponse.data.data.user.level,
      xp: dashboardResponse.data.data.user.xp
    });
    
    // 3. Test achievements
    const achievementsResponse = await axios.get(`${baseURL}/api/achievements/user`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Achievements accessible:', {
      success: achievementsResponse.data.success,
      count: achievementsResponse.data.data.length
    });
    
    // 4. Test quests
    const questsResponse = await axios.get(`${baseURL}/api/quests/user`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Quests accessible:', {
      success: questsResponse.data.success,
      count: questsResponse.data.data.length
    });
    
    console.log('\n🎉 TOUS LES ENDPOINTS FONCTIONNENT CORRECTEMENT !');
    console.log('✅ Le frontend peut maintenant communiquer avec le backend');
    console.log('✅ Le système d\'XP devrait fonctionner parfaitement');
    
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

testFrontendApi();

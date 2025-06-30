// Test de connectivité backend/frontend
const axios = require('axios');

async function testConnection() {
  console.log('🔄 Test de connectivité Backend/Frontend...\n');
  
  try {
    // Test 1: Backend health
    console.log('1. Test Backend Health:');
    const healthResponse = await axios.get('http://localhost:3001/health');
    console.log('✅ Backend OK:', healthResponse.data);
  } catch (error) {
    console.log('❌ Backend KO:', error.message);
    return;
  }
  
  try {
    // Test 2: Créer un utilisateur
    console.log('\n2. Test Création utilisateur:');
    const createUser = await axios.post('http://localhost:3001/api/users', {
      username: 'testjs',
      email: 'testjs@example.com',
      password: 'password123'
    });
    console.log('✅ Utilisateur créé:', createUser.data.data.id);
  } catch (error) {
    console.log('⚠️ Utilisateur existe déjà ou autre erreur:', error.response?.data?.message);
  }
  
  try {
    // Test 3: Login
    console.log('\n3. Test Login:');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'testjs@example.com',
      password: 'password123'
    });
    console.log('✅ Login OK, Token obtenu');
    
    const token = loginResponse.data.token;
    
    // Test 4: Dashboard
    console.log('\n4. Test Dashboard:');
    const dashboardResponse = await axios.get('http://localhost:3001/api/users/dashboard/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Dashboard OK:', {
      username: dashboardResponse.data.data.user.username,
      level: dashboardResponse.data.data.user.level,
      xp: dashboardResponse.data.data.user.xp
    });
    
  } catch (error) {
    console.log('❌ Erreur:', error.response?.data || error.message);
  }
}

testConnection();

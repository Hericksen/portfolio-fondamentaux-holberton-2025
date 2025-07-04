const axios = require('axios');

// Configuration
const API_BASE = 'http://localhost:3001/api';

async function debugQuests() {
  try {
    // Connexion utilisateur démo
    const userDemoResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });

    if (userDemoResponse.data.success) {
      const userToken = userDemoResponse.data.token;
      const userId = userDemoResponse.data.user.id;
      
      console.log('User ID:', userId);
      console.log('Token:', userToken ? 'OK' : 'MISSING');
      
      // Test de la route quests
      try {
        const userQuestsResponse = await axios.get(`${API_BASE}/quests/user/${userId}`, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        
        console.log('Response status:', userQuestsResponse.status);
        console.log('Response data type:', typeof userQuestsResponse.data);
        console.log('Response data:', JSON.stringify(userQuestsResponse.data, null, 2));
        
      } catch (questError) {
        console.error('Quest error:', questError.response?.status);
        console.error('Quest error data:', questError.response?.data);
      }
    }

  } catch (error) {
    console.error('Main error:', error.message);
  }
}

debugQuests();

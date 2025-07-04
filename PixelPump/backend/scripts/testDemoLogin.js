const axios = require('axios');

// Configuration
const API_BASE = 'http://localhost:3001/api';

async function testDemoLogin() {
  try {
    console.log('🧪 Test de connexion des comptes démo...\n');

    // Test connexion user-demo
    console.log('1️⃣ Test connexion utilisateur démo');
    const userDemoResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });

    if (userDemoResponse.data.success) {
      console.log('✅ Connexion utilisateur démo réussie');
      console.log(`   User ID: ${userDemoResponse.data.user.id}`);
      console.log(`   Username: ${userDemoResponse.data.user.username}`);
    }

    // Test connexion admin-demo
    console.log('\n2️⃣ Test connexion admin démo');
    const adminDemoResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@pixelpump.com',
      password: 'admin123'
    });

    if (adminDemoResponse.data.success) {
      console.log('✅ Connexion admin-demo réussie');
      console.log(`   User ID: ${adminDemoResponse.data.user.id}`);
      console.log(`   Username: ${adminDemoResponse.data.user.username}`);
      console.log(`   Role: ${adminDemoResponse.data.user.role}`);
    }

    console.log('\n🎯 Les quêtes aléatoires devraient avoir été assignées automatiquement!');
    console.log('📊 Vérifiez les logs du backend pour voir les détails.');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    if (error.response) {
      console.error('   Réponse serveur:', error.response.data);
    }
  }
}

// Attendre que le serveur soit prêt puis exécuter le test
setTimeout(() => {
  testDemoLogin();
}, 3000);

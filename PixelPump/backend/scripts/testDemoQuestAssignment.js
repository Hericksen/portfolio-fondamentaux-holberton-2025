const DemoQuestService = require('../services/DemoQuestService');

async function testAssignment() {
  try {
    console.log('🧪 Test direct de l\'assignation de quêtes démo...');
    
    // Test avec l'utilisateur démo
    const userId = '280cd57d-7a74-44f4-a45d-021129574a38'; // ID from our previous test
    const userEmail = 'test@example.com';
    
    console.log(`📝 Test avec userId: ${userId}, email: ${userEmail}`);
    
    const result = await DemoQuestService.assignRandomQuestsForDemo(userId, userEmail);
    
    console.log('✅ Résultat:', result);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('Stack:', error.stack);
  }
}

testAssignment();

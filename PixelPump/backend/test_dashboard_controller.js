// Test simple de l'API sans dépendances externes
const { User } = require('./models');
const UserController = require('./controllers/UserController');

async function testDashboardController() {
  console.log('🔄 Test direct du contrôleur Dashboard...');
  
  try {
    // Simuler une requête
    const admin = await User.findOne({ where: { email: 'admin@pixelpump.com' } });
    
    const mockReq = {
      user: { userId: admin.id }
    };
    
    const mockRes = {
      json: (data) => {
        console.log('📊 Réponse Dashboard:', {
          success: data.success,
          user: {
            username: data.data.user.username,
            level: data.data.user.level,
            xp: data.data.user.xp,
            total_quests_completed: data.data.user.total_quests_completed,
            streak: data.data.user.streak
          }
        });
      },
      status: (code) => ({ json: (data) => console.log(`❌ Erreur ${code}:`, data) })
    };
    
    // Appeler le contrôleur directement
    await UserController.getDashboard(mockReq, mockRes);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testDashboardController();

// Configuration des tests Jest
const path = require('path');

// Configuration de l'environnement de test
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_key';
process.env.ADMIN_SECRET = 'test_admin_secret';

// Timeout pour les tests
jest.setTimeout(10000);

// Nettoyage après chaque test
afterEach(() => {
  jest.clearAllMocks();
});

console.log('📝 Configuration Jest chargée pour les tests PixelPump');

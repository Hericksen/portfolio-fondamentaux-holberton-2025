#!/usr/bin/env node

const { Quest } = require('../models');
const sequelize = require('../config/db');

async function resetQuests() {
  try {
    console.log('🧹 Suppression de toutes les quêtes existantes...');
    
    // Supprimer toutes les quêtes
    await Quest.destroy({ 
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true
    });
    
    console.log('✅ Toutes les quêtes ont été supprimées avec succès!');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur lors de la suppression des quêtes:', error);
    return { success: false, error: error.message };
  }
}

// Exécuter la fonction si le script est appelé directement
if (require.main === module) {
  resetQuests()
    .then(result => {
      if (result.success) {
        console.log('🎯 Base de données nettoyée et prête pour de nouvelles quêtes!');
      }
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Erreur fatale:', err);
      process.exit(1);
    });
} else {
  // Exporter pour utilisation dans d'autres scripts
  module.exports = resetQuests;
}

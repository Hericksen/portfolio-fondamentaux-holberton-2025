#!/usr/bin/env node

/**
 * Script de maintenance pour PixelPump
 * - Nettoyage des données obsolètes
 * - Optimisation de la base de données
 * - Vérification de l'intégrité des données
 */

const { sequelize } = require('../models');
const fs = require('fs');
const path = require('path');

async function runMaintenance() {
  console.log('🧹 Démarrage de la maintenance PixelPump...');
  
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données');

    // Lire et exécuter le script de nettoyage
    const cleanupScript = fs.readFileSync(
      path.join(__dirname, '../database/cleanup.sql'), 
      'utf8'
    );
    
    const queries = cleanupScript
      .split(';')
      .filter(query => query.trim() && !query.trim().startsWith('--'))
      .map(query => query.trim());

    for (const query of queries) {
      if (query) {
        console.log(`🔄 Exécution: ${query.substring(0, 50)}...`);
        await sequelize.query(query);
      }
    }

    // Statistiques de maintenance
    const [userCount] = await sequelize.query('SELECT COUNT(*) as count FROM "Users"');
    const [questCount] = await sequelize.query('SELECT COUNT(*) as count FROM "Quests"');
    const [activeQuestCount] = await sequelize.query('SELECT COUNT(*) as count FROM "UserQuests" WHERE "completed_at" IS NULL');
    
    console.log('\n📊 Statistiques après maintenance:');
    console.log(`👥 Utilisateurs: ${userCount[0].count}`);
    console.log(`⚔️  Quêtes totales: ${questCount[0].count}`);
    console.log(`🎯 Quêtes actives: ${activeQuestCount[0].count}`);
    
    console.log('\n✅ Maintenance terminée avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors de la maintenance:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Exécuter la maintenance si appelé directement
if (require.main === module) {
  runMaintenance();
}

module.exports = { runMaintenance };

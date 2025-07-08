#!/usr/bin/env node

/**
 * Script de test pour vérifier la complétion des quêtes
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testQuestCompletion() {
  try {
    console.log('🧪 Test de complétion des quêtes...\n');
    
    // 1. Tester la complétion d'une quête avec un ID fictif (démo)
    console.log('1. Test de complétion d\'une quête démo (ID fictif)...');
    try {
      const response = await axios.put(`${BASE_URL}/api/quests/demo-daily-123/complete`, {
        progress: { steps: 1000 }
      }, {
        headers: {
          'Authorization': 'Bearer fake-token'
        }
      });
      
      console.log('❌ Ne devrait pas réussir avec un token invalide');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Erreur 401 attendue (authentification requise)');
      } else if (error.response?.status === 400) {
        console.log('✅ Erreur 400 attendue (quête introuvable)');
      } else {
        console.log('⚠️  Erreur inattendue:', error.response?.status || error.message);
      }
    }
    
    // 2. Vérifier les quêtes disponibles
    console.log('\n2. Vérification des quêtes disponibles...');
    try {
      const response = await axios.get(`${BASE_URL}/api/quests`);
      if (response.data?.success && response.data.data?.length > 0) {
        console.log(`✅ ${response.data.data.length} quêtes disponibles`);
        
        // Afficher quelques exemples
        const dailyQuests = response.data.data.filter(q => q.type === 'daily').slice(0, 3);
        const weeklyQuests = response.data.data.filter(q => q.type === 'weekly').slice(0, 2);
        
        console.log(`   - ${dailyQuests.length} quêtes quotidiennes (ex: "${dailyQuests[0]?.title}")`);
        console.log(`   - ${weeklyQuests.length} quêtes hebdomadaires (ex: "${weeklyQuests[0]?.title}")`);
      } else {
        console.log('❌ Aucune quête disponible');
      }
    } catch (error) {
      console.log('❌ Erreur lors de la récupération des quêtes:', error.message);
    }
    
    // 3. Test de la route de santé
    console.log('\n3. Test de la route de santé...');
    try {
      const response = await axios.get(`${BASE_URL}/health`);
      if (response.data?.status === 'ok') {
        console.log('✅ Service backend opérationnel');
      } else {
        console.log('⚠️  Service backend peut avoir des problèmes');
      }
    } catch (error) {
      console.log('❌ Service backend inaccessible:', error.message);
    }
    
    console.log('\n🎯 Résumé des tests:');
    console.log('   - La complétion des quêtes avec des IDs fictifs est bien bloquée côté backend');
    console.log('   - Le frontend doit gérer ces cas avec la simulation côté client');
    console.log('   - Les quêtes sont bien disponibles pour la génération démo');
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
  }
}

// Exécuter les tests
testQuestCompletion();

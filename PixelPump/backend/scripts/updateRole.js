#!/usr/bin/env node

// Script pour mettre à jour le rôle d'un utilisateur en admin
const { User } = require('../models');

async function updateUserRole(email, role) {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log(`❌ Utilisateur avec email ${email} non trouvé`);
      return;
    }
    
    user.role = role;
    await user.save();
    
    console.log(`✅ Rôle de l'utilisateur ${email} mis à jour vers: ${role}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

// Récupérer les arguments de la ligne de commande
const email = process.argv[2];
const role = process.argv[3] || 'admin';

if (!email) {
  console.log('Usage: node updateRole.js <email> [role]');
  console.log('Exemple: node updateRole.js admin@pixelpump.com admin');
  process.exit(1);
}

updateUserRole(email, role);

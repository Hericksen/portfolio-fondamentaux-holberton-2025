const { Achievement } = require('../models');

// 41 nouveaux achievements sportifs pour atteindre un total de 50
const sportAchievements = [
  // === ACHIEVEMENTS QUÊTES SPORTIVES ===
  {
    title: "Premier Pas Sportif",
    description: "Complétez votre première quête sportive",
    condition: "Terminer 1 quête sportive",
    condition_type: "quest_count",
    condition_value: 1,
    icon: "🏃‍♂️",
    rarity: "common",
    xp_reward: 25,
    is_active: true
  },
  {
    title: "Athlète Débutant",
    description: "Complétez 5 quêtes sportives",
    condition: "Terminer 5 quêtes sportives",
    condition_type: "quest_count",
    condition_value: 5,
    icon: "🏋️‍♀️",
    rarity: "common",
    xp_reward: 50,
    is_active: true
  },
  {
    title: "Sportif Régulier",
    description: "Complétez 15 quêtes sportives",
    condition: "Terminer 15 quêtes sportives",
    condition_type: "quest_count",
    condition_value: 15,
    icon: "⚡",
    rarity: "rare",
    xp_reward: 100,
    is_active: true
  },
  {
    title: "Guerrier du Fitness",
    description: "Complétez 30 quêtes sportives",
    condition: "Terminer 30 quêtes sportives",
    condition_type: "quest_count",
    condition_value: 30,
    icon: "💪",
    rarity: "rare",
    xp_reward: 150,
    is_active: true
  },
  {
    title: "Machine de Sport",
    description: "Complétez 50 quêtes sportives",
    condition: "Terminer 50 quêtes sportives",
    condition_type: "quest_count",
    condition_value: 50,
    icon: "�",
    rarity: "epic",
    xp_reward: 250,
    is_active: true
  },
  {
    title: "Légende du Fitness",
    description: "Complétez 75 quêtes sportives",
    condition: "Terminer 75 quêtes sportives",
    condition_type: "quest_count",
    condition_value: 75,
    icon: "👑",
    rarity: "epic",
    xp_reward: 400,
    is_active: true
  },
  {
    title: "Maître de l'Exercice",
    description: "Complétez 100 quêtes sportives",
    condition: "Terminer 100 quêtes sportives",
    condition_type: "quest_count",
    condition_value: 100,
    icon: "�",
    rarity: "legendary",
    xp_reward: 500,
    is_active: true
  },
  {
    title: "Champion Ultime",
    description: "Complétez 150 quêtes sportives",
    condition: "Terminer 150 quêtes sportives",
    condition_type: "quest_count",
    condition_value: 150,
    icon: "🥇",
    rarity: "legendary",
    xp_reward: 750,
    is_active: true
  },

  // === ACHIEVEMENTS STREAKS SPORTIFS ===
  {
    title: "Début de Routine",
    description: "Maintenez un streak de 3 jours",
    condition: "3 jours consécutifs d'activité",
    condition_type: "streak",
    condition_value: 3,
    icon: "🔥",
    rarity: "common",
    xp_reward: 60,
    is_active: true
  },
  {
    title: "Semaine Active",
    description: "Maintenez un streak de 7 jours",
    condition: "7 jours consécutifs d'activité",
    condition_type: "streak",
    condition_value: 7,
    icon: "�",
    rarity: "rare",
    xp_reward: 120,
    is_active: true
  },
  {
    title: "Quinze Jours Force",
    description: "Maintenez un streak de 15 jours",
    condition: "15 jours consécutifs d'activité",
    condition_type: "streak",
    condition_value: 15,
    icon: "�",
    rarity: "rare",
    xp_reward: 200,
    is_active: true
  },
  {
    title: "Mois de Discipline",
    description: "Maintenez un streak de 30 jours",
    condition: "30 jours consécutifs d'activité",
    condition_type: "streak",
    condition_value: 30,
    icon: "�",
    rarity: "epic",
    xp_reward: 400,
    is_active: true
  },
  {
    title: "Deux Mois de Fer",
    description: "Maintenez un streak de 60 jours",
    condition: "60 jours consécutifs d'activité",
    condition_type: "streak",
    condition_value: 60,
    icon: "🛡️",
    rarity: "epic",
    xp_reward: 600,
    is_active: true
  },
  {
    title: "Trimestre Sportif",
    description: "Maintenez un streak de 90 jours",
    condition: "90 jours consécutifs d'activité",
    condition_type: "streak",
    condition_value: 90,
    icon: "⚔️",
    rarity: "legendary",
    xp_reward: 800,
    is_active: true
  },
  {
    title: "Année Athlétique",
    description: "Maintenez un streak de 365 jours",
    condition: "365 jours consécutifs d'activité",
    condition_type: "streak",
    condition_value: 365,
    icon: "�️",
    rarity: "legendary",
    xp_reward: 1500,
    is_active: true
  },

  // === ACHIEVEMENTS XP SPORTIFS ===
  {
    title: "Collectionneur d'XP",
    description: "Accumulez 1000 XP au total",
    condition: "Obtenir 1000 XP total",
    condition_type: "xp_total",
    condition_value: 1000,
    icon: "💎",
    rarity: "common",
    xp_reward: 100,
    is_active: true
  },
  {
    title: "Maître des Points",
    description: "Accumulez 2500 XP au total",
    condition: "Obtenir 2500 XP total",
    condition_type: "xp_total",
    condition_value: 2500,
    icon: "💰",
    rarity: "rare",
    xp_reward: 200,
    is_active: true
  },
  {
    title: "Baron de l'XP",
    description: "Accumulez 5000 XP au total",
    condition: "Obtenir 5000 XP total",
    condition_type: "xp_total",
    condition_value: 5000,
    icon: "👑",
    rarity: "rare",
    xp_reward: 300,
    is_active: true
  },
  {
    title: "Seigneur du Score",
    description: "Accumulez 10000 XP au total",
    condition: "Obtenir 10000 XP total",
    condition_type: "xp_total",
    condition_value: 10000,
    icon: "🏰",
    rarity: "epic",
    xp_reward: 500,
    is_active: true
  },
  {
    title: "Empereur de l'XP",
    description: "Accumulez 20000 XP au total",
    condition: "Obtenir 20000 XP total",
    condition_type: "xp_total",
    condition_value: 20000,
    icon: "�",
    rarity: "epic",
    xp_reward: 750,
    is_active: true
  },
  {
    title: "Dieu du Grind",
    description: "Accumulez 50000 XP au total",
    condition: "Obtenir 50000 XP total",
    condition_type: "xp_total",
    condition_value: 50000,
    icon: "⚡",
    rarity: "legendary",
    xp_reward: 1000,
    is_active: true
  },

  // === ACHIEVEMENTS NIVEAUX ===
  {
    title: "Apprenti Sportif",
    description: "Atteignez le niveau 3",
    condition: "Atteindre le niveau 3",
    condition_type: "level",
    condition_value: 3,
    icon: "🎯",
    rarity: "common",
    xp_reward: 75,
    is_active: true
  },
  {
    title: "Athlète Confirmé",
    description: "Atteignez le niveau 8",
    condition: "Atteindre le niveau 8",
    condition_type: "level",
    condition_value: 8,
    icon: "�",
    rarity: "rare",
    xp_reward: 150,
    is_active: true
  },
  {
    title: "Expert Fitness",
    description: "Atteignez le niveau 15",
    condition: "Atteindre le niveau 15",
    condition_type: "level",
    condition_value: 15,
    icon: "🎖️",
    rarity: "epic",
    xp_reward: 300,
    is_active: true
  },
  {
    title: "Légende Vivante",
    description: "Atteignez le niveau 25",
    condition: "Atteindre le niveau 25",
    condition_type: "level",
    condition_value: 25,
    icon: "⭐",
    rarity: "legendary",
    xp_reward: 500,
    is_active: true
  },

  // === ACHIEVEMENTS ASSIDUITÉ ===
  {
    title: "Régularité",
    description: "Connectez-vous 7 jours",
    condition: "Se connecter 7 jours",
    condition_type: "login_days",
    condition_value: 7,
    icon: "📱",
    rarity: "common",
    xp_reward: 50,
    is_active: true
  },
  {
    title: "Fidélité Sportive",
    description: "Connectez-vous 30 jours",
    condition: "Se connecter 30 jours",
    condition_type: "login_days",
    condition_value: 30,
    icon: "🎮",
    rarity: "rare",
    xp_reward: 150,
    is_active: true
  },
  {
    title: "Utilisateur Dévoué",
    description: "Connectez-vous 60 jours",
    condition: "Se connecter 60 jours",
    condition_type: "login_days",
    condition_value: 60,
    icon: "💝",
    rarity: "epic",
    xp_reward: 300,
    is_active: true
  },
  {
    title: "Fidèle Compagnon",
    description: "Connectez-vous 100 jours",
    condition: "Se connecter 100 jours",
    condition_type: "login_days",
    condition_value: 100,
    icon: "🤝",
    rarity: "legendary",
    xp_reward: 500,
    is_active: true
  },

  // === ACHIEVEMENTS BONUS CRÉATIFS ===
  {
    title: "Explorateur d'Interface",
    description: "Complétez 10 quêtes",
    condition: "Terminer 10 quêtes",
    condition_type: "quest_count",
    condition_value: 10,
    icon: "�️",
    rarity: "common",
    xp_reward: 75,
    is_active: true
  },
  {
    title: "Conquérant de Défis",
    description: "Complétez 20 quêtes",
    condition: "Terminer 20 quêtes",
    condition_type: "quest_count",
    condition_value: 20,
    icon: "�‍☠️",
    rarity: "rare",
    xp_reward: 125,
    is_active: true
  },
  {
    title: "Niveau Intermédiaire",
    description: "Atteignez le niveau 5",
    condition: "Atteindre le niveau 5",
    condition_type: "level",
    condition_value: 5,
    icon: "🔋",
    rarity: "common",
    xp_reward: 100,
    is_active: true
  },
  {
    title: "Niveau Avancé",
    description: "Atteignez le niveau 12",
    condition: "Atteindre le niveau 12",
    condition_type: "level",
    condition_value: 12,
    icon: "⚡",
    rarity: "rare",
    xp_reward: 200,
    is_active: true
  },
  {
    title: "Chasseur d'XP",
    description: "Accumulez 1500 XP au total",
    condition: "Obtenir 1500 XP total",
    condition_type: "xp_total",
    condition_value: 1500,
    icon: "�",
    rarity: "common",
    xp_reward: 150,
    is_active: true
  },
  {
    title: "Accumulateur Pro",
    description: "Accumulez 3500 XP au total",
    condition: "Obtenir 3500 XP total",
    condition_type: "xp_total",
    condition_value: 3500,
    icon: "💪",
    rarity: "rare",
    xp_reward: 250,
    is_active: true
  },
  {
    title: "Streaker Novice",
    description: "Maintenez un streak de 5 jours",
    condition: "5 jours consécutifs d'activité",
    condition_type: "streak",
    condition_value: 5,
    icon: "🔥",
    rarity: "common",
    xp_reward: 80,
    is_active: true
  },
  {
    title: "Streaker Avancé",
    description: "Maintenez un streak de 21 jours",
    condition: "21 jours consécutifs d'activité",
    condition_type: "streak",
    condition_value: 21,
    icon: "🌟",
    rarity: "rare",
    xp_reward: 300,
    is_active: true
  },
  {
    title: "Habitué de l'App",
    description: "Connectez-vous 14 jours",
    condition: "Se connecter 14 jours",
    condition_type: "login_days",
    condition_value: 14,
    icon: "📲",
    rarity: "common",
    xp_reward: 80,
    is_active: true
  },
  {
    title: "Fan de PixelPump",
    description: "Connectez-vous 45 jours",
    condition: "Se connecter 45 jours",
    condition_type: "login_days",
    condition_value: 45,
    icon: "❤️",
    rarity: "rare",
    xp_reward: 200,
    is_active: true
  },
  {
    title: "Perfectionniste",
    description: "Complétez 200 quêtes",
    condition: "Terminer 200 quêtes",
    condition_type: "quest_count",
    condition_value: 200,
    icon: "💯",
    rarity: "legendary",
    xp_reward: 1000,
    is_active: true
  },
  {
    title: "Titan de l'Activité",
    description: "Atteignez le niveau 30",
    condition: "Atteindre le niveau 30",
    condition_type: "level",
    condition_value: 30,
    icon: "🗿",
    rarity: "legendary",
    xp_reward: 800,
    is_active: true
  },
  {
    title: "Millionnaire XP",
    description: "Accumulez 100000 XP au total",
    condition: "Obtenir 100000 XP total",
    condition_type: "xp_total",
    condition_value: 100000,
    icon: "�",
    rarity: "legendary",
    xp_reward: 2000,
    is_active: true
  }
];

async function addSportAchievements() {
  try {
    console.log('🏆 Ajout de 41 nouveaux achievements sportifs...');
    
    // Ajouter tous les achievements
    await Achievement.bulkCreate(sportAchievements, { 
      ignoreDuplicates: true 
    });
    
    // Vérifier le total
    const totalAchievements = await Achievement.count({ where: { is_active: true } });
    
    console.log(`✅ ${sportAchievements.length} achievements sportifs ajoutés avec succès!`);
    console.log(`📊 Total d'achievements disponibles: ${totalAchievements}`);
    
    // Afficher un résumé par rareté
    const summary = {
      common: sportAchievements.filter(a => a.rarity === 'common').length,
      rare: sportAchievements.filter(a => a.rarity === 'rare').length,
      epic: sportAchievements.filter(a => a.rarity === 'epic').length,
      legendary: sportAchievements.filter(a => a.rarity === 'legendary').length
    };
    
    console.log('📈 Répartition par rareté des nouveaux achievements:');
    console.log(`   🟢 Common: ${summary.common}`);
    console.log(`   🔵 Rare: ${summary.rare}`);
    console.log(`   🟣 Epic: ${summary.epic}`);
    console.log(`   🟡 Legendary: ${summary.legendary}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des achievements:', error);
    throw error;
  }
}

module.exports = addSportAchievements;

// Exécuter le script si appelé directement
if (require.main === module) {
  addSportAchievements()
    .then(() => {
      console.log('🎯 Ajout des achievements terminé!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur:', error);
      process.exit(1);
    });
}

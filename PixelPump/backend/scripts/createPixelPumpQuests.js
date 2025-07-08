#!/usr/bin/env node

const { Quest } = require('../models');
const sequelize = require('../config/db');

async function createPixelPumpQuests() {
  try {
    console.log('🏋️ Création de 100 nouvelles quêtes thématiques PixelPump...');

    // Définir 100 quêtes thématiques PixelPump
    const pixelPumpQuests = [
      // === QUÊTES QUOTIDIENNES DE CARDIO (15 quêtes) ===
      {
        title: "Course Pixelisée",
        description: "Courez pendant 20 minutes pour accumuler des pixels d'énergie.",
        type: "daily",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 40,
        duration_minutes: 20,
        min_level: 1,
        requirements: { running_minutes: 20 }
      },
      {
        title: "Pixels en Mouvement",
        description: "Marchez 5000 pas pour générer des pixels de vitalité.",
        type: "daily",
        category: "fitness",
        difficulty: "easy",
        xp_reward: 25,
        duration_minutes: 30,
        min_level: 1,
        requirements: { steps: 5000 }
      },
      {
        title: "Vélo Virtuel",
        description: "Pédalez pendant 15 minutes pour charger votre batterie d'endurance.",
        type: "daily",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 35,
        duration_minutes: 15,
        min_level: 2,
        requirements: { cycling_minutes: 15 }
      },
      {
        title: "Rafale de Jumping Jacks",
        description: "Effectuez 50 jumping jacks pour débloquer le bonus d'agilité.",
        type: "daily",
        category: "fitness",
        difficulty: "easy",
        xp_reward: 30,
        duration_minutes: 5,
        min_level: 1,
        requirements: { jumping_jacks: 50 }
      },
      {
        title: "Interval Turbo",
        description: "Réalisez 8 sprints de 20 secondes pour surcharger votre avatar.",
        type: "daily",
        category: "fitness",
        difficulty: "hard",
        xp_reward: 60,
        duration_minutes: 15,
        min_level: 3,
        requirements: { sprint_intervals: 8 }
      },
      {
        title: "Escaliers Numériques",
        description: "Montez 10 étages d'escaliers pour améliorer votre niveau d'élévation.",
        type: "daily",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 45,
        duration_minutes: 10,
        min_level: 2,
        requirements: { stairs_floors: 10 }
      },
      {
        title: "Burpees Binaires",
        description: "Complétez 15 burpees pour optimiser votre code physique.",
        type: "daily",
        category: "fitness",
        difficulty: "hard",
        xp_reward: 50,
        duration_minutes: 5,
        min_level: 3,
        requirements: { burpees: 15 }
      },
      {
        title: "Danse Digitale",
        description: "Dansez pendant 10 minutes pour synchroniser votre rythme cardiaque.",
        type: "daily",
        category: "fitness",
        difficulty: "easy",
        xp_reward: 30,
        duration_minutes: 10,
        min_level: 1,
        requirements: { dance_minutes: 10 }
      },
      {
        title: "Corde à Sauter Cybernétique",
        description: "Sautez à la corde pendant 5 minutes pour améliorer votre système d'exploitation.",
        type: "daily",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 40,
        duration_minutes: 5,
        min_level: 2,
        requirements: { jump_rope_minutes: 5 }
      },
      {
        title: "Démarrage Cardio",
        description: "Effectuez 10 minutes d'échauffement cardio pour initialiser votre journée.",
        type: "daily",
        category: "fitness",
        difficulty: "easy",
        xp_reward: 25,
        duration_minutes: 10,
        min_level: 1,
        requirements: { warmup_minutes: 10 }
      },
      {
        title: "Marathon Miniature",
        description: "Courez ou marchez pendant 30 minutes pour générer un nouveau high score.",
        type: "daily",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 50,
        duration_minutes: 30,
        min_level: 2,
        requirements: { cardio_minutes: 30 }
      },
      {
        title: "Elliptique Électronique",
        description: "Utilisez une machine elliptique pendant 20 minutes pour recharger votre énergie.",
        type: "daily",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 45,
        duration_minutes: 20,
        min_level: 2,
        requirements: { elliptical_minutes: 20 }
      },
      {
        title: "Battement Binaire",
        description: "Maintenez votre fréquence cardiaque entre 120-140 BPM pendant 15 minutes.",
        type: "daily",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 40,
        duration_minutes: 15,
        min_level: 3,
        requirements: { target_heart_rate_minutes: 15 }
      },
      {
        title: "Natation Numérique",
        description: "Nagez pendant 20 minutes pour naviguer dans l'océan des données.",
        type: "daily",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 50,
        duration_minutes: 20,
        min_level: 3,
        requirements: { swimming_minutes: 20 }
      },
      {
        title: "Rameur Rétro",
        description: "Utilisez un rameur pendant 10 minutes pour propulser votre avatar.",
        type: "daily",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 45,
        duration_minutes: 10,
        min_level: 2,
        requirements: { rowing_minutes: 10 }
      },

      // === QUÊTES DE FORCE ET MUSCULATION (15 quêtes) ===
      {
        title: "Pompes Pixelisées",
        description: "Effectuez 20 pompes pour renforcer le pare-feu de votre torse.",
        type: "daily",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 40,
        duration_minutes: 5,
        min_level: 2,
        requirements: { pushups: 20 }
      },
      {
        title: "Squats Serveur",
        description: "Réalisez 30 squats pour augmenter la puissance de vos jambes virtuelles.",
        type: "daily",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 45,
        duration_minutes: 8,
        min_level: 2,
        requirements: { squats: 30 }
      },
      {
        title: "Tractions Tactiques",
        description: "Faites 10 tractions pour mettre à niveau vos bras pixelisés.",
        type: "daily",
        category: "fitness",
        difficulty: "hard",
        xp_reward: 55,
        duration_minutes: 5,
        min_level: 4,
        requirements: { pullups: 10 }
      },
      {
        title: "Planches Programmées",
        description: "Maintenez la position de planche pendant 2 minutes pour stabiliser votre noyau système.",
        type: "daily",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 35,
        duration_minutes: 5,
        min_level: 2,
        requirements: { plank_seconds: 120 }
      },
      {
        title: "Dips Digitaux",
        description: "Effectuez 15 dips pour optimiser vos triceps.",
        type: "daily",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 40,
        duration_minutes: 5,
        min_level: 3,
        requirements: { dips: 15 }
      },
      {
        title: "Soulevé de Terre Digital",
        description: "Réalisez 15 soulevés de terre pour augmenter votre puissance dorsale.",
        type: "daily",
        category: "fitness",
        difficulty: "hard",
        xp_reward: 50,
        duration_minutes: 10,
        min_level: 4,
        requirements: { deadlifts: 15 }
      },
      {
        title: "Curls Cybernétiques",
        description: "Faites 3 séries de 10 curls pour sculpter vos biceps virtuels.",
        type: "daily",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 35,
        duration_minutes: 8,
        min_level: 2,
        requirements: { bicep_curls: 30 }
      },
      {
        title: "Épaules Encodées",
        description: "Réalisez 3 séries de 12 élévations latérales pour développer des épaules de guerrier.",
        type: "daily",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 40,
        duration_minutes: 10,
        min_level: 3,
        requirements: { lateral_raises: 36 }
      },
      {
        title: "Abdos Algorithmiques",
        description: "Effectuez 50 crunchs pour programmer un ventre solide.",
        type: "daily",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 35,
        duration_minutes: 10,
        min_level: 2,
        requirements: { crunches: 50 }
      },
      {
        title: "Extension Jambes Exabyte",
        description: "Faites 3 séries de 12 extensions de jambes pour renforcer vos quadriceps.",
        type: "daily",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 40,
        duration_minutes: 10,
        min_level: 3,
        requirements: { leg_extensions: 36 }
      },
      {
        title: "Circuit CPU",
        description: "Complétez un circuit de 5 exercices différents sans pause.",
        type: "daily",
        category: "fitness",
        difficulty: "hard",
        xp_reward: 60,
        duration_minutes: 15,
        min_level: 4,
        requirements: { circuit_exercises: 5 }
      },
      {
        title: "Mollets Mécaniques",
        description: "Effectuez 50 élévations de talons pour upgrader vos mollets.",
        type: "daily",
        category: "fitness",
        difficulty: "easy",
        xp_reward: 30,
        duration_minutes: 5,
        min_level: 1,
        requirements: { calf_raises: 50 }
      },
      {
        title: "Kettlebell Kilobytes",
        description: "Réalisez 20 swings de kettlebell pour augmenter votre puissance.",
        type: "daily",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 45,
        duration_minutes: 8,
        min_level: 3,
        requirements: { kettlebell_swings: 20 }
      },
      {
        title: "Haltères Hexadécimaux",
        description: "Effectuez un entraînement complet avec haltères de 10 minutes.",
        type: "daily",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 40,
        duration_minutes: 10,
        min_level: 2,
        requirements: { dumbbell_workout_minutes: 10 }
      },
      {
        title: "Fentes Fractales",
        description: "Réalisez 30 fentes (15 de chaque côté) pour équilibrer vos jambes.",
        type: "daily",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 40,
        duration_minutes: 8,
        min_level: 2,
        requirements: { lunges: 30 }
      },

      // === QUÊTES DE FLEXIBILITÉ ET RÉCUPÉRATION (15 quêtes) ===
      {
        title: "Étirements Ethernet",
        description: "Étirez-vous pendant 15 minutes pour optimiser votre flexibilité système.",
        type: "daily",
        category: "health",
        difficulty: "easy",
        xp_reward: 30,
        duration_minutes: 15,
        min_level: 1,
        requirements: { stretching_minutes: 15 }
      },
      {
        title: "Yoga Yottabyte",
        description: "Pratiquez 20 minutes de yoga pour aligner vos chakras numériques.",
        type: "daily",
        category: "health",
        difficulty: "medium",
        xp_reward: 40,
        duration_minutes: 20,
        min_level: 2,
        requirements: { yoga_minutes: 20 }
      },
      {
        title: "Méditation Mégahertz",
        description: "Méditez pendant 10 minutes pour défragmenter votre esprit.",
        type: "daily",
        category: "health",
        difficulty: "easy",
        xp_reward: 25,
        duration_minutes: 10,
        min_level: 1,
        requirements: { meditation_minutes: 10 }
      },
      {
        title: "Respiration RAM",
        description: "Pratiquez 5 minutes d'exercices de respiration profonde pour nettoyer votre cache mental.",
        type: "daily",
        category: "health",
        difficulty: "easy",
        xp_reward: 20,
        duration_minutes: 5,
        min_level: 1,
        requirements: { breathing_minutes: 5 }
      },
      {
        title: "Posture Processeur",
        description: "Maintenez une posture parfaite pendant 4 heures de votre journée.",
        type: "daily",
        category: "health",
        difficulty: "medium",
        xp_reward: 45,
        duration_minutes: 240,
        min_level: 2,
        requirements: { posture_hours: 4 }
      },
      {
        title: "Massage Mémoire",
        description: "Utilisez un rouleau de massage ou une balle pendant 10 minutes pour libérer la tension musculaire.",
        type: "daily",
        category: "health",
        difficulty: "easy",
        xp_reward: 25,
        duration_minutes: 10,
        min_level: 1,
        requirements: { foam_rolling_minutes: 10 }
      },
      {
        title: "Sommeil Système",
        description: "Dormez 8 heures pour permettre la maintenance et la récupération de votre corps.",
        type: "daily",
        category: "health",
        difficulty: "medium",
        xp_reward: 40,
        duration_minutes: 480,
        min_level: 1,
        requirements: { sleep_hours: 8 }
      },
      {
        title: "Relaxation Réseau",
        description: "Prenez un bain chaud ou une douche chaude pour détendre vos muscles.",
        type: "daily",
        category: "health",
        difficulty: "easy",
        xp_reward: 20,
        duration_minutes: 20,
        min_level: 1,
        requirements: { relaxation_minutes: 20 }
      },
      {
        title: "Équilibre Exponentiel",
        description: "Pratiquez 10 minutes d'exercices d'équilibre pour stabiliser votre système.",
        type: "daily",
        category: "health",
        difficulty: "medium",
        xp_reward: 35,
        duration_minutes: 10,
        min_level: 2,
        requirements: { balance_minutes: 10 }
      },
      {
        title: "Mobilité Modem",
        description: "Effectuez 15 minutes d'exercices de mobilité articulaire pour lubrifier votre hardware.",
        type: "daily",
        category: "health",
        difficulty: "medium",
        xp_reward: 35,
        duration_minutes: 15,
        min_level: 2,
        requirements: { mobility_minutes: 15 }
      },
      {
        title: "Splits Serveur",
        description: "Améliorez votre souplesse en travaillant pendant 10 minutes sur les grands écarts.",
        type: "daily",
        category: "health",
        difficulty: "hard",
        xp_reward: 50,
        duration_minutes: 10,
        min_level: 3,
        requirements: { splits_minutes: 10 }
      },
      {
        title: "Bain Glacé Binaire",
        description: "Prenez une douche froide ou un bain d'eau froide pour accélérer votre récupération.",
        type: "daily",
        category: "health",
        difficulty: "hard",
        xp_reward: 55,
        duration_minutes: 5,
        min_level: 4,
        requirements: { cold_exposure_minutes: 5 }
      },
      {
        title: "Sauna Serveur",
        description: "Utilisez un sauna pendant 15 minutes pour éliminer les toxines.",
        type: "daily",
        category: "health",
        difficulty: "medium",
        xp_reward: 40,
        duration_minutes: 15,
        min_level: 3,
        requirements: { sauna_minutes: 15 }
      },
      {
        title: "Écran en Veille",
        description: "Évitez les écrans pendant 2 heures avant de dormir pour améliorer la qualité de sommeil.",
        type: "daily",
        category: "health",
        difficulty: "medium",
        xp_reward: 35,
        duration_minutes: 120,
        min_level: 2,
        requirements: { screen_free_hours: 2 }
      },
      {
        title: "Routine Reset",
        description: "Effectuez une routine complète d'étirements avant de vous coucher.",
        type: "daily",
        category: "health",
        difficulty: "easy",
        xp_reward: 25,
        duration_minutes: 10,
        min_level: 1,
        requirements: { bedtime_stretching: true }
      },

      // === QUÊTES NUTRITION ET HYDRATATION (15 quêtes) ===
      {
        title: "Hydratation Hardware",
        description: "Buvez 2 litres d'eau aujourd'hui pour refroidir votre système.",
        type: "daily",
        category: "health",
        difficulty: "easy",
        xp_reward: 30,
        duration_minutes: 0,
        min_level: 1,
        requirements: { water_liters: 2 }
      },
      {
        title: "Protéines Programmées",
        description: "Consommez 3 sources de protéines de qualité aujourd'hui.",
        type: "daily",
        category: "health",
        difficulty: "medium",
        xp_reward: 35,
        duration_minutes: 0,
        min_level: 2,
        requirements: { protein_sources: 3 }
      },
      {
        title: "Fruits Firmware",
        description: "Mangez 3 fruits différents pour recharger vos vitamines système.",
        type: "daily",
        category: "health",
        difficulty: "easy",
        xp_reward: 25,
        duration_minutes: 0,
        min_level: 1,
        requirements: { different_fruits: 3 }
      },
      {
        title: "Légumes Logiciels",
        description: "Consommez 5 légumes différents pour optimiser votre code génétique.",
        type: "daily",
        category: "health",
        difficulty: "medium",
        xp_reward: 40,
        duration_minutes: 0,
        min_level: 1,
        requirements: { different_vegetables: 5 }
      },
      {
        title: "Préparation des Programmes",
        description: "Préparez vos repas pour 3 jours à l'avance.",
        type: "weekly",
        category: "health",
        difficulty: "medium",
        xp_reward: 100,
        duration_minutes: 90,
        min_level: 2,
        requirements: { meal_prep_days: 3 }
      },
      {
        title: "Sucre Système",
        description: "Limitez votre consommation de sucre ajouté à moins de 25g aujourd'hui.",
        type: "daily",
        category: "health",
        difficulty: "medium",
        xp_reward: 45,
        duration_minutes: 0,
        min_level: 2,
        requirements: { sugar_control: true }
      },
      {
        title: "Jeûne Joystick",
        description: "Pratiquez le jeûne intermittent 16/8 aujourd'hui.",
        type: "daily",
        category: "health",
        difficulty: "hard",
        xp_reward: 50,
        duration_minutes: 0,
        min_level: 3,
        requirements: { intermittent_fasting: true }
      },
      {
        title: "Calories Codées",
        description: "Suivez vos calories aujourd'hui pour maintenir votre objectif énergétique.",
        type: "daily",
        category: "health",
        difficulty: "medium",
        xp_reward: 40,
        duration_minutes: 10,
        min_level: 2,
        requirements: { calorie_tracking: true }
      },
      {
        title: "Thé Terminal",
        description: "Remplacez une boisson sucrée par du thé vert ou du thé noir sans sucre.",
        type: "daily",
        category: "health",
        difficulty: "easy",
        xp_reward: 20,
        duration_minutes: 0,
        min_level: 1,
        requirements: { tea_substitute: true }
      },
      {
        title: "Omégas Optimisés",
        description: "Consommez une source d'acides gras oméga-3 aujourd'hui.",
        type: "daily",
        category: "health",
        difficulty: "medium",
        xp_reward: 35,
        duration_minutes: 0,
        min_level: 2,
        requirements: { omega3_source: true }
      },
      {
        title: "Petit-Déjeuner Pixel",
        description: "Prenez un petit-déjeuner équilibré contenant protéines, fibres et graisses saines.",
        type: "daily",
        category: "health",
        difficulty: "easy",
        xp_reward: 30,
        duration_minutes: 15,
        min_level: 1,
        requirements: { balanced_breakfast: true }
      },
      {
        title: "Cuisine Cryptée",
        description: "Cuisinez un nouveau plat sain que vous n'avez jamais essayé auparavant.",
        type: "weekly",
        category: "health",
        difficulty: "medium",
        xp_reward: 80,
        duration_minutes: 60,
        min_level: 2,
        requirements: { new_healthy_recipe: true }
      },
      {
        title: "Multi-Vitamines Matrice",
        description: "Prenez vos compléments alimentaires recommandés aujourd'hui.",
        type: "daily",
        category: "health",
        difficulty: "easy",
        xp_reward: 15,
        duration_minutes: 0,
        min_level: 1,
        requirements: { supplements_taken: true }
      },
      {
        title: "Fibres Firewall",
        description: "Consommez au moins 30g de fibres aujourd'hui pour votre santé digestive.",
        type: "daily",
        category: "health",
        difficulty: "medium",
        xp_reward: 40,
        duration_minutes: 0,
        min_level: 2,
        requirements: { fiber_intake: true }
      },
      {
        title: "Alcool Alt-F4",
        description: "Évitez toute consommation d'alcool aujourd'hui pour maximiser votre récupération.",
        type: "daily",
        category: "health",
        difficulty: "medium",
        xp_reward: 35,
        duration_minutes: 0,
        min_level: 2,
        requirements: { alcohol_free: true }
      },

      // === QUÊTES SOCIALES ET COMMUNAUTAIRES (10 quêtes) ===
      {
        title: "Entraînement Équipe",
        description: "Participez à une séance d'entraînement en groupe ou avec un ami.",
        type: "weekly",
        category: "social",
        difficulty: "medium",
        xp_reward: 90,
        duration_minutes: 60,
        min_level: 2,
        requirements: { group_workout: true }
      },
      {
        title: "Coach Co-op",
        description: "Partagez un conseil fitness avec un autre membre de la communauté PixelPump.",
        type: "weekly",
        category: "social",
        difficulty: "easy",
        xp_reward: 50,
        duration_minutes: 10,
        min_level: 2,
        requirements: { share_fitness_tip: true }
      },
      {
        title: "Défi Duo",
        description: "Relevez un défi fitness avec un partenaire d'entraînement.",
        type: "weekly",
        category: "social",
        difficulty: "medium",
        xp_reward: 100,
        duration_minutes: 30,
        min_level: 3,
        requirements: { partner_challenge: true }
      },
      {
        title: "Partage Progression",
        description: "Partagez vos progrès fitness sur les réseaux sociaux ou la communauté PixelPump.",
        type: "weekly",
        category: "social",
        difficulty: "easy",
        xp_reward: 60,
        duration_minutes: 10,
        min_level: 2,
        requirements: { share_progress: true }
      },
      {
        title: "Évènement Électronique",
        description: "Participez à un événement sportif communautaire virtuel ou réel.",
        type: "monthly",
        category: "social",
        difficulty: "hard",
        xp_reward: 200,
        duration_minutes: 120,
        min_level: 4,
        requirements: { community_event: true }
      },
      {
        title: "Motivateur Multiplayer",
        description: "Encouragez trois autres utilisateurs sur la plateforme PixelPump.",
        type: "weekly",
        category: "social",
        difficulty: "easy",
        xp_reward: 40,
        duration_minutes: 15,
        min_level: 2,
        requirements: { encourage_users: 3 }
      },
      {
        title: "Recrutement Réseau",
        description: "Invitez un ami à rejoindre PixelPump pour commencer son aventure fitness.",
        type: "monthly",
        category: "social",
        difficulty: "medium",
        xp_reward: 150,
        duration_minutes: 20,
        min_level: 3,
        requirements: { refer_friend: true }
      },
      {
        title: "Compétition Coopérative",
        description: "Participez à un classement ou une compétition amicale sur PixelPump.",
        type: "weekly",
        category: "social",
        difficulty: "medium",
        xp_reward: 80,
        duration_minutes: 0,
        min_level: 3,
        requirements: { join_leaderboard: true }
      },
      {
        title: "Feedback Forum",
        description: "Donnez votre avis constructif sur une fonctionnalité de PixelPump.",
        type: "monthly",
        category: "social",
        difficulty: "easy",
        xp_reward: 70,
        duration_minutes: 15,
        min_level: 2,
        requirements: { provide_feedback: true }
      },
      {
        title: "Tuteur Tactique",
        description: "Aidez un débutant en lui montrant comment réaliser correctement un exercice.",
        type: "weekly",
        category: "social",
        difficulty: "medium",
        xp_reward: 85,
        duration_minutes: 30,
        min_level: 4,
        requirements: { help_beginner: true }
      },

      // === QUÊTES DE DÉFI (10 quêtes) ===
      {
        title: "Ultra Marathon Upgradé",
        description: "Courez une distance totale de 50km en une semaine.",
        type: "weekly",
        category: "challenge",
        difficulty: "epic",
        xp_reward: 300,
        duration_minutes: 300,
        min_level: 8,
        requirements: { weekly_running_km: 50 }
      },
      {
        title: "Défi 1000 Reps",
        description: "Effectuez un total de 1000 répétitions d'exercices en une semaine.",
        type: "weekly",
        category: "challenge",
        difficulty: "hard",
        xp_reward: 250,
        duration_minutes: 180,
        min_level: 6,
        requirements: { weekly_total_reps: 1000 }
      },
      {
        title: "Workout Warrior",
        description: "Faites 7 jours consécutifs d'entraînement sans pause.",
        type: "weekly",
        category: "challenge",
        difficulty: "hard",
        xp_reward: 220,
        duration_minutes: 210,
        min_level: 5,
        requirements: { consecutive_workout_days: 7 }
      },
      {
        title: "Défi Triathlon Virtuel",
        description: "Combinez natation, vélo et course en une semaine pour un triathlon virtuel.",
        type: "weekly",
        category: "challenge",
        difficulty: "epic",
        xp_reward: 280,
        duration_minutes: 240,
        min_level: 7,
        requirements: { triathlon_completed: true }
      },
      {
        title: "Force Finale",
        description: "Battez votre record personnel sur trois exercices de force différents.",
        type: "monthly",
        category: "challenge",
        difficulty: "hard",
        xp_reward: 200,
        duration_minutes: 90,
        min_level: 6,
        requirements: { strength_records: 3 }
      },
      {
        title: "Endurance Extrême",
        description: "Maintenez une activité cardio pendant 2 heures d'affilée.",
        type: "monthly",
        category: "challenge",
        difficulty: "epic",
        xp_reward: 270,
        duration_minutes: 120,
        min_level: 7,
        requirements: { continuous_cardio_minutes: 120 }
      },
      {
        title: "Défi du Phoenix",
        description: "Complétez 30 quêtes en un mois pour renaître de vos cendres.",
        type: "monthly",
        category: "challenge",
        difficulty: "hard",
        xp_reward: 350,
        duration_minutes: 0,
        min_level: 5,
        requirements: { monthly_quests_completed: 30 }
      },
      {
        title: "HIIT Héroïque",
        description: "Réalisez 5 séances HIIT à haute intensité en une semaine.",
        type: "weekly",
        category: "challenge",
        difficulty: "hard",
        xp_reward: 230,
        duration_minutes: 150,
        min_level: 6,
        requirements: { hiit_sessions_weekly: 5 }
      },
      {
        title: "Transformation Totale",
        description: "Suivez votre alimentation et votre entraînement tous les jours pendant un mois.",
        type: "monthly",
        category: "challenge",
        difficulty: "epic",
        xp_reward: 400,
        duration_minutes: 0,
        min_level: 5,
        requirements: { tracked_days: 30 }
      },
      {
        title: "Boss Final",
        description: "Complétez un événement sportif officiel et partagez votre médaille.",
        type: "monthly",
        category: "challenge",
        difficulty: "epic",
        xp_reward: 500,
        duration_minutes: 180,
        min_level: 8,
        requirements: { official_event_completed: true }
      },

      // === QUÊTES APPRENTISSAGE ET COMPÉTENCE (10 quêtes) ===
      {
        title: "Technique Tactile",
        description: "Maîtrisez la technique parfaite d'un nouvel exercice.",
        type: "weekly",
        category: "skill",
        difficulty: "medium",
        xp_reward: 80,
        duration_minutes: 30,
        min_level: 3,
        requirements: { perfect_form: true }
      },
      {
        title: "Guide Graphique",
        description: "Regardez un tutoriel vidéo sur une technique d'entraînement avancée.",
        type: "weekly",
        category: "skill",
        difficulty: "easy",
        xp_reward: 60,
        duration_minutes: 20,
        min_level: 2,
        requirements: { watch_tutorial: true }
      },
      {
        title: "Analyse Avancée",
        description: "Analysez votre technique d'entraînement en vous filmant.",
        type: "weekly",
        category: "skill",
        difficulty: "medium",
        xp_reward: 75,
        duration_minutes: 30,
        min_level: 3,
        requirements: { record_technique: true }
      },
      {
        title: "Lecture Logique",
        description: "Lisez un article ou livre sur la science de l'entraînement ou la nutrition.",
        type: "weekly",
        category: "skill",
        difficulty: "easy",
        xp_reward: 50,
        duration_minutes: 30,
        min_level: 2,
        requirements: { read_fitness_content: true }
      },
      {
        title: "Plan Personnalisé",
        description: "Créez un plan d'entraînement personnalisé pour la semaine prochaine.",
        type: "weekly",
        category: "skill",
        difficulty: "medium",
        xp_reward: 90,
        duration_minutes: 45,
        min_level: 4,
        requirements: { create_workout_plan: true }
      },
      {
        title: "Tracker Tactique",
        description: "Tenez un journal détaillé de vos entraînements pendant une semaine.",
        type: "weekly",
        category: "skill",
        difficulty: "medium",
        xp_reward: 85,
        duration_minutes: 35,
        min_level: 3,
        requirements: { track_workouts: 7 }
      },
      {
        title: "Nouveau Niveau",
        description: "Apprenez et intégrez un exercice que vous n'avez jamais fait auparavant.",
        type: "weekly",
        category: "skill",
        difficulty: "medium",
        xp_reward: 70,
        duration_minutes: 25,
        min_level: 3,
        requirements: { learn_new_exercise: true }
      },
      {
        title: "Méthode Modulaire",
        description: "Essayez une nouvelle méthode d'entraînement (Tabata, EMOM, AMRAP, etc.).",
        type: "weekly",
        category: "skill",
        difficulty: "medium",
        xp_reward: 80,
        duration_minutes: 30,
        min_level: 3,
        requirements: { try_training_method: true }
      },
      {
        title: "Test Technique",
        description: "Réalisez un test de performance pour mesurer votre niveau actuel.",
        type: "monthly",
        category: "skill",
        difficulty: "medium",
        xp_reward: 100,
        duration_minutes: 45,
        min_level: 4,
        requirements: { fitness_test: true }
      },
      {
        title: "Équilibre Expert",
        description: "Maîtrisez un exercice d'équilibre avancé.",
        type: "weekly",
        category: "skill",
        difficulty: "hard",
        xp_reward: 110,
        duration_minutes: 20,
        min_level: 5,
        requirements: { master_balance: true }
      },

      // === QUÊTES MENSUELLES SPÉCIALES (10 quêtes) ===
      {
        title: "Cycle Complet",
        description: "Complétez un cycle complet d'entraînement de 4 semaines.",
        type: "monthly",
        category: "challenge",
        difficulty: "epic",
        xp_reward: 450,
        duration_minutes: 0,
        min_level: 5,
        requirements: { training_cycle_completed: true }
      },
      {
        title: "Master Fitness",
        description: "Obtenez le niveau 10 dans PixelPump.",
        type: "special",
        category: "challenge",
        difficulty: "epic",
        xp_reward: 1000,
        duration_minutes: 0,
        min_level: 9,
        requirements: { reach_level: 10 }
      },
      {
        title: "Triple Couronne",
        description: "Complétez 10 quêtes dans chacune des catégories: fitness, santé et défi.",
        type: "monthly",
        category: "challenge",
        difficulty: "hard",
        xp_reward: 300,
        duration_minutes: 0,
        min_level: 5,
        requirements: { quests_per_category: 10 }
      },
      {
        title: "Explorateur Elite",
        description: "Essayez 5 nouvelles activités sportives que vous n'avez jamais pratiquées.",
        type: "monthly",
        category: "challenge",
        difficulty: "hard",
        xp_reward: 280,
        duration_minutes: 0,
        min_level: 4,
        requirements: { new_sports: 5 }
      },
      {
        title: "Conquête Calories",
        description: "Brûlez un total de 10 000 calories en un mois.",
        type: "monthly",
        category: "challenge",
        difficulty: "epic",
        xp_reward: 400,
        duration_minutes: 0,
        min_level: 6,
        requirements: { calories_burned: 10000 }
      },
      {
        title: "Marathon Mental",
        description: "Pratiquez la méditation tous les jours pendant un mois.",
        type: "monthly",
        category: "health",
        difficulty: "hard",
        xp_reward: 250,
        duration_minutes: 0,
        min_level: 3,
        requirements: { daily_meditation: 30 }
      },
      {
        title: "Transformation Avatar",
        description: "Atteignez trois objectifs personnels de fitness que vous vous êtes fixés.",
        type: "monthly",
        category: "challenge",
        difficulty: "hard",
        xp_reward: 350,
        duration_minutes: 0,
        min_level: 4,
        requirements: { personal_goals: 3 }
      },
      {
        title: "Mentor Maximal",
        description: "Aidez 5 autres utilisateurs à atteindre leurs objectifs fitness.",
        type: "monthly",
        category: "social",
        difficulty: "hard",
        xp_reward: 300,
        duration_minutes: 0,
        min_level: 6,
        requirements: { users_helped: 5 }
      },
      {
        title: "Mode Zen",
        description: "Maintenez une routine équilibrée entre entraînement, nutrition et récupération pendant un mois.",
        type: "monthly",
        category: "health",
        difficulty: "hard",
        xp_reward: 320,
        duration_minutes: 0,
        min_level: 5,
        requirements: { balanced_lifestyle: 30 }
      },
      {
        title: "Légende Pixellisée",
        description: "Complétez 100 quêtes au total dans PixelPump.",
        type: "special",
        category: "challenge",
        difficulty: "epic",
        xp_reward: 1500,
        duration_minutes: 0,
        min_level: 10,
        requirements: { total_quests_completed: 100 }
      }
    ];

    // Ajouter les quêtes à la base de données
    await Quest.bulkCreate(pixelPumpQuests);
    
    // Vérifier le nombre final de quêtes
    const finalCount = await Quest.count();
    console.log(`✅ Succès! ${finalCount} nouvelles quêtes thématiques PixelPump ont été créées.`);
    
    return { success: true, totalQuests: finalCount };
  } catch (error) {
    console.error('❌ Erreur lors de la création des quêtes:', error);
    return { success: false, error: error.message };
  }
}

// Exécuter la fonction si le script est appelé directement
if (require.main === module) {
  createPixelPumpQuests()
    .then(result => {
      if (result.success) {
        console.log('🎮 Quêtes PixelPump créées avec succès!');
        console.log(`📊 Nombre total de quêtes: ${result.totalQuests}`);
      }
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Erreur fatale:', err);
      process.exit(1);
    });
} else {
  // Exporter pour utilisation dans d'autres scripts
  module.exports = createPixelPumpQuests;
}

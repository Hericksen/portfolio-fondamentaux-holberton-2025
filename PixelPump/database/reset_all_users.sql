-- Script SQL pour réinitialiser tous les utilisateurs à 0
-- ⚠️ ATTENTION: Cette opération est IRRÉVERSIBLE !
-- ⚠️ Toutes les données de progression seront perdues !

-- Connexion à la base portfolio
\c portfolio

BEGIN;

-- 1. Supprimer toutes les quêtes utilisateur (complétées et en cours)
DELETE FROM user_quests;

-- 2. Supprimer tous les achievements utilisateur
DELETE FROM user_achievements;

-- 3. Réinitialiser tous les champs des utilisateurs
UPDATE users SET 
    xp = 0,
    level = 1,
    streak = 0,
    total_quests_completed = 0,
    last_quest_date = NULL,
    avatar = '{"body": "default", "outfit": "casual", "accessory": "none", "color": "#ff006e"}',
    fitness_goals = '{"daily_quests": 3, "weekly_xp": 1000, "target_level": 10}'
WHERE id IS NOT NULL;

-- 4. Affichage du résultat
SELECT 
    COUNT(*) as total_users_reset
FROM users;

SELECT 
    'Réinitialisation terminée!' as status,
    COUNT(*) as utilisateurs_reinitialises,
    'XP: 0, Level: 1, Streak: 0' as nouveau_statut
FROM users;

COMMIT;

-- Vérification finale
SELECT 
    username,
    email,
    xp,
    level,
    streak,
    total_quests_completed,
    avatar->>'body' as avatar_body,
    created_at
FROM users 
ORDER BY created_at DESC
LIMIT 10;

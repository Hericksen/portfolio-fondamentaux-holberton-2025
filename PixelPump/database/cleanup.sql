-- Nettoyage des données obsolètes
-- Script de maintenance pour PixelPump

-- Supprimer les quêtes expirées de plus de 30 jours
DELETE FROM "UserQuests" 
WHERE "assigned_at" < NOW() - INTERVAL '30 days' 
  AND "completed_at" IS NULL;

-- Supprimer les cycles inactifs anciens
DELETE FROM "QuestCycles" 
WHERE "is_active" = false 
  AND "end_date" < NOW() - INTERVAL '7 days';

-- Nettoyer les tokens expirés (si applicable)
-- DELETE FROM user_sessions WHERE expires_at < NOW();

-- Optimisation des stats
VACUUM ANALYZE "Users";
VACUUM ANALYZE "Quests";
VACUUM ANALYZE "UserQuests";
VACUUM ANALYZE "QuestCycles";
VACUUM ANALYZE "Achievements";
VACUUM ANALYZE "UserAchievements";

-- Message de fin
SELECT 'Nettoyage terminé' AS status, NOW() AS timestamp;

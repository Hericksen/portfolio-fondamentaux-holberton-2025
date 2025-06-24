-- 1. Connect to the database
\c portfolio

-- 2. Check if the tables exist
SELECT 'users' AS table, to_regclass('public.users') IS NOT NULL AS exists;
SELECT 'quests' AS table, to_regclass('public.quests') IS NOT NULL AS exists;
SELECT 'achievements' AS table, to_regclass('public.achievements') IS NOT NULL AS exists;

-- 3. Check main columns of the users table
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY column_name;

-- 4. Insert a test user
INSERT INTO users (email, password_hash, username)
VALUES ('testuser@example.com', 'hash', 'testuser')
RETURNING id INTO TEMP TABLE temp_user;

-- 5. Test UNIQUE constraint on email (should fail)
DO $$
BEGIN
    BEGIN
        INSERT INTO users (email, password_hash, username)
        VALUES ('testuser@example.com', 'hash2', 'testuser2');
        RAISE EXCEPTION 'Error: UNIQUE constraint not enforced!';
    EXCEPTION WHEN unique_violation THEN
        -- OK, expected
    END;
END;
$$;

-- 6. Insert a quest linked to the user
INSERT INTO quests (title, description, type, xp_reward, user_id)
SELECT 'Test Quest', 'Description', 'main', 50, id FROM temp_user
RETURNING id INTO TEMP TABLE temp_quest;

-- 7. Insert an achievement linked to the user
INSERT INTO achievements (title, description, condition, user_id)
SELECT 'Test Achievement', 'Desc', 'Cond', id FROM temp_user
RETURNING id INTO TEMP TABLE temp_achievement;

-- 8. Test cascading delete (deleting the user should delete related quests and achievements)
DELETE FROM users WHERE id = (SELECT id FROM temp_user);

SELECT COUNT(*) = 0 AS quests_deleted
FROM quests WHERE user_id = (SELECT id FROM temp_user);

SELECT COUNT(*) = 0 AS achievements_deleted
FROM achievements WHERE user_id = (SELECT id FROM temp_user);

-- 9. Clean up temporary tables
DROP TABLE IF EXISTS temp_user;
DROP TABLE IF EXISTS temp_quest;
DROP TABLE IF EXISTS temp_achievement;

-- 10. Test inserting a quest with a non-existent user_id (should fail)
DO $$
BEGIN
    BEGIN
        INSERT INTO quests (title, user_id) VALUES ('Invalid Quest', '00000000-0000-0000-0000-000000000000');
        RAISE EXCEPTION 'Error: foreign key constraint not enforced!';
    EXCEPTION WHEN foreign_key_violation THEN
        -- OK, expected
    END;
END;
$$;

-- 11. Test default values for quests
INSERT INTO users (email, password_hash, username)
VALUES ('defaultquest@example.com', 'hash', 'defaultquestuser')
RETURNING id INTO TEMP TABLE temp_user2;

INSERT INTO quests (title, user_id)
SELECT 'Default Quest', id FROM temp_user2
RETURNING * INTO TEMP TABLE temp_default_quest;

SELECT xp_reward = 0 AS xp_reward_default, is_completed = FALSE AS is_completed_default
FROM temp_default_quest;

-- 12. Test inserting an achievement without unlocked_at (should be NULL)
INSERT INTO achievements (title, description, condition, user_id)
SELECT 'No Unlock', 'Desc', 'Cond', id FROM temp_user2
RETURNING unlocked_at INTO TEMP TABLE temp_achievement2;

SELECT unlocked_at IS NULL AS unlocked_at_is_null FROM temp_achievement2;

-- 13. Test updating a quest to completed and incrementing user xp
UPDATE quests SET is_completed = TRUE WHERE id = (SELECT id FROM temp_default_quest);

UPDATE users SET xp = xp + 100 WHERE id = (SELECT id FROM temp_user2);

SELECT is_completed FROM quests WHERE id = (SELECT id FROM temp_default_quest);
SELECT xp FROM users WHERE id = (SELECT id FROM temp_user2);

-- 14. Clean up temporary tables
DROP TABLE IF EXISTS temp_user2;
DROP TABLE IF EXISTS temp_default_quest;
DROP TABLE IF EXISTS temp_achievement2;

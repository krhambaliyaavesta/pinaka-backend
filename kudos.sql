-- First, create a temporary table to store existing user IDs
CREATE TEMP TABLE temp_users AS
SELECT id, first_name, last_name FROM users;

-- Insert sample teams (if they don't already exist)
INSERT INTO teams (name) 
SELECT t.name FROM (VALUES 
  ('Engineering'),
  ('Product'),
  ('Design'),
  ('Marketing'),
  ('Sales'),
  ('Customer Support'),
  ('Operations'),
  ('Human Resources'),
  ('Finance')
) AS t(name)
ON CONFLICT (name) DO NOTHING;

-- Insert sample categories (if they don't already exist)
INSERT INTO categories (name) 
SELECT c.name FROM (VALUES 
  ('Teamwork'),
  ('Innovation'),
  ('Helping Hand'),
  ('Problem Solving'),
  ('Leadership'),
  ('Customer Focus'),
  ('Quality Work'),
  ('Above and Beyond')
) AS c(name)
ON CONFLICT (name) DO NOTHING;

-- Insert sample kudos cards using actual user IDs from your database
-- Safely handle situations where we don't have enough users
DO $$
DECLARE
  user_ids UUID[];
  user_count INT;
  i INT;
BEGIN
  -- Get all user IDs into an array
  SELECT array_agg(id) INTO user_ids FROM temp_users;
  
  -- Count how many users we have
  SELECT COUNT(*) INTO user_count FROM temp_users;
  
  -- Only proceed if we have at least one user
  IF user_count > 0 THEN
    -- Insert kudos cards
    FOR i IN 1..5 LOOP
      -- Use modulo to cycle through available users if we have fewer than 5
      INSERT INTO kudos_cards (recipient_name, team_id, category_id, message, created_by)
      VALUES 
      ('Sample Recipient ' || i, 
       (SELECT id FROM teams ORDER BY id LIMIT 1 OFFSET (i % 9)),
       (SELECT id FROM categories ORDER BY id LIMIT 1 OFFSET (i % 8)),
       'This is a sample kudos card message ' || i || '. Thank you for your great work!',
       user_ids[(i % user_count) + 1]);
    END LOOP;
    
    -- Add a soft-deleted kudos card for testing
    IF user_count >= 1 THEN
      INSERT INTO kudos_cards (recipient_name, team_id, category_id, message, created_by, deleted_at)
      VALUES 
      ('Deleted Sample Recipient', 
       (SELECT id FROM teams ORDER BY id LIMIT 1),
       (SELECT id FROM categories ORDER BY id LIMIT 1),
       'This is a sample soft-deleted kudos card. It should not appear in normal queries.',
       user_ids[1],
       NOW() - INTERVAL '3 days');
    END IF;
  END IF;
END $$;

-- Clean up
DROP TABLE temp_users;

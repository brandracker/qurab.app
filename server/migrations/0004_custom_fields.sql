ALTER TABLE users ADD COLUMN citizenship TEXT DEFAULT 'Citizen';
ALTER TABLE users ADD COLUMN work_arrangement TEXT DEFAULT 'remote';
ALTER TABLE users ADD COLUMN income_bracket TEXT DEFAULT '40k_80k';
ALTER TABLE users ADD COLUMN hobbies TEXT DEFAULT '[]';
ALTER TABLE users ADD COLUMN personality_traits TEXT DEFAULT '[]';
ALTER TABLE users ADD COLUMN marital_status TEXT DEFAULT 'never_married';
ALTER TABLE users ADD COLUMN dual_income_preference TEXT DEFAULT 'career_supportive';
ALTER TABLE users ADD COLUMN partner_requirements TEXT DEFAULT '{}';

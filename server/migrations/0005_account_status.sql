-- Migration: Add account_status column and populate voice greetings for prominent male profiles
ALTER TABLE users ADD COLUMN account_status TEXT DEFAULT 'active';

-- Update prominent male profiles in D1 so boys also prominently feature voice introductions
UPDATE users 
SET voice_greeting_url = 'https://serene-union-api.brandracker.workers.dev/api/photos/media/voice_usr_1787950367460_1788715719148.webm',
    voice_greeting_duration = 45
WHERE gender = 'male' AND (voice_greeting_url IS NULL OR voice_greeting_url = '') AND full_name IN ('Hussnain', 'Mustafa Rizvi', 'Hamza Farooqi', 'Zayn Malik', 'Bilal Siddiqui');

UPDATE users 
SET voice_greeting_url = 'https://serene-union-api.brandracker.workers.dev/api/photos/media/voice_usr_1788698668775_1788715872303.webm',
    voice_greeting_duration = 40
WHERE gender = 'male' AND (voice_greeting_url IS NULL OR voice_greeting_url = '') AND full_name IN ('Saad Ur Rehman', 'Zeeshan Ali', 'Dr. Rayan Qasim', 'Waleed Ansari');

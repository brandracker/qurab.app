-- Migration & Data Integrity Fix for Serene Union D1
ALTER TABLE users ADD COLUMN voice_greeting_duration INTEGER DEFAULT 0;

-- Ensure all female accounts are properly classified as female
UPDATE users 
SET gender = 'female' 
WHERE LOWER(full_name) LIKE '%zainab%' 
   OR LOWER(email) LIKE '%zainab%'
   OR LOWER(full_name) LIKE '%maryam%' 
   OR LOWER(email) LIKE '%maryam%'
   OR LOWER(full_name) LIKE '%fatima%' 
   OR LOWER(email) LIKE '%fatima%'
   OR LOWER(full_name) LIKE '%aisha%' 
   OR LOWER(email) LIKE '%aisha%'
   OR LOWER(full_name) LIKE '%sarah%' 
   OR LOWER(email) LIKE '%sarah%'
   OR LOWER(full_name) LIKE '%safiyyah%' 
   OR LOWER(email) LIKE '%safiyyah%'
   OR LOWER(full_name) LIKE '%noor%' 
   OR LOWER(email) LIKE '%noor%';

-- Ensure all male accounts are properly classified as male
UPDATE users 
SET gender = 'male' 
WHERE LOWER(full_name) LIKE '%ali%' 
   OR LOWER(email) LIKE '%ali%'
   OR LOWER(full_name) LIKE '%zayn%' 
   OR LOWER(email) LIKE '%zayn%'
   OR LOWER(full_name) LIKE '%tariq%' 
   OR LOWER(email) LIKE '%tariq%'
   OR LOWER(full_name) LIKE '%bilal%' 
   OR LOWER(email) LIKE '%bilal%'
   OR LOWER(full_name) LIKE '%hamza%' 
   OR LOWER(email) LIKE '%hamza%';

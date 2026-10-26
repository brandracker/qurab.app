const { execSync } = require('child_process');
const path = require('path');
const { profiles } = require('./generate-females-81-100-sql.cjs');

const serverDir = path.join(__dirname, '..', 'server');

console.log(`Starting Cloudflare D1 direct sync for ${profiles.length} profiles (81 to 100)...`);

for (let i = 0; i < profiles.length; i++) {
  const p = profiles[i];
  const safeName = p.name.replace(/'/g, "''");
  const safeLoc = p.location.replace(/'/g, "''");
  const safeBio = p.bio.replace(/'/g, "''");
  const safeProf = p.profession.replace(/'/g, "''");
  const safeEdu = p.education.replace(/'/g, "''");
  const safeUni = p.university.replace(/'/g, "''");
  const safeEthnicity = p.ethnicity.replace(/'/g, "''");
  const safeModesty = p.modesty.replace(/'/g, "''");
  const safeWaliName = p.waliName.replace(/'/g, "''");
  const safeHeight = p.height.replace(/'/g, "''");

  const sqlStatements = [
    `INSERT OR REPLACE INTO users (id, phone, email, password_hash, full_name, dob, gender, location, city, country, latitude, longitude, height, bio, profession, education, university, ethnicity, family_structure, living_preference, siblings_count, willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy, children_desire, marriage_timeline, blur_photos_by_default, profile_visibility, is_phone_verified, is_id_verified, is_vip, is_profile_completed, is_seed, seed_active, seed_password, account_status, is_banned, last_active_at) VALUES ('${p.id}', '${p.phone}', '${p.email}', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942', '${safeName}', '${p.dob}', 'female', '${safeLoc}', '${p.city}', 'Pakistan', ${p.lat}, ${p.lon}, '${safeHeight}', '${safeBio}', '${safeProf}', '${safeEdu}', '${safeUni}', '${safeEthnicity}', 'nuclear', 'independent', 2, 'open', 'non_smoker', 'Urdu, English', 'mutual_agreement', 'desires_children', 'within_1_year', 0, 'all_users', 1, 1, 0, 1, 1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-${Math.floor(Math.random() * 50) + 10} minutes'));`,
    `INSERT OR REPLACE INTO religious_profiles (user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet, quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio) VALUES ('${p.id}', '${p.practiceLevel}', '${p.sect}', 'Hanafi', '${p.prayer}', 'Strictly Halal', 'Regular with translation', '${safeModesty}', 'Planning insha''Allah', 'Striving to implement Islamic principles in everyday conduct, kindness, and character.');`,
    `INSERT OR REPLACE INTO wali_details (id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active) VALUES ('wali_${p.id}', '${p.id}', '${safeWaliName}', '${p.waliPhone}', '${p.waliRelation}', 1, 1);`,
    `INSERT OR REPLACE INTO user_photos (id, user_id, photo_url, is_primary, sort_order) VALUES ('photo_${p.id}_1', '${p.id}', '${p.photo}', 1, 1);`
  ].join(' ');

  console.log(`[${i + 1}/${profiles.length}] Syncing profile ${p.id} (${p.name})...`);
  try {
    const escapedSql = sqlStatements.replace(/"/g, '""');
    execSync(`npx wrangler d1 execute serene-union-db --remote --command="${escapedSql}"`, {
      cwd: serverDir,
      stdio: 'pipe'
    });
  } catch (err) {
    console.error(`Failed to sync profile ${p.id}:`, err.message);
  }
}

console.log('Direct Cloudflare D1 sync completed for all 20 female seeds (81-100)!');

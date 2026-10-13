---
name: pakistani-matrimony-generator
description: >-
  Standardized guidelines and workflows for generating hyper-realistic, culturally authentic Pakistani matrimonial profile portraits and complete seed profiles. Use this skill whenever generating female or male Pakistani matrimonial profile images with natural aesthetic, unblurred high clarity, modest cultural dress, realistic bio datasets, and secure admin-managed login credentials.
---

# Pakistani Matrimonial Profile & Image Generation Skill

This skill defines the engineering standards, aesthetic guidelines, prompt templates, and database seeding procedures for generating authentic Pakistani matrimonial profiles for Qurb Matrimony.

---

## 1. Aesthetic & Image Generation Philosophy

### Core Visual Principles:
1. **Hyper-Realism over "AI Polish":**
   - Strictly avoid the overly smooth, plastic, waxy "Midjourney CGI" look.
   - Use natural skin texture, realistic camera depth of field, authentic daylight or warm indoor ambiance.
   - Emulate authentic smartphone portraits (e.g., iPhone 15 Pro / natural candid lifestyle portrait) as taken by family or professional bridal/matrimonial photographers.
2. **Cultural & Islamic Modesty (Pakistani Context):**
   - Attire: Modest Shalwar Kameez, elegant Lawn/Chiffon Kurti, gracefully draped Dupatta over shoulder/chest, or stylish modern Hijab/Abaya.
   - Makeup: Soft, natural everyday makeup (kajal, soft lipstick, neutral blush) — strictly avoiding heavy bridal stage or theatrical makeup.
   - Poses: Respectful, poised, warm, genuine smiles, natural eye contact.
3. **Clarity & Unblurred Requirement:**
   - Always prompt for high resolution, sharp focus, crisp facial details, and clear unblurred portraits.
   - Modesty blur (if required in app) is handled by the client software, NOT baked into the source image.
4. **Geographic & Demographic Diversity:**
   - Cover Pakistan's major urban centers with appropriate cultural styling:
     - **Lahore:** Warm, cultural, artistic, academic (DHA, Gulberg, Model Town).
     - **Karachi:** Modern metropolitan, professional, medical, tech (Clifton, PECHS, Gulshan).
     - **Islamabad / Rawalpindi:** Poised, civil service, tech, international vibe (F-sectors, Bahria).
     - **Faisalabad, Multan, Peshawar, Sialkot:** Traditional family-oriented, warm, grounded.

---

## 2. Prompt Engineering Standards

When calling `generate_image`, use the following proven prompt structures:

### Structure Template:
```
A realistic portrait photograph of a beautiful [Age]-year-old Pakistani woman from [City], [Profession]. She is wearing a modest, elegant [Attire description with colors and fabric, e.g., pastel embroidered shalwar kameez with chiffon dupatta / stylish soft grey hijab and abaya]. Natural lighting, [Setting description, e.g., warm modern home interior / cozy cafe in Islamabad / sunlit veranda in Lahore]. Authentic Pakistani features, natural skin texture, genuine soft smile, warm friendly eyes. Shot on 85mm lens, f/1.8, high clarity, sharp focus, candid real smartphone portrait, photorealistic, 8k, strictly unblurred, no CGI, no waxy plastic skin.
```

### Archetype Examples:

#### 1. Doctor / Healthcare (Karachi / Lahore, Age 26-28)
> "A realistic natural photo of a 27-year-old Pakistani female doctor from Lahore. Wearing a modest sky-blue cotton kurti with a white dupatta neatly pinned over her chest. Soft natural smile, warm expressive eyes, subtle kajal. Natural indoor hospital library or modern home study background. Ultra-realistic skin texture, authentic Pakistani features, crisp sharp focus, 85mm portrait, natural daylight, unblurred, cinematic realism."

#### 2. Tech / Software Engineer (Islamabad, Age 24-27)
> "A candid lifestyle portrait of a 25-year-old Pakistani woman from Islamabad, software engineer. Wearing an elegant emerald-green modest kurta with a beige dupatta draped over one shoulder. Modern tech office or sunlit coffee shop patio in Islamabad. Natural candid expression, intelligent warm smile, authentic South Asian skin tones and fine details. Sharp focus, natural bokeh, iPhone portrait mode aesthetic, strictly unblurred, ultra-realistic."

#### 3. Hijabi Academic / Lecturer (Lahore / Rawalpindi, Age 28-31)
> "A sharp portrait photograph of a 29-year-old Pakistani university lecturer from Lahore wearing a stylish dusty-rose modern hijab and modest long tunic. Friendly approachable smile, dignified look, natural everyday lighting. Modern university garden or contemporary living room with bookshelves in background. High detail, natural skin pores, no airbrushing, perfectly sharp focus, photorealistic."

#### 4. Creative / Designer (Karachi / DHA, Age 23-26)
> "A natural portrait of a 24-year-old Pakistani graphic designer from Karachi. Wearing an ivory embroidered linen kurti with printed floral dupatta. Bright airy apartment with natural window light. Natural Pakistani face, authentic hair with loose braid, subtle pleasant smile. Crystal clear, ultra-sharp detail, natural color balance, unblurred, photorealistic 4k."

---

## 3. Seed Profile Data Standards

Every seed profile must be complete, realistic, and contain:

1. **Identity & Demographics:**
   - `full_name`: Authentic Pakistani names (e.g., Ayesha Siddiqui, Fatima Zahra, Maryam Nawaz, Mahnoor Tariq, Zainab Rehman, Hania Malik, Sara Hashmi, etc.).
   - `dob`: Calculated for age 22–33 (born 1993–2004).
   - `gender`: `'female'`.
   - `city`: Major Pakistani city with precise GPS coordinates (Karachi, Lahore, Islamabad, etc.).
   - `country`: `'Pakistan'`.
2. **Education & Career:**
   - Degrees from well-known institutions (LUMS, NUST, AKU, IBA, FAST, Kinnaird, Punjab University).
   - Realistic professions (Doctor, Software Engineer, Data Analyst, Teacher, Banker, Architect).
3. **Deen & Religious Profile:**
   - Practice level: `practicing` or `moderately_practicing`.
   - Sect: `Sunni` / `Just Muslim` / `Shia`.
   - Prayer frequency: `Always (5 times daily)` or `Usually / Striving`.
   - Halal diet: `Strictly Halal`.
4. **Bio & Partner Criteria:**
   - Thoughtful, modest, family-oriented bios written in authentic Pakistani English/Urdu cultural voice.
   - Specific partner criteria (age range, education level, religious compatibility).
5. **Admin Control Attributes:**
   - `is_seed`: `1` (marks profile as seed).
   - `seed_active`: `1` or `0` (individual visibility toggle).
   - `seed_email`: Distinct login email (e.g., `ayesha.doctor@qurb.app`).
   - `seed_phone`: Distinct Pakistani mobile number (e.g., `+923001234501`).
   - `seed_password`: Plain/admin-accessible password (e.g., `QurbSeed2026!`).
   - `password_hash`: Bcrypt/SHA-256 hash for native app login via `/api/auth/login`.

---

## 4. Admin Portal Integration Standards

The Admin Portal must provide:
1. **Dedicated Tab:** `🌱 Seed Profiles` tab alongside Overview, Users, Photos.
2. **Global Kill-Switch:** Master toggle `[Enable Seed Profiles in Discover]` (ON / OFF).
3. **One-Click Impersonate / Direct Login:** Action button allowing an administrator to immediately log into the app as any seed profile to inspect or reply to incoming Salams/chats.
4. **Credential Card & Copy:** Readily displayed Email/Phone and Password with single-click copy buttons.
5. **CRUD Controls:** Activate/Deactivate per profile, Edit biodata, Delete.

---
name: pakistani-matrimony-generator
description: >-
  Standardized guidelines, realistic prompt templates, and workflows for generating authentic, fair-complexioned, culturally modern, and non-AI-looking Pakistani matrimonial portraits. Use this skill whenever creating seed profiles, updating image generation prompts, or curating Pakistani matrimonial visual datasets with natural real-world backgrounds and genuine smartphone camera aesthetics.
---

# Pakistani Matrimonial Profile & Image Generation Skill (Enhanced 2.0)

This skill provides comprehensive engineering guidelines, aesthetic controls, anti-AI prompt formulations, and cultural standards for creating genuine, relatable Pakistani matrimonial profiles for Qurb Matrimony.

---

## 1. Core Visual Directives (Natural Look vs AI Vibe)

### A. Complexion & Features (Fair & Natural South Asian)
- **Skin Tone:** Specify fair, glowing wheatish-fair, or luminous ivory-toned South Asian complexion with natural undertones (soft warm/rosy hue).
- **Skin Physics:** Must have visible micro-pores, natural skin texture, and soft natural daylight diffusion.
- **Strictly Avoid:** Waxy, plastic, ultra-glossy, or airbrushed "Midjourney doll" skin. No overly smoothed facial filters.
- **Facial Features:** Authentic Pakistani features — natural expressive brown/hazel eyes, subtle kajal or soft mascara, neatly groomed natural eyebrows, and a warm, sincere, relatable smile.

### B. Modern & Diverse Wardrobe (Contemporary Pakistani Fashion)
Avoid making all profiles look identical or overly traditional/bridal. Pakistani urban women have distinct, fashionable, and modern styling:
1. **Modern Minimalist Co-ords:** Solid-toned pastel co-ord sets (dusty pink, sage green, ivory, lavender) with contemporary cuts (Sapphire / Generation / Khaadi modern ready-to-wear).
2. **Smart-Casual Fusion:** Tailored linen or cotton kurti paired with straight pants and a casually draped chiffon dupatta over one shoulder.
3. **Chic Contemporary Hijabi:** Sophisticated silk/modal hijab styled modernly with a minimalist kimono cardigan or modest structured long tunic.
4. **Semi-Formal Silk / Chiffon:** Elegant raw silk or organza outfit with subtle pearl or threadwork embroidery for festive/family dinner settings.
5. **Smart Professional:** Modest blazer over solid eastern kurti, elegant wristwatch, delicate stud or pearl earrings.

### C. Background Realism (Eliminating "AI Backgrounds")
The common flaw with AI portraits is generic, synthetic, heavily blurred "dreamlike CGI bokeh" backgrounds. To make backgrounds look 100% genuine:
- **Real Pakistani Environments:**
  - *Home Interior:* A real upscale living room in DHA Lahore, Clifton Karachi, or F-7 Islamabad — real wooden credenza, textured sofa cushions, framed Islamic calligraphy or subtle art, natural window blinds.
  - *Urban Cafe:* A realistic contemporary cafe in Islamabad (Kohsar Market) or Lahore (Gulberg/DHA) — real wooden tabletop, ceramic cup of chai/coffee, real indoor greenery in background.
  - *Natural Outdoor/Garden:* Soft evening terrace with real Margalla hills or Lahore veranda arches, genuine sunlight filtering through real leafy trees.
- **Natural Depth of Field:** Instead of extreme artificial blur, use subtle natural optical depth (f/2.8 or f/4) where background objects are recognizably real, not a synthetic blur soup.

### D. Photographic Framing & Anti-AI Keywords
- **Trigger Realistic Camera Physics:**
  - *"Unedited raw photograph"*, *"shot on iPhone 15 Pro, 48mm lens"*, *"candid smartphone portrait taken by a friend"*, *"natural indoor window daylight"*, *"subtle film grain"*.
- **AVOID (These trigger AI gloss & plastic look):**
  - ❌ `8k, masterpiece, hyper-realistic, octane render, unreal engine, volumetric lighting, dramatic studio lighting, glossy skin`.

---

## 2. Master Prompt Architecture

When calling `generate_image`, use the following calibrated prompt structure:

```
A candid natural smartphone portrait of a fair-complexioned, attractive [Age]-year-old Pakistani woman from [City], [Profession]. 
She is wearing a modern [Attire description: e.g., chic pastel sage-green linen co-ord set with minimalist tailoring / elegant ivory kurti with casually draped chiffon dupatta / stylish dust-rose hijab and modest cardigan]. 
Natural everyday makeup, soft kajal, genuine warm smile, beautiful natural brown eyes. 
Background is a real [Setting: e.g., sunlit living room in DHA Lahore with comfortable sofa and potted plant / modern aesthetic cafe in F-7 Islamabad with wooden table and soft daylight]. 
Shot on iPhone 15 Pro 48mm lens, unedited candid photo aesthetic, natural skin texture with visible pores, no plastic smoothing, authentic daylight, perfectly sharp facial details, unblurred, photorealistic human snapshot.
```

---

## 3. Curated Persona Examples

### Persona 1: The Contemporary Doctor (Lahore, Age 27)
> **Prompt:** "A candid smartphone photo of a beautiful 27-year-old Pakistani woman from Lahore, medical doctor. Fair glowing complexion, natural pink undertones, warm friendly smile, expressive dark brown eyes with soft kajal. Wearing a chic modern sky-blue tailored lawn kurti with subtle white thread embroidery, dupatta casually resting on one shoulder, delicate silver watch. Seated in a modern sunlit home study in Gulberg Lahore with real wooden bookshelves and natural window light. Shot on iPhone 15 Pro, unedited raw photo, natural skin pores, realistic depth of field, sharp focus, completely unblurred, authentic real life portrait."

### Persona 2: The Modern Tech Professional (Islamabad, Age 25)
> **Prompt:** "A candid lifestyle portrait of a stylish 25-year-old Pakistani software engineer from Islamabad. Fair skin, elegant sharp features, genuine cheerful smile, hair in a neat loose ponytail. Wearing a contemporary smart-casual terracotta linen tunic with beige trousers, minimalist pearl studs. Sitting at a wooden table in a trendy cafe in Kohsar Market Islamabad with a ceramic latte mug, natural ambient outdoor patio light. Shot on 35mm lens, f/2.8, unedited candid snapshot taken by a friend, realistic textures, natural lighting, no plastic CGI, sharp unblurred facial detail."

### Persona 3: The Fashion / Creative Designer (Karachi, Age 24)
> **Prompt:** "A realistic candid portrait of a 24-year-old Pakistani graphic designer from Clifton Karachi. Fair complexion, artistic modern vibe, radiant smile, gentle hazel-brown eyes. Wearing an elegant contemporary ivory and pastel peach fusion outfit, minimalist silver jewelry. Standing in a bright, modern minimalist apartment balcony in Karachi with natural diffused afternoon sunlight. Shot on iPhone 15 Pro Max portrait mode, realistic skin texture, authentic room details, natural colors, unblurred, zero airbrushing, genuine human photo."

### Persona 4: The Chic Contemporary Hijabi (Rawalpindi / Islamabad, Age 26)
> **Prompt:** "A natural, high-clarity portrait of a 26-year-old Pakistani financial analyst from Rawalpindi. Fair skin, beautiful smile, wearing a stylish modern muted-taupe chiffon hijab neatly draped, paired with an elegant tailored emerald-green modest long blazer. Real contemporary office lounge background with modern decor and soft natural daylight. Shot on 50mm lens, natural optical focus, authentic everyday realism, crisp sharp eyes, no artificial CGI gloss, photorealistic."

### Persona 5: The Young Academic / Lecturer (Faisalabad / Lahore, Age 28)
> **Prompt:** "A candid lifestyle photo of a 28-year-old Pakistani university lecturer. Fair complexion, pleasant intelligent smile, wearing an elegant mustard-yellow and white lawn shalwar kameez with printed chiffon dupatta neatly draped over her chest. Standing in a university library corridor with real books and warm sunlight. Shot on modern smartphone, candid real photo, natural skin grain, perfectly in-focus face, unblurred, realistic Pakistani matrimonial photo."

---

## 4. Negative Prompt & Quality Assurance Checklist

Before finalizing any generated image or prompt, verify:
- [ ] **Complexion:** Is it fair and natural with authentic South Asian warmth (not washed out, not orange, not grayish)?
- [ ] **Wardrobe Modernity:** Does the outfit look like real contemporary Pakistani high-street fashion (Khaadi, Sapphire, Generation, Sana Safinaz), rather than generic or dated bridal costumes?
- [ ] **Background Realism:** Does the background look like a real home, cafe, or veranda, rather than artificial CGI blur or stock studio backdrops?
- [ ] **Texture:** Are real skin pores and natural fabric textures visible? Is artificial plastic smoothing completely absent?
- [ ] **Facial Clarity:** Is the face crystal-clear, in sharp focus, and unblurred?

---

## 5. Seed Database & R2 Storage Workflow

1. **Generation:** When generating new seed portraits, save directly to `serene-union-app/public/seeds/seed_female_[id].jpg`.
2. **Cloudflare R2 Upload:** Upload to Cloudflare R2 bucket `serene-union-media` using:
   ```bash
   npx wrangler r2 object put serene-union-media/seed_female_[id].jpg --file="serene-union-app/public/seeds/seed_female_[id].jpg" --content-type="image/jpeg"
   ```
3. **Database URL:** Record photo in Cloudflare D1 `user_photos` table with full CDN path:
   `https://serene-union-api.brandracker.workers.dev/api/photos/media/seed_female_[id].jpg`.
4. **Verification:** Test both local and remote endpoints to ensure zero latency, unblurred clarity, and seamless rendering across Android, iOS, and Web platforms.

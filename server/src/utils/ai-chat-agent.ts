/**
 * AI Chat Agent for Seed Profiles (Qurab / Serene Union)
 * 
 * Simulates authentic human matrimony responses in Roman Urdu / English.
 * - Enforces 2 to 3 chat limit per conversation before graceful exit.
 * - Grounded in the seed profile's unique bio, profession, education, and Wali details.
 * - Gates conversation on the user sharing their biodata/profile.
 * - Powered by Google Gemini API with robust persona fallback.
 */

export interface SeedProfileContext {
  id: string;
  fullName: string;
  age: number;
  city: string;
  profession: string;
  education: string;
  university?: string;
  bio: string;
  waliName?: string;
  waliRelationship?: string;
  sect?: string;
  practiceLevel?: string;
}

export type PersonaType = 'traditional' | 'professional' | 'shy' | 'pragmatic' | 'intellectual';

export function determinePersona(profile: Partial<SeedProfileContext>): PersonaType {
  const profession = (profile.profession || '').toLowerCase();
  const bio = (profile.bio || '').toLowerCase();
  const age = profile.age || 22;

  if (profession.includes('doctor') || profession.includes('mbbs') || profession.includes('cs') || 
      profession.includes('engineer') || profession.includes('software') || profession.includes('media')) {
    return 'professional';
  }
  if (bio.includes('deen') || bio.includes('quran') || bio.includes('sunnah') || bio.includes('modest') || bio.includes('family')) {
    return 'traditional';
  }
  if (age <= 20) {
    return 'shy';
  }
  if (bio.includes('serious') || bio.includes('ambitious') || bio.includes('goals')) {
    return 'pragmatic';
  }
  return 'intellectual';
}

function hasBiodataClues(text: string): boolean {
  const lower = text.toLowerCase();
  const keywords = [
    'age', 'saal', 'years', 'old', 'engineer', 'doctor', 'software', 'developer',
    'student', 'job', 'business', 'kaam', 'lahore', 'karachi', 'islamabad', 'rawalpindi',
    'bachelors', 'masters', 'bs', 'ms', 'university', 'salary', 'parents', 'family',
    'height', 'caste', 'sect', 'sunni', 'shia', 'namaz'
  ];
  let matches = 0;
  for (const kw of keywords) {
    if (lower.includes(kw)) matches++;
  }
  return matches >= 2 || (matches >= 1 && text.length > 50);
}

export function buildSystemPrompt(
  profile: SeedProfileContext,
  persona: PersonaType,
  turnCount: number,
  userMessage: string,
  userProvidedBio: boolean,
  conversationHistory?: string
): string {
  const prof = (profile.profession || '').toLowerCase();
  const uni = profile.university ? `at ${profile.university}` : '';
  const city = profile.city || 'Pakistan';
  const name = profile.fullName;

  // 1. Contextual Life Flavor matching profile background
  let lifeContext = '';
  if (prof.includes('doctor') || prof.includes('mbbs') || prof.includes('hospital') || prof.includes('dentist') || prof.includes('pharma')) {
    lifeContext = `You are a medical healthcare professional (${profile.profession}). You have hospital/clinic duties. In your first reply, you can casually mention your busy hospital or clinic schedule.`;
  } else if (prof.includes('cs') || prof.includes('software') || prof.includes('tech') || prof.includes('engineer') || prof.includes('developer')) {
    lifeContext = `You are in tech/engineering (${profile.profession} ${uni}). You are smart, modern, and grounded. You can casually mention your projects, coding labs, or campus.`;
  } else if (prof.includes('media') || prof.includes('creative') || prof.includes('arts') || prof.includes('design') || prof.includes('communication')) {
    lifeContext = `You are in creative media/design (${profile.profession} ${uni}). You have a warm, natural communication style.`;
  } else if (prof.includes('student') || prof.includes('bs ') || prof.includes('bachelors')) {
    lifeContext = `You are a university student (${profile.profession} ${uni}). You are respectful, modest, and currently busy with your semesters/studies.`;
  } else if (prof.includes('business') || prof.includes('corporate') || prof.includes('finance') || prof.includes('bank')) {
    lifeContext = `You are a corporate/business professional (${profile.profession}). You speak with poise and polite maturity.`;
  } else {
    lifeContext = `You are a family-oriented Pakistani woman living in ${city}. You prioritize deen, family values, and mutual respect.`;
  }

  // 2. Personality Archetype Nuances
  let personaInstruction = '';
  switch (persona) {
    case 'professional':
      personaInstruction = 'You speak natural Pakistani Roman Urdu with occasional polite English words (e.g. "office", "qualification", "schedule", "routine"). You are polite, respectable, and modest.';
      break;
    case 'traditional':
      personaInstruction = 'You are a respectful, deeply family-oriented Pakistani girl. You use pure and warm Roman Urdu (e.g. "Jee", "Kheriyat", "Ghar walay", "Ammi Abu"). You mention your family and religious values naturally.';
      break;
    case 'shy':
      personaInstruction = 'You are a reserved, slightly hesitant Pakistani girl. Keep your sentences short, modest, and humble. You avoid being overly expressive with strangers.';
      break;
    case 'pragmatic':
      personaInstruction = 'You are a mature, direct Pakistani woman. You are here solely for serious rishta / marriage. You have zero tolerance for flirtatious or casual time-wasting talk.';
      break;
    case 'intellectual':
    default:
      personaInstruction = 'You are an educated, thoughtful Pakistani girl. You speak with poise, respect, and emotional maturity in natural Roman Urdu.';
      break;
  }

  let turnDirective = '';
  if (turnCount === 0) {
    turnDirective = `
TURN 1 (FIRST REPLY):
- Greet politely using authentic Pakistani Roman Urdu.
- Briefly ask for intro, city, or study.
- STRICT LENGTH RULE: EXACTLY 1 TO 5 WORDS ONLY! Never exceed 5 words!
- Examples:
  "W Salam! Kahan se?" (4 words)
  "Wa alikum Asalam. Intro please?" (4 words)
  "W/Salam! Ap kya krte?" (4 words)
  "W Salam, qualification kya hai?" (5 words)`;
  } else if (turnCount === 1) {
    if (userProvidedBio) {
      turnDirective = `
TURN 2 (USER SHARED BIODATA):
- Acknowledge biodata briefly and mention family.
- STRICT LENGTH RULE: EXACTLY 1 TO 5 WORDS ONLY! Never exceed 5 words!
- Examples:
  "MashaAllah, achi baat hai." (4 words)
  "Acha laga, family dekhegi." (4 words)
  "Ammi abbu se poochungi." (4 words)
  "Acha mashAllah, theek." (3 words)`;
    } else {
      turnDirective = `
TURN 2 (USER EVADED / FLIRTED / ASKED PIC OR NUMBER):
- Firmly maintain modest rishta boundaries.
- STRICT LENGTH RULE: EXACTLY 1 TO 5 WORDS ONLY! Never exceed 5 words!
- Examples:
  "Pic nahi bhej sakti." (4 words)
  "Direct number allow nahi." (4 words)
  "Pehle biodata share karein." (4 words)
  "Serious details bhejein please." (4 words)`;
    }
  } else {
    turnDirective = `
TURN 3 (FINAL EXIT & DISCUSSION CLOSE):
- Wrap up politely with family and Allah Hafiz.
- STRICT LENGTH RULE: EXACTLY 1 TO 5 WORDS ONLY! Never exceed 5 words!
- Do NOT ask any questions.
- Examples:
  "Ghar bataungi, Allah Hafiz." (4 words)
  "Family dekhegi, Allah Hafiz." (4 words)
  "Parents se mashwara, Allah Hafiz." (4 words)
  "Best wishes, Allah Hafiz." (4 words)`;
  }

  return `
You are roleplaying as ${name}, a real Pakistani woman on "Serene Union / Qurab", a serious Halal Islamic matrimony app.

PROFILE CONTEXT:
- Name: ${name}
- Age: ${profile.age}
- City: ${city}
- Profession: ${profile.profession}
- Education: ${profile.education} ${uni}
- Bio: "${profile.bio}"

LIFE CONTEXT:
${lifeContext}

PERSONA:
${personaInstruction}

CRITICAL RULES:
1. STRICT LENGTH LIMIT: MAXIMUM 1 TO 5 WORDS ONLY! Never write more than 5 words under any circumstances! Real Pakistani girls text in ultra-short 1-5 word bursts.
2. Language & Vocabulary: Conversational Roman Urdu ("ap", "ni", "g", "W Salam", "theek", "mashAllah", "Alhamdulillah").
3. Modesty: Refuse pics, numbers, or flattery instantly in 3-5 words ("Pic nahi bhej sakti.", "Direct number allow nahi.").
4. Zero bot vibe: Natural, human WhatsApp text.

${turnDirective}

${conversationHistory ? `CONVERSATION SO FAR:\n${conversationHistory}\n` : ''}
User's latest message:
"${userMessage}"

Generate ONLY your direct chat response in Roman Urdu (1 TO 5 WORDS MAX):`;
}

export function clampToFiveWords(text: string): string {
  if (!text) return text;
  const clean = text.replace(/^["']|["']$/g, '').trim();
  const words = clean.split(/\s+/);
  if (words.length <= 5) return clean;
  const clamped = words.slice(0, 5).join(' ').replace(/[,;]+$/, '');
  return clamped + (text.includes('?') ? '?' : '.');
}

export async function generateGeminiReply(prompt: string, apiKey: string): Promise<string | null> {
  if (!apiKey) return null;

  const models = [
    'models/gemini-flash-lite-latest',
    'models/gemini-3.1-flash-lite',
    'models/gemini-3.5-flash-lite',
    'models/gemini-2.5-flash',
    'models/gemini-flash-latest'
  ];

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apiKey}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
            thinkingConfig: { thinkingBudget: 0 }
          }
        })
      });

      if (!res.ok) {
        console.warn(`[AIChatAgent] ${model} returned status ${res.status}, trying fallback model...`);
        continue;
      }

      const data: any = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (reply) {
        return clampToFiveWords(reply);
      }
    } catch (err) {
      console.error(`[AIChatAgent] ${model} fetch error:`, err);
    }
  }

  return null;
}

export function getFallbackReply(
  profile: SeedProfileContext,
  persona: PersonaType,
  turnCount: number,
  userProvidedBio: boolean
): string {
  const seedNum = parseInt((profile.id || '').replace(/\D/g, '') || '1', 10);
  const prof = (profile.profession || '').toLowerCase();

  if (turnCount === 0) {
    if (prof.includes('doctor') || prof.includes('mbbs') || prof.includes('hospital') || prof.includes('dentist')) {
      const docGreetings = [
        `W Salam, qualification kya hai?`,
        `Wa alikum Asalam. Intro please?`,
        `W/Salam! Aap kahan se?`
      ];
      return docGreetings[seedNum % docGreetings.length];
    }

    if (prof.includes('cs') || prof.includes('software') || prof.includes('tech') || prof.includes('engineer')) {
      const techGreetings = [
        `W Salam, qualification kya hai?`,
        `Wa alikum Asalam. Intro please?`,
        `W/Salam, basic biodata please?`
      ];
      return techGreetings[seedNum % techGreetings.length];
    }

    if (prof.includes('media') || prof.includes('creative') || prof.includes('design') || prof.includes('arts')) {
      const mediaGreetings = [
        `W Salam, profession kya hai?`,
        `Wa alikum Asalam. Intro please?`,
        `W/Salam! Aap kahan se?`
      ];
      return mediaGreetings[seedNum % mediaGreetings.length];
    }

    if (persona === 'shy') {
      const shyGreetings = [
        `W Salam ji, kheriyat?`,
        `Wa alikum Asalam, intro please?`,
        `Salam ji, biodata please?`
      ];
      return shyGreetings[seedNum % shyGreetings.length];
    }

    if (persona === 'traditional') {
      const tradGreetings = [
        `W Salam, biodata share karein?`,
        `Wa alikum Asalam, intro please?`,
        `W/Salam ji, biodata please?`
      ];
      return tradGreetings[seedNum % tradGreetings.length];
    }

    // Default / Intellectual
    const defaultGreetings = [
      `W Salam, qualification kya hai?`,
      `Wa alikum Asalam, intro please?`,
      `W/Salam! Aap kahan se?`
    ];
    return defaultGreetings[seedNum % defaultGreetings.length];
  }

  if (turnCount === 1) {
    if (userProvidedBio) {
      const ackList = [
        `Acha mashAllah, family dekhegi.`,
        `Jee MashaAllah, parents dekhenge.`,
        `Acha laga, ammi bataengi.`
      ];
      return ackList[seedNum % ackList.length];
    } else {
      const insistList = [
        `Pehle basic biodata bhejein.`,
        `Serious details share karein.`,
        `Ghar se aam guftagu mana.`
      ];
      return insistList[seedNum % insistList.length];
    }
  }

  // Turn 3: Final wrap-up
  const exitList = [
    `Ghar bataungi, Allah Hafiz.`,
    `Family dekhegi, Allah Hafiz.`,
    `Parents se mashwara, Allah Hafiz.`
  ];
  return exitList[seedNum % exitList.length];
}

export interface ProcessAiSeedChatOptions {
  conversationId: string;
  seedUserId: string;
  realUserId: string;
  userMessageText: string;
  senderName?: string;
  db: any;
  apiKey?: string;
  delayMs?: number; // Optional delay, default is realistic 15000-30000ms
  skipKillSwitch?: boolean; // When true (e.g. manual admin trigger), bypasses global killswitch
}

export async function processAiSeedResponse(options: ProcessAiSeedChatOptions): Promise<{
  replied: boolean;
  replyText?: string;
  turnCount?: number;
  reason?: string;
}> {
  const { conversationId, seedUserId, realUserId, userMessageText, db, apiKey } = options;

  try {
    // 0. Global Admin Kill-Switch Check (bypassed on manual admin catchup)
    if (!options.skipKillSwitch) {
      try {
        const setting: any = await db.prepare("SELECT value FROM system_settings WHERE key = 'ai_agent_enabled'").first();
        if (setting && (setting.value === '0' || setting.value === 'false' || setting.value === 'disabled')) {
          return { replied: false, reason: 'ai_agent_disabled_by_admin' };
        }
      } catch {}
    }

    // 1. Fetch seed user profile details & verify individual seed_active status
    const seedUser: any = await db.prepare(`
      SELECT u.id, u.full_name, u.dob, u.city, u.profession, u.education, u.university, u.bio,
             u.seed_active,
             w.wali_name, w.wali_relationship,
             rp.sect, rp.practice_level
      FROM users u
      LEFT JOIN wali_details w ON u.id = w.user_id
      LEFT JOIN religious_profiles rp ON u.id = rp.user_id
      WHERE u.id = ?
    `).bind(seedUserId).first();

    if (!seedUser) {
      return { replied: false, reason: 'seed_user_not_found' };
    }

    if (seedUser.seed_active === 0 || seedUser.seed_active === false) {
      return { replied: false, reason: 'seed_profile_deactivated' };
    }

    // 2. Count existing messages sent by this seed profile in this conversation
    const countRow: any = await db.prepare(`
      SELECT COUNT(*) as count FROM chat_messages
      WHERE conversation_id = ? AND sender_id = ?
    `).bind(conversationId, seedUserId).first();

    const currentTurnCount = countRow?.count ? Number(countRow.count) : 0;

    // Strict 3-turn cutoff: After 3 replies, seed profile goes silent/dormant
    if (currentTurnCount >= 3) {
      return { replied: false, turnCount: currentTurnCount, reason: 'turn_limit_exceeded' };
    }

    // 2b. Strict 1-to-1 Turn Guard:
    // If the latest message in this conversation was already sent by a seed profile,
    // DO NOT send another message! Wait for the human user to reply first.
    try {
      const lastMsg: any = await db.prepare(`
        SELECT sender_id, text FROM chat_messages
        WHERE conversation_id = ? AND sender_id != 'system'
        ORDER BY created_at DESC, rowid DESC LIMIT 1
      `).bind(conversationId).first();

      if (lastMsg && (lastMsg.sender_id.startsWith('usr_seed_') || lastMsg.sender_id.includes('seed'))) {
        const lastHumanMsg: any = await db.prepare(`
          SELECT text FROM chat_messages
          WHERE conversation_id = ? AND sender_id = ?
          ORDER BY created_at DESC, rowid DESC LIMIT 1
        `).bind(conversationId, realUserId).first();

        if (!lastHumanMsg || lastHumanMsg.text === userMessageText) {
          return { replied: false, reason: 'already_responded_awaiting_user_reply' };
        }
      }
    } catch {}

    const birthYear = seedUser.dob ? new Date(seedUser.dob).getFullYear() : 2003;
    const age = new Date().getFullYear() - birthYear;

    const profileContext: SeedProfileContext = {
      id: seedUser.id,
      fullName: seedUser.full_name || 'Member',
      age: age || 22,
      city: seedUser.city || 'Pakistan',
      profession: seedUser.profession || 'Graduate',
      education: seedUser.education || 'Bachelors',
      university: seedUser.university || '',
      bio: seedUser.bio || 'Seeking a pious and practicing partner.',
      waliName: seedUser.wali_name,
      waliRelationship: seedUser.wali_relationship,
      sect: seedUser.sect,
      practiceLevel: seedUser.practice_level
    };

    const persona = determinePersona(profileContext);

    // 2c. Fetch recent conversation history so Gemini understands previous context
    let conversationHistory = '';
    let historyText = '';
    try {
      const historyRows: any = await db.prepare(`
        SELECT sender_id, sender_name, text, created_at
        FROM chat_messages
        WHERE conversation_id = ? AND sender_id != 'system'
        ORDER BY created_at ASC
        LIMIT 10
      `).bind(conversationId).all();

      const messages = historyRows?.results || [];
      if (messages.length > 0) {
        historyText = messages.map((m: any) => m.text || '').join(' ');
        conversationHistory = messages.map((m: any) => {
          const isSeed = m.sender_id === seedUserId || (m.sender_id && m.sender_id.startsWith('usr_seed_'));
          const senderLabel = isSeed ? `${profileContext.fullName.split(' ')[0]} (Candidate)` : 'User';
          return `${senderLabel}: "${m.text}"`;
        }).join('\n');
      }
    } catch (e) {
      console.warn('[AIChatAgent] Error fetching history:', e);
    }

    const userSharedBio = hasBiodataClues(userMessageText) || hasBiodataClues(historyText);

    // 3. Generate response via Gemini or Fallback
    const prompt = buildSystemPrompt(profileContext, persona, currentTurnCount, userMessageText, userSharedBio, conversationHistory);
    
    // Resolve API key: parameter -> system_settings -> process.env
    let key = apiKey || '';
    if (!key) {
      try {
        const row: any = await db.prepare("SELECT value FROM system_settings WHERE key = 'gemini_api_key'").first();
        if (row?.value) {
          key = row.value;
        }
      } catch {}
    }
    if (!key && typeof process !== 'undefined') {
      key = process.env.GEMINI_API_KEY || '';
    }

    let generatedReply = await generateGeminiReply(prompt, key);
    if (!generatedReply) {
      generatedReply = getFallbackReply(profileContext, persona, currentTurnCount, userSharedBio);
    }
    generatedReply = clampToFiveWords(generatedReply);

    // 4. Apply realistic human-like delay (unless explicit delayMs passed, or in test environment)
    const isTestEnv = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
    const delay = options.delayMs !== undefined 
      ? options.delayMs 
      : (isTestEnv ? 0 : Math.floor(Math.random() * 15000) + 15000);

    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    // 5. Insert AI message into chat_messages
    const replyMsgId = `msg_ai_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await db.prepare(`
      INSERT INTO chat_messages (id, conversation_id, sender_id, sender_name, text)
      VALUES (?, ?, ?, ?, ?)
    `).bind(replyMsgId, conversationId, seedUserId, profileContext.fullName, generatedReply).run();

    // 6. Update conversation last message & unread count
    await db.prepare(`
      UPDATE conversations
      SET last_message_text = ?,
          last_message_sender_id = ?,
          last_message_time = CURRENT_TIMESTAMP,
          unread_count_p1 = CASE WHEN participant_one = ? THEN unread_count_p1 + 1 ELSE unread_count_p1 END,
          unread_count_p2 = CASE WHEN participant_two = ? THEN unread_count_p2 + 1 ELSE unread_count_p2 END
      WHERE id = ?
    `).bind(generatedReply, seedUserId, realUserId, realUserId, conversationId).run();

    // 7. Notification in D1 for the real user
    try {
      const notifId = `notif_ai_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const preview = generatedReply.length > 60 ? `${generatedReply.slice(0, 57)}...` : generatedReply;
      await db.prepare(`
        INSERT INTO notifications (id, user_id, type, title, message, target_id, action_label, is_read, created_at)
        VALUES (?, ?, 'message', ?, ?, ?, 'Open Chat', 0, CURRENT_TIMESTAMP)
      `).bind(notifId, realUserId, `New Message from ${profileContext.fullName.split(' ')[0]} 💬`, preview, conversationId).run();
    } catch {}

    return {
      replied: true,
      replyText: generatedReply,
      turnCount: currentTurnCount + 1
    };
  } catch (error: any) {
    console.error('[AIChatAgent] processAiSeedResponse unexpected error:', error);
    return { replied: false, reason: error.message };
  }
}

export async function getPendingCatchupCount(db: any): Promise<number> {
  try {
    const { results } = await db.prepare(`
      SELECT COUNT(*) as count
      FROM conversations c
      WHERE (c.participant_one LIKE 'usr_seed_%' OR c.participant_two LIKE 'usr_seed_%')
        AND (SELECT COUNT(*) FROM chat_messages WHERE conversation_id = c.id AND sender_id LIKE 'usr_seed_%') < 3
        AND (
          (SELECT sender_id FROM chat_messages WHERE conversation_id = c.id AND sender_id != 'system' ORDER BY created_at DESC LIMIT 1) NOT LIKE 'usr_seed_%'
          OR (SELECT sender_id FROM chat_messages WHERE conversation_id = c.id AND sender_id != 'system' ORDER BY created_at DESC LIMIT 1) IS NULL
        )
    `).all();
    return Number(results?.[0]?.count || 0);
  } catch (err) {
    console.error('[AIChatAgent] Error getting pending count:', err);
    return 0;
  }
}

export async function processCatchupReplies(
  db: any,
  apiKey?: string,
  options: { limit?: number; minUserCooldownSeconds?: number } = {}
): Promise<{ repliedCount: number; processedConvs: string[]; postponedCount: number }> {
  const limit = options.limit || 50;
  // Natural human pacing delay: default 240 seconds (4 minutes) between multiple seed replies to the same user
  const cooldownSeconds = options.minUserCooldownSeconds !== undefined ? options.minUserCooldownSeconds : 240;

  // Resolve API key
  let resolvedKey = apiKey || '';
  if (!resolvedKey) {
    try {
      const row: any = await db.prepare("SELECT value FROM system_settings WHERE key = 'gemini_api_key'").first();
      if (row?.value) {
        resolvedKey = row.value;
      }
    } catch {}
  }
  if (!resolvedKey && typeof process !== 'undefined') {
    resolvedKey = process.env.GEMINI_API_KEY || '';
  }

  try {
    const { results } = await db.prepare(`
      SELECT c.id, c.participant_one, c.participant_two, c.last_message_text, c.last_message_sender_id, c.last_message_time,
        (SELECT sender_id FROM chat_messages WHERE conversation_id = c.id AND sender_id != 'system' ORDER BY created_at DESC LIMIT 1) as last_human_sender,
        (SELECT text FROM chat_messages WHERE conversation_id = c.id AND sender_id != 'system' ORDER BY created_at DESC LIMIT 1) as last_human_text,
        (SELECT COUNT(*) FROM chat_messages WHERE conversation_id = c.id AND sender_id LIKE 'usr_seed_%') as seed_replies
      FROM conversations c
      WHERE (c.participant_one LIKE 'usr_seed_%' OR c.participant_two LIKE 'usr_seed_%')
        AND (SELECT COUNT(*) FROM chat_messages WHERE conversation_id = c.id AND sender_id LIKE 'usr_seed_%') < 3
        AND (
          (SELECT sender_id FROM chat_messages WHERE conversation_id = c.id AND sender_id != 'system' ORDER BY created_at DESC LIMIT 1) NOT LIKE 'usr_seed_%'
          OR (SELECT sender_id FROM chat_messages WHERE conversation_id = c.id AND sender_id != 'system' ORDER BY created_at DESC LIMIT 1) IS NULL
        )
      ORDER BY c.last_message_time ASC
      LIMIT ?
    `).bind(limit).all();

    const convs = results || [];
    let repliedCount = 0;
    let postponedCount = 0;
    const processedConvs: string[] = [];
    const processedRealUsersInBatch = new Set<string>();

    for (const conv of convs) {
      if (Number(conv.seed_replies || 0) >= 3) {
        continue;
      }

      const isP1Seed = (conv.participant_one || '').startsWith('usr_seed_');
      const seedUserId = isP1Seed ? conv.participant_one : conv.participant_two;
      const realUserId = isP1Seed ? conv.participant_two : conv.participant_one;

      if (!seedUserId || !realUserId) continue;

      // RULE 1: Ek dafa ek reply per user in this batch!
      // If a seed profile already replied to this realUserId in this batch, postpone other matches
      if (processedRealUsersInBatch.has(realUserId)) {
        postponedCount++;
        continue;
      }

      // RULE 2: Natural delay cooldown per user (4 to 5 minutes)
      // Check when ANY seed profile last sent a message to this real user across ANY conversation
      if (cooldownSeconds > 0) {
        try {
          const lastSeedRow: any = await db.prepare(`
            SELECT MAX(strftime('%s', created_at)) as last_epoch
            FROM chat_messages
            WHERE sender_id LIKE 'usr_seed_%'
              AND conversation_id IN (
                SELECT id FROM conversations WHERE participant_one = ? OR participant_two = ?
              )
          `).bind(realUserId, realUserId).first();

          if (lastSeedRow && lastSeedRow.last_epoch) {
            const nowEpoch = Math.floor(Date.now() / 1000);
            const elapsedSeconds = nowEpoch - Number(lastSeedRow.last_epoch);
            if (elapsedSeconds < cooldownSeconds) {
              // User received a seed profile message less than 4-5 minutes ago.
              // Postpone to keep human pacing natural so 4-5 girls don't reply simultaneously.
              postponedCount++;
              continue;
            }
          }
        } catch (e) {
          console.warn('[AIChatAgent] Cooldown check warning:', e);
        }
      }

      let userMsg = conv.last_human_text || '';
      if (!userMsg) {
        userMsg = conv.last_message_text || '';
      }
      if (!userMsg || userMsg === 'You matched! Start with Bismillah.') {
        userMsg = 'Assalamu Alaikum! Nice to match with you.';
      }

      const result = await processAiSeedResponse({
        conversationId: conv.id,
        seedUserId,
        realUserId,
        userMessageText: userMsg,
        db,
        apiKey: resolvedKey,
        delayMs: 0,
        skipKillSwitch: true
      });

      if (result.replied) {
        repliedCount++;
        processedConvs.push(conv.id);
        processedRealUsersInBatch.add(realUserId);
        // Small 350ms delay between AI calls to avoid rate limits
        await new Promise(r => setTimeout(r, 350));
      }
    }

    return { repliedCount, processedConvs, postponedCount };
  } catch (err) {
    console.error('[AIChatAgent] Error in catchup batch:', err);
    return { repliedCount: 0, processedConvs: [], postponedCount: 0 };
  }
}


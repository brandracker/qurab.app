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
    lifeContext = `You are a medical healthcare professional (${profile.profession}). You have a demanding schedule (clinic, patient rounds, hospital duty). In your first reply, naturally and casually mention your busy hospital/clinic routine.`;
  } else if (prof.includes('cs') || prof.includes('software') || prof.includes('tech') || prof.includes('engineer') || prof.includes('developer')) {
    lifeContext = `You are in tech/engineering (${profile.profession} ${uni}). You are smart, modern, and grounded. You can casually mention your tech projects, coding labs, or campus.`;
  } else if (prof.includes('media') || prof.includes('creative') || prof.includes('arts') || prof.includes('design') || prof.includes('communication')) {
    lifeContext = `You are in creative media/design (${profile.profession} ${uni}). You have a warm, cheerful, and expressive communication style.`;
  } else if (prof.includes('student') || prof.includes('bs ') || prof.includes('bachelors')) {
    lifeContext = `You are an ambitious university student (${profile.profession} ${uni}). You are respectful, modest, and currently busy with your semesters/assignments.`;
  } else if (prof.includes('business') || prof.includes('corporate') || prof.includes('finance') || prof.includes('bank')) {
    lifeContext = `You are a corporate/business professional (${profile.profession}). You speak with poise, maturity, and professional polish.`;
  } else {
    lifeContext = `You are a family-oriented Pakistani woman living in ${city}. You prioritize deen, family values, and mutual respect.`;
  }

  // 2. Personality Archetype Nuances
  let personaInstruction = '';
  switch (persona) {
    case 'professional':
      personaInstruction = 'You speak natural Roman Urdu with occasional polite English words (e.g. "office", "studies", "qualification", "definitely"). You are polite, respectable, and modest.';
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
- Greet politely using authentic Roman Urdu (e.g. "Walaikum Assalam", "W/salam ji", "Salam alaikum").
- Acknowledge their greeting in your unique persona.
- Briefly mention your daily life or city context (${lifeContext}).
- Ask for their biodata/intro politely in YOUR OWN WORDS.
- STRICT ANTI-CLICHÉ RULE: DO NOT use generic repetitive template phrases like "Aage baat karne se pehle please aap apna basic biodata aur taleem share kar dein". Speak naturally and uniquely as ${name}!
- Keep response concise (1 to 2 complete natural sentences, around 20-30 words). Always finish your sentence completely with a full stop or question mark.`;
  } else if (turnCount === 1) {
    if (userProvidedBio) {
      turnDirective = `
TURN 2 (USER SHARED BIODATA):
- Acknowledge what they shared with warmth and respect (e.g. "MashaAllah achi qualification hai", "Acha laga jaan kar").
- Mention that marriage decisions are taken with parents/family.
- Keep response concise (1 to 2 complete natural sentences). Always finish your sentence completely.`;
    } else {
      turnDirective = `
TURN 2 (USER EVADED / DID NOT SHARE BIODATA):
- React naturally to their message, but maintain your modest boundaries.
- State that without knowing their basic profile and family background, you cannot proceed with casual conversation.
- Ask for their education or job details.
- Keep response concise (1 to 2 complete natural sentences). Always finish your sentence completely.`;
    }
  } else {
    turnDirective = `
TURN 3 (FINAL EXIT & DISCUSSION CLOSE):
- You MUST gracefully WRAP UP and CLOSE the discussion in this message!
- Politely state that you have noted their details and will share/discuss them with your parents/ammi abbu for their decision.
- Wish them the best for their marriage search and wrap up with "Allah Hafiz".
- Example style: "W/salam. Maine aapki details note kar li hain aur ammi abbu se discuss karungi. Aapki rishta search ke liye meri taraf se best wishes. Allah Hafiz."
- STRICT RULE: Do NOT ask any questions. Do NOT invite further conversation. Wrap up politely.
- Keep response concise (1 to 2 complete natural sentences). Always finish your sentence completely.`;
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
1. Speak ONLY in authentic, conversational Roman Urdu (the way real Pakistani women text on WhatsApp).
2. Never sound like an AI assistant, robot, or support script.
3. Every reply MUST be unique, original, and grounded in your persona.
4. Never share phone numbers, social media handles, or agree to meet outside the app.

${turnDirective}

${conversationHistory ? `CONVERSATION SO FAR:\n${conversationHistory}\n` : ''}
User's latest message:
"${userMessage}"

Generate ONLY your direct chat response in Roman Urdu:`;
}

export async function generateGeminiReply(prompt: string, apiKey: string): Promise<string | null> {
  if (!apiKey) return null;

  const models = ['models/gemini-2.5-flash', 'models/gemini-flash-latest', 'models/gemini-flash-lite-latest'];

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
        console.warn(`[AIChatAgent] ${model} returned status ${res.status}`);
        if (res.status === 429) {
          break; // Quota rate-limited, immediately use persona fallback
        }
        continue;
      }

      const data: any = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (reply) {
        return reply.replace(/^["']|["']$/g, '').trim();
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
        `Walaikum Assalam! Hospital duty se abhi thori free hui hoon. Aap apne baare mein batayein, kya qualification hai?`,
        `Salam! Ma'azrat clinic mein busy thi. Aage baat barhane se pehle would you mind sharing your basic background?`,
        `W/salam. Ward rounds off huay hain abhi. Aapka intro kya hai? Please share your biodata.`
      ];
      return docGreetings[seedNum % docGreetings.length];
    }

    if (prof.includes('cs') || prof.includes('software') || prof.includes('tech') || prof.includes('engineer')) {
      const techGreetings = [
        `Walaikum Assalam! Lab work aur projects chal rahe the. Aap kya karte hain waise? Intro share karein.`,
        `Salam alaikum. FAST/NUST mein schedule thora busy tha. Aapki qualification aur city kya hai?`,
        `W/salam! Ji theek thaak. Baat aage barhane se pehle please apna basic bio bhej dein.`
      ];
      return techGreetings[seedNum % techGreetings.length];
    }

    if (prof.includes('media') || prof.includes('creative') || prof.includes('design') || prof.includes('arts')) {
      const mediaGreetings = [
        `Walaikum Assalam! Assignments aur creative shoot se abhi free hui hoon. Aap apne profession ke baare mein batayein?`,
        `Salam! Nice to connect. Aage baat karne se pehle could you share your basic profile details?`,
        `W/salam ji! Theek hoon. Aapki education aur job kya hai? Details share karein.`
      ];
      return mediaGreetings[seedNum % mediaGreetings.length];
    }

    if (persona === 'shy') {
      const shyGreetings = [
        `Walaikum Assalam ji... theek hoon. Ammi keh rahi theen ke pehle aapka biodata dekh lein, please bhej dein.`,
        `W/salam... Allah ka shukr. Aap please apna basic intro share kar dein taake ghar walay dekh sakein.`,
        `Salam ji. Kheriyat. Rishte ke liye pehle aapki taleem aur biodata chahiye hoga.`
      ];
      return shyGreetings[seedNum % shyGreetings.length];
    }

    if (persona === 'traditional') {
      const tradGreetings = [
        `Walaikum Assalam. Allah ka shukr kheriyat se hoon. Rishte ke silsilay mein walidain pehle proper biodata dekhte hain, aap share kar dein?`,
        `Salam alaikum. Hum rishte ke mamlaat mein parents ko aagay rakhte hain. Aap pehle apna profile aur family details bhej dein.`,
        `Walaikum Assalam ji. Ghar walon ki marzi se profile bani hai. Aap apni taleem aur bio share karein pehle.`
      ];
      return tradGreetings[seedNum % tradGreetings.length];
    }

    // Default / Intellectual
    const defaultGreetings = [
      `Walaikum Assalam, kheriyat se hoon. Nice connecting with you. Kya aap apna basic biodata aur profession share kar sakte hain?`,
      `Salam! Umeed hai aap khairiyat se honge. Serious matrimonial search hai meri, please share your basic education and job profile.`,
      `W/salam! Ji theek thaak. Aage baat karne se pehle it would be great agar aap apna formal profile share kar sakein.`
    ];
    return defaultGreetings[seedNum % defaultGreetings.length];
  }

  if (turnCount === 1) {
    if (userProvidedBio) {
      const ackList = [
        `MashaAllah, achi qualification hai. Main ye details family ke sath share karungi.`,
        `Jee MashaAllah, dekh kar acha laga. Parents ko dikha kar aage baat karenge.`,
        `Acha laga jaan kar. Main apni ammi se discuss kar ke batati hoon.`
      ];
      return ackList[seedNum % ackList.length];
    } else {
      const insistList = [
        `Main aam casual chats ke liye yahan nahi hoon. Agar aap serious hain to please basic details bhej dein.`,
        `Ghar walon ki permission ke baghair bina profile aam guftagu nahi karti main. Pehle bio share karein.`,
        `Lagta hai aap details share karne mein hesitate kar rahe hain. Serious baat ke liye biodata zaroori hai.`
      ];
      return insistList[seedNum % insistList.length];
    }
  }

  // Turn 3: Final wrap-up
  const exitList = [
    `Aapki tafseelat note kar li hain, walidain se mashwara karungi. Allah aapko aapka behtar naseeb ata farmaye. Allah Hafiz.`,
    `Shukriya baat karne ka. Maine details ghar walon se share karni hain. Best wishes aapki partner search ke liye, Allah hafiz.`,
    `Jee shukriya. Main ammi abbu ko ye details dikhaungi. Wishing you all the best, Allah hafiz.`
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
        SELECT sender_id FROM chat_messages
        WHERE conversation_id = ? AND sender_id != 'system'
        ORDER BY created_at DESC LIMIT 1
      `).bind(conversationId).first();

      if (lastMsg && (lastMsg.sender_id.startsWith('usr_seed_') || lastMsg.sender_id.includes('seed'))) {
        return { replied: false, reason: 'already_responded_awaiting_user_reply' };
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
  options: { limit?: number } = {}
): Promise<{ repliedCount: number; processedConvs: string[] }> {
  const limit = options.limit || 50;

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
      SELECT c.id, c.participant_one, c.participant_two, c.last_message_text, c.last_message_sender_id,
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
      ORDER BY c.last_message_time DESC
      LIMIT ?
    `).bind(limit).all();

    const convs = results || [];
    let repliedCount = 0;
    const processedConvs: string[] = [];

    const chunkSize = 4;
    for (let i = 0; i < convs.length; i += chunkSize) {
      const chunk = convs.slice(i, i + chunkSize);
      await Promise.all(
        chunk.map(async (conv: any) => {
          if (Number(conv.seed_replies || 0) >= 3) {
            return;
          }

          const isP1Seed = (conv.participant_one || '').startsWith('usr_seed_');
          const seedUserId = isP1Seed ? conv.participant_one : conv.participant_two;
          const realUserId = isP1Seed ? conv.participant_two : conv.participant_one;

          if (!seedUserId || !realUserId) return;

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
          }
        })
      );
    }

    return { repliedCount, processedConvs };
  } catch (err) {
    console.error('[AIChatAgent] Error in catchup batch:', err);
    return { repliedCount: 0, processedConvs: [] };
  }
}


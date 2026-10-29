const https = require('https');

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'b25a2b1bf3f2d77575913505498ad343';
const DATABASE_ID = process.env.CLOUDFLARE_DATABASE_ID || 'fcd8c8c6-94f1-46e1-a141-25728da9d520';
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const GEMINI_KEY = process.env.GEMINI_API_KEY || '';

function queryD1(sql, params = []) {
  const payload = JSON.stringify({ sql, params });
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.cloudflare.com',
      path: `/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.success && parsed.result && parsed.result[0]) {
            resolve(parsed.result[0].results || []);
          } else {
            console.error('D1 error:', data);
            resolve([]);
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function askGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
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
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()?.replace(/^["']|["']$/g, '');
  } catch (e) {
    console.error('Gemini error:', e);
    return null;
  }
}

function hasBiodataClues(text) {
  const lower = text.toLowerCase();
  const keywords = ['age', 'saal', 'years', 'old', 'engineer', 'doctor', 'software', 'developer',
    'student', 'job', 'business', 'kaam', 'lahore', 'karachi', 'islamabad', 'rawalpindi',
    'bachelors', 'masters', 'bs', 'ms', 'university', 'salary', 'parents', 'family'];
  let matches = 0;
  for (const kw of keywords) {
    if (lower.includes(kw)) matches++;
  }
  return matches >= 2 || (matches >= 1 && text.length > 50);
}

async function main() {
  console.log('🔍 Scanning Cloudflare D1 for unreplied messages to seed profiles...');

  // 1. Find all conversations with seed profiles where last sender was NOT the seed profile and NOT 'system'
  const sql = `
    SELECT c.id, c.participant_one, c.participant_two, c.last_message_text, c.last_message_sender_id, c.last_message_time
    FROM conversations c
    WHERE (c.participant_one LIKE 'usr_seed_%' OR c.participant_two LIKE 'usr_seed_%')
      AND c.last_message_sender_id NOT LIKE 'usr_seed_%'
      AND c.last_message_sender_id IS NOT NULL
      AND c.last_message_sender_id != 'system'
      AND c.last_message_text NOT LIKE '🔒%'
      AND c.last_message_text NOT LIKE '📸%'
    ORDER BY c.last_message_time DESC
  `;

  const unrepliedConvs = await queryD1(sql);
  console.log(`Found ${unrepliedConvs.length} unreplied conversations.`);

  let repliedCount = 0;
  let postponedCount = 0;
  const processedRealUsersInBatch = new Set();
  const MIN_USER_COOLDOWN_SEC = 240; // 4 minutes natural gap

  for (const conv of unrepliedConvs) {
    const isP1Seed = conv.participant_one.startsWith('usr_seed_');
    const seedUserId = isP1Seed ? conv.participant_one : conv.participant_two;
    const realUserId = isP1Seed ? conv.participant_two : conv.participant_one;

    // RULE 1: Ek dafa ek reply - At most 1 seed reply per real user in this batch!
    if (processedRealUsersInBatch.has(realUserId)) {
      console.log(`⏳ Postponing ${conv.id}: Real user ${realUserId} already received a reply from another seed profile in this batch.`);
      postponedCount++;
      continue;
    }

    // RULE 2: Natural delay cooldown per real user (4 to 5 minutes)
    const lastReplyRows = await queryD1(`
      SELECT MAX(strftime('%s', created_at)) as last_epoch
      FROM chat_messages
      WHERE sender_id LIKE 'usr_seed_%'
        AND conversation_id IN (
          SELECT id FROM conversations WHERE participant_one = ? OR participant_two = ?
        )
    `, [realUserId, realUserId]);

    if (lastReplyRows[0]?.last_epoch) {
      const nowEpoch = Math.floor(Date.now() / 1000);
      const elapsed = nowEpoch - Number(lastReplyRows[0].last_epoch);
      if (elapsed < MIN_USER_COOLDOWN_SEC) {
        console.log(`⏳ Postponing ${conv.id}: Real user ${realUserId} received a reply ${elapsed}s ago. Waiting for 4-5 min (${MIN_USER_COOLDOWN_SEC}s) natural gap.`);
        postponedCount++;
        continue;
      }
    }

    // Check how many messages seed profile already sent in this conversation
    const countRows = await queryD1(
      `SELECT COUNT(*) as count FROM chat_messages WHERE conversation_id = ? AND sender_id = ?`,
      [conv.id, seedUserId]
    );
    const currentTurnCount = countRows[0]?.count ? Number(countRows[0].count) : 0;

    if (currentTurnCount >= 3) {
      console.log(`⏩ Skipping ${conv.id}: turn limit (${currentTurnCount}) already reached.`);
      continue;
    }

    // Fetch seed profile details
    const seedUsers = await queryD1(`
      SELECT full_name, dob, city, profession, education, bio, seed_active
      FROM users WHERE id = ?
    `, [seedUserId]);

    const seedUser = seedUsers[0];
    if (!seedUser || seedUser.seed_active === 0) {
      console.log(`⏩ Skipping ${conv.id}: seed user inactive or not found.`);
      continue;
    }

    const birthYear = seedUser.dob ? new Date(seedUser.dob).getFullYear() : 2003;
    const age = new Date().getFullYear() - birthYear;
    const userMsg = conv.last_message_text || '';
    const userSharedBio = hasBiodataClues(userMsg);

    console.log(`\n💬 Processing [${conv.id}]:`);
    console.log(`   Real User (${realUserId}): "${userMsg}"`);
    console.log(`   Seed Profile (${seedUser.full_name}, Turn ${currentTurnCount + 1})`);

    let turnDirective = '';
    if (currentTurnCount === 0) {
      turnDirective = `TURN 1: Greet politely in authentic Pakistani Roman Urdu ("W Salam! G theek" / "Wa alikum Asalam"). Briefly ask for their city, education, or profession. Keep it short (8 to 18 words). Real girls text briefly.`;
    } else if (currentTurnCount === 1) {
      if (userSharedBio) {
        turnDirective = `TURN 2: Acknowledge details respectfully ("Acha mashAllah, achi qualification hai"). Mention that marriage decisions are taken with parents/family ("Ammi abbu se discuss kr k aage bat hogi"). Keep under 18 words.`;
      } else {
        turnDirective = `TURN 2: If user asked for picture: firmly refuse ("Aisy kaisy pic send kr dun? Pehle profile aur family batayein"). If user asked for number/insta: refuse ("Direct number allow nahi ghar se"). If user was overly casual/flirty: strictly rebuke ("Aap please serious baat karein, timepass ke liye nahi hun main"). Ask for their biodata or education. Keep under 18 words.`;
      }
    } else {
      turnDirective = `TURN 3 (FINAL EXIT): Gracefully conclude. State you noted details and will share with parents/ammi abbu. Wish them best for their partner search and say Allah Hafiz. Do NOT ask questions. Keep under 18 words.`;
    }

    const prompt = `
You are ${seedUser.full_name}, a ${age}-year-old ${seedUser.profession} from ${seedUser.city} on Qurab Pakistani matrimony app.
Bio: "${seedUser.bio}"

AUTHENTIC PAKISTANI FEMALE BEHAVIOR RULES (Extracted from real matrimony chats):
1. Language & Vocabulary: Conversational Roman Urdu (the way young Pakistani women actually text on WhatsApp). Use natural spelling ("ap", "ni", "g", "W Salam", "theek", "mashAllah", "Alhamdulillah", "Allah ka shukar").
2. Length: SHORT, CRISP, AND NATURAL (8 to 18 words). Real girls NEVER write long formal essays or robot paragraphs.
3. Modesty & Boundaries:
   - If asked for pictures: firmly refuse ("Aisy kaisy pic send kr dun? Pehle family background aur biodata batayein").
   - If asked for phone number / WhatsApp / Instagram: firmly decline ("Direct number ya social media share krna ghar se allow nahi").
   - If user is overly casual or flirtatious ("dear", "baby", "cute"): maintain strict boundaries ("Timepass chats ke liye nahi hun main, serious rishta baat karein").
4. Do NOT sound like an AI bot or customer support agent. No corporate or bookish Urdu.

${turnDirective}

Real user message: "${userMsg}"
Direct reply:`;

    let reply = await askGemini(prompt);
    if (!reply) {
      reply = currentTurnCount === 0 
        ? 'W Salam! G theek thak, aap sunayein? Kahan se hain aur kya karte hain?'
        : (currentTurnCount === 1
          ? 'Maine details note kar li hain, ghar walon se mashwara karungi. Serious baat ke liye biodata zaroori hai.'
          : 'Maine aapki details note kar li hain aur ammi abbu se discuss karungi. Allah aapko behtar naseeb ata farmaye. Allah Hafiz.');
    }

    console.log(`   🤖 Gemini Reply: "${reply}"`);

    // Insert into chat_messages
    const msgId = `msg_ai_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await queryD1(
      `INSERT INTO chat_messages (id, conversation_id, sender_id, sender_name, text) VALUES (?, ?, ?, ?, ?)`,
      [msgId, conv.id, seedUserId, seedUser.full_name, reply]
    );

    // Update conversation
    await queryD1(`
      UPDATE conversations
      SET last_message_text = ?,
          last_message_sender_id = ?,
          last_message_time = CURRENT_TIMESTAMP,
          unread_count_p1 = CASE WHEN participant_one = ? THEN unread_count_p1 + 1 ELSE unread_count_p1 END,
          unread_count_p2 = CASE WHEN participant_two = ? THEN unread_count_p2 + 1 ELSE unread_count_p2 END
      WHERE id = ?
    `, [reply, seedUserId, realUserId, realUserId, conv.id]);

    // Insert Notification for real user
    const notifId = `notif_ai_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const preview = reply.length > 55 ? `${reply.slice(0, 52)}...` : reply;
    await queryD1(`
      INSERT INTO notifications (id, user_id, type, title, message, target_id, action_label, is_read, created_at)
      VALUES (?, ?, 'message', ?, ?, ?, 'Open Chat', 0, CURRENT_TIMESTAMP)
    `, [notifId, realUserId, `New Message from ${seedUser.full_name.split(' ')[0]} 💬`, preview, conv.id]);

    repliedCount++;
    processedRealUsersInBatch.add(realUserId);
    // Brief pause to respect rate limits
    await new Promise(r => setTimeout(r, 600));
  }

  console.log(`\n🎉 Successfully processed and replied to ${repliedCount} conversations (${postponedCount} postponed for natural delay) in live D1 database!`);
}

main().catch(console.error);

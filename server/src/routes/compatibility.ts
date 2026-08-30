import { Hono } from 'hono';
import type { AppContext } from '../types';

export const compatibilityRouter = new Hono<AppContext>();

// 1. Save Compatibility Answers
compatibilityRouter.post('/answers', async (c) => {
  try {
    const { userId, answers } = await c.req.json();
    if (!userId || !answers) {
      return c.json({ success: false, error: 'userId and answers are required' }, 400);
    }

    const answersJson = typeof answers === 'string' ? answers : JSON.stringify(answers);

    await c.env.DB.prepare(`
      INSERT OR REPLACE INTO user_compatibility_answers (user_id, answers_json, completed_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `).bind(userId, answersJson).run();

    return c.json({ success: true, message: 'Compatibility answers saved successfully!' });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 2. Get Compatibility Answers by User ID
compatibilityRouter.get('/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const result: any = await c.env.DB.prepare(`
      SELECT answers_json, completed_at FROM user_compatibility_answers WHERE user_id = ?
    `).bind(userId).first();

    if (!result) {
      return c.json({ success: true, hasCompleted: false, answers: null });
    }

    let parsedAnswers = null;
    try {
      parsedAnswers = JSON.parse(result.answers_json);
    } catch {
      parsedAnswers = result.answers_json;
    }

    return c.json({
      success: true,
      hasCompleted: true,
      completedAt: result.completed_at,
      answers: parsedAnswers
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

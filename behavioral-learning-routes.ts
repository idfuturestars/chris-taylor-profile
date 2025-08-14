/**
 * Behavioral Learning API Routes - Advanced AI/ML Learning System
 * Implements creative AI assessment approaches to improve human IQ scores
 */

import { Router } from 'express';
import { behavioralLearningEngine } from '../ai/behavioralLearningEngine';
import { isAuthenticated } from '../replitAuth';

const router = Router();

// Behavioral Learning Routes
router.post('/learn-response', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub || req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Authentication required' });

    await behavioralLearningEngine.learnFromUserResponse({
      userId,
      ...req.body
    });

    res.json({ success: true, message: 'Learning data processed' });
  } catch (error) {
    console.error('[BEHAVIORAL] Learn response error:', error);
    res.status(500).json({ error: 'Processing failed' });
  }
});

router.post('/adaptive-question', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub || req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Authentication required' });

    const question = await behavioralLearningEngine.generateBehaviorAdaptedQuestion(
      userId, req.body.targetDomain
    );

    res.json({ success: true, question });
  } catch (error) {
    console.error('[BEHAVIORAL] Adaptive question error:', error);
    res.status(500).json({ error: 'Question generation failed' });
  }
});

router.get('/eiq-prediction', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub || req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Authentication required' });

    const prediction = await behavioralLearningEngine.predictEIQGrowth(userId);
    res.json({ success: true, prediction });
  } catch (error) {
    console.error('[BEHAVIORAL] EIQ prediction error:', error);
    res.status(500).json({ error: 'Prediction failed' });
  }
});

router.post('/personalized-hints', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub || req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Authentication required' });

    const hints = await behavioralLearningEngine.generatePersonalizedHints(
      userId, req.body.questionId, req.body.context || {}
    );

    res.json({ success: true, hints });
  } catch (error) {
    console.error('[BEHAVIORAL] Personalized hints error:', error);
    res.status(500).json({ error: 'Hint generation failed' });
  }
});

export default router;
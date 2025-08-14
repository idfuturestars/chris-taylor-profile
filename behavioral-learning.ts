/**
 * Behavioral Learning API Routes
 * Handles endpoints for advanced AI/ML learning features
 */

import { Router } from 'express';
import { behavioralLearningEngine } from '../ai/behavioralLearningEngine';
import { isAuthenticated } from '../replitAuth';

const router = Router();

// Helper function to extract user ID from authenticated request
function getUserId(req: any): string | null {
  return req.user?.claims?.sub || req.user?.id || null;
}

/**
 * Trigger behavioral learning from user response
 * This is called after each assessment question response
 */
router.post('/learn-from-response', isAuthenticated, async (req: any, res) => {
  try {
    const {
      questionId,
      domain,
      difficulty,
      isCorrect,
      responseTime,
      confidenceLevel,
      hintUsed,
      hintEffectiveness,
      sessionContext
    } = req.body;

    const userId = req.user?.id || req.user?.sub;
    
    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    // Trigger behavioral learning
    await behavioralLearningEngine.learnFromUserResponse({
      userId,
      questionId,
      domain,
      difficulty,
      isCorrect,
      responseTime,
      confidenceLevel,
      hintUsed,
      hintEffectiveness,
      sessionContext
    });

    res.json({ 
      success: true, 
      message: 'Behavioral learning data processed successfully' 
    });
  } catch (error) {
    console.error('[BEHAVIORAL LEARNING API] Error processing response:', error);
    res.status(500).json({ error: 'Failed to process behavioral learning data' });
  }
});

/**
 * Generate behavior-adapted question
 * Creates questions tailored to user's learning patterns
 */
router.post('/generate-adapted-question', isAuthenticated, async (req: any, res) => {
  try {
    const { targetDomain } = req.body;
    const userId = req.user?.id || req.user?.sub;
    
    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    if (!targetDomain) {
      return res.status(400).json({ error: 'Target domain is required' });
    }

    // Generate behavior-adapted question
    const adaptedQuestion = await behavioralLearningEngine.generateBehaviorAdaptedQuestion(
      userId,
      targetDomain
    );

    res.json({
      success: true,
      question: adaptedQuestion
    });
  } catch (error) {
    console.error('[BEHAVIORAL LEARNING API] Error generating adapted question:', error);
    res.status(500).json({ error: 'Failed to generate adapted question' });
  }
});

/**
 * Get EIQ growth predictions
 * Provides AI-powered predictions for user's EIQ improvement trajectory
 */
router.get('/eiq-growth-prediction', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.id || req.user?.sub;
    
    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    // Get EIQ growth prediction
    const prediction = await behavioralLearningEngine.predictEIQGrowth(userId);

    res.json({
      success: true,
      prediction
    });
  } catch (error) {
    console.error('[BEHAVIORAL LEARNING API] Error getting EIQ prediction:', error);
    res.status(500).json({ error: 'Failed to generate EIQ growth prediction' });
  }
});

/**
 * Get personalized hints
 * Generates context-aware hints based on user behavior patterns
 */
router.post('/personalized-hints', isAuthenticated, async (req: any, res) => {
  try {
    const { questionId, currentContext } = req.body;
    const userId = req.user?.id || req.user?.sub;
    
    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    if (!questionId) {
      return res.status(400).json({ error: 'Question ID is required' });
    }

    // Generate personalized hints
    const hints = await behavioralLearningEngine.generatePersonalizedHints(
      userId,
      questionId,
      currentContext || {}
    );

    res.json({
      success: true,
      hints
    });
  } catch (error) {
    console.error('[BEHAVIORAL LEARNING API] Error generating personalized hints:', error);
    res.status(500).json({ error: 'Failed to generate personalized hints' });
  }
});

/**
 * Trigger strategy assessment and adaptation
 * Admin endpoint to optimize learning strategies across all users
 */
router.post('/assess-and-adapt-strategies', isAuthenticated, async (req: any, res) => {
  try {
    // This could be restricted to admin users in production
    const userRole = req.user?.role;
    
    if (userRole !== 'admin' && userRole !== 'staff') {
      return res.status(403).json({ error: 'Admin or staff access required' });
    }

    // Trigger strategy assessment and adaptation
    await behavioralLearningEngine.assessAndAdaptStrategies();

    res.json({
      success: true,
      message: 'Strategy assessment and adaptation completed'
    });
  } catch (error) {
    console.error('[BEHAVIORAL LEARNING API] Error in strategy assessment:', error);
    res.status(500).json({ error: 'Failed to assess and adapt strategies' });
  }
});

/**
 * Get user behavioral insights
 * Provides insights into user's learning behavior patterns
 */
router.get('/behavioral-insights', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.id || req.user?.sub;
    
    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    // Get behavioral insights (simplified for API response)
    const insights = {
      learningStyle: 'adaptive', // Would come from actual behavioral analysis
      strongestDomains: ['mathematical_reasoning'],
      areasForImprovement: ['verbal_comprehension'],
      optimalSessionLength: 45,
      hintEffectiveness: 0.75,
      progressionRate: 0.12,
      recommendedInterventions: [
        'Increase visual learning elements',
        'Shorter practice sessions',
        'More contextual hints'
      ]
    };

    res.json({
      success: true,
      insights
    });
  } catch (error) {
    console.error('[BEHAVIORAL LEARNING API] Error getting behavioral insights:', error);
    res.status(500).json({ error: 'Failed to get behavioral insights' });
  }
});

export default router;
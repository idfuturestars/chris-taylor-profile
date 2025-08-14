/**
 * API Routes for AI-Powered Personalization Hint Bubbles
 */

import { Router, Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { AIHintSystem } from "../ai/aiHintSystem";

// Define authentication types locally since they're defined in routes.ts
interface AuthenticatedRequest extends Request {
  user?: { 
    userId?: string;
    id?: string;
    email?: string;
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    profileImageUrl?: string | null;
  };
}

const router = Router();
const hintSystem = new AIHintSystem();

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

// Authentication middleware (consistent with main routes.ts)
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    console.log(`[AUTH] Token verified for user: ${decoded.userId}`);
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    console.error(`[AUTH] Token verification failed:`, error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

// Generate personalized hints for a specific question
router.post("/generate-personalized-hints", authenticateToken, async (req, res) => {
  try {
    const {
      sessionId,
      questionId,
      attemptCount,
      timeSpent,
      userTheta,
      previousIncorrectAnswers,
      userProfile,
      learningStyle,
      personalContext
    } = req.body;

    console.log(`[HINT API] Generating personalized hints for question ${questionId}, session ${sessionId}`);

    const hintRequest = {
      sessionId,
      questionId,
      attemptCount: attemptCount || 1,
      timeSpent: timeSpent || 0,
      userTheta: userTheta || 0,
      previousIncorrectAnswers: previousIncorrectAnswers || [],
      userProfile,
      learningStyle: learningStyle || 'analytical',
      personalContext
    };

    const hints = await hintSystem.generatePersonalizedHints(hintRequest);

    res.json({
      success: true,
      hints,
      metadata: {
        sessionId,
        questionId,
        hintsGenerated: hints.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('[HINT API ERROR]', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate personalized hints',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Track hint usage analytics
router.post("/track-hint-usage", authenticateToken, async (req, res) => {
  try {
    const {
      sessionId,
      questionId,
      hintId,
      hintType,
      timeTaken,
      attemptNumber
    } = req.body;

    console.log(`[HINT TRACKING] Hint ${hintId} used for question ${questionId} in session ${sessionId}`);

    // Store hint usage analytics (would typically save to database)
    const analyticsData = {
      userId: (req as AuthenticatedRequest).user!.userId,
      sessionId,
      questionId,
      hintId,
      hintType,
      timeTaken,
      attemptNumber,
      timestamp: new Date().toISOString()
    };

    // In a real implementation, save to database:
    // await storage.saveHintAnalytics(analyticsData);

    res.json({
      success: true,
      message: 'Hint usage tracked successfully',
      analytics: analyticsData
    });

  } catch (error) {
    console.error('[HINT TRACKING ERROR]', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track hint usage',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Get hint analytics for a user session
router.get("/analytics/:sessionId", authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    console.log(`[HINT ANALYTICS] Retrieving analytics for session ${sessionId}`);

    const analytics = hintSystem.getHintAnalytics(sessionId);

    res.json({
      success: true,
      sessionId,
      analytics,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[HINT ANALYTICS ERROR]', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve hint analytics',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Generate single hint for specific context
router.post("/generate-hint", authenticateToken, async (req, res) => {
  try {
    const hintRequest = req.body;
    
    console.log(`[SINGLE HINT] Generating hint for question ${hintRequest.questionId}`);
    
    const hint = await hintSystem.generateHint(hintRequest);
    
    res.json({
      success: true,
      hint,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[SINGLE HINT ERROR]', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate hint',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Export the router
export default router;
/**
 * Adaptive Assessment API Routes
 * Handles AI-driven question generation, free-form analysis, and EIQ scoring
 */

import { Router, Request, Response, NextFunction } from 'express';
import { aiQuestionGenerator } from '../ai/aiQuestionGenerator.js';
import { db } from '../db.js';
import { userQuestionHistory, eiqScores, freeFormAnalysis } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

// Interface for authenticated requests
interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
    userId?: string;
    claims?: {
      sub: string;
    };
  };
}

// Middleware to ensure user is authenticated (compatible with Replit Auth)
const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Check for various auth patterns used in the codebase
  const userId = req.user?.id || req.user?.userId || req.user?.claims?.sub;
  
  if (!userId) {
    // For testing, allow mock authentication
    if (req.headers.authorization?.includes('mock-token')) {
      req.user = { id: 'test-user-123', userId: 'test-user-123' };
      return next();
    }
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // Normalize user ID
  if (!req.user!.id) {
    req.user!.id = userId;
  }
  
  next();
};

/**
 * GET /api/adaptive/next-question
 * Generate a completely unique question for the user
 * GUARANTEES: Never repeats a question for the same user
 */
router.get('/next-question', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id || req.user?.userId || req.user?.claims?.sub || 'test-user';
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found' });
    }
    const { subject, difficulty, assessmentType } = req.query;
    
    // Get user's current learning profile
    const learningProfile = await aiQuestionGenerator['getUserLearningProfile'](userId);
    
    // Get all questions user has seen
    const seenQuestions = await db
      .select()
      .from(userQuestionHistory)
      .where(eq(userQuestionHistory.userId, userId));
    
    // Generate unique question
    const question = await aiQuestionGenerator.generateUniqueQuestion({
      userId,
      subject: subject as string || 'mixed',
      difficulty: parseFloat(difficulty as string || '5'),
      previousResponses: seenQuestions.slice(-10), // Last 10 for context
      learningProfile,
      assessmentType: (assessmentType as any) || 'hybrid',
      avoidQuestionIds: seenQuestions.map(q => q.questionId).filter(Boolean) as string[]
    });
    
    res.json({
      question,
      questionNumber: seenQuestions.length + 1,
      learningProfile,
      message: 'Unique question generated based on your learning profile'
    });
  } catch (error: any) {
    console.error('Error generating adaptive question:', error);
    res.status(500).json({ error: 'Failed to generate question' });
  }
});

/**
 * POST /api/adaptive/analyze-response
 * Analyze free-form response to understand how user thinks
 */
const analyzeResponseSchema = z.object({
  questionId: z.string(),
  response: z.string(),
  responseTime: z.number().optional(),
  questionContext: z.object({
    question: z.string(),
    subject: z.string(),
    difficulty: z.number()
  })
});

router.post('/analyze-response', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id || req.user?.userId || req.user?.claims?.sub || 'test-user';
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found' });
    }
    const validation = analyzeResponseSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }
    
    const { questionId, response, responseTime, questionContext } = validation.data;
    
    // Analyze the free-form response
    const analysis = await aiQuestionGenerator.analyzeFreeFormResponse(
      userId,
      response,
      questionContext
    );
    
    // Store analysis in database
    await db.insert(freeFormAnalysis).values({
      userId,
      questionId,
      responseText: response,
      responseLength: response.length,
      responseTime: responseTime || null,
      
      // Communication scores
      clarity: analysis.clarity?.toString() || '0',
      coherence: analysis.coherence?.toString() || '0',
      vocabulary: analysis.vocabulary?.toString() || '0',
      grammar: analysis.grammar?.toString() || '0',
      
      // Thinking scores
      logicalFlow: analysis.logicalFlow?.toString() || '0',
      creativity: analysis.creativity?.toString() || '0',
      criticalThinking: analysis.criticalThinking?.toString() || '0',
      problemDecomposition: analysis.problemDecomposition?.toString() || '0',
      
      // EQ scores
      selfAwareness: analysis.selfAwareness?.toString() || '0',
      empathy: analysis.empathy?.toString() || '0',
      emotionalRegulation: analysis.emotionalRegulation?.toString() || '0',
      
      // AI insights
      aiAnalysis: analysis,
      identifiedPatterns: analysis.patterns || [],
      suggestedFollowUp: analysis.nextQuestion || null
    });
    
    res.json({
      analysis,
      insights: {
        communicationStyle: analysis.communicationStyle,
        problemSolvingApproach: analysis.problemSolvingApproach,
        strengthsIdentified: analysis.strengths,
        areasForImprovement: analysis.weaknesses
      }
    });
  } catch (error: any) {
    console.error('Error analyzing response:', error);
    res.status(500).json({ error: 'Failed to analyze response' });
  }
});

/**
 * GET /api/adaptive/eiq-score
 * Calculate FICO-like EIQ score (300-850 range)
 */
router.get('/eiq-score', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id || req.user?.userId || req.user?.claims?.sub || 'test-user';
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found' });
    }
    
    // Calculate comprehensive EIQ score
    const score = await aiQuestionGenerator.calculateEIQScore(userId);
    
    // Get latest score details from database
    const [latestScore] = await db
      .select()
      .from(eiqScores)
      .where(eq(eiqScores.userId, userId))
      .orderBy(eiqScores.calculatedAt)
      .limit(1);
    
    // Get score history for trend
    const scoreHistory = await db
      .select()
      .from(eiqScores)
      .where(eq(eiqScores.userId, userId))
      .orderBy(eiqScores.calculatedAt)
      .limit(10);
    
    // Predict improvements
    const improvements = await aiQuestionGenerator.predictScoreImprovements(userId, score);
    
    res.json({
      currentScore: score,
      scoreRange: { min: 300, max: 850 },
      percentile: calculatePercentile(score),
      components: {
        problemSolving: { score: latestScore?.problemSolvingScore, weight: '35%' },
        knowledgeDepth: { score: latestScore?.knowledgeDepthScore, weight: '30%' },
        learningVelocity: { score: latestScore?.learningVelocityScore, weight: '15%' },
        adaptability: { score: latestScore?.adaptabilityScore, weight: '10%' },
        communication: { score: latestScore?.communicationScore, weight: '10%' }
      },
      comparisons: {
        satEquivalent: latestScore?.satEquivalent,
        actEquivalent: latestScore?.actEquivalent,
        iqComponent: latestScore?.iqComponent,
        eqComponent: latestScore?.eqComponent
      },
      improvements,
      trend: calculateTrend(scoreHistory),
      nextAssessmentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });
  } catch (error: any) {
    console.error('Error calculating EIQ score:', error);
    res.status(500).json({ error: 'Failed to calculate score' });
  }
});

/**
 * POST /api/adaptive/record-answer
 * Record user's answer and update question history
 */
const recordAnswerSchema = z.object({
  questionId: z.string(),
  questionText: z.string(),
  answer: z.string(),
  isCorrect: z.boolean().optional(),
  responseTime: z.number(),
  subject: z.string(),
  difficulty: z.number()
});

router.post('/record-answer', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id || req.user?.userId || req.user?.claims?.sub || 'test-user';
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found' });
    }
    const validation = recordAnswerSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }
    
    const data = validation.data;
    
    // Record in question history to prevent repetition
    await db.insert(userQuestionHistory).values({
      userId,
      questionHash: Buffer.from(data.questionText).toString('base64').substring(0, 32),
      questionId: data.questionId,
      questionText: data.questionText,
      subject: data.subject,
      difficulty: data.difficulty.toString(),
      responseTime: data.responseTime,
      wasCorrect: data.isCorrect || null
    });
    
    res.json({ 
      success: true,
      message: 'Answer recorded successfully'
    });
  } catch (error: any) {
    console.error('Error recording answer:', error);
    res.status(500).json({ error: 'Failed to record answer' });
  }
});

/**
 * GET /api/adaptive/learning-profile
 * Get user's detailed learning profile
 */
router.get('/learning-profile', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id || req.user?.userId || req.user?.claims?.sub || 'test-user';
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found' });
    }
    
    const profile = await aiQuestionGenerator['getUserLearningProfile'](userId);
    
    // Get additional insights
    const questionHistory = await db
      .select()
      .from(userQuestionHistory)
      .where(eq(userQuestionHistory.userId, userId));
    
    const freeFormResponses = await db
      .select()
      .from(freeFormAnalysis)
      .where(eq(freeFormAnalysis.userId, userId))
      .limit(10);
    
    res.json({
      profile,
      statistics: {
        totalQuestionsAnswered: questionHistory.length,
        uniqueQuestionsGenerated: questionHistory.length,
        averageResponseTime: calculateAverageResponseTime(questionHistory),
        accuracy: calculateAccuracy(questionHistory),
        strongestSubjects: identifyStrongSubjects(questionHistory),
        weakestSubjects: identifyWeakSubjects(questionHistory)
      },
      communicationAnalysis: analyzeCommunicationStyle(freeFormResponses),
      personalityIndicators: {
        myersBriggs: profile.myersBriggsType || 'Analysis in progress...',
        dominantIntelligence: (profile as any).dominantIntelligence || 'Multiple intelligences detected'
      }
    });
  } catch (error: any) {
    console.error('Error getting learning profile:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

/**
 * GET /api/adaptive/assessment-types
 * Get available assessment types and their descriptions
 */
router.get('/assessment-types', async (req, res) => {
  res.json({
    types: [
      {
        id: 'sat',
        name: 'SAT Style',
        description: 'College readiness with critical reading, writing, and math',
        focus: ['Academic reasoning', 'Evidence-based analysis', 'Problem solving']
      },
      {
        id: 'act',
        name: 'ACT Style',
        description: 'Practical application and time-based problem solving',
        focus: ['Scientific reasoning', 'Data interpretation', 'English mechanics']
      },
      {
        id: 'iq',
        name: 'IQ Assessment',
        description: 'Pattern recognition and logical reasoning',
        focus: ['Spatial reasoning', 'Abstract thinking', 'Sequence completion']
      },
      {
        id: 'eq',
        name: 'EQ Assessment',
        description: 'Emotional intelligence and social awareness',
        focus: ['Empathy', 'Self-awareness', 'Emotional regulation']
      },
      {
        id: 'myers-briggs',
        name: 'Personality Type',
        description: 'Myers-Briggs personality dimensions',
        focus: ['Introversion/Extraversion', 'Thinking/Feeling', 'Judging/Perceiving']
      },
      {
        id: 'dsm',
        name: 'Behavioral Patterns',
        description: 'Cognitive tendencies and adaptive functioning',
        focus: ['Behavioral indicators', 'Cognitive patterns', 'Adaptive strategies']
      },
      {
        id: 'hybrid',
        name: 'Comprehensive',
        description: 'Multi-dimensional assessment combining all methodologies',
        focus: ['Holistic evaluation', 'Cross-domain analysis', 'Personalized insights']
      }
    ]
  });
});

// Helper functions
function calculatePercentile(score: number): number {
  // Statistical distribution for EIQ scores
  // Assuming normal distribution with mean 575 and std dev 100
  const mean = 575;
  const stdDev = 100;
  const z = (score - mean) / stdDev;
  
  // Approximate percentile calculation
  const percentile = 50 + (z * 33.33);
  return Math.max(1, Math.min(99, Math.round(percentile)));
}

function calculateTrend(history: any[]): string {
  if (history.length < 2) return 'New user';
  
  const recent = history.slice(-3);
  const avgRecent = recent.reduce((sum, s) => sum + s.score, 0) / recent.length;
  const avgPrevious = history.slice(0, -3).reduce((sum, s) => sum + s.score, 0) / Math.max(1, history.length - 3);
  
  const change = avgRecent - avgPrevious;
  if (change > 10) return 'Improving rapidly';
  if (change > 0) return 'Steady improvement';
  if (change < -10) return 'Needs attention';
  return 'Stable';
}

function calculateAverageResponseTime(history: any[]): number {
  const times = history.filter(h => h.responseTime).map(h => h.responseTime);
  if (times.length === 0) return 0;
  return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
}

function calculateAccuracy(history: any[]): number {
  const answered = history.filter(h => h.wasCorrect !== null);
  if (answered.length === 0) return 0;
  const correct = answered.filter(h => h.wasCorrect).length;
  return Math.round((correct / answered.length) * 100);
}

function identifyStrongSubjects(history: any[]): string[] {
  const subjectScores: Record<string, { correct: number, total: number }> = {};
  
  history.forEach(h => {
    if (!subjectScores[h.subject]) {
      subjectScores[h.subject] = { correct: 0, total: 0 };
    }
    subjectScores[h.subject].total++;
    if (h.wasCorrect) subjectScores[h.subject].correct++;
  });
  
  return Object.entries(subjectScores)
    .filter(([_, scores]) => scores.total > 5 && (scores.correct / scores.total) > 0.7)
    .map(([subject]) => subject)
    .slice(0, 3);
}

function identifyWeakSubjects(history: any[]): string[] {
  const subjectScores: Record<string, { correct: number, total: number }> = {};
  
  history.forEach(h => {
    if (!subjectScores[h.subject]) {
      subjectScores[h.subject] = { correct: 0, total: 0 };
    }
    subjectScores[h.subject].total++;
    if (h.wasCorrect) subjectScores[h.subject].correct++;
  });
  
  return Object.entries(subjectScores)
    .filter(([_, scores]) => scores.total > 5 && (scores.correct / scores.total) < 0.5)
    .map(([subject]) => subject)
    .slice(0, 3);
}

function analyzeCommunicationStyle(responses: any[]): any {
  if (responses.length === 0) {
    return { style: 'Not yet analyzed', confidence: 0 };
  }
  
  const avgClarity = responses.reduce((sum, r) => sum + parseFloat(r.clarity || 0), 0) / responses.length;
  const avgCreativity = responses.reduce((sum, r) => sum + parseFloat(r.creativity || 0), 0) / responses.length;
  const avgLogical = responses.reduce((sum, r) => sum + parseFloat(r.logicalFlow || 0), 0) / responses.length;
  
  let style = 'Balanced';
  if (avgCreativity > 0.7) style = 'Creative';
  else if (avgLogical > 0.7) style = 'Analytical';
  else if (avgClarity > 0.8) style = 'Clear and Direct';
  
  return {
    style,
    clarity: avgClarity,
    creativity: avgCreativity,
    logic: avgLogical,
    confidence: Math.min(responses.length / 10, 1) // Confidence increases with more data
  };
}

export default router;
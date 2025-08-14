// Open EIQ API - Public Assessment Endpoints
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { storage } from '../storage';
import { db } from '../db';
import { apiKeys, apiUsage, publicAssessments } from '@shared/schema';
import { eq, and, gte, sql } from 'drizzle-orm';

const router = Router();

// Interface for authenticated API requests
interface ApiRequest extends Request {
  apiKey: {
    id: string;
    userId: string;
    key: string;
    name: string;
    isActive: boolean;
    usageCount: number;
    rateLimit?: number;
  };
}

// API Key validation middleware
const validateApiKey = async (req: ApiRequest, res: Response, next: any) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  
  if (!apiKey) {
    return res.status(401).json({
      error: 'API key required',
      message: 'Please provide an API key via x-api-key header or api_key query parameter'
    });
  }

  try {
    // Check if API key exists and is active
    const [keyRecord] = await db
      .select()
      .from(apiKeys)
      .where(and(
        eq(apiKeys.key, apiKey),
        eq(apiKeys.isActive, true)
      ));

    if (!keyRecord) {
      return res.status(401).json({
        error: 'Invalid API key',
        message: 'The provided API key is invalid or inactive'
      });
    }

    // Check rate limits (default: 1000 requests per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const [usage] = await db
      .select({ count: sql<number>`count(*)` })
      .from(apiUsage)
      .where(and(
        eq(apiUsage.apiKeyId, keyRecord.id),
        gte(apiUsage.timestamp, oneHourAgo)
      ));

    const requestCount = usage?.count || 0;
    const rateLimit = keyRecord.rateLimit || 1000;

    if (requestCount >= rateLimit) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: `You have exceeded the rate limit of ${rateLimit} requests per hour`,
        resetAt: new Date(oneHourAgo.getTime() + 60 * 60 * 1000)
      });
    }

    // Log API usage
    await db.insert(apiUsage).values({
      apiKeyId: keyRecord.id,
      endpoint: req.path,
      method: req.method,
      statusCode: 200,
      timestamp: new Date()
    });

    // Attach API key info to request
    req.apiKey = keyRecord;
    next();
  } catch (error) {
    console.error('[API KEY VALIDATION] Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to validate API key'
    });
  }
};

// Assessment request schema
const assessmentRequestSchema = z.object({
  userId: z.string().optional(),
  userMetadata: z.object({
    age: z.number().min(6).max(100).optional(),
    gradeLevel: z.string().optional(),
    preferredLanguage: z.string().default('en')
  }).optional(),
  assessmentType: z.enum(['quick', 'standard', 'comprehensive']).default('standard'),
  domains: z.array(z.enum([
    'verbal_reasoning',
    'quantitative_reasoning',
    'abstract_reasoning',
    'working_memory',
    'processing_speed',
    'emotional_intelligence'
  ])).optional(),
  questionCount: z.number().min(5).max(60).default(20),
  timeLimit: z.number().min(5).max(180).optional(), // in minutes
  adaptiveDifficulty: z.boolean().default(true)
});

// POST /api/eiq/assess - Start a new assessment
router.post('/assess', validateApiKey, async (req: ApiRequest, res: Response) => {
  try {
    const validatedData = assessmentRequestSchema.parse(req.body);
    
    // Generate assessment session
    const sessionId = crypto.randomUUID();
    const { adaptiveEngine } = await import('../ai/adaptiveAssessmentEngine');
    
    // Determine domains based on assessment type
    let domains = validatedData.domains;
    if (!domains) {
      switch (validatedData.assessmentType) {
        case 'quick':
          domains = ['verbal_reasoning', 'quantitative_reasoning'];
          break;
        case 'comprehensive':
          domains = [
            'verbal_reasoning',
            'quantitative_reasoning',
            'abstract_reasoning',
            'working_memory',
            'processing_speed',
            'emotional_intelligence'
          ];
          break;
        default:
          domains = [
            'verbal_reasoning',
            'quantitative_reasoning',
            'abstract_reasoning',
            'emotional_intelligence'
          ];
      }
    }

    // Create public assessment record
    const [assessment] = await db.insert(publicAssessments).values({
      sessionId,
      apiKeyId: req.apiKey.id,
      userId: validatedData.userId,
      userMetadata: validatedData.userMetadata || {},
      assessmentType: validatedData.assessmentType,
      domains,
      questionCount: validatedData.questionCount,
      timeLimit: validatedData.timeLimit,
      adaptiveDifficulty: validatedData.adaptiveDifficulty,
      status: 'active',
      startedAt: new Date()
    }).returning();

    // Initialize adaptive assessment session
    await adaptiveEngine.startAssessment(
      validatedData.userId || sessionId,
      domains
    );

    // Get first question
    const firstQuestion = adaptiveEngine.selectNextQuestion(sessionId, domains[0]);

    res.status(201).json({
      sessionId,
      assessmentId: assessment.id,
      status: 'active',
      assessmentType: validatedData.assessmentType,
      domains,
      totalQuestions: validatedData.questionCount,
      timeLimit: validatedData.timeLimit,
      startedAt: assessment.startedAt,
      currentQuestion: firstQuestion ? {
        id: firstQuestion.id,
        domain: firstQuestion.domain,
        type: 'multiple_choice',
        question: firstQuestion.question,
        options: firstQuestion.options,
        difficulty: firstQuestion.irtParams.difficulty,
        timeEstimate: 60 // seconds
      } : null,
      nextQuestionUrl: `/api/eiq/assess/${sessionId}/next`,
      submitAnswerUrl: `/api/eiq/assess/${sessionId}/answer`
    });
  } catch (error) {
    console.error('[EIQ API] Assessment creation error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create assessment'
    });
  }
});

// GET /api/eiq/assess/:id - Get assessment status and current question
router.get('/assess/:sessionId', validateApiKey, async (req: ApiRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    // Get assessment record
    const [assessment] = await db
      .select()
      .from(publicAssessments)
      .where(and(
        eq(publicAssessments.sessionId, sessionId),
        eq(publicAssessments.apiKeyId, req.apiKey.id)
      ));

    if (!assessment) {
      return res.status(404).json({
        error: 'Assessment not found',
        message: 'No assessment found with the provided session ID'
      });
    }

    // Check if assessment is still active
    if (assessment.status === 'completed') {
      return res.json({
        sessionId,
        status: 'completed',
        completedAt: assessment.completedAt,
        score: assessment.finalScore,
        percentile: assessment.percentile,
        domains: assessment.domainScores,
        reportUrl: `/api/eiq/assess/${sessionId}/report`
      });
    }

    // Get current progress
    const { adaptiveEngine } = await import('../ai/adaptiveAssessmentEngine');
    const session = (adaptiveEngine as any).activeSessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({
        error: 'Session not found',
        message: 'Assessment session has expired or been terminated'
      });
    }

    const answeredCount = session.responses?.length || 0;
    const progress = (answeredCount / assessment.questionCount) * 100;

    res.json({
      sessionId,
      status: assessment.status,
      progress: Math.round(progress),
      questionsAnswered: answeredCount,
      totalQuestions: assessment.questionCount,
      currentDomain: session.currentSection || assessment.domains[0],
      timeElapsed: Math.round((Date.now() - assessment.startedAt.getTime()) / 1000),
      timeLimit: assessment.timeLimit ? assessment.timeLimit * 60 : null,
      nextQuestionUrl: `/api/eiq/assess/${sessionId}/next`,
      submitAnswerUrl: `/api/eiq/assess/${sessionId}/answer`
    });
  } catch (error) {
    console.error('[EIQ API] Get assessment error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve assessment'
    });
  }
});

// POST /api/eiq/assess/:id/answer - Submit an answer
router.post('/assess/:sessionId/answer', validateApiKey, async (req: ApiRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { questionId, answer, timeSpent } = req.body;

    if (!questionId || answer === undefined) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'questionId and answer are required'
      });
    }

    // Verify assessment exists and is active
    const [assessment] = await db
      .select()
      .from(publicAssessments)
      .where(and(
        eq(publicAssessments.sessionId, sessionId),
        eq(publicAssessments.apiKeyId, req.apiKey.id),
        eq(publicAssessments.status, 'active')
      ));

    if (!assessment) {
      return res.status(404).json({
        error: 'Assessment not found or inactive',
        message: 'The assessment session is not active'
      });
    }

    // Process answer with adaptive engine
    const { adaptiveEngine } = await import('../ai/adaptiveAssessmentEngine');
    const result = await adaptiveEngine.processResponse(
      sessionId,
      questionId,
      answer,
      timeSpent || 30000,
      false
    );

    // Update responses in database
    const currentResponses = assessment.responses || [];
    currentResponses.push({
      questionId,
      answer,
      timeSpent: timeSpent || 30000,
      timestamp: new Date()
    });

    await db
      .update(publicAssessments)
      .set({
        responses: currentResponses,
        currentTheta: result.newTheta
      })
      .where(eq(publicAssessments.id, assessment.id));

    // Check if assessment is complete
    const isComplete = currentResponses.length >= assessment.questionCount;

    if (isComplete) {
      // Calculate final scores
      const finalScore = Math.round(((result.newTheta + 3) / 6) * 850);
      const percentile = Math.round(100 / (1 + Math.exp(-1.7 * result.newTheta)));

      await db
        .update(publicAssessments)
        .set({
          status: 'completed',
          completedAt: new Date(),
          finalScore,
          percentile,
          domainScores: {} // Would calculate domain-specific scores here
        })
        .where(eq(publicAssessments.id, assessment.id));

      return res.json({
        sessionId,
        status: 'completed',
        finalScore,
        percentile,
        message: 'Assessment completed successfully',
        reportUrl: `/api/eiq/assess/${sessionId}/report`
      });
    }

    res.json({
      sessionId,
      accepted: true,
      questionsAnswered: currentResponses.length,
      totalQuestions: assessment.questionCount,
      progress: Math.round((currentResponses.length / assessment.questionCount) * 100),
      currentTheta: result.newTheta,
      nextQuestionUrl: `/api/eiq/assess/${sessionId}/next`
    });
  } catch (error) {
    console.error('[EIQ API] Submit answer error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process answer'
    });
  }
});

// GET /api/eiq/assess/:id/next - Get next question
router.get('/assess/:sessionId/next', validateApiKey, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Verify assessment exists and is active
    const [assessment] = await db
      .select()
      .from(publicAssessments)
      .where(and(
        eq(publicAssessments.sessionId, sessionId),
        eq(publicAssessments.apiKeyId, req.apiKey.id),
        eq(publicAssessments.status, 'active')
      ));

    if (!assessment) {
      return res.status(404).json({
        error: 'Assessment not found or inactive',
        message: 'The assessment session is not active'
      });
    }

    // Get next question from adaptive engine
    const { adaptiveEngine } = await import('../ai/adaptiveAssessmentEngine');
    const currentDomainIndex = Math.floor(
      ((assessment.responses?.length || 0) / assessment.questionCount) * assessment.domains.length
    );
    const currentDomain = assessment.domains[Math.min(currentDomainIndex, assessment.domains.length - 1)];
    
    const nextQuestion = adaptiveEngine.selectNextQuestion(sessionId, currentDomain);

    if (!nextQuestion) {
      return res.json({
        sessionId,
        hasMoreQuestions: false,
        message: 'No more questions available',
        completeUrl: `/api/eiq/assess/${sessionId}/complete`
      });
    }

    res.json({
      sessionId,
      question: {
        id: nextQuestion.id,
        domain: nextQuestion.domain,
        type: 'multiple_choice',
        question: nextQuestion.question,
        options: nextQuestion.options,
        difficulty: nextQuestion.irtParams.difficulty,
        timeEstimate: 60
      },
      questionsRemaining: assessment.questionCount - (assessment.responses?.length || 0),
      submitUrl: `/api/eiq/assess/${sessionId}/answer`
    });
  } catch (error) {
    console.error('[EIQ API] Get next question error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve next question'
    });
  }
});

// GET /api/eiq/assess/:id/report - Get detailed assessment report
router.get('/assess/:sessionId/report', validateApiKey, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const [assessment] = await db
      .select()
      .from(publicAssessments)
      .where(and(
        eq(publicAssessments.sessionId, sessionId),
        eq(publicAssessments.apiKeyId, req.apiKey.id),
        eq(publicAssessments.status, 'completed')
      ));

    if (!assessment) {
      return res.status(404).json({
        error: 'Report not found',
        message: 'Assessment not found or not yet completed'
      });
    }

    res.json({
      sessionId,
      assessmentType: assessment.assessmentType,
      completedAt: assessment.completedAt,
      duration: Math.round((assessment.completedAt!.getTime() - assessment.startedAt.getTime()) / 1000),
      score: {
        raw: assessment.finalScore,
        percentile: assessment.percentile,
        interpretation: assessment.percentile >= 90 ? 'Exceptional' :
                       assessment.percentile >= 75 ? 'Above Average' :
                       assessment.percentile >= 50 ? 'Average' :
                       assessment.percentile >= 25 ? 'Below Average' : 'Needs Improvement'
      },
      domains: assessment.domains.map(domain => ({
        name: domain,
        score: assessment.domainScores?.[domain] || 0,
        percentile: 50, // Would calculate actual domain percentiles
        strengths: [],
        improvements: []
      })),
      recommendations: [
        'Focus on areas where you scored below average',
        'Practice regularly to improve processing speed',
        'Consider taking a comprehensive assessment for detailed insights'
      ]
    });
  } catch (error) {
    console.error('[EIQ API] Get report error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate report'
    });
  }
});

export default router;
import { Router } from "express";
import { z } from "zod";
import { WebSocketServer, WebSocket } from "ws";

const router = Router();

// Challenge Configuration
const challengeTypes = {
  '15_second': { time: 15, questions: 3, title: '15-Second Lightning' },
  '30_second': { time: 30, questions: 5, title: '30-Second Sprint' },
  '60_second': { time: 60, questions: 10, title: '60-Second Marathon' }
};

// Viral Challenge Questions Bank
const viralQuestions = [
  {
    id: 'vq_001',
    question: 'What comes next in this sequence: 2, 4, 8, 16, ?',
    options: ['24', '32', '30', '18'],
    correctAnswer: 1,
    category: 'Pattern Recognition',
    timeEstimate: 5
  },
  {
    id: 'vq_002', 
    question: 'Which word does not belong: Apple, Orange, Carrot, Banana',
    options: ['Apple', 'Orange', 'Carrot', 'Banana'],
    correctAnswer: 2,
    category: 'Logic',
    timeEstimate: 4
  },
  {
    id: 'vq_003',
    question: 'If all Flibbers are Wobbles, and some Wobbles are Tribbles, then:',
    options: ['All Tribbles are Flibbers', 'Some Flibbers are Tribbles', 'All Flibbers are Tribbles', 'Cannot be determined'],
    correctAnswer: 3,
    category: 'Logical Reasoning',
    timeEstimate: 8
  },
  {
    id: 'vq_004',
    question: '9 × 7 + 15 ÷ 3 = ?',
    options: ['68', '72', '24', '108'],
    correctAnswer: 0,
    category: 'Mathematical Logic',
    timeEstimate: 6
  },
  {
    id: 'vq_005',
    question: 'Complete the analogy: Book is to Reading as Fork is to ?',
    options: ['Kitchen', 'Eating', 'Spoon', 'Food'],
    correctAnswer: 1,
    category: 'Verbal Reasoning',
    timeEstimate: 5
  }
];

// Mock leaderboard data
let globalLeaderboard = [
  { rank: 1, userName: 'BrainMaster2025', score: 98, timeSpent: 14.2, shareCode: 'VRL001', completedAt: new Date(Date.now() - 3600000).toISOString() },
  { rank: 2, userName: 'QuickThinker', score: 96, timeSpent: 14.8, shareCode: 'VRL002', completedAt: new Date(Date.now() - 7200000).toISOString() },
  { rank: 3, userName: 'LogicWizard', score: 94, timeSpent: 13.9, shareCode: 'VRL003', completedAt: new Date(Date.now() - 10800000).toISOString() }
];

// Start Viral Challenge
const startChallengeSchema = z.object({
  challengeType: z.enum(['15_second', '30_second', '60_second']),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  userId: z.string().optional()
});

router.post('/start', async (req, res) => {
  try {
    const { challengeType, difficulty = 'medium', userId } = startChallengeSchema.parse(req.body);
    
    const config = challengeTypes[challengeType];
    const sessionId = `viral_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Select questions based on difficulty and time constraint
    const selectedQuestions = viralQuestions
      .filter(q => q.timeEstimate <= config.time / config.questions)
      .slice(0, config.questions)
      .map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        timeEstimate: q.timeEstimate,
        category: q.category
      }));
    
    const challengeSession = {
      sessionId,
      challengeType,
      difficulty,
      questions: selectedQuestions,
      startTime: Date.now(),
      timeLimit: config.time,
      userId: userId || `anon_${Date.now()}`
    };
    
    res.json({
      success: true,
      session: challengeSession,
      message: `${config.title} challenge started!`
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Invalid challenge configuration'
    });
  }
});

// Submit Challenge Responses
const submitResponsesSchema = z.object({
  sessionId: z.string(),
  responses: z.array(z.object({
    questionId: z.string(),
    selectedAnswer: z.number(),
    timeSpent: z.number()
  })),
  totalTimeSpent: z.number()
});

router.post('/submit', async (req, res) => {
  try {
    const { sessionId, responses, totalTimeSpent } = submitResponsesSchema.parse(req.body);
    
    // Calculate score
    let correctAnswers = 0;
    let totalQuestions = responses.length;
    
    responses.forEach(response => {
      const question = viralQuestions.find(q => q.id === response.questionId);
      if (question && question.correctAnswer === response.selectedAnswer) {
        correctAnswers++;
      }
    });
    
    const accuracy = (correctAnswers / totalQuestions) * 100;
    const speedBonus = Math.max(0, (30 - totalTimeSpent) * 2); // Speed bonus
    const finalScore = Math.min(100, Math.round(accuracy + speedBonus));
    
    // Determine badge
    let badge: 'genius' | 'expert' | 'proficient' | 'learner';
    if (finalScore >= 90) badge = 'genius';
    else if (finalScore >= 75) badge = 'expert';
    else if (finalScore >= 60) badge = 'proficient';
    else badge = 'learner';
    
    // Calculate percentile (mock calculation)
    const percentile = Math.min(99, Math.max(1, Math.round(finalScore * 0.9 + Math.random() * 10)));
    
    // Generate share code
    const shareCode = `EIQ${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const shareUrl = `https://eiq.sikatlabs.com/challenge?code=${shareCode}`;
    
    // Add to leaderboard (simplified)
    const currentRank = globalLeaderboard.filter(entry => entry.score > finalScore).length + 1;
    
    const result = {
      sessionId,
      score: finalScore,
      correctAnswers,
      totalQuestions,
      timeSpent: totalTimeSpent,
      rank: currentRank,
      shareCode,
      shareUrl,
      percentile,
      badge,
      achievements: finalScore >= 90 ? ['Speed Demon', 'Perfect Score'] : finalScore >= 75 ? ['Quick Thinker'] : []
    };
    
    res.json({
      success: true,
      result,
      message: `Challenge completed! Score: ${finalScore}`
    });
    
  } catch (error) {
    console.error('[VIRAL CHALLENGE ERROR]:', error);
    res.status(400).json({
      success: false,
      error: 'Failed to process challenge submission'
    });
  }
});

// Get Leaderboard
router.get('/leaderboard/:challengeType', async (req, res) => {
  try {
    const { challengeType } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;
    
    // Return mock leaderboard data
    const leaderboard = globalLeaderboard.slice(0, limit);
    
    res.json({
      success: true,
      leaderboard,
      challengeType,
      totalParticipants: globalLeaderboard.length + 2847392,
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard'
    });
  }
});

// WebSocket support for real-time scoring
export function setupViralChallengeWebSocket(wss: WebSocketServer) {
  wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'join_challenge') {
          // Broadcast real-time challenge updates
          const update = {
            type: 'challenge_update',
            participants: Math.floor(Math.random() * 1000) + 5000,
            avgScore: Math.floor(Math.random() * 30) + 70,
            topScore: Math.floor(Math.random() * 10) + 95
          };
          
          ws.send(JSON.stringify(update));
        }
        
        if (message.type === 'submit_answer') {
          // Real-time feedback
          const feedback = {
            type: 'answer_feedback',
            correct: Math.random() > 0.3, // 70% correct rate simulation
            timeRemaining: Math.floor(Math.random() * 15) + 5
          };
          
          ws.send(JSON.stringify(feedback));
        }
        
      } catch (error) {
        console.error('[VIRAL WS ERROR]:', error);
      }
    });
  });
}

export default router;
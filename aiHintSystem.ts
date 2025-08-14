/**
 * AI-Powered Hint System for Real-Time Assessment Support
 * Provides contextual hints based on user performance and question analysis
 */

import { adaptiveEngine } from './adaptiveAssessmentEngine';

interface HintRequest {
  sessionId: string;
  questionId: string;
  userAnswer?: string;
  attemptCount: number;
  timeSpent: number;
  userTheta: number;
  previousIncorrectAnswers?: string[];
  userProfile?: any;
  learningStyle?: 'visual' | 'analytical' | 'kinesthetic' | 'verbal';
  personalContext?: {
    strugglingAreas: string[];
    strongAreas: string[];
    assessmentHistory: any[];
  };
}

interface AIHint {
  id: string;
  hintType: 'conceptual' | 'procedural' | 'strategic' | 'encouragement' | 'personalized';
  content: string;
  confidence: number;
  aiReasoning: string;
  suggestedNextStep?: string;
  relatedConcepts?: string[];
  personalizedContext?: string;
  learningStyle?: 'visual' | 'analytical' | 'kinesthetic' | 'verbal';
  difficultyAdjustment?: 'simplify' | 'elaborate' | 'maintain';
}

interface HintStrategy {
  name: string;
  condition: (request: HintRequest) => boolean;
  generateHint: (request: HintRequest) => Promise<AIHint>;
}

export class AIHintSystem {
  private hintStrategies: HintStrategy[] = [];
  private hintHistory: Map<string, AIHint[]> = new Map();

  constructor() {
    this.initializeHintStrategies();
  }

  /**
   * Initialize hint generation strategies
   */
  private initializeHintStrategies(): void {
    this.hintStrategies = [
      {
        name: 'struggling_student',
        condition: (req) => req.attemptCount >= 3 && req.userTheta < -1,
        generateHint: this.generateStruggleHint.bind(this)
      },
      {
        name: 'time_pressure',
        condition: (req) => req.timeSpent > 180000, // 3 minutes
        generateHint: this.generateTimeHint.bind(this)
      },
      {
        name: 'conceptual_gap',
        condition: (req) => req.attemptCount === 2,
        generateHint: this.generateConceptualHint.bind(this)
      },
      {
        name: 'strategic_guidance',
        condition: (req) => req.attemptCount === 1,
        generateHint: this.generateStrategicHint.bind(this)
      },
      {
        name: 'encouragement',
        condition: (req) => req.attemptCount >= 4,
        generateHint: this.generateEncouragementHint.bind(this)
      }
    ];
  }

  /**
   * Generate AI-powered hint based on context
   */
  async generateHint(request: HintRequest): Promise<AIHint> {
    console.log(`[AI HINT] Generating hint for question ${request.questionId}, attempt ${request.attemptCount}`);

    // Find appropriate strategy
    const strategy = this.hintStrategies.find(s => s.condition(request));
    
    if (strategy) {
      const hint = await strategy.generateHint(request);
      this.recordHint(request.sessionId, hint);
      return hint;
    }

    // Default hint if no strategy matches
    return await this.generateDefaultHint(request);
  }

  /**
   * Generate hint for struggling students
   */
  private async generateStruggleHint(request: HintRequest): Promise<AIHint> {
    const baseHint = await adaptiveEngine.generateAIHint(
      request.questionId,
      request.userTheta,
      request.attemptCount,
      request.previousIncorrectAnswers?.[0]
    );

    return {
      id: `hint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      hintType: 'conceptual',
      content: `Let's break this down step by step. ${baseHint} Remember, it's okay to take your time with challenging problems.`,
      confidence: 0.9,
      aiReasoning: 'Student is struggling with multiple attempts, providing foundational support and encouragement',
      suggestedNextStep: 'Focus on understanding the core concept before attempting calculation',
      relatedConcepts: this.extractRelatedConcepts(request.questionId),
      personalizedContext: this.generatePersonalizedContext(request),
      learningStyle: request.learningStyle || 'analytical',
      difficultyAdjustment: 'simplify'
    };
  }

  /**
   * Generate personalized context based on user profile
   */
  private generatePersonalizedContext(request: HintRequest): string {
    if (!request.userProfile) {
      return "This hint is tailored to help you understand the core concepts better.";
    }

    const context = [];
    
    if (request.personalContext?.strugglingAreas && request.personalContext.strugglingAreas.length > 0) {
      context.push(`Based on your previous challenges with ${request.personalContext.strugglingAreas.slice(0, 2).join(' and ')}, this approach should help.`);
    }
    
    if (request.learningStyle) {
      const styleAdvice = {
        visual: "Try visualizing this concept or drawing a diagram.",
        analytical: "Let's break this down logically step by step.",
        kinesthetic: "Think about how you might physically interact with this concept.",
        verbal: "Try explaining this concept out loud to yourself."
      };
      context.push(styleAdvice[request.learningStyle]);
    }

    return context.length > 0 ? context.join(' ') : "This personalized hint is designed to match your learning preferences.";
  }

  /**
   * Generate multiple personalized hints for different scenarios
   */
  async generatePersonalizedHints(request: HintRequest): Promise<AIHint[]> {
    console.log(`[AI HINT] Generating personalized hints for session ${request.sessionId}`);
    
    const hints: AIHint[] = [];
    
    // Generate hints based on learning style
    if (request.learningStyle) {
      hints.push(await this.generateLearningStyleHint(request));
    }
    
    // Generate hints based on struggle pattern
    if (request.attemptCount >= 2) {
      hints.push(await this.generateStruggleHint(request));
    }
    
    // Generate strategic hint for efficiency
    if (request.timeSpent > 120000) {
      hints.push(await this.generateTimeHint(request));
    }
    
    // Generate encouragement hint if struggling
    if (request.attemptCount >= 3) {
      hints.push(await this.generateEncouragementHint(request));
    }
    
    // Always include at least one personalized hint
    if (hints.length === 0) {
      hints.push(await this.generatePersonalizedHint(request));
    }
    
    return hints.slice(0, 3); // Return max 3 hints
  }

  /**
   * Generate hint based on learning style
   */
  private async generateLearningStyleHint(request: HintRequest): Promise<AIHint> {
    const styleHints = {
      visual: "Try drawing a diagram or creating a visual representation of the problem.",
      analytical: "Let's approach this systematically by identifying each variable and relationship.",
      kinesthetic: "Think about this problem in terms of real-world actions or movements.",
      verbal: "Try reading the problem out loud and explaining each step as you go."
    };

    const content = styleHints[request.learningStyle || 'analytical'];
    
    return {
      id: `hint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      hintType: 'personalized',
      content,
      confidence: 0.85,
      aiReasoning: `Tailored hint for ${request.learningStyle} learning style`,
      suggestedNextStep: `Apply your ${request.learningStyle} learning preference to this problem`,
      relatedConcepts: ['learning_styles', 'personalized_learning'],
      personalizedContext: this.generatePersonalizedContext(request),
      learningStyle: request.learningStyle,
      difficultyAdjustment: 'maintain'
    };
  }

  /**
   * Generate personalized hint
   */
  private async generatePersonalizedHint(request: HintRequest): Promise<AIHint> {
    return {
      id: `hint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      hintType: 'personalized',
      content: "Based on your learning profile, try focusing on the relationships between the given information.",
      confidence: 0.8,
      aiReasoning: 'Generated personalized hint based on user profile and performance',
      suggestedNextStep: 'Identify the key relationships in the problem',
      relatedConcepts: this.extractRelatedConcepts(request.questionId),
      personalizedContext: this.generatePersonalizedContext(request),
      learningStyle: request.learningStyle || 'analytical',
      difficultyAdjustment: 'maintain'
    };
  }

  /**
   * Generate hint for time pressure situations
   */
  private async generateTimeHint(request: HintRequest): Promise<AIHint> {
    return {
      id: `hint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      hintType: 'strategic',
      content: 'You\'ve been working on this for a while. Try focusing on the key information given and eliminate obviously wrong answers first.',
      confidence: 0.8,
      aiReasoning: 'Student is taking excessive time, needs strategic guidance to improve efficiency',
      suggestedNextStep: 'Use process of elimination to narrow down options',
      relatedConcepts: ['problem_solving_strategies', 'time_management'],
      personalizedContext: this.generatePersonalizedContext(request),
      learningStyle: request.learningStyle || 'analytical',
      difficultyAdjustment: 'maintain'
    };
  }

  /**
   * Generate conceptual understanding hint
   */
  private async generateConceptualHint(request: HintRequest): Promise<AIHint> {
    const baseHint = await adaptiveEngine.generateAIHint(
      request.questionId,
      request.userTheta,
      request.attemptCount
    );

    return {
      id: `hint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      hintType: 'conceptual',
      content: `Think about the underlying concept here. ${baseHint} What principle or formula applies to this type of problem?`,
      confidence: 0.85,
      aiReasoning: 'Second attempt suggests need for conceptual clarification',
      suggestedNextStep: 'Identify the relevant mathematical or logical principle',
      relatedConcepts: this.extractRelatedConcepts(request.questionId),
      personalizedContext: this.generatePersonalizedContext(request),
      learningStyle: request.learningStyle || 'analytical',
      difficultyAdjustment: 'simplify'
    };
  }

  /**
   * Generate strategic approach hint
   */
  private async generateStrategicHint(request: HintRequest): Promise<AIHint> {
    return {
      id: `hint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      hintType: 'strategic',
      content: 'Take a moment to analyze what the question is really asking. What information do you have, and what do you need to find?',
      confidence: 0.75,
      aiReasoning: 'First attempt, providing strategic thinking guidance',
      suggestedNextStep: 'Clearly identify given information and what needs to be solved',
      relatedConcepts: ['problem_analysis', 'strategic_thinking'],
      personalizedContext: this.generatePersonalizedContext(request),
      learningStyle: request.learningStyle || 'analytical',
      difficultyAdjustment: 'maintain'
    };
  }

  /**
   * Generate encouragement hint
   */
  private async generateEncouragementHint(request: HintRequest): Promise<AIHint> {
    const encouragements = [
      "You're putting in great effort! Learning happens through practice and persistence.",
      "Each attempt is bringing you closer to understanding. Keep thinking it through!",
      "Remember, challenging problems help you grow. You've got the skills to figure this out.",
      "Take a deep breath. You've solved similar problems before - trust your knowledge."
    ];

    const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];

    return {
      id: `hint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      hintType: 'encouragement',
      content: randomEncouragement,
      confidence: 1.0,
      aiReasoning: 'Multiple attempts detected, providing emotional support and motivation',
      suggestedNextStep: 'Take a moment to reset, then approach the problem with fresh perspective',
      personalizedContext: this.generatePersonalizedContext(request),
      learningStyle: request.learningStyle || 'analytical',
      difficultyAdjustment: 'maintain'
    };
  }

  /**
   * Generate default hint
   */
  private async generateDefaultHint(request: HintRequest): Promise<AIHint> {
    const baseHint = await adaptiveEngine.generateAIHint(
      request.questionId,
      request.userTheta,
      request.attemptCount
    );

    return {
      id: `hint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      hintType: 'procedural',
      content: baseHint,
      confidence: 0.7,
      aiReasoning: 'Standard hint generation based on question analysis',
      suggestedNextStep: 'Apply the suggested approach to solve the problem',
      personalizedContext: this.generatePersonalizedContext(request),
      learningStyle: request.learningStyle || 'analytical',
      difficultyAdjustment: 'maintain'
    };
  }

  /**
   * Extract related concepts for a question
   */
  private extractRelatedConcepts(questionId: string): string[] {
    // This would typically analyze the question content and extract relevant concepts
    // For now, return default concepts based on question ID patterns
    
    if (questionId.includes('math')) {
      return ['algebra', 'arithmetic', 'problem_solving'];
    } else if (questionId.includes('reasoning')) {
      return ['logical_thinking', 'analysis', 'pattern_recognition'];
    } else if (questionId.includes('ai')) {
      return ['machine_learning', 'data_analysis', 'algorithmic_thinking'];
    }
    
    return ['critical_thinking', 'problem_solving'];
  }

  /**
   * Record hint in session history
   */
  private recordHint(sessionId: string, hint: AIHint): void {
    if (!this.hintHistory.has(sessionId)) {
      this.hintHistory.set(sessionId, []);
    }
    
    this.hintHistory.get(sessionId)!.push({
      ...hint,
      timestamp: new Date().toISOString()
    } as any);
  }

  /**
   * Get hint usage analytics for a session
   */
  getHintAnalytics(sessionId: string): any {
    const hints = this.hintHistory.get(sessionId) || [];
    
    const hintTypes = hints.reduce((acc, hint) => {
      acc[hint.hintType] = (acc[hint.hintType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalHints: hints.length,
      hintTypes,
      averageConfidence: hints.length > 0 
        ? hints.reduce((sum, h) => sum + h.confidence, 0) / hints.length 
        : 0,
      hintsPerQuestion: hints.length / Math.max(1, new Set(hints.map((h: any) => h.questionId)).size)
    };
  }

  /**
   * Provide personalized learning suggestions based on hint patterns
   */
  generateLearningSuggestions(sessionId: string): string[] {
    const hints = this.hintHistory.get(sessionId) || [];
    const suggestions: string[] = [];

    const conceptualHints = hints.filter(h => h.hintType === 'conceptual').length;
    const strategicHints = hints.filter(h => h.hintType === 'strategic').length;
    const encouragementHints = hints.filter(h => h.hintType === 'encouragement').length;

    if (conceptualHints > 3) {
      suggestions.push('Focus on building foundational understanding of key concepts');
      suggestions.push('Review prerequisite materials before attempting advanced problems');
    }

    if (strategicHints > 2) {
      suggestions.push('Practice problem-solving strategies and systematic approaches');
      suggestions.push('Work on breaking down complex problems into manageable steps');
    }

    if (encouragementHints > 1) {
      suggestions.push('Consider taking breaks between challenging problems');
      suggestions.push('Build confidence with easier problems before advancing');
    }

    return suggestions.length > 0 ? suggestions : [
      'Continue practicing to build proficiency',
      'Explore related topics to deepen understanding'
    ];
  }
}

// Export singleton instance
export const aiHintSystem = new AIHintSystem();
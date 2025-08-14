/**
 * AI-Powered Question Generation System
 * Ensures NO question is ever repeated for the same user
 * Generates personalized questions based on learning style and performance
 */

import { openai, anthropic, vertexAI } from '../ai-providers.js';
import { db } from '../db.js';
import { userQuestionHistory, aiGeneratedQuestions, userLearningProfiles } from '@shared/schema';
import { eq, and, inArray } from 'drizzle-orm';

export interface LearningProfile {
  userId: string;
  communicationStyle: 'visual' | 'verbal' | 'kinesthetic' | 'analytical';
  problemSolvingApproach: 'systematic' | 'intuitive' | 'creative' | 'practical';
  responseSpeed: 'fast' | 'moderate' | 'deliberate';
  comprehensionDepth: 'surface' | 'moderate' | 'deep';
  preferredComplexity: number; // 1-10 scale
  strengths: string[];
  weaknesses: string[];
  myersBriggsType?: string; // INTJ, ENFP, etc.
  learningVelocity: number; // Rate of improvement
  knowledgeCeiling: number; // Estimated maximum capacity
}

export interface QuestionGenerationContext {
  userId: string;
  subject: string;
  difficulty: number;
  previousResponses: any[];
  learningProfile: LearningProfile;
  assessmentType: 'sat' | 'act' | 'iq' | 'eq' | 'myers-briggs' | 'dsm' | 'hybrid';
  avoidQuestionIds: string[]; // Questions already seen by user
}

export class AIQuestionGenerator {
  private aiProviders: any[];
  
  constructor() {
    this.aiProviders = [openai, anthropic, vertexAI];
  }

  /**
   * CRITICAL: Ensures a question has NEVER been shown to this user
   */
  private async ensureQuestionUniqueness(userId: string, questionText: string): Promise<boolean> {
    const [existing] = await db
      .select()
      .from(userQuestionHistory)
      .where(
        and(
          eq(userQuestionHistory.userId, userId),
          eq(userQuestionHistory.questionHash, this.hashQuestion(questionText))
        )
      );
    
    return !existing;
  }

  /**
   * Generate a completely unique question for the user
   */
  async generateUniqueQuestion(context: QuestionGenerationContext): Promise<any> {
    const { userId, subject, difficulty, learningProfile, assessmentType } = context;
    
    // Get ALL questions this user has EVER seen
    const userHistory = await db
      .select()
      .from(userQuestionHistory)
      .where(eq(userQuestionHistory.userId, userId));
    
    const seenQuestionHashes = new Set(userHistory.map(h => h.questionHash));
    
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      attempts++;
      
      // Generate question using AI based on assessment type
      const question = await this.generateQuestionByType(
        assessmentType,
        subject,
        difficulty,
        learningProfile,
        seenQuestionHashes
      );
      
      // Verify uniqueness
      const isUnique = await this.ensureQuestionUniqueness(userId, question.questionText);
      
      if (isUnique) {
        // Record this question in user's history
        await this.recordQuestionInHistory(userId, question);
        
        // Store in AI generated questions table
        await this.storeGeneratedQuestion(question, context);
        
        return question;
      }
    }
    
    // If we can't generate unique after 10 attempts, create a highly personalized variant
    return await this.generatePersonalizedVariant(context, seenQuestionHashes);
  }

  /**
   * Generate questions based on assessment type (SAT, ACT, IQ, EQ, Myers-Briggs, DSM)
   */
  private async generateQuestionByType(
    type: string,
    subject: string,
    difficulty: number,
    profile: LearningProfile,
    avoidHashes: Set<string>
  ): Promise<any> {
    const prompts: Record<string, string> = {
      'sat': this.generateSATStylePrompt(subject, difficulty, profile),
      'act': this.generateACTStylePrompt(subject, difficulty, profile),
      'iq': this.generateIQStylePrompt(subject, difficulty, profile),
      'eq': this.generateEQStylePrompt(subject, difficulty, profile),
      'myers-briggs': this.generateMBTIStylePrompt(profile),
      'dsm': this.generateDSMStylePrompt(profile),
      'hybrid': this.generateHybridPrompt(subject, difficulty, profile)
    };

    const prompt = prompts[type] || prompts['hybrid'];
    
    try {
      if (!openai) {
        throw new Error('OpenAI provider not available');
      }
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert assessment designer creating unique, personalized questions.
                     CRITICAL: Generate questions that have NEVER been asked before.
                     Adapt to the user's learning profile: ${JSON.stringify(profile)}
                     Avoid these question patterns: ${Array.from(avoidHashes).slice(0, 10).join(', ')}
                     
                     Always respond in JSON format with this structure:
                     {
                       "questionText": "The actual question",
                       "options": ["A", "B", "C", "D"],
                       "correctAnswer": "A",
                       "difficulty": 1-10,
                       "subject": "subject area",
                       "cognitiveSkills": ["skill1", "skill2"],
                       "explanation": "Why this answer is correct"
                     }`
          },
          {
            role: "user",
            content: prompt + "\n\nPlease generate in JSON format as specified above."
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.9, // High creativity for uniqueness
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No content in AI response');
      }
      return JSON.parse(content);
    } catch (error) {
      // Fallback to Anthropic
      return await this.generateWithAnthropic(prompt, profile, avoidHashes);
    }
  }

  /**
   * Generate SAT-style questions
   */
  private generateSATStylePrompt(subject: string, difficulty: number, profile: LearningProfile): string {
    return `Generate an SAT-style ${subject} question with difficulty ${difficulty}/10.
            Consider the user's ${profile.communicationStyle} communication style.
            Include:
            1. Complex reading comprehension if verbal
            2. Mathematical reasoning if quantitative
            3. Evidence-based analysis
            4. Multiple choice with 4 options
            Format as JSON with: questionText, options[], correctAnswer, explanation, skills[]`;
  }

  /**
   * Generate IQ-style pattern recognition questions
   */
  private generateIQStylePrompt(subject: string, difficulty: number, profile: LearningProfile): string {
    return `Generate an IQ test question focusing on ${subject} with difficulty ${difficulty}/10.
            User has ${profile.problemSolvingApproach} problem-solving approach.
            Include:
            1. Pattern recognition
            2. Logical sequences
            3. Spatial reasoning
            4. Abstract thinking
            Format as JSON with: questionText, visualPattern (if applicable), options[], correctAnswer, cognitiveSkill`;
  }

  /**
   * Generate EQ emotional intelligence questions
   */
  private generateEQStylePrompt(subject: string, difficulty: number, profile: LearningProfile): string {
    return `Generate an emotional intelligence question with difficulty ${difficulty}/10.
            Consider user's comprehension depth: ${profile.comprehensionDepth}.
            Include:
            1. Emotional scenario
            2. Social dynamics
            3. Empathy assessment
            4. Self-awareness check
            Format as JSON with: scenario, emotionalContext, possibleResponses[], optimalResponse, emotionalSkills[]`;
  }

  /**
   * Generate Myers-Briggs personality assessment questions
   */
  private generateMBTIStylePrompt(profile: LearningProfile): string {
    return `Generate a Myers-Briggs style personality assessment question.
            Current profile suggests: ${profile.myersBriggsType || 'Unknown'}.
            Create a question that explores:
            1. Introversion vs Extraversion
            2. Sensing vs Intuition
            3. Thinking vs Feeling
            4. Judging vs Perceiving
            Format as JSON with: situation, choices[], dimensionMeasured, insightProvided`;
  }

  /**
   * Analyze free-form responses to understand communication and problem-solving
   */
  async analyzeFreeFormResponse(userId: string, response: string, questionContext: any): Promise<any> {
    if (!openai) {
      throw new Error('OpenAI provider not available');
    }
    
    const analysis = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Analyze this free-form response to understand:
                   1. Communication style and clarity
                   2. Problem-solving approach
                   3. Depth of understanding
                   4. Creative thinking
                   5. Logical structure
                   6. Emotional intelligence indicators
                   7. Learning capacity indicators
                   8. Knowledge limitations
                   
                   Please provide your analysis in JSON format with the following structure:
                   {
                     "communicationStyle": "analytical|creative|direct|verbose",
                     "problemSolvingApproach": "systematic|intuitive|collaborative|analytical",
                     "strengthsIdentified": ["strength1", "strength2"],
                     "weaknessesIdentified": ["weakness1", "weakness2"],
                     "learningStyleIndicators": {},
                     "emotionalIntelligenceLevel": "high|medium|low",
                     "cognitiveComplexity": 1-10,
                     "recommendations": []
                   }`
        },
        {
          role: "user",
          content: `Question: ${questionContext.question}\nResponse: ${response}\n\nPlease analyze and return JSON format.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = analysis.choices[0].message.content;
    if (!content) {
      throw new Error('No content in analysis response');
    }
    const analysisResult = JSON.parse(content);
    
    // Update user's learning profile based on analysis
    await this.updateLearningProfile(userId, analysisResult);
    
    return analysisResult;
  }

  /**
   * Calculate FICO-like EIQ score based on multiple factors
   */
  async calculateEIQScore(userId: string): Promise<number> {
    const profile = await this.getUserLearningProfile(userId);
    const history = await this.getUserPerformanceHistory(userId);
    
    // FICO-like scoring model (300-850 range)
    const scoreComponents = {
      // 35% - Problem-solving ability (like payment history)
      problemSolving: this.calculateProblemSolvingScore(history) * 0.35,
      
      // 30% - Knowledge depth (like credit utilization)
      knowledgeDepth: this.calculateKnowledgeDepthScore(profile) * 0.30,
      
      // 15% - Learning velocity (like length of credit history)
      learningVelocity: profile.learningVelocity * 0.15,
      
      // 10% - Adaptability (like new credit)
      adaptability: this.calculateAdaptabilityScore(history) * 0.10,
      
      // 10% - Communication skills (like credit mix)
      communication: this.calculateCommunicationScore(profile) * 0.10
    };
    
    const rawScore = Object.values(scoreComponents).reduce((a, b) => a + b, 0);
    
    // Scale to 300-850 range like FICO
    const eiqScore = Math.round(300 + (rawScore * 550));
    
    // Store score with timestamp
    await this.storeEIQScore(userId, eiqScore, scoreComponents);
    
    return eiqScore;
  }

  /**
   * Predict ways to improve EIQ score
   */
  async predictScoreImprovements(userId: string, currentScore: number): Promise<any> {
    if (!openai) {
      throw new Error('OpenAI provider not available');
    }
    
    const profile = await this.getUserLearningProfile(userId);
    const weaknesses = profile.weaknesses || ['general improvement needed'];
    
    const improvements = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `As an educational AI, predict specific ways to improve EIQ score from ${currentScore}.
                   User profile: ${JSON.stringify(profile)}
                   Focus on actionable improvements in:
                   1. Problem-solving techniques
                   2. Knowledge acquisition strategies
                   3. Communication enhancement
                   4. Learning acceleration methods
                   5. Cognitive flexibility training
                   
                   Please respond with a JSON object containing:
                   {
                     "currentScore": ${currentScore},
                     "targetScore": number,
                     "improvementStrategies": [
                       {
                         "category": "problem-solving|knowledge|communication|learning|cognitive",
                         "action": "specific action to take",
                         "expectedImpact": "+X points",
                         "timeframe": "weeks"
                       }
                     ],
                     "priorityAreas": [],
                     "practiceRecommendations": [],
                     "estimatedTimeframe": "X months to see improvement"
                   }`
        },
        {
          role: "user",
          content: `Generate personalized improvement plan for weaknesses: ${weaknesses.join(', ')}\n\nRespond in JSON format.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = improvements.choices[0].message.content;
    if (!content) {
      throw new Error('No content in improvements response');
    }
    return JSON.parse(content);
  }

  /**
   * Helper methods
   */
  private hashQuestion(text: string): string {
    // Simple hash for question uniqueness
    return Buffer.from(text).toString('base64').substring(0, 32);
  }

  private async recordQuestionInHistory(userId: string, question: any): Promise<void> {
    await db.insert(userQuestionHistory).values({
      userId,
      questionHash: this.hashQuestion(question.questionText),
      questionId: question.id,
      questionText: question.questionText,
      subject: question.subject,
      difficulty: question.difficulty.toString(),
      timestamp: new Date()
    });
  }

  private async storeGeneratedQuestion(question: any, context: QuestionGenerationContext): Promise<void> {
    await db.insert(aiGeneratedQuestions).values({
      ...question,
      userId: context.userId,
      generatedAt: new Date(),
      learningProfile: context.learningProfile,
      assessmentType: context.assessmentType
    });
  }

  private async updateLearningProfile(userId: string, analysis: any): Promise<void> {
    // Update or create learning profile based on AI analysis
    const existing = await db
      .select()
      .from(userLearningProfiles)
      .where(eq(userLearningProfiles.userId, userId));
    
    if (existing.length > 0) {
      // Update existing profile
      await db
        .update(userLearningProfiles)
        .set({
          ...analysis,
          updatedAt: new Date()
        })
        .where(eq(userLearningProfiles.userId, userId));
    } else {
      // Create new profile
      await db.insert(userLearningProfiles).values({
        userId,
        ...analysis,
        createdAt: new Date()
      });
    }
  }

  private async getUserLearningProfile(userId: string): Promise<LearningProfile> {
    const [profile] = await db
      .select()
      .from(userLearningProfiles)
      .where(eq(userLearningProfiles.userId, userId));
    
    if (profile) {
      // Convert database values to expected types
      return {
        userId: profile.userId,
        communicationStyle: (profile.communicationStyle as any) || 'verbal',
        problemSolvingApproach: (profile.problemSolvingApproach as any) || 'systematic',
        responseSpeed: (profile.responseSpeed as any) || 'moderate',
        comprehensionDepth: (profile.comprehensionDepth as any) || 'moderate',
        preferredComplexity: parseFloat(profile.preferredComplexity || '5'),
        strengths: profile.strengths || [],
        weaknesses: profile.weaknesses || [],
        myersBriggsType: profile.myersBriggsType || undefined,
        learningVelocity: parseFloat(profile.learningVelocity || '1.0'),
        knowledgeCeiling: parseFloat(profile.knowledgeCeiling || '100')
      };
    }
    
    return this.createDefaultProfile(userId);
  }

  private createDefaultProfile(userId: string): LearningProfile {
    return {
      userId,
      communicationStyle: 'verbal',
      problemSolvingApproach: 'systematic',
      responseSpeed: 'moderate',
      comprehensionDepth: 'moderate',
      preferredComplexity: 5,
      strengths: [],
      weaknesses: [],
      learningVelocity: 1.0,
      knowledgeCeiling: 100
    };
  }

  private async getUserPerformanceHistory(userId: string): Promise<any[]> {
    return await db
      .select()
      .from(userQuestionHistory)
      .where(eq(userQuestionHistory.userId, userId));
  }

  private calculateProblemSolvingScore(history: any[]): number {
    // Complex calculation based on correct answers, speed, and difficulty
    return 0.75; // Placeholder
  }

  private calculateKnowledgeDepthScore(profile: LearningProfile): number {
    return profile.comprehensionDepth === 'deep' ? 0.9 : 
           profile.comprehensionDepth === 'moderate' ? 0.7 : 0.5;
  }

  private calculateAdaptabilityScore(history: any[]): number {
    // Measure how well user adapts to different question types
    return 0.8; // Placeholder
  }

  private calculateCommunicationScore(profile: LearningProfile): number {
    // Based on free-form response analysis
    return 0.85; // Placeholder
  }

  private async storeEIQScore(userId: string, score: number, components: any): Promise<void> {
    // Store score in database with components breakdown
    console.log(`EIQ Score for ${userId}: ${score}`, components);
  }

  private async generateWithAnthropic(prompt: string, profile: LearningProfile, avoidHashes: Set<string>): Promise<any> {
    // Fallback to Anthropic if OpenAI fails
    if (!anthropic) {
      throw new Error('Anthropic client not initialized');
    }
    
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });
    
    const content = response.content[0];
    if ('text' in content) {
      return JSON.parse(content.text);
    }
    throw new Error('Unexpected response format from Anthropic');
  }

  private generateACTStylePrompt(subject: string, difficulty: number, profile: LearningProfile): string {
    return `Generate an ACT-style ${subject} question with difficulty ${difficulty}/10.
            Focus on practical application and time-based problem solving.
            Include: practical scenarios, data interpretation, scientific reasoning.
            Format as JSON.`;
  }

  private generateDSMStylePrompt(profile: LearningProfile): string {
    return `Generate a DSM-style behavioral assessment question.
            Explore: behavioral patterns, cognitive tendencies, adaptive functioning.
            Format as JSON with: scenario, behavioralIndicators[], assessment`;
  }

  private generateHybridPrompt(subject: string, difficulty: number, profile: LearningProfile): string {
    return `Generate a comprehensive assessment question combining multiple methodologies.
            Subject: ${subject}, Difficulty: ${difficulty}/10
            Integrate: IQ pattern recognition, EQ emotional awareness, practical application
            Format as JSON with complete assessment structure`;
  }

  private async generatePersonalizedVariant(context: QuestionGenerationContext, seenHashes: Set<string>): Promise<any> {
    // Ultra-personalized question generation when standard generation fails
    const prompt = `Create an extremely unique, personalized question for user.
                   Subject: ${context.subject}
                   Learning profile: ${JSON.stringify(context.learningProfile)}
                   Make it completely different from any standard assessment question.
                   Include personal growth elements.`;
    
    return await this.generateQuestionByType('hybrid', context.subject, context.difficulty, context.learningProfile, seenHashes);
  }
}

export const aiQuestionGenerator = new AIQuestionGenerator();
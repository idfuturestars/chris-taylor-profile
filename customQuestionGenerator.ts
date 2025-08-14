/**
 * Custom Question Generation Engine with AI Assistance
 * Analyzes student assessment data to create targeted questions
 */

import { OpenAI } from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenAI } from "@google/genai";

interface AssessmentResults {
  userId: string;
  assessmentId: string;
  overallScore: number;
  domainScores: {
    logical_reasoning: number;
    mathematical_concepts: number;
    verbal_comprehension: number;
    spatial_intelligence: number;
    emotional_intelligence: number;
    creative_thinking: number;
  };
  responses: Array<{
    questionId: string;
    domain: string;
    isCorrect: boolean;
    responseTime: number;
    difficulty: number;
    aiHintUsed: boolean;
  }>;
  weakestAreas: string[];
  irtTheta: number; // Current ability estimate
}

interface WeaknessAnalysis {
  primaryWeaknesses: string[];
  secondaryWeaknesses: string[];
  difficultyRange: { min: number; max: number };
  recommendedQuestionTypes: string[];
  targetSkills: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface AIGeneratedQuestion {
  questionText: string;
  questionType: 'multiple_choice' | 'open_ended' | 'scenario_based';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  targetedDomains: string[];
  estimatedDifficulty: number;
  learningObjectives: string[];
  aiRationale: string;
  followUpSuggestions: string[];
}

interface DifficultyEstimate {
  estimatedDifficulty: number;
  confidenceLevel: number;
  reasoning: string;
  calibrationData: {
    similarQuestions: number;
    averagePerformance: number;
  };
}

export class CustomQuestionGenerator {
  private openai: OpenAI | null = null;
  private anthropic: Anthropic | null = null;
  private gemini: GoogleGenAI | null = null;
  private questionHistory: Map<string, AIGeneratedQuestion[]> = new Map();

  constructor() {
    // Initialize AI providers only if API keys are available
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    
    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    }
    
    if (process.env.GEMINI_API_KEY) {
      this.gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    
    console.log(`[CUSTOM QUESTIONS] Initialized with providers: ${[
      this.openai ? 'OpenAI' : null,
      this.anthropic ? 'Anthropic' : null,
      this.gemini ? 'Gemini' : null
    ].filter(Boolean).join(', ') || 'None'}`);
  }

  /**
   * Analyze student's assessment results to identify knowledge gaps
   */
  async analyzeStudentWeaknesses(assessmentData: AssessmentResults): Promise<WeaknessAnalysis> {
    const { domainScores, responses, weakestAreas, irtTheta } = assessmentData;

    // Calculate domain-specific weakness patterns
    const domainAnalysis = Object.entries(domainScores)
      .map(([domain, score]) => ({
        domain,
        score,
        isWeak: score < 0.7, // Below 70% proficiency
        severity: this.calculateSeverity(score, irtTheta)
      }))
      .filter(item => item.isWeak)
      .sort((a, b) => a.severity - b.severity);

    // Analyze response patterns for deeper insights
    const responsePatterns = this.analyzeResponsePatterns(responses);
    
    // Determine difficulty range for targeted questions
    const difficultyRange = this.calculateOptimalDifficultyRange(irtTheta, domainAnalysis);

    // Recommend question types based on learning science
    const recommendedTypes = this.recommendQuestionTypes(responsePatterns, domainAnalysis);

    return {
      primaryWeaknesses: domainAnalysis.slice(0, 2).map(item => item.domain),
      secondaryWeaknesses: domainAnalysis.slice(2, 4).map(item => item.domain),
      difficultyRange,
      recommendedQuestionTypes: recommendedTypes,
      targetSkills: this.identifyTargetSkills(domainAnalysis, responses),
      urgencyLevel: this.determineUrgencyLevel(domainAnalysis, responsePatterns)
    };
  }

  /**
   * Generate question suggestions using AI providers
   */
  async generateQuestionSuggestions(
    weaknessAnalysis: WeaknessAnalysis,
    questionType: 'multiple_choice' | 'open_ended' | 'scenario_based',
    difficultyTarget: number,
    aiProvider: 'openai' | 'anthropic' | 'gemini' = 'anthropic'
  ): Promise<AIGeneratedQuestion[]> {
    
    const prompt = this.buildGenerationPrompt(weaknessAnalysis, questionType, difficultyTarget);

    let generatedQuestions: AIGeneratedQuestion[];

    try {
      switch (aiProvider) {
        case 'openai':
          generatedQuestions = await this.generateWithOpenAI(prompt);
          break;
        case 'anthropic':
          generatedQuestions = await this.generateWithAnthropic(prompt);
          break;
        case 'gemini':
          generatedQuestions = await this.generateWithGemini(prompt);
          break;
        default:
          throw new Error(`Unsupported AI provider: ${aiProvider}`);
      }

      // Apply quality validation and filtering
      const validatedQuestions = await Promise.all(
        generatedQuestions.map(q => this.validateQuestionQuality(q))
      );

      return validatedQuestions.filter(q => q !== null) as AIGeneratedQuestion[];

    } catch (error) {
      console.error(`Error generating questions with ${aiProvider}:`, error);
      
      // Fallback to different provider
      if (aiProvider === 'anthropic') {
        return this.generateQuestionSuggestions(weaknessAnalysis, questionType, difficultyTarget, 'openai');
      } else if (aiProvider === 'openai') {
        return this.generateQuestionSuggestions(weaknessAnalysis, questionType, difficultyTarget, 'gemini');
      }
      
      throw error;
    }
  }

  /**
   * Refine questions based on staff feedback
   */
  async refineQuestionWithFeedback(
    originalQuestion: AIGeneratedQuestion,
    staffFeedback: string,
    aiProvider: 'openai' | 'anthropic' | 'gemini' = 'anthropic'
  ): Promise<AIGeneratedQuestion> {

    const refinementPrompt = `
    Original Question: ${originalQuestion.questionText}
    Question Type: ${originalQuestion.questionType}
    Target Domains: ${originalQuestion.targetedDomains.join(', ')}
    
    Staff Feedback: ${staffFeedback}
    
    Please refine this question based on the feedback while maintaining:
    - Educational effectiveness
    - Appropriate difficulty level (${originalQuestion.estimatedDifficulty})
    - Clear learning objectives
    - Alignment with cognitive domains
    
    Provide the refined question in the same structured format.
    `;

    try {
      let refinedQuestion: AIGeneratedQuestion;

      switch (aiProvider) {
        case 'anthropic':
          refinedQuestion = await this.refineWithAnthropic(refinementPrompt, originalQuestion);
          break;
        case 'openai':
          refinedQuestion = await this.refineWithOpenAI(refinementPrompt, originalQuestion);
          break;
        case 'gemini':
          refinedQuestion = await this.refineWithGemini(refinementPrompt, originalQuestion);
          break;
        default:
          throw new Error(`Unsupported AI provider: ${aiProvider}`);
      }

      // Track refinement patterns for learning
      this.recordRefinementPattern(originalQuestion, refinedQuestion, staffFeedback);

      return refinedQuestion;

    } catch (error) {
      console.error(`Error refining question with ${aiProvider}:`, error);
      throw error;
    }
  }

  /**
   * Estimate question difficulty using assessment data patterns
   */
  async estimateQuestionDifficulty(questionContent: string): Promise<DifficultyEstimate> {
    // Analyze question complexity factors
    const complexityFactors = this.analyzeQuestionComplexity(questionContent);
    
    // Compare with similar questions in database
    const similarQuestions = await this.findSimilarQuestions(questionContent);
    
    // Calculate difficulty estimate using multiple factors
    const estimatedDifficulty = this.calculateDifficultyScore(complexityFactors, similarQuestions);
    
    return {
      estimatedDifficulty,
      confidenceLevel: this.calculateConfidenceLevel(similarQuestions.length),
      reasoning: this.explainDifficultyReasoning(complexityFactors),
      calibrationData: {
        similarQuestions: similarQuestions.length,
        averagePerformance: this.calculateAveragePerformance(similarQuestions)
      }
    };
  }

  // Private helper methods

  private calculateSeverity(score: number, irtTheta: number): number {
    // Lower scores and lower ability = higher severity
    return (1 - score) * (1 - Math.tanh(irtTheta));
  }

  private analyzeResponsePatterns(responses: AssessmentResults['responses']) {
    return {
      averageResponseTime: responses.reduce((sum, r) => sum + r.responseTime, 0) / responses.length,
      hintsUsedFrequency: responses.filter(r => r.aiHintUsed).length / responses.length,
      errorPatterns: this.identifyErrorPatterns(responses),
      difficultyDistribution: this.analyzeDifficultyDistribution(responses)
    };
  }

  private identifyErrorPatterns(responses: AssessmentResults['responses']) {
    const errors = responses.filter(r => !r.isCorrect);
    const patterns = new Map<string, number>();
    
    errors.forEach(error => {
      const key = `${error.domain}_${Math.floor(error.difficulty / 100)}`;
      patterns.set(key, (patterns.get(key) || 0) + 1);
    });
    
    return Array.from(patterns.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([pattern]) => pattern);
  }

  private analyzeDifficultyDistribution(responses: AssessmentResults['responses']) {
    const difficulties = responses.map(r => r.difficulty);
    return {
      mean: difficulties.reduce((sum, d) => sum + d, 0) / difficulties.length,
      median: difficulties.sort()[Math.floor(difficulties.length / 2)],
      range: { min: Math.min(...difficulties), max: Math.max(...difficulties) }
    };
  }

  private calculateOptimalDifficultyRange(irtTheta: number, domainAnalysis: any[]) {
    // Target slightly above current ability for optimal learning
    const baseTarget = (irtTheta + 1) * 500 + 500; // Convert IRT scale to 0-1000
    const adjustment = domainAnalysis.length > 0 ? -50 : 0; // Easier if many weaknesses
    
    return {
      min: Math.max(200, baseTarget + adjustment - 100),
      max: Math.min(1000, baseTarget + adjustment + 100)
    };
  }

  private recommendQuestionTypes(responsePatterns: any, domainAnalysis: any[]) {
    const types = ['multiple_choice'];
    
    // Add open-ended for deeper understanding if needed
    if (responsePatterns.hintsUsedFrequency > 0.4) {
      types.push('open_ended');
    }
    
    // Add scenario-based for application skills
    if (domainAnalysis.some(d => d.domain.includes('reasoning') || d.domain.includes('creative'))) {
      types.push('scenario_based');
    }
    
    return types;
  }

  private identifyTargetSkills(domainAnalysis: any[], responses: AssessmentResults['responses']): string[] {
    const skills: string[] = [];
    
    domainAnalysis.forEach(domain => {
      switch (domain.domain) {
        case 'logical_reasoning':
          skills.push('deductive reasoning', 'pattern recognition', 'logical inference');
          break;
        case 'mathematical_concepts':
          skills.push('algebraic manipulation', 'numerical computation', 'mathematical modeling');
          break;
        case 'verbal_comprehension':
          skills.push('reading comprehension', 'vocabulary usage', 'textual analysis');
          break;
        // Add more cases as needed
      }
    });
    
    return skills.slice(0, 5); // Limit to top 5 skills
  }

  private determineUrgencyLevel(domainAnalysis: any[], responsePatterns: any): WeaknessAnalysis['urgencyLevel'] {
    const weaknessCount = domainAnalysis.length;
    const avgSeverity = domainAnalysis.reduce((sum, d) => sum + d.severity, 0) / weaknessCount;
    
    if (weaknessCount >= 4 || avgSeverity > 0.8) return 'critical';
    if (weaknessCount >= 3 || avgSeverity > 0.6) return 'high';
    if (weaknessCount >= 2 || avgSeverity > 0.4) return 'medium';
    return 'low';
  }

  private buildGenerationPrompt(
    analysis: WeaknessAnalysis,
    questionType: string,
    difficultyTarget: number
  ): string {
    return `
    You are an expert educational question designer creating personalized questions for a student.
    
    Student Analysis:
    - Primary weaknesses: ${analysis.primaryWeaknesses.join(', ')}
    - Secondary weaknesses: ${analysis.secondaryWeaknesses.join(', ')}
    - Target skills: ${analysis.targetSkills.join(', ')}
    - Urgency level: ${analysis.urgencyLevel}
    
    Question Requirements:
    - Type: ${questionType}
    - Difficulty level: ${difficultyTarget}/1000
    - Must target primary weakness areas
    - Include clear learning objectives
    - Provide detailed rationale for question design
    
    Generate 3 high-quality questions that will help this student improve in their weak areas.
    Each question should include:
    1. Clear, engaging question text
    2. Appropriate answer choices (if multiple choice)
    3. Correct answer with explanation
    4. Learning objectives addressed
    5. Rationale for targeting specific weaknesses
    6. Suggestions for follow-up questions
    
    Format as JSON array with structured question objects.
    `;
  }

  private async generateWithAnthropic(prompt: string): Promise<AIGeneratedQuestion[]> {
    if (!this.anthropic) throw new Error('Anthropic not initialized');
    const response = await this.anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }]
    });

    const content = Array.isArray(response.content) ? response.content[0] : response.content;
    if (typeof content === 'object' && 'text' in content) {
      return JSON.parse(content.text);
    }
    throw new Error('Invalid response format from Anthropic');
  }

  private async generateWithOpenAI(prompt: string): Promise<AIGeneratedQuestion[]> {
    if (!this.openai) throw new Error('OpenAI not initialized');
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 2000
    });

    const content = response.choices[0].message.content;
    if (content) {
      const parsed = JSON.parse(content);
      return parsed.questions || parsed;
    }
    throw new Error('Invalid response from OpenAI');
  }

  private async generateWithGemini(prompt: string): Promise<AIGeneratedQuestion[]> {
    if (!this.gemini) throw new Error('Gemini not initialized');
    const response = await this.gemini.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const content = response.text;
    if (content) {
      const parsed = JSON.parse(content);
      return parsed.questions || parsed;
    }
    throw new Error('Invalid response from Gemini');
  }

  private async validateQuestionQuality(question: AIGeneratedQuestion): Promise<AIGeneratedQuestion | null> {
    // Quality checks
    if (!question.questionText || question.questionText.length < 20) return null;
    if (!question.correctAnswer) return null;
    if (question.targetedDomains.length === 0) return null;
    if (question.estimatedDifficulty < 0 || question.estimatedDifficulty > 1000) return null;
    
    // Ensure multiple choice questions have valid options
    if (question.questionType === 'multiple_choice') {
      if (!question.options || question.options.length < 3) return null;
      if (!question.options.includes(question.correctAnswer)) return null;
    }
    
    return question;
  }

  private async refineWithAnthropic(prompt: string, original: AIGeneratedQuestion): Promise<AIGeneratedQuestion> {
    if (!this.anthropic) throw new Error('Anthropic client not initialized');
    const response = await this.anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }]
    });

    const content = Array.isArray(response.content) ? response.content[0] : response.content;
    if (typeof content === 'object' && 'text' in content) {
      const refined = JSON.parse(content.text);
      return { ...original, ...refined };
    }
    throw new Error('Invalid response format from Anthropic');
  }

  private async refineWithOpenAI(prompt: string, original: AIGeneratedQuestion): Promise<AIGeneratedQuestion> {
    if (!this.openai) throw new Error('OpenAI client not initialized');
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 1500
    });

    const content = response.choices[0].message.content;
    if (content) {
      const refined = JSON.parse(content);
      return { ...original, ...refined };
    }
    throw new Error('Invalid response from OpenAI');
  }

  private async refineWithGemini(prompt: string, original: AIGeneratedQuestion): Promise<AIGeneratedQuestion> {
    if (!this.gemini) throw new Error('Gemini client not initialized');
    const response = await this.gemini.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const content = response.text;
    if (content) {
      const refined = JSON.parse(content);
      return { ...original, ...refined };
    }
    throw new Error('Invalid response from Gemini');
  }

  private recordRefinementPattern(
    original: AIGeneratedQuestion,
    refined: AIGeneratedQuestion,
    feedback: string
  ): void {
    // Store patterns for machine learning improvements
    // [Inference] - This would be implemented to track how staff modifications improve questions
    console.log('Recording refinement pattern for ML learning...');
  }

  private analyzeQuestionComplexity(questionContent: string) {
    // Analyze various complexity factors
    return {
      wordCount: questionContent.split(' ').length,
      sentenceComplexity: this.calculateSentenceComplexity(questionContent),
      conceptualDepth: this.assessConceptualDepth(questionContent),
      cognitiveLoad: this.estimateCognitiveLoad(questionContent)
    };
  }

  private calculateSentenceComplexity(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = text.split(' ').length / sentences.length;
    return Math.min(10, avgWordsPerSentence / 2); // Normalize to 0-10 scale
  }

  private assessConceptualDepth(text: string): number {
    // [Inference] - This would use NLP to assess concept complexity
    const complexityMarkers = ['analyze', 'synthesize', 'evaluate', 'compare', 'contrast'];
    const markerCount = complexityMarkers.filter(marker => 
      text.toLowerCase().includes(marker)
    ).length;
    return Math.min(10, markerCount * 2);
  }

  private estimateCognitiveLoad(text: string): number {
    // [Inference] - Estimate mental processing required
    const factors = {
      length: Math.min(5, text.length / 100),
      complexity: this.calculateSentenceComplexity(text),
      abstractConcepts: this.countAbstractConcepts(text)
    };
    return Math.min(10, (factors.length + factors.complexity + factors.abstractConcepts) / 3);
  }

  private countAbstractConcepts(text: string): number {
    const abstractMarkers = ['concept', 'principle', 'theory', 'model', 'framework'];
    return abstractMarkers.filter(marker => text.toLowerCase().includes(marker)).length;
  }

  private async findSimilarQuestions(questionContent: string) {
    // [Inference] - This would query database for similar questions
    // For now, return empty array as placeholder
    return [];
  }

  private calculateDifficultyScore(complexityFactors: any, similarQuestions: any[]): number {
    // Combine various factors to estimate difficulty
    const baseScore = (
      complexityFactors.wordCount * 0.1 +
      complexityFactors.sentenceComplexity * 50 +
      complexityFactors.conceptualDepth * 80 +
      complexityFactors.cognitiveLoad * 60
    );
    
    return Math.max(200, Math.min(1000, baseScore));
  }

  private calculateConfidenceLevel(similarQuestionCount: number): number {
    // More similar questions = higher confidence in difficulty estimate
    return Math.min(1.0, similarQuestionCount / 10);
  }

  private explainDifficultyReasoning(complexityFactors: any): string {
    const reasons = [];
    
    if (complexityFactors.wordCount > 50) reasons.push('lengthy question text');
    if (complexityFactors.sentenceComplexity > 6) reasons.push('complex sentence structure');
    if (complexityFactors.conceptualDepth > 4) reasons.push('high conceptual depth');
    if (complexityFactors.cognitiveLoad > 6) reasons.push('significant cognitive load');
    
    return reasons.length > 0 ? 
      `Difficulty influenced by: ${reasons.join(', ')}` :
      'Standard difficulty based on content analysis';
  }

  private calculateAveragePerformance(similarQuestions: any[]): number {
    // [Inference] - Calculate average performance on similar questions
    return similarQuestions.length > 0 ? 0.65 : 0.5; // Default to 50% if no data
  }
}

export default CustomQuestionGenerator;
// AI-Powered Question Bank Seeder for EiQ™ Platform
import { storage } from "../storage";
import { curriculumModules } from "../../shared/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

interface QuestionTemplate {
  domain: string;
  difficulty: number;
  questionType: string;
  ageGroup: string;
  cognitiveSkill: string;
}

export class QuestionBankSeeder {
  private questionTemplates: QuestionTemplate[] = [
    // Mathematical Reasoning (IQ Focus)
    { domain: "mathematical_reasoning", difficulty: 0.3, questionType: "multiple_choice", ageGroup: "K-5", cognitiveSkill: "pattern_recognition" },
    { domain: "mathematical_reasoning", difficulty: 0.5, questionType: "multiple_choice", ageGroup: "6-8", cognitiveSkill: "algebraic_thinking" },
    { domain: "mathematical_reasoning", difficulty: 0.7, questionType: "multiple_choice", ageGroup: "9-12", cognitiveSkill: "advanced_problem_solving" },
    { domain: "mathematical_reasoning", difficulty: 0.8, questionType: "open_ended", ageGroup: "adult", cognitiveSkill: "mathematical_modeling" },
    
    // Logical Reasoning (IQ Focus)
    { domain: "logical_reasoning", difficulty: 0.4, questionType: "multiple_choice", ageGroup: "K-5", cognitiveSkill: "basic_logic" },
    { domain: "logical_reasoning", difficulty: 0.6, questionType: "multiple_choice", ageGroup: "6-8", cognitiveSkill: "conditional_reasoning" },
    { domain: "logical_reasoning", difficulty: 0.7, questionType: "multiple_choice", ageGroup: "9-12", cognitiveSkill: "deductive_reasoning" },
    { domain: "logical_reasoning", difficulty: 0.9, questionType: "open_ended", ageGroup: "adult", cognitiveSkill: "formal_logic" },
    
    // Spatial Intelligence (IQ Focus)
    { domain: "spatial_intelligence", difficulty: 0.3, questionType: "visual", ageGroup: "K-5", cognitiveSkill: "shape_recognition" },
    { domain: "spatial_intelligence", difficulty: 0.5, questionType: "visual", ageGroup: "6-8", cognitiveSkill: "mental_rotation" },
    { domain: "spatial_intelligence", difficulty: 0.7, questionType: "visual", ageGroup: "9-12", cognitiveSkill: "3d_visualization" },
    { domain: "spatial_intelligence", difficulty: 0.8, questionType: "visual", ageGroup: "adult", cognitiveSkill: "spatial_reasoning" },
    
    // Verbal Comprehension (IQ Focus)
    { domain: "verbal_comprehension", difficulty: 0.4, questionType: "multiple_choice", ageGroup: "K-5", cognitiveSkill: "vocabulary" },
    { domain: "verbal_comprehension", difficulty: 0.6, questionType: "multiple_choice", ageGroup: "6-8", cognitiveSkill: "reading_comprehension" },
    { domain: "verbal_comprehension", difficulty: 0.7, questionType: "multiple_choice", ageGroup: "9-12", cognitiveSkill: "verbal_reasoning" },
    { domain: "verbal_comprehension", difficulty: 0.8, questionType: "essay", ageGroup: "adult", cognitiveSkill: "complex_analysis" },
    
    // Emotional Intelligence (EQ Focus)
    { domain: "emotional_awareness", difficulty: 0.3, questionType: "scenario", ageGroup: "K-5", cognitiveSkill: "emotion_recognition" },
    { domain: "emotional_awareness", difficulty: 0.5, questionType: "scenario", ageGroup: "6-8", cognitiveSkill: "empathy_development" },
    { domain: "emotional_awareness", difficulty: 0.7, questionType: "scenario", ageGroup: "9-12", cognitiveSkill: "emotional_regulation" },
    { domain: "emotional_awareness", difficulty: 0.8, questionType: "scenario", ageGroup: "adult", cognitiveSkill: "emotional_leadership" },
    
    // Social Skills (EQ Focus)
    { domain: "social_skills", difficulty: 0.4, questionType: "scenario", ageGroup: "K-5", cognitiveSkill: "cooperation" },
    { domain: "social_skills", difficulty: 0.6, questionType: "scenario", ageGroup: "6-8", cognitiveSkill: "conflict_resolution" },
    { domain: "social_skills", difficulty: 0.7, questionType: "scenario", ageGroup: "9-12", cognitiveSkill: "leadership_skills" },
    { domain: "social_skills", difficulty: 0.8, questionType: "scenario", ageGroup: "adult", cognitiveSkill: "team_dynamics" }
  ];

  private sampleQuestions = {
    mathematical_reasoning: {
      K5: [
        {
          question: "If Sarah has 3 apples and her friend gives her 2 more apples, how many apples does Sarah have in total?",
          options: ["4", "5", "6", "7"],
          correctAnswer: "5",
          explanation: "3 + 2 = 5 apples total"
        },
        {
          question: "Look at this pattern: 2, 4, 6, 8, ?. What number comes next?",
          options: ["9", "10", "11", "12"],
          correctAnswer: "10",
          explanation: "The pattern increases by 2 each time"
        }
      ],
      "6-8": [
        {
          question: "If x + 7 = 15, what is the value of x?",
          options: ["6", "7", "8", "9"],
          correctAnswer: "8",
          explanation: "x = 15 - 7 = 8"
        },
        {
          question: "A rectangle has a length of 12 cm and width of 8 cm. What is its area?",
          options: ["20 cm²", "40 cm²", "96 cm²", "160 cm²"],
          correctAnswer: "96 cm²",
          explanation: "Area = length × width = 12 × 8 = 96 cm²"
        }
      ]
    },
    logical_reasoning: {
      K5: [
        {
          question: "All cats have whiskers. Fluffy is a cat. What can we conclude?",
          options: ["Fluffy is big", "Fluffy has whiskers", "Fluffy is black", "Fluffy likes fish"],
          correctAnswer: "Fluffy has whiskers",
          explanation: "If all cats have whiskers and Fluffy is a cat, then Fluffy must have whiskers"
        }
      ],
      "6-8": [
        {
          question: "If it rains, then the ground gets wet. The ground is not wet. What can we conclude?",
          options: ["It rained", "It didn't rain", "It might rain", "The ground is dirty"],
          correctAnswer: "It didn't rain",
          explanation: "This uses logical contraposition: if rain causes wet ground, then dry ground means no rain"
        }
      ]
    },
    emotional_awareness: {
      K5: [
        {
          question: "Jamie just dropped their ice cream and started crying. How do you think Jamie feels?",
          options: ["Happy", "Sad", "Angry", "Excited"],
          correctAnswer: "Sad",
          explanation: "Crying after losing something enjoyable indicates sadness"
        }
      ],
      "6-8": [
        {
          question: "Your friend didn't invite you to their birthday party. You feel hurt. What's the best way to handle this?",
          options: ["Ignore them forever", "Talk to them about how you feel", "Spread rumors about them", "Pretend you don't care"],
          correctAnswer: "Talk to them about how you feel",
          explanation: "Open communication helps resolve emotional conflicts and maintains relationships"
        }
      ]
    }
  };

  async generateQuestionBank(): Promise<void> {
    console.log('[QUESTION SEEDER] Starting question bank generation...');
    
    let totalGenerated = 0;
    const moduleId = await this.getRandomModuleId();
    
    for (const template of this.questionTemplates) {
      // Generate 10-15 questions per template
      const questionsPerTemplate = Math.floor(Math.random() * 6) + 10;
      
      for (let i = 0; i < questionsPerTemplate; i++) {
        const questionData = this.generateQuestionFromTemplate(template, i);
        
        try {
          await storage.createQuestionBankEntry({
            moduleId,
            questionType: template.questionType,
            subject: template.domain,
            topic: template.cognitiveSkill,
            difficulty: String(template.difficulty + (Math.random() * 0.2 - 0.1)), // Add slight variation
            questionText: questionData.question,
            questionData: JSON.stringify({
              options: questionData.options || [],
              correctAnswer: questionData.correctAnswer,
              explanation: questionData.explanation
            }),
            explanation: questionData.explanation,
            hints: JSON.stringify([
              'Consider the problem step by step',
              'Look at the key information given',
              'Apply the relevant concepts'
            ]),
            tags: JSON.stringify(this.generateTags(template)),
            aiGenerated: true,
            usageCount: 0,
            successRate: String(75 + Math.random() * 25), // Random success rate 75-100%
            averageTime: this.calculateTimeLimit(template.difficulty, template.questionType),
            isActive: true
          });
          
          totalGenerated++;
        } catch (error) {
          console.error(`[QUESTION SEEDER] Error creating question:`, error);
        }
      }
    }
    
    console.log(`[QUESTION SEEDER] ✅ Generated ${totalGenerated} questions across ${this.questionTemplates.length} templates`);
  }

  private generateQuestionFromTemplate(template: QuestionTemplate, index: number) {
    // Use sample questions when available
    const domainSamples = this.sampleQuestions[template.domain as keyof typeof this.sampleQuestions];
    const ageGroupSamples = domainSamples?.[template.ageGroup as keyof typeof domainSamples] as any[];
    
    if (ageGroupSamples && ageGroupSamples.length > 0) {
      const sample = ageGroupSamples[index % ageGroupSamples.length];
      return sample;
    }

    // Generate synthetic question if no samples available
    return this.generateSyntheticQuestion(template, index);
  }

  private generateSyntheticQuestion(template: QuestionTemplate, index: number) {
    const questionId = `${template.domain}_${template.ageGroup}_${index}`;
    
    const baseQuestions = {
      mathematical_reasoning: `Solve this ${template.cognitiveSkill} problem for ${template.ageGroup} level`,
      logical_reasoning: `Apply ${template.cognitiveSkill} to solve this logical puzzle`,
      spatial_intelligence: `Use ${template.cognitiveSkill} to analyze this spatial pattern`,
      verbal_comprehension: `Demonstrate ${template.cognitiveSkill} in understanding this text`,
      emotional_awareness: `Show ${template.cognitiveSkill} in this emotional scenario`,
      social_skills: `Apply ${template.cognitiveSkill} in this social situation`
    };

    const question = baseQuestions[template.domain as keyof typeof baseQuestions] || "Sample question";
    
    let options: string[] = [];
    let correctAnswer = "";
    
    if (template.questionType === 'multiple_choice') {
      options = [`Option A for ${questionId}`, `Option B for ${questionId}`, `Option C for ${questionId}`, `Option D for ${questionId}`];
      correctAnswer = options[0];
    } else if (template.questionType === 'scenario') {
      options = ['Response A', 'Response B', 'Response C', 'Response D'];
      correctAnswer = 'Response A';
    }

    return {
      question: `${question} (${questionId})`,
      options,
      correctAnswer,
      explanation: `This tests ${template.cognitiveSkill} at ${template.difficulty} difficulty level`
    };
  }

  private calculatePoints(difficulty: number): number {
    return Math.floor(10 + (difficulty * 40)); // 10-50 points based on difficulty
  }

  private calculateTimeLimit(difficulty: number, questionType: string): number {
    const baseTime = questionType === 'essay' ? 600 : questionType === 'open_ended' ? 300 : 60;
    return Math.floor(baseTime * (1 + difficulty));
  }

  private generateTags(template: QuestionTemplate): string[] {
    return [
      template.domain,
      template.cognitiveSkill,
      template.ageGroup,
      `difficulty_${Math.floor(template.difficulty * 10)}`,
      template.questionType
    ];
  }

  async getRandomModuleId(): Promise<string> {
    try {
      const modules = await db.select({ id: curriculumModules.id }).from(curriculumModules).limit(10);
      if (modules.length === 0) {
        console.warn('[QUESTION SEEDER] No modules found in database, using fallback module ID');
        return 'fallback_module_id';
      }
      const randomModule = modules[Math.floor(Math.random() * modules.length)];
      return randomModule.id;
    } catch (error) {
      console.error('[QUESTION SEEDER] Error fetching modules:', error);
      return 'fallback_module_id';
    }
  }
}
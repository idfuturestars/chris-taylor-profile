// Custom Questions Seeder for Staff-Generated AI Questions
import { storage } from "../storage";
import { users } from "../../shared/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

interface CustomQuestionTemplate {
  staffRole: string;
  questionCategory: string;
  targetWeakness: string;
  difficultyLevel: number;
  questionType: string;
}

export class CustomQuestionsSeeder {
  private staffRoles = ['teacher', 'administrator', 'curriculum_specialist', 'assessment_coordinator'];
  
  private questionCategories = [
    'remediation', 'enrichment', 'diagnostic', 'practice', 'challenge',
    'real_world_application', 'project_based', 'collaborative'
  ];

  private targetWeaknesses = [
    'mathematical_operations', 'reading_comprehension', 'logical_reasoning',
    'spatial_awareness', 'emotional_regulation', 'social_interaction',
    'attention_focus', 'memory_retention', 'pattern_recognition',
    'problem_solving_strategy', 'critical_thinking', 'creative_expression'
  ];

  private questionTypes = ['multiple_choice', 'open_ended', 'scenario_based', 'interactive', 'project'];

  async generateCustomQuestions(): Promise<void> {
    console.log('[CUSTOM QUESTIONS SEEDER] Starting custom questions generation...');
    
    let totalGenerated = 0;
    
    // Generate questions from different staff perspectives
    for (const staffRole of this.staffRoles) {
      const questionsPerRole = 25 + Math.floor(Math.random() * 15); // 25-40 questions per role
      
      for (let i = 0; i < questionsPerRole; i++) {
        const questionData = await this.generateStaffQuestion(staffRole, i);
        
        try {
          await storage.createSeederCustomQuestion({
            staffId: await this.getRandomStaffId(),
            title: questionData.title,
            description: questionData.description,
            questionText: questionData.questionText,
            questionType: questionData.questionType,
            options: JSON.stringify(questionData.options),
            correctAnswer: questionData.correctAnswer,
            explanation: questionData.explanation,
            targetWeakness: questionData.targetWeakness,
            difficultyLevel: questionData.difficultyLevel,
            cognitiveDomain: questionData.cognitiveDomain,
            ageGroup: questionData.ageGroup,
            estimatedTime: questionData.estimatedTime,
            pointsValue: questionData.pointsValue,
            aiGeneratedMetadata: JSON.stringify(questionData.aiMetadata),
            staffNotes: questionData.staffNotes,
            usageContext: questionData.usageContext,
            createdBy: questionData.createdBy,
            category: questionData.category,
            isPublished: Math.random() > 0.2, // 80% published
            validationStatus: questionData.validationStatus
          });
          
          totalGenerated++;
        } catch (error) {
          console.error(`[CUSTOM QUESTIONS SEEDER] Error creating custom question:`, error);
        }
      }
    }
    
    console.log(`[CUSTOM QUESTIONS SEEDER] ✅ Generated ${totalGenerated} custom questions from ${this.staffRoles.length} staff roles`);
  }

  async getRandomStaffId(): Promise<string> {
    try {
      const staffUsers = await db.select({ id: users.id }).from(users).where(eq(users.role, 'staff')).limit(10);
      if (staffUsers.length === 0) {
        console.warn('[CUSTOM QUESTIONS SEEDER] No staff users found, using fallback staff ID');
        return 'fallback_staff_id';
      }
      const randomStaff = staffUsers[Math.floor(Math.random() * staffUsers.length)];
      return randomStaff.id;
    } catch (error) {
      console.error('[CUSTOM QUESTIONS SEEDER] Error fetching staff users:', error);
      return 'fallback_staff_id';
    }
  }

  private async generateStaffQuestion(staffRole: string, index: number) {
    const category = this.questionCategories[Math.floor(Math.random() * this.questionCategories.length)];
    const targetWeakness = this.targetWeaknesses[Math.floor(Math.random() * this.targetWeaknesses.length)];
    const questionType = this.questionTypes[Math.floor(Math.random() * this.questionTypes.length)];
    const difficultyLevel = Math.random() * 0.8 + 0.2; // 0.2 to 1.0
    
    const questionId = `${staffRole}_${category}_${index}`;
    
    return {
      title: this.generateQuestionTitle(staffRole, category, targetWeakness),
      description: this.generateQuestionDescription(category, targetWeakness),
      questionText: this.generateQuestionText(staffRole, category, targetWeakness, questionType),
      questionType,
      options: this.generateOptions(questionType, targetWeakness),
      correctAnswer: this.generateCorrectAnswer(questionType, targetWeakness),
      explanation: this.generateExplanation(targetWeakness, staffRole),
      targetWeakness,
      difficultyLevel,
      cognitiveDomain: this.mapWeaknessToDomain(targetWeakness),
      ageGroup: this.selectAgeGroup(staffRole),
      estimatedTime: this.calculateEstimatedTime(questionType, difficultyLevel),
      pointsValue: this.calculatePointsValue(difficultyLevel, questionType),
      aiMetadata: this.generateAIMetadata(staffRole, category, targetWeakness),
      staffNotes: this.generateStaffNotes(staffRole, category),
      usageContext: this.generateUsageContext(category, staffRole),
      createdBy: this.generateStaffId(staffRole, index),
      category,
      validationStatus: this.selectValidationStatus()
    };
  }

  private generateQuestionTitle(staffRole: string, category: string, weakness: string): string {
    const titleTemplates = {
      teacher: [
        `${category} Question: Addressing ${weakness}`,
        `Classroom Practice: ${weakness} Focus`,
        `Student Support: ${weakness} Development`
      ],
      administrator: [
        `Assessment Tool: ${weakness} Evaluation`,
        `School-wide Initiative: ${weakness} Improvement`,
        `Performance Metric: ${weakness} Tracking`
      ],
      curriculum_specialist: [
        `Curriculum Enhancement: ${weakness} Integration`,
        `Learning Objective: ${weakness} Mastery`,
        `Standards Alignment: ${weakness} Focus`
      ],
      assessment_coordinator: [
        `Diagnostic Assessment: ${weakness} Identification`,
        `Progress Monitor: ${weakness} Growth`,
        `Intervention Strategy: ${weakness} Support`
      ]
    };

    const templates = titleTemplates[staffRole as keyof typeof titleTemplates] || titleTemplates.teacher;
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private generateQuestionDescription(category: string, weakness: string): string {
    return `This ${category} question targets ${weakness.replace('_', ' ')} and helps identify specific areas where students need additional support and practice.`;
  }

  private generateQuestionText(staffRole: string, category: string, weakness: string, questionType: string): string {
    const questionTemplates = {
      mathematical_operations: {
        multiple_choice: "Solve the following problem and select the correct answer:",
        open_ended: "Show your work step by step to solve this problem:",
        scenario_based: "In this real-world scenario, apply mathematical operations to find the solution:",
        interactive: "Use the interactive tools to demonstrate your mathematical reasoning:",
        project: "Design a project that showcases your understanding of mathematical operations:"
      },
      reading_comprehension: {
        multiple_choice: "Read the passage carefully and answer the comprehension question:",
        open_ended: "Analyze the text and provide a detailed explanation of the main themes:",
        scenario_based: "Based on this reading scenario, make connections to real-world applications:",
        interactive: "Interact with the text elements to demonstrate understanding:",
        project: "Create a comprehensive project based on your reading comprehension:"
      },
      logical_reasoning: {
        multiple_choice: "Apply logical reasoning to solve this problem:",
        open_ended: "Explain your logical thought process for solving this challenge:",
        scenario_based: "Use logical reasoning to analyze this complex scenario:",
        interactive: "Manipulate the logical elements to reach the correct conclusion:",
        project: "Design a logic-based project that demonstrates reasoning skills:"
      },
      emotional_regulation: {
        multiple_choice: "Choose the most appropriate emotional response in this situation:",
        open_ended: "Describe how you would handle your emotions in this scenario:",
        scenario_based: "Navigate this emotional scenario using regulation techniques:",
        interactive: "Use the emotion tools to practice regulation strategies:",
        project: "Create an emotion regulation plan for challenging situations:"
      }
    };

    const weaknessTemplates = questionTemplates[weakness as keyof typeof questionTemplates];
    if (weaknessTemplates) {
      return weaknessTemplates[questionType as keyof typeof weaknessTemplates] || 
             "This question assesses your understanding and application of key concepts.";
    }

    return `This ${category} question created by a ${staffRole} focuses on ${weakness.replace('_', ' ')} development.`;
  }

  private generateOptions(questionType: string, weakness: string): string[] {
    if (questionType !== 'multiple_choice') return [];

    const optionSets = {
      mathematical_operations: [
        "Calculate step by step", "Use mental math shortcuts", "Apply the formula directly", "Estimate then verify"
      ],
      reading_comprehension: [
        "Main idea is explicit", "Requires inference", "Multiple themes present", "Context dependent"
      ],
      logical_reasoning: [
        "If-then relationship", "Cause and effect", "Pattern recognition", "Systematic elimination"
      ],
      emotional_regulation: [
        "Take deep breaths", "Count to ten", "Talk to someone", "Use positive self-talk"
      ],
      social_interaction: [
        "Listen actively", "Ask clarifying questions", "Show empathy", "Find common ground"
      ]
    };

    return optionSets[weakness as keyof typeof optionSets] || 
           ["Option A", "Option B", "Option C", "Option D"];
  }

  private generateCorrectAnswer(questionType: string, weakness: string): string {
    if (questionType === 'multiple_choice') {
      const options = this.generateOptions(questionType, weakness);
      return options[0]; // First option is correct
    }
    
    return `Sample correct response for ${weakness.replace('_', ' ')} question`;
  }

  private generateExplanation(weakness: string, staffRole: string): string {
    const explanationTemplates = {
      teacher: `This answer demonstrates mastery of ${weakness.replace('_', ' ')} through classroom-tested methods.`,
      administrator: `From an administrative perspective, this response shows policy-aligned understanding of ${weakness.replace('_', ' ')}.`,
      curriculum_specialist: `This solution aligns with curriculum standards for ${weakness.replace('_', ' ')} development.`,
      assessment_coordinator: `Assessment data shows this approach effectively measures ${weakness.replace('_', ' ')} competency.`
    };

    return explanationTemplates[staffRole as keyof typeof explanationTemplates] || 
           `This explanation helps students understand the correct approach to ${weakness.replace('_', ' ')}.`;
  }

  private mapWeaknessToDomain(weakness: string): string {
    const domainMapping = {
      mathematical_operations: 'mathematical_reasoning',
      reading_comprehension: 'verbal_comprehension',
      logical_reasoning: 'logical_reasoning',
      spatial_awareness: 'spatial_intelligence',
      emotional_regulation: 'emotional_awareness',
      social_interaction: 'social_skills',
      attention_focus: 'cognitive_processing',
      memory_retention: 'working_memory',
      pattern_recognition: 'pattern_analysis',
      problem_solving_strategy: 'strategic_thinking',
      critical_thinking: 'analytical_reasoning',
      creative_expression: 'creative_intelligence'
    };

    return domainMapping[weakness as keyof typeof domainMapping] || 'general_cognitive';
  }

  private selectAgeGroup(staffRole: string): string {
    const ageGroupPreferences = {
      teacher: ['K-5', '6-8', '9-12'],
      administrator: ['6-8', '9-12', 'adult'],
      curriculum_specialist: ['K-5', '6-8', '9-12'],
      assessment_coordinator: ['3-5', '6-8', '9-12', 'adult']
    };

    const preferences = ageGroupPreferences[staffRole as keyof typeof ageGroupPreferences] || ['6-8', '9-12'];
    return preferences[Math.floor(Math.random() * preferences.length)];
  }

  private calculateEstimatedTime(questionType: string, difficulty: number): number {
    const baseTime = {
      multiple_choice: 90,
      open_ended: 300,
      scenario_based: 180,
      interactive: 240,
      project: 1800
    };

    const time = baseTime[questionType as keyof typeof baseTime] || 180;
    return Math.floor(time * (1 + difficulty * 0.5));
  }

  private calculatePointsValue(difficulty: number, questionType: string): number {
    const basePoints = {
      multiple_choice: 10,
      open_ended: 25,
      scenario_based: 20,
      interactive: 30,
      project: 50
    };

    const points = basePoints[questionType as keyof typeof basePoints] || 15;
    return Math.floor(points * (1 + difficulty));
  }

  private generateAIMetadata(staffRole: string, category: string, weakness: string) {
    return {
      ai_confidence_score: Math.random() * 0.3 + 0.7, // 0.7 to 1.0
      generation_model: 'gpt-4o',
      refinement_iterations: Math.floor(Math.random() * 3) + 1,
      staff_input_weight: staffRole === 'teacher' ? 0.8 : 0.6,
      automated_tags: [category, weakness, `${staffRole}_created`],
      quality_metrics: {
        clarity: Math.random() * 0.2 + 0.8,
        relevance: Math.random() * 0.15 + 0.85,
        difficulty_accuracy: Math.random() * 0.25 + 0.75,
        engagement_potential: Math.random() * 0.3 + 0.7
      },
      adaptability_score: Math.random() * 0.4 + 0.6
    };
  }

  private generateStaffNotes(staffRole: string, category: string): string {
    const noteTemplates = {
      teacher: `Classroom observation: This ${category} question addresses a common student challenge I've noticed.`,
      administrator: `Administrative insight: This question aligns with our school improvement goals for ${category}.`,
      curriculum_specialist: `Curriculum note: This question fills a gap in our current ${category} assessment tools.`,
      assessment_coordinator: `Assessment note: This question provides valuable data for student progress tracking.`
    };

    return noteTemplates[staffRole as keyof typeof noteTemplates] || 
           `Staff observation: This question serves an important educational purpose.`;
  }

  private generateUsageContext(category: string, staffRole: string): string {
    const contexts = [
      'individual_remediation', 'group_practice', 'diagnostic_assessment',
      'progress_monitoring', 'enrichment_activity', 'collaborative_learning',
      'independent_study', 'classroom_discussion', 'homework_assignment', 'test_preparation'
    ];

    return contexts[Math.floor(Math.random() * contexts.length)];
  }

  private generateStaffId(staffRole: string, index: number): string {
    const roleAbbreviation = {
      teacher: 'TCH',
      administrator: 'ADM', 
      curriculum_specialist: 'CUR',
      assessment_coordinator: 'ASS'
    };

    const abbrev = roleAbbreviation[staffRole as keyof typeof roleAbbreviation] || 'STF';
    return `${abbrev}_${(index + 1).toString().padStart(3, '0')}`;
  }

  private selectValidationStatus(): string {
    const statuses = ['pending', 'approved', 'needs_revision', 'approved'];
    // 50% approved, 25% pending, 25% needs_revision
    const weights = [0.25, 0.5, 0.25, 0.5];
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < statuses.length; i++) {
      cumulative += weights[i];
      if (random < cumulative) {
        return statuses[i];
      }
    }
    
    return 'pending';
  }
}
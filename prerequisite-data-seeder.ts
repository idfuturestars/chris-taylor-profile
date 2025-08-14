// Prerequisite Data Seeder - Creates necessary foundation data for other seeders
import { storage } from "../storage";
import { db } from "../db";
import { curriculumModules, industryTracks } from "../../shared/schema";

export class PrerequisiteDataSeeder {
  async seedPrerequisiteData(): Promise<void> {
    console.log('[PREREQUISITE SEEDER] Starting prerequisite data seeding...');
    
    // Create industry track first (required for curriculum_modules)
    await this.createIndustryTrack();
    
    // Create curriculum modules (required for question_bank)
    await this.createCurriculumModules();
    
    // Create staff users (required for custom_questions)
    await this.createStaffUsers();
    
    console.log('[PREREQUISITE SEEDER] ✅ All prerequisite data created successfully');
  }

  private async createIndustryTrack(): Promise<void> {
    console.log('[PREREQUISITE SEEDER] Checking for existing industry track...');
    
    // Check if a track already exists
    const existingTracks = await db.select({ id: industryTracks.id }).from(industryTracks).limit(1);
    if (existingTracks.length > 0) {
      console.log(`[PREREQUISITE SEEDER] Using existing industry track: ${existingTracks[0].id}`);
      return;
    }
    
    try {
      await db.insert(industryTracks).values({
        name: 'General Education Track',
        displayName: 'General Education Assessment',
        description: 'Comprehensive educational assessment track for all age groups',
        focusAreas: ['cognitive_assessment', 'emotional_intelligence', 'academic_skills'],
        ageRanges: ['K-2', '3-5', '6-8', '9-12', 'adult'],
        prerequisites: ['basic_literacy', 'computer_access'],
        learningObjectives: ['Assess cognitive abilities', 'Measure emotional intelligence', 'Identify learning gaps'],
        industryPartners: ['Educational Assessment Board', 'Academic Standards Council'],
        isActive: true
      });
      console.log('[PREREQUISITE SEEDER] Created default industry track');
    } catch (error) {
      console.error('[PREREQUISITE SEEDER] Error creating industry track:', error);
    }
  }

  private async createCurriculumModules(): Promise<void> {
    console.log('[PREREQUISITE SEEDER] Creating curriculum modules...');
    
    const modules = [
      {
        id: 'cognitive-foundations',
        title: 'Cognitive Foundations',
        description: 'Core cognitive assessment modules for IQ measurement',
        subject_area: 'cognitive',
        grade_levels: ['K-2', '3-5', '6-8', '9-12', 'adult'],
        learning_objectives: ['Pattern recognition', 'Logical reasoning', 'Spatial awareness']
      },
      {
        id: 'emotional-intelligence',
        title: 'Emotional Intelligence',
        description: 'EQ assessment and social-emotional learning modules',
        subject_area: 'emotional',
        grade_levels: ['K-2', '3-5', '6-8', '9-12', 'adult'],
        learning_objectives: ['Emotional regulation', 'Social interaction', 'Empathy development']
      },
      {
        id: 'mathematical-reasoning',
        title: 'Mathematical Reasoning',
        description: 'Mathematical thinking and problem-solving assessment',
        subject_area: 'mathematics',
        grade_levels: ['3-5', '6-8', '9-12', 'adult'],
        learning_objectives: ['Numerical operations', 'Mathematical reasoning', 'Problem solving']
      },
      {
        id: 'verbal-comprehension',
        title: 'Verbal Comprehension',
        description: 'Language processing and reading comprehension assessment',
        subject_area: 'language',
        grade_levels: ['K-2', '3-5', '6-8', '9-12', 'adult'],
        learning_objectives: ['Reading comprehension', 'Vocabulary development', 'Language processing']
      },
      {
        id: 'creative-thinking',
        title: 'Creative Thinking',
        description: 'Creative problem-solving and innovation assessment',
        subject_area: 'creativity',
        grade_levels: ['3-5', '6-8', '9-12', 'adult'],
        learning_objectives: ['Creative expression', 'Innovation thinking', 'Artistic reasoning']
      }
    ];

    let modulesCreated = 0;
    for (const moduleData of modules) {
      try {
        // Get the first available industry track
        const availableTracks = await db.select({ id: industryTracks.id }).from(industryTracks).limit(1);
        const trackId = availableTracks.length > 0 ? availableTracks[0].id : 'default_track';
        
        await db.insert(curriculumModules).values({
          trackId: trackId,
          name: moduleData.title,
          description: moduleData.description,
          gradeLevel: moduleData.grade_levels[0], // Use first grade level as primary
          subject: moduleData.subject_area,
          difficulty: 'intermediate', // Use string value as per schema
          estimatedDuration: Math.floor(Math.random() * 30) + 15, // 15-45 minutes
          learningObjectives: moduleData.learning_objectives,
          assessmentCriteria: ['completion', 'accuracy', 'understanding'],
          contentStructure: {
            sections: ['introduction', 'practice', 'assessment'],
            duration: Math.floor(Math.random() * 30) + 15
          },
          isActive: true
        });
        modulesCreated++;
      } catch (error) {
        console.error(`[PREREQUISITE SEEDER] Error creating module ${moduleData.id}:`, error);
      }
    }
    
    console.log(`[PREREQUISITE SEEDER] Created ${modulesCreated} curriculum modules`);
  }

  private async createStaffUsers(): Promise<void> {
    console.log('[PREREQUISITE SEEDER] Creating staff users...');
    
    const staffUsers = [
      {
        email: 'teacher1@eiq.edu',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'staff' as const,
        ageGroup: 'adult',
        profileData: {
          specialization: 'Elementary Education',
          experience: '8 years',
          certifications: ['Teaching License', 'Special Education']
        }
      },
      {
        email: 'admin1@eiq.edu',
        firstName: 'Michael',
        lastName: 'Chen',
        role: 'staff' as const,
        ageGroup: 'adult',
        profileData: {
          specialization: 'Educational Administration',
          experience: '12 years',
          certifications: ['Admin License', 'Curriculum Development']
        }
      },
      {
        email: 'specialist1@eiq.edu',
        firstName: 'Dr. Emily',
        lastName: 'Rodriguez',
        role: 'staff' as const,
        ageGroup: 'adult',
        profileData: {
          specialization: 'Curriculum Specialist',
          experience: '15 years',
          certifications: ['PhD Education', 'Assessment Specialist']
        }
      },
      {
        email: 'coordinator1@eiq.edu',
        firstName: 'James',
        lastName: 'Wilson',
        role: 'staff' as const,
        ageGroup: 'adult',
        profileData: {
          specialization: 'Assessment Coordination',
          experience: '6 years',
          certifications: ['Assessment License', 'Data Analysis']
        }
      }
    ];

    let staffCreated = 0;
    for (const staffData of staffUsers) {
      try {
        await storage.createUser({
          email: staffData.email,
          firstName: staffData.firstName,
          lastName: staffData.lastName,
          role: staffData.role,
          password: 'hashed_password_placeholder' // This would be properly hashed in real usage
        });
        staffCreated++;
      } catch (error) {
        console.error(`[PREREQUISITE SEEDER] Error creating staff user ${staffData.email}:`, error);
      }
    }
    
    console.log(`[PREREQUISITE SEEDER] Created ${staffCreated} staff users`);
  }
}
import { Router, Request, Response } from 'express';
import { db } from '../db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { isAuthenticated } from '../replitAuth';

const router = Router();

// Global role models database with cognitive profiles
const ROLE_MODELS = [
  {
    id: 'elon-musk',
    name: 'Elon Musk',
    title: 'CEO & Chief Engineer',
    industry: 'Technology & Space',
    country: 'United States',
    profileImageUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop&crop=face',
    bio: 'Entrepreneur and business magnate known for Tesla, SpaceX, and advancing sustainable energy and space exploration.',
    eiqScore: 840,
    keyTraits: ['Visionary', 'Systems Thinking', 'Risk Tolerance', 'Innovation Focus'],
    achievements: ['Founded PayPal', 'CEO of Tesla', 'Founded SpaceX', 'Neuralink Co-founder'],
    learningPath: ['Physics & Engineering', 'Business Strategy', 'Sustainable Technology', 'Space Technology'],
    domains: {
      cognitiveReasoning: 95,
      mathematicalLogic: 92,
      verbalProficiency: 88,
      spatialIntelligence: 98,
      memoryProcessing: 85,
      processingSpeed: 94
    }
  },
  {
    id: 'marie-curie',
    name: 'Marie Curie',
    title: 'Physicist & Chemist',
    industry: 'Science & Research',
    country: 'France',
    profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    bio: 'Pioneering physicist and chemist, first woman to win a Nobel Prize and the only person to win Nobel Prizes in two different sciences.',
    eiqScore: 875,
    keyTraits: ['Analytical', 'Perseverance', 'Scientific Method', 'Detail-Oriented'],
    achievements: ['Two Nobel Prizes', 'Discovered Radium', 'Founded Nuclear Chemistry', 'First Female Professor at Sorbonne'],
    learningPath: ['Mathematical Physics', 'Chemistry', 'Laboratory Research', 'Scientific Writing'],
    domains: {
      cognitiveReasoning: 98,
      mathematicalLogic: 96,
      verbalProficiency: 85,
      spatialIntelligence: 88,
      memoryProcessing: 94,
      processingSpeed: 87
    }
  },
  {
    id: 'leonardo-da-vinci',
    name: 'Leonardo da Vinci',
    title: 'Polymath & Inventor',
    industry: 'Art & Science',
    country: 'Italy',
    profileImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=face',
    bio: 'Renaissance polymath known for his contributions to art, science, engineering, and anatomy.',
    eiqScore: 850,
    keyTraits: ['Creativity', 'Curiosity', 'Multidisciplinary', 'Observational'],
    achievements: ['Mona Lisa', 'The Last Supper', 'Flying Machine Designs', 'Anatomical Studies'],
    learningPath: ['Art & Design', 'Engineering', 'Anatomy', 'Natural Sciences'],
    domains: {
      cognitiveReasoning: 94,
      mathematicalLogic: 89,
      verbalProficiency: 91,
      spatialIntelligence: 99,
      memoryProcessing: 93,
      processingSpeed: 88
    }
  },
  {
    id: 'ada-lovelace',
    name: 'Ada Lovelace',
    title: 'Mathematician & Programmer',
    industry: 'Mathematics & Computing',
    country: 'United Kingdom',
    profileImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616c96df296?w=400&h=400&fit=crop&crop=face',
    bio: 'English mathematician and the first computer programmer, known for her work on Charles Babbage\'s Analytical Engine.',
    eiqScore: 820,
    keyTraits: ['Logical', 'Abstract Thinking', 'Pattern Recognition', 'Forward-Thinking'],
    achievements: ['First Computer Program', 'Analytical Engine Notes', 'Mathematical Algorithms', 'Computing Vision'],
    learningPath: ['Mathematics', 'Logic', 'Computer Science', 'Algorithm Design'],
    domains: {
      cognitiveReasoning: 92,
      mathematicalLogic: 98,
      verbalProficiency: 87,
      spatialIntelligence: 85,
      memoryProcessing: 89,
      processingSpeed: 91
    }
  },
  {
    id: 'nelson-mandela',
    name: 'Nelson Mandela',
    title: 'President & Human Rights Activist',
    industry: 'Politics & Social Justice',
    country: 'South Africa',
    profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    bio: 'South African anti-apartheid revolutionary and political leader who served as President of South Africa.',
    eiqScore: 810,
    keyTraits: ['Leadership', 'Emotional Intelligence', 'Resilience', 'Diplomacy'],
    achievements: ['Ended Apartheid', 'Nobel Peace Prize', 'Democratic Transition', 'Reconciliation Leadership'],
    learningPath: ['Political Science', 'Law', 'Conflict Resolution', 'Public Speaking'],
    domains: {
      cognitiveReasoning: 88,
      mathematicalLogic: 78,
      verbalProficiency: 96,
      spatialIntelligence: 82,
      memoryProcessing: 90,
      processingSpeed: 85
    }
  },
  {
    id: 'oprah-winfrey',
    name: 'Oprah Winfrey',
    title: 'Media Mogul & Philanthropist',
    industry: 'Media & Entertainment',
    country: 'United States',
    profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    bio: 'Media executive, actress, talk show host, and philanthropist known for her influential talk show and media empire.',
    eiqScore: 780,
    keyTraits: ['Empathy', 'Communication', 'Inspiration', 'Business Acumen'],
    achievements: ['The Oprah Winfrey Show', 'OWN Network', 'Educational Philanthropy', 'Cultural Influence'],
    learningPath: ['Communication', 'Psychology', 'Business Management', 'Public Relations'],
    domains: {
      cognitiveReasoning: 86,
      mathematicalLogic: 75,
      verbalProficiency: 98,
      spatialIntelligence: 80,
      memoryProcessing: 88,
      processingSpeed: 84
    }
  },
  {
    id: 'stephen-hawking',
    name: 'Stephen Hawking',
    title: 'Theoretical Physicist',
    industry: 'Physics & Cosmology',
    country: 'United Kingdom',
    profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    bio: 'Theoretical physicist known for his work on black holes, cosmology, and contributions to our understanding of the universe.',
    eiqScore: 890,
    keyTraits: ['Abstract Thinking', 'Mathematical Genius', 'Persistence', 'Scientific Communication'],
    achievements: ['Hawking Radiation Theory', 'A Brief History of Time', 'Black Hole Research', 'Cosmological Theories'],
    learningPath: ['Theoretical Physics', 'Mathematics', 'Cosmology', 'Scientific Writing'],
    domains: {
      cognitiveReasoning: 99,
      mathematicalLogic: 98,
      verbalProficiency: 89,
      spatialIntelligence: 92,
      memoryProcessing: 95,
      processingSpeed: 88
    }
  },
  {
    id: 'maya-angelou',
    name: 'Maya Angelou',
    title: 'Poet & Civil Rights Activist',
    industry: 'Literature & Arts',
    country: 'United States',
    profileImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    bio: 'American poet, memoirist, and civil rights activist known for her series of autobiographies and powerful poetry.',
    eiqScore: 795,
    keyTraits: ['Literary Genius', 'Emotional Depth', 'Social Awareness', 'Resilience'],
    achievements: ['I Know Why the Caged Bird Sings', 'Presidential Medal of Freedom', 'Literary Awards', 'Civil Rights Activism'],
    learningPath: ['Creative Writing', 'Literature', 'Social Studies', 'Public Speaking'],
    domains: {
      cognitiveReasoning: 90,
      mathematicalLogic: 76,
      verbalProficiency: 99,
      spatialIntelligence: 85,
      memoryProcessing: 92,
      processingSpeed: 82
    }
  }
];

// Calculate match percentage based on cognitive domains and traits
function calculateMatchPercentage(userProfile: any, roleModel: any): number {
  if (!userProfile.cognitiveProfile) return 0;
  
  const userDomains = userProfile.cognitiveProfile;
  const modelDomains = roleModel.domains;
  
  // Calculate domain similarity (70% weight)
  let domainSimilarity = 0;
  const domainCount = Object.keys(userDomains).length;
  
  for (const [domain, userScore] of Object.entries(userDomains)) {
    const modelScore = modelDomains[domain] || 0;
    const similarity = 1 - Math.abs(userScore - modelScore) / 100;
    domainSimilarity += similarity;
  }
  domainSimilarity = (domainSimilarity / domainCount) * 0.7;
  
  // Calculate EIQ proximity (30% weight)
  const eiqSimilarity = userProfile.eiqScore && roleModel.eiqScore 
    ? (1 - Math.abs(userProfile.eiqScore - roleModel.eiqScore) / 850) * 0.3
    : 0.15;
  
  return Math.round((domainSimilarity + eiqSimilarity) * 100);
}

// GET /api/role-models/matches - Get personalized role model matches
router.get('/matches', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.claims?.sub;
    
    // Get user's EIQ profile
    const [user] = await db
      .select({
        eiqScore: users.eiqScore,
        cognitiveProfile: users.cognitiveProfile,
        learningStyle: users.learningStyle,
        interests: users.interests,
        dominantTraits: users.dominantTraits
      })
      .from(users)
      .where(eq(users.id, userId));
    
    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    
    // Calculate matches for all role models
    const roleModelsWithMatches = ROLE_MODELS.map(model => ({
      ...model,
      matchPercentage: calculateMatchPercentage(user, model)
    })).sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    // Get top 6 matches
    const topMatches = roleModelsWithMatches.slice(0, 6);
    
    // Generate user profile summary
    const userProfile = {
      eiqScore: user.eiqScore || 0,
      dominantTraits: user.dominantTraits || ['Analytical', 'Curious', 'Systematic'],
      strengthDomains: Object.entries(user.cognitiveProfile || {})
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([domain]) => domain.replace(/([A-Z])/g, ' $1').trim()),
      growthAreas: Object.entries(user.cognitiveProfile || {})
        .sort(([,a], [,b]) => a - b)
        .slice(0, 2)
        .map(([domain]) => domain.replace(/([A-Z])/g, ' $1').trim())
    };
    
    // Generate personalized recommendations
    const recommendations = [
      `Based on your ${userProfile.eiqScore} EIQ score, focus on developing your ${userProfile.growthAreas.join(' and ')} skills to unlock new learning opportunities.`,
      `Your strength in ${userProfile.strengthDomains[0]} aligns well with ${topMatches[0]?.name}'s cognitive profile. Consider exploring ${topMatches[0]?.industry.toLowerCase()} field.`,
      `Like ${topMatches[1]?.name}, you show ${userProfile.dominantTraits[0].toLowerCase()} thinking patterns. Focus on developing leadership skills through structured learning programs.`,
      `Consider joining study groups or mentorship programs in ${topMatches[0]?.industry} to follow a similar learning pathway as your top role model matches.`,
      `Your cognitive profile suggests strong potential in ${userProfile.strengthDomains.slice(0, 2).join(' and ')} areas. Explore advanced courses in these domains.`
    ];
    
    res.json({
      topMatches,
      userProfile,
      recommendations
    });
  } catch (error) {
    console.error('Error getting role model matches:', error);
    res.status(500).json({ error: 'Failed to get role model matches' });
  }
});

// GET /api/role-models/all - Get all role models
router.get('/all', async (req: Request, res: Response) => {
  try {
    res.json(ROLE_MODELS);
  } catch (error) {
    console.error('Error getting all role models:', error);
    res.status(500).json({ error: 'Failed to get role models' });
  }
});

// GET /api/role-models/:id - Get specific role model details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const roleModel = ROLE_MODELS.find(model => model.id === id);
    
    if (!roleModel) {
      return res.status(404).json({ error: 'Role model not found' });
    }
    
    res.json(roleModel);
  } catch (error) {
    console.error('Error getting role model details:', error);
    res.status(500).json({ error: 'Failed to get role model details' });
  }
});

// POST /api/role-models/:id/follow - Follow a role model's learning path
router.post('/:id/follow', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.claims?.sub;
    
    const roleModel = ROLE_MODELS.find(model => model.id === id);
    if (!roleModel) {
      return res.status(404).json({ error: 'Role model not found' });
    }
    
    // In a real implementation, you would save this to a user_followed_role_models table
    // For now, we'll just return success
    
    res.json({ 
      success: true, 
      message: `Now following ${roleModel.name}'s learning path`,
      learningPath: roleModel.learningPath
    });
  } catch (error) {
    console.error('Error following role model:', error);
    res.status(500).json({ error: 'Failed to follow role model' });
  }
});

export default router;
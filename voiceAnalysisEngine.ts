// Voice Analysis Engine for EiQ™ powered by SikatLab™ and IDFS Pathway™

interface VoiceAnalysisRequest {
  userId: string;
  transcript: string;
  promptId: string;
  duration: number;
  audioPath: string;
}

interface VoiceAnalysisResult {
  id: string;
  transcript: string;
  confidence: number;
  duration: number;
  aiAnalysis: {
    comprehension: number;
    articulation: number;
    vocabulary: number;
    fluency: number;
    technicalAccuracy: number;
    overallScore: number;
    insights: string[];
    recommendations: string[];
    skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  };
  timestamp: string;
}

// Mock voice prompts database
const voicePrompts = new Map([
  ["tech_1", {
    category: "Technical Communication",
    expectedKeywords: ["algorithm", "data", "training", "model", "prediction", "artificial intelligence"],
    evaluationCriteria: ["technical accuracy", "clarity of explanation", "use of proper terminology"]
  }],
  ["problem_1", {
    category: "Problem Solving",
    expectedKeywords: ["debugging", "logs", "testing", "reproduction", "systematic", "monitoring"],
    evaluationCriteria: ["logical approach", "systematic thinking", "practical solutions"]
  }],
  ["leadership_1", {
    category: "Leadership",
    expectedKeywords: ["delegation", "communication", "prioritization", "motivation", "planning"],
    evaluationCriteria: ["leadership principles", "team management", "strategic thinking"]
  }]
]);

export async function analyzeVoiceRecording(request: VoiceAnalysisRequest): Promise<VoiceAnalysisResult> {
  try {
    const prompt = voicePrompts.get(request.promptId);
    if (!prompt) {
      throw new Error("Invalid prompt ID");
    }

    // Analyze transcript for content quality
    const contentAnalysis = analyzeTranscriptContent(request.transcript, prompt);
    
    // Analyze speech characteristics (would use audio processing in production)
    const speechAnalysis = analyzeSpeechCharacteristics(request.transcript, request.duration);
    
    // Generate AI insights and recommendations
    const aiInsights = generateAIInsights(request.transcript, prompt, contentAnalysis, speechAnalysis);
    
    // Calculate overall metrics
    const metrics = calculateOverallMetrics(contentAnalysis, speechAnalysis);

    const result: VoiceAnalysisResult = {
      id: `va_${Date.now()}_${request.userId}`,
      transcript: request.transcript,
      confidence: calculateTranscriptConfidence(request.transcript),
      duration: request.duration,
      aiAnalysis: {
        comprehension: metrics.comprehension,
        articulation: metrics.articulation,
        vocabulary: metrics.vocabulary,
        fluency: metrics.fluency,
        technicalAccuracy: metrics.technicalAccuracy,
        overallScore: metrics.overallScore,
        insights: aiInsights.insights,
        recommendations: aiInsights.recommendations,
        skillLevel: determineSkillLevel(metrics.overallScore)
      },
      timestamp: new Date().toISOString()
    };

    // Store analysis result (would save to database in production)
    await storeVoiceAnalysis(request.userId, result);

    return result;
  } catch (error) {
    console.error("Error analyzing voice recording:", error);
    throw error;
  }
}

function analyzeTranscriptContent(transcript: string, prompt: any) {
  const words = transcript.toLowerCase().split(/\s+/);
  const wordCount = words.length;
  const sentenceCount = transcript.split(/[.!?]+/).length - 1;
  
  // Check for expected keywords
  const keywordMatches = prompt.expectedKeywords.filter((keyword: string) => 
    transcript.toLowerCase().includes(keyword.toLowerCase())
  ).length;
  
  const keywordScore = (keywordMatches / prompt.expectedKeywords.length) * 100;
  
  // Analyze vocabulary sophistication
  const uniqueWords = new Set(words).size;
  const vocabularyRichness = (uniqueWords / wordCount) * 100;
  
  // Technical term density
  const technicalTerms = ["algorithm", "system", "process", "methodology", "framework", "implementation", "optimization", "architecture"];
  const technicalTermCount = technicalTerms.filter(term => 
    transcript.toLowerCase().includes(term)
  ).length;
  
  return {
    wordCount,
    sentenceCount,
    keywordScore,
    vocabularyRichness,
    technicalTermCount,
    averageWordsPerSentence: wordCount / Math.max(sentenceCount, 1)
  };
}

function analyzeSpeechCharacteristics(transcript: string, duration: number) {
  const wordCount = transcript.split(/\s+/).length;
  const wordsPerMinute = (wordCount / duration) * 60;
  
  // Ideal speaking rate is 120-160 WPM
  const speechRateScore = Math.min(100, Math.max(0, 
    100 - Math.abs(140 - wordsPerMinute) * 2
  ));
  
  // Analyze filler words
  const fillerWords = ["um", "uh", "like", "you know", "basically", "actually"];
  const fillerCount = fillerWords.reduce((count, filler) => 
    count + (transcript.toLowerCase().match(new RegExp(`\\b${filler}\\b`, 'g')) || []).length, 0
  );
  
  const fillerRatio = fillerCount / wordCount;
  const fluencyScore = Math.max(0, 100 - (fillerRatio * 500));
  
  return {
    wordsPerMinute,
    speechRateScore,
    fillerCount,
    fillerRatio,
    fluencyScore
  };
}

function generateAIInsights(transcript: string, prompt: any, contentAnalysis: any, speechAnalysis: any) {
  const insights = [];
  const recommendations = [];
  
  // Content insights
  if (contentAnalysis.keywordScore > 80) {
    insights.push("Excellent coverage of key concepts and terminology relevant to the topic.");
  } else if (contentAnalysis.keywordScore > 60) {
    insights.push("Good understanding of the topic with room for deeper technical detail.");
  } else {
    insights.push("Consider incorporating more specific terminology and key concepts.");
  }
  
  // Vocabulary insights
  if (contentAnalysis.vocabularyRichness > 60) {
    insights.push("Demonstrates strong vocabulary range and linguistic diversity.");
  } else {
    insights.push("Vocabulary could be more varied to enhance communication effectiveness.");
  }
  
  // Speech characteristics insights
  if (speechAnalysis.speechRateScore > 80) {
    insights.push("Excellent pacing and speaking rhythm for clear communication.");
  } else if (speechAnalysis.wordsPerMinute < 100) {
    insights.push("Speaking pace is somewhat slow - could benefit from increased tempo.");
  } else {
    insights.push("Speaking pace is quite fast - consider slowing down for clarity.");
  }
  
  // Generate recommendations
  if (contentAnalysis.keywordScore < 70) {
    recommendations.push("Study industry-specific terminology and practice incorporating technical vocabulary naturally.");
  }
  
  if (speechAnalysis.fillerRatio > 0.05) {
    recommendations.push("Practice reducing filler words through conscious speech exercises and pause techniques.");
  }
  
  if (contentAnalysis.averageWordsPerSentence < 10) {
    recommendations.push("Work on developing more complex sentence structures to convey ideas more comprehensively.");
  }
  
  if (speechAnalysis.speechRateScore < 70) {
    recommendations.push("Practice speaking exercises to optimize your natural speaking rhythm and pace.");
  }
  
  recommendations.push("Continue practicing verbal communication to build confidence and fluency.");
  
  return { insights, recommendations };
}

function calculateOverallMetrics(contentAnalysis: any, speechAnalysis: any) {
  const comprehension = Math.min(100, contentAnalysis.keywordScore + (contentAnalysis.technicalTermCount * 10));
  const articulation = speechAnalysis.speechRateScore;
  const vocabulary = Math.min(100, contentAnalysis.vocabularyRichness + (contentAnalysis.technicalTermCount * 5));
  const fluency = speechAnalysis.fluencyScore;
  const technicalAccuracy = Math.min(100, contentAnalysis.keywordScore + (contentAnalysis.technicalTermCount * 15));
  
  const overallScore = Math.round(
    (comprehension * 0.25) + 
    (articulation * 0.2) + 
    (vocabulary * 0.2) + 
    (fluency * 0.2) + 
    (technicalAccuracy * 0.15)
  );
  
  return {
    comprehension: Math.round(comprehension),
    articulation: Math.round(articulation),
    vocabulary: Math.round(vocabulary),
    fluency: Math.round(fluency),
    technicalAccuracy: Math.round(technicalAccuracy),
    overallScore
  };
}

function calculateTranscriptConfidence(transcript: string): number {
  // Simple confidence calculation based on transcript characteristics
  const wordCount = transcript.split(/\s+/).length;
  const hasCapitalization = /[A-Z]/.test(transcript);
  const hasPunctuation = /[.!?]/.test(transcript);
  
  let confidence = 70; // Base confidence
  
  if (wordCount > 50) confidence += 15;
  if (hasCapitalization) confidence += 10;
  if (hasPunctuation) confidence += 5;
  
  return Math.min(95, confidence);
}

function determineSkillLevel(overallScore: number): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
  if (overallScore >= 90) return 'expert';
  if (overallScore >= 75) return 'advanced';
  if (overallScore >= 60) return 'intermediate';
  return 'beginner';
}

// Mock storage functions
const voiceAnalysisStorage = new Map<string, VoiceAnalysisResult[]>();

async function storeVoiceAnalysis(userId: string, analysis: VoiceAnalysisResult) {
  if (!voiceAnalysisStorage.has(userId)) {
    voiceAnalysisStorage.set(userId, []);
  }
  voiceAnalysisStorage.get(userId)!.push(analysis);
}

export async function getUserVoiceAssessments(userId: string) {
  return voiceAnalysisStorage.get(userId) || [];
}
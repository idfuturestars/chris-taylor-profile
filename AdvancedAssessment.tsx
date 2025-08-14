import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Star, Target, TrendingUp, Brain, Calculator, Lightbulb, Cpu } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AIHintBubbles from "./AIHintBubbles";
import DifficultySelector, { DifficultyConfig } from "./DifficultySelector";

// AI Immersion Course Assessment Structure - Based on Research
interface AdaptiveQuestion {
  id: string;
  section: "core_math" | "applied_reasoning" | "ai_conceptual";
  type: "multiple_choice" | "numerical" | "open_ended" | "scenario_based";
  difficulty: 1 | 2 | 3 | 4 | 5; // 1=Foundation, 5=Mastery
  domain: string;
  question: string;
  options?: string[];
  expectedAnswer?: string;
  hint?: string;
  explanation?: string;
  timeLimit?: number;
  weight: number;
  prerequisites?: string[];
  aiScenario?: boolean;
}

interface SectionWeights {
  core_math: 0.25; // 25% - Foundation but not dominant
  applied_reasoning: 0.40; // 40% - Problem solving emphasis 
  ai_conceptual: 0.35; // 35% - AI thinking and decision making
}

interface AssessmentResult {
  overallScore: number;
  sectionScores: {
    core_math: number;
    applied_reasoning: number;
    ai_conceptual: number;
  };
  placementLevel: "foundation" | "immersion" | "mastery";
  eiqScore: number;
  confidenceLevel: number;
  reasoningProfile: "analytical" | "creative" | "systematic" | "intuitive";
  learningGaps: string[];
  strengthAreas: string[];
  recommendedPath: string;
  nextSteps: string[];
}

interface AdaptiveEngine {
  currentDifficulty: number;
  performanceHistory: number[];
  adaptationThreshold: number;
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
}

export default function AdvancedAssessment() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Core Assessment State
  const [currentSection, setCurrentSection] = useState<"intro" | "difficulty_selection" | "core_math" | "applied_reasoning" | "ai_conceptual" | "results">("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [sectionProgress, setSectionProgress] = useState({ core_math: 0, applied_reasoning: 0, ai_conceptual: 0 });
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [attemptCounts, setAttemptCounts] = useState<Record<string, number>>({});
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({});
  const [startTime, setStartTime] = useState<number>(Date.now());
  
  // Difficulty Selection State
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyConfig | null>(null);
  const [customAdaptiveLevel, setCustomAdaptiveLevel] = useState(0.0);
  
  // IRT-based Assessment State
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestionData] = useState<any>(null);
  const [adaptiveMetrics, setAdaptiveMetrics] = useState({
    currentTheta: 0.0,
    confidence: 0.5,
    questionsCompleted: 0
  });
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState<any>(null);
  const [attemptCount, setAttemptCount] = useState(1);
  
  // Legacy Adaptive Engine State (for compatibility)
  const [adaptiveEngine, setAdaptiveEngine] = useState<AdaptiveEngine>({
    currentDifficulty: 2,
    performanceHistory: [],
    adaptationThreshold: 0.75,
    consecutiveCorrect: 0,
    consecutiveIncorrect: 0
  });
  
  // Assessment Control
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch AI Immersion Assessment Questions (3-Section Format)
  const { data: assessmentData, isLoading } = useQuery({
    queryKey: ["/api/assessment/ai-immersion", currentSection, selectedDifficulty?.level],
    enabled: assessmentStarted && currentSection !== "intro" && currentSection !== "difficulty_selection" && currentSection !== "results"
  });

  // Real-time AI Analysis for Adaptive Questioning
  const analyzeResponse = useMutation({
    mutationFn: async (responseData: any) => {
      return await apiRequest("POST", "/api/assessment/analyze-response", responseData);
    },
    onSuccess: (analysis) => {
      // Update adaptive engine based on AI analysis
      updateAdaptiveEngine(analysis);
    }
  });

  // Submit Complete Assessment
  const submitAssessment = useMutation({
    mutationFn: async (assessmentData: any) => {
      return await apiRequest("POST", "/api/assessment/submit-immersion", {
        answers,
        timeSpent,
        sectionProgress,
        adaptiveEngine,
        assessmentType: "ai_immersion_placement",
        totalTime: Date.now() - startTime
      });
    },
    onSuccess: (data: AssessmentResult) => {
      setCurrentSection("results");
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "AI Immersion Assessment Complete!",
        description: `Placed in ${data.placementLevel.toUpperCase()} level with EiQ™ score of ${data.eiqScore}`
      });
    },
    onError: (error: any) => {
      toast({
        title: "Assessment Error", 
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  });

  // Adaptive Engine Logic - Based on AI Immersion Course Research
  const updateAdaptiveEngine = (analysis: any) => {
    const isCorrect = analysis.isCorrect;
    const confidence = analysis.confidence;
    
    setAdaptiveEngine(prev => {
      const newHistory = [...prev.performanceHistory, isCorrect ? 1 : 0].slice(-10); // Keep last 10
      const recentPerformance = newHistory.slice(-3).reduce((a, b) => a + b, 0) / newHistory.slice(-3).length;
      
      let newDifficulty = prev.currentDifficulty;
      let consecutiveCorrect = isCorrect ? prev.consecutiveCorrect + 1 : 0;
      let consecutiveIncorrect = !isCorrect ? prev.consecutiveIncorrect + 1 : 0;
      
      // Adaptive Difficulty Adjustment - Metey's "AI-like decision making"
      if (consecutiveCorrect >= 2 && recentPerformance > 0.75 && confidence > 0.8) {
        newDifficulty = Math.min(5, newDifficulty + 1); // Increase difficulty
      } else if (consecutiveIncorrect >= 2 && recentPerformance < 0.33) {
        newDifficulty = Math.max(1, newDifficulty - 1); // Decrease difficulty
      }
      
      return {
        currentDifficulty: newDifficulty,
        performanceHistory: newHistory,
        adaptationThreshold: prev.adaptationThreshold,
        consecutiveCorrect,
        consecutiveIncorrect
      };
    });
  };

  const handleAnswerSubmit = async (questionId: string, answer: any) => {
    const questionTime = Date.now();
    setTimeSpent(prev => ({
      ...prev,
      [questionId]: questionTime - startTime
    }));

    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    // Real-time analysis for adaptive questioning
    if ((assessmentData as any)?.questions) {
      const question = (assessmentData as any).questions.find((q: any) => q.id === questionId);
      if (question) {
        analyzeResponse.mutate({
          questionId,
          answer,
          question,
          currentDifficulty: adaptiveEngine.currentDifficulty,
          section: currentSection
        });
      }
    }

    // Progress to next question or section
    advanceAssessment();
  };

  const advanceAssessment = () => {
    if (!(assessmentData as any)?.questions) return;

    const totalQuestions = (assessmentData as any).questions.length;
    const nextQuestion = questionIndex + 1;

    if (nextQuestion >= totalQuestions) {
      // Move to next section
      if (currentSection === "core_math") {
        setCurrentSection("applied_reasoning");
        setQuestionIndex(0);
        setSectionProgress(prev => ({ ...prev, core_math: 100 }));
      } else if (currentSection === "applied_reasoning") {
        setCurrentSection("ai_conceptual");
        setQuestionIndex(0);
        setSectionProgress(prev => ({ ...prev, applied_reasoning: 100 }));
      } else if (currentSection === "ai_conceptual") {
        // Complete assessment
        setSectionProgress(prev => ({ ...prev, ai_conceptual: 100 }));
        setIsSubmitting(true);
        submitAssessment.mutate({});
      }
    } else {
      setQuestionIndex(nextQuestion);
      const progress = Math.round((nextQuestion / totalQuestions) * 100);
      setSectionProgress(prev => ({ ...prev, [currentSection]: progress }));
    }
  };

  const renderIntroSection = () => (
    <Card className="bg-black border-green-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-green-400">
          <Brain className="w-6 h-6" />
          EiQ™ powered by SikatLab™ and IDFS Pathway™ AI Immersion Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-gray-300">
          <p className="text-lg mb-4">
            This assessment evaluates your readiness for AI thinking using the research-based methodology 
            from the IDFS AI Immersion Course.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gray-900 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Calculator className="w-5 h-5 text-green-400" />
                  <h3 className="font-semibold text-green-400">Section A: Core Math</h3>
                </div>
                <p className="text-sm text-gray-400">Foundation mathematics - 25% weight</p>
                <p className="text-xs text-gray-500 mt-2">Essential but not dominant</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Lightbulb className="w-5 h-5 text-green-400" />
                  <h3 className="font-semibold text-green-400">Section B: Applied Reasoning</h3>
                </div>
                <p className="text-sm text-gray-400">Real-world problem solving - 40% weight</p>
                <p className="text-xs text-gray-500 mt-2">Emphasis on reasoning ability</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Cpu className="w-5 h-5 text-green-400" />
                  <h3 className="font-semibold text-green-400">Section C: AI Conceptual</h3>
                </div>
                <p className="text-sm text-gray-400">AI thinking & decision making - 35% weight</p>
                <p className="text-xs text-gray-500 mt-2">Navigate uncertainty like AI</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg border border-green-500/20">
            <h4 className="font-semibold text-green-400 mb-2">Placement Pathways:</h4>
            <div className="space-y-2 text-sm">
              <div><span className="text-amber-400">Foundation:</span> Show potential, need development</div>
              <div><span className="text-blue-400">Immersion:</span> Ready for AI immersion now</div>
              <div><span className="text-purple-400">Mastery:</span> Top-tier performance level</div>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => {
            setCurrentSection("difficulty_selection");
          }}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          Continue to Difficulty Selection
        </Button>
      </CardContent>
    </Card>
  );

  const renderCurrentSection = () => {
    if (!(assessmentData as any)?.questions) return null;
    
    const currentQuestionData = (assessmentData as any).questions[questionIndex];
    if (!currentQuestionData) return null;

    const sectionConfig = {
      core_math: { title: "Core Math", icon: Calculator, color: "text-blue-400", bg: "bg-blue-500/20" },
      applied_reasoning: { title: "Applied Reasoning", icon: Lightbulb, color: "text-amber-400", bg: "bg-amber-500/20" },
      ai_conceptual: { title: "AI Conceptual", icon: Cpu, color: "text-purple-400", bg: "bg-purple-500/20" }
    };

    const config = sectionConfig[currentSection as keyof typeof sectionConfig];
    const SectionIcon = config.icon;
    const progress = sectionProgress[currentSection as keyof typeof sectionProgress];

    return (
      <Card className="bg-black border-green-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SectionIcon className={`w-6 h-6 ${config.color}`} />
              <CardTitle className={config.color}>
                Section {currentSection === "core_math" ? "A" : currentSection === "applied_reasoning" ? "B" : "C"}: {config.title}
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-green-400 border-green-500/50">
              Question {questionIndex + 1} of {(assessmentData as any).questions?.length || 0}
            </Badge>
          </div>
          <Progress value={progress} className="w-full h-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`p-4 rounded-lg ${config.bg} border border-green-500/20`}>
            <p className="text-lg text-gray-200 mb-4">{currentQuestionData.question}</p>
            
            {currentQuestionData.type === "multiple_choice" && (
              <div className="space-y-3">
                {currentQuestionData.options?.map((option: string, idx: number) => (
                  <Button
                    key={idx}
                    variant={answers[currentQuestionData.id] === option ? "default" : "outline"}
                    className="w-full text-left justify-start"
                    onClick={() => handleAnswerSubmit(currentQuestionData.id, option)}
                  >
                    {String.fromCharCode(65 + idx)}. {option}
                  </Button>
                ))}
              </div>
            )}
            
            {currentQuestionData.type === "open_ended" && (
              <div className="space-y-4">
                <textarea
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-200"
                  rows={4}
                  placeholder="Enter your detailed response..."
                  value={answers[currentQuestionData.id] || ""}
                  onChange={(e) => setAnswers(prev => ({...prev, [currentQuestionData.id]: e.target.value}))}
                />
                <Button 
                  onClick={() => handleAnswerSubmit(currentQuestionData.id, answers[currentQuestionData.id])}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={!answers[currentQuestionData.id]?.trim()}
                >
                  Submit Answer
                </Button>
              </div>
            )}

            {/* AI-Powered Personalization Hint Bubbles */}
            <AIHintBubbles
              questionId={currentQuestionData.id}
              sessionId={`assessment_${Date.now()}`}
              attemptCount={attemptCounts[currentQuestionData.id] || 1}
              timeSpent={timeSpent as any}
              userTheta={adaptiveEngine.currentDifficulty - 2.5} // Convert to theta scale (-2.5 to 2.5)
              previousAnswers={Object.values(answers).filter(Boolean)}
              userProfile={{
                strugglingConcepts: [],
                masteredConcepts: [],
                preferredLearningStyle: 'analytical',
                assessmentHistory: []
              }}
              onHintRequest={() => {
                console.log('[ASSESSMENT] Hint requested for question:', currentQuestionData.id);
              }}
              onHintUsed={(hintId) => {
                console.log('[ASSESSMENT] Hint used:', hintId);
                // Track hint usage for analytics
              }}
            />

            {currentQuestionData.hint && (
              <div className="mt-4 p-3 bg-gray-800 border border-yellow-500/30 rounded-lg">
                <p className="text-sm text-yellow-400">💡 Hint: {currentQuestionData.hint}</p>
              </div>
            )}
          </div>

          {/* Adaptive Difficulty Indicator */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-400" />
              <span className="text-gray-400">
                Difficulty: Level {adaptiveEngine.currentDifficulty}/5
              </span>
            </div>
            <div className="text-gray-500">
              Performance: {Math.round((adaptiveEngine.performanceHistory.slice(-5).reduce((a, b) => a + b, 0) / adaptiveEngine.performanceHistory.slice(-5).length || 0) * 100)}%
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Difficulty Selection Handlers
  const handleDifficultyChange = (difficultyConfig: DifficultyConfig) => {
    setSelectedDifficulty(difficultyConfig);
    
    // Set initial adaptive level based on difficulty
    if (difficultyConfig.adaptiveRange) {
      const [min, max] = difficultyConfig.adaptiveRange;
      const initialLevel = (min + max) / 2; // Start in middle of range
      setCustomAdaptiveLevel(initialLevel);
      
      // Update adaptive engine with selected difficulty
      setAdaptiveEngine(prev => ({
        ...prev,
        currentDifficulty: Math.round((initialLevel + 3) / 6 * 5) + 1 // Convert to 1-5 scale
      }));
    }
  };

  const handleStartAssessment = () => {
    if (!selectedDifficulty) return;
    
    setAssessmentStarted(true);
    setCurrentSection("core_math");
    setStartTime(Date.now());
    
    toast({
      title: "Assessment Started",
      description: `Beginning ${selectedDifficulty.displayName} assessment`,
    });
  };

  // Mock user profile for difficulty recommendations
  const userProfile = {
    previousAssessments: 0,
    averageScore: undefined,
    preferredLearningStyle: 'analytical'
  };

  const renderDifficultySelector = () => (
    <DifficultySelector
      selectedDifficulty={selectedDifficulty?.level || ''}
      onDifficultyChange={handleDifficultyChange}
      userProfile={userProfile}
      onStartAssessment={handleStartAssessment}
    />
  );

  const renderResultsSection = () => {
    const results = submitAssessment.data as AssessmentResult;
    if (!results) return null;

    const placementColors = {
      foundation: "text-amber-400",
      immersion: "text-blue-400", 
      mastery: "text-purple-400"
    };

    return (
      <Card className="bg-black border-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-green-400">
            <Star className="w-6 h-6" />
            AI Immersion Assessment Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Results Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-gray-900 border-green-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-green-400">{results.eiqScore}</div>
                <div className="text-sm text-gray-400">EiQ™ Score</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-green-500/20">
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${placementColors[results.placementLevel]}`}>
                  {results.placementLevel.toUpperCase()}
                </div>
                <div className="text-sm text-gray-400">Placement Level</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-green-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">
                  {Math.round(results.confidenceLevel * 100)}%
                </div>
                <div className="text-sm text-gray-400">Assessment Confidence</div>
              </CardContent>
            </Card>
          </div>

          {/* Section Performance */}
          <div>
            <h3 className="font-semibold text-green-400 mb-4">Section Performance</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(results.sectionScores).map(([section, score]) => {
                const sectionInfo = {
                  core_math: { name: "Core Math", weight: "25%", icon: Calculator, color: "text-blue-400" },
                  applied_reasoning: { name: "Applied Reasoning", weight: "40%", icon: Lightbulb, color: "text-amber-400" },
                  ai_conceptual: { name: "AI Conceptual", weight: "35%", icon: Cpu, color: "text-purple-400" }
                };
                
                const info = sectionInfo[section as keyof typeof sectionInfo];
                const SectionIcon = info.icon;
                
                return (
                  <Card key={section} className="bg-gray-900 border-green-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <SectionIcon className={`w-5 h-5 ${info.color}`} />
                        <span className="font-semibold text-gray-200">{info.name}</span>
                      </div>
                      <div className="text-2xl font-bold text-green-400">{Math.round(score)}%</div>
                      <div className="text-xs text-gray-500">Weight: {info.weight}</div>
                      <Progress value={score} className="mt-2 h-2" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Reasoning Profile & Recommendations */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-400 mb-3">Your Reasoning Profile</h3>
              <Card className="bg-gray-900 border-green-500/20">
                <CardContent className="p-4">
                  <div className="text-lg font-semibold text-purple-400 mb-2">
                    {results.reasoningProfile.charAt(0).toUpperCase() + results.reasoningProfile.slice(1)} Thinker
                  </div>
                  <p className="text-sm text-gray-400">
                    {results.reasoningProfile === "analytical" && "You approach problems systematically with logical analysis"}
                    {results.reasoningProfile === "creative" && "You excel at finding novel solutions and thinking outside the box"}
                    {results.reasoningProfile === "systematic" && "You prefer structured approaches and methodical problem-solving"}
                    {results.reasoningProfile === "intuitive" && "You rely on pattern recognition and intuitive insights"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="font-semibold text-green-400 mb-3">Development Areas</h3>
              <div className="space-y-2">
                {results.strengthAreas.slice(0, 2).map((strength, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-300">{strength}</span>
                  </div>
                ))}
                {results.learningGaps.slice(0, 2).map((gap, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-300">Focus on: {gap}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Placement Pathway */}
          <div className="bg-gray-900 p-4 rounded-lg border border-green-500/20">
            <h4 className="font-semibold text-green-400 mb-2">Your AI Immersion Pathway</h4>
            <p className="text-gray-300 mb-3">{results.recommendedPath}</p>
            
            <div className="space-y-2">
              <h5 className="font-semibold text-gray-200 text-sm">Next Steps:</h5>
              {results.nextSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  {step}
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={() => {
              // Reset assessment state instead of reloading page
              setAssessmentStarted(false);
              setCurrentSection("intro");
              setSectionProgress({
                core_math: 0,
                applied_reasoning: 0,
                ai_conceptual: 0
              });
              setAnswers({});
            }}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Assessment Progress Header */}
      {assessmentStarted && currentSection !== "intro" && currentSection !== "results" && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-green-400">AI Immersion Assessment</h2>
          <div className="flex items-center gap-4">
            {Object.entries(sectionProgress).map(([section, progress]) => (
              <div key={section} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${progress === 100 ? 'bg-green-400' : progress > 0 ? 'bg-amber-400' : 'bg-gray-600'}`} />
                <span className="text-xs text-gray-400">
                  {section.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Render Current Section */}
      {currentSection === "intro" && renderIntroSection()}
      {currentSection === "difficulty_selection" && renderDifficultySelector()}
      {(currentSection === "core_math" || currentSection === "applied_reasoning" || currentSection === "ai_conceptual") && renderCurrentSection()}
      {currentSection === "results" && renderResultsSection()}
      
      {/* Submitting Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-black border-green-500/20">
            <CardContent className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4" />
              <p className="text-green-400">Processing your assessment with AI...</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
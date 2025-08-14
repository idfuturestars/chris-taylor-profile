import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, Brain, Target, CheckCircle, AlertTriangle, BookOpen, Zap, TrendingUp, Award } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface IDFSQuestion {
  id: string;
  category: string;
  subcategory: string;
  difficulty: 'foundation' | 'intermediate' | 'advanced' | 'expert';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  timeWeight: number; // Time allocation weight (1-3)
  cognitiveLoad: number; // Cognitive complexity (1-5)
}

interface IDFSAssessmentSession {
  id: string;
  startTime: number;
  timeLimit: number; // 60 minutes in seconds
  questions: IDFSQuestion[];
  currentQuestionIndex: number;
  responses: { [questionId: string]: number };
  timeSpentPerQuestion: { [questionId: string]: number };
  isCompleted: boolean;
  score?: number;
  categoryScores?: { [category: string]: number };
  eiqLevel?: string;
}

interface IDFSResults {
  overallScore: number;
  eiqLevel: 'Foundation' | 'Immersion' | 'Mastery' | 'Excellence';
  categoryBreakdown: {
    category: string;
    score: number;
    maxScore: number;
    percentage: number;
  }[];
  timeAnalysis: {
    totalTime: number;
    averageTimePerQuestion: number;
    timeEfficiency: number;
  };
  cognitiveAnalysis: {
    strengths: string[];
    improvementAreas: string[];
    recommendations: string[];
  };
  nextSteps: string[];
}

export default function IDFSAssessment() {
  const [, setLocation] = useLocation();
  const [session, setSession] = useState<IDFSAssessmentSession | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<IDFSResults | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch assessment session
  const { data: assessmentData, isLoading } = useQuery({
    queryKey: ["/api/idfs-assessment/session"],
    enabled: !session && !showResults,
  });

  // Start new assessment mutation
  const startAssessmentMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/idfs-assessment/start");
    },
    onSuccess: (newSession) => {
      setSession(newSession);
      setQuestionStartTime(Date.now());
      toast({
        title: "IDFS Assessment Started",
        description: "You have 60 minutes to complete this comprehensive assessment.",
      });
    },
  });

  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: async (data: { questionId: string; answer: number; timeSpent: number }) => {
      return apiRequest("POST", "/api/idfs-assessment/answer", data);
    },
  });

  // Complete assessment mutation
  const completeAssessmentMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/idfs-assessment/complete");
    },
    onSuccess: (assessmentResults) => {
      setResults(assessmentResults);
      setShowResults(true);
      setSession(null);
      toast({
        title: "Assessment Complete!",
        description: `Your EiQ Level: ${assessmentResults.eiqLevel} (${assessmentResults.overallScore}%)`,
      });
    },
  });

  // Timer effect
  useEffect(() => {
    if (session && !session.isCompleted) {
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - session.startTime;
        const remaining = Math.max(0, session.timeLimit * 1000 - elapsed);
        setTimeRemaining(remaining);

        if (remaining === 0) {
          // Auto-submit when time runs out
          completeAssessmentMutation.mutate();
        }
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [session, completeAssessmentMutation]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: number) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (!session || selectedAnswer === null) return;

    const currentQuestion = session.questions[session.currentQuestionIndex];
    const timeSpent = Date.now() - questionStartTime;

    // Submit answer
    submitAnswerMutation.mutate({
      questionId: currentQuestion.id,
      answer: selectedAnswer,
      timeSpent,
    });

    // Update session
    const updatedSession = {
      ...session,
      responses: {
        ...session.responses,
        [currentQuestion.id]: selectedAnswer,
      },
      timeSpentPerQuestion: {
        ...session.timeSpentPerQuestion,
        [currentQuestion.id]: timeSpent,
      },
      currentQuestionIndex: session.currentQuestionIndex + 1,
    };

    if (updatedSession.currentQuestionIndex >= session.questions.length) {
      // Assessment complete
      updatedSession.isCompleted = true;
      completeAssessmentMutation.mutate();
    } else {
      setSession(updatedSession);
      setQuestionStartTime(Date.now());
    }

    setSelectedAnswer(null);
  };

  const currentQuestion = session?.questions[session.currentQuestionIndex];
  const progressPercentage = session ? ((session.currentQuestionIndex + 1) / session.questions.length) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Results Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Award className="h-8 w-8 text-purple-500" />
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">IDFS Assessment Results</h1>
                </div>
                <Badge variant="secondary" className="text-xs">60-Minute Comprehensive Assessment</Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">EiQ Level</p>
                <p className="text-2xl font-bold text-purple-500">{results.eiqLevel}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Overall Score */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Your IDFS Assessment Score</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-6xl font-bold text-purple-500 mb-4">
                {Math.round(results.overallScore)}%
              </div>
              <Badge 
                variant={results.eiqLevel === 'Excellence' ? 'default' : 'secondary'}
                className="text-lg px-4 py-2"
              >
                {results.eiqLevel} Level
              </Badge>
              <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
                {results.eiqLevel === 'Excellence' && "Outstanding performance! You demonstrate mastery across all cognitive domains."}
                {results.eiqLevel === 'Mastery' && "Excellent work! You show strong competency with room for advanced development."}
                {results.eiqLevel === 'Immersion' && "Good progress! You have solid foundations with clear areas for growth."}
                {results.eiqLevel === 'Foundation' && "Great start! Focus on building core competencies for continued growth."}
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Category Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.categoryBreakdown.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{category.category}</span>
                        <span className="text-gray-600">{category.score}/{category.maxScore} ({category.percentage}%)</span>
                      </div>
                      <Progress value={category.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Time Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Time Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Time Used:</span>
                    <span className="font-medium">{formatTime(results.timeAnalysis.totalTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average per Question:</span>
                    <span className="font-medium">{Math.round(results.timeAnalysis.averageTimePerQuestion / 1000)}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Time Efficiency:</span>
                    <span className="font-medium">{results.timeAnalysis.timeEfficiency}%</span>
                  </div>
                  <Progress value={results.timeAnalysis.timeEfficiency} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cognitive Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Cognitive Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.cognitiveAnalysis.strengths.map((strength, index) => (
                    <div key={index} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm">{strength}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Growth Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.cognitiveAnalysis.improvementAreas.map((area, index) => (
                    <div key={index} className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <p className="text-sm">{area}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI-Generated Recommendations
              </CardTitle>
              <CardDescription>Personalized next steps based on your assessment performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.cognitiveAnalysis.recommendations.map((recommendation, index) => (
                  <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Your Learning Journey Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Button onClick={() => setLocation("/")} size="lg">
              Take Another Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-8 w-8 text-purple-500" />
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">IDFS 60-Minute Assessment</h1>
                </div>
                <Badge variant="secondary" className="text-xs">Comprehensive Cognitive Evaluation</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl mb-4">Welcome to the IDFS Assessment</CardTitle>
              <CardDescription className="text-lg">
                A comprehensive 60-minute evaluation designed to measure your cognitive abilities across multiple domains
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Clock className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">60 Minutes</h3>
                  <p className="text-sm text-gray-600">Comprehensive assessment covering all cognitive domains</p>
                </div>
                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Brain className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">AI-Powered</h3>
                  <p className="text-sm text-gray-600">Advanced algorithms provide detailed insights and recommendations</p>
                </div>
                <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Target className="h-8 w-8 text-green-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Personalized</h3>
                  <p className="text-sm text-gray-600">Tailored feedback and learning pathway recommendations</p>
                </div>
              </div>

              <div className="text-left space-y-4 max-w-2xl mx-auto">
                <h3 className="font-semibold text-lg">Assessment Overview:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Logical Reasoning & Problem Solving</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Mathematical & Analytical Thinking</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Verbal Comprehension & Communication</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Spatial & Visual Processing</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Memory & Information Processing</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Technical & Scientific Reasoning</li>
                </ul>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This assessment must be completed in one session. Once started, you'll have exactly 60 minutes to finish all questions.
                  Make sure you're in a quiet environment with stable internet connection.
                </AlertDescription>
              </Alert>

              <Button
                onClick={() => startAssessmentMutation.mutate()}
                size="lg"
                disabled={startAssessmentMutation.isPending}
                className="text-lg px-8 py-3"
              >
                {startAssessmentMutation.isPending ? "Preparing Assessment..." : "Begin IDFS Assessment"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Assessment Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">IDFS Assessment</h1>
              <Badge variant="outline">
                Question {session.currentQuestionIndex + 1} of {session.questions.length}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Time Remaining</p>
                <p className={`text-xl font-bold ${timeRemaining < 300000 ? 'text-red-500' : 'text-purple-500'}`}>
                  {formatTime(timeRemaining)}
                </p>
              </div>
            </div>
          </div>
          <div className="pb-4">
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentQuestion && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg mb-2">{currentQuestion.category}</CardTitle>
                  <div className="flex space-x-2">
                    <Badge variant="outline">{currentQuestion.subcategory}</Badge>
                    <Badge variant={
                      currentQuestion.difficulty === 'foundation' ? 'default' :
                      currentQuestion.difficulty === 'intermediate' ? 'secondary' :
                      currentQuestion.difficulty === 'advanced' ? 'destructive' : 'default'
                    }>
                      {currentQuestion.difficulty}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Cognitive Load</div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full mr-1 ${
                          i < currentQuestion.cognitiveLoad ? 'bg-purple-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-lg leading-relaxed">
                {currentQuestion.question}
              </div>

              <RadioGroup
                value={selectedAnswer?.toString()}
                onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex justify-between items-center pt-4">
                <div className="text-sm text-gray-600">
                  Progress: {Math.round(progressPercentage)}% complete
                </div>
                <Button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null || isSubmitting}
                  size="lg"
                >
                  {session.currentQuestionIndex === session.questions.length - 1 ? "Complete Assessment" : "Next Question"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
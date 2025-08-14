import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, CheckCircle, XCircle, Lightbulb, Timer, Target, ArrowRight, RotateCcw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AssessmentQuestion {
  id: string;
  questionType: "multiple_choice" | "open_ended" | "coding" | "visual";
  subject: string;
  topic: string;
  difficulty: number;
  questionText: string;
  questionData: {
    options?: string[];
    correctAnswer?: string | number;
    codeTemplate?: string;
    hints?: string[];
  };
  explanation: string;
  hints: string[];
}

interface AssessmentSession {
  id: string;
  sessionType: string;
  subject: string;
  gradeLevel: string;
  currentEiQScore: number;
  targetEiQScore: number;
  masteryLevel: string;
  questionsAnswered: number;
  correctAnswers: number;
  currentQuestion?: AssessmentQuestion;
  progressMetrics: {
    accuracy: number;
    timeSpent: number;
    hintsUsed: number;
    masteryProgress: Record<string, number>;
  };
}

const sampleQuestions: AssessmentQuestion[] = [
  {
    id: "q1",
    questionType: "multiple_choice",
    subject: "mathematics",
    topic: "algebra",
    difficulty: 2.5,
    questionText: "If x + 5 = 12, what is the value of x?",
    questionData: {
      options: ["5", "7", "12", "17"],
      correctAnswer: 1
    },
    explanation: "To solve x + 5 = 12, we subtract 5 from both sides: x = 12 - 5 = 7",
    hints: [
      "What operation would cancel out adding 5?",
      "Try subtracting 5 from both sides of the equation",
      "12 - 5 = ?"
    ]
  },
  {
    id: "q2",
    questionType: "multiple_choice",
    subject: "programming",
    topic: "logic",
    difficulty: 3.0,
    questionText: "What will this code output?\n\nfor i in range(3):\n    print(i * 2)",
    questionData: {
      options: ["0 1 2", "0 2 4", "2 4 6", "1 2 3"],
      correctAnswer: 1
    },
    explanation: "The range(3) creates values 0, 1, 2. Each is multiplied by 2, giving 0, 2, 4",
    hints: [
      "range(3) gives you 0, 1, 2",
      "Each number gets multiplied by 2",
      "0*2=0, 1*2=2, 2*2=4"
    ]
  },
  {
    id: "q3",
    questionType: "open_ended",
    subject: "ai_concepts",
    topic: "machine_learning",
    difficulty: 2.0,
    questionText: "Explain in your own words what machine learning is and give one example of how it's used in everyday life.",
    questionData: {},
    explanation: "Machine learning is when computers learn patterns from data to make predictions or decisions without being explicitly programmed for each specific task.",
    hints: [
      "Think about how computers can learn from examples",
      "Consider apps that recommend things to you",
      "How do computers recognize your voice or face?"
    ]
  }
];

export default function AdaptiveAssessment() {
  const [, setLocation] = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [openAnswer, setOpenAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [masteryLevels, setMasteryLevels] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();
  const currentQuestion = sampleQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === sampleQuestions.length - 1;

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionStartTime]);

  const submitAnswerMutation = useMutation({
    mutationFn: async (answerData: any) => {
      return await apiRequest("POST", "/api/assessment/submit-answer", answerData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessment/session"] });
    }
  });

  const handleAnswerSubmit = () => {
    const answer = currentQuestion.questionType === "open_ended" ? openAnswer : selectedAnswer;
    
    if (!answer) return;

    const isCorrect = currentQuestion.questionType === "multiple_choice" 
      ? parseInt(selectedAnswer) === currentQuestion.questionData.correctAnswer
      : true; // For open-ended, we'll need AI evaluation

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        answer,
        isCorrect,
        timeSpent: timeSpent,
        hintsUsed: showHint ? currentHintIndex + 1 : 0
      }
    }));

    // Determine mastery level based on performance
    let masteryLevel = "attempted";
    if (isCorrect) {
      if (!showHint && timeSpent < 30) {
        masteryLevel = "mastered";
      } else if (!showHint || currentHintIndex === 0) {
        masteryLevel = "proficient";
      } else {
        masteryLevel = "familiar";
      }
    }

    setMasteryLevels(prev => ({
      ...prev,
      [currentQuestion.topic]: masteryLevel
    }));

    submitAnswerMutation.mutate({
      questionId: currentQuestion.id,
      userAnswer: answer,
      isCorrect,
      timeSpent,
      hintsUsed: showHint ? currentHintIndex + 1 : 0,
      masteryLevel
    });

    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Complete assessment
      return;
    }

    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer("");
    setOpenAnswer("");
    setShowHint(false);
    setCurrentHintIndex(0);
    setShowExplanation(false);
    setSessionStartTime(Date.now());
    setTimeSpent(0);
  };

  const handleHintRequest = () => {
    if (!showHint) {
      setShowHint(true);
    } else if (currentHintIndex < currentQuestion.hints.length - 1) {
      setCurrentHintIndex(prev => prev + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateProgress = () => {
    return ((currentQuestionIndex + (showExplanation ? 1 : 0)) / sampleQuestions.length) * 100;
  };

  const calculateAccuracy = () => {
    const totalAnswered = Object.keys(answers).length;
    if (totalAnswered === 0) return 0;
    const correct = Object.values(answers).filter((a: any) => a.isCorrect).length;
    return Math.round((correct / totalAnswered) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-green-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Adaptive Assessment</h1>
                <p className="text-gray-600 dark:text-gray-400">EiQ Pathway Evaluation</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <Timer className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-mono">{formatTime(timeSpent)}</span>
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Accuracy: {calculateAccuracy()}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {currentQuestionIndex + 1} of {sampleQuestions.length}</span>
              <span>{Math.round(calculateProgress())}% Complete</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="capitalize">
                  {currentQuestion.subject.replace('_', ' ')}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {currentQuestion.topic}
                </Badge>
                <Badge variant={
                  currentQuestion.difficulty <= 2 ? "default" :
                  currentQuestion.difficulty <= 3 ? "secondary" : "destructive"
                }>
                  Level {currentQuestion.difficulty}
                </Badge>
              </div>
              {currentQuestion.hints.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleHintRequest}
                  disabled={showHint && currentHintIndex >= currentQuestion.hints.length - 1}
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  {!showHint ? "Hint" : `Next Hint (${currentHintIndex + 1}/${currentQuestion.hints.length})`}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question Text */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-lg font-medium whitespace-pre-wrap">
                {currentQuestion.questionText}
              </p>
            </div>

            {/* Hint Display */}
            {showHint && (
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Hint:</strong> {currentQuestion.hints[currentHintIndex]}
                </AlertDescription>
              </Alert>
            )}

            {/* Answer Input */}
            {!showExplanation && (
              <div className="space-y-4">
                {currentQuestion.questionType === "multiple_choice" && (
                  <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                    <div className="space-y-3">
                      {currentQuestion.questionData.options?.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                          <Label 
                            htmlFor={`option-${index}`} 
                            className="flex-1 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}

                {currentQuestion.questionType === "open_ended" && (
                  <Textarea
                    placeholder="Type your answer here..."
                    value={openAnswer}
                    onChange={(e) => setOpenAnswer(e.target.value)}
                    className="min-h-[120px]"
                  />
                )}

                <div className="flex justify-end space-x-3">
                  <Button
                    onClick={handleAnswerSubmit}
                    disabled={
                      (currentQuestion.questionType === "multiple_choice" && !selectedAnswer) ||
                      (currentQuestion.questionType === "open_ended" && !openAnswer.trim())
                    }
                  >
                    Submit Answer
                  </Button>
                </div>
              </div>
            )}

            {/* Explanation */}
            {showExplanation && (
              <div className="space-y-4">
                <Alert className={`${
                  currentQuestion.questionType === "multiple_choice" &&
                  parseInt(selectedAnswer) === currentQuestion.questionData.correctAnswer
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : currentQuestion.questionType === "open_ended"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-red-500 bg-red-50 dark:bg-red-900/20"
                }`}>
                  {currentQuestion.questionType === "multiple_choice" ? (
                    parseInt(selectedAnswer) === currentQuestion.questionData.correctAnswer ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )
                  ) : (
                    <Brain className="h-4 w-4 text-blue-500" />
                  )}
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="font-medium">
                        {currentQuestion.questionType === "multiple_choice" 
                          ? (parseInt(selectedAnswer) === currentQuestion.questionData.correctAnswer ? "Correct!" : "Not quite right")
                          : "Answer submitted for AI review"
                        }
                      </div>
                      <p>{currentQuestion.explanation}</p>
                      {currentQuestion.questionType === "multiple_choice" && 
                       parseInt(selectedAnswer) !== currentQuestion.questionData.correctAnswer && (
                        <p className="text-sm">
                          The correct answer was: <strong>
                            {currentQuestion.questionData.options?.[currentQuestion.questionData.correctAnswer as number]}
                          </strong>
                        </p>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end space-x-3">
                  {!isLastQuestion ? (
                    <Button onClick={handleNextQuestion}>
                      Next Question
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={() => setLocation("/k12-dashboard")}>
                      Complete Assessment
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Session Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Questions Answered</span>
                  <span className="font-bold">{Object.keys(answers).length}/{sampleQuestions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Accuracy</span>
                  <span className="font-bold">{calculateAccuracy()}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Time Spent</span>
                  <span className="font-bold">{formatTime(timeSpent)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mastery Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(masteryLevels).map(([topic, level]) => (
                  <div key={topic} className="flex justify-between items-center">
                    <span className="text-sm capitalize">{topic}</span>
                    <Badge variant={
                      level === "mastered" ? "default" :
                      level === "proficient" ? "secondary" :
                      level === "familiar" ? "outline" : "destructive"
                    }>
                      {level}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p>🎯 Strong logical reasoning skills</p>
                <p>📈 Consider advanced algebra topics</p>
                <p>💡 Programming concepts showing progress</p>
                <p>🔄 Review suggested after session</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
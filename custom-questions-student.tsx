import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Brain, Clock, CheckCircle, XCircle, Target, TrendingUp, BookOpen, Star } from "lucide-react";

interface CustomQuestion {
  id: string;
  topic: string;
  difficulty: string;
  questionType: string;
  cognitiveDomain: string;
  content: string;
  options: string[];
  estimatedTime: number;
  targetAge: string;
}

interface QuestionSession {
  sessionId: string;
  questions: CustomQuestion[];
  currentQuestionIndex: number;
  responses: { [questionId: string]: string };
  startTime: Date;
  completed: boolean;
}

export default function CustomQuestionsStudent() {
  const { toast } = useToast();
  const [currentSession, setCurrentSession] = useState<QuestionSession | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [sessionResults, setSessionResults] = useState<any>(null);

  // Fetch available custom questions
  const { data: availableQuestions, isLoading } = useQuery<CustomQuestion[]>({
    queryKey: ["/api/student/custom-questions"],
    enabled: !currentSession
  });

  // Start question session
  const startSessionMutation = useMutation({
    mutationFn: async (questionIds: string[]) => {
      const response = await apiRequest("POST", "/api/student/custom-questions/session", {
        questionIds
      });
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentSession({
        sessionId: data.sessionId,
        questions: data.questions,
        currentQuestionIndex: 0,
        responses: {},
        startTime: new Date(),
        completed: false
      });
      setTimeRemaining(data.questions[0]?.estimatedTime * 60 || 300);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Submit answer
  const submitAnswerMutation = useMutation({
    mutationFn: async ({ questionId, answer }: { questionId: string; answer: string }) => {
      const response = await apiRequest("POST", "/api/student/custom-questions/response", {
        questionId,
        selectedAnswer: answer,
        sessionId: currentSession?.sessionId
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (currentSession) {
        const newResponses = {
          ...currentSession.responses,
          [currentSession.questions[currentSession.currentQuestionIndex].id]: selectedAnswer
        };

        if (currentSession.currentQuestionIndex < currentSession.questions.length - 1) {
          // Move to next question
          const nextIndex = currentSession.currentQuestionIndex + 1;
          setCurrentSession({
            ...currentSession,
            responses: newResponses,
            currentQuestionIndex: nextIndex
          });
          setSelectedAnswer("");
          setTimeRemaining(currentSession.questions[nextIndex]?.estimatedTime * 60 || 300);
        } else {
          // Session completed
          setCurrentSession({
            ...currentSession,
            responses: newResponses,
            completed: true
          });
          setSessionResults(data.results);
        }
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && currentSession && !currentSession.completed) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && currentSession && !currentSession.completed) {
      // Auto-submit when time runs out
      handleSubmitAnswer();
    }
  }, [timeRemaining, currentSession]);

  const handleStartSession = (questions: CustomQuestion[]) => {
    startSessionMutation.mutate(questions.map(q => q.id));
  };

  const handleSubmitAnswer = () => {
    if (currentSession && selectedAnswer) {
      const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
      submitAnswerMutation.mutate({
        questionId: currentQuestion.id,
        answer: selectedAnswer
      });
    }
  };

  const handleRestartSession = () => {
    setCurrentSession(null);
    setSelectedAnswer("");
    setTimeRemaining(0);
    setShowExplanation(false);
    setSessionResults(null);
    queryClient.invalidateQueries({ queryKey: ["/api/student/custom-questions"] });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      remediation: "bg-red-100 text-red-800",
      enrichment: "bg-blue-100 text-blue-800",
      diagnostic: "bg-yellow-100 text-yellow-800",
      practice: "bg-green-100 text-green-800"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-red-100 text-red-800"
    };
    return colors[difficulty as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Session Results View
  if (sessionResults) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Session Complete!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Great job completing your custom question session
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {sessionResults.score}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overall Score</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {sessionResults.correct}/{sessionResults.total}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Correct Answers</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(sessionResults.avgTime)}s
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Time/Question</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Domain Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessionResults.domainBreakdown?.map((domain: any) => (
                  <div key={domain.domain} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{domain.domain.replace('_', ' ')}</span>
                      <span className="text-sm text-gray-600">{domain.score}%</span>
                    </div>
                    <Progress value={domain.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button onClick={handleRestartSession} size="lg" className="gap-2">
              <BookOpen className="w-5 h-5" />
              Take More Questions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Active Session View
  if (currentSession && !currentSession.completed) {
    const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
    const progress = ((currentSession.currentQuestionIndex + 1) / currentSession.questions.length) * 100;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Custom Question Session
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Question {currentSession.currentQuestionIndex + 1} of {currentSession.questions.length}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatTime(timeRemaining)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Time Remaining</p>
            </div>
          </div>

          {/* Progress */}
          <Card>
            <CardContent className="p-4">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                <span>Progress</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
            </CardContent>
          </Card>

          {/* Current Question */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                <Badge className={getTypeColor(currentQuestion.questionType)}>
                  {currentQuestion.questionType}
                </Badge>
                <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                  {currentQuestion.difficulty}
                </Badge>
                <Badge variant="outline">
                  {currentQuestion.cognitiveDomain.replace('_', ' ')}
                </Badge>
              </div>
              <CardTitle className="text-xl">{currentQuestion.topic}</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4 text-lg">Question:</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {currentQuestion.content}
                </p>
              </div>

              {currentQuestion.options && currentQuestion.options.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">Select your answer:</h3>
                  <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <RadioGroupItem value={option} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              )}

              <div className="flex justify-between items-center pt-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Estimated time: {currentQuestion.estimatedTime} minutes
                </div>
                
                <Button 
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer || submitAnswerMutation.isPending}
                  size="lg"
                  className="gap-2"
                >
                  {submitAnswerMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </>
                  ) : currentSession.currentQuestionIndex < currentSession.questions.length - 1 ? (
                    "Next Question"
                  ) : (
                    "Finish Session"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Question Selection View
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Custom Learning Questions
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Challenge yourself with personalized questions designed just for you
          </p>
        </div>

        {availableQuestions && availableQuestions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableQuestions.map((question) => (
              <Card key={question.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getTypeColor(question.questionType)}>
                      {question.questionType}
                    </Badge>
                    <Badge className={getDifficultyColor(question.difficulty)}>
                      {question.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{question.topic}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p><span className="font-medium">Domain:</span> {question.cognitiveDomain.replace('_', ' ')}</p>
                    <p><span className="font-medium">Target Age:</span> {question.targetAge}</p>
                    <p><span className="font-medium">Duration:</span> {question.estimatedTime} minutes</p>
                  </div>

                  <Button 
                    onClick={() => handleStartSession([question])}
                    className="w-full gap-2"
                    disabled={startSessionMutation.isPending}
                  >
                    <Brain className="w-4 h-4" />
                    Start Question
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Custom Questions Available</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your instructors haven't assigned any custom questions yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
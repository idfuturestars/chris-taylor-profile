import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Clock, Target, TrendingUp, BarChart3, Users } from 'lucide-react';
import ContextualHintProvider from '@/components/learning/ContextualHintProvider';
import { useAuth } from '@/hooks/useAuth';

interface HintContext {
  userId: string;
  questionId?: string;
  currentAnswer?: string;
  attemptCount: number;
  timeSpent: number;
  previousHints: string[];
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  subject: string;
  learningObjective: string;
}

interface LearningHint {
  id: string;
  content: string;
  type: 'conceptual' | 'procedural' | 'strategic' | 'motivational';
  difficulty: 'easy' | 'medium' | 'hard';
  relevanceScore: number;
  timestamp: Date;
}

export default function HintDemo() {
  const { user } = useAuth();
  const [context, setContext] = useState<HintContext>({
    userId: user?.id || 'demo_user',
    questionId: 'math_algebra_01',
    currentAnswer: '',
    attemptCount: 1,
    timeSpent: 0,
    previousHints: [],
    userLevel: 'intermediate',
    subject: 'Mathematics',
    learningObjective: 'Solve quadratic equations using the quadratic formula'
  });

  const [isHintVisible, setIsHintVisible] = useState(true);
  const [effectiveness, setEffectiveness] = useState<any>(null);
  const [simulationRunning, setSimulationRunning] = useState(false);

  // Timer for simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (simulationRunning) {
      interval = setInterval(() => {
        setContext(prev => ({
          ...prev,
          timeSpent: prev.timeSpent + 1
        }));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [simulationRunning]);

  const handleHintUsed = (hint: LearningHint, wasUseful: boolean) => {
    console.log('[HINT DEMO] Hint feedback:', { hint, wasUseful });
    
    // Add to previous hints
    setContext(prev => ({
      ...prev,
      previousHints: [...prev.previousHints, hint.content]
    }));

    // Send feedback to API
    fetch('/api/learning/hint-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hintId: hint.id,
        wasUseful,
        wasFollowed: Math.random() > 0.3 // Simulate follow-through
      }),
      credentials: 'include'
    }).catch(console.error);
  };

  const loadEffectiveness = async () => {
    try {
      const response = await fetch(`/api/learning/hint-effectiveness/${context.userId}?timeframe=week`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setEffectiveness(data);
      }
    } catch (error) {
      console.error('[HINT DEMO] Error loading effectiveness:', error);
    }
  };

  const simulateQuestion = (difficulty: 'easy' | 'medium' | 'hard') => {
    const scenarios = {
      easy: {
        subject: 'Basic Math',
        learningObjective: 'Add two numbers together',
        timeSpent: 15,
        attemptCount: 1
      },
      medium: {
        subject: 'Algebra',
        learningObjective: 'Solve for x in linear equations',
        timeSpent: 45,
        attemptCount: 2
      },
      hard: {
        subject: 'Calculus',
        learningObjective: 'Find the derivative using chain rule',
        timeSpent: 120,
        attemptCount: 3
      }
    };

    const scenario = scenarios[difficulty];
    setContext(prev => ({
      ...prev,
      ...scenario,
      userLevel: difficulty === 'easy' ? 'beginner' : difficulty === 'medium' ? 'intermediate' : 'advanced',
      previousHints: [],
      questionId: `${difficulty}_question_${Date.now()}`
    }));
  };

  const startSimulation = () => {
    setSimulationRunning(true);
    setContext(prev => ({ ...prev, timeSpent: 0, attemptCount: 1, previousHints: [] }));
  };

  const stopSimulation = () => {
    setSimulationRunning(false);
  };

  const increaseAttempts = () => {
    setContext(prev => ({ ...prev, attemptCount: prev.attemptCount + 1 }));
  };

  useEffect(() => {
    loadEffectiveness();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-blue-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="border-2 border-blue-200 dark:border-blue-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Brain className="w-8 h-8 text-blue-600" />
              Contextual Learning Hint Generator
            </CardTitle>
            <CardDescription>
              AI-powered intelligent hints that adapt to your learning context and performance
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column - Controls & Context */}
          <div className="space-y-4">
            
            {/* Current Context */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Learning Context
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Subject</Label>
                    <Input
                      value={context.subject}
                      onChange={(e) => setContext(prev => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>User Level</Label>
                    <Select 
                      value={context.userLevel} 
                      onValueChange={(value: any) => setContext(prev => ({ ...prev, userLevel: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Learning Objective</Label>
                  <Input
                    value={context.learningObjective}
                    onChange={(e) => setContext(prev => ({ ...prev, learningObjective: e.target.value }))}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {context.timeSpent}s
                  </Badge>
                  <Badge variant="outline">
                    Attempt #{context.attemptCount}
                  </Badge>
                  <Badge variant="outline">
                    {context.previousHints.length} hints received
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Simulation Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Testing Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button 
                    onClick={() => simulateQuestion('easy')}
                    variant="outline"
                    size="sm"
                  >
                    Easy Question
                  </Button>
                  <Button 
                    onClick={() => simulateQuestion('medium')}
                    variant="outline"
                    size="sm"
                  >
                    Medium Question
                  </Button>
                  <Button 
                    onClick={() => simulateQuestion('hard')}
                    variant="outline"
                    size="sm"
                  >
                    Hard Question
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={simulationRunning ? stopSimulation : startSimulation}
                    variant={simulationRunning ? "destructive" : "default"}
                    size="sm"
                  >
                    {simulationRunning ? "Stop Timer" : "Start Timer"}
                  </Button>
                  <Button 
                    onClick={increaseAttempts}
                    variant="outline"
                    size="sm"
                  >
                    Add Attempt
                  </Button>
                  <Button 
                    onClick={() => setContext(prev => ({ ...prev, previousHints: [] }))}
                    variant="outline"
                    size="sm"
                  >
                    Clear Hints
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Show Hint System</Label>
                  <Button 
                    onClick={() => setIsHintVisible(!isHintVisible)}
                    variant="outline"
                    size="sm"
                  >
                    {isHintVisible ? "Hide" : "Show"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Analytics */}
          <div className="space-y-4">
            
            {/* Hint Analytics */}
            {effectiveness && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Hint Effectiveness Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="distribution">Distribution</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {effectiveness.totalHints}
                          </div>
                          <div className="text-sm text-blue-600">Total Hints</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {Math.round(effectiveness.effectivenessScore * 100)}%
                          </div>
                          <div className="text-sm text-green-600">Effectiveness</div>
                        </div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {Math.round(effectiveness.averageRelevanceScore * 100)}%
                        </div>
                        <div className="text-sm text-purple-600">Average Relevance</div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="distribution" className="space-y-4">
                      <div className="space-y-2">
                        {Object.entries(effectiveness.hintTypeDistribution).map(([type, count]) => (
                          <div key={type} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <span className="capitalize">{type}</span>
                            <Badge variant="secondary">{count as number}</Badge>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Recent Hints */}
            {context.previousHints.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Recent Hints
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-48 overflow-y-auto">
                  {context.previousHints.slice(-5).reverse().map((hint, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                      {hint}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Sample Question Area */}
        <Card className="border-2 border-green-200 dark:border-green-700">
          <CardHeader>
            <CardTitle>Sample Learning Question</CardTitle>
            <CardDescription>
              This simulates a learning environment where hints would appear
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900 dark:to-green-900 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">{context.learningObjective}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Subject: {context.subject} | Level: {context.userLevel}
              </p>
              <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded border-2 border-dashed border-gray-300">
                <p className="text-center text-gray-500">
                  Sample question content would appear here...
                  <br />
                  <span className="text-sm">Time spent: {context.timeSpent}s | Attempts: {context.attemptCount}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contextual Hint Provider */}
      {isHintVisible && (
        <ContextualHintProvider
          context={context}
          onHintUsed={handleHintUsed}
          isVisible={isHintVisible}
          autoShow={true}
          showAfterTime={15}
        />
      )}
    </div>
  );
}
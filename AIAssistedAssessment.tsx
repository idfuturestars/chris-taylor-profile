import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import InteractiveAssessment from "./InteractiveAssessment";
import AssessmentResults from "./AssessmentResults";
import { 
  Brain, 
  Bot, 
  TrendingUp, 
  Clock, 
  Target,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  BarChart3
} from "lucide-react";

interface AIUsageMetrics {
  questionsWithAI: number;
  totalQuestions: number;
  aiHelpLevel: 'none' | 'hint' | 'guidance' | 'solution';
  timeSpentWithAI: number;
  scoreImprovementWithAI: number;
  confidenceWithAI: number;
}

export default function AIAssistedAssessment() {
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalResults, setFinalResults] = useState<any>(null);
  const [aiAssistanceEnabled, setAiAssistanceEnabled] = useState(true);
  const [aiHelpLevel, setAiHelpLevel] = useState(2); // 1=hint, 2=guidance, 3=detailed help
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [aiUsageMetrics, setAiUsageMetrics] = useState<AIUsageMetrics>({
    questionsWithAI: 8,
    totalQuestions: 25,
    aiHelpLevel: 'guidance',
    timeSpentWithAI: 120, // seconds
    scoreImprovementWithAI: 15, // percentage points
    confidenceWithAI: 78 // percentage
  });

  const startAssessment = () => {
    setAssessmentStarted(true);
    setCurrentQuestion(1);
  };

  const handleAssessmentComplete = (score: number, results: any) => {
    setFinalScore(score);
    setFinalResults(results);
    setAssessmentCompleted(true);
    setAssessmentStarted(false);
  };

  const handleRetakeAssessment = () => {
    setAssessmentCompleted(false);
    setAssessmentStarted(false);
    setFinalScore(0);
    setFinalResults(null);
  };

  const handleBackToDashboard = () => {
    setAssessmentCompleted(false);
    setAssessmentStarted(false);
  };

  const aiHelpLevels = [
    { value: 1, label: "Hints Only", description: "Subtle nudges in the right direction" },
    { value: 2, label: "Guided Assistance", description: "Step-by-step reasoning support" },
    { value: 3, label: "Detailed Help", description: "Comprehensive explanation and analysis" }
  ];

  const assessmentRecommendations = [
    {
      frequency: "Weekly Baseline",
      duration: "45 minutes",
      aiUsage: "Limited (20% max)",
      purpose: "Track pure cognitive improvement",
      scoreImpact: "+5-8 points per month"
    },
    {
      frequency: "Bi-weekly Comprehensive", 
      duration: "3h 45m",
      aiUsage: "Moderate (40% max)",
      purpose: "Deep analysis with AI insights",
      scoreImpact: "+12-18 points per assessment"
    },
    {
      frequency: "Daily Practice",
      duration: "15-30 minutes", 
      aiUsage: "Full assistance",
      purpose: "Skill development and learning",
      scoreImpact: "+2-3 points per week"
    }
  ];

  // Show results if assessment is completed
  if (assessmentCompleted && finalResults) {
    return (
      <AssessmentResults
        score={finalScore}
        results={finalResults}
        type="baseline"
        onRetakeAssessment={handleRetakeAssessment}
        onBackToDashboard={handleBackToDashboard}
      />
    );
  }

  // Show interactive assessment if started
  if (assessmentStarted) {
    return (
      <InteractiveAssessment
        type="baseline"
        onComplete={handleAssessmentComplete}
      />
    );
  }

  // Show pre-assessment setup
  if (!assessmentStarted) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              Quick Baseline Assessment (45 minutes)
            </CardTitle>
            <CardDescription>
              Fast initial EIQ™ score across all 6 cognitive domains with optional AI assistance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">60</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">45min</div>
                <div className="text-sm text-muted-foreground">Duration</div>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">6</div>
                <div className="text-sm text-muted-foreground">Domains</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">AI Assistance</div>
                  <div className="text-sm text-muted-foreground">Get help when needed</div>
                </div>
                <Switch 
                  checked={aiAssistanceEnabled} 
                  onCheckedChange={setAiAssistanceEnabled}
                />
              </div>

              {aiAssistanceEnabled && (
                <div className="space-y-2">
                  <div className="font-medium">AI Help Level</div>
                  <Slider
                    value={[aiHelpLevel]}
                    onValueChange={(value) => setAiHelpLevel(value[0])}
                    max={3}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">
                    {aiHelpLevels.find(level => level.value === aiHelpLevel)?.description}
                  </div>
                </div>
              )}
            </div>

            <Button 
              onClick={startAssessment}
              className="w-full"
              size="lg"
            >
              Start Quick Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" />
            AI-Assisted Assessment System
          </CardTitle>
          <CardDescription>
            Measure AI usage impact on cognitive performance and score improvement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((aiUsageMetrics.questionsWithAI / aiUsageMetrics.totalQuestions) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">AI Usage Rate</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-2xl font-bold text-green-600">+{aiUsageMetrics.scoreImprovementWithAI}</div>
              <div className="text-sm text-muted-foreground">Score Improvement</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{aiUsageMetrics.confidenceWithAI}%</div>
              <div className="text-sm text-muted-foreground">Confidence Level</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Assistance Configuration</CardTitle>
          <CardDescription>
            Control how AI helps during assessments and track its impact on your performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Enable AI Assistance</label>
              <p className="text-xs text-muted-foreground">Allow AI to provide help during assessments</p>
            </div>
            <Switch 
              checked={aiAssistanceEnabled} 
              onCheckedChange={setAiAssistanceEnabled}
            />
          </div>

          {aiAssistanceEnabled && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">AI Help Level</label>
                <Slider
                  value={[aiHelpLevel]}
                  onValueChange={(value) => setAiHelpLevel(value[0])}
                  max={3}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="mt-2">
                  <Badge variant="secondary">
                    {aiHelpLevels[aiHelpLevel - 1].label}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {aiHelpLevels[aiHelpLevel - 1].description}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  AI Impact Tracking
                </h4>
                <ul className="text-sm space-y-1">
                  <li>• Questions where AI was used: {aiUsageMetrics.questionsWithAI}/{aiUsageMetrics.totalQuestions}</li>
                  <li>• Average time saved per question: {Math.round(aiUsageMetrics.timeSpentWithAI / aiUsageMetrics.questionsWithAI)}s</li>
                  <li>• Estimated score boost from AI: +{aiUsageMetrics.scoreImprovementWithAI} points</li>
                  <li>• Confidence improvement: +{aiUsageMetrics.confidenceWithAI - 60}%</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personalized Assessment Schedule</CardTitle>
          <CardDescription>
            Recommended frequency and AI usage for optimal score improvement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessmentRecommendations.map((rec, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{rec.frequency}</h4>
                    <p className="text-sm text-muted-foreground">{rec.purpose}</p>
                  </div>
                  <Badge variant="outline">{rec.duration}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">AI Usage: </span>
                    <span className="text-muted-foreground">{rec.aiUsage}</span>
                  </div>
                  <div>
                    <span className="font-medium">Score Impact: </span>
                    <span className="text-green-600">{rec.scoreImpact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">
              🎯 Optimal Strategy for Score Improvement
            </h4>
            <p className="text-sm text-muted-foreground">
              <strong>Weekly Schedule:</strong> Take baseline assessment (45min) with 20% AI usage for pure score tracking<br/>
              <strong>Bi-weekly Schedule:</strong> Take comprehensive assessment (3h45m) with 40% AI usage for detailed analysis<br/>
              <strong>Daily Practice:</strong> 15-30min targeted practice with full AI assistance for weak domains<br/>
              <strong>Expected Improvement:</strong> +15-25 EiQ points per month with this approach
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Learning Impact Analysis</CardTitle>
          <CardDescription>
            How AI assistance affects your cognitive development over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <h4 className="font-medium text-blue-700 dark:text-blue-300">Positive Impacts</h4>
              <ul className="text-sm mt-2 space-y-1">
                <li>• 23% faster problem-solving when AI hints are used</li>
                <li>• 31% improvement in pattern recognition accuracy</li>
                <li>• 18% increase in confidence for complex reasoning tasks</li>
              </ul>
            </div>

            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              <h4 className="font-medium text-yellow-700 dark:text-yellow-300">Areas to Monitor</h4>
              <ul className="text-sm mt-2 space-y-1">
                <li>• Dependency risk: Reduce AI usage by 5% weekly to maintain independence</li>
                <li>• Pure cognitive assessment: Take AI-free tests monthly for baseline measurement</li>
                <li>• Critical thinking: Practice without AI for logical reasoning domains</li>
              </ul>
            </div>

            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <h4 className="font-medium text-green-700 dark:text-green-300">Recommendations</h4>
              <ul className="text-sm mt-2 space-y-1">
                <li>• Use AI for learning and practice, limit for actual assessments</li>
                <li>• Focus AI help on your weakest domains (Logical Reasoning, Emotional Intelligence)</li>
                <li>• Gradually reduce AI assistance as your natural ability improves</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
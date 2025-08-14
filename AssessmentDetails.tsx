import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import InteractiveAssessment from "./InteractiveAssessment";
import AssessmentResults from "./AssessmentResults";
import { Clock, Brain, Users, Target, CheckCircle, AlertCircle, PlayCircle } from "lucide-react";

export default function AssessmentDetails() {
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalResults, setFinalResults] = useState<any>(null);

  const startAssessment = () => {
    setAssessmentStarted(true);
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
  const assessmentStructure = [
    {
      domain: "Logical Reasoning",
      questions: 45,
      timeAllocation: "55 minutes",
      description: "Abstract thinking, pattern recognition, inductive and deductive reasoning",
      sampleTypes: ["Pattern completion", "Logical sequences", "Abstract analogies"]
    },
    {
      domain: "Working Memory", 
      questions: 30,
      timeAllocation: "35 minutes",
      description: "Mental manipulation of information, digit span, spatial sequences",
      sampleTypes: ["Digit span forward/backward", "Letter-number sequencing", "Spatial memory"]
    },
    {
      domain: "Verbal Comprehension",
      questions: 40,
      timeAllocation: "45 minutes", 
      description: "Vocabulary, reading comprehension, verbal reasoning, language understanding",
      sampleTypes: ["Vocabulary definitions", "Reading passages", "Verbal analogies"]
    },
    {
      domain: "Perceptual Reasoning",
      questions: 35,
      timeAllocation: "40 minutes",
      description: "Visual-spatial processing, non-verbal problem solving, pattern analysis",
      sampleTypes: ["Matrix reasoning", "Block design", "Visual puzzles"]
    },
    {
      domain: "Processing Speed",
      questions: 50,
      timeAllocation: "25 minutes",
      description: "Speed of mental processing, attention, psychomotor efficiency",
      sampleTypes: ["Symbol search", "Coding tasks", "Cancellation tests"]
    },
    {
      domain: "Emotional Intelligence",
      questions: 60,
      timeAllocation: "45 minutes",
      description: "Social awareness, empathy, emotional regulation, interpersonal skills",
      sampleTypes: ["Emotion recognition", "Social scenarios", "Empathy assessment"]
    }
  ];

  const totalQuestions = assessmentStructure.reduce((sum, domain) => sum + domain.questions, 0);
  const totalTime = "3 hours 45 minutes";

  // Show results if assessment is completed
  if (assessmentCompleted && finalResults) {
    return (
      <AssessmentResults
        score={finalScore}
        results={finalResults}
        type="comprehensive"
        onRetakeAssessment={handleRetakeAssessment}
        onBackToDashboard={handleBackToDashboard}
      />
    );
  }

  // Show interactive assessment if started
  if (assessmentStarted) {
    return (
      <InteractiveAssessment
        type="comprehensive"
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
              <Target className="w-6 h-6 text-primary" />
              Comprehensive EIQ™ Assessment (3h 45m)
            </CardTitle>
            <CardDescription>
              Complete evaluation covering all major cognitive domains plus emotional intelligence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">{totalQuestions}</div>
                <div className="text-sm text-muted-foreground">Total Questions</div>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">{totalTime}</div>
                <div className="text-sm text-muted-foreground">Assessment Duration</div>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">6</div>
                <div className="text-sm text-muted-foreground">Cognitive Domains</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Assessment Domains</h3>
              <div className="grid gap-4">
                {assessmentStructure.map((domain, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{domain.domain}</div>
                      <Badge variant="secondary">{domain.questions} questions</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {domain.description}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Time: {domain.timeAllocation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={startAssessment}
              className="w-full"
              size="lg"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Start Comprehensive Assessment
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
            <Target className="w-6 h-6 text-primary" />
            Comprehensive EIQ™ Assessment Structure
          </CardTitle>
          <CardDescription>
            Complete evaluation covering all major cognitive domains plus emotional intelligence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">{totalQuestions}</div>
              <div className="text-sm text-muted-foreground">Total Questions</div>
            </div>
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">{totalTime}</div>
              <div className="text-sm text-muted-foreground">Assessment Duration</div>
            </div>
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">6</div>
              <div className="text-sm text-muted-foreground">Cognitive Domains</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {assessmentStructure.map((domain, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{domain.domain}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{domain.description}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="w-4 h-4 text-primary" />
                    <span className="font-medium">{domain.questions} questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{domain.timeAllocation}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Sample Question Types:</h4>
                <div className="flex flex-wrap gap-2">
                  {domain.sampleTypes.map((type, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            Assessment Methodology & Scoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h4 className="font-medium mb-2">📊 EiQ Score Calculation</h4>
              <p className="text-sm text-muted-foreground">
                Your EiQ score is calculated using Item Response Theory (IRT) with adaptive difficulty adjustment. 
                Each domain contributes equally to your overall score, ranging from 200-800 points.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <h4 className="font-medium mb-2">⏱️ Adaptive Timing</h4>
              <p className="text-sm text-muted-foreground">
                The assessment adapts to your performance, providing more challenging questions as you demonstrate 
                higher ability. Time allocation is flexible within each domain.
              </p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <h4 className="font-medium mb-2">🔄 Retesting Policy</h4>
              <p className="text-sm text-muted-foreground">
                You can retake the assessment every 4 weeks to track improvement. Practice sessions are available 
                daily for specific domains without affecting your official score.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
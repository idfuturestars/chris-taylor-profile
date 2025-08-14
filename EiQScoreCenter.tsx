import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  TrendingUp, 
  Brain, 
  Users, 
  Target, 
  Trophy, 
  Calendar,
  Clock,
  Star,
  CheckCircle,
  RotateCcw,
  BookOpen,
  Award
} from "lucide-react";

interface EiQScoreBreakdown {
  domain: string;
  score: number;
  maxScore: number;
  percentage: number;
  improvement: string;
  timeSpent: string;
}

interface AssessmentHistory {
  id: string;
  date: string;
  score: number;
  duration: string;
  completionRate: number;
  improvementAreas: string[];
}

const mockScoreBreakdown: EiQScoreBreakdown[] = [
  {
    domain: "Logical Reasoning",
    score: 142,
    maxScore: 200,
    percentage: 71,
    improvement: "Practice pattern recognition",
    timeSpent: "25 min"
  },
  {
    domain: "Working Memory",
    score: 156,
    maxScore: 200,
    percentage: 78,
    improvement: "Focus on sequence retention",
    timeSpent: "18 min"
  },
  {
    domain: "Verbal Comprehension",
    score: 134,
    maxScore: 200,
    percentage: 67,
    improvement: "Expand vocabulary and reading comprehension",
    timeSpent: "22 min"
  },
  {
    domain: "Perceptual Reasoning",
    score: 148,
    maxScore: 200,
    percentage: 74,
    improvement: "Visual-spatial problem solving",
    timeSpent: "20 min"
  },
  {
    domain: "Processing Speed",
    score: 163,
    maxScore: 200,
    percentage: 82,
    improvement: "Maintain accuracy under time pressure",
    timeSpent: "15 min"
  },
  {
    domain: "Emotional Intelligence",
    score: 145,
    maxScore: 200,
    percentage: 73,
    improvement: "Social awareness and empathy recognition",
    timeSpent: "30 min"
  }
];

const mockAssessmentHistory: AssessmentHistory[] = [
  {
    id: "1",
    date: "2025-08-08",
    score: 580,
    duration: "3h 45m",
    completionRate: 95,
    improvementAreas: ["Logical Reasoning", "Emotional Intelligence"]
  },
  {
    id: "2", 
    date: "2025-07-28",
    score: 562,
    duration: "3h 52m",
    completionRate: 92,
    improvementAreas: ["Working Memory", "Perceptual Reasoning"]
  },
  {
    id: "3",
    date: "2025-07-15",
    score: 545,
    duration: "4h 8m", 
    completionRate: 88,
    improvementAreas: ["Verbal Comprehension", "Processing Speed"]
  }
];

export default function EiQScoreCenter() {
  const [selectedTab, setSelectedTab] = useState("overview");

  const { data: userProfile } = useQuery({
    queryKey: ["/api/auth/user"],
    enabled: true
  });

  const currentScore = 580;
  const previousScore = 562;
  const scoreImprovement = currentScore - previousScore;
  const percentileRank = 87;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            EiQ™ Score Center
          </h2>
          <p className="text-muted-foreground mt-2">
            Track your intellectual potential, understand your cognitive strengths, and identify areas for improvement.
          </p>
        </div>
        <Button className="mt-4 md:mt-0">
          <RotateCcw className="w-4 h-4 mr-2" />
          Retake Assessment
        </Button>
      </div>

      {/* Current Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">{currentScore}</p>
                <p className="text-sm text-muted-foreground">Current EiQ Score</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm">+{scoreImprovement} from last test</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{percentileRank}th</p>
                <p className="text-sm text-muted-foreground">Percentile Rank</p>
              </div>
              <Star className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Better than {percentileRank}% of test takers</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">3h 45m</p>
                <p className="text-sm text-muted-foreground">Assessment Duration</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Comprehensive IQ + EQ evaluation</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">95%</p>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Excellent focus and persistence</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Score Breakdown</TabsTrigger>
          <TabsTrigger value="history">Assessment History</TabsTrigger>
          <TabsTrigger value="improvement">Improvement Plan</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comprehensive EiQ Assessment Breakdown</CardTitle>
              <CardDescription>
                Complete evaluation across IQ domains (logical reasoning, working memory, verbal comprehension, perceptual reasoning, processing speed) and EQ (emotional intelligence) with detailed improvement paths.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockScoreBreakdown.map((domain, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <h4 className="font-medium">{domain.domain}</h4>
                        <Badge variant="secondary">{domain.timeSpent}</Badge>
                      </div>
                      <span className="text-sm font-medium">
                        {domain.score}/{domain.maxScore} ({domain.percentage}%)
                      </span>
                    </div>
                    <Progress value={domain.percentage} className="h-2" />
                    <p className="text-sm text-muted-foreground">💡 {domain.improvement}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assessment History</CardTitle>
              <CardDescription>
                Track your EiQ score progress over time and see your improvement trajectory.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAssessmentHistory.map((assessment, index) => (
                  <div key={assessment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">EiQ Score: {assessment.score}</p>
                        {index === 0 && <Badge>Latest</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {assessment.date} • {assessment.duration} • {assessment.completionRate}% complete
                      </p>
                      <div className="flex gap-1 mt-2">
                        {assessment.improvementAreas.map((area, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            Focus: {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      {index < mockAssessmentHistory.length - 1 && (
                        <div className="flex items-center text-green-500">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          <span className="text-sm">
                            +{assessment.score - mockAssessmentHistory[index + 1].score}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="improvement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Improvement Plan</CardTitle>
              <CardDescription>
                Based on your latest assessment, here's your targeted improvement strategy.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-medium mb-2">🎯 Priority Focus Areas</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Logical Reasoning:</strong> Abstract pattern recognition and analytical thinking (20 min daily)</li>
                    <li>• <strong>Emotional Intelligence:</strong> Social situation analysis and empathy exercises (15 min daily)</li>
                    <li>• <strong>Working Memory:</strong> Sequence retention and mental manipulation tasks (10 min daily)</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <h4 className="font-medium mb-2">📈 Score Projection</h4>
                  <p className="text-sm">
                    With consistent practice, you could improve your EiQ score by <strong>25-35 points</strong> within 4-6 weeks.
                    Your target score range: <strong>605-615</strong>
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <h4 className="font-medium mb-2">⏰ Optimal Retesting Schedule</h4>
                  <p className="text-sm">
                    Based on your learning pattern, we recommend retaking the assessment in <strong>3-4 weeks</strong> 
                    for optimal score improvement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Score Insights</CardTitle>
              <CardDescription>
                Deep analysis of your cognitive patterns and personalized recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
                  <h4 className="font-medium text-blue-700 dark:text-blue-300">Cognitive Strengths</h4>
                  <p className="text-sm mt-1">
                    You excel in processing speed and perceptual reasoning. Your ability to quickly identify patterns and 
                    process visual information demonstrates strong fluid intelligence capabilities.
                  </p>
                </div>

                <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
                  <h4 className="font-medium text-yellow-700 dark:text-yellow-300">Growth Opportunities</h4>
                  <p className="text-sm mt-1">
                    Logical reasoning and emotional intelligence show the most potential for rapid improvement. 
                    Verbal comprehension also offers significant score enhancement opportunities.
                  </p>
                </div>

                <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
                  <h4 className="font-medium text-green-700 dark:text-green-300">Assessment Behavior Analysis</h4>
                  <p className="text-sm mt-1">
                    You demonstrate consistent focus across the 3h 45m comprehensive assessment. Your response patterns show 
                    methodical problem-solving with room for improvement in complex reasoning tasks.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Ready to Improve Your EiQ Score?</h3>
            <p className="text-muted-foreground mb-4">
              Take the assessment again to track your progress and unlock your intellectual potential.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Full Assessment
              </Button>
              <Button variant="outline" size="lg">
                <BookOpen className="w-4 h-4 mr-2" />
                Practice Specific Domains
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
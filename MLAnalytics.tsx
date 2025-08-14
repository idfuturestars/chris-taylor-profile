import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, TrendingUp, BarChart3, LineChart, Target, Zap, Award, Users, Calendar, Clock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface MLPrediction {
  type: 'performance' | 'career_path' | 'skill_gap' | 'learning_velocity';
  confidence: number;
  prediction: string;
  reasoning: string;
  timeframe: string;
  actionItems: string[];
}

interface LearningPattern {
  id: string;
  pattern: string;
  frequency: number;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  recommendations: string[];
}

interface PerformanceMetrics {
  currentEiqScore: number;
  predictedEiqScore: number;
  improvementRate: number;
  learningVelocity: number;
  consistencyScore: number;
  adaptabilityIndex: number;
  retentionRate: number;
  engagementLevel: number;
}

interface CareerProjection {
  pathway: string;
  probability: number;
  timeToAchieve: string;
  requiredSkills: string[];
  currentReadiness: number;
  milestones: {
    milestone: string;
    timeframe: string;
    probability: number;
  }[];
}

export default function MLAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch ML analytics data
  const { data: mlAnalytics, isLoading } = useQuery({
    queryKey: ["/api/ml-analytics", selectedTimeframe],
  });

  const { data: learningPatterns } = useQuery({
    queryKey: ["/api/ml-analytics/patterns"],
  });

  const { data: performanceMetrics } = useQuery({
    queryKey: ["/api/ml-analytics/performance"],
  });

  const { data: careerProjections } = useQuery({
    queryKey: ["/api/ml-analytics/career-projections"],
  });

  // Generate new ML insights mutation
  const generateInsightsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/ml-analytics/generate-insights");
    },
    onSuccess: () => {
      toast({
        title: "ML Insights Generated",
        description: "New machine learning insights are now available.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/ml-analytics"] });
    },
  });

  // Mock data for demo
  const mockPredictions: MLPrediction[] = [
    {
      type: "performance",
      confidence: 87,
      prediction: "EiQ Score will increase to 850+ within 3 months",
      reasoning: "Based on current learning velocity and consistent assessment performance patterns",
      timeframe: "3 months",
      actionItems: [
        "Focus on advanced mathematical reasoning modules",
        "Increase practice frequency in problem-solving domains",
        "Join advanced study cohorts for peer learning"
      ]
    },
    {
      type: "career_path",
      confidence: 92,
      prediction: "Strong likelihood for Software Engineering leadership role",
      reasoning: "Technical skills combined with communication strengths indicate leadership potential",
      timeframe: "18-24 months",
      actionItems: [
        "Develop project management capabilities",
        "Enhance system design knowledge",
        "Build team leadership experience"
      ]
    },
    {
      type: "skill_gap",
      confidence: 79,
      prediction: "Cloud computing skills gap may limit career advancement",
      reasoning: "Industry demand analysis shows 95% of target roles require cloud expertise",
      timeframe: "6 months",
      actionItems: [
        "Complete AWS Solutions Architect certification",
        "Practice with hands-on cloud projects",
        "Join cloud computing study groups"
      ]
    }
  ];

  const mockPatterns: LearningPattern[] = [
    {
      id: "pattern_1",
      pattern: "Peak Performance Hours",
      frequency: 85,
      impact: "positive",
      description: "You consistently perform 40% better during 9-11 AM sessions",
      recommendations: ["Schedule complex learning during morning hours", "Block morning time for assessments"]
    },
    {
      id: "pattern_2", 
      pattern: "Weekend Learning Boost",
      frequency: 72,
      impact: "positive",
      description: "Weekend study sessions show 25% higher retention rates",
      recommendations: ["Utilize weekends for challenging concepts", "Review weekly progress on Sundays"]
    },
    {
      id: "pattern_3",
      pattern: "Assessment Fatigue",
      frequency: 67,
      impact: "negative",
      description: "Performance drops after 45+ minute assessment sessions",
      recommendations: ["Take breaks every 30-40 minutes", "Split long assessments into segments"]
    }
  ];

  const mockMetrics: PerformanceMetrics = {
    currentEiqScore: 785,
    predictedEiqScore: 852,
    improvementRate: 8.5,
    learningVelocity: 92,
    consistencyScore: 88,
    adaptabilityIndex: 76,
    retentionRate: 91,
    engagementLevel: 89
  };

  const mockProjections: CareerProjection[] = [
    {
      pathway: "Senior Software Engineer",
      probability: 89,
      timeToAchieve: "12-18 months",
      requiredSkills: ["System Design", "Cloud Architecture", "Team Leadership"],
      currentReadiness: 78,
      milestones: [
        { milestone: "Technical Lead Role", timeframe: "6 months", probability: 85 },
        { milestone: "Architecture Certification", timeframe: "9 months", probability: 82 },
        { milestone: "Senior Engineer Promotion", timeframe: "15 months", probability: 89 }
      ]
    },
    {
      pathway: "Machine Learning Engineer",
      probability: 76,
      timeToAchieve: "18-24 months",
      requiredSkills: ["Deep Learning", "MLOps", "Data Engineering"],
      currentReadiness: 62,
      milestones: [
        { milestone: "ML Fundamentals Mastery", timeframe: "8 months", probability: 88 },
        { milestone: "Portfolio Projects", timeframe: "14 months", probability: 79 },
        { milestone: "ML Engineer Role", timeframe: "22 months", probability: 76 }
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-purple-500" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ML Analytics Dashboard</h1>
              </div>
              <Badge variant="secondary" className="text-xs">Machine Learning Insights</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => generateInsightsMutation.mutate()}
                disabled={generateInsightsMutation.isPending}
                variant="outline"
              >
                <Zap className="h-4 w-4 mr-2" />
                Generate New Insights
              </Button>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Prediction Accuracy</p>
                <p className="text-xl font-bold text-purple-500">94.2%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Learning Velocity</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockMetrics.learningVelocity}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Consistency Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockMetrics.consistencyScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Retention Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockMetrics.retentionRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Improvement Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">+{mockMetrics.improvementRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="predictions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="predictions">ML Predictions</TabsTrigger>
            <TabsTrigger value="patterns">Learning Patterns</TabsTrigger>
            <TabsTrigger value="career">Career Projections</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="predictions" className="space-y-6">
            {/* ML Predictions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockPredictions.map((prediction, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg capitalize">{prediction.type.replace('_', ' ')} Prediction</CardTitle>
                        <CardDescription>Confidence: {prediction.confidence}%</CardDescription>
                      </div>
                      <Badge variant={prediction.confidence > 85 ? "default" : "secondary"}>
                        {prediction.confidence > 85 ? "High" : "Medium"} Confidence
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-medium mb-2">Prediction</h4>
                      <p className="text-sm">{prediction.prediction}</p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-medium mb-2">AI Reasoning</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{prediction.reasoning}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Recommended Actions</h4>
                      <div className="space-y-2">
                        {prediction.actionItems.map((action, actionIndex) => (
                          <div key={actionIndex} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm">{action}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm text-gray-600">Timeline:</span>
                      <Badge variant="outline">{prediction.timeframe}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            {/* Learning Patterns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockPatterns.map((pattern) => (
                <Card key={pattern.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{pattern.pattern}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant={pattern.impact === 'positive' ? 'default' : pattern.impact === 'negative' ? 'destructive' : 'secondary'}>
                          {pattern.impact}
                        </Badge>
                        <span className="text-sm text-gray-600">{pattern.frequency}%</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{pattern.description}</p>
                    
                    <div>
                      <h4 className="font-medium mb-2">Recommendations</h4>
                      <div className="space-y-2">
                        {pattern.recommendations.map((rec, index) => (
                          <div key={index} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-sm">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Progress value={pattern.frequency} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="career" className="space-y-6">
            {/* Career Projections */}
            <div className="space-y-6">
              {mockProjections.map((projection, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{projection.pathway}</CardTitle>
                        <CardDescription>
                          {projection.probability}% probability • {projection.timeToAchieve}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-500">{projection.currentReadiness}%</div>
                        <div className="text-sm text-gray-600">Current Readiness</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Career Readiness</span>
                        <span>{projection.currentReadiness}%</span>
                      </div>
                      <Progress value={projection.currentReadiness} className="h-3" />
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Required Skills Development</h4>
                      <div className="flex flex-wrap gap-2">
                        {projection.requiredSkills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Career Milestones</h4>
                      <div className="space-y-3">
                        {projection.milestones.map((milestone, milestoneIndex) => (
                          <div key={milestoneIndex} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                              <p className="font-medium">{milestone.milestone}</p>
                              <p className="text-sm text-gray-600">{milestone.timeframe}</p>
                            </div>
                            <Badge variant="outline">{milestone.probability}%</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            {/* AI Generated Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-purple-500" />
                    Cognitive Performance Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-medium mb-2">Strength Pattern Detected</h4>
                    <p className="text-sm">Your logical reasoning scores show 23% improvement over the last month, particularly in pattern recognition tasks.</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="font-medium mb-2">Learning Optimization</h4>
                    <p className="text-sm">ML models suggest focusing on mathematical reasoning for fastest EiQ score improvement.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                    Behavioral Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <h4 className="font-medium mb-2">Engagement Insights</h4>
                    <p className="text-sm">Interactive assessments generate 35% higher retention compared to traditional formats.</p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h4 className="font-medium mb-2">Time Optimization</h4>
                    <p className="text-sm">Your peak learning window is 9-11 AM with 40% higher cognitive performance.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Predictive Analytics Summary</CardTitle>
                <CardDescription>Machine learning insights based on comprehensive data analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-500 mb-2">94.2%</div>
                    <div className="text-sm text-gray-600">Prediction Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500 mb-2">850+</div>
                    <div className="text-sm text-gray-600">Predicted EiQ Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-500 mb-2">15k+</div>
                    <div className="text-sm text-gray-600">Data Points Analyzed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
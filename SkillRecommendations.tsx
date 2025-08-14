import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  Target, 
  CheckCircle, 
  PlayCircle,
  BookOpen,
  Code,
  Calculator,
  Lightbulb
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SkillRecommendation {
  id: string;
  skillCategory: string;
  skillName: string;
  currentLevel: string;
  targetLevel: string;
  priority: number;
  estimatedHours: number;
  prerequisiteSkills: string[];
  learningPath: {
    steps: Array<{
      title: string;
      description: string;
      resources: Array<{
        type: 'video' | 'article' | 'practice' | 'project';
        title: string;
        url?: string;
        estimatedTime: number;
      }>;
      estimatedHours: number;
    }>;
  };
  aiReasoning: string;
  progress: number;
  isActive: boolean;
  completedAt?: string;
  createdAt: string;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'programming': return <Code className="h-5 w-5" />;
    case 'mathematics': return <Calculator className="h-5 w-5" />;
    case 'ai_concepts': return <Brain className="h-5 w-5" />;
    case 'problem_solving': return <Lightbulb className="h-5 w-5" />;
    default: return <BookOpen className="h-5 w-5" />;
  }
};

const getPriorityColor = (priority: number) => {
  if (priority >= 5) return "bg-red-500";
  if (priority >= 4) return "bg-orange-500";
  if (priority >= 3) return "bg-yellow-500";
  return "bg-green-500";
};

const getLevelColor = (level: string) => {
  switch (level) {
    case 'beginner': return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case 'intermediate': return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case 'advanced': return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case 'expert': return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

export default function SkillRecommendations() {
  const [selectedRecommendation, setSelectedRecommendation] = useState<SkillRecommendation | null>(null);
  const { toast } = useToast();

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["/api/recommendations/skills/active"],
  });

  const generateRecommendationsMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("GET", "/api/recommendations/skills");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations/skills/active"] });
      toast({
        title: "Recommendations Generated",
        description: "Your personalized skill recommendations have been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate skill recommendations. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: async ({ id, progress }: { id: string; progress: number }) => {
      return await apiRequest("PATCH", `/api/recommendations/skills/${id}/progress`, { progress });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations/skills/active"] });
      toast({
        title: "Progress Updated",
        description: "Your learning progress has been saved.",
      });
    },
  });

  const completeSkillMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("POST", `/api/recommendations/skills/${id}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations/skills/active"] });
      toast({
        title: "Skill Completed!",
        description: "Congratulations on completing this skill! Keep up the great work.",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black p-6 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-green-500 mx-auto mb-4 animate-pulse" />
          <p className="text-white text-lg">Loading your personalized recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Interactive Skill Recommendations
              </h1>
              <p className="text-gray-400">
                AI-powered personalized learning recommendations based on your EiQ™ profile
              </p>
            </div>
            <Button
              onClick={() => generateRecommendationsMutation.mutate()}
              disabled={generateRecommendationsMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              {generateRecommendationsMutation.isPending ? "Generating..." : "Update Recommendations"}
            </Button>
          </div>
        </div>

        {/* Recommendations Grid */}
        {!recommendations || (Array.isArray(recommendations) && recommendations.length === 0) ? (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-8 text-center">
              <Brain className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Recommendations Yet</h3>
              <p className="text-gray-400 mb-6">
                Generate your first set of personalized skill recommendations to start your learning journey.
              </p>
              <Button
                onClick={() => generateRecommendationsMutation.mutate()}
                disabled={generateRecommendationsMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <Brain className="h-4 w-4 mr-2" />
                Generate Recommendations
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.isArray(recommendations) && recommendations.map((recommendation: SkillRecommendation) => (
              <Card
                key={recommendation.id}
                className="bg-gray-900 border-gray-800 hover:border-green-500 transition-colors cursor-pointer"
                onClick={() => setSelectedRecommendation(recommendation)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(recommendation.skillCategory)}
                      <CardTitle className="text-white text-lg">
                        {recommendation.skillName}
                      </CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div 
                        className={`w-3 h-3 rounded-full ${getPriorityColor(recommendation.priority)}`}
                        title={`Priority: ${recommendation.priority}/5`}
                      />
                      <Badge variant="outline" className="text-xs">
                        {recommendation.skillCategory.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Level Progression */}
                  <div className="flex items-center justify-between text-sm">
                    <Badge className={getLevelColor(recommendation.currentLevel)}>
                      {recommendation.currentLevel}
                    </Badge>
                    <Target className="h-4 w-4 text-gray-400" />
                    <Badge className={getLevelColor(recommendation.targetLevel)}>
                      {recommendation.targetLevel}
                    </Badge>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">{recommendation.progress}%</span>
                    </div>
                    <Progress value={recommendation.progress} className="h-2" />
                  </div>

                  {/* Time Estimate */}
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="h-4 w-4 mr-2" />
                    {recommendation.estimatedHours} hours estimated
                  </div>

                  {/* AI Reasoning (truncated) */}
                  <p className="text-gray-300 text-sm line-clamp-2">
                    {recommendation.aiReasoning}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    {recommendation.progress === 0 ? (
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateProgressMutation.mutate({ id: recommendation.id, progress: 10 });
                        }}
                      >
                        <PlayCircle className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    ) : recommendation.progress < 100 ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateProgressMutation.mutate({ 
                            id: recommendation.id, 
                            progress: Math.min(100, recommendation.progress + 25) 
                          });
                        }}
                      >
                        Continue
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600"
                        disabled
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Completed
                      </Button>
                    )}
                    
                    {recommendation.progress >= 90 && recommendation.progress < 100 && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          completeSkillMutation.mutate(recommendation.id);
                        }}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Detailed View Modal/Panel */}
        {selectedRecommendation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="bg-gray-900 border-gray-800 max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-2xl mb-2">
                      {selectedRecommendation.skillName}
                    </CardTitle>
                    <div className="flex items-center space-x-4">
                      <Badge className={getLevelColor(selectedRecommendation.currentLevel)}>
                        Current: {selectedRecommendation.currentLevel}
                      </Badge>
                      <Badge className={getLevelColor(selectedRecommendation.targetLevel)}>
                        Target: {selectedRecommendation.targetLevel}
                      </Badge>
                      <div className="flex items-center text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        {selectedRecommendation.estimatedHours} hours
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRecommendation(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* AI Reasoning */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Why This Skill?</h3>
                  <p className="text-gray-300">{selectedRecommendation.aiReasoning}</p>
                </div>

                {/* Prerequisites */}
                {selectedRecommendation.prerequisiteSkills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Prerequisites</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecommendation.prerequisiteSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Learning Path */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Learning Path</h3>
                  <div className="space-y-4">
                    {selectedRecommendation.learningPath.steps.map((step, index) => (
                      <Card key={index} className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-white mb-2">
                            Step {index + 1}: {step.title}
                          </h4>
                          <p className="text-gray-300 text-sm mb-3">{step.description}</p>
                          
                          <div className="space-y-2">
                            {step.resources.map((resource, resourceIndex) => (
                              <div 
                                key={resourceIndex}
                                className="flex items-center justify-between p-2 bg-gray-900 rounded"
                              >
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-xs">
                                    {resource.type}
                                  </Badge>
                                  <span className="text-gray-300 text-sm">{resource.title}</span>
                                </div>
                                <span className="text-gray-400 text-xs">
                                  {resource.estimatedTime} min
                                </span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex items-center text-gray-400 text-sm mt-2">
                            <Clock className="h-3 w-3 mr-1" />
                            {step.estimatedHours} hours
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Progress Update */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Update Progress</h3>
                  <div className="flex space-x-2">
                    {[25, 50, 75, 100].map((progress) => (
                      <Button
                        key={progress}
                        size="sm"
                        variant={selectedRecommendation.progress >= progress ? "default" : "outline"}
                        onClick={() => updateProgressMutation.mutate({ 
                          id: selectedRecommendation.id, 
                          progress 
                        })}
                        disabled={updateProgressMutation.isPending}
                      >
                        {progress}%
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
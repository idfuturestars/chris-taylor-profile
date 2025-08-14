import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Brain, Target } from "lucide-react";

interface AnalyticsProps {
  userId: string;
}

export default function Analytics({ userId }: AnalyticsProps) {
  const { data: userProfile } = useQuery({
    queryKey: ["/api/user/profile"],
    enabled: !!userId
  });

  const { data: assessments = [] } = useQuery({
    queryKey: ["/api/assessments"],
    enabled: !!userId
  });

  const reasoningSkills = [
    { name: "Logical Reasoning", level: "Strong", color: "text-green-500" },
    { name: "Pattern Recognition", level: "Developing", color: "text-orange-500" },
    { name: "Problem Decomposition", level: "Strong", color: "text-green-500" }
  ];

  const aiInsights = [
    { text: "Optimal learning time: 2-4 PM", color: "bg-primary" },
    { text: "Prefers visual learning aids", color: "bg-orange-500" },
    { text: "Strong collaborative tendencies", color: "bg-blue-500" },
    { text: "Ready for advanced concepts", color: "bg-purple-500" }
  ];

  const averageQualityScore = 8.7;
  const qualityPercentage = (averageQualityScore / 10) * 100;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Learning Analytics Overview</CardTitle>
          <Button variant="ghost" className="text-primary hover:text-primary/80">
            View Full Dashboard
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Cognitive Path Analysis */}
          <Card className="bg-muted border-border">
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Reasoning Pathways
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-32 bg-card rounded-lg mb-4 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Analytics Visualization</span>
              </div>
              <div className="space-y-2">
                {reasoningSkills.map((skill, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{skill.name}</span>
                    <span className={`text-sm font-medium ${skill.color}`}>{skill.level}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Interaction Quality */}
          <Card className="bg-muted border-border">
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI Interaction Quality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-32 mb-4 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{averageQualityScore}</div>
                  <div className="text-sm text-muted-foreground">Avg. Quality Score</div>
                </div>
                {/* Circular progress indicator */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="hsl(var(--border))"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="hsl(var(--primary))"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${qualityPercentage * 2.51} 251.2`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-300"
                  />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">
                Meaningful conversations with AI assistant showing strong engagement
              </p>
            </CardContent>
          </Card>

          {/* Master AI Engine Insights */}
          <Card className="bg-muted border-border">
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Master AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${insight.color}`}></div>
                    <span className="text-sm">{insight.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

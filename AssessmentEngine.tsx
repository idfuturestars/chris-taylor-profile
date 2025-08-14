import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Lightbulb, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssessmentEngineProps {
  userId: string;
}

export default function AssessmentEngine({ userId }: AssessmentEngineProps) {
  const { data: assessments = [] } = useQuery({
    queryKey: ["/api/assessments"],
    enabled: !!userId
  });

  const assessmentTypes = [
    {
      id: "core_math",
      title: "Core Math & Logic",
      description: "Fundamental mathematics and logical reasoning assessment",
      weight: 25,
      icon: Calculator,
      color: "text-primary",
      bgColor: "bg-primary/10",
      progressColor: "bg-primary"
    },
    {
      id: "applied_reasoning",
      title: "Applied Reasoning",
      description: "Real-world problem solving and analytical thinking",
      weight: 35,
      icon: Lightbulb,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      progressColor: "bg-orange-500"
    },
    {
      id: "ai_concepts",
      title: "AI Concepts & Scenarios",
      description: "AI decision making and conceptual understanding",
      weight: 35,
      icon: Brain,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      progressColor: "bg-blue-500"
    }
  ];

  const getAssessmentProgress = (type: string) => {
    const assessment = (assessments as any)?.find?.((a: any) => a.type === type);
    return assessment?.progress || 0;
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">3-Section Adaptive Assessment</CardTitle>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Start Assessment
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assessmentTypes.map((assessment) => {
            const progress = getAssessmentProgress(assessment.id);
            
            return (
              <div key={assessment.id} className="assessment-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={cn("p-2 rounded-lg", assessment.bgColor)}>
                      <assessment.icon className={cn("h-5 w-5", assessment.color)} />
                    </div>
                    <span className="font-medium">{assessment.title}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{assessment.weight}% Weight</span>
                </div>
                
                <div className="w-full h-32 bg-muted rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Assessment Interface</span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{assessment.description}</p>
                
                <div className="progress-bar">
                  <div 
                    className={cn("progress-fill", assessment.progressColor)}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm font-medium">{progress}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

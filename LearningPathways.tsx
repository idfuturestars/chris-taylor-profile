import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sprout, Rocket, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface LearningPathwaysProps {
  userId: string;
}

export default function LearningPathways({ userId }: LearningPathwaysProps) {
  const { data: learningPaths = [] } = useQuery<any[]>({
    queryKey: ["/api/learning-paths"],
    enabled: !!userId
  });

  const pathways = [
    {
      id: "foundation",
      title: "Foundation Level",
      description: "Build core skills and mathematical foundations",
      icon: Sprout,
      color: "text-green-500",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500",
      buttonColor: "bg-green-500/20 text-green-500 hover:bg-green-500/30"
    },
    {
      id: "immersion",
      title: "Immersion Level",
      description: "Advanced AI concepts and problem solving",
      icon: Rocket,
      color: "text-primary",
      bgColor: "bg-primary/20",
      borderColor: "border-primary",
      buttonColor: "bg-primary text-primary-foreground hover:bg-primary/90",
      isCurrent: true
    },
    {
      id: "mastery",
      title: "Mastery Level",
      description: "Expert-level AI applications and research",
      icon: Crown,
      color: "text-purple-500",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500",
      buttonColor: "bg-purple-500/20 text-purple-500 hover:bg-purple-500/30"
    }
  ];

  const getPathProgress = (pathId: string) => {
    const path = Array.isArray(learningPaths) ? learningPaths.find((p: any) => p.pathType === pathId) : null;
    return path?.progress || 0;
  };

  const getButtonText = (pathway: any) => {
    if (pathway.isCurrent) return "Current Level";
    if (pathway.id === "foundation") return "View Pathway";
    return "Unlock Level";
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Personalized Learning Pathways</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pathways.map((pathway) => {
            const progress = getPathProgress(pathway.id);
            
            return (
              <div
                key={pathway.id}
                className={cn(
                  "border rounded-lg p-4 transition-colors",
                  pathway.isCurrent 
                    ? `${pathway.borderColor} bg-primary/5`
                    : "border-border hover:border-primary"
                )}
              >
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4", pathway.bgColor)}>
                  <pathway.icon className={cn("h-6 w-6", pathway.color)} />
                </div>
                
                <h3 className="font-semibold mb-2">{pathway.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{pathway.description}</p>
                
                <div className="w-full h-20 bg-muted rounded mb-4 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Learning Dashboard</span>
                </div>

                {progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
                
                <Button
                  className={cn("w-full", pathway.buttonColor)}
                  variant={pathway.isCurrent ? "default" : "secondary"}
                >
                  {getButtonText(pathway)}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

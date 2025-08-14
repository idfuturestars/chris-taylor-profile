import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  Brain, 
  Target, 
  CheckCircle, 
  Play,
  TrendingUp,
  Award,
  BarChart3
} from "lucide-react";

export default function ModularAssessmentStructure() {
  const assessmentSections = [
    {
      id: "baseline",
      title: "Baseline Assessment",
      duration: "45 minutes",
      questions: 60,
      description: "Quick initial evaluation to establish your EiQ baseline score",
      purpose: "Generate initial score for immediate results and social sharing",
      domains: [
        { name: "Logical Reasoning", questions: 12, time: "10 min" },
        { name: "Working Memory", questions: 8, time: "6 min" },
        { name: "Verbal Comprehension", questions: 10, time: "8 min" },
        { name: "Perceptual Reasoning", questions: 10, time: "8 min" },
        { name: "Processing Speed", questions: 10, time: "5 min" },
        { name: "Emotional Intelligence", questions: 10, time: "8 min" }
      ],
      features: [
        "Immediate EiQ score (200-800 range)",
        "Domain strength identification",
        "Shareable score certificate",
        "Personalized improvement recommendations"
      ],
      accuracy: "85% correlation with full assessment"
    },
    {
      id: "comprehensive",
      title: "Comprehensive Assessment", 
      duration: "3h 45m",
      questions: 260,
      description: "Complete evaluation across all cognitive domains for precise measurement",
      purpose: "Detailed analysis with high precision scoring and comprehensive insights",
      domains: [
        { name: "Logical Reasoning", questions: 45, time: "55 min" },
        { name: "Working Memory", questions: 30, time: "35 min" },
        { name: "Verbal Comprehension", questions: 40, time: "45 min" },
        { name: "Perceptual Reasoning", questions: 35, time: "40 min" },
        { name: "Processing Speed", questions: 50, time: "25 min" },
        { name: "Emotional Intelligence", questions: 60, time: "45 min" }
      ],
      features: [
        "Highly precise EiQ score",
        "Detailed domain analysis",
        "Cognitive pattern insights",
        "Advanced improvement strategies",
        "Personality trait analysis"
      ],
      accuracy: "99% measurement precision"
    },
    {
      id: "targeted",
      title: "Targeted Practice",
      duration: "15-30 minutes",
      questions: "Variable",
      description: "Focus on specific domains identified for improvement",
      purpose: "Skill development in weak areas to maximize score improvement",
      domains: [
        { name: "Choose 1-2 Focus Domains", questions: "15-25", time: "15-30 min" }
      ],
      features: [
        "Domain-specific practice",
        "Adaptive difficulty",
        "Progress tracking",
        "Preparation for retesting"
      ],
      accuracy: "Improvement tracking only"
    }
  ];

  const recommendedFlow = [
    {
      step: 1,
      title: "Start with Baseline",
      description: "Get your initial EiQ score in 45 minutes",
      benefit: "Quick results for immediate gratification and sharing"
    },
    {
      step: 2, 
      title: "Complete Comprehensive",
      description: "Take the full assessment within 1-2 weeks",
      benefit: "Precise measurement and detailed insights"
    },
    {
      step: 3,
      title: "Practice Targeted Areas",
      description: "Focus on improvement areas daily",
      benefit: "Skill development for score enhancement"
    },
    {
      step: 4,
      title: "Retake Baseline",
      description: "Quick progress check every 2 weeks",
      benefit: "Track improvement without fatigue"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Modular EiQ Assessment System
          </CardTitle>
          <CardDescription>
            Three-section approach designed for flexibility, engagement, and comprehensive measurement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-xl font-bold text-green-600">45 min</div>
              <div className="text-sm text-muted-foreground">Baseline Assessment</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-xl font-bold text-blue-600">3h 45m</div>
              <div className="text-sm text-muted-foreground">Comprehensive Assessment</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="text-xl font-bold text-purple-600">15-30 min</div>
              <div className="text-sm text-muted-foreground">Targeted Practice</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sections" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sections">Assessment Sections</TabsTrigger>
          <TabsTrigger value="flow">Recommended Flow</TabsTrigger>
        </TabsList>

        <TabsContent value="sections" className="space-y-4">
          {assessmentSections.map((section, index) => (
            <Card key={section.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-xl">{section.title}</h3>
                      <Badge variant={section.id === 'baseline' ? 'default' : section.id === 'comprehensive' ? 'secondary' : 'outline'}>
                        {section.duration}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{section.description}</p>
                    <p className="text-sm font-medium text-primary mb-4">Purpose: {section.purpose}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Brain className="w-4 h-4 text-primary" />
                      <span className="font-medium">{section.questions} questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{section.accuracy}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Domain Breakdown:</h4>
                    <div className="space-y-2">
                      {section.domains.map((domain, i) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                          <span>{domain.name}</span>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs">
                              {domain.questions}q
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {domain.time}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Key Features:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {section.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Play className="w-4 h-4 mr-2" />
                    Start {section.title}
                  </Button>
                  {section.id === 'baseline' && (
                    <Button variant="outline">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Sample Questions
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="flow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Assessment Journey</CardTitle>
              <CardDescription>
                Optimal path for comprehensive EiQ measurement and improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recommendedFlow.map((step, index) => (
                  <div key={step.step} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{step.title}</h4>
                      <p className="text-muted-foreground text-sm mb-2">{step.description}</p>
                      <p className="text-primary text-sm font-medium">{step.benefit}</p>
                    </div>
                    {index < recommendedFlow.length - 1 && (
                      <div className="flex-shrink-0 ml-4">
                        <div className="w-px h-12 bg-border"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assessment Strategy Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">Quick Engagement</h4>
                  <p className="text-sm text-muted-foreground">
                    45-minute baseline provides immediate gratification and sharable results
                  </p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Comprehensive Insights</h4>
                  <p className="text-sm text-muted-foreground">
                    Full assessment delivers precise measurement and detailed analysis
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2">Continuous Improvement</h4>
                  <p className="text-sm text-muted-foreground">
                    Targeted practice maintains engagement and drives score enhancement
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
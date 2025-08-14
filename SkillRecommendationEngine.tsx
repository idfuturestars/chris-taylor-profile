import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Brain, Target, Star, MessageSquare, BarChart3, BookOpen, Clock, Users } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatLayout from "@/components/layout/ChatLayout";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
    recommendations?: SkillRecommendation[];
    insights?: string[];
    confidence?: number;
  };
}

interface SkillRecommendation {
  id: string;
  skillName: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  estimatedTimeToComplete: string;
  prerequisites: string[];
  learningPath: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  relevanceScore: number;
  industryDemand: number;
  careerImpact: number;
  reasoning: string;
  relatedSkills: string[];
  resources: {
    type: string;
    title: string;
    provider: string;
    duration: string;
    rating: number;
  }[];
}

interface UserSkillProfile {
  currentSkills: string[];
  skillLevels: { [key: string]: number };
  learningGoals: string[];
  careerPath: string;
  timeAvailability: string;
  preferredLearningStyle: string;
  completedAssessments: number;
}

const mockProfile: UserSkillProfile = {
  currentSkills: ["JavaScript", "React", "Python", "Data Analysis", "SQL", "Machine Learning"],
  skillLevels: {
    "JavaScript": 85,
    "React": 78,
    "Python": 92,
    "Data Analysis": 74,
    "SQL": 88,
    "Machine Learning": 65,
    "TypeScript": 42,
    "Node.js": 68,
    "Docker": 33,
    "AWS": 29
  },
  learningGoals: ["Full Stack Development", "Data Science", "AI/ML Engineering"],
  careerPath: "Software Engineering",
  timeAvailability: "10-15 hours/week",
  preferredLearningStyle: "Interactive projects",
  completedAssessments: 12
};

const mockRecommendations: SkillRecommendation[] = [
  {
    id: "1",
    skillName: "TypeScript",
    category: "Programming Languages",
    priority: "high",
    confidence: 92,
    estimatedTimeToComplete: "4-6 weeks",
    prerequisites: ["JavaScript", "React"],
    learningPath: ["TypeScript Basics", "Advanced Types", "React with TypeScript", "Project Building"],
    difficulty: "intermediate",
    relevanceScore: 95,
    industryDemand: 89,
    careerImpact: 78,
    reasoning: "TypeScript is essential for modern React development and will significantly improve your code quality and development experience.",
    relatedSkills: ["JavaScript", "React", "Node.js"],
    resources: [
      {
        type: "Course",
        title: "TypeScript Fundamentals",
        provider: "Frontend Masters",
        duration: "6 hours",
        rating: 4.8
      },
      {
        type: "Practice",
        title: "TypeScript Exercises",
        provider: "TypeScript Labs",
        duration: "Self-paced",
        rating: 4.6
      }
    ]
  },
  {
    id: "2",
    skillName: "Docker",
    category: "DevOps",
    priority: "medium",
    confidence: 88,
    estimatedTimeToComplete: "3-4 weeks",
    prerequisites: ["Command Line", "Web Development"],
    learningPath: ["Docker Basics", "Containerization", "Docker Compose", "Production Deployment"],
    difficulty: "intermediate",
    relevanceScore: 87,
    industryDemand: 94,
    careerImpact: 85,
    reasoning: "Docker containerization is crucial for modern deployment workflows and will make you more valuable in full-stack roles.",
    relatedSkills: ["DevOps", "AWS", "Kubernetes"],
    resources: [
      {
        type: "Course",
        title: "Docker Mastery",
        provider: "Udemy",
        duration: "12 hours",
        rating: 4.7
      }
    ]
  },
  {
    id: "3",
    skillName: "AWS Cloud Services",
    category: "Cloud Computing",
    priority: "high",
    confidence: 85,
    estimatedTimeToComplete: "6-8 weeks",
    prerequisites: ["Web Development", "Basic Networking"],
    learningPath: ["AWS Fundamentals", "EC2 & S3", "Lambda Functions", "DevOps with AWS"],
    difficulty: "intermediate",
    relevanceScore: 92,
    industryDemand: 96,
    careerImpact: 88,
    reasoning: "AWS skills are in extremely high demand and essential for scalable application deployment and cloud-first development.",
    relatedSkills: ["Docker", "DevOps", "Serverless"],
    resources: [
      {
        type: "Course",
        title: "AWS Certified Developer",
        provider: "A Cloud Guru",
        duration: "20 hours",
        rating: 4.9
      }
    ]
  },
  {
    id: "4",
    skillName: "Advanced Machine Learning",
    category: "AI/ML",
    priority: "medium",
    confidence: 82,
    estimatedTimeToComplete: "8-10 weeks",
    prerequisites: ["Python", "Machine Learning Basics", "Statistics"],
    learningPath: ["Deep Learning", "Neural Networks", "Model Deployment", "MLOps"],
    difficulty: "advanced",
    relevanceScore: 78,
    industryDemand: 91,
    careerImpact: 92,
    reasoning: "Advanced ML skills will position you for high-impact AI engineering roles and data science leadership positions.",
    relatedSkills: ["Python", "TensorFlow", "PyTorch", "Data Science"],
    resources: [
      {
        type: "Course",
        title: "Deep Learning Specialization",
        provider: "Coursera",
        duration: "40 hours",
        rating: 4.8
      }
    ]
  }
];

export default function SkillRecommendationEngine() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI Skill Advisor. I've analyzed your current skills and learning goals. Based on your strong foundation in JavaScript, React, and Python, I've identified some high-impact skills that could accelerate your career growth. What specific area would you like to explore first?",
      timestamp: new Date(),
      metadata: {
        recommendations: mockRecommendations.slice(0, 2),
        insights: ["Strong programming foundation", "Ready for advanced concepts", "High learning velocity"],
        confidence: 92
      }
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateRecommendations = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "I've generated new personalized recommendations based on current industry trends and your learning patterns. Here are the top opportunities for skill development:",
        timestamp: new Date(),
        metadata: {
          recommendations: mockRecommendations,
          confidence: 89
        }
      };
      setMessages(prev => [...prev, newMessage]);
      setIsLoading(false);
      toast({
        title: "New recommendations generated",
        description: "Updated skill recommendations based on latest analysis",
      });
    }, 2000);
  };

  const handleStartLearning = (skillId: string) => {
    const skill = mockRecommendations.find(r => r.id === skillId);
    if (skill) {
      toast({
        title: "Learning path started",
        description: `Started learning ${skill.skillName}`,
      });
    }
  };

  const handleAddToWishlist = (skillId: string) => {
    const skill = mockRecommendations.find(r => r.id === skillId);
    if (skill) {
      toast({
        title: "Added to wishlist",
        description: `${skill.skillName} added to your learning wishlist`,
      });
    }
  };

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/ai/skill-advisor", {
        message,
        userProfile: mockProfile,
        currentRecommendations: mockRecommendations
      });
      return response;
    },
    onSuccess: (response) => {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
        metadata: response.metadata
      };
      setMessages(prev => [...prev, newMessage]);
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    }
  });

  const handleSendMessage = (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    sendMessageMutation.mutate(message);
  };

  // Create sidebar navigation
  const sidebarNav = (
    <ScrollArea className="flex-1">
      <div className="space-y-2 p-4">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🧠</div>
          <div className="font-medium text-gray-900 dark:text-white">AI Skill Advisor</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Personalized Learning Engine</div>
          <div className="flex justify-center space-x-2 mt-2">
            <Badge variant="secondary" className="text-xs">Skills: {mockProfile.currentSkills.length}</Badge>
            <Badge variant="outline" className="text-xs">Goals: {mockProfile.learningGoals.length}</Badge>
          </div>
        </div>

        <div className="space-y-1">
          <Button
            variant="secondary"
            className="w-full justify-start"
            onClick={generateRecommendations}
            disabled={isLoading}
          >
            <Brain className="w-4 h-4 mr-3" />
            {isLoading ? "Analyzing..." : "Generate Recommendations"}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            <MessageSquare className="w-4 h-4 mr-3" />
            Chat with AI Advisor
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            <BarChart3 className="w-4 h-4 mr-3" />
            Learning Analytics
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            <BookOpen className="w-4 h-4 mr-3" />
            Learning Pathways
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-900 dark:text-white">Current Skills</div>
          <div className="space-y-1">
            {mockProfile.currentSkills.slice(0, 5).map((skill, index) => (
              <div key={index} className="text-sm text-gray-600 dark:text-gray-400 py-1">
                • {skill}
              </div>
            ))}
            {mockProfile.currentSkills.length > 5 && (
              <div className="text-xs text-gray-500">+{mockProfile.currentSkills.length - 5} more</div>
            )}
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-900 dark:text-white">Learning Goals</div>
          <div className="space-y-1">
            {mockProfile.learningGoals.map((goal, index) => (
              <div key={index} className="text-sm text-gray-600 dark:text-gray-400 py-1">
                → {goal}
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-900 dark:text-white">Learning Stats</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <div className="font-medium">8</div>
              <div className="text-gray-600 dark:text-gray-400">In Progress</div>
            </div>
            <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <div className="font-medium">15</div>
              <div className="text-gray-600 dark:text-gray-400">Completed</div>
            </div>
            <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <div className="font-medium">92%</div>
              <div className="text-gray-600 dark:text-gray-400">Velocity</div>
            </div>
            <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <div className="font-medium">78%</div>
              <div className="text-gray-600 dark:text-gray-400">Mastery</div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-900 dark:text-white">Skill Progress</div>
          <div className="space-y-3">
            {Object.entries(mockProfile.skillLevels).slice(0, 4).map(([skill, level]) => (
              <div key={skill} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">{skill}</span>
                  <span className="font-medium">{level}%</span>
                </div>
                <Progress value={level} className="h-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );

  return (
    <ChatLayout
      title="Skill Recommendation Engine"
      subtitle="AI-powered personalized learning recommendations based on your EiQ profile and goals"
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
      sidebar={sidebarNav}
      renderMessage={(message) => {
        if (message.metadata?.recommendations) {
          return (
            <div className="space-y-4">
              <p className="text-gray-900 dark:text-white">{message.content}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {message.metadata.recommendations.map((recommendation: any) => (
                  <div key={recommendation.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{recommendation.skillName}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{recommendation.category}</p>
                      </div>
                      <Badge 
                        variant={
                          recommendation.priority === 'critical' ? 'destructive' :
                          recommendation.priority === 'high' ? 'default' :
                          recommendation.priority === 'medium' ? 'secondary' : 'outline'
                        }
                        className="text-xs"
                      >
                        {recommendation.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {recommendation.reasoning}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-3">
                      <span>⏱️ {recommendation.estimatedTimeToComplete}</span>
                      <span>🎯 {recommendation.confidence}% confidence</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleStartLearning(recommendation.id)}
                      >
                        Start Learning
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddToWishlist(recommendation.id)}
                      >
                        <Star className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        return <p className="text-gray-900 dark:text-white">{message.content}</p>;
      }}
    />
  );
}
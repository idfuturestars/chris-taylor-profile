import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Play, Target, Trophy, Brain, Calculator, Beaker, Globe, MessageSquare, Users, Zap, Network } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatLayout from "@/components/layout/ChatLayout";
import { KnowledgeVisualizationTool } from "@/components/knowledge/KnowledgeVisualizationTool";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
    subject?: string;
    gradeLevel?: string;
    activities?: LearningActivity[];
    achievements?: Achievement[];
    confidence?: number;
  };
}

interface LearningActivity {
  id: string;
  title: string;
  subject: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  completionStatus: "not_started" | "in_progress" | "completed";
  description: string;
  ageGroup: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: Date;
  subject: string;
}

interface K12StudentProfile {
  name: string;
  gradeLevel: string;
  ageGroup: string;
  currentEiQScore: number;
  targetEiQScore: number;
  strongestSubjects: string[];
  improvementAreas: string[];
  learningStyle: string;
  weeklyGoalHours: number;
  completedActivities: number;
  totalActivities: number;
  currentStreak: number;
  achievements: Achievement[];
}

const mockProfile: K12StudentProfile = {
  name: "Alex",
  gradeLevel: "6th Grade",
  ageGroup: "6-8",
  currentEiQScore: 485,
  targetEiQScore: 550,
  strongestSubjects: ["Mathematics", "Science", "Technology"],
  improvementAreas: ["Reading Comprehension", "Creative Writing", "Social Studies"],
  learningStyle: "Visual & Interactive",
  weeklyGoalHours: 5,
  completedActivities: 24,
  totalActivities: 35,
  currentStreak: 7,
  achievements: [
    {
      id: "1",
      title: "Math Wizard",
      description: "Completed 10 algebra problems in a row",
      icon: "🧮",
      earnedDate: new Date(),
      subject: "Mathematics"
    },
    {
      id: "2", 
      title: "Science Explorer",
      description: "Finished 5 lab experiments",
      icon: "🔬",
      earnedDate: new Date(),
      subject: "Science"
    },
    {
      id: "3",
      title: "Learning Streak",
      description: "7 days of consistent learning",
      icon: "🔥",
      earnedDate: new Date(),
      subject: "General"
    }
  ]
};

const k12LearningTracks = [
  {
    id: "mathematics",
    name: "Mathematics & Logic",
    description: "Build strong mathematical foundations with AI-powered adaptive learning",
    focusAreas: ["Number Sense", "Algebra", "Geometry", "Statistics"],
    ageRanges: ["K-2: Counting & Shapes", "3-5: Basic Operations", "6-8: Pre-Algebra", "9-12: Advanced Math"],
    icon: "🔢",
    color: "bg-blue-500",
    subjects: ["Arithmetic", "Algebra", "Geometry", "Calculus"],
    activities: [
      {
        id: "math-1",
        title: "Linear Equations Practice",
        subject: "Mathematics",
        difficulty: "intermediate" as const,
        estimatedTime: "20 minutes",
        completionStatus: "in_progress" as const,
        description: "Solve linear equations with step-by-step AI guidance",
        ageGroup: "6-8"
      },
      {
        id: "math-2", 
        title: "Geometric Shapes Explorer",
        subject: "Mathematics",
        difficulty: "beginner" as const,
        estimatedTime: "15 minutes",
        completionStatus: "completed" as const,
        description: "Learn about shapes and their properties through interactive activities",
        ageGroup: "6-8"
      }
    ]
  },
  {
    id: "science",
    name: "Science & Discovery",
    description: "Explore the natural world through hands-on experiments and AI-guided discovery",
    focusAreas: ["Scientific Method", "Life Sciences", "Physical Sciences", "Earth Sciences"],
    ageRanges: ["K-2: Nature Exploration", "3-5: Simple Experiments", "6-8: Scientific Method", "9-12: Advanced Research"],
    icon: "🔬",
    color: "bg-green-500",
    subjects: ["Biology", "Chemistry", "Physics", "Environmental Science"],
    activities: [
      {
        id: "sci-1",
        title: "Water Cycle Investigation",
        subject: "Science",
        difficulty: "intermediate" as const,
        estimatedTime: "25 minutes",
        completionStatus: "not_started" as const,
        description: "Discover how water moves through Earth's systems",
        ageGroup: "6-8"
      }
    ]
  },
  {
    id: "technology",
    name: "Technology & Computing",
    description: "Learn computational thinking and digital skills for the modern world",
    focusAreas: ["Programming Basics", "Digital Citizenship", "Creative Computing", "Problem Solving"],
    ageRanges: ["K-2: Digital Awareness", "3-5: Basic Coding", "6-8: Programming Projects", "9-12: Advanced Computing"],
    icon: "💻",
    color: "bg-purple-500",
    subjects: ["Computer Science", "Digital Design", "Robotics", "AI Fundamentals"],
    activities: [
      {
        id: "tech-1",
        title: "Scratch Programming Basics",
        subject: "Technology",
        difficulty: "beginner" as const,
        estimatedTime: "30 minutes", 
        completionStatus: "completed" as const,
        description: "Create your first animated story with Scratch",
        ageGroup: "6-8"
      }
    ]
  },
  {
    id: "language-arts",
    name: "Language Arts & Communication",
    description: "Develop strong literacy and communication skills through interactive learning",
    focusAreas: ["Reading Comprehension", "Creative Writing", "Grammar", "Communication"],
    ageRanges: ["K-2: Basic Reading", "3-5: Reading Fluency", "6-8: Critical Analysis", "9-12: Advanced Writing"],
    icon: "📚",
    color: "bg-orange-500",
    subjects: ["Reading", "Writing", "Literature", "Communication"],
    activities: [
      {
        id: "lang-1",
        title: "Short Story Writing Workshop",
        subject: "Language Arts",
        difficulty: "intermediate" as const,
        estimatedTime: "35 minutes",
        completionStatus: "in_progress" as const,
        description: "Write and illustrate your own creative short story",
        ageGroup: "6-8"
      }
    ]
  }
];

export default function K12Dashboard() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hi ${mockProfile.name}! Welcome to your K-12 learning dashboard. You're doing great with your current EiQ score of ${mockProfile.currentEiQScore}! I see you're strongest in ${mockProfile.strongestSubjects.join(", ")}. Ready to continue your learning journey today?`,
      timestamp: new Date(),
      metadata: {
        gradeLevel: mockProfile.gradeLevel,
        activities: k12LearningTracks.flatMap((track: any) => track.activities || []).slice(0, 3),
        achievements: mockProfile.achievements.slice(0, 2),
        confidence: 94
      } as any
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const { toast } = useToast();

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/ai/k12-assistant", {
        message,
        studentProfile: mockProfile,
        selectedTrack,
        gradeLevel: mockProfile.gradeLevel
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

  const handleStartActivity = (activityId: string) => {
    const allActivities = k12LearningTracks.flatMap((track: any) => track.activities || []);
    const activity = allActivities.find((a: any) => a.id === activityId) as any;
    if (activity?.title) {
      toast({
        title: "Activity started",
        description: `Started ${activity.title}`,
      });
    }
  };

  const handleSelectTrack = (trackId: string) => {
    setSelectedTrack(trackId);
    const track = k12LearningTracks.find(t => t.id === trackId);
    if (track) {
      const message = `I want to focus on ${track.name} today. Can you show me activities for my grade level?`;
      handleSendMessage(message);
    }
  };

  // Create sidebar navigation
  const sidebarNav = (
    <ScrollArea className="flex-1">
      <div className="space-y-2 p-4">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎓</div>
          <div className="font-medium text-gray-900 dark:text-white">{mockProfile.name}'s Learning</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{mockProfile.gradeLevel} • {mockProfile.ageGroup} years</div>
          <div className="flex justify-center space-x-2 mt-2">
            <Badge variant="secondary" className="text-xs">EiQ: {mockProfile.currentEiQScore}</Badge>
            <Badge variant="outline" className="text-xs">Target: {mockProfile.targetEiQScore}</Badge>
          </div>
        </div>

        <div className="space-y-1">
          <Button
            variant="secondary"
            className="w-full justify-start"
          >
            <MessageSquare className="w-4 h-4 mr-3" />
            Chat with AI Tutor
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            <Target className="w-4 h-4 mr-3" />
            Today's Goals
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            <Trophy className="w-4 h-4 mr-3" />
            Achievements
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            <Users className="w-4 h-4 mr-3" />
            Study Buddies
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              const message = "Show me my knowledge visualization and learning insights!";
              handleSendMessage(message);
            }}
          >
            <Network className="w-4 h-4 mr-3" />
            Knowledge Map
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-900 dark:text-white">Learning Tracks</div>
          <div className="space-y-1">
            {k12LearningTracks.map((track) => (
              <Button
                key={track.id}
                variant={selectedTrack === track.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleSelectTrack(track.id)}
              >
                <span className="mr-3">{track.icon}</span>
                <span className="text-xs">{track.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-900 dark:text-white">Progress Today</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Activities</span>
              <span className="font-medium">{mockProfile.completedActivities}/{mockProfile.totalActivities}</span>
            </div>
            <Progress value={(mockProfile.completedActivities / mockProfile.totalActivities) * 100} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Weekly Goal</span>
              <span className="font-medium">3.5/{mockProfile.weeklyGoalHours}h</span>
            </div>
            <Progress value={70} className="h-2" />
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-900 dark:text-white">Strongest Subjects</div>
          <div className="space-y-1">
            {mockProfile.strongestSubjects.map((subject, index) => (
              <div key={index} className="text-sm text-green-600 dark:text-green-400 py-1">
                ⭐ {subject}
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-900 dark:text-white">Recent Achievements</div>
          <div className="space-y-2">
            {mockProfile.achievements.slice(0, 3).map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                <span className="text-lg">{achievement.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-900 dark:text-white truncate">{achievement.title}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{achievement.subject}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-900 dark:text-white">Learning Stats</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <div className="font-medium">{mockProfile.currentStreak}</div>
              <div className="text-gray-600 dark:text-gray-400">Day Streak</div>
            </div>
            <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <div className="font-medium">{mockProfile.achievements.length}</div>
              <div className="text-gray-600 dark:text-gray-400">Badges</div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );

  return (
    <ChatLayout
      title="K-12 Learning Dashboard"
      subtitle={`Personalized learning for ${mockProfile.gradeLevel} students • AI-powered educational journey`}
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
      sidebar={sidebarNav}
      renderMessage={(message) => {
        if (message.metadata?.activities) {
          return (
            <div className="space-y-4">
              <p className="text-gray-900 dark:text-white">{message.content}</p>
              
              {message.metadata.achievements && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Latest Achievements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {message.metadata.achievements.map((achievement: any) => (
                      <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{achievement.title}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recommended Activities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {message.metadata.activities.map((activity: any) => (
                    <div key={activity.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{activity.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{activity.subject}</p>
                        </div>
                        <Badge 
                          variant={
                            activity.difficulty === 'beginner' ? 'secondary' :
                            activity.difficulty === 'intermediate' ? 'default' : 'destructive'
                          }
                          className="text-xs"
                        >
                          {activity.difficulty}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                        {activity.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-3">
                        <span>⏱️ {activity.estimatedTime}</span>
                        <span>📊 {activity.ageGroup} years</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleStartActivity(activity.id)}
                          disabled={activity.completionStatus === 'completed'}
                        >
                          {activity.completionStatus === 'completed' ? 'Completed' :
                           activity.completionStatus === 'in_progress' ? 'Continue' : 'Start'}
                        </Button>
                        {activity.completionStatus === 'completed' && (
                          <div className="flex items-center">
                            <Trophy className="h-4 w-4 text-yellow-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }
        return <p className="text-gray-900 dark:text-white">{message.content}</p>;
      }}
    />
  );
}
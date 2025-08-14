import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, BookOpen, Target } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import ChatLayout from "@/components/layout/ChatLayout";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
    subject?: string;
    difficulty?: number;
    concepts?: string[];
    badges?: string[];
  };
}

interface TutoringSession {
  id: string;
  sessionType: "khan_style_lesson" | "adaptive_practice" | "project_mode" | "diagnostic";
  subject: string;
  gradeLevel: string;
  currentEiQScore: number;
  targetEiQScore: number;
  masteryLevel: string;
  learningGaps: string[];
  progressToday: number;
  progressOverall: number;
  focusAreas: string[];
  progressMetrics: {
    questionsAnswered: number;
    correctAnswers: number;
    hintsUsed: number;
    timeSpent: number;
  };
}

interface AITutor {
  id: string;
  name: string;
  avatar: string;
  personality: string;
  specializations: string[];
  greeting: string;
  teachingStyle: string;
}

const sampleSession: TutoringSession = {
  id: "session-1",
  sessionType: "khan_style_lesson",
  subject: "mathematics",
  gradeLevel: "6-8",
  currentEiQScore: 485,
  targetEiQScore: 550,
  masteryLevel: "familiar",
  learningGaps: ["algebraic reasoning", "word problems", "fraction operations"],
  progressToday: 65,
  progressOverall: 78,
  focusAreas: ["Linear Equations", "Problem Solving", "Mathematical Reasoning"],
  progressMetrics: {
    questionsAnswered: 12,
    correctAnswers: 9,
    hintsUsed: 3,
    timeSpent: 45
  }
};

const tutors: AITutor[] = [
  {
    id: "aria-math",
    name: "Aria",
    avatar: "🧮",
    personality: "encouraging",
    specializations: ["mathematics", "algebra", "geometry"],
    greeting: "Hi! I'm excited to help you master mathematics today!",
    teachingStyle: "step-by-step with encouragement"
  },
  {
    id: "elena-science",
    name: "Elena",
    avatar: "🔬",
    personality: "curious",
    specializations: ["science", "physics", "chemistry"],
    greeting: "Let's explore the fascinating world of science together!",
    teachingStyle: "inquiry-based learning"
  },
  {
    id: "marcus-lang",
    name: "Marcus",
    avatar: "📚",
    personality: "patient",
    specializations: ["language arts", "writing", "literature"],
    greeting: "Ready to dive into language and expand your communication skills?",
    teachingStyle: "socratic method"
  }
];

export default function AITutor() {
  const [selectedTutor] = useState(tutors[0]);
  const [sessionMode, setSessionMode] = useState<"lesson" | "practice" | "help">("lesson");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm Aria, your math tutor. I see you're working on improving your EiQ score from 485 to 550. That's fantastic! Let's start with some algebra practice. What would you like to work on today?",
      timestamp: new Date(),
      metadata: {
        badges: ["Mathematics", "Algebra", "EiQ Assessment"]
      }
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/ai/tutor-chat", {
        message,
        tutorId: selectedTutor.id,
        sessionMode,
        sessionData: sampleSession
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
      setIsTyping(false);
    },
    onError: () => {
      setIsTyping(false);
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
    setIsTyping(true);
    sendMessageMutation.mutate(message);
  };

  // Create sidebar navigation
  const sidebarNav = (
    <ScrollArea className="flex-1">
      <div className="space-y-2 p-4">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">{selectedTutor.avatar}</div>
          <div className="font-medium text-gray-900 dark:text-white">{selectedTutor.name}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">AI Learning Assistant</div>
          <div className="flex justify-center space-x-2 mt-2">
            <Badge variant="secondary" className="text-xs">EiQ: {sampleSession.currentEiQScore}</Badge>
            <Badge variant="outline" className="text-xs">Target: {sampleSession.targetEiQScore}</Badge>
          </div>
        </div>

        <div className="space-y-1">
          <Button
            variant={sessionMode === "lesson" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setSessionMode("lesson")}
          >
            <BookOpen className="w-4 h-4 mr-3" />
            Lesson Mode
          </Button>
          <Button
            variant={sessionMode === "practice" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setSessionMode("practice")}
          >
            <Target className="w-4 h-4 mr-3" />
            Practice Mode
          </Button>
          <Button
            variant={sessionMode === "help" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setSessionMode("help")}
          >
            <Lightbulb className="w-4 h-4 mr-3" />
            Help Mode
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-900 dark:text-white">Session Progress</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Today's Goal</span>
              <span className="font-medium">{sampleSession.progressToday}%</span>
            </div>
            <Progress value={sampleSession.progressToday} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
              <span className="font-medium">{sampleSession.progressOverall}%</span>
            </div>
            <Progress value={sampleSession.progressOverall} className="h-2" />
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-900 dark:text-white">Focus Areas</div>
          <div className="space-y-1">
            {sampleSession.focusAreas.map((area, index) => (
              <div key={index} className="text-sm text-gray-600 dark:text-gray-400 py-1">
                • {area}
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-900 dark:text-white">Session Stats</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <div className="font-medium">{sampleSession.progressMetrics.questionsAnswered}</div>
              <div className="text-gray-600 dark:text-gray-400">Questions</div>
            </div>
            <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <div className="font-medium">
                {Math.round((sampleSession.progressMetrics.correctAnswers / sampleSession.progressMetrics.questionsAnswered) * 100)}%
              </div>
              <div className="text-gray-600 dark:text-gray-400">Accuracy</div>
            </div>
            <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <div className="font-medium">{sampleSession.progressMetrics.hintsUsed}</div>
              <div className="text-gray-600 dark:text-gray-400">Hints</div>
            </div>
            <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <div className="font-medium">{sampleSession.progressMetrics.timeSpent}m</div>
              <div className="text-gray-600 dark:text-gray-400">Time</div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );

  return (
    <ChatLayout
      title={`AI Tutor - ${selectedTutor.name}`}
      subtitle={`Personalized learning in ${sessionMode} mode • ${selectedTutor.greeting}`}
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isTyping}
      sidebar={sidebarNav}
    />
  );
}
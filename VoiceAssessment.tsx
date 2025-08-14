import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mic, MicOff, Play, Square, Brain, Volume2, MessageSquare, Target, TrendingUp, AlertCircle, Zap } from "lucide-react";
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
    voiceAnalysis?: VoiceAnalysis;
    prompt?: VoicePrompt;
    audioFile?: string;
    confidence?: number;
    sessionType?: "practice" | "assessment" | "feedback";
  };
}

interface VoiceAnalysis {
  id: string;
  transcript: string;
  confidence: number;
  duration: number;
  aiAnalysis: {
    comprehension: number;
    articulation: number;
    vocabulary: number;
    fluency: number;
    technicalAccuracy: number;
    overallScore: number;
    insights: string[];
    recommendations: string[];
    skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  };
  timestamp: string;
}

interface VoicePrompt {
  id: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prompt: string;
  expectedKeywords: string[];
  timeLimit: number;
}

interface AssessmentSession {
  currentPrompt: VoicePrompt | null;
  isRecording: boolean;
  recordingStartTime: number | null;
  audioStream: MediaStream | null;
  mediaRecorder: MediaRecorder | null;
  recordedChunks: Blob[];
  completedAssessments: VoiceAnalysis[];
}

const voicePrompts: VoicePrompt[] = [
  {
    id: "tech_1",
    category: "Technical Communication",
    difficulty: "medium",
    prompt: "Explain how machine learning algorithms work and their applications in modern technology.",
    expectedKeywords: ["algorithm", "data", "training", "model", "prediction", "artificial intelligence"],
    timeLimit: 120
  },
  {
    id: "problem_1",
    category: "Problem Solving",
    difficulty: "hard",
    prompt: "Describe your approach to debugging a complex software issue in a production environment.",
    expectedKeywords: ["debugging", "logs", "testing", "reproduction", "systematic", "monitoring"],
    timeLimit: 180
  },
  {
    id: "leadership_1",
    category: "Leadership & Communication",
    difficulty: "medium",
    prompt: "Explain how you would motivate a team during a challenging project with tight deadlines.",
    expectedKeywords: ["motivation", "team", "communication", "goals", "support", "leadership"],
    timeLimit: 150
  },
  {
    id: "creative_1",
    category: "Creative Thinking",
    difficulty: "easy",
    prompt: "Describe an innovative solution to reduce environmental impact in daily activities.",
    expectedKeywords: ["innovation", "environment", "sustainable", "solution", "impact", "creative"],
    timeLimit: 120
  }
];

const mockAnalysis: VoiceAnalysis = {
  id: "1",
  transcript: "Machine learning algorithms are computational methods that allow computers to learn and make predictions from data without being explicitly programmed for every scenario...",
  confidence: 0.94,
  duration: 98,
  aiAnalysis: {
    comprehension: 88,
    articulation: 92,
    vocabulary: 85,
    fluency: 91,
    technicalAccuracy: 87,
    overallScore: 89,
    insights: [
      "Strong technical vocabulary and clear explanations",
      "Good pacing and natural speech flow",
      "Effective use of examples to illustrate concepts",
      "Minor areas for improvement in pronunciation consistency"
    ],
    recommendations: [
      "Practice technical term pronunciation",
      "Incorporate more real-world examples",
      "Work on concluding statements for stronger endings",
      "Consider pausing techniques for emphasis"
    ],
    skillLevel: 'advanced'
  },
  timestamp: new Date().toISOString()
};

export default function VoiceAssessment() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Welcome to the AI-powered voice assessment system! I'm here to help you improve your communication skills through intelligent voice analysis. Would you like to start with a practice session, take a formal assessment, or review previous results?",
      timestamp: new Date(),
      metadata: {
        sessionType: "practice",
        confidence: 95
      }
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<AssessmentSession>({
    currentPrompt: null,
    isRecording: false,
    recordingStartTime: null,
    audioStream: null,
    mediaRecorder: null,
    recordedChunks: [],
    completedAssessments: []
  });
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/ai/voice-assessment", {
        message,
        currentSession: session,
        completedAssessments: session.completedAssessments
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        processRecording(audioBlob);
      };

      setSession(prev => ({
        ...prev,
        isRecording: true,
        recordingStartTime: Date.now(),
        audioStream: stream,
        mediaRecorder,
        recordedChunks: chunks
      }));

      mediaRecorder.start();
      toast({
        title: "Recording started",
        description: "Speak clearly and naturally for best results",
      });
    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to continue",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (session.mediaRecorder && session.isRecording) {
      session.mediaRecorder.stop();
      session.audioStream?.getTracks().forEach(track => track.stop());
      
      setSession(prev => ({
        ...prev,
        isRecording: false,
        recordingStartTime: null,
        audioStream: null,
        mediaRecorder: null
      }));
    }
  };

  const processRecording = async (audioBlob: Blob) => {
    setIsLoading(true);
    
    // Simulate processing time
    setTimeout(() => {
      const newAnalysisMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Great! I've analyzed your voice recording. Here are the detailed results from our AI assessment:",
        timestamp: new Date(),
        metadata: {
          voiceAnalysis: mockAnalysis,
          confidence: 94
        }
      };
      
      setMessages(prev => [...prev, newAnalysisMessage]);
      setSession(prev => ({
        ...prev,
        completedAssessments: [...prev.completedAssessments, mockAnalysis]
      }));
      setIsLoading(false);
      
      toast({
        title: "Analysis complete",
        description: `Overall score: ${mockAnalysis.aiAnalysis.overallScore}/100`,
      });
    }, 3000);
  };

  const startPromptAssessment = (promptId: string) => {
    const prompt = voicePrompts.find(p => p.id === promptId);
    if (prompt) {
      setSession(prev => ({ ...prev, currentPrompt: prompt }));
      
      const promptMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: `Here's your assessment prompt. You have ${prompt.timeLimit} seconds to respond. Take a moment to think, then click the record button when ready.`,
        timestamp: new Date(),
        metadata: {
          prompt,
          sessionType: "assessment"
        }
      };
      
      setMessages(prev => [...prev, promptMessage]);
    }
  };

  // Create sidebar navigation
  const sidebarNav = (
    <ScrollArea className="flex-1">
      <div className="space-y-2 p-4">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎤</div>
          <div className="font-medium text-gray-900 dark:text-white">Voice Assessment</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">AI-Powered Communication Analysis</div>
          <div className="flex justify-center space-x-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              Sessions: {session.completedAssessments.length}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {session.isRecording ? "Recording..." : "Ready"}
            </Badge>
          </div>
        </div>

        <div className="space-y-1">
          <Button
            variant="secondary"
            className="w-full justify-start"
          >
            <MessageSquare className="w-4 h-4 mr-3" />
            Voice Assistant
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => startPromptAssessment("tech_1")}
          >
            <Target className="w-4 h-4 mr-3" />
            Quick Assessment
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            <TrendingUp className="w-4 h-4 mr-3" />
            Progress Analytics
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            <Brain className="w-4 h-4 mr-3" />
            Skill Insights
          </Button>
        </div>

        <Separator className="my-4" />

        {session.isRecording && (
          <div className="mb-4">
            <Alert>
              <Mic className="h-4 w-4" />
              <AlertDescription>
                Recording in progress... Speak clearly and naturally.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-900 dark:text-white">Assessment Categories</div>
          <div className="space-y-1">
            {voicePrompts.map((prompt) => (
              <Button
                key={prompt.id}
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => startPromptAssessment(prompt.id)}
                disabled={session.isRecording}
              >
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium truncate">{prompt.category}</div>
                  <div className="text-xs text-gray-500">{prompt.difficulty} • {prompt.timeLimit}s</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-900 dark:text-white">Recording Controls</div>
          <div className="space-y-2">
            {!session.isRecording ? (
              <Button
                className="w-full"
                onClick={startRecording}
                disabled={isLoading}
              >
                <Mic className="w-4 h-4 mr-2" />
                Start Recording
              </Button>
            ) : (
              <Button
                variant="destructive"
                className="w-full"
                onClick={stopRecording}
              >
                <MicOff className="w-4 h-4 mr-2" />
                Stop Recording
              </Button>
            )}
          </div>
        </div>

        <Separator className="my-4" />

        {session.completedAssessments.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-900 dark:text-white">Recent Scores</div>
            <div className="space-y-2">
              {session.completedAssessments.slice(-3).map((assessment, index) => (
                <div key={index} className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Assessment {index + 1}</span>
                    <Badge variant="secondary">{assessment.aiAnalysis.overallScore}/100</Badge>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {assessment.aiAnalysis.skillLevel}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-900 dark:text-white">Tips for Success</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <div>• Find a quiet environment</div>
            <div>• Speak clearly and at normal pace</div>
            <div>• Use specific examples</div>
            <div>• Structure your responses</div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );

  return (
    <ChatLayout
      title="Voice Assessment System"
      subtitle="AI-powered communication analysis and skill development through voice interaction"
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
      sidebar={sidebarNav}
      renderMessage={(message) => {
        if (message.metadata?.voiceAnalysis) {
          const analysis = message.metadata.voiceAnalysis;
          return (
            <div className="space-y-4">
              <p className="text-gray-900 dark:text-white">{message.content}</p>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Voice Analysis Results</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-white dark:bg-gray-700 rounded">
                    <div className="text-2xl font-bold text-blue-600">{analysis.aiAnalysis.comprehension}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Comprehension</div>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-700 rounded">
                    <div className="text-2xl font-bold text-green-600">{analysis.aiAnalysis.articulation}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Articulation</div>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-700 rounded">
                    <div className="text-2xl font-bold text-purple-600">{analysis.aiAnalysis.vocabulary}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Vocabulary</div>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-700 rounded">
                    <div className="text-2xl font-bold text-orange-600">{analysis.aiAnalysis.fluency}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Fluency</div>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-700 rounded">
                    <div className="text-2xl font-bold text-red-600">{analysis.aiAnalysis.technicalAccuracy}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Technical</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                    <div className="text-2xl font-bold text-yellow-600">{analysis.aiAnalysis.overallScore}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Overall</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Key Insights</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {analysis.aiAnalysis.insights.map((insight: any, index: number) => (
                        <li key={index}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recommendations</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {analysis.aiAnalysis.recommendations.map((rec: any, index: number) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <Badge variant="outline" className="capitalize">
                      {analysis.aiAnalysis.skillLevel} Level
                    </Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Duration: {analysis.duration}s
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (message.metadata?.prompt) {
          const prompt = message.metadata.prompt;
          return (
            <div className="space-y-4">
              <p className="text-gray-900 dark:text-white">{message.content}</p>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900 dark:text-white">{prompt.category}</h3>
                  <Badge variant="outline">{prompt.difficulty}</Badge>
                </div>
                
                <div className="p-3 bg-white dark:bg-gray-800 rounded border mb-3">
                  <p className="text-gray-900 dark:text-white font-medium">{prompt.prompt}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Time limit: {prompt.timeLimit} seconds</span>
                  <span>Expected keywords: {prompt.expectedKeywords.length}</span>
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
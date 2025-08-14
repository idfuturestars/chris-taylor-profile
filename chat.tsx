import { useState, useEffect } from "react";
import ChatLayout from "@/components/layout/ChatLayout";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, MessageSquare, Trash2, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  lastMessageAt: Date;
  messageCount: number;
}

export default function ChatPage() {
  const [activeSession, setActiveSession] = useState<string>("default");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessions] = useState<ChatSession[]>([
    {
      id: "default",
      title: "EiQ™ Assistant Chat",
      createdAt: new Date(),
      lastMessageAt: new Date(),
      messageCount: 0
    }
  ]);
  const { toast } = useToast();

  const generateAIResponse = (userContent: string): string => {
    const responses = [
      "I understand you're looking for help with your learning journey. Based on your message, I'd recommend starting with our baseline assessment to understand your current EiQ level.",
      "That's a great question! For personalized learning recommendations, I suggest exploring our adaptive learning tracks that adjust to your specific strengths and areas for improvement.",
      "I can help you with that! Our platform offers comprehensive assessments and AI-powered learning paths. Would you like me to guide you through the available options?",
      "Excellent! Based on your interests, I recommend checking out our cognitive assessment tools and personalized study recommendations. Each is designed to help you reach your learning goals.",
      "Thank you for reaching out! Our EiQ™ platform can help you identify your learning style and provide targeted educational resources. What specific area would you like to focus on?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async (content: string) => {
    setIsLoading(true);
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response delay
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: generateAIResponse(content),
        timestamp: new Date(),
        metadata: {
          suggestions: [
            "Try our baseline assessment",
            "Explore learning tracks",
            "Check your progress dashboard"
          ]
        }
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      
      toast({
        title: "Response generated",
        description: "EiQ™ Assistant is ready to help!",
      });
    }, 1500);
  };

  const handleNewChat = () => {
    setMessages([]);
    toast({
      title: "New chat started",
      description: "Ready to help with your learning journey!",
    });
  };

  // Sidebar content
  const sidebar = (
    <div className="flex flex-col h-full">
      {/* New Chat Button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Button 
          onClick={handleNewChat}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Chat Sessions */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Recent Chats
          </h3>
          
          {sessions.map((session: ChatSession) => (
              <div
                key={session.id}
                className={`p-3 rounded-lg cursor-pointer border transition-colors ${
                  activeSession === session.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                    : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveSession(session.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {session.title}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(session.lastMessageAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {session.messageCount} messages
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNewChat();
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          EiQ™ AI Assistant
        </div>
      </div>
    </div>
  );

  const renderMessage = (message: ChatMessage) => {
    return (
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {message.content}
        </p>
        {message.metadata?.suggestions && (
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Suggestions:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              {message.metadata.suggestions.map((suggestion: string, index: number) => (
                <li key={index}>• {suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <ChatLayout
      title="EiQ™ AI Assistant"
      subtitle="Get personalized help with assessments, learning paths, and academic guidance"
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
      sidebar={sidebar}
      renderMessage={renderMessage}
    />
  );
}
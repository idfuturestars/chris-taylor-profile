import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Brain, Send, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AIAssistantProps {
  userId: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function AIAssistant({ userId }: AIAssistantProps) {
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: conversations = [] } = useQuery({
    queryKey: ["/api/ai/conversations"],
    enabled: !!userId
  });

  const [currentMessages, setCurrentMessages] = useState<Message[]>([
    {
      role: "assistant", 
      content: "Hi! I'm EiQ MentorAI™, your personal AI tutor from EiQ™ powered by SikatLabs™. I specialize in personalized learning and career guidance for tech careers at Google, Meta, Apple, and Microsoft. I'm here to help you analyze your EiQ scores, plan your learning pathway, and achieve your career goals. What would you like to work on today?",
      timestamp: new Date().toISOString()
    }
  ]);

  const chatMutation = useMutation({
    mutationFn: async (data: { message: string; provider?: string; sessionId?: string }) => {
      const response = await apiRequest("POST", "/api/ai/chat", data);
      return response;
    },
    onSuccess: (data) => {
      setCurrentMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          timestamp: new Date().toISOString()
        }
      ]);
      setSessionId(data.conversation.id);
      queryClient.invalidateQueries({ queryKey: ["/api/ai/conversations"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || chatMutation.isPending) return;

    const userMessage: Message = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString()
    };

    setCurrentMessages(prev => [...prev, userMessage]);
    
    chatMutation.mutate({
      message: message.trim(),
      sessionId: sessionId || undefined
    });

    setMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Your AI Assistant</CardTitle>
            <p className="text-sm text-muted-foreground">Personalized learning companion</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chat Interface */}
        <div className="space-y-4 mb-4 h-64 overflow-y-auto bg-muted rounded-lg p-4">
          {currentMessages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                "flex space-x-3",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Brain className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={cn(
                  "rounded-lg p-3 max-w-xs",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-card border border-border"
                )}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {formatTime(msg.timestamp)}
                </p>
              </div>

              {msg.role === "user" && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-blue-500 text-white">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {chatMutation.isPending && (
            <div className="flex space-x-3">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Brain className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-card border border-border rounded-lg p-3 max-w-xs">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask your AI assistant..."
            className="flex-1 bg-input border-border"
            disabled={chatMutation.isPending}
          />
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={!message.trim() || chatMutation.isPending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
